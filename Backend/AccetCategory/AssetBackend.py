import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.core.exceptions import ValidationError
from django.db import transaction
from datetime import datetime, date
from django.db.models import Max






# Set up logging
logger = logging.getLogger(__name__)



# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def asset_movement_list(request):
    if request.method == 'GET':
        try:
            movements = AssetMovement.objects.select_related(
                'category', 'asset_subcategory', 'asset'
            ).filter(is_active=True)
            
            movement_data = []
            for movement in movements:
                movement_data.append({
                    'id': movement.id,
                    'category': movement.category.id,
                    'category_name': movement.category.name,
                    'asset_subcategory': movement.asset_subcategory.id,  # Added for consistency
                    'subcategory_name': movement.asset_subcategory.name,
                    'asset': movement.asset.id,
                    'asset_name': movement.asset.name,
                    'from_location': movement.from_location,
                    'to_location': movement.to_location,
                    'movement_date': movement.movement_date.isoformat(),
                    'movement_time': movement.movement_time.strftime('%H:%M:%S'),
                    'created_at': movement.created_at.isoformat(),
                    'updated_at': movement.updated_at.isoformat(),
                })
            return JsonResponse(movement_data, safe=False)  # Explicitly set safe=False for list
        except Exception as e:
            logger.error(f"Error in GET asset_movement_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.debug(f"Received POST data: {data}")
            
            # Required fields validation
            required_fields = ['asset', 'category', 'asset_subcategory', 'from_location', 'to_location', 'movement_date', 'movement_time']
            for field in required_fields:
                if field not in data or data[field] is None:
                    logger.warning(f"Missing or null required field: {field}")
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            # Validate location fields based on department
            for location in [data['from_location'], data['to_location']]:
                if not location.get('department'):
                    logger.warning("Missing department in location")
                    return JsonResponse({'error': 'Department is required for both locations'}, status=400)
                
                if location.get('department_name') == 'IP':
                    if not (location.get('ward') and location.get('room')):
                        logger.warning("Missing ward or room for IP department")
                        return JsonResponse({'error': 'Ward and Room are required for IP department'}, status=400)
                elif location.get('department_name') == 'ADMINISTARTION':
                    if not location.get('Administartion'):
                        logger.warning("Missing administration for ADMINISTARTION department")
                        return JsonResponse({'error': 'Administration is required for ADMINISTARTION department'}, status=400)
                elif location.get('department_name') == 'OT':
                    if not location.get('TheatreName'):
                        logger.warning("Missing theatre name for OT department")
                        return JsonResponse({'error': 'Theatre Name is required for OT department'}, status=400)
                elif location.get('department_name') == 'OP':
                    if not location.get('Consultationroom'):
                        logger.warning("Missing consultation room for OP department")
                        return JsonResponse({'error': 'Consultation Room is required for OP department'}, status=400)

            # Validate date and time
            try:
                movement_date = datetime.strptime(data['movement_date'], '%Y-%m-%d').date()
                # Accept HH:MM format for time
                movement_time = datetime.strptime(data['movement_time'], '%H:%M').time()
                # Prevent future dates
                if movement_date > date.today():
                    logger.warning("Movement date is in the future")
                    return JsonResponse({'error': 'Movement date cannot be in the future'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid date or time format: {str(e)}")
                return JsonResponse({'error': 'Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time'}, status=400)

            with transaction.atomic():
                # Check if updating or creating
                if data.get('id'):
                    # Update existing movement
                    try:
                        movement = AssetMovement.objects.get(id=data['id'], is_active=True)
                    except AssetMovement.DoesNotExist:
                        logger.warning(f"Movement record not found for ID: {data.get('id')}")
                        return JsonResponse({'error': 'Movement record not found'}, status=404)
                    
                    movement.category_id = data['category']
                    movement.asset_subcategory_id = data['asset_subcategory']
                    movement.asset_id = data['asset']
                    movement.from_location = data['from_location']
                    movement.to_location = data['to_location']
                    movement.movement_date = movement_date
                    movement.movement_time = movement_time
                else:
                    # Create new movement
                    movement = AssetMovement(
                        category_id=data['category'],
                        asset_subcategory_id=data['asset_subcategory'],
                        asset_id=data['asset'],
                        from_location=data['from_location'],
                        to_location=data['to_location'],
                        movement_date=movement_date,
                        movement_time=movement_time,
                    )

                # Validate foreign keys
                if not AssetCategory.objects.filter(id=data['category']).exists():
                    logger.warning(f"Invalid category ID: {data['category']}")
                    return JsonResponse({'error': 'Invalid category'}, status=400)
                if not AssetSubCategory.objects.filter(id=data['asset_subcategory']).exists():
                    logger.warning(f"Invalid subcategory ID: {data['asset_subcategory']}")
                    return JsonResponse({'error': 'Invalid subcategory'}, status=400)
                if not AssetReg_Data.objects.filter(id=data['asset']).exists():
                    logger.warning(f"Invalid asset ID: {data['asset']}")
                    return JsonResponse({'error': 'Invalid asset'}, status=400)

                movement.full_clean()  # Run model validation
                movement.save()
                logger.info(f"Asset movement {'updated' if data.get('id') else 'created'} successfully: ID {movement.id}")
                
                return JsonResponse({
                    'id': movement.id,
                    'message': f"Asset movement {'updated' if data.get('id') else 'created'} successfully"
                }, status=200 if data.get('id') else 201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in POST request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in POST asset_movement_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
        
        


# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def asset_outside_movement_list(request):
    if request.method == 'GET':
        try:
            movements = AssetOutsideMovementTableData.objects.select_related(
                'category', 'asset_subcategory', 'asset'
            ).filter(is_active=True)
            
            movement_data = []
            for movement in movements:
                movement_data.append({
                    'id': movement.id,
                    'category': movement.category.id,
                    'category_name': movement.category.name,
                    'asset_subcategory': movement.asset_subcategory.id,
                    'subcategory_name': movement.asset_subcategory.name,
                    'asset': movement.asset.id,
                    'asset_name': movement.asset.name,
                    'from_location': movement.from_location,
                    'to_location': movement.to_location,
                    'send_date': movement.send_date.isoformat(),
                    'send_time': movement.send_time.strftime('%H:%M:%S'),
                    'receive_date': movement.receive_date.isoformat() if movement.receive_date else None,
                    'receive_time': movement.receive_time.strftime('%H:%M:%S') if movement.receive_time else None,
                    'current_condition': movement.current_condition,
                    'amount': float(movement.amount),
                    'condition_to_return': movement.condition_to_return,  # Now a string
                    'sent_by': movement.sent_by,
                    'received_by': movement.received_by,
                    'created_at': movement.created_at.isoformat(),
                    'updated_at': movement.updated_at.isoformat(),
                })
            return JsonResponse(movement_data, safe=False, status=200)
        except Exception as e:
            logger.error(f"Error in GET asset_outside_movement_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.debug(f"Received POST data: {data}")

            # Required fields validation
            required_fields = [
                'asset', 'category', 'asset_subcategory', 'from_location', 'to_location',
                'send_date', 'send_time', 'current_condition', 'amount', 'sent_by'
            ]
            for field in required_fields:
                if field not in data or data[field] is None:
                    logger.warning(f"Missing or null required field: {field}")
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            # Validate from_location fields based on department
            from_location = data['from_location']
            if not from_location.get('department'):
                logger.warning("Missing department in from_location")
                return JsonResponse({'error': 'Department is required for from location'}, status=400)
            
            # Correct spelling to "Administration"
            department_name = from_location.get('department_name')
            if department_name == 'IP':
                if not (from_location.get('ward') and from_location.get('room')):
                    logger.warning("Missing ward or room for IP department")
                    return JsonResponse({'error': 'Ward and Room are required for IP department'}, status=400)
            elif department_name == 'ADMINISTARTION':  # Handle frontend's misspelling
                if not from_location.get('Administartion'):
                    logger.warning("Missing administration for ADMINISTRATION department")
                    return JsonResponse({'error': 'Administration is required for ADMINISTRATION department'}, status=400)
                # Map to correct spelling for backend consistency
                from_location['Administration'] = from_location.pop('Administartion', None)
                from_location['department_name'] = 'ADMINISTRATION'
            elif department_name == 'OT':
                if not from_location.get('TheatreName'):
                    logger.warning("Missing theatre name for OT department")
                    return JsonResponse({'error': 'Theatre Name is required for OT department'}, status=400)

            # Validate to_location fields
            to_location = data['to_location']
            if not to_location.get('newLocation'):
                logger.warning("Missing newLocation in to_location")
                return JsonResponse({'error': 'New Location is required for to location'}, status=400)

            # Validate date and time
            try:
                send_date = datetime.strptime(data['send_date'], '%Y-%m-%d').date()
                send_time = datetime.strptime(data['send_time'] + ':00', '%H:%M:%S').time()  # Append :00 for backend
                if send_date > date.today():
                    logger.warning("Send date is in the future")
                    return JsonResponse({'error': 'Send date cannot be in the future'}, status=400)

                receive_date = None
                receive_time = None
                if data.get('receive_date') and data.get('receive_time'):
                    receive_date = datetime.strptime(data['receive_date'], '%Y-%m-%d').date()
                    receive_time = datetime.strptime(data['receive_time'] + ':00', '%H:%M:%S').time()
                    if receive_date > date.today():
                        logger.warning("Receive date is in the future")
                        return JsonResponse({'error': 'Receive date cannot be in the future'}, status=400)
                    if receive_date < send_date:
                        logger.warning("Receive date is before send date")
                        return JsonResponse({'error': 'Receive date cannot be before send date'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid date or time format: {str(e)}")
                return JsonResponse({'error': 'Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time'}, status=400)

            # Validate amount
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    logger.warning("Invalid amount: must be greater than 0")
                    return JsonResponse({'error': 'Amount must be greater than 0'}, status=400)
            except (ValueError, TypeError):
                logger.warning("Invalid amount format")
                return JsonResponse({'error': 'Invalid amount format'}, status=400)

            # Handle condition_to_return as a string
            condition_to_return = data.get('condition_to_return')  # Accept string or null
            if condition_to_return and not isinstance(condition_to_return, str):
                logger.warning("Invalid condition to return format")
                return JsonResponse({'error': 'Condition to return must be a string'}, status=400)

            with transaction.atomic():
                # Check if updating or creating
                if data.get('id'):
                    try:
                        movement = AssetOutsideMovementTableData.objects.get(id=data['id'], is_active=True)
                    except AssetOutsideMovementTableData.DoesNotExist:
                        logger.warning(f"Movement record not found for ID: {data.get('id')}")
                        return JsonResponse({'error': 'Movement record not found'}, status=404)
                    
                    movement.category_id = data['category']
                    movement.asset_subcategory_id = data['asset_subcategory']
                    movement.asset_id = data['asset']
                    movement.from_location = from_location
                    movement.to_location = data['to_location']
                    movement.send_date = send_date
                    movement.send_time = send_time
                    movement.receive_date = receive_date
                    movement.receive_time = receive_time
                    movement.current_condition = data['current_condition']
                    movement.amount = amount
                    movement.condition_to_return = condition_to_return  # Now a string
                    movement.sent_by = data['sent_by']
                    movement.received_by = data.get('received_by')
                else:
                    movement = AssetOutsideMovementTableData(
                        category_id=data['category'],
                        asset_subcategory_id=data['asset_subcategory'],
                        asset_id=data['asset'],
                        from_location=from_location,
                        to_location=data['to_location'],
                        send_date=send_date,
                        send_time=send_time,
                        receive_date=receive_date,
                        receive_time=receive_time,
                        current_condition=data['current_condition'],
                        amount=amount,
                        condition_to_return=condition_to_return,  # Now a string
                        sent_by=data['sent_by'],
                        received_by=data.get('received_by')
                    )

                # Validate foreign keys
                if not AssetCategory.objects.filter(id=data['category']).exists():
                    logger.warning(f"Invalid category ID: {data['category']}")
                    return JsonResponse({'error': 'Invalid category'}, status=400)
                if not AssetSubCategory.objects.filter(id=data['asset_subcategory']).exists():
                    logger.warning(f"Invalid subcategory ID: {data['asset_subcategory']}")
                    return JsonResponse({'error': 'Invalid subcategory'}, status=400)
                if not AssetReg_Data.objects.filter(id=data['asset']).exists():
                    logger.warning(f"Invalid asset ID: {data['asset']}")
                    return JsonResponse({'error': 'Invalid asset'}, status=400)

                movement.full_clean()
                movement.save()
                logger.info(f"Asset outside movement {'updated' if data.get('id') else 'created'} successfully: ID {movement.id}")
                
                return JsonResponse({
                    'id': movement.id,
                    'message': f"Asset outside movement {'updated' if data.get('id') else 'created'} successfully"
                }, status=200 if data.get('id') else 201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in POST request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in POST asset_outside_movement_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
        
        
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_asset_outside_movement(request, id):
    try:
        logger.debug(f"Received DELETE request for movement ID: {id}")
        movement = AssetOutsideMovementTableData.objects.get(id=id, is_active=True)
        movement.is_active = False 
        movement.save()
        logger.info(f"Asset outside movement deleted successfully: ID {id}")
        return JsonResponse({'message': 'Asset outside movement deleted successfully'}, status=200) 
    except AssetOutsideMovementTableData.DoesNotExist:
        logger.warning(f"Movement record not found for ID: {id}")
        return JsonResponse({'error': 'Movement record not found'}, status=404) 
    except Exception as e:
        logger.error(f"Error in DELETE asset_outside_movement: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
        
        

@csrf_exempt
@require_http_methods(['GET', 'POST', 'PUT'])
def Asset_insurance_registration_list(request):
    if request.method == 'GET':
        try:
            insurances = AssetInsuranceRegistration.objects.filter(is_active=True)
            one_month_later = datetime.now().date() + timedelta(days=30)
            
            insurance_data = []
            for insurance in insurances:
                is_nearby_expiry = insurance.end_date <= one_month_later
                insurance_data.append({
                    'id': insurance.id,
                    'productName': insurance.product_name,
                    'startDate': insurance.start_date.isoformat(),
                    'endDate': insurance.end_date.isoformat(),
                    'insuranceName': insurance.insurance_name,
                    'amount': float(insurance.amount),
                    'nearbyExpiry': is_nearby_expiry,
                    'isEdited': insurance.updated_at > insurance.created_at
                })
            return JsonResponse(insurance_data, safe=False, status=200)
        except Exception as e:
            logger.error(f"Error in GET Asset_insurance_registration_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.debug(f"Received POST data: {data}")

            required_fields = ['productName', 'startDate', 'endDate', 'insuranceName', 'amount']
            for field in required_fields:
                if field not in data or data[field] is None:
                    logger.warning(f"Missing or null required field: {field}")
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            try:
                start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
                end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
                if start_date > end_date:
                    logger.warning("End date is before start date")
                    return JsonResponse({'error': 'End date cannot be before start date'}, status=400)
                if end_date < datetime.now().date():
                    logger.warning("End date is in the past")
                    return JsonResponse({'error': 'End date cannot be in the past'}, status=400)
                amount = float(data['amount'])
                if amount <= 0:
                    logger.warning("Invalid amount: must be greater than 0")
                    return JsonResponse({'error': 'Amount must be greater than 0'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid date or amount format: {str(e)}")
                return JsonResponse({'error': 'Invalid date or amount format'}, status=400)

            with transaction.atomic():
                insurance = AssetInsuranceRegistration(
                    product_name=data['productName'],
                    start_date=start_date,
                    end_date=end_date,
                    insurance_name=data['insuranceName'],
                    amount=amount
                )
                insurance.full_clean()
                insurance.save()
                logger.info(f"Insurance registration created successfully: ID {insurance.id}")
                
                return JsonResponse({
                    'id': insurance.id,
                    'message': 'Insurance registration created successfully'
                }, status=201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in POST request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in POST Asset_insurance_registration_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            logger.debug(f"Received PUT data: {data}")

            required_fields = ['id', 'productName', 'startDate', 'endDate', 'insuranceName', 'amount']
            for field in required_fields:
                if field not in data or data[field] is None:
                    logger.warning(f"Missing or null required field: {field}")
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            try:
                start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
                end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
                if start_date > end_date:
                    logger.warning("End date is before start date")
                    return JsonResponse({'error': 'End date cannot be before start date'}, status=400)
                if end_date < datetime.now().date():
                    logger.warning("End date is in the past")
                    return JsonResponse({'error': 'End date cannot be in the past'}, status=400)
                amount = float(data['amount'])
                if amount <= 0:
                    logger.warning("Invalid amount: must be greater than 0")
                    return JsonResponse({'error': 'Amount must be greater than 0'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid date or amount format: {str(e)}")
                return JsonResponse({'error': 'Invalid date or amount format'}, status=400)

            with transaction.atomic():
                try:
                    insurance = AssetInsuranceRegistration.objects.get(id=data['id'], is_active=True)
                except AssetInsuranceRegistration.DoesNotExist:
                    logger.warning(f"Insurance record not found for ID: {data.get('id')}")
                    return JsonResponse({'error': 'Insurance record not found'}, status=404)
                
                insurance.product_name = data['productName']
                insurance.start_date = start_date
                insurance.end_date = end_date
                insurance.insurance_name = data['insuranceName']
                insurance.amount = amount
                
                insurance.full_clean()
                insurance.save()
                logger.info(f"Insurance registration updated successfully: ID {insurance.id}")
                
                return JsonResponse({
                    'id': insurance.id,
                    'message': 'Insurance registration updated successfully'
                }, status=200)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in PUT request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in PUT Asset_insurance_registration_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
        


@csrf_exempt
@require_http_methods(['POST', 'GET'])
def scrap_asset_list(request):
    if request.method == 'GET':
        try:
            scraps = ScrapAsset.objects.select_related(
                'category', 'asset_subcategory', 'asset'
            ).filter(is_active=True)
            
            scrap_data = []
            for scrap in scraps:
                scrap_data.append({
                    'id': scrap.id,
                    'category': scrap.category.id,
                    'category_name': scrap.category.name,
                    'asset_subcategory': scrap.asset_subcategory.id,
                    'subcategory_name': scrap.asset_subcategory.name,
                    'asset': scrap.asset.id,
                    'asset_name': scrap.asset.name,
                    'scrap_date': scrap.scrap_date.isoformat(),
                    'reason': scrap.reason,
                    'approved_by': scrap.approved_by,
                    'created_at': scrap.created_at.isoformat(),
                    'updated_at': scrap.updated_at.isoformat(),
                })
            return JsonResponse(scrap_data, safe=False)
        except Exception as e:
            logger.error(f"Error in GET scrap_asset_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.debug(f"Received POST data: {data}")
            
            required_fields = ['asset', 'category', 'asset_subcategory', 'scrap_date', 'reason', 'approved_by']
            for field in required_fields:
                if field not in data or data[field] is None:
                    logger.warning(f"Missing or null required field: {field}")
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            try:
                scrap_date = datetime.strptime(data['scrap_date'], '%Y-%m-%d').date()
                if scrap_date > date.today():
                    logger.warning("Scrap date is in the future")
                    return JsonResponse({'error': 'Scrap date cannot be in the future'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid date format: {str(e)}")
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

            with transaction.atomic():
                if data.get('id'):
                    try:
                        scrap = ScrapAsset.objects.get(id=data['id'], is_active=True)
                    except ScrapAsset.DoesNotExist:
                        logger.warning(f"Scrap record not found for ID: {data.get('id')}")
                        return JsonResponse({'error': 'Scrap record not found'}, status=404)
                    
                    scrap.category_id = data['category']
                    scrap.asset_subcategory_id = data['asset_subcategory']
                    scrap.asset_id = data['asset']
                    scrap.scrap_date = scrap_date
                    scrap.reason = data['reason']
                    scrap.approved_by = data['approved_by']
                else:
                    scrap = ScrapAsset(
                        category_id=data['category'],
                        asset_subcategory_id=data['asset_subcategory'],
                        asset_id=data['asset'],
                        scrap_date=scrap_date,
                        reason=data['reason'],
                        approved_by=data['approved_by'],
                    )

                if not AssetCategory.objects.filter(id=data['category']).exists():
                    logger.warning(f"Invalid category ID: {data['category']}")
                    return JsonResponse({'error': 'Invalid category'}, status=400)
                if not AssetSubCategory.objects.filter(id=data['asset_subcategory']).exists():
                    logger.warning(f"Invalid subcategory ID: {data['asset_subcategory']}")
                    return JsonResponse({'error': 'Invalid subcategory'}, status=400)
                if not AssetReg_Data.objects.filter(id=data['asset']).exists():
                    logger.warning(f"Invalid asset ID: {data['asset']}")
                    return JsonResponse({'error': 'Invalid asset'}, status=400)

                scrap.full_clean()
                scrap.save()
                logger.info(f"Scrap record {'updated' if data.get('id') else 'created'} successfully: ID {scrap.id}")
                
                return JsonResponse({
                    'id': scrap.id,
                    'message': f"Scrap record {'updated' if data.get('id') else 'created'} successfully"
                }, status=200 if data.get('id') else 201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in POST request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in POST scrap_asset_list: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['DELETE'])
def delete_scrap_asset(request, id):
    try:
        scrap = ScrapAsset.objects.get(id=id, is_active=True)
        scrap.is_active = False
        scrap.save()
        logger.info(f"Scrap record deleted successfully: ID {id}")
        return JsonResponse({'message': 'Scrap record deleted successfully'}, status=200)
    except ScrapAsset.DoesNotExist:
        logger.warning(f"Scrap record not found for ID: {id}")
        return JsonResponse({'error': 'Scrap record not found'})
    except Exception as e:
        logger.error(f"Error deleting scrap record: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
    
    
    





# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def asset_disposal_list(request):
    if request.method == 'GET':
        try:
            disposals = AssetDisposalTable.objects.select_related(
                'category', 'asset_subcategory', 'asset'
            ).filter(is_active=True)
            
            disposal_data = []
            for disposal in disposals:
                disposal_data.append({
                    'id': disposal.id,
                    'category': disposal.category.id,
                    'category_name': disposal.category.name,
                    'asset_subcategory': disposal.asset_subcategory.id,
                    'subcategory_name': disposal.asset_subcategory.name,
                    'asset': disposal.asset.id,
                    'asset_name': disposal.asset.name,
                    'disposal_date': disposal.disposal_date.isoformat(),
                    'disposal_method': disposal.disposal_method,
                    'disposal_value': float(disposal.disposal_value),
                    'approved_by': disposal.approved_by,
                    'created_at': disposal.created_at.isoformat(),
                    'updated_at': disposal.updated_at.isoformat(),
                })
            return JsonResponse(disposal_data, safe=False)
        except Exception as e:
            logger.error(f"Error in GET asset_disposal: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.debug(f"Received POST data: {data}")
            
            required_fields = ['asset', 'category', 'asset_subcategory', 'disposal_date', 'disposal_method', 'disposal_value', 'approved_by']
            for field in required_fields:
                if field not in data or data[field] is None or data[field] == '':
                    logger.warning(f"Missing or empty required field: {field}")
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            try:
                disposal_date = datetime.strptime(data['disposal_date'], '%Y-%m-%d').date()
                if disposal_date > date.today():
                    logger.warning("Disposal date is in the future")
                    return JsonResponse({'error': 'Disposal date cannot be in the future'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid date format: {str(e)}")
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

            try:
                disposal_value = float(data['disposal_value'])
                if disposal_value < 0:
                    logger.warning("Disposal value cannot be negative")
                    return JsonResponse({'error': 'Disposal value cannot be negative'}, status=400)
            except (ValueError, TypeError):
                logger.error("Invalid disposal value format")
                return JsonResponse({'error': 'Invalid disposal value format'}, status=400)

            valid_methods = ['SALE', 'DONATION', 'OTHER']
            if data['disposal_method'] not in valid_methods:
                logger.warning(f"Invalid disposal method: {data['disposal_method']}")
                return JsonResponse({'error': 'Invalid disposal method'}, status=400)

            if len(data['approved_by'].strip()) > 100:
                logger.warning("Approved by name exceeds maximum length")
                return JsonResponse({'error': 'Approved by name cannot exceed 100 characters'}, status=400)

            with transaction.atomic():
                if data.get('id'):
                    try:
                        disposal = AssetDisposalTable.objects.get(id=data['id'], is_active=True)
                    except AssetDisposalTable.DoesNotExist:
                        logger.warning(f"Disposal record not found for ID: {data.get('id')}")
                        return JsonResponse({'error': 'Disposal record not found'}, status=404)
                    
                    disposal.category_id = data['category']
                    disposal.asset_subcategory_id = data['asset_subcategory']
                    disposal.asset_id = data['asset']
                    disposal.disposal_date = disposal_date
                    disposal.disposal_method = data['disposal_method']
                    disposal.disposal_value = disposal_value
                    disposal.approved_by = data['approved_by'].strip()
                else:
                    disposal = AssetDisposalTable(
                        category_id=data['category'],
                        asset_subcategory_id=data['asset_subcategory'],
                        asset_id=data['asset'],
                        disposal_date=disposal_date,
                        disposal_method=data['disposal_method'],
                        disposal_value=disposal_value,
                        approved_by=data['approved_by'].strip(),
                    )

                if not AssetCategory.objects.filter(id=data['category']).exists():
                    logger.warning(f"Invalid category ID: {data['category']}")
                    return JsonResponse({'error': 'Invalid category'}, status=400)
                if not AssetSubCategory.objects.filter(id=data['asset_subcategory']).exists():
                    logger.warning(f"Invalid subcategory ID: {data['asset_subcategory']}")
                    return JsonResponse({'error': 'Invalid subcategory'}, status=400)
                if not AssetReg_Data.objects.filter(id=data['asset']).exists():
                    logger.warning(f"Invalid asset ID: {data['asset']}")
                    return JsonResponse({'error': 'Invalid asset'}, status=400)

                disposal.full_clean()
                disposal.save()
                logger.info(f"Disposal record {'updated' if data.get('id') else 'created'} successfully: ID {disposal.id}")
                
                return JsonResponse({
                    'id': disposal.id,
                    'message': f"Disposal record {'updated' if data.get('id') else 'created'} successfully"
                }, status=200 if data.get('id') else 201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in POST request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in POST asset_disposal: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(['DELETE'])
def delete_asset_disposal(request, id):
    try:
        disposal = AssetDisposalTable.objects.get(id=id, is_active=True)
        disposal.is_active = False
        disposal.save()
        logger.info(f"Successfully deleted disposal record: ID {id}")
        return JsonResponse({'message': 'Disposal record deleted successfully'}, status=200)
    except AssetDisposalTable.DoesNotExist:
        logger.warning(f"Disposal record not found for ID: {id}")
        return JsonResponse({'error': 'Disposal record not found'}, status=404)
    except Exception as e:
        logger.error(f"Error deleting disposal record: {str(e)}")
        return JsonResponse({'error': str(e)}, status=400)
    
    