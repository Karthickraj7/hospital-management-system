

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from .models import *
from datetime import datetime, date
import json
import logging
import re

# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def package_master_details(request):
    if request.method == 'POST':
        try:
            # Parse request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON format: {str(e)}")
                return JsonResponse({'error': 'Invalid JSON format'}, status=400)

            current_package = data.get('currentPackage', {})
            services_details = data.get('services', [])

            # Extract Package_Master fields
            id = current_package.get('id')
            package_name = current_package.get('PackageName')
            package_type = current_package.get('PackageType')
            price = current_package.get('Price')
            status = current_package.get('Status')
            discount = current_package.get('AllowDiscount')
            validity = current_package.get('Validity')
            from_date = current_package.get('FromDate')
            to_date = current_package.get('ToDate')
            specialist_id = current_package.get('Specialist')


            print(services_details,'services_details')

            # Validate required fields
            required_fields = {
                'PackageName': package_name,
                'PackageType': package_type,
                'Price': price,
                'Status': status,
                'Specialist': specialist_id,
                'FromDate': from_date,
                'ToDate': to_date
            }
            missing_fields = [field for field, value in required_fields.items() if not value]
            if missing_fields:
                logger.error(f"Missing required fields: {missing_fields}")
                return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)

            # Validate numeric fields
            try:
                if price and not re.match(r'^\d+(\.\d{1,2})?$', str(price)):
                    logger.error(f"Invalid Price format: {price}")
                    return JsonResponse({'error': 'Price must be a valid number (e.g., 100.00)'}, status=400)
            except (TypeError, ValueError):
                logger.error(f"Invalid Price value: {price}")
                return JsonResponse({'error': 'Price must be a valid number'}, status=400)

            # Validate status
            if status not in ['Active', 'Inactive']:
                logger.error(f"Invalid Status value: {status}")
                return JsonResponse({'error': 'Status must be Active or Inactive'}, status=400)

            # Validate discount
            if discount not in ['Yes', 'No']:
                logger.error(f"Invalid AllowDiscount value: {discount}")
                return JsonResponse({'error': 'AllowDiscount must be Yes or No'}, status=400)

            # Parse and validate dates
            if from_date and isinstance(from_date, str) and from_date.strip():
                try:
                    from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                except ValueError:
                    logger.error(f"Invalid FromDate format: {from_date}")
                    return JsonResponse({'error': 'Invalid FromDate format. Use YYYY-MM-DD'}, status=400)
            else:
                logger.error("FromDate is required")
                return JsonResponse({'error': 'FromDate is required'}, status=400)

            if to_date and isinstance(to_date, str) and to_date.strip():
                try:
                    to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                except ValueError:
                    logger.error(f"Invalid ToDate format: {to_date}")
                    return JsonResponse({'error': 'Invalid ToDate format. Use YYYY-MM-DD'}, status=400)
            else:
                logger.error("ToDate is required")
                return JsonResponse({'error': 'ToDate is required'}, status=400)

            # Validate date logic
            if from_date and to_date and from_date > to_date:
                logger.error(f"FromDate {from_date} cannot be after ToDate {to_date}")
                return JsonResponse({'error': 'FromDate cannot be after ToDate'}, status=400)

            # Fetch Specialist instance
            try:
                specialist_ins = Speciality_Detials.objects.get(Speciality_Id=specialist_id)
            except ObjectDoesNotExist:
                logger.error(f"Speciality with ID {specialist_id} does not exist")
                return JsonResponse({'error': f'Speciality with ID {specialist_id} does not exist'}, status=400)

            # Validate services
            if not services_details:
                logger.error("At least one service is required")
                return JsonResponse({'error': 'At least one service is required'}, status=400)

            # Process services
            created_services = []
            for index, ser in enumerate(services_details):
                try:
                    category_id = ser.get('Categoryid') or ser.get('service_category_id')
                    subcategory_id = ser.get('SubCategoryid') or ser.get('service_sub_category_id')
                    subcategory_pk = ser.get('Subcategorypk', subcategory_id)
                    quantity = ser.get('Quantity')
                    subcategory_name = ser.get('SubCategoryname')

                    # Validate service fields
                    if not all([category_id, subcategory_id, quantity, subcategory_name]):
                        logger.error(f"Missing required service fields at index {index}: {ser}")
                        return JsonResponse({'error': f'Missing required fields in service {index + 1}'}, status=400)

                    # Validate quantity
                    try:
                        if quantity and not re.match(r'^\d+$', str(quantity)):
                            logger.error(f"Invalid Quantity format at index {index}: {quantity}")
                            return JsonResponse({'error': f'Quantity must be a positive integer in service {index + 1}'}, status=400)
                    except (TypeError, ValueError):
                        logger.error(f"Invalid Quantity value at index {index}: {quantity}")
                        return JsonResponse({'error': f'Quantity must be a positive integer in service {index + 1}'}, status=400)

                    # Fetch Service Category
                    try:
                        category_ins = Service_Category_Masters.objects.get(Serviceid=category_id)
                        service_name = category_ins.ServiceCategory
                    except ObjectDoesNotExist:
                        logger.error(f"Service Category with ID {category_id} does not exist")
                        return JsonResponse({'error': f'Service Category with ID {category_id} does not exist'}, status=400)

                    # Determine ContentType and identification object
                    content_type = None
                    identification_object = None

                    sergrpins = Services_Group_Details.objects.filter(object_id = subcategory_pk).first()

                    print(sergrpins,'sergrpins')
                    try:
                        if service_name == 'CONSULTATION':

                            testins = Services_Group_Details.objects.filter(pk=subcategory_pk).first()
                            servicecode = testins.object_id

                            content_type = ContentType.objects.get_for_model(Doctor_Ratecard_Master)
                            identification_object = Doctor_Ratecard_Master.objects.get(pk=subcategory_pk)
                        elif service_name == 'RADIOLOGY':

                            testins = Services_Group_Details.objects.filter(pk=subcategory_pk).first()
                            servicecode = testins.object_id

                            content_type = ContentType.objects.get_for_model(TestName_Details)
                            identification_object = TestName_Details.objects.get(pk=servicecode)
                        elif service_name == 'LAB':

                            testins = Services_Group_Details.objects.filter(pk=subcategory_pk).first()
                            servicecode = testins.object_id

                            content_type = ContentType.objects.get_for_model(Testmaster_Cost_List)
                            identification_object = Testmaster_Cost_List.objects.get(pk=servicecode)
                        elif service_name == 'ROOMSERVICES':

                            testins = Services_Group_Details.objects.filter(pk=subcategory_pk).first()
                            servicecode = testins.object_id

                            content_type = ContentType.objects.get_for_model(WardType_Master_Detials)
                            identification_object = WardType_Master_Detials.objects.get(pk=servicecode)
                        elif service_name == 'PROCEDURES':

                            testins = Services_Group_Details.objects.filter(pk=subcategory_pk).first()
                            servicecode = testins.object_id

                            content_type = ContentType.objects.get_for_model(Procedure_Master_Details)
                            identification_object = Procedure_Master_Details.objects.get(pk=servicecode)
                        else:

                            testins = Services_Group_Details.objects.filter(pk=subcategory_pk).first()
                            servicecode = testins.object_id

                            content_type = ContentType.objects.get_for_model(Service_Master_Details)
                            identification_object = Service_Master_Details.objects.get(pk=servicecode)
                    except ObjectDoesNotExist as e:
                        logger.error(f"Invalid subcategory ID {subcategory_id} for {service_name}: {str(e)}")
                        return JsonResponse({'error': f'Invalid subcategory ID {subcategory_id} for {service_name}'}, status=400)

                    # Create Package_Services_Group_Details instance
                    pkg_service_instance = Package_Services_Group_Details(
                        content_type=content_type,
                        object_id=str(identification_object.pk),  # Ensure object_id is a string
                        service_category=category_ins,
                        service_sub_category=identification_object,
                        Quantity=quantity,
                        SubCategoryname=subcategory_name
                    )
                    created_services.append({
                        'instance': pkg_service_instance,
                        'content_type': content_type,
                        'object_id': str(identification_object.pk),
                        'service_category': category_ins
                    })
                except Exception as e:
                    logger.error(f"Error processing service at index {index}: {str(e)}")
                    return JsonResponse({'error': f'Error processing service {index + 1}: {str(e)}'}, status=400)

            with transaction.atomic():
                if id:
                    # Update existing Package_Master
                    try:
                        package_ins = Package_Master.objects.get(pk=id)
                    except ObjectDoesNotExist:
                        logger.error(f"Package with ID {id} does not exist")
                        return JsonResponse({'error': f'Package with ID {id} does not exist'}, status=404)

                    # Update Package_Master fields
                    package_ins.Package_Name = package_name
                    package_ins.PackageType = package_type
                    package_ins.Price = price
                    package_ins.Status = status
                    package_ins.Discount = discount
                    package_ins.Validity = validity
                    package_ins.Fromdate = from_date
                    package_ins.Todate = to_date
                    package_ins.Specialist = specialist_ins
                    package_ins.save()

                    # Update Services_details
                    existing_services = package_ins.Services_details.all()
                    existing_service_keys = {
                        (s.content_type_id, s.object_id, s.service_category.Serviceid)
                        for s in existing_services
                    }
                    new_service_keys = {
                        (s['content_type'].id, s['object_id'], s['service_category'].Serviceid)
                        for s in created_services
                    }

                    # Delete services not in the new list
                    services_to_delete = existing_services.exclude(
                        content_type_id__in=[k[0] for k in new_service_keys],
                        object_id__in=[k[1] for k in new_service_keys],
                        service_category__Serviceid__in=[k[2] for k in new_service_keys]
                    )
                    services_to_delete.delete()

                    # Add or update new services
                    for service_data in created_services:
                        service = service_data['instance']
                        key = (service_data['content_type'].id, service_data['object_id'], service_data['service_category'].Serviceid)
                        if key in existing_service_keys:
                            # Update existing service
                            existing_service = existing_services.get(
                                content_type_id=service_data['content_type'].id,
                                object_id=service_data['object_id'],
                                service_category__Serviceid=service_data['service_category'].Serviceid
                            )
                            existing_service.Quantity = service.Quantity
                            existing_service.SubCategoryname = service.SubCategoryname
                            existing_service.save()
                        else:
                            # Create new service
                            service.save()
                            package_ins.Services_details.add(service)
                else:
                    # Create new Package_Master
                    package_ins = Package_Master(
                        Package_Name=package_name,
                        PackageType=package_type,
                        Price=price,
                        Status=status,
                        Discount=discount,
                        Validity=validity,
                        Fromdate=from_date,
                        Todate=to_date,
                        Specialist=specialist_ins,
                    )
                    package_ins.save()
                    # Save and link services
                    for service_data in created_services:
                        service = service_data['instance']
                        service.save()
                        package_ins.Services_details.add(service)

            return JsonResponse({'success': f'Package {"updated" if id else "added"} successfully'})

        except Exception as e:
            logger.error(f"Error in POST: {str(e)}", exc_info=True)
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

    if request.method == 'GET':
        try:
            package_ins = Package_Master.objects.all().select_related('Specialist').prefetch_related('Services_details')
            package_data_list = []

            for package in package_ins:
                services_details = []
                for service in package.Services_details.all():
                    try:
                        content_type = service.content_type
                        sub_category_obj = content_type.get_object_for_this_type(pk=service.object_id)
                        sub_category_name = str(sub_category_obj)
                    except Exception as e:
                        sub_category_name = "Unknown"
                        logger.error(f"Error resolving GenericForeignKey for service {service.id}: {str(e)}")

                    services_details.append({
                        "id": service.id,
                        "service_category_id": service.service_category.Serviceid,
                        "Categoryname": service.service_category.ServiceCategory,
                        "service_sub_category_id": service.object_id,
                        "service_sub_category_name": sub_category_name,
                        "Quantity": service.Quantity,
                        "SubCategoryname": service.SubCategoryname,
                        "created_at": service.created_at.isoformat(),
                        "updated_at": service.updated_at.isoformat(),
                    })

                package_data = {
                    "id": package.id,
                    "PackageName": package.Package_Name,
                    "PackageType": package.PackageType,
                    "Price": package.Price,
                    "Status": package.Status,
                    "AllowDiscount": package.Discount,
                    "Validity": package.Validity,
                    "FromDate": package.Fromdate.isoformat() if package.Fromdate else None,
                    "ToDate": package.Todate.isoformat() if package.Todate else None,
                    "Specialist": package.Specialist.Speciality_Id if package.Specialist else None,
                    "Specialistname": package.Specialist.Speciality_Name if package.Specialist else None,
                    "Services_details": services_details,
                }
                package_data_list.append(package_data)

            return JsonResponse(package_data_list, safe=False)

        except Exception as e:
            logger.error(f"Error in GET: {str(e)}", exc_info=True)
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


