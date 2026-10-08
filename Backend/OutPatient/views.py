
from Frontoffice.models import *
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import  Q
from django.http import JsonResponse
import base64
# import magic
import filetype
from .models import *

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
@require_http_methods(["GET"])
def get_workbenchquelist_doctor(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '').strip()
        DoctorId = request.GET.get('DoctorId', '').strip()
        patient_type = request.GET.get('Type', '').strip()

        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId is required'}, status=400)

        # Initialize variables
        patient_instance, LabRequest = None, None

        # Fetch patient instance and LabRequest based on type
        if patient_type == 'OP':
            print('checkkkkk---1')
            patient_instance = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__Registration_Id=RegistrationId,PrimaryDoctor__Doctor_ID=DoctorId).first()
            print('checkkkkk---2')
            
            print(patient_instance,'patient_instance----3')
            
            if patient_instance:
                LabRequest = Lab_Request_Details.objects.filter(OP_Register_Id=patient_instance.id).first()
        elif patient_type == 'IP':
            patient_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
        elif patient_type == 'Casuality':
            patient_instance = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
        else:
            return JsonResponse({'error': 'Invalid type'}, status=400)

        if not patient_instance:
            return JsonResponse({'error': 'Patient not found'})

        # Get related PatientId object
        print(patient_instance,'patient_instance')
        Registration = getattr(patient_instance, 'Registration_Id', None)
        print(Registration,'Registration')
        # PatientId = getattr(Registration or patient_instance, 'PatientId', None)
        # print(PatientId,'PatientId')

        PatientId = None
        if patient_type == 'OP':
            PatientId = getattr(Registration, 'PatientId', None)
        elif patient_type == 'IP':
            PatientId = getattr(patient_instance, 'PatientId', None)
        elif patient_type == 'Casuality':
            PatientId = getattr(patient_instance, 'PatientId', None)  # assuming same structure
        print(PatientId, 'PatientId')

        # Build patient data safely
        BloodGroup = getattr(getattr(PatientId, 'BloodGroup', None), 'pk', None)
        BloodGroupname = getattr(getattr(PatientId, 'BloodGroup', None), 'BloodGroup_Name', None)
        PatientProfile = get_file_image(PatientId.Patient_profile) if PatientId and PatientId.Patient_profile else None

        IP_Admission_ins=None
        IP_Admission_ins = Patient_Admission_Detials.objects.filter(IP_Registration_Id__Registration_Id = RegistrationId).first()
        print(IP_Admission_ins,'IP_Admission_ins----------')
        


        AdmissionDr = getattr(IP_Admission_ins, 'DrInchargeAtTimeOfAdmission', None)
        print(AdmissionDr,'AdmissionDr----------')
        
        AdmissionDrTitle = getattr(getattr(AdmissionDr, 'Tittle', None), 'Title_Name', '')
        AdmissionDrFullName = f"{AdmissionDrTitle + '.' if AdmissionDrTitle else ''}{getattr(AdmissionDr, 'First_Name', '')} {getattr(AdmissionDr, 'Middle_Name', '')} {getattr(AdmissionDr, 'Last_Name', '')}".strip()


        Address = " ".join(filter(None, [
            getattr(PatientId, 'DoorNo', ''),
            getattr(PatientId, 'Street', ''),
            getattr(PatientId, 'Area', ''),
            getattr(PatientId, 'City', ''),
            getattr(PatientId, 'State', ''),
            getattr(PatientId, 'Country', ''),
            getattr(PatientId, 'Pincode', '')
        ])).strip()

        patient_category = getattr(Registration, 'PatientCategory', None) or getattr(patient_instance, 'PatientCategory', None)
        category_name, category_id = '', ''
        if patient_category == 'Insurance':
            category_name = getattr(getattr(patient_instance, 'InsuranceName', None), 'Insurance_Name', '')
            category_id = getattr(getattr(patient_instance, 'InsuranceName', None), 'Insurance_Id', '')
        elif patient_category == 'Client':
            category_name = getattr(getattr(patient_instance, 'ClientName', None), 'Client_Name', '')
            category_id = getattr(getattr(patient_instance, 'ClientName', None), 'Client_Id', '')

        TitleName = getattr(getattr(PatientId, 'Title', None), 'Title_Name', '')
        PatientName = f"{TitleName + '.' if TitleName else ''}{getattr(PatientId, 'FirstName', '')} {getattr(PatientId, 'MiddleName', '')} {getattr(PatientId, 'Last_Name', '')}".strip()

        created_at = getattr(PatientId, 'created_at', None)

        response_data = {
            'pk': getattr(patient_instance, 'pk', ''),
            'PatientProfile': PatientProfile,
            'RegistrationId': getattr(Registration, 'Registration_Id', ''),
            'PatientId': getattr(PatientId, 'PatientId', ''),
            'VisitId': getattr(Registration, 'VisitId', '') if patient_type == 'OP' else None,
            'PatientName': PatientName,
            'PhoneNo': getattr(PatientId, 'PhoneNo', ''),
            'Title': getattr(getattr(PatientId, 'Title', None), 'pk', ''),
            'FirstName': getattr(PatientId, 'FirstName', ''),
            'MiddleName': getattr(PatientId, 'MiddleName', ''),
            'SurName': getattr(PatientId, 'SurName', ''),
            'Gender': getattr(PatientId, 'Gender', ''),
            'DOB': getattr(PatientId, 'DOB', ''),
            'Age': getattr(PatientId, 'Age', ''),
            'PatientType': getattr(PatientId, 'PatientType', ''),
            'Address': Address,
            'BloodGroup': BloodGroup,
             'BloodGroupname': BloodGroupname,
            'AdmissionDrIncharge': AdmissionDrFullName,
            'VisitPurpose': getattr(Registration, 'VisitPurpose', '') if patient_type == 'OP' else None,
            'Specialization': getattr(getattr(patient_instance, 'Specialization', None), 'Speciality_Id', '') if hasattr(patient_instance, 'Specialization') else '',
            'DoctorName': (
                f"{getattr(getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'Tittle', None), 'Title_Name', '')}."
                f"{getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'First_Name', '')} "
                f"{getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'Last_Name', '')}"
            ).strip() if hasattr(patient_instance, 'PrimaryDoctor') else '',
            'DoctorId': getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'Doctor_ID', '') if hasattr(patient_instance, 'PrimaryDoctor') else '',
            'Complaint': getattr(patient_instance, 'Complaint', '') if hasattr(patient_instance, 'Complaint') else '',
            'PatientCategory': patient_category,
            'PatientCategoryName': category_name,
            'PatientCategoryId': category_id,
            'IsMLC': getattr(PatientId, 'IsMLC', ''),
            'CurrDate': created_at.strftime('%d-%m-%y') if created_at else '',
            'CurrTime': created_at.strftime('%I:%M %p') if created_at else '',
            'LabRequestId': getattr(LabRequest, 'Request_Id', None)
        }

        print("OPRegistration_dict:", response_data)
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Error in get_workbenchquelist_doctor: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def Get_Workbenchquelist_For_Doctor_Speciality(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', '').strip()
        DoctorId = request.GET.get('DoctorId', '').strip()
        patient_type = request.GET.get('Type', '').strip()

        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId is required'}, status=400)

        # Initialize variables
        patient_instance, LabRequest = None, None

        # Fetch patient instance and LabRequest based on type
        if patient_type == 'OP':
            print('checkkkkk---1')
            patient_instance = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id=RegistrationId,PrimaryDoctor__Doctor_ID=DoctorId).first()
            print('checkkkkk---2')
            
            print(patient_instance,'patient_instance----3')
            
            if patient_instance:
                LabRequest = Lab_Request_Details.objects.filter(OP_Register_Id=patient_instance.id).first()
        elif patient_type == 'IP':
            patient_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
        elif patient_type == 'Casuality':
            patient_instance = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
        else:
            return JsonResponse({'error': 'Invalid type'}, status=400)

        if not patient_instance:
            return JsonResponse({'error': 'Patient not found'})

        # Get related PatientId object
        print(patient_instance,'patient_instance')
        Registration = getattr(patient_instance, 'Registration_Id', None)
        print(Registration,'Registration')
        # PatientId = getattr(Registration or patient_instance, 'PatientId', None)
        # print(PatientId,'PatientId')

        PatientId = None
        if patient_type == 'OP':
            PatientId = getattr(Registration, 'PatientId', None)
        elif patient_type == 'IP':
            PatientId = getattr(patient_instance, 'PatientId', None)
        elif patient_type == 'Casuality':
            PatientId = getattr(patient_instance, 'PatientId', None)  # assuming same structure
        print(PatientId, 'PatientId')

        # Build patient data safely
        BloodGroup = getattr(getattr(PatientId, 'BloodGroup', None), 'pk', None)
        PatientProfile = get_file_image(PatientId.Patient_profile) if PatientId and PatientId.Patient_profile else None

        IP_Admission_ins=None
        IP_Admission_ins = Patient_Admission_Detials.objects.filter(IP_Registration_Id__Registration_Id = RegistrationId).first()
        print(IP_Admission_ins,'IP_Admission_ins----------')
        


        AdmissionDr = getattr(IP_Admission_ins, 'DrInchargeAtTimeOfAdmission', None)
        print(AdmissionDr,'AdmissionDr----------')
        
        AdmissionDrTitle = getattr(getattr(AdmissionDr, 'Tittle', None), 'Title_Name', '')
        AdmissionDrFullName = f"{AdmissionDrTitle + '.' if AdmissionDrTitle else ''}{getattr(AdmissionDr, 'First_Name', '')} {getattr(AdmissionDr, 'Middle_Name', '')} {getattr(AdmissionDr, 'Last_Name', '')}".strip()


        Address = " ".join(filter(None, [
            getattr(PatientId, 'DoorNo', ''),
            getattr(PatientId, 'Street', ''),
            getattr(PatientId, 'Area', ''),
            getattr(PatientId, 'City', ''),
            getattr(PatientId, 'State', ''),
            getattr(PatientId, 'Country', ''),
            getattr(PatientId, 'Pincode', '')
        ])).strip()

        patient_category = getattr(Registration, 'PatientCategory', None) or getattr(patient_instance, 'PatientCategory', None)
        category_name, category_id = '', ''
        if patient_category == 'Insurance':
            category_name = getattr(getattr(patient_instance, 'InsuranceName', None), 'Insurance_Name', '')
            category_id = getattr(getattr(patient_instance, 'InsuranceName', None), 'Insurance_Id', '')
        elif patient_category == 'Client':
            category_name = getattr(getattr(patient_instance, 'ClientName', None), 'Client_Name', '')
            category_id = getattr(getattr(patient_instance, 'ClientName', None), 'Client_Id', '')

        TitleName = getattr(getattr(PatientId, 'Title', None), 'Title_Name', '')
        PatientName = f"{TitleName + '.' if TitleName else ''}{getattr(PatientId, 'FirstName', '')} {getattr(PatientId, 'MiddleName', '')} {getattr(PatientId, 'Last_Name', '')}".strip()

        created_at = getattr(PatientId, 'created_at', None)

        response_data = {
            'pk': getattr(patient_instance, 'pk', ''),
            'PatientProfile': PatientProfile,
            'RegistrationId': getattr(Registration, 'Registration_Id', ''),
            'PatientId': getattr(PatientId, 'PatientId', ''),
            'VisitId': getattr(Registration, 'VisitId', '') if patient_type == 'OP' else None,
            'PatientName': PatientName,
            'PhoneNo': getattr(PatientId, 'PhoneNo', ''),
            'Title': getattr(getattr(PatientId, 'Title', None), 'pk', ''),
            'FirstName': getattr(PatientId, 'FirstName', ''),
            'MiddleName': getattr(PatientId, 'MiddleName', ''),
            'SurName': getattr(PatientId, 'SurName', ''),
            'Gender': getattr(PatientId, 'Gender', ''),
            'DOB': getattr(PatientId, 'DOB', ''),
            'Age': getattr(PatientId, 'Age', ''),
            'PatientType': getattr(PatientId, 'PatientType', ''),
            'Address': Address,
            'BloodGroup': BloodGroup,
            'AdmissionDrIncharge': AdmissionDrFullName,
            'VisitPurpose': getattr(Registration, 'VisitPurpose', '') if patient_type == 'OP' else None,
            'Specialization': getattr(getattr(patient_instance, 'Specialization', None), 'Speciality_Id', '') if hasattr(patient_instance, 'Specialization') else '',
            'DoctorName': (
                f"{getattr(getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'Tittle', None), 'Title_Name', '')}."
                f"{getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'First_Name', '')} "
                f"{getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'Last_Name', '')}"
            ).strip() if hasattr(patient_instance, 'PrimaryDoctor') else '',
            'DoctorId': getattr(getattr(patient_instance, 'PrimaryDoctor', None), 'Doctor_ID', '') if hasattr(patient_instance, 'PrimaryDoctor') else '',
            'Complaint': getattr(patient_instance, 'Complaint', '') if hasattr(patient_instance, 'Complaint') else '',
            'PatientCategory': patient_category,
            'PatientCategoryName': category_name,
            'PatientCategoryId': category_id,
            'IsMLC': getattr(PatientId, 'IsMLC', ''),
            'CurrDate': created_at.strftime('%d-%m-%y') if created_at else '',
            'CurrTime': created_at.strftime('%I:%M %p') if created_at else '',
            'LabRequestId': getattr(LabRequest, 'Request_Id', None)
        }

        print("OPRegistration_dict:", response_data)
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Error in get_workbenchquelist_doctor: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)





# Create your views here.

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_workbenchquelist_doctor(request):
#     try:
#         RegistrationId = request.GET.get('RegistrationId', '').strip()
#         type = request.GET.get('Type', '').strip()

#         if not RegistrationId :
#             return JsonResponse({'error': 'PatientId and VisitId are required'}, status=400)
        
#         if type == 'OP':
#             # Query the appointment details
#             try:
#                 patient_instance = Patient_Appointment_Registration_Detials.objects.get(pk = RegistrationId)
#             except Patient_Appointment_Registration_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#         elif type == 'IP':
#             try:
#                 patient_instance = Patient_IP_Registration_Detials.objects.get(pk = RegistrationId)
#             except Patient_IP_Registration_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)
        
#         elif type == 'Casuality':
#             try:
#                 patient_instance = Patient_Casuality_Registration_Detials.objects.get(pk = RegistrationId)
#             except Patient_Casuality_Registration_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#         else:
#             return JsonResponse({'error': 'Invalid type'}, status=400)
       
#         Flagging_name = patient_instance.Flagging.Flagg_Name if patient_instance.Flagging else None
#         Flagging_color = patient_instance.Flagging.Flagg_Color if patient_instance.Flagging else None
            
#         # Serialize the filtered queryset
#         OPRegistration_dict = {
#             'pk':patient_instance.pk,
#             'PatientProfile':get_file_image(patient_instance.PatientId.Patient_profile),
#             'RegistrationId': patient_instance.Registration_Id,
#             'PatientId': patient_instance.PatientId.PatientId,
#             'VisitId': patient_instance.VisitId,
#             'PatientName': f'{patient_instance.PatientId.Title}.{patient_instance.PatientId.FirstName} {patient_instance.PatientId.MiddleName} {patient_instance.PatientId.SurName}',
#             'PhoneNo': patient_instance.PatientId.PhoneNo,
#             'Title': patient_instance.PatientId.Title,
#             'FirstName': patient_instance.PatientId.FirstName,
#             'MiddleName': patient_instance.PatientId.MiddleName,
#             'SurName': patient_instance.PatientId.SurName,
#             'Gender': patient_instance.PatientId.Gender,
#             'AliasName': patient_instance.PatientId.AliasName,
#             'DOB': patient_instance.PatientId.DOB,
#             'Age': patient_instance.PatientId.Age,
#             'Address': f'{patient_instance.PatientId.DoorNo}.{patient_instance.PatientId.Street}.{patient_instance.PatientId.Area}.{patient_instance.PatientId.City}.{patient_instance.PatientId.State}.{patient_instance.PatientId.Country}.{patient_instance.PatientId.Pincode}',
#             'BloodGroup': patient_instance.PatientId.BloodGroup,
#             'VisitPurpose': patient_instance.VisitPurpose if type == 'OP' else None,
#             'Specialization': patient_instance.Specialization.Speciality_Id if patient_instance.Specialization else '',
#             'DoctorName': patient_instance.PrimaryDoctor.Doctor_ID,
#             'DoctorId': patient_instance.PrimaryDoctor.Doctor_ID,
#             'Complaint': patient_instance.Complaint,
#             'PatientType': patient_instance.PatientType,
#             'PatientCategory': patient_instance.PatientCategory,
#             'IsMLC': patient_instance.IsMLC,
#             'Flagging': patient_instance.Flagging,
#             'Flagging': Flagging_name,
#             'FlaggingColour': Flagging_color,
#             'CurrDate': patient_instance.PatientId.created_at.strftime('%d-%m-%y') if patient_instance.PatientId.created_at else "",
#             'CurrTime': patient_instance.PatientId.created_at.strftime('%I:%M %p') if patient_instance.PatientId.created_at else "",
                    
#         }



#         return JsonResponse(OPRegistration_dict)
        
        

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)






# @csrf_exempt
# @require_http_methods(["GET"])
# def get_workbenchquelist_doctor(request):
#     try:
#         # Get query parameters
#         RegistrationId = request.GET.get('RegistrationId', '').strip()
#         type = request.GET.get('Type', '').strip()

#         if not RegistrationId:
#             return JsonResponse({'error': 'PatientId and VisitId are required'}, status=400)

#         # Check if patient exists based on type
#         if type == 'OP':
#             try:
#                 patient_instance = Patient_Appointment_Registration_Detials.objects.get(pk=RegistrationId)
#             except Patient_Appointment_Registration_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#         elif type == 'IP':
#             try:
#                 patient_instance = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
#             except Patient_IP_Registration_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#         elif type == 'Casuality':
#             try:
#                 patient_instance = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
#             except Patient_Casuality_Registration_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#         else:
#             return JsonResponse({'error': 'Invalid type'}, status=400)

#         # Safe handling of Flagging and BloodGroup (added logging)
#         Flagging_name = patient_instance.Flagging.Flagg_Name if patient_instance.Flagging else None
#         Flagging_color = patient_instance.Flagging.Flagg_Color if patient_instance.Flagging else None

#         # Safely handling BloodGroup
#         BloodGroup = None
#         if patient_instance.PatientId.BloodGroup:
#             BloodGroup = patient_instance.PatientId.BloodGroup.pk

#         # Debugging logs
#         print(f"Flagging: {Flagging_name}, {Flagging_color}")
#         print(f"BloodGroup: {BloodGroup}")
        
#         # Build the response dictionary safely
#         OPRegistration_dict = {
#             'pk': patient_instance.pk,
#             'PatientProfile': get_file_image(patient_instance.PatientId.Patient_profile),
#             'RegistrationId': patient_instance.Registration_Id,
#             'PatientId': patient_instance.PatientId.PatientId,
#             'VisitId': patient_instance.VisitId,
#             'PatientName': f'{patient_instance.PatientId.Title}.{patient_instance.PatientId.FirstName} {patient_instance.PatientId.MiddleName} {patient_instance.PatientId.SurName}',
#             'PhoneNo': patient_instance.PatientId.PhoneNo,
#             'Title': patient_instance.PatientId.Title,
#             'FirstName': patient_instance.PatientId.FirstName,
#             'MiddleName': patient_instance.PatientId.MiddleName,
#             'SurName': patient_instance.PatientId.SurName,
#             'Gender': patient_instance.PatientId.Gender,
#             'AliasName': patient_instance.PatientId.AliasName,
#             'DOB': patient_instance.PatientId.DOB,
#             'Age': patient_instance.PatientId.Age,
#             'Address': f'{patient_instance.PatientId.DoorNo}.{patient_instance.PatientId.Street}.{patient_instance.PatientId.Area}.{patient_instance.PatientId.City}.{patient_instance.PatientId.State}.{patient_instance.PatientId.Country}.{patient_instance.PatientId.Pincode}',
#             'BloodGroup': BloodGroup,  # Safely passing BloodGroup as None if it doesn't exist
#             'VisitPurpose': patient_instance.VisitPurpose if type == 'OP' else None,
#             'Specialization': patient_instance.Specialization.Speciality_Id if patient_instance.Specialization else '',
#             'DoctorName': patient_instance.PrimaryDoctor.Doctor_ID,
#             'DoctorId': patient_instance.PrimaryDoctor.Doctor_ID,
#             'Complaint': patient_instance.Complaint,
#             'PatientType': patient_instance.PatientType,
#             'PatientCategory': patient_instance.PatientCategory,
#             'IsMLC': patient_instance.IsMLC,
#             'Flagging': Flagging_name,
#             'FlaggingColour': Flagging_color,
#             'CurrDate': patient_instance.PatientId.created_at.strftime('%d-%m-%y') if patient_instance.PatientId.created_at else "",
#             'CurrTime': patient_instance.PatientId.created_at.strftime('%I:%M %p') if patient_instance.PatientId.created_at else "",
#         }

#         # Log the final dictionary to ensure it's correct before returning the response
#         print(f"OPRegistration_dict: {OPRegistration_dict}")

#         return JsonResponse(OPRegistration_dict, safe=False)

#     except Exception as e:
#         # Log the error for debugging purposes
#         print(f"Error in get_workbenchquelist_doctor: {str(e)}")
#         return JsonResponse({'error': str(e)}, status=500)