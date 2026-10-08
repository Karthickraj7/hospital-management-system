from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from OutPatient.models import Radiology_Request_Details
from django.views.decorators.http import require_http_methods
from django.utils.dateparse import parse_date


@csrf_exempt
@require_http_methods(["GET"])
def get_Radiology_quality_metrics(request):
    try:
        data = []

        # Extract query params
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        particular_date = request.GET.get('date')
        current_date = request.GET.get('currentDate')

        queryset = Radiology_Request_Details.objects.all()

        # Apply date filters
        if from_date and to_date:
            queryset = queryset.filter(
                created_at__date__gte=parse_date(from_date),
                created_at__date__lte=parse_date(to_date)
            )
        elif particular_date:
            queryset = queryset.filter(created_at__date=parse_date(particular_date))
        elif current_date:
            queryset = queryset.filter(created_at__date=parse_date(current_date))

        request_ids = queryset.values_list('Radiology_RequestId', flat=True).distinct()

        for req_id in request_ids:
            data.append({
                'Request_Id': req_id,
                'reporting_error_rate': 2.3,
                'redo_percentage': True,
                'clinical_correlation': True,
                'safety_adherence': True,
                'abbreviation_errors': True,
                'hand_hygiene': True,
            })

        return JsonResponse({'status': 'success', 'data': data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_Radiology_quality_metrics_2(request):
    try:
        data = []

        # Extract query params
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        particular_date = request.GET.get('date')
        current_date = request.GET.get('currentDate')

        queryset = Radiology_Request_Details.objects.all()

        # Apply date filters
        if from_date and to_date:
            queryset = queryset.filter(
                created_at__date__gte=parse_date(from_date),
                created_at__date__lte=parse_date(to_date)
            )
        elif particular_date:
            queryset = queryset.filter(created_at__date=parse_date(particular_date))
        elif current_date:
            queryset = queryset.filter(created_at__date=parse_date(current_date))

        request_ids = queryset.values_list('Radiology_RequestId', flat=True).distinct()

        for req_id in request_ids:
            data.append({
                'Request_Id': req_id,
                'patient_fall_rate': True,
                'near_miss_percentage': True,
                'needlestick_injury_rate': True,
                'incomplete_consent_percentage': True,
            })

        return JsonResponse({'status': 'success', 'data': data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
