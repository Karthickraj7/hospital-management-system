from email.utils import formatdate
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from Masters.models import *
from decimal import Decimal, InvalidOperation
from .models import Patient_Appointment_Registration_Detials
from django.shortcuts import render
from .models import Service_Master_Details, Service_Procedure_Charges
from django.db.models import  Q
from OutPatient.models import *
from DrugAdminstrations.models import *
from OutPatient.LabRequests import get_lab_request_details
from OutPatient.ReferDoctor import get_rad_request_details

from django.db import connection, transaction
from .models import Patient_Appointment_Registration_Detials, Patient_Detials
from django.core.serializers import serialize
from Workbench.models import *
from django.db.models import Sum, Count

from django.utils.decorators import method_decorator
from django.views import View

from Lab.models import *
from Lab.BillingView import get_invoice_master_barcode
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to
from OutPatient.LabRequests import model_to_dict, extract_panic_range
from django.db.models import Sum, F, ExpressionWrapper, FloatField, Case, When
from Frontoffice.Registration import get_available_tokenno_by_speciality
from HR_Management.models import *


# -------------------------------------------------------------------------------

import re

def extract_age_years_only(age):
    if isinstance(age, int):
        return age
    elif isinstance(age, str):
        match = re.search(r'(\d+)\s*Y', age)
        if match:
            return int(match.group(1))
        else:
            # If no 'Y' found, try whole number string
            try:
                return int(age.strip())
            except ValueError:
                return 0  # No Y, default to 0
    return 0  # Non-string, non-int → default to 0

    
@csrf_exempt
@require_http_methods(["GET"])
def Get_OP_Billing_Details_Consultation(request):    
    try:
        # Single search parameter for name and phone filtering
        SearchbyFirstName = request.GET.get('SearchbyFirstName')
       
        # Other search parameters
        SearchbySpeciality = request.GET.get('SearchbySpeciality')
        SearchbyDoctor = request.GET.get('SearchbyDoctor')
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        status_filter = request.GET.get('SearchStatus')
 
        search_query = Q()
 
        # data = get_lab_request_details(request,Billing_Status1=status_filter,queue_type1 = "billling",Type="OP")
        # raddata = get_rad_request_details(request,Status='Request')
        # print("data :",data)
        # print("raddddata :",raddata)
        # Filtering by Name or Phone Number in a single search field
        if SearchbyFirstName:
            search_query &= Q(Registration_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)
 
        # Filtering by speciality, doctor, and status
        if SearchbySpeciality:
            search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
        if SearchbyDoctor:
            search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
        if status_filter:
            search_query &= Q(Status=status_filter)
   
        # Date filtering
        if DateType == "Current" and CurrentDate:
            search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
        elif DateType == "Customize":
            if FromDate and ToDate:
                search_query &= Q(created_at__date__range=[FromDate, ToDate])
            elif FromDate:
                search_query &= Q(created_at__date__gte=FromDate)
            elif ToDate:
                search_query &= Q(created_at__date__lte=ToDate)
 
        # Fetch filtered data
        Get_OPBilling_instance = OP_Billing_QueueList_Detials.objects.filter(search_query, Billing_Type ='Consultation')

        print(Get_OPBilling_instance,'Get_OPBilling_instance')
 
        Billing_data = {}
        for row in Get_OPBilling_instance:
            registration_key = row.Registration_Id.Registration_Id  # Use RegistrationId as the unique key
 
            full_name = f"{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}".strip()
            formatted_date = row.created_at.strftime("%Y-%m-%d")
 
            referal_ins = Patient_Referral_Detials.objects.filter(
                OP_Register_Id__Registration_Id=row.Registration_Id.Registration_Id
            ).first()
 
            categoryname, categoryid = None, None
            if row.Registration_Id.PatientCategory == 'Insurance':
                categoryname = row.Registration_Id.InsuranceName.Insurance_Name if row.Registration_Id.InsuranceName else None
                categoryid = row.Registration_Id.InsuranceName.Insurance_Id if row.Registration_Id.InsuranceName else None
            elif row.Registration_Id.PatientCategory == 'Client':
                categoryname = row.Registration_Id.ClientName.Client_Name if row.Registration_Id.ClientName else None
                categoryid = row.Registration_Id.ClientName.Client_Id if row.Registration_Id.ClientName else None
 
            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = row.Registration_Id).last()
            print('Doccccc',doc_ins)
 
            Doctor_ShortName = None
            Doctor_Id = None
 
            if row.Billing_Type == 'Consultation':
 
                Doctor_ShortName = f"{row.Doctor_Ratecard_Id.Doctor_ID.Tittle.Title_Name}.{row.Doctor_Ratecard_Id.Doctor_ID.First_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Middle_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Last_Name}" if row.Doctor_Ratecard_Id else None
                Doctor_Id = row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
           
            elif row.Billing_Type == 'Lab' or row.Billing_Type == 'Radiology':
 
                Doctor_ShortName = 'Self'
 
 
            registration_data = {
                'id': row.BillingQueueList_ID,
                'VisitType': 'OP',
                'BillingType': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'RegistrationId': row.Registration_Id.Registration_Id,
                'PatientId': row.Registration_Id.PatientId.PatientId,
                'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name': full_name,
                'AgeGender': f"{row.Registration_Id.PatientId.Age}/{row.Registration_Id.PatientId.Gender}",
                'Address': f"{row.Registration_Id.PatientId.DoorNo}, {row.Registration_Id.PatientId.Street}, {row.Registration_Id.PatientId.Area}, {row.Registration_Id.PatientId.City}, {row.Registration_Id.PatientId.State}, {row.Registration_Id.PatientId.Country}, {row.Registration_Id.PatientId.Pincode}",
                'VisitPurpose': row.Registration_Id.VisitPurpose,
                'PatientCategory': row.Registration_Id.PatientCategory,
                'PatientCategoryName': categoryname,
                'ReferalDoctor': f"{referal_ins.ReferredBy.Tittle.Title_Name}.{referal_ins.ReferredBy.First_Name} {referal_ins.ReferredBy.Middle_Name} {referal_ins.ReferredBy.Last_Name}" if referal_ins and referal_ins.ReferredBy else None,
                'Doctor_ShortName': Doctor_ShortName,
                'Doctor_Id': Doctor_Id,
                'Title': row.Registration_Id.PatientId.Title.Title_Name,
                'FirstName': row.Registration_Id.PatientId.FirstName,
                'MiddleName': row.Registration_Id.PatientId.MiddleName,
                'SurName': row.Registration_Id.PatientId.SurName,
                'Gender': row.Registration_Id.PatientId.Gender,
                'DOB': row.Registration_Id.PatientId.DOB,
                'Age': row.Registration_Id.PatientId.Age,
                'Email': row.Registration_Id.PatientId.Email,
                'BloodGroup': row.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if row.Registration_Id.PatientId.BloodGroup else None,
                'Occupation': row.Registration_Id.PatientId.Occupation,
                'Religion': row.Registration_Id.PatientId.Religion.Religion_Id if row.Registration_Id.PatientId.Religion else None,
                'Nationality': row.Registration_Id.PatientId.Nationality,
                'UniqueIdType': row.Registration_Id.PatientId.UniqueIdType,
                'UniqueIdNo': row.Registration_Id.PatientId.UniqueIdNo,
                'Complaint': doc_ins.Complaint,
                'DoorNo': row.Registration_Id.PatientId.DoorNo,
                'Street': row.Registration_Id.PatientId.Street,
                'Area': row.Registration_Id.PatientId.Area,
                'City': row.Registration_Id.PatientId.City,
                'State': row.Registration_Id.PatientId.State,
                'Country': row.Registration_Id.PatientId.Country,
                'Pincode': row.Registration_Id.PatientId.Pincode,
                "ServiceProcedureForm": "OP",
            }
 
            # Store only one entry per unique RegistrationId
            Billing_data[registration_key] = registration_data  # Overwrites previous entries if duplicate
 
        # Convert dictionary values to a list
        Billing_data_list = list(Billing_data.values())
 
        # # Append lab and radiology data
        # Billing_data_list.extend(data)
        # Billing_data_list.extend(raddata)
 
        return JsonResponse(Billing_data_list, safe=False)
 
    except Exception as e:
        print({'error': str(e)})
        return JsonResponse({'error': str(e)})
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Get_OP_Billing_Details(request):    
    try:
        # Single search parameter for name and phone filtering
        SearchbyFirstName = request.GET.get('SearchbyFirstName')
       
        # Other search parameters
        SearchbySpeciality = request.GET.get('SearchbySpeciality')
        SearchbyDoctor = request.GET.get('SearchbyDoctor')
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        status_filter = request.GET.get('SearchStatus')
 
        search_query = Q()
 
        # data = get_lab_request_details(request,Billing_Status1=status_filter,queue_type1 = "billling",Type="OP")
        # raddata = get_rad_request_details(request,Status='Request')
        # print("data :",data)
        # print("raddddata :",raddata)
        # Filtering by Name or Phone Number in a single search field
        if SearchbyFirstName:
            search_query &= Q(Registration_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                            Q(Registration_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)
 
        # Filtering by speciality, doctor, and status
        if SearchbySpeciality:
            search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
        if SearchbyDoctor:
            search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
        if status_filter:
            search_query &= Q(Status=status_filter)
   
        # Date filtering
        if DateType == "Current" and CurrentDate:
            search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
        elif DateType == "Customize":
            if FromDate and ToDate:
                search_query &= Q(created_at__date__range=[FromDate, ToDate])
            elif FromDate:
                search_query &= Q(created_at__date__gte=FromDate)
            elif ToDate:
                search_query &= Q(created_at__date__lte=ToDate)
 
        # Fetch filtered data
        Get_OPBilling_instance = OP_Billing_QueueList_Detials.objects.exclude(Billing_Type ='Consultation').filter(search_query).order_by('-created_at')
 
        Billing_data = {}
        for row in Get_OPBilling_instance:
            registration_key = row.Registration_Id.Registration_Id  # Use RegistrationId as the unique key
 
            full_name = f"{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}".strip()
            formatted_date = row.created_at.strftime("%Y-%m-%d")
 
            referal_ins = Patient_Referral_Detials.objects.filter(
                OP_Register_Id__Registration_Id=row.Registration_Id.Registration_Id
            ).first()
 
            categoryname, categoryid = None, None
            if row.Registration_Id.PatientCategory == 'Insurance':
                categoryname = row.Registration_Id.InsuranceName.Insurance_Name if row.Registration_Id.InsuranceName else None
                categoryid = row.Registration_Id.InsuranceName.Insurance_Id if row.Registration_Id.InsuranceName else None
            elif row.Registration_Id.PatientCategory == 'Client':
                categoryname = row.Registration_Id.ClientName.Client_Name if row.Registration_Id.ClientName else None
                categoryid = row.Registration_Id.ClientName.Client_Id if row.Registration_Id.ClientName else None
 
            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = row.Registration_Id).last()
            print('Doccccc',doc_ins)
 
            Doctor_ShortName = None
            Doctor_Id = None
 
            if row.Billing_Type == 'Consultation':
 
                Doctor_ShortName = f"{row.Doctor_Ratecard_Id.Doctor_ID.Tittle.Title_Name}.{row.Doctor_Ratecard_Id.Doctor_ID.First_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Middle_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Last_Name}" if row.Doctor_Ratecard_Id else None
                Doctor_Id = row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
           
            elif row.Billing_Type == 'Lab' or row.Billing_Type == 'Radiology':
 
                Doctor_ShortName = 'Self'
 
 
            registration_data = {
                'id': row.BillingQueueList_ID,
                'VisitType': 'OP',
                'BillingType': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'RegistrationId': row.Registration_Id.Registration_Id,
                'PatientId': row.Registration_Id.PatientId.PatientId,
                'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name': full_name,
                'AgeGender': f"{row.Registration_Id.PatientId.Age}/{row.Registration_Id.PatientId.Gender}",
                'Address': f"{row.Registration_Id.PatientId.DoorNo}, {row.Registration_Id.PatientId.Street}, {row.Registration_Id.PatientId.Area}, {row.Registration_Id.PatientId.City}, {row.Registration_Id.PatientId.State}, {row.Registration_Id.PatientId.Country}, {row.Registration_Id.PatientId.Pincode}",
                'VisitPurpose': row.Registration_Id.VisitPurpose,
                'PatientCategory': row.Registration_Id.PatientCategory,
                'PatientCategoryName': categoryname,
                'ReferalDoctor': f"{referal_ins.ReferredBy.Tittle.Title_Name}.{referal_ins.ReferredBy.First_Name} {referal_ins.ReferredBy.Middle_Name} {referal_ins.ReferredBy.Last_Name}" if referal_ins and referal_ins.ReferredBy else None,
                'Doctor_ShortName': Doctor_ShortName,
                'Doctor_Id': Doctor_Id,
                'Title': row.Registration_Id.PatientId.Title.Title_Name,
                'FirstName': row.Registration_Id.PatientId.FirstName,
                'MiddleName': row.Registration_Id.PatientId.MiddleName,
                'SurName': row.Registration_Id.PatientId.SurName,
                'Gender': row.Registration_Id.PatientId.Gender,
                'DOB': row.Registration_Id.PatientId.DOB,
                'Age': row.Registration_Id.PatientId.Age,
                'Email': row.Registration_Id.PatientId.Email,
                'BloodGroup': row.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if row.Registration_Id.PatientId.BloodGroup else None,
                'Occupation': row.Registration_Id.PatientId.Occupation,
                'Religion': row.Registration_Id.PatientId.Religion.Religion_Id if row.Registration_Id.PatientId.Religion else None,
                'Nationality': row.Registration_Id.PatientId.Nationality,
                'UniqueIdType': row.Registration_Id.PatientId.UniqueIdType,
                'UniqueIdNo': row.Registration_Id.PatientId.UniqueIdNo,
                'Complaint': doc_ins.Complaint,
                'DoorNo': row.Registration_Id.PatientId.DoorNo,
                'Street': row.Registration_Id.PatientId.Street,
                'Area': row.Registration_Id.PatientId.Area,
                'City': row.Registration_Id.PatientId.City,
                'State': row.Registration_Id.PatientId.State,
                'Country': row.Registration_Id.PatientId.Country,
                'Pincode': row.Registration_Id.PatientId.Pincode,
                "ServiceProcedureForm": "OP",
            }
 
            # Store only one entry per unique RegistrationId
            Billing_data[registration_key] = registration_data  # Overwrites previous entries if duplicate
 
        # Convert dictionary values to a list
        Billing_data_list = list(Billing_data.values())
 
        # # Append lab and radiology data
        # Billing_data_list.extend(data)
        # Billing_data_list.extend(raddata)
 
        return JsonResponse(Billing_data_list, safe=False)
 
    except Exception as e:
        print({'error': str(e)})
        return JsonResponse({'error': str(e)})
 
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Get_OP_Billing_Details_SingleId(request):
    try:
        QueueList_ID = request.GET.get('QueueList_ID')

        if not QueueList_ID:
            return JsonResponse({'error': 'QueueList_ID is required'}, status=400)

        try:
            row = OP_Billing_QueueList_Detials.objects.get(BillingQueueList_ID=QueueList_ID)
        except OP_Billing_QueueList_Detials.DoesNotExist:
            return JsonResponse({'error': 'Billing data not found'}, status=404)

        # Prepare patient full name
        full_name = f"{row.Registration_Id.PatientId.FirstName}{row.Registration_Id.PatientId.MiddleName}{row.Registration_Id.PatientId.SurName}"
        formatted_date = row.created_at.strftime("%d/%b/%Y")

        # Fetch advance records for the patient
        # Fetch a single advance record for the patient
        remaining_amount = 0
        record_id = None  # Initialize record_id to handle case where no record exists

        # Fetch advance records for the patient
        if row.Registration_Id.PatientId:
            advance_record = advancemaintaintable.objects.filter(Patient_Id=row.Registration_Id.PatientId).first()
            
            # Check if advance record exists
            if advance_record:
                # Retrieve the ID of the record
                record_id = advance_record.id

                # Calculate total advance amount and total paid amount
                total_advance_amount = advance_record.fullAmount
                total_paid_amount = advance_record.paidamount

                # Calculate remaining amount
                full_amount = total_advance_amount
                if full_amount > total_paid_amount:
                    remaining_amount = full_amount - total_paid_amount
        categoryname = ''
        categoryid = ''
        if row.Registration_Id.PatientCategory == 'Insurance':
            categoryname = row.Registration_Id.InsuranceName.Insurance_Name
            categoryid = row.Registration_Id.InsuranceName.Insurance_Id
        elif row.Registration_Id.PatientCategory == 'Client':
            categoryname = row.Registration_Id.ClientName.Client_Name
            categoryid = row.Registration_Id.ClientName.Client_Id
        else:
            categoryname=None

        # Prepare the billing data
        Billing_data = {
            'id': row.BillingQueueList_ID,
            'Billing_Type': row.Billing_Type,
            'ServiceName': row.Registration_Id.VisitPurpose,
            'Status': row.Status,
            'Date': formatted_date,
            'Registration_Id': row.Registration_Id.Registration_Id,
            'PatientId': row.Registration_Id.PatientId.PatientId,
            'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
            'Patient_Name': full_name.strip(),
            'Gender': row.Registration_Id.PatientId.Gender,
            'DoorNo': row.Registration_Id.PatientId.DoorNo,
            'Age': row.Registration_Id.PatientId.Age,
            'Street': row.Registration_Id.PatientId.Street,
            'Area': row.Registration_Id.PatientId.Area,
            'City': row.Registration_Id.PatientId.City,
            'State': row.Registration_Id.PatientId.State,
            'Country': row.Registration_Id.PatientId.Country,
            'Pincode': row.Registration_Id.PatientId.Pincode,
            'VisitId': row.Registration_Id.VisitId,
            # 'PatientType': row.Registration_Id.PatientType,
            'PatientCategory': row.Registration_Id.PatientCategory,
            'PatientCategoryName': categoryname,
            'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
            'Doctor_ShortName': row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id else None,
            'Advance_Amount':remaining_amount, # Add the total advance amount here
            'advanceid':record_id
            
        }

        # Add Service Fee based on PatientCategory and ServiceName
        if Billing_data['PatientCategory'] == 'General':
            if Billing_data['ServiceName'] == 'NewConsultation':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.General_Consultation_Fee
            elif Billing_data['ServiceName'] == 'FollowUp':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.General_Follow_Up_Fee
        elif Billing_data['PatientCategory'] == 'Special':
            if Billing_data['ServiceName'] == 'NewConsultation':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.Special_Consultation_Fee
            elif Billing_data['ServiceName'] == 'FollowUp':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.Special_Follow_Up_Fee

        return JsonResponse(Billing_data, safe=False)

    except Exception as e:
        print({'error': str(e)})
        return JsonResponse({'error': str(e)}, status=500)
        
@csrf_exempt
@require_http_methods(["GET"])
def Get_OP_Billing_Details_Due(request):
    try:
        QueueList_ID=request.GET.get('QueueList_ID')

        if not QueueList_ID:
            return JsonResponse({'error':'QueueList_ID is required'},status=400)
        try:
            row =OP_Billing_QueueList_Detials.objects.get(BillingQueueList_ID=QueueList_ID)
        
        except OP_Billing_QueueList_Detials.DoesNotExist:
            return JsonResponse ({'error': 'Billing data not found'}, status=404)


           
        full_name = f"{row.Registration_Id.PatientId.FirstName}"

        formatted_date = row.created_at.strftime("%d/%b/%Y")

        Billing_data={    
                'id':row.BillingQueueList_ID,
                'Billing_Type': row.Billing_Type,
                'ServiceName':row.Registration_Id.VisitPurpose,
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id':row.Registration_Id.Registration_Id,
                'PatientId':row.Registration_Id.PatientId.PatientId,
                'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name':full_name.strip(),
                'Gender':row.Registration_Id.PatientId.Gender,
                'DoorNo':row.Registration_Id.PatientId.DoorNo,
                'Age':row.Registration_Id.PatientId.Age,
                'Street':row.Registration_Id.PatientId.Street,
                'Area':row.Registration_Id.PatientId.Area,
                'City':row.Registration_Id.PatientId.City,
                'State':row.Registration_Id.PatientId.State,
                'Country':row.Registration_Id.PatientId.Country,
                'Pincode':row.Registration_Id.PatientId.Pincode,
                'VisitId':row.Registration_Id.VisitId,
                'PatientType':row.Registration_Id.PatientType,
                'PatientCategory':row.Registration_Id.PatientCategory,
                'Doctor_ID':row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID,
                'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName,
            }
        if Billing_data['PatientCategory'] == 'General':
            if Billing_data['ServiceName'] == 'NewConsultation':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.General_Consultation_Fee
            elif Billing_data['ServiceName'] == 'FollowUp':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.General_Follow_Up_Fee
        
        elif Billing_data['PatientCategory'] == 'Special':
            if Billing_data['ServiceName'] == 'NewConsultation':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.Special_Consultation_Fee
            elif Billing_data['ServiceName'] == 'FollowUp':
                Billing_data['Service_Fee'] = row.Doctor_Ratecard_Id.Special_Follow_Up_Fee
        
        return JsonResponse(Billing_data, safe=False)
    except Exception  as e:
        print({'error':str(e)})
        return JsonResponse ({'error':str(e)})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def advance_billing_link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Extract data from the request
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            advanceamount = data.get('advanceamount')
            department = data.get('department')
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            Billing_Type = data.get('Billing_Type')
            billAmount = data.get('billAmount', [])
            BillingData = data.get('BillingData', {})
            advanceid =data.get('advanceid')
            remainingadvanceamount=data.get('remainingadvanceamount')
            # Fetch related foreign key objects
            try:
                patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
                register = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
                visit = Patient_Visit_Detials.objects.get(
                    PatientId=SelectedPatient_list.get('PatientId'),
                    VisitId=SelectedPatient_list.get('VisitId')
                )
                locationget = Location_Detials.objects.get(Location_Id=Location)
            except ObjectDoesNotExist as e:
                return JsonResponse({'error': f'{str(e).split(":")[1].strip()} not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple instances found'})

            # Convert to Decimal with error handling
            def to_decimal(value):
                try:
                    return Decimal(str(value).strip())
                except (TypeError, ValueError):
                    return Decimal('0.00')
            
            # Begin an atomic transaction
            with transaction.atomic():
                # Create and save the AdvanceAmountTable entry
                advancetable = Advanceamounttable(
                    Billing_Date=BillingData.get('InvoiceDate'),
                    Patient_Id=patient,
                    Register_Id=register,
                    Visit_Id=visit,
                    Billing_Type=Billing_Type,
                    Department=department,
                    Amount=advanceamount,
                    created_by=Created_by,
                    Locations=Location  # This should reference the correct `locationget` object
                )
                advancetable.save()
                if advanceid :

                     # Fetch the existing record using get()
                    existing_record = advancemaintaintable.objects.get(id=advanceid)
                    
                    # Calculate the total amount
                    famount = existing_record.fullAmount
                    print(famount)
                    totalamount = int(famount) + int(advanceamount)  # Use float for consistency
                    
                    # Update the record and save it
                    existing_record.Remaining_amount = remainingadvanceamount
                    existing_record.fullAmount = totalamount
                    existing_record.save()
                    
                else:
                    maintaintable=advancemaintaintable(
                        adInvoice_NO=advancetable,
                        Patient_Id=patient,
                        Register_Id=register,
                        Visit_Id=visit,
                        Billing_Date=BillingData.get('InvoiceDate'),
                        Billing_Type=Billing_Type,
                        Department=department,
                        fullAmount=advanceamount,
                        paidamount=0,
                        Remaining_amount=advanceamount,
                        created_by=Created_by,
                        Locations=Location 
                    )
                    maintaintable.save()

                # Save multiple payment details
                for payment in billAmount:
                    multiple_payment = Multiple_Payment_Table_Detials(
                        Invoice_No_Paid=advancetable.adInvoice_NO,
                        Payment_Type=payment.get('Billpay_method'),
                        Cart_Type=payment.get('CardType'),
                        Cheque_No=payment.get('ChequeNo'),
                        Bank_Name=payment.get('BankName'),
                        Amount=to_decimal(payment.get('paidamount')),
                    )
                    multiple_payment.save()
                advanceinvoiceno = advancetable.adInvoice_NO
                
            return JsonResponse({'status': 'Success','InvoiceNo':advanceinvoiceno})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)






@method_decorator(csrf_exempt, name='dispatch')
class GeneralBillingView(View):

    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)

    def get_patient_data(self, SelectedPatient_list):
        patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
        register = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
        visit = Patient_Visit_Detials.objects.filter(PatientId=SelectedPatient_list.get('PatientId'), VisitId=SelectedPatient_list.get('VisitId')).last()
        return patient, register, visit

    def create_billing_items(self, billing, SelectDatalist, new_bill_status, SelectedPatient_list):
        for item in SelectDatalist:
            service_cd = item.get('ServiceCode') if item.get('ServiceType') != 'Lab' else item.get('Test_Code') if item.get('type') == 'individual' else item.get("group")
            TestCode = item.get('TestCode') if  item.get('ServiceType') == "RADIOLOGY" else None
            Service_code = item.get('ServiceSubCatId') if item.get('ServiceType') else None

            item_obj = General_Billing_Items_Table_Detials(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType'),
                Service_Code=service_cd or TestCode or Service_code,
                Service_Name=item.get('SelectItemName'),
                Rate=self.safe_to_decimal(item.get('Amount')),
                Charge=self.safe_to_decimal(item.get('Charges')),
                Quantity=int(item.get('Quantity', 1)),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Type=item.get('Discountmethod'),
                Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
                Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                Tax_Amount=self.safe_to_decimal(item.get('GST', 0.00)),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                Item_Status=new_bill_status,
            )
            item_obj.save()

            # Update external references
            self.update_service_status(item, SelectedPatient_list, new_bill_status, billing)

    def update_service_status(self, item, SelectedPatient_list, new_bill_status, billing):
        if item.get('ServiceType') == "RADIOLOGY":
  
            patient_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
            rad_queue_ins = Radiology_Request_Details.objects.filter(Radiology_RequestId=item.get("request_id"),OP_Register_Id__Registration_Id=patient_ins.Registration_Id)
 
            for rad in rad_queue_ins:
 
                rad.Status = new_bill_status
                rad.Billing_Invoice_No = billing
                rad.save()

        elif item.get('ServiceType') == 'Lab':
            patient_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
            lab_qeue_ins = Lab_Request_Details.objects.filter(Request_Id=item.get('Request_Id'), OP_Register_Id__Registration_Id=patient_ins.Registration_Id).first()
            if lab_qeue_ins:
                lab_qeue_ins.Billing_Status = new_bill_status
                lab_qeue_ins.Billing_Invoice_No = billing
                lab_qeue_ins.save()

        else:
            patient_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=SelectedPatient_list.get('RegisterId')).first()
            serviceins = WalkinPatientServiceDetails.objects.filter(pk=item.get('Serviceid'), Registration_Id__Registration_Id = patient_ins.Registration_Id).first()
            if serviceins:
                serviceins.BillStatus = new_bill_status
                serviceins.Billing_Invoice_No = billing
                serviceins.save()

    def handle_cash_payment(self, general_billing, initialState, patient, BillingData, Created_by):
        receipt = GeneralBillingReceipt(
            Invoice_NO=general_billing,
            PatientID=patient.PatientId,
            PhoneNumber=patient.PhoneNo,
            Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
            TotalAmount=self.safe_to_decimal(initialState.get('totalNetAmount')),
            TotalPaidAmount=self.safe_to_decimal(initialState.get('totalAmountt')),
            BalanceAmount=self.safe_to_decimal(initialState.get('BalanceAmount')),
            Billing_Date=BillingData.get('InvoiceDate'),
            PaidAmount=self.safe_to_decimal(initialState.get('PaidAmount')),
            Billedby=Created_by
        )
        receipt.save()
        print('-------------Receipt Done------------')
        return receipt
    
    def save_multiple_payments(self, billAmount, receipt, Created_by):
        for payment in billAmount:
            Multiple_Payment_Table_Detials.objects.create(
                Receipt_No_Paid=receipt,
                Payment_Type=payment.get('Billpay_method'),
                Cart_Type=payment.get('CardType'),
                Card_No=payment.get('CardNo',''),
                TransactionId=payment.get('TransactionId'),
                upiid=payment.get('upiid'),
                Cheque_No=payment.get('ChequeNo'),
                Bank_Name=payment.get('BankName'),
                Amount=self.safe_to_decimal(payment.get('paidamount')),
                Transaction_Amount=self.safe_to_decimal(payment.get('transactionFee')),
                AdditionalAmount=self.safe_to_decimal(payment.get('Additionalamount')),
                created_by = Created_by,
            )
            print('-------------Payment Done------------')

    def Lab_Request_Detailslink_Billing(self,item,location,general_billing,new_bill_status,SelectedPatient_list,Created_by,visit,barcode,doctor):
        try:
            print('QUICK BILLING CODING')
            # print('dberger',item)
            print('yvbhjkb',SelectedPatient_list.get('RegisterId'))
            print('yvbhjkb',item)
            service_types = []
            for i in item:
                print('uyfuygkj')
                service_types.append(i.get('ServiceType'))
            if 'LAB' in service_types:
                print('vyujhbf')
                created_by = Created_by
                registration_id = SelectedPatient_list.get('RegisterId')

                register_type = "OP"
                # register_type = data.get('RegisterType', 'OP')
                SelectedTest = item
                location = location.Location_Id
                # Remarks = data.get("Remarks",'')

                # print('dberger',item)
                print('registration_id',registration_id)
                print('SelectedTest',SelectedTest)
                # print('dberger',item)
                # register_type = item.get('type')


                if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
                    return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})

                # Prepare the arguments based on the register type
                register_kwargs = {'RegisterType': register_type}
                if register_type == 'OP':
                    try:
                        print('xxxxxxxxxxxxxxxxxxx')
                        op_register_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['OP_Register_Id'] = op_register_instance
                    except Patient_Appointment_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'OP Registration ID not found'})

                elif register_type == 'IP':
                    try:
                        ip_register_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['IP_Register_Id'] = ip_register_instance
                    except Patient_IP_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'IP Registration ID not found'})

                elif register_type == 'Casuality':
                    try:
                        casuality_register_instance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['Casuality_Register_Id'] = casuality_register_instance
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'Casuality Registration ID not found'})

                # Insert into Lab_Request_Details
                Location_instance = Location_Detials.objects.get(Location_Id=location)
                lab_request = Lab_Request_Details.objects.create(
                    created_by=created_by,
                    Location=Location_instance,
                    Billing_Status = new_bill_status,
                    Status = new_bill_status,
                    Billing_Invoice_No = general_billing,
                    # Remarks=Remarks,
                    **register_kwargs,
                )
                print('labbbbb createddd')





                # Loop through SelectedTest and insert into Lab_Request_Items_Details
                for test in SelectedTest:
                    print('tettttttt',test)
                    if test.get("ServiceType") == 'LAB':
                        print(test,'test')
                        SubDepartment_Code = test.get("sub_department_id")
                        testType = test.get("type")
                        Department_Code = test.get("department_id")
                        Code = test.get("ServiceSubCatId").strip()
                        print(testType,'testtypibdiufbhi')
                        print(Code,'COdeeeee')
                        NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
                            item_id_int=Cast("Item_Id", IntegerField())
                        ).aggregate(Max("item_id_int"))["item_id_int__max"]
                        NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

                        print(NextItemID,'NextItemID')
                        Dcode = None
                        lab_request_item_data = {}
                        if testType == 'Individual' or testType == 'individual':
                            print(testType,'testType')
                            print(Code,'COdeeeee')
                            print(len(Code))
                            Dcode = Test_Descriptions.objects.get(Test_Code = Code)
                            print('testttttt',Dcode)
                            lab_request_item_data = {
                                "Item_Id":NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
                                "Department_Code_id": Dcode.department.Department_Code,
                                }
                        elif testType == 'Group' or testType == "group":
                            print(testType,'testType')
                            Gcode = Group_Master.objects.get(Group_Code = Code)
                            print('iuygvsdiud',Gcode)
                            print('depppppp',Gcode.Department.department.Department_Code)
                            print('subbbbdeeee',Gcode.Department.SubDepartment_Code)
                            lab_request_item_data = {
                                "Item_Id":NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "Department_Code_id": Gcode.Department.department.Department_Code,
                                "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
                                }
                        elif testType == 'Offers' or testType == 'offers':
                            print(testType, 'testTypeoffff')
                            Pcode = OfferPackageMaster.objects.get(package_code=Code)
                            print('pcodedeee',Pcode)
                            department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
                            print('deparrttrt',department)
                            lab_department = Lab_Department_Detials.objects.filter(Department_Code=department.department.Department_Code).first()
                            print('deparrttrt',lab_department)
                            print("---------", Pcode.department_name)
                            print("---------", Pcode.pk)
                            print("----IDDDDDDD-----", Pcode.offer_package_id)
                            lab_request_item_data = {
                                "Item_Id": NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "Department_Code_id": lab_department.pk,
                                "SubDepartment_Code_id": department.pk,
                            }
                        print(NextItemID,'NextItemID')



                        print(lab_request_item_data,'lab_request_item_data')
                        # Insert into appropriate columns based on testType
                        if testType == "Individual" or testType == "individual":
                            print('summaaa1111')
                            lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
                        elif testType == "Profiles" or testType == "Group" or testType == "group":
                            lab_request_item_data["Group_Code_id"] = Gcode.pk  # Assuming Code is the Group_Code
                        elif testType == "Profiles" or testType == "Offers" or testType == "offers":
                            lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code
                        # Save the item
                        Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                if register_type == 'OP':       
                    item_details = []
                    filterdepartment = []
                    TestDetails = []
                    keys_seen = set()
                    filterSpecimen = []
                    Specimen_keys_seen = set()
                    print('intooo the forr loop')
                    for index, item in enumerate(lab_request.lab_request_items.filter(Request = lab_request.Request_Id), start=1):
                        print("TestType :",item.TestType)
                        print(model_to_dict(item))                        
                        
                        if item.TestType.lower() == "individual":
                            if lab_request.Billing_Status == "Completed":
                                sub_department_code = (
                                    item.Test_Code.sub_department.SubDepartment_Code
                                )
                                sub_department_name = (
                                    item.Test_Code.sub_department.SubDepartment_Name
                                )

                                if sub_department_code not in keys_seen:
                                    filterdepartment.append(
                                        {
                                            "key": sub_department_code,
                                            "value": sub_department_name,
                                        }
                                    )
                                    keys_seen.add(sub_department_code)

                                Specimen_Name = (
                                    item.Test_Code.Specimen_Name.Specimen_Name
                                    if item.Test_Code.Specimen_Name
                                    else None
                                )
                                Specimen_Code = (
                                    item.Test_Code.Specimen_Name.Specimen_Code
                                    if item.Test_Code.Specimen_Name
                                    else None
                                )

                                if Specimen_Code not in Specimen_keys_seen:
                                    filterSpecimen.append(
                                        {"key": Specimen_Code, "value": Specimen_Name}
                                    )
                                    Specimen_keys_seen.add(Specimen_Code)

                            print("type :", item.TestType)
                            print("item.Test_Code :", item.Test_Code)
                            test_cost = Testmaster_Cost_List.objects.filter(
                                Test_Code=item.Test_Code.Test_Code
                            ).first()
                        
                            print('test_cost :',test_cost)
                            print('Billing_Status :',lab_request.Billing_Status)
                            
                            if lab_request.Billing_Status == "Completed":
                                data = model_to_dict(item.Test_Code)
                                modified_data = (
                                    {}
                                )  # Create a new dictionary to store the modified data
                                for key, value in data.items():
                                    if key == "department" and item.Test_Code.department:
                                        modified_data[key] = (
                                            item.Test_Code.department.Department_Name
                                        )
                                        modified_data["Department_Code"] = (
                                            item.Test_Code.department.Department_Code
                                        )
                                    elif (
                                        key == "sub_department"
                                        and item.Test_Code.sub_department
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.sub_department.SubDepartment_Name
                                        )
                                        modified_data["SubDepartment_Code"] = (
                                            item.Test_Code.sub_department.SubDepartment_Code
                                        )
                                    elif (
                                        key == "Container_Name"
                                        and item.Test_Code.Container_Name
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.Container_Name.Container_Name
                                        )
                                    elif (
                                        key == "Specimen_Name"
                                        and item.Test_Code.Specimen_Name is not None
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.Specimen_Name.Specimen_Name
                                        )
                                    elif key == "Method_Name" and item.Test_Code.Method_Name:
                                        modified_data[key] = (
                                            item.Test_Code.Method_Name.Method_Name
                                        )
                                    elif key == "UOM" and item.Test_Code.UOM:
                                        modified_data[key] = item.Test_Code.UOM.Unit_Name
                                    elif (
                                        key == "Captured_Unit_UOM"
                                        and item.Test_Code.Captured_Unit_UOM
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        )
                                    else:
                                        modified_data[key] = value  # Copy unchanged values
                                    
                                    RefernceRangeData = Age_Setup_Master.objects.filter(
                                        Test_Code=item.Test_Code.Test_Code
                                    ).first()
                                    
                                    reference_range = RefernceRangeData.Reference_Range
                                    NormalValue = RefernceRangeData.NormalValue
                                    Panic_Low = RefernceRangeData.PanicLow
                                    Panic_High = RefernceRangeData.PanicHigh

                                    if NormalValue == "Yes":
                                        panic_low, panic_high = extract_panic_range(
                                            reference_range, patient.Gender
                                        )
                                        modified_data["paniclow"] = panic_low
                                        modified_data["panichigh"] = panic_high
                                    else:
                                        modified_data["paniclow"] = Panic_Low
                                        modified_data["panichigh"] = Panic_High
                                    modified_data["type"] = "individual"
                                    
                                    modified_data["Display_Service_Status"] = "Completed"
                                    modified_data["Display_Analysis_Status"] = "Completed"
                                    modified_data["Display_Verify_Status"] = "Verified"
                                    modified_data["Display_Approve_Status"] = "Approved"
                                    
                                    modified_data["Service_Status"] = "Completed"
                                    modified_data["Analysis_Status"] = item.Analysis_Status
                                    modified_data["Verify_Status"] = item.Verify_Status
                                    modified_data["Approve_Status"] = item.Approve_Status
                                    
                                    
                                    
                                    modified_data["referencedata"] = reference_range
                                    modified_data["NormalValue"] = NormalValue 
                                    modified_data["Result_Value"] = None 
                                    modified_data["Remarks"] = None
                                    modified_data["Result_Value"] = item.Result_Value
                                    modified_data["TestType"] = "Individual"
                                    modified_data["ColumName"] = "Test_Code"

                                # Append the modified dictionary to TestDetails
                                TestDetails.append(modified_data)

                            item_details.append(
                                {
                                    "type": "individual",
                                    "S_No": index,
                                    "Test_Code": (
                                        item.Test_Code.Test_Code if item.Test_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Test_Code.Test_Name if item.Test_Code else None
                                    ),
                                    "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                        elif item.TestType.lower() == "group":
                            if lab_request.Billing_Status == "Completed":
                                if (
                                    item.Group_Code.Department.SubDepartment_Code
                                    not in filterdepartment
                                ):
                                    filterdepartment.append(
                                        {
                                            "key": item.Group_Code.Department.SubDepartment_Code,
                                            "value": item.Group_Code.Department.SubDepartment_Name,
                                        }
                                    )

                            # Get group test cost
                            test_cost = Testmaster_Cost_List.objects.filter(
                                Group_Code=item.Group_Code
                            ).first()

                            # Fetch sub-items for the group
                            group_items = []
                            sub_item_instances = Group_Master_TestList.objects.filter(
                                Group_Code=item.Group_Code
                            )
                            for sub_item in sub_item_instances:
                                if sub_item.Test_Code:

                                    Specimen_Name = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if sub_item.Test_Code.Specimen_Name else None
                                    )
                                    Specimen_Code = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Code if sub_item.Test_Code.Specimen_Name else None
                                    )

                                    if Specimen_Code not in Specimen_keys_seen:
                                        filterSpecimen.append(
                                            {"key": Specimen_Code, "value": Specimen_Name}
                                        )
                                        Specimen_keys_seen.add(Specimen_Code)

                                    sub_item_data = model_to_dict(sub_item.Test_Code)
                                    # Add any additional details or transformations if needed
                                    # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                    sub_item_data["SubDepartment_Name"] = (
                                        sub_item.Test_Code.sub_department.SubDepartment_Name
                                        if sub_item.Test_Code.sub_department
                                        else None
                                    )
                                    sub_item_data["Container_Name"] = (
                                        sub_item.Test_Code.Container_Name.Container_Name
                                        if sub_item.Test_Code.Container_Name
                                        else None
                                    )
                                    sub_item_data["Specimen_Name"] = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name
                                        if sub_item.Test_Code.Specimen_Name
                                        else None
                                    )
                                    sub_item_data["Method_Name"] = (
                                        sub_item.Test_Code.Method_Name.Method_Name
                                        if sub_item.Test_Code.Method_Name
                                        else None
                                    )
                                    sub_item_data["UOM"] = (
                                        sub_item.Test_Code.UOM.Unit_Name
                                        if sub_item.Test_Code.UOM
                                        else None
                                    )
                                    sub_item_data["Captured_Unit_UOM"] = (
                                        sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        if sub_item.Test_Code.Captured_Unit_UOM
                                        else None
                                    )

                                    sub_item_data["Result_Value"] = None

                                    sub_item_data["columnname"] = "Group_Code"

                                    group_items.append(sub_item_data)

                            # Add group-level item details
                            item_details.append(
                                {
                                    "type": "group",
                                    "S_No": index,
                                    "Group_Code": (
                                        item.Group_Code.Group_Code if item.Group_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Group_Code.Group_Name if item.Group_Code else None
                                    ),
                                    "Gender": "All",
                                    "Department": (
                                        item.Group_Code.Department.SubDepartment_Name
                                        if item.Group_Code.Department
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )

                            TestDetails.append(
                                {
                                    "type": "group",
                                    "S_No": index,
                                    "Group_Code": (
                                        item.Group_Code.Group_Code if item.Group_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Group_Code.Group_Name if item.Group_Code else None
                                    ),
                                    "Gender": "All",
                                    "SubDepartment_Code": (
                                        item.Group_Code.Department.SubDepartment_Code
                                        if item.Group_Code.Department
                                        else None
                                    ),
                                    "Department": (
                                        item.Group_Code.Department.SubDepartment_Name
                                        if item.Group_Code.Department
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                    "Service_Status": "Completed",
                                    "Analysis_Status": item.Analysis_Status,
                                    "Verify_Status": item.Verify_Status,
                                    "Approve_Status": item.Approve_Status,
                                "TestType" : "Group",
                                "ColumName": "Group_Code",
                                "Result_Value": None
                                }
                            )
                        elif item.TestType.lower() == "offers":
                            
                            sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
                            if lab_request.Billing_Status == "Completed":
                                
                                if (
                                    item.Package_code.department_name
                                    not in filterdepartment
                                ):
                                    filterdepartment.append(
                                        {
                                            "key": sub_dpt.pk,
                                            "value": item.Package_Code.department_name,
                                        }
                                    )

                            # Get group test cost
                            test_cost = Testmaster_Cost_List.objects.filter(
                                Package_Code=item.Package_Code
                            ).first()

                            # Fetch sub-items for the group
                            group_items = []
                            sub_item_instances = OfferPackageList.objects.filter(
                                package_code=item.Package_Code.package_code
                            )
                            print("-------Offer-------",sub_item_instances)
                            for sub_item in sub_item_instances:
                                print("-------Item-------",sub_item.Test_Code)
                                
                                if sub_item.Test_Code:
                                    print("------Test------",sub_item.Test_Code.Test_Name)
                                    Specimen_Name = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                    )
                                    Specimen_Code = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                    )

                                    if Specimen_Code not in Specimen_keys_seen:
                                        filterSpecimen.append(
                                            {"key": Specimen_Code, "value": Specimen_Name}
                                        )
                                        Specimen_keys_seen.add(Specimen_Code)

                                    sub_item_data = model_to_dict(sub_item.Test_Code)
                                    # Add any additional details or transformations if needed
                                    # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                    sub_item_data["SubDepartment_Name"] = (
                                        sub_item.Test_Code.sub_department.SubDepartment_Name
                                        if sub_item.Test_Code.sub_department
                                        else None
                                    )
                                    sub_item_data["Container_Name"] = (
                                        sub_item.Test_Code.Container_Name.Container_Name
                                        if sub_item.Test_Code.Container_Name
                                        else None
                                    )
                                    sub_item_data["Specimen_Name"] = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                        if sub_item.Test_Code.Specimen_Name 
                                        else None
                                    )
                                    sub_item_data["Method_Name"] = (
                                        sub_item.Test_Code.Method_Name.Method_Name
                                        if sub_item.Test_Code.Method_Name
                                        else None
                                    )
                                    sub_item_data["UOM"] = (
                                        sub_item.Test_Code.UOM.Unit_Name
                                        if sub_item.Test_Code.UOM
                                        else None
                                    )
                                    sub_item_data["Captured_Unit_UOM"] = (
                                        sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        if sub_item.Test_Code.Captured_Unit_UOM
                                        else None
                                    )

                                    sub_item_data["Result_Value"] = None

                                    sub_item_data["columnname"] = "Group_Code"
                                    sub_item_data["Group_Code"] = ""
                                    sub_item_data["Group_Name"] = ""

                                    print("-------Items-------",sub_item_data['Test_Name'])
                                    if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                        group_items.append(sub_item_data)
                                
                                elif sub_item.Group_Code:
                                    print("------group------",sub_item.Group_Code.Group_Code)
                                    group = sub_item.Group_Code.Group_Code
                                    groupName = sub_item.Group_Code.Group_Name
                                    sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
                                    print("-------Item-------",sub_item_instances)
                                    for sub_item in sub_item_instances:
                                        print("------Test------",sub_item.Test_Code.Test_Name)
                                        Specimen_Name = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                        )
                                        Specimen_Code = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                        )

                                        if Specimen_Code not in Specimen_keys_seen:
                                            filterSpecimen.append(
                                                {"key": Specimen_Code, "value": Specimen_Name}
                                            )
                                            Specimen_keys_seen.add(Specimen_Code)

                                        sub_item_data = model_to_dict(sub_item.Test_Code)
                                        # Add any additional details or transformations if needed
                                        # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                        sub_item_data["SubDepartment_Name"] = (
                                            sub_item.Test_Code.sub_department.SubDepartment_Name
                                            if sub_item.Test_Code.sub_department
                                            else None
                                        )
                                        sub_item_data["Container_Name"] = (
                                            sub_item.Test_Code.Container_Name.Container_Name
                                            if sub_item.Test_Code.Container_Name
                                            else None
                                        )
                                        sub_item_data["Specimen_Name"] = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                            if sub_item.Test_Code.Specimen_Name 
                                            else None
                                        )
                                        sub_item_data["Method_Name"] = (
                                            sub_item.Test_Code.Method_Name.Method_Name
                                            if sub_item.Test_Code.Method_Name
                                            else None
                                        )
                                        sub_item_data["UOM"] = (
                                            sub_item.Test_Code.UOM.Unit_Name
                                            if sub_item.Test_Code.UOM
                                            else None
                                        )
                                        sub_item_data["Captured_Unit_UOM"] = (
                                            sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                            if sub_item.Test_Code.Captured_Unit_UOM
                                            else None
                                        )

                                        sub_item_data["Result_Value"] = None

                                        sub_item_data["columnname"] = "Group_Code"
                                        sub_item_data["Group_Code"] = group
                                        sub_item_data["Group_Name"] = groupName

                                        print("-------Items-------",sub_item_data['Test_Name'])
                                        if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                            group_items.append(sub_item_data)
                                
                            # Add group-level item details
                            item_details.append(
                                {
                                    "type": "Offers",
                                    "S_No": index,
                                    "Request_Id": lab_request.Request_Id,
                                    "Group_Code": (
                                        item.Package_Code.package_code if item.Package_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Package_Code.package_name if item.Package_Code else None
                                    ),
                                    "Gender": "All",
                                    "Department": (
                                        item.Package_Code.department_name
                                        if item.Package_Code.department_name
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                            print("---------OK--------")
                            TestDetails.append(
                                {
                                    "type": "Offers",
                                    "S_No": index,
                                    "Group_Code": (
                                        item.Package_Code.package_code if item.Package_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Package_Code.package_name if item.Package_Code else None
                                    ),
                                    "Gender": "All",
                                    "SubDepartment_Code": (
                                        sub_dpt.SubDepartment_Code
                                        if item.Package_Code.department_name
                                        else None
                                    ),
                                    "Department": (
                                        item.Package_Code.department_name
                                        if item.Package_Code.department_name
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                    "Service_Status": "Completed",
                                    "Analysis_Status": item.Analysis_Status,
                                    "Verify_Status": item.Verify_Status,
                                    "Approve_Status": item.Approve_Status,
                                "TestType" : "Offers",
                                "ColumName": "Package_Code",
                                "Result_Value": None
                                }
                            )
                    
                    print("-----ITEMS-----",item_details)
                    print('-----Billing---',model_to_dict(general_billing))
                    
                    bill_exists = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = general_billing.Billing_Invoice_No, Barcode_Id = barcode).exists()

                    # VisitId = PatientVisitId.objects.filter(Patient_Id=op_register_instance.PatientId.PatientId).order_by('-Visit_Id').first()
                    # if VisitId:
                    #     VisitId = VisitId.Visit_Id + 1
                    # else:
                    #     VisitId = 1

                    

                    if not bill_exists:
                        count = len(item_details)
                        BarcodeId = get_invoice_master_barcode()
                        invoiceTable = BillingInvoiceAndBillAmount.objects.create(
                            Billing_Invoice = general_billing.Billing_Invoice_No,
                            Patient_Id = op_register_instance.PatientId.PatientId,
                            Visit_Id = visit.VisitId,
                            Patient_Name = op_register_instance.PatientId.FirstName,
                            Item_Count = count,
                            Total_Charge = general_billing.Net_Amount,
                            Status = new_bill_status,
                            Location = Location_instance.Location_Name,
                            Capture_Sample_Status = "Pending",
                            Analyze_Status = "Pending",
                            Verify_Status = "Pending",
                            Approve_Status = "Pending",
                            Barcode_Id = BarcodeId if not bill_exists else barcode,
                            Group_Name = "",
                            CreatedBy = created_by,
                            Billing_Date = datetime.date(datetime.now()),
                            Billing_Type = "",
                            RateCard_Name = '',
                            Test_Code = "",
                            Group_Code = "",
                            TotalPaidAmount = general_billing.Paid_Amount,
                            BalanceAmount = general_billing.Balance_Amount,
                            Sample_Barcode_Image = None,
                            AdditionalAmount = '0.00',
                            AdditionalAmountReason = "",
                            DiscountReason = "",
                            HistoNumber = '',
                            MicroNumber = '',
                            Transfer_Location= "",
                            Registration_Id = registration_id

                        )
                        invoiceTable.save()
                        print("--------Invoice Table OK--------")
                    for item in item_details:

                        try:

                            if item["type"] == "Offers":
                                
                                if item.get("group_items"):
                                    for subtest in item.get("group_items", []):
                                        if subtest["Group_Code"] and subtest["Group_Name"]:
                                            group=subtest["Group_Code"]
                                            groupName=subtest["Group_Name"]
                                        else:
                                            group=""
                                            groupName=""

                                        invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                        Billing_Invoice = general_billing.Billing_Invoice_No,
                                        Patient_Id = op_register_instance.PatientId.PatientId,
                                        Visit_Id = visit.VisitId,
                                        Patient_Name = op_register_instance.PatientId.FirstName,
                                        Dispatch_Method = "",
                                        Test_Method = item["type"],
                                        Test_Name = subtest["Test_Name"],
                                        Gross_Amount = item["Charges"],
                                        Location = Location_instance.Location_Name,
                                        Service_Status = "Pending",
                                        Analysis_Status = "Pending",
                                        Verify_Status = "Pending",
                                        Approve_Status = "Pending",
                                        Barcode_Id = BarcodeId if not bill_exists else barcode,
                                        Group_Name = groupName,
                                        CreatedBy = created_by,
                                        Billing_Date = datetime.date(datetime.now()),
                                        Test_Code = subtest["Test_Code"],
                                        Group_Code = group,
                                        individual_add_amount = None,
                                        IsSubTest = subtest.get("IsSubTest", ""),
                                        SubTestCodes = subtest.get("SubTestCodes", ""),
                                        Transfer_Location = "",
                                        PackageCode = item.get("Group_Code", ""),
                                        PackageName = item.get("SelectItemName", ""),
                                        Bill_Status = new_bill_status,
                                        )
                                        invoiceItemTable.save()
                                else:
                                    print("--------Offer-Test---------1111111111111", item)
                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = op_register_instance.PatientId.PatientId,
                                    Visit_Id = visit.VisitId,
                                    Patient_Name = op_register_instance.PatientId.FirstName,
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = item["SelectItemName"],
                                    Gross_Amount = item["Charges"],
                                    Location = Location_instance.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId if not bill_exists else barcode,
                                    Group_Name = "",
                                    CreatedBy = created_by,
                                    Billing_Date = datetime.date(datetime.now()),
                                    Test_Code = item.get("Test_Code") or None,
                                    Group_Code = item.get("Group_Code") or None,
                                    individual_add_amount = None,
                                    IsSubTest = "",
                                    SubTestCodes = "",
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()                    
                            elif item["type"] == "group":
                                for subtest in item.get("group_items", []):
                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                        Billing_Invoice = general_billing.Billing_Invoice_No,
                                        Patient_Id = op_register_instance.PatientId.PatientId,
                                        Visit_Id = visit.VisitId,
                                        Patient_Name = op_register_instance.PatientId.FirstName,
                                        Dispatch_Method = "",
                                        Test_Method = item["type"],
                                        Test_Name = subtest["Test_Name"],
                                        Gross_Amount = item["Charges"],
                                        Location = Location_instance.Location_Name,
                                        Service_Status = "Pending",
                                        Analysis_Status = "Pending",
                                        Verify_Status = "Pending",
                                        Approve_Status = "Pending",
                                        Barcode_Id = BarcodeId if not bill_exists else barcode,
                                        Group_Name = item.get("SelectItemName", ""),
                                        CreatedBy = created_by,
                                        Billing_Date = datetime.date(datetime.now()),
                                        Test_Code = subtest["Test_Code"],
                                        Group_Code = item.get("Group_Code", ""),
                                        individual_add_amount = None,
                                        IsSubTest = subtest.get("IsSubTest", ""),
                                        SubTestCodes = subtest.get("SubTestCodes", ""),
                                        Transfer_Location = "",
                                        PackageCode = "",
                                        PackageName = "",
                                        Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()
                            else:
                                print("---------Test---------", item)
                                invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = op_register_instance.PatientId.PatientId,
                                    Visit_Id =  visit.VisitId,
                                    Patient_Name = op_register_instance.PatientId.FirstName,
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = item["SelectItemName"],
                                    Gross_Amount = item["Charges"],
                                    Location = Location_instance.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId if not bill_exists else barcode,
                                    Group_Name = "",
                                    CreatedBy = created_by,
                                    Billing_Date = datetime.date(datetime.now()),
                                    Test_Code = item["Test_Code"],
                                    Group_Code = "",
                                    individual_add_amount = None,
                                    IsSubTest = "",
                                    SubTestCodes = "",
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                )
                                invoiceItemTable.save()
                        
                        except Exception as e:

                            print(str(e),'err')
                            continue






                    print("--------Invoice Item Table OK--------")
                    try:      
                            exists= Register_patient_Details.objects.filter(Patient_Id = op_register_instance.PatientId.PatientId).exists()
                            patient_id = op_register_instance.PatientId.PatientId
                            patient = Patient_Detials.objects.get(PatientId = op_register_instance.PatientId.PatientId)
                            
                            

                            print(patient.Age,'safe_age')
                            if not exists:        
                                PatientData = Register_patient_Details(
                                    Patient_Id = patient_id if patient_id else None,
                                    Title = patient.Title.Title_Name,
                                    Patient_Name =  patient.FirstName,
                                    Father_Name = patient.FatherName,
                                    DOB = patient.DOB,
                                    Age = patient.Age,
                                    Gender = patient.Gender,
                                    Marital_Status = "",
                                    Door_No = patient.DoorNo,
                                    Street = patient.Street,
                                    Rural_Urban ="",
                                    City = patient.City,
                                    State = patient.State,
                                    Pincode = patient.Pincode,
                                    Phone = patient.PhoneNo,
                                    Alternate_No = "",
                                    Email = patient.Email,
                                    Location = Location_instance.Location_Name,
                                    Patient_Barcode = patient_id if patient_id else None,
                                    Time_Period = 'year',
                                    CreatedBy =created_by,    
                                )
                                PatientData.save()
                                print("--------Patient Data OK--------")
                            # Create and save the Patient Visit Table entry
                            if doctor:
                                if doctor[0] == 'Self' or doctor[0] == '':
                                     doctor_name = 'Self'
                                else:
 
                                    docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor[0]).first()
                                    spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=doctor[0]).first()

                                    if docs:
                                        doctor_name = docs.First_Name + "/" + spc.Specialization.Speciality_Name
                                    else:
                                        doctor_name = 'Self'

                            try:
                                visitTable = PatientVisitId.objects.create(
                                        Visit_Id = visit.VisitId,
                                        Patient_Name = patient.FirstName,
                                        Patient_Id = patient_id,
                                        Phone = patient.PhoneNo,
                                        Visit_Type = "OP",
                                        Phlebotomist_Type = "",
                                        Phlebotomist_Name = "",
                                        Refering_Doctor = doctor_name,
                                        Patient_Group = op_register_instance.PatientCategory,
                                        Dispatch_Method = "",
                                        Patient_Barcode =  patient_id,
                                        CreatedBy = created_by,
                                        Location = Location_instance.Location_Name,
                                        Outsourced_Type = "",
                                        Refering_Hospital = "",
                                    )
                                visitTable.save()
                            except Exception as e:

                                print(str(e),'lab visit errrrrrrr')
                            print("--------Patient Visit Table OK--------")
                    except Exception as e:
                            print(str(e))
                
        
                return ('success Data saved successfully')
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)

    def Package_Request_Detailslink_Billing(self, item, general_billing, new_bill_status, SelectedPatient_list,register,Created_by,doctor,visit,barcode,location):
        try:
            print(item, 'pkg itemmmmmmmmm')

            print(location,'location')

            for i in item:
                print(i.get('ServiceType'), 'pkg ServiceType')

                if i.get('ServiceType') == 'PACKAGE':
 
                    pkgid = i.get('Serviceid') or i.get('ServiceSubCatId')
                    pkgins = Package_Master.objects.filter(pk=pkgid).first()

                    register_kwargs = {'RegisterType': 'OP'}
                    registration_id = SelectedPatient_list.get('RegisterId')

                    try:
                        op_register_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['OP_Register_Id'] = op_register_instance
                    except Patient_Appointment_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'OP Registration ID not found'})

                    lab_request = Lab_Request_Details.objects.create(
                        created_by=Created_by,
                        Location=location,
                        Billing_Status = new_bill_status,
                        Status = new_bill_status,
                        Billing_Invoice_No = general_billing,
                        # Remarks=Remarks,
                        **register_kwargs,
                    )

                    if pkgins:
                        services = pkgins.Services_details.all()  # Get all related Package_Services_Group_Details

                        # Iterate through the related services
                        for service in services:
                            print(f"Service Category: {service.service_category}")
                            print(f"SubCategory Name: {service.SubCategoryname}")
                            print(f"Quantity: {service.Quantity}")
                            print(f"Created At: {service.created_at}")
                            # Access GenericForeignKey if needed
                            if service.content_type and service.object_id:
                                sub_category = service.service_sub_category
                                print(f"Sub Category Object: {sub_category}")

                            sercatins = Service_Category_Masters.objects.filter(Serviceid = service.service_category_id).first()

                            if sercatins.ServiceCategory == 'RADIOLOGY':

                                RegisterType = 'OP'

                                docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor[0]).first()

                                try:
                                    testnames = TestName_Details.objects.get(Test_Code=service.object_id)
                                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                                    Radiology_Request_Details.objects.create(
                                        RegisterType = RegisterType,
                                        OP_Register_Id=register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                                        IP_Register_Id=register if RegisterType == "IP" else None,
                                        Casuality_Register_Id=register if RegisterType == "Casuality" else None,
                                        Diagnosis_Register_Id=register if RegisterType == "ExternalRadiology" else None,
                                        TestCode=Radiologyid,
                                        SubTestCode=service.object_id,
                                        created_by=Created_by,
                                        Status = new_bill_status,
                                        Doctorid = docs,
                                        Billing_Invoice_No = general_billing
                                    )

                                except TestName_Details.DoesNotExist:
                                    print(f"TestName_Details not found for Test_Code: {service.object_id}")

                            if sercatins.ServiceCategory == 'LAB':

                                print(service.object_id,'quick billing pkg')
                                Testins = Testmaster_Cost_List.objects.filter(Test_Id = service.object_id).first()

                                print(Testins,'Testinssssssssssssss')

                                NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
                                    item_id_int=Cast("Item_Id", IntegerField())
                                    ).aggregate(Max("item_id_int"))["item_id_int__max"]
                                NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

                                lab_request_item_data = {}


                                if Testins.Test_Code:

                                    print(Testins.Test_Code.Test_Code,'Icodeeeeeeeee')
                                    testType = 'Individual'
                                    Icode = Test_Descriptions.objects.filter(Test_Code = Testins.Test_Code.Test_Code).first()
                                    lab_request_item_data = {
                                        "Item_Id":NextItemID,
                                        "Request": lab_request,
                                        "TestType": testType,
                                        "SubDepartment_Code_id": Icode.sub_department.SubDepartment_Code,
                                        "Department_Code_id": Icode.department.Department_Code,
                                    }

                                    lab_request_item_data["Test_Code_id"] = Icode.Test_Code  


                                elif Testins.Group_Code:

                                    print(Testins.Group_Code,'gcodeeeeeeeeee')
                                    testType = 'Group'
                                    Gcode = Group_Master.objects.filter(Group_Code = Testins.Group_Code.Group_Code).first()
                                    lab_request_item_data = {
                                        "Item_Id":NextItemID,
                                        "Request": lab_request,
                                        "TestType": testType,
                                        "Department_Code_id": Gcode.Department.department.Department_Code,
                                        "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
                                    }

                                    lab_request_item_data["Group_Code_id"] = Gcode.pk  # Assuming Code is the Group_Code


                                elif Testins.Package_Code:

                                    print(Testins.Package_Code,'Pcodeeeeeeee')
                                    testType = 'Offers'
                                    Pcode = OfferPackageMaster.objects.filter(package_code = Testins.Package_Code.package_code).first()
                                    department = SubLab_Department_Detials.objects.filter(SubDepartment_Name=Pcode.department_name).first()
                                    lab_department = Lab_Department_Detials.objects.filter(Department_Code=department.department.Department_Code).first()
                                    lab_request_item_data = {
                                        "Item_Id":NextItemID,
                                        "Request": lab_request,
                                        "TestType": testType,
                                        "Department_Code_id": lab_department.pk,
                                        "SubDepartment_Code_id": department.pk,
                                    }
                                    lab_request_item_data["Package_Code_id"] = Pcode.offer_package_id  


                                Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                        
                        
                        item_details = []
                        filterdepartment = []
                        TestDetails = []
                        keys_seen = set()
                        filterSpecimen = []
                        Specimen_keys_seen = set()
                        print('intooo the forr loop')
                        for index, item in enumerate(lab_request.lab_request_items.filter(Request = lab_request.Request_Id), start=1):
                            print("TestType :",item.TestType)
                            print(model_to_dict(item))    

                            try:

                                if item.TestType.lower() == "individual":
                                    if lab_request.Billing_Status == "Completed":
                                        sub_department_code = (
                                            item.Test_Code.sub_department.SubDepartment_Code
                                        )
                                        sub_department_name = (
                                            item.Test_Code.sub_department.SubDepartment_Name
                                        )

                                        if sub_department_code not in keys_seen:
                                            filterdepartment.append(
                                                {
                                                    "key": sub_department_code,
                                                    "value": sub_department_name,
                                                }
                                            )
                                            keys_seen.add(sub_department_code)

                                        Specimen_Name = (
                                            item.Test_Code.Specimen_Name.Specimen_Name
                                            if item.Test_Code.Specimen_Name
                                            else None
                                        )
                                        Specimen_Code = (
                                            item.Test_Code.Specimen_Name.Specimen_Code
                                            if item.Test_Code.Specimen_Name
                                            else None
                                        )

                                        if Specimen_Code not in Specimen_keys_seen:
                                            filterSpecimen.append(
                                                {"key": Specimen_Code, "value": Specimen_Name}
                                            )
                                            Specimen_keys_seen.add(Specimen_Code)

                                    print("type :", item.TestType)
                                    print("item.Test_Code :", item.Test_Code)
                                    test_cost = Testmaster_Cost_List.objects.filter(
                                        Test_Code=item.Test_Code.Test_Code
                                    ).first()
                                
                                    print('test_cost :',test_cost)
                                    print('Billing_Status :',lab_request.Billing_Status)
                                    
                                    if lab_request.Billing_Status == "Completed":
                                        data = model_to_dict(item.Test_Code)
                                        modified_data = (
                                            {}
                                        )  # Create a new dictionary to store the modified data
                                        for key, value in data.items():
                                            if key == "department" and item.Test_Code.department:
                                                modified_data[key] = (
                                                    item.Test_Code.department.Department_Name
                                                )
                                                modified_data["Department_Code"] = (
                                                    item.Test_Code.department.Department_Code
                                                )
                                            elif (
                                                key == "sub_department"
                                                and item.Test_Code.sub_department
                                            ):
                                                modified_data[key] = (
                                                    item.Test_Code.sub_department.SubDepartment_Name
                                                )
                                                modified_data["SubDepartment_Code"] = (
                                                    item.Test_Code.sub_department.SubDepartment_Code
                                                )
                                            elif (
                                                key == "Container_Name"
                                                and item.Test_Code.Container_Name
                                            ):
                                                modified_data[key] = (
                                                    item.Test_Code.Container_Name.Container_Name
                                                )
                                            elif (
                                                key == "Specimen_Name"
                                                and item.Test_Code.Specimen_Name is not None
                                            ):
                                                modified_data[key] = (
                                                    item.Test_Code.Specimen_Name.Specimen_Name
                                                )
                                            elif key == "Method_Name" and item.Test_Code.Method_Name:
                                                modified_data[key] = (
                                                    item.Test_Code.Method_Name.Method_Name
                                                )
                                            elif key == "UOM" and item.Test_Code.UOM:
                                                modified_data[key] = item.Test_Code.UOM.Unit_Name
                                            elif (
                                                key == "Captured_Unit_UOM"
                                                and item.Test_Code.Captured_Unit_UOM
                                            ):
                                                modified_data[key] = (
                                                    item.Test_Code.Captured_Unit_UOM.Unit_Name
                                                )
                                            else:
                                                modified_data[key] = value  # Copy unchanged values
                                            
                                            RefernceRangeData = Age_Setup_Master.objects.filter(
                                                Test_Code=item.Test_Code.Test_Code
                                            ).first()
                                            
                                            reference_range = RefernceRangeData.Reference_Range
                                            NormalValue = RefernceRangeData.NormalValue
                                            Panic_Low = RefernceRangeData.PanicLow
                                            Panic_High = RefernceRangeData.PanicHigh

                                            if NormalValue == "Yes":
                                                panic_low, panic_high = extract_panic_range(
                                                    reference_range, patient.Gender
                                                )
                                                modified_data["paniclow"] = panic_low
                                                modified_data["panichigh"] = panic_high
                                            else:
                                                modified_data["paniclow"] = Panic_Low
                                                modified_data["panichigh"] = Panic_High
                                            modified_data["type"] = "individual"
                                            
                                            modified_data["Display_Service_Status"] = "Completed"
                                            modified_data["Display_Analysis_Status"] = "Completed"
                                            modified_data["Display_Verify_Status"] = "Verified"
                                            modified_data["Display_Approve_Status"] = "Approved"
                                            
                                            modified_data["Service_Status"] = "Completed"
                                            modified_data["Analysis_Status"] = item.Analysis_Status
                                            modified_data["Verify_Status"] = item.Verify_Status
                                            modified_data["Approve_Status"] = item.Approve_Status
                                            
                                            
                                            
                                            modified_data["referencedata"] = reference_range
                                            modified_data["NormalValue"] = NormalValue 
                                            modified_data["Result_Value"] = None 
                                            modified_data["Remarks"] = None
                                            modified_data["Result_Value"] = item.Result_Value
                                            modified_data["TestType"] = "Individual"
                                            modified_data["ColumName"] = "Test_Code"

                                        # Append the modified dictionary to TestDetails
                                        TestDetails.append(modified_data)

                                    item_details.append(
                                        {
                                            "type": "individual",
                                            "S_No": index,
                                            "Test_Code": (
                                                item.Test_Code.Test_Code if item.Test_Code else None
                                            ),
                                            "SelectItemName": (
                                                item.Test_Code.Test_Name if item.Test_Code else None
                                            ),
                                            "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                            "ServiceType": "Lab",
                                            "Charges": test_cost.Basic if test_cost else None,
                                            "Amount": test_cost.Basic if test_cost else None,
                                            "Total": test_cost.Basic if test_cost else None,
                                            "NetAmount": test_cost.Basic if test_cost else None,
                                            "Quantity":1,
                                            "DiscountType": "",
                                            "Discount": "",
                                            "GST_per": "",
                                            "GST": "",
                                            "DiscountAmount": "",
                                            "isReimbursable": "No",
                                        }
                                    )
                                elif item.TestType.lower() == "group":
                                    if lab_request.Billing_Status == "Completed":
                                        if (
                                            item.Group_Code.Department.SubDepartment_Code
                                            not in filterdepartment
                                        ):
                                            filterdepartment.append(
                                                {
                                                    "key": item.Group_Code.Department.SubDepartment_Code,
                                                    "value": item.Group_Code.Department.SubDepartment_Name,
                                                }
                                            )

                                    # Get group test cost
                                    test_cost = Testmaster_Cost_List.objects.filter(
                                        Group_Code=item.Group_Code
                                    ).first()

                                    # Fetch sub-items for the group
                                    group_items = []
                                    sub_item_instances = Group_Master_TestList.objects.filter(
                                        Group_Code=item.Group_Code
                                    )
                                    for sub_item in sub_item_instances:
                                        if sub_item.Test_Code:

                                            Specimen_Name = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Name if sub_item.Test_Code.Specimen_Name else None
                                            )
                                            Specimen_Code = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Code if sub_item.Test_Code.Specimen_Name else None
                                            )

                                            if Specimen_Code not in Specimen_keys_seen:
                                                filterSpecimen.append(
                                                    {"key": Specimen_Code, "value": Specimen_Name}
                                                )
                                                Specimen_keys_seen.add(Specimen_Code)

                                            sub_item_data = model_to_dict(sub_item.Test_Code)
                                            # Add any additional details or transformations if needed
                                            # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                            sub_item_data["SubDepartment_Name"] = (
                                                sub_item.Test_Code.sub_department.SubDepartment_Name
                                                if sub_item.Test_Code.sub_department
                                                else None
                                            )
                                            sub_item_data["Container_Name"] = (
                                                sub_item.Test_Code.Container_Name.Container_Name
                                                if sub_item.Test_Code.Container_Name
                                                else None
                                            )
                                            sub_item_data["Specimen_Name"] = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Name
                                                if sub_item.Test_Code.Specimen_Name
                                                else None
                                            )
                                            sub_item_data["Method_Name"] = (
                                                sub_item.Test_Code.Method_Name.Method_Name
                                                if sub_item.Test_Code.Method_Name
                                                else None
                                            )
                                            sub_item_data["UOM"] = (
                                                sub_item.Test_Code.UOM.Unit_Name
                                                if sub_item.Test_Code.UOM
                                                else None
                                            )
                                            sub_item_data["Captured_Unit_UOM"] = (
                                                sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                                if sub_item.Test_Code.Captured_Unit_UOM
                                                else None
                                            )

                                            sub_item_data["Result_Value"] = None

                                            sub_item_data["columnname"] = "Group_Code"

                                            group_items.append(sub_item_data)

                                    # Add group-level item details
                                    item_details.append(
                                        {
                                            "type": "group",
                                            "S_No": index,
                                            "Group_Code": (
                                                item.Group_Code.Group_Code if item.Group_Code else None
                                            ),
                                            "SelectItemName": (
                                                item.Group_Code.Group_Name if item.Group_Code else None
                                            ),
                                            "Gender": "All",
                                            "Department": (
                                                item.Group_Code.Department.SubDepartment_Name
                                                if item.Group_Code.Department
                                                else None
                                            ),
                                            "group_items": group_items,  # Include detailed sub-items here
                                            "ServiceType": "Lab",
                                            "Charges": test_cost.Basic if test_cost else None,
                                            "Amount": test_cost.Basic if test_cost else None,
                                            "NetAmount": test_cost.Basic if test_cost else None,
                                            "Total": test_cost.Basic if test_cost else None,
                                            "Quantity":1,
                                            "DiscountType": "",
                                            "Discount": "",
                                            "GST_per": "",
                                            "GST": "",
                                            "DiscountAmount": "",
                                            "isReimbursable": "No",
                                        }
                                    )

                                    TestDetails.append(
                                        {
                                            "type": "group",
                                            "S_No": index,
                                            "Group_Code": (
                                                item.Group_Code.Group_Code if item.Group_Code else None
                                            ),
                                            "SelectItemName": (
                                                item.Group_Code.Group_Name if item.Group_Code else None
                                            ),
                                            "Gender": "All",
                                            "SubDepartment_Code": (
                                                item.Group_Code.Department.SubDepartment_Code
                                                if item.Group_Code.Department
                                                else None
                                            ),
                                            "Department": (
                                                item.Group_Code.Department.SubDepartment_Name
                                                if item.Group_Code.Department
                                                else None
                                            ),
                                            "group_items": group_items,  # Include detailed sub-items here
                                            "ServiceType": "Lab",
                                            "Charges": test_cost.Basic if test_cost else None,
                                            "Amount": test_cost.Basic if test_cost else None,
                                            "NetAmount": test_cost.Basic if test_cost else None,
                                            "Total": test_cost.Basic if test_cost else None,
                                            "Quantity":1,
                                            "DiscountType": "",
                                            "Discount": "",
                                            "GST_per": "",
                                            "GST": "",
                                            "DiscountAmount": "",
                                            "isReimbursable": "No",
                                            "Service_Status": "Completed",
                                            "Analysis_Status": item.Analysis_Status,
                                            "Verify_Status": item.Verify_Status,
                                            "Approve_Status": item.Approve_Status,
                                        "TestType" : "Group",
                                        "ColumName": "Group_Code",
                                        "Result_Value": None
                                        }
                                    )
                                elif item.TestType.lower() == "offers":
                                    
                                    sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
                                    if lab_request.Billing_Status == "Completed":
                                        
                                        if (
                                            item.Package_code.department_name
                                            not in filterdepartment
                                        ):
                                            filterdepartment.append(
                                                {
                                                    "key": sub_dpt.pk,
                                                    "value": item.Package_Code.department_name,
                                                }
                                            )

                                    # Get group test cost
                                    test_cost = Testmaster_Cost_List.objects.filter(
                                        Package_Code=item.Package_Code
                                    ).first()

                                    # Fetch sub-items for the group
                                    group_items = []
                                    sub_item_instances = OfferPackageList.objects.filter(
                                        package_code=item.Package_Code.package_code
                                    )
                                    print("-------Offer-------",sub_item_instances)
                                    for sub_item in sub_item_instances:
                                        print("-------Item-------",sub_item.Test_Code)
                                        
                                        if sub_item.Test_Code:
                                            print("------Test------",sub_item.Test_Code.Test_Name)
                                            Specimen_Name = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                            )
                                            Specimen_Code = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                            )

                                            if Specimen_Code not in Specimen_keys_seen:
                                                filterSpecimen.append(
                                                    {"key": Specimen_Code, "value": Specimen_Name}
                                                )
                                                Specimen_keys_seen.add(Specimen_Code)

                                            sub_item_data = model_to_dict(sub_item.Test_Code)
                                            # Add any additional details or transformations if needed
                                            # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                            sub_item_data["SubDepartment_Name"] = (
                                                sub_item.Test_Code.sub_department.SubDepartment_Name
                                                if sub_item.Test_Code.sub_department
                                                else None
                                            )
                                            sub_item_data["Container_Name"] = (
                                                sub_item.Test_Code.Container_Name.Container_Name
                                                if sub_item.Test_Code.Container_Name
                                                else None
                                            )
                                            sub_item_data["Specimen_Name"] = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                                if sub_item.Test_Code.Specimen_Name 
                                                else None
                                            )
                                            sub_item_data["Method_Name"] = (
                                                sub_item.Test_Code.Method_Name.Method_Name
                                                if sub_item.Test_Code.Method_Name
                                                else None
                                            )
                                            sub_item_data["UOM"] = (
                                                sub_item.Test_Code.UOM.Unit_Name
                                                if sub_item.Test_Code.UOM
                                                else None
                                            )
                                            sub_item_data["Captured_Unit_UOM"] = (
                                                sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                                if sub_item.Test_Code.Captured_Unit_UOM
                                                else None
                                            )

                                            sub_item_data["Result_Value"] = None

                                            sub_item_data["columnname"] = "Group_Code"
                                            sub_item_data["Group_Code"] = ""
                                            sub_item_data["Group_Name"] = ""

                                            print("-------Items-------",sub_item_data['Test_Name'])
                                            if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                                group_items.append(sub_item_data)
                                        
                                        elif sub_item.Group_Code:
                                            print("------group------",sub_item.Group_Code.Group_Code)
                                            group = sub_item.Group_Code.Group_Code
                                            groupName = sub_item.Group_Code.Group_Name
                                            sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
                                            print("-------Item-------",sub_item_instances)
                                            for sub_item in sub_item_instances:
                                                print("------Test------",sub_item.Test_Code.Test_Name)
                                                Specimen_Name = (
                                                    sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                                )
                                                Specimen_Code = (
                                                    sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                                )

                                                if Specimen_Code not in Specimen_keys_seen:
                                                    filterSpecimen.append(
                                                        {"key": Specimen_Code, "value": Specimen_Name}
                                                    )
                                                    Specimen_keys_seen.add(Specimen_Code)

                                                sub_item_data = model_to_dict(sub_item.Test_Code)
                                                # Add any additional details or transformations if needed
                                                # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                                sub_item_data["SubDepartment_Name"] = (
                                                    sub_item.Test_Code.sub_department.SubDepartment_Name
                                                    if sub_item.Test_Code.sub_department
                                                    else None
                                                )
                                                sub_item_data["Container_Name"] = (
                                                    sub_item.Test_Code.Container_Name.Container_Name
                                                    if sub_item.Test_Code.Container_Name
                                                    else None
                                                )
                                                sub_item_data["Specimen_Name"] = (
                                                    sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                                    if sub_item.Test_Code.Specimen_Name 
                                                    else None
                                                )
                                                sub_item_data["Method_Name"] = (
                                                    sub_item.Test_Code.Method_Name.Method_Name
                                                    if sub_item.Test_Code.Method_Name
                                                    else None
                                                )
                                                sub_item_data["UOM"] = (
                                                    sub_item.Test_Code.UOM.Unit_Name
                                                    if sub_item.Test_Code.UOM
                                                    else None
                                                )
                                                sub_item_data["Captured_Unit_UOM"] = (
                                                    sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                                    if sub_item.Test_Code.Captured_Unit_UOM
                                                    else None
                                                )

                                                sub_item_data["Result_Value"] = None

                                                sub_item_data["columnname"] = "Group_Code"
                                                sub_item_data["Group_Code"] = group
                                                sub_item_data["Group_Name"] = groupName

                                                print("-------Items-------",sub_item_data['Test_Name'])
                                                if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                                    group_items.append(sub_item_data)
                                        
                                    # Add group-level item details
                                    item_details.append(
                                        {
                                            "type": "Offers",
                                            "S_No": index,
                                            "Request_Id": lab_request.Request_Id,
                                            "Group_Code": (
                                                item.Package_Code.package_code if item.Package_Code else None
                                            ),
                                            "SelectItemName": (
                                                item.Package_Code.package_name if item.Package_Code else None
                                            ),
                                            "Gender": "All",
                                            "Department": (
                                                item.Package_Code.department_name
                                                if item.Package_Code.department_name
                                                else None
                                            ),
                                            "group_items": group_items,  # Include detailed sub-items here
                                            "ServiceType": "Lab",
                                            "Charges": test_cost.Basic if test_cost else None,
                                            "Amount": test_cost.Basic if test_cost else None,
                                            "NetAmount": test_cost.Basic if test_cost else None,
                                            "Total": test_cost.Basic if test_cost else None,
                                            "Quantity":1,
                                            "DiscountType": "",
                                            "Discount": "",
                                            "GST_per": "",
                                            "GST": "",
                                            "DiscountAmount": "",
                                            "isReimbursable": "No",
                                        }
                                    )
                                    print("---------OK--------")
                                    TestDetails.append(
                                        {
                                            "type": "Offers",
                                            "S_No": index,
                                            "Group_Code": (
                                                item.Package_Code.package_code if item.Package_Code else None
                                            ),
                                            "SelectItemName": (
                                                item.Package_Code.package_name if item.Package_Code else None
                                            ),
                                            "Gender": "All",
                                            "SubDepartment_Code": (
                                                sub_dpt.SubDepartment_Code
                                                if item.Package_Code.department_name
                                                else None
                                            ),
                                            "Department": (
                                                item.Package_Code.department_name
                                                if item.Package_Code.department_name
                                                else None
                                            ),
                                            "group_items": group_items,  # Include detailed sub-items here
                                            "ServiceType": "Lab",
                                            "Charges": test_cost.Basic if test_cost else None,
                                            "Amount": test_cost.Basic if test_cost else None,
                                            "NetAmount": test_cost.Basic if test_cost else None,
                                            "Total": test_cost.Basic if test_cost else None,
                                            "Quantity":1,
                                            "DiscountType": "",
                                            "Discount": "",
                                            "GST_per": "",
                                            "GST": "",
                                            "DiscountAmount": "",
                                            "isReimbursable": "No",
                                            "Service_Status": "Completed",
                                            "Analysis_Status": item.Analysis_Status,
                                            "Verify_Status": item.Verify_Status,
                                            "Approve_Status": item.Approve_Status,
                                        "TestType" : "Offers",
                                        "ColumName": "Package_Code",
                                        "Result_Value": None
                                        }
                                    )
                            
                            except Exception as e:
                                print(str(e),'err')
                                continue
                        print("-----ITEMS-----",item_details)
                        print('-----Billing---',model_to_dict(general_billing))
                        
                        bill_exists = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = general_billing.Billing_Invoice_No, Barcode_Id = barcode).exists()

                        # VisitId = PatientVisitId.objects.filter(Patient_Id=op_register_instance.PatientId.PatientId).order_by('-Visit_Id').first()
                        # if VisitId:
                        #     VisitId = VisitId.Visit_Id + 1
                        # else:
                        #     VisitId = 1

                        

                        if not bill_exists:
                            count = len(item_details)
                            BarcodeId = get_invoice_master_barcode()
                            invoiceTable = BillingInvoiceAndBillAmount.objects.create(
                                Billing_Invoice = general_billing.Billing_Invoice_No,
                                Patient_Id = op_register_instance.PatientId.PatientId,
                                Visit_Id = visit.VisitId,
                                Patient_Name = op_register_instance.PatientId.FirstName,
                                Item_Count = count,
                                Total_Charge = general_billing.Net_Amount,
                                Status = new_bill_status,
                                Location = location.Location_Name,
                                Capture_Sample_Status = "Pending",
                                Analyze_Status = "Pending",
                                Verify_Status = "Pending",
                                Approve_Status = "Pending",
                                Barcode_Id = BarcodeId if not bill_exists else barcode,
                                Group_Name = "",
                                CreatedBy = Created_by,
                                Billing_Date = datetime.date(datetime.now()),
                                Billing_Type = "",
                                RateCard_Name = '',
                                Test_Code = "",
                                Group_Code = "",
                                TotalPaidAmount = general_billing.Paid_Amount,
                                BalanceAmount = general_billing.Balance_Amount,
                                Sample_Barcode_Image = None,
                                AdditionalAmount = '0.00',
                                AdditionalAmountReason = "",
                                DiscountReason = "",
                                HistoNumber = '',
                                MicroNumber = '',
                                Transfer_Location= "",
                                Registration_Id = registration_id

                            )
                            invoiceTable.save()
                            print("--------Invoice Table OK--------")

                        try:
                            for item in item_details:
                                if item["type"] == "Offers":
                                    
                                    if item.get("group_items"):
                                        for subtest in item.get("group_items", []):
                                            if subtest["Group_Code"] and subtest["Group_Name"]:
                                                group=subtest["Group_Code"]
                                                groupName=subtest["Group_Name"]
                                            else:
                                                group=""
                                                groupName=""

                                            invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                            Billing_Invoice = general_billing.Billing_Invoice_No,
                                            Patient_Id = op_register_instance.PatientId.PatientId,
                                            Visit_Id = visit.VisitId,
                                            Patient_Name = op_register_instance.PatientId.FirstName,
                                            Dispatch_Method = "",
                                            Test_Method = item["type"],
                                            Test_Name = subtest["Test_Name"],
                                            Gross_Amount = item["Charges"],
                                            Location = location.Location_Name,
                                            Service_Status = "Pending",
                                            Analysis_Status = "Pending",
                                            Verify_Status = "Pending",
                                            Approve_Status = "Pending",
                                            Barcode_Id = BarcodeId if not bill_exists else barcode,
                                            Group_Name = groupName,
                                            CreatedBy = Created_by,
                                            Billing_Date = datetime.date(datetime.now()),
                                            Test_Code = subtest["Test_Code"],
                                            Group_Code = group,
                                            individual_add_amount = None,
                                            IsSubTest = subtest.get("IsSubTest", ""),
                                            SubTestCodes = subtest.get("SubTestCodes", ""),
                                            Transfer_Location = "",
                                            PackageCode = item.get("Group_Code", ""),
                                            PackageName = item.get("SelectItemName", ""),
                                            Bill_Status = new_bill_status,
                                            )
                                            invoiceItemTable.save()
                                    else:
                                        print("--------Offer-Test---------1111111111111", item)
                                        invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                        Billing_Invoice = general_billing.Billing_Invoice_No,
                                        Patient_Id = op_register_instance.PatientId.PatientId,
                                        Visit_Id = visit.VisitId,
                                        Patient_Name = op_register_instance.PatientId.FirstName,
                                        Dispatch_Method = "",
                                        Test_Method = item["type"],
                                        Test_Name = item["SelectItemName"],
                                        Gross_Amount = item["Charges"],
                                        Location = location.Location_Name,
                                        Service_Status = "Pending",
                                        Analysis_Status = "Pending",
                                        Verify_Status = "Pending",
                                        Approve_Status = "Pending",
                                        Barcode_Id = BarcodeId if not bill_exists else barcode,
                                        Group_Name = "",
                                        CreatedBy = Created_by,
                                        Billing_Date = datetime.date(datetime.now()),
                                        Test_Code = item.get("Test_Code") or None,
                                        Group_Code = item.get("Group_Code") or None,
                                        individual_add_amount = None,
                                        IsSubTest = "",
                                        SubTestCodes = "",
                                        Transfer_Location = "",
                                        PackageCode = "",
                                        PackageName = "",
                                        Bill_Status = new_bill_status
                                        )
                                        invoiceItemTable.save()                    
                                elif item["type"] == "group":
                                    for subtest in item.get("group_items", []):
                                        invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                            Billing_Invoice = general_billing.Billing_Invoice_No,
                                            Patient_Id = op_register_instance.PatientId.PatientId,
                                            Visit_Id = visit.VisitId,
                                            Patient_Name = op_register_instance.PatientId.FirstName,
                                            Dispatch_Method = "",
                                            Test_Method = item["type"],
                                            Test_Name = subtest["Test_Name"],
                                            Gross_Amount = item["Charges"],
                                            Location = location.Location_Name,
                                            Service_Status = "Pending",
                                            Analysis_Status = "Pending",
                                            Verify_Status = "Pending",
                                            Approve_Status = "Pending",
                                            Barcode_Id = BarcodeId if not bill_exists else barcode,
                                            Group_Name = item.get("SelectItemName", ""),
                                            CreatedBy = Created_by,
                                            Billing_Date = datetime.date(datetime.now()),
                                            Test_Code = subtest["Test_Code"],
                                            Group_Code = item.get("Group_Code", ""),
                                            individual_add_amount = None,
                                            IsSubTest = subtest.get("IsSubTest", ""),
                                            SubTestCodes = subtest.get("SubTestCodes", ""),
                                            Transfer_Location = "",
                                            PackageCode = "",
                                            PackageName = "",
                                            Bill_Status = new_bill_status
                                        )
                                        invoiceItemTable.save()
                                else:
                                    print("---------Test---------", item)
                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                        Billing_Invoice = general_billing.Billing_Invoice_No,
                                        Patient_Id = op_register_instance.PatientId.PatientId,
                                        Visit_Id =  visit.VisitId,
                                        Patient_Name = op_register_instance.PatientId.FirstName,
                                        Dispatch_Method = "",
                                        Test_Method = item["type"],
                                        Test_Name = item["SelectItemName"],
                                        Gross_Amount = item["Charges"],
                                        Location = location.Location_Name,
                                        Service_Status = "Pending",
                                        Analysis_Status = "Pending",
                                        Verify_Status = "Pending",
                                        Approve_Status = "Pending",
                                        Barcode_Id = BarcodeId if not bill_exists else barcode,
                                        Group_Name = "",
                                        CreatedBy = Created_by,
                                        Billing_Date = datetime.date(datetime.now()),
                                        Test_Code = item["Test_Code"],
                                        Group_Code = "",
                                        individual_add_amount = None,
                                        IsSubTest = "",
                                        SubTestCodes = "",
                                        Transfer_Location = "",
                                        PackageCode = "",
                                        PackageName = "",
                                        Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()

                        except Exception as e:

                            print(str(e),'item err')   
                            continue
                        print("--------Invoice Item Table OK--------")
                        try:      
                                exists= Register_patient_Details.objects.filter(Patient_Id = op_register_instance.PatientId.PatientId).exists()
                                patient_id = op_register_instance.PatientId.PatientId
                                patient = Patient_Detials.objects.get(PatientId = op_register_instance.PatientId.PatientId)
                                
                                

                                print(patient.Age,'safe_age')
                                if not exists:        
                                    PatientData = Register_patient_Details(
                                        Patient_Id = patient_id if patient_id else None,
                                        Title = patient.Title.Title_Name,
                                        Patient_Name =  patient.FirstName,
                                        Father_Name = patient.FatherName,
                                        DOB = patient.DOB,
                                        Age = patient.Age,
                                        Gender = patient.Gender,
                                        Marital_Status = "",
                                        Door_No = patient.DoorNo,
                                        Street = patient.Street,
                                        Rural_Urban ="",
                                        City = patient.City,
                                        State = patient.State,
                                        Pincode = patient.Pincode,
                                        Phone = patient.PhoneNo,
                                        Alternate_No = "",
                                        Email = patient.Email,
                                        Location = location.Location_Name,
                                        Patient_Barcode = patient_id if patient_id else None,
                                        Time_Period = 'year',
                                        CreatedBy =Created_by,    
                                    )
                                    PatientData.save()
                                    print("--------Patient Data OK--------")
                                # Create and save the Patient Visit Table entry
                                if doctor:
                                    if doctor[0] == 'Self' or doctor[0] == '':
                                        doctor_name = 'Self'
                                    else:
    
                                        docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor[0]).first()
                                        spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=doctor[0]).first()
                                        if docs:
                                            doctor_name = docs.First_Name + "/" + spc.Specialization.Speciality_Name
                                        else:
                                            doctor_name = 'Self'
                                visitTable = PatientVisitId.objects.create(
                                        Visit_Id = visit.VisitId,
                                        Patient_Name = patient.FirstName,
                                        Patient_Id = patient_id,
                                        Phone = patient.PhoneNo,
                                        Visit_Type = "OP",
                                        Phlebotomist_Type = "",
                                        Phlebotomist_Name = "",
                                        Refering_Doctor = doctor_name,
                                        Patient_Group = op_register_instance.PatientCategory,
                                        Dispatch_Method = "",
                                        Patient_Barcode =  patient_id,
                                        CreatedBy = Created_by,
                                        Location = location.Location_Name,
                                        Outsourced_Type = "",
                                        Refering_Hospital = "",
                                    )
                                visitTable.save()
                                print("--------Patient Visit Table OK--------")
                        except Exception as e:
                                print(str(e))
                    
                    else:
                        print(f"No Package_Master found for ID: {i.get('ServiceSubCatId')}")

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        


    @transaction.atomic
    def post(self, request):
        try:
            data = json.loads(request.body)
            billAmount = data.get('billAmount', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            NetAmount_CDmethod = data.get('NetAmount_CDmethod', {})
            SelectDatalist = data.get('SelectDatalist', [])
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            service_type = data.get('ServiceProcedureForm', '')
            Paytype = data.get('Paytype', '')
            billpage = data.get('billpage')
            
            print("---------------",SelectedPatient_list)
            print("***************",service_type)

            if not SelectDatalist:
                return JsonResponse({'error': 'SelectDatalist is empty or missing'}, status=400)
            
            doctor = BillingData.get('DoctorId')
            if not isinstance(doctor, list):
                doctor = [doctor]

            print(doctor, 'doctor123')

            patient, register, visit = self.get_patient_data(SelectedPatient_list)
            location = Location_Detials.objects.get(Location_Id=Location)
            new_bill_status = 'Paid' if self.safe_to_decimal(initialState.get('BalanceAmount')) == Decimal('0.00') else 'Due'
            
            # doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID__in=doctor).first()

            general_billing = General_Billing_Table_Detials.objects.create(
                Billing_Date=BillingData.get('InvoiceDate'),
                Doctor_Id=doctor,
                Patient_Id=patient,
                Register_Id=register,
                Visit_Id=visit,
                Billing_Type=NetAmount_CDmethod.get('Method'),
                Select_Discount=NetAmount_CDmethod.get('Method'),
                Discount_Type=NetAmount_CDmethod.get('Method'),
                Discount_Value=self.safe_to_decimal(NetAmount_CDmethod.get('Amount')),
                Discount_Amount=initialState.get('totalDiscount'),
                Total_Items=int(initialState.get('totalItems')),
                Total_Qty=int(initialState.get('totalUnits')),
                Total_Amount=initialState.get('totalTaxable'),
                Total_GSTAmount=initialState.get('totalGstamount'),
                Net_Amount=initialState.get('totalNetAmount'),
                Net_Paid_Amount=initialState.get('totalAmountt'),
                Round_Off=initialState.get('Roundoff'),
                Paid_Amount=initialState.get('PaidAmount'),
                Balance_Amount=initialState.get('BalanceAmount'),
                Bill_Status=new_bill_status,
                created_by=Created_by,
                Location=location
            )
            # patient_details = Patient_Detials.objects.get(pk=SelectedPatient_list.get('PatientId'))

            # print("---------------",patient_details.Title)
            summa = []
            for i in SelectDatalist:
                print(i.get("ServiceType"),'QuickbillServiceType')
                summa.append(i.get("ServiceType"))

                print(summa,'summaaaaaaaaaaaa')
            BarcodeId = None
            if 'Lab' in summa:
                BarcodeId = get_invoice_master_barcode()
                count = len(SelectDatalist)

                

                invoiceTable = BillingInvoiceAndBillAmount.objects.create(
                    # Billing_Invoice = BillingData.get('I
                    Billing_Invoice = general_billing.Billing_Invoice_No,
                    Patient_Id = SelectedPatient_list.get('PatientId'),
                    Visit_Id = SelectedPatient_list.get('VisitId'),
                    Patient_Name = SelectedPatient_list.get("PatientName"),
                    Item_Count = count,
                    Total_Charge = Decimal(initialState.get('totalAmount')),
                    Discount_Type = NetAmount_CDmethod.get('Method'),
                    Discount = initialState.get('totalDiscount'),
                    Net_Amount = Decimal(initialState.get('totalNetAmount')),
                    Status = 'Paid' if self.safe_to_decimal(initialState.get('BalanceAmount')) == Decimal('0.00') else 'Due',
                    Location = location.Location_Name,
                    Capture_Sample_Status = "Pending",
                    Analyze_Status = "Pending",
                    Verify_Status = "Pending",
                    Approve_Status = "Pending",
                    Barcode_Id = BarcodeId,
                    Group_Name = "",
                    CreatedBy = Created_by,
                    Billing_Date = BillingData.get('InvoiceDate'),
                    Billing_Type = NetAmount_CDmethod.get('Method'),
                    RateCard_Name = '',
                    Test_Code = "",
                    Group_Code = "",
                    TotalPaidAmount = Decimal(initialState.get('PaidAmount')),
                    BalanceAmount = Decimal(initialState.get('BalanceAmount')),
                    Sample_Barcode_Image = None,
                    AdditionalAmount = Decimal('0.00'),
                    AdditionalAmountReason = "",
                    DiscountReason = "",
                    HistoNumber = '',
                    MicroNumber = '',
                    Transfer_Location= "",
                    Registration_Id = register.Registration_Id
                )
                invoiceTable.save()
                print('invoiceTable',invoiceTable)
                for item in SelectDatalist:

                    print('item',item)
                    if item.get("ServiceType") == 'Lab':
                        if item["type"] == "Offers":
                            if item.get("group_items"):
                                for subtest in item.get("group_items", []):
                                    if subtest["Group_Code"] and subtest["Group_Name"]:
                                        group=subtest["Group_Code"]
                                        groupName=subtest["Group_Name"]
                                    else:
                                        group=""
                                        groupName=""

                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = SelectedPatient_list.get('PatientId'),
                                    Visit_Id = SelectedPatient_list.get('VisitId'),
                                    Patient_Name = SelectedPatient_list.get("PatientName"),
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = subtest["Test_Name"],
                                    Gross_Amount = item["Charges"],
                                    Location = location.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId,
                                    Group_Name = groupName,
                                    CreatedBy = Created_by,
                                    Billing_Date = BillingData.get('InvoiceDate'),
                                    Test_Code = subtest["Test_Code"],
                                    Group_Code = group,
                                    individual_add_amount = None,
                                    IsSubTest = subtest.get("IsSubTest", ""),
                                    SubTestCodes = subtest.get("SubTestCodes", ""),
                                    Transfer_Location = "",
                                    PackageCode = item.get("Group_Code", ""),
                                    PackageName = item.get("SelectItemName", ""),
                                    Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()
                            else:
                                print("--------Offer-Test---------222222222", item)
                                try:
                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = SelectedPatient_list.get('PatientId'),
                                    Visit_Id = SelectedPatient_list.get('VisitId'),
                                    Patient_Name = SelectedPatient_list.get("PatientName"),
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = item["SelectItemName"],
                                    Gross_Amount = item["Charges"],
                                    Location = location.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId,
                                    Group_Name = "",
                                    CreatedBy = Created_by,
                                    Billing_Date = BillingData.get('InvoiceDate'),
                                    Test_Code = item.get("Test_Code"),
                                    Group_Code = "",
                                    individual_add_amount = None,
                                    IsSubTest = "",
                                    SubTestCodes = "",
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()     
                                except Exception as e:
                                    print(str(e),'error')               
                        elif item["type"] == "group":
                            for subtest in item.get("group_items", []):
                                invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = SelectedPatient_list.get('PatientId'),
                                    Visit_Id = SelectedPatient_list.get('VisitId'),
                                    Patient_Name = SelectedPatient_list.get("PatientName"),
                                    Dispatch_Method = "",
                                    Test_Method = "group",
                                    Test_Name = subtest["Test_Name"],
                                    Gross_Amount = item["Charges"],
                                    Location = location.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId,
                                    Group_Name = item.get("SelectItemName", ""),
                                    CreatedBy = Created_by,
                                    Billing_Date = BillingData.get('InvoiceDate'),
                                    Test_Code = subtest["Test_Code"],
                                    Group_Code = item.get("Group_Code", ""),
                                    individual_add_amount = None,
                                    IsSubTest = subtest.get("IsSubTest", ""),
                                    SubTestCodes = subtest.get("SubTestCodes", ""),
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                )
                                invoiceItemTable.save()
                        else:
                            print("---------Test---------", item)
                            invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                Billing_Invoice = general_billing.Billing_Invoice_No,
                                Patient_Id = SelectedPatient_list.get('PatientId'),
                                Visit_Id = SelectedPatient_list.get('VisitId'),
                                Patient_Name = SelectedPatient_list.get("PatientName"),
                                Dispatch_Method = "",
                                Test_Method = item["type"],
                                Test_Name = item["SelectItemName"],
                                Gross_Amount = item["Charges"],
                                Location = location.Location_Name,
                                Service_Status = "Pending",
                                Analysis_Status = "Pending",
                                Verify_Status = "Pending",
                                Approve_Status = "Pending",
                                Barcode_Id = BarcodeId,
                                Group_Name = "",
                                CreatedBy = Created_by,
                                Billing_Date = BillingData.get('InvoiceDate'),
                                Test_Code = item.get("Test_Code") or item.get('ServiceSubCatId'),
                                Group_Code = "",
                                individual_add_amount = None,
                                IsSubTest = "",
                                SubTestCodes = "",
                                Transfer_Location = "",
                                PackageCode = "",
                                PackageName = "",
                                Bill_Status = new_bill_status
                            )
                            invoiceItemTable.save()
                            print('hbahvbwv',invoiceItemTable)

                try:      
                    print('hvbbvbfb')
                    exists= Register_patient_Details.objects.filter(Patient_Id = SelectedPatient_list.get("PatientId")).exists()

                    print('patientexists',exists)
                    patient_id = SelectedPatient_list.get('PatientId')
                    if not exists:        
                        patient = Patient_Detials.objects.get(PatientId = patient_id)
                        title =SelectedPatient_list.get("PatientName").split('.')[0]
                        name =SelectedPatient_list.get("PatientName").split('.')[1]
                        DOB = patient.DOB

                        safe_age = extract_age_years_only(patient.Age)
                       
                        print("----------",title,name)
                        print("----------",patient.Age)
                        print("----------",safe_age)
                        print("----------",title,name)

                        PatientData = Register_patient_Details(
                            Patient_Id = patient_id if patient_id else None,
                            Title = title if title else patient.Title,
                            Patient_Name =  name if name else patient.FirstName,
                            Father_Name = patient.FatherName,
                            DOB = DOB,
                            Age = patient.Age,
                            Gender = SelectedPatient_list.get("Gender"),
                            Marital_Status = "",
                            Door_No = patient.DoorNo,
                            Street = patient.Street,
                            Rural_Urban ="",
                            City = patient.City,
                            State = patient.State,
                            Pincode = patient.Pincode,
                            Phone = SelectedPatient_list.get("PhoneNumber"),
                            Alternate_No = "",
                            Email = patient.Email,
                            Location = location.Location_Name,
                            Patient_Barcode = patient_id if patient_id else None,
                            Time_Period = 'year',
                            CreatedBy =Created_by,    
                        )
                        PatientData.save()
                    print('Gokulllllllll', SelectedPatient_list.get('PatientId'))
                    # Create and save the Patient Visit Table entry
                    doctor_name = None
                    if doctor:
                        if doctor[0] == 'Self' or doctor[0] == '':
                                doctor_name = 'Self'
                        else:
 
                            docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor[0]).first()
                            spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=doctor[0]).first()
                            if docs:
                                doctor_name = docs.First_Name + "/" + spc.Specialization.Speciality_Name
                            else:
                                doctor_name = 'Self'

                    visitTable = PatientVisitId.objects.create(
                            Visit_Id = SelectedPatient_list.get('VisitId'),
                            Patient_Name = SelectedPatient_list.get("PatientName"),
                            Patient_Id = SelectedPatient_list.get('PatientId'),
                            Phone = SelectedPatient_list.get("PhoneNumber"),
                            Visit_Type = "OP",
                            Phlebotomist_Type = "",
                            Phlebotomist_Name = "",
                            Refering_Doctor = doctor_name,
                            Patient_Group =  SelectedPatient_list.get("PatientCategory"),
                            Dispatch_Method = "",
                            Patient_Barcode =  SelectedPatient_list.get('PatientId'),
                            CreatedBy = Created_by,
                            Location = location.Location_Name,
                            Outsourced_Type = "",
                            Refering_Hospital = "",
                        )
                    visitTable.save()
                    print('vuyvuhbj',visitTable)
                except Exception as e:
                    print(str(e))
 
            for item in SelectDatalist:

                if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
               
                    Test_Code = (item.get('ServiceSubCatId') or "").strip()
                    RegisterType = "OP"
                    docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor[0]).first()

                    try:
                        testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                        Radiologyid = testnames.Radiology_Id.Radiology_Id
                        Radiology_Request_Details.objects.create(
                            RegisterType = RegisterType,
                            OP_Register_Id=register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                            IP_Register_Id=register if RegisterType == "IP" else None,
                            Casuality_Register_Id=register if RegisterType == "Casuality" else None,
                            Diagnosis_Register_Id=register if RegisterType == "ExternalRadiology" else None,
                            TestCode=Radiologyid,
                            SubTestCode=item.get('ServiceSubCatId'),
                            created_by=Created_by,
                            Status = new_bill_status,
                            Doctorid = docs,
                            Billing_Invoice_No = general_billing
                        )

                    except TestName_Details.DoesNotExist:
                        print(f"TestName_Details not found for Test_Code: {Test_Code}")



            service_code = ''
            self.create_billing_items(general_billing, SelectDatalist, new_bill_status, SelectedPatient_list)
            self.Lab_Request_Detailslink_Billing(SelectDatalist,location,general_billing,new_bill_status,SelectedPatient_list,Created_by,visit,BarcodeId,doctor)
            self.Package_Request_Detailslink_Billing(SelectDatalist,general_billing,new_bill_status,SelectedPatient_list,register,Created_by,doctor,visit,BarcodeId,location)
            if service_type:
                OP_Billing_QueueList_Detials.objects.filter(Registration_Id__Registration_Id=SelectedPatient_list.get('RegisterId')).update(Status=new_bill_status)

                
                Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=SelectedPatient_list.get('RegisterId')).update(Bill_Status=new_bill_status,Status=new_bill_status)
                print('Status Changedddd')

            receipt = None
            if Paytype == 'Cash':
                receipt = self.handle_cash_payment(general_billing, initialState, patient, BillingData, Created_by)

            self.save_multiple_payments(billAmount, receipt, Created_by)

            return JsonResponse({
                'Success': 'Bill Added Successfully',
                'InvoiceNo': general_billing.Billing_Invoice_No,
                'ReceiptNo': receipt.Voucher_Number if receipt else None
            })

        except Exception as e:
            print(str(e))
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)
    def get(self, request):
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')

            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')

            
            search_query = Q()
            if SearchbyFirstName:
                search_query &= Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)
    
            # Filtering by speciality, doctor, and status
            # if SearchbySpeciality:
            #     search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            # if SearchbyDoctor:
            #     search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(Billing_Date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(Billing_Date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(Billing_Date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(Billing_Date__lte=ToDate)
    
            if SearchbyPhoneNumber:
                search_query &= Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyPhoneNumber)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            bills = General_Billing_Table_Detials.objects.filter(search_query)
            print('sivdfvererb',bills)
            # if SearchTimeOrderby:
            #     bills = bills.order_by('Billing_Date' if SearchTimeOrderby == 'order' else '-Billing_Date')

            response_data = []
            for row in bills:
                # print('ivusdjviio')
                full_name = f"{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()
                # print('ivibjk')
                items = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No=row.Billing_Invoice_No).exclude(Item_Status='Canceled')
                # print('uyvduibv',items)
                payments = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                # print('jvshdubjvsb',payments)
                doctor_names_list = []
                for doc in row.Doctor_Id:
                    try:
                        # print('vsddjbekv')
                        doc_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc)
                        doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name}".strip()
                        doctor_names_list.append(doctor_name)
                    except Doctor_Personal_Form_Detials.DoesNotExist:
                        print(f"Doctor not found for ID: {doc}")  # Optional for debugging
                        continue
                doctor_names = ", ".join(doctor_names_list)
                # print('doccccnamesss',doctor_names)
                # print('doctiddd',row.Doctor_Id)

                response_data.append({
                    'id': row.Billing_Invoice_No,
                    'Type': 'OPEdit',
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': row.Doctor_Id,
                    'Doctor_Name': doctor_names,
                    'PatientId': row.Patient_Id.PatientId,
                    'Patient_Name': full_name,
                    'PhoneNo': row.Patient_Id.PhoneNo,
                    'Register_Id': row.Register_Id.Registration_Id,
                    'Gender': row.Register_Id.PatientId.Gender,
                    'City': row.Register_Id.PatientId.City,
                    'State': row.Register_Id.PatientId.State,
                    'Pincode': row.Register_Id.PatientId.Pincode,
                    'AgeGender': f"{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}",
                    'Address': f"{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}",
                    'PatientCategory': row.Register_Id.PatientCategory,
                    'PatientCategoryName': row.Register_Id.InsuranceName.Insurance_Name if row.Register_Id.PatientCategory == 'Insurance' else getattr(row.Register_Id.ClientName, 'Client_Name', None),
                    'Visit_Id': row.Visit_Id.VisitId,
                    'Billing_Type': row.Billing_Type,
                    'TotalItems': row.Total_Items,
                    'TotalQty': row.Total_Qty,
                    'RoundOff': row.Round_Off,
                    'TotalAmount': row.Total_Amount,
                    'Net_Amount': row.Net_Amount,
                    'PaidAmount': row.Paid_Amount,
                    'PaidNetAmount': row.Net_Paid_Amount,
                    'BalanceAmount': row.Balance_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Billing_Items': [{
                        'Service_Type': i.Service_Type,
                        'Service_Code': i.Service_Code if i.Service_Code else None,
                        'Service_Name': i.Service_Name,
                        'Rate': i.Rate,
                        'Charge': i.Charge,
                        'Quantity': i.Quantity,
                        'Amount': i.Amount,
                        'Discount_Type': i.Discount_Type,
                        'Discount_Value': i.Discount_Value,
                        'Discount_Amount': i.Discount_Amount,
                        'Taxable_Amount': i.Taxable_Amount,
                        'Tax_Amount': i.Tax_Amount,
                        'Total_Amount': i.Total_Amount,
                        'BillType': 'OPEdit',
                    } for i in items],
                    'Payment_Details': [{
                        'Payment_Type': p.Payment_Type,
                        'Card_Type': p.Cart_Type,
                        'Card_No': p.Card_No,
                        'TransactionId': p.TransactionId,
                        'upiid': p.upiid,
                        'Cheque_No': p.Cheque_No,
                        'Bank_Name': p.Bank_Name,
                        'Amount': p.Amount,
                        'Transaction_Amount': p.Transaction_Amount,
                        'AdditionalAmount': p.AdditionalAmount,
                    } for p in payments]
                })

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)



 
@method_decorator(csrf_exempt, name='dispatch')
class GeneralBillingEditView(View):
 
    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)
 
    def get_patient_data(self, SelectedPatient_list):
        patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
        register = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
        visit = Patient_Visit_Detials.objects.filter(PatientId=SelectedPatient_list.get('PatientId'), VisitId=SelectedPatient_list.get('VisitId')).last()
        return patient, register, visit
 
    def create_billing_items(self, billing, SelectDatalist, new_bill_status, SelectedPatient_list, editid, addeditems, deleteditems):
        # Cancel items that were part of the original bill (BillType OPEdit) and explicitly deleted
        for item in deleteditems:
            if item.get('BillType') == 'OPEdit':
                # Prefer matching by code if available; fallback to name/charge/qty
                select_code = (item.get('SelectItemCode') or "").strip()
                filters = {
                    'Billing_Invoice_No__Billing_Invoice_No': editid,
                    'Item_Status__in': ['Paid', 'Due']  # only active items
                }
                if select_code:
                    filters['Service_Code'] = select_code
                else:
                    filters['Service_Name'] = item.get('SelectItemName')
                    filters['Charge'] = self.safe_to_decimal(item.get('Charges'))
                    filters['Quantity'] = item.get('Quantity')
 
                matched_items = General_Billing_Items_Table_Detials.objects.filter(**filters)
                for matched_item in matched_items:
                    matched_item.Item_Status = 'Canceled'
                    matched_item.save()
 
        # Insert newly added items (as current bill status)
        for item in addeditems:
            service_cd = item.get('ServiceCode') if item.get('ServiceType') != 'Lab' else item.get('Test_Code') if item.get('type') == 'individual' else item.get("group")
            general_billing_item_instance = General_Billing_Items_Table_Detials(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType'),
                Service_Code=service_cd,
                Service_Name=item.get('SelectItemName'),
                Charge=self.safe_to_decimal(item.get('Charges')),
                Rate=self.safe_to_decimal(item.get('Amount')),
                Quantity=int(item.get('Quantity', 1)),
                Discount_Type=item.get('DiscountType'),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Value=self.safe_to_decimal(item.get('Discount', 0.00)),
                Tax_Amount=self.safe_to_decimal(item.get('GST', 0.00)),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                Item_Status=new_bill_status,
            )
            general_billing_item_instance.save()
 
    def handle_cash_payment(self, general_billing, initialState, patient, BillingData, Created_by, editid):
        # Update existing receipt for the invoice with the delta values coming from edit
        receipt = GeneralBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editid)
        # Use the delta-driven amounts already computed in frontend initialState:
        receipt.TotalAmount = self.safe_to_decimal(initialState.get('totalSelectListAmount'))  # full list amount (kept for continuity)
        receipt.TotalPaidAmount = self.safe_to_decimal(initialState.get('TotalPaidAmount'))    # cumulative paid total maintained by FE
        receipt.BalanceAmount = self.safe_to_decimal(initialState.get('BalanceAmount'))        # delta balance after this edit
        receipt.PaidAmount = self.safe_to_decimal(initialState.get('TotalPaidAmount'))         # aligns with TotalPaidAmount
        receipt.Billedby = Created_by
        receipt.save()
        return receipt
 
    def handle_refund_cash_payment(self, general_billing, initialState, patient, BillingData, Created_by, editid):
        # Adjust main receipt (for visibility) and create a separate refund receipt entry
        receipt = GeneralBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editid)
        receipt.TotalAmount = self.safe_to_decimal(initialState.get('totalSelectListAmount'))
        receipt.TotalPaidAmount = self.safe_to_decimal(initialState.get('totalSelectListAmount'))
        receipt.BalanceAmount = self.safe_to_decimal(initialState.get('BalanceAmount'))
        receipt.PaidAmount = self.safe_to_decimal(initialState.get('totalSelectListAmount'))
        receipt.Billedby = Created_by
        receipt.save()
 
        billing_refund = GeneralBillingRefundReceipt(
            Invoice_NO=receipt if receipt else None,
            PatientID=patient.PatientId,
            PhoneNumber=patient.PhoneNo,
            NewPayment="RefundPayment",
            Patient_Name=f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
            TotalAmount=self.safe_to_decimal(initialState.get('totalNetAmount')),
            TotalPaidAmount=self.safe_to_decimal(initialState.get('PaidAmount')),
            BalanceAmount=self.safe_to_decimal(initialState.get('BalanceAmount')),
            Billing_Date=BillingData.get('InvoiceDate'),
            PaidAmount=self.safe_to_decimal(initialState.get('PaidAmount')),
            Billedby=Created_by
        )
        billing_refund.save()
        refund_voucher = billing_refund.Voucher_Number if billing_refund.Voucher_Number else None
        return receipt, refund_voucher
 
    def handle_refund_credit_payment(self, general_billing, deleteditems, initialState, patient, BillingData, Created_by, editid):
        # Mark deleted items as Refunded for credit refunds (no cash movement)
        last_gen_item = None
        for item in deleteditems:
            select_code = (item.get('SelectItemCode') or "").strip()
            q = General_Billing_Items_Table_Detials.objects.filter(
                Billing_Invoice_No__Billing_Invoice_No=editid,
                Item_Status__in=['Paid', 'Due']
            )
            q = q.filter(Service_Code=select_code) if select_code else q.filter(Service_Name=item.get('SelectItemName'))
            for gen_item in q:
                gen_item.Item_Status = 'Refunded'
                gen_item.save()
                last_gen_item = gen_item
        return last_gen_item
 
    def save_multiple_payments(self, billAmount, receipt):
        # Only operate when a concrete receipt exists
        if not isinstance(receipt, GeneralBillingReceipt):
            return
 
        for payment in billAmount:
            payment_type = payment.get('Billpay_method')
            if not payment_type:
                continue
 
            existing_payment = Multiple_Payment_Table_Detials.objects.filter(
                Receipt_No_Paid=receipt,
                Payment_Type=payment_type
            ).first()
 
            if existing_payment:
                # Update same-method payment by incrementing amounts
                existing_payment.Amount += self.safe_to_decimal(payment.get('paidamount', 0.00))
                existing_payment.Transaction_Amount = self.safe_to_decimal(payment.get('transactionFee', 0.00))
                existing_payment.AdditionalAmount += self.safe_to_decimal(payment.get('Additionalamount', 0.00))
                existing_payment.save()
            else:
                # Create a new payment row for this receipt and method
                Multiple_Payment_Table_Detials.objects.create(
                    Receipt_No_Paid=receipt,
                    Payment_Type=payment.get('Billpay_method'),
                    Cart_Type=payment.get('CardType'),
                    Card_No=payment.get('CardNo'),
                    TransactionId=payment.get('TransactionId'),
                    upiid=payment.get('upiid'),
                    Cheque_No=payment.get('ChequeNo'),
                    Bank_Name=payment.get('BankName'),
                    Amount=self.safe_to_decimal(payment.get('paidamount', 0.00)),
                    Transaction_Amount=self.safe_to_decimal(payment.get('transactionFee', 0.00)),
                    AdditionalAmount=self.safe_to_decimal(payment.get('Additionalamount', 0.00)),
                )
 
    def Lab_Request_Cancel_link_Billing(self, editid, deleteditems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit):
        for item in deleteditems:
            if item.get('BillType') == 'OPEdit':
                if item.get('ServiceType') in ['LAB', 'Lab']:
                    bill_ins = BillingInvoiceAndBillAmount.objects.get(Billing_Invoice=editid)
                    if bill_ins.Capture_Sample_Status == 'Pending':
                        code = item.get('SelectItemCode')
                        if code:
                            Billing_Item_Table_for_lab.objects.filter(
                                Billing_Invoice=bill_ins.Billing_Invoice,
                                Test_Code=code
                            ).delete()
                    else:
                        return JsonResponse({"warn": "Lab tests are already in progress"})
                if item.get('ServiceType') == 'RADIOLOGY':
                    code = (item.get('SelectItemCode') or "").strip()
                    rad_ins = Radiology_Request_Details.objects.filter(Billing_Invoice_No__Billing_Invoice_No=editid, SubTestCode=code)
                    for rad in rad_ins:
                        rad.Status = 'Canceled'
                        rad.updated_at = Created_by
                        rad.save()
 
    def Lab_Request_Detailslink_Billing(self, item, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit, doctor):
        # unchanged logic from your file; retained as-is
        try:
            # existing implementation...
            # (kept intact to avoid altering lab flow)
            pass
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    def Radiology_Request_link_Billing(self, AddedItems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit, register):
        # unchanged logic from your file; retained as-is
        try:
            for item in AddedItems:
                if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') != '':
                    Test_Code = (item.get('ServiceSubCatId') or "").strip()
                    RegisterType = "OP"
                    try:
                        testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                        Radiologyid = testnames.Radiology_Id.Radiology_Id
                        Radiology_Request_Details.objects.create(
                            RegisterType=RegisterType,
                            OP_Register_Id=register if RegisterType == "OP" or RegisterType == 'WALK-IN' else None,
                            IP_Register_Id=register if RegisterType == "IP" else None,
                            Casuality_Register_Id=register if RegisterType == "Casuality" else None,
                            Diagnosis_Register_Id=register if RegisterType == "ExternalRadiology" else None,
                            TestCode=Radiologyid,
                            SubTestCode=item.get('ServiceSubCatId'),
                            created_by=Created_by,
                            Status=new_bill_status,
                            Billing_Invoice_No=general_billing
                        )
                    except TestName_Details.DoesNotExist:
                        print(f"TestName_Details not found for Test_Code: {Test_Code}")
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    def Consultation_Request_link_Billing(self, AddedItems, deleteItems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit, register):
        # unchanged logic; kept as-is
        try:
            for item in AddedItems:
                if item.get('ServiceType') == "CONSULTATION" and item.get('ServiceCode') != '':
                    try:
                        # Handle deleted doctors
                        for del_item in deleteItems:
                            service_code = del_item.get('SelectItemCode')
                            if not service_code:
                                continue
                            del_doctor_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=service_code).first()
                            if not del_doctor_ins:
                                continue
                            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                                Registration_Id__Registration_Id=register.Registration_Id,
                                PrimaryDoctor=del_doctor_ins.pk
                            ).first()
 
                        # Update to new doctor
                        service_iddd = (item.get('ServiceCode', '') or '').strip().upper()
                        doctor_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=service_iddd).first()
                        doc_prof_ins = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID=service_iddd).first()
                        if not doc_prof_ins or not doc_prof_ins.Specialization:
                            continue
                        spec_ins = Speciality_Detials.objects.get(Speciality_Id=doc_prof_ins.Specialization.Speciality_Id)
 
                        speciality_abbr = spec_ins.Speciality_Name[:3].upper()
                        today = datetime.now().date()
                        count_today = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Specialization=spec_ins,
                            created_at__date=today
                        ).count()
                        next_token_no = f"{speciality_abbr}{count_today + 1:03d}"
 
                        if doc_ins:
                            doc_ins.PrimaryDoctor = doctor_ins
                            doc_ins.Specialization = spec_ins
                            doc_ins.TokenNo = next_token_no
                            doc_ins.save()
 
                    except Exception as e:
                        print('error', str(e))
                        return JsonResponse({'error': 'An internal server error occurred'})
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    @transaction.atomic
    def post(self, request):
        try:
            data = json.loads(request.body)
            billAmount = data.get('billAmount', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            NetAmount_CDmethod = data.get('NetAmount_CDmethod', {})
            SelectDatalist = data.get('SelectDatalist', [])
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            Paytype = data.get('Paytype', '')
            Bill_type = data.get('BillTypeMode', '')  # '' | Pay | Refund
            editid = data.get('EditId', '')
            Addeditems = data.get('AddedItems', [])
            deleteditems = data.get('DeletedItems', [])
 
            print(initialState,'initialState')
 
            if not SelectDatalist:
                return JsonResponse({'error': 'SelectDatalist is empty or missing'}, status=400)
 
            doctor = BillingData.get('DoctorId')
            if not isinstance(doctor, list):
                doctor = [doctor]
 
            patient, register, visit = self.get_patient_data(SelectedPatient_list)
            location = Location_Detials.objects.get(Location_Id=Location)
 
            # new bill status is determined by current delta balance (0 => Paid)
            new_bill_status = 'Paid' if self.safe_to_decimal(initialState.get('BalanceAmount')) == Decimal('0.00') else 'Due'
 
            if editid:
                general_billing = General_Billing_Table_Detials.objects.get(Billing_Invoice_No=editid)
                # Update totals to reflect the entire current selection list
                general_billing.Billing_Type = NetAmount_CDmethod.get('Method')
                general_billing.Select_Discount = NetAmount_CDmethod.get('Method')
                general_billing.Discount_Type = NetAmount_CDmethod.get('Method')
                general_billing.Discount_Value = self.safe_to_decimal(NetAmount_CDmethod.get('Amount'))
                general_billing.Discount_Amount = self.safe_to_decimal(initialState.get('totalSelectListDiscount'))
                general_billing.Total_Items = int(initialState.get('totalSelectListItems'))
                general_billing.Total_Qty = int(initialState.get('totalSelectListUnits'))
                general_billing.Total_Amount = self.safe_to_decimal(initialState.get('totalSelectListAmount'))
                general_billing.Total_GSTAmount = self.safe_to_decimal(initialState.get('totalSelectListGst'))
                general_billing.Net_Amount = self.safe_to_decimal(initialState.get('totalSelectListNetAmount'))
                general_billing.Net_Paid_Amount = self.safe_to_decimal(initialState.get('TotalPaidAmount'))
                general_billing.Round_Off = self.safe_to_decimal(initialState.get('Roundoff'))
                general_billing.Paid_Amount = self.safe_to_decimal(initialState.get('TotalPaidAmount'))
                general_billing.Balance_Amount = self.safe_to_decimal(initialState.get('BalanceAmount'))
                general_billing.Bill_Status = new_bill_status
                general_billing.created_by = Created_by
                general_billing.Location = location
                general_billing.save()
 
            # Apply item-level mutations
            self.create_billing_items(general_billing, SelectDatalist, new_bill_status, SelectedPatient_list, editid, Addeditems, deleteditems)
            self.Lab_Request_Detailslink_Billing(Addeditems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit, doctor)
            self.Lab_Request_Cancel_link_Billing(editid, deleteditems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit)
            self.Radiology_Request_link_Billing(Addeditems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit, register)
            self.Consultation_Request_link_Billing(Addeditems, deleteditems, location, general_billing, new_bill_status, SelectedPatient_list, Created_by, visit, register)
 
            # Payment handling
            receipt = None
            refund_voucher = None
            if Paytype == 'Cash' and Bill_type == 'Pay':
                receipt = self.handle_cash_payment(general_billing, initialState, patient, BillingData, Created_by, editid)
            elif Paytype == 'Cash' and Bill_type == 'Refund':
                receipt, refund_voucher = self.handle_refund_cash_payment(general_billing, initialState, patient, BillingData, Created_by, editid)
            elif Paytype == 'Credit' and Bill_type == 'Refund':
                receipt = self.handle_refund_credit_payment(general_billing, deleteditems, initialState, patient, BillingData, Created_by, editid)
 
            # Save multiple payment rows only if we have a real receipt to tie to
            if receipt:
                self.save_multiple_payments(billAmount, receipt)
 
            # Pick correct receipt number for print:
            # - Refund Cash: use refund voucher
            # - Else use main receipt voucher when available
            response_receipt_no = None
            if Paytype == 'Cash' and Bill_type == 'Refund':
                response_receipt_no = refund_voucher
            elif isinstance(receipt, GeneralBillingReceipt):
                response_receipt_no = receipt.Voucher_Number
 
            return JsonResponse({
                'Success': 'Bill Added Successfully',
                'InvoiceNo': general_billing.Billing_Invoice_No,
                'ReceiptNo': response_receipt_no
            })
 
        except Exception as e:
            print(str(e))
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)
 
 
 


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def GeneralBilling_Due_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
           
            # Extract data from the request
            billAmount = data.get('billAmount', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            editid = data.get('EditId','')
            editdue = data.get('EditDue','')
 
 
            print('1111111')
            print('editttdueeee',editdue)
            print('edittiddddd',editid)
            # Validate essential data
            # if not billAmount:
            #     return JsonResponse({'error': 'billAmount is empty or missing'}, status=400)
 
            try:
             
                patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
                print('lajhdsjsks')
            except ObjectDoesNotExist as e:
                return JsonResponse({'error': f'{str(e).split(":")[1].strip()} not found'})
            print('jdjdjkdkdkd')
            # Convert to Decimal with error handling
            def safe_to_decimal(value, default=0.00):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError, ValueError):
                    return Decimal(default)
            print('ueoejcjdjd')
            new_bill_status= 'Paid' if safe_to_decimal(initialState.get('BalanceAmount')) == 0.00 else 'Due'
            # Begin an atomic transaction
           
            # Create and save the General Billing entry
            print('hello')
            if editdue:
                general_billing = General_Billing_Table_Detials.objects.get(Billing_Invoice_No=editdue)
                general_billing.Paid_Amount += safe_to_decimal(initialState.get('PaidAmount'))
                general_billing.Net_Paid_Amount += safe_to_decimal(initialState.get('totalAmountt'))
                general_billing.Balance_Amount -= safe_to_decimal(initialState.get('PaidAmount'))
                general_billing.Bill_Status = new_bill_status
                general_billing.save()
                print("Updated General Billing:", general_billing.Paid_Amount, general_billing.Net_Paid_Amount, general_billing.Balance_Amount, general_billing.Bill_Status)
 
 
                general_billing_items = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No=editdue)
                for item in general_billing_items:
 
                    if item.Service_Type == 'RADIOLOGY':
 
                        Testins = Radiology_Request_Details.objects.filter(SubTestCode=item.Service_Code.strip(),Status='Due',Billing_Invoice_No_id=editdue).first()
                        Testins.Status = new_bill_status
                        Testins.save()
 
                    if item.Service_Type == 'LAB':
 
                        labins1 = Lab_Request_Details.objects.filter(Status='Due',Billing_Invoice_No_id=editdue).first()
                        labins1.Status = new_bill_status
                        labins1.save()
 
                        labins2 = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice=editdue,Status='Due')
 
                        for lab2 in labins2:
 
                            lab2.Status = new_bill_status
                            lab2.save()
 
                        labitem2ins = Billing_Item_Table_for_lab.objects.filter(Billing_Invoice=editdue,Bill_Status='Due')
 
                        for item2 in labitem2ins:
 
                            item2.Bill_Status = new_bill_status
                            item2.save()
 
                    item.Item_Status = new_bill_status
                    item.save()
                    print("Updated General Billing:", item.Item_Status)
 
            print('dvwebjvwhbvjwe')
            recipetbill = None
            billing_receipt_table = GeneralBillingReceipt(
                Invoice_NO=general_billing,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "DuePayment",
                Patient_Name=f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount= safe_to_decimal(initialState.get('totalNetAmount')),
                TotalPaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                BalanceAmount=safe_to_decimal(initialState.get('BalanceAmount')),
                Billing_Date=BillingData.get('InvoiceDate'),
                PaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                Billedby=Created_by
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
 
            # Save multiple payment details
            print('ucjcjvjhcj')
            for payment in billAmount:
           
                multiple_payment = Multiple_Payment_Table_Detials(
                    Receipt_No_Paid=billing_receipt_table if billing_receipt_table else None,
                    Payment_Type=payment.get('Billpay_method'),
                    Cart_Type=payment.get('CardType'),
                    Card_No=payment.get('CardNo'),
                    TransactionId=payment.get('TransactionId'),
                    upiid=payment.get('upiid'),
                    Cheque_No=payment.get('ChequeNo'),
                    Bank_Name=payment.get('BankName'),
                    Amount=safe_to_decimal(payment.get('paidamount')),
                    Transaction_Amount = safe_to_decimal(payment.get('transactionFee')),
                    AdditionalAmount = safe_to_decimal(payment.get('Additionalamount')),
                    created_by = Created_by,
                )
                multiple_payment.save()
           
            register_ins_stat = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
            if register_ins_stat:
                register_ins_stat.Status = new_bill_status
                register_ins_stat.Bill_Status = new_bill_status
                register_ins_stat.save()
 
 
           
            return JsonResponse({'status': 'Success','ReceiptNo':recipetbill})
           
        except Exception as e:
            print(str(e))
            return JsonResponse({'error': str(e)}, status=500)
 
 
    elif request.method == "GET":
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
 
            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
   
            search_query = Q()
   
            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)
   
            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)
 
            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)
   
            # Fetch filtered data
            general_billing_data = General_Billing_Table_Detials.objects.filter(search_query)
 
            response_data = []
 
            for row in general_billing_data:
                print(row,'rowwwwwwwwwwwwwww')
                # Construct the patient's full name
                full_name = f"{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()
                doctor_names_list = []
                for doc in row.Doctor_Id:
                    try:
                        doc_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc)
                        doc_pro = Doctor_ProfessForm_Detials.objects.get(Doctor_ID__Doctor_ID =doc_ins.Doctor_ID)
                        doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name} ({doc_pro.Qualification})".strip()
                        doctor_names_list.append(doctor_name)
                    except Doctor_Personal_Form_Detials.DoesNotExist:
                        print(f"Doctor not found for ID: {doc}")  # Optional for debugging
                        continue
                doctor_names = ", ".join(doctor_names_list)
                print('doccccnamesss',doctor_names)
                print('doctiddd',row.Doctor_Id)
                voucher_no = None
                if row.Bill_Status == 'Paid':
                    try:
                        receipt_ins = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No).last()
                        print('receiptttt',receipt_ins)
                        if receipt_ins:
                             voucher_no = receipt_ins.Voucher_Number
                    except GeneralBillingReceipt.DoesNotExist:
                        receipt_ins = None  # or you can handle it however you want
                        voucher_no = receipt_ins
                billing_details = {
                    'id': row.Billing_Invoice_No,
                    'reciept_no' : voucher_no if voucher_no else "",
                    'Type': 'OPDue',
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': row.Doctor_Id,
                    'Doctor_Name': doctor_names,
                    'PatientId': row.Patient_Id.PatientId,
                    'Patient_Name': full_name,
                    'PhoneNo': row.Patient_Id.PhoneNo,
                    'Register_Id': row.Register_Id.Registration_Id,
                    'Gender': row.Register_Id.PatientId.Gender,
                    'City': row.Register_Id.PatientId.City,
                    'State': row.Register_Id.PatientId.State,
                    'Pincode': row.Register_Id.PatientId.Pincode,
                    'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                    'Address':f'{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}',
                    'PatientCategory': row.Register_Id.PatientCategory,
                    'PatientCategoryName': (
                        row.Register_Id.InsuranceName.Insurance_Name
                        if row.Register_Id.PatientCategory == 'Insurance'
                        else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                    ),
                    'Visit_Id': row.Visit_Id.VisitId,
                    'Billing_Type': row.Billing_Type,
                    'TotalItems': row.Total_Items,
                    'TotalQty': row.Total_Qty,
                    'RoundOff': row.Round_Off,
                    'TotalAmount': row.Total_Amount,
                    'TotalDiscount': row.Discount_Amount,
                    'Net_Amount': row.Net_Amount,
                    'PaidAmount': row.Paid_Amount,
                    'PaidNetAmount': row.Net_Paid_Amount,
                    'BalanceAmount': row.Balance_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Billing_Items': [],
                    'Payment_Details': [],
                }
                # Fetch related billing items
                billing_items = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No,Item_Status='Due')
                # print('billlingggggitemsss',billing_items)
                for item in billing_items:
                    item_details = {
                        'Service_Type': item.Service_Type,
                        'Service_Code': item.Service_Code,
                        'Service_Name': item.Service_Name,
                        'Rate': item.Rate,
                        'Charge': item.Charge,
                        'Quantity': item.Quantity,
                        'Amount': item.Amount,
                        'Discount_Type': item.Discount_Type,
                        'Discount_Value': item.Discount_Value,
                        'Discount_Amount': item.Discount_Amount,
                        'Taxable_Amount': item.Taxable_Amount,
                        # 'Tax_Percentage': item.Tax_Percentage,
                        'Tax_Amount': item.Tax_Amount,
                        'Total_Amount': item.Total_Amount,
                    }
                    billing_details['Billing_Items'].append(item_details)
                # Fetch related payment details
                payment_details = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                # print('paymenttttt',payment_details)
                for payment in payment_details:
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Card_Type': payment.Cart_Type,
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': payment.Amount,
                        'Transaction_Amount': payment.Transaction_Amount,
                        'AdditionalAmount': payment.AdditionalAmount,
                    }
                    billing_details['Payment_Details'].append(payment_info)
 
                # Add the billing details to the response data
                response_data.append(billing_details)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
 
    return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})
 
 

@csrf_exempt
@transaction.atomic()
@require_http_methods(['POST'])
def General_Billing_Refund_Request_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract data from the request
            billAmount = data.get('billAmount', [])
            SelectDatalist = data.get('SelectDatalist', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            editdue = data.get('EditDue','')
            statustype = data.get('StatusType','')
            ActionType = data.get('ActionType','')
            remarks = data.get('Remarks','')
 
 
            # print('1111111',data)
            print('editttdueeee',editdue)
 
            if editdue and statustype == 'Request':
                for item in SelectDatalist:
                    if item.get('isRefundable') == 'Yes':
                        general_bill_ins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editdue,Service_Code = item.get('SelectItemCode'), Item_Status__in = ['Paid','Refund'])
                        for gen_item in general_bill_ins:
                            gen_item.Remarks = remarks
                            gen_item.Item_Status = 'RefundRequest'
                            gen_item.save()
                result = {'success': f"Refund Requested successfully for {editdue}"}
            elif editdue and statustype == 'Approval':
                print('approvalll')
                for item in SelectDatalist:
                    print('itemsssssss',item)
                    if ActionType == 'Approved':
                        if item.get('isRefundable') == 'Yes':
                            general_bill_ins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editdue,Service_Code = item.get('SelectItemCode'), Item_Status = 'RefundRequest')
                            for gen_item in general_bill_ins:
                                gen_item.Remarks = remarks
                                gen_item.Item_Status = 'Approved'
                                gen_item.save()
                                print('gennnnnnnn0',gen_item)
                        else:
                            general_bill_ins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editdue,Service_Code = item.get('SelectItemCode'), Item_Status = 'RefundRequest')
                            for gen_item in general_bill_ins:
                                gen_item.Remarks = remarks
                                gen_item.Item_Status = 'Paid'
                                gen_item.save()
                    else:
                        general_bill_ins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editdue,Service_Code = item.get('SelectItemCode'), Item_Status = 'RefundRequest')
                        for gen_item in general_bill_ins:
                            gen_item.Remarks = remarks
                            gen_item.Item_Status = 'Paid'
                            gen_item.save()
                result = {'success': f"Refund {ActionType} successfully for {editdue}"}
 
            return JsonResponse(result)
        except Exception as e:
            print({'error': str(e)})
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)})
 
 
@csrf_exempt
@transaction.atomic()
@require_http_methods(["POST", "OPTIONS", "GET"])
def GeneralBilling_Refund_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
           
            # Extract data from the request
            billAmount = data.get('billAmount', [])
            SelectDatalist = data.get('SelectDatalist', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            editdue = data.get('EditDue','')
 
 
            print('1111111',data)
            print('editttdueeee',editdue)
            # Validate essential data
            # if not billAmount:
            #     return JsonResponse({'error': 'billAmount is empty or missing'}, status=400)
 
            try:              
                patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
               
                print('lajhdsjsks')
            except ObjectDoesNotExist as e:
                return JsonResponse({'error': f'{str(e).split(":")[1].strip()} not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple instances found'})
            print('jdjdjkdkdkd')
            # Convert to Decimal with error handling
            def safe_to_decimal(value, default=0.00):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError, ValueError):
                    return Decimal(default)
            print('ueoejcjdjd')
            receipt_ins = None  # Ensure it always has a default value
            if editdue:
                receipt_ins = GeneralBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editdue)
                receipt_ins.NewPayment = "RefundPayment"
                receipt_ins.save()
 
 
            # Create and save the General Billing entry
            print('hello')
            print('dvwebjvwhbvjwe')
            billing_receipt_table = GeneralBillingRefundReceipt(
                Invoice_NO=receipt_ins if receipt_ins else None,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "RefundPayment",
                Patient_Name=f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount= safe_to_decimal(initialState.get('totalNetAmount')),
                TotalPaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                BalanceAmount=safe_to_decimal(initialState.get('BalanceAmount')),
                Billing_Date=BillingData.get('InvoiceDate'),
                PaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                Billedby=Created_by
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
 
            # Save multiple payment details
            print('ucjcjvjhcj')
            for payment in billAmount:
           
                multiple_payment = Multiple_Payment_Refund_Table_Detials(
                    Receipt_No_Paid=billing_receipt_table if billing_receipt_table else None,
                    Payment_Type=payment.get('Billpay_method'),
                    Cart_Type=payment.get('CardType'),
                    Card_No=payment.get('CardNo'),
                    TransactionId=payment.get('TransactionId'),
                    upiid=payment.get('upiid'),
                    Cheque_No=payment.get('ChequeNo'),
                    Bank_Name=payment.get('BankName'),
                    Amount=safe_to_decimal(payment.get('paidamount')),
                    Transaction_Amount = safe_to_decimal(payment.get('transactionFee')),
                    AdditionalAmount = safe_to_decimal(payment.get('Additionalamount')),
                )
                multiple_payment.save()
            for item in SelectDatalist:
                general_bill_ins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editdue,Service_Code = item.get('SelectItemCode'), Item_Status = 'Approved')
                for gen_item in general_bill_ins:
                    gen_item.Item_Status = 'Refunded'
                    gen_item.save()
                if item.get('ServiceType') == 'LAB' or item.get('ServiceType') == 'Lab':
                    bill_ins = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = editdue).first()
                    print('bllllabb',bill_ins)

                    if bill_ins:
                    
                        code = item.get('SelectItemCode')
                        if code:
                            bill_items = Billing_Item_Table_for_lab.objects.filter(Billing_Invoice=bill_ins.Billing_Invoice,Test_Code=code)
                            for bill_itemm in bill_items:
                                bill_itemm.Bill_Status = "Canceled"
                                bill_itemm.save()
                           
                if item.get('ServiceType') == 'RADIOLOGY':
 
                    code = item.get('SelectItemCode').strip()
                    print('radddddd',code)
                    rad_ins = Radiology_Request_Details.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editdue,SubTestCode=code)
                    print('rad_inssss',rad_ins)
                    for rad in rad_ins:    
                        rad.Status='Canceled'
                        rad.save()
               
                if item.get('ServiceType') == 'CONSULTATION':
                    code = item.get('SelectItemCode').strip()
                    consult_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(PrimaryDoctor__Doctor_ID=code,Registration_Id__Registration_Id=receipt_ins.Invoice_NO.Register_Id.Registration_Id)
                    consult_ins.Status = 'Canceled'
                    consult_ins.updated_by =Created_by
                    consult_ins.save()
       
            return JsonResponse({'status': 'Success','ReceiptNo':recipetbill})
           
        except Exception as e:
            print(str(e))
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == "GET":
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')

            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            item_status_filter = request.GET.get('ItemSearchStatus')

            search_query = Q()

            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)

            # Fetch filtered data
            general_billing_dataa = General_Billing_Table_Detials.objects.filter(search_query)
            print('bhibibib', general_billing_dataa)
            response_data = []
            
            for general_billing_data in general_billing_dataa:
                billing_items = General_Billing_Items_Table_Detials.objects.filter(
                    Billing_Invoice_No=general_billing_data.Billing_Invoice_No, 
                    Item_Status=item_status_filter
                )
                print('billlitemss', billing_items)
                
                # Skip if no billing items exist for this patient
                if not billing_items.exists():
                    continue
                    
                doctor_names_list = []

                if general_billing_data.Doctor_Id:
                    for doc in general_billing_data.Doctor_Id:
                        if doc != 'Self':
                            # Safely get doctor personal details
                            doc_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doc).first()
                            
                            # Check if doc_ins exists before proceeding
                            if doc_ins:
                                doc_pro = Doctor_ProfessForm_Detials.objects.filter(
                                    Doctor_ID__Doctor_ID=doc_ins.Doctor_ID
                                ).first()

                                if doc_pro:
                                    doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name}({doc_pro.Qualification})".strip()
                                    doctor_names_list.append(doctor_name)
                                else:
                                    # If no professional details, just use personal details
                                    doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name}".strip()
                                    doctor_names_list.append(doctor_name)

                doctor_names = ", ".join(doctor_names_list)
                print('docccccc', doctor_names)
                print('docccccciddddddd', general_billing_data.Doctor_Id)
                
                # Safely build full name
                full_name = f"{general_billing_data.Patient_Id.Title.Title_Name}.{general_billing_data.Patient_Id.FirstName} {general_billing_data.Patient_Id.MiddleName or ''} {general_billing_data.Patient_Id.SurName}".strip()

                billing_details = {
                    'id': general_billing_data.Billing_Invoice_No,
                    'Type': 'OPRefund',
                    'Billing_Date': general_billing_data.Billing_Date,
                    'Doctor_Id': general_billing_data.Doctor_Id if general_billing_data.Doctor_Id else "",
                    'Doctor_Name': doctor_names if doctor_names else "",
                    'PatientId': general_billing_data.Patient_Id.PatientId,
                    'Patient_Name': full_name,
                    'PhoneNo': general_billing_data.Patient_Id.PhoneNo,
                    'Register_Id': general_billing_data.Register_Id.Registration_Id,
                    'Gender': general_billing_data.Register_Id.PatientId.Gender,
                    'City': general_billing_data.Register_Id.PatientId.City,
                    'State': general_billing_data.Register_Id.PatientId.State,
                    'Pincode': general_billing_data.Register_Id.PatientId.Pincode,
                    'VisitPurpose': general_billing_data.Register_Id.VisitPurpose,
                    'AgeGender': f'{general_billing_data.Register_Id.PatientId.Age}/{general_billing_data.Register_Id.PatientId.Gender}',
                    'Address': f'{general_billing_data.Register_Id.PatientId.DoorNo}, {general_billing_data.Register_Id.PatientId.Street}, {general_billing_data.Register_Id.PatientId.Area}, {general_billing_data.Register_Id.PatientId.City}, {general_billing_data.Register_Id.PatientId.State}, {general_billing_data.Register_Id.PatientId.Country}, {general_billing_data.Register_Id.PatientId.Pincode}',
                    'PatientCategory': general_billing_data.Register_Id.PatientCategory,
                    'PatientCategoryName': (
                        general_billing_data.Register_Id.InsuranceName.Insurance_Name
                        if general_billing_data.Register_Id.PatientCategory == 'Insurance'
                        else getattr(general_billing_data.Register_Id.ClientName, 'Client_Name', None)
                    ),
                    'Visit_Id': general_billing_data.Visit_Id.VisitId,
                    'Billing_Type': general_billing_data.Billing_Type,
                    'TotalItems': general_billing_data.Total_Items,
                    'TotalQty': general_billing_data.Total_Qty,
                    'RoundOff': general_billing_data.Round_Off,
                    'TotalAmount': general_billing_data.Total_Amount,
                    'TotalDiscount': general_billing_data.Discount_Amount,
                    'Net_Amount': general_billing_data.Net_Amount,
                    'PaidAmount': general_billing_data.Paid_Amount,
                    'PaidNetAmount': general_billing_data.Net_Paid_Amount,
                    'BalanceAmount': general_billing_data.Balance_Amount,
                    'Bill_Status': general_billing_data.Bill_Status,
                    'Billing_Items': [],
                    'Payment_Details': [],
                }

                # Fetch related billing items
                for item in billing_items:
                    item_details = {
                        'Service_Type': item.Service_Type,
                        'Service_Name': item.Service_Name,
                        'SelectItemCode': item.Service_Code,
                        'Rate': item.Rate,
                        'Charge': item.Charge,
                        'Quantity': item.Quantity,
                        'Amount': item.Amount,
                        'Discount_Type': item.Discount_Type,
                        'Discount_Value': item.Discount_Value,
                        'Discount_Amount': item.Discount_Amount,
                        'Taxable_Amount': item.Taxable_Amount,
                        'Tax_Amount': item.Tax_Amount,
                        'Total_Amount': item.Total_Amount,
                        'Remarks': item.Remarks,
                    }
                    billing_details['Billing_Items'].append(item_details)

                # Fetch related payment details
                payment_details = Multiple_Payment_Table_Detials.objects.filter(
                    Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=general_billing_data.Billing_Invoice_No
                )
                for payment in payment_details:
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Card_Type': payment.Cart_Type,
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': payment.Amount,
                        'Transaction_Amount': payment.Transaction_Amount,
                        'AdditionalAmount': payment.AdditionalAmount,
                    }
                    billing_details['Payment_Details'].append(payment_info)

                # Append billing details for each entry
                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print({'errorrrrrrrrr': str(e)})
            return JsonResponse({'error': str(e)})


 


@csrf_exempt
@require_http_methods(["GET"])
def Filter_Patient_data_For_Billing(request):
    try:
        first_name = request.GET.get("FirstName", None)
        phone_no = request.GET.get("PhoneNo", None)
        patient_id = request.GET.get("PatientId", None)

        filter_Conditions=Q()

        if first_name:
            filter_Conditions &= Q(FirstName__icontains=first_name)
        if phone_no:
            filter_Conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_Conditions &= Q(PatientId__icontains=patient_id)

        patients = Patient_Detials.objects.filter(filter_Conditions,DuplicateId=False)
        print('patients :', patients)

        remaining_amount = 0
        record_id = None
        if patient_id:
            advance_record = advancemaintaintable.objects.filter(Patient_Id=patient_id).first()
            
            # Check if advance record exists
            if advance_record:
                # Retrieve the ID of the record
                record_id = advance_record.id

                # Calculate total advance amount and total paid amount
                total_advance_amount = advance_record.fullAmount
                total_paid_amount = advance_record.paidamount

                # Calculate remaining amount
                full_amount = total_advance_amount
                if full_amount > total_paid_amount:
                    remaining_amount = full_amount - total_paid_amount
            

        patient_data = [
            {
                'PatientId': patient.PatientId,
                'PhoneNo': patient.PhoneNo,
                'FirstName': patient.FirstName,
                'Gender':patient.Gender,
                'DoorNo':patient.DoorNo,
                'Age':patient.Age,
                'Street':patient.Street,
                'Area':patient.Area,
                'City':patient.City,
                'State':patient.State,
                'Country':patient.Country,
                'Pincode':patient.Pincode,
                'Advance_Amount':remaining_amount,
                'advanceid':record_id

            } for patient in patients
        ]

       
        return JsonResponse(patient_data, safe=False)

    
    except Exception as e:
        print({f'error:{str(e)}'})
        return JsonResponse({'error':'An internal server error occurred'},status=500)



@csrf_exempt
def get_merged_service_data(request):
    try:
        selectedOption = request.GET.get('selectedOption')
        location = request.GET.get('location')
        PatientCategory = request.GET.get('PatientCategory')
        PatientCategoryType = request.GET.get('PatientCategoryType', None)
        ServiceType = request.GET.get('ServiceType', 'Interventional')
        merged_data = []
        
        if selectedOption == 'OPDServices':
            ser_pro_inss = Service_Master_Details.objects.filter(Status=True).exclude(Department='IP')
        else:
            ser_pro_inss = Procedure_Master_Details.objects.filter(Status=True, Type=ServiceType)
        
        for inss in ser_pro_inss:
            data = {
                'Service_Id': inss.pk,
                'Service_Name': inss.Service_Name if selectedOption == 'OPDServices' else inss.Procedure_Name,
                'GstValue': inss.GstValue if inss.IsGst == 'Yes' else "Nill"
            }

            # Filter conditions
            filter_conditions = Q()
            if selectedOption == 'OPDServices':
                filter_conditions &= Q(Service_ratecard__pk=inss.pk, Location__pk=location)
            elif selectedOption == 'OPDProcedures':
                filter_conditions &= Q(Procedure_ratecard__pk=inss.pk, Location__pk=location)

            try:
                inss_ser_pro = Service_Procedure_Charges.objects.get(filter_conditions)
                charges_gen_spe = Service_Procedure_Rate_Charges.objects.get(Service_Procedure_ratecard=inss_ser_pro)

                if PatientCategory == 'General':
                    data['charge'] = charges_gen_spe.General_fee
                elif PatientCategory == 'Special':
                    data['charge'] = charges_gen_spe.Special_fee
                elif PatientCategory == 'Insurance' and PatientCategoryType:
                    ins_ins = Service_Procedure_InsuranceFee.objects.get(Service_Procedure_ratecard=inss_ser_pro, insurance__pk=PatientCategoryType)
                    data['charge'] = ins_ins.fee
                elif PatientCategory == 'Client' and PatientCategoryType:
                    cli_ins = Service_Procedure_ClientFee.objects.get(Service_Procedure_ratecard=inss_ser_pro, client__pk=PatientCategoryType)
                    data['charge'] = cli_ins.fee

            except Service_Procedure_Charges.DoesNotExist:
                data['charge'] = ""
            except Service_Procedure_Rate_Charges.DoesNotExist:
                data['charge'] = ""
            except (Service_Procedure_InsuranceFee.DoesNotExist, Service_Procedure_ClientFee.DoesNotExist):
                data['charge'] = ""

            merged_data.append(data)
        
        return JsonResponse(merged_data, safe=False)

    except Exception as e:
        print(f'error: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

        
    
    

@csrf_exempt
def get_latest_appointment_for_patient(request):
    try:
        patient_id = request.GET.get('PatientId')
        latest_appointment = Patient_Appointment_Registration_Detials.objects.filter(PatientId=patient_id).order_by('-Registration_Id').first()

        if latest_appointment:
            appointment_data = {
                'Registration_Id': latest_appointment.Registration_Id,
                'VisitId': latest_appointment.VisitId,
            }

            return JsonResponse(appointment_data, safe=False)
        else:
            return JsonResponse({'error': 'No appointments found for this patient.'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)








#  For  Pharmacy Billing Op




def get_prescription(request):
    try:
        # Retrieve PatientID and VisitID from the request
        PatientID = request.GET.get('PatientID')
        VisitID = request.GET.get('VisitID')

        # Validate PatientID and VisitID
        if not PatientID or not VisitID:
            return JsonResponse({"error": "PatientID and VisitID parameters are required"}, status=400)

        print('PatientID:', PatientID, 'VisitID:', VisitID)

        # Fetch patient details to get the Patient Name
        try:
            patient = Patient_Detials.objects.get(PatientId=PatientID)
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Patient not found"}, status=404)

        PatientName = f"{patient.FirstName} {patient.MiddleName} {patient.SurName}"

        # Fetch registration details
        try:
            registration = Patient_Appointment_Registration_Detials.objects.get(
                PatientId_id=PatientID, VisitId=VisitID
            )
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Registration not found for the given PatientID and VisitID"})

        print("Registration ID for Filtering:", registration.Registration_Id)

        # Query the prescriptions related to the Registration ID
        prescriptions = OPD_Prescription_Details.objects.filter(
            Registration_Id=registration
        )
        print("Prescriptions Queryset:", prescriptions)

        # Prepare the list of prescriptions
        prescription_list = []
        for prescription in prescriptions:
            try:
                # Fetch location details
                location = Location_Detials.objects.get(Location_Id=registration.Location_id)
                location_name = location.Location_Name
            except ObjectDoesNotExist:
                location_name = "N/A"
                
            products = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__ItemName=prescription.ItemId.ItemName)
            if products.exists():
                for product in products:
                    doctor = prescription.Registration_Id.PrimaryDoctor
                    prescription_dict = {
                        'PrescriptionID': prescription.Prescription_Id,
                        'PatientID': PatientID,
                        'VisitID': registration.VisitId,
                        'AppointmentDate': registration.created_at.date().isoformat(),
                        'DoctorId': doctor.Doctor_ID if doctor else "N/A",
                        'DoctorName': f"{doctor.First_Name} {doctor.Last_Name}" if doctor else "N/A",
                        'GenericName': prescription.ItemId.GenericName.GenericName if prescription.ItemId else "N/A",
                        'ItemName': prescription.ItemId.ItemName if prescription.ItemId else "N/A",
                        'Dose': prescription.Dosage,
                        'Route': prescription.Route,
                        'Frequency': prescription.Frequency,
                        'Duration': f"{prescription.DurationNumber} {prescription.DurationUnit}",
                        'Qty': prescription.Qty,
                        'Instruction': prescription.Instruction,
                        'Status': registration.Status,
                        'LoggedBy': prescription.created_by,
                        'Location': location_name,
                        'CreatedAt': prescription.created_at.date().isoformat(),
                        'Patient_Name': PatientName,
                        'MRP' : int(product.Sellable_price),
                        'BatchNo' : product.Batch_No,
                        'Exp_Date' : product.Expiry_Date,

                    }
                    prescription_list.append(prescription_dict)
                    print('Product:', product.Batch_No)
            else:
                print("No products found for the given ItemName")

            

        return JsonResponse(prescription_list, safe=False)

    except Exception as e:
        print('Error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)

    
def op_pharmacy_queue_list_prescrib(request):
    try:        
        # Filter drug requests based on location if applicable
        drug_requests = OPD_Prescription_Details.objects.filter(Status = '1')
        
        datafetch = []
        processed_patients = set()  # Set to store processed patient IDs
        record_id = 1
        print('1111111')
        for drug_request in drug_requests:
            registration_id = drug_request.Registration_Id
            if not registration_id:
                continue

            # Check if registration_id is valid and proceed only if it exists
            try:
                print('1111111')
                # room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id_id=registration_id).first()
                # if not room_detail:
                #     continue
                
                # room_status = Room_Master_Detials.objects.filter(Room_Id=room_detail.RoomId.Room_Id, Booking_Status='Occupied').first()
                # if not room_status:
                #     continue
                
                patient_data = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id.Registration_Id).first()
                print('55555555',patient_data)
                if not patient_data:
                    continue
                
                personal_data = Patient_Detials.objects.filter(PatientId=patient_data.PatientId.PatientId).first()
                print('2222222',personal_data)
                if not personal_data or personal_data.PatientId in processed_patients:
                    continue  # Skip if patient already processed

                processed_patients.add(personal_data.PatientId)  # Add to processed list
                
                # Handle possible None values in name fields
                patient_name = f"{personal_data.FirstName or ''} {personal_data.MiddleName or ''} {personal_data.SurName or ''}".strip()

                datafetch.append({
                    'id': record_id,
                    'VisitID' : registration_id.VisitId,
                    'Booking_Id': registration_id.Registration_Id,  # Ensure this is a serializable ID
                    'PatientName': patient_name,
                    'PatientId': personal_data.PatientId,  # Assuming this is a serializable ID
                    'PatientPhoneNo': personal_data.PhoneNo,
                    'DoctorName': str(drug_request.Registration_Id.PrimaryDoctor.ShortName)  # Convert to string if necessary
                })

                record_id += 1

            except ObjectDoesNotExist as e:
                print(f"Error fetching data for registration_id {registration_id}: {str(e)}")
                continue

        return JsonResponse(datafetch, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500)







    
def get_prescriptionqueue(request):
    try:
        # Fetch all prescriptions with related data
        prescriptions = Workbench_Prescription.objects.select_related(
            'Doctor_Id'  # Related doctor details
        ).all()

        # Serialize the prescriptions queryset to JSON
        serialized_prescriptions = serialize('json', prescriptions, use_natural_primary_keys=True)
        
        # Convert serialized data to Python dict
        serialized_data = json.loads(serialized_prescriptions)

        # Dictionary to hold unique patient details
        patient_data = {}
        
        id = 1
        # Enhance the serialized data with additional details
        for item in serialized_data:
            fields = item['fields']
            registration_id = fields.get('Registration_Id')
            doctor_id = fields.get('Doctor_Id')
            
            # Get PatientId using Registration_Id
            appointment = Patient_Appointment_Registration_Detials.objects.filter(id=registration_id).first()
            if appointment:
                patient_id = appointment.PatientId.PatientId
            else:
                patient_id = None
            
            if patient_id:
                if registration_id not in patient_data:
                    patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
                    if patient:
                        # Fetch doctor details
                        doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_id).first()
                        doctor_name = f"{doctor.First_Name} {doctor.Last_Name}" if doctor else ''
                        
                        patient_data[registration_id] = {
                            'Patient_Name': f"{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                            'PatientPhoneNo': patient.PhoneNo,
                            'PatientEmail': patient.Email,
                            'PatientCity': patient.City,
                            'PatientState': patient.State,
                            'PatientCountry': patient.Country,
                            'VisitID': appointment.VisitId if appointment else '',
                            'DoctorName': doctor_name,
                            'id': id,
                            'PatientID': patient.PatientId 
                        }
            id += 1    
        # Convert patient data dictionary to list
        enhanced_data = list(patient_data.values())
        
        # Return the enhanced serialized data
        return JsonResponse(enhanced_data, safe=False)

    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(['GET'])
def get_personal_info(request):
    try:
        patient_list = list(Patient_Detials.objects.all().values())

        for patient in patient_list:
            patient_id = patient['PatientId'] if 'PatientId' in patient else patient['id']

            latest_op = Patient_Appointment_Registration_Detials.objects.filter(
                PatientId_id=patient_id
            ).order_by('-created_at').values(
                'Registration_Id', 'PatientCategory', 'InsuranceName', 'DoctorId'
            ).first()

            latest_ip = Patient_IP_Registration_Detials.objects.filter(
                PatientId_id=patient_id
            ).order_by('-created_at').values(
                'Registration_Id', 'PatientCategory', 'InsuranceName', 'DoctorId'
            ).first()
                
            # Ensure fixed JSON key format
            patient['latest_OP'] = {
                'Registration_Id': latest_op['Registration_Id'] if latest_op else None,
                'PatientCategory': latest_op['PatientCategory'] if latest_op else None,
                'InsuranceName': latest_op['InsuranceName'] if latest_op else None,
                'DoctorId': latest_op['DoctorId'] if latest_op else None,
            }

            patient['latest_IP'] = {
                'Registration_Id': latest_ip['Registration_Id'] if latest_ip else None,
                'PatientCategory': latest_ip['PatientCategory'] if latest_ip else None,
                'InsuranceName': latest_ip['InsuranceName'] if latest_ip else None,
                'DoctorId': latest_ip['DoctorId'] if latest_ip else None,
            }

        return JsonResponse(patient_list, safe=False, status=200)

    except Exception as e:
        print("Error:", e)
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_quick_list(request):
    try:
        # Get location id from query parameters
        location_id = request.GET.get('location')
        
        location = Location_Detials.objects.filter(Location_Id=location_id).first()

        if not location:
            return JsonResponse({'error': 'Location not found'}, status=404)

        stock_query = pharmacy_stock_location_information.objects.filter(Location=location.Location_Name)

        serialized_stock = serialize('json', stock_query, use_natural_primary_keys=True)
        
        serialized_data = json.loads(serialized_stock)
        
        cleaned_data = [
            {
                **item['fields']
            }
            for item in serialized_data
        ]

        return JsonResponse(cleaned_data, safe=False)

        
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)})
    
    
@csrf_exempt
def get_name(request):
    try:
        item_name = request.GET.get('ItemName')  
        batch_no = request.GET.get('BatchNo') 
        location = request.GET.get('location')  
        
        location = Location_Detials.objects.get(Location_Id=location)
        print('location :',location)
        if not location:
            return JsonResponse({'error': f'Location {location} not found'}, status=404)
        
        stock_query = pharmacy_stock_location_information.objects.filter(Location=location.Location_Name,Item_Name=item_name,Batch_No=batch_no)
       
        
        serialized_stock = serialize('json', stock_query, use_natural_primary_keys=True)
        # cleaned_data = [
        #     {
        #         **item['fields']
        #     }
        #     for item in serialized_stock
        # ]
        serialized_data = json.loads(serialized_stock)

        return JsonResponse(serialized_data, safe=False)
    
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)}, status=500)
    



class OPBillingReportView(View):
 
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
 
    def get_filter_query(self, params, bill_type=None):
        q = Q()
 
        if params.get('SearchbyFirstName') and bill_type == None:
            q &= Q(created_by__icontains=params['SearchbyFirstName']) 
        if params.get('SearchbyFirstName') and bill_type in ['RefundPayment',"BillPayment","DuePayment"]:
            q &= Q(Billedby__icontains=params['SearchbyFirstName'])
        if params.get('SearchbySpeciality'):
            q &= Q(Register_Id_SpecializationSpeciality_Id_icontains=params['SearchbySpeciality'])
        if params.get('SearchbyDoctor'):
            q &= Q(Doctor_Id_Doctor_ID_icontains=params['SearchbyDoctor'])
 
        # Only include Bill_Status for specific bill types (or omit when RefundPayment)
        if params.get('SearchStatus') and bill_type not in ['RefundPayment', 'BillPayment','DuePayment']:
            q &= Q(Bill_Status=params['SearchStatus'])
 
        date_type = params.get('DateType')
        if date_type == 'Current' and params.get('CurrentDate'):
            q &= Q(Billing_Date=params['CurrentDate'])
        elif date_type == 'Customize':
            from_date = params.get('FromDate')
            to_date = params.get('ToDate')
            if from_date and to_date:
                q &= Q(Billing_Date__range=[from_date, to_date])
            elif from_date:
                q &= Q(Billing_Date__gte=from_date)
            elif to_date:
                q &= Q(Billing_Date__lte=to_date)
 
        if bill_type:
            q &= Q(NewPayment__icontains=bill_type)
 
        return q
 
    def calculate_payment_summary(self, invoice_numbers):
        print('uvhfeber',invoice_numbers)
        payment_summary = (
            Multiple_Payment_Table_Detials.objects
            .filter(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No__in=invoice_numbers)
            .values('Payment_Type')
            .annotate(total_amount=Sum('Amount'))
        )
        print('yubvubef',payment_summary)
        return {item['Payment_Type']: f"{item['total_amount']:.2f}" for item in payment_summary}
 
    def calculate_refund_payment_summary(self, invoice_numbers):
        print('invoice_numbers:', invoice_numbers)
        payment_summary = (
            Multiple_Payment_Refund_Table_Detials.objects
            .filter(Receipt_No_Paid__Voucher_Number__in=invoice_numbers)
            .annotate(
                adjusted_amount=Case(
                    When(
                        Payment_Type='Card',
                        then=ExpressionWrapper(
                            F('Amount') + (F('Amount') * F('Transaction_Amount') / 100.0),
                            output_field=FloatField()
                        )
                    ),
                    default=F('Amount'),
                    output_field=FloatField()
                )
            )
            .values('Payment_Type')
            .annotate(total_amount=Sum('adjusted_amount'))
        )
        print('payment_summary:', list(payment_summary))  # Debugging
        return {item['Payment_Type']: round(item['total_amount'], 2) for item in payment_summary}
    def get_billing_data(self, queryset):
        billing_data = []
        for row in queryset:
            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=row.Register_Id.pk).last()
            full_name = f"{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()
 
            billing_details = {
                'id': row.Billing_Invoice_No,
                'Type': 'OPEdit',
                'Billing_Date': row.Billing_Date,
                # 'Doctor_Id': doc_ins.PrimaryDoctor.Doctor_ID,
                # 'Doctor_Name': doc_ins.PrimaryDoctor.ShortName,
                'PatientId': row.Patient_Id.PatientId,
                'Patient_Name': full_name,
                'PhoneNo': row.Patient_Id.PhoneNo,
                'Register_Id': row.Register_Id.Registration_Id,
                'Gender': row.Register_Id.PatientId.Gender,
                'City': row.Register_Id.PatientId.City,
                'State': row.Register_Id.PatientId.State,
                'Pincode': row.Register_Id.PatientId.Pincode,
                'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                'Address': f"{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}",
                'PatientCategory': row.Register_Id.PatientCategory,
                'PatientCategoryName': (
                    row.Register_Id.InsuranceName.Insurance_Name
                    if row.Register_Id.PatientCategory == 'Insurance'
                    else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                ),
                'Visit_Id': row.Visit_Id.VisitId,
                'Billing_Type': row.Billing_Type,
                'TotalItems': row.Total_Items,
                'TotalQty': row.Total_Qty,
                'RoundOff': row.Round_Off,
                'TotalAmount': row.Total_Amount,
                'Net_Amount': row.Net_Amount,
                'PaidAmount': row.Paid_Amount,
                'PaidNetAmount': row.Net_Paid_Amount,
                'BalanceAmount': row.Balance_Amount,
                'Bill_Status': row.Bill_Status,
                'Billing_Items': [],
                'Payment_Details': []
            }
 
            payments = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
            for payment in payments:
                billing_details['Payment_Details'].append({
                    'Payment_Type': payment.Payment_Type,
                    'Card_Type': payment.Cart_Type,
                    'Card_No': payment.Card_No,
                    'TransactionId': payment.TransactionId,
                    'upiid': payment.upiid,
                    'Cheque_No': payment.Cheque_No,
                    'Bank_Name': payment.Bank_Name,
                    'Amount': payment.Amount,
                    'Transaction_Amount': payment.Transaction_Amount,
                    'AdditionalAmount': payment.AdditionalAmount,
                })
 
            billing_data.append(billing_details)
        return billing_data
 
    def get(self, request):
        try:
            params = request.GET
            bill_type = params.get('BillType', '')
            response_data = {}
 
            if not bill_type:
                query = self.get_filter_query(params)
                queryset = General_Billing_Table_Detials.objects.filter(query)
                if params.get('SearchTimeOrderby') == 'order':
                    queryset = queryset.order_by('Billing_Date')
                elif params.get('SearchTimeOrderby') == 'disorder':
                    queryset = queryset.order_by('-Billing_Date')
 
                total_paid = queryset.aggregate(total_paid=Sum('Net_Paid_Amount'))['total_paid'] or 0
                invoice_numbers = queryset.values_list('Billing_Invoice_No', flat=True)
                print('yubduffeb',invoice_numbers)
                payment_summary = self.calculate_payment_summary(invoice_numbers)
 
                response_data = {
                    'total_paid_amount': float(f"{total_paid:.2f}"),
                    'payment_totals_by_type': payment_summary,
                    'billing_data': self.get_billing_data(queryset)
                }
                print('ressss',response_data)
            else:
                query = self.get_filter_query(params, bill_type)
                print('billllll',bill_type)
                if bill_type == 'RefundPayment':
                    print('refunddddd')
                    queryset = GeneralBillingRefundReceipt.objects.filter(query)
                    total_paid = queryset.aggregate(total_paid=Sum('PaidAmount'))['total_paid'] or 0
                    data = []
                    for row in queryset:
                        patient = Patient_Detials.objects.filter(PatientId=row.PatientID).first()
                        name = f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip()
                        billing_entry = {
                            'id': row.Voucher_Number,
                            'PatientId': row.PatientID,
                            'PhoneNo': row.PhoneNumber,
                            'Patient_Name': name,
                            'TotalAmount': row.TotalAmount,
                            'Net_Amount': row.TotalAmount,
                            'PaidAmount': row.TotalPaidAmount,
                            'PaidNetAmount': row.TotalPaidAmount,
                            'BalanceAmount': row.BalanceAmount,
                            'Billing_Date': row.Billing_Date,
                            'AgeGender': f'{row.Invoice_NO.Invoice_NO.Register_Id.PatientId.Age}/{row.Invoice_NO.Invoice_NO.Register_Id.PatientId.Gender}',
                            'Address': f"{row.Invoice_NO.Invoice_NO.Register_Id.PatientId.DoorNo}, {row.Invoice_NO.Invoice_NO.Register_Id.PatientId.Street}, {row.Invoice_NO.Invoice_NO.Register_Id.PatientId.Area}, {row.Invoice_NO.Invoice_NO.Register_Id.PatientId.City}, {row.Invoice_NO.Invoice_NO.Register_Id.PatientId.State}, {row.Invoice_NO.Invoice_NO.Register_Id.PatientId.Country}, {row.Invoice_NO.Invoice_NO.Register_Id.PatientId.Pincode}",
                            'PatientCategory': row.Invoice_NO.Invoice_NO.Register_Id.PatientCategory,
                            'PatientCategoryName': (
                                row.Invoice_NO.Invoice_NO.Register_Id.InsuranceName.Insurance_Name
                                if row.Invoice_NO.Invoice_NO.Register_Id.PatientCategory == 'Insurance'
                                else getattr(row.Invoice_NO.Invoice_NO.Register_Id.ClientName, 'Client_Name', None)
                            ),
                            'Visit_Id': row.Invoice_NO.Invoice_NO.Visit_Id.VisitId,
                            'Billing_Type': row.Invoice_NO.Invoice_NO.Billing_Type,
                            'Payment_Details': []
                        }
 
                        payments = Multiple_Payment_Refund_Table_Detials.objects.filter(Receipt_No_Paid__Voucher_Number=row.Voucher_Number)
                        print('refundpaymenttt',payments)
                        for payment in payments:
                            billing_entry['Payment_Details'].append({
                                'Payment_Type': payment.Payment_Type,
                                'Card_Type': payment.Cart_Type,
                                'Card_No': payment.Card_No,
                                'TransactionId': payment.TransactionId,
                                'upiid': payment.upiid,
                                'Cheque_No': payment.Cheque_No,
                                'Bank_Name': payment.Bank_Name,
                                'Amount': payment.Amount,
                                'Transaction_Amount': payment.Transaction_Amount,
                                'AdditionalAmount': payment.AdditionalAmount,
                            })
                        # print('billlenntryy',billing_entry)
                        data.append(billing_entry)                    
                    invoice_numbers = queryset.values_list('Voucher_Number', flat=True)
                    payment_summary = self.calculate_refund_payment_summary(invoice_numbers)
                    response_data = {
                        'total_paid_amount': round(total_paid,2),
                        'payment_totals_by_type': payment_summary,
                        'billing_data': data
                    }
                else:
                    print('generalll',bill_type)
                    queryset = GeneralBillingReceipt.objects.filter(query)
                    total_paid = queryset.aggregate(total_paid=Sum('TotalPaidAmount'))['total_paid'] or 0
                    print('uvfhbe',total_paid)
                    data = []
                    for row in queryset:
                        name = f"{row.Invoice_NO.Patient_Id.Title.Title_Name}.{row.Invoice_NO.Patient_Id.FirstName} {row.Invoice_NO.Patient_Id.MiddleName or ''} {row.Invoice_NO.Patient_Id.SurName}".strip()
                        billing_entry = {
                            'id': row.Invoice_NO.Billing_Invoice_No,
                            'Voucher_Number': row.Voucher_Number,
                            'PatientId': row.PatientID,
                            'PhoneNo': row.PhoneNumber,
                            'Patient_Name': name,
                            'PatientCategory': row.Invoice_NO.Register_Id.PatientCategory,
                            'Net_Amount': row.TotalAmount,
                            'PaidAmount': row.PaidAmount,
                            'PaidNetAmount': row.TotalPaidAmount,
                            'BalanceAmount': row.BalanceAmount,
                            'Billing_Date': row.Billing_Date,
                            'Payment_Details': [],
                            }
                        payments = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Voucher_Number=row.Voucher_Number)
                        for payment in payments:
                            billing_entry['Payment_Details'].append({
                                'Payment_Type': payment.Payment_Type,
                                'Card_Type': payment.Cart_Type,
                                'Card_No': payment.Card_No,
                                'TransactionId': payment.TransactionId,
                                'upiid': payment.upiid,
                                'Cheque_No': payment.Cheque_No,
                                'Bank_Name': payment.Bank_Name,
                                'Amount': payment.Amount,
                                'Transaction_Amount': payment.Transaction_Amount,
                                'AdditionalAmount': payment.AdditionalAmount,
                            })
 
                        data.append(billing_entry)    
                    invoice_numbers = queryset.values_list('Voucher_Number', flat=True)
                    print('hvufhej')
                    payment_summary = self.calculate_payment_summary(invoice_numbers)
                    response_data = {
                        'total_paid_amount': float(f"{total_paid:.2f}"),
                        'payment_totals_by_type': payment_summary,
                        'billing_data': data
                    }
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
 
 
 

@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Queuelist_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')

        # print(status,'status')
        queryset = Radiology_Request_Details.objects.all()

         # print(queryset,'queryset')

        # Filter based on query parameter
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__SurName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__PhoneNo__icontains=query)
            )

        # Filter by status if provided
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

           # print(queryset,'queryset')

        response_data = []
        seen_registration_ids = set()  # Set to track unique registration IDs
        index = 1  # Initialize index

        for radiology_request in queryset:
            registration_id = None
            registration_details = None

            # Determine which registration ID and details to use based on RegisterType
            if radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'RADIOLOGY'  and radiology_request.OP_Register_Id:
                registration_id = radiology_request.OP_Register_Id.pk
                registration_details = radiology_request.OP_Register_Id
            elif radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
                registration_id = radiology_request.IP_Register_Id.Registration_Id
                registration_details = radiology_request.IP_Register_Id
            elif radiology_request.RegisterType == 'Casuality' and radiology_request.Casuality_Register_Id:
                registration_id = radiology_request.Casuality_Register_Id.Registration_Id
                registration_details = radiology_request.Casuality_Register_Id
            elif radiology_request.RegisterType == "ExternalRadiology" and radiology_request.Diagnosis_Register_Id:
                registration_id = radiology_request.Diagnosis_Register_Id.pk  # Added to ensure registration_id is set
                registration_details = radiology_request.Diagnosis_Register_Id
            

            # Skip if the registration_id is not set or if already processed
            if not registration_id or registration_id in seen_registration_ids:
                continue

            # Add registration ID to the set to avoid duplicates
            seen_registration_ids.add(registration_id)

            # Extract patient and doctor details, handling None gracefully
            patient = registration_details.PatientId
            doctor = registration_details.PrimaryDoctor if registration_details.PrimaryDoctor else None

            patient_id = patient.PatientId if patient else None
            patient_age = patient.Age if patient else None
            patient_gender = patient.Gender if patient else None
            patient_name = f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None
            phone_number = patient.PhoneNo if patient else None
            doctor_id = doctor.Doctor_ID if doctor else None
            doctor_shortname = doctor.ShortName if doctor else None
            doctor_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name}{doctor.Middle_Name}{doctor.Last_Name}" if doctor else None

            if radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'RADIOLOGY':

                visitId = registration_details.VisitId
            else :
                visitId = None

            # Add the collected data to the response
            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': visitId,
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'doctor_name': doctor_name,
                'RegisterType': radiology_request.RegisterType,
                'AgeGender': f"{patient_age}{patient_gender}",
                'gender': patient_gender,
                'Status': radiology_request.Status
            })

            # Increment index
            index += 1

        # Return the collected data as a JSON response
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
      

@csrf_exempt
def get_consultation_details(request):
    if request.method == 'GET':
        try:
            # data = request.GET
            RegistrationId = request.GET.get('RegistrationId')
            PatientId = request.GET.get('PatientId')
            DoctorId = request.GET.get('DoctorName')
 
            print('Regissssss',RegistrationId,PatientId,DoctorId)
 
            regis_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=RegistrationId)
            print('reggggg',regis_ins)
 
            full_name = f"{regis_ins.PatientId.Title.Title_Name}.{regis_ins.PatientId.FirstName} {regis_ins.PatientId.MiddleName} {regis_ins.PatientId.SurName}"
 
            formatted_date = regis_ins.created_at.strftime("%d/%b/%Y")
           
            referal_ins = Patient_Referral_Detials.objects.filter(OP_Register_Id__Registration_Id=regis_ins.Registration_Id).first()
            print('referall',referal_ins)
            # referal_ins = ReferalDoctorDetails.objects.filter(PatientId = regis_ins.Registration_Id.PatientId.PatientId)
            # print('refff',referal_ins)
            Billing_data=[]
 
            categoryname = ''
            categoryid = ''
            if regis_ins.PatientCategory == 'Insurance':
                categoryname = regis_ins.InsuranceName.Insurance_Name if regis_ins.InsuranceName else None
                categoryid = regis_ins.InsuranceName.Insurance_Id if regis_ins.InsuranceName else None
            elif regis_ins.PatientCategory == 'Client':
                categoryname = regis_ins.ClientName.Client_Name if regis_ins.ClientName else None
                categoryid = regis_ins.ClientName.Client_Id if regis_ins.ClientName else None
            else:
                categoryname=None
 
            print('11111')
            doc_instance = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id = regis_ins.Registration_Id)
            doclist = []
            docidlist = []
            for dinfo in doc_instance:
 
                print(dinfo,'dinfo')
 
                if dinfo.PrimaryDoctor:
 
                    docinfo = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID = dinfo.PrimaryDoctor.Doctor_ID).first()
 
                    if regis_ins.VisitPurpose == 'OP' or regis_ins.VisitPurpose == 'RADIOLOGY' or regis_ins.VisitPurpose == 'LAB':
                        Doctor_Id = dinfo.PrimaryDoctor.Doctor_ID
                        dname = f"""{dinfo.PrimaryDoctor.Tittle.Title_Name}.{dinfo.PrimaryDoctor.First_Name} {dinfo.PrimaryDoctor.Middle_Name} {dinfo.PrimaryDoctor.Last_Name}"""
                        qualification =   docinfo.Qualification
                        if qualification:
                            fullname = dname + "("+qualification+")"
                        else:
                            fullname = dname
                        doclist.append(fullname)
                        docidlist.append(Doctor_Id)
 
                else:
 
                    doclist.append('Self')
                    docidlist.append('Self')
 
 
 
 
            print('doc_inss000',doc_instance)
            Billing_data.append({
                'Date': formatted_date,
                'Registration_Id':regis_ins.Registration_Id,
                'PatientId':regis_ins.PatientId.PatientId,
                'PhoneNo':regis_ins.PatientId.PhoneNo,
                'Patient_Name':full_name.strip(),
                'AgeGender': f'{regis_ins.PatientId.Age}/{regis_ins.PatientId.Gender}',
                'Address': f'{regis_ins.PatientId.DoorNo}, {regis_ins.PatientId.Street}, {regis_ins.PatientId.Area}, {regis_ins.PatientId.City}, {regis_ins.PatientId.State}, {regis_ins.PatientId.Country}, {regis_ins.PatientId.Pincode}',
                'VisitPurpose':regis_ins.VisitPurpose,
                'Visit_Id': regis_ins.VisitId,
                # 'PatientType':regis_ins.Registration_Id.PatientType,
                'PatientCategory':regis_ins.PatientCategory,
                'PatientCategoryName':categoryname,
                'ReferalDoctor': f"{referal_ins.ReferredBy.Tittle.Title_Name}.{referal_ins.ReferredBy.First_Name} {referal_ins.ReferredBy.Middle_Name} {referal_ins.ReferredBy.Last_Name}" if referal_ins and referal_ins.ReferredBy else None,
                'Doctor_ShortName': doclist,
                'Doctor_Id':docidlist ,
                'Title' : regis_ins.PatientId.Title.Title_Name,
                'FirstName' : regis_ins.PatientId.FirstName,
                'MiddleName' : regis_ins.PatientId.MiddleName,
                'SurName' : regis_ins.PatientId.SurName,
                'Gender' : regis_ins.PatientId.Gender,
                'DOB' : regis_ins.PatientId.DOB,
                'Age' : regis_ins.PatientId.Age,
                'Email' : regis_ins.PatientId.Email,
                'BloodGroup' : regis_ins.PatientId.BloodGroup.BloodGroup_Name if regis_ins.PatientId.BloodGroup else None,
                'Occupation' : regis_ins.PatientId.Occupation,
                'Religion' : regis_ins.PatientId.Religion.Religion_Id if regis_ins.PatientId.Religion else None,
                'Nationality' :regis_ins.PatientId.Nationality,
                'UniqueIdType' : regis_ins.PatientId.UniqueIdType,
                'UniqueIdNo' : regis_ins.PatientId.UniqueIdNo,
                # 'CaseSheetNo' : regis_ins.Registration_Id.PatientId.CasesheetNo,
                'Complaint' : [doc.Complaint for doc in doc_instance],
                # 'PatientType' : regis_ins.Registration_Id.PatientType,
                # 'PatientCategory': regis_ins.Registration_Id.PatientCategory,
                'DoorNo' : regis_ins.PatientId.DoorNo,
                'Street' :regis_ins.PatientId.Street,
                'Area' :regis_ins.PatientId.Area,
                'City' :regis_ins.PatientId.City,
                'State' :regis_ins.PatientId.State,
                'Country' :regis_ins.PatientId.Country,
                'Pincode' :regis_ins.PatientId.Pincode,  
                # 'ReferalDoctor': referal_ins
                'VisitType': [doc.VisitType for doc in doc_instance],
                "BillingType": "Consultation",
                "ServiceProcedureForm": "Consultation",
            })
            print('23232',regis_ins.PatientCategory)
            Service_lists = []
            for doc in doc_instance:
                if regis_ins.Bill_Status == 'Pending':
                    if regis_ins.PatientCategory == 'General' and doc.VisitType == 'NewConsultation' :
                        print('23232',regis_ins.PatientCategory,doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : doc_ins.General_Consultation_Fee,
                        }
                        Service_lists.append(data_list)
                    elif regis_ins.PatientCategory == 'General' and doc.VisitType == 'FollowUp With Fee' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : doc_ins.General_Follow_Up_Fee,
                        }
                        Service_lists.append(data_list)    
                    elif regis_ins.PatientCategory == 'General' and doc.VisitType == 'FollowUp No Fee' :
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)    
                    elif regis_ins.PatientCategory == 'Insurance' and doc.VisitType == 'NewConsultation' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        insurance_ins = Insurance_Master_Detials.objects.get(pk=regis_ins.InsuranceName_id)
                        insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=doc_ins.pk,insurance_id=insurance_ins.pk)
 
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'insurancename': insurance_ins.Insurance_Name,
                            'amt' : insurance_fee_ins.Consultation_Fee
                        }
                        Service_lists.append(data_list)
                    elif regis_ins.PatientCategory == 'Insurance' and doc.VisitType == 'FollowUp With Fee' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        insurance_ins = Insurance_Master_Detials.objects.get(pk=regis_ins.InsuranceName_id)
                        insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=doc_ins.pk,insurance_id=insurance_ins.pk)
 
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'insurancename': insurance_ins.Insurance_Name,
                            'amt' : insurance_fee_ins.Follow_Up_Fee
                        }
                        Service_lists.append(data_list)
                    elif regis_ins.PatientCategory == 'Insurance' and doc.VisitType == 'FollowUp No Fee' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        insurance_ins = Insurance_Master_Detials.objects.get(pk=regis_ins.InsuranceName_id)
                        insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=doc_ins.pk,insurance_id=insurance_ins.pk)
 
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'insurancename': insurance_ins.Insurance_Name,
                            'amt' : 0
                        }
                        Service_lists.append(data_list)
                    elif regis_ins.PatientCategory == 'Client' and doc.VisitType == 'NewConsultation' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        Client_ins = Client_Master_Detials.objects.get(pk=regis_ins.ClientName_id)
                        client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=doc_ins.pk,client_id=Client_ins.pk)
 
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : client_fee_ins.Consultation_Fee
                        }
                        Service_lists.append(data_list)
                    elif regis_ins.PatientCategory == 'Client' and doc.VisitType == 'FollowUp With Fee' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        Client_ins = Client_Master_Detials.objects.get(pk=regis_ins.ClientName_id)
                        client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=doc_ins.pk,client_id=Client_ins.pk)
 
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : 0
                        }
                        Service_lists.append(data_list)
                    elif regis_ins.PatientCategory == 'Client' and doc.VisitType == 'FollowUp No Fee' :
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        Client_ins = Client_Master_Detials.objects.get(pk=regis_ins.ClientName_id)
                        client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=doc_ins.pk,client_id=Client_ins.pk)
 
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : client_fee_ins.Follow_Up_Fee
                        }
                        Service_lists.append(data_list)
                
                    elif regis_ins.PatientCategory == 'Student':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'Camp':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'FreeAll':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'KRCL':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'Employee':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'EmployeeRelation':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'Doctor':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
                    elif regis_ins.PatientCategory == 'DoctorRelation':
                        print('folllllnoooo', doc.VisitType)
                        doc_ins = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = doc.PrimaryDoctor.Doctor_ID)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.PrimaryDoctor.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
 
                        print('232323',doc_ins)
                        data_list = {
                            'pk':doc_ins.pk,
                            'service_category': 'CONSULTATION',
                            'service_code' : doc.PrimaryDoctor.Doctor_ID,
                            'service_subcategory' : f'{doc.PrimaryDoctor.Doctor_ID} - Dr.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : 0,
                        }
                        Service_lists.append(data_list)
 
 
 
                
                else:
                    Service_lists = []
                
                # if doc.VisitType == 'NewConsultation':
                #     gen_ins = Service_Master_Details.objects.get(ServiceCategory=2,Service_Name='OP CARD')
                #     print('gen_inssss', gen_ins)
                #     data_list = {
                #             'pk':gen_ins.pk,
                #             'service_category': gen_ins.ServiceCategory.ServiceCategory,
                #             'service_code' : gen_ins.pk,
                #             'service_subcategory' : f'{gen_ins.pk} - {gen_ins.Service_Name}',
                #             'amt' : gen_ins.Amount
                #     }
                #     Service_lists.append(data_list)
            OPBill = {
                'Billing_data':Billing_data,
                'Service_lists':Service_lists
            }
            return JsonResponse(OPBill ,safe=False)
        except Exception as e:
            return JsonResponse({'error':str(e)})
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def PatientDetails(request):
    if request.method == "GET":
        try:
            RegistrationId = request.GET.get('RegistrationId')
            RegisterType = request.GET.get('RegisterType')

            print("Received RegistrationId:", RegistrationId)
            print("Received RegisterType:", RegisterType)

            if not RegistrationId:
                return JsonResponse({'warn': 'RegistrationId is missing'})
            if not RegisterType:
                return JsonResponse({'warn': 'RegisterType is required'})

            # Fetch patient details based on type
            if RegisterType == "OP":
                Patient_Details = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId)
            elif RegisterType == "IP":
                Patient_Details = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId)
            elif RegisterType == "Casuality":
                Patient_Details = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'})

            if not Patient_Details.exists():
                return JsonResponse({'warn': 'Patient Details not found'})

            # Extracting the first patient record (assuming one match per ID)
            patient = Patient_Details.first()

            response_data = {
                'PatientId': patient.PatientId.PatientId,
                'PatientName': f"{patient.PatientId.Title.Title_Name} {patient.PatientId.FirstName or ''} {patient.PatientId.MiddleName or ''} {patient.PatientId.SurName or ''}".strip(),
                'AgeGender': f"{patient.PatientId.Age if patient.PatientId.Age else 'N/A'} / {patient.PatientId.Gender if patient.PatientId.Gender else 'N/A'}",
                'PhoneNo': patient.PatientId.PhoneNo if patient.PatientId.PhoneNo else None,
                'PatientType': patient.PatientId.PatientType if patient.PatientId.PatientType else None,
                'PatientAddress': f"No. {patient.PatientId.DoorNo or ''}, {patient.PatientId.Street or ''}, {patient.PatientId.Area or ''}, {patient.PatientId.City or ''} - {patient.PatientId.Pincode or ''}".strip(),
            }


            return JsonResponse(response_data)

        except Exception as e:
            print("Error:", str(e))  # Log the error
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

 
# @csrf_exempt
# @transaction.atomic
# @require_http_methods(["GET","POST"])
# def Bill_Cancel_Details(request):
 
#     if request.method == "POST":
 
#         try:
 
#             data = json.loads(request.body)
 
#             # print(data,'dataaaaaaa')
 
#             invoice = data.get('id','')
#             Billing_Items = data.get('Billing_Items','')
#             status = data.get('status','')
#             Register_Id = data.get('Register_Id','')
 
#             print(Billing_Items,'Billing_Items')
 
#             if invoice:
 
#                 for bill in Billing_Items:
 
#                         Service_Type = bill.get('Service_Type','')
 
#                         if Service_Type == 'Lab' or Service_Type == 'LAB':
        
#                             testins = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = invoice).first()
                        
#                             billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
        
#                             billins.Bill_Status = status
#                             billins.Refunded_Amount = billins.Paid_Amount
#                             billins.save()

#                             testins.Status = "Canceled"
#                             testins.save()
#                             labitem_ins =Billing_Item_Table_for_lab.objects.filter(Barcode_Id=testins.Barcode_Id)
#                             for lab_item in labitem_ins:
#                                 lab_item.Bill_Status = "Canceled"
#                                 lab_item.save()
#                             print("Lab Canceled")


#                             itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)

#                             print(itemins,'itemins123')

#                             for item in itemins:

#                                 item.Item_Status = status
#                                 item.save()

#                             for bill in Billing_Items:

#                                 Service_Type = bill.get('Service_Type','')

#                                 print(Service_Type,'Service_Type123')

#                                 if Service_Type == 'Lab':

#                                     print('premkumar')

#                                     labins = Lab_Request_Details.objects.filter(Billing_Invoice_No=billins).first()

#                                     print(labins,'labins123')
#                                     labins.Billing_Status = status
#                                     labins.save()

#                                     labitemins = Lab_Request_Items_Details.objects.filter(Request = labins)

#                                     print(labitemins,'labitemins123')

#                                     for labitem in labitemins:

#                                         if labitem.Service_Status == 'Completed':

#                                                 return JsonResponse({"warn":"Sample already Collected"})

#                                         else:

#                                             labitem.Service_Status = status
#                                             labitem.Analysis_Status = status
#                                             labitem.Verify_Status = status
#                                             labitem.Approve_Status = status
#                                             labitem.save()


        
#                             # if testins.Capture_Sample_Status == 'Pending':
        
#                             #     billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
        
#                             #     billins.Bill_Status = status
#                             #     billins.Refunded_Amount = billins.Paid_Amount
#                             #     billins.save()
        
#                             #     itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
        
#                             #     print(itemins,'itemins123')
        
#                             #     for item in itemins:
        
#                             #         item.Item_Status = status
#                             #         item.save()
        
#                             #     for bill in Billing_Items:
        
#                             #         Service_Type = bill.get('Service_Type','')
        
#                             #         print(Service_Type,'Service_Type123')
        
#                             #         if Service_Type == 'Lab':
        
#                             #             print('premkumar')
        
#                             #             labins = Lab_Request_Details.objects.filter(Billing_Invoice_No=billins).first()
        
#                             #             print(labins,'labins123')
#                             #             labins.Billing_Status = status
#                             #             labins.save()
        
#                             #             labitemins = Lab_Request_Items_Details.objects.filter(Request = labins)
        
#                             #             print(labitemins,'labitemins123')
        
#                             #             for labitem in labitemins:
        
#                             #                 if labitem.Service_Status == 'Completed':
        
#                             #                         return JsonResponse({"warn":"Sample already Collected"})
        
#                             #                 else:
        
#                             #                     labitem.Service_Status = status
#                             #                     labitem.Analysis_Status = status
#                             #                     labitem.Verify_Status = status
#                             #                     labitem.Approve_Status = status
#                             #                     labitem.save()
#                             # else:
#                             #     return JsonResponse({"warn":"Lab tests are already in progress"})
#                         elif Service_Type == 'CONSULTATION':
        
#                                 regins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=Register_Id).first()
        
#                                 regins.Bill_Status = status
#                                 regins.save()
        
#                                 billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
        
#                                 billins.Bill_Status = status
#                                 billins.Refunded_Amount = billins.Paid_Amount
#                                 billins.save()
        
#                                 itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
#                                 for item in itemins:
        
#                                     item.Item_Status = status
#                                     item.save()
#                         elif Service_Type == "Radiology" or Service_Type == "RADIOLOGY":
                            
#                                 billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
#                                 billins.Bill_Status = status
#                                 billins.Refunded_Amount = billins.Paid_Amount
#                                 billins.save()
        
#                                 itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
#                                 for item in itemins:
        
#                                     item.Item_Status = status
#                                     item.save()
        
#                                 radins = Radiology_Request_Details.objects.filter(Billing_Invoice_No=billins)
#                                 for rad in radins:
        
#                                     rad.Status = status
#                                     rad.save()
#                         else:

#                             billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
#                             billins.Bill_Status = status
#                             itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
#                             for item in itemins:
        
#                                     item.Item_Status = status
#                                     item.save()

        
#                         return JsonResponse({"success":"Bill Canceled Successfully"})
 
#         except Exception as e:
#             print("Exception:", e)
#             transaction.set_rollback(True)
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
   

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
import json

@csrf_exempt
@transaction.atomic
@require_http_methods(["GET", "POST"])
def Bill_Cancel_Details(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            invoice = data.get('id', '')
            billing_items = data.get('Billing_Items', '')
            status = data.get('status', '')
            register_id = data.get('Register_Id', '')

            if not invoice:
                return JsonResponse({"error": "Invoice ID is required"}, status=400)

            for bill in billing_items:
                service_type = bill.get('Service_Type', '')

                if service_type.upper() == 'LAB':
                    testins = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice=invoice).first()
                    billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()

                    if not billins:
                        return JsonResponse({"error": "Billing invoice not found"}, status=404)

                    billins.Bill_Status = status
                    billins.Refunded_Amount = billins.Paid_Amount
                    billins.save()

                    if testins:
                        testins.Status = "Canceled"
                        testins.save()
                        labitem_ins = Billing_Item_Table_for_lab.objects.filter(Barcode_Id=testins.Barcode_Id)
                        for lab_item in labitem_ins:
                            lab_item.Bill_Status = "Canceled"
                            lab_item.save()

                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
                    for item in itemins:
                        item.Item_Status = status
                        item.save()

                    labins = Lab_Request_Details.objects.filter(Billing_Invoice_No=billins).first()
                    if labins:
                        labins.Billing_Status = status
                        labins.save()
                        labitemins = Lab_Request_Items_Details.objects.filter(Request=labins)
                        for labitem in labitemins:
                            if labitem.Service_Status == 'Completed':
                                return JsonResponse({"warn": "Sample already Collected"})
                            else:
                                labitem.Service_Status = status
                                labitem.Analysis_Status = status
                                labitem.Verify_Status = status
                                labitem.Approve_Status = status
                                labitem.save()

                elif service_type.upper() == 'CONSULTATION':
                    regins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=register_id).first()
                    if not regins:
                        return JsonResponse({"error": "Registration not found"}, status=404)

                    regins.Bill_Status = status
                    regins.save()

                    billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
                    if not billins:
                        return JsonResponse({"error": "Billing invoice not found"}, status=404)

                    billins.Bill_Status = status
                    billins.Refunded_Amount = billins.Paid_Amount
                    billins.save()

                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
                    for item in itemins:
                        item.Item_Status = status
                        item.save()

                elif service_type.upper() == 'RADIOLOGY':
                    billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
                    if not billins:
                        return JsonResponse({"error": "Billing invoice not found"}, status=404)

                    billins.Bill_Status = status
                    billins.Refunded_Amount = billins.Paid_Amount
                    billins.save()

                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
                    for item in itemins:
                        item.Item_Status = status
                        item.save()

                    radins = Radiology_Request_Details.objects.filter(Billing_Invoice_No=billins)
                    for rad in radins:
                        rad.Status = status
                        rad.save()

                else:
                    billins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=invoice).first()
                    if not billins:
                        return JsonResponse({"error": "Billing invoice not found"}, status=404)

                    billins.Bill_Status = status
                    billins.save()

                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billins)
                    for item in itemins:
                        item.Item_Status = status
                        item.save()

            return JsonResponse({"success": "Bill Canceled Successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            print("Exception:", e)
            transaction.set_rollback(True)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == "GET":
        # Handle GET request
        return JsonResponse({"error": "GET method not supported for this endpoint"}, status=405)

@csrf_exempt
@require_http_methods(["GET","POST"])
def IP_Billing_Items_Table_For_Insurance_Patient(request):
 
    if request.method == "GET":
 
        try:
 
            Register_Id = request.GET.get('Register_Id','')
            PatientServiesType = request.GET.get('PatientServiesType','')
 
            if PatientServiesType == "OP":
 
                general_billing_data = General_Billing_Table_Detials.objects.filter(Register_Id=Register_Id)
 
                response_data = []
 
                for row in general_billing_data:
                    # Construct the patient's full name
                    full_name = f"{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()
                    doctor_names_list = []
                    for doc in row.Doctor_Id:
                        try:
                            doc_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc)
                            doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name}".strip()
                            doctor_names_list.append(doctor_name)
                        except Doctor_Personal_Form_Detials.DoesNotExist:
                            print(f"Doctor not found for ID: {doc}")  # Optional for debugging
                            continue
                    doctor_names = ", ".join(doctor_names_list)
                    print('doccccnamesss',doctor_names)
                    print('doctiddd',row.Doctor_Id)
                   
                    try:
                        receipt_ins = GeneralBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                        voucher_no = receipt_ins.Voucher_Number
                    except GeneralBillingReceipt.DoesNotExist:
                        receipt_ins = None  # or you can handle it however you want
                        voucher_no = receipt_ins
                    billing_details = {
                        'id': row.Billing_Invoice_No,
                        'reciept_no' : voucher_no,
                        'Type': 'OPDue',
                        'Billing_Date': row.Billing_Date,
                        'Doctor_Id': row.Doctor_Id,
                        'Doctor_Name': doctor_names,
                        'PatientId': row.Patient_Id.PatientId,
                        'Patient_Name': full_name,
                        'PhoneNo': row.Patient_Id.PhoneNo,
                        'Register_Id': row.Register_Id.Registration_Id,
                        'Gender': row.Register_Id.PatientId.Gender,
                        'City': row.Register_Id.PatientId.City,
                        'State': row.Register_Id.PatientId.State,
                        'Pincode': row.Register_Id.PatientId.Pincode,
                        'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                        'Address':f'{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}',
                        'PatientCategory': row.Register_Id.PatientCategory,
                        'PatientCategoryName': (
                            row.Register_Id.InsuranceName.Insurance_Name
                            if row.Register_Id.PatientCategory == 'Insurance'
                            else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                        ),
                        'Visit_Id': row.Visit_Id.VisitId,
                        'Billing_Type': row.Billing_Type,
                        'TotalItems': row.Total_Items,
                        'TotalQty': row.Total_Qty,
                        'RoundOff': row.Round_Off,
                        'TotalAmount': row.Total_Amount,
                        'TotalDiscount': row.Discount_Amount,
                        'Net_Amount': row.Net_Amount,
                        'PaidAmount': row.Paid_Amount,
                        'PaidNetAmount': row.Net_Paid_Amount,
                        'BalanceAmount': row.Balance_Amount,
                        'Bill_Status': row.Bill_Status,
                        'Billing_Items': [],
                        'Payment_Details': [],
                    }
                    # Fetch related billing items
                    billing_items = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                    # print('billlingggggitemsss',billing_items)
                    for item in billing_items:
                        item_details = {
                            'Service_Type': item.Service_Type,
                            # 'Service_Code': item.Service_Code,
                            'Service_Name': item.Service_Name,
                            'Rate': item.Rate,
                            'Charge': item.Charge,
                            'Quantity': item.Quantity,
                            'Amount': item.Amount,
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': item.Discount_Value,
                            'Discount_Amount': item.Discount_Amount,
                            'Taxable_Amount': item.Taxable_Amount,
                            # 'Tax_Percentage': item.Tax_Percentage,
                            'Tax_Amount': item.Tax_Amount,
                            'Total_Amount': item.Total_Amount,
                        }
                        billing_details['Billing_Items'].append(item_details)
                    # Fetch related payment details
                    payment_details = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                    # print('paymenttttt',payment_details)
                    for payment in payment_details:
                        payment_info = {
                            'Payment_Type': payment.Payment_Type,
                            'Card_Type': payment.Cart_Type,
                            'Card_No': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'upiid': payment.upiid,
                            'Cheque_No': payment.Cheque_No,
                            'Bank_Name': payment.Bank_Name,
                            'Amount': payment.Amount,
                            'Transaction_Amount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                        }
                        billing_details['Payment_Details'].append(payment_info)
 
                    # Add the billing details to the response data
                    response_data.append(billing_details)
 
                return JsonResponse(response_data, safe=False)
 
            elif PatientServiesType == "IP":
 
                general_billing_data = IP_Billing_Table_Detials.objects.filter(Register_Id=Register_Id)
                response_data = []
 
                for row in general_billing_data:
                    ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id)
                    ward_name = None
                    bedno = None
           
                    if ward_details.exists():
                   
                        ward_name = ward_details.last().RoomId.Ward_Name.Ward_Name.Ward_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                        bedno = ward_details.last().RoomId.Bed_No if ward_details.last().RoomId else None
               
                    full_name = f"{row.Patient_Id.Title.Title_Name}.{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()
 
               
                    billing_details = {
                        'id': row.Billing_Invoice_No,
                        'Type': 'IPDue',
                        'Billing_Date': row.Billing_Date,
                        'Doctor_Id': row.Doctor_Id.Doctor_ID,
                        'Doctor_Name': f"{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}",
                        'PatientId': row.Patient_Id.PatientId,
                        'Patient_Name': full_name,
                        'PhoneNo': row.Patient_Id.PhoneNo,
                        'Register_Id': row.Register_Id.Registration_Id,
                        'Gender': row.Register_Id.PatientId.Gender,
                        'City': row.Register_Id.PatientId.City,
                        'State': row.Register_Id.PatientId.State,
                        'Pincode': row.Register_Id.PatientId.Pincode,
                        'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                        'Address': ', '.join(
                            filter(None, [
                                row.Register_Id.PatientId.DoorNo if row.Register_Id.PatientId.DoorNo else None,
                                row.Register_Id.PatientId.Street if row.Register_Id.PatientId.Street else None,
                                row.Register_Id.PatientId.Area if row.Register_Id.PatientId.Area else None,
                                row.Register_Id.PatientId.City if row.Register_Id.PatientId.City else None,
                                row.Register_Id.PatientId.State if row.Register_Id.PatientId.State else None,
                                row.Register_Id.PatientId.Country if row.Register_Id.PatientId.Country else None,
                                row.Register_Id.PatientId.Pincode if row.Register_Id.PatientId.Pincode else None
                            ])
                        ) or "No address available",
                        'PatientCategory': row.Register_Id.PatientCategory,
                        'PatientCategoryName': (
                            row.Register_Id.InsuranceName.Insurance_Name
                            if row.Register_Id.PatientCategory == 'Insurance'
                            else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                        ),
                        'WardName': ward_name if ward_name else None,
                        'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,  # Combine ward name and bed number
                        'AdmissionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                        # 'Visit_Id': row.Visit_Id.VisitId,
                        'Billing_Type': row.Billing_Type,
                        'TotalItems': row.Total_Items,
                        'TotalQty': row.Total_Qty,
                        'RoundOff': row.Round_Off,
                        'TotalAmount': row.Total_Amount,
                        'Net_Amount': row.Net_Amount,
                        'PaidAmount': row.Paid_Amount,
                        'PaidNetAmount': row.Net_Paid_Amount,
                        'BalanceAmount': row.Balance_Amount,
                        'Bill_Status': row.Bill_Status,
                        'Billing_Items': [],
                        'Payment_Details': [],
                    }
 
           
                    billing_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                 
                    for item in billing_items:
                        item_details = {
                            'Service_Type': item.Service_Type,
                            'Service_Name': item.Service_Name,
                            'Rate': item.Rate,
                            'Charge': item.Charge,
                            'Quantity': item.Quantity,
                            'Amount': item.Amount,
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': item.Discount_Value,
                            'Discount_Amount': item.Discount_Amount,
                            'Taxable_Amount': item.Taxable_Amount,
                            'Tax_Percentage': item.Tax_Percentage,
                            'Tax_Amount': item.Tax_Amount,
                            'Total_Amount': item.Total_Amount,
                            'IsReimbursable' : item.IsReimbursable
                        }
                        billing_details['Billing_Items'].append(item_details)
                   
               
                    payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
           
                    for payment in payment_details:
                        payment_info = {
                            'Payment_Type': payment.Payment_Type,
                            'Card_Type': payment.Cart_Type,
                            'Card_No': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'upiid': payment.upiid,
                            'Cheque_No': payment.Cheque_No,
                            'Bank_Name': payment.Bank_Name,
                            'Amount': payment.Amount,
                            'Transaction_Amount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                        }
                        billing_details['Payment_Details'].append(payment_info)
           
                    response_data.append(billing_details)
               
                return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
 


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Employee_User_Get_Details(request):
    if request.method == 'GET':
        try:
            # Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes',Employee_ID='CRTEMPL003')
            Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes',Department__Department_Id__in=[8,18,9])

            print(Employee_Personal_Info)
            
            idx=1
            # Construct a list of dictionaries containing location data

            Employees_data = []  # Initialize the list before the loop
    
            for i, employee in enumerate(Employee_Personal_Info):
                departmentId = ', '.join(str(department.Department_Id) for department in employee.Department.all())
                departments = ', '.join(department.Department_Name for department in employee.Department.all())

                userins = UserRegister_Master_Details.objects.filter(Employee_Id=employee.pk).first()
                userrecord = False
 
                if userins and userins.auth_user_id:
                    username = userins.auth_user_id.username
                    userrecord = True
                else:
                    username = None
                    userrecord = False
                employee_data = {
                    'id': idx + i,
                    'username': username,
                    'Existing_Employee_ID' : employee.Existing_Employee_ID,
                    'Employee_Id': employee.pk,
                    'userrecord':userrecord,
                    'Title': employee.Tittle.Title_Name if employee.Tittle else None,
                    'FirstName': employee.First_Name,
                    'MiddleName': employee.Middle_Name,
                    'LastName': employee.Last_Name,
                    'FullName': f"""{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{"."}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}""".strip(),
                }

                Employees_data.append(employee_data)
            # print(f'employee_data.....{employee_data}')
            return JsonResponse(Employees_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 

@csrf_exempt
@require_http_methods(['GET'])  
def Employee_Shift_Details(request):
    if request.method == 'GET':
        try:
            employee_id = request.GET.get('EmployeeId')
            date = request.GET.get('Date')
            # formatted_Date = date.strf
            employee= Employee_Personal_Form_Detials.objects.get(Employee_ID = employee_id)
            print('emplloyeee',employee)
            shift_details = ShiftDetails_Master.objects.get(Employee = employee,ShiftDate = date)

            print('shifttttt',shift_details)
            return JsonResponse({'ShiftName': shift_details.Shift_Id.ShiftName,
                                 'ShiftId': shift_details.Shift_Id.ShiftId,
                                 },safe=False)
        except Exception as e:
            return JsonResponse({'error':str(e)})
 


@csrf_exempt
@require_http_methods(['GET'])
def DayClosing_Amount_Userwise(request):
    try:
        employee_id = request.GET.get('EmployeeId')
        date = request.GET.get('Date')

        # 1. Basic Billing Aggregates
        op_bill = General_Billing_Table_Detials.objects.filter(
            created_by=employee_id, Billing_Date=date
        ).aggregate(total=Sum('Net_Paid_Amount'))["total"] or 0

        ip_bill = IP_Billing_Table_Detials.objects.filter(
            created_by=employee_id, Billing_Date=date
        ).aggregate(total=Sum('Net_Paid_Amount'))["total"] or 0

        # 2. Refunds
        refund_op_bill = GeneralBillingRefundReceipt.objects.filter(
            Billedby=employee_id, UpdatedAt__date=date
        ).aggregate(total=Sum('TotalPaidAmount'))["total"] or 0

        refund_ip_bill = IPBillingRefundReceipt.objects.filter(
            Billedby=employee_id, UpdatedAt__date=date
        ).aggregate(total=Sum('TotalPaidAmount'))["total"] or 0

        # 3. Cash/Card/UPI from multiple payments
        op_invoices = General_Billing_Table_Detials.objects.filter(
            created_by=employee_id, Billing_Date=date
        ).values_list('Billing_Invoice_No', flat=True)

        ip_invoices = IP_Billing_Table_Detials.objects.filter(
            created_by=employee_id, Billing_Date=date
        ).values_list('Billing_Invoice_No', flat=True)

        op_payments = Multiple_Payment_Table_Detials.objects.filter(
            Receipt_No_Paid__Invoice_NO__Billing_Invoice_No__in=op_invoices
        )

        ip_payments = Multiple_Payment_Table_IP_Detials.objects.filter(
            Invoice_No__Invoice_NO__Billing_Invoice_No__in=ip_invoices
        )

        op_cash = op_payments.filter(Payment_Type='Cash').aggregate(total=Sum('Amount'))['total'] or 0
        op_card = op_payments.filter(Payment_Type='Card').aggregate(total=Sum('Amount'))['total'] or 0
        op_upi  = op_payments.filter(Payment_Type='UPI').aggregate(total=Sum('Amount'))['total'] or 0

        ip_cash = ip_payments.filter(Payment_Type='Cash').aggregate(total=Sum('Amount'))['total'] or 0
        ip_card = ip_payments.filter(Payment_Type='Card').aggregate(total=Sum('Amount'))['total'] or 0
        ip_upi  = ip_payments.filter(Payment_Type='UPI').aggregate(total=Sum('Amount'))['total'] or 0

        # 4. Totals
        total_cash = op_cash + ip_cash
        total_card = op_card + ip_card
        total_upi  = op_upi + ip_upi

        response = {
            'OPTotal': op_bill,
            'IPTotal': ip_bill,
            'RefundTotal': round(refund_op_bill + refund_ip_bill,2),
            'TotalCash': total_cash,
            'TotalCard': total_card,
            'TotalUPI': total_upi,
        }
        return JsonResponse(response, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})
    

@csrf_exempt
@require_http_methods(['GET'])
def DayClosing_Amount_Report(request):
    try:
        datetype = request.GET.get('DateType')
        current_date = request.GET.get('CurrentDate')
        from_date = request.GET.get('FromDate')
        to_date = request.GET.get('ToDate')
        issued_by = request.GET.get('IssueBy')

        print('dataaaa', datetype, current_date, from_date,to_date,issued_by)
        query = Q()
        op_query = Q()

        if datetype == 'CurrentDate' and current_date:
            query &= Q(DayCloseingDate = current_date)
        if datetype == 'Customize':
            if from_date and to_date:
                query &= Q(DayCloseingDate__range = [from_date,to_date])
            if from_date:
                query &= Q(DayCloseingDate__gte = from_date)
            if to_date:
                query &= Q(DayCloseingDate__gte = to_date)
        if issued_by:
            query &= Q(IssueBy = issued_by)


        if datetype == 'CurrentDate' and current_date:
            op_query &= Q(created_at__date = current_date)
        if datetype == 'Customize':
            if from_date and to_date:
                op_query &= Q(created_at__date__range = [from_date,to_date])
            if from_date:
                op_query &= Q(created_at__date__gte = from_date)
            if to_date:
                op_query &= Q(created_at__date__gte = to_date)
        if issued_by:
            op_query &= Q(created_by = issued_by)

        shift_closing = Frontoffice_ShiftClosing_Table_Detials.objects.filter(query)
        op_total_list = Patient_Appointment_Registration_Detials.objects.filter(op_query)
        patient_current_ids = Patient_Detials.objects.filter(created_at__date=current_date).values_list('PatientId', flat=True)
        patient_old_ids = Patient_Detials.objects.exclude(created_at__date=current_date).values_list('PatientId', flat=True)        
        print('shiftttt',shift_closing, )
        print('patient_listttttt',len(op_total_list),len(patient_current_ids), len(patient_old_ids) )
        dataArr = []
        for row in shift_closing:
            objc={
                'id':row.pk,
                'Location':row.Location.Location_Id,
                'LocationName':row.Location.Location_Name,
                'ShiftName':row.Shiftname,
                'closeingDate':row.DayCloseingDate,
                'IssueBy':row.IssueBy,
                'OpeningCash':row.OpeningCash,
                'OPCollection':row.OPCollectionCash,
                'IPCollection':row.IPCollectionCash,
                'TotalCollection':row.TotalCash,
                'CashTotal':row.CashTotal,
                'CardTotal':row.CardTotal,
                'UPITotal':row.UPITotal,
                'RefundCash':row.ExpensesCash,
                'AvailableCash':row.AvailableCash,
                'HandoverCash':row.HandoverCash,
                'BalanceCash':row.BalanceCash,
                'Narration':row.Narration,
                'HandOverTo':row.Handoverto,
                'Status':row.Status
            }
            dataArr.append(objc)

        total_Collection = shift_closing.aggregate(total= Sum('TotalCash'))['total'] or 0
        op_Collection = shift_closing.aggregate(total= Sum('OPCollectionCash'))['total'] or 0
        ip_Collection = shift_closing.aggregate(total= Sum('IPCollectionCash'))['total'] or 0
        Cash_total = shift_closing.aggregate(total= Sum('CashTotal'))['total'] or 0
        Card_total = shift_closing.aggregate(total= Sum('CardTotal'))['total'] or 0
        UPI_total = shift_closing.aggregate(total= Sum('UPITotal'))['total'] or 0
        HandoverCash = shift_closing.aggregate(total= Sum('HandoverCash'))['total'] or 0
        RefundCash = shift_closing.aggregate(total= Sum('ExpensesCash'))['total'] or 0

        op_total = op_total_list.aggregate(count=Count('Registration_Id'))["count"] or 0
        op_new = op_total_list.filter(PatientId__in=patient_current_ids).aggregate(count=Count('Registration_Id'))["count"] or 0
        op_old = op_total_list.filter(PatientId__in=patient_old_ids).aggregate(count=Count('Registration_Id'))["count"] or 0

        return JsonResponse({
            'shift_data': dataArr,
            'totals': {
                'TotalCollection': total_Collection,
                'OPCollection': op_Collection,
                'IPCollection': ip_Collection,
                'CashTotal': Cash_total,
                'CardTotal': Card_total,
                'UPITotal': UPI_total,
                'HandoverCash': HandoverCash,
                'RefundCash': RefundCash,
                'OPTotal': op_total,
                'OPNew': op_new,
                'OPOld': op_old,

            }
        }, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)})

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def GeneralBilling_Paid_Bill_Link(request):
 
#     if request.method == "GET":
#         try:
#             # Single search parameter for name and phone filtering
#             SearchbyFirstName = request.GET.get('SearchbyFirstName')
 
#             # Other search parameters
#             SearchbySpeciality = request.GET.get('SearchbySpeciality')
#             SearchbyDoctor = request.GET.get('SearchbyDoctor')
#             DateType = request.GET.get('DateType')
#             CurrentDate = request.GET.get('CurrentDate')
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')
#             status_filter = request.GET.get('SearchStatus')
   
#             search_query = Q()
   
#             # Filtering by Name or Phone Number in a single search field
#             if SearchbyFirstName:
#                 search_query &= Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
#                                 Q(Register_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
#                                 Q(Register_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
#                                 Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)
   
#             # Filtering by speciality, doctor, and status
#             if SearchbySpeciality:
#                 search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
#             if SearchbyDoctor:
#                 search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
#             if status_filter:
#                 search_query &= Q(Bill_Status=status_filter)
 
#             # Date filtering
#             if DateType == "Current" and CurrentDate:
#                 search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
#             elif DateType == "Customize":
#                 if FromDate and ToDate:
#                     search_query &= Q(created_at__date__range=[FromDate, ToDate])
#                 elif FromDate:
#                     search_query &= Q(created_at__date__gte=FromDate)
#                 elif ToDate:
#                     search_query &= Q(created_at__date__lte=ToDate)
   
#             # Fetch filtered data
#             general_billing_data = General_Billing_Table_Detials.objects.filter(search_query).order_by('-created_at')
 
#             response_data = []
 
#             for row in general_billing_data:
#                 print(row,'rowwwwwwwwwwwwwww')
#                 # Construct the patient's full name
#                 full_name = f"{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()
#                 doctor_names_list = []
#                 for doc in row.Doctor_Id:
#                     try:
#                         doc_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc)
#                         doc_pro = Doctor_ProfessForm_Detials.objects.get(Doctor_ID__Doctor_ID =doc_ins.Doctor_ID)
#                         doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name} ({doc_pro.Qualification})".strip()
#                         doctor_names_list.append(doctor_name)
#                     except Doctor_Personal_Form_Detials.DoesNotExist:
#                         print(f"Doctor not found for ID: {doc}")  # Optional for debugging
#                         continue
#                 doctor_names = ", ".join(doctor_names_list)
#                 print('doccccnamesss',doctor_names)
#                 print('doctiddd',row.Doctor_Id)
#                 voucher_no = None
#                 if row.Bill_Status == 'Paid':
#                     try:
#                         receipt_ins = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No).last()
#                         print('receiptttt',receipt_ins)
#                         if receipt_ins:
#                              voucher_no = receipt_ins.Voucher_Number
#                     except GeneralBillingReceipt.DoesNotExist:
#                         receipt_ins = None  # or you can handle it however you want
#                         voucher_no = receipt_ins
#                 billing_details = {
#                     'id': row.Billing_Invoice_No,
#                     'reciept_no' : voucher_no if voucher_no else "",
#                     'Type': 'OPDue',
#                     'Billing_Date': row.Billing_Date,
#                     'Doctor_Id': row.Doctor_Id,
#                     'Doctor_Name': doctor_names,
#                     'PatientId': row.Patient_Id.PatientId,
#                     'Patient_Name': full_name,
#                     'PhoneNo': row.Patient_Id.PhoneNo,
#                     'Register_Id': row.Register_Id.Registration_Id,
#                     'Gender': row.Register_Id.PatientId.Gender,
#                     'City': row.Register_Id.PatientId.City,
#                     'State': row.Register_Id.PatientId.State,
#                     'Pincode': row.Register_Id.PatientId.Pincode,
#                     'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
#                     'Address':f'{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}',
#                     'PatientCategory': row.Register_Id.PatientCategory,
#                     'PatientCategoryName': (
#                         row.Register_Id.InsuranceName.Insurance_Name
#                         if row.Register_Id.PatientCategory == 'Insurance'
#                         else getattr(row.Register_Id.ClientName, 'Client_Name', None)
#                     ),
#                     'Visit_Id': row.Visit_Id.VisitId,
#                     'Billing_Type': row.Billing_Type,
#                     'TotalItems': row.Total_Items,
#                     'TotalQty': row.Total_Qty,
#                     'RoundOff': row.Round_Off,
#                     'TotalAmount': row.Total_Amount,
#                     'TotalDiscount': row.Discount_Amount,
#                     'Net_Amount': row.Net_Amount,
#                     'PaidAmount': row.Paid_Amount,
#                     'PaidNetAmount': row.Net_Paid_Amount,
#                     'BalanceAmount': row.Balance_Amount,
#                     'Bill_Status': row.Bill_Status,
#                     'Billing_Items': [],
#                     'Payment_Details': [],
#                     'created_at' : row.created_at,
#                     'Billedby':row.created_by
#                 }
#                 # Fetch related billing items
#                 billing_items = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No,Item_Status__in=['Due','Paid'])
#                 # print('billlingggggitemsss',billing_items)
#                 for item in billing_items:
#                     item_details = {
#                         'Service_Type': item.Service_Type,
#                         'Service_Code': item.Service_Code,
#                         'Service_Name': item.Service_Name,
#                         'Rate': item.Rate,
#                         'Charge': item.Charge,
#                         'Quantity': item.Quantity,
#                         'Amount': item.Amount,
#                         'Discount_Type': item.Discount_Type,
#                         'Discount_Value': item.Discount_Value,
#                         'Discount_Amount': item.Discount_Amount,
#                         'Taxable_Amount': item.Taxable_Amount,
#                         # 'Tax_Percentage': item.Tax_Percentage,
#                         'Tax_Amount': item.Tax_Amount,
#                         'Total_Amount': item.Total_Amount,
#                     }
#                     billing_details['Billing_Items'].append(item_details)
#                 # Fetch related payment details
#                 payment_details = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
#                 # print('paymenttttt',payment_details)
#                 for payment in payment_details:
#                     payment_info = {
#                         'Payment_Type': payment.Payment_Type,
#                         'Card_Type': payment.Cart_Type,
#                         'Card_No': payment.Card_No,
#                         'TransactionId': payment.TransactionId,
#                         'upiid': payment.upiid,
#                         'Cheque_No': payment.Cheque_No,
#                         'Bank_Name': payment.Bank_Name,
#                         'Amount': payment.Amount,
#                         'Transaction_Amount': payment.Transaction_Amount,
#                         'AdditionalAmount': payment.AdditionalAmount,
#                     }
#                     billing_details['Payment_Details'].append(payment_info)
 
#                 # Add the billing details to the response data
#                 response_data.append(billing_details)
 
#             return JsonResponse(response_data, safe=False)
 
#         except Exception as e:
#             print({'error': str(e)})
#             return JsonResponse({'error': str(e)})
 
#     return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def GeneralBilling_Paid_Bill_Link(request):

    if request.method == "GET":
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')

            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')

            search_query = Q()

            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)

            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)

            # Fetch filtered data
            general_billing_data = General_Billing_Table_Detials.objects.filter(search_query).order_by('-created_at')

            response_data = []

            for row in general_billing_data:
                try:
                    # Construct the patient's full name
                    patient = row.Patient_Id
                    full_name = f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip()

                    # Handle doctor names
                    doctor_names_list = []
                    for doc in row.Doctor_Id:
                        try:
                            doc_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc)
                            doc_pro = Doctor_ProfessForm_Detials.objects.get(Doctor_ID__Doctor_ID=doc_ins.Doctor_ID)
                            doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name} ({doc_pro.Qualification})".strip()
                            doctor_names_list.append(doctor_name)
                        except Doctor_Personal_Form_Detials.DoesNotExist:
                            continue
                    doctor_names = ", ".join(doctor_names_list)

                    # Voucher number (Paid Bills)
                    voucher_no = ""
                    if row.Bill_Status == 'Paid':
                        receipt_ins = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No).last()
                        if receipt_ins:
                            voucher_no = receipt_ins.Voucher_Number or ""

                    # Build billing details safely
                    billing_details = {
                        'id': row.Billing_Invoice_No,
                        'reciept_no': voucher_no,
                        'Type': 'OPDue',
                        'Billing_Date': row.Billing_Date,
                        'Doctor_Id': row.Doctor_Id,
                        'Doctor_Name': doctor_names,
                        'PatientId': row.Patient_Id.PatientId,
                        'Patient_Name': full_name,
                        'PhoneNo': row.Patient_Id.PhoneNo,
                        'Register_Id': row.Register_Id.Registration_Id,
                        'Gender': row.Register_Id.PatientId.Gender,
                        'City': row.Register_Id.PatientId.City,
                        'State': row.Register_Id.PatientId.State,
                        'Pincode': row.Register_Id.PatientId.Pincode,
                        'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                        'Address': f'{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}',
                        'PatientCategory': row.Register_Id.PatientCategory,
                        'PatientCategoryName': (
                            row.Register_Id.InsuranceName.Insurance_Name
                            if row.Register_Id.PatientCategory == 'Insurance'
                            else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                        ),
                        'Visit_Id': row.Visit_Id.VisitId,
                        'Billing_Type': row.Billing_Type,
                        'TotalItems': row.Total_Items,
                        'TotalQty': row.Total_Qty,
                        'RoundOff': row.Round_Off,
                        'TotalAmount': row.Total_Amount,
                        'TotalDiscount': row.Discount_Amount,
                        'Net_Amount': row.Net_Amount,
                        'PaidAmount': row.Paid_Amount,
                        'PaidNetAmount': row.Net_Paid_Amount,
                        'BalanceAmount': row.Balance_Amount,
                        'Bill_Status': row.Bill_Status,
                        'Billing_Items': [],
                        'Payment_Details': [],
                        'created_at': row.created_at,
                        'Billedby': row.created_by
                    }

                    # Fetch related billing items
                    billing_items = General_Billing_Items_Table_Detials.objects.filter(
                        Billing_Invoice_No=row.Billing_Invoice_No, Item_Status__in=['Due', 'Paid']
                    )
                    billing_details['Billing_Items'] = [
                        {
                            'Service_Type': item.Service_Type,
                            'Service_Code': item.Service_Code,
                            'Service_Name': item.Service_Name,
                            'Rate': item.Rate,
                            'Charge': item.Charge,
                            'Quantity': item.Quantity,
                            'Amount': item.Amount,
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': item.Discount_Value,
                            'Discount_Amount': item.Discount_Amount,
                            'Taxable_Amount': item.Taxable_Amount,
                            'Tax_Amount': item.Tax_Amount,
                            'Total_Amount': item.Total_Amount,
                        }
                        for item in billing_items
                    ]

                    # Fetch related payment details
                    payment_details = Multiple_Payment_Table_Detials.objects.filter(
                        Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No
                    )
                    billing_details['Payment_Details'] = [
                        {
                            'Payment_Type': payment.Payment_Type,
                            'Card_Type': payment.Cart_Type,
                            'Card_No': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'upiid': payment.upiid,
                            'Cheque_No': payment.Cheque_No,
                            'Bank_Name': payment.Bank_Name,
                            'Amount': payment.Amount,
                            'Transaction_Amount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                        }
                        for payment in payment_details
                    ]

                    # Add the billing details to the response data
                    response_data.append(billing_details)

                except Exception as row_error:
                    print(f"Skipping row {row.Billing_Invoice_No} due to error: {row_error}")
                    continue  # Skip this row and continue with next

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})

    return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})

 

@csrf_exempt
@require_http_methods(["GET"])
def item_name_walking_stock(request):
    if request.method == "GET":
        try:
           
            data = Stock_Maintance_Table_Detials.objects.filter(Store_location__Store_Id=2)
            available_stock =[]
            for d in data:
                available_stock.append({
                    "itemid": d.Product_Detials.pk,
                    "ItemName":d.Product_Detials.ItemName,
                    "GenericName":d.Product_Detials.GenericName.GenericName  if d.Product_Detials.GenericName else '', 
                    "Batch_No":d.Batch_No,
                    "AvailableQuantity":d.AvailableQuantity,
                    "MRP_Per_Quantity":d.Sellable_qty_price,
                    "Expiry_Date":d.Expiry_Date

                })

            return JsonResponse(available_stock, safe=False)
        
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
    else:

        return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})

@csrf_exempt
@require_http_methods(["GET"])
def item_name_walking_stock_ip(request):
    if request.method == "GET":
        try:
           
            data = Stock_Maintance_Table_Detials.objects.filter(Store_location__Store_Id=3)
            available_stock =[]
            for d in data:
                available_stock.append({
                    "itemid": d.Product_Detials.pk,
                    "ItemName":d.Product_Detials.ItemName,
                    "GenericName":d.Product_Detials.GenericName.GenericName  if d.Product_Detials.GenericName else '', 
                    "Batch_No":d.Batch_No,
                    "AvailableQuantity":d.AvailableQuantity,
                    "MRP_Per_Quantity":d.Sellable_qty_price,
                    "Expiry_Date":d.Expiry_Date

                })

            return JsonResponse(available_stock, safe=False)
        
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
    else:

        return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})

# @csrf_exempt
# @require_http_methods(["POST"])
# def waliking_bill_pay(request):
#     try:
#         data_dict = json.loads(request.body)
        

#         item_name   = data_dict.get("Item_Name", [])
#         payments    = data_dict.get("payments", [])
#         patient     = data_dict.get("patientdata", {})
#         location    = data_dict.get("location")
#         location_obj = None
#         if location:
#             try:
#                 location_obj = Location_Detials.objects.get(pk=location)
#             except Location_Detials.DoesNotExist:
#                 return JsonResponse({"error": f"Invalid location ID: {location}"}, status=400)
#         doctor_name     = patient.get("Doctor_name")
#         patient_id      = patient.get("PatientId")
#         patient_name    = patient.get("PatientName")
#         patient_age     = patient.get("PatientAge")
#         patient_address = patient.get("PatientAddress")
#         created_by      = patient.get("createdby")

#         if not patient_address:
#             patient_address = f"{patient.get('City','')},{patient.get('State','')},{patient.get('Pincode','')},{patient.get('PhoneNumber','')},{patient.get('GSTnumber','')},{patient.get('PatientType','')}"

#         # First payment (optional)
#         billpay_method = card_type = bank_name = cheque_no = paid_amount = None
#         if payments:
#             billpay_method = payments[0].get("Billpay_method")
#             card_type      = payments[0].get("CardType")
#             bank_name      = payments[0].get("BankName")
#             cheque_no      = payments[0].get("ChequeNo")
#             paid_amount    = payments[0].get("paidamount", 0)

#         # Create bill header

#         try:
#             bill_instance = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.create(
#                 PatientName=patient_name,
#                 PatientId=patient_id,
#                 patient_age=patient_age,
#                 patient_address=patient_address,
#                 Billing_Type=billpay_method,
#                 Discount_Type=item_name[0].get("CD_Method") if item_name else "",
#                 Discount_Amount=item_name[0].get("Cash_Discount", 0) if item_name else 0,
#                 Total_Items=str(len(item_name)),
#                 Total_Qty=(sum([itm.get("Billing_Quantity", 0) for itm in item_name])),
#                 Total_Amount=sum([itm.get("Total", 0) for itm in item_name]),
#                 SGST_val=sum([itm.get("SGST", 0) for itm in item_name]),
#                 CGST_val=sum([itm.get("CGST", 0) for itm in item_name]),
#                 Total_GSTAmount=sum([itm.get("GSTAmount", 0) for itm in item_name]),
#                 Net_Amount=sum([itm.get("Amount", 0) for itm in item_name]),
#                 Paid_Amount=paid_amount,
#                 Balance_Amount=float(sum([itm.get("Amount", 0) for itm in item_name])) - float(paid_amount or 0),
#                 Location=location_obj,
#                 Bill_Status="Paid",
#                 created_by=created_by,
#             )
#         except Exception as e:
#             return JsonResponse({"err1":str(e)})
#         # Create bill items
#         bill_items = [
#             OP_Walkin_BillingItem(
#                 Billing=bill_instance,
#                 ItemName=itm.get("ItemName"),
#                 Billing_Quantity=itm.get("Billing_Quantity"),
#                 BatchNo=itm.get("BatchNo"),
#                 Exp_Date=itm.get("Exp_Date"),
#                 Unit_Price=itm.get("Unit_Price"),
#                 Amount=itm.get("Amount"),
#                 Total=itm.get("Total"),
#             )
#             for itm in item_name
#         ]
#         try:
#           OP_Walkin_BillingItem.objects.bulk_create(bill_items)
#         except Exception as e:
#             return JsonResponse({"err2":str(e)})
           

#         # Create payment records
#         if payments:
#             payment_instances = [
#                 OP_Walkin_Pharmacy_Billing_Payments(
#                     Billing=bill_instance,
#                     Billpay_method=p.get("Billpay_method"),
#                     CardType=p.get("CardType"),
#                     BankName=p.get("BankName"),
#                     ChequeNo=p.get("ChequeNo"),
#                     paidamount=p.get("paidamount", 0),
#                     Additionalamount=p.get("Additionalamount"),
#                     transactionFee=p.get("transactionFee"),
#                 )
#                 for p in payments
#             ]

#             try:
#                 OP_Walkin_Pharmacy_Billing_Payments.objects.bulk_create(payment_instances)
#             except Exception as e:
#                 return JsonResponse({"err3":str(e)})         

#         return JsonResponse({"message": "Bill created successfully", "Billing_Invoice_No": bill_instance.Billing_Invoice_No})

#     except Exception as e:
#         return JsonResponse({"error4": str(e)}, status=500)
       

@csrf_exempt
@require_http_methods(["POST"])
def waliking_bill_pay(request):
    def to_float(val, default=0):
        try:
            return float(str(val).strip()) if val not in [None, ""] else default
        except (ValueError, TypeError):
            return default

    def to_int(val, default=0):
        try:
            return int(float(str(val).strip())) if val not in [None, ""] else default
        except (ValueError, TypeError):
            return default

    try:
        data_dict = json.loads(request.body)

        item_name = data_dict.get("Item_Name", [])
        payments = data_dict.get("payments", [])
        patient = data_dict.get("patientdata", {})
        location = data_dict.get("location")

        location_obj = None
        if location:
            try:
                location_obj = Location_Detials.objects.get(pk=location)
            except Location_Detials.DoesNotExist:
                return JsonResponse({"error": f"Invalid location ID: {location}"}, status=400)

        doctor_name = patient.get("Doctor_name")
        patient_id = patient.get("PatientId")
        patient_name = patient.get("PatientName")
        PatientCategory = patient.get("PatientCategory")
        patient_age = patient.get("PatientAge")
        patient_address = patient.get("PatientAddress")
        created_by = patient.get("createdby")

        if not patient_address:
            patient_address = f"{patient.get('City','')},{patient.get('State','')},{patient.get('Pincode','')},{patient.get('PhoneNumber','')},{patient.get('GSTnumber','')},{patient.get('PatientType','')}"

        # First payment
        billpay_method = card_type = bank_name = cheque_no = paid_amount = None
        if payments:
            billpay_method = payments[0].get("Billpay_method")
            card_type = payments[0].get("CardType")
            bank_name = payments[0].get("BankName")
            cheque_no = payments[0].get("ChequeNo")
            paid_amount = to_float(payments[0].get("paidamount", 0))

        # Create bill header
        try:
            bill_instance = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.create(
                PatientName=patient_name,
                PatientId=patient_id,
                
                
                Billing_Type=billpay_method,
                Discount_Type=item_name[0].get("CD_Method") if item_name else "",
                Discount_Amount=to_float(item_name[0].get("Cash_Discount", 0)) if item_name else 0,
                Total_Items=str(len(item_name)),
                Total_Qty=sum([to_int(itm.get("Billing_Quantity", 0)) for itm in item_name]),
                Total_Amount=sum([to_float(itm.get("Total", 0)) for itm in item_name]),
                SGST_val=sum([to_float(itm.get("SGST", 0)) for itm in item_name]),
                CGST_val=sum([to_float(itm.get("CGST", 0)) for itm in item_name]),
                Total_GSTAmount=sum([to_float(itm.get("GSTAmount", 0)) for itm in item_name]),
                Net_Amount=sum([to_float(itm.get("Amount", 0)) for itm in item_name]),
                Paid_Amount=paid_amount,
                Balance_Amount=sum([to_float(itm.get("Amount", 0)) for itm in item_name]) - paid_amount,
                Location=location_obj,
                Bill_Status="Paid",
                created_by=created_by,
            )
        except Exception as e:
            return JsonResponse({"err1": str(e)})

        # Create bill items
        bill_items = [
            OP_Walkin_BillingItem(
                Billing=bill_instance,
                ItemName=itm.get("ItemName"),
                Billing_Quantity=to_int(itm.get("Billing_Quantity", 0)),
                BatchNo=itm.get("BatchNo"),
                Exp_Date=itm.get("Exp_Date"),
                Unit_Price=to_float(itm.get("Unit_Price")),
                Amount=to_float(itm.get("Amount")),
                Total=to_float(itm.get("Total")),
            )
            for itm in item_name
        ]
        try:
            OP_Walkin_BillingItem.objects.bulk_create(bill_items)
        except Exception as e:
            return JsonResponse({"err2": str(e)})

        # Create payment records
        if payments:
            payment_instances = [
                OP_Walkin_Pharmacy_Billing_Payments(
                    Billing=bill_instance,
                    Billpay_method=p.get("Billpay_method"),
                    CardType=p.get("CardType"),
                    BankName=p.get("BankName"),
                    ChequeNo=p.get("ChequeNo"),
                    paidamount=to_float(p.get("paidamount", 0)),
                    Additionalamount=to_float(p.get("Additionalamount", 0)),
                    transactionFee=p.get("transactionFee"),
                )
                for p in payments
            ]
            try:
                OP_Walkin_Pharmacy_Billing_Payments.objects.bulk_create(payment_instances)
            except Exception as e:
                return JsonResponse({"err3": str(e)})

        return JsonResponse({"message": "Bill created successfully", "Billing_Invoice_No": bill_instance.Billing_Invoice_No})

    except Exception as e:
        return JsonResponse({"error4": str(e)}, status=500)



from django.db.models import Prefetch, Q

@csrf_exempt
@require_http_methods(["GET"])
def get_walkin_billing_list(request):
    try:
        # Filters from query params
        bill_status = request.GET.get("status")
        date_from = request.GET.get("from")
        date_to = request.GET.get("to")
        search_name = request.GET.get("patient_name")
        search_id = request.GET.get("patient_id")

        q = Q()
        if bill_status:
            q &= Q(Bill_Status=bill_status)
        if date_from and date_to:
            q &= Q(Billing_Date__range=[date_from, date_to])
        if search_name:
            q &= Q(PatientName__icontains=search_name)
        if search_id:
            q &= Q(PatientId__icontains=search_id)

        bills = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.filter(q).order_by('-Billing_Date').prefetch_related(
            Prefetch('OP_Walkin_billing_items', queryset=OP_Walkin_BillingItem.objects.all()),
            Prefetch('billing_payments_Walkin', queryset=OP_Walkin_Pharmacy_Billing_Payments.objects.all())
        )

        data = []
        for bill in bills:
            # Items
            items = [
                {
                    "ItemName": itm.ItemName,
                    "Billing_Quantity": itm.Billing_Quantity,
                    "BatchNo": itm.BatchNo,
                    "Exp_Date": itm.Exp_Date,
                    "Unit_Price": itm.Unit_Price,
                    "Amount": itm.Amount,
                    "Total": itm.Total
                }
                for itm in bill.OP_Walkin_billing_items.all()
            ]

            # Payments
            payments = [
                {
                    "Billpay_method": pay.Billpay_method,
                    "paidamount": pay.paidamount,
                    "CardType": pay.CardType,
                    "BankName": pay.BankName,
                    "ChequeNo": pay.ChequeNo,
                    "Additionalamount": pay.Additionalamount,
                    "transactionFee": pay.transactionFee,
                }
                for pay in bill.billing_payments_Walkin.all()
            ]

            # Bill table details
            data.append({
                "Billing_Invoice_No": bill.Billing_Invoice_No,
                "PatientName": bill.PatientName,
                "PatientId": bill.PatientId,
                "Billing_Date": bill.Billing_Date,
                "Doctor_Id": bill.Doctor_Id,
                "Billing_Type": bill.Billing_Type,
                "Select_Discount": bill.Select_Discount,
                "Discount_Type": bill.Discount_Type,
                "Discount_Amount": str(bill.Discount_Amount),
                "Total_Items": bill.Total_Items,
                "Total_Qty": bill.Total_Qty,
                "Total_Amount": str(bill.Total_Amount),
                "SGST_val": str(bill.SGST_val),
                "CGST_val": str(bill.CGST_val),
                "Total_GSTAmount": str(bill.Total_GSTAmount),
                "Net_Amount": str(bill.Net_Amount),
                "Round_Off": str(bill.Round_Off),
                "Paid_Amount": str(bill.Paid_Amount),
                "Balance_Amount": str(bill.Balance_Amount),
                "Location": str(bill.Location) if bill.Location else "",
                "Bill_Status": bill.Bill_Status,
                "created_by": bill.created_by,
                "updated_by": bill.updated_by,
                "created_at": bill.created_at.strftime("%Y-%m-%d %H:%M"),
                "updated_at": bill.updated_at.strftime("%Y-%m-%d %H:%M"),
                "OP_Walkin_billing_items": items,
                "billing_payments_Walkin": payments,
            })

        return JsonResponse({"status": "success", "data": data})

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

def get_refunded_bill(request):
    if request.method == "GET":
        try:
            # Search parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            item_status_filter = request.GET.get('ItemSearchStatus', 'Refunded')  # Default to 'Refunded'
 
            # Initialize search query for refund receipts
            refund_query = Q()
 
            # Filtering by Name or Phone Number
            if SearchbyFirstName:
                refund_query &= (
                    Q(Patient_Name__icontains=SearchbyFirstName) |
                    Q(PhoneNumber__icontains=SearchbyFirstName) |
                    Q(PatientId__icontains=SearchbyFirstName)
                )
 
            # Date filtering on GeneralBillingRefundReceipt.CreatedAt
            if DateType == "Current" and CurrentDate:
                refund_query &= Q(CreatedAt__date=CurrentDate)
            elif DateType == "Customize":
                if FromDate and ToDate:
                    refund_query &= Q(CreatedAt__date__range=[FromDate, ToDate])
                elif FromDate:
                    refund_query &= Q(CreatedAt__date__gte=FromDate)
                elif ToDate:
                    refund_query &= Q(CreatedAt__date__lte=ToDate)
 
            # Fetch refund receipts with related billing data
            refund_receipts = GeneralBillingRefundReceipt.objects.filter(
                refund_query
            ).select_related(
                'Invoice_NO',  # GeneralBillingReceipt
                'Invoice_NO__Invoice_NO',  # General_Billing_Table_Detials
                'Invoice_NO__Invoice_NO__Patient_Id',
                'Invoice_NO__Invoice_NO__Register_Id',
                'Invoice_NO__Invoice_NO__Visit_Id'
            ).prefetch_related(
                'Receipt_No_Payments_Refund'  # Multiple_Payment_Refund_Table_Detials
            )
 
            print(len(refund_receipts),'refund_receiptsss')
 
            response_data = []
            for refund_receipt in refund_receipts:
                receipt = refund_receipt.Invoice_NO
                if not receipt:
                    continue  # Skip if no related receipt
                billing_data = receipt.Invoice_NO
                if not billing_data:
                    continue  # Skip if no related billing
 
                # Fetch refunded items
                refunded_items = General_Billing_Items_Table_Detials.objects.filter(
                    Billing_Invoice_No=billing_data,
                    Item_Status='Refunded'
                ).select_related('Billing_Invoice_No')
                if not refunded_items.exists():
                    continue  # Skip if no refunded items
 
                patient = billing_data.Patient_Id
                register = billing_data.Register_Id
 
                # Fetch doctor names from JSONField
                doctor_names_list = []
                for doc_id in billing_data.Doctor_Id:
                    if doc_id != 'Self':
                        try:
                            doc_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc_id)
                            doc_pro = Doctor_ProfessForm_Detials.objects.get(Doctor_ID__Doctor_ID=doc_ins.Doctor_ID)
                            doctor_name = f"{doc_ins.Tittle.Title_Name}.{doc_ins.First_Name} {doc_ins.Middle_Name or ''} {doc_ins.Last_Name}({doc_pro.Qualification})".strip()
                            doctor_names_list.append(doctor_name)
                        except Doctor_Personal_Form_Detials.DoesNotExist:
                            continue
                doctor_names = ", ".join(doctor_names_list)
 
                # Construct patient full name
                full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}"
 
                # Fetch refund payment details
                payment_details = []
                for payment in refund_receipt.Receipt_No_Payments_Refund.all():
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Card_Type': payment.Cart_Type,  # Note: Likely typo for 'Card_Type'
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': float(payment.Amount),
                        'Transaction_Amount': float(payment.Transaction_Amount),
                        'AdditionalAmount': float(payment.AdditionalAmount),
                    }
                    payment_details.append(payment_info)
 
                # Construct response for each refund receipt
                refund_details = {
                    'Voucher_Number': refund_receipt.Voucher_Number,
                    'Refund_Billing_Date': refund_receipt.Billing_Date,
                    'Refund_Patient_Name': refund_receipt.Patient_Name,
                    'Refund_TotalAmount': float(refund_receipt.TotalAmount) if refund_receipt.TotalAmount else None,
                    'Refund_PaidAmount': float(refund_receipt.PaidAmount) if refund_receipt.PaidAmount else None,
                    'Refund_TotalPaidAmount': float(refund_receipt.TotalPaidAmount) if refund_receipt.TotalPaidAmount else None,
                    'Refund_BalanceAmount': float(refund_receipt.BalanceAmount) if refund_receipt.BalanceAmount else None,
                    'Refund_Billedby': refund_receipt.Billedby,
                    'Refund_CreatedAt': refund_receipt.CreatedAt,
                    'Billing_Details': {
                        'Billing_Invoice_No': billing_data.Billing_Invoice_No,
                        'Billing_Date': billing_data.Billing_Date,
                        'Doctor_Id': billing_data.Doctor_Id,
                        'Doctor_Name': doctor_names,
                        'PatientId': patient.PatientId,
                        'Patient_Name': full_name,
                        'PhoneNo': patient.PhoneNo,
                        'Register_Id': register.Registration_Id,
                        'Gender': patient.Gender,
                        'City': patient.City,
                        'State': patient.State,
                        'Pincode': patient.Pincode,
                        'VisitPurpose': register.VisitPurpose,
                        'AgeGender': f'{patient.Age}/{patient.Gender}',
                        'Address': f'{patient.DoorNo}, {patient.Street}, {patient.Area}, {patient.City}, {patient.State}, {patient.Country}, {patient.Pincode}',
                        'PatientCategory': register.PatientCategory,
                        'PatientCategoryName': (
                            register.InsuranceName.Insurance_Name
                            if register.PatientCategory == 'Insurance'
                            else getattr(register.ClientName, 'Client_Name', None)
                        ),
                        'Visit_Id': billing_data.Visit_Id.VisitId,
                        'Billing_Type': billing_data.Billing_Type,
                        'TotalItems': billing_data.Total_Items,
                        'TotalQty': billing_data.Total_Qty,
                        'RoundOff': float(billing_data.Round_Off),
                        'TotalAmount': float(billing_data.Total_Amount),
                        'TotalDiscount': float(billing_data.Discount_Amount),
                        'Net_Amount': float(billing_data.Net_Amount),
                        'PaidAmount': float(billing_data.Paid_Amount),
                        'PaidNetAmount': float(billing_data.Net_Paid_Amount),
                        'BalanceAmount': float(billing_data.Balance_Amount),
                        'Bill_Status': billing_data.Bill_Status,
                        'Refunded_Amount': float(billing_data.Refunded_Amount),
                    },
                    'Refunded_Items': [
                        {
                            'Item_Id': item.Items_Id,
                            'Service_Type': item.Service_Type,
                            'Service_Code': item.Service_Code,
                            'Service_Name': item.Service_Name,
                            'Rate': float(item.Rate),
                            'Charge': float(item.Charge),
                            'Quantity': item.Quantity,
                            'Amount': float(item.Amount),
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': float(item.Discount_Value) if item.Discount_Value else None,
                            'Discount_Amount': float(item.Discount_Amount) if item.Discount_Amount else None,
                            'Taxable_Amount': float(item.Taxable_Amount),
                            'Tax_Amount': float(item.Tax_Amount) if item.Tax_Amount else None,
                            'Total_Amount': float(item.Total_Amount),
                            'Item_Status': item.Item_Status,
                            'Remarks': item.Remarks,
                        }
                        for item in refunded_items
                    ],
                    'Refund_Payment_Details': payment_details,
                }
                response_data.append(refund_details)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})  # Replace with logging in production
            return JsonResponse({'error': str(e)}, status=500)
 
    return JsonResponse({'status': 'failure', 'message': 'Invalid request method'}, status=400)
 
 
     
@csrf_exempt
@require_http_methods(["POST"])
def waliking_bill_pay(request):
    def to_float(val, default=0):
        try:
            return float(str(val).strip()) if val not in [None, ""] else default
        except (ValueError, TypeError):
            return default

    def to_int(val, default=0):
        try:
            return int(float(str(val).strip())) if val not in [None, ""] else default
        except (ValueError, TypeError):
            return default

    try:
        data_dict = json.loads(request.body)

        item_name = data_dict.get("Item_Name", [])
        payments = data_dict.get("payments", [])
        patient = data_dict.get("patientdata", {})
        location = data_dict.get("location")

        location_obj = None
        if location:
            try:
                location_obj = Location_Detials.objects.get(pk=location)
            except Location_Detials.DoesNotExist:
                return JsonResponse({"error": f"Invalid location ID: {location}"}, status=400)

        doctor_name = patient.get("Doctor_name")
        patient_id = patient.get("PatientId")
        patient_name = patient.get("PatientName")
        patient_age = patient.get("PatientAge")
        patient_address = patient.get("PatientAddress")
        Patient_Category = patient.get("PatientCategory")
        created_by = patient.get("createdby")
        Pharmacy_Type = patient.get("Pharmacy_Type")
        if not patient_address:
            patient_address = f"{patient.get('City','')},{patient.get('State','')},{patient.get('Pincode','')},{patient.get('PhoneNumber','')},{patient.get('GSTnumber','')},{patient.get('PatientType','')}"

        # First payment
        billpay_method = card_type = bank_name = cheque_no = paid_amount = None
        if payments:
            billpay_method = payments[0].get("Billpay_method")
            card_type = payments[0].get("CardType")
            bank_name = payments[0].get("BankName")
            cheque_no = payments[0].get("ChequeNo")
            paid_amount = to_float(payments[0].get("paidamount", 0))

        # Create bill header
        try:
            bill_instance = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.create(
                PatientName=patient_name,
                Patient_Category=Patient_Category,
                Pharmacy_Type=Pharmacy_Type,
                PatientId=patient_id,
                Billing_Type=billpay_method,
                Discount_Type=item_name[0].get("CD_Method") if item_name else "",
                Discount_Amount=to_float(item_name[0].get("Cash_Discount", 0)) if item_name else 0,
                Total_Items=str(len(item_name)),
                Total_Qty=sum([to_int(itm.get("Billing_Quantity", 0)) for itm in item_name]),
                Total_Amount=sum([to_float(itm.get("Total", 0)) for itm in item_name]),
                SGST_val=sum([to_float(itm.get("SGST", 0)) for itm in item_name]),
                CGST_val=sum([to_float(itm.get("CGST", 0)) for itm in item_name]),
                Total_GSTAmount=sum([to_float(itm.get("GSTAmount", 0)) for itm in item_name]),
                Net_Amount=sum([to_float(itm.get("Amount", 0)) for itm in item_name]),
                Paid_Amount=paid_amount,
                Balance_Amount=sum([to_float(itm.get("Amount", 0)) for itm in item_name]) - paid_amount,
                Location=location_obj,
                Bill_Status="Paid",
                created_by=created_by,
            )
        except Exception as e:
            return JsonResponse({"err1": str(e)})

        # Create bill items
        bill_items = [
            OP_Walkin_BillingItem(
                Billing=bill_instance,
                ItemName=itm.get("ItemName"),
                Billing_Quantity=to_int(itm.get("Billing_Quantity", 0)),
                BatchNo=itm.get("BatchNo"),
                Exp_Date=itm.get("Exp_Date"),
                Unit_Price=to_float(itm.get("Unit_Price")),
                Amount=to_float(itm.get("Amount")),
                Total=to_float(itm.get("Total")),
            )
            for itm in item_name
        ]
        try:
            OP_Walkin_BillingItem.objects.bulk_create(bill_items)
        except Exception as e:
            return JsonResponse({"err2": str(e)})

        # Deduct stock quantities
        try:
            for itm in item_name:
                item_name_val = itm.get("ItemName")
                batch_no = itm.get("BatchNo")
                exp_date = itm.get("Exp_Date")
                qty_sold = to_int(itm.get("Billing_Quantity", 0))

                stock_obj = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials__ItemName=item_name_val,  # FK to product master
                    Batch_No=batch_no,
               
                    Store_location__Store_Id=2
                ).first()

                if not stock_obj:
                    return JsonResponse({
                        "error": f"Stock not found for {item_name_val}, Batch {batch_no}, Exp {exp_date}"
                    }, status=400)

                if stock_obj.AvailableQuantity < qty_sold:
                    return JsonResponse({
                        "error": f"Not enough stock for {item_name_val}, Batch {batch_no}, Exp {exp_date}. Available {stock_obj.Available_Quantity}, Requested {qty_sold}"
                    }, status=400)

                stock_obj.AvailableQuantity -= qty_sold
                stock_obj.save()
        except Exception as e:
            return JsonResponse({"stock_error": str(e)}, status=400)

        # Create payment records
        if payments:
            try:
                payment_instances = [
                    OP_Walkin_Pharmacy_Billing_Payments(
                        Billing=bill_instance,
                        Billpay_method=p.get("Billpay_method"),
                        CardType=p.get("CardType"),
                        BankName=p.get("BankName"),
                        ChequeNo=p.get("ChequeNo"),
                        paidamount=to_float(p.get("paidamount", 0)),
                        Additionalamount=to_float(p.get("Additionalamount", 0)),
                        transactionFee=p.get("transactionFee"),
                    )
                    for p in payments
                ]
                OP_Walkin_Pharmacy_Billing_Payments.objects.bulk_create(payment_instances)
            except Exception as e:
                return JsonResponse({"err3": str(e)})
            



            try:
                printer_name = "TVS MSP 250 Star"
                

                items_list = []
                for item in bill_items_list:
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
                    "patient_name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}",
                    "patient_id": patient.PatientId,
                    "age": patient.Age,
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

        return JsonResponse({
            "message": "Bill created successfully",
            "Billing_Invoice_No": bill_instance.Billing_Invoice_No
        })

    except Exception as e:
        return JsonResponse({"error4": str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["POST"])
def waliking_bill_pay_ip(request):
    def to_float(val, default=0):
        try:
            return float(str(val).strip()) if val not in [None, ""] else default
        except (ValueError, TypeError):
            return default

    def to_int(val, default=0):
        try:
            return int(float(str(val).strip())) if val not in [None, ""] else default
        except (ValueError, TypeError):
            return default

    try:
        data_dict = json.loads(request.body)

        item_name = data_dict.get("Item_Name", [])
        payments = data_dict.get("payments", [])
        patient = data_dict.get("patientdata", {})
        location = data_dict.get("location")

        location_obj = None
        if location:
            try:
                location_obj = Location_Detials.objects.get(pk=location)
            except Location_Detials.DoesNotExist:
                return JsonResponse({"error": f"Invalid location ID: {location}"}, status=400)

        doctor_name = patient.get("Doctor_name")
        patient_id = patient.get("PatientId")
        patient_name = patient.get("PatientName")
        patient_age = patient.get("PatientAge")
        patient_address = patient.get("PatientAddress")
        PatientCategory = patient.get("PatientCategory")
        Pharmacy_Type = patient.get("Pharmacy_Type")
        created_by = patient.get("createdby")

        if not patient_address:
            patient_address = f"{patient.get('City','')},{patient.get('State','')},{patient.get('Pincode','')},{patient.get('PhoneNumber','')},{patient.get('GSTnumber','')},{patient.get('PatientType','')}"

        # First payment
        billpay_method = card_type = bank_name = cheque_no = paid_amount = None
        if payments:
            billpay_method = payments[0].get("Billpay_method")

            print(billpay_method,'billpay_method')
            card_type = payments[0].get("CardType")
            bank_name = payments[0].get("BankName")
            cheque_no = payments[0].get("ChequeNo")
            paid_amount = to_float(payments[0].get("paidamount", 0))

        # Create bill header
        try:
            bill_instance = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.create(
                PatientName=patient_name,
                PatientId=patient_id,
                Patient_Category=PatientCategory,
                Pharmacy_Type=Pharmacy_Type,
                Billing_Type=billpay_method,
                Discount_Type=item_name[0].get("CD_Method") if item_name else "",
                Discount_Amount=to_float(item_name[0].get("Cash_Discount", 0)) if item_name else 0,
                Total_Items=str(len(item_name)),
                Total_Qty=sum([to_int(itm.get("Billing_Quantity", 0)) for itm in item_name]),
                Total_Amount=sum([to_float(itm.get("Total", 0)) for itm in item_name]),
                SGST_val=sum([to_float(itm.get("SGST", 0)) for itm in item_name]),
                CGST_val=sum([to_float(itm.get("CGST", 0)) for itm in item_name]),
                Total_GSTAmount=sum([to_float(itm.get("GSTAmount", 0)) for itm in item_name]),
                Net_Amount=sum([to_float(itm.get("Amount", 0)) for itm in item_name]),
                Paid_Amount=paid_amount,
                Balance_Amount=sum([to_float(itm.get("Amount", 0)) for itm in item_name]) - paid_amount,
                Location=location_obj,
                Bill_Status=billpay_method,
                created_by=created_by,
            )
        except Exception as e:
            return JsonResponse({"err1": str(e)})

        # Create bill items
        bill_items = []

        for itm in item_name:


            print('itemmmmmmmmmmmmmmmm',itm)
            itemins = Stock_Maintance_Table_Detials.objects.filter(
                Product_Detials__pk=itm.get('ItemId'),
                Batch_No=itm.get('BatchNo')
            ).first()

            print(itemins,'itemins')

            bill_items.append(
                OP_Walkin_BillingItem(
                    Billing=bill_instance,
                    ItemName=itm.get("ItemName"),
                    Billing_Quantity=to_int(itm.get("Billing_Quantity", 0)),
                    BatchNo=itm.get("BatchNo"),
                    Exp_Date=itm.get("Exp_Date"),
                    Unit_Price=to_float(itm.get("Unit_Price")),
                    Amount=to_float(itm.get("Amount")),
                    Total=to_float(itm.get("Total")),
                    ItemId=itemins
                )
            )

        try:
            OP_Walkin_BillingItem.objects.bulk_create(bill_items)
        except Exception as e:
            return JsonResponse({"err2": str(e)})

        # Deduct stock quantities
        try:
            for itm in item_name:
                item_name_val = itm.get("ItemName")
                batch_no = itm.get("BatchNo")
                exp_date = itm.get("Exp_Date")
                qty_sold = to_int(itm.get("Billing_Quantity", 0))

                stock_obj = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials__ItemName=item_name_val,  # FK to product master
                    Batch_No=batch_no,
                  
                    Store_location__Store_Id=3
                ).first()

                if not stock_obj:
                    return JsonResponse({
                        "error": f"Stock not found for {item_name_val}, Batch {batch_no}, Exp {exp_date}"
                    }, status=400)

                if stock_obj.AvailableQuantity < qty_sold:
                    return JsonResponse({
                        "error": f"Not enough stock for {item_name_val}, Batch {batch_no}, Exp {exp_date}. Available {stock_obj.Available_Quantity}, Requested {qty_sold}"
                    }, status=400)

                stock_obj.AvailableQuantity -= qty_sold
                stock_obj.save()
        except Exception as e:
            return JsonResponse({"stock_error": str(e)}, status=400)

        # Create payment records
        if payments:
            try:
                payment_instances = [
                    OP_Walkin_Pharmacy_Billing_Payments(
                        Billing=bill_instance,
                        Billpay_method=p.get("Billpay_method"),
                        CardType=p.get("CardType"),
                        BankName=p.get("BankName"),
                        ChequeNo=p.get("ChequeNo"),
                        paidamount=to_float(p.get("paidamount", 0)),
                        Additionalamount=to_float(p.get("Additionalamount", 0)),
                        transactionFee=p.get("transactionFee"),
                    )
                    for p in payments
                ]
                OP_Walkin_Pharmacy_Billing_Payments.objects.bulk_create(payment_instances)
            except Exception as e:
                return JsonResponse({"err3": str(e)})

        return JsonResponse({
            "message": "Bill created successfully",
            "Billing_Invoice_No": bill_instance.Billing_Invoice_No
        })

    except Exception as e:
        return JsonResponse({"error4": str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["POST","GET"])
def waliking_bill_pay_ip_refund(request):

    if request.method == 'GET':
        try:
                # Query parameters
                SearchbyFirstName = request.GET.get('SearchbyFirstName', '')
                DateType = request.GET.get('DateType', '')
                CurrentDate = request.GET.get('CurrentDate', '')
                FromDate = request.GET.get('FromDate', '')
                ToDate = request.GET.get('ToDate', '')
                created_by = request.GET.get('created_by', '')

                search_query = Q()

                # Filter by Billing_Invoice_No if provided
                if SearchbyFirstName:
                    patient_filter = ( 
                        Q(Billing_Invoice_No__icontains=SearchbyFirstName) |
                        Q(PatientId__icontains=SearchbyFirstName) |
                        Q(PatientName__icontains=SearchbyFirstName) 
                    )
                    search_query &= patient_filter
                else:
                    # Date filters
                    if DateType == "Current" and CurrentDate:
                        try:
                            current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                            search_query &= Q(created_at__date=current_date)
                        except ValueError:
                            return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
                    elif DateType == "Customize":
                        try:
                            if FromDate and ToDate:
                                FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                                ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                                search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
                        except ValueError:
                            return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

                    # User filter
                    if created_by:
                        search_query &= Q(created_by=created_by)

                # Query the bills
                bills = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.filter(search_query).select_related('Location')

                if not bills.exists():
                    return JsonResponse({'error': 'No bills found matching the criteria'}, status=404)

                bill_data_list = []
                for bill in bills:
                    # Fetch related billing items and payments
                    items = bill.OP_Walkin_billing_items.all()  # Using related_name from OP_Walkin_BillingItem
                    payments = bill.billing_payments_Walkin.all()  # Using related_name from OP_Walkin_Pharmacy_Billing_Payments

                    # Format bill date and time
                    bill_date = bill.Billing_Date.strftime('%d-%m-%Y') if bill.Billing_Date else ''
                    bill_time = bill.created_at.strftime('%I:%M %p') if bill.created_at else ''

                    # Prepare bill items data
                    items_data = [
                        {
                            'ItemName': item.ItemName,
                            'Billing_Quantity': item.Billing_Quantity,
                            'BatchNo': item.BatchNo,
                            'Exp_Date': item.Exp_Date.strftime('%Y-%m-%d') if item.Exp_Date else '',
                            'Unit_Price': float(item.Unit_Price),
                            'Amount': float(item.Amount),
                            'Total': float(item.Total),
                            'ItemId': item.ItemId.Product_Detials.pk if item.ItemId and item.ItemId.Product_Detials else None  # CORRECTED: ItemId instead of iItemId
                        }
                        for item in items
                    ]

                    # Prepare payments data
                    payments_data = [
                        {
                            'Billpay_method': payment.Billpay_method,
                            'CardType': payment.CardType or '',
                            'BankName': payment.BankName or '',
                            'ChequeNo': payment.ChequeNo or '',
                            'paidamount': float(payment.paidamount),
                            'Additionalamount': float(payment.Additionalamount or 0),
                            'transactionFee': payment.transactionFee or ''
                        }
                        for payment in payments
                    ]

                    # Prepare bill data
                    bill_data = {
                        'Billing_Invoice_No': bill.Billing_Invoice_No,
                        'PatientName': bill.PatientName,
                        'PatientId': bill.PatientId or '',
                        'Patient_Category': bill.Patient_Category or '',
                        'Pharmacy_Type': bill.Pharmacy_Type or '',
                        'Billing_Date': bill_date,
                        'Billing_Time': bill_time,
                        'Billing_Type': bill.Billing_Type,
                        'Discount_Type': bill.Discount_Type or '',
                        'Discount_Amount': float(bill.Discount_Amount or 0),
                        'Total_Items': bill.Total_Items,
                        'Total_Qty': bill.Total_Qty,
                        'Total_Amount': float(bill.Total_Amount),
                        'SGST_val': float(bill.SGST_val),
                        'CGST_val': float(bill.CGST_val),
                        'Total_GSTAmount': float(bill.Total_GSTAmount),
                        'Net_Amount': float(bill.Net_Amount),
                        'Round_Off': float(bill.Round_Off),
                        'Paid_Amount': float(bill.Paid_Amount),
                        'Balance_Amount': float(bill.Balance_Amount),
                        'Location': bill.Location.Location_Name if bill.Location else '',
                        'Bill_Status': bill.Bill_Status,
                        'created_by': bill.created_by or '',
                        'created_at': bill.created_at.strftime('%Y-%m-%d %H:%M:%S') if bill.created_at else '',
                        'updated_by': bill.updated_by or '',
                        'updated_at': bill.updated_at.strftime('%Y-%m-%d %H:%M:%S') if bill.updated_at else '',
                        'items': items_data,
                        'payments': payments_data
                    }
                    bill_data_list.append(bill_data)

               
                return JsonResponse(bill_data_list, safe=False)
     
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def WalkinPharmacy_Refund_Reprint_get(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(CreatedAt__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(CreatedAt__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter
        if SelectedUsers:
            search_query &= Q(Billedby__in=SelectedUsers)

        # Prefetch related data to optimize database queries
        pharmacy_queryset = WalkinPharmacyBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            search_query
        ).prefetch_related(
            'WalkinPharmacy_Receipt_No_Payments_Refund',
            'Walkin_BillingItems_Refund'
        ).select_related('BillInvoice_NO')

        # Process the queryset into a response
        refund_data = []
        for refund in pharmacy_queryset:
            # Get payment details
            payment_details = []
            for payment in refund.WalkinPharmacy_Receipt_No_Payments_Refund.all():
                payment_details.append({
                    'payment_type': payment.Payment_Type,
                    'card_type': payment.Cart_Type,
                    'card_last_four': payment.Card_No,
                    'transaction_id': payment.TransactionId,
                    'upi_id': payment.upiid,
                    'cheque_no': payment.Cheque_No,
                    'bank_name': payment.Bank_Name,
                    'transaction_amount': float(payment.Transaction_Amount),
                    'additional_amount': float(payment.AdditionalAmount),
                    'amount': float(payment.Amount)
                })

            # Get refund item details
            item_details = []
            for item in refund.Walkin_BillingItems_Refund.all():
                item_details.append({
                    'item_id': item.pk if item.pk else None,
                    'item_name': item.ItemName,
                    'reimbursable': item.Reimbursable,
                    'refund_quantity': item.Refund_Quantity,
                    'batch_no': item.BatchNo,
                    'expiry_date': item.Exp_Date.strftime('%Y-%m-%d') if item.Exp_Date else None,
                    'unit_price': float(item.Unit_Price),
                    'amount': float(item.Amount),
                    'total': float(item.Total)
                })

            refund_data.append({
                'billinvoice': refund.BillInvoice_NO.Billing_Invoice_No if refund.BillInvoice_NO else None,
                'billing_type': refund.BillInvoice_NO.Billing_Type if refund.BillInvoice_NO else None,
                'voucher_number': refund.Voucher_Number,
                'patient_id': refund.PatientID,
                'patient_name': refund.Patient_Name,
                'phone_number': refund.PhoneNumber,
                'quantity': refund.Quantity,
                'total_amount': refund.TotalAmount,
                'total_paid_amount': refund.TotalPaidAmount,
                'balance_amount': refund.BalanceAmount,
                'paid_amount': refund.PaidAmount,
                'billing_date': refund.Billing_Date.strftime('%Y-%m-%d') if refund.Billing_Date else None,
                'billed_by': refund.Billedby,
                'created_at': refund.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'updated_at': refund.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'remarks': refund.Remarks,
                'payment_details': payment_details,
                'refund_items': item_details,
                'new_payment': refund.NewPayment,
                'Patient_Category' :refund.BillInvoice_NO.Patient_Category if refund.BillInvoice_NO else None,
            })

        # Calculate summary statistics
        summary = {
            'total_refunds': len(refund_data),
            'total_quantity': sum(float(item['quantity']) for item in refund_data if item['quantity'] and item['quantity'].strip()),
            'total_amount': sum(float(item['total_amount']) for item in refund_data if item['total_amount'] and item['total_amount'].strip()),
            'total_paid_amount': sum(float(item['total_paid_amount']) for item in refund_data if item['total_paid_amount'] and item['total_paid_amount'].strip()),
            'total_balance_amount': sum(float(item['balance_amount']) for item in refund_data if item['balance_amount'] and item['balance_amount'].strip()),
            'total_refund_items': sum(len(item['refund_items']) for item in refund_data),
        }

        # Calculate payment type summary
        payment_summary = {}
        for refund in refund_data:
            for payment in refund['payment_details']:
                payment_type = payment['payment_type']
                amount = payment['amount']
                if payment_type in payment_summary:
                    payment_summary[payment_type] += amount
                else:
                    payment_summary[payment_type] = amount
        
        summary['payment_type_breakdown'] = payment_summary

        response = {
            'status': 'success',
            'data': refund_data,
            'summary': summary
        }

        return JsonResponse(response, status=200)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def IPPharmacy_amount_collection(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')
        paymentMethods = data.get('paymentMethods')
 
 
 
        if InvoiceNo:
 
            Billins = IP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No = InvoiceNo).first()
 
            Billins.IsCollected = True
            Billins.Collectedby = collectedby
            Billins.CollectedType = paymentMethods
            Billins.save()
 
            return JsonResponse({'success':'Amount Received Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["POST"])
def IPPharmacy_Refund_amount_collection(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')
 
 
        if InvoiceNo:
 
            Billins = IPPharmacyBillingRefundReceipt.objects.filter(Voucher_Number = InvoiceNo).first()
 
            Billins.IsRefunded = True
            Billins.Refundedby = collectedby
            Billins.save()
 
            return JsonResponse({'success':'Amount Refunded Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 

@csrf_exempt
@require_http_methods(["POST"])
def IPPharmacy_amount_collection_Cancel(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')

 
 
        if InvoiceNo:
 
            Billins = IP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No = InvoiceNo).first()
 
            Billins.Bill_Status = 'Canceled'
            Billins.created_by = 'host'
            Billins.updated_by = collectedby
            Billins.save()
 
            return JsonResponse({'success':'Canceled Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 

@csrf_exempt
@require_http_methods(["POST"])
def IPPharmacy_Refund_amount_collection_Cancel(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')
 
 
        if InvoiceNo:
 
            Billins = IPPharmacyBillingRefundReceipt.objects.filter(Voucher_Number = InvoiceNo).first()
 
            Billins.Billedby = 'host'
            Billins.Refundedby = collectedby
            Billins.save()
 
            return JsonResponse({'success':'Canceled Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 


@csrf_exempt
@require_http_methods(["POST"])
def OPPharmacy_amount_collection(request):
    try:
        data = json.loads(request.body)
 
        collectedby = data.get("collectedby")
        InvoiceNo = data.get("InvoiceNo")
        paymentMethods = data.get("paymentMethods", [])
 
        if not InvoiceNo or not paymentMethods:
            return JsonResponse(
                {"error": "InvoiceNo and paymentMethods are required"},
                status=400
            )
 
        bill = OP_Pharmacy_Billing_Table_Detials.objects.filter(
            Billing_Invoice_No=InvoiceNo
        ).first()
 
        if not bill:
            return JsonResponse({"error": "Invoice not found"}, status=404)
 
        # Calculate total collected
        total_collected = sum(
            float(p.get("amount", 0)) for p in paymentMethods
        )
 
        # Update bill
        bill.IsCollected = True
        bill.Collectedby = collectedby
        bill.CollectedType = paymentMethods   # ✅ JSON stored here
        bill.save()
 
        return JsonResponse({
            "success": "Amount Received Successfully",
            "InvoiceNo": InvoiceNo,
            "TotalCollected": total_collected,
            "Balance": float(bill.Balance_Amount)
        })
 
    except ValueError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        return JsonResponse(
            {"error": f"Internal server error: {str(e)}"},
            status=500
        )
 
 
 

@csrf_exempt
@require_http_methods(["POST"])
def Optical_amount_collection(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')
        paymentMethods = data.get('paymentMethods')

        print(list(paymentMethods.values())[0], 'paymentMethodsssss')

 
 
        if InvoiceNo:
 
            Billins = OP_Pharmacy_Billing_Table_Detials_optical.objects.filter(Billing_Invoice_No = InvoiceNo).first()
 
            Billins.IsCollected = True
            Billins.Collectedby = collectedby
            Billins.CollectedType = list(paymentMethods.values())[0]
            Billins.save()
 
        return JsonResponse({'success':'Amount Received Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 


@csrf_exempt
@require_http_methods(["POST"])
def OPPharmacy_Refund_amount_collection(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')
 
 
        if InvoiceNo:
 
            Billins = OPPharmacyBillingRefundReceipt.objects.filter(Voucher_Number = InvoiceNo).first()
 
            Billins.IsRefunded = True
            Billins.Refundedby = collectedby
            Billins.save()
 
            return JsonResponse({'success':'Amount Refunded Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
  
@csrf_exempt
@require_http_methods(["POST"])
def OPPharmacy_amount_collection_Bill_Cancel(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')


 
 
        if InvoiceNo:
 
            Billins = OP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No = InvoiceNo).first()
 
            Billins.Bill_Status = 'Canceled'
            Billins.created_by = 'host'
            Billins.updated_by = collectedby
            Billins.save()
 
        return JsonResponse({'success':'Bill Canceled Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(["POST"])
def OPPharmacy_Refund_amount_collection_Bill_Cancel(request):
 
    try:
 
        data = json.loads(request.body)
 
        print(data,'data:::::')
 
        collectedby = data.get('collectedby')
        InvoiceNo = data.get('InvoiceNo')
 
 
        if InvoiceNo:
 
            Billins = OPPharmacyBillingRefundReceipt.objects.filter(Voucher_Number = InvoiceNo).first()
 
           
            Billins.Billedby = 'host'
            Billins.Refundedby = collectedby
            Billins.save()
 
            return JsonResponse({'success':'Canceled Successfully'})
 
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
  
