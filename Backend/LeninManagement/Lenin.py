import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from Masters.models import *
from django.db.models import Q
import datetime


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Lenin_Catg_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            catgId = data.get('catgId', '')
            LeninCategory = data.get('LeninCategory', '')
            Statusedit = data.get('Statusedit', False)
            isDelete = data.get('isDelete', False)  # Capture the delete flag
            created_by = data.get('created_by', '')

            if catgId:
                try:
                    Lenin_instance = Lenin_Catg_Master_Details.objects.get(pk=catgId)
                    
                    # --- NEW DELETE LOGIC ---
                    if isDelete:
                        Lenin_instance.delete()
                        return JsonResponse({'success': 'Lenin Catg Details deleted successfully'})
                    
                    # --- EXISTING STATUS EDIT LOGIC ---
                    if Statusedit:
                        Lenin_instance.Status = not Lenin_instance.Status
                    else:
                        # --- EXISTING UPDATE LOGIC ---
                        if Lenin_Catg_Master_Details.objects.filter(LeninCategory=LeninCategory).exclude(pk=catgId).exists():
                            return JsonResponse({'warn': 'The LeninCategory is already present.'})
                        Lenin_instance.LeninCategory = LeninCategory
                    
                    Lenin_instance.save()
                    return JsonResponse({'success': 'Lenin Catg Details Updated successfully'})
                
                except Lenin_Catg_Master_Details.DoesNotExist:
                    return JsonResponse({'error': 'Lenin Catg Details not found'}, status=404)
            
            else:
                # --- EXISTING ADD LOGIC ---
                if Lenin_Catg_Master_Details.objects.filter(LeninCategory=LeninCategory).exists():
                    return JsonResponse({'warn': 'The Lenin Catg Details are already present.'})
                Lenin_instance = Lenin_Catg_Master_Details(LeninCategory=LeninCategory, created_by=created_by)
                Lenin_instance.save()
                return JsonResponse({'success': 'Lenin Catg Details added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        # ... (Keep your existing GET logic exactly as it is)
        try:
            Lenin_Master = Lenin_Catg_Master_Details.objects.all()

            print(Lenin_Master,'Lenin_Master')

            Lenin_Master_data = [
            {
                    'catgId': Lenin.catgId,
                    'LeninCategory': Lenin.LeninCategory,
                    'Status': 'Active' if Lenin.Status else 'Inactive',
                    
                    'created_by': Lenin.created_by,
                }
                for Lenin in Lenin_Master
            ]
            return JsonResponse(Lenin_Master_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
        
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def LeninMaster_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            LeninCode = data.get('LeninCode', '')
            LeninCategory_id = data.get('LeninCategory', '')
            LeninType = data.get('LeninType', '')
            LeninSize = data.get('LeninSize', '')
            ColorCode = data.get('ColorCode', '')
            MaxWashCount = data.get('MaxWashCount', None)
            InfectionCategory = data.get('InfectionCategory', '')
            Statusedit = data.get('Statusedit', False)
            isDelete = data.get('isDelete', False) 
            created_by = data.get('created_by', '')
            Remarks = data.get("Remarks",'')

            # ---------- DELETE ----------
            if isDelete and LeninCode:
                try:
                    Lenin_instance = LeninMaster_Details.objects.get(pk=LeninCode)
                    Lenin_instance.delete()
                    return JsonResponse({'success': 'Lenin Details deleted successfully'})
                except LeninMaster_Details.DoesNotExist:
                    return JsonResponse({'error': 'Lenin Details not found'}, status=404)

            # ---------- CATEGORY VALIDATION ----------
            if not LeninCategory_id:
                return JsonResponse({'error': 'LeninCategory is required'}, status=400)

            try:
                LeninCategory_instance = Lenin_Catg_Master_Details.objects.get(pk=LeninCategory_id)
            except Lenin_Catg_Master_Details.DoesNotExist:
                return JsonResponse({'error': 'Lenin Category not found'}, status=404)

            # ---------- UPDATE / STATUS TOGGLE ----------
            if LeninCode:
                try:
                    Lenin_instance = LeninMaster_Details.objects.get(pk=LeninCode)

                    if Statusedit:
                        # Toggle logic
                        Lenin_instance.Status = not Lenin_instance.Status
                        Lenin_instance.save()
                        # Return string for immediate UI update confirmation
                        status_str = 'Active' if Lenin_instance.Status else 'Inactive'
                        return JsonResponse({'success': f'Status updated to {status_str}'})
                    else:
                        if LeninMaster_Details.objects.filter(
                            LeninCategory=LeninCategory_instance,
                            LeninType=LeninType,
                            LeninSize=LeninSize
                        ).exclude(pk=LeninCode).exists():
                            return JsonResponse({'warn': 'This Lenin Category, Type and Size already exist.'})

                        Lenin_instance.LeninCategory = LeninCategory_instance
                        Lenin_instance.LeninType = LeninType
                        Lenin_instance.LeninSize = LeninSize
                        Lenin_instance.ColorCode = ColorCode
                        Lenin_instance.MaxWashCount = MaxWashCount
                        Lenin_instance.InfectionCategory = InfectionCategory
                        Lenin_instance.Remarks = Remarks

                    Lenin_instance.save()
                    return JsonResponse({'success': 'Lenin Details updated successfully'})
                except LeninMaster_Details.DoesNotExist:
                    return JsonResponse({'error': 'Lenin Details not found'}, status=404)

            # ---------- CREATE ----------
            else:
                if LeninMaster_Details.objects.filter(
                    LeninCategory=LeninCategory_instance,
                    LeninType=LeninType,
                    LeninSize=LeninSize
                ).exists():
                    return JsonResponse({'warn': 'The Lenin Details are already present.'})

                LeninMaster_Details.objects.create(
                    LeninCategory=LeninCategory_instance,
                    LeninType=LeninType,
                    LeninSize=LeninSize,
                    ColorCode=ColorCode,
                    MaxWashCount=MaxWashCount,
                    InfectionCategory=InfectionCategory,
                    created_by=created_by,
                    Remarks=Remarks
                )
                return JsonResponse({'success': 'Lenin Details added successfully'})

        except Exception as e:
            return JsonResponse({'error': f'Internal Server Error: {str(e)}'}, status=500)
            
    # ---------- GET ----------
    else:
        try: 
            data = []
            lenin_items = LeninMaster_Details.objects.all()            
            for le in lenin_items:
                data.append({
                    'LeninCode': le.LeninCode,
                    'ColorCode': le.ColorCode,
                    'created_by': le.created_by,
                    'catgId': le.LeninCategory.pk, 
                    'LeninCategory': le.LeninCategory.LeninCategory,
                    'LeninType': le.LeninType,
                    'LeninSize': le.LeninSize,
                    'MaxWashCount': le.MaxWashCount,
                    'InfectionCategory': le.InfectionCategory,
                    "Status": 'Active' if le.Status else 'Inactive',
                    "Remarks": le.Remarks                    
                })    
                
            return JsonResponse(data=data, safe=False)    
        except Exception as e:
            return JsonResponse({'err': str(e)})
@csrf_exempt
@require_http_methods(["POST", "GET"])
def Lenin_MinMax_Master_Detials_link(request):

    # ========================= POST =========================
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            Id = data.get('Id', '')
            isDelete = data.get('isDelete', False)  # Added Delete flag
            Location = data.get('Location', '')
            Department = data.get('Department', '')
            LeninCategory = data.get('LeninCategory', '')
            LeninType = data.get('LeninType', '')
            PrevMin = data.get('PrevMin', 0)
            CurrMin = data.get('Min', 0)
            PrevMax = data.get('PrevMax', 0)
            CurrMax = data.get('Max', 0)
            CurrentStock = data.get('CurrentStock', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
            NurseStation_id = data.get('NurseStation', '')

            if Statusedit and Id:
                        Lenin_instance = Dept_Wise_Lenin_min_max_Details.objects.get(pk=Id)
                        Lenin_instance.Status = not Lenin_instance.Status
                        Lenin_instance.save()
                        status_str = 'Active' if Lenin_instance.Status else 'Inactive'
                        return JsonResponse({'success': f'Status updated to {status_str}'})
            # ================= DELETE =================
            if isDelete and Id:
                try:
                    Lenin_instance = Dept_Wise_Lenin_min_max_Details.objects.get(pk=Id)
                    Lenin_instance.delete()
                    return JsonResponse({'success': 'Lenin Details deleted successfully'})
                except Dept_Wise_Lenin_min_max_Details.DoesNotExist:
                    return JsonResponse({'error': 'Lenin Details not found'}, status=404)

            # ===== SAFE FK FETCH =====
            Location_instance = Location_Detials.objects.filter(pk=1).first()
            Department_instance = Department_Detials.objects.filter(pk=Department).first()
            LeninType_instance = LeninMaster_Details.objects.filter(pk=LeninType).first()
            LeninCategory_instance = Lenin_Catg_Master_Details.objects.filter(pk=LeninCategory).first()
            NurseStation_instance = NurseStationMaster.objects.filter(pk=NurseStation_id).first()

            # ================= UPDATE =================
            if Id:
                try:
                    Lenin_instance = Dept_Wise_Lenin_min_max_Details.objects.get(pk=Id)

                    if Statusedit:
                        Lenin_instance.Status = not Lenin_instance.Status
                        Lenin_instance.save()
                        status_str = 'Active' if Lenin_instance.Status else 'Inactive'
                        return JsonResponse({'success': f'Status updated to {status_str}'})

                    # Duplicate check for update
                    if Dept_Wise_Lenin_min_max_Details.objects.filter(
                        Location=Location_instance,
                        Department=Department_instance,
                        LeninCategory=LeninCategory_instance,
                        LeninType=LeninType_instance,
                        NurseStation=NurseStation_instance
                    ).exclude(pk=Id).exists():
                        return JsonResponse({'warn': 'The same LeninType already exists.'})

                    Lenin_instance.Location = Location_instance
                    Lenin_instance.Department = Department_instance
                    Lenin_instance.LeninCategory = LeninCategory_instance
                    Lenin_instance.LeninType = LeninType_instance
                    Lenin_instance.NurseStation = NurseStation_instance

                    Lenin_instance.Prev_Minimum_count = Lenin_instance.Curr_Minimum_count
                    Lenin_instance.Curr_Minimum_count = CurrMin

                    Lenin_instance.Prev_Maximum_count = Lenin_instance.Curr_Maximum_count
                    Lenin_instance.Curr_Maximum_count = CurrMax

                    Lenin_instance.Current_Stock = CurrentStock
                    Lenin_instance.save()

                    return JsonResponse({'success': 'Lenin Dept Wise Min and Max Details updated successfully'})

                except Dept_Wise_Lenin_min_max_Details.DoesNotExist:
                    return JsonResponse({'error': 'Lenin MinMax Details not found'}, status=404)

            # ================= CREATE =================
            else:
                if Dept_Wise_Lenin_min_max_Details.objects.filter(
                    Location=Location_instance,
                    Department=Department_instance,
                    LeninCategory=LeninCategory_instance,
                    LeninType=LeninType_instance,
                    NurseStation=NurseStation_instance
                ).exists():
                    return JsonResponse({'warn': 'The same LeninType already exists.'})

                Dept_Wise_Lenin_min_max_Details.objects.create(
                    Location=Location_instance,
                    Department=Department_instance,
                    LeninCategory=LeninCategory_instance,
                    LeninType=LeninType_instance,
                    Prev_Minimum_count=PrevMin or 0,
                    Curr_Minimum_count=CurrMin,
                    Prev_Maximum_count=PrevMax or 0,
                    Curr_Maximum_count=CurrMax,
                    Current_Stock=CurrentStock,
                    created_by=created_by,
                    NurseStation=NurseStation_instance
                )

                return JsonResponse({'success': 'Lenin Dept Wise Min and Max Details added successfully'})

        except Exception as e:
            print("🔥 ERROR:", str(e))
            return JsonResponse({'error': str(e)}, status=500)

    # ========================= GET =========================
    elif request.method == 'GET':
        try:
            Lenin_Master = Dept_Wise_Lenin_min_max_Details.objects.all()

            Lenin_Master_data = [
                {
                    'id': Lenin.Id,
                    'LocationId': Lenin.Location.pk if Lenin.Location else '',
                    'LocationName': Lenin.Location.Location_Name if Lenin.Location else '',
                    'DepartmentId': Lenin.Department.pk if Lenin.Department else '',
                    'DepartmentName': Lenin.Department.Department_Name if Lenin.Department else '',
                    'LeninTypeId': Lenin.LeninType.pk if Lenin.LeninType else '',
                    'catgId': Lenin.LeninCategory.pk if Lenin.LeninCategory else '',
                    'LeninCategory': Lenin.LeninCategory.LeninCategory if Lenin.LeninCategory else '',
                    'LeninType': Lenin.LeninType.LeninType if Lenin.LeninType else '',
                    'LeninSize': Lenin.LeninType.LeninSize if Lenin.LeninType else '',
                    'PrevMin': Lenin.Prev_Minimum_count,
                    'Min': Lenin.Curr_Minimum_count,
                    'PrevMax': Lenin.Prev_Maximum_count,
                    'Max': Lenin.Curr_Maximum_count,
                    'CurrentStock': Lenin.Current_Stock,
                    'Status': 'Active' if Lenin.Status else 'Inactive',
                    'created_by': Lenin.created_by,
                    # Added ID field for React edit form mapping
                    'NurseStationId': Lenin.NurseStation.pk if Lenin.NurseStation else '',
                    'NurseStation': Lenin.NurseStation.NurseStationName if Lenin.NurseStation else ''
                }
                for Lenin in Lenin_Master
            ]

            return JsonResponse(Lenin_Master_data, safe=False)

        except Exception as e:
            print(" ERROR:", str(e))
            return JsonResponse({'error': str(e)}, status=500)

# @csrf_exempt
# @require_http_methods(["POST", "GET"])
# def Lenin_MinMax_Master_Detials_link(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             Id = data.get('Id', '')
#             Location = data.get('Location', '')
#             Department = data.get('Department', '')
#             LeninCategory = data.get('LeninCategory', '')
#             LeninType = data.get('LeninType', '')
#             PrevMin = data.get('PrevMin', 0)
#             CurrMin = data.get('Min', 0)
#             PrevMax = data.get('PrevMax', 0)
#             CurrMax = data.get('Max', 0)
#             Statusedit = data.get('Statusedit', False)
#             created_by = data.get('created_by', '')

#             # Fetch related instances
#             Location_instance = Location_Detials.objects.get(pk=Location) if Location else None
#             Department_instance = Department_Detials.objects.get(pk=Department) if Department else None
#             LeninType_instance = LeninMaster_Details.objects.get(pk=LeninType) if LeninType else None
#             LeninCategory_instance = Lenin_Catg_Master_Details.objects.get(pk=LeninCategory) if LeninCategory else None

#             if Id:
#                 try:
#                     Lenin_instance = Dept_Wise_Lenin_min_max_Details.objects.get(pk=Id)
#                     if Statusedit:
#                         Lenin_instance.Status = not Lenin_instance.Status
#                         Lenin_instance.save()
#                         return JsonResponse({'success': 'Lenin status updated successfully'})
                    
                    
#                     if Dept_Wise_Lenin_min_max_Details.objects.filter(
#                             Q(Location=Location_instance)&
#                             Q(Department=Department_instance)&
#                             Q(LeninCategory=LeninCategory_instance)&
#                             Q(LeninType=LeninType_instance)&
#                             ~Q(Curr_Minimum_count=CurrMin)&
#                             ~Q(Curr_Maximum_count=CurrMax),
#                     ).exclude(pk=Id).exists():
#                             return JsonResponse({'warn': 'The Location, Department, LeninCategory, LeninType, Min, and Max are already present.'})
                    
#                     Lenin_instance.Location = Location_instance
#                     Lenin_instance.Department = Department_instance
#                     Lenin_instance.LeninCategory = LeninCategory_instance
#                     Lenin_instance.LeninType = LeninType_instance
#                     Lenin_instance.Prev_Minimum_count = Lenin_instance.Curr_Minimum_count
#                     Lenin_instance.Curr_Minimum_count = CurrMin
#                     Lenin_instance.Prev_Maximum_count = Lenin_instance.Curr_Maximum_count
#                     Lenin_instance.Curr_Maximum_count = CurrMax
#                     Lenin_instance.save()
#                     return JsonResponse({'success': 'Lenin Dept Wise Min and Max Details updated successfully'})
#                 except Dept_Wise_Lenin_min_max_Details.DoesNotExist:
#                     return JsonResponse({'error': 'Lenin MinMax Details not found'})
#             else:
#                 if Dept_Wise_Lenin_min_max_Details.objects.filter(
#                     Q(Location=Location_instance)&
#                     Q(Department=Department_instance)&
#                     Q(LeninCategory=LeninCategory_instance)&
#                     Q(LeninType=LeninType_instance)&
#                     ~Q(Curr_Minimum_count=CurrMin)&
#                     ~Q(Curr_Maximum_count=CurrMax),
                        
#                 ).exists():
#                     return JsonResponse({'warn': 'The Lenin Dept Wise Min and Max Details are already present.'})

#                 Dept_Wise_Lenin_min_max_Details.objects.create(
#                     Location=Location_instance,
#                     Department=Department_instance,
#                     LeninCategory=LeninCategory_instance,
#                     LeninType=LeninType_instance,
#                     Prev_Minimum_count=PrevMin or 0,
#                     Curr_Minimum_count=CurrMin,
#                     Prev_Maximum_count=PrevMax or 0,
#                     Curr_Maximum_count=CurrMax,
#                     created_by=created_by
#                 )
#                 return JsonResponse({'success': 'Lenin Dept Wise Min and Max Details added successfully'})
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
    
#     elif request.method == 'GET':
#         try:
#             Lenin_Master = Dept_Wise_Lenin_min_max_Details.objects.all()
#             Lenin_Master_data = [
#                 {
#                     'id': Lenin.Id,
#                     'LocationId': Lenin.Location.pk,
#                     'LocationName': Lenin.Location.Location_Name,
#                     'DepartmentId': Lenin.Department.pk,
#                     'DepartmentName': Lenin.Department.Department_Name,
#                     'LeninTypeId': Lenin.LeninType.pk,
#                     'CatgId': Lenin.LeninCategory.pk,
#                     'LeninCategory': Lenin.LeninCategory.LeninCategory,
#                     'LeninType': Lenin.LeninType.LeninType,
#                     'LeninSize': Lenin.LeninType.LeninSize,
#                     'PrevMin': Lenin.Prev_Minimum_count,
#                     'Min': Lenin.Curr_Minimum_count,
#                     'PrevMax': Lenin.Prev_Maximum_count,
#                     'Max': Lenin.Curr_Maximum_count,
#                     'Status': 'Active' if Lenin.Status else 'Inactive',
#                     'created_by': Lenin.created_by,
#                 }
#                 for Lenin in Lenin_Master
#             ]
#             return JsonResponse(Lenin_Master_data, safe=False)
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



# @csrf_exempt
# @require_http_methods(["POST", "GET"])
# def Lenin_MinMax_Master_Detials_link(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print(data,'data')
#             Id = data.get('Id', '')
#             Location = data.get('Location', '')
#             Department = data.get('Department', '')
#             LeninCategory = data.get('LeninCategory', '')
#             LeninType = data.get('LeninType', '')
#             PrevMin = data.get('PrevMin', 0)
#             CurrMin = data.get('Min', 0)
#             PrevMax = data.get('PrevMax', 0)
#             CurrMax = data.get('Max', 0)
#             Statusedit = data.get('Statusedit', False)
#             created_by = data.get('created_by', '')

#             # Fetch related instances
#             Location_instance = Location_Detials.objects.get(pk=Location) if Location else None
#             Department_instance = Department_Detials.objects.get(pk=Department) if Department else None
#             LeninType_instance = LeninMaster_Details.objects.get(pk=LeninType) if LeninType else None
#             LeninCategory_instance = Lenin_Catg_Master_Details.objects.get(pk=LeninCategory) if LeninCategory else None

#             if Id:
#                 try:
#                     Lenin_instance = Dept_Wise_Lenin_min_max_Details.objects.get(pk=Id)
#                     if Statusedit:
#                         Lenin_instance.Status = not Lenin_instance.Status
#                     else:
#                         if Dept_Wise_Lenin_min_max_Details.objects.filter(
#                                 Location=Location_instance,
#                                 Department=Department_instance,
#                                 LeninCategory=LeninCategory_instance,
#                                 LeninType=LeninType_instance,
#                                 Curr_Minimum_count=CurrMin,
#                                 Curr_Maximum_count=CurrMax
#                             ).exists():
#                             return JsonResponse({'warn': 'The Location, Department, LeninCategory, LeninType, Min, and Max are already present.'})
#                         else:
#                             Lenin_instance.Location = Location_instance
#                             Lenin_instance.Department = Department_instance
#                             Lenin_instance.LeninCategory = LeninCategory_instance
#                             Lenin_instance.LeninType = LeninType_instance
#                             Lenin_instance.Prev_Minimum_count = Lenin_instance.Curr_Minimum_count
#                             Lenin_instance.Curr_Minimum_count = CurrMin
#                             Lenin_instance.Prev_Maximum_count = Lenin_instance.Curr_Maximum_count
#                             Lenin_instance.Curr_Maximum_count = CurrMax
#                     Lenin_instance.save()
#                     return JsonResponse({'success': 'Lenin Dept Wise Min and Max Details updated successfully'})
#                 except Dept_Wise_Lenin_min_max_Details.DoesNotExist:
#                     return JsonResponse({'error': 'Lenin MinMax Details not found'})
#             else:
#                 if Dept_Wise_Lenin_min_max_Details.objects.filter(
#                         Q(Location=Location_instance) &
#                        Q(Department=Department_instance) &
#                         Q(LeninCategory=LeninCategory_instance) &
#                         ~Q(Curr_Minimum_count=CurrMin) &
#                         ~Q(Curr_Maximum_count=CurrMax)&
#                         ~Q(LeninType=LeninType_instance),

#                 ).exclude(Id=Id).exists():
#                     return JsonResponse({'warn': 'The Lenin Dept Wise Min and Max Details are already present.'})
#                 Dept_Wise_Lenin_min_max_Details.objects.create(
#                     Location=Location_instance,
#                     Department=Department_instance,
#                     LeninCategory=LeninCategory_instance,
#                     LeninType=LeninType_instance,
#                     Prev_Minimum_count=PrevMin or 0,
#                     Curr_Minimum_count=CurrMin,
#                     Prev_Maximum_count=PrevMax or 0,
#                     Curr_Maximum_count=CurrMax,
#                     created_by=created_by
#                 )
#                 return JsonResponse({'success': 'Lenin Dept Wise Min and Max Details added successfully'})
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
    
#     elif request.method == 'GET':
#         try:
#             Lenin_Master = Dept_Wise_Lenin_min_max_Details.objects.all()
#             Lenin_Master_data = [
#                 {
#                     'id': Lenin.Id,
#                     'LocationId': Lenin.Location.pk,
#                     'LocationName': Lenin.Location.Location_Name,
#                     'DepartmentId': Lenin.Department.pk,
#                     'DepartmentName': Lenin.Department.Department_Name,
#                     'LeninTypeId': Lenin.LeninType.pk,
#                     'CatgId': Lenin.LeninCategory.pk,
#                     'LeninCategory': Lenin.LeninCategory.LeninCategory,
#                     'LeninType': Lenin.LeninType.LeninType,
#                     'LeninSize': Lenin.LeninType.LeninSize,
#                     'PrevMin': Lenin.Prev_Minimum_count,
#                     'Min': Lenin.Curr_Minimum_count,
#                     'PrevMax': Lenin.Prev_Maximum_count,
#                     'Max': Lenin.Curr_Maximum_count,
#                     'Status': 'Active' if Lenin.Status else 'Inactive',
#                     'created_by': Lenin.created_by,
#                 }
#                 for Lenin in Lenin_Master
#             ]
#             return JsonResponse(Lenin_Master_data, safe=False)
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
# Import your models here...

@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lenin_Stock_Detials_link(request):
    # ================= GET METHOD =================
    if request.method == 'GET':
        try:
            # Ordering fixed: Newest on Top (Top to Bottom)
            stocks = Lenin_Stock_Details.objects.select_related('LeninCategory', 'LeninType').all().order_by('pk')
            
            data = []
            for s in stocks:
                data.append({
                    'StockId': s.pk,
                    # We send the Names (Strings) back to the frontend
                    'LeninCategory': s.LeninCategory.LeninCategory if s.LeninCategory else '',
                    'LeninType': s.LeninType.LeninType if s.LeninType else '',
                    'LeninSize': s.LeninType.LeninSize if s.LeninType else '',
                    'Quantity': s.Quantity, # Integer
                    'Status': 'Available' if s.Status else 'Unavailable',
                    'created_by': s.created_by or '',
                })
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # ================= POST METHOD =================
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action', '')
            StockId = data.get('StockId')

            # --- 1. DELETE ACTION ---
            if action == 'delete' and StockId:
                Lenin_Stock_Details.objects.filter(pk=StockId).delete()
                return JsonResponse({'success': 'Record deleted successfully'})

            # --- 2. STATUS TOGGLE ACTION ---
            if data.get('Statusedit', False) and StockId:
                instance = Lenin_Stock_Details.objects.get(pk=StockId)
                instance.Status = not instance.Status
                instance.save()
                return JsonResponse({'success': 'Status updated successfully'})

            # --- 3. CREATE / UPDATE LOGIC ---
            # Extract values as Strings from React
            cat_name = data.get('LeninCategory') 
            type_name = data.get('LeninType')
            raw_qty = data.get('Quantity')
            user = data.get('created_by', '')

            # Validation: Check for empty strings
            if not cat_name or not type_name or raw_qty in [None, ""]:
                return JsonResponse({'error': 'Please select Category, Type and enter Quantity'}, status=400)

            # Convert Quantity to Integer safely
            try:
                final_qty = int(raw_qty)
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Quantity must be a valid number'}, status=400)

            # Fetch Master instances using the String Name
            try:
                cat_inst = Lenin_Catg_Master_Details.objects.get(LeninCategory=cat_name)
                type_inst = LeninMaster_Details.objects.get(LeninType=type_name)
            except (Lenin_Catg_Master_Details.DoesNotExist, LeninMaster_Details.DoesNotExist):
                 return JsonResponse({'error': 'Selected Category or Type Name not found in Master table'}, status=404)

            if StockId: # UPDATE
                if Lenin_Stock_Details.objects.filter(LeninCategory=cat_inst, LeninType=type_inst).exclude(pk=StockId).exists():
                    return JsonResponse({'warn': 'This combination already exists in stock'})
                
                instance = Lenin_Stock_Details.objects.get(pk=StockId)
                instance.LeninCategory = cat_inst
                instance.LeninType = type_inst
                instance.Quantity = final_qty
                instance.save()
                return JsonResponse({'success': 'Stock updated successfully'})
            
            else: # CREATE
                if Lenin_Stock_Details.objects.filter(LeninCategory=cat_inst, LeninType=type_inst).exists():
                    return JsonResponse({'warn': 'Stock entry already exists for this combination'})
                
                Lenin_Stock_Details.objects.create(
                    LeninCategory=cat_inst,
                    LeninType=type_inst,
                    Quantity=final_qty,
                    created_by=user,
                    Status=True
                )
                return JsonResponse({'success': 'Stock added successfully'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)        
        # def Linen_Issue_Details_Link(request):

#     # ========================== POST ==========================
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             issue_id = data.get("Issue_Id")
#             issue_date = data.get("Issue_date")
#             issue_shift = data.get("Issue_shift")
#             Department_id = data.get("Department")
#             linen_type_id = data.get("LinenType")
#             quantity_issued = data.get("Quantity_issued")
#             issued_by = data.get("Issued_By")
#             Status = data.get("status") 

#             # if issue_date:
#             #     issue_date = datetime.strptime(
#             #         issue_date, "%Y-%m-%dT%H:%M"
#             #     ).date()

#             department_obj = (
#                 Department_Detials.objects.get(pk=Department_id)
#                 if Department_id else None
#             )


#             # lenin dept 
#             if Status == "issue":
#                 lenin_debt = Dept_Wise_Lenin_min_max_Details.objects.filter(Department=department_obj).first()
#                 lenin_debt.Current_Stock+=quantity_issued
#                 lenin_debt.save()
  
#             else:
#                 lenin_type = LeninMaster_Details.objects.filter(pk=linen_type_id).first()
#                 leni_stock = Lenin_Stock_Details.objects.filter(LeninType=lenin_type,Status=True).first()
#                 leni_stock.Quantity-=quantity_issued
#                 leni_stock.save() 
                


#             linen_type_obj = (
#                 LeninMaster_Details.objects.get(pk=linen_type_id)
#                 if linen_type_id else None
#             )

#             # ================= UPDATE =================
#             if issue_id:
#                 issue = LinenIssue.objects.get(pk=issue_id)

#                 if Status:
#                     issue.Status = not issue.Status
#                     issue.save()
#                     return JsonResponse({"message": "Status updated successfully"})

#                 issue.issue_date = issue_date
#                 issue.issue_shift = issue_shift
#                 issue.department = department_obj
#                 issue.linen_type = linen_type_obj
#                 issue.quantity_issued = quantity_issued
#                 issue.issued_by = issued_by
#                 issue.Status =Status
#                 issue.save()

#                 return JsonResponse({"message": "Linen Issue updated successfully"})

#             # ================= CREATE =================
#             LinenIssue.objects.create(
#                 issue_date=issue_date,
#                 issue_shift=issue_shift,
#                 department=department_obj,
#                 linen_type=linen_type_obj,
#                 quantity_issued=quantity_issued,
#                 issued_by=issued_by,
#                 Status=Status
#             )

#             return JsonResponse({"message": "Linen Issue created successfully"})

#         except Exception as e:
#             print("POST ERROR:", str(e))
#             return JsonResponse({"error": str(e)}, status=500)

#     # ========================== GET ==========================
#     elif request.method == "GET":
#         try:
#             issues = LinenIssue.objects.select_related(
#                 "department", "linen_type"
#             ).order_by('created_at')

#             data = []
#             for issue in issues:
#                 data.append({
#                     "id": issue.issue_id,
#                     "Issue_Id": issue.issue_id,

#                 "Issue_date": issue.issue_date,
#                 "Issue_shift": issue.issue_shift,

#                # ✅ Department
               
#                 "Department": issue.department.Department_Name if issue.department else "",

#                 # ✅ Linen Type
                
#                 "LinenType": issue.linen_type.LeninType if issue.linen_type else "",
#                 "LinenSize": issue.linen_type.LeninSize if issue.linen_type else "",

#                 "Quantity_issued": issue.quantity_issued,
#                 "Issued_By": issue.issued_by,
#                 "Status": issue.Status,
#                 })

#             return JsonResponse(data, safe=False)

#         except Exception as e:
#             print("GET ERROR:", str(e))
#             return JsonResponse({"error": str(e)}, status=500)
# 
@csrf_exempt
@require_http_methods(["POST", "GET"])
def Linen_Issue_Details_Link(request):
    # ========================== POST (CREATE, UPDATE & DELETE) ==========================
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            issue_id = data.get("Issue_Id")
            isDelete = data.get("isDelete", False)  # Capture the delete flag
            issue_date = data.get("Issue_date")
            issue_shift = data.get("Issue_shift")
            department_id = data.get("Department")
            linen_type_id = data.get("LinenType")
            quantity_issued = int(data.get("Quantity_issued", 0))
            issued_by = data.get("Issued_By")
            status = data.get("status")  # Frontend sends "Issued" or "Collected"

            # ---------- DELETE LOGIC (NEW) ----------
            if isDelete and issue_id:
                try:
                    issue_instance = LinenIssue.objects.get(pk=issue_id)
                    issue_instance.delete()
                    return JsonResponse({"success": "Linen Issue deleted successfully"})
                except LinenIssue.DoesNotExist:
                    return JsonResponse({"error": "Record not found"}, status=404)

            # ---------- EXISTING VALIDATION ----------
            department_obj = Department_Detials.objects.filter(Department_Id=department_id).first()
            linen_type_obj = LeninMaster_Details.objects.filter(LeninType=linen_type_id).first()

            if not department_obj or not linen_type_obj:
                return JsonResponse({"error": "Invalid Department or Linen Type ID"}, status=400)

            # ---------- UPDATE ----------
            if issue_id:
                try:
                    issue = LinenIssue.objects.get(pk=issue_id)
                    issue.issue_date = issue_date
                    issue.issue_shift = issue_shift
                    issue.department = department_obj
                    issue.linen_type = linen_type_obj
                    issue.quantity_issued = quantity_issued
                    issue.issued_by = issued_by
                    issue.Status = status 
                    issue.save()
                    return JsonResponse({"success": "Linen Issue updated successfully"})
                except LinenIssue.DoesNotExist:
                    return JsonResponse({"error": "Record not found"}, status=404)

            # ---------- CREATE ----------
            else:
                issue = LinenIssue.objects.create(
                    issue_date=issue_date,
                    issue_shift=issue_shift,
                    department=department_obj,
                    linen_type=linen_type_obj,
                    quantity_issued=quantity_issued,
                    issued_by=issued_by,
                    Status=status               

                )

                # ---------- STOCK UPDATE ----------
                print('i----- a')
                if status == "Issued":
                    dept_stock = Dept_Wise_Lenin_min_max_Details.objects.filter(Department=department_obj).first()
                    if dept_stock:
                        dept_stock.Current_Stock += quantity_issued
                        dept_stock.save()
                    
                        print('i ---------- a')
                    lenin_stock = Lenin_Stock_Details.objects.filter(LeninType__LeninType=linen_type_id, Status=True).first()
                    print('i a',lenin_stock)
                    if lenin_stock:
                        lenin_stock.Quantity -= quantity_issued
                        lenin_stock.save()

                elif status  == "Collected":
                    print('i a')
                    lenin_stock = Lenin_Stock_Details.objects.filter(LeninType__LeninType=linen_type_id, Status=True).first()
                    print('i a',lenin_stock)
                    if lenin_stock:
                        lenin_stock.Quantity -= quantity_issued
                        lenin_stock.save()
                    dept_stock = Dept_Wise_Lenin_min_max_Details.objects.filter(Department=department_obj).first()
                    if dept_stock:
                        dept_stock.Current_Stock += quantity_issued
                        dept_stock.save()
                    
                        print('i ---------- a')
                return JsonResponse({"success": "Linen Issue created successfully"})

        except Exception as e:
            print("POST ERROR:", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    # ========================== GET (LIST) ==========================
    elif request.method == "GET":
        try:
            issues = LinenIssue.objects.select_related("department", "linen_type").all().order_by("pk")            
            data = []
            for issue in issues:                
                dept_name = getattr(issue.department, 'Department_Name', '') if issue.department else ""
                linen_type_name = getattr(issue.linen_type, 'LeninType', '') if issue.linen_type else ""
                linen_size = getattr(issue.linen_type, 'LeninSize', '') if issue.linen_type else ""

                data.append({
                    "Issue_Id": issue.pk,
                    "Issue_date": str(issue.issue_date) if issue.issue_date else "", 
                    "Issue_shift": issue.issue_shift or "",
                    "DepartmentId": issue.department.pk if issue.department else None,
                    "Department": dept_name,
                    "LinenTypeId": issue.linen_type.pk if issue.linen_type else None,
                    "LinenType": linen_type_name,
                    "LinenSize": linen_size,
                    "Quantity_issued": issue.quantity_issued or 0,
                    "Issued_By": issue.issued_by or "",
                    "Status": issue.Status or "", 
                })

            return JsonResponse(data, safe=False)
            
            
        except Exception as e:
            print("GET ERROR DETAILS:", str(e))
            return JsonResponse({"error": str(e)}, status=500)
        
def update_stock(department, linen_type, qty, status):
    """
    status = 'Issue' or 'Collection'
    """

    # Central stock
    central_stock = Lenin_Stock_Details.objects.filter(
        LeninType=linen_type,
        Status=True
    ).first()

    # Dept stock
    dept_stock = Dept_Wise_Lenin_min_max_Details.objects.filter(
        Department=department,
        LeninType=linen_type,
        Status=True
    ).first()

    if not central_stock or not dept_stock:
        raise Exception("Stock record missing")

    if status.lower() == "issue":
        if central_stock.Quantity < qty:
            raise Exception("Insufficient central stock")

        central_stock.Quantity -= qty
        dept_stock.Current_Stock += qty

    elif status.lower() == "collection":
        if dept_stock.Current_Stock < qty:
            raise Exception("Insufficient department stock")

        central_stock.Quantity += qty
        dept_stock.Current_Stock -= qty

    central_stock.save()
    dept_stock.save()

# @csrf_exempt
# @require_http_methods(["GET", "POST", "OPTIONS"])
# def Lenin_Laundry_Vendor_Details_Link(request):
#     # ===================== GET =====================
#     if request.method == "GET":
#         try:
#             # Order by newest first
#             vendors = LeninLaundryVendor.objects.select_related("LeninCategory").all().order_by('pk')
#             data = []
#             for v in vendors:
#                 data.append({
#                     "id": v.pk,
#                     "LaundryVendorName": v.LaundryVendorName,
#                     "LaundryPhone": v.LaundryPhone,
#                     "LaundryAddress": v.LaundryAddress,
#                     "LeninCategory": v.LeninCategory.LeninCategory if v.LeninCategory else "", # Store Name for lookup
#                     "LeninCategoryName": v.LeninCategory.LeninCategory if v.LeninCategory else "",
#                     "LaundryContractStartDate": str(v.LaundryContractStartDate) if v.LaundryContractStartDate else "",
#                     "LaundryContractEndDate": str(v.LaundryContractEndDate) if v.LaundryContractEndDate else "",
#                     "Amount": float(v.Amount or 0),
#                     "Status": "Active"
#                 })
#             return JsonResponse(data, safe=False)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     # ===================== POST =====================
#     elif request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             action = data.get("action", "create")
#             vendor_id = data.get("id")

#             # --- DELETE ACTION ---
#             if action == "delete":
#                 if not vendor_id:
#                     return JsonResponse({"error": "Vendor ID required"}, status=400)
#                 LeninLaundryVendor.objects.filter(pk=vendor_id).delete()
#                 return JsonResponse({"success": "Vendor deleted successfully"})

#             # --- CREATE / UPDATE ACTION ---
#             # Get category by Name (String) to match your previous pattern
#             category_name = data.get("LeninCategory")
#             category_obj = None
#             if category_name:
#                 category_obj = Lenin_Catg_Master_Details.objects.get(LeninCategory=category_name)

#             if vendor_id: # UPDATE
#                 vendor = LeninLaundryVendor.objects.get(pk=vendor_id)
#                 vendor.LaundryVendorName = data.get("LaundryVendorName")
#                 vendor.LaundryPhone = data.get("LaundryPhone")
#                 vendor.LaundryAddress = data.get("LaundryAddress")
#                 vendor.LeninCategory = category_obj
#                 vendor.LaundryContractStartDate = data.get("LaundryContractStartDate") or None
#                 vendor.LaundryContractEndDate = data.get("LaundryContractEndDate") or None
#                 vendor.Amount = float(data.get("Amount") or 0)
#                 vendor.save()
#                 return JsonResponse({"success": "Vendor updated successfully"})
            
#             else: # CREATE
#                 LeninLaundryVendor.objects.create(
#                     LaundryVendorName=data.get("LaundryVendorName"),
#                     LaundryPhone=data.get("LaundryPhone"),
#                     LaundryAddress=data.get("LaundryAddress"),
#                     LeninCategory=category_obj,
#                     LaundryContractStartDate=data.get("LaundryContractStartDate") or None,
#                     LaundryContractEndDate=data.get("LaundryContractEndDate") or None,
#                     Amount=float(data.get("Amount") or 0)
#                 )
#                 return JsonResponse({"success": "Vendor created successfully"})

#         except Lenin_Catg_Master_Details.DoesNotExist:
#             return JsonResponse({"error": "Invalid Lenin Category Name"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST", "GET"])
def Laundry_Details_Link(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            LaundryId = data.get('LaundryId', '')
            isDelete = data.get('isDelete', False)  # Added Delete flag
            BatchNo = data.get('BatchNo', '')
            WashType = data.get('WashType', '')
            StartTime = data.get('StartTime', '')
            EndTime = data.get('EndTime', '')
            VendorType = data.get('VendorType', '')
            VendorName = data.get('VendorName', '')
            VendorLocation = data.get('VendorLocation', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            # ---------------- DELETE (NEW) ----------------
            if isDelete and LaundryId:
                try:
                    laundry_instance = LinenLaundry.objects.get(pk=LaundryId)
                    laundry_instance.delete()
                    return JsonResponse({'success': 'Laundry record deleted successfully'})
                except LinenLaundry.DoesNotExist:
                    return JsonResponse({'error': 'Laundry record not found'}, status=404)

            # ---------------- UPDATE ----------------
            if LaundryId:
                try:
                    laundry_instance = LinenLaundry.objects.get(pk=LaundryId)

                    if Statusedit:
                        laundry_instance.Status = (
                            'Inactive' if laundry_instance.Status == 'Active' else 'Active'
                        )
                        laundry_instance.save()
                        return JsonResponse({'success': 'Laundry status updated successfully'})

                    laundry_instance.BatchNo = BatchNo
                    laundry_instance.WashType = WashType
                    laundry_instance.StartTime = StartTime
                    laundry_instance.EndTime = EndTime
                    laundry_instance.VendorType = VendorType

                    if VendorType == 'OUTSOURCE':
                        laundry_instance.VendorName = VendorName
                        laundry_instance.VendorLocation = VendorLocation
                    else:
                        laundry_instance.VendorName = ''
                        laundry_instance.VendorLocation = ''

                    laundry_instance.save()
                    return JsonResponse({'success': 'Laundry details updated successfully'})
                except LinenLaundry.DoesNotExist:
                    return JsonResponse({'error': 'Laundry record not found'}, status=404)

            # ---------------- CREATE ----------------
            else:
                # Duplicate Batch Check
                if LinenLaundry.objects.filter(BatchNo=BatchNo).exists():
                    return JsonResponse({'warn': 'Batch No already exists'})

                LinenLaundry.objects.create(
                    BatchNo=BatchNo,
                    WashType=WashType,
                    StartTime=StartTime,
                    EndTime=EndTime,
                    VendorType=VendorType,
                    VendorName=VendorName if VendorType == 'OUTSOURCE' else '',
                    VendorLocation=VendorLocation if VendorType == 'OUTSOURCE' else '',
                    created_by=created_by
                )

                return JsonResponse({'success': 'Laundry details added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse(
                {'error': f'An internal server error occurred: {str(e)}'},
                status=500
            )

    # ---------------- GET ----------------
    elif request.method == 'GET':
        try:
            # Note: Ensure 'created_at' exists in your model, or remove order_by
            laundry_entries = LinenLaundry.objects.all().order_by('pk')

            laundry_data = [
                {
                    'LaundryId': l.pk,
                    'BatchNo': l.BatchNo,
                    'WashType': l.WashType,
                    'StartTime': l.StartTime,
                    'EndTime': l.EndTime,
                    'VendorType': l.VendorType,
                    'VendorName': l.VendorName,
                    'VendorLocation': l.VendorLocation,
                    'Status': l.Status,
                    'created_by': l.created_by,
                }
                for l in laundry_entries
            ]

            return JsonResponse(laundry_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse(
                {'error': f'An internal server error occurred: {str(e)}'},
                status=500
            )
@csrf_exempt
@require_http_methods(["POST", "GET", "DELETE"])
def QC_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            Id = data.get('Id', '')
            
            # --- DELETE LOGIC FOR YOUR BUTTON ---
            is_delete = data.get('isDelete', False)
            if Id and is_delete:
                Dept_Wise_QC_Details.objects.filter(pk=Id).delete()
                return JsonResponse({'success': 'QC details deleted successfully'})
            # ------------------------------------

            Location = data.get('Location', '')
            Department = data.get('Department', '')
            LeninCategory = data.get('LeninCategory', '')
            LeninType = data.get('LeninType', '')
            QCValue = data.get('QCValue', 0)
            QCStatus = data.get('QCStatus', 'Pending')
            Inspector = data.get('Inspector', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            Location_instance = Location_Detials.objects.get(pk=Location) if Location else None
            Department_instance = Department_Detials.objects.get(pk=Department) if Department else None
            LeninCategory_instance = Lenin_Catg_Master_Details.objects.get(pk=LeninCategory) if LeninCategory else None
            LeninType_instance = LeninMaster_Details.objects.get(pk=LeninType) if LeninType else None

            if Id:
                qc_instance = Dept_Wise_QC_Details.objects.get(pk=Id)
                if Statusedit:
                    qc_instance.Status = not qc_instance.Status
                    qc_instance.save()
                    return JsonResponse({'success': 'QC status updated successfully'})
                
                # Full Row Update
                qc_instance.Location = Location_instance
                qc_instance.Department = Department_instance
                qc_instance.LeninCategory = LeninCategory_instance
                qc_instance.LeninType = LeninType_instance
                qc_instance.QCValue = QCValue
                qc_instance.QCStatus = QCStatus
                qc_instance.Inspector = Inspector
                qc_instance.Total = data.get('Total', 0)
                qc_instance.Approved = data.get('Approved', 0)
                qc_instance.Rewash = data.get('Rewash', 0)
                qc_instance.Condemned = data.get('Condemned', 0)
                qc_instance.Infected = data.get('Infected', 'NO')
                qc_instance.InfectionDesc = data.get('InfectionDesc', '')
                qc_instance.save()
                return JsonResponse({'success': 'QC details updated successfully'})
            else:
                # Create New Row
                if Dept_Wise_QC_Details.objects.filter(
                    Location=Location_instance,
                    Department=Department_instance,
                    LeninCategory=LeninCategory_instance,
                    LeninType=LeninType_instance
                ).exists():
                    return JsonResponse({'warn': 'QC entry already exists for this combination.'})

                Dept_Wise_QC_Details.objects.create(
                    Location=Location_instance,
                    Department=Department_instance,
                    LeninCategory=LeninCategory_instance,
                    LeninType=LeninType_instance,
                    QCValue=QCValue,
                    QCStatus=QCStatus,
                    Inspector=Inspector,
                    Total=data.get('Total', 0),
                    Approved=data.get('Approved', 0),
                    Rewash=data.get('Rewash', 0),
                    Condemned=data.get('Condemned', 0),
                    Infected=data.get('Infected', 'NO'),
                    InfectionDesc=data.get('InfectionDesc', ''),
                    created_by=created_by
                )
                return JsonResponse({'success': 'QC details added successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        try:
            qc_entries = Dept_Wise_QC_Details.objects.select_related('Location', 'Department', 'LeninCategory', 'LeninType').all()
            qc_data = [
                {
                    'Id': qc.pk,
                    'LocationId': qc.Location.pk if qc.Location else None,
                    'LocationName': qc.Location.Location_Name if qc.Location else '',
                    'DepartmentId': qc.Department.pk if qc.Department else None,
                    'DepartmentName': qc.Department.Department_Name if qc.Department else '',
                    'LeninCategoryId': qc.LeninCategory.pk if qc.LeninCategory else None,
                    'LeninCategory': qc.LeninCategory.LeninCategory if qc.LeninCategory else '',
                    'LeninTypeId': qc.LeninType.pk if qc.LeninType else None,
                    'LeninType': qc.LeninType.LeninType if qc.LeninType else '',
                    'LeninSize': qc.LeninType.LeninSize if qc.LeninType else '',
                    'QCValue': qc.QCValue,
                    'QCStatus': qc.QCStatus,
                    'Inspector': qc.Inspector,
                    'Approved' : qc.Approved,
                    'Condemned': qc.Condemned,
                    'Infected' : qc.Infected,
                    'Total': qc.Total,
                    'Rewash': qc.Rewash,
                    'InfectionDesc': qc.InfectionDesc,
                    'Status': 'Active' if qc.Status else 'Inactive',
                    'created_by': qc.created_by,
                } for qc in qc_entries
            ]
            return JsonResponse(qc_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # Added as a backup for standard REST DELETE requests
    elif request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            target_id = data.get('Id')
            if target_id:
                Dept_Wise_QC_Details.objects.filter(pk=target_id).delete()
                return JsonResponse({'success': 'Row deleted successfully'})
            return JsonResponse({'error': 'ID is required'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def laundryVendorMasterdetails(request):
    # ---------- GET ----------
    if request.method == "GET":
        # 1. Fetching Vendor Records for the Grid
        records = LinenLaundryMaster.objects.all().order_by('id')
        
        grid_data = []
        for r in records:
            grid_data.append({
                "StockId": r.id,
                "VendorName": r.VendorName or "",
                "Address": r.VendorLocation or "",
                "PhoneNumber": r.PhoneNumber or "",
                "LeninCategory": r.LeninCategory or "", 
                "LeninType": r.LeninType or "",
                "BulkTotal": float(r.BulkTotal or 0),
                "PieceTotal": float(r.PieceTotal or 0),
                "GrandTotal": float(r.GrandTotal or 0),
                "Status": "Active", 
            })

        # 2. FIX: Fetching Category/Type from MAIN Lenin Master table
        # Inga unga main master table records-ai fetch panni anuppanum
        # master_records = LeninMasterModel.objects.all() 
        # (For now, I am using the grid data itself, but ensure your DB has entries)
        
        return JsonResponse(grid_data, safe=False)

    # ---------- POST ----------
    try:
        data = json.loads(request.body)
        action = data.get("action")
        stock_id = data.get("StockId")

        if action == "delete":
            LinenLaundryMaster.objects.filter(id=stock_id).delete()
            return JsonResponse({"success": "Deleted successfully"})

        if data.get("Statusedit"):
            return JsonResponse({"success": "Status updated successfully"})

        # CREATE / UPDATE
        if stock_id:
            record = LinenLaundryMaster.objects.get(id=stock_id)
        else:
            record = LinenLaundryMaster()
            now = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            record.BatchNo = f"BN-{data.get('PhoneNumber','000')}-{now}"

        # Category and Type save panra logic
        record.LeninCategory = data.get("LeninCategory")
        record.LeninType = data.get("LeninType")        
        record.VendorName = data.get("VendorName")
        record.VendorLocation = data.get("Address")
        record.PhoneNumber = data.get("PhoneNumber")
        record.Quantity = data.get("Quantity", 0)
        record.BulkQty = data.get("BulkQty", 0)
        record.BulkRate = data.get("BulkRate", 0)
        record.BulkTotal = data.get("BulkTotal", 0)
        record.PieceQty = data.get("PieceQty", 0)
        record.PieceRate = data.get("PieceRate", 0)
        record.PieceTotal = data.get("PieceTotal", 0)
        record.GrandTotal = data.get("GrandTotal", 0)
        record.created_by = data.get("created_by", "Admin")

        record.save()
        return JsonResponse({"success": "Saved successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def LeninMaster_Detials_link_by_id(request):
 
    # ---------- GET ----------
    if request.method == 'GET':
       
        catid = request.GET.get('catid','')
        try:
            data = []
            lenin_items = LeninMaster_Details.objects.filter(LeninCategory__catgId=catid)            
            for le in lenin_items:
                data.append({
                    'LeninCode': le.LeninCode,
                    'ColorCode': le.ColorCode,
                    'created_by': le.created_by,
                    'catgId': le.LeninCategory.pk,
                    'LeninCategory': le.LeninCategory.LeninCategory,
                    'LeninType': le.LeninType,
                    'LeninSize': le.LeninSize,
                    'MaxWashCount': le.MaxWashCount,
                    'InfectionCategory': le.InfectionCategory,
                    "Status": 'Active' if le.Status else 'Inactive',
                    "Remarks": le.Remarks                    
                })    
               
            return JsonResponse(data=data, safe=False)    
        except Exception as e:
            return JsonResponse({'err': str(e)})
 
 
 
 
