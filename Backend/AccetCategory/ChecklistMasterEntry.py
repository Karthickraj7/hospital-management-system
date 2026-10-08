from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .models import *
import json

@csrf_exempt
@require_http_methods(['POST'])
def ChecklistMasterEntry_post(request):
    try:
        data = json.loads(request.body)
        asset_category_id = data.get('asset_category')
        subcategory_ids = data.get('subcategories', [])  
        item_name = data.get('item_name')  

        if not asset_category_id or not item_name:
            return JsonResponse({
                'status': 'error', 
                'message': 'Category and item name are required.'
            }, status=400)

        try:
            category = AssetCategory.objects.get(id=asset_category_id)
        except AssetCategory.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid asset category.'
            }, status=400)

        checklist_entry = ChecklistMasterEntry.objects.create(
            asset_category=category,
            item_name=item_name,
            status='active' 
        )

        if subcategory_ids:
            subcategories = AssetSubCategory.objects.filter(id__in=subcategory_ids)
            checklist_entry.subcategories.set(subcategories)

        return JsonResponse({
            'status': 'success',
            'message': 'Checklist entry created successfully.',
            'data': {
                'id': checklist_entry.id,
                'item_name': checklist_entry.item_name,
                'asset_category': checklist_entry.asset_category.id,
                'subcategories': list(checklist_entry.subcategories.values_list('id', flat=True)),
                'status': checklist_entry.status
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)



@csrf_exempt
@require_http_methods(['GET'])
def ChecklistMasterEntry_get(request):
    print("ChecklistMasterEntry_get view hit")  
    
    asset_category_id = request.GET.get('asset_category')
    subcategory_id = request.GET.get('subcategory')

    checklist_entries = ChecklistMasterEntry.objects.all()  

    if asset_category_id:
        checklist_entries = checklist_entries.filter(asset_category_id=asset_category_id)
    
    if subcategory_id:
        checklist_entries = checklist_entries.filter(subcategories__id=subcategory_id)

    data = []
    for entry in checklist_entries:
        data.append({
            'id': entry.id,
            'item_name': entry.item_name,
            'asset_category': entry.asset_category.id,
            'subcategories': list(entry.subcategories.values_list('id', flat=True)),
            'status': entry.status
        })

    return JsonResponse({
        'status': 'success',
        'message': 'Entries retrieved successfully.',
        'data': data
    })


@csrf_exempt
@require_http_methods(['PUT'])
def ChecklistMasterEntry_Put(request, entry_id):
    try:
        data = json.loads(request.body)
        item_name = data.get('item_name')
        subcategory_ids = data.get('subcategories', [])

        checklist_entry = get_object_or_404(ChecklistMasterEntry, id=entry_id)
        checklist_entry.item_name = item_name

        if subcategory_ids:
            subcategories = AssetSubCategory.objects.filter(id__in=subcategory_ids)
            checklist_entry.subcategories.set(subcategories)

        checklist_entry.save()

        updated_subcategories = list(checklist_entry.subcategories.values('id', 'name'))

        return JsonResponse({
            'status': 'success', 
            'message': 'Checklist entry updated successfully.', 
            'data': {
                'id': checklist_entry.id, 
                'item_name': checklist_entry.item_name,
                'subcategories': updated_subcategories  
            }
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
