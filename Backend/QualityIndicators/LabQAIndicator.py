from django.http import JsonResponse
from OutPatient.models import Lab_Request_Details
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.dateparse import parse_date


@csrf_exempt
@require_http_methods(["GET"])
def get_lab_quality_metrics(request):
    try:
        data = []
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        particular_date = request.GET.get('date')
        search = request.GET.get('search', '').strip()

        lab_requests = Lab_Request_Details.objects.all()

        # Apply date filter
        if from_date and to_date:
            from_date_parsed = parse_date(from_date)
            to_date_parsed = parse_date(to_date)
            if from_date_parsed and to_date_parsed:
                lab_requests = lab_requests.filter(created_at__date__range=(from_date_parsed, to_date_parsed))
        elif particular_date:
            date_parsed = parse_date(particular_date)
            if date_parsed:
                lab_requests = lab_requests.filter(created_at__date=date_parsed)

        # Apply search filter (e.g., Request_Id or patient name)
        if search:
            lab_requests = lab_requests.filter(Request_Id__icontains=search)

        request_ids = lab_requests.values_list('Request_Id', flat=True).distinct()

        for req_id in request_ids:
            data.append({
                'Request_Id': req_id,
                'LabReportingErrorRates': True,
                'LabRedosPercentage': True,
                'LabReportsVsClinicalDiagnosis': True,
                'LabSafetyPrecautionAdherence': True,
                'ErrorProneAbbreviations': True,
                'HandHygieneCompliance': True,
            })

        return JsonResponse({'status': 'success', 'data': data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_lab_quality_metrics_2(request):
    try:
        data = []
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        particular_date = request.GET.get('date')
        search = request.GET.get('search', '').strip()

        lab_requests = Lab_Request_Details.objects.all()

        # Apply date range filter
        if from_date and to_date:
            from_date_parsed = parse_date(from_date)
            to_date_parsed = parse_date(to_date)
            if from_date_parsed and to_date_parsed:
                lab_requests = lab_requests.filter(created_at__date__range=(from_date_parsed, to_date_parsed))

        # Apply specific date filter
        elif particular_date:
            date_parsed = parse_date(particular_date)
            if date_parsed:
                lab_requests = lab_requests.filter(created_at__date=date_parsed)

        # Apply search filter
        if search:
            lab_requests = lab_requests.filter(Request_Id__icontains=search)

        request_ids = lab_requests.values_list('Request_Id', flat=True).distinct()

        for req_id in request_ids:
            data.append({
                'Request_Id': req_id,
                'PatientFallRate': True,
                'NearMissesPercentage': True,
                'NeedlestickInjuryRate': True,
                'IncompleteConsentRecords': True,
            })

        return JsonResponse({'status': 'success', 'data': data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)