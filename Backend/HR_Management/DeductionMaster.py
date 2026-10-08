from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
import json
from .models import Deduction_Master

# Retrieve all deduction master records
@csrf_exempt
def deduction_master_list(request):
    if request.method == 'GET':
        deductions = Deduction_Master.objects.all()
        deduction_list = [model_to_dict(deduction) for deduction in deductions]
        return JsonResponse(deduction_list, safe=False)

# Create a new deduction master record
@csrf_exempt
def deduction_master_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Create a new Deduction_Master object
        deduction = Deduction_Master(
            deduction_name=data.get('deduction_name',''),
            deduction_type=data.get('deduction_type',''),
            value=data.get('value',0),
            status=data.get('status', True)  # Default to True if not provided
        )
        deduction.save()

        # Return the created object as a JSON response
        return JsonResponse(model_to_dict(deduction), status=201)

# Update an existing deduction master record
@csrf_exempt
def deduction_master_update(request, id):
    try:
        deduction = Deduction_Master.objects.get(pk=id)
    except Deduction_Master.DoesNotExist:
        return JsonResponse({'error': 'Deduction Master not found'}, status=404)

    if request.method == 'PUT':
        data = json.loads(request.body)

        # Update the Deduction_Master object
        deduction.deduction_name = data.get('deduction_name', deduction.deduction_name)
        deduction.deduction_type = data.get('deduction_type', deduction.deduction_type)
        deduction.value = data.get('value', deduction.value)
        deduction.status = data.get('status', deduction.status)
        deduction.save()

        # Return the updated object as a JSON response
        return JsonResponse(model_to_dict(deduction))

