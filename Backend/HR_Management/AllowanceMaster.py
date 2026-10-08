from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
import json
from .models import AllowanceMaster

# Retrieve all allowance master records
@csrf_exempt
def allowance_master_list(request):
    if request.method == 'GET':
        allowances = AllowanceMaster.objects.all()
        allowance_list = [model_to_dict(allowance) for allowance in allowances]
        return JsonResponse(allowance_list, safe=False)

# Create a new allowance master record
@csrf_exempt
def allowance_master_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Create a new AllowanceMaster object
        allowance = AllowanceMaster(
            allowance_name=data.get('allowance_name'),
            allowance_type=data.get('allowance_type'),
            value=data.get('value'),
            status=data.get('status', True)  # Default to True if not provided
        )
        allowance.save()

        # Return the created object as a JSON response
        return JsonResponse(model_to_dict(allowance), status=201)

# Update an existing allowance master record
@csrf_exempt
def allowance_master_update(request, id):
    try:
        allowance = AllowanceMaster.objects.get(pk=id)
    except AllowanceMaster.DoesNotExist:
        return JsonResponse({'error': 'Allowance Master not found'}, status=404)

    if request.method == 'PUT':
        data = json.loads(request.body)

        # Update the AllowanceMaster object
        allowance.allowance_name = data.get('allowance_name', allowance.allowance_name)
        allowance.allowance_type = data.get('allowance_type', allowance.allowance_type)
        allowance.value = data.get('value', allowance.value)
        allowance.status = data.get('status', allowance.status)
        allowance.save()

        # Return the updated object as a JSON response
        return JsonResponse(model_to_dict(allowance))

# Delete an allowance master record (optional)
@csrf_exempt
def allowance_master_delete(request, id):
    try:
        allowance = AllowanceMaster.objects.get(pk=id)
    except AllowanceMaster.DoesNotExist:
        return JsonResponse({'error': 'Allowance Master not found'}, status=404)

    if request.method == 'DELETE':
        allowance.delete()
        return JsonResponse({'message': 'Allowance Master deleted successfully'}, status=204)
