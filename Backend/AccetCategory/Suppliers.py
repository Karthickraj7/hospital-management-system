from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json


@csrf_exempt  
@require_http_methods(['POST'])
def suppliers_Data(request):
    try:
        data = json.loads(request.body)
        
        supplier = Supplier.objects.create(
            name=data.get('name'),
            contact_info=data.get('contact_info'),
            email=data.get('email'),
            asset_category=AssetCategory.objects.get(id=data.get('asset_category')),
            status=data.get('status', 'active'),
            ranking=int(data.get('ranking', '1')),
            remarks=data.get('remarks', '')
        )
        
        subcategories = data.get('subcategories', [])
        for subcat_id in subcategories:
            subcategory = AssetSubCategory.objects.get(id=subcat_id)
            supplier.subcategories.add(subcategory)
        
        return JsonResponse({'detail': 'Supplier added successfully!'}, status=201)
    except AssetCategory.DoesNotExist:
        return JsonResponse({'detail': 'Asset category not found.'}, status=404)
    except AssetSubCategory.DoesNotExist:
        return JsonResponse({'detail': 'One or more subcategories not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'detail': str(e)}, status=400)


@csrf_exempt  
@require_http_methods(['GET'])
def suppliers_Data_Get(request):
    suppliers = Supplier.objects.all().values(
        'id', 'name', 'contact_info', 'email', 'asset_category', 'status', 'ranking', 'remarks'
    )
    suppliers_list = list(suppliers)
    for supplier in suppliers_list:
        supplier['subcategories'] = list(
            Supplier.objects.get(id=supplier['id']).subcategories.values_list('id', flat=True)
        )
    
    return JsonResponse(suppliers_list, safe=False)


from django.shortcuts import get_object_or_404

@csrf_exempt  
@require_http_methods(['PUT'])
def suppliers_Data_Put(request, supplier_id):
    try:
        data = json.loads(request.body)
        supplier = get_object_or_404(Supplier, id=supplier_id)

        supplier.name = data.get('name', supplier.name)
        supplier.contact_info = data.get('contact_info', supplier.contact_info)
        supplier.email = data.get('email', supplier.email)
        
        # Fetch the AssetCategory with error handling
        asset_category = get_object_or_404(AssetCategory, id=data.get('asset_category', supplier.asset_category.id))
        supplier.asset_category = asset_category
        
        supplier.status = data.get('status', supplier.status)
        supplier.ranking = int(data.get('ranking', supplier.ranking))
        supplier.remarks = data.get('remarks', supplier.remarks)

        # Clear and add subcategories
        supplier.subcategories.clear()
        subcategories = data.get('subcategories', [])
        for subcat_id in subcategories:
            subcategory = get_object_or_404(AssetSubCategory, id=subcat_id)
            supplier.subcategories.add(subcategory)

        supplier.save()

        return JsonResponse({'detail': 'Supplier updated successfully!'})
    except Exception as e:
        return JsonResponse({'detail': str(e)}, status=400)
    
    
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_Supplier(request, id):
    try:
        supplier = Supplier.objects.get(id=id)
        supplier.delete()
        return JsonResponse({"message": "Record deleted successfully"})
    except Supplier.DoesNotExist:
        return JsonResponse({"error": "supplier not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})
