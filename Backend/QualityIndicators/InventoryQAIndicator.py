


import base64
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  *

from Masters.models import Inventory_Location_Master_Detials



@csrf_exempt
@require_http_methods(["GET"])
def get_inventory_details_for_QA(request):
    # Fetch all records from the model
    locations = Inventory_Location_Master_Detials.objects.all()
    data =[]
    # Prepare the data as a list of dictionaries
    for location in locations:
       data.append({
           'Store_locationid':location.Store_Id,
           'Store_location':location.Store_Name,
        'LocalPurchaseProcurement': True,
                'EmergencyDrugStockouts': True,
                'RejectedDrugsBeforeGRN': True,
    })

    # Return the data as JSON
    return JsonResponse(data, safe=False)
            