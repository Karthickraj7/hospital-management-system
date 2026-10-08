from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import AssetCategory
import json
 
@csrf_exempt  
@require_http_methods(['POST'])
def asset_categories(request):
    if request:
        data = json.loads(request.body)
        name = data.get('name')
        status_value = data.get('status', 'active')
       
        if AssetCategory.objects.filter(name=name).exists():
            return JsonResponse({'error': 'Category already exists'})
       
        category = AssetCategory.objects.create(name=name, status=status_value)
       
        return JsonResponse({'id': category.id, 'name': category.name, 'status': category.status})
 
@csrf_exempt  
@require_http_methods(['PUT'])
def update_asset_category(request, category_id):
    if request:
        try:
            category = AssetCategory.objects.get(id=category_id)
        except AssetCategory.DoesNotExist:
            return JsonResponse({'error': 'Category not found'})
       
        data = json.loads(request.body)
        name = data.get('name', category.name)  
        status_value = data.get('status', category.status)
       
        category.name = name
        category.status = status_value
        category.save()  
       
        return JsonResponse({'id': category.id, 'name': category.name, 'status': category.status})
 
@csrf_exempt  
@require_http_methods(['GET'])
def get_asset_category(request, category_id):
    try:
        category = AssetCategory.objects.get(id=category_id)
        print("Updating category:", category)
 
    except AssetCategory.DoesNotExist:
        return JsonResponse({'error': 'Category not found'}, status=404)
 
    return JsonResponse({'id': category.id, 'name': category.name, 'status': category.status})
 
@csrf_exempt
@require_http_methods(['GET'])
def asset_categories_list(request):
    categories = AssetCategory.objects.all()
    category_list = [{"id": cat.id, "name": cat.name, "status": cat.status} for cat in categories]
    return JsonResponse(category_list, safe=False)  


@csrf_exempt
@require_http_methods(['DELETE'])
def delete_Category(request, id):
    try:
        category = AssetCategory.objects.get(id=id)
        category.delete()
        return JsonResponse({"message": "Record deleted successfully"})
    except AssetCategory.DoesNotExist:
        return JsonResponse({"error": "Category not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})