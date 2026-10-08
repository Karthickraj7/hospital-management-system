
import base64
from io import BytesIO
import json
# from tkinter import Image
from PIL import Image
from PyPDF2 import PdfReader, PdfWriter
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q
import filetype
from Frontoffice.GeneralBilling import PatientDetails
from Frontoffice.Registration import get_file_image
from Frontoffice.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from .models import MedicalErrorMaster, MedicalErrorReport
import json


@csrf_exempt
@require_http_methods(["GET"])
def get_Patient_Details_by_patientId(request):
    try:
        PatientId = request.GET.get("PatientId", '').strip()
        FirstName = request.GET.get("FirstName", '').strip()
        PhoneNumber = request.GET.get("PhoneNumber", '').strip()

        print(f"PatientId: {PatientId}")
        print(f"FirstName: {FirstName}")
        print(f"PhoneNumber: {PhoneNumber}")

        # If no filters are provided, return an error
        if not PatientId and not (FirstName and PhoneNumber):
            return JsonResponse({'warn': 'No valid search criteria provided'})

        patient = None

        # Search by PatientId if provided
        if PatientId:
            try:
                patient = Patient_Detials.objects.get(Q(PatientId=PatientId) & Q(DuplicateId=False))
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Patient with the provided ID does not exist'})

        # Search by FirstName and PhoneNumber if provided
        elif FirstName and PhoneNumber:
            try:
                patient = Patient_Detials.objects.get(
                    Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False)
                )
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Patient does not exist with the provided details'})

        # If patient found, format and return data
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
                'Email': patient.Email,
                'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
                'Occupation': patient.Occupation,
                'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                'Nationality': patient.Nationality,
                'UHIDType': patient.UniqueIdType,
                'UHIDNo': patient.UniqueIdNo,
                'PatientType': patient.PatientType,
                'DoorNo': patient.DoorNo,
                'Street': patient.Street,
                'Area': patient.Area,
                'City': patient.City,
                'District': patient.District,
                'State': patient.State,
                'Country': patient.Country,
                'Pincode': patient.Pincode,
                'Status': patient.Status,
                'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
            }
            return JsonResponse(Patient_data)

        return JsonResponse({'warn': 'Patient does not exist'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})



    
    
    
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MedicalErrors
import json

# Fetch all medical errors
def get_medical_errors(request):
    if request.method == 'GET':
        errors = MedicalErrorMaster.objects.all().values()
        print('errors', errors)
        return JsonResponse(list(errors), safe=False)

# Create a new medical error
@csrf_exempt
def create_medical_error(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            MedicalErrorMaster.objects.create(
                error_type=data['error_type'],
                severity=data['severity'],
                applicable_for=data['applicable_for']
            )
            return HttpResponse(status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

# Update a medical error
@csrf_exempt
def update_medical_error(request, id):
    if request.method == 'PUT   ':
        try:
            data = json.loads(request.body)
            error = MedicalErrorMaster.objects.get(id=id)
            error.error_type = data['error_type']
            error.severity = data['severity']
            error.applicable_for = data['applicable_for']
            error.save()
            return HttpResponse(status=200)
        except MedicalErrors.DoesNotExist:
            return JsonResponse({'error': 'Error not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

# Delete a medical error
@csrf_exempt
def delete_medical_error(request, id):
    if request.method == 'DELETE':
        try:
            error = MedicalErrorMaster.objects.get(id=id)
            error.delete()
            return HttpResponse(status=204)
        except MedicalErrors.DoesNotExist:
            return JsonResponse({'error': 'Error not found'}, status=404)
        
        
    
# @csrf_exempt
# def create_medical_error_report(request):
#     if request.method == 'POST':
#         try:

#             data = json.loads(request.body)
            

#             report = MedicalErrorReport.objects.create(
#                 Patient_id=data.get('PatientId'),
#                 first_name=data.get('FirstName'),
#                 middle_name=data.get('MiddleName'),
#                 last_name=data.get('SurName'),
#                 age=data.get('Age'),
#                 dob=data.get('DOB'),
#                 gender=data.get('Gender'),
#                 nationality=data.get('Nationality'),
#                 phone_no=data.get('PhoneNo'),
#                 medical_record_number=data.get('MRN'),
#                 location=data.get('Location'),
#                 description_of_error=data.get('Description'),
#                 corrective_action_taken=data.get('CorrectiveAction'),
#                 personnel_involved=data.get('PersonnelInvolved'),
#                 contributing_factors=data.get('ContributingFactors'),
#                 reporting_personnel=data.get('ReportingPersonnel'),
#                 supervising_personnel=data.get('SupervisingPersonnel'),
#                 outcome_for_patient=data.get('Outcome'),
#                 recommendations_for_prevention=data.get('Recommendations'),
#                 review_date=data.get('ReviewDate'),
#                 error_status=data.get('ErrorStatus'),
#                 date_time_of_error=data.get('DateTime'),

                
#             )


           
         
            
            
#             return JsonResponse({'message': 'Medical error report created successfully'}, status=201)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)




def get_patient_details_for_QA(request):
    patient_id = request.GET.get('patient_id')
    try:
        patient = Patient_Detials.objects.get(PatientId=patient_id)

        doctor_id = None
        doctor_name = None

        # First check IP registration
        ip_doctor = Patient_IP_Registration_Detials.objects.filter(
            PatientId=patient_id
        ).values('PrimaryDoctor__Doctor_ID', 'PrimaryDoctor__First_Name').first()

        if ip_doctor and ip_doctor['PrimaryDoctor__Doctor_ID']:
            doctor_id = ip_doctor['PrimaryDoctor__Doctor_ID']
            doctor_name = ip_doctor['PrimaryDoctor__First_Name']
        else:
            # If not in IP, check OP registration
            op_doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
               Registration_Id__PatientId=patient_id
            ).values('PrimaryDoctor__Doctor_ID', 'PrimaryDoctor__First_Name').first()

            if op_doctor and op_doctor['PrimaryDoctor__Doctor_ID']:
                doctor_id = op_doctor['PrimaryDoctor__Doctor_ID']
                doctor_name = op_doctor['PrimaryDoctor__First_Name']

        data = {
            'Patient_id' : patient.PatientId,
            'first_name': patient.FirstName,
            'middle_name': patient.MiddleName,
            'last_name': patient.SurName,
            'age': patient.Age,
            'dob': patient.DOB,
            'gender': patient.Gender,
            'nationality': patient.Nationality,
            'phone_no': patient.PhoneNo,
            'email': patient.Email,
            'doctor_id': doctor_id,
            'doctor_name': doctor_name,
        }

        return JsonResponse({'success': True, 'data': data})

    except Patient_Detials.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Patient not found'})


# @csrf_exempt
# def create_medical_error_report(request):
#     if request.method == "POST":
#         try:
#             # Get form values
#             data = request.POST
#             print('dataaaa',data)
#             # File handling for BinaryField
#             file = request.FILES.get('attachments')
#             file_content = file.read() if file else None

#             # Insert into main report table
#             report = MedicalErrorReport.objects.create(
#                 Patient_id=data.get('Patient_id'),
#                 first_name=data.get('first_name'),
#                 middle_name=data.get('middle_name'),
#                 last_name=data.get('last_name'),
#                 age=data.get('age'),
#                 dob=data.get('dob'),
#                 gender=data.get('gender'),
#                 nationality=data.get('nationality'),
#                 phone_no=data.get('phone_no'),
#                 email=data.get('email'),
#                 doctor_name=data.get('doctor_name'),
#                 doctor_id=data.get('doctor_id'),
#                 error_id=data.get('error_id'),
#                 date_time_of_error=data.get('date_time_of_error'),
#                 medical_record_number=data.get('medical_record_number'),
#                 location=data.get('location'),
#                 description_of_error=data.get('description_of_error'),
#                 corrective_action_taken=data.get('corrective_action_taken'),
#                 recommendations_for_prevention=data.get('recommendations_for_prevention'),
#                 personnel_involved=data.get('personnel_involved'),
#                 severity_of_error=data.get('severity_of_error'),
#                 contributing_factors=data.get('contributing_factors'),
#                 outcome_for_patient=data.get('outcome_for_patient'),
#                 reporting_personnel=data.get('reporting_personnel'),
#                 supervising_personnel=data.get('supervising_personnel'),
#                 review_date=data.get('review_date'),
#                 error_status=data.get('error_status'),
#                 attachments=file_content
#             )

#             # Insert into child table for each medical error
#             total_errors = data.get('error_list', [])
#             print('totslmkd',total_errors)
#             for i in total_errors:
#                 MedicalErrors.objects.create(
#                     error_id=report.error_id,
            
            
            
            
            
#                     medical_error_type=data.get(f'medical_error_type_{i}'),
#                     medical_error_description=data.get(f'medical_error_description_{i}')
#                 )  

#             return JsonResponse({"success": True, "message": "Medical error report saved successfully"})

#         except Exception as e:
#             return JsonResponse({"success": False, "message": str(e)})

import base64
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
import json
from .models import MedicalErrorReport, MedicalErrors
# from .models import MedicalErrorReport, MedicalErrors, Patient_Details

@csrf_exempt
def create_medical_error_report(request):\
    
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
                image.save(output, format='JPEG', quality=quality)
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
            file_data = file.split(',')[1] if ',' in file else file
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)

            if file_type in ['image/jpeg', 'image/png']:
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
    if request.method == "POST": 
        try:
            data = json.loads(request.body)
            print(data,'data')

            # Get Patient instance
            patient_id = data.get("Patient_id")
            print('patient id ',patient_id)
            try:
                patient_instance = Patient_Detials.objects.get(pk=patient_id)
            except Patient_Detials.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Invalid Patient ID"})

            # Decode base64 image
            attachment_data = data.get("attachments", "")
            
            # if attachment_data:
            attachment_binary = validate_and_process_file(attachment_data) if attachment_data  else None
            
            # Save MedicalErrorReport
            report = MedicalErrorReport.objects.create(
                Patient_id=patient_instance,
                first_name=data.get("first_name"),
                middle_name=data.get("middle_name") or "",
                last_name=data.get("last_name"),
                age=data.get("age"),
                dob=data.get("dob"),
                gender=data.get("gender"),
                nationality=data.get("nationality"),
                phone_no=data.get("phone_no"),
                email=data.get("email") or "",
                doctor_name=data.get("doctor_name") or "",
                doctor_id=data.get("doctor_id") or "",
                date_time_of_error=data.get("date_time_of_error"),
                medical_record_number=data.get("medical_record_number") or "",
                location=data.get("location") or "",
                description_of_error=data.get("description_of_error"),
                corrective_action_taken=data.get("corrective_action_taken"),
                recommendations_for_prevention=data.get("recommendations_for_prevention"),
                contributing_factors=data.get("contributing_factors"),
                personnel_involved=data.get("personnel_involved"),
                severity_of_error=data.get("severity_of_error"),
                outcome_for_patient=data.get("outcome_for_patient"),
                reporting_personnel=data.get("reporting_personnel"),
                supervising_personnel=data.get("supervising_personnel"),
                review_date=data.get("review_date"),
                error_status=data.get("error_status"),
                attachments=attachment_binary
            )

            # Save MedicalErrors
            error_list = data.get("error_list", [])
            
            print(error_list,'error list ..')
            for item in error_list:
                MedicalErrors.objects.create(
                    Patient_id=patient_instance,
                    medical_error_type=item.get("error_type"),
                    medical_error_description=item.get("error_description")
                )

            return JsonResponse({"status": "success", "message": "Error Report Saved", "error_id": report.error_id})

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

    return JsonResponse({"status": "error", "message": "Invalid request"})
