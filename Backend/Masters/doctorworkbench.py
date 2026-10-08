from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from .models import *
import base64
import json
# import magic
from django.db.models import Count
from Frontoffice.models import Patient_Appointment_Registration_Detials,OP_Patient_Appointment_With_Multiple_Doctor
import json
from django.utils import timezone
from django.db.models import Q
 
from Masters.models import *
# from datetime import datetime ,timezone
from django.db.models.functions import TruncDate
 
from .models import Doctor_Personal_Form_Detials
from django.utils.timezone import now
import pytz
from dateutil.parser import parse
 




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def OpDoctor_Details_link(request):
    if request.method == 'GET':
        try:
            # Fetch doctors with DoctorType 'InHouse'
            inhouse_doctors = Doctor_Personal_Form_Detials.objects.filter(DoctorType='InHouse').values('Doctor_ID', 'DoctorType', 'ShortName')
            # Fetch doctors with DoctorType 'Visiting'
            visiting_doctors = Doctor_Personal_Form_Detials.objects.filter(DoctorType='Visiting').values('Doctor_ID', 'DoctorType', 'ShortName')

            # Function to get patient counts for a doctor
            def get_patient_counts(doctor_id):
                registered_count = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=doctor_id, Status='Registered').count()
                consulted_count = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=doctor_id, Status='Completed').count()
                new_consultation_count = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=doctor_id, VisitPurpose='NewConsultation').count()
                followup_count = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=doctor_id, VisitPurpose='FollowUp').count()
                return {
                    'registered_patient_count': registered_count,
                    'consulted_patient_count': consulted_count,
                    'new_consultation_count': new_consultation_count,
                    'followup_count': followup_count
                }

            # Create the response lists
            inhouse_doctors_list = [
                {
                    'Doctor_ID': doc['Doctor_ID'],
                    'DoctorType': doc['DoctorType'],
                    'Full_Name': doc['ShortName'],
                    **get_patient_counts(doc['Doctor_ID'])
                } for doc in inhouse_doctors
            ]

            visiting_doctors_list = [
                {
                    'Doctor_ID': doc['Doctor_ID'],
                    'DoctorType': doc['DoctorType'],
                    'Full_Name': doc['ShortName'],
                    **get_patient_counts(doc['Doctor_ID'])
                } for doc in visiting_doctors
            ]

            return JsonResponse({
                'success': True,
                'inhouse_doctors': inhouse_doctors_list,
                'visiting_doctors': visiting_doctors_list
            })
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor details not found for the provided doctor type'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


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
        queryset = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__VisitPurpose="OP").annotate(date_only=TruncDate('created_at'))
 
 
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




# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_appointment_details(request):
#     try:
#         doctor_id = request.GET.get('DoctorId') or request.GET.get('Doctor')
#         date = request.GET.get('date')
#         todate = request.GET.get('todate')
#         query = request.GET.get('query', '')
#         today = now().date()
#         print("date",date)
#         queryset = Patient_Appointment_Registration_Detials.objects.all()

#         if date and todate and not doctor_id and  not query:
#             queryset = queryset.filter(
#                 created_at__date__gte=date,  # Filter for appointments on or after 'date'
#                 created_at__date__lte=todate  # Filter for appointments on or before 'todate'
#             )
#         elif date and todate and query and not doctor_id:
#             queryset = queryset.filter(
#                 created_at__date=date,
#                 created_at__date__lte=todate
#             ).filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             )
#         elif date and todate and query and doctor_id:
#             queryset = queryset.filter(
#                 PrimaryDoctor__pk=doctor_id,
#                 created_at__date=date,
#                 created_at__date__lte=todate
#             ).filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             )


        

#         elif query and not doctor_id and not date and not todate:
#             queryset = queryset.filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             )
        
#         # Handle filtering by date and query (but no doctor_id)
#         elif date and query and not doctor_id and not todate:
#             queryset = queryset.filter(
#                 created_at__date=date
#             ).filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             )

#         # Handle filtering by doctor_id, date, and query
#         elif date and query and doctor_id and not todate:
#             queryset = queryset.filter(
#                 PrimaryDoctor__pk=doctor_id,
#                 created_at__date=date
#             ).filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             )

#         # Handle filtering by doctor_id and date (no query)
#         elif doctor_id and date and not query and not todate:
#             print("doctor and date")
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id, created_at__date=date)

#         # Filter by date only if doctor_id and query are not provided
#         elif date and not doctor_id and not query and not todate:
#             print("date")
#             queryset = queryset.filter(created_at__date=date)

#         # Filter by doctor_id only if date and query are not provided
#         elif doctor_id and not date and not query and not todate:
#             queryset = queryset.filter(PrimaryDoctor__pk=doctor_id)

#         # If no filters are provided, show today's appointments
#         elif not doctor_id and not date and not query and not todate:
#             queryset = Patient_Appointment_Registration_Detials.objects.filter(created_at__date=today)
           
#         total_patients = queryset.count()
#         DocWisePatient = []
#         for idx, register in enumerate(queryset, start=1):
#             RegisterPatient = {
#                 'id': idx,
#                 'PatientId': register.PatientId.PatientId,
#                 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName or ''} {register.PatientId.SurName}",
#                 'PhoneNo': register.PatientId.PhoneNo,
#                 'Age': register.PatientId.Age,
#                 'Gender': register.PatientId.Gender,
#                 'VisitId': register.VisitId,
#                 'VisitType': register.VisitType,
#                 # 'Flagging': register.Flagging.Flagg_Name if register.Flagging else None,
#                 # 'FlaggingColour': register.Flagging.Flagg_Color if register.Flagging else None,
#                 'Status': register.Status,
#                 'RegistrationId': register.pk,
#                 'Specilization': register.Specialization.pk if register.Specialization else '',
#                 'Doctorid': register.PrimaryDoctor.Doctor_ID if register.PrimaryDoctor else None,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else None,
#                 'TotalPatientCount':total_patients if total_patients else 0 
#             }
#             DocWisePatient.append(RegisterPatient)

#         return JsonResponse(DocWisePatient, safe=False)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def OpPatients_Details_link(request):
    try:
        doctor_ids = request.GET.get("doctorIds")
        if not doctor_ids:
            return JsonResponse({'error': 'No doctor IDs provided'})

        doctor_ids_list = doctor_ids.split(',')
        print("Doctor IDs:", doctor_ids_list)

        # Get current date
        current_date = datetime.now().date()

        # Fetch patient details for each doctor
        patient_details_queryset = Patient_Appointment_Registration_Detials.objects.filter(
            created_at__date=current_date,
            PrimaryDoctor__Doctor_ID__in=doctor_ids_list
        ).select_related('PatientId', 'PrimaryDoctor', 'Specialization')

        # Prepare patient details list
        patient_details = []
        index = 0
        for patient in patient_details_queryset:
            patient_info = {
                'id': index + 1,
                'IsReferral': patient.IsReferral,
                'PatientCategory': patient.PatientCategory,
                'PatientId': patient.PatientId.PatientId,
                'PatientName': f"{patient.PatientId.FirstName} {patient.PatientId.MiddleName or ''} {patient.PatientId.SurName}".strip(),
                'PatientType': patient.PatientType,
                'PrimaryDoctor': patient.PrimaryDoctor.Doctor_ID,
                'Specialization': patient.Specialization.Speciality_Id if patient.Specialization else None,
                'Reason': patient.Reason,
                'Registration_Id': patient.Registration_Id,
                'Status': patient.Status,
                'VisitId': patient.VisitId,
                'VisitPurpose': patient.VisitPurpose,
                'created_at': patient.created_at,
                'created_by': patient.created_by,
                'updated_at': patient.updated_at
            }
            index += 1
            patient_details.append(patient_info)

        # Aggregate total patients per doctor
        doctor_patient_totals_queryset = Patient_Appointment_Registration_Detials.objects.filter(
            created_at__date=current_date,
            PrimaryDoctor__Doctor_ID__in=doctor_ids_list
        ).values('PrimaryDoctor__Doctor_ID').annotate(
            total_patients=Count('PatientId')
        )

        doctor_patient_totals = {detail['PrimaryDoctor__Doctor_ID']: detail['total_patients'] for detail in doctor_patient_totals_queryset}

        # Create response data
        response_data = {
            'doctor_patient_totals': doctor_patient_totals,
            'patients_details': patient_details
        }

        return JsonResponse(response_data, status=200)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@csrf_exempt
@require_http_methods(["POST"])
def StatusUpdate_Details_Patient_Reshedule(request):
    try:
        data = json.loads(request.body)
        print("Request data123:", data)
       
 
        # Extract required fields
        PatientId = data.get('newPatientId')
        VisitId = data.get('VisitId')
        registrationid = data.get('registrationid')
        speciality = data.get('speciality', None)
        doctorid = data.get('doctorname') or None
        print("doctoridreshedule",doctorid)
        reschedule_reason = data.get('Reshedulereason','')
        Status = data.get('Status')
        oldDoctorid = data.get('oldDoctorid')
        rescheduledDate = data.get('rescheduledDate')
 
        rescheduled_date = parse(rescheduledDate)
 
        rescheduled_date = rescheduled_date.replace(tzinfo=None)
 
 
        # rescheduled_date = datetime.strptime(rescheduledDate, "%Y-%m-%d %I:%M %p")
 
 
 
        # Validate required fields
        if not all([PatientId, VisitId, registrationid, reschedule_reason, Status]):
            return JsonResponse({'warn': 'All fields (PatientId, VisitId, registrationid, Reshedulereason, Status) are required.'})
 
 
 
        # Fetch doctor instance if provided
        doctor_instance = None
        if doctorid is not None:
            print("not none doctorid")
            try:
                print("766786")
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(pk=doctorid)
                print("doctor_instance",doctor_instance)
 
 
            except Doctor_Personal_Form_Detials.DoesNotExist:
                return JsonResponse({'warn': f"Doctor with ID '{doctorid}' does not exist."})
     
        # Fetch specialization instance if provided
        speciality_instance = None
        if speciality is not None:
            try:
                speciality_instance = Speciality_Detials.objects.get(pk=speciality)
            except Speciality_Detials.DoesNotExist:
                return JsonResponse({'warn': f"Specialization with ID '{speciality}' does not exist."})
 
        # Fetch patient record
        try:
            patient_instance = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=registrationid,
                PatientId__PatientId=PatientId,
                VisitId=VisitId
            )
 
 
 
            docins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=patient_instance,PrimaryDoctor=oldDoctorid).first()
            print("docinss",docins)
            docins.PrimaryDoctor=doctor_instance
            docins.Specialization =speciality_instance
            docins.ResheduleReason = reschedule_reason
            # docins.ResheduleTime = rescheduledDate
            docins.ResheduleTime = rescheduled_date
 
            docins.Status = Status
 
            docins.save()
           
            print("patient_instance",patient_instance)
        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'warn': f"No entry found with PatientId '{PatientId}' and VisitId '{VisitId}'."})
 
        # Update patient details
        patient_instance.ResheduleSpeciality = speciality_instance  # Assuming a ForeignKey
        patient_instance.ResheduleDoctor = doctor_instance  # Assuming a ForeignKey
        patient_instance.ResheduleReason = reschedule_reason
        patient_instance.ResheduleTime = rescheduled_date
        patient_instance.Status = Status
        patient_instance.save()
 
        return JsonResponse({'success': 'Patient rescheduled successfully'})
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["POST"])
def StatusUpdate_Details_Patient_Cancel(request):
    try:
        data = json.loads(request.body)
       

        # Extract fields
        PatientId = data.get('newPatientId')
        VisitId = data.get('VisitId')
        Status = data.get('Status')
        registrationid = data.get('registrationid')
        CancelReason = data.get('Cancelreason', None)

        if not all([PatientId, VisitId, Status, registrationid]):
            return JsonResponse({'error': 'All fields (PatientId, VisitId, Status, registrationid) are required.'})

        # Fetch the patient instance
        try:
            patient_instance = Patient_Appointment_Registration_Detials.objects.get(
                pk=registrationid, 
                PatientId__PatientId=PatientId, 
                VisitId=VisitId
            )
        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'warn': f"No entry found with PatientId '{PatientId}' and VisitId '{VisitId}'."})

        # Handle cancellation status
        if Status == 'Cancelled' and CancelReason:
            patient_instance.Status = Status
            patient_instance.CancelReason = CancelReason
            patient_instance.CancelTime = timezone.now()
            patient_instance.save()
            return JsonResponse({'success': 'Patient appointment cancelled successfully'})
        elif Status == 'Cancelled' and not CancelReason:
            return JsonResponse({'warn': 'CancelReason is required for cancellation.'})


    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def StatusUpdate_Details_Patient(request):
    try:
        data = json.loads(request.body)
        print("Request data:", data)
 
        # Extract and validate required fields
        PatientId = data.get('newPatientId')
        VisitId = data.get('VisitId')
        Status = data.get('Status')
        registrationid = data.get('registrationid')
        Doctorid = data.get('Doctorid')
 
        if not all([PatientId, VisitId, Status, registrationid,Doctorid]):
            return JsonResponse({'warn': 'All fields (PatientId, VisitId, Status, registrationid,Doctorid) are required.'})
 
        # Validate Status
        valid_statuses = ['InProgress', 'CheckOut', 'Completed']
        if Status not in valid_statuses:
            return JsonResponse({'warn': f'Invalid status. Allowed values: {valid_statuses}'})
 
        # Fetch the patient instance
        try:
            patient_instance = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=registrationid,
                PatientId__PatientId=PatientId,
                VisitId=VisitId
            )
            print("patient_instance", patient_instance)
        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'warn': f"No entry found with PatientId '{PatientId}' and VisitId '{VisitId}'."})
 
        # Update the status and ConsultingTime
        if Status == "InProgress":
            patient_instance.ConsultingTime = timezone.now()  # Use timezone-aware datetime
        elif Status == "CheckOut":
            patient_instance.CompletedTime = timezone.now()
        elif Status == "Completed":
            patient_instance.FinalCompletedTime = timezone.now()
 
        PrimaryDoctorins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=Doctorid).first()
 
        doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=patient_instance,PrimaryDoctor=PrimaryDoctorins)
 
        print(doc_ins,'doc_ins')
 
        for doc in doc_ins:
            doc.Status = Status
            doc.save()
 
        return JsonResponse({'success': 'Patient status updated successfully'})
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def Status_Duration_link(request):
    try:
        PatientId = request.GET.get('PatientId')
        VisitId = request.GET.get('VisitId')

        if not (PatientId and VisitId):
            return JsonResponse({'warn': 'PatientId and VisitId are required.'})

        try:
            patient_instance = Patient_Appointment_Registration_Detials.objects.get(PatientId=PatientId, VisitId=VisitId)
            
            if patient_instance.registered_at and patient_instance.consulted_at:
                duration = patient_instance.consulted_at - patient_instance.registered_at
                duration_seconds = duration.total_seconds()
                
                hours, remainder = divmod(duration_seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                
                return JsonResponse({
                    'duration': {
                        'hours': int(hours),
                        'minutes': int(minutes),
                        'seconds': int(seconds)
                    }
                })
            else:
                return JsonResponse({'error': 'Duration data not available'}, status=404)
        
        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': f"No entry found with PatientId '{PatientId}' and VisitId '{VisitId}'."}, status=404)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    
# Status_Patient_Details_link




@csrf_exempt
@require_http_methods(["GET"])
def Status_Patient_Details_link(request):
    if request.method == 'GET':
        try:
            doctor_id = request.GET.get("DoctorId")
            
            status = request.GET.get("Status")
            current_date = datetime.now().date()
            
            if doctor_id and status:
                # Adjust filtering based on how doctor_id is provided
                patient_details = Patient_Appointment_Registration_Detials.objects.filter(
                    created_at__date=current_date,
                    PrimaryDoctor__Doctor_ID=doctor_id,
                    Status=status
                ).select_related('PatientId', 'PrimaryDoctor', 'Specialization')
                
                status_patient_details = []
                for index, patient in enumerate(patient_details, start=1):
                    patient_info = {
                        'id': index,
                        'IsReferral': patient.IsReferral,
                        'PatientCategory': patient.PatientCategory,
                        'PatientId': patient.PatientId.PatientId,
                        'PatientName': f"{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}",
                        'PatientType': patient.PatientType,
                        'PrimaryDoctor': patient.PrimaryDoctor.Doctor_ID,
                        'Specialization': patient.Specialization.Speciality_Id,
                        'Reason': patient.Reason,
                        'Registration_Id': patient.Registration_Id,
                        'Status': patient.Status,
                        'VisitId': patient.VisitId,
                        'VisitPurpose': patient.VisitPurpose,
                        'created_at': patient.created_at,
                        'created_by': patient.created_by,
                        'updated_at': patient.updated_at
                    }
                    status_patient_details.append(patient_info)
                
                response_data = {
                    'patients_details': status_patient_details
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'error': 'DoctorId and Status are required.'}, status=400)
                
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    

@csrf_exempt
@require_http_methods(["GET"])
def Separated_Patient_Details_link(request):
    if request.method == 'GET':
        try:
            doctor_id = request.GET.get("DoctorId")
            current_date = datetime.now().date()
            
            if doctor_id:
                # Ensure doctor_id is handled correctly
                patient_details = Patient_Appointment_Registration_Detials.objects.filter(
                    created_at__date=current_date,
                    PrimaryDoctor__Doctor_ID=doctor_id
                ).select_related('PatientId', 'PrimaryDoctor', 'Specialization')
                
                status_patient_details = []
                for index, patient in enumerate(patient_details, start=1):
                    patient_info = {
                        'id': index,
                        'IsReferral': patient.IsReferral,
                        'PatientCategory': patient.PatientCategory,
                        'PatientId': patient.PatientId.PatientId,
                        'PatientName': f"{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}",
                        'PatientType': patient.PatientType,
                        'PrimaryDoctor': patient.PrimaryDoctor.Doctor_ID,
                        'Specialization': patient.Specialization.Speciality_Id,
                        'Reason': patient.Reason,
                        'Registration_Id': patient.Registration_Id,
                        'Status': patient.Status,
                        'VisitId': patient.VisitId,
                        'VisitPurpose': patient.VisitPurpose,
                        'created_at': patient.created_at,
                        'created_by': patient.created_by,
                        'updated_at': patient.updated_at
                    }
                    status_patient_details.append(patient_info)
                
                response_data = {
                    'patients_details': status_patient_details
                }
                return JsonResponse(response_data, status=200)
        
            else:
                return JsonResponse({'error': 'DoctorId is required.'}, status=400)
                
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
@require_http_methods(["GET"])
def VisitPurpose_Patient_Details_link(request):
    if request.method == 'GET':
        try:
            doctor_id = request.GET.get("DoctorId")
            print("doctor_idvisit",doctor_id)
            VisitPurpose = request.GET.get("VisitPurpose")
            print("VisitPurpose",VisitPurpose)
            current_date = datetime.now().date()
            
            if doctor_id and VisitPurpose:
                patient_details = Patient_Appointment_Registration_Detials.objects.filter(
                  created_at__date=current_date,
                  PrimaryDoctor__Doctor_ID=doctor_id,
                  VisitPurpose=VisitPurpose   
                ).select_related('PatientId', 'PrimaryDoctor', 'Specialization')
                
                visit_patient_details = []
                for index, patient in enumerate(patient_details, start=1):
                    patient_info = {
                        'id': index,
                        'IsReferral': patient.IsReferral,
                        'PatientCategory': patient.PatientCategory,
                        'PatientId': patient.PatientId.PatientId,
                        'PatientName': f"{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}",
                        'PatientType': patient.PatientType,
                        'PrimaryDoctor': patient.PrimaryDoctor.Doctor_ID,
                        'Specialization': patient.Specialization.Speciality_Id,
                        'Reason': patient.Reason,
                        'Registration_Id': patient.Registration_Id,
                        'Status': patient.Status,
                        'VisitId': patient.VisitId,
                        'VisitPurpose': patient.VisitPurpose,
                        'created_at': patient.created_at,
                        'created_by': patient.created_by,
                        'updated_at': patient.updated_at
                    }
                    visit_patient_details.append(patient_info)
                
                response_data = {
                    'patients_details': visit_patient_details
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'error': 'DoctorId and VisitPurpose are required.'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
     
            
            


@require_http_methods(["GET"])
def inhouse_doctor_details(request):
    try:
        # Get parameters
        Doctortype = request.GET.get("Doctortype")
        print("Doctortype",Doctortype)
        DoctorId = request.GET.get("DoctorID")
        print("DoctorId",DoctorId)

        # Ensure Doctortype is not None
        if not Doctortype:
            return JsonResponse({'error': 'Doctortype is required'}, status=400)

        # Build the filter condition
        filter_condition = Q(DoctorType=Doctortype)
        if DoctorId:
            filter_condition &= ~Q(Doctor_ID=DoctorId)  # Exclude the specific DoctorID

        # Fetch doctors based on the filter condition
        doctor_details = Doctor_Personal_Form_Detials.objects.filter(filter_condition)

        # Prepare response data
        inhouse_doctor_details = []
        for doctor in doctor_details:
            # Get the associated specialty name, if any
            specialization = doctor.doctor_professform_detials_set.first()
            speciality_name = specialization.Specialization.Speciality_Name if specialization else 'N/A'

            doctor_info = {
                'DoctorID': doctor.Doctor_ID,
                'FirstName': doctor.First_Name,
                'MiddleName': doctor.Middle_Name,
                'LastName': doctor.Last_Name,
                'ShortName': doctor.ShortName,
                'SpecialityName': speciality_name,
            }
            inhouse_doctor_details.append(doctor_info)
        
        # Return the response as JSON
        return JsonResponse( inhouse_doctor_details, safe=False)
    
    except Exception as e:
        # Log the exception
        print(f"Error: {e}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)  

