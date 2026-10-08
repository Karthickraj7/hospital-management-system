import pydicom
from pydicom.dataset import Dataset, FileDataset
from pynetdicom import AE, evt, build_context, debug_logger
from pynetdicom.sop_class import (
    PatientRootQueryRetrieveInformationModelFind,
    PatientRootQueryRetrieveInformationModelMove,
    PatientRootQueryRetrieveInformationModelGet,
    StudyRootQueryRetrieveInformationModelFind,
    Verification,
    CTImageStorage,
    MRImageStorage,
    SecondaryCaptureImageStorage,
)
import os
import requests
from django.conf import settings
from pacs.models import Study, Series, DicomInstance, Patient
import json

class PACSClient:
    def __init__(self, pacs_host, pacs_port, pacs_aet, local_aet='HIMS_PACS'):
        self.pacs_host = pacs_host
        self.pacs_port = pacs_port
        self.pacs_aet = pacs_aet
        self.local_aet = local_aet
        self.ae = AE(ae_title=local_aet)
        
        # Add supported contexts
        self.ae.add_requested_context(Verification)
        self.ae.add_requested_context(PatientRootQueryRetrieveInformationModelFind)
        self.ae.add_requested_context(PatientRootQueryRetrieveInformationModelMove)
        self.ae.add_requested_context(CTImageStorage)
        self.ae.add_requested_context(MRImageStorage)
        self.ae.add_requested_context(SecondaryCaptureImageStorage)
    
    def verify_connection(self):
        """C-ECHO verification"""
        assoc = self.ae.associate(self.pacs_host, self.pacs_port, ae_title=self.pacs_aet)
        if assoc.is_established:
            status = assoc.send_c_echo()
            assoc.release()
            return status.Status == 0x0000
        return False
    
    def query_studies(self, patient_id=None, accession_number=None, date_range=None):
        """C-FIND query for studies"""
        ds = Dataset()
        ds.QueryRetrieveLevel = 'STUDY'
        ds.PatientID = patient_id or ''
        ds.AccessionNumber = accession_number or ''
        ds.StudyInstanceUID = ''
        ds.StudyDate = date_range or ''
        ds.StudyDescription = ''
        ds.PatientName = ''
        ds.ModalitiesInStudy = ''
        ds.NumberOfStudyRelatedSeries = ''
        
        results = []
        assoc = self.ae.associate(self.pacs_host, self.pacs_port, ae_title=self.pacs_aet)
        
        if assoc.is_established:
            responses = assoc.send_c_find(ds, PatientRootQueryRetrieveInformationModelFind)
            for (status, identifier) in responses:
                if status.Status in [0xFF00, 0xFF01]:  # Pending
                    results.append(identifier)
            assoc.release()
        
        return results
    
    def retrieve_study(self, study_instance_uid, save_path):
        """C-MOVE or C-GET to retrieve study"""
        ds = Dataset()
        ds.QueryRetrieveLevel = 'STUDY'
        ds.StudyInstanceUID = study_instance_uid
        
        assoc = self.ae.associate(self.pacs_host, self.pacs_port, ae_title=self.pacs_aet)
        
        if assoc.is_established:
            # Using C-MOVE
            responses = assoc.send_c_move(
                ds, 
                self.local_aet,
                PatientRootQueryRetrieveInformationModelMove
            )
            
            for (status, identifier) in responses:
                if status.Status == 0xFF00:
                    print(f"Pending: {status}")
                elif status.Status == 0x0000:
                    print("Success")
            
            assoc.release()
            return True
        return False

class OrthancClient:
    """Alternative: Use Orthanc REST API"""
    def __init__(self):
        self.base_url = settings.DICOM_SETTINGS['ORTHANC_URL']
        self.auth = (
            settings.DICOM_SETTINGS['ORTHANC_USERNAME'],
            settings.DICOM_SETTINGS['ORTHANC_PASSWORD']
        )
    
    def upload_dicom(self, file_path):
        """Upload DICOM to Orthanc"""
        with open(file_path, 'rb') as f:
            response = requests.post(
                f"{self.base_url}/instances",
                data=f,
                auth=self.auth
            )
        return response.json()
    
    def get_study(self, orthanc_id):
        """Get study details"""
        response = requests.get(
            f"{self.base_url}/studies/{orthanc_id}",
            auth=self.auth
        )
        return response.json()
    
    def find_studies(self, query):
        """Query studies using Orthanc's find API"""
        response = requests.post(
            f"{self.base_url}/tools/find",
            json=query,
            auth=self.auth
        )
        return response.json()
    
    def get_dicom_file(self, instance_id):
        """Retrieve DICOM file"""
        response = requests.get(
            f"{self.base_url}/instances/{instance_id}/file",
            auth=self.auth,
            stream=True
        )
        return response.content

class DicomParser:
    """Parse DICOM files and extract metadata"""
    
    @staticmethod
    def parse_file(file_path):
        """Parse DICOM file and return dataset"""
        try:
            ds = pydicom.dcmread(file_path)
            return ds
        except Exception as e:
            print(f"Error reading DICOM: {e}")
            return None
    
    @staticmethod
    def extract_metadata(ds):
        """Extract relevant metadata from DICOM dataset"""
        metadata = {
            'patient_id': getattr(ds, 'PatientID', ''),
            'patient_name': str(getattr(ds, 'PatientName', '')),
            'study_instance_uid': getattr(ds, 'StudyInstanceUID', ''),
            'series_instance_uid': getattr(ds, 'SeriesInstanceUID', ''),
            'sop_instance_uid': getattr(ds, 'SOPInstanceUID', ''),
            'accession_number': getattr(ds, 'AccessionNumber', ''),
            'study_date': getattr(ds, 'StudyDate', ''),
            'study_time': getattr(ds, 'StudyTime', ''),
            'study_description': getattr(ds, 'StudyDescription', ''),
            'series_number': getattr(ds, 'SeriesNumber', 0),
            'series_description': getattr(ds, 'SeriesDescription', ''),
            'instance_number': getattr(ds, 'InstanceNumber', 0),
            'modality': getattr(ds, 'Modality', 'OT'),
            'body_part': getattr(ds, 'BodyPartExamined', ''),
            'rows': getattr(ds, 'Rows', 0),
            'columns': getattr(ds, 'Columns', 0),
            'transfer_syntax': getattr(ds, 'file_meta', {}).get('TransferSyntaxUID', ''),
            'sop_class': getattr(ds, 'SOPClassUID', ''),
        }
        return metadata
    
    @staticmethod
    def save_to_db(metadata, file_path):
        """Save DICOM metadata to database"""
        # Create or get patient
        patient, _ = Patient.objects.get_or_create(
            patient_id=metadata['patient_id'],
            defaults={
                'patient_name': metadata['patient_name'],
            }
        )
        
        # Create or get study
        study, _ = Study.objects.get_or_create(
            study_instance_uid=metadata['study_instance_uid'],
            defaults={
                'patient': patient,
                'accession_number': metadata['accession_number'],
                'study_date': metadata['study_date'],
                'study_description': metadata['study_description'],
                'modality': metadata['modality'],
            }
        )
        
        # Create or get series
        series, _ = Series.objects.get_or_create(
            series_instance_uid=metadata['series_instance_uid'],
            defaults={
                'study': study,
                'series_number': metadata['series_number'],
                'series_description': metadata['series_description'],
                'modality': metadata['modality'],
                'body_part': metadata['body_part'],
            }
        )
        
        # Create instance
        instance, created = DicomInstance.objects.get_or_create(
            sop_instance_uid=metadata['sop_instance_uid'],
            defaults={
                'series': series,
                'instance_number': metadata['instance_number'],
                'file_path': file_path,
                'transfer_syntax_uid': metadata['transfer_syntax'],
                'sop_class_uid': metadata['sop_class'],
                'rows': metadata['rows'],
                'columns': metadata['columns'],
                'file_size': os.path.getsize(file_path),
            }
        )
        
        # Update series count
        if created:
            series.number_of_instances = DicomInstance.objects.filter(series=series).count()
            series.save()
        
        return instance