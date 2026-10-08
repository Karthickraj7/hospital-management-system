#--------------------------------------------Ventilator Type insert,get,update----------------------------------------
 
 
 
import json

from django.http import JsonResponse

from Masters.models import *

from django.views.decorators.http import require_http_methods

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def VentilatorType_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract and validate data
            VentilatorTypeId = data.get('VentilatorTypeId','')
            VentilatorTypeName = data.get('VentilatorTypeName','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
     
           
           
            if VentilatorTypeId:
                if Statusedit:
                    Ventilator_instance = VentilatorType_Detials.objects.get(pk=VentilatorTypeId)
                    # Create a new LocationName instance
                    Ventilator_instance.Status= not Ventilator_instance.Status
                    Ventilator_instance.save()
                    return JsonResponse({'success': 'Status updated successfully'})
 
                if VentilatorTypeName:
                    if VentilatorType_Detials.objects.filter(VentilatorTypeName=VentilatorTypeName).exists():
                        return JsonResponse({'warn': f"The VentilatorType  are already present in the name of {VentilatorTypeName} "})
                    else:
                        Ventilator_instance = VentilatorType_Detials.objects.get(pk=VentilatorTypeId)
                        # Create a new LocationName instance
                        Ventilator_instance.VentilatorTypeName=VentilatorTypeName
                        Ventilator_instance.save()
                        return JsonResponse({'success': 'VentilatorType Updated successfully'})
                else:
                    return JsonResponse({'error': 'VentilatorType is required for updating'})
 
           
            else:
                if VentilatorType_Detials.objects.filter(VentilatorTypeName=VentilatorTypeName).exists():
                    return JsonResponse({'warn': f"The VentilatorType  are already present in the name of {VentilatorTypeName} "})
                else:
                    Ventilator_instance = VentilatorType_Detials(
                        VentilatorTypeName=VentilatorTypeName,
                        created_by=created_by
                    )
                Ventilator_instance.save()
                return JsonResponse({'success': 'VentilatorType added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Ventilator_Master = VentilatorType_Detials.objects.all()
           
            # Construct a list of dictionaries containing location data
            Ventilator_Master_data = []
            for Ventilator in Ventilator_Master:
                Ventilator_dict = {
                    'id': Ventilator.VentilatorTypeId,
                    'VentilatorTypeName': Ventilator.VentilatorTypeName,
                    'Status': 'Active' if Ventilator.Status else 'Inactive',
                    'created_by': Ventilator.created_by,
                   
                }
                Ventilator_Master_data.append(Ventilator_dict)
 
            return JsonResponse(Ventilator_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)