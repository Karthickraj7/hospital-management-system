from hl7apy import parser
from hl7apy.exceptions import HL7apyException
import socket
import threading
from django.conf import settings
from pacs.models import WorklistItem, Patient
from datetime import datetime

class HL7Server:
    def __init__(self, host='0.0.0.0', port=2575):
        self.host = host
        self.port = port
        self.running = False
    
    def start(self):
        self.running = True
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((self.host, self.port))
        server.listen(5)
        print(f"HL7 Server listening on {self.host}:{self.port}")
        
        while self.running:
            client, address = server.accept()
            print(f"Connection from {address}")
            thread = threading.Thread(target=self.handle_client, args=(client,))
            thread.start()
    
    def handle_client(self, client):
        try:
            data = client.recv(4096).decode('utf-8')
            if data:
                response = self.process_message(data)
                client.send(response.encode('utf-8'))
        except Exception as e:
            print(f"Error handling client: {e}")
        finally:
            client.close()
    
    def process_message(self, message):
        try:
            # Parse HL7 message
            msg = parser.parse_message(message)
            msg_type = msg.msh.msh_9.value if msg.msh.msh_9 else ''
            
            if 'ORM^O01' in msg_type:
                # Order message - create worklist item
                self.handle_order_message(msg)
                return self.create_ack(msg, 'AA')
            elif 'ORU^R01' in msg_type:
                # Result message
                self.handle_result_message(msg)
                return self.create_ack(msg, 'AA')
            else:
                return self.create_ack(msg, 'AR')
                
        except HL7apyException as e:
            print(f"HL7 Parsing error: {e}")
            return self.create_ack(None, 'AE')
    
    def handle_order_message(self, msg):
        """Process ORM^O01 - Create worklist item"""
        try:
            # Extract patient info
            pid = msg.pid
            patient_id = pid.pid_3.value if pid.pid_3 else ''
            patient_name = pid.pid_5.value if pid.pid_5 else ''
            birth_date = pid.pid_7.value if pid.pid_7 else None
            
            # Extract order info
            orc = msg.orc
            accession_number = orc.orc_3.value if orc.orc_3 else ''
            
            # Extract procedure info
            obr = msg.obr
            procedure = obr.obr_4.value if obr.obr_4 else ''
            scheduled_date = obr.obr_7.value if obr.obr_7 else None
            
            # Create or update patient
            patient, _ = Patient.objects.get_or_create(
                patient_id=patient_id,
                defaults={'patient_name': patient_name}
            )
            
            # Create worklist item
            WorklistItem.objects.create(
                patient=patient,
                accession_number=accession_number,
                requested_procedure=procedure,
                scheduled_date=datetime.strptime(scheduled_date, '%Y%m%d%H%M%S') if scheduled_date else datetime.now(),
                modality='CT',  # Extract from message
                station_ae_title='CT_ROOM_1',
                status='SCHEDULED'
            )
            
            print(f"Created worklist item for accession: {accession_number}")
            
        except Exception as e:
            print(f"Error processing order: {e}")
    
    def create_ack(self, original_msg, ack_code):
        """Create HL7 ACK message"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        ack = f"""MSH|^~\\&|HIMS_PACS|HOSPITAL|{original_msg.msh.msh_3.value if original_msg else 'SENDING_APP'}|{original_msg.msh.msh_4.value if original_msg else 'SENDING_FAC'}|{timestamp}||ACK|{timestamp}|P|2.3
MSA|{ack_code}|{original_msg.msh.msh_10.value if original_msg else '123456'}"""
        
        # Wrap in MLLP
        return f'\x0b{ack}\x1c\x0d'

# DICOM Modality Worklist SCP
from pynetdicom import AE, evt, debug_logger
from pynetdicom.sop_class import ModalityWorklistInformationFind

class ModalityWorklistSCP:
    def __init__(self, ae_title='HIMS_MWL', port=11113):
        self.ae_title = ae_title
        self.port = port
        self.ae = AE(ae_title)
        
        # Add Modality Worklist context
        self.ae.add_supported_context(ModalityWorklistInformationFind)
        
        # Add handler
        handlers = [(evt.EVT_C_FIND, self.handle_find)]
        self.handlers = handlers
    
    def handle_find(self, event):
        """Handle C-FIND request for modality worklist"""
        ds = event.identifier
        
        # Query database based on request
        worklist_items = WorklistItem.objects.filter(status='SCHEDULED')
        
        if 'ScheduledStationAETitle' in ds:
            worklist_items = worklist_items.filter(station_ae_title=ds.ScheduledStationAETitle)
        if 'ScheduledProcedureStepStartDate' in ds:
            date = ds.ScheduledProcedureStepStartDate
            worklist_items = worklist_items.filter(scheduled_date=date)
        if 'Modality' in ds:
            worklist_items = worklist_items.filter(modality=ds.Modality)
        
        for item in worklist_items:
            # Create response dataset
            response = Dataset()
            response.PatientName = item.patient.patient_name
            response.PatientID = item.patient.patient_id
            response.PatientBirthDate = item.patient.birth_date.strftime('%Y%m%d') if item.patient.birth_date else ''
            response.AccessionNumber = item.accession_number
            response.StudyInstanceUID = ''  # Generate or retrieve
            response.RequestedProcedureDescription = item.requested_procedure
            response.ScheduledProcedureStepSequence = [Dataset()]
            step = response.ScheduledProcedureStepSequence[0]
            step.ScheduledStationAETitle = item.station_ae_title
            step.ScheduledProcedureStepStartDate = item.scheduled_date.strftime('%Y%m%d')
            step.ScheduledProcedureStepStartTime = item.scheduled_time.strftime('%H%M%S') if item.scheduled_time else ''
            step.Modality = item.modality
            
            yield (0xFF00, response)
    
    def start(self):
        print(f"Modality Worklist SCP starting on port {self.port}")
        self.ae.start_server(('', self.port), evt_handlers=self.handlers)