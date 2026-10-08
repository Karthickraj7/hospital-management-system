import json
from django.http import JsonResponse
from Frontoffice.models import Patient_Appointment_Registration_Detials
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
    
# @csrf_exempt
# @require_http_methods(["GET"])
# def get_patient_details_OP_for_QA(request):
#     if request.method == "GET":
#         try:
#             IP_details = []
#             appointments = Patient_Appointment_Registration_Detials.objects.values('PatientId_id').distinct()

#             for appointment in appointments:  
#                 IP_details.append({
                  
#                 'Registration_Id': appointment['PatientId_id'],
#                 'LabReportsVsClinicalDiagnosis': True,
#                 'AdverseDrugReactions': True,
#                 'HighRiskDrugReactions': True,
#                 'ErrorProneAbbreviations': True,
#                 'WrongPatientIdentificationErrors': True,
#                 'HandHygieneCompliance': True,
#                 })
            
#             return JsonResponse({"data": IP_details}, safe=False, status=200)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=400)
# from django.http import JsonResponse


@csrf_exempt
@require_http_methods(["POST"])
def get_patient_details_OP_for_QA(request):
    try:
        filters = json.loads(request.body)

        search = filters.get("search", "")
        date_option = filters.get("dateOption", "")
        from_date = filters.get("fromDate")
        to_date = filters.get("toDate")
        date_value = filters.get("date")  # used for both current and particular

        qs = Patient_Appointment_Registration_Detials.objects.all()

        # Filter by search (PatientId_id is assumed to be a string-like field)
        if search:
            qs = qs.filter(PatientId_PatientId__icontains=search)

        # Filter by date using created_at
        if date_option == "current" and date_value:
            qs = qs.filter(created_at__date=date_value)

        elif date_option == "custom" and from_date and to_date:
            qs = qs.filter(
                created_at__date__gte=from_date,
                created_at__date__lte=to_date
            )

        elif date_option == "particular" and date_value:
            qs = qs.filter(created_at__date=date_value)

        appointments = qs.values('PatientId_id').distinct()

        data = []
        for appointment in appointments:
            data.append({
                'Registration_Id': appointment['PatientId_id'],
                'LabReportsVsClinicalDiagnosis': True,
                'AdverseDrugReactions': True,
                'HighRiskDrugReactions': True,
                'ErrorProneAbbreviations': True,
                'WrongPatientIdentificationErrors': True,
                'HandHygieneCompliance': True,
            })

        return JsonResponse({"data": data}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_http_methods(["POST"])
def get_patient_details_OP_for_QA_2(request):
    try:
        filters = json.loads(request.body)

        search = filters.get("search", "")
        date_option = filters.get("dateOption", "")
        from_date = filters.get("fromDate")
        to_date = filters.get("toDate")
        date_value = filters.get("date")  # used for both current and particular

        qs = Patient_Appointment_Registration_Detials.objects.all()

        # Filter by search (PatientId_id is assumed to be a string-like field)
        if search:
            qs = qs.filter(PatientId_PatientId__icontains=search)

        # Filter by date using created_at
        if date_option == "current" and date_value:
            qs = qs.filter(created_at__date=date_value)

        elif date_option == "custom" and from_date and to_date:
            qs = qs.filter(
                created_at__date__gte=from_date,
                created_at__date__lte=to_date
            )

        elif date_option == "particular" and date_value:
            qs = qs.filter(created_at__date=date_value)

        appointments = qs.values('PatientId_id').distinct()

        data = []
        for appointment in appointments:
            data.append({
                'Registration_Id': appointment['PatientId_id'],
                'PrescriptionCompliance': True,
                'PatientFallRate': True,
                'PressureUlcerRate': True,
                'OutPatientSatisfaction': True,
                'NearMisses': True,
                'NeedlestickInjuries': True,
                'RecordsMissingICDCodes':True,
            })

        return JsonResponse({"data": data}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
