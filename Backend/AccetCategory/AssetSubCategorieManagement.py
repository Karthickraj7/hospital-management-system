from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from .models import AssetSubCategory, AssetCategory
import json
from django.contrib.auth.decorators import login_required
 
 
@csrf_exempt
@require_http_methods(['POST'])
def asset_subcategories(request):
    print("Received POST request!")
    print("Received data:", request.body)
 
 
    try:
        data = json.loads(request.body)
        print("Request data:", data)
 
        name = data.get('name')
        category_id = data.get('category')
        status = data.get('status', 'active')
 
        # if not name or not category_id:
        #     return JsonResponse({'detail': 'Name and Category are required fields.'})
 
        # Check if the category exists
        try:
            category = AssetCategory.objects.get(id=category_id)
        except ObjectDoesNotExist:
            return JsonResponse({'detail': 'Category not found.'})
 
        # Create and save the new subcategory
        subcategory = AssetSubCategory.objects.create(
            name=name,
            category=category,
            status=status
        )
        print("subcategory:",subcategory)
 
        return JsonResponse({
            'detail': 'Subcategory created successfully.',
            'subcategory': {
                'id': subcategory.id,
                'name': subcategory.name,
                'category': subcategory.category.id,
                'status': subcategory.status
            }
        })
       
 
    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON data.'})
    except Exception as e:
        return JsonResponse({'detail': f'An error occurred: {str(e)}'})
   
   
@csrf_exempt
@require_http_methods(['GET'])    
def get_asset_subcategories(request):
    try:
        print("Fetching subcategories...")
        subcategories = AssetSubCategory.objects.all()
        subcategories_list = []
 
        for subcategory in subcategories:
            subcategories_list.append({
                'id': subcategory.id,
                'name': subcategory.name,
                'category': subcategory.category.id,  # Assuming category is a ForeignKey
                'status': subcategory.status
            })
 
        return JsonResponse(subcategories_list, safe=False)
   
    except Exception as e:
        return JsonResponse({'detail': f'An error occurred: {str(e)}'})
   
@csrf_exempt
@require_http_methods(['PUT'])
def update_asset_subcategory(request, subcategory_id):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        category_id = data.get('category')
        status = data.get('status', 'active')
 
        # Check if the subcategory exists
        try:
            subcategory = AssetSubCategory.objects.get(id=subcategory_id)
        except AssetSubCategory.DoesNotExist:
            return JsonResponse({'detail': 'Subcategory not found.'})
 
        # Check if the category exists
        if category_id:
            try:
                category = AssetCategory.objects.get(id=category_id)
                subcategory.category = category
            except AssetCategory.DoesNotExist:
                return JsonResponse({'detail': 'Category not found.'})
 
        # Update fields if provided
        if name:
            subcategory.name = name
        if status:
            subcategory.status = status
 
        subcategory.save()
 
        return JsonResponse({
            'detail': 'Subcategory updated successfully.',
            'subcategory': {
                'id': subcategory.id,
                'name': subcategory.name,
                'category': subcategory.category.id,
                'status': subcategory.status
            }
        })
 
    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON data.'})
    except Exception as e:
        return JsonResponse({'detail': f'An error occurred: {str(e)}'})
    
    
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_AssetSubCategory(request, id):
    try:
        SUBcategory = AssetSubCategory.objects.get(id=id)
        SUBcategory.delete()
        return JsonResponse({"message": "Record deleted successfully"})
    except AssetSubCategory.DoesNotExist:
        return JsonResponse({"error": "SUBcategory not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})