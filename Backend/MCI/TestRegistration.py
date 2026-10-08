import json
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import  Q
from django.db.models import  Q, Count
from django.db import transaction
from PIL import Image
from io import BytesIO
import base64
# import magic
from PyPDF2 import PdfReader, PdfWriter
from Masters.models import *
from Workbench.models import Op_to_Ip_Convertion_Table
from Masters.Login import authenticate_request
from django.db import transaction
from PIL import Image
from io import BytesIO
import base64
# import magic
import filetype
from PyPDF2 import PdfReader, PdfWriter
from Workbench.models import Op_to_Ip_Convertion_Table
from datetime import datetime
from django.utils import timezone
from OutPatient.models import *
from datetime import date
from Workbench.models import *
from django.shortcuts import get_object_or_404
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to


# ABHA
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
import base64
from datetime import datetime
import uuid
import json
# from rest_framework.exceptions import IntegrityError
from .models import *
from django.db.models import Max
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from Ip_Workbench.models import *
from Workbench.Prescription import update_refer_doctor_data,update_op_ip_data,update_ot_request_data,update_follow_up_data

from Lab.models import *

from django.forms.models import model_to_dict
 
from datetime import timedelta
from django.utils.timezone import now

from OTManagement.models import *

from django.db.models import Case, When, IntegerField
from django.utils.timezone import now

today = timezone.now().date()

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)




def get_file_image(filedata):
    kind = filetype.guess(filedata)
                
    # Default to PDF if the type is undetermined
    contenttype1 = 'application/pdf'
    if kind and kind.mime == 'image/jpeg':
        contenttype1 = 'image/jpeg'
    elif kind and kind.mime == 'image/png':
        contenttype1 = 'image/png'

    # Return base64 encoded data with MIME type
    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'


 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MCI_Patient_RADIOLOGY_Registration(request):
        @transaction.atomic
        def generate_or_update_visit_id(patient, register_type):
            today = datetime.now().date()
 
            # Get the highest VisitId for today only
            max_visit_id_today = Patient_Visit_Detials.objects.filter(
                PatientId=patient,
                # created_at__date=today
            ).aggregate(max_id=Max('VisitId'))['max_id']
 
            # If no visits today, start from 1, otherwise increment
            next_visit_id = 1 if max_visit_id_today is None else max_visit_id_today + 1
 
            patient_visit = Patient_Visit_Detials.objects.create(
                PatientId=patient,
                VisitId=next_visit_id,
                RegisterType=register_type
            )
 
            return patient_visit.VisitId
 
        if request.method == 'POST':
                try:
                    data = json.loads(request.body)
                    # print(data,'data')
                   
                    # Extract and validate data
                    Raddocid = data.get('Raddocid')                 
                    patient_id = data.get('PatientId','')
                    AppointmentId = data.get('AppointmentId', '')                   
                    RegistrationId = data.get('RegistrationId', '')
                    register_type = data.get('RegisterType', '') #visit purpose
 
                    VisitType = data.get('VisitType', '')
 
                    Speciality = data.get('Speciality', '')
                    DoctorName = data.get('DoctorName', '')
                    TokenNo = data.get('TokenNo', '')
                    Complaint = data.get('Complaint', '')
                    IsMLC = data.get('IsMLC', '')
                    IsReferral = data.get('IsReferral', '')
                    ReferralSource = data.get('ReferralSource', '')
                    ReferredBy = data.get('ReferredBy', '')
                    NextToKinName = data.get('NextToKinName', '')
                    Relation = data.get('Relation', '')
                    RelativePhoneNo = data.get('RelativePhoneNo', '')
               
                    patient_category = data.get('PatientCategory', '')
                    insurance_name = data.get('InsuranceName', '')
                    insurance_type = data.get('InsuranceType', '')
               
                    client_name = data.get('ClientName', '')
                    client_type = data.get('ClientType', '')
                    client_employee_id = data.get('ClientEmployeeId', '')
                    client_employee_designation = data.get('ClientEmployeeDesignation', '')
                    client_employee_relation = data.get('ClientEmployeeRelation', '')
               
                    CorporateName = data.get('CorporateName', '')
                    CorporateType = data.get('CorporateType', '')
                    CorporateEmployeeId = data.get('CorporateEmployeeId', '')
                    CorporateEmployeeDesignation = data.get('CorporateEmployeeDesignation', '')
                    CorporateEmployeeRelation = data.get('CorporateEmployeeRelation', '')
               
                    employee_id = data.get('EmployeeId', '')
                    employee_relation = data.get('EmployeeRelation', '')
               
                    doctor_id = data.get('DoctorId', '')
                    doctor_relation = data.get('DoctorRelation', '')
                   
                    donation_type = data.get('DonationType', '')
                    ServiceCategory = data.get('ServiceCategory', '')
                    ServiceSubCategory = data.get('ServiceSubCategory', '')
                   
               
                    created_by = data.get('Created_by', '')
 
                    Testname_arr = data.get('SubtestNoArr', [])
                    Appoint_list = data.get('Appoint_list',[])
                    RegisterData = data.get('RegisterData',{})
                    packages = data.get('packages',[])
                    SelectedTest = data.get("SelectedTest", [])
                    Remarks = data.get("Remarks")
 
                    labvisit = data.get('labvisit','')
                    labdoctor = data.get('labdoctor','')
 
                    radiologydoctor = data.get('radiologydoctor','')
 
                    MHCdoctor = data.get('MHCdoctor','')
                    MHCvisit = data.get('MHCvisit','')
                    daycaredoctor = data.get('daycaredoctor','')
                    selecteddaycare = data.get('selecteddaycare',[])
 
                    ABHA = RegisterData.get('ABHA','')
                    Title = RegisterData.get('Title','')
                    FirstName = RegisterData.get('FirstName','')
                    MiddleName = RegisterData.get('MiddleName','')
                    SurName = RegisterData.get('SurName','')
                    Gender = RegisterData.get('Gender','')
                    MaritalStatus = RegisterData.get('MaritalStatus','')
                    SpouseName = RegisterData.get('SpouseName','')
                    FatherName = RegisterData.get('FatherName','')
                    DOB = RegisterData.get('DOB','')
                    Age = RegisterData.get('Age','')
                    PhoneNo = RegisterData.get('PhoneNo','')
                    Email = RegisterData.get('Email','')
                    BloodGroup = RegisterData.get('BloodGroup','')
                    Occupation = RegisterData.get('Occupation','')
                    Nationality = RegisterData.get('Nationality','')
                    UHIDType = RegisterData.get('UHIDType','')
                    UHIDNo = RegisterData.get('UHIDNo','')
                    PatientType = RegisterData.get('PatientType','')
                    Pincode = RegisterData.get('Pincode','')
                    DoorNo = RegisterData.get('DoorNo','')
                    Street = RegisterData.get('Street','')
                    Area = RegisterData.get('Area','')
                    City = RegisterData.get('City','')
                    District = RegisterData.get('District','')
                    State = RegisterData.get('State','')
                    Country = RegisterData.get('Country','')
                    Religion = RegisterData.get('Religion','')
 
 
                    print('Patient_RADIOLOGY_Registration')
 
                    Titleins = Title_Detials.objects.get(Title_Id=Title) if Title else None
                    BloodGroupins = BloodGroup_Detials.objects.get(BloodGroup_Id = BloodGroup) if BloodGroup else None
                    Religionins = Religion_Detials.objects.get(Religion_Id = Religion) if Religion else None
 
                    location = data.get("location")
                    package_arr = data.get('PackageArr', [])
                    favourites_arr = data.get('FavouritesArr', [])
                    indivitual_arr = data.get('IndivitualArr', [])
                    specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
                    doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=radiologydoctor) if radiologydoctor else None
                    referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
                    employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
                    doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
                    Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
                    Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
                    Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
                    Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
 
                    print('Patient_RADIOLOGY_Registration')
                   
 
 
                    patient = None
                    patient_visit_id = None
                   
                    patient = Patient_Detials.objects.get(pk=patient_id)

                    if RegistrationId :
 
                        print(RegistrationId,'RegistrationId')
 
                        OP_Patient = MCI_Patient_Appointment_Registration_Detials.objects.get(OPNo=RegistrationId)
 
                        # OP_Patient.PatientId = patient
                        # OP_Patient.VisitPurpose = register_type
                        # OP_Patient.IsMLC = IsMLC
                        # OP_Patient.IsReferral = IsReferral
                        # OP_Patient.NextToKinName = NextToKinName
                        # OP_Patient.Relation = Relation
                        # OP_Patient.RelativePhNo = RelativePhoneNo
                        # OP_Patient.PatientCategory = patient_category
                        # OP_Patient.InsuranceName = Insurance_instance
                        # OP_Patient.InsuranceType = insurance_type
                        # OP_Patient.ClientName = Client_instance
                        # OP_Patient.ClientType = client_type
                        # OP_Patient.ClientEmployeeId = client_employee_id
                        # OP_Patient.ClientEmployeeDesignation = client_employee_designation
                        # OP_Patient.ClientEmployeeRelation = client_employee_relation
                        # OP_Patient.CorporateName = Corporate_instance
                        # OP_Patient.CorporateType = CorporateType
                        # OP_Patient.CorporateEmployeeId = CorporateEmployeeId
                        # OP_Patient.CorporateEmployeeDesignation = CorporateEmployeeDesignation
                        # OP_Patient.CorporateEmployeeRelation = CorporateEmployeeRelation
                        # OP_Patient.EmployeeId = employee_instance
                        # OP_Patient.EmployeeRelation = employee_relation
                        # OP_Patient.DoctorId = doctor_instance
                        # OP_Patient.DoctorRelation = doctor_relation
                        # OP_Patient.DonationType = Donation_instance
                        # OP_Patient.created_by = created_by
                        # OP_Patient.save()
 
 
                        # print('premkkkkkkkkkk')
 
                        # referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
 
                        # print('premkkkkkkkkkk',referral)
 
                        # if referral:
                        #     referral.OP_Register_Id=OP_Patient
                        #     referral.ReferralRegisteredBy=register_type
                        #     referral.ReferralSource=ReferralSource
                        #     referral.ReferredBy=referral_doctor_instance
                        #     referral.save()
 
                        # rad_doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Raddocid)
                        # rad_doc_ins.PrimaryDoctor = doctor_name_instance
                        # rad_doc_ins.Specialization = specialization_instance
                        # rad_doc_ins.VisitType = "WALK-IN"
                        # rad_doc_ins.Complaint = 'Radiologytest'
                        # rad_doc_ins.TokenNo = None
                        # rad_doc_ins.save()
 
                        # print(rad_doc_ins,'rad_doc_ins')
 
                        # patient_details = MCI_Patient_Detials.objects.get(pk=patient_id)
                        # patient_details.Title  = Titleins
                        # patient_details.FirstName  = FirstName
                        # patient_details.MiddleName  = MiddleName
                        # patient_details.SurName  = SurName
                        # patient_details.Gender  = Gender
                        # patient_details.MaritalStatus  = MaritalStatus
                        # patient_details.SpouseName  = SpouseName
                        # patient_details.FatherName  = FatherName
                        # patient_details.DOB  = DOB
                        # patient_details.Age  = Age
                        # patient_details.PhoneNo  = PhoneNo
                        # patient_details.Email  = Email
                        # patient_details.BloodGroup  = BloodGroupins
                        # patient_details.Occupation  = Occupation
                        # patient_details.Religion  = Religionins
                        # patient_details.Nationality  = Nationality
                        # patient_details.UniqueIdType  = UHIDType
                        # patient_details.UniqueIdNo  = UHIDNo
                        # patient_details.PatientType  = PatientType
                        # patient_details.ABHA  = ABHA
                        # patient_details.DoorNo  = DoorNo
                   
                        # patient_details.Street  = Street
                        # patient_details.Area  = Area
                        # patient_details.City  = City
                        # patient_details.District  = District
                        # patient_details.State  = State
                        # patient_details.Country  = Country
                        # patient_details.Pincode  = Pincode
                        # patient_details.Status = 'Registered'
   
                        # patient_details.save()
 
                        for testname in Testname_arr:
                            Radiologyid = testname.get('Radiologyid', None)
                            TestCode = testname.get('TestCode', None)
 
                            if MCI_Radiology_Request_Details.objects.filter(OP_Register_Id=OP_Patient,TestCode=Radiologyid,SubTestCode=TestCode).exists():
 
                                continue
 
                            if Radiologyid and TestCode:  # Ensure required fields are present
                                MCI_Radiology_Request_Details.objects.create(
                                    RegisterType = 'WALK-IN',
                                    OP_Register_Id= OP_Patient ,
                                    IP_Register_Id=  None,
                                    Casuality_Register_Id= None,
                                    Diagnosis_Register_Id=  None,
                                    TestCode=Radiologyid,
                                    Status = 'Paid',
                                    Doctorid = doctor_name_instance,
                                    SubTestCode=TestCode,
                                    created_by=created_by
                                )
 
 
 
 
                        return JsonResponse({'success': 'Patient Radiology registered Updated successfully','RegistrationId':OP_Patient.Registration_Id})
                                   

 
                except Exception as e:
       
                        return JsonResponse({'error':str(e)})

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MCI_Patient_LAB_Registration(request):  
        @transaction.atomic
        def generate_or_update_visit_id(patient, register_type):
            today = datetime.now().date()
 
            # Get the highest VisitId for today only
            max_visit_id_today = Patient_Visit_Detials.objects.filter(
                PatientId=patient,
                # created_at__date=today
            ).aggregate(max_id=Max('VisitId'))['max_id']
 
            # If no visits today, start from 1, otherwise increment
            next_visit_id = 1 if max_visit_id_today is None else max_visit_id_today + 1
 
            patient_visit = Patient_Visit_Detials.objects.create(
                PatientId=patient,
                VisitId=next_visit_id,
                RegisterType=register_type
            )
 
            return patient_visit.VisitId
   
   
   
        if request.method == 'POST':
                try:
                    data = json.loads(request.body)
                    # print(data,'data')
                   
                    # Extract and validate data
                    Labdocid = data.get('Labdocid')
                   
                    patient_id = data.get('PatientId','')
                    print(patient_id,'patient_id')
 
                    AppointmentId = data.get('AppointmentId', '')
                    print(AppointmentId,'1----------------AppointmentId')
                   
                    RegistrationId = data.get('RegistrationId', '')
                    print(RegistrationId,'RegistrationId1111111111')
                   
                    register_type = data.get('RegisterType', '') #visit purpose
                    print(register_type,'register_type')
 
                    VisitType = data.get('VisitType', '')
 
                    Speciality = data.get('Speciality', '')
                    DoctorName = data.get('DoctorName', '')
                    TokenNo = data.get('TokenNo', '')
                    Complaint = data.get('Complaint', '')
                    IsMLC = data.get('IsMLC', '')
                    IsReferral = data.get('IsReferral', '')
                    ReferralSource = data.get('ReferralSource', '')
                    ReferredBy = data.get('ReferredBy', '')
                    NextToKinName = data.get('NextToKinName', '')
                    Relation = data.get('Relation', '')
                    RelativePhoneNo = data.get('RelativePhoneNo', '')
               
                    patient_category = data.get('PatientCategory', '')
                    insurance_name = data.get('InsuranceName', '')
                    insurance_type = data.get('InsuranceType', '')
               
                    client_name = data.get('ClientName', '')
                    client_type = data.get('ClientType', '')
                    client_employee_id = data.get('ClientEmployeeId', '')
                    client_employee_designation = data.get('ClientEmployeeDesignation', '')
                    client_employee_relation = data.get('ClientEmployeeRelation', '')
               
                    CorporateName = data.get('CorporateName', '')
                    CorporateType = data.get('CorporateType', '')
                    CorporateEmployeeId = data.get('CorporateEmployeeId', '')
                    CorporateEmployeeDesignation = data.get('CorporateEmployeeDesignation', '')
                    CorporateEmployeeRelation = data.get('CorporateEmployeeRelation', '')
               
                    employee_id = data.get('EmployeeId', '')
                    employee_relation = data.get('EmployeeRelation', '')
               
                    doctor_id = data.get('DoctorId', '')
                    doctor_relation = data.get('DoctorRelation', '')
                   
                    donation_type = data.get('DonationType', '')
                    ServiceCategory = data.get('ServiceCategory', '')
                    ServiceSubCategory = data.get('ServiceSubCategory', '')
                   
               
                    created_by = data.get('Created_by', '')
 
                    Testname_arr = data.get('SubtestNoArr', [])
                    Appoint_list = data.get('Appoint_list',[])
                    RegisterData = data.get('RegisterData',{})
                    packages = data.get('packages',[])
                    SelectedTest = data.get("SelectedTest", [])
                    DeletedTest = data.get("DeletedTest",[])
                    Remarks = data.get("Remarks")
 
                    labvisit = data.get('labvisit','')
                    labdoctor = data.get('labdoctor','')

                    LabrequestID = data.get('LabrequestID')
 
                    MHCdoctor = data.get('MHCdoctor','')
                    MHCvisit = data.get('MHCvisit','')
                    daycaredoctor = data.get('daycaredoctor','')
                    selecteddaycare = data.get('selecteddaycare',[])
 
                    ABHA = RegisterData.get('ABHA','')
                    Title = RegisterData.get('Title','')
                    FirstName = RegisterData.get('FirstName','')
                    MiddleName = RegisterData.get('MiddleName','')
                    SurName = RegisterData.get('SurName','')
                    Gender = RegisterData.get('Gender','')
                    MaritalStatus = RegisterData.get('MaritalStatus','')
                    SpouseName = RegisterData.get('SpouseName','')
                    FatherName = RegisterData.get('FatherName','')
                    DOB = RegisterData.get('DOB','')
                    Age = RegisterData.get('Age','')
                    PhoneNo = RegisterData.get('PhoneNo','')
                    Email = RegisterData.get('Email','')
                    BloodGroup = RegisterData.get('BloodGroup','')
                    Occupation = RegisterData.get('Occupation','')
                    Nationality = RegisterData.get('Nationality','')
                    UHIDType = RegisterData.get('UHIDType','')
                    UHIDNo = RegisterData.get('UHIDNo','')
                    PatientType = RegisterData.get('PatientType','')
                    Pincode = RegisterData.get('Pincode','')
                    DoorNo = RegisterData.get('DoorNo','')
                    Street = RegisterData.get('Street','')
                    Area = RegisterData.get('Area','')
                    City = RegisterData.get('City','')
                    District = RegisterData.get('District','')
                    State = RegisterData.get('State','')
                    Country = RegisterData.get('Country','')
                    Religion = RegisterData.get('Religion','')
                    
 
                   
 
                    Titleins = Title_Detials.objects.get(Title_Id=Title) if Title else None
                    BloodGroupins = BloodGroup_Detials.objects.get(BloodGroup_Id = BloodGroup) if BloodGroup else None
                    Religionins = Religion_Detials.objects.get(Religion_Id = Religion) if Religion else None
 
                    location = data.get("location")
                    
                    print(location,'location666666666')
                    package_arr = data.get('PackageArr', [])
                    favourites_arr = data.get('FavouritesArr', [])
                    indivitual_arr = data.get('IndivitualArr', [])
                    specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
                    doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=labdoctor) if labdoctor else None
                    referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
                    employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
                    doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
                    Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
                    Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
                    Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
                    Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
                   
 
 
                    patient = None
                    patient_visit_id = None
                   
                    patient = Patient_Detials.objects.get(pk=patient_id)

                    if RegistrationId :
 
                        print(RegistrationId,'RegistrationId')
 
                        OP_Patient = MCI_Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
 
                        # OP_Patient.PatientId = patient
                        # OP_Patient.VisitPurpose = register_type
                        # OP_Patient.IsMLC = IsMLC
                        # OP_Patient.IsReferral = IsReferral
                        # OP_Patient.NextToKinName = NextToKinName
                        # OP_Patient.Relation = Relation
                        # OP_Patient.RelativePhNo = RelativePhoneNo
                        # OP_Patient.PatientCategory = patient_category
                        # OP_Patient.InsuranceName = Insurance_instance
                        # OP_Patient.InsuranceType = insurance_type
                        # OP_Patient.ClientName = Client_instance
                        # OP_Patient.ClientType = client_type
                        # OP_Patient.ClientEmployeeId = client_employee_id
                        # OP_Patient.ClientEmployeeDesignation = client_employee_designation
                        # OP_Patient.ClientEmployeeRelation = client_employee_relation
                        # OP_Patient.CorporateName = Corporate_instance
                        # OP_Patient.CorporateType = CorporateType
                        # OP_Patient.CorporateEmployeeId = CorporateEmployeeId
                        # OP_Patient.CorporateEmployeeDesignation = CorporateEmployeeDesignation
                        # OP_Patient.CorporateEmployeeRelation = CorporateEmployeeRelation
                        # OP_Patient.EmployeeId = employee_instance
                        # OP_Patient.EmployeeRelation = employee_relation
                        # OP_Patient.DoctorId = doctor_instance
                        # OP_Patient.DoctorRelation = doctor_relation
                        # OP_Patient.DonationType = Donation_instance
                        # OP_Patient.created_by = created_by
                        # OP_Patient.save()
 
 
                        # print('premkkkkkkkkkk')
 
                        # referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
 
                        # print('premkkkkkkkkkk',referral)
 
                        # if referral:
                        #     referral.OP_Register_Id=OP_Patient
                        #     referral.ReferralRegisteredBy=register_type
                        #     referral.ReferralSource=ReferralSource
                        #     referral.ReferredBy=referral_doctor_instance
                        #     referral.save()
 
                        # rad_doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Labdocid)
                        # rad_doc_ins.PrimaryDoctor = doctor_name_instance
                        # rad_doc_ins.Specialization = specialization_instance
                        # rad_doc_ins.VisitType = "WALK-IN"
                        # rad_doc_ins.Complaint = 'Labtest'
                        # rad_doc_ins.TokenNo = None
                        # rad_doc_ins.save()
 
                        # print(rad_doc_ins,'rad_doc_ins')
 
                        # patient_details = Patient_Detials.objects.get(pk=patient_id)
                        # patient_details.Title  = Titleins
                        # patient_details.FirstName  = FirstName
                        # patient_details.MiddleName  = MiddleName
                        # patient_details.SurName  = SurName
                        # patient_details.Gender  = Gender
                        # patient_details.MaritalStatus  = MaritalStatus
                        # patient_details.SpouseName  = SpouseName
                        # patient_details.FatherName  = FatherName
                        # patient_details.DOB  = DOB
                        # patient_details.Age  = Age
                        # patient_details.PhoneNo  = PhoneNo
                        # patient_details.Email  = Email
                        # patient_details.BloodGroup  = BloodGroupins
                        # patient_details.Occupation  = Occupation
                        # patient_details.Religion  = Religionins
                        # patient_details.Nationality  = Nationality
                        # patient_details.UniqueIdType  = UHIDType
                        # patient_details.UniqueIdNo  = UHIDNo
                        # patient_details.PatientType  = PatientType
                        # patient_details.ABHA  = ABHA
                        # patient_details.DoorNo  = DoorNo
                   
                        # patient_details.Street  = Street
                        # patient_details.Area  = Area
                        # patient_details.City  = City
                        # patient_details.District  = District
                        # patient_details.State  = State
                        # patient_details.Country  = Country
                        # patient_details.Pincode  = Pincode
                        # patient_details.Status = 'Registered'
   
                        # patient_details.save()

                        register_kwargs = {'RegisterType': 'WALK-IN'}
                        # OP_Patient = MCI_Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
                        register_kwargs['OP_Register_Id'] = OP_Patient


                        Location_instance = Location_Detials.objects.get(Location_Id=location)
                        lab_request = MCI_Lab_Request_Details.objects.create(
                            created_by=created_by,
                            Location=Location_instance,
                            Remarks=Remarks,
                            **register_kwargs,
                        )

                        for test in SelectedTest:
 
                            SubDepartment_Code = test.get("sub_department_id")
                            testType = test.get("testType")
                            Department_Code = test.get("department_id")
                            Code = test.get("Code")
    
                            print(testType)
    
                            NextItemIDGet = MCI_Lab_Request_Items_Details.objects.annotate(
                                item_id_int=Cast("Item_Id", IntegerField())
                            ).aggregate(Max("item_id_int"))["item_id_int__max"]
                            NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1
    
                        
                            print(NextItemID,'NextItemID')
    
                            Dcode = None
                            lab_request_item_data = {}

                            if testType == 'Individual':
    
                                print(testType,'testType')
    
                                Dcode = Test_Descriptions.objects.get(Test_Code = Code)
    
    
                                lab_request_item_data = {
                                    "Item_Id":NextItemID,
                                    "Request": lab_request,
                                    "TestType": testType,
                                    "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
                                    "Department_Code_id": Dcode.department.Department_Code,
                                    }
    
                            elif testType == 'Group':
                                print(testType,'testType')
    
                                Gcode = Group_Master.objects.get(Group_Code = Code)
                                print("dyeueueu",Gcode)
                            
                                lab_request_item_data = {
                                    "Item_Id":NextItemID,
                                    "Request": lab_request,
                                    "TestType": testType,
                                    "Department_Code_id": Gcode.Department.department.Department_Code,
                                    "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
                                    }
    
                            elif testType == 'Offers':
                                print(testType, 'testType')
                                Pcode = OfferPackageMaster.objects.get(package_code=Code)
                                department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
                                lab_department = Lab_Department_Detials.objects.get(Department_Code=department.department_id)

                                print("---------", Pcode.department_name)
                                print("---------", Pcode.pk)
                                print("----IDDDDDDD-----", Pcode.offer_package_id)

                                lab_request_item_data = {
                                    "Item_Id": NextItemID,
                                    "Request": lab_request,
                                    "TestType": testType,
                                    "Department_Code_id": lab_department.pk,
                                    "SubDepartment_Code_id": department.pk,
                                }
    

    
                            # Insert into appropriate columns based on testType
                            if testType == "Individual":
                                lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
                            elif testType == "Profiles" or testType == "Group":
                                lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
                            elif testType == "Profiles" or testType == "Offers":
                                lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code

                            # Save the item
                            MCI_Lab_Request_Items_Details.objects.create(**lab_request_item_data)
 

                        return JsonResponse({'success': 'Patient Lab registered Updated successfully','RegistrationId':OP_Patient.Registration_Id})
                                   
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    patient_visit_id = generate_or_update_visit_id(patient, register_type)
 
                    Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
           
                    # VisitType = VisitType,
                    # Specialization = specialization_instance,
                    # PrimaryDoctor = doctor_name_instance,
                    # TokenNo = TokenNo,
                    # Complaint = Complaint,
 
                    PatientId = patient,
                    VisitId = patient_visit_id,  
                    VisitPurpose = register_type,
                    # ApptoRegId=Appointment_ins,
                    IsMLC = IsMLC,
                    IsReferral = IsReferral,
                    NextToKinName = NextToKinName,
                    Relation = Relation,
                    RelativePhNo = RelativePhoneNo,
                    PatientCategory = patient_category,
                   
                    InsuranceName = Insurance_instance,
                    InsuranceType = insurance_type,
                    ClientName = Client_instance,
                    ClientType = client_type,
                    ClientEmployeeId = client_employee_id,
                    ClientEmployeeDesignation = client_employee_designation,
                    ClientEmployeeRelation = client_employee_relation,
                   
                    CorporateName = Corporate_instance,
                    CorporateType = CorporateType,
                    CorporateEmployeeId = CorporateEmployeeId,
                    CorporateEmployeeDesignation = CorporateEmployeeDesignation,
                    CorporateEmployeeRelation = CorporateEmployeeRelation,
 
                    EmployeeId = employee_instance,
                    EmployeeRelation = employee_relation,
                    DoctorId = doctor_instance,
                    DoctorRelation = doctor_relation,
                    DonationType = Donation_instance,
                   
                    created_by = created_by,
                   
                    )
                    Patient_OP.save()
                    
                    print(Patient_OP,'Patient_OP1234')
 
                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                        Registration_Id = Patient_OP,
                        PrimaryDoctor = doctor_name_instance,
                        Specialization = specialization_instance,
                        VisitType = "WALK-IN",
                        Complaint = 'Labtest',
                        TokenNo = None,
                    )
                    Multile_Doctor.save()
                    
                    
                    print(Multile_Doctor,'Multile_DoctorMultile_Doctor')

                    # if AppointmentId:
                    #         PatientsId_In_Appointment_ins = Appointment_Request_List.objects.filter(
                    #             appointment_id=AppointmentId, PatientId=patient_id
                    #         )
                    #         print('333333--------i')
                    # else:
                    #         PatientsId_In_Appointment_ins = Appointment_Request_List.objects.filter(appointment_id=AppointmentId)
                    #         print('444444444444-------1')
                            
                    # print('qqqqqqqqqqqqqqqq1',PatientsId_In_Appointment_ins)
                    # print("----qqqqqqqqqqq---------------op")


                    # patient_appointment = PatientsId_In_Appointment_ins.first()
                    # if patient_appointment:
                    #     patient_appointment.status = "OpRegistered"
                    #     patient_appointment.save()

                    
                    # print("------qqqqqqqqqqq-------------op")
 
                    # PatientsId_In_Appointment_ins.update(status="OpRegistered")
 
                    # PatientsId_In_Appointment_ins.status = "OpRegistered"
                    # PatientsId_In_Appointment_ins.save()
 
                   
                    # if patient_id and AppointmentId:
                    #     PatientsId_In_Appointment_ins = Appointment_Request_List.objects.filter(
                    #         appointment_id=AppointmentId, PatientId=patient_id
                    #     )
                    # else:
                    #     PatientsId_In_Appointment_ins = Appointment_Request_List.objects.filter(appointment_id=AppointmentId)
 
                    # print('PatientsId_In_Appointment_ins--------------1',PatientsId_In_Appointment_ins)
                    # print("----11111111111---------------op")
 
 
                    # patient_appointment = PatientsId_In_Appointment_ins.first()
                    # if patient_appointment:
                    #     patient_appointment.status = "OpRegistered"
                    #     patient_appointment.save()
 
                   
                    # print("-------------------op")
 
                    patient_details = Patient_Detials.objects.get(pk=patient_id)
                    patient_details.Title  = Titleins
                    patient_details.FirstName  = FirstName
                    patient_details.MiddleName  = MiddleName
                    patient_details.SurName  = SurName
                    patient_details.Gender  = Gender
                    patient_details.MaritalStatus  = MaritalStatus
                    patient_details.SpouseName  = SpouseName
                    patient_details.FatherName  = FatherName
                    patient_details.DOB  = DOB
                    patient_details.Age  = Age
                    patient_details.PhoneNo  = PhoneNo
                    patient_details.Email  = Email
                    patient_details.BloodGroup  = BloodGroupins
                    patient_details.Occupation  = Occupation
                    patient_details.Religion  = Religionins
                    patient_details.Nationality  = Nationality
                    patient_details.UniqueIdType  = UHIDType
                    patient_details.UniqueIdNo  = UHIDNo
                    patient_details.PatientType  = PatientType
                    patient_details.ABHA  = ABHA
                    patient_details.DoorNo  = DoorNo
                   
                    patient_details.Street  = Street
                    patient_details.Area  = Area
                    patient_details.City  = City
                    patient_details.District  = District
                    patient_details.State  = State
                    patient_details.Country  = Country
                    patient_details.Pincode  = Pincode
                    patient_details.Status = 'Registered'
 
                    patient_details.save()
 
                    print('pd')
                    referral = Patient_Referral_Detials.objects.create(
                    OP_Register_Id = Patient_OP,
                    ReferralRegisteredBy = register_type,
                    ReferralSource = ReferralSource,
                    ReferredBy = referral_doctor_instance,
               
                    )
                    referral.save()

 
                    registration_id = Patient_OP.pk
 
                    print(registration_id,'registration_id')
                    print(register_type,'register_type')
                    rad_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
 
                    print(SelectedTest,'SelectedTest')
 
                    if registration_id is None or register_type not in ['OP', 'IP', 'Casuality','LAB']:
                            return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})
 
                        # Prepare the arguments based on the register type
                    register_kwargs = {'RegisterType': register_type}
                    if register_type == 'OP' or register_type == 'LAB':
 
                        print('register_typeregister_type')
                        try:
                            op_register_instance = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
                            print(op_register_instance,'op_register_instance')
                            register_kwargs['OP_Register_Id'] = op_register_instance
                        except Patient_Appointment_Registration_Detials.DoesNotExist:
                            return JsonResponse({'warn': 'OP Registration ID not found'})
 
                    elif register_type == 'IP':
                        try:
                            ip_register_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
                            register_kwargs['IP_Register_Id'] = ip_register_instance
                        except Patient_IP_Registration_Detials.DoesNotExist:
                            return JsonResponse({'warn': 'IP Registration ID not found'})
 
                    elif register_type == 'Casuality':
                        try:
                            casuality_register_instance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=registration_id)
                            register_kwargs['Casuality_Register_Id'] = casuality_register_instance
                        except Patient_Casuality_Registration_Detials.DoesNotExist:
                            return JsonResponse({'warn': 'Casuality Registration ID not found'})
 
                        # Insert into Lab_Request_Details
                    
                    Location_instance = Location_Detials.objects.get(Location_Id=location)
                    lab_request = Lab_Request_Details.objects.create(
                        created_by=created_by,
                        Location=Location_instance,
                        Remarks=Remarks,
                        **register_kwargs,
                    )
 
                    # Loop through SelectedTest and insert into Lab_Request_Items_Details
                    for test in SelectedTest:
 
                        print(test,'test')
                        SubDepartment_Code = test.get("sub_department_id")
                        testType = test.get("testType")
                        Department_Code = test.get("department_id")
                        Code = test.get("Code")
 
                        print(testType)
 
                        NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
                            item_id_int=Cast("Item_Id", IntegerField())
                        ).aggregate(Max("item_id_int"))["item_id_int__max"]
                        NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1
 
                       
                        print(NextItemID,'NextItemID')
 
                        Dcode = None
                        lab_request_item_data = {}
                        if testType == 'Individual':
 
                            print(testType,'testType')
 
                            Dcode = Test_Descriptions.objects.get(Test_Code = Code)
 
 
                            lab_request_item_data = {
                                "Item_Id":NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
                                "Department_Code_id": Dcode.department.Department_Code,
                                }
 
                        elif testType == 'Group':
                            print(testType,'testType')
 
                            Gcode = Group_Master.objects.get(Group_Code = Code)
                            print("dyeueueu",Gcode)
                         
                            lab_request_item_data = {
                                "Item_Id":NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "Department_Code_id": Gcode.Department.department.Department_Code,
                                "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
                                }
 
                        elif testType == 'Offers':
                            print(testType, 'testType')
                            Pcode = OfferPackageMaster.objects.get(package_code=Code)
                            department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
                            lab_department = Lab_Department_Detials.objects.get(Department_Code=department.department_id)

                            print("---------", Pcode.department_name)
                            print("---------", Pcode.pk)
                            print("----IDDDDDDD-----", Pcode.offer_package_id)

                            lab_request_item_data = {
                                "Item_Id": NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "Department_Code_id": lab_department.pk,
                                "SubDepartment_Code_id": department.pk,
                            }
 
 
 
                        print(NextItemID,'NextItemID')
 
                       
                       
 
 
                        print(lab_request_item_data,'lab_request_item_data')
 
                        # Insert into appropriate columns based on testType
                        if testType == "Individual":
                            lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
                        elif testType == "Profiles" or testType == "Group":
                            lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
                        elif testType == "Profiles" or testType == "Offers":
                            lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code

                        # Save the item
                        Lab_Request_Items_Details.objects.create(**lab_request_item_data)
 
 
                    return JsonResponse({'success': 'Patient Appointment registered successfully','RegistrationId':Patient_OP.Registration_Id})
 
                except Exception as e:
       
                    return JsonResponse({'error':str(e)})
 
 
# @csrf_exempt
# @require_http_methods(["GET"])
# def get_MCI_OP_patient_details(request):
#     try:
       
#         RegistrationId = request.GET.get('RegistrationId')
        
#         print(RegistrationId,'RegistrationId')
#         # Start with all records
#         queryset = MCI_Patient_Appointment_Registration_Detials.objects.get(Registration_Id = RegistrationId)
        
#         referral_details = None

#         # Check for referral details by OP, IP, and Emergency Register IDs
#         try:
#             referral_details = MCI_Patient_Referral_Detials.objects.filter(
#                 OP_Register_Id__Registration_Id=RegistrationId
#             ).first() or MCI_Patient_Referral_Detials.objects.filter(
#                 IP_Register_Id__Registration_Id=RegistrationId
#             ).first() or MCI_Patient_Referral_Detials.objects.filter(
#                 Emergency_Register_Id__Registration_Id=RegistrationId
#             ).first()

#             print(referral_details,'referral_details---------')
#         except MCI_Patient_Referral_Detials.DoesNotExist:
#             referral_details = None
#         print(queryset,'queryset')
#         print(queryset.DoctorId,'querysetDoctorId-------')
#         # Serialize the filtered queryset
        
           
#             # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
#         appointment_dict = {
            
#             'PatientProfile': get_file_image(queryset.PatientId.Patient_profile) if queryset.PatientId.Patient_profile else None,
#             'PatientId': queryset.PatientId.PatientId,
#             'PatientName': f"{queryset.PatientId.Title.Title_Name}.{queryset.PatientId.FirstName} {queryset.PatientId.MiddleName} {queryset.PatientId.SurName}",
#             'Title': queryset.PatientId.Title.pk,
#             'FirstName': queryset.PatientId.FirstName,
#             'MiddleName': queryset.PatientId.MiddleName,
#             'SurName': queryset.PatientId.SurName,
#             'PhoneNo': queryset.PatientId.PhoneNo,
#             'Age': queryset.PatientId.Age,
#             'Gender': queryset.PatientId.Gender,
#             'MaritalStatus': queryset.PatientId.MaritalStatus,
#             'SpouseName': queryset.PatientId.SpouseName,
#             'FatherName': queryset.PatientId.FatherName,
#             'DOB': queryset.PatientId.DOB,
#             'Email': queryset.PatientId.Email,
#             'BloodGroup': queryset.PatientId.BloodGroup.BloodGroup_Id if queryset.PatientId.BloodGroup else None,
#             'Occupation': queryset.PatientId.Occupation,
#             'Religion': queryset.PatientId.Religion.Religion_Id if queryset.PatientId.Religion else None,
#             'Nationality': queryset.PatientId.Nationality,
#             'UHIDType': queryset.PatientId.UniqueIdType,
#             'UHIDNo': queryset.PatientId.UniqueIdNo,
#             'DoorNo': queryset.PatientId.DoorNo,
#             'Street': queryset.PatientId.Street,
#             'Area': queryset.PatientId.Area,
#             'City': queryset.PatientId.City,
#             'District': queryset.PatientId.District,
#             'State': queryset.PatientId.State,
#             'Country': queryset.PatientId.Country,
#             'Pincode': queryset.PatientId.Pincode,
#             'PatientType': queryset.PatientId.PatientType,
#             'ABHA': queryset.PatientId.ABHA,
#             'AppointmentId': queryset.AppointmentId,
#             'VisitId': queryset.VisitId,
#             'CardValidity': queryset.CardValidity,
#             # 'Complaint': queryset.Complaint,
#             'IsMLC': queryset.IsMLC,
#             # 'VisitType': queryset.VisitType,
#             # 'Complaint': queryset.Complaint,
#             'NextToKinName': queryset.NextToKinName,
#             # 'Flagging': Flagging_name,
#             # 'FlaggingColour': Flagging_color,
#             'IsReferral': queryset.IsReferral,
#             'Relation': queryset.Relation,
#             'RelativePhNo': queryset.RelativePhNo,
#             'PatientCategory': queryset.PatientCategory,
#             'InsuranceName': queryset.InsuranceName.pk if queryset.InsuranceName else None,
#             'InsuranceType': queryset.InsuranceType,
#             'ClientName': queryset.ClientName.pk if queryset.ClientName else None,
#             'ClientType': queryset.ClientType,
#             'ClientEmployeeId': queryset.ClientEmployeeId,
#             'ClientEmployeeDesignation': queryset.ClientEmployeeDesignation,
#             'ClientEmployeeRelation': queryset.ClientEmployeeRelation,
           
#             'CorporateName': queryset.CorporateName.Corporate_Id if queryset.CorporateName else None,
#             'CorporateType': queryset.CorporateType,
#             'CorporateEmployeeId': queryset.CorporateEmployeeId,
#             'CorporateEmployeeDesignation': queryset.CorporateEmployeeDesignation,
#             'CorporateEmployeeRelation': queryset.CorporateEmployeeRelation,
        
#             'EmployeeId': queryset.EmployeeId.pk if queryset.EmployeeId else None,
#             'EmployeeRelation': queryset.EmployeeRelation,
#             'Doctor_Id': queryset.DoctorId.pk if queryset.DoctorId else None,
#             'DoctorRelation': queryset.DoctorRelation,
#             'DonationType': queryset.DonationType.Donation_Id if queryset.DonationType else None,
#             'ServiceCategory': queryset.ServiceCategory,
#             'ServiceSubCategory': queryset.ServiceSubCategory,
#             # 'TokenNo': queryset.TokenNo,
#             'Status': queryset.Status,
#             'RegistrationId': queryset.pk,
#             # 'PrimaryDoctor': queryset.PrimaryDoctor.pk if queryset.PrimaryDoctor else None,

#             # 'SpecilizationId': queryset.Specialization.Speciality_Id if queryset.Specialization else None,
#             # 'DoctorName': f"{queryset.PrimaryDoctor.Tittle.Title_Name}.{queryset.PrimaryDoctor.First_Name} {queryset.PrimaryDoctor.Last_Name}" if queryset.PrimaryDoctor else None,
#             # 'Speciality': queryset.Specialization.pk if queryset.Specialization else None,
            
#             'Multiple_Doc': [],
#         }

#         if referral_details:
#             appointment_dict.update({
#                 'ReferralSource': referral_details.ReferralSource,
#                 'ReferredBy': referral_details.ReferredBy.Doctor_ID if referral_details.ReferredBy else None,
#                 'ReferredByShortName': f"{referral_details.ReferredBy.Tittle.Title_Name}.{referral_details.ReferredBy.First_Name} {referral_details.ReferredBy.Last_Name}" if referral_details.ReferredBy else None,
#             })

#         # Fetch Multiple Doctor Appointments
#         multiple_doc_records = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id=RegistrationId)

#         if multiple_doc_records.exists():
#             appointment_dict['Multiple_Doc'] = [
#                 {
#                     'id':doc.pk,
#                     'Complaint': doc.Complaint,
#                     'DoctorId': doc.PrimaryDoctor.pk if doc.PrimaryDoctor else None,
#                     'Specialization': doc.Specialization.Speciality_Name if doc.Specialization else "",
#                     'SpecializationId': str(doc.Specialization.Speciality_Id) if doc.Specialization else "",
#                     'DoctorName': f"{doc.PrimaryDoctor.Tittle.Title_Name if doc.PrimaryDoctor and doc.PrimaryDoctor.Tittle else ''}."
#                                 f"{doc.PrimaryDoctor.First_Name if doc.PrimaryDoctor else ''} {doc.PrimaryDoctor.Last_Name if doc.PrimaryDoctor else ''}",
#                     'VisitType': doc.VisitType,  # ✅ Fixed missing comma
#                     'TokenNo': str(doc.TokenNo),
#                 }
#                 for doc in multiple_doc_records
#             ]

#             # Consolidated fields
#             appointment_dict['Complaint'] = ', '.join(
#                 [doc['Complaint'] for doc in appointment_dict['Multiple_Doc'] if doc['Complaint']]
#             ) or ""

#             appointment_dict['TokenNo'] = ', '.join(
#                 [str(doc['TokenNo']) for doc in appointment_dict['Multiple_Doc'] if doc['TokenNo']]
#             ) or ""  


#             appointment_dict['Specialization'] = ', '.join(
#                 [doc['Specialization'] for doc in appointment_dict['Multiple_Doc'] if doc['Specialization']]
#             ) or ""
            
#             appointment_dict['SpecializationId'] = ', '.join(
#                 [doc['SpecializationId'] for doc in appointment_dict['Multiple_Doc'] if doc['SpecializationId']]
#             ) or ""
            
#             appointment_dict['DoctorId'] = ', '.join(
#                 [doc['DoctorId'] for doc in appointment_dict['Multiple_Doc'] if doc['DoctorId']]
#             ) or ""

#             appointment_dict['DoctorName'] = ', '.join(
#                 [doc['DoctorName'] for doc in appointment_dict['Multiple_Doc'] if doc['DoctorName']]
#             ) or ""



#         print(appointment_dict,'appointment_register_data')
#         return JsonResponse(appointment_dict, safe=False)

#     except Exception as e:
#         print('Error---',{e})
#         return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Request_Detailslink_paid(request):
    try:
        def get_file_image(filedata):
            if filedata is None:
                return None
            try:
                kind = filetype.guess(filedata)
                # List of supported MIME types
                supported_mime_types = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'application/msword',  # For .doc files
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
                ]
                contenttype1 = 'application/pdf'
                if kind:
                    if kind.mime in supported_mime_types:
                        contenttype1 = kind.mime
                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            except Exception as e:
                print(f"Error processing file: {e}")
                return None
 
        registration_id = request.GET.get('Register_Id', None)
        RegisterType = request.GET.get('RegisterType', None)


 
 
        if registration_id is None or RegisterType is None:
            return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)
 
        # Fetch registration details based on RegisterType
        if RegisterType == "OP" or RegisterType == 'WALK-IN':
            registration_details = MCI_Patient_Appointment_Registration_Detials.objects.select_related('PatientId').get(Registration_Id=registration_id)
            radiology_requests = MCI_Radiology_Request_Details.objects.filter(OP_Register_Id_id=registration_details.pk, RegisterType=RegisterType, Status__in=['Paid', 'Due'],Service_Status="Pending")
    
        else:
            return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)
 
        print(registration_details, 'registration_details', radiology_requests, 'radiology_requests')
 
        # Extract patient details
        patient_id = registration_details.PatientId.PatientId
        patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
        phone_number = registration_details.PatientId.PhoneNo
 
        response_data_no = []
        index = 1
 
        for req in radiology_requests:
            # Fetch related TestName_Details and RadiologyNames_Details
            print(req.SubTestCode,'req.SubTestCode11111')
            testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode.strip()).first()
            radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
 
            print(testname, 'testname', radiologyname, 'radiologyname')
 
            if radiologyname and testname:
                response_data_no.append({
                    'id': index,
                    'PatientId': patient_id,
                    'Radiology_RequestId': req.Radiology_RequestId,
                    'PatientName': patient_name,
                    'PhoneNumber': phone_number,
                    'Radiologyid': radiologyname.Radiology_Id,
                    'RadiologyName': radiologyname.Radiology_Name,
                    'TestCode': testname.Test_Code,
                    'TestName': testname.Test_Name,
                    'ChooseFile': get_file_image(testname.Report_file),
                    'Amount': testname.Amount,
                    'BookingFees': testname.BookingFees,
                })
                index += 1
 
                print(response_data_no,'response_data_no111111')
 
        # Return the list in the response
        return JsonResponse({
            'IsSubTestNo': response_data_no
        }, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Fake_Radiology_Complete_Details_Link(request):
    def validate_and_process_file(file):
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            return compressed_data, len(compressed_data)

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            return output.getvalue(), len(output.getvalue())

        if file:
            try:
                file_data = file.split(',')[1]
                file_content = base64.b64decode(file_data)
                file_size = len(file_content)

                max_size_mb = 5
                if file_size > max_size_mb * 1024 * 1024:
                    return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'}, status=400)

                file_type = get_file_type(file)

                if file_type in ['image/jpeg', 'image/png']:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, _ = compress_image(image)
                    return compressed_image_data

                elif file_type == 'application/pdf':
                    compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
                    return compressed_pdf_data

                else:
                    return JsonResponse({'warn': 'Unsupported file format'}, status=400)

            except Exception as e:
                return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

        return None

 
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'warn': 'Request body is empty'}, status=400)
            
            data = json.loads(request.body)
            print("complete Radiology", data)
            RegistrationId = data.get('Registration_Id') 
            RegisterType = data.get('RegisterType', None)
            ReportDate = data.get('ReportDate', '')
            ReportTime = data.get('ReportTime', '')
            RadiologistName = data.get('RadiologistName', '')
            TechnicianName = data.get('TechnicianName', '')
            Report = data.get('Report', '')
            ReportHandoOvered = data.get('ReportHandoOvered', '')
            RelativeName = data.get('RelativeName', '')
            Radiology_RequestID = data.get('Requestid')  
            ChooseFileOne = data.get('ChooseFileOne', '')
            ChooseFileTwo = data.get('ChooseFileTwo', '')
            ChooseFileThree = data.get('ChooseFileThree', '')
            created_by = data.get('created_by', '')
            Radiology_CompleteId = data.get('Radiology_CompleteId','') if data.get('Radiology_CompleteId')  else data.get('completeId')
            html_content = data.get('html') or data.get('htmlcontent') or ''
            subdepartment= data.get('subdepartment','')
            fileName = data.get('ReportName','')
            TestCode = data.get('TestCode')
            Document_Id = data.get('Document_Id')
            fromm = data.get('from', '')
            SubTestCode = data.get('SubTestCode', None)
            doctorId = data.get('radiologistid','')
            
            encoded_html = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')
            # print("Encoded HTML:", encoded_html)
            # print("complete Radiology", RegistrationId, Radiology_RequestID, RegisterType)

            
            department_instance = RadiologyNames_Details.objects.filter(Radiology_Name=subdepartment).first() if subdepartment else None

            # Correcting the typo in variable name
            processed_files = {
                'ChooseFileOne': validate_and_process_file(ChooseFileOne) if ChooseFileOne else None,
                'ChooseFileTwo': validate_and_process_file(ChooseFileTwo) if ChooseFileTwo else None,
                'ChooseFileThree': validate_and_process_file(ChooseFileThree) if ChooseFileThree else None,
            }
            
            if any(isinstance(value, JsonResponse) for value in processed_files.values()):
                return next(value for value in processed_files.values() if isinstance(value, JsonResponse))
            
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing Registration Id'}, status=200)
            if not Radiology_RequestID:
                return JsonResponse({'warn': 'Missing Request Id'}, status=200)
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'}, status=200)
            
            # Fetching registration instance based on RegisterType
            registration_instance = None
            if RegisterType == "OP" or RegisterType == "WALK-IN":
                registration_instance = MCI_Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            
            if not registration_instance:
                return JsonResponse({'warn': 'Invalid registration ID or RegisterType'})
            
            if SubTestCode:
                Radiology_Request_ins = MCI_Radiology_Request_Details.objects.filter(pk=Radiology_RequestID, SubTestCode=SubTestCode).first()
            else:
                Radiology_Request_ins = MCI_Radiology_Request_Details.objects.filter(pk=Radiology_RequestID, SubTestCode=TestCode).first()

            # If Radiology_CompleteId exists, update the entry
            if Radiology_CompleteId and Radiology_CompleteId !="" :
                try:
                    Radiology_Complete_ins = MCI_Radiology_Complete_Details.objects.get(pk=Radiology_CompleteId)
                except MCI_Radiology_Complete_Details.DoesNotExist:
                    return JsonResponse({'warn': 'RadiologyTest not found'}, status=404)
                
                if fromm == 'doctor':
                    print(type(encoded_html))
                    Radiology_Complete_ins.html_content = encoded_html
                    Radiology_Request_ins.Service_Status = "Completed"
                    Radiology_Request_ins.save()
                else:
                    # Updating fields
                    Radiology_Complete_ins.Radiology_CompleteId = Radiology_CompleteId
                    Radiology_Complete_ins.RegisterType = RegisterType
                    Radiology_Complete_ins.OP_Register_Id = registration_instance if RegisterType == "OP" else None
                    Radiology_Complete_ins.IP_Register_Id = registration_instance if RegisterType == "IP" else None
                    Radiology_Complete_ins.Casuality_Register_Id = registration_instance if RegisterType == "Casuality" else None
                    Radiology_Complete_ins.Radiology_RequestId = Radiology_Request_ins
                    Radiology_Complete_ins.ReportDate = ReportDate
                    Radiology_Complete_ins.ReportTime = ReportTime
                    Radiology_Complete_ins.RadiologistName = RadiologistName
                    Radiology_Complete_ins.Technician_Name = TechnicianName
                    Radiology_Complete_ins.Report = Report
                    Radiology_Complete_ins.Report_fileone = processed_files['ChooseFileOne']
                    Radiology_Complete_ins.Report_filetwo = processed_files['ChooseFileTwo']
                    Radiology_Complete_ins.Report_filethree = processed_files['ChooseFileThree']
                    Radiology_Complete_ins.Report_HandOverTo = ReportHandoOvered
                    Radiology_Complete_ins.RelativeName = RelativeName
                    Radiology_Complete_ins.html_content = encoded_html
                    
                    Radiology_Request_ins.Service_Status = "Anaylzed"
                    Radiology_Request_ins.save()

                Radiology_Complete_ins.save()

                return JsonResponse({'success': 'Report Entry Updated successfully'}, status=200)
            
            # Else, create a new Radiology Complete entry
            else:
                Radiology_Complete_ins = MCI_Radiology_Complete_Details.objects.create(
                    RegisterType=RegisterType,
                    OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                    IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                    Radiology_RequestId=Radiology_Request_ins,
                    ReportDate=ReportDate,
                    ReportTime=ReportTime,
                    RadiologistName=RadiologistName,
                    Technician_Name=TechnicianName,
                    Report=Report,
                    Report_fileone=processed_files['ChooseFileOne'],
                    Report_filetwo=processed_files['ChooseFileTwo'],
                    Report_filethree=processed_files['ChooseFileThree'],
                    Report_HandOverTo=ReportHandoOvered,
                    RelativeName=RelativeName,
                    Createdby=created_by,
                    department = department_instance,
                    doctorId = doctorId,
                    html_content = encoded_html,
                    fileName = fileName,
                    TestCode = TestCode,
                    Document_Id = Document_Id
                )
                Radiology_Request_ins.Service_Status = "Completed"
                Radiology_Request_ins.save()
                Radiology_Complete_ins.save()
                return JsonResponse({'success': 'Report Entry Saved successfully'}, status=200)
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)

            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)

            # Fetch registration details and corresponding radiology requests
            if RegisterType == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)

            # Function to encode files
          

            def get_file_image(filedata):
                try:
                    kind = filetype.guess(filedata)
                    
                    # Supported MIME types
                    supported_mime_types = [
                        'application/pdf',
                        'image/jpeg',
                        'image/png'
                    ]
                    
                    if kind and kind.mime in supported_mime_types:
                        contenttype = kind.mime
                    else:
                        contenttype = 'application/octet-stream'  # Default for unknown types
                    
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype};base64,{base64.b64encode(filedata).decode("utf-8")}'
                
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None


            # Prepare response data
            response_data = []
            for index, req in enumerate(radiology_requests, start=1):
                # Fetch the required names based on IsSubTest
                test_code = req.Radiology_RequestId.TestCode
                subtest_code = req.Radiology_RequestId.SubTestCode
                radiology_id = None
                radiology_name = None
                if req.Radiology_RequestId.IsSubTest == 'Yes':
                    testname = TestName_Details.objects.get(Test_Code=test_code)
                    # subtestname = SubTest_Details.objects.get(SubTest_Code=subtest_code)
                    radiology_id = testname.Radiology_Id
                    radiology_name = radiology_id.Radiology_Name if radiology_id else None
                else:  # If IsSubTest is 'No'
                    testname = TestName_Details.objects.get(Test_Code=subtest_code)
                    subtestname = None
                    radiology_name_obj = RadiologyNames_Details.objects.get(Radiology_Id=test_code)
                    radiology_name = radiology_name_obj.Radiology_Name if radiology_name_obj else None
                                

                            
                
                current_month = datetime.now()
                # formatted_date = current_month.strftime("%d-%m-%Y")
                formatted_date = current_month.strftime("%Y-%m-%d")
                report_date = None
                if isinstance(req.ReportDate, str) and req.ReportDate:
                    try:
                        report_date = datetime.fromisoformat(req.ReportDate).strftime('%d-%m-%Y')
                    except ValueError:
                        print(f"Invalid ReportDate format: {req.ReportDate}")  # Debug print

    # Format ReportTime
                report_time = None
                if isinstance(req.ReportTime, str) and req.ReportTime:
                    try:
                        report_time = datetime.fromisoformat(req.ReportTime).strftime('%H:%M')
                    except ValueError:
                        print(f"Invalid ReportTime format: {req.ReportTime}")  # Debug print
                response_data.append({
                    'id': index,
                    'ReportDate': report_date if report_date else formatted_date,
                    'ReportTime': report_time if report_time else current_month.strftime('%H:%M'),
                    'RadiologistName': req.RadiologistName,
                    'TechnicianName': req.Technician_Name,
                    'TestCode': test_code,  # Add TestCode
                    'SubTestCode': subtest_code, 
                    'Radiology_RequestId': req.Radiology_RequestId.pk,  # Add Radiology_RequestId
                    'Radiology_CompleteId': req.pk,
                    'Report': req.Report,
                    'IsSubTest':req.Radiology_RequestId.IsSubTest,
                    'RadiologyName': radiology_name,
                    'TestName': testname.Test_Name if testname else None,
                    'SubTestName': subtestname.SubTestName if subtestname else None,
                    'RadiologyId': radiology_id.Radiology_Id if radiology_id else None,
                    'Report_fileone': get_file_image(req.Report_fileone) if req.Report_fileone else None,
                    'Report_filetwo': get_file_image(req.Report_filetwo) if req.Report_filetwo else None,
                    'Report_filethree': get_file_image(req.Report_filethree) if req.Report_filethree else None,
                    'Report_HandOverTo': req.Report_HandOverTo,
                    'RelativeName': req.RelativeName,
                    'Createdby': req.Createdby,
                    'Status': req.Status,
                })

            # Return the response
            return JsonResponse(response_data,  safe=False)


        except Exception as e:
            print(f"Exception: {e}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    return JsonResponse({'warn': 'Invalid request method'}, status=405)

 
@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_filterwise_count_original(request):
    try:

        status = request.GET.get('status')
        dateOption = request.GET.get('dateOption')
        fromDate = request.GET.get('fromDate')
        toDate = request.GET.get('toDate')
        ParticularDate = request.GET.get('ParticularDate')
        CurrentDate = request.GET.get('CurrentDate')


        if dateOption == 'current':
            date_filter = Q(created_at__date=CurrentDate)
        elif dateOption == 'particular':
            date_filter = Q(created_at__date=ParticularDate)
        else:
            try:
                from_date = datetime.strptime(fromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(toDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
            
        queryset = Radiology_Request_Details.objects.filter(date_filter)

        totalcount = queryset.count()

        if status == 'Request':
            queryset = queryset.filter(Status='Request',Service_Status='Pending')

        elif status == 'Paid':
            queryset = queryset.filter(Status='Paid',Service_Status='Pending')

        elif status == 'Due':
            queryset = queryset.filter(Status='Due',Service_Status='Pending')

        elif status == 'Analyzed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Analyzed')

        elif status == 'Completed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Completed')

        countlist = {
            'filtercount': queryset.count(),
            'totalcount': totalcount
        }


        return JsonResponse(countlist,safe=False)

    
    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_filterwise_count_original_Deptwise(request):
    try:
        status = request.GET.get('status')
        dateOption = request.GET.get('dateOption')
        fromDate = request.GET.get('fromDate')
        toDate = request.GET.get('toDate')
        ParticularDate = request.GET.get('ParticularDate')
        CurrentDate = request.GET.get('CurrentDate')

        Dept = request.GET.getlist('Dept[]')
        Dept = list(map(int, Dept))

        if dateOption == 'current':
            date_filter = Q(created_at__date=CurrentDate)
        elif dateOption == 'particular':
            date_filter = Q(created_at__date=ParticularDate)
        else:
            try:
                from_date = datetime.strptime(fromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(toDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base queryset by date
        base_queryset = Radiology_Request_Details.objects.filter(date_filter)

        # Get department names
        depins = Department_Detials.objects.filter(Department_Id__in=Dept)
        dept_names = list(depins.values_list('Department_Name', flat=True))

        # Get all matching radiology IDs (IMPORTANT FIX)
        raddeps = RadiologyNames_Details.objects.filter(Radiology_Name__in=dept_names)
        rad_ids = raddeps.values_list('Radiology_Id', flat=True)

        # Filter by radiology IDs
        base_queryset = base_queryset.filter(TestCode__in=rad_ids)

        totalcount = base_queryset.count()
        queryset = base_queryset

        if status == 'Request':
            queryset = queryset.filter(Status='Request', Service_Status='Pending')

        elif status == 'Paid':
            queryset = queryset.filter(Status='Paid', Service_Status='Pending')

        elif status == 'Due':
            queryset = queryset.filter(Status='Due', Service_Status='Pending')

        elif status == 'Analyzed':
            queryset = queryset.filter(Status__in=['Paid', 'Due'], Service_Status='Analyzed')

        elif status == 'Completed':
            queryset = queryset.filter(Status__in=['Paid', 'Due'], Service_Status='Completed')

        countlist = {
            'filtercount': queryset.count(),
            'totalcount': totalcount
        }

        return JsonResponse(countlist)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_reports_for_original(request):
    try:
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        Department = request.GET.get('Department')
        status = request.GET.get('status')

        # Date filtering
        if DateType and DateType.lower() == 'current':
            date_filter = Q(created_at__date=CurrentDate)
        else:
            try:
                from_date = datetime.strptime(FromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(ToDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        queryset = Radiology_Request_Details.objects.filter(date_filter)

        if Department:
            queryset = queryset.filter(TestCode=Department)

        if status == 'Request':
            queryset = queryset.filter(Status='Request',Service_Status='Pending')

        elif status == 'Paid':
            queryset = queryset.filter(Status='Paid',Service_Status='Pending')

        elif status == 'Due':
            queryset = queryset.filter(Status='Due',Service_Status='Pending')

        elif status == 'Analyzed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Analyzed')

        elif status == 'Completed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Completed')
 

        RadiologyList = []

        Totalcount = queryset.count()

        for datas in queryset:
            if datas.RegisterType in ['OP', 'WALK-IN']:
                Registerid = datas.OP_Register_Id
                Patient = Registerid.PatientId

            elif datas.RegisterType == 'IP':  
                Registerid = datas.IP_Register_Id
                Patient = Registerid.PatientId

            else:
                continue  

            title = Patient.Title.Title_Name if Patient.Title else ''
            fname = Patient.FirstName or ''
            mname = Patient.MiddleName or ''
            lname = Patient.SurName or ''
            full_name = f"{title}. {fname} {mname} {lname}".strip()

            doctor = datas.Doctorid
            if doctor:
                Dfull_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()
            else:
                Dfull_name = 'Self'

            radiologynameins = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
            testnameins = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

            datalist = {
                'PatientId': Patient.PatientId,
                'PatientName': full_name,
                'RegisterType': datas.RegisterType,
                'PhoneNumber': Patient.PhoneNo,
                'doctor_name': Dfull_name,
                'Deptname': radiologynameins.Radiology_Name if radiologynameins else '',
                'Testname': testnameins.Test_Name if testnameins else ''
            }

            RadiologyList.append(datalist)

        for index, item in enumerate(RadiologyList, start=1):
            item['Sno'] = index  

        return JsonResponse({
            'RadiologyList':RadiologyList,
            'Totalcount':Totalcount},
                               safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_reports_for_Fake(request):
    try:
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        Department = request.GET.get('Department')
        status = request.GET.get('status')

        # Date filtering
        if DateType and DateType.lower() == 'current':
            date_filter = Q(created_at__date=CurrentDate)
        else:
            try:
                from_date = datetime.strptime(FromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(ToDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        queryset = MCI_Radiology_Request_Details.objects.filter(date_filter)

        if Department:
            queryset = queryset.filter(TestCode=Department)

        if status == 'Request':
            queryset = queryset.filter(Status='Request',Service_Status='Pending')

        elif status == 'Paid':
            queryset = queryset.filter(Status='Paid',Service_Status='Pending')

        elif status == 'Due':
            queryset = queryset.filter(Status='Due',Service_Status='Pending')

        elif status == 'Analyzed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Analyzed')

        elif status == 'Completed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Completed')
 

        RadiologyList = []

        Totalcount = queryset.count()

        for datas in queryset:
            if datas.RegisterType in ['OP', 'WALK-IN']:
                Registerid = datas.OP_Register_Id
                Patient = Registerid.PatientId

            elif datas.RegisterType == 'IP':  
                Registerid = datas.IP_Register_Id
                Patient = Registerid.PatientId

            else:
                continue  

            title = Patient.Title.Title_Name if Patient.Title else ''
            fname = Patient.FirstName or ''
            mname = Patient.MiddleName or ''
            lname = Patient.SurName or ''
            full_name = f"{title}. {fname} {mname} {lname}".strip()

            doctor = datas.Doctorid
            if doctor:
                Dfull_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()
            else:
                Dfull_name = 'Self'

            radiologynameins = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
            testnameins = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

            datalist = {
                'PatientId': Patient.PatientId,
                'PatientName': full_name,
                'RegisterType': datas.RegisterType,
                'PhoneNumber': Patient.PhoneNo,
                'doctor_name': Dfull_name,
                'Deptname': radiologynameins.Radiology_Name if radiologynameins else '',
                'Testname': testnameins.Test_Name if testnameins else ''
            }

            RadiologyList.append(datalist)

        for index, item in enumerate(RadiologyList, start=1):
            item['Sno'] = index  

        return JsonResponse({
            'RadiologyList':RadiologyList,
            'Totalcount':Totalcount},
                               safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Radiology_reports_for_Combined(request):
    try:
        # Get query parameters
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        Department = request.GET.get('Department')
        status = request.GET.get('status')

        # Date filtering
        if DateType and DateType.lower() == 'current':
            try:
                date_filter = Q(created_at__date=CurrentDate)
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format for CurrentDate. Use YYYY-MM-DD.'}, status=400)
        else:
            try:
                from_date = datetime.strptime(FromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(ToDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Query both models
        queryset_original = Radiology_Request_Details.objects.filter(date_filter)
        queryset_mci = MCI_Radiology_Request_Details.objects.filter(date_filter)

        # Apply department filter
        if Department:
            queryset_original = queryset_original.filter(TestCode=Department)
            queryset_mci = queryset_mci.filter(TestCode=Department)

        # Apply status filter
        if status == 'Request':
            queryset_original = queryset_original.filter(Status='Request', Service_Status='Pending')
            queryset_mci = queryset_mci.filter(Status='Request', Service_Status='Pending')
        elif status == 'Paid':
            queryset_original = queryset_original.filter(Status='Paid', Service_Status='Pending')
            queryset_mci = queryset_mci.filter(Status='Paid', Service_Status='Pending')
        elif status == 'Due':
            queryset_original = queryset_original.filter(Status='Due', Service_Status='Pending')
            queryset_mci = queryset_mci.filter(Status='Due', Service_Status='Pending')
        elif status == 'Analyzed':
            queryset_original = queryset_original.filter(Status__in=['Paid', 'Due'], Service_Status='Analyzed')
            queryset_mci = queryset_mci.filter(Status__in=['Paid', 'Due'], Service_Status='Analyzed')
        elif status == 'Completed':
            queryset_original = queryset_original.filter(Status__in=['Paid', 'Due'], Service_Status='Completed')
            queryset_mci = queryset_mci.filter(Status__in=['Paid', 'Due'], Service_Status='Completed')

        RadiologyList = []

        # Process Radiology_Request_Details
        for datas in queryset_original:
            if datas.RegisterType in ['OP', 'WALK-IN']:
                Registerid = datas.OP_Register_Id
                Patient = Registerid.PatientId
            elif datas.RegisterType == 'IP':
                Registerid = datas.IP_Register_Id
                Patient = Registerid.PatientId
            else:
                continue

            title = Patient.Title.Title_Name if Patient.Title else ''
            fname = Patient.FirstName or ''
            mname = Patient.MiddleName or ''
            lname = Patient.SurName or ''
            full_name = f"{title}. {fname} {mname} {lname}".strip()

            doctor = datas.Doctorid
            Dfull_name = (
                f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()
                if doctor else 'Self'
            )

            radiologynameins = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
            testnameins = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

            datalist = {
                'PatientId': Patient.PatientId,
                'PatientName': full_name,
                'RegisterType': datas.RegisterType,
                'PhoneNumber': Patient.PhoneNo,
                'doctor_name': Dfull_name,
                'Deptname': radiologynameins.Radiology_Name if radiologynameins else '',
                'Testname': testnameins.Test_Name if testnameins else '',
                'source': 'original'  # Optional: to track source model
            }

            RadiologyList.append(datalist)

        # Process MCI_Radiology_Request_Details
        for datas in queryset_mci:
            if datas.RegisterType in ['OP', 'WALK-IN']:
                Registerid = datas.OP_Register_Id
                Patient = Registerid.PatientId
            elif datas.RegisterType == 'IP':
                Registerid = datas.IP_Register_Id
                Patient = Registerid.PatientId
            else:
                continue

            title = Patient.Title.Title_Name if Patient.Title else ''
            fname = Patient.FirstName or ''
            mname = Patient.MiddleName or ''
            lname = Patient.SurName or ''
            full_name = f"{title}. {fname} {mname} {lname}".strip()

            doctor = datas.Doctorid
            Dfull_name = (
                f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()
                if doctor else 'Self'
            )

            radiologynameins = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
            testnameins = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

            datalist = {
                'PatientId': Patient.PatientId,
                'PatientName': full_name,
                'RegisterType': datas.RegisterType,
                'PhoneNumber': Patient.PhoneNo,
                'doctor_name': Dfull_name,
                'Deptname': radiologynameins.Radiology_Name if radiologynameins else '',
                'Testname': testnameins.Test_Name if testnameins else '',
                'source': 'mci'  # Optional: to track source model
            }

            RadiologyList.append(datalist)

        # Add serial numbers
        for index, item in enumerate(RadiologyList, start=1):
            item['Sno'] = index

        # Total count
        Totalcount = len(RadiologyList)

        return JsonResponse({
            'RadiologyList': RadiologyList,
            'Totalcount': Totalcount
        }, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Get_Data_For_Dispatch_Fake_Report(request):
    try:
        if request.method == "GET":
            # department = request.GET.get('department',None)
            Requestid = request.GET.get('Requestid','')

            # if department:
            Request_Data = list(
                MCI_Radiology_Request_Details.objects.filter(
                    Service_Status="Completed",Radiology_RequestId = Requestid
                ).values()
            )

            Result = []
            for data in Request_Data:
                Completed_Data = MCI_Radiology_Complete_Details.objects.filter(
                    Radiology_RequestId_id=data["Radiology_RequestId"],
                    TestCode=data["SubTestCode"],
                ).first()
                department = RadiologyNames_Details.objects.filter(
                    Radiology_Id=data["TestCode"]
                ).first()
                Test = TestName_Details.objects.filter(
                    Test_Code=data["SubTestCode"]
                ).first()
                doctor = Doctor_Personal_Form_Detials.objects.filter(
                    Doctor_ID=data["Doctorid_id"]
                ).first()

                if doctor:
                    DoctorName = f"""{getattr(doctor.Tittle, 'Title_Name', '') or ''}.{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}"""

                else:
                    DoctorName = "Self"

                print("testttttttttt")

                if data["RegisterType"] in ["OP", "WALK-IN"]:

                    patient = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                        pk=data["OP_Register_Id_id"]
                    ).first()

                    receiveddate = ""

              

                    que = {
                        "RequestId": data["Radiology_RequestId"],
                        "TestCode": data["SubTestCode"],
                        "TestName": Test.Test_Name,
                        "Department": department.Radiology_Name,
                        "RegisterType": data["RegisterType"],
                        "BillingStatus": data["Status"],
                        "CreatedBy": data["created_by"],
                        "CreatedAt": data["created_at"],
                        "UpdatedAt": data["updated_at"],
                        "Doctorid_id": data["Doctorid_id"],
                        "DoctorName": DoctorName,
                        "IP_Register_Id_id": data["IP_Register_Id_id"],
                        "Registrationid": patient.Registration_Id if patient else None,
                        "Service_Status": data["Service_Status"],
                        # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                        "FirstName": (
                            patient.PatientId.FirstName
                            if patient and patient.PatientId
                            else None
                        ),
                        "MiddleName": (
                            patient.PatientId.MiddleName
                            if patient and patient.PatientId
                            else None
                        ),
                        "Phone": (
                            patient.PatientId.PhoneNo
                            if patient and patient.PatientId
                            else None
                        ),
                        "Gender": (
                            patient.PatientId.Gender
                            if patient and patient.PatientId
                            else None
                        ),
                        "Age": (
                            patient.PatientId.Age
                            if patient and patient.PatientId
                            else None
                        ),
                        "ReportTime": Completed_Data.ReportDate,
                        "RadiologistId": Completed_Data.RadiologistName,
                        # 'RadiologistTitle': doctor.Tittle.Title_Name,
                        # 'RadiologistName': doctor.First_Name,
                        "Technician": Completed_Data.Technician_Name,
                        "ReportHandover": Completed_Data.Report_HandOverTo,
                        "CreatedBy": Completed_Data.Createdby,
                        "Status": Completed_Data.Status,
                        "html": Completed_Data.html_content,
                        "DocumentId": Completed_Data.Document_Id,
                        "VisitId": patient.VisitId,
                        "receiveddate": receiveddate,
                    }
                    Result.append(que)

                # elif data["RegisterType"] in ["IP"]:

                #     patient = Patient_IP_Registration_Detials.objects.filter(
                #         pk=data["IP_Register_Id_id"]
                #     ).first()
                #     receiveddate = ""
                #     if data["IP_Billing_Invoice_No_id"]:
                #         billins = IP_Billing_Table_Detials.objects.filter(
                #             Billing_Invoice_No=data["IP_Billing_Invoice_No_id"]
                #         ).first()
                #         receiveddate = billins.Billing_Date

                #     elif data["Interim_Billing_Invoice_No_id"]:
                #         billins = Interim_Billing_Table_Detials.objects.filter(
                #             Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                #         ).first()
                #         receiveddate = billins.Billing_Date

                #     que = {
                #         "RequestId": data["Radiology_RequestId"],
                #         "Invoice": data["Billing_Invoice_No_id"],
                #         "TestCode": data["SubTestCode"],
                #         "TestName": Test.Test_Name,
                #         "Department": department.Radiology_Name,
                #         "RegisterType": data["RegisterType"],
                #         "BillingStatus": data["Status"],
                #         "CreatedBy": data["created_by"],
                #         "CreatedAt": data["created_at"],
                #         "UpdatedAt": data["updated_at"],
                #         "Casuality_Register_Id_id": data["Casuality_Register_Id_id"],
                #         "Diagnosis_Register_Id_id": data["Diagnosis_Register_Id_id"],
                #         "Doctorid_id": data["Doctorid_id"],
                #         "DoctorName": DoctorName,
                #         "IP_Billing_Invoice_No_id": data["IP_Billing_Invoice_No_id"],
                #         "Registrationid": data["IP_Register_Id_id"],
                #         "OP_Register_Id_id": (
                #             patient.Registration_Id if patient else None
                #         ),
                #         "Service_Status": data["Service_Status"],
                #         # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                #         "FirstName": (
                #             f"""{patient.PatientId.FirstName} {patient.PatientId.MiddleName} .{patient.PatientId.SurName}"""
                #             if patient and patient.PatientId
                #             else None
                #         ),
                #         "MiddleName": (
                #             patient.PatientId.MiddleName
                #             if patient and patient.PatientId
                #             else None
                #         ),
                #         "Phone": (
                #             patient.PatientId.PhoneNo
                #             if patient and patient.PatientId
                #             else None
                #         ),
                #         "Gender": (
                #             patient.PatientId.Gender
                #             if patient and patient.PatientId
                #             else None
                #         ),
                #         "Age": (
                #             patient.PatientId.Age
                #             if patient and patient.PatientId
                #             else None
                #         ),
                #         "ReportTime": Completed_Data.ReportDate,
                #         "RadiologistId": Completed_Data.RadiologistName,
                #         # 'RadiologistTitle': doctor.Tittle.Title_Name,
                #         # 'RadiologistName': doctor.First_Name,
                #         "Technician": Completed_Data.Technician_Name,
                #         "ReportHandover": Completed_Data.Report_HandOverTo,
                #         "CreatedBy": Completed_Data.Createdby,
                #         "Status": Completed_Data.Status,
                #         "html": Completed_Data.html_content,
                #         "DocumentId": Completed_Data.Document_Id,
                #         "receiveddate": receiveddate,
                #     }
                #     Result.append(que)


            return JsonResponse(Result, safe=False)

    except Exception as err:
        return JsonResponse(
            {"error": f"Error fetching document: {str(err)}"}, status=400
        )


@csrf_exempt
@require_http_methods(["GET"])
def Radiology_testwise_counts(request):
    try:
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        # e.g., DepartmentName or DepartmentName[]='USG'
        DepartmentName = request.GET.get('DepartmentName')
        DepartmentNames = request.GET.getlist('DepartmentName[]')
 
        # Build date filter
        if DateType and DateType.lower() == 'current':
            date_filter = Q(created_at__date=CurrentDate)
        else:
            try:
                from_date = datetime.strptime(FromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(ToDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
        # Base queryset
        queryset = Radiology_Request_Details.objects.filter(date_filter)
 
        # Optional department filter by one or many names
        if DepartmentNames:
            rad_depts = list(RadiologyNames_Details.objects.filter(Radiology_Name__in=DepartmentNames).values_list('Radiology_Id', flat=True))
            if not rad_depts:
                return JsonResponse({'rows': [], 'total': 0})
            queryset = queryset.filter(TestCode__in=[str(x) for x in rad_depts])
        elif DepartmentName:
            rad_dept = RadiologyNames_Details.objects.filter(Radiology_Name__iexact=DepartmentName).first()
            if not rad_dept:
                return JsonResponse({'rows': [], 'total': 0})
            queryset = queryset.filter(TestCode=str(rad_dept.Radiology_Id))
 
        # Group by SubTestCode and count
        groups = (
            queryset
            .values('SubTestCode')
            .annotate(count=Count('SubTestCode'))
            .order_by('SubTestCode')
        )
 
        result_rows = []
        total_count = 0
        for idx, g in enumerate(groups, start=1):
            sub_code = g.get('SubTestCode')
            cnt = g.get('count', 0)
            total_count += cnt
 
            test = TestName_Details.objects.filter(Test_Code=sub_code).select_related('Radiology_Id').first()
            test_name = test.Test_Name if test else sub_code
            dept_display = ''
            if test and getattr(test, 'Radiology_Id', None):
                rname = RadiologyNames_Details.objects.filter(pk=test.Radiology_Id.pk).first()
                dept_display = rname.Radiology_Name if rname else ''
 
            result_rows.append({
                'Sno': idx,
                'test_code': sub_code,
                'test_name': test_name,
                'department': dept_display,
                'count': cnt,
            })
 
        return JsonResponse({
            'rows': result_rows,
            'total': total_count,
        })
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def MCI_Theatre_booking_request_details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'premmmmmmmm')
           
            # Existing fields
            id = data.get('Booking_Id','')
            Theatreid = data.get('Theatreid','')
            ReqDate = data.get('reqDate','')
            ReqTime = data.get('reqTime','')
            BookingType = data.get('bookingType','')
            BookingDate = data.get('bookingDate','') or data.get('BookingDate','')
            BookingTime = data.get('bookingTime','') or data.get('BookingTime','')
            Duration = data.get('duration','')
            OperationType = data.get('operationType','')
            priority = data.get('priority','')
            patientId = data.get('patientId','')
            patientName = data.get('patientName','')
            Age = data.get('age','')
            Gender = data.get('gender','')
            UHIDno = data.get('uhidNo','')
            Createdby = data.get('created_by','')
            Specializtion = data.get('specialization','')
            SurgeryName = data.get('surgeryName','')
            OTName = data.get('OTName') or data.get('Theatreid')
            DoctorName = data.get('doctorName','')
            Status = data.get('Status','')
            Statusedit = data.get('Statusedit','')
            Reason = data.get('Reason','')
            OPD_Id = data.get('OPD_Id','')
            OperationMode = data.get('OperationMode','')
            RegistrationId = data.get('RegistrationId','')
            opregistrationnid = data.get('opregistrationnid','')
            ipregistrationid = data.get('ipregistrationid','')
            emgregistrationid = data.get('emgregistrationid','')
           
            # New fields
            Diagnosis = data.get('Diagnosis', '')
            Surgeon = data.get('Surgeon', [])  # This will be a JSON array
            Anaesthetist = data.get('Anaesthetist', [])  # This will be a JSON array
            ScrubNurse = data.get('ScrubNurse', [])  # This will be a JSON array
            Type = data.get('Type', '')
 
            Surgery_ins = ''
            Procdure_ins = ''
 
            Specialization_ins = Speciality_Detials.objects.get(pk=Specializtion) if Specializtion else None
 
            if OperationMode == 'SURGERY':
                Surgery_ins = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None
            else:
                Procdure_ins = Procedure_Master_Details.objects.get(pk=SurgeryName) if SurgeryName else None
 
            Theatre_ins = OtTheaterMaster_Detials.objects.get(pk=OTName) if OTName else None
            Doctor_ins = Doctor_Personal_Form_Detials.objects.get(pk=DoctorName) if DoctorName else None
            Patient_ins = MCI_Patient_Detials.objects.get(pk=patientId) if patientId else None
            booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(pk=id) if id else None
           
            op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            ip_reg_id_ins = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=RegistrationId).first()
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
 
            if id:  
                if Statusedit == True:
                    booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(Booking_Id=id)
                    booking_ins.Status = Status
                    booking_ins.Reason = Reason
                   
                    # Update new fields if provided
                    if 'Diagnosis' in data:
                        booking_ins.Diagnosis = Diagnosis
                    if 'Surgeon' in data:
                        booking_ins.Surgeon = Surgeon
                    if 'Anaesthetist' in data:
                        booking_ins.Anaesthetist = Anaesthetist
                    if 'ScrubNurse' in data:
                        booking_ins.ScrubNurse = ScrubNurse
                    if 'Type' in data:
                        booking_ins.Type = Type
                   
                    booking_ins.save()
 
                    if Status == "Canceled":
                        OTC = OTTheatrecalendar.objects.filter(booking=booking_ins)
                        for i in OTC:
                            i.delete()
 
                        ODC = OTDoctorcalendar.objects.filter(booking=booking_ins)
                        for j in ODC:
                            j.delete()
 
                        OEC = OTEmployeecalendar.objects.filter(booking=booking_ins)
                        for k in OEC:
                            k.delete()
 
                        return JsonResponse({'success': f'Operation {Status} successfully'})
 
                    existsdata = OTTheatrecalendar.objects.filter(date=BookingDate,time=BookingTime).first()
                    if existsdata:
                        return None
 
                    OT_ins = OtTheaterMaster_Detials.objects.get(pk=Theatreid) if Theatreid else None
                   
                    try:
                        calendar_ins = OTTheatrecalendar(
                            Theatre = OT_ins,
                            booking = booking_ins,
                            date = BookingDate,
                            time = BookingTime,
                        )
                        calendar_ins.save()
                    except Exception as e:
                        print(e)
 
                    return JsonResponse({'success': f'Booking Request {Status} successfully'})
               
                # Update existing booking
                booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(Booking_Id=id)
 
                booking_ins.ReqDate = ReqDate
                booking_ins.ReqTime = ReqTime
                booking_ins.BookingType = BookingType
                booking_ins.BookingDate = BookingDate
                booking_ins.BookingTime = BookingTime
                booking_ins.Duration = Duration
                booking_ins.OperationType = OperationType
                booking_ins.Priority = priority
                booking_ins.Patientid = Patient_ins
                booking_ins.PatientName = patientName
                booking_ins.Age = Age
                booking_ins.Gender = Gender
                booking_ins.UHIDNO = UHIDno
                booking_ins.CreatedBy = Createdby
                booking_ins.Status = Status
                booking_ins.Specialization = Specialization_ins
                booking_ins.OperationMode = OperationMode
               
                # Update new fields
                booking_ins.Diagnosis = Diagnosis
                booking_ins.Surgeon = Surgeon
                booking_ins.Anaesthetist = Anaesthetist
                booking_ins.ScrubNurse = ScrubNurse
                booking_ins.Type = Type
 
                if OperationMode == 'SURGERY':
                    booking_ins.SurgeryName = Surgery_ins
                    booking_ins.ProcedureName = None
                else:
                    booking_ins.ProcedureName = Procdure_ins
                    booking_ins.SurgeryName = None
 
                booking_ins.TheatreName = Theatre_ins
                booking_ins.DoctorName = Doctor_ins
                booking_ins.OP_Registration_Id = op_reg_id_ins
                booking_ins.IP_Registration_Id = ip_reg_id_ins
                booking_ins.EMR_Registration_Id = emg_reg_id_ins
 
                booking_ins.save()
 
                # Update calendar entries
                ottheatre = OTTheatrecalendar.objects.filter(booking=booking_ins).first()
                if ottheatre:
                    ottheatre.date = BookingDate
                    ottheatre.time = BookingTime
                    ottheatre.save()
 
                otdoc = OTDoctorcalendar.objects.filter(booking=booking_ins)
                if otdoc:
                    for d in otdoc:
                        d.date = BookingDate
                        d.time = BookingTime
                        d.save()
 
                otemp = OTEmployeecalendar.objects.filter(booking=booking_ins)
                if otemp:
                    for e in otemp:
                        e.date = BookingDate
                        e.time = BookingTime
                        e.save()
 
                return JsonResponse({'success':'Booking Request Updated successfully'})
 
            # Create new booking
            if OperationMode == 'SURGERY':
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = Surgery_ins,
                    ProcedureName = None,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
            else:
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = None,
                    ProcedureName = Procdure_ins,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
 
            booking_ins.save()
 
            return JsonResponse({'success': 'Booking Request Added successfully'})
 
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'error': str(e)})
 
    elif request.method == 'GET':
        try:
            PhoneNo = request.GET.get('PhoneNo')
            Fname = request.GET.get('Fname')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
 
            Theatrerequest_list = []
            search_query = Q()
 
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(ReqDate=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(ReqDate__range=[FromDate_dt, ToDate_dt])
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
            Theatre_ins = MCI_Theatre_Booking_Request_Details.objects.filter(search_query)
 
            for datas in Theatre_ins:
                formatted_rdate = datas.ReqDate.strftime('%d-%m-%y')
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
 
                if datas.BookingType == 'IP':
                    data_list = {
                        'Booking_Id': datas.Booking_Id,
                        'ReqDate': formatted_rdate,
                        'ReqTime': datas.ReqTime.strftime('%I:%M %p'),
                        'BookingType': datas.BookingType,
                        'Specialization_name': datas.Specialization.Speciality_Name if datas.Specialization else None,
                        'Specializationid': datas.Specialization.Speciality_Id if datas.Specialization else None,
                        'SurgeryName': datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                        'Surgeryid': datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                        'ProcedureName': datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                        'Procedureid': datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
                        'TheatreName': datas.TheatreName.TheatreName if datas.TheatreName else None,
                        'Theatreid': datas.TheatreName.Ot_Id if datas.TheatreName else None,
                        'theatrerent': int(datas.TheatreName.Rent) if datas.TheatreName else 0,
                        'DoctorID': datas.DoctorName.Doctor_ID if datas.DoctorName else None,
                        'DoctorName': f"""{datas.DoctorName.First_Name}{datas.DoctorName.Middle_Name}{datas.DoctorName.Last_Name}""" if datas.DoctorName else None,
                        'BookingDate': datas.BookingDate,
                        'bookingdate': formatted_bdate,
                        'BookingTime': datas.BookingTime.strftime('%I:%M %p'),
                        'Duration': datas.Duration if datas.Duration else 0,
                        'OperationType': datas.OperationType,
                        'OperationMode': datas.OperationMode,
                        'Priority': datas.Priority,
                        'patientId': datas.IP_Registration_Id.PatientId.PatientNo if datas.IP_Registration_Id else None,
                        'PatientName': f"""{datas.Patientid.FirstName} {datas.Patientid.MiddleName} {datas.Patientid.SurName}""" if datas.Patientid else None,
                        'Age': datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
                        'Gender': datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
                        'UHIDNO': datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
                        'Status': datas.Status,
                        'Reason': datas.Reason,
                        'CreatedBy': datas.CreatedBy,
                        'DoctorConfirm': datas.DoctorConfirm,
                        'RegistrationId': datas.IP_Registration_Id.IPNo if datas.IP_Registration_Id else None,
                        # New fields
                        'Diagnosis': datas.Diagnosis,
                        'Surgeon': datas.Surgeon,
                        'Anaesthetist': datas.Anaesthetist,
                        'ScrubNurse': datas.ScrubNurse,
                        'Type': datas.Type
                    }
                    Theatrerequest_list.append(data_list)
                    
                    
                    
                if datas.BookingType == 'OP':
                    data_list = {
                        'Booking_Id': datas.Booking_Id,
                        'ReqDate': formatted_rdate,
                        'ReqTime': datas.ReqTime.strftime('%I:%M %p'),
                        'BookingType': datas.BookingType,
                        'Specialization_name': datas.Specialization.Speciality_Name if datas.Specialization else None,
                        'Specializationid': datas.Specialization.Speciality_Id if datas.Specialization else None,
                        'SurgeryName': datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                        'Surgeryid': datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                        'ProcedureName': datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                        'Procedureid': datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
                        'TheatreName': datas.TheatreName.TheatreName if datas.TheatreName else None,
                        'Theatreid': datas.TheatreName.Ot_Id if datas.TheatreName else None,
                        'theatrerent': int(datas.TheatreName.Rent) if datas.TheatreName else 0,
                        'DoctorID': datas.DoctorName.Doctor_ID if datas.DoctorName else None,
                        'DoctorName': f"""{datas.DoctorName.First_Name}{datas.DoctorName.Middle_Name}{datas.DoctorName.Last_Name}""" if datas.DoctorName else None,
                        'BookingDate': datas.BookingDate,
                        'bookingdate': formatted_bdate,
                        'BookingTime': datas.BookingTime.strftime('%I:%M %p'),
                        'Duration': datas.Duration if datas.Duration else 0,
                        'OperationType': datas.OperationType,
                        'OperationMode': datas.OperationMode,
                        'Priority': datas.Priority,
                        'patientId': datas.OP_Registration_Id.PatientId.PatientNo if datas.OP_Registration_Id else None,
                        'PatientName': f"""{datas.OP_Registration_Id.PatientId.FirstName} {datas.OP_Registration_Id.PatientId.MiddleName} {datas.OP_Registration_Id.PatientId.SurName}""" if datas.OP_Registration_Id else None,
                        'Age': datas.OP_Registration_Id.PatientId.Age if datas.OP_Registration_Id else None,
                        'Gender': datas.OP_Registration_Id.PatientId.Gender if datas.OP_Registration_Id else None,
                        'UHIDNO': datas.OP_Registration_Id.PatientId.UniqueIdNo if datas.OP_Registration_Id else None,
                        'Status': datas.Status,
                        'Reason': datas.Reason,
                        'CreatedBy': datas.CreatedBy,
                        'DoctorConfirm': datas.DoctorConfirm,
                        'RegistrationId': datas.OP_Registration_Id.OPNo if datas.OP_Registration_Id else None,
                        # New fields
                        'Diagnosis': datas.Diagnosis,
                        'Surgeon': datas.Surgeon,
                        'Anaesthetist': datas.Anaesthetist,
                        'ScrubNurse': datas.ScrubNurse,
                        'Type': datas.Type
                    }
                    Theatrerequest_list.append(data_list)
                    
                    
                    
                    
                    
 
            for idx, Theatre in enumerate(Theatrerequest_list, start=1):
                Theatre["Sno"] = idx
 
            return JsonResponse(Theatrerequest_list, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def MCI_Theatre_booking_request_details_Link_for_Org_OT(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'premmmmmmmm')
           
            # Existing fields
            id = data.get('Booking_Id','')
            Theatreid = data.get('Theatreid','')
            ReqDate = data.get('reqDate','')
            ReqTime = data.get('reqTime','')
            BookingType = data.get('bookingType','')
            BookingDate = data.get('bookingDate','') or data.get('BookingDate','')
            BookingTime = data.get('bookingTime','') or data.get('BookingTime','')
            Duration = data.get('duration','')
            OperationType = data.get('operationType','')
            priority = data.get('priority','')
            patientId = data.get('patientId','')
            patientName = data.get('patientName','')
            Age = data.get('age','')
            Gender = data.get('gender','')
            UHIDno = data.get('uhidNo','')
            Createdby = data.get('created_by','')
            Specializtion = data.get('specialization','')
            SurgeryName = data.get('surgeryName','')
            OTName = data.get('OTName') or data.get('Theatreid')
            DoctorName = data.get('doctorName','')
            Status = data.get('Status','')
            Statusedit = data.get('Statusedit','')
            Reason = data.get('Reason','')
            OPD_Id = data.get('OPD_Id','')
            OperationMode = data.get('OperationMode','')
            RegistrationId = data.get('RegistrationId','')
            opregistrationnid = data.get('opregistrationnid','')
            ipregistrationid = data.get('ipregistrationid','')
            emgregistrationid = data.get('emgregistrationid','')
           
            # New fields
            Diagnosis = data.get('Diagnosis', '')
            Surgeon = data.get('Surgeon', [])  # This will be a JSON array
            Anaesthetist = data.get('Anaesthetist', [])  # This will be a JSON array
            ScrubNurse = data.get('ScrubNurse', [])  # This will be a JSON array
            Type = data.get('Type', '')
 
            Surgery_ins = ''
            Procdure_ins = ''
 
            Specialization_ins = Speciality_Detials.objects.get(pk=Specializtion) if Specializtion else None
 
            if OperationMode == 'SURGERY':
                Surgery_ins = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None
            else:
                Procdure_ins = Procedure_Master_Details.objects.get(pk=SurgeryName) if SurgeryName else None
 
            Theatre_ins = OtTheaterMaster_Detials.objects.get(pk=OTName) if OTName else None
            Doctor_ins = Doctor_Personal_Form_Detials.objects.get(pk=DoctorName) if DoctorName else None
            Patient_ins = MCI_Patient_Detials.objects.get(PatientId=patientId) if patientId else None
            booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(pk=id) if id else None
           
            op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            ip_reg_id_ins = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=RegistrationId).first()
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
 
            if id:  
                if Statusedit == True:
                    booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(Booking_Id=id)
                    booking_ins.Status = Status
                    booking_ins.Reason = Reason
                   
                    # Update new fields if provided
                    if 'Diagnosis' in data:
                        booking_ins.Diagnosis = Diagnosis
                    if 'Surgeon' in data:
                        booking_ins.Surgeon = Surgeon
                    if 'Anaesthetist' in data:
                        booking_ins.Anaesthetist = Anaesthetist
                    if 'ScrubNurse' in data:
                        booking_ins.ScrubNurse = ScrubNurse
                    if 'Type' in data:
                        booking_ins.Type = Type
                   
                    booking_ins.save()
 
                    if Status == "Canceled":
                        OTC = OTTheatrecalendar.objects.filter(booking=booking_ins)
                        for i in OTC:
                            i.delete()
 
                        ODC = OTDoctorcalendar.objects.filter(booking=booking_ins)
                        for j in ODC:
                            j.delete()
 
                        OEC = OTEmployeecalendar.objects.filter(booking=booking_ins)
                        for k in OEC:
                            k.delete()
 
                        return JsonResponse({'success': f'Operation {Status} successfully'})
 
                    existsdata = OTTheatrecalendar.objects.filter(date=BookingDate,time=BookingTime).first()
                    if existsdata:
                        return None
 
                    OT_ins = OtTheaterMaster_Detials.objects.get(pk=Theatreid) if Theatreid else None
                   
                    try:
                        calendar_ins = OTTheatrecalendar(
                            Theatre = OT_ins,
                            booking = booking_ins,
                            date = BookingDate,
                            time = BookingTime,
                        )
                        calendar_ins.save()
                    except Exception as e:
                        print(e)
 
                    return JsonResponse({'success': f'Booking Request {Status} successfully'})
               
                # Update existing booking
                booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(Booking_Id=id)
 
                booking_ins.ReqDate = ReqDate
                booking_ins.ReqTime = ReqTime
                booking_ins.BookingType = BookingType
                booking_ins.BookingDate = BookingDate
                booking_ins.BookingTime = BookingTime
                booking_ins.Duration = Duration
                booking_ins.OperationType = OperationType
                booking_ins.Priority = priority
                booking_ins.Patientid = Patient_ins
                booking_ins.PatientName = patientName
                booking_ins.Age = Age
                booking_ins.Gender = Gender
                booking_ins.UHIDNO = UHIDno
                booking_ins.CreatedBy = Createdby
                booking_ins.Status = Status
                booking_ins.Specialization = Specialization_ins
                booking_ins.OperationMode = OperationMode
               
                # Update new fields
                booking_ins.Diagnosis = Diagnosis
                booking_ins.Surgeon = Surgeon
                booking_ins.Anaesthetist = Anaesthetist
                booking_ins.ScrubNurse = ScrubNurse
                booking_ins.Type = Type
 
                if OperationMode == 'SURGERY':
                    booking_ins.SurgeryName = Surgery_ins
                    booking_ins.ProcedureName = None
                else:
                    booking_ins.ProcedureName = Procdure_ins
                    booking_ins.SurgeryName = None
 
                booking_ins.TheatreName = Theatre_ins
                booking_ins.DoctorName = Doctor_ins
                booking_ins.OP_Registration_Id = op_reg_id_ins
                booking_ins.IP_Registration_Id = ip_reg_id_ins
                booking_ins.EMR_Registration_Id = emg_reg_id_ins
 
                booking_ins.save()
 
                # Update calendar entries
                ottheatre = OTTheatrecalendar.objects.filter(booking=booking_ins).first()
                if ottheatre:
                    ottheatre.date = BookingDate
                    ottheatre.time = BookingTime
                    ottheatre.save()
 
                otdoc = OTDoctorcalendar.objects.filter(booking=booking_ins)
                if otdoc:
                    for d in otdoc:
                        d.date = BookingDate
                        d.time = BookingTime
                        d.save()
 
                otemp = OTEmployeecalendar.objects.filter(booking=booking_ins)
                if otemp:
                    for e in otemp:
                        e.date = BookingDate
                        e.time = BookingTime
                        e.save()
 
                return JsonResponse({'success':'Booking Request Updated successfully'})
 
            # Create new booking
            if OperationMode == 'SURGERY':
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = Surgery_ins,
                    ProcedureName = None,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
            else:
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = None,
                    ProcedureName = Procdure_ins,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
 
            booking_ins.save()
 
            return JsonResponse({'success': 'Booking Request Added successfully'})
 
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'error': str(e)})
 
    elif request.method == 'GET':
        try:
            PhoneNo = request.GET.get('PhoneNo')
            Fname = request.GET.get('Fname')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
 
            Theatrerequest_list = []
            search_query = Q()
 
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(ReqDate=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(ReqDate__range=[FromDate_dt, ToDate_dt])
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
            Theatre_ins = MCI_Theatre_Booking_Request_Details.objects.filter(search_query)
 
            for datas in Theatre_ins:
                formatted_rdate = datas.ReqDate.strftime('%d-%m-%y')
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
 
                if datas.BookingType == 'IP':
                    data_list = {
                        'Booking_Id': datas.Booking_Id,
                        'ReqDate': formatted_rdate,
                        'ReqTime': datas.ReqTime.strftime('%I:%M %p'),
                        'BookingType': datas.BookingType,
                        'Specialization_name': datas.Specialization.Speciality_Name if datas.Specialization else None,
                        'Specializationid': datas.Specialization.Speciality_Id if datas.Specialization else None,
                        'SurgeryName': datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                        'Surgeryid': datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                        'ProcedureName': datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                        'Procedureid': datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
                        'TheatreName': datas.TheatreName.TheatreName if datas.TheatreName else None,
                        'Theatreid': datas.TheatreName.Ot_Id if datas.TheatreName else None,
                        'theatrerent': int(datas.TheatreName.Rent) if datas.TheatreName else 0,
                        'DoctorID': datas.DoctorName.Doctor_ID if datas.DoctorName else None,
                        'DoctorName': f"""{datas.DoctorName.First_Name}{datas.DoctorName.Middle_Name}{datas.DoctorName.Last_Name}""" if datas.DoctorName else None,
                        'BookingDate': datas.BookingDate,
                        'bookingdate': formatted_bdate,
                        'BookingTime': datas.BookingTime.strftime('%I:%M %p'),
                        'Duration': datas.Duration if datas.Duration else 0,
                        'OperationType': datas.OperationType,
                        'OperationMode': datas.OperationMode,
                        'Priority': datas.Priority,
                        'patientId': datas.IP_Registration_Id.PatientId.PatientNo if datas.IP_Registration_Id else None,
                        'PatientName': f"""{datas.IP_Registration_Id.PatientId.FirstName} {datas.IP_Registration_Id.PatientId.MiddleName} {datas.IP_Registration_Id.PatientId.SurName}""" if datas.IP_Registration_Id else None,
                        'Age': datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
                        'Gender': datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
                        'UHIDNO': datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
                        'Status': datas.Status,
                        'Reason': datas.Reason,
                        'CreatedBy': datas.CreatedBy,
                        'DoctorConfirm': datas.DoctorConfirm,
                        'RegistrationId': datas.IP_Registration_Id.IPNo if datas.IP_Registration_Id else None,
                        # New fields
                        'Diagnosis': datas.Diagnosis,
                        'Surgeon': datas.Surgeon,
                        'Anaesthetist': datas.Anaesthetist,
                        'ScrubNurse': datas.ScrubNurse,
                        'Type': datas.Type
                    }
                    Theatrerequest_list.append(data_list)
 
            for idx, Theatre in enumerate(Theatrerequest_list, start=1):
                Theatre["Sno"] = idx
 
            return JsonResponse(Theatrerequest_list, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def Filter_FakeIPPatient_by_Multiple_Criteria_for_org_OT(request):
    try:
        # Fetch query parameters
        first_name = request.GET.get("FirstName", '').strip()
        phone_no = request.GET.get("PhoneNo", '').strip()
        doctor_id = request.GET.get("DoctorId", '').strip()  # Note: Currently unused
        patient_id = request.GET.get("PatientId", '').strip()
 
        # Build filter conditions
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(PatientId__FirstName__icontains=first_name)
        if phone_no:
            filter_conditions &= Q(PatientId__PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__PatientId__icontains=patient_id)
        if doctor_id:  # Optionally include DoctorId if needed
            filter_conditions &= Q(DoctorId__DoctorId__icontains=doctor_id)  # Adjust based on Doctor_Personal_Form_Detials model
 
        # Query the database
        registration = MCI_Patient_IP_Registration_Detials.objects.filter(filter_conditions,Status='Admitted').values(
            'IPNo',
            'PatientId__PatientId',
            'PatientId__PhoneNo',
            'PatientId__FirstName',
            'PatientId__UniqueIdNo',
            'PatientId__Age',
            'PatientId__Gender'
        ).distinct()
 
        print(registration, 'registration')
 
        seen = set()
        patient_datas = []
        for reg in registration:
            reg_id = reg.get('IPNo')
 
            if reg_id not in seen:
                seen.add(reg_id)
                patient_data = {
                    'PatientId': reg.get('PatientId__PatientId', ''),
                    'RegistrationId': reg.get('IPNo', ''),
                    'PhoneNo': int(reg['PatientId__PhoneNo']) if reg.get('PatientId__PhoneNo') and str(reg['PatientId__PhoneNo']).isdigit() else None,
                    'FirstName': reg.get('PatientId__FirstName', ''),
                    'UniqueIdNo': reg.get('PatientId__UniqueIdNo', ''),
                    'PatientAge': f"""{reg.get('PatientId__Age','')}/{reg.get('PatientId__Gender','')}""" ,
                }
                patient_datas.append(patient_data)
 
        return JsonResponse(patient_datas, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_MCI_Patient_Details_by_patientId_for_OT(request):
    try:
        PatientId = request.GET.get("PatientId", '').strip()
        FirstName = request.GET.get("FirstName", '').strip()
        PhoneNumber = request.GET.get("PhoneNumber", '').strip()
 
        print(PatientId, 'PatientId')
        print(FirstName, 'FirstName')
        print(PhoneNumber, 'PhoneNumber')
 
 
 
        if MCI_Patient_Detials.objects.exists():
            patient = None
            print('hiiiii')
 
            if PatientId:
               
                patient = MCI_Patient_Detials.objects.get(Q(PatientId=PatientId) & Q(DuplicateId=False))
            elif FirstName and PhoneNumber:
                print('hiiiii')
                if MCI_Patient_Detials.objects.filter(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False)).exists():
                    patient = MCI_Patient_Detials.objects.get(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False))
                else:
                    return JsonResponse({'warn': 'Patient does not exist'})
 
            print('hiiiii')
            if patient:
                Patient_data = {
                    'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                    'PatientId': patient.PatientId,
                    'ABHA': patient.ABHA,
                    'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo and patient.PhoneNo.isdigit() else None,
                    'Title': patient.Title.Title_Id if patient.Title else None,
                    'FirstName': patient.FirstName,
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'Gender': patient.Gender,
                    'MaritalStatus': patient.MaritalStatus,
                    'SpouseName': patient.SpouseName,
                    'FatherName': patient.FatherName,
                    'DOB': patient.DOB,
                    'Age': patient.Age,
                    'ABHA': patient.ABHA,
                    'Email': patient.Email,
                    'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
                    'Occupation': patient.Occupation,
                    'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                    'Nationality': patient.Nationality,
                    'UHIDType': patient.UniqueIdType,
                    'UHIDNo': patient.UniqueIdNo,
                    'PatientType': patient.PatientType,
                    'DoorNo': patient.DoorNo or patient.PermanentdoorNo,
                    'Street': patient.Street or patient.PermanentStreet,
                    'Area': patient.Area or patient.PermanentArea,
                    'City': patient.City or patient.PermanentCity,
                    'District': patient.District or patient.PermanentDistrict,
                    'State': patient.State or patient.PermanentState,
                    'Country': patient.Country or patient.PermanentCountry,
                    'Pincode': patient.Pincode or patient.PermanentPincode,
                    'Status': patient.Status,
                    'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
                }
                return JsonResponse(Patient_data)
            else:
                return JsonResponse({'warn': 'Patient does not exist'})
        else:
            return JsonResponse({'warn': 'Patient does not exist'})
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})
 
 
 
 
 

import json
import random
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from MCI.models import (
    MCI_Patient_Detials,
    MCI_Patient_Visit_Detials,
    MCI_Patient_Appointment_Registration_Detials,
    MCI_OP_Patient_Appointment_With_Multiple_Doctor,
)
from Masters.models import (
    Speciality_Detials,
    Doctor_ProfessForm_Detials,
    Location_Detials,
)
from faker import Faker

# ------------------- Helper Functions (Copy from your script) -------------------
fake = Faker()

def generate_or_update_mci_visit_id(patient, register_type):
    max_visit_id = MCI_Patient_Visit_Detials.objects.filter(
        PatientId=patient
    ).aggregate(max_id=Max('VisitId'))['max_id']
    next_visit_id = 1 if max_visit_id is None else max_visit_id + 1
    visit = MCI_Patient_Visit_Detials.objects.create(
        PatientId=patient,
        VisitId=next_visit_id,
        RegisterType=register_type
    )
    return visit.VisitId

def get_next_token_no(specialization, date_obj):
    count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
        Specialization=specialization,
        created_at__date=date_obj
    ).count()
    token_no = count + 1
    abbr = specialization.Speciality_Name[:3].upper()
    return f"{abbr}{token_no:03d}"

# -------------------------------------------------------------------------------

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Speciality_Count_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            counts_list = data.get('counts', [])  # Expect: [{speciality, newCount, followUpCount}, ...]
            created_by = data.get('created_by', 'system')
            appointment_date = datetime.now().date()
 
            if not counts_list:
                return JsonResponse({'error': 'No speciality counts provided'}, status=400)
 
            # Fetch required master data once
            locations = list(Location_Detials.objects.all())
            if not locations:
                return JsonResponse({'error': 'No locations configured'}, status=500)
 
            # Get all active OP doctors with valid specialities
            doctor_specs = Doctor_ProfessForm_Detials.objects.filter(
                Specialization__isnull=False,
                Department__Department_Name='OP'
            ).select_related('Doctor_ID', 'Specialization').distinct()
 
            # Pre-load patients who are NOT in active OP registration
            active_op_patients = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                Status='Registered'
            ).values_list('PatientId', flat=True)
 
            # Create separate patient pools
            newvisit_available_patients = list(MCI_Patient_Detials.objects.exclude(
                PatientNo__in=active_op_patients
            ).filter(
                PatientNo__icontains='-'
            ))
 
            followupvisit_available_patients = list(MCI_Patient_Detials.objects.exclude(
                PatientNo__in=active_op_patients
            ))
 
            # Check if we have any patients available
            if not newvisit_available_patients and not followupvisit_available_patients:
                return JsonResponse({'error': 'No patients available for appointment'}, status=400)
 
            total_generated = 0
 
            with transaction.atomic():
                for item in counts_list:
                    spec_name = item.get('speciality')
                    new_count = int(item.get('newCount', 0))
                    follow_count = int(item.get('followUpCount', 0))
 
                    if new_count == 0 and follow_count == 0:
                        continue
 
                    # Resolve speciality
                    speciality_obj = Speciality_Detials.objects.filter(
                        Speciality_Name__iexact=spec_name,
                        Status=True
                    ).first()
 
                    if not speciality_obj:
                        continue  # Skip unknown speciality
 
                    # Get doctors for this speciality
                    dept_doctors = doctor_specs.filter(Specialization=speciality_obj)
                    if not dept_doctors.exists():
                        continue
 
                    # Prepare separate patient pools for this speciality
                    new_patient_pool = []
                    follow_patient_pool = []
                   
                    # Filter new patients by department rules
                    for patient in newvisit_available_patients:
                        if spec_name.upper() == 'GYNECOLOGY':
                            if patient.Gender == 'Female' and get_age_value(patient.Age) >= 18:
                                new_patient_pool.append(patient)
                        elif spec_name.upper() == 'PAEDIATRICS':
                            if get_age_value(patient.Age) <= 15:
                                new_patient_pool.append(patient)
                        elif spec_name.upper() == 'OPTHALMOLOGY':
                            if get_age_value(patient.Age) >= 30:
                                new_patient_pool.append(patient)
                        else:
                            new_patient_pool.append(patient)
                   
                    # Filter follow-up patients by department rules
                    for patient in followupvisit_available_patients:
                        if spec_name.upper() == 'GYNECOLOGY':
                            if patient.Gender == 'Female' and get_age_value(patient.Age) >= 18:
                                follow_patient_pool.append(patient)
                        elif spec_name.upper() == 'PAEDIATRICS':
                            if get_age_value(patient.Age) <= 15:
                                follow_patient_pool.append(patient)
                        elif spec_name.upper() == 'OPTHALMOLOGY':
                            if get_age_value(patient.Age) >= 30:
                                follow_patient_pool.append(patient)
                        else:
                            follow_patient_pool.append(patient)
 
                    # Generate NewConsultation appointments
                    generated_new = 0
                    for _ in range(new_count):
                        if not new_patient_pool:
                            break
                        patient = random.choice(new_patient_pool)
                        doctor_spec = random.choice(dept_doctors)
                        create_single_appointment(
                            patient=patient,
                            specialization=speciality_obj,
                            doctor=doctor_spec.Doctor_ID,
                            visit_type='NewConsultation',
                            appointment_date=appointment_date,
                            created_by=created_by,
                            locations=locations
                        )
                        total_generated += 1
                        generated_new += 1
                        new_patient_pool.remove(patient)
                        # Also remove from master list to avoid reuse
                        if patient in newvisit_available_patients:
                            newvisit_available_patients.remove(patient)
 
                    # Generate FollowUp appointments
                    generated_follow = 0
                    for _ in range(follow_count):
                        if not follow_patient_pool:
                            break
                        patient = random.choice(follow_patient_pool)
                        doctor_spec = random.choice(dept_doctors)
                        create_single_appointment(
                            patient=patient,
                            specialization=speciality_obj,
                            doctor=doctor_spec.Doctor_ID,
                            visit_type='FollowUp',
                            appointment_date=appointment_date,
                            created_by=created_by,
                            locations=locations
                        )
                        total_generated += 1
                        generated_follow += 1
                        follow_patient_pool.remove(patient)
                        # Also remove from master list to avoid reuse
                        if patient in followupvisit_available_patients:
                            followupvisit_available_patients.remove(patient)
 
                    print(f"Generated for {spec_name}: {generated_new} new, {generated_follow} follow-up")
 
            return JsonResponse({
                'success': f'{total_generated} OP appointments created successfully'
            })
 
        except Exception as e:
            print(f"Error in Speciality_Count_Link: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
 
 
# ------------------- Helper: Create One Appointment -------------------
def get_age_value(age_str):
    try:
        if not age_str:
            return 0
        if isinstance(age_str, (int, float)):
            return int(age_str)
        if age_str.isdigit():
            return int(age_str)
        for part in str(age_str).split():
            if part.isdigit():
                return int(part)
        return 0
    except:
        return 0

def create_single_appointment(patient, specialization, doctor, visit_type,
                              appointment_date, created_by, locations):
    register_type = 'OP'
    token_no = get_next_token_no(specialization, appointment_date)
    complaint = fake.paragraph(nb_sentences=2)

    # Generate Visit ID
    visit_id = generate_or_update_mci_visit_id(patient, register_type)

    # Generate Registration ID (OPyyMMxxxx)
    current_year_month = datetime.now().strftime('%y%m')
    registration_id = generate_fake_registration_id(current_year_month)

    # Consulting time (random)
    consulting_time = datetime.combine(appointment_date, fake.time_object())

    # Create Registration
    appointment = MCI_Patient_Appointment_Registration_Detials(
        Registration_Id=registration_id,
        PatientId=patient,
        VisitId=visit_id,
        VisitPurpose=register_type,
        AppointmentId=None,  # Auto-incremented or set by DB
        IsMLC=None,
        IsReferral='No',
        PatientCategory='General',
        Status='Registered',
        Bill_Status='Pending',
        ConsultingTime=consulting_time,
        Reason=complaint,
        Location=random.choice(locations),
        created_by=created_by,
        updated_by=''
    )
    appointment.save()

    # Create Multi-Doctor Entry
    multi_doc = MCI_OP_Patient_Appointment_With_Multiple_Doctor(
        Registration_Id=appointment,
        PrimaryDoctor=doctor,
        Specialization=specialization,
        VisitType=visit_type,
        Complaint=complaint,
        TokenNo=token_no,
        Status='Registered',
        created_by=created_by,
        updated_by=''
    )
    multi_doc.save()

    return appointment


# ------------------- Helper: Generate Registration ID -------------------
def generate_fake_registration_id(current_year_month):
    prefix = f"OP{current_year_month}"
    with transaction.atomic():
        matching = MCI_Patient_Appointment_Registration_Detials.objects.select_for_update().filter(
            Registration_Id__startswith=prefix
        ).values_list('Registration_Id', flat=True)
        if matching:
            nums = [int(x[len(prefix):]) for x in matching if x[len(prefix):].isdigit()]
            next_num = (max(nums) + 1) if nums else 1
        else:
            next_num = 1
        return f"{prefix}{next_num}"
 





from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import json
import logging
import random
from datetime import timedelta
from faker import Faker
 
# Import your models
from MCI.models import (
    MCI_Patient_IP_Registration_Detials,
    MCI_Patient_Admission_Detials,
    MCI_Patient_Admission_Room_Detials,
    MCI_Room_Master_Detials,
    MCI_Patient_Detials,
    MCI_OP_Patient_Appointment_With_Multiple_Doctor
)
from Masters.models import (
    Doctor_ProfessForm_Detials,
    Insurance_Master_Detials,
    Location_Detials,
    Speciality_Detials
)
 
logger = logging.getLogger(__name__)
fake = Faker()
 
@csrf_exempt
@require_http_methods(["POST"])
def IP_Speciality_Admission_Count_Link(request):
   
    try:
        # Parse request data
        data = json.loads(request.body)
        counts_list = data.get('counts', [])
        created_by = data.get('created_by', 'system')
       
        if not counts_list:
            return JsonResponse({
                'success': False,
                'error': 'No admission counts provided'
            }, status=400)
       
        # Configuration constants
        MAX_IP_ADMISSIONS = 1000
        today = timezone.now().date()
       
        # Gender-specific ward mapping
        GENDER_WARD_MAP = {
            'GENERAL MEDICINE': {'Male': ['MALE MEDICINE'], 'Female': ['FEMALE MEDICINE']},
            'SURGERY': {'Male': ['MALE SURGERY'], 'Female': ['FEMALE SURGERY']},
            'ORTHOPEDICS': {'Male': ['MALE ORTHO'], 'Female': ['FEMALE ORTHO']},
            'ENT': {'Male': ['MALE ENT'], 'Female': ['FEMALE ENT']},
            'OPTHALMOLOGY': {'Male': ['MALE OPTHALMOLOGY'], 'Female': ['FEMALE OPTHALMOLOGY']},
            'DERMATOLOGY': {'Male': ['MALE DERMATOLOGY'], 'Female': ['FEMALE DERMATOLOGY']},
            'PULMONOLOGY': {'Male': ['MALE PULMONOLOGY'], 'Female': ['FEMALE PULMONOLOGY']},
            'UROLOGY': {'Male': ['MALE SURGERY'], 'Female': ['FEMALE SURGERY']},
            'GYNECOLOGY': {'Female': ['GYNAECOLOGY']},
            'OBSTETRICS': {'Female': ['OBSTETRICS']},
            'PAEDIATRICS': {'Male': ['PAEDIATRICS'], 'Female': ['PAEDIATRICS']},
            'PSYCHIATRY': {'Male': ['PSYCHIATRY MALE'], 'Female': ['PSYCHIATRY FEMALE']},
        }
       
        # Helper functions
        def get_realistic_admission_time():
            now = timezone.now()
            offset_minutes = random.randint(-120, 120)
            new_time = now + timedelta(minutes=offset_minutes)
            return new_time.replace(second=0, microsecond=0)
       
        def generate_registration_id():
            prefix = f"FIP{timezone.now():%y%m}"
            with transaction.atomic():
                last = MCI_Patient_IP_Registration_Detials.objects.filter(
                    Registration_Id__startswith=prefix
                ).select_for_update().order_by('-Registration_Id').first()
                num = int(last.Registration_Id[len(prefix):]) + 1 if last and last.Registration_Id[len(prefix):].isdigit() else 1
                return f"{prefix}{num}"
       
        # Check current admission count
        current_admission_count = MCI_Patient_IP_Registration_Detials.objects.filter(
            Status='Admitted'
        ).count()
       
        if current_admission_count >= MAX_IP_ADMISSIONS:
            return JsonResponse({
                'success': False,
                'error': f'Maximum IP admissions reached ({current_admission_count}/{MAX_IP_ADMISSIONS})'
            }, status=400)
       
        # Initialize counters and response data
        total_created = 0
        created_details = []
        warnings = []
       
        # Start transaction
        with transaction.atomic():
            # Double-check admission count within transaction
            current_admission_count = MCI_Patient_IP_Registration_Detials.objects.filter(
                Status='Admitted'
            ).count()
           
            available_slots = MAX_IP_ADMISSIONS - current_admission_count
           
            if available_slots <= 0:
                return JsonResponse({
                    'success': False,
                    'error': f'No available slots for new admissions ({current_admission_count}/{MAX_IP_ADMISSIONS})'
                }, status=400)
           
            # Pre-fetch data for efficiency
            insurance_masters = list(Insurance_Master_Detials.objects.all())
            locations = list(Location_Detials.objects.all())
           
            # Process each speciality
            for item in counts_list:
                if total_created >= available_slots:
                    warnings.append(f"Stopped early: Reached available capacity ({total_created}/{available_slots})")
                    break
               
                spec_name = item.get('speciality', '').strip().upper()
                requested_count = int(item.get('admissionCount', 0))
               
                if requested_count <= 0:
                    warnings.append(f"Skipped {spec_name}: Invalid count ({requested_count})")
                    continue
               
                # Adjust target count based on available slots
                target_count = min(requested_count, available_slots - total_created)
               
                # Verify speciality exists
                spec_obj = Speciality_Detials.objects.filter(
                    Speciality_Name__iexact=spec_name,
                    Status=True
                ).first()
               
                if not spec_obj:
                    warnings.append(f"Skipped {spec_name}: Speciality not found or inactive")
                    continue
               
                # Get IP doctors for this speciality
                doctors = Doctor_ProfessForm_Detials.objects.filter(
                    Specialization=spec_obj,
                    Department__Department_Name='IP'
                ).select_related('Doctor_ID')
               
                if not doctors.exists():
                    warnings.append(f"Skipped {spec_name}: No IP doctors available")
                    continue
               
                # Get patients with OP appointments for this speciality today
                op_appointment_patients = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id__Status='Registered',
                    Registration_Id__created_at__date=today,
                    Registration_Id__IsOriginal=False,
                    Specialization__Speciality_Name__iexact=spec_name
                ).values_list('Registration_Id__PatientId', flat=True).distinct()
               
                # Get currently admitted patients to exclude
                admitted_patients = MCI_Patient_Admission_Room_Detials.objects.filter(
                    CurrentlyStayed=True
                ).values_list('IP_Registration_Id__PatientId', flat=True)
               
                # Get eligible patients
                patients = MCI_Patient_Detials.objects.filter(
                    PatientNo__in=op_appointment_patients
                ).exclude(PatientNo__in=admitted_patients)
               
                # Apply department-specific filters
                if spec_name == 'GYNECOLOGY':
                    patients = patients.filter(Gender='Female', Age__gte=18)
                elif spec_name == 'OBSTETRICS':
                    patients = patients.filter(Gender='Female', Age__gte=18, Age__lte=45)
                elif spec_name == 'PAEDIATRICS':
                    patients = patients.filter(Age__lte=15)
                elif spec_name == 'UROLOGY':
                    patients = patients.filter(Gender='Male', Age__gte=40)
                elif spec_name == 'OPTHALMOLOGY':
                    patients = patients.filter(Age__gte=45)
                elif spec_name == 'PSYCHIATRY':
                    patients = patients.filter(Age__gte=18)
                elif spec_name == 'DERMATOLOGY':
                    patients = patients.all()  # All ages
                elif spec_name == 'ENT':
                    patients = patients.all()  # All ages
                elif spec_name == 'PULMONOLOGY':
                    patients = patients.filter(Age__gte=18)
                elif spec_name == 'ORTHOPEDICS':
                    patients = patients.filter(Age__gte=16)
                elif spec_name == 'SURGERY':
                    patients = patients.filter(Age__gte=18)
                elif spec_name == 'GENERAL MEDICINE':
                    patients = patients.filter(Age__gte=18)
                else:
                    patients = patients.filter(Age__gte=18)  # Default for other departments
               
                if not patients.exists():
                    warnings.append(f"Skipped {spec_name}: No eligible patients available")
                    continue
               
                # Get wards for this speciality
                wards = GENDER_WARD_MAP.get(spec_name, {})
                if not wards:
                    warnings.append(f"Skipped {spec_name}: No ward configuration found")
                    continue
               
                # Flatten ward list for room query
                all_wards = []
                for gender_wards in wards.values():
                    all_wards.extend(gender_wards)
               
                # Get available rooms
                available_rooms = MCI_Room_Master_Detials.objects.filter(
                    Booking_Status='Available',
                    Ward_Name__Ward_Name__Ward_Name__in=all_wards
                ).select_related('Ward_Name__Ward_Name')
               
                if not available_rooms.exists():
                    warnings.append(f"Skipped {spec_name}: No available rooms in configured wards")
                    continue
               
                # Convert to lists for random selection
                patients_list = list(patients)
                rooms_list = list(available_rooms)
               
                # Create admissions for this speciality
                created_for_spec = 0
                attempts = 0
                max_attempts = target_count * 5  # Prevent infinite loops
               
                while created_for_spec < target_count and attempts < max_attempts:
                    attempts += 1
                   
                    # Check resource availability
                    if not patients_list or not rooms_list:
                        break
                   
                    # Select random patient
                    patient = random.choice(patients_list)
                    gender = patient.Gender
                   
                    # Check if speciality supports this gender
                    if gender not in wards:
                        # Remove incompatible patient
                        patients_list = [p for p in patients_list if p.PatientId != patient.PatientId]
                        continue
                   
                    # Get gender-specific wards
                    gender_wards = wards[gender]
                   
                    # Get rooms for this gender
                    gender_rooms = [room for room in rooms_list
                                  if room.Ward_Name.Ward_Name.Ward_Name in gender_wards]
                   
                    if not gender_rooms:
                        # Remove patient without suitable room
                        patients_list = [p for p in patients_list if p.PatientId != patient.PatientId]
                        continue
                   
                    # Select resources
                    room = random.choice(gender_rooms)
                    doctor_entry = random.choice(list(doctors))
                    doctor = doctor_entry.Doctor_ID
                   
                    # Determine patient category
                    category = random.choices(
                        ['General', 'Insurance', 'Student'],
                        weights=[12, 3, 1], k=1
                    )[0]
                   
                    # Set insurance if applicable
                    insurance = None
                    insurance_type = None
                    if category == 'Insurance' and insurance_masters:
                        insurance = random.choice(insurance_masters)
                        insurance_type = random.choice(['HMO', 'PPO', 'POS'])
                   
                    # Set location
                    location = random.choice(locations) if locations else None
                   
                    # Generate timing and ID
                    admission_time = get_realistic_admission_time()
                    reg_id = generate_registration_id()
                   
                    # Create IP Registration
                    ip_reg = MCI_Patient_IP_Registration_Detials.objects.create(
                        # Registration_Id=reg_id,
                        PatientId=patient,
                        Specialization=spec_obj,
                        PrimaryDoctor=doctor,
                        Complaint=fake.paragraph(nb_sentences=2),
                        IsMLC='No',
                        IsReferral='No',
                        PatientCategory=category,
                        InsuranceName=insurance,
                        InsuranceType=insurance_type,
                        Status='Admitted',
                        Booking_Status='Occupied',
                        Location=location,
                        created_by=created_by,
                        created_at=admission_time,
                    )
                   
                    # Create Admission Details
                    MCI_Patient_Admission_Detials.objects.create(
                        IP_Registration_Id=ip_reg,
                        AdmissionPurpose=f'Routine {spec_name} Admission',
                        DrInchargeAtTimeOfAdmission=doctor,
                        NextToKinName=fake.name() if random.random() > 0.6 else None,
                        visitDate=admission_time.date(),
                        visitTime=admission_time.time(),
                        created_by=created_by,
                    )
                   
                    # Create Room Allocation
                    MCI_Patient_Admission_Room_Detials.objects.create(
                        RegisterType='IP',
                        IP_Registration_Id=ip_reg,
                        RoomId=room,
                        Admitted_Date=admission_time,
                        Status=True,
                        IsStayed=True,
                        CurrentlyStayed=True,
                        Iscanceled=False,
                        created_by=created_by,
                    )
                   
                    # Update room status
                    room.Booking_Status = 'Occupied'
                    room.save()
                   
                    # Remove used resources
                    rooms_list.remove(room)
                    patients_list = [p for p in patients_list if p.PatientId != patient.PatientId]
                   
                    created_for_spec += 1
                    total_created += 1
                   
                    # Record details
                    created_details.append({
                        'patient_id': str(patient.PatientId),
                        'registration_id': reg_id,
                        'speciality': spec_name,
                        'gender': gender,
                        'age': patient.Age,
                        'ward': room.Ward_Name.Ward_Name.Ward_Name,
                        'room': room.Room_No if hasattr(room, 'Room_No') else 'N/A',
                        'admission_time': admission_time.strftime('%H:%M'),
                        'category': category
                    })
               
                if created_for_spec < target_count:
                    warnings.append(f"{spec_name}: Only created {created_for_spec}/{target_count} admissions (insufficient resources)")
                else:
                    logger.info(f"Successfully created {created_for_spec} admissions for {spec_name}")
           
            # End of transaction
           
        # Get final admission count
        final_count = MCI_Patient_IP_Registration_Detials.objects.filter(
            Status='Admitted'
        ).count()
       
        # Prepare response
        response_data = {
            'success': f'Successfully created {total_created} IP admission(s)'            
        }
       
        if warnings:
            response_data['warnings'] = warnings
       
        return JsonResponse(response_data)
       
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format in request body'
        }, status=400)
    except KeyError as e:
        return JsonResponse({
            'success': False,
            'error': f'Missing required field: {str(e)}'
        }, status=400)
    except Exception as e:
        logger.error(f"IP Admission POST failed: {str(e)}", exc_info=True)
        return JsonResponse({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }, status=500)
 

@csrf_exempt
@require_http_methods(["POST"])
def Casuality_Speciality_Admission_Count_Link(request):
    try:
        data = json.loads(request.body)
        counts_list = data.get('counts', [])
        created_by = data.get('created_by', 'system')
 
        if not counts_list:
            return JsonResponse({'error': 'No admission counts provided'}, status=400)
 
        # Pre-fetch required data
        locations = list(Location_Detials.objects.all())
        doctor_specs = Doctor_ProfessForm_Detials.objects.filter(
            Specialization__isnull=False,
            Department__Department_Name='IP'
        ).select_related('Doctor_ID', 'Specialization')
 
        # Exclude patients already in OP or IP
        active_op = MCI_Patient_Appointment_Registration_Detials.objects.filter(Status='Registered',created_at__date=today,IsOriginal = False).values_list('PatientId', flat=True)
        active_ip = MCI_Patient_Admission_Room_Detials.objects.filter(CurrentlyStayed=True).values_list('IP_Registration_Id__PatientId', flat=True)
        available_patients = MCI_Patient_Detials.objects.exclude(PatientNo__in=active_ip).filter(PatientNo__in=active_op)
 
        total_created = 0
 
        with transaction.atomic():
            for item in counts_list:
                spec_name = item.get('speciality')
                target_count = int(item.get('admissionCount', 0))
                if target_count <= 0:
                    continue
 
                spec_obj = Speciality_Detials.objects.filter(Speciality_Name__iexact=spec_name, Status=True).first()
                if not spec_obj:
                    continue
 
                # Special case: Gynae & Obs use same doctors
             
                doctors = doctor_specs.filter(Specialization=spec_obj)
 
                if not doctors.exists():
                    continue
 
                # Age/Gender filters
                patients = available_patients
                if spec_name == 'GYNECOLOGY':
                    patients = patients.filter(Gender='Female', Age__gte=18)
                elif spec_name == 'PAEDIATRICS':
                    patients = patients.filter(Age__lte=14)
                elif spec_name == 'OBSTETRICS':
                    patients = patients.filter(Gender='Female', Age__gte=19, Age__lte=30)
                elif spec_name == 'OPTHALMOLOGY':
                    patients = patients.filter(Age__gte=40)
 
                if not patients.exists():
                    continue
 
                # Available beds in relevant wards
                ward_names = {
                    'GENERAL MEDICINE': ['CASUALITY', 'CASUALITY'],
                    'SURGERY': ['CASUALITY', 'CASUALITY'],
                    'ENT': ['CASUALITY', 'CASUALITY'],
                    'ORTHOPEDICS': ['CASUALITY', 'CASUALITY'],
                    'GYNECOLOGY': ['CASUALITY'],
                    'OBSTETRICS': ['CASUALITY'],
                    'PAEDIATRICS': ['CASUALITY'],
                    'OPTHALMOLOGY': ['CASUALITY', 'CASUALITY'],
                    'DERMATOLOGY': ['CASUALITY', 'CASUALITY'],
                    'PULMONOLOGY': ['CASUALITY', 'CASUALITY'],
                    'PSYCHIATRY' : ['CASUALITY','CASUALITY'],
                    'UROLOGY' : ['CASUALITY', 'CASUALITY'],
                }.get(spec_name, [])
 
 
                def get_realistic_admission_time():
                    now = timezone.now()
                    offset_minutes = random.randint(-120, 120)
                    new_time = now + timedelta(minutes=offset_minutes)
                    return new_time.replace(second=0, microsecond=0)
 
                available_rooms = MCI_Room_Master_Detials.objects.filter(
                    Booking_Status='Available',
                    Ward_Name__Ward_Name__Ward_Name__in=ward_names
                )
 
                admission_time = get_realistic_admission_time()
 
 
                rooms_list = list(available_rooms)
                patients_list = list(patients[:target_count * 2])  # Extra buffer
 
                created_for_spec = 0
                for _ in range(target_count):
                    if not rooms_list or not patients_list:
                        break
 
                    room = random.choice(rooms_list)
                    patient = random.choice(patients_list)
                    doctor = random.choice(list(doctors))
 
                    # Create IP Registration
                    reg_id = f"FIP{date.today().strftime('%y%m')}{MCI_Patient_IP_Registration_Detials.objects.count() + 1000 + created_for_spec:04d}"
                    ip_reg = MCI_Patient_IP_Registration_Detials(
                        # Registration_Id=reg_id,
                        PatientId=patient,
                        Specialization=spec_obj,
                        PrimaryDoctor=doctor.Doctor_ID,
                        Complaint="Auto-generated admission",
                        PatientCategory="General",
                        Status="Admitted",
                        Booking_Status="Occupied",
                        Location=random.choice(locations) if locations else None,
                        created_by=created_by,
                        created_at=admission_time,
 
                    )
                    ip_reg.save()
 
                    # Admission Details
                    MCI_Patient_Admission_Detials.objects.create(
                        IP_Registration_Id=ip_reg,
                        AdmissionPurpose="Planned Admission",
                        DrInchargeAtTimeOfAdmission=doctor.Doctor_ID,
                        visitDate=date.today(),
                        created_by=created_by
                    )
 
                    # Room Allocation
                    MCI_Patient_Admission_Room_Detials.objects.create(
                        RegisterType='IP',
                        IP_Registration_Id=ip_reg,
                        RoomId=room,
                        Admitted_Date=timezone.now(),
                        Status=True,
                        IsStayed=True,
                        CurrentlyStayed=True,
                        created_by=created_by
                    )
 
                    room.Booking_Status = 'Occupied'
                    room.save()
 
                    # Remove used resources
                    rooms_list.remove(room)
                    patients_list = [p for p in patients_list if p.PatientId != patient.PatientId]
 
                    created_for_spec += 1
                    total_created += 1
 
        return JsonResponse({'success': f'{total_created} IP admissions created successfully'})
 
    except Exception as e:
        return JsonResponse({'error': f'Failed: {str(e)}'}, status=500)
 
 
 
 


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MCI_Patient_Registration(request):
       
    @transaction.atomic
    def validate_and_process_file(file):
    
        
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            compressed_data = None
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='PNG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            output.seek(0)
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            compressed_data = output.getvalue()
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        if file:
            file_data = file.split(',')[1]
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                print('maximum mb')
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)
            
            if file_type == 'image/jpeg' or file_type == 'image/png':
                try:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, compressed_size = compress_image(image)
                    return compressed_image_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing image: {str(e)}'})

            elif file_type == 'application/pdf':
                try:
                    compressed_pdf_data, compressed_size = compress_pdf(BytesIO(file_content))

                    return compressed_pdf_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing PDF: {str(e)}'})

            else:
                return JsonResponse({'warn': 'Unsupported file format'})

        return None
    
    
    if request.method == 'POST':

        print(request.method,'requesttttttttt')
        try:

            print('patient registerrrrrrrrrrrrrr')
            data = json.loads(request.body)
            print(data,'data')
            
            # Extract and validate data
            
            Patient_profile_photo = data.get('Photo', None)
            Patient_profile_photo_prossed = validate_and_process_file(Patient_profile_photo) if Patient_profile_photo else None
            patient_id = data.get('PatientId','')
            title = data.get('Title', '')
            first_name = data.get('FirstName', '')
            middle_name = data.get('MiddleName', '')
            sur_name = data.get('SurName', '')
            gender = data.get('Gender', '')
            MaritalStatus = data.get('MaritalStatus', '')
            SpouseName = data.get('SpouseName', '')
            FatherName = data.get('FatherName', '')
            dob = data.get('DOB', '')
            age = data.get('Age', '')
            phone_no = data.get('PhoneNo', '')
            email = data.get('Email', '')
            blood_group = data.get('BloodGroup', '')
            occupation = data.get('Occupation', '')
            religion = data.get('Religion', '')
            nationality = data.get('Nationality', '')
            unique_id_type = data.get('UHIDType', '')
            unique_id_no = data.get('UHIDNo', '')
            patient_type = data.get('PatientType', '')
            patient_category = data.get('PatientCategory', '')
            insurance_name = data.get('InsuranceName', '')
            insurance_type = data.get('InsuranceType', '')
            client_name = data.get('ClientName', '')
            client_type = data.get('ClientType', '')
            client_employee_id = data.get('ClientEmployeeId', '')
            client_employee_designation = data.get('ClientEmployeeDesignation', '')
            client_employee_relation = data.get('ClientEmployeeRelation', '')
            CorporateName = data.get('CorporateName', '')
            CorporateType = data.get('CorporateType', '')
            CorporateEmployeeId = data.get('CorporateEmployeeId', '')
            CorporateEmployeeDesignation = data.get('CorporateEmployeeDesignation', '')
            CorporateEmployeeRelation = data.get('CorporateEmployeeRelation', '')
            employee_id = data.get('EmployeeId', '')
            employee_relation = data.get('EmployeeRelation', '')
            doctor_id = data.get('DoctorId', '')
            doctor_relation = data.get('DoctorRelation', '')
            donation_type = data.get('DonationType', '')
            flagging = data.get('Flagging', '')
            
            pincode = data.get('Pincode', '')
            door_no = data.get('DoorNo', '')
            street = data.get('Street', '')
            area = data.get('Area', '')
            city = data.get('City', '')
            District = data.get('District', '')
            state = data.get('State', '')
            country = data.get('Country', '')

            PermanentAddressSameAsAbove = data.get('PermanentAddressSameAsAbove', '')
            
            PermanentPincode = data.get('PermanentPincode', '')
            PermanentdoorNo = data.get('PermanentdoorNo', '')
            PermanentStreet = data.get('PermanentStreet', '')
            PermanentArea = data.get('PermanentArea', '')
            PermanentCity = data.get('PermanentCity', '')
            PermanentDistrict = data.get('PermanentDistrict', '')
            PermanentState = data.get('PermanentState', '')
            PermanentCountry = data.get('PermanentCountry', '')
            Appointment_Id = data.get('AppointmentToRegistrationId', '')


            doctor_name = data.get('DoctorName', '')
            IsConsciousness = data.get('IsConsciousness','')
            IsConsciousness=True if IsConsciousness=='Yes' else False
            created_by = data.get('Created_by', '')
            ABHA = data.get('ABHA', '')
            

            doctor_name = data.get('DoctorID', '')
            specialization = data.get('SpecializationId', '')
            ExistingPtNo = data.get('ExistingPtNo', '')
            DateOfReg = data.get('DateOfReg', '')
            LastVisitDate = data.get('LastVisitDate', '')
            OldDepartment = data.get('OldDepartment','')
            Year = data.get('Year','')

            print(OldDepartment,'OldDepartment')

            upper_name = first_name.upper()
            
            specialization_instance = Speciality_Detials.objects.get(Speciality_Id=specialization) if specialization else None
            doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
            # DrInchargeatTimeofAdmission_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DrInchargeatTimeofAdmission) if DrInchargeatTimeofAdmission else None
            # referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=referred_by) if referred_by else None
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            religion_instance = Religion_Detials.objects.get(Religion_Id=religion) if religion else None
            # location_instance = Location_Detials.objects.get(Location_Id=Location_Id) if Location_Id else None
            # roomid_instance = Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None
            # Flagging_instance = Flaggcolor_Detials.objects.get(Flagg_Id=flagging) if flagging else None
            # BloodGroup_instance = BloodGroup_Detials.objects.get(BloodGroup_Id=blood_group) if blood_group else None
            Title_instance = Title_Detials.objects.get(Title_Id=title) if title else None
            

            Insurance_instance = None
            if insurance_name:
              Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) 
             
            print(Insurance_instance,'Insurance_instanceqqqqqqqqqqqq')
            
            Client_instance = None
            if client_name:
               Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) 
            
            Donation_instance = None
            if donation_type:
               Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) 
            
            Corporate_instance = None
            if CorporateName:
               Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) 
            
            print(Client_instance,'Client_instanceqqqqqqqqqqq')
            
            Flagging_instance = None
            if flagging:
                Flagging_instance = Flaggcolor_Detials.objects.get(Flagg_Id=flagging)
            
            print(Flagging_instance,'Flagging_instance')

            BloodGroup_instance = None
            if blood_group:
                BloodGroup_instance = BloodGroup_Detials.objects.get(BloodGroup_Id=blood_group)
            
            print(BloodGroup_instance,'blood_groupqqqqqqqqqqq')

            AppointmentId_instance = Appointment_Request_List.objects.get(appointment_id=Appointment_Id) if Appointment_Id else None

            with transaction.atomic():
                patient=None
                if patient_id :
                    patient = MCI_Patient_Detials.objects.get(PatientId=patient_id)
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    print('Checking for existing patient...')

                    matching_patients = MCI_Patient_Detials.objects.filter(
                        Q(PhoneNo=phone_no)
                    ).exclude(PatientId=patient_id)

                    for patient in matching_patients:
                        print(f"Checking PatientId: {patient.PatientId}")

                        matched_fields = []

                        # Only check FirstName if you entered something
                        if first_name and patient.FirstName.upper() == first_name.upper():
                            matched_fields.append('FirstName')

                        if sur_name and patient.SurName.upper() == sur_name.upper():
                            matched_fields.append('SurName')

                        if middle_name and patient.MiddleName.upper() == middle_name.upper():
                            matched_fields.append('MiddleName')

                        # if dob and patient.DOB == dob:
                        #     matched_fields.append('DOB')

                        if area and patient.Area == area:
                            matched_fields.append('Area')

                        if ExistingPtNo and patient.ExistingPtNo == ExistingPtNo:
                            matched_fields.append('ExistingPtNo')

                        if unique_id_no and patient.UniqueIdNo == unique_id_no:
                            matched_fields.append('UniqueIdNo')

                        if matched_fields:
                            print(f"Matched fields: {matched_fields}")
                            return JsonResponse({
                                'warn': f"The Patient {patient.PatientId} is already registered with {phone_no}. Matching fields: {', '.join(matched_fields)}"
                            })

                    print('No matching patient found.')

                    
                        
                
                    patient = MCI_Patient_Detials.objects.get(PatientId=patient_id)
                    patient.Patient_profile = Patient_profile_photo_prossed
                    patient.ExistingPtNo = ExistingPtNo
                    patient.DateOfReg = DateOfReg
                    patient.LastVisitDate = LastVisitDate
                    patient.Title = Title_instance
                    patient.FirstName = first_name
                    patient.MiddleName = middle_name
                    patient.SurName = sur_name
                    patient.Gender = gender
                    patient.MaritalStatus = MaritalStatus
                    patient.SpouseName = SpouseName
                    patient.FatherName = FatherName
                    patient.DOB = dob
                    patient.Age = age
                    patient.PhoneNo = phone_no
                    patient.Email = email
                    patient.BloodGroup = BloodGroup_instance
                    patient.Occupation = occupation
                    patient.Religion = religion_instance
                    patient.Nationality = nationality
                    patient.UniqueIdType = unique_id_type
                    patient.UniqueIdNo = unique_id_no
                    patient.PatientType = patient_type
                    patient.Pincode = pincode
                    patient.DoorNo = door_no
                    patient.Street = street
                    patient.Area = area
                    patient.City = city
                    patient.District = District
                    patient.State = state
                    patient.Country = country
                    patient.PermanentAddressSameAsAbove = PermanentAddressSameAsAbove
                    patient.PermanentPincode = PermanentPincode
                    patient.PermanentdoorNo = PermanentdoorNo
                    patient.PermanentStreet = PermanentStreet
                    patient.PermanentArea = PermanentArea
                    patient.PermanentCity = PermanentCity
                    patient.PermanentDistrict = PermanentDistrict
                    patient.PermanentState = PermanentState
                    patient.PermanentCountry = PermanentCountry
                    patient.ABHA = ABHA
                    patient.updated_by = created_by
                    
                    patient.save()

                    # LabPatient = Register_patient_Details.objects.filter(Patient_Id=patient_id).first()
                    # print(LabPatient,'LabPatient')
                    # if LabPatient:

                    #     LabPatient.Title = Title_instance.Title_Name
                    #     LabPatient.Patient_Name = patient.FirstName
                    #     LabPatient.Age = patient.Age
                    #     LabPatient.Gender = patient.Gender
                    #     LabPatient.save()



                else:
                    
                    print('Checking for existing patient...')

                    matching_patients = MCI_Patient_Detials.objects.filter(
                        Q(PhoneNo=phone_no)
                    ).exclude(PatientId=patient_id)

                    for patient in matching_patients:
                        print(f"Checking PatientId: {patient.PatientId}")

                        matched_fields = []

                        # Only check FirstName if you entered something
                        if first_name and patient.FirstName.upper() == first_name.upper():
                            matched_fields.append('FirstName')

                        if sur_name and patient.SurName.upper() == sur_name.upper():
                            matched_fields.append('SurName')

                        if middle_name and patient.MiddleName.upper() == middle_name.upper():
                            matched_fields.append('MiddleName')

                        # if dob and patient.DOB == dob:
                        #     matched_fields.append('DOB')

                        if area and patient.Area == area:
                            matched_fields.append('Area')

                        if ExistingPtNo and patient.ExistingPtNo == ExistingPtNo:
                            matched_fields.append('ExistingPtNo')

                        if unique_id_no and patient.UniqueIdNo == unique_id_no:
                            matched_fields.append('UniqueIdNo')

                        if matched_fields:
                            print(f"Matched fields: {matched_fields}")
                            return JsonResponse({
                                'warn': f"The Patient {patient.PatientId} is already registered with {phone_no}. Matching fields: {', '.join(matched_fields)}"
                            })

                    print('No matching patient found.')

                        
    
                        
                    patient = MCI_Patient_Detials.objects.create(
                        Patient_profile = Patient_profile_photo_prossed,
                        ExistingPtNo=ExistingPtNo,                      
                        Title=Title_instance,
                        appointmentId=AppointmentId_instance,
                        FirstName=first_name,
                        MiddleName=middle_name, 
                        SurName=sur_name, 
                        Gender=gender, 
                        # AliasName=alias_name, 
                        MaritalStatus=MaritalStatus, 
                        SpouseName=SpouseName, 
                        FatherName=FatherName, 
                        DOB=dob, 
                        Age=age, 
                        PhoneNo=phone_no,
                        Email=email, 
                        BloodGroup=BloodGroup_instance, 
                        Occupation=occupation, 
                        Religion=religion_instance, 
                        Nationality=nationality, 
                        UniqueIdType=unique_id_type, 
                        UniqueIdNo=unique_id_no, 

                        PatientType = patient_type, 
                        
                        
                        Pincode=pincode, 
                        DoorNo=door_no, 
                        Street=street, 
                        Area=area, 
                        City=city, 
                        District=District, 
                        State=state, 
                        Country=country, 
                        
                        LedgerName = upper_name,
                        LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2),
                        OpeningBalance = 0,
                        DebitOrCredit = 'Dr',

                        PermanentAddressSameAsAbove=PermanentAddressSameAsAbove, 
                        PermanentPincode=PermanentPincode, 
                        PermanentdoorNo=PermanentdoorNo, 
                        PermanentStreet=PermanentStreet, 
                        PermanentArea=PermanentArea, 
                        PermanentCity=PermanentCity, 
                        PermanentDistrict=PermanentDistrict, 
                        PermanentState=PermanentState, 
                        PermanentCountry=PermanentCountry, 
                        ABHA=ABHA,
                        DoctorID=doctor_name_instance,
                        SpecializationId=specialization_instance,
                        created_by=created_by,
                        
                    )

                    
                    
                data['patient_id'] = patient.PatientId
                return JsonResponse({'success': 'Patient Detials Saved successfully','data': [data]},safe=False)

        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient with the given ID does not exist'})
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor or referred doctor does not exist'})
        except Exception as e:
            return JsonResponse({'error': str(e)})

    elif request.method == 'GET':
        try:
            patient_id = request.GET.get('PatientId')
            if patient_id:
                patient = MCI_Patient_Detials.objects.get(PatientId=patient_id)
                return JsonResponse({
                    'id': patient.PatientId,
                    'phoneNo': patient.PhoneNo,
                    'firstName': patient.FirstName,
                    'lastName': patient.SurName,
                })
            else:
                patients = list(MCI_Patient_Detials.objects.values())
                return JsonResponse(patients, safe=False)
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient with the given ID does not exist'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def MCI_Register_Patients_Details(request):
    try:
        status = request.GET.get('status', '')

        today = now().date()

        queryset = MCI_Patient_Detials.objects.filter(created_at__date=today)

        if status:
            queryset = queryset.filter(Status__iexact=status)



        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientNo,
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'Title': patient.Title.Title_Id if patient.Title else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'ExistingPtNo': patient.ExistingPtNo,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'MaritalStatus': patient.MaritalStatus,
                'SpouseName': patient.SpouseName,
                'FatherName': patient.FatherName,
                'DOB': patient.DOB,
                'Age': patient.Age,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
                'Occupation': patient.Occupation,
                'Religion': patient.Religion.Religion_Name if patient.Religion else None,
                'Nationality': patient.Nationality,
                'UHIDType': patient.UniqueIdType,
                'UHIDNo': patient.UniqueIdNo,
                'PatientType': patient.PatientType,

                # Address picking priority: permanent > present
                'DoorNo': patient.PermanentdoorNo or patient.DoorNo,
                'Street': patient.PermanentStreet or patient.Street,
                'Area': patient.PermanentArea or patient.Area,
                'City': patient.PermanentCity or patient.City,
                'District': patient.PermanentDistrict or patient.District,
                'State': patient.PermanentState or patient.State,
                'Country': patient.PermanentCountry or patient.Country,
                'Pincode': patient.PermanentPincode or patient.Pincode,

                'ABHA': patient.ABHA,
                'Email': patient.Email,
                'Status': patient.Status,
                'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
                'SpecializationId': patient.SpecializationId.Speciality_Id if patient.SpecializationId else None,

                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),

                'created_by': patient.created_by
            }
            for idx, patient in enumerate(queryset, start=1)
        ]

        return JsonResponse(patient_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def MCI_Fetch_Register_Patients_Details(request):
    try:
        # Get the PatientId from the query parameters
        patient_id = request.GET.get('PatientId')
 
        if not patient_id:
            return JsonResponse({'error': 'PatientId parameter is required'}, status=400)
 
        # Fetch the patient details based on the provided PatientId
        patient = MCI_Patient_Detials.objects.filter(PatientNo=patient_id).first()
 
        if not patient:
            return JsonResponse({'error': 'Patient not found'}, status=404)
       
        # idx = 1
        # Prepare patient data for the response
        patient_data = {
            # 'id': idx,
            'PatientId': patient.PatientNo,
            'Title': patient.Title.Title_Id if patient.Title else None,
            'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
            'AppointmentId': patient.appointmentId.pk if patient.appointmentId else None,
            # 'DateOfReg': patient.DateOfReg,
            # 'LastVisitDate': patient.LastVisitDate,
            # 'OldDepartment' : patient.OldDepartment,
            # 'YearNo' : patient.YearNo,
            # 'ExistingPtNo' : patient.ExistingPtNo,
            'FirstName': patient.FirstName,
            'MiddleName': patient.MiddleName,
            'SurName': patient.SurName,
            'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
            'Gender': patient.Gender,
            'MaritalStatus': patient.MaritalStatus,
            'SpouseName': patient.SpouseName,
            'FatherName': patient.FatherName,
            'DOB': patient.DOB,
            'Age': patient.Age,
            'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
            'Occupation': patient.Occupation,
            'Religion': patient.Religion.Religion_Id if patient.Religion else None,
            'Nationality': patient.Nationality,
            'UHIDType': patient.UniqueIdType,
            'UHIDNo': patient.UniqueIdNo,
            'PatientType': patient.PatientType,
            'PermanentPincode': patient.PermanentPincode,
            'PermanentdoorNo': patient.PermanentdoorNo,
            'PermanentStreet': patient.PermanentStreet,
            'PermanentArea': patient.PermanentArea,
            'PermanentCity': patient.PermanentCity,
            'PermanentDistrict': patient.PermanentDistrict,
            'PermanentState': patient.PermanentState,
            'PermanentCountry': patient.PermanentCountry,
            'Pincode': patient.Pincode,
            'DoorNo': patient.DoorNo,
            'Street': patient.Street,
            'Area': patient.Area,
            'City': patient.City,
            'District': patient.District,
            'State': patient.State,
            'Country': patient.Country,
            'ABHA': patient.ABHA,
            'Email': patient.Email,
            # 'AppointmentType': patient.appointmentId.appointment_type if  patient.appointmentId else None,
            # 'ReferalDoctor_Id': patient.appointmentId.ReferredBy.Doctor_ID if  patient.appointmentId and patient.appointmentId.ReferredBy else None,
            # 'ReferalDoctorName': " ".join(filter(None, [
            #                         getattr(patient.appointmentId.ReferredBy.Tittle, 'Title_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy and patient.appointmentId.ReferredBy.Tittle else '',
            #                         getattr(patient.appointmentId.ReferredBy, 'First_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy else '',
            #                         getattr(patient.appointmentId.ReferredBy, 'Middle_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy else '',
            #                         getattr(patient.appointmentId.ReferredBy, 'Last_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy else ''
            #                     ])),
 
            'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
            'SpecializationId': patient.SpecializationId.Speciality_Id if patient.SpecializationId else None,
            'date': patient.created_at.strftime('%Y-%m-%d'),
            'CurrDate': patient.created_at.strftime('%d-%m-%y'),
            'CurrTime': patient.created_at.strftime('%H:%M:%S'),
        }
        # idx+=1
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MRD_Patient_OP_Registration(request):


    @transaction.atomic
    def generate_or_update_visit_id(patient, register_type):
        today = datetime.now().date()

        # Get the highest VisitId for today only
        max_visit_id_today = MCI_Patient_Visit_Detials.objects.filter(
            PatientId=patient,
            # created_at__date=today
        ).aggregate(max_id=Max('VisitId'))['max_id']

        # If no visits today, start from 1, otherwise increment
        next_visit_id = 1 if max_visit_id_today is None else max_visit_id_today + 1
        
        patient_visit = MCI_Patient_Visit_Detials.objects.create(
            PatientId=patient,
            VisitId=next_visit_id,
            RegisterType=register_type
        )
        
        print(patient_visit,'patient_visit----------')
        print(patient_visit.VisitId,'patient_visit.VisitId----------')
    

        return patient_visit.VisitId
        
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            
            patient_id = data.get('PatientId','')

            AppointmentId = data.get('AppointmentId', '')
            
            RegistrationId = data.get('RegistrationId', '')
            
            register_type = data.get('RegisterType', '') #visit purpose
            
            VisitType = data.get('VisitType', '')

            Speciality = data.get('Speciality', '')
            DoctorName = data.get('DoctorName', '')
            TokenNo = data.get('TokenNo', '')
            Complaint = data.get('Complaint', '')
            
            IsMLC = data.get('IsMLC', '')
            IsReferral = data.get('IsReferral', '')
            ReferralSource = data.get('ReferralSource', '')
            ReferredBy = data.get('ReferredBy', '')
            NextToKinName = data.get('NextToKinName', '')
            Relation = data.get('Relation', '')
            RelativePhoneNo = data.get('RelativePhoneNo', '')
         
            patient_category = data.get('PatientCategory', '')
            insurance_name = data.get('InsuranceName', '')
            insurance_type = data.get('InsuranceType', '')
           
            client_name = data.get('ClientName', '')
            client_type = data.get('ClientType', '')
            client_employee_id = data.get('ClientEmployeeId', '')
            client_employee_designation = data.get('ClientEmployeeDesignation', '')
            client_employee_relation = data.get('ClientEmployeeRelation', '')
           
            CorporateName = data.get('CorporateName', '')
            CorporateType = data.get('CorporateType', '')
            CorporateEmployeeId = data.get('CorporateEmployeeId', '')
            CorporateEmployeeDesignation = data.get('CorporateEmployeeDesignation', '')
            CorporateEmployeeRelation = data.get('CorporateEmployeeRelation', '')
           
            employee_id = data.get('EmployeeId', '')
            employee_relation = data.get('EmployeeRelation', '')
           
            doctor_id = data.get('DoctorId', '')
            doctor_relation = data.get('DoctorRelation', '')
            
            donation_type = data.get('DonationType', '')
            ServiceCategory = data.get('ServiceCategory', '')
            ServiceSubCategory = data.get('ServiceSubCategory', '')
            
            
            created_by = data.get('Created_by', '')
           
            Testname_arr = data.get('SubtestNoArr', [])
            Appoint_list = data.get('Appoint_list',[])
            RegisterData = data.get('RegisterData',{})

            ABHA = RegisterData.get('ABHA','')
            Title = RegisterData.get('Title','')
            FirstName = RegisterData.get('FirstName','')
            MiddleName = RegisterData.get('MiddleName','')
            SurName = RegisterData.get('SurName','')
            Gender = RegisterData.get('Gender','')
            MaritalStatus = RegisterData.get('MaritalStatus','')
            SpouseName = RegisterData.get('SpouseName','')
            FatherName = RegisterData.get('FatherName','')
            DOB = RegisterData.get('DOB','')
            Age = RegisterData.get('Age','')
            PhoneNo = RegisterData.get('PhoneNo','')
            Email = RegisterData.get('Email','')
            BloodGroup = RegisterData.get('BloodGroup','')
            Occupation = RegisterData.get('Occupation','')
            Nationality = RegisterData.get('Nationality','')
            UHIDType = RegisterData.get('UHIDType','')
            UHIDNo = RegisterData.get('UHIDNo','')
            PatientType = RegisterData.get('PatientType','')
            Pincode = RegisterData.get('Pincode','')
            DoorNo = RegisterData.get('DoorNo','')
            Street = RegisterData.get('Street','')
            Area = RegisterData.get('Area','')
            City = RegisterData.get('City','')
            District = RegisterData.get('District','')
            State = RegisterData.get('State','')
            Country = RegisterData.get('Country','')
            Religion = RegisterData.get('Religion','')
            
            RefDocRegistrationId = data.get('RefDocRegistrationId','')
            RefDoctorId = data.get('RefDoctorId','')
            
            Titleins = Title_Detials.objects.get(Title_Id=Title) if Title else None
            BloodGroupins = BloodGroup_Detials.objects.get(BloodGroup_Id = BloodGroup) if BloodGroup else None
            Religionins = Religion_Detials.objects.get(Religion_Id = Religion) if Religion else None
            
            location = data.get("location")
            package_arr = data.get('PackageArr', [])
            favourites_arr = data.get('FavouritesArr', [])
            indivitual_arr = data.get('IndivitualArr', [])

            # specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
            # doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DoctorName) if DoctorName else None
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
            Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
            Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
            Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
            
            Appointment_ins=None
            Appointment_ins = Appointment_Request_List.objects.filter(appointment_id=AppointmentId).first()
           
            
            patient=None
            patient = MCI_Patient_Detials.objects.get(PatientNo=patient_id)
            
            if RegistrationId :
 
                Billpage = ""
                OP_Patient = MCI_Patient_Appointment_Registration_Detials.objects.get(OPNo=RegistrationId)
               
                OP_Patient.PatientId = patient
                OP_Patient.VisitPurpose = register_type
                # OP_Patient.Specialization = specialization_instance
                # OP_Patient.PrimaryDoctor = doctor_name_instance
                # OP_Patient.Complaint = Complaint
                OP_Patient.IsMLC = IsMLC
                # OP_Patient.TokenNo = TokenNo
                OP_Patient.IsReferral = IsReferral
                OP_Patient.NextToKinName = NextToKinName
                OP_Patient.Relation = Relation
                OP_Patient.RelativePhNo = RelativePhoneNo
                OP_Patient.PatientCategory = patient_category
                OP_Patient.InsuranceName = Insurance_instance
                OP_Patient.InsuranceType = insurance_type
                OP_Patient.ClientName = Client_instance
                OP_Patient.ClientType = client_type
                OP_Patient.ClientEmployeeId = client_employee_id
                OP_Patient.ClientEmployeeDesignation = client_employee_designation
                OP_Patient.ClientEmployeeRelation = client_employee_relation
                OP_Patient.CorporateName = Corporate_instance
                OP_Patient.CorporateType = CorporateType
                OP_Patient.CorporateEmployeeId = CorporateEmployeeId
                OP_Patient.CorporateEmployeeDesignation = CorporateEmployeeDesignation
                OP_Patient.CorporateEmployeeRelation = CorporateEmployeeRelation
                OP_Patient.EmployeeId = employee_instance
                OP_Patient.EmployeeRelation = employee_relation
                OP_Patient.DoctorId = doctor_instance
                OP_Patient.DoctorRelation = doctor_relation
                OP_Patient.DonationType = Donation_instance
                OP_Patient.created_by = created_by
                OP_Patient.save()
 
 
               
                referral = MCI_Patient_Referral_Detials.objects.filter(OP_Register_Id__OPNo = RegistrationId).first()
               
                if referral:
                    referral.OP_Register_Id=OP_Patient
                    referral.ReferralRegisteredBy=register_type
                    referral.ReferralSource=ReferralSource
                    referral.ReferredBy=referral_doctor_instance
                    referral.save()
 
                for appoint in Appoint_list:
                    print('qqqqqqq-----------', appoint)
 
                    Pk_id = appoint.get('id', None)
                    VisitType = appoint.get('VisitType', '')
                    Complaint = appoint.get('Complaint', '')
                    TokenNo = appoint.get('TokenNo', '')
                    Speciality = appoint.get('Speciality', '')
                    DoctorId = appoint.get('DoctorId', '')
 
                    # Get instances
                    Specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
                    Doctor_instance = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()
                    print(Doctor_instance,'Doctor_instance')
                   
                   
                    
 
                    if DoctorId and RegistrationId and Pk_id:
                       
                            existing_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Pk_id)
    
                            Docid = existing_appointment.PrimaryDoctor.Doctor_ID
                            existingvisittype = existing_appointment.VisitType
                            existingSpecialization = existing_appointment.Specialization

                            print(Docid,'Docid')

                            print(existingvisittype,'existingvisittype',existingSpecialization,'existingSpecialization')

                            if existingSpecialization == Specialization_instance:

                                print('trueeeeee')
                        
    
                                # ✅ Update
                                existing_appointment.Specialization = Specialization_instance
                                existing_appointment.PrimaryDoctor = Doctor_instance
                                existing_appointment.VisitType = 'NewConsultation' if existingvisittype == 'NewConsultation' else existingvisittype
                                existing_appointment.Complaint = Complaint
                                existing_appointment.TokenNo = TokenNo
                                existing_appointment.save()
        
                                

                            else:
                                # ✅ Update
                                existing_appointment.Specialization = Specialization_instance
                                existing_appointment.PrimaryDoctor = Doctor_instance
                                existing_appointment.VisitType = 'NewConsultation' if existingvisittype == 'NewConsultation' else VisitType
                                existing_appointment.Complaint = Complaint
                                existing_appointment.TokenNo = TokenNo
                                existing_appointment.save()
        


                    else:    
                        print('ℹ️ No existing appointment — creating new')
                        new_doc_appt = MCI_OP_Patient_Appointment_With_Multiple_Doctor(
                            Registration_Id=OP_Patient,
                            PrimaryDoctor=Doctor_instance,
                            Specialization=Specialization_instance,
                            VisitType=VisitType,
                            Complaint=Complaint,
                            TokenNo=TokenNo
                        )
                        new_doc_appt.save()
                        print(f'✅ New doctor appointment created (Doctor: {DoctorId})')
 
 
                return JsonResponse({'success': 'OP Patient Details Updated Successfully','RegistrationId':OP_Patient.Registration_Id,'Billpage': Billpage})


            else:
               
             

                patient_visit_id = None
                
                
                patient.Title  = Titleins
                patient.FirstName  = FirstName
                patient.MiddleName  = MiddleName
                patient.SurName  = SurName
                patient.Gender  = Gender
                patient.MaritalStatus  = MaritalStatus
                patient.SpouseName  = SpouseName
                patient.FatherName  = FatherName
                patient.DOB  = DOB
                patient.Age  = Age
                patient.PhoneNo  = PhoneNo
                patient.Email  = Email
                patient.BloodGroup  = BloodGroupins
                patient.Occupation  = Occupation
                patient.Religion  = Religionins
                patient.Nationality  = Nationality
                patient.UniqueIdType  = UHIDType
                patient.UniqueIdNo  = UHIDNo
                patient.PatientType  = PatientType
                patient.ABHA  = ABHA
                patient.DoorNo  = DoorNo
                
                patient.Street  = Street
                patient.Area  = Area
                patient.City  = City
                patient.District  = District
                patient.State  = State
                patient.Country  = Country
                patient.Pincode  = Pincode
                patient.Status = 'Registered'

                patient.save()


                                
                if not patient:
                    return JsonResponse({'warn': f"The Patient Id is not valid"})
                
                
                patient_visit_id = generate_or_update_visit_id(patient, register_type)


            
                    
                Patient_OP = MCI_Patient_Appointment_Registration_Detials.objects.create(

                PatientId = patient,
                VisitId = patient_visit_id,  
                VisitPurpose = register_type,
                ApptoRegId=Appointment_ins,
                IsMLC = IsMLC,
                IsReferral = IsReferral,
                NextToKinName = NextToKinName,
                Relation = Relation,
                RelativePhNo = RelativePhoneNo,
                PatientCategory = patient_category,
                
                InsuranceName = Insurance_instance,
                InsuranceType = insurance_type,
                ClientName = Client_instance,
                ClientType = client_type,
                ClientEmployeeId = client_employee_id,
                ClientEmployeeDesignation = client_employee_designation,
                ClientEmployeeRelation = client_employee_relation,
                
                CorporateName = Corporate_instance,
                CorporateType = CorporateType,
                CorporateEmployeeId = CorporateEmployeeId,
                CorporateEmployeeDesignation = CorporateEmployeeDesignation,
                CorporateEmployeeRelation = CorporateEmployeeRelation,

                EmployeeId = employee_instance,
                EmployeeRelation = employee_relation,
                DoctorId = doctor_instance,
                DoctorRelation = doctor_relation,
                DonationType = Donation_instance,
                
                created_by = created_by,
                
                )
                Patient_OP.save()


            
                if AppointmentId:
                    PatientsId_In_Appointment_ins = Appointment_Request_List.objects.filter(appointment_id=AppointmentId)

                    if PatientsId_In_Appointment_ins.exists():

                        patient_appointment = PatientsId_In_Appointment_ins.first()

                        if patient_appointment:
                            patient_appointment.status = "OpRegistered"
                            patient_appointment.save()
                                
                        
                for appoint in Appoint_list:

                    VisitType = appoint.get('VisitType', '')
                    Complaint = appoint.get('Complaint', '')
                    TokenNo = appoint.get('TokenNo','')
                    Speciality = appoint.get('Speciality','')
                    DoctorName = appoint.get('DoctorId','')
                
                    Specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
                    Doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DoctorName) if DoctorName else None

                    Multile_Doctor = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                        Registration_Id = Patient_OP,
                        PrimaryDoctor = Doctor_name_instance,
                        Specialization = Specialization_instance,
                        VisitType = VisitType,
                        Complaint = Complaint,
                        TokenNo = TokenNo,
                    )
                    Multile_Doctor.save()


                
                # return JsonResponse({'success': 'Patient Appointment registered successfully'})
                return JsonResponse({'success': 'Patient Appointment registered successfully','RegistrationId':Patient_OP.OPNo})
                
        
        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method'},status=405)



@csrf_exempt
@require_http_methods(["GET"])
def Fake_Patients_Management_Filter_OPVisitEntry(request):
    try:
        # Extract parameters from the request
        patientsearch = request.GET.get('patientsearch', '')
        search_query = request.GET.get('search', '')
        gender = request.GET.get('gender', '')
        from_date = request.GET.get('fromDate', '')
        to_date = request.GET.get('toDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        current_date = request.GET.get('CurrentDate', '')
 
        # Start with a base queryset limited to 2000 records
 
        # Handle patientsearch for quick filtering
        if patientsearch:
            patientsearch = patientsearch.strip()
            print('inside patientsearch', patientsearch)
 
            # Filter by PatientId, PhoneNo, or FirstName for patientsearch
            patients = MCI_Patient_Detials.objects.filter(
                Q(PatientNo__icontains=patientsearch) |
                Q(PhoneNo__icontains=patientsearch) |
                Q(FirstName__icontains=patientsearch)
            )
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientNo,
                    'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                    'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                    'FirstName': patient.FirstName,
                    'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                    'Pincode': patient.Pincode,
                    'ExistingPtNo': patient.ExistingPtNo,
                    'FatherName': patient.FatherName if patient else '',
                    'SpouseName': patient.SpouseName if patient else '',
                    'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                    'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                    'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                    'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                    'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                    'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                    'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                    'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                    'Gender': patient.Gender,
                    'Email': patient.Email,
                    'UHIDNo': patient.UniqueIdNo,
                    'date': patient.created_at.strftime('%Y-%m-%d'),
                    'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                    'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                    'ABHA': patient.ABHA,
                    'UniqueIdNo': patient.UniqueIdNo,
                } for idx, patient in enumerate(patients, start=1)
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Build dynamic filter conditions for other parameters
 
        queryset = MCI_Patient_Detials.objects.filter(DuplicateId=False)[:20]
 
        filter_conditions = Q()
        if search_query:
            filter_conditions &= (
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientNo__icontains=search_query) |
                Q(PhoneNo__icontains=search_query) |
                Q(UniqueIdNo__icontains=search_query)
            )
        if gender:
            filter_conditions &= Q(Gender__iexact=gender)
        if from_date and to_date:
            filter_conditions &= Q(created_at__date__range=[from_date, to_date])
        elif particular_date:
            filter_conditions &= Q(created_at__date=particular_date)
        elif current_date and current_date != "":
            filter_conditions &= Q(created_at__date=current_date)
 
        # Apply the dynamic filters to the queryset
        if filter_conditions:
            queryset = queryset.filter(filter_conditions)
 
        # Prepare response data for other filters
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientNo,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'Pincode': patient.Pincode,
                'ExistingPtNo': patient.ExistingPtNo,
                'FatherName': patient.FatherName if patient else '',
                'SpouseName': patient.SpouseName if patient else '',
                'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'Email': patient.Email,
                'UHIDNo': patient.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                'ABHA': patient.ABHA,
                'UniqueIdNo': patient.UniqueIdNo,
            } for idx, patient in enumerate(queryset, start=1)
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 

@csrf_exempt
@require_http_methods(["GET"])
def MCI_Total_Patients_Count(request):
    try:
        search_query = request.GET.get('search', '')
        gender = request.GET.get('gender', '')  
        abha_filter = request.GET.get('Abha', '')  
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
 
        queryset = MCI_Patient_Detials.objects.all()
 
        # Search query filter
        if search_query:
            queryset = queryset.filter(
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientNo__icontains=search_query) |
                Q(PatientId__icontains=search_query) |
                Q(PhoneNo__icontains=search_query) |
                Q(UniqueIdNo__icontains=search_query) 
                
            )
       
        # Gender filter
        if gender:
            queryset = queryset.filter(Gender__iexact=gender)  
 
        if abha_filter:
            abha_filter = abha_filter.lower()
            if abha_filter == "yes":
                # Keep rows where ABHA **is present**
                queryset = queryset.exclude(ABHA__isnull=True).exclude(ABHA__exact='')
            elif abha_filter == "no":
                # Keep rows where ABHA **is missing**
                queryset = queryset.filter(Q(ABHA__isnull=True) | Q(ABHA__exact=''))    
 
        # Custom date range filter
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
 
        # today = date.today()
        # current_year = today.year
        # current_month = today.month
 
        # today_Patient_count = Patient_Detials.objects.filter(created_at__date=today).count()
       
        # monthly_Patient_count = Patient_Detials.objects.filter(
        #     created_at__year=current_year,
        #     created_at__month=current_month
        # ).count()
 
        # yearly_Patient_count = Patient_Detials.objects.filter(
        #     created_at__year=current_year
        # ).count()
 
 
        filtered_qs = queryset            # optional alias, makes intent obvious
 
        today         = date.today()
        current_year  = today.year
        current_month = today.month
 
        today_Patient_count  = filtered_qs.filter(created_at__date=today).count()
        monthly_Patient_count  = filtered_qs.filter(
            created_at__year=current_year,
            created_at__month=current_month
        ).count()
        yearly_Patient_count = filtered_qs.filter(
            created_at__year=current_year
        ).count()
 
        # Prepare response data
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientNo,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'Pincode': patient.Pincode,
                # 'ExistingPtNo': patient.ExistingPtNo,
                'Age': patient.Age,
                'ABHA': patient.ABHA,
                'Gender': patient.Gender,
                'fathername': patient.FatherName,
                'SpouseName': patient.SpouseName or '',
                'Title':patient.Title.Title_Id if patient.Title else '',
 
 
                # 'DoorNo': patient.DoorNo,
                # 'Street': patient.Street,
                # 'Area': patient.Area,
                # 'City': patient.City,
                # 'District': patient.District,
                # 'State': patient.State,
                # 'Country': patient.Country,
 
                'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                'Address': f"{patient.Street} {patient.Area}",
               
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'Email': patient.Email,
                'UHIDNo': patient.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'created_at': patient.created_at,
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
           
            } for idx, patient in enumerate(queryset, start=1)
        ]
 
        count_data = {
            'today_count': today_Patient_count,
            'month_count': monthly_Patient_count,
            'year_count': yearly_Patient_count,
        }
 
        # return JsonResponse( patient_data, count_data, safe=False)
 
        return JsonResponse({
            'patients': patient_data,
            'counts': count_data,
        }, safe=False)
 
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_Patients_Counts(request):
    try:
        # Calculate today's, monthly, and yearly counts
        today = date.today()
        current_year = today.year
        current_month = today.month

        total_today_count = MCI_Patient_Detials.objects.filter(created_at__date=today).count()
        total_month_count = MCI_Patient_Detials.objects.filter(
            created_at__year=current_year,
            created_at__month=current_month
        ).count()
        total_year_count = MCI_Patient_Detials.objects.filter(
            created_at__year=current_year
        ).count()

        count_data = {
            'today_count': total_today_count,
            'month_count': total_month_count,
            'year_count': total_year_count,
        }

        return JsonResponse(count_data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(['GET'])
def MCI_Patient_Master_List(request):
    if request.method == 'GET':
        try:

            def get_file_image(filedata):
                # Detect the file type using file content
                kind = filetype.guess(filedata)
                
                # Default to PDF if the type is undetermined
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            



            patient_id = request.GET.get('PatientId')
            # Ensure patient_id is provided
            if not patient_id:
                return JsonResponse({'error': 'PatientId is required'}, status=400)

            # Retrieve the patient details
            patient = MCI_Patient_Detials.objects.get(pk=patient_id)
            OP_patient_data = Patient_Appointment_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            IP_patient_data = Patient_IP_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            Casuality_patient_data = Patient_Casuality_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            Diagnosis_patient_data = Patient_Diagnosis_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            Laboratory_patient_data = Patient_Laboratory_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
             
           
            patient_dict = {
                'Photo': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'PatientId': patient.PatientNo,
                'PhoneNo': patient.PhoneNo,
                'ExistingPtNo': patient.ExistingPtNo,
                'Title': patient.Title.pk if patient.Title else None,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'Gender': patient.Gender,
                'MaritalStatus': patient.MaritalStatus,
                'SpouseName': patient.SpouseName,
                'FatherName': patient.FatherName,
                # 'AliasName': patient.AliasName,
                'DOB': patient.DOB,
                'Age': patient.Age,
                'Email': patient.Email,
                'BloodGroup': patient.BloodGroup.pk if patient.BloodGroup else None,
                'Occupation': patient.Occupation,
                'Religion': patient.Religion.pk if patient.Religion else None,  # Assuming Religion has a Name field
                'Nationality': patient.Nationality,
                'UniqueIdType': patient.UniqueIdType,
                'UniqueIdNo': patient.UniqueIdNo,
                'PatientType': patient.PatientType,
                'Flagging': patient.Flagging.pk if patient.Flagging else None,
                'DoorNo': patient.DoorNo,
                'Street': patient.Street,
                'Area': patient.Area,
                'City': patient.City,
                'District': patient.District,
                'State': patient.State,
                'Country': patient.Country,
                'Pincode': patient.Pincode,
                'ABHA': patient.ABHA,
                'PermanentAddressSameAsAbove': patient.PermanentAddressSameAsAbove,
                'PermanentPincode': patient.PermanentPincode,
                'PermanentdoorNo': patient.PermanentdoorNo,
                'PermanentStreet': patient.PermanentStreet,
                'PermanentArea': patient.PermanentArea,
                'PermanentCity': patient.PermanentCity,
                'PermanentDistrict': patient.PermanentDistrict,
                'PermanentState': patient.PermanentState,
                'PermanentCountry': patient.PermanentCountry,
                'Createdby': patient.created_by,
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                
            }
           
            return JsonResponse(patient_dict)

        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'}, status=404)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def MCI_Patient_BasicDetails_Update(request):

    @transaction.atomic
    def validate_and_process_file(file):
    
        
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            compressed_data = None
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='PNG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            output.seek(0)
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            compressed_data = output.getvalue()
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        if file:
            file_data = file.split(',')[1]
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                print('maximum mb')
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)
            
            if file_type == 'image/jpeg' or file_type == 'image/png':
                try:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, compressed_size = compress_image(image)
                    return compressed_image_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing image: {str(e)}'})

            elif file_type == 'application/pdf':
                try:
                    compressed_pdf_data, compressed_size = compress_pdf(BytesIO(file_content))

                    return compressed_pdf_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing PDF: {str(e)}'})

            else:
                return JsonResponse({'warn': 'Unsupported file format'})

        return None



    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'data222222222222wwwwwwwwwww')

            # Fetch data from request

            Patient_profile_photo = data.get('Photo', None)
            Patient_profile_photo_prossed = validate_and_process_file(Patient_profile_photo) if Patient_profile_photo else None
           
            patient_id = data.get('PatientId')
            print(patient_id, 'patient_id')

            # Initialize optional fields
            patient_type = data.get('PatientType', '')
           
            flagging = data.get('Flagging', '')
            Title = data.get('Title', '')
            BloodGroup = data.get('BloodGroup', '')
            Religion = data.get('Religion', '')

            Title_instance = Title_Detials.objects.get(Title_Id=Title) if Title else None
            Flagging_instance = Flaggcolor_Detials.objects.get(Flagg_Id=flagging) if flagging else None
            BloodGroup_instance = BloodGroup_Detials.objects.get(BloodGroup_Id=BloodGroup) if BloodGroup else None
            Religion_instance = Religion_Detials.objects.get(Religion_Id=Religion) if Religion else None

            # Ensure Patient ID exists
            if not patient_id:
                return JsonResponse({'error': 'Patient ID is required'}, status=400)

            # Fetch the patient record
            patient = MCI_Patient_Detials.objects.get(PatientNo=patient_id)
            print(patient.PatientType,'patient.PatientType')
            if not patient:
                return JsonResponse({'error': 'Patient with the given ID does not exist'}, status=400)

            # Update patient details

            patient.Patient_profile = Patient_profile_photo_prossed
            patient.PhoneNo = data.get('PhoneNo', '')
            patient.ExistingPtNo = data.get('ExistingPtNo', '')
            patient.Title = Title_instance
            patient.FirstName = data.get('FirstName', '')
            patient.MiddleName = data.get('MiddleName', '')
            patient.SurName = data.get('SurName', '')
            patient.Gender = data.get('Gender', '')
            patient.MaritalStatus = data.get('MaritalStatus', '')
            patient.SpouseName = data.get('SpouseName', '')
            patient.FatherName = data.get('FatherName', '')
            patient.DOB = data.get('DOB', '')
            patient.Age = data.get('Age', '')
            patient.Email = data.get('Email', '')
            patient.BloodGroup = BloodGroup_instance
            # patient.BloodGroup = BloodGroup_Detials.objects.filter(BloodGroup_Id=data.get('BloodGroup','')).first()
            patient.Occupation = data.get('Occupation', '')
            patient.Religion = Religion_instance
            # patient.Religion = Religion_Detials.objects.filter(Religion_Id=data.get('Religion','')).first()
            patient.Nationality = data.get('Nationality', '')
            patient.UniqueIdType = data.get('UniqueIdType', '')
            patient.UniqueIdNo = data.get('UniqueIdNo', '')
            patient.PatientType = data.get('PatientType', '')
            patient.DoorNo = data.get('DoorNo', '')
            patient.Street = data.get('Street', '')
            patient.Area = data.get('Area', '')
            patient.City = data.get('City', '')
            patient.District = data.get('District', '')
            patient.State = data.get('State', '')
            patient.Country = data.get('Country', '')
            patient.Pincode = data.get('Pincode', '')
            patient.ABHA = data.get('ABHA', '')
            patient.PermanentAddressSameAsAbove = data.get('PermanentAddressSameAsAbove', '')
            patient.PermanentPincode = data.get('PermanentPincode', '')
            patient.PermanentdoorNo = data.get('PermanentdoorNo', '')
            patient.PermanentStreet = data.get('PermanentStreet', '')
            patient.PermanentArea = data.get('PermanentArea', '')
            patient.PermanentCity = data.get('PermanentCity', '')
            patient.PermanentDistrict = data.get('PermanentDistrict', '')
            patient.PermanentState = data.get('PermanentState', '')
            patient.PermanentCountry = data.get('PermanentCountry', '')
            patient.updated_by = data.get('Created_by', '')
            patient.PatientType = patient_type
            patient.Flagging = Flagging_instance
            patient.save()

            print(patient, 'patient')

            # LabPatient = Register_patient_Details.objects.filter(Patient_Id=patient_id).first()
            # print(LabPatient,'LabPatient')
            # if LabPatient:

            #     LabPatient.Title = Title_instance.Title_Name
            #     LabPatient.Patient_Name = patient.FirstName
            #     LabPatient.Age = patient.Age
            #     LabPatient.Gender = patient.Gender
            #     LabPatient.save()

           

            return JsonResponse({'success': 'Patient details updated successfully'})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MRD_IP_Discharged_Patient_For_Diagnosis(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        ParticularDate = request.GET.get('ParticularDate','')
        SearchbyFirstName = request.GET.get('SearchbyFirstName','')
       
 
        search_query = Q()
        response_data = []
 
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
       
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        elif DateType == "Particular":
 
            try:
                ParticularDate = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=ParticularDate)
            except ValueError:
                raise ValueError('Invalid ParticularDate format. Use YYYY-MM-DD.')
 
 
        if SearchbyFirstName:
 
            print(SearchbyFirstName,'SearchbyFirstName')
            search_query &= (
                Q(Registration_Id__Registration_Id__iexact=f"""{'IP'}{SearchbyFirstName}""") |
                Q(Registration_Id__PatientId__PatientId__icontains=SearchbyFirstName) |
                Q(Registration_Id__PatientId__FirstName__icontains=SearchbyFirstName)
            )
 
 
        Dischargeins = MCI_Patient_Discharge_Detials.objects.filter(search_query)
 
        response_data = []
 
        for sno, datas in enumerate(Dischargeins, start=1):
            datalist = {
                'Sno': sno,
                'IPNo': datas.Registration_Id.IPNo if datas.Registration_Id else None,
                'PatientId': datas.Registration_Id.PatientId.PatientId if datas.Registration_Id else None,
                'PatientName': f"{datas.Registration_Id.PatientId.Title.Title_Name}."
                            f"{datas.Registration_Id.PatientId.FirstName}"
                            f"{datas.Registration_Id.PatientId.MiddleName or ''}"
                            f"{datas.Registration_Id.PatientId.SurName}"
                            if datas.Registration_Id else None,
            }
            response_data.append(datalist)
 
     
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET","POST"])
def MRD_IP_Discharged_Patient_For_Diagnosis_Delete(request):
 
    if request.method == 'POST':
 
        try:
 
            data = json.loads(request.body)
 
            print(data,'dataaaaaaaaa')
 
            id = data.get('id','')
            created_by = data.get('created_by','')
 
 
            diagnosisins = MRD_IP_Patient_Diagnosis_Data.objects.filter(pk=id).first()
 
            diagnosisins.Status = 'Canceled'
            diagnosisins.canceled_by = created_by
            diagnosisins.save()
 
            return JsonResponse({'success': 'Diagnosis Canceled Successfully'})
 
 
 
 
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
    elif request.method == 'GET':
 
        try:
 
            IPNo = request.GET.get('IPNo','')
 
 
            Patins = MRD_IP_Patient_Diagnosis_Data.objects.filter(Register_Id__Registration_Id = IPNo)
 
            ICDList = []
 
            for datas in Patins:
 
                datalist = {
                    'id' : datas.pk,
                    'ICDCode' : datas.ICDCode,
                    'Code_Description' : datas.Code_Description,
                    'Diagnosis' : datas.Diagnosis
                }
                ICDList.append(datalist)
 
            return JsonResponse(ICDList,safe=False)
 
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET","POST"])
def MRD_IP_Discharged_Patient_For_Diagnosis_Post(request):
 
    if request.method == 'POST':
 
        try:
 
            data = json.loads(request.body)
 
            print(data,'dataaaaaaaaa')
 
            DiagnosisData = data.get('DiagnosisData','')
            IPNo = data.get('IPNo','')
            PatientId = data.get('PatientId','')
            created_by = data.get('created_by','')
 
 
            IPins = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=IPNo).first()
 
            Patins = MCI_Patient_Detials.objects.filter(PatientId = PatientId).first()
 
            for d in DiagnosisData:
 
                SearchDescription = d.get('SearchDescription','')
                SearchDiagnosis = d.get('SearchDiagnosis','')
                SearchICDCode = d.get('SearchICDCode','')
 
                MRD_IP_Patient_Diagnosis_Data.objects.create(
 
                    Patient_Id = Patins,
                    Register_Id = IPins,
                    ICDCode = SearchICDCode,
                    Code_Description = SearchDescription,
                    Diagnosis = SearchDiagnosis,
                    created_by = created_by
                )
 
 
            return JsonResponse({'success': 'Diagnosis Added Successfully'})
 
 
 
 
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
    elif request.method == 'GET':
 
        try:
 
            IPNo = request.GET.get('IPNo','')
 
 
            Patins = MRD_IP_Patient_Diagnosis_Data.objects.filter(Register_Id__IPNo = IPNo,Status='Added')
 
            ICDList = []
 
            for datas in Patins:
 
                datalist = {
                    'id' : datas.pk,
                    'ICDCode' : datas.ICDCode,
                    'Code_Description' : datas.Code_Description,
                    'Diagnosis' : datas.Diagnosis,
                    'IPNo' : datas.Register_Id.IPNo if datas.Register_Id else None
                }
                ICDList.append(datalist)
 
            return JsonResponse(ICDList,safe=False)
 
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 


from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime
import random
from django.db.models import Q, Count
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Speciality_Internal_Swap_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            swaps_list = data.get('swaps', [])  # [{speciality, newToFollowUp, followUpToNew}, ...]
            created_by = data.get('created_by', 'system')
 
            if not swaps_list:
                return JsonResponse({'error': 'No swap data provided'}, status=400)
 
            total_swapped = 0
            details = []
            errors = []
 
            with transaction.atomic():
                for item in swaps_list:
                    spec_name = item.get('speciality')
                    new_to_follow = int(item.get('newToFollowUp', 0))
                    follow_to_new = int(item.get('followUpToNew', 0))
 
                    if new_to_follow == 0 and follow_to_new == 0:
                        continue
 
                    # Resolve speciality
                    speciality_obj = Speciality_Detials.objects.filter(
                        Speciality_Name__iexact=spec_name,
                        Status=True
                    ).first()
 
                    if not speciality_obj:
                        errors.append(f"Speciality {spec_name} not found")
                        continue
 
                    # Check if we have enough appointments to swap
                    available_new = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=speciality_obj,
                        VisitType='NewConsultation',
                        Status='Registered',
                        Registration_Id__IsOriginal = False
 
                    ).count()
 
                    available_follow = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=speciality_obj,
                        VisitType__in=['FollowUp No Fee','FollowUp With Fee','FollowUp'],
                        Status='Registered',
                        Registration_Id__IsOriginal = False
 
                    ).count()
 
                    if new_to_follow > available_new:
                        errors.append(f"Not enough New appointments in {spec_name}. Available: {available_new}, Requested: {new_to_follow}")
                        continue
 
                    if follow_to_new > available_follow:
                        errors.append(f"Not enough Follow-up appointments in {spec_name}. Available: {available_follow}, Requested: {follow_to_new}")
                        continue
 
                    # Swap New → Follow-up
                    swapped_new_to_follow = 0
                    if new_to_follow > 0:
                        new_appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Specialization=speciality_obj,
                            VisitType='NewConsultation',
                            Status='Registered',
                            Registration_Id__IsOriginal = False
 
                        ).order_by('-created_at')[:new_to_follow]
 
                        for appointment in new_appointments:
                            appointment.VisitType = 'FollowUp'
                            appointment.updated_by = created_by
                            appointment.save()
                            swapped_new_to_follow += 1
 
                    # Swap Follow-up → New
                    swapped_follow_to_new = 0
                    if follow_to_new > 0:
                        follow_appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Specialization=speciality_obj,
                            VisitType='FollowUp',
                            Status='Registered',
                            Registration_Id__IsOriginal = False
 
                        ).order_by('-created_at')[:follow_to_new]
 
                        for appointment in follow_appointments:
                            appointment.VisitType = 'NewConsultation'
                            appointment.updated_by = created_by
                            appointment.save()
                            swapped_follow_to_new += 1
 
                    total_swapped += (swapped_new_to_follow + swapped_follow_to_new)
                    details.append(f"{spec_name}: {swapped_new_to_follow} New→Follow, {swapped_follow_to_new} Follow→New")
 
            if errors:
                return JsonResponse({
                    'warning': f'Partial success. {total_swapped} appointments swapped',
                    'errors': errors,
                    'details': details
                })
 
            return JsonResponse({
                'success': f'Successfully swapped {total_swapped} appointments',
                'details': details
            })
 
        except Exception as e:
            print(f"Error in Speciality_Internal_Swap_Link: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Speciality_External_Swap_Link(request):
    """Swap appointments between different specialities"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            from_spec_name = data.get('fromSpeciality')
            to_spec_name = data.get('toSpeciality')
            new_count = int(data.get('newCount', 0))
            follow_count = int(data.get('followUpCount', 0))
            created_by = data.get('created_by', 'system')
 
            if not from_spec_name or not to_spec_name:
                return JsonResponse({'error': 'Both From and To specialities are required'}, status=400)
 
            if from_spec_name == to_spec_name:
                return JsonResponse({'error': 'From and To specialities cannot be the same'}, status=400)
 
            if new_count == 0 and follow_count == 0:
                return JsonResponse({'error': 'No counts to transfer'}, status=400)
 
            # Resolve specialities
            from_speciality = Speciality_Detials.objects.filter(
                Speciality_Name__iexact=from_spec_name,
                Status=True
            ).first()
 
            to_speciality = Speciality_Detials.objects.filter(
                Speciality_Name__iexact=to_spec_name,
                Status=True
            ).first()
 
            if not from_speciality:
                return JsonResponse({'error': f'From speciality {from_spec_name} not found'}, status=400)
           
            if not to_speciality:
                return JsonResponse({'error': f'To speciality {to_spec_name} not found'}, status=400)
 
            # Get doctors for target speciality
            to_doctors = Doctor_ProfessForm_Detials.objects.filter(
                Specialization=to_speciality,
                Department__Department_Name='OP'
            ).select_related('Doctor_ID').distinct()
 
            if not to_doctors.exists():
                return JsonResponse({'error': f'No doctors available for {to_spec_name}'}, status=400)
 
            total_transferred = 0
            details = []
 
            with transaction.atomic():
                # Handle New Consultation transfer
                if new_count > 0:
                    # Get New appointments from source speciality
                    from_new_appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=from_speciality,
                        VisitType='NewConsultation',
                        Status='Registered',
                        Registration_Id__IsOriginal = False
                    ).order_by('-created_at')[:new_count]
 
                    actual_new_count = from_new_appointments.count()
                   
                    if actual_new_count < new_count:
                        return JsonResponse({
                            'error': f'Not enough New appointments in {from_spec_name}. Available: {actual_new_count}, Requested: {new_count}'
                        }, status=400)
 
                    # Transfer to target speciality
                    transferred_new = 0
                    for appointment in from_new_appointments:
                        # Find a suitable doctor in target speciality
                        target_doctor = random.choice(to_doctors)
                       
                        appointment.Specialization = to_speciality
                        appointment.PrimaryDoctor = target_doctor.Doctor_ID
                        appointment.updated_by = created_by
                        appointment.save()
                       
                        transferred_new += 1
 
                    total_transferred += transferred_new
                    details.append(f"Transferred {transferred_new} New appointments from {from_spec_name} to {to_spec_name}")
 
                # Handle Follow-up transfer
                if follow_count > 0:
                    # Get Follow-up appointments from source speciality
                    from_follow_appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=from_speciality,
                        VisitType__in=['FollowUp No Fee','FollowUp With Fee','FollowUp'],
                        Status='Registered',
                        Registration_Id__IsOriginal = False
 
                    ).order_by('-created_at')[:follow_count]
 
                    actual_follow_count = from_follow_appointments.count()
                   
                    if actual_follow_count < follow_count:
                        return JsonResponse({
                            'error': f'Not enough Follow-up appointments in {from_spec_name}. Available: {actual_follow_count}, Requested: {follow_count}'
                        }, status=400)
 
                    # Transfer to target speciality
                    transferred_follow = 0
                    for appointment in from_follow_appointments:
                        # Find a suitable doctor in target speciality
                        target_doctor = random.choice(to_doctors)
                       
                        appointment.Specialization = to_speciality
                        appointment.PrimaryDoctor = target_doctor.Doctor_ID
                        appointment.updated_by = created_by
                        appointment.save()
                       
                        transferred_follow += 1
 
                    total_transferred += transferred_follow
                    details.append(f"Transferred {transferred_follow} Follow-up appointments from {from_spec_name} to {to_spec_name}")
 
            return JsonResponse({
                'success': f'Successfully transferred {total_transferred} appointments from {from_spec_name} to {to_spec_name}',
                'details': details
            })
 
        except Exception as e:
            print(f"Error in Speciality_External_Swap_Link: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Speciality_Decrease_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            counts_list = data.get('counts', [])  # Expect: [{speciality, newCount, followUpCount}, ...]
            created_by = data.get('created_by', 'system')
 
            if not counts_list:
                return JsonResponse({'error': 'No speciality counts provided'}, status=400)
 
            total_removed = 0
            details = []
 
            with transaction.atomic():
                for item in counts_list:
                    spec_name = item.get('speciality')
                    new_count = int(item.get('newCount', 0))
                    follow_count = int(item.get('followUpCount', 0))
 
                    if new_count == 0 and follow_count == 0:
                        continue
 
                    # Resolve speciality
                    speciality_obj = Speciality_Detials.objects.filter(
                        Speciality_Name__iexact=spec_name,
                        Status=True
                    ).first()
 
                    if not speciality_obj:
                        details.append(f"Speciality {spec_name} not found")
                        continue
 
                    # Get active appointments for this speciality
                    appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=speciality_obj,
                        Status='Registered',
                        Registration_Id__IsOriginal = False
 
                    ).order_by('-created_at')  # Remove lower priority first
 
                    # Separate new and follow-up appointments
                    new_appointments = appointments.filter(VisitType='NewConsultation')
                    follow_appointments = appointments.filter(VisitType__in=['FollowUp No Fee','FollowUp With Fee','FollowUp'])
 
 
                    removed_new = 0
                    removed_follow = 0
 
                    # Remove New Consultation appointments
                    if new_count > 0:
                        to_remove = new_appointments[:new_count]
                        for appointment in to_remove:
                            appointment.Status = 'Cancelled'
                            appointment.VisitType = 'Cancelled'
                            appointment.save()
                            removed_new += 1
 
                    # Remove Follow-up appointments
                    if follow_count > 0:
                        to_remove = follow_appointments[:follow_count]
                        for appointment in to_remove:
                            appointment.Status = 'Cancelled'
                            appointment.VisitType = 'Cancelled'
                            appointment.save()
                            removed_follow += 1
 
                    total_removed += (removed_new + removed_follow)
                    details.append(f"{spec_name}: Removed {removed_new} new, {removed_follow} follow-up")
 
            return JsonResponse({
                'success': f'Successfully removed {total_removed} appointments',
                'details': details
            })
 
        except Exception as e:
            print(f"Error in Speciality_Decrease_Link: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
 
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Get_MRD_Radiology_Test_view_Link(request):

    try:

        Registration_Id = request.GET.get('Registration_Id')


        testdetails = MCI_Radiology_Request_Details.objects.filter(OP_Register_Id__OPNo=Registration_Id,Status='Paid')
        testlist = []
        for datas in testdetails:
            Requestid = datas.Radiology_RequestId
            Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
            Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

            datalist={
                'RadiologyName' : Dep.Radiology_Name,
                'Radiologyid': Dep.Radiology_Id,
                'TestCode':Test.Test_Code,
                'TestName': Test.Test_Name

            }
            testlist.append(datalist)


    except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_ip_registered_Patient_basic_details(request):
    try:
        
        RegistrationId = request.GET.get('RegistrationId', '')
        status = request.GET.get('status', '')  # Corrected key
        print("status------------",status)
        print("RegistrationId------------",RegistrationId)
        # Map status to Booking_Status
        Booking_Status = 'Booked' if status == 'Pending' else 'Cancelled'
        
        
        queryset = MCI_Patient_IP_Registration_Detials.objects.all().order_by('-created_at')
        
        if RegistrationId:
            queryset = queryset.filter(IPNo=RegistrationId)

        # Apply filters based on query parameters
        # if query:
        #     queryset = queryset.filter(Booking_Status=Booking_Status)
 
        if status:
            queryset = queryset.filter(Status__icontains=status, Booking_Status=Booking_Status)
 
        if not queryset.exists():
            return JsonResponse([], safe=False)  # Return empty list if no records
       

        
        print("queryset--------",queryset)
       
        ip_register_data = []
        for idx, register in enumerate(queryset, start=1):
            Flagging_name = getattr(register.Flagging, 'Flagg_Name', None)
            Flagging_color = getattr(register.Flagging, 'Flagg_Color', None)
            BloodGroup_name = getattr(register.PatientId.BloodGroup, 'BloodGroup_Name', None)
           
            

            address_parts = [
                    getattr(register.PatientId, 'DoorNo', ''),
                    getattr(register.PatientId, 'Street', ''),
                    getattr(register.PatientId, 'Area', ''),
                    getattr(register.PatientId, 'City', ''),
                    getattr(register.PatientId, 'District', ''),
                    getattr(register.PatientId, 'State', ''),
                    getattr(register.PatientId, 'Country', ''),
                    f"- {getattr(register.PatientId, 'Pincode', '')}" if getattr(register.PatientId, 'Pincode', '') else ''
                ]

            cleaned_address = ", ".join([str(part) for part in address_parts if part not in [None, '', 'None', '-', '- ']])
            print("Cleaned Address:", cleaned_address)

            DoctorName = (
                f"{getattr(register.PrimaryDoctor.Tittle, 'Title_Name', '')}."
                f"{getattr(register.PrimaryDoctor, 'First_Name', '')} "
                f"{getattr(register.PrimaryDoctor, 'Last_Name', '')}"
                if register.PrimaryDoctor else ''
            )
 
            Specialization = getattr(register.Specialization, 'Speciality_Name', '')

            admissionins = MCI_Patient_Admission_Detials.objects.filter(IP_Registration_Id__IPNo = register.IPNo).first()


 
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.IPNo,
                'PatientId': register.PatientId.PatientNo,
                'PatientName': f"{register.PatientId.Title.Title_Name}."
                               f"{register.PatientId.FirstName} "
                               f"{register.PatientId.MiddleName} "
                               f"{register.PatientId.SurName}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                # 'Address': ", ".join([str(part) for part in address_parts if part not in [None, '', 'None']]),

                # 'Address': ", ".join(filter(None, address_parts)),
                'Address': cleaned_address,
                'Gender': register.PatientId.Gender,
                'Nationality': register.PatientId.Nationality,
                'PatientType': register.PatientId.PatientType,
                'MaritalStatus': register.PatientId.MaritalStatus,
                'Occupation': register.PatientId.Occupation,
                'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'Complaint': register.Complaint,
                'Flagging': Flagging_name,
                'FlaggingColour': Flagging_color,
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'Specialization': register.Specialization.Speciality_Name if register.Specialization else '',
                'PrimaryDoctor': f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor.Tittle else ''}{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else ''} {register.PrimaryDoctor.Middle_Name if register.PrimaryDoctor else ''} {register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else ''}",
                'DoctorName': DoctorName,
                'Specilization': Specialization,
                'AdmissionDate': register.created_at.strftime('%d-%m-%Y') if register.created_at else None,
                'AdmissionTime': register.created_at.strftime('%I:%M %p') if register.created_at else None,
                'PatientCategory': register.PatientCategory,
                'NextToKinName' : admissionins.NextToKinName if admissionins else None

 
            }
 
            # Add room details if Booking_Status is 'Booked'
            if register.Booking_Status in ['Booked']:
                roomdetials = (
                    MCI_Patient_Admission_Room_Detials.objects
                    .filter(IP_Registration_Id=register)
                    .order_by('-created_at')
                    .first()
                )
 
                if roomdetials:
                    appointment_dict.update({
                        'BuildingName': getattr(roomdetials.RoomId.Building_Name, 'Building_Name', None),
                        'BlockName': getattr(roomdetials.RoomId.Block_Name, 'Block_Name', None),
                        'FloorName': getattr(roomdetials.RoomId.Floor_Name, 'Floor_Name', None),
                        'WardName': getattr(roomdetials.RoomId.Ward_Name.Ward_Name, 'Ward_Name', None),
                        'RoomNo': getattr(roomdetials.RoomId.Ward_Name, 'RoomNo', None),
                        'BedNo': getattr(roomdetials.RoomId, 'Bed_No', None),
                        'RoomId': getattr(roomdetials.RoomId, 'Room_Id', None),
                    })
 
            ip_register_data.append(appointment_dict)
 
        return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def get_MCI_Patient_Details_by_patientId(request):
    try:
        PatientId = request.GET.get("PatientId", '').strip()
        FirstName = request.GET.get("FirstName", '').strip()
        PhoneNumber = request.GET.get("PhoneNumber", '').strip()

        print(PatientId, 'PatientId')
        print(FirstName, 'FirstName')
        print(PhoneNumber, 'PhoneNumber')



        if MCI_Patient_Detials.objects.exists():
            patient = None
            print('hiiiii')

            if PatientId:
                
                patient = MCI_Patient_Detials.objects.get(Q(PatientNo=PatientId) & Q(DuplicateId=False))
            elif FirstName and PhoneNumber:
                print('hiiiii')
                if MCI_Patient_Detials.objects.filter(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False)).exists():
                    patient = MCI_Patient_Detials.objects.get(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False))
                else:
                    return JsonResponse({'warn': 'Patient does not exist'})

            print('hiiiii')
            if patient:
                Patient_data = {
                    'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                    'PatientId': patient.PatientNo,
                    'ABHA': patient.ABHA,
                    'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo and patient.PhoneNo.isdigit() else None,
                    'Title': patient.Title.Title_Id if patient.Title else None,
                    'FirstName': patient.FirstName,
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'Gender': patient.Gender,
                    'MaritalStatus': patient.MaritalStatus,
                    'SpouseName': patient.SpouseName,
                    'FatherName': patient.FatherName,
                    'DOB': patient.DOB,
                    'Age': patient.Age,
                    'ABHA': patient.ABHA,
                    'Email': patient.Email,
                    'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
                    'Occupation': patient.Occupation,
                    'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                    'Nationality': patient.Nationality,
                    'UHIDType': patient.UniqueIdType,
                    'UHIDNo': patient.UniqueIdNo,
                    'PatientType': patient.PatientType,
                    'DoorNo': patient.DoorNo or patient.PermanentdoorNo,
                    'Street': patient.Street or patient.PermanentStreet,
                    'Area': patient.Area or patient.PermanentArea,
                    'City': patient.City or patient.PermanentCity,
                    'District': patient.District or patient.PermanentDistrict,
                    'State': patient.State or patient.PermanentState,
                    'Country': patient.Country or patient.PermanentCountry,
                    'Pincode': patient.Pincode or patient.PermanentPincode,
                    'Status': patient.Status,
                    'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
                }
                return JsonResponse(Patient_data)
            else:
                return JsonResponse({'warn': 'Patient does not exist'})
        else:
            return JsonResponse({'warn': 'Patient does not exist'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(["POST"])
def Generate_Radiology_Requests_Manual_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Get test counts
            ct_count = int(data.get('CT', 0))
            mri_count = int(data.get('MRI', 0))
            xray_count = int(data.get('XRAY', 0))
            usg_count = int(data.get('USG', 0))
            created_by = data.get('created_by', 'system')
           
            total_requests = ct_count + mri_count + xray_count + usg_count
           
            if total_requests == 0:
                return JsonResponse({'warning': 'No test counts provided'})
           
            today = datetime.now().date()
           
            with transaction.atomic():
                yesterday = today - timedelta(days=1)
                   
                fake_patients = list(MCI_Patient_Appointment_Registration_Detials.objects.filter(
                    IsOriginal=False,
                    created_at__date=today,
                    Status="Registered"
                ).select_related('PatientId'))
               
                if not fake_patients:
                    return JsonResponse({'error': 'No fake patients found for today'})
               
                # Shuffle patients
                random.shuffle(fake_patients)
               
                # Test configuration
                test_types = [
                    {'code': 1, 'name': 'CT', 'count': ct_count},
                    {'code': 2, 'name': 'MRI', 'count': mri_count},
                    {'code': 3, 'name': 'XRAY', 'count': xray_count},
                    {'code': 4, 'name': 'USG', 'count': usg_count},
                ]
               
                # Get available test codes
                all_tests = TestName_Details.objects.all()
                test_codes_by_type = {}
               
                for test in all_tests:
                    radiology_id = test.Radiology_Id.Radiology_Id if test.Radiology_Id else None
                    if radiology_id not in test_codes_by_type:
                        test_codes_by_type[radiology_id] = []
                    test_codes_by_type[radiology_id].append(test.Test_Code)
               
                # Create requests
                created_count = 0
                patient_index = 0
               
                for test_type in test_types:
                    if test_type['count'] == 0:
                        continue
                   
                    test_code = test_type['code']
                   
                    if test_code not in test_codes_by_type or not test_codes_by_type[test_code]:
                        continue
                   
                    available_codes = test_codes_by_type[test_code]
                   
                    for _ in range(test_type['count']):
                        if patient_index >= len(fake_patients):
                            patient_index = 0
                       
                        patient = fake_patients[patient_index]
                       
                        # Get patient's doctor
                        op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Registration_Id=patient
                        ).first()
                       
                        if not op_appointment:
                            continue
                       
                        doctor = op_appointment.PrimaryDoctor
                       
                        # Select random test code
                        subtest_code = random.choice(available_codes)
                       
                        # Determine status
                        status = random.choice(["Request", "Paid", "Due"])
                       
                        # Create request
                        radiology_request = MCI_Radiology_Request_Details(
                            RegisterType='OP',
                            OP_Register_Id=patient,
                            Doctorid=doctor,
                            TestCode=test_code,
                            SubTestCode=subtest_code,
                            Status=status,
                            Service_Status='Pending',
                            created_by=created_by,
                            created_at=datetime.now()
                        )
                       
                        radiology_request.save()
                        created_count += 1
                        patient_index += 1
               
               
                return JsonResponse({
                    'success': f'Successfully created {created_count} radiology requests'
                })
               
        except Exception as e:
            logger.error(f"Error generating radiology requests: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
   
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@csrf_exempt
@require_http_methods(["POST"])
def Generate_IP_Radiology_Requests_Manual_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Get test counts
            ct_count = int(data.get('CT', 0))
            mri_count = int(data.get('MRI', 0))
            xray_count = int(data.get('XRAY', 0))
            usg_count = int(data.get('USG', 0))
            created_by = data.get('created_by', 'system')
           
            total_requests = ct_count + mri_count + xray_count + usg_count
           
            if total_requests == 0:
                return JsonResponse({'warning': 'No test counts provided'})
           
            today = datetime.now().date()
           
            with transaction.atomic():
                yesterday = today - timedelta(days=1)
                   
                fake_patients = list(MCI_Patient_IP_Registration_Detials.objects.filter(
                    IsOriginal=False,
                    Status="Admitted"
                ).select_related('PatientId'))
 
                print(fake_patients,'fake_patients')
               
                if not fake_patients:
                    return JsonResponse({'error': 'No fake patients found for IP'})
               
                # Shuffle patients
                random.shuffle(fake_patients)
               
                # Test configuration
                test_types = [
                    {'code': 1, 'name': 'CT', 'count': ct_count},
                    {'code': 2, 'name': 'MRI', 'count': mri_count},
                    {'code': 3, 'name': 'XRAY', 'count': xray_count},
                    {'code': 4, 'name': 'USG', 'count': usg_count},
                ]
               
                # Get available test codes
                all_tests = TestName_Details.objects.all()
                test_codes_by_type = {}
               
                for test in all_tests:
                    radiology_id = test.Radiology_Id.Radiology_Id if test.Radiology_Id else None
                    if radiology_id not in test_codes_by_type:
                        test_codes_by_type[radiology_id] = []
                    test_codes_by_type[radiology_id].append(test.Test_Code)
               
                # Create requests
                created_count = 0
                patient_index = 0
               
                for test_type in test_types:
                    if test_type['count'] == 0:
                        continue
                   
                    test_code = test_type['code']
                   
                    if test_code not in test_codes_by_type or not test_codes_by_type[test_code]:
                        continue
                   
                    available_codes = test_codes_by_type[test_code]
                   
                    for _ in range(test_type['count']):
                        if patient_index >= len(fake_patients):
                            patient_index = 0
                       
                        patient = fake_patients[patient_index]
 
                        print(patient,'patienttttttt')
                       
                       
                       
                        subtest_code = random.choice(available_codes)
                       
                        status = random.choice(["Request", "Paid", "Due"])
                       
                        radiology_request = MCI_Radiology_Request_Details(
                            RegisterType='IP',
                            IP_Register_Id=patient,
                            Doctorid=patient.PrimaryDoctor,
                            TestCode=test_code,
                            SubTestCode=subtest_code,
                            Status=status,
                            Service_Status='Pending',
                            created_by=created_by,
                            created_at=datetime.now()
                        )
                        print(radiology_request,'radiology_requestttttttt')
                        radiology_request.save()
                        created_count += 1
                        patient_index += 1
               
               
                return JsonResponse({
                    'success': f'Successfully created {created_count} radiology requests'
                })
               
        except Exception as e:
            logger.error(f"Error generating radiology requests: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
   
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@csrf_exempt
@require_http_methods(["POST"])
def Decrease_Specialty_Radiology_Requests_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            specialty = data.get('specialty', '')
            counts = data.get('counts', [])
            register_type = data.get('registerType', 'OP')
            cancelled_by = data.get('created_by', 'system')
           
            if not specialty:
                return JsonResponse({'error': 'Specialty required'})
           
            cancelled_count = 0
           
            with transaction.atomic():
                # Get specialty ID
                specialty_obj = Speciality_Detials.objects.filter(Speciality_Name=specialty).first()
                if not specialty_obj:
                    return JsonResponse({'error': 'Specialty not found'})
               
                for count_item in counts:
                    test_type = count_item.get('testType', '').upper()
                    count = int(count_item.get('count', 0))
                   
                    if count <= 0:
                        continue
                   
                    # Map test type to code
                    test_map = {'CT': '1', 'MRI': '2', 'XRAY': '3', 'USG': '4'}
                    test_code = test_map.get(test_type)
                   
                    if not test_code:
                        continue
                   
                    if register_type == 'OP':
                        requests = MCI_Radiology_Request_Details.objects.filter(
                            RegisterType='OP',
                            TestCode=test_code,
                            Status__in=['Request', 'Paid', 'Due'],
                            Service_Status__in=['Pending', 'In Progress'],
                            created_at__date=today
                        ).filter(
                            OP_Register_Id__MCI_appointment_doctor_specialties__Specialization=specialty_obj
                        ).distinct()[:count]
                   
                    else:  
                        requests = MCI_Radiology_Request_Details.objects.filter(
                            RegisterType='IP',
                            TestCode=test_code,
                            Status__in=['Request', 'Paid', 'Due'],
                            Service_Status__in=['Pending', 'In Progress'],
                            created_at__date=today
 
                        ).filter(
                            Doctorid__doctorprofessformdetials__Specialization=specialty_obj
                        ).distinct()[:count]
                   
                    for req in requests:
 
                        print('reqqqqqqqqqqq')
                        req.Status = 'Canceled'
                        req.Service_Status = 'Canceled'
                        req.save()
                        print(req,'delettttttttt')
                        cancelled_count += 1
           
            return JsonResponse({
                'success': True,
                'message': f'Cancelled {cancelled_count} radiology requests',
            })
           
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
   
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@csrf_exempt
@require_http_methods(["POST"])
def Generate_Specialty_Radiology_Requests_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            specialty_name = data.get('specialty', '')  
            counts = data.get('counts', [])
            register_type = data.get('registerType', 'OP')
            operation = data.get('operation', 'increase')
            created_by = data.get('created_by', 'system')
            
            if not specialty_name:
                return JsonResponse({'error': 'Specialty is required'})
            
            if not counts:
                return JsonResponse({'error': 'No test counts provided'})
            
            total_requests = sum(item.get('count', 0) for item in counts)
            
            if total_requests == 0:
                return JsonResponse({'warning': 'All test counts are zero'})
            
            today = datetime.now().date()
            
            with transaction.atomic():
                try:
                    specialty = Speciality_Detials.objects.get(Speciality_Name=specialty_name)
                except Speciality_Detials.DoesNotExist:
                    return JsonResponse({'error': f'Specialty "{specialty_name}" not found'})
                
                # Get ALL available subtest codes from TestName_Details
                all_test_names = TestName_Details.objects.all()
                
                # Organize test codes by test type (Radiology_Id)
                subtest_codes_by_type = {}
                test_codes_to_names = {}  # Map test codes to test names
                
                for test_name in all_test_names:
                    test_code = test_name.Test_Code
                    radiology_id = test_name.Radiology_Id.Radiology_Id if test_name.Radiology_Id else None
                    test_name_str = test_name.Test_Name or ""
                    
                    test_codes_to_names[test_code] = test_name_str
                    
                    if radiology_id not in subtest_codes_by_type:
                        subtest_codes_by_type[radiology_id] = []
                    
                    subtest_codes_by_type[radiology_id].append(test_code)
                
                # ====================================================================
                # TEST GROUP CONFIGURATION (from your auto-generate script)
                # ====================================================================
                # List of test codes to exclude
                excluded_test_codes = [
                    'TSTCODE0033', 'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208',
                    'TSTCODE0210', 'TSTCODE0206', 'TSTCODE0032', 'TSTCODE0076',
                    'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0222'
                ]
                
                group_a_tests = [
                    'TSTCODE0078', 'TSTCODE0081', 'TSTCODE0085', 'TSTCODE0089', 'TSTCODE0091',
                    'TSTCODE0093', 'TSTCODE0095', 'TSTCODE0097', 'TSTCODE0199', 'TSTCODE0203'
                ]
                group_a_daily_limit = 6
                
                group_b_tests = ['']
                group_b_daily_min = 2
                group_b_daily_max = 3
                
                group_c_tests = ['TSTCODE0025', 'TSTCODE0026', 'TSTCODE0027', 'TSTCODE0223']
                group_c_daily_min = 3
                group_c_daily_max = 4
                
                group_d_tests = {
                    'TSTCODE0030': {'min': 1, 'max': 2},
                    'TSTCODE0023': {'min': 1, 'max': 2},
                }
                
                # Age and gender restrictions
                age_restricted_tests = ['TSTCODE0025', 'TSTCODE0023', 'TSTCODE0024']
                female_age_restricted_test = 'TSTCODE0030'
                
                # Department-specific test configuration
                department_specific_tests = {
                    'PULMONOLOGY': ['TSTCODE0007', 'TSTCODE0094','TSTCODE0093','TSTCODE0095',
                            'TSTCODE0057','TSTCODE0059','TSTCODE0209','TSTCODE0060'],
            'DENTAL': ['TSTCODE0022'],
            'UROLOGY': ['TSTCODE0008', 'TSTCODE0039', 'TSTCODE0161', 'TSTCODE0205',
                       'TSTCODE0007', 'TSTCODE0130', 'TSTCODE0023', 'TSTCODE0024',
                       'TSTCODE0165','TSTCODE0166','TSTCODE0161','TSTCODE0162','TSTCODE0173',
                       'TSTCODE0205','TSTCODE0096','TSTCODE0224','TSTCODE0102',
                       'TSTCODE0039','TSTCODE0046'],
            'ORTHOPEDICS': ['TSTCODE0001', 'TSTCODE0006', 'TSTCODE0129', 'TSTCODE0128',
                           'TSTCODE0091', 'TSTCODE0090', 'TSTCODE0089', 'TSTCODE0088',
                           'TSTCODE0014', 'TSTCODE0148', 'TSTCODE0007', 'TSTCODE0130',
                           'TSTCODE0013', 'TSTCODE0147', 'TSTCODE0011', 'TSTCODE0145',
                           'TSTCODE0021', 'TSTCODE0020', 'TSTCODE0019', 'TSTCODE0154',
                           'TSTCODE0018', 'TSTCODE0153', 'TSTCODE0010', 'TSTCODE0144',
                           'TSTCODE0190', 'TSTCODE0009', 'TSTCODE0143','TSTCODE0131','TSTCODE0132',
                           'TSTCODE0133','TSTCODE0134','TSTCODE0135','TSTCODE0136',
                           'TSTCODE0137','TSTCODE0138','TSTCODE0139','TSTCODE0140',
                           'TSTCODE0141','TSTCODE0142','TSTCODE0146','TSTCODE0149',
                           'TSTCODE0150','TSTCODE0151','TSTCODE0152','TSTCODE0153',
                           'TSTCODE0154','TSTCODE0155','TSTCODE0156','TSTCODE0157',
                           'TSTCODE0165','TSTCODE0099','TSTCODE0092',
                           'TSTCODE0062','TSTCODE0063','TSTCODE0064','TSTCODE0065',
                           'TSTCODE0058','TSTCODE0059','TSTCODE0060'],
            'SURGERY': ['TSTCODE0007','TSTCODE0129','TSTCODE0160','TSTCODE0165',
                       'TSTCODE0166','TSTCODE0168','TSTCODE0176','TSTCODE0177',
                       'TSTCODE0158','TSTCODE0097','TSTCODE0095','TSTCODE0096',
                       'TSTCODE0062','TSTCODE0063','TSTCODE0046','TSTCODE0058',
                       'TSTCODE0048','TSTCODE0070','TSTCODE0043','TSTCODE0045',
                       'TSTCODE0061','TSTCODE0064','TSTCODE0065'],
            'ENT': ['TSTCODE0025', 'TSTCODE0026', 'TSTCODE0027', 'TSTCODE0002',
                   'TSTCODE0003', 'TSTCODE0005', 'TSTCODE0004',
                   'TSTCODE0108','TSTCODE0109','TSTCODE0110','TSTCODE0111',
                   'TSTCODE0112','TSTCODE0113','TSTCODE0114','TSTCODE0115',
                   'TSTCODE0117','TSTCODE0118','TSTCODE0128','TSTCODE0120',
                   'TSTCODE0124','TSTCODE0125','TSTCODE0123','TSTCODE0127',
                   'TSTCODE0129','TSTCODE0084','TSTCODE0108','TSTCODE0087',
                   'TSTCODE0085','TSTCODE0089','TSTCODE0049','TSTCODE0066'],
            'GYNECOLOGY': ['TSTCODE0030', 'TSTCODE0007', 'TSTCODE0130','TSTCODE0158',
                          'TSTCODE0164','TSTCODE0165','TSTCODE0221',
                          'TSTCODE0209','TSTCODE0041','TSTCODE0048','TSTCODE0047',
                          'TSTCODE0051'],
            'GENERALMEDICINE': ['TSTCODE0130', 'TSTCODE0008', 'TSTCODE0096',
                               'TSTCODE0108','TSTCODE0109','TSTCODE0110',
                               'TSTCODE0111','TSTCODE0112','TSTCODE0113',
                               'TSTCODE0114','TSTCODE0115','TSTCODE0116',
                               'TSTCODE0117','TSTCODE0118','TSTCODE0077',
                               'TSTCODE0093','TSTCODE0094','TSTCODE0209',
                               'TSTCODE0062','TSTCODE0063','TSTCODE0064',
                               'TSTCODE0065','TSTCODE0066','TSTCODE0058',
                               'TSTCODE0059','TSTCODE0060'],
            'PAEDIATRICS': ['TSTCODE0130', 'TSTCODE0008', 'TSTCODE0096','TSTCODE0108',
                           'TSTCODE0209','TSTCODE0046','TSTCODE0053','TSTCODE0058'],
            'EMERGENCYMEDICINE': ['TSTCODE0007','TSTCODE0130', 'TSTCODE0008',
                                 'TSTCODE0096','TSTCODE0030', 'TSTCODE0007',
                                 'TSTCODE0130','TSTCODE0025', 'TSTCODE0026',
                                 'TSTCODE0027', 'TSTCODE0002','TSTCODE0003',
                                 'TSTCODE0005', 'TSTCODE0004','TSTCODE0001',
                                 'TSTCODE0006', 'TSTCODE0129', 'TSTCODE0128',
                                 'TSTCODE0091', 'TSTCODE0090', 'TSTCODE0089',
                                 'TSTCODE0088','TSTCODE0014', 'TSTCODE0148',
                                 'TSTCODE0007', 'TSTCODE0130','TSTCODE0013',
                                 'TSTCODE0147', 'TSTCODE0011', 'TSTCODE0145',
                                 'TSTCODE0021', 'TSTCODE0020', 'TSTCODE0019',
                                 'TSTCODE0154','TSTCODE0018', 'TSTCODE0153',
                                 'TSTCODE0010', 'TSTCODE0144','TSTCODE0190',
                                 'TSTCODE0009', 'TSTCODE0143','TSTCODE0008',
                                 'TSTCODE0039', 'TSTCODE0161', 'TSTCODE0205',
                                 'TSTCODE0007', 'TSTCODE0130', 'TSTCODE0023',
                                 'TSTCODE0024','TSTCODE0108','TSTCODE0109',
                                 'TSTCODE0110','TSTCODE0111','TSTCODE0112',
                                 'TSTCODE0113','TSTCODE0114','TSTCODE0115',
                                 'TSTCODE0131','TSTCODE0132','TSTCODE0133',
                                 'TSTCODE0134','TSTCODE0135','TSTCODE0138',
                                 'TSTCODE0180','TSTCODE0181','TSTCODE0209',
                                 'TSTCODE0046','TSTCODE0040','TSTCODE0066',
                                 'TSTCODE0047','TSTCODE0048','TSTCODE0062',
                                 'TSTCODE0063','TSTCODE0064','TSTCODE0065',
                                 'TSTCODE0058','TSTCODE0049','TSTCODE0057']
       
       
               
                }
               
 
 
 


                # Determine daily targets
                group_b_target = random.randint(group_b_daily_min, group_b_daily_max)
                group_c_target = random.randint(group_c_daily_min, group_c_daily_max)
                
                group_d_targets = {}
                for test_code, limits in group_d_tests.items():
                    group_d_targets[test_code] = random.randint(limits['min'], limits['max'])
                
                # Select which 6 tests from Group A will be available today
                available_group_a_tests = random.sample(group_a_tests, group_a_daily_limit)
                
                # Track daily usage
                daily_usage = {
                    'group_a_selected': set(available_group_a_tests),
                    'group_a_count': 0,
                    'group_b_count': 0,
                    'group_c_count': 0,
                    'group_d_counts': {test: 0 for test in group_d_tests.keys()}
                }
                
                # Get department-specific tests for this specialty
                dept_field = specialty_name.upper().replace(" ", "")
                dept_specific_tests = department_specific_tests.get(dept_field, [])
                
                # Get patients based on register type
                if register_type == 'OP':
                    specialty_appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=specialty,
                        created_at__date=today,
                        Status="Registered"
                    ).select_related('Registration_Id', 'PrimaryDoctor', 'Registration_Id__PatientId')
                    
                    if not specialty_appointments:
                        return JsonResponse({'error': f'No appointments found for {specialty_name} specialty today'})
                    
                    specialty_patients = []
                    for appointment in specialty_appointments:
                        patient_reg = appointment.Registration_Id
                        if patient_reg and patient_reg.IsOriginal == False and patient_reg.Status == "Registered":
                            # Parse age from patient
                            patient_obj = patient_reg.PatientId
                            age = parse_age_string(patient_obj.Age)
                            gender = patient_obj.Gender if patient_obj.Gender else None
                            
                            specialty_patients.append({
                                'patient': patient_reg,
                                'doctor': appointment.PrimaryDoctor,
                                'appointment': appointment,
                                'patient_obj': patient_obj,
                                'age': age,
                                'gender': gender
                            })
                    
                    if not specialty_patients:
                        return JsonResponse({'error': f'No fake patients found for {specialty_name} specialty today'})
                    
                    print(f"Found {len(specialty_patients)} fake patients for {specialty_name} specialty")
                
                else:  # IP
                    fake_patients = list(MCI_Patient_IP_Registration_Detials.objects.filter(
                        IsOriginal=False,
                        Status="Admitted"
                    ).select_related('PatientId', 'PrimaryDoctor'))
                    
                    if not fake_patients:
                        return JsonResponse({'error': 'No fake IP patients found'})
                    
                    specialty_patients = []
                    for patient in fake_patients:
                        doctor = patient.PrimaryDoctor
                        if doctor:
                            # Parse age from patient
                            patient_obj = patient.PatientId
                            age = parse_age_string(patient_obj.Age)
                            gender = patient_obj.Gender if patient_obj.Gender else None
                            
                            if hasattr(doctor, 'Speciality_Id'):
                                if doctor.Speciality_Id == specialty:
                                    specialty_patients.append({
                                        'patient': patient,
                                        'doctor': doctor,
                                        'patient_obj': patient_obj,
                                        'age': age,
                                        'gender': gender
                                    })
                            elif hasattr(doctor, 'Speciality_Name'):
                                if doctor.Speciality_Name == specialty_name:
                                    specialty_patients.append({
                                        'patient': patient,
                                        'doctor': doctor,
                                        'patient_obj': patient_obj,
                                        'age': age,
                                        'gender': gender
                                    })
                            else:
                                # Fallback - add all patients
                                specialty_patients.append({
                                    'patient': patient,
                                    'doctor': doctor,
                                    'patient_obj': patient_obj,
                                    'age': age,
                                    'gender': gender
                                })
                    
                    if not specialty_patients:
                        return JsonResponse({'error': f'No IP patients found for {specialty_name} specialty'})
                    
                    print(f"Found {len(specialty_patients)} fake IP patients for {specialty_name} specialty")
                
                random.shuffle(specialty_patients)
                
                test_type_mapping = {
                    'CT': 1,
                    'MRI': 2,
                    'XRAY': 3,
                    'USG': 4
                }
                
                # Create requests
                created_count = 0
                patient_index = 0
                requests_created = []
                
                for count_item in counts:
                    test_type = count_item.get('testType', '')
                    count = int(count_item.get('count', 0))
                    
                    if count == 0:
                        continue
                    
                    test_code = test_type_mapping.get(test_type.upper())
                    
                    if not test_code:
                        print(f"Warning: Test type '{test_type}' not recognized")
                        continue
                    
                    if test_code not in subtest_codes_by_type or not subtest_codes_by_type[test_code]:
                        print(f"Warning: No test codes found for test type '{test_type}' (code: {test_code})")
                        continue
                    
                    # Filter eligible subtests based on your auto-generate script rules
                    eligible_subtests = []
                    
                    for subtest_code in subtest_codes_by_type[test_code]:
                        # 1. Check if test is excluded
                        if subtest_code in excluded_test_codes:
                            continue
                        
                        # 2. Check department-specific tests
                        # For EMERGENCYMEDICINE, all tests are acceptable
                        if dept_field != 'EMERGENCYMEDICINE' and dept_specific_tests:
                            # Only include tests from department-specific list
                            if subtest_code not in dept_specific_tests:
                                continue
                        
                        # 3. Check Group A restrictions
                        if subtest_code in group_a_tests:
                            if subtest_code not in daily_usage['group_a_selected']:
                                continue
                            if daily_usage['group_a_count'] >= group_a_daily_limit:
                                continue
                        
                        # 4. Check Group B restrictions
                        if subtest_code in group_b_tests:
                            if daily_usage['group_b_count'] >= group_b_target:
                                continue
                        
                        # 5. Check Group C restrictions
                        if subtest_code in group_c_tests:
                            if daily_usage['group_c_count'] >= group_c_target:
                                continue
                        
                        # 6. Check Group D restrictions
                        if subtest_code in group_d_tests:
                            if daily_usage['group_d_counts'].get(subtest_code, 0) >= group_d_targets.get(subtest_code, 0):
                                continue
                        
                        # 7. Check age-restricted tests
                        # Note: We'll check age/gender per patient in the loop below
                        # For now, just add to eligible list
                        
                        # All checks passed for test type
                        eligible_subtests.append(subtest_code)
                    
                    if not eligible_subtests:
                        print(f"Warning: No eligible subtests for test type '{test_type}'")
                        continue
                    
                    for i in range(count):
                        if patient_index >= len(specialty_patients):
                            patient_index = 0
                        
                        patient_data = specialty_patients[patient_index]
                        patient = patient_data['patient']
                        doctor = patient_data['doctor']
                        age = patient_data.get('age')
                        gender = patient_data.get('gender')
                        
                        # Filter eligible tests for this specific patient (age/gender restrictions)
                        patient_eligible_subtests = []
                        for subtest_code in eligible_subtests:
                            # Check age-restricted tests
                            if subtest_code in age_restricted_tests:
                                if not age or age <= 35:
                                    continue
                            
                            # Check female age-restricted test
                            if subtest_code == female_age_restricted_test:
                                if not gender or gender.upper() not in ['FEMALE', 'F'] or not age or not (25 <= age <= 35):
                                    continue
                            
                            # Check if we've reached daily limits
                            if subtest_code in group_a_tests:
                                if daily_usage['group_a_count'] >= group_a_daily_limit:
                                    continue
                            if subtest_code in group_b_tests:
                                if daily_usage['group_b_count'] >= group_b_target:
                                    continue
                            if subtest_code in group_c_tests:
                                if daily_usage['group_c_count'] >= group_c_target:
                                    continue
                            if subtest_code in group_d_tests:
                                if daily_usage['group_d_counts'].get(subtest_code, 0) >= group_d_targets.get(subtest_code, 0):
                                    continue
                            
                            patient_eligible_subtests.append(subtest_code)
                        
                        if not patient_eligible_subtests:
                            # Skip this patient if no eligible tests
                            patient_index += 1
                            continue
                        
                        # Select random test code
                        subtest_code = random.choice(patient_eligible_subtests)
                        
                        # Update daily usage counters
                        if subtest_code in group_a_tests:
                            daily_usage['group_a_count'] += 1
                        if subtest_code in group_b_tests:
                            daily_usage['group_b_count'] += 1
                        if subtest_code in group_c_tests:
                            daily_usage['group_c_count'] += 1
                        if subtest_code in group_d_tests:
                            daily_usage['group_d_counts'][subtest_code] += 1
                        
                        # Determine status
                        if operation == 'increase':
                            status = random.choice(["Paid"])
                        else:
                            status = random.choice(["Request", "Due"])

                        random_minutes = random.randint(10, 180)
                        realistic_time = datetime.now() - timedelta(minutes=random_minutes)
                               
                        users = ['VINOD', 'SARANYA', 'MANISHA']
                        
                        # Create request
                        if register_type == 'OP':
                            radiology_request = MCI_Radiology_Request_Details(
                                RegisterType='OP',
                                OP_Register_Id=patient,
                                Doctorid=doctor,
                                TestCode=test_code,
                                SubTestCode=subtest_code,
                                Status=status,
                                Service_Status='Pending',
                                created_by=random.choice(users),
                                created_at=realistic_time
                            )
                        else:  # IP
                            radiology_request = MCI_Radiology_Request_Details(
                                RegisterType='IP',
                                IP_Register_Id=patient,
                                Doctorid=doctor,
                                TestCode=test_code,
                                SubTestCode=subtest_code,
                                Status=status,
                                Service_Status='Pending',
                                created_by=random.choice(users),
                                created_at=realistic_time
                            )
                        
                        radiology_request.save()
                        created_count += 1
                        patient_index += 1
                        
                        test_name = test_codes_to_names.get(subtest_code, subtest_code)
                        print(f"Created {test_type} test ({subtest_code} - {test_name}) "
                              f"with status '{status}' for patient {patient.OPNo if hasattr(patient, 'OPNo') else patient.IPNo} "
                              f"(Age: {age}, Gender: {gender})")
                
                # Log statistics
                print("=" * 80)
                print("DAILY TEST GROUP STATISTICS:")
                print(f"Total tests created: {created_count}")
                print("=" * 80)
                print("GROUP A (10 tests, 6 should appear):")
                print(f"  Selected tests for today: {sorted(daily_usage['group_a_selected'])}")
                print(f"  Total assigned: {daily_usage['group_a_count']}/6")
                print("=" * 80)
                print("GROUP B (TSTCODE0179 appears 2-3 times):")
                print(f"  Target: {group_b_target}, Actual: {daily_usage['group_b_count']}")
                print("=" * 80)
                print("GROUP C (4 tests, 3-4 entries):")
                print(f"  Target: {group_c_target}, Actual: {daily_usage['group_c_count']}")
                print(f"  Tests: {group_c_tests}")
                print("=" * 80)
                print("GROUP D (Individual test limits):")
                for test_code, limits in group_d_tests.items():
                    actual = daily_usage['group_d_counts'].get(test_code, 0)
                    target = group_d_targets.get(test_code, limits['max'])
                    print(f"  {test_code}: Target {target}, Actual {actual}")
                print("=" * 80)
                
                return JsonResponse({
                    'success': True,
                    'message': f'Successfully created {created_count} radiology requests for {specialty_name} specialty',
                    'statistics': {
                        'total_created': created_count,
                        'group_a': {
                            'selected': sorted(daily_usage['group_a_selected']),
                            'assigned': daily_usage['group_a_count'],
                            'limit': group_a_daily_limit
                        },
                        'group_b': {
                            'target': group_b_target,
                            'actual': daily_usage['group_b_count']
                        },
                        'group_c': {
                            'target': group_c_target,
                            'actual': daily_usage['group_c_count']
                        },
                        'group_d': {
                            test_code: {
                                'target': group_d_targets.get(test_code, 0),
                                'actual': daily_usage['group_d_counts'].get(test_code, 0)
                            } for test_code in group_d_tests.keys()
                        }
                    }
                })
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.error(f"Error generating specialty radiology requests: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def parse_age_string(age_str):
    """
    Parse age string in format "44 Y, 10 M, 26 D" to years as integer.
    Also handles integer input and other string formats.
    """
    if not age_str:
        return random.randint(1, 80)
    
    if isinstance(age_str, (int, float)):
        return int(age_str)
    
    if isinstance(age_str, str):
        try:
            # Try to parse "44 Y, 10 M, 26 D" format
            years_match = re.search(r'(\d+)\s*Y', age_str)
            if years_match:
                return int(years_match.group(1))
            
            # Try to extract first number
            numbers = re.findall(r'\d+', age_str)
            if numbers:
                return int(numbers[0])
        except (ValueError, IndexError, AttributeError):
            pass
    
    # Fallback
    return random.randint(1, 80)


 
@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def MCI_Theatre_booking_request_details_Link_for_Org_OP_OT(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'premmmmmmmm')
           
            # Existing fields
            id = data.get('Booking_Id','')
            Theatreid = data.get('Theatreid','')
            ReqDate = data.get('reqDate','')
            ReqTime = data.get('reqTime','')
            BookingType = data.get('bookingType','')
            BookingDate = data.get('bookingDate','') or data.get('BookingDate','')
            BookingTime = data.get('bookingTime','') or data.get('BookingTime','')
            Duration = data.get('duration','')
            OperationType = data.get('operationType','')
            priority = data.get('priority','')
            patientId = data.get('patientId','')
            patientName = data.get('patientName','')
            Age = data.get('age','')
            Gender = data.get('gender','')
            UHIDno = data.get('uhidNo','')
            Createdby = data.get('created_by','')
            Specializtion = data.get('specialization','')
            SurgeryName = data.get('surgeryName','')
            OTName = data.get('OTName') or data.get('Theatreid')
            DoctorName = data.get('doctorName','')
            Status = data.get('Status','')
            Statusedit = data.get('Statusedit','')
            Reason = data.get('Reason','')
            OPD_Id = data.get('OPD_Id','')
            OperationMode = data.get('OperationMode','')
            RegistrationId = data.get('RegistrationId','')
            opregistrationnid = data.get('opregistrationnid','')
            ipregistrationid = data.get('ipregistrationid','')
            emgregistrationid = data.get('emgregistrationid','')
           
            # New fields
            Diagnosis = data.get('Diagnosis', '')
            Surgeon = data.get('Surgeon', [])  # This will be a JSON array
            Anaesthetist = data.get('Anaesthetist', [])  # This will be a JSON array
            ScrubNurse = data.get('ScrubNurse', [])  # This will be a JSON array
            Type = data.get('Type', '')
 
            Surgery_ins = ''
            Procdure_ins = ''
 
            Specialization_ins = Speciality_Detials.objects.get(pk=Specializtion) if Specializtion else None
 
            if OperationMode == 'SURGERY':
                Surgery_ins = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None
            else:
                Procdure_ins = Procedure_Master_Details.objects.get(pk=SurgeryName) if SurgeryName else None
 
            Theatre_ins = OtTheaterMaster_Detials.objects.get(pk=OTName) if OTName else None
            Doctor_ins = Doctor_Personal_Form_Detials.objects.get(pk=DoctorName) if DoctorName else None
            Patient_ins = MCI_Patient_Detials.objects.get(PatientId=patientId) if patientId else None
            booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(pk=id) if id else None
           
            op_reg_id_ins = MCI_Patient_Appointment_Registration_Detials.objects.filter(PatientId__PatientId=patientId).last()
            ip_reg_id_ins = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=RegistrationId).first()
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
 
            
            if OperationMode == 'SURGERY':
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = Surgery_ins,
                    ProcedureName = None,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
            else:
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = 'OP',
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = None,
                    ProcedureName = Procdure_ins,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
 
            booking_ins.save()
 
            return JsonResponse({'success': 'Booking Request Added successfully'})
 
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(["POST"])
def MCI_Theatre_booking_request_details_Link_for_Dummy_OP_OT(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'premmmmmmmm')
           
            # Existing fields
            id = data.get('Booking_Id','')
            Theatreid = data.get('Theatreid','')
            ReqDate = data.get('reqDate','')
            ReqTime = data.get('reqTime','')
            BookingType = data.get('bookingType','')
            BookingDate = data.get('bookingDate','') or data.get('BookingDate','')
            BookingTime = data.get('bookingTime','') or data.get('BookingTime','')
            Duration = data.get('duration','')
            OperationType = data.get('operationType','')
            priority = data.get('priority','')
            patientId = data.get('patientId','')
            patientName = data.get('patientName','')
            Age = data.get('age','')
            Gender = data.get('gender','')
            UHIDno = data.get('uhidNo','')
            Createdby = data.get('created_by','')
            Specializtion = data.get('specialization','')
            SurgeryName = data.get('surgeryName','')
            OTName = data.get('OTName') or data.get('Theatreid')
            DoctorName = data.get('doctorName','')
            Status = data.get('Status','')
            Statusedit = data.get('Statusedit','')
            Reason = data.get('Reason','')
            OPD_Id = data.get('OPD_Id','')
            OperationMode = data.get('OperationMode','')
            RegistrationId = data.get('RegistrationId','')
            opregistrationnid = data.get('opregistrationnid','')
            ipregistrationid = data.get('ipregistrationid','')
            emgregistrationid = data.get('emgregistrationid','')
           
            # New fields
            Diagnosis = data.get('Diagnosis', '')
            Surgeon = data.get('Surgeon', [])  # This will be a JSON array
            Anaesthetist = data.get('Anaesthetist', [])  # This will be a JSON array
            ScrubNurse = data.get('ScrubNurse', [])  # This will be a JSON array
            Type = data.get('Type', '')
 
            Surgery_ins = ''
            Procdure_ins = ''
 
            Specialization_ins = Speciality_Detials.objects.get(pk=Specializtion) if Specializtion else None
 
            if OperationMode == 'SURGERY':
                Surgery_ins = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None
            else:
                Procdure_ins = Procedure_Master_Details.objects.get(pk=SurgeryName) if SurgeryName else None
 
            Theatre_ins = OtTheaterMaster_Detials.objects.get(pk=OTName) if OTName else None
            Doctor_ins = Doctor_Personal_Form_Detials.objects.get(pk=DoctorName) if DoctorName else None
            Patient_ins = MCI_Patient_Detials.objects.get(PatientNo=patientId) if patientId else None
            booking_ins = MCI_Theatre_Booking_Request_Details.objects.get(pk=id) if id else None
           
            op_reg_id_ins = MCI_Patient_Appointment_Registration_Detials.objects.filter(PatientId__PatientNo=patientId).last()
            ip_reg_id_ins = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=RegistrationId).first()
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
 
            
            if OperationMode == 'SURGERY':
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = Surgery_ins,
                    ProcedureName = None,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
            else:
                booking_ins = MCI_Theatre_Booking_Request_Details(
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = 'OP',
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy = Createdby,
                    Status = Status,
                    Reason = Reason,
                    Diagnosis = Diagnosis,
                    Surgeon = Surgeon,
                    Anaesthetist = Anaesthetist,
                    ScrubNurse = ScrubNurse,
                    Type = Type,
                    Specialization = Specialization_ins,
                    SurgeryName = None,
                    ProcedureName = Procdure_ins,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
                )
 
            booking_ins.save()
 
            return JsonResponse({'success': 'Booking Request Added successfully'})
 
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'error': str(e)})

from django.db.models import OuterRef, Exists
from datetime import timedelta

@csrf_exempt
@require_http_methods(["POST"])
def MCI_Create_Test_Requests_By_Count(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            speciality_id = data.get("speciality")
            patientCount = data.get("patientCount")
            selectdate = data.get("date")
            counts_config = data.get("counts", [])
            created_by = data.get("createdBy")
            location_id = data.get("location")
            registerType = data.get("registerType")

            print(f"Speciality ID: {speciality_id}, Created By: {created_by}, Location ID: {location_id}, Register Type: {registerType}")

            if not all([speciality_id, created_by, location_id, registerType]):
                return JsonResponse(
                    {
                        "error": "Missing required fields: speciality, createdBy, location, registerType"
                    },
                    status=400,
                )

            # Validate speciality exists
            try:
                speciality = Speciality_Detials.objects.get(Speciality_Id=speciality_id)
                print(f"Speciality found: {speciality.Speciality_Name}")
            except Speciality_Detials.DoesNotExist:
                return JsonResponse(
                    {"error": f"Speciality with ID {speciality_id} not found"},
                    status=404,
                )

            # Validate location exists
            try:
                location_instance = Location_Detials.objects.get(
                    Location_Id=location_id
                )
                print(f"Location found: {location_instance.Location_Name}")
            except Location_Detials.DoesNotExist:
                return JsonResponse(
                    {"error": f"Location with ID {location_id} not found"}, status=404
                )

            today = datetime.now().date()
            print(f"Processing date: {today}")

            if registerType == "OP":
                existing_requests = MCI_Lab_Request_Details.objects.filter(
                    OP_Register_Id=OuterRef("Registration_Id"),
                    created_at__date=selectdate
                )
        
                # Fetch OP patients for today
                today_appointments = (
                    MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Specialization=speciality,
                        created_at__date=selectdate,
                        Registration_Id__IsOriginal=False,
                    )
                    .select_related(
                        "Registration_Id", "Registration_Id__PatientId", "PrimaryDoctor"
                    )
                    .order_by("created_at")
                )
                if isinstance(selectdate, str):
                    selectdate = datetime.strptime(selectdate, "%Y-%m-%d").date()

                beforedate = selectdate
                max_days_back = 7   # safety limit (adjust as needed)

                day_count = 0

                while day_count < max_days_back:
                    beforedate -= timedelta(days=1)

                    today_appointments = (
                        MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Specialization=speciality,
                            created_at__date=beforedate,
                            Registration_Id__IsOriginal=False,
                        )
                        .select_related(
                            "Registration_Id",
                            "Registration_Id__PatientId",
                            "PrimaryDoctor",
                        )
                        .order_by("created_at")
                    )

                    if today_appointments.exists():
                        break

                    day_count += 1
                print(f"Found {today_appointments.count()} appointments for today")
                today_appointments = today_appointments.annotate(
                    has_lab_request=Exists(existing_requests)
                ).filter(has_lab_request=False)
                print(f"Found {today_appointments.count()} filtered appointments for today")

                if not today_appointments.exists():
                    return JsonResponse(
                        {
                            "success": False,
                            "message": f"No {speciality.Speciality_Name} patients found for today",
                            "patients_processed": 0,
                            "tests_created": 0,
                        },
                        status=200,
                    )

                import random

                appointments = list(today_appointments)
                count = min(int(patientCount), len(appointments))

                appointments_list = random.sample(appointments, count)
                total_patients = len(appointments_list)
                print(f"Selected {total_patients} patients to process")

                def get_next_item_id():
                    try:
                        max_item = MCI_Lab_Request_Items_Details.objects.aggregate(
                            max_id=Max(Cast("Item_Id", IntegerField()))
                        )["max_id"]
                        next_id = (max_item or 0) + 1
                        print(f"Next Item_ID: {next_id}")
                        return next_id
                    except Exception as e:
                        print(f"Error getting next item ID: {e}")
                        return MCI_Lab_Request_Items_Details.objects.count() + 1

                next_item_id = get_next_item_id()

                results = []
                all_tests_created = []
                patient_test_counts = {} 
                
                tests= []
                for count_config in counts_config:
                    dept_code = count_config.get("departmentCode")
                    dept_name = count_config.get("departmentName")
                    daily_count = count_config.get("dailyCount", 0)

                    print(f"\nProcessing department: {dept_name}, Code: {dept_code}, Daily Count: {daily_count}")

                    # Skip if daily count is 0
                    if daily_count <= 0:
                        results.append(
                            {
                                "department": dept_name,
                                "departmentCode": dept_code,
                                "dailyCount": daily_count,
                                "testsCreated": 0,
                                "status": "skipped",
                                "reason": "Daily count is 0",
                            }
                        )
                        continue

                    try:
                        
                        qs = Test_Descriptions.objects.filter(
                            sub_department__SubDepartment_Code=dept_code
                        )

                        test = random.sample(
                            list(qs),
                            min(int(daily_count), qs.count())
                        )
                        tests.extend(test)
                        print(f"Tests listed for this department: {dept_name}")
                    
                    except SubLab_Department_Detials.DoesNotExist:
                        print(f"Department not found: {dept_name}")
                        continue
                

                
                req_count = 0
                for patient_index, appointment in enumerate(appointments_list):
                    req_count += 1
                    registration = appointment.Registration_Id
                    patient = registration.PatientId
                    patient_id = patient.PatientId

                    test = []
                    if len(tests) > 0:    
                        random_count = random.randint(1, min(4, len(tests)))

                        test = random.sample(tests, random_count)
                        tests = [t for t in tests if t not in test]


                    if len(tests) > 0:
                        lab_request = MCI_Lab_Request_Details.objects.create(
                            OP_Register_Id=registration,
                            RegisterType="OP",
                            Location=location_instance,
                            Status="Pending",
                            Billing_Status="Pending",
                            created_by=created_by,
                            created_at=selectdate,
                            updated_at=selectdate
                        )
                        lab_request.save()

                        for summa in test:
                            print("Test---------",summa)
                            NextItemID = (
                                MCI_Lab_Request_Items_Details.objects
                                .annotate(item_id_int=Cast("Item_Id", IntegerField()))
                                .aggregate(max_id=Max("item_id_int"))["max_id"] or 0
                            ) + 1

                            # Convert to string if Item_Id is a CharField
                            lab_request_item_data = {
                                "Item_Id": str(NextItemID),
                                "Request": lab_request,
                                "TestType": "Individual",
                                "Service_Status": "Completed",
                                "Analysis_Status": "Completed",
                                "Verify_Status": "Completed",
                                "Approve_Status": "Completed",
                                "SubDepartment_Code": summa.sub_department,
                                "Department_Code": summa.department,
                                "Test_Code": summa,
                                "Group_Code": None,
                                "Package_Code": None,
                                "created_at": selectdate,
                                "updated_at": selectdate
                            }

                            MCI_Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                        print(f"✅ Lab request created for patient ID {registration} and {len(test)} tests created... ")
                    else:
                        print(f"Zero Tests Found...")
                        break

                    dept_tests_created = []
                    
                if len(tests) > 0:
                    unique_tests_assigned = len(set([t["testCode"] for t in dept_tests_created]))
                    
                    results.append(
                        {
                            "dailyCount": daily_count,
                            "testsCreated": len(tests),
                            "status": "success",
                            "labRequestsCreated": req_count,
                            "patientsProcessed": req_count,
                            "uniqueTestsAssigned": len(tests)
                        }
                    )
                else:
                    results.append(
                        {
                            "dailyCount": daily_count,
                            "testsCreated": 0,
                            "status": "no_tests_created",
                            "reason": "No available patients with test slots or all tests already assigned"
                        }
                    )

                all_tests_created.extend(dept_tests_created)

                total_tests_created = sum(r.get("testsCreated", 0) for r in results)
                total_lab_requests_created = len(appointments_list)
                total_patients_processed = len(today_appointments)
                
                unique_tests_across_patients = len(appointments_list)
                
                print(f"\n=== FINAL SUMMARY ===")
                print(f"Total patients selected: {total_patients}")
                print(f"Total patients processed: {total_patients_processed}")
                print(f"Total tests created: {total_tests_created}")
                print(f"Total lab requests created: {total_lab_requests_created}")
                print(f"Unique tests assigned across all patients: {unique_tests_across_patients}")
                
                print(f"\n=== DATABASE VERIFICATION ===")
                lab_requests_today = MCI_Lab_Request_Details.objects.filter(created_at__date=today).count()
                test_items_today = MCI_Lab_Request_Items_Details.objects.filter(created_at__date=today).count()
                print(f"Total lab requests in DB today: {lab_requests_today}")
                print(f"Total test items in DB today: {test_items_today}")

                response_data = {
                    "success": True,
                    "message": f"Test requests created for {speciality.Speciality_Name} patients",
                    "summary": {
                        "date": today.strftime("%Y-%m-%d"),
                        "speciality": speciality.Speciality_Name,
                        "totalPatientsSelected": total_patients,
                        "totalPatientsProcessed": total_patients_processed,
                        "totalTestsCreated": total_tests_created,
                        "totalLabRequestsCreated": total_lab_requests_created,
                        "departmentsProcessed": len([r for r in results if r.get("testsCreated", 0) > 0]),
                        "uniqueTestsAssigned": unique_tests_across_patients
                    },
                    "departmentResults": results,
                    "debug": {
                        "labRequestsInDB": lab_requests_today,
                        "testItemsInDB": test_items_today
                    }
                }

                return JsonResponse(response_data, status=200)
                
            # elif registerType == "IP":
            #     today_appointments = (
            #         MCI_Patient_IP_Registration_Detials.objects.filter(
            #             Specialization=speciality,
            #             created_at__date=today,
            #             IsOriginal=False,
            #         )
            #         .select_related(
            #             "PatientId", "PrimaryDoctor"
            #         )
            #         .order_by("created_at")
            #     )

            #     print(f"Found {today_appointments.count()} appointments for today")

            #     if not today_appointments.exists():
            #         return JsonResponse(
            #             {
            #                 "success": False,
            #                 "message": f"No {speciality.Speciality_Name} patients found for today",
            #                 "patients_processed": 0,
            #                 "tests_created": 0,
            #             },
            #             status=200,
            #         )

            #     # Take only 5 patients as requested
            #     appointments_list = list(today_appointments[:5])
            #     total_patients = len(appointments_list)
            #     print(f"Selected {total_patients} patients to process")

            #     # Get next available Item_Id
            #     def get_next_item_id():
            #         try:
            #             max_item = MCI_Lab_Request_Items_Details.objects.aggregate(
            #                 max_id=Max(Cast("Item_Id", IntegerField()))
            #             )["max_id"]
            #             next_id = (max_item or 0) + 1
            #             print(f"Next Item_ID: {next_id}")
            #             return next_id
            #         except Exception as e:
            #             print(f"Error getting next item ID: {e}")
            #             return MCI_Lab_Request_Items_Details.objects.count() + 1

            #     next_item_id = get_next_item_id()

            #     # Step 2: Process each department count configuration
            #     results = []
            #     all_tests_created = []
            #     import random

            #     for count_config in counts_config:
            #         dept_code = count_config.get("departmentCode")
            #         dept_name = count_config.get("departmentName")
            #         daily_count = count_config.get("dailyCount", 0)

            #         print(f"\nProcessing department: {dept_name}, Code: {dept_code}, Daily Count: {daily_count}")

            #         # Skip if daily count is 0
            #         if daily_count <= 0:
            #             results.append(
            #                 {
            #                     "department": dept_name,
            #                     "departmentCode": dept_code,
            #                     "dailyCount": daily_count,
            #                     "testsCreated": 0,
            #                     "status": "skipped",
            #                     "reason": "Daily count is 0",
            #                 }
            #             )
            #             continue

            #         # Validate department exists
            #         try:
            #             sub_department = SubLab_Department_Detials.objects.get(
            #                 SubDepartment_Code=dept_code,
            #                 SubDepartment_Name=dept_name,
            #                 Status="Active",
            #             )
            #             print(f"Department found and active: {dept_name}")
            #         except SubLab_Department_Detials.DoesNotExist:
            #             results.append(
            #                 {
            #                     "department": dept_name,
            #                     "departmentCode": dept_code,
            #                     "status": "error",
            #                     "reason": "Department not found or not active",
            #                 }
            #             )
            #             print(f"Department not found: {dept_name}")
            #             continue

            #         # Get parent department
            #         parent_department = sub_department.department
            #         print(f"Parent department: {parent_department.Department_Name}")

            #         # Get ALL available tests for this department
            #         all_available_tests = list(Test_Descriptions.objects.filter(
            #             sub_department=sub_department
            #         ).order_by("Test_Name"))

            #         if not all_available_tests:
            #             results.append(
            #                 {
            #                     "department": dept_name,
            #                     "departmentCode": dept_code,
            #                     "dailyCount": daily_count,
            #                     "testsCreated": 0,
            #                     "status": "error",
            #                     "reason": "No active tests available in this department",
            #                 }
            #             )
            #             print(f"No tests found in department {dept_name}")
            #             continue

            #         print(f"Found {len(all_available_tests)} available tests")
                    
            #         # Shuffle the tests to get random order
            #         random.shuffle(all_available_tests)
            #         print("Tests shuffled for random assignment")

            #         tests_created = 0
            #         dept_tests_created = []
                    
            #         # Calculate tests per patient
            #         tests_per_patient = daily_count
            #         print(f"Creating {tests_per_patient} tests for each patient")

            #         # For each patient, create the specified number of tests
            #         for patient_index, appointment in enumerate(appointments_list):
            #             registration = appointment
            #             patient = registration.PatientId
            #             patient_id = patient.PatientId
                        
            #             print(f"\nProcessing patient {patient_index + 1}: {patient_id}: {patient.FirstName} {patient.SurName}")
                        
            #             # Check existing tests for this patient today
            #             existing_tests_count = MCI_Lab_Request_Items_Details.objects.filter(
            #                 Request__IP_Register_Id=registration,
            #                 created_at__date=today
            #             ).count()
                        
            #             # Calculate how many tests we can add to this patient
            #             available_slots = 10 - existing_tests_count
            #             if available_slots <= 0:
            #                 print(f"Patient {patient_id} already has 10 tests today. Skipping.")
            #                 continue
                        
            #             # Limit to tests_per_patient or available slots, whichever is smaller
            #             tests_to_create_for_patient = min(tests_per_patient, available_slots)
            #             print(f"Can create {tests_to_create_for_patient} tests for this patient")
                        
            #             # Get tests that this patient doesn't have today
            #             existing_test_codes = MCI_Lab_Request_Items_Details.objects.filter(
            #                 Request__IP_Register_Id=registration,
            #                 created_at__date=today
            #             ).values_list('Test_Code__Test_Code', flat=True)
                        
            #             # Filter available tests to exclude ones patient already has
            #             available_tests_for_patient = [test for test in all_available_tests 
            #                                           if test.Test_Code not in existing_test_codes]
                        
            #             if not available_tests_for_patient:
            #                 print(f"No new tests available for patient {patient_id}")
            #                 continue
                        
            #             # Shuffle again for this patient to get different random selection
            #             random.shuffle(available_tests_for_patient)
                        
            #             # Take only the number of tests we need for this patient
            #             selected_tests = available_tests_for_patient[:tests_to_create_for_patient]
                        
            #             for test_index, test in enumerate(selected_tests):
            #                 print(f"Creating test {test_index + 1}: {test.Test_Name} for patient {patient_id}")
                            
            #                 # Check if lab request exists for this patient today
            #                 existing_lab_request = MCI_Lab_Request_Details.objects.filter(
            #                     IP_Register_Id=registration,
            #                     RegisterType="IP",
            #                     Location=location_instance,
            #                     created_at__date=today
            #                 ).first()
                            
            #                 if existing_lab_request:
            #                     print(f"Found existing lab request: {existing_lab_request.Request_Id}")
            #                     lab_request = existing_lab_request
            #                     created = False
            #                 else:
            #                     print("Creating NEW lab request")
            #                     try:
            #                         lab_request = MCI_Lab_Request_Details.objects.create(
            #                             IP_Register_Id=registration,
            #                             RegisterType="IP",
            #                             Location=location_instance,
            #                             Status="Pending",
            #                             Billing_Status="Pending",
            #                             created_by=created_by,
            #                             created_at=datetime.now(),
            #                             updated_at=datetime.now(),
            #                         )
            #                         print(f"NEW Lab Request created with ID: {lab_request.Request_Id}")
            #                         created = True
            #                     except Exception as e:
            #                         print(f"Error creating lab request: {e}")
            #                         continue

            #                 # Generate unique Item_Id
            #                 for attempt in range(100):
            #                     try:
            #                         # Check if ID exists
            #                         if MCI_Lab_Request_Items_Details.objects.filter(Item_Id=str(next_item_id)).exists():
            #                             next_item_id += 1
            #                             continue
                                    
            #                         print(f"Creating test item with Item_Id: {next_item_id}")
                                    
            #                         # Create the test item
            #                         lab_item = MCI_Lab_Request_Items_Details.objects.create(
            #                             Item_Id=str(next_item_id),
            #                             Request=lab_request,
            #                             TestType="Individual",
            #                             Test_Code=test,
            #                             Department_Code=parent_department,
            #                             SubDepartment_Code=sub_department,
            #                             Service_Status="Pending",
            #                             Analysis_Status="Pending",
            #                             Verify_Status="Pending",
            #                             Approve_Status="Pending",
            #                             created_at=datetime.now(),
            #                             updated_at=datetime.now(),
            #                         )
                                    
            #                         print(f"Test item created successfully: {lab_item.Item_Id}")
            #                         current_item_id = next_item_id
            #                         next_item_id += 1
                                    
            #                         tests_created += 1
            #                         print(f"Tests created so far: {tests_created}")
                                    
            #                         # Track created test
            #                         dept_tests_created.append(
            #                             {
            #                                 "testCode": test.Test_Code,
            #                                 "testName": test.Test_Name,
            #                                 "patientId": patient.PatientId,
            #                                 "ipNo": registration.IPNo,
            #                                 "patientName": f"{patient.FirstName} {patient.SurName}".strip(),
            #                                 "itemId": str(current_item_id),
            #                                 "labRequestId": lab_request.Request_Id,
            #                                 "labRequestCreated": created
            #                             }
            #                         )
            #                         break
                                    
            #                     except IntegrityError:
            #                         print(f"Duplicate Item_Id: {next_item_id}, trying next...")
            #                         next_item_id += 1
            #                         continue
            #                     except Exception as e:
            #                         print(f"Error creating test item: {e}")
            #                         break

            #         # Record results for this department
            #         if tests_created > 0:
            #             # Get unique tests assigned to see diversity
            #             unique_tests_assigned = len(set([t["testCode"] for t in dept_tests_created]))
                        
            #             results.append(
            #                 {
            #                     "department": dept_name,
            #                     "departmentCode": dept_code,
            #                     "dailyCount": daily_count,
            #                     "testsCreated": tests_created,
            #                     "status": "success",
            #                     "labRequestsCreated": len(set([t["labRequestId"] for t in dept_tests_created])),
            #                     "patientsProcessed": len(set([t["patientId"] for t in dept_tests_created])),
            #                     "uniqueTestsAssigned": unique_tests_assigned
            #                 }
            #             )
            #             print(f"Successfully created {tests_created} tests for {dept_name}")
            #             print(f"Assigned {unique_tests_assigned} unique tests across all patients")
            #         else:
            #             results.append(
            #                 {
            #                     "department": dept_name,
            #                     "departmentCode": dept_code,
            #                     "dailyCount": daily_count,
            #                     "testsCreated": 0,
            #                     "status": "no_tests_created",
            #                     "reason": "No available patients with test slots or all tests already assigned"
            #                 }
            #             )

            #         all_tests_created.extend(dept_tests_created)

            #     # Prepare summary
            #     total_tests_created = sum(r.get("testsCreated", 0) for r in results)
            #     total_lab_requests_created = len(set([t.get("labRequestId") for t in all_tests_created if t.get("labRequestId")]))
            #     total_patients_processed = len(set([t.get("patientId") for t in all_tests_created if t.get("patientId")]))
                
            #     # Calculate unique tests across all patients
            #     unique_tests_across_patients = len(set([t.get("testCode") for t in all_tests_created if t.get("testCode")]))
                
            #     print(f"\n=== FINAL SUMMARY ===")
            #     print(f"Total patients selected: {total_patients}")
            #     print(f"Total patients processed: {total_patients_processed}")
            #     print(f"Total tests created: {total_tests_created}")
            #     print(f"Total lab requests created: {total_lab_requests_created}")
            #     print(f"Unique tests assigned across all patients: {unique_tests_across_patients}")
                
            #     # Verify data was saved
            #     print(f"\n=== DATABASE VERIFICATION ===")
            #     lab_requests_today = MCI_Lab_Request_Details.objects.filter(created_at__date=today).count()
            #     test_items_today = MCI_Lab_Request_Items_Details.objects.filter(created_at__date=today).count()
            #     print(f"Total lab requests in DB today: {lab_requests_today}")
            #     print(f"Total test items in DB today: {test_items_today}")

            #     response_data = {
            #         "success": True,
            #         "message": f"Test requests created for {speciality.Speciality_Name} patients",
            #         "summary": {
            #             "date": today.strftime("%Y-%m-%d"),
            #             "speciality": speciality.Speciality_Name,
            #             "totalPatientsSelected": total_patients,
            #             "totalPatientsProcessed": total_patients_processed,
            #             "totalTestsCreated": total_tests_created,
            #             "totalLabRequestsCreated": total_lab_requests_created,
            #             "departmentsProcessed": len([r for r in results if r.get("testsCreated", 0) > 0]),
            #             "uniqueTestsAssigned": unique_tests_across_patients
            #         },
            #         "departmentResults": results,
            #         "debug": {
            #             "labRequestsInDB": lab_requests_today,
            #             "testItemsInDB": test_items_today
            #         }
            #     }

            #     return JsonResponse(response_data, status=200)

            elif registerType == "IP":
                today_appointments = (
                    MCI_Patient_IP_Registration_Detials.objects.filter(
                        Specialization=speciality,
                        created_at__date=today,
                        IsOriginal=False,
                    )
                    .select_related(
                        "PatientId", "PrimaryDoctor"
                    )
                    .order_by("created_at")
                )

                print(f"Found {today_appointments.count()} appointments for today")

                if not today_appointments.exists():
                    return JsonResponse(
                        {
                            "success": False,
                            "message": f"No {speciality.Speciality_Name} patients found for today",
                            "patients_processed": 0,
                            "tests_created": 0,
                        },
                        status=200,
                    )

                import random

                appointments = list(today_appointments)
                count = min(int(patientCount), len(appointments))

                appointments_list = random.sample(appointments, count)
                total_patients = len(appointments_list)
                print(f"Selected {total_patients} patients to process")

                def get_next_item_id():
                    try:
                        max_item = MCI_Lab_Request_Items_Details.objects.aggregate(
                            max_id=Max(Cast("Item_Id", IntegerField()))
                        )["max_id"]
                        next_id = (max_item or 0) + 1
                        print(f"Next Item_ID: {next_id}")
                        return next_id
                    except Exception as e:
                        print(f"Error getting next item ID: {e}")
                        return MCI_Lab_Request_Items_Details.objects.count() + 1

                next_item_id = get_next_item_id()

                results = []
                all_tests_created = []
                patient_test_counts = {} 
                
                tests= []
                for count_config in counts_config:
                    dept_code = count_config.get("departmentCode")
                    dept_name = count_config.get("departmentName")
                    daily_count = count_config.get("dailyCount", 0)

                    print(f"\nProcessing department: {dept_name}, Code: {dept_code}, Daily Count: {daily_count}")

                    # Skip if daily count is 0
                    if daily_count <= 0:
                        results.append(
                            {
                                "department": dept_name,
                                "departmentCode": dept_code,
                                "dailyCount": daily_count,
                                "testsCreated": 0,
                                "status": "skipped",
                                "reason": "Daily count is 0",
                            }
                        )
                        continue

                    try:
                        
                        qs = Test_Descriptions.objects.filter(
                            sub_department__SubDepartment_Code=dept_code
                        )

                        test = random.sample(
                            list(qs),
                            min(int(daily_count), qs.count())
                        )
                        tests.extend(test)
                        print(f"Tests listed for this department: {dept_name}")
                    
                    except SubLab_Department_Detials.DoesNotExist:
                        print(f"Department not found: {dept_name}")
                        continue
                

                
                req_count = 0
                for patient_index, appointment in enumerate(appointments_list):
                    req_count += 1
                    registration = appointment.Registration_Id
                    patient = appointment.PatientId
                    patient_id = patient.PatientId

                    test = []
                    if len(tests) > 0:    
                        random_count = random.randint(1, min(4, len(tests)))

                        test = random.sample(tests, random_count)
                        tests = [t for t in tests if t not in test]


                    if len(tests) > 0:
                        lab_request = MCI_Lab_Request_Details.objects.create(
                            IP_Register_Id=appointment,
                            RegisterType="IP",
                            Location=location_instance,
                            Status="Pending",
                            Billing_Status="Pending",
                            created_by=created_by,
                            created_at=selectdate,
                            updated_at=selectdate
                        )
                        lab_request.save()

                        for summa in test:
                            print("Test---------",summa)
                            NextItemID = (
                                MCI_Lab_Request_Items_Details.objects
                                .annotate(item_id_int=Cast("Item_Id", IntegerField()))
                                .aggregate(max_id=Max("item_id_int"))["max_id"] or 0
                            ) + 1

                            # Convert to string if Item_Id is a CharField
                            lab_request_item_data = {
                                "Item_Id": str(NextItemID),
                                "Request": lab_request,
                                "TestType": "Individual",
                                "Service_Status": "Completed",
                                "Analysis_Status": "Completed",
                                "Verify_Status": "Completed",
                                "Approve_Status": "Completed",
                                "SubDepartment_Code": summa.sub_department,
                                "Department_Code": summa.department,
                                "Test_Code": summa,
                                "Group_Code": None,
                                "Package_Code": None,
                                "created_at": selectdate,
                                "updated_at": selectdate
                            }

                            MCI_Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                        print(f"✅ Lab request created for patient ID {registration} and {len(test)} tests created... ")
                    else:
                        print(f"Zero Tests Found...")
                        break

                    dept_tests_created = []
                    
                if len(tests) > 0:
                    unique_tests_assigned = len(set([t["testCode"] for t in dept_tests_created]))
                    
                    results.append(
                        {
                            "dailyCount": daily_count,
                            "testsCreated": len(tests),
                            "status": "success",
                            "labRequestsCreated": req_count,
                            "patientsProcessed": req_count,
                            "uniqueTestsAssigned": len(tests)
                        }
                    )
                else:
                    results.append(
                        {
                            "dailyCount": daily_count,
                            "testsCreated": 0,
                            "status": "no_tests_created",
                            "reason": "No available patients with test slots or all tests already assigned"
                        }
                    )

                all_tests_created.extend(dept_tests_created)

                total_tests_created = sum(r.get("testsCreated", 0) for r in results)
                total_lab_requests_created = len(appointments_list)
                total_patients_processed = len(today_appointments)
                
                unique_tests_across_patients = len(appointments_list)
                
                print(f"\n=== FINAL SUMMARY ===")
                print(f"Total patients selected: {total_patients}")
                print(f"Total patients processed: {total_patients_processed}")
                print(f"Total tests created: {total_tests_created}")
                print(f"Total lab requests created: {total_lab_requests_created}")
                print(f"Unique tests assigned across all patients: {unique_tests_across_patients}")
                
                print(f"\n=== DATABASE VERIFICATION ===")
                lab_requests_today = MCI_Lab_Request_Details.objects.filter(created_at__date=today).count()
                test_items_today = MCI_Lab_Request_Items_Details.objects.filter(created_at__date=today).count()
                print(f"Total lab requests in DB today: {lab_requests_today}")
                print(f"Total test items in DB today: {test_items_today}")

                response_data = {
                    "success": True,
                    "message": f"Test requests created for {speciality.Speciality_Name} patients",
                    "summary": {
                        "date": today.strftime("%Y-%m-%d"),
                        "speciality": speciality.Speciality_Name,
                        "totalPatientsSelected": total_patients,
                        "totalPatientsProcessed": total_patients_processed,
                        "totalTestsCreated": total_tests_created,
                        "totalLabRequestsCreated": total_lab_requests_created,
                        "departmentsProcessed": len([r for r in results if r.get("testsCreated", 0) > 0]),
                        "uniqueTestsAssigned": unique_tests_across_patients
                    },
                    "departmentResults": results,
                    "debug": {
                        "labRequestsInDB": lab_requests_today,
                        "testItemsInDB": test_items_today
                    }
                }

                return JsonResponse(response_data, status=200)
                
                
            else:
                # Handle invalid registerType
                return JsonResponse(
                    {
                        "success": False,
                        "error": f"Invalid registerType: {registerType}. Must be 'OP' or 'IP'"
                    },
                    status=400,
                )

        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "error": "Invalid JSON data"}, status=400
            )
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error in MCI_Create_Test_Requests_By_Count: {str(e)}")
            print(error_details)

            return JsonResponse(
                {
                    "success": False,
                    "error": f"Server error: {str(e)}",
                    "details": str(e),
                },
                status=500,
            )




@csrf_exempt
@require_http_methods(["POST"])
def MCI_Decrease_Test_Requests(request):
   
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract data
            speciality_id = data.get("speciality")
            counts_config = data.get("counts", [])
            created_by = data.get("createdBy")
            register_type = data.get("registerType", "OP")
            
            

            if not all([speciality_id, created_by]):
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Missing required fields: speciality, createdBy"
                    },
                    status=400,
                )

            # Validate speciality exists
            try:
                speciality = Speciality_Detials.objects.get(Speciality_Id=speciality_id)
                print(f"Speciality found: {speciality.Speciality_Name}")
            except Speciality_Detials.DoesNotExist:
                return JsonResponse(
                    {"success": False, "error": f"Speciality with ID {speciality_id} not found"},
                    status=404,
                )

            # Get today's date
            today = datetime.now().date()

            # Step 1: Get all patients of this speciality for today
            if register_type == "OP":
                today_appointments = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Specialization=speciality,
                    created_at__date=today,
                    Registration_Id__IsOriginal=False,
                ).select_related(
                    "Registration_Id", "Registration_Id__PatientId", "PrimaryDoctor"
                ).order_by("created_at")
                
                # Get all OP registration IDs for this speciality today
                op_registration_ids = today_appointments.values_list('Registration_Id__pk', flat=True).distinct()
                patient_field = "OP_Register_Id"
            else:
                # For IP patients - adjust this based on your IP model
                today_appointments = []  # You'll need to implement IP logic
                op_registration_ids = []
                patient_field = "IP_Register_Id"
                print("IP register type not fully implemented yet")

           

            if not today_appointments.exists():
                return JsonResponse(
                    {
                        "success": True,
                        "message": f"No {speciality.Speciality_Name} {register_type} patients found for today",
                        "tests_deleted": 0,
                        "patients_affected": 0,
                    },
                    status=200,
                )

            # Step 2: Process each department count configuration
            results = []
            total_tests_deleted = 0
            affected_patients = set()

            for count_config in counts_config:
                dept_code = count_config.get("departmentCode")
                dept_name = count_config.get("departmentName")
                decrease_count = count_config.get("dailyCount", 0)


                if decrease_count <= 0:
                    results.append(
                        {
                            "department": dept_name,
                            "departmentCode": dept_code,
                            "decreaseCount": decrease_count,
                            "testsDeleted": 0,
                            "status": "skipped",
                            "reason": "Decrease count is 0",
                        }
                    )
                    continue

                try:
                    sub_department = SubLab_Department_Detials.objects.get(
                        SubDepartment_Code=dept_code,
                        SubDepartment_Name=dept_name,
                        Status="Active",
                    )
                    print(f"Department found and active: {dept_name}")
                except SubLab_Department_Detials.DoesNotExist:
                    results.append(
                        {
                            "department": dept_name,
                            "departmentCode": dept_code,
                            "status": "error",
                            "reason": "Department not found or not active",
                        }
                    )
                    print(f"Department not found: {dept_name}")
                    continue

               
                if register_type == "OP":
                    tests_to_delete = MCI_Lab_Request_Items_Details.objects.filter(
                        SubDepartment_Code=sub_department,
                        created_at__date=today,
                        Request__OP_Register_Id__in=op_registration_ids
                    ).select_related(
                        'Request', 'Request__OP_Register_Id'
                    )
                else:
                    # For IP - implement similar logic
                    tests_to_delete = MCI_Lab_Request_Items_Details.objects.filter(
                        SubDepartment_Code=sub_department,
                        created_at__date=today,
                    )
                    # Add IP filtering when implemented
                    pass

                # Order tests for deletion (oldest first)
                tests_to_delete = tests_to_delete.order_by("created_at")
                
                total_existing_tests = tests_to_delete.count()
                print(f"Found {total_existing_tests} existing tests to potentially delete")

                # Calculate how many to actually delete
                tests_to_delete_count = min(decrease_count, total_existing_tests)
                
                if tests_to_delete_count == 0:
                    results.append(
                        {
                            "department": dept_name,
                            "departmentCode": dept_code,
                            "decreaseCount": decrease_count,
                            "existingTests": total_existing_tests,
                            "testsDeleted": 0,
                            "status": "no_tests_found",
                            "reason": f"No tests found to delete (existing: {total_existing_tests})",
                        }
                    )
                    continue

                # Get the tests to delete
                tests_to_delete_list = list(tests_to_delete[:tests_to_delete_count])
                
                # Collect affected patients before deletion
                for item in tests_to_delete_list:
                    if register_type == "OP" and item.Request and item.Request.OP_Register_Id:
                        affected_patients.add(item.Request.OP_Register_Id.Registration_Id)
                
                # Delete the tests
                deleted_count = 0
                deleted_details = []
                request_ids_to_check = set()
                
                for test_item in tests_to_delete_list:
                    try:
                        # Store deletion details
                        deleted_details.append({
                            "itemId": test_item.Item_Id,
                            "testCode": test_item.Test_Code.Test_Code if test_item.Test_Code else None,
                            "testName": test_item.Test_Code.Test_Name if test_item.Test_Code else None,
                            "patientId": test_item.Request.OP_Register_Id.PatientId.PatientId if register_type == "OP" and test_item.Request and test_item.Request.OP_Register_Id else None,
                            "deletedAt": datetime.now().isoformat()
                        })
                        
                        # Add request ID to check later if empty
                        if test_item.Request:
                            request_ids_to_check.add(test_item.Request.Request_Id)
                        
                        # Delete the test item
                        test_item.delete()
                        deleted_count += 1
                        
                    except Exception as e:
                        print(f"Error deleting test item {test_item.Item_Id}: {e}")
                        continue

                # Check if lab requests are now empty and delete them too
                if request_ids_to_check:
                    empty_lab_requests = MCI_Lab_Request_Details.objects.filter(
                        Request_Id__in=request_ids_to_check
                    ).annotate(
                        item_count=Count('mci_lab_request_items')
                    ).filter(item_count=0)
                    
                    empty_requests_deleted = empty_lab_requests.count()
                    empty_lab_requests.delete()
                    print(f"Deleted {empty_requests_deleted} empty lab requests")
                else:
                    empty_requests_deleted = 0

                print(f"Deleted {deleted_count} tests")

                # Record results for this department
                results.append(
                    {
                        "department": dept_name,
                        "departmentCode": dept_code,
                        "decreaseCount": decrease_count,
                        "existingTests": total_existing_tests,
                        "testsDeleted": deleted_count,
                        "emptyRequestsDeleted": empty_requests_deleted,
                        "status": "success",
                        "deletedItems": deleted_details[:10]  # Limit details to first 10
                    }
                )
                
                total_tests_deleted += deleted_count

            # Prepare response
            response_data = {
                "success": True,
                "message": f"Successfully decreased test counts for {speciality.Speciality_Name} {register_type} patients",
                "summary": {
                    "date": today.strftime("%Y-%m-%d"),
                    "speciality": speciality.Speciality_Name,
                    "registerType": register_type,
                    "totalTestsDeleted": total_tests_deleted,
                    "affectedPatients": len(affected_patients),
                    "departmentsProcessed": len([r for r in results if r.get("testsDeleted", 0) > 0])
                },
                "departmentResults": results,
                "debug": {
                    "requestData": {
                        "speciality": speciality_id,
                        "registerType": register_type,
                        "totalDecreaseRequested": sum(c.get("dailyCount", 0) for c in counts_config)
                    }
                }
            }

            print(f"\n=== DECREASE SUMMARY ===")
            print(f"Total tests deleted: {total_tests_deleted}")
            print(f"Affected patients: {len(affected_patients)}")

            return JsonResponse(response_data, status=200)

        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "error": "Invalid JSON data"}, status=400
            )
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error in MCI_Decrease_Test_Requests: {str(e)}")
            print(error_details)

            return JsonResponse(
                {
                    "success": False,
                    "error": f"Server error: {str(e)}",
                    "details": str(e),
                },
                status=500,
            )          
            
            
      
 

