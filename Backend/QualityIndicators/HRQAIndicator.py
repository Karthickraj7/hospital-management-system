from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.dateparse import parse_date
from Masters.models import Employee_Personal_Form_Detials
from .models import *

@csrf_exempt
@require_http_methods(["GET"])
def get_employee_details_for_QA(request):
    try:
        search = request.GET.get('search', '').strip()
        date_option = request.GET.get('dateOption', 'current')

        from_date = request.GET.get('fromDate')
        to_date = request.GET.get('toDate')
        particular_date = request.GET.get('particularDate')
        current_date = request.GET.get('currentDate')

        employees = Employee_Personal_Form_Detials.objects.all()

        # 🔍 Filter by search
        if search:
            employees = employees.filter(Employee_ID__icontains=search)

        # 📅 Filter by date
        if date_option == 'current' and current_date:
            date = parse_date(current_date)
            if date:
                employees = employees.filter(created_at__date=date)

        elif date_option == 'custom' and from_date and to_date:
            from_d = parse_date(from_date)
            to_d = parse_date(to_date)
            if from_d and to_d:
                employees = employees.filter(created_at__date__range=[from_d, to_d])

        elif date_option == 'particular' and particular_date:
            date = parse_date(particular_date)
            if date:
                employees = employees.filter(created_at__date=date)

        data = []
        for emp in employees:
            data.append({
                'Employee_ID': emp.Employee_ID,
                'Employee-satisfaction-index': True,
                'Employee-attrition-rate': True,
                'Employee-absenteeism-rate': True,
                'Percentage-of-employee-aware-of-employee-rights': True,
                'Percentag-of-sentinel-events-analysed-within-a-defined-time-frame': True,
            })

        return JsonResponse({'status': 'success', 'data': data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
