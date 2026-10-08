
import base64
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  *
import filetype
from Frontoffice.models import Patient_Admission_Room_Detials, Patient_IP_Registration_Detials
from Ip_Workbench.models import IP_Assesment_Details
from django.utils.timezone import now
from Ip_Workbench.models import *
from django.db.models import Avg

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
def get_ip_Patient_registration_details_for_QA_Indicator(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        DoctorId = request.GET.get('DoctorId', '')

        from_date = request.GET.get('fromDate', '')  
        to_date = request.GET.get('toDate', '')  
        particular_date = request.GET.get('ParticularDate', '')
        Current_date = request.GET.get('CurrentDate', '')

 
        # Map status to Booking_Status
        Booking_Status = 'Booked' if status == 'Pending' else ('Occupied' if status == 'Admitted' else 'Cancelled')
       
       
        queryset = Patient_IP_Registration_Detials.objects.all()
       
        print(queryset,'queryset')


       
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )
            # .filter(Booking_Status=Booking_Status)
       
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__pk = DoctorId)
       
 
        # if status:
        #     queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)
        
        if Booking_Status:
            queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)
        
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])

        # Particular date filter
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        
        # Current Date filter (Ensure it's a valid date)
        elif Current_date and Current_date != "":  
            queryset = queryset.filter(created_at__date=Current_date)
    

        # Serialize the filtered queryset
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
                'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'isRefferal': register.IsReferral,
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                
            }
 
            
            if register.Booking_Status in ['Booked', 'Occupied']:
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
 
        return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(["GET"])
def get_all_patients_time_comparison(request):
    try:
        from_date = request.GET.get('fromDate')
        to_date = request.GET.get('toDate')
        specific_date = request.GET.get('date')

        average_time_result = IPQATimingMaster.objects.filter(process='Registration to Assessment Time').aggregate(Avg('average_time'))
        average_time_in_minutes = average_time_result['average_time__avg']

        if average_time_in_minutes is None:
            return JsonResponse({"error": "No average time found in QATimingMaster"}, status=404)

        processed_registration_ids = set()
        registrations = Patient_IP_Registration_Detials.objects.all()

        # Apply date filters
        if specific_date:
            registrations = registrations.filter(created_at__date=specific_date)
        elif from_date and to_date:
            registrations = registrations.filter(created_at__date__range=[from_date, to_date])

        time_comparisons = []

        for registration in registrations:
            registration_id = registration.PatientId.PatientId
            if registration_id in processed_registration_ids:
                continue

            processed_registration_ids.add(registration_id)

            try:
                ip_assessment = IP_Assesment_Details.objects.get(Ip_Registration_Id=registration)
                time_difference = ip_assessment.created_at - registration.created_at
                time_difference_in_minutes = time_difference.total_seconds() / 60
                status = time_difference_in_minutes <= average_time_in_minutes

                time_comparisons.append({
                    'Registration_Id': registration_id,
                    'TimeDifferenceInMinutes': time_difference_in_minutes,
                    'AverageTimeInMinutes': average_time_in_minutes,
                    'assessment_time_status': status,
                    'initial_assessment_completion_rate': status,
                    'avg_time_initial_assessment': status,
                    'emergency_assessment_completion_rate': status,
                    'Status': status,
                })

            except IP_Assesment_Details.DoesNotExist:
                time_comparisons.append({
                    'Registration_Id': registration_id,
                    'AverageTimeInMinutes': average_time_in_minutes,
                    'Error': 'Assessment not found',
                    'Status': False
                })

        return JsonResponse(time_comparisons, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
@require_http_methods(["GET"])
def get_IP_patients_fro_QA_1(request):
    if request.method == 'GET':
        try:
            IP_datas = []
            from_date = request.GET.get('fromDate')
            to_date = request.GET.get('toDate')
            specific_date = request.GET.get('date')

            registrations = Patient_IP_Registration_Detials.objects.all()

            # Apply date filters
            if specific_date:
                registrations = registrations.filter(created_at__date=specific_date)
            elif from_date and to_date:
                registrations = registrations.filter(created_at__date__range=[from_date, to_date])

            distinct_patient_ids = registrations.values('PatientId_id').distinct()

            for reg in distinct_patient_ids:
                patient_id = reg['PatientId_id']

                is_vap_rate = IP_VentilatorSettings_Details.objects.filter(Ip_Registration_Id__PatientId_id=patient_id).exists()
                is_sur_rate = IP_SurgicalHistory_Details.objects.filter(Ip_Registration_Id__PatientId_id=patient_id).exists()

                IP_datas.append({
                    'Registration_Id': patient_id,
                    'Ventilator-associated-pneumonia-(VAP)-rate': is_vap_rate,
                    'Central-line-catheter-associated-blood-stream-infection-(CA-BSI)-rate': True,
                    'Surgical-site-infection-(SSI)-rate': is_sur_rate,
                    'Net-mortality-rate': True,
                    'Re-intubation-rate': True,
                    'Error-rates-during-shift-hand-overs': True,
                })

            return JsonResponse({'status': 'success', 'data': IP_datas}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"error": "invalid request"})
@csrf_exempt
@require_http_methods(["GET"])
def get_IP_patients_fro_QA_2(request):
    if request.method == 'GET':
        try:
            IP_datas = []
            from_date = request.GET.get('fromDate')
            to_date = request.GET.get('toDate')
            specific_date = request.GET.get('date')

            registrations = Patient_IP_Registration_Detials.objects.all()

            # Apply date filters
            if specific_date:
                registrations = registrations.filter(created_at__date=specific_date)
            elif from_date and to_date:
                registrations = registrations.filter(created_at__date__range=[from_date, to_date])

            distinct_patient_ids = registrations.values('PatientId_id').distinct()

            for reg in distinct_patient_ids:
                patient_id = reg['PatientId_id']
                IP_datas.append({
                    'Registration_Id': patient_id,
                    'LabReportsVsClinicalDiagnosis': True,
                    'AdverseDrugReactions': True,
                    'HighRiskDrugReactions': True,
                    'ErrorProneAbbreviations': True,
                    'ProphylacticAntibioticCompliance': True,
                    'TransfusionReactions': True,
                })

            return JsonResponse({'status': 'success', 'data': IP_datas}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"error": "invalid request"})
@csrf_exempt
@require_http_methods(["GET"])
def get_IP_patients_fro_QA_3(request):
    if request.method == 'GET':
        try:
            IP_datas = []
            from_date = request.GET.get('fromDate')
            to_date = request.GET.get('toDate')
            specific_date = request.GET.get('date')

            registrations = Patient_IP_Registration_Detials.objects.all()

            # Apply date filters
            if specific_date:
                registrations = registrations.filter(created_at__date=specific_date)
            elif from_date and to_date:
                registrations = registrations.filter(created_at__date__range=[from_date, to_date])

            distinct_patient_ids = registrations.values('PatientId_id').distinct()

            for reg in distinct_patient_ids:
                patient_id = reg['PatientId_id']
                IP_datas.append({
                    'Registration_Id': patient_id,
                    'WrongPatientIdentification': True,
                    'HandHygieneCompliance': True,
                    'CapitalPrescriptionCompliance': True,
                    'PatientFallRate': True,
                    'PressureUlcerRate': True,
                    'BedOccupancyRate': True,
                })

            return JsonResponse({'status': 'success', 'data': IP_datas}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"error": "invalid request"})

@csrf_exempt
@require_http_methods(["GET"])
def get_IP_patients_fro_QA_4(request):
    if request.method == 'GET':
        try:
            IP_datas = []
            from_date = request.GET.get('fromDate')
            to_date = request.GET.get('toDate')
            specific_date = request.GET.get('date')

            registrations = Patient_IP_Registration_Detials.objects.all()

            # Apply date filters
            if specific_date:
                registrations = registrations.filter(created_at__date=specific_date)
            elif from_date and to_date:
                registrations = registrations.filter(created_at__date__range=[from_date, to_date])

            distinct_patient_ids = registrations.values('PatientId_id').distinct()

            for reg in distinct_patient_ids:
                patient_id = reg['PatientId_id']
                IP_datas.append({
                    'Registration_Id': patient_id,
                    'AverageLengthOfStay': True,
                    'WardNursePatientRatio': True,
                    'ICUNursePatientRatio': True,
                    'InPatientSatisfactionIndex': True,
                    'AverageWaitingTime': True,
                    'AverageDischargeTime': True,
                })

            return JsonResponse({'status': 'success', 'data': IP_datas}, status=200)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({"error": "invalid request"})

   
@csrf_exempt
@require_http_methods(["GET"])
def get_IP_patients_fro_QA_5(request):
    if request.method == 'GET':
        try:
            IP_datas = []
            from_date = request.GET.get('fromDate')
            to_date = request.GET.get('toDate')
            specific_date = request.GET.get('date')

            registrations = Patient_IP_Registration_Detials.objects.all()

            # Apply date filters
            if specific_date:
                registrations = registrations.filter(created_at__date=specific_date)
            elif from_date and to_date:
                registrations = registrations.filter(created_at__date__range=[from_date, to_date])

            distinct_patient_ids = registrations.values('PatientId_id').distinct()

            for reg in distinct_patient_ids:
                patient_id = reg['PatientId_id']
                IP_datas.append({
                    'Registration_Id': patient_id,
                    'NearMissesPercentage': True,
                    'NeedlestickInjuryRate': True,
                    'MissingDischargeSummary': True,
                    'MissingICDCodes': True,
                    'ImproperConsentRecords': True,
                    'CarePlanDocumentationRate': True,
                    'NutritionalScreeningRate': True,
                })

            return JsonResponse({'status': 'success', 'data': IP_datas}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"error": "invalid request"})
