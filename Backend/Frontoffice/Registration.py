import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views.decorators.http import require_GET
from .models import *
from django.db.models import  Q
from django.db import transaction
from PIL import Image
from io import BytesIO
import base64
# import magic
from PyPDF2 import PdfReader, PdfWriter
from Masters.models import *
from Workbench.models import Op_to_Ip_Convertion_Table
from .task import schedule_status_update
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
from .task import schedule_status_update
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
import os
from django.conf import settings
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

import pytz
from django.utils.timezone import make_naive

from dateutil import parser

today = date.today()
validity_days = 9


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_Registration(request):
       
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
                    patient = Patient_Detials.objects.get(PatientId=patient_id)
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    print('Checking for existing patient...')

                    matching_patients = Patient_Detials.objects.filter(
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

                    
                        
                
                    patient = Patient_Detials.objects.get(PatientId=patient_id)
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

                    LabPatient = Register_patient_Details.objects.filter(Patient_Id=patient_id).first()
                    print(LabPatient,'LabPatient')
                    if LabPatient:

                        LabPatient.Title = Title_instance.Title_Name
                        LabPatient.Patient_Name = patient.FirstName
                        LabPatient.Age = patient.Age
                        LabPatient.Gender = patient.Gender
                        LabPatient.save()



                else:
                    
                    print('Checking for existing patient...')

                    matching_patients = Patient_Detials.objects.filter(
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

                        
    
                        
                    patient = Patient_Detials.objects.create(
                        Patient_profile = Patient_profile_photo_prossed,
                        ExistingPtNo=ExistingPtNo,
                        DateOfReg=DateOfReg,
                        LastVisitDate=LastVisitDate,
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
                        OldDepartment = OldDepartment,
                        YearNo = Year
                    )

                    if Appointment_Id:
                        AppointmentRequest = Appointment_Request_List.objects.get(appointment_id = Appointment_Id)
                        AppointmentRequest.status = "REGISTERED"
                        AppointmentRequest.save()
                    
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
                patient = Patient_Detials.objects.get(PatientId=patient_id)
                return JsonResponse({
                    'id': patient.PatientId,
                    'phoneNo': patient.PhoneNo,
                    'firstName': patient.FirstName,
                    'lastName': patient.SurName,
                })
            else:
                patients = list(Patient_Detials.objects.values())
                return JsonResponse(patients, safe=False)
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient with the given ID does not exist'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt  
@require_http_methods(["POST"])
def patient_smartcard_details_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data, 'data-------')
            patient_id = data.get('PatientId', '')
            existing_pt_no = data.get('ExistingPtNo', '')
            title_id = data.get('Title', '')
            first_name = data.get('FirstName', '')
            middle_name = data.get('MiddleName', '')
            sur_name = data.get('SurName', '')
            gender = data.get('Gender', '')
            spouse_name = data.get('SpouseName', '')
            father_name = data.get('FatherName', '')
            dob = data.get('DOB', '')
            age = data.get('Age', '')
            pincode = data.get('Pincode', '')
            door_no = data.get('DoorNo', '')
            street = data.get('Street', '')
            area = data.get('Area', '')
            city = data.get('City', '')
            district = data.get('District', '')
            state = data.get('State', '')
            country = data.get('Country', '')
            created_by = data.get('created_by', '')

            # Resolve foreign keys
            patient_instance = Patient_Detials.objects.filter(PatientId=patient_id).first()
            title_instance = Title_Detials.objects.filter(Title_Id=title_id).first()

            if not patient_instance:
                return JsonResponse({'error': 'Invalid PatientId'}, status=400)

            # Check for existing card and its validity
            existing_card = Patient_Smartcard_Details.objects.filter(PatientId=patient_instance).first()

            if existing_card:
                # Calculate the validity until 2 years from the card creation date
                validity_period = timedelta(days=730)  # 2 years
                valid_until = existing_card.created_at + validity_period

                # If the existing card is still valid, return the validity date
                if now() < valid_until:
                    return JsonResponse({
                        'warn': 'This patient already has a valid smartcard.',
                        'valid_until': valid_until.strftime('%Y-%m-%d %H:%M:%S')  # Showing validity date
                    })

            # Proceed to create the new smartcard details
            Smartcard_ins = Patient_Smartcard_Details(
                PatientId=patient_instance,
                ExistingPtNo=existing_pt_no,
                Title=title_instance,
                FirstName=first_name,
                MiddleName=middle_name,
                SurName=sur_name,
                Gender=gender,
                SpouseName=spouse_name,
                FatherName=father_name,
                DOB=dob,
                Age=age,
                DoorNo=door_no,
                Street=street,
                Area=area,
                City=city,
                District=district,
                State=state,
                Country=country,
                Pincode=pincode,
                created_by=created_by
            )
            Smartcard_ins.save()
            print(Smartcard_ins, 'Smartcard_instance')

            # Calculate and show the validity date for the new card (Automatically includes leap years)
            validity_date = Smartcard_ins.created_at + timedelta(days=730)  # 2 years validity

            return JsonResponse({
                'success': 'Smartcard added successfully',
                'data': model_to_dict(Smartcard_ins),
                'valid_until': validity_date.strftime('%Y-%m-%d %H:%M:%S')  # Showing validity date
            })

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





@csrf_exempt   
@require_http_methods(["OPTIONS","GET"])
def Get_Patient_SmartCard_Details_link(request):
    if request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId')

            Smartcard = Patient_Smartcard_Details.objects.filter(PatientId=PatientId).first()

            if Smartcard is None:
                return JsonResponse({'error': 'No smartcard data found'}, status=404)

            Smartcard_dict = {
                'CurrDate': Smartcard.created_at.strftime('%d-%m-%y'),
                'CardValidityYear': Smartcard.created_at.strftime('%Y'),
                'FromValidityDate': Smartcard.created_at.strftime('%d-%m-%Y'),
                'CurrTime': Smartcard.created_at.strftime('%H:%M:%S'),
                # 'ToValidityDate' : Smartcard.created_at + timedelta(days=730)
                'ToValidityDate': (Smartcard.created_at + timedelta(days=730)).strftime('%d-%m-%Y'),

            }

            print(Smartcard_dict,'Smartcard_dict')

            return JsonResponse(Smartcard_dict, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





def load_json_file(filename):
    path = os.path.join(settings.BASE_DIR, 'your_app', 'data', filename)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

API_BASE = "https://countriesnow.space/api/v0.1"


@csrf_exempt
@require_GET
def get_states_by_country(request):
    country = request.GET.get("country", "India")
    resp = requests.post(f"{API_BASE}/countries/states", json={"country": country})
    data = resp.json()

    if not data.get("data"):
        return JsonResponse({"error": data.get("msg", "No data")}, status=404)

    states = [s["name"] for s in data["data"]["states"]]
    return JsonResponse({"states": sorted(states)})


@csrf_exempt
@require_GET
def get_cities_by_state(request):
    country = request.GET.get("country", "India")
    state = request.GET.get("state")
    if not state:
        return JsonResponse({"error": "State is required"}, status=400)

    resp = requests.post(
        f"{API_BASE}/countries/state/cities",
        json={"country": country, "state": state}
    )
    data = resp.json()

    if not data.get("data"):
        return JsonResponse({"error": data.get("msg", "No data")}, status=404)

    return JsonResponse({"cities": sorted(data["data"])})





@csrf_exempt
@require_GET
def get_districts_by_state(request):
    import requests

    state_name = request.GET.get("state")
    if not state_name:
        return JsonResponse({"error": "State is required"}, status=400)

    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        states_resp = requests.get(
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json",
            headers=headers
        )
        states = states_resp.json()

        # Filter by country_id=101 (India)
        state_data = next((s for s in states if s['name'].lower() == state_name.lower() and s['country_id'] == 101), None)
        if not state_data:
            return JsonResponse({"error": "State not found"}, status=404)

        state_id = state_data['id']

        cities_resp = requests.get(
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json",
            headers=headers
        )
        all_cities = cities_resp.json()

        districts = list(set([c['name'] for c in all_cities if c['state_id'] == state_id]))

        return JsonResponse({"districts": sorted(districts)})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_GET
def get_cities_by_district(request):
    import requests

    district_name = request.GET.get("district")
    if not district_name:
        return JsonResponse({"error": "District is required"}, status=400)

    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        cities_resp = requests.get(
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json",
            headers=headers
        )
        all_cities = cities_resp.json()

        cities = [c['name'] for c in all_cities if c['name'].lower() == district_name.lower()]
        return JsonResponse({"cities": sorted(set(cities)) or ["No cities found"]})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)






@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Radiology_Patient_Registration(request):
       
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
            referdocid = data.get('referdocid', '')

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
            Status = data.get('Status', '')
            

            doctor_name = data.get('DoctorID', '')
            specialization = data.get('SpecializationId', '')
            
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
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=referdocid) if referdocid else None

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


            with transaction.atomic():
                patient=None
                if patient_id :
                    patient = Patient_Detials.objects.get(PatientId=patient_id)
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                    
                    if Patient_Detials.objects.filter(PhoneNo=phone_no, FirstName=first_name).exclude(PatientId=patient_id).exists():
                        patient = Patient_Detials.objects.get(PhoneNo=phone_no, FirstName=first_name)

                        return JsonResponse({'warn': f"The Patient {patient.PatientId} is already registered with {phone_no} and {first_name}"})
                    
                    
                   
                    patient = Patient_Detials.objects.get(PatientId=patient_id)
                    patient.Patient_profile = Patient_profile_photo_prossed
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
                    # patient.PatientCategory = patient_category
                    # patient.InsuranceName = Insurance_instance
                    # patient.InsuranceType = insurance_type
                    # patient.ClientName = Client_instance
                    # patient.ClientType = client_type
                    # patient.ClientEmployeeId = client_employee_id
                    # patient.ClientEmployeeDesignation = client_employee_designation
                    # patient.ClientEmployeeRelation = client_employee_relation
                    # patient.CorporateName = Corporate_instance
                    # patient.CorporateType = CorporateType
                    # patient.CorporateEmployeeId = CorporateEmployeeId
                    # patient.CorporateEmployeeDesignation = CorporateEmployeeDesignation
                    # patient.CorporateEmployeeRelation = CorporateEmployeeRelation
                    # patient.EmployeeId = employee_instance
                    # patient.EmployeeRelation = employee_relation
                    # patient.DoctorId = doctor_instance
                    # patient.DoctorRelation = doctor_relation
                    # patient.DonationType = Donation_instance
                    # patient.Flagging = Flagging_instance
                   
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

                else:
                    if phone_no and first_name:
                        if Patient_Detials.objects.filter(PhoneNo=phone_no, FirstName=first_name).exists():
                            patient = Patient_Detials.objects.get(PhoneNo=phone_no, FirstName=first_name)
                            return JsonResponse({'warn': f"The Patient {patient.PatientId} is already registered with {phone_no} and {first_name}"})
                
                        patient = Patient_Detials.objects.create(
                            Patient_profile = Patient_profile_photo_prossed,
                            Title=Title_instance,
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
                            ReferredBy = referral_doctor_instance,
                            Status = Status,
                           
                        )

                        if Appointment_Id:
                            AppointmentRequest = Appointment_Request_List.objects.get(appointment_id = Appointment_Id)
                            AppointmentRequest.status = "REGISTERED"
                            AppointmentRequest.save()
                    
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
                patient = Patient_Detials.objects.get(PatientId=patient_id)
                return JsonResponse({
                    'id': patient.PatientId,
                    'phoneNo': patient.PhoneNo,
                    'firstName': patient.FirstName,
                    'lastName': patient.SurName,
                })
            else:
                patients = list(Patient_Detials.objects.values())
                return JsonResponse(patients, safe=False)
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient with the given ID does not exist'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)





@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_OP_Registration(request):


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
            patient = Patient_Detials.objects.get(pk=patient_id)
            
            if RegistrationId :
 
                Billpage = ""
                OP_Patient = Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
               
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
                OP_Patient.updated_by = created_by
                OP_Patient.save()
 
 
               
                referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
               
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
                       
                            existing_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Pk_id)
    
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
        
                                if OP_Patient.Bill_Status == 'Paid' or OP_Patient.Bill_Status == 'Due':
        
                                
                                    billins = General_Billing_Table_Detials.objects.filter(Patient_Id__PatientId = patient.PatientId,Register_Id__Registration_Id = OP_Patient.Registration_Id).first()
        
                                    billins.Doctor_Id = [Doctor_instance.Doctor_ID]
                                    billins.save()
        
                                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = billins.Billing_Invoice_No,Service_Type='CONSULTATION',Service_Code=Docid)
                                    qualification = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = Doctor_instance.Doctor_ID).first()
                                    name_parts = filter(None, [Doctor_instance.First_Name, Doctor_instance.Middle_Name, Doctor_instance.Last_Name])
                                    full_name = " ".join(name_parts)
        
                                    # Add prefix and suffix only if they exist
                                    qualification_str = f" ({qualification.Qualification})" if qualification and qualification.Qualification else ""
        
                                    servicename = f"Dr. {full_name}{qualification_str}"
        
                                    DoctorRatecard = Doctor_Ratecard_Master.objects.filter(Doctor_ID__Doctor_ID = Doctor_instance.Doctor_ID).first()
                                    amt = 0
        
                                    if patient.PatientType.upper() == 'GENERAL':
        
        
                                        if existingvisittype == 'FollowUp No Fee' :
                                            amt =  DoctorRatecard.General_Consultation_Fee  if existingvisittype == 'NewConsultation' else 0
        
                                        elif existingvisittype == 'FollowUp With Fee':
                                            amt = DoctorRatecard.General_Consultation_Fee  if existingvisittype == 'NewConsultation' else DoctorRatecard.General_Follow_Up_Fee
        
                                        else :
                                            amt = DoctorRatecard.General_Consultation_Fee
        
                                    else:
        
                                        if existingvisittype == 'FollowUp No Fee' :
                                            amt =  DoctorRatecard.Special_Consultation_Fee  if existingvisittype == 'NewConsultation' else 0
        
                                        elif existingvisittype == 'FollowUp With Fee':
                                            amt = DoctorRatecard.Special_Consultation_Fee  if existingvisittype == 'NewConsultation' else DoctorRatecard.Special_Follow_Up_Fee
        
                                        else :
                                            amt = DoctorRatecard.Special_Consultation_Fee
        
        
                                    if abs(billins.Paid_Amount + billins.Discount_Value) > amt:
        
                                        print('refundddddd')
        
                                        Billpage = 'Refund'
        
                                        Refundedamount = abs(billins.Paid_Amount - amt)
                                        billins.Refunded_Amount = Refundedamount
                                        # billins.Net_Amount = amt
                                        # billins.Net_Paid_Amount = amt
                                        # billins.Paid_Amount = amt
        
                                        billins.save()
        
                                        for item in itemins:
        
                                            item.Item_Status = 'Canceled'
                                            item.save()
        
        
                                        General_Billing_Items_Table_Detialsins = General_Billing_Items_Table_Detials(
        
                                            Billing_Invoice_No = billins,
                                            Service_Type = 'CONSULTATION',
                                            Service_Code = Doctor_instance.Doctor_ID,
                                            Service_Name = servicename,
                                            Rate = amt,
                                            Charge = amt,
                                            Amount = amt,
                                            Taxable_Amount = amt,
                                            Total_Amount = amt,
                                            Item_Status = 'Paid',
                                            Quantity = 1
        
        
                                        )
                                        General_Billing_Items_Table_Detialsins.save()
        
                                    elif  abs(billins.Paid_Amount + billins.Discount_Value) < amt:
        
                                        print('billlllllllll')
                                        Billpage = 'Bill'
        
                                        Balance_Amount = abs(amt - billins.Paid_Amount)
                                        billins.Balance_Amount = Balance_Amount
                                        # billins.Net_Amount = amt
                                        # billins.Net_Paid_Amount = amt
                                        # billins.Paid_Amount = amt
                                        billins.save()
        
                                        for item in itemins:

                                            print(item,'item')
        
                                            item.Item_Status = 'Canceled'
                                            item.save()
        
        
                                        General_Billing_Items_Table_Detialsins = General_Billing_Items_Table_Detials(
        
                                            Billing_Invoice_No = billins,
                                            Service_Type = 'CONSULTATION',
                                            Service_Code = Doctor_instance.Doctor_ID,
                                            Service_Name = servicename,
                                            Rate = amt,
                                            Charge = amt,
                                            Amount = amt,
                                            Taxable_Amount = amt,
                                            Total_Amount = amt,
                                            Item_Status = 'Pending',
                                            Quantity = 1
                                        )
                                        General_Billing_Items_Table_Detialsins.save()
        
                                    else :
        
                                        for item in itemins:
        
                                            item.Service_Code = Doctor_instance.Doctor_ID
                                            item.Service_Name = servicename
                                            item.save()
                            
                            else:
                                # ✅ Update
                                existing_appointment.Specialization = Specialization_instance
                                existing_appointment.PrimaryDoctor = Doctor_instance
                                existing_appointment.VisitType = 'NewConsultation' if existingvisittype == 'NewConsultation' else VisitType
                                existing_appointment.Complaint = Complaint
                                existing_appointment.TokenNo = TokenNo
                                existing_appointment.save()
        
                                if OP_Patient.Bill_Status == 'Paid' or OP_Patient.Bill_Status == 'Due':
        
                                
                                    billins = General_Billing_Table_Detials.objects.filter(Patient_Id__PatientId = patient.PatientId,Register_Id__Registration_Id = OP_Patient.Registration_Id).first()
        
                                    billins.Doctor_Id = [Doctor_instance.Doctor_ID]
                                    billins.save()
        
                                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = billins.Billing_Invoice_No,Service_Type='CONSULTATION',Service_Code=Docid)
                                    qualification = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = Doctor_instance.Doctor_ID).first()
                                    name_parts = filter(None, [Doctor_instance.First_Name, Doctor_instance.Middle_Name, Doctor_instance.Last_Name])
                                    full_name = " ".join(name_parts)
        
                                    # Add prefix and suffix only if they exist
                                    qualification_str = f" ({qualification.Qualification})" if qualification and qualification.Qualification else ""
        
                                    servicename = f"Dr. {full_name}{qualification_str}"
        
                                    DoctorRatecard = Doctor_Ratecard_Master.objects.filter(Doctor_ID__Doctor_ID = Doctor_instance.Doctor_ID).first()
                                    amt = 0
        
                                    if patient.PatientType.upper() == 'GENERAL':
        
        
                                        if VisitType == 'FollowUp No Fee' :
                                            amt =  DoctorRatecard.General_Consultation_Fee  if existingvisittype == 'NewConsultation' else 0
        
                                        elif VisitType == 'FollowUp With Fee':
                                            amt = DoctorRatecard.General_Consultation_Fee  if existingvisittype == 'NewConsultation' else DoctorRatecard.General_Follow_Up_Fee
        
                                        else :
                                            amt = DoctorRatecard.General_Consultation_Fee
        
                                    else:
        
                                        if VisitType == 'FollowUp No Fee' :
                                            amt =  DoctorRatecard.Special_Consultation_Fee  if existingvisittype == 'NewConsultation' else 0
        
                                        elif VisitType == 'FollowUp With Fee':
                                            amt = DoctorRatecard.Special_Consultation_Fee  if existingvisittype == 'NewConsultation' else DoctorRatecard.Special_Follow_Up_Fee
        
                                        else :
                                            amt = DoctorRatecard.Special_Consultation_Fee
        
        
                                    if billins.Paid_Amount > amt:
        
                                        print('refundddddd')
        
                                        Billpage = 'Refund'
        
                                        Refundedamount = abs(billins.Paid_Amount - amt)
                                        billins.Refunded_Amount = Refundedamount
                                        # billins.Net_Amount = amt
                                        # billins.Net_Paid_Amount = amt
                                        # billins.Paid_Amount = amt
        
                                        billins.save()
        
                                        for item in itemins:
        
                                            item.Item_Status = 'Canceled'
                                            item.save()
        
        
                                        General_Billing_Items_Table_Detialsins = General_Billing_Items_Table_Detials(
        
                                            Billing_Invoice_No = billins,
                                            Service_Type = 'CONSULTATION',
                                            Service_Code = Doctor_instance.Doctor_ID,
                                            Service_Name = servicename,
                                            Rate = amt,
                                            Charge = amt,
                                            Amount = amt,
                                            Taxable_Amount = amt,
                                            Total_Amount = amt,
                                            Item_Status = 'Paid',
                                            Quantity = 1
        
        
                                        )
                                        General_Billing_Items_Table_Detialsins.save()
        
                                    elif  billins.Paid_Amount < amt:
        
                                        print('billlllllllll')
                                        Billpage = 'Bill'
        
                                        Balance_Amount = abs(amt - billins.Paid_Amount)
                                        billins.Balance_Amount = Balance_Amount
                                        # billins.Net_Amount = amt
                                        # billins.Net_Paid_Amount = amt
                                        # billins.Paid_Amount = amt
                                        billins.save()
        
                                        for item in itemins:

                                            print(item,'item')
        
                                            item.Item_Status = 'Canceled'
                                            item.save()
        
        
                                        General_Billing_Items_Table_Detialsins = General_Billing_Items_Table_Detials(
        
                                            Billing_Invoice_No = billins,
                                            Service_Type = 'CONSULTATION',
                                            Service_Code = Doctor_instance.Doctor_ID,
                                            Service_Name = servicename,
                                            Rate = amt,
                                            Charge = amt,
                                            Amount = amt,
                                            Taxable_Amount = amt,
                                            Total_Amount = amt,
                                            Item_Status = 'Pending',
                                            Quantity = 1
                                        )
                                        General_Billing_Items_Table_Detialsins.save()
        
                                    else :
        
                                        for item in itemins:
        
                                            item.Service_Code = Doctor_instance.Doctor_ID
                                            item.Service_Name = servicename
                                            item.save()
                            
                            
                                


                    else:    
                        print('ℹ️ No existing appointment — creating new')
                        new_doc_appt = OP_Patient_Appointment_With_Multiple_Doctor(
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
               
                print('-----------222222222222')
                print('vvvvvvvvvv-----------')
                print('Appoint_list-----------',Appoint_list)

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

                print('ddddddd-----------')

                                
                if not patient:
                    return JsonResponse({'warn': f"The Patient Id is not valid"})
                
                print('zzzzzzzzzzz-----------',patient)
                
                patient_visit_id = generate_or_update_visit_id(patient, register_type)
                print('xxxxxxxxxx-----------')



                prevadmission = Patient_IP_Registration_Detials.objects.filter(
                        PatientId = patient,
                        Status__in = ['Pending','Admitted']
           
                            ).order_by('-created_at').first()
 
                if  prevadmission:
       
                        datalist = [{
                        'Doctor' : prevadmission.PrimaryDoctor.Doctor_ID if prevadmission.PrimaryDoctor else None,
                        'DoctorName' : f"""{prevadmission.PrimaryDoctor.Tittle.Title_Name}.{prevadmission.PrimaryDoctor.First_Name}""",
                        'Specialization' : prevadmission.Specialization.Speciality_Name if prevadmission.Specialization else None
                        }]
           
                        return JsonResponse({
                            'warn': f"The Patient Already Admitted in {prevadmission.Specialization.Speciality_Name}"
                        })
 


            
                    
                Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
            
                # VisitType = VisitType,
                # Specialization = specialization_instance,
                # PrimaryDoctor = doctor_name_instance,
                # TokenNo = TokenNo,
                # Complaint = Complaint,

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

                    # lastvisit = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Specialization__Speciality_Id= Speciality,)

                    if VisitType == 'NewConsultation':

                        
                        renew_date = today + timedelta(days=validity_days + 1)

                        print("Today:", today.strftime("%d-%m-%Y"))
                        print("Renew Date:", renew_date.strftime("%d-%m-%Y"))
                    
                        Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                            Registration_Id = Patient_OP,
                            PrimaryDoctor = Doctor_name_instance,
                            Specialization = Specialization_instance,
                            VisitType = VisitType,
                            Complaint = Complaint,
                            TokenNo = TokenNo,
                            # RenewDate = renew_date.strftime("%d-%m-%Y")
                            RenewDate = renew_date.strftime("%Y-%m-%d")
                        )
                        Multile_Doctor.save()

                    else:


                        lastvisitins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__PatientId__PatientId=patient_id,Specialization__Speciality_Id = Speciality,VisitType__in=['NewConsultation','FollowUp With Fee']).order_by('-created_at').first()

                        print(lastvisitins,'lastvisitins')

                        if lastvisitins:

                            if lastvisitins.RenewDate:

                                validity_date = lastvisitins.RenewDate - timedelta(days=1)
                                days_since  = (today - validity_date).days

                                print(validity_date, 'validity_date')
                                print(lastvisitins.RenewDate, 'renew_date')
                                print(days_since,'days_since')

                                if days_since <= 0:
                        
                                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                        Registration_Id = Patient_OP,
                                        PrimaryDoctor = Doctor_name_instance,
                                        Specialization = Specialization_instance,
                                        VisitType = VisitType,
                                        Complaint = Complaint,
                                        TokenNo = TokenNo,
                                        RenewDate = lastvisitins.RenewDate
                                    )
                                    Multile_Doctor.save()

                                else:

                                    renew_date = today + timedelta(days=validity_days + 1)

                                    print("Today:", today.strftime("%d-%m-%Y"))
                                    print("Renew Date:", renew_date.strftime("%d-%m-%Y"))

                                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                        Registration_Id = Patient_OP,
                                        PrimaryDoctor = Doctor_name_instance,
                                        Specialization = Specialization_instance,
                                        VisitType = VisitType,
                                        Complaint = Complaint,
                                        TokenNo = TokenNo,
                                        RenewDate = renew_date.strftime("%Y-%m-%d")
                                    )
                                    Multile_Doctor.save()

                            else:

                                
                                
                                RenewDate = lastvisitins.created_at + timedelta(days=10)
                                validity_date = RenewDate - timedelta(days=1)
                                days_since  = (today - validity_date).days

                                print(validity_date, 'validity_date')
                                print(lastvisitins.RenewDate, 'renew_date')
                                print(days_since,'days_since')

                                if days_since <= 0:
                        
                                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                        Registration_Id = Patient_OP,
                                        PrimaryDoctor = Doctor_name_instance,
                                        Specialization = Specialization_instance,
                                        VisitType = VisitType,
                                        Complaint = Complaint,
                                        TokenNo = TokenNo,
                                        RenewDate = lastvisitins.RenewDate
                                    )
                                    Multile_Doctor.save()

                                else:

                                    renew_date = today + timedelta(days=validity_days + 1)

                                    print("Today:", today.strftime("%d-%m-%Y"))
                                    print("Renew Date:", renew_date.strftime("%d-%m-%Y"))

                                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                        Registration_Id = Patient_OP,
                                        PrimaryDoctor = Doctor_name_instance,
                                        Specialization = Specialization_instance,
                                        VisitType = VisitType,
                                        Complaint = Complaint,
                                        TokenNo = TokenNo,
                                        RenewDate = renew_date.strftime("%Y-%m-%d")
                                    )
                                    Multile_Doctor.save()

                        else:

                            Existinglastvisitdate = patient.LastVisitDate if patient.LastVisitDate else None
                            OldDepartment = patient.OldDepartment if patient.OldDepartment else None
                            print(Existinglastvisitdate,'Existinglastvisitdate')

                            if Existinglastvisitdate:

                                validity_date = datetime.strptime(Existinglastvisitdate, "%Y-%m-%d").date()
                                print(validity_date,'validity_date',type(validity_date))

                                renew_date = validity_date + timedelta(days=validity_days + 1)
                                print(renew_date,'renew_date',type(renew_date))

                                validity_date = renew_date - timedelta(days=1)


                                days_since  = (today - validity_date).days
                                print(days_since,'days_since',type(days_since))

                                if Specialization_instance.Speciality_Name == OldDepartment:

                                    if days_since <= 0:

                                        Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                            Registration_Id = Patient_OP,
                                            PrimaryDoctor = Doctor_name_instance,
                                            Specialization = Specialization_instance,
                                            VisitType = VisitType,
                                            Complaint = Complaint,
                                            TokenNo = TokenNo,
                                            RenewDate = renew_date
                                            )
                                        Multile_Doctor.save()

                                    else :

                                        renew_date = today + timedelta(days=validity_days + 1)

                                        print("Today:", today.strftime("%d-%m-%Y"))
                                        print("Renew Date:", renew_date.strftime("%d-%m-%Y"))
                                    
                                        Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                                Registration_Id = Patient_OP,
                                                PrimaryDoctor = Doctor_name_instance,
                                                Specialization = Specialization_instance,
                                                VisitType = VisitType,
                                                Complaint = Complaint,
                                                TokenNo = TokenNo,
                                                RenewDate = renew_date.strftime("%Y-%m-%d")
                                            )
                                        Multile_Doctor.save()

                                else:

                                    renew_date = today + timedelta(days=validity_days + 1)

                                    print("Today:", today.strftime("%d-%m-%Y"))
                                    print("Renew Date:", renew_date.strftime("%d-%m-%Y"))
                                
                                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                            Registration_Id = Patient_OP,
                                            PrimaryDoctor = Doctor_name_instance,
                                            Specialization = Specialization_instance,
                                            VisitType = VisitType,
                                            Complaint = Complaint,
                                            TokenNo = TokenNo,
                                            RenewDate = renew_date.strftime("%Y-%m-%d")
                                        )
                                    Multile_Doctor.save()


                                OP_RefDoc_Patient_qs = OPD_Referal_Details.objects.filter(
                                    Patient_Id=patient_id,
                                    Registration_Id__Registration_Id=RefDocRegistrationId,
                                    ReferDoctorId__Doctor_ID=RefDoctorId
                                )

                                for OP_RefDoc_Patient_ins in OP_RefDoc_Patient_qs:
                                    OP_RefDoc_Patient_ins.RefPatientStatus = 'Registered'
                                    OP_RefDoc_Patient_ins.save()
                                    print(OP_RefDoc_Patient_ins, 'OP_RefDoc_Patient_ins')
                                
                                print('pd')
                                referral = Patient_Referral_Detials.objects.create(
                                OP_Register_Id = Patient_OP,
                                ReferralRegisteredBy = register_type,
                                ReferralSource = ReferralSource,
                                ReferredBy = referral_doctor_instance,
                                )
                                referral.save()
                                

                                print('cccccccccc-----------',referral)

                                print('ffffffffff-----------')
                                
                                # return JsonResponse({'success': 'Patient Appointment registered successfully'})
                                return JsonResponse({'success': 'Patient Appointment registered successfully','RegistrationId':Patient_OP.Registration_Id})

                            renew_date = today + timedelta(days=validity_days + 1)

                            print("Today:", today.strftime("%d-%m-%Y"))
                            print("Renew Date:", renew_date.strftime("%d-%m-%Y"))
                        
                            Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                                Registration_Id = Patient_OP,
                                PrimaryDoctor = Doctor_name_instance,
                                Specialization = Specialization_instance,
                                VisitType = VisitType,
                                Complaint = Complaint,
                                TokenNo = TokenNo,
                                RenewDate = renew_date.strftime("%Y-%m-%d")
                            )
                            Multile_Doctor.save()




                OP_RefDoc_Patient_qs = OPD_Referal_Details.objects.filter(
                    Patient_Id=patient_id,
                    Registration_Id__Registration_Id=RefDocRegistrationId,
                    ReferDoctorId__Doctor_ID=RefDoctorId
                )

                for OP_RefDoc_Patient_ins in OP_RefDoc_Patient_qs:
                    OP_RefDoc_Patient_ins.RefPatientStatus = 'Registered'
                    OP_RefDoc_Patient_ins.save()
                    print(OP_RefDoc_Patient_ins, 'OP_RefDoc_Patient_ins')
                
                print('pd')
                referral = Patient_Referral_Detials.objects.create(
                OP_Register_Id = Patient_OP,
                ReferralRegisteredBy = register_type,
                ReferralSource = ReferralSource,
                ReferredBy = referral_doctor_instance,
                )
                referral.save()
                

                print('cccccccccc-----------',referral)

                print('ffffffffff-----------')
                
                # return JsonResponse({'success': 'Patient Appointment registered successfully'})
                return JsonResponse({'success': 'Patient Appointment registered successfully','RegistrationId':Patient_OP.Registration_Id})
                
        
        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method'},status=405)





@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_Patient_Admission_Purpose_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
 
            print(data,'data----Admission')
            RegistrationId = data.get("RegistrationId")
            AdmissionPurpose = data.get("AdmissionPurpose")
            Remarks = data.get("Remarks")
            CreatedBy = data.get("CreatedBy")
 
            registration_ins = Patient_IP_Registration_Detials.objects.get(Registration_Id=RegistrationId) if RegistrationId else None
 
            print('111111')
           
            Patient_Admission_Purpose_Details.objects.filter(
                IP_Registration_Id=registration_ins
            ).update(updated_at=timezone.now())
 
            print('222222')
 
            Admission_Details = Patient_Admission_Purpose_Details(
                IP_Registration_Id = registration_ins,
                AdmissionPurpose = AdmissionPurpose,
                Remarks = Remarks,
                created_by = CreatedBy,
            )
            Admission_Details.save()
 
            print('Admission_Details--------',Admission_Details)
 
            return JsonResponse({'success': 'Admission Purpose Saved Successfully'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient IP registration details not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId')
 
            Admission_details = Patient_Admission_Purpose_Details.objects.filter(IP_Registration_Id__Registration_Id=RegistrationId)
 
            Admission_data = []
            for idx, Admission in enumerate(Admission_details, start=1):
                Admission_dict = {
                    'id':idx,
                    'RegistrationId': Admission.IP_Registration_Id.Registration_Id if Admission.IP_Registration_Id  else None,
                    'AdmissionPurpose':Admission.AdmissionPurpose,
                    'Remarks':Admission.Remarks,
                    'created_by': Admission.created_by,
                    'created_at': Admission.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'FromDate': Admission.created_at.strftime('%d-%m-%y'),
                    'FromTime': Admission.created_at.strftime('%I:%M %p'),
                    'ToDate': Admission.updated_at.strftime('%d-%m-%y'),
                    'ToTime': Admission.updated_at.strftime('%I:%M %p'),
                }
                Admission_data.append(Admission_dict)
            return JsonResponse(Admission_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 




# @csrf_exempt
# @require_http_methods(['DELETE'])
# def Delete_Doctor_In_OP_Register(request, RegistrationId, Doc_id):
#     try:
#         print(RegistrationId,'RegistrationId')
#         print(Doc_id,'Doc_id')
#         print(f"Received DELETE for RegistrationId={RegistrationId}, Doc_id={Doc_id}")
#         OP_Patient = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#             Registration_Id=RegistrationId, PrimaryDoctor=Doc_id
#         )
#         print(OP_Patient, 'OP_Patient------------1')
#         print(f"Queryset count: {OP_Patient.count()}")
#         if not OP_Patient.exists():
#             return JsonResponse({"error": "Doctor not found"}, status=404)

#         OP_Patient.delete()
#         return JsonResponse({'message': 'Doctor deleted successfully'})
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(['POST'])
def Delete_Doctor_In_OP_Register(request):
    try:

        data = json.loads(request.body)
        print(data,'data')
        RegistrationId = data.get("RegistrationId")
        Doc_id = data.get("Doc_id")
 
        if not RegistrationId or not Doc_id:
            return JsonResponse({'error': 'Missing RegistrationId or Doc_id'})
 
        print(f"Received DELETE for RegistrationId={RegistrationId}, Doc_id={Doc_id}")
 
        OP_Patient = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id=RegistrationId,
            PrimaryDoctor=Doc_id
        )
 
        print(f"Queryset: {OP_Patient}")
        if not OP_Patient.exists():
            return JsonResponse({"error": "Doctor not found"})
 
        OP_Patient.delete()
        return JsonResponse({'message': 'Doctor deleted successfully'})
 
    except Exception as e:
        return JsonResponse({'error': str(e)})


#--------------------jeeva-----> dont change the code -------------------

@csrf_exempt
@require_http_methods(["GET"])
def get_OP_patient_details(request):
    try:
       
        RegistrationId = request.GET.get('RegistrationId')
        
        print(RegistrationId,'RegistrationId')
        # Start with all records
        queryset = Patient_Appointment_Registration_Detials.objects.get(pk = RegistrationId)
        
        referral_details = None

        # Check for referral details by OP, IP, and Emergency Register IDs
        try:
            referral_details = Patient_Referral_Detials.objects.filter(
                OP_Register_Id__Registration_Id=RegistrationId
            ).first() or Patient_Referral_Detials.objects.filter(
                IP_Register_Id__Registration_Id=RegistrationId
            ).first() or Patient_Referral_Detials.objects.filter(
                Emergency_Register_Id__Registration_Id=RegistrationId
            ).first()

            print(referral_details,'referral_details---------')
        except Patient_Referral_Detials.DoesNotExist:
            referral_details = None
        print(queryset,'queryset')
        print(queryset.DoctorId,'querysetDoctorId-------')
        # Serialize the filtered queryset
        
           
            # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
        appointment_dict = {
            
            'PatientProfile': get_file_image(queryset.PatientId.Patient_profile) if queryset.PatientId.Patient_profile else None,
            'PatientId': queryset.PatientId.PatientId,
            'PatientName': f"{queryset.PatientId.Title.Title_Name}.{queryset.PatientId.FirstName} {queryset.PatientId.MiddleName} {queryset.PatientId.SurName}",
            'Title': queryset.PatientId.Title.pk,
            'FirstName': queryset.PatientId.FirstName,
            'MiddleName': queryset.PatientId.MiddleName,
            'SurName': queryset.PatientId.SurName,
            'PhoneNo': queryset.PatientId.PhoneNo,
            'Age': queryset.PatientId.Age,
            'Gender': queryset.PatientId.Gender,
            'MaritalStatus': queryset.PatientId.MaritalStatus,
            'SpouseName': queryset.PatientId.SpouseName,
            'FatherName': queryset.PatientId.FatherName,
            'DOB': queryset.PatientId.DOB,
            'Email': queryset.PatientId.Email,
            'BloodGroup': queryset.PatientId.BloodGroup.BloodGroup_Id if queryset.PatientId.BloodGroup else None,
            'Occupation': queryset.PatientId.Occupation,
            'Religion': queryset.PatientId.Religion.Religion_Id if queryset.PatientId.Religion else None,
            'Nationality': queryset.PatientId.Nationality,
            'UHIDType': queryset.PatientId.UniqueIdType,
            'UHIDNo': queryset.PatientId.UniqueIdNo,
            'DoorNo': queryset.PatientId.DoorNo,
            'Street': queryset.PatientId.Street,
            'Area': queryset.PatientId.Area,
            'City': queryset.PatientId.City,
            'District': queryset.PatientId.District,
            'State': queryset.PatientId.State,
            'Country': queryset.PatientId.Country,
            'Pincode': queryset.PatientId.Pincode,
            'PatientType': queryset.PatientId.PatientType,
            'ABHA': queryset.PatientId.ABHA,
            'AppointmentId': queryset.AppointmentId,
            'VisitId': queryset.VisitId,
            'CardValidity': queryset.CardValidity,
            # 'Complaint': queryset.Complaint,
            'IsMLC': queryset.IsMLC,
            # 'VisitType': queryset.VisitType,
            # 'Complaint': queryset.Complaint,
            'NextToKinName': queryset.NextToKinName,
            # 'Flagging': Flagging_name,
            # 'FlaggingColour': Flagging_color,
            'IsReferral': queryset.IsReferral,
            'Relation': queryset.Relation,
            'RelativePhNo': queryset.RelativePhNo,
            'PatientCategory': queryset.PatientCategory,
            'InsuranceName': queryset.InsuranceName.pk if queryset.InsuranceName else None,
            'InsuranceType': queryset.InsuranceType,
            'ClientName': queryset.ClientName.pk if queryset.ClientName else None,
            'ClientType': queryset.ClientType,
            'ClientEmployeeId': queryset.ClientEmployeeId,
            'ClientEmployeeDesignation': queryset.ClientEmployeeDesignation,
            'ClientEmployeeRelation': queryset.ClientEmployeeRelation,
           
            'CorporateName': queryset.CorporateName.Corporate_Id if queryset.CorporateName else None,
            'CorporateType': queryset.CorporateType,
            'CorporateEmployeeId': queryset.CorporateEmployeeId,
            'CorporateEmployeeDesignation': queryset.CorporateEmployeeDesignation,
            'CorporateEmployeeRelation': queryset.CorporateEmployeeRelation,
        
            'EmployeeId': queryset.EmployeeId.pk if queryset.EmployeeId else None,
            'EmployeeRelation': queryset.EmployeeRelation,
            'Doctor_Id': queryset.DoctorId.pk if queryset.DoctorId else None,
            'DoctorRelation': queryset.DoctorRelation,
            'DonationType': queryset.DonationType.Donation_Id if queryset.DonationType else None,
            'ServiceCategory': queryset.ServiceCategory,
            'ServiceSubCategory': queryset.ServiceSubCategory,
            # 'TokenNo': queryset.TokenNo,
            'Status': queryset.Status,
            'RegistrationId': queryset.pk,
            # 'PrimaryDoctor': queryset.PrimaryDoctor.pk if queryset.PrimaryDoctor else None,

            # 'SpecilizationId': queryset.Specialization.Speciality_Id if queryset.Specialization else None,
            # 'DoctorName': f"{queryset.PrimaryDoctor.Tittle.Title_Name}.{queryset.PrimaryDoctor.First_Name} {queryset.PrimaryDoctor.Last_Name}" if queryset.PrimaryDoctor else None,
            # 'Speciality': queryset.Specialization.pk if queryset.Specialization else None,
            
            'Multiple_Doc': [],
        }

        if referral_details:
            appointment_dict.update({
                'ReferralSource': referral_details.ReferralSource,
                'ReferredBy': referral_details.ReferredBy.Doctor_ID if referral_details.ReferredBy else None,
                'ReferredByShortName': f"{referral_details.ReferredBy.Tittle.Title_Name}.{referral_details.ReferredBy.First_Name} {referral_details.ReferredBy.Last_Name}" if referral_details.ReferredBy else None,
            })

        # Fetch Multiple Doctor Appointments
        multiple_doc_records = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=RegistrationId)

        if multiple_doc_records.exists():
            appointment_dict['Multiple_Doc'] = [
                {
                    'id':doc.pk,
                    'Complaint': doc.Complaint,
                    'DoctorId': doc.PrimaryDoctor.pk if doc.PrimaryDoctor else None,
                    'Specialization': doc.Specialization.Speciality_Name if doc.Specialization else "",
                    'SpecializationId': str(doc.Specialization.Speciality_Id) if doc.Specialization else "",
                    'DoctorName': f"{doc.PrimaryDoctor.Tittle.Title_Name if doc.PrimaryDoctor and doc.PrimaryDoctor.Tittle else ''}."
                                f"{doc.PrimaryDoctor.First_Name if doc.PrimaryDoctor else ''} {doc.PrimaryDoctor.Last_Name if doc.PrimaryDoctor else ''}",
                    'VisitType': doc.VisitType,  # ✅ Fixed missing comma
                    'TokenNo': str(doc.TokenNo),
                }
                for doc in multiple_doc_records
            ]

            # Consolidated fields
            appointment_dict['Complaint'] = ', '.join(
                [doc['Complaint'] for doc in appointment_dict['Multiple_Doc'] if doc['Complaint']]
            ) or ""

            appointment_dict['TokenNo'] = ', '.join(
                [str(doc['TokenNo']) for doc in appointment_dict['Multiple_Doc'] if doc['TokenNo']]
            ) or ""  


            appointment_dict['Specialization'] = ', '.join(
                [doc['Specialization'] for doc in appointment_dict['Multiple_Doc'] if doc['Specialization']]
            ) or ""
            
            appointment_dict['SpecializationId'] = ', '.join(
                [doc['SpecializationId'] for doc in appointment_dict['Multiple_Doc'] if doc['SpecializationId']]
            ) or ""
            
            appointment_dict['DoctorId'] = ', '.join(
                [doc['DoctorId'] for doc in appointment_dict['Multiple_Doc'] if doc['DoctorId']]
            ) or ""

            appointment_dict['DoctorName'] = ', '.join(
                [doc['DoctorName'] for doc in appointment_dict['Multiple_Doc'] if doc['DoctorName']]
            ) or ""



        print(appointment_dict,'appointment_register_data')
        return JsonResponse(appointment_dict, safe=False)

    except Exception as e:
        print('Error---',{e})
        return JsonResponse({'error': str(e)})




#--------------------jeeva-----> dont change the code -------------------



@csrf_exempt
@require_http_methods(["GET"])
def get_patient_appointment_details_withoutcancelled(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        doctor_id = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        VisitPurpose = request.GET.get('VisitPurpose', '')
 
        # Start with all records
        queryset = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose="OP")
 
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )
 
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
 
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
 
        # Filter by status if specified
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))
        else:
            queryset = queryset.exclude(Status='Cancelled')
 
        if VisitPurpose:
            queryset = queryset.filter(VisitPurpose=VisitPurpose)

        # today = date.today()
        # current_year = today.year
        # current_month = today.month

        # today_total_OP_count = Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today).count()
        
        # monthly_total_OP_count = Patient_Appointment_Registration_Detials.objects.filter(
        #     created_at__year=current_year,
        #     created_at__month=current_month
        # ).count()

        # yearly_total_OP_count = Patient_Appointment_Registration_Detials.objects.filter(
        #     created_at__year=current_year
        # ).count()    
 
        # Serialize the filtered queryset
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            patient = register.PatientId

            # Initialize Doc_queryset as None
            Doc_queryset = None  
 
            # Fetch doctor details only if needed
            if doctor_id:
                Doc_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id=register
                ).first()
 
            elif Doctor:
                Doc_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    PrimaryDoctor__pk=Doctor
                ).first()

            formatted_bdate = register.created_at.strftime('%d-%m-%y')

            # Create dictionary with fallback values
            appointment_dict = {
                
                'id': idx,
                'Edit':'Yes',
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                'Gender': register.PatientId.Gender,
                'AppointmentId': register.AppointmentId,
                'VisitId': register.VisitId,
                # 'Complaint': Doc_queryset.Complaint if Doc_queryset else '',
                'isMLC': register.IsMLC,
                'VisitType': Doc_queryset.VisitType if Doc_queryset else '',
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'RegistrationId': register.pk,
                'fathername': register.PatientId.FatherName or '',
                'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
                'Street': patient.PermanentStreet or patient.Street or '',
                'Area': patient.PermanentArea or patient.Area or '',
                'City': patient.PermanentCity or patient.City or '',
                'District': patient.PermanentDistrict or patient.District or '',
                'State': patient.PermanentState or patient.State or '',
                'Country': patient.PermanentCountry or patient.Country or '',
                'Pincode': patient.PermanentPincode or patient.Pincode or '',
                
                'Address': f"{register.PatientId.Street} {register.PatientId.Area}",
                'created_at': formatted_bdate,
                'registeridbarcode': register.Registration_Id,
                # 'DoctorId': Doc_queryset.PrimaryDoctor.pk if Doc_queryset and Doc_queryset.PrimaryDoctor else None,
                # 'SpecilizationId': Doc_queryset.Specialization.Speciality_Id if Doc_queryset and Doc_queryset.Specialization else None,
                # 'DoctorName': (
                #     f"{Doc_queryset.PrimaryDoctor.Tittle.Title_Name if Doc_queryset and Doc_queryset.PrimaryDoctor and Doc_queryset.PrimaryDoctor.Tittle else ''}."
                #     f"{Doc_queryset.PrimaryDoctor.First_Name if Doc_queryset and Doc_queryset.PrimaryDoctor else ''} "
                #     f"{Doc_queryset.PrimaryDoctor.Last_Name if Doc_queryset and Doc_queryset.PrimaryDoctor else ''}"
                # ).strip(),
                # 'Specilization': str(Doc_queryset.Specialization.Speciality_Name) if Doc_queryset and Doc_queryset.Specialization else '',
                'Multiple_Doc': []  # 🛠️ Ensure this is an empty list
            }
 
            # Fetch multiple doctor details
            Multiple_Doc = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=register.pk)
           
            print(Multiple_Doc, 'Multiple_Doc-----------')
            for MulDoc in Multiple_Doc:
                appointment_dict['Multiple_Doc'].append({  # ✅ Corrected here
                    'id': MulDoc.Registration_Id.pk,
                    'Specilization': str(MulDoc.Specialization.Speciality_Name) if MulDoc.Specialization else '',
                    'DoctorId': MulDoc.PrimaryDoctor.pk if MulDoc.PrimaryDoctor else None,
                    'SpecilizationId': MulDoc.Specialization.Speciality_Id if MulDoc.Specialization else '',
                    'VisitType': MulDoc.VisitType,
                    'Complaint': MulDoc.Complaint,
                    'TokenNo': MulDoc.TokenNo,
                    'DoctorName': (
                            f"{MulDoc.PrimaryDoctor.Tittle.Title_Name if MulDoc and MulDoc.PrimaryDoctor and MulDoc.PrimaryDoctor.Tittle else ''}."
                            f"{MulDoc.PrimaryDoctor.First_Name if MulDoc and MulDoc.PrimaryDoctor else ''} "
                            f"{MulDoc.PrimaryDoctor.Last_Name if MulDoc and MulDoc.PrimaryDoctor else ''}"
                        ).strip(),  
                })
 
            appointment_register_data.append(appointment_dict)
        
        # return JsonResponse({
        #     'appointments': appointment_register_data,
        #     'today_total_OP_count': today_total_OP_count,
        #     'monthly_total_OP_count': monthly_total_OP_count,
        #     'yearly_total_OP_count': yearly_total_OP_count
        # }, safe=False)

        return JsonResponse(appointment_register_data, safe=False)
    
 
    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def Total_OP_patients_List(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        doctor_id = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        VisitPurpose = request.GET.get('VisitPurpose', '')
        User = request.GET.get('User', '')
 
        # Start with all records
        queryset = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose="OP").order_by('-created_at')
        # queryset = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose="OP")
 
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )
 
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
 
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
 
        # Filter by status if specified
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))
        else:
            queryset = queryset.exclude(Status='Cancelled')
 
        if VisitPurpose:
            queryset = queryset.filter(VisitPurpose=VisitPurpose)
       
        # if User not in ['host','admin']:
        #     queryset = queryset.filter(created_by=User)
 
        today = date.today()
        current_year = today.year
        current_month = today.month
 
        today_total_OP_count = 0
        monthly_total_OP_count = 0
        yearly_total_OP_count = 0
 
        if User not in ['host','admin','RENEESHA','SUJANA','RUBEENA','ABHISHEK','LIBI','AKSHAYA','SHAFLA']:
 
            today_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today,Registration_Id__created_by=User,Registration_Id__VisitPurpose="OP").count()
 
            monthly_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="OP",
                Registration_Id__created_by=User
            ).count()
 
            yearly_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="OP",
                Registration_Id__created_by=User
            ).count()
 
        else :
 
            today_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today,Registration_Id__VisitPurpose="OP",).count()
 
            monthly_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="OP",
 
            ).count()
 
            yearly_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="OP",
 
            ).count()
 
 
         
 
        # Serialize the filtered queryset
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            patient = register.PatientId
 
            # Initialize Doc_queryset as None
            Doc_queryset = None  
 
            # Fetch doctor details only if needed
            if doctor_id:
                Doc_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id=register
                ).first()
 
            elif Doctor:
                Doc_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    PrimaryDoctor__pk=Doctor
                ).first()
 
            formatted_bdate = register.created_at.strftime('%d-%m-%y')
 
            # Create dictionary with fallback values
            appointment_dict = {
               
                'id': idx,
                'Edit':'Yes',
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                'Gender': register.PatientId.Gender,
                'AppointmentId': register.AppointmentId,
                'VisitId': register.VisitId,
                # 'Complaint': Doc_queryset.Complaint if Doc_queryset else '',
                'isMLC': register.IsMLC,
                'VisitType': Doc_queryset.VisitType if Doc_queryset else '',
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'created_by': register.created_by if register else '',
                'RegistrationId': register.pk,
                'fathername': register.PatientId.FatherName or '',
                'SpouseName' : register.PatientId.SpouseName or '',
                'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
                'Street': patient.PermanentStreet or patient.Street or '',
                'Area': patient.PermanentArea or patient.Area or '',
                'City': patient.PermanentCity or patient.City or '',
                'District': patient.PermanentDistrict or patient.District or '',
                'State': patient.PermanentState or patient.State or '',
                'Country': patient.PermanentCountry or patient.Country or '',
                'Pincode': patient.PermanentPincode or patient.Pincode or '',
               
                'Address': f"{register.PatientId.Street} {register.PatientId.Area}",
                'created_at': formatted_bdate,
                'created_time': register.created_at,
                'registeridbarcode': register.Registration_Id,
                'PatientCategory' : register.PatientCategory,
                # 'DoctorId': Doc_queryset.PrimaryDoctor.pk if Doc_queryset and Doc_queryset.PrimaryDoctor else None,
                # 'SpecilizationId': Doc_queryset.Specialization.Speciality_Id if Doc_queryset and Doc_queryset.Specialization else None,
                # 'DoctorName': (
                #     f"{Doc_queryset.PrimaryDoctor.Tittle.Title_Name if Doc_queryset and Doc_queryset.PrimaryDoctor and Doc_queryset.PrimaryDoctor.Tittle else ''}."
                #     f"{Doc_queryset.PrimaryDoctor.First_Name if Doc_queryset and Doc_queryset.PrimaryDoctor else ''} "
                #     f"{Doc_queryset.PrimaryDoctor.Last_Name if Doc_queryset and Doc_queryset.PrimaryDoctor else ''}"
                # ).strip(),
                # 'Specilization': str(Doc_queryset.Specialization.Speciality_Name) if Doc_queryset and Doc_queryset.Specialization else '',
                'Multiple_Doc': []  # 🛠️ Ensure this is an empty list
            }
 
            # Fetch multiple doctor details
            Multiple_Doc = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=register.pk)
           
            print(Multiple_Doc, 'Multiple_Doc-----------')
            for MulDoc in Multiple_Doc:
                appointment_dict['Multiple_Doc'].append({  # ✅ Corrected here
                    'id': MulDoc.Registration_Id.pk,
                    'Specilization': str(MulDoc.Specialization.Speciality_Name) if MulDoc.Specialization else '',
                    'DoctorId': MulDoc.PrimaryDoctor.pk if MulDoc.PrimaryDoctor else None,
                    'SpecilizationId': MulDoc.Specialization.Speciality_Id if MulDoc.Specialization else '',
                    'VisitType': MulDoc.VisitType,
                    'Complaint': MulDoc.Complaint,
                    'TokenNo': MulDoc.TokenNo,
                    'DoctorName': (
                            f"{MulDoc.PrimaryDoctor.Tittle.Title_Name if MulDoc and MulDoc.PrimaryDoctor and MulDoc.PrimaryDoctor.Tittle else ''}."
                            f"{MulDoc.PrimaryDoctor.First_Name if MulDoc and MulDoc.PrimaryDoctor else ''} "
                            f"{MulDoc.PrimaryDoctor.Last_Name if MulDoc and MulDoc.PrimaryDoctor else ''}"
                        ).strip(),  
                    'RenewDate' : MulDoc.RenewDate.strftime("%d-%m-%y") if MulDoc.RenewDate else None,
                    'ValidityDate' : (MulDoc.RenewDate - timedelta(days=1)).strftime("%d-%m-%y") if MulDoc.RenewDate else None
                })
 
            appointment_register_data.append(appointment_dict)
        # appointment_register_data['today_total_OP_count']=today_total_OP_count,
        # appointment_register_data['monthly_total_OP_count']=monthly_total_OP_count,
        # appointment_register_data['yearly_total_OP_count']=yearly_total_OP_count,
 
        return JsonResponse({
            'appointments': appointment_register_data,
            'today_total_OP_count': today_total_OP_count,
            'monthly_total_OP_count': monthly_total_OP_count,
            'yearly_total_OP_count': yearly_total_OP_count
        }, safe=False)
 
        # return JsonResponse(appointment_register_data, safe=False)
   
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
@csrf_exempt
@require_http_methods(["GET"])
def get_OP_Patient_Que_with_Multiple_Doc(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        doctor_id = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        VisitPurpose = request.GET.get('VisitPurpose', '')
 
        print(status,'status------')
        # Start with all records
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose="OP")
 
        print(queryset,'queryset------------1')
 
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )
            print(queryset,'queryset------------2')
 
        if from_date and to_date:
            queryset = queryset.filter(Registration_Id__created_at__date__range=[from_date, to_date])
 
            print(queryset,'queryset------------3')
 
        elif particular_date:
            queryset = queryset.filter(Registration_Id__created_at__date=particular_date)
 
            print(queryset,'queryset------------4')
 
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(Registration_Id__created_at__date=Current_date)
 
            print(queryset,'queryset------------5')
           
        # Filter by status if specified
        if status:
            queryset = queryset.filter(Q(Status__iexact=status))
        else:
            queryset = queryset.exclude(Status='Cancelled')
 
            print(queryset,'queryset------------6')
       
        if VisitPurpose:
            queryset = queryset.filter(Registration_Id__VisitPurpose=VisitPurpose)
       
            print(queryset,'queryset------------7')
           
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=Doctor)
        
        if doctor_id:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=doctor_id)

            print(queryset,'queryset------------8')
 
 
        # Serialize the filtered queryset
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            # Initialize Doc_queryset as None
            Doc_queryset = None  
 
            # Fetch doctor details only if needed
            if doctor_id:
                Doc_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id=register
                ).first()
 
            elif Doctor:
                Doc_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    PrimaryDoctor__pk=Doctor
                ).first()
 
            # Create dictionary with fallback values
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id.PatientId.Patient_profile else None,
                'PatientId': register.Registration_Id.PatientId.PatientId,
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name}.{register.Registration_Id.PatientId.FirstName} {register.Registration_Id.PatientId.MiddleName} {register.Registration_Id.PatientId.SurName}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo,
                'Age': register.Registration_Id.PatientId.Age,
                'Gender': register.Registration_Id.PatientId.Gender,
                'AppointmentId': register.Registration_Id.AppointmentId,
                'VisitId': register.Registration_Id.VisitId,
                'isMLC': register.Registration_Id.IsMLC,
                'VisitType': register.VisitType if register else '',
                'isRefferal': register.Registration_Id.IsReferral,
                'Status': register.Status,
                'RegistrationId': register.Registration_Id.Registration_Id if register.Registration_Id else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else '',
                'VisitType': register.VisitType,
                'Complaint': register.Complaint,
                'TokenNo': register.TokenNo,
                'DoctorName': (
                        f"{register.PrimaryDoctor.Tittle.Title_Name if register and register.PrimaryDoctor and register.PrimaryDoctor.Tittle else ''}."
                        f"{register.PrimaryDoctor.First_Name if register and register.PrimaryDoctor else ''} "
                        f"{register.PrimaryDoctor.Last_Name if register and register.PrimaryDoctor else ''}"
                    ).strip(),
            }
 
            appointment_register_data.append(appointment_dict)

        count_filters = {}
        if Current_date:
            count_filters['created_at__date'] = Current_date
        
        if from_date and to_date:
            count_filters['created_at__date__range'] = [from_date, to_date]
        
        if particular_date:
            count_filters['created_at__date'] = particular_date
         
        if Doctor:
            count_filters['PrimaryDoctor__Doctor_ID'] = Doctor

        count_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id__VisitPurpose="OP",
            **count_filters
        )
        if status:
            count_queryset = count_queryset.filter(Status__iexact=status)
        else:
            count_queryset = count_queryset.exclude(Status='Cancelled')

        Total_OP_Count = count_queryset.count()

       
        # return JsonResponse(appointment_register_data, safe=False)
        return JsonResponse({
            'appointments': appointment_register_data,
            'Total_OP_Count':Total_OP_Count
        }, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
 

@csrf_exempt
@require_http_methods(["GET"])
def Total_OP_Patient_with_Multiple_Doc_List(request):
    try:
       
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
       
        from_date = request.GET.get('startDate', '')  
        to_date = request.GET.get('endDate', '')  
        Current_date = request.GET.get('CurrentDate', '')
        Specialization = request.GET.get('Specialization', '')
        DoctorName = request.GET.get('DoctorName', '')
 

        Current_date = datetime.strptime(Current_date, "%Y-%m-%d").date()
        from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
        to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
        
        current_year = Current_date.year

        print('Request Params:', status, Current_date, from_date, to_date,current_year, Specialization, DoctorName)
        
        patientFilter = Q()

        if query:
            patientFilter &= Q(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )
        print('111----',patientFilter)    
        # if from_date and to_date and from_date != to_date:
        #     patientFilter &= Q(Registration_Id__created_at__date__range=[from_date, to_date])
        
        print('222----',patientFilter)    
        print('bbb')
          
        # if Current_date:
        #     patientFilter &= Q(Registration_Id__created_at__date=Current_date)
        
        if current_year:
            patientFilter &= Q(Registration_Id__created_at__year=current_year)

        print('aaaa')
        print('333----',patientFilter)    

        if status:
            patientFilter &= Q(Q(Status__iexact=status))
        else:
            patientFilter &= ~Q(Status='Cancelled')
 
        
        if DoctorName:
            patientFilter &= Q(PrimaryDoctor__Doctor_ID=DoctorName)

        if Specialization:
            patientFilter &= Q(Specialization__Speciality_Id=Specialization)

        # Start with all records
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(patientFilter,Registration_Id__VisitPurpose="OP")

        print(queryset,'queryset----l')
        
       
        
        # if VisitPurpose:
        #     queryset = queryset.filter(Registration_Id__VisitPurpose=VisitPurpose)
       
        print(queryset,'queryset------------7')

      


        print(queryset,'queryset------------9')


        # Serialize the filtered queryset
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            
 
            # Create dictionary with fallback values
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id.PatientId.Patient_profile else None,
                'PatientId': register.Registration_Id.PatientId.PatientId,
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name}.{register.Registration_Id.PatientId.FirstName} {register.Registration_Id.PatientId.MiddleName} {register.Registration_Id.PatientId.SurName}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo,
                'Age': register.Registration_Id.PatientId.Age,
                'Gender': register.Registration_Id.PatientId.Gender,
                'AppointmentId': register.Registration_Id.AppointmentId,
                'VisitId': register.Registration_Id.VisitId,
                'isMLC': register.Registration_Id.IsMLC,
                'VisitType': register.VisitType if register else '',
                'isRefferal': register.Registration_Id.IsReferral,
                'Status': register.Status,
                'RegistrationId': register.Registration_Id.Registration_Id if register.Registration_Id else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else '',
                'VisitType': register.VisitType,
                'Complaint': register.Complaint,
                'TokenNo': register.TokenNo,
                'RequestTime': register.created_at.strftime('%I:%M %p') if register.created_at else None,
                'RequestDate': register.created_at.strftime('%d-%m-%Y') if register.created_at else None,
                
                'DoctorName': (
                        f"{register.PrimaryDoctor.Tittle.Title_Name if register and register.PrimaryDoctor and register.PrimaryDoctor.Tittle else ''}."
                        f"{register.PrimaryDoctor.First_Name if register and register.PrimaryDoctor else ''} "
                        f"{register.PrimaryDoctor.Last_Name if register and register.PrimaryDoctor else ''}"
                    ).strip(),
            }
 
            appointment_register_data.append(appointment_dict)

        count_filters = {}
        # if Current_date:
        #     count_filters['created_at__date'] = Current_date
        
        # elif from_date and to_date:
        #     count_filters['created_at__date__range'] = [from_date, to_date]

         
        if DoctorName:
            count_filters['PrimaryDoctor__Doctor_ID'] = DoctorName

        if Specialization:
            count_filters['Specialization__Speciality_Id'] = Specialization



        today_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            created_at__date=Current_date,**count_filters
        ).count()
        
        monthly_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(  
           
            created_at__date__range=[from_date, to_date],**count_filters
        ).count()

        yearly_total_OP_count = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
           
            created_at__year=current_year,**count_filters
        ).count()  
  
 
        # return JsonResponse(appointment_register_data, safe=False)

        return JsonResponse({
            'appointments': appointment_register_data,
            'today_total_OP_count': today_total_OP_count,
            'monthly_total_OP_count': monthly_total_OP_count,
            'yearly_total_OP_count': yearly_total_OP_count
        }, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
  
  
 
@csrf_exempt
@require_http_methods(["GET"])
def get_OP_Patient_Details_For_BarcodePrint(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '')

        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId parameter is required'})

        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id__Registration_Id=RegistrationId,
            Registration_Id__VisitPurpose="OP"
        )

        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            patient = register.Registration_Id.PatientId
            registration = register.Registration_Id
            doctor = register.PrimaryDoctor

            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                'PhoneNo': patient.PhoneNo,
                'Age': patient.Age,
                'SpouseName': patient.SpouseName or '',

                'Gender': patient.Gender,
                'AppointmentId': registration.AppointmentId,
                'VisitId': registration.VisitId,
                'isMLC': registration.IsMLC,
                'VisitType': register.VisitType,
                'isRefferal': registration.IsReferral,
                'Status': registration.Status,
                'RegistrationId': registration.pk,
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'DoctorId': doctor.pk if doctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else '',
                'Complaint': register.Complaint,
                'TokenNo': register.TokenNo,
                'registeridbarcode': register.Registration_Id,
                # 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",

                'DoctorName': (
                    f"{doctor.Tittle.Title_Name if doctor and doctor.Tittle else ''}."
                    f"{doctor.First_Name if doctor else ''} "
                    f"{doctor.Last_Name if doctor else ''}"
                ).strip(),

                'fathername': patient.FatherName or '',
                'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
                'Street': patient.PermanentStreet or patient.Street or '',
                'Area': patient.PermanentArea or patient.Area or '',
                'City': patient.PermanentCity or patient.City or '',
                'District': patient.PermanentDistrict or patient.District or '',
                'State': patient.PermanentState or patient.State or '',
                'Country': patient.PermanentCountry or patient.Country or '',
                'Pincode': patient.PermanentPincode or patient.Pincode or '',
                
                'created_at': register.created_at,
                'created_time': register.created_at,
                'registeridbarcode': registration.Registration_Id if registration else '',
                'Multiple_Doc': []  # 🛠️ Ensure this is an empty list

            }

            Multiple_Doc = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id=RegistrationId)

            print(Multiple_Doc, 'Multiple_Doc-----------')
            for MulDoc in Multiple_Doc:
                appointment_dict['Multiple_Doc'].append({  # ✅ Corrected here
                    'id': MulDoc.Registration_Id.pk,
                    'Specilization': str(MulDoc.Specialization.Speciality_Name) if MulDoc.Specialization else '',
                    'DoctorId': MulDoc.PrimaryDoctor.pk if MulDoc.PrimaryDoctor else None,
                    'SpecilizationId': MulDoc.Specialization.Speciality_Id if MulDoc.Specialization else '',
                    'VisitType': MulDoc.VisitType,
                    'Complaint': MulDoc.Complaint,
                    'TokenNo': MulDoc.TokenNo,
                    'DoctorName': (
                            f"{MulDoc.PrimaryDoctor.Tittle.Title_Name if MulDoc and MulDoc.PrimaryDoctor and MulDoc.PrimaryDoctor.Tittle else ''}."
                            f"{MulDoc.PrimaryDoctor.First_Name if MulDoc and MulDoc.PrimaryDoctor else ''} "
                            f"{MulDoc.PrimaryDoctor.Last_Name if MulDoc and MulDoc.PrimaryDoctor else ''}"
                        ).strip(),  
                    'RenewDate' : MulDoc.RenewDate.strftime("%d-%m-%y") if MulDoc.RenewDate else None,
                    'ValidityDate' : (MulDoc.RenewDate - timedelta(days=1)).strftime("%d-%m-%y") if MulDoc.RenewDate else None
                })

            appointment_register_data.append(appointment_dict)

        return JsonResponse(appointment_dict, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_Emg_Patient_Details_For_BarcodePrint(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '')

        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId parameter is required'})

        queryset = Patient_Emergency_Registration_Detials.objects.filter(
            Registration_Id=RegistrationId,
            # Registration_Id__VisitPurpose="OP"
        )

        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            patient = register.PatientId
            registration = register.Registration_Id
            doctor = register.PrimaryDoctor

            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                'PhoneNo': patient.PhoneNo,
                'Age': patient.Age,
                'SpouseName': patient.SpouseName or '',

                'Gender': patient.Gender,
                # 'AppointmentId': registration.AppointmentId,
                # 'VisitId': registration.VisitId,
                'isMLC': register.IsMLC,
                'VisitType': register.VisitType,
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'RegistrationId': registration,
                'CasualitySpecilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'DoctorId': doctor.Doctor_ID if doctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else '',
                'Complaint': register.Complaint,
                'TokenNo': register.TokenNo,
                # 'registeridbarcode': register.Registration_Id,
                # 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",

                'CasualityDoctorName': (
                    f"{doctor.Tittle.Title_Name if doctor and doctor.Tittle else ''}."
                    f"{doctor.First_Name if doctor else ''} "
                    f"{doctor.Last_Name if doctor else ''}"
                ).strip(),

                'fathername': patient.FatherName or '',
                'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
                'Street': patient.PermanentStreet or patient.Street or '',
                'Area': patient.PermanentArea or patient.Area or '',
                'City': patient.PermanentCity or patient.City or '',
                'District': patient.PermanentDistrict or patient.District or '',
                'State': patient.PermanentState or patient.State or '',
                'Country': patient.PermanentCountry or patient.Country or '',
                'Pincode': patient.PermanentPincode or patient.Pincode or '',
                
                'created_at': register.created_at,
                'registeridbarcode': register.Registration_Id if registration else '',
                'Multiple_Doc': []  # 🛠️ Ensure this is an empty list

            }

          

            appointment_register_data.append(appointment_dict)

        return JsonResponse(appointment_dict, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



# @csrf_exempt
# @require_http_methods(["GET"])
# def get_OP_Referal_Doctor_PatientList(request):
#     try:
#         queryset = OPD_Referal_Details.objects.all()
#         PatientList_data = []

#         for idx, register in enumerate(queryset, start=1):
#             patient = register.Registration_Id.PatientId
#             registration = register.Registration_Id
#             doctor = register.ReferDocctorId

#             # Build full doctor name with consistent spacing
#             doctor_name = ' '.join(filter(None, [
#                 f"{doctor.Tittle.Title_Name}." if doctor and doctor.Tittle else '',
#                 doctor.First_Name if doctor else '',
#                 doctor.Last_Name if doctor else ''
#             ])).strip()

#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
#                 'PatientId': patient.PatientId,
#                 'PatientName': ' '.join(filter(None, [
#                     f"{patient.Title.Title_Name}." if patient.Title else '',
#                     patient.FirstName,
#                     patient.MiddleName,
#                     patient.SurName
#                 ])).strip(),
#                 'PhoneNo': patient.PhoneNo,
#                 'Age': patient.Age,
#                 'fathername': patient.FatherName,
#                 'SpouseName': patient.SpouseName,
#                 'Gender': patient.Gender,
#                 'AppointmentId': registration.AppointmentId,
#                 'VisitId': registration.VisitId,
#                 'isMLC': registration.IsMLC,
#                 'isRefferal': registration.IsReferral,
#                 'Status': registration.Status,
#                 'RegistrationId': registration.pk,
#                 'DoctorId': doctor.Doctor_ID if doctor else None,
#                 'registeridbarcode': registration,
#                 'DoctorName': doctor_name,
#                 'created_at': register.created_at,
#                 'Multiple_Doc': []
#             }

#             # ✅ Load multiple doctor info if needed
#             Multiple_Doc = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=registration)
#             for MulDoc in Multiple_Doc:
#                 appointment_dict['Multiple_Doc'].append({
#                     'id': MulDoc.Registration_Id.pk,
#                     'Specilization': MulDoc.Specialization.Speciality_Name if MulDoc.Specialization else '',
#                     'DoctorId': MulDoc.PrimaryDoctor.pk if MulDoc.PrimaryDoctor else None,
#                     'SpecilizationId': MulDoc.Specialization.Speciality_Id if MulDoc.Specialization else '',
#                     'VisitType': MulDoc.VisitType,
#                     'Complaint': MulDoc.Complaint,
#                     'TokenNo': MulDoc.TokenNo,
#                     'DoctorName': ' '.join(filter(None, [
#                         f"{MulDoc.PrimaryDoctor.Tittle.Title_Name}." if MulDoc.PrimaryDoctor and MulDoc.PrimaryDoctor.Tittle else '',
#                         MulDoc.PrimaryDoctor.First_Name if MulDoc.PrimaryDoctor else '',
#                         MulDoc.PrimaryDoctor.Last_Name if MulDoc.PrimaryDoctor else ''
#                     ])).strip(),
#                 })

#             PatientList_data.append(appointment_dict)

#         return JsonResponse(PatientList_data, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_OP_Referal_Doctor_PatientList(request):
    try:

        Status = request.GET.get('Status')
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        DoctorId = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
        
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        
        queryset = OPD_Referal_Details.objects.all()

        if query:
            queryset = queryset.filter(
                Q(Patient_Id__FirstName__icontains=query) |
                Q(Patient_Id__MiddleName__icontains=query) |
                Q(Patient_Id__SurName__icontains=query) |
                Q(Patient_Id__PatientId__icontains=query) |
                Q(Patient_Id__PhoneNo__icontains=query)
            )

        if status:  # Only apply status filter if provided
            queryset = queryset.filter(Q(RefPatientStatus__icontains=status))

        # Apply date filters only if parameters are provided
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        elif Current_date:
            queryset = queryset.filter(created_at__date=Current_date)
        
        # queryset = OPD_Referal_Details.objects.filter(RefPatientStatus = Status)
        PatientList_data = []

        for idx, register in enumerate(queryset, start=1):
            patient = register.Registration_Id.PatientId
            registration = register.Registration_Id
            doctor = register.ReferDoctorId
            RefdoctorDetails = register.ReferDoctorId.Doctor_ID

            # Build full doctor name with consistent spacing
            doctor_name = ' '.join(filter(None, [
                f"{doctor.Tittle.Title_Name}." if doctor and doctor.Tittle else '',
                doctor.First_Name if doctor else '',
                doctor.Middle_Name if doctor else '',
                doctor.Last_Name if doctor else ''
            ])).strip()

            Ref_Ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=RefdoctorDetails)

            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'PatientId': patient.PatientId,
                'PatientName': ' '.join(filter(None, [
                    f"{patient.Title.Title_Name}." if patient.Title else '',
                    patient.FirstName,
                    patient.MiddleName,
                    patient.SurName
                ])).strip(),
                'Title': patient.Title.Title_Id if patient.Title else '',
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'LastName': patient.SurName,
                'PhoneNo': patient.PhoneNo,
                'Age': patient.Age,
                'Gender': patient.Gender,
                'MaritalStatus': patient.MaritalStatus,
                'FatherName': patient.FatherName,
                'SpouseName': patient.SpouseName,
                'DOB': patient.DOB,
                'Email': patient.Email,
                'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
                'Occupation': patient.Occupation,
                'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                'Nationality': patient.Nationality,
                'UHIDType': patient.UniqueIdType,
                'UHIDNo': patient.UniqueIdNo,
                'PatientType': patient.PatientType,
                'ABHA': patient.ABHA,
                'AppointmentId': registration.AppointmentId,
                'CardValidity': registration.CardValidity,
                'NextToKinName': registration.NextToKinName,
                'Relation': registration.Relation,
                'RelativePhNo': registration.RelativePhNo,
                'VisitId': registration.VisitId,
                'IsMLC': registration.IsMLC,
                'IsReferral': registration.IsReferral,
                'Status': register.RefPatientStatus,
                # 'Status': registration.Status,
                'PatientCategory': registration.PatientCategory,
                'RegistrationId': registration.Registration_Id,
                'RefDoctorSpecilization': Ref_Ins.Specialization.Speciality_Id,
                'RefDoctorId': doctor.Doctor_ID if doctor else None,
                'registeridbarcode': registration.Registration_Id,
                'DoctorName': doctor_name,
                'created_at': register.created_at,
                'Multiple_Doc': []
            }

         
            PatientList_data.append(appointment_dict)

        return JsonResponse(PatientList_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def get_diagnosis_patient_appointment_details(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        doctor_id = request.GET.get('DoctorId', '')
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        User = request.GET.get('User', '')
        dateOption = request.GET.get('dateOption')
 
        # Start with all records
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='RADIOLOGY').order_by('-created_at')
       
        print(queryset,'queryset')
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId_FirstName_icontains=query) |
                Q(Registration_Id__PatientId_MiddleName_icontains=query) |
                Q(Registration_Id__PatientId_SurName_icontains=query) |
                Q(Registration_Id__PatientId_PatientId_icontains=query) |
                Q(Registration_Id__PatientId_PhoneNo_icontains=query)
            )
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
 
        if dateOption == 'all':
            print('allllllll')
 
        # Filter by DoctorId
        if not doctor_id:
             pass
        else:
            queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
            print(queryset,'patientqueryset1111111111111111s')
            print(doctor_id,'queryset222222222222')
        # Filter by status if specified
        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            # Exclude 'Cancelled' status if no status is specified
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')
       
        # if User not in ['host','admin','RENEESHA','SUJANA','RUBEENA','ABHISHEK','LIBI','AKSHAYA','SHAFLA']:
        #     queryset = queryset.filter(Registration_Id__created_by=User)
 
        today = date.today()
        current_year = today.year
        current_month = today.month
 
        today_total_Rad_count = 0
        monthly_total_Rad_count = 0
        yearly_total_Rad_count = 0
 
        if User not in ['host','admin','RENEESHA','SUJANA','RUBEENA','ABHISHEK','LIBI','AKSHAYA','SHAFLA']:
 
            today_total_Rad_count = Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,created_by=User,VisitPurpose="RADIOLOGY").count()
 
            monthly_total_Rad_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                VisitPurpose="RADIOLOGY",
                created_by=User
            ).count()
 
            yearly_total_Rad_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                VisitPurpose="RADIOLOGY",
                created_by=User
            ).count()
 
        else :
 
            today_total_Rad_count = Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,VisitPurpose="RADIOLOGY",).count()
 
            monthly_total_Rad_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                VisitPurpose="RADIOLOGY",
 
            ).count()
 
            yearly_total_Rad_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                VisitPurpose="RADIOLOGY",
 
            ).count()
 
 
 
 
       
        # Serialize the filtered queryset
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
 
            testdetails = Radiology_Request_Details.objects.filter(OP_Register_Id=register.Registration_Id,Status='Request')
            testlist = []
            for datas in testdetails:
                Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
                Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()
 
                datalist={
                    'RadiologyName' : Dep.Radiology_Name,
                    'Radiologyid': Dep.Radiology_Id,
                    'TestCode':Test.Test_Code,
                    'TestName': Test.Test_Name
 
                }
                testlist.append(datalist)
           
            # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
           
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
                'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
                'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
                'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
               
                'Complaint': register.Complaint,
                'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
                'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
 
                'VisitType': register.VisitType,
                'Complaint': register.Complaint,
                # 'Flagging': Flagging_name,
                # 'FlaggingColour': Flagging_color,
                'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
                'Status': register.Registration_Id.Status if register.Registration_Id else '',
                'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
               
                'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
                'DoctorName': (
                    f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
                    f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
                    f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
                ),
 
                # 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor.Tittle else None}.{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} {register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}",
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'Raddocid' : register.pk,
                'testlist':testlist
            }
            appointment_register_data.append(appointment_dict)
 
 
 
 
 
 
        print(appointment_register_data,'appointment_register_data')
        return JsonResponse(
            {
                'appointments': appointment_register_data,
                'today_total_Rad_count': today_total_Rad_count,
                'monthly_total_Rad_count': monthly_total_Rad_count,
                'yearly_total_Rad_count': yearly_total_Rad_count
            }, safe=False)
 
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_lab_patient_appointment_details(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        doctor_id = request.GET.get('DoctorId', '')
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        User = request.GET.get('User', '')
 
        # Start with all records
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='LAB').order_by('-created_at')
       
        print(queryset,'queryset11111111111')
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId_FirstName_icontains=query) |
                Q(Registration_Id__PatientId_MiddleName_icontains=query) |
                Q(Registration_Id__PatientId_SurName_icontains=query) |
                Q(Registration_Id__PatientId_PatientId_icontains=query) |
                Q(Registration_Id__PatientId_PhoneNo_icontains=query)
            )
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
 
        # Filter by DoctorId
        if not doctor_id:
             pass
        else:
            queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
            print(queryset,'patientqueryset1111111111111111s')
            print(doctor_id,'queryset222222222222')
        # Filter by status if specified
        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            # Exclude 'Cancelled' status if no status is specified
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')
       
        # if User not in ['host','admin','RENEESHA','SUJANA','RUBEENA','ABHISHEK','LIBI','AKSHAYA','SHAFLA']:
        #     queryset = queryset.filter(Registration_Id__created_by=User)
 
        today = date.today()
        current_year = today.year
        current_month = today.month
 
        today_total_Lab_count = 0
        monthly_total_Lab_count = 0
        yearly_total_Lab_count = 0
 
        if User not in ['host','admin']:
 
            today_total_Lab_count = Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,created_by=User,VisitPurpose="LAB").count()
 
            monthly_total_Lab_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                VisitPurpose="LAB",
                created_by=User
            ).count()
 
            yearly_total_Lab_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                VisitPurpose="LAB",
                created_by=User
            ).count()
 
        else :
 
            today_total_Lab_count = Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,VisitPurpose="LAB",).count()
 
            monthly_total_Lab_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                VisitPurpose="LAB",
 
            ).count()
 
            yearly_total_Lab_count = Patient_Appointment_Registration_Detials.objects.filter(
                created_at__year=current_year,
                VisitPurpose="LAB",
 
            ).count()
 
 
       
        # Serialize the filtered queryset
   
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            print(register, 'register2323233333')
 
            lab_details = Lab_Request_Details.objects.filter(OP_Register_Id = register.Registration_Id)
            testlist = []
            for lab in lab_details:
 
                labRequestId = lab.Request_Id
 
                item = Lab_Request_Items_Details.objects.filter(Request = lab.Request_Id)
                sno = 0
                for i in item:
                    sno = sno + 1
 
                    if i.TestType == 'Individual':
 
                        datalist = {
                                'id': sno,
                                'Name':i.Test_Code.Test_Name,
                                'itemid': i.pk,
                                'Code':i.Test_Code.Test_Code
                        }
                        testlist.append(datalist)
 
                    elif i.TestType == 'Group':
 
                        datalist = {
                                'id': sno,                                
                                'Name':i.Group_Code.Group_Name,
                                'itemid': i.pk,
                                'Code':i.Group_Code.Group_Code
 
                        }
                        testlist.append(datalist)
 
                    elif i.TestType == 'Offers':
 
                        datalist = {
                                'id': sno,
                                'Name':i.Package_Code.package_name,
                                'itemid': i.pk,
                                'Code':i.Package_Code.package_code
 
                        }
                        testlist.append(datalist)
           
 
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
                'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
                'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
                'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
                'Complaint': register.Complaint,
                'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
                'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
                'VisitType': register.VisitType,
                'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
                'Status': register.Registration_Id.Status if register.Registration_Id else '',
                'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
                'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
                'DoctorName': (
                    f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
                    f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
                    f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
                ),
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'Labdocid': register.pk,
                'LabrequestID': labRequestId,
                'testlist':testlist,
                'Bill_Status': register.Registration_Id.Bill_Status
            }
            appointment_register_data.append(appointment_dict)
 
 
        return JsonResponse(
            {
                'appointments': appointment_register_data,
                'today_total_Lab_count': today_total_Lab_count,
                'monthly_total_Lab_count': monthly_total_Lab_count,
                'yearly_total_Lab_count': yearly_total_Lab_count
            }, safe=False)
 
    except Exception as e:
        return JsonResponse({'error':str(e)})
 
 
 
 
 
 
#--------------------jeeva-----> dont change the code -------------------


@csrf_exempt
@transaction.atomic()
@require_http_methods(['POST','GET'])
def IP_Patient_Registration_Details_Link(request):
   
    @transaction.atomic
    def create_or_update_referral(is_referral, referral_source, referral_doctor_instance, register_type, register_id, newdata, created_by):
        if is_referral == 'Yes':
            try:
               
                if register_id:
                    filters = {
                        'IP': 'IP_Register_Id__pk',
                    }
                    filter_key = filters.get(register_type)
                    if not filter_key:
                        raise ValueError("Invalid register_type provided.")
                    if Patient_Referral_Detials.objects.filter(**{filter_key: register_id}).exists():
                        referral = Patient_Referral_Detials.objects.get(**{filter_key: register_id})
                        referral.ReferralSource = referral_source
                        referral.ReferredBy = referral_doctor_instance
                        referral.save()
                    else:
                        Patient_Referral_Detials.objects.create(
                            **{
                                'IP_Register_Id': newdata if register_type == 'IP' else None,
                            },
                            ReferralRegisteredBy=register_type,
                            ReferralSource=referral_source,
                            ReferredBy=referral_doctor_instance,
                            created_by=created_by
                        )
                   
                else:
                    Patient_Referral_Detials.objects.create(
                        **{
                            'IP_Register_Id': newdata if register_type == 'IP' else None,
                        },
                        ReferralRegisteredBy=register_type,
                        ReferralSource=referral_source,
                        ReferredBy=referral_doctor_instance,
                        created_by=created_by
                    )
            except ValueError as e:
                # Handle invalid register_type
                pass
   
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'data')
            register_Id = data.get('RegistrationId', '')
            register_type = data.get('RegisterType', '')
            patient = data.get('PatientId', '')
            Speciality = data.get('Speciality', '')
            doctor_name = data.get('DoctorName', '')
            complaint = data.get('Complaint', '')
            is_mlc = data.get('IsMLC', 'No')
            # flagging = data.get('Flagging', '')
            is_referral = data.get('IsReferral', 'No')
            ReferralSource = data.get('ReferralSource', '')
            ReferredBy = data.get('ReferredBy', '')
            AdmissionPurpose = data.get('AdmissionPurpose','')
            DrInchargeatTimeofAdmission = data.get('DrInchargeAtTimeOfAdmission','')
            NexttokinName = data.get('NextToKinName','')
            relation = data.get('Relation','')
            relativePhoneno = data.get('RelativePhoneNo','')
            personLiableforpayment = data.get('PersonLiableForBillPayment','')
            PersonLiablecontactno = data.get('PersonLiablecontactno','')
            visitDate = data.get('visitDate','')
            visitTime = data.get('visitTime','')
            familyhead = data.get('FamilyHead','')
            familyheadName = data.get('FamilyHeadName','')
            ipKitGiven = data.get('IpKitGiven','No')
            created_by = data.get('Created_by', '')
            Location_Id = data.get('Location', None)
            RoomId = data.get('RoomId', '')
 
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

            VisitDateTime = data.get('VisitDateTime','')

            selectedDate = data.get('selectedDate')

            print(selectedDate,'VisitDateTimeeeeeeeeeeeeeeeee')

           

            if selectedDate:
                dt = datetime.fromisoformat(selectedDate.replace("Z", "+00:00"))

                # If USE_TZ = False → strip timezone info
                if dt.tzinfo is not None:
                    dt = dt.replace(tzinfo=None)

                selectedDate = dt
            else:
                selectedDate = None

            
 
            patient_ins = Patient_Detials.objects.get(PatientId=patient) if patient else None
            
            specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
            doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
            DrInchargeatTimeofAdmission_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DrInchargeatTimeofAdmission) if DrInchargeatTimeofAdmission else None
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
            location_instance = Location_Detials.objects.get(Location_Id=Location_Id) if Location_Id else None
            roomid_instance = Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None
            # Flagging_instance = Flaggcolor_Detials.objects.get(Flagg_Id=flagging) if flagging else None
           
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            # Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
            # Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
            # Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
            # Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
           
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
            
            
            
            # print(Client_instance,'Client_instanceqqqqqqqqqqq')
 
            if register_Id :
               
                ip_details = Patient_IP_Registration_Detials.objects.get(pk=register_Id)
                print(ip_details,'ip_details')
               
                ip_details.Specialization=specialization_instance  
                ip_details.PrimaryDoctor=doctor_name_instance
                ip_details.Complaint=complaint  
                ip_details.IsMLC=is_mlc  
                # ip_details.Flagging=Flagging_instance  
                ip_details.IsReferral=is_referral
 
 
 
                ip_details.PatientCategory = patient_category
                ip_details.InsuranceName = Insurance_instance if Insurance_instance else None
                ip_details.InsuranceType = insurance_type
                ip_details.ClientName = Client_instance if Client_instance else None
                ip_details.ClientType = client_type
                ip_details.ClientEmployeeId = client_employee_id
                ip_details.ClientEmployeeDesignation = client_employee_designation
                ip_details.ClientEmployeeRelation = client_employee_relation
               
                ip_details.CorporateName = Corporate_instance if Corporate_instance else None
                ip_details.CorporateType = CorporateType
                ip_details.CorporateEmployeeId = CorporateEmployeeId
                ip_details.CorporateEmployeeDesignation = CorporateEmployeeDesignation
                ip_details.CorporateEmployeeRelation = CorporateEmployeeRelation
 
                ip_details.EmployeeId = employee_instance if employee_instance else None
                ip_details.EmployeeRelation = employee_relation
                ip_details.DoctorId = doctor_instance if doctor_instance else None
                ip_details.DoctorRelation = doctor_relation
                ip_details.DonationType = Donation_instance if Donation_instance else None
                ip_details.updated_by = created_by
                ip_details.save()
               
                ip_admission = Patient_Admission_Detials.objects.get(IP_Registration_Id__pk = ip_details.pk)
                ip_admission.AdmissionPurpose = AdmissionPurpose
                ip_admission.DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance
                ip_admission.NextToKinName = NexttokinName
                ip_admission.Relation = relation
                ip_admission.RelativePhoneNo = relativePhoneno
                ip_admission.PersonLiableForPayment = personLiableforpayment
                ip_admission.PersonLiablecontactno = PersonLiablecontactno
                # ip_admission.visitDate = visitDate
                # ip_admission.visitTime = visitTime
                ip_admission.FamilyHead = familyhead
                ip_admission.FamilyHeadName = familyheadName
                ip_admission.IpKitGiven = ipKitGiven
                ip_admission.updated_by = created_by
                # ip_admission.created_at = selectedDate

                ip_admission.save()
               
                create_or_update_referral(is_referral,ReferralSource,referral_doctor_instance,register_type,register_Id,ip_details,created_by)
               
                return JsonResponse({'success': 'IP Patient Detials Updated Successfully'})
            else:    

                prevadmission = Patient_IP_Registration_Detials.objects.filter(
                        PatientId = patient,
                        Status__in = ['Pending','Admitted']
            
                            ).order_by('-created_at').first()

                if  prevadmission:
        
                        datalist = [{
                        'Doctor' : prevadmission.PrimaryDoctor.Doctor_ID if prevadmission.PrimaryDoctor else None,
                        'DoctorName' : f"""{prevadmission.PrimaryDoctor.Tittle.Title_Name}.{prevadmission.PrimaryDoctor.First_Name}""",
                        'Specialization' : prevadmission.Specialization.Speciality_Name if prevadmission.Specialization else None
                        }]
            
                        return JsonResponse({
                            'warn': f"The Patient Already Admitted in {prevadmission.Specialization.Speciality_Name}"
                        })
               
                print('NewwwwwReggggg')
                Patient_IP = Patient_IP_Registration_Detials.objects.create(
                    PatientId = patient_ins,
                    Specialization=specialization_instance,
                    PrimaryDoctor=doctor_name_instance,
                    Complaint=complaint,
                    IsMLC=is_mlc,
                    # Flagging=Flagging_instance,
                    IsReferral=is_referral,
                    # ReferralSource=ReferralSource,
                    # ReferredBy=ReferredBy,
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
                    created_by=created_by,
                    Location=location_instance,
                    created_at = selectedDate
 
                )
                print('333333333333333333')


                patient_details = Patient_Detials.objects.get(PatientId=patient)
                patient_details.Status = 'Registered'
                patient_details.save()

                print('111--------jjjjjjjjj')
                
                OpToIp_instance = None
                Emg_patient_details = None
                
                print('222--------jjjjjjjjj')

                if Op_to_Ip_Convertion_Table.objects.filter(Patient_Id__PatientId=patient).exists():
                    OpToIp_instance = Op_to_Ip_Convertion_Table.objects.get(Patient_Id__PatientId=patient)
                else:
                    print(f"No record found for patient {patient}")

                # OpToIp_instance = Op_to_Ip_Convertion_Table.objects.get(Patient_Id__PatientId =patient)
                
            
                print('333--------jjjjjjjjj')
                if OpToIp_instance is not None:
                    OpToIp_instance.Status = 'OpToIpRegistered'
                    OpToIp_instance.save()
                    print('444--------jjjjjjjjj')
                else:
                    print("OpToIp_instance is None, cannot update Status.")


                print(OpToIp_instance,'OpToIp_instance-----------j')
                print(Op_to_Ip_Convertion_Table.objects.all(),'11-------jjjj---------qqqqqqqq')

                print('555--------jjjjjjjjj')

                if Emg_to_IP_Convertion_Table.objects.filter(Patient_Id__PatientId=patient, Status='Pending').exists():
                    Emg_patient_details = Emg_to_IP_Convertion_Table.objects.filter(Patient_Id__PatientId=patient, Status='Pending').first()
                else:
                    print(f"No record found for patient {patient}")
                    Emg_patient_details = None  # Explicitly set to None for clarity

                if Emg_patient_details is not None:
                    Emg_patient_details.Status = 'Completed'
                    Emg_patient_details.save()
                    print('666--------jjjjjjjjj')
                else:
                    print("Emg_patient_details is None, cannot update Status.")

                print(Emg_patient_details, 'Emg_patient_details---------')

                
                try:
 
                    visitDate = None if visitDate == '' else visitDate
                    visitTime = None if visitTime == '' else visitTime
 
                   
               
                    Patient_Admission_Detials.objects.create(
                        IP_Registration_Id = Patient_IP,
                        AdmissionPurpose = AdmissionPurpose,
                        DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance,
                        NextToKinName = NexttokinName,
                        Relation = relation,
                        RelativePhoneNo = relativePhoneno,
                        PersonLiableForPayment = personLiableforpayment,
                        PersonLiablecontactno = PersonLiablecontactno,
                        visitDate = visitDate,
                        visitTime = visitTime,
                        FamilyHead = familyhead,
                        FamilyHeadName = familyheadName,
                        IpKitGiven = ipKitGiven,
                    )
             
                   
                except Exception as e:
                    print(f"""Error while creating Patient_Admission_Detials:""", str(e))
               




                
                print('444444444444444444')
               
              
                   
                try:
                   
                    Patient_Admission_Room_Detials.objects.create(
                        RegisterType = register_type,
                        IP_Registration_Id = Patient_IP,
                        Casuality_Registration_Id = None,
                        RoomId = roomid_instance,
                        created_by=created_by
                    )
 
                except Exception as e:
                    print(f"""Error while creating Patient_Admission_Room_Detials:""", str(e))
 

                print('666666666666')
                print('666666666666',patient_ins)
                
                

                print('77777777777777777')


                create_or_update_referral(is_referral,ReferralSource,referral_doctor_instance,register_type,register_Id,Patient_IP,created_by)
               
                return JsonResponse({'success': 'Patient Admitted successfully'})
                       
        except Exception as e:
            return JsonResponse({'error': str(e)})
 



# @csrf_exempt
# @transaction.atomic()
# @require_http_methods(['POST','GET'])
# def IP_Patient_Registration_Details_Link(request):
   
#     @transaction.atomic
#     def create_or_update_referral(is_referral, referral_source, referral_doctor_instance, register_type, register_id, newdata, created_by):
#         if is_referral == 'Yes':
#             try:
               
#                 if register_id:
#                     filters = {
#                         'IP': 'IP_Register_Id__pk',
#                     }
#                     filter_key = filters.get(register_type)
#                     if not filter_key:
#                         raise ValueError("Invalid register_type provided.")
#                     if Patient_Referral_Detials.objects.filter(**{filter_key: register_id}).exists():
#                         referral = Patient_Referral_Detials.objects.get(**{filter_key: register_id})
#                         referral.ReferralSource = referral_source
#                         referral.ReferredBy = referral_doctor_instance
#                         referral.save()
#                     else:
#                         Patient_Referral_Detials.objects.create(
#                             **{
#                                 'IP_Register_Id': newdata if register_type == 'IP' else None,
#                             },
#                             ReferralRegisteredBy=register_type,
#                             ReferralSource=referral_source,
#                             ReferredBy=referral_doctor_instance,
#                             created_by=created_by
#                         )
                   
#                 else:
#                     Patient_Referral_Detials.objects.create(
#                         **{
#                             'IP_Register_Id': newdata if register_type == 'IP' else None,
#                         },
#                         ReferralRegisteredBy=register_type,
#                         ReferralSource=referral_source,
#                         ReferredBy=referral_doctor_instance,
#                         created_by=created_by
#                     )
#             except ValueError as e:
#                 # Handle invalid register_type
#                 pass
   
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print(data,'data')
#             register_Id = data.get('RegistrationId', '')
#             register_type = data.get('RegisterType', '')
#             patient = data.get('PatientId', '')
#             Speciality = data.get('Speciality', '')
#             doctor_name = data.get('DoctorName', '')
#             complaint = data.get('Complaint', '')
#             is_mlc = data.get('IsMLC', 'No')
#             # flagging = data.get('Flagging', '')
#             is_referral = data.get('IsReferral', 'No')
#             ReferralSource = data.get('ReferralSource', '')
#             ReferredBy = data.get('ReferredBy', '')
#             AdmissionPurpose = data.get('AdmissionPurpose','')
#             DrInchargeatTimeofAdmission = data.get('DrInchargeAtTimeOfAdmission','')
#             NexttokinName = data.get('NextToKinName','')
#             relation = data.get('Relation','')
#             relativePhoneno = data.get('RelativePhoneNo','')
#             personLiableforpayment = data.get('PersonLiableForBillPayment','')
#             PersonLiablecontactno = data.get('PersonLiablecontactno','')
#             visitDate = data.get('visitDate','')
#             visitTime = data.get('visitTime','')
#             familyhead = data.get('FamilyHead','')
#             familyheadName = data.get('FamilyHeadName','')
#             ipKitGiven = data.get('IpKitGiven','No')
#             created_by = data.get('Created_by', '')
#             Location_Id = data.get('Location', None)
#             RoomId = data.get('RoomId', '')
 
#             patient_category = data.get('PatientCategory', '')
#             insurance_name = data.get('InsuranceName', '')
#             insurance_type = data.get('InsuranceType', '')
           
#             client_name = data.get('ClientName', '')
#             client_type = data.get('ClientType', '')
#             client_employee_id = data.get('ClientEmployeeId', '')
#             client_employee_designation = data.get('ClientEmployeeDesignation', '')
#             client_employee_relation = data.get('ClientEmployeeRelation', '')
           
#             CorporateName = data.get('CorporateName', '')
#             CorporateType = data.get('CorporateType', '')
#             CorporateEmployeeId = data.get('CorporateEmployeeId', '')
#             CorporateEmployeeDesignation = data.get('CorporateEmployeeDesignation', '')
#             CorporateEmployeeRelation = data.get('CorporateEmployeeRelation', '')
           
#             employee_id = data.get('EmployeeId', '')
#             employee_relation = data.get('EmployeeRelation', '')
           
#             doctor_id = data.get('DoctorId', '')
#             doctor_relation = data.get('DoctorRelation', '')
           
#             donation_type = data.get('DonationType', '')

#             VisitDateTime = data.get('VisitDateTime','')
#             selectedDate = data.get('selectedDate')

#             # Handle date parsing safely
#             parsed_visitDate = None
#             if visitDate:
#                 try:
#                     # Try to parse visitDate in YYYY-MM-DD format
#                     parsed_visitDate = datetime.strptime(visitDate, '%Y-%m-%d').date()
#                 except (ValueError, TypeError):
#                     # If parsing fails, set to None or handle appropriately
#                     parsed_visitDate = None
#                     print(f"Invalid visitDate format: {visitDate}. Expected YYYY-MM-DD")

#             # Handle selectedDate parsing
#             parsed_selectedDate = None
#             if selectedDate:
#                 try:
#                     # Remove timezone info if present and parse
#                     if "Z" in selectedDate or "+" in selectedDate:
#                         dt = datetime.fromisoformat(selectedDate.replace("Z", "+00:00"))
#                         if dt.tzinfo is not None:
#                             dt = dt.replace(tzinfo=None)
#                         parsed_selectedDate = dt
#                     else:
#                         # Try to parse as simple date string
#                         parsed_selectedDate = datetime.strptime(selectedDate, '%Y-%m-%d')
#                 except (ValueError, TypeError) as e:
#                     parsed_selectedDate = None
#                     print(f"Invalid selectedDate format: {selectedDate}. Error: {str(e)}")

#             patient_ins = Patient_Detials.objects.get(PatientId=patient) if patient else None
            
#             specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
#             doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
#             DrInchargeatTimeofAdmission_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DrInchargeatTimeofAdmission) if DrInchargeatTimeofAdmission else None
#             referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
#             location_instance = Location_Detials.objects.get(Location_Id=Location_Id) if Location_Id else None
#             roomid_instance = Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None
            
#             employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
#             doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            
#             Insurance_instance = None
#             if insurance_name:
#                 Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name)
            
#             Client_instance = None
#             if client_name:
#                 Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name)
           
#             Donation_instance = None
#             if donation_type:
#                 Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type)
           
#             Corporate_instance = None
#             if CorporateName:
#                 Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName)
            
#             if register_Id:
#                 ip_details = Patient_IP_Registration_Detials.objects.get(pk=register_Id)
#                 print(ip_details,'ip_details')
               
#                 ip_details.Specialization=specialization_instance  
#                 ip_details.PrimaryDoctor=doctor_name_instance
#                 ip_details.Complaint=complaint  
#                 ip_details.IsMLC=is_mlc  
#                 ip_details.IsReferral=is_referral
#                 ip_details.PatientCategory = patient_category
#                 ip_details.InsuranceName = Insurance_instance if Insurance_instance else None
#                 ip_details.InsuranceType = insurance_type
#                 ip_details.ClientName = Client_instance if Client_instance else None
#                 ip_details.ClientType = client_type
#                 ip_details.ClientEmployeeId = client_employee_id
#                 ip_details.ClientEmployeeDesignation = client_employee_designation
#                 ip_details.ClientEmployeeRelation = client_employee_relation
               
#                 ip_details.CorporateName = Corporate_instance if Corporate_instance else None
#                 ip_details.CorporateType = CorporateType
#                 ip_details.CorporateEmployeeId = CorporateEmployeeId
#                 ip_details.CorporateEmployeeDesignation = CorporateEmployeeDesignation
#                 ip_details.CorporateEmployeeRelation = CorporateEmployeeRelation
 
#                 ip_details.EmployeeId = employee_instance if employee_instance else None
#                 ip_details.EmployeeRelation = employee_relation
#                 ip_details.DoctorId = doctor_instance if doctor_instance else None
#                 ip_details.DoctorRelation = doctor_relation
#                 ip_details.DonationType = Donation_instance if Donation_instance else None
#                 ip_details.updated_by = created_by
                
#                 # Only update created_at if parsed_selectedDate is valid
#                 if parsed_selectedDate:
#                     ip_details.created_at = parsed_selectedDate
                
#                 ip_details.save()
               
#                 ip_admission = Patient_Admission_Detials.objects.get(IP_Registration_Id__pk = ip_details.pk)
#                 ip_admission.AdmissionPurpose = AdmissionPurpose
#                 ip_admission.DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance
#                 ip_admission.NextToKinName = NexttokinName
#                 ip_admission.Relation = relation
#                 ip_admission.RelativePhoneNo = relativePhoneno
#                 ip_admission.PersonLiableForPayment = personLiableforpayment
#                 ip_admission.PersonLiablecontactno = PersonLiablecontactno
#                 # ip_admission.visitDate = parsed_visitDate  # Use parsed date
#                 # ip_admission.visitTime = visitTime
#                 ip_admission.FamilyHead = familyhead
#                 ip_admission.FamilyHeadName = familyheadName
#                 ip_admission.IpKitGiven = ipKitGiven
#                 ip_admission.updated_by = created_by
#                 ip_admission.save()
               
#                 create_or_update_referral(is_referral,ReferralSource,referral_doctor_instance,register_type,register_Id,ip_details,created_by)
               
#                 return JsonResponse({'success': 'IP Patient Detials Updated Successfully'})
#             else:    
               
#                 print('NewwwwwReggggg')
#                 Patient_IP = Patient_IP_Registration_Detials.objects.create(
#                     PatientId = patient_ins,
#                     Specialization=specialization_instance,
#                     PrimaryDoctor=doctor_name_instance,
#                     Complaint=complaint,
#                     IsMLC=is_mlc,
#                     IsReferral=is_referral,
#                     PatientCategory = patient_category,
#                     InsuranceName = Insurance_instance,
#                     InsuranceType = insurance_type,
#                     ClientName = Client_instance,
#                     ClientType = client_type,
#                     ClientEmployeeId = client_employee_id,
#                     ClientEmployeeDesignation = client_employee_designation,
#                     ClientEmployeeRelation = client_employee_relation,
                   
#                     CorporateName = Corporate_instance,
#                     CorporateType = CorporateType,
#                     CorporateEmployeeId = CorporateEmployeeId,
#                     CorporateEmployeeDesignation = CorporateEmployeeDesignation,
#                     CorporateEmployeeRelation = CorporateEmployeeRelation,
 
#                     EmployeeId = employee_instance,
#                     EmployeeRelation = employee_relation,
#                     DoctorId = doctor_instance,
#                     DoctorRelation = doctor_relation,
#                     DonationType = Donation_instance,
#                     created_by=created_by,
#                     Location=location_instance,
#                     created_at=parsed_selectedDate  # Use parsed date
#                 )

#                 patient_details = Patient_Detials.objects.get(PatientId=patient)
#                 patient_details.Status = 'Registered'
#                 patient_details.save()
                
#                 OpToIp_instance = None
#                 Emg_patient_details = None
                
#                 if Op_to_Ip_Convertion_Table.objects.filter(Patient_Id__PatientId=patient).exists():
#                     OpToIp_instance = Op_to_Ip_Convertion_Table.objects.get(Patient_Id__PatientId=patient)
                
#                 if OpToIp_instance is not None:
#                     OpToIp_instance.Status = 'OpToIpRegistered'
#                     OpToIp_instance.save()

#                 if Emg_to_IP_Convertion_Table.objects.filter(Patient_Id__PatientId=patient, Status='Pending').exists():
#                     Emg_patient_details = Emg_to_IP_Convertion_Table.objects.filter(Patient_Id__PatientId=patient, Status='Pending').first()

#                 if Emg_patient_details is not None:
#                     Emg_patient_details.Status = 'Completed'
#                     Emg_patient_details.save()

#                 try:
#                     Patient_Admission_Detials.objects.create(
#                         IP_Registration_Id = Patient_IP,
#                         AdmissionPurpose = AdmissionPurpose,
#                         DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance,
#                         NextToKinName = NexttokinName,
#                         Relation = relation,
#                         RelativePhoneNo = relativePhoneno,
#                         PersonLiableForPayment = personLiableforpayment,
#                         PersonLiablecontactno = PersonLiablecontactno,
#                         visitDate = parsed_visitDate,  # Use parsed date
#                         visitTime = visitTime,
#                         FamilyHead = familyhead,
#                         FamilyHeadName = familyheadName,
#                         IpKitGiven = ipKitGiven,
#                     )
#                 except Exception as e:
#                     print(f"Error while creating Patient_Admission_Detials:", str(e))
                
#                 Patient_Admission_Room_Detials.objects.create(
#                     RegisterType = register_type,
#                     IP_Registration_Id = Patient_IP,
#                     Casuality_Registration_Id = None,
#                     RoomId = roomid_instance,
#                     created_by=created_by
#                 )

#                 create_or_update_referral(is_referral,ReferralSource,referral_doctor_instance,register_type,register_Id,Patient_IP,created_by)
               
#                 return JsonResponse({'success': 'Patient Admitted successfully'})
                       
#         except Exception as e:
#             return JsonResponse({'error': str(e)})



#--------------------jeeva-----> dont change the code -------------------

   

@csrf_exempt
@require_http_methods(["GET"])
def get_ip_Patient_registration_details_for_workbench(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        DoctorId = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
        WardName = request.GET.get('WardName')
        
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        limit = int(request.GET.get('limit', 10))  # Default limit of 10 if not provided
 
        # Map status to Booking_Status
        Booking_Status = (
            'Booked' if status == 'Pending' else
            'Occupied' if status == 'Admitted' else
            'Vacated' if status == 'Completed' else
            'Cancelled'
        )
 
        # Start with all records
        queryset = Patient_IP_Registration_Detials.objects.all()
        

        # Apply filters only if provided
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )
 
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=DoctorId)
        
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=Doctor)

        if status:  # Only apply status filter if provided
            queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=Booking_Status))
 
        # Apply date filters only if parameters are provided
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        elif Current_date:
            queryset = queryset.filter(created_at__date=Current_date)
        
        if WardName:
            room_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id=WardName
            )
            registration_ids = room_details_qs.values_list('IP_Registration_Id', flat=True)
            print(registration_ids,'registration_ids')
            queryset = queryset.filter(Registration_Id__in=registration_ids)
        
        print(queryset,'queryset----registration_ids')
        

        ip_register_data = []

        for idx, register in enumerate(queryset, start=1):
            BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                'Gender': register.PatientId.Gender,
                'UHID':register.PatientId.UniqueIdNo if register.PatientId.UniqueIdNo else None,
                'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
            }
 
            if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
                roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).last()
                if roomdetials:
                    appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
                    appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
                    appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
                    appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
                    appointment_dict['WardId'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Id if roomdetials.RoomId else None
                    appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
                    appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
                    appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials else None
 
            ip_register_data.append(appointment_dict)
        
        count_filters = {}
        if Current_date:
            count_filters['created_at__date'] = Current_date
        
        if from_date and to_date:
            count_filters['created_at__date__range'] = [from_date, to_date]
        
        if particular_date:
            count_filters['created_at__date'] = particular_date
         
        if Doctor:
            count_filters['PrimaryDoctor__Doctor_ID'] = Doctor

        # Total_IP_Count = queryset.filter(**count_filters).count()    

        count_queryset =  Patient_IP_Registration_Detials.objects.filter(
           **count_filters
        )  

        if WardName:
            ward_room_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id=WardName
            )
            registration_ids = ward_room_qs.values_list('IP_Registration_Id', flat=True)
            count_queryset = count_queryset.filter(Registration_Id__in=registration_ids)

        Total_IP_Count = count_queryset.count()

        # Total_IP_Count = queryset.count()
        
        # return JsonResponse({
        #     'appointments': ip_register_data,
        #     'today_Admitted_IP_count': today_Admitted_IP_count,
        #     'monthly_Admitted_IP_count': monthly_Admitted_IP_count,
        #     'yearly_Admitted_IP_count': yearly_Admitted_IP_count,
        #     'today_Discharged_IP_count': today_Discharged_IP_count,
        #     'monthly_Discharged_IP_count': monthly_Discharged_IP_count,
        #     'yearly_Discharged_IP_count': yearly_Discharged_IP_count,
        # }, safe=False)
    
        return JsonResponse({
            'appointments': ip_register_data,
            'Total_IP_Count': Total_IP_Count
        }, safe=False)
    

        # return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
   




 
@csrf_exempt
@require_http_methods(["GET"])
def Total_IP_Patients_List(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        DoctorId = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
        User = request.GET.get('User', '')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        limit = int(request.GET.get('limit', 10))  # Default limit of 10 if not provided
 
        # Map status to Booking_Status
        Booking_Status = (
            'Booked' if status == 'Pending' else
            'Occupied' if status == 'Admitted' else
            'Vacated' if status == 'Completed' else
            'Cancelled'
        )
 
        # Start with all records
        queryset = Patient_IP_Registration_Detials.objects.all().order_by('-created_at')
        # queryset = Patient_IP_Registration_Detials.objects.all()
 
        # Apply filters only if provided
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )
 
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__pk=DoctorId)
       
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__pk=Doctor)
 
        if status:  # Only apply status filter if provided
            queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=Booking_Status))
 
        # if User:
        #     queryset = queryset.filter(created_by=User)
 
        # Apply date filters only if parameters are provided
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        elif Current_date:
            queryset = queryset.filter(created_at__date=Current_date)
 
        # Apply limit to queryset
        # queryset = queryset[:limit]
 
        # Serialize the data
 
        today = date.today()
        current_year = today.year
        current_month = today.month

        if User not in ['host','admin','RENEESHA','SUJANA','RUBEENA','ABHISHEK','LIBI','AKSHAYA','SHAFLA']:

 
            today_Admitted_IP_count = Patient_IP_Registration_Detials.objects.filter(created_at__date=today,Status='Admitted').count()
        
            monthly_Admitted_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Admitted'
                
            ).count()
    
            yearly_Admitted_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
    
            today_Discharged_IP_count = Patient_IP_Registration_Detials.objects.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed',
                
            ).count()
            yearly_Discharged_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,Status='Completed',
               
            ).count()
    


        else:


            today_Admitted_IP_count = Patient_IP_Registration_Detials.objects.filter(created_at__date=today,Status='Admitted').count()
        
            monthly_Admitted_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Admitted'
                
            ).count()
    
            yearly_Admitted_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,Status='Admitted',created_by=User
            ).count()
    
            today_Discharged_IP_count = Patient_IP_Registration_Detials.objects.filter(created_at__date=today,Status='Completed',created_by=User).count()
            monthly_Discharged_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed',
                created_by=User
            ).count()
            yearly_Discharged_IP_count = Patient_IP_Registration_Detials.objects.filter(
                created_at__year=current_year,Status='Completed',
                created_by=User
            ).count()
    


        
        ip_register_data = []
        for idx, register in enumerate(queryset, start=1):
            BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None
            formatted_bdate = register.created_at.strftime('%d-%m-%y')
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name + '.' if register.PatientId.Title else ''}{register.PatientId.FirstName or ''} {register.PatientId.MiddleName or ''} {register.PatientId.SurName or ''}".strip(),
                # 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                'Gender': register.PatientId.Gender,
                'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'created_by': register.created_by if register else '',
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'Street': register.PatientId.PermanentStreet or register.PatientId.Street or '',
                'Area': register.PatientId.PermanentArea or register.PatientId.Area or '',
                'City': register.PatientId.PermanentCity or register.PatientId.City or '',
                'District': register.PatientId.PermanentDistrict or register.PatientId.District or '',
                'State': register.PatientId.PermanentState or register.PatientId.State or '',
                'Country': register.PatientId.PermanentCountry or register.PatientId.Country or '',
                'Pincode': register.PatientId.PermanentPincode or register.PatientId.Pincode or '',
                'Address': f"{register.PatientId.Street} {register.PatientId.Area}",
                'created_at': formatted_bdate,
                'created_time': register.created_at,
                # 'created_time': register.created_at.isoformat() if register.created_at else None,
           
            }
            print(appointment_dict,'appointment_dict')
 
            if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
                roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_by').first()
                if roomdetials:
                    appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
                    appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
                    appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
                    appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
                    appointment_dict['WardId'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Id if roomdetials.RoomId else None
                    appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
                    appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
                    appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials else None
 
            ip_register_data.append(appointment_dict)
 
       
        return JsonResponse({
            'appointments': ip_register_data,
            'today_Admitted_IP_count': today_Admitted_IP_count,
            'monthly_Admitted_IP_count': monthly_Admitted_IP_count,
            'yearly_Admitted_IP_count': yearly_Admitted_IP_count,
            'today_Discharged_IP_count': today_Discharged_IP_count,
            'monthly_Discharged_IP_count': monthly_Discharged_IP_count,
            'yearly_Discharged_IP_count': yearly_Discharged_IP_count,
        }, safe=False)
   
        # return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
   
  
 

#--------------------jeeva-----> dont change the code -------------------


@csrf_exempt
@require_http_methods(["GET"])
def get_IP_Registration_edit_details(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', None)
        # RegistrationType = request.GET.get('RegistrationType', None)
        print(RegistrationId,'RegistrationId3333333333')
        IP_Patient = Patient_IP_Registration_Detials.objects.filter(pk = RegistrationId).first() if RegistrationId else None
        admission_instance = Patient_Admission_Detials.objects.filter(IP_Registration_Id__pk = RegistrationId).first() if RegistrationId else None
        admission_room_instance = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__pk = RegistrationId).first() if RegistrationId else None
        # referral_instance = Patient_Referral_Detials.objects.get(IP_Register_Id__pk = RegistrationId)
        print(IP_Patient,'IP_Patient')
        print(admission_instance,'admission_instance111111111')
        print(admission_room_instance,'admission_room_instance')
       
        referral_details = None

        # Check for referral details by OP, IP, and Emergency Register IDs
        try:
            referral_details = Patient_Referral_Detials.objects.filter(
                OP_Register_Id__Registration_Id=RegistrationId
            ).first() or Patient_Referral_Detials.objects.filter(
                IP_Register_Id__Registration_Id=RegistrationId
            ).first() or Patient_Referral_Detials.objects.filter(
                Emergency_Register_Id__Registration_Id=RegistrationId
            ).first()
        except Patient_Referral_Detials.DoesNotExist:
            referral_details = None

        # print(referral_instance,'referral_instance')
        # print(admission_instance.AdmissionPurpose,'admission_instance.AdmissionPurpose22222222222')
        
        
        Registration_dict = {
            'Title': IP_Patient.PatientId.Title.Title_Id if IP_Patient.PatientId.Title else None,
            'PatientId': IP_Patient.PatientId.PatientId if IP_Patient.PatientId else "",
            'FirstName': IP_Patient.PatientId.FirstName if IP_Patient.PatientId else "",
            'MiddleName': IP_Patient.PatientId.MiddleName if IP_Patient.PatientId else "",
            'SurName': IP_Patient.PatientId.SurName if IP_Patient.PatientId else "",
            'Gender': IP_Patient.PatientId.Gender if IP_Patient.PatientId else "",
            'MaritalStatus': IP_Patient.PatientId.MaritalStatus if IP_Patient.PatientId else "",
            'SpouseName': IP_Patient.PatientId.SpouseName if IP_Patient.PatientId else "",
            'FatherName': IP_Patient.PatientId.FatherName if IP_Patient.PatientId else "",
            'DOB': IP_Patient.PatientId.DOB if IP_Patient.PatientId else "",
            'Age': IP_Patient.PatientId.Age if IP_Patient.PatientId else "",
            'PhoneNo': IP_Patient.PatientId.PhoneNo if IP_Patient.PatientId else "",
            'Email': IP_Patient.PatientId.Email if IP_Patient.PatientId else "",
            'BloodGroup': IP_Patient.PatientId.BloodGroup.BloodGroup_Id if IP_Patient.PatientId.BloodGroup else None,
            'Occupation': IP_Patient.PatientId.Occupation if IP_Patient.PatientId else "",
            'Religion': IP_Patient.PatientId.Religion.Religion_Id if IP_Patient.PatientId.Religion else None,
            'ReligionName': IP_Patient.PatientId.Religion.Religion_Name if IP_Patient.PatientId.Religion else None,
            'Nationality': IP_Patient.PatientId.Nationality if IP_Patient.PatientId else "",
            'UniqueIdType': IP_Patient.PatientId.UniqueIdType if IP_Patient.PatientId else "",
            'UniqueIdNo': IP_Patient.PatientId.UniqueIdNo if IP_Patient.PatientId else "",
            'PatientType': IP_Patient.PatientId.PatientType if IP_Patient.PatientId else "",
            'DoorNo': IP_Patient.PatientId.DoorNo if IP_Patient.PatientId else "",
            'Street': IP_Patient.PatientId.Street if IP_Patient.PatientId else "",
            'Area': IP_Patient.PatientId.Area if IP_Patient.PatientId else "",
            'City': IP_Patient.PatientId.City if IP_Patient.PatientId else "",
            'State': IP_Patient.PatientId.State if IP_Patient.PatientId else "",
            'Country': IP_Patient.PatientId.Country if IP_Patient.PatientId else "",
            'Pincode': IP_Patient.PatientId.Pincode if IP_Patient.PatientId else "",
            'ABHA': IP_Patient.PatientId.ABHA if IP_Patient.PatientId else "",
        
            'Speciality': IP_Patient.Specialization.Speciality_Id if IP_Patient.Specialization else None,
            'DoctorName': f"{IP_Patient.PrimaryDoctor.Tittle.Title_Name if IP_Patient.PrimaryDoctor and IP_Patient.PrimaryDoctor.Tittle else None}.{IP_Patient.PrimaryDoctor.ShortName}" if IP_Patient.PrimaryDoctor else None,
            'PrimaryDoctor': IP_Patient.PrimaryDoctor.Doctor_ID if IP_Patient.PrimaryDoctor else None,
            
            'Complaint': IP_Patient.Complaint,
            'IsMLC': IP_Patient.IsMLC,
            'IsReferral': IP_Patient.IsReferral,
            'PatientCategory': IP_Patient.PatientCategory,
            'InsuranceName': IP_Patient.InsuranceName.Insurance_Id if IP_Patient.InsuranceName else None,
            'InsuranceType': IP_Patient.InsuranceType,
            'ClientName': IP_Patient.ClientName.Client_Id if IP_Patient.ClientName else None,
            'ClientType': IP_Patient.ClientType,
            'ClientEmployeeId': IP_Patient.ClientEmployeeId,
            'ClientEmployeeDesignation': IP_Patient.ClientEmployeeDesignation,
            'ClientEmployeeRelation': IP_Patient.ClientEmployeeRelation,

            'CorporateName': IP_Patient.CorporateName.Corporate_Id if IP_Patient.CorporateName else None,
            'CorporateType': IP_Patient.CorporateType,
            'CorporateEmployeeId': IP_Patient.CorporateEmployeeId,
            'CorporateEmployeeDesignation': IP_Patient.CorporateEmployeeDesignation,
            'CorporateEmployeeRelation': IP_Patient.CorporateEmployeeRelation,
        
            'EmployeeId': IP_Patient.EmployeeId.Employee_ID if IP_Patient.EmployeeId else "",
            'EmployeeRelation': IP_Patient.EmployeeRelation,
            
            'DoctorId': IP_Patient.DoctorId.pk if IP_Patient.DoctorId else "",
            'DoctorRelation': IP_Patient.DoctorRelation,
            'DonationType': IP_Patient.DonationType.Donation_Id if IP_Patient.DonationType else None,

            'AdmissionPurpose': admission_instance.AdmissionPurpose if admission_instance else '',
            'DrInchargeAtTimeOfAdmission': admission_instance.DrInchargeAtTimeOfAdmission.Doctor_ID if admission_instance and admission_instance.DrInchargeAtTimeOfAdmission else '',
            'NextToKinName': admission_instance.NextToKinName if admission_instance else '',
            'Relation': admission_instance.Relation if admission_instance else '',
            'RelativePhoneNo': admission_instance.RelativePhoneNo if admission_instance else '',
            'PersonLiableForBillPayment': admission_instance.PersonLiableForPayment if admission_instance else '',
            'PersonLiablecontactno': admission_instance.PersonLiablecontactno if admission_instance else '',
            'visitDate': admission_instance.visitDate if admission_instance else '',
            'visitTime': admission_instance.visitTime if admission_instance else '',
            
            
            'FamilyHead': admission_instance.FamilyHead if admission_instance else '',
            'FamilyHeadName': admission_instance.FamilyHeadName if admission_instance else '',
            
            'IpKitGiven': admission_instance.IpKitGiven if admission_instance else '',
        
            'IsReferal': IP_Patient.IsReferral,
            'Building': admission_room_instance.RoomId.Building_Name.Building_Id if admission_room_instance.RoomId else None,
            'Block': admission_room_instance.RoomId.Block_Name.Block_Id if admission_room_instance.RoomId else None,
            'Floor': admission_room_instance.RoomId.Floor_Name.Floor_Id if admission_room_instance.RoomId else None,
            'WardType': admission_room_instance.RoomId.Ward_Name.Ward_Name.Ward_Id if admission_room_instance.RoomId else None,
            'RoomNo': admission_room_instance.RoomId.Ward_Name.RoomNo if admission_room_instance.RoomId else None,
            'BedNo': admission_room_instance.RoomId.Bed_No if admission_room_instance.RoomId else None,
        
            'BuildingName': admission_room_instance.RoomId.Building_Name.Building_Name if admission_room_instance.RoomId else None,
            'BlockName': admission_room_instance.RoomId.Block_Name.Block_Name if admission_room_instance.RoomId else None,
            'FloorName': admission_room_instance.RoomId.Floor_Name.Floor_Name if admission_room_instance.RoomId else None,
            'WardTypeName': admission_room_instance.RoomId.Ward_Name.Ward_Name.Ward_Name if admission_room_instance.RoomId else None,
            'RoomId': admission_room_instance.RoomId.Room_Id if admission_room_instance.RoomId else None,
        }
        print('qqqqqqqqqqqqq')


        if referral_details:
            Registration_dict.update({
                'ReferralSource': referral_details.ReferralSource,
                'ReferredBy': referral_details.ReferredBy.Doctor_ID if referral_details.ReferredBy else '',
                'ReferredByShortName': f"{referral_details.ReferredBy.Tittle.Title_Name}.{referral_details.ReferredBy.ShortName}" if referral_details.ReferredBy else '',
                'ReferredByFullname': f"{referral_details.ReferredBy.Tittle.Title_Name}.{referral_details.ReferredBy.First_Name} {referral_details.ReferredBy.Last_Name}" if referral_details.ReferredBy else None,
            })

        print(Registration_dict,'Registration_dict')
        
            
        return JsonResponse(Registration_dict,safe=False)
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)




#--------------------jeeva-----> dont change the code -------------------




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Emergency_Patient_Registration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'data')

            patient_id = data.get('PatientId', '')
            FirstName = data.get('FirstName', '')
            PhoneNumber = data.get('PhoneNumber', '')
            Gender = data.get('Gender', '')
            IdentificationMark1 = data.get('IdentificationMark1', '')
            IdentificationMark2 = data.get('IdentificationMark2', '')
            IsConscious = data.get('IsConscious', '')
            Instructions = data.get('Instructions', '')
            IsMLC = data.get('IsMLC', '')
            DoctorName = data.get('DoctorNAme', '')
            Triage = data.get('Triage', '')
            created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            RoomId = data.get('RoomId', '')
            register_type = data.get('RegisterType', '')



            location_instance = Location_Detials.objects.get(Location_Id=Location) if Location else None
            roomid_instance = Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None

            with transaction.atomic():
                patient = None
                if patient_id:
                    # Validate Patient ID
                    try:
                        patient = Patient_Detials.objects.get(PatientId=patient_id)
                    except Patient_Detials.DoesNotExist:
                        return JsonResponse({'warn': "The Patient ID is not valid"})

                    # Check for duplicate patients if any identifier is provided
                    if FirstName or PhoneNumber:
                        if Patient_Detials.objects.filter(
                            Q(PhoneNo=PhoneNumber) & Q(FirstName=FirstName)
                        ).exclude(PatientId=patient_id).exists():
                            existing_patient = Patient_Detials.objects.filter(
                                Q(PhoneNo=PhoneNumber) & Q(FirstName=FirstName)
                            ).first()
                            return JsonResponse({'warn': f"The Patient {existing_patient.PatientId} is already registered with {PhoneNumber} and {FirstName}"})

                    # Update patient details
                    patient.FirstName = FirstName
                    patient.Gender = Gender
                    patient.PhoneNo = PhoneNumber
                    patient.updated_by = created_by
                    patient.save()

                else:
                    print('Creating new patient')

                    # Check for duplicates only if identifiers are provided
                    if FirstName or PhoneNumber:
                        if Patient_Detials.objects.filter(
                            Q(PhoneNo=PhoneNumber) & Q(FirstName=FirstName)
                        ).exists():
                            existing_patient = Patient_Detials.objects.filter(
                                Q(PhoneNo=PhoneNumber) & Q(FirstName=FirstName)
                            ).first()
                            return JsonResponse({'warn': f"The Patient {existing_patient.PatientId} is already registered with {PhoneNumber} and {FirstName}"})

                    # Create new patient
                    patient = Patient_Detials.objects.create(
                        FirstName=FirstName,
                        Gender=Gender,
                        PhoneNo=PhoneNumber,
                        Status = 'EmgPatientSaved',
                        created_by=created_by
                    )
                    patient.save()



                    # patient_details = Patient_Detials.objects.get(PatientId=patient)
                    # patient_details.Status = 'EmgPatientSaved'
                    # patient_details.save()

                  

                    print(patient, 'patient')

                    # Create Emergency Registration Details
                Emergency = Patient_Emergency_Registration_Detials.objects.create(
                    PatientId=patient,
                    IdentificationMark1=IdentificationMark1,
                    IdentificationMark2=IdentificationMark2,
                    Instructions=Instructions,
                    IsConscious=IsConscious,
                    IsMLC=IsMLC,
                    DoctorName=DoctorName,
                    Triage=Triage,
                    Location=location_instance,
                    created_by=created_by,
                )

                Emergency.save()

                EmgPatientAdmission = Patient_Admission_Room_Detials.objects.create(
                    RegisterType=register_type,
                    Emergency_Registration_Id=Emergency,
                    RoomId=roomid_instance,
                    created_by=created_by
                )
                EmgPatientAdmission.save()


                data['patient_id'] = patient.PatientId
                data['RegistrationId'] = Emergency.Registration_Id
                # return JsonResponse({'success': 'Emergency Patient Details Saved successfully'},safe=False)
                return JsonResponse({'success': 'Emergency Patient Details Saved successfully','data': [data]},safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)})

    elif request.method == 'GET':
        try:
            patient_id = request.GET.get('PatientId')
            if patient_id:
                try:
                    patient = Patient_Detials.objects.get(PatientId=patient_id)
                    return JsonResponse({
                        'id': patient.PatientId,
                        'phoneNo': patient.PhoneNo,
                        'firstName': patient.FirstName,
                        'lastName': patient.SurName,
                    })
                except Patient_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Patient with the given ID does not exist'})
            else:
                patients = list(Patient_Detials.objects.values())
                return JsonResponse(patients, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method'}, status=405)




#--------------------jeeva-----> dont change the code -------------------



@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Emergency_Patient_With_Room_Registration_Details_Link(request):
    
    @transaction.atomic
    def create_or_update_referral(is_referral, referral_source, referral_doctor_instance, register_type, register_id, newdata, created_by):
        if is_referral == 'Yes':
            try:
                if register_id:
                    filters = {
                        'Emergency': 'Emergency_Register_Id__pk',
                    }
                    filter_key = filters.get(register_type)
                    if not filter_key:
                        raise ValueError("Invalid register_type provided.")
                    if Patient_Referral_Detials.objects.filter(**{filter_key: register_id}).exists():
                        referral = Patient_Referral_Detials.objects.get(**{filter_key: register_id})
                        referral.ReferralSource = referral_source
                        referral.ReferredBy = referral_doctor_instance
                        referral.save()
                    else:
                        Patient_Referral_Detials.objects.create(
                            **{
                                'Emergency_Register_Id': newdata if register_type == 'Emergency' else None,
                            },
                            ReferralRegisteredBy=register_type,
                            ReferralSource=referral_source,
                            ReferredBy=referral_doctor_instance,
                            created_by=created_by
                        )
                    
                else:
                    Patient_Referral_Detials.objects.create(
                        **{
                            'Emergency_Register_Id': newdata if register_type == 'Emergency' else None,
                        },
                        ReferralRegisteredBy=register_type,
                        ReferralSource=referral_source,
                        ReferredBy=referral_doctor_instance,
                        created_by=created_by
                    )
            except ValueError as e:
                # Handle invalid register_type
                pass

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extracting all input data
            register_Id = data.get('RegistrationId', '')
            register_type = data.get('RegisterType', '')
            patient = data.get('PatientId', '')
            print(patient,'patienttttttttt')
            Speciality = data.get('Speciality', '')
            doctor_name = data.get('DoctorName', '')
            complaint = data.get('Complaint', '')
            is_mlc = data.get('IsMLC', 'No')
            is_referral = data.get('IsReferral', 'No')
            ReferralSource = data.get('ReferralSource', '')
            ReferredBy = data.get('ReferredBy', '')
            AdmissionPurpose = data.get('AdmissionPurpose', '')
            DrInchargeatTimeofAdmission = data.get('DrInchargeAtTimeOfAdmission', '')
            NexttokinName = data.get('NextToKinName', '')
            relation = data.get('Relation', '')
            relativePhoneno = data.get('RelativePhoneNo', '')
            personLiableforpayment = data.get('PersonLiableForBillPayment', '')
            familyhead = data.get('FamilyHead', '')
            familyheadName = data.get('FamilyHeadName', '')
            ipKitGiven = data.get('IpKitGiven', 'No')
            created_by = data.get('Created_by', '')
            Location_Id = data.get('Location', None)
            RoomId = data.get('RoomId', '')
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

            print(register_Id,'register_Id')

            Title = data.get('Title','')
            FirstName = data.get('FirstName','')
            MiddleName = data.get('MiddleName','')
            SurName = data.get('SurName','')
            Gender = data.get('Gender','')
            MaritalStatus = data.get('MaritalStatus','')
            SpouseName = data.get('SpouseName','')
            FatherName = data.get('FatherName','')
            DOB = data.get('DOB','')
            Age = data.get('Age','')
            PhoneNo = data.get('PhoneNo','')
            Email = data.get('Email','')
            BloodGroup = data.get('BloodGroup','')
            Occupation = data.get('Occupation','')
            Nationality = data.get('Nationality','')
            UHIDType = data.get('UHIDType','')
            UHIDNo = data.get('UHIDNo','')
            PatientType = data.get('PatientType','')
            Pincode = data.get('Pincode','')
            DoorNo = data.get('DoorNo','')
            Street = data.get('Street','')
            Area = data.get('Area','')
            City = data.get('City','')
            District = data.get('District','')
            State = data.get('State','')
            Country = data.get('Country','')
            Religion = data.get('Religion','')
           
            print('patient--------')
            Titleins = Title_Detials.objects.get(Title_Id=Title) if Title else None
            BloodGroupins = BloodGroup_Detials.objects.get(BloodGroup_Id = BloodGroup) if BloodGroup else None
            Religionins = Religion_Detials.objects.get(Religion_Id = Religion) if Religion else None

            # Fetch related objects
            patient_instance = Patient_Detials.objects.get(PatientId=patient) if patient else None
            print(patient_instance,'patient_instance')
            specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
            doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
            DrInchargeatTimeofAdmission_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DrInchargeatTimeofAdmission) if DrInchargeatTimeofAdmission else None
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
            location_instance = Location_Detials.objects.get(Location_Id=Location_Id) if Location_Id else None
            roomid_instance = Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None

            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
            Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
            Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
            Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
            
            # Handle patient emergency registration details
            if register_Id and Patient_Emergency_Registration_Detials.objects.filter(pk=register_Id).exists():
                print('rrrrrrrrrrrrrrrrrrrrrrrrrr')

                ip_details = Patient_Emergency_Registration_Detials.objects.get(pk=register_Id)
                ip_details.Specialization = specialization_instance
                ip_details.PrimaryDoctor = doctor_name_instance
                ip_details.Complaint = complaint
                ip_details.IsMLC = is_mlc
                ip_details.IsReferral = is_referral
                ip_details.PatientCategory = data.get('PatientCategory', '')
                ip_details.InsuranceName = Insurance_instance
                # ip_details.InsuranceName = Insurance_Master_Detials.objects.get(Insurance_Id=data.get('InsuranceName', '')) if data.get('InsuranceName') else None
                ip_details.InsuranceType = insurance_type 
                
                ip_details.ClientName = Client_instance
                # ip_details.ClientName = Client_Master_Detials.objects.get(Client_Id=data.get('ClientName', '')) if data.get('ClientName') else None
                ip_details.ClientType = client_type 
                ip_details.ClientEmployeeId = client_employee_id
                ip_details.ClientEmployeeDesignation = client_employee_designation 
                ip_details.ClientEmployeeRelation = client_employee_relation 
                
                ip_details.CorporateName = Corporate_instance
                # ip_details.CorporateName = Corporate_Master_Detials.objects.get(Corporate_Id=data.get('CorporateName', '')) if data.get('CorporateName') else None
                ip_details.CorporateType = CorporateType 
                ip_details.CorporateEmployeeId = CorporateEmployeeId 
                ip_details.CorporateEmployeeDesignation = CorporateEmployeeDesignation 
                ip_details.CorporateEmployeeRelation = CorporateEmployeeRelation 

                ip_details.EmployeeId = employee_instance
                # ip_details.EmployeeId = Employee_Personal_Form_Detials.objects.get(Employee_ID=data.get('EmployeeId', '')) if data.get('EmployeeId') else None
                ip_details.EmployeeRelation = employee_relation 
                

                ip_details.DoctorId = doctor_instance
                # ip_details.DoctorId = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('DoctorId', '')) if data.get('DoctorId') else None
                ip_details.DoctorRelation = doctor_relation
                
                ip_details.DonationType = Donation_instance
                # ip_details.DonationType = Donation_Master_Detials.objects.get(Donation_Id=data.get('DonationType', '')) if data.get('DonationType') else None
                ip_details.updated_by = created_by
                ip_details.SavedStatus = 'Registered'
                ip_details.save()

                print('33333333333333333')
                patient_details = Patient_Detials.objects.get(PatientId=patient)
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
                # patient.ABHA  = ABHA
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
 
                print('222222222222222')


                # Handle patient admission details
                ip_admission = Patient_Admission_Detials.objects.filter(Emergency_Registration_Id__Registration_Id=ip_details.pk).first()
                if ip_admission is None:
                    ip_admission = Patient_Admission_Detials(
                        Emergency_Registration_Id=ip_details,
                        AdmissionPurpose=AdmissionPurpose,
                        DrInchargeAtTimeOfAdmission=DrInchargeatTimeofAdmission_instance,
                        NextToKinName=NexttokinName,
                        Relation=relation,
                        RelativePhoneNo=relativePhoneno,
                        PersonLiableForPayment=personLiableforpayment,
                        FamilyHead=familyhead,
                        FamilyHeadName=familyheadName,
                        IpKitGiven=ipKitGiven,
                        updated_by=created_by
                    )
                    ip_admission.save()
                else:
                    ip_admission.AdmissionPurpose = AdmissionPurpose
                    ip_admission.DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance
                    ip_admission.NextToKinName = NexttokinName
                    ip_admission.Relation = relation
                    ip_admission.RelativePhoneNo = relativePhoneno
                    ip_admission.PersonLiableForPayment = personLiableforpayment
                    ip_admission.FamilyHead = familyhead
                    ip_admission.FamilyHeadName = familyheadName
                    ip_admission.IpKitGiven = ipKitGiven
                    ip_admission.updated_by = created_by
                    ip_admission.save()

                # patient_details = Patient_Detials.objects.get(PatientId=patient)
                # patient_details.Status = 'Registered'
                # patient_details.save()

                # Referral handling
                create_or_update_referral(is_referral, ReferralSource, referral_doctor_instance, register_type, register_Id, ip_details, created_by)

                return JsonResponse({'success': 'Emergency Patient Details Updated successfully'})

            # For new registrations
            else:
                print('mmmmmmmmmmmmmmmmmmmmmmmm')
                # Create new emergency registration and related data
                Patient_Emg = Patient_Emergency_Registration_Detials.objects.create(
                    PatientId=patient_instance,
                    Specialization=specialization_instance,
                    PrimaryDoctor=doctor_name_instance,
                    Complaint=complaint,
                    IsMLC=is_mlc,
                    IsReferral=is_referral,
                    PatientCategory=data.get('PatientCategory', ''),
                    InsuranceName=Insurance_Master_Detials.objects.get(Insurance_Id=data.get('InsuranceName', '')) if data.get('InsuranceName') else None,
                    created_by=created_by,
                    Location=location_instance
                )

                # Create patient admission details
                Patient_Admission_Detials.objects.create(
                    Emergency_Registration_Id=Patient_Emg,
                    AdmissionPurpose=AdmissionPurpose,
                    DrInchargeAtTimeOfAdmission=DrInchargeatTimeofAdmission_instance,
                    NextToKinName=NexttokinName,
                    Relation=relation,
                    RelativePhoneNo=relativePhoneno,
                    PersonLiableForPayment=personLiableforpayment,
                    FamilyHead=familyhead,
                    FamilyHeadName=familyheadName,
                    IpKitGiven=ipKitGiven,
                )

                patient_details = Patient_Detials.objects.get(PatientId=patient)
                patient_details.Status = 'Registered'
                patient_details.save()

                

                # Referral handling
                create_or_update_referral(is_referral, ReferralSource, referral_doctor_instance, register_type, register_Id, Patient_Emg, created_by)

                return JsonResponse({'success': 'Patient Admission Details Added successfully'})

        except Exception as e:
            print(str(e),'vvvvvvvvvv')
            return JsonResponse({'error': str(e)})



@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Emergency_Patient_From_Patient_Registration(request):
    
    @transaction.atomic
    def create_or_update_referral(is_referral, referral_source, referral_doctor_instance, register_type, register_id, newdata, created_by):
        if is_referral == 'Yes':
            try:
                if register_id:
                    filters = {
                        'Emergency': 'Emergency_Register_Id__pk',
                    }
                    filter_key = filters.get(register_type)
                    if not filter_key:
                        raise ValueError("Invalid register_type provided.")
                    if Patient_Referral_Detials.objects.filter(**{filter_key: register_id}).exists():
                        referral = Patient_Referral_Detials.objects.get(**{filter_key: register_id})
                        referral.ReferralSource = referral_source
                        referral.ReferredBy = referral_doctor_instance
                        referral.save()
                    else:
                        Patient_Referral_Detials.objects.create(
                            **{
                                'Emergency_Register_Id': newdata if register_type == 'Emergency' else None,
                            },
                            ReferralRegisteredBy=register_type,
                            ReferralSource=referral_source,
                            ReferredBy=referral_doctor_instance,
                            created_by=created_by
                        )
                    
                else:
                    Patient_Referral_Detials.objects.create(
                        **{
                            'Emergency_Register_Id': newdata if register_type == 'Emergency' else None,
                        },
                        ReferralRegisteredBy=register_type,
                        ReferralSource=referral_source,
                        ReferredBy=referral_doctor_instance,
                        created_by=created_by
                    )
            except ValueError as e:
                # Handle invalid register_type
                pass

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data,'data-------')

            # Extracting all input data
            register_Id = data.get('RegistrationId', '')
            register_type = data.get('RegisterType', '')
            patient = data.get('PatientId', '')
            print(patient,'patienttttttttt')
            Speciality = data.get('Speciality', '')
            doctor_name = data.get('DoctorName', '')
            complaint = data.get('Complaint', '')
            is_mlc = data.get('IsMLC', 'No')
            is_referral = data.get('IsReferral', 'No')
            ReferralSource = data.get('ReferralSource', '')
            ReferredBy = data.get('ReferredBy', '')
            AdmissionPurpose = data.get('AdmissionPurpose', '')
            DrInchargeatTimeofAdmission = data.get('DrInchargeAtTimeOfAdmission', '')
            NexttokinName = data.get('NextToKinName', '')
            relation = data.get('Relation', '')
            relativePhoneno = data.get('RelativePhoneNo', '')
            personLiableforpayment = data.get('PersonLiableForBillPayment', '')
            familyhead = data.get('FamilyHead', '')
            familyheadName = data.get('FamilyHeadName', '')
            ipKitGiven = data.get('IpKitGiven', 'No')
            created_by = data.get('Created_by', '')
            Location_Id = data.get('Location', '')
            RoomId = data.get('RoomId', '')
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

            print(register_Id,'register_Id')

            Title = data.get('Title','')
            FirstName = data.get('FirstName','')
            MiddleName = data.get('MiddleName','')
            SurName = data.get('SurName','')
            Gender = data.get('Gender','')
            MaritalStatus = data.get('MaritalStatus','')
            SpouseName = data.get('SpouseName','')
            FatherName = data.get('FatherName','')
            DOB = data.get('DOB','')
            Age = data.get('Age','')
            PhoneNo = data.get('PhoneNo','')
            Email = data.get('Email','')
            BloodGroup = data.get('BloodGroup','')
            Occupation = data.get('Occupation','')
            Nationality = data.get('Nationality','')
            UHIDType = data.get('UHIDType','')
            UHIDNo = data.get('UHIDNo','')
            PatientType = data.get('PatientType','')
            patient_category = data.get('PatientCategory', '')
            Pincode = data.get('Pincode','')
            DoorNo = data.get('DoorNo','')
            Street = data.get('Street','')
            Area = data.get('Area','')
            City = data.get('City','')
            District = data.get('District','')
            State = data.get('State','')
            Country = data.get('Country','')
            Religion = data.get('Religion','')
            Appoint_list = data.get('Appoint_list',[])
            print(Appoint_list,'Appoint_list')
            IsMLC = data.get('IsMLC', '')
            IsReferral = data.get('IsReferral', '')
            ReferralSource = data.get('ReferralSource', '')
            ReferredBy = data.get('ReferredBy', '')
           
            print('patient--------')
            Titleins = Title_Detials.objects.get(Title_Id=Title) if Title else None
            BloodGroupins = BloodGroup_Detials.objects.get(BloodGroup_Id = BloodGroup) if BloodGroup else None
            Religionins = Religion_Detials.objects.get(Religion_Id = Religion) if Religion else None

            # Fetch related objects
            patient_instance = Patient_Detials.objects.get(PatientId=patient) if patient else None
            print(patient_instance,'patient_instance')
            specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
            doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
            DrInchargeatTimeofAdmission_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DrInchargeatTimeofAdmission) if DrInchargeatTimeofAdmission else None
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
            location_instance = Location_Detials.objects.get(Location_Id=Location_Id) if Location_Id else None
            roomid_instance = Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None

            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
            Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
            Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
            Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
            
            # Handle patient emergency registration details
            if register_Id and Patient_Emergency_Registration_Detials.objects.filter(pk=register_Id).exists():
                print('rrrrrrrrrrrrrrrrrrrrrrrrrr')

                ip_details = Patient_Emergency_Registration_Detials.objects.get(pk=register_Id)
                ip_details.Specialization = specialization_instance
                ip_details.PrimaryDoctor = doctor_name_instance
                ip_details.Complaint = complaint
                ip_details.IsMLC = is_mlc
                ip_details.IsReferral = is_referral
                ip_details.PatientCategory = data.get('PatientCategory', '')
                ip_details.InsuranceName = Insurance_instance
                # ip_details.InsuranceName = Insurance_Master_Detials.objects.get(Insurance_Id=data.get('InsuranceName', '')) if data.get('InsuranceName') else None
                ip_details.InsuranceType = insurance_type 
                
                ip_details.ClientName = Client_instance
                # ip_details.ClientName = Client_Master_Detials.objects.get(Client_Id=data.get('ClientName', '')) if data.get('ClientName') else None
                ip_details.ClientType = client_type 
                ip_details.ClientEmployeeId = client_employee_id
                ip_details.ClientEmployeeDesignation = client_employee_designation 
                ip_details.ClientEmployeeRelation = client_employee_relation 
                
                ip_details.CorporateName = Corporate_instance
                # ip_details.CorporateName = Corporate_Master_Detials.objects.get(Corporate_Id=data.get('CorporateName', '')) if data.get('CorporateName') else None
                ip_details.CorporateType = CorporateType 
                ip_details.CorporateEmployeeId = CorporateEmployeeId 
                ip_details.CorporateEmployeeDesignation = CorporateEmployeeDesignation 
                ip_details.CorporateEmployeeRelation = CorporateEmployeeRelation 

                ip_details.EmployeeId = employee_instance
                # ip_details.EmployeeId = Employee_Personal_Form_Detials.objects.get(Employee_ID=data.get('EmployeeId', '')) if data.get('EmployeeId') else None
                ip_details.EmployeeRelation = employee_relation 
                

                ip_details.DoctorId = doctor_instance
                # ip_details.DoctorId = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('DoctorId', '')) if data.get('DoctorId') else None
                ip_details.DoctorRelation = doctor_relation
                
                ip_details.DonationType = Donation_instance
                # ip_details.DonationType = Donation_Master_Detials.objects.get(Donation_Id=data.get('DonationType', '')) if data.get('DonationType') else None
                ip_details.updated_by = created_by
                ip_details.SavedStatus = 'Registered'
                ip_details.save()

                print('33333333333333333')
                patient_details = Patient_Detials.objects.get(PatientId=patient)
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
                # patient.ABHA  = ABHA
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
 
                print('222222222222222')


                # Handle patient admission details
                ip_admission = Patient_Admission_Detials.objects.filter(Emergency_Registration_Id__Registration_Id=ip_details.pk).first()
                if ip_admission is None:
                    ip_admission = Patient_Admission_Detials(
                        Emergency_Registration_Id=ip_details,
                        AdmissionPurpose=AdmissionPurpose,
                        DrInchargeAtTimeOfAdmission=DrInchargeatTimeofAdmission_instance,
                        NextToKinName=NexttokinName,
                        Relation=relation,
                        RelativePhoneNo=relativePhoneno,
                        PersonLiableForPayment=personLiableforpayment,
                        FamilyHead=familyhead,
                        FamilyHeadName=familyheadName,
                        IpKitGiven=ipKitGiven,
                        updated_by=created_by
                    )
                    ip_admission.save()
                else:
                    ip_admission.AdmissionPurpose = AdmissionPurpose
                    ip_admission.DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance
                    ip_admission.NextToKinName = NexttokinName
                    ip_admission.Relation = relation
                    ip_admission.RelativePhoneNo = relativePhoneno
                    ip_admission.PersonLiableForPayment = personLiableforpayment
                    ip_admission.FamilyHead = familyhead
                    ip_admission.FamilyHeadName = familyheadName
                    ip_admission.IpKitGiven = ipKitGiven
                    ip_admission.updated_by = created_by
                    ip_admission.save()

                # patient_details = Patient_Detials.objects.get(PatientId=patient)
                # patient_details.Status = 'Registered'
                # patient_details.save()

                # Referral handling
                create_or_update_referral(is_referral, ReferralSource, referral_doctor_instance, register_type, register_Id, ip_details, created_by)

                return JsonResponse({'success': 'Emergency Patient Details Updated successfully'})

            # For new registrations
            else:
                print('qqqqqqqqqqqqqq')
                # Create new emergency registration and related data
               
                patient_details = Patient_Detials.objects.get(PatientId=patient)
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
                # patient.ABHA  = ABHA
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

                print('wwwwwwwwwwwwwwwwww')


                if register_type:

                    for appoint in Appoint_list:
                        print('🌀 Processing appoint:', appoint)

                        VisitType = appoint.get('VisitType', '')
                        Complaint = appoint.get('Complaint', '')
                        TokenNo = appoint.get('TokenNo','')
                        Speciality = appoint.get('Speciality','')
                        DoctorName = appoint.get('DoctorId','')
                    
                        Specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
                        Doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DoctorName) if DoctorName else None
                        
                        Multile_Doctor = Patient_Emergency_Registration_Detials.objects.create(
                            # Registration_Id = Patient_Emg,
                            PatientId=patient_instance,
                            PrimaryDoctor = Doctor_name_instance,
                            Specialization = Specialization_instance,
                            VisitType = VisitType,
                            Complaint = Complaint,
                            TokenNo = TokenNo,

                            IsMLC = IsMLC,
                            IsReferral = IsReferral,

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

                            created_by=created_by,
                            Location=location_instance
                        )
                        Multile_Doctor.save()
                print('yyyyyyyyyy')        

             

                print('zzzzzzzzzzzz')        


                # Create patient admission details
                Patient_Admission_Detials.objects.create(
                    Emergency_Registration_Id=Multile_Doctor,
                    AdmissionPurpose=AdmissionPurpose,
                    DrInchargeAtTimeOfAdmission=DrInchargeatTimeofAdmission_instance,
                    NextToKinName=NexttokinName,
                    Relation=relation,
                    RelativePhoneNo=relativePhoneno,
                    PersonLiableForPayment=personLiableforpayment,
                    FamilyHead=familyhead,
                    FamilyHeadName=familyheadName,
                    IpKitGiven=ipKitGiven,
                )
                print('qqqqqqqqqq')        

                patient_details = Patient_Detials.objects.get(PatientId=patient)
                patient_details.Status = 'Registered'
                patient_details.save()

                print('rrrrrrrrrrr')        
                

                # Referral handling
                create_or_update_referral(is_referral, ReferralSource, referral_doctor_instance, register_type, register_Id, Multile_Doctor, created_by)

                return JsonResponse({'success': 'Patient Admission Details Added successfully','RegistrationId':Multile_Doctor.Registration_Id})

        except Exception as e:
            print(str(e),'vvvvvvvvvv')
            return JsonResponse({'error': str(e)})



#--------------------jeeva-----> dont change the code -------------------


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_Emergency_patient_details_for_Quelist(request):
#     try:
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         print(status,'statussssssssssssss')
#         DoctorId = request.GET.get('DoctorId', '')
        
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')

 
#         # Map status to Booking_Status
#         Booking_Status = 'Occupied' if status == 'Admitted' else 'Completed'
        
       
#         queryset = Patient_Emergency_Registration_Detials.objects.all()
        
#         print(queryset,'queryset')
#         # Apply filters based on the query parameters
#         # if query:
#         #     queryset = queryset.filter(
#         #         Q(PatientId__FirstName__icontains=query) |
#         #         Q(PatientId__MiddleName__icontains=query) |
#         #         Q(PatientId__SurName__icontains=query) |
#         #         Q(PatientId__PatientId__icontains=query) |
#         #         Q(PatientId__PhoneNo__icontains=query)
#         #     ).filter(Booking_Status=Booking_Status)

#         if query:
#                 queryset = queryset.filter(
#                     Q(PatientId__FirstName__icontains=query) |
#                     Q(PatientId__MiddleName__icontains=query) |
#                     Q(PatientId__SurName__icontains=query) |
#                     Q(PatientId__PatientId__icontains=query) |
#                     Q(PatientId__PhoneNo__icontains=query)
#                 )
        
#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])

#         # Particular date filter
#         elif particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)
        
#         # Current Date filter (Ensure it's a valid date)
#         elif Current_date and Current_date != "":  
#             queryset = queryset.filter(created_at__date=Current_date)
     

#         if DoctorId:
#             queryset = queryset.filter(PrimaryDoctor__pk = DoctorId)
        

#         if status:
#             queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)
        
        
       

#         # Serialize the filtered queryset
#         Emg_register_data = []
#         for idx, register in enumerate(queryset, start=1):
#             # client_name = register.ClientName.Client_Name if register.ClientName else None
#             # insurance_name = register.InsuranceName.Insurance_Name if register.InsuranceName else None
#             # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
#             # BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Id if register.PatientId.BloodGroup else None
            
#             appointment_dict = {
#                 'id': idx,
#                 # 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'RegistrationId': register.Registration_Id,
#                 'PatientId': register.PatientId.PatientId if register.PatientId else None,
#                 'PatientName': (
#                     f"{register.PatientId.Title.Title_Name if register.PatientId and register.PatientId.Title else ''} "
#                     f"{register.PatientId.FirstName if register.PatientId and register.PatientId.FirstName else ''} "
#                     f"{register.PatientId.MiddleName if register.PatientId and register.PatientId.MiddleName else ''} "
#                     f"{register.PatientId.SurName if register.PatientId and register.PatientId.SurName else ''}"
#                 ).strip(),

#                 # 'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else ''}{register.PatientId.FirstName if register.PatientId else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
#                 # 'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else None}{register.PatientId.FirstName if register.PatientId.Title else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
#                 'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
#                 # 'Age': register.PatientId.Age if register.PatientId else None,
#                 'Gender': register.PatientId.Gender if register.PatientId else None,
#                 'UHIDNO' : register.PatientId.UniqueIdNo if register.PatientId else None,
#                 # 'BloodGroup': BloodGroup_name,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 'Triage': register.Triage,
#                 # 'Flagging': Flagging_name,
#                 # 'FlaggingColour': Flagging_color,
#                 # 'Flagging': register.Flagging,
#                 'isRefferal': register.IsReferral,
#                 # 'ClientName': client_name,  # Fixed reference
#                 # 'InsuranceName': insurance_name,  # Fixed reference
#                 'Status': register.Status,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else None,
#             }

#             if register.Booking_Status in 'Occupied':
#                 roomdetials = Patient_Admission_Room_Detials.objects.filter(Emergency_Registration_Id=register).order_by('-created_by').first()

#                 if roomdetials:
#                     appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId.Building_Name else None
#                     appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId.Block_Name else None
#                     appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId.Floor_Name else None
#                     appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId.Ward_Name else None
#                     # appointment_dict['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name if roomdetials.RoomId.Room_Name else None
#                     # appointment_dict['RoomNo'] = roomdetials.RoomId.Room_No if roomdetials.RoomId.Room_No else None
#                     appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId.Bed_No else None
#                     appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials.RoomId.Room_Id else None

            
        
#             Emg_register_data.append(appointment_dict)
        
#         count_filters = {}
#         if Current_date:
#             count_filters['created_at__date'] = Current_date
        
#         if from_date and to_date:
#             count_filters['created_at__date__range'] = [from_date, to_date]
        
#         if particular_date:
#             count_filters['created_at__date'] = particular_date


#         count_queryset = Patient_Emergency_Registration_Detials.objects.filter(
#             **count_filters
#         )

#         if status:
#             count_queryset = count_queryset.filter(Status__iexact=status)
        
#         Total_Emg_Count = count_queryset.count()
         
#         return JsonResponse({
#             'appointments': Emg_register_data,
#             'Total_Emg_Count':Total_Emg_Count
#         }, safe=False)
     
#         # return JsonResponse(Emg_register_data, safe=False)
    
#         # return JsonResponse({
#         #     'appointments': Emg_register_data,
#         #     'today_Admitted_Emg_count': today_Admitted_Emg_count,
#         #     'monthly_Admitted_Emg_count': monthly_Admitted_Emg_count,
#         #     'yearly_Admitted_Emg_count': yearly_Admitted_Emg_count,
#         #     'today_Discharged_Emg_count': today_Discharged_Emg_count,
#         #     'monthly_Discharged_Emg_count': monthly_Discharged_Emg_count,
#         #     'yearly_Discharged_Emg_count': yearly_Discharged_Emg_count,
#         # }, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def get_Emergency_patient_details_for_Quelist(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        print(status,'statussssssssssssss')
        DoctorId = request.GET.get('DoctorId', '')
        
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')

 
        # Map status to Booking_Status
        Booking_Status = 'Occupied' if status == 'Admitted' else 'Completed'
        
       
        queryset = Patient_Emergency_Registration_Detials.objects.defer('DoctorName').filter(
            Specialization__Speciality_Name__icontains='Emergency Medicine'
        )
        
        print(queryset,'queryset')
        # Apply filters based on the query parameters
        # if query:
        #     queryset = queryset.filter(
        #         Q(PatientId__FirstName__icontains=query) |
        #         Q(PatientId__MiddleName__icontains=query) |
        #         Q(PatientId__SurName__icontains=query) |
        #         Q(PatientId__PatientId__icontains=query) |
        #         Q(PatientId__PhoneNo__icontains=query)
        #     ).filter(Booking_Status=Booking_Status)

        if query:
                queryset = queryset.filter(
                    Q(PatientId__FirstName__icontains=query) |
                    Q(PatientId__MiddleName__icontains=query) |
                    Q(PatientId__SurName__icontains=query) |
                    Q(PatientId__PatientId__icontains=query) |
                    Q(PatientId__PhoneNo__icontains=query)
                )
        
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])

        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
     

        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__pk = DoctorId)
        

        if status:
            queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)
        
        
       

        # Serialize the filtered queryset
        Emg_register_data = []
        for idx, register in enumerate(queryset, start=1):
            # client_name = register.ClientName.Client_Name if register.ClientName else None
            # insurance_name = register.InsuranceName.Insurance_Name if register.InsuranceName else None
            # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            # BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Id if register.PatientId.BloodGroup else None
            
            appointment_dict = {
                'id': idx,
                # 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId if register.PatientId else None,
                'PatientName': (
                    f"{register.PatientId.Title.Title_Name if register.PatientId and register.PatientId.Title else ''} "
                    f"{register.PatientId.FirstName if register.PatientId and register.PatientId.FirstName else ''} "
                    f"{register.PatientId.MiddleName if register.PatientId and register.PatientId.MiddleName else ''} "
                    f"{register.PatientId.SurName if register.PatientId and register.PatientId.SurName else ''}"
                ).strip(),

                # 'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else ''}{register.PatientId.FirstName if register.PatientId else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
                # 'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else None}{register.PatientId.FirstName if register.PatientId.Title else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
                'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
                # 'Age': register.PatientId.Age if register.PatientId else None,
                'Gender': register.PatientId.Gender if register.PatientId else None,
                'UHIDNO' : register.PatientId.UniqueIdNo if register.PatientId else None,
                # 'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'Triage': register.Triage,
                # 'Flagging': Flagging_name,
                # 'FlaggingColour': Flagging_color,
                # 'Flagging': register.Flagging,
                'isRefferal': register.IsReferral,
                # 'ClientName': client_name,  # Fixed reference
                # 'InsuranceName': insurance_name,  # Fixed reference
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else None,
            }

            if register.Booking_Status in 'Occupied':
                roomdetials = Patient_Admission_Room_Detials.objects.filter(Emergency_Registration_Id=register).order_by('-created_by').first()

                if roomdetials:
                    appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId.Building_Name else None
                    appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId.Block_Name else None
                    appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId.Floor_Name else None
                    appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId.Ward_Name else None
                    # appointment_dict['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name if roomdetials.RoomId.Room_Name else None
                    # appointment_dict['RoomNo'] = roomdetials.RoomId.Room_No if roomdetials.RoomId.Room_No else None
                    appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId.Bed_No else None
                    appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials.RoomId.Room_Id else None

            
        
            Emg_register_data.append(appointment_dict)

        # -------------------------------------------------------------------------
        #  Merge OP Patients with Specialization = 'Emergency Medicine'
        # -------------------------------------------------------------------------
        op_queryset = Patient_Appointment_Registration_Detials.objects.filter(
            appointment_doctor_specialties__Specialization__Speciality_Name__icontains='Emergency Medicine'
        )

        print(len(op_queryset),'op_queryset')

        # 1) Filter by Search Query
        if query:
            op_queryset = op_queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )

        # 2) Date Filters
        if from_date and to_date:
            op_queryset = op_queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            op_queryset = op_queryset.filter(created_at__date=particular_date)
        elif Current_date and Current_date != "":
            op_queryset = op_queryset.filter(created_at__date=Current_date)

        # 3) Doctor Filter
        if DoctorId:
            op_queryset = op_queryset.filter(DoctorId__pk=DoctorId)

        # 4) Status Filter
        if status:
            # If front-end sends 'Admitted', OP might use 'Admitted' or 'InPatient' etc.
            # If front-end sends 'Pending', OP uses 'Pending'.
            if status == 'Admitted':
                op_queryset = op_queryset.filter(Q(Status__icontains='Admitted') | Q(Status__icontains='Paid'))
            else:
                op_queryset = op_queryset.filter(Status__icontains=status)

        # Append OP results to the list
        for op_idx, op_reg in enumerate(op_queryset, start=len(Emg_register_data) + 1):
             
             # Name Formatting
             p_title = op_reg.PatientId.Title.Title_Name if (op_reg.PatientId and op_reg.PatientId.Title) else ''
             p_first = op_reg.PatientId.FirstName if (op_reg.PatientId and op_reg.PatientId.FirstName) else ''
             p_middle = op_reg.PatientId.MiddleName if (op_reg.PatientId and op_reg.PatientId.MiddleName) else ''
             p_sur   = op_reg.PatientId.SurName if (op_reg.PatientId and op_reg.PatientId.SurName) else ''

             full_name = f"{p_title} {p_first} {p_middle} {p_sur}".strip()
             
             # Fetch specifically the Emergency Medicine specialization that matched the filter
             matched_spec = op_reg.appointment_doctor_specialties.filter(Specialization__Speciality_Name__icontains='Emergency Medicine').first()
             spec_name = str(matched_spec.Specialization.Speciality_Name) if matched_spec and matched_spec.Specialization else None


             op_dict = {
                'id': op_idx,
                'RegistrationId': op_reg.Registration_Id,
                'PatientId': op_reg.PatientId.PatientId if op_reg.PatientId else None,
                'PatientName': full_name,
                'PhoneNo': op_reg.PatientId.PhoneNo if op_reg.PatientId else None,
                'Gender': op_reg.PatientId.Gender if op_reg.PatientId else None,
                'UHIDNO' : op_reg.PatientId.UniqueIdNo if op_reg.PatientId else None,
                # 'Age': op_reg.PatientId.Age if op_reg.PatientId else None,

                'Complaint': matched_spec.Complaint if matched_spec else '',
                'isMLC': op_reg.IsMLC,
                'Triage': None, # OP doesn't have Triage usually
                'isRefferal': op_reg.IsReferral,
                'Status': op_reg.Status,
                
                'DoctorName': f"{op_reg.DoctorId.Tittle.Title_Name}.{op_reg.DoctorId.First_Name} {op_reg.DoctorId.Last_Name}" if op_reg.DoctorId else None,
                'Specilization': spec_name,
                
                # Fields specific to Room/Bed not applicable for OP 'Pending' usually,
                # but if they are admitted, it might be relevant. For now, leave blank/None.
                'BuildingName': None,
                'BlockName': None,
                'FloorName': None,
                'WardName': None,
                'BedNo': None,
                'RoomId': None,
                'VisitPurpose' : 'OP_EMERGENCY' # valid indicator
             }
             Emg_register_data.append(op_dict)
             print(op_dict,'op_dict')

        
        count_filters = {}
        if Current_date:
            count_filters['created_at__date'] = Current_date
        
        if from_date and to_date:
            count_filters['created_at__date__range'] = [from_date, to_date]
        
        if particular_date:
            count_filters['created_at__date'] = particular_date


        count_queryset = Patient_Emergency_Registration_Detials.objects.filter(
            Specialization__Speciality_Name__icontains='Emergency Medicine',
            **count_filters
        )

        if status:
            count_queryset = count_queryset.filter(Status__icontains=status).filter(Booking_Status=Booking_Status)
        
        Total_Emg_Count = count_queryset.count()

        # -------------------------------------------------------------------------
        #  Add OP Count (Specialization = 'Emergency Medicine') for Total Count
        # -------------------------------------------------------------------------
        op_count_queryset = Patient_Appointment_Registration_Detials.objects.filter(
            appointment_doctor_specialties__Specialization__Speciality_Name__icontains='Emergency Medicine'
        ).distinct()
        
        # Date Filters
        if from_date and to_date:
            op_count_queryset = op_count_queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            op_count_queryset = op_count_queryset.filter(created_at__date=particular_date)
        elif Current_date and Current_date != "":
            op_count_queryset = op_count_queryset.filter(created_at__date=Current_date)

        # Status Filter
        if status:
            if status == 'Admitted':
                op_count_queryset = op_count_queryset.filter(Q(Status__icontains='Admitted') | Q(Status__icontains='Registered'))
            else:
                op_count_queryset = op_count_queryset.filter(Status__icontains=status)

        Total_Emg_Count += op_count_queryset.count()
         
        return JsonResponse({
            'appointments': Emg_register_data,
            'Total_Emg_Count':Total_Emg_Count
        }, safe=False)
     
        # return JsonResponse(Emg_register_data, safe=False)
    
        # return JsonResponse({
        #     'appointments': Emg_register_data,
        #     'today_Admitted_Emg_count': today_Admitted_Emg_count,
        #     'monthly_Admitted_Emg_count': monthly_Admitted_Emg_count,
        #     'yearly_Admitted_Emg_count': yearly_Admitted_Emg_count,
        #     'today_Discharged_Emg_count': today_Discharged_Emg_count,
        #     'monthly_Discharged_Emg_count': monthly_Discharged_Emg_count,
        #     'yearly_Discharged_Emg_count': yearly_Discharged_Emg_count,
        # }, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})




@csrf_exempt
@require_http_methods(["GET"])
def Total_Emergency_patients_List(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        print(status,'statussssssssssssss')
        DoctorId = request.GET.get('DoctorId', '')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        User = request.GET.get('User', '')
 
 
 
        # Map status to Booking_Status
        Booking_Status = 'Occupied' if status == 'Admitted' else 'Completed'
       
       
        queryset = Patient_Emergency_Registration_Detials.objects.all().order_by('-created_at')
        # queryset = Patient_Emergency_Registration_Detials.objects.all()
       
        print(queryset,'queryset')
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            ).filter(Booking_Status=Booking_Status)
       
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
     
 
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__pk = DoctorId)
       
        if User:
            queryset = queryset.filter(created_by=User)
 
        if status:
            queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)
       
        today = date.today()
        current_year = today.year
        current_month = today.month
 
        today_Admitted_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(created_at__date=today,Status='Admitted',created_by=User).count()
       
        monthly_Admitted_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
            created_at__year=current_year,
            created_at__month=current_month,
            Status='Admitted',
            created_by=User
        ).count()
 
        yearly_Admitted_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
            created_at__year=current_year,
            Status='Admitted',
            created_by=User
        ).count()
 
        today_Discharged_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(created_at__date=today,Status='Completed',created_by=User).count()
       
        monthly_Discharged_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
            created_at__year=current_year,
            created_at__month=current_month,
            Status='Completed',
            created_by=User
        ).count()
 
        yearly_Discharged_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
            created_at__year=current_year,
            Status='Completed',
            created_by=User
        ).count()
 
        # Serialize the filtered queryset
        Emg_register_data = []
        for idx, register in enumerate(queryset, start=1):
            # client_name = register.ClientName.Client_Name if register.ClientName else None
            # insurance_name = register.InsuranceName.Insurance_Name if register.InsuranceName else None
            # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            # BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Id if register.PatientId.BloodGroup else None
           
            appointment_dict = {
                'id': idx,
                # 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId if register.PatientId else None,
                'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else ''}{register.PatientId.FirstName if register.PatientId else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
                'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
                'Age': register.PatientId.Age if register.PatientId else None,
                'Gender': register.PatientId.Gender if register.PatientId else None,
                'UHIDNO' : register.PatientId.UniqueIdNo if register.PatientId else None,
                # 'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                # 'Flagging': Flagging_name,
                # 'FlaggingColour': Flagging_color,
                # 'Flagging': register.Flagging,
                'isRefferal': register.IsReferral,
                'created_by': register.created_by if register else '',
 
                # 'ClientName': client_name,  # Fixed reference
                # 'InsuranceName': insurance_name,  # Fixed reference
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else None,
            }
 
            if register.Booking_Status in 'Occupied':
                roomdetials = Patient_Admission_Room_Detials.objects.filter(Emergency_Registration_Id=register).order_by('-created_by').first()
 
                if roomdetials:
                    appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId.Building_Name else None
                    appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId.Block_Name else None
                    appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId.Floor_Name else None
                    appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId.Ward_Name else None
                    # appointment_dict['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name if roomdetials.RoomId.Room_Name else None
                    # appointment_dict['RoomNo'] = roomdetials.RoomId.Room_No if roomdetials.RoomId.Room_No else None
                    appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId.Bed_No else None
                    appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials.RoomId.Room_Id else None
 
           
       
            Emg_register_data.append(appointment_dict)
 
        # return JsonResponse(Emg_register_data, safe=False)
   
        return JsonResponse({
            'appointments': Emg_register_data,
            'today_Admitted_Emg_count': today_Admitted_Emg_count,
            'monthly_Admitted_Emg_count': monthly_Admitted_Emg_count,
            'yearly_Admitted_Emg_count': yearly_Admitted_Emg_count,
            'today_Discharged_Emg_count': today_Discharged_Emg_count,
            'monthly_Discharged_Emg_count': monthly_Discharged_Emg_count,
            'yearly_Discharged_Emg_count': yearly_Discharged_Emg_count,
        }, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
 
 

#--------------------jeeva-----> dont change the code -------------------


# @csrf_exempt #---show grid in the Emergency register page
# @require_http_methods(["GET"])
# def get_Emergency_patient_list(request):  
#     try:
        
#         status = request.GET.get('status', '')
        

#         queryset = Patient_Emergency_Registration_Detials.objects.all()
        
#         print(queryset,'queryset')
        
#         if status:
#             queryset = queryset.filter(PatientId__Status__iexact=status)  # Match 'Saved' exactly, case-insensitive

#         Emg_register_data = []
#         for idx, register in enumerate(queryset, start=1):
              
#             appointment_dict = {
#                 'id': idx,
#                 # 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'RegistrationId': register.Registration_Id,
#                 'PatientId': register.PatientId.PatientId if register.PatientId else None,
#                 'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else None}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
#                 'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
#                 'Age': register.PatientId.Age if register.PatientId else None,
#                 'Gender': register.PatientId.Gender if register.PatientId else None,
#                 # 'BloodGroup': BloodGroup_name,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 #'Triage': register.Triage,
#                 'Triage': register.Triage,
#                 # 'Flagging': Flagging_name,
#                 # 'FlaggingColour': Flagging_color,
#                 # 'Flagging': register.Flagging,
#                 'isReferral': register.IsReferral,
#                 # 'ClientName': client_name,  # Fixed reference
#                 # 'InsuranceName': insurance_name,  # Fixed reference
#                 'Status': register.Status,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else None,
#             }

           
#             Emg_register_data.append(appointment_dict)

#         return JsonResponse(Emg_register_data, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)})


 
@csrf_exempt #---show grid in the Emergency register page
@require_http_methods(["GET"])
def get_Emergency_patient_list(request):  
    try:
       
        status = request.GET.get('status', '')
       
 
        queryset = Patient_Emergency_Registration_Detials.objects.all()
       
        print(queryset,'queryset')
       
        if status:
            queryset = queryset.filter(PatientId__Status__iexact=status)  # Match 'Saved' exactly, case-insensitive
 
        Emg_register_data = []
        for idx, register in enumerate(queryset, start=1):
             
            appointment_dict = {
                'id': idx,
                # 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId if register.PatientId else None,
                'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else None}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
                'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
                'Age': register.PatientId.Age if register.PatientId else None,
                'Gender': register.PatientId.Gender if register.PatientId else None,
                # 'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'Triage': register.Triage,
                # 'Flagging': Flagging_name,
                # 'FlaggingColour': Flagging_color,
                # 'Flagging': register.Flagging,
                'isRefferal': register.IsReferral,
                # 'ClientName': client_name,  # Fixed reference
                # 'InsuranceName': insurance_name,  # Fixed reference
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else None,
            }
 
           
            Emg_register_data.append(appointment_dict)
 
        return JsonResponse(Emg_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 



@csrf_exempt
@require_http_methods(["GET"])
def get_Emergency_Registration_edit_details(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', None)
        print(RegistrationId, 'RegistrationIdddddddd11111111111')

        # Fetch the Emergency Patient record
        Emergency_Patient = Patient_Emergency_Registration_Detials.objects.get(pk=RegistrationId)
        
        # Attempt to fetch the associated admission record (if any)
        admission_instance = Patient_Admission_Detials.objects.filter(Emergency_Registration_Id__Registration_Id=RegistrationId).first()
        referral_details = None

        # Check for referral details by OP, IP, and Emergency Register IDs
        try:
            referral_details = Patient_Referral_Detials.objects.filter(
                OP_Register_Id__Registration_Id=RegistrationId
            ).first() or Patient_Referral_Detials.objects.filter(
                IP_Register_Id__Registration_Id=RegistrationId
            ).first() or Patient_Referral_Detials.objects.filter(
                Emergency_Register_Id__Registration_Id=RegistrationId
            ).first()
        except Patient_Referral_Detials.DoesNotExist:
            referral_details = None

        # Check if admission_instance exists
        if admission_instance is None:
            print(f"No admission record found for RegistrationId: {RegistrationId}")
            admission_instance = {}  # Return an empty dictionary if no admission found
        
        print(admission_instance, 'admission_instance')

        # Create the registration dictionary
        Registration_dict = {
            'Title': Emergency_Patient.PatientId.Title.Title_Id if Emergency_Patient.PatientId.Title else '',
            'PatientId': Emergency_Patient.PatientId.PatientId if Emergency_Patient.PatientId else "",
            'FirstName': Emergency_Patient.PatientId.FirstName if Emergency_Patient.PatientId else "",
            'MiddleName': Emergency_Patient.PatientId.MiddleName if Emergency_Patient.PatientId else "",
            'SurName': Emergency_Patient.PatientId.SurName if Emergency_Patient.PatientId else "",
            'Gender': Emergency_Patient.PatientId.Gender if Emergency_Patient.PatientId else "",
            'MaritalStatus': Emergency_Patient.PatientId.MaritalStatus if Emergency_Patient.PatientId else "",
            'SpouseName': Emergency_Patient.PatientId.SpouseName if Emergency_Patient.PatientId else "",
            'FatherName': Emergency_Patient.PatientId.FatherName if Emergency_Patient.PatientId else "",
            'DOB': Emergency_Patient.PatientId.DOB if Emergency_Patient.PatientId else "",
            'Age': Emergency_Patient.PatientId.Age if Emergency_Patient.PatientId else "",
            'PhoneNo': Emergency_Patient.PatientId.PhoneNo if Emergency_Patient.PatientId else "",
            'Email': Emergency_Patient.PatientId.Email if Emergency_Patient.PatientId else "",
            'BloodGroup': Emergency_Patient.PatientId.BloodGroup.BloodGroup_Id if Emergency_Patient.PatientId.BloodGroup else "",
            'Occupation': Emergency_Patient.PatientId.Occupation if Emergency_Patient.PatientId else "",
            'Religion': Emergency_Patient.PatientId.Religion.Religion_Id if Emergency_Patient.PatientId.Religion else None,
            'ReligionName': Emergency_Patient.PatientId.Religion.Religion_Name if Emergency_Patient.PatientId.Religion else None,
            'Nationality': Emergency_Patient.PatientId.Nationality if Emergency_Patient.PatientId else "",
            'UniqueIdType': Emergency_Patient.PatientId.UniqueIdType if Emergency_Patient.PatientId else "",
            'UniqueIdNo': Emergency_Patient.PatientId.UniqueIdNo if Emergency_Patient.PatientId else "",
            'PatientType': Emergency_Patient.PatientId.PatientType if Emergency_Patient.PatientId else "",
            'DoorNo': Emergency_Patient.PatientId.DoorNo if Emergency_Patient.PatientId else "",
            'Street': Emergency_Patient.PatientId.Street if Emergency_Patient.PatientId else "",
            'Area': Emergency_Patient.PatientId.Area if Emergency_Patient.PatientId else "",
            'City': Emergency_Patient.PatientId.City if Emergency_Patient.PatientId else "",
            'State': Emergency_Patient.PatientId.State if Emergency_Patient.PatientId else "",
            'Country': Emergency_Patient.PatientId.Country if Emergency_Patient.PatientId else "",
            'Pincode': Emergency_Patient.PatientId.Pincode if Emergency_Patient.PatientId else "",
            'ABHA': Emergency_Patient.PatientId.ABHA if Emergency_Patient.PatientId else "",
            'RegistrationId': Emergency_Patient.pk,
            'Speciality': Emergency_Patient.Specialization.pk if Emergency_Patient.Specialization else None,
            'PrimaryDoctor': Emergency_Patient.PrimaryDoctor.pk if Emergency_Patient.PrimaryDoctor else None,
            'DoctorName': (
                f"{Emergency_Patient.PrimaryDoctor.Tittle.Title_Name if Emergency_Patient.PrimaryDoctor and Emergency_Patient.PrimaryDoctor.Tittle else ''}."
                f"{Emergency_Patient.PrimaryDoctor.ShortName if Emergency_Patient.PrimaryDoctor else ''}"),
            'Complaint': Emergency_Patient.Complaint,
            'IsMLC': Emergency_Patient.IsMLC,
            'IsReferral': Emergency_Patient.IsReferral,
            'PatientCategory': Emergency_Patient.PatientCategory,
            'InsuranceName': Emergency_Patient.InsuranceName.Insurance_Id if Emergency_Patient.InsuranceName else None,
            'InsuranceType': Emergency_Patient.InsuranceType,
            'ClientName': Emergency_Patient.ClientName.Client_Id if Emergency_Patient.ClientName else None,
            'ClientType': Emergency_Patient.ClientType,
            'ClientEmployeeId': Emergency_Patient.ClientEmployeeId,
            'ClientEmployeeDesignation': Emergency_Patient.ClientEmployeeDesignation,
            'ClientEmployeeRelation': Emergency_Patient.ClientEmployeeRelation,
            'CorporateName': Emergency_Patient.CorporateName.Corporate_Id if Emergency_Patient.CorporateName else None,
            'CorporateType': Emergency_Patient.CorporateType,
            'CorporateEmployeeId': Emergency_Patient.CorporateEmployeeId,
            'CorporateEmployeeDesignation': Emergency_Patient.CorporateEmployeeDesignation,
            'CorporateEmployeeRelation': Emergency_Patient.CorporateEmployeeRelation,
            'EmployeeId': Emergency_Patient.EmployeeId.Employee_ID if Emergency_Patient.EmployeeId else "",
            'EmployeeRelation': Emergency_Patient.EmployeeRelation,
            'DoctorId': Emergency_Patient.DoctorId.pk if Emergency_Patient.DoctorId else "",
            'DoctorRelation': Emergency_Patient.DoctorRelation,
            'DonationType': Emergency_Patient.DonationType.Donation_Id if Emergency_Patient.DonationType else None,
            'AdmissionPurpose': admission_instance.AdmissionPurpose if admission_instance else '',
            'DrInchargeAtTimeOfAdmission': admission_instance.DrInchargeAtTimeOfAdmission.Doctor_ID if admission_instance and admission_instance.DrInchargeAtTimeOfAdmission else '',
            'NextToKinName': admission_instance.NextToKinName if admission_instance else '',
            'Relation': admission_instance.Relation if admission_instance else '',
            'RelativePhoneNo': admission_instance.RelativePhoneNo if admission_instance else '',
            'PersonLiableForBillPayment': admission_instance.PersonLiableForPayment if admission_instance else '',
            'FamilyHead': admission_instance.FamilyHead if admission_instance else '',
            'FamilyHeadName': admission_instance.FamilyHeadName if admission_instance else '',
            'IpKitGiven': admission_instance.IpKitGiven if admission_instance else '',
            'IsReferal': Emergency_Patient.IsReferral,
        }

        if referral_details:
            Registration_dict.update({
                'ReferralSource': referral_details.ReferralSource,
                'ReferredBy': f"{referral_details.ReferredBy.Tittle.Title_Name}.{referral_details.ReferredBy.First_Name} {referral_details.ReferredBy.Last_Name}" if referral_details.ReferredBy else None,
            })

        print(Registration_dict, 'Registration_dict')

        return JsonResponse(Registration_dict, safe=False)
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)



#-------Jeeva ----- Dont Change the code ------------------


@csrf_exempt
@require_http_methods(["GET"])
def Patients_Management_Filter(request):
    try:
        search_query = request.GET.get('search', '')
        gender = request.GET.get('gender', '')  
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')

        queryset = Patient_Detials.objects.all()

        # Search query filter
        if search_query:
            queryset = queryset.filter(
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientId__icontains=search_query) |
                Q(PhoneNo__icontains=search_query) |
                Q(UniqueIdNo__icontains=search_query)
            )
        
        # Gender filter
        if gender:
            queryset = queryset.filter(Gender__iexact=gender)  

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

        # Prepare response data
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'Pincode': patient.Pincode,
                'ExistingPtNo': patient.ExistingPtNo,
                'FatherName': patient.FatherName if patient else '',
                'SpouseName': patient.SpouseName if patient else '',
                
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
                
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'Email': patient.Email,
                'UHIDNo': patient.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
            
            } for idx, patient in enumerate(queryset, start=1)
        ]

       
        return JsonResponse( patient_data, safe=False)

      


    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Patients_Management_Filter_OPVisitEntry(request):
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
            patients = Patient_Detials.objects.filter(
                Q(PatientId__icontains=patientsearch) |
                Q(PhoneNo__icontains=patientsearch) |
                Q(FirstName__icontains=patientsearch)
            )
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientId,
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
 
        queryset = Patient_Detials.objects.filter(DuplicateId=False)[:20]
 
        filter_conditions = Q()
        if search_query:
            filter_conditions &= (
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientId__icontains=search_query) |
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
                'PatientId': patient.PatientId,
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
def Patients_Management_Filter_OPVisitEntry_Pharm(request):
    try:
        # Extract parameters from the request
        patientsearch = request.GET.get('PatientId', '')
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
            patients = Patient_Detials.objects.filter(
                Q(PatientId__icontains=patientsearch) |
                Q(PhoneNo__icontains=patientsearch) |
                Q(FirstName__icontains=patientsearch)
            )[:5]
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientId,
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
 
        queryset = Patient_Detials.objects.filter(DuplicateId=False)[:5]
 
        filter_conditions = Q()
        if search_query:
            filter_conditions &= (
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientId__icontains=search_query) |
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
                'PatientId': patient.PatientId,
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
def Total_Patients_Count(request):
    try:
        search_query = request.GET.get('search', '')
        gender = request.GET.get('gender', '')  
        abha_filter = request.GET.get('Abha', '')  
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
 
        queryset = Patient_Detials.objects.all()
 
        # Search query filter
        if search_query:
            queryset = queryset.filter(
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
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
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'Pincode': patient.Pincode,
                'ExistingPtNo': patient.ExistingPtNo,
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
 
 
 

#-------Jeeva ----- Dont Change the code ------------------

@csrf_exempt
@require_http_methods(["GET"])
def Register_Patients_Details(request):
    try:
        # Get the 'status' parameter from the request
        status = request.GET.get('status', '')

        # Filter patients based on the 'status' parameter
        queryset = Patient_Detials.objects.all().order_by('-created_at')
        # print(queryset.count,'counttttttt')
        if status:
            queryset = queryset.filter(Status__iexact=status)  # Match 'Saved' exactly, case-insensitive

        # Prepare patient data for the response
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'Title': patient.Title.Title_Id if patient.Title else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'ExistingPtNo': patient.ExistingPtNo,
                'DateOfReg': patient.DateOfReg,
                'OldDepartment' : patient.OldDepartment if patient.OldDepartment else None,
                'LastVisitDate': patient.LastVisitDate,
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
                'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),

                'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                
                
                # 'Pincode': patient.PermanentPincode if patient else patient.Pincode,
                # 'Street': patient.Street,
                # 'Area': patient.Area,
                # 'City': patient.City,
                # 'District': patient.District,
                # 'State': patient.State,
                # 'Country': patient.Country,
                'ABHA': patient.ABHA,
                'Email': patient.Email,
                'Status': patient.Status,
                'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
                'SpecializationId': patient.SpecializationId.Speciality_Id if patient.SpecializationId else None,
               
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),

                'created_by' : patient.created_by
            }
            for idx, patient in enumerate(queryset, start=1)
        ]

        return JsonResponse(patient_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Fetch_Register_Patients_Details(request):
    try:
        # Get the PatientId from the query parameters
        patient_id = request.GET.get('PatientId')
 
        if not patient_id:
            return JsonResponse({'error': 'PatientId parameter is required'}, status=400)
 
        # Fetch the patient details based on the provided PatientId
        patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
 
        if not patient:
            return JsonResponse({'error': 'Patient not found'}, status=404)
       
        # idx = 1
        # Prepare patient data for the response
        patient_data = {
            # 'id': idx,
            'PatientId': patient.PatientId,
            'Title': patient.Title.Title_Id if patient.Title else None,
            'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
            'AppointmentId': patient.appointmentId.pk if patient.appointmentId else None,
            'DateOfReg': patient.DateOfReg,
            'LastVisitDate': patient.LastVisitDate,
            'OldDepartment' : patient.OldDepartment,
            'YearNo' : patient.YearNo,
            'ExistingPtNo' : patient.ExistingPtNo,
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
            'AppointmentType': patient.appointmentId.appointment_type if  patient.appointmentId else None,
            'ReferalDoctor_Id': patient.appointmentId.ReferredBy.Doctor_ID if  patient.appointmentId and patient.appointmentId.ReferredBy else None,
            'ReferalDoctorName': " ".join(filter(None, [
                                    getattr(patient.appointmentId.ReferredBy.Tittle, 'Title_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy and patient.appointmentId.ReferredBy.Tittle else '',
                                    getattr(patient.appointmentId.ReferredBy, 'First_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy else '',
                                    getattr(patient.appointmentId.ReferredBy, 'Middle_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy else '',
                                    getattr(patient.appointmentId.ReferredBy, 'Last_Name', '') if patient.appointmentId and patient.appointmentId.ReferredBy else ''
                                ])),
 
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
@require_http_methods(['GET'])
def Patient_Master_List(request):
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
            patient = Patient_Detials.objects.get(pk=patient_id)
            OP_patient_data = Patient_Appointment_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            IP_patient_data = Patient_IP_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            Casuality_patient_data = Patient_Casuality_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            Diagnosis_patient_data = Patient_Diagnosis_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
            Laboratory_patient_data = Patient_Laboratory_Registration_Detials.objects.filter(PatientId__PatientId=patient_id)
             
           
            patient_dict = {
                'Photo': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'PatientId': patient.PatientId,
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
@require_http_methods(["GET"])
def Patients_Counts(request):
    try:
        # Calculate today's, monthly, and yearly counts
        today = date.today()
        current_year = today.year
        current_month = today.month

        total_today_count = Patient_Detials.objects.filter(created_at__date=today).count()
        total_month_count = Patient_Detials.objects.filter(
            created_at__year=current_year,
            created_at__month=current_month
        ).count()
        total_year_count = Patient_Detials.objects.filter(
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
@require_http_methods(["GET"])
def get_IP_Patient_Details_by_patientId(request):
    try:
        PatientId = request.GET.get("PatientId", "").strip()
        FirstName = request.GET.get("FirstName", "").strip()
        PhoneNumber = request.GET.get("PhoneNumber", "").strip()

        patient = None
        
        if PatientId:
            patient = Patient_IP_Registration_Detials.objects.filter(
                Q(PatientId__PatientId=PatientId) & Q(PatientId__DuplicateId=False)
            ).first()
        elif FirstName and PhoneNumber:
            patient = Patient_Detials.objects.filter(
                Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False)
            ).first()

        if not patient:
            return JsonResponse({'warn': 'Patient does not exist'})

        patient_id = patient.PatientId  # Ensure this is a Patient_Detials instance

        # Fix: Ensure we're filtering by patient_id, not the patient object
        roomdata = Patient_Admission_Room_Detials.objects.filter(
            IP_Registration_Id__PatientId=patient_id, Status=True, IsStayed=True
        ).exclude(Iscanceled=True, CurrentlyStayed=True).first()

        # Construct Address dynamically, ensuring no extra commas
        if patient_id.DoorNo:
            address_parts = filter(None, [
                patient_id.DoorNo,
                patient_id.Street,
                patient_id.Area,
                patient_id.City,
                patient_id.State,
                patient_id.Country,
                patient_id.Pincode
            ])
            full_address = ", ".join(address_parts)
        else:
            full_address = "No address available"

        # Get Ward Name & Bed Number if available
        ward_name = None
        if roomdata and roomdata.RoomId:
            ward_name = f"""{roomdata.RoomId.Ward_Name.Ward_Name.Ward_Name}/{roomdata.RoomId.Bed_No}"""

        Patient_data = {
            'PatientProfile': get_file_image(patient_id.Patient_profile) if patient_id.Patient_profile else None,
            'PatientName': f'{patient_id.Title.Title_Name}.{patient_id.FirstName} {patient_id.MiddleName} {patient_id.SurName}' if patient_id.FirstName else None,
            'PatientId': patient_id.PatientId,
            'RegistrationId': patient.Registration_Id,
            'PhoneNo': int(patient_id.PhoneNo) if patient_id.PhoneNo and patient_id.PhoneNo.isdigit() else None,
            'Title': getattr(patient_id.Title, 'Title_Name', None),
            'FirstName': patient_id.FirstName,
            'MiddleName': patient_id.MiddleName,
            'SurName': patient_id.SurName,
            'AgeGender': f'{patient_id.Age}/{patient_id.Gender}' if patient_id.Age else None,
            'Gender': patient_id.Gender,
            'MaritalStatus': patient_id.MaritalStatus,
            'SpouseName': patient_id.SpouseName,
            'FatherName': patient_id.FatherName,
            'DOB': patient_id.DOB,
            'Age': patient_id.Age,
            'ABHA': patient_id.ABHA,
            'Email': patient_id.Email,
            'BloodGroup': getattr(patient_id.BloodGroup, 'BloodGroup_Id', None),
            'Occupation': patient_id.Occupation,
            'Religion': getattr(patient_id.Religion, 'Religion_Id', None),
            'Nationality': patient_id.Nationality,
            'UHIDType': patient_id.UniqueIdType,
            'UHIDNo': patient_id.UniqueIdNo,
            'PatientType': patient_id.PatientType,
            'PatientCategory': getattr(patient, 'PatientCategory', None),
            'DoorNo': patient_id.DoorNo,
            'Street': patient_id.Street,
            'Area': patient_id.Area,
            'City': patient_id.City,
            'District': patient_id.District,
            'State': patient_id.State,
            'Country': patient_id.Country,
            'Pincode': patient_id.Pincode,
            'Address': full_address,
            "WardName": ward_name,
            'Ipno':patient.Registration_Id if patient.Registration_Id else None,
            'AdmissionDate': patient.created_at.strftime("%d/%M/%Y %I:%M %p"),

        }

        return JsonResponse(Patient_data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})




@csrf_exempt
@require_http_methods(["GET"])
def Filter_IP_Patient_by_Multiple_Criteria(request):
    try:
        # Fetch query parameters
        first_name = request.GET.get("FirstName", '').strip()
        phone_no = request.GET.get("PhoneNo", '').strip()
        patient_id = request.GET.get("PatientId", '').strip()

        print(first_name, 'FirstName')
        print(phone_no, 'PhoneNo')
        print(patient_id, 'PatientId')

        # Build filter conditions
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(FirstName__icontains=first_name)
        if phone_no:
            filter_conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__icontains=patient_id)

        # Query the database
        patients = Patient_IP_Registration_Detials.objects.filter(filter_conditions)

        # Prepare patient data
        patient_data = [
            {
                'PatientId': patient.PatientId.PatientId,
                'PhoneNo': int(patient.PatientId.PhoneNo) if patient.PatientId.PhoneNo and patient.PatientId.PhoneNo.isdigit() else None,
                'FirstName': patient.PatientId.FirstName,
            } for patient in patients
        ]

        return JsonResponse(patient_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Patient_BasicDetails_Update(request):

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
            patient = Patient_Detials.objects.get(PatientId=patient_id)
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

            LabPatient = Register_patient_Details.objects.filter(Patient_Id=patient_id).first()
            print(LabPatient,'LabPatient')
            if LabPatient:

                LabPatient.Title = Title_instance.Title_Name
                LabPatient.Patient_Name = patient.FirstName
                LabPatient.Age = patient.Age
                LabPatient.Gender = patient.Gender
                LabPatient.save()

           

            return JsonResponse({'success': 'Patient details updated successfully'})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
def get_Employee_by_PatientCategory(request):
    if request.method == 'GET':
        try:
            
            # Retrieve all employees, you might want to filter this based on specific criteria
            employee_query_set = Employee_Personal_Form_Detials.objects.all()
            
            # Check if any employee records exist
            if not employee_query_set.exists():
                return JsonResponse({'error': 'No employees found'})
            
            emp_datas = []
            for emp in employee_query_set:
                emp_dict = {
                    'id': emp.Employee_ID,
                    'Name': f"""{emp.Tittle.Title_Name if emp.Tittle else ''}.{emp.First_Name if emp.First_Name else ''} {emp.Middle_Name if emp.Middle_Name else ''} {emp.Last_Name if emp.Last_Name else ''}""",
                    # 'ShortName': f'{emp.Tittle}.{emp.First_Name} {emp.Last_Name}',
                }
                emp_datas.append(emp_dict)
            
            # Return JSON response
            return JsonResponse(emp_datas, safe=False)
        
        except Exception as e:
            # Handle exceptions and return error response
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)




        

@csrf_exempt
def get_DoctorId_by_PatientCategory(request):
    if request.method == 'GET':
        try:
            

            # Retrieve all employees, you might want to filter this based on specific criteria
            Doctor_query_set = Doctor_Personal_Form_Detials.objects.all()
            
            # Check if any employee records exist
            if not Doctor_query_set.exists():
                return JsonResponse({'error': 'No Doctor found'})
            
            Doc_datas = []
            for Doc in Doctor_query_set:
                Doc_dict = {
                    'id': Doc.Doctor_ID,
                    'Name': f"""{Doc.Tittle.Title_Name if Doc.Tittle else ''}.{Doc.First_Name if Doc.First_Name else ''} {Doc.Middle_Name if Doc.Middle_Name else ''} {Doc.Last_Name if Doc.Last_Name else ''}""",
                    'ShortName': f"""{Doc.Tittle.Title_Name if Doc.Tittle else ''}.{Doc.ShortName}""",
                }
                Doc_datas.append(Doc_dict)
            
            # Return JSON response
            return JsonResponse(Doc_datas, safe=False)
        
        except Exception as e:
            # Handle exceptions and return error response
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)





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


#-------Jeeva ----- Dont Change the code ------------------
import calendar

def calculate_age(dob):
    if not dob:
        return None

    # Convert DOB string to date
    if isinstance(dob, str):
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
            try:
                dob = datetime.strptime(dob, fmt).date()
                break
            except ValueError:
                continue
        else:
            return None

    today = date.today()

    years = today.year - dob.year
    months = today.month - dob.month
    days = today.day - dob.day

    # Adjust negative days
    if days < 0:
        months -= 1

        if today.month == 1:
            prev_month = 12
            prev_year = today.year - 1
        else:
            prev_month = today.month - 1
            prev_year = today.year

        days += calendar.monthrange(prev_year, prev_month)[1]

    # Adjust negative months
    if months < 0:
        years -= 1
        months += 12

    return f"{years} Y, {months} M, {days} D"



@csrf_exempt
@require_http_methods(["GET"])
def get_Patient_Details_by_patientId(request):
    try:
        PatientId = request.GET.get("PatientId", '').strip()
        FirstName = request.GET.get("FirstName", '').strip()
        PhoneNumber = request.GET.get("PhoneNumber", '').strip()
 
        print(PatientId, 'PatientId')
        print(FirstName, 'FirstName')
        print(PhoneNumber, 'PhoneNumber')
 
 
 
        if Patient_Detials.objects.exists():
            patient = None
            print('hiiiii')
 
            if PatientId:
               
               
               
 
                patient = Patient_Detials.objects.get(Q(PatientId=PatientId) & Q(DuplicateId=False))
            elif FirstName and PhoneNumber:
                print('hiiiii')
                if Patient_Detials.objects.filter(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False)).exists():
                    patient = Patient_Detials.objects.get(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False))
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
                    'Age': calculate_age(patient.DOB),  # ✅ dynamic age
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
        return JsonResponse({'error': str(e)})
 
 
   
 
        

@csrf_exempt
@require_http_methods(["GET"])
def get_Patient_Previous_Visit_Details(request):
    try:
        PatientId = request.GET.get("PatientId", '')
        FirstName = request.GET.get('FirstName', '')
        PhoneNo = request.GET.get('PhoneNumber', '')

        # Fetch patient record
        Patient_Instance = Patient_Detials.objects.filter(
            Q(PhoneNo=PhoneNo, FirstName=FirstName) | Q(PatientId=PatientId)
        ).first()

        if not Patient_Instance:
            return JsonResponse({'warn': 'Patient does not exist'})

        # Initialize OP_Patient_LastVisit as an empty dictionary
        OP_Patient_LastVisit = {}

        # Fetch latest appointment
        OP_Patient_latest_appointment = Patient_Appointment_Registration_Detials.objects.filter(
            PatientId=Patient_Instance
        ).order_by('-updated_at').first()

        OP_Patient_latest_Doctor_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id__PatientId=Patient_Instance
        ).order_by('-updated_at').first()

        # Fetch follow-up instructions
        FollowupAndInstruction = OPD_GeneralAdviceFollowUp.objects.filter(
            Patient_Id=Patient_Instance
        ).order_by('-created_at').first()

        print(FollowupAndInstruction, 'FollowupAndInstruction')

        # Add Follow-up details if available
        if FollowupAndInstruction:
            OP_Patient_LastVisit['AdvisedReviewDate'] = FollowupAndInstruction.Date if FollowupAndInstruction.Date else None
            OP_Patient_LastVisit['AdvisedInstructions'] = FollowupAndInstruction.GeneralAdivice if FollowupAndInstruction.GeneralAdivice else ''
            OP_Patient_LastVisit['created_by'] = FollowupAndInstruction.created_by if FollowupAndInstruction.created_by else ''

        # Add appointment details if available
        if OP_Patient_latest_appointment:
            OP_Patient_LastVisit.update({
                # 'Doctor_ID': OP_Patient_latest_Doctor_appointment.PrimaryDoctor.Doctor_ID if OP_Patient_latest_appointment.PrimaryDoctor else '',
                # 'DoctorName': (
                #     f"{OP_Patient_latest_Doctor_appointment.PrimaryDoctor.Tittle.Title_Name} "
                #     f"{OP_Patient_latest_Doctor_appointment.PrimaryDoctor.First_Name} "
                #     f"{OP_Patient_latest_Doctor_appointment.PrimaryDoctor.Last_Name}"
                #     if OP_Patient_latest_Doctor_appointment.PrimaryDoctor else ''
                # ),
                
                'lastVisitDate': (
                    OP_Patient_latest_appointment.updated_at.strftime('%d-%m-%Y')
                    if OP_Patient_latest_appointment.updated_at else None
                ),
                'lastBookedBy':(
                    # OP_Patient_latest_appointment.ApptoRegId.created_by if OP_Patient_latest_appointment.ApptoRegId else '',
                    OP_Patient_latest_appointment.created_by if OP_Patient_latest_appointment else '',
                )
            })

        if OP_Patient_LastVisit:
            return JsonResponse(OP_Patient_LastVisit)
        else:
            return JsonResponse({'warn': 'No previous visit details found'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})




@csrf_exempt
@require_http_methods(["GET"])
def get_Patient_Previous_Visit_Details_Duplicate(request):
    try:
        current_date_str = request.GET.get('CurrentDate', '').strip()  # Get date as string
        from_date_str = request.GET.get('startDate', '').strip()
        to_date_str = request.GET.get('endDate', '').strip()
        status = request.GET.get('status', '')

        # Convert current_date string to a datetime object
        if current_date_str:
            current_date = datetime.strptime(current_date_str, "%Y-%m-%d").date()
            tomorrow_date = current_date + timedelta(days=1)
        else:
            current_date = None
            tomorrow_date = None

        # Convert from_date and to_date to datetime if provided
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else None
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else None

        # Apply query conditions
        query = Q()

        if current_date:
            query &= Q(Date__range=[current_date, tomorrow_date])
        elif from_date and to_date:
            query &= Q(Date__range=[from_date, to_date])

        # if status:
        #     query &=Q(status__icontains=status) 

        if status:
            if status.lower() in ["true", "1"]:
                query &= Q(Status=True)
            elif status.lower() in ["false", "0"]:
                query &= Q(Status=False)
       

        FollowupAndInstruction = OPD_GeneralAdviceFollowUp.objects.filter(query)

        print(FollowupAndInstruction, 'FollowupAndInstruction')

        Followup_Patients = [
            {
                'id': Follow.Patient_Id.appointmentId.appointment_id if Follow.Patient_Id.appointmentId else None,
                'AppointmentId': Follow.Patient_Id.appointmentId.appointment_id if Follow.Patient_Id.appointmentId else None,
                # 'id': Follow.NextReview_Id,
                'Patient_Id': Follow.Patient_Id.PatientId,
                'Registration_Id': Follow.Registration_Id.Registration_Id if Follow.Registration_Id else '',
                'Status': Follow.Status,
                'created_by': Follow.created_by,
                'PhoneNo': Follow.Patient_Id.PhoneNo,
                'Gender': Follow.Patient_Id.Gender,
                'FirstName': Follow.Patient_Id.FirstName,
                'MiddleName': Follow.Patient_Id.MiddleName,
                'LastName': Follow.Patient_Id.SurName,
                # 'FollowupDate': Follow.Date.strftime("%d-%m-%Y") if Follow.Date else None,
                'FollowupDate': datetime.strptime(Follow.Date, "%Y-%m-%d").strftime("%d-%m-%Y") if Follow.Date else None,
                # 'FollowupDate': Follow.Date,
                'PatientName': (
                    f"{getattr(Follow.Patient_Id.Title,'Title_Name','')}."
                    if getattr(Follow.Patient_Id.Title, 'Title_Name','') else ""
                ) + f"{getattr(Follow.Patient_Id,'FirstName','')} "
                    f"{getattr(Follow.Patient_Id,'MiddleName','')} "
                    f"{getattr(Follow.Patient_Id,'SurName','')}"
                    if Follow and Follow.Patient_Id else None,
                'Fullname': (
                    f"{getattr(Follow.Patient_Id.Title,'Title_Name','')}."
                    if getattr(Follow.Patient_Id.Title, 'Title_Name','') else ""
                ) + f"{getattr(Follow.Patient_Id,'FirstName','')} "
                    f"{getattr(Follow.Patient_Id,'MiddleName','')} "
                    f"{getattr(Follow.Patient_Id,'SurName','')}"
                    if Follow and Follow.Patient_Id else None,
            }
            for Follow in FollowupAndInstruction
        ]

        count_filters = {}

        if current_date:
            count_filters['Date__range'] = [current_date, tomorrow_date]
        elif from_date and to_date:
            count_filters['Date__range'] = [from_date, to_date]

        followup_count = OPD_GeneralAdviceFollowUp.objects.filter(**count_filters).count()
        
        response_data = {
            "followup_count": followup_count,
            "followup_patients": Followup_Patients,
        }
        
        print("Response Data:", response_data)
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})




#-------Jeeva ----- Dont Change the code ------------------


@csrf_exempt
@require_http_methods(["GET"])
def get_registered_patient_details(request):
    if request.method == 'GET':
        try:
            RegistrationId = request.GET.get("RegistrationId", '').strip()
 
            if RegistrationId:
                reg = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id=RegistrationId).last()
                print('regggggg',reg)
 
                full_name = f"{reg.Registration_Id.PatientId.Title.Title_Name if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.Title else ''}.{reg.Registration_Id.PatientId.FirstName if reg.Registration_Id and reg.Registration_Id.PatientId else ''} {reg.Registration_Id.PatientId.MiddleName if reg.Registration_Id and reg.Registration_Id.PatientId else ''} {reg.Registration_Id.PatientId.SurName if reg.Registration_Id and reg.Registration_Id.PatientId else ''}"
                formatted_date = reg.Registration_Id.created_at.strftime("%d-%M-%Y") if reg.Registration_Id else ''
 
                doc_pro = None
                doctor_name = 'Self'
 
 
                if reg.PrimaryDoctor:
                    doc_pro = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = reg.PrimaryDoctor.Doctor_ID).first()
                    doctor_name =f"{reg.PrimaryDoctor.Tittle.Title_Name}.{reg.PrimaryDoctor.First_Name} {reg.PrimaryDoctor.Middle_Name} {reg.PrimaryDoctor.Last_Name} ({doc_pro.Qualification})" if reg.PrimaryDoctor else None
                categoryname = None
                categoryid = None
                if reg.Registration_Id.PatientCategory == 'Insurance':
                    categoryname = reg.Registration_Id.InsuranceName.Insurance_Name if reg.Registration_Id and reg.Registration_Id.InsuranceName else None
                    categoryid = reg.Registration_Id.InsuranceName.Insurance_Id if reg.Registration_Id and reg.Registration_Id.InsuranceName else None
                elif reg.Registration_Id.PatientCategory == 'Client':
                    categoryname = reg.Registration_Id.ClientName.Client_Name if reg.Registration_Id and reg.Registration_Id.ClientName else None
                    categoryid = reg.Registration_Id.ClientName.Client_Id if reg.Registration_Id and reg.Registration_Id.ClientName else None
 
                reg_data = {
                    'RegistrationId': reg.Registration_Id.Registration_Id if reg.Registration_Id else '',
                    'PatientId': reg.Registration_Id.PatientId.PatientId if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'DoctorId': reg.PrimaryDoctor.Doctor_ID if reg.PrimaryDoctor else None,
                    'PhoneNo': int(reg.Registration_Id.PatientId.PhoneNo) if reg.Registration_Id and reg.Registration_Id.PatientId.PhoneNo and reg.Registration_Id.PatientId.PhoneNo.isdigit() else None,
                    'Patient_Name':full_name.strip(),
                    'AgeGender': f"""{reg.Registration_Id.PatientId.Age if reg.Registration_Id and reg.Registration_Id.PatientId else '' }/{reg.Registration_Id.PatientId.Gender if reg.Registration_Id and reg.Registration_Id.PatientId else ''}""",
                    'Address': f"""{reg.Registration_Id.PatientId.DoorNo if reg.Registration_Id and reg.Registration_Id.PatientId else '' }, {reg.Registration_Id.PatientId.Street if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Area if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.City if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.State if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Country if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Pincode if reg.Registration_Id and reg.Registration_Id.PatientId else ''}""",
                    'VisitId': reg.Registration_Id.VisitId if reg.Registration_Id else '',
                    'VisitPurpose':reg.Registration_Id.VisitPurpose if reg.Registration_Id else '',
                    'PatientCategory':reg.Registration_Id.PatientCategory if reg.Registration_Id else '',
                    'PatientCategoryName': categoryname,
                    'Doctor_ShortName': doctor_name,
                    'Title' : reg.Registration_Id.PatientId.Title.Title_Name if reg.Registration_Id and reg.Registration_Id.PatientId.Title else '',
                    'FirstName' : reg.Registration_Id.PatientId.FirstName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'MiddleName' : reg.Registration_Id.PatientId.MiddleName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'SurName' : reg.Registration_Id.PatientId.SurName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Gender' : reg.Registration_Id.PatientId.Gender if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'DOB' : reg.Registration_Id.PatientId.DOB if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Age' : reg.Registration_Id.PatientId.Age if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Email' : reg.Registration_Id.PatientId.Email if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'BloodGroup' : reg.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.BloodGroup else None,
                    'Occupation' : reg.Registration_Id.PatientId.Occupation if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Religion' : reg.Registration_Id.PatientId.Religion.Religion_Id if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.Religion else None,
                    'Nationality' :reg.Registration_Id.PatientId.Nationality if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'UniqueIdType' : reg.Registration_Id.PatientId.UniqueIdType if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'UniqueIdNo' : reg.Registration_Id.PatientId.UniqueIdNo if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Complaint' : reg.Complaint,
                    'DoorNo' : reg.Registration_Id.PatientId.DoorNo if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Street' :reg.Registration_Id.PatientId.Street if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Area' :reg.Registration_Id.PatientId.Area if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'City' :reg.Registration_Id.PatientId.City if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'State' :reg.Registration_Id.PatientId.State if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Country' :reg.Registration_Id.PatientId.Country if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Pincode' :reg.Registration_Id.PatientId.Pincode if reg.Registration_Id and reg.Registration_Id.PatientId else '',  
                    'Date':formatted_date,
                }
            return JsonResponse(reg_data,safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_registered_patient_details_forQuickbilling(request):
    if request.method == 'GET':
        try:
            PatientId = request.GET.get("PatientId", '').strip()
 
            if PatientId:
                reg = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Registration_Id__PatientId__PatientId=PatientId
                        ).last()
 
                print('regggggg',reg)
 
                full_name = f"{reg.Registration_Id.PatientId.Title.Title_Name if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.Title else ''}.{reg.Registration_Id.PatientId.FirstName if reg.Registration_Id and reg.Registration_Id.PatientId else ''} {reg.Registration_Id.PatientId.MiddleName if reg.Registration_Id and reg.Registration_Id.PatientId else ''} {reg.Registration_Id.PatientId.SurName if reg.Registration_Id and reg.Registration_Id.PatientId else ''}"
                formatted_date = reg.Registration_Id.created_at.strftime("%d-%M-%Y") if reg.Registration_Id else ''
 
                doc_pro = None
                doctor_name = 'Self'
 
 
                if reg.PrimaryDoctor:
                    doc_pro = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = reg.PrimaryDoctor.Doctor_ID).first()
                    doctor_name =f"{reg.PrimaryDoctor.Tittle.Title_Name}.{reg.PrimaryDoctor.First_Name} {reg.PrimaryDoctor.Middle_Name} {reg.PrimaryDoctor.Last_Name} ({doc_pro.Qualification})" if reg.PrimaryDoctor else None
                categoryname = None
                categoryid = None
                if reg.Registration_Id.PatientCategory == 'Insurance':
                    categoryname = reg.Registration_Id.InsuranceName.Insurance_Name if reg.Registration_Id and reg.Registration_Id.InsuranceName else None
                    categoryid = reg.Registration_Id.InsuranceName.Insurance_Id if reg.Registration_Id and reg.Registration_Id.InsuranceName else None
                elif reg.Registration_Id.PatientCategory == 'Client':
                    categoryname = reg.Registration_Id.ClientName.Client_Name if reg.Registration_Id and reg.Registration_Id.ClientName else None
                    categoryid = reg.Registration_Id.ClientName.Client_Id if reg.Registration_Id and reg.Registration_Id.ClientName else None
 
                reg_data = {
                    'RegistrationId': reg.Registration_Id.Registration_Id if reg.Registration_Id else '',
                    'PatientId': reg.Registration_Id.PatientId.PatientId if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'DoctorId': reg.PrimaryDoctor.Doctor_ID if reg.PrimaryDoctor else None,
                    'PhoneNo': int(reg.Registration_Id.PatientId.PhoneNo) if reg.Registration_Id and reg.Registration_Id.PatientId.PhoneNo and reg.Registration_Id.PatientId.PhoneNo.isdigit() else None,
                    'Patient_Name':full_name.strip(),
                    'AgeGender': f"""{reg.Registration_Id.PatientId.Age if reg.Registration_Id and reg.Registration_Id.PatientId else '' }/{reg.Registration_Id.PatientId.Gender if reg.Registration_Id and reg.Registration_Id.PatientId else ''}""",
                    'Address': f"""{reg.Registration_Id.PatientId.DoorNo if reg.Registration_Id and reg.Registration_Id.PatientId else '' }, {reg.Registration_Id.PatientId.Street if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Area if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.City if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.State if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Country if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Pincode if reg.Registration_Id and reg.Registration_Id.PatientId else ''}""",
                    'VisitId': reg.Registration_Id.VisitId if reg.Registration_Id else '',
                    'VisitPurpose':reg.Registration_Id.VisitPurpose if reg.Registration_Id else '',
                    'PatientCategory':reg.Registration_Id.PatientCategory if reg.Registration_Id else '',
                    'PatientCategoryName': categoryname,
                    'Doctor_ShortName': doctor_name,
                    'Title' : reg.Registration_Id.PatientId.Title.Title_Name if reg.Registration_Id and reg.Registration_Id.PatientId.Title else '',
                    'FirstName' : reg.Registration_Id.PatientId.FirstName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'MiddleName' : reg.Registration_Id.PatientId.MiddleName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'SurName' : reg.Registration_Id.PatientId.SurName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Gender' : reg.Registration_Id.PatientId.Gender if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'DOB' : reg.Registration_Id.PatientId.DOB if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Age' : reg.Registration_Id.PatientId.Age if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Email' : reg.Registration_Id.PatientId.Email if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'BloodGroup' : reg.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.BloodGroup else None,
                    'Occupation' : reg.Registration_Id.PatientId.Occupation if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Religion' : reg.Registration_Id.PatientId.Religion.Religion_Id if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.Religion else None,
                    'Nationality' :reg.Registration_Id.PatientId.Nationality if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'UniqueIdType' : reg.Registration_Id.PatientId.UniqueIdType if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'UniqueIdNo' : reg.Registration_Id.PatientId.UniqueIdNo if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Complaint' : reg.Complaint,
                    'DoorNo' : reg.Registration_Id.PatientId.DoorNo if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Street' :reg.Registration_Id.PatientId.Street if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Area' :reg.Registration_Id.PatientId.Area if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'City' :reg.Registration_Id.PatientId.City if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'State' :reg.Registration_Id.PatientId.State if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Country' :reg.Registration_Id.PatientId.Country if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                    'Pincode' :reg.Registration_Id.PatientId.Pincode if reg.Registration_Id and reg.Registration_Id.PatientId else '',  
                    'Date':formatted_date,
                }
            return JsonResponse(reg_data,safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_registered_patient_details_forQuickbilling_forPharmacy(request):
    if request.method == 'GET':
        try:
            PatientId = request.GET.get("PatientId", '').strip()
            Type = request.GET.get("Type",'').strip()

            if Type == "OP":
 
                if PatientId:
                    reg = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                                Registration_Id__PatientId__PatientId=PatientId
                            ).last()
    
                    print('regggggg',reg)
    
                    full_name = f"{reg.Registration_Id.PatientId.Title.Title_Name if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.Title else ''}.{reg.Registration_Id.PatientId.FirstName if reg.Registration_Id and reg.Registration_Id.PatientId else ''} {reg.Registration_Id.PatientId.MiddleName if reg.Registration_Id and reg.Registration_Id.PatientId else ''} {reg.Registration_Id.PatientId.SurName if reg.Registration_Id and reg.Registration_Id.PatientId else ''}"
                    formatted_date = reg.Registration_Id.created_at.strftime("%d-%M-%Y") if reg.Registration_Id else ''
    
                    doc_pro = None
                    doctor_name = 'Self'
    
    
                    if reg.PrimaryDoctor:
                        doc_pro = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = reg.PrimaryDoctor.Doctor_ID).first()
                        doctor_name =f"{reg.PrimaryDoctor.Tittle.Title_Name}.{reg.PrimaryDoctor.First_Name} {reg.PrimaryDoctor.Middle_Name} {reg.PrimaryDoctor.Last_Name} ({doc_pro.Qualification})" if reg.PrimaryDoctor else None
                    categoryname = None
                    categoryid = None
                    if reg.Registration_Id.PatientCategory == 'Insurance':
                        categoryname = reg.Registration_Id.InsuranceName.Insurance_Name if reg.Registration_Id and reg.Registration_Id.InsuranceName else None
                        categoryid = reg.Registration_Id.InsuranceName.Insurance_Id if reg.Registration_Id and reg.Registration_Id.InsuranceName else None
                    elif reg.Registration_Id.PatientCategory == 'Client':
                        categoryname = reg.Registration_Id.ClientName.Client_Name if reg.Registration_Id and reg.Registration_Id.ClientName else None
                        categoryid = reg.Registration_Id.ClientName.Client_Id if reg.Registration_Id and reg.Registration_Id.ClientName else None
    
                    reg_data = {
                        'RegistrationId': reg.Registration_Id.Registration_Id if reg.Registration_Id else '',
                        'PatientId': reg.Registration_Id.PatientId.PatientId if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'DoctorId': reg.PrimaryDoctor.Doctor_ID if reg.PrimaryDoctor else None,
                        'PhoneNo': int(reg.Registration_Id.PatientId.PhoneNo) if reg.Registration_Id and reg.Registration_Id.PatientId.PhoneNo and reg.Registration_Id.PatientId.PhoneNo.isdigit() else None,
                        'Patient_Name':full_name.strip(),
                        'AgeGender': f"""{reg.Registration_Id.PatientId.Age if reg.Registration_Id and reg.Registration_Id.PatientId else '' }/{reg.Registration_Id.PatientId.Gender if reg.Registration_Id and reg.Registration_Id.PatientId else ''}""",
                        'Address': f"""{reg.Registration_Id.PatientId.DoorNo if reg.Registration_Id and reg.Registration_Id.PatientId else '' }, {reg.Registration_Id.PatientId.Street if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Area if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.City if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.State if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Country if reg.Registration_Id and reg.Registration_Id.PatientId else ''}, {reg.Registration_Id.PatientId.Pincode if reg.Registration_Id and reg.Registration_Id.PatientId else ''}""",
                        'VisitId': reg.Registration_Id.VisitId if reg.Registration_Id else '',
                        'VisitPurpose':reg.Registration_Id.VisitPurpose if reg.Registration_Id else '',
                        'PatientCategory':reg.Registration_Id.PatientCategory if reg.Registration_Id else '',
                        'PatientCategoryName': categoryname,
                        'Doctor_ShortName': doctor_name,
                        'Speciality' : reg.Specialization.Speciality_Name if reg.Specialization else None,

                        'Title' : reg.Registration_Id.PatientId.Title.Title_Name if reg.Registration_Id and reg.Registration_Id.PatientId.Title else '',
                        'FirstName' : reg.Registration_Id.PatientId.FirstName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'MiddleName' : reg.Registration_Id.PatientId.MiddleName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'SurName' : reg.Registration_Id.PatientId.SurName if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Gender' : reg.Registration_Id.PatientId.Gender if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'DOB' : reg.Registration_Id.PatientId.DOB if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Age' : reg.Registration_Id.PatientId.Age if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Email' : reg.Registration_Id.PatientId.Email if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'BloodGroup' : reg.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.BloodGroup else None,
                        'Occupation' : reg.Registration_Id.PatientId.Occupation if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Religion' : reg.Registration_Id.PatientId.Religion.Religion_Id if reg.Registration_Id and reg.Registration_Id.PatientId and reg.Registration_Id.PatientId.Religion else None,
                        'Nationality' :reg.Registration_Id.PatientId.Nationality if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'UniqueIdType' : reg.Registration_Id.PatientId.UniqueIdType if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'UniqueIdNo' : reg.Registration_Id.PatientId.UniqueIdNo if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Complaint' : reg.Complaint,
                        'DoorNo' : reg.Registration_Id.PatientId.DoorNo if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Street' :reg.Registration_Id.PatientId.Street if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Area' :reg.Registration_Id.PatientId.Area if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'City' :reg.Registration_Id.PatientId.City if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'State' :reg.Registration_Id.PatientId.State if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Country' :reg.Registration_Id.PatientId.Country if reg.Registration_Id and reg.Registration_Id.PatientId else '',
                        'Pincode' :reg.Registration_Id.PatientId.Pincode if reg.Registration_Id and reg.Registration_Id.PatientId else '',  
                        'Date':formatted_date,
                    }
                return JsonResponse(reg_data,safe=False)
            
            else:

                if PatientId:
                    reg = Patient_IP_Registration_Detials.objects.filter(
                                PatientId__PatientId=PatientId
                            ).order_by('-created_at').first()
 
    
                    print('regggggg',reg)
    
                    full_name = f"{reg.PatientId.Title.Title_Name if reg.Registration_Id and reg.PatientId and reg.PatientId.Title else ''}.{reg.PatientId.FirstName if reg.Registration_Id and reg.PatientId else ''} {reg.PatientId.MiddleName if reg.Registration_Id and reg.PatientId else ''} {reg.PatientId.SurName if reg.Registration_Id and reg.PatientId else ''}"
                    formatted_date = reg.created_at.strftime("%d-%M-%Y") if reg.Registration_Id else ''
    
                    doc_pro = None
                    doctor_name = 'Self'
    
    
                    if reg.PrimaryDoctor:
                        doc_pro = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = reg.PrimaryDoctor.Doctor_ID).first()
                        doctor_name =f"{reg.PrimaryDoctor.Tittle.Title_Name}.{reg.PrimaryDoctor.First_Name} {reg.PrimaryDoctor.Middle_Name} {reg.PrimaryDoctor.Last_Name} ({doc_pro.Qualification})" if reg.PrimaryDoctor else None
                    categoryname = None
                    categoryid = None
                    if reg.PatientCategory == 'Insurance':
                        categoryname = reg.InsuranceName.Insurance_Name if reg.Registration_Id and reg.InsuranceName else None
                        categoryid = reg.InsuranceName.Insurance_Id if reg.Registration_Id and reg.InsuranceName else None
                    elif reg.PatientCategory == 'Client':
                        categoryname = reg.ClientName.Client_Name if reg.Registration_Id and reg.ClientName else None
                        categoryid = reg.ClientName.Client_Id if reg.Registration_Id and reg.ClientName else None
    
                    reg_data = {
                        'RegistrationId': reg.Registration_Id if reg.Registration_Id else '',
                        'PatientId': reg.PatientId.PatientId if reg.Registration_Id and reg.PatientId else '',
                        'DoctorId': reg.PrimaryDoctor.Doctor_ID if reg.PrimaryDoctor else None,
                        'PhoneNo': int(reg.PatientId.PhoneNo) if reg.Registration_Id and reg.PatientId.PhoneNo and reg.PatientId.PhoneNo.isdigit() else None,
                        'Patient_Name':full_name.strip(),
                        'AgeGender': f"""{reg.PatientId.Age if reg.Registration_Id and reg.PatientId else '' }/{reg.PatientId.Gender if reg.Registration_Id and reg.PatientId else ''}""",
                        'Address': f"""{reg.PatientId.DoorNo if reg.Registration_Id and reg.PatientId else '' }, {reg.PatientId.Street if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.Area if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.City if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.State if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.Country if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.Pincode if reg.Registration_Id and reg.PatientId else ''}""",
                        # 'VisitId': reg.Registration_Id.VisitId if reg.Registration_Id else '',
                        # 'VisitPurpose':reg.Registration_Id.VisitPurpose if reg.Registration_Id else '',
                        'PatientCategory':reg.PatientCategory if reg.Registration_Id else '',
                        'PatientCategoryName': categoryname,
                        'Doctor_ShortName': doctor_name,
                        'Speciality' : reg.Specialization.Speciality_Name if reg.Specialization else None,
                        'Title' : reg.PatientId.Title.Title_Name if reg.Registration_Id and reg.PatientId.Title else '',
                        'FirstName' : reg.PatientId.FirstName if reg.Registration_Id and reg.PatientId else '',
                        'MiddleName' : reg.PatientId.MiddleName if reg.Registration_Id and reg.PatientId else '',
                        'SurName' : reg.PatientId.SurName if reg.Registration_Id and reg.PatientId else '',
                        'Gender' : reg.PatientId.Gender if reg.Registration_Id and reg.PatientId else '',
                        'DOB' : reg.PatientId.DOB if reg.Registration_Id and reg.PatientId else '',
                        'Age' : reg.PatientId.Age if reg.Registration_Id and reg.PatientId else '',
                        'Email' : reg.PatientId.Email if reg.Registration_Id and reg.PatientId else '',
                        'BloodGroup' : reg.PatientId.BloodGroup.BloodGroup_Name if reg.Registration_Id and reg.PatientId and reg.PatientId.BloodGroup else None,
                        'Occupation' : reg.PatientId.Occupation if reg.Registration_Id and reg.PatientId else '',
                        'Religion' : reg.PatientId.Religion.Religion_Id if reg.Registration_Id and reg.PatientId and reg.PatientId.Religion else None,
                        'Nationality' :reg.PatientId.Nationality if reg.Registration_Id and reg.PatientId else '',
                        'UniqueIdType' : reg.PatientId.UniqueIdType if reg.Registration_Id and reg.PatientId else '',
                        'UniqueIdNo' : reg.PatientId.UniqueIdNo if reg.Registration_Id and reg.PatientId else '',
                        'Complaint' : reg.Complaint,
                        'DoorNo' : reg.PatientId.DoorNo if reg.Registration_Id and reg.PatientId else '',
                        'Street' :reg.PatientId.Street if reg.Registration_Id and reg.PatientId else '',
                        'Area' :reg.PatientId.Area if reg.Registration_Id and reg.PatientId else '',
                        'City' :reg.PatientId.City if reg.Registration_Id and reg.PatientId else '',
                        'State' :reg.PatientId.State if reg.Registration_Id and reg.PatientId else '',
                        'Country' :reg.PatientId.Country if reg.Registration_Id and reg.PatientId else '',
                        'Pincode' :reg.PatientId.Pincode if reg.Registration_Id and reg.PatientId else '',  
                        'Date':formatted_date,
                    }
                return JsonResponse(reg_data,safe=False)

        

        except Exception as e:
            return JsonResponse({'error': str(e)})
 
 



#-------Jeeva ----- Dont Change the code ------------------



@csrf_exempt
@require_http_methods(["GET"])
def Filter_Patient_by_Multiple_Criteria(request):
    try:
        # Fetch query parameters
        first_name = request.GET.get("FirstName", '').strip()
        phone_no = request.GET.get("PhoneNo", '').strip()
        DoctorId = request.GET.get("DoctorId", '').strip()
        patient_id = request.GET.get("PatientId", '').strip()

        # Build filter conditions
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(Registration_Id__PatientId__FirstName__icontains=first_name)
        if phone_no:
            filter_conditions &= Q(Registration_Id__PatientId__PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(Registration_Id__PatientId__PatientId__icontains=patient_id)

        # Query the database (fetch without distinct field names)
        registration = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(filter_conditions).values(
            'Registration_Id__Registration_Id',
            'Registration_Id__PatientId__PatientId',
            'Registration_Id__PatientId__PhoneNo',
            'Registration_Id__PatientId__FirstName',
            'Registration_Id__PatientId__UniqueIdNo'
        ).distinct()[:10]

        seen = set()
        patient_datas = []
        for reg in registration:
            reg_id = reg.get('Registration_Id__Registration_Id')

            if reg_id not in seen:
                seen.add(reg_id)

                patient_data = {
                    'PatientId': reg.get('Registration_Id__PatientId__PatientId', ''),
                    'RegistrationId': reg.get('Registration_Id__Registration_Id', ''),
                    'PhoneNo': int(reg['Registration_Id__PatientId__PhoneNo']) if reg.get('Registration_Id__PatientId__PhoneNo') and str(reg['Registration_Id__PatientId__PhoneNo']).isdigit() else None,
                    'FirstName': reg.get('Registration_Id__PatientId__FirstName', ''),
                    'UniqueIdNo': reg.get('Registration_Id__PatientId__UniqueIdNo', ''),
                }
                patient_datas.append(patient_data)

        return JsonResponse(patient_datas, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Filter_Patient_by_Multiple_Criteria_for_Quickbilling(request):
    try:
        # Extract parameters from the request
        first_name = request.GET.get("FirstName", None)
        phone_no = request.GET.get("PhoneNo", None)
        patient_id = request.GET.get("PatientId", None)
        middle_name = request.GET.get("MiddleName", None)
        sur_name = request.GET.get("SurName", None)
        patientsearch = request.GET.get('patientsearch',None)
 
        print(first_name, 'FirstName')
        print(phone_no, 'PhoneNo')
        print(patient_id, 'PatientId')
        print(middle_name, 'MiddleName')
        print(sur_name, 'SurName')
 
        # Build filter conditions dynamically
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(FirstName__icontains=first_name)
        if middle_name:
            filter_conditions &= Q(MiddleName__icontains=middle_name)
        if sur_name:
            filter_conditions &= Q(SurName__icontains=sur_name)
        if phone_no:
            filter_conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__icontains=patient_id)
 
        if patientsearch:
            patientsearch = patientsearch.strip()
            print('inside patientsearch', patientsearch)
 
            patients = Patient_Detials.objects.filter(
                            Q(PatientId__icontains=patientsearch) |
                            Q(PhoneNo__icontains=patientsearch) |
                            Q(FirstName__icontains=patientsearch)
                        ) 
            
            
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            patient_data = [
                {
                    'PatientId': patient.PatientId,
                    'PhoneNo': str(patient.PhoneNo) if patient.PhoneNo else None,
                    'FirstName': patient.FirstName,
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'ABHA': patient.ABHA,
                    'UniqueIdNo': patient.UniqueIdNo,
                }
                for patient in patients
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Filter patient details based on conditions, limiting to 10 results
        patients = Patient_Detials.objects.filter(filter_conditions, DuplicateId=False)[:2000]
 
        # Prepare patient data for the response
        patient_data = [
            {
                'PatientId': patient.PatientId,
                'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'ABHA': patient.ABHA,
                'UniqueIdNo' : patient.UniqueIdNo
            } for patient in patients
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 

#-------Jeeva ----- Dont Change the code ------------------

# @csrf_exempt
# @require_http_methods(["GET"])
# def Filter_Patients_using_Multiple_Criteria(request):
#     try:
#         # Extract parameters from the request
#         first_name = request.GET.get("FirstName", None)
#         phone_no = request.GET.get("PhoneNo", None)
#         patient_id = request.GET.get("PatientId", None)
#         middle_name = request.GET.get("MiddleName", None)
#         sur_name = request.GET.get("SurName", None)

#         print(first_name, 'FirstName')
#         print(phone_no, 'PhoneNo')
#         print(patient_id, 'PatientId')
#         print(middle_name, 'MiddleName')
#         print(sur_name, 'SurName')

#         # Build filter conditions dynamically
#         filter_conditions = Q()
#         if first_name:
#             filter_conditions &= Q(FirstName__icontains=first_name)
#         if middle_name:
#             filter_conditions &= Q(MiddleName__icontains=middle_name)
#         if sur_name:
#             filter_conditions &= Q(SurName__icontains=sur_name)
#         if phone_no:
#             filter_conditions &= Q(PhoneNo__icontains=phone_no)
#         if patient_id:
#             filter_conditions &= Q(PatientId__icontains=patient_id)

#         # Filter patient details based on conditions, limiting to 10 results
#         patients = Patient_Detials.objects.filter(filter_conditions, DuplicateId=False)[:10]

#         # Prepare patient data for the response
#         patient_data = [
#             {
#                 'PatientId': patient.PatientId,
#                 'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
#                 'FirstName': patient.FirstName,
#                 'MiddleName': patient.MiddleName,
#                 'SurName': patient.SurName,
#                 'ABHA': patient.ABHA,
#             } for patient in patients
#         ]

#         return JsonResponse(patient_data, safe=False)

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Filter_Patients_using_Multiple_Criteria(request):
    try:
        # Extract parameters from the request
        first_name = request.GET.get("FirstName", None)
        phone_no = request.GET.get("PhoneNo", None)
        patient_id = request.GET.get("PatientId", None)
        middle_name = request.GET.get("MiddleName", None)
        sur_name = request.GET.get("SurName", None)
 
        patientsearch = request.GET.get('patientsearch',None)
 
        print(first_name, 'FirstName')
        print(phone_no, 'PhoneNo')
        print(patient_id, 'PatientId')
        print(middle_name, 'MiddleName')
        print(sur_name, 'SurName')
 
        # Build filter conditions dynamically
        filter_conditions = Q()
 
        if first_name:
            filter_conditions &= Q(FirstName__icontains=first_name)      
        if middle_name:
            filter_conditions &= Q(MiddleName__icontains=middle_name)
        if sur_name:
            filter_conditions &= Q(SurName__icontains=sur_name)
        if phone_no:
            filter_conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__icontains=patient_id)
 
        if patientsearch:
             
            patientsearch = patientsearch.strip()
 
            patients = Patient_Detials.objects.filter(
                            Q(PatientId__icontains=patientsearch) |
                            Q(PhoneNo__icontains=patientsearch) |
                            Q(FirstName__icontains=patientsearch)
                        )
           
           
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            patient_data = [
                {
                    'PatientId': patient.PatientId,
                'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'ABHA': patient.ABHA,
                }
                for patient in patients
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Filter patient details based on conditions, limiting to 10 results
        patients = Patient_Detials.objects.filter(filter_conditions, DuplicateId=False)[:10]
 
        # Prepare patient data for the response
        patient_data = [
            {
                'PatientId': patient.PatientId,
                'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'ABHA': patient.ABHA,
            } for patient in patients
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
 
 
 





@csrf_exempt
@require_http_methods(["GET"])
def Filter_IP_Patients_With_Completed_Status(request):
    try:
        # Extract parameters from the request
        first_name = request.GET.get("FirstName", None)
        phone_no = request.GET.get("PhoneNo", None)
        patient_id = request.GET.get("PatientId", None)
        middle_name = request.GET.get("MiddleName", None)
        sur_name = request.GET.get("SurName", None)
 
        print(first_name, 'FirstName')
        print(phone_no, 'PhoneNo')
        print(patient_id, 'PatientId')
        print(middle_name, 'MiddleName')
        print(sur_name, 'SurName')
 
        # Build filter conditions dynamically
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(FirstName__icontains=first_name)
        if middle_name:
            filter_conditions &= Q(MiddleName__icontains=middle_name)
        if sur_name:
            filter_conditions &= Q(SurName__icontains=sur_name)
        if phone_no:
            filter_conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__icontains=patient_id)
 
        # Exclude patients with "Admitted" or "Pending" status
        excluded_patients = Patient_IP_Registration_Detials.objects.filter(
            Q(Status="Admitted") | Q(Status="Pending")
        ).values_list("PatientId__PatientId", flat=True)
 
        # Filter patient details based on conditions, limiting to 10 results
        patients = Patient_Detials.objects.filter(filter_conditions, DuplicateId=False).exclude(PatientId__in=excluded_patients)
 
        print(f"Excluded Patients: {list(excluded_patients)}")
 
        # Prepare patient data for the response
        patient_data = [
            {
                'PatientId': patient.PatientId,
                'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo else None,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
            }
            for patient in patients
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#-------Jeeva ----- Dont Change the code ------------------



@csrf_exempt
@require_http_methods(["GET"])
def get_patient_appointment_details(request):
    try:
        SearchbyDate=request.GET.get('SearchbyDate')
        SearchbyFirstName=request.GET.get('SearchbyFirstName')
        SearchbyPhoneNumber=request.GET.get('SearchbyPhoneNumber')
        SearchSpecialization=request.GET.get('SearchSpecialization')
        SearchDoctor=request.GET.get('SearchDoctor')
        SearchStatus=request.GET.get('SearchStatus')

        
        Searchquery= Q()
        
        if SearchbyDate:
            search_date = datetime.strptime(SearchbyDate, "%Y-%m-%d").date()
            Searchquery &= Q(created_at__date=search_date)
        if SearchbyFirstName :
            Searchquery &= Q(PatientId__FirstName__icontains=SearchbyFirstName)
        if SearchbyPhoneNumber :
            Searchquery &= Q(PatientId__PhoneNo__icontains=SearchbyPhoneNumber)
        if SearchSpecialization:
            Searchquery &= Q(Specialization__pk=SearchSpecialization)
        if SearchDoctor:
            Searchquery &= Q(PrimaryDoctor__pk=SearchDoctor)
        if SearchStatus:
            Searchquery &= Q(Status__icontains=SearchStatus)

        print('Searchquery',Searchquery)

        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Searchquery)

        
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            
            # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
            # Prepare the appointment data dictionary
            appointment_dict = {
                
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId  else None,
                'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
                'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
                'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
                'Complaint': register.Complaint,
                'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
                'VisitType': register.VisitType,
                # 'Flagging': Flagging_name,
                # 'FlaggingColour': Flagging_color,
                'AppointmentSlot_by_Doctor':register.Registration_Id.AppointmentSlot_by_Doctor if register.Registration_Id else '',

                'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
                'Status': register.Registration_Id.Status if register.Registration_Id else '',
                'DoctorId': register.PrimaryDoctor.Doctor_ID if register.PrimaryDoctor.Doctor_ID else None, 
                'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',

                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.ShortName}",
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'UniqueIdType' : register.Registration_Id.PatientId.UniqueIdType if register.Registration_Id and register.Registration_Id.PatientId else '',
                'UniqueIdNo' : register.Registration_Id.PatientId.UniqueIdNo if register.Registration_Id and register.Registration_Id.PatientId else '',
            }

            # Add reason if status is "Cancelled"
            if register.Registration_Id.Status == "Cancelled":
                cancel_details = Patient_Appointment_Registration_Cancel_Details.objects.filter(
                    Registration_Id=register.pk
                ).first()
                appointment_dict['Reason'] = cancel_details.Cancel_Reason if cancel_details else None

            # Fetch reschedule reason if available
            reschedule_details = Patient_Registration_Reshedule_Details.objects.filter(
                Registration_Id=register.pk
            ).first()
            if reschedule_details:
                appointment_dict['ChangingReason'] = reschedule_details.ChangingReason

            appointment_register_data.append(appointment_dict)

        return JsonResponse(appointment_register_data, safe=False)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
def get_patient_unique_id(request):
    api_key = request.headers.get('Apikey')
    api_password = request.headers.get('Apipassword')
    sessionid = request.headers.get('Sessionid')
    if authenticate_request(sessionid, api_key, api_password):       
        if request.method == 'GET':
            try:
                patient_instance = Patient_Detials.objects.all()
                
                patient_details_data = []   
                for patient in patient_instance:
                    patient_dict ={
                        'PatientId' : patient.PatientId,
                        'PatientName': f"{patient.Title}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                        'PhoneNo': patient.PhoneNo,
                        'UniqueIdType' : patient.UniqueIdType,
                        'UniqueIdNo' : patient.UniqueIdNo,
                    }
                patient_details_data.append(patient_dict)
                return JsonResponse(patient_details_data,safe=False)
            except Exception as e:
                return JsonResponse({"error" : str(e)})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def get_patient_ip_registration_details(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')

        queryset = Patient_IP_Registration_Detials.objects.all()

        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )

        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        # Serialize the filtered queryset
        ip_register_data = []
        for idx, register in enumerate(queryset, start=1):
            patient = register.PatientId
            client_name = register.ClientName.Client_Name if register.ClientName else None
            insurance_name = register.InsuranceName.Insurance_Name if register.InsuranceName else None
            Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                'PhoneNo': patient.PhoneNo,
                'Age': patient.Age,
                'Gender': patient.Gender,
                'Address': f"{patient.DoorNo}.{patient.Street}.{patient.Area}.{patient.City}.{patient.State}.{patient.Country}.{patient.Pincode}",
                'BloodGroup': patient.BloodGroup,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'Flagging': Flagging_name,
                'FlaggingColour': Flagging_color,
                # 'Flagging': register.Flagging,
                'isRefferal': register.IsReferral,
                'ClientName': client_name,  # Handle None case
                'InsuranceName': insurance_name,  # Handle None case
                'Status': register.Status,
                'userName': register.created_by,
                'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                'Specialization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'CurrDate': register.created_at.strftime('%d-%m-%y') if register.created_at else "",
                'CurrTime': register.created_at.strftime('%I:%M %p') if register.created_at else "",
            }
            ip_register_data.append(appointment_dict)

        return JsonResponse(ip_register_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_casuality_details(request):
#         try:
           
#             query = request.GET.get('query', '')
#             status = request.GET.get('status', '')

#             queryset = Patient_Casuality_Registration_Detials.objects.all()

#             # Apply filters based on the query parameters
#             if query:
#                 queryset = queryset.filter(
#                     Q(PatientId__FirstName__icontains=query)|
#                     Q(PatientId__MiddleName__icontains=query)|
#                     Q(PatientId__SurName__icontains=query)|
#                     Q(PatientId__PatientId__icontains=query)|
#                     Q(PatientId__PhoneNo__icontains=query))
           
#             if status:
#                 queryset = queryset.filter(Q(Status__icontains=status))


#             # Serialize the filtered queryset
#             casuality_register_data = []
#             for idx, register in enumerate(queryset, start=1):
#                 Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#                 Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
             
#                 appointment_dict = {
#                     'id' : idx,
#                     'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId and register.PatientId.Patient_profile else None,
#                     'RegistrationId':register.pk,
#                     'PatientId': register.PatientId.PatientId if register.PatientId else None,
#                     'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
#                     'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
#                     'VisitId': register.VisitId,
#                     'Complaint': register.Complaint,
#                     'isMLC': register.IsMLC,
#                     'Flagging': Flagging_name,
#                     'FlaggingColour': Flagging_color,
#                     # 'Flagging': register.Flagging,
#                     'isRefferal': register.IsReferral,
#                     'Status': register.Status,
#                     'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                     'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 }
#                 casuality_register_data.append(appointment_dict)

#             return JsonResponse(casuality_register_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def get_patient_casuality_details(request):
        try:
           
            query = request.GET.get('query', '')
            status = request.GET.get('status', '')
 
            queryset = Patient_Casuality_Registration_Detials.objects.all()
 
            # Apply filters based on the query parameters
            if query:
                queryset = queryset.filter(
                    Q(PatientId__FirstName__icontains=query)|
                    Q(PatientId__MiddleName__icontains=query)|
                    Q(PatientId__SurName__icontains=query)|
                    Q(PatientId__PatientId__icontains=query)|
                    Q(PatientId__PhoneNo__icontains=query))
           
            if status:
                queryset = queryset.filter(Q(Status__icontains=status))
 
 
            # Serialize the filtered queryset
            casuality_register_data = []
            for idx, register in enumerate(queryset, start=1):
                Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
                Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
 
                patient_instance = Patient_Casuality_Registration_Detials.objects.filter(PatientId_id=register.PatientId.PatientId)
 
                for patient_ins in patient_instance:
 
 
                 PatientType_ins = Flaggcolor_Detials.objects.get(Flagg_Name=patient_ins.PatientType)
                 patientCategory_ins = Flaggcolor_Detials.objects.get(Flagg_Name=patient_ins.PatientCategory)
               
                 try:
                  specialtype_ins = Flaggcolor_Detials.objects.get(Flagg_Id=patient_ins.Flagging_id)
 
                 except Flaggcolor_Detials.DoesNotExist:
                    continue
               
 
                 specialtypelist = ['GENERAL','VIP','GOVT','INSURANCE','MLC','CLIENT','CORPORATE','DONATION','EMPLOYEE','EMPLOYEERELATION','DOCTOR','DOCTORRELATION']
           
                 if patient_ins.IsMLC == 'Yes':
 
                      mlc_ins = Flaggcolor_Detials.objects.get(Flagg_Name= 'MLC')
 
                      appointment_dict = {
                        'id' : idx,
                        'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId and register.PatientId.Patient_profile else None,
                        'RegistrationId':register.pk,
                        'PatientId': register.PatientId.PatientId if register.PatientId else None,
                        'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
                        'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
                        'Age': register.PatientId.Age,
                        'Gender': register.PatientId.Gender,
                        'VisitId': register.VisitId,
                        'Complaint': register.Complaint,
                        # 'isMLC': register.IsMLC,
                        # 'Flagging': Flagging_name,
                        # 'FlaggingColour': Flagging_color,
                        # 'Flagging': register.Flagging,
                        'isRefferal': register.IsReferral,
                        'Status': register.Status,
                        'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                        'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                     
                       
                        'PatientType': patient_ins.PatientType,
                        'patientTypeColor':PatientType_ins.Flagg_Color,
                        'PatientCategory':patient_ins.PatientCategory,
                        'patientCategoryColor':patientCategory_ins.Flagg_Color,
                        'IsMLC':   'MLC',
                        'MLCColor': mlc_ins.Flagg_Color,
                        'specialtype' : specialtype_ins.Flagg_Name if specialtype_ins.Flagg_Name  not in specialtypelist else 'GENERAL',
                        'specialtypecolor':specialtype_ins.Flagg_Color if specialtype_ins.Flagg_Name  not in specialtypelist else '#fff'
                       
                     }
                      casuality_register_data.append(appointment_dict)
 
                 else:
                    appointment_dict = {
                    'id' : idx,
                    'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId and register.PatientId.Patient_profile else None,
                    'RegistrationId':register.pk,
                    'PatientId': register.PatientId.PatientId if register.PatientId else None,
                    'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
                    'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
                    'Age': register.PatientId.Age,
                    'Gender': register.PatientId.Gender,
                    'VisitId': register.VisitId,
                    'Complaint': register.Complaint,
                    # 'isMLC': register.IsMLC,
                    # 'Flagging': Flagging_name,
                    # 'FlaggingColour': Flagging_color,
                    # 'Flagging': register.Flagging,
                    'isRefferal': register.IsReferral,
                    'Status': register.Status,
                    'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                    'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                   
                   
                    'PatientType': patient_ins.PatientType,
                    'patientTypeColor':PatientType_ins.Flagg_Color,
                    'PatientCategory':patient_ins.PatientCategory,
                    'patientCategoryColor':patientCategory_ins.Flagg_Color,
                    'IsMLC':   None,
                    'MLCColor': None,
                    'specialtype' : specialtype_ins.Flagg_Name if specialtype_ins.Flagg_Name  not in specialtypelist else 'GENERAL',
                    'specialtypecolor':specialtype_ins.Flagg_Color if specialtype_ins.Flagg_Name  not in specialtypelist else '#fff'
                   
                    }
                    casuality_register_data.append(appointment_dict)
               
                   
 
            return JsonResponse(casuality_register_data, safe=False)
 
        except Exception as e:
            return JsonResponse({'error': str(e)})
 


@csrf_exempt
@require_http_methods(["GET"])
def get_patient_diagnosis_details(request):
        try:
           
            query = request.GET.get('query', '')
            status = request.GET.get('status', '')

            queryset = Patient_Diagnosis_Registration_Detials.objects.all()

            # Apply filters based on the query parameters
            if query:
                queryset = queryset.filter(
                    Q(PatientId__FirstName__icontains=query)|
                    Q(PatientId__MiddleName__icontains=query)|
                    Q(PatientId__SurName__icontains=query)|
                    Q(PatientId__PatientId__icontains=query)|
                    Q(PatientId__PhoneNo__icontains=query))
           
            if status:
                queryset = queryset.filter(Q(Status__icontains=status))


            # Serialize the filtered queryset
            diagnosis_register_data = []
            for idx, register in enumerate(queryset, start=1): 
                Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
                Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
                appointment_dict = {
                    'id' : idx,
                    'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                    'RegistrationId':register.pk,
                    'PatientId': register.PatientId.PatientId,
                    'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                    'VisitId': register.VisitId,
                    'PhoneNo': register.PatientId.PhoneNo,
                    'Complaint': register.Complaint,
                    'isMLC': register.IsMLC,
                    'Flagging': Flagging_name,
                    'FlaggingColour': Flagging_color,
                    # 'Flagging': register.Flagging,
                    'isRefferal': register.IsReferral,
                    'Status': register.Status,
                }
                diagnosis_register_data.append(appointment_dict)

            return JsonResponse(diagnosis_register_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})
        


@csrf_exempt
@require_http_methods(["GET"])
def get_patient_laboratory_details(request):
        try:
           
            query = request.GET.get('query', '')
            status = request.GET.get('status', '')

            queryset = Patient_Laboratory_Registration_Detials.objects.all()

            # Apply filters based on the query parameters
            if query:
                queryset = queryset.filter(
                    Q(PatientId__FirstName__icontains=query)|
                    Q(PatientId__MiddleName__icontains=query)|
                    Q(PatientId__SurName__icontains=query)|
                    Q(PatientId__PatientId__icontains=query)|
                    Q(PatientId__PhoneNo__icontains=query))
           
            if status:
                queryset = queryset.filter(Q(Status__icontains=status))


            # Serialize the filtered queryset
            laboratory_register_data = []
            for idx, register in enumerate(queryset, start=1): 
                Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
                Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
                appointment_dict = {
                    'id' : idx,
                    'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                    'RegistrationId':register.pk,
                    'PatientId': register.PatientId.PatientId,
                    'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                    'PhoneNo': register.PatientId.PhoneNo,
                    'VisitId': register.VisitId,
                    'Complaint': register.Complaint,
                    'isMLC': register.IsMLC,
                    'Flagging': Flagging_name,
                    'FlaggingColour': Flagging_color,
                    # 'Flagging': register.Flagging,
                    'isRefferal': register.IsReferral,
                    'Status': register.Status,
                }
                laboratory_register_data.append(appointment_dict)

            return JsonResponse(laboratory_register_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})
        
   
@csrf_exempt
@require_http_methods(["GET"])
def get_patient_visit_details(request):
    try:
        # ──────────── query‑string params ────────────
        PatientId     = request.GET.get('PatientId',  '').strip()
        FirstName     = request.GET.get('FirstName',  '').strip()
        PhoneNo       = request.GET.get('PhoneNo',    '').strip()
        Speciality    = request.GET.get('Speciality', '').strip()     # str ID
        LastVisitDate = request.GET.get('LastVisitDate', '').strip()
        OldDepartment = request.GET.get('OldDepartment','').strip()
        DateOfReg = request.GET.get('DateOfReg','').strip()
        PateientCategory = request.GET.get('PateientCategory','').strip()
 
        print(PatientId,'PatientId',PateientCategory)
        print(FirstName,'FirstName')
        print(PhoneNo,'PhoneNo')
        print(LastVisitDate,'LastVisitDate')
        print(OldDepartment,'OldDepartment',Speciality,'Speciality',DateOfReg)
 
 
 
        # today = timezone.localdate()
        today = date.today()

        if PateientCategory in ['Student','Camp','FreeAll','KRCL','Employee','EmployeeRelation','Doctor','DoctorRelation']:

            return JsonResponse({'VisitPurpose': 'FollowUp No Fee'})

       
        if FirstName and PhoneNo:
            patient_filter = Q(FirstName=FirstName,PhoneNo=PhoneNo)
        if PatientId:
            patient_filter = Q(PatientId=PatientId)
            print(patient_filter,'patient_filter')
 
        patient = Patient_Detials.objects.filter(patient_filter).first()
 
        print(patient,'patient filterrrrrrrrrrrrr')
 
           
        if not patient:
            return JsonResponse({'VisitPurpose': 'NewConsultation'})
 
 
        if LastVisitDate and OldDepartment and Speciality:
 
            try:
                override_date = datetime.strptime(LastVisitDate, "%Y-%m-%d").date()
            except ValueError:
                override_date = None
 
            Specialityins = Speciality_Detials.objects.filter(Speciality_Id=Speciality).first()
 
            if Specialityins.Speciality_Name == OldDepartment:
 
                days = (today - override_date).days
                visit_purpose = (
                        'FollowUp No Fee'  if days <= 9 else
                        'FollowUp With Fee'
                    )
                return JsonResponse({'VisitPurpose': visit_purpose})
           
            else:
                return JsonResponse({'VisitPurpose': 'FollowUp With Fee'})
            
        # ──────────── 2. fast‑path: LastVisitDate override ────────────
        if DateOfReg:
            try:
                override_date = datetime.strptime(DateOfReg, "%Y-%m-%d").date()
            except ValueError:
                override_date = None                       # ignore bad format
 
            if override_date:
                exists_row = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id__PatientId=patient,
                    created_at__date=override_date
                ).exists()
 
                # ── 2a. date found in OP table – stick to old logic ──
                if exists_row:
                    days = (today - override_date).days
                    visit_purpose = (
                        'FollowUp No Fee'  if days <= 9 else
                        'FollowUp With Fee'
                    )
                    return JsonResponse({'VisitPurpose': visit_purpose})
 
                # ── 2b. date NOT found – still honour the date gap ──
                days = (today - override_date).days
                visit_purpose = (
                    'FollowUp No Fee'  if days <= 9 else
                    'FollowUp With Fee'
                )
                return JsonResponse({'VisitPurpose': visit_purpose})
 
        # ──────────── 3. original “old flow” continues ────────────
        latest_reg = (
            Patient_Appointment_Registration_Detials.objects
            .filter(PatientId=patient)
            .exclude(Status__iexact='cancelled')
            .order_by('-created_at')
            .first()
        )
        if not latest_reg:
            return JsonResponse({'VisitPurpose': 'NewConsultation'})

        latest_specialityvisit = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=latest_reg,Specialization__Speciality_Id = Speciality,VisitType__in=['NewConsultation','FollowUp With Fee']).last()
        print(latest_specialityvisit,'latest_specialityvisit')

        if latest_specialityvisit:

            validity_date = latest_specialityvisit.RenewDate - timedelta(days=1)
            days_since  = (today - validity_date).days

            print(validity_date, 'validity_date')
            print(latest_specialityvisit.RenewDate, 'renew_date')
            print(days_since,'days_since')

            if days_since <= 0:
                return JsonResponse({'VisitPurpose': 'FollowUp No Fee'})
            
            else :
                return JsonResponse({'VisitPurpose': 'FollowUp With Fee'})



        lastdiffspeciality = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__PatientId__PatientId=PatientId,Specialization__Speciality_Id = Speciality,VisitType__in=['NewConsultation','FollowUp With Fee']).last()
        print(lastdiffspeciality,'lastdiffspeciality')

        if lastdiffspeciality:

            validity_date = lastdiffspeciality.RenewDate - timedelta(days=1)
            days_since  = (today - validity_date).days

            print(validity_date, 'validity_date')
            print(lastdiffspeciality.RenewDate, 'renew_date')
            print(days_since,'days_since')

            if days_since <= 0:
                return JsonResponse({'VisitPurpose': 'FollowUp No Fee'})
            
            else :
                return JsonResponse({'VisitPurpose': 'FollowUp With Fee'})

        else:
            return JsonResponse({'VisitPurpose': 'FollowUp With Fee'})

 
        # latest_visit = (
        #     OP_Patient_Appointment_With_Multiple_Doctor.objects
        #     .filter(Registration_Id=latest_reg)
        #     .order_by('-created_at')
        #     .first()
        # )
        # if not latest_visit:
        #     return JsonResponse({'VisitPurpose': 'NewConsultation'})
 
        # last_visit_date = latest_visit.created_at.date()
        # RenewDate = latest_visit.RenewDate
        # days_since      = (today - last_visit_date).days
 
        # last_spec_id    = (
        #     str(latest_visit.Specialization.Speciality_Id)
        #     if latest_visit.Specialization else ''
        # )
        # same_speciality = (
        #     Speciality and last_spec_id and Speciality == last_spec_id
        # )
 
        # if same_speciality and days_since <= 9:
        #     visit_purpose = 'FollowUp No Fee'
        # else:
        #     visit_purpose = 'FollowUp With Fee'
 
        # return JsonResponse({'VisitPurpose': visit_purpose})
 
    except Exception as exc:
        return JsonResponse({'error': str(exc)}, status=500)
 
 
 

@csrf_exempt
@require_http_methods(["GET"])
def get_ip_registration_before_handover_details(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
 
        # Map status to Booking_Status
        Booking_Status = 'Booked' if status == 'Pending' else ('Occupied' if status == 'Admitted' else 'Cancelled')
 
        searchquery = Q()  # Initialize an empty Q object

# Apply filters based on 'query' input
        if query:
            searchquery &= (
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query) | 
                Q(Registration_Id__icontains=query)
            )

        # Apply filters based on 'status' input
        if status:
            searchquery &= Q(Status__icontains=status)

        # Always apply Booking_Status filter if needed
        searchquery &= Q(Booking_Status=Booking_Status)

        # Final queryset using combined filters and ordering
        queryset = Patient_IP_Registration_Detials.objects.filter(searchquery).order_by('-created_at')
 
        # Serialize the filtered queryset
        ip_register_data = []
        for idx, register in enumerate(queryset, start=1):
            # client_name = register.ClientName.Client_Name if register.ClientName else None
            # insurance_name = register.InsuranceName.Insurance_Name if register.InsuranceName else None
            Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None

            admissionpurpose = Patient_Admission_Detials.objects.filter(IP_Registration_Id = register.Registration_Id).first()
           
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else ''}.{register.PatientId.FirstName if register.PatientId else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                'Gender': register.PatientId.Gender,
                'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'Flagging': Flagging_name,
                'Specialization': register.Specialization.Speciality_Name if register.Specialization else '',
                'AdmissionDate': register.created_at.strftime('%d-%m-%Y') if register.created_at else None,
                'AdmissionTime': register.created_at.strftime('%I:%M %p') if register.created_at else None,
 
                'FlaggingColour': Flagging_color,
                # 'Flagging': register.Flagging,
                'isRefferal': register.IsReferral,
                # 'ClientName': client_name,  # Fixed reference
                # 'InsuranceName': insurance_name,  # Fixed reference
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',


                'PatientCategory' : f"""{register.PatientCategory} / {register.InsuranceName.Insurance_Name if register.InsuranceName else None}""",
                'Spousename' : register.PatientId.SpouseName if register.PatientId.SpouseName else None,
                'Fathername' : register.PatientId.FatherName if register.PatientId.FatherName else None,
                'Address' : f"""{register.PatientId.PermanentdoorNo}{register.PatientId.PermanentArea}{register.PatientId.PermanentCity}""",
                'Nationality' : register.PatientId.Nationality,
                'AdmissionPurpose': admissionpurpose.AdmissionPurpose,
                'MaritalStatus' : register.PatientId.MaritalStatus,

                'NextToKinName' : admissionpurpose.NextToKinName,
                'Relation' : admissionpurpose.Relation,

                'DrInchargeAtTimeOfAdmission' : admissionpurpose.DrInchargeAtTimeOfAdmission.First_Name if admissionpurpose.DrInchargeAtTimeOfAdmission  else None
                


            }  
 
            # Add room details if Booking_Status is 'Booked' or 'Occupied'
            if register.Booking_Status in ['Booked', 'Occupied']:
                roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).last()
 
                if roomdetials:
                    appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
                    appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
                    appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
                    appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
                    # appointment_dict['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name if roomdetials.RoomId.Room_Name else None
                    appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
                    appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
                    appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials.RoomId else None
 
            ip_register_data.append(appointment_dict)
 
        return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 



@csrf_exempt
@require_http_methods(["GET"])
def get_ip_roomdetials_before_handover_details(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '')

        # Get the first room detail entry
        roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__pk=RegistrationId).earliest('created_at')
       
        ip_register_data = {
            'ip_register_data':[],
            'Roomsdata':[],
        }
        if roomdetials:
            data={
            'BuildingName': roomdetials.RoomId.Building_Name.Building_Name,
            'BlockName': roomdetials.RoomId.Block_Name.Block_Name,
            'FloorName': roomdetials.RoomId.Floor_Name.Floor_Name,
            'WardName': roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name,
            # 'RoomName': roomdetials.RoomId.Room_Name.Room_Name,
            'RoomNo': roomdetials.RoomId.Ward_Name.RoomNo,
            'BedNo': roomdetials.RoomId.Bed_No,
            'RoomId': roomdetials.RoomId.pk,
            'DateTime': roomdetials.created_at.strftime('%d-%m-%y - %H-%M'),
            'id':1
            }
            ip_register_data['ip_register_data'].append(data)
            

        # Fetch all room details and add the remaining ones to the Roomsdata list
        roomdatass = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__pk=RegistrationId).order_by('created_at')[1:]  # Skip the first entry
        index=0
        for roomdetials in roomdatass:
            data = {}
            data['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name
            data['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name
            data['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name
            data['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name
            # data['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name
            data['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo
            data['BedNo'] = roomdetials.RoomId.Bed_No
            data['RoomId'] = roomdetials.RoomId.Room_Id
            data['DateTime'] = roomdetials.created_at.strftime('%d-%m-%y - %H-%M')
            data['id'] = index+1
            
            
            ip_register_data['Roomsdata'].append(data)
            index += 1

        return JsonResponse(ip_register_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["POST"])
def post_ip_roomdetials_before_handover_details(request):
    try:
        data = json.loads(request.body)
        RegistrationId = data.get('RegistrationId', '')
        RoomId = data.get('RoomId', '')
        createdby = data.get('createdby', '')
        
        if RoomId:
            room_ins = Room_Master_Detials.objects.get(pk=RoomId)
        else:
            return JsonResponse({'error': 'RoomId is required'}, status=400)

        if RegistrationId:
            register_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
        else:
            return JsonResponse({'error': 'RegistrationId is required'}, status=400)
        
        if room_ins and register_ins:
            previous_room_detail = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id=register_ins
                ).order_by('-created_at').first()
            if previous_room_detail:

                try:
                                
                    previous_room_detail.RoomId.Booking_Status = 'Available'
                    previous_room_detail.RoomId.save()

                except Exception as e:

                    print(str(e),'room err 1111')

                
                
            # Create a new Patient_Admission_Room_Detials entry

            try:
                Patient_Admission_Room_Detials.objects.create(
                    RegisterType='IP',
                    IP_Registration_Id=register_ins,  # Corrected field name
                    Casuality_Registration_Id=None,
                    RoomId=room_ins,
                    created_by=createdby
                )

            except Exception as e:

                print(str(e),'room err')
            
            

        return JsonResponse({'success': 'Room changed successfully'}, safe=False)

    except Room_Master_Detials.DoesNotExist:
        return JsonResponse({'error': 'Room does not exist'}, status=404)

    except Patient_IP_Registration_Detials.DoesNotExist:
        return JsonResponse({'error': 'IP Registration does not exist'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)},status=500)



@csrf_exempt
@require_http_methods(["POST","GET","OPTIONS"])
def post_ip_handover_details(request):
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            RegistrationId = data.get('RegistrationId', '')
            ReasonForAdmission = data.get('ReasonForAdmission', '')
            PatientConditionOnAdmission = data.get('PatientConditionOnAdmission', '')
            PatientFileGiven = data.get('PatientFileGiven', '')
            AadharGiven = data.get('AadharGiven', '')
            created_by = data.get('created_by', '')
            
            
            if RegistrationId:
                register_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
            else:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)
            
            
            Handover_detials_Ip.objects.create(
                RegistrationId=register_ins, 
                ReasonForAdmission=ReasonForAdmission,
                PatientConditionOnAdmission=PatientConditionOnAdmission,
                PatientFileGiven= True if PatientFileGiven=='Yes' else False,
                AadharGiven=True if AadharGiven=='Yes' else False,
                created_by=created_by
            )
                
                

            return JsonResponse({'success': 'Detials added successfully'}, safe=False)

        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'IP Registration does not exist'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method=='GET':
        try:
            RegistrationId=request.GET.get('RegistrationId')
            
            handoverdetial_ins = Handover_detials_Ip.objects.filter(RegistrationId__pk = RegistrationId).first()
            if handoverdetial_ins:
                data={
                    'ReasonForAdmission':handoverdetial_ins.ReasonForAdmission,
                    'PatientConditionOnAdmission':handoverdetial_ins.PatientConditionOnAdmission,
                    'PatientFileGiven': 'Yes' if handoverdetial_ins.ReasonForAdmission else 'No',
                    'AadharGiven': 'Yes' if handoverdetial_ins.AadharGiven else 'No',
                    'created_by':handoverdetial_ins.created_by,
                    'RegistrationId':handoverdetial_ins.RegistrationId.pk,
                    'Date': handoverdetial_ins.created_at.strftime('%d-%m-%y'), 
                    'Time' : handoverdetial_ins.created_at.strftime('%H:%M:%S')
                }
                return JsonResponse(data)
            else:
                return JsonResponse({})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)





@csrf_exempt
@require_http_methods(["POST"])
def post_ip_submit_handover_or_cancel_details(request):
    try:
        data = json.loads(request.body)
        RegistrationId = data.get('RegistrationId', '')
        Type = data.get('type', '')
        Reason = data.get('Reason', '')
        createdby = data.get('createdby', '')

        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId is required'}, status=400)

        try:
            ip_regis_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'IP Registration does not exist'}, status=404)

        if Type != 'cancel':
            # If not cancel, admit the patient
            ip_regis_ins.Status = 'Admitted'
            ip_regis_ins.Booking_Status = 'Occupied'
            ip_regis_ins.updated_by = createdby
            ip_regis_ins.save()  # Save the changes

            # Get the latest room details
            ip_add_room_ins = Patient_Admission_Room_Detials.objects.filter(
                RegisterType="IP",
                IP_Registration_Id=ip_regis_ins
            ).order_by('-created_at').first()

            if ip_add_room_ins:

                try:
                    ip_add_room_ins.Status = True
                    ip_add_room_ins.IsStayed = True
                    ip_add_room_ins.CurrentlyStayed = True
                    ip_add_room_ins.Approved_by = createdby
                    ip_add_room_ins.updated_by = createdby
                    ip_add_room_ins.Admitted_Date = datetime.now()
                    ip_add_room_ins.save()

                

                    room_ins = Room_Master_Detials.objects.get(pk=ip_add_room_ins.RoomId.pk)
                    room_ins.Booking_Status = 'Occupied'
                    room_ins.save()

                except Exception as e:
                    print(str(e),'errr')

            return JsonResponse({'success': 'Patient admitted successfully'})

        else:
            # If cancel, cancel the admission if the status is pending
            if ip_regis_ins.Status == 'Pending':
                ip_regis_ins.Status = 'Cancelled'
                ip_regis_ins.Booking_Status = 'Cancelled'
                ip_regis_ins.updated_by = createdby
                ip_regis_ins.Reason = Reason
                ip_regis_ins.save()  # Save the changes

                # Get the latest room details
                ip_add_room_ins = Patient_Admission_Room_Detials.objects.filter(
                    RegisterType="IP",
                    IP_Registration_Id=ip_regis_ins
                ).order_by('-created_at').first()

                if ip_add_room_ins:

                    try:
                        ip_add_room_ins.Iscanceled = True
                        ip_add_room_ins.Approved_by = createdby
                        ip_add_room_ins.updated_by = createdby
                        ip_add_room_ins.save()

                        room_ins = Room_Master_Detials.objects.get(pk=ip_add_room_ins.RoomId.pk)
                        room_ins.Booking_Status = 'Available'
                        room_ins.save()

                    except Exception as e:

                        print(str(e),'errrrr')

                    

                return JsonResponse({'success': 'Patient admission cancelled successfully'})
            else:
                return JsonResponse({'warn': 'Patient is already admitted, cannot cancel the admission'}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# @csrf_exempt
# @require_http_methods(["POST", "GET", "OPTIONS"])
# def insert_op_ip_convertion(request):
#     if request.method == "POST":
#         try:
#             # Load the request body as JSON
#             data = json.loads(request.body)

#             # Ensure data is a dictionary
#             if isinstance(data, dict):
#                 patient_id_str = data.get('Patient_id')
#                 registration_id = data.get('Registration_id')
#                 reason = data.get('Reason')
#                 created_by = data.get('Created_by')

#                 # Retrieve the Patient_Detials instance
#                 try:
#                     patient_instance = Patient_Detials.objects.get(pk=patient_id_str)
#                 except Patient_Detials.DoesNotExist:
#                     return JsonResponse({'error': 'Patient ID not found'}, status=404)

#                 # Check if the patient has already been admitted
#                 alertdata = Op_to_Ip_Convertion_Table.objects.filter(Registration_id=registration_id)

#                 if alertdata.exists():
#                     return JsonResponse({'warn': 'Patient already admitted'})

#                 # Retrieve the Patient_Appointment_Registration_Detials instance
#                 try:
#                     registration_instance = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
#                 except Patient_Appointment_Registration_Detials.DoesNotExist:
#                     return JsonResponse({'error': 'Registration ID not found'}, status=404)

#                 # Save the data in the Op_to_Ip_Convertion_Table if the patient is not already admitted
#                 convertion_data = Op_to_Ip_Convertion_Table(
#                     Patient_Id=patient_instance,  # Use the instance instead of the ID
#                     Registration_id=registration_instance,  # Use the instance instead of the ID
#                     Reason=reason,
#                     created_by=created_by,  # Assuming Created_by is just a string or user ID
#                     Status = 'Pending'
#                 )
#                 convertion_data.save()
                
#                 return JsonResponse({'success': 'Request Que added successfully'})
#             else:
#                 # If data is not a dictionary, it's an error in the request format
#                 return JsonResponse({'error': 'Invalid data format'}, status=400)
        
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
#     elif request.method == 'GET':
#         try:
#             status = request.GET.get('status')
            
#             requestdata = Op_to_Ip_Convertion_Table.objects.filter(Status=status)
#             Requestlist = []

#             for data in requestdata:
#                 patient_details = data.Registration_id.PatientId  # Assuming this is a ForeignKey to Patient_Detials
#                 request = {
#                     'id' : data.id,
#                     'PatientId': patient_details.pk,  # Use the primary key of the patient
#                     'RegistrationId': data.Registration_id.pk,  # Use the primary key of the registration
#                     'Reason': data.Reason,
#                     'Patient_Name': f'{patient_details.FirstName} {patient_details.MiddleName} {patient_details.SurName}',
#                     'Age': patient_details.Age,
#                     'Status' : data.Status
#                 }
#                 Requestlist.append(request)

#             return JsonResponse(Requestlist, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)





@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def insert_op_ip_convertion(request):
    if request.method == "POST":
        try:
            # Load the request body as JSON
            data = json.loads(request.body)

            # Ensure data is a dictionary
            if isinstance(data, dict):
                patient_id_str = data.get('Patient_id')
                registration_id = data.get('Registration_id')
                reason = data.get('Reason')
                IpNotes = data.get('IpNotes')
                created_by = data.get('Created_by')

                # Retrieve the Patient_Detials instance
                try:
                    patient_instance = Patient_Detials.objects.get(pk=patient_id_str)
                except Patient_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Patient ID not found'}, status=404)

                # Check if the patient has already been admitted
                alertdata = Op_to_Ip_Convertion_Table.objects.filter(Registration_id=registration_id)

                if alertdata.exists():
                    return JsonResponse({'warn': 'Patient already admitted'})

                # Retrieve the Patient_Appointment_Registration_Detials instance
                try:
                    registration_instance = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
                except Patient_Appointment_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Registration ID not found'}, status=404)

                # Save the data in the Op_to_Ip_Convertion_Table if the patient is not already admitted
                convertion_data = Op_to_Ip_Convertion_Table(
                    Patient_Id=patient_instance,  # Use the instance instead of the ID
                    Registration_id=registration_instance,  # Use the instance instead of the ID
                    Reason=reason,
                    IpNotes=IpNotes,
                    created_by=created_by,  # Assuming Created_by is just a string or user ID
                    Status = 'Pending'
                )
                convertion_data.save()
                
                return JsonResponse({'success': 'Request Que added successfully'})
            else:
                # If data is not a dictionary, it's an error in the request format
                return JsonResponse({'error': 'Invalid data format'}, status=400)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            requestdata = Op_to_Ip_Convertion_Table.objects.filter(Status='Pending')
            Requestlist = []

            for data in requestdata:
                patient_details = data.Registration_id.PatientId  # Assuming this is a ForeignKey to Patient_Detials
                request = {
                    'id' : patient_details.Title.Title_Id if patient_details.Title else '',
                    'TitleId' : data.id,
                    'PatientId': patient_details.pk,  
                    'FirstName': patient_details.FirstName if patient_details else '',  
                    'MiddleName': patient_details.MiddleName if patient_details else '',  
                    'LastName': patient_details.SurName if patient_details else '',  
                    'Gender': patient_details.Gender if patient_details else '',  
                    'MaritalStatus': patient_details.MaritalStatus if patient_details else '',  
                    'SpouseName': patient_details.SpouseName if patient_details else '',  
                    'FatherName': patient_details.FatherName if patient_details else '',  
                    'DOB': patient_details.DOB if patient_details else '',  
                    'Registration_id': data.Registration_id.pk, 
                    'Reason': data.Reason,
                    'IpNotes': data.IpNotes,
                    'Patient_Name': f"""{patient_details.FirstName if patient_details else ''} {patient_details.MiddleName if patient_details else ''} {patient_details.SurName if patient_details else ''}""",
                    'Age': patient_details.Age if patient_details else '',
                    'PhoneNumber': patient_details.PhoneNo if patient_details else '',
                    'Email': patient_details.Email if patient_details else '',
                    'BloodGroup': patient_details.BloodGroup.BloodGroup_Id if patient_details.BloodGroup else '',
                    'Occupation': patient_details.Occupation if patient_details else '',
                    'Religion': patient_details.Religion.Religion_Id if patient_details.Religion else '',
                    'Nationality': patient_details.Nationality if patient_details else '',
                    'UniqueIdType': patient_details.UniqueIdType if patient_details else '',
                    'UniqueIdNo': patient_details.UniqueIdNo if patient_details else '',
                    'PatientType': patient_details.PatientType if patient_details else '',
                    'Pincode': patient_details.Pincode if patient_details else '',
                    'DoorNo': patient_details.DoorNo if patient_details else '',
                    'Street': patient_details.Street if patient_details else '',
                    'Area': patient_details.Area if patient_details else '',
                    'City': patient_details.City if patient_details else '',
                    'District': patient_details.District if patient_details else '',
                    'State': patient_details.State if patient_details else '',
                    'Country': patient_details.Country if patient_details else '',
                   
                    'PermanentPincode': patient_details.PermanentPincode if patient_details else '',
                    'PermanentdoorNo': patient_details.PermanentdoorNo if patient_details else '',
                    'PermanentStreet': patient_details.PermanentStreet if patient_details else '',
                    'PermanentArea': patient_details.PermanentArea if patient_details else '',
                    'PermanentCity': patient_details.PermanentCity if patient_details else '',
                    'PermanentDistrict': patient_details.PermanentDistrict if patient_details else '',
                    'PermanentState': patient_details.PermanentState if patient_details else '',
                    'PermanentCountry': patient_details.PermanentCountry if patient_details else '',
                    

                    
                    'Status' : data.Status
                }
                Requestlist.append(request)

            return JsonResponse(Requestlist, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



def get_OP_to_IP_pending_requests(request):
    if request.method == 'GET':
        try:

            query = request.GET.get('query', '')
            status = request.GET.get('status', '')
            DoctorId = request.GET.get('DoctorId', '')
            Doctor = request.GET.get('Doctor')
            
            from_date = request.GET.get('fromDate', '')  
            to_date = request.GET.get('toDate', '')  
            particular_date = request.GET.get('ParticularDate', '')
            Current_date = request.GET.get('CurrentDate', '')

            queryset = Op_to_Ip_Convertion_Table.objects.all()

            if query:
                queryset = queryset.filter(
                    Q(Patient_Id__FirstName__icontains=query) |
                    Q(Patient_Id__MiddleName__icontains=query) |
                    Q(Patient_Id__SurName__icontains=query) |
                    Q(Patient_Id__PatientId__icontains=query) |
                    Q(Patient_Id__PhoneNo__icontains=query)
                )

            # if query:
                # queryset = queryset.filter(Q(Patient_Id__PatientId__icontains = query))    

            if status:  # Only apply status filter if provided
                queryset = queryset.filter(Q(Status__icontains=status))
 
            # Apply date filters only if parameters are provided
            if from_date and to_date:
                queryset = queryset.filter(created_at__date__range=[from_date, to_date])
            elif particular_date:
                queryset = queryset.filter(created_at__date=particular_date)
            elif Current_date:
                queryset = queryset.filter(created_at__date=Current_date)
     

            # request_data = Op_to_Ip_Convertion_Table.objects.filter(queryset)
            # request_data = Op_to_Ip_Convertion_Table.objects.filter(Status='Pending')
            request_list = []

            for idx, data in enumerate(queryset, start=1):
                patient = data.Registration_id.PatientId

                request_info = {
                    'id': idx,
                    # 'id': patient.Title.Title_Id if patient.Title else '',
                    'TitleId': patient.Title.Title_Id if patient.Title else '',
                    'PatientId': patient.pk,
                    'FirstName': patient.FirstName if patient else '',
                    'MiddleName': patient.MiddleName if patient else '',
                    'LastName': patient.SurName if patient else '',
                    'Gender': patient.Gender if patient else '',
                    'MaritalStatus': patient.MaritalStatus if patient else '',
                    'SpouseName': patient.SpouseName if patient else '',
                    'FatherName': patient.FatherName if patient else '',
                    'DOB': patient.DOB if patient else '',
                    'Registration_id': data.Registration_id.pk,
                    'Reason': data.Reason,
                    'Doctor_ID': data.PrimaryDoctor.Doctor_ID if data.PrimaryDoctor else '',
                    'IpNotes': data.IpNotes,
                    'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}. {patient.FirstName if patient else ''} {patient.MiddleName if patient else ''} {patient.SurName if patient else ''}",
                    'Age': patient.Age if patient else '',
                    'PhoneNumber': patient.PhoneNo if patient else '',
                    'Email': patient.Email if patient else '',
                    'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else '',
                    'Occupation': patient.Occupation if patient else '',
                    'Religion': patient.Religion.Religion_Id if patient.Religion else '',
                    'Nationality': patient.Nationality if patient else '',
                    'UniqueIdType': patient.UniqueIdType if patient else '',
                    'UniqueIdNo': patient.UniqueIdNo if patient else '',
                    'PatientType': patient.PatientType if patient else '',
                    'Pincode': patient.Pincode if patient else '',
                    'DoorNo': patient.DoorNo if patient else '',
                    'Street': patient.Street if patient else '',
                    'Area': patient.Area if patient else '',
                    'City': patient.City if patient else '',
                    'District': patient.District if patient else '',
                    'State': patient.State if patient else '',
                    'Country': patient.Country if patient else '',
                    'PermanentPincode': patient.PermanentPincode if patient else '',
                    'PermanentdoorNo': patient.PermanentdoorNo if patient else '',
                    'PermanentStreet': patient.PermanentStreet if patient else '',
                    'PermanentArea': patient.PermanentArea if patient else '',
                    'PermanentCity': patient.PermanentCity if patient else '',
                    'PermanentDistrict': patient.PermanentDistrict if patient else '',
                    'PermanentState': patient.PermanentState if patient else '',
                    'PermanentCountry': patient.PermanentCountry if patient else '',
                    'Status': data.Status
                }

                request_list.append(request_info)

            return JsonResponse(request_list, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





@csrf_exempt
@require_http_methods(["GET"])
def get_ip_roomdetials_for_bedtransfer_details(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '')

        # Get the first room detail entry
        roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__pk=RegistrationId,Status=True,IsStayed=True,CurrentlyStayed=True).order_by('-created_at').first()
       
        ip_register_data = {
            'ip_register_data':[],
            'Roomsdata':[],
        }
        if roomdetials:
            data={
            'BuildingName': roomdetials.RoomId.Building_Name.Building_Name,
            'BlockName': roomdetials.RoomId.Block_Name.Block_Name,
            'FloorName': roomdetials.RoomId.Floor_Name.Floor_Name,
            'WardName': roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name,
            # 'RoomName': roomdetials.RoomId.Room_Name.Room_Name,
            'RoomNo': roomdetials.RoomId.Ward_Name.RoomNo,
            'BedNo': roomdetials.RoomId.Bed_No,
            'RoomId': roomdetials.RoomId.pk,
            'Admitted_Date': roomdetials.Admitted_Date,
            'DateTime': roomdetials.created_at.strftime('%d-%m-%y / %H-%M'),
            'AdmitDate': roomdetials.Admitted_Date.strftime('%d-%m-%y'),
            'pk':roomdetials.pk,
            'id':1,
            
            }
            ip_register_data['ip_register_data'].append(data)
            

        # Fetch all room details and add the remaining ones to the Roomsdata list
        roomdatass = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__pk=RegistrationId,Status=True).exclude(CurrentlyStayed=True).order_by('-created_at')  # Skip the first entry
        index=0
        for roomdetials in roomdatass:
            ststusss=''
            if  roomdetials.IsStayed and not roomdetials.Iscanceled:
                ststusss='Transfered'
            elif not roomdetials.IsStayed and not roomdetials.Iscanceled:
                ststusss='Requested'
            elif not roomdetials.IsStayed and  roomdetials.Iscanceled :
                ststusss='Requested Cancelled'
            data = {}
            data['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name
            data['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name
            data['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name
            data['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name
            # data['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name
            data['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo
            data['BedNo'] = roomdetials.RoomId.Bed_No
            data['RoomId'] = roomdetials.RoomId.Room_Id
            data['Admitted_Date'] = roomdetials.Admitted_Date.strftime('%d-%m-%y /  %I-%M %p') if roomdetials.Admitted_Date else ""
            data['Discharge_Date'] = roomdetials.Discharge_Date.strftime('%d-%m-%y / %I-%M %p') if roomdetials.Discharge_Date else ""
            data['Status'] = ststusss
            data['pk'] = roomdetials.pk
            data['DateTime'] = roomdetials.created_at.strftime('%d-%m-%y / %I-%M %p')
            data['id'] = index+1
            
            
            ip_register_data['Roomsdata'].append(data)
            index += 1

        return JsonResponse(ip_register_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})





@csrf_exempt
@require_http_methods(["POST"])
def post_ip_bed_transfer_details(request):
    try:
        data = json.loads(request.body)
        RegistrationId = data.get('RegistrationId', '')
        RoomId = data.get('RoomId', '')
        Reason = data.get('Reason', '')
        createdby = data.get('createdby', '')
       
        if RoomId:
            room_ins = Room_Master_Detials.objects.get(pk=RoomId)
        else:
            return JsonResponse({'error': 'RoomId is required'}, status=400)
 
        if RegistrationId:
            register_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
        else:
            return JsonResponse({'error': 'RegistrationId is required'}, status=400)
       
        if room_ins and register_ins:
           
            # Create a new Patient_Admission_Room_Detials entry
            try:
               admissionins =  Patient_Admission_Room_Detials.objects.create(
                    RegisterType='IP',
                    IP_Registration_Id=register_ins,  
                    Casuality_Registration_Id=None,
                    RoomId=room_ins,
                    Status=True,
                    bedtransferReason=Reason,
                    created_by=createdby
                )
 
               print(admissionins,'admissionins')
 
            except Exception as e:
                print(str(e),'Patient_Admission_Room_Detials error handleee')
 
 
 
            try:
 
                room_ins.Booking_Status='Requested'
                room_ins.save()
 
            except Exception as e:
                print(str(e),'room error handleee')
 
 
           
           
 
        return JsonResponse({'success': 'Bed Request send successfully successfully'}, safe=False)
 
    except Room_Master_Detials.DoesNotExist:
        return JsonResponse({'error': 'Room does not exist'}, status=404)
 
    except Patient_IP_Registration_Detials.DoesNotExist:
        return JsonResponse({'error': 'IP Registration does not exist'}, status=404)
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 

@csrf_exempt
@require_http_methods(["POST"])
def bed_transfer_approve_cancel_details(request):
    try:
        data = json.loads(request.body)
 
        RegistrationId = data.get('RegistrationId')
        RoomId = data.get('RoomId')
        Type = data.get('Type')
        Reason = data.get('Reason', '')
        PatientFileRecieved = data.get('PatientFileRecieved', False)
        MedicineTransfered = data.get('MedicineTransfered', False)
        AnyMedicalRecordError = data.get('AnyMedicalRecordError', False)
        ConfirmationFromRelatives = data.get('ConfirmationFromRelatives', False)
        RelativeName = data.get('RelativeName', '')
        createdby = data.get('createdby', '')
        VaccateConfirmation = data.get('VaccateConfirmation', False)
 
        if not RoomId:
            return JsonResponse({'error': 'RoomId is required'}, status=400)
 
        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId is required'}, status=400)
 
        room_ins = Room_Master_Detials.objects.get(pk=RoomId)
        register_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
 
        disdate = datetime.now()
 
        from django.db import transaction
        with transaction.atomic():
 
            # ================= APPROVE =================
            if Type == 'Approve':
 
                previous_room = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id=register_ins,
                    Status=True,
                    IsStayed=True,
                    CurrentlyStayed=True
                ).exclude(Iscanceled=True).order_by('-created_by').first()
 
                if not previous_room:
                    return JsonResponse(
                        {'error': 'Previous occupied room not found'},
                        status=400
                    )
 
                # ---- Vacate previous room ----
                if VaccateConfirmation:
 
                    try:
 
                        previous_room.CurrentlyStayed = False
                        previous_room.Discharge_Date = disdate
                        previous_room.VaccateConfirmation = True
                        previous_room.save()
 
                    except Exception as e:
                            print(str(e),'room error handleee')
 
                    previous_room_master = Room_Master_Detials.objects.filter(
                        pk=previous_room.RoomId.pk,
                        Booking_Status='Occupied'
                    ).first()
 
                    if previous_room_master:
 
                        try:
                            previous_room_master.Booking_Status = 'Available'
                            previous_room_master.save()
                            schedule_status_update(previous_room_master.pk, 30)
 
                        except Exception as e:
                            print(str(e),'room error handleee')
 
                # ---- Assign requested room ----
                roomdatass = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id=register_ins,
                    Status=True,
                    CurrentlyStayed=False,
                    IsStayed=False
                ).exclude(Iscanceled=True).order_by('-created_by').first()
 
                if not roomdatass:
                    return JsonResponse(
                        {'error': 'Requested room not found'},
                        status=400
                    )
 
 
                try:
                    roomdatass.IsStayed = True
                    roomdatass.CurrentlyStayed = True
                    roomdatass.Admitted_Date = disdate
                    roomdatass.PatientfileRecieved = PatientFileRecieved
                    roomdatass.MedicineTransfered = MedicineTransfered
                    roomdatass.AnyMedicalRecordError = AnyMedicalRecordError
                    roomdatass.ConfirmationfromReletives = ConfirmationFromRelatives
                    roomdatass.ReletiveName = RelativeName
                    roomdatass.MedRecReason = Reason
                    roomdatass.save()
 
                except Exception as e:
                        print(str(e),'room error handleee')
 
                room_master = Room_Master_Detials.objects.filter(
                    pk=roomdatass.RoomId.pk,
                    Booking_Status='Requested'
                ).first()
 
                if room_master:
 
                    try:
                        room_master.Booking_Status = 'Occupied'
                        room_master.save()
 
                    except Exception as e:
                        print(str(e),'room error handleee')
 
                return JsonResponse(
                    {'success': 'Bed Request Approved successfully'},
                    status=200
                )
 
            # ================= CANCEL =================
            elif Type == 'Cancel':
 
                roomdatass = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id=register_ins,
                    Status=True,
                    CurrentlyStayed=False,
                    IsStayed=False
                ).exclude(Iscanceled=True).order_by('-created_by').first()
 
                if not roomdatass:
                    return JsonResponse(
                        {'error': 'Requested room not found'},
                        status=400
                    )
                try:
                    roomdatass.IsStayed = False
                    roomdatass.Iscanceled = True
                    roomdatass.CancelReason = Reason
                    roomdatass.Approved_by = createdby
                    roomdatass.save()
 
                except Exception as e:
                            print(str(e),'room error handleee')
                room_master = Room_Master_Detials.objects.filter(
                    pk=roomdatass.RoomId.pk,
                    Booking_Status='Requested'
                ).first()
 
                if room_master:
 
                    try:
                        room_master.Booking_Status = 'Available'
                        room_master.save()
 
                    except Exception as e:
                            print(str(e),'room error handleee')
 
                return JsonResponse(
                    {'success': 'Bed Request cancelled successfully'},
                    status=200
                )
 
            else:
                return JsonResponse(
                    {'error': 'Invalid Type'},
                    status=400
                )
 
    except Room_Master_Detials.DoesNotExist:
        return JsonResponse({'error': 'Room does not exist'}, status=404)
 
    except Patient_IP_Registration_Detials.DoesNotExist:
        return JsonResponse({'error': 'IP Registration does not exist'}, status=404)
 
    except Exception as e:
        print('BED TRANSFER ERROR:', str(e))
        return JsonResponse({'error': str(e)}, status=500)
 
 
 
 


@csrf_exempt
@require_http_methods(["POST", "GET", 'OPTIONS'])
def service_procedure_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            RegistrationId = data.get('RegistrationId', '')
            MasterType = data.get('MasterType', '')
            Id = data.get('id', '')
            units = data.get('Units', '')
            createdby = data.get('createdby', '')

            if not RegistrationId:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            # Fetch the related patient registration and room details
            register_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)

            room_inss = Patient_Admission_Room_Detials.objects.get(
                IP_Registration_Id__pk=register_ins.pk, Status=True, IsStayed=True, CurrentlyStayed=True
            )

            service_ins = None
            procedure_ins = None

            if MasterType == 'Service':
                service_ins = Service_Master_Details.objects.get(pk=Id)
            elif MasterType == 'Procedure':
                procedure_ins = Procedure_Master_Details.objects.get(pk=Id)
            else:
                return JsonResponse({'error': 'Invalid MasterType. Must be either "Service" or "Procedure".'}, status=400)

            # Create the service/procedure request
            Service_Procedure_request_Ip.objects.create(
                MasterType=MasterType,
                Service_ratecard=service_ins,
                Procedure_ratecard=procedure_ins,
                RegistrationId=register_ins,
                RoomId=room_inss.RoomId,
                Units=units,
                created_by=createdby
            )

            return JsonResponse({'success': f'{MasterType} Added Successfully'}, status=201)

        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'IP Registration does not exist'}, status=404)
        except Patient_Admission_Room_Detials.DoesNotExist:
            return JsonResponse({'error': 'Room details not found for this registration'}, status=404)
        except Service_Master_Details.DoesNotExist:
            return JsonResponse({'error': 'Service not found'}, status=404)
        except Procedure_Master_Details.DoesNotExist:
            return JsonResponse({'error': 'Procedure not found'}, status=404)
        except Exception as e:
            print('error', str(e))
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        try:
            MasterType = request.GET.get('MasterType')
            RegistrationId = request.GET.get('RegistrationId')
            status = request.GET.get('status')

            # Querying Service_Procedure_request_Ip based on status if provided
            if status:
                service_ins = Service_Procedure_request_Ip.objects.filter(
                    RegistrationId__pk=RegistrationId, MasterType=MasterType, Status=status
                )
            else:
                service_ins = Service_Procedure_request_Ip.objects.filter(
                    RegistrationId__pk=RegistrationId, MasterType=MasterType
                )

            servicedata = []
            index = 1

            for inss in service_ins:
                data = {
                    'id': index,
                    'ServiceId': inss.Service_ratecard.pk if inss.Service_ratecard else inss.Procedure_ratecard.pk,
                    'ServiceType': inss.Service_ratecard.Service_Type if inss.Service_ratecard else inss.Procedure_ratecard.Type,
                    'ServiceName': inss.Service_ratecard.Service_Name if inss.Service_ratecard else inss.Procedure_ratecard.Procedure_Name,
                    "Units": f"{inss.Units} hrs" if inss.Service_ratecard and inss.Service_ratecard.Service_Type == 'Hourly' else inss.Units,
                    "DateTime": inss.created_at.strftime('%d-%m-%y / %I-%M %p'),
                    "Status": "Not Paid" if not inss.Status else "Paid"
                }
                servicedata.append(data)
                index += 1

            return JsonResponse(servicedata, safe=False)

        except Exception as e:
            print('error', str(e))
            return JsonResponse({'error': str(e)}, status=500)





@csrf_exempt
def get_ip_billing_datasss(request):
    if request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId')
            # Retrieve all room details
            roomdatas = Patient_Admission_Room_Detials.objects.filter(
                IP_Registration_Id__pk=RegistrationId, Status=True, IsStayed=True
            ).exclude(Iscanceled=True, CurrentlyStayed=True)

            service_ins = Service_Procedure_request_Ip.objects.filter(
                RegistrationId__pk=RegistrationId, Status=False
            )

            emp_datas = {
                'RoomDatas': [],
                'ServiceDetials': []
            }

            for room in roomdatas:
                # Calculate the difference between Admitted_Date and Discharge_Date
                admitted_date = room.Admitted_Date  # Assuming datetime object
                discharge_date = room.Discharge_Date if room.Discharge_Date else None

                if discharge_date:
                    difference = discharge_date - admitted_date
                    days = difference.days  # Total number of days
                    hours, remainder = divmod(difference.seconds, 3600)
                    minutes, seconds = divmod(remainder, 60)
                    difff = f"{days} days, {hours} hours"
                else:
                    difff = "Still Admitted"  # Handle cases where Discharge_Date is None

                roomdetials = {
                    'id': len(emp_datas['RoomDatas']) + 1,
                    "WardName": room.RoomId.Ward_Name.Ward_Name,
                    # "RoomName": room.RoomId.Room_Name.Room_Name,
                    "Room_No": room.RoomId.Room_No,
                    "Bed_No": room.RoomId.Bed_No,
                    "Charge": room.RoomId.Ward_Name.Current_Charge,
                    "GST": room.RoomId.Ward_Name.GST_Charge,
                    "Total_Current_Charge": room.RoomId.Ward_Name.Total_Current_Charge,
                    "Admitted_Date": admitted_date.strftime('%d-%m-%y / %I-%M %p'),
                    "Discharge_Date": discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else None,
                    "Days": difff
                }
                emp_datas['RoomDatas'].append(roomdetials)

            for inss in service_ins:
                data = {
                    'id': len(emp_datas['ServiceDetials']) + 1,
                    'ServiceId': inss.Service_ratecard.pk if inss.Service_ratecard else inss.Procedure_ratecard.pk,
                    'ServiceType': inss.Service_ratecard.Service_Type if inss.Service_ratecard else inss.Procedure_ratecard.Type,
                    'ServiceName': inss.Service_ratecard.Service_Name if inss.Service_ratecard else inss.Procedure_ratecard.Procedure_Name,
                    "Units": f"{inss.Units} hrs" if inss.Service_ratecard and inss.Service_ratecard.Service_Type == 'Hourly' else inss.Units,
                    "DateTime": inss.created_at.strftime('%d-%m-%y / %I-%M %p'),
                    "Status": "Not Paid" if not inss.Status else "Paid"
                }
                # Additional logic for calculating charges, etc.
                emp_datas["ServiceDetials"].append(data)

            # Return JSON response
            return JsonResponse(emp_datas, safe=False)

        except Exception as e:
            # Handle exceptions and return error response
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)




# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_appointment_details_specifydoctor(request):
#     try:
#         Doctor = request.GET.get('Doctor')
#         doctor_id = request.GET.get('DoctorId', '')
#         print("doctor-", Doctor)

#         # Define a function to build the appointment data dictionary
#         def build_appointment_dict(register, idx):
#             Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
#             return {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'PatientId': register.PatientId.PatientId,
#                 'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                 'PhoneNo': register.PatientId.PhoneNo,
#                 'Age': register.PatientId.Age,
#                 'Gender': register.PatientId.Gender,
#                 'AppointmentId': register.AppointmentId,
#                 'VisitId': register.VisitId,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 'Flagging': Flagging_name,
#                 'FlaggingColour': Flagging_color,
#                 # 'Flagging': register.Flagging,
#                 'isRefferal': register.IsReferral,
#                 'Status': register.Status,
#                 'RegistrationId': register.pk,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}",
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#             }

#         if Doctor:
#             queryset = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor=Doctor).exclude(Status='Cancelled')
#         else:
#             queryset = Patient_Appointment_Registration_Detials.objects.exclude(Status='Cancelled')
        
#         if doctor_id:
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
#             print(queryset,'patientqueryset1111111111111111s') 
#             print(doctor_id,'queryset222222222222')

            
#         appointment_register_data = [
#             build_appointment_dict(register, idx)
#             for idx, register in enumerate(queryset, start=1)
#         ]

#         return JsonResponse(appointment_register_data, safe=False)

#     except Exception as e:
#         print(f"Error: {str(e)}")  # Optional: log the error message
#         return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_appointment_details_specifydoctor(request):
#     try:
#         Doctor = request.GET.get('Doctor')
#         print("doctor-", Doctor)
 
#         # Define a function to build the appointment data dictionary
#         def build_appointment_dict(register, idx):
#             Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
 
#             patient_instance = Patient_Appointment_Registration_Detials.objects.filter(PatientId_id=register.PatientId.PatientId)
#             for patient_ins in patient_instance:
#                 PatientType_ins = Flaggcolor_Detials.objects.get(Flagg_Name=patient_ins.PatientType)
#                 patientCategory_ins = Flaggcolor_Detials.objects.get(Flagg_Name=patient_ins.PatientCategory)
               
#                 try:
#                  specialtype_ins = Flaggcolor_Detials.objects.get(Flagg_Id=patient_ins.Flagging_id)
 
#                 except Flaggcolor_Detials.DoesNotExist:
#                     continue
               
 
#                 specialtypelist = ['GENERAL','VIP','GOVT','INSURANCE','MLC','CLIENT','CORPORATE','DONATION','EMPLOYEE','EMPLOYEERELATION','DOCTOR','DOCTORRELATION']
 
#                 if patient_ins.IsMLC == 'Yes':
 
#                    mlc_ins = Flaggcolor_Detials.objects.get(Flagg_Name= 'MLC')
               
#                    return {
#                     'id': idx,
#                     'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                     'PatientId': register.PatientId.PatientId,
#                     'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                     'PhoneNo': register.PatientId.PhoneNo,
#                     'Age': register.PatientId.Age,
#                     'Gender': register.PatientId.Gender,
#                     'AppointmentId': register.AppointmentId,
#                     'VisitId': register.VisitId,
#                     'Complaint': register.Complaint,
#                     'isMLC': register.IsMLC,
#                     'Flagging': Flagging_name,
#                     # 'FlaggingColour': PatientType_ins.Flagg_Color,
#                     # 'Flagging': register.Flagging,
#                     'isRefferal': register.IsReferral,
#                     'Status': register.Status,
#                     'RegistrationId': register.pk,
#                     'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}",
#                     'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                     'PatientType': patient_ins.PatientType,
#                     'patientTypeColor':PatientType_ins.Flagg_Color,
#                     'PatientCategory':patient_ins.PatientCategory,
#                     'patientCategoryColor':patientCategory_ins.Flagg_Color,
#                     'IsMLC':   'MLC',
#                     'MLCColor': mlc_ins.Flagg_Color,
#                     'specialtype' : specialtype_ins.Flagg_Name if specialtype_ins.Flagg_Name  not in specialtypelist else 'GENERAL',
#                     'specialtypecolor':specialtype_ins.Flagg_Color if specialtype_ins.Flagg_Name  not in specialtypelist else '#fff'
#                     }
               
#                 else:
#                   return {
#                     'id': idx,
#                     'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                     'PatientId': register.PatientId.PatientId,
#                     'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                     'PhoneNo': register.PatientId.PhoneNo,
#                     'Age': register.PatientId.Age,
#                     'Gender': register.PatientId.Gender,
#                     'AppointmentId': register.AppointmentId,
#                     'VisitId': register.VisitId,
#                     'Complaint': register.Complaint,
#                     'isMLC': register.IsMLC,
#                     'Flagging': Flagging_name,
#                     #'FlaggingColour': PatientType_ins.Flagg_Color,
#                     # 'Flagging': register.Flagging,
#                     'isRefferal': register.IsReferral,
#                     'Status': register.Status,
#                     'RegistrationId': register.pk,
#                     'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}",
#                     'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                     'PatientType': patient_ins.PatientType,
#                     'patientTypeColor':PatientType_ins.Flagg_Color,
#                     'PatientCategory':patient_ins.PatientCategory,
#                     'patientCategoryColor':patientCategory_ins.Flagg_Color,
#                     'IsMLC':   None,
#                     'MLCColor': None,
#                     'specialtype' : specialtype_ins.Flagg_Name if specialtype_ins.Flagg_Name  not in specialtypelist else 'GENERAL',
#                     'specialtypecolor':specialtype_ins.Flagg_Color if specialtype_ins.Flagg_Name  not in specialtypelist else '#fff'
#                 }
 
 
#         if Doctor:
#             queryset = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=Doctor).exclude(Status='Cancelled')
#         else:
#             queryset = Patient_Appointment_Registration_Detials.objects.exclude(Status='Cancelled')
 
#         appointment_register_data = [
#             build_appointment_dict(register, idx)
#             for idx, register in enumerate(queryset, start=1)
#         ]
 
#         return JsonResponse(appointment_register_data, safe=False)
 
#     except Exception as e:
#         print(f"Error: {str(e)}")  # Optional: log the error message
#         return JsonResponse({'error': str(e)})
 

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_appointment_details_specifydoctor(request):
#     try:
#         Doctor = request.GET.get('Doctor')
#         doctor_id = request.GET.get('DoctorId', '')
#         print("doctor-", Doctor)
 
#         # Define a function to build the appointment data dictionary
#         def build_appointment_dict(register, idx):
#             Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
           
#             return {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'PatientId': register.PatientId.PatientId,
#                 'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                 'PhoneNo': register.PatientId.PhoneNo,
#                 'Age': register.PatientId.Age,
#                 'Gender': register.PatientId.Gender,
#                 'AppointmentId': register.AppointmentId,
#                 'VisitId': register.VisitId,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 'Flagging': Flagging_name,
#                 'FlaggingColour': Flagging_color,
#                 # 'Flagging': register.Flagging,
#                 'isRefferal': register.IsReferral,
#                 'Status': register.Status,
#                 'RegistrationId': register.pk,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}",
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#             }
 
#         if Doctor:
#             queryset = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor=Doctor).exclude(Status='Cancelled')
#         else:
#             queryset = Patient_Appointment_Registration_Detials.objects.exclude(Status='Cancelled')
       
#         if doctor_id:
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
#             print(queryset,'patientqueryset1111111111111111s')
#             print(doctor_id,'queryset222222222222')
 
           
#         appointment_register_data = [
#             build_appointment_dict(register, idx)
#             for idx, register in enumerate(queryset, start=1)
#         ]
 
#         return JsonResponse(appointment_register_data, safe=False)
 
#     except Exception as e:
#         print(f"Error: {str(e)}")  # Optional: log the error message
#         return JsonResponse({'error': str(e)})
 
 


@csrf_exempt
@require_http_methods(["GET"])
def get_patient_appointment_details_specifydoctor(request):
    try:
        # Extract query parameters
        Doctor = request.GET.get('Doctor')
        doctor_id = request.GET.get('DoctorId', '')
        status = request.GET.get('status', '')

        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')

 
        print("status",status)
 
        print("Doctor:", Doctor)
 
        # Build the queryset
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.exclude(Registration_Id__Status='Cancelled')
       
        if from_date and to_date:
            queryset = queryset.filter(Registration_Id__created_at__date__range=[from_date, to_date])

        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(Registration_Id__created_at__date=particular_date)
        
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(Registration_Id__created_at__date=Current_date)
     
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__pk=Doctor)
        
        if doctor_id:
            queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
            print("Filtered Queryset:", queryset)
            print("Doctor ID:", doctor_id)
       
        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            # Exclude 'Cancelled' status if no status is specified
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')
   
       
 
        # Prepare response data
        DocWisePatient = []
        for idx, register in enumerate(queryset, start=1):
            # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            # # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
 
            # Build the patient dictionary
            RegisterPatient = {
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId  else None,
                'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
                'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
                'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
                'Complaint': register.Complaint,
                'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
                'VisitType': register.VisitType,
                # 'Flagging': Flagging_name,
                # 'FlaggingColour': Flagging_color,
                'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
                'Status': register.Registration_Id.Status if register.Registration_Id else '',
                'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
                'Doctorid': register.PrimaryDoctor.Doctor_ID if register.PrimaryDoctor and register.PrimaryDoctor.Doctor_ID is not None else None,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
            }
            DocWisePatient.append(RegisterPatient)
 
        # Return the response
        return JsonResponse(DocWisePatient, safe=False)
 
    except Exception as e:
        # Log and return the error
        print(f"Error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
 





@csrf_exempt
@require_http_methods(["GET"])
def get_OP_patient_Filter_SpecialityWise(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        doctor_id = request.GET.get('DoctorId', '')
        speciality_id = request.GET.get('SpecialityId', '')
        status = request.GET.get('status', '')

        # queryset = Patient_Appointment_Registration_Detials.objects.exclude(Status='Cancelled')
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.exclude(Registration_Id__Status='Cancelled').filter(Specialization__Speciality_Id=speciality_id)
       
        # if speciality_id:
        #     queryset = queryset.filter(Specialization__Speciality_Id=speciality_id)
        
        # if speciality_id:
        #     queryset = queryset.filter(Specialization__Speciality_Id=speciality_id)

        if query:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )

        if doctor_id:
            queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)

        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            # Exclude 'Cancelled' status if no status is specified
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')


        # Serialize the filtered queryset
        appointment_register_data = [
            {
                'id': idx,
                'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
                'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
                'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
                'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
                'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
                'Complaint': register.Complaint,
                'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
                'VisitType': register.VisitType,
                # 'Flagging': register.Flagging.Flagg_Name if register.Flagging else None,
                # 'FlaggingColour': register.Flagging.Flagg_Color if register.Flagging else None,
                'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
                'Status': register.Registration_Id.Status if register.Registration_Id else '',
                'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
                'DoctorId': register.PrimaryDoctor.Doctor_ID if register.PrimaryDoctor else None,
                'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else '',
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor.Tittle else ''}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}",
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
            }
            for idx, register in enumerate(queryset, start=1)
        ]

        return JsonResponse(appointment_register_data, safe=False)

    except Exception as e:
        print('qqqqqqqqq',str(e))
        return JsonResponse({'error': str(e)}, status=500)






@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Register_Request_Cancel(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            RegistrationId = data.get('RegistrationId', None)
            CancelReason = data.get('CancelReason', '')
            Createdby = data.get('created_by', '')
            Status = "Cancelled"

            if RegistrationId is None:
                return JsonResponse({'warn': 'Missing RegistrationId'})
            
            Register_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            Register_instance.Status = Status
            Register_instance.save()
            # Create a new cancelation record
            Patient_Appointment_Registration_Cancel_Details.objects.create(
                Registration_Id=Register_instance,
                Cancel_Reason=CancelReason,
                Status = Status,
                created_by=Createdby,
                updated_by = Createdby,
            )
            
            return JsonResponse({'success': 'Cancellation request registered successfully'})

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Registration_Reshedule_Details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            RegistrationId = data.get('RegistrationId', None)
            Createdby = data.get('created_by', '')
            DoctorName = data.get('DoctorName', None)
            Specialization = data.get('Specialization', None)
            Status = "Pending"
            PreviousDoctor = data.get('PreviousDoctor',None)
            changeReason = data.get('ChangingReason', '')

            if RegistrationId is None:
                return JsonResponse({'warn': 'Missing RegistrationId'})
            if DoctorName is None:
                return JsonResponse({'warn': 'Missing DoctorName'})
            if Specialization is None:
                return JsonResponse({'warn': 'Missing Specialization'})

            # Fetch the related instances properly
            Register_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            OP_Register_Multiple_Doc_instance = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__pk=RegistrationId).first()
            if not Register_instance:
                return JsonResponse({'warn': 'Invalid RegistrationId'})

            Speciality_instance = Speciality_Detials.objects.filter(pk=Specialization).first()
            Doctor_instance = Doctor_Personal_Form_Detials.objects.filter(pk=DoctorName).first()
            Doctor_instances = Doctor_Personal_Form_Detials.objects.filter(pk=PreviousDoctor).first()
            
            if not Speciality_instance:
                return JsonResponse({'warn': 'Invalid Specialization'})
            if not Doctor_instance:
                return JsonResponse({'warn': 'Invalid DoctorName'})
            
            # Update the Register instance
           
            Register_instance.Status = Status
            Register_instance.save()

            OP_Register_Multiple_Doc_instance.Specialization = Speciality_instance
            OP_Register_Multiple_Doc_instance.PrimaryDoctor = Doctor_instance
            OP_Register_Multiple_Doc_instance.save()

            # Create the reschedule entry
            Patient_Registration_Reshedule_Details.objects.create(
                Registration_Id=Register_instance,
                ChangingReason=changeReason,
                specialization=Speciality_instance,
                doctor_name=Doctor_instance,
                AppointmentDoctor=Doctor_instances,
                Status=Status,
                created_by=Createdby,
                updated_by = Createdby,
            )

            return JsonResponse({'success': 'Reschedule request registered successfully'})

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    return JsonResponse({'error': 'Invalid request method'},status=405)





# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_appointment_details_withoutcancelled(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         location = request.GET.get('location','')
#         print("status90",status)
#         print("workbenchlocation",location)
#         if not location:
#             return JsonResponse({'warn': 'Missing Location Details'})
#         # Start with all records
#         queryset = Patient_Appointment_Registration_Detials.objects.filter(Location__Location_Id=location)
#         print("queryset",queryset)

#         # Apply filters based on the query parameters
#         if query:
#             queryset = queryset.filter(
#                 Q(PatientId_FirstName_icontains=query) |
#                 Q(PatientId_MiddleName_icontains=query) |
#                 Q(PatientId_SurName_icontains=query) |
#                 Q(PatientId_PatientId_icontains=query) |
#                 Q(PatientId_PhoneNo_icontains=query)
#             )
        
#         # Filter by status if specified
#         if status:
#             queryset = queryset.filter(Q(Status__icontains=status))
#         else:
#             # Exclude 'Cancelled' status if no status is specified
#             queryset = queryset.exclude(Status='Cancelled')

#         # Serialize the filtered queryset
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=1):
#             Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'PatientId': register.PatientId.PatientId,
#                 'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                 'PhoneNo': register.PatientId.PhoneNo,
#                 'AppointmentId': register.AppointmentId,
#                 'VisitId': register.VisitId,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 'Flagging': Flagging_name,
#                 'FlaggingColour': Flagging_color,
#                 'isRefferal': register.IsReferral,
#                 'Status': register.Status,
#                 'RegistrationId': register.pk,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}",
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#             }
#             appointment_register_data.append(appointment_dict)

#         return JsonResponse(appointment_register_data, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)})








@csrf_exempt
def get_unique_id_no_validation(request):
    if request.method == 'GET':
        try:
            unique_id = request.GET.get('UniqueIdNo')
            # Check if the patient with the given UniqueIdNo exists
            patient = []
            if unique_id:
               patient = Patient_Detials.objects.filter(UniqueIdNo=unique_id).exists()

            if patient:
                return JsonResponse({'error': f"The {unique_id} is already exists for another patient"})
            else:
                return JsonResponse({'message': 'UniqueIdNo is available'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method'})


  
@csrf_exempt
def get_AdmissionDetails(request):
    if request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId')

            # Validate if unique_id was provided
            if not RegistrationId:
               return JsonResponse({'error': 'RegistrationId is required'}, status=400)
        
            # Check if the patient with the given UniqueIdNo exists
            patient_AdmissionDetails = Patient_Admission_Detials.objects.filter(IP_Registration_Id__pk=RegistrationId)
             
            Admission_Data = []
            for Admission in patient_AdmissionDetails:
                Admission_dict = {
                    'RegistrationId': Admission.IP_Registration_Id.pk,
                    'AdmissionPurpose': Admission.AdmissionPurpose,

                } 
                Admission_Data.append(Admission_dict)
            return JsonResponse(Admission_Data,safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method'})



@csrf_exempt
def get_available_tokenno_by_speciality(request):
    if request.method == 'GET':
        try:
            date = request.GET.get('Date')
            speciality_id = request.GET.get('Speciality')

            # Validate input parameters
            if not speciality_id:
                return JsonResponse({'warn': 'Speciality parameter is missing'})
            if not date:
                return JsonResponse({'warn': 'Date parameter is missing'})

            # Check if the specified speciality exists
            try:
                speciality = Speciality_Detials.objects.get(pk=speciality_id)
            except Speciality_Detials.DoesNotExist:  
                return JsonResponse({'warn': 'Speciality not found'})

            # Retrieve the speciality abbreviation (e.g., "NEU" for Neurology, "ONC" for Oncology)
            speciality_abbr = speciality.Speciality_Name[:3].upper()  # Use the first 3 characters of the speciality name as abbreviation

            # Parse date and filter appointments by created_at date and speciality
            try:
                date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'warn': 'Invalid date format. Use YYYY-MM-DD.'})

            speciality_patient_queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Specialization=speciality_id,
                created_at__date=date_obj  # Filters by the date portion of created_at
            ).order_by('created_at')  # Order by created_at

            # Count the appointments
            speciality_patient_count = speciality_patient_queryset.count()

            # Increment the count for the response
            token_no = speciality_patient_count + 1

            # Format the token number as a 3-digit number
            formatted_token_no = f"{speciality_abbr}{token_no:03d}"

            return JsonResponse({
                'date': date,
                'current_count': speciality_patient_count,
                'next_available_token_no': formatted_token_no,
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)





@csrf_exempt
def Patient_management_details(request):
    if request.method == 'GET':
        try:
            # Retrieve GET parameters
            PatientID = request.GET.get('PatientId')
            date = request.GET.get('date', None)

            if not PatientID:
                return JsonResponse({'warn': 'Patient ID is required'}, safe=False)

            # Parse date if provided
            filter_date = None
            if date:
                try:
                    filter_date = datetime.strptime(date, '%Y-%m-%d').date()
                except ValueError:
                    return JsonResponse({'warn': 'Invalid date format. Expected YYYY-MM-DD.'}, safe=False)

            # Query patient appointments
            if filter_date:
                # Fetch records for the specified date
                patient_appointments = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id__PatientId=PatientID,
                    Registration_Id__created_at__date=filter_date
                )
            else:
                # Fetch the last 3 completed appointments if no date is provided
                patient_appointments = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id__PatientId=PatientID,
                    Registration_Id__Status="Completed"
                ).order_by('-created_at')[:3]

            if not patient_appointments.exists():
                return JsonResponse({'warn': 'No data available for the selected patient or date.'}, safe=False)

            records = []

            # Iterate through appointments
            for index, appointment in enumerate(patient_appointments, start=1):
                appointment_date = appointment.Registration_Id.created_at.strftime('%d %b %Y') if appointment.Registration_Id else ''

                # Prepare complaint details
                complaint = {
                    'index': index,
                    'PatientId': appointment.Registration_Id.PatientId.PatientId if appointment.Registration_Id and appointment.Registration_Id.PatientId else '',
                    'date': appointment_date,
                    'Date': appointment.Registration_Id.created_at.strftime('%Y-%m-%d') if appointment.Registration_Id else '',
                    'complaint': appointment.Complaint,
                    'VisitPurpose': appointment.Registration_Id.VisitPurpose if appointment.Registration_Id else '',
                    'PatientType': appointment.Registration_Id.PatientType if appointment.Registration_Id else '',
                    'PatientCategory': appointment.Registration_Id.PatientCategory if appointment.Registration_Id else '',
                }

                # Fetch related General Evaluation details
                general_evaluation = Workbench_GeneralEvaluation.objects.filter(
                    Registration_Id__PatientId_id=PatientID,
                    created_at__date=appointment.created_at.date()
                ).last()

                if general_evaluation:
                    complaint.update({
                        'KeyComplaint': general_evaluation.KeyComplaint,
                        'CheifComplaint': general_evaluation.CheifComplaint,
                        'Diagnosis': general_evaluation.Diagnosis,
                        'Examine': general_evaluation.Examine,
                        'History': general_evaluation.History,
                    })

                # Fetch related Vital Details
                vital_details = Patient_Vital_Details.objects.filter(
                    Registration_Id__PatientId_id=PatientID,
                    created_at__date=appointment.created_at.date()
                ).last()

                if vital_details:
                    complaint.update({
                        'Temperature': vital_details.Temperature,
                        'Pulse_Rate': vital_details.Pulse_Rate,
                        'Heart_Rate': vital_details.Heart_Rate,
                        'SPO2': vital_details.SPO2,
                        'Respiratory_Rate': vital_details.Respiratory_Rate,
                        'SBP': vital_details.SBP,
                        'DBP': vital_details.DBP,
                        'Height': vital_details.Height,
                        'Weight': vital_details.Weight,
                        'BMI': vital_details.BMI,
                        'WC': vital_details.WC,
                        'HC': vital_details.HC,
                    })

                # Fetch Prescription Details
                prescriptions = OPD_Prescription_Details.objects.filter(
                    Registration_Id__PatientId_id=PatientID,
                    created_at__date=appointment.created_at.date()
                )
                prescription_items = {prescription.ItemId.ItemName for prescription in prescriptions if prescription.ItemId}
                if prescription_items:
                    complaint['Prescriptions'] = list(prescription_items)

                # Avoid duplicate entries by checking the date
                if not any(record['date'] == complaint['date'] for record in records):
                    records.append(complaint)

            return JsonResponse(records, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, safe=False)















@csrf_exempt
def Patient_Datewise_Annotedimage_details(request):
    if request.method == 'GET':
        try:
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
                
            # Get query parameters
            PatientID = request.GET.get('PatientId')
            Date = request.GET.get('Date')

            # Log for debugging
            print("PatientID:", PatientID)
            print("Date:", Date)

            # Validate inputs
            if not PatientID:
                return JsonResponse({'warn': 'Patient Id required'}, safe=False)
            if not Date:
                return JsonResponse({'warn': 'Date is required'}, safe=False)

            # Parse the date string to a datetime object
            try:
                filter_date = datetime.strptime(Date, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'warn': 'Invalid Date format. Expected YYYY-MM-DD.'}, safe=False)

            # Query the database
            GeneralEvaluations = Workbench_GeneralEvaluation.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date
            )
            print("GeneralEvaluations", GeneralEvaluations)

            # Check if any records found
            if not GeneralEvaluations.exists():
                return JsonResponse({'warn': 'No records found for the given PatientId and Date'}, safe=False)

            # Prepare the response data
            GeneralEvaluation_data = []
            for evaluation in GeneralEvaluations:
                try:
                    GeneralEvaluation_data.append({
                        'PrimaryDoctorId': evaluation.Registration_Id.PrimaryDoctor.Doctor_ID if evaluation.Registration_Id.PrimaryDoctor else None,
                        'PrimaryDoctorName': evaluation.Registration_Id.PrimaryDoctor.ShortName if evaluation.Registration_Id.PrimaryDoctor else None,
                        'currentAnnotation': get_file_image(evaluation.AnnotationDocument) if evaluation.AnnotationDocument else None,
                        'Date': evaluation.created_at.strftime('%Y-%m-%d'),
                        'Id': evaluation.Id  # Changed this from evaluation.id to evaluation.Id
                    })
                except Exception as e:
                    print(f"Error processing evaluation {evaluation.Id}: {e}")
                    continue  # Skip the problematic record

            return JsonResponse(GeneralEvaluation_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, safe=False)
        


@csrf_exempt
def patient_appointment_details_link(request):
    if request.method == 'GET':
        try:
            PatientID = request.GET.get('PatientId')
            print("PatientIDAppointment", PatientID)

            if not PatientID:
                return JsonResponse({'warn': 'Patient Id required'}, safe=False)

            # Fetch patient appointments
            patient_appointments = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__PatientId=PatientID)
            print("patient_appointments", patient_appointments)

            patient_records = []

            for index, appointment in enumerate(patient_appointments, start=1):
                # Safely access PrimaryDoctor fields with getattr, avoiding AttributeError
                primary_doctor = appointment.PrimaryDoctor
                doctor_name = f"{getattr(primary_doctor, 'Tittle', '')} {getattr(primary_doctor, 'First_Name', '')} {getattr(primary_doctor, 'Middle_Name', '')} {getattr(primary_doctor, 'Last_Name', '')}".strip()
                
                # Safely access Location fields
                location_name = getattr(appointment.Registration_Id.Location, 'Location_Name', 'Trichy') if appointment.Registration_Id.Location else 'Trichy'

                # Appointment data
                appointment_data = {
                    'id': index,
                    'Visitid': appointment.Registration_Id.VisitId if appointment.Registration_Id else '',
                    'VisitPurpose': appointment.Registration_Id.VisitPurpose if appointment.Registration_Id else '',
                    'PrimaryDoctorName': doctor_name,
                    'PrimaryDoctorShortName': getattr(primary_doctor, 'ShorName', 'Unknown'),
                    'Date': appointment.Registration_Id.created_at.strftime('%Y-%m-%d') if appointment.Registration_Id else '',
                    'Status': appointment.Registration_Id.Status if appointment.Registration_Id else '',
                    'Location': location_name,
                }

                patient_records.append(appointment_data)

            return JsonResponse(patient_records, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, safe=False)


@csrf_exempt
def Patient_Datewise_Casesheet_details(request):
    if request.method == 'GET':
        try:
            PatientID = request.GET.get('PatientId')
            Date = request.GET.get('Date')
            if not PatientID:
                return JsonResponse({'warn': 'Patient Id required'}, safe=False)
            if not Date:
                return JsonResponse({'warn': 'Date is required'}, safe=False)
            
            try:
                filter_date = datetime.strptime(Date, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'warn': 'Invalid Date format. Expected YYYY-MM-DD.'}, safe=False)
            
            # Check if a GeneralEvaluation entry exists for the given PatientId and Date
            general_evaluation = Workbench_GeneralEvaluation.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date
            ).last()

            # Check if a VitalDetail entry exists for the given PatientId and Date
            vital_detail = Patient_Vital_Details.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date
            ).last()
            prescription_detail = OPD_Prescription_Details.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date                
            )
            lab_details = Lab_Request_Details.objects.filter(
                Q(OP_Register_Id__PatientId=PatientID) |
                Q(IP_Register_Id__PatientId=PatientID) |
                Q(Casuality_Register_Id__PatientId=PatientID) |
                Q(Laboratory_Register_Id__PatientId=PatientID),
                created_at__date=filter_date
            )


            radiology_details = Radiology_Request_Details.objects.filter(
                Q(OP_Register_Id__PatientId=PatientID) |
                Q(IP_Register_Id__PatientId=PatientID) |
                Q(Casuality_Register_Id__PatientId=PatientID) |
                Q(Diagnosis_Register_Id__PatientId=PatientID),
                created_at__date=filter_date
            )

            
            general_advice = OPD_GeneralAdviceFollowUp.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date,
                AdviceDataCheck=1
            )
            print("general_advice",general_advice)
            nextreview_date = OPD_GeneralAdviceFollowUp.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date,
                FollowUpDataCheck=1
                
            ) 


            # Fetch referral details based on Patient ID and filter date
            refer_doctor = OPD_Referal_Details.objects.filter(
                Registration_Id__PatientId=PatientID,
                created_at__date=filter_date,
            )

            refer_data = []

            if refer_doctor.exists():  # Ensure queryset is not empty
                indexs = 1  # Initialize index
                for refer_doctor_ins in refer_doctor:  # Loop through each referral instance
                    Doctortype = refer_doctor_ins.ReferDoctorType

                    # Check for valid DoctorType and ReferDoctorCheck
                    if Doctortype in ["InHouse", "Visiting"] and refer_doctor_ins.ReferDoctorCheck:
                        response_dict = {
                            'id': indexs,
                            'Refer_Id': refer_doctor_ins.Refer_Id,
                            'VisitId': refer_doctor_ins.VisitId,
                            'ReferDoctorSpeciality': refer_doctor_ins.Speciality.Speciality_Name,
                            'PrimaryDoctorId': f"{refer_doctor_ins.PrimaryDoctorId.Tittle} {refer_doctor_ins.PrimaryDoctorId.ShortName}",
                            'ReferDoctorId': f"{refer_doctor_ins.ReferDoctorId.Tittle} {refer_doctor_ins.ReferDoctorId.ShortName}",
                            'ReferDoctorType': refer_doctor_ins.ReferDoctorType,
                            'Remarks': refer_doctor_ins.Remarks or "No Remarks",
                            'ReferDoctorCheck': refer_doctor_ins.ReferDoctorCheck,
                        }
                        refer_data.append(response_dict)
                        indexs += 1  # Increment index for each valid referral
            else:
                refer_data = None  # No referral data found

                
                
            
            # Process the general evaluation data
            general_evaluation_datas = []
            if general_evaluation:
                # If record exists, update it
                general_evaluation_data = {
                    'RegistrationId': general_evaluation.Registration_Id.pk,
                    'PatientId':general_evaluation.Registration_Id.PatientId.pk,
                    'PatientName': f"{general_evaluation.Registration_Id.PatientId.Title} {general_evaluation.Registration_Id.PatientId.FirstName} {general_evaluation.Registration_Id.PatientId.MiddleName} {general_evaluation.Registration_Id.PatientId.SurName}".strip(),
                    'gender':general_evaluation.Registration_Id.PatientId.Gender,
                    'Age':general_evaluation.Registration_Id.PatientId.Age,
                    'VisitId': general_evaluation.Registration_Id.VisitId,
                    'PrimaryDoctorId': general_evaluation.Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': general_evaluation.Registration_Id.PrimaryDoctor.ShortName,
                    'KeyComplaint': general_evaluation.KeyComplaint,
                    'ChiefComplaint': general_evaluation.CheifComplaint,
                    'History': general_evaluation.History,
                    'Examine': general_evaluation.Examine,
                    'Diagnosis': general_evaluation.Diagnosis,
                    'created_by': general_evaluation.created_by,
                    'Date': general_evaluation.created_at.strftime('%Y-%m-%d'),
                }
                general_evaluation_datas.append(general_evaluation_data)
            else:
                # If no record found, create a new entry
                # You can modify this to add new data for a new general evaluation if needed
                general_evaluation_datas = None  # or other fields to show a new case
                
            # Process the vital details data
            vital_data = []
            if vital_detail:
                # If record exists, update it
                vital_details_data = {
                    'PrimaryDoctorName': vital_detail.Registration_Id.PrimaryDoctor.ShortName,
                    'Temperature': vital_detail.Temperature,
                    'temperature_status': vital_detail.Temperature_Status,
                    'PulseRate': vital_detail.Pulse_Rate,
                    'SPO2': vital_detail.SPO2,
                    'spo2_status': vital_detail.SPO2_Status,
                    'HeartRate': vital_detail.Heart_Rate,
                    'heartrate_status': vital_detail.Heart_Rate_Status,
                    'RespiratoryRate': vital_detail.Respiratory_Rate,
                    'RespiratoryStatus': vital_detail.Respiratory_Status,
                    'SBP': vital_detail.SBP,
                    'sbp_status': vital_detail.SBP_Status,
                    'DBP': vital_detail.DBP,
                    'Height': vital_detail.Height,
                    'Weight': vital_detail.Weight,
                    'BMI': vital_detail.BMI,
                    'WC': vital_detail.WC,
                    'HC': vital_detail.HC,
                    'BSL': vital_detail.BSL,
                    'Painscore': vital_detail.Painscore,
                    'SupplementalOxygen': vital_detail.SupplementalOxygen,
                    'SupplementalOxygen_status': vital_detail.SupplementalOxygen_Status,
                    'LevelOfConsiousness': vital_detail.LevelOfConsiousness,
                    'LevelOfConsiousness_Status': vital_detail.LevelOfConsiousness_Status,
                    'CapillaryRefillTime': vital_detail.CapillaryRefillTime,
                    'CapillaryRefillTime_Status': vital_detail.CapillaryRefillTime_Status,
                    'Type': vital_detail.Type,
                    'Date': vital_detail.created_at.strftime('%d-%m-%y'),
                    'Time': vital_detail.created_at.strftime('%H:%M:%S'),
                }
                vital_data.append(vital_details_data)
            else:
                # If no vital detail is found, you can create a new entry if needed
                vital_data = None  # or other fields to show a new case
            
            prescription_list = []
            index=1
            if prescription_detail:
                prescription_list = []  # Initialize the list
                added_item_ids = set()  # To keep track of already added ItemIds

                for detail in prescription_detail:
                    # Check if the combination of Patient_Id, ItemId, and Date already exists
                    unique_key = (detail.Patient_Id.PatientId, detail.ItemId.pk if detail.ItemId else None, detail.created_at.strftime('%Y-%m-%d'))

                    if unique_key not in added_item_ids:
                        # Create the prescription data
                        prescription_data = {
                            'Id': index,
                            'Patient_Id': detail.Patient_Id.PatientId,
                            'VisitId': detail.VisitId,
                            'ItemId': detail.ItemId.pk if detail.ItemId else None,
                            'ItemType': detail.ItemId.ProductType.ProductType_Name if detail.ItemId else None,
                            'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                            'FrequencyId': detail.FrequencyId.pk if detail.FrequencyId else None,
                            'FrequencyName': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                            'FrequencyType': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                            'Frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                            'Prescription_Id': detail.Prescription_Id,
                            'Dosage': detail.Dosage,
                            'Route': detail.Route,
                            'DurationNumber': detail.DurationNumber,
                            'DurationUnit': detail.DurationUnit,
                            'Frequencys': detail.Frequency,
                            'Qty': detail.Qty,
                            'Instruction': detail.Instruction,
                            'created_by': detail.created_by,
                            'Status': detail.Status,
                            'Date': detail.created_at.strftime('%Y-%m-%d'),
                            'Time': detail.created_at.strftime('%H:%M:%S'),
                        }

                        # Add the unique key to the set so we don't add duplicates
                        added_item_ids.add(unique_key)

                        # Increment index for the next item and append to the list
                        index += 1
                        prescription_list.append(prescription_data)
            else:
                prescription_list = None
            response_data=[]
            indexx = 1
            response_data = []

            if lab_details:
                seen_test_names = set()  # To track unique test names

                for request_item in lab_details:
                    if request_item.TestType == 'Individual':
                        # Process Individual tests
                        if request_item.IndivitualCode:
                            test_code = request_item.IndivitualCode.TestCode
                            test_name = request_item.IndivitualCode.Test_Name

                            # Only add if the test_name is unique
                            if test_name not in seen_test_names:
                                response_data.append({
                                    'id': indexx,
                                    'TestCode': test_code,
                                    'TestName': test_name,
                                    'created_at': request_item.created_at.strftime('%Y-%m-%d %H:%M:%S'), 
                                })
                                seen_test_names.add(test_name)  # Add to the set of seen test names
                                indexx += 1
                            else:
                                print(f"Duplicate Individual test: {test_name} skipped for request ID {request_item.Request_Id}")
                        else:
                            print(f"Warn: Individual test missing IndivitualCode for request ID {request_item.Request_Id}")

                    elif request_item.TestType == 'Favourites':
                        # Process Favourites tests
                        favourite = request_item.FavouriteCode
                        if favourite:
                            for test in favourite.TestName.all():
                                test_code = test.TestCode
                                test_name = test.Test_Name

                                # Only add if the test_name is unique
                                if test_name not in seen_test_names:
                                    response_data.append({
                                        'id': indexx,
                                        'FavouriteCode': favourite.Favourite_Code,
                                        'FavouriteName': favourite.FavouriteName,
                                        'TestCode': test_code,
                                        'TestName': test_name,
                                        'created_at': request_item.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                                    })
                                    seen_test_names.add(test_name)  # Add to the set of seen test names
                                    indexx += 1
                                else:
                                    print(f"Duplicate Favourite test: {test_name} skipped for request ID {request_item.Request_Id}")
                        else:
                            print(f"Warning: Favourites test missing FavouriteCode for request ID {request_item.Request_Id}")

            else:
                response_data = None

            # Final response data
            print(response_data)
            response_datas = []
            indexxxx = 1  # Initialize the index

            if radiology_details:
                for radiology in radiology_details:
                    # Fetch related test and radiology details
                    testname = TestName_Details.objects.filter(Test_Code=radiology.SubTestCode).first()
                    radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=radiology.TestCode).first()

                    # Ensure both related records exist before appending
                    if radiologyname and testname:
                        response_datas.append({
                            'id': indexxxx,
                            'Radiologyid': radiologyname.Radiology_Id,
                            'RadiologyName': radiologyname.Radiology_Name,
                            'TestCode': testname.Test_Code,
                            'TestName': testname.Test_Name,
                            'created_at': radiology.created_at,
                        })
                        indexxxx += 1  # Increment the index
            else:
                response_datas = None
                         

            advice_list = []
            indexa = 1
            if general_advice:
                print("123",general_advice)
                for advice in general_advice:
                    print("advice",advice)
                    advicedata = {
                        'id': index,
                        'Advice': advice.GeneralAdivice if advice.GeneralAdivice else None,
                        'created_at': advice.created_at,
                        
                    }
                    advice_list.append(advicedata)
                    index += 1
            else:
                advice_list = None

            
            review_list = []
            inde = 1
            if nextreview_date:
                for detail in nextreview_date:
                    reviewdata = {
                        'id':inde,
                        'NoOfDays': detail.NoOfDays if detail.NoOfDays else None,
                        'TimeInterval': detail.TimeInterval if detail.TimeInterval else None,
                        'Date': detail.Date if detail.TimeInterval else None,
                        'created_at': advice.created_at,
                        
                    }
                    review_list.append(reviewdata)
                    inde +=1
            else:
                review_list = None
                
                      
                    
                
            
                    
                
            
            
                            
                
                
            # Return the data
            return JsonResponse({
                'general_evaluation_data': general_evaluation_datas,
                'vital_details_data': vital_data,
                'prescription_list':prescription_list,
                'Lab_details':response_data,
                'Radiology_Testname':response_datas,
                'advice':advice_list,
                'referdoctor':refer_data,
                'next_reviewdate':review_list,
            }, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, safe=False)
 

#==================== patient Profile =====================================



@csrf_exempt
def patient_details_management_get_link(request):
    if request.method == 'GET':
        try:
            
            PatientID = request.GET.get('PatientId')
            print("PatientID",PatientID)
            if not PatientID:
                return JsonResponse({'warn':'Patient Id required'}, safe=False)
            print('Patientttt',PatientID)
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
            
          
            
            patient_ins = Patient_Detials.objects.get(PatientId = PatientID)
            print('Pattiiiieeeee',patient_ins)
            full_name =  f'{patient_ins.Title}.{patient_ins.FirstName} {patient_ins.MiddleName} {patient_ins.SurName}'
            patient = {
                'PatientId' : patient_ins.PatientId,
                'PatientName': full_name,
                'PhoneNo': patient_ins.PhoneNo,
                'Email':patient_ins.Email,
                'PatientProfile':get_file_image(patient_ins.Patient_profile) if patient_ins.Patient_profile else None
            }
            return JsonResponse(patient, safe=False)
        except Exception as e:
            return JsonResponse({'error':str(e)})
 
 
 
 #--------filter Phone and Aadhar No

@csrf_exempt
@require_http_methods(["GET"])
def Get_Patient_by_PhoneNo_Using_AbhaRegister(request):
    try:
        # Fetch query parameters
        first_name = request.GET.get("FirstName", '').strip()
        phone_no = request.GET.get("PhoneNo", '').strip()
        UhidNo = request.GET.get("UhidNo",'').strip()
        

        print(first_name, 'FirstName')
        print(phone_no, 'PhoneNo')
        print(UhidNo,'UhidNo')
        
        # Build filter conditions
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(name__icontains=first_name)
        if phone_no:
            filter_conditions &= Q(mobile__iexact=phone_no)

            print(filter_conditions)
        if UhidNo:
            filter_conditions &= Q(UniqueIdNo__iexact=UhidNo)
            print(filter_conditions)



        
        # Query the database
        registration = ABHA_Collectin_Data.objects.filter(filter_conditions)
        registration1 = ABHA_Collectin_Data.objects.filter(UniqueIdNo=UhidNo,mobile=phone_no)

        print(registration1,'registration')

        patient_datas = []
        for reg in registration:
            patient_data = {
                'PhoneNo': reg.mobile,
                'FirstName': reg.name,
                'UniqueIdNo':reg.UniqueIdNo,
            } 
            patient_datas.append(patient_data)

        return JsonResponse(patient_datas, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

 
 
        
# -----------------------------------ABHA------------------------------------------------------
@api_view(['POST'])
@csrf_exempt
def abha_register(request):
    # Extract public key from the request
    data = json.loads(request.body)
    aadhar = data.get('aadhaar_number')
    # publickey = data.get('public_key')
    
    public_key_pem  = """-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
IzQpnSVDUVEzv17grVAw078CAwEAAQ==
-----END PUBLIC KEY-----
"""

    
    public_key = serialization.load_pem_public_key(public_key_pem.encode())
    data_to_encrypt= aadhar
    
    encrypted_data = public_key.encrypt(
    data_to_encrypt.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )

    # Convert encrypted data to base64 for easier handling
    encrypted_base64 = base64.b64encode(encrypted_data).decode()

    # Output the encrypted data
    print("Encrypted Data (Base64):")
    print(encrypted_base64)
    # Generate a unique UUID
    request_id = str(uuid.uuid4())

    # Print or use the request ID as needed
    print("Request ID:", request_id)
    
    timestamp = datetime.utcnow().isoformat() + 'Z'
    print("timestamp",timestamp)

    # Step 2: Get Access Token
    token_response = requests.post(
        "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions",
        json={
            "clientId": "SBXID_007255",
            "clientSecret": "286ced98-3001-41ac-8c32-7d9f5ca9cc3d",
            "grantType": "client_credentials"
        },
        headers={
            "Content-Type": "application/json",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
            "X-CM-ID": "sbx"
        }
    )        
        
    if token_response:
        token_data = token_response.json()
        
        access_token = token_data.get('accessToken')

        if access_token:
            print("Access Token:", access_token)
            aadhaar_number = aadhar
            print("aadhaar_number",aadhaar_number)
            
            otp_payload = {
                "txnId": "",
                "scope": ["abha-enrol"],
                "loginHint": "aadhaar",
                "loginId": encrypted_base64,
                "otpSystem": "aadhaar"
            }

            otp_response = requests.post(
                "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp",
                json=otp_payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                    "REQUEST-ID": request_id,
                    "TIMESTAMP": timestamp,
                    "X-CM-ID": "sbx"
                }
            )

            print("OTP API Response:", otp_response.text)

            # Step 3: Return OTP response
            if otp_response:
                return JsonResponse({
                "otp_response": otp_response.json(),
                "access_token": access_token
            }, status=200)
            else:
                print("OTP API Error:", otp_response.json())
                return Response(otp_response.json(), status=400)
        else:
            print("Error: Access token not found")
            return Response({"error": "Access token not found"}, status=400)

    else:
        print("Token API Error:", token_response.json())
        return Response(token_response.json(), status=400)


def load_public_key(pem_data):
    return serialization.load_pem_public_key(
        pem_data.encode('utf-8'),
        backend=default_backend()
    )
def encrypt_aadhaar(aadhaar_number, public_key):
    # Convert the Aadhaar number to bytes
    aadhaar_bytes = aadhaar_number.encode('utf-8')

    # Encrypt the Aadhaar number using RSA encryption
    encrypted_aadhaar = public_key.encrypt(
        aadhaar_bytes,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Return the encrypted Aadhaar as a base64 encoded string
    return base64.b64encode(encrypted_aadhaar).decode('utf-8')

    
#-------------------------------abha_OTP_register--------------------------------------- 
    
@api_view(['POST'])
@csrf_exempt
def abha_OTP_register(request):
    
    data = json.loads(request.body)
    access_token = data.get('acctoken')
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'
    phone_no = data.get('PhoneNo')
    otp = data.get('otp')
    txn_id = data.get('txnId')
    
  

    
    if access_token:
        
        # Load Public Key
        public_key_pem = """-----BEGIN PUBLIC KEY-----
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
        4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
        wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
        68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
        8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
        Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
        rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
        ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
        0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
        iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
        o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
        IzQpnSVDUVEzv17grVAw078CAwEAAQ==
        -----END PUBLIC KEY-----
        """
        
        try:
            # Encrypt OTP
            public_key = serialization.load_pem_public_key(public_key_pem.encode())
            encrypted_data = public_key.encrypt(
                otp.encode(),
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA1()),
                    algorithm=hashes.SHA1(),
                    label=None
                )
            )
            encrypted_base64 = base64.b64encode(encrypted_data).decode()
            

            # Prepare the request payload for ABHA API
            payload = {
                "authData": {
                    "authMethods": ["otp"],
                    "otp": {
                        "txnId": txn_id,
                        "otpValue": encrypted_base64,
                        "mobile": phone_no
                    }
                },
                "consent": {
                    "code": "abha-enrollment",
                    "version": "1.4"
                }
            }

            # Send OTP verification request to ABHA API
            response = requests.post(
                "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                    "REQUEST-ID": request_id,
                    "TIMESTAMP": timestamp,
                    "X-CM-ID": "sbx"
                }
            )
            print("response",response.json())
            
            if response:
                return JsonResponse({
                "response": response.json()
            }, status=200)
            else:
                print("OTP API Error:", response.json())
                return Response(response.json(), status=400)

            
        except Exception as e:
            print(str(e))
            return JsonResponse({"error": "Failed in block", "details": str(e)}, status=500)

    else:
        print("Token API Error:", access_token)
        return JsonResponse({"error": "Failed to retrieve access token"})
    
# ------------------------------
@api_view(['POST'])
@csrf_exempt
def verifyOtpSubmit(request):
        data = json.loads(request.body)
        access_token = data.get('acctoken')
        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + 'Z'
        phone_no = data.get('PhoneNo')
        txn_id = data.get('txnId')
    
     # Load Public Key
        public_key_pem = """-----BEGIN PUBLIC KEY-----
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
        4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
        wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
        68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
        8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
        Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
        rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
        ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
        0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
        iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
        o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
        IzQpnSVDUVEzv17grVAw078CAwEAAQ==
        -----END PUBLIC KEY-----
        """
        
        data_to_encrypt = phone_no
        print("data_to_encrypt_PhoneNo:",data_to_encrypt)
        
        public_key = serialization.load_pem_public_key(public_key_pem.encode())
        # Encrypt the phone number
        encrypted_phoneNo = public_key.encrypt(
            data_to_encrypt.encode(),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA1()),
                algorithm=hashes.SHA1(),
                label=None
            )
        )
        encrypted_base64mobile = base64.b64encode(encrypted_phoneNo).decode()
        print("encrypted_base64mobile",encrypted_base64mobile)

        # Prepare the request payload for mobile update
        payload = {
            "txnId": txn_id,
            "scope": [
                "abha-enrol",
                "mobile-verify"
            ],
            "loginHint": "mobile",
            "loginId": encrypted_base64mobile,
            "otpSystem": "abdm"
        }

        print("Payload for mobile_update_OTP:", payload)

        # Send mobile update request
        response = requests.post(
            "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
                "REQUEST-ID": request_id,
                "TIMESTAMP": timestamp,
                
            }
        )
        if response:
            response = response.json()
            
            x_token = response.get('xToken')
            print("x_token:",x_token)
            
            print(response)
            return JsonResponse(response, status=200)
        else:
            print("Failed to parse mobile update OTP response:", response.json())
            return Response(response.json(), status=400)

        
# -------------------ABHA_Mobile_OTP----------------------

@api_view(['POST'])
@csrf_exempt
def ABHA_Mobile_OTP(request):
    print("Received Payload:", request.body)

    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'

    # Public Key for OTP Encryption
    public_key_pem = """-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
    4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
    wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
    68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
    8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
    Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
    rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
    ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
    0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
    iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
    o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
    IzQpnSVDUVEzv17grVAw078CAwEAAQ==
    -----END PUBLIC KEY-----"""

    # Load the public key
    public_key = serialization.load_pem_public_key(public_key_pem.encode())

    data = json.loads(request.body)

    access_token = data.get('acctoken')
    txn_id = data.get('txnId')
    mobile_otp = data.get('MobileOtp')

    print("Parsed Data:", data)

    # Encrypt the OTP
    encrypted_data = public_key.encrypt(
        mobile_otp.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )
    encrypted_base64 = base64.b64encode(encrypted_data).decode()

    # Prepare payload for OTP verification
    payload = {
        "scope": ["abha-enrol", "mobile-verify"],
        "authData": {
            "authMethods": ["otp"],
            "otp": {
                "timeStamp": timestamp,
                "txnId": txn_id,
                "otpValue": encrypted_base64
            }
        }
    }

    # Send OTP verification request
    responsed = requests.post(
        "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm",
        json=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
        }
    )
    
    if responsed:
        response_data = responsed.json()
        print(response_data)
        return JsonResponse(response_data)
    else:
        print("Failed to parse mobile update OTP response:", responsed.text)
        return JsonResponse({"error": "OTP Verification Failed", "details": responsed.text}, status=400)

# ---------------------------------------------------------

@api_view(['GET', 'POST'])
@csrf_exempt
def ABHA_Address_Suggestion_API(request):
    
    print("Received Payload:", request.body)
    
    data = json.loads(request.body)
    
    access_token = data.get('acctoken')  
    txn_id = data.get('txnId')
    abha_address=data.get("abhaaddress")

    print(f"Received access_token: {access_token}")
    print(f"Received txn_id: {txn_id}")
    print(f"Received txn_id: {abha_address}")

    request_id = str(uuid.uuid4())
    timestampww = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    print("timestampww",timestampww)

    # if request.method == 'POST':
    print("GET method called: Making the request to ABHA API for address suggestion")
    

    try:
        post_data = {
            "txnId": txn_id,
            "abhaAddress": abha_address,
            "preferred": 1,
        }

        post_response = requests.post(
            "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address",
            json=post_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
                "REQUEST-ID": request_id,
                "TIMESTAMP": timestampww,
            },
            
        )

        print("ABHA API POST Response Status:", post_response)
        print("ABHA API POST Response Content:", post_response.text)

        if post_response:
            return JsonResponse(post_response.json())  # Return the successful response from POST
        else:
            return JsonResponse({"error": post_response.text}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

     
    
    
# -----------------------------------ABHA_card-----------------------------------------


# @api_view(['POST'])
# @csrf_exempt
# def ABHA_card(request):
#     data = json.loads(request.body)
#     access_token = data.get('acctoken')
#     X_token = data.get('xToken')
    
#     print("X_token:", X_token)
#     print("access_token:", access_token)
    
#     request_id = str(uuid.uuid4())
#     timestamp = datetime.utcnow().isoformat() + 'Z'
    
#     # First GET request to fetch ABHA data
#     response_1 = requests.get(
#         "https://abhasbx.abdm.gov.in/abha/api/v3/profile/account",
#         headers={
#             "Authorization": f"Bearer {access_token}",
#             "REQUEST-ID": request_id,
#             "TIMESTAMP": timestamp,
#             "X-Token": f"Bearer {X_token}"
#         }
#     )

#     # if response_1:
#     response_data = response_1.json()
    
#     print("Response from API:", response_1.json())


#     # Extracting the necessary data to save into the database
#     abha_Number = response_data.get('ABHANumber', '')
#     print("abha_Number:",abha_Number)
    
#     abha_address = response_data.get('preferredAbhaAddress', '')
#     name = response_data.get('name', '')
#     address = response_data.get('address', '')
#     created_date = response_data.get('createdDate', '')

#     created_date_obj = datetime.strptime(created_date, "%d-%m-%Y").date() if created_date else None
    
#     day_of_birth = response_data.get('dayOfBirth', '')
#     month_of_birth = response_data.get('monthOfBirth', '')
#     year_of_birth = response_data.get('yearOfBirth', '')
    
#     print("day_of_birth:",day_of_birth)
#     print("month_of_birth:",month_of_birth)
#     print("year_of_birth:",year_of_birth)
    
#     district_name = response_data.get('districtName', '')
#     email = response_data.get('email', '')
#     gender = response_data.get('gender', '')
#     pincode = response_data.get('pincode', '')
#     mobile = response_data.get('mobile', '')
#     mobile_verified = response_data.get('mobileVerified', False)
#     state_name = response_data.get('stateName', '')
#     status = response_data.get('status', '')
#     subdistrict_name = response_data.get('subdistrictName', '')
#     town_name = response_data.get('townName', '')
#     verification_type = response_data.get('verificationType', '')
#     birth_date = datetime(year=int(year_of_birth), month=int(month_of_birth), day=int(day_of_birth)).date()
    
#     existing_data = ABHA_Collectin_Data.objects.filter(mobile=mobile).first()
#     if existing_data:
#         print("Record already exists for mobile:", mobile)
#         return JsonResponse({"message": "Record already exists for the given mobile number."}, status=400)


#     # Create a new ABHA record in the database
#     abha_data = ABHA_Collectin_Data.objects.create(
#         ABHA_RegID=None,  # Let the save method handle auto-increment
#         ABHANumber=abha_Number,
#         preferredAbhaAddress=abha_address,
#         mobile=mobile,
#         name=name,
#         address=address,
#         createdDate=created_date_obj,
        
#         dayOfBirth=birth_date,  
        
#         districtName=district_name,
#         email=email,
#         gender=gender,
#         pincode=pincode,
#         mobileVerified=mobile_verified,
#         stateName=state_name,
#         status=status,
#         subdistrictName=subdistrict_name,
#         townName=town_name,
#         verificationType=verification_type
#     )
#     abha_data.save()
#     print("abha_data:", abha_data)

#     # Return the saved data as a success response
#     if response_1:
#         return JsonResponse(response_1.json())  # Return the successful response from POST
#     else:
#         return JsonResponse({"error": response_1.text}, status=400)


# # ---------------------------------
# @api_view(['GET'])
# @csrf_exempt
# def ABHA_card_get(request):
#     if request.method == 'GET':
#         try:
#             MobileNo = request.GET.get('Mobile_No', None)
#             AadhaarNo = request.GET.get('Aadhaar_No', None)

#             # Base queryset
#             ip_request_ins = ABHA_Collectin_Data.objects.all()

#             # Apply filters if present
#             if MobileNo:
#                 ip_request_ins = ip_request_ins.filter(mobile=MobileNo)
#             if AadhaarNo:
#                 ip_request_ins = ip_request_ins.filter(adhar_no=AadhaarNo)

#             iprequest_list = []
#             for datas in ip_request_ins:
#                 print(datas.mobile)
#                 data_list = {
#                     'ABHA_RegID': datas.ABHA_RegID,
#                     'ABHANumber': datas.ABHANumber,
#                     'preferredAbhaAddress': datas.preferredAbhaAddress,
#                     'name': datas.name,
#                     'address': datas.address,
#                     'createdDate': datas.createdDate,
#                     'dayOfBirth': datas.dayOfBirth,
#                     'districtName': datas.districtName,
#                     'email': datas.email,
#                     'gender': datas.gender,
#                     'pincode': datas.pincode,
#                     'mobile': datas.mobile,
#                     'mobileVerified': datas.mobileVerified,
#                     'stateName': datas.stateName,
#                     'status': datas.status,
#                     'subdistrictName': datas.subdistrictName,
#                     'townName': datas.townName,
#                     'verificationType': datas.verificationType,
#                     # 'aadhaar_no': datas.adhar_no,  # ✅ Optional: include Aadhaar in response
#                 }
#                 iprequest_list.append(data_list)

#             return JsonResponse(iprequest_list, safe=False)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# -----------------------------------ABHA------------------------------------------------------

@api_view(['POST'])
@csrf_exempt
def abha_register(request):
    # Extract public key from the request
    data = json.loads(request.body)
    aadhar = data.get('aadhaar_number')
    # publickey = data.get('public_key')
    
    public_key_pem  = """-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
IzQpnSVDUVEzv17grVAw078CAwEAAQ==
-----END PUBLIC KEY-----
"""

    
    public_key = serialization.load_pem_public_key(public_key_pem.encode())
    data_to_encrypt= aadhar
    
    encrypted_data = public_key.encrypt(
    data_to_encrypt.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )

    # Convert encrypted data to base64 for easier handling
    encrypted_base64 = base64.b64encode(encrypted_data).decode()

    # Output the encrypted data
    print("Encrypted Data (Base64):")
    print(encrypted_base64)
    # Generate a unique UUID
    request_id = str(uuid.uuid4())

    # Print or use the request ID as needed
    print("Request ID:", request_id)
    
    timestamp = datetime.utcnow().isoformat() + 'Z'
    print("timestamp",timestamp)

    # Step 2: Get Access Token
    token_response = requests.post(
        "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions",
        json={
            "clientId": "SBXID_007255",
            "clientSecret": "286ced98-3001-41ac-8c32-7d9f5ca9cc3d",
            "grantType": "client_credentials"
        },
        headers={
            "Content-Type": "application/json",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
            "X-CM-ID": "sbx"
        }
    )        

    print(token_response,'token_responseeeeeeeeeeeeee')

    if token_response:

        print('Inside reportttttttt')
        token_data = token_response.json()
        

        print(token_data,'token_data')
        access_token = token_data.get('accessToken')
        print(access_token,'access_token')

        if access_token:
            print("Access Token:", access_token)
            aadhaar_number = aadhar
            print("aadhaar_number",aadhaar_number)
            
            otp_payload = {
                "txnId": "",
                "scope": ["abha-enrol"],
                "loginHint": "aadhaar",
                "loginId": encrypted_base64,
                "otpSystem": "aadhaar"
            }

            otp_response = requests.post(
                "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp",
                json=otp_payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                    "REQUEST-ID": request_id,
                    "TIMESTAMP": timestamp,
                    "X-CM-ID": "sbx"
                }
            )

            print("OTP API Response:", otp_response.text)

            # Step 3: Return OTP response
            if otp_response:
                return JsonResponse({
                "otp_response": otp_response.json(),
                "access_token": access_token
            }, status=200)
            else:
                print("OTP API Error:", otp_response.json())
                return Response(otp_response.json(), status=400)
        else:
            print("Error: Access token not found")
            return Response({"error": "Access token not found"}, status=400)

    else:
        print("Token API Error:", token_response.json())
        return Response(token_response.json(), status=400)





def load_public_key(pem_data):
    return serialization.load_pem_public_key(
        pem_data.encode('utf-8'),
        backend=default_backend()
    )

def encrypt_aadhaar(aadhaar_number, public_key):
    # Convert the Aadhaar number to bytes
    aadhaar_bytes = aadhaar_number.encode('utf-8')

    # Encrypt the Aadhaar number using RSA encryption
    encrypted_aadhaar = public_key.encrypt(
        aadhaar_bytes,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Return the encrypted Aadhaar as a base64 encoded string
    return base64.b64encode(encrypted_aadhaar).decode('utf-8')

    
#-------------------------------abha_OTP_register--------------------------------------- 
    
@api_view(['POST'])
@csrf_exempt
def abha_OTP_register(request):
    
    data = json.loads(request.body)
    access_token = data.get('acctoken')
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'
    phone_no = data.get('PhoneNo')
    otp = data.get('otp')
    txn_id = data.get('txnId')
    
  

    
    if access_token:
        
        # Load Public Key
        public_key_pem = """-----BEGIN PUBLIC KEY-----
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
        4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
        wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
        68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
        8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
        Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
        rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
        ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
        0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
        iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
        o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
        IzQpnSVDUVEzv17grVAw078CAwEAAQ==
        -----END PUBLIC KEY-----
        """
        
        try:
            # Encrypt OTP
            public_key = serialization.load_pem_public_key(public_key_pem.encode())
            encrypted_data = public_key.encrypt(
                otp.encode(),
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA1()),
                    algorithm=hashes.SHA1(),
                    label=None
                )
            )
            encrypted_base64 = base64.b64encode(encrypted_data).decode()
            

            # Prepare the request payload for ABHA API
            payload = {
                "authData": {
                    "authMethods": ["otp"],
                    "otp": {
                        "txnId": txn_id,
                        "otpValue": encrypted_base64,
                        "mobile": phone_no
                    }
                },
                "consent": {
                    "code": "abha-enrollment",
                    "version": "1.4"
                }
            }

            # Send OTP verification request to ABHA API
            response = requests.post(
                "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                    "REQUEST-ID": request_id,
                    "TIMESTAMP": timestamp,
                    "X-CM-ID": "sbx"
                }
            )
            print("response",response.json())
            
            if response:
                return JsonResponse({
                "response": response.json()
            }, status=200)
            else:
                print("OTP API Error:", response.json())
                return Response(response.json(), status=400)

            
        except Exception as e:
            print(str(e))
            return JsonResponse({"error": "Failed in block", "details": str(e)}, status=500)

    else:
        print("Token API Error:", access_token)
        return JsonResponse({"error": "Failed to retrieve access token"})
    
# ------------------------------
@api_view(['POST'])
@csrf_exempt
def verifyOtpSubmit(request):
        data = json.loads(request.body)
        access_token = data.get('acctoken')
        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + 'Z'
        phone_no = data.get('PhoneNo')
        txn_id = data.get('txnId')
    
     # Load Public Key
        public_key_pem = """-----BEGIN PUBLIC KEY-----
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
        4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
        wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
        68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
        8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
        Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
        rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
        ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
        0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
        iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
        o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
        IzQpnSVDUVEzv17grVAw078CAwEAAQ==
        -----END PUBLIC KEY-----
        """
        
        data_to_encrypt = phone_no
        print("data_to_encrypt_PhoneNo:",data_to_encrypt)
        
        public_key = serialization.load_pem_public_key(public_key_pem.encode())
        # Encrypt the phone number
        encrypted_phoneNo = public_key.encrypt(
            data_to_encrypt.encode(),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA1()),
                algorithm=hashes.SHA1(),
                label=None
            )
        )
        encrypted_base64mobile = base64.b64encode(encrypted_phoneNo).decode()
        print("encrypted_base64mobile",encrypted_base64mobile)

        # Prepare the request payload for mobile update
        payload = {
            "txnId": txn_id,
            "scope": [
                "abha-enrol",
                "mobile-verify"
            ],
            "loginHint": "mobile",
            "loginId": encrypted_base64mobile,
            "otpSystem": "abdm"
        }

        print("Payload for mobile_update_OTP:", payload)

        # Send mobile update request
        response = requests.post(
            "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
                "REQUEST-ID": request_id,
                "TIMESTAMP": timestamp,
                
            }
        )
        if response:
            response = response.json()
            
            x_token = response.get('xToken')
            print("x_token:",x_token)
            
            print(response)
            return JsonResponse(response, status=200)
        else:
            print("Failed to parse mobile update OTP response:", response.json())
            return Response(response.json(), status=400)

        
# -------------------ABHA_Mobile_OTP----------------------

@api_view(['POST'])
@csrf_exempt
def ABHA_Mobile_OTP(request):
    print("Received Payload:", request.body)

    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'

    # Public Key for OTP Encryption
    public_key_pem = """-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO
    4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N
    wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u
    68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN
    8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf
    Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i
    rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN
    ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG
    0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu
    iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3
    o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls
    IzQpnSVDUVEzv17grVAw078CAwEAAQ==
    -----END PUBLIC KEY-----"""

    # Load the public key
    public_key = serialization.load_pem_public_key(public_key_pem.encode())

    data = json.loads(request.body)

    access_token = data.get('acctoken')
    txn_id = data.get('txnId')
    mobile_otp = data.get('MobileOtp')

    print("Parsed Data:", data)

    # Encrypt the OTP
    encrypted_data = public_key.encrypt(
        mobile_otp.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA1()),
            algorithm=hashes.SHA1(),
            label=None
        )
    )
    encrypted_base64 = base64.b64encode(encrypted_data).decode()

    # Prepare payload for OTP verification
    payload = {
        "scope": ["abha-enrol", "mobile-verify"],
        "authData": {
            "authMethods": ["otp"],
            "otp": {
                "timeStamp": timestamp,
                "txnId": txn_id,
                "otpValue": encrypted_base64
            }
        }
    }

    # Send OTP verification request
    responsed = requests.post(
        "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm",
        json=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
        }
    )
    
    if responsed:
        response_data = responsed.json()
        print(response_data)
        return JsonResponse(response_data)
    else:
        print("Failed to parse mobile update OTP response:", responsed.text)
        return JsonResponse({"error": "OTP Verification Failed", "details": responsed.text}, status=400)

# ---------------------------------------------------------

@api_view(['GET', 'POST'])
@csrf_exempt
def ABHA_Address_Suggestion_API(request):
    
    print("Received Payload:", request.body)
    
    data = json.loads(request.body)
    
    access_token = data.get('acctoken')  
    txn_id = data.get('txnId')
    abha_address=data.get("abhaaddress")

    print(f"Received access_token: {access_token}")
    print(f"Received txn_id: {txn_id}")
    print(f"Received txn_id: {abha_address}")

    request_id = str(uuid.uuid4())
    timestampww = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    print("timestampww",timestampww)

    # if request.method == 'POST':
    print("GET method called: Making the request to ABHA API for address suggestion")
    

   
    try:
        post_data = {
            "txnId": txn_id,
            "abhaAddress": abha_address,
            "preferred": 1,
        }

        post_response = requests.post(
            "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address",
            json=post_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
                "REQUEST-ID": request_id,
                "TIMESTAMP": timestampww,
            },
            
        )

        print("ABHA API POST Response Status:", post_response)
        print("ABHA API POST Response Content:", post_response.text)

        if post_response:
            return JsonResponse(post_response.json())  # Return the successful response from POST
        else:
            return JsonResponse({"error": post_response.text}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

     
# -----------------------------------ABHA_card-----------------------------------------


@api_view(['POST'])
@csrf_exempt
def ABHA_card(request):
    data = json.loads(request.body)
    access_token = data.get('acctoken')
    X_token = data.get('xToken')
    UhidNo = data.get('UhidNo')
    
    print("X_token:", X_token)
    print("access_token:", access_token)
    print(UhidNo,'UhidNo')
    
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'
    
    # First GET request to fetch ABHA data
    response_1 = requests.get(
        "https://abhasbx.abdm.gov.in/abha/api/v3/profile/account",
        headers={
            "Authorization": f"Bearer {access_token}",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
            "X-Token": f"Bearer {X_token}"
        }
    )

    # if response_1:
    response_data = response_1.json()
    
    print("Response from API:", response_1.json())


    # Extracting the necessary data to save into the database
    abha_Number = response_data.get('ABHANumber', '')
    print("abha_Number:",abha_Number)
    
    abha_address = response_data.get('preferredAbhaAddress', '')
    name = response_data.get('name', '')
    address = response_data.get('address', '')
    created_date = response_data.get('createdDate', '')

    created_date_obj = datetime.strptime(created_date, "%d-%m-%Y").date() if created_date else None
    
    day_of_birth = response_data.get('dayOfBirth', '')
    month_of_birth = response_data.get('monthOfBirth', '')
    year_of_birth = response_data.get('yearOfBirth', '')
    
    print("day_of_birth:",day_of_birth)
    print("month_of_birth:",month_of_birth)
    print("year_of_birth:",year_of_birth)
    
    district_name = response_data.get('districtName', '')
    email = response_data.get('email', '')
    gender = response_data.get('gender', '')
    pincode = response_data.get('pincode', '')
    mobile = response_data.get('mobile', '')
    mobile_verified = response_data.get('mobileVerified', False)
    state_name = response_data.get('stateName', '')
    status = response_data.get('status', '')
    subdistrict_name = response_data.get('subdistrictName', '')
    town_name = response_data.get('townName', '')
    verification_type = response_data.get('verificationType', '')
    birth_date = datetime(year=int(year_of_birth), month=int(month_of_birth), day=int(day_of_birth)).date()
    
    existing_data = ABHA_Collectin_Data.objects.filter(name=name,ABHANumber=abha_Number).first()
    if existing_data:
        print("Record already exists for mobile:", mobile)
        return JsonResponse({"message": "Record already exists for the given mobile number."}, status=400)


    # Create a new ABHA record in the database
    abha_data = ABHA_Collectin_Data.objects.create(
        ABHA_RegID=None,  # Let the save method handle auto-increment
        ABHANumber=abha_Number,
        preferredAbhaAddress=abha_address,
        mobile=mobile,
        name=name,
        address=address,
        createdDate=created_date_obj,
        
        dayOfBirth=birth_date,  
        
        districtName=district_name,
        email=email,
        gender=gender,
        pincode=pincode,
        mobileVerified=mobile_verified,
        stateName=state_name,
        status=status,
        subdistrictName=subdistrict_name,
        townName=town_name,
        verificationType=verification_type,
        UniqueIdNo=UhidNo
    )
    abha_data.save()
    print("abha_data:", abha_data)

    # Return the saved data as a success response
    if response_1:
        return JsonResponse(response_1.json())  # Return the successful response from POST
    else:
        return JsonResponse({"error": response_1.text}, status=400)
    
    # else:
    #     return JsonResponse({"error": response_1.json()}, status=400)

# ---------------------------------
@api_view(['GET'])
@csrf_exempt
def ABHA_card_get(request):
    if request.method == 'GET':
        try:
            MobileNo = request.GET.get('Mobile_No', None)
            UHIDNo = request.GET.get('UHIDNo','')
            ip_request_ins = ABHA_Collectin_Data.objects.filter(mobile=MobileNo,UniqueIdNo=UHIDNo)
            iprequest_list = []
            for datas in ip_request_ins:
                print(datas.mobile)
                data_list = {

                    'ABHA_RegID':datas.ABHA_RegID,
                    'ABHANumber':datas.ABHANumber,
                    'preferredAbhaAddress':datas.preferredAbhaAddress,
                    'name':datas.name,
                    'address':datas.address,
                    'createdDate':datas.createdDate,
                    'dayOfBirth':datas.dayOfBirth,
                    'districtName':datas.districtName,
                    'email':datas.email,
                    'gender':datas.gender,
                    'pincode':datas.pincode,
                    'mobile':datas.mobile,
                    'mobileVerified':datas.mobileVerified,
                    'stateName':datas.stateName,
                    'status':datas.status,
                    'subdistrictName':datas.subdistrictName,
                    'townName':datas.townName,
                    'verificationType':datas.verificationType,

                }
                iprequest_list.append(data_list)

            return JsonResponse(iprequest_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
@api_view(['GET'])
@csrf_exempt
def search_patients_by_phone(request):
    phone = request.GET.get('phone', '').strip()
    if not phone:
        return Response({'error': 'Phone number is required'}, status=400)
   
    primary_patient_id = request.GET.get('primary_patient_id', None)  # Get primary patient ID if provided
 
    patients = Patient_Detials.objects.filter(PhoneNo=phone)
 
    if primary_patient_id:
        # Exclude family members if primary patient ID is provided
        family_members = FamilyMember.objects.filter(primary_patient_id=primary_patient_id).values_list('family_member_id', flat=True)
        patients = patients.exclude(PatientId__in=family_members)
 
    data = [{
        'PatientId': p.PatientId,
        'FirstName': p.FirstName,
        'MiddleName': p.MiddleName or '',
        'SurName': p.SurName or '',
        'PhoneNo': p.PhoneNo,
        'Status': p.Status or 'Unknown'
    } for p in patients]
    return Response(data if data else [], status=200)
 
@api_view(['POST'])
@csrf_exempt
def add_family_members(request):
    try:
        primary_patient_id = request.data.get('primary_patient_id')
        family_member_ids = request.data.get('family_member_ids', [])
 
        if not primary_patient_id:
            return Response({'error': 'Primary patient ID is required'}, status=400)
 
        primary_patient = Patient_Detials.objects.get(PatientId=primary_patient_id)
 
        # Create family member relationships
        for member_id in family_member_ids:
            if member_id != primary_patient_id:
                family_member = Patient_Detials.objects.get(PatientId=member_id)
                FamilyMember.objects.get_or_create(primary_patient=primary_patient, family_member=family_member)
 
        family_members = FamilyMember.objects.filter(primary_patient=primary_patient)
        data = [{
            'id': fm.family_member.PatientId,
            'name': f"{fm.family_member.FirstName} {fm.family_member.MiddleName or ''} {fm.family_member.SurName or ''}".strip(),
            'mobileNumber': fm.family_member.PhoneNo,
            'status': "active",
        } for fm in family_members]
 
        return Response(data, status=200)
 
    except Exception as e:
        return Response({'error': str(e)}, status=400)
   
   
@api_view(['PUT'])
@csrf_exempt
def update_family_members(request, patient_id):
    try:
        patient = Patient_Detials.objects.get(PatientId=patient_id)
       
        family_member_ids = request.data.get("family_member_ids", [])
 
        if not family_member_ids:
            return Response({'error': 'No family members provided'}, status=400)
 
        FamilyMember.objects.filter(primary_patient=patient).delete()
 
        for member_id in family_member_ids:
            if member_id != patient_id:  
                family_member = get_object_or_404(Patient_Detials, PatientId=member_id)
                FamilyMember.objects.create(primary_patient=patient, family_member=family_member)
 
        family_members = FamilyMember.objects.filter(primary_patient=patient)
        data = [{
            'id': fm.family_member.PatientId,
            'name': f"{fm.family_member.FirstName} {fm.family_member.MiddleName or ''} {fm.family_member.SurName or ''}".strip(),
            'mobileNumber': fm.family_member.PhoneNo,
        } for fm in family_members]
       
        return Response(data, status=200)
       
    except Patient_Detials.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=404)
   
@api_view(['GET'])
@csrf_exempt
def get_family_members(request, primary_patient_id):
    try:
        family_members = FamilyMember.objects.filter(primary_patient_id=primary_patient_id)
        data = [{
            'id': fm.family_member.PatientId,
            'name': f"{fm.family_member.FirstName} {fm.family_member.MiddleName or ''} {fm.family_member.SurName or ''}".strip(),
            'mobileNumber': fm.family_member.PhoneNo,
            'status': fm.status ,
        } for fm in family_members]
        return Response(data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_MHC_Registration(request):  
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
 
                    Serviceaddedlist = data.get('Serviceaddedlist',[])
 
 
                    patient = None
                    patient_visit_id = None
                   
                    patient = Patient_Detials.objects.get(pk=patient_id)
 
                    if RegistrationId :
 
                        print(RegistrationId,'RegistrationId')
 
                        OP_Patient = Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
 
                        OP_Patient.PatientId = patient
                        OP_Patient.VisitPurpose = register_type
                        OP_Patient.IsMLC = IsMLC
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
 
 
                        print('premkkkkkkkkkk')
 
                        referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
 
                        print('premkkkkkkkkkk',referral)
 
                        if referral:
                            referral.OP_Register_Id=OP_Patient
                            referral.ReferralRegisteredBy=register_type
                            referral.ReferralSource=ReferralSource
                            referral.ReferredBy=referral_doctor_instance
                            referral.save()
 
                        rad_doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Raddocid)
                        rad_doc_ins.PrimaryDoctor = doctor_name_instance
                        rad_doc_ins.Specialization = specialization_instance
                        rad_doc_ins.VisitType = "WALK-IN"
                        rad_doc_ins.Complaint = 'Radiologytest'
                        rad_doc_ins.TokenNo = None
                        rad_doc_ins.save()
 
                        print(rad_doc_ins,'rad_doc_ins')
 
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
 
                      
 
                                   
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    patient_visit_id = generate_or_update_visit_id(patient, register_type)
 
                    Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
           
                    #
 
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
 
                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                        Registration_Id = Patient_OP,
                        PrimaryDoctor = doctor_name_instance,
                        Specialization = specialization_instance,
                        VisitType = "WALK-IN-MHC",
                        Complaint = 'MHC',
                        TokenNo = None,
                    )
                    Multile_Doctor.save()

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
                    ReferralRegisteredBy = 'MHC',
                    ReferralSource = ReferralSource,
                    ReferredBy = referral_doctor_instance,
               
                    )
                    referral.save()
 
 
                    registration_id = Patient_OP.pk
 
                    print(registration_id,'registration_id')
                    print(register_type,'register_type')
                    rad_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)

                    Packagename = data.get('Packagename','')
                    pid = Packagename.get('pkgid','')
 
                    if register_type == 'MHC':


                        Packagename = data.get('Packagename','')
                        pid = Packagename.get('pkgid','')


                        Packagesins = Package_Master.objects.get(pk = pid)

                        Master_health_care_request_details.objects.create(
 
                            Packages = Packagesins,
                            RegisterType = 'WALK-IN',
                            OP_Register_Id = rad_ins,
                            IP_Register_Id = None,
                            Emg_Register_Id = None,
                            created_by = created_by
 
                        )

                    return JsonResponse({'success': 'Patient  registered successfully','RegistrationId':Patient_OP.Registration_Id})
 
                except Exception as e:
       
                        return JsonResponse({'error':str(e)})
 
 


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_DAYCARE_Registration(request):  
        @transaction.atomic
        def generate_or_update_visit_id(patient, register_type):
            today = datetime.now().date()

            # Get the highest VisitId for today only
            max_visit_id_today = Patient_Visit_Detials.objects.filter(
                PatientId=patient,
                created_at__date=today
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
                    package_arr = data.get('PackageArr', [])
                    favourites_arr = data.get('FavouritesArr', [])
                    indivitual_arr = data.get('IndivitualArr', [])
                    specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
                    doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=daycaredoctor) if daycaredoctor else None
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
                                    
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                    
                    patient_visit_id = generate_or_update_visit_id(patient, register_type)

                                
                    Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
                    PatientId = patient,
                    VisitId = patient_visit_id,  
                    VisitPurpose = register_type,
                    VisitType = 'WALK-IN',
                    Specialization = specialization_instance,
                    PrimaryDoctor = doctor_name_instance,
                    TokenNo = TokenNo,
                    Complaint = Complaint,
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
                    ServiceCategory = ServiceCategory,
                    ServiceSubCategory = ServiceSubCategory,
                    created_by = created_by,
                    
                    )
                    Patient_OP.save()

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

                    rad_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)


                  

                    print(selecteddaycare,'Packagename')
                  


                    for ser in selecteddaycare:
                        
                        Categoryname  = ser.get('Categoryname','')
                        SubCategoryname = ser.get('SubCategoryname','')
                        dcname = ser.get('dcname','')
                        dcid = ser.get('dcid','')

                        therapyins = None
                        Procedureins = None


                        if Categoryname == 'Therapy':

                            therapyins = TherapyType_Detials.objects.get(pk = dcid)

                        elif Categoryname == 'Procedure':

                            Procedureins = Procedure_Master_Details.objects.get(pk = dcid)

                        # Packagesins = Package_Master.objects.get(pk = pid)

                        DayCare_request_details.objects.create(

                            Procedure = Procedureins,
                            Therapy = therapyins,
                            RegisterType = 'WALK-IN',
                            OP_Register_Id = rad_ins,
                            IP_Register_Id = None,
                            Emg_Register_Id = None,
                            ServiceType = Categoryname,
                            Services = dcname,
                            created_by = created_by

                        )

                    return JsonResponse({'success': 'Patient Appointment registered successfully','RegistrationId':Patient_OP.Registration_Id})

                except Exception as e:
        
                        return JsonResponse({'error':str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def Patients_Management_Filter_for_ledger(request):
    try:
        SearchbyFirstName = request.GET.get('SearchbyFirstName')
        
        # Other search parameters
        SearchbySpeciality = request.GET.get('SearchbySpeciality')
        SearchbyDoctor = request.GET.get('SearchbyDoctor')
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        status_filter = request.GET.get('SearchStatus')
 
        search_query = Q()

        if SearchbyFirstName:
            search_query &= Q(FirstName__icontains=SearchbyFirstName) | \
                            Q(MiddleName__icontains=SearchbyFirstName) | \
                            Q(SurName__icontains=SearchbyFirstName) | \
                            Q(PatientId__icontains=SearchbyFirstName) | \
                            Q(PhoneNo__icontains=SearchbyFirstName) | \
                            Q(UniqueIdNo__icontains=SearchbyFirstName)
            
        if DateType == "Current" and CurrentDate:
            search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
        elif DateType == "Customize":
            if FromDate and ToDate:
                search_query &= Q(created_at__date__range=[FromDate, ToDate])
            elif FromDate:
                search_query &= Q(created_at__date__gte=FromDate)
            elif ToDate:
                search_query &= Q(created_at__date__lte=ToDate)
 
        patient_ins = Patient_Detials.objects.filter(search_query)
    
        # Prepare response data
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientId,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'Email': patient.Email,
                'UHIDNo': patient.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
            
            } for idx, patient in enumerate(patient_ins, start=1)
        ]

        return JsonResponse(patient_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

def Registration_Management_Filter_for_ledger(request):
    try:
        SearchbyFirstName = request.GET.get('SearchbyFirstName')
        SearchbySpeciality = request.GET.get('SearchbySpeciality')
        SearchbyDoctor = request.GET.get('SearchbyDoctor')
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        status_filter = request.GET.get('SearchStatus')
        
        print('SearchbyFirstName',SearchbyFirstName)
        search_query = Q()

        if SearchbyFirstName:
            search_query &= Q(PatientId__FirstName__icontains=SearchbyFirstName) | \
                            Q(PatientId__MiddleName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__icontains=SearchbyFirstName) | \
                            Q(PatientId__SurName__icontains=SearchbyFirstName) | \
                            Q(PatientId__PatientId__icontains=SearchbyFirstName) | \
                            Q(PatientId__PhoneNo__icontains=SearchbyFirstName) | \
                            Q(PatientId__UniqueIdNo__icontains=SearchbyFirstName)

        if DateType == "Current" and CurrentDate:
            search_query &= Q(created_at__date=CurrentDate)
        elif DateType == "Customize":
            if FromDate and ToDate:
                search_query &= Q(created_at__date__range=[FromDate, ToDate])
            elif FromDate:
                search_query &= Q(created_at__date__gte=FromDate)
            elif ToDate:
                search_query &= Q(created_at__date__lte=ToDate)

        op_ins = Patient_Appointment_Registration_Detials.objects.filter(search_query)
        ip_ins = Patient_IP_Registration_Detials.objects.filter(search_query)
        
        combined_results = []

        for idx, patient in enumerate(list(op_ins) + list(ip_ins), start=1):
            combined_results.append({
                'id': idx,
                'PatientId': patient.PatientId.PatientId,
                'RegistrationId': patient.Registration_Id,
                'PhoneNo': int(patient.PatientId.PhoneNo) if patient.PatientId.PhoneNo else None,
                'FirstName': patient.PatientId.FirstName,
                'MiddleName': patient.PatientId.MiddleName,
                'SurName': patient.PatientId.SurName,
                'FullName': f'{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}',
                'Gender': patient.PatientId.Gender,
                'Email': patient.PatientId.Email,
                'UHIDNo': patient.PatientId.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
            })

        return JsonResponse(combined_results, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
def OpdRec_Queue_POST(request):
    try:
        data = json.loads(request.body)
        print('data:',data)
        name = data.get('name')
        keydata = data.get("keydata",{})
        print('name :',name)
        primary_doctor_id  = keydata.get("primary_doctor_id")
        print('passingdoctorid', primary_doctor_id)
        registrationid = keydata.get("registrationid")
        registration_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registrationid)
        print('registration_instance :',registration_instance)
        patient_instance = Patient_Detials.objects.get(PatientId=keydata.get("PatientId"))
        print('patient_instance :',patient_instance)
        Visit_id = keydata.get("VisitId")
        doctorid = keydata.get('DoctorId')
        doctorid = keydata.get('doctorid')
        print('lastofus',doctorid)
        created_by = data.get("created_by")
        op_ip_data = data.get("op_ip_data",{})
        if name == "referdoctor":
            print('doctor :')
            refer_doctor_instance=update_refer_doctor_data(keydata, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registrationid)
        elif name=='admit':
            opto_ip_instance=update_op_ip_data(keydata, registration_instance, patient_instance,created_by)
        elif name=='ot_request':
            ot_request_instance=update_ot_request_data(keydata,created_by, registration_instance, patient_instance)
        elif name=='followup':
            adviceData = data.get("adviceData",{})
            followup_instance=update_follow_up_data(adviceData,keydata, created_by, registration_instance, patient_instance)
 
        return JsonResponse({'success': 'Prescription Saved successfully'}, status=200)
    except Exception as e:
        return JsonResponse({"Error": str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def Filter_IP_Patient_by_Multiple_Criteria_Advance(request):
    try:
        # Fetch query parameters
        first_name = request.GET.get("FirstName", "").strip()
        phone_no = request.GET.get("PhoneNo", "").strip()
        patient_id = request.GET.get("PatientId", "").strip()

        print(first_name, "FirstName")
        print(phone_no, "PhoneNo")
        print(patient_id, "PatientId")

        # Build filter conditions
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(PatientId__FirstName__icontains=first_name)
        if phone_no:
            filter_conditions &= Q(PatientId__PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__PatientId__icontains=patient_id)

        # Fetch patient data from both models
        patients_ip = Patient_IP_Registration_Detials.objects.filter(filter_conditions)
        patients_appointment = Patient_Appointment_Registration_Detials.objects.filter(filter_conditions)

        # Dictionary to store unique PatientId entries
        patient_dict = {}

        # Process IP Patients FIRST (Higher Priority)
        for patient in patients_ip:
            patient_id_key = patient.PatientId.PatientId
            if patient_id_key not in patient_dict:  # Ensure unique PatientId
                patient_dict[patient_id_key] = {
                    "RegistrationId": patient.Registration_Id,
                    "PatientId": patient_id_key,
                    "PhoneNo": int(patient.PatientId.PhoneNo) if patient.PatientId.PhoneNo and patient.PatientId.PhoneNo.isdigit() else None,
                    "FirstName": patient.PatientId.FirstName,
                    "Department": "IP",  # IP patients have priority
                }

        # Process OP Patients (Only if PatientId is NOT in IP)
        for patient in patients_appointment:
            patient_id_key = patient.PatientId.PatientId
            if patient_id_key not in patient_dict:  # Avoid duplicates
                patient_dict[patient_id_key] = {
                    "RegistrationId": patient.Registration_Id,
                    "PatientId": patient_id_key,
                    "PhoneNo": int(patient.PatientId.PhoneNo) if patient.PatientId.PhoneNo and patient.PatientId.PhoneNo.isdigit() else None,
                    "FirstName": patient.PatientId.FirstName,
                    "Department": "OP",
                }

        # Convert dictionary values to a list (No duplicates)
        patient_data = list(patient_dict.values())

        return JsonResponse(patient_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": "An internal server error occurred"}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def get_IP_Patient_Details_by_patientId_Advance(request):
    try:
        Registerid = request.GET.get("Registerid", "").strip()  # Strip whitespace
        print("Registerid------------", Registerid)

        patient = None
        Registerid_ins_op = None
        Registerid_ins_ip = None

        if Registerid:
            Registerid_ins_ip = Patient_IP_Registration_Detials.objects.filter(
                Registration_Id=Registerid
            ).first()

            if Registerid:  # Ensure it's a number before converting
                Registerid_ins_op = Patient_Appointment_Registration_Detials.objects.filter(
                    Registration_Id=Registerid
                ).first()

        if not Registerid_ins_op and not Registerid_ins_ip:
            return JsonResponse({'warn': 'Patient does not exist'})


  
        patient = Registerid_ins_op or Registerid_ins_ip
        patient_id = patient.PatientId if patient else None

        if not patient_id:
            return JsonResponse({'error': 'Patient ID not found'})
        roomdata=None

        # Fetch Room Details
        if Registerid_ins_ip:
            roomdata = Patient_Admission_Room_Detials.objects.filter(
                IP_Registration_Id__PatientId=patient_id, Status=True, IsStayed=True
            ).exclude(Iscanceled=True, CurrentlyStayed=True).first()

        # Construct Address
        if patient_id.PermanentAddressSameAsAbove == 'Yes':
            address_parts = filter(None, [
                patient_id.DoorNo,
                patient_id.Street,
                patient_id.Area,
                patient_id.City,
                patient_id.State,
                patient_id.Country,
                patient_id.Pincode
            ])
            full_address = ", ".join(address_parts)
        else:
            full_address = "No address available"

        # Get Ward Name & Bed Number
        ward_name = None
        if Registerid_ins_ip:
            ward_name = f"{roomdata.RoomId.Ward_Name.Floor_Name.Floor_Name}-{roomdata.RoomId.Ward_Name.Ward_Name.Ward_Name} / {roomdata.RoomId.Bed_No}" if roomdata and roomdata.RoomId else None

        # Construct Response Data
        if Registerid_ins_ip:
            
            Patient_data = {
                'PatientName': f'{patient_id.Title.Title_Name}.{patient_id.FirstName or ""} {patient_id.MiddleName or ""} {patient_id.SurName or ""}' if patient_id.FirstName else None,
                'PatientId': patient_id.PatientId,
                'RegistrationId': patient.Registration_Id if patient else None,
                'PhoneNo': int(patient_id.PhoneNo) if patient_id.PhoneNo and patient_id.PhoneNo.isdigit() else None,
                'Title': getattr(patient_id.Title, 'Title_Name', None),
                'FirstName': patient_id.FirstName,
                'MiddleName': patient_id.MiddleName,
                'SurName': patient_id.SurName,
                'AgeGender': f'{patient_id.Age}/{patient_id.Gender}' if patient_id.Age else None,
                'Gender': patient_id.Gender,
                'Age': patient_id.Age,
                'ABHA': patient_id.ABHA,
                'Email': patient_id.Email,
                'BloodGroup': getattr(patient_id.BloodGroup, 'BloodGroup_Id', None),
                'UHIDType': patient_id.UniqueIdType,
                'UHIDNo': patient_id.UniqueIdNo,
                'PatientType': patient_id.PatientType,
                'PatientCategory': getattr(patient, 'PatientCategory', None),
                'Address': full_address,
                'WardName': ward_name if ward_name else None,
                'Ipno': patient.Registration_Id if patient and patient.Registration_Id else None,
                'AdmissionDate': patient.created_at.strftime("%d/%m/%Y %I:%M %p") if patient and patient.created_at else None,
            }
        elif Registerid_ins_op:
            Patient_data = {
                'PatientName': f'{patient_id.Title.Title_Name}.{patient_id.FirstName or ""} {patient_id.MiddleName or ""} {patient_id.SurName or ""}' if patient_id.FirstName else None,
                'PatientId': patient_id.PatientId,
                'RegistrationId': patient.Registration_Id if patient else None,
                'PhoneNo': int(patient_id.PhoneNo) if patient_id.PhoneNo and patient_id.PhoneNo.isdigit() else None,
                'Title': getattr(patient_id.Title, 'Title_Name', None),
                'FirstName': patient_id.FirstName,
                'MiddleName': patient_id.MiddleName,
                'SurName': patient_id.SurName,
                'AgeGender': f'{patient_id.Age}/{patient_id.Gender}' if patient_id.Age else None,
                'Gender': patient_id.Gender,
                'Age': patient_id.Age,
                'ABHA': patient_id.ABHA,
                'BloodGroup': getattr(patient_id.BloodGroup, 'BloodGroup_Id', None),
                'UHIDType': patient_id.UniqueIdType,
                'UHIDNo': patient_id.UniqueIdNo,
                'PatientType': patient_id.PatientType,
                'PatientCategory': getattr(patient, 'PatientCategory', None),
                'Address': full_address,
                'Ipno': patient.pk if patient and patient.pk else None,
            }

        return JsonResponse(Patient_data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})


 

@csrf_exempt
@require_http_methods(["GET"])
def Walk_in_patient_labtestname_details(request):
 
    if request.method == 'GET':
 
        try:
 
            Test_data = Test_Descriptions.objects.filter(Status="Active")
            Test_data_list = []
            for tdata in Test_data:
 
                datalist = {
                    'Name' : tdata.Test_Name,
                    "Type" : "Individual",
                    "rowColor" : "black",
                    'Code' : tdata.Test_Code
                }
                Test_data_list.append(datalist)
 
            Group_data = Group_Master.objects.filter(Status="Active")
            Group_data_list = []
            for gdata in Group_data:
 
                datalist = {
                    'Name' : gdata.Group_Name,
                    "Type" : "Group",
                    "rowColor" : "green",
                    'Code' : gdata.Group_Code
                }
                Group_data_list.append(datalist)
                
            package_data = OfferPackageMaster.objects.filter(Status="Active")
            Package_data_list = []
            for pdata in package_data:
 
                datalist = {
                    'Name' : pdata.package_name,
                    "Type" : "Offers",
                    "rowColor" : "blue",
                    'Code' : pdata.package_code
                }
                Package_data_list.append(datalist)
            
 
            merged_data = Test_data_list + Group_data_list + Package_data_list
  
 
            for index, i in enumerate(merged_data, start=1):
                i["id"] = index
 
 
            return JsonResponse(merged_data,safe=False)
 
 
           
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_LAB_Registration(request):  
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
 
                        OP_Patient = Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
 
                        OP_Patient.PatientId = patient
                        OP_Patient.VisitPurpose = register_type
                        OP_Patient.IsMLC = IsMLC
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
 
 
                        print('premkkkkkkkkkk')
 
                        referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
 
                        print('premkkkkkkkkkk',referral)
 
                        if referral:
                            referral.OP_Register_Id=OP_Patient
                            referral.ReferralRegisteredBy=register_type
                            referral.ReferralSource=ReferralSource
                            referral.ReferredBy=referral_doctor_instance
                            referral.save()
 
                        rad_doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Labdocid)
                        rad_doc_ins.PrimaryDoctor = doctor_name_instance
                        rad_doc_ins.Specialization = specialization_instance
                        rad_doc_ins.VisitType = "WALK-IN"
                        rad_doc_ins.Complaint = 'Labtest'
                        rad_doc_ins.TokenNo = None
                        rad_doc_ins.save()
 
                        print(rad_doc_ins,'rad_doc_ins')
 
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

                        lab_request = Lab_Request_Details.objects.filter(Request_Id=LabrequestID).first()
                        for test in SelectedTest:

                            print(test,'yeestdewse')

                            if test.get('itemid'):
 
                                continue

                            else:

                                testType = test.get("testType")
                                Code = test.get("Code")

                                NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
                                    item_id_int=Cast("Item_Id", IntegerField())
                                ).aggregate(Max("item_id_int"))["item_id_int__max"]
                                NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

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
        
                                if testType == "Individual":
                                    lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
                                elif testType == "Profiles" or testType == "Group":
                                    lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
                                elif testType == "Profiles" or testType == "Offers":
                                    lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code

                                # Save the item
                                Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                        for test in DeletedTest:

                            if test.get('itemid'):

                                lab_request_item = Lab_Request_Items_Details.objects.filter(Item_Id=test.get('itemid')).delete()

                            else :
                                continue

                  







                        
 
 
                        return JsonResponse({'success': 'Patient Lab registered Updated successfully','RegistrationId':OP_Patient.Registration_Id})
                                   
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    patient_visit_id = generate_or_update_visit_id(patient, register_type)
 
                    Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
           
 
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
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_ip_registration_before_handover_details_Duplicate(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '')
        status = request.GET.get('status', '')  
        print("status------------", status)
        print("RegistrationId------------", RegistrationId)

        # Map status to Booking_Status
        Booking_Status = 'Booked' if status == 'Pending' else 'Cancelled'

        # Fetch the first matching record
        register = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()

        if not register:
            return JsonResponse({'error': 'No record found'})

        # Fetch related records
        Admission_instance = Patient_Admission_Detials.objects.filter(IP_Registration_Id=RegistrationId).first()
        Referral_Doctor_instance = Patient_Referral_Detials.objects.filter(IP_Register_Id=RegistrationId).first()

        # Extracting details
        Flagging_name = getattr(register.Flagging, 'Flagg_Name', None)
        Flagging_color = getattr(register.Flagging, 'Flagg_Color', None)
        BloodGroup_name = getattr(register.PatientId.BloodGroup, 'BloodGroup_Name', None)
        if register.PatientId:
            # Fetch address details, prioritizing DoorNo, but using PermanentdoorNo if DoorNo is missing
            address_parts = [
                getattr(register.PatientId, 'DoorNo', '') or getattr(register.PatientId, 'PermanentdoorNo', ''),
                getattr(register.PatientId, 'Street', '') or getattr(register.PatientId, 'PermanentStreet', ''),
                getattr(register.PatientId, 'Area', '') or getattr(register.PatientId, 'PermanentArea', ''),
                getattr(register.PatientId, 'City', '') or getattr(register.PatientId, 'PermanentCity', ''),
                getattr(register.PatientId, 'District', '') or getattr(register.PatientId, 'PermanentDistrict', ''),
                getattr(register.PatientId, 'State', '') or getattr(register.PatientId, 'PermanentState', ''),
                getattr(register.PatientId, 'Country', '') or getattr(register.PatientId, 'PermanentCountry', ''),
                f"- {getattr(register.PatientId, 'Pincode', '') or getattr(register.PatientId, 'PermanentPincode', '')}"
                if (getattr(register.PatientId, 'Pincode', '') or getattr(register.PatientId, 'PermanentPincode', '')) else ''
            ]

            # Debugging: Print address parts
            print("Address Parts Before Joining:", address_parts)

            # Remove empty values and join with space
            full_address = " ".join(filter(None, address_parts))

            # Debugging: Print final address
            print("Final Address:", full_address)

        else:
            full_address = "No Address Available"
              
        DoctorName = (
            f"{getattr(register.PrimaryDoctor.Tittle, 'Title_Name', '')}."
            if getattr(register.PrimaryDoctor.Tittle, 'Title_Name', '') else ""
            
         ) + f"{getattr(register.PrimaryDoctor, 'First_Name', '')} "\
            f"{getattr(register.PrimaryDoctor, 'Last_Name', '')}"\
            if register and register.PrimaryDoctor else None
       

        Specialization = getattr(register.Specialization, 'Speciality_Name', '')

        # Create dictionary for the single record
        appointment_dict = {
            'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
            'RegistrationId': register.Registration_Id,
            'PatientId': register.PatientId.PatientId,
            # 'PatientName': f"{register.PatientId.Title.Title_Name} {register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
            'PatientName': (
                f"{getattr(register.PatientId.Title,'Title_Name','')}."
                if getattr(register.PatientId.Title, 'Title_Name','') else ""
            ) + f"{getattr(register.PatientId,'FirstName','')} " \
                f"{getattr(register.PatientId,'MiddleName','')} " \
                f"{getattr(register.PatientId,'SurName','')} " \
                if register and register.PatientId else None,
        
           
            'PhoneNo': register.PatientId.PhoneNo,
            'Age': register.PatientId.Age,
          
            'Address': full_address,
            'DoorNo': register.PatientId.PermanentdoorNo if register.PatientId else '',
            'Gender': register.PatientId.Gender,
            'Nationality': register.PatientId.Nationality,
            'PatientType': register.PatientId.PatientType,
            'MaritalStatus': register.PatientId.MaritalStatus,
            'Occupation': register.PatientId.Occupation,
            'BloodGroup': BloodGroup_name,
            'Complaint': register.Complaint,
            'isMLC': register.IsMLC,
            'Flagging': Flagging_name,
            'FlaggingColour': Flagging_color,
            'isRefferal': register.IsReferral,
            'Status': register.Status,
            'Specialization': Specialization,
            'PrimaryDoctor': DoctorName,
            'ReferredBy': (
                f"{getattr(Referral_Doctor_instance.ReferredBy.Tittle, 'Title_Name', '')}."
                if getattr(Referral_Doctor_instance.ReferredBy.Tittle, 'Title_Name', '') else ""
             ) + f"{getattr(Referral_Doctor_instance.ReferredBy, 'First_Name', '')} "\
                f"{getattr(Referral_Doctor_instance.ReferredBy, 'Middle_Name', '')} "\
                f"{getattr(Referral_Doctor_instance.ReferredBy, 'Last_Name', '')}"\
                if Referral_Doctor_instance and Referral_Doctor_instance.ReferredBy else None ,
            'AdmissionDate': register.created_at.strftime('%d-%m-%Y') if register.created_at else None,
            'AdmissionTime': register.created_at.strftime('%I:%M %p') if register.created_at else None,
            'PatientCategory': register.PatientCategory,
            'AdmissionPurpose': Admission_instance.AdmissionPurpose if Admission_instance else None,
            'NextToKinName': Admission_instance.NextToKinName if Admission_instance else None,
            'Relation': Admission_instance.Relation if Admission_instance else None,
            'RelativePhoneNo': Admission_instance.RelativePhoneNo if Admission_instance else None,
            'DrInchargeAtTimeOfAdmission': (
                                f"{getattr(Admission_instance.DrInchargeAtTimeOfAdmission.Tittle, 'Title_Name', '')}."
                                if getattr(Admission_instance.DrInchargeAtTimeOfAdmission.Tittle, 'Title_Name', '') else ""
                            ) + f"{getattr(Admission_instance.DrInchargeAtTimeOfAdmission, 'First_Name', '')} " \
                                f"{getattr(Admission_instance.DrInchargeAtTimeOfAdmission, 'Middle_Name', '')} " \
                                f"{getattr(Admission_instance.DrInchargeAtTimeOfAdmission, 'Last_Name', '')}" \
                                if Admission_instance and Admission_instance.DrInchargeAtTimeOfAdmission else None,
            'Fathername' : register.PatientId.FatherName,
            'Spousename': register.PatientId.SpouseName,

            }


        # Add room details if Booking_Status is 'Booked'
        if register.Booking_Status == 'Booked':
            room_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_at').first()
            if room_details:
                appointment_dict.update({
                    'BuildingName': getattr(room_details.RoomId.Building_Name, 'Building_Name', None),
                    'BlockName': getattr(room_details.RoomId.Block_Name, 'Block_Name', None),
                    'FloorName': getattr(room_details.RoomId.Floor_Name, 'Floor_Name', None),
                    'WardName': getattr(room_details.RoomId.Ward_Name.Ward_Name, 'Ward_Name', None),
                    'RoomNo': getattr(room_details.RoomId, 'RoomNo', None),
                    'BedNo': getattr(room_details.RoomId, 'Bed_No', None),
                    'RoomId': getattr(room_details.RoomId, 'Room_Id', None),
                })

        return JsonResponse(appointment_dict, safe=False)

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
        
        
        queryset = Patient_IP_Registration_Detials.objects.all().order_by('-created_at')
        
        if RegistrationId:
            queryset = queryset.filter(Registration_Id=RegistrationId)

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

            admissionins = Patient_Admission_Detials.objects.filter(IP_Registration_Id__Registration_Id = register.Registration_Id).first()


 
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId,
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
                    Patient_Admission_Room_Detials.objects
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
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_RADIOLOGY_Registration(request):
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
 
                        OP_Patient = Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
 
                        OP_Patient.PatientId = patient
                        OP_Patient.VisitPurpose = register_type
                        OP_Patient.IsMLC = IsMLC
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
 
 
                        print('premkkkkkkkkkk')
 
                        referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
 
                        print('premkkkkkkkkkk',referral)
 
                        if referral:
                            referral.OP_Register_Id=OP_Patient
                            referral.ReferralRegisteredBy=register_type
                            referral.ReferralSource=ReferralSource
                            referral.ReferredBy=referral_doctor_instance
                            referral.save()
 
                        rad_doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Raddocid)
                        rad_doc_ins.PrimaryDoctor = doctor_name_instance
                        rad_doc_ins.Specialization = specialization_instance
                        rad_doc_ins.VisitType = "WALK-IN"
                        rad_doc_ins.Complaint = 'Radiologytest'
                        rad_doc_ins.TokenNo = None
                        rad_doc_ins.save()
 
                        print(rad_doc_ins,'rad_doc_ins')
 
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
 
                        for testname in Testname_arr:
                            Radiologyid = testname.get('Radiologyid', None)
                            TestCode = testname.get('TestCode', None)
 
                            if Radiology_Request_Details.objects.filter(OP_Register_Id=OP_Patient,TestCode=Radiologyid,SubTestCode=TestCode).exists():
 
                                continue
 
   
                            if Radiologyid and TestCode:  # Ensure required fields are present
                                Radiology_Request_Details.objects.create(
                                    RegisterType = 'WALK-IN',
                                    OP_Register_Id= OP_Patient ,
                                    IP_Register_Id=  None,
                                    Casuality_Register_Id= None,
                                    Diagnosis_Register_Id=  None,
                                    TestCode=Radiologyid,
                                    Doctorid = doctor_name_instance,
                                    SubTestCode=TestCode,
                                    created_by=created_by
                                )
 
 
 
 
                        return JsonResponse({'success': 'Patient Radiology registered Updated successfully','RegistrationId':OP_Patient.Registration_Id})
                                   
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    patient_visit_id = generate_or_update_visit_id(patient, register_type)
 
                    Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
           
                    #
 
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
 
                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                        Registration_Id = Patient_OP,
                        PrimaryDoctor = doctor_name_instance,
                        Specialization = specialization_instance,
                        VisitType = "WALK-IN",
                        Complaint = 'Radiologytest',
                        TokenNo = None,
                    )
                    Multile_Doctor.save()
 
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
 
                    if register_type == 'RADIOLOGY':
 
 
                        for testname in Testname_arr:
                            Radiologyid = testname.get('Radiologyid', None)
                            TestCode = testname.get('TestCode', None)
 
   
                            if Radiologyid and TestCode:  # Ensure required fields are present
                                Radiology_Request_Details.objects.create(
                                    RegisterType = 'WALK-IN',
                                    OP_Register_Id= rad_ins ,
                                    IP_Register_Id=  None,
                                    Casuality_Register_Id= None,
                                    Diagnosis_Register_Id=  None,
                                    Doctorid = doctor_name_instance,

                                    TestCode=Radiologyid,
                                    SubTestCode=TestCode,
                                    created_by=created_by
                                )
 
 
 
                    return JsonResponse({'success': 'Patient Appointment registered successfully','RegistrationId':Patient_OP.Registration_Id})
 
                except Exception as e:
       
                        return JsonResponse({'error':str(e)})






            
from django.http import JsonResponse
from django.db.models import Count
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from .models import Patient_Appointment_Registration_Detials
import logging
 
logger = logging.getLogger(__name__)
 
@csrf_exempt
@require_GET
def patient_registration_count(request):
    logger.info(f"Request GET parameters: {request.GET}")
   
    patient_id = request.GET.get('PatientId')
   
    logger.info(f"Extracted patient_id: {patient_id}")
   
    if not patient_id:
        logger.error("No PatientId provided")
        return JsonResponse({
            'error': 'PatientId is required',
            'details': 'Please provide a valid Patient ID'
        }, status=400)
 
    try:
        registration_count = Patient_Appointment_Registration_Detials.objects.filter(
            PatientId=patient_id
        ).count()
       
        registrations = Patient_Appointment_Registration_Detials.objects.filter(
            PatientId=patient_id
        ).order_by('-created_at').values(
            'Registration_Id',
            'VisitId',
            'AppointmentId',
            'created_at',
            'Status',
            'VisitPurpose',
            'pk'
        )
       
        response_data = {
            'PatientId': patient_id,
            'TotalRegistrations': registration_count,
            'RegistrationDetails': list(registrations),
            'FirstRegistrationDate': registrations[0]['created_at'] if registrations else None,
            'LastRegistrationDate': registrations.last()['created_at'] if registrations else None
        }
       
        logger.info(f"Successful response for PatientId {patient_id}")
        return JsonResponse(response_data, status=200)
 
    except Exception as e:
        logger.error(f"Error processing patient registration count: {str(e)}")
        return JsonResponse({
            'error': 'An error occurred',
            'details': str(e)
        }, status=500)                    
 

@csrf_exempt
@require_http_methods(["GET"])
def Filter_IPPatient_by_Multiple_Criteria(request):
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
        registration = Patient_IP_Registration_Detials.objects.filter(filter_conditions,Status='Admitted').values(
            'Registration_Id',
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
            reg_id = reg.get('Registration_Id')
 
            if reg_id not in seen:
                seen.add(reg_id)
                patient_data = {
                    'PatientId': reg.get('PatientId__PatientId', ''),
                    'RegistrationId': reg.get('Registration_Id', ''),
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
def Filter_IP_or_All_Patients(request):
    try:
        # Extract filters
        first_name = request.GET.get("FirstName", "").strip()
        phone_no   = request.GET.get("PhoneNo", "").strip()
        patient_id = request.GET.get("PatientId", "").strip()
        doctor_id  = request.GET.get("DoctorId", "").strip()

        # -----------------------------------
        # COMMON FILTER for both IP & ALL
        # -----------------------------------
        common_filter = Q()
        if first_name:
            common_filter &= Q(PatientId__FirstName__icontains=first_name)
        if phone_no:
            common_filter &= Q(PatientId__PhoneNo__icontains=phone_no)
        if patient_id:
            common_filter &= Q(PatientId__PatientId__icontains=patient_id)
        if doctor_id:
            common_filter &= Q(DoctorId__DoctorId__icontains=doctor_id)

        # -----------------------------------
        # 1️⃣ TRY FETCHING IP PATIENTS FIRST
        # -----------------------------------
        ip_patients = Patient_IP_Registration_Detials.objects.filter(
            common_filter,
            Status='Admitted'
        ).values(
            'Registration_Id',
            'PatientId__PatientId',
            'PatientId__PhoneNo',
            'PatientId__FirstName',
            'PatientId__UniqueIdNo',
            'PatientId__Age',
            'PatientId__Gender'
        )

        # If IP patients exist → return only IP patients
        if ip_patients.exists():
            result = []
            for p in ip_patients:
                result.append({
                    "PatientId": p.get("PatientId__PatientId", ""),
                    "RegistrationId": p.get("Registration_Id", "IPDUC360"),
                    "PhoneNo": int(p['PatientId__PhoneNo']) if p.get('PatientId__PhoneNo') and p['PatientId__PhoneNo'].isdigit() else None,
                    "FirstName": p.get("PatientId__FirstName", ""),
                    "UniqueIdNo": p.get("PatientId__UniqueIdNo", ""),
                    "PatientAge": f"{p.get('PatientId__Age','')}/{p.get('PatientId__Gender','')}",
                    "Type": "IP"
                })
            return JsonResponse(result, safe=False)

        # ---------------------------------------------------------
        # 2️⃣ NO IP FOUND → FETCH ALL FROM Patient_Detials
        # ---------------------------------------------------------
        all_filter = Q()
        if first_name:
            all_filter &= Q(FirstName__icontains=first_name)
        if phone_no:
            all_filter &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            all_filter &= Q(PatientId__icontains=patient_id)
        if doctor_id:
            all_filter &= Q(DoctorID__DoctorId__icontains=doctor_id)

        all_patients = Patient_Detials.objects.filter(all_filter).values(
            'PatientId',
            'FirstName',
            'PhoneNo',
            'UniqueIdNo',
            'Age',
            'Gender'
        )

        result = []
        for p in all_patients:
            result.append({
                "PatientId": p.get("PatientId", ""),
                "RegistrationId": 'IPDUC360',
                "PhoneNo": int(p['PhoneNo']) if p.get('PhoneNo') and p['PhoneNo'].isdigit() else None,
                "FirstName": p.get("FirstName", ""),
                "UniqueIdNo": p.get("UniqueIdNo", ""),
                "PatientAge": f"{p.get('Age','')}/{p.get('Gender','')}",
                "Type": "IP"
            })

        return JsonResponse(result, safe=False)

    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({"error": "Internal Server Error"}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def get_registered_IPPatient_details(request):
    if request.method == 'GET':
        try:
            RegistrationId = request.GET.get("RegistrationId", '').strip()
 
            if RegistrationId:
                reg = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).last()
                print('regggggg',reg)
 
                full_name = f"{reg.PatientId.Title.Title_Name if reg.Registration_Id and reg.PatientId and reg.PatientId.Title else ''}.{reg.PatientId.FirstName if reg.Registration_Id and reg.PatientId else ''} {reg.PatientId.MiddleName if reg.Registration_Id and reg.PatientId else ''} {reg.PatientId.SurName if reg.Registration_Id and reg.PatientId else ''}"
                formatted_date = reg.created_at.strftime("%d/%b/%Y") if reg.Registration_Id else ''
 
                print(full_name,'full_name')
                print(formatted_date,'formatted_date')
 
                categoryname = None
                categoryid = None
                if reg.PatientCategory == 'Insurance':
                    categoryname = reg.InsuranceName.Insurance_Name if reg.Registration_Id and reg.InsuranceName else None
                    categoryid = reg.InsuranceName.Insurance_Id if reg.Registration_Id and reg.InsuranceName else None
                elif reg.PatientCategory == 'Client':
                    categoryname = reg.ClientName.Client_Name if reg.Registration_Id and reg.ClientName else None
                    categoryid = reg.ClientName.Client_Id if reg.Registration_Id and reg.ClientName else None
 
                ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=reg.Registration_Id)
                ward_name = None
                bedno = None
 
                Discharge_details = IP_Physical_Discharge.objects.filter(Registration_Id=reg.Registration_Id).first()
               
 
                if ward_details.exists():
                 
                    ward_name = ward_details.last().RoomId.Ward_Name.Ward_Name.Ward_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                    floor_name = ward_details.last().RoomId.Ward_Name.Floor_Name.Floor_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                    bedno = ward_details.last().RoomId.Bed_No if ward_details.last().RoomId else None
 
                reg_data = {
                    'RegistrationId': reg.Registration_Id if reg.Registration_Id else '',
                    'PatientId': reg.PatientId.PatientId if reg.Registration_Id and reg.PatientId else '',
                    'DoctorId': reg.PrimaryDoctor.Doctor_ID if reg.PrimaryDoctor else None,
                    'PhoneNo': int(reg.PatientId.PhoneNo) if reg.Registration_Id and reg.PatientId.PhoneNo and reg.PatientId.PhoneNo.isdigit() else None,
                    'Patient_Name':full_name.strip(),
                    'AgeGender': f"""{reg.PatientId.Age if reg.Registration_Id and reg.PatientId else '' }/{reg.PatientId.Gender if reg.Registration_Id and reg.PatientId else ''}""",
                    'Address': f"""{reg.PatientId.PermanentdoorNo if reg.Registration_Id and reg.PatientId else '' }, {reg.PatientId.PermanentStreet if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.PermanentArea if reg.Registration_Id and reg.PatientId else ''}, {reg.PatientId.PermanentCity if reg.Registration_Id and reg.PatientId else ''}""",
                    # 'VisitId': reg.Registration_Id.VisitId if reg.Registration_Id else '',
                    # 'VisitPurpose':reg.VisitPurpose if reg.Registration_Id else '',
                    'PatientCategory':reg.PatientCategory if reg.Registration_Id else '',
                    'PatientCategoryName': categoryname,
                    'Doctor_ShortName': f"{reg.PrimaryDoctor.Tittle.Title_Name}.{reg.PrimaryDoctor.First_Name} {reg.PrimaryDoctor.Middle_Name} {reg.PrimaryDoctor.Last_Name}" if reg.PrimaryDoctor else None,
                    'Title' : reg.PatientId.Title.Title_Name if reg.Registration_Id and reg.PatientId.Title else '',
                    'FirstName' : reg.PatientId.FirstName if reg.Registration_Id and reg.PatientId else '',
                    'MiddleName' : reg.PatientId.MiddleName if reg.Registration_Id and reg.PatientId else '',
                    'SurName' : reg.PatientId.SurName if reg.Registration_Id and reg.PatientId else '',
                    'Gender' : reg.PatientId.Gender if reg.Registration_Id and reg.PatientId else '',
                    'DOB' : reg.PatientId.DOB if reg.Registration_Id and reg.PatientId else '',
                    'Age' : reg.PatientId.Age if reg.Registration_Id and reg.PatientId else '',
                    'Email' : reg.PatientId.Email if reg.Registration_Id and reg.PatientId else '',
                    'BloodGroup' : reg.PatientId.BloodGroup.BloodGroup_Name if reg.Registration_Id and reg.PatientId and reg.PatientId.BloodGroup else None,
                    'Occupation' : reg.PatientId.Occupation if reg.Registration_Id and reg.PatientId else '',
                    'Religion' : reg.PatientId.Religion.Religion_Id if reg.Registration_Id and reg.PatientId and reg.PatientId.Religion else None,
                    'Nationality' :reg.PatientId.Nationality if reg.Registration_Id and reg.PatientId else '',
                    'UniqueIdType' : reg.PatientId.UniqueIdType if reg.Registration_Id and reg.PatientId else '',
                    'UniqueIdNo' : reg.PatientId.UniqueIdNo if reg.Registration_Id and reg.PatientId else '',
                    'Complaint' : reg.Complaint,
                    'DoorNo' : reg.PatientId.DoorNo if reg.Registration_Id and reg.PatientId else '',
                    'Street' :reg.PatientId.Street if reg.Registration_Id and reg.PatientId else '',
                    'Area' :reg.PatientId.Area if reg.Registration_Id and reg.PatientId else '',
                    'City' :reg.PatientId.City if reg.Registration_Id and reg.PatientId else '',
                    'State' :reg.PatientId.State if reg.Registration_Id and reg.PatientId else '',
                    'Country' :reg.PatientId.Country if reg.Registration_Id and reg.PatientId else '',
                    'Pincode' :reg.PatientId.Pincode if reg.Registration_Id and reg.PatientId else '',  
                    'Date':formatted_date,
                    'ABHA' : reg.PatientId.ABHA if reg.Registration_Id and reg.PatientId else '',
 
                    'WardName': ward_name if ward_name else None,
                    'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,  
                    'AdmissionDate': reg.created_at.strftime('%d-%m-%Y %I:%M %p'),
                    'Dischargedate' : Discharge_details.created_at.strftime('%d-%m-%Y %I:%M %p') if Discharge_details else None
                }
            return JsonResponse(reg_data,safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
 
 

@csrf_exempt
@require_http_methods(["GET"])
def Get_Patient_Previous_Visited_Doctor(request):
    try:
        PatientId = request.GET.get('PatientId')

        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id__PatientId__PatientId=PatientId
        ).order_by('-created_at')

        print(queryset.count(),'querysetcountttttttttt')

        DoctorsList = []

        for idx, doc in enumerate(queryset, start=1):
            doctor = doc.PrimaryDoctor
            itemins = None
            validity_date = ''

            if doc.Registration_Id.Bill_Status == 'Paid':

                print(doc.Registration_Id.Bill_Status,'doc.Registration_Id.Bill_Status')
                print(doc.Registration_Id.Registration_Id,'doc.Registration_Id.Bill_Status')
                print(doc.Registration_Id.VisitId,'doc.Registration_Id.Bill_Status')

                validity_date = doc.RenewDate - timedelta(days=1) if doc.RenewDate else None

                print(validity_date,'validity_date')

                visitins = Patient_Visit_Detials.objects.filter(PatientId__PatientId = doc.Registration_Id.PatientId.PatientId,VisitId=doc.Registration_Id.VisitId).first()

                billins = General_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id = doc.Registration_Id.Registration_Id,Visit_Id=visitins)

                print(billins,'billins')

                for bill in billins:

                    print(doctor.Doctor_ID,'doctor.Doctor_ID')
                    print(bill.Billing_Invoice_No,'bill')

                    itemins = General_Billing_Items_Table_Detials.objects.filter(
                        Billing_Invoice_No=bill,
                        Service_Type='CONSULTATION',
                        Item_Status='Paid',
                        Service_Code = doctor.Doctor_ID
                    ).first()

                    if itemins:
                        DoctorsList.append({
                            'id': idx,
                            'RegistrationId':doc.Registration_Id.Registration_Id if doc.Registration_Id else '',
                            'DoctorId': doctor.Doctor_ID if doctor and doctor.Doctor_ID else '',
                            'DoctorName': f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Last_Name}" if doctor else '',
                            'Specialization': doc.Specialization.Speciality_Name if doc.Specialization else '',
                            'VisitType' : doc.VisitType,
                            'Date':doc.created_at.strftime('%d-%m-%y %I:%M %p') if doc.created_at else None,
                            'Time':doc.created_at.strftime('%I:%M %p') if doc.created_at else None,
                            'Fees' : itemins.Total_Amount if itemins else None,
                            'PatientCategory' : doc.Registration_Id.PatientCategory,
                            'RenewDate': doc.RenewDate.strftime('%d-%m-%y') if doc.RenewDate else None,
                            'validity_date' : validity_date.strftime('%d-%m-%y')if validity_date else None,
                    
                        })

                
        return JsonResponse(DoctorsList, safe=False)

    except Exception as e:
        print(f'Error: {str(e)}')
        return JsonResponse({'error': str(e)}, status=500)



from datetime import datetime
 
@csrf_exempt
@require_http_methods(['GET'])
def Existing_Patient_Details_Get(request):
    try:
        existing_id = request.GET.get('ExistingPtNo')
        dateofreg = request.GET.get('DateOfReg')
 
        if not existing_id:
            return JsonResponse({'error': 'ExistingPtNo is required'}, status=400)
 
        if dateofreg:
            # Convert 'YYYY-MM-DD' to 'DD-MM-YYYY'
            try:
                formatted_date = datetime.strptime(dateofreg, '%Y-%m-%d').strftime('%d-%m-%Y')
            except ValueError:
                return JsonResponse({'error': 'Invalid date format'}, status=400)
 
            # Now match with startswith the formatted date string
            existing_ins = Existing_Patient_Details.objects.filter(
                OPNo=existing_id,
                OPDate__startswith=formatted_date
            ).last()
 
            if not existing_ins:
                return JsonResponse({'respp': None}, safe=False)
        else:
            existing_ins = Existing_Patient_Details.objects.filter(OPNo=existing_id).last()
 
        if existing_ins:
            response_data = {
                "OPNo": existing_ins.OPNo,
                "Title": existing_ins.NamePrefix.strip(),
                "FirstName": existing_ins.PatientName,
                "FatherName": existing_ins.FatherName,
                "DOB": existing_ins.Date_of_Birth,
                "Age": existing_ins.Age,
                "Occupation": existing_ins.Occupation,
                "PhoneNo": existing_ins.PhoneNo,
                "PermanentArea": existing_ins.Address,
                "PermanentCity": existing_ins.Location,
                "Country": "India",
            }
            return JsonResponse({'respp': response_data}, safe=False)
 
        return JsonResponse({'respp': None}, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
# @csrf_exempt
# @require_http_methods(['GET'])
# def Existing_Patient_Details_Get_All(request):
#     try:
#         existing_id = request.GET.get('ExistingPtNo')
#         Year = request.GET.get('Year')
 
#         existing_ins = Existing_Patient_Details.objects.filter(OPNo=existing_id)
 
#         PatientList = []
 
#         for datas in existing_ins:

#                 lastvisitdate = Existing_Patient_RevisitPatient.objects.filter(OPNo=existing_id).last()
 
#                 print(datas.OPDate,'datas.OPDate')
#                 response_data = {
#                     "OPNo": datas.OPNo,
#                     "Title": datas.NamePrefix.strip(),
#                     "FirstName": datas.PatientName,
#                     "FatherName": datas.FatherName,
#                     "DOB": datas.Date_of_Birth,
#                     "Age": datas.Age,
#                     "Occupation": datas.Occupation,
#                     "PhoneNo": datas.PhoneNo,
#                     "PermanentArea": datas.Address,
#                     "PermanentCity": datas.Location,
#                     "Country": "India",
#                     "OPDate": datas.OPDate,
#                     "YearNo" : datas.YearNo,
#                     "lastvisitdate" : lastvisitdate.ReVisitDate if lastvisitdate else None,
 
#                 }
#                 PatientList.append(response_data)
 
 
#         return JsonResponse(PatientList, safe=False)
 
 
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(['GET'])
def Existing_Patient_Details_Get_All(request):
    try:
        existing_id = request.GET.get('ExistingPtNo')
        Year = request.GET.get('Year')
 
        existing_ins = Existing_Patient_Details.objects.filter(Q(OPNo=existing_id) | Q(PhoneNo=existing_id) )

        print(len(existing_ins),'existing_ins')
 
        PatientList = []
 
        for datas in existing_ins:
 
                lastvisitdate = Existing_Patient_RevisitPatient.objects.filter(Q(OPNo=datas.OPNo)).last()
 
                response_data = {
                    "OPNo": datas.OPNo,
                    "Title": datas.NamePrefix.strip(),
                    "FirstName": datas.PatientName,
                    "FatherName": datas.FatherName,
                    "DOB": datas.Date_of_Birth,
                    "Age": datas.Age,
                    "Occupation": datas.Occupation,
                    "PhoneNo": datas.PhoneNo,
                    "PermanentArea": datas.Address,
                    "PermanentCity": datas.Location,
                    "Country": "India",
                    "OPDate": datas.OPDate,
                    "YearNo" : datas.YearNo,
                    "lastvisitdate" : lastvisitdate.ReVisitDate if lastvisitdate else None,
 
                }
                PatientList.append(response_data)
 
 
        return JsonResponse(PatientList, safe=False)
 
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
 
 



from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_http_methods(['GET'])
def Get_Lastvisitdate(request):
    try:
        existing_id = request.GET.get('ExistingPtNo')
        year = request.GET.get('Year')

        # Validate inputs
        if not existing_id or not year:
            return JsonResponse({'error': 'Missing ExistingPtNo or Year'}, status=400)

        last_visit = Existing_Patient_RevisitPatient.objects.filter(
            OPNo=existing_id, YearNo=year
        ).order_by('-ReVisitDate').first()

        if last_visit and last_visit.ReVisitDate:
            # Extract date part (YYYY-MM-DD) from ReVisitDate
            visit_date = last_visit.ReVisitDate.split(" ")[0] if " " in last_visit.ReVisitDate else last_visit.ReVisitDate
            return JsonResponse({"lastvisitdate": visit_date,"OldDepartment":last_visit.DeptName}, safe=False)
        
        return JsonResponse({"lastvisitdate": "","OldDepartment":""}, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['GET'])
def Existing_Visit_Details(request):
    try:


        existing_id = request.GET.get('ExistingPtNo')
 
        existing_ins = Existing_Patient_RevisitPatient.objects.filter(OPNo=existing_id)
 
        PatientList = []
 
        for datas in existing_ins:
 
                response_data = {
                    "OPNo": datas.OPNo,
                    "YearNo": datas.YearNo,
                    "ReVisitDate": datas.ReVisitDate,
                    "ReVisitTime": datas.ReVisitTime,
                    "DeptName": datas.DeptName,
                   
                }
                PatientList.append(response_data)
 
 
        return JsonResponse(PatientList, safe=False)


    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


 



# --------------------------------venki----abha---------------


@api_view(['POST'])
@csrf_exempt
def milestone_3_fetch_records(request):
    import requests, uuid
    from datetime import datetime

    try:
        data = json.loads(request.body)
        consent_id = data.get('consent_id')
        hiu_id = data.get('hiu_id') or "SBXID_007255"  # your sandbox HIU ID

        # Step 1: Generate access token
        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + 'Z'

        token_response = requests.post(
            "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions",
            json={
                "clientId": "SBXID_007255",
                "clientSecret": "286ced98-3001-41ac-8c32-7d9f5ca9cc3d",
                "grantType": "client_credentials"
            },
            headers={
                "Content-Type": "application/json",
                "REQUEST-ID": request_id,
                "TIMESTAMP": timestamp,
                "X-CM-ID": "sbx"
            }
        )

        if token_response.status_code != 200:
            return JsonResponse({"error": "Access token failed", "details": token_response.text}, status=400)

        access_token = token_response.json().get("accessToken")

        # Step 2: Trigger HIU record fetch
        hiu_fetch_payload = {
            "requestId": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat() + 'Z',
            "hiRequest": {
                "consent": {
                    "id": consent_id
                },
                "dataPushUrl": "https://your-hims-url.com/hiu/on-fetch"  # dummy in sandbox
            }
        }

        fetch_response = requests.post(
            "https://dev.abdm.gov.in/health-information/v1/hiu/fetch",
            json=hiu_fetch_payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "REQUEST-ID": str(uuid.uuid4()),
                "TIMESTAMP": datetime.utcnow().isoformat() + 'Z',
                "X-CM-ID": "sbx"
            }
        )

        return JsonResponse({
            "status": "HIU fetch initiated",
            "payload_sent": hiu_fetch_payload,
            "fetch_response": fetch_response.json()
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['POST'])
@csrf_exempt
def request_consent(request):
    try:
        # Get ABHA ID from request body
        data = json.loads(request.body)
        abha_id = data.get('abha_id', 'testuser@sbx')

        # Generate required headers
        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + 'Z'

        # Step 1: Get access token
        token_url = "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions"
        client_id = "SBXID_007255"
        client_secret = "286ced98-3001-41ac-8c32-7d9f5ca9cc3d"  # Use os.getenv() in production

        token_headers = {
            "Content-Type": "application/json",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
            "X-CM-ID": "sbx"
        }

        token_payload = {
            "clientId": client_id,
            "clientSecret": client_secret,
            "grantType": "client_credentials"
        }

        token_resp = requests.post(token_url, json=token_payload, headers=token_headers)

        try:
            token_json = token_resp.json()
        except json.JSONDecodeError:
            return JsonResponse({
                "error": "Token response was not valid JSON",
                "response_text": token_resp.text,
                "status_code": token_resp.status_code
            }, status=400)

        access_token = token_json.get("accessToken")
        if not access_token:
            return JsonResponse({
                "error": "Access token not found in response",
                "token_response": token_json
            }, status=400)

        # Step 2: Send consent request
        consent_url = "https://dev.abdm.gov.in/gateway/v1/consents/hiu/init"
        consent_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "REQUEST-ID": str(uuid.uuid4()),
            "TIMESTAMP": datetime.utcnow().isoformat() + 'Z',
            "X-CM-ID": "sbx"
        }

        consent_payload = {
            "hiuId": client_id,
            "requestId": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat() + 'Z',
            "consent": {
                "patient": {"id": abha_id},
                "purpose": {"code": "CAREMGT", "text": "Care Management"},
                "hiTypes": ["OPConsultation"],
                "permission": {
                    "accessMode": "VIEW",
                    "dateRange": {
                        "from": "2024-01-01T00:00:00Z",
                        "to": "2025-01-01T00:00:00Z"
                    },
                    "frequency": {
                        "unit": "HOUR",
                        "value": 1,
                        "repeats": 1
                    }
                },
                "dataEraseAt": "2025-12-31T00:00:00Z",
                "requester": {
                    "name": "Vesoftometic Solution",
                    "identifier": {"type": "REGNO", "value": "VSFT1234"}
                }
            }
        }

        consent_resp = requests.post(consent_url, json=consent_payload, headers=consent_headers)

        try:
            consent_json = consent_resp.json()
        except json.JSONDecodeError:
            return JsonResponse({
                "error": "Consent response was not valid JSON",
                "response_text": consent_resp.text,
                "status_code": consent_resp.status_code
            }, status=400)

        return JsonResponse({
            "status": "Consent request sent",
            "consent_id": consent_json.get('consentRequestId'),
            "raw": consent_json
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@api_view(['POST'])
@csrf_exempt
def fetch_health_records(request):
    data = json.loads(request.body)
    consent_id = data.get('consent_id')

    if not consent_id:
        return JsonResponse({"error": "Missing consent_id"}, status=400)

    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'

    # Get access token
    token_resp = requests.post(
        "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions",
        json={
            "clientId": "SBXID_007255",
            "clientSecret": "286ced98-3001-41ac-8c32-7d9f5ca9cc3d",
            "grantType": "client_credentials"
        },
        headers={
            "Content-Type": "application/json",
            "REQUEST-ID": request_id,
            "TIMESTAMP": timestamp,
            "X-CM-ID": "sbx"
        }
    )

    token = token_resp.json().get('accessToken')
    if not token:
        return JsonResponse({"error": "Token fetch failed"}, status=400)

    # HIU fetch call
    fetch_payload = {
        "requestId": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + 'Z',
        "hiRequest": {
            "consent": {
                "id": consent_id
            },
         "dataPushUrl": "https://kmc.vesoft.co.in/hiu/on-fetch"
 # Dummy in sandbox
        }
    }

    fetch_resp = requests.post(
        "https://dev.abdm.gov.in/health-information/v1/hiu/fetch",
        json=fetch_payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "REQUEST-ID": str(uuid.uuid4()),
            "TIMESTAMP": datetime.utcnow().isoformat() + 'Z',
            "X-CM-ID": "sbx"
        }
    )

    return JsonResponse({
        "status": "HIU fetch triggered",
        "fetch_response": fetch_resp.json()
    }, status=200)





@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_SERVICES_Registration(request):
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
 
                    Serviceaddedlist = data.get('Serviceaddedlist',[])
 
 
                    patient = None
                    patient_visit_id = None
                   
                    patient = Patient_Detials.objects.get(pk=patient_id)
 
                    if RegistrationId :
 
                        print(RegistrationId,'RegistrationId')
 
                        OP_Patient = Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
 
                        OP_Patient.PatientId = patient
                        OP_Patient.VisitPurpose = register_type
                        OP_Patient.IsMLC = IsMLC
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
 
 
                        print('premkkkkkkkkkk')
 
                        referral = Patient_Referral_Detials.objects.filter(OP_Register_Id = RegistrationId).first()
 
                        print('premkkkkkkkkkk',referral)
 
                        if referral:
                            referral.OP_Register_Id=OP_Patient
                            referral.ReferralRegisteredBy=register_type
                            referral.ReferralSource=ReferralSource
                            referral.ReferredBy=referral_doctor_instance
                            referral.save()
 
                        rad_doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(pk=Raddocid)
                        rad_doc_ins.PrimaryDoctor = doctor_name_instance
                        rad_doc_ins.Specialization = specialization_instance
                        rad_doc_ins.VisitType = "WALK-IN"
                        rad_doc_ins.Complaint = 'Radiologytest'
                        rad_doc_ins.TokenNo = None
                        rad_doc_ins.save()
 
                        print(rad_doc_ins,'rad_doc_ins')
 
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
 
                        for testname in Testname_arr:
                            Radiologyid = testname.get('Radiologyid', None)
                            TestCode = testname.get('TestCode', None)
 
                            if Radiology_Request_Details.objects.filter(OP_Register_Id=OP_Patient,TestCode=Radiologyid,SubTestCode=TestCode).exists():
 
                                continue
 
   
                            if Radiologyid and TestCode:  # Ensure required fields are present
                                Radiology_Request_Details.objects.create(
                                    RegisterType = 'WALK-IN',
                                    OP_Register_Id= OP_Patient ,
                                    IP_Register_Id=  None,
                                    Casuality_Register_Id= None,
                                    Diagnosis_Register_Id=  None,
                                    TestCode=Radiologyid,
                                    Doctorid = doctor_name_instance,
                                    SubTestCode=TestCode,
                                    created_by=created_by
                                )
 
 
 
 
                        return JsonResponse({'success': 'Patient Radiology registered Updated successfully','RegistrationId':OP_Patient.Registration_Id})
                                   
                    if not patient:
                        return JsonResponse({'warn': f"The Patient Id is not valid"})
                   
                    patient_visit_id = generate_or_update_visit_id(patient, register_type)
 
                    Patient_OP = Patient_Appointment_Registration_Detials.objects.create(
           
                    #
 
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
 
                    Multile_Doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.create(
                        Registration_Id = Patient_OP,
                        PrimaryDoctor = doctor_name_instance,
                        Specialization = specialization_instance,
                        VisitType = "WALK-IN-SERVICES",
                        Complaint = 'Services',
                        TokenNo = None,
                    )
                    Multile_Doctor.save()

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
                    ReferralRegisteredBy = 'SERVICES',
                    ReferralSource = ReferralSource,
                    ReferredBy = referral_doctor_instance,
               
                    )
                    referral.save()
 
 
                    registration_id = Patient_OP.pk
 
                    print(registration_id,'registration_id')
                    print(register_type,'register_type')
                    rad_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
 
                    if register_type == 'SERVICES':
 
 
                        for testname in Serviceaddedlist:
 
                            ServiceCategory = testname.get('ServiceCategory')
                            ServiceSubCategory = testname.get('ServiceSubCategory')
                            Rate = testname.get('Rate')
                            Quantity = testname.get('Quantity')
 
                            WalkinPatientServiceDetailsins = WalkinPatientServiceDetails(
 
                                Registration_Id = rad_ins,
                                ServiceCategory = ServiceCategory,
                                ServiceSubCategory = ServiceSubCategory,
                                Rate = Rate,
                                Quantity = Quantity,
                                created_by = created_by
                            )
 
                            WalkinPatientServiceDetailsins.save()
 
 
                    return JsonResponse({'success': 'Patient  registered successfully','RegistrationId':Patient_OP.Registration_Id})
 
                except Exception as e:
       
                        return JsonResponse({'error':str(e)})
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def get_walkin_services_added_details(request):
    try:
        Registration_Id = request.GET.get('RegistrationId')
        Status = request.GET.get('Status')
 
        print(Registration_Id, 'Registration_Id')
 
        List = []
        Billing_data = []
 
        # Fetch service details
        serviceins = WalkinPatientServiceDetails.objects.filter(
            Registration_Id__Registration_Id=Registration_Id,
            BillStatus=Status
        )
 
        # Fetch patient details
        Patientins = Patient_Appointment_Registration_Detials.objects.filter(
            Registration_Id=Registration_Id
        ).first()
 
        if Patientins:
            full_name = f"{Patientins.PatientId.Title.Title_Name}.{Patientins.PatientId.FirstName} {Patientins.PatientId.MiddleName} {Patientins.PatientId.SurName}"
            formatted_date = Patientins.created_at.strftime("%d/%b/%Y")
 
            categoryname = ''
            categoryid = ''
            if Patientins.PatientCategory == 'Insurance':
                categoryname = Patientins.InsuranceName.Insurance_Name if Patientins.InsuranceName else None
                categoryid = Patientins.InsuranceName.Insurance_Id if Patientins.InsuranceName else None
            elif Patientins.PatientCategory == 'Client':
                categoryname = Patientins.ClientName.Client_Name if Patientins.ClientName else None
                categoryid = Patientins.ClientName.Client_Id if Patientins.ClientName else None
 
            # Fetch doctor details
            doc_instance = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__Registration_Id=Registration_Id
            )
            doclist = []
            docidlist = []
            for dinfo in doc_instance:
                if dinfo.PrimaryDoctor:
                    docinfo = Doctor_ProfessForm_Detials.objects.filter(
                        Doctor_ID=dinfo.PrimaryDoctor.Doctor_ID
                    ).first()
                    Doctor_Id = dinfo.PrimaryDoctor.Doctor_ID
                    dname = f"{dinfo.PrimaryDoctor.Tittle.Title_Name}.{dinfo.PrimaryDoctor.First_Name} {dinfo.PrimaryDoctor.Middle_Name} {dinfo.PrimaryDoctor.Last_Name}"
                    qualification = docinfo.Qualification if docinfo else ""
                    fullname = f"{dname} ({qualification})" if qualification else dname
                    doclist.append(fullname)
                    docidlist.append(Doctor_Id)
                else:
                    doclist.append('Self')
                    docidlist.append('Self')
 
            Billing_data.append({
                'Date': formatted_date,
                'Registration_Id': Patientins.Registration_Id,
                'PatientId': Patientins.PatientId.PatientId,
                'PhoneNo': Patientins.PatientId.PhoneNo,
                'Patient_Name': full_name.strip(),
                'AgeGender': f'{Patientins.PatientId.Age}/{Patientins.PatientId.Gender}',
                'Address': f'{Patientins.PatientId.DoorNo}, {Patientins.PatientId.Street}, {Patientins.PatientId.Area}, {Patientins.PatientId.City}, {Patientins.PatientId.State}, {Patientins.PatientId.Country}, {Patientins.PatientId.Pincode}',
                'VisitPurpose': Patientins.VisitPurpose,
                'Visit_Id': Patientins.VisitId,
                'PatientCategory': Patientins.PatientCategory,
                'PatientCategoryName': categoryname,
                'Doctor_ShortName': doclist,
                'Doctor_Id': docidlist,
                'Title': Patientins.PatientId.Title.Title_Name,
                'FirstName': Patientins.PatientId.FirstName,
                'MiddleName': Patientins.PatientId.MiddleName,
                'SurName': Patientins.PatientId.SurName,
                'Gender': Patientins.PatientId.Gender,
                'DOB': Patientins.PatientId.DOB,
                'Age': Patientins.PatientId.Age,
                'Email': Patientins.PatientId.Email,
                'BloodGroup': Patientins.PatientId.BloodGroup.BloodGroup_Name if Patientins.PatientId.BloodGroup else None,
                'Occupation': Patientins.PatientId.Occupation,
                'Religion': Patientins.PatientId.Religion.Religion_Id if Patientins.PatientId.Religion else None,
                'Nationality': Patientins.PatientId.Nationality,
                'UniqueIdType': Patientins.PatientId.UniqueIdType,
                'UniqueIdNo': Patientins.PatientId.UniqueIdNo,
                'DoorNo': Patientins.PatientId.DoorNo,
                'Street': Patientins.PatientId.Street,
                'Area': Patientins.PatientId.Area,
                'City': Patientins.PatientId.City,
                'State': Patientins.PatientId.State,
                'Country': Patientins.PatientId.Country,
                'Pincode': Patientins.PatientId.Pincode,
                'VisitType': [doc.VisitType for doc in doc_instance],
                'BillingType': 'Consultation',
                'ServiceProcedureForm': 'Consultation',
            })
 
        # Map service details
        for datas in serviceins:
            datalist = {
                'Serviceid': datas.pk,
                'ServiceType': datas.ServiceCategory,
                'SelectItemName': datas.ServiceSubCategory,
                'Charges': float(datas.Rate) / float(datas.Quantity),
                'Amount': datas.Rate,
                'Total': datas.Rate,
                'NetAmount' : datas.Rate,
                'Quantity': datas.Quantity,
                "DiscountType": "",
                "Discount": "",
                "GST_per": "",
                "GST": "",
                "DiscountAmount": "",
                "isReimbursable": "No",
            }
            List.append(datalist)
 
        # Return both Billing_data and Service_lists
        return JsonResponse({
            'Billing_data': Billing_data,
            'Service_lists': List
        }, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def get_walkin_MCH_added_details(request):
    try:
        Registration_Id = request.GET.get('RegistrationId')
        Status = request.GET.get('Status')
 
        print(Registration_Id, 'Registration_Id')
 
        List = []
        Billing_data = []
 
        # Fetch MCH request details
        mch_requests = Master_health_care_request_details.objects.filter(
            OP_Register_Id__Registration_Id=Registration_Id,
            Status=Status
        ).select_related('Packages', 'OP_Register_Id').prefetch_related('Packages__Services_details')
 
        print(mch_requests,'mch_requests')
 
        # Fetch patient details
        Patientins = Patient_Appointment_Registration_Detials.objects.filter(
            Registration_Id=Registration_Id
        ).first()
 
        if Patientins:
            full_name = f"{Patientins.PatientId.Title.Title_Name}.{Patientins.PatientId.FirstName} {Patientins.PatientId.MiddleName} {Patientins.PatientId.SurName}"
            formatted_date = Patientins.created_at.strftime("%d/%b/%Y")
 
            categoryname = ''
            categoryid = ''
            if Patientins.PatientCategory == 'Insurance':
                categoryname = Patientins.InsuranceName.Insurance_Name if Patientins.InsuranceName else None
                categoryid = Patientins.InsuranceName.Insurance_Id if Patientins.InsuranceName else None
            elif Patientins.PatientCategory == 'Client':
                categoryname = Patientins.ClientName.Client_Name if Patientins.ClientName else None
                categoryid = Patientins.ClientName.Client_Id if Patientins.ClientName else None
 
            # Fetch doctor details
            doc_instance = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__Registration_Id=Registration_Id
            )
            doclist = []
            docidlist = []
            for dinfo in doc_instance:
                if dinfo.PrimaryDoctor:
                    docinfo = Doctor_ProfessForm_Detials.objects.filter(
                        Doctor_ID=dinfo.PrimaryDoctor.Doctor_ID
                    ).first()
                    Doctor_Id = dinfo.PrimaryDoctor.Doctor_ID
                    dname = f"{dinfo.PrimaryDoctor.Tittle.Title_Name}.{dinfo.PrimaryDoctor.First_Name} {dinfo.PrimaryDoctor.Middle_Name} {dinfo.PrimaryDoctor.Last_Name}"
                    qualification = docinfo.Qualification if docinfo else ""
                    fullname = f"{dname} ({qualification})" if qualification else dname
                    doclist.append(fullname)
                    docidlist.append(Doctor_Id)
                else:
                    doclist.append('Self')
                    docidlist.append('Self')
 
            Billing_data.append({
                'Date': formatted_date,
                'Registration_Id': Patientins.Registration_Id,
                'PatientId': Patientins.PatientId.PatientId,
                'PhoneNo': Patientins.PatientId.PhoneNo,
                'Patient_Name': full_name.strip(),
                'AgeGender': f'{Patientins.PatientId.Age}/{Patientins.PatientId.Gender}',
                'Address': f'{Patientins.PatientId.DoorNo}, {Patientins.PatientId.Street}, {Patientins.PatientId.Area}, {Patientins.PatientId.City}, {Patientins.PatientId.State}, {Patientins.PatientId.Country}, {Patientins.PatientId.Pincode}',
                'VisitPurpose': Patientins.VisitPurpose,
                'Visit_Id': Patientins.VisitId,
                'PatientCategory': Patientins.PatientCategory,
                'PatientCategoryName': categoryname,
                'Doctor_ShortName': doclist,
                'Doctor_Id': docidlist,
                'Title': Patientins.PatientId.Title.Title_Name,
                'FirstName': Patientins.PatientId.FirstName,
                'MiddleName': Patientins.PatientId.MiddleName,
                'SurName': Patientins.PatientId.SurName,
                'Gender': Patientins.PatientId.Gender,
                'DOB': Patientins.PatientId.DOB,
                'Age': Patientins.PatientId.Age,
                'Email': Patientins.PatientId.Email,
                'BloodGroup': Patientins.PatientId.BloodGroup.BloodGroup_Name if Patientins.PatientId.BloodGroup else None,
                'Occupation': Patientins.PatientId.Occupation,
                'Religion': Patientins.PatientId.Religion.Religion_Id if Patientins.PatientId.Religion else None,
                'Nationality': Patientins.PatientId.Nationality,
                'UniqueIdType': Patientins.PatientId.UniqueIdType,
                'UniqueIdNo': Patientins.PatientId.UniqueIdNo,
                'DoorNo': Patientins.PatientId.DoorNo,
                'Street': Patientins.PatientId.Street,
                'Area': Patientins.PatientId.Area,
                'City': Patientins.PatientId.City,
                'State': Patientins.PatientId.State,
                'Country': Patientins.PatientId.Country,
                'Pincode': Patientins.PatientId.Pincode,
                'VisitType': [doc.VisitType for doc in doc_instance],
                'BillingType': 'Master Health Check',
                'ServiceProcedureForm': 'Package',
            })
 
        for mch_request in mch_requests:
 
            datalist = {
                'Serviceid': mch_request.pk,
                'ServiceType': 'PACKAGE',
                'SelectItemName': mch_request.Packages.Package_Name,
                'Charges': float(mch_request.Packages.Price) / float(1),
                'Amount': mch_request.Packages.Price,
                'Total': mch_request.Packages.Price,
                'NetAmount' : mch_request.Packages.Price,
                'Quantity': 1,
                "DiscountType": "",
                "Discount": "",
                "GST_per": "",
                "GST": "",
                "DiscountAmount": "",
                "isReimbursable": "No",
            }
            List.append(datalist)
 
            # package = mch_request.Packages
            # if package:
            #     # Access ManyToManyField Services_details
            #     services = package.Services_details.all()
            #     for service in services:
            #         # Calculate charges (assuming Price is per unit, adjust as needed)
            #         rate = float(package.Price) if package.Price else 0
            #         quantity = int(service.Quantity) if service.Quantity else 1
            #         charges = rate / quantity if quantity > 0 else rate
 
            #         datalist = {
            #             'Serviceid': service.pk,
            #             'ServiceType': service.service_category.name if service.service_category else '',
            #             'SelectItemName': service.SubCategoryname,
            #             'Charges': charges,
            #             'Amount': rate,
            #             'Total': rate,
            #             'NetAmount': rate,
            #             'Quantity': quantity,
            #             'DiscountType': package.Discount if package.Discount else "",
            #             'Discount': package.Discount if package.Discount else "",
            #             'GST_per': "",
            #             'GST': "",
            #             'DiscountAmount': "",
            #             'isReimbursable': "No",
            #             'PackageName': package.Package_Name,
            #             'PackageId': package.pk,
            #         }
            #         List.append(datalist)
 
 
        # Return both Billing_data and Service_lists
        return JsonResponse({
            'Billing_data': Billing_data,
            'Service_lists': List
        }, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def get_same_doctor_appointment_for_today(request):
 
    try:
 
        PatientId     = request.GET.get('PatientId',  '').strip()
        Speciality    = request.GET.get('Speciality', '').strip()  
 
        current_date = date.today()
 
        todayappoint = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id__PatientId=PatientId,
            Specialization__Speciality_Id=Speciality,
            created_at__date=current_date
        ).first()
 
        print(todayappoint,'todayappoint')
 
        datalist = [{
            'Doctor' : todayappoint.PrimaryDoctor.Doctor_ID if todayappoint.PrimaryDoctor else None,
            'DoctorName' : f"""{todayappoint.PrimaryDoctor.Tittle.Title_Name}.{todayappoint.PrimaryDoctor.First_Name}""",
            'Specialization' : todayappoint.Specialization.Speciality_Name if todayappoint.Specialization else None
        }]
 
        return JsonResponse(datalist,safe=False)
  
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def get_same_ip_appointment_for_patient(request):
 
    try:
 
        PatientId  = request.GET.get('PatientId',  '').strip()
 
        prevadmission = Patient_IP_Registration_Detials.objects.filter(
            PatientId__PatientId__iexact = PatientId,
            Status__in = ['Pending','Admitted']
 
        ).last()
 
        if  prevadmission:
 
            datalist = [{
            'Doctor' : prevadmission.PrimaryDoctor.Doctor_ID if prevadmission.PrimaryDoctor else None,
            'DoctorName' : f"""{prevadmission.PrimaryDoctor.Tittle.Title_Name}.{prevadmission.PrimaryDoctor.First_Name}""",
            'Specialization' : prevadmission.Specialization.Speciality_Name if prevadmission.Specialization else None
            }]
 
            return JsonResponse(datalist,safe=False)
 
        return JsonResponse([],safe=False)
 
           
       
 
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Patients_Management_Filter_for_paidbillview(request):
    try:
        # Extract parameters from the request
        patientsearch = request.GET.get('patientsearch', '')
        
        if patientsearch:
            patientsearch = patientsearch.strip()
            print('inside patientsearch', patientsearch)
 
            # Filter by PatientId, PhoneNo, or FirstName for patientsearch
            patients = Patient_Detials.objects.filter(
                Q(PatientId__icontains=patientsearch) |
                Q(PhoneNo__icontains=patientsearch) |
                Q(FirstName__icontains=patientsearch)
            )
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientId,
                    'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                    'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                    
                } for idx, patient in enumerate(patients, start=1)
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Build dynamic filter conditions for other parameters
 
        queryset = Patient_Detials.objects.filter(DuplicateId=False)[:2000]
 
        
 
        # Prepare response data for other filters
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                
            } for idx, patient in enumerate(queryset, start=1)
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    
@csrf_exempt
@require_http_methods(["GET"])
def Patients_Management_Filter_for_paidbillview_for_ipNo(request):
    try:
        # Extract parameters from the request
        patientipsearch = request.GET.get('patientipsearch', '')
       
        if patientipsearch:
            patientipsearch = patientipsearch.strip()
            print('inside patientsearch', patientipsearch)
 
            # Filter by PatientId, PhoneNo, or FirstName for patientsearch
            patients = Patient_IP_Registration_Detials.objects.filter(
                Q(Registration_Id__iexact=f"""{'IP'}{patientipsearch}""")  |
                Q(PatientId__FirstName = patientipsearch)
 
            )
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientId.PatientId,
                    'PatientName': f"{patient.PatientId.Title.Title_Name if patient.PatientId.Title else ''}.{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}" if patient else None,
                    'PhoneNo': int(patient.PatientId.PhoneNo.strip()) if patient.PatientId.PhoneNo and patient.PatientId.PhoneNo.strip().isdigit() else None,
                    'Registration_Id' :  patient.Registration_Id
                   
                } for idx, patient in enumerate(patients, start=1)
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Build dynamic filter conditions for other parameters
 
        queryset = Patient_IP_Registration_Detials.objects.all()[:1000]
 
        # Prepare response data for other filters
        patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientId.PatientId,
                    'PatientName': f"{patient.PatientId.Title.Title_Name if patient.PatientId.Title else ''}.{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}" if patient else None,
                    'PhoneNo': int(patient.PatientId.PhoneNo.strip()) if patient.PatientId.PhoneNo and patient.PatientId.PhoneNo.strip().isdigit() else None,
                    'Registration_Id' :  patient.Registration_Id
                   
                } for idx, patient in enumerate(queryset, start=1)
            ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


     
@csrf_exempt
@require_http_methods(["GET"])
def IP_Discharged_Patient_For_Diagnosis(request):
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
                Q(Ip_Registration_Id__Registration_Id__iexact=f"""{'IP'}{SearchbyFirstName}""") |
                Q(Ip_Registration_Id__PatientId__PatientId__icontains=SearchbyFirstName) |
                Q(Ip_Registration_Id__PatientId__FirstName__icontains=SearchbyFirstName)
            )
 
 
 
        Dischargeins = IP_PhysicalDischargeChecklist.objects.filter(search_query)
 
        response_data = []

        for sno, datas in enumerate(Dischargeins, start=1):
            datalist = {
                'Sno': sno,
                'IPNo': datas.Ip_Registration_Id.Registration_Id if datas.Ip_Registration_Id else None,
                'PatientId': datas.Ip_Registration_Id.PatientId.PatientId if datas.Ip_Registration_Id else None,
                'PatientName': f"{datas.Ip_Registration_Id.PatientId.Title.Title_Name}."
                            f"{datas.Ip_Registration_Id.PatientId.FirstName}"
                            f"{datas.Ip_Registration_Id.PatientId.MiddleName or ''}"
                            f"{datas.Ip_Registration_Id.PatientId.SurName}"
                            if datas.Ip_Registration_Id else None,
            }
            response_data.append(datalist)

     
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET","POST"])
def IP_Discharged_Patient_For_Diagnosis_Post(request):
 
    if request.method == 'POST':
 
        try:
 
            data = json.loads(request.body)
 
            print(data,'dataaaaaaaaa')
 
            DiagnosisData = data.get('DiagnosisData','')
            IPNo = data.get('IPNo','')
            PatientId = data.get('PatientId','')
            created_by = data.get('created_by','')
 
 
            IPins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=IPNo).first()

            print(IPins,'IPinssssssssss')
 
            Patins = Patient_Detials.objects.filter(PatientId = PatientId).first()
 
            for d in DiagnosisData:
 
                SearchDescription = d.get('SearchDescription','')
                SearchDiagnosis = d.get('SearchDiagnosis','')
                SearchICDCode = d.get('SearchICDCode','')
 
                IP_Patient_Diagnosis_Data.objects.create(
 
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
 
 
            Patins = IP_Patient_Diagnosis_Data.objects.filter(Register_Id__Registration_Id = IPNo,Status='Added')

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
def IP_Discharged_Patient_For_Diagnosis_Delete(request):
 
    if request.method == 'POST':
 
        try:
 
            data = json.loads(request.body)
 
            print(data,'dataaaaaaaaa')
 
            id = data.get('id','')
            created_by = data.get('created_by','')
 
 
            diagnosisins = IP_Patient_Diagnosis_Data.objects.filter(pk=id).first()
 
            diagnosisins.Status = 'Canceled'
            diagnosisins.canceled_by = created_by
            diagnosisins.save()
 
            return JsonResponse({'success': 'Diagnosis Canceled Successfully'})
 
 
 
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 