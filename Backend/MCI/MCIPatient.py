# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from .models import *
# from django.db.models import  Q
# from django.db import transaction
# from PIL import Image
# from io import BytesIO
# import base64
# # import magic
# from PyPDF2 import PdfReader, PdfWriter
# from Masters.models import *
# from Workbench.models import Op_to_Ip_Convertion_Table
# from Masters.Login import authenticate_request
# from django.db import transaction
# from PIL import Image
# from io import BytesIO
# import base64
# # import magic
# import filetype
# from PyPDF2 import PdfReader, PdfWriter
# from Workbench.models import Op_to_Ip_Convertion_Table
# from datetime import datetime
# from django.utils import timezone
# from OutPatient.models import *
# from datetime import date
# from Workbench.models import *
# from django.shortcuts import get_object_or_404
# from django.db.models.functions import Cast
# from django.db.models import IntegerField  # or any other type you want to cast to


# # ABHA
# import requests
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.utils import timezone
# from cryptography.hazmat.primitives.asymmetric import rsa
# from cryptography.hazmat.primitives import hashes
# from cryptography.hazmat.primitives.asymmetric import padding
# from cryptography.hazmat.primitives import serialization
# from cryptography.hazmat.backends import default_backend
# import base64
# from datetime import datetime
# import uuid
# import json
# # from rest_framework.exceptions import IntegrityError
# from .models import *
# from django.db.models import Max
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.db.models import Q
# from Ip_Workbench.models import *
# from Workbench.Prescription import update_refer_doctor_data,update_op_ip_data,update_ot_request_data,update_follow_up_data

# from Lab.models import *

# from django.forms.models import model_to_dict
 
# from datetime import timedelta
# from django.utils.timezone import now

# def get_file_image(filedata):
#     kind = filetype.guess(filedata)
                
#     # Default to PDF if the type is undetermined
#     contenttype1 = 'application/pdf'
#     if kind and kind.mime == 'image/jpeg':
#         contenttype1 = 'image/jpeg'
#     elif kind and kind.mime == 'image/png':
#         contenttype1 = 'image/png'

#     # Return base64 encoded data with MIME type
#     return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'



# @csrf_exempt
# @require_http_methods(["GET"])
# def Total_OP_patients_List(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         doctor_id = request.GET.get('DoctorId', '')
#         Doctor = request.GET.get('Doctor')
       
#         dateOption = request.GET.get('dateOption')  # all  current
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         VisitPurpose = request.GET.get('VisitPurpose', '')
#         User = request.GET.get('User', '')

#         showFake = request.GET.get('showFake')
#         showCheckbox = request.GET.get('showCheckbox')

#         chosenspeciality = request.GET.get('chosenspeciality')
#         chosenspecdoc = request.GET.get('chosenspecdoc')

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_OP_count = 0
#         monthly_total_OP_count = 0
#         yearly_total_OP_count = 0

#         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='OP').order_by('-created_at')


#         if status:
#             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
#         else:
#             queryset = queryset.exclude(Registration_Id__Status='Cancelled')

#         if query:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
#                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
#                 Q(Registration_Id__PatientId_SurName_icontains=query) |
#                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
#                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
#             )
#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
#         # Particular date filter
#         if particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)
       
#         # Current Date filter (Ensure it's a valid date)
#         if Current_date and dateOption !="all":  
#             queryset = queryset.filter(created_at__date=Current_date)

#         if chosenspeciality:
#                 queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

#                 print(queryset.count(),'chosenspeciality')

#         if chosenspecdoc:
#                 queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

#                 print(queryset.count(),'chosenspecdoc')

#         if showFake == 'true' and showCheckbox == 'true':

#             print('fakekkkkk')
#             queryset = queryset.filter(Q(Registration_Id__VisitPurpose="OP") & (Q(Registration_Id__IsOriginal=False))).order_by('-created_at')
#             today_total_OP_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="OP").count()

#             monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="OP",
            
#             ).count()

#             yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="OP",
             
#             ).count()
#             print(queryset.count())

#         elif showCheckbox == 'true' and showFake == 'false':

#             print('originallllllllll')
#             queryset = queryset.filter(Q(Registration_Id__VisitPurpose="OP") & (Q(Registration_Id__IsOriginal=True))).order_by('-created_at')
#             today_total_OP_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="OP").count()

#             monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="OP",
            
#             ).count()

#             yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="OP",
             
#             ).count()
#             print(queryset.count())

#         elif showCheckbox == 'false':



#             print('combineeeeeeeeee')
#             queryset = queryset.filter(Registration_Id__VisitPurpose="OP").order_by('-created_at')
#             today_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today,Registration_Id__VisitPurpose="OP").count()

#             monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="OP",
            
#             ).count()

#             yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="OP",
             
#             ).count()
#             print(queryset.count())
 

 
#         # Serialize the filtered queryset
#         print('combineeeeeeeeee',len(queryset))
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=1):
#             patient = register.Registration_Id.PatientId
#             registerid = register.Registration_Id



#             formatted_bdate = register.created_at.strftime('%d-%m-%y')

#             # Create dictionary with fallback values
#             appointment_dict = {
                
#                 'id': idx,
#                 'Edit':'Yes',
#                 'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
#                 'PatientId': patient.PatientId,
#                 'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
#                 'PhoneNo': patient.PhoneNo,
#                 'Age': patient.Age,
#                 'Gender': patient.Gender,
#                 'AppointmentId': registerid.AppointmentId,
#                 'VisitId': registerid.VisitId,
#                 # 'Complaint': Doc_queryset.Complaint if Doc_queryset else '',
#                 'isMLC': registerid.IsMLC,
#                 'VisitType': register.VisitType if register else '',
#                 'isRefferal': registerid.IsReferral,
#                 'Status': registerid.Status,
#                 'created_by': registerid.created_by if registerid else '',
#                 'RegistrationId': registerid.pk,
#                 'fathername': patient.FatherName or '',
#                 'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
#                 'Street': patient.PermanentStreet or patient.Street or '',
#                 'Area': patient.PermanentArea or patient.Area or '',
#                 'City': patient.PermanentCity or patient.City or '',
#                 'District': patient.PermanentDistrict or patient.District or '',
#                 'State': patient.PermanentState or patient.State or '',
#                 'Country': patient.PermanentCountry or patient.Country or '',
#                 'Pincode': patient.PermanentPincode or patient.Pincode or '',

#                 'TokenNo': register.TokenNo,
              
#                 'Address': f"{patient.Street} {patient.Area}",
#                 'created_at': formatted_bdate,
#                 'registeridbarcode': register.Registration_Id.Registration_Id,
#                 # 'DoctorId': Doc_queryset.PrimaryDoctor.pk if Doc_queryset and Doc_queryset.PrimaryDoctor else None,
#                 # 'SpecilizationId': Doc_queryset.Specialization.Speciality_Id if Doc_queryset and Doc_queryset.Specialization else None,
#                 'DoctorName': (
#                     f"{register.PrimaryDoctor.Tittle.Title_Name if register and register.PrimaryDoctor and register.PrimaryDoctor.Tittle else ''}."
#                     f"{register.PrimaryDoctor.First_Name if register and register.PrimaryDoctor else ''} "
#                     f"{register.PrimaryDoctor.Last_Name if register and register.PrimaryDoctor else ''}"
#                 ).strip(),
#                 'Specilization': str(register.Specialization.Speciality_Name) if register and register.Specialization else '',
#                 'Multiple_Doc': []  # 🛠️ Ensure this is an empty list
#             }
 
#             # Fetch multiple doctor details
#             # Multiple_Doc = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=register.pk)
           
#             # for MulDoc in Multiple_Doc:
#             #     appointment_dict['Multiple_Doc'].append({  # ✅ Corrected here
#             #         'id': MulDoc.Registration_Id.pk,
#             #         'Specilization': str(MulDoc.Specialization.Speciality_Name) if MulDoc.Specialization else '',
#             #         'DoctorId': MulDoc.PrimaryDoctor.pk if MulDoc.PrimaryDoctor else None,
#             #         'SpecilizationId': MulDoc.Specialization.Speciality_Id if MulDoc.Specialization else '',
#             #         'VisitType': MulDoc.VisitType,
#             #         'Complaint': MulDoc.Complaint,
#             #         'TokenNo': MulDoc.TokenNo,
#             #         'DoctorName': (
#             #                 f"{MulDoc.PrimaryDoctor.Tittle.Title_Name if MulDoc and MulDoc.PrimaryDoctor and MulDoc.PrimaryDoctor.Tittle else ''}."
#             #                 f"{MulDoc.PrimaryDoctor.First_Name if MulDoc and MulDoc.PrimaryDoctor else ''} "
#             #                 f"{MulDoc.PrimaryDoctor.Last_Name if MulDoc and MulDoc.PrimaryDoctor else ''}"
#             #             ).strip(),  
#             #     })
 
#             appointment_register_data.append(appointment_dict)
#         # appointment_register_data['today_total_OP_count']=today_total_OP_count,
#         # appointment_register_data['monthly_total_OP_count']=monthly_total_OP_count,
#         # appointment_register_data['yearly_total_OP_count']=yearly_total_OP_count,

#         return JsonResponse({
#             'appointments': appointment_register_data,
#             'today_total_OP_count': today_total_OP_count,
#             'monthly_total_OP_count': monthly_total_OP_count,
#             'yearly_total_OP_count': yearly_total_OP_count
#         }, safe=False)

#         # return JsonResponse(appointment_register_data, safe=False)
    
 
#     except Exception as e:
#         return JsonResponse({'error': str(e)})




# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_appointment_details(request):
#     try:
#         doctor_id = request.GET.get('DoctorId') or request.GET.get('Doctor')
#         print("doctor_id",doctor_id)
#         date = request.GET.get('date')
#         todate = request.GET.get('todate')
#         query = request.GET.get('query', '')
#         today = now().date()
#         print("date", date)
#         print("todate", todate)
       
#         # queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose="OP")
#         queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose="OP")
 
 
#         # Case when both 'date' and 'todate' are provided (no doctor_id, no query)
#         if date and todate and not doctor_id and not query:
#             queryset = queryset.filter(
#                 created_at__date__gte=date,  # Filter for appointments on or after 'date'
#                 created_at__date__lte=todate  # Filter for appointments on or before 'todate'
#             )
 
#         # Case when 'date', 'todate' and 'query' are provided (no doctor_id)
#         elif date and todate and query and not doctor_id:
#             queryset = queryset.filter(
#                 created_at__date__gte=date,
#                 created_at__date__lte=todate
#             ).filter(
#                 Q(Registration_Id__PatientId__FirstName__icontains=query) |
#                 Q(Registration_Id__PatientId__MiddleName__icontains=query) |
#                 Q(Registration_Id__PatientId__SurName__icontains=query) |
#                 Q(Registration_Id__PatientId__PatientId__icontains=query) |
#                 Q(Registration_Id__PatientId__PhoneNo__icontains=query)
#             )
 
#         # Case when 'date', 'todate', 'query', and 'doctor_id' are all provided
#         elif date and todate and query and doctor_id:
#             queryset = queryset.filter(
#                 PrimaryDoctor__pk=doctor_id,
#                 created_at__date__gte=date,
#                 created_at__date__lte=todate
#             ).filter(
#                 Q(Registration_Id__PatientId__FirstName__icontains=query) |
#                 Q(Registration_Id__PatientId__MiddleName__icontains=query) |
#                 Q(Registration_Id__PatientId__SurName__icontains=query) |
#                 Q(Registration_Id__PatientId__PatientId__icontains=query) |
#                 Q(Registration_Id__PatientId__PhoneNo__icontains=query)
#             )
       
 
#         # Case when only 'query' is provided (no date, no todate, no doctor_id)
#         elif query and not doctor_id and not date and not todate:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId__FirstName__icontains=query) |
#                 Q(Registration_Id__PatientId__MiddleName__icontains=query) |
#                 Q(Registration_Id__PatientId__SurName__icontains=query) |
#                 Q(Registration_Id__PatientId__PatientId__icontains=query) |
#                 Q(Registration_Id__PatientId__PhoneNo__icontains=query)
#             )
       
#         # Case when 'date' and 'query' are provided (no doctor_id and no todate)
#         elif date and query and not doctor_id and not todate:
#             queryset = queryset.filter(
#                 created_at__date=date
#             ).filter(
#                 Q(Registration_Id__PatientId__FirstName__icontains=query) |
#                 Q(Registration_Id__PatientId__MiddleName__icontains=query) |
#                 Q(Registration_Id__PatientId__SurName__icontains=query) |
#                 Q(Registration_Id__PatientId__PatientId__icontains=query) |
#                 Q(Registration_Id__PatientId__PhoneNo__icontains=query)
#             )
 
#         # Case when 'date' and 'doctor_id' are provided (no query and no todate)
#         elif date and doctor_id and not query and not todate:
#             queryset = queryset.filter(
#                 PrimaryDoctor__pk=doctor_id,
#                 created_at__date=date
#             )
#         elif date and todate and doctor_id and  not query:
#             print("9090")
#             queryset = queryset.filter(
#                 PrimaryDoctor__pk=doctor_id,
#                 created_at__date__gte=date,  # From date
#                 created_at__date__lte=todate
#             )
#             print("queryset",queryset)
       
 
#         # Case when only 'date' is provided (no doctor_id, no query, no todate)
#         elif date and not doctor_id and not query and not todate:
#             queryset = queryset.filter(created_at__date=date)
 
#         # Case when only 'doctor_id' is provided (no date, no query, no todate)
#         elif doctor_id and not date and not query and not todate:
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
 
#         # Case when no filters are provided, return appointments for today
#         elif not doctor_id and not date and not query and not todate:
#             queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today)
       
#         # Handle case when only 'date' is provided (and not 'todate')
#         elif date and not todate:
#             queryset = queryset.filter(created_at__date=date)
 
#         # Handle case when only 'todate' is provided (and not 'date')
#         elif todate and not date:
#             queryset = queryset.filter(created_at__date__lte=todate)
 
#         total_patients = queryset.count()
#         DocWisePatient = []
#         for idx, register in enumerate(queryset, start=1):
#             RegisterPatient = {
#                 'id': idx,
#                 'PatientId': register.Registration_Id.PatientId.PatientId,
#                 'PatientId': register.Registration_Id.PatientId.PatientId,
#                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name}.{register.Registration_Id.PatientId.FirstName} {register.Registration_Id.PatientId.MiddleName or ''} {register.Registration_Id.PatientId.SurName}",
#                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo,
#                 'Age': register.Registration_Id.PatientId.Age,
#                 'Gender': register.Registration_Id.PatientId.Gender,
#                 'VisitId': register.Registration_Id.VisitId,
#                 'VisitType': register.VisitType,
#                 'Status': register.Status,
#                 'RegistrationId': register.Registration_Id.Registration_Id,
#                 'Specilization': register.Specialization.pk if register.Specialization else '',
#                 'Doctorid': register.PrimaryDoctor.Doctor_ID if register.PrimaryDoctor else None,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                 'TotalPatientCount': total_patients if total_patients else 0
#             }
#             DocWisePatient.append(RegisterPatient)
 
#         return JsonResponse(DocWisePatient, safe=False)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)




# @csrf_exempt
# @require_http_methods(["GET"])
# def Total_IP_Patients_List(request):
#     try:
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         DoctorId = request.GET.get('DoctorId', '')
#         Doctor = request.GET.get('Doctor')
#         User = request.GET.get('User', '')
#         dateOption = request.GET.get('dateOption','')
#         showFake = request.GET.get('showFake', '')
#         showCheckbox = request.GET.get('showCheckbox', '')
#         chosenspeciality = request.GET.get('chosenspeciality', '')
#         chosenspecdoc = request.GET.get('chosenspecdoc', '')
       
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
 
#         # Map status to Booking_Status
#         Booking_Status = (
#             'Booked' if status == 'Pending' else
#             'Occupied' if status == 'Admitted' else
#             'Vacated' if status == 'Completed' else
#             'Cancelled'
#         )
 

#         queryset = MCI_Patient_IP_Registration_Detials.objects.all().order_by('-created_at')
#         print(queryset.count(),'count1111111111')

#         if query:
#             queryset = queryset.filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query) |
#                 Q(IPNo__icontains=f"IP{query}")
#             )
 
#         if DoctorId:
#             queryset = queryset.filter(PrimaryDoctor__pk=DoctorId)
       
#         if Doctor:
#             queryset = queryset.filter(PrimaryDoctor__pk=Doctor)
 
#         if status:  # Only apply status filter if provided
#             queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=Booking_Status))

#         # Apply date filters only if parameters are provided
#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])
#         elif particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)
#         elif Current_date:
#             queryset = queryset.filter(created_at__date=Current_date)

#         if chosenspeciality:
#             queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

#         if chosenspecdoc:
#             queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_Admitted_IP_count= None
#         monthly_Admitted_IP_count= None
#         yearly_Admitted_IP_count = None
#         today_Discharged_IP_count= None
#         monthly_Discharged_IP_count = None
#         yearly_Discharged_IP_count =None

#         if showFake == 'true' and showCheckbox == 'true':

#             queryset = queryset.filter(
#                 Q(IsOriginal = False)
#             )

#             today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
#             monthly_Admitted_IP_count = queryset.filter(
#                     created_at__year=current_year,
#                     created_at__month=current_month,
#                     Status='Admitted',
#                 ).count()
 
#             yearly_Admitted_IP_count = queryset.filter(
#                 created_at__year=current_year,Status='Admitted'
#             ).count()
 
#             today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
#             monthly_Discharged_IP_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Status='Completed'
#             ).count()
#             yearly_Discharged_IP_count = queryset.filter(
#                 created_at__year=current_year,Status='Completed',
#             ).count()
 
#         elif showCheckbox == 'true' and showFake == 'false':

#             print('original patients',queryset.count())
#             queryset = queryset.filter(
#                 IsOriginal = True
#             )

#             print(queryset,'queryset')

#             today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
#             monthly_Admitted_IP_count = queryset.filter(
#                     created_at__year=current_year,
#                     created_at__month=current_month,
#                     Status='Admitted',
#                 ).count()
 
#             yearly_Admitted_IP_count = queryset.filter(
#                 created_at__year=current_year,Status='Admitted'
#             ).count()
 
#             today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
#             monthly_Discharged_IP_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Status='Completed'
#             ).count()
#             yearly_Discharged_IP_count = queryset.filter(
#                 created_at__year=current_year,Status='Completed',
#             ).count()

#         elif showCheckbox == 'false':


#             today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
#             monthly_Admitted_IP_count = queryset.filter(
#                     created_at__year=current_year,
#                     created_at__month=current_month,
#                     Status='Admitted',
#                 ).count()
 
#             yearly_Admitted_IP_count = queryset.filter(
#                 created_at__year=current_year,Status='Admitted'
#             ).count()
 
#             today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
#             monthly_Discharged_IP_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Status='Completed'
#             ).count()
#             yearly_Discharged_IP_count = queryset.filter(
#                 created_at__year=current_year,Status='Completed',
#             ).count()


#         ip_register_data = []
#         for idx, register in enumerate(queryset, start=1):
#             BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'RegistrationId': register.IPNo,
#                 'PatientId': register.PatientId.PatientId,
#                 'PatientName': f"{register.PatientId.Title.Title_Name + '.' if register.PatientId.Title else ''}{register.PatientId.FirstName or ''} {register.PatientId.MiddleName or ''} {register.PatientId.SurName or ''}".strip(),
#                 # 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                 'PhoneNo': register.PatientId.PhoneNo,
#                 'Age': register.PatientId.Age,
#                 'Gender': register.PatientId.Gender,
#                 'BloodGroup': BloodGroup_name,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 'isRefferal': register.IsReferral,
#                 'Status': register.Status,
#                 'created_by': register.created_by if register else '',
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 'IsOriginal' : register.IsOriginal
#             }
 
#             if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
#                 roomdetials = MCI_Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_by').first()
#                 if roomdetials:
#                     appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
#                     appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
#                     appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
#                     appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
#                     appointment_dict['WardId'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Id if roomdetials.RoomId else None
#                     appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
#                     appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
#                     appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials else None
 
#             ip_register_data.append(appointment_dict)
 
       
#         return JsonResponse({
#             'appointments': ip_register_data,
#             'today_Admitted_IP_count': today_Admitted_IP_count,
#             'monthly_Admitted_IP_count': monthly_Admitted_IP_count,
#             'yearly_Admitted_IP_count': yearly_Admitted_IP_count,
#             'today_Discharged_IP_count': today_Discharged_IP_count,
#             'monthly_Discharged_IP_count': monthly_Discharged_IP_count,
#             'yearly_Discharged_IP_count': yearly_Discharged_IP_count,
#         }, safe=False)
   
#         # return JsonResponse(ip_register_data, safe=False)
 
#     except Exception as e:
#         return JsonResponse({'error': str(e)})
   
 


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
 
#                 patient_instance = Patient_Casuality_Registration_Detials.objects.filter(PatientId_id=register.PatientId.PatientId)
 
#                 for patient_ins in patient_instance:
 
 
#                  PatientType_ins = Flaggcolor_Detials.objects.get(Flagg_Name=patient_ins.PatientType)
#                  patientCategory_ins = Flaggcolor_Detials.objects.get(Flagg_Name=patient_ins.PatientCategory)
               
#                  try:
#                   specialtype_ins = Flaggcolor_Detials.objects.get(Flagg_Id=patient_ins.Flagging_id)
 
#                  except Flaggcolor_Detials.DoesNotExist:
#                     continue
               
 
#                  specialtypelist = ['GENERAL','VIP','GOVT','INSURANCE','MLC','CLIENT','CORPORATE','DONATION','EMPLOYEE','EMPLOYEERELATION','DOCTOR','DOCTORRELATION']
           
#                  if patient_ins.IsMLC == 'Yes':
 
#                       mlc_ins = Flaggcolor_Detials.objects.get(Flagg_Name= 'MLC')
 
#                       appointment_dict = {
#                         'id' : idx,
#                         'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId and register.PatientId.Patient_profile else None,
#                         'RegistrationId':register.pk,
#                         'PatientId': register.PatientId.PatientId if register.PatientId else None,
#                         'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
#                         'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
#                         'Age': register.PatientId.Age,
#                         'Gender': register.PatientId.Gender,
#                         'VisitId': register.VisitId,
#                         'Complaint': register.Complaint,
#                         # 'isMLC': register.IsMLC,
#                         # 'Flagging': Flagging_name,
#                         # 'FlaggingColour': Flagging_color,
#                         # 'Flagging': register.Flagging,
#                         'isRefferal': register.IsReferral,
#                         'Status': register.Status,
#                         'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                         'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                     
                       
#                         'PatientType': patient_ins.PatientType,
#                         'patientTypeColor':PatientType_ins.Flagg_Color,
#                         'PatientCategory':patient_ins.PatientCategory,
#                         'patientCategoryColor':patientCategory_ins.Flagg_Color,
#                         'IsMLC':   'MLC',
#                         'MLCColor': mlc_ins.Flagg_Color,
#                         'specialtype' : specialtype_ins.Flagg_Name if specialtype_ins.Flagg_Name  not in specialtypelist else 'GENERAL',
#                         'specialtypecolor':specialtype_ins.Flagg_Color if specialtype_ins.Flagg_Name  not in specialtypelist else '#fff'
                       
#                      }
#                       casuality_register_data.append(appointment_dict)
 
#                  else:
#                     appointment_dict = {
#                     'id' : idx,
#                     'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId and register.PatientId.Patient_profile else None,
#                     'RegistrationId':register.pk,
#                     'PatientId': register.PatientId.PatientId if register.PatientId else None,
#                     'PatientName': f"{register.PatientId.Title}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}" if register.PatientId else None,
#                     'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
#                     'Age': register.PatientId.Age,
#                     'Gender': register.PatientId.Gender,
#                     'VisitId': register.VisitId,
#                     'Complaint': register.Complaint,
#                     # 'isMLC': register.IsMLC,
#                     # 'Flagging': Flagging_name,
#                     # 'FlaggingColour': Flagging_color,
#                     # 'Flagging': register.Flagging,
#                     'isRefferal': register.IsReferral,
#                     'Status': register.Status,
#                     'DoctorName': f"{register.PrimaryDoctor.Tittle}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                     'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                   
                   
#                     'PatientType': patient_ins.PatientType,
#                     'patientTypeColor':PatientType_ins.Flagg_Color,
#                     'PatientCategory':patient_ins.PatientCategory,
#                     'patientCategoryColor':patientCategory_ins.Flagg_Color,
#                     'IsMLC':   None,
#                     'MLCColor': None,
#                     'specialtype' : specialtype_ins.Flagg_Name if specialtype_ins.Flagg_Name  not in specialtypelist else 'GENERAL',
#                     'specialtypecolor':specialtype_ins.Flagg_Color if specialtype_ins.Flagg_Name  not in specialtypelist else '#fff'
                   
#                     }
#                     casuality_register_data.append(appointment_dict)
               
                   
 
#             return JsonResponse(casuality_register_data, safe=False)
 
#         except Exception as e:
#             return JsonResponse({'error': str(e)})
 
# @csrf_exempt
# @require_http_methods(["GET"])
# def Total_Emergency_patients_List(request):
#     try:
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         DoctorId = request.GET.get('DoctorId', '')
        
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         User = request.GET.get('User', '')


 
#         # Map status to Booking_Status
#         Booking_Status = 'Occupied' if status == 'Admitted' else 'Completed'
        
       
#         queryset = Patient_Emergency_Registration_Detials.objects.all().order_by('-created_at')
#         # queryset = Patient_Emergency_Registration_Detials.objects.all()
        
#         # Apply filters based on the query parameters
#         if query:
#             queryset = queryset.filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             ).filter(Booking_Status=Booking_Status)
        
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
        
#         if User:
#             queryset = queryset.filter(created_by=User)

#         if status:
#             queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)
        
#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_Admitted_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(created_at__date=today,Status='Admitted',created_by=User).count()
        
#         monthly_Admitted_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
#             created_at__year=current_year,
#             created_at__month=current_month,
#             Status='Admitted',
#             created_by=User
#         ).count()

#         yearly_Admitted_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
#             created_at__year=current_year,
#             Status='Admitted',
#             created_by=User
#         ).count()

#         today_Discharged_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(created_at__date=today,Status='Completed',created_by=User).count()
        
#         monthly_Discharged_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
#             created_at__year=current_year,
#             created_at__month=current_month,
#             Status='Completed',
#             created_by=User
#         ).count()

#         yearly_Discharged_Emg_count = Patient_Emergency_Registration_Detials.objects.filter(
#             created_at__year=current_year,
#             Status='Completed',
#             created_by=User
#         ).count()

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
#                 'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else ''}{register.PatientId.FirstName if register.PatientId else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
#                 'PhoneNo': register.PatientId.PhoneNo if register.PatientId else None,
#                 'Age': register.PatientId.Age if register.PatientId else None,
#                 'Gender': register.PatientId.Gender if register.PatientId else None,
#                 'UHIDNO' : register.PatientId.UniqueIdNo if register.PatientId else None,
#                 # 'BloodGroup': BloodGroup_name,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 # 'Flagging': Flagging_name,
#                 # 'FlaggingColour': Flagging_color,
#                 # 'Flagging': register.Flagging,
#                 'isRefferal': register.IsReferral,
#                 'created_by': register.created_by if register else '',

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

#         # return JsonResponse(Emg_register_data, safe=False)
    
#         return JsonResponse({
#             'appointments': Emg_register_data,
#             'today_Admitted_Emg_count': today_Admitted_Emg_count,
#             'monthly_Admitted_Emg_count': monthly_Admitted_Emg_count,
#             'yearly_Admitted_Emg_count': yearly_Admitted_Emg_count,
#             'today_Discharged_Emg_count': today_Discharged_Emg_count,
#             'monthly_Discharged_Emg_count': monthly_Discharged_Emg_count,
#             'yearly_Discharged_Emg_count': yearly_Discharged_Emg_count,
#         }, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_diagnosis_patient_appointment_details(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         doctor_id = request.GET.get('DoctorId', '')
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         User = request.GET.get('User', '')
#         dateOption = request.GET.get('dateOption')

#         print(dateOption,'dateOption')

#         Requestid = ""


#         showFake = request.GET.get('showFake')
#         showCheckbox = request.GET.get('showCheckbox')

#         chosenspeciality = request.GET.get('chosenspeciality')
#         chosenspecdoc = request.GET.get('chosenspecdoc')

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_Rad_count = 0
#         monthly_total_Rad_count = 0
#         yearly_total_Rad_count = 0
 
#         # Start with all records
#         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='RADIOLOGY').order_by('-created_at')

#         print(queryset.count(),'queryset11111')

#         if status:
#             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
#         else:
#             # Exclude 'Cancelled' status if no status is specified
#             queryset = queryset.exclude(Registration_Id__Status='Cancelled')

#         if query:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
#                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
#                 Q(Registration_Id__PatientId_SurName_icontains=query) |
#                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
#                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
#             )
#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
#         # Particular date filter
#         if particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)
       
#         # Current Date filter (Ensure it's a valid date)
#         if Current_date and dateOption !="all":  

#             queryset = queryset.filter(created_at__date=Current_date)
#             print(queryset.count(),'currrrrrenttttt')

#         if dateOption == 'all':
                
#                 print('insideeeeeeealllllllll')

#         # if chosenspeciality:
#         #         queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)
#         #         print(queryset.count(),'chosenspeciality')

#         # if chosenspecdoc:
#         #         queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)
#         #         print(queryset.count(),'chosenspecdoc')


#         if showFake == 'true' and showCheckbox == 'true':

#             queryset = queryset.filter(Q(Registration_Id__VisitPurpose="RADIOLOGY") & (Q(Registration_Id__Registration_Id__startswith="FOP"))).order_by('-created_at')
#             today_total_Rad_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="RADIOLOGY").count()

#             monthly_total_Rad_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="RADIOLOGY",
                
#             ).count()

#             yearly_total_Rad_count = queryset.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="RADIOLOGY",
              
#             ).count()

#         elif showCheckbox == 'true' and showFake == 'false':

#             queryset = queryset.filter(Q(Registration_Id__VisitPurpose="RADIOLOGY") & (Q(Registration_Id__Registration_Id__startswith="OP"))).order_by('-created_at')
#             today_total_Rad_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="RADIOLOGY").count()

#             monthly_total_Rad_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="RADIOLOGY",
                
#             ).count()

#             yearly_total_Rad_count = queryset.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="RADIOLOGY",
              
#             ).count()

#         elif showCheckbox == 'false':

#             queryset = queryset.filter(Registration_Id__VisitPurpose="RADIOLOGY").order_by('-created_at')
#             today_total_Rad_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="RADIOLOGY").count()

#             monthly_total_Rad_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="RADIOLOGY",
                
#             ).count()

#             yearly_total_Rad_count = queryset.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="RADIOLOGY",
              
#             ).count()


#             print(queryset.count)
#             print(today_total_Rad_count)
#             print(monthly_total_Rad_count)
#             print(yearly_total_Rad_count)


#         print(queryset.count(),'querysetttttttttttt')
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=1):
 
#             testdetails = MCI_Radiology_Request_Details.objects.filter(OP_Register_Id=register.Registration_Id,Status='Paid')
#             testlist = []
#             for datas in testdetails:
#                 Requestid = datas.Radiology_RequestId
#                 Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
#                 Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()
 
#                 datalist={
#                     'RadiologyName' : Dep.Radiology_Name,
#                     'Radiologyid': Dep.Radiology_Id,
#                     'TestCode':Test.Test_Code,
#                     'TestName': Test.Test_Name
 
#                 }
#                 testlist.append(datalist)
           
#             # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
           
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
#                 'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
#                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
#                 'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
               
#                 'Complaint': register.Complaint,
#                 'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
#                 'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
 
#                 'VisitType': register.VisitType,
#                 'Complaint': register.Complaint,
#                 # 'Flagging': Flagging_name,
#                 # 'FlaggingColour': Flagging_color,
#                 'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
#                 'Status': register.Registration_Id.Status if register.Registration_Id else '',
#                 'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
#                 'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
#                 'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',

               
#                 'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
#                 'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
#                 'DoctorName': (
#                     f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
#                     f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
#                     f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
#                 ),
 
#                 # 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor.Tittle else None}.{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} {register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}",
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 'Raddocid' : register.pk,
#                 'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",
#                 'testlist':testlist,
#                 'Requestid' : Requestid
#             }
#             appointment_register_data.append(appointment_dict)
 
 
 
 
 
 
#         return JsonResponse(
#             {
#                 'appointments': appointment_register_data,
#                 'today_total_Rad_count': today_total_Rad_count,
#                 'monthly_total_Rad_count': monthly_total_Rad_count,
#                 'yearly_total_Rad_count': yearly_total_Rad_count
#             }, safe=False)
 

#     except Exception as e:
#         return JsonResponse({'error': str(e)})
 

# # @csrf_exempt
# # @require_http_methods(["GET"])
# # def get_diagnosis_patient_appointment_details(request):
# #     try:
# #         # Get query parameters
# #         query = request.GET.get('query', '')
# #         status = request.GET.get('status', '')
# #         doctor_id = request.GET.get('DoctorId', '')
# #         from_date = request.GET.get('fromDate', '')  
# #         to_date = request.GET.get('toDate', '')  
# #         particular_date = request.GET.get('ParticularDate', '')
# #         Current_date = request.GET.get('CurrentDate', '')
# #         User = request.GET.get('User', '')


 
# #         # Start with all records
# #         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='RADIOLOGY').order_by('-created_at')

# #         # Apply filters based on the query parameters
# #         if query:
# #             queryset = queryset.filter(
# #                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
# #                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
# #                 Q(Registration_Id__PatientId_SurName_icontains=query) |
# #                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
# #                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
# #             )
# #         if from_date and to_date:
# #             queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
# #         # Particular date filter
# #         elif particular_date:
# #             queryset = queryset.filter(created_at__date=particular_date)
       
# #         # Current Date filter (Ensure it's a valid date)
# #         elif Current_date and Current_date != "":  
# #             queryset = queryset.filter(created_at__date=Current_date)
 
# #         # Filter by DoctorId
# #         if not doctor_id:
# #              pass
# #         else:
# #             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
# #         # Filter by status if specified
# #         if status:
# #             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
# #         else:
# #             # Exclude 'Cancelled' status if no status is specified
# #             queryset = queryset.exclude(Registration_Id__Status='Cancelled')
        
# #         # if User not in ['host','admin']:
# #         #     queryset = queryset.filter(Registration_Id__created_by=User)

# #         today = date.today()
# #         current_year = today.year
# #         current_month = today.month

# #         today_total_Rad_count = 0
# #         monthly_total_Rad_count = 0
# #         yearly_total_Rad_count = 0

# #         if User not in ['host','admin']: 

# #             today_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,created_by=User,VisitPurpose="RADIOLOGY").count()

# #             monthly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month,
# #                 VisitPurpose="RADIOLOGY",
                
# #             ).count()

# #             yearly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 VisitPurpose="RADIOLOGY",
              
# #             ).count() 

# #         else :

# #             today_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,VisitPurpose="RADIOLOGY",).count()

# #             monthly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month,
# #                 VisitPurpose="RADIOLOGY",

# #             ).count()

# #             yearly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 VisitPurpose="RADIOLOGY",

# #             ).count() 




       
# #         # Serialize the filtered queryset
# #         appointment_register_data = []
# #         for idx, register in enumerate(queryset, start=1):
 
# #             # testdetails = Radiology_Request_Details.objects.filter(OP_Register_Id=register.Registration_Id,Status='Request')
# #             # testlist = []
# #             # for datas in testdetails:
# #             #     Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
# #             #     Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()
 
# #             #     datalist={
# #             #         'RadiologyName' : Dep.Radiology_Name,
# #             #         'Radiologyid': Dep.Radiology_Id,
# #             #         'TestCode':Test.Test_Code,
# #             #         'TestName': Test.Test_Name
 
# #             #     }
# #             #     testlist.append(datalist)
           
# #             # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
# #             # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
           
# #             appointment_dict = {
# #                 'id': idx,
# #                 'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
# #                 'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
# #                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
# #                 'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
               
# #                 'Complaint': register.Complaint,
# #                 'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
# #                 'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
 
# #                 'VisitType': register.VisitType,
# #                 'Complaint': register.Complaint,
# #                 # 'Flagging': Flagging_name,
# #                 # 'FlaggingColour': Flagging_color,
# #                 'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
# #                 'Status': register.Registration_Id.Status if register.Registration_Id else '',
# #                 'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
# #                 'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
# #                 'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',

               
# #                 'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
# #                 'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
# #                 'DoctorName': (
# #                     f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
# #                     f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
# #                     f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
# #                 ),
 
# #                 # 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor.Tittle else None}.{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} {register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}",
# #                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
# #                 'Raddocid' : register.pk,
# #                 'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",

# #                 # 'testlist':testlist
# #             }
# #             appointment_register_data.append(appointment_dict)
 
 
 
 
 
 
# #         return JsonResponse(
# #             {
# #                 'appointments': appointment_register_data,
# #                 'today_total_Rad_count': today_total_Rad_count,
# #                 'monthly_total_Rad_count': monthly_total_Rad_count,
# #                 'yearly_total_Rad_count': yearly_total_Rad_count
# #             }, safe=False)
 

# #     except Exception as e:
# #         return JsonResponse({'error': str(e)})
 


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_lab_patient_appointment_details(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         doctor_id = request.GET.get('DoctorId', '')
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         User = request.GET.get('User', '')
#         dateOption = request.GET.get('dateOption')


#         showFake = request.GET.get('showFake')
#         showCheckbox = request.GET.get('showCheckbox')

#         chosenspeciality = request.GET.get('chosenspeciality')
#         chosenspecdoc = request.GET.get('chosenspecdoc')

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_Lab_count = 0
#         monthly_total_Lab_count = 0
#         yearly_total_Lab_count = 0
 
#         # Start with all records
#         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='LAB').order_by('-created_at')
#         print(queryset,'premmmmmmmmmmmm')
       
#         if status:
#             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
#         else:
#             # Exclude 'Cancelled' status if no status is specified
#             queryset = queryset.exclude(Registration_Id__Status='Cancelled')

#         if query:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
#                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
#                 Q(Registration_Id__PatientId_SurName_icontains=query) |
#                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
#                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
#             )
#         if from_date and to_date:
#             queryset = queryset.filter(Registration_Id__created_at__date__range=[from_date, to_date])
 
#         # Particular date filter
#         if particular_date:
#             queryset = queryset.filter(Registration_Id__created_at__date=particular_date)
       
#         # Current Date filter (Ensure it's a valid date)
#         if Current_date and dateOption !="all":  
#             queryset = queryset.filter(Registration_Id__created_at__date=Current_date)

#         if showFake == 'true' and showCheckbox == 'true':

#             print('fakekkkkk')
#             queryset = queryset.filter(Q(Registration_Id__VisitPurpose="LAB") & (Q(Registration_Id__Registration_Id__startswith="FOP"))).order_by('-created_at')
            
#             today_total_Lab_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="LAB").count()
            
#             monthly_total_Lab_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="LAB",
#             ).count()

#             yearly_total_Lab_count = queryset.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="LAB",
#             ).count()

#             print(queryset.count())

#         elif showCheckbox == 'true' and showFake == 'false':

#             print('originallllllllll')
#             queryset = queryset.filter(Q(Registration_Id__VisitPurpose="LAB") & (Q(Registration_Id__Registration_Id__startswith="OP"))).order_by('-created_at')
#             print(queryset.count())

#             today_total_Lab_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="LAB").count()
            
#             monthly_total_Lab_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="LAB",
#             ).count()

#             yearly_total_Lab_count = queryset.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="LAB",
#             ).count()

#         elif showCheckbox == 'false':

#             print('combineeeeeeeeee')
#             queryset = queryset.filter(Registration_Id__VisitPurpose="LAB").order_by('-created_at')
#             print(queryset.count())

#             today_total_Lab_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="LAB").count()
            
#             monthly_total_Lab_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 Registration_Id__VisitPurpose="LAB",
#             ).count()

#             yearly_total_Lab_count = queryset.filter(
#                 created_at__year=current_year,
#                 Registration_Id__VisitPurpose="LAB",
#             ).count()


    
   
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=1):

#             lab_details = MCI_Lab_Request_Details.objects.filter(OP_Register_Id = register.Registration_Id)
#             testlist = []
#             for lab in lab_details:

#                 labRequestId = lab.Request_Id
 
#                 item = MCI_Lab_Request_Items_Details.objects.filter(Request = lab.Request_Id)
#                 sno = 0
#                 for i in item:
#                     sno = sno + 1
 
#                     if i.TestType == 'Individual':
 
#                         datalist = {
#                                 'id': sno,
#                                 'Name':i.Test_Code.Test_Name,
#                                 'itemid': i.pk,
#                                 'Code':i.Test_Code.Test_Code
#                         }
#                         testlist.append(datalist)
 
#                     elif i.TestType == 'Group':
 
#                         datalist = {
#                                 'id': sno,                                
#                                 'Name':i.Group_Code.Group_Name,
#                                 'itemid': i.pk,
#                                 'Code':i.Group_Code.Group_Code

#                         }
#                         testlist.append(datalist)
 
#                     elif i.TestType == 'Offers':
 
#                         datalist = {
#                                 'id': sno,
#                                 'Name':i.Package_Code.package_name,
#                                 'itemid': i.pk,
#                                 'Code':i.Package_Code.package_code

#                         }
#                         testlist.append(datalist)
           
 
 
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
#                 'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
#                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
#                 'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
#                 'Complaint': register.Complaint,
#                 'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
#                 'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
#                 'VisitType': register.VisitType,
#                 'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
#                 'Status': register.Registration_Id.Status if register.Registration_Id else '',
#                 'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
#                 'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
#                 'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
#                 'DoctorName': (
#                     f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
#                     f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
#                     f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
#                 ),
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 'Labdocid': register.pk,
#                 'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",
#                 'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
#                 'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',
#                 # 'LabrequestID': labRequestId,
#                 'testlist':testlist,

#             }
#             appointment_register_data.append(appointment_dict)
 

#         return JsonResponse(
#             {
#                 'appointments': appointment_register_data,
#                 'today_total_Lab_count': today_total_Lab_count,
#                 'monthly_total_Lab_count': monthly_total_Lab_count,
#                 'yearly_total_Lab_count': yearly_total_Lab_count
#             }, safe=False)
 
#     except Exception as e:
#         return JsonResponse({'error':str(e)})
 


# # @csrf_exempt
# # @require_http_methods(["GET"])
# # def get_lab_patient_appointment_details(request):
# #     try:
# #         # Get query parameters
# #         query = request.GET.get('query', '')
# #         status = request.GET.get('status', '')
# #         doctor_id = request.GET.get('DoctorId', '')
# #         from_date = request.GET.get('fromDate', '')  
# #         to_date = request.GET.get('toDate', '')  
# #         particular_date = request.GET.get('ParticularDate', '')
# #         Current_date = request.GET.get('CurrentDate', '')
# #         User = request.GET.get('User', '')

# #         showFake = request.GET.get('showFake')
# #         showCheckbox = request.GET.get('showCheckbox')
 
# #         # Start with all records
# #         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='LAB').order_by('-created_at')
       


        
# #         # Apply filters based on the query parameters
# #         if query:
# #             queryset = queryset.filter(
# #                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
# #                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
# #                 Q(Registration_Id__PatientId_SurName_icontains=query) |
# #                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
# #                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
# #             )
# #         if from_date and to_date:
# #             queryset = queryset.filter(Registration_Id__created_at__date__range=[from_date, to_date])
 
# #         # Particular date filter
# #         elif particular_date:
# #             queryset = queryset.filter(Registration_Id__created_at__date=particular_date)
       
# #         # Current Date filter (Ensure it's a valid date)
# #         elif Current_date and Current_date != "":  
# #             queryset = queryset.filter(Registration_Id__created_at__date=Current_date)
 
# #         # Filter by DoctorId
# #         if not doctor_id:
# #              pass
# #         else:
# #             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
# #         # Filter by status if specified
# #         if status:
# #             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
# #         else:
# #             # Exclude 'Cancelled' status if no status is specified
# #             queryset = queryset.exclude(Registration_Id__Status='Cancelled')
        
# #         if User not in ['host','admin']:
# #             queryset = queryset.filter(Registration_Id__created_by=User)

# #         today = date.today()
# #         current_year = today.year
# #         current_month = today.month

# #         today_total_Lab_count = 0
# #         monthly_total_Lab_count = 0
# #         yearly_total_Lab_count = 0

# #         if User not in ['host','admin']: 

# #             today_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,created_by=User,VisitPurpose="LAB").count()

# #             monthly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month,
# #                 VisitPurpose="LAB",
# #             ).count()

# #             yearly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 VisitPurpose="LAB",
# #             ).count() 

# #         else :

# #             today_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,VisitPurpose="LAB",).count()

# #             monthly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month,
# #                 VisitPurpose="LAB",

# #             ).count()

# #             yearly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
# #                 created_at__year=current_year,
# #                 VisitPurpose="LAB",

# #             ).count() 


       
# #         # Serialize the filtered queryset
   
# #         appointment_register_data = []
# #         for idx, register in enumerate(queryset, start=1):
 
# #             appointment_dict = {
# #                 'id': idx,
# #                 'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
# #                 'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
# #                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
# #                 'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
# #                 'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
# #                 'Complaint': register.Complaint,
# #                 'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
# #                 'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
# #                 'VisitType': register.VisitType,
# #                 'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
# #                 'Status': register.Registration_Id.Status if register.Registration_Id else '',
# #                 'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
# #                 'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
# #                 'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
# #                 'DoctorName': (
# #                     f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
# #                     f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
# #                     f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
# #                 ),
# #                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
# #                 'Labdocid': register.pk,
# #                 'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",
# #                 'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
# #                 'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',


# #             }
# #             appointment_register_data.append(appointment_dict)
 

# #         return JsonResponse(
# #             {
# #                 'appointments': appointment_register_data,
# #                 'today_total_Lab_count': today_total_Lab_count,
# #                 'monthly_total_Lab_count': monthly_total_Lab_count,
# #                 'yearly_total_Lab_count': yearly_total_Lab_count
# #             }, safe=False)
 
# #     except Exception as e:
# #         return JsonResponse({'error':str(e)})
 
 

# @csrf_exempt
# @require_http_methods(["GET"])
# def Overall_OP_patients_List(request):
#     try:
#         # Get query parameters

       
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')

 
#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_OP_count = 0
#         monthly_total_OP_count = 0
#         yearly_total_OP_count = 0


#         today_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today).count()

#         monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,

#             ).count()

#         yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 created_at__year=current_year,

#             ).count() 
    

          
#         return JsonResponse({
#             'today_total_OP_count': today_total_OP_count,
#             'monthly_total_OP_count': monthly_total_OP_count,
#             'yearly_total_OP_count': yearly_total_OP_count
#         }, safe=False)

#         # return JsonResponse(appointment_register_data, safe=False)
    
 
#     except Exception as e:
#         return JsonResponse({'error': str(e)})


 
# # from django.http import JsonResponse
# # from django.views.decorators.csrf import csrf_exempt
# # from django.views.decorators.http import require_http_methods
# # from django.db.models import Q
# # from datetime import date

# # @csrf_exempt
# # @require_http_methods(["GET"])
# # def Total_OP_patients_List(request):
# #     try:
# #         # Get query parameters
# #         query = request.GET.get('query', '')
# #         status = request.GET.get('status', '')
# #         doctor_id = request.GET.get('DoctorId', '')
# #         Doctor = request.GET.get('Doctor', '')
# #         dateOption = request.GET.get('dateOption', '')  # all, current
# #         from_date = request.GET.get('fromDate', '')
# #         to_date = request.GET.get('toDate', '')
# #         particular_date = request.GET.get('ParticularDate', '')
# #         Current_date = request.GET.get('CurrentDate', '')
# #         VisitPurpose = request.GET.get('VisitPurpose', '')
# #         User = request.GET.get('User', '')
# #         showFake = request.GET.get('showFake', '')
# #         showCheckbox = request.GET.get('showCheckbox', '')
# #         chosenspeciality = request.GET.get('chosenspeciality', '')
# #         chosenspecdoc = request.GET.get('chosenspecdoc', '')
        
# #         # Pagination parameters
# #         limit = int(request.GET.get('limit', 10))  # Default to 10 if not provided
# #         offset = int(request.GET.get('offset', 0))  # Default to 0 if not provided

# #         today = date.today()
# #         current_year = today.year
# #         current_month = today.month

# #         today_total_OP_count = 0
# #         monthly_total_OP_count = 0
# #         yearly_total_OP_count = 0

# #         # Base queryset
# #         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
# #             Registration_Id__VisitPurpose='OP'
# #         ).order_by('-created_at')

# #         print(queryset.count(),'queryset1111111')

# #         # Apply filters
# #         if status:
# #             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))

# #             print(queryset.count(),'status')
# #         else:
# #             queryset = queryset.exclude(Registration_Id__Status='Cancelled')

# #         if query:
# #             queryset = queryset.filter(
# #                 Q(Registration_Id__PatientId__FirstName__icontains=query) |
# #                 Q(Registration_Id__PatientId__MiddleName__icontains=query) |
# #                 Q(Registration_Id__PatientId__SurName__icontains=query) |
# #                 Q(Registration_Id__PatientId__PatientId__icontains=query) |
# #                 Q(Registration_Id__PatientId__PhoneNo__icontains=query)
# #             )

# #         if from_date and to_date:
# #             queryset = queryset.filter(created_at__date__range=[from_date, to_date])

# #         if particular_date:
# #             queryset = queryset.filter(created_at__date=particular_date)

# #         if Current_date and dateOption != "all":
# #             queryset = queryset.filter(created_at__date=Current_date)


# #         if chosenspeciality:
# #             queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

# #         if chosenspecdoc:
# #             queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

# #         # Handle showFake and showCheckbox logic
# #         if showFake == 'true' and showCheckbox == 'true':
# #             queryset = queryset.filter(
# #                 Q(Registration_Id__VisitPurpose="OP") &
# #                 Q(Registration_Id__Registration_Id__startswith="FOP")
# #             ).order_by('-created_at')
# #             today_total_OP_count = queryset.filter(created_at__date=today).count()
# #             monthly_total_OP_count = queryset.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month
# #             ).count()
# #             yearly_total_OP_count = queryset.filter(created_at__year=current_year).count()

# #         elif showCheckbox == 'true' and showFake == 'false':
# #             queryset = queryset.filter(
# #                 Q(Registration_Id__VisitPurpose="OP") &
# #                 Q(Registration_Id__Registration_Id__startswith="OP")
# #             ).order_by('-created_at')
# #             today_total_OP_count = queryset.filter(created_at__date=today).count()
# #             monthly_total_OP_count = queryset.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month
# #             ).count()
# #             yearly_total_OP_count = queryset.filter(created_at__year=current_year).count()

# #         elif showCheckbox == 'false':
# #             queryset = queryset.filter(Registration_Id__VisitPurpose="OP").order_by('-created_at')
# #             today_total_OP_count = queryset.filter(created_at__date=today).count()
# #             monthly_total_OP_count = queryset.filter(
# #                 created_at__year=current_year,
# #                 created_at__month=current_month
# #             ).count()
# #             yearly_total_OP_count = queryset.filter(created_at__year=current_year).count()


# #         # Get total count before pagination
# #         total_count = queryset.count()

# #         # Apply pagination
# #         queryset = queryset[offset:offset + limit]

# #         # Serialize the filtered queryset
# #         appointment_register_data = []
# #         for idx, register in enumerate(queryset, start=offset + 1):
# #             patient = register.Registration_Id.PatientId
# #             registerid = register.Registration_Id

# #             formatted_bdate = register.created_at.strftime('%d-%m-%y')

# #             # Create dictionary with fallback values
# #             appointment_dict = {
# #                 'id': idx,
# #                 'Edit': 'Yes',
# #                 'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
# #                 'PatientId': patient.PatientId,
# #                 'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
# #                 'PhoneNo': patient.PhoneNo,
# #                 'Age': patient.Age,
# #                 'Gender': patient.Gender,
# #                 'AppointmentId': registerid.AppointmentId,
# #                 'VisitId': registerid.VisitId,
# #                 'isMLC': registerid.IsMLC,
# #                 'VisitType': register.VisitType if register else '',
# #                 'isRefferal': registerid.IsReferral,
# #                 'Status': registerid.Status,
# #                 'created_by': registerid.created_by if registerid else '',
# #                 'RegistrationId': registerid.pk,
# #                 'fathername': patient.FatherName or '',
# #                 'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
# #                 'Street': patient.PermanentStreet or patient.Street or '',
# #                 'Area': patient.PermanentArea or patient.Area or '',
# #                 'City': patient.PermanentCity or patient.City or '',
# #                 'District': patient.PermanentDistrict or patient.District or '',
# #                 'State': patient.PermanentState or patient.State or '',
# #                 'Country': patient.PermanentCountry or patient.Country or '',
# #                 'Pincode': patient.PermanentPincode or patient.Pincode or '',
# #                 'TokenNo': register.TokenNo,
# #                 'Address': f"{patient.Street} {patient.Area}",
# #                 'created_at': formatted_bdate,
# #                 'registeridbarcode': register.Registration_Id.Registration_Id,
# #                 'DoctorName': (
# #                     f"{register.PrimaryDoctor.Tittle.Title_Name if register and register.PrimaryDoctor and register.PrimaryDoctor.Tittle else ''}."
# #                     f"{register.PrimaryDoctor.First_Name if register and register.PrimaryDoctor else ''} "
# #                     f"{register.PrimaryDoctor.Last_Name if register and register.PrimaryDoctor else ''}"
# #                 ).strip(),
# #                 'Specilization': str(register.Specialization.Speciality_Name) if register and register.Specialization else '',
# #                 'Multiple_Doc': []  # Empty list for multiple doctors
# #             }

# #             appointment_register_data.append(appointment_dict)

# #         # Return paginated response with total count
# #         return JsonResponse({
# #             'appointments': appointment_register_data,
# #             'total_count': total_count,
# #             'today_total_OP_count': today_total_OP_count,
# #             'monthly_total_OP_count': monthly_total_OP_count,
# #             'yearly_total_OP_count': yearly_total_OP_count
# #         }, safe=False)

# #     except Exception as e:
# #         return JsonResponse({'error': str(e)}, status=500)


# @csrf_exempt
# @require_http_methods(["GET","POST"])
# def Fake_IPPatient_Discharge(request):

#     try:

#         if request.method == "POST":

#             data = json.loads(request.body)

#             RegistrationId = data.get('RegistrationId','')
#             RoomId = data.get('RoomId')
#             WardId = data.get('WardId')
#             createdby = data.get('createdby')

#             today = date.today()

#             print(today,'today',RegistrationId)

#             Ipregins = MCI_Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()



#             if Ipregins:

#                 Discharegins = MCI_Patient_Discharge_Detials(
#                     Registration_Id = Ipregins,
#                     Discharge_Date = today,
#                     created_by = createdby
#                 )

#                 Discharegins.save()

#                 Ipregins.Status = 'Completed'
#                 Ipregins.Booking_Status = 'Vacated'
#                 Ipregins.save()

#                 roomdatas = MCI_Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__Registration_Id = Ipregins.Registration_Id)
#                 print(roomdatas,'roomdatas')
#                 for rdata in roomdatas:

#                     rdata.IsStayed = False
#                     rdata.CurrentlyStayed = False
#                     rdata.save()

#                     if rdata.RoomId:

#                         print(rdata.RoomId,'rdata.RoomId')
#                         print(rdata.RoomId.Room_Id,'rdata.RoomId')


#                         roomins = MCI_Room_Master_Detials.objects.filter(Room_Id=rdata.RoomId.Room_Id).first()
#                         print(roomins,'roomins')
#                         roomins.Booking_Status= 'Available'
#                         roomins.save()


#             return JsonResponse({'success':' Discharge  details saved successfully'})


#     except Exception as e:
#             return JsonResponse({"error":str(e)})



import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
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
def Total_OP_patients_List(request):
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        doctor_id = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
       
        dateOption = request.GET.get('dateOption')  # all  current
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
        VisitPurpose = request.GET.get('VisitPurpose', '')
        User = request.GET.get('User', '')

        showFake = request.GET.get('showFake')
        showCheckbox = request.GET.get('showCheckbox')

        chosenspeciality = request.GET.get('chosenspeciality')
        chosenspecdoc = request.GET.get('chosenspecdoc')

        today = date.today()
        current_year = today.year
        current_month = today.month

        today_total_OP_count = 0
        monthly_total_OP_count = 0
        yearly_total_OP_count = 0

        queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='OP').order_by('-created_at')


        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')

        if query:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query)
                | Q(Registration_Id__PatientId__MiddleName__icontains=query)
                | Q(Registration_Id__PatientId__SurName__icontains=query)
                | Q(Registration_Id__PatientId__PatientNo__icontains=query)
                | Q(Registration_Id__PatientId__PhoneNo__icontains=query)
                | Q(Registration_Id__PatientId__PatientId__icontains=query)

                
            )
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
        # Particular date filter
        if particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        if Current_date and dateOption !="all":  
            queryset = queryset.filter(created_at__date=Current_date)

        if chosenspeciality:
                queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

                print(queryset.count(),'chosenspeciality')

        if chosenspecdoc:
                queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

                print(queryset.count(),'chosenspecdoc')

        if showFake == 'true' and showCheckbox == 'true':

            print('fakekkkkk')
            queryset = queryset.filter(Q(Registration_Id__VisitPurpose="OP") & (Q(Registration_Id__IsOriginal=False))).order_by('-created_at')
            today_total_OP_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="OP").count()

            monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="OP",
            
            ).count()

            yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="OP",
             
            ).count()
            print(queryset.count())

        elif showCheckbox == 'true' and showFake == 'false':

            print('originallllllllll')
            queryset = queryset.filter(Q(Registration_Id__VisitPurpose="OP") & (Q(Registration_Id__IsOriginal=True))).order_by('-created_at')
            today_total_OP_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="OP").count()

            monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="OP",
            
            ).count()

            yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="OP",
             
            ).count()
            print(queryset.count())

        elif showCheckbox == 'false':



            print('combineeeeeeeeee')
            queryset = queryset.filter(Registration_Id__VisitPurpose="OP").order_by('-created_at')
            today_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today,Registration_Id__VisitPurpose="OP").count()

            monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="OP",
            
            ).count()

            yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="OP",
             
            ).count()
            print(queryset.count())
 

 
        # Serialize the filtered queryset
        print('combineeeeeeeeee',len(queryset))
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
            patient = register.Registration_Id.PatientId
            registerid = register.Registration_Id



            formatted_bdate = register.created_at.strftime('%d-%m-%y')

            # Create dictionary with fallback values
            appointment_dict = {
                
                'id': idx,
                'Edit':'Yes',
                'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                'PatientId': patient.PatientId if registerid.IsOriginal == True else patient.PatientNo,
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                'PhoneNo': patient.PhoneNo,
                'Age': patient.Age,
                'Gender': patient.Gender,
                'AppointmentId': registerid.AppointmentId,
                'VisitId': registerid.VisitId,
                # 'Complaint': Doc_queryset.Complaint if Doc_queryset else '',
                'isMLC': registerid.IsMLC,
                'VisitType': register.VisitType if register else '',
                'isRefferal': registerid.IsReferral,
                'Status': registerid.Status,
                'created_by': registerid.created_by if registerid else '',
                'RegistrationId': registerid.OPNo,
                'fathername': patient.FatherName or '',
                'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
                'Street': patient.PermanentStreet or patient.Street or '',
                'Area': patient.PermanentArea or patient.Area or '',
                'City': patient.PermanentCity or patient.City or '',
                'District': patient.PermanentDistrict or patient.District or '',
                'State': patient.PermanentState or patient.State or '',
                'Country': patient.PermanentCountry or patient.Country or '',
                'Pincode': patient.PermanentPincode or patient.Pincode or '',

                'TokenNo': register.TokenNo,
              
                'Address': f"{patient.Street} {patient.Area}",
                'created_at': formatted_bdate,
                'registeridbarcode': register.Registration_Id.Registration_Id,
                # 'DoctorId': Doc_queryset.PrimaryDoctor.pk if Doc_queryset and Doc_queryset.PrimaryDoctor else None,
                # 'SpecilizationId': Doc_queryset.Specialization.Speciality_Id if Doc_queryset and Doc_queryset.Specialization else None,
                'DoctorName': (
                    f"{register.PrimaryDoctor.Tittle.Title_Name if register and register.PrimaryDoctor and register.PrimaryDoctor.Tittle else ''}."
                    f"{register.PrimaryDoctor.First_Name if register and register.PrimaryDoctor else ''} "
                    f"{register.PrimaryDoctor.Last_Name if register and register.PrimaryDoctor else ''}"
                ).strip(),
                'Specilization': str(register.Specialization.Speciality_Name) if register and register.Specialization else '',
                'Multiple_Doc': []  # 🛠️ Ensure this is an empty list
            }
 
            # Fetch multiple doctor details
            # Multiple_Doc = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=register.pk)
           
            # for MulDoc in Multiple_Doc:
            #     appointment_dict['Multiple_Doc'].append({  # ✅ Corrected here
            #         'id': MulDoc.Registration_Id.pk,
            #         'Specilization': str(MulDoc.Specialization.Speciality_Name) if MulDoc.Specialization else '',
            #         'DoctorId': MulDoc.PrimaryDoctor.pk if MulDoc.PrimaryDoctor else None,
            #         'SpecilizationId': MulDoc.Specialization.Speciality_Id if MulDoc.Specialization else '',
            #         'VisitType': MulDoc.VisitType,
            #         'Complaint': MulDoc.Complaint,
            #         'TokenNo': MulDoc.TokenNo,
            #         'DoctorName': (
            #                 f"{MulDoc.PrimaryDoctor.Tittle.Title_Name if MulDoc and MulDoc.PrimaryDoctor and MulDoc.PrimaryDoctor.Tittle else ''}."
            #                 f"{MulDoc.PrimaryDoctor.First_Name if MulDoc and MulDoc.PrimaryDoctor else ''} "
            #                 f"{MulDoc.PrimaryDoctor.Last_Name if MulDoc and MulDoc.PrimaryDoctor else ''}"
            #             ).strip(),  
            #     })
 
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
def get_patient_appointment_details(request):
    try:
        doctor_id = request.GET.get('DoctorId') or request.GET.get('Doctor')
        print("doctor_id",doctor_id)
        date = request.GET.get('date')
        todate = request.GET.get('todate')
        query = request.GET.get('query', '')
        today = now().date()
        print("date", date)
        print("todate", todate)
       
        # queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose="OP")
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose="OP")
 
 
        # Case when both 'date' and 'todate' are provided (no doctor_id, no query)
        if date and todate and not doctor_id and not query:
            queryset = queryset.filter(
                created_at__date__gte=date,  # Filter for appointments on or after 'date'
                created_at__date__lte=todate  # Filter for appointments on or before 'todate'
            )
 
        # Case when 'date', 'todate' and 'query' are provided (no doctor_id)
        elif date and todate and query and not doctor_id:
            queryset = queryset.filter(
                created_at__date__gte=date,
                created_at__date__lte=todate
            ).filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )
 
        # Case when 'date', 'todate', 'query', and 'doctor_id' are all provided
        elif date and todate and query and doctor_id:
            queryset = queryset.filter(
                PrimaryDoctor__pk=doctor_id,
                created_at__date__gte=date,
                created_at__date__lte=todate
            ).filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )
       
 
        # Case when only 'query' is provided (no date, no todate, no doctor_id)
        elif query and not doctor_id and not date and not todate:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )
       
        # Case when 'date' and 'query' are provided (no doctor_id and no todate)
        elif date and query and not doctor_id and not todate:
            queryset = queryset.filter(
                created_at__date=date
            ).filter(
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=query)
            )
 
        # Case when 'date' and 'doctor_id' are provided (no query and no todate)
        elif date and doctor_id and not query and not todate:
            queryset = queryset.filter(
                PrimaryDoctor__pk=doctor_id,
                created_at__date=date
            )
        elif date and todate and doctor_id and  not query:
            print("9090")
            queryset = queryset.filter(
                PrimaryDoctor__pk=doctor_id,
                created_at__date__gte=date,  # From date
                created_at__date__lte=todate
            )
            print("queryset",queryset)
       
 
        # Case when only 'date' is provided (no doctor_id, no query, no todate)
        elif date and not doctor_id and not query and not todate:
            queryset = queryset.filter(created_at__date=date)
 
        # Case when only 'doctor_id' is provided (no date, no query, no todate)
        elif doctor_id and not date and not query and not todate:
            queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
 
        # Case when no filters are provided, return appointments for today
        elif not doctor_id and not date and not query and not todate:
            queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today)
       
        # Handle case when only 'date' is provided (and not 'todate')
        elif date and not todate:
            queryset = queryset.filter(created_at__date=date)
 
        # Handle case when only 'todate' is provided (and not 'date')
        elif todate and not date:
            queryset = queryset.filter(created_at__date__lte=todate)
 
        total_patients = queryset.count()
        DocWisePatient = []
        for idx, register in enumerate(queryset, start=1):
            RegisterPatient = {
                'id': idx,
                'PatientId': register.Registration_Id.PatientId.PatientId,
                'PatientId': register.Registration_Id.PatientId.PatientId,
                'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name}.{register.Registration_Id.PatientId.FirstName} {register.Registration_Id.PatientId.MiddleName or ''} {register.Registration_Id.PatientId.SurName}",
                'PhoneNo': register.Registration_Id.PatientId.PhoneNo,
                'Age': register.Registration_Id.PatientId.Age,
                'Gender': register.Registration_Id.PatientId.Gender,
                'VisitId': register.Registration_Id.VisitId,
                'VisitType': register.VisitType,
                'Status': register.Status,
                'RegistrationId': register.Registration_Id.Registration_Id,
                'Specilization': register.Specialization.pk if register.Specialization else '',
                'Doctorid': register.PrimaryDoctor.Doctor_ID if register.PrimaryDoctor else None,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
                'TotalPatientCount': total_patients if total_patients else 0
            }
            DocWisePatient.append(RegisterPatient)
 
        return JsonResponse(DocWisePatient, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def Total_IP_Patients_List(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        DoctorId = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
        User = request.GET.get('User', '')
        dateOption = request.GET.get('dateOption','')
        showFake = request.GET.get('showFake', '')
        showCheckbox = request.GET.get('showCheckbox', '')
        chosenspeciality = request.GET.get('chosenspeciality', '')
        chosenspecdoc = request.GET.get('chosenspecdoc', '')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
 
        # Map status to Booking_Status
        Booking_Status = (
            'Booked' if status == 'Pending' else
            'Occupied' if status == 'Admitted' else
            'Vacated' if status == 'Completed' else
            'Cancelled'
        )
 

        queryset = MCI_Patient_IP_Registration_Detials.objects.all().order_by('-created_at')
        print(queryset.count(),'count1111111111')

        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientNo__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query) |
                Q(IPNo__icontains=f"IP{query}")
            )
 
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__pk=DoctorId)
       
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__pk=Doctor)
 
        if status:  # Only apply status filter if provided
            queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=Booking_Status))

        # Apply date filters only if parameters are provided
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        elif Current_date:
            queryset = queryset.filter(created_at__date=Current_date)

        if chosenspeciality:
            queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

        if chosenspecdoc:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

        today = date.today()
        current_year = today.year
        current_month = today.month

        today_Admitted_IP_count= None
        monthly_Admitted_IP_count= None
        yearly_Admitted_IP_count = None
        today_Discharged_IP_count= None
        monthly_Discharged_IP_count = None
        yearly_Discharged_IP_count =None
        total_IP_Patient_count = None

        if showFake == 'true' and showCheckbox == 'true':

            queryset = queryset.filter(
                Q(IsOriginal = False)
            )

            today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
            monthly_Admitted_IP_count = queryset.filter(
                    created_at__year=current_year,
                    created_at__month=current_month,
                    Status='Admitted',
                ).count()
 
            yearly_Admitted_IP_count = queryset.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
 
            today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed'
            ).count()
            yearly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,Status='Completed',
            ).count()


            total_IP_Patient_count = queryset.filter(Status='Admitted').count()
 
        elif showCheckbox == 'true' and showFake == 'false':

            print('original patients',queryset.count())
            queryset = queryset.filter(
                IsOriginal = True
            )

            print(queryset,'queryset')

            today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
            monthly_Admitted_IP_count = queryset.filter(
                    created_at__year=current_year,
                    created_at__month=current_month,
                    Status='Admitted',
                ).count()
 
            yearly_Admitted_IP_count = queryset.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
 
            today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed'
            ).count()
            yearly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,Status='Completed',
            ).count()

            total_IP_Patient_count = queryset.filter(Status='Admitted').count()


        elif showCheckbox == 'false':


            today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
            monthly_Admitted_IP_count = queryset.filter(
                    created_at__year=current_year,
                    created_at__month=current_month,
                    Status='Admitted',
                ).count()
 
            yearly_Admitted_IP_count = queryset.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
 
            today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed'
            ).count()
            yearly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,Status='Completed',
            ).count()

            total_IP_Patient_count = queryset.filter(Status='Admitted').count()



        ip_register_data = []
        for idx, register in enumerate(queryset, start=1):
            BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.IPNo,
                'PatientId': register.PatientId.PatientId if register.IsOriginal == True else register.PatientId.PatientNo,
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
                'IsOriginal' : register.IsOriginal,
                'AdmissionDate': register.created_at.strftime('%d-%m-%y')
            }
 
            if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
                roomdetials = MCI_Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_by').first()
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
            'total_IP_Patient_count' : total_IP_Patient_count
        }, safe=False)
   
        # return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
   

@csrf_exempt
@require_http_methods(["GET"])
def Total_IP_Patients_count(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        DoctorId = request.GET.get('DoctorId', '')
        Doctor = request.GET.get('Doctor')
        User = request.GET.get('User', '')
        dateOption = request.GET.get('dateOption','')
        showFake = request.GET.get('showFake', '')
        showCheckbox = request.GET.get('showCheckbox', '')
        chosenspeciality = request.GET.get('chosenspeciality', '')
        chosenspecdoc = request.GET.get('chosenspecdoc', '')
       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')
 
        # Map status to Booking_Status
        Booking_Status = (
            'Booked' if status == 'Pending' else
            'Occupied' if status == 'Admitted' else
            'Vacated' if status == 'Completed' else
            'Cancelled'
        )
 

        queryset = MCI_Patient_IP_Registration_Detials.objects.all().order_by('-created_at')
        print(queryset.count(),'count1111111111')

        # if query:
        #     queryset = queryset.filter(
        #         Q(PatientId__FirstName__icontains=query) |
        #         Q(PatientId__MiddleName__icontains=query) |
        #         Q(PatientId__SurName__icontains=query) |
        #         Q(PatientId__PatientId__icontains=query) |
        #         Q(PatientId__PhoneNo__icontains=query) |
        #         Q(IPNo__icontains=f"IP{query}")
        #     )
 
        # if DoctorId:
        #     queryset = queryset.filter(PrimaryDoctor__pk=DoctorId)
       
        # if Doctor:
        #     queryset = queryset.filter(PrimaryDoctor__pk=Doctor)
 
        # if status:  # Only apply status filter if provided
        #     queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=Booking_Status))

        # # Apply date filters only if parameters are provided
        # if from_date and to_date:
        #     queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        # elif particular_date:
        #     queryset = queryset.filter(created_at__date=particular_date)
        # elif Current_date:
        #     queryset = queryset.filter(created_at__date=Current_date)

        # if chosenspeciality:
        #     queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

        # if chosenspecdoc:
        #     queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

        today = date.today()
        current_year = today.year
        current_month = today.month

        today_Admitted_IP_count= None
        monthly_Admitted_IP_count= None
        yearly_Admitted_IP_count = None
        today_Discharged_IP_count= None
        monthly_Discharged_IP_count = None
        yearly_Discharged_IP_count =None
        total_IP_Patient_count = None

        if showFake == 'true' and showCheckbox == 'true':

            queryset = queryset.filter(
                Q(IsOriginal = False)
            )

            today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
            monthly_Admitted_IP_count = queryset.filter(
                    created_at__year=current_year,
                    created_at__month=current_month,
                    Status='Admitted',
                ).count()
 
            yearly_Admitted_IP_count = queryset.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
 
            today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed'
            ).count()
            yearly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,Status='Completed',
            ).count()


            total_IP_Patient_count = queryset.filter(Status='Admitted').count()
 
        elif showCheckbox == 'true' and showFake == 'false':

            print('original patients',queryset.count())
            queryset = queryset.filter(
                IsOriginal = True
            )

            print(queryset,'queryset')

            today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
            monthly_Admitted_IP_count = queryset.filter(
                    created_at__year=current_year,
                    created_at__month=current_month,
                    Status='Admitted',
                ).count()
 
            yearly_Admitted_IP_count = queryset.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
 
            today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed'
            ).count()
            yearly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,Status='Completed',
            ).count()

            total_IP_Patient_count = queryset.filter(Status='Admitted').count()


        elif showCheckbox == 'false':


            today_Admitted_IP_count = queryset.filter(created_at__date=today,Status='Admitted').count()
       
            monthly_Admitted_IP_count = queryset.filter(
                    created_at__year=current_year,
                    created_at__month=current_month,
                    Status='Admitted',
                ).count()
 
            yearly_Admitted_IP_count = queryset.filter(
                created_at__year=current_year,Status='Admitted'
            ).count()
 
            today_Discharged_IP_count = queryset.filter(created_at__date=today,Status='Completed').count()
            monthly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Status='Completed'
            ).count()
            yearly_Discharged_IP_count = queryset.filter(
                created_at__year=current_year,Status='Completed',
            ).count()

            total_IP_Patient_count = queryset.filter(Status='Admitted').count()



        ip_register_data = []
        # for idx, register in enumerate(queryset, start=1):
        #     BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None
        #     appointment_dict = {
        #         'id': idx,
        #         'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
        #         'RegistrationId': register.IPNo,
        #         'PatientId': register.PatientId.PatientId,
        #         'PatientName': f"{register.PatientId.Title.Title_Name + '.' if register.PatientId.Title else ''}{register.PatientId.FirstName or ''} {register.PatientId.MiddleName or ''} {register.PatientId.SurName or ''}".strip(),
        #         # 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
        #         'PhoneNo': register.PatientId.PhoneNo,
        #         'Age': register.PatientId.Age,
        #         'Gender': register.PatientId.Gender,
        #         'BloodGroup': BloodGroup_name,
        #         'Complaint': register.Complaint,
        #         'isMLC': register.IsMLC,
        #         'isRefferal': register.IsReferral,
        #         'Status': register.Status,
        #         'created_by': register.created_by if register else '',
        #         'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
        #         'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
        #         'IsOriginal' : register.IsOriginal
        #     }
 
        #     if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
        #         roomdetials = MCI_Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_by').first()
        #         if roomdetials:
        #             appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
        #             appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
        #             appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
        #             appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
        #             appointment_dict['WardId'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Id if roomdetials.RoomId else None
        #             appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
        #             appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
        #             appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials else None
 
        #     ip_register_data.append(appointment_dict)
 
       
        return JsonResponse({
            'appointments': ip_register_data,
            'today_Admitted_IP_count': today_Admitted_IP_count,
            'monthly_Admitted_IP_count': monthly_Admitted_IP_count,
            'yearly_Admitted_IP_count': yearly_Admitted_IP_count,
            'today_Discharged_IP_count': today_Discharged_IP_count,
            'monthly_Discharged_IP_count': monthly_Discharged_IP_count,
            'yearly_Discharged_IP_count': yearly_Discharged_IP_count,
            'total_IP_Patient_count' : total_IP_Patient_count
        }, safe=False)
   
        # return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
   
 


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
def Total_Emergency_patients_List(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
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

        print(dateOption,'dateOption')

        Requestid = ""


        showFake = request.GET.get('showFake')
        showCheckbox = request.GET.get('showCheckbox')

        chosenspeciality = request.GET.get('chosenspeciality')
        chosenspecdoc = request.GET.get('chosenspecdoc')

        today = date.today()
        current_year = today.year
        current_month = today.month

        today_total_Rad_count = 0
        monthly_total_Rad_count = 0
        yearly_total_Rad_count = 0
 
        # Start with all records
        queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='RADIOLOGY').order_by('-created_at')

        print(queryset.count(),'queryset11111')

        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            # Exclude 'Cancelled' status if no status is specified
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')

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
        if particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        if Current_date and dateOption !="all":  

            queryset = queryset.filter(created_at__date=Current_date)
            print(queryset.count(),'currrrrrenttttt')

        if dateOption == 'all':
                
                print('insideeeeeeealllllllll')

        # if chosenspeciality:
        #         queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)
        #         print(queryset.count(),'chosenspeciality')

        # if chosenspecdoc:
        #         queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)
        #         print(queryset.count(),'chosenspecdoc')


        if showFake == 'true' and showCheckbox == 'true':

            queryset = queryset.filter(Q(Registration_Id__VisitPurpose="RADIOLOGY") & (Q(Registration_Id__Registration_Id__startswith="FOP"))).order_by('-created_at')
            today_total_Rad_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="RADIOLOGY").count()

            monthly_total_Rad_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="RADIOLOGY",
                
            ).count()

            yearly_total_Rad_count = queryset.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="RADIOLOGY",
              
            ).count()

        elif showCheckbox == 'true' and showFake == 'false':

            queryset = queryset.filter(Q(Registration_Id__VisitPurpose="RADIOLOGY") & (Q(Registration_Id__Registration_Id__startswith="OP"))).order_by('-created_at')
            today_total_Rad_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="RADIOLOGY").count()

            monthly_total_Rad_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="RADIOLOGY",
                
            ).count()

            yearly_total_Rad_count = queryset.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="RADIOLOGY",
              
            ).count()

        elif showCheckbox == 'false':

            queryset = queryset.filter(Registration_Id__VisitPurpose="RADIOLOGY").order_by('-created_at')
            today_total_Rad_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="RADIOLOGY").count()

            monthly_total_Rad_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="RADIOLOGY",
                
            ).count()

            yearly_total_Rad_count = queryset.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="RADIOLOGY",
              
            ).count()


            print(queryset.count)
            print(today_total_Rad_count)
            print(monthly_total_Rad_count)
            print(yearly_total_Rad_count)


        print(queryset.count(),'querysetttttttttttt')
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):
 
            testdetails = MCI_Radiology_Request_Details.objects.filter(OP_Register_Id=register.Registration_Id,Status='Paid')
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
                'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
                'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',

               
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
                'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",
                'testlist':testlist,
                'Requestid' : Requestid
            }
            appointment_register_data.append(appointment_dict)
 
 
 
 
 
 
        return JsonResponse(
            {
                'appointments': appointment_register_data,
                'today_total_Rad_count': today_total_Rad_count,
                'monthly_total_Rad_count': monthly_total_Rad_count,
                'yearly_total_Rad_count': yearly_total_Rad_count
            }, safe=False)
 

    except Exception as e:
        return JsonResponse({'error': str(e)})
 

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_diagnosis_patient_appointment_details(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         doctor_id = request.GET.get('DoctorId', '')
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         User = request.GET.get('User', '')


 
#         # Start with all records
#         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='RADIOLOGY').order_by('-created_at')

#         # Apply filters based on the query parameters
#         if query:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
#                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
#                 Q(Registration_Id__PatientId_SurName_icontains=query) |
#                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
#                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
#             )
#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])
 
#         # Particular date filter
#         elif particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)
       
#         # Current Date filter (Ensure it's a valid date)
#         elif Current_date and Current_date != "":  
#             queryset = queryset.filter(created_at__date=Current_date)
 
#         # Filter by DoctorId
#         if not doctor_id:
#              pass
#         else:
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
#         # Filter by status if specified
#         if status:
#             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
#         else:
#             # Exclude 'Cancelled' status if no status is specified
#             queryset = queryset.exclude(Registration_Id__Status='Cancelled')
        
#         # if User not in ['host','admin']:
#         #     queryset = queryset.filter(Registration_Id__created_by=User)

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_Rad_count = 0
#         monthly_total_Rad_count = 0
#         yearly_total_Rad_count = 0

#         if User not in ['host','admin']: 

#             today_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,created_by=User,VisitPurpose="RADIOLOGY").count()

#             monthly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 VisitPurpose="RADIOLOGY",
                
#             ).count()

#             yearly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 VisitPurpose="RADIOLOGY",
              
#             ).count() 

#         else :

#             today_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,VisitPurpose="RADIOLOGY",).count()

#             monthly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 VisitPurpose="RADIOLOGY",

#             ).count()

#             yearly_total_Rad_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 VisitPurpose="RADIOLOGY",

#             ).count() 




       
#         # Serialize the filtered queryset
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=1):
 
#             # testdetails = Radiology_Request_Details.objects.filter(OP_Register_Id=register.Registration_Id,Status='Request')
#             # testlist = []
#             # for datas in testdetails:
#             #     Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
#             #     Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()
 
#             #     datalist={
#             #         'RadiologyName' : Dep.Radiology_Name,
#             #         'Radiologyid': Dep.Radiology_Id,
#             #         'TestCode':Test.Test_Code,
#             #         'TestName': Test.Test_Name
 
#             #     }
#             #     testlist.append(datalist)
           
#             # Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
#             # Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
           
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
#                 'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
#                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
#                 'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
               
#                 'Complaint': register.Complaint,
#                 'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
#                 'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
 
#                 'VisitType': register.VisitType,
#                 'Complaint': register.Complaint,
#                 # 'Flagging': Flagging_name,
#                 # 'FlaggingColour': Flagging_color,
#                 'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
#                 'Status': register.Registration_Id.Status if register.Registration_Id else '',
#                 'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
#                 'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
#                 'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',

               
#                 'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
#                 'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
#                 'DoctorName': (
#                     f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
#                     f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
#                     f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
#                 ),
 
#                 # 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor.Tittle else None}.{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} {register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}",
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 'Raddocid' : register.pk,
#                 'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",

#                 # 'testlist':testlist
#             }
#             appointment_register_data.append(appointment_dict)
 
 
 
 
 
 
#         return JsonResponse(
#             {
#                 'appointments': appointment_register_data,
#                 'today_total_Rad_count': today_total_Rad_count,
#                 'monthly_total_Rad_count': monthly_total_Rad_count,
#                 'yearly_total_Rad_count': yearly_total_Rad_count
#             }, safe=False)
 

#     except Exception as e:
#         return JsonResponse({'error': str(e)})
 


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
        dateOption = request.GET.get('dateOption')


        showFake = request.GET.get('showFake')
        showCheckbox = request.GET.get('showCheckbox')

        chosenspeciality = request.GET.get('chosenspeciality')
        chosenspecdoc = request.GET.get('chosenspecdoc')

        today = date.today()
        current_year = today.year
        current_month = today.month

        today_total_Lab_count = 0
        monthly_total_Lab_count = 0
        yearly_total_Lab_count = 0
 
        # Start with all records
        queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='LAB').order_by('-created_at')
        print(queryset,'premmmmmmmmmmmm')
       
        if status:
            queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
        else:
            # Exclude 'Cancelled' status if no status is specified
            queryset = queryset.exclude(Registration_Id__Status='Cancelled')

        if query:
            queryset = queryset.filter(
                Q(Registration_Id__PatientId_FirstName_icontains=query) |
                Q(Registration_Id__PatientId_MiddleName_icontains=query) |
                Q(Registration_Id__PatientId_SurName_icontains=query) |
                Q(Registration_Id__PatientId_PatientId_icontains=query) |
                Q(Registration_Id__PatientId_PhoneNo_icontains=query)
            )
        if from_date and to_date:
            queryset = queryset.filter(Registration_Id__created_at__date__range=[from_date, to_date])
 
        # Particular date filter
        if particular_date:
            queryset = queryset.filter(Registration_Id__created_at__date=particular_date)
       
        # Current Date filter (Ensure it's a valid date)
        if Current_date and dateOption !="all":  
            queryset = queryset.filter(Registration_Id__created_at__date=Current_date)

        if showFake == 'true' and showCheckbox == 'true':

            print('fakekkkkk')
            queryset = queryset.filter(Q(Registration_Id__VisitPurpose="LAB") & (Q(Registration_Id__Registration_Id__startswith="FOP"))).order_by('-created_at')
            
            today_total_Lab_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="LAB").count()
            
            monthly_total_Lab_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="LAB",
            ).count()

            yearly_total_Lab_count = queryset.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="LAB",
            ).count()

            print(queryset.count())

        elif showCheckbox == 'true' and showFake == 'false':

            print('originallllllllll')
            queryset = queryset.filter(Q(Registration_Id__VisitPurpose="LAB") & (Q(Registration_Id__Registration_Id__startswith="OP"))).order_by('-created_at')
            print(queryset.count())

            today_total_Lab_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="LAB").count()
            
            monthly_total_Lab_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="LAB",
            ).count()

            yearly_total_Lab_count = queryset.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="LAB",
            ).count()

        elif showCheckbox == 'false':

            print('combineeeeeeeeee')
            queryset = queryset.filter(Registration_Id__VisitPurpose="LAB").order_by('-created_at')
            print(queryset.count())

            today_total_Lab_count = queryset.filter(created_at__date=today,Registration_Id__VisitPurpose="LAB").count()
            
            monthly_total_Lab_count = queryset.filter(
                created_at__year=current_year,
                created_at__month=current_month,
                Registration_Id__VisitPurpose="LAB",
            ).count()

            yearly_total_Lab_count = queryset.filter(
                created_at__year=current_year,
                Registration_Id__VisitPurpose="LAB",
            ).count()


    
   
        appointment_register_data = []
        for idx, register in enumerate(queryset, start=1):

            lab_details = MCI_Lab_Request_Details.objects.filter(OP_Register_Id = register.Registration_Id)
            testlist = []
            for lab in lab_details:

                labRequestId = lab.Request_Id
 
                item = MCI_Lab_Request_Items_Details.objects.filter(Request = lab.Request_Id)
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
                'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",
                'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
                'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',
                # 'LabrequestID': labRequestId,
                'testlist':testlist,

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
 


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_lab_patient_appointment_details(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         doctor_id = request.GET.get('DoctorId', '')
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         User = request.GET.get('User', '')

#         showFake = request.GET.get('showFake')
#         showCheckbox = request.GET.get('showCheckbox')
 
#         # Start with all records
#         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose='LAB').order_by('-created_at')
       


        
#         # Apply filters based on the query parameters
#         if query:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId_FirstName_icontains=query) |
#                 Q(Registration_Id__PatientId_MiddleName_icontains=query) |
#                 Q(Registration_Id__PatientId_SurName_icontains=query) |
#                 Q(Registration_Id__PatientId_PatientId_icontains=query) |
#                 Q(Registration_Id__PatientId_PhoneNo_icontains=query)
#             )
#         if from_date and to_date:
#             queryset = queryset.filter(Registration_Id__created_at__date__range=[from_date, to_date])
 
#         # Particular date filter
#         elif particular_date:
#             queryset = queryset.filter(Registration_Id__created_at__date=particular_date)
       
#         # Current Date filter (Ensure it's a valid date)
#         elif Current_date and Current_date != "":  
#             queryset = queryset.filter(Registration_Id__created_at__date=Current_date)
 
#         # Filter by DoctorId
#         if not doctor_id:
#              pass
#         else:
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)
#         # Filter by status if specified
#         if status:
#             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))
#         else:
#             # Exclude 'Cancelled' status if no status is specified
#             queryset = queryset.exclude(Registration_Id__Status='Cancelled')
        
#         if User not in ['host','admin']:
#             queryset = queryset.filter(Registration_Id__created_by=User)

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_Lab_count = 0
#         monthly_total_Lab_count = 0
#         yearly_total_Lab_count = 0

#         if User not in ['host','admin']: 

#             today_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,created_by=User,VisitPurpose="LAB").count()

#             monthly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 VisitPurpose="LAB",
#             ).count()

#             yearly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 VisitPurpose="LAB",
#             ).count() 

#         else :

#             today_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today,VisitPurpose="LAB",).count()

#             monthly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month,
#                 VisitPurpose="LAB",

#             ).count()

#             yearly_total_Lab_count = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                 created_at__year=current_year,
#                 VisitPurpose="LAB",

#             ).count() 


       
#         # Serialize the filtered queryset
   
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=1):
 
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.Registration_Id.PatientId.Patient_profile) if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Patient_profile else None,
#                 'PatientId': register.Registration_Id.PatientId.PatientId if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'PatientName': f"{register.Registration_Id.PatientId.Title.Title_Name if register.Registration_Id and register.Registration_Id.PatientId and register.Registration_Id.PatientId.Title else ''}.{register.Registration_Id.PatientId.FirstName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.MiddleName if register.Registration_Id and register.Registration_Id.PatientId else ''} {register.Registration_Id.PatientId.SurName if register.Registration_Id and register.Registration_Id.PatientId else ''}",
#                 'PhoneNo': register.Registration_Id.PatientId.PhoneNo if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Age': register.Registration_Id.PatientId.Age if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'Gender': register.Registration_Id.PatientId.Gender if register.Registration_Id and register.Registration_Id.PatientId else '',
#                 'AppointmentId': register.Registration_Id.AppointmentId if register.Registration_Id else '',
#                 'VisitId': register.Registration_Id.VisitId if register.Registration_Id else '',
#                 'Complaint': register.Complaint,
#                 'created_by': register.Registration_Id.created_by if register.Registration_Id else '',
#                 'isMLC': register.Registration_Id.IsMLC if register.Registration_Id else '',
#                 'VisitType': register.VisitType,
#                 'isRefferal': register.Registration_Id.IsReferral if register.Registration_Id else '',
#                 'Status': register.Registration_Id.Status if register.Registration_Id else '',
#                 'RegistrationId': register.Registration_Id.pk if register.Registration_Id else '',
#                 'DoctorId': register.PrimaryDoctor.pk if register.PrimaryDoctor else None,
#                 'SpecilizationId': register.Specialization.Speciality_Id if register.Specialization else None,
#                 'DoctorName': (
#                     f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
#                     f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
#                     f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
#                 ),
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 'Labdocid': register.pk,
#                 'Address': f"{register.Registration_Id.PatientId.PermanentdoorNo} {register.Registration_Id.PatientId.PermanentStreet} {register.Registration_Id.PatientId.PermanentArea} {register.Registration_Id.PatientId.PermanentCity}",
#                 'registeridbarcode': register.Registration_Id.Registration_Id if register.Registration_Id else '',
#                 'createdat' : register.Registration_Id.created_at if register.Registration_Id else '',


#             }
#             appointment_register_data.append(appointment_dict)
 

#         return JsonResponse(
#             {
#                 'appointments': appointment_register_data,
#                 'today_total_Lab_count': today_total_Lab_count,
#                 'monthly_total_Lab_count': monthly_total_Lab_count,
#                 'yearly_total_Lab_count': yearly_total_Lab_count
#             }, safe=False)
 
#     except Exception as e:
#         return JsonResponse({'error':str(e)})
 
 

@csrf_exempt
@require_http_methods(["GET"])
def Overall_OP_patients_List(request):
    try:
        # Get query parameters

       
        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')

 
        today = date.today()
        current_year = today.year
        current_month = today.month

        today_total_OP_count = 0
        monthly_total_OP_count = 0
        yearly_total_OP_count = 0


        today_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(created_at__date=today).count()

        monthly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,
                created_at__month=current_month,

            ).count()

        yearly_total_OP_count = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__year=current_year,

            ).count() 
    

          
        return JsonResponse({
            'today_total_OP_count': today_total_OP_count,
            'monthly_total_OP_count': monthly_total_OP_count,
            'yearly_total_OP_count': yearly_total_OP_count
        }, safe=False)

        # return JsonResponse(appointment_register_data, safe=False)
    
 
    except Exception as e:
        return JsonResponse({'error': str(e)})


 
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.db.models import Q
# from datetime import date

# @csrf_exempt
# @require_http_methods(["GET"])
# def Total_OP_patients_List(request):
#     try:
#         # Get query parameters
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         doctor_id = request.GET.get('DoctorId', '')
#         Doctor = request.GET.get('Doctor', '')
#         dateOption = request.GET.get('dateOption', '')  # all, current
#         from_date = request.GET.get('fromDate', '')
#         to_date = request.GET.get('toDate', '')
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         VisitPurpose = request.GET.get('VisitPurpose', '')
#         User = request.GET.get('User', '')
#         showFake = request.GET.get('showFake', '')
#         showCheckbox = request.GET.get('showCheckbox', '')
#         chosenspeciality = request.GET.get('chosenspeciality', '')
#         chosenspecdoc = request.GET.get('chosenspecdoc', '')
        
#         # Pagination parameters
#         limit = int(request.GET.get('limit', 10))  # Default to 10 if not provided
#         offset = int(request.GET.get('offset', 0))  # Default to 0 if not provided

#         today = date.today()
#         current_year = today.year
#         current_month = today.month

#         today_total_OP_count = 0
#         monthly_total_OP_count = 0
#         yearly_total_OP_count = 0

#         # Base queryset
#         queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#             Registration_Id__VisitPurpose='OP'
#         ).order_by('-created_at')

#         print(queryset.count(),'queryset1111111')

#         # Apply filters
#         if status:
#             queryset = queryset.filter(Q(Registration_Id__Status__icontains=status))

#             print(queryset.count(),'status')
#         else:
#             queryset = queryset.exclude(Registration_Id__Status='Cancelled')

#         if query:
#             queryset = queryset.filter(
#                 Q(Registration_Id__PatientId__FirstName__icontains=query) |
#                 Q(Registration_Id__PatientId__MiddleName__icontains=query) |
#                 Q(Registration_Id__PatientId__SurName__icontains=query) |
#                 Q(Registration_Id__PatientId__PatientId__icontains=query) |
#                 Q(Registration_Id__PatientId__PhoneNo__icontains=query)
#             )

#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])

#         if particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)

#         if Current_date and dateOption != "all":
#             queryset = queryset.filter(created_at__date=Current_date)


#         if chosenspeciality:
#             queryset = queryset.filter(Specialization__Speciality_Id=chosenspeciality)

#         if chosenspecdoc:
#             queryset = queryset.filter(PrimaryDoctor__Doctor_ID=chosenspecdoc)

#         # Handle showFake and showCheckbox logic
#         if showFake == 'true' and showCheckbox == 'true':
#             queryset = queryset.filter(
#                 Q(Registration_Id__VisitPurpose="OP") &
#                 Q(Registration_Id__Registration_Id__startswith="FOP")
#             ).order_by('-created_at')
#             today_total_OP_count = queryset.filter(created_at__date=today).count()
#             monthly_total_OP_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month
#             ).count()
#             yearly_total_OP_count = queryset.filter(created_at__year=current_year).count()

#         elif showCheckbox == 'true' and showFake == 'false':
#             queryset = queryset.filter(
#                 Q(Registration_Id__VisitPurpose="OP") &
#                 Q(Registration_Id__Registration_Id__startswith="OP")
#             ).order_by('-created_at')
#             today_total_OP_count = queryset.filter(created_at__date=today).count()
#             monthly_total_OP_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month
#             ).count()
#             yearly_total_OP_count = queryset.filter(created_at__year=current_year).count()

#         elif showCheckbox == 'false':
#             queryset = queryset.filter(Registration_Id__VisitPurpose="OP").order_by('-created_at')
#             today_total_OP_count = queryset.filter(created_at__date=today).count()
#             monthly_total_OP_count = queryset.filter(
#                 created_at__year=current_year,
#                 created_at__month=current_month
#             ).count()
#             yearly_total_OP_count = queryset.filter(created_at__year=current_year).count()


#         # Get total count before pagination
#         total_count = queryset.count()

#         # Apply pagination
#         queryset = queryset[offset:offset + limit]

#         # Serialize the filtered queryset
#         appointment_register_data = []
#         for idx, register in enumerate(queryset, start=offset + 1):
#             patient = register.Registration_Id.PatientId
#             registerid = register.Registration_Id

#             formatted_bdate = register.created_at.strftime('%d-%m-%y')

#             # Create dictionary with fallback values
#             appointment_dict = {
#                 'id': idx,
#                 'Edit': 'Yes',
#                 'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
#                 'PatientId': patient.PatientId,
#                 'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
#                 'PhoneNo': patient.PhoneNo,
#                 'Age': patient.Age,
#                 'Gender': patient.Gender,
#                 'AppointmentId': registerid.AppointmentId,
#                 'VisitId': registerid.VisitId,
#                 'isMLC': registerid.IsMLC,
#                 'VisitType': register.VisitType if register else '',
#                 'isRefferal': registerid.IsReferral,
#                 'Status': registerid.Status,
#                 'created_by': registerid.created_by if registerid else '',
#                 'RegistrationId': registerid.pk,
#                 'fathername': patient.FatherName or '',
#                 'DoorNo': patient.PermanentdoorNo or patient.DoorNo or '',
#                 'Street': patient.PermanentStreet or patient.Street or '',
#                 'Area': patient.PermanentArea or patient.Area or '',
#                 'City': patient.PermanentCity or patient.City or '',
#                 'District': patient.PermanentDistrict or patient.District or '',
#                 'State': patient.PermanentState or patient.State or '',
#                 'Country': patient.PermanentCountry or patient.Country or '',
#                 'Pincode': patient.PermanentPincode or patient.Pincode or '',
#                 'TokenNo': register.TokenNo,
#                 'Address': f"{patient.Street} {patient.Area}",
#                 'created_at': formatted_bdate,
#                 'registeridbarcode': register.Registration_Id.Registration_Id,
#                 'DoctorName': (
#                     f"{register.PrimaryDoctor.Tittle.Title_Name if register and register.PrimaryDoctor and register.PrimaryDoctor.Tittle else ''}."
#                     f"{register.PrimaryDoctor.First_Name if register and register.PrimaryDoctor else ''} "
#                     f"{register.PrimaryDoctor.Last_Name if register and register.PrimaryDoctor else ''}"
#                 ).strip(),
#                 'Specilization': str(register.Specialization.Speciality_Name) if register and register.Specialization else '',
#                 'Multiple_Doc': []  # Empty list for multiple doctors
#             }

#             appointment_register_data.append(appointment_dict)

#         # Return paginated response with total count
#         return JsonResponse({
#             'appointments': appointment_register_data,
#             'total_count': total_count,
#             'today_total_OP_count': today_total_OP_count,
#             'monthly_total_OP_count': monthly_total_OP_count,
#             'yearly_total_OP_count': yearly_total_OP_count
#         }, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET","POST"])
def Fake_IPPatient_Discharge(request):

    try:

        if request.method == "POST":

            data = json.loads(request.body)

            RegistrationId = data.get('RegistrationId','')
            RoomId = data.get('RoomId')
            WardId = data.get('WardId')
            createdby = data.get('createdby')

            today = date.today()

            print(today,'today',RegistrationId)

            Ipregins = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=RegistrationId).first()


          
            if Ipregins:

                Discharegins = MCI_Patient_Discharge_Detials(
                    Registration_Id = Ipregins,
                    Discharge_Date = today,
                    created_by = createdby
                )

                Discharegins.save()

                Ipregins.Status = 'Completed'
                Ipregins.DischargeDate = Discharegins.Discharge_Date
                Ipregins.Booking_Status = 'Vacated'
                Ipregins.save()

                roomdatas = MCI_Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__IPNo = Ipregins.IPNo)                
                print(roomdatas,'roomdatas')
                for rdata in roomdatas:

                    rdata.IsStayed = False
                    rdata.CurrentlyStayed = False
                    rdata.save()

                    if rdata.RoomId:

                        print(rdata.RoomId,'rdata.RoomId')
                        print(rdata.RoomId.Room_Id,'rdata.RoomId')


                        roomins = MCI_Room_Master_Detials.objects.filter(Room_Id=rdata.RoomId.Room_Id).first()
                        print(roomins,'roomins')
                        roomins.Booking_Status= 'Available'
                        roomins.save()


            return JsonResponse({'success':' Discharge  details saved successfully'})


    except Exception as e:
            return JsonResponse({"error":str(e)})











@csrf_exempt
@require_http_methods(['GET'])
def get_sample(request):
    try:
        pat = MCI_Patient_IP_Registration_Detials.objects.filter(Status='Admitted')

        dat = []


        for d in pat:
            dat.append(
                {
                    'Registration_Id':d.Registration_Id,
                    'IPNo':d.IPNo,
                    'Specialization':d.Specialization.Speciality_Name,
                    'Registration_Id':d.IsReferral,
                }
            )

        return JsonResponse(data=dat,safe=False)        
    except Exception as e:
        return JsonResponse({'err':str(e)},status=500)       

 
@csrf_exempt
@require_http_methods(["GET"])
def get_MCI_IP_Registration_edit_details(request):
    try:
        RegistrationId = request.GET.get('RegistrationId', None)
        # RegistrationType = request.GET.get('RegistrationType', None)
        print(RegistrationId,'RegistrationId3333333333')
        IP_Patient = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo = RegistrationId).first() if RegistrationId else None
        admission_instance = MCI_Patient_Admission_Detials.objects.filter(IP_Registration_Id__IPNo = RegistrationId).first() if RegistrationId else None
        admission_room_instance = MCI_Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__IPNo = RegistrationId).first() if RegistrationId else None
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
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_MCI_OP_patient_details(request):
    try:
       
        RegistrationId = request.GET.get('RegistrationId').strip()
       
        print(RegistrationId,'RegistrationId')
        # Start with all records
 
        try:
            queryset = MCI_Patient_Appointment_Registration_Detials.objects.filter(OPNo = RegistrationId).first()
 
        except Exception as e:
            print(str(e),'findddddddddd')
        print(queryset,'querysetttttttttttt')
       
        referral_details = None
 
       
           
        appointment_dict = {
           
            'PatientProfile': get_file_image(queryset.PatientId.Patient_profile) if queryset.PatientId.Patient_profile else None,
            'PatientId': queryset.PatientId.PatientNo,
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
        multiple_doc_records = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__OPNo = RegistrationId)
 
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
 
 

 
 
  