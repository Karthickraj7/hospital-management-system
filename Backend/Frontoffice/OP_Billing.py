import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from Masters.models import *
from Inventory.models import *
from decimal import Decimal, InvalidOperation
from .models import Patient_Appointment_Registration_Detials
from django.shortcuts import render
from .models import Service_Master_Details, Service_Procedure_Charges
from django.db.models import Sum, Q
from OutPatient.models import *
from django.db import connection, transaction
from .models import Patient_Appointment_Registration_Detials, Patient_Detials
from django.core.serializers import serialize
from Workbench.models import *


@csrf_exempt
def op_pharmacy_queue_list_prescrib(request):
    try:        
        # Filter drug requests based on location if applicable
        drug_requests = OPD_Prescription_Details.objects.filter(Status=True)
        
        datafetch = []
        processed_patients = set()  # Set to store processed patient IDs
        record_id = 1
        
        for drug_request in drug_requests:
            registration_id = drug_request.Registration_Id
            if not registration_id:
                continue

            try:
                # Fetch patient data based on registration ID
                patient_data = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id.Registration_Id).first()
                
                if not patient_data:
                    continue  # Skip if patient data is not found

                # Fetch personal details
                personal_data = Patient_Detials.objects.filter(PatientId=patient_data.PatientId.PatientId).first()
                
                if not personal_data or personal_data.PatientId in processed_patients:
                    continue  # Skip if personal data is not found or patient already processed

                processed_patients.add(personal_data.PatientId)  # Add to processed list
                
                # Handle possible None values in name fields and format the name
                patient_name = f"""{personal_data.Title.Title_Name or ''}{"."}{personal_data.FirstName or ''} {personal_data.MiddleName or ''} {personal_data.SurName or ''}""".strip()

                # Build the response data for this patient
                doctor = drug_request.Registration_Id.PrimaryDoctor if drug_request.Registration_Id.PrimaryDoctor else None
                doctor_name = f"""{doctor.Tittle.Title_Name or 'Dr'} {"."}{doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}""".strip() if doctor else None

                datafetch.append({
                    'id': record_id,
                    'VisitID': registration_id.VisitId,
                    'Booking_Id': registration_id.Registration_Id,  # Ensure this is a serializable ID
                    'PatientName': patient_name,
                    'PatientId': personal_data.PatientId,  # Assuming this is a serializable ID
                    'PatientPhoneNo': personal_data.PhoneNo,
                    'Doctorid': doctor.Doctor_ID if doctor else None,
                    'DoctorName': doctor_name
                })
                
                # Increment record_id after appending the data
                record_id += 1

            except ObjectDoesNotExist as e:
                print(f"Error fetching data for registration_id {registration_id}: {str(e)}")
                continue

        return JsonResponse(datafetch, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500)
    


# @csrf_exempt
# def get_prescription(request):
#     try:
#         # Retrieve PatientID, VisitID, and Department from the request
#         PatientID = request.GET.get('PatientID')
#         VisitID = request.GET.get('VisitID')
#         Department = request.GET.get('Department')

#         # Validate required parameters
#         if not PatientID:
#             return JsonResponse({"warn": "PatientID is required"})
#         if not VisitID:
#             return JsonResponse({"warn": "VisitID is required"})
#         if not Department:
#             return JsonResponse({"warn": "Department is required"})

#         # Fetch patient details to get the Patient Name
#         try:
#             patient = Patient_Detials.objects.get(PatientId=PatientID)
#         except ObjectDoesNotExist:
#             return JsonResponse({"error": "Patient not found"})

#         PatientName = f"{patient.Title.Title_Name}. {patient.FirstName} {patient.MiddleName} {patient.SurName}"

#         # Fetch registration details
#         try:
#             registration = Patient_Appointment_Registration_Detials.objects.get(
#                 PatientId_id=PatientID, VisitId=VisitID
#             )
#         except ObjectDoesNotExist:
#             return JsonResponse({"error": "Registration not found for the given PatientID and VisitID"})

#         print("Registration ID for Filtering:", registration.Registration_Id)

#         # Query the prescriptions related to the Registration ID
#         prescriptions = OPD_Prescription_Details.objects.filter(
#             Registration_Id=registration
#         )

#         if not prescriptions.exists():
#             return JsonResponse({"message": "No prescriptions found"})

#         # Prepare the list of prescriptions
#         prescription_list = []
#         added_items = set()  # To track unique ItemIds

#         for prescription in prescriptions:
#             try:
#                 # Fetch location details
#                 location = Location_Detials.objects.get(Location_Id=registration.Location_id)
#                 location_name = location.Location_Name
#             except ObjectDoesNotExist:
#                 location_name = "N/A"

#             # Get doctor details
#             doctor = prescription.Registration_Id.PrimaryDoctor
#             doctor_name = (
#                 f"{doctor.Tittle.Title_Name or 'Dr.'}. {doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}".strip()
#                 if doctor else "N/A"
#             )
#             doctor_id = doctor.Doctor_ID if doctor else "N/A"

#             item_id = prescription.ItemId.pk if prescription.ItemId else None

#             # Check if the item is already added
#             if item_id in added_items:
#                 continue  # Skip duplicates

#             # Add item to the tracking set
#             added_items.add(item_id)
#             index = 1
#             prescription_dict = {
#                 "S_No":index,
#                 "PrescriptionID": prescription.Prescription_Id,
#                 "PatientID": PatientID,
#                 "VisitID": registration.VisitId,
#                 "AppointmentDate": registration.created_at.date().isoformat(),
#                 "DoctorId": doctor_id,
#                 "DoctorName": doctor_name,
#                 "GenericName": prescription.ItemId.GenericName.GenericName if prescription.ItemId else "N/A",
#                 "ItemName": prescription.ItemId.ItemName if prescription.ItemId else "N/A",
#                 "ItemId": item_id,
#                 "Dose": prescription.Dosage,
#                 "Route": prescription.Route,
#                 "Frequency": prescription.Frequency,
#                 "Duration": f"{prescription.DurationNumber} {prescription.DurationUnit}",
#                 "Billing_Quantity": prescription.Qty,
#                 "Instruction": prescription.Instruction,
#                 "Status": registration.Status,
#                 "LoggedBy": prescription.created_by,
#                 "Location": location_name,
#                 "CreatedAt": prescription.created_at.date().isoformat(),
#                 "Patient_Name": PatientName,
#             }

#             prescription_list.append(prescription_dict)
#             index += 1  

#         return JsonResponse(prescription_list, safe=False)

#     except Exception as e:
#         print('Error:', str(e))
#         return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)

from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def get_prescription_op(request):
    try:
        # Retrieve PatientID, VisitID, and Department from the request
        PatientID = request.GET.get('PatientID')
        VisitID = request.GET.get('VisitID')
        Department = request.GET.get('Department')

        # Validate required parameters
        if not PatientID:
            return JsonResponse({"warn": "PatientID is required"})
        if not VisitID:
            return JsonResponse({"warn": "VisitID is required"})
        if not Department:
            return JsonResponse({"warn": "Department is required"})

        # Fetch patient details to get the Patient Name
        try:
            patient = Patient_Detials.objects.get(PatientId=PatientID)
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Patient not found"})

        PatientName = f"{patient.Title.Title_Name}. {patient.FirstName} {patient.MiddleName} {patient.SurName}"

        # Fetch registration details, selecting the latest one if multiple exist
        registrations = Patient_Appointment_Registration_Detials.objects.filter(
            PatientId_id=PatientID, VisitId=VisitID
        ).order_by('-created_at')  # Sorting by latest registration

        if not registrations.exists():
            return JsonResponse({"error": "Registration not found for the given PatientID and VisitID"})

        registration = registrations.first()  # Pick the latest registration

        print("Registration ID for Filtering:", registration.Registration_Id)

        # Query the prescriptions related to the Registration ID
        prescriptions = OPD_Prescription_Details.objects.filter(
            Registration_Id=registration
        )

        if not prescriptions.exists():
            return JsonResponse({"message": "No prescriptions found"})

        # Prepare the list of prescriptions
        prescription_list = []
        added_items = set()  # To track unique ItemIds
        index = 1

        for prescription in prescriptions:
            try:
                # Fetch location details
                location = Location_Detials.objects.get(Location_Id=registration.Location_id)
                location_name = location.Location_Name
            except ObjectDoesNotExist:
                location_name = "N/A"

            doccc_inss = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id = prescription.Registration_Id.Registration_Id).first()
            # Get doctor details
            doctor = doccc_inss.PrimaryDoctor
            doctor_name = (
                f"{doctor.Tittle.Title_Name or 'Dr.'}. {doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}".strip()
                if doctor else "N/A"
            )
            doctor_id = doctor.Doctor_ID if doctor else "N/A"

            item_id = prescription.ItemId.pk if prescription.ItemId else None

            # Check if the item is already added
            if item_id in added_items:
                continue  # Skip duplicates

            # Add item to the tracking set
            added_items.add(item_id)

            prescription_dict = {
                "S_No": index,
                "PrescriptionID": prescription.Prescription_Id,
                "PatientID": PatientID,
                "VisitID": registration.VisitId,
                "AppointmentDate": registration.created_at.date().isoformat(),
                "DoctorId": doctor_id,
                "DoctorName": doctor_name,
                "GenericName": prescription.ItemId.GenericName.GenericName if prescription.ItemId else "N/A",
                "ItemName": prescription.ItemId.ItemName if prescription.ItemId else "N/A",
                "ItemId": item_id,
                "Dose": prescription.Dosage,
                "Route": prescription.Route,
                "Frequency": prescription.Frequency,
                "Duration": f"{prescription.DurationNumber} {prescription.DurationUnit}",
                "Billing_Quantity": prescription.Qty,
                "Instruction": prescription.Instruction,
                "Status": registration.Status,
                "LoggedBy": prescription.created_by,
                "Location": location_name,
                "CreatedAt": prescription.created_at.date().isoformat(),
                "Patient_Name": PatientName,
            }

            prescription_list.append(prescription_dict)
            index += 1  

        return JsonResponse(prescription_list, safe=False)

    except Exception as e:
        print('Error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)


@csrf_exempt
def get_patient_personal_info(request):
    try:
        PatientId = request.GET.get('PatientId')
        print("PatientId:", PatientId)

        if not PatientId:
            return JsonResponse({'warn': 'PatientId is required'})

        # Fetch patient details from the latest appointment record
        patient_Details = Patient_Appointment_Registration_Detials.objects.filter(
            PatientId__PatientId=PatientId
        ).order_by('-created_at').first()

        if not patient_Details or not patient_Details.PatientId:
            return JsonResponse({'error': 'Patient not found'})

        patient = patient_Details.PatientId  # Get the patient details
        patienttype = patient_Details.PatientCategory if patient_Details.PatientCategory else None
        # Determine the apatient_Detailsddress
        if patient.PermanentAddressSameAsAbove == 'Yes':
            address_parts = [
                f"No.{patient.PermanentdoorNo}" if patient.PermanentdoorNo else "",
                patient.PermanentStreet,
                patient.PermanentArea,
                f"{patient.PermanentCity}-{patient.PermanentPincode}" if patient.PermanentCity and patient.PermanentPincode else "",
                patient.PermanentDistrict,
                patient.PermanentState,
            ]
        else:
            address_parts = [
                f"No.{patient.DoorNo}" if patient.DoorNo else "",
                patient.Street,
                patient.Area,
                f"{patient.City}-{patient.Pincode}" if patient.City and patient.Pincode else "",
                patient.District,
                patient.State,
            ]
        address = ", ".join(filter(None, address_parts))
        # Check if doctor details exist
        doccc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id=patient_Details.Registration_Id).first()
        doctor = doccc_ins.PrimaryDoctor
        doc_pro = Doctor_ProfessForm_Detials.objects.get(Doctor_ID__Doctor_ID = doctor.Doctor_ID)
        doctor_name = (
            f"{doctor.Tittle.Title_Name or 'Dr'}. {doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name} ({doc_pro.Qualification})".strip()
            if doctor else "N/A"
        )
        doctor_id = doctor.Doctor_ID if doctor else None

        # Construct response dictionary
        patient_dict = {
            'PatientId': patient.PatientId,
            'RegistrationId': patient_Details.Registration_Id,
            'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}",
            'Gender': patient.Gender,
            'PatientAge': f"{patient.Age} / {patient.Gender}", 
            'PhoneNo': patient.PhoneNo,
            'PatientType': patient.PatientType if patient.PatientType else None,
            'PatientAddress': address,
            'Doctor_name': doctor_name,
            'Doctor_Id': doctor_id,
            'PatientType':patienttype,
        }

        return JsonResponse(patient_dict, safe=False)

    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error Occurred: ' + str(e)}, status=500)
    
# @csrf_exempt
# def get_IP_patient_personal_info(request):
#     try:
#         PatientId = request.GET.get('PatientId')
#         print("PatientId:", PatientId)

#         if not PatientId:
#             return JsonResponse({'warn': 'PatientId is required'})

#         # Fetch patient details from the latest appointment record
#         patient_Details = Patient_IP_Registration_Detials.objects.filter(
#             PatientId__PatientId=PatientId
#         ).order_by('-created_at').first()

#         if not patient_Details or not patient_Details.PatientId:
#             return JsonResponse({'error': 'Patient not found'})

#         patient = patient_Details.PatientId  # Get the patient details
#         patienttype = patient_Details.PatientCategory if patient_Details.PatientCategory else None
#         # Determine the apatient_Detailsddress
#         if patient.PermanentAddressSameAsAbove == 'Yes':
#             address_parts = [
#                 f"No.{patient.PermanentdoorNo}" if patient.PermanentdoorNo else "",
#                 patient.PermanentStreet,
#                 patient.PermanentArea,
#                 f"{patient.PermanentCity}-{patient.PermanentPincode}" if patient.PermanentCity and patient.PermanentPincode else "",
#                 patient.PermanentDistrict,
#                 patient.PermanentState,
#             ]
#         else:
#             address_parts = [
#                 f"No.{patient.DoorNo}" if patient.DoorNo else "",
#                 patient.Street,
#                 patient.Area,
#                 f"{patient.City}-{patient.Pincode}" if patient.City and patient.Pincode else "",
#                 patient.District,
#                 patient.State,
#             ]
#         address = ", ".join(filter(None, address_parts))
#         # Check if doctor details exist
#         doctor = patient_Details.PrimaryDoctor
#         doctor_name = (
#             f"{doctor.Tittle.Title_Name or 'Dr'}. {doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name}".strip()
#             if doctor else "N/A"
#         )
#         doctor_id = doctor.Doctor_ID if doctor else None

#         # Construct response dictionary
#         patient_dict = {
#             'PatientId': patient.PatientId,
#             'RegistrationId': patient_Details.Registration_Id,
#             'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}",
#             'Gender': patient.Gender,
#             'PatientAge': f"{patient.Age} / {patient.Gender}", 
#             'PhoneNo': patient.PhoneNo,
#             'PatientType': patient.PatientType if patient.PatientType else None,
#             'PatientAddress': address,
#             'Doctor_name': doctor_name,
#             'Doctor_Id': doctor_id,
#             'PatientType':patienttype,
#         }

#         return JsonResponse(patient_dict, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': 'Internal Server Error Occurred: ' + str(e)}, status=500)

@csrf_exempt
def get_IP_patient_personal_info(request):
    try:
        PatientId = request.GET.get('PatientId')
        print("PatientId:", PatientId)

        if not PatientId:
            return JsonResponse({'warn': 'PatientId is required'})

        # 1️⃣ First try to get details from IP Registration Table
        patient_IP = Patient_IP_Registration_Detials.objects.filter(
            PatientId__PatientId=PatientId
        ).order_by('-created_at').first()

        if patient_IP and patient_IP.PatientId:
            patient = patient_IP.PatientId
            patienttype = patient_IP.PatientCategory if patient_IP.PatientCategory else None
            doctor = patient_IP.PrimaryDoctor
            doctor_name = (
                f"{doctor.Tittle.Title_Name or 'Dr'}. {doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name}".strip()
                if doctor else "N/A"
            )
            doctor_id = doctor.Doctor_ID if doctor else None

        else:
            # 2️⃣ If not found → directly fetch from Patient_Detials table
            patient = Patient_Detials.objects.filter(PatientId=PatientId).first()

            if not patient:
                return JsonResponse({'error': 'Patient not found'})

            patienttype = patient.PatientType
            doctor = patient.DoctorID
            doctor_name = (
                f"{doctor.Tittle.Title_Name or 'Dr'}. {doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name}".strip()
                if doctor else "N/A"
            )
            doctor_id = doctor.Doctor_ID if doctor else None

        # ---------------- Address Logic ---------------- #

        if patient.PermanentAddressSameAsAbove == 'Yes':
            address_parts = [
                f"No.{patient.PermanentdoorNo}" if patient.PermanentdoorNo else "",
                patient.PermanentStreet,
                patient.PermanentArea,
                f"{patient.PermanentCity}-{patient.PermanentPincode}" if patient.PermanentCity and patient.PermanentPincode else "",
                patient.PermanentDistrict,
                patient.PermanentState,
            ]
        else:
            address_parts = [
                f"No.{patient.DoorNo}" if patient.DoorNo else "",
                patient.Street,
                patient.Area,
                f"{patient.City}-{patient.Pincode}" if patient.City and patient.Pincode else "",
                patient.District,
                patient.State,
            ]

        address = ", ".join(filter(None, address_parts))

        # Final Output
        patient_dict = {
            'PatientId': patient.PatientId,
            'RegistrationId': patient_IP.Registration_Id if patient_IP else None,
            'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}",
            'Gender': patient.Gender,
            'PatientAge': f"{patient.Age} / {patient.Gender}",
            'PhoneNo': patient.PhoneNo,
            'PatientType': patienttype,
            'PatientAddress': address,
            'Doctor_name': doctor_name,
            'Doctor_Id': doctor_id,
        }

        return JsonResponse(patient_dict, safe=False)

    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error Occurred: ' + str(e)}, status=500)

# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Item_Names_All_Data_Link(request):
#     try:
#         SearchItemName = request.GET.get('SearchItemName')
#         SearchItemCode = request.GET.get('SearchItemCode')
#         Department = request.GET.get('Department')
 
#         if not Department:
#             return JsonResponse({'warn': 'Department is required'}, status=400)
 
#         # Get product IDs in stock for the given department
#         stock_items = set(
#             Stock_Maintance_Table_Detials.objects.filter(
#                 Store_location__Store_Type='PHARMACY',
#                 Store_location__IsPointOfSale=1
#             ).values_list('Product_Detials__pk', flat=True)
#         )
 
#         # If both SearchItemName and SearchItemCode are provided
#         if SearchItemName and SearchItemCode:
#             try:
#                 product_qs = Product_Master_All_Category_Details.objects.filter(
#                     pk=int(SearchItemCode), ItemName=SearchItemName, IsSellable=True
#                 ).prefetch_related('DrugSegment', 'GenericName')
 
#                 if not product_qs.exists():
#                     return JsonResponse({'warn': 'Item not found or not sellable'}, status=404)
 
#                 Product_Master_Ins = product_qs.first()
#                 drug_segments = list(Product_Master_Ins.DrugSegment.values_list('Segment', flat=True))
 
#                 response_data = {
#                     'ItemCode': Product_Master_Ins.pk,
#                     'ItemName': Product_Master_Ins.ItemName,
#                     'GenericName': Product_Master_Ins.GenericName.GenericName if Product_Master_Ins.GenericName else None,
#                     'HSNCode': Product_Master_Ins.HSNCode,
#                     'Drugsegment': drug_segments,
#                     'AlreadyInStock': Product_Master_Ins.pk in stock_items
#                 }
#                 return JsonResponse(response_data)
#             except (ValueError, ObjectDoesNotExist):
#                 return JsonResponse({'error': 'Invalid Item Code'}, status=400)
 
#         # If only SearchItemName is provided
#         elif SearchItemName:
#             product_qs = Product_Master_All_Category_Details.objects.filter(
#                 ItemName__icontains=SearchItemName, IsSellable=True
#             ).prefetch_related('DrugSegment')
 
#             data = [
#                 {
#                     'ItemCode': row.pk,
#                     'ItemName': row.ItemName,
#                     'Drugsegment': list(row.DrugSegment.values_list('Segment', flat=True)),
#                     'AlreadyInStock': row.pk in stock_items
#                 }
#                 for row in product_qs
#             ]
 
#             return JsonResponse(data, safe=False)
 
#         return JsonResponse({'warn': 'Invalid search parameters'}, status=400)
 
#     except Exception as e:
#         print("Exception:", e)
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Item_Names_All_Data_Link(request):
#     try:
#         SearchItemName = request.GET.get('SearchItemName').strip()
#         SearchItemCode = request.GET.get('SearchItemCode')
#         SearchItemBatch = request.GET.get('SearchItemBatch')
#         Department = request.GET.get("Department")

#         # --- Department Handling ---
#         try:
#             if Department is not None:
#                 Department = int(Department)  # convert string to int
#                 if Department == 1:
#                     Department += 2
#             else:
#                 Department=4        
#         except ValueError:
#             return JsonResponse({'error': 'Invalid Department value'}, status=400)

#         print("dept", Department)

#         # --- Stock Items IDs ---
#         stock_items = list(
#             Stock_Maintance_Table_Detials.objects.filter(
#                 Store_location__Store_Type='PHARMACY',
#                 Store_location__Store_Id=Department
                
#             ).exclude(AvailableQuantity=0,Expiry_Date__isnull=True)
#             .values_list('Product_Detials__pk', flat=True)
#             .distinct()
#         )


#         print("Items------1",SearchItemName,SearchItemCode)
#         # --- Case 1: Both ItemName & ItemCode provided ---
#         if SearchItemName and SearchItemCode :
#             product_qs = Product_Master_All_Category_Details.objects.filter(
#                 pk=SearchItemCode, ItemName=SearchItemName, IsSellable=True,Status=True
#             )
           
#             if not product_qs.exists():
#                 return JsonResponse({'warn': 'Item not found or not sellable'})

#             Product_Master_Ins = product_qs.first()

#             dis = {
#                 'ItemCode': Product_Master_Ins.pk,
#                 'ItemName': Product_Master_Ins.ItemName,
#                 'GenericName': Product_Master_Ins.GenericName.GenericName if Product_Master_Ins.GenericName else None,
#                 'HSNCode': Product_Master_Ins.HSNCode or None,
#                 'AlreadyInStock': Product_Master_Ins.pk in stock_items
#             }
#             return JsonResponse(dis, safe=False)

#         # --- Case 2: Only ItemName provided ---
#         elif SearchItemName:
#             print("Here-------")

#             Product_Master_Ins = Product_Master_All_Category_Details.objects.filter(
#                 ItemName__istartswith=SearchItemName, IsSellable=True,Status=True
#             )

#             print("uuuuuuuuuu", Product_Master_Ins)

#             data = []
#             for row in Product_Master_Ins:
#                 print("Item========", row.ItemName)

#                 stock_batches = Stock_Maintance_Table_Detials.objects.filter(
#                     Product_Detials=row,
#                     Store_location__Store_Type='PHARMACY',
#                     Store_location__Store_Id=Department,
#                     AvailableQuantity__gt=0  # ✅ only include batches with quantity > 0
#                 ).values(
#                     "Batch_No", "Expiry_Date", "AvailableQuantity", "Store_location"
#                 )

#                 print("-------------", stock_batches)
#                 if not stock_batches:
#                     continue

#                 dis = {
#                     'ItemCode': row.pk,
#                     'ItemName': row.ItemName,
#                     'AlreadyInStock': row.pk in stock_items,
#                     'BatchDetails': list(stock_batches)
#                 }
#                 data.append(dis)

#             return JsonResponse(data, safe=False)


#         # --- Invalid Parameters ---
#         return JsonResponse({'warn': 'Invalid search parameters'})

#     except Exception as e:
#         print("Exception:", e)
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

def short_company(name):
    if not name:
        return ""

    ignore = {"PRIVATE", "PVT", "LIMITED", "LTD", "LLP", "INC", "CORP", "COMPANY"}

    parts = name.upper().split()
    letters = [p[0] for p in parts if p not in ignore]

    return "".join(letters)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Names_All_Data_Link(request):
    try:
        SearchItemName = request.GET.get('SearchItemName', '').strip()
        SearchItemCode = request.GET.get('SearchItemCode')
        SearchItemBatch = request.GET.get('SearchItemBatch')
        Department = request.GET.get("Department")

        # --- Department Handling ---
        try:
            if Department is not None:
                Department = int(Department)
                if Department == 1:
                    Department += 2
            else:
                Department = 4
        except ValueError:
            return JsonResponse({'error': 'Invalid Department value'}, status=400)

        print("dept", Department)

        # --- Stock Items IDs ---
        stock_items = list(
            Stock_Maintance_Table_Detials.objects.filter(
                Store_location__Store_Type='PHARMACY',
                Store_location__Store_Id=Department
            )
            .exclude(AvailableQuantity=0, Expiry_Date__isnull=True)
            .values_list('Product_Detials__pk', flat=True)
            .distinct()
        )[:5]

        print("Items------1", SearchItemName, SearchItemCode)

        # --- Case 1: Both ItemName & ItemCode provided ---
        if SearchItemName and SearchItemCode:
            product_qs = Product_Master_All_Category_Details.objects.filter(
                pk=SearchItemCode,
                ItemName=SearchItemName,
                IsSellable=True,
                Status=True
            )

            if not product_qs.exists():
                return JsonResponse({'warn': 'Item not found or not sellable'})

            Product_Master_Ins = product_qs.first()

            dis = {
    'ItemCode': Product_Master_Ins.pk,
    'ItemName': Product_Master_Ins.ItemName,
    'GenericName': Product_Master_Ins.GenericName.GenericName if Product_Master_Ins.GenericName else None,
    'HSNCode': Product_Master_Ins.HSNCode or None,
    'AlreadyInStock': Product_Master_Ins.pk in stock_items,

    'CompanyName': (Product_Master_Ins.CompanyName.CompanyName)[:3] if Product_Master_Ins.CompanyName else '',
    'CompanyShort': (Product_Master_Ins.CompanyName.CompanyName)[:3] if Product_Master_Ins.CompanyName else '',
    # 'CompanyShort': short_company(Product_Master_Ins.CompanyName.CompanyName if Product_Master_Ins.CompanyName else ''),

    'CGST': float(Product_Master_Ins.CGST or 0),
    'SGST': float(Product_Master_Ins.SGST or 0),
    'GST_Type': Product_Master_Ins.GST_Type or "",
    'GST_Value': float(Product_Master_Ins.GST_Value or 0),
}


            return JsonResponse(dis, safe=False)

        # --- Case 2: Only ItemName provided ---
        elif SearchItemName:
            print("Here-------")

            Product_Master_Ins = Product_Master_All_Category_Details.objects.filter(
                ItemName__istartswith=SearchItemName,
                IsSellable=True,
                Status=True
            )

            print("uuuuuuuuuu", Product_Master_Ins)

            data = []
            for row in Product_Master_Ins:
                print("Item========", row.ItemName)

                stock_batches = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials=row,
                    Store_location__Store_Type='PHARMACY',
                    Store_location__Store_Id=Department,
                    AvailableQuantity__gt=0
                ).values("Batch_No", "Expiry_Date", "AvailableQuantity", "Store_location")[:5]

                if not stock_batches:
                    continue

                dis = {
                    'ItemCode': row.pk,
                    'ItemName': row.ItemName,
                    'AlreadyInStock': row.pk in stock_items,
                    'BatchDetails': list(stock_batches),

                    # ✅ Include GST fields even for list
                    'CGST': float(row.CGST or 0),
                    'SGST': float(row.SGST or 0),
                    'GST_Type': row.GST_Type or "",
                    'GST_Value': float(row.GST_Value or 0),
                }
                data.append(dis)

            return JsonResponse(data, safe=False)

        # --- Invalid Parameters ---
        return JsonResponse({'warn': 'Invalid search parameters'})

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Names_All_Data_Link_optical(request):
    try:
        SearchItemName = request.GET.get('SearchItemName', '').strip()
        SearchItemCode = request.GET.get('SearchItemCode')
        SearchItemBatch = request.GET.get('SearchItemBatch')
        Department = request.GET.get("Department")

        # --- Department Handling ---
        
       
        print("dept", Department)

        # --- Stock Items IDs ---
        stock_items = list(
            Stock_Maintance_Table_Detials.objects.filter(
                # Store_location__Store_Type='PHARMACY',
                Store_location__Store_Id=Department
            )
            .exclude(AvailableQuantity=0)
            .values_list('Product_Detials__pk', flat=True)
            .distinct()
        )[:5]

        print("Items------1", SearchItemName, SearchItemCode)

        # --- Case 1: Both ItemName & ItemCode provided ---
        if SearchItemName and SearchItemCode:
            product_qs = Product_Master_All_Category_Details.objects.filter(
                pk=SearchItemCode,
                ItemName=SearchItemName,
               
                Is_Optical=True
            )

            if not product_qs.exists():
                return JsonResponse({'warn': 'Item not found or not sellable'})

            Product_Master_Ins = product_qs.first()

            dis = {
    'ItemCode': Product_Master_Ins.pk,
    'ItemName': Product_Master_Ins.ItemName,
    'GenericName': Product_Master_Ins.GenericName.GenericName if Product_Master_Ins.GenericName else None,
    'HSNCode': Product_Master_Ins.HSNCode or None,
    'AlreadyInStock': Product_Master_Ins.pk in stock_items,

    'CompanyName': Product_Master_Ins.CompanyName.CompanyName if Product_Master_Ins.CompanyName else '',
    'CompanyShort': Product_Master_Ins.CompanyName.CompanyName if Product_Master_Ins.CompanyName else '',
    # 'CompanyShort': short_company(Product_Master_Ins.CompanyName.CompanyName if Product_Master_Ins.CompanyName else ''),

    'CGST': float(Product_Master_Ins.CGST or 0),
    'SGST': float(Product_Master_Ins.SGST or 0),
    'GST_Type': Product_Master_Ins.GST_Type or "",
    'GST_Value': float(Product_Master_Ins.GST_Value or 0),
}


            return JsonResponse(dis, safe=False)

        # --- Case 2: Only ItemName provided ---
        elif SearchItemName:
            print("Here-------")

            Product_Master_Ins = Product_Master_All_Category_Details.objects.filter(
                ItemName__istartswith=SearchItemName,
                # IsSellable=True,
                Is_Optical=True,
                Status=True
            )

            print("uuuuuuuuuu", Product_Master_Ins)

            data = []
            for row in Product_Master_Ins:
                print("Item========", row.ItemName)

                stock_batches = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials=row,
                    # Store_location__Store_Type='PHARMACY',
                    Store_location__Store_Id=Department,
                    AvailableQuantity__gt=0
                ).values("Batch_No", "Expiry_Date", "AvailableQuantity", "Store_location")[:5]

                if not stock_batches:
                    continue

                dis = {
                    'ItemCode': row.pk,
                    'ItemName': row.ItemName,
                    'AlreadyInStock': row.pk in stock_items,
                    'BatchDetails': list(stock_batches),

                    # ✅ Include GST fields even for list
                    'CGST': float(row.CGST or 0),
                    'SGST': float(row.SGST or 0),
                    'GST_Type': row.GST_Type or "",
                    'GST_Value': float(row.GST_Value or 0),
                }
                data.append(dis)

            return JsonResponse(data, safe=False)

        # --- Invalid Parameters ---
        return JsonResponse({'warn': 'Invalid search parameters'})

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)






@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Names_All_Data_Link_refund(request):
    try:
        SearchItemName = request.GET.get('SearchItemName').strip()
        SearchItemCode = request.GET.get('SearchItemCode')
        SearchItemBatch = request.GET.get('SearchItemBatch')
        Department = request.GET.get("Department")

        # --- Department Handling ---
        try:
            if Department is not None:
                Department = int(Department)  # convert string to int
                if Department == 1:
                    Department += 2
            else:
                Department=4        
        except ValueError:
            return JsonResponse({'error': 'Invalid Department value'}, status=400)

        print("dept", Department)

        # --- Stock Items IDs ---
        stock_items = list(
            Stock_Maintance_Table_Detials.objects.filter(
                Store_location__Store_Type='PHARMACY',
                Store_location__Store_Id=Department
            ).exclude(AvailableQuantity=0,Expiry_Date=None)
            .values_list('Product_Detials__pk', flat=True)
            .distinct()
        )

        print("Items------1",SearchItemName,SearchItemCode)
        # --- Case 1: Both ItemName & ItemCode provided ---
        if SearchItemName and SearchItemCode :
            product_qs = Product_Master_All_Category_Details.objects.filter(
                pk=SearchItemCode, ItemName=SearchItemName, IsSellable=True
            )
           
            if not product_qs.exists():
                return JsonResponse({'warn': 'Item not found or not sellable'})

            Product_Master_Ins = product_qs.first()

            dis = {
                'ItemCode': Product_Master_Ins.pk,
                'ItemName': Product_Master_Ins.ItemName,
                'GenericName': Product_Master_Ins.GenericName.GenericName if Product_Master_Ins.GenericName else None,
                'HSNCode': Product_Master_Ins.HSNCode or None,
                'AlreadyInStock': Product_Master_Ins.pk in stock_items
            }
            return JsonResponse(dis, safe=False)

        # --- Case 2: Only ItemName provided ---
        elif SearchItemName:
            print("Here-------")
            Product_Master_Ins = Product_Master_All_Category_Details.objects.filter(
                ItemName__exact=SearchItemName, IsSellable=True
            )
            print("uuuuuuuuuu", Product_Master_Ins
                  
                  )

            data = []
            for row in Product_Master_Ins:
                print("Item========",row.ItemName)
                stock_batches = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials=row,
                    Store_location__Store_Type='PHARMACY',
                    Store_location__Store_Id=Department
                ).exclude(AvailableQuantity=0,Expiry_Date=None).values(
                    "Batch_No", "Expiry_Date", "AvailableQuantity","Store_location"
                )
                print("-------------",stock_batches)
                if not stock_batches:
                    continue
                dis = {
                    'ItemCode': row.pk,
                    'ItemName': row.ItemName,
                    'AlreadyInStock': row.pk in stock_items,
                    'BatchDetails': list(stock_batches)
                }
                data.append(dis)

            return JsonResponse(data, safe=False)

        # --- Invalid Parameters ---
        return JsonResponse({'warn': 'Invalid search parameters'})

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Item_Names_All_Data_Link(request):
#     try:
#         SearchItemName = request.GET.get('SearchItemName')
#         SearchItemCode = request.GET.get('SearchItemCode')
#         Department = request.GET.get('Department')

#         if not Department:
#             return JsonResponse({'warn': 'Department is required'})

#         # Step 1: Get all existing product IDs in stock for the given department
#         stock_items = Stock_Maintance_Table_Detials.objects.filter(
#             Store_location__Departments__Department_Id=Department
#         ).values_list('Product_Detials__pk', flat=True).distinct()

#         # Step 2: If both SearchItemName and SearchItemCode are provided
#         if SearchItemName and SearchItemCode:
#             product_qs = Product_Master_All_Category_Details.objects.filter(
#                 pk=SearchItemCode, ItemName=SearchItemName, IsSellable=True
#             )

#             if not product_qs.exists():
#                 return JsonResponse({'warn': 'Item not found or not sellable'})

#             Product_Master_Ins = product_qs.first()

#             dis = {
#                 'ItemCode': Product_Master_Ins.pk,
#                 'ItemName': Product_Master_Ins.ItemName,
#                 'GenericName': Product_Master_Ins.GenericName.GenericName if Product_Master_Ins.GenericName else None,
#                 'HSNCode': Product_Master_Ins.HSNCode,
#                 'AlreadyInStock': Product_Master_Ins.pk in stock_items  # Check if item is already in stock
#             }
#             return JsonResponse(dis, safe=False)

#         # Step 3: If only SearchItemName is provided
#         elif SearchItemName:
#             Product_Master_Ins = Product_Master_All_Category_Details.objects.filter(
#                 ItemName__icontains=SearchItemName, IsSellable=True
#             )

#             data = []
#             for row in Product_Master_Ins:
#                 dis = {
#                     'ItemCode': row.pk,
#                     'ItemName': row.ItemName,
#                     'AlreadyInStock': row.pk in stock_items  # Check if item is already in stock
#                 }
#                 data.append(dis)

#             return JsonResponse(data, safe=False)

#         return JsonResponse({'warn': 'Invalid search parameters'})

#     except Exception as e:
#         print("Exception:", e)
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def get_Shelf_Names_For_Product(request):
#     try:
#         ItemName = request.GET.get('SearchItemName')
#         ItemCode = request.GET.get('SearchItemCode')

#         print('ItemCode----', ItemCode)

#         if ItemCode:
#             try:
#                 Shelf_management_ins = Shelf_management_Details.objects.get(Product_Detials__pk=ItemCode)
                
#                 idata = {
#                     'Shelf_Name': Shelf_management_ins.Shelf_Name.Shelf_Name if Shelf_management_ins.Shelf_Name else '',
#                     'Rack_Name': Shelf_management_ins.Shelf_Name.Rack_Name.Rack_Name if Shelf_management_ins.Shelf_Name and Shelf_management_ins.Shelf_Name.Rack_Name else '',
#                 }
#                 return JsonResponse(idata)
            
#             except ObjectDoesNotExist:
#                 return JsonResponse({'error': 'No shelf found for the given product code'}, status=404)
        
#         # If ItemCode is not provided
#         return JsonResponse({'error': 'Product code is required'}, status=400)

#     except Exception as e:
#         # Log the exception and return a generic error message
#         print("Exception:", e)
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Batchno_Item_Names_All_Link(request):
#     try:
#         ItemName = request.GET.get('SearchItemName')
#         ItemCode = request.GET.get('SearchItemCode')
#         print("ItemCode----------",ItemCode)
#         Department = request.GET.get('Department')
#         print("Department------",Department)

#         if not Department:
#             return JsonResponse({'warn': 'Department is required'})

#         # Fetch the item from Product Master
#         try:
#             item_names = Product_Master_All_Category_Details.objects.get(pk=ItemCode, IsSellable=True)
#         except Product_Master_All_Category_Details.DoesNotExist:
#             return JsonResponse({'error': 'Item not found or not sellable'})


#         # Fetch stock details
#         stock_ins = Stock_Maintance_Table_Detials.objects.filter(
#             Product_Detials=item_names,
#             Store_location__Departments__Department_Id=Department
#         ).exclude(AvailableQuantity=0) \
#         .values('Batch_No', 'Expiry_Date', 'Sellable_qty_price') \
#         .annotate(Availability_qty=Sum('AvailableQuantity')) \
#         .order_by('Availability_qty')
#         print("stock_ins-----------",stock_ins)
#         data = []
#         id = 1

#         if stock_ins.exists():
#             for stock in stock_ins:
#                 idata = {
#                     'id': id,
#                     'Batch_No': stock['Batch_No'],
#                     'AvailableQuantity': stock['Availability_qty'] if stock['Availability_qty'] else 0,
#                     'MRP': stock.get('Sellable_qty_price', 0), 
#                     'Expiry_Date':stock.get('Expiry_Date',"")
#                 }
#                 id += 1
#                 data.append(idata)

#             return JsonResponse(data, safe=False)

#         return JsonResponse({'warn': 'No stock available'})

#     except Exception as e:
#         return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Batchno_Item_Names_All_Link(request):
    try:
        StoreId = request.GET.get('StoreId')
        ItemCode = request.GET.get('SearchItemCode')
        ItemName = request.GET.get('SearchItemName')
        ItemBatch = request.GET.get('SearchBatch')
 
        print("ItemCode:", type(ItemCode),ItemName)
       
 
       
        # Fetch the item from Product Master
        try:
            item_names = Product_Master_All_Category_Details.objects.get(ItemName=ItemName, IsSellable=True)
            print('item_nameee',item_names)
        except Exception as e:
            return JsonResponse({'error': f'Item not found or not sellable {str(e)}'})

        print("batch",ItemBatch)
        filt = Q()
        if ItemBatch and ItemBatch != "":
            filt &= Q(Batch_No = ItemBatch)

        # Fetch stock details and order by Expiry Date (nearest to longest)
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials=item_names,
            Store_location__Store_Type='PHARMACY',
            Store_location__IsPointOfSale=1,
            Store_location__Store_Id=StoreId,
            Expiry_Date__isnull=False
        ).filter(filt) \
        .values('Batch_No', 'Expiry_Date', 'Sellable_qty_price') \
        .annotate(Availability_qty=Sum('AvailableQuantity')) \
        .order_by('Expiry_Date')  # Sorting by expiry date in ascending order
 
        print("Stock data:", stock_ins)
 
        data = []
        id = 1
 
        if stock_ins.exists():
            for stock in stock_ins:
                idata = {
                    'id': id,
                    'Batch_No': stock.get('Batch_No', "N/A"),
                    'AvailableQuantity': stock.get('Availability_qty', 0),
                    'MRP': stock.get('Sellable_qty_price', 0),
                    'Expiry_Date': stock.get('Expiry_Date', "N/A")
                }
                id += 1
                data.append(idata)
        else:
            # Return default values when no stock is found
            data.append({
                'id': 1,
                'Batch_No': "No Batch Available",
                'AvailableQuantity': 0,
                'MRP': 0,
                'Expiry_Date': "Expiry Date is Not Available"
            })
 
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Batchno_Item_Names_All_Link1(request):
    try:
        StoreId = request.GET.get('StoreId')
        ItemCode = request.GET.get('SearchItemCode')
        ItemName = request.GET.get('SearchItemName')
        ItemBatch = request.GET.get('SearchBatch')
 
        print("ItemCode:", type(ItemCode),ItemName)
       
 
       
        # Fetch the item from Product Master
        try:
            item_names = Product_Master_All_Category_Details.objects.get(ItemName=ItemName, IsSellable=True,Status=True)
            print('item_nameee',item_names)
        except Exception as e:
            return JsonResponse({'error': f'Item not found or not sellable {str(e)}'})

        print("batch",ItemBatch)
        filt = Q()
        if ItemBatch and ItemBatch != "":
            filt &= Q(Batch_No = ItemBatch)

        # Fetch stock details and order by Expiry Date (nearest to longest)
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
    Product_Detials=item_names,                         # Filter by product
    Store_location__Store_Type='PHARMACY',              # Only Pharmacy store type
    Store_location__IsPointOfSale=1,                    # Must be a POS store
    Store_location__Store_Id=StoreId,                   # Match current store ID
    Expiry_Date__isnull=False,                          # Only include items with expiry date
    AvailableQuantity__gt=0 ,
    Product_Detials__Status = True                            # Only show positive stock
).filter(filt).values('Batch_No', 'Expiry_Date', 'Sellable_qty_price').annotate(Availability_qty=Sum('AvailableQuantity')).order_by('Expiry_Date')                             

 
        print("Stock data:", stock_ins)
 
        data = []
        id = 1
 
        if stock_ins.exists():
            for stock in stock_ins:
                idata = {
                    'id': id,
                    'Batch_No': stock.get('Batch_No', "N/A"),
                    'AvailableQuantity': stock.get('Availability_qty', 0),
                    'MRP': stock.get('Sellable_qty_price', 0),
                    'Expiry_Date': stock.get('Expiry_Date', "N/A")
                }
                id += 1
                data.append(idata)
        else:
            # Return default values when no stock is found
            data.append({
                'id': 1,
                'Batch_No': "No Batch Available",
                'AvailableQuantity': 0,
                'MRP': 0,
                'Expiry_Date': "Expiry Date is Not Available"
            })
 
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Batchno_Item_Names_All_Link_Optical(request):
    try:
        StoreId = request.GET.get('StoreId')
        ItemCode = request.GET.get('SearchItemCode')
        ItemName = request.GET.get('SearchItemName')
        ItemBatch = request.GET.get('SearchBatch')
 
        print("ItemCode:", type(ItemCode),ItemName)
       
 
       
        # Fetch the item from Product Master
        try:
            item_names = Product_Master_All_Category_Details.objects.filter(ItemName=ItemName).first()
            print('item_nameee',item_names)
        except Exception as e:
            return JsonResponse({'error': f'Item not found or not sellable {str(e)}'})

        print("batch",ItemBatch)
        filt = Q()
        if ItemBatch and ItemBatch != "":
            filt &= Q(Batch_No = ItemBatch)

        # Fetch stock details and order by Expiry Date (nearest to longest)
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
    Product_Detials=item_names,                         # Filter by product
               # Only Pharmacy store type
    # Store_location__IsPointOfSale=1,                    # Must be a POS store
    Store_location__Store_Id=StoreId,                   # Match current store ID
                      # Only include items with expiry date
    AvailableQuantity__gt=0 ,
                           # Only show positive stock
).filter(filt).values('Batch_No', 'Expiry_Date', 'Sellable_qty_price').annotate(Availability_qty=Sum('AvailableQuantity')).order_by('Expiry_Date')                             

 
        print("Stock data:", stock_ins)
 
        data = []
        id = 1
 
        if stock_ins.exists():
            for stock in stock_ins:
                idata = {
                    'id': id,
                    'Batch_No': stock.get('Batch_No', "") if stock.get('Batch_No', "") else 'OPTCAL34',
                    'AvailableQuantity': stock.get('Availability_qty', 0),
                    'MRP': stock.get('Sellable_qty_price', 0),
                    'Expiry_Date': stock.get('Expiry_Date', "") if stock.get('Expiry_Date', "") else '28-12-2030'
                }
                id += 1
                data.append(idata)
        else:
            # Return default values when no stock is found
            data.append({
                'id': 1,
                'Batch_No': "No Batch Available",
                'AvailableQuantity': 0,
                'MRP': 0,
                'Expiry_Date': "Expiry Date is Not Available"
            })
 
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
 
 
  
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Batchno_Item_Names_IP_All_Link(request):
    try:
        ItemCode = request.GET.get('SearchItemCode')
        Department = request.GET.get('Department')
 
        print("ItemCode:", ItemCode)
        print("Department:", Department)
 
        if not Department:
            return JsonResponse({'warn': 'Department is required'})
 
        # Fetch the item from Product Master
        try:
            item_names = Product_Master_All_Category_Details.objects.get(pk=ItemCode, IsSellable=True)
        except Product_Master_All_Category_Details.DoesNotExist:
            return JsonResponse({'error': 'Item not found or not sellable'})
 
        # Fetch stock details and order by Expiry Date (nearest to longest)
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials=item_names,
            Store_location__Departments__Department_Id=Department,
            Store_location=3,
        ).exclude(AvailableQuantity=0) \
        .values('Batch_No', 'Expiry_Date', 'Sellable_qty_price') \
        .annotate(Availability_qty=Sum('AvailableQuantity')) \
        .order_by('Expiry_Date')  # Sorting by expiry date in ascending order
 
        print("Stock data:", stock_ins)
 
        data = []
        id = 1
 
        if stock_ins.exists():
            for stock in stock_ins:
                idata = {
                    'id': id,
                    'Batch_No': stock.get('Batch_No', "N/A"),
                    'AvailableQuantity': stock.get('Availability_qty', 0),
                    'MRP': stock.get('Sellable_qty_price', 0),
                    'Expiry_Date': stock.get('Expiry_Date', "N/A")
                }
                id += 1
                data.append(idata)
        else:
            # Return default values when no stock is found
            data.append({
                'id': 1,
                'Batch_No': "Nill",
                'AvailableQuantity': 0,
                'MRP': 0,
                'Expiry_Date': "Nill"
            })
 
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
# Customer_Master_Link

@csrf_exempt
def Patient_Master_Link(request):
    try:
        patient_Details = Patient_Detials.objects.all() 

        patient_list = []  

        for patient in patient_Details:
            if patient.PermanentAddressSameAsAbove == 'Yes':
                address = f"No.{patient.PermanentdoorNo or ''}, {patient.PermanentStreet or ''}, {patient.PermanentArea or ''}, {patient.PermanentCity}-{patient.PermanentPincode}, {patient.PermanentDistrict}, {patient.PermanentState}"
            else:
                address = f"No.{patient.DoorNo or ''}, {patient.Street or ''}, {patient.Area or ''}, {patient.City}-{patient.Pincode}, {patient.District}, {patient.State}"

           
            patient_list.append({


                
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}",
                'Gender': patient.Gender,
                'PatientAge': f"{patient.Age} / {patient.Gender}",
                'PhoneNo': patient.PhoneNo,
                'PatientType': patient.PatientType if patient.PatientType else None,
                'PatientAddress': address,
            })

        return JsonResponse(patient_list, safe=False)  

    except Exception as e:
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)}, status=500)



# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Nurse_Item_Names_All_Link(request):
#     try:
#         ItemCode = request.GET.get('SearchItemCode')
#         ItemName = request.GET.get('SearchItemName').strip()
#         SearchBatchNo = request.GET.get('SearchBatchNo')
#         store_location = request.GET.get('StoreLocation')
#         ItemCode= Product_Master_All_Category_Details.objects.filter(ItemName__iexact=ItemName,Status=True).first().pk
#         if not ItemCode or not SearchBatchNo:
#             return JsonResponse({'warn': 'ItemCode and BatchNo are required'})
        
#         print('Itemmm',ItemCode,SearchBatchNo,store_location)
#         # Fetch Stock Details
#         try:
#             stock_ins = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__ItemName__iexact=ItemName,Product_Detials__Status = True, Batch_No=SearchBatchNo,Store_location=store_location).first()
#         except Exception as e:
#             print(f'err {e}')
#         print('stockkk0',stock_ins)
#         # Fetch GST Details
#         gst_details = GRN_Product_Item_Detials.objects.filter(Product_Detials__pk=ItemCode, Batch_No=SearchBatchNo).order_by('-id').first()
#         print('ghchg')
#         # Convert values to float to avoid type errors
#         Tax_Percentage = float(gst_details.Tax_Percentage) if gst_details else 0.0
#         selling_price_with_tax = float(stock_ins.Sellable_qty_price) if stock_ins else 0.0
#         print('rtjhrtj')
#         # Calculate Selling Price Without Tax
#         if Tax_Percentage > 0 and selling_price_with_tax > 0:
#             selling_price_without_tax = round(selling_price_with_tax / (1 + (Tax_Percentage / 100)), 2)
#         else:
#             selling_price_without_tax = selling_price_with_tax  # If no tax, it's the same as selling price
#         print('fnjrtthet')
#         # Prepare response data
#         idata = {
#             'AvailableQuantity': stock_ins.AvailableQuantity if stock_ins else 0,
#             'MRP': selling_price_with_tax,
#             'BoxName':stock_ins.BoxName,
#             'Selling_Price_Without_Tax': selling_price_without_tax,
#             'sellable_with_tax': float(stock_ins.Sellable_qty_price),
#             'GST': 0,
#             'LeastSellableUnit': stock_ins.Product_Detials.LeastSellableUnit if stock_ins else 0,
#             'Expiry_Date': stock_ins.Expiry_Date.strftime('%Y-%m-%d') if stock_ins.Expiry_Date else '-',
#         }

#         return JsonResponse(idata)

#     except Stock_Maintance_Table_Detials.DoesNotExist:
#         return JsonResponse({'warn': 'Stock details not found for the given ItemCode and BatchNo'})

#     except GRN_Product_Item_Detials.DoesNotExist:
#         return JsonResponse({'warn': 'GST details not found for the given ItemCode and BatchNo'})

#     except ValueError as ve:
#         print("ValueError:", ve)
#         return JsonResponse({'warn': 'Invalid data type for price or tax percentage'})

#     except Exception as e:
#         print("Exception:", e)
#         return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Nurse_Item_Names_All_Link(request):
    try:
        ItemCode = request.GET.get('SearchItemCode')
        ItemName = request.GET.get('SearchItemName', '').strip()
        SearchBatchNo = request.GET.get('SearchBatchNo')
        store_location = request.GET.get('StoreLocation')

        # Validate input
        if not ItemName or not SearchBatchNo:
            return JsonResponse({'warn': 'ItemName and BatchNo are required'})

        # Get product details
        product = Product_Master_All_Category_Details.objects.filter(
            ItemName__iexact=ItemName,
            Status=True
        ).first()

        if not product:
            return JsonResponse({'warn': 'Product not found'})

        ItemCode = product.pk

        # Fetch Stock Details
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials=product,
            Batch_No=SearchBatchNo,
            Store_location=store_location
        ).first()

        # Fetch GST Details (if available)
        gst_details = GRN_Product_Item_Detials.objects.filter(
            Product_Detials__pk=ItemCode,
            Batch_No=SearchBatchNo
        ).order_by('-id').first()

        Tax_Percentage = float(gst_details.Tax_Percentage) if gst_details else 0.0
        selling_price_with_tax = float(stock_ins.Sellable_qty_price) if stock_ins else 0.0

        # Calculate Selling Price Without Tax
        if Tax_Percentage > 0 and selling_price_with_tax > 0:
            selling_price_without_tax = round(selling_price_with_tax / (1 + (Tax_Percentage / 100)), 2)
        else:
            selling_price_without_tax = selling_price_with_tax

        # ✅ Fetch GST fields from Product_Master_All_Category_Details
        CGST = float(product.CGST or 0)
        SGST = float(product.SGST or 0)
        GST_Type = product.GST_Type or ""
        GST_Value = float(product.GST_Value or 0)

        # ✅ Prepare response data
        idata = {
            'AvailableQuantity': stock_ins.AvailableQuantity if stock_ins else 0,
            'MRP': selling_price_with_tax,
            'BoxName': stock_ins.BoxName if stock_ins else "",
            'Selling_Price_Without_Tax': selling_price_without_tax,
            'sellable_with_tax': float(stock_ins.Sellable_qty_price) if stock_ins else 0,
            'GST': 0,
            'CGST': CGST,
            'SGST': SGST,
            'GST_Type': GST_Type,
            'GST_Value': GST_Value,
            'LeastSellableUnit': product.LeastSellableUnit or 0,
            'Expiry_Date': stock_ins.Expiry_Date.strftime('%Y-%m-%d') if stock_ins and stock_ins.Expiry_Date else '-',
        }

        return JsonResponse(idata)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Nurse_Item_Names_All_Link_optical(request):
    try:
        ItemCode = request.GET.get('SearchItemCode')
        ItemName = request.GET.get('SearchItemName', '').strip()
        SearchBatchNo = request.GET.get('SearchBatchNo')
        store_location = request.GET.get('StoreLocation')

        # Validate input
        if not ItemName or not SearchBatchNo:
            return JsonResponse({'warn': 'ItemName and BatchNo are required'})

        # Get product details
        product = Product_Master_All_Category_Details.objects.filter(
            ItemName__iexact=ItemName,
            
        ).first()

        if not product:
            return JsonResponse({'warn': 'Product not found'})

        ItemCode = product.pk

        # Fetch Stock Details
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials=product,
            # Batch_No=SearchBatchNo,
            Store_location=store_location
        ).first()

        # Fetch GST Details (if available)
        gst_details = GRN_Product_Item_Detials.objects.filter(
            Product_Detials__pk=ItemCode,
            # Batch_No=SearchBatchNo
        ).order_by('-id').first()

        Tax_Percentage = float(gst_details.Tax_Percentage) if gst_details else 0.0
        selling_price_with_tax = float(stock_ins.Sellable_qty_price) if stock_ins else 0.0

        # Calculate Selling Price Without Tax
        if Tax_Percentage > 0 and selling_price_with_tax > 0:
            selling_price_without_tax = round(selling_price_with_tax / (1 + (Tax_Percentage / 100)), 2)
        else:
            selling_price_without_tax = selling_price_with_tax

        # ✅ Fetch GST fields from Product_Master_All_Category_Details
        CGST = float(product.CGST or 0)
        SGST = float(product.SGST or 0)
        GST_Type = product.GST_Type or ""
        GST_Value = float(product.GST_Value or 0)

        # ✅ Prepare response data
        idata = {
            'AvailableQuantity': stock_ins.AvailableQuantity if stock_ins else 0,
            'MRP': selling_price_with_tax,
            'BoxName': stock_ins.BoxName if stock_ins else "",
            'Selling_Price_Without_Tax': selling_price_without_tax,
            'sellable_with_tax': float(stock_ins.Sellable_qty_price) if stock_ins else 0,
            'GST': 0,
            'CGST': CGST,
            'SGST': SGST,
            'GST_Type': GST_Type,
            'GST_Value': GST_Value,
            'LeastSellableUnit': product.LeastSellableUnit or 0,
            'Expiry_Date': stock_ins.Expiry_Date.strftime('%Y-%m-%d') if stock_ins and stock_ins.Expiry_Date else '-',
        }

        return JsonResponse(idata)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)






@csrf_exempt
@require_http_methods(["GET"])
def op_pharmacy_queue_list_prescrib_new(request):
    try:
        # Search parameters
        SearchbyFirstName = request.GET.get('SearchbyFirstName')
        SearchbySpeciality = request.GET.get('SearchbySpeciality')
        SearchbyDoctor = request.GET.get('SearchbyDoctor')
        DateType = request.GET.get('DateType')
        store = request.GET.get('store')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        status_filter = request.GET.get('SearchStatus')
        Department = 2
        search_query = Q(Status='1')
         
        invoice_no = None 
        if status_filter=='Paid':
            search_query = Q(Status='0')

            

        # Filtering by doctor, speciality, and status
        if SearchbyDoctor:
            search_query &= Q(Registration_Id__PrimaryDoctor__Doctor_ID__icontains=SearchbyDoctor)
        if SearchbySpeciality:
            search_query &= Q(Registration_Id__PrimaryDoctor__Specialization__Speciality_Id__icontains=SearchbySpeciality)
        if status_filter:
            search_query &= Q(BillingStatus=status_filter)
        if SearchbyFirstName:
            search_query &= (
                Q(Registration_Id__PatientId__FirstName__icontains=SearchbyFirstName) |
                Q(Registration_Id__PatientId__MiddleName__icontains=SearchbyFirstName) |
                Q(Registration_Id__PatientId__SurName__icontains=SearchbyFirstName) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)
            )

        # Date filtering
        if DateType == "Current" and CurrentDate:
            search_query &= Q(created_at__date=CurrentDate)
        elif DateType == "Customize":
            if FromDate and ToDate:
                search_query &= Q(created_at__date__range=[FromDate, ToDate])
            elif FromDate:
                search_query &= Q(created_at__date__gte=FromDate)
            elif ToDate:
                search_query &= Q(created_at__date__lte=ToDate)

        # Fetch filtered data
        
        print(search_query,'search')
        inv = Inventory_Location_Master_Detials.objects.filter(Store_Id=store).first()
        drug_requests = OPD_Prescription_Details.objects.filter(search_query,BatchNo__Store_location=inv)

        print(drug_requests,'drug')
        datafetch = []
        processed_patients = set()
        record_id = 1

        for drug_request in drug_requests:
            registration_id = drug_request.Registration_Id
            if not registration_id:
                continue
            
            patient_data = Patient_Appointment_Registration_Detials.objects.filter(
                Registration_Id=registration_id.Registration_Id
            ).first()
            
            if not patient_data:
                continue
            
            personal_data = Patient_Detials.objects.filter(
                PatientId=patient_data.PatientId.PatientId
            ).first()
            
            if not personal_data or personal_data.PatientId in processed_patients:
                continue  # Skip if patient already processed

            processed_patients.add(personal_data.PatientId)  # Add to processed list
            
            # Handle possible None values in name fields
            patient_name = f"{personal_data.Title.Title_Name or ''}.{personal_data.FirstName or ''} {personal_data.MiddleName or ''} {personal_data.SurName or ''}".strip()
            edit=True
            # Get doctor name
            doctor_name = None
            doctor_id = None
            doccc_inss = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id=drug_request.Registration_Id.Registration_Id).first()
            print('ibdvbf',doccc_inss)
            if doccc_inss:
                doctor = doccc_inss.PrimaryDoctor
                doctor_name = f"{doctor.Tittle.Title_Name or ''}.{doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}".strip()
                doctor_id =  doctor.Doctor_ID
            # Get patient category information
            categoryname = None
            categoryid = None
            if drug_request.Registration_Id.PatientCategory == 'Insurance':
                categoryname = drug_request.Registration_Id.InsuranceName.Insurance_Name if drug_request.Registration_Id.InsuranceName else None
                categoryid = drug_request.Registration_Id.InsuranceName.Insurance_Id if drug_request.Registration_Id.InsuranceName else None
            elif drug_request.Registration_Id.PatientCategory == 'Client':
                categoryname = drug_request.Registration_Id.ClientName.Client_Name if drug_request.Registration_Id.ClientName else None
                categoryid = drug_request.Registration_Id.ClientName.Client_Id if drug_request.Registration_Id.ClientName else None

            # Append patient details to the data list


            
            datafetch.append({
                'id': record_id,
                'PatientCategory': drug_request.Registration_Id.PatientCategory,
                'PatientCategoryName': categoryname,
                'VisitID': registration_id.VisitId,
                'VisitType': 'OP',
                'RegistrationId': registration_id.Registration_Id,
                'Booking_Id': registration_id.Registration_Id,  # Ensure this is a serializable ID
                'PatientName': patient_name,
                'PatientId': personal_data.PatientId,
                'PatientPhoneNo': personal_data.PhoneNo,
                'DoctorName': doctor_name,
                'Doctorid':doctor_id,
                'AgeGender': f"{personal_data.Age or ''}/{personal_data.Gender or ''}",
                'Address': ", ".join(filter(None, [
                    personal_data.DoorNo, personal_data.Street, personal_data.Area,
                    personal_data.City, personal_data.State, personal_data.Country,
                    personal_data.Pincode
                ])),
                'VisitPurpose': registration_id.VisitPurpose,
                "ServiceProcedureForm": "OP",
                'Title': personal_data.Title.Title_Name if personal_data.Title else None,
                'FirstName': personal_data.FirstName,
                'MiddleName': personal_data.MiddleName,
                'SurName': personal_data.SurName,
                'Gender': personal_data.Gender,
                'DOB': personal_data.DOB,
                'Age': personal_data.Age,
                'Status':drug_request.BillingStatus,
                'type': "OP",
                'Department': Department,
                'Edit': edit
            })

            record_id += 1

        return JsonResponse({"pharmacy_bills": datafetch}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500)






@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_Tray_Names_For_Product(request):

    try:

        ItemCode = request.GET.get('SearchItemCode')

        store_id = request.GET.get('StoreId')

        print('ItemCode----', ItemCode,store_id)
 
        if ItemCode:

            try:

                tray_instance = Tray_management_Details.objects.get(Product_Detials__pk=ItemCode,Rack_Name__Store_Location_Name__Store_Id=store_id)

                idata = {

                    'Tray_Name': tray_instance.Tray_Name.Tray_Name if tray_instance.Tray_Name else '',

                    'Shelf_Name': tray_instance.Shelf_Name.Shelf_Name if tray_instance.Shelf_Name else '',

                    'Rack_Name': tray_instance.Shelf_Name.Rack_Name.Rack_Name if tray_instance.Shelf_Name and tray_instance.Shelf_Name.Rack_Name else '',

                }

                return JsonResponse(idata)

            except ObjectDoesNotExist:

                return JsonResponse({'error': 'No tray/shelf found for the given product code'}, status=404)

        return JsonResponse({'error': 'Product code is required'}, status=400)
 
    except Exception as e:

        print("Exception:", e)

        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 


@csrf_exempt
@require_http_methods(['GET'])
def oppharmacybillview(request):


    try:
      if request.method == 'GET':
        regid = request.GET.get('regid')
        prescrip_id = request.GET.get('prescrip_id')

        print(regid,prescrip_id,'ids is here .....')


        return JsonResponse(data=dict(prescrip_id),safe=False)
        pass
    except Exception as e:
        return JsonResponse({'err':str(e)})
    


from DrugAdminstrations.models import *
from django.shortcuts import get_object_or_404


@csrf_exempt
@require_http_methods(["GET"])
def op_pharmacy_queue_list_paid_new(request):
    try:
        invoice_no = request.GET.get("invoice_no")  # Example: ?invoice_no=PHAOPDR/0001
        if not invoice_no:
            return JsonResponse({"error": "invoice_no is required"}, status=400)

        # Fetch billing invoice header
        billing = get_object_or_404(OP_Pharmacy_Billing_Table_Detials, Billing_Invoice_No=invoice_no)

        # Get related billing items
        items = billing.OP_billing_items.all().values(
            "ItemId_id", "ItemName", "Billing_Quantity", "BatchNo", 
            "Exp_Date", "Unit_Price", "Amount", "Total"
        )

        # Get related receipt
        receipt = billing.Pharmacy_receipt.first()
        receipt_data = None
        payments_data = []
        if receipt:
            receipt_data = {
                "Voucher_Number": receipt.Voucher_Number,
                "NewPayment": receipt.NewPayment,
                "PatientID": receipt.PatientID,
                "VisitId": receipt.Invoice_NO.Register_Id.VisitId,
                "Gender": receipt.Invoice_NO.Register_Id.Gender,
                "PhoneNumber": receipt.PhoneNumber,
                "Patient_Name": receipt.Patient_Name,
                "TotalAmount": receipt.TotalAmount,
                "TotalPaidAmount": receipt.TotalPaidAmount,
                "BalanceAmount": receipt.BalanceAmount,
                "Billing_Date": receipt.Billing_Date,
                "PaidAmount": receipt.PaidAmount,
                "Billedby": receipt.Billedby,
                "CreatedAt": receipt.CreatedAt,
                "UpdatedAt": receipt.UpdatedAt,
            }

            # Get related payments
            payments = receipt.billing_payments.all().values(
                "Billpay_method", "CardType", "BankName", "ChequeNo", 
                "paidamount", "Additionalamount", "transactionFee"
            )
            payments_data = list(payments)

        # Prepare final response
        response_data = {
            "Billing_Invoice_No": billing.Billing_Invoice_No,
            "Billing_Date": billing.Billing_Date,
            "Billing_Type": billing.Billing_Type,
            "Select_Discount": billing.Select_Discount,
            "Discount_Type": billing.Discount_Type,
            "Discount_Amount": billing.Discount_Amount,
            "Total_Items": billing.Total_Items,
            "Total_Qty": billing.Total_Qty,
            "Total_Amount": billing.Total_Amount,
            "SGST_val": billing.SGST_val,
            "CGST_val": billing.CGST_val,
            "Total_GSTAmount": billing.Total_GSTAmount,
            "Net_Amount": billing.Net_Amount,
            "Round_Off": billing.Round_Off,
            "Paid_Amount": billing.Paid_Amount,
            "Balance_Amount": billing.Balance_Amount,
            "Bill_Status": billing.Bill_Status,
            "created_by": billing.created_by,
            "updated_by": billing.updated_by,
            "created_at": billing.created_at,
            "updated_at": billing.updated_at,
            "Items": list(items),
            "Receipt": receipt_data,
            "Payments": payments_data,
        }

        return JsonResponse(response_data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)    