from django.http import JsonResponse,HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from Masters.models import *
from Inventory.models import *
from django.db.models import Q
from django.core.files.base import ContentFile
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, time
import pytz
from django.db import transaction
from .scheduler import job_function
from Workbench.models import *
from decimal import Decimal

import json
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP


import logging

# Configure logger for error logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['POST'])
def doctor_drug_prescription_link(request):
    try:
        # Parse JSON data from request body
        prescriptions = json.loads(request.body)
        response_data = []  # To store responses for each prescription

        # Iterate over each prescription entry from the frontend
        for data in prescriptions:
            try:
                # Extract fields from each data entry
                booking_id = data.get('Booking_Id')
                Department = data.get('Department')
                DoctorName = data.get('DoctorName')
                MedicineCode = data.get('MedicineCode')
                MedicineName = data.get('MedicineName')
                Dosage = data.get('Dosage')
                Route = data.get('Route')
                FrequencyMethod = data.get('FrequencyMethod')
                FrequencyName = data.get('FrequencyName')
                FrequencyType = data.get('FrequencyType')
                Frequency = data.get('Frequency')
                FrequencyTime = data.get('FrequencyTime')
                Duration = data.get('Duration')
                DurationType = data.get('DurationType')
                Quantity = data.get('Quantity')
                AdminisDose = data.get('AdminisDose')
                Date = data.get('Date')
                Time = data.get('Time')
                Instruction = data.get('Instruction')
                Prescribedby = data.get('Prescribedby')
                Location = data.get('Location')
                CapturedBy = data.get('CapturedBy')
                Specialization = data.get('Specialization')
                batch_no = data.get('BatchNo')
                storelocation = data.get('storelocation')

                print('batchhh',batch_no)
                print('storeee',storelocation)

                # Foreign key lookups
                booking_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=booking_id).first()
                if not booking_instance:
                    raise ValueError(f"Booking ID {booking_id} not found.")
                
                product_instance = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk=MedicineCode, Store_location=storelocation).first()
                if not product_instance:
                    raise ValueError(f"MedicineCode {MedicineCode} with BatchNo {batch_no} not found.")

                frequency_instance = Frequency_Master_Drug.objects.filter(FrequencyId=FrequencyName).first()
                if not frequency_instance:
                    raise ValueError(f"Frequency {FrequencyName} not found.")
                
                speciality_instance = Speciality_Detials.objects.filter(Speciality_Id=Specialization).first()
                if not speciality_instance:
                    raise ValueError(f"Specialization {Specialization} not found.")
                
                doctor_instance = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorName).first()
                if not doctor_instance:
                    raise ValueError(f"Doctor {DoctorName} not found.")
                
                location_instance = Location_Detials.objects.filter(Location_Id=Location).first()
                if not location_instance:
                    raise ValueError(f"Location {Location} not found.")

                # Create and save a new prescription instance
                prescription_instance = Doctor_drug_prescription(
                    Booking_Id=booking_instance,
                    Department=Department,
                    DoctorName=doctor_instance,
                    ProductCode=product_instance,
                    Route=Route,
                    FrequencyMethod=FrequencyMethod,
                    Frequency=frequency_instance,
                    Duration=Duration,
                    DurationType=DurationType,
                    Quantity=Quantity,
                    AdminisDose=AdminisDose,
                    Date=Date,
                    Time=Time,
                    Instruction=Instruction,
                    Status='Pending',
                    CapturedBy=CapturedBy,
                    Specialization=speciality_instance,
                    IssuedBy=Prescribedby,
                    Location=location_instance,
                )
                prescription_instance.save()

                # Add success response
                response_data.append({
                    'success': True,
                    'message': f'Prescription for {MedicineName} added successfully',
                    'medicine_name': MedicineName
                })

            except Exception as e:
                # Log the error and add failure response
                logger.error(f"Error adding prescription for {MedicineName}: {str(e)}")
                response_data.append({
                    'success': False,
                    'message': f'Failed to add prescription for {MedicineName}',
                    'error': str(e),
                    'medicine_name': MedicineName
                })

        # Return the list of JSON responses
        return JsonResponse({'responses': response_data}, safe=False)

    except json.JSONDecodeError:
        logger.error("Invalid JSON data received.")
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


# @csrf_exempt
# @require_http_methods(["POST"])
# def doctor_drug_prescription_link(request):
#     if request.method == "POST":
#         try:
#             prescriptions = json.loads(request.body)
#             posstttttt = []
            
            
#             for data in prescriptions:
                
#                 booking_id = data.get('Booking_Id')
#                 Department = data.get('Department')
#                 DoctorName = data.get('DoctorName')
#                 GenericName = data.get('GenericName')
#                 MedicineCode = data.get('MedicineCode')
#                 MedicineName = data.get('MedicineName')
#                 Dosage = data.get('Dosage')
#                 Route = data.get('Route')
#                 FrequencyMethod = data.get('FrequencyMethod')
#                 FrequencyName = data.get('FrequencyName')
#                 FrequencyType = data.get('FrequencyType')
#                 Frequency = data.get('Frequency')
#                 FrequencyTime = data.get('FrequencyTime')
#                 Duration = data.get('Duration')
#                 DurationType = data.get('DurationType')
#                 Quantity = data.get('Quantity')
#                 AdminisDose = data.get('AdminisDose')
#                 Date = data.get('Date')
#                 Time = data.get('Time')
#                 Instruction = data.get('Instruction')
#                 Prescribedby = data.get('Prescribedby')
#                 Location = data.get('Location')
#                 CapturedBy = data.get('CapturedBy')
#                 Status = 'Pending'
#                 RequestType = 'Pending'
#                 Specialization = data.get('Specialization')
#                 batch_no = data.get('BatchNo')

#                 # Retrieve related instances for foreign key fields
#                 booking_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=booking_id)
#                 product_instance = Stock_Maintance_Table_Detials.objects.get(Product_Detials__pk=MedicineCode, Batch_No = batch_no)
#                 frequency_instance = Frequency_Master_Drug.objects.get(FrequencyId=FrequencyName)
#                 speciality_instance = Speciality_Detials.objects.get(Speciality_Id=Specialization)
#                 doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DoctorName)
#                 location_instance = Location_Detials.objects.get(Location_Id=Location)

#                 print('11111111',booking_instance)
#                 print('2222222',product_instance)
#                 print('3333333',frequency_instance)
#                 print('4444444444',speciality_instance)
#                 print('55555555',doctor_instance)
#                 print('666666666666',location_instance)
#                 # Create and save a new prescription instance
#                 prescription_instance = Doctor_drug_prescription(
#                     Booking_Id=booking_instance,
#                     Department=Department,
#                     DoctorName=doctor_instance,
#                     ProductCode=product_instance,
#                     Route=Route,
#                     FrequencyMethod=FrequencyMethod,
#                     Frequency=frequency_instance,
#                     Duration=Duration,
#                     DurationType=DurationType,
#                     Quantity=Quantity,
#                     AdminisDose=AdminisDose,
#                     Date=Date,
#                     Time=Time,
#                     Instruction=Instruction,
#                     Status=Status,
#                     CapturedBy=CapturedBy,
#                     Specialization=speciality_instance,
#                     IssuedBy=Prescribedby,
#                     Location=location_instance,
#                 )
#                 prescription_instance.save()
                
#                 posstttttt.append({
#                     'success': True,
#                     'message': f'Prescription for {MedicineName} added successfully',
#                     'medicine_name': MedicineName
#                 })
                
        
#         except Exception as e:
#             print(f'An error occurred:{str(e)}')
#             return JsonResponse({'error': str(e)}, status=500) 
    

    
    
# @csrf_exempt
# @require_http_methods(['GET'])
# def Nurse_drug_prescription_link(request):
#     if request.method == 'GET':
#         try:
#             booking_id = request.GET.get('Registration_Id')
            
#             presc_instance = Doctor_drug_prescription.objects.filter(Booking_Id=booking_id, RequestType='')
#             nurse_pres = Nurse_drug_prescription.objects.filter(Booking_Id=booking_id, RequestType='')
            
#             presc_data_list = []
#             id_counter = 1  # Initialize counter starting from 1
            
#             # Add Doctor's prescription data with incremented id
#             for pres in presc_instance:
#                 presc_dat = {
#                     'id': id_counter,
#                     'Billing_Id': pres.Booking_Id.Registration_Id,
#                     'Prescription_Id': pres.Prescription_Id,
#                     'Department': pres.Department,
#                     'Specialization': pres.Specialization.Speciality_Name if pres.Specialization else None,
#                     'DoctorName': pres.DoctorName.ShortName if pres.DoctorName else None,
#                     'ProductCode': pres.ProductCode.Product_Detials.ItemName,
#                     'GenericName': pres.ProductCode.Product_Detials.GenericName.GenericName,
#                     'MedicineCode': pres.ProductCode.Product_Detials.pk,
#                     'Dosage': pres.ProductCode.Product_Detials.Strength,
#                     'DrugType': pres.ProductCode.Product_Detials.ProductType.ProductType_Name,
#                     'Route': pres.Route,
#                     'FrequencyMethod': pres.FrequencyMethod,
#                     'Frequency': pres.Frequency.FrequencyName,
#                     'FrequencyType': pres.Frequency.FrequencyType,
#                     'FrequencyTime': pres.Frequency.FrequencyTime,
#                     'Duration': pres.Duration,
#                     'DurationType': pres.DurationType,
#                     'Quantity': pres.Quantity,
#                     'AdminisDose': pres.AdminisDose,
#                     'Date': pres.Date,
#                     'Time': pres.Time,
#                     'Instruction': pres.Instruction,
#                     'Status': pres.Status,
#                     'CapturedBy': pres.CapturedBy,
#                     'MedicalCat' : pres.ProductCode.Product_Detials.ProductCategory.ProductCategory_Name,
#                 }
#                 presc_data_list.append(presc_dat)
#                 id_counter += 1  # Increment counter for next entry

#             # Add Nurse's prescription data with incremented id
#             for nurse in nurse_pres:
#                 presc_data = {
#                     'id': id_counter,
#                     'Billing_Id': nurse.Booking_Id.Registration_Id,
#                     'Prescription_Id': nurse.Prescription_Id,
#                     'ProductCode': nurse.ProductCode.Product_Detials.ItemName,
#                     'GenericName': nurse.ProductCode.Product_Detials.GenericName.GenericName,
#                     'MedicineCode': nurse.ProductCode.Product_Detials.pk,
#                     'Dosage': nurse.ProductCode.Product_Detials.Strength,
#                     'DrugType': nurse.ProductCode.Product_Detials.ProductType.ProductType_Name,
#                     'Route': nurse.Route,
#                     'FrequencyMethod': nurse.FrequencyMethod if nurse.FrequencyMethod else None,
#                     'Frequency': nurse.Frequency.FrequencyName if nurse.Frequency else None,
#                     'FrequencyType': nurse.Frequency.FrequencyType if nurse.Frequency else None,
#                     'FrequencyTime': nurse.Frequency.FrequencyTime if nurse.Frequency else None,
#                     'Duration': nurse.Duration,
#                     'DurationType': nurse.DurationType,
#                     'Quantity': nurse.Quantity,
#                     'AdminisDose': nurse.AdminisDose,
#                     'Date': nurse.Date,
#                     'Time': nurse.Time,
#                     'Instruction': nurse.Instruction,
#                     'Status': nurse.Status,
#                     'CapturedBy': nurse.CapturedBy,
#                     'MedicalCat' : nurse.ProductCode.Product_Detials.ProductCategory.ProductCategory_Name,
#                 }
#                 presc_data_list.append(presc_data)
#                 id_counter += 1  # Increment counter for next entry

#             return JsonResponse(presc_data_list, safe=False)
        
#         except Exception as e:
#             return JsonResponse({'error': str(e)})
        
@csrf_exempt
@require_http_methods(['GET'])
def Nurse_drug_prescription_link(request):
    if request.method == 'GET':
        try:
            booking_id = request.GET.get('Registration_Id')
            
            presc_instance = Doctor_drug_prescription.objects.filter(Booking_Id=booking_id, RequestType='')
            nurse_pres = Nurse_drug_prescription.objects.filter(Booking_Id=booking_id, RequestType='')
            
            presc_data_list = []
            id_counter = 1  # Initialize counter starting from 1

            # ---------------------------
            # DOCTOR PRESCRIPTIONS
            # ---------------------------
            for pres in presc_instance:
                prod = pres.ProductCode.Product_Detials if pres.ProductCode else None
                freq = pres.Frequency if pres.Frequency else None

                presc_data_list.append({
                    'id': id_counter,
                    'Billing_Id': getattr(pres.Booking_Id, 'Registration_Id', None),
                    'Prescription_Id': pres.Prescription_Id,
                    'Department': pres.Department,
                    'Specialization': getattr(pres.Specialization, 'Speciality_Name', None),
                    'DoctorName': getattr(pres.DoctorName, 'ShortName', None),
                    'ProductCode': getattr(prod, 'ItemName', None),
                    'GenericName': getattr(getattr(prod, 'GenericName', None), 'GenericName', None),
                    'MedicineCode': getattr(prod, 'pk', None),
                    'Dosage': getattr(prod, 'Strength', None),
                    'DrugType': getattr(getattr(prod, 'ProductType', None), 'ProductType_Name', None),
                    'Route': pres.Route,
                    'FrequencyMethod': pres.FrequencyMethod,
                    'Frequency': getattr(freq, 'FrequencyName', None),
                    'FrequencyType': getattr(freq, 'FrequencyType', None),
                    'FrequencyTime': getattr(freq, 'FrequencyTime', None),
                    'Duration': pres.Duration,
                    'DurationType': pres.DurationType,
                    'Quantity': pres.Quantity,
                    'AdminisDose': pres.AdminisDose,
                    'Date': pres.Date,
                    'Time': pres.Time,
                    'Instruction': pres.Instruction,
                    'Status': pres.Status,
                    'CapturedBy': pres.CapturedBy,
                    'MedicalCat': getattr(getattr(prod, 'ProductCategory', None), 'ProductCategory_Name', None),
                })
                id_counter += 1

            # ---------------------------
            # NURSE PRESCRIPTIONS
            # ---------------------------
            for nurse in nurse_pres:
                prod = nurse.ProductCode.Product_Detials if nurse.ProductCode else None
                freq = nurse.Frequency if nurse.Frequency else None

                presc_data_list.append({
                    'id': id_counter,
                    'Billing_Id': getattr(nurse.Booking_Id, 'Registration_Id', None),
                    'Prescription_Id': nurse.Prescription_Id,
                    'ProductCode': getattr(prod, 'ItemName', None),
                    'GenericName': getattr(getattr(prod, 'GenericName', None), 'GenericName', None),
                    'MedicineCode': getattr(prod, 'pk', None),
                    'Dosage': getattr(prod, 'Strength', None),
                    'DrugType': getattr(getattr(prod, 'ProductType', None), 'ProductType_Name', None),
                    'Route': nurse.Route,
                    'FrequencyMethod': nurse.FrequencyMethod,
                    'Frequency': getattr(freq, 'FrequencyName', None),
                    'FrequencyType': getattr(freq, 'FrequencyType', None),
                    'FrequencyTime': getattr(freq, 'FrequencyTime', None),
                    'Duration': nurse.Duration,
                    'DurationType': nurse.DurationType,
                    'Quantity': nurse.Quantity,
                    'AdminisDose': nurse.AdminisDose,
                    'Date': nurse.Date,
                    'Time': nurse.Time,
                    'Instruction': nurse.Instruction,
                    'Status': nurse.Status,
                    'CapturedBy': nurse.CapturedBy,
                    'MedicalCat': getattr(getattr(prod, 'ProductCategory', None), 'ProductCategory_Name', None),
                })
                id_counter += 1

            return JsonResponse(presc_data_list, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def Nurse_drug_prescription_Completed(request):
    if request.method == 'GET':
        try:
            booking_id = request.GET.get('Registration_Id')
            print(booking_id, 'booking_id')

            # Fetch data from ip_drug_request_table
            presc_instance = ip_drug_request_table.objects.filter(Booking_Id=booking_id, Status='issued')

            # Fetch data from Doctor_drug_prescription with OrderType filter
            doctor_presc_instance = Doctor_drug_prescription.objects.filter(Booking_Id=booking_id).filter(OrderType__in=['OWN_Medicine', 'OUT_Source']).filter(Status__in=['issued','Pending'])

            presc_data_list = []
            id_counter = 1  # Initialize counter starting from 1
            
            # Add data from ip_drug_request_table
            for pres in presc_instance:
                presc_dat = {
                    'id': id_counter,
                    'Billing_Id': pres.Booking_Id.Registration_Id,
                    'Prescription_Id': pres.Prescription_Id.Prescription_Id,
                    'Department': pres.Department,
                    'DoctorName': pres.DoctorName.ShortName if pres.DoctorName else None,
                    'ProductCode': pres.ProductCode.Product_Detials.ItemName,
                    'GenericName': pres.ProductCode.Product_Detials.GenericName.GenericName,
                    'MedicineCode': pres.ProductCode.Product_Detials.pk,
                    'Dosage': pres.ProductCode.Product_Detials.Strength,
                    'DrugType': pres.ProductCode.Product_Detials.ProductType.ProductType_Name,
                    'Route': pres.Route,
                    'FrequencyMethod': pres.FrequencyMethod,
                    'Frequency': pres.Frequency.FrequencyName,
                    'FrequencyType': pres.Frequency.FrequencyType,
                    'FrequencyTime': pres.Frequency.FrequencyTime,
                    'Duration': pres.Duration,
                    'DurationType': pres.DurationType,
                    'Quantity': pres.Quantity,
                    'RecievedQuantity': pres.RequestQuantity,
                    'AdminisDose': pres.AdminisDose,
                    'Date': pres.Date,
                    'Time': pres.Time,
                    'Instruction': pres.Instruction,
                    'Status': pres.Status,
                    'CapturedBy': pres.CapturedBy,
                    'MedicalCat': pres.ProductCode.Product_Detials.ProductCategory.ProductCategory_Name,
                }
                presc_data_list.append(presc_dat)
                id_counter += 1  # Increment counter for next entry

            # Add data from Doctor_drug_prescription
            for doc_pres in doctor_presc_instance:
                doc_presc_dat = {
                    'id': id_counter,
                    'Billing_Id': doc_pres.Booking_Id.Registration_Id,
                    'Prescription_Id': doc_pres.Prescription_Id,
                    'Department': doc_pres.Department,
                    'DoctorName': doc_pres.DoctorName.ShortName if doc_pres.DoctorName else None,
                    'ProductCode': doc_pres.ProductCode.Product_Detials.ItemName,
                    'GenericName': doc_pres.ProductCode.Product_Detials.GenericName.GenericName,
                    'MedicineCode': doc_pres.ProductCode.Product_Detials.pk,
                    'Dosage': doc_pres.ProductCode.Product_Detials.Strength,
                    'DrugType': doc_pres.ProductCode.Product_Detials.ProductType.ProductType_Name,
                    'Route': doc_pres.Route,
                    'FrequencyMethod': doc_pres.FrequencyMethod,
                    'Frequency': doc_pres.Frequency.FrequencyName,
                    'FrequencyType': doc_pres.Frequency.FrequencyType,
                    'FrequencyTime': doc_pres.Frequency.FrequencyTime,
                    'Duration': doc_pres.Duration,
                    'DurationType': doc_pres.DurationType,
                    'Quantity': doc_pres.Quantity,
                    'RecievedQuantity': doc_pres.RequestQuantity,
                    'AdminisDose': doc_pres.AdminisDose,
                    'Date': doc_pres.Date,
                    'Time': doc_pres.Time,
                    'Instruction': doc_pres.Instruction,
                    'Status': doc_pres.Status,
                    'CapturedBy': doc_pres.CapturedBy,
                    'MedicalCat': doc_pres.ProductCode.Product_Detials.ProductCategory.ProductCategory_Name,
                }
                presc_data_list.append(doc_presc_dat)
                id_counter += 1

            return JsonResponse(presc_data_list, safe=False)
        
        except Exception as e:
            return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['POST'])
def Nurse_drug_prescription_Recieved(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            booking_id = data.get('Billing_Id', '')
            prescription_id = data.get('Prescription_Id', '')
            print('Received data:', data)
            
            # Try to get from ip_drug_request_table first
            try:
                presc_instance = ip_drug_request_table.objects.filter(Booking_Id=booking_id, Status='issued', Prescription_Id=prescription_id).first()
                print('Found in ip_drug_request_table:', presc_instance)
            except ip_drug_request_table.DoesNotExist:
                presc_instance = None

            # If not found in ip_drug_request_table, try to get from Doctor_drug_prescription
            if not presc_instance:
                try:
                    presc_instance = Doctor_drug_prescription.objects.filter(Booking_Id=booking_id, OrderType__in=['OWN_Medicine', 'OUT_Source'], Prescription_Id=prescription_id).first()
                    print('Found in Doctor_drug_prescription:', presc_instance)
                except Doctor_drug_prescription.DoesNotExist:
                    presc_instance = None

            # If found in either table, update the status
            if presc_instance:
                presc_instance.Status = 'Recieved'
                presc_instance.save()
                job_function()
            else:
                return JsonResponse({'error': 'Select Valid Drug to Approve'})
                
            return JsonResponse({'success': 'Drug Details Approved Successfully'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(['GET'])
# def approved_drug_details(request):
#     try:
#         ip_approved = IP_Pharmacy_Billing_Table_Detials.objects.all()
    
  
#     except:
#        return JsonResponse({'error': 'no approved details '}, status=400)
        



@csrf_exempt
@require_http_methods(['GET'])
def Pharmacy_drug_quelist_link(request):
    try:
        booking_id = request.GET.get('Registration_Id')
        
        if not booking_id:
            return JsonResponse({'error': 'Registration_Id parameter is required'}, status=400)
        
        # Query without distinct
        presc_data = Doctor_drug_prescription.objects.filter(
            Booking_Id=booking_id, Status='Pending'
        ).values(
            'Booking_Id__Registration_Id',
            'Prescription_Id',
            'Department',
            'Specialization__Speciality_Name',
            'DoctorName__ShortName',
            'ProductCode__Product_Detials__ItemName',
            'ProductCode__Product_Detials__GenericName__GenericName',
            'ProductCode__Product_Detials__pk',
            'ProductCode__Product_Detials__Strength',
            'ProductCode__Product_Detials__ProductType__ProductType_Name',
            'Route',
            'FrequencyMethod',
            'Frequency__FrequencyName',
            'Frequency__FrequencyType',
            'Frequency__FrequencyTime',
            'Duration',
            'DurationType',
            'Quantity',
            'AdminisDose',
            'created_at',
            'Instruction',
            'Status',
            'CapturedBy'
        )

        # Filter for distinct created_at in Python
        distinct_data = []
        seen_dates = set()
        for item in presc_data:
            if item['created_at'] not in seen_dates:
                distinct_data.append(item)
                seen_dates.add(item['created_at'])

        # Format data for response
        presc_data_list = [
            {
                'Billing_Id': item['Booking_Id__Registration_Id'],
                'Prescription_Id': item['Prescription_Id'],
                'Department': item['Department'],
                'Specialization': item['Specialization__Speciality_Name'],
                'DoctorName': item['DoctorName__ShortName'],
                'ProductCode': item['ProductCode__Product_Detials__ItemName'],
                'GenericName': item['ProductCode__Product_Detials__GenericName__GenericName'],
                'MedicineCode': item['ProductCode__Product_Detials__pk'],
                'Dosage': item['ProductCode__Product_Detials__Strength'],
                'DrugType': item['ProductCode__Product_Detials__ProductType__ProductType_Name'],
                'Route': item['Route'],
                'FrequencyMethod': item['FrequencyMethod'],
                'Frequency': item['Frequency__FrequencyName'],
                'FrequencyType': item['Frequency__FrequencyType'],
                'FrequencyTime': item['Frequency__FrequencyTime'],
                'Duration': item['Duration'],
                'DurationType': item['DurationType'],
                'Quantity': item['Quantity'],
                'AdminisDose': item['AdminisDose'],
                'Date': item['created_at'].date(),  # format created_at as Date and Time
                'Time': item['created_at'].time(),
                'Instruction': item['Instruction'],
                'Status': item['Status'],
                'CapturedBy': item['CapturedBy'],
            }
            for item in distinct_data
        ]
        
        return JsonResponse(presc_data_list, safe=False)
    
    except Doctor_drug_prescription.DoesNotExist:
        return JsonResponse({'error': 'No pending prescriptions found for this booking ID'}, status=404)
    
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

# @csrf_exempt
# @require_http_methods(['GET'])
# def Nurse_drug_prescription_link(request):
#     try:
#         booking_id = request.GET.get('Registration_Id')
        
#         if not booking_id:
#             return JsonResponse({'error': 'Registration_Id parameter is required'}, status=400)
        
#         # Filter prescriptions by booking_id and status, retrieving distinct date and time fields
#         presc_data = Doctor_drug_prescription.objects.filter(
#             Booking_Id=booking_id, Status='Pending'
#         ).values(
#             'Booking_Id__Registration_Id',
#             'Prescription_Id',
#             'Department',
#             'Specialization__Speciality_Name',
#             'DoctorName__ShortName',
#             'ProductCode__ItemName',
#             'ProductCode__GenericName__GenericName',
#             'ProductCode__pk',
#             'ProductCode__Strength',
#             'ProductCode__ProductType__ProductType_Name',
#             'Route',
#             'FrequencyMethod',
#             'Frequency__FrequencyName',
#             'Frequency__FrequencyType',
#             'Frequency__FrequencyTime',
#             'Duration',
#             'DurationType',
#             'Quantity',
#             'AdminisDose',
#             'created_at',
#             'Instruction',
#             'Status',
#             'CapturedBy'
#         ).distinct('created_at')  # Ensuring distinct Date and Time entries

#         # Format data for response
#         presc_data_list = [
#             {
#                 'Billing_Id': item['Booking_Id__Registration_Id'],
#                 'Prescription_Id': item['Prescription_Id'],
#                 'Department': item['Department'],
#                 'Specialization': item['Specialization__Speciality_Name'],
#                 'DoctorName': item['DoctorName__ShortName'],
#                 'ProductCode': item['ProductCode__ItemName'],
#                 'GenericName': item['ProductCode__GenericName__GenericName'],
#                 'MedicineCode': item['ProductCode__pk'],
#                 'Dosage': item['ProductCode__Strength'],
#                 'DrugType': item['ProductCode__ProductType__ProductType_Name'],
#                 'Route': item['Route'],
#                 'FrequencyMethod': item['FrequencyMethod'],
#                 'Frequency': item['Frequency__FrequencyName'],
#                 'FrequencyType': item['Frequency__FrequencyType'],
#                 'FrequencyTime': item['Frequency__FrequencyTime'],
#                 'Duration': item['Duration'],
#                 'DurationType': item['DurationType'],
#                 'Quantity': item['Quantity'],
#                 'AdminisDose': item['AdminisDose'],
#                 'Date': item['Date'],
#                 'Time': item['Time'],
#                 'Instruction': item['Instruction'],
#                 'Status': item['Status'],
#                 'CapturedBy': item['CapturedBy'],
#             }
#             for item in presc_data
#         ]
        
#         return JsonResponse(presc_data_list, safe=False)
    
#     except Doctor_drug_prescription.DoesNotExist:
#         return JsonResponse({'error': 'No pending prescriptions found for this booking ID'}, status=404)
    
#     except Exception as e:
#         return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def Nurse_drug_prescription_Add_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            Booking_Id = data.get('Booking_Id', '')
            Prescription_Id = data.get('Prescription_Id', '')
            OrderType = data.get('OrderType', '')
            Quantity = data.get('Quantity', '')
            RequestType = data.get('RequestType', '')
            RequestQuantity = data.get('RequestQuantity', '')
            MedCat = data.get('MedicalCat', '')

            if Booking_Id and Prescription_Id and MedCat == 'MEDICAL':
                pres = Doctor_drug_prescription.objects.filter(
                    Booking_Id=Booking_Id, Prescription_Id=Prescription_Id
                ).first()

                # update
                pres.Quantity = Quantity
                pres.OrderType = OrderType
                pres.RequestType = RequestType
                pres.RequestQuantity = RequestQuantity
                pres.save()

                # also save into ip_drug_request_table
                remaining = (int(pres.Quantity or 0) - int(pres.RequestQuantity or 0))
                ip_drug_request_table.objects.create(
                    Booking_Id=pres.Booking_Id,
                    Prescription_Id=pres,
                    Department=pres.Department,
                    DoctorName=pres.DoctorName,
                    ProductCode=pres.ProductCode,
                    Route=pres.Route,
                    Frequency=pres.Frequency,
                    FrequencyMethod=pres.FrequencyMethod,
                    OrderType=pres.OrderType,
                    Quantity=pres.Quantity,
                    RequestType=pres.RequestType,
                    RequestQuantity=pres.RequestQuantity,
                    RemainingQuantity=remaining,
                    Instruction=pres.Instruction,
                    Location=pres.Location,
                    IssuedBy=pres.IssuedBy if hasattr(pres, 'IssuedBy') else '',
                    CapturedBy=pres.CapturedBy if hasattr(pres, 'CapturedBy') else '',
                    Status='Pending',
                    Duration=pres.Duration,
                    DurationType=pres.DurationType,
                    Date=timezone.now()  # or your `tablet_date_issue`
                )

                job_function()
                return JsonResponse({'success': 'Drug details added successfully'})

            elif Booking_Id and Prescription_Id and not MedCat == 'MEDICAL':
                pres = Nurse_drug_prescription.objects.filter(
                    Booking_Id=Booking_Id, Prescription_Id=Prescription_Id
                ).first()

                # update
                pres.Quantity = Quantity
                pres.OrderType = OrderType
                pres.RequestType = RequestType
                pres.RequestQuantity = RequestQuantity
                pres.save()

                # also save into ip_drug_request_table (Prescription_Id left NULL)
                remaining = (int(pres.Quantity or 0) - int(pres.RequestQuantity or 0))
                ip_drug_request_table.objects.create(
                    Booking_Id=pres.Booking_Id,
                    Prescription_Id=None,
                    Department=pres.Department,
                    DoctorName=None,
                    ProductCode=pres.ProductCode,
                    Route=pres.Route,
                    Frequency=pres.Frequency,
                    FrequencyMethod=pres.FrequencyMethod,
                    OrderType=pres.OrderType,
                    Quantity=pres.Quantity,
                    RequestType=pres.RequestType,
                    RequestQuantity=pres.RequestQuantity,
                    RemainingQuantity=remaining,
                    Instruction=pres.Instruction,
                    Location=pres.Location,
                    IssuedBy=pres.IssuedBy if hasattr(pres, 'IssuedBy') else '',
                    CapturedBy=pres.CapturedBy if hasattr(pres, 'CapturedBy') else '',
                    Status='Pending',
                    Duration=pres.Duration,
                    DurationType=pres.DurationType,
                    Date=timezone.now()
                )

                job_function()
                return JsonResponse({'success': 'Drug details added successfully megamda'})

            else:
                return JsonResponse({'error': 'Booking_Id and Prescription_Id are required'})

        except Doctor_drug_prescription.DoesNotExist:
            return JsonResponse({'error': 'Doctor prescription not found'})
        except Nurse_drug_prescription.DoesNotExist:
            return JsonResponse({'error': 'Nurse prescription not found'})
        except Exception as e:
            return JsonResponse({'error': str(e)})

       
@csrf_exempt
@require_http_methods(['POST'])
def Nurse_drug_prescription_update_link(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            prescriptions = json.loads(request.body)
            responses = []  # To store responses for each prescription
            prescription_instance=None
            # Iterate over each prescription entry from the frontend
            for data in prescriptions:
                try:
                    # Extract fields from each data entry
                    booking_id = data.get('Billing_Id')
                    Medical_Category = data.get('Medical_Category')                    
                    GenericName = data.get('GenericName')
                    MedicineCode = data.get('MedicineCode')
                    Dosage = data.get('Dosage')
                    Route = data.get('Route')
                    FrequencyMethod = data.get('FrequencyMethod')
                    FrequencyName = data.get('FrequencyName')
                    FrequencyType = data.get('FrequencyType')
                    Frequency = data.get('Frequency')
                    FrequencyTime = data.get('FrequencyTime')
                    Duration = data.get('Duration')
                    DurationType = data.get('DurationType')
                    Quantity = data.get('Quantity')
                    AdminisDose = data.get('AdminisDose')
                    Instruction = data.get('Instruction')
                    Prescribedby = data.get('Prescribedby')
                    Location = data.get('Location')
                    CapturedBy = data.get('CapturedBy')
                    Status = 'Pending'
                    RequestType = 'Pending'
                    batch_no = data.get('BatchNo')
                    storelocation = data.get('StoreLocation')


                    print('111111',data)
                    # Retrieve related instances for foreign key fields
                    booking_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=booking_id).first()
                    product_instance = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk=MedicineCode,Store_location = storelocation).first()
                    location_instance = Location_Detials.objects.filter(Location_Id=Location).first()
                    frequency_instance = Frequency_Master_Drug.objects.filter(FrequencyId=FrequencyName).first()
                    if not prescription_instance :
                        Doctor_drug_prescription.objects.create(
                            Booking_Id=booking_instance,
                            ProductCode=product_instance,
                            Route=Route,
                            FrequencyMethod=FrequencyMethod,
                            Frequency=frequency_instance,
                            Duration=Duration,
                            DurationType=DurationType,
                            Quantity=Quantity,
                            AdminisDose=AdminisDose,
                            Instruction=Instruction,
                            Status=Status,
                            CapturedBy=CapturedBy,
                            IssuedBy=Prescribedby,
                            Location=location_instance,
                            
                        )
                        return JsonResponse({'status':f'Prescription Added SuccessFully'})
                    location_instance = Location_Detials.objects.filter(Location_Id=Location).first()
                    
                    if Medical_Category == 'MEDICAL':
                        frequency_instance = Frequency_Master_Drug.objects.filter(FrequencyId=FrequencyName).first()
                        # Create and save a new prescription instance
                        prescription_instance = Doctor_drug_prescription(
                            Booking_Id=booking_instance,
                            ProductCode=product_instance,
                            Route=Route,
                            FrequencyMethod=FrequencyMethod,
                            Frequency=frequency_instance,
                            Duration=Duration,
                            DurationType=DurationType,
                            Quantity=Quantity,
                            AdminisDose=AdminisDose,
                            Instruction=Instruction,
                            Status=Status,
                            CapturedBy=CapturedBy,
                            IssuedBy=Prescribedby,
                            Location=location_instance,
                            
                        )
                        prescription_instance.save()
                        responses.append({'success': f'Prescription Updated successfully'})
                    else:
                        # Create and save a new prescription instance
                        prescription_instance = Nurse_drug_prescription(
                            Booking_Id=booking_instance,
                            ProductCode=product_instance,
                            Route=Route,
                            # Duration=Duration,
                            # DurationType=DurationType,
                            Quantity=Quantity,
                            AdminisDose=AdminisDose,
                            Instruction=Instruction,
                            Status=Status,
                            CapturedBy=CapturedBy,
                            IssuedBy=Prescribedby,
                            Location=location_instance,
                        )
                        prescription_instance.save()
                        responses.append({'success': f'Prescription added successfully'})
                except Exception as e:
                    responses.append({'error': f'Failed to add prescription : {str(e)}'})

            # Return a response after processing all entries
            return JsonResponse(responses, safe=False)
    
        except Doctor_drug_prescription.DoesNotExist:
            return JsonResponse({'error': 'Prescription not found'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
        
@csrf_exempt
@require_http_methods(['GET'])
def get_for_ip_durgs_doctor_show(request):
    try:
        booking_id = request.GET.get('Booking_id')
        print('11111',booking_id)
        
        booking_instance = Doctor_drug_prescription.objects.filter(Booking_Id = booking_id)
        print('22222',booking_instance)
        # frequency_instance = Frequency_Master_Drug.objects.get()
        booking_instance_data = []
        for booking in booking_instance:
            book ={
                'Prescibtion_Id' : booking.Prescription_Id,
                'Booking_Id' : booking.Booking_Id.Registration_Id,
                'Department' : booking.Department,
                'DoctorName' : booking.DoctorName.ShortName,
                'GenericName' : booking.ProductCode.Product_Detials.GenericName.GenericName,
                'MedicineCode' : booking.ProductCode.Product_Detials.pk,
                'MedicineName' : booking.ProductCode.Product_Detials.ItemName,
                'Route' : booking.Route,
                'FrequencyIssued' : booking.Frequency.Frequency,
                'FrequencyMethod' : booking.FrequencyMethod,
                'PrescribedDate' : booking.Date,
                'IssuedDate' : booking.created_at,
                'AdminisDose' : booking.AdminisDose,
                'Location' : booking.Location.Location_Name,
            }
            print('3333333',book)
            booking_instance_data.append(book)
        return JsonResponse(booking_instance_data,safe=False)
    except Exception as e:
        return JsonResponse({'error':str(e)})
    
    
    
from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
@require_http_methods(["GET"])
def inhouse_pharmacy_queue_list_prescrib(request):
    try:
        # Extract query parameters
        search_first_name = request.GET.get('SearchbyFirstName')
        search_speciality = request.GET.get('SearchbySpeciality')
        search_doctor = request.GET.get('SearchbyDoctor')
        date_type = request.GET.get('DateType')
        current_date = request.GET.get('CurrentDate')
        from_date = request.GET.get('FromDate')
        to_date = request.GET.get('ToDate')
        status_filter = request.GET.get('SearchStatus')
        location = request.GET.get('location')
        Type = request.GET.get('type')
 
        # Base query for pending and issued drug requests
        search_query = Q(Status__in=['Pending', 'issued'])
 
        # Filtering by doctor
        if search_doctor:
            search_query &= Q(Booking_Id__PrimaryDoctor__Doctor_ID__icontains=search_doctor)
 
        # Filtering by speciality
        if search_speciality:
            search_query &= Q(Booking_Id__PrimaryDoctor__Specialization__Speciality_Id__icontains=search_speciality)
 
        # Filtering by status
        if status_filter:
            search_query &= Q(Status=status_filter)
 
        # Filtering by patient name or phone number
        if search_first_name:
            search_query &= (
                Q(Booking_Id__PatientId__FirstName__icontains=search_first_name) |
                Q(Booking_Id__PatientId__MiddleName__icontains=search_first_name) |
                Q(Booking_Id__PatientId__SurName__icontains=search_first_name) |
                Q(Booking_Id__PatientId__PhoneNo__icontains=search_first_name)
            )
 
        # Date filtering
        if date_type == "Current" and current_date:
            search_query &= Q(created_at__date=current_date)
        elif date_type == "Customize":
            if from_date and to_date:
                search_query &= Q(created_at__date__range=[from_date, to_date])
            elif from_date:
                search_query &= Q(created_at__date__gte=from_date)
            elif to_date:
                search_query &= Q(created_at__date__lte=to_date)
 
        # Filtering by location
        if location:
            search_query &= Q(Location=location)
        if Type == 'IP':
            # Fetch drug requests based on the query
            drug_requests = ip_drug_request_table.objects.filter(search_query,OrderType='IP_Pharmacy').select_related(
                'Booking_Id__PrimaryDoctor',
                'Booking_Id__PatientId'
            ).prefetch_related(
                'Booking_Id'
            )
            
        else:
            # Fetch drug requests based on the query
            drug_requests = ip_drug_request_table.objects.filter(search_query,OrderType='FOC_Pharmacy').select_related(
                'Booking_Id__PrimaryDoctor',
                'Booking_Id__PatientId'
            ).prefetch_related(
                'Booking_Id'
            )
    
        datafetch = []
        processed_patients = set()
        record_id = 1
 
        # Process each drug request
        for drug_request in drug_requests:
            registration_id = drug_request.Booking_Id
            if not registration_id:
                continue
 
            room_detail = Patient_Admission_Room_Detials.objects.filter(
                IP_Registration_Id_id=registration_id
            ).last()
 
            if not room_detail or not room_detail.RoomId:
                continue
 
            # room_status = Room_Master_Detials.objects.filter(
            #     Room_Id=room_detail.RoomId.Room_Id, Booking_Status='Occupied'
            # ).first()
 
            # if not room_status:
            #     continue
 
            patient_data = Patient_IP_Registration_Detials.objects.filter(
                Registration_Id=registration_id.Registration_Id
            ).first()
 
            if not patient_data:
                continue
 
            personal_data = Patient_Detials.objects.filter(
                PatientId=patient_data.PatientId.PatientId
            ).first()
 
            if not personal_data or personal_data.PatientId in processed_patients:
                continue
 
            # Avoid duplicate patient data
            processed_patients.add(personal_data.PatientId)
 
            # Patient full name
            patient_name = " ".join(filter(None, [
                personal_data.FirstName, personal_data.MiddleName, personal_data.SurName
            ]))
 
            # Handle patient category (Insurance or Client)
            category_name, category_id = None, None
            if patient_data.PatientCategory == 'Insurance' and patient_data.InsuranceName:
                category_name = patient_data.InsuranceName.Insurance_Name
                category_id = patient_data.InsuranceName.Insurance_Id
            elif patient_data.PatientCategory == 'Client' and patient_data.ClientName:
                category_name = patient_data.ClientName.Client_Name
                category_id = patient_data.ClientName.Client_Id
 
            # Append data to response
            datafetch.append({
                'id': record_id,
                'VisitType': Type,
                'RegistrationId': registration_id.Registration_Id,
                'Booking_Id': registration_id.Registration_Id,
                'PatientName': patient_name or "Unknown Patient",
                'PatientCategory': patient_data.PatientCategory,
                'PatientCategoryName': category_name,
                # 'RoomId': room_status.Room_Id,
                # 'RoomNo': room_status.Ward_Name.RoomNo,
                'PatientId': personal_data.PatientId,
                'PatientPhoneNo': personal_data.PhoneNo,
                'DoctorName': f"{patient_data.PrimaryDoctor.Tittle.Title_Name}.{patient_data.PrimaryDoctor.First_Name} {patient_data.PrimaryDoctor.Middle_Name} {patient_data.PrimaryDoctor.Last_Name}" if patient_data.PrimaryDoctor else None,
                'Doctorid': patient_data.PrimaryDoctor.Doctor_ID if patient_data.PrimaryDoctor else None,
                'Prescription_Id': drug_request.Prescription_Id.Prescription_Id if drug_request.Prescription_Id else None,
                'AgeGender': f"{personal_data.Age or ''}/{personal_data.Gender or ''}",
                'Address': ", ".join(filter(None, [
                    personal_data.DoorNo, personal_data.Street, personal_data.Area,
                    personal_data.City, personal_data.State, personal_data.Country,
                    personal_data.Pincode
                ])),
                "ServiceProcedureForm": Type,
                'Title': personal_data.Title.Title_Name if personal_data.Title else None,
                'FirstName': personal_data.FirstName,
                'MiddleName': personal_data.MiddleName,
                'SurName': personal_data.SurName,
                'Gender': personal_data.Gender,
                'DOB': personal_data.DOB,
                'Age': personal_data.Age,
                'Status': drug_request.Status,
                'type': Type,
                'BillingType': 'IPPharmacy' if Type=='IP' else 'FREE PHARMACY',
                # 'Department': 1,
                'Edit': True
            })
 
            record_id += 1
 
        # Return JSON response
        return JsonResponse(datafetch, safe=False)
 
    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500) 
 
 
def get_prescription_forIP(request):
    try:
        # Retrieve PatientID from request
        PatientID = request.GET.get('PatientID')
        VisitID = request.GET.get('VisitID')
        Type = request.GET.get('Type')
        
        print('12212211',PatientID,VisitID,Type)

        # Check if PatientID and VisitID are provided
        if not PatientID:
            return JsonResponse({"error": "PatientID parameter is required"}, status=400)
        if not VisitID:
            return JsonResponse({"error": "VisitID parameter is required"}, status=400)

        # Fetch patient details to get the Patient Name
        patient = Patient_Detials.objects.filter(PatientId=PatientID).first()
        PatientName = f"{patient.FirstName} {patient.MiddleName} {patient.SurName}"
        print('33322223333',PatientName)
        # Query the prescriptions related to the VisitID (Registration_Id_id)
        if Type == 'IP':
            prescriptions = ip_drug_request_table.objects.filter(Booking_Id=VisitID , Status = 'Pending',OrderType='IP_Pharmacy')
        else:
            prescriptions = ip_drug_request_table.objects.filter(Booking_Id=VisitID , Status = 'Pending',OrderType='FOC_Pharmacy')
        print('0000000',prescriptions)
        if Type == 'IP':
            nurse_pres = Nurse_drug_prescription.objects.filter(Booking_Id=VisitID , Status = 'Pending',OrderType='IP_Pharmacy')
        else:
            nurse_pres = Nurse_drug_prescription.objects.filter(Booking_Id=VisitID , Status = 'Pending',OrderType='FOC_Pharmacy')
        print('111111',nurse_pres)
        # Prepare the list of prescriptions in the specified format
        prescription_list = []
        record_id = 1 
        for prescription in prescriptions:
            prescription_dict = {
                'S_No':record_id,
                'PrescriptionID': prescription.Prescription_Id.Prescription_Id,
                'PatientID': PatientID,
                'VisitID': VisitID,  # Mapping VisitID as Registration_Id
                'Booking_Id': prescription.Booking_Id.Registration_Id,
                # 'AppointmentDate': prescription.CreatedAt.date().isoformat(),  # Date of prescription creation
                'DoctorId': prescription.DoctorName.Doctor_ID if prescription.DoctorName else None,
                'DoctorName': prescription.DoctorName.ShortName if prescription.DoctorName else None,
                'GenericName': prescription.ProductCode.Product_Detials.GenericName.GenericName if prescription.ProductCode.Product_Detials and prescription.ProductCode.Product_Detials.GenericName else '',
                'ItemId': prescription.ProductCode.Product_Detials.pk,
                'ItemName': prescription.ProductCode.Product_Detials.ItemName,
                'Dose': prescription.ProductCode.Product_Detials.Strength,
                'Route': prescription.Route,
                'Frequency': prescription.Frequency.Frequency,  # Assuming Frequency is in Duration
                'FrequencyMethod': prescription.Frequency.FrequencyType,  # Assuming Frequency is in Duration
                'Duration': f'{prescription.Duration} {prescription.DurationType}',
                'Billing_Quantity': prescription.RequestQuantity,
                'Instruction': prescription.RequestType,  # Assuming RequestType includes instructions
                'Status': prescription.Status,
                'LoggedBy': prescription.CapturedBy,
                # 'CreatedAt': prescription.CreatedAt.date().isoformat(),
                'Patient_Name': PatientName,
                'MRP' : int(prescription.ProductCode.Sellable_price),
                'BatchNo' : prescription.ProductCode.Batch_No,
                'Exp_Date' : prescription.ProductCode.Expiry_Date,
                'isReimbursable':'Yes',
            }
            record_id +=1
            prescription_list.append(prescription_dict)
            
        for prescription in nurse_pres:
            prescription_dict = {
                'S_No':record_id,
                'PrescriptionID': prescription.Prescription_Id,
                'PatientID': PatientID,
                'VisitID': VisitID,  # Mapping VisitID as Registration_Id
                'Booking_Id': prescription.Booking_Id.Registration_Id,
                # 'AppointmentDate': prescription.CreatedAt.date().isoformat(),  # Date of prescription creation
                # 'DoctorName': prescription.DoctorName.ShortName if prescription.DoctorName else None,
                'GenericName': prescription.ProductCode.Product_Detials.GenericName.GenericName,
                'ItemId': prescription.ProductCode.Product_Detials.pk,
                'ItemName': prescription.ProductCode.Product_Detials.ItemName,
                'Dose': prescription.ProductCode.Product_Detials.Strength,
                'Route': prescription.Route,
                'Frequency': prescription.Duration,  # Assuming Frequency is in Duration
                'Duration': prescription.DurationType,
                'Billing_Quantity': prescription.RequestQuantity,
                'Instruction': prescription.RequestType,  # Assuming RequestType includes instructions
                'Status': prescription.Status,
                'LoggedBy': prescription.CapturedBy,
                # 'CreatedAt': prescription.CreatedAt.date().isoformat(),
                'Patient_Name': PatientName,
                'MRP' : int(prescription.ProductCode.Sellable_price),
                'BatchNo' : prescription.ProductCode.Batch_No,
                'Exp_Date' : prescription.ProductCode.Expiry_Date,
                'isReimbursable':'Yes',
            }
            record_id +=1
            prescription_list.append(prescription_dict)

        return JsonResponse(prescription_list, safe=False)

    except Patient_Detials.DoesNotExist:
        return JsonResponse({"error": "Patient not found"})
    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)})

def get_last_prescription_forIP(request):
    try:
        # Retrieve PatientID from request
        VisitID = request.GET.get('VisitID')

        # Check if VisitID is provided
        if not VisitID:
            return JsonResponse({"error": "VisitID parameter is required"}, status=400)

        # Query the prescriptions related to the VisitID (Registration_Id_id)
        prescriptions = Doctor_drug_prescription.objects.filter(Booking_Id=VisitID, Status='Pending')

        print('11111111', prescriptions)
        # Prepare the list of prescriptions in the specified format
        prescription_list = []
        id = 1  # Initialize id as an integer, not a tuple
        for prescription in prescriptions:
            prescription_dict = {
                'id': id,
                'PrescriptionID': prescription.Prescription_Id,
                'Booking_Id': prescription.Booking_Id.Registration_Id,
                'Department' : prescription.Department,
                'Specialization': prescription.Specialization.Speciality_Id,
                'DoctorName': prescription.DoctorName.ShortName if prescription.DoctorName else None,
                'GenericName': prescription.ProductCode.Product_Detials.GenericName.GenericName,
                'MedicineCode': prescription.ProductCode.Product_Detials.pk,
                'MedicineName': prescription.ProductCode.Product_Detials.ItemName,
                'Dosage': prescription.ProductCode.Product_Detials.Strength,
                'Route': prescription.Route,
                'FrequencyMethod': prescription.FrequencyMethod,  # Assuming Frequency is in Duration
                'FrequencyName': prescription.Frequency.FrequencyName,  # Assuming Frequency is in Duration
                'FrequencyType': prescription.Frequency.FrequencyType,  # Assuming Frequency is in Duration
                'Frequency': prescription.Frequency.Frequency,  # Assuming Frequency is in Duration
                'FrequencyTime': prescription.Frequency.FrequencyTime,  # Assuming Frequency is in Duration
                'DurationType': prescription.DurationType,
                'AdminisDose' : prescription.AdminisDose,
                'Quantity': prescription.RequestQuantity,
                'Instruction': prescription.Instruction,  # Assuming RequestType includes instructions
                'Status': prescription.Status,
                'LoggedBy': prescription.CapturedBy,
                'MRP': int(prescription.ProductCode.Sellable_price if prescription.ProductCode and prescription and prescription.ProductCode.Sellable_price else 0),
                'BatchNo': prescription.ProductCode.Batch_No,
                'Exp_Date': prescription.ProductCode.Expiry_Date,
            }
            prescription_list.append(prescription_dict)
            id += 1  # Increment id by 1

        return JsonResponse(prescription_list, safe=False)

    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)})
    
@csrf_exempt
@transaction.atomic
@require_http_methods(['POST'])
def IP_Pharmacy_Billing_link(request):
    
    if request.method == 'POST':
        try:
            # ---------- Extract main billing data ----------
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            Selected_Patient_Pharmacy = json.loads(request.POST.get('Selected_Patient_Pharmacy'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items'))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location', 1)
            pdf_data = request.FILES.get('pdfData')
            Paytype = request.POST.get('Paytype', '')
            Store_location = request.POST.get('StoreLocation', '')
            Remarks = request.POST.get('Remarks','')


            # ---------- Fetch related foreign key objects ----------
            doctor = None
            try:
                doctor_ins = selected_patient_data.get('Doctor_Id')
                print(doctor_ins,'doctor_ins')
                if doctor_ins:
                    doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_ins).first()
            except Exception as e:
                print("Doctor fetch failed:", e)

            patient = None
            try:
                patient = Patient_Detials.objects.filter(PatientId=selected_patient_data.get('PatientId')).first()
            except Exception as e:
                return JsonResponse({'error': 'Patient not found'})

            registration = None
            try:
                if selected_patient_data.get('RegistrationId'):
                    registration = Patient_IP_Registration_Detials.objects.filter(
                        Registration_Id=selected_patient_data.get('RegistrationId')
                    ).first()
                elif selected_patient_data.get('PatientId'):
                    registration = Patient_IP_Registration_Detials.objects.filter(
                        PatientId=selected_patient_data.get('PatientId')
                    ).last()
            except Exception as e:
                print("Registration fetch failed:", e)

            location = None
            try:
                location = Location_Detials.objects.filter(Location_Id=location_id).first()
            except Exception as e:
                print("Location fetch failed:", e)

            # ---------- Billing values ----------
            discount_amount = float(bill_Items.get('Discount', 0))
            sgst_val = float(bill_Items.get('SGSTval', 0))
            cgst_val = float(bill_Items.get('CGSTval', 0))
            gst_amount = float(bill_Items.get('GSTAmount', 0))
            total_items = int(bill_Items.get('totalItems', 0) or 0)
            total_qty = int(bill_Items.get('totalQty', 0) or 0)
            total_amount = float(bill_Items.get('Amount', 0))
            net_amount = float(bill_Items.get('totalAmount', 0))
            paid_amount = float(bill_Items.get('PaidAmount', 0))
            balance_amount = float(bill_Items.get('BalanceAmount', 0))
            round_off = float(bill_Items.get('Roundoff', 0))

            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'

            Pharmacytype = ""

            if Selected_Patient_Pharmacy.get('type') == 'FOC':

                Pharmacytype = 'FREE PHARMACY'

            elif Selected_Patient_Pharmacy.get('type') == 'IP':

                Pharmacytype = 'IP PHARMACY'


            # ---------- Create billing entry ----------
            billing = IP_Pharmacy_Billing_Table_Detials.objects.create(
                Doctor_Id=doctor,
                Prescription_Id1=None,
                Patient_Id=patient,
                Register_Id=registration,
                Billing_Date=billing_date,
                Billing_Type=Pharmacytype,
                Discount_Amount=discount_amount,
                SGST_val=sgst_val,
                CGST_val=cgst_val,
                Total_GSTAmount=gst_amount,
                Total_Items=total_items,
                Total_Qty=total_qty,
                Total_Amount=total_amount,
                Net_Amount=net_amount,
                Paid_Amount=paid_amount,
                Balance_Amount=balance_amount,
                Round_Off=round_off,
                created_by=user_name,
                Location=location,
                Bill_Status=new_bill_status,
                Remarks = Remarks
            )
            billing.save()
            print("save=--------",billing)
            # ---------- Process billing items ----------
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))
            if isinstance(bill_itemtable, list):
                for item in bill_itemtable:
                    try:
                        prescription_id = item.get('PrescriptionID')
                        prescription_instance = None
                        if prescription_id:
                            try:
                                prescription_instance = Doctor_drug_prescription.objects.filter(
                                    Prescription_Id=int(prescription_id)
                                ).first()
                                # Update IP request table
                                try:
                                    ip_request = ip_drug_request_table.objects.filter(Prescription_Id=prescription_instance).first()
                                    ip_request.Status = 'issued'
                                    ip_request.save()
                                except:
                                    pass
                                # Update prescription status
                                Doctor_drug_prescription.objects.filter(
                                    Prescription_Id=prescription_instance.Prescription_Id,
                                    Status='Pending'
                                ).update(Status='issued')
                            except:
                                print(f"Prescription not found: {prescription_id}")
                                prescription_instance = None

                        # Stock maintenance
                        try:
                            if Store_location and item.get('BatchNo'):
                                storelocation = Stock_Maintance_Table_Detials.objects.filter(
                                    Store_location=Store_location,
                                    Batch_No=item.get('BatchNo')
                                ).first()
                                storelocation.AvailableQuantity -= int(item.get('Billing_Quantity', 0))
                                storelocation.save()
                        except:
                            print("Stock update failed for:", item)
                        
                        print("data sssssssssssssssssss")
                        # Always create billing item
                        IP_BillingItem.objects.create(
                            Billing=billing,
                            ItemName=str(item.get('ItemName')),
                            Billing_Quantity=int(item.get('Billing_Quantity', 0)),
                            BatchNo=item.get('BatchNo'),
                            Exp_Date=datetime.strptime(item.get('Exp_Date'), "%Y-%m-%d").date() if item.get('Exp_Date') else None,
                            Unit_Price=float(item.get('Unit_Price', 0)),
                            Amount=float(item.get('Amount', 0)),
                            Total=float(item.get('Total', 0))
                        )
                        print("Date Save successfully")
                    except Exception as e:
                        print("Billing item creation failed:", e)

            # ---------- Receipt ----------
            recipetbill = None
            billing_receipt_table = None
            try:
                if Paytype == 'Cash':
                    billing_receipt_table = IPPharmacyBillingReceipt.objects.create(
                        Invoice_NO=billing,
                        PatientID=patient.PatientId,
                        PhoneNumber=patient.PhoneNo,
                        Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                        TotalAmount=total_amount,
                        TotalPaidAmount=paid_amount,
                        BalanceAmount=balance_amount,
                        Billing_Date=billing_date,
                        PaidAmount=paid_amount,
                        Billedby=user_name,
                    )
                    recipetbill = billing_receipt_table.Voucher_Number
            except Exception as e:
                print("Receipt creation failed:", e)

            # ---------- Payments ----------
            for payment in billpay_method:
                try:
                    IP_Pharmacy_Billing_Payments.objects.create(
                        Billing=billing_receipt_table if billing_receipt_table else None,
                        Billpay_method=payment.get('Billpay_method', ''),
                        CardType=payment.get('CardType', ''),
                        BankName=payment.get('BankName', ''),
                        ChequeNo=payment.get('ChequeNo', ''),
                        paidamount=float(payment.get('paidamount', 0)),
                        Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                        transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else '',
                    )
                except Exception as e:
                    print("Payment creation failed:", e)

            return JsonResponse({
                'status': 'success',
                'message': 'Data saved successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': recipetbill
            })

        except Exception as e:
            print("Critical error:", e)
            return JsonResponse({'error': str(e)})

    if request.method == 'POST':
        try:
            # ---------- Extract main billing data ----------
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            print(selected_patient_data, 'selected_patient_data')
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items'))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location', 1)

            # Extract PDF data
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditId', '')
            Paytype = request.POST.get('Paytype', '')
            Store_location = request.POST.get('StoreLocation', '')

            # Debug prints
            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            print('Storeloccc:', Store_location)

            # ---------- Fetch related foreign key objects ----------
            try:
                doctor_ins = selected_patient_data.get('Doctor_Id')
                doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_ins)
                print('Doctor:', doctor)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId'))
                print('Patient:', patient)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})

            # ---------- Fix: Registration lookup ----------
            try:
                registration = None
                if selected_patient_data.get('RegistrationId'):
                    # Case 1: Use RegistrationId directly
                    registration = Patient_IP_Registration_Detials.objects.get(
                        Registration_Id=selected_patient_data.get('RegistrationId')
                    )
                elif selected_patient_data.get('PatientId'):
                    # Case 2: Fallback to last registration by PatientId
                    registration = Patient_IP_Registration_Detials.objects.filter(
                        PatientId=selected_patient_data.get('PatientId')
                    ).last()

                if not registration:
                    return JsonResponse({'error': 'Registration not found for given patient'})

                print('registration:', registration)

            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration Id not found'})

            # ---------- Location ----------
            try:
                location = Location_Detials.objects.get(Location_Id=location_id)
                print('Location:', location)
            except Exception as e:
                return JsonResponse({f'{e}': 'Location not found'})

            print('Location successfully retrieved:', location)
            print('Proceeding to process billing item details...')

            # ---------- Parse billing item details ----------
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))

                total_items = int(bill_Items.get('totalItems', 0)) if bill_Items.get('totalItems', 0) else 0
                total_qty = int(bill_Items.get('totalQty', 0)) if bill_Items.get('totalItems', 0) else 0
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('Billing item details parsed successfully.')

            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'
            prescription_instance = None

            # ---------- Create billing entry ----------
            billing = IP_Pharmacy_Billing_Table_Detials.objects.create(
                Doctor_Id=doctor if doctor_ins else None,
                Prescription_Id1=prescription_instance,
                Patient_Id=patient,
                Register_Id=registration,
                Billing_Date=billing_date,
                Billing_Type="IPPharmacy",
                Discount_Amount=discount_amount,
                SGST_val=sgst_val,
                CGST_val=cgst_val,
                Total_GSTAmount=gst_amount,
                Total_Items=total_items,
                Total_Qty=total_qty,
                Total_Amount=total_amount,
                Net_Amount=net_amount,
                Paid_Amount=paid_amount,
                Balance_Amount=balance_amount,
                Round_Off=round_off,
                created_by=user_name,
                Location=location,
                Bill_Status=new_bill_status,
            )
            billing.save()
            print('Billing successfully created:', billing)

            # ---------- Process billing items ----------
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))
            if not isinstance(bill_itemtable, list):
                return JsonResponse({'error': 'Invalid format for Billing_itemtable. Expected a list of items.'})

            for item in bill_itemtable:
                if not isinstance(item, dict):
                    print(f"Invalid item format: {item}")
                    continue

                prescription_id = item.get('PrescriptionID')

                if prescription_id:  
                    try:
                        prescription_instance = Doctor_drug_prescription.objects.get(
                            Prescription_Id=int(prescription_id)
                        )
                        print("Prescription Instance Retrieved:", prescription_instance)

                        # Update IP request table
                        try:
                            ip_request = ip_drug_request_table.objects.get(Prescription_Id=prescription_instance)
                            ip_request.Status = 'issued'
                            ip_request.save()
                            print(f'IP Request status updated to: {ip_request.Status}')
                        except ip_drug_request_table.DoesNotExist:
                            print("No IP request linked to this prescription")

                        # Update prescription status
                        drug_status = Doctor_drug_prescription.objects.filter(
                            Prescription_Id=prescription_instance.Prescription_Id, Status='Pending'
                        )
                        for drug in drug_status:
                            drug.Status = 'issued'
                            drug.save()
                            print('Prescription status updated to issued:', drug)

                    except Doctor_drug_prescription.DoesNotExist:
                        print(f"Skipping item - Prescription not found: {prescription_id}")
                        continue
                else:
                    print("Skipping item - No PrescriptionID:", item)
                    continue

                # ---------- Stock maintenance ----------
                try:
                    storelocation = Stock_Maintance_Table_Detials.objects.filter(
                        Store_location=Store_location,
                        Batch_No=item.get('BatchNo')
                    ).first() if Store_location else None

                    if storelocation:
                        print('Store location:', storelocation.Batch_No, storelocation.Store_location, storelocation.Product_Detials.ItemName)
                        storelocation.AvailableQuantity -= int(item.get('Billing_Quantity', 0))
                        storelocation.save()
                except ObjectDoesNotExist:
                    return JsonResponse({'error': 'Location not found'})

                # ---------- Create billing item ----------
                items_bill = IP_BillingItem.objects.create(
                    Billing=billing,
                    ItemName=str(item.get('ItemName')),
                    Billing_Quantity=int(item.get('Billing_Quantity', 0)),
                    BatchNo=item.get('BatchNo'),
                    Exp_Date=datetime.strptime(item.get('Exp_Date'), "%d-%m-%Y").date(),
                    Unit_Price=float(item.get('Unit_Price', 0)),
                    Amount=float(item.get('Amount', 0)),
                    Total=float(item.get('Total', 0))
                )
                items_bill.save()
                print('items_bill:', items_bill)


            # ---------- Receipt ----------
            recipetbill = None
            billing_receipt_table = None
            if Paytype == 'Cash':
                billing_receipt_table = IPPharmacyBillingReceipt(
                    Invoice_NO=billing,
                    PatientID=patient.PatientId,
                    PhoneNumber=patient.PhoneNo,
                    Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                    TotalAmount=total_amount,
                    TotalPaidAmount=paid_amount,
                    BalanceAmount=balance_amount,
                    Billing_Date=billing_date,
                    PaidAmount=paid_amount,
                    Billedby=user_name,
                )
                billing_receipt_table.save()
                recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None

            # ---------- Payments ----------
            for payment in billpay_method:
                payment_bill = IP_Pharmacy_Billing_Payments.objects.create(
                    Billing=billing_receipt_table if billing_receipt_table else None,
                    Billpay_method=payment.get('Billpay_method', ''),
                    CardType=payment.get('CardType', ''),
                    BankName=payment.get('BankName', ''),
                    ChequeNo=payment.get('ChequeNo', ''),
                    paidamount=float(payment.get('paidamount', 0)),
                    Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                    transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else '',
                )
                payment_bill.save()
                print('Payment method saved:', payment_bill)

            return JsonResponse({
                'status': 'success',
                'message': 'Data saved successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': recipetbill
            })

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})

from django.utils.dateparse import parse_date

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_Pharmacy_Due_Billing_link(request):
    if request.method == 'POST':
        try:
            # Parse form-data
            selected_patient_data = request.POST.get('SelectedPatient_list', '{}')
            billing_date = request.POST.get('Billing_date')
            billpay_method = request.POST.get('Billpay_method', '[]')
            bill_items = request.POST.get('Bill_Items', '{}')
            user_name = request.POST.get('User_Name')
            systemName = request.POST.get('systemName')
            location_id = request.POST.get('location')
            Paytype = request.POST.get('Paytype', '')
            billing_itemtable = request.POST.get('Billing_itemtable', '[]')
            editid = request.POST.get('EditDue', '')

            # Convert JSON strings to Python objects
            selected_patient_data = json.loads(selected_patient_data)
            billpay_method = json.loads(billpay_method)
            bill_items = json.loads(bill_items)
            billing_itemtable = json.loads(billing_itemtable)

            # Now your existing logic can continue...
            print("🧾 Billing POST received:", selected_patient_data)

            # ✅ Fetch related records
            doctor_id = selected_patient_data.get('Doctor_Id', '')
            patient_id = selected_patient_data.get('PatientId', '')
            registration_id = selected_patient_data.get('RegistrationId', '')

            doctor_instance = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_id).first()
            if not doctor_instance and doctor_id:
                return JsonResponse({'error': 'Doctor not found'})

            patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
            if not patient:
                return JsonResponse({'error': 'Patient not found'})

            registration = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            if not registration:
                return JsonResponse({'error': 'Registration not found'})

            location = Location_Detials.objects.filter(Location_Id=location_id).first()
            if not location:
                return JsonResponse({'error': 'Location not found'})

            # ✅ Extract numeric values safely
            def safe_float(value):
                try:
                    # remove % or any non-numeric chars
                    value_str = str(value).replace('%','').strip()
                    return float(value_str) if value_str else 0.0
                except:
                    return 0.0

            discount_amount = safe_float(bill_items.get('Discount', 0))
            sgst_val = safe_float(bill_items.get('SGSTval', 0))
            cgst_val = safe_float(bill_items.get('CGSTval', 0))
            gst_amount = safe_float(bill_items.get('GSTAmount', 0))
            total_items = int(safe_float(bill_items.get('totalItems', 0)))
            total_qty = int(safe_float(bill_items.get('totalQty', 0)))
            total_amount = safe_float(bill_items.get('Amount', 0))
            net_amount = safe_float(bill_items.get('totalAmount', 0))
            paid_amount = safe_float(bill_items.get('PaidAmount', 0))
            balance_amount = safe_float(bill_items.get('BalanceAmount', 0))
            round_off = safe_float(bill_items.get('Roundoff', 0))
            transaction_fee = safe_float(bill_items.get('transactionfee', 0))

       

            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'

            # ✅ If editing a due bill
            if editid:
                billing = IP_Pharmacy_Billing_Table_Detials.objects.get(Billing_Invoice_No=editid)
                billing.Paid_Amount += Decimal(paid_amount)
                billing.Balance_Amount -= Decimal(balance_amount)
                billing.Bill_Status = new_bill_status
                billing.save()
            else:
                billing = None

            # ✅ Create new receipt
            billing_receipt_table = IPPharmacyBillingReceipt.objects.create(
                Invoice_NO=billing,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment="DuePayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount=total_amount,
                TotalPaidAmount=paid_amount,
                BalanceAmount=balance_amount,
                Billing_Date=billing_date,
                PaidAmount=paid_amount,
                Billedby=user_name,
            )
            recipetbill = billing_receipt_table or None

            # ✅ Save payment methods
            for payment in billpay_method:
                IP_Pharmacy_Billing_Payments.objects.create(
                    Billing=billing_receipt_table,
                    Billpay_method=payment.get('Billpay_method', ''),
                    CardType=payment.get('CardType', ''),
                    BankName=payment.get('BankName', ''),
                    ChequeNo=payment.get('ChequeNo', ''),
                    paidamount=float(payment.get('paidamount', 0)),
                    Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                    transactionFee=payment.get('transactionFee', '') or 0,
                )

            # ✅ Print the bill (simplified, same as your logic)
            try:
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
                    "doctor_name": f"{doctor_instance.First_Name if doctor_instance else ''} {doctor_instance.Last_Name if doctor_instance else ''}",
                    "invoice_no": billing.Billing_Invoice_No if billing else "",
                    "receipt_no": billing_receipt_table.Voucher_Number,
                    "date": billing_date,
                    "items": billing_itemtable,
                    "net_amount": net_amount,
                    "gross_amount": total_amount,
                    "billed_by": user_name,
                }

                bill_text = Ip_Due_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)
                print("🖨️ Bill Text Preview:", bill_text)

                # Save print job
                if systemName:
                    PrintJob.objects.create(system_name=systemName, bill_text=bill_text)
            except Exception as e:
                print("⚠️ Print failed:", e)

            return JsonResponse({
                'status': 'success',
                'message': 'IP Billing saved successfully',
                'ReceiptNo': recipetbill.Voucher_Number,
                'InvoiceNo': recipetbill.Invoice_NO.Billing_Invoice_No
            })

        except Exception as e:
            print("❌ Server Error:", e)
            return JsonResponse({'error': str(e)})  
    
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyDate = request.GET.get('SearchbyDate')
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')
            SearchTimeOrderby = request.GET.get('SearchTimeOrderby')
            status_filter = request.GET.get('SearchStatus')
            Pharma_Type = request.GET.get('Pharma_Type')
            CurrentDate = request.GET.get('CurrentDate')
            DateType = request.GET.get('DateType')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            RegisterId= request.GET.get('RegisterId')
            
            # Build dynamic filter query
            search_query = Q()
            if Pharma_Type:
                search_query&=Q(Billing_Type=Pharma_Type)
            if RegisterId :
                search_query&=Q(Register_Id__Registration_Id=RegisterId)    
            if SearchbyFirstName:
                search_query &= (
                    Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) |
                    Q(Billing_Invoice_No__icontains=f"""{'IP/'}{SearchbyFirstName}""") |
                    Q(Billing_Invoice_No__icontains=f"""{'FOC/'}{SearchbyFirstName}""") |
                    Q(PatientName__icontains = SearchbyFirstName)
                )

                print(search_query,'search_query')

            if SearchbyPhoneNumber:
                search_query &= Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyPhoneNumber)
            # if SearchbyDate:
            #     date_obj = parse_date(SearchbyDate)
            #     if date_obj:
            #         search_query &= Q(Billing_Date=date_obj)
            if DateType == 'Current':        
              if CurrentDate:
                  search_query&=Q(created_at__date=CurrentDate)
            elif DateType == 'Customize':
                if FromDate and ToDate:
                    try:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
                    except ValueError:
                        print(f"Invalid date range: FromDate={FromDate}, ToDate={ToDate}")
                        return JsonResponse({'error': 'Invalid date format. Please use YYYY-MM-DD.'})
                else:
                    print("DateType=Customize but FromDate/ToDate missing")
                    return JsonResponse({'error': 'FromDate and ToDate are required for custom date filter.'})


            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            # Fetch billing data with related items
            general_billing_data = IP_Pharmacy_Billing_Table_Detials.objects.filter(search_query)\
                .select_related('Register_Id__PatientId', 'Doctor_Id', 'Register_Id__InsuranceName', 'Register_Id__ClientName')\
                .prefetch_related('IP_billing_items')

            if SearchTimeOrderby == "asc":
                general_billing_data = general_billing_data.order_by("created_at")
            elif SearchTimeOrderby == "desc":
                general_billing_data = general_billing_data.order_by("-created_at")

            response_data = []
            for row in general_billing_data:
                register = row.Register_Id
                patient = getattr(register, 'PatientId', None)
                doctor = getattr(row, 'Doctor_Id', None)

                full_name = (
                    " ".join(filter(None, [
                        getattr(patient, 'FirstName', ''),
                        getattr(patient, 'MiddleName', ''),
                        getattr(patient, 'SurName', '')
                    ])).upper()
                    if patient
                    else (getattr(row, 'PatientName', '') or '').upper()
                )


                patient_category_name = None
                if register:
                    if getattr(register, 'PatientCategory', None) == 'Insurance':
                        patient_category_name = getattr(getattr(register, 'InsuranceName', None), 'Insurance_Name', None)
                    else:
                        patient_category_name = getattr(getattr(register, 'ClientName', None), 'Client_Name', None)

                addr_parts = [
                    getattr(patient, 'PermanentdoorNo', ''),
                    getattr(patient, 'PermanentStreet', ''),
                    getattr(patient, 'PermanentArea', ''),
                    getattr(patient, 'PermanentCity', ''),
                    getattr(patient, 'PermanentState', ''),
                    getattr(patient, 'PermanentCountry', ''),
                    getattr(patient, 'PermanentPincode', '')
                ]
                address = ", ".join([str(p) for p in addr_parts if p]) if patient else None
                full_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None

                # Fetch billing items
                billing_items = []
                for index, item in enumerate(row.IP_billing_items.all(), start=1):
                    GST = getattr(item, "GST", 0)
                    CGST = GST / 2
                    SGST = GST / 2
                    billing_items.append({
                        "S_No": index,
                        "ItemName": item.ItemName,
                        "BatchNo": item.BatchNo,
                        "HSNCode": getattr(item, "HSNCode", ""),
                        "Exp_Date": item.Exp_Date.strftime("%Y-%m-%d"),
                        "Billing_Quantity": item.Billing_Quantity,
                        "Unit_Price": item.Unit_Price,
                        "Amount": item.Amount,
                        "CD_Method": getattr(item, "CD_Method", ""),
                        "Cash_Discount": getattr(item, "Cash_Discount", 0),
                        "GST": GST,
                        "CGST": CGST,
                        "SGST": SGST,
                        "GSTAmount": getattr(item, "GSTAmount", 0),
                        "Total": item.Total,
                    })

                billing_details = {
                    'id': row.Billing_Invoice_No,
                    'Type': 'PharmacyDue',
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': getattr(doctor, 'Doctor_ID', None),
                    'Doctor_Name': f"{getattr(getattr(doctor, 'Tittle', None), 'Title_Name', '')}.{getattr(doctor, 'First_Name', '')} {getattr(doctor, 'Middle_Name', '')} {getattr(doctor, 'Last_Name', '')}" if doctor else None,
                    'PatientId': getattr(patient, 'PatientId', None),
                    'Patient_Name': full_name,
                    'PhoneNo': getattr(patient, 'PhoneNo', None),
                    'Register_Id': getattr(register, 'Registration_Id', None),
                    'Gender': getattr(patient, 'Gender', None),
                    'City': getattr(patient, 'PermanentCity', None),
                    'State': getattr(patient, 'PermanentState', None),
                    'Pincode': getattr(patient, 'PermanentPincode', None),
                    'AgeGender': f"{getattr(patient, 'Age', '')}/{getattr(patient, 'Gender', '')}" if patient else None,
                    'Address': address,
                    'PatientCategory': getattr(register, 'PatientCategory', None),
                    'PatientCategoryName': patient_category_name,
                    'Visit_Id': getattr(register, 'Registration_Id', None),
                    'Billing_Type': row.Billing_Type,
                    'TotalItems': row.Total_Items,
                    'TotalQty': row.Total_Qty,
                    'RoundOff': row.Round_Off,
                    'TotalAmount': row.Total_Amount,
                    'Net_Amount': row.Net_Amount,
                    'PaidAmount': row.Paid_Amount,
                    'BalanceAmount': row.Balance_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Date': full_date,
                    'Billing_Items': billing_items
                }
                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

    

        except Exception as e:
            return JsonResponse({'error': str(e)})


        
def parse_date(date_str):
    """Safely parse date string, return None if invalid"""
    if not date_str or str(date_str).lower() in ['nan', 'none', '']:
        return None
    
    try:
        return datetime.strptime(str(date_str), '%Y-%m-%date').date()
    except (ValueError, TypeError):
        return None
    

@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_Pharmacy_Refund_Billing_link(request):
    
    if request.method == 'POST':
        try:
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditDue','')
            Paytype = request.POST.get('Paytype','')
            Store_location = request.POST.get('StoreLocation','')
            EditDue = request.POST.get('EditDue','')
            Remarks = request.POST.get('Remarks','')

            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            print('editidd',editid)
            # print("Billing Item Table:", bill_itemtable)

            try:
                doctor_id = selected_patient_data.get('Doctor_Id','')
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None                
                print('Doctor:', doctor_instance)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId')) if selected_patient_data.get('PatientId') else None
                print('Patient:', patient)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            try:
                registration = Patient_IP_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId')) if selected_patient_data.get('RegistrationId') else None
                print('registration:', registration)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration Id not found'})

            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            print('111111111111')
         
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
                
                min_qty=0
                
                
                

              
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222222')
            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'
            billing = None
            invo = None
            if new_bill_status == 'Paid':
                invo = IPPharmacyBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editid).Invoice_NO
            for bilt in bill_itemtable:
                print("🧾 Debug Bill Item --->", bilt)

                item_id = bilt.get('ItemId')
                item_code = bilt.get('ItemId')
                batch_no = bilt.get('BatchNo')
                billing_qty = bilt.get('Billing_Quantity', 0)

                print(f"🧩 Checking OP_BillingItem | itemid={item_id}, ItemId={item_code}, BatchNo={batch_no}, Qty={billing_qty}")
                print('invo',invo)
                print('item_code',item_code)
                item_qty = IP_BillingItem.objects.filter(
                    Billing =invo,
                    id=item_code,
                    
                ).first()
                print(item_qty,'item qtyyyyyy')
                if item_qty:
                    
                    
                    item_qty.Billing_Quantity -=int(billing_qty)
                    print(f"✅ Found item | OriginalQty={item_qty.Billing_Quantity} | NewMinQty={''}")
                    item_qty.save()
                            
            if editid:
                # Create the main billing entry
                try:
                    billing = IPPharmacyBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editid)
                    # billing.NewPayment = 'RefundPayment'
                    billing.save()
                    
                    print('billingggg', billing)
                except:
                    print("Bill is Due...")

            if EditDue :

                billinvoice = IP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No = EditDue).first()

            
                
            for iitem in bill_itemtable:
                try:
                    print(iitem,'details of itemmmmmmmmmm')

                    print(iitem.get('BatchNo'), type(iitem.get('BatchNo')), 'Batch typeeeeeeeeee')


                    storelocation = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk=iitem.get('ProductId'),Store_location=Store_location,Batch_No=iitem.get('BatchNo')).first() if Store_location else None
                    storelocation.AvailableQuantity += int(iitem.get('Billing_Quantity'))
                    storelocation.save()

                    
                except Exception as e:
                    print(str(e))
                    return JsonResponse({'error': str(e)})
            billing_receipt_table = IPPharmacyBillingRefundReceipt(
                Invoice_NO=billing if billing else None,
                BillInvoice_NO = billinvoice if billinvoice else None,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "RefundPayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                Quantity= total_items,
                TotalAmount= total_amount,
                TotalPaidAmount= paid_amount,
                BalanceAmount= balance_amount,
                Billing_Date=billing_date,
                PaidAmount= paid_amount,
                Billedby=user_name,
                Remarks = Remarks
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
            for bilt in bill_itemtable:

                batch_no = bilt.get('BatchNo')
                batch_no = None if batch_no and str(batch_no).lower() == 'nan' else batch_no
                
                exp_date = parse_date(bilt.get('Exp_Date'))
                item = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk = bilt.get('ProductId'),Batch_No =bilt.get('BatchNo')).first()
                re_item = IP_BillingItem_Refund.objects.create(
                    Billing = billing_receipt_table,
                    ItemId = item,
                    ItemName =  bilt.get('ItemName'),
                    Reimbursable = "YES",
                    Refund_Quantity = bilt.get('Billing_Quantity'),
                    BatchNo = bilt.get('BatchNo'),
                    Exp_Date = exp_date,
                    Unit_Price = bilt.get('Unit_Price'),
                    Amount = bilt.get('Amount'),
                    Total = bilt.get('Total'),
                )
                re_item.save()
             

            def safe_decimal(value, default=Decimal('0.00')):
                """
                Safely convert a value to a Decimal. Returns a default value if the conversion fails.
                """
                try:
                    # If value is empty or non-numeric, return the default
                    return Decimal(str(value) if value else str(default))
                except (ValueError):
                    return default

            # Save each payment method
            for payment in billpay_method:
                payment_bill = IP_Pharmacy_Payment_Refund_Table_Detials.objects.create(
                    Receipt_No_Paid=billing_receipt_table if billing_receipt_table else None,
                    Payment_Type=payment.get('Billpay_method', ''),
                    Cart_Type=payment.get('CardType', ''),
                    Bank_Name=payment.get('BankName', ''),
                    Cheque_No=payment.get('ChequeNo', ''),
                    
                    # Use safe_decimal to handle conversion of amounts
                    Transaction_Amount=safe_decimal(payment.get('paidamount', 0)),
                    AdditionalAmount=safe_decimal(payment.get('Additionalamount', 0)),
                    Amount=safe_decimal(payment.get('paidamount', 0)) + safe_decimal(payment.get('Additionalamount', 0)),
                )
                payment_bill.save()
        
            return JsonResponse({'status': 'success', 'message': 'IP Data saved successfully','ReceiptNo':recipetbill})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
    
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            SearchProd = request.GET.get("SearchProd")
            Pharma_Type = request.GET.get("Pharma_Type")
            RegisterId = request.GET.get("RegisterId")

            # Build dynamic filter query
            search_query = Q()
            if Pharma_Type:
                search_query=Q(Billing_Type=Pharma_Type)
            if SearchProd:
                prod_data = list(IP_BillingItem.objects.filter(ItemName__icontains=SearchProd).values_list("Billing__Billing_Invoice_No", flat=True)) 
                print("Prod-----",prod_data)
                if len(prod_data) > 0:
                    search_query &=Q(Billing_Invoice_No__in=prod_data)

            
            if SearchbyFirstName:
                print("Name-------------")
                patient_filter = ( 
                    Q(Billing_Invoice_No__icontains=SearchbyFirstName) |
                    Q(Patient_Id__PatientId__icontains=SearchbyFirstName) |
                    Q(Patient_Id__FirstName__icontains=SearchbyFirstName) |
                    Q(Patient_Id__PhoneNo__icontains=SearchbyFirstName) |
                    Q(PatientName__icontains = SearchbyFirstName)
                )
                search_query &= patient_filter
            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                print("Speciality-------------")
                search_query &= Q(Invoice_NO__Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)

            if SearchbyDoctor:
                print("Doctor-------------")
                search_query &= Q(Invoice_NO__Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                print("Current-------------",type(CurrentDate),CurrentDate)
                search_query &= Q(created_at__date = CurrentDate)  

            elif DateType == "Customize":
                print("Custom-------------")
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)
            if RegisterId :
                search_query &=Q(Register_Id__Registration_Id=RegisterId)
            general_billing_dataaa = IP_Pharmacy_Billing_Table_Detials.objects.filter(search_query).order_by("-created_at")
            print('1212121212', general_billing_dataaa)
            response_data = []
            S_No=0
            for general_billing_data in general_billing_dataaa:
                S_No+=1
                billing_details = {

                    "S_No":S_No,
                    'id': general_billing_data.Billing_Invoice_No,
                    'Type': 'PharmacyRefund',
                    'Billing_Date': general_billing_data.Billing_Date,
                    'Doctor_Id': general_billing_data.Doctor_Id.Doctor_ID if general_billing_data.Doctor_Id else None,
                    'Doctor_Name': f"{general_billing_data.Doctor_Id.Tittle.Title_Name if general_billing_data.Doctor_Id else None}.{general_billing_data.Doctor_Id.First_Name if general_billing_data.Doctor_Id else None } {general_billing_data.Doctor_Id.Middle_Name if general_billing_data.Doctor_Id else None} {general_billing_data.Doctor_Id.Last_Name if general_billing_data.Doctor_Id else None}",
                    'PatientId': general_billing_data.Patient_Id.PatientId if general_billing_data.Patient_Id else None ,
                    'RegisterId': general_billing_data.Register_Id.Registration_Id if general_billing_data.Register_Id else None ,
                    'Speciality' : general_billing_data.Register_Id.Specialization.Speciality_Name if general_billing_data.Register_Id and general_billing_data.Register_Id.Specialization else None,
                    'Patient_Name': (
                        general_billing_data.Patient_Id.FirstName
                        if general_billing_data.Patient_Id
                        else general_billing_data.PatientName
                    ),
                    'PhoneNo': general_billing_data.Patient_Id.PhoneNo if general_billing_data.Patient_Id else None ,
                    # 'Register_Id': general_billing_data.Register_Id,
                    'Gender': general_billing_data.Patient_Id.Gender if general_billing_data.Patient_Id else None ,
                    'City': general_billing_data.Patient_Id.City if general_billing_data.Patient_Id else None ,
                    'State': general_billing_data.Patient_Id.State if general_billing_data.Patient_Id else None ,
                    'Pincode': general_billing_data.Patient_Id.Pincode if general_billing_data.Patient_Id else None ,
                    'AgeGender': f'{general_billing_data.Patient_Id.Age if general_billing_data.Patient_Id else None }/{general_billing_data.Patient_Id.Gender if general_billing_data.Patient_Id else None }',
                    'Address': f'{general_billing_data.Patient_Id.DoorNo if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.Street if general_billing_data.Patient_Id else None }, {general_billing_data.Patient_Id.Area if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.City if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.State if general_billing_data.Patient_Id else None }, {general_billing_data.Patient_Id.Country if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.Pincode if general_billing_data.Patient_Id else None}',
                 
                    'Billing_Type': general_billing_data.Billing_Type,
                    'PharmacyType':general_billing_data.PharmacyType,
                    'TotalItems': general_billing_data.Total_Items,
                    'TotalQty': general_billing_data.Total_Qty,
                    'RoundOff': general_billing_data.Round_Off,
                    'TotalAmount': general_billing_data.Total_Amount,
                    'TotalDiscount': general_billing_data.Discount_Amount,
                    'Net_Amount': general_billing_data.Net_Amount,
                    'PaidAmount': general_billing_data.Paid_Amount,
                    'PaidNetAmount': general_billing_data.Paid_Amount,
                    'BalanceAmount': general_billing_data.Balance_Amount,
                    'Bill_Status': general_billing_data.Bill_Status,
                    'Billing_Items': [],
                }
                
                record_id = 1
                billing_items = IP_BillingItem.objects.filter(Billing__Billing_Invoice_No=general_billing_data.Billing_Invoice_No)
                print('billllllll',billing_items)
                for item in billing_items:
                    item_details = {
                        'S_No': record_id,
                        'itemid': item.pk,
                        'Invoice_No': item.Billing.Billing_Invoice_No,
                        'ItemName': item.ItemName,
                        'BatchNo': item.BatchNo,
                        'Exp_Date': item.Exp_Date,
                        'Unit_Price': item.Unit_Price,
                        'Charge': item.Unit_Price,
                        'Billing_Quantity': item.Billing_Quantity,
                        'Amount': item.Amount,
                        'Total': item.Total,
                    }
                    record_id +=1
                    billing_details['Billing_Items'].append(item_details)
                response_data.append(billing_details)
            
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            print("Error:",str(e))
            return JsonResponse({'error':str(e)})
       



@csrf_exempt
@require_http_methods(['POST','GET'])
def FOC_Pharmacy_Refund_Billing_link(request):
    
    if request.method == 'POST':
        try:
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditDue','')
            Paytype = request.POST.get('Paytype','')
            Store_location = request.POST.get('StoreLocation','')
            EditDue = request.POST.get('EditDue','')
            Remarks = request.POST.get('Remarks','')

            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            print('editidd',editid)
            # print("Billing Item Table:", bill_itemtable)

            try:
                doctor_id = selected_patient_data.get('Doctor_Id','')
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None                
                print('Doctor:', doctor_instance)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId')) if selected_patient_data.get('PatientId') else None
                print('Patient:', patient)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            try:
                registration = Patient_IP_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId')) if selected_patient_data.get('RegistrationId') else None
                print('registration:', registration)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration Id not found'})

            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            print('111111111111')
         
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
                
                min_qty=0
                
                
                

              
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222222')
            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'
            billing = None
            invo = EditDue
            for bilt in bill_itemtable:
                print("🧾 Debug Bill Item --->", bilt)

                item_id = bilt.get('ItemId')
                item_code = bilt.get('ItemId')
                batch_no = bilt.get('BatchNo')
                billing_qty = bilt.get('Billing_Quantity', 0)

                print(f"🧩 Checking OP_BillingItem | itemid={item_id}, ItemId={item_code}, BatchNo={batch_no}, Qty={billing_qty}")
                print('invo',invo)
                print('item_code',item_code)
                item_qty = IP_BillingItem.objects.filter(
                    Billing =invo,
                    id=item_code,
                    
                ).first()
                print(item_qty,'item qtyyyyyy')
                if item_qty:
                    
                    
                    item_qty.Billing_Quantity -=int(billing_qty)
                    print(f"✅ Found item | OriginalQty={item_qty.Billing_Quantity} | NewMinQty={''}")
                    item_qty.save()
                            
            

            if EditDue :

                billinvoice = IP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No = EditDue).first()

            
                
            for iitem in bill_itemtable:
                try:
                    print(iitem,'details of itemmmmmmmmmm')

                    print(iitem.get('BatchNo'), type(iitem.get('BatchNo')), 'Batch typeeeeeeeeee')


                    storelocation = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk=iitem.get('ProductId'),Store_location=Store_location,Batch_No=iitem.get('BatchNo')).first() if Store_location else None
                    storelocation.AvailableQuantity += int(iitem.get('Billing_Quantity'))
                    storelocation.save()

                    
                except Exception as e:
                    print(str(e))
                    return JsonResponse({'error': str(e)})
            billing_receipt_table = IPPharmacyBillingRefundReceipt(
                Invoice_NO=billing if billing else None,
                BillInvoice_NO = billinvoice if billinvoice else None,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "RefundPayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                Quantity= total_items,
                TotalAmount= total_amount,
                TotalPaidAmount= paid_amount,
                BalanceAmount= balance_amount,
                Billing_Date=billing_date,
                PaidAmount= paid_amount,
                Billedby=user_name,
                Remarks = Remarks
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
            for bilt in bill_itemtable:

                batch_no = bilt.get('BatchNo')
                batch_no = None if batch_no and str(batch_no).lower() == 'nan' else batch_no
                
                exp_date = parse_date(bilt.get('Exp_Date'))
                item = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk = bilt.get('ProductId'),Batch_No =bilt.get('BatchNo')).first()
                re_item = IP_BillingItem_Refund.objects.create(
                    Billing = billing_receipt_table,
                    ItemId = item,
                    ItemName =  bilt.get('ItemName'),
                    Reimbursable = "YES",
                    Refund_Quantity = bilt.get('Billing_Quantity'),
                    BatchNo = bilt.get('BatchNo'),
                    Exp_Date = exp_date,
                    Unit_Price = bilt.get('Unit_Price'),
                    Amount = bilt.get('Amount'),
                    Total = bilt.get('Total'),
                )
                re_item.save()
             

            def safe_decimal(value, default=Decimal('0.00')):
                """
                Safely convert a value to a Decimal. Returns a default value if the conversion fails.
                """
                try:
                    # If value is empty or non-numeric, return the default
                    return Decimal(str(value) if value else str(default))
                except (ValueError):
                    return default

            # Save each payment method
            for payment in billpay_method:
                payment_bill = IP_Pharmacy_Payment_Refund_Table_Detials.objects.create(
                    Receipt_No_Paid=billing_receipt_table if billing_receipt_table else None,
                    Payment_Type=payment.get('Billpay_method', ''),
                    Cart_Type=payment.get('CardType', ''),
                    Bank_Name=payment.get('BankName', ''),
                    Cheque_No=payment.get('ChequeNo', ''),
                    
                    # Use safe_decimal to handle conversion of amounts
                    Transaction_Amount=safe_decimal(payment.get('paidamount', 0)),
                    AdditionalAmount=safe_decimal(payment.get('Additionalamount', 0)),
                    Amount=safe_decimal(payment.get('paidamount', 0)) + safe_decimal(payment.get('Additionalamount', 0)),
                )
                payment_bill.save()
        
            return JsonResponse({'status': 'success', 'message': 'IP Data saved successfully','ReceiptNo':recipetbill})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
    
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            SearchProd = request.GET.get("SearchProd")
            Pharma_Type = request.GET.get("Pharma_Type")

            # Build dynamic filter query
            search_query = Q()
            if Pharma_Type:
                search_query=Q(Billing_Type=Pharma_Type)
            if SearchProd:
                prod_data = list(IP_BillingItem.objects.filter(ItemName__icontains=SearchProd).values_list("Billing__Billing_Invoice_No", flat=True)) 
                print("Prod-----",prod_data)
                if len(prod_data) > 0:
                    search_query &=Q(Billing_Invoice_No__in=prod_data)

            
            if SearchbyFirstName:
                print("Name-------------")
                patient_filter = ( 
                    Q(Billing_Invoice_No__icontains=SearchbyFirstName) |
                    Q(Patient_Id__PatientId__icontains=SearchbyFirstName) |
                    Q(Patient_Id__FirstName__icontains=SearchbyFirstName) |
                    Q(Patient_Id__PhoneNo__icontains=SearchbyFirstName) |
                    Q(PatientName__icontains = SearchbyFirstName)
                )
                search_query &= patient_filter
            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                print("Speciality-------------")
                search_query &= Q(Invoice_NO__Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)

            if SearchbyDoctor:
                print("Doctor-------------")
                search_query &= Q(Invoice_NO__Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                print("Current-------------",type(CurrentDate),CurrentDate)
                search_query &= Q(created_at__date = CurrentDate)  

            elif DateType == "Customize":
                print("Custom-------------")
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)
        
            general_billing_dataaa = IP_Pharmacy_Billing_Table_Detials.objects.filter(search_query).order_by("-created_at")
            print('1212121212', general_billing_dataaa)
            response_data = []
            S_No=0
            for general_billing_data in general_billing_dataaa:
                S_No+=1
                billing_details = {

                    "S_No":S_No,
                    'id': general_billing_data.Billing_Invoice_No,
                    'Type': 'PharmacyRefund',
                    'Billing_Date': general_billing_data.Billing_Date,
                    'Doctor_Id': general_billing_data.Doctor_Id.Doctor_ID if general_billing_data.Doctor_Id else None,
                    'Doctor_Name': f"{general_billing_data.Doctor_Id.Tittle.Title_Name if general_billing_data.Doctor_Id else None}.{general_billing_data.Doctor_Id.First_Name if general_billing_data.Doctor_Id else None } {general_billing_data.Doctor_Id.Middle_Name if general_billing_data.Doctor_Id else None} {general_billing_data.Doctor_Id.Last_Name if general_billing_data.Doctor_Id else None}",
                    'PatientId': general_billing_data.Patient_Id.PatientId if general_billing_data.Patient_Id else None ,
                    'Speciality' : general_billing_data.Register_Id.Specialization.Speciality_Name if general_billing_data.Register_Id and general_billing_data.Register_Id.Specialization else None,
                    'Patient_Name': (
                        general_billing_data.Patient_Id.FirstName
                        if general_billing_data.Patient_Id
                        else general_billing_data.PatientName
                    ),
                    'PhoneNo': general_billing_data.Patient_Id.PhoneNo if general_billing_data.Patient_Id else None ,
                    # 'Register_Id': general_billing_data.Register_Id,
                    'Gender': general_billing_data.Patient_Id.Gender if general_billing_data.Patient_Id else None ,
                    'City': general_billing_data.Patient_Id.City if general_billing_data.Patient_Id else None ,
                    'State': general_billing_data.Patient_Id.State if general_billing_data.Patient_Id else None ,
                    'Pincode': general_billing_data.Patient_Id.Pincode if general_billing_data.Patient_Id else None ,
                    'AgeGender': f'{general_billing_data.Patient_Id.Age if general_billing_data.Patient_Id else None }/{general_billing_data.Patient_Id.Gender if general_billing_data.Patient_Id else None }',
                    'Address': f'{general_billing_data.Patient_Id.DoorNo if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.Street if general_billing_data.Patient_Id else None }, {general_billing_data.Patient_Id.Area if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.City if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.State if general_billing_data.Patient_Id else None }, {general_billing_data.Patient_Id.Country if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.Pincode if general_billing_data.Patient_Id else None}',
                 
                    'Billing_Type': general_billing_data.Billing_Type,
                    'PharmacyType':general_billing_data.PharmacyType,
                    'TotalItems': general_billing_data.Total_Items,
                    'TotalQty': general_billing_data.Total_Qty,
                    'RoundOff': general_billing_data.Round_Off,
                    'TotalAmount': general_billing_data.Total_Amount,
                    'TotalDiscount': general_billing_data.Discount_Amount,
                    'Net_Amount': general_billing_data.Net_Amount,
                    'PaidAmount': general_billing_data.Paid_Amount,
                    'PaidNetAmount': general_billing_data.Paid_Amount,
                    'BalanceAmount': general_billing_data.Balance_Amount,
                    'Bill_Status': general_billing_data.Bill_Status,
                    'Billing_Items': [],
                }
                
                record_id = 1
                billing_items = IP_BillingItem.objects.filter(Billing__Billing_Invoice_No=general_billing_data.Billing_Invoice_No)
                print('billllllll',billing_items)
                for item in billing_items:
                    item_details = {
                        'S_No': record_id,
                        'itemid': item.pk,
                        'Invoice_No': item.Billing.Billing_Invoice_No,
                        'ItemName': item.ItemName,
                        'BatchNo': item.BatchNo,
                        'Exp_Date': item.Exp_Date,
                        'Unit_Price': item.Unit_Price,
                        'Charge': item.Unit_Price,
                        'Billing_Quantity': item.Billing_Quantity,
                        'Amount': item.Amount,
                        'Total': item.Total,
                    }
                    record_id +=1
                    billing_details['Billing_Items'].append(item_details)
                response_data.append(billing_details)
            
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            print("Error:",str(e))
            return JsonResponse({'error':str(e)})
       




from num2words import num2words  # pip install num2words
# import win32print
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.http import JsonResponse
import json
from datetime import datetime
from num2words import num2words
# import win32print

 


 
def Op_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin +  (clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+" | "+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "OP Pharmacy Billing".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "N/A")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Phone:", data.get("patient_phone", "")),
        justify_line("Doctor:", data.get("doctor_name", ""), "DrugLicense No:",clinc.DrugLicenseNoOne ),
        justify_line("Bill Status:", data.get("Bill_Status", ""),  "Date:", data.get("date", "")),
        # justify_line("", "", "Time:", data.get("time", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp","BoxName", "Qty", "Rate", "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            item.get("BoxName", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
            # f"{item.get('gst', 0.0):.1f}",
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", data.get("amount_words", ""), "Gross:", str((float(data.get("total", 0.0))))),
        justify_line("Billed By:", data.get("billed_by", ""), "Net:", str(int(round(float(data.get("net_amount", 0.0))))) ),
        justify_line("", "",   "Paid:", str(int(round(float(data.get("net_amount", 0.0)))))),
        # justify_line("", "", )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Medicine refund within 7 days.",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
 
    return "\r\n".join(header + details + table + footer)
 


def Op_Due_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin +  (clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+" | "+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "OP Pharmacy Due Billing".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Phone:", data.get("patient_phone", "")),
        justify_line("Doctor:", data.get("doctor_name", ""), "DrugLicense No:",clinc.DrugLicenseNoOne),
        justify_line("Bill Status:", data.get("Bill_Status", "Due"),  "Date:", data.get("date", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
        # "GST": 5,
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp", "Qty", "Rate",  "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
            # f"{item.get('gst', 0.0):.1f}",
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", data.get("amount_words", ""), "Gross:", str(round(float(data.get("gross_amount", 0.0))))),
        justify_line("Billed By:", data.get("billed_by", ""), "Net:", str(int(round(float(data.get("net_amount", 0.0)))))),
        justify_line("", "", "Paid:", str(int(round(float(data.get("net_amount", 0.0))))) ),
        # justify_line("", "",  )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Medicine refund within 7 days.",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
 
    return "\r\n".join(header + details + table + footer)
 
 
def Ip_Due_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin +  (clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+" | "+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "IP Pharmacy Due Billing".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Phone:", data.get("patient_phone", "")),
        justify_line("Doctor:", data.get("doctor_name", ""),  "DrugLicense No:",clinc.DrugLicenseNoOne),
        justify_line("Bill Status:", data.get("Bill_Status", "Due"), "Date:", data.get("date", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
        # "GST": 5,
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp", "Qty", "Rate", "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
            # f"{item.get('gst', 0.0):.1f}",
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", data.get("amount_words", ""),"Gross:", str(round(float(data.get("gross_amount", 0.0))))),
        justify_line("Billed By:", data.get("billed_by", ""),   "Net:", str(int(round(float(data.get("net_amount", 0.0)))))),
        justify_line("", "", "Paid:", str(int(round(float(data.get("net_amount", 0.0)))))),
        # justify_line("", "",  )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Medicine refund within 7 days.",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
 
    return "\r\n".join(header + details + table + footer)
 
 
def Op_refund_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin +  (clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+"|"+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "OP Pharmacy Refund Receipt".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Date:", data.get("date", "")),
        justify_line("Doctor:", data.get("Doctor_name", ""), "Phone:", data.get("patient_phone", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
       
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp", "Qty", "Rate", "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
          
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", data.get("amount_words", ""), "Gross Amount :", str((data.get("GrossAmount", 0.0))) ),
        justify_line("Billed By:", data.get("billed_by", ""), "Net Amount :", str(int(round(float(data.get("totalAmount", 0.0))))) ),
        justify_line(" " ,"",   "Refund:", str(int(round(float(data.get("PaidAmount", 0.0)))))),
        # justify_line("", "", ),
        # justify_line("", "",  )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
    print("\r\n".join(header + details + table + footer))
    return "\r\n".join(header + details + table + footer)
 
 
 
def IP_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    print('ulla vantend bruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin +  (clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+"|"+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "IP Pharmacy Billing".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Phone:", data.get("patient_phone", "") ),
        justify_line("Doctor:", data.get("doctor_name", ""), "DrugLicense No:",clinc.DrugLicenseNoOne),
        justify_line("Bill Status:", data.get("Bill_Status", ""),"Date:", data.get("date", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
        # "GST": 5,
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp", "Qty", "Rate", "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
            # f"{item.get('gst', 0.0):.1f}",
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", data.get("amount_words", ""),  "Gross:", str(round(float(data.get("gross_amount", 0.0))))),
        justify_line("Billed By:", data.get("billed_by", ""), "Net:", str(int(round(float(data.get("net_amount", 0.0)))))),
        justify_line("", "", "Paid:", str(int(round(float(data.get("net_amount", 0.0)))))),
        # justify_line("", "",  )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Medicine refund within 7 days.",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
    print(IP_format_bill)
    print("\r\n".join(header + details + table + footer))
    return "\r\n".join(header + details + table + footer)
 
def IP_Walkin_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    print('ulla vantend bruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin +  (clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+"|"+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "Walk in IP Pharmacy Billing".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Phone:", data.get("patient_phone", "") ),
        justify_line("Doctor:", data.get("doctor_name", ""), "DrugLicense No:",clinc.DrugLicenseNoOne),
        justify_line("Bill Status:", data.get("Bill_Status", ""),"Date:", data.get("date", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
        # "GST": 5,
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp", "Qty", "Rate", "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
            # f"{item.get('gst', 0.0):.1f}",
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", data.get("amount_words", ""),  "Gross:", str(round(float(data.get("gross_amount", 0.0))))),
        justify_line("Billed By:", data.get("billed_by", ""), "Net:", str(int(round(float(data.get("net_amount", 0.0)))))),
        justify_line("", "", "Paid:", str(int(round(float(data.get("net_amount", 0.0)))))),
        # justify_line("", "",  )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Medicine refund within 7 days.",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
    print(IP_Walkin_format_bill)
    print("\r\n".join(header + details + table + footer))
    return "\r\n".join(header + details + table + footer)
 

 
def Op_walkin_format_bill(data, paper_width_cm=14, left_margin_cm=0.5):
    """
    Format a bill for dot matrix printing with proper alignment and consistent width.
    """
 
    Hos_name = Hospital_Detials.objects.all().first()
    clinc = Clinic_Detials.objects.all().first()
 
    chars_per_cm = 4.5
    paper_width = int(paper_width_cm * chars_per_cm)
    left_margin_spaces = int(left_margin_cm * chars_per_cm)
    left_margin = " " * left_margin_spaces
 
    # -------- Header --------
    header = [
        left_margin + Hos_name.Hospital_Name.center(paper_width),
        left_margin + ( clinc.Clinic_DoorNo+','+clinc.Clinic_Street+","+clinc.Clinic_Area+","+clinc.Clinic_City+","+ clinc.Clinic_State) .center(paper_width),
        left_margin +  (clinc.Clinic_LandlineNo+"|"+clinc.Clinic_PhoneNo) .center(paper_width),
        left_margin + "OP Walkin Pharmacy Billing".center(paper_width),
        left_margin + "=" * paper_width
    ]
 
    # -------- Helper for Justified Lines --------
    def justify_line(left_label, left_value, right_label, right_value):
        left_text = f"{left_label} {left_value}".strip()
        right_text = f"{right_label} {right_value}".strip()
        space = paper_width - len(left_text) - len(right_text)
        if space < 1:
            space = 1
        return left_margin + left_text + " " * space + right_text
 
    # -------- Patient & Invoice Details --------
    details = [
        justify_line("Patient:", data.get("patient_name", ""), "Invoice:", data.get("invoice_no", "")),
        justify_line("ID:", data.get("patient_id", ""), "Receipt:", data.get("receipt_no", "N/A")),
        justify_line("Age/Gender:", f"{data.get('age', '')}/{data.get('gender', '')}", "Phone:", data.get("patient_phone", "")),
        justify_line("Doctor:", data.get("doctor_name", ""), "DrugLicense No:", f"{clinc.DrugLicenseNoOne}"),
        justify_line("Bill Status:", data.get("Bill_Status", "Paid"),  "Date:", data.get("date", "")),
        left_margin + "=" * paper_width
    ]
 
    # -------- Items Table --------
    # Adjusted widths to fit exactly within paper width (with spaces)
    col_widths = {
        "S.No": 4,
        "Item": 18,
        "Batch": 8,
        "Exp": 6,
        "Qty": 5,
        "Rate": 7,
        "Total": 7
    }
 
    headers = ["S.No", "Item", "Batch", "Exp", "Qty", "Rate",  "Total"]
    header_row = " ".join(h.ljust(col_widths[h]) for h in headers)
 
    table = [
        # left_margin + "_" * paper_width,
        left_margin + header_row,
        left_margin + "=" * paper_width
    ]
 
    # Add item rows
    for idx, item in enumerate(data.get("items", []), start=1):
        row_values = [
            str(idx),
            item.get("name", "")[:col_widths["Item"] - 1],
            item.get("batch", "")[:col_widths["Batch"] - 1],
            item.get("expiry", "")[:col_widths["Exp"] - 1],
            str(item.get("qty", "")),
            f"{item.get('rate', 0):.2f}",
            # f"{item.get('gst', 0.0):.1f}",
            f"{item.get('total', 0):.2f}"
        ]
        row_text = " ".join(val.ljust(col_widths[key]) for val, key in zip(row_values, headers))
        table.append(left_margin + row_text)
 
    table.append(left_margin + "=" * paper_width)
 
    # -------- Payment Details --------
        # -------- Payment Details --------
    footer = [
        justify_line("Amount Words:", num2words(round(float(data.get("net_amount", 0.0)))),  "Gross:", str(float(data.get("gross_amount", 0.0)))),
        justify_line("Billed By:", data.get("billed_by", ""),"Net:", str(int(round(float(data.get("net_amount", 0.0)))))),
        justify_line("", "", "Paid:", str(round(float(data.get("net_amount", 0.0)))) ),
        # justify_line("", "",  )
    ]

    footer += [
        left_margin + "=" * paper_width,
        "",
        left_margin + "Medicine refund within 7 days.",
        left_margin + "Cold storage medicines cannot be returned."
    ]

 
 
 
    # Add feed space for tear-off
    footer += [left_margin + ""] * 5
 
    return "\r\n".join(header + details + table + footer)
 
import win32print

@csrf_exempt
@require_http_methods(['POST'])
@transaction.atomic
def OP_Pharmacy_Billing_link(request):
    if request.method == 'POST':
        try:
            print("Available printers:", [p[2] for p in win32print.EnumPrinters(2)])

            # -----------------------------
            # 1. Extract POST data with comprehensive error handling
            # -----------------------------
            
            # Helper function to safely parse JSON with detailed error reporting
            def safe_json_parse(json_str, field_name, default_value=None):
                if json_str is None:
                    print(f"Warning: {field_name} is None, using default: {default_value}")
                    return default_value
                
                if isinstance(json_str, str) and json_str.strip() == '':
                    print(f"Warning: {field_name} is empty string, using default: {default_value}")
                    return default_value
                
                try:
                    parsed_data = json.loads(json_str)
                    print(f"Successfully parsed {field_name}: {type(parsed_data)}")
                    return parsed_data
                except json.JSONDecodeError as e:
                    print(f"JSON parsing error for {field_name}: {e}")
                    print(f"Raw data received: {json_str[:200]}...")  # First 200 chars for debugging
                    return default_value

            # Extract and parse all JSON fields safely
            selected_patient_data_str = request.POST.get('SelectedPatient_list')
            billpay_method_str = request.POST.get('Billpay_method')
            bill_items_str = request.POST.get('Bill_Items')
            billing_itemtable_str = request.POST.get('Billing_itemtable')

            # Debug: Print raw data lengths
            print(f"Raw data lengths - SelectedPatient_list: {len(selected_patient_data_str) if selected_patient_data_str else 'None'}")
            print(f"Raw data lengths - Billpay_method: {len(billpay_method_str) if billpay_method_str else 'None'}")
            print(f"Raw data lengths - Bill_Items: {len(bill_items_str) if bill_items_str else 'None'}")
            print(f"Raw data lengths - Billing_itemtable: {len(billing_itemtable_str) if billing_itemtable_str else 'None'}")

            # Parse JSON data with safe fallbacks
            selected_patient_data = safe_json_parse(selected_patient_data_str, 'SelectedPatient_list', {})
            billpay_method = safe_json_parse(billpay_method_str, 'Billpay_method', [])
            bill_Items = safe_json_parse(bill_items_str, 'Bill_Items', {})
            bill_itemtable = safe_json_parse(billing_itemtable_str, 'Billing_itemtable', [])

            # Extract non-JSON fields
            billing_date = request.POST.get('Billing_date')
            user_name = request.POST.get('User_Name', '')
            location_id = request.POST.get('location', '')
            Paytype = request.POST.get('Paytype', '')
            Store_location = request.POST.get('StoreLocation', '')
            Remarks = request.POST.get('Remarks', '')
            systemName = request.POST.get('systemName','')
            print(f"Billing date: {billing_date}")
            print(f"User name: {user_name}")
            print(f"Location ID: {location_id}")
            print(f"Paytype: {Paytype}")
            print(f"Store location: {Store_location}")

            # Validate critical required fields
            if not selected_patient_data:
                return JsonResponse({'error': 'SelectedPatient_list is required and must be valid JSON'}, status=400)
            
            if not billing_date:
                return JsonResponse({'error': 'Billing_date is required'}, status=400)

            if not user_name:
                return JsonResponse({'error': 'User_Name is required'}, status=400)

            # -----------------------------
            # 2. Parse billing date string with multiple format support
            # -----------------------------
            billing_date_obj = None
            date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y"]
            
            for fmt in date_formats:
                try:
                    billing_date_obj = datetime.strptime(billing_date, fmt)
                    print(f"Successfully parsed date {billing_date} with format {fmt}")
                    break
                except ValueError:
                    continue
            
            if billing_date_obj is None:
                print(f"Warning: Could not parse date {billing_date}, using current date")
                billing_date_obj = datetime.now()

            # -----------------------------
            # 3. Fetch foreign keys with error handling
            # -----------------------------
            doctor_instance = None
            patient = None
            registration = None
            location = None

            try:
                if selected_patient_data.get('Doctor_Id'):
                    doctor_instance = Doctor_Personal_Form_Detials.objects.get(
                        Doctor_ID=selected_patient_data.get('Doctor_Id'))
                    print(f"Found doctor: {doctor_instance}")
            except Doctor_Personal_Form_Detials.DoesNotExist:
                print(f"Warning: Doctor with ID {selected_patient_data.get('Doctor_Id')} not found")
            except Exception as e:
                print(f"Error fetching doctor: {e}")

            try:
                if selected_patient_data.get('PatientId'):
                    patient = Patient_Detials.objects.get(
                        PatientId=selected_patient_data.get('PatientId'))
                    print(f"Found patient: {patient.PatientId}")
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'error': f"Patient with ID {selected_patient_data.get('PatientId')} not found"}, status=400)
            except Exception as e:
                return JsonResponse({'error': f"Error fetching patient: {str(e)}"}, status=400)

            try:
                if selected_patient_data.get('RegistrationId'):
                    registration = Patient_Appointment_Registration_Detials.objects.get(
                        Registration_Id=selected_patient_data.get('RegistrationId'))
                    print(f"Found registration: {registration}")
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                print(f"Warning: Registration with ID {selected_patient_data.get('RegistrationId')} not found")
            except Exception as e:
                print(f"Error fetching registration: {e}")

            try:
                if location_id:
                    location = Location_Detials.objects.get(Location_Id=location_id)
                    print(f"Found location: {location}")
            except Location_Detials.DoesNotExist:
                return JsonResponse({'error': f"Location with ID {location_id} not found"}, status=400)
            except Exception as e:
                return JsonResponse({'error': f"Error fetching location: {str(e)}"}, status=400)

            # -----------------------------
            # 4. Parse billing items with safe defaults
            # -----------------------------
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))

                print(f"Billing summary - Total: {total_amount}, Net: {net_amount}, Paid: {paid_amount}, Balance: {balance_amount}")
            except (ValueError, TypeError) as e:
                return JsonResponse({'error': f"Invalid billing item values: {str(e)}"}, status=400)

            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'

            # -----------------------------
            # 5. Create billing entry
            # -----------------------------
            try:
                billing = OP_Pharmacy_Billing_Table_Detials.objects.create(
                    Doctor_Id=doctor_instance,
                    Patient_Id=patient,
                    Billing_Date=billing_date_obj,
                    Register_Id=registration,
                    Billing_Type="OPPharmacy",
                    Discount_Amount=discount_amount,
                    SGST_val=sgst_val,
                    CGST_val=cgst_val,
                    Total_GSTAmount=gst_amount,
                    Total_Items=total_items,
                    Total_Qty=total_qty,
                    Total_Amount=total_amount,
                    Net_Amount=net_amount,
                    Paid_Amount=paid_amount,
                    Balance_Amount=balance_amount,
                    Round_Off=round_off,
                    created_by=user_name,
                    Location=location,
                    Bill_Status=new_bill_status,
                    Remarks=Remarks
                )
                print(f"Created billing entry: {billing.Billing_Invoice_No}")
            except Exception as e:
                return JsonResponse({'error': f"Error creating billing entry: {str(e)}"}, status=400)

            # -----------------------------
            # 6. Update prescription status
            # -----------------------------
            try:
                drug_status = OPD_Prescription_Details.objects.filter(
                    Patient_Id__PatientId=patient.PatientId, Status=True)
                updated_count = 0
                for drug in drug_status:
                    drug.Status = False
                    drug.BillingStatus = new_bill_status
                    drug.save()
                    updated_count += 1
                print(f"Updated {updated_count} prescription records")
            except Exception as e:
                print(f"Warning: Error updating prescription status: {e}")

            # -----------------------------
            # 7. Save billing items with comprehensive error handling
            # -----------------------------
            bill_items_list = []

            if not bill_itemtable or len(bill_itemtable) == 0:
                return JsonResponse({'error': 'No billing items provided'}, status=400)

            for index, item in enumerate(bill_itemtable):
                try:
                    # Validate required fields
                    if not item.get('ItemId') or not item.get('BatchNo'):
                        print(f"Skipping item {index}: Missing ItemId or BatchNo")
                        continue

                    # Update stock quantity
                    try:
                        storelocation = Stock_Maintance_Table_Detials.objects.get(
                            Store_location=Store_location,
                            Batch_No=item.get('BatchNo')
                        )
                        quantity_to_deduct = int(item.get('Billing_Quantity', 0))
                        if storelocation.AvailableQuantity >= quantity_to_deduct:
                            storelocation.AvailableQuantity -= quantity_to_deduct
                            storelocation.save()
                            print(f"Updated stock for {item.get('ItemName')}: -{quantity_to_deduct}")
                        else:
                            print(f"Warning: Insufficient stock for {item.get('ItemName')}")
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        print(f"Warning: Stock not found for BatchNo {item.get('BatchNo')}")
                        continue
                    except Exception as e:
                        print(f"Warning: Error updating stock for {item.get('ItemName')}: {e}")
                        continue

                    # Get stock instance
                    try:
                        stock_ins = Stock_Maintance_Table_Detials.objects.get(
                            Batch_No=item.get('BatchNo'),
                            Product_Detials__pk=item.get('ItemId'),
                            Store_location=Store_location
                        )
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        print(f"Warning: Stock instance not found for ItemId {item.get('ItemId')}")
                        continue

                    # Parse expiry date safely
                    exp_date = None
                    if item.get('Exp_Date'):
                        try:
                            exp_date = datetime.strptime(item.get('Exp_Date'), "%Y-%m-%d").date()
                        except ValueError:
                            print(f"Warning: Invalid expiry date format: {item.get('Exp_Date')}")

                    # Create billing item
                    OP_BillingItem.objects.create(
                        Billing=billing,
                        ItemId=stock_ins,
                        ItemName=item.get('ItemName', ''),
                        Billing_Quantity=int(item.get('Billing_Quantity', 0)),
                        BatchNo=item.get('BatchNo', ''),
                        Exp_Date=exp_date,
                        Unit_Price=float(item.get('Unit_Price', 0)),
                        Amount=float(item.get('Amount', 0)),
                        Total=float(item.get('Total', 0))
                    )

                    bill_items_list.append({
                        'ItemName': item.get('ItemName', ''),
                        'BatchNo': item.get('BatchNo', ''),
                        'Exp_Date': item.get('Exp_Date', ''),
                        'Billing_Quantity': item.get('Billing_Quantity', 0),
                        'Unit_Price': item.get('Unit_Price', 0),
                        'Amount': item.get('Amount', 0),
                        'Total': item.get('Total', 0)
                    })

                except Exception as e:
                    print(f"Error processing billing item {index}: {e}")
                    continue

            if len(bill_items_list) == 0:
                return JsonResponse({'error': 'No valid billing items processed'}, status=400)

            # -----------------------------
            # 8. Save receipt if cash
            # -----------------------------
            billing_receipt_table = None
            if Paytype == 'Cash':
                try:
                    billing_receipt_table = OPPharmacyBillingReceipt.objects.create(
                        Invoice_NO=billing,
                        PatientID=patient.PatientId,
                        PhoneNumber=patient.PhoneNo,
                        Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                        TotalAmount=total_amount,
                        TotalPaidAmount=paid_amount,
                        BalanceAmount=balance_amount,
                        Billing_Date=billing_date_obj,
                        PaidAmount=paid_amount,
                        Billedby=user_name,
                    )
                    print(f"Created receipt: {billing_receipt_table.Voucher_Number}")
                except Exception as e:
                    print(f"Warning: Error creating receipt: {e}")

            # -----------------------------
            # 9. Save payments with error handling
            # -----------------------------
            if billpay_method and len(billpay_method) > 0:
                for index, payment in enumerate(billpay_method):
                    try:
                        OP_Pharmacy_Billing_Payments.objects.create(
                            Billing=billing_receipt_table if billing_receipt_table else None,
                            Billpay_method=payment.get('Billpay_method', ''),
                            CardType=payment.get('CardType', ''),
                            BankName=payment.get('BankName', ''),
                            ChequeNo=payment.get('ChequeNo', ''),
                            paidamount=float(payment.get('paidamount', 0)),
                            Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                            transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else 0,
                        )
                    except Exception as e:
                        print(f"Warning: Error creating payment record {index}: {e}")

            # -----------------------------
            # 10. PRINT BILL IMMEDIATELY with error handling
            # -----------------------------
            # try:
            #     printer_name = "TVS MSP 250 Star"

            #     bill_data = {
            #         "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
            #         "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
            #         "patient_id": patient.PatientId,
            #         "age": patient.Age,
            #         "gender": patient.Gender,
            #         "invoice_no": billing.Billing_Invoice_No,
            #         "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
            #         "date": billing_date_obj.strftime('%d/%m/%Y'),
            #         "time": billing.created_at.strftime("%I:%M %p"),
            #         "patient_phone": patient.PhoneNo,
            #         "items": [
            #             {
            #                 "name": item["ItemName"],
            #                 "batch": item["BatchNo"],
            #                 "expiry": item["Exp_Date"],
            #                 "qty": item["Billing_Quantity"],
            #                 "rate": float(item["Unit_Price"]),
            #                 "mrp": float(item["Amount"]),
            #                 "total": float(item["Total"])
            #             }
            #             for item in bill_items_list
            #         ],
            #         "amount_words": num2words.num2words(billing.Net_Amount),
            #         "gst": billing.Total_GSTAmount,
            #         "billed_by": user_name,
            #         "net_amount": billing.Net_Amount,
            #         "gross_amount": billing.Total_Amount,
            #     }

            #     # bill_text = format_bill(bill_data)
            #     bill_text = Op_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)
    
    
    
            #     print("Dot-Matrix",bill_text)
            #     if systemName:
            #         print("SYS--------",systemName)
            #         JOB = PrintJob.objects.create(
            #             system_name = systemName,
            #             bill_text= bill_text
            #         )
            #         JOB.save()
            #         print("Job Assigned To",JOB)
 
 
 

            #     hPrinter = win32print.OpenPrinter(printer_name)
            #     try:
            #         hJob = win32print.StartDocPrinter(hPrinter, 1, ("OP Bill", None, "RAW"))
            #         win32print.StartPagePrinter(hPrinter)
            #         win32print.WritePrinter(hPrinter, bill_text.encode('ascii', errors='replace'))
            #         win32print.EndPagePrinter(hPrinter)
            #         win32print.EndDocPrinter(hPrinter)
            #         print("Bill printed successfully")
            #     finally:
            #         win32print.ClosePrinter(hPrinter)
            # except Exception as e:
            #     print(f"Warning: Error printing bill: {e}")
                # Don't fail the entire request if printing fails

            # -----------------------------
            # 11. Return success response
            # -----------------------------
            return JsonResponse({
                'status': 'success',
                'message': 'OP Data saved and printed successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': billing_receipt_table.Voucher_Number if billing_receipt_table else None
            })

        except Exception as e:
            print(f"Critical error occurred: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            transaction.set_rollback(True)
            return JsonResponse({
                'error': f'Server error: {str(e)}',
                'type': type(e).__name__
            }, status=500)
 




 
def Get_Print_Jobs(request, system_name):
    if request.method == "GET":
        try:
            print("SYS -------", system_name)
 
            # Get the oldest unprinted job for that system
            job = PrintJob.objects.filter(system_name=system_name, status="pending").order_by('created_at').first()
 
            if job:
                data = {
                    "id": job.job_id,
                    "system_name": job.system_name,
                    "bill_text": job.bill_text,
                    "is_printed": job.status,
                    "created_at": job.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                }
                return JsonResponse(data, status=200)
            else:
                return JsonResponse({"message": "No pending job"}, status=204)
 
        except Exception as e:
            print("Error |", str(e))
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
 
 
@csrf_exempt
def Post_Print_Jobs(request):
    if request.method == "POST":
        try:
            # Parse JSON body
            body = json.loads(request.body.decode('utf-8'))
            job_id = body.get("id")
 
            if not job_id:
                return JsonResponse({"error": "Missing job ID"}, status=400)
 
            # Find the print job
            job = PrintJob.objects.filter(job_id=job_id).first()
            if not job:
                return JsonResponse({"error": "Print job not found"}, status=404)
 
            # Mark it as printed
            job.status = "Completed"
            job.save()
 
            print(f"[{job.system_name}] Job {job_id} marked as done")
            return JsonResponse({"message": "Job marked as done"}, status=200)
 
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            print("Error |", str(e))
            return JsonResponse({"error": str(e)}, status=500)
 
    return JsonResponse({"error": "Invalid request method"}, status=405)
 
 
 
 
from num2words import num2words





@csrf_exempt
@require_http_methods(['POST'])
@transaction.atomic
def New_OP_Pharmacy_Billing_link(request):
    if request.method == 'POST':
        try:
           
            def safe_json_parse(json_str, field_name, default_value=None):
                if json_str is None:
                    print(f"Warning: {field_name} is None, using default: {default_value}")
                    return default_value
                
                if isinstance(json_str, str) and json_str.strip() == '':
                    print(f"Warning: {field_name} is empty string, using default: {default_value}")
                    return default_value
                
                try:
                    parsed_data = json.loads(json_str)
                    print(f"Successfully parsed {field_name}: {type(parsed_data)}")
                    return parsed_data
                except json.JSONDecodeError as e:
                    print(f"JSON parsing error for {field_name}: {e}")
                    print(f"Raw data received: {json_str[:200]}...")  # First 200 chars for debugging
                    return default_value

            # Extract and parse all JSON fields safely
            selected_patient_data_str = request.POST.get('SelectedPatient_list')
            billpay_method_str = request.POST.get('Billpay_method')
            bill_items_str = request.POST.get('Bill_Items')
            billing_itemtable_str = request.POST.get('Billing_itemtable')
            bill_text=""

            # Debug: Print raw data lengths
            print(f"Raw data lengths - SelectedPatient_list: {len(selected_patient_data_str) if selected_patient_data_str else 'None'}")
            print(f"Raw data lengths - Billpay_method: {len(billpay_method_str) if billpay_method_str else 'None'}")
            print(f"Raw data lengths - Bill_Items: {len(bill_items_str) if bill_items_str else 'None'}")
            print(f"Raw data lengths - Billing_itemtable: {len(billing_itemtable_str) if billing_itemtable_str else 'None'}")

            # Parse JSON data with safe fallbacks
            selected_patient_data = safe_json_parse(selected_patient_data_str, 'SelectedPatient_list', {})
            billpay_method = safe_json_parse(billpay_method_str, 'Billpay_method', [])
            bill_Items = safe_json_parse(bill_items_str, 'Bill_Items', {})
            bill_itemtable = safe_json_parse(billing_itemtable_str, 'Billing_itemtable', [])

            # Extract non-JSON fields
            billing_date = request.POST.get('Billing_date')
            user_name = request.POST.get('User_Name', '')
            location_id = request.POST.get('location', '')
            Paytype = request.POST.get('Paytype', '')
            Store_location = request.POST.get('StoreLocation', '')
            viewtype = request.POST.get('viewType', '')
            Remarks = request.POST.get('Remarks', '')
            systemName = request.POST.get('systemName','')

            print(viewtype,'viewtype opppppppppppppp')

            print(f"Billing date: {billing_date}")
            print(f"User name: {user_name}")
            print(f"Location ID: {location_id}")
            print(f"Paytype: {Paytype}")
            print(f"Store location: {Store_location}")

            # Validate critical required fields
            if not selected_patient_data:
                return JsonResponse({'error': 'SelectedPatient_list is required and must be valid JSON'}, status=400)
            
            if not billing_date:
                return JsonResponse({'error': 'Billing_date is required'}, status=400)

            if not user_name:
                return JsonResponse({'error': 'User_Name is required'}, status=400)

            # -----------------------------
            # 2. Parse billing date string with multiple format support
            # -----------------------------
            billing_date_obj = None
            date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y"]
            
            for fmt in date_formats:
                try:
                    billing_date_obj = datetime.strptime(billing_date, fmt)
                    print(f"Successfully parsed date {billing_date} with format {fmt}")
                    break
                except ValueError:
                    continue
            
            if billing_date_obj is None:
                print(f"Warning: Could not parse date {billing_date}, using current date")
                billing_date_obj = datetime.now()

            # -----------------------------
            # 3. Fetch foreign keys with error handling
            # -----------------------------
            doctor_instance = None
            patient = None
            registration = None
            location = None

            try:
                if selected_patient_data.get('Doctor_Id'):
                    doctor_instance = Doctor_Personal_Form_Detials.objects.get(
                        Doctor_ID=selected_patient_data.get('Doctor_Id'))
                    print(f"Found doctor: {doctor_instance}")
            except Doctor_Personal_Form_Detials.DoesNotExist:
                print(f"Warning: Doctor with ID {selected_patient_data.get('Doctor_Id')} not found")
            except Exception as e:
                print(f"Error fetching doctor: {e}")

            try:
                if selected_patient_data.get('PatientId'):
                    patient = Patient_Detials.objects.get(
                        PatientId=selected_patient_data.get('PatientId'))
                    print(f"Found patient: {patient.PatientId}")
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'error': f"Patient with ID {selected_patient_data.get('PatientId')} not found"}, status=400)
            except Exception as e:
                return JsonResponse({'error': f"Error fetching patient: {str(e)}"}, status=400)

            try:
                if selected_patient_data.get('RegistrationId'):
                    registration = Patient_Appointment_Registration_Detials.objects.get(
                        Registration_Id=selected_patient_data.get('RegistrationId'))
                    print(f"Found registration: {registration}")
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                print(f"Warning: Registration with ID {selected_patient_data.get('RegistrationId')} not found")
            except Exception as e:
                print(f"Error fetching registration: {e}")

            try:
                if location_id:
                    location = Location_Detials.objects.get(Location_Id=location_id)
                    print(f"Found location: {location}")
            except Location_Detials.DoesNotExist:
                return JsonResponse({'error': f"Location with ID {location_id} not found"}, status=400)
            except Exception as e:
                return JsonResponse({'error': f"Error fetching location: {str(e)}"}, status=400)

            # -----------------------------
            # 4. Parse billing items with safe defaults
            # -----------------------------
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))

                if paid_amount == balance_amount:
                    return JsonResponse({'warn':'Your Try to Put a Due'})


                print(f"Billing summary - Total: {total_amount}, Net: {net_amount}, Paid: {paid_amount}, Balance: {balance_amount}")
            except (ValueError, TypeError) as e:
                return JsonResponse({'error': f"Invalid billing item values: {str(e)}"}, status=400)

            balance_amount = Decimal(balance_amount).quantize(Decimal('1'),rounding=ROUND_HALF_UP)
            new_bill_status = 'Paid' 
            proceed_force = request.POST.get("proceed_force", "no")   # default no

            # check last bill for the same patient today with same amount
            from django.utils import timezone
            today = timezone.now().date()

            proceed_force = request.POST.get("proceed_force", "no")

            last_bill = OP_Pharmacy_Billing_Table_Detials.objects.filter(
                Patient_Id=patient,
                Net_Amount=net_amount,
                Billing_Date=today,   # <-- FIXED HERE  
            ).order_by('-Billing_Invoice_No').first()

            if last_bill and proceed_force != "yes":
                return JsonResponse({
                    "status": "duplicate_detected",
                    "message": f"Similar Bill Already Exists: Invoice {last_bill.Billing_Invoice_No} Amount {net_amount}",
                    "last_invoice": last_bill.Billing_Invoice_No,
                    "total": net_amount
                })
            # -----------------------------
            # 5. Create billing entry
            # -----------------------------
            try:
                billing = OP_Pharmacy_Billing_Table_Detials.objects.create(
                    Doctor_Id=doctor_instance,
                    Patient_Id=patient,
                    Billing_Date=billing_date_obj,
                    Register_Id=registration,
                    Billing_Type=viewtype,
                    Discount_Amount=discount_amount,
                    SGST_val=sgst_val,
                    CGST_val=cgst_val,
                    Total_GSTAmount=gst_amount,
                    Total_Items=total_items,
                    Total_Qty=total_qty,
                    Total_Amount=total_amount,
                    Net_Amount=net_amount,
                    Paid_Amount=paid_amount,
                    Balance_Amount=balance_amount,
                    Round_Off=round_off,
                    created_by=user_name,
                    Location=location,
                    Bill_Status=new_bill_status,
                    Remarks=Remarks
                )
                print(f"Created billing entry: {billing.Billing_Invoice_No}")
            except Exception as e:
                return JsonResponse({'error': f"Error creating billing entry: {str(e)}"}, status=400)

            # -----------------------------
            # 6. Update prescription status
            # -----------------------------
            try:
                drug_status = OPD_Prescription_Details.objects.filter(
                    Patient_Id__PatientId=patient.PatientId, Status=True)
                updated_count = 0
                for drug in drug_status:
                    drug.Status = False
                    drug.BillingStatus = new_bill_status
                    drug.save()
                    updated_count += 1
                print(f"Updated {updated_count} prescription records")
            except Exception as e:
                print(f"Warning: Error updating prescription status: {e}")

            # -----------------------------
            # 7. Save billing items with comprehensive error handling
            # -----------------------------
            bill_items_list = []

            if not bill_itemtable or len(bill_itemtable) == 0:
                return JsonResponse({'error': 'No billing items provided'}, status=400)

            for index, item in enumerate(bill_itemtable):
                try:
                    # Validate required fields
                    if not item.get('ItemId') or not item.get('BatchNo'):
                        print(f"Skipping item {index}: Missing ItemId or BatchNo")
                        continue

                    # Update stock quantity
                    try:
                        item_name = item.get('ItemName','')
                        batch_no  = item.get('BatchNo','')

                        storelocation = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName__iexact=item_name,   # strip & case-insensitive
                            Store_location=Store_location,
                            Batch_No__iexact=batch_no                      # strip & case-insensitive
                        ).first()

                        quantity_to_deduct = int(item.get('Billing_Quantity', 0))
                        if storelocation.AvailableQuantity >= quantity_to_deduct:
                            storelocation.AvailableQuantity -= quantity_to_deduct
                            storelocation.Update_Reason ='Billed Item'
                            storelocation.Updated_by = user_name
                            storelocation.Update_at = datetime.now()
                            storelocation.save()
                            print(f"Updated stock for {item.get('ItemName')}: -{quantity_to_deduct}")
                        else:
                            print(f"Warning: Insufficient stock for {item.get('ItemName')}")
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        print(f"Warning: Stock not found for BatchNo {item.get('BatchNo')}")
                        continue
                    except Exception as e:
                        print(f"Warning: Error updating stock for {item.get('ItemName')}: {e}")
                        continue

                    # Get stock instance
                    try:
                        stock_ins = Stock_Maintance_Table_Detials.objects.get(
                            Batch_No=item.get('BatchNo').strip(),
                            Product_Detials__pk=item.get('ItemId'),
                            Store_location=Store_location
                        )
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        print(f"Warning: Stock instance not found for ItemId {item.get('ItemId')}")
                        continue

                    # Parse expiry date safely
                    exp_date = None
                    if item.get('Exp_Date'):
                        try:
                            exp_date = datetime.strptime(item.get('Exp_Date'), "%Y-%m-%d").date()
                        except ValueError:
                            print(f"Warning: Invalid expiry date format: {item.get('Exp_Date')}")

                    # Create billing item
                    OP_BillingItem.objects.create(
                        Billing=billing,
                        ItemId=stock_ins,
                        ItemName=item.get('ItemName', ''),
                        Billing_Quantity=int(item.get('Billing_Quantity', 0)),
                        BatchNo=item.get('BatchNo', ''),
                        Exp_Date=exp_date,
                        Unit_Price=float(item.get('Unit_Price', 0)),
                        Amount=float(item.get('Amount', 0)),
                        Total=float(item.get('Total', 0))
                    )

                    bill_items_list.append({
                        'ItemName': item.get('ItemName', ''),
                        'BatchNo': item.get('BatchNo', ''),
                        'Exp_Date': item.get('Exp_Date', ''),
                        'BoxName': item.get('BoxName', ''),  # ensure this line exists

                        'Billing_Quantity': item.get('Billing_Quantity', 0),
                        'Unit_Price': item.get('Unit_Price', 0),
                        'Amount': item.get('Amount', 0),
                        'Total': item.get('Total', 0)
                    })

                except Exception as e:
                    print(f"Error processing billing item {index}: {e}")
                    continue

            if len(bill_items_list) == 0:
                return JsonResponse({'error': 'No valid billing items processed'}, status=400)

            # -----------------------------
            # 8. Save receipt if cash
            # -----------------------------
            billing_receipt_table = None
            if Paytype == 'Cash':
                try:
                    billing_receipt_table = OPPharmacyBillingReceipt.objects.create(
                        Invoice_NO=billing,
                        PatientID=patient.PatientId,
                        PhoneNumber=patient.PhoneNo,
                        Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                        TotalAmount=total_amount,
                        TotalPaidAmount=paid_amount,
                        BalanceAmount=balance_amount,
                        Billing_Date=billing_date_obj,
                        PaidAmount=paid_amount,
                        Billedby=user_name,
                    )
                    print(f"Created receipt: {billing_receipt_table.Voucher_Number}")
                except Exception as e:
                    print(f"Warning: Error creating receipt: {e}")

            # -----------------------------
            # 9. Save payments with error handling
            # -----------------------------
            if billpay_method and len(billpay_method) > 0:
                for index, payment in enumerate(billpay_method):
                    try:
                        OP_Pharmacy_Billing_Payments.objects.create(
                            Billing=billing_receipt_table if billing_receipt_table else None,
                            Billpay_method=payment.get('Billpay_method', ''),
                            CardType=payment.get('CardType', ''),
                            BankName=payment.get('BankName', ''),
                            ChequeNo=payment.get('ChequeNo', ''),
                            paidamount=float(payment.get('paidamount', 0)),
                            Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                            transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else 0,
                        )
                    except Exception as e:
                        print(f"Warning: Error creating payment record {index}: {e}")

            # -----------------------------
            # 10. PRINT BILL IMMEDIATELY with error handling
            # -----------------------------
            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_items_list:

                    for idx, item in enumerate(bill_items_list):
                        if "BoxName" not in item:
                            print(f"Warning: BoxName missing in item index {idx}: {item}")

                    grn = GRN_Product_Item_Detials.objects.filter(
                    Product_Detials__ItemName=item["ItemName"]
                ).first()
                    items_list.append({
                        "name": item["ItemName"],
                        "batch": item["BatchNo"],
                        "expiry": item["Exp_Date"],
                        "qty": item["Billing_Quantity"],
                        "rate": float(item["Unit_Price"]),
                        "BoxName": str(item.get("BoxName", "")),

                        "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn and grn.Sellable_qty_price else 0,
                        "mrp": float(item["Amount"]),
                        "total": float(item["Total"])
                    })
                print('itemlist',items_list)
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
                    "patient_id": patient.PatientId,
                    "Bill_Status":new_bill_status,
                    "age": patient.Age,
                    "doctor_name":f"{doctor_instance.First_Name if doctor_instance else ''} {doctor_instance.Middle_Name if doctor_instance else ''} {doctor_instance.Last_Name if doctor_instance else ''}",
                    "gender": patient.Gender,
                    "invoice_no": billing.Billing_Invoice_No,
                    "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                    "date": billing_date_obj.strftime('%d/%m/%Y'),
                    "patient_phone": patient.PhoneNo,
                    "items": items_list,
                    "amount_words": num2words(billing.Net_Amount),
                    "gst": billing.Total_GSTAmount,
                    "billed_by": user_name,
                    "net_amount": billing.Net_Amount,
                    "gross_amount": billing.Total_Amount,
                }

                bill_text = Op_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)

                print("SYS-----11---", systemName)
                print(bill_text)
               


            except Exception as e:
                print(f"Warning: Error printing bill: {e}")
               

            return JsonResponse({
                'status': 'success',
                'message': 'OP Data saved and printed successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': billing_receipt_table.Voucher_Number if billing_receipt_table else None,
                'printJob': bill_text,
                         })

        except Exception as e:
            print(f"Critical error occurred: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            transaction.set_rollback(True)
            return JsonResponse({
                'error': f'Server error: {str(e)}',
                'type': type(e).__name__
            }, status=500)
 

@csrf_exempt
@require_http_methods(['POST'])
@transaction.atomic
def New_OP_Pharmacy_Billing_link_optical(request):
    if request.method == 'POST':
        try:
           
            def safe_json_parse(json_str, field_name, default_value=None):
                if json_str is None:
                    print(f"Warning: {field_name} is None, using default: {default_value}")
                    return default_value
                
                if isinstance(json_str, str) and json_str.strip() == '':
                    print(f"Warning: {field_name} is empty string, using default: {default_value}")
                    return default_value
                
                try:
                    parsed_data = json.loads(json_str)
                    print(f"Successfully parsed {field_name}: {type(parsed_data)}")
                    return parsed_data
                except json.JSONDecodeError as e:
                    print(f"JSON parsing error for {field_name}: {e}")
                    print(f"Raw data received: {json_str[:200]}...")  # First 200 chars for debugging
                    return default_value

            # Extract and parse all JSON fields safely
            selected_patient_data_str = request.POST.get('SelectedPatient_list')
            billpay_method_str = request.POST.get('Billpay_method')
            bill_items_str = request.POST.get('Bill_Items')
            billing_itemtable_str = request.POST.get('Billing_itemtable')
            bill_text=""

            # Debug: Print raw data lengths
            print(f"Raw data lengths - SelectedPatient_list: {len(selected_patient_data_str) if selected_patient_data_str else 'None'}")
            print(f"Raw data lengths - Billpay_method: {len(billpay_method_str) if billpay_method_str else 'None'}")
            print(f"Raw data lengths - Bill_Items: {len(bill_items_str) if bill_items_str else 'None'}")
            print(f"Raw data lengths - Billing_itemtable: {len(billing_itemtable_str) if billing_itemtable_str else 'None'}")

            # Parse JSON data with safe fallbacks
            selected_patient_data = safe_json_parse(selected_patient_data_str, 'SelectedPatient_list', {})
            billpay_method = safe_json_parse(billpay_method_str, 'Billpay_method', [])
            bill_Items = safe_json_parse(bill_items_str, 'Bill_Items', {})
            bill_itemtable = safe_json_parse(billing_itemtable_str, 'Billing_itemtable', [])

            # Extract non-JSON fields
            billing_date = request.POST.get('Billing_date')
            user_name = request.POST.get('User_Name', '')
            location_id = request.POST.get('location', '')
            Paytype = request.POST.get('Paytype', '')
            Store_location = request.POST.get('StoreLocation', '')
            viewtype = request.POST.get('viewType', '')
            Remarks = request.POST.get('Remarks', '')
            systemName = request.POST.get('systemName','')

            print(viewtype,'viewtype opppppppppppppp')

            print(f"Billing date: {billing_date}")
            print(f"User name: {user_name}")
            print(f"Location ID: {location_id}")
            print(f"Paytype: {Paytype}")
            print(f"Store location: {Store_location}")

            # Validate critical required fields
            if not selected_patient_data:
                return JsonResponse({'error': 'SelectedPatient_list is required and must be valid JSON'}, status=400)
            
            if not billing_date:
                return JsonResponse({'error': 'Billing_date is required'}, status=400)

            if not user_name:
                return JsonResponse({'error': 'User_Name is required'}, status=400)

            # -----------------------------
            # 2. Parse billing date string with multiple format support
            # -----------------------------
            billing_date_obj = None
            date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y"]
            
            for fmt in date_formats:
                try:
                    billing_date_obj = datetime.strptime(billing_date, fmt)
                    print(f"Successfully parsed date {billing_date} with format {fmt}")
                    break
                except ValueError:
                    continue
            
            if billing_date_obj is None:
                print(f"Warning: Could not parse date {billing_date}, using current date")
                billing_date_obj = datetime.now()

            # -----------------------------
            # 3. Fetch foreign keys with error handling
            # -----------------------------
            doctor_instance = None
            patient = None
            registration = None
            location = None

            try:
                if selected_patient_data.get('Doctor_Id'):
                    doctor_instance = Doctor_Personal_Form_Detials.objects.get(
                        Doctor_ID=selected_patient_data.get('Doctor_Id'))
                    print(f"Found doctor: {doctor_instance}")
            except Doctor_Personal_Form_Detials.DoesNotExist:
                print(f"Warning: Doctor with ID {selected_patient_data.get('Doctor_Id')} not found")
            except Exception as e:
                print(f"Error fetching doctor: {e}")

            try:
                if selected_patient_data.get('PatientId'):
                    patient = Patient_Detials.objects.get(
                        PatientId=selected_patient_data.get('PatientId'))
                    print(f"Found patient: {patient.PatientId}")
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'error': f"Patient with ID {selected_patient_data.get('PatientId')} not found"}, status=400)
            except Exception as e:
                return JsonResponse({'error': f"Error fetching patient: {str(e)}"}, status=400)

            try:
                if selected_patient_data.get('RegistrationId'):
                    registration = Patient_Appointment_Registration_Detials.objects.get(
                        Registration_Id=selected_patient_data.get('RegistrationId'))
                    print(f"Found registration: {registration}")
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                print(f"Warning: Registration with ID {selected_patient_data.get('RegistrationId')} not found")
            except Exception as e:
                print(f"Error fetching registration: {e}")

            try:
                if location_id:
                    location = Location_Detials.objects.get(Location_Id=location_id)
                    print(f"Found location: {location}")
            except Location_Detials.DoesNotExist:
                return JsonResponse({'error': f"Location with ID {location_id} not found"}, status=400)
            except Exception as e:
                return JsonResponse({'error': f"Error fetching location: {str(e)}"}, status=400)

            # -----------------------------
            # 4. Parse billing items with safe defaults
            # -----------------------------
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))

                # if paid_amount == 0:
                #     return JsonResponse({'warn':'Your Try to Put a Due'})


                print(f"Billing summary - Total: {total_amount}, Net: {net_amount}, Paid: {paid_amount}, Balance: {balance_amount}")
            except (ValueError, TypeError) as e:
                return JsonResponse({'error': f"Invalid billing item values: {str(e)}"}, status=400)

            balance_amount = Decimal(balance_amount).quantize(Decimal('1'),rounding=ROUND_HALF_UP)
            new_bill_status = 'Paid' if balance_amount <= Decimal('0.00') else 'Due'
            proceed_force = request.POST.get("proceed_force", "no")   # default no

            # check last bill for the same patient today with same amount
            from django.utils import timezone
            today = timezone.now().date()

            proceed_force = request.POST.get("proceed_force", "no")

            last_bill = OP_Pharmacy_Billing_Table_Detials_optical.objects.filter(
                Patient_Id=patient,
                Net_Amount=net_amount,
                Billing_Date=today,   # <-- FIXED HERE  
            ).order_by('-Billing_Invoice_No').first()

            if last_bill and proceed_force != "yes":
                return JsonResponse({
                    "status": "duplicate_detected",
                    "message": f"Similar Bill Already Exists: Invoice {last_bill.Billing_Invoice_No} Amount {net_amount}",
                    "last_invoice": last_bill.Billing_Invoice_No,
                    "total": net_amount
                })
            # -----------------------------
            # 5. Create billing entry
            # -----------------------------
            try:
                billing = OP_Pharmacy_Billing_Table_Detials_optical.objects.create(
                    Doctor_Id=doctor_instance,
                    Patient_Id=patient,
                    Billing_Date=billing_date_obj,
                    Register_Id=registration,
                    Billing_Type=viewtype,
                    Discount_Amount=discount_amount,
                    SGST_val=sgst_val,
                    CGST_val=cgst_val,
                    Total_GSTAmount=gst_amount,
                    Total_Items=total_items,
                    Total_Qty=total_qty,
                    Total_Amount=total_amount,
                    Net_Amount=net_amount,
                    Paid_Amount=paid_amount,
                    Balance_Amount=balance_amount,
                    Round_Off=round_off,
                    created_by=user_name,
                    Location=location,
                    Bill_Status=new_bill_status,
                    Remarks=Remarks
                )
                print(f"Created billing entry: {billing.Billing_Invoice_No}")
            except Exception as e:
                return JsonResponse({'error': f"Error creating billing entry: {str(e)}"}, status=400)

            # -----------------------------
            # 6. Update prescription status
            # -----------------------------
            try:
                drug_status = OPD_Prescription_Details.objects.filter(
                    Patient_Id__PatientId=patient.PatientId, Status=True)
                updated_count = 0
                for drug in drug_status:
                    drug.Status = False
                    drug.BillingStatus = new_bill_status
                    drug.save()
                    updated_count += 1
                print(f"Updated {updated_count} prescription records")
            except Exception as e:
                print(f"Warning: Error updating prescription status: {e}")

            # -----------------------------
            # 7. Save billing items with comprehensive error handling
            # -----------------------------
            bill_items_list = []

            if not bill_itemtable or len(bill_itemtable) == 0:
                return JsonResponse({'error': 'No billing items provided'}, status=400)

            for index, item in enumerate(bill_itemtable):
                try:
                    # Validate required fields
                    if not item.get('ItemId') or not item.get('BatchNo'):
                        print(f"Skipping item {index}: Missing ItemId or BatchNo")
                        continue

                    # Update stock quantity
                    try:
                        item_name = item.get('ItemName','')
                        batch_no  = item.get('BatchNo','')

                        storelocation = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName__iexact=item_name,   # strip & case-insensitive
                            Store_location=Store_location,
                            # Batch_No__iexact=batch_no                      # strip & case-insensitive
                        ).first()

                        quantity_to_deduct = int(item.get('Billing_Quantity', 0))
                        if storelocation.AvailableQuantity >= quantity_to_deduct:
                            storelocation.AvailableQuantity -= quantity_to_deduct
                            storelocation.Update_Reason ='Billed Item'
                            storelocation.Updated_by = user_name
                            storelocation.Update_at = datetime.now()
                            storelocation.save()
                            print(f"Updated stock for {item.get('ItemName')}: -{quantity_to_deduct}")
                        else:
                            print(f"Warning: Insufficient stock for {item.get('ItemName')}")
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        print(f"Warning: Stock not found for BatchNo {item.get('BatchNo')}")
                        continue
                    except Exception as e:
                        print(f"Warning: Error updating stock for {item.get('ItemName')}: {e}")
                        continue

                    # Get stock instance
                    try:
                        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
                            # Batch_No=item.get('BatchNo').strip(),
                            Product_Detials__pk=item.get('ItemId'),
                            Store_location=Store_location
                        ).first()
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        print(f"Warning: Stock instance not found for ItemId {item.get('ItemId')}")
                        continue

                    # Parse expiry date safely
                    exp_date = None
                    if item.get('Exp_Date'):
                        try:
                            exp_date = datetime.strptime(item.get('Exp_Date'), "%Y-%m-%d").date()
                        except ValueError:
                            print(f"Warning: Invalid expiry date format: {item.get('Exp_Date')}")

                    # Create billing item
                    OP_BillingItemoptical.objects.create(
                        Billing=billing,
                        ItemId=stock_ins,
                        ItemName=item.get('ItemName', ''),
                        Billing_Quantity=int(item.get('Billing_Quantity', 0)),
                        BatchNo=item.get('BatchNo', ''),
                        # Exp_Date=datetime.date.now(),
                        Unit_Price=float(item.get('Unit_Price', 0)),
                        Amount=float(item.get('Amount', 0)),
                        Total=float(item.get('Total', 0))
                    )

                    bill_items_list.append({
                        'ItemName': item.get('ItemName', ''),
                        'BatchNo': item.get('BatchNo', ''),
                        'Exp_Date': item.get('Exp_Date', ''),
                        'BoxName': item.get('BoxName', ''),  # ensure this line exists

                        'Billing_Quantity': item.get('Billing_Quantity', 0),
                        'Unit_Price': item.get('Unit_Price', 0),
                        'Amount': item.get('Amount', 0),
                        'Total': item.get('Total', 0)
                    })

                except Exception as e:
                    print(f"Error processing billing item {index}: {e}")
                    continue

            #if len(bill_items_list) == 0:
            #    return JsonResponse({'error': 'No valid billing items processed'}, status=400)

            # -----------------------------
            # 8. Save receipt if cash
            # -----------------------------
            billing_receipt_table = None
            if Paytype == 'Cash':
                try:
                    billing_receipt_table = OPPharmacyBillingReceiptoptical.objects.create(
                        Invoice_NO=billing,
                        PatientID=patient.PatientId,
                        PhoneNumber=patient.PhoneNo,
                        Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                        TotalAmount=total_amount,
                        TotalPaidAmount=paid_amount,
                        BalanceAmount=balance_amount,
                        Billing_Date=billing_date_obj,
                        PaidAmount=paid_amount,
                        Billedby=user_name,
                    )
                    print(f"Created receipt: {billing_receipt_table.Voucher_Number}")
                except Exception as e:
                    print(f"Warning: Error creating receipt: {e}")

            # -----------------------------
            # 9. Save payments with error handling
            # -----------------------------
            if billpay_method and len(billpay_method) > 0:
                for index, payment in enumerate(billpay_method):
                    try:
                        OP_Pharmacy_Billing_Payments_optical.objects.create(
                            Billing=billing_receipt_table if billing_receipt_table else None,
                            Billpay_method=payment.get('Billpay_method', ''),
                            CardType=payment.get('CardType', ''),
                            BankName=payment.get('BankName', ''),
                            ChequeNo=payment.get('ChequeNo', ''),
                            paidamount=float(payment.get('paidamount', 0)),
                            Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                            transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else 0,
                        )
                    except Exception as e:
                        print(f"Warning: Error creating payment record {index}: {e}")

            # -----------------------------
            # 10. PRINT BILL IMMEDIATELY with error handling
            # -----------------------------
            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_items_list:

                    for idx, item in enumerate(bill_items_list):
                        if "BoxName" not in item:
                            print(f"Warning: BoxName missing in item index {idx}: {item}")

                    grn = GRN_Product_Item_Detials.objects.filter(
                    Product_Detials__ItemName=item["ItemName"]
                ).first()
                    items_list.append({
                        "name": item["ItemName"],
                        "batch": item["BatchNo"],
                        "expiry": item["Exp_Date"],
                        "qty": item["Billing_Quantity"],
                        "rate": float(item["Unit_Price"]),
                        "BoxName": str(item.get("BoxName", "")),

                        "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn and grn.Sellable_qty_price else 0,
                        "mrp": float(item["Amount"]),
                        "total": float(item["Total"])
                    })
                print('itemlist',items_list)
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
                    "patient_id": patient.PatientId,
                    "Bill_Status":new_bill_status,
                    "age": patient.Age,
                    "doctor_name":f"{doctor_instance.First_Name if doctor_instance else ''} {doctor_instance.Middle_Name if doctor_instance else ''} {doctor_instance.Last_Name if doctor_instance else ''}",
                    "gender": patient.Gender,
                    "invoice_no": billing.Billing_Invoice_No,
                    "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                    "date": billing_date_obj.strftime('%d/%m/%Y'),
                    "patient_phone": patient.PhoneNo,
                    "items": items_list,
                    "amount_words": num2words(billing.Net_Amount),
                    "gst": billing.Total_GSTAmount,
                    "billed_by": user_name,
                    "net_amount": billing.Net_Amount,
                    "gross_amount": billing.Total_Amount,
                }

                bill_text = Op_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)

                print("SYS-----11---", systemName)
                print(bill_text)
               


            except Exception as e:
                print(f"Warning: Error printing bill: {e}")
               

            return JsonResponse({
                'status': 'success',
                'message': 'OP Data saved and printed successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': billing_receipt_table.Voucher_Number if billing_receipt_table else None,
                'printJob': bill_text,
                         })

        except Exception as e:
            print(f"Critical error occurred: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            transaction.set_rollback(True)
            return JsonResponse({
                'error': f'Server error: {str(e)}',
                'type': type(e).__name__
            }, status=500)
 


@csrf_exempt
@require_http_methods(['POST'])
@transaction.atomic
def Walkin_OP_Pharmacy_Billing_link(request):
    if request.method == 'POST':
        try:
            print("========= WALKIN OP PHARMACY BILLING START =========")

            # JSON parsing helper
            def safe_json_parse(json_str, field_name, default_value=None):
                try:
                    if not json_str:
                        print(f"⚠️ {field_name} missing or empty, using default")
                        return default_value
                    parsed = json.loads(json_str)
                    print(f"✅ Parsed {field_name}")
                    return parsed
                except Exception as e:
                    print(f"❌ JSON parse error {field_name}: {e}")
                    return default_value

            # Parse POST data
            selected_patient_data = safe_json_parse(request.POST.get('SelectedPatient_list'), 'SelectedPatient_list', {})
            billpay_method = safe_json_parse(request.POST.get('Billpay_method'), 'Billpay_method', [])
            bill_Items = safe_json_parse(request.POST.get('Bill_Items'), 'Bill_Items', {})
            bill_itemtable = safe_json_parse(request.POST.get('Billing_itemtable'), 'Billing_itemtable', [])
            bill_text=""
            
            billing_date = request.POST.get('Billing_date')
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            # Paytype = request.POST.get('Paytype')
            Store_location = request.POST.get('StoreLocation')
            viewtype = request.POST.get('viewType')
            Remarks = request.POST.get('Remarks', '')
            patient_name = selected_patient_data.get('PatientName','')
            patient_phone = selected_patient_data.get('Patient_Phone', '')
            total_items = bill_Items.get('Total_Items', '0')
            total_qty = bill_Items.get('Total_Qty', '0')

            # Step 1: Parse date
            billing_date_obj = None
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
                try:
                    billing_date_obj = datetime.strptime(billing_date, fmt)
                    break
                except:
                    continue
            if not billing_date_obj:
                billing_date_obj = datetime.now()
                print("⚠️ Date parse failed, using current datetime")

            # Step 2: Fetch foreign keys, forcibly continue if missing
            doctor_instance = None
            patient = None
            registration = None
            location = None
            try: doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=selected_patient_data.get('Doctor_Id'))
            except: print("⚠️ Doctor not found")
            try: patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId'))
            except: print("⚠️ Patient not found")
            try: registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId'))
            except: print("⚠️ Registration not found")
            try: location = Location_Detials.objects.get(Location_Id=location_id)
            except: print("⚠️ Location not found")

            # Step 3: Billing totals
            discount_amount = float(bill_Items.get('Discount', 0))
            sgst_val = float(bill_Items.get('SGSTval', 0))
            cgst_val = float(bill_Items.get('CGSTval', 0))
            gst_amount = float(bill_Items.get('GSTAmount', 0))
            total_amount = float(bill_Items.get('Amount', 0))
            net_amount = float(bill_Items.get('totalAmount', 0))
            paid_amount = float(bill_Items.get('PaidAmount', 0))
            balance_amount = float(bill_Items.get('BalanceAmount', 0))
            round_off = float(bill_Items.get('Roundoff', 0))
       

            systemName = request.POST.get('systemName','')

            balance_amount = Decimal(balance_amount).quantize(Decimal('1'),rounding=ROUND_HALF_UP)
            new_bill_status = 'Paid' if balance_amount <= Decimal('0.00') else 'Due'
            # Step 0: Use name + phone for duplicate check
            patient_name_str = selected_patient_data.get("PatientName", "").strip()
            patient_phone_str = selected_patient_data.get("Patient_Phone", "").strip()
            net_amount_decimal = Decimal(str(bill_Items.get("totalAmount", "0")))

            # Convert billing date to date only
           
            billing_date_only = billing_date_obj.date()  # datetime -> date

            # Check for duplicate walk-in bill
            duplicate_bill = OP_Pharmacy_Billing_Table_Detials.objects.filter(
                Patient_name__iexact=patient_name_str,
                Billing_Date=billing_date_only,  # direct comparison
                Net_Amount=net_amount_decimal,
            )

            if duplicate_bill.exists() and request.POST.get("proceed_force") != "yes":
                last_invoice = duplicate_bill.order_by("-Billing_Invoice_No").first().Billing_Invoice_No
                return JsonResponse({
                    "status": "duplicate_detected",
                    "last_invoice": last_invoice,
                    "total": str(net_amount_decimal),
                })


            # Step 4: Create billing entry
            billing = OP_Pharmacy_Billing_Table_Detials.objects.create(
                Doctor_Id=doctor_instance,
                Patient_Id=patient,
                Billing_Date=billing_date_obj,
                Register_Id=registration,
                Billing_Type=viewtype,
                Patient_name=patient_name,
                # patient_phone=patient_phone,
                Total_Items=int(total_items),
                Total_Qty=int(total_qty),
                Discount_Amount=discount_amount,
                SGST_val=sgst_val,
                CGST_val=cgst_val,
                Total_GSTAmount=gst_amount,
                Total_Amount=total_amount,
                Net_Amount=net_amount,
                Paid_Amount=paid_amount,
                Balance_Amount=balance_amount,
                Round_Off=round_off,
                created_by=user_name,
                Location=location,
                Bill_Status=new_bill_status,
                Remarks=Remarks
            )
            print(f"✅ Billing entry created: {billing.Billing_Invoice_No}")


            # Step 5: Update prescriptions forcibly
            try:
                if patient:
                    OPD_Prescription_Details.objects.filter(Patient_Id__PatientId=patient.PatientId, Status=True)\
                        .update(Status=False, BillingStatus=new_bill_status)
                    print("✅ Prescriptions updated")
            except Exception as e:
                print(f"⚠️ Prescription update failed: {e}")

            # Step 6: Save billing items forcibly
            for index, item in enumerate(bill_itemtable):
                try:
                    stock = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=item.get('ItemName').strip(),
                            # Product_Detials__Status=True,
                            Store_location=Store_location,
                            Batch_No=item.get('BatchNo')
                        ).first()
                    if stock and stock.AvailableQuantity >= int(item.get('Billing_Quantity', 0)):
                        stock.AvailableQuantity -= int(item.get('Billing_Quantity', 0))
                        stock.save()
                    OP_BillingItem.objects.create(
                        Billing=billing,
                        ItemId=stock,
                        ItemName=item.get('ItemName', ''),
                        Billing_Quantity=int(item.get('Billing_Quantity', 0)),
                        BatchNo=item.get('BatchNo', ''),
                        Exp_Date=item.get('Exp_Date') or None,
                        Unit_Price=float(item.get('Unit_Price', 0)),
                        Amount=float(item.get('Amount', 0)),
                        Total=float(item.get('Total', 0))
                    )
                    print(f"✅ Billing item saved: {item.get('ItemName')}")
                except Exception as e:
                    print(f"⚠️ Item save failed: {e}")

            # Step 7: Receipt (forcibly save even if patient missing)
            try:
                billing_receipt_table = OPPharmacyBillingReceipt.objects.create(
                    Invoice_NO=billing,
                    PhoneNumber=selected_patient_data.get('PhoneNumber'),
                    Patient_Name=selected_patient_data.get('PatientName'),
                    TotalAmount=total_amount,
                    TotalPaidAmount=paid_amount,
                    BalanceAmount=balance_amount,
                    Billing_Date=billing_date_obj,
                    PaidAmount=paid_amount,
                    Billedby=user_name,
                )
                print(f"✅ Receipt created: {billing_receipt_table.Voucher_Number}")
            except Exception as e:
                billing_receipt_table = None
                print(f"⚠️ Receipt creation failed: {e}")

            # Step 8: Payments (forcibly save even if receipt missing)
            for pay in billpay_method:
                try:
                    OP_Pharmacy_Billing_Payments.objects.create(
                        Billing=billing_receipt_table,
                        Billpay_method=pay.get('Billpay_method', ''),
                        paidamount=float(pay.get('paidamount', 0)),
                    )
                    print(f"✅ Payment saved: {pay.get('Billpay_method')}")
                except Exception as e:
                    print(f"⚠️ Payment save failed: {e}")

            print("========= WALKIN OP PHARMACY BILLING END =========")
            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_itemtable:
                    grn = GRN_Product_Item_Detials.objects.filter(
                    Product_Detials__ItemName=item["ItemName"]
                ).first()
                    items_list.append({
                        "name": item["ItemName"],
                        "batch": item["BatchNo"],
                        "expiry": item["Exp_Date"],
                        "qty": item["Billing_Quantity"],
                        "rate": float(item["Unit_Price"]),
                        "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn and grn.Sellable_qty_price else 0,
                        "mrp": float(item["Amount"]),
                        "total": float(item["Total"])
                    })
                print('itemlist',items_list)
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": patient_name if patient_name else '',
                    "patient_id": patient.PatientId if patient and patient.PatientId else '',
                    "age": patient.Age if patient and patient.Age else '',
                    "gender": patient.Gender if patient and patient.Gender else '',
                    "invoice_no": billing.Billing_Invoice_No or '',
                    "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                    "date": billing_date_obj.strftime('%d/%m/%Y'),
                    "patient_phone": patient.PhoneNo if patient and patient.PhoneNo else '',
                    "items": items_list,
                    "amount_words": num2words(billing.Net_Amount),
                    "gst": billing.Total_GSTAmount,
                    "billed_by": user_name,
                    "net_amount": billing.Net_Amount,
                    "gross_amount": billing.Total_Amount,
                    "Bill_Status":new_bill_status,

                }

                bill_text = Op_walkin_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)

                print("SYS-----11---", systemName)
                print(bill_text)
                # if systemName:
                #     JOB = PrintJob.objects.create(
                #         system_name=systemName,
                #         bill_text=bill_text
                #     )
                #     JOB.save()
                #     print("Job Assigned To", JOB)


            except Exception as e:
                print(f"Warning: Error printing bill: {e}")
                # Don't fail the entire request if printing fails
            
            return JsonResponse({
                'status': 'success',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': getattr(billing_receipt_table, 'Voucher_Number', None),
                'printJob': bill_text,
                         })

        except Exception as e:
            import traceback
            print("💥 CRITICAL ERROR:", e)
            print(traceback.format_exc())
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(['POST'])
@transaction.atomic
def Walkin_OP_Pharmacy_Billing_link_optical(request):
    if request.method == 'POST':
        try:
            print("========= WALKIN OP PHARMACY BILLING START =========")

            # JSON parsing helper
            def safe_json_parse(json_str, field_name, default_value=None):
                try:
                    if not json_str:
                        print(f"⚠️ {field_name} missing or empty, using default")
                        return default_value
                    parsed = json.loads(json_str)
                    print(f"✅ Parsed {field_name}")
                    return parsed
                except Exception as e:
                    print(f"❌ JSON parse error {field_name}: {e}")
                    return default_value

            # Parse POST data
            selected_patient_data = safe_json_parse(request.POST.get('SelectedPatient_list'), 'SelectedPatient_list', {})
            billpay_method = safe_json_parse(request.POST.get('Billpay_method'), 'Billpay_method', [])
            bill_Items = safe_json_parse(request.POST.get('Bill_Items'), 'Bill_Items', {})
            bill_itemtable = safe_json_parse(request.POST.get('Billing_itemtable'), 'Billing_itemtable', [])
            bill_text=""
            
            billing_date = request.POST.get('Billing_date')
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            # Paytype = request.POST.get('Paytype')
            Store_location = request.POST.get('StoreLocation')
            viewtype = request.POST.get('viewType')
            Remarks = request.POST.get('Remarks', '')
            patient_name = selected_patient_data.get('PatientName','')
            patient_phone = selected_patient_data.get('Patient_Phone', '')
            total_items = bill_Items.get('Total_Items', '0')
            total_qty = bill_Items.get('Total_Qty', '0')

            # Step 1: Parse date
            billing_date_obj = None
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
                try:
                    billing_date_obj = datetime.strptime(billing_date, fmt)
                    break
                except:
                    continue
            if not billing_date_obj:
                billing_date_obj = datetime.now()
                print("⚠️ Date parse failed, using current datetime")

            # Step 2: Fetch foreign keys, forcibly continue if missing
            doctor_instance = None
            patient = None
            registration = None
            location = None
            try: doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=selected_patient_data.get('Doctor_Id'))
            except: print("⚠️ Doctor not found")
            try: patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId'))
            except: print("⚠️ Patient not found")
            try: registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId'))
            except: print("⚠️ Registration not found")
            try: location = Location_Detials.objects.get(Location_Id=location_id)
            except: print("⚠️ Location not found")

            # Step 3: Billing totals
            discount_amount = float(bill_Items.get('Discount', 0))
            sgst_val = float(bill_Items.get('SGSTval', 0))
            cgst_val = float(bill_Items.get('CGSTval', 0))
            gst_amount = float(bill_Items.get('GSTAmount', 0))
            total_amount = float(bill_Items.get('Amount', 0))
            net_amount = float(bill_Items.get('totalAmount', 0))
            paid_amount = float(bill_Items.get('PaidAmount', 0))
            balance_amount = float(bill_Items.get('BalanceAmount', 0))
            round_off = float(bill_Items.get('Roundoff', 0))
       

            systemName = request.POST.get('systemName','')

            balance_amount = Decimal(balance_amount).quantize(Decimal('1'),rounding=ROUND_HALF_UP)
            new_bill_status = 'Paid' if balance_amount <= Decimal('0.00') else 'Due'
            # Step 0: Use name + phone for duplicate check
            patient_name_str = selected_patient_data.get("PatientName", "").strip()
            patient_phone_str = selected_patient_data.get("Patient_Phone", "").strip()
            net_amount_decimal = Decimal(str(bill_Items.get("totalAmount", "0")))

            # Convert billing date to date only
           
            billing_date_only = billing_date_obj.date()  # datetime -> date

            # Check for duplicate walk-in bill
            duplicate_bill = OP_Pharmacy_Billing_Table_Detials_optical.objects.filter(
                Patient_name__iexact=patient_name_str,
                Billing_Date=billing_date_only,  # direct comparison
                Net_Amount=net_amount_decimal,
            )

            if duplicate_bill.exists() and request.POST.get("proceed_force") != "yes":
                last_invoice = duplicate_bill.order_by("-Billing_Invoice_No").first().Billing_Invoice_No
                return JsonResponse({
                    "status": "duplicate_detected",
                    "last_invoice": last_invoice,
                    "total": str(net_amount_decimal),
                })


            # Step 4: Create billing entry
            billing = OP_Pharmacy_Billing_Table_Detials_optical.objects.create(
                Doctor_Id=doctor_instance,
                Patient_Id=patient,
                Billing_Date=billing_date_obj,
                Register_Id=registration,
                Billing_Type=viewtype,
                Patient_name=patient_name,
           
                Total_Items=int(total_items),
                Total_Qty=int(total_qty),
                Discount_Amount=discount_amount,
                SGST_val=sgst_val,
                CGST_val=cgst_val,
                Total_GSTAmount=gst_amount,
                Total_Amount=total_amount,
                Net_Amount=net_amount,
                Paid_Amount=paid_amount,
                Balance_Amount=balance_amount,
                Round_Off=round_off,
                created_by=user_name,
                Location=location,
                Bill_Status=new_bill_status,
                Remarks=Remarks
            )
            print(f"✅ Billing entry created: {billing.Billing_Invoice_No}")


            # Step 5: Update prescriptions forcibly
            try:
                if patient:
                    OPD_Prescription_Details.objects.filter(Patient_Id__PatientId=patient.PatientId, Status=True)\
                        .update(Status=False, BillingStatus=new_bill_status)
                    print("✅ Prescriptions updated")
            except Exception as e:
                print(f"⚠️ Prescription update failed: {e}")

            # Step 6: Save billing items forcibly
            for index, item in enumerate(bill_itemtable):
                try:
                    exp = item.get('Exp_Date', '').strip()

                    # Validate expiry date
                    if exp in ["", "-", "–", None]:
                        exp_date = None
                    else:
                        try:
                            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
                                try:
                                    exp_date = datetime.strptime(exp, fmt).date()
                                    break
                                except:
                                    continue
                            else:
                                exp_date = None  # fallback if format failed
                        except:
                            exp_date = None

                    stock = Stock_Maintance_Table_Detials.objects.filter(
                        Product_Detials__ItemName=item.get('ItemName').strip(),
                        Store_location=Store_location
                    ).first()

                    qty = int(item.get('Billing_Quantity', 0))

                    if stock and stock.AvailableQuantity >= qty:
                        stock.AvailableQuantity -= qty
                        stock.save()

                    OP_BillingItemoptical.objects.create(
                        Billing=billing,
                        ItemId=stock,
                        ItemName=item.get('ItemName', ''),
                        Billing_Quantity=qty,
                        BatchNo=item.get('BatchNo', ''),
                        Exp_Date=exp_date,  # << SAFE DATE VALUE
                        Unit_Price=float(item.get('Unit_Price', 0)),
                        Amount=float(item.get('Amount', 0)),
                        Total=float(item.get('Total', 0))
                    )
                    print(f"✅ Billing item saved: {item.get('ItemName')}")

                except Exception as e:
                    print(f"⚠️ Item save failed: {e}")


            # Step 7: Receipt (forcibly save even if patient missing)
            try:
                billing_receipt_table = OPPharmacyBillingReceiptoptical.objects.create(
                    Invoice_NO=billing,
                    PhoneNumber=selected_patient_data.get('PhoneNumber'),
                    Patient_Name=selected_patient_data.get('PatientName'),
                    TotalAmount=total_amount,
                    TotalPaidAmount=paid_amount,
                    BalanceAmount=balance_amount,
                    Billing_Date=billing_date_obj,
                    PaidAmount=paid_amount,
                    Billedby=user_name,
                )
                print(f"✅ Receipt created: {billing_receipt_table.Voucher_Number}")
            except Exception as e:
                billing_receipt_table = None
                print(f"⚠️ Receipt creation failed: {e}")

            # Step 8: Payments (forcibly save even if receipt missing)
            for pay in billpay_method:
                try:
                    OP_Pharmacy_Billing_Payments_optical.objects.create(
                        Billing=billing_receipt_table,
                        Billpay_method=pay.get('Billpay_method', ''),
                        paidamount=float(pay.get('paidamount', 0)),
                    )
                    print(f"✅ Payment saved: {pay.get('Billpay_method')}")
                except Exception as e:
                    print(f"⚠️ Payment save failed: {e}")

            print("========= WALKIN OP PHARMACY BILLING END =========")
            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_itemtable:
                    grn = GRN_Product_Item_Detials.objects.filter(
                    Product_Detials__ItemName=item["ItemName"]
                ).first()
                    items_list.append({
                        "name": item["ItemName"],
                        "batch": item["BatchNo"],
                        "expiry": item["Exp_Date"],
                        "qty": item["Billing_Quantity"],
                        "rate": float(item["Unit_Price"]),
                        "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn and grn.Sellable_qty_price else 0,
                        "mrp": float(item["Amount"]),
                        "total": float(item["Total"])
                    })
                print('itemlist',items_list)
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": patient_name if patient_name else '',
                    "patient_id": patient.PatientId if patient and patient.PatientId else '',
                    "age": patient.Age if patient and patient.Age else '',
                    "gender": patient.Gender if patient and patient.Gender else '',
                    "invoice_no": billing.Billing_Invoice_No or '',
                    "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                    "date": billing_date_obj.strftime('%d/%m/%Y'),
                    "patient_phone": patient.PhoneNo if patient and patient.PhoneNo else '',
                    "items": items_list,
                    "amount_words": num2words(billing.Net_Amount),
                    "gst": billing.Total_GSTAmount,
                    "billed_by": user_name,
                    "net_amount": billing.Net_Amount,
                    "gross_amount": billing.Total_Amount,
                    "Bill_Status":new_bill_status,

                }

                bill_text = Op_walkin_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)

                print("SYS-----11---", systemName)
                print(bill_text)
            


            except Exception as e:
                print(f"Warning: Error printing bill: {e}")
                # Don't fail the entire request if printing fails
            
            return JsonResponse({
                'status': 'success',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': getattr(billing_receipt_table, 'Voucher_Number', None),
                'printJob': bill_text,
                         })

        except Exception as e:
            import traceback
            print("💥 CRITICAL ERROR:", e)
            print(traceback.format_exc())
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)




        
from num2words import num2words

# @csrf_exempt
# @require_http_methods(['POST','GET'])
# def OP_Pharmacy_Due_Billing_link(request):
#     if request.method == 'POST':
#         try:
#             # Extract main billing data
#             selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
#             billing_date = request.POST.get('Billing_date')
#             billpay_method = json.loads(request.POST.get('Billpay_method'))
#             bill_Items = json.loads(request.POST.get('Bill_Items',{}))
#             bill_summary = json.loads(request.POST.get('Bill_Items', '{}'))
#             bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))

#             user_name = request.POST.get('User_Name')
#             location_id = request.POST.get('location')
#             # bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
#             # Extract PDF data
#             pdf_data = request.FILES.get('pdfData')
#             editid = request.POST.get('EditDue','')
#             Paytype = request.POST.get('Paytype','')
#             systemName = request.POST.get('systemName','')

#             # Debug output to ensure data is received correctly
#             print('Selected Patient Data:', selected_patient_data)
#             print('Billing Date:', billing_date)
#             print('Billing Method:', billpay_method)
#             print('Bill_Items:', bill_Items)
#             print('PDF Data:', pdf_data)
#             # print("Billing Item Table:", bill_itemtable)
#             # Fetch related foreign key objects
#             try:
#                 doctor_id = selected_patient_data.get('Doctor_Id','')
#                 doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None                
#                 print('Doctor:', doctor_instance)
#             except ObjectDoesNotExist:
#                 return JsonResponse({'error': 'Doctor not found'})

#             try:
#                 patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId')) if selected_patient_data.get('PatientId') else None
#                 print('Patient:', patient)
#             except ObjectDoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'})
#             try:
#                 registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId')) if selected_patient_data.get('RegistrationId') else None
#                 print('registration:', registration)
#             except ObjectDoesNotExist:
#                 return JsonResponse({'error': 'Registration Id not found'})

#             try:
#                 location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
#                 print('Location:', location)
#             except ObjectDoesNotExist:
#                 return JsonResponse({'error': 'Location not found'})
#             print('111111111111')
#             # Parse billing item details with safe integer and float conversion
#             try:
#                 discount_amount = float(bill_Items.get('Discount', 0))
#                 sgst_val = float(bill_Items.get('SGSTval', 0))
#                 cgst_val = float(bill_Items.get('CGSTval', 0))
#                 gst_amount = float(bill_Items.get('GSTAmount', 0))
                
#                 total_items = int(bill_Items.get('totalItems', 0))
#                 total_qty = int(bill_Items.get('totalQty', 0))
#                 total_amount = float(bill_Items.get('Amount', 0))
#                 net_amount = float(bill_Items.get('totalAmount', 0))
#                 paid_amount = float(bill_Items.get('PaidAmount', 0))
#                 balance_amount = float(bill_Items.get('BalanceAmount', 0))
#                 round_off = float(bill_Items.get('Roundoff', 0))
#             except ValueError as ve:
#                 print(f"Invalid value in Bill_Items: {ve}")
#                 return JsonResponse({'error': 'Invalid value in Bill_Items'})

#             print('22222222222')
#             new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'

#             if editid:
#                 # Create the main billing entry
#                 billing = OP_Pharmacy_Billing_Table_Detials.objects.get(Billing_Invoice_No=editid)
                
#                 # Corrected line: Removed the trailing comma
#                 billing.Paid_Amount += Decimal(paid_amount)
#                 billing.Balance_Amount -= Decimal(balance_amount)
#                 billing.Bill_Status = new_bill_status
                
#                 # Save the updated billing object
#                 billing.save()
                
#                 print('billingggg', billing)


#             recipetbill = None
#             billing_receipt_table = OPPharmacyBillingReceipt(
#                 Invoice_NO=billing,
#                 PatientID=patient.PatientId,
#                 PhoneNumber=patient.PhoneNo,
#                 NewPayment= "DuePayment",
#                 Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
#                 TotalAmount= total_amount,
#                 TotalPaidAmount= paid_amount,
#                 BalanceAmount= balance_amount,
#                 Billing_Date=billing_date,
#                 PaidAmount= paid_amount,
#                 Billedby=user_name,
#             )
#             billing_receipt_table.save()
#             recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
#             # Save each payment method
#             for payment in billpay_method:
#                 payment_bill = OP_Pharmacy_Billing_Payments.objects.create(
#                     Billing=billing_receipt_table if billing_receipt_table else None,
#                     Billpay_method=payment.get('Billpay_method', ''),
#                     CardType=payment.get('CardType', ''),
#                     BankName=payment.get('BankName', ''),
#                     ChequeNo=payment.get('ChequeNo', ''),
#                     paidamount=float(payment.get('paidamount', 0)),
#                     Additionalamount=float(payment.get('Additionalamount', 0), ) if payment.get('Additionalamount') else 0,
#                     transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else 0,
#                 )
#                 payment_bill.save()

# #             try:
# #                 printer_name = "TVS MSP 250 Star"

# #                 bill_data = {
# #                     "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
# #                     "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
# #                     "patient_id": patient.PatientId,
# #                     "age": patient.Age,
# #                     "gender": patient.Gender,
# #                     "invoice_no": billing.Billing_Invoice_No,
# #                     "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
# #                     "date": billing_date,
# #                     "patient_phone": patient.PhoneNo,
# #                     "items": [
# #     {
# #         "name": item.get("ItemName", ""),
# #         "batch": item.get("BatchNo", ""),
# #         "expiry": item.get("Exp_Date", ""),
# #         "qty": item.get("Billing_Quantity", 0),
# #         "rate": float(item.get("Unit_Price", 0)),
# #         "mrp": float(item.get("Amount", 0)),
# #         "total": float(item.get("Total", 0))
# #     }
# #     for item in bill_itemtable
# # ],

# #                     "amount_words": num2words(billing.Net_Amount),
# #                     "gst": billing.Total_GSTAmount,
# #                     "billed_by": user_name,
# #                     "net_amount": billing.Net_Amount,
# #                     "gross_amount": billing.Total_Amount,
# #                 }

# #                 # bill_text = format_bill(bill_data)
# #                 bill_text = Op_Due_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)
    
    
    
# #                 print("Dot-Matrix",bill_text)
# #                 if systemName:
# #                     print("SYS--------",systemName)
# #                     JOB = PrintJob.objects.create(
# #                         system_name = systemName,
# #                         bill_text= bill_text
# #                     )
# #                     JOB.save()
# #                     print("Job Assigned To",JOB)
 
 
 

# #                 hPrinter = win32print.OpenPrinter(printer_name)
# #                 try:
# #                     hJob = win32print.StartDocPrinter(hPrinter, 1, ("OP Bill", None, "RAW"))
# #                     win32print.StartPagePrinter(hPrinter)
# #                     win32print.WritePrinter(hPrinter, bill_text.encode('ascii', errors='replace'))
# #                     win32print.EndPagePrinter(hPrinter)
# #                     win32print.EndDocPrinter(hPrinter)
# #                     print("Bill printed successfully")
# #                 finally:
# #                     win32print.ClosePrinter(hPrinter)
# #             except Exception as e:
# #                 print(f"Warning: Error printing bill: {e}")
#             return JsonResponse({'status': 'success', 'message': 'OP Data saved successfully','ReceiptNo':recipetbill})

#         except Exception as e:
#             print(f"Error occurred: {e}")
#             return JsonResponse({'error': str(e)})  
    
    
#     elif request.method == 'GET':
#         try:
#             SearchbyDate = request.GET.get('SearchbyDate')
#             SearchbyFirstName = request.GET.get('SearchbyFirstName')
#             SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')
#             SearchTimeOrderby = request.GET.get('SearchTimeOrderby')
#             status_filter = request.GET.get('SearchStatus')

#             print('status_filter:', status_filter)
            
#             # Build dynamic filter query
#             search_query = Q()
#             if SearchbyFirstName:
#                 search_query &= (  Q(Patient_Id__FirstName__icontains=SearchbyFirstName)|
#                                    Q(Patient_Id__PatientId__icontains=SearchbyFirstName)|
#                                     Q(Patient_name__icontains=SearchbyFirstName) |         
#                         Q(Billing_Invoice_No__iexact=f"""{'OP/'}{SearchbyFirstName}""")
#                         )
                                 


                
#             if SearchbyPhoneNumber:
#                 search_query &= Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyPhoneNumber)
#             if SearchbyDate:
#                 search_query &= Q(Billing_Date__icontains=SearchbyDate)
#             if status_filter:
#                 search_query &= Q(Bill_Status=status_filter)

#             general_billing_data = OP_Pharmacy_Billing_Table_Detials.objects.filter(search_query).order_by("-created_at")
#             print('due', general_billing_data)

#             response_data = []

#             for row in general_billing_data:
#                 patient = getattr(row, 'Patient_Id', None)
#                 register = getattr(row, 'Register_Id', None)
#                 doctor = getattr(row, 'Doctor_Id', None)

#                 # Doctor details
#                 if doctor:
#                     doctor_id = getattr(doctor, 'Doctor_ID', '')
#                     doctor_name = f"{getattr(doctor.Tittle, 'Title_Name', '')}.{getattr(doctor, 'First_Name', '')} {getattr(doctor, 'Middle_Name', '')} {getattr(doctor, 'Last_Name', '')}".strip()
#                 else:
#                     doctor_id = ''
#                     doctor_name = ''

#                 # Patient details
#                 if patient:
#                     full_name = f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'MiddleName', '')} {getattr(patient, 'SurName', '')}".strip()
#                     patient_id = getattr(patient, 'PatientId', '')
#                     patient_phone = getattr(patient, 'PhoneNo', '')
#                     gender = getattr(patient, 'Gender', '')
#                     city = getattr(patient, 'City', '')
#                     state = getattr(patient, 'State', '')
#                     pincode = getattr(patient, 'Pincode', '')
#                     age = getattr(patient, 'Age', '')
#                 else:
#                     full_name = ''
#                     patient_id = ''
#                     patient_phone = ''
#                     gender = ''
#                     city = ''
#                     state = ''
#                     pincode = ''
#                     age = ''

#                 # Registration details
#                 if register:
#                     reg_id = getattr(register, 'Registration_Id', '')
#                     patient_category = getattr(register, 'PatientCategory', '')
#                     visit_id = getattr(register, 'VisitId', '')
#                     insurance = getattr(register, 'InsuranceName', None)
#                     client = getattr(register, 'ClientName', None)
#                     if patient_category == 'Insurance':
#                         patient_category_name = getattr(insurance, 'Insurance_Name', '')
#                     elif patient_category == 'Client':
#                         patient_category_name = getattr(client, 'Client_Name', '')
#                     else:
#                         patient_category_name = ''
#                 else:
#                     reg_id = ''
#                     patient_category = ''
#                     visit_id = ''
#                     patient_category_name = ''

#                 full_date = row.created_at.strftime("%Y-%m-%d") if getattr(row, 'created_at', None) else ''
#                 age_gender = f"{age}/{gender}" if age or gender else ''

#                 address_parts = [
#                     getattr(patient, 'DoorNo', ''),
#                     getattr(patient, 'Street', ''),
#                     getattr(patient, 'Area', ''),
#                     city,
#                     state,
#                     getattr(patient, 'Country', ''),
#                     pincode
#                 ] if patient else []

#                 address = ", ".join([part for part in address_parts if part])

#                 billing_details = {
#                     'id': getattr(row, 'Billing_Invoice_No', ''),
#                     'Type': 'PharmacyDue',
#                     'Billing_Date': getattr(row, 'Billing_Date', ''),
#                     'Doctor_Id': doctor_id,
#                     'Doctor_Name': doctor_name,
#                     'PatientId': patient_id,
#                     'Patient_Name': full_name,
#                     'PhoneNo': patient_phone,
#                     'Register_Id': reg_id,
#                     'Gender': gender,
#                     'City': city,
#                     'State': state,
#                     'Pincode': pincode,
#                     'AgeGender': age_gender,
#                     'Address': address,
#                     'PatientCategory': patient_category,
#                     'PatientCategoryName': patient_category_name,
#                     'Visit_Id': visit_id,
#                     'Billing_Type': getattr(row, 'Billing_Type', ''),
#                     'TotalItems': getattr(row, 'Total_Items', 0),
#                     'TotalQty': getattr(row, 'Total_Qty', 0),
#                     'RoundOff': getattr(row, 'Round_Off', 0),
#                     'TotalAmount': getattr(row, 'Total_Amount', 0),
#                     'Net_Amount': getattr(row, 'Net_Amount', 0),
#                     'PaidAmount': getattr(row, 'Paid_Amount', 0),
#                     'BalanceAmount': getattr(row, 'Balance_Amount', 0),
#                     'Bill_Status': getattr(row, 'Bill_Status', ''),
#                     'Date': full_date,
#                 }

#                 response_data.append(billing_details)

#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             print(f"Error in GET: {e}")
#             return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['POST','GET'])
def OP_Pharmacy_Due_Billing_link(request):
    if request.method == 'POST':
        try:
            # Extract main billing data
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            bill_summary = json.loads(request.POST.get('Bill_Items', '{}'))
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))

            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            # bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            # Extract PDF data
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditDue','')
            Paytype = request.POST.get('Paytype','')
            systemName = request.POST.get('systemName','')

            # Debug output to ensure data is received correctly
            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            # print("Billing Item Table:", bill_itemtable)
            # Fetch related foreign key objects
            try:
                doctor_id = selected_patient_data.get('Doctor_Id','')
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None                
                print('Doctor:', doctor_instance)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId')) if selected_patient_data.get('PatientId') else None
                print('Patient:', patient)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            try:
                registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId')) if selected_patient_data.get('RegistrationId') else None
                print('registration:', registration)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration Id not found'})

            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            print('111111111111')
            # Parse billing item details with safe integer and float conversion
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222222')
            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'

            if editid:
                # Create the main billing entry
                billing = OP_Pharmacy_Billing_Table_Detials.objects.get(Billing_Invoice_No=editid)
                
                # Corrected line: Removed the trailing comma
                billing.Paid_Amount += Decimal(paid_amount)
                billing.Balance_Amount -= Decimal(balance_amount)
                billing.Bill_Status = new_bill_status
                
                # Save the updated billing object
                billing.save()
                
                print('billingggg', billing)


            recipetbill = None
            billing_receipt_table = OPPharmacyBillingReceipt(
                Invoice_NO=billing,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "DuePayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount= total_amount,
                TotalPaidAmount= paid_amount,
                BalanceAmount= balance_amount,
                Billing_Date=billing_date,
                PaidAmount= paid_amount,
                Billedby=user_name,
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
            # Save each payment method
            for payment in billpay_method:
                payment_bill = OP_Pharmacy_Billing_Payments.objects.create(
                    Billing=billing_receipt_table if billing_receipt_table else None,
                    Billpay_method=payment.get('Billpay_method', ''),
                    CardType=payment.get('CardType', ''),
                    BankName=payment.get('BankName', ''),
                    ChequeNo=payment.get('ChequeNo', ''),
                    paidamount=float(payment.get('paidamount', 0)),
                    Additionalamount=float(payment.get('Additionalamount', 0), ) if payment.get('Additionalamount') else 0,
                    transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else 0,
                )
                payment_bill.save()

#             try:
#                 printer_name = "TVS MSP 250 Star"

#                 bill_data = {
#                     "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
#                     "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
#                     "patient_id": patient.PatientId,
#                     "age": patient.Age,
#                     "gender": patient.Gender,
#                     "invoice_no": billing.Billing_Invoice_No,
#                     "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
#                     "date": billing_date,
#                     "patient_phone": patient.PhoneNo,
#                     "items": [
#     {
#         "name": item.get("ItemName", ""),
#         "batch": item.get("BatchNo", ""),
#         "expiry": item.get("Exp_Date", ""),
#         "qty": item.get("Billing_Quantity", 0),
#         "rate": float(item.get("Unit_Price", 0)),
#         "mrp": float(item.get("Amount", 0)),
#         "total": float(item.get("Total", 0))
#     }
#     for item in bill_itemtable
# ],

#                     "amount_words": num2words(billing.Net_Amount),
#                     "gst": billing.Total_GSTAmount,
#                     "billed_by": user_name,
#                     "net_amount": billing.Net_Amount,
#                     "gross_amount": billing.Total_Amount,
#                 }

#                 # bill_text = format_bill(bill_data)
#                 bill_text = Op_Due_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)
    
    
    
#                 print("Dot-Matrix",bill_text)
#                 if systemName:
#                     print("SYS--------",systemName)
#                     JOB = PrintJob.objects.create(
#                         system_name = systemName,
#                         bill_text= bill_text
#                     )
#                     JOB.save()
#                     print("Job Assigned To",JOB)
 
 
 

#                 hPrinter = win32print.OpenPrinter(printer_name)
#                 try:
#                     hJob = win32print.StartDocPrinter(hPrinter, 1, ("OP Bill", None, "RAW"))
#                     win32print.StartPagePrinter(hPrinter)
#                     win32print.WritePrinter(hPrinter, bill_text.encode('ascii', errors='replace'))
#                     win32print.EndPagePrinter(hPrinter)
#                     win32print.EndDocPrinter(hPrinter)
#                     print("Bill printed successfully")
#                 finally:
#                     win32print.ClosePrinter(hPrinter)
#             except Exception as e:
#                 print(f"Warning: Error printing bill: {e}")
            return JsonResponse({'status': 'success', 'message': 'OP Data saved successfully','ReceiptNo':recipetbill})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
    
    
    elif request.method == 'GET':
        try:
            SearchbyDate = request.GET.get('SearchbyDate')
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')
            SearchTimeOrderby = request.GET.get('SearchTimeOrderby')
            status_filter = request.GET.get('SearchStatus')

            print('status_filter:', status_filter)
            
            # Build dynamic filter query
            search_query = Q()
            if SearchbyFirstName:
                search_query &= (  Q(Patient_Id__FirstName__icontains=SearchbyFirstName)|
                                   Q(Patient_Id__PatientId__icontains=SearchbyFirstName)|
                                    Q(Patient_name__icontains=SearchbyFirstName) |         
                        Q(Billing_Invoice_No__iexact=f"""{'OP/'}{SearchbyFirstName}""")
                        )
                                 


                
            if SearchbyPhoneNumber:
                search_query &= Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyPhoneNumber)
            if SearchbyDate:
                search_query &= Q(Billing_Date__icontains=SearchbyDate)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            general_billing_data = OP_Pharmacy_Billing_Table_Detials.objects.filter(search_query).order_by("-created_at")
            print('due', general_billing_data)

            response_data = []

            for row in general_billing_data:
                patient = getattr(row, 'Patient_Id', None)
                register = getattr(row, 'Register_Id', None)
                doctor = getattr(row, 'Doctor_Id', None)

                # Doctor details
                if doctor:
                    doctor_id = getattr(doctor, 'Doctor_ID', '')
                    doctor_name = f"{getattr(doctor.Tittle, 'Title_Name', '')}.{getattr(doctor, 'First_Name', '')} {getattr(doctor, 'Middle_Name', '')} {getattr(doctor, 'Last_Name', '')}".strip()
                else:
                    doctor_id = ''
                    doctor_name = ''

                # Patient details
                if patient:
                    full_name = f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'MiddleName', '')} {getattr(patient, 'SurName', '')}".strip()
                    patient_id = getattr(patient, 'PatientId', '')
                    patient_phone = getattr(patient, 'PhoneNo', '')
                    gender = getattr(patient, 'Gender', '')
                    city = getattr(patient, 'City', '')
                    state = getattr(patient, 'State', '')
                    pincode = getattr(patient, 'Pincode', '')
                    age = getattr(patient, 'Age', '')
                else:
                    full_name = ''
                    patient_id = ''
                    patient_phone = ''
                    gender = ''
                    city = ''
                    state = ''
                    pincode = ''
                    age = ''

                # Registration details
                if register:
                    reg_id = getattr(register, 'Registration_Id', '')
                    patient_category = getattr(register, 'PatientCategory', '')
                    visit_id = getattr(register, 'VisitId', '')
                    insurance = getattr(register, 'InsuranceName', None)
                    client = getattr(register, 'ClientName', None)
                    if patient_category == 'Insurance':
                        patient_category_name = getattr(insurance, 'Insurance_Name', '')
                    elif patient_category == 'Client':
                        patient_category_name = getattr(client, 'Client_Name', '')
                    else:
                        patient_category_name = ''
                else:
                    reg_id = ''
                    patient_category = ''
                    visit_id = ''
                    patient_category_name = ''

                full_date = row.created_at.strftime("%Y-%m-%d") if getattr(row, 'created_at', None) else ''
                age_gender = f"{age}/{gender}" if age or gender else ''

                address_parts = [
                    getattr(patient, 'DoorNo', ''),
                    getattr(patient, 'Street', ''),
                    getattr(patient, 'Area', ''),
                    city,
                    state,
                    getattr(patient, 'Country', ''),
                    pincode
                ] if patient else []

                address = ", ".join([part for part in address_parts if part])

                billing_details = {
                    'id': getattr(row, 'Billing_Invoice_No', ''),
                    'Type': 'PharmacyDue',
                    'Billing_Date': getattr(row, 'Billing_Date', ''),
                    'Doctor_Id': doctor_id,
                    'Doctor_Name': doctor_name,
                    'PatientId': patient_id,
                    'Patient_Name': full_name,
                    'PhoneNo': patient_phone,
                    'Register_Id': reg_id,
                    'Gender': gender,
                    'City': city,
                    'State': state,
                    'Pincode': pincode,
                    'AgeGender': age_gender,
                    'Address': address,
                    'PatientCategory': patient_category,
                    'PatientCategoryName': patient_category_name,
                    'Visit_Id': visit_id,
                    'Billing_Type': getattr(row, 'Billing_Type', ''),
                    'TotalItems': getattr(row, 'Total_Items', 0),
                    'TotalQty': getattr(row, 'Total_Qty', 0),
                    'RoundOff': getattr(row, 'Round_Off', 0),
                    'TotalAmount': getattr(row, 'Total_Amount', 0),
                    'Net_Amount': getattr(row, 'Net_Amount', 0),
                    'PaidAmount': getattr(row, 'Paid_Amount', 0),
                    'BalanceAmount': getattr(row, 'Balance_Amount', 0),
                    'Bill_Status': getattr(row, 'Bill_Status', ''),
                    'Date': full_date,
                }

                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"Error in GET: {e}")
            return JsonResponse({'error': str(e)})





@csrf_exempt
@require_http_methods(['POST','GET'])
def Optical_Pharmacy_Due_Billing_link(request):
    if request.method == 'POST':
        try:
            # Extract main billing data
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            bill_summary = json.loads(request.POST.get('Bill_Items', '{}'))
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))

            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            # bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            # Extract PDF data
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditDue','')
            Paytype = request.POST.get('Paytype','')
            systemName = request.POST.get('systemName','')

            # Debug output to ensure data is received correctly
            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            # print("Billing Item Table:", bill_itemtable)
            # Fetch related foreign key objects
            try:
                doctor_id = selected_patient_data.get('Doctor_Id','')
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None                
                print('Doctor:', doctor_instance)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=selected_patient_data.get('PatientId')) if selected_patient_data.get('PatientId') else None
                print('Patient:', patient)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            try:
                registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=selected_patient_data.get('RegistrationId')) if selected_patient_data.get('RegistrationId') else None
                print('registration:', registration)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration Id not found'})

            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            print('111111111111')
            # Parse billing item details with safe integer and float conversion
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222222')
            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'

            if editid:
                # Create the main billing entry
                billing = OP_Pharmacy_Billing_Table_Detials_optical.objects.get(Billing_Invoice_No=editid)
                
                # Corrected line: Removed the trailing comma
                billing.Paid_Amount += Decimal(paid_amount)
                billing.Balance_Amount -= Decimal(balance_amount)
                billing.Bill_Status = new_bill_status
                
                # Save the updated billing object
                billing.save()
                
                print('billingggg', billing)


            recipetbill = None
            billing_receipt_table = OPPharmacyBillingReceiptoptical(
                Invoice_NO=billing,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "DuePayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount= total_amount,
                TotalPaidAmount= paid_amount,
                BalanceAmount= balance_amount,
                Billing_Date=billing_date,
                PaidAmount= paid_amount,
                Billedby=user_name,
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
            # Save each payment method
            for payment in billpay_method:
                payment_bill = OP_Pharmacy_Billing_Payments_optical.objects.create(
                    Billing=billing_receipt_table if billing_receipt_table else None,
                    Billpay_method=payment.get('Billpay_method', ''),
                    CardType=payment.get('CardType', ''),
                    BankName=payment.get('BankName', ''),
                    ChequeNo=payment.get('ChequeNo', ''),
                    paidamount=float(payment.get('paidamount', 0)),
                    Additionalamount=float(payment.get('Additionalamount', 0), ) if payment.get('Additionalamount') else 0,
                    transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else 0,
                )
                payment_bill.save()


            return JsonResponse({'status': 'success', 'message': 'OP Data saved successfully','ReceiptNo':recipetbill})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
    
    
    elif request.method == 'GET':
        try:
            SearchbyDate = request.GET.get('SearchbyDate')
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')
            SearchTimeOrderby = request.GET.get('SearchTimeOrderby')
            status_filter = request.GET.get('SearchStatus')

            print('status_filter:', status_filter)
            
            # Build dynamic filter query
            search_query = Q()
            if SearchbyFirstName:
                search_query &= (  Q(Patient_Id__FirstName__icontains=SearchbyFirstName)|
                                   Q(Patient_Id__PatientId__icontains=SearchbyFirstName)|
                                    Q(Patient_name__icontains=SearchbyFirstName) |         
                        Q(Billing_Invoice_No__iexact=f"""{'OP/'}{SearchbyFirstName}""")
                        )
                                 


                
            if SearchbyPhoneNumber:
                search_query &= Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyPhoneNumber)
            if SearchbyDate:
                search_query &= Q(Billing_Date__icontains=SearchbyDate)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            general_billing_data = OP_Pharmacy_Billing_Table_Detials_optical.objects.filter(search_query).order_by("-created_at")
            print('due', general_billing_data)

            response_data = []

            for row in general_billing_data:
                patient = getattr(row, 'Patient_Id', None)
                register = getattr(row, 'Register_Id', None)
                doctor = getattr(row, 'Doctor_Id', None)

                # Doctor details
                if doctor:
                    doctor_id = getattr(doctor, 'Doctor_ID', '')
                    doctor_name = f"{getattr(doctor.Tittle, 'Title_Name', '')}.{getattr(doctor, 'First_Name', '')} {getattr(doctor, 'Middle_Name', '')} {getattr(doctor, 'Last_Name', '')}".strip()
                else:
                    doctor_id = ''
                    doctor_name = ''

                # Patient details
                if patient:
                    full_name = f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'MiddleName', '')} {getattr(patient, 'SurName', '')}".strip()
                    patient_id = getattr(patient, 'PatientId', '')
                    patient_phone = getattr(patient, 'PhoneNo', '')
                    gender = getattr(patient, 'Gender', '')
                    city = getattr(patient, 'City', '')
                    state = getattr(patient, 'State', '')
                    pincode = getattr(patient, 'Pincode', '')
                    age = getattr(patient, 'Age', '')
                else:
                    full_name = ''
                    patient_id = ''
                    patient_phone = ''
                    gender = ''
                    city = ''
                    state = ''
                    pincode = ''
                    age = ''

                # Registration details
                if register:
                    reg_id = getattr(register, 'Registration_Id', '')
                    patient_category = getattr(register, 'PatientCategory', '')
                    visit_id = getattr(register, 'VisitId', '')
                    insurance = getattr(register, 'InsuranceName', None)
                    client = getattr(register, 'ClientName', None)
                    if patient_category == 'Insurance':
                        patient_category_name = getattr(insurance, 'Insurance_Name', '')
                    elif patient_category == 'Client':
                        patient_category_name = getattr(client, 'Client_Name', '')
                    else:
                        patient_category_name = ''
                else:
                    reg_id = ''
                    patient_category = ''
                    visit_id = ''
                    patient_category_name = ''

                full_date = row.created_at.strftime("%Y-%m-%d") if getattr(row, 'created_at', None) else ''
                age_gender = f"{age}/{gender}" if age or gender else ''

                address_parts = [
                    getattr(patient, 'DoorNo', ''),
                    getattr(patient, 'Street', ''),
                    getattr(patient, 'Area', ''),
                    city,
                    state,
                    getattr(patient, 'Country', ''),
                    pincode
                ] if patient else []

                address = ", ".join([part for part in address_parts if part])

                billing_details = {
                    'id': getattr(row, 'Billing_Invoice_No', ''),
                    'Type': 'PharmacyDue',
                    'Billing_Date': getattr(row, 'Billing_Date', ''),
                    'Doctor_Id': doctor_id,
                    'Doctor_Name': doctor_name,
                    'PatientId': patient_id,
                    'Patient_Name': full_name,
                    'PhoneNo': patient_phone,
                    'Register_Id': reg_id,
                    'Gender': gender,
                    'City': city,
                    'State': state,
                    'Pincode': pincode,
                    'AgeGender': age_gender,
                    'Address': address,
                    'PatientCategory': patient_category,
                    'PatientCategoryName': patient_category_name,
                    'Visit_Id': visit_id,
                    'Billing_Type': getattr(row, 'Billing_Type', ''),
                    'TotalItems': getattr(row, 'Total_Items', 0),
                    'TotalQty': getattr(row, 'Total_Qty', 0),
                    'RoundOff': getattr(row, 'Round_Off', 0),
                    'TotalAmount': getattr(row, 'Total_Amount', 0),
                    'Net_Amount': getattr(row, 'Net_Amount', 0),
                    'PaidAmount': getattr(row, 'Paid_Amount', 0),
                    'BalanceAmount': getattr(row, 'Balance_Amount', 0),
                    'Bill_Status': getattr(row, 'Bill_Status', ''),
                    'Date': full_date,
                }

                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"Error in GET: {e}")
            return JsonResponse({'error': str(e)})




from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from decimal import Decimal
import json





@csrf_exempt
@require_http_methods(['POST','GET'])
def OP_Pharmacy_Refund_Billing_link(request):
    if request.method == 'POST':
        try:
            print("========= 🧾 WALKIN OP PHARMACY BILLING START =========")

            with transaction.atomic():
                # --- Step 1: Extract main billing data ---
                try:
                    data = json.loads(request.body.decode("utf-8"))
                    print("📦 Received Data Keys -->", list(data.keys()))
                except Exception as e:
                    print("❌ JSON Decode Error:", e)
                    return JsonResponse({'error': 'Invalid JSON body'})

                # Extract data from JSON directly
                selected_patient_data = data.get('SelectedPatient_list', {})
                billing_date = data.get('Billing_date', '')[:10] or timezone.now().strftime('%Y-%m-%d')
                billpay_method = data.get('Billpay_method', [])
                bill_Items = data.get('Bill_Items', {})
                user_name = data.get('User_Name', '')
                location_id = data.get('location', '')
                bill_itemtable = data.get('Refunded_Items', [])
                editid = data.get('EditDue', '')
                Paytype = data.get('Paytype', '')
                Store_location = data.get('StoreLocation', '')

                print(f"👤 User: {user_name} | 🏥 Location: {location_id} | 📅 Billing Date: {billing_date}")
                print(f"🧾 EditID: {editid} | 💳 Paytype: {Paytype} | 🏬 Store: {Store_location}")
                print(f"🧠 Bill_Items Keys: {list(bill_Items.keys()) if bill_Items else 'No Bill_Items'}")
                print(f"📋 Billing Table Count: {len(bill_itemtable)} items")

                # --- Step 2: Fetch related foreign key objects ---
                doctor_instance = None
                if doctor_id := selected_patient_data.get('Doctor_Id'):
                    try:
                        doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Doctor not found'})

                patient = None
                if patient_id := selected_patient_data.get('PatientId'):
                    try:
                        patient = Patient_Detials.objects.get(PatientId=patient_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Patient not found'})

                registration = None
                if reg_id := selected_patient_data.get('RegistrationId'):
                    try:
                        registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=reg_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Registration Id not found'})

                location = None
                if location_id:
                    try:
                        location = Location_Detials.objects.get(Location_Id=location_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Location not found'})

                # --- Step 3: Parse billing item details ---
                try:
                    discount_amount = float(bill_Items.get('Discount', 0))
                    sgst_val = float(bill_Items.get('SGSTval', 0))
                    cgst_val = float(bill_Items.get('CGSTval', 0))
                    gst_amount = float(bill_Items.get('GSTAmount', 0))
                    total_items = int(bill_Items.get('totalItems', 0))
                    total_qty = int(bill_Items.get('totalQty', 0))
                    total_amount = float(bill_Items.get('Amount', 0))
                    net_amount = float(bill_Items.get('totalAmount', 0))
                    paid_amount = float(bill_Items.get('PaidAmount', 0))
                    balance_amount = float(bill_Items.get('BalanceAmount', 0))
                    round_off = float(bill_Items.get('Roundoff', 0))
                    min_qty = 0
                    systemName =  data.get('systemName','')
                    refundst =False
                    print(f"💰 Totals -> Items:{total_items}, Qty:{total_qty}, Net:{net_amount}, Paid:{paid_amount}, Balance:{balance_amount}")
                    invo = OPPharmacyBillingReceipt.objects.get(Voucher_Number=editid).Invoice_NO.Billing_Invoice_No
                    for bilt in bill_itemtable:
                        print("🧾 Debug Bill Item --->", bilt)

                        item_id = bilt.get('ItemId')
                        item_code = bilt.get('ItemId')
                        batch_no = bilt.get('BatchNo')
                        billing_qty = bilt.get('Billing_Quantity', 0)

                        print(f"🧩 Checking OP_BillingItem | itemid={item_id}, ItemId={item_code}, BatchNo={batch_no}, Qty={billing_qty}")

                        item_qty = OP_BillingItem.objects.filter(
                           Billing =invo,
                            ItemId=item_code,
                            
                        ).first()
                        print(item_qty,'item qtyyyyyy')
                        if item_qty:
                          
                            
                            item_qty.Billing_Quantity -=int(billing_qty)
                            print(f"✅ Found item | OriginalQty={item_qty.Billing_Quantity} | NewMinQty={''}")
                            item_qty.save()
                            
                        else:
                            print(f"❌ Not found in OP_BillingItem for itemid={item_id}, BatchNo={batch_no}")
                            return JsonResponse({
                                'error': f'OP_BillingItem not found for itemid {item_id} and BatchNo {batch_no}',
                                'debug_item': bilt
                            })
                except ValueError as ve:
                    return JsonResponse({'error': 'Invalid value in Bill_Items', 'details': str(ve)})

                # --- Step 4: Determine new bill status ---
                new_bill_status = 'Paid' 
                billing = None

                if editid:
                    try:
                        billing = OPPharmacyBillingReceipt.objects.get(Voucher_Number=editid)
                        billing.NewPayment = 'BillPayment'
                        billing.save()
                        print(f"♻️ Refund initialized for Voucher {editid}")
                    except OPPharmacyBillingReceipt.DoesNotExist:
                        return JsonResponse({'error': 'Billing receipt not found'})

                    try:
                        main_bill = OP_Pharmacy_Billing_Table_Detials.objects.get(
                            Billing_Invoice_No=billing.Invoice_NO.Billing_Invoice_No
                        )
                        main_bill.Bill_Status = 'Paid'
                        main_bill.updated_by = user_name
                        main_bill.save()
                        print("✅ Main bill status updated to Refunded")
                    except Exception as e:
                        return JsonResponse({'error': str(e)})

                # --- Step 5: Update stock quantities ---
                for iitem in bill_itemtable:
                    print(f"🔄 Updating stock for: {iitem}")
                    try:
                        store_location_instance = Inventory_Location_Master_Detials.objects.get(Store_Id=Store_location)
                        print('min--',min_qty)
                        stock_item = Stock_Maintance_Table_Detials.objects.get(
                             Product_Detials__ItemName=iitem.get('ItemName'),
                            Store_location=store_location_instance,
                            Batch_No=iitem.get('BatchNo')
                        )
                        stock_item.Update_at = datetime.now()
                        stock_item.Update_Reason = 'Bill Refunded'
                        stock_item.Updated_by = user_name
                        stock_item.AvailableQuantity += int(iitem.get('Billing_Quantity'))
                        stock_item.save()
                        print(f"✅ Stock updated for ItemId={iitem.get('ItemId')} Batch={iitem.get('BatchNo')}")
                    except Exception as e:
                        return JsonResponse({'error': f'{e}'})
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        return JsonResponse({
                            'error': f"Stock not found for id {iitem.get('ItemId')} and BatchNo {iitem.get('BatchNo')} in StoreLocation {Store_location}"
                        })
                    except Exception as e:
                        return JsonResponse({'error': f"Error updating stock: {str(e)}"})

                # --- Step 6: Create refund billing receipt ---

                if len(bill_itemtable)>=0:
                    refundst=True
                billing_receipt_table = OPPharmacyBillingRefundReceipt(
                    Invoice_NO=billing if billing else None,
                    PatientID=patient.PatientId,
                    PhoneNumber=patient.PhoneNo,
                    NewPayment="RefundPayment",
                    Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                    TotalAmount=total_amount,
                    TotalPaidAmount=paid_amount,
                    BalanceAmount=balance_amount,
                    Billing_Date=billing_date,
                    PaidAmount=paid_amount,
                    Billedby=user_name,
                    IsRefunded=False,
                    Remaining_Items=bill_itemtable
                )
                billing_receipt_table.save()
                recipetbill = billing_receipt_table.Voucher_Number
                print(f"🧾 Refund Receipt Created: {recipetbill}")

                # --- Step 7: Save payment methods ---
                def safe_decimal(value, default=Decimal('0.00')):
                    try:
                        return Decimal(str(value) if value else str(default))
                    except (ValueError, TypeError):
                        return default

                for payment in billpay_method:
                    print("💳 Saving payment:", payment)
                    OP_Pharmacy_Payment_Refund_Table_Detials.objects.create(
                        Receipt_No_Paid=billing_receipt_table,
                        Payment_Type=payment.get('Billpay_method', ''),
                        Cart_Type=payment.get('CardType', ''),
                        Bank_Name=payment.get('BankName', ''),
                        Cheque_No=payment.get('ChequeNo', ''),
                        Transaction_Amount=safe_decimal(payment.get('paidamount', 0)),
                        AdditionalAmount=safe_decimal(payment.get('Additionalamount', 0)),
                        Amount=safe_decimal(payment.get('paidamount', 0)) + safe_decimal(payment.get('Additionalamount', 0)),
                    )

                print("✅ OP Data saved successfully")
                

                try:
                    printer_name = "TVS MSP 250 Star"
                    

                    items_list = []
                    for item in bill_itemtable:
                        grn = GRN_Product_Item_Detials.objects.filter(
                        Product_Detials__ItemName=item["ItemName"]
                    ).first()
                        items_list.append({
                            "name": item["ItemName"],
                            "batch": item["BatchNo"],
                            "expiry": item["Exp_Date"],
                            "qty": item["Billing_Quantity"],
                            "rate": float(item["Unit_Price"]),
                            # "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn and grn.Sellable_qty_price else 0,
                            "mrp": float(item["Amount"]),
                            "total": float(item["Total"])
                        })
                    print('itemlist',items_list)
                    bill_data = {
                        "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                        "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
                        "patient_id": patient.PatientId,
                        "Doctor_name":f"{doctor_instance.First_Name if doctor_instance else ''} {doctor_instance.Middle_Name if doctor_instance else ''} {doctor_instance.Last_Name if doctor_instance else ''}",
                        "age": patient.Age,
                        "gender": patient.Gender,
                        "invoice_no": billing.Invoice_NO.Billing_Invoice_No,
                        "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                        "date": billing_date,
                        "patient_phone": patient.PhoneNo,
                        "items": items_list,
                        "amount_words": num2words(billing.TotalAmount),
                        # "gst": billing.Total_GSTAmount,
                        "billed_by": user_name,
                        "GrossAmount": float(bill_Items.get('Amount', 0)),
                        "totalAmount": round(float(bill_Items.get('totalAmount', 0)),0),
                        "PaidAmount":round(float(bill_Items.get('PaidAmount', 0)),0),
                    }
                    
                    bill_text = Op_refund_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)

                    print("SYS-----11---", systemName)
                    print(bill_text)
                    if systemName:
                        JOB = PrintJob.objects.create(
                            system_name=systemName,
                            bill_text=bill_text
                        )
                        JOB.save()
                        print("Job Assigned To", JOB)




                # hPrinter = win32print.OpenPrinter(printer_name)
                # try:
                #     hJob = win32print.StartDocPrinter(hPrinter, 1, ("OP Bill", None, "RAW"))
                #     win32print.StartPagePrinter(hPrinter)
                #     win32print.WritePrinter(hPrinter, bill_text.encode('ascii', errors='replace'))
                #     win32print.EndPagePrinter(hPrinter)
                #     win32print.EndDocPrinter(hPrinter)
                #     print("Bill printed successfully")
                # finally:
                #     win32print.ClosePrinter(hPrinter)


                except Exception as e:
                    print(f"Warning: Error printing bill: {e}")
        except Exception as e:
            print("❌ Exception in main POST:", str(e))
            return JsonResponse({'error1': str(e)})
        
        return JsonResponse({'status': 'success', 'message': 'OP Data saved successfully', 'ReceiptNo': recipetbill})
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            print('status_filter:', status_filter)

            # Build dynamic filter query
            search_query = Q()

            if SearchbyFirstName:
                search_query &= (  Q(Patient_Name__icontains=SearchbyFirstName) |
                                   Q(Voucher_Number__iexact=f"""{'RCPT/'}{SearchbyFirstName}""") 
                                 
                                    )

            if SearchbySpeciality:
                search_query &= Q(Invoice_NO__Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)

            if SearchbyDoctor:
                search_query &= Q(Invoice_NO__Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(CreatedAt__date=CurrentDate)
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(CreatedAt__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(CreatedAt__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(CreatedAt__date__lte=ToDate)

            # Fetch data
            general_billing_dataaa = OPPharmacyBillingReceipt.objects.filter(search_query,Invoice_NO__IsCollected = True).exclude(NewPayment="RefundPayment")
            print('refundddd', general_billing_dataaa)

            response_data = []
            for general_billing_data in general_billing_dataaa:
                try:
                    # Safe references
                    invoice_obj = getattr(general_billing_data, 'Invoice_NO', None)
                    doctor_obj = getattr(invoice_obj, 'Doctor_Id', None) if invoice_obj else None
                    reg_obj = getattr(invoice_obj, 'Register_Id', None) if invoice_obj else None
                    patient_obj = getattr(reg_obj, 'PatientId', None) if reg_obj else None

                    billing_details = {
                        'id': general_billing_data.Voucher_Number,
                        'Type': 'PharmacyRefund',
                        'Billing_Date': general_billing_data.Billing_Date,
                        'Doctor_Id': getattr(doctor_obj, 'Doctor_ID', ''),
                        'Doctor_Name': (
                            f"{getattr(getattr(doctor_obj, 'Tittle', None), 'Title_Name', '')}."
                            f"{getattr(doctor_obj, 'First_Name', '')} {getattr(doctor_obj, 'Middle_Name', '')} {getattr(doctor_obj, 'Last_Name', '')}"
                        ).strip() if doctor_obj else '',
                        'PatientId': getattr(general_billing_data, 'PatientID', ''),
                        'Patient_Name': getattr(general_billing_data, 'Patient_Name', ''),
                        'PhoneNo': getattr(general_billing_data, 'PhoneNumber', ''),
                        'Register_Id': getattr(reg_obj, 'Registration_Id', ''),
                        'Gender': getattr(patient_obj, 'Gender', ''),
                        'AgeGender': f"{getattr(patient_obj, 'Age', '')}/{getattr(patient_obj, 'Gender', '')}" if patient_obj else '',
                        'Address': (
                            f"{getattr(patient_obj, 'DoorNo', '')}, {getattr(patient_obj, 'Street', '')}, "
                            f"{getattr(patient_obj, 'Area', '')}, {getattr(patient_obj, 'City', '')}, "
                            f"{getattr(patient_obj, 'State', '')}, {getattr(patient_obj, 'Country', '')}, "
                            f"{getattr(patient_obj, 'Pincode', '')}"
                        ) if patient_obj else '',
                        'PatientCategory': getattr(reg_obj, 'PatientCategory', ''),
                        'PatientCategoryName': (
                            getattr(getattr(reg_obj, 'InsuranceName', None), 'Insurance_Name', None)
                            if getattr(reg_obj, 'PatientCategory', '') == 'Insurance'
                            else getattr(getattr(reg_obj, 'ClientName', None), 'Client_Name', None)
                        ),
                        'Visit_Id': getattr(reg_obj, 'VisitId', ''),
                        'Billing_Type': getattr(invoice_obj, 'Billing_Type', ''),
                        'TotalItems': getattr(invoice_obj, 'Total_Items', 0),
                        'TotalQty': getattr(invoice_obj, 'Total_Qty', 0),
                        'RoundOff': getattr(invoice_obj, 'Round_Off', 0),
                        'TotalAmount': getattr(general_billing_data, 'TotalAmount', 0),
                        'TotalDiscount': getattr(invoice_obj, 'Discount_Amount', 0),
                        'Net_Amount': getattr(general_billing_data, 'TotalAmount', 0),
                        'PaidAmount': getattr(general_billing_data, 'PaidAmount', 0),
                        'PaidNetAmount': getattr(general_billing_data, 'TotalPaidAmount', 0),
                        'BalanceAmount': getattr(general_billing_data, 'BalanceAmount', 0),
                        'Bill_Status': getattr(invoice_obj, 'Bill_Status', ''),
                        'Billing_Items': [],
                    }

                    # Billing items
                    record_id = 1
                    billing_items = OP_BillingItem.objects.filter(Billing__Billing_Invoice_No=getattr(invoice_obj, 'Billing_Invoice_No', None))
                    print('billllllll', billing_items)
                    for item in billing_items:
                        item_details = {
                            'S_No': record_id,
                            'itemid': item.pk,
                            'ItemId': getattr(item.ItemId, 'pk', ''),
                            'Invoice_No': getattr(item.Billing, 'Billing_Invoice_No', ''),
                            'ItemName': getattr(item, 'ItemName', ''),
                            'BatchNo': getattr(item, 'BatchNo', ''),
                            'Exp_Date': getattr(item, 'Exp_Date', ''),
                            'Unit_Price': getattr(item, 'Unit_Price', 0),
                            'Charge': getattr(item, 'Unit_Price', 0),
                            'Billing_Quantity': getattr(item, 'Billing_Quantity', 0),
                            'Amount': getattr(item, 'Amount', 0),
                            'Total': getattr(item, 'Total', 0),
                        }
                        record_id += 1
                        billing_details['Billing_Items'].append(item_details)
                except:
                    continue
                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print("Error|",str(e))
            return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(['POST','GET'])
def WalkinOP_Pharmacy_Refund_Billing_link(request):
    if request.method == 'POST':
        try:
            print("========= 🧾 WALKIN OP PHARMACY BILLING START =========")

            with transaction.atomic():
                # --- Step 1: Extract main billing data ---
                try:
                    data = json.loads(request.body.decode("utf-8"))
                    print("📦 Received Data Keys -->", list(data.keys()))
                except Exception as e:
                    print("❌ JSON Decode Error:", e)
                    return JsonResponse({'error': 'Invalid JSON body'})

                # Extract data from JSON directly
                selected_patient_data = data.get('SelectedPatient_list', {})
                billing_date = data.get('Billing_date', '')[:10] or timezone.now().strftime('%Y-%m-%d')
                billpay_method = data.get('Billpay_method', [])
                bill_Items = data.get('Bill_Items', {})
                user_name = data.get('User_Name', '')
                location_id = data.get('location', '')
                bill_itemtable = data.get('Billing_itemtable', [])
                editid = data.get('EditDue', '')
                Paytype = data.get('Paytype', '')
                Store_location = data.get('StoreLocation', '')

                print(f"👤 User: {user_name} | 🏥 Location: {location_id} | 📅 Billing Date: {billing_date}")
                print(f"🧾 EditID: {editid} | 💳 Paytype: {Paytype} | 🏬 Store: {Store_location}")
                print(f"🧠 Bill_Items Keys: {list(bill_Items.keys()) if bill_Items else 'No Bill_Items'}")
                print(f"📋 Billing Table Count: {len(bill_itemtable)} items")

                # --- Step 2: Fetch related foreign key objects ---
                doctor_instance = None
                if doctor_id := selected_patient_data.get('Doctor_Id'):
                    try:
                        doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Doctor not found'})

                patient = None
                if patient_id := selected_patient_data.get('PatientId'):
                    try:
                        patient = Patient_Detials.objects.get(PatientId=patient_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Patient not found'})

                registration = None
                if reg_id := selected_patient_data.get('RegistrationId'):
                    try:
                        registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=reg_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Registration Id not found'})

                location = None
                if location_id:
                    try:
                        location = Location_Detials.objects.get(Location_Id=location_id)
                    except ObjectDoesNotExist:
                        return JsonResponse({'error': 'Location not found'})

                # --- Step 3: Parse billing item details ---
                try:
                    discount_amount = float(bill_Items.get('Discount', 0))
                    sgst_val = float(bill_Items.get('SGSTval', 0))
                    cgst_val = float(bill_Items.get('CGSTval', 0))
                    gst_amount = float(bill_Items.get('GSTAmount', 0))
                    total_items = int(bill_Items.get('totalItems', 0))
                    total_qty = int(bill_Items.get('totalQty', 0))
                    total_amount = float(bill_Items.get('Amount', 0))
                    net_amount = float(bill_Items.get('totalAmount', 0))
                    paid_amount = float(bill_Items.get('PaidAmount', 0))
                    balance_amount = float(bill_Items.get('BalanceAmount', 0))
                    round_off = float(bill_Items.get('Roundoff', 0))
                    min_qty = 0

                    print(f"💰 Totals -> Items:{total_items}, Qty:{total_qty}, Net:{net_amount}, Paid:{paid_amount}, Balance:{balance_amount}")

                    for bilt in bill_itemtable:
                        print("🧾 Debug Bill Item --->", bilt)

                        item_id = bilt.get('ItemId')
                        item_code = bilt.get('ItemId')
                        batch_no = bilt.get('BatchNo')
                        billing_qty = bilt.get('Billing_Quantity', 0)

                        print(f"🧩 Checking OP_BillingItem | itemid={item_id}, ItemId={item_code}, BatchNo={batch_no}, Qty={billing_qty}")

                        item_qty = OP_BillingItem.objects.filter(
                            ItemId=item_code,
                            BatchNo=batch_no
                        ).first()

                        if item_qty:
                            min_qty = float(item_qty.Billing_Quantity) - int(billing_qty)
                            print(f"✅ Found item | OriginalQty={item_qty.Billing_Quantity} | NewMinQty={min_qty} | billing_qty_refund={billing_qty}")
                        else:
                            print(f"❌ Not found in OP_BillingItem for itemid={item_id}, BatchNo={batch_no}")
                            return JsonResponse({
                                'error': f'OP_BillingItem not found for itemid {item_id} and BatchNo {batch_no}',
                                'debug_item': bilt
                            })
                except ValueError as ve:
                    return JsonResponse({'error': 'Invalid value in Bill_Items', 'details': str(ve)})

                # --- Step 4: Determine new bill status ---
                new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'
                billing = None

                if editid:
                    try:
                        billing = OPPharmacyBillingReceipt.objects.get(Voucher_Number=editid)
                        billing.NewPayment = 'BillPayment'
                        billing.save()
                        print(f"♻️ Refund initialized for Voucher {editid}")
                    except OPPharmacyBillingReceipt.DoesNotExist:
                        return JsonResponse({'error': 'Billing receipt not found'})

                    try:
                        main_bill = OP_Pharmacy_Billing_Table_Detials.objects.get(
                            Billing_Invoice_No=billing.Invoice_NO.Billing_Invoice_No
                        )
                        main_bill.Bill_Status = 'Paid'
                        main_bill.updated_by = user_name
                        main_bill.save()
                        print("✅ Main bill status updated to Refunded")
                    except Exception as e:
                        return JsonResponse({'error': str(e)})

                # --- Step 5: Update stock quantities ---
                for iitem in bill_itemtable:
                    print(f"🔄 Updating stock for: {iitem}")
                    try:
                        store_location_instance = Inventory_Location_Master_Detials.objects.get(Store_Id=Store_location)
                        print('min_qty---',min_qty)
                        stock_item = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=iitem.get('ItemName'),
                          
                            Store_location=Store_location,
                            Batch_No=iitem.get('BatchNo')
                        ).first()
                        stock_item.Updated_by = user_name
                        stock_item.Update_at = datetime.now()
                        stock_item.Update_Reason = 'Walkin Bill Refund'
                        stock_item.AvailableQuantity += int(billing_qty)
                        stock_item.save()
                        print(f"✅ Stock updated for ItemId={iitem.get('ItemId')} Batch={iitem.get('BatchNo')} min_qty={min_qty} | billing_qty={billing_qty}")
                    except Inventory_Location_Master_Detials.DoesNotExist:
                        return JsonResponse({'error': f'Inventory location not found for StoreLocation {Store_location}'})
                    except Stock_Maintance_Table_Detials.DoesNotExist:
                        return JsonResponse({
                            'error': f"Stock not found for id {iitem.get('ItemId')} and BatchNo {iitem.get('BatchNo')} in StoreLocation {Store_location}"
                        })
                    except Exception as e:
                        return JsonResponse({'error': f"Error updating stock: {str(e)}"})

                # --- Step 6: Create refund billing receipt ---
                billing_receipt_table = OPPharmacyBillingRefundReceipt(
                    Invoice_NO=billing if billing else None,
                    NewPayment="RefundPayment",
                    Patient_Name=selected_patient_data.get('PatientName'),
                    TotalAmount=total_amount,
                    TotalPaidAmount=paid_amount,
                    BalanceAmount=balance_amount,
                    Billing_Date=billing_date,
                    PaidAmount=paid_amount,
                    Billedby=user_name,
                    Remaining_Items=bill_itemtable
                )
                billing_receipt_table.save()
                recipetbill = billing_receipt_table.Voucher_Number
                print(f"🧾 Refund Receipt Created: {recipetbill}")

                # --- Step 7: Save payment methods ---
                def safe_decimal(value, default=Decimal('0.00')):
                    try:
                        return Decimal(str(value) if value else str(default))
                    except (ValueError, TypeError):
                        return default

                for payment in billpay_method:
                    print("💳 Saving payment:", payment)
                    OP_Pharmacy_Payment_Refund_Table_Detials.objects.create(
                        Receipt_No_Paid=billing_receipt_table,
                        Payment_Type=payment.get('Billpay_method', ''),
                        Cart_Type=payment.get('CardType', ''),
                        Bank_Name=payment.get('BankName', ''),
                        Cheque_No=payment.get('ChequeNo', ''),
                        Transaction_Amount=safe_decimal(payment.get('paidamount', 0)),
                        AdditionalAmount=safe_decimal(payment.get('Additionalamount', 0)),
                        Amount=safe_decimal(payment.get('paidamount', 0)) + safe_decimal(payment.get('Additionalamount', 0)),
                    )

                print("✅ OP Data saved successfully")
                return JsonResponse({'status': 'success', 'message': 'OP Data saved successfully', 'ReceiptNo': recipetbill})

        except Exception as e:
            print("❌ Exception in main POST:", str(e))
            return JsonResponse({'error1': str(e)})
        
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            print('status_filter:', status_filter)

            # Build dynamic filter query
            search_query = Q()

            if SearchbyFirstName:
                search_query &= Q(Patient_Name__icontains=SearchbyFirstName)

            if SearchbySpeciality:
                search_query &= Q(Invoice_NO__Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)

            if SearchbyDoctor:
                search_query &= Q(Invoice_NO__Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(CreatedAt__date=CurrentDate)
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(CreatedAt__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(CreatedAt__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(CreatedAt__date__lte=ToDate)

            # Fetch data
            general_billing_dataaa = OPPharmacyBillingReceipt.objects.filter(search_query).exclude(NewPayment="RefundPayment")
            print('refundddd', general_billing_dataaa)

            response_data = []
            for general_billing_data in general_billing_dataaa:
                try:
                    # Safe references
                    invoice_obj = getattr(general_billing_data, 'Invoice_NO', None)
                    doctor_obj = getattr(invoice_obj, 'Doctor_Id', None) if invoice_obj else None
                    reg_obj = getattr(invoice_obj, 'Register_Id', None) if invoice_obj else None
                    patient_obj = getattr(reg_obj, 'PatientId', None) if reg_obj else None

                    billing_details = {
                        'id': general_billing_data.Voucher_Number,
                        'Type': 'PharmacyRefund',
                        'Billing_Date': general_billing_data.Billing_Date,
                        'Doctor_Id': getattr(doctor_obj, 'Doctor_ID', ''),
                        'Doctor_Name': (
                            f"{getattr(getattr(doctor_obj, 'Tittle', None), 'Title_Name', '')}."
                            f"{getattr(doctor_obj, 'First_Name', '')} {getattr(doctor_obj, 'Middle_Name', '')} {getattr(doctor_obj, 'Last_Name', '')}"
                        ).strip() if doctor_obj else '',
                        'PatientId': getattr(general_billing_data, 'PatientID', ''),
                        'Patient_Name': getattr(general_billing_data, 'Patient_Name', ''),
                        'PhoneNo': getattr(general_billing_data, 'PhoneNumber', ''),
                        'Register_Id': getattr(reg_obj, 'Registration_Id', ''),
                        'Gender': getattr(patient_obj, 'Gender', ''),
                        'AgeGender': f"{getattr(patient_obj, 'Age', '')}/{getattr(patient_obj, 'Gender', '')}" if patient_obj else '',
                        'Address': (
                            f"{getattr(patient_obj, 'DoorNo', '')}, {getattr(patient_obj, 'Street', '')}, "
                            f"{getattr(patient_obj, 'Area', '')}, {getattr(patient_obj, 'City', '')}, "
                            f"{getattr(patient_obj, 'State', '')}, {getattr(patient_obj, 'Country', '')}, "
                            f"{getattr(patient_obj, 'Pincode', '')}"
                        ) if patient_obj else '',
                        'PatientCategory': getattr(reg_obj, 'PatientCategory', ''),
                        'PatientCategoryName': (
                            getattr(getattr(reg_obj, 'InsuranceName', None), 'Insurance_Name', None)
                            if getattr(reg_obj, 'PatientCategory', '') == 'Insurance'
                            else getattr(getattr(reg_obj, 'ClientName', None), 'Client_Name', None)
                        ),
                        'Visit_Id': getattr(reg_obj, 'VisitId', ''),
                        'Billing_Type': getattr(invoice_obj, 'Billing_Type', ''),
                        'TotalItems': getattr(invoice_obj, 'Total_Items', 0),
                        'TotalQty': getattr(invoice_obj, 'Total_Qty', 0),
                        'RoundOff': getattr(invoice_obj, 'Round_Off', 0),
                        'TotalAmount': getattr(general_billing_data, 'TotalAmount', 0),
                        'TotalDiscount': getattr(invoice_obj, 'Discount_Amount', 0),
                        'Net_Amount': getattr(general_billing_data, 'TotalAmount', 0),
                        'PaidAmount': getattr(general_billing_data, 'PaidAmount', 0),
                        'PaidNetAmount': getattr(general_billing_data, 'TotalPaidAmount', 0),
                        'BalanceAmount': getattr(general_billing_data, 'BalanceAmount', 0),
                        'Bill_Status': getattr(invoice_obj, 'Bill_Status', ''),
                        'Billing_Items': [],
                    }

                    # Billing items
                    record_id = 1
                    billing_items = OP_BillingItem.objects.filter(Billing__Billing_Invoice_No=getattr(invoice_obj, 'Billing_Invoice_No', None))
                    print('billllllll', billing_items)
                    for item in billing_items:
                        item_details = {
                            'S_No': record_id,
                            'itemid': item.pk,
                            'ItemId': getattr(item.ItemId, 'pk', ''),
                            'Invoice_No': getattr(item.Billing, 'Billing_Invoice_No', ''),
                            'ItemName': getattr(item, 'ItemName', ''),
                            'BatchNo': getattr(item, 'BatchNo', ''),
                            'Exp_Date': getattr(item, 'Exp_Date', ''),
                            'Unit_Price': getattr(item, 'Unit_Price', 0),
                            'Charge': getattr(item, 'Unit_Price', 0),
                            'Billing_Quantity': getattr(item, 'Billing_Quantity', 0),
                            'Amount': getattr(item, 'Amount', 0),
                            'Total': getattr(item, 'Total', 0),
                        }
                        record_id += 1
                        billing_details['Billing_Items'].append(item_details)
                except:
                    continue
                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print("Error|",str(e))
            return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(['GET'])
def OP_Pharmacy_Refund_List_link(request):
    try:
        location = request.GET.get('location')
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        RegisterId = request.GET.get('RegisterId')
    


        



        # Always fetch RefundPayment records only
        refund_receipts = OPPharmacyBillingRefundReceipt.objects.filter(NewPayment="RefundPayment").order_by('-CreatedAt')

        # If you still want optional filters like PatientName, Doctor, etc.
        SearchbyFirstName = request.GET.get('SearchbyFirstName')
        if SearchbyFirstName:
            refund_receipts = refund_receipts.filter(Patient_Name__icontains=SearchbyFirstName)

        if DateType == "Current" and CurrentDate:
                refund_receipts = refund_receipts.filter(CreatedAt__date=CurrentDate) 
        elif DateType == "Customize":
            if FromDate and ToDate:
                refund_receipts = refund_receipts.filter(CreatedAt__date__range=[FromDate, ToDate])
            elif FromDate:
                refund_receipts = refund_receipts.filter(CreatedAt__date__gte=FromDate)

            elif ToDate:
                refund_receipts = refund_receipts.filter(CreatedAt__date__lte=ToDate)

                

        response_data = []
        for refund_receipt in refund_receipts:
            remaining_items = refund_receipt.Remaining_Items or []

            # refunded items are simply what’s inside Remaining_Items for this refund
            refunded_items = []
            record_id = 1
            for item in remaining_items:
                refunded_items.append({
                    'S_No': record_id,
                    'ItemId': item.get('ItemId'),
                    'ItemName': item.get('ItemName'),
                    'BatchNo': item.get('BatchNo'),
                    'Exp_Date': item.get('Exp_Date'),
                    'Unit_Price': float(item.get('Unit_Price', 0)),
                    'Billing_Quantity': int(item.get('Billing_Quantity', 0)),
                    'Amount': float(item.get('Amount', 0)),
                    'Total': float(item.get('Total', 0)),
                })
                record_id += 1

            refunded_total = sum(item['Total'] for item in refunded_items)

            patient = Patient_Detials.objects.filter(PatientId=refund_receipt.PatientID).first()
            patient_name = refund_receipt.Patient_Name if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()

            billing_details = {
                'id': refund_receipt.Voucher_Number,
                'Type': 'PharmacyRefund',
                'Billing_Date': refund_receipt.Billing_Date,
                'PatientId': refund_receipt.PatientID,
                'Patient_Name': patient_name ,
                'PhoneNo': refund_receipt.PhoneNumber,
                'Billing_Type': 'OPPharmacyRefund',
                'TotalItems': len(refunded_items),
                'TotalAmount': refunded_total,
                'PaidAmount': float(refund_receipt.PaidAmount or 0),
                'BalanceAmount': float(refund_receipt.BalanceAmount or 0),
                'Bill_Status': 'Refunded',
                'Billing_Items': refunded_items,
            }

            response_data.append(billing_details)

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})




        
@csrf_exempt
@require_http_methods(['POST'])
def OP_Pharmacy_Walkin_Billing_link(request):
    if request.method == 'POST':
        try:
            # Extract main billing data
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            # bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            # Extract PDF data
            pdf_data = request.FILES.get('pdfData')
            
            # Debug output to ensure data is received correctly
            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            # print("Billing Item Table:", bill_itemtable)
            # Fetch related foreign key objects
            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            print('111111111111')
            # Parse billing item details with safe integer and float conversion
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222233333333')
            doctor_name = selected_patient_data.get('DoctorName') if selected_patient_data.get('DoctorName') else None
            patient_name = selected_patient_data.get('PatientName') if selected_patient_data.get('PatientName') else None
            print('33333444444',doctor_name,patient_name)
            # Create the main billing entry
            billing = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.create(
                Doctor_Id= doctor_name,
                PatientName=patient_name,
                Billing_Date=billing_date,
                Billing_Type="OPPharmacyWalkin",
                Discount_Amount=discount_amount,
                SGST_val=sgst_val,
                CGST_val=cgst_val,
                Total_GSTAmount=gst_amount,
                Total_Items=total_items,
                Total_Qty=total_qty,
                Total_Amount=total_amount,
                Net_Amount=net_amount,
                Paid_Amount=paid_amount,
                Balance_Amount=balance_amount,
                Round_Off=round_off,
                created_by=user_name,
                Location=location
            )
            billing.save()
            print('billingggg',billing)
            
            # drug_status = OPD_Prescription_Details.objects.filter(Patient_Id__PatientId = selected_patient_data.get('PatientId'), Status = True) if selected_patient_data.get('PatientId') else None
            # print('12212112',drug_status)
            
            # for drug in drug_status:
            #     drug.Status = False
                
            #     drug.save()
            try:
                bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list
                
                if not isinstance(bill_itemtable, list):
                    return JsonResponse({'error': 'Invalid format for Billing_itemtable. Expected a list of items.'})
                
                for item in bill_itemtable:
                    if not isinstance(item, dict):
                        print(f"Invalid item format: {item}")
                        continue  # Skip invalid items
                    
                    # Debugging statement
                    print("Processing item:", item)
                    
                    # Extract and validate item fields
                    item_name = str(item.get('ItemName', 'Unknown Item'))
                    billing_quantity = int(item.get('Billing_Quantity', 0))
                    batch_no = item.get('BatchNo', 'N/A')
                    exp_date = item.get('Exp_Date', None)
                    
                    # Validate float fields
                    try:
                        unit_price = float(item.get('Unit_Price', 0) or 0.0)
                    except ValueError:
                        print(f"Invalid Unit_Price value: {item.get('Unit_Price')}")
                        unit_price = 0.0  # Default to 0.0

                    try:
                        amount = float(item.get('Amount', 0) or 0.0)
                    except ValueError:
                        print(f"Invalid Amount value: {item.get('Amount')}")
                        amount = 0.0  # Default to 0.0

                    try:
                        total = float(item.get('Total', 0) or 0.0)
                    except ValueError:
                        print(f"Invalid Total value: {item.get('Total')}")
                        total = 0.0  # Default to 0.0

                    # Validate and parse date
                    if exp_date:
                        try:
                            exp_date = datetime.strptime(exp_date, "%Y-%m-%d").date()
                        except ValueError:
                            print(f"Invalid Exp_Date format: {exp_date}")
                            exp_date = None  # Set to None if invalid
                    
                    # Debugging output
                    print(f"Validated item: Name={item_name}, Quantity={billing_quantity}, Unit_Price={unit_price}, Total={total}")
                    
                    # Create billing item
                    items_bill = OP_Walkin_BillingItem.objects.create(
                        Billing=billing,
                        ItemName=item_name,
                        Billing_Quantity=billing_quantity,
                        BatchNo=batch_no,
                        Exp_Date=exp_date,
                        Unit_Price=unit_price,
                        Amount=amount,
                        Total=total
                    )
                    items_bill.save()
                    print('Saved item:', items_bill)
            except Exception as e:
                print(f"Error while processing item: {item}, Error: {e}")  # Capture any errors
                return JsonResponse({'error': f"Failed to process item. Error: {str(e)}"})

            print('444444444444')
                    # Save each payment method
            for payment in billpay_method:
                payment_bill = OP_Walkin_Pharmacy_Billing_Payments.objects.create(
                    Billing=billing,
                    Billpay_method=payment.get('Billpay_method', ''),
                    CardType=payment.get('CardType', ''),
                    BankName=payment.get('BankName', ''),
                    ChequeNo=payment.get('ChequeNo', ''),
                    paidamount=float(payment.get('paidamount', 0)),
                    Additionalamount=float(payment.get('Additionalamount', 0)) if payment.get('Additionalamount') else 0,
                    transactionFee=payment.get('transactionFee', '') if payment.get('transactionFee') else '',
                )
            payment_bill.save()
        
            # if pdf_data:
            #     billing.pdf_data.save(f"{billing.Billing_Invoice_No}.pdf", ContentFile(pdf_data.read()))

            # Assuming the additional billing items need to be saved here if there’s a model for that
            # Uncomment and adapt the following if applicable
            # index = 0
            # while f'ItemId_{index}' in request.POST:
            #     item_id = request.POST.get(f'ItemId_{index}')
            #     quantity = int(request.POST.get(f'Billing_Quantity_{index}'))
            #     BillingItem.objects.create(
            #         billing=billing,
            #         ItemId=item_id,
            #         Billing_Quantity=quantity
            #     )
            #     index += 1

            return JsonResponse({'status': 'success', 'message': 'OP Data saved successfully','InvoiceNo': billing.Billing_Invoice_No})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
        

def get_OP_Pharmacy_Billing_datas(request):
    if request.method == 'GET':
        try:
            SearchbyDate = request.GET.get('SearchbyDate')
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')
            SearchSpecialization = request.GET.get('SearchSpecialization')
            SearchDoctor = request.GET.get('SearchDoctor')
            SearchStatus = request.GET.get('SearchStatus')
            print('uull')
            Searchquery = Q()
            if SearchStatus:
                if SearchStatus=='Credit':
                    print('uull appu') 
                    Searchquery&=Q(Billing_Type='Credit')
                else:
                    Searchquery&=Q(Bill_Status=SearchStatus)    
            if SearchbyDate:
                search_date = datetime.strptime(SearchbyDate, "%Y-%m-%d").date()
                Searchquery &= Q(created_at__date=search_date)
            if SearchbyFirstName:
                Searchquery &= Q(PatientName__icontains=SearchbyFirstName)
            if SearchbyPhoneNumber:
                # if you had patient relation, adjust accordingly
                Searchquery &= Q(PatientId__icontains=SearchbyPhoneNumber)

            queryset = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.filter(Searchquery)

            datafetch = []
            for idx, billing in enumerate(queryset, start=1):
                datafetch.append({
                    'id': idx,
                    'Billing_Invoice_No': billing.Billing_Invoice_No,
                    'DoctorName': billing.Doctor_Id,
                    'PatientID': billing.PatientId,
                    'status':SearchStatus,
                    'Patient_Category':billing.Patient_Category,
                    'PatientName': billing.PatientName,
                    'Billing_Date': billing.Billing_Date,
                    'Billing_Type': billing.Billing_Type,
                    'Discount_Amount': billing.Discount_Amount,
                    'SGST_val': billing.SGST_val,
                    'CGST_val': billing.CGST_val,
                    'Total_GSTAmount': billing.Total_GSTAmount,
                    'Total_Items': billing.Total_Items,
                    'Total_Qty': billing.Total_Qty,
                    'Total_Amount': billing.Total_Amount,
                    'Net_Amount': billing.Net_Amount,
                    'Paid_Amount': billing.Paid_Amount,
                    'Balance_Amount': billing.Balance_Amount,
                    'Round_Off': billing.Round_Off,
                    'created_by': billing.created_by,
                    'Location': billing.Location.Location_Name if billing.Location else None,

                    # Add related Billing Items
                    'Billing_Items': [
                        {
                            'ItemName': item.ItemName,
                            'BatchNo': item.BatchNo,
                            'Exp_Date': item.Exp_Date,
                            'Billing_Quantity': item.Billing_Quantity,
                            'Unit_Price': item.Unit_Price,
                            'Amount': item.Amount,
                            'Total': item.Total,
                        }
                        for item in billing.OP_Walkin_billing_items.all()
                    ],

                    # Add related Payments
                    'Payments': [
                        {
                            'Billpay_method': pay.Billpay_method,
                            'CardType': pay.CardType,
                            'BankName': pay.BankName,
                            'ChequeNo': pay.ChequeNo,
                            'paidamount': pay.paidamount,
                            'Additionalamount': pay.Additionalamount,
                            'transactionFee': pay.transactionFee,
                        }
                        for pay in billing.billing_payments_Walkin.all()
                    ]
                })

            return JsonResponse(datafetch, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})




def get_Drug_Administration_datas(request):
    if request.method == 'GET':
        try:
            booking_id = request.GET.get('Booking_Id')
            current_date_str = request.GET.get('Date')
            current_date = datetime.strptime(current_date_str, '%Y-%m-%d').date()
            current_datetime = datetime.now().date()
            job_function()

            # Fetch the drug administration records
            drug_administrations = Doctor_drug_prescription.objects.filter(Booking_Id=booking_id)
            regular = []
            sos = []
            print('11111111111')
            print('2222222222',current_datetime)
            for admin in drug_administrations:
                if admin.FrequencyMethod == 'Regular':
                    # Fetch related nurse drug completed administration records
                    nurse_completed_admins = Ip_Nurse_Drug_Completed_Administration.objects.filter(
                        Prescription_Id=admin.Prescription_Id,
                        Issued_Date=current_datetime
                    ).values('FrequencyIssued', 'Status', 'Issued_Date')
                    
                    # Prepare data if there are nurse completed administrations
                    if nurse_completed_admins:
                        data = [
                            {
                                "FrequencyIssued": nca['FrequencyIssued'],
                                "Status": nca['Status'],
                                "Date": nca['Issued_Date']
                            }
                            for nca in nurse_completed_admins
                        ]
                        common_data = {
                            "Prescription_Id": admin.Prescription_Id,
                            "Department": admin.Department,
                            "DoctorName": admin.DoctorName.ShortName if admin.DoctorName else None,
                            "GenericName": admin.ProductCode.Product_Detials.GenericName.GenericName,
                            "MedicineCode": admin.ProductCode.Product_Detials.pk,
                            "MedicineName": f'{admin.ProductCode.Product_Detials.ItemName}',#{admin.ProductCode.Product_Detials.Strength}',
                            "FrequencyMethod": admin.FrequencyMethod,
                            "FrequencyType": admin.Frequency.FrequencyType,
                            "FrequencyTime": admin.Frequency.FrequencyTime,
                            "FrequencyName": admin.Frequency.FrequencyName,
                            "PrescribedDate": admin.Date.strftime('%Y-%m-%d'),
                            "AdminisDose": admin.AdminisDose,
                            "Instruction": admin.Instruction,
                            "FrequencyIssued": data,
                            "CurrentDate": data[0]['Date'] if data else None
                        }
                        regular.append(common_data)
                
                else:  # Handle non-regular frequency (SOS)
                    completed_count = Ip_Nurse_Drug_Completed_Administration.objects.filter(
                        FrequencyMethod=admin.FrequencyMethod,
                        Prescription_Id=admin.Prescription_Id
                    ).count()
                                   

                    
                    if completed_count != int(admin.Quantity):
                        common_data1 = {
                            "Prescription_Id": admin.Prescription_Id,
                            "Route": admin.Route,
                            "Department": admin.Department,
                            "DoctorName": admin.DoctorName.ShortName if admin.DoctorName else None,
                            "GenericName": admin.ProductCode.Product_Detials.GenericName.GenericName,
                            "MedicineCode": admin.ProductCode.Product_Detials.pk,
                            "MedicineName": f'{admin.ProductCode.Product_Detials.ItemName}',#{admin.ProductCode.Product_Detials.Strength}',
                            "FrequencyMethod": admin.FrequencyMethod,
                            "FrequencyType": admin.Frequency.FrequencyType,
                            "FrequencyTime": admin.Frequency.FrequencyTime,
                            "FrequencyName": admin.Frequency.FrequencyName,
                            "Dosage": admin.ProductCode.Product_Detials.Strength,
                            "Date": admin.Date,
                            "AdminisDose": admin.AdminisDose,
                            "Instruction": admin.Instruction,
                        }
                        sos.append(common_data1)

            return JsonResponse({'Regular': regular, 'SOS': sos}, safe=False)

        except Exception as e:
            print("Error", e)
            return JsonResponse({"Error Acquired:": str(e)}, status=500)    
        
        
# @csrf_exempt
# def insert_Drug_Administration_nurse_frequencywise_datas(request):
#     if request.method == 'POST':
#         try:
#             # Load JSON data from the request body
#             json_data = json.loads(request.body)
#             print('json_data', json_data)
            
            
#             for prescription in json_data:
#                 FrequencyMethod = prescription.get('FrequencyMethod')
#                 Prescription_Id = prescription.get('Prescription_Id')
#                 Completed_Date = prescription.get('Completed_Date')
#                 Completed_Time = prescription.get('Completed_Time')
#                 CapturedBy = prescription.get('CapturedBy')
#                 Completed_Remarks = prescription.get('Remarks')
#                 FrequencyIssued = prescription.get('FrequencyIssued')

#                 if FrequencyMethod == 'Regular':
#                     FrequencyIssued_str = f"{FrequencyIssued}:00:00"
#                     completed_time = datetime.strptime(Completed_Time, '%H:%M:%S')
#                     FrequencyIssued_time = datetime.strptime(FrequencyIssued_str, "%H:%M:%S")

#                     before_time = FrequencyIssued_time - timedelta(minutes=30)
#                     after_time = FrequencyIssued_time + timedelta(minutes=30)

#                     # Determine Status based on time comparison
#                     if before_time <= completed_time <= after_time:
#                         Status = 'Issued'
#                     elif completed_time < before_time:
#                         Status = 'Before'
#                     else:
#                         Status = 'Delay'

#                     # Update existing records using Django ORM
#                     updated_records = Ip_Nurse_Drug_Completed_Administration.objects.filter(
#                         Frequency=FrequencyIssued,
#                         Nurse_Prescription_Id=Prescription_Id,
#                         Status='Pending'
#                     ).update(
#                         Status=Status,
#                         Complete_Date=Completed_Date,
#                         Complete_Time=Completed_Time,
#                         Completed_Remarks=Completed_Remarks,
#                         CapturedBy=CapturedBy
#                     )
#                     print(f"Updated {updated_records} records.")

#                 else:
#                     # Insert new records using Django ORM
#                     issued_time = Completed_Time.split(':')[0]  # Use the hour part
#                     Nurse_drug_prescription.objects.create(
#                         Prescription_Id=Prescription_Id,
#                         Booking_Id=prescription.get('Booking_Id'),
#                         Department=prescription.get('Department'),
#                         DoctorName=prescription.get('DoctorName'),
#                         GenericName=prescription.get('GenericName'),
#                         MedicineCode=prescription.get('MedicineCode'),
#                         MedicineName=prescription.get('MedicineName'),
#                         Dosage=prescription.get('Dosage'),
#                         Route=prescription.get('Route'),
#                         FrequencyIssued=FrequencyIssued,
#                         FrequencyMethod=FrequencyMethod,
#                         Quantity=prescription.get('Quantity'),
#                         Issued_Date=prescription.get('Date'),
#                         Complete_Date=Completed_Date,
#                         Complete_Time=Completed_Time,
#                         Completed_Remarks=Completed_Remarks,
#                         Status='Issued',
#                         Location=prescription.get('Location'),
#                         CapturedBy=CapturedBy,
#                         AdminisDose=prescription.get('AdminisDose')
#                     )
            
#             return JsonResponse({'message': 'Data inserted successfully'})

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'})

@csrf_exempt
def insert_Drug_Administration_nurse_frequencywise_datas(request):
    if request.method == 'POST':
        try:
            # Load JSON data from the request body
            json_data = json.loads(request.body)
            print('json_data', json_data)

            # # Fetch the maximum Nurse_Prescription_Id
            # max_id = Ip_Nurse_Drug_Completed_Administration.objects.aggregate(max_id=models.Max('Nurse_Prescription_Id'))['max_id']
            # next_id = (max_id + 1) if max_id is not None else 1

            for prescription in json_data:
                FrequencyMethod = prescription.get('FrequencyMethod')
                Prescription_Id = prescription.get('Prescription_Id')
                Completed_Date = prescription.get('Completed_Date')
                Completed_Time = prescription.get('Completed_Time')
                CapturedBy = prescription.get('CapturedBy')
                Completed_Remarks = prescription.get('Remarks')
                FrequencyIssued = prescription.get('FrequencyIssued')

                if FrequencyMethod == 'Regular':
                    print('freqq111')
                    FrequencyIssued_str = f"{FrequencyIssued}:00:00"
                    completed_time = datetime.strptime(Completed_Time, '%H:%M:%S')
                    FrequencyIssued_time = datetime.strptime(FrequencyIssued_str, "%H:%M:%S")

                    before_time = FrequencyIssued_time - timedelta(minutes=30)
                    after_time = FrequencyIssued_time + timedelta(minutes=30)
                    print('freqq1112323', before_time, after_time, completed_time)
                    if before_time <= completed_time <= after_time:
                        Status = 'Issued'
                    elif completed_time < before_time:
                        Status = 'Before'
                    else:
                        Status = 'Delay'
                    print('freqq2222', Status)

                    # Test filtering by each condition individually
                    check_frequency_issued = Ip_Nurse_Drug_Completed_Administration.objects.filter(FrequencyIssued=FrequencyIssued)
                    check_prescription_id = Ip_Nurse_Drug_Completed_Administration.objects.filter(Prescription_Id=Prescription_Id)
                    check_status_pending = Ip_Nurse_Drug_Completed_Administration.objects.filter(Status='Pending')

                    print('Records with matching FrequencyIssued:', check_frequency_issued.count())
                    print('Records with matching Prescription_Id:', check_prescription_id.count())
                    print('Records with matching Status Pending:', check_status_pending.count())

                    # Update existing records
                    updated_count = Ip_Nurse_Drug_Completed_Administration.objects.filter(
                        FrequencyIssued=FrequencyIssued,
                        Prescription_Id=Prescription_Id,
                        Status='Pending'
                    ).update(
                        Status=Status,
                        Complete_Date=Completed_Date,
                        Complete_Time=Completed_Time,
                        Completed_Remarks=Completed_Remarks,
                        CapturedBy=CapturedBy
                    )

                    # Debug output
                    if updated_count == 0:
                        print("No matching records found for update.")
                    else:
                        print(f"Records updated: {updated_count}")

                else:
                    print('freqq4444')
                    # Insert new records
                    Issued_Time = Completed_Time.split(':')[0]  # Use the hour part
                    Department = prescription.get('Department')
                    DoctorName = prescription.get('DoctorName')
                    GenericName = prescription.get('GenericName')
                    MedicineCode = prescription.get('MedicineCode')
                    MedicineName = prescription.get('MedicineName')
                    Dosage = prescription.get('Dosage')
                    Route = prescription.get('Route')
                    Quantity = prescription.get('Quantity')
                    Location = prescription.get('Location')
                    AdminisDose = prescription.get('AdminisDose')
                    Date = prescription.get('Date')  # Use Date if provided
                    Status = 'Issued'

                    # Create a new record
                    Ip_Nurse_Drug_Completed_Administration.objects.create(
                        Nurse_Prescription_Id=next_id,
                        Prescription_Id=Prescription_Id,
                        Booking_Id=prescription.get('Booking_Id'),
                        Department=Department,
                        DoctorName=DoctorName,
                        ProductCode=MedicineCode,
                        Route=Route,
                        FrequencyIssued=FrequencyIssued,
                        FrequencyMethod=FrequencyMethod,
                        Quantity=Quantity,
                        Issued_Date=Date,
                        Complete_Date=Completed_Date,
                        Complete_Time=Completed_Time,
                        Completed_Remarks=Completed_Remarks,
                        Status=Status,
                        Location=Location,
                        CapturedBy=CapturedBy,
                        AdminisDose=AdminisDose
                    )
                    next_id += 1

            return JsonResponse({'message': 'Data inserted successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    else:
        # Handle GET or other HTTP methods
        return HttpResponseBadRequest("This endpoint only accepts POST requests.")


def get_for_ip_drugs_doctor_show(request):
    if request.method == 'GET':
        try:
            booking_id = request.GET.get('Booking_id')
            current_date = datetime.now().date()
            
            # First query to get distinct prescriptions for the given Booking ID
            prescriptions = Ip_Nurse_Drug_Completed_Administration.objects.filter(
                Booking_Id=booking_id
            ).select_related(
                'Prescription_Id', 'DoctorName', 'ProductCode', 'Location'
            ).values(
                'Prescription_Id', 'Booking_Id', 'Department', 'DoctorName__ShortName',
                'ProductCode__Product_Detials__ItemName', 'Route', 'FrequencyMethod',
                'Issued_Date', 'Location__Location_Id', 'AdminisDose'
            ).distinct()

            
            show_list = []
            for prescription in prescriptions:
                                # Nested query to get FrequencyIssued details for each Prescription_Id and Booking_Id
                frequency_issued_data = Ip_Nurse_Drug_Completed_Administration.objects.filter(
                    Prescription_Id=prescription['Prescription_Id'],
                    Booking_Id=prescription['Booking_Id'],
                    Issued_Date=prescription['Issued_Date']
                ).values(
                    'FrequencyIssued', 'Complete_Time', 'Completed_Remarks', 'Status', 'CapturedBy', 'Complete_Date'
                )

                                
                # Create a list of frequency data
                frequency_data = [
                    {
                        'FrequencyIssued': data['FrequencyIssued'],
                        'Completed_Time': data['Complete_Time'],
                        'Completed_Remarks': data['Completed_Remarks'],
                        'Status': data['Status'],
                        'CapturedBy': data['CapturedBy'],
                        'Completed_Date': data['Complete_Date'],
                    }
                    for data in frequency_issued_data
                ]
                
                # Format each prescription data with associated frequency issued data
                show_data = {
                    "Prescription_Id": prescription['Prescription_Id'],
                    "Booking_Id": prescription['Booking_Id'],
                    "Department": prescription['Department'],
                    "DoctorName": prescription['DoctorName__ShortName'],
                    "GenericName": prescription['ProductCode__Product_Detials__ItemName'],
                    "MedicineName": prescription['ProductCode__Product_Detials__ItemName'],
                    "Route": prescription['Route'],
                    "FrequencyIssued": frequency_data,
                    "FrequencyMethod": prescription['FrequencyMethod'],
                    "PrescribedDate": prescription['Issued_Date'],
                    "IssuedDate": prescription['Issued_Date'],
                    "Location": prescription['Location__Location_Id'],
                    "AdminisDose": prescription['AdminisDose'],
                }
                
                show_list.append(show_data)
            
            return JsonResponse(show_list, safe=False)

        except Exception as er:
            return JsonResponse({"Error Acquired": str(er)}, status=500)

# def job_function():
#     try:
#         print('job function insert')
#         # Fetch drug administration details
#         administrations = Doctor_drug_prescription.objects.all()
#         print('Query result:', administrations)
    
#         for administration in administrations:
#             if administration.FrequencyMethod == 'Regular':
#                 tablet_duration_days = int(administration.Duration)
#                 frequency_times = administration.Frequency.split(',')
#                 print('frequency_times',frequency_times)
#                 tablet_frequency_time = [(int(hour), 0) for hour in frequency_times]
                
#                 # Ensure `StartDate` is a date object and `StartTime` is a time object
#                 start_date = administration.created_at.strftime('%Y-%m-%d') 
#                 start_time = administration.created_at.strftime('%H:%M:%S')

#                 print('111111111',start_date,start_time)
#                 for day_offset in range(tablet_duration_days):
#                     current_date = start_date + timedelta(days=day_offset)
#                     tablet_times = []

#                     for freq_time in tablet_frequency_time:
#                         tablet_datetime = datetime.combine(current_date, time(freq_time[0], freq_time[1]))
#                         if tablet_datetime.time() < start_time:
#                             tablet_datetime += timedelta(days=1)
#                         tablet_times.append(tablet_datetime)
                        
#                     print('tablet_times',tablet_times)

#                     if tablet_times:
#                         tablet_times.sort()
#                         today_date = timezone.now().date()

#                         # Update pending requests
#                         Ip_Nurse_Drug_Completed_Administration.objects.filter(
#                             Status='Pending', Issued_Date__lt=today_date
#                         ).update(Status='NotIssued')

#                         for tablet_time in tablet_times:
#                             if today_date == tablet_time.date():
#                                 tablet_issue = int(tablet_time.strftime("%H"))
#                                 tablet_date_issue = tablet_time.date()
#                                 print('Tablet issue date:', tablet_date_issue)

#                                 # Check pending status and handle accordingly
#                                 if administration.Status == 'Pending':
#                                     if administration.RequestType == 'Outsourced':
#                                         handle_outsourced_request(administration, tablet_issue, tablet_date_issue)
#                                     elif administration.RequestType == 'Inhouse':
#                                         handle_inhouse_request(administration, tablet_issue, tablet_date_issue)

#     except Exception as e:
#         print(f"Error in job_function: {e}")
#         # Use Django's logging for better error tracking

# # Define handle_outsourced_request and handle_inhouse_request functions here
# # They should use Django ORM to update relevant models as needed


# @transaction.atomic
# def handle_outsourced_request(row, tablet_issue, tablet_date_issue):
#     """Handles outsourced drug requests using Django ORM."""

#     exists = Ip_Nurse_Drug_Completed_Administration.objects.filter(
#         prescription_id=row.Prescription_Id, booking_id=row.Booking_Id,
#         frequency_issued=tablet_issue, issued_date=tablet_date_issue
#     ).exists()

#     if not exists:
#         Ip_Nurse_Drug_Completed_Administration.objects.create(
#             Prescription_Id=row.prescription_id,
#             Booking_Id=row.booking_id,
#             Department=row.department,
#             DoctorName=row.doctor_name,
#             ProductCode=row.generic_name,
#             Dosage=row.dosage,
#             Route=row.route,
#             FrequencyIssued=tablet_issue,
#             FrequencyMethod=row.frequency_method,
#             Quantity=1,  # Adjust as per actual requirement
#             Issued_Date=tablet_date_issue,
#             Complete_Date=None,
#             Complete_Time=None,
#             Completed_Remarks='',
#             Status='Pending',
#             Location=row.location,
#             CapturedBy='',  # Define as needed
#             AdminisDose=row.adminis_dose
#         )


# @transaction.atomic
# def handle_inhouse_request(row, tablet_issue, tablet_date_issue):
#     """Handles in-house drug requests using Django ORM."""

#     # Handling 'Daily' frequency
#     if row.FrequencyMethod == 'Daily':
#         # Check if the request already exists for the given prescription and booking on this date
#         existing_request = ip_drug_request_table.objects.filter(
#             Prescibtion_Id=row.Prescription_Id,
#             Booking_Id=row.Booking_Id,
#             Date=tablet_date_issue
#         ).first()

#         if existing_request is None:
#             remaining = int(row.Quantity) - int(row.RequestQuantity)
#             ip_drug_request_table.objects.create(
#                 Drug_Request_Id=next_id_req,
#                 Booking_Id=row.Booking_Id,
#                 Prescibtion_Id=row.Prescription_Id,
#                 Department=row.Department,
#                 DoctorName=row.DoctorName,
#                 GenericName=row.GenericName,
#                 MedicineCode=row.MedicineCode,
#                 MedicineName=row.MedicineName,
#                 Dosage=row.Dosage,
#                 Route=row.Route,
#                 RequestType=row.FrequencyMethod,
#                 Quantity=row.Quantity,
#                 RequestQuantity=row.RequestQuantity,
#                 RemainingQuantity=remaining,
#                 Location=row.Location,
#                 CreatedBy=row.Location,  # or the relevant user field
#                 Status='Pending',
#                 Priscription_Barcode=row.Prescription_Barcode,
#                 Duration=row.Duration,
#                 DurationType=row.DurationType,
#                 Date=tablet_date_issue
#             )
#         elif existing_request.Status == "Received":
#             # Ensure drug request entry for 'Daily' frequency
#             existing_administration = Ip_Nurse_Drug_Completed_Administration.objects.filter(
#                 Prescription_Id=row.Prescription_Id,
#                 Booking_Id=row.Booking_Id,
#                 FrequencyIssued=tablet_issue,
#                 Issued_Date=tablet_date_issue
#             ).first()

#             if existing_administration is None:
#                 next_id1 = Ip_Nurse_Drug_Completed_Administration.objects.aggregate(
#                     max_id=models.Max('Nurse_Prescription_Id')
#                 )['max_id']
#                 next_id1 = next_id1 + 1 if next_id1 is not None else 1

#                 Ip_Nurse_Drug_Completed_Administration.objects.create(
#                     Nurse_Prescription_Id=next_id1,
#                     Prescription_Id=row.Prescription_Id,
#                     Booking_Id=row.Booking_Id,
#                     Department=row.Department,
#                     DoctorName=row.DoctorName,
#                     GenericName=row.GenericName,
#                     MedicineCode=row.MedicineCode,
#                     MedicineName=row.MedicineName,
#                     Dosage=row.Dosage,
#                     Route=row.Route,
#                     FrequencyIssued=tablet_issue,
#                     FrequencyMethod=row.FrequencyMethod,
#                     Quantity=1,  # Adjust this as needed
#                     Issued_Date=tablet_date_issue,
#                     Status='Pending',
#                     Location=row.Location,
#                     CapturedBy='',  # Define appropriately
#                     AdminisDose=row.AdminisDose
#                 )

#     # Handling 'Total' frequency
#     elif row.FrequencyMethod == 'Total':
#         max_id_req = ip_drug_request_table.objects.aggregate(max_id=models.Max('Drug_Request_Id'))['max_id']
#         next_id_req = max_id_req + 1 if max_id_req is not None else 1

#         existing_request_total = ip_drug_request_table.objects.filter(
#             Prescibtion_Id=row.Prescription_Id,
#             Booking_Id=row.Booking_Id
#         ).first()

#         if existing_request_total is None:
#             remaining = int(row.Quantity) - int(row.RequestQuantity)
#             ip_drug_request_table.objects.create(
#                 Drug_Request_Id=next_id_req,
#                 Booking_Id=row.Booking_Id,
#                 Prescibtion_Id=row.Prescription_Id,
#                 Department=row.Department,
#                 DoctorName=row.DoctorName,
#                 GenericName=row.GenericName,
#                 MedicineCode=row.MedicineCode,
#                 MedicineName=row.MedicineName,
#                 Dosage=row.Dosage,
#                 Route=row.Route,
#                 RequestType=row.FrequencyMethod,
#                 Quantity=row.Quantity,
#                 RequestQuantity=row.RequestQuantity,
#                 RemainingQuantity=remaining,
#                 Location=row.Location,
#                 CreatedBy=row.Location,  # Adjust as per requirement
#                 Status='Pending',
#                 Priscription_Barcode=row.Prescription_Barcode,
#                 Duration=row.Duration,
#                 DurationType=row.DurationType,
#                 Date=tablet_date_issue
#             )
#         elif existing_request_total.Status == "Received":
#             existing_administration_total = Ip_Nurse_Drug_Completed_Administration.objects.filter(
#                 Prescription_Id=row.Prescription_Id,
#                 Booking_Id=row.Booking_Id,
#                 FrequencyIssued=tablet_issue,
#                 Issued_Date=tablet_date_issue
#             ).first()

#             if existing_administration_total is None:
#                 next_id1 = Ip_Nurse_Drug_Completed_Administration.objects.aggregate(
#                     max_id=models.Max('Prescibtion_Issue_Id')
#                 )['max_id']
#                 next_id1 = next_id1 + 1 if next_id1 is not None else 1

#                 Ip_Nurse_Drug_Completed_Administration.objects.create(
#                     Prescibtion_Issue_Id=next_id1,
#                     Prescription_Id=row.Prescription_Id,
#                     Booking_Id=row.Booking_Id,
#                     Department=row.Department,
#                     DoctorName=row.DoctorName,
#                     GenericName=row.GenericName,
#                     MedicineCode=row.MedicineCode,
#                     MedicineName=row.MedicineName,
#                     Dosage=row.Dosage,
#                     Route=row.Route,
#                     FrequencyIssued=tablet_issue,
#                     FrequencyMethod=row.FrequencyMethod,
#                     Quantity=1,  # Adjust as necessary
#                     Issued_Date=tablet_date_issue,
#                     Status='Pending',
#                     Location=row.Location,
#                     CapturedBy='',  # Adjust as needed
#                     AdminisDose=row.AdminisDose
#                 )

# # Create and configure scheduler
# sched = BackgroundScheduler()

# # Calculate next run time for 08:08
# now = timezone.now()
# next_run_time = datetime.combine(now, time(13,54))

# # Schedule the job function
# sched.add_job(job_function, "date", run_date=next_run_time)
# print('Scheduler started successfully,DrugAdministration')



@csrf_exempt
def get_billing_details_due_patient(request):
    try:
        # Get Patient_Id from the query parameter
        patient_id = request.GET.get('patient_id', '')  # Default to empty string if not provided

        if not patient_id:
            return JsonResponse({"error": "Patient ID is required"}, status=400)

        # Filter the payments based on Billpay_method="Due" and Patient_Id_id=provided Patient_Id
        payment_details = IP_Pharmacy_Billing_Payments.objects.filter(
            Billpay_method="Due",
            Billing__PatientID=patient_id
        ).values(
            'Billing__Billing_Date',  # Billing's Billing_Date
            # 'Billing__Billing_Type',  # Billing's Billing_Type
            'Billing__PaidAmount'   # Billing's Paid_Amount
        )
        
        # If no records are found, return an appropriate message or empty list
        if not payment_details:
            return JsonResponse({"message": "No payment details found for the given criteria."}, status=404)

        # Return the filtered details as a JSON response
        return JsonResponse({"payment_details": list(payment_details)}, safe=False)

    except Exception as e:
        # Return an error message in JSON format
        return JsonResponse({"error": str(e)}, status=500)
    

 
@csrf_exempt
@require_http_methods(['GET'])
def Patient_Previous_Items_OPPharmacy(request):
    try:
        Patientid = request.GET.get('Patientid')
        Type = request.GET.get('type')
        if not Patientid:
            return JsonResponse({'warn': 'Patientid is Required'})
        if not Type:
            return JsonResponse({'warn': 'Type is Required'})
        if Type == 'OP':
 
        # Fetch billing details and order by created_at in descending order
            invoice_details = OP_Pharmacy_Billing_Table_Detials.objects.filter(Patient_Id=Patientid).order_by('-created_at')
 
            if not invoice_details.exists():
                return JsonResponse({'warn': 'No billing data found for the patient'})
 
            item_details = []
            index = 1
 
            # Loop through each billing record to get the corresponding items
            for invoice in invoice_details:
                billing_items = OP_BillingItem.objects.filter(Billing=invoice)
 
                for item in billing_items:
                    itemdict = {
                        'id': index,
                        'invoiceno': item.Billing.Billing_Invoice_No,
                        'ItemName': item.ItemName,
                        'Billing_Quantity': item.Billing_Quantity,
                        'Unit_Price': item.Unit_Price,
                        'Amount': item.Amount,
                        'Total': item.Total,
                        'created_at': invoice.created_at.strftime('%d/%m/%Y')  # Date in dd/mm/yyyy format
                    }
                    item_details.append(itemdict)
                    index += 1
 
            return JsonResponse(item_details, safe=False)
        elif Type == 'IP':
            print('000000000000000000')
            invoice_details = IP_Pharmacy_Billing_Table_Detials.objects.filter(Patient_Id=Patientid).order_by('-created_at')
 
            if not invoice_details.exists():
                return JsonResponse({'warn': 'No billing data found for the patient'})
 
            item_details = []
            index = 1
 
            # Loop through each billing record to get the corresponding items
            for invoice in invoice_details:
                billing_items = IP_BillingItem.objects.filter(Billing=invoice)
 
                for item in billing_items:
                    itemdict = {
                        'id': index,
                        'invoiceno': item.Billing.Billing_Invoice_No,
                        'ItemName': item.ItemName,
                        'Billing_Quantity': item.Billing_Quantity,
                        'Unit_Price': item.Unit_Price,
                        'Amount': item.Amount,
                        'Total': item.Total,
                        'created_at': invoice.created_at.strftime('%d/%m/%Y')  # Date in dd/mm/yyyy format
                    }
                    item_details.append(itemdict)
                    index += 1
 
            return JsonResponse(item_details, safe=False)
 
             
    except Exception as e:
        return JsonResponse({'error': str(e)})
    

@csrf_exempt
@require_http_methods(['POST'])
def cancel_drug_administration(request):
    try:
        # Parse incoming JSON payload
        data = json.loads(request.body.decode('utf-8'))

        # Extract required fields
        patient_id = data.get('PatientId')
        prescription_id = data.get('Prescibtion_Id')  # Fixed typo
        medicine_name = data.get('MedicineName')

        if not patient_id or not prescription_id:
            return HttpResponseBadRequest("PatientId and PrescriptionId are required")

        # Step 1: Update IP Drug Request Table
        ip_request = ip_drug_request_table.objects.filter(
            Prescription_Id=prescription_id,
            Booking_Id__PatientId=patient_id
        ).first()

        if ip_request:
            ip_request.Status = 'stopped'
            ip_request.save()
            print(f"IP request status set to 'stopped'")
        else:
            print("No IP request found")

        # Step 2: Update Doctor Drug Prescription
        drug_status = Doctor_drug_prescription.objects.filter(
            Prescription_Id=prescription_id
            # Add more filters if needed: Booking_Id__PatientId=patient_id, etc.
        ).first()

        if drug_status:
            drug_status.Status = 'stopped'
            drug_status.save()
            print(f"Doctor drug prescription status set to 'stopped'")
        else:
            return JsonResponse({"error": "No matching doctor prescription found"}, status=404)

        # Step 3: Update Nurse Drug Administration Record
        nurse_record = Ip_Nurse_Drug_Completed_Administration.objects.filter(
            Booking_Id__PatientId=patient_id,
            Prescription_Id=prescription_id
        ).last()
        print('nurse-record---',nurse_record)
        if nurse_record:
            nurse_record.Status = 'stopped'
            nurse_record.save()
            print("Nurse administration record updated to 'stopped'")
            return JsonResponse({"message": "Drug administration successfully stopped"})
        else:
            return JsonResponse({"message": "No matching nurse record found"}, status=404)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON format")
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
from django.db.models import Prefetch, Q


# @csrf_exempt
# @require_http_methods(['GET'])
# def fetch_pharmacy_billing(request):
#     try:
#         # Use GET parameters
#         date_type = request.GET.get("DateType")           
#         current_date = request.GET.get("CurrentDate")     
#         from_date = request.GET.get("FromDate")
#         to_date = request.GET.get("ToDate")
#         search_first_name = request.GET.get("SearchbyFirstName")
#         search_speciality = request.GET.get("SearchbySpeciality")
#         search_doctor = request.GET.get("SearchbyDoctor")
#         search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
#         search_status = request.GET.get("SearchStatus")           
#         location_id = request.GET.get("location")                

#         # Base queryset
#         bills = OP_Pharmacy_Billing_Table_Detials.objects.prefetch_related(
#             Prefetch("OP_billing_items"),
#             Prefetch("Pharmacy_receipt__billing_payments")
#         ).select_related("Doctor_Id", "Patient_Id", "Register_Id", "Location")


#         print(bills,'billssss')

#         # ====== Apply filters ======
#         filters = Q()
         


       
#         # Date filters
#         if date_type == 'Current' and current_date:
#             try:
#                 dt = datetime.strptime(current_date, "%Y-%m-%d").date()
#                 filters &= Q(Billing_Date=dt)
#             except ValueError:
#                 pass
#         elif from_date and to_date:
#             try:
#                 dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
#                 dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
#                 filters &= Q(Billing_Date__range=(dt_from, dt_to))
#             except ValueError:
#                 pass

#         # Patient first name filter
#         if search_first_name:

#             filters &= (Q(Patient_Id__FirstName__icontains=search_first_name) | 
#                         Q(Patient_Id__PatientId__icontains=search_first_name) | 
#                         Q(Patient_name__icontains=search_first_name) |         
#                         Q(Billing_Invoice_No__iexact=f"""{'OP/'}{search_first_name}""")
#                         )

#         # Doctor filter
#         if search_doctor:
#             filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)

#         # Doctor speciality filter
#         if search_speciality:
#             filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)

#         # Billing status filter
#         if search_status:
#             filters &= Q(Bill_Status__icontains=search_status)

#         # Location filter
#         if location_id:
#             filters &= Q(Location__Location_Id=location_id)

#         # Apply filters
#         bills = bills.filter(filters)

#         # Time ordering
#         bills = bills.order_by('created_at' if search_time_order == 'asc' else '-created_at')

#         # ===== Build JSON =====
#         datafetch = []
#         S_no = 0
#         for bill in bills:
            


#             patient = bill.Patient_Id
#             doctor = bill.Doctor_Id
#             registration = bill.Register_Id
#             receipt = bill.Pharmacy_receipt.first()
#             payments = receipt.billing_payments.all() if receipt else []

#             patient_name = bill.Patient_name if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
#             Items = []

#             for item in bill.OP_billing_items.all():
#                 stockins = Stock_Maintance_Table_Detials.objects.filter(pk=item.ItemId_id).first()
#                 grntableins = None
#                 if stockins and stockins.Grn_Details_Item_id:
#                     grntableins = GRN_Product_Item_Detials.objects.filter(pk=stockins.Grn_Details_Item_id).first()

#                     unitprice =  getattr(item, 'Unit_Price', None)
#                     Tax_Percentage = getattr(grntableins, 'Tax_Percentage', None) if grntableins else None

#                     # Gstamt = 
                


#                 Items.append({
#                     "ItemId": getattr(item, 'ItemId_id', None),
#                     "GST_Type": stockins.Product_Detials.GST_Type,
#                     "GST_value": stockins.Product_Detials.GST_Value,
#                     "CGST": stockins.Product_Detials.CGST,
#                     "SGST": stockins.Product_Detials.SGST,
#                     "BoxName": stockins.BoxName if stockins else '',
#                     "ItemName": getattr(item, 'ItemName', None),
#                     "BatchNo": getattr(item, 'BatchNo', None),
#                     "Quantity": getattr(item, 'Billing_Quantity', None),
#                     "UnitPrice": getattr(item, 'Unit_Price', None),
#                     "Total": getattr(item, 'Total', None),
#                     "ExpDate": getattr(item, 'Exp_Date', None),
#                     "Gstamt": getattr(grntableins, 'Purchase_rate_taxable', None) if grntableins else None
#                 })
                    


#             datafetch.append({
#                 "id": bill.Billing_Invoice_No,
#                 "S_no": S_no,
#                 "BillingDate": bill.Billing_Date,
#                 "BillingType": bill.Billing_Type,
#                 "BillStatus": bill.Bill_Status,
#                 "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#                 "RegisterId": bill.Register_Id.Registration_Id if bill.Register_Id else None,
#                 # Patient details
#                 "PatientId": getattr(patient, 'PatientId', None),
#                 "PatientName":patient_name,
#                 "PatientPhoneNo": getattr(patient, 'PhoneNo', None),
#                 "PatientCategory": getattr(patient, 'PatientCategory', None),
#                 "VisitId": getattr(bill.Register_Id, 'VisitId', ''),
#                 "Gender": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Gender', ''),
#                 "Age": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Age', ''),

#                 # Doctor details
#                 "DoctorId": getattr(doctor, 'Doctor_ID', None),
#                 "DoctorName": getattr(doctor, 'Doctor_Name', None),

#                 # Registration details
#                 "VisitID": getattr(registration, 'VisitId', None),
#                 "VisitPurpose": getattr(registration, 'VisitPurpose', None),

#                 # Billing totals
#                 "TotalAmount": float(getattr(bill, 'Total_Amount', 0)),
#                 "NetAmount": float(getattr(bill, 'Net_Amount', 0)),
#                 "PaidAmount": float(getattr(bill, 'Paid_Amount', 0)),
#                 "BalanceAmount": float(getattr(bill, 'Balance_Amount', 0)),
#                 "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
#                 # Billing Items
#                 "Items": Items,
#                 # Receipt
#                 "Receipt": {
#                     "VoucherNo": getattr(receipt, 'Voucher_Number', None),
#                     "TotalAmount": getattr(receipt, 'TotalAmount', None),
#                     "PaidAmount": getattr(receipt, 'PaidAmount', None),
#                     "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
#                     "BilledBy": getattr(receipt, 'Billedby', None),
#                 } if receipt else None,

#                 # Payments
#                 "Payments": [
#                     {
#                         "Method": getattr(pay, 'Billpay_method', None),
#                         "CardType": getattr(pay, 'CardType', None),
#                         "BankName": getattr(pay, 'BankName', None),
#                         "ChequeNo": getattr(pay, 'ChequeNo', None),
#                         "PaidAmount": getattr(pay, 'paidamount', None),
#                         "AdditionalAmount": getattr(pay, 'Additionalamount', None),
#                         "TransactionFee": getattr(pay, 'transactionFee', None),
#                     }
#                     for pay in payments
#                 ]
#             })

#         return JsonResponse({"pharmacy_bills": datafetch}, safe=False, status=200)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    

def short_company(name):
    if not name:
        return ""

    ignore = {"PRIVATE", "PVT", "LIMITED", "LTD", "LLP", "INC", "CORP", "COMPANY"}

    parts = name.upper().split()
    letters = [p[0] for p in parts if p not in ignore]

    return "".join(letters)


# @csrf_exempt
# @require_http_methods(['GET'])
# def fetch_pharmacy_billing(request):
#     try:
#         # Use GET parameters
#         date_type = request.GET.get("DateType")           
#         current_date = request.GET.get("CurrentDate")     
#         from_date = request.GET.get("FromDate")
#         to_date = request.GET.get("ToDate")
#         search_first_name = request.GET.get("SearchbyFirstName")
#         search_speciality = request.GET.get("SearchbySpeciality")
#         search_doctor = request.GET.get("SearchbyDoctor")
#         search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
#         search_status = request.GET.get("SearchStatus")           
#         location_id = request.GET.get("location")                

#         # Base queryset
#         bills = OP_Pharmacy_Billing_Table_Detials.objects.prefetch_related(
#             Prefetch("OP_billing_items"),
#             Prefetch("Pharmacy_receipt__billing_payments")
#         ).select_related("Doctor_Id", "Patient_Id", "Register_Id", "Location")


#         print(bills,'billssss')

#         # ====== Apply filters ======
#         filters = Q()
         


       
#         # Date filters
#         if date_type == 'Current' and current_date:
#             try:
#                 dt = datetime.strptime(current_date, "%Y-%m-%d").date()
#                 filters &= Q(Billing_Date=dt)
#             except ValueError:
#                 pass
#         elif from_date and to_date:
#             try:
#                 dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
#                 dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
#                 filters &= Q(Billing_Date__range=(dt_from, dt_to))
#             except ValueError:
#                 pass

#         # Patient first name filter
#         if search_first_name:

#             filters &= (Q(Patient_Id__FirstName__icontains=search_first_name) | 
#                         Q(Patient_Id__PatientId__icontains=search_first_name) | 
#                         Q(Patient_name__icontains=search_first_name) |         
#                         Q(Billing_Invoice_No__iexact=f"""{'OP/'}{search_first_name}""")
#                         )

#         # Doctor filter
#         if search_doctor:
#             filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)

#         # Doctor speciality filter
#         if search_speciality:
#             filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)

#         # Billing status filter
#         if search_status:
#             filters &= Q(Bill_Status__icontains=search_status)

#         # Location filter
#         if location_id:
#             filters &= Q(Location__Location_Id=location_id)

#         # Apply filters
#         bills = bills.filter(filters)

#         # Time ordering
#         bills = bills.order_by('created_at' if search_time_order == 'asc' else '-created_at')

#         # ===== Build JSON =====
#         datafetch = []
#         S_no = 0
#         for bill in bills:
            


#             patient = bill.Patient_Id
#             doctor = bill.Doctor_Id
#             registration = bill.Register_Id
#             receipt = bill.Pharmacy_receipt.first()
#             payments = receipt.billing_payments.all() if receipt else []

#             patient_name = bill.Patient_name if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
#             Items = []

#             for item in bill.OP_billing_items.all():

#                 # Fetch Stock info
#                 stockins = Stock_Maintance_Table_Detials.objects.filter(pk=item.ItemId_id).first()

#                 # Default values
#                 gst_type = None
#                 gst_value = None
#                 cgst = None
#                 sgst = None
#                 boxname = ''
#                 gst_amt = None

#                 # If stock exists
#                 if stockins:
#                     boxname = getattr(stockins, "BoxName", "")

#                     # Handle Product Details safely
#                     product = getattr(stockins, "Product_Detials", None)
#                     if product:
#                         gst_type = getattr(product, "GST_Type", None)
#                         gst_value = getattr(product, "GST_Value", None)
#                         cgst = getattr(product, "CGST", None)
#                         sgst = getattr(product, "SGST", None)
#                         company_full = getattr(getattr(product, "CompanyName", None), "CompanyName", "")
#                         company_short = short_company(company_full)

                        
#                     # Fetch GRN details safely
#                     if getattr(stockins, "Grn_Details_Item_id", None):
#                         grntableins = GRN_Product_Item_Detials.objects.filter(pk=stockins.Grn_Details_Item_id).first()
#                         if grntableins:
#                             gst_amt = getattr(grntableins, "Purchase_rate_taxable", None)

#                 # Append to Items
#                 Items.append({
#                     "ItemId": getattr(item, 'ItemId_id', None),
#                     "GST_Type": gst_type,
#                     "GST_value": gst_value,
#                     "CGST": cgst,
#                     "SGST": sgst,
#                     "BoxName": boxname,
#                     "CompanyName": company_full,
# "CompanyShort": company_short,

#                     "ItemName": getattr(item, 'ItemName', None),
#                     "BatchNo": getattr(item, 'BatchNo', None),
#                     "Quantity": getattr(item, 'Billing_Quantity', None),
#                     "UnitPrice": getattr(item, 'Unit_Price', None),
#                     "Total": getattr(item, 'Total', None),
#                     "ExpDate": getattr(item, 'Exp_Date', None),
#                     "Gstamt": gst_amt
#                 })

                    


#             datafetch.append({
#                 "id": bill.Billing_Invoice_No,
#                 "S_no": S_no,
#                 "BillingDate": bill.Billing_Date,
#                 "BillingType": bill.Billing_Type,
#                 "BillStatus": bill.Bill_Status,
#                 "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#                 "RegisterId": bill.Register_Id.Registration_Id if bill.Register_Id else None,
#                 # Patient details
#                 "PatientId": getattr(patient, 'PatientId', None),
#                 "PatientName":patient_name,
#                 "PatientPhoneNo": getattr(patient, 'PhoneNo', None),
#                 "PatientCategory": getattr(patient, 'PatientCategory', None),
#                 "VisitId": getattr(bill.Register_Id, 'VisitId', ''),
#                 "Gender": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Gender', ''),
#                 "Age": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Age', ''),

#                 # Doctor details
#                 "DoctorId": getattr(doctor, 'Doctor_ID', None),
#                 "DoctorName": getattr(doctor, 'Doctor_Name', None),

#                 # Registration details
#                 "VisitID": getattr(registration, 'VisitId', None),
#                 "VisitPurpose": getattr(registration, 'VisitPurpose', None),

#                 # Billing totals
#                 "TotalAmount": float(getattr(bill, 'Total_Amount', 0)),
#                 "NetAmount": float(getattr(bill, 'Net_Amount', 0)),
#                 "PaidAmount": float(getattr(bill, 'Paid_Amount', 0)),
#                 "BalanceAmount": float(getattr(bill, 'Balance_Amount', 0)),
#                 "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
#                 # Billing Items
#                 "Items": Items,
#                 # Receipt
#                 "Receipt": {
#                     "VoucherNo": getattr(receipt, 'Voucher_Number', None),
#                     "TotalAmount": getattr(receipt, 'TotalAmount', None),
#                     "PaidAmount": getattr(receipt, 'PaidAmount', None),
#                     "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
#                     "BilledBy": getattr(receipt, 'Billedby', None),
#                 } if receipt else None,

#                 # Payments
#                 "Payments": [
#                     {
#                         "Method": getattr(pay, 'Billpay_method', None),
#                         "CardType": getattr(pay, 'CardType', None),
#                         "BankName": getattr(pay, 'BankName', None),
#                         "ChequeNo": getattr(pay, 'ChequeNo', None),
#                         "PaidAmount": getattr(pay, 'paidamount', None),
#                         "AdditionalAmount": getattr(pay, 'Additionalamount', None),
#                         "TransactionFee": getattr(pay, 'transactionFee', None),
#                     }
#                     for pay in payments
#                 ]
#             })

#         return JsonResponse({"pharmacy_bills": datafetch}, safe=False, status=200)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(['GET'])
def fetch_pharmacy_billing(request):
    try:
        # Use GET parameters
        date_type = request.GET.get("DateType")           
        current_date = request.GET.get("CurrentDate")     
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        search_status = request.GET.get("SearchStatus")           
        location_id = request.GET.get("location")   
        RegisterId = request.GET.get("RegisterId")   


        # Base queryset
        bills = OP_Pharmacy_Billing_Table_Detials.objects.prefetch_related(
            Prefetch("OP_billing_items"),
            Prefetch("Pharmacy_receipt__billing_payments")
        ).select_related("Doctor_Id", "Patient_Id", "Register_Id", "Location")


        print(bills,'billssss')

        # ====== Apply filters ======
        filters = Q()
         


       
        # Date filters

        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(Billing_Date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(Billing_Date__range=(dt_from, dt_to))
            except ValueError:
                pass

        # Patient first name filter
        if search_first_name:

            filters &= (Q(Patient_Id__FirstName__icontains=search_first_name) | 
                        Q(Patient_Id__PatientId__icontains=search_first_name) | 
                        Q(Patient_name__icontains=search_first_name) |         
                        Q(Billing_Invoice_No__iexact=f"""{'OP/'}{search_first_name}""")
                        )

        # Doctor filter
        if RegisterId:
            filters &= Q(Register_Id__Registration_Id = RegisterId)
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)

        # Doctor speciality filter
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)

        # Billing status filter
        if search_status:
            filters &= Q(Bill_Status__icontains=search_status)

        # Location filter
        if location_id:
            filters &= Q(Location__Location_Id=location_id)

        # Apply filters
        bills = bills.filter(filters)

        # Time ordering
        bills = bills.order_by('created_at' if search_time_order == 'asc' else '-created_at')

        # ===== Build JSON =====
        datafetch = []
        S_no = 0
        for bill in bills:
            


            patient = bill.Patient_Id
            doctor = bill.Doctor_Id
            registration = bill.Register_Id
            receipt = bill.Pharmacy_receipt.first()
            payments = receipt.billing_payments.all() if receipt else []

            patient_name = bill.Patient_name if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
            Items = []

            for item in bill.OP_billing_items.all():

                # Fetch Stock info
                stockins = Stock_Maintance_Table_Detials.objects.filter(pk=item.ItemId_id).first()

                # Default values
                gst_type = None
                gst_value = None
                cgst = None
                sgst = None
                boxname = ''
                gst_amt = None

                # If stock exists
                if stockins:
                    boxname = getattr(stockins, "BoxName", "")
                    Product_Detials = getattr(stockins, "Product_Detials", "")
                    company = getattr(Product_Detials, "CompanyName", None)
                    company_name = getattr(company, "CompanyName", None)


                    # Handle Product Details safely
                    product = getattr(stockins, "Product_Detials", None)
                    if product:
                        gst_type = getattr(product, "GST_Type", None)
                        gst_value = getattr(product, "GST_Value", None)
                        cgst = getattr(product, "CGST", None)
                        sgst = getattr(product, "SGST", None)

                    # Fetch GRN details safely
                    if getattr(stockins, "Grn_Details_Item_id", None):
                        grntableins = GRN_Product_Item_Detials.objects.filter(pk=stockins.Grn_Details_Item_id).first()
                        if grntableins:
                            gst_amt = getattr(grntableins, "Purchase_rate_taxable", None)

                # Append to Items
                Items.append({
                    "ItemId": getattr(item, 'ItemId_id', None),
                    "CompanyName": company_name[:3] if company_name else "",
                    "GST_Type": gst_type,
                    "GST_value": gst_value,
                    "CGST": cgst,
                    "SGST": sgst,
                    "BoxName": boxname,
                    "ItemName": getattr(item, 'ItemName', None),
                    "BatchNo": getattr(item, 'BatchNo', None),
                    "Quantity": getattr(item, 'Billing_Quantity', None),
                    "UnitPrice": getattr(item, 'Unit_Price', None),
                    "Total": getattr(item, 'Total', None),
                    "ExpDate": getattr(item, 'Exp_Date', None),
                    "Gstamt": gst_amt
                })

                    


            datafetch.append({
                "id": bill.Billing_Invoice_No,
                "S_no": S_no,
                "BillingDate": bill.Billing_Date,
                "BillingType": bill.Billing_Type,
                "BillStatus": bill.Bill_Status,
                "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "RegisterId": bill.Register_Id.Registration_Id if bill.Register_Id else None,
                # Patient details
                "PatientId": getattr(patient, 'PatientId', None),
                "PatientName":patient_name,
                "PatientPhoneNo": getattr(patient, 'PhoneNo', None),
                "PatientCategory": getattr(patient, 'PatientCategory', None),
                "VisitId": getattr(bill.Register_Id, 'VisitId', ''),
                "Gender": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Gender', ''),
                "Age": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Age', ''),

                # Doctor details
                "DoctorId": getattr(doctor, 'Doctor_ID', None),
                "DoctorName": getattr(doctor, 'Doctor_Name', None),

                # Registration details
                "VisitID": getattr(registration, 'VisitId', None),
                "VisitPurpose": getattr(registration, 'VisitPurpose', None),

                # Billing totals
                "TotalAmount": float(getattr(bill, 'Total_Amount', 0)),
                "NetAmount": float(getattr(bill, 'Net_Amount', 0)),
                "PaidAmount": float(getattr(bill, 'Paid_Amount', 0)),
                "BalanceAmount": float(getattr(bill, 'Balance_Amount', 0)),
                "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
                # Billing Items
                "Items": Items,
                # Receipt
                "Receipt": {
                    "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                    "TotalAmount": getattr(receipt, 'TotalAmount', None),
                    "PaidAmount": getattr(receipt, 'PaidAmount', None),
                    "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                    "BilledBy": getattr(receipt, 'Billedby', None),
                } if receipt else None,

                # Payments
                "Payments": [
                    {
                        "Method": getattr(pay, 'Billpay_method', None),
                        "CardType": getattr(pay, 'CardType', None),
                        "BankName": getattr(pay, 'BankName', None),
                        "ChequeNo": getattr(pay, 'ChequeNo', None),
                        "PaidAmount": getattr(pay, 'paidamount', None),
                        "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                        "TransactionFee": getattr(pay, 'transactionFee', None),
                    }
                    for pay in payments
                ]
            })

        return JsonResponse({"pharmacy_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(['GET'])
def fetch_pharmacy_billing_optical(request):
    try:
        # Use GET parameters
        date_type = request.GET.get("DateType")           
        current_date = request.GET.get("CurrentDate")     
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        search_status = request.GET.get("SearchStatus")           
        location_id = request.GET.get("location")                

        # Base queryset
        bills = OP_Pharmacy_Billing_Table_Detials_optical.objects.prefetch_related(
            Prefetch("OP_billing_items_optical"),
            Prefetch("Pharmacy_receipt_optical__billing_payments_optical")
        ).select_related("Doctor_Id", "Patient_Id", "Register_Id", "Location")


        print(bills,'billssss')

        # ====== Apply filters ======
        filters = Q()
         


       
        # Date filters
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(Billing_Date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(Billing_Date__range=(dt_from, dt_to))
            except ValueError:
                pass

        # Patient first name filter
        if search_first_name:

            filters &= (Q(Patient_Id__FirstName__icontains=search_first_name) | 
                        Q(Patient_Id__PatientId__icontains=search_first_name) | 
                        Q(Patient_name__icontains=search_first_name) |         
                        Q(Billing_Invoice_No__iexact=f"""{'OP/'}{search_first_name}""")
                        )

        # Doctor filter
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)

        # Doctor speciality filter
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)

        # Billing status filter
        if search_status:
            filters &= Q(Bill_Status__icontains=search_status)

        # Location filter
        if location_id:
            filters &= Q(Location__Location_Id=location_id)

        # Apply filters
        bills = bills.filter(filters)

        # Time ordering
        bills = bills.order_by('created_at' if search_time_order == 'asc' else '-created_at')

        # ===== Build JSON =====
        datafetch = []
        S_no = 0
        for bill in bills:
            


            patient = bill.Patient_Id
            doctor = bill.Doctor_Id
            registration = bill.Register_Id
            receipt = bill.Pharmacy_receipt_optical.first()
            payments = receipt.billing_payments_optical.all() if receipt else []

            patient_name = bill.Patient_name if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
            Items = []

            for item in bill.OP_billing_items_optical.all():

                stockins = Stock_Maintance_Table_Detials.objects.filter(pk=item.ItemId_id).first()

                gst_type = None
                gst_value = None
                cgst = None
                sgst = None
                boxname = ''
                gst_amt = None
                company_full = ""         # <--- ADD DEFAULT
                company_short = ""        # <--- ADD DEFAULT

                # If stock exists
                if stockins:
                    boxname = getattr(stockins, "BoxName", "")

                    product = getattr(stockins, "Product_Detials", None)

                    if product:
                        gst_type = getattr(product, "GST_Type", None)
                        gst_value = getattr(product, "GST_Value", None)
                        cgst = getattr(product, "CGST", None)
                        sgst = getattr(product, "SGST", None)

                        # Safe company fetch
                        company_full = getattr(getattr(product, "CompanyName", None), "CompanyName", "") or ""
                        company_short = short_company(company_full) if company_full else ""

                    # Fetch GRN safely
                    if getattr(stockins, "Grn_Details_Item_id", None):
                        grntableins = GRN_Product_Item_Detials.objects.filter(pk=stockins.Grn_Details_Item_id).first()
                        if grntableins:
                            gst_amt = getattr(grntableins, "Purchase_rate_taxable", None)

                Items.append({
                    "ItemId": item.ItemId_id,
                    "GST_Type": gst_type,
                    "GST_value": gst_value,
                    "CGST": cgst,
                    "SGST": sgst,
                    "BoxName": boxname,
                    "CompanyName": company_full,
                    "CompanyShort": company_short,

                    "ItemName": item.ItemName,
                    "BatchNo": item.BatchNo,
                    "Quantity": item.Billing_Quantity,
                    "UnitPrice": item.Unit_Price,
                    "Total": item.Total,
                    "ExpDate": item.Exp_Date,
                    "Gstamt": gst_amt
                })


                    


            datafetch.append({
                "id": bill.Billing_Invoice_No,
                "S_no": S_no,
                "BillingDate": bill.Billing_Date,
                "BillingType": bill.Billing_Type,
                "BillStatus": bill.Bill_Status,
                "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "RegisterId": bill.Register_Id.Registration_Id if bill.Register_Id else None,
                # Patient details
                "PatientId": getattr(patient, 'PatientId', None),
                "PatientName":patient_name,
                "PatientPhoneNo": getattr(patient, 'PhoneNo', None),
                "PatientCategory": getattr(patient, 'PatientCategory', None),
                "VisitId": getattr(bill.Register_Id, 'VisitId', ''),
                "Gender": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Gender', ''),
                "Age": getattr(getattr(bill.Register_Id, 'PatientId', None), 'Age', ''),

                # Doctor details
                "DoctorId": getattr(doctor, 'Doctor_ID', None),
                "DoctorName": getattr(doctor, 'Doctor_Name', None),

                # Registration details
                "VisitID": getattr(registration, 'VisitId', None),
                "VisitPurpose": getattr(registration, 'VisitPurpose', None),

                # Billing totals
                "TotalAmount": float(getattr(bill, 'Total_Amount', 0)),
                "NetAmount": float(getattr(bill, 'Net_Amount', 0)),
                "PaidAmount": float(getattr(bill, 'Paid_Amount', 0)),
                "BalanceAmount": float(getattr(bill, 'Balance_Amount', 0)),
                "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
                # Billing Items
                "Items": Items,
                # Receipt
                "Receipt": {
                    "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                    "TotalAmount": getattr(receipt, 'TotalAmount', None),
                    "PaidAmount": getattr(receipt, 'PaidAmount', None),
                    "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                    "BilledBy": getattr(receipt, 'Billedby', None),
                } if receipt else None,

                # Payments
                "Payments": [
                    {
                        "Method": getattr(pay, 'Billpay_method', None),
                        "CardType": getattr(pay, 'CardType', None),
                        "BankName": getattr(pay, 'BankName', None),
                        "ChequeNo": getattr(pay, 'ChequeNo', None),
                        "PaidAmount": getattr(pay, 'paidamount', None),
                        "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                        "TransactionFee": getattr(pay, 'transactionFee', None),
                    }
                    for pay in payments
                ]
            })

        return JsonResponse({"pharmacy_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(['GET'])
def fetch_ip_pharmacy_billing(request):
    try:
        # ===== GET parameters =====
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # asc or desc
        search_status = request.GET.get("SearchStatus")
        location_id = request.GET.get("location")
        Pharma_Type = request.GET.get("Pharma_Type")
        RegisterId = request.GET.get("RegisterId")


        # ===== Filters =====
        filters = Q()
        if Pharma_Type:
            filters &= Q(Billing_Type=Pharma_Type)

        if RegisterId:
            filters &= Q(Register_Id__Registration_Id=RegisterId)    

        # Date filter
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date__range=(dt_from, dt_to))
            except ValueError:
                pass

        # Patient name / phone
        if search_first_name:
            filters &= (
                Q(Patient_Id__FirstName__icontains=search_first_name) |
                Q(Patient_Id__PatientId__icontains=search_first_name) |
                Q(PatientName__icontains=search_first_name) |
                # Q(Billing_Invoice_No__iexact=f"""{"IP/"}{search_first_name}""")
                Q(Billing_Invoice_No__icontains=search_first_name) | 
                Q (Billing_Invoice_No__icontains=f"IP/{search_first_name}")
            )

        # Doctor name
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)

        # Doctor speciality
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)

        # Billing status
        if search_status:
            filters &= Q(Bill_Status=search_status)

        # Location
        if location_id:
            filters &= Q(Location__Location_Id=location_id)

        # ===== Base queryset =====
        bills = IP_Pharmacy_Billing_Table_Detials.objects.filter(filters).prefetch_related(
            Prefetch("IP_billing_items"),
            Prefetch("IPPharmacy_receipt__IP_billing_payments")
        ).order_by('created_at' if search_time_order == 'asc' else '-created_at')[:10]

        print(len(bills),'billssssss')

        # ===== Preload stock mapping =====
        stock_map = {
            (s.Product_Detials.ItemName, s.Batch_No): s.BoxName
            for s in Stock_Maintance_Table_Detials.objects.filter(Store_location__pk = 3)
        }
        stock_map1 = {
            (s.Product_Detials.ItemName, s.Batch_No): s.Product_Detials.GST_Value
            for s in Stock_Maintance_Table_Detials.objects.filter(Store_location__pk = 3)
        }

        stock_map2 = {
    stock.Product_Detials.ItemName: (
        stock.Product_Detials.CompanyName.CompanyName
        if stock.Product_Detials and stock.Product_Detials.CompanyName
        else ''
    )
    for stock in Stock_Maintance_Table_Detials.objects
        .select_related('Product_Detials__CompanyName')
}


        # ===== Build response =====
        datafetch = []
        for S_no, bill in enumerate(bills, start=1):
            try:
                patient = getattr(bill, 'Patient_Id', None)
                doctor = getattr(bill, 'Doctor_Id', None)
                registration = getattr(bill, 'Register_Id', None)
                receipt = bill.IPPharmacy_receipt.first() if hasattr(bill, 'IPPharmacy_receipt') else None
                payments = receipt.IP_billing_payments.all() if receipt else []

                

                # Build patient name
                patient_name = (
                    bill.PatientName
                    if not patient
                    else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
                )
                
                # Main structure
                datafetch.append({
                    "id": getattr(bill, 'Billing_Invoice_No', None),
                    "S_no": S_no,
                    "BillingDate": getattr(bill, 'Billing_Date', None),
                    "BillingType": getattr(bill, 'Billing_Type', None),
                    "type": 'IP' if getattr(bill, 'Billing_Type', '') == "IPPharmacy" else 'FOC',
                    "Status": getattr(bill, 'Bill_Status', None),
                    "Billed_By": getattr(bill, 'created_by', None),
                    "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S") if bill.created_at else None,
                    "RegisterId": getattr(registration, 'Registration_Id', None),
                    "PharmacyType": getattr(bill, 'PharmacyType', None),

                    # ===== Patient details =====
                    "PatientId": getattr(patient, 'PatientId', None),
                    "PatientName": patient_name,
                    "PatientPhoneNo": getattr(patient, 'PhoneNo', None),
                    "PatientCategory": getattr(registration, 'PatientCategory', None),
                    "VisitId": getattr(registration, 'VisitId', ''),
                    "Gender": getattr(getattr(registration, 'PatientId', None), 'Gender', ''),
                    "Age": getattr(getattr(registration, 'PatientId', None), 'Age', ''),

                    # ===== Doctor details =====
                    "DoctorId": getattr(doctor, 'Doctor_ID', None),
                    "DoctorName": f"Dr.{getattr(doctor, 'First_Name', '')}" if doctor else None,
                    "VisitPurpose": getattr(registration, 'VisitPurpose', None),

                    # ===== Billing totals =====
                    "TotalAmount": float(getattr(bill, 'Total_Amount', 0) or 0),
                    "NetAmount": float(getattr(bill, 'Net_Amount', 0) or 0),
                    "PaidAmount": float(getattr(bill, 'Paid_Amount', 0) or 0),
                    "BalanceAmount": float(getattr(bill, 'Balance_Amount', 0) or 0),
                    "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),

                    # ===== Billing items =====
                    
                    "Items": [
                        {
                            "ItemId": getattr(item, 'ItemId_id', None),
                            "BoxName": stock_map.get(
                                (getattr(item, 'ItemName', None), getattr(item, 'BatchNo', None)), ''
                            ),
                            "GST_value": stock_map1.get(
                                (getattr(item, 'ItemName', None), getattr(item, 'BatchNo', None)), ''
                            ),
                  
                          
    "CompanyName": stock_map2.get(
    (getattr(item, 'ItemName', None), getattr(item, 'BatchNo', None)),
    ''
),

                            "ItemName": getattr(item, 'ItemName', None),
                            "BatchNo": getattr(item, 'BatchNo', None),
                            "Quantity": getattr(item, 'Billing_Quantity', None),
                            "UnitPrice": getattr(item, 'Unit_Price', None),
                            "Total": getattr(item, 'Total', None),
                            "ExpDate": getattr(item, 'Exp_Date', None),
                        }
                        for item in getattr(bill, 'IP_billing_items', []).all()
                    ],

                    # ===== Receipt =====
                    "Receipt": {
                        "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                        "TotalAmount": getattr(receipt, 'TotalAmount', None),
                        "PaidAmount": getattr(receipt, 'PaidAmount', None),
                        "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                        "BilledBy": getattr(receipt, 'Billedby', None),
                    } if receipt else None,

                    # ===== Payments =====
                    "Payments": [
                        {
                            "Method": getattr(pay, 'Billpay_method', None),
                            "CardType": getattr(pay, 'CardType', None),
                            "BankName": getattr(pay, 'BankName', None),
                            "ChequeNo": getattr(pay, 'ChequeNo', None),
                            "PaidAmount": getattr(pay, 'paidamount', None),
                            "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                            "TransactionFee": getattr(pay, 'transactionFee', None),
                        }
                        for pay in payments
                    ]
                })

            except Exception as inner_err:
                # Skip problematic records gracefully
                datafetch.append({
                    "S_no": S_no,
                    "error": f"Skipped record due to: {inner_err}",
                    "Billing_Invoice_No": getattr(bill, 'Billing_Invoice_No', None)
                })
                continue

        # ===== Return response =====
        return JsonResponse(datafetch, safe=False, status=200)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def fetch_due_ip_pharmacy_billing(request):
    try:
        # Extract query params
        search_status = request.GET.get("SearchStatus")
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_order = request.GET.get("SearchTimeOrderby")
        location_id = request.GET.get("location")
        Pharma_Type = request.GET.get("Pharma_Type")
        
        # Start query only for "Due" bills
        bills = (
            IP_Pharmacy_Billing_Table_Detials.objects
            .filter(Bill_Status__iexact="Due")
            .prefetch_related("IP_billing_items")
            .select_related("Patient_Id", "Doctor_Id", "Register_Id")
        )

        # ==== Apply Filters ====
        if search_first_name:
            bills = bills.filter(Patient_Id__FirstName__icontains=search_first_name)
        if Pharma_Type:
            bills = bills.filter(Billing_Type=Pharma_Type)

        if search_doctor:
            bills = bills.filter(Doctor_Id__Doctor_ID__icontains=search_doctor)

        if search_speciality:
            bills = bills.filter(Doctor_Id__Specialization__icontains=search_speciality)

        # Date filters
        if date_type == "Current" and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                bills = bills.filter(created_at__date=dt)
            except ValueError:
                pass
        elif date_type == "Customize" and from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                bills = bills.filter(created_at__date__range=(dt_from, dt_to))
            except ValueError:
                pass

        # Location filter
        if location_id:
            bills = bills.filter(Location__Location_Id=location_id)

        # Orderby filter
        if search_order == "asc":
            bills = bills.order_by("Billing_Date")
        elif search_order == "desc":
            bills = bills.order_by("-Billing_Date")
        else:
            bills = bills.order_by("-created_at")

        # ==== Build Response ====
        datafetch = []
        S_no = 1
        for bill in bills:
            patient = getattr(bill, "Patient_Id", None)
            doctor = getattr(bill, "Doctor_Id", None)
            registration = getattr(bill, "Register_Id", None)

            patient_name = bill.PatientName if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()


            # Safe doctor name
            doctor_name = ""
            if doctor:
                doctor_name = " ".join(filter(None, [
                    getattr(doctor, "First_Name", ""),
                    getattr(doctor, "Middle_Name", ""),
                    getattr(doctor, "Last_Name", "")
                ]))

            # Build items
            items = [
                {
                    "ItemId": getattr(item, "ItemId_id", None),
                    "ItemName": getattr(item, "ItemName", None),
                    "Quantity": getattr(item, "Billing_Quantity", None),
                    "UnitPrice": getattr(item, "Unit_Price", None),
                    "Total": getattr(item, "Total", None),
                    "BatchNo": getattr(item, "BatchNo", None),
                    "ExpDate": getattr(item, "Exp_Date", None),
                }
                for item in bill.IP_billing_items.all()
            ]

            datafetch.append({
                "id": getattr(bill, "Billing_Invoice_No", ""),
                "S_no": S_no,
                "BillingDate":f'{bill.Billing_Date} { bill.created_at.strftime("%H:%M:%S") if bill.created_at else ""}',
                "BillingType": getattr(bill, "Billing_Type", ""),
                "Status": getattr(bill, "Bill_Status", ""),
                "RegisterId": getattr(registration, "Registration_Id", "") if registration else "",
                
                # Patient details
                "PatientId": getattr(patient, "PatientId", None) if patient else None,
                "PatientName": patient_name,
                "PatientPhoneNo": getattr(patient, "PhoneNo", "") if patient else "",

                # Doctor details
                "DoctorId": getattr(doctor, "Doctor_ID", None) if doctor else None,
                "DoctorName": f"Dr. {doctor_name}" if doctor_name else "",
                "PatientCategory": getattr(registration, "PatientCategory", "") if registration else "",
     "Billed_By":bill.created_by,
    "Time": bill.created_at.strftime("%H:%M:%S") if bill.created_at else "",
  "Gender":bill.Register_Id.PatientId.Gender if bill.Register_Id else '',
                "Age": bill.Register_Id.PatientId.Age if bill.Register_Id else '',

                # Totals
                "TotalAmount": float(getattr(bill, "Total_Amount", 0)),
                "NetAmount": float(getattr(bill, "Net_Amount", 0)),
                "PaidAmount": float(getattr(bill, "Paid_Amount", 0)),
                "BalanceAmount": float(getattr(bill, "Balance_Amount", 0)),

                # Items
                "Items": items
            })
            S_no += 1

        return JsonResponse(datafetch, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Max
from datetime import datetime
import num2words

@csrf_exempt
@require_http_methods(['GET'])
def fetch_ip_pharmacy_refund_billing(request):
    try:
        # ---------------------
        # Filters
        # ---------------------
        pharma = request.GET.get("pharma")           
        date_type = request.GET.get("DateType")           
        current_date = request.GET.get("CurrentDate")     
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_status = request.GET.get("SearchStatus")           
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        location_id = request.GET.get("location") 
        # ---------------------
        # Base queryset
        # ---------------------

        

        bills = IPPharmacyBillingRefundReceipt.objects.exclude(Invoice_NO__Invoice_NO__Billing_Type='FREE PHARMACY')
        
        if pharma =='3':
            print('ulla vanten')
            bills = IPPharmacyBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO__Billing_Type='IP PHARMACY')
        filters = Q()

        # ---------------------
        # Date filter
        # ---------------------
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date__range=(dt_from, dt_to))
            except ValueError:
                pass

        # Patient name filter
        if search_first_name:
            filters &= Q(Patient_Name__icontains=search_first_name)

        # Doctor/Speciality filter via Invoice -> IP_Pharmacy_Billing_Table_Detials
        if search_doctor:
            filters &= Q(Invoice_NO__Doctor_Id__Doctor_Name__icontains=search_doctor)
        if search_speciality:
            filters &= Q(Invoice_NO__Doctor_Id__Speciality__icontains=search_speciality)

        # Status filter
        if search_status:
            status_map = {"Refunded": "RefundPayment"}  # Adjust if needed
            filters &= Q(NewPayment__icontains=status_map.get(search_status, search_status))

        # Location filter via Invoice -> IP_Pharmacy_Billing_Table_Detials
        # if location_id:
        #     filters &= Q(Invoice_NO__Location__Location_Id=location_id)

        # ---------------------
        # Apply filters & order
        # ---------------------
        bills = bills.filter(filters)
        bills = bills.order_by('-CreatedAt')

        # ---------------------
        # Build JSON response
        # ---------------------
        datafetch = []
        # for idx, bill in enumerate(bills, start=1):
        #     invoice = bill.Invoice_NO
        #     payments = bill.IPPharmacy_Receipt_No_Payments_Refund.all() if invoice else []
        #     registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()
        #     print("Billing",bill.Invoice_NO.pk)
        #     re_item = IP_BillingItem_Refund.objects.filter(Billing = bill)
        #     print("Item",re_item)
        #     datafetch.append({
        #         "S_No": idx,
        #         "id": bill.Voucher_Number,
        #         "BillingDate": bill.Billing_Date,
        #         "Bill_Status": bill.NewPayment,
        #         "PatientId": bill.PatientID,
        #         "Patient_Name": bill.Patient_Name,
        #         "PhoneNo": bill.PhoneNumber,
        #         "PatientCategory": registration.PatientCategory if registration else "",
        #         "Doctor_Name": f'Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}' if registration and registration.PrimaryDoctor else "",
        #         # "Speciality": registration.DoctorId.Speciality if registration and registration.DoctorId else "",
        #         "amount_in_words":num2words.num2words(bill.TotalAmount),
        #         "TotalAmount": float(bill.TotalAmount),
        #         "PaidAmount": float(bill.PaidAmount),
        #         "BalanceAmount": float(bill.BalanceAmount),
        #         "BilledBy": bill.Billedby,
        #         "Status": bill.NewPayment,
        #        # Refund payments
        #         "Payments": [
        #             {
        #                 "Payment_Type": pay.Payment_Type,  # was Billpay_method
        #                 "CardType": pay.Cart_Type,
        #                 "BankName": pay.Bank_Name,
        #                 "ChequeNo": pay.Cheque_No,
        #                 "Transaction_Amount": float(pay.Transaction_Amount),
        #                 "AdditionalAmount": float(pay.AdditionalAmount),
        #                 "Amount": float(pay.Amount),
        #             } for pay in payments
        #         ],                        
        #             # Items (dot-matrix bill)
        #         "Items": [
        #                 {
        #                     "ItemName": item.ItemName,
        #                     "BatchNo": item.BatchNo,
        #                     "ExpDate": item.Exp_Date,
        #                     "Quantity": item.Refund_Quantity,
        #                     "UnitPrice": float(item.Unit_Price),
        #                     "Total": float(item.Total),
        #                 }
        #                 for item in re_item
        #             ]
        #     })


        for idx, bill in enumerate(bills, start=1):
            invoice = bill.Invoice_NO
            print("invoice------",invoice,bill.Patient_Name)
            payments = bill.IPPharmacy_Receipt_No_Payments_Refund.all() if invoice else []
            registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()
            patient = Patient_Detials.objects.filter(PatientId=bill.PatientID).first()
            # Refund items for this bill
            refund_items = IP_BillingItem_Refund.objects.filter(Billing=bill)
            patient = Patient_Detials.objects.filter(PatientId=bill.PatientID).first()
            registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()

            age = patient.Age if patient and patient.Age else ""
            gender = patient.Gender if patient and patient.Gender else ""
            patient_category = registration.PatientCategory if registration and registration.PatientCategory else ""
            doctor_name = ""

            if registration and registration.PrimaryDoctor:
                doc = registration.PrimaryDoctor
                doctor_name = f"Dr. {doc.First_Name} {doc.Middle_Name or ''} {doc.Last_Name or ''}".strip()

            datafetch.append({
    "S_No": idx,
    "id": bill.Voucher_Number,
    "Billing_Date": bill.Billing_Date,
    "Bill_Status": bill.NewPayment,
    "PatientId": bill.PatientID,
    "Patient_Name": bill.Patient_Name or "",
    "PatientAge": age,
    "PatientGender": gender,
    "PhoneNo": bill.PhoneNumber or "",
    "PatientCategory": patient_category,
    "Doctor_Name": doctor_name,
    "TotalAmount": float(bill.TotalAmount),
    "PaidAmount": float(bill.PaidAmount),
    "BalanceAmount": float(bill.BalanceAmount),
    "BilledBy": bill.Billedby,
    "Status": bill.NewPayment,
    "time": bill.CreatedAt.strftime("%H:%M"),

    "Payments": [
        {
            "Payment_Type": pay.Payment_Type,
            "CardType": pay.Cart_Type,
            "BankName": pay.Bank_Name,
            "ChequeNo": pay.Cheque_No,
            "Transaction_Amount": float(pay.Transaction_Amount),
            "AdditionalAmount": float(pay.AdditionalAmount),
            "Amount": float(pay.Amount),
        }
        for pay in payments
    ],

    "Items": [
        {
            "ItemName": item.ItemName,
            "BatchNo": item.BatchNo,
            "ExpDate": item.Exp_Date,
            "Quantity": item.Refund_Quantity,
            "UnitPrice": float(item.Unit_Price),
            "Total": float(item.Total),
        }
        for item in refund_items
    ]
})

        return JsonResponse({"ip_pharmacy_refund_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        print(str(e))
        return JsonResponse({"error": str(e)}, status=500)
    


from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from datetime import datetime
@csrf_exempt
@require_http_methods(['GET'])
def fetch_due_ip_pharmacy_billing_for_FOC(request):
    try:
        # Extract query params
        search_status = request.GET.get("SearchStatus")
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_order = request.GET.get("SearchTimeOrderby")
        location_id = request.GET.get("location")
       
        # Start query only for "Due" bills
        bills = (
            IP_Pharmacy_Billing_Table_Detials.objects
            .filter(Bill_Status__iexact="Due",Billing_Type='FREE PHARMACY')
            .prefetch_related("IP_billing_items")
            .select_related("Patient_Id", "Doctor_Id", "Register_Id")
        )
 
        # ==== Apply Filters ====
        if search_first_name:
            bills = bills.filter(Patient_Id__FirstName__icontains=search_first_name)
 
        if search_doctor:
            bills = bills.filter(Doctor_Id__Doctor_ID__icontains=search_doctor)
 
        if search_speciality:
            bills = bills.filter(Doctor_Id__Specialization__icontains=search_speciality)
 
        # Date filters
        if date_type == "Current" and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                bills = bills.filter(Billing_Date=dt)
            except ValueError:
                pass
        elif date_type == "Customize" and from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                bills = bills.filter(Billing_Date__range=(dt_from, dt_to))
            except ValueError:
                pass
 
        # Location filter
        if location_id:
            bills = bills.filter(Location__Location_Id=location_id)
 
        # Orderby filter
        if search_order == "asc":
            bills = bills.order_by("Billing_Date")
        elif search_order == "desc":
            bills = bills.order_by("-Billing_Date")
        else:
            bills = bills.order_by("-created_at")
 
        # ==== Build Response ====
        datafetch = []
        S_no = 1
        for bill in bills:
            patient = getattr(bill, "Patient_Id", None)
            doctor = getattr(bill, "Doctor_Id", None)
            registration = getattr(bill, "Register_Id", None)
 
            # Safe doctor name
            doctor_name = ""
            if doctor:
                doctor_name = " ".join(filter(None, [
                    getattr(doctor, "First_Name", ""),
                    getattr(doctor, "Middle_Name", ""),
                    getattr(doctor, "Last_Name", "")
                ]))
 
            # Build items
            items = [
                {
                    "ItemId": getattr(item, "ItemId_id", None),
                    "ItemName": getattr(item, "ItemName", None),
                    "Quantity": getattr(item, "Billing_Quantity", None),
                    "UnitPrice": getattr(item, "Unit_Price", None),
                    "Total": getattr(item, "Total", None),
                    "BatchNo": getattr(item, "BatchNo", None),
                    "ExpDate": getattr(item, "Exp_Date", None),
                }
                for item in bill.IP_billing_items.all()
            ]
 
            datafetch.append({
                "id": getattr(bill, "Billing_Invoice_No", ""),
                "S_no": S_no,
                "BillingDate":f'{bill.Billing_Date} { bill.created_at.strftime("%H:%M:%S") if bill.created_at else ""}',
                "BillingType": getattr(bill, "Billing_Type", ""),
                "Status": getattr(bill, "Bill_Status", ""),
                "RegisterId": getattr(registration, "Registration_Id", "") if registration else "",
               
                # Patient details
                "PatientId": getattr(patient, "PatientId", None) if patient else None,
                "PatientName": f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip() if patient else "",
                "PatientPhoneNo": getattr(patient, "PhoneNo", "") if patient else "",
 
                # Doctor details
                "DoctorId": getattr(doctor, "Doctor_ID", None) if doctor else None,
                "DoctorName": f"Dr. {doctor_name}" if doctor_name else "",
                "PatientCategory": getattr(registration, "PatientCategory", "") if registration else "",
     "Billed_By":bill.created_by,
    "Time": bill.created_at.strftime("%H:%M:%S") if bill.created_at else "",
  "Gender":bill.Register_Id.PatientId.Gender if bill.Register_Id else '',
                "Age": bill.Register_Id.PatientId.Age if bill.Register_Id else '',
 
                # Totals
                "TotalAmount": float(getattr(bill, "Total_Amount", 0)),
                "NetAmount": float(getattr(bill, "Net_Amount", 0)),
                "PaidAmount": float(getattr(bill, "Paid_Amount", 0)),
                "BalanceAmount": float(getattr(bill, "Balance_Amount", 0)),
 
                # Items
                "Items": items
            })
            S_no += 1
 
        return JsonResponse(datafetch, safe=False, status=200)
 
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(['POST','GET'])
def Walkin_Pharmacy_Refund_Billing_link(request):
    if request.method == 'POST':
        try:
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditDue','')
            Paytype = request.POST.get('Paytype','')
            Store_location = request.POST.get('StoreLocation','')
            EditDue = request.POST.get('EditDue','')
            Remarks = request.POST.get('Remarks','')

            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            print('editidd',editid)

            print('StoreLocation',Store_location)

            try:
                patient = Patient_Detials.objects.filter(PatientId=selected_patient_data.get('PatientId')).first() if selected_patient_data.get('PatientId') else  None
                print('Patient:', patient)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})

            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            
            print('111111111111')
            # Parse billing item details with safe integer and float conversion
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
                
                min_qty=0
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222222')
            billing = None
            billinvoice = None
            
            if editid:
                # Create the main billing entry
                try:
                    billing = WalkinPharmacyBillingRefundReceipt.objects.get(BillInvoice_NO__Billing_Invoice_No=editid)
                    billing.NewPayment = 'RefundPayment'
                    billing.save()
                    print('billingggg', billing)
                except:
                    print("Bill is Due...")

            if EditDue:
                billinvoice = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.filter(Billing_Invoice_No=EditDue).first()

            # Update stock quantities for refunded items
            for iitem in bill_itemtable:
                try:
                    print("item------",iitem.get('ItemId'),Store_location,iitem.get('BatchNo')) 
                    storelocation = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=item.get('ItemName').strip(),
                            Product_Detials__Status=True,
                            Store_location=Store_location,
                            Batch_No=item.get('BatchNo')
                        ).first()
                    
                    if storelocation:
                        print('Store location before:', storelocation.AvailableQuantity)
                        storelocation.AvailableQuantity += int(iitem.get('Billing_Quantity'))
                        print('Store location after:', storelocation.AvailableQuantity)
                        storelocation.save()
                        print('Store updated successfully:', storelocation.AvailableQuantity)
                    else:
                        print('Store location not found for item:', iitem.get('ItemName'))
                except Exception as e:
                    print(str(e))
                    return JsonResponse({'error': f'Error updating stock: {str(e)}'})

            # Create Walkin Pharmacy Refund Receipt
            billing_receipt_table = WalkinPharmacyBillingRefundReceipt(
                BillInvoice_NO=billinvoice if billinvoice else None,
                PatientID=patient.PatientId if patient else selected_patient_data.get('PatientId'),
                PhoneNumber=patient.PhoneNo if patient else selected_patient_data.get('PhoneNo'),
                NewPayment="RefundPayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip() if patient else selected_patient_data.get('PatientName'),
                Quantity=total_items,
                TotalAmount=total_amount,
                TotalPaidAmount=paid_amount,
                BalanceAmount=balance_amount,
                Billing_Date=billing_date,
                PaidAmount=paid_amount,
                Billedby=user_name,
                Remarks=Remarks
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None

            # Create refund items
            for bilt in bill_itemtable:
                item = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=item.get('ItemName').strip(),
                            Product_Detials__Status=True,
                            Store_location=Store_location,
                            Batch_No=item.get('BatchNo')
                        ).first()


                print('itemmmmmm',item)


                
                re_item = Walkin_BillingItem_Refund.objects.create(
                    Billing=billing_receipt_table,
                    ItemId=item,
                    ItemName=bilt.get('ItemName'),
                    Reimbursable="YES",
                    Refund_Quantity=bilt.get('Billing_Quantity'),
                    BatchNo=bilt.get('BatchNo'),
                    Exp_Date=bilt.get('Exp_Date'),
                    Unit_Price=bilt.get('Unit_Price'),
                    Amount=bilt.get('Amount'),
                    Total=bilt.get('Total'),
                )
                re_item.save()

                print(re_item,'re_itemre_itemre_itemre_item')


            billinvoice.Bill_Status = 'Refunded'
            billinvoice.save()



            
            def safe_decimal(value, default=Decimal('0.00')):
                """
                Safely convert a value to a Decimal. Returns a default value if the conversion fails.
                """
                try:
                    return Decimal(str(value) if value else str(default))
                except (ValueError):
                    return default

            # Save each payment method
            for payment in billpay_method:
                payment_bill = Walkin_Pharmacy_Payment_Refund_Table_Detials.objects.create(
                    Receipt_No_Paid=billing_receipt_table,
                    Payment_Type=payment.get('Billpay_method', ''),
                    Cart_Type=payment.get('CardType', ''),
                    Card_No=payment.get('CardNo', '0000')[:4],  # Take only first 4 digits
                    TransactionId=payment.get('TransactionId', ''),
                    upiid=payment.get('upiid', ''),
                    Bank_Name=payment.get('BankName', ''),
                    Cheque_No=payment.get('ChequeNo', ''),
                    Transaction_Amount=safe_decimal(payment.get('paidamount', 0)),
                    AdditionalAmount=safe_decimal(payment.get('Additionalamount', 0)),
                    Amount=safe_decimal(payment.get('paidamount', 0)) + safe_decimal(payment.get('Additionalamount', 0)),
                )
                payment_bill.save()
        
            return JsonResponse({'status': 'success', 'message': 'Walkin Pharmacy Refund Data saved successfully', 'ReceiptNo': recipetbill})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
    
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            SearchProd = request.GET.get("SearchProd")
            Pharma_Type = request.GET.get("Pharma_Type")

            # Build dynamic filter query
            search_query = Q()
            if Pharma_Type:
                search_query = Q(Billing_Type=Pharma_Type)
            
            if SearchProd:
                prod_data = list(Walkin_BillingItem_Refund.objects.filter(ItemName__icontains=SearchProd).values_list("Billing__Voucher_Number", flat=True)) 
                print("Prod-----", prod_data)
                if len(prod_data) > 0:
                    search_query &= Q(Voucher_Number__in=prod_data)

            if SearchbyFirstName:
                print("Name-------------")
                patient_filter = ( 
                    Q(Voucher_Number__icontains=SearchbyFirstName) |
                    Q(PatientID__icontains=SearchbyFirstName) |
                    Q(Patient_Name__icontains=SearchbyFirstName) |
                    Q(PhoneNumber__icontains=SearchbyFirstName)
                )
                search_query &= patient_filter

            # Date filtering
            if DateType == "Current" and CurrentDate:
                print("Current-------------", type(CurrentDate), CurrentDate)
                search_query &= Q(CreatedAt__date=CurrentDate)  

            elif DateType == "Customize":
                print("Custom-------------")
                if FromDate and ToDate:
                    search_query &= Q(CreatedAt__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(CreatedAt__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(CreatedAt__date__lte=ToDate)
        
            walkin_refund_data = WalkinPharmacyBillingRefundReceipt.objects.filter(search_query).order_by("-CreatedAt")
            print('Walkin Refund Data:', walkin_refund_data)
            
            response_data = []
            S_No = 0
            for refund_receipt in walkin_refund_data:
                S_No += 1
                refund_details = {
                    "S_No": S_No,
                    'id': refund_receipt.Voucher_Number,
                    'Type': 'WalkinPharmacyRefund',
                    'Billing_Date': refund_receipt.Billing_Date,
                    'PatientId': refund_receipt.PatientID,
                    'Patient_Name': refund_receipt.Patient_Name,
                    'PhoneNo': refund_receipt.PhoneNumber,
                    'Quantity': refund_receipt.Quantity,
                    'TotalAmount': refund_receipt.TotalAmount,
                    'TotalPaidAmount': refund_receipt.TotalPaidAmount,
                    'BalanceAmount': refund_receipt.BalanceAmount,
                    'PaidAmount': refund_receipt.PaidAmount,
                    'Billedby': refund_receipt.Billedby,
                    'Voucher_Number': refund_receipt.Voucher_Number,
                    'Remarks': refund_receipt.Remarks,
                    'CreatedAt': refund_receipt.CreatedAt,
                    'UpdatedAt': refund_receipt.UpdatedAt,
                    'Refund_Items': [],
                    'Refund_Payments': []
                }
                
                # Get refund items
                record_id = 1
                refund_items = Walkin_BillingItem_Refund.objects.filter(Billing=refund_receipt)
                for item in refund_items:
                    item_details = {
                        'S_No': record_id,
                        'itemid': item.pk,
                        'Voucher_No': item.Billing.Voucher_Number,
                        'ItemName': item.ItemName,
                        'Reimbursable': item.Reimbursable,
                        'BatchNo': item.BatchNo,
                        'Exp_Date': item.Exp_Date,
                        'Unit_Price': item.Unit_Price,
                        'Refund_Quantity': item.Refund_Quantity,
                        'Amount': item.Amount,
                        'Total': item.Total,
                    }
                    record_id += 1
                    refund_details['Refund_Items'].append(item_details)
                
                # Get refund payments
                refund_payments = Walkin_Pharmacy_Payment_Refund_Table_Detials.objects.filter(Receipt_No_Paid=refund_receipt)
                for payment in refund_payments:
                    payment_details = {
                        'Payment_Type': payment.Payment_Type,
                        'Cart_Type': payment.Cart_Type,
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Bank_Name': payment.Bank_Name,
                        'Cheque_No': payment.Cheque_No,
                        'Transaction_Amount': float(payment.Transaction_Amount),
                        'AdditionalAmount': float(payment.AdditionalAmount),
                        'Amount': float(payment.Amount),
                    }
                    refund_details['Refund_Payments'].append(payment_details)
                
                response_data.append(refund_details)
            
            return JsonResponse(response_data, safe=False)
            
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'error': str(e)})

from num2words import num2words

@csrf_exempt
@require_http_methods(['GET'])
def fetch_foc_pharmacy_refund_billing(request):
    try:
        # ---------------------
        # Filters
        # ---------------------
        pharma = request.GET.get("pharma")           
        date_type = request.GET.get("DateType")           
        current_date = request.GET.get("CurrentDate")     
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_status = request.GET.get("SearchStatus")           
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        location_id = request.GET.get("location") 
        # ---------------------
        # Base queryset
        # ---------------------

        

        bills = IPPharmacyBillingRefundReceipt.objects.exclude(BillInvoice_NO__Billing_Type='IP PHARMACY')

        print(bills,'bills beforeeeeeeeeeeee')
        
        if pharma =='3':
            print('ulla vanten')
            bills = IPPharmacyBillingRefundReceipt.objects.filter(BillInvoice_NO__Billing_Type='FREE PHARMACY')
            print(bills,'billsssssssssssssss')
        filters = Q()

        # ---------------------
        # Date filter
        # ---------------------
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date__range=(dt_from, dt_to))
            except ValueError:
                pass

        # Patient name filter
        if search_first_name:
            filters &= Q(Patient_Name__icontains=search_first_name)

        # Doctor/Speciality filter via Invoice -> IP_Pharmacy_Billing_Table_Detials
        if search_doctor:
            filters &= Q(Invoice_NO__Doctor_Id__Doctor_Name__icontains=search_doctor)
        if search_speciality:
            filters &= Q(Invoice_NO__Doctor_Id__Speciality__icontains=search_speciality)

        # Status filter
        if search_status:
            status_map = {"Refunded": "RefundPayment"}  # Adjust if needed
            filters &= Q(NewPayment__icontains=status_map.get(search_status, search_status))

        # Location filter via Invoice -> IP_Pharmacy_Billing_Table_Detials
        # if location_id:
        #     filters &= Q(Invoice_NO__Location__Location_Id=location_id)

        # ---------------------
        # Apply filters & order
        # ---------------------
        bills = bills.filter(filters)
        bills = bills.order_by('-CreatedAt')

        # ---------------------
        # Build JSON response
        # ---------------------
        datafetch = []
        # for idx, bill in enumerate(bills, start=1):
        #     invoice = bill.Invoice_NO
        #     payments = bill.IPPharmacy_Receipt_No_Payments_Refund.all() if invoice else []
        #     registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()
        #     print("Billing",bill.Invoice_NO.pk)
        #     re_item = IP_BillingItem_Refund.objects.filter(Billing = bill)
        #     print("Item",re_item)
        #     datafetch.append({
        #         "S_No": idx,
        #         "id": bill.Voucher_Number,
        #         "BillingDate": bill.Billing_Date,
        #         "Bill_Status": bill.NewPayment,
        #         "PatientId": bill.PatientID,
        #         "Patient_Name": bill.Patient_Name,
        #         "PhoneNo": bill.PhoneNumber,
        #         "PatientCategory": registration.PatientCategory if registration else "",
        #         "Doctor_Name": f'Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}' if registration and registration.PrimaryDoctor else "",
        #         # "Speciality": registration.DoctorId.Speciality if registration and registration.DoctorId else "",
        #         "amount_in_words":num2words.num2words(bill.TotalAmount),
        #         "TotalAmount": float(bill.TotalAmount),
        #         "PaidAmount": float(bill.PaidAmount),
        #         "BalanceAmount": float(bill.BalanceAmount),
        #         "BilledBy": bill.Billedby,
        #         "Status": bill.NewPayment,
        #        # Refund payments
        #         "Payments": [
        #             {
        #                 "Payment_Type": pay.Payment_Type,  # was Billpay_method
        #                 "CardType": pay.Cart_Type,
        #                 "BankName": pay.Bank_Name,
        #                 "ChequeNo": pay.Cheque_No,
        #                 "Transaction_Amount": float(pay.Transaction_Amount),
        #                 "AdditionalAmount": float(pay.AdditionalAmount),
        #                 "Amount": float(pay.Amount),
        #             } for pay in payments
        #         ],                        
        #             # Items (dot-matrix bill)
        #         "Items": [
        #                 {
        #                     "ItemName": item.ItemName,
        #                     "BatchNo": item.BatchNo,
        #                     "ExpDate": item.Exp_Date,
        #                     "Quantity": item.Refund_Quantity,
        #                     "UnitPrice": float(item.Unit_Price),
        #                     "Total": float(item.Total),
        #                 }
        #                 for item in re_item
        #             ]
        #     })


        for idx, bill in enumerate(bills, start=1):
            invoice = bill.Invoice_NO
            print("invoice------",invoice,bill.Patient_Name)
            payments = bill.IPPharmacy_Receipt_No_Payments_Refund.all() if invoice else []
            registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()

            # Refund items for this bill
            refund_items = IP_BillingItem_Refund.objects.filter(Billing=bill)

            datafetch.append({
                "S_No": idx,
                "id": bill.Voucher_Number,
                "Billing_Date": bill.Billing_Date,
                "Bill_Status": bill.NewPayment,
                "PatientId": bill.PatientID,
                "Patient_Name": bill.Patient_Name,
                "PhoneNo": bill.PhoneNumber,
                "PatientCategory": registration.PatientCategory if registration else "",
                "Doctor_Name": (
                    f"Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}"
                    if registration and registration.PrimaryDoctor else ""
                ),
                # "amount_in_words": num2words(bill.TotalAmount) if bill.TotalAmount is not None else "",
                "TotalAmount": float(bill.TotalAmount),
                "PaidAmount": float(bill.PaidAmount),
                "BalanceAmount": float(bill.BalanceAmount),
                "BilledBy": bill.Billedby,
                "Status": bill.NewPayment,

                # Refund payments
                "Payments": [
                    {
                        "Payment_Type": pay.Payment_Type,
                        "CardType": pay.Cart_Type,
                        "BankName": pay.Bank_Name,
                        "ChequeNo": pay.Cheque_No,
                        "Transaction_Amount": float(pay.Transaction_Amount),
                        "AdditionalAmount": float(pay.AdditionalAmount),
                        "Amount": float(pay.Amount),
                    }
                    for pay in payments
                ],

                # Refund items
                "Items": [
                    {
                        "ItemName": item.ItemName,
                        "BatchNo": item.BatchNo,
                        "ExpDate": item.Exp_Date,
                        "Quantity": item.Refund_Quantity,  # ✅ correct field
                        "UnitPrice": float(item.Unit_Price),
                        "Total": float(item.Total),
                    }
                    for item in refund_items
                ]
            })
        return JsonResponse({"ip_pharmacy_refund_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        print(str(e))
        return JsonResponse({"error": str(e)}, status=500)


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils.dateparse import parse_date
from datetime import datetime


@csrf_exempt
@transaction.atomic
@require_http_methods(['POST'])
def New_IP_Pharmacy_Billing_link(request):
    if request.method == 'POST':
        try:
            # Parse data based on content type
            selected_patient_data = {}
            billing_date_str = ''
            billpay_method = []
            bill_Items = {}
            user_name = ''
            location_id = 1
            Paytype = ''
            Store_location = ''
            Remarks = ''
            bill_itemtable = []
            viewType = ''

            is_multipart = 'multipart/form-data' in request.content_type
            if not is_multipart:
                # JSON request
                try:
                    data = json.loads(request.body)
                    selected_patient_data = data.get('SelectedPatient_list', {})
                    billing_date_str = data.get('Billing_date', '')
                    billpay_method = data.get('Billpay_method', [])
                    bill_Items = data.get('Bill_Items', {})
                    user_name = data.get('User_Name', '')
                    location_id = data.get('location', 1)
                    Paytype = data.get('Paytype', '')
                    Store_location = data.get('StoreLocation', '')
                    systemName =  data.get('systemName','')
                    Remarks = data.get('Remarks', '')
                    bill_itemtable = data.get('Billing_itemtable', [])
                    viewType = data.get('viewType')

                except json.JSONDecodeError as e:
                    return JsonResponse({'status': 'error', 'message': f'Invalid JSON: {str(e)}'}, status=400)
            else:
                # Multipart form-data
                def safe_json_load(raw_value, key, default='{}'):
                    if not raw_value:
                        return default
                    try:
                        return json.loads(raw_value)
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error for {key}: raw='{raw_value[:100]}...', error={e}")
                        return default

                selected_patient_data = safe_json_load(
                    request.POST.get('SelectedPatient_list', '{}'), 'SelectedPatient_list'
                )
                billing_date_str = request.POST.get('Billing_date', '')
                billpay_method = safe_json_load(
                    request.POST.get('Billpay_method', '[]'), 'Billpay_method'
                )
                bill_Items = safe_json_load(
                    request.POST.get('Bill_Items', '{}'), 'Bill_Items'
                )
                user_name = request.POST.get('User_Name', '')
                location_id = int(request.POST.get('location', 1))
                viewType = request.POST.get('viewType')
                Paytype = request.POST.get('Paytype', '')
                Store_location = int(request.POST.get('StoreLocation', 3))  # Default IP store
                Remarks = request.POST.get('Remarks', '')
                # systemName = request.POST.get('systemName','')
                bill_itemtable = safe_json_load(
                    request.POST.get('Billing_itemtable', '[]'), 'Billing_itemtable'
                )

            # Validate required fields
            if not selected_patient_data.get('PatientId'):
                return JsonResponse({'status': 'error', 'message': 'PatientId is required'}, status=400)
            if not billing_date_str:
                return JsonResponse({'status': 'error', 'message': 'Billing_date is required'}, status=400)

            # Parse billing date safely
            billing_date = parse_date(billing_date_str)
            if not billing_date:
                return JsonResponse({'status': 'error', 'message': f'Invalid Billing_date: {billing_date_str}'}, status=400)

            print("Received data:", {
                'selected_patient_data': selected_patient_data,
                'billing_date': billing_date,
                'billpay_method_count': len(billpay_method),
                'bill_Items': bill_Items,
                'user_name': user_name,
                'location_id': location_id,
                'Paytype': Paytype,
                'Store_location': Store_location,
                'Remarks': Remarks,
                'bill_itemtable_count': len(bill_itemtable)
            })

            # ---------- Fetch related foreign key objects ---------- (unchanged, but added more try-excepts)
            doctor = None
            try:
                doctor_ins = selected_patient_data.get('Doctor_Id')
                print('doctor_ins:', doctor_ins)
                if doctor_ins:
                    doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_ins).first()
                    print('Doctor found:', doctor)
            except Exception as e:
                print("Doctor fetch failed:", e)

            patient = None
            try:
                patient_id = selected_patient_data.get('PatientId')
                patient = Patient_Detials.objects.get(PatientId=patient_id)
                print('Patient found:', patient)
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Patient not found'}, status=400)
            except Exception as e:
                print("Patient fetch error:", e)
                return JsonResponse({'status': 'error', 'message': f'Patient fetch error: {str(e)}'}, status=400)

            registration = None
            try:
                registration_id = selected_patient_data.get('RegistrationId')
                if registration_id:
                    registration = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
                elif patient_id:
                    registration = Patient_IP_Registration_Detials.objects.filter(PatientId=patient_id).last()
                print('Registration found:', registration)
            except Exception as e:
                print("Registration fetch failed:", e)
                # Not critical, continue without registration

            location = None
            try:
                location = Location_Detials.objects.get(Location_Id=location_id)
                print('Location found:', location)
            except Exception as e:
                print("Location fetch failed:", e)
                return JsonResponse({'status': 'error', 'message': 'Location not found'}, status=400)

            # ---------- Billing values ---------- (added safe float/int parsing)
            try:
                discount_amount = float(bill_Items.get('Discount', 0) or 0)
                sgst_val = float(bill_Items.get('SGSTval', 0) or 0)
                cgst_val = float(bill_Items.get('CGSTval', 0) or 0)
                gst_amount = float(bill_Items.get('GSTAmount', 0) or 0)
                total_items = int(bill_Items.get('totalItems', 0) or 0)
                total_qty = int(bill_Items.get('totalQty', 0) or 0)
                total_amount = float(bill_Items.get('Amount', 0) or 0)
                net_amount = float(bill_Items.get('totalAmount', 0) or 0)
                paid_amount = float(bill_Items.get('PaidAmount', 0) or 0)
                balance_amount = float(bill_Items.get('BalanceAmount', 0) or 0)
                round_off = float(bill_Items.get('Roundoff', 0) or 0)

                balance_amount = Decimal(balance_amount).quantize(Decimal('1'),rounding=ROUND_HALF_UP)
                new_bill_status = 'Paid' if balance_amount <= Decimal('0.00') else 'Due'

                print(new_bill_status,'new_bill_status')


                Pharmacytype = "IP PHARMACY"

                print("Billing values calculated:", {
                    'discount_amount': discount_amount,
                    'total_amount': total_amount,
                    'net_amount': net_amount,
                    'paid_amount': paid_amount,
                    'balance_amount': balance_amount
                })
            except (ValueError, TypeError) as e:
                print("Error parsing billing values:", e)
                return JsonResponse({'status': 'error', 'message': f'Error parsing billing values: {str(e)}'}, status=400)

            # ---------- Create billing entry ---------- (unchanged)
            try:
                billing = IP_Pharmacy_Billing_Table_Detials.objects.create(
                    Doctor_Id=doctor,
                    Prescription_Id1=None,
                    Patient_Id=patient,
                    Register_Id=registration,
                    Billing_Date=billing_date,
                    PharmacyType = viewType,
                    Billing_Type=Pharmacytype,
                    Discount_Amount=discount_amount,
                    SGST_val=sgst_val,
                    CGST_val=cgst_val,
                    Total_GSTAmount=gst_amount,
                    Total_Items=total_items,
                    Total_Qty=total_qty,
                    Total_Amount=total_amount,
                    Net_Amount=net_amount,
                    Paid_Amount=paid_amount,
                    Balance_Amount=balance_amount,
                    Round_Off=round_off,
                    created_by=user_name,
                    Location=location,
                    Bill_Status=new_bill_status,
                    Remarks=Remarks
                )
                billing.save()
                print("Billing created successfully:", billing.Billing_Invoice_No)
            except Exception as e:
                print("Billing creation failed:", e)
                return JsonResponse({'status': 'error', 'message': f'Billing creation failed: {str(e)}'}, status=400)

            # ---------- Process billing items ---------- (added safe int/float parsing)
            if isinstance(bill_itemtable, list):
                for item in bill_itemtable:
                    try:
                        prescription_id = item.get('PrescriptionID')
                        prescription_instance = None
                        
                        if prescription_id:
                            try:
                                prescription_instance = Doctor_drug_prescription.objects.get(
                                    Prescription_Id=int(prescription_id)
                                )
                                # Update IP request table
                                try:
                                    ip_request = ip_drug_request_table.objects.get(Prescription_Id=prescription_instance)
                                    ip_request.Status = 'issued'
                                    ip_request.save()
                                    print(f"IP request updated for prescription: {prescription_id}")
                                except Exception as e:
                                    print(f"IP request update failed for {prescription_id}: {e}")

                                # Update prescription status
                                Doctor_drug_prescription.objects.filter(
                                    Prescription_Id=prescription_instance.Prescription_Id,
                                    Status='Pending'
                                ).update(Status='issued')
                                print(f"Prescription status updated: {prescription_id}")
                            except Exception as e:
                                print(f"Prescription not found: {prescription_id}, error: {e}")
                                prescription_instance = None

                        # Stock maintenance
                        itemins = None
                        try:
                            if Store_location and item.get('BatchNo') and item.get('ItemId'):
                                item_name = item.get('ItemName', '').strip()
                                batch_no  = item.get('BatchNo', '').strip()

                                itemins = Stock_Maintance_Table_Detials.objects.filter(
                                    Product_Detials__ItemName=item_name,
                                    Store_location=Store_location,
                                    Batch_No=batch_no
                                ).first()

                                
                                if itemins:
                                    qty_to_deduct = int(item.get('Billing_Quantity', 0) or 0)
                                    itemins.AvailableQuantity -= qty_to_deduct
                                    itemins.save()
                                    print(f"Stock updated for item: {item.get('ItemName')}, new quantity: {itemins.AvailableQuantity}")
                                else:
                                    print(f"Stock item not found for: {item.get('ItemName')}")
                        except Exception as e:
                            print(f"Stock update failed for {item.get('ItemName')}: {e}")

                        # Create billing item (safe parsing)
                        try:
                            billing_item = IP_BillingItem.objects.create(
                                Billing=billing,
                                ItemName=str(item.get('ItemName', '')),
                                Billing_Quantity=int(item.get('Billing_Quantity', 0) or 0),
                                BatchNo=str(item.get('BatchNo', '')),
                                Exp_Date=datetime.strptime(item.get('Exp_Date', ''), "%Y-%m-%d").date() if item.get('Exp_Date') else None,
                                Unit_Price=float(item.get('Unit_Price', 0) or 0),
                                Amount=float(item.get('Amount', 0) or 0),
                                Total=float(item.get('Total', 0) or 0),
                                ItemId=itemins
                            )
                            print(f"Billing item created: {billing_item.ItemName}")
                        except Exception as e:
                            print(f"Billing item creation failed: {e}")

                    except Exception as e:
                        print(f"Error processing billing item {item}: {e}")
                        continue  # Skip invalid items

            # ---------- Receipt ---------- (unchanged, but added try-except)
            recipetbill = None
            billing_receipt_table = None
            try:
                if Paytype == 'Cash':
                    patient_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip()
                    
                    billing_receipt_table = IPPharmacyBillingReceipt.objects.create(
                        Invoice_NO=billing,
                        PatientID=patient.PatientId,
                        PhoneNumber=patient.PhoneNo,
                        Patient_Name=patient_name,
                        TotalAmount=total_amount,
                        TotalPaidAmount=paid_amount,
                        BalanceAmount=balance_amount,
                        Billing_Date=billing_date,
                        PaidAmount=paid_amount,
                        Billedby=user_name,
                    )
                    recipetbill = billing_receipt_table.Voucher_Number
                    print(f"Receipt created: {recipetbill}")
            except Exception as e:
                print("Receipt creation failed:", e)

            # ---------- Payments ---------- (safe float parsing)
            if billpay_method and isinstance(billpay_method, list):
                for payment in billpay_method:
                    try:
                        IP_Pharmacy_Billing_Payments.objects.create(
                            Billing=billing_receipt_table if billing_receipt_table else None,
                            Billpay_method=str(payment.get('Billpay_method', '')),
                            CardType=str(payment.get('CardType', '')),
                            BankName=str(payment.get('BankName', '')),
                            ChequeNo=str(payment.get('ChequeNo', '')),
                            paidamount=float(payment.get('paidamount', 0) or 0),
                            Additionalamount=float(payment.get('Additionalamount', 0) or 0),
                            transactionFee=str(payment.get('transactionFee', '')),
                        )
                        print(f"Payment method saved: {payment.get('Billpay_method')}")
                    except Exception as e:
                        print(f"Payment creation failed: {e}")



            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_itemtable:
                    grn = GRN_Product_Item_Detials.objects.filter(
                    Product_Detials__ItemName=item["ItemName"]
                ).first()
                    items_list.append({
                        "name": item["ItemName"],
                        "batch": item["BatchNo"],
                        "expiry": item["Exp_Date"],
                        "qty": item["Billing_Quantity"],
                        "rate": float(item["Unit_Price"]),
                        # "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn.Sellable_price and grn else 0,
                        "mrp": float(item["Amount"]),
                        "total": float(item["Total"])
                    })
                print('itemlist',items_list)
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
                    "patient_id": patient.PatientId,
                    "age": patient.Age,
                    "Bill_Status":new_bill_status,
                    "PaidAmount":bill_Items.get('PaidAmount'),
                    "gender": patient.Gender,
                    "invoice_no": billing.Billing_Invoice_No,
                    "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                    "date": billing_date.strftime('%d/%m/%Y'),
                    "patient_phone": patient.PhoneNo,
                    "items": items_list,
                    "amount_words": num2words(billing.Net_Amount),
                    "gst": billing.Total_GSTAmount,
                    "billed_by": user_name,
                    "net_amount": billing.Net_Amount,
                    "gross_amount": billing.Total_Amount,
                }
                bill_text=''
                bill_text = IP_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)
                # systemName = request.POST.get('systemName','')
                print("SYS--------", bill_text)
                # if systemName:
                #     JOB = PrintJob.objects.create(
                #         system_name=systemName,
                #         bill_text=bill_text
                #     )
                #     JOB.save()
                #     print("Job Assigned To", JOB)




                # hPrinter = win32print.OpenPrinter(printer_name)
                # try:
                #     hJob = win32print.StartDocPrinter(hPrinter, 1, ("OP Bill", None, "RAW"))
                #     win32print.StartPagePrinter(hPrinter)
                #     win32print.WritePrinter(hPrinter, bill_text.encode('ascii', errors='replace'))
                #     win32print.EndPagePrinter(hPrinter)
                #     win32print.EndDocPrinter(hPrinter)
                #     print("Bill printed successfully")
                # finally:
                #     win32print.ClosePrinter(hPrinter)


            except Exception as e:
                print(f"Warning: Error printing bill: {e}")
            return JsonResponse({
                'status': 'success',
                'message': 'Data saved successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': recipetbill,
                'printJob': bill_text            })

        except Exception as e:
            print("Critical error:", str(e))
            import traceback
            traceback.print_exc()
            # Rollback is automatic due to @transaction.atomic
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Only POST method allowed'}, status=405)


@csrf_exempt
@transaction.atomic
@require_http_methods(['POST'])
def New_IP_Walkin_Billing_link(request):
    if request.method == 'POST':
        try:
            # Parse data based on content type
            selected_patient_data = {}
            billing_date_str = ''
            billpay_method = []
            bill_Items = {}
            user_name = ''
            location_id = 1
            Paytype = ''
            Store_location = ''
            Remarks = ''
            bill_itemtable = []
            viewType = ''
            Chosendocid = ''
 

            is_multipart = 'multipart/form-data' in request.content_type
            if not is_multipart:
                # JSON request
                try:
                    data = json.loads(request.body)
                    selected_patient_data = data.get('SelectedPatient_list', {})
                    billing_date_str = data.get('Billing_date', '')
                    billpay_method = data.get('Billpay_method', [])
                    bill_Items = data.get('Bill_Items', {})
                    user_name = data.get('User_Name', '')
                    location_id = data.get('location', 1)
                    Paytype = data.get('Paytype', '')
                    Store_location = data.get('StoreLocation', '')
                    Remarks = data.get('Remarks', '')
                    bill_itemtable = data.get('Billing_itemtable', [])
                    viewType = data.get('viewType')
                    Chosendocid = data.get('Chosendocid')


                except json.JSONDecodeError as e:
                    return JsonResponse({'status': 'error', 'message': f'Invalid JSON: {str(e)}'}, status=400)
            else:
                # Multipart form-data
                def safe_json_load(raw_value, key, default='{}'):
                    if not raw_value:
                        return default
                    try:
                        return json.loads(raw_value)
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error for {key}: raw='{raw_value[:100]}...', error={e}")
                        return default

                selected_patient_data = safe_json_load(
                    request.POST.get('SelectedPatient_list', '{}'), 'SelectedPatient_list'
                )
                billing_date_str = request.POST.get('Billing_date', '')
                billpay_method = safe_json_load(
                    request.POST.get('Billpay_method', '[]'), 'Billpay_method'
                )
                bill_Items = safe_json_load(
                    request.POST.get('Bill_Items', '{}'), 'Bill_Items'
                )
                user_name = request.POST.get('User_Name', '')
                location_id = int(request.POST.get('location', 1))
                viewType = request.POST.get('viewType')
                Paytype = request.POST.get('Paytype', '')
                Store_location = int(request.POST.get('StoreLocation', 3))  # Default IP store
                Remarks = request.POST.get('Remarks', '')
                bill_itemtable = safe_json_load(
                    request.POST.get('Billing_itemtable', '[]'), 'Billing_itemtable'
                )
                Chosendocid = request.POST.get('Chosendocid')

           
            if not billing_date_str:
                return JsonResponse({'status': 'error', 'message': 'Billing_date is required'}, status=400)

            # Parse billing date safely
            billing_date = parse_date(billing_date_str)
            if not billing_date:
                return JsonResponse({'status': 'error', 'message': f'Invalid Billing_date: {billing_date_str}'}, status=400)

            print("Received data:", {
                'selected_patient_data': selected_patient_data,
                'billing_date': billing_date,
                'billpay_method_count': len(billpay_method),
                'bill_Items': bill_Items,
                'user_name': user_name,
                'location_id': location_id,
                'Paytype': Paytype,
                'Store_location': Store_location,
                'Remarks': Remarks,
                'bill_itemtable_count': len(bill_itemtable)
            })

            # ---------- Fetch related foreign key objects ---------- (unchanged, but added more try-excepts)
            doctor = None
            try:
                doctor_ins = Chosendocid
                print('doctor_ins:', doctor_ins)
                if doctor_ins:
                    doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_ins).first()
                    print('Doctor found:', doctor)
            except Exception as e:
                print("Doctor fetch failed:", e)

            patient = None
            
            registration = None
            
            location = None
            try:
                location = Location_Detials.objects.get(Location_Id=location_id)
                print('Location found:', location)
            except Exception as e:
                print("Location fetch failed:", e)
                return JsonResponse({'status': 'error', 'message': 'Location not found'}, status=400)

            # ---------- Billing values ---------- (added safe float/int parsing)
            try:
                discount_amount = float(bill_Items.get('Discount', 0) or 0)
                sgst_val = float(bill_Items.get('SGSTval', 0) or 0)
                cgst_val = float(bill_Items.get('CGSTval', 0) or 0)
                gst_amount = float(bill_Items.get('GSTAmount', 0) or 0)
                total_items = int(bill_Items.get('totalItems', 0) or 0)
                total_qty = int(bill_Items.get('totalQty', 0) or 0)
                total_amount = float(bill_Items.get('Amount', 0) or 0)
                net_amount = float(bill_Items.get('totalAmount', 0) or 0)
                paid_amount = float(bill_Items.get('PaidAmount', 0) or 0)
                balance_amount = float(bill_Items.get('BalanceAmount', 0) or 0)
                round_off = float(bill_Items.get('Roundoff', 0) or 0)

                
                balance_amount = Decimal(balance_amount).quantize(Decimal('1'),rounding=ROUND_HALF_UP)
                new_bill_status = 'Paid' if balance_amount <= Decimal('0.00') else 'Due'


                Pharmacytype = "IP PHARMACY"

                print("Billing values calculated:", {
                    'discount_amount': discount_amount,
                    'total_amount': total_amount,
                    'net_amount': net_amount,
                    'paid_amount': paid_amount,
                    'balance_amount': balance_amount
                })
            except (ValueError, TypeError) as e:
                print("Error parsing billing values:", e)
                return JsonResponse({'status': 'error', 'message': f'Error parsing billing values: {str(e)}'}, status=400)

            # ---------- Create billing entry ---------- (unchanged)
            try:
                billing = IP_Pharmacy_Billing_Table_Detials.objects.create(
                    Doctor_Id=doctor,
                    Prescription_Id1=None,
                    Patient_Id=patient,
                    Register_Id=registration,
                    Billing_Date=billing_date,
                    PharmacyType = viewType,
                    Billing_Type=Pharmacytype,
                    Discount_Amount=discount_amount,
                    SGST_val=sgst_val,
                    CGST_val=cgst_val,
                    Total_GSTAmount=gst_amount,
                    Total_Items=total_items,
                    Total_Qty=total_qty,
                    Total_Amount=total_amount,
                    Net_Amount=net_amount,
                    Paid_Amount=paid_amount,
                    Balance_Amount=balance_amount,
                    Round_Off=round_off,
                    created_by=user_name,
                    Location=location,
                    Bill_Status=new_bill_status,
                    Remarks=Remarks,
                    PatientName = selected_patient_data.get('PatientName'),
                )
                billing.save()
                print("Billing created successfully:", billing.Billing_Invoice_No)
            except Exception as e:
                print("Billing creation failed:", e)
                return JsonResponse({'status': 'error', 'message': f'Billing creation failed: {str(e)}'}, status=400)

            # ---------- Process billing items ---------- (added safe int/float parsing)
            if isinstance(bill_itemtable, list):
                for item in bill_itemtable:
                    try:
                        prescription_id = item.get('PrescriptionID')
                        prescription_instance = None
                        
                        if prescription_id:
                            try:
                                prescription_instance = Doctor_drug_prescription.objects.get(
                                    Prescription_Id=int(prescription_id)
                                )
                                # Update IP request table
                                try:
                                    ip_request = ip_drug_request_table.objects.get(Prescription_Id=prescription_instance)
                                    ip_request.Status = 'issued'
                                    ip_request.save()
                                    print(f"IP request updated for prescription: {prescription_id}")
                                except Exception as e:
                                    print(f"IP request update failed for {prescription_id}: {e}")

                                # Update prescription status
                                Doctor_drug_prescription.objects.filter(
                                    Prescription_Id=prescription_instance.Prescription_Id,
                                    Status='Pending'
                                ).update(Status='issued')
                                print(f"Prescription status updated: {prescription_id}")
                            except Exception as e:
                                print(f"Prescription not found: {prescription_id}, error: {e}")
                                prescription_instance = None

                        # Stock maintenance
                        itemins = None
                        try:
                            if Store_location and item.get('BatchNo') and item.get('ItemId'):
                                itemins = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=item.get('ItemName').strip(),
                            Product_Detials__Status=True,
                            Store_location=Store_location,
                            Batch_No=item.get('BatchNo')
                        ).first()
                                
                                if itemins:
                                    qty_to_deduct = int(item.get('Billing_Quantity', 0) or 0)
                                    itemins.AvailableQuantity -= qty_to_deduct
                                    itemins.save()
                                    print(f"Stock updated for item: {item.get('ItemName')}, new quantity: {itemins.AvailableQuantity}")
                                else:
                                    print(f"Stock item not found for: {item.get('ItemName')}")
                        except Exception as e:
                            print(f"Stock update failed for {item.get('ItemName')}: {e}")

                        # Create billing item (safe parsing)
                        try:
                            billing_item = IP_BillingItem.objects.create(
                                Billing=billing,
                                ItemName=str(item.get('ItemName', '')),
                                Billing_Quantity=int(item.get('Billing_Quantity', 0) or 0),
                                BatchNo=str(item.get('BatchNo', '')),
                                Exp_Date=datetime.strptime(item.get('Exp_Date', ''), "%Y-%m-%d").date() if item.get('Exp_Date') else None,
                                Unit_Price=float(item.get('Unit_Price', 0) or 0),
                                Amount=float(item.get('Amount', 0) or 0),
                                Total=float(item.get('Total', 0) or 0),
                                ItemId=itemins
                            )
                            print(f"Billing item created: {billing_item.ItemName}")
                        except Exception as e:
                            print(f"Billing item creation failed: {e}")

                    except Exception as e:
                        print(f"Error processing billing item {item}: {e}")
                        continue  # Skip invalid items

            # ---------- Receipt ---------- (unchanged, but added try-except)
            recipetbill = None
            billing_receipt_table = None
            try:
                if Paytype == 'Cash':
                    
                    billing_receipt_table = IPPharmacyBillingReceipt.objects.create(
                        Invoice_NO=billing,
                        PhoneNumber=selected_patient_data.get('PhoneNumber'),
                        Patient_Name=selected_patient_data.get('PatientName'),
                        TotalAmount=total_amount,
                        TotalPaidAmount=paid_amount,
                        BalanceAmount=balance_amount,
                        Billing_Date=billing_date,
                        PaidAmount=paid_amount,
                        Billedby=user_name,
                    )
                    recipetbill = billing_receipt_table.Voucher_Number
                    print(f"Receipt created: {recipetbill}")
            except Exception as e:
                print("Receipt creation failed:", e)

            # ---------- Payments ---------- (safe float parsing)
            if billpay_method and isinstance(billpay_method, list):
                for payment in billpay_method:
                    try:
                        IP_Pharmacy_Billing_Payments.objects.create(
                            Billing=billing_receipt_table if billing_receipt_table else None,
                            Billpay_method=str(payment.get('Billpay_method', '')),
                            CardType=str(payment.get('CardType', '')),
                            BankName=str(payment.get('BankName', '')),
                            ChequeNo=str(payment.get('ChequeNo', '')),
                            paidamount=float(payment.get('paidamount', 0) or 0),
                            Additionalamount=float(payment.get('Additionalamount', 0) or 0),
                            transactionFee=str(payment.get('transactionFee', '')),
                        )
                        print(f"Payment method saved: {payment.get('Billpay_method')}")
                    except Exception as e:
                        print(f"Payment creation failed: {e}")

            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_itemtable:
                    grn = GRN_Product_Item_Detials.objects.filter(
                    Product_Detials__ItemName=item["ItemName"]
                ).first()
                    items_list.append({
                        "name": item["ItemName"],
                        "batch": item["BatchNo"],
                        "expiry": item["Exp_Date"],
                        "qty": item["Billing_Quantity"],
                        "rate": float(item["Unit_Price"]),
                        # "GST": round(float(grn.Sellable_qty_price*(grn.Tax_Percentage)/100),2) if grn.Sellable_price and grn else 0,
                        "mrp": float(item["Amount"]),
                        "total": float(item["Total"])
                    })
                print('itemlist',items_list)
                bill_data = {
                    "hospital_address": "23, Chittur, Palakkad, Kerala, 675644",
                    "patient_name": billing.PatientName,
                    # "patient_id": patient.PatientId,
                    # "age": patient.Age,
                    "Bill_Status":new_bill_status,
                    "PaidAmount":bill_Items.get('PaidAmount'),
                    # "gender": patient.Gender,
                    "invoice_no": billing.Billing_Invoice_No,
                    "receipt_no": billing_receipt_table.Voucher_Number if billing_receipt_table else 'N/A',
                    "date": billing_date.strftime('%d/%m/%Y'),
                    # "patient_phone": patient.PhoneNo,
                    "items": items_list,
                    "amount_words": num2words(billing.Paid_Amount),
                    "gst": billing.Total_GSTAmount,
                    "billed_by": user_name,
                    "net_amount": billing.Net_Amount,
                    "gross_amount": billing.Total_Amount,
                }
                bill_text=''
                bill_text = IP_Walkin_format_bill(bill_data, paper_width_cm=14, left_margin_cm=0.5)
                # systemName = request.POST.get('systemName','')
                print("SYS--------", bill_text)
                # if systemName:
                #     JOB = PrintJob.objects.create(
                #         system_name=systemName,
                #         bill_text=bill_text
                #     )
                #     JOB.save()
                #     print("Job Assigned To", JOB)




                # hPrinter = win32print.OpenPrinter(printer_name)
                # try:
                #     hJob = win32print.StartDocPrinter(hPrinter, 1, ("OP Bill", None, "RAW"))
                #     win32print.StartPagePrinter(hPrinter)
                #     win32print.WritePrinter(hPrinter, bill_text.encode('ascii', errors='replace'))
                #     win32print.EndPagePrinter(hPrinter)
                #     win32print.EndDocPrinter(hPrinter)
                #     print("Bill printed successfully")
                # finally:
                #     win32print.ClosePrinter(hPrinter)


            except Exception as e:
                print(f"Warning: Error printing bill: {e}")
               
            return JsonResponse({
                'status': 'success',
                'message': 'Data saved successfully',
                'InvoiceNo': billing.Billing_Invoice_No,
                'ReceiptNo': recipetbill
            })

        except Exception as e:
            print("Critical error:", str(e))
            import traceback
            traceback.print_exc()
            # Rollback is automatic due to @transaction.atomic
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Only POST method allowed'}, status=405)



@csrf_exempt
@require_http_methods(['POST','GET'])
def WalkIn_IP_Pharmacy_Refund_Billing_link(request):
    if request.method == 'POST':
        try:
            selected_patient_data = json.loads(request.POST.get('SelectedPatient_list'))
            billing_date = request.POST.get('Billing_date')
            billpay_method = json.loads(request.POST.get('Billpay_method'))
            bill_Items = json.loads(request.POST.get('Bill_Items',{}))
            user_name = request.POST.get('User_Name')
            location_id = request.POST.get('location')
            bill_itemtable = json.loads(request.POST.get('Billing_itemtable', '[]'))  # Parse JSON string to list            
            pdf_data = request.FILES.get('pdfData')
            editid = request.POST.get('EditDue','')
            Paytype = request.POST.get('Paytype','')
            Store_location = request.POST.get('StoreLocation','')
            EditDue = request.POST.get('EditDue','')
            Remarks = request.POST.get('Remarks','')

            print('Selected Patient Data:', selected_patient_data)
            print('Billing Date:', billing_date)
            print('Billing Method:', billpay_method)
            print('Bill_Items:', bill_Items)
            print('PDF Data:', pdf_data)
            print('editidd',editid)
            # print("Billing Item Table:", bill_itemtable)

            try:
                doctor_id = selected_patient_data.get('Doctor_Id','')
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None                
                print('Doctor:', doctor_instance)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})

           
          

            try:
                location = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                print('Location:', location)
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Location not found'})
            print('111111111111')
            # Parse billing item details with safe integer and float conversion
            try:
                discount_amount = float(bill_Items.get('Discount', 0))
                sgst_val = float(bill_Items.get('SGSTval', 0))
                cgst_val = float(bill_Items.get('CGSTval', 0))
                gst_amount = float(bill_Items.get('GSTAmount', 0))
                
                total_items = int(bill_Items.get('totalItems', 0))
                total_qty = int(bill_Items.get('totalQty', 0))
                total_amount = float(bill_Items.get('Amount', 0))
                net_amount = float(bill_Items.get('totalAmount', 0))
                paid_amount = float(bill_Items.get('PaidAmount', 0))
                balance_amount = float(bill_Items.get('BalanceAmount', 0))
                round_off = float(bill_Items.get('Roundoff', 0))
                
                min_qty=0
                
                
                

              
            except ValueError as ve:
                print(f"Invalid value in Bill_Items: {ve}")
                return JsonResponse({'error': 'Invalid value in Bill_Items'})

            print('22222222222')
            new_bill_status = 'Paid' if balance_amount == 0.00 else 'Due'
            billing = None
            if editid:
                # Create the main billing entry
                try:
                    billing = IPPharmacyBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editid)
                    # billing.NewPayment = 'RefundPayment'
                    billing.save()
                    
                    print('billingggg', billing)
                except:
                    print("Bill is Due...")

            if EditDue :

                billinvoice = IP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No = EditDue).first()

            
            invo = IPPharmacyBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editid).Invoice_NO
     
            for iitem in bill_itemtable:
                print('yyyyyyyy xxxxxxxxxx')
                try:
                    print('yyyyyyyy')
                    item_id = iitem.get('ItemId')
                    item_code = iitem.get('ItemId')
                    batch_no = iitem.get('BatchNo')
                    billing_qty = iitem.get('Billing_Quantity', 0)

                    item_qty = IP_BillingItem.objects.filter(
                    Billing =invo,
                    id=item_code,
                    
                ).first()
                    print(item_qty,'item qtyyyyyy')
                    if item_qty:
                    
                    
                        item_qty.Billing_Quantity -=int(billing_qty)
                        print(f"✅ Found item | OriginalQty={item_qty.Billing_Quantity} | NewMinQty={''}")
                        item_qty.save()

                    print("item------",iitem.get('ProductId'),Store_location,iitem.get('BatchNo'),iitem.get('ItemId')) 
                    storelocation = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=iitem.get('ItemName').strip(),
                            Product_Detials__Status=True,
                            Store_location=Store_location,
                            Batch_No=iitem.get('BatchNo')
                        ).first() if Store_location else None
                    print('Store locationn:', storelocation.AvailableQuantity)
                    storelocation.AvailableQuantity += int(iitem.get('Billing_Quantity'))
                    print('Store locationn:', storelocation.AvailableQuantity)
                    storelocation.save()
                    print('Storeeeeeee:', storelocation.AvailableQuantity)
                except Exception as e:
                    print(str(e))
                    return JsonResponse({'error': str(e)})
                print('111111111111')
            billing_receipt_table = IPPharmacyBillingRefundReceipt(
                Invoice_NO=billing if billing else None,
                BillInvoice_NO = billinvoice if billinvoice else None,
                NewPayment= "RefundPayment",
                Patient_Name=selected_patient_data.get('PatientName',''),
                Quantity= total_items,
                TotalAmount= total_amount,
                TotalPaidAmount= paid_amount,
                BalanceAmount= balance_amount,
                Billing_Date=billing_date,
                PaidAmount= paid_amount,
                Billedby=user_name,
                Remarks = Remarks
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
            for bilt in bill_itemtable:
                item = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials__ItemName=bilt.get('ItemName').strip(),
                            Product_Detials__Status=True,
                            Store_location=Store_location,
                            Batch_No=bilt.get('BatchNo')
                        ).first()
                re_item = IP_BillingItem_Refund.objects.create(
                    Billing = billing_receipt_table,
                    ItemId = item,
                    ItemName =  bilt.get('ItemName'),
                    Reimbursable = "YES",
                    Refund_Quantity = bilt.get('Billing_Quantity'),
                    BatchNo = bilt.get('BatchNo'),
                    Exp_Date = bilt.get('Exp_Date'),
                    Unit_Price = bilt.get('Unit_Price'),
                    Amount = bilt.get('Amount'),
                    Total = bilt.get('Total'),
                )
                re_item.save()
                # item_qty = IP_BillingItem.objects.filter(
                #     pk=bilt.get('Itemidd'),
                #     ItemId=bilt.get('ItemId'),
                #     BatchNo=bilt.get('BatchNo'),
                # ).first()
                # if item_qty:
                #     print(float(item_qty.Billing_Quantity),'-',float(bilt.get('Billing_Quantity', 0)))
                #     min_qty = float(item_qty.Billing_Quantity) - float(bilt.get('Billing_Quantity', 0))
        

            def safe_decimal(value, default=Decimal('0.00')):
                """
                Safely convert a value to a Decimal. Returns a default value if the conversion fails.
                """
                try:
                    # If value is empty or non-numeric, return the default
                    return Decimal(str(value) if value else str(default))
                except (ValueError):
                    return default

            # Save each payment method
            for payment in billpay_method:
                payment_bill = IP_Pharmacy_Payment_Refund_Table_Detials.objects.create(
                    Receipt_No_Paid=billing_receipt_table if billing_receipt_table else None,
                    Payment_Type=payment.get('Billpay_method', ''),
                    Cart_Type=payment.get('CardType', ''),
                    Bank_Name=payment.get('BankName', ''),
                    Cheque_No=payment.get('ChequeNo', ''),
                    
                    # Use safe_decimal to handle conversion of amounts
                    Transaction_Amount=safe_decimal(payment.get('paidamount', 0)),
                    AdditionalAmount=safe_decimal(payment.get('Additionalamount', 0)),
                    Amount=safe_decimal(payment.get('paidamount', 0)) + safe_decimal(payment.get('Additionalamount', 0)),
                )
                payment_bill.save()
        
            return JsonResponse({'status': 'success', 'message': 'IP Data saved successfully','ReceiptNo':recipetbill})

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)})  
    elif request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            SearchProd = request.GET.get("SearchProd")
            Pharma_Type = request.GET.get("Pharma_Type")

            # Build dynamic filter query
            search_query = Q()
            if Pharma_Type:
                search_query=Q(Billing_Type=Pharma_Type)
            if SearchProd:
                prod_data = list(IP_BillingItem.objects.filter(ItemName__icontains=SearchProd).values_list("Billing__Billing_Invoice_No", flat=True)) 
                print("Prod-----",prod_data)
                if len(prod_data) > 0:
                    search_query &=Q(Billing_Invoice_No__in=prod_data)

            
            if SearchbyFirstName:
                print("Name-------------")
                patient_filter = ( 
                    Q(Billing_Invoice_No__icontains=SearchbyFirstName) |
                    Q(Patient_Id__PatientId__icontains=SearchbyFirstName) |
                    Q(Patient_Id__FirstName__icontains=SearchbyFirstName) |
                    Q(Patient_Id__PhoneNo__icontains=SearchbyFirstName) |
                    Q(PatientName__icontains = SearchbyFirstName)
                )
                search_query &= patient_filter
            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                print("Speciality-------------")
                search_query &= Q(Invoice_NO__Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)

            if SearchbyDoctor:
                print("Doctor-------------")
                search_query &= Q(Invoice_NO__Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                print("Current-------------",type(CurrentDate),CurrentDate)
                search_query &= Q(created_at__date = CurrentDate)  

            elif DateType == "Customize":
                print("Custom-------------")
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)
        
            general_billing_dataaa = IP_Pharmacy_Billing_Table_Detials.objects.filter(search_query).order_by("-created_at")
            print('1212121212', general_billing_dataaa)
            response_data = []
            S_No=0
            for general_billing_data in general_billing_dataaa:
                S_No+=1
                billing_details = {

                    "S_No":S_No,
                    'id': general_billing_data.Billing_Invoice_No,
                    'Type': 'PharmacyRefund',
                    'Billing_Date': general_billing_data.Billing_Date,
                    'Doctor_Id': general_billing_data.Doctor_Id.Doctor_ID if general_billing_data.Doctor_Id else None,
                    'Doctor_Name': f"{general_billing_data.Doctor_Id.Tittle.Title_Name if general_billing_data.Doctor_Id else None}.{general_billing_data.Doctor_Id.First_Name if general_billing_data.Doctor_Id else None } {general_billing_data.Doctor_Id.Middle_Name if general_billing_data.Doctor_Id else None} {general_billing_data.Doctor_Id.Last_Name if general_billing_data.Doctor_Id else None}",
                    'PatientId': general_billing_data.Patient_Id.PatientId if general_billing_data.Patient_Id else None ,
                    'Speciality' : general_billing_data.Register_Id.Specialization.Speciality_Name if general_billing_data.Register_Id and general_billing_data.Register_Id.Specialization else None,
                    'Patient_Name': (
                        general_billing_data.Patient_Id.FirstName
                        if general_billing_data.Patient_Id
                        else general_billing_data.PatientName
                    ),
                    'PhoneNo': general_billing_data.Patient_Id.PhoneNo if general_billing_data.Patient_Id else None ,
                    # 'Register_Id': general_billing_data.Register_Id,
                    'Gender': general_billing_data.Patient_Id.Gender if general_billing_data.Patient_Id else None ,
                    'City': general_billing_data.Patient_Id.City if general_billing_data.Patient_Id else None ,
                    'State': general_billing_data.Patient_Id.State if general_billing_data.Patient_Id else None ,
                    'Pincode': general_billing_data.Patient_Id.Pincode if general_billing_data.Patient_Id else None ,
                    'AgeGender': f'{general_billing_data.Patient_Id.Age if general_billing_data.Patient_Id else None }/{general_billing_data.Patient_Id.Gender if general_billing_data.Patient_Id else None }',
                    'Address': f'{general_billing_data.Patient_Id.DoorNo if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.Street if general_billing_data.Patient_Id else None }, {general_billing_data.Patient_Id.Area if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.City if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.State if general_billing_data.Patient_Id else None }, {general_billing_data.Patient_Id.Country if general_billing_data.Patient_Id else None}, {general_billing_data.Patient_Id.Pincode if general_billing_data.Patient_Id else None}',
                    # 'PatientCategory': general_billing_data.Register_Id.PatientCategory,
                    # 'PatientCategoryName': (
                    #     general_billing_data.Register_Id.InsuranceName
                    #     if general_billing_data.Register_Id.PatientCategory == 'Insurance'
                    #     else getattr(general_billing_data.Register_Id.ClientName, 'Client_Name', None)
                    # ),
                    'Billing_Type': general_billing_data.Billing_Type,
                    'PharmacyType':general_billing_data.PharmacyType,
                    'TotalItems': general_billing_data.Total_Items,
                    'TotalQty': general_billing_data.Total_Qty,
                    'RoundOff': general_billing_data.Round_Off,
                    'TotalAmount': general_billing_data.Total_Amount,
                    'TotalDiscount': general_billing_data.Discount_Amount,
                    'Net_Amount': general_billing_data.Net_Amount,
                    'PaidAmount': general_billing_data.Paid_Amount,
                    'PaidNetAmount': general_billing_data.Paid_Amount,
                    'BalanceAmount': general_billing_data.Balance_Amount,
                    'Bill_Status': general_billing_data.Bill_Status,
                    'Billing_Items': [],
                }
                
                record_id = 1
                billing_items = IP_BillingItem.objects.filter(Billing__Billing_Invoice_No=general_billing_data.Billing_Invoice_No)
                print('billllllll',billing_items)
                for item in billing_items:
                    item_details = {
                        'S_No': record_id,
                        'itemid': item.pk,
                        'Invoice_No': item.Billing.Billing_Invoice_No,
                        'ItemName': item.ItemName,
                        'BatchNo': item.BatchNo,
                        'Exp_Date': item.Exp_Date,
                        'Unit_Price': item.Unit_Price,
                        'Charge': item.Unit_Price,
                        'Billing_Quantity': item.Billing_Quantity,
                        'Amount': item.Amount,
                        'Total': item.Total,
                    }
                    record_id +=1
                    billing_details['Billing_Items'].append(item_details)
                response_data.append(billing_details)
            
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            print("Error:",str(e))
            return JsonResponse({'error':str(e)})



@csrf_exempt
@require_http_methods(['GET'])
def fetch_ip_pharmacy_billing_for_Acceptance(request):
    try:
        # GET parameters
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        search_status = request.GET.get("SearchStatus")
        location_id = request.GET.get("location")
        Pharma_Type = request.GET.get("Pharma_Type")
 
        # ====== Filters ======
        filters = Q()
        if Pharma_Type:
            filters = Q(Billing_Type=Pharma_Type)
        # Date filter
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date__range=(dt_from, dt_to))
            except ValueError:
                pass
 
        # Patient first name
        if search_first_name:
            filters &= Q(Patient_Id__FirstName__icontains=search_first_name) | Q(PatientName__icontains=search_first_name)
 
        # Doctor filter
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)
 
        # Doctor speciality
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)
 
        # Billing status
        if search_status:
            filters &= Q(Bill_Status=search_status)
 
        # Location filter
        if location_id:
            filters &= Q(Location__Location_Id=location_id)
 
        # Apply filters to base queryset first
        bills = IP_Pharmacy_Billing_Table_Detials.objects.filter(filters,IsCollected=False).order_by('-created_at')
 
        print(len(bills), 'bills')
 
        # Apply prefetch_related and select_related after filtering
        bills = bills.prefetch_related(
            Prefetch("IP_billing_items"),
            Prefetch("IPPharmacy_receipt__IP_billing_payments")
        )
 
        # Ordering
 
        # ===== Build JSON =====
        datafetch = []
        S_no = 1
        for bill in bills:
            patient = bill.Patient_Id
            doctor = bill.Doctor_Id
            registration = bill.Register_Id
            receipt = bill.IPPharmacy_receipt.first()
            payments = receipt.IP_billing_payments.all() if receipt else []
 
            # Determine PatientName based on Patient_Id
            patient_name = bill.PatientName if patient is None else f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
 
            datafetch.append({
                "id": bill.Billing_Invoice_No,
                "S_no": S_no,
                "BillingDate": bill.Billing_Date,
                "BillingType": bill.Billing_Type,
                "Status": bill.Bill_Status,
                "Billed_By": bill.created_by,
                "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "RegisterId": getattr(registration, 'Registration_Id', None) if registration else None,
                "BillingType": bill.Billing_Type,
                "PharmacyType": bill.PharmacyType,
 
                # Patient details
                "PatientId": getattr(patient, 'PatientId', None) if patient else None,
                "PatientName": patient_name,
                "PatientPhoneNo": getattr(patient, 'PhoneNo', None) if patient else None,
                "PatientCategory": getattr(registration, 'PatientCategory', None) if registration else None,
                "VisitId": getattr(registration, 'VisitId', '') if registration else '',
                "Gender": getattr(getattr(registration, 'PatientId', None), 'Gender', '') if registration else '',
                "Age": getattr(getattr(registration, 'PatientId', None), 'Age', '') if registration else '',
 
                # Doctor details
                "DoctorId": getattr(doctor, 'Doctor_ID', None) if doctor else None,
                "DoctorName": f"Dr.{doctor.First_Name}" if doctor else None,
 
                # Registration details
                "VisitPurpose": getattr(registration, 'VisitPurpose', None) if registration else None,
 
                # Billing totals
                "TotalAmount": float(getattr(bill, 'Total_Amount', 0)),
                "NetAmount": float(getattr(bill, 'Net_Amount', 0)),
                "PaidAmount": float(getattr(bill, 'Paid_Amount', 0)),
                "BalanceAmount": float(getattr(bill, 'Balance_Amount', 0)),
                "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
 
                # Billing items
                "Items": [
                    {
                        "ItemId": getattr(item, 'ItemId_id', None),
                        "ItemName": getattr(item, 'ItemName', None),
                        "BatchNo": getattr(item, 'BatchNo', None),
                        "Quantity": getattr(item, 'Billing_Quantity', None),
                        "UnitPrice": getattr(item, 'Unit_Price', None),
                        "Total": getattr(item, 'Total', None),
                        "ExpDate": getattr(item, 'Exp_Date', None),
                    }
                    for item in bill.IP_billing_items.all()
                ],
 
                # Receipt
                "Receipt": {
                    "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                    "TotalAmount": getattr(receipt, 'TotalAmount', None),
                    "PaidAmount": getattr(receipt, 'PaidAmount', None),
                    "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                    "BilledBy": getattr(receipt, 'Billedby', None),
                } if receipt else None,
 
                # Payments
                "Payments": [
                    {
                        "Method": getattr(pay, 'Billpay_method', None),
                        "CardType": getattr(pay, 'CardType', None),
                        "BankName": getattr(pay, 'BankName', None),
                        "ChequeNo": getattr(pay, 'ChequeNo', None),
                        "PaidAmount": getattr(pay, 'paidamount', None),
                        "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                        "TransactionFee": getattr(pay, 'transactionFee', None),
                    }
                    for pay in payments
                ]
            })
            S_no += 1
 
        return JsonResponse(datafetch, safe=False, status=200)
 
    except Exception as e:
        print("Error in fetch_ip_pharmacy_billing:", str(e))
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
 
@csrf_exempt
@require_http_methods(['GET'])
def fetch_ip_pharmacy_refund_billing_for_Acceptance(request):
    try:
        # ---------------------
        # Filters
        # ---------------------
        pharma = request.GET.get("pharma")          
        date_type = request.GET.get("DateType")          
        current_date = request.GET.get("CurrentDate")    
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_status = request.GET.get("SearchStatus")          
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        location_id = request.GET.get("location")
        # ---------------------
        # Base queryset
        # ---------------------
 
       
 
        bills = IPPharmacyBillingRefundReceipt.objects.exclude(Invoice_NO__Invoice_NO__Billing_Type='FREE PHARMACY')
       
        if pharma =='3':
            print('ulla vanten')
            bills = IPPharmacyBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO__Billing_Type='IP PHARMACY',IsRefunded=False)
        filters = Q()
 
        # ---------------------
        # Date filter
        # ---------------------
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date__range=(dt_from, dt_to))
            except ValueError:
                pass
 
        # Patient name filter
        if search_first_name:
            filters &= Q(Patient_Name__icontains=search_first_name)
 
        # Doctor/Speciality filter via Invoice -> IP_Pharmacy_Billing_Table_Detials
        if search_doctor:
            filters &= Q(Invoice_NO__Doctor_Id__Doctor_Name__icontains=search_doctor)
        if search_speciality:
            filters &= Q(Invoice_NO__Doctor_Id__Speciality__icontains=search_speciality)
 
        # Status filter
        if search_status:
            status_map = {"Refunded": "RefundPayment"}  # Adjust if needed
            filters &= Q(NewPayment__icontains=status_map.get(search_status, search_status))
 
        # Location filter via Invoice -> IP_Pharmacy_Billing_Table_Detials
        # if location_id:
        #     filters &= Q(Invoice_NO__Location__Location_Id=location_id)
 
        # ---------------------
        # Apply filters & order
        # ---------------------
        bills = bills.filter(filters)
        bills = bills.order_by('-CreatedAt')
 
        # ---------------------
        # Build JSON response
        # ---------------------
        datafetch = []
        # for idx, bill in enumerate(bills, start=1):
        #     invoice = bill.Invoice_NO
        #     payments = bill.IPPharmacy_Receipt_No_Payments_Refund.all() if invoice else []
        #     registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()
        #     print("Billing",bill.Invoice_NO.pk)
        #     re_item = IP_BillingItem_Refund.objects.filter(Billing = bill)
        #     print("Item",re_item)
        #     datafetch.append({
        #         "S_No": idx,
        #         "id": bill.Voucher_Number,
        #         "BillingDate": bill.Billing_Date,
        #         "Bill_Status": bill.NewPayment,
        #         "PatientId": bill.PatientID,
        #         "Patient_Name": bill.Patient_Name,
        #         "PhoneNo": bill.PhoneNumber,
        #         "PatientCategory": registration.PatientCategory if registration else "",
        #         "Doctor_Name": f'Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}' if registration and registration.PrimaryDoctor else "",
        #         # "Speciality": registration.DoctorId.Speciality if registration and registration.DoctorId else "",
        #         "amount_in_words":num2words.num2words(bill.TotalAmount),
        #         "TotalAmount": float(bill.TotalAmount),
        #         "PaidAmount": float(bill.PaidAmount),
        #         "BalanceAmount": float(bill.BalanceAmount),
        #         "BilledBy": bill.Billedby,
        #         "Status": bill.NewPayment,
        #        # Refund payments
        #         "Payments": [
        #             {
        #                 "Payment_Type": pay.Payment_Type,  # was Billpay_method
        #                 "CardType": pay.Cart_Type,
        #                 "BankName": pay.Bank_Name,
        #                 "ChequeNo": pay.Cheque_No,
        #                 "Transaction_Amount": float(pay.Transaction_Amount),
        #                 "AdditionalAmount": float(pay.AdditionalAmount),
        #                 "Amount": float(pay.Amount),
        #             } for pay in payments
        #         ],                        
        #             # Items (dot-matrix bill)
        #         "Items": [
        #                 {
        #                     "ItemName": item.ItemName,
        #                     "BatchNo": item.BatchNo,
        #                     "ExpDate": item.Exp_Date,
        #                     "Quantity": item.Refund_Quantity,
        #                     "UnitPrice": float(item.Unit_Price),
        #                     "Total": float(item.Total),
        #                 }
        #                 for item in re_item
        #             ]
        #     })
 
 
        for idx, bill in enumerate(bills, start=1):
            invoice = bill.Invoice_NO
            print("invoice------",invoice,bill.Patient_Name)
            payments = bill.IPPharmacy_Receipt_No_Payments_Refund.all() if invoice else []
            registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()
 
            # Refund items for this bill
            refund_items = IP_BillingItem_Refund.objects.filter(Billing=bill)
 
            datafetch.append({
                "S_No": idx,
                "id": bill.Voucher_Number,
                "Billing_Date": bill.Billing_Date,
                "Bill_Status": bill.NewPayment,
                "PatientId": bill.PatientID,
                "Patient_Name": bill.Patient_Name,
                "PhoneNo": bill.PhoneNumber,
                "PatientCategory": registration.PatientCategory if registration else "",
                "Doctor_Name": (
                    f"Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}"
                    if registration and registration.PrimaryDoctor else ""
                ),
                # "amount_in_words": num2words.num2words(bill.TotalAmount),
                "TotalAmount": float(bill.TotalAmount),
                "PaidAmount": float(bill.PaidAmount),
                "BalanceAmount": float(bill.BalanceAmount),
                "BilledBy": bill.Billedby,
                "Status": bill.NewPayment,
 
                # Refund payments
                "Payments": [
                    {
                        "Payment_Type": pay.Payment_Type,
                        "CardType": pay.Cart_Type,
                        "BankName": pay.Bank_Name,
                        "ChequeNo": pay.Cheque_No,
                        "Transaction_Amount": float(pay.Transaction_Amount),
                        "AdditionalAmount": float(pay.AdditionalAmount),
                        "Amount": float(pay.Amount),
                    }
                    for pay in payments
                ],
 
                # Refund items
                "Items": [
                    {
                        "ItemName": item.ItemName,
                        "BatchNo": item.BatchNo,
                        "ExpDate": item.Exp_Date,
                        "Quantity": item.Refund_Quantity,  # ✅ correct field
                        "UnitPrice": float(item.Unit_Price),
                        "Total": float(item.Total),
                    }
                    for item in refund_items
                ]
            })
        return JsonResponse({"ip_pharmacy_refund_bills": datafetch}, safe=False, status=200)
 
    except Exception as e:
        print(str(e))
        return JsonResponse({"error": str(e)}, status=500)
   
 
 

 
# ------------------------------Drug Flow Chart ---------------------------------------
 
 
@csrf_exempt
@require_http_methods(['POST'])
def get_booking_administrations(request):
    if request.method == "POST":  # since body is being sent
        try:
            body = json.loads(request.body.decode("utf-8"))
            booking_id = body.get("Booking_Id")
 
            if not booking_id:
                return JsonResponse({"error": "Booking_Id is required"}, status=400)
 
            administrations = Ip_Nurse_Drug_Completed_Administration.objects.filter(Booking_Id_id=booking_id)
            
            data = []
            for admin in administrations:
                data.append({
                    "Nurse_Prescription_Id": admin.Nurse_Prescription_Id,
 
                    # "Department": 'IP ',
                    "DoctorName": str(admin.Prescription_Id.Booking_Id.DoctorId.First_Name) if admin.Prescription_Id.Booking_Id.DoctorId else '',
                    "ProductCode": str(admin.ProductCode.Product_Detials.pk) if admin.ProductCode else '',
                                        "ItemName": str(admin.ProductCode.Product_Detials.ItemName) if admin.ProductCode else '',
 
                    "Dosage": admin.Prescription_Id.AdminisDose,
                    "Route": admin.Route,
                    "Frequency": admin.Prescription_Id.Frequency.FrequencyName,
                    "Quantity": admin.Quantity,
                    "Issued_Date": admin.Issued_Date,
                    "Complete_Date": admin.Complete_Date,
                    "Complete_Time": admin.Complete_Time,
                    "Status": admin.Status,
                    "CapturedBy": admin.CapturedBy,
                })
            return JsonResponse(data, safe=False, status=200)
 
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
 
    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
@require_http_methods(['GET'])
def fetch_op_pharmacy_billing_for_Acceptance(request):
    try:
        # GET parameters
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        search_status = request.GET.get("SearchStatus")
        location_id = request.GET.get("location")
        Pharma_Type = request.GET.get("Pharma_Type")
 
        # ====== Filters ======
        filters = Q()
        # if Pharma_Type:
        #     filters &= Q(Billing_Type=Pharma_Type)
        
        # Date filter
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date__range=(dt_from, dt_to))
            except ValueError:
                pass
 
        # Patient first name - updated to use Patient_name field
        if search_first_name:
            filters &= Q(Patient_Id__FirstName__icontains=search_first_name) | Q(Patient_name__icontains=search_first_name)
 
        # Doctor filter
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)
 
        # Doctor speciality
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)
 
        # Billing status
        if search_status:
            filters &= Q(Bill_Status='Paid')
 
        # Location filter
        if location_id:
            filters &= Q(Location__Location_Id=location_id)
 
        # Apply filters to base queryset first
        bills = OP_Pharmacy_Billing_Table_Detials.objects.filter(filters, IsCollected=False).order_by('-created_at').exclude(created_by='host')
 
        print(len(bills), 'bills for acceptanceeeeeeeee')
 
        # Apply prefetch_related and select_related after filtering
        bills = bills.prefetch_related(
            Prefetch("OP_billing_items"),
            Prefetch("Pharmacy_receipt")
        ).select_related('Patient_Id', 'Doctor_Id', 'Register_Id', 'Location')
 
        # # Ordering
        # if search_time_order == 'asc':
        #     bills = bills.order_by('Billing_Date')
        # else:
        #     bills = bills.order_by('-Billing_Date')
 
        # ===== Build JSON =====
        datafetch = []
        S_no = 1
        for bill in bills:
            patient = bill.Patient_Id
            doctor = bill.Doctor_Id
            registration = bill.Register_Id
            receipt = bill.Pharmacy_receipt.first()
            payments = receipt.billing_payments.all() if receipt else []
 
            # Determine PatientName - use Patient_name field directly
            patient_name = bill.Patient_name
            if not patient_name and patient:
                patient_name = f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
 
            datafetch.append({
    "id": bill.Billing_Invoice_No,
    "S_no": S_no,
    "BillingDate": bill.Billing_Date,
    "BillingType": bill.Billing_Type,
    "Status": bill.Bill_Status,
    "Billed_By": bill.created_by,
    "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
    "RegisterId": getattr(registration, 'Registration_Id', None) if registration else None,
    "BillingType": bill.Billing_Type,
    "CollectedType": bill.CollectedType,
    "IsCollected": bill.IsCollected,
    "Collectedby": bill.Collectedby,
    "Remarks": bill.Remarks,

    # Discount details
    "Select_Discount": bill.Select_Discount,
    "Discount_Type": bill.Discount_Type,
    "Discount_Amount": round(float(bill.Discount_Amount)),  # rounded to nearest whole number
    "Total_Items": bill.Total_Items,
    "Total_Qty": bill.Total_Qty,

    # GST details
    "SGST_val": round(float(bill.SGST_val)),  # rounded to nearest whole number
    "CGST_val": round(float(bill.CGST_val)),  # rounded to nearest whole number
    "Total_GSTAmount": round(float(bill.Total_GSTAmount)),  # rounded to nearest whole number
    "Round_Off": round(float(bill.Round_Off)),  # rounded to nearest whole number

    # Patient details
    "PatientId": getattr(patient, 'PatientId', None) if patient else None,
    "PatientName": patient_name,
    "PatientPhoneNo": getattr(patient, 'PhoneNo', None) if patient else None,
    "PatientCategory": getattr(registration, 'PatientCategory', None) if registration else None,
    "VisitId": getattr(registration, 'VisitId', '') if registration else '',
    "Gender": getattr(getattr(registration, 'PatientId', None), 'Gender', '') if registration else '',
    "Age": getattr(getattr(registration, 'PatientId', None), 'Age', '') if registration else '',

    # Doctor details
    "DoctorId": getattr(doctor, 'Doctor_ID', None) if doctor else None,
    "DoctorName": f"Dr.{getattr(doctor, 'First_Name', '')}" if doctor else None,

    # Registration details
    "VisitPurpose": getattr(registration, 'VisitPurpose', None) if registration else None,

    # Billing totals
    "TotalAmount": round(float(bill.Total_Amount)),  # rounded to nearest whole number
    "NetAmount": round(float(bill.Net_Amount)),  # rounded to nearest whole number
    "PaidAmount": round(float(bill.Paid_Amount)),  # rounded to nearest whole number
    "BalanceAmount": round(float(bill.Balance_Amount)),  # rounded to nearest whole number
    "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),

 
                # Billing items
                "Items": [
                    {
                        "ItemId": getattr(item, 'ItemId_id', None),
                        "ItemName": getattr(item, 'ItemName', None),
                        "BatchNo": getattr(item, 'BatchNo', None),
                        "Quantity": getattr(item, 'Billing_Quantity', None),
                        "UnitPrice": getattr(item, 'Unit_Price', None),
                        "Amount": getattr(item, 'Amount', None),
                        "Total": getattr(item, 'Total', None),
                        "ExpDate": getattr(item, 'Exp_Date', None),
                    }
                    for item in bill.OP_billing_items.all()
                ],
 
                # Receipt
                "Receipt": {
                    "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                    "TotalAmount": getattr(receipt, 'TotalAmount', None),
                    "PaidAmount": getattr(receipt, 'PaidAmount', None),
                    "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                    "BilledBy": getattr(receipt, 'Billedby', None),
                    "PatientID": getattr(receipt, 'PatientID', None),
                    "Patient_Name": getattr(receipt, 'Patient_Name', None),
                    "PhoneNumber": getattr(receipt, 'PhoneNumber', None),
                    "NewPayment": getattr(receipt, 'NewPayment', None),
                } if receipt else None,
 
                # Payments
                "Payments": [
                    {
                        "Method": getattr(pay, 'Billpay_method', None),
                        "CardType": getattr(pay, 'CardType', None),
                        "BankName": getattr(pay, 'BankName', None),
                        "ChequeNo": getattr(pay, 'ChequeNo', None),
                        "PaidAmount": getattr(pay, 'paidamount', None),
                        "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                        "TransactionFee": getattr(pay, 'transactionFee', None),
                    }
                    for pay in payments
                ]
            })
            S_no += 1
 
        return JsonResponse(datafetch, safe=False, status=200)
 
    except Exception as e:
        print("Error in fetch_op_pharmacy_billing_for_Acceptance:", str(e))
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def fetch_optical_pharmacy_billing_for_Acceptance(request):
    try:
        # GET parameters
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        search_status = request.GET.get("SearchStatus")
        location_id = request.GET.get("location")
        Pharma_Type = request.GET.get("Pharma_Type")
 
        # ====== Filters ======
        filters = Q()
        # if Pharma_Type:
        #     filters &= Q(Billing_Type=Pharma_Type)
        
        # Date filter
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date__range=(dt_from, dt_to))
            except ValueError:
                pass
 
        # Patient first name - updated to use Patient_name field
        if search_first_name:
            filters &= Q(Patient_Id__FirstName__icontains=search_first_name) | Q(Patient_name__icontains=search_first_name)
 
        # Doctor filter
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)
 
        # Doctor speciality
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)
 
        # Billing status
        if search_status:
            filters &= Q(Bill_Status='Paid')
 
        # Location filter
        if location_id:
            filters &= Q(Location__Location_Id=location_id)
 
        # Apply filters to base queryset first
        bills = OP_Pharmacy_Billing_Table_Detials_optical.objects.filter(filters, IsCollected=False).order_by('-created_at')
 
        print(len(bills), 'bills for acceptanceeeeeeeee')
 
        # Apply prefetch_related and select_related after filtering
        bills = bills.prefetch_related(
            Prefetch("OP_billing_items_optical"),
            Prefetch("Pharmacy_receipt_optical")
        ).select_related('Patient_Id', 'Doctor_Id', 'Register_Id', 'Location')
 
        # # Ordering
        # if search_time_order == 'asc':
        #     bills = bills.order_by('Billing_Date')
        # else:
        #     bills = bills.order_by('-Billing_Date')
 
        # ===== Build JSON =====
        datafetch = []
        S_no = 1
        for bill in bills:
            patient = bill.Patient_Id
            doctor = bill.Doctor_Id
            registration = bill.Register_Id
            receipt = bill.Pharmacy_receipt_optical.first()
            payments = receipt.billing_payments_optical.all() if receipt else []
 
            # Determine PatientName - use Patient_name field directly
            patient_name = bill.Patient_name
            if not patient_name and patient:
                patient_name = f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
 
            datafetch.append({
                "id": bill.Billing_Invoice_No,
                "S_no": S_no,
                "BillingDate": bill.Billing_Date,
                "BillingType": bill.Billing_Type,
                "Status": bill.Bill_Status,
                "Billed_By": bill.created_by,
                "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "RegisterId": getattr(registration, 'Registration_Id', None) if registration else None,
                "BillingType": bill.Billing_Type,
                "CollectedType": bill.CollectedType,
                "IsCollected": bill.IsCollected,
                "Collectedby": bill.Collectedby,
                "Remarks": bill.Remarks,

                # Discount details
                "Select_Discount": bill.Select_Discount,
                "Discount_Type": bill.Discount_Type,
                "Discount_Amount": float(bill.Discount_Amount),
                "Total_Items": bill.Total_Items,
                "Total_Qty": bill.Total_Qty,

                # GST details
                "SGST_val": float(bill.SGST_val),
                "CGST_val": float(bill.CGST_val),
                "Total_GSTAmount": float(bill.Total_GSTAmount),
                "Round_Off": float(bill.Round_Off),

                # Patient details
                "PatientId": getattr(patient, 'PatientId', None) if patient else None,
                "PatientName": patient_name,
                "PatientPhoneNo": getattr(patient, 'PhoneNo', None) if patient else None,
                "PatientCategory": getattr(registration, 'PatientCategory', None) if registration else None,
                "VisitId": getattr(registration, 'VisitId', '') if registration else '',
                "Gender": getattr(getattr(registration, 'PatientId', None), 'Gender', '') if registration else '',
                "Age": getattr(getattr(registration, 'PatientId', None), 'Age', '') if registration else '',
 
                # Doctor details
                "DoctorId": getattr(doctor, 'Doctor_ID', None) if doctor else None,
                "DoctorName": f"Dr.{getattr(doctor, 'First_Name', '')}" if doctor else None,
 
                # Registration details
                "VisitPurpose": getattr(registration, 'VisitPurpose', None) if registration else None,
 
                # Billing totals
                "TotalAmount": float(bill.Total_Amount),
                "NetAmount": float(bill.Net_Amount),
                "PaidAmount": float(bill.Paid_Amount),
                "BalanceAmount": float(bill.Balance_Amount),
                "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
 
                # Billing items
                "Items": [
                    {
                        "ItemId": getattr(item, 'ItemId_id', None),
                        "ItemName": getattr(item, 'ItemName', None),
                        "BatchNo": getattr(item, 'BatchNo', None),
                        "Quantity": getattr(item, 'Billing_Quantity', None),
                        "UnitPrice": getattr(item, 'Unit_Price', None),
                        "Amount": getattr(item, 'Amount', None),
                        "Total": getattr(item, 'Total', None),
                        "ExpDate": getattr(item, 'Exp_Date', None),
                    }
                    for item in bill.OP_billing_items_optical.all()
                ],
 
                # Receipt
                "Receipt": {
                    "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                    "TotalAmount": getattr(receipt, 'TotalAmount', None),
                    "PaidAmount": getattr(receipt, 'PaidAmount', None),
                    "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                    "BilledBy": getattr(receipt, 'Billedby', None),
                    "PatientID": getattr(receipt, 'PatientID', None),
                    "Patient_Name": getattr(receipt, 'Patient_Name', None),
                    "PhoneNumber": getattr(receipt, 'PhoneNumber', None),
                    "NewPayment": getattr(receipt, 'NewPayment', None),
                } if receipt else None,
 
                # Payments
                "Payments": [
                    {
                        "Method": getattr(pay, 'Billpay_method', None),
                        "CardType": getattr(pay, 'CardType', None),
                        "BankName": getattr(pay, 'BankName', None),
                        "ChequeNo": getattr(pay, 'ChequeNo', None),
                        "PaidAmount": getattr(pay, 'paidamount', None),
                        "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                        "TransactionFee": getattr(pay, 'transactionFee', None),
                    }
                    for pay in payments
                ]
            })
            S_no += 1
 
        return JsonResponse(datafetch, safe=False, status=200)
 
    except Exception as e:
        print("Error in fetch_op_pharmacy_billing_for_Acceptance:", str(e))
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def fetch_op_pharmacy_billing_for_after_Acceptance(request):
    try:
        # GET parameters
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        search_status = request.GET.get("SearchStatus")
        location_id = request.GET.get("location")
        Pharma_Type = request.GET.get("Pharma_Type")
 
        # ====== Filters ======
        filters = Q()
        # if Pharma_Type:
        #     filters &= Q(Billing_Type=Pharma_Type)
        
        # Date filter
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date=dt)
            except ValueError:
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(created_at__date__range=(dt_from, dt_to))
            except ValueError:
                pass
 
        # Patient first name - updated to use Patient_name field
        if search_first_name:
            filters &= Q(Patient_Id__FirstName__icontains=search_first_name) | Q(Patient_name__icontains=search_first_name)
 
        # Doctor filter
        if search_doctor:
            filters &= Q(Doctor_Id__Doctor_Name__icontains=search_doctor)
 
        # Doctor speciality
        if search_speciality:
            filters &= Q(Doctor_Id__Speciality__icontains=search_speciality)
 
        # Billing status
        if search_status:
            filters &= Q(Bill_Status=search_status)
 
        # Location filter
        if location_id:
            filters &= Q(Location__Location_Id=location_id)
 
        # Apply filters to base queryset first
        bills = OP_Pharmacy_Billing_Table_Detials.objects.filter(filters, IsCollected=True).order_by('-created_at')
 
        print(len(bills), 'bills')
 
        # Apply prefetch_related and select_related after filtering
        bills = bills.prefetch_related(
            Prefetch("OP_billing_items"),
            Prefetch("Pharmacy_receipt")
        ).select_related('Patient_Id', 'Doctor_Id', 'Register_Id', 'Location')
 
        # # Ordering
        # if search_time_order == 'asc':
        #     bills = bills.order_by('Billing_Date')
        # else:
        #     bills = bills.order_by('-Billing_Date')
 
        # ===== Build JSON =====
        datafetch = []
        S_no = 1
        for bill in bills:
            patient = bill.Patient_Id
            doctor = bill.Doctor_Id
            registration = bill.Register_Id
            receipt = bill.Pharmacy_receipt.first()
            payments = receipt.billing_payments.all() if receipt else []
 
            # Determine PatientName - use Patient_name field directly
            patient_name = bill.Patient_name
            if not patient_name and patient:
                patient_name = f"{getattr(patient, 'FirstName', '')} {getattr(patient, 'SurName', '')}".strip()
 
            datafetch.append({
                "id": bill.Billing_Invoice_No,
                "S_no": S_no,
                "BillingDate": bill.Billing_Date,
                "BillingType": bill.Billing_Type,
                "Status": bill.Bill_Status,
                "Billed_By": bill.created_by,
                "CreatedAt": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "RegisterId": getattr(registration, 'Registration_Id', None) if registration else None,
                "BillingType": bill.Billing_Type,
                "CollectedType": bill.CollectedType,
                "IsCollected": bill.IsCollected,
                "Collectedby": bill.Collectedby,
                "Remarks": bill.Remarks,

                # Discount details
                "Select_Discount": bill.Select_Discount,
                "Discount_Type": bill.Discount_Type,
                "Discount_Amount": float(bill.Discount_Amount),
                "Total_Items": bill.Total_Items,
                "Total_Qty": bill.Total_Qty,

                # GST details
                "SGST_val": float(bill.SGST_val),
                "CGST_val": float(bill.CGST_val),
                "Total_GSTAmount": float(bill.Total_GSTAmount),
                "Round_Off": float(bill.Round_Off),

                # Patient details
                "PatientId": getattr(patient, 'PatientId', None) if patient else None,
                "PatientName": patient_name,
                "PatientPhoneNo": getattr(patient, 'PhoneNo', None) if patient else None,
                "PatientCategory": getattr(registration, 'PatientCategory', None) if registration else None,
                "VisitId": getattr(registration, 'VisitId', '') if registration else '',
                "Gender": getattr(getattr(registration, 'PatientId', None), 'Gender', '') if registration else '',
                "Age": getattr(getattr(registration, 'PatientId', None), 'Age', '') if registration else '',
 
                # Doctor details
                "DoctorId": getattr(doctor, 'Doctor_ID', None) if doctor else None,
                "DoctorName": f"Dr.{getattr(doctor, 'First_Name', '')}" if doctor else None,
 
                # Registration details
                "VisitPurpose": getattr(registration, 'VisitPurpose', None) if registration else None,
 
                # Billing totals
                "TotalAmount": float(bill.Total_Amount),
                "NetAmount": float(bill.Net_Amount),
                "PaidAmount": float(bill.Paid_Amount),
                "BalanceAmount": float(bill.Balance_Amount),
                "Location": getattr(getattr(bill, 'Location', None), 'Location_Name', None),
 
                # Billing items
                "Items": [
                    {
                        "ItemId": getattr(item, 'ItemId_id', None),
                        "ItemName": getattr(item, 'ItemName', None),
                        "BatchNo": getattr(item, 'BatchNo', None),
                        "Quantity": getattr(item, 'Billing_Quantity', None),
                        "UnitPrice": getattr(item, 'Unit_Price', None),
                        "Amount": getattr(item, 'Amount', None),
                        "Total": getattr(item, 'Total', None),
                        "ExpDate": getattr(item, 'Exp_Date', None),
                    }
                    for item in bill.OP_billing_items.all()
                ],
 
                # Receipt
                "Receipt": {
                    "VoucherNo": getattr(receipt, 'Voucher_Number', None),
                    "TotalAmount": getattr(receipt, 'TotalAmount', None),
                    "PaidAmount": getattr(receipt, 'PaidAmount', None),
                    "BalanceAmount": getattr(receipt, 'BalanceAmount', None),
                    "BilledBy": getattr(receipt, 'Billedby', None),
                    "PatientID": getattr(receipt, 'PatientID', None),
                    "Patient_Name": getattr(receipt, 'Patient_Name', None),
                    "PhoneNumber": getattr(receipt, 'PhoneNumber', None),
                    "NewPayment": getattr(receipt, 'NewPayment', None),
                } if receipt else None,
 
                # Payments
                "Payments": [
                    {
                        "Method": getattr(pay, 'Billpay_method', None),
                        "CardType": getattr(pay, 'CardType', None),
                        "BankName": getattr(pay, 'BankName', None),
                        "ChequeNo": getattr(pay, 'ChequeNo', None),
                        "PaidAmount": getattr(pay, 'paidamount', None),
                        "AdditionalAmount": getattr(pay, 'Additionalamount', None),
                        "TransactionFee": getattr(pay, 'transactionFee', None),
                    }
                    for pay in payments
                ]
            })
            S_no += 1
 
        return JsonResponse(datafetch, safe=False, status=200)
 
    except Exception as e:
        print("Error in fetch_op_pharmacy_billing_for_Acceptance:", str(e))
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from datetime import datetime
from num2words import num2words
from .models import OPPharmacyBillingRefundReceipt, OP_Pharmacy_Payment_Refund_Table_Detials, OPPharmacyBillingReceipt, Patient_IP_Registration_Detials
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['GET'])
def fetch_op_pharmacy_refund_billing_for_Acceptance(request):
    try:
        # ---------------------
        # Filters
        # ---------------------
        pharma = request.GET.get("pharma")
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_status = request.GET.get("SearchStatus")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        location_id = request.GET.get("location")

        # ---------------------
        # Base queryset
        # ---------------------
        bills = OPPharmacyBillingRefundReceipt.objects.filter(IsRefunded=False)

        if pharma == '3':
            bills = OPPharmacyBillingRefundReceipt.objects.filter(
                IsRefunded=False
            ).order_by('-CreatedAt')

        filters = Q()

        # ---------------------
        # Date filter
        # ---------------------
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date=dt)
            except ValueError:
                logger.warning(f"Invalid current_date format: {current_date}")
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date__range=(dt_from, dt_to))
            except ValueError:
                logger.warning(f"Invalid date range: from {from_date} to {to_date}")
                pass

        # Patient name filter
        if search_first_name:
            filters &= Q(Patient_Name__icontains=search_first_name)

        # Doctor/Speciality filter via Invoice -> OPPharmacyBillingReceipt
        if search_doctor:
            filters &= Q(Invoice_NO__Doctor_Id__Doctor_Name__icontains=search_doctor)
        if search_speciality:
            filters &= Q(Invoice_NO__Doctor_Id__Speciality__icontains=search_speciality)

        # Status filter
        if search_status:
            status_map = {"Refunded": "RefundPayment"}
            filters &= Q(NewPayment__icontains=status_map.get('Refunded', 'Refunded'))

        # Location filter (commented out as in original code, but retained for compatibility)
        # if location_id:
        #     filters &= Q(Invoice_NO__Location__Location_Id=location_id)

        # ---------------------
        # Apply filters & order
        # ---------------------
        bills = bills.filter(filters)
        # bills = bills.order_by('-CreatedAt' if search_time_order != 'asc' else 'CreatedAt')

        # ---------------------
        # Build JSON response
        # ---------------------
        datafetch = []
        for idx, bill in enumerate(bills, start=1):
            invoice = bill.Invoice_NO
            payments = bill.Pharmacy_Receipt_No_Payments_Refund.all() if invoice else []
            registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()

            # Refund items from JSONField
            refund_items = bill.Remaining_Items or []

            datafetch.append({
                "S_No": idx,
                "id": bill.Voucher_Number,
                "Billing_Date": bill.Billing_Date,
                "Bill_Status": bill.NewPayment,
                "PatientId": bill.PatientID,
                "Patient_Name": bill.Patient_Name,
                "PhoneNo": bill.PhoneNumber,
                "PatientCategory": registration.PatientCategory if registration else "",
                "Doctor_Name": (
                    f"Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}"
                    if registration and registration.PrimaryDoctor else ""
                ),
                "amount_in_words": num2words(float(bill.TotalAmount)),
                "TotalAmount": float(bill.TotalAmount),
                "PaidAmount": float(bill.PaidAmount),
                "BalanceAmount": float(bill.BalanceAmount),
                "BilledBy": bill.Billedby,
                "Status": bill.NewPayment,
                # Refund payments
                "Payments": [
                    {
                        "Payment_Type": pay.Payment_Type,
                        "CardType": pay.Cart_Type,
                        "BankName": pay.Bank_Name,
                        "ChequeNo": pay.Cheque_No,
                        "Transaction_Amount": float(pay.Transaction_Amount),
                        "AdditionalAmount": float(pay.AdditionalAmount),
                        "Amount": float(pay.Amount),
                    }
                    for pay in payments
                ],
                # Refund items from JSONField
                "Items": [
                    {
                        "ItemName": item.get("ItemName", ""),
                        "BatchNo": item.get("BatchNo", ""),
                        "ExpDate": item.get("Exp_Date", ""),
                        "Quantity": item.get("Refund_Quantity", 0),
                        "UnitPrice": float(item.get("Unit_Price", 0)),
                        "Total": float(item.get("Total", 0)),
                    }
                    for item in refund_items
                ]
            })

        return JsonResponse({"op_pharmacy_refund_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error in fetch_op_pharmacy_refund_billing_for_Acceptance: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def fetch_op_pharmacy_refund_billing_for_after_Acceptance(request):
    try:
        # ---------------------
        # Filters
        # ---------------------
        pharma = request.GET.get("pharma")
        date_type = request.GET.get("DateType")
        current_date = request.GET.get("CurrentDate")
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        search_first_name = request.GET.get("SearchbyFirstName")
        search_doctor = request.GET.get("SearchbyDoctor")
        search_speciality = request.GET.get("SearchbySpeciality")
        search_status = request.GET.get("SearchStatus")
        search_time_order = request.GET.get("SearchTimeOrderby")  # 'asc' or 'desc'
        location_id = request.GET.get("location")

        # ---------------------
        # Base queryset
        # ---------------------
        bills = OPPharmacyBillingRefundReceipt.objects.filter(IsRefunded=True)

        if pharma == '3':
            bills = OPPharmacyBillingRefundReceipt.objects.filter(
                IsRefunded=True
            ).order_by('-CreatedAt')

        filters = Q()

        # ---------------------
        # Date filter
        # ---------------------
        if date_type == 'Current' and current_date:
            try:
                dt = datetime.strptime(current_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date=dt)
            except ValueError:
                logger.warning(f"Invalid current_date format: {current_date}")
                pass
        elif from_date and to_date:
            try:
                dt_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                dt_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                filters &= Q(CreatedAt__date__range=(dt_from, dt_to))
            except ValueError:
                logger.warning(f"Invalid date range: from {from_date} to {to_date}")
                pass

        # Patient name filter
        if search_first_name:
            filters &= Q(Patient_Name__icontains=search_first_name)

        # Doctor/Speciality filter via Invoice -> OPPharmacyBillingReceipt
        if search_doctor:
            filters &= Q(Invoice_NO__Doctor_Id__Doctor_Name__icontains=search_doctor)
        if search_speciality:
            filters &= Q(Invoice_NO__Doctor_Id__Speciality__icontains=search_speciality)

        # Status filter
        if search_status:
            status_map = {"Refunded": "RefundPayment"}
            filters &= Q(NewPayment__icontains=status_map.get(search_status, search_status))

        # Location filter (commented out as in original code, but retained for compatibility)
        # if location_id:
        #     filters &= Q(Invoice_NO__Location__Location_Id=location_id)

        # ---------------------
        # Apply filters & order
        # ---------------------
        bills = bills.filter(filters)
        bills = bills.order_by('-CreatedAt' if search_time_order != 'asc' else 'CreatedAt')

        # ---------------------
        # Build JSON response
        # ---------------------
        datafetch = []
        for idx, bill in enumerate(bills, start=1):
            invoice = bill.Invoice_NO
            payments = bill.Pharmacy_Receipt_No_Payments_Refund.all() if invoice else []
            registration = Patient_IP_Registration_Detials.objects.filter(PatientId=bill.PatientID).first()

            # Refund items from JSONField
            refund_items = bill.Remaining_Items or []

            datafetch.append({
                "S_No": idx,
                "id": bill.Voucher_Number,
                "Billing_Date": bill.Billing_Date,
                "Bill_Status": bill.NewPayment,
                "PatientId": bill.PatientID,
                "Patient_Name": bill.Patient_Name,
                "PhoneNo": bill.PhoneNumber,
                "PatientCategory": registration.PatientCategory if registration else "",
                "Doctor_Name": (
                    f"Dr. {registration.PrimaryDoctor.First_Name} {registration.PrimaryDoctor.Middle_Name} {registration.PrimaryDoctor.Last_Name}"
                    if registration and registration.PrimaryDoctor else ""
                ),
                "amount_in_words": num2words(float(bill.TotalAmount)),
                "TotalAmount": float(bill.TotalAmount),
                "PaidAmount": float(bill.PaidAmount),
                "BalanceAmount": float(bill.BalanceAmount),
                "BilledBy": bill.Billedby,
                "Status": bill.NewPayment,
                # Refund payments
                "Payments": [
                    {
                        "Payment_Type": pay.Payment_Type,
                        "CardType": pay.Cart_Type,
                        "BankName": pay.Bank_Name,
                        "ChequeNo": pay.Cheque_No,
                        "Transaction_Amount": float(pay.Transaction_Amount),
                        "AdditionalAmount": float(pay.AdditionalAmount),
                        "Amount": float(pay.Amount),
                    }
                    for pay in payments
                ],
                # Refund items from JSONField
                "Items": [
                    {
                        "ItemName": item.get("ItemName", ""),
                        "BatchNo": item.get("BatchNo", ""),
                        "ExpDate": item.get("Exp_Date", ""),
                        "Quantity": item.get("Refund_Quantity", 0),
                        "UnitPrice": float(item.get("Unit_Price", 0)),
                        "Total": float(item.get("Total", 0)),
                    }
                    for item in refund_items
                ]
            })

        return JsonResponse({"op_pharmacy_refund_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error in fetch_op_pharmacy_refund_billing_for_Acceptance: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

 