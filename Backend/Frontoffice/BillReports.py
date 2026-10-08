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
from OutPatient.LabRequests import get_lab_request_details
from OutPatient.ReferDoctor import get_rad_request_details

from django.db import connection, transaction
from .models import Patient_Appointment_Registration_Detials, Patient_Detials
from django.core.serializers import serialize
from Workbench.models import *
from django.db.models import Sum

from django.utils.decorators import method_decorator
from django.views import View

from Lab.models import *
from Lab.BillingView import get_invoice_master_barcode
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to
from OutPatient.LabRequests import model_to_dict, extract_panic_range
from django.db.models import Sum, F, ExpressionWrapper, FloatField, Case, When
from Frontoffice.Registration import get_available_tokenno_by_speciality
from DrugAdminstrations.models import *

from datetime import *
import logging

logger = logging.getLogger(__name__)

current_date = date.today()


def get_Ref_OP_Patients(queryset):
    OPRef_Billing_data = []
    for row in queryset.filter(Service_Type='CONSULTATION', Item_Status='Paid'):
        reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)

        if not reg_id:
            continue

        refopins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id=reg_id,
            Registration_Id__IsReferral='Yes'
        ).first()

        if refopins:
            refdocins = Patient_Referral_Detials.objects.filter(
                OP_Register_Id__Registration_Id=reg_id
            ).first()
            if refdocins:
                patient = getattr(refopins.Registration_Id, 'PatientId', None)
                doctor = getattr(refdocins, 'ReferredBy', None)

                BillDate = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
                formatted_date = BillDate.strftime('%d-%m-%y') if BillDate else ''

                if patient and doctor:
                    data_list = {
                        'PatientId': getattr(patient, 'PatientId', ''),
                        'OPDate': formatted_date,
                        'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}.".upper(),
                        'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".upper(),
                        'DeptName': getattr(refopins.Specialization, 'Speciality_Name', ''),
                        'PaidAmount': float(getattr(row, 'Total_Amount', 0) or 0),
                        'PatientCategory': getattr(refopins.Registration_Id, 'PatientCategory', '')
                    }
                    OPRef_Billing_data.append(data_list)

    return OPRef_Billing_data

def get_New_OP_Patients(queryset, current_date=None):
    OPNew_Billing_data = []
    for row in queryset:

        print(row,'r222222222212')

        reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)

        print(reg_id,'reg_id')

        if not reg_id:
            continue

        newopins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            VisitType='NewConsultation',
            Registration_Id=reg_id,
            # Registration_Id__PatientId__created_at__date=current_date
        ).first()

        if newopins:
            patient = getattr(newopins.Registration_Id, 'PatientId', None)
            doctor = getattr(newopins, 'PrimaryDoctor', None)
            BillDate = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
            formatted_date = BillDate.strftime('%d-%m-%y') if BillDate else ''

            if patient and doctor:
                data_list = {
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".upper(),
                    'DeptName': getattr(newopins.Specialization, 'Speciality_Name', ''),
                    'PaidAmount': float(getattr(row, 'Total_Amount', 0) or 0),
                    'PatientCategory': getattr(newopins.Registration_Id, 'PatientCategory', '')
                }
                OPNew_Billing_data.append(data_list)

    return OPNew_Billing_data

def get_Old_OP_Patients(queryset, current_date=None):
    OPOld_Billing_data = []
    for row in queryset:

        print(row,'r222222222212')
        reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)


        print(reg_id,'reg_iddddddddddddd')

        if not reg_id:
            continue

        oldopins = OP_Patient_Appointment_With_Multiple_Doctor.objects.exclude(
            Registration_Id__PatientId__created_at__date=current_date
        ).filter(
            Registration_Id=reg_id,
            VisitType__in=['FollowUp With Fee','FollowUp No Fee'],
        ).first()

        print(oldopins,'oldopinsdfffffffffffffffd')

        if oldopins:
            patient = getattr(oldopins.Registration_Id, 'PatientId', None)
            doctor = getattr(oldopins, 'PrimaryDoctor', None)

            BillDate = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
            formatted_date = BillDate.strftime('%d-%m-%y') if BillDate else ''

            if patient and doctor:
                data_list = {
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".upper(),
                    'DeptName': getattr(oldopins.Specialization, 'Speciality_Name', ''),
                    'PaidAmount': float(getattr(row, 'Total_Amount', 0) or 0),
                    'PatientCategory': getattr(oldopins.Registration_Id, 'PatientCategory', '')
                }
                OPOld_Billing_data.append(data_list)

    return OPOld_Billing_data

@csrf_exempt
@require_http_methods(["GET"])
def userwise_OP_Patient_Report(request):
    if request.method == 'GET':
        try:
            userid = request.GET.get('userid', '')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')

            search_query = Q()

            current_date = None
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(Billing_Invoice_No__created_at__date=current_date)
                except ValueError:
                    return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'})
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Invoice_No__created_at__date__range=[FromDate, ToDate])
                    elif FromDate:
                        FromDate = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Invoice_No__created_at__date__gte=FromDate)
                    elif ToDate:
                        ToDate = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Invoice_No__created_at__date__lte=ToDate)
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'})



            if userid:
                search_query &= Q(Billing_Invoice_No__created_by=userid)

            queryset = General_Billing_Items_Table_Detials.objects.filter(search_query,Item_Status='Paid',Service_Type='CONSULTATION')

            print(queryset.count(),'queryset')

            total_paid = queryset.aggregate(total_paid=Sum('Total_Amount'))['total_paid'] or 0
            response_data = {
                'total_paid_amount': float(f"{total_paid:.2f}"),
                'OPNew': get_New_OP_Patients(queryset, current_date),
                'OPOld': get_Old_OP_Patients(queryset, current_date),
                'OPRef': get_Ref_OP_Patients(queryset),
            }

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            logging.error(f"Error in userwise_OP_Patient_Report: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)





def get_Ref_OP_Patients_Overall(queryset):
    OPRef_Billing_data = []
    for row in queryset.filter(Service_Type='CONSULTATION',Item_Status='Paid'):
        

        print(row,'r222222222212dtdrrrttrftsfdytdy')
        reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)
        print(reg_id, 'premmmmmmmmmm')

        if not reg_id:
            continue

        refopins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            Registration_Id=reg_id,
            Registration_Id__IsReferral='Yes'
        ).first()
        print(refopins, 'refopins')

        if refopins:
            refdocins = Patient_Referral_Detials.objects.filter(
                OP_Register_Id=reg_id
            ).first()
            if refdocins:
                patient = getattr(refopins.Registration_Id, 'PatientId', None)
                doctor = getattr(refdocins, 'ReferredBy', None)
                BillDate = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
                formatted_date = BillDate.strftime('%d-%m-%y') if BillDate else ''

                if patient and doctor:
                    data_list = {
                        'PatientId': getattr(patient, 'PatientId', ''),
                        'OPDate': formatted_date,
                        'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                        'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".upper(),                        'DeptName': getattr(refopins.Specialization, 'Speciality_Name', ''),
                        'PaidAmount': float(getattr(row, 'Total_Amount', 0) or 0),
                        'PatientCategory': getattr(refopins.Registration_Id, 'PatientCategory', ''),
                        'created_by':row.Billing_Invoice_No.created_by

                    }
                    OPRef_Billing_data.append(data_list)

    return OPRef_Billing_data

def get_New_OP_Patients_Overall(queryset):
    OPNew_Billing_data = []
    for row in queryset.filter(Service_Type='CONSULTATION', Item_Status='Paid'):

        reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)


        if not reg_id:
            continue

        newopins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            VisitType='NewConsultation',
            Registration_Id=reg_id,
        ).first()


        print(newopins, 'newopinspatienttttttttttttt')

        if newopins:
            patient = getattr(newopins.Registration_Id, 'PatientId', None)
            doctor = getattr(newopins, 'PrimaryDoctor', None)

            BillDate = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
            formatted_date = BillDate.strftime('%d-%m-%y') if BillDate else ''

            if patient and doctor:
                data_list = {
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".upper(),                    'DeptName': getattr(newopins.Specialization, 'Speciality_Name', ''),
                    'PaidAmount': float(getattr(row, 'Total_Amount', 0) or 0),
                    'PatientCategory': getattr(newopins.Registration_Id, 'PatientCategory', ''),
                    'created_by':row.Billing_Invoice_No.created_by
                }
                OPNew_Billing_data.append(data_list)

    return OPNew_Billing_data

def get_Old_OP_Patients_Overall(queryset):
    
    OPOld_Billing_data = []
    for row in queryset.filter(Service_Type='CONSULTATION', Item_Status='Paid'):
        reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)

        if not reg_id:
            continue

        oldopins = OP_Patient_Appointment_With_Multiple_Doctor.objects.exclude(Registration_Id__PatientId__created_at__date =  current_date).filter(
            Registration_Id=reg_id,
            VisitType__in=['FollowUp With Fee','FollowUp No Fee'],

        ).first()

        if oldopins:
            patient = getattr(oldopins.Registration_Id, 'PatientId', None)
            doctor = getattr(oldopins, 'PrimaryDoctor', None)
            BillDate = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
            formatted_date = BillDate.strftime('%d-%m-%y') if BillDate else ''

            if patient and doctor:
                data_list = {
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".upper(),                    'DeptName': getattr(oldopins.Specialization, 'Speciality_Name', ''),
                    'PaidAmount': float(getattr(row, 'Total_Amount', 0) or 0),
                    'PatientCategory': getattr(oldopins.Registration_Id, 'PatientCategory', ''),
                    'created_by':row.Billing_Invoice_No.created_by

                }
                OPOld_Billing_data.append(data_list)

    return OPOld_Billing_data


@csrf_exempt
@require_http_methods(["GET"])
def userwise_OP_Patient_Report_Overall(request):
    if request.method == 'GET':
        try:
            userid = request.GET.get('userid', '')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')

            search_query = Q()

            if DateType == "Current" and CurrentDate:
                try:

                    print('comingggggggggg')
                    CurrentDate = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(Billing_Invoice_No__created_at__date=CurrentDate)

                    print(search_query,'search_queryyyyyy')
                except ValueError:
                    return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'})
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Invoice_No__created_at__date__range=[FromDate, ToDate])
                    elif FromDate:
                        FromDate = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Invoice_No__created_at__date__gte=FromDate)
                    elif ToDate:
                        ToDate = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Invoice_No__created_at__date__lte=ToDate)
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'})


            search_query &=  ~Q(Billing_Invoice_No__created_by__in=['host', 'admin'])

            queryset = General_Billing_Items_Table_Detials.objects.filter(search_query,Item_Status='Paid')
            print(queryset.count(), 'querysettttttttttcount')

            total_paid = queryset.aggregate(total_paid=Sum('Total_Amount'))['total_paid'] or 0
            response_data = {
                'total_paid_amount': float(f"{total_paid:.2f}"),
                'OPNew': get_New_OP_Patients_Overall(queryset),
                'OPOld': get_Old_OP_Patients_Overall(queryset),
                'OPRef': get_Ref_OP_Patients_Overall(queryset),
            }

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            import logging
            logging.error(f"Error in userwise_OP_Patient_Report: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)





def get_services_For_Overall(service, store, querysets, response_data):
    services_data_list = []
    service_total = 0
    count = 0
 
    for queryset in querysets:
        # Apply filter on each queryset with both Service_Type and Item_Status='Paid'
        filtered_rows = queryset.filter(Service_Type=service, Item_Status='Paid')
        for row in filtered_rows:
            count = count + 1

            # print(count,'countttttttttttttt')
            patient = getattr(row.Billing_Invoice_No, 'Patient_Id', None)
            reg_id = getattr(row.Billing_Invoice_No, 'Register_Id', None)
            item_id = getattr(row.Items_Id, 'Items_Id', None)
            bill_date = getattr(row.Billing_Invoice_No, 'Billing_Date', None)
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
 
            service_name = row.Service_Name
            cleaned_name = service_name.split(' - ')[1] if ' - ' in service_name else service_name
 
            amount = float(getattr(row, 'Total_Amount', 0) or 0)
            service_total += amount
 
            # print(store,'store',service)
 
            if service == 'RADIOLOGY':

                # print(row.Service_Code,row.Service_Type,'raddddddddddd')

                if row.Service_Code:
 
                    Rad_Dept = TestName_Details.objects.filter(Test_Code=row.Service_Code).first()
                    Sub_Dept_Name = Rad_Dept.Radiology_Id.Radiology_Name
    
                    services_data_list.append({
                        'ItemId': row.Items_Id,
                        'PatientId': getattr(patient, 'PatientId', ''),
                        'OPDate': formatted_date,
                        'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                        'ServiceName': cleaned_name,
                        'PaidAmount': amount,
                        'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                        'created_by': getattr(row.Billing_Invoice_No, 'created_by', ''),
                        'RadiologyDept' : Sub_Dept_Name,
                        'Invoiveno' : getattr(row.Billing_Invoice_No, 'Billing_Invoice_No', ''),
 
 
                    })
            else :
 
                services_data_list.append({
                    'ItemId': row.Items_Id,
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ServiceName': cleaned_name,
                    'PaidAmount': amount,
                    'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                    'created_by': getattr(row.Billing_Invoice_No, 'created_by', ''),
                    'Invoiveno' : getattr(row.Billing_Invoice_No, 'Billing_Invoice_No', ''),
 
 
                })
 
 
    response_data[store] = services_data_list
    return service_total
 
# @csrf_exempt
# @require_http_methods(["GET"])
# def Services_Wise_Report(request):
#     try:
#         # Extract request parameters
#         userid = request.GET.get('userid', '')
#         DateType = request.GET.get('DateType', '')
#         CurrentDate = request.GET.get('CurrentDate', '')
#         FromDate = request.GET.get('FromDate', '')
#         ToDate = request.GET.get('ToDate', '')

#         print(FromDate,'FromDate',ToDate,'ToDate')
#         Servicename = request.GET.get('Servicename', '')
#         selected_users = [
#             value for key, value in request.GET.items()
#             if key.endswith('[UserName]')
#         ]
#         print('userrrrrrr', selected_users)
#         if DateType not in ["Current", "Customize"]:
#             return JsonResponse({'error': 'Invalid DateType. Must be "Current" or "Customize".'}, status=400)
 
#         # Build query filter
#         search_query = Q()
#         if DateType == "Current" and CurrentDate:
#             try:
#                 CurrentDate = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
#                 search_query &= Q(Billing_Invoice_No__created_at__date=CurrentDate)
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
        
#         elif DateType == "Customize":
#             try:
#                 if FromDate and ToDate:
#                         FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
#                         ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
#                         search_query &= Q(Billing_Invoice_No__created_at__date__range=[FromDate_dt, ToDate_dt])

#                         print(search_query,'search_query')
#                 # if FromDate:
#                 #     FromDate = datetime.strptime(FromDate, '%Y-%m-%d').date()
#                 #     search_query &= Q(Billing_Invoice_No__created_at__date__gte=FromDate)
#                 # if ToDate:
#                 #     ToDate = datetime.strptime(ToDate, '%Y-%m-%d').date()
#                 #     search_query &= Q(Billing_Invoice_No__created_at__date__lte=ToDate)
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
#         if selected_users:
#             try:
#                 search_query &= Q(Billing_Invoice_No__created_by__in=selected_users)
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
 
#         # Extract selected service categories from request
#         selected_services = [
#             value for key, value in request.GET.items()
#             if key.endswith('[ServiceCategory]')
#         ]
 
 
#         # Determine which services to include
#         if selected_services:
#             Servicedata = selected_services
#             print('wygfviuwerbg')
#         elif Servicename:
#             Servicedata = [Servicename]
#         else:
#             Servicedata = Service_Category_Masters.objects.values_list('ServiceCategory', flat=True)
#             print('3333')
#         # Filter both OP and IP records (only Paid)
#         op_queryset = General_Billing_Items_Table_Detials.objects.exclude(Billing_Invoice_No__created_by__in = ['host','admin']).filter(search_query, Item_Status='Paid')
#         ip_queryset = IP_Billing_Items_Table_Detials.objects.exclude(Billing_Invoice_No__created_by__in = ['host','admin']).filter(search_query, Item_Status='Paid')


#         print(op_queryset.count(),'opitemssssssssssss')
 
#         response_data = {}
#         total_selected_amount = 0
 
#         # Process each selected service
#         for service in Servicedata:
#             store = f"{service}_DATA"
#             subtotal = get_services_For_Overall(service, store, [op_queryset, ip_queryset], response_data)
#             total_selected_amount += subtotal
 
#         response_data["total_paid_amount"] = float(f"{total_selected_amount:.2f}")
#         return JsonResponse(response_data, safe=False)
 
#     except Exception as e:
#         logger.error(f"Error in Services_Wise_Report: {str(e)} | Params: {request.GET}")
#         return JsonResponse({'error': str(e)}, status=500)
   
   
@csrf_exempt
@require_http_methods(["GET"])
def Services_Wise_Report(request):
    try:


        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedServices = request.GET.getlist('selectedServices[]')

        search_query = Q()


        if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
                    elif FromDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__gte=FromDate_dt)
                    elif ToDate:
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__lte=ToDate_dt)
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        if SelectedUsers :
            try:
                search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
 

        if selectedServices:

            try:
                search_query &= Q(Service_Type__in=selectedServices)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
 

        op_queryset = General_Billing_Items_Table_Detials.objects.exclude(Billing_Invoice_No__created_by__in = ['host','admin']).filter(search_query, Item_Status='Paid')

        response_data = {}
        total_selected_amount = 0

        services_data_list = []
        service_total = 0
        count = 0

        for data in op_queryset:

            patient = getattr(data.Billing_Invoice_No, 'Patient_Id', None)
            reg_id = getattr(data.Billing_Invoice_No, 'Register_Id', None)
            item_id = getattr(data.Items_Id, 'Items_Id', None)
            bill_date = getattr(data.Billing_Invoice_No, 'Billing_Date', None)
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
 
            service_name = data.Service_Name
            cleaned_name = service_name.split(' - ')[1] if ' - ' in service_name else service_name
 
            amount = float(getattr(data, 'Total_Amount', 0) or 0)
            service_total += amount

            if data.Service_Type == 'RADIOLOGY':

                # print(row.Service_Code,row.Service_Type,'raddddddddddd')

                if data.Service_Code:
 
                    Rad_Dept = TestName_Details.objects.filter(Test_Code=data.Service_Code).first()
                    Sub_Dept_Name = Rad_Dept.Radiology_Id.Radiology_Name
    
                    services_data_list.append({
                        'ItemId': data.Items_Id,
                        'PatientId': getattr(patient, 'PatientId', ''),
                        'OPDate': formatted_date,
                        'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                        'ServiceName': cleaned_name,
                        'PaidAmount': amount,
                        'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                        'created_by': getattr(data.Billing_Invoice_No, 'created_by', ''),
                        'RadiologyDept' : Sub_Dept_Name,
                        'Invoiveno' : getattr(data.Billing_Invoice_No, 'Billing_Invoice_No', ''),
                        'Service_Type': data.Service_Type 
 
 
                    })
            else :
 
                services_data_list.append({
                    'ItemId': data.Items_Id,
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ServiceName': cleaned_name,
                    'PaidAmount': amount,
                    'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                    'created_by': getattr(data.Billing_Invoice_No, 'created_by', ''),
                    'Invoiveno' : getattr(data.Billing_Invoice_No, 'Billing_Invoice_No', ''),
                    'Service_Type': data.Service_Type 
 
 
                })


        return JsonResponse(services_data_list, safe=False)
 
    except Exception as e:
        logger.error(f"Error in Services_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': str(e)}, status=500)

from django.db import DatabaseError
 
@csrf_exempt
@require_http_methods(['GET'])
def Consultation_Paid_userwiseReport(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
 
        def fetch_data(visit_types):
            search_query = Q(VisitType__in=visit_types)
 
            # Date filters
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
           
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
                    elif FromDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__gte=FromDate_dt)
                    elif ToDate:
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__lte=ToDate_dt)
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
            op_appointments = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                search_query
            ).select_related('Registration_Id', 'PrimaryDoctor', 'Specialization')
 
            if selected_specialities:
                op_appointments = op_appointments.filter(Specialization__Speciality_Id__in=selected_specialities)
 
            patient_list = []
            grand_total = Decimal('0.00')
 
            for op in op_appointments:
                patient = getattr(op, 'Registration_Id', None).PatientId if getattr(op, 'Registration_Id', None) else None
                register = getattr(op, 'Registration_Id', None)
                doctor = getattr(op, 'PrimaryDoctor', None)
 
                if not register:
                    continue
 
                billings = General_Billing_Table_Detials.objects.filter(Register_Id=register).exclude(created_by__in=['host', 'admin'])
 
                if userid:
                    billings = billings.filter(created_by=userid)
 
                if SelectedUsers:
                    print('inside useressssssssssss')
                    billings = billings.filter(created_by__in=SelectedUsers)
 
                for bill in billings:
                    bill_date = getattr(bill, 'Billing_Date', None)
                    formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
 
                    # Fetch receipt details for the current bill
                    receipt = GeneralBillingReceipt.objects.filter(Invoice_NO=bill).first()
 
                    # Fetch payment details for the receipt
                    payment_method = 'Unknown'
                    receipt_number = receipt.Voucher_Number if receipt else '-'
                    if receipt:
                        payment = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid=receipt).first()
                        payment_method = payment.Payment_Type if payment else 'Unknown'
 
                    items = General_Billing_Items_Table_Detials.objects.filter(
                        Billing_Invoice_No=bill,
                        Service_Type='CONSULTATION',
                        Item_Status='Paid',
                        Service_Code=doctor.Doctor_ID if doctor else None
                    )
 
                    itemscount = General_Billing_Items_Table_Detials.objects.filter(
                        Billing_Invoice_No=bill,
                        Service_Type='CONSULTATION',
                        Item_Status='Paid'
                    )
 
                    for item in items:
                        total_amount = item.Total_Amount if item.Total_Amount is not None else Decimal('0.00')
                        discount_amount = bill.Discount_Amount if bill.Discount_Amount is not None else Decimal('0.00')
                        discount_amount = discount_amount / itemscount.count() if itemscount.count() > 0 else Decimal('0.00')
                        paid_amount = total_amount - discount_amount
                        grand_total += paid_amount
 
                        data = {
                            'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                            'BillDate': formatted_date,
                            'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''} {getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".strip().upper(),
                            'Age': getattr(patient, 'Age', '') or '',
                            'Doctor_Name': f"{getattr(doctor, 'First_Name', '') or ''} {getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}".strip().upper(),
                            'DeptName': getattr(op.Specialization, 'Speciality_Name', '') if op.Specialization else '',
                            'PaidAmount': float(paid_amount),
                            'PatientCategory': getattr(register, 'PatientCategory', '') if register else '',
                            'Billedby': getattr(bill, 'created_by', ''),
                            'ServiceName': item.Service_Name,
                            'Invoiveno': bill.Billing_Invoice_No,
                            'ReceiptNumber': receipt_number,
                            'PaymentMethod': payment_method
                        }
                        patient_list.append(data)
 
            return {
                'patients': patient_list,
                'billcount': len(patient_list),
                'grand_total': grand_total
            }
 
        new_data = fetch_data(['NewConsultation'])
        old_data = fetch_data(['FollowUp With Fee', 'FollowUp No Fee'])
 
        response_data = {
            'newpatients': new_data['patients'],
            'newbillcount': new_data['billcount'],
            'new_grand_total': float(new_data['grand_total']),
            'oldpatients': old_data['patients'],
            'oldbillcount': old_data['billcount'],
            'old_grand_total': float(old_data['grand_total']),
            'Total': float(new_data['grand_total'] + old_data['grand_total'])
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 


 
@csrf_exempt
@require_http_methods(['GET'])
def Refund_userwiseReport(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        def fetch_data():
            search_query = Q()

            # Date filters
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(Billing_Date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Date__range=[FromDate_dt, ToDate_dt])
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')

            refunds = GeneralBillingRefundReceipt.objects.filter(
                search_query
            ).exclude(Billedby__in=['host', 'admin'])

            if userid:
                refunds = refunds.filter(Billedby=userid)

            if SelectedUsers:
                refunds = refunds.filter(Billedby__in=SelectedUsers)

            refund_list = []
            grand_total = Decimal('0.00')

            for refund in refunds:
                bill_date = getattr(refund, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''

                paid_amount = Decimal(refund.PaidAmount) if refund.PaidAmount else Decimal('0.00')
                grand_total += paid_amount

                # Fetch related payment methods from Multiple_Payment_Refund_Table_Detials
                payment_details = Multiple_Payment_Refund_Table_Detials.objects.filter(
                    Receipt_No_Paid=refund
                ).values('Payment_Type', 'Amount')

                # Collect payment methods and their amounts
                payment_methods = [
                    {
                        'Payment_Type': detail['Payment_Type'],
                        'Transaction_Amount': float(detail['Amount'])
                    } for detail in payment_details
                ]

                data = {
                    'PatientId': refund.PatientID,
                    'BillDate': formatted_date,
                    'Patient_Name': refund.Patient_Name.upper(),
                    'PhoneNumber': refund.PhoneNumber,
                    'TotalAmount': float(refund.TotalAmount) if refund.TotalAmount else 0.0,
                    'TotalPaidAmount': float(refund.TotalPaidAmount) if refund.TotalPaidAmount else 0.0,
                    'BalanceAmount': float(refund.BalanceAmount) if refund.BalanceAmount else 0.0,
                    'PaidAmount': float(paid_amount),
                    'Billedby': refund.Billedby,
                    'VoucherNumber': refund.Voucher_Number,
                    'InvoiceNo': refund.Invoice_NO.Invoice_NO.Billing_Invoice_No if refund.Invoice_NO else '',
                    'PaymentMethods': payment_methods  # Add payment methods to response
                }
                refund_list.append(data)

            return {
                'refunds': refund_list,
                'refundcount': len(refund_list),
                'grand_total': float(grand_total)
            }

        refund_data = fetch_data()

        response_data = {
            'refunds': refund_data['refunds'],
            'refundcount': refund_data['refundcount'],
            'grand_total': refund_data['grand_total']
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



@csrf_exempt
@require_http_methods(['GET'])
def Refund_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        def fetch_data():
            search_query = Q()

            # Date filters
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(Billing_Date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Date__range=[FromDate_dt, ToDate_dt])
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')

            refunds = GeneralBillingRefundReceipt.objects.filter(
                search_query
            ).exclude(Billedby__in=['host', 'admin'])

            if userid:
                refunds = refunds.filter(Billedby=userid)

            if SelectedUsers:
                refunds = refunds.filter(Billedby__in=SelectedUsers)

            refund_list = []
            grand_total = Decimal('0.00')

            for refund in refunds:
                bill_date = getattr(refund, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''

                paid_amount = Decimal(refund.PaidAmount) if refund.PaidAmount else Decimal('0.00')
                grand_total += paid_amount

                # Fetch the associated bill details
                try:
                    receipt = refund.Invoice_NO
                    bill = receipt.Invoice_NO if receipt else None
                    invoice_no = bill.Billing_Invoice_No if bill else ''
                except AttributeError:
                    invoice_no = ''

                # Fetch refunded items for this bill (assuming Item_Status indicates refund; adjust if needed)
                refunded_items = []
                if bill:
                    items = General_Billing_Items_Table_Detials.objects.filter(
                        Billing_Invoice_No=bill,
                        Item_Status='Refunded'  # Adjust filter based on actual status values (e.g., 'Refunded')
                    )
                    for item in items:
                        refunded_items.append({
                            'Service_Type': item.Service_Type,
                            'Service_Name': item.Service_Name,
                            'Quantity': item.Quantity,
                            'Amount': float(item.Amount),
                            'Total_Amount': float(item.Total_Amount),
                            # Add more fields as needed, e.g., 'Rate': float(item.Rate), etc.
                        })

                data = {
                    'PatientId': refund.PatientID,
                    'BillDate': formatted_date,
                    'Patient_Name': refund.Patient_Name.upper(),
                    'PhoneNumber': refund.PhoneNumber,
                    'TotalAmount': float(refund.TotalAmount) if refund.TotalAmount else 0.0,
                    'TotalPaidAmount': float(refund.TotalPaidAmount) if refund.TotalPaidAmount else 0.0,
                    'BalanceAmount': float(refund.BalanceAmount) if refund.BalanceAmount else 0.0,
                    'PaidAmount': float(paid_amount),
                    'Billedby': refund.Billedby,
                    'VoucherNumber': refund.Voucher_Number,
                    'InvoiceNo': invoice_no,
                    'RefundedItems': refunded_items  # List of refunded items
                }
                refund_list.append(data)

            return {
                'refunds': refund_list,
                'refundcount': len(refund_list),
                'grand_total': float(grand_total)
            }

        refund_data = fetch_data()

        response_data = {
            'refunds': refund_data['refunds'],
            'refundcount': refund_data['refundcount'],
            'grand_total': refund_data['grand_total']
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


# @csrf_exempt
# @require_http_methods(['GET'])
# def IP_Refund_Report(request):
#     try:
#         DateType = request.GET.get('DateType', '')
#         CurrentDate = request.GET.get('CurrentDate', '')
#         FromDate = request.GET.get('FromDate', '')
#         ToDate = request.GET.get('ToDate', '')
#         userid = request.GET.get('userid', '')
#         SelectedUsers = request.GET.getlist('SelectedUsers[]')

#         search_query = Q()

#         # Date filters
#         if DateType == "Current" and CurrentDate:
#             try:
#                 current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
#                 search_query &= Q(created_at__date=current_date)
#             except ValueError:
#                 raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
#         elif DateType == "Customize":
#             try:
#                 if FromDate and ToDate:
#                     FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
#                     ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
#                     search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
#                 else:
#                     raise ValueError('FromDate and ToDate are required for Customize date type.')
#             except ValueError:
#                 raise ValueError('Invalid date format. Use YYYY-MM-DD.')

#         # User filter
#         if userid:
#             search_query &= Q(Billing_Invoice_No__created_by=userid)
#         if SelectedUsers:
#             search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)

#         # Fetch refunded items
#         refunded_items = IP_Billing_Items_Table_Detials.objects.filter(
#             search_query,
#             Item_Status='Refunded'
#         ).exclude(
#             Billing_Invoice_No__created_by__in=['host', 'admin']
#         ).select_related(
#             'Billing_Invoice_No__Patient_Id',
#             'Billing_Invoice_No__Admission_Id'
#         ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments')

#         refund_list = []
#         for item in refunded_items:
#             bill = item.Billing_Invoice_No
#             patient = bill.Patient_Id
#             receipt = IP_Billing_Receipt.objects.filter(Invoice_NO__Billing_Invoice_No=bill.Billing_Invoice_No).first()
#             payment_methods = []

#             if receipt:
#                 payments = IP_Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid=receipt)
#                 payment_methods = [
#                     {
#                         'Payment_Type': payment.Payment_Type,
#                         'Transaction_Amount': float(payment.Amount or 0)
#                     } for payment in payments
#                 ]

#             refund_list.append({
#                 'PatientId': patient.PatientId if patient else '',
#                 'BillDate': bill.Billing_Date.strftime('%d-%m-%y') if bill.Billing_Date else '',
#                 'Patient_Name': f"{patient.FirstName or ''}{patient.MiddleName or ''} {patient.SurName or ''}".upper() if patient else '',
#                 'PhoneNumber': patient.PhoneNo if patient else '',
#                 'InvoiceNo': bill.Billing_Invoice_No,
#                 'VoucherNumber': receipt.Voucher_Number if receipt else '-',
#                 'PaidAmount': float(item.Total_Amount or 0),
#                 'Billedby': bill.created_by or '-',
#                 'PaymentMethods': payment_methods
#             })

#         response_data = {
#             'refunds': refund_list,
#             'refund_count': len(refund_list),
#             'total_refunded_amount': float(sum(item.Total_Amount or 0 for item in refunded_items))
#         }

#         return JsonResponse(response_data, safe=False)

#     except ValueError as ve:
#         logger.error(f"ValueError in IP_Refund_Report: {str(ve)} | Params: {request.GET}")
#         return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
#     except Exception as e:
#         logger.error(f"Error in IP_Refund_Report: {str(e)} | Params: {request.GET}")
#         return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def Services_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedServices = request.GET.getlist('selectedServices[]')
 
        print(SelectedUsers, 'SelectedUsers')
        print(selectedServices, 'selectedServices')
 
        # Build dynamic filter conditions
        search_query = Q()
 
        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filter
        if SelectedUsers:
            search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
 
        # Service filter
        if selectedServices:
            search_query &= Q(Service_Type__in=selectedServices)
 
        op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).filter(search_query, Item_Status__in=['Paid','Refunded']).select_related(
            'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
        ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments').order_by('created_at')

        # op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
        #     Billing_Invoice_No__created_by__in=['host', 'admin']
        # ).filter(search_query, Item_Status__in=['Paid']).select_related(
        #     'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
        # ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments')
 
        print(op_queryset, 'op_queryset')
 
        # Initialize variables for response
        services_data_list = []
        grand_total = Decimal('0.00')
        service_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')
 
        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in op_queryset:
            invoice_no = data.Billing_Invoice_No.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)
 
        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}
           
            if receipt:
                payments = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Payment_Type for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = payment.Amount or Decimal('0.00')
                        payment_type = payment.Payment_Type.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount
 
            # Process each item in the invoice
            for data in items:
                patient = getattr(data.Billing_Invoice_No, 'Patient_Id', None)
                reg_id = getattr(data.Billing_Invoice_No, 'Register_Id', None)
                bill_date = getattr(data.Billing_Invoice_No, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data.Billing_Invoice_No,'created_at',None)

                formatted_time = bill_time.strftime("%I:%M %p")

 
                service_name = data.Service_Name
                cleaned_name = service_name.split(' - ')[1] if ' - ' in service_name else service_name
 
                # Calculate amount and add to grand total
                amount = Decimal(str(getattr(data, 'Total_Amount', 0) or 0))
                grand_total += amount
                service_count += 1
 
                # Prepare service data
                service_data = {
                    'ItemId': data.Items_Id,
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ServiceName': cleaned_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                    'created_by': getattr(data.Billing_Invoice_No, 'created_by', ''),
                    'Invoiveno': invoice_no,
                    'Service_Type': data.Service_Type.upper(),
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'billtime': formatted_time,
                    'Itemstatus' : data.Item_Status,
                    'CashType' : 'OPCash'

                }
 
                # Handle Radiology-specific data
                if data.Service_Type == 'RADIOLOGY' and data.Service_Code:
                    Rad_Dept = TestName_Details.objects.filter(Test_Code=data.Service_Code).first()
                    if Rad_Dept:
                        service_data['RadiologyDept'] = Rad_Dept.Radiology_Id.Radiology_Name
 
                services_data_list.append(service_data)
 
        # Prepare response data
        response_data = {
            'services': services_data_list,
            'service_count': service_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Services_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Services_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Verify_consultation_Services_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedServices = request.GET.getlist('selectedServices[]')
 
        print(SelectedUsers, 'SelectedUsers')
        print(selectedServices, 'selectedServices')
 
        # Build dynamic filter conditions
        search_query = Q()
 
        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filter
        if SelectedUsers:
            search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
 
        # Service filter
        if selectedServices:
            search_query &= Q(Service_Type__in=selectedServices)
 
        op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).filter(search_query, Item_Status__in=['Paid','Refunded'],Service_Type = 'CONSULTATION').select_related(
            'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
        ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments').order_by('created_at')

        # op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
        #     Billing_Invoice_No__created_by__in=['host', 'admin']
        # ).filter(search_query, Item_Status__in=['Paid']).select_related(
        #     'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
        # ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments')
 
        print(op_queryset, 'op_queryset')
 
        # Initialize variables for response
        services_data_list = []
        grand_total = Decimal('0.00')
        service_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')
 
        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in op_queryset:
            invoice_no = data.Billing_Invoice_No.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)
 
        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}
           
            if receipt:
                payments = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Payment_Type for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = payment.Amount or Decimal('0.00')
                        payment_type = payment.Payment_Type.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount
 
            # Process each item in the invoice
            for data in items:
                patient = getattr(data.Billing_Invoice_No, 'Patient_Id', None)
                reg_id = getattr(data.Billing_Invoice_No, 'Register_Id', None)
                bill_date = getattr(data.Billing_Invoice_No, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data.Billing_Invoice_No,'created_at',None)

                formatted_time = bill_time.strftime("%I:%M %p")

 
                service_name = data.Service_Name
                cleaned_name = service_name.split(' - ')[1] if ' - ' in service_name else service_name
 
                # Calculate amount and add to grand total
                amount = Decimal(str(getattr(data, 'Total_Amount', 0) or 0))
                grand_total += amount
                service_count += 1
 
                # Prepare service data
                service_data = {
                    'ItemId': data.Items_Id,
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ServiceName': cleaned_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                    'created_by': getattr(data.Billing_Invoice_No, 'created_by', ''),
                    'Invoiveno': invoice_no,
                    'Service_Type': data.Service_Type.upper(),
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'billtime': formatted_time,
                    'Itemstatus' : data.Item_Status,
                    'CashType' : 'OPCash'

                }
 
                # Handle Radiology-specific data
                if data.Service_Type == 'RADIOLOGY' and data.Service_Code:
                    Rad_Dept = TestName_Details.objects.filter(Test_Code=data.Service_Code).first()
                    if Rad_Dept:
                        service_data['RadiologyDept'] = Rad_Dept.Radiology_Id.Radiology_Name
 
                services_data_list.append(service_data)
 
        # Prepare response data
        response_data = {
            'services': services_data_list,
            'service_count': service_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Services_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Services_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 


@csrf_exempt
@require_http_methods(["GET"])
def IPServices_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedServices = request.GET.getlist('selectedServices[]')
 
        print(SelectedUsers, 'SelectedUsers')
        print(selectedServices, 'selectedServices')
 
        # Build dynamic filter conditions
        search_query = Q()
 
        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filter
        if SelectedUsers:
            search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
 
        # Service filter
        if selectedServices:
            search_query &= Q(Service_Type__in=selectedServices)
 
        ip_queryset = (
            IP_Billing_Items_Table_Detials.objects
            .exclude(Billing_Type='FinalBill')
            .exclude(Billing_Invoice_No__created_by__in=['host', 'admin'])
            .filter(search_query, Item_Status__in=['Paid','Refunded'])
            .select_related('Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id')
            .prefetch_related('Billing_Invoice_No__Receipt_invoice_IP__Multiple_Payment_IP_Billing_Invoice')
        ).order_by('created_at')


        print(ip_queryset, 'ip_queryset')
 
        # Initialize variables for response
        services_data_list = []
        grand_total = Decimal('0.00')
        service_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')
 
        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in ip_queryset:
            invoice_no = data.Billing_Invoice_No.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)
 
        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = IPBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}
           
            if receipt:
                payments = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Payment_Type for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = payment.Amount or Decimal('0.00')
                        payment_type = payment.Payment_Type.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount
 
            # Process each item in the invoice
            for data in items:
                patient = getattr(data.Billing_Invoice_No, 'Patient_Id', None)
                reg_id = getattr(data.Billing_Invoice_No, 'Register_Id', None)
                bill_date = getattr(data.Billing_Invoice_No, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data.Billing_Invoice_No,'created_at',None)
                formatted_time = bill_time.strftime("%I:%M %p")
 
                service_name = data.Service_Name
                cleaned_name = service_name.split(' - ')[1] if ' - ' in service_name else service_name
 
                # Calculate amount and add to grand total
                amount = Decimal(str(getattr(data, 'Total_Amount', 0) or 0))
                grand_total += amount
                service_count += 1
 
                # Prepare service data
                service_data = {
                    'ItemId': data.Items_Id,
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ServiceName': cleaned_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                    'created_by': getattr(data.Billing_Invoice_No, 'created_by', ''),
                    'Invoiveno': invoice_no,
                    'Service_Type': data.Service_Type.upper(),
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'billtime': formatted_time,
                    'Itemstatus' : data.Item_Status,
                    'CashType' : 'IPCash'
                }
 
                # Handle Radiology-specific data
                if data.Service_Type == 'RADIOLOGY' and data.Service_Code:
                    Rad_Dept = TestName_Details.objects.filter(Test_Code=data.Service_Code).first()
                    if Rad_Dept:
                        service_data['RadiologyDept'] = Rad_Dept.Radiology_Id.Radiology_Name
 
                services_data_list.append(service_data)
 
        # Prepare response data
        response_data = {
            'services': services_data_list,
            'service_count': service_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Services_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Services_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500) 

@csrf_exempt
@require_http_methods(['GET'])
def Discount_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedServices = request.GET.getlist('selectedServices[]')
 
        def fetch_data():
            search_query = Q()
            # Date filters
 
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
           
            if SelectedUsers:

                print(SelectedUsers,'SelectedUsers')
                search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
                print(search_query,'search_query') # Service filter
            if selectedServices:
                search_query &= Q(Service_Type__in=selectedServices)
 
            op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
                Billing_Invoice_No__created_by__in=['host', 'admin']
            ).filter(search_query, Item_Status__in=['Paid','Refunded']).select_related(
                'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
            ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments').order_by('created_at')

            print(op_queryset,'op_queryset')
 
            # Step 2: Extract Billing_Invoice_No IDs into a list
            billing_invoice_nos = op_queryset.values_list('Billing_Invoice_No', flat=True).distinct()
 
            # Step 3: Fetch bills with discounts (Discount_Amount > 0) and matching Billing_Invoice_No
            bills = General_Billing_Table_Detials.objects.filter(
                Discount_Amount__gt=0,
                Billing_Invoice_No__in=billing_invoice_nos
            ).exclude(
                created_by__in=['host', 'admin']
            )

            print(bills,'bills')
 
 
 
            discount_list = []
            grand_total_discount = Decimal('0.00')
 
            for bill in bills:
                bill_date = getattr(bill, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
 
                total_discount = Decimal(bill.Discount_Amount) if bill.Discount_Amount else Decimal('0.00')
                grand_total_discount += total_discount
 
                # Fetch items for this bill
                items = General_Billing_Items_Table_Detials.objects.filter(
                    Billing_Invoice_No=bill
                )
 
                # Calculate total amount before discount (sum of item Total_Amount)
                total_before_discount = sum(Decimal(item.Total_Amount) for item in items) if items else Decimal('0.00')
 
                discounted_items = []
                for item in items:
                    item_total = Decimal(item.Total_Amount) if item.Total_Amount else Decimal('0.00')
 
                    # Apportion discount proportionally based on item's Total_Amount
                    if total_before_discount > 0:
                        apportioned_discount = (item_total / total_before_discount) * total_discount
                    else:
                        apportioned_discount = Decimal('0.00')
 
                    discounted_items.append({
                        'Service_Type': item.Service_Type,
                        'Service_Name': item.Service_Name,
                        'Quantity': item.Quantity,
                        'Amount': float(item.Amount),
                        'Total_Amount': float(item_total),
                        'Apportioned_Discount': float(apportioned_discount),
                        'Net_Amount': float(item_total - apportioned_discount),
                        # Add more fields as needed, e.g., 'Rate': float(item.Rate), etc.
                    })
 
                data = {
                    'PatientId': bill.Patient_Id.PatientId if bill.Patient_Id else '',
                    'BillDate': formatted_date,
                    'Patient_Name': bill.Patient_Id.FirstName.upper() if bill.Patient_Id else '',
                    'PhoneNumber': bill.Patient_Id.PhoneNo if bill.Patient_Id else '',
                    'TotalAmount': float(bill.Total_Amount) if bill.Total_Amount else 0.0,
                    'Discount_Amount': float(total_discount),
                    'Net_Amount': float(bill.Net_Amount) if bill.Net_Amount else 0.0,
                    'Paid_Amount': float(bill.Paid_Amount) if bill.Paid_Amount else 0.0,
                    'Balance_Amount': float(bill.Balance_Amount) if bill.Balance_Amount else 0.0,
                    'Created_By': bill.created_by,
                    'InvoiceNo': bill.Billing_Invoice_No,
                    'DiscountedItems': discounted_items  # List of items with apportioned discounts
                }
                discount_list.append(data)
 
            return {
                'discounts': discount_list,
                'discountcount': len(discount_list),
                'grand_total_discount': float(grand_total_discount)
            }
 
        discount_data = fetch_data()
        response_data = {
            'discounts': discount_data['discounts'],
            'discountcount': discount_data['discountcount'],
            'grand_total_discount': discount_data['grand_total_discount']
        }
        return JsonResponse(response_data, safe=False)
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
 


@csrf_exempt
@require_http_methods(['GET'])
def IPDiscount_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        def fetch_data():
            search_query = Q()
            # Date filters

            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(Billing_Date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(Billing_Date__range=[FromDate_dt, ToDate_dt])
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')


            # Fetch bills with discounts (Discount_Amount > 0)
            bills = IP_Billing_Table_Detials.objects.filter(
                search_query & Q(Discount_Amount__gt=0)
            ).exclude(created_by__in=['host', 'admin']).order_by('created_at')

            if userid:
                bills = bills.filter(created_by=userid)
            if SelectedUsers:
                bills = bills.filter(created_by__in=SelectedUsers)

            discount_list = []
            grand_total_discount = Decimal('0.00')

            for bill in bills:
                bill_date = getattr(bill, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''

                total_discount = Decimal(bill.Discount_Amount) if bill.Discount_Amount else Decimal('0.00')
                grand_total_discount += total_discount

                # Fetch items for this bill
                items = IP_Billing_Items_Table_Detials.objects.filter(
                    Billing_Invoice_No=bill
                )

                # Calculate total amount before discount (sum of item Total_Amount)
                total_before_discount = sum(Decimal(item.Total_Amount) for item in items) if items else Decimal('0.00')

                discounted_items = []
                for item in items:
                    item_total = Decimal(item.Total_Amount) if item.Total_Amount else Decimal('0.00')

                    # Apportion discount proportionally based on item's Total_Amount
                    if total_before_discount > 0:
                        apportioned_discount = (item_total / total_before_discount) * total_discount
                    else:
                        apportioned_discount = Decimal('0.00')

                    discounted_items.append({
                        'Service_Type': item.Service_Type,
                        'Service_Name': item.Service_Name,
                        'Quantity': item.Quantity,
                        'Amount': float(item.Amount),
                        'Total_Amount': float(item_total),
                        'Apportioned_Discount': float(apportioned_discount),
                        'Net_Amount': float(item_total - apportioned_discount),
                        # Add more fields as needed, e.g., 'Rate': float(item.Rate), etc.
                    })

                data = {
                    'PatientId': bill.Patient_Id.PatientId if bill.Patient_Id else '',
                    'BillDate': formatted_date,
                    'Patient_Name': bill.Patient_Id.FirstName.upper() if bill.Patient_Id else '',
                    'PhoneNumber': bill.Patient_Id.PhoneNo if bill.Patient_Id else '',
                    'TotalAmount': float(bill.Total_Amount) if bill.Total_Amount else 0.0,
                    'Discount_Amount': float(total_discount),
                    'Net_Amount': float(bill.Net_Amount) if bill.Net_Amount else 0.0,
                    'Paid_Amount': float(bill.Paid_Amount) if bill.Paid_Amount else 0.0,
                    'Balance_Amount': float(bill.Balance_Amount) if bill.Balance_Amount else 0.0,
                    'Created_By': bill.created_by,
                    'InvoiceNo': bill.Billing_Invoice_No,
                    'DiscountedItems': discounted_items  # List of items with apportioned discounts
                }
                discount_list.append(data)

            return {
                'discounts': discount_list,
                'discountcount': len(discount_list),
                'grand_total_discount': float(grand_total_discount)
            }

        discount_data = fetch_data()
        response_data = {
            'discounts': discount_data['discounts'],
            'discountcount': discount_data['discountcount'],
            'grand_total_discount': discount_data['grand_total_discount']
        }
        return JsonResponse(response_data, safe=False)
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



@csrf_exempt
@require_http_methods(['GET'])
def Advance_Report(request):

    try:

        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date,Status__in = ['Paid','Refunded'])
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt],Status__in = ['Paid','Refunded'])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
                

        if SelectedUsers:
                search_query &= Q(created_by__in=SelectedUsers)


        Advanceins = Advance_Collection_IP.objects.filter(search_query).exclude(created_by__in=['host', 'admin']).order_by('created_at')

        AdvanceList = []

        for adv in Advanceins:

            if adv.RegisterType == 'OP':

                datalist = {

                    'RegisterType' : 'OPAdvance',
                    'OP_Register_Id' : adv.OP_Register_Id.Registration_Id,
                    'PatientName' : f"""{adv.OP_Register_Id.PatientId.FirstName}{adv.OP_Register_Id.PatientId.MiddleName}{adv.OP_Register_Id.PatientId.SurName}""",
                    'PatientId' : adv.OP_Register_Id.PatientId.PatientId,
                    'Age' : adv.OP_Register_Id.PatientId.Age,
                    'Gender' : adv.OP_Register_Id.PatientId.Gender,
                    'Voucher_Number': adv.GeneralBillingReceipt.Voucher_Number,
                    'AdvanceAmount' : adv.AdvanceAmount,
                    'AdvancePurpose' : adv.AdvancePurpose,
                    'created_by' : adv.created_by,
                    'AdvDate' : adv.created_at.strftime('%d-%m-%y'),
                     'Remarks' : adv.Remarks
                }
                AdvanceList.append(datalist)

            
            elif adv.RegisterType == 'IP':

                datalist = {

                    'RegisterType' : 'IPAdvance',
                    'IP_Register_Id' : adv.IP_Register_Id.Registration_Id,
                    'PatientName' : f"""{adv.IP_Register_Id.PatientId.FirstName}{adv.IP_Register_Id.PatientId.MiddleName}{adv.IP_Register_Id.PatientId.SurName}""",
                    'Age' : adv.IP_Register_Id.PatientId.Age,
                    'PatientId' : adv.IP_Register_Id.PatientId.PatientId,
                    'Gender' : adv.IP_Register_Id.PatientId.Gender,
                    'Voucher_Number': adv.IPBillingReceipt.Voucher_Number,
                    'AdvanceAmount' : adv.AdvanceAmount,
                    'AdvancePurpose' : adv.AdvancePurpose,
                    'created_by' : adv.created_by,
                    'AdvDate' : adv.created_at.strftime('%d-%m-%y'),
                     'Remarks' : adv.Remarks
                }
                AdvanceList.append(datalist)



        return JsonResponse(AdvanceList,safe=False)


        # Advanceins = Advance_Collection_IP.

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(['GET'])
def Advance_Refund_Report(request):

    try:

        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

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

           
                
        if SelectedUsers:
                search_query &= Q(Billedby__in=SelectedUsers)


        Advanceins = IPAdvanceRefundReceipt.objects.filter(search_query).exclude(Billedby__in=['host', 'admin']).order_by('CreatedAt')

        AdvanceList = []

        for adv in Advanceins:

            if adv.RegisterType == 'OP':

                datalist = {

                    'RegisterType' : 'OPAdvance',
                    'OP_Register_Id' : adv.AdvanceCollection.OP_Register_Id.Registration_Id,
                    'PatientId' : adv.AdvanceCollection.OP_Register_Id.PatientId.PatientId,
                    'PatientName' : f"""{adv.AdvanceCollection.OP_Register_Id.PatientId.FirstName}{adv.AdvanceCollection.OP_Register_Id.PatientId.MiddleName}{adv.AdvanceCollection.OP_Register_Id.PatientId.SurName}""",
                    'Age' : adv.AdvanceCollection.OP_Register_Id.PatientId.Age,
                    'Gender' : adv.AdvanceCollection.OP_Register_Id.PatientId.Gender,
                    'AdvanceVoucher': adv.AdvanceCollection.GeneralBillingReceipt.Voucher_Number,
                    'AdvanceAmount' : adv.AdvanceCollection.AdvanceAmount,
                    'AdvancePurpose' : adv.AdvanceCollection.AdvancePurpose,
                    'Billedby' : adv.Billedby,
                    'AdvDate' : adv.CreatedAt.strftime('%d-%m-%y'),
                    'Refundvoucher' : adv.Voucher_Number,
                    'Refundamt' : adv.PaidAmount,
                     'Remarks' : adv.Remarks
                }
                AdvanceList.append(datalist)

            
            elif adv.RegisterType == 'IP':

                datalist = {

                    'RegisterType' : 'IPAdvance',
                    'OP_Register_Id' : adv.AdvanceCollection.IP_Register_Id.Registration_Id,
                    'PatientId' : adv.AdvanceCollection.IP_Register_Id.PatientId.PatientId,
                    'PatientName' : f"""{adv.AdvanceCollection.IP_Register_Id.PatientId.FirstName}{adv.AdvanceCollection.IP_Register_Id.PatientId.MiddleName}{adv.AdvanceCollection.IP_Register_Id.PatientId.SurName}""",
                    'Age' : adv.AdvanceCollection.IP_Register_Id.PatientId.Age,
                    'Gender' : adv.AdvanceCollection.IP_Register_Id.PatientId.Gender,
                    'AdvanceVoucher': adv.AdvanceCollection.IPBillingReceipt.Voucher_Number,
                    'AdvanceAmount' : adv.AdvanceCollection.AdvanceAmount,
                    'AdvancePurpose' : adv.AdvanceCollection.AdvancePurpose,
                    'Billedby' : adv.Billedby,
                    'AdvDate' : adv.CreatedAt.strftime('%d-%m-%y'),
                    'Refundvoucher' : adv.Voucher_Number,
                    'Refundamt' : adv.PaidAmount,
                     'Remarks' : adv.Remarks
                }
                AdvanceList.append(datalist)


        return JsonResponse(AdvanceList,safe=False)



        # Advanceins = Advance_Collection_IP.

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




@csrf_exempt
@require_http_methods(['GET'])
def IPFinalBill_Details_Link(request):

    try:

        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
                
        if SelectedUsers:
                search_query &= Q(created_by__in=SelectedUsers)


        Finalbillins = IP_Billing_Table_Detials.objects.filter(search_query & Q(Billing_Type='FinalBill')).exclude(created_by__in=['host', 'admin']).order_by('created_at')
        FinalbillList = []

        for fbill in Finalbillins:

            datalist = {

                'FBillNo' : fbill.Billing_Invoice_No,
                'FBilldate' : fbill.Billing_Date.strftime('%d-%m-%y'),
                'Patientid' : fbill.Patient_Id.PatientId,
                'IPNo' : fbill.Register_Id.Registration_Id,
                'Patientname' : f"""{fbill.Patient_Id.FirstName} {fbill.Patient_Id.MiddleName}{fbill.Patient_Id.SurName}""",
                'Net_Amount' : fbill.Net_Amount,
                'TotalAmount' : fbill.Total_Amount,
                'Discount' : fbill.Discount_Value,
                'Advanceamt' : fbill.Advance_Amount,
                'Paidamt' : fbill.Paid_Amount,
                'Refundamt' : fbill.Refund_Amount,
                'Receivable_Amount' : fbill.Receivable_Amount,
                'Remarks' : fbill.Remarks,
                'Creditamt' : fbill.Balance_Amount,
                'BillStatus' : fbill.Bill_Status,
                'created_by' : fbill.created_by

            }
            FinalbillList.append(datalist)

        return JsonResponse(FinalbillList,safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from django.db import DatabaseError
from decimal import Decimal
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['GET'])
def Combined_Financial_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        def build_date_query(date_field='Billing_Date'):
            search_query = Q()
            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(**{f'{date_field}__date': current_date})
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(**{f'{date_field}__date__range': [FromDate_dt, ToDate_dt]})
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
            return search_query

        # Initialize financial totals
        services_totals = {
            'Grandtotal': Decimal('0.00'),
            'Discount': Decimal('0.00'),
            'Refund': Decimal('0.00'),
            'Final': Decimal('0.00')
        }
        advance_totals = {
            'Grandtotal': Decimal('0.00'),
            'Discount': Decimal('0.00'),
            'Refund': Decimal('0.00'),
            'Final': Decimal('0.00')
        }

        # --- OP Services (Services_Paid_Wise_Report) ---
        op_search_query = build_date_query('created_at')
        if SelectedUsers:
            op_search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
        if userid:
            op_search_query &= Q(Billing_Invoice_No__created_by=userid)

        op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).filter(op_search_query, Item_Status__in=['Paid', 'Refunded'])

        for data in op_queryset:
            amount = Decimal(str(getattr(data, 'Total_Amount', 0) or 0))
            if data.Item_Status == 'Paid':
                services_totals['Grandtotal'] += amount
            elif data.Item_Status == 'Refunded':
                services_totals['Refund'] += amount

        # --- IP Services (IPServices_Paid_Wise_Report) ---
        ip_search_query = build_date_query('created_at')
        if SelectedUsers:
            ip_search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
        if userid:
            ip_search_query &= Q(Billing_Invoice_No__created_by=userid)

        ip_queryset = IP_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).filter(ip_search_query, Item_Status__in=['Paid', 'Refunded'])

        for data in ip_queryset:
            amount = Decimal(str(getattr(data, 'Total_Amount', 0) or 0))
            if data.Item_Status == 'Paid':
                services_totals['Grandtotal'] += amount
            elif data.Item_Status == 'Refunded':
                services_totals['Refund'] += amount

        # --- OP Discounts (Discount_Report) ---
        op_discount_query = build_date_query('Billing_Date')
        if SelectedUsers:
            op_discount_query &= Q(created_by__in=SelectedUsers)
        if userid:
            op_discount_query &= Q(created_by=userid)

        op_bills = General_Billing_Table_Detials.objects.filter(
            op_discount_query & Q(Discount_Amount__gt=0)
        ).exclude(created_by__in=['host', 'admin'])

        for bill in op_bills:
            services_totals['Discount'] += Decimal(bill.Discount_Amount or '0.00')

        # --- IP Discounts (IPDiscount_Report) ---
        ip_discount_query = build_date_query('Billing_Date')
        if SelectedUsers:
            ip_discount_query &= Q(created_by__in=SelectedUsers)
        if userid:
            ip_discount_query &= Q(created_by=userid)

        ip_bills = IP_Billing_Table_Detials.objects.filter(
            ip_discount_query & Q(Discount_Amount__gt=0)
        ).exclude(created_by__in=['host', 'admin'])

        for bill in ip_bills:
            services_totals['Discount'] += Decimal(bill.Discount_Amount or '0.00')

        # --- Advance (Advance_Report) ---
        advance_query = build_date_query('created_at')
        if SelectedUsers:
            advance_query &= Q(created_by__in=SelectedUsers)
        if userid:
            advance_query &= Q(created_by=userid)

        advance_ins = Advance_Collection_IP.objects.filter(
            advance_query
        ).exclude(created_by__in=['host', 'admin'])

        for adv in advance_ins:
            amount = Decimal(str(adv.AdvanceAmount or '0.00'))
            advance_totals['Grandtotal'] += amount

        # --- Advance Refund (Advance_Refund_Report) ---
        advance_refund_query = build_date_query('CreatedAt')
        if SelectedUsers:
            advance_refund_query &= Q(Billedby__in=SelectedUsers)
        if userid:
            advance_refund_query &= Q(Billedby=userid)

        advance_refunds = IPAdvanceRefundReceipt.objects.filter(
            advance_refund_query
        ).exclude(Billedby__in=['host', 'admin'])

        for adv in advance_refunds:
            advance_totals['Refund'] += Decimal(adv.PaidAmount or '0.00')

        # Calculate Final amounts
        services_totals['Final'] = services_totals['Grandtotal'] - services_totals['Discount'] - services_totals['Refund']
        advance_totals['Final'] = advance_totals['Grandtotal'] - advance_totals['Discount'] - advance_totals['Refund']

        # Prepare response data
        response_data = {
            'services': {
                'Grandtotal': float(services_totals['Grandtotal']),
                'Discount': float(services_totals['Discount']),
                'Refund': float(services_totals['Refund']),
                'Final': float(services_totals['Final'])
            },
            'Advance': {
                'Grandtotal': float(advance_totals['Grandtotal']),
                'Discount': float(advance_totals['Discount']),
                'Refund': float(advance_totals['Refund']),
                'Final': float(advance_totals['Final'])
            }
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in Combined_Financial_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        logger.error(f"DatabaseError in Combined_Financial_Report: {str(de)} | Params: {request.GET}")
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        logger.error(f"Error in Combined_Financial_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

from django.db.models import Q, Sum
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from datetime import datetime
from decimal import Decimal

@csrf_exempt
@require_http_methods(["GET"])
def Combined_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        # Parse dates
        current_date = None
        from_date = None
        to_date = None
        if DateType == "Current" and CurrentDate:
            current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
        elif DateType == "Customize" and FromDate and ToDate:
            from_date = datetime.strptime(FromDate, '%Y-%m-%d').date()
            to_date = datetime.strptime(ToDate, '%Y-%m-%d').date()

        # User filter
        user_filter = Q()
        if SelectedUsers:
            user_filter = Q(created_by__in=SelectedUsers)
        elif userid:
            user_filter = Q(created_by=userid)

        itemuser_filter = Q()
        if SelectedUsers:
            itemuser_filter = Q(Billing_Invoice_No__created_by__in=SelectedUsers)
        elif userid:
            itemuser_filter = Q(Billing_Invoice_No__created_by=userid)

        user_filter_billedby = Q()
        if SelectedUsers:
            user_filter_billedby = Q(Billedby__in=SelectedUsers)
        elif userid:
            user_filter_billedby = Q(Billedby=userid)

        # -------------------- Services Calculations --------------------

        # Date filter for services (using created_at)
        services_date_filter = Q()
        if current_date:
            services_date_filter = Q(created_at__date=current_date)
        elif from_date and to_date:
            services_date_filter = Q(created_at__date__range=[from_date, to_date])

        # Grandtotal: sum Total_Amount for 'Paid' and 'Refunded' in OP and IP, excluding Service_Type='CONSULTATION'
        op_paid_qs = General_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).exclude(
            Service_Type='CONSULTATION'
        ).filter(
            services_date_filter & itemuser_filter & Q(Item_Status__in=['Paid', 'Refunded'])
        )
        op_paid_raw = op_paid_qs.aggregate(total=Sum('Total_Amount'))['total'] or Decimal('0.00')
        op_paid = Decimal(str(op_paid_raw)) if isinstance(op_paid_raw, float) else op_paid_raw

        ip_paid_qs = IP_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).exclude(
            Service_Type='CONSULTATION'
        ).filter(
            services_date_filter & itemuser_filter & Q(Item_Status__in=['Paid', 'Refunded'])
        )
        ip_paid_raw = ip_paid_qs.aggregate(total=Sum('Total_Amount'))['total'] or Decimal('0.00')
        ip_paid = Decimal(str(ip_paid_raw)) if isinstance(ip_paid_raw, float) else ip_paid_raw

        services_grandtotal = op_paid + ip_paid

        # Discount: sum Discount_Amount from OP and IP bills, excluding bills with any CONSULTATION items
        discount_date_filter = Q()
        if current_date:
            discount_date_filter = Q(Billing_Date=current_date)
        elif from_date and to_date:
            discount_date_filter = Q(Billing_Date__range=[from_date, to_date])

        # Get OP bills with CONSULTATION
        op_consultation_bills = set(
            General_Billing_Items_Table_Detials.objects.filter(Service_Type='CONSULTATION')
            .values_list('Billing_Invoice_No__Billing_Invoice_No', flat=True)
        )

        op_discount_qs = General_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).exclude(
            Billing_Invoice_No__in=op_consultation_bills
        ).filter(
            discount_date_filter & user_filter & Q(Discount_Amount__gt=0)
        )
        op_discount_raw = op_discount_qs.aggregate(total=Sum('Discount_Amount'))['total'] or Decimal('0.00')
        op_discount = Decimal(str(op_discount_raw)) if isinstance(op_discount_raw, float) else op_discount_raw

        # Assuming similar for IP: Get IP bills with CONSULTATION
        ip_consultation_bills = set(
            IP_Billing_Items_Table_Detials.objects.filter(Service_Type='CONSULTATION')
            .values_list('Billing_Invoice_No__Billing_Invoice_No', flat=True)
        )

        ip_discount_qs = IP_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).exclude(
            Billing_Invoice_No__in=ip_consultation_bills
        ).filter(
            discount_date_filter & user_filter & Q(Discount_Amount__gt=0)
        )
        ip_discount_raw = ip_discount_qs.aggregate(total=Sum('Discount_Amount'))['total'] or Decimal('0.00')
        ip_discount = Decimal(str(ip_discount_raw)) if isinstance(ip_discount_raw, float) else ip_discount_raw

        services_discount = op_discount + ip_discount

        # Refund for services: sum from Refund_userwiseReport (OP) excluding consultation bills + sum Total_Amount for 'Refunded' in IP excluding CONSULTATION
        refund_date_filter = Q()
        if current_date:
            refund_date_filter = Q(Billing_Date=current_date)
        elif from_date and to_date:
            refund_date_filter = Q(Billing_Date__range=[from_date, to_date])

        # For OP refund, exclude based on Invoice_NO in op_consultation_bills
        op_refund_qs = GeneralBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).exclude(
            Invoice_NO__Invoice_NO__Billing_Invoice_No__in=op_consultation_bills  # Adjust based on actual foreign key path
        ).filter(
            refund_date_filter & user_filter_billedby
        )
        op_refund_raw = op_refund_qs.aggregate(total=Sum('PaidAmount'))['total'] or Decimal('0.00')
        op_refund = Decimal(str(op_refund_raw)) if isinstance(op_refund_raw, float) else op_refund_raw

        ip_refund_qs = IP_Billing_Items_Table_Detials.objects.exclude(
            Billing_Invoice_No__created_by__in=['host', 'admin']
        ).exclude(
            Service_Type='CONSULTATION'
        ).filter(
            services_date_filter & user_filter & Q(Item_Status='Refunded')
        )
        ip_refund_raw = ip_refund_qs.aggregate(total=Sum('Total_Amount'))['total'] or Decimal('0.00')
        ip_refund = Decimal(str(ip_refund_raw)) if isinstance(ip_refund_raw, float) else ip_refund_raw

        services_refund = op_refund + ip_refund

        services_final_calc = services_grandtotal - services_discount - services_refund
        services_final = max(services_final_calc, Decimal('0.00'))

        # -------------------- Advance Calculations --------------------

        # Date filter for advance (using created_at)
        advance_date_filter = Q()
        if current_date:
            advance_date_filter = Q(created_at__date=current_date)
        elif from_date and to_date:
            advance_date_filter = Q(created_at__date__range=[from_date, to_date])

        # Grandtotal: sum AdvanceAmount for Status='Paid'
        advance_grandtotal_qs = Advance_Collection_IP.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            advance_date_filter & user_filter & Q(Status='Paid')
        )
        advance_grandtotal_raw = advance_grandtotal_qs.aggregate(total=Sum('AdvanceAmount'))['total'] or Decimal('0.00')
        advance_grandtotal = Decimal(str(advance_grandtotal_raw)) if isinstance(advance_grandtotal_raw, float) else advance_grandtotal_raw

        # Refund for advance: sum PaidAmount from Advance_Refund_Report
        advance_refund_date_filter = Q()
        if current_date:
            advance_refund_date_filter = Q(CreatedAt__date=current_date)
        elif from_date and to_date:
            advance_refund_date_filter = Q(CreatedAt__date__range=[from_date, to_date])

        advance_refund_qs = IPAdvanceRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            advance_refund_date_filter & user_filter_billedby
        )
        advance_refund_raw = advance_refund_qs.aggregate(total=Sum('PaidAmount'))['total'] or Decimal('0.00')
        advance_refund = Decimal(str(advance_refund_raw)) if isinstance(advance_refund_raw, float) else advance_refund_raw

        # Discount for advance: assuming 0 since not provided in code
        advance_discount = Decimal('0.00')

        advance_final_calc = advance_grandtotal - advance_discount - advance_refund
        advance_final = max(advance_final_calc, Decimal('0.00'))

        # -------------------- Finalbill Calculations --------------------

        finalbill_date_filter = Q()
        if current_date:
            finalbill_date_filter = Q(created_at__date=current_date)
        elif from_date and to_date:
            finalbill_date_filter = Q(created_at__date__range=[from_date, to_date])

        finalbill_user_filter = Q()
        if SelectedUsers:
            finalbill_user_filter = Q(created_by__in=SelectedUsers)
        elif userid:
            finalbill_user_filter = Q(created_by=userid)

        finalbill_qs = IP_Billing_Table_Detials.objects.filter(
            finalbill_date_filter & finalbill_user_filter & Q(Billing_Type='FinalBill')
        ).exclude(created_by__in=['host', 'admin'])

        finalbill_grandtotal = Decimal('0.00')
        finalbill_discount = Decimal('0.00')
        finalbill_refund = Decimal('0.00')

        for fbill in finalbill_qs:
            
            if fbill.Bill_Status == 'Refund':
                finalbill_refund += fbill.Refund_Amount or Decimal('0.00')
            
            else:
                finalbill_grandtotal += fbill.Net_Amount or Decimal('0.00')
                finalbill_discount += fbill.Discount_Amount or Decimal('0.00')

        finalbill_final_calc = finalbill_grandtotal - finalbill_discount - finalbill_refund
        finalbill_final = max(finalbill_final_calc, Decimal('0.00'))

        # -------------------- Finaltotal and Finalnetamount --------------------

        finaltotal_total = services_grandtotal + advance_grandtotal + finalbill_grandtotal
        finaltotal_discount = services_discount + advance_discount + finalbill_discount
        finaltotal_refund = services_refund + advance_refund + finalbill_refund

        finaltotal = {
            'Total': float(finaltotal_total),
            'Discount': float(finaltotal_discount),
            'Refund': float(finaltotal_refund)
        }

        finalnetamount_calc = finaltotal_total - finaltotal_discount - finaltotal_refund
        finalnetamount = max(finalnetamount_calc, Decimal('0.00'))

        # Prepare response data
        response_data = {
            'services': {
                'Grandtotal': float(services_grandtotal),
                'Discount': float(services_discount),
                'Refund': float(services_refund),
                'Final': float(services_final)
            },
            'Advance': {
                'Grandtotal': float(advance_grandtotal),
                'Discount': float(advance_discount),
                'Refund': float(advance_refund),
                'Final': float(advance_final)
            },
            'Finalbill': {
                'Grandtotal': float(finalbill_grandtotal),
                'Discount': float(finalbill_discount),
                'Refund': float(finalbill_refund),
                'Final': float(finalbill_final)
            },
            'Finaltotal': finaltotal,
            'Finalnetamount': float(finalnetamount)
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



@csrf_exempt
@require_http_methods(['GET'])
def IPFinalBill_Details_Link_RefundCash(request):

    try:

        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
                
        if SelectedUsers:
                search_query &= Q(created_by__in=SelectedUsers)


        Finalbillins = IP_Billing_Table_Detials.objects.exclude(created_by__in=['host','admin']).exclude().filter(search_query & Q(Billing_Type='FinalBill')).order_by('created_at')
        FinalbillList = []

        for fbill in Finalbillins:

            datalist = {

                'FBillNo' : fbill.Billing_Invoice_No,
                'FBilldate' : fbill.Billing_Date.strftime('%d-%m-%y'),
                'Patientid' : fbill.Patient_Id.PatientId,
                'IPNo' : fbill.Register_Id.Registration_Id,
                'Patientname' : f"""{fbill.Patient_Id.FirstName} {fbill.Patient_Id.MiddleName}{fbill.Patient_Id.SurName}""",
                'Net_Amount' : fbill.Net_Amount,
                'Discount' : fbill.Discount_Amount,
                'Advanceamt' : fbill.Advance_Amount,
                'Paidamt' : fbill.Paid_Amount,
                'Refundamt' : fbill.Refund_Amount,
                'Receivable_Amount' : fbill.Receivable_Amount,
                'BillStatus' : fbill.Bill_Status,
                'Remarks' : fbill.Remarks


            }
            FinalbillList.append(datalist)

        return JsonResponse(FinalbillList,safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def IPFinalBill_Details_Link_Credit(request):

    try:

        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
                
        if SelectedUsers:
                search_query &= Q(created_by__in=SelectedUsers)


        Finalbillins = IP_Billing_Table_Detials.objects.filter(search_query & Q(Billing_Type='FinalBill') & Q(Bill_Status='Credit')).exclude(created_by__in=['host', 'admin']).order_by('created_at')
        FinalbillList = []

        for fbill in Finalbillins:

            datalist = {

                'FBillNo' : fbill.Billing_Invoice_No,
                'FBilldate' : fbill.Billing_Date.strftime('%d-%m-%y'),
                'Patientid' : fbill.Patient_Id.PatientId,
                'IPNo' : fbill.Register_Id.Registration_Id,
                'Patientname' : f"""{fbill.Patient_Id.FirstName} {fbill.Patient_Id.MiddleName}{fbill.Patient_Id.SurName}""",
                'Net_Amount' : fbill.Net_Amount,
                'Discount' : fbill.Discount_Amount,
                'Advanceamt' : fbill.Advance_Amount,
                'Paidamt' : fbill.Paid_Amount,
                'Refundamt' : fbill.Refund_Amount,
                'Receivable_Amount' : fbill.Receivable_Amount,
                'BillStatus' : fbill.Bill_Status,
                'Balance_Amount' : fbill.Balance_Amount,
                'Remarks' : fbill.Remarks,
                'created_by' : fbill.created_by

            }
            FinalbillList.append(datalist)

        return JsonResponse(FinalbillList,safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models import Q, Max
from django.db.models.query import QuerySet
from decimal import Decimal
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# @csrf_exempt
# @require_http_methods(["GET"])
# def IPPharmacy_Paid_Wise_Report(request):
#     try:
#         # Extract parameters from the request
#         DateType = request.GET.get('DateType', '')
#         CurrentDate = request.GET.get('CurrentDate', '')
#         FromDate = request.GET.get('FromDate', '')
#         ToDate = request.GET.get('ToDate', '')
#         userid = request.GET.get('userid', '')
#         SelectedUsers = request.GET.getlist('SelectedUsers[]')
#         selectedItems = request.GET.getlist('selectedItems[]')

#         print(SelectedUsers, 'SelectedUsers')
#         print(selectedItems, 'selectedItems')

#         # Build dynamic filter conditions
#         search_query = Q()

#         # Date filters (fixed underscores)
#         if DateType == "Current" and CurrentDate:
#             try:
#                 current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
#                 search_query &= Q(created_at__date=current_date,Billing_Type='IP PHARMACY')
#             except ValueError:
#                 raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
#         elif DateType == "Customize":
#             try:
#                 if FromDate and ToDate:
#                     FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
#                     ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
#                     search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt], Billing__Billing_Type='IP PHARMACY')
#             except ValueError:
#                 raise ValueError('Invalid date format. Use YYYY-MM-DD.')

#         # User filter (fixed to traverse Billing correctly)
#         if SelectedUsers:
#             search_query &= Q(created_by__in=SelectedUsers)


#         # Query pharmacy billing items
#         pharmacy_queryset = IP_Pharmacy_Billing_Table_Detials.objects.exclude(
#             created_by__in=['host', 'admin']
#         ).filter(
#             search_query, 
#             Bill_Status__in=['Paid', 'Refunded','Due']
#         )

       
#         print(len(pharmacy_queryset), 'pharmacy_queryset')

#         # Initialize variables for response
#         pharmacy_data_list = []
#         grand_total = Decimal('0.00')
#         item_count = 0
#         upi_total = Decimal('0.00')
#         cash_total = Decimal('0.00')
#         card_total = Decimal('0.00')

#         # Group items by Billing_Invoice_No to handle payments correctly
#         invoice_groups = {}
#         for data in pharmacy_queryset:
#             invoice_no = data.Billing.Billing_Invoice_No
#             if invoice_no not in invoice_groups:
#                 invoice_groups[invoice_no] = []
#             invoice_groups[invoice_no].append(data)

#         # Process each invoice group
#         for invoice_no, items in invoice_groups.items():
#             # Fetch receipt and payment details once per invoice
#             receipt = IPPharmacyBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
#             payment_method = 'Unknown'
#             receipt_number = receipt.Voucher_Number if receipt else '-'
#             invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}

#             if receipt:
#                 payments = IP_Pharmacy_Billing_Payments.objects.filter(Billing=receipt)
#                 if payments.exists():
#                     payment_method = ', '.join(payment.Billpay_method for payment in payments)
#                     # Aggregate payment totals by type for the invoice
#                     for payment in payments:
#                         amount = Decimal(str(payment.paidamount or 0))
#                         payment_type = payment.Billpay_method.lower()
#                         if payment_type == 'upi':
#                             invoice_payments['UPI'] += amount
#                             upi_total += amount
#                         elif payment_type == 'cash':
#                             invoice_payments['Cash'] += amount
#                             cash_total += amount
#                         elif payment_type == 'card':
#                             invoice_payments['Card'] += amount
#                             card_total += amount

#             # Process each item in the invoice
#             for data in items:
#                 patient = getattr(data.Billing, 'Patient_Id', None)
#                 reg_id = getattr(data.Billing, 'Register_Id', None)
#                 bill_date = getattr(data.Billing, 'Billing_Date', None)
#                 formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
#                 bill_time = getattr(data.Billing, 'created_at', None)
#                 formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

#                 item_name = data.ItemName

#                 # Calculate amount and add to grand total
#                 amount = Decimal(str(getattr(data, 'Total', 0) or 0))
#                 grand_total += amount
#                 item_count += 1

#                 # Prepare pharmacy item data
#                 pharmacy_data = {
#                     'ItemId': getattr(data.ItemId, 'ItemId', '') if data.ItemId else '',
#                     'PatientId': getattr(patient, 'PatientId', '') if patient else '',
#                     'BillingDate': formatted_date,
#                     'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
#                     'ItemName': item_name,
#                     'PaidAmount': float(amount),
#                     'PatientCategory': getattr(reg_id, 'PatientCategory', '') if reg_id else '',
#                     'created_by': getattr(data.Billing, 'created_by', ''),
#                     'InvoiceNo': invoice_no,
#                     'ReceiptNumber': receipt_number,
#                     'PaymentMethod': payment_method,
#                     'BillTime': formatted_time,
#                     'BillStatus': getattr(data.Billing, 'Bill_Status', ''),
#                     'CashType': 'IPPharmacyCash'
#                 }

#                 pharmacy_data_list.append(pharmacy_data)

#         # Prepare response data
#         response_data = {
#             'pharmacy_items': pharmacy_data_list,
#             'item_count': item_count,
#             'grand_total': float(grand_total),
#             'Total_UPI': float(upi_total),
#             'Total_Cash': float(cash_total),
#             'Total_Card': float(card_total)
#         }

#         return JsonResponse(response_data, safe=False)

#     except ValueError as ve:
#         logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
#         return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
#     except Exception as e:
#         logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
#         return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)





@csrf_exempt
@require_http_methods(["GET"])
def IPPharmacy_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedItems = request.GET.getlist('selectedItems[]')

        print(SelectedUsers, 'SelectedUsers')
        print(selectedItems, 'selectedItems')

        # Build dynamic filter conditions
        search_query = Q()

        # Date filters (fixed underscores)
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date,Billing_Type='IP PHARMACY')
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt], Billing__Billing_Type='IP PHARMACY')
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter (fixed to traverse Billing correctly)
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)


        # Query pharmacy billing items
        pharmacy_queryset = IP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            search_query, 
            Bill_Status__in=['Paid', 'Refunded','Due']
        )

       
        print(len(pharmacy_queryset), 'pharmacy_queryset')

        # Initialize variables for response
        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')

        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in pharmacy_queryset:
            invoice_no = data.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)

        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = IPPharmacyBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}

            if receipt:
                payments = IP_Pharmacy_Billing_Payments.objects.filter(Billing=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Billpay_method for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = Decimal(str(payment.paidamount or 0))
                        payment_type = payment.Billpay_method.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount

            # Process each item in the invoice
            for data in items:
                patient = getattr(data, 'Patient_Id', None)
                reg_id = getattr(data, 'Register_Id', None)
                bill_date = getattr(data, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data, 'created_at', None)
                formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

                # item_name = data.ItemName

                # Calculate amount and add to grand total
                amount = Decimal(str(getattr(data, 'Total', 0) or 0))
                grand_total += amount
                item_count += 1

                # Prepare pharmacy item data
                pharmacy_data = {
                    # 'ItemId': getattr(data.ItemId, 'ItemId', '') if data.ItemId else '',
                    'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                    'BillingDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    # 'ItemName': item_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', '') if reg_id else '',
                    'created_by': getattr(data, 'created_by', ''),
                    'InvoiceNo': invoice_no,
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'BillTime': formatted_time,
                    'BillStatus': getattr(data, 'Bill_Status', ''),
                    'CashType': 'IPPharmacyCash'
                }

                pharmacy_data_list.append(pharmacy_data)

        # Prepare response data
        response_data = {
            'pharmacy_items': pharmacy_data_list,
            'item_count': item_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)






@csrf_exempt
@require_http_methods(["GET"])
def OPPharmacy_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedItems = request.GET.getlist('selectedItems[]')

        print(SelectedUsers, 'SelectedUsers')
        print(selectedItems, 'selectedItems')

        # Build dynamic filter conditions
        search_query = Q()

        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)

        # Item filter
        if selectedItems:
            search_query &= Q(OP_billing_items__ItemName__in=selectedItems)

        # Query OP pharmacy billing items
        pharmacy_queryset = OP_BillingItem.objects.exclude(
            Billing__created_by__in=['host', 'admin']
        ).filter(
            search_query, 
            Billing__Bill_Status__in=['Paid', 'Refunded']
        ).select_related(
            'Billing__Patient_Id', 
            'Billing__Register_Id'
        ).prefetch_related(
            'Billing__Pharmacy_receipt__billing_payments'
        )

        print(pharmacy_queryset, 'pharmacy_queryset')

        # Initialize variables for response
        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')

        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in pharmacy_queryset:
            invoice_no = data.Billing.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)

        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = OPPharmacyBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}

            if receipt:
                payments = OP_Pharmacy_Billing_Payments.objects.filter(Billing=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Billpay_method for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = Decimal(str(payment.paidamount or 0))
                        payment_type = payment.Billpay_method.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount

            # Process each item in the invoice
            for data in items:
                patient = getattr(data.Billing, 'Patient_Id', None)
                reg_id = getattr(data.Billing, 'Register_Id', None)
                bill_date = getattr(data.Billing, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data.Billing, 'created_at', None)
                formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

                item_name = data.ItemName

                # Calculate amount and add to grand total
                amount = Decimal(str(getattr(data, 'Total', 0) or 0))
                grand_total += amount
                item_count += 1

                # Prepare pharmacy item data
                pharmacy_data = {
                    'ItemId': getattr(data.ItemId, 'ItemId', '') if data.ItemId else '',
                    'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                    'BillingDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ItemName': item_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', '') if reg_id else '',
                    'created_by': getattr(data.Billing, 'created_by', ''),
                    'InvoiceNo': invoice_no,
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'BillTime': formatted_time,
                    'BillStatus': getattr(data.Billing, 'Bill_Status', ''),
                    'CashType': 'OPPharmacyCash'
                }

                pharmacy_data_list.append(pharmacy_data)

        # Prepare response data
        response_data = {
            'pharmacy_items': pharmacy_data_list,
            'item_count': item_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in OPPharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in OPPharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def FreePharmacy_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedItems = request.GET.getlist('selectedItems[]')

        print(SelectedUsers, 'SelectedUsers')
        print(selectedItems, 'selectedItems')

        # Build dynamic filter conditions
        search_query = Q()

        # Date filters (fixed underscores)
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(Billing__created_at__date=current_date, Billing__Billing_Type='FREE PHARMACY')
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(Billing__created_at__date__range=[FromDate_dt, ToDate_dt], Billing__Billing_Type='FREE PHARMACY')
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter (fixed to traverse Billing correctly)
        if SelectedUsers:
            search_query &= Q(Billing__created_by__in=SelectedUsers)

        # Item filter (fixed: direct filter on ItemName, no reverse relation needed)
        if selectedItems:
            search_query &= Q(ItemName__in=selectedItems)

        # Query pharmacy billing items
        pharmacy_queryset = IP_BillingItem.objects.exclude(
            Billing__created_by__in=['host', 'admin']
        ).filter(
            search_query, 
            Billing__Bill_Status__in=['Paid', 'Refunded','Due']
        ).select_related(
            'Billing__Patient_Id', 
            'Billing__Register_Id'
        ).prefetch_related(
            'Billing__IPPharmacy_receipt__IP_billing_payments'
        )

        print(pharmacy_queryset, 'pharmacy_queryset')

        # Initialize variables for response
        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')

        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in pharmacy_queryset:
            invoice_no = data.Billing.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)

        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = IPPharmacyBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}

            if receipt:
                payments = IP_Pharmacy_Billing_Payments.objects.filter(Billing=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Billpay_method for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = Decimal(str(payment.paidamount or 0))
                        payment_type = payment.Billpay_method.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount

            # Process each item in the invoice
            for data in items:
                patient = getattr(data.Billing, 'Patient_Id', None)
                reg_id = getattr(data.Billing, 'Register_Id', None)
                bill_date = getattr(data.Billing, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data.Billing, 'created_at', None)
                formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

                item_name = data.ItemName

                # Calculate amount and add to grand totalRefund_userwiseReport
                amount = Decimal(str(getattr(data, 'Total', 0) or 0))
                grand_total += amount
                item_count += 1

                # Prepare pharmacy item data
                pharmacy_data = {
                    'ItemId': getattr(data.ItemId, 'ItemId', '') if data.ItemId else '',
                    'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                    'BillingDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ItemName': item_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', '') if reg_id else '',
                    'created_by': getattr(data.Billing, 'created_by', ''),
                    'InvoiceNo': invoice_no,
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'BillTime': formatted_time,
                    'BillStatus': getattr(data.Billing, 'Bill_Status', ''),
                    'CashType': 'IPPharmacyCash',
                    'Quantity' : data.Billing_Quantity
                }

                pharmacy_data_list.append(pharmacy_data)

        # Prepare response data
        response_data = {
            'pharmacy_items': pharmacy_data_list,
            'item_count': item_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models import Q, Max
from decimal import Decimal
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def Pharmacy_Paid_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date,  Billing_Type__in= ['FREE PHARMACY','IP PHARMACY'])
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt], Billing_Type__in= ['FREE PHARMACY','IP PHARMACY'])  # Fixed: Removed invalid 'Billing__' prefix
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)

        pharmacy_queryset = IP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            search_query, 
            Bill_Status__in=['Paid', 'Refunded', 'Due']
        ).order_by('created_at')

        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')

        for data in pharmacy_queryset:
            patient = getattr(data, 'Patient_Id', None)
            reg_id = getattr(data, 'Register_Id', None)
            bill_date = getattr(data, 'Billing_Date', None)
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
            bill_time = getattr(data, 'created_at', None)
            formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

            # Assuming 'Net_Amount' is the field for accumulation—adjust based on your needs
            amount = Decimal(str(getattr(data, 'Net_Amount', 0) or 0))
            grand_total += amount


            reg = getattr(data, "Register_Id", None)

            patient_category = (
                reg.PatientCategory
                if reg and reg.PatientCategory
                else ""
            )

            insurance_name = (
                reg.InsuranceName.Insurance_Name
                if reg
                and reg.PatientCategory == "Insurance"
                and getattr(reg, "InsuranceName", None)
                else ""
            )

            patient_name = (
                f"{getattr(patient, 'FirstName', '') or ''}"
                f"{getattr(patient, 'MiddleName', '') or ''} "
                f"{getattr(patient, 'SurName', '') or ''}".upper()
                if patient
                else (data.PatientName or "").upper()
            )

            datalist = {
                "PatientId": getattr(patient, "PatientId", "") if patient else "",
                "BillingDate": formatted_date,
                "Patient_Name": patient_name,
                "InvoiceNo": data.Billing_Invoice_No,
                "Creditamt": data.Net_Amount if data.Bill_Status == "Due" else 0.00,
                "Paid_Amount": data.Paid_Amount if data.Bill_Status == "Paid" else 0.00,
                "Bill_Status": data.Bill_Status,
                "created_by": data.created_by,
                "PatientCategory": patient_category,
                "Categoryname": insurance_name or None,
                "PatCategory": f"{patient_category} {insurance_name}".strip() or None,
                "BillType": data.Billing_Type,
                "Remarks": data.Remarks,
            }
            pharmacy_data_list.append(datalist)
            item_count += 1  # Increment if needed for total items

        # Optionally add totals to the response
        response_data = {
            'data': pharmacy_data_list,
            'grand_total': str(grand_total),
            'item_count': item_count,
            # Add payment totals if calculated
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Pharmacy_Refund_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
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
 
        pharmacy_queryset = IPPharmacyBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            search_query
        )

 
        # Process the queryset into a response
        refund_data = []
        for refund in pharmacy_queryset:

            paytype = IP_Pharmacy_Payment_Refund_Table_Detials.objects.filter(Receipt_No_Paid__pk= refund.pk).first()

            refund_data.append({
                'Invoice_NO': refund.Invoice_NO_id if refund.Invoice_NO else None,
                'Billinvoice' : refund.BillInvoice_NO.Billing_Invoice_No if refund.BillInvoice_NO else None, 
                'BillingType' : refund.BillInvoice_NO.Billing_Type if refund.BillInvoice_NO else None, 
                'PatCategory' : f"""{refund.BillInvoice_NO.Register_Id.PatientCategory if refund.BillInvoice_NO and refund.BillInvoice_NO.Register_Id  else None} {refund.BillInvoice_NO.Register_Id.InsuranceName.Insurance_Name if refund.BillInvoice_NO and refund.BillInvoice_NO.Register_Id and refund.BillInvoice_NO.Register_Id.PatientCategory == 'Insurance' else ''}""",
                'Voucher_Number': refund.Voucher_Number,
                'PatientID': refund.PatientID if refund.PatientID else None,
                'Patient_Name': refund.Patient_Name if refund.Patient_Name else None,
                'PhoneNumber': refund.PhoneNumber if refund.PhoneNumber else None,
                'Quantity': refund.Quantity,
                'TotalAmount': refund.TotalAmount,
                'TotalPaidAmount': refund.TotalPaidAmount,
                'BalanceAmount': refund.BalanceAmount,
                'PaidAmount': refund.PaidAmount,
                'Billing_Date': refund.Billing_Date.strftime('%Y-%m-%d'),
                'Billedby': refund.Billedby,
                'CreatedAt': refund.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'UpdatedAt': refund.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'Remarks' : refund.Remarks,
                'paytype' : paytype.Payment_Type if paytype else None

            })
 
        # Calculate summary statistics
        summary = {
            'total_refunds': len(refund_data),
            'total_quantity': sum(float(item['Quantity']) for item in refund_data if item['Quantity']),
            'total_amount': sum(float(item['TotalAmount']) for item in refund_data if item['TotalAmount']),
            'total_paid_amount': sum(float(item['TotalPaidAmount']) for item in refund_data if item['TotalPaidAmount']),
            'total_balance_amount': sum(float(item['BalanceAmount']) for item in refund_data if item['BalanceAmount']),
        }
 
        response = {
            'status': 'success',
            'data': refund_data,
            'summary': summary
        }
 
        return JsonResponse(response, status=200)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Refund_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Refund_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 


@csrf_exempt
@require_http_methods(["GET"])
def Walk_in_Pharmacy_Paid_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)

        pharmacy_queryset = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            search_query,
            Bill_Status__in=['Cash','Refunded','Due','Credit'],
            Pharmacy_Type = 'IPWALKING'
        )

        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')

        for data in pharmacy_queryset:
            # Fetch related payment data
            payments = data.billing_payments_Walkin.all()  # Using related_name from OP_Walkin_Pharmacy_Billing_Payments

            # Calculate payment method totals
            for payment in payments:
                amount = Decimal(str(payment.paidamount or 0))
                if payment.Billpay_method.lower() == 'upi':
                    upi_total += amount
                elif payment.Billpay_method.lower() == 'cash':
                    cash_total += amount
                elif payment.Billpay_method.lower() == 'card':
                    card_total += amount

            bill_date = data.Billing_Date
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
            bill_time = data.created_at
            formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

            amount = Decimal(str(data.Net_Amount or 0))
            grand_total += amount

            # Fetch related billing items to get item count if needed
            item_count += data.OP_Walkin_billing_items.count()  # Using related_name from OP_Walkin_BillingItem

            datalist = {
                'PatientId': data.PatientId or '',
                'BillingDate': formatted_date,
                'Patient_Name': data.PatientName.upper(),
                'InvoiceNo': data.Billing_Invoice_No,
                'Creditamt': float(data.Balance_Amount),
                'Paid_Amount': float(data.Paid_Amount),
                'Bill_Status': data.Bill_Status,
                'created_by': data.created_by or '',
                'PatientCategory': data.Patient_Category or '',
                'Categoryname': None, 
                'PatCategory': data.Patient_Category or '',
                'BillType': data.Billing_Type,
                'Remarks': '' ,
                'Pharmacy_Type' : data.Pharmacy_Type
            }

            pharmacy_data_list.append(datalist)

        response_data = {
            'data': pharmacy_data_list,
            'grand_total': str(grand_total),
            'item_count': item_count,
            'upi_total': str(upi_total),
            'cash_total': str(cash_total),
            'card_total': str(card_total)
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in Walk_in_Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Walk_in_Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def WalkinPharmacy_Refund_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
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

        pharmacy_queryset = WalkinPharmacyBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            search_query
        )

        # Process the queryset into a response
        refund_data = []
        for refund in pharmacy_queryset:
            refund_data.append({
                'Billinvoice': refund.BillInvoice_NO.Billing_Invoice_No if refund.BillInvoice_NO else None, 
                'BillingType': refund.BillInvoice_NO.Billing_Type if refund.BillInvoice_NO else None, 
                'Pharmacy_Type': refund.BillInvoice_NO.Pharmacy_Type if refund.BillInvoice_NO else None,
                'Voucher_Number': refund.Voucher_Number,
                'PatientID': refund.PatientID,
                'Patient_Name': refund.Patient_Name,
                'PhoneNumber': refund.PhoneNumber,
                'Quantity': refund.Quantity,
                'TotalAmount': refund.TotalAmount,
                'TotalPaidAmount': refund.TotalPaidAmount,
                'BalanceAmount': refund.BalanceAmount,
                'PaidAmount': refund.PaidAmount,
                'Billing_Date': refund.Billing_Date.strftime('%Y-%m-%d'),
                'Billedby': refund.Billedby,
                'CreatedAt': refund.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'UpdatedAt': refund.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'Remarks': refund.Remarks,
                'NewPayment': refund.NewPayment
            })

        # Calculate summary statistics
        summary = {
            'total_refunds': len(refund_data),
            'total_quantity': sum(float(item['Quantity']) for item in refund_data if item['Quantity']),
            'total_amount': sum(float(item['TotalAmount']) for item in refund_data if item['TotalAmount']),
            'total_paid_amount': sum(float(item['TotalPaidAmount']) for item in refund_data if item['TotalPaidAmount']),
            'total_balance_amount': sum(float(item['BalanceAmount']) for item in refund_data if item['BalanceAmount']),
        }

        response = {
            'status': 'success',
            'data': refund_data,
            'summary': summary
        }

        return JsonResponse(response, status=200)

    except ValueError as ve:
        logger.error(f"ValueError in WalkinPharmacy_Refund_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in WalkinPharmacy_Refund_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def Patient_Services_Paid_Wise_Report(request):
    try:
        # Extract parameters from the request
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        selectedServices = request.GET.getlist('selectedServices[]')
        PatientId = request.GET.get('PatientId')
 
        print(SelectedUsers, 'SelectedUsers')
        print(selectedServices, 'selectedServices')
 
        # Build dynamic filter conditions
        search_query = Q()
 
        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filter
        if SelectedUsers:
            search_query &= Q(Billing_Invoice_No__created_by__in=SelectedUsers)
 
        # Service filter
        if selectedServices:
            search_query &= Q(Service_Type__in=selectedServices)

        if PatientId:
 
            op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
                Billing_Invoice_No__created_by__in=['host','admin'],
            ).filter(search_query, Item_Status__in=['Paid'],Billing_Invoice_No__Patient_Id__PatientId = PatientId
            ).select_related(
                'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
            ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments')

        # op_queryset = General_Billing_Items_Table_Detials.objects.exclude(
        #     Billing_Invoice_No__created_by__in=['host', 'admin']
        # ).filter(search_query, Item_Status__in=['Paid']).select_related(
        #     'Billing_Invoice_No__Patient_Id', 'Billing_Invoice_No__Register_Id'
        # ).prefetch_related('Billing_Invoice_No__Receipt_invoice__Receipt_No_Payments')
 
        print(op_queryset, 'op_queryset')
 
        # Initialize variables for response
        services_data_list = []
        grand_total = Decimal('0.00')
        service_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')
 
        # Group items by Billing_Invoice_No to handle payments correctly
        invoice_groups = {}
        for data in op_queryset:
            invoice_no = data.Billing_Invoice_No.Billing_Invoice_No
            if invoice_no not in invoice_groups:
                invoice_groups[invoice_no] = []
            invoice_groups[invoice_no].append(data)
 
        # Process each invoice group
        for invoice_no, items in invoice_groups.items():
            # Fetch receipt and payment details once per invoice
            receipt = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No=invoice_no).first()
            payment_method = 'Unknown'
            receipt_number = receipt.Voucher_Number if receipt else '-'
            invoice_payments = {'UPI': Decimal('0.00'), 'Cash': Decimal('0.00'), 'Card': Decimal('0.00')}
           
            if receipt:
                payments = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid=receipt)
                if payments.exists():
                    payment_method = ', '.join(payment.Payment_Type for payment in payments)
                    # Aggregate payment totals by type for the invoice
                    for payment in payments:
                        amount = payment.Amount or Decimal('0.00')
                        payment_type = payment.Payment_Type.lower()
                        if payment_type == 'upi':
                            invoice_payments['UPI'] += amount
                            upi_total += amount
                        elif payment_type == 'cash':
                            invoice_payments['Cash'] += amount
                            cash_total += amount
                        elif payment_type == 'card':
                            invoice_payments['Card'] += amount
                            card_total += amount
 
            # Process each item in the invoice
            for data in items:
                patient = getattr(data.Billing_Invoice_No, 'Patient_Id', None)
                reg_id = getattr(data.Billing_Invoice_No, 'Register_Id', None)
                bill_date = getattr(data.Billing_Invoice_No, 'Billing_Date', None)
                formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
                bill_time = getattr(data.Billing_Invoice_No,'created_at',None)

                formatted_time = bill_time.strftime("%I:%M %p")

 
                service_name = data.Service_Name
                cleaned_name = service_name.split(' - ')[1] if ' - ' in service_name else service_name
 
                # Calculate amount and add to grand total
                amount = Decimal(str(getattr(data, 'Total_Amount', 0) or 0))
                grand_total += amount
                service_count += 1
 
                # Prepare service data
                service_data = {
                    'ItemId': data.Items_Id,
                    'PatientId': getattr(patient, 'PatientId', ''),
                    'OPDate': formatted_date,
                    'Patient_Name': f"{getattr(patient, 'FirstName', '') or ''}{getattr(patient, 'MiddleName', '') or ''} {getattr(patient, 'SurName', '') or ''}".upper(),
                    'ServiceName': cleaned_name,
                    'PaidAmount': float(amount),
                    'PatientCategory': getattr(reg_id, 'PatientCategory', ''),
                    'created_by': getattr(data.Billing_Invoice_No, 'created_by', ''),
                    'Invoiveno': invoice_no,
                    'Service_Type': data.Service_Type.upper(),
                    'ReceiptNumber': receipt_number,
                    'PaymentMethod': payment_method,
                    'billtime': formatted_time,
                    'Itemstatus' : data.Item_Status,
                    'CashType' : 'OPCash'

                }
 
                # Handle Radiology-specific data
                if data.Service_Type == 'RADIOLOGY' and data.Service_Code:
                    Rad_Dept = TestName_Details.objects.filter(Test_Code=data.Service_Code).first()
                    if Rad_Dept:
                        service_data['RadiologyDept'] = Rad_Dept.Radiology_Id.Radiology_Name
 
                services_data_list.append(service_data)
 
        # Prepare response data
        response_data = {
            'services': services_data_list,
            'service_count': service_count,
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Services_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Services_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 


@csrf_exempt
@require_http_methods(["GET"])
def OP_Pharmacy_Paid_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        search_query = Q()

        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])  # Fixed: Removed invalid 'Billing__' prefix
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filter
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)

        pharmacy_queryset = OP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            search_query, 
            Bill_Status__in=['Paid', 'Refunded', 'Due']
        )

        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')

        for data in pharmacy_queryset:
            patient = getattr(data, 'Patient_Id', None)
            reg_id = getattr(data, 'Register_Id', None)
            bill_date = getattr(data, 'Billing_Date', None)
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
            bill_time = getattr(data, 'created_at', None)
            formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''

            # Assuming 'Net_Amount' is the field for accumulation—adjust based on your needs
            amount = Decimal(str(getattr(data, 'Net_Amount', 0) or 0))
            grand_total += amount

            # TODO: If you need payment breakdowns, query IP_Pharmacy_Billing_Payments here and update totals

            datalist = {
                'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                'BillingDate': formatted_date,
                'Patient_Name': (
                    f"{getattr(patient, 'FirstName', '') or ''}"
                    f"{getattr(patient, 'MiddleName', '') or ''} "
                    f"{getattr(patient, 'SurName', '') or ''}".upper()
                    if patient is not None
                    else (data.Patient_name or '').upper()
                ),
                'InvoiceNo': data.Billing_Invoice_No,
                'Creditamt': data.Net_Amount if data.Bill_Status == 'Due' else 0.00,
                'Paid_Amount': data.Paid_Amount if data.Bill_Status == 'Paid' or data.Bill_Status == 'Refunded' else 0.00,
                'Bill_Status': data.Bill_Status ,
                'created_by': data.created_by,
                'PatientCategory': data.Register_Id.PatientCategory if reg_id  else '',
                'Categoryname': data.Register_Id.InsuranceName.Insurance_Name if reg_id and data.Register_Id.PatientCategory == 'Insurance' else None,
                'PatCategory' : f"""{data.Register_Id.PatientCategory if data.Register_Id else None} {data.Register_Id.InsuranceName.Insurance_Name if reg_id and data.Register_Id.PatientCategory == 'Insurance' else ''}""",
                'BillType': data.Billing_Type,
                'Remarks' : data.Remarks

            }

            pharmacy_data_list.append(datalist)
            item_count += 1  # Increment if needed for total items

        # Optionally add totals to the response
        response_data = {
            'data': pharmacy_data_list,
            'grand_total': str(grand_total),
            'item_count': item_count,
            # Add payment totals if calculated
        }

        return JsonResponse(response_data, safe=False)

    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def OP_Pharmacy_Refund_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
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
 
        pharmacy_queryset = OPPharmacyBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            search_query
        )

 
        # Process the queryset into a response
        refund_data = []
        for refund in pharmacy_queryset:

            paytype = OP_Pharmacy_Payment_Refund_Table_Detials.objects.filter(Receipt_No_Paid__pk= refund.pk).first()

            refund_data.append({
                'Invoice_NO': refund.Invoice_NO.Invoice_NO.Billing_Invoice_No if refund.Invoice_NO else None,
                # 'PatCategory' : f"""{refund.BillInvoice_NO.Register_Id.PatientCategory if refund.BillInvoice_NO and refund.BillInvoice_NO.Register_Id else None} {refund.BillInvoice_NO.Register_Id.InsuranceName.Insurance_Name if refund.BillInvoice_NO and refund.BillInvoice_NO.Register_Id and refund.BillInvoice_NO.Register_Id.PatientCategory == 'Insurance' else ''}""",
                'Voucher_Number': refund.Voucher_Number,
                'PatientID': refund.PatientID if refund.PatientID  else None,
                'Patient_Name': refund.Patient_Name if refund.Patient_Name  else None,
                'PhoneNumber': refund.PhoneNumber if refund.PhoneNumber  else None,
                # 'Quantity': refund.Quantity,
                'TotalAmount': refund.TotalAmount,
                'TotalPaidAmount': refund.TotalPaidAmount,
                'BalanceAmount': refund.BalanceAmount,
                'PaidAmount': refund.PaidAmount,
                'Billing_Date': refund.Billing_Date.strftime('%Y-%m-%d'),
                'Billedby': refund.Billedby,
                'CreatedAt': refund.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'UpdatedAt': refund.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                # 'Remarks' : refund.Remarks,
                'paytype' : paytype.Payment_Type if paytype else None

            })
 
        # Calculate summary statistics
        summary = {
            'total_refunds': len(refund_data),
            # 'total_quantity': sum(float(item['Quantity']) for item in refund_data if item['Quantity']),
            'total_amount': sum(float(item['TotalAmount']) for item in refund_data if item['TotalAmount']),
            'total_paid_amount': sum(float(item['TotalPaidAmount']) for item in refund_data if item['TotalPaidAmount']),
            'total_balance_amount': sum(float(item['BalanceAmount']) for item in refund_data if item['BalanceAmount']),
        }
 
        response = {
            'status': 'success',
            'data': refund_data,
            'summary': summary
        }
 
        return JsonResponse(response, status=200)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Refund_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Refund_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def Pharmacy_Accept_Paid_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
 
        search_query = Q()
 
        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date,  Billing_Type__in= ['FREE PHARMACY','IP PHARMACY'])
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt], Billing_Type__in= ['FREE PHARMACY','IP PHARMACY'])  # Fixed: Removed invalid 'Billing__' prefix
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filter
        if SelectedUsers:
            search_query &= Q(Collectedby__in=SelectedUsers)
 
        pharmacy_queryset = IP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            search_query,
            Bill_Status__in=['Paid', 'Refunded', 'Due'],
            IsCollected = True
        )
 
        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')
 
        for data in pharmacy_queryset:
            patient = getattr(data, 'Patient_Id', None)
            reg_id = getattr(data, 'Register_Id', None)
            bill_date = getattr(data, 'Billing_Date', None)
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
            bill_time = getattr(data, 'created_at', None)
            formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''
 
            # Assuming 'Net_Amount' is the field for accumulation—adjust based on your needs
            amount = Decimal(str(getattr(data, 'Net_Amount', 0) or 0))
            grand_total += amount
 
            # TODO: If you need payment breakdowns, query IP_Pharmacy_Billing_Payments here and update totals
 
            datalist = {
                'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                'BillingDate': formatted_date,
                'Patient_Name': (
                    f"{getattr(patient, 'FirstName', '') or ''}"
                    f"{getattr(patient, 'MiddleName', '') or ''} "
                    f"{getattr(patient, 'SurName', '') or ''}".upper()
                    if patient is not None
                    else (data.PatientName or '').upper()
                ),
                'InvoiceNo': data.Billing_Invoice_No,
                'Creditamt': data.Net_Amount if data.Bill_Status == 'Due' else 0.00,
                'Paid_Amount': data.Paid_Amount if data.Bill_Status == 'Paid' else 0.00,
                'Bill_Status': data.Bill_Status ,
                'created_by': data.Collectedby,
                'PatientCategory': data.Register_Id.PatientCategory if reg_id  else '',
                'Categoryname': data.Register_Id.InsuranceName.Insurance_Name if reg_id and data.Register_Id.PatientCategory == 'Insurance' and data.Register_Id.InsuranceName else None,
                'PatCategory' : f"""{data.Register_Id.PatientCategory if data.Register_Id else None} {data.Register_Id.InsuranceName.Insurance_Name if reg_id and data.Register_Id.PatientCategory == 'Insurance' and data.Register_Id.InsuranceName else ''}""",
                'BillType': data.Billing_Type,
                'Remarks' : data.Remarks,
                'CollectedType' : data.CollectedType

 
            }
 
            pharmacy_data_list.append(datalist)
            item_count += 1  # Increment if needed for total items
 
        # Optionally add totals to the response
        response_data = {
            'data': pharmacy_data_list,
            'grand_total': str(grand_total),
            'item_count': item_count,
            # Add payment totals if calculated
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def Pharmacy_Accept_Refund_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
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
            search_query &= Q(Refundedby__in=SelectedUsers)
 
        pharmacy_queryset = IPPharmacyBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            search_query,IsRefunded=True
        )
 
 
        # Process the queryset into a response
        refund_data = []
        for refund in pharmacy_queryset:
 
            paytype = IP_Pharmacy_Payment_Refund_Table_Detials.objects.filter(Receipt_No_Paid__pk= refund.pk).first()
 
            refund_data.append({
                'Invoice_NO': refund.Invoice_NO_id if refund.Invoice_NO else None,
                'Billinvoice' : refund.BillInvoice_NO.Billing_Invoice_No if refund.BillInvoice_NO else None,
                'BillingType' : refund.BillInvoice_NO.Billing_Type if refund.BillInvoice_NO else None,
                'PatCategory' : f"""{refund.BillInvoice_NO.Register_Id.PatientCategory if refund.BillInvoice_NO and refund.BillInvoice_NO.Register_Id  else None} {refund.BillInvoice_NO.Register_Id.InsuranceName.Insurance_Name if refund.BillInvoice_NO and refund.BillInvoice_NO.Register_Id and refund.BillInvoice_NO.Register_Id.PatientCategory == 'Insurance' else ''}""",
                'Voucher_Number': refund.Voucher_Number,
                'PatientID': refund.PatientID if refund.PatientID else None,
                'Patient_Name': refund.Patient_Name if refund.Patient_Name else None,
                'PhoneNumber': refund.PhoneNumber if refund.PhoneNumber else None,
                'Quantity': refund.Quantity,
                'TotalAmount': refund.TotalAmount,
                'TotalPaidAmount': refund.TotalPaidAmount,
                'BalanceAmount': refund.BalanceAmount,
                'PaidAmount': refund.PaidAmount,
                'Billing_Date': refund.Billing_Date.strftime('%Y-%m-%d'),
                'Billedby': refund.Billedby,
                'CreatedAt': refund.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'UpdatedAt': refund.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'Remarks' : refund.Remarks,
                'paytype' : paytype.Payment_Type if paytype else None
 
            })
 
        # Calculate summary statistics
        summary = {
            'total_refunds': len(refund_data),
            'total_quantity': sum(float(item['Quantity']) for item in refund_data if item['Quantity']),
            'total_amount': sum(float(item['TotalAmount']) for item in refund_data if item['TotalAmount']),
            'total_paid_amount': sum(float(item['TotalPaidAmount']) for item in refund_data if item['TotalPaidAmount']),
            'total_balance_amount': sum(float(item['BalanceAmount']) for item in refund_data if item['BalanceAmount']),
        }
 
        response = {
            'status': 'success',
            'data': refund_data,
            'summary': summary
        }
 
        return JsonResponse(response, status=200)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Refund_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Refund_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def OPPharmacy_Accept_Paid_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
 
        search_query = Q()
 
        # Date filters
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])  # Fixed: Removed invalid 'Billing__' prefix
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filter
        if SelectedUsers:
            search_query &= Q(Collectedby__in=SelectedUsers)
 
        pharmacy_queryset = OP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=['host', 'admin']
        ).filter(
            search_query,
            Bill_Status__in=['Paid', 'Refunded', 'Due'],
            IsCollected = True
        ).order_by('created_at')
 
        pharmacy_data_list = []
        grand_total = Decimal('0.00')
        item_count = 0
        upi_total = Decimal('0.00')
        cash_total = Decimal('0.00')
        card_total = Decimal('0.00')
 
        for data in pharmacy_queryset:
            patient = getattr(data, 'Patient_Id', None)
            reg_id = getattr(data, 'Register_Id', None)
            bill_date = getattr(data, 'Billing_Date', None)
            formatted_date = bill_date.strftime('%d-%m-%y') if bill_date else ''
            bill_time = getattr(data, 'created_at', None)
            formatted_time = bill_time.strftime("%I:%M %p") if bill_time else ''
 
            # Assuming 'Net_Amount' is the field for accumulation—adjust based on your needs
            amount = Decimal(str(getattr(data, 'Net_Amount', 0) or 0))
            grand_total += amount
 
            # TODO: If you need payment breakdowns, query IP_Pharmacy_Billing_Payments here and update totals
 
            datalist = {
                'PatientId': getattr(patient, 'PatientId', '') if patient else '',
                'BillingDate': formatted_date,
                'Patient_Name': (
                    f"{getattr(patient, 'FirstName', '') or ''}"
                    f"{getattr(patient, 'MiddleName', '') or ''} "
                    f"{getattr(patient, 'SurName', '') or ''}".upper()
                    if patient is not None
                    else (data.Patient_name or '').upper()
                ),
                'InvoiceNo': data.Billing_Invoice_No,
                'Creditamt': data.Net_Amount if data.Bill_Status == 'Due' else 0.00,
                'Paid_Amount': data.Paid_Amount if data.Bill_Status == 'Paid' or data.Bill_Status == 'Refunded' else 0.00,
                'Bill_Status': data.Bill_Status ,
                'created_by': data.Collectedby,
                'PatientCategory': data.Register_Id.PatientCategory if reg_id  else '',
                'Categoryname': data.Register_Id.InsuranceName.Insurance_Name if reg_id and data.Register_Id.PatientCategory == 'Insurance' else None,
                'PatCategory' : f"""{data.Register_Id.PatientCategory if data.Register_Id else None} {data.Register_Id.InsuranceName.Insurance_Name if reg_id and data.Register_Id.PatientCategory == 'Insurance' else ''}""",
                'BillType': data.Billing_Type,
                'Remarks' : data.Remarks,
                'CollectedType' : data.CollectedType
 
            }
 
            pharmacy_data_list.append(datalist)
            item_count += 1  # Increment if needed for total items
 
        # Optionally add totals to the response
        response_data = {
            'data': pharmacy_data_list,
            'grand_total': str(grand_total),
            'item_count': item_count,
            # Add payment totals if calculated
        }
 
        return JsonResponse(response_data, safe=False)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Paid_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Paid_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def OPPharmacy_Accept_Refund_Wise_Report(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')  # Note: This param isn't used—remove if unnecessary
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
            search_query &= Q(Refundedby__in=SelectedUsers)
 
        pharmacy_queryset = OPPharmacyBillingRefundReceipt.objects.exclude(
            Billedby__in=['host', 'admin']
        ).filter(
            search_query,IsRefunded=True
        )
 
 
        # Process the queryset into a response
        refund_data = []
        for refund in pharmacy_queryset:
 
            paytype = OP_Pharmacy_Payment_Refund_Table_Detials.objects.filter(Receipt_No_Paid__pk= refund.pk).first()
 
            refund_data.append({
                'Invoice_NO': refund.Invoice_NO_id if refund.Invoice_NO else None,
                'Voucher_Number': refund.Voucher_Number,
                'PatientID': refund.PatientID if refund.PatientID else None,
                'Patient_Name': refund.Patient_Name if refund.Patient_Name else None,
                'PhoneNumber': refund.PhoneNumber if refund.PhoneNumber else None,
                # 'Quantity': refund.Quantity,
                'TotalAmount': refund.TotalAmount,
                'TotalPaidAmount': refund.TotalPaidAmount,
                'BalanceAmount': refund.BalanceAmount,
                'PaidAmount': refund.PaidAmount,
                'Billing_Date': refund.Billing_Date.strftime('%Y-%m-%d'),
                'Billedby': refund.Billedby,
                'CreatedAt': refund.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                'UpdatedAt': refund.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                # 'Remarks' : refund.Remarks,
                'paytype' : paytype.Payment_Type if paytype else None
 
            })
 
        # Calculate summary statistics
        # summary = {
        #     'total_refunds': len(refund_data),
        #     'total_quantity': sum(float(item['Quantity']) for item in refund_data if item['Quantity']),
        #     'total_amount': sum(float(item['TotalAmount']) for item in refund_data if item['TotalAmount']),
        #     'total_paid_amount': sum(float(item['TotalPaidAmount']) for item in refund_data if item['TotalPaidAmount']),
        #     'total_balance_amount': sum(float(item['BalanceAmount']) for item in refund_data if item['BalanceAmount']),
        # }
 
        response = {
            'status': 'success',
            'data': refund_data,
            # 'summary': summary
        }
 
        return JsonResponse(response, status=200)
 
    except ValueError as ve:
        logger.error(f"ValueError in Pharmacy_Refund_Wise_Report: {str(ve)} | Params: {request.GET}")
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except Exception as e:
        logger.error(f"Error in Pharmacy_Refund_Wise_Report: {str(e)} | Params: {request.GET}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 

@csrf_exempt
@require_http_methods(['GET'])
def Outstanding_Credit_Details(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        SearchbyFirstName = request.GET.get('SearchbyFirstName', '')
        BillingType = request.GET.get('BillingType', 'CreditBill')  # Default to CreditBill
        BillStatus = request.GET.get('BillStatus', '')  # Optional filter for Bill Status
 
        search_query = Q()
 
        # Date filtering
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
        # User filtering
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)
 
        # Search by various fields
        if SearchbyFirstName:
            search_query &= (
                Q(Patient_Id__FirstName__icontains=SearchbyFirstName) |
                Q(Patient_Id__PatientId__icontains=SearchbyFirstName) |
                Q(Billing_Invoice_No__icontains=SearchbyFirstName) |
                Q(Register_Id__Registration_Id__icontains=SearchbyFirstName) |
                Q(Doctor_Id__DoctorId__icontains=SearchbyFirstName) |
                Q(created_by__icontains=SearchbyFirstName)
            )
 
        # Base query - filter by Billing_Type and exclude system users
        base_query = Outstanding_Billing_Table_Detials.objects.filter(
            search_query
        ).exclude(created_by__in=['host', 'admin'])
 
        print(len(base_query),'base_queryyyyy')
 
        # Optional Bill Status filter
        if BillStatus:
            base_query = base_query.filter(Bill_Status=BillStatus)
 
        # Order by latest created
        outstanding_bills = base_query.order_by('-created_at')
 
        outstanding_bills_list = []
 
        for bill in outstanding_bills:
            # Get related payment information if available
            payment_info = None
            receipt = OutstandingBillingReceipt.objects.filter(Invoice_NO=bill).first()
            if receipt:
                multiple_payments = Multiple_Payment_Table_Outstanding_Detials.objects.filter(Invoice_No=receipt)
                payment_list = []
                for payment in multiple_payments:
                    payment_list.append({
                        'payment_type': payment.Payment_Type,
                        'amount': payment.Amount,
                        'transaction_id': payment.TransactionId,
                        'card_type': payment.Cart_Type,
                        'cheque_no': payment.Cheque_No,
                        'bank_name': payment.Bank_Name
                    })
                payment_info = payment_list
 
            datalist = {
                'Billing_Invoice_No': bill.Billing_Invoice_No,
                'Billing_Date': bill.Billing_Date.strftime('%d-%m-%Y'),
                'Patient_Id': bill.Patient_Id.PatientId,
                'Patient_Name': f"{bill.Patient_Id.FirstName} {bill.Patient_Id.MiddleName or ''} {bill.Patient_Id.SurName}".strip(),
                'Registration_Id': bill.Register_Id.Registration_Id if bill.Register_Id else '',
                'Doctor_Id': bill.Doctor_Id.Doctor_ID if bill.Doctor_Id else '',
                'Doctor_Name': f"{bill.Doctor_Id.First_Name} {bill.Doctor_Id.Last_Name}" if bill.Doctor_Id else '',
                'Billing_Type': bill.Billing_Type,
                'Total_Amount': float(bill.Total_Amount),
                'Discount_Amount': float(bill.Discount_Amount),
                'Net_Amount': float(bill.Net_Amount),
                'Paid_Amount': float(bill.Paid_Amount),
                'Balance_Amount': float(bill.Balance_Amount),
                'Net_Paid_Amount': float(bill.Net_Paid_Amount),
                'Bill_Status': bill.Bill_Status,
                'Refund_Status': bill.Refund_Status,
                'Refund_Amount': float(bill.Refund_Amount),
                'Advance_Amount': float(bill.Advance_Amount),
                'Receivable_Amount': float(bill.Receivable_Amount),
                'Remarks': bill.Remarks or '',
                'IsCreditPaid': bill.IsCreditPaid,
                'CreditPaidDate': bill.CreditPaidDate.strftime('%d-%m-%Y') if bill.CreditPaidDate else '',
                'Created_By': bill.created_by,
                'Created_At': bill.created_at.strftime('%d-%m-%Y %H:%M:%S'),
                'Updated_At': bill.updated_at.strftime('%d-%m-%Y %H:%M:%S'),
                'Payment_Info': payment_info
            }
            outstanding_bills_list.append(datalist)
 
        return JsonResponse(outstanding_bills_list, safe=False)
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Patient_Pharmacy_Paid_Wise_Report(request):
 
    try:
        # Extract parameters
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        PatientId = request.GET.get('PatientId', '').strip()
        IPNO = request.GET.get('IPNO','')
 
        # Build date filter
        search_query = Q()
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(Billing__created_at=current_date)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format'}, status=400)
        elif DateType == "Customize" and FromDate and ToDate:
            try:
                from_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                to_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                search_query &= Q(Billing__created_at__range=[from_dt, to_dt])
            except ValueError:
                return JsonResponse({'error': 'Invalid date range'}, status=400)
 
        # Patient filter
        if PatientId:
            search_query &= Q(Billing__Patient_Id__PatientId__icontains=PatientId)
            print('inside patientiddddddddd',search_query)
 
        if IPNO:
            search_query &= Q(Billing__Register_Id__Registration_Id__icontains=IPNO)
 
        # Main Query: Get all PAID items
        items = IP_BillingItem.objects.filter(
            search_query,
            Billing__Bill_Status__in=['Paid','Due']
        )

        print(items,'items')
 
        if not items.exists():
            return JsonResponse({
                'services': [],
                'service_count': 0,
                'grand_total': 0.0,
                'Total_UPI': 0.0,
                'Total_Cash': 0.0,
                'Total_Card': 0.0
            })
 
        # Totals
        grand_total = Decimal('0.00')
        upi_total = cash_total = card_total = Decimal('0.00')
        services_data_list = []
 
        for item in items:
            bill = item.Billing
            patient = bill.Register_Id.PatientId
            reg = bill.Register_Id
 
            # Date & Time
            bill_date = bill.Billing_Date.strftime('%d-%m-%y')
            bill_time = bill.created_at.strftime('%I:%M %p')
 
            # Payment info
            receipt = bill.IPPharmacy_receipt.first()
            receipt_no = receipt.Voucher_Number if receipt else '-'
            payment_method = 'Unknown'
 
            if receipt:
                payments = receipt.IP_billing_payments.all()
                methods = []
                for p in payments:
                    amount = Decimal(str(p.paidamount or 0))
                    ptype = p.Billpay_method.upper()
 
                    if 'UPI' in ptype:
                        upi_total += amount
                        methods.append('UPI')
                    elif 'CASH' in ptype:
                        cash_total += amount
                        methods.append('Cash')
                    elif 'CARD' in ptype or 'CHEQUE' in ptype:
                        card_total += amount
                        methods.append('Card')
 
                payment_method = ', '.join(methods) if methods else 'Cash'
 
            # Item amount
            amount = Decimal(str(item.Total or 0))
            grand_total += amount
 
            # Build response row
            services_data_list.append({
                'ItemId': item.ItemId_id or '',
                'PatientId': bill.Register_Id.Registration_Id,
                'OPDate': bill_date,
                'Patient_Name': f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip().upper(),
                'ServiceName': item.ItemName,
                'PaidAmount': float(amount),
                'PatientCategory': getattr(reg, 'PatientCategory', 'General'),
                'created_by': bill.created_by,
                'Invoiveno': bill.Billing_Invoice_No,
                'Service_Type': 'PHARMACY',
                'ReceiptNumber': receipt_no,
                'PaymentMethod': payment_method,
                'billtime': bill_time,
                'Itemstatus': bill.Bill_Status,
                'CashType': 'IPPharmacy'
            })
 
        # Final response
        response = {
            'services': services_data_list,
            'service_count': len(services_data_list),
            'grand_total': float(grand_total),
            'Total_UPI': float(upi_total),
            'Total_Cash': float(cash_total),
            'Total_Card': float(card_total)
        }
 
        return JsonResponse(response, safe=False)
 
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Server error'}, status=500)


