import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import *
from Masters.models import *
from Frontoffice.models import *
from django.utils.timezone import now
from datetime import datetime
from django.forms.models import model_to_dict
from .serializer import *
import re
from fpdf import FPDF
from django.db.models import Prefetch
from io import BytesIO
from datetime import datetime
from django.http import HttpResponse


           

def extract_panic_range(reference_range, patient_gender):
    min_value, max_value = None, None
    range_match = re.findall(r"(\d+\.?\d*)\s*-\s*(\d+\.?\d*)", reference_range)
    less_than_match = re.findall(r"less than\s*(\d+\.?\d*)", reference_range, re.IGNORECASE)
    more_than_match = re.findall(r"more than\s*(\d+\.?\d*)", reference_range, re.IGNORECASE)
    gender_range_match = re.findall((
            r"(Male|Female)\s*:\s*(\d+\.?\d*)\s*(?:to|and)\s*(\d+\.?\d*)"
            or r"(Female|Male)\s*:\s*(\d+\.?\d*)\s*(?:to|and)\s*(\d+\.?\d*)")
        and (r"(Female|Male)\s*:\s*(\d+)\s*-\s*(\d+)" or r"(Male|Female)\s*:\s*(\d+)\s*-\s*(\d+)")
        and (r"(Female|Male)\s*:\s*(\d+)\s*to\s*(\d+)" or r"(Male|Female)\s*:\s*(\d+)\s*to\s*(\d+)"),
        reference_range,
        re.IGNORECASE,
    )
    upto_match = re.findall(r"up to\s*(\d+\.?\d*)", reference_range, re.IGNORECASE)
    gfr_stage_match = re.findall(r"(\d+\.?\d*)\s*(\+|or above|to|and)\s*(\d+\.?\d*)?|less than\s*(\d+\.?\d*)",
        reference_range,
        re.IGNORECASE,
    )
    if gender_range_match:
        for gender, low, high in gender_range_match:
            gender = gender.lower()
            if (patient_gender and gender == patient_gender.lower()) or gender in ["children","other"]:
                min_value, max_value = float(low), float(high)
                break 
    elif range_match:
        min_value, max_value = float(range_match[0][0]), float(range_match[0][1])
    elif less_than_match:
        max_value = float(less_than_match[0])
    elif more_than_match:
        min_value = float(more_than_match[0])
    elif gender_range_match:
        for gender, low, high in gender_range_match:
            if gender.lower() == "male":
                min_value, max_value = float(low), float(high)
    elif upto_match:
        max_value = float(upto_match[0])
    elif gfr_stage_match:
        for gfr_match in gfr_stage_match:
            if gfr_match[3]: 
                min_value = None  
                max_value = float(gfr_match[3])
            elif gfr_match[1] in ["+", "or above"]: 
                min_value = float(gfr_match[0])
                max_value = None  
            elif gfr_match[1] in ["to", "and"]: 
                min_value = float(gfr_match[0])
                max_value = float(gfr_match[2])
    return min_value if min_value is not None else 0,( max_value if max_value is not None else 0)



# def get_lab_request_details(request, Billing_Status1=None, queue_type1=None, Type=None, date_filters=None):
#     try:
#         # Extract query parameters
#         query = request.GET.get("query", "")
#         status = request.GET.get("status", "")
#         Billing_Status = request.GET.get("Billing_Status")
#         PatCategory = request.GET.get('PatCategory')
#         if Billing_Status1 is not None:
#             Billing_Status = Billing_Status1
#         Service_Status = request.GET.get("Service_Status")
#         queue_type = queue_type1 if queue_type1 is not None else request.GET.get("queue_type", "").lower()

#         # Build search query
#         search_query = Q()

#         # Apply date filters
#         if date_filters:
#             if date_filters['DateType'] == "Current" and date_filters['CurrentDate']:
#                 try:
#                     current_date = datetime.strptime(date_filters['CurrentDate'], '%Y-%m-%d').date()
#                     search_query &= Q(created_at__date=current_date)
#                 except ValueError:
#                     raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
#             elif date_filters['DateType'] == "Customize":
#                 try:
#                     if date_filters['FromDate'] and date_filters['ToDate']:
#                         from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
#                         to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
#                         search_query &= Q(created_at__date__range=[from_date, to_date])
#                     elif date_filters['FromDate']:
#                         from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
#                         search_query &= Q(created_at__date__gte=from_date)
#                     elif date_filters['ToDate']:
#                         to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
#                         search_query &= Q(created_at__date__lte=to_date)
#                 except ValueError:
#                     raise ValueError('Invalid date format. Use YYYY-MM-DD.')

#         # Apply RegisterType filters
#         if Type == "OP":
#             search_query &= Q(RegisterType__in=["LAB", "OP"])
#         elif Type == "IP":
#             search_query &= Q(RegisterType="IP")

#         # Initialize queryset with filters
#         queryset = Lab_Request_Details.objects.exclude(Status="Canceled").filter(search_query,Billing_Status='Pending')
#         if Type == "IP":
#             print(queryset, 'queryset')

#         # Apply additional query filters
#         if query:
#             search_query &= (
#                 Q(OP_Register_Id__PatientId__FirstName__icontains=query)
#                 | Q(OP_Register_Id__PatientId__MiddleName__icontains=query)
#                 | Q(OP_Register_Id__PatientId__SurName__icontains=query)
#                 | Q(OP_Register_Id__PatientId__PatientId__icontains=query)
#                 | Q(OP_Register_Id__PatientId__PhoneNo__icontains=query)
#                 | Q(IP_Register_Id__PatientId__FirstName__icontains=query)
#                 | Q(IP_Register_Id__PatientId__MiddleName__icontains=query)
#                 | Q(IP_Register_Id__PatientId__SurName__icontains=query)
#                 | Q(IP_Register_Id__PatientId__PatientId__icontains=query)
#                 | Q(IP_Register_Id__PatientId__PhoneNo__icontains=query)
#                 | Q(Casuality_Register_Id__PatientId__FirstName__icontains=query)
#                 | Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query)
#                 | Q(Casuality_Register_Id__PatientId__SurName__icontains=query)
#                 | Q(Casuality_Register_Id__PatientId__PatientId__icontains=query)
#                 | Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query)
#             )
#             queryset = queryset.filter(search_query)

#         # Apply queue type filters
#         if queue_type == "billling":
#             search_query &= Q(Billing_Status="Pending")
#             queryset = queryset.filter(search_query)
#         elif queue_type == "samplecollection":
#             search_query &= Q(
#                 Billing_Status="Completed",
#                 lab_request_items__Service_Status="Pending",
#                 lab_request_items__Analysis_Status="Pending",
#                 lab_request_items__Verify_Status="Pending",
#                 lab_request_items__Approve_Status="Pending",
#             )
#             queryset = queryset.filter(search_query).distinct()
#         elif queue_type == "resultentry":
#             search_query &= Q(
#                 Billing_Status="Completed",
#                 lab_request_items__Service_Status="Completed",
#                 Status="Pending"
#             )
#             queryset = queryset.filter(search_query).distinct()

#         if status:
#             search_query &= Q(Status__icontains=status)
#             queryset = queryset.filter(search_query)

#         response_data = []
#         Analysis_Status = "Pending"

#         for lab_request in queryset:
#             if Type == "OP":
#                 patient = lab_request.OP_Register_Id.PatientId if lab_request.OP_Register_Id else None
#                 doctor = lab_request.OP_Register_Id.PrimaryDoctor if lab_request.OP_Register_Id else None
#             elif Type == "IP":
#                 patient = lab_request.IP_Register_Id.PatientId if lab_request.IP_Register_Id else None
#                 doctor = lab_request.IP_Register_Id.PrimaryDoctor if lab_request.IP_Register_Id else None
#             else:
#                 patient = (
#                     lab_request.IP_Register_Id.PatientId if lab_request.IP_Register_Id else
#                     lab_request.OP_Register_Id.PatientId if lab_request.OP_Register_Id else
#                     lab_request.Casuality_Register_Id.PatientId if lab_request.Casuality_Register_Id else None
#                 )
#                 doctor = (
#                     lab_request.IP_Register_Id.PrimaryDoctor if lab_request.IP_Register_Id else
#                     lab_request.OP_Register_Id.PrimaryDoctor if lab_request.OP_Register_Id else
#                     lab_request.Casuality_Register_Id.PrimaryDoctor if lab_request.Casuality_Register_Id else None
#                 )

#             item_details = []
#             filterdepartment = []
#             TestDetails = []
#             keys_seen = set()
#             filterSpecimen = []
#             Specimen_keys_seen = set()

#             for index, item in enumerate(lab_request.lab_request_items.all(), start=1):
#                 if item.TestType.lower() == "individual":
#                     if Billing_Status == "Completed":
#                         sub_department_code = item.Test_Code.sub_department.SubDepartment_Code
#                         sub_department_name = item.Test_Code.sub_department.SubDepartment_Name
#                         if sub_department_code not in keys_seen:
#                             filterdepartment.append({"key": sub_department_code, "value": sub_department_name})
#                             keys_seen.add(sub_department_code)

#                         Specimen_Name = item.Test_Code.Specimen_Name.Specimen_Name if item.Test_Code.Specimen_Name else None
#                         Specimen_Code = item.Test_Code.Specimen_Name.Specimen_Code if item.Test_Code.Specimen_Name else None
#                         if Specimen_Code not in Specimen_keys_seen:
#                             filterSpecimen.append({"key": Specimen_Code, "value": Specimen_Name})
#                             Specimen_keys_seen.add(Specimen_Code)

#                     test_cost = Testmaster_Cost_List.objects.filter(Test_Code=item.Test_Code.Test_Code).first()
#                     if Billing_Status == "Completed":
#                         data = model_to_dict(item.Test_Code)
#                         modified_data = {}
#                         for key, value in data.items():
#                             if key == "department" and item.Test_Code.department:
#                                 modified_data[key] = item.Test_Code.department.Department_Name
#                                 modified_data["Department_Code"] = item.Test_Code.department.Department_Code
#                             elif key == "sub_department" and item.Test_Code.sub_department:
#                                 modified_data[key] = item.Test_Code.sub_department.SubDepartment_Name
#                                 modified_data["SubDepartment_Code"] = item.Test_Code.sub_department.SubDepartment_Code
#                             elif key == "Container_Name" and item.Test_Code.Container_Name:
#                                 modified_data[key] = item.Test_Code.Container_Name.Container_Name
#                             elif key == "Specimen_Name" and item.Test_Code.Specimen_Name:
#                                 modified_data[key] = item.Test_Code.Specimen_Name.Specimen_Name
#                             elif key == "Method_Name" and item.Test_Code.Method_Name:
#                                 modified_data[key] = item.Test_Code.Method_Name.Method_Name
#                             elif key == "UOM" and item.Test_Code.UOM:
#                                 modified_data[key] = item.Test_Code.UOM.Unit_Name
#                             elif key == "Captured_Unit_UOM" and item.Test_Code.Captured_Unit_UOM:
#                                 modified_data[key] = item.Test_Code.Captured_Unit_UOM.Unit_Name
#                             else:
#                                 modified_data[key] = value

#                         RefernceRangeData = Age_Setup_Master.objects.filter(Test_Code=item.Test_Code.Test_Code).first()
#                         reference_range = RefernceRangeData.Reference_Range if RefernceRangeData else None
#                         NormalValue = RefernceRangeData.NormalValue if RefernceRangeData else None
#                         Panic_Low = RefernceRangeData.PanicLow if RefernceRangeData else None
#                         Panic_High = RefernceRangeData.PanicHigh if RefernceRangeData else None

#                         if NormalValue == "Yes":
#                             panic_low, panic_high = extract_panic_range(reference_range, patient.Gender)
#                             modified_data["paniclow"] = panic_low
#                             modified_data["panichigh"] = panic_high
#                         else:
#                             modified_data["paniclow"] = Panic_Low
#                             modified_data["panichigh"] = Panic_High
#                         modified_data["type"] = "individual"
#                         modified_data["Display_Service_Status"] = "Completed"
#                         modified_data["Display_Analysis_Status"] = "Completed"
#                         modified_data["Display_Verify_Status"] = "Verified"
#                         modified_data["Display_Approve_Status"] = "Approved"
#                         modified_data["Service_Status"] = "Completed"
#                         modified_data["Analysis_Status"] = item.Analysis_Status
#                         modified_data["Verify_Status"] = item.Verify_Status
#                         modified_data["Approve_Status"] = item.Approve_Status
#                         modified_data["referencedata"] = reference_range
#                         modified_data["NormalValue"] = NormalValue 
#                         modified_data["Result_Value"] = item.Result_Value
#                         modified_data["Remarks"] = None
#                         modified_data["TestType"] = "Individual"
#                         modified_data["ColumName"] = "Test_Code"
#                         TestDetails.append(modified_data)

#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='LAB',
#                         Patient_Type=lab_request.IP_Register_Id.PatientCategory
#                     ).first()

#                     print('discount for lab')

#                     LabDiscount = None

#                     if Discount:
#                             LabDiscount = DiscountFeeLab.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 Lab_Test_Id__Test_Id=test_cost.Test_Id
#                             ).first()
#                             print(LabDiscount, 'RadDiscount', test_cost.Test_Id)

#                             rate = test_cost.Basic if test_cost else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = LabDiscount.discount_method if LabDiscount else None
#                             discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"

#                             item_details.append({
#                                 "type": "individual",
#                                 "S_No": index,
#                                 "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
#                                 "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
#                                 "Gender": item.Test_Code.Gender if item.Test_Code else None,
#                                 "ServiceType": "Lab",
#                                 "Charges": test_cost.Basic if test_cost else None,
#                                 "Amount": test_cost.Basic if test_cost else None,
#                                 "Total": test_cost.Basic if test_cost else None,
#                                 "NetAmount": round(final_rate, 2),
#                                 "Quantity": 1,
#                                 "DiscountType": discount_value_display,
#                                 'Discount': discount_value if discount_value else '-',
#                                 'Discountamt' : discount_amount_display,
#                                 'Finalrate': round(final_rate, 2),
#                                 'Discountmethod' : Discountmethod,
#                                 'Discountval' : discount_value,
#                                 "GST_per": "",
#                                 "GST": "",
#                                 "DiscountAmount": "",
#                                 "isReimbursable": "No",
#                             })



#                     else:

#                         item_details.append({
#                             "type": "individual",
#                             "S_No": index,
#                             "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
#                             "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
#                             "Gender": item.Test_Code.Gender if item.Test_Code else None,
#                             "ServiceType": "Lab",
#                             "Charges": test_cost.Basic if test_cost else None,
#                             "Amount": test_cost.Basic if test_cost else None,
#                             "Total": test_cost.Basic if test_cost else None,
#                             "NetAmount": test_cost.Basic if test_cost else None,
#                             "Quantity": 1,
#                             "DiscountType": "",
#                             "Discount": "",
#                             "GST_per": "",
#                             "GST": "",
#                             "DiscountAmount": "",
#                             "isReimbursable": "No",
#                         })



#                 elif item.TestType.lower() == "group":
#                     if Billing_Status == "Completed":
#                         if item.Group_Code.Department.SubDepartment_Code not in keys_seen:
#                             filterdepartment.append({
#                                 "key": item.Group_Code.Department.SubDepartment_Code,
#                                 "value": item.Group_Code.Department.SubDepartment_Name,
#                             })
#                             keys_seen.add(item.Group_Code.Department.SubDepartment_Code)

#                         Specimen_Name = item.Group_Code.Specimen_Name.Specimen_Name if item.Group_Code.Specimen_Name else None
#                         Specimen_Code = item.Group_Code.Specimen_Name.Specimen_Code if item.Group_Code.Specimen_Name else None
#                         if Specimen_Code not in Specimen_keys_seen:
#                             filterSpecimen.append({"key": Specimen_Code, "value": Specimen_Name})
#                             Specimen_keys_seen.add(Specimen_Code)

#                     test_cost = Testmaster_Cost_List.objects.filter(Group_Code=item.Group_Code).first()
#                     group_items = []
#                     sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=item.Group_Code)
#                     for sub_item in sub_item_instances:
#                         if sub_item.Test_Code:
#                             sub_item_data = model_to_dict(sub_item.Test_Code)
#                             sub_item_data["SubDepartment_Name"] = sub_item.Test_Code.sub_department.SubDepartment_Name if sub_item.Test_Code.sub_department else None
#                             sub_item_data["Container_Name"] = sub_item.Test_Code.Container_Name.Container_Name if sub_item.Test_Code.Container_Name else None
#                             sub_item_data["Specimen_Name"] = sub_item.Test_Code.Specimen_Name.Specimen_Name if sub_item.Test_Code.Specimen_Name else None
#                             sub_item_data["Method_Name"] = sub_item.Test_Code.Method_Name.Method_Name if sub_item.Test_Code.Method_Name else None
#                             sub_item_data["UOM"] = sub_item.Test_Code.UOM.Unit_Name if sub_item.Test_Code.UOM else None
#                             sub_item_data["Captured_Unit_UOM"] = sub_item.Test_Code.Captured_Unit_UOM.Unit_Name if sub_item.Test_Code.Captured_Unit_UOM else None
#                             sub_item_data["Result_Value"] = None
#                             sub_item_data["columnname"] = "Group_Code"
#                             group_items.append(sub_item_data)

#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='LAB',
#                         Patient_Type=lab_request.IP_Register_Id.PatientCategory
#                     ).first()

#                     LabDiscount = None

#                     if Discount:
#                             LabDiscount = DiscountFeeLab.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 Lab_Test_Id__Test_Id=test_cost.Test_Id
#                             ).first()
#                             print(LabDiscount, 'RadDiscount', test_cost.Test_Id)

#                             rate = test_cost.Basic if test_cost else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = LabDiscount.discount_method if LabDiscount else None
#                             discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"

#                             item_details.append({
#                                 "type": "group",
#                                 "S_No": index,
#                                 "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
#                                 "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
#                                 "Gender": "All",
#                                 "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
#                                 "group_items": group_items,
#                                 "ServiceType": "Lab",
#                                 "Charges": test_cost.Basic if test_cost else None,
#                                 "Amount": test_cost.Basic if test_cost else None,
#                                 "NetAmount": round(final_rate, 2),
#                                 "Total": test_cost.Basic if test_cost else None,
#                                 "Quantity": 1,
#                                 "DiscountType": discount_value_display,
#                                 'Discount': discount_value if discount_value else '-',
#                                 'Discountamt' : discount_amount_display,
#                                 'Finalrate': round(final_rate, 2),
#                                 'Discountmethod' : Discountmethod,
#                                 'Discountval' : discount_value,
#                                 "GST_per": "",
#                                 "GST": "",
#                                 "DiscountAmount": "",
#                                 "isReimbursable": "No",
#                             })

#                     else:

#                         item_details.append({
#                             "type": "group",
#                             "S_No": index,
#                             "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
#                             "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
#                             "Gender": "All",
#                             "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
#                             "group_items": group_items,
#                             "ServiceType": "Lab",
#                             "Charges": test_cost.Basic if test_cost else None,
#                             "Amount": test_cost.Basic if test_cost else None,
#                             "NetAmount": test_cost.Basic if test_cost else None,
#                             "Total": test_cost.Basic if test_cost else None,
#                             "Quantity": 1,
#                             "DiscountType": "",
#                             "Discount": "",
#                             "GST_per": "",
#                             "GST": "",
#                             "DiscountAmount": "",
#                             "isReimbursable": "No",
#                         })



#                     TestDetails.append({
#                         "type": "group",
#                         "S_No": index,
#                         "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
#                         "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
#                         "Gender": "All",
#                         "SubDepartment_Code": item.Group_Code.Department.SubDepartment_Code if item.Group_Code.Department else None,
#                         "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
#                         "group_items": group_items,
#                         "ServiceType": "Lab",
#                         "Charges": test_cost.Basic if test_cost else None,
#                         "Amount": test_cost.Basic if test_cost else None,
#                         "NetAmount": test_cost.Basic if test_cost else None,
#                         "Total": test_cost.Basic if test_cost else None,
#                         "Quantity": 1,
#                         "DiscountType": "",
#                         "Discount": "",
#                         "GST_per": "",
#                         "GST": "",
#                         "DiscountAmount": "",
#                         "isReimbursable": "No",
#                         "Service_Status": "Completed",
#                         "Analysis_Status": item.Analysis_Status,
#                         "Verify_Status": item.Verify_Status,
#                         "Approve_Status": item.Approve_Status,
#                         "TestType": "Group",
#                         "ColumName": "Group_Code",
#                         "Result_Value": None
#                     })

#                 elif item.TestType.lower() == "offers":
                            
#                             print('offer insideeeeeeeeeeeeee')
                            
#                             sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
#                             if lab_request.Billing_Status == "Completed":
                                
#                                 if (
#                                     item.Package_code.department_name
#                                     not in filterdepartment
#                                 ):
#                                     filterdepartment.append(
#                                         {
#                                             "key": sub_dpt.pk,
#                                             "value": item.Package_Code.department_name,
#                                         }
#                                     )

#                             # Get group test cost
#                             test_cost = Testmaster_Cost_List.objects.filter(
#                                 Package_Code=item.Package_Code
#                             ).first()

#                             # Fetch sub-items for the group
#                             group_items = []
#                             sub_item_instances = OfferPackageList.objects.filter(
#                                 package_code=item.Package_Code.package_code
#                             )
#                             print("-------Offer-------",sub_item_instances)
#                             for sub_item in sub_item_instances:
#                                 print("-------Item-------",sub_item.Test_Code)
                                
#                                 if sub_item.Test_Code:
#                                     print("------Test------",sub_item.Test_Code.Test_Name)
#                                     Specimen_Name = (
#                                         sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                     )
#                                     Specimen_Code = (
#                                         sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
#                                     )

#                                     if Specimen_Code not in Specimen_keys_seen:
#                                         filterSpecimen.append(
#                                             {"key": Specimen_Code, "value": Specimen_Name}
#                                         )
#                                         Specimen_keys_seen.add(Specimen_Code)

#                                     sub_item_data = model_to_dict(sub_item.Test_Code)
#                                     # Add any additional details or transformations if needed
#                                     # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#                                     sub_item_data["SubDepartment_Name"] = (
#                                         sub_item.Test_Code.sub_department.SubDepartment_Name
#                                         if sub_item.Test_Code.sub_department
#                                         else None
#                                     )
#                                     sub_item_data["Container_Name"] = (
#                                         sub_item.Test_Code.Container_Name.Container_Name
#                                         if sub_item.Test_Code.Container_Name
#                                         else None
#                                     )
#                                     sub_item_data["Specimen_Name"] = (
#                                         sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                         if sub_item.Test_Code.Specimen_Name 
#                                         else None
#                                     )
#                                     sub_item_data["Method_Name"] = (
#                                         sub_item.Test_Code.Method_Name.Method_Name
#                                         if sub_item.Test_Code.Method_Name
#                                         else None
#                                     )
#                                     sub_item_data["UOM"] = (
#                                         sub_item.Test_Code.UOM.Unit_Name
#                                         if sub_item.Test_Code.UOM
#                                         else None
#                                     )
#                                     sub_item_data["Captured_Unit_UOM"] = (
#                                         sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#                                         if sub_item.Test_Code.Captured_Unit_UOM
#                                         else None
#                                     )

#                                     sub_item_data["Result_Value"] = None

#                                     sub_item_data["columnname"] = "Group_Code"
#                                     sub_item_data["Group_Code"] = ""
#                                     sub_item_data["Group_Name"] = ""

#                                     print("-------Items-------",sub_item_data['Test_Name'])
#                                     if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
#                                         group_items.append(sub_item_data)
                                
#                                 elif sub_item.Group_Code:
#                                     print("------group------",sub_item.Group_Code.Group_Code)
#                                     group = sub_item.Group_Code.Group_Code
#                                     groupName = sub_item.Group_Code.Group_Name
#                                     sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
#                                     print("-------Item-------",sub_item_instances)
#                                     for sub_item in sub_item_instances:
#                                         print("------Test------",sub_item.Test_Code.Test_Name)
#                                         Specimen_Name = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                         )
#                                         Specimen_Code = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
#                                         )

#                                         if Specimen_Code not in Specimen_keys_seen:
#                                             filterSpecimen.append(
#                                                 {"key": Specimen_Code, "value": Specimen_Name}
#                                             )
#                                             Specimen_keys_seen.add(Specimen_Code)

#                                         sub_item_data = model_to_dict(sub_item.Test_Code)
#                                         # Add any additional details or transformations if needed
#                                         # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#                                         sub_item_data["SubDepartment_Name"] = (
#                                             sub_item.Test_Code.sub_department.SubDepartment_Name
#                                             if sub_item.Test_Code.sub_department
#                                             else None
#                                         )
#                                         sub_item_data["Container_Name"] = (
#                                             sub_item.Test_Code.Container_Name.Container_Name
#                                             if sub_item.Test_Code.Container_Name
#                                             else None
#                                         )
#                                         sub_item_data["Specimen_Name"] = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                             if sub_item.Test_Code.Specimen_Name 
#                                             else None
#                                         )
#                                         sub_item_data["Method_Name"] = (
#                                             sub_item.Test_Code.Method_Name.Method_Name
#                                             if sub_item.Test_Code.Method_Name
#                                             else None
#                                         )
#                                         sub_item_data["UOM"] = (
#                                             sub_item.Test_Code.UOM.Unit_Name
#                                             if sub_item.Test_Code.UOM
#                                             else None
#                                         )
#                                         sub_item_data["Captured_Unit_UOM"] = (
#                                             sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#                                             if sub_item.Test_Code.Captured_Unit_UOM
#                                             else None
#                                         )

#                                         sub_item_data["Result_Value"] = None

#                                         sub_item_data["columnname"] = "Group_Code"
#                                         sub_item_data["Group_Code"] = group
#                                         sub_item_data["Group_Name"] = groupName

#                                         print("-------Items-------",sub_item_data['Test_Name'])
#                                         if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
#                                             group_items.append(sub_item_data)
                                
#                             # Add group-level item details

#                             Discount = DiscountMaster.objects.filter(
#                                 Service__ServiceCategory='LAB',
#                                 Patient_Type=lab_request.IP_Register_Id.PatientCategory
#                             ).first()

#                             LabDiscount = None

#                             if Discount:
#                                 LabDiscount = DiscountFeeLab.objects.filter(
#                                     discount__Discount_ID=Discount.Discount_ID,
#                                     Lab_Test_Id__Test_Id=test_cost.Test_Id
#                                 ).first()
#                                 print(LabDiscount, 'RadDiscount', test_cost.Test_Id)

#                                 rate = test_cost.Basic if test_cost else 0
#                                 final_rate = rate  
#                                 discount_amount = 0  

#                                 discount_type = LabDiscount.discount_method if LabDiscount else None
#                                 discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

#                                 discount_amount = 0
#                                 final_rate = rate

#                                 if discount_type and discount_value:
#                                     if discount_type.lower() == "percentage":
#                                         discount_amount = (rate * discount_value) / 100
#                                         final_rate = rate - discount_amount
#                                         discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                         Discountmethod = 'PERCENTAGE'
#                                     elif discount_type.lower() == "flat":
#                                         discount_amount = discount_value
#                                         final_rate = rate - discount_amount
#                                         discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                         Discountmethod = 'FLATAMOUNT'


#                                     # format discount amount nicely
#                                     discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                                 else:
#                                     discount_value_display = "-"
#                                     discount_amount_display = "-"

#                                 item_details.append(
#                                     {
#                                         "type": "Offers",
#                                         "S_No": index,
#                                         "Request_Id": lab_request.Request_Id,
#                                         "Group_Code": (
#                                             item.Package_Code.package_code if item.Package_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Package_Code.package_name if item.Package_Code else None
#                                         ),
#                                         "Gender": "All",
#                                         "Department": (
#                                             item.Package_Code.department_name
#                                             if item.Package_Code.department_name
#                                             else None
#                                         ),
#                                         "group_items": group_items,  # Include detailed sub-items here
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "NetAmount": round(final_rate, 2),
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": discount_value_display,
#                                         'Discount': discount_value if discount_value else '-',
#                                         'Discountamt' : discount_amount_display,
#                                         'Finalrate': round(final_rate, 2),
#                                         'Discountmethod' : Discountmethod,
#                                         'Discountval' : discount_value,
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                     }
#                                 )
                                
                                
#                             else:

#                                 item_details.append(
#                                     {
#                                         "type": "Offers",
#                                         "S_No": index,
#                                         "Request_Id": lab_request.Request_Id,
#                                         "Group_Code": (
#                                             item.Package_Code.package_code if item.Package_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Package_Code.package_name if item.Package_Code else None
#                                         ),
#                                         "Gender": "All",
#                                         "Department": (
#                                             item.Package_Code.department_name
#                                             if item.Package_Code.department_name
#                                             else None
#                                         ),
#                                         "group_items": group_items,  # Include detailed sub-items here
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "NetAmount": test_cost.Basic if test_cost else None,
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": "",
#                                         "Discount": "",
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                     }
#                                 )
                                
                                
#                             print("---------OK--------")
#                             TestDetails.append(
#                                 {
#                                     "type": "Offers",
#                                     "S_No": index,
#                                     "Group_Code": (
#                                         item.Package_Code.package_code if item.Package_Code else None
#                                     ),
#                                     "SelectItemName": (
#                                         item.Package_Code.package_name if item.Package_Code else None
#                                     ),
#                                     "Gender": "All",
#                                     "SubDepartment_Code": (
#                                         sub_dpt.SubDepartment_Code
#                                         if item.Package_Code.department_name
#                                         else None
#                                     ),
#                                     "Department": (
#                                         item.Package_Code.department_name
#                                         if item.Package_Code.department_name
#                                         else None
#                                     ),
#                                     "group_items": group_items,  # Include detailed sub-items here
#                                     "ServiceType": "Lab",
#                                     "Charges": test_cost.Basic if test_cost else None,
#                                     "Amount": test_cost.Basic if test_cost else None,
#                                     "NetAmount": test_cost.Basic if test_cost else None,
#                                     "Total": test_cost.Basic if test_cost else None,
#                                     "Quantity":1,
#                                     "DiscountType": "",
#                                     "Discount": "",
#                                     "GST_per": "",
#                                     "GST": "",
#                                     "DiscountAmount": "",
#                                     "isReimbursable": "No",
#                                     "Service_Status": "Completed",
#                                     "Analysis_Status": item.Analysis_Status,
#                                     "Verify_Status": item.Verify_Status,
#                                     "Approve_Status": item.Approve_Status,
#                                 "TestType" : "Offers",
#                                 "ColumName": "Package_Code",
#                                 "Result_Value": None
#                                 }
#                             )
                    


#             Registration_Id = None
#             AdmissionDate = None
#             if lab_request.RegisterType in ["OP", "LAB"]:
#                 Registration_Id = lab_request.OP_Register_Id.Registration_Id if lab_request.OP_Register_Id else None
#             elif lab_request.RegisterType == "IP":
#                 Registration_Id = lab_request.IP_Register_Id.Registration_Id if lab_request.IP_Register_Id else None
#                 AdmissionDate = lab_request.IP_Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p') if lab_request.IP_Register_Id else None

#             room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=Registration_Id).last()
#             ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#             bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

#             # Category
#             categoryname = None
#             categoryid = None
#             if lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Insurance':
#                 categoryname = lab_request.IP_Register_Id.InsuranceName.Insurance_Name if lab_request.IP_Register_Id.InsuranceName else None
#                 categoryid = lab_request.IP_Register_Id.InsuranceName.Insurance_Id if lab_request.IP_Register_Id.InsuranceName else None
#             elif lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Client':
#                 categoryname = lab_request.IP_Register_Id.ClientName.Client_Name if lab_request.IP_Register_Id.ClientName else None
#                 categoryid = lab_request.IP_Register_Id.ClientName.Client_Id if lab_request.IP_Register_Id.ClientName else None

#             response_data.append({
#                 "id": lab_request.Request_Id,
#                 "Request_Id": lab_request.Request_Id,
#                 "Status": lab_request.Status,
#                 "BarcodeInvoice": lab_request.Billing_Invoice_No.Billing_Invoice_No if lab_request.Billing_Invoice_No else None,
#                 "Billing_Invoice_No": lab_request.Billing_Invoice_No.Billing_Invoice_No if lab_request.Billing_Invoice_No else None,
#                 "Billing_Status": lab_request.Billing_Status,
#                 "BillingType": 'Lab',
#                 "OP_Register_Id": lab_request.OP_Register_Id.pk if lab_request.OP_Register_Id else None,
#                 "created_by": lab_request.created_by,
#                 "Location_Name": lab_request.Location.Location_Name,
#                 "CreatedAt": lab_request.created_at,
#                 "UpdatedAt": lab_request.updated_at,
#                 "PatientId": patient.PatientId if patient else None,
#                 "Patient_Name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip() if patient else None,
#                 "PhoneNo": patient.PhoneNo if patient else None,
#                 "DoctorID": doctor.Doctor_ID if doctor else None,
#                 "DoctorName": f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None,
#                 "Doctor_ShortName": f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None,
#                 "RegisterType": lab_request.RegisterType,
#                 "ItemDetails": item_details,
#                 "Age": patient.Age if patient else None,
#                 "Area": patient.Area if patient else None,
#                 "BloodGroup": patient.BloodGroup.BloodGroup_Name if patient and patient.BloodGroup else None,
#                 "City": patient.City if patient else None,
#                 "Country": patient.Country if patient else None,
#                 "DOB": patient.DOB if patient else None,
#                 "Date": datetime.now().date(),
#                 "DoorNo": patient.DoorNo if patient else None,
#                 "Email": patient.Email if patient else None,
#                 "FirstName": patient.FirstName if patient else None,
#                 "AgeGender": f"{patient.Age if patient else None}/{patient.Gender if patient else None}",
#                 "Gender": patient.Gender if patient else None,
#                 "MiddleName": patient.MiddleName if patient else None,
#                 "Nationality": patient.Nationality if patient else None,
#                 "Occupation": patient.Occupation if patient else None,
#                 "PatientCategory": lab_request.IP_Register_Id.PatientCategory if lab_request.IP_Register_Id else lab_request.OP_Register_Id.PatientCategory if lab_request.OP_Register_Id else None,
#                 "PatientCategoryName": categoryname,
#                 "PatientId": patient.PatientId if patient else None,
#                 "Pincode": patient.Pincode if patient else None,
#                 "Religion": patient.Religion.Religion_Id if patient and patient.Religion else None,
#                 "State": patient.State if patient else None,
#                 "Street": patient.Street if patient else None,
#                 "SurName": patient.SurName if patient else None,
#                 "Title": patient.Title.Title_Name if patient and patient.Title else None,
#                 "UniqueIdNo": patient.UniqueIdNo if patient else None,
#                 "UniqueIdType": patient.UniqueIdType if patient else None,
#                 "VisitPurpose": lab_request.OP_Register_Id.VisitPurpose if lab_request.OP_Register_Id else None,
#                 "VisitType": lab_request.RegisterType,
#                 "ServiceProcedureForm": "Lab",
#                 "filterdepartment": filterdepartment,
#                 "TestDetails": TestDetails,
#                 "filterSpecimen": filterSpecimen,
#                 "VisitId": lab_request.OP_Register_Id.VisitId if lab_request.OP_Register_Id else None,
#                 "Report": None,
#                 "Registration_Id": Registration_Id,
#                 "WardName": ward_name,
#                 "ward": f"{ward_name}-{bedno}" if ward_name and bedno else None,
#                 "AdmittionDate": AdmissionDate,
#             })

#         if Billing_Status1 is not None:
#             return response_data
#         else:
#             return JsonResponse(response_data, safe=False)

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({"error": str(e)}, status=500)


def get_lab_request_details(request, Billing_Status1=None, queue_type1=None, Type=None, date_filters=None):
    try:
        # Extract query parameters
        query = request.GET.get("query", "")
        status = request.GET.get("status", "")
        Billing_Status = request.GET.get("Billing_Status")
        PatCategory = request.GET.get('PatCategory')
        if Billing_Status1 is not None:
            Billing_Status = Billing_Status1
        Service_Status = request.GET.get("Service_Status")
        queue_type = queue_type1 if queue_type1 is not None else request.GET.get("queue_type", "").lower()

        # Build search query
        search_query = Q()

        # Apply date filters
        if date_filters:
            if date_filters['DateType'] == "Current" and date_filters['CurrentDate']:
                try:
                    current_date = datetime.strptime(date_filters['CurrentDate'], '%Y-%m-%d').date()
                    search_query &= Q(created_at__date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif date_filters['DateType'] == "Customize":
                try:
                    if date_filters['FromDate'] and date_filters['ToDate']:
                        from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
                        to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__range=[from_date, to_date])
                    elif date_filters['FromDate']:
                        from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__gte=from_date)
                    elif date_filters['ToDate']:
                        to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__lte=to_date)
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # Apply RegisterType filters
        if Type == "OP":
            search_query &= Q(RegisterType__in=["LAB", "OP"])
        elif Type == "IP":
            search_query &= Q(RegisterType="IP")

        # Initialize queryset with filters
        queryset = Lab_Request_Details.objects.exclude(Status="Canceled").filter(search_query,Billing_Status='Pending')
        if Type == "IP":
            print(queryset, 'queryset')

        # Apply additional query filters
        if query:
            search_query &= (
                Q(OP_Register_Id__PatientId__FirstName__icontains=query)
                | Q(OP_Register_Id__PatientId__MiddleName__icontains=query)
                | Q(OP_Register_Id__PatientId__SurName__icontains=query)
                | Q(OP_Register_Id__PatientId__PatientId__icontains=query)
                | Q(OP_Register_Id__PatientId__PhoneNo__icontains=query)
                | Q(IP_Register_Id__PatientId__FirstName__icontains=query)
                | Q(IP_Register_Id__PatientId__MiddleName__icontains=query)
                | Q(IP_Register_Id__PatientId__SurName__icontains=query)
                | Q(IP_Register_Id__PatientId__PatientId__icontains=query)
                | Q(IP_Register_Id__PatientId__PhoneNo__icontains=query)
                | Q(Casuality_Register_Id__PatientId__FirstName__icontains=query)
                | Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query)
                | Q(Casuality_Register_Id__PatientId__SurName__icontains=query)
                | Q(Casuality_Register_Id__PatientId__PatientId__icontains=query)
                | Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query)
            )
            queryset = queryset.filter(search_query)

        # Apply queue type filters
        if queue_type == "billling":
            search_query &= Q(Billing_Status="Pending")
            queryset = queryset.filter(search_query)
        elif queue_type == "samplecollection":
            search_query &= Q(
                Billing_Status="Completed",
                lab_request_items__Service_Status="Pending",
                lab_request_items__Analysis_Status="Pending",
                lab_request_items__Verify_Status="Pending",
                lab_request_items__Approve_Status="Pending",
            )
            queryset = queryset.filter(search_query).distinct()
        elif queue_type == "resultentry":
            search_query &= Q(
                Billing_Status="Completed",
                lab_request_items__Service_Status="Completed",
                Status="Pending"
            )
            queryset = queryset.filter(search_query).distinct()

        if status:
            search_query &= Q(Status__icontains=status)
            queryset = queryset.filter(search_query)

        response_data = []
        Analysis_Status = "Pending"

        for lab_request in queryset:
            if Type == "OP":
                patient = lab_request.OP_Register_Id.PatientId if lab_request.OP_Register_Id else None
                doctor = lab_request.OP_Register_Id.PrimaryDoctor if lab_request.OP_Register_Id else None
            elif Type == "IP":
                patient = lab_request.IP_Register_Id.PatientId if lab_request.IP_Register_Id else None
                doctor = lab_request.IP_Register_Id.PrimaryDoctor if lab_request.IP_Register_Id else None
                regins = lab_request.IP_Register_Id if lab_request.IP_Register_Id else None
            else:
                patient = (
                    lab_request.IP_Register_Id.PatientId if lab_request.IP_Register_Id else
                    lab_request.OP_Register_Id.PatientId if lab_request.OP_Register_Id else
                    lab_request.Casuality_Register_Id.PatientId if lab_request.Casuality_Register_Id else None
                )
                doctor = (
                    lab_request.IP_Register_Id.PrimaryDoctor if lab_request.IP_Register_Id else
                    lab_request.OP_Register_Id.PrimaryDoctor if lab_request.OP_Register_Id else
                    lab_request.Casuality_Register_Id.PrimaryDoctor if lab_request.Casuality_Register_Id else None
                )

            item_details = []
            filterdepartment = []
            TestDetails = []
            keys_seen = set()
            filterSpecimen = []
            Specimen_keys_seen = set()

            for index, item in enumerate(lab_request.lab_request_items.all(), start=1):
                print(index,'index countttttttttttttttttt')
                
                if item.TestType.lower() == "individual":
                    if Billing_Status == "Completed":
                        sub_department_code = item.Test_Code.sub_department.SubDepartment_Code
                        sub_department_name = item.Test_Code.sub_department.SubDepartment_Name
                        if sub_department_code not in keys_seen:
                            filterdepartment.append({"key": sub_department_code, "value": sub_department_name})
                            keys_seen.add(sub_department_code)

                        Specimen_Name = item.Test_Code.Specimen_Name.Specimen_Name if item.Test_Code.Specimen_Name else None
                        Specimen_Code = item.Test_Code.Specimen_Name.Specimen_Code if item.Test_Code.Specimen_Name else None
                        if Specimen_Code not in Specimen_keys_seen:
                            filterSpecimen.append({"key": Specimen_Code, "value": Specimen_Name})
                            Specimen_keys_seen.add(Specimen_Code)

                    test_cost = Testmaster_Cost_List.objects.filter(Test_Code=item.Test_Code.Test_Code).first()
                    if Billing_Status == "Completed":
                        data = model_to_dict(item.Test_Code)
                        modified_data = {}
                        for key, value in data.items():
                            if key == "department" and item.Test_Code.department:
                                modified_data[key] = item.Test_Code.department.Department_Name
                                modified_data["Department_Code"] = item.Test_Code.department.Department_Code
                            elif key == "sub_department" and item.Test_Code.sub_department:
                                modified_data[key] = item.Test_Code.sub_department.SubDepartment_Name
                                modified_data["SubDepartment_Code"] = item.Test_Code.sub_department.SubDepartment_Code
                            elif key == "Container_Name" and item.Test_Code.Container_Name:
                                modified_data[key] = item.Test_Code.Container_Name.Container_Name
                            elif key == "Specimen_Name" and item.Test_Code.Specimen_Name:
                                modified_data[key] = item.Test_Code.Specimen_Name.Specimen_Name
                            elif key == "Method_Name" and item.Test_Code.Method_Name:
                                modified_data[key] = item.Test_Code.Method_Name.Method_Name
                            elif key == "UOM" and item.Test_Code.UOM:
                                modified_data[key] = item.Test_Code.UOM.Unit_Name
                            elif key == "Captured_Unit_UOM" and item.Test_Code.Captured_Unit_UOM:
                                modified_data[key] = item.Test_Code.Captured_Unit_UOM.Unit_Name
                            else:
                                modified_data[key] = value

                        RefernceRangeData = Age_Setup_Master.objects.filter(Test_Code=item.Test_Code.Test_Code).first()
                        reference_range = RefernceRangeData.Reference_Range if RefernceRangeData else None
                        NormalValue = RefernceRangeData.NormalValue if RefernceRangeData else None
                        Panic_Low = RefernceRangeData.PanicLow if RefernceRangeData else None
                        Panic_High = RefernceRangeData.PanicHigh if RefernceRangeData else None

                        if NormalValue == "Yes":
                            panic_low, panic_high = extract_panic_range(reference_range, patient.Gender)
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
                        modified_data["Result_Value"] = item.Result_Value
                        modified_data["Remarks"] = None
                        modified_data["TestType"] = "Individual"
                        modified_data["ColumName"] = "Test_Code"
                        TestDetails.append(modified_data)

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=lab_request.IP_Register_Id.PatientCategory if lab_request.IP_Register_Id else None
                    ).first()

                    print('discount for lab')

                    # Initialize discount variables
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    Discountmethod = None
                    final_rate = None
                    discount_value = 0

                    if Discount:
                        LabDiscount = DiscountFeeLab.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Lab_Test_Id__Test_Id=test_cost.Test_Id if test_cost else None
                        ).first()
                        print(LabDiscount, 'RadDiscount', test_cost.Test_Id if test_cost else None)

                        rate = test_cost.Basic if test_cost else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = LabDiscount.discount_method if LabDiscount else None
                        discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'

                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                    else:
                        LabDiscount = None

                    # Check for insurance category
                    if lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Insurance':
                        patinsurance = lab_request.IP_Register_Id.InsuranceName.Insurance_Id if lab_request.IP_Register_Id.InsuranceName else None
                        
                        insurancefee = InsuranceFeeLab.objects.filter(insurance__Insurance_Id=patinsurance, Lab_Test_Id__Test_Id=test_cost.Test_Id if test_cost else None).first()
                        
                        if insurancefee:
                            item_details.append({
                                "type": "individual",
                                "S_No": index,
                                "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
                                "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
                                "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                "ServiceType": "Lab",
                                "Charges": insurancefee.Cur_Test_Fee,
                                "Amount": insurancefee.Cur_Test_Fee,
                                "Total": insurancefee.Cur_Test_Fee,
                                "NetAmount": insurancefee.Cur_Test_Fee,
                                "Quantity": 1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                                'CGHScode': test_cost.CGHS_CODE if test_cost else ''
                            })
                        else:
                            # Fallback to regular pricing if no insurance fee found
                            if LabDiscount and final_rate is not None:
                                item_details.append({
                                    "type": "individual",
                                    "S_No": index,
                                    "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
                                    "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
                                    "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "NetAmount": round(final_rate, 2),
                                    "Quantity": 1,
                                    "DiscountType": discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt': discount_amount_display,
                                    'Finalrate': round(final_rate, 2),
                                    'Discountmethod': Discountmethod,
                                    'Discountval': discount_value,
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                })
                            else:
                                item_details.append({
                                    "type": "individual",
                                    "S_No": index,
                                    "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
                                    "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
                                    "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Quantity": 1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                })
                    else:
                        # Regular patient (not insurance)
                        if LabDiscount and final_rate is not None:
                            item_details.append({
                                "type": "individual",
                                "S_No": index,
                                "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
                                "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
                                "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "NetAmount": round(final_rate, 2),
                                "Quantity": 1,
                                "DiscountType": discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt': discount_amount_display,
                                'Finalrate': round(final_rate, 2),
                                'Discountmethod': Discountmethod,
                                'Discountval': discount_value,
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            })
                        else:
                            item_details.append({
                                "type": "individual",
                                "S_No": index,
                                "Test_Code": item.Test_Code.Test_Code if item.Test_Code else None,
                                "SelectItemName": item.Test_Code.Test_Name if item.Test_Code else None,
                                "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Quantity": 1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            })

                elif item.TestType.lower() == "group":
                    if Billing_Status == "Completed":
                        if item.Group_Code.Department.SubDepartment_Code not in keys_seen:
                            filterdepartment.append({
                                "key": item.Group_Code.Department.SubDepartment_Code,
                                "value": item.Group_Code.Department.SubDepartment_Name,
                            })
                            keys_seen.add(item.Group_Code.Department.SubDepartment_Code)

                        Specimen_Name = item.Group_Code.Specimen_Name.Specimen_Name if item.Group_Code.Specimen_Name else None
                        Specimen_Code = item.Group_Code.Specimen_Name.Specimen_Code if item.Group_Code.Specimen_Name else None
                        if Specimen_Code not in Specimen_keys_seen:
                            filterSpecimen.append({"key": Specimen_Code, "value": Specimen_Name})
                            Specimen_keys_seen.add(Specimen_Code)

                    test_cost = Testmaster_Cost_List.objects.filter(Group_Code=item.Group_Code).first()
                    print(test_cost,'test_costttttttttttt')
                    group_items = []
                    sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=item.Group_Code)
                    for sub_item in sub_item_instances:
                        if sub_item.Test_Code:
                            sub_item_data = model_to_dict(sub_item.Test_Code)
                            sub_item_data["SubDepartment_Name"] = sub_item.Test_Code.sub_department.SubDepartment_Name if sub_item.Test_Code.sub_department else None
                            sub_item_data["Container_Name"] = sub_item.Test_Code.Container_Name.Container_Name if sub_item.Test_Code.Container_Name else None
                            sub_item_data["Specimen_Name"] = sub_item.Test_Code.Specimen_Name.Specimen_Name if sub_item.Test_Code.Specimen_Name else None
                            sub_item_data["Method_Name"] = sub_item.Test_Code.Method_Name.Method_Name if sub_item.Test_Code.Method_Name else None
                            sub_item_data["UOM"] = sub_item.Test_Code.UOM.Unit_Name if sub_item.Test_Code.UOM else None
                            sub_item_data["Captured_Unit_UOM"] = sub_item.Test_Code.Captured_Unit_UOM.Unit_Name if sub_item.Test_Code.Captured_Unit_UOM else None
                            sub_item_data["Result_Value"] = None
                            sub_item_data["columnname"] = "Group_Code"
                            group_items.append(sub_item_data)

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=lab_request.IP_Register_Id.PatientCategory if lab_request.IP_Register_Id else None
                    ).first()

                    # Initialize discount variables for group
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    Discountmethod = None
                    final_rate = None
                    discount_value = 0
                    LabDiscount = None

                    if Discount:
                        LabDiscount = DiscountFeeLab.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Lab_Test_Id__Test_Id=test_cost.Test_Id if test_cost else None
                        ).first()
                        print(LabDiscount, 'RadDiscount', test_cost.Test_Id if test_cost else None)

                        rate = test_cost.Basic if test_cost else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = LabDiscount.discount_method if LabDiscount else None
                        discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'

                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')

                    # Check for insurance category
                    if lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Insurance':
                        patinsurance = lab_request.IP_Register_Id.InsuranceName.Insurance_Id if lab_request.IP_Register_Id.InsuranceName else None
                        
                        insurancefee = InsuranceFeeLab.objects.filter(insurance__Insurance_Id=patinsurance, Lab_Test_Id__Test_Id=test_cost.Test_Id if test_cost else None).first()
                        
                        if insurancefee:
                            item_details.append({
                                "type": "group",
                                "S_No": index,
                                "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
                                "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
                                "Gender": "All",
                                "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
                                "group_items": group_items,
                                "ServiceType": "Lab",
                                "Charges": insurancefee.Cur_Test_Fee,
                                "Amount": insurancefee.Cur_Test_Fee,
                                "NetAmount": insurancefee.Cur_Test_Fee,
                                "Total": insurancefee.Cur_Test_Fee,
                                "Quantity": 1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                                'CGHScode': test_cost.CGHS_CODE if test_cost else ''
                            })
                        else:
                            # Fallback
                            if LabDiscount and final_rate is not None:
                                item_details.append({
                                    "type": "group",
                                    "S_No": index,
                                    "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
                                    "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
                                    "Gender": "All",
                                    "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
                                    "group_items": group_items,
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": round(final_rate, 2),
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity": 1,
                                    "DiscountType": discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt': discount_amount_display,
                                    'Finalrate': round(final_rate, 2),
                                    'Discountmethod': Discountmethod,
                                    'Discountval': discount_value,
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                })
                            else:
                                item_details.append({
                                    "type": "group",
                                    "S_No": index,
                                    "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
                                    "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
                                    "Gender": "All",
                                    "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
                                    "group_items": group_items,
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity": 1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                })
                    else:
                        # Regular patient
                        if LabDiscount and final_rate is not None:
                            item_details.append({
                                "type": "group",
                                "S_No": index,
                                "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
                                "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
                                "Gender": "All",
                                "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
                                "group_items": group_items,
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "NetAmount": round(final_rate, 2),
                                "Total": test_cost.Basic if test_cost else None,
                                "Quantity": 1,
                                "DiscountType": discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt': discount_amount_display,
                                'Finalrate': round(final_rate, 2),
                                'Discountmethod': Discountmethod,
                                'Discountval': discount_value,
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            })
                        else:
                            item_details.append({
                                "type": "group",
                                "S_No": index,
                                "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
                                "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
                                "Gender": "All",
                                "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
                                "group_items": group_items,
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "Quantity": 1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            })

                    TestDetails.append({
                        "type": "group",
                        "S_No": index,
                        "Group_Code": item.Group_Code.Group_Code if item.Group_Code else None,
                        "SelectItemName": item.Group_Code.Group_Name if item.Group_Code else None,
                        "Gender": "All",
                        "SubDepartment_Code": item.Group_Code.Department.SubDepartment_Code if item.Group_Code.Department else None,
                        "Department": item.Group_Code.Department.SubDepartment_Name if item.Group_Code.Department else None,
                        "group_items": group_items,
                        "ServiceType": "Lab",
                        "Charges": test_cost.Basic if test_cost else None,
                        "Amount": test_cost.Basic if test_cost else None,
                        "NetAmount": test_cost.Basic if test_cost else None,
                        "Total": test_cost.Basic if test_cost else None,
                        "Quantity": 1,
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
                        "TestType": "Group",
                        "ColumName": "Group_Code",
                        "Result_Value": None
                    })
  
                elif item.TestType.lower() == "offers":
                    print('offer insideeeeeeeeeeeeee')
                    
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
                    
                    # Initialize discount variables for offers
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    Discountmethod = None
                    final_rate = None
                    discount_value = 0
                    LabDiscount = None

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=lab_request.IP_Register_Id.PatientCategory if lab_request.IP_Register_Id else None
                    ).first()

                    if Discount:
                        LabDiscount = DiscountFeeLab.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Lab_Test_Id__Test_Id=test_cost.Test_Id if test_cost else None
                        ).first()
                        print(LabDiscount, 'RadDiscount', test_cost.Test_Id if test_cost else None)

                        rate = test_cost.Basic if test_cost else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = LabDiscount.discount_method if LabDiscount else None
                        discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'

                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                    
                    # Check for insurance category
                    if lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Insurance':
                        patinsurance = lab_request.IP_Register_Id.InsuranceName.Insurance_Id if lab_request.IP_Register_Id.InsuranceName else None
                        
                        insurancefee = InsuranceFeeLab.objects.filter(insurance__Insurance_Id=patinsurance, Lab_Test_Id__Test_Id=test_cost.Test_Id if test_cost else None).first()

                        if insurancefee:
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
                                    "Charges": insurancefee.Cur_Test_Fee,
                                    "Amount": insurancefee.Cur_Test_Fee,
                                    "NetAmount": insurancefee.Cur_Test_Fee,
                                    "Total": insurancefee.Cur_Test_Fee,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                    'CGHScode': test_cost.CGHS_CODE if test_cost else ''
                                }
                            )
                        else:
                            # Fallback to regular pricing
                            if LabDiscount and final_rate is not None:
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
                                        "NetAmount": round(final_rate, 2),
                                        "Total": test_cost.Basic if test_cost else None,
                                        "Quantity":1,
                                        "DiscountType": discount_value_display,
                                        'Discount': discount_value if discount_value else '-',
                                        'Discountamt': discount_amount_display,
                                        'Finalrate': round(final_rate, 2),
                                        'Discountmethod': Discountmethod,
                                        'Discountval': discount_value,
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                    }
                                )
                            else:
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
                    else:
                        # Regular patient (not insurance)
                        if LabDiscount and final_rate is not None:
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
                                    "NetAmount": round(final_rate, 2),
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt': discount_amount_display,
                                    'Finalrate': round(final_rate, 2),
                                    'Discountmethod': Discountmethod,
                                    'Discountval': discount_value,
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                        else:
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
                            "TestType": "Offers",
                            "ColumName": "Package_Code",
                            "Result_Value": None
                        }
                    )

            Registration_Id = None
            AdmissionDate = None
            if lab_request.RegisterType in ["OP", "LAB"]:
                Registration_Id = lab_request.OP_Register_Id.Registration_Id if lab_request.OP_Register_Id else None
            elif lab_request.RegisterType == "IP":
                Registration_Id = lab_request.IP_Register_Id.Registration_Id if lab_request.IP_Register_Id else None
                AdmissionDate = lab_request.IP_Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p') if lab_request.IP_Register_Id else None

            room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=Registration_Id).last()
            ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
            bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

            # Category
            categoryname = None
            categoryid = None
            if lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Insurance':
                categoryname = lab_request.IP_Register_Id.InsuranceName.Insurance_Name if lab_request.IP_Register_Id.InsuranceName else None
                categoryid = lab_request.IP_Register_Id.InsuranceName.Insurance_Id if lab_request.IP_Register_Id.InsuranceName else None
            elif lab_request.IP_Register_Id and lab_request.IP_Register_Id.PatientCategory == 'Client':
                categoryname = lab_request.IP_Register_Id.ClientName.Client_Name if lab_request.IP_Register_Id.ClientName else None
                categoryid = lab_request.IP_Register_Id.ClientName.Client_Id if lab_request.IP_Register_Id.ClientName else None

            response_data.append({
                "id": lab_request.Request_Id,
                "Request_Id": lab_request.Request_Id,
                "Status": lab_request.Status,
                "BarcodeInvoice": lab_request.Billing_Invoice_No.Billing_Invoice_No if lab_request.Billing_Invoice_No else None,
                "Billing_Invoice_No": lab_request.Billing_Invoice_No.Billing_Invoice_No if lab_request.Billing_Invoice_No else None,
                "Billing_Status": lab_request.Billing_Status,
                "BillingType": 'Lab',
                "OP_Register_Id": lab_request.OP_Register_Id.pk if lab_request.OP_Register_Id else None,
                "created_by": lab_request.created_by,
                "Location_Name": lab_request.Location.Location_Name,
                "CreatedAt": lab_request.created_at,
                "UpdatedAt": lab_request.updated_at,
                "PatientId": patient.PatientId if patient else None,
                "Patient_Name": f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip() if patient else None,
                "PhoneNo": patient.PhoneNo if patient else None,
                "DoctorID": doctor.Doctor_ID if doctor else None,
                "DoctorName": f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None,
                "Doctor_ShortName": f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None,
                "RegisterType": lab_request.RegisterType,
                "ItemDetails": item_details,
                "Age": patient.Age if patient else None,
                "Area": patient.Area if patient else None,
                "BloodGroup": patient.BloodGroup.BloodGroup_Name if patient and patient.BloodGroup else None,
                "City": patient.City if patient else None,
                "Country": patient.Country if patient else None,
                "DOB": patient.DOB if patient else None,
                "Date": datetime.now().date(),
                "DoorNo": patient.DoorNo if patient else None,
                "Email": patient.Email if patient else None,
                "FirstName": patient.FirstName if patient else None,
                "AgeGender": f"{patient.Age if patient else None}/{patient.Gender if patient else None}",
                "Gender": patient.Gender if patient else None,
                "MiddleName": patient.MiddleName if patient else None,
                "Nationality": patient.Nationality if patient else None,
                "Occupation": patient.Occupation if patient else None,
                "PatientCategory": lab_request.IP_Register_Id.PatientCategory if lab_request.IP_Register_Id else lab_request.OP_Register_Id.PatientCategory if lab_request.OP_Register_Id else None,
                "PatientCategoryName": categoryname,
                "PatientId": patient.PatientId if patient else None,
                "Pincode": patient.Pincode if patient else None,
                "Religion": patient.Religion.Religion_Id if patient and patient.Religion else None,
                "State": patient.State if patient else None,
                "Street": patient.Street if patient else None,
                "SurName": patient.SurName if patient else None,
                "Title": patient.Title.Title_Name if patient and patient.Title else None,
                "UniqueIdNo": patient.UniqueIdNo if patient else None,
                "UniqueIdType": patient.UniqueIdType if patient else None,
                "VisitPurpose": lab_request.OP_Register_Id.VisitPurpose if lab_request.OP_Register_Id else None,
                "VisitType": lab_request.RegisterType,
                "ServiceProcedureForm": "Lab",
                "filterdepartment": filterdepartment,
                "TestDetails": TestDetails,
                "filterSpecimen": filterSpecimen,
                "VisitId": lab_request.OP_Register_Id.VisitId if lab_request.OP_Register_Id else None,
                "Report": None,
                "Registration_Id": Registration_Id,
                "WardName": ward_name,
                "ward": f"{ward_name}-{bedno}" if ward_name and bedno else None,
                "AdmittionDate": AdmissionDate,
            })

        # Handle response based on Billing_Status1 parameter
        if Billing_Status1 is not None:
            return response_data
        else:
            # Convert response data to JSON serializable format
            serializable_response = []
            for item in response_data:
                serializable_item = {}
                for key, value in item.items():
                    # Handle datetime objects
                    if isinstance(value, (datetime, date)):
                        if isinstance(value, datetime):
                            serializable_item[key] = value.isoformat()
                        else:
                            serializable_item[key] = value.isoformat()
                    # Handle model instances
                    elif hasattr(value, '__dict__'):
                        # Try to get primary key if available
                        if hasattr(value, 'pk'):
                            serializable_item[key] = value.pk
                        else:
                            serializable_item[key] = str(value)
                    # Handle other non-serializable types
                    elif isinstance(value, (set, bytes)):
                        serializable_item[key] = list(value) if isinstance(value, set) else value.decode('utf-8') if isinstance(value, bytes) else str(value)
                    else:
                        serializable_item[key] = value
                serializable_response.append(serializable_item)
            
            return JsonResponse(serializable_response, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)


def get_lab_request_details_op(request,Billing_Status1=None,queue_type1=None,Type=None,PatCategory=None):
    try:
        # Extract query parameters
        query = request.GET.get("query", "")
        status = request.GET.get("status", "")
        Billing_Status = request.GET.get("Billing_Status")
        PatCategory = request.GET.get('PatCategory')
        
        if Billing_Status1 is None:
            Billing_Status = Billing_Status
        else:
            Billing_Status = Billing_Status1
        print("Billing_Status 1:",Billing_Status,type(Billing_Status))
        Service_Status = request.GET.get("Service_Status")
        if queue_type1 is None:
            queue_type = request.GET.get("queue_type", "").lower()
        else:
            queue_type = queue_type1
        Report = None
        registration_id = request.GET.get("Registration_id", None)  # Extract registration_id from query parameters

        # Fetch all Lab_Request_Details
        if Type == "OP":
            queryset = Lab_Request_Details.objects.filter(RegisterType__in=["LAB","OP"], Billing_Status = 'Pending')
        elif Type == "IP":
            queryset = Lab_Request_Details.objects.filter(RegisterType="IP").all()
        else:
            queryset = Lab_Request_Details.objects.all()
            
        print("queue_type :", queue_type)
        Analysis_Status = "Pending"
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query)
                | Q(OP_Register_Id__PatientId__MiddleName__icontains=query)
                | Q(OP_Register_Id__PatientId__SurName__icontains=query)
                | Q(OP_Register_Id__PatientId__PatientId__icontains=query)
                | Q(OP_Register_Id__PatientId__PhoneNo__icontains=query)
                | Q(IP_Register_Id__PatientId__FirstName__icontains=query)
                | Q(IP_Register_Id__PatientId__MiddleName__icontains=query)
                | Q(IP_Register_Id__PatientId__SurName__icontains=query)
                | Q(IP_Register_Id__PatientId__PatientId__icontains=query)
                | Q(IP_Register_Id__PatientId__PhoneNo__icontains=query)
                | Q(Casuality_Register_Id__PatientId__FirstName__icontains=query)
                | Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query)
                | Q(Casuality_Register_Id__PatientId__SurName__icontains=query)
                | Q(Casuality_Register_Id__PatientId__PatientId__icontains=query)
                | Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query)
            )

        if queue_type == "billling":
            queryset = queryset.filter(Billing_Status="Pending")
            print('checkk11',queryset)
        elif queue_type == "samplecollection":
            queryset = queryset.filter(
                Billing_Status="Completed",
                lab_request_items__Service_Status="Pending",
                lab_request_items__Analysis_Status="Pending",
                lab_request_items__Verify_Status="Pending",
                lab_request_items__Approve_Status="Pending",
            ).distinct()
        elif queue_type == "resultentry":
            Analysis_Status = "Completed"
            queryset = queryset.filter(
                Billing_Status="Completed",
                lab_request_items__Service_Status="Completed",
                Status = "Pending"
            ).distinct()
        # queryset = Lab_Request_Details.objects.all()
        print("queryset 1 :", queryset)
        if status:
            queryset = queryset.filter(Status__icontains=status)

        # Filter by registration_id if provided
        if registration_id:
            queryset = queryset.filter(
                Q(OP_Register_Id__Registration_Id=registration_id) |
                Q(IP_Register_Id__Registration_Id=registration_id) |
                Q(Casuality_Register_Id__Registration_Id=registration_id)
            )

        response_data = []

        print("Type :",Type)
        # Iterate through filtered Lab_Request_Details
        for lab_request in queryset:
            print("lab_request :", lab_request.OP_Register_Id)
            doctorins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=lab_request.OP_Register_Id).first()
            
            print(doctorins,'doctorinsdoctorins')
            if Type == "OP":
                if lab_request.OP_Register_Id:
                    patient = lab_request.OP_Register_Id.PatientId
                    doctor = doctorins.PrimaryDoctor
                else:
                    patient = None
                    doctor = None
            elif Type == "IP":
                print("lab_request.IP_Register_Id :",lab_request.IP_Register_Id)
                if lab_request.IP_Register_Id:
                    patient = lab_request.IP_Register_Id.PatientId
                    doctor = lab_request.IP_Register_Id.PrimaryDoctor
                else:
                    patient = None
                    doctor = None
            elif Type is None:
                if lab_request.IP_Register_Id:
                    patient = lab_request.IP_Register_Id.PatientId
                    doctor = lab_request.IP_Register_Id.PrimaryDoctor
                elif lab_request.OP_Register_Id:
                    patient = lab_request.OP_Register_Id.PatientId
                    doctor = doctorins.PrimaryDoctor
                elif lab_request.Casuality_Register_Id:
                    patient = lab_request.Casuality_Register_Id.PatientId
                    doctor = lab_request.Casuality_Register_Id.PrimaryDoctor
                else:
                    patient = None
                    doctor = None
            else:
                if lab_request.IP_Register_Id:
                    patient = lab_request.IP_Register_Id.PatientId
                    doctor = lab_request.IP_Register_Id.PrimaryDoctor
                elif lab_request.OP_Register_Id:
                    patient = lab_request.OP_Register_Id.PatientId
                    doctor = doctorins.PrimaryDoctor
                elif lab_request.Casuality_Register_Id:
                    patient = lab_request.Casuality_Register_Id.PatientId
                    doctor = lab_request.Casuality_Register_Id.PrimaryDoctor
                else:
                    patient = None
                    doctor = None

            print("patient :", patient)
            item_details = []
            filterdepartment = []
            TestDetails = []
            keys_seen = set()
            filterSpecimen = []
            Specimen_keys_seen = set()
            for index, item in enumerate(lab_request.lab_request_items.all(), start=1):
                print("TestType :",item.TestType)
                if item.TestType.lower() == "individual":
                    if Billing_Status == "Completed":
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
                    print("item.Test_Code :", item.Test_Code.Test_Code)
                    test_cost = Testmaster_Cost_List.objects.filter(
                        Test_Code=item.Test_Code.Test_Code
                    ).first()
                   
                    print('Billing_Status :',Billing_Status)
                    
                    if Billing_Status == "Completed":
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

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=PatCategory
                    ).first()

                    LabDiscount = None

                    if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=test_cost.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount', test_cost.Test_Id)

                            rate = test_cost.Basic if test_cost else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"

                            item_details.append(
                                    {
                                        "type": "individual",
                                        "S_No": index,
                                        "Request_Id": lab_request.Request_Id,
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
                                        "NetAmount": final_rate ,
                                        "Quantity":1,
                                        "DiscountType": discount_value_display,
                                        'Discount': discount_value if discount_value else '-',
                                        'Discountamt' : discount_amount_display,
                                        'Finalrate': round(final_rate, 2),
                                        'Discountmethod' : Discountmethod,
                                        'Discountval' : discount_value,
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                    }
                                )
                


                    else:
                        item_details.append(
                            {
                                "type": "individual",
                                "S_No": index,
                                "Request_Id": lab_request.Request_Id,
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
                    if Billing_Status == "Completed":
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
                    print("key",item.Group_Code)
                    test_cost = Testmaster_Cost_List.objects.filter(
                        Group_Code=item.Group_Code
                    ).first()

                    # Fetch sub-items for the group
                    group_items = []
                    sub_item_instances = Group_Master_TestList.objects.filter(
                        Group_Code=item.Group_Code
                    )
                    print("key22",sub_item_instances)
                    try:
                        for sub_item in sub_item_instances:
                            
                            print("hdhdjee",sub_item)
                            if sub_item.Test_Code:
                                print("hellllooooo")
                                Specimen_Name = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Name 
                                    if sub_item.Test_Code and sub_item.Test_Code.Specimen_Name 
                                    else None
                                )

                            
                                Specimen_Code = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Code 
                                    if sub_item.Test_Code and sub_item.Test_Code.Specimen_Name 
                                    else None
                                )

                                print("hello1")
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
                                print("hello2")
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
                                print("hello3")

                                sub_item_data["Result_Value"] = None

                                sub_item_data["columnname"] = "Group_Code"

                                group_items.append(sub_item_data)

                        
                        Discount = DiscountMaster.objects.filter(
                            Service__ServiceCategory='LAB',
                            Patient_Type=PatCategory
                        ).first()

                        LabDiscount = None

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=test_cost.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount', test_cost.Test_Id)

                            rate = test_cost.Basic if test_cost else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"

                            item_details.append(
                                {
                                    "type": "group",
                                    "S_No": index,
                                    "Request_Id": lab_request.Request_Id,
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
                                    "NetAmount": final_rate,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt' : discount_amount_display,
                                    'Finalrate': round(final_rate, 2),
                                    'Discountmethod' : Discountmethod,
                                    'Discountval' : discount_value,
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                            print("hello4")

                        else:

                            item_details.append(
                                {
                                    "type": "group",
                                    "S_No": index,
                                    "Request_Id": lab_request.Request_Id,
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
                            print("hello4")
                            
                        
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
                    except Exception as e:
                        print(str(e))
                        
        
                elif item.TestType.lower() == "offers":
                    
                    sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
                    if Billing_Status == "Completed":
                        
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
                        print("-------Item Test_Code-------",sub_item.Test_Code)
                        print("-------Item Group_Code-------",sub_item.Group_Code)
                        
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
                        
                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=PatCategory
                    ).first()

                    LabDiscount = None

                    if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=test_cost.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount', test_cost.Test_Id)

                            rate = test_cost.Basic if test_cost else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"

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
                                    "DiscountType": discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt' : discount_amount_display,
                                    'Finalrate': round(final_rate, 2),
                                    'Discountmethod' : Discountmethod,
                                    'Discountval' : discount_value,
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                    
                
                    else:
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
                                "DiscountType": discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Finalrate': round(final_rate, 2),
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
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
            
            
            
            Registration_Id = None
            

            # if lab_request.RegisterType == "OP" or lab_request.RegisterType == "LAB" :
            if lab_request.RegisterType in ["OP","LAB"]:
                Registration_Id = lab_request.OP_Register_Id.Registration_Id if lab_request.OP_Register_Id is not None else None
            elif lab_request.RegisterType == "IP":
                Registration_Id = lab_request.IP_Register_Id.Registration_Id if lab_request.IP_Register_Id is not None else None
               
            # Append all details to response
            response_data.append(
                {
                    "id": lab_request.Request_Id,
                    "Request_Id": lab_request.Request_Id,
                    "Status": lab_request.Status,
                    "BarcodeInvoice": (
                        lab_request.Billing_Invoice_No.Billing_Invoice_No
                        if lab_request.Billing_Invoice_No is not None
                        else None
                    ),
                    "Billing_Invoice_No": (
                        lab_request.Billing_Invoice_No.Billing_Invoice_No
                        if lab_request.Billing_Invoice_No is not None
                        else None
                    ),
                    "Billing_Status": lab_request.Billing_Status,
                    "BillingType": 'Lab',
                    "OP_Register_Id": lab_request.OP_Register_Id.pk if lab_request.OP_Register_Id is not None else None,
                    # "Registration_Id": lab_request.IP_Register_Id.pk if lab_request.IP_Register_Id is not None else None,
                    "created_by": lab_request.created_by,
                    "Location_Name": lab_request.Location.Location_Name,
                    # "Location": lab_request.Location.Location_Id,
                    "CreatedAt": lab_request.created_at,
                    "UpdatedAt": lab_request.updated_at,
                    "PatientId": patient.PatientId if patient else None,
                    "Patient_Name": (
                        f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip()
                        if patient
                        else None
                    ),
                    "PhoneNo": patient.PhoneNo if patient else None,
                    "DoctorID": doctor.Doctor_ID if doctor is not None else None,
                    "DoctorName": (
                        f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()
                        if doctor
                        else None
                    ),
                    "Doctor_ShortName": f"{doctor.Tittle.Title_Name}.{doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None,
                    "RegisterType": lab_request.RegisterType,
                    "ItemDetails": item_details,
                    "Age": patient.Age if patient else None,
                    "Area": patient.Area if patient else None,
                    "BloodGroup": (
                        patient.BloodGroup.BloodGroup_Name
                        if patient.BloodGroup is not None
                        else None
                    ),
                    "City": patient.City if patient else None,
                    "Complaint": (
                        doctorins.Complaint
                        if lab_request.OP_Register_Id
                        else None
                    ),
                    "Country": patient.Country if patient else None,
                    "DOB": patient.DOB if patient else None,
                    "Date": datetime.now().date(),
                    "DoorNo": patient.DoorNo if patient else None,
                    "Email": patient.Email if patient else None,
                    "FirstName": patient.FirstName if patient else None,
                    'AgeGender':f"{patient.Age if patient else None}/{patient.Gender if patient else None}",
                    "Gender": patient.Gender if patient else None,
                    "MiddleName": patient.MiddleName if patient else None,
                    "Nationality": patient.Nationality if patient else None,
                    "Occupation": patient.Occupation if patient else None,
                    "PatientCategory": (
                        lab_request.OP_Register_Id.PatientCategory
                        if lab_request.OP_Register_Id
                        else None
                    ),
                    "PatientId": patient.PatientId if patient else None,
                    # "PatientType": lab_request.OP_Register_Id.PatientCategory if lab_request.OP_Register_Id is not None else None,
                    "Pincode": patient.Pincode if patient else None,
                    
                    "Religion": (
                        patient.Religion.Religion_Id
                        if patient.Religion is not None
                        else None
                    ),
                    "State": patient.State if patient else None,
                    "Street": patient.Street if patient else None,
                    "SurName": patient.SurName if patient else None,
                    "Title": (
                        patient.Title.Title_Name if patient.Title is not None else None
                    ),
                    "UniqueIdNo": patient.UniqueIdNo if patient else None,
                    "UniqueIdType": patient.UniqueIdType if patient else None,
                    "VisitPurpose": (
                        lab_request.OP_Register_Id.VisitPurpose
                        if lab_request.OP_Register_Id
                        else None
                    ),
                    "VisitType": lab_request.RegisterType,
                    "ServiceProcedureForm": "Lab",
                    "filterdepartment": filterdepartment,
                    "TestDetails": TestDetails,
                    "filterSpecimen": filterSpecimen,
                    "VisitId": lab_request.OP_Register_Id.VisitId if lab_request.OP_Register_Id is not None else None,
                    "Report": Report,
                    "Registration_Id": Registration_Id
                    
                }
            )

        if Billing_Status1 is not None:
            return response_data
        else:
            return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": "An internal server error occurred"}, status=500)




@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def POST_Lab_Data(request):
    try:
        print('request.method :',request.method)
        if request.method == "POST":
            all_data = json.loads(request.body) 
            # print("all_data :", all_data)
            
            PageType = all_data.get("PageType") 
            if PageType == "ReportVerify":
                SelectedTest = all_data.get("Verify_FilteredTests", [])
            elif PageType == "ResultEntry":
                SelectedTest = all_data.get("Analysis_FilteredTests", [])
            elif PageType == "ReportApprove":
                SelectedTest = all_data.get("Approve_FilteredTests", [])
            elif PageType == "SampleCollection":
                SelectedTest = all_data.get("SelectedTest", [])
            else:
                return JsonResponse({"warn": "Invalid PageType"})
            # print('PageType :',PageType)
            # print('SelectedTest :',SelectedTest)

            Billing_Invoice_No = all_data.get("Billing_Invoice_No")
            SelectedTest = all_data.get("SelectedTest", [])
            RegisterType = all_data.get("RegisterType", "")  # Extract RegisterType
            registration_id = all_data.get(
                "Registration_Id", ""
            )  
            print("registration_id :", registration_id)
            lab_request = Lab_Request_Details.objects.filter(
                Billing_Invoice_No=Billing_Invoice_No
            ).first()
            # print("lab_request :", lab_request)

            # Determine the ForeignKey field based on RegisterType
            register_kwargs = {}
            ins = None
            if RegisterType == "OP":
                try:
                    op_register_instance = (
                        Patient_Appointment_Registration_Detials.objects.get(
                            Registration_Id=registration_id
                        )
                    )
                    print("op_register_instance :", op_register_instance)
                    register_kwargs["OP_Register_Id"] = op_register_instance
                    ins = op_register_instance

                except Patient_Appointment_Registration_Detials.DoesNotExist:
                    return JsonResponse(
                        {"warn": "OP Registration ID not found"}, status=400
                    )
            elif RegisterType == "IP":
                try:
                    ip_register_instance = Patient_IP_Registration_Detials.objects.get(
                        Registration_Id=registration_id
                    )
                    register_kwargs["IP_Register_Id"] = ip_register_instance
                except Patient_IP_Registration_Detials.DoesNotExist:
                    return JsonResponse(
                        {"warn": "IP Registration ID not found"}, status=400
                    )
            elif RegisterType == "Casuality":
                try:
                    casuality_register_instance = (
                        Patient_Casuality_Registration_Detials.objects.get(
                            Registration_Id=registration_id
                        )
                    )
                    register_kwargs["Casuality_Register_Id"] = casuality_register_instance
                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse(
                        {"warn": "Casuality Registration ID not found"}, status=400
                    )
            else:
                return JsonResponse(
                    {"warn": f"Invalid RegisterType: {RegisterType}"}, status=400
                )
            print("register_kwargs :", register_kwargs)
            if lab_request:
                for key, value in all_data.items():
                    if hasattr(lab_request, key):
                        if key == "Billing_Invoice_No":
                            # Retrieve the related instance for ForeignKey
                            billing_instance = General_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=value
                            ).first()
                            if billing_instance:
                                setattr(lab_request, key, billing_instance)
                        elif key == "OP_Register_Id":
                            if ins:
                                setattr(lab_request, key, ins)
                        else:
                            setattr(lab_request, key, value)
                # Update ForeignKey fields
                for key, value in register_kwargs.items():
                    if hasattr(lab_request, key):
                        setattr(lab_request, key, value)  # Assign the model instance
            lab_request.save()

            for test_data in SelectedTest:
                # print("test_data :", test_data)
                Code = ''
                columnname = test_data.get("ColumName")
                type = test_data.get("type")
                if type == "individual":
                    Code = test_data.get("Test_Code")
                elif type == "group":
                    Code = test_data.get("Group_Code")


                userid = all_data.get("user_id")
                PageType = all_data.get("PageType")
                # print("PageType :", PageType)
                # print("userid :", userid)
                if PageType == "ResultEntry":
                    test_data['Technician_Name'] = userid
                elif PageType == "SampleCollection":
                    test_data['Phelobotomist_Name'] = userid
                elif PageType == "ReportVerify":
                    test_data['Verfier_Name'] = userid
                elif PageType == "ReportApprove":
                    test_data['Approver_Name'] = userid
                print('lab_request.Request_Id :',lab_request.Request_Id)
                print('columnname :',columnname)
                if lab_request.Request_Id:
                    filter_params = {columnname: Code}

                    lab_request_item = Lab_Request_Items_Details.objects.filter(
                        Request=lab_request, **filter_params
                    ).first()
                    print('lab_request_item :',lab_request_item)
                    if lab_request_item:
                        for key, value in test_data.items():
                            if hasattr(lab_request_item, key):
                                if key == "Test_Code":
                                    # Fetch the related Test_Descriptions instance
                                    Test_instance = Test_Descriptions.objects.filter(
                                        Test_Code=value
                                    ).first()
                                    if Test_instance:
                                        setattr(lab_request_item, key, Test_instance)
                                elif key == "Group_Code":
                                    # Fetch the related Test_Descriptions instance
                                    Group_instance = Group_Master.objects.filter(
                                        Group_Code=value
                                    ).first()
                                    
                                    if Group_instance:
                                        setattr(lab_request_item, key, Group_instance)
                                elif key == "Department_Code":
                                    # Fetch the related Lab_Department_Detials instance
                                    Department_instance = (
                                        Lab_Department_Detials.objects.filter(
                                            Department_Code=value
                                        ).first()
                                    )
                                    if Department_instance:
                                        setattr(lab_request_item, key, Department_instance)
                                elif key == "SubDepartment_Code":
                                    # Fetch the related SubLab_Department_Detials instance
                                    SubDepartment_instance = (
                                        SubLab_Department_Detials.objects.filter(
                                            SubDepartment_Code=value
                                        ).first()
                                    )
                                    if SubDepartment_instance:
                                        setattr(
                                            lab_request_item, key, SubDepartment_instance
                                        )
                                elif key == "Technician_Name":
                                    # Fetch the related SubLab_Department_Detials instance
                                    UserRegisterMasterDetails_instance = (
                                        UserRegister_Master_Details.objects.filter(
                                            User_Id=value
                                        ).first()
                                    )
                                    if UserRegisterMasterDetails_instance:
                                        setattr(
                                            lab_request_item, key, UserRegisterMasterDetails_instance.Employee_Id
                                        )
                                elif key == "Phelobotomist_Name":
                                    # Fetch the related SubLab_Department_Detials instance
                                    UserRegisterMasterDetails_instance = (
                                        UserRegister_Master_Details.objects.filter(
                                            User_Id=value
                                        ).first()
                                    )
                                    if UserRegisterMasterDetails_instance:
                                        setattr(
                                            lab_request_item, key, UserRegisterMasterDetails_instance.Employee_Id
                                        )
                                elif key == "Verfier_Name":
                                    # Fetch the related SubLab_Department_Detials instance
                                    UserRegisterMasterDetails_instance = (
                                        UserRegister_Master_Details.objects.filter(
                                            User_Id=value
                                        ).first()
                                    )
                                    if UserRegisterMasterDetails_instance:
                                        setattr(
                                            lab_request_item, key, UserRegisterMasterDetails_instance.Employee_Id
                                        )
                                elif key == "Approver_Name":    
                                    # Fetch the related SubLab_Department_Detials instance
                                    UserRegisterMasterDetails_instance = (
                                        UserRegister_Master_Details.objects.filter(
                                            User_Id=value
                                        ).first()
                                    )
                                    if UserRegisterMasterDetails_instance:
                                        setattr(
                                            lab_request_item, key, UserRegisterMasterDetails_instance.Employee_Id
                                        )
                                else:
                                    # Update any other attributes directly
                                    setattr(lab_request_item, key, value)
                        # Save changes to the current test item
                        lab_request_item.save()

            return JsonResponse({"message": "Data processed successfully."}, status=200)
        
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)



from django.http import HttpResponse
import mimetypes
from io import BytesIO
from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist

def update_report(response, Request_Id):
    try:
        lab_request = Lab_Request_Details.objects.filter(Request_Id=Request_Id).first()
        if lab_request:
            pdf_content = response.content  # This is already a bytearray or bytes
            lab_request.Report = pdf_content  # No need to encode
            lab_request.save()
            updated_lab_request = Lab_Request_Details.objects.filter(Request_Id=Request_Id).first()
            if updated_lab_request and updated_lab_request.Report:
                updated_pdf_response = HttpResponse(updated_lab_request.Report, content_type='application/pdf')
                updated_pdf_response['Content-Disposition'] = 'inline; filename="test_report.pdf"'
                return updated_pdf_response
            else:
                return JsonResponse({"error": "PDF content not found after saving."})
        else:
            return JsonResponse({"error": "Lab request not found."})
    except Exception as e:
        return JsonResponse({"error": "An internal server error occurred."})




def ReportData(request):
    try:
        Request_Id = request.GET.get("Request_Id")
        print('Request_Id :',Request_Id)
        class PDF(FPDF):
            def __init__(self, patient_details,clinicdetails, *args, **kwargs):
                super().__init__(*args, **kwargs)
                self.patient_details = patient_details
                self.clinicdetails = clinicdetails
                self.is_first_page = True  
            def clicnicheader(self): 
                row_height = 6
                self.set_font('Arial', 'B', 12)     
                self.cell(0, row_height, self.clinicdetails.get("Clinic_Name"), 0, 1, 'C') 
                self.set_font('Arial', '', 10) 
                self.cell(0, row_height, self.clinicdetails.get("Address1"), 0, 1, 'C') 
                self.cell(0, row_height, self.clinicdetails.get("Address2"), 0, 1, 'C') 
                self.cell(0, row_height, f"""{self.clinicdetails.get("Clinic_PhoneNo")}, {self.clinicdetails.get("Clinic_LandlineNo")} {self.clinicdetails.get("Clinic_Mail")}""", 0, 1, 'C') 
                self.ln(3)  # Space before the line
                self.line(10, self.get_y(), 200, self.get_y()) # Add line under clinic header
                self.ln(3)  # Space after the line
            def header(self):
                self.clicnicheader()
                if self.is_first_page:
                    self.set_font('Arial', '', 10)
                    name = self.patient_details.get('name', 'N/A')
                    date = str(self.patient_details.get('date', 'N/A'))
                    phone = self.patient_details.get('phone', 'N/A')
                    gender = self.patient_details.get('Gender', 'N/A')
                    age = str(self.patient_details.get('age', 'N/A'))
                    location = self.patient_details.get('location', 'N/A')
                    doctorname = self.patient_details.get('doctorname', 'N/A')
                    barcode = self.patient_details.get('barcode', 'N/A')
                    label_width = 40  # Width for label
                    colon_width = 5   # Width for colon
                    value_width = 50  # Width for value
                    spacing = 10      # Spacing between label-value pairs
                    row_height = 6    # Row height
                    self.cell(label_width, row_height, 'Name', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, name, 0, 0, 'L')
                    self.cell(spacing, row_height, '', 0, 0, 'L')  # Spacer
                    self.cell(label_width, row_height, 'Date', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, date, 0, 1, 'L')
                    self.cell(label_width, row_height, 'Phone', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, phone, 0, 0, 'L')
                    self.cell(spacing, row_height, '', 0, 0, 'L')  # Spacer
                    self.cell(label_width, row_height, 'Barcode', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, barcode, 0, 1, 'L')
                    self.cell(label_width, row_height, 'Age', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, age, 0, 0, 'L')
                    self.cell(spacing, row_height, '', 0, 0, 'L')  # Spacer
                    self.cell(label_width, row_height, 'Location', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, location, 0, 1, 'L')
                    self.cell(label_width, row_height, 'Doctor Name', 0, 0, 'L')
                    self.cell(colon_width, row_height, ':', 0, 0, 'L')
                    self.cell(value_width, row_height, doctorname, 0, 1, 'L')
                    self.ln(5)
                    self.line(10, self.get_y(), 200, self.get_y())
                    # self.ln(3)  # Space after the line
                    self.is_first_page = False
            def footer(self):
                self.set_y(-15)
                self.set_font('Arial', 'I', 8)
                self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')
            def add_table_header(self):
                self.set_font('Arial', 'B', 10)
                self.cell(50, 10, "Test Name", 0)
                self.cell(30, 10, "Result", 0)
                self.cell(30, 10, "Indicator", 0)
                self.cell(30, 10, "Unit", 0)
                self.cell(50, 10, "Reference Range", 0)
                self.ln(9)
                self.line(10, self.get_y(), 200, self.get_y())
                self.cell(0, 10, 'Test Report', 0, 1, 'C')
            def add_department_tests(self, department, row_count):
                # print('department department :',department)
                row_height = 6 
                test_row_height = 8 
                self.set_font('Arial', 'B', 12)
                self.cell(0, 10, department["department"], 0, 1, 'L')
                self.ln(5)  
                row_count += 1
                self.set_font('Arial', '', 10)
                for test in department["tests"]:
                    # print('tsets row :',test)
                    if row_count >= 20:
                        self.add_page()
                        self.add_table_header()
                        row_count = 0
                    name = test.get("name", "N/A")
                    result = test.get("result", "N/A")
                    indicator = test.get("indicator", "N/A") or "N/A"
                    unit = test.get("unit", "N/A")
                    reference = test.get("reference", "N/A") or "N/A"
                    self.cell(50, test_row_height, name, 0)
                    self.cell(30, test_row_height, result, 0)
                    self.cell(30, test_row_height, indicator, 0)
                    self.cell(30, test_row_height, unit, 0)
                    self.cell(50, test_row_height, reference, 0)
                    self.ln()
                    row_count += 1
                return row_count
        def get_test_data(lab_request):
            # print('lab_request loop :',lab_request)
            departments_data = []
            lab_request_items = Lab_Request_Items_Details.objects.filter(
                Request=lab_request.Request_Id,
                Service_Status="Completed",
                Analysis_Status="Completed",
                Verify_Status="Verified",
                Approve_Status="Approved"
            )

            # print('lab_request_items :',lab_request_items)
            for item in lab_request_items:
                department = item.SubDepartment_Code.SubDepartment_Name
                # print('item.Test_Code :',item.Test_Code)
                test_description = item.Test_Code
                # print('test_description :',test_description)
                AgeSetup = Age_Setup_Master.objects.filter(Test_Code=item.Test_Code).first()
                test_data = {
                    "name": test_description.Test_Name,
                    "result": item.Result_Value,
                    "indicator": item.Report_Status,
                    "unit": test_description.UOM.Unit_Name if test_description.UOM else "",
                    "reference": AgeSetup.Reference_Range if AgeSetup else "",
                }

                department_entry = next((d for d in departments_data if d["department"] == department), None)
                if department_entry:
                    department_entry["tests"].append(test_data)
                else:
                    departments_data.append({"department": department, "tests": [test_data]})
                # print('departments_data :',departments_data)
            return departments_data
        def get_patient_details(lab_request):
            RegisterDetails = None
            # print('lab_request.RegisterType :',lab_request.OP_Register_Id)
            if lab_request.RegisterType == "OP":
                RegisterDetails = lab_request.OP_Register_Id
            if RegisterDetails.PatientId:
                return {
                    "name": "{} {}{}{}".format(RegisterDetails.PatientId.Title.Title_Name if RegisterDetails.PatientId is not None else '', RegisterDetails.PatientId.FirstName if RegisterDetails.PatientId is not None else '', RegisterDetails.PatientId.MiddleName if RegisterDetails.PatientId is not None else '', RegisterDetails.PatientId.SurName if RegisterDetails.PatientId is not None else ''),
                    "date": datetime.now().date(),
                    "phone": RegisterDetails.PatientId.PhoneNo if RegisterDetails.PatientId is not None else '',
                    "Gender": RegisterDetails.PatientId.Gender if RegisterDetails.PatientId is not None else '',
                    "age": RegisterDetails.PatientId.Age if RegisterDetails.PatientId is not None else '',
                    "location": lab_request.Location.Location_Name if RegisterDetails.PatientId is not None else '',
                    "doctorname": "{} {}{}{}".format(RegisterDetails.PrimaryDoctor.Tittle.Title_Name if RegisterDetails.PrimaryDoctor is not None else '', RegisterDetails.PrimaryDoctor.First_Name if RegisterDetails.PrimaryDoctor is not None else '', RegisterDetails.PrimaryDoctor.Middle_Name if RegisterDetails.PrimaryDoctor is not None else '', RegisterDetails.PrimaryDoctor.Last_Name if RegisterDetails.PrimaryDoctor is not None else ''),
                }
            return {}
        def get_clinicdetails():
            ClinicDetails = None
            ClinicDetails = Clinic_Detials.objects.filter(Clinic_Id=1).first()
            HospitalDetials = Hospital_Detials.objects.filter(Hospital_Id=1).first()
            if ClinicDetails:
                Address1 = f"{ClinicDetails.Clinic_DoorNo}, {ClinicDetails.Clinic_Street}, {ClinicDetails.Clinic_Area},"
                Address2 = f"""{ClinicDetails.Clinic_City},{ClinicDetails.Clinic_State},{ClinicDetails.Clinic_Country} - {ClinicDetails.Clinic_Pincode}"""
                return {
                    "Clinic_Name": HospitalDetials.Hospital_Name,
                    "Address1": Address1,
                    "Address2":Address2,
                    "Clinic_PhoneNo": ClinicDetails.Clinic_PhoneNo,
                    "Clinic_Mail": ClinicDetails.Clinic_Mail,
                    "Clinic_LandlineNo": ClinicDetails.Clinic_LandlineNo,
                }
            return {}
        lab_request = Lab_Request_Details.objects.filter(Request_Id=Request_Id).first()
        # print('lab_request :',lab_request)
        # all_items_completed = lab_request.lab_request_items.filter(
        #     Service_Status="Completed",
        #     Analysis_Status="Completed",
        #     Verify_Status="Verified",
        #     Approve_Status="Approved"
        # ).count() == lab_request.lab_request_items.count()
        
        # lab_request = Lab_Request_Details.objects.prefetch_related(
        #     'lab_request_items'
        # ).get(Request_Id=Request_Id)

        # Add a new attribute to `labrequest` that contains the filtered lab_request_items where statuses are "Completed"
  
        # if not all_items_completed:
        #     return JsonResponse({"error": "Not all items are marked as completed."}, status=404)
        # if not lab_request:
        #     return JsonResponse({"error": "No lab requests found."}, status=404)
        
        # print('lab_request :',lab_request)

        patient_details = get_patient_details(lab_request)
        # print('patient_details :',patient_details)
        departments_data = get_test_data(lab_request)
        clinicdetails = get_clinicdetails()
        pdf = PDF(patient_details,clinicdetails)
        print('pdf :',pdf)
        pdf.add_page()
        pdf.add_table_header()
        row_count = 0
        for department in departments_data:
            if department["department"] not in ["Histopathology", "Microbiology"]:
                row_count = pdf.add_department_tests(department, row_count)
        for department in departments_data:
            if department["department"] in ["Histopathology", "Microbiology"]:
                pdf.add_page()
                pdf.add_table_header()
                row_count = pdf.add_department_tests(department, 0) 
        print('pdf :',pdf)
        pdf_output = BytesIO()
        print('pdf_output :',pdf_output)
        pdf_data = pdf.output(dest='S').encode('latin1')  # Convert to bytes
        if not pdf_data:
            return JsonResponse({"error": "Failed to generate PDF."}, status=500)

        pdf_output.write(pdf_data)
        pdf_output.seek(0) 
        print('pdf_output :',pdf_output) 
        response = HttpResponse(pdf_output, content_type='application/pdf')
        print('response :',response)
        response['Content-Disposition'] = 'attachment; filename="test_report.pdf"'
        updateReport = update_report(response,Request_Id)        
        if "error" in updateReport: 
            return JsonResponse(updateReport) 
        response = HttpResponse(updateReport, content_type='application/pdf') 
        response['Content-Disposition'] = 'attachment; filename="test_report.pdf"'
        return response
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)


