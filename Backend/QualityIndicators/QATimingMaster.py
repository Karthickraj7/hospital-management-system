from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json
from django.views.decorators.http import require_http_methods

# Fetch all QA Timings
def get_qatiming(request):
    qatiming = list(IPQATimingMaster.objects.values())
    return JsonResponse(qatiming, safe=False)

# Add new QA Timing
@csrf_exempt
@require_http_methods(["GET"])
def add_qatiming(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print('data',data)
        department = data.get('department')
        process = data.get('process')
        average_time = data.get('average_time')
        status = data.get('status',True)
        IPQATimingMaster.objects.create(department=department, process=process, average_time=average_time, status=status)
        return JsonResponse({"message": "QA Timing added successfully"})

# Edit QA Timing
@csrf_exempt
@require_http_methods(["GET"])
def edit_qatiming(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            Active = True if data.get('status', 'Active') == 'Active' else False

            qatiming = IPQATimingMaster.objects.get(id=id)
            qatiming.department = data.get('department')
            qatiming.process = data.get('process')
            qatiming.average_time = data.get('average_time')
            qatiming.status = Active
            qatiming.save()
            return JsonResponse({"message": "QA Timing updated successfully"})
        except IPQATimingMaster.DoesNotExist:
            return JsonResponse({"error": "QA Timing not found"}, status=404)

# Delete QA Timing
@csrf_exempt
@require_http_methods(["GET"])
def delete_qatiming(request, id):
    if request.method == 'DELETE':
        try:
            qatiming = IPQATimingMaster.objects.get(id=id)
            qatiming.delete()
            return JsonResponse({"message": "QA Timing deleted successfully"})
        except IPQATimingMaster.DoesNotExist:
            return JsonResponse({"error": "QA Timing not found"}, status=404)
