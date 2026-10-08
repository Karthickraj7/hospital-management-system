from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json
from django.shortcuts import get_object_or_404


@require_http_methods(['POST'])
@csrf_exempt
def AMC_CMC_POST(request):
    try:
        data = json.loads(request.body)

        required_fields = ['asset', 'category', 'asset_subcategory', 'provider', 'start_date', 'end_date', 'cost', 'terms']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'{field} is required'})

        asset = AssetReg_Data.objects.get(id=data['asset'])
        category = AssetCategory.objects.get(id=data['category'])
        
        asset_subcategory = None
        if data.get('asset_subcategory'):  
            asset_subcategory = AssetSubCategory.objects.get(id=data['asset_subcategory'])
        
        provider = Asset_ServiceProviderManagement.objects.get(id=data['provider'])
        
        amc = ASSET_AMC_CMC.objects.create(
            asset=asset,
            category=category,
            asset_subcategory=asset_subcategory, 
            provider=provider,
            start_date=data['start_date'],
            end_date=data['end_date'],
            cost=data['cost'],
            terms=data['terms'],
            warranty_type=data.get('warranty_type', ''),
            is_active=data.get('is_active', True),
            asset_type=data.get('asset_type', ''),
            parts=data.get('parts', ''),
            visit_frequency=data.get('visit_frequency', ''),
        )
        return JsonResponse({"message": "AMC/CMC created successfully", "id": amc.id})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except AssetCategory.DoesNotExist:
        return JsonResponse({'error': 'Category not found'})
    except AssetSubCategory.DoesNotExist:
        return JsonResponse({'error': 'Subcategory not found'})
    except Asset_ServiceProviderManagement.DoesNotExist:
        return JsonResponse({'error': 'Provider not found'})
    except Exception as e:
        return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['GET'])
def AMC_CMC_GET(request):
    try:
        amcs = ASSET_AMC_CMC.objects.all()
        if not amcs:
            return JsonResponse({"error": "No data found"})
        
        amcs_data = [
            {
                "id": amc.id,
                "asset": amc.asset.name,
                "asset_id": amc.asset.id,
                "provider": amc.provider.name,
                "provider_id": amc.provider.id,
                "category": amc.category.name,
                "category_id": amc.category.id,
                "asset_subcategory": amc.asset_subcategory.name if amc.asset_subcategory else None,
                "asset_subcategory_id": amc.asset_subcategory.id if amc.asset_subcategory else None,
                "terms": amc.terms,
                "start_date": amc.start_date,
                "end_date": amc.end_date,
                "cost": amc.cost,
                "warranty_type": amc.warranty_type,
                "is_active": amc.is_active,
                "asset_type": amc.asset_type,
                "parts": amc.parts,
                "visit_frequency": amc.visit_frequency
            }
            for amc in amcs
        ]
        return JsonResponse(amcs_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)})


@csrf_exempt
@require_http_methods(['PUT'])
def AMC_CMC_PUT(request, amc_id):
    try:
        amc_instance = ASSET_AMC_CMC.objects.get(id=amc_id)

        if request.body:
            data = json.loads(request.body)

            if 'category' in data:
                amc_instance.category = AssetCategory.objects.get(id=data['category'])
            if 'asset_subcategory' in data and data['asset_subcategory']:
                amc_instance.asset_subcategory = AssetSubCategory.objects.get(id=data['asset_subcategory'])
            if 'asset' in data:
                amc_instance.asset = AssetReg_Data.objects.get(id=data['asset'])
            if 'provider' in data:
                amc_instance.provider = Asset_ServiceProviderManagement.objects.get(id=data['provider'])

            amc_instance.start_date = data.get('start_date', amc_instance.start_date)
            amc_instance.end_date = data.get('end_date', amc_instance.end_date)
            amc_instance.cost = data.get('cost', amc_instance.cost)
            amc_instance.terms = data.get('terms', amc_instance.terms)
            amc_instance.warranty_type = data.get('warranty_type', amc_instance.warranty_type)
            amc_instance.is_active = bool(data.get('is_active', amc_instance.is_active))
            amc_instance.asset_type = data.get('asset_type', amc_instance.asset_type)
            amc_instance.parts = data.get('parts', amc_instance.parts)
            amc_instance.visit_frequency = data.get('visit_frequency', amc_instance.visit_frequency)

            amc_instance.save()

            return JsonResponse({
                                "message": "AMC/CMC updated successfully",
                                "data": {
                                    "category": amc_instance.category.id if amc_instance.category else None,
                                    "asset_subcategory": amc_instance.asset_subcategory.id if amc_instance.asset_subcategory else None,
                                    "asset": amc_instance.asset.id if amc_instance.asset else None,
                                    "provider": amc_instance.provider.id if amc_instance.provider else None,
                                    "start_date": amc_instance.start_date,
                                    "end_date": amc_instance.end_date,
                                    "cost": amc_instance.cost,
                                    "warranty_type": amc_instance.warranty_type,
                                    "is_active": amc_instance.is_active,
                                    "asset_type": amc_instance.asset_type,
                                    "parts": amc_instance.parts,
                                    "visit_frequency": amc_instance.visit_frequency,
                                }
                            })

        else:
            return JsonResponse({"error": "No data provided"})

    except ASSET_AMC_CMC.DoesNotExist:
        return JsonResponse({"error": "AMC/CMC not found"})
    except AssetCategory.DoesNotExist:
        return JsonResponse({"error": "Category not found"})
    except AssetSubCategory.DoesNotExist:
        return JsonResponse({"error": "Subcategory not found"})
    except Asset_ServiceProviderManagement.DoesNotExist:
        return JsonResponse({"error": "Provider not found"})
    except AssetReg_Data.DoesNotExist:
        return JsonResponse({"error": "Asset not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})
    
    
# ----------------------------------------------------------------------------------------
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_amc_cmc(request, id):
    if request: 
        print(f"Trying to delete ID: {id}") 
        amc_cmc = get_object_or_404(ASSET_AMC_CMC, id=id)
        
        amc_cmc.delete()
        
        return JsonResponse({"message": "Record deleted successfully"})
    
    return JsonResponse({"error": "Invalid request method"})
# ------------------------------------------------------------------------

@csrf_exempt
@require_http_methods(['GET'])
def AMC_CMC_INS_get(request, id):
    try:
        amc_cmc = ASSET_AMC_CMC.objects.get(id=id)

        return JsonResponse({
                "id": amc_cmc.id,
                "asset": amc_cmc.asset.name,
                "asset_id": amc_cmc.asset.id,
                "provider": amc_cmc.provider.name,
                "provider_id": amc_cmc.provider.id,
                "category": amc_cmc.category.name,
                "category_id": amc_cmc.category.id,
                "asset_subcategory": amc_cmc.asset_subcategory.name if amc_cmc.asset_subcategory else None,
                "asset_subcategory_id": amc_cmc.asset_subcategory.id if amc_cmc.asset_subcategory else None,
                "terms": amc_cmc.terms,
                "start_date": amc_cmc.start_date,
                "end_date": amc_cmc.end_date,
                "cost": amc_cmc.cost,
                "warranty_type": amc_cmc.warranty_type,
                "is_active": amc_cmc.is_active,
                "asset_type": amc_cmc.asset_type,
                "parts": amc_cmc.parts,
                "visit_frequency": amc_cmc.visit_frequency
        })

    except ASSET_AMC_CMC.DoesNotExist:
        return JsonResponse({"error": "Contract not found for the provided ID"})

    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"})
# ----------------------------------------------
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_AMC(request, id):
    try:
        AMC = ASSET_AMC_CMC.objects.get(id=id)
        AMC.delete()
        return JsonResponse({"message": "Record deleted successfully"})
    except ASSET_AMC_CMC.DoesNotExist:
        return JsonResponse({"error": "AMC_CMC not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})
        
