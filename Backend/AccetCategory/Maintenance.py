import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from .models import *
from django.db import transaction
from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
@require_http_methods(['POST'])
def submit_maintenance(request):
    try:
        data = json.loads(request.body)
        instance_id = data.get('id')
        asset_id = data.get('asset')
        asset_subcategory_id = data.get('asset_subcategory')
        department_id = data.get('department')
        departmentname = data.get('departmentname', '')
        ward_id = data.get('ward')
        room_id = data.get('room')
        administration_id = data.get('Administartion')
        theatre_id = data.get('TheatreName')
        consultation_room_id = data.get('Consultationroom')
        service_by = data.get('ServiceBy')
        technician_id = data.get('Technician')
        service_provider_id = data.get('ServiceProvider')
        maintenance_schedule = data.get('maintenanceSchedule')
        time_frequency = data.get('timeFrequency')
        maintenance_date_str = data.get('maintenanceDate')
        maintenance_days = data.get('maintenance_days')
        maintenance_dates = data.get('maintenance_dates')
        
        with transaction.atomic():
            if instance_id:
                try:
                    maintenance = ASSET_MaintenanceSchedule.objects.get(id=instance_id)
                except ASSET_MaintenanceSchedule.DoesNotExist:
                    return JsonResponse({"error": "Maintenance schedule not found"})
            else:
                maintenance = ASSET_MaintenanceSchedule()

            maintenance.asset_id = int(asset_id) if asset_id else None
            maintenance.asset_subcategory_id = int(asset_subcategory_id) if asset_subcategory_id else None
            maintenance.department_id = int(department_id) if department_id else None
            maintenance.departmentname = departmentname

            maintenance.ward_id = None
            maintenance.room_id = None
            maintenance.administration_id = None
            maintenance.theatre_id = None
            maintenance.consultation_room_id = None

            if departmentname == 'IP':
                maintenance.ward_id = int(ward_id) if ward_id else None
                maintenance.room_id = int(room_id) if room_id else None
            elif departmentname == 'ADMINISTARTION':
                maintenance.administration_id = administration_id if administration_id else None
            elif departmentname == 'OT':
                maintenance.theatre_id = int(theatre_id) if theatre_id else None
            elif departmentname == 'OP':
                maintenance.consultation_room_id = int(consultation_room_id) if consultation_room_id else None

            maintenance.service_by = service_by
            maintenance.technician_id = None
            maintenance.service_provider_id = None

            if maintenance.service_by == 'Technician' and technician_id:
                maintenance.technician_id = technician_id
            elif maintenance.service_by == 'ServiceProvider' and service_provider_id:
                maintenance.service_provider_id = int(service_provider_id)

            maintenance.maintenance_schedule = maintenance_schedule
            maintenance.time_frequency = int(time_frequency) if time_frequency else None

            maintenance.maintenance_date = None
            if maintenance_date_str:
                try:
                    maintenance.maintenance_date = datetime.strptime(maintenance_date_str.strip(), '%Y-%m-%d').date()
                except ValueError:
                    return JsonResponse({"error": f"Invalid date format: {maintenance_date_str}. Expected YYYY-MM-DD."})

            maintenance.maintenance_days = maintenance_days
            maintenance.maintenance_dates = maintenance_dates

            if not instance_id and maintenance.maintenance_schedule:
                today = datetime.now().date()
                if maintenance.maintenance_schedule == 'Daily':
                    maintenance.next_maintenance_date = today
                elif maintenance.maintenance_schedule == 'Weekly':
                    maintenance.next_maintenance_date = today 
                elif maintenance.maintenance_schedule == 'Monthly':
                    maintenance.next_maintenance_date = maintenance.maintenance_date or today
                elif maintenance.maintenance_schedule == 'Yearly':
                    maintenance.next_maintenance_date = maintenance.maintenance_date or today

            try:
                maintenance.full_clean()
                maintenance.save()
            except ValidationError as e:
                return JsonResponse({"error": e.message_dict})

            return JsonResponse({
                "success": True,
                "id": maintenance.id,
                "message": "Maintenance schedule saved successfully"
            })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"})
    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"})

@csrf_exempt
@require_http_methods(['GET'])
def get_maintenance_list(request):
    try:
        today = datetime.now().date()
        maintenance_schedules = ASSET_MaintenanceSchedule.objects.select_related(
            'asset', 'asset_subcategory', 'department', 'ward', 'room',
            'administration', 'theatre', 'consultation_room', 'service_provider', 'technician'
        ).filter(
            next_maintenance_date__lte=today  
        )

        result = [
            {
                'id': m.id,
                'asset': m.asset_id,
                'Asset_name': m.asset.name if m.asset else None,
                'asset_subcategory': m.asset_subcategory_id,
                'subcategory_name': m.asset_subcategory.name if m.asset_subcategory else None,
                'department': m.department_id,
                'department_name': m.department.Department_Name if m.department else None,
                'departmentname': m.departmentname,
                'ward': m.ward_id,
                'ward_name': m.ward.Ward_Name if m.ward else None,
                'room': m.room_id,
                'room_name': m.room.RoomNo if m.room else None,
                'Administration': m.administration_id,
                'AdministrationName': m.administration.AdministrationName if m.administration else None,
                'TheatreName': m.theatre_id,
                'theatre_name': m.theatre.TheatreName if m.theatre else None,
                'Consultationroom': m.consultation_room_id,
                'consultation_room_name': m.consultation_room.Con_Room_Name if m.consultation_room else None,
                'maintenanceSchedule': m.maintenance_schedule,
                'timeFrequency': m.time_frequency,
                'maintenanceDate': m.maintenance_date.strftime('%Y-%m-%d') if m.maintenance_date else None,
                'next_maintenance_date': m.next_maintenance_date.strftime('%Y-%m-%d') if m.next_maintenance_date else None,
                'ServiceBy': m.service_by,
                'ServiceProvider': m.service_provider_id,
                'service_provider_name': m.service_provider.name if m.service_provider else None,
                'Technician': m.technician.Employee_ID if m.technician else None,
                'technician_name': m.technician.First_Name if m.technician else None,
                'maintenance_days': m.maintenance_days,
                'maintenance_dates': m.maintenance_dates,
                'status': m.status,
            }
            for m in maintenance_schedules
        ]

        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"})

@csrf_exempt
@require_http_methods(['DELETE'])
def delete_maintenance(request, id):
    try:
        maintenance = ASSET_MaintenanceSchedule.objects.get(id=id)
        maintenance.delete()
        return JsonResponse({"message": "Maintenance schedule deleted successfully"})
    except ASSET_MaintenanceSchedule.DoesNotExist:
        return JsonResponse({"error": "Maintenance schedule not found"})
    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"})

  


@csrf_exempt
@require_http_methods(['POST'])
def Post_Maintenance_ChecklistData(request):
    try:
        data = json.loads(request.body)
        
        maintenance_schedule_id = data.get('maintenance_schedule_id')
        checklist_items = data.get('checklist_items', [])
        completed_by = data.get('completed_by', 'System')
        asset_id = data.get('asset_id')
        next_maintenance_date = data.get('next_maintenance_date')
        
        if not checklist_items:
            return JsonResponse({'error': 'No checklist items provided'})
        
        if not maintenance_schedule_id or not asset_id:
            return JsonResponse({'error': 'Maintenance schedule ID and asset ID are required'})

        try:
            maintenance_schedule = ASSET_MaintenanceSchedule.objects.get(
                id=maintenance_schedule_id,
                asset_id=asset_id
            )
        except ASSET_MaintenanceSchedule.DoesNotExist:
            return JsonResponse({'error': 'Maintenance Schedule or Asset not found'})

        with transaction.atomic():
            checklist_logs = []
            for item in checklist_items:
                checklist_item_id = item.get('checklist_item_id')
                status = item.get('status')
                remarks = item.get('remarks', '')
                
                if not checklist_item_id or not status:
                    return JsonResponse({'error': 'Checklist item ID and status are required'})
                
                checklist_log, created = ASSET_MaintenanceChecklistLog.objects.update_or_create(
                    maintenance_schedule=maintenance_schedule,
                    checklist_item_id=checklist_item_id,
                    defaults={
                        'checklist_item_name': item.get('checklist_item_name', 'Unknown'),
                        'status': status,
                        'remarks': remarks,
                        'completed_by': completed_by,
                        'completed_at': datetime.now() if status == 'Completed' else None,
                    }
                )
                checklist_logs.append({
                    'id': checklist_log.id,
                    'checklist_item_name': checklist_log.checklist_item_name,
                    'status': checklist_log.status,
                    'remarks': checklist_log.remarks
                })

            all_completed = all(item['status'] == 'Completed' for item in checklist_items)
            today = datetime.now().date()
            completed_items_count = sum(1 for item in checklist_items if item['status'] == 'Completed')
            
            log_summary = ASSET_MaintenanceLogSummary.objects.create(
                maintenance_schedule=maintenance_schedule,
                asset_id=asset_id,
                completed_by=completed_by,
                completed_at=datetime.now(),
                total_items=len(checklist_items),
                completed_items=completed_items_count,
                status='Completed' if all_completed else 'Partial',
                remarks=f"Maintenance completed by {completed_by} on {datetime.now()}"
            )
            
            maintenance_schedule.last_maintenance_date = today
            
            if all_completed:
                maintenance_schedule.status = 'Completed'
                maintenance_schedule.completed_at = datetime.now()
            else:
                maintenance_schedule.status = 'Pending'
            
            if maintenance_schedule.maintenance_schedule == 'Daily':
                maintenance_schedule.next_maintenance_date = today + timedelta(days=1)
            elif maintenance_schedule.maintenance_schedule == 'Weekly':
                days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                current_day_idx = today.weekday()
                maintenance_days = json.loads(maintenance_schedule.maintenance_days) if maintenance_schedule.maintenance_days else []
                if maintenance_days:
                    next_day_idx = current_day_idx
                    for _ in range(7):
                        next_day_idx = (next_day_idx + 1) % 7
                        if days_of_week[next_day_idx] in maintenance_days:
                            days_until_next = (next_day_idx - current_day_idx) % 7 or 7
                            maintenance_schedule.next_maintenance_date = today + timedelta(days=days_until_next)
                            break
                    else:
                        maintenance_schedule.next_maintenance_date = today + timedelta(days=7)
            elif maintenance_schedule.maintenance_schedule == 'Monthly':
                maintenance_dates = json.loads(maintenance_schedule.maintenance_dates) if maintenance_schedule.maintenance_dates else []
                if maintenance_dates:
                    next_date = min([datetime.strptime(d, '%Y-%m-%d').date() for d in maintenance_dates if datetime.strptime(d, '%Y-%m-%d').date() > today], default=None)
                    if next_date:
                        maintenance_schedule.next_maintenance_date = next_date
                    else:
                        next_month = today.replace(day=1, month=today.month % 12 + 1, year=today.year + (today.month // 12))
                        maintenance_schedule.next_maintenance_date = next_month.replace(day=int(maintenance_dates[0].split('-')[2]))
            elif maintenance_schedule.maintenance_schedule == 'Yearly':
                maint_date = maintenance_schedule.maintenance_date or today
                maintenance_schedule.next_maintenance_date = maint_date.replace(year=today.year + 1)
            
            maintenance_schedule.save()

        return JsonResponse({
            'message': 'Maintenance checklist data submitted successfully',
            'maintenance_schedule_id': maintenance_schedule_id,
            'asset_id': asset_id,
            'checklist_logs': checklist_logs,
            'next_maintenance_date': maintenance_schedule.next_maintenance_date.strftime('%Y-%m-%d') if maintenance_schedule.next_maintenance_date else None,
            'status': maintenance_schedule.status,
            'log_summary_id': log_summary.id  
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': f'Unexpected error: {str(e)}'})  


from django.db import DatabaseError

@csrf_exempt
@require_http_methods(['GET'])
def Get_Maintenance_Log_Summary(request, asset_id):
    try:
        print(f"Fetching maintenance log for asset {asset_id}")
        
        log_summary = ASSET_MaintenanceLogSummary.objects.filter(
            asset_id=asset_id
        ).order_by('-created_at').first()
        
        if not log_summary:
            return JsonResponse({
                'error': 'No maintenance log summary found',
                'details': f'Asset ID {asset_id} has no associated maintenance logs',
                'technical_details': None
            })
        
        if not hasattr(log_summary, 'asset'):
            return JsonResponse({
                'error': 'Invalid Asset Reference',
                'details': f'Maintenance log {log_summary.id} has no valid asset reference',
                'technical_details': 'Asset foreign key is invalid'
            })
        
        asset = log_summary.asset
        response_data = {
            'asset_id': asset.id,
            'asset_name': asset.name,
            'department_id': asset.department.id if asset.department else None,
            'location_type': (
                'ward' if asset.ward else
                'administration' if asset.administration else
                'theatre' if asset.theatre else
                'room' if asset.room else
                'consultationroom' if hasattr(asset, 'Consultaion_Room') and asset.Consultaion_Room else None
            ),
            'location_id': (
                asset.ward.id if asset.ward else
                asset.administration.id if asset.administration else
                asset.theatre.id if asset.theatre else
                asset.room.id if asset.room else
                getattr(asset, 'Consultaion_Room', None).id if hasattr(asset, 'Consultaion_Room') else None
            ),
            'maintenance_schedule_id': log_summary.maintenance_schedule.id,
            'status': log_summary.status,
            'completed_by': log_summary.completed_by,
            'completed_at': log_summary.completed_at.isoformat(),
            'total_items': log_summary.total_items,
            'completed_items': log_summary.completed_items,
            'remarks': log_summary.remarks,
            'created_at': log_summary.created_at.isoformat(),
        }
        
        return JsonResponse(response_data)
    
    except ObjectDoesNotExist:
        return JsonResponse({
            'error': 'Resource Not Found',
            'details': 'Either the asset or its maintenance log record does not exist',
            'technical_details': ' query returned no results'
        })
    
    except DatabaseError as e:
        return JsonResponse({
            'error': 'Database Error',
            'details': 'Failed to fetch data from database',
            'technical_details': str(e)
        })
    
    except AttributeError as e:
        return JsonResponse({
            'error': 'Invalid Data Structure',
            'details': 'Missing required attributes in the data',
            'technical_details': str(e)
        })
    
    except Exception as e:
        return JsonResponse({
            'error': 'Server Error',
            'details': 'An unexpected error occurred',
            'technical_details': str(e)
        })

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import AssetReg_Data
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime

@csrf_exempt
@require_http_methods(['GET'])
def Get_Asset_Details_By_Id(request, asset_id):
    try:
        asset = AssetReg_Data.objects.select_related(
            'category',
            'asset_subcategory',
            'department',
            'ward',
            'administration',
            'theatre',
            'Consultaion_Room'
        ).prefetch_related('supplier').get(id=asset_id)

        purchase_date = asset.purchase_date
        total_working_life = asset.total_working_life or 0
        if purchase_date and total_working_life > 0:
            life_completed = (datetime.now().date() - purchase_date).days / 365.25
            life_completed = round(life_completed, 2)
            life_remain = max(0, total_working_life - life_completed)
        else:
            life_completed = 0
            life_remain = 0

        asset_data = {
            'id': asset.id,
            'name': asset.name,
            'asset_code': asset.asset_code,
            'category': asset.category.id if asset.category else None,
            'category_name': asset.category.name if asset.category else None,
            'asset_subcategory': asset.asset_subcategory.id if asset.asset_subcategory else None,
            'subcategory_name': asset.asset_subcategory.name if asset.asset_subcategory else None,
            'supplier': [s.id for s in asset.supplier.all()],
            'supplier_names': [s.name for s in asset.supplier.all()],
            'Company_Brand': asset.Company_Brand or '',
            'condition': asset.condition or '',
            'status': asset.status or 'IN_USE',
            'is_new_asset': asset.is_new_asset,
            'department_id': asset.department.Department_Id if asset.department else None,  
            'department_name': asset.department.Department_Name if asset.department else None,
            'ward_id': asset.ward.Ward_Id if asset.ward else None,
            'ward_name': asset.ward.Ward_Name if asset.ward else None,
            'administration_id': asset.administration.Administration_Id if asset.administration else None,
            'administration_name': asset.administration.Administration_Name if asset.administration else None,
            'theatre_id': asset.theatre.Ot_Id if asset.theatre else None,
            'theatre_name': asset.theatre.TheatreName if asset.theatre else None,
            'room_id': asset.room.Room_Id if asset.room else None,
            'room_name': asset.room.Roomno if asset.room else None,
            'consultation_room_id': asset.Consultaion_Room.id if asset.Consultaion_Room else None,
            'consultation_room_name': asset.Consultaion_Room.ConsultationRoomName if asset.Consultaion_Room else None,
            'purchase_date': purchase_date.strftime('%Y-%m-%d') if purchase_date else None,
            'purchase_price': float(asset.purchase_price) if asset.purchase_price is not None else None,
            'market_value': float(asset.market_value) if asset.market_value is not None else None,
            'total_working_life': total_working_life,
            'expected_working_life': asset.expected_working_life,
            'life_completed': life_completed,
            'life_remain': life_remain,
            'valuation_method': asset.valuation_method or '',
            'depreciation_method': asset.depreciation_method or '',
            'depreciation_rate': float(asset.depreciation_rate) if asset.depreciation_rate is not None else None,
            'salvage_value': float(asset.salvage_value) if asset.salvage_value is not None else None,
            'appreciation_rate': float(asset.appreciation_rate) if asset.appreciation_rate is not None else None,
        }

        return JsonResponse(asset_data, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Asset not found'}, status=404)
    except Exception as e:
        print(f"Error in Get_Asset_Details_By_Id: {str(e)}")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)




def get_technicians(request):
    if request.method == 'GET':
        try:
            technicians = Employee_Personal_Form_Detials.objects.filter(
                Category__Category_Name="Technician",
                # ActiveStatus="Active"  
            )
           
            technician_data = []
           
            for technician in technicians:
                technician_data.append({
                    'id': technician.Employee_ID,
                    'name': f"{technician.First_Name} {technician.Last_Name}".strip(),
                    'department': ', '.join(department.Department_Name for department in technician.Department.all()),
                    'contact': technician.Contact_Number
                })
           
            return JsonResponse(technician_data, safe=False)
       
        except Exception as e:
            print(f"An error occurred while fetching technicians: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})    
    
    
@csrf_exempt
@require_http_methods(['GET'])
def get_all_maintenance_list(request):
    try:
        maintenance_schedules = ASSET_MaintenanceSchedule.objects.select_related(
            'asset', 'asset_subcategory', 'department', 'ward', 'room',
            'administration', 'theatre', 'consultation_room', 'service_provider', 'technician'
        ).all() 

        result = [
            {
                'id': m.id,
                'asset': m.asset_id,
                'Asset_name': m.asset.name if m.asset else None,
                'asset_subcategory': m.asset_subcategory_id,
                'subcategory_name': m.asset_subcategory.name if m.asset_subcategory else None,
                'department': m.department_id,
                'department_name': m.department.Department_Name if m.department else None,
                'departmentname': m.departmentname,
                'ward': m.ward_id,
                'ward_name': m.ward.Ward_Name if m.ward else None,
                'room': m.room_id,
                'room_name': m.room.RoomNo if m.room else None,
                'Administration': m.administration_id,
                'AdministrationName': m.administration.AdministrationName if m.administration else None,
                'TheatreName': m.theatre_id,
                'theatre_name': m.theatre.TheatreName if m.theatre else None,
                'Consultationroom': m.consultation_room_id,
                'consultation_room_name': m.consultation_room.Con_Room_Name if m.consultation_room else None,
                'maintenanceSchedule': m.maintenance_schedule,
                'timeFrequency': m.time_frequency,
                'maintenanceDate': m.maintenance_date.strftime('%Y-%m-%d') if m.maintenance_date else None,
                'next_maintenance_date': m.next_maintenance_date.strftime('%Y-%m-%d') if m.next_maintenance_date else None,
                'ServiceBy': m.service_by,
                'ServiceProvider': m.service_provider_id,
                'service_provider_name': m.service_provider.name if m.service_provider else None,
                'Technician': m.technician.Employee_ID if m.technician else None,
                'technician_name': m.technician.First_Name if m.technician else None,
                'maintenance_days': m.maintenance_days,
                'maintenance_dates': m.maintenance_dates,
                'status': m.status,
            }
            for m in maintenance_schedules
        ]

        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({"error": f"Unexpected error: {str(e)}"})
    
    
    
    
    
    