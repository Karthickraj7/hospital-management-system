import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db import transaction

# views.py
from django.db.models import Q

@csrf_exempt
@require_http_methods(["GET"])
def get_department_users(request):
    try:
        department_id = request.GET.get('department_id')
        location_id = request.GET.get('location_id')
        
        if not department_id:
            return JsonResponse({"error": "Department ID is required"}, status=400)
            
        query = Q()
        if department_id:
            query &= Q(Employee_Id__Department__Department_Id=department_id)
        if location_id:
            query &= Q(Locations__Location_Id=location_id)
            
        users = UserRegister_Master_Details.objects.filter(query).select_related(
            'Employee_Id',
            'role'
        ).prefetch_related('Locations')
        
        result = [{
            'user_id': user.User_Id,
            'username': user.auth_user_id.username if user.auth_user_id else '',
            'employee_id': user.Employee_Id.Employee_ID if user.Employee_Id else '',
            'first_name': user.Employee_Id.First_Name if user.Employee_Id else '',
            'last_name': user.Employee_Id.Last_Name if user.Employee_Id else '',
            'employee_type': user.EmployeeType,
            'locations': [loc.Location_Id for loc in user.Locations.all()],
            'role': user.role.Role_Name if user.role else ''
        } for user in users]
        
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def breakage_report_create(request):
    try:
        data = json.loads(request.body)
        
        with transaction.atomic():
            report = BreakageReport_Asset_Table_Data()
            asset_id = data.get('assetId')
            department_id = data.get('department')
            sister_id = data.get('SisterId')
            incharge_id = data.get('InchargeId')
            repair_date = data.get('repairDate')  
            
            if asset_id and not AssetReg_Data.objects.filter(id=asset_id).exists():
                return JsonResponse({"error": f"Asset with ID {asset_id} does not exist"})
            if department_id and not Department_Detials.objects.filter(Department_Id=department_id).exists():
                return JsonResponse({"error": f"Department with ID {department_id} does not exist"})
            if sister_id and not UserRegister_Master_Details.objects.filter(User_Id=sister_id).exists():
                return JsonResponse({"error": f"User with ID {sister_id} does not exist"})
            if incharge_id and not UserRegister_Master_Details.objects.filter(User_Id=incharge_id).exists():
                return JsonResponse({"error": f"User with ID {incharge_id} does not exist"})
            
            report.asset_id = asset_id
            report.department_id = department_id
            report.sister_id = sister_id
            report.incharge_id = incharge_id
            report.repair_date = repair_date  
            
            department_name = data.get('departmentname', '').upper()
            if department_name == 'IP':
                report.ward_id = data.get('ward')
                report.room_id = data.get('room')
            elif department_name == 'ADMINISTRATION':
                report.administration_id = data.get('Administration')
            elif department_name == 'OT':
                report.theatre_id = data.get('TheatreName')
            elif department_name == 'OP':
                report.consultation_room_id = data.get('Consultationroom')
                
            report.breakage_issue = data.get('breakageIssue', '')
            
            report.save()
            
            return JsonResponse({"success": True, "id": report.id})
            
    except Exception as e:
        return JsonResponse({"error": str(e)}) 

@csrf_exempt
@require_http_methods(["GET"])
def breakage_report_list(request):
    try:
        reports = BreakageReport_Asset_Table_Data.objects.select_related(
            'asset', 'department', 'ward', 'room', 'administration', 'theatre', 'consultation_room', 'sister', 'incharge'
        ).all()
        
        result = [{
            'id': r.id,
            'assetId': r.asset_id,
            'asset_name': r.asset.name if r.asset else 'N/A',
            'department': r.department.Department_Id if r.department else None,
            'department_name': r.department.Department_Name if r.department else 'N/A',
            'ward': r.ward.Ward_Id if r.ward else None,
            'ward_name': r.ward.Ward_Name if r.ward else None,
            'room': r.room.Room_Id if r.room else None,
            'room_name': r.room.RoomNo if r.room else None,
            'Administration': r.administration.Administration_Id if r.administration else None,
            'administration_name': r.administration.Administration_Name if r.administration else None,
            'TheatreName': r.theatre.Ot_Id if r.theatre else None,
            'theatre_name': r.theatre.TheatreName if r.theatre else None,
            'Consultationroom': r.consultation_room.Con_Room_Id if r.consultation_room else None,
            'consultation_room_name': r.consultation_room.Con_Room_Name if r.consultation_room else None,
            'breakageIssue': r.breakage_issue,
            'SisterId': r.sister.User_Id if r.sister else None,
            'SisterName': r.sister.Employee_Id.First_Name if r.sister else 'N/A',
            'InchargeId': r.incharge.User_Id if r.incharge else None,
            'InchargeName': r.incharge.Employee_Id.First_Name if r.incharge else 'N/A',
            'created_at': r.created_at.strftime('%Y-%m-%d'),
            'repairDate': r.repair_date.strftime('%Y-%m-%d') if r.repair_date else None,  
        } for r in reports]
        
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)})      

@csrf_exempt
@require_http_methods(["PUT"])
def breakage_report_update(request, id):
    try:
        data = json.loads(request.body)
        
        with transaction.atomic():
            try:
                report = BreakageReport_Asset_Table_Data.objects.get(id=id)
            except BreakageReport_Asset_Table_Data.DoesNotExist:
                return JsonResponse({"error": "Breakage report not found"})
                
            asset_id = data.get('assetId')
            department_id = data.get('department')
            sister_id = data.get('SisterId')
            incharge_id = data.get('InchargeId')
            repair_date = data.get('repairDate')  
            
            if asset_id and not AssetReg_Data.objects.filter(id=asset_id).exists():
                return JsonResponse({"error": f"Asset with ID {asset_id} does not exist"})
            if department_id and not Department_Detials.objects.filter(Department_Id=department_id).exists():
                return JsonResponse({"error": f"Department with ID {department_id} does not exist"})
            if sister_id and not UserRegister_Master_Details.objects.filter(User_Id=sister_id).exists():
                return JsonResponse({"error": f"User with ID {sister_id} does not exist"})
            if incharge_id and not UserRegister_Master_Details.objects.filter(User_Id=incharge_id).exists():
                return JsonResponse({"error": f"User with ID {incharge_id} does not exist"})
            
            report.asset_id = asset_id
            report.department_id = department_id
            report.sister_id = sister_id
            report.incharge_id = incharge_id
            report.repair_date = repair_date  
            
            report.ward_id = None
            report.room_id = None
            report.administration_id = None
            report.theatre_id = None
            report.consultation_room_id = None
            
            department_name = data.get('departmentname', '').upper()
            if department_name == 'IP':
                report.ward_id = data.get('ward')
                report.room_id = data.get('room')
            elif department_name == 'ADMINISTRATION':
                report.administration_id = data.get('Administration')
            elif department_name == 'OT':
                report.theatre_id = data.get('TheatreName')
            elif department_name == 'OP':
                report.consultation_room_id = data.get('Consultationroom')
                
            report.breakage_issue = data.get('breakageIssue', '')
            
            report.save()
            
            return JsonResponse({
                "success": True,
                "id": report.id,
                "message": "Breakage report updated successfully"
            })
            
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"})
    except Exception as e:
        return JsonResponse({"error": str(e)})  
    
    
@csrf_exempt
@require_http_methods(['POST'])
def Fetch_Asset_Details(request):
    try:
        data = json.loads(request.body)
        asset_id = data.get('asset_id')
        if not asset_id:
            return JsonResponse({'error': 'Asset ID is required'}, status=400)
        
        asset = AssetReg_Data.objects.get(id=asset_id)
        response_data = {
            'id': asset.id,
            'AssetName': asset.AssetName,
            'department_id': asset.department_id,
            'location_type': asset.location_type,
            'location_id': asset.location_id,
        }
        return JsonResponse(response_data, status=200)
    except AssetReg_Data.DoesNotExist:
        return JsonResponse({'error': 'Asset not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)    
    

# repaire fix page

@csrf_exempt
@require_http_methods(["POST"])
def repair_fixd_create(request):
    try:
        data = json.loads(request.body)
        
        with transaction.atomic():
            repair = BreakageRepair_Asset_Table_Data()
            
            asset_id = data.get('assetId')
            
            if not AssetReg_Data.objects.filter(id=asset_id).exists():
                return JsonResponse({"error": f"Asset with ID {asset_id} does not exist"})
           
            
            repair.asset_id = asset_id
            repair.breakage_done_by = data.get('breakageDoneBy', '')
            repair.action_date = data.get('actionDate')
            repair.breakage_done_date = data.get('breakageDoneDate')
            repair.part_replaced = data.get('partReplaced', '')
            repair.store_received = data.get('storeReceived', '')
            repair.received_by = data.get('receivedName', '')
            repair.amount = float(data.get('amount', 0)) or 0
            repair.remark = data.get('remark', '')
            
            repair.save()
            
            return JsonResponse({
                "success": True,
                "id": repair.id,
                "message": "Repair record created successfully"
            })
            
    except Exception as e:
        return JsonResponse({"error": str(e)})

@csrf_exempt
@require_http_methods(["GET"])
def get_repair_fixd_records(request):
    try:
        records = BreakageRepair_Asset_Table_Data.objects.select_related(
            'asset'
        ).all()
        
        result = [{
            'id': record.id,
            'assetName': record.asset.name,
            'breakageDoneBy': record.breakage_done_by,
            'actionDate': record.action_date,
            'breakageDoneDate': record.breakage_done_date,
            'partReplaced': record.part_replaced,
            'storeReceived': record.store_received,
            'receivedBy': record.received_by,
            'amount': float(record.amount),
            'remark': record.remark,
            'createdAt': record.created_at,
            'updatedAt': record.updated_at
        } for record in records]
        
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)})

@csrf_exempt
@require_http_methods(["PUT"])
def repair_fixd_update(request, record_id):
    try:
        data = json.loads(request.body)
        repair = BreakageRepair_Asset_Table_Data.objects.get(id=record_id)
        
        with transaction.atomic():
            repair.breakage_done_by = data.get('breakageDoneBy', repair.breakage_done_by)
            repair.action_date = data.get('actionDate', repair.action_date)
            repair.breakage_done_date = data.get('breakageDoneDate', repair.breakage_done_date)
            repair.part_replaced = data.get('partReplaced', repair.part_replaced)
            repair.store_received = data.get('storeReceived', repair.store_received)
            repair.received_by = data.get('receivedName', repair.received_by)
            repair.amount = float(data.get('amount', repair.amount)) or repair.amount
            repair.remark = data.get('remark', repair.remark)
            
            repair.save()
            
            return JsonResponse({
                "success": True,
                "id": repair.id,
                "message": "Repair record updated successfully"
            })
            
    except BreakageRepair_Asset_Table_Data.DoesNotExist:
        return JsonResponse({"error": "Record not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})
     
    
# visit frequncy  
    
@csrf_exempt
@require_http_methods(["GET"])
def get_visit_frequency_counts(request):
    try:
        amc_data = ASSET_AMC_CMC.objects.all()
        result = {
            str(amc.asset_id): {
                "count": amc.visit_count,
                "max": int(amc.visit_frequency)
            }
            for amc in amc_data
        }
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
@require_http_methods(["POST"])
def increment_visit_frequency(request):
    try:
        data = json.loads(request.body)
        asset_id = data.get('assetId')
        
        if not asset_id:
            return JsonResponse({"error": "Asset ID is required"}, status=400)
        
        with transaction.atomic():
            amc = ASSET_AMC_CMC.objects.get(asset_id=asset_id)
            max_visits = int(amc.visit_frequency)
            if amc.visit_count < max_visits:
                amc.visit_count += 1
                amc.save()
                return JsonResponse({"success": True, "new_count": amc.visit_count})
            else:
                return JsonResponse({"error": "Visit frequency limit reached"}, status=400)
                
    except ASSET_AMC_CMC.DoesNotExist:
        return JsonResponse({"error": "AMC record not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
 


# popup
@csrf_exempt
@require_http_methods(["POST"])
def post_Update_Status(request):
    try:
        data = json.loads(request.body)
        
        with transaction.atomic():
            asset_id = data.get('assetId')
            
            if not AssetReg_Data.objects.filter(id=asset_id).exists():
                return JsonResponse({"error": f"Asset with ID {asset_id} does not exist"})
            
            popup = Popup_Breakage_Data()
            popup.asset_id = asset_id
            popup.date = data.get('date')  
            popup.note = data.get('note', '')
            
            popup.save()
            print("popup:", popup)
            
            return JsonResponse({
                "success": True,
                "id": popup.id,
                "message": "Popup record created successfully"
            })
    except Exception as e:
        return JsonResponse({"error": str(e)})

@csrf_exempt
@require_http_methods(["GET"])
def get_Update_Status(request, id):
    try:
        records = Popup_Breakage_Data.objects.select_related('asset').filter(asset_id=id)
        
        result = [{
            'id': record.id,
            'assetName': record.asset.name,
            'date': record.date.strftime('%Y-%m-%d') if record.date else None,
            'note': record.note
        } for record in records]
        
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)})
    
    
    
    
    