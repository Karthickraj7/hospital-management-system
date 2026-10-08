from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import * 
import json
from django.db import connection



@csrf_exempt  
@require_http_methods(['POST'])
def ChecklistManagement_post(request):
    return

@csrf_exempt  
@require_http_methods(['GET'])
def ChecklistManagement_get(request):
    
    subcategory = request.GET.get('subcategory')

    if not subcategory:
        return JsonResponse({'status': 'error', 'message': 'Subcategory is required'}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, status, asset_category 
                FROM checklist_table 
                WHERE subcategory_id = %s
            """, [subcategory])
            rows = cursor.fetchall()

        if not rows:
            return JsonResponse({'status': 'error', 'message': 'No items found'}, status=404)

        checklist_data = []
        for row in rows:
            checklist_data.append({
                'id': row[0],
                'status': row[1],
                'asset_category': row[2]
            })

        return JsonResponse({'status': 'success', 'data': checklist_data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt  
@require_http_methods(['PUT'])
def ChecklistManagement_Put(request):
    return

