from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import *
import json
from datetime import datetime, date
import traceback
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist


@csrf_exempt
@require_http_methods(['POST'])
def Asset_Reg_post(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        print("data", data)

        # Validate required fields
        required_fields = ['name', 'category']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'})

        # Extract relationships
        category_id = data.get('category')
        subcategory_id = data.get('asset_subcategory', None)
        supplier_ids = data.get('supplier', [])
        department_id = data.get('department', None)
        ward_id = data.get('ward', None)
        administration_id = data.get('administration', None)
        theatre_id = data.get('theatre', None)
        room_no_id = data.get('room', None)
        Consultationroom_id = data.get('Consultationroom',None)

        print(category_id, subcategory_id, supplier_ids, department_id, ward_id, administration_id, theatre_id, room_no_id,Consultationroom_id)

        try:
            category = AssetCategory.objects.get(pk=category_id)
            subcategory = AssetSubCategory.objects.get(pk=subcategory_id) if subcategory_id else None
            department = Department_Detials.objects.get(Department_Id=department_id) if department_id else None
            ward = WardType_Master_Detials.objects.get(pk=ward_id) if ward_id else None
            administration = Administration_Master_Details.objects.get(pk=administration_id) if administration_id else None
            theatre = OtTheaterMaster_Detials.objects.get(pk=theatre_id) if theatre_id else None
            room = Room_Master_Detials.objects.get(pk=room_no_id) if room_no_id else None
            Consultaion_Room = Consultaion_Room_Master_Details.objects.get(pk=Consultationroom_id) if Consultationroom_id else None
            
            print(category, subcategory, department, ward, administration, theatre, room,Consultaion_Room)

        except AssetCategory.DoesNotExist:
            return JsonResponse({'error': 'Invalid category ID'})
        except AssetSubCategory.DoesNotExist:
            return JsonResponse({'error': 'Invalid subcategory ID'})
        except Department_Detials.DoesNotExist:
            return JsonResponse({'error': 'Invalid department ID'})
        except WardType_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Invalid ward ID'})
        except Administration_Master_Details.DoesNotExist:
            return JsonResponse({'error': 'Invalid administration ID'})
        except OtTheaterMaster_Detials.DoesNotExist:
            return JsonResponse({'error': 'Invalid theatre ID'})
        except Room_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Invalid room number ID'})
        except Consultaion_Room_Master_Details.DoesNotExist:
            return JsonResponse({'error': 'Invalid Consultaion_Room number ID'})

        # Ensure supplier_ids is always a list
        if isinstance(supplier_ids, int):
            supplier_ids = [supplier_ids]

        # Process numeric fields
        numeric_fields = [
            'purchase_price', 'market_value', 'total_working_life',
            'expected_working_life', 'depreciation_rate', 'salvage_value',
            'appreciation_rate'
        ]
        
        for field in numeric_fields:
            if field in data:
                try:
                    data[field] = float(data.get(field, 0)) if data[field] else None
                except ValueError:
                    return JsonResponse({'error': f'Invalid numeric value for {field}'})

        # Process date fields
        if 'purchase_date' in data and data['purchase_date']:
            try:
                data['purchase_date'] = datetime.strptime(data['purchase_date'], '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'error': 'Invalid date format for purchase_date. Use YYYY-MM-DD'})

        name_part = data['name'][:2].upper()
        location_part = ''
        if department:
            location_part = ''.join(word[0].upper() for word in department.Department_Name.split())
            department_id = department.Department_Id  
            print('department_id',department_id)

        date_part = datetime.now().strftime("%Y%m%d") 
        base_code = f"{name_part}/{location_part}/{date_part}"
        existing_codes = set(AssetReg_Data.objects.values_list('asset_code', flat=True))
        
        count = 1
        asset_code = base_code
        while asset_code in existing_codes:
            asset_code = f"{base_code}/{str(count).zfill(2)}"
            count += 1
        
        data['asset_code'] = asset_code

        asset = AssetReg_Data.objects.create(
            name=data['name'],
            asset_code=asset_code,
            category=category,
            asset_subcategory=subcategory,
            department=department,
            ward=ward,
            administration=administration,
            theatre=theatre,
            room=room,
            Consultaion_Room=Consultaion_Room,
            purchase_price=data.get('purchase_price', None),
            market_value=data.get('market_value', None),
            total_working_life=data.get('total_working_life', None),
            expected_working_life=data.get('expected_working_life', None),
            depreciation_rate=data.get('depreciation_rate', None),
            salvage_value=data.get('salvage_value', None),
            appreciation_rate=data.get('appreciation_rate', None),
            purchase_date=data.get('purchase_date', None),
            Company_Brand=data.get('Company_Brand', ''),  
            condition=data.get('condition', ''),  
        )

        # Set many-to-many relationships (supplier)
        if supplier_ids:
            suppliers = Supplier.objects.filter(id__in=supplier_ids)
            if suppliers.exists():
                asset.supplier.set(suppliers)

        return JsonResponse({
            'message': 'Asset created successfully',
            'id': asset.id,
            'asset_code': asset.asset_code
        })

    except Exception as e:
        return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['PUT'])
def Asset_Reg_put(request, asset_id):
    try:
        data = json.loads(request.body.decode('utf-8'))
        
        try:
            asset = AssetReg_Data.objects.get(id=asset_id)
        except AssetReg_Data.DoesNotExist:
            return JsonResponse({'error': 'Asset not found'})

        # Extract relationships
        category_id = data.pop('category', None)
        subcategory_id = data.pop('asset_subcategory', None)
        supplier_ids = data.pop('supplier', None)
        department_id = data.pop('department', None)
        ward_id = data.pop('ward', None)
        administration_id = data.pop('administration', None)
        theatre_id = data.pop('theatre', None)
        room_no_id = data.pop('room', None)
        Consultationroom_id = data.pop('Consultationroom', None)

        print("department_id",department_id)
        # Update relationships if provided
        if category_id:
            try:
                asset.category = AssetCategory.objects.get(pk=category_id)
            except AssetCategory.DoesNotExist:
                return JsonResponse({'error': 'Invalid category ID'})

        if subcategory_id:
            try:
                asset.asset_subcategory = AssetSubCategory.objects.get(pk=subcategory_id)
            except AssetSubCategory.DoesNotExist:
                return JsonResponse({'error': 'Invalid subcategory ID'})

        if department_id:
            try:
                asset.department = Department_Detials.objects.get(Department_Id=department_id)
            except Department_Detials.DoesNotExist:
                return JsonResponse({'error': 'Invalid department ID'})

        if ward_id:
            try:
                asset.ward = WardType_Master_Detials.objects.get(pk=ward_id)
            except WardType_Master_Detials.DoesNotExist:
                return JsonResponse({'error': 'Invalid ward ID'})

        if administration_id:
            try:
                asset.administration = Administration_Master_Details.objects.get(pk=administration_id)
            except Administration_Master_Details.DoesNotExist:
                return JsonResponse({'error': 'Invalid administration ID'})

        if theatre_id:
            try:
                asset.theatre = OtTheaterMaster_Detials.objects.get(pk=theatre_id)
            except OtTheaterMaster_Detials.DoesNotExist:
                return JsonResponse({'error': 'Invalid theatre ID'})

        if room_no_id:
            try:
                asset.room = Room_Master_Detials.objects.get(Room_Id=room_no_id)
            except Room_Master_Detials.DoesNotExist:
                return JsonResponse({'error': 'Invalid room number ID'})
            
        if Consultationroom_id:
            try:
                asset.Consultaion_Room = Consultaion_Room_Master_Details.objects.get(pk=Consultationroom_id)
            except Consultaion_Room_Master_Details.DoesNotExist:
                return JsonResponse({'error': 'Invalid room number ID'})


        numeric_fields = [
            'purchase_price', 'market_value', 'total_working_life',
            'expected_working_life', 'depreciation_rate', 'salvage_value',
            'appreciation_rate'
        ]
        
        for field in numeric_fields:
            if field in data:
                try:
                    setattr(asset, field, float(data[field]) if data[field] else None)
                except ValueError:
                    return JsonResponse({
                        'error': f'Invalid numeric value for {field}'
                    })

        if 'purchase_date' in data and data['purchase_date']:
            try:
                asset.purchase_date = datetime.strptime(
                    data['purchase_date'], '%Y-%m-%d'
                ).date()
            except ValueError:
                return JsonResponse({
                    'error': 'Invalid date format for purchase_date. Use YYYY-MM-DD'
                })

        for field, value in data.items():
            if hasattr(asset, field):
                setattr(asset, field, value)

        if supplier_ids is not None:
            asset.supplier.set(Supplier.objects.filter(id__in=supplier_ids))

        asset.save()

        return JsonResponse({
            'message': 'Asset updated successfully',
            'id': asset.id
        })

    except Exception as e:
        return JsonResponse({'error': str(e)})
    


@csrf_exempt
@require_http_methods(['GET'])
def Asset_Reg_Get(request):
    try:
        assets = AssetReg_Data.objects.all().select_related(
            'category',
            'asset_subcategory',
            'department',
            'ward',
            'administration',
            'theatre',
            'Consultaion_Room'
        ).prefetch_related('supplier')

        data = []
        for asset in assets:
            purchase_date = asset.purchase_date
            total_working_life = asset.total_working_life or 0
            
            print(f"Asset ID: {asset.id}, Purchase Date: {purchase_date}, Total Working Life: {total_working_life}")

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
                
                'department': asset.department.Department_Id if asset.department else None,
                'department_name': asset.department.Department_Name if asset.department else None,
                
                'ward': asset.ward.Ward_Id if asset.ward else None,
                'ward_name': asset.ward.Ward_Name if asset.ward else None,
                
                'administration': asset.administration.Administration_Id if asset.administration else None,
                'administration_name': asset.administration.Administration_Name if asset.administration else None,
                
                'theatre': asset.theatre.id if asset.theatre else None,
                'theatre_name': asset.theatre.TheatreName if asset.theatre else None,
                
                'room': asset.room.Room_Id if asset.room else None,
                'room_name': asset.room.Ward_Name.RoomNo if asset.room else None,
                
                'Consultaion_Room':asset.Consultaion_Room.Con_Room_Id if asset.Consultaion_Room else None,
                'Consultationroom':asset.Consultaion_Room.Con_Room_Name if asset.Consultaion_Room else None,
                
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
                
                'current_value': calculate_current_value(asset)
            }
            data.append(asset_data)

        return JsonResponse(data, safe=False)

    except Exception as e:
        print(f"Error in Asset_Reg_Get: {str(e)}")
        return JsonResponse({'error': str(e)})

def calculate_current_value(asset):
   
    try:
        if not asset.purchase_price or not asset.purchase_date:
            return None

        purchase_price = float(asset.purchase_price)
        years_elapsed = (datetime.now().date() - asset.purchase_date).days / 365.25

        if asset.valuation_method == 'depreciation' and asset.depreciation_rate:
            depreciation_rate = float(asset.depreciation_rate) / 100
            current_value = purchase_price * (1 - depreciation_rate) ** years_elapsed
            
            # Consider salvage value if set
            if asset.salvage_value is not None:
                current_value = max(float(asset.salvage_value), current_value)
                
        elif asset.valuation_method == 'appreciation' and asset.appreciation_rate:
            appreciation_rate = float(asset.appreciation_rate) / 100
            current_value = purchase_price * (1 + appreciation_rate) ** years_elapsed
            
        else:
            return purchase_price  # Return purchase price if no valuation method is set

        return round(current_value, 2)

    except Exception as e:
        print(f"Error calculating current value: {str(e)}")
        return None



# --------------------------------------------AssetList---------------------------------------------------------


# @csrf_exempt
# @require_http_methods(['POST'])
# def assetList_POST(request):
#     try:
#         data = json.loads(request.body.decode('utf-8'))
#         asset = AssetList.objects.create(
#             name=data.get('name'),
#             category_id=data.get('category_id'),
#             subcategory_id=data.get('subcategory_id'),
#             supplier=data.get('supplier'),
#             status=data.get('status'),
#             condition=data.get('condition'),
#             valuation_method=data.get('valuation_method')
#         )
#         return JsonResponse({'message': 'Asset created successfully', 'id': asset.id}, status=201)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(['GET'])
def assetList_Get(request):
    try:
        print("Query Parameters:", request.GET)

        name = request.GET.get('name', '').strip()
        category_id = request.GET.get('category_id', '').strip()
        subcategory_id = request.GET.get('subcategory_id', '').strip()
        supplier = request.GET.get('supplier', '').strip()
        status = request.GET.get('status', '').strip()
        condition = request.GET.get('condition', '').strip()
        valuation_method = request.GET.get('valuation_method', '').strip()

        assets = AssetReg_Data.objects.select_related('category', 'asset_subcategory').prefetch_related('supplier')

        if category_id.isdigit():  
            assets = assets.filter(category_id=int(category_id))

        if subcategory_id.isdigit():
            assets = assets.filter(asset_subcategory_id=int(subcategory_id))

        if supplier:
            assets = assets.filter(supplier__name__icontains=supplier)  

        if name:
            assets = assets.filter(name__icontains=name)

        if status:
            assets = assets.filter(status=status)

        if condition:
            assets = assets.filter(condition=condition)

        if valuation_method:
            assets = assets.filter(valuation_method=valuation_method)

        asset_data = []
        for asset in assets:
            asset_data.append({
                'id': asset.id,
                'asset_code': asset.asset_code, 
                'name': asset.name,
                'category': {
                    'id': asset.category.id if asset.category else None,
                    'name': asset.category.name if asset.category else None
                },
                'subcategory': {
                    'id': asset.asset_subcategory.id if asset.asset_subcategory else None,
                    'name': asset.asset_subcategory.name if asset.asset_subcategory else None
                },
                'supplier': list(asset.supplier.values_list('name', flat=True)),
                'status': asset.status,
                'condition': asset.condition,
                'valuation_method': asset.valuation_method,
            })

        return JsonResponse(asset_data, safe=False)

    except Exception as e:
        print("Error:", str(e))  
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['PUT'])
def assetList_PUT(request, asset_id):  
    try:
        data = json.loads(request.body.decode('utf-8'))

        try:
            asset = AssetReg_Data.objects.get(id=asset_id)  
        except AssetReg_Data.DoesNotExist:
            return JsonResponse({'error': 'Asset not found'}, status=404)

        fields_to_update = [
            'name', 'asset_code', 'status', 'condition', 'valuation_method'
        ]
        for field in fields_to_update:
            if field in data:
                setattr(asset, field, data[field])

        if 'category_id' in data and data['category_id']:
            try:
                category = AssetCategory.objects.get(id=data['category_id'])
                asset.category = category
            except AssetCategory.DoesNotExist:
                return JsonResponse({'error': f"Category with id {data['category_id']} not found"}, status=404)

        if 'subcategory_id' in data:
            if data['subcategory_id']:
                try:
                    subcategory = AssetSubCategory.objects.get(id=data['subcategory_id'])
                    asset.asset_subcategory = subcategory
                except AssetSubCategory.DoesNotExist:
                    return JsonResponse({'error': f"Subcategory with id {data['subcategory_id']} not found"}, status=404)
            else:
                asset.asset_subcategory = None

        if 'supplier' in data:
            asset.supplier.clear()
            if isinstance(data['supplier'], list):
                for supplier_name in data['supplier']:
                    supplier, _ = Supplier.objects.get_or_create(name=supplier_name)
                    asset.supplier.add(supplier)

        asset.save()

        return JsonResponse({
            'message': 'Asset updated successfully',
            'asset': {
                'id': asset.id,
                'name': asset.name,
                'asset_code': asset.asset_code,
                'category': {
                    'id': asset.category.id if asset.category else None,
                    'name': asset.category.name if asset.category else None
                },
                'subcategory': {
                    'id': asset.asset_subcategory.id if asset.asset_subcategory else None,
                    'name': asset.asset_subcategory.name if asset.asset_subcategory else None
                },
                'supplier': list(asset.supplier.values_list('name', flat=True)),
                'status': asset.status,
                'condition': asset.condition,
                'valuation_method': asset.valuation_method,
            }
        })
    except Exception as e:
        print(f"Error updating asset: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
    
    
# -------------------Delete---------------------------
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_AssetManegment(request, id):
    try:
        AssetReg = AssetReg_Data.objects.get(id=id)
        AssetReg.delete()
        return JsonResponse({"message": "Record deleted successfully"})
    except AssetReg_Data.DoesNotExist:
        return JsonResponse({"error": "AssetReg_Data not found"})
    except Exception as e:
        return JsonResponse({"error": str(e)})