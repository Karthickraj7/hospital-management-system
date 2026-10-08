import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from .models import *
from Frontoffice.models import *
from Workbench.models import *
from Masters.models import *


# @csrf_exempt
# @require_http_methods(["GET"])
# def user_details_for_report(request):

#     if request.method == 'GET':

#         try:
#             roleid = Role_Master.objects.get(Role_Name='CASHIER')
#             userins = Employee_Personal_Form_Detials.objects.filter(Role = roleid)
#             user_data = []

#             for datas in userins:
#                 data_list = {

#                     'Employee_ID' : datas.Employee_ID,
#                     'Empname' : f"""{datas.Tittle.Title_Name} {datas.First_Name} {datas.Middle_Name} {datas.Last_Name} """,
#                 }
#                 user_data.append(data_list)

#             return JsonResponse(user_data,safe=False)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def user_details_for_report(request):

    if request.method == 'GET':

        try:
            # roleid = Role_Master.objects.all()
            userins = UserRegister_Master_Details.objects.all()
            user_data = []

            for datas in userins:
                data_list = {

                    'User_Id': datas.User_Id,
                    'plain_text_password': datas.plain_text_password,
                }
                user_data.append(data_list)

            return JsonResponse(user_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def User_wise_Collection_Report(request):

    if request.method == "GET":

        try:

            empid = request.GET.get('user', '')
            CurrentDate = request.GET.get('CurrentDate', '')
            fromDate = request.GET.get('fromDate', '')
            toDate = request.GET.get('toDate', '')
            services = request.GET.get('services', '')
            payment = request.GET.get('payment', '')
            ParticularDate = request.GET.get('ParticularDate', '')
            Department = request.GET.get('Department', '')
            patient_type = request.GET.get('patient_type', '')

            reportdata_list = []

            if empid and CurrentDate and not fromDate and not toDate and not services and not payment and not Department and not ParticularDate:

                print(empid, 'empid')
                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)
                # userdata = User.objects.get(id=userdata.auth_user_id.id)

                print(userdata, 'userdata')
                # print(userdata.plain'dfdsfsfsdfsdfds')
                # print(userdata.plain_text_password)
                # print(userdata.plain_text_password)

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date=CurrentDate)

                opreportdata_list = []

                for datas in opbilldata:

                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        # 'Register_Id': datas.Register_Id,
                        # 'Visit_Id': datas.Visit_Id,
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        # 'Location': datas.Location,  # Uncomment if needed
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        # 'Register_Id': datas.Register_Id,
                        # 'Visit_Id': datas.Visit_Id,
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        # 'Location': datas.Location,  # Uncomment if needed
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif empid and ParticularDate and not CurrentDate and not fromDate and not toDate and not services and not payment and not Department:

                print(empid, 'empid')
                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date=ParticularDate)

                opreportdata_list = []

                for datas in opbilldata:

                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        # 'Register_Id': datas.Register_Id,
                        # 'Visit_Id': datas.Visit_Id,
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        # 'Location': datas.Location,  # Uncomment if needed
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date=ParticularDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        # 'Register_Id': datas.Register_Id,
                        # 'Visit_Id': datas.Visit_Id,
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        # 'Location': datas.Location,  # Uncomment if needed
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif empid and not ParticularDate and not CurrentDate and fromDate and toDate and not services and not payment and not Department:

                print(empid, 'empid')
                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date__range=(fromDate, toDate))

                opreportdata_list = []

                for datas in opbilldata:

                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        # 'Register_Id': datas.Register_Id,
                        # 'Visit_Id': datas.Visit_Id,
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        # 'Location': datas.Location,  # Uncomment if needed
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    created_by=userdata.username, Billing_Date__range=(fromDate, toDate))
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        # 'Register_Id': datas.Register_Id,
                        # 'Visit_Id': datas.Visit_Id,
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        # 'Location': datas.Location,  # Uncomment if needed
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif empid and CurrentDate and not fromDate and not toDate and not services and payment and not Department and not ParticularDate:

                print(empid, 'empid')
                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date=CurrentDate)

                opreportdata_list = []

                for datas in opbilldata:

                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    if paydata.Payment_Type == payment:

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    created_by=userdata.username, Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    if paydata.Payment_Type == payment:

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif empid and ParticularDate and not CurrentDate and not fromDate and not toDate and not services and payment and not Department:

                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date=ParticularDate)

                opreportdata_list = []

                for datas in opbilldata:

                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    if paydata.Payment_Type == payment:

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    created_by=userdata.username, Billing_Date=ParticularDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    if paydata.Payment_Type == payment:

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif empid and not ParticularDate and not CurrentDate and fromDate and toDate and not services and payment and not Department:

                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    created_by=userdata.plain_text_password, Billing_Date__range=(fromDate, toDate))

                opreportdata_list = []

                for datas in opbilldata:

                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    if paydata.Payment_Type == payment:

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    created_by=userdata.username, Billing_Date__range=(fromDate, toDate))
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)

                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    if paydata.Payment_Type == payment:

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            # user dep filter

            elif empid and CurrentDate and not fromDate and not toDate and not services and not payment and Department and not ParticularDate:

                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        created_by=userdata.plain_text_password, Billing_Date=CurrentDate)

                    opreportdata_list = []

                    for datas in opbilldata:

                        rcptdata = GeneralBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:

                            paydata = Multiple_Payment_Table_Detials.objects.get(
                                Receipt_No_Paid=rcptdata.pk)
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        created_by=userdata.username, Billing_Date=CurrentDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)

                        paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                            Invoice_No=rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif empid and ParticularDate and not CurrentDate and not fromDate and not toDate and not services and not payment and Department:

                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        created_by=userdata.plain_text_password, Billing_Date=ParticularDate)

                    opreportdata_list = []

                    for datas in opbilldata:

                        rcptdata = GeneralBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:

                            paydata = Multiple_Payment_Table_Detials.objects.get(
                                Receipt_No_Paid=rcptdata.pk)
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        created_by=userdata.username, Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)

                        paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                            Invoice_No=rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif empid and not ParticularDate and not CurrentDate and fromDate and toDate and not services and not payment and Department:

                userdata = UserRegister_Master_Details.objects.get(User_Id=empid)

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        created_by=userdata.plain_text_password, Billing_Date__range=(fromDate, toDate))

                    opreportdata_list = []

                    for datas in opbilldata:

                        rcptdata = GeneralBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:

                            paydata = Multiple_Payment_Table_Detials.objects.get(
                                Receipt_No_Paid=rcptdata.pk)
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        created_by=userdata.username, Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)

                        paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                            Invoice_No=rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            'Voucher_Number': rcptdata.Voucher_Number,
                            'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            'PaidAmount': paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            # payment wise filter

            elif payment and CurrentDate and not fromDate and not toDate and not services and not empid and not Department:

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                opreportdata_list = []

                for datas in opbilldata:
                    rcptdata = GeneralBillingReceipt.objects.filter(
                        Invoice_NO=datas.Billing_Invoice_No).first()
                    if rcptdata:
                        paydata = Multiple_Payment_Table_Detials.objects.filter(
                            Receipt_No_Paid=rcptdata.pk).first()
                        if paydata:
                            if paydata.Payment_Type == payment:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    if rcptdata:
                        paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                            Invoice_No=rcptdata.pk)
                        if paydata:
                            if paydata.Payment_Type == payment:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif payment and ParticularDate and not CurrentDate and not fromDate and not toDate and not services and not empid and not Department:

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=ParticularDate)
                opreportdata_list = []

                for datas in opbilldata:
                    rcptdata = GeneralBillingReceipt.objects.filter(
                        Invoice_NO=datas.Billing_Invoice_No).first()
                    if rcptdata:
                        paydata = Multiple_Payment_Table_Detials.objects.filter(
                            Receipt_No_Paid=rcptdata.pk).first()
                        if paydata:
                            if paydata.Payment_Type == payment:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=ParticularDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    if rcptdata:
                        paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                            Invoice_No=rcptdata.pk)
                        if paydata:
                            if paydata.Payment_Type == payment:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif payment and not ParticularDate and not CurrentDate and fromDate and toDate and not services and not empid and not not Department:

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date__range=(fromDate, toDate))
                opreportdata_list = []

                for datas in opbilldata:
                    rcptdata = GeneralBillingReceipt.objects.filter(
                        Invoice_NO=datas.Billing_Invoice_No).first()
                    if rcptdata:
                        paydata = Multiple_Payment_Table_Detials.objects.filter(
                            Receipt_No_Paid=rcptdata.pk).first()
                        if paydata:
                            if paydata.Payment_Type == payment:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date__range=(fromDate, toDate))
                ipreportdata_list = []

                for datas in ipbilldata:

                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    if rcptdata:
                        paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                            Invoice_No=rcptdata.pk)
                        if paydata:
                            if paydata.Payment_Type == payment:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            # Department wise filter

            elif Department and CurrentDate and not fromDate and not toDate and not services and not empid and not payment and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        rcptdata = GeneralBillingReceipt.objects.filter(
                            Invoice_NO=datas.Billing_Invoice_No).first()

                        if rcptdata:
                            paydata = Multiple_Payment_Table_Detials.objects.filter(
                                Receipt_No_Paid=rcptdata.pk).first()

                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:
                            paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                                Invoice_No=rcptdata.pk)
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not fromDate and not toDate and not CurrentDate and ParticularDate and not services and not empid and not payment:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    opreportdata_list = []

                    for datas in opbilldata:
                        rcptdata = GeneralBillingReceipt.objects.filter(
                            Invoice_NO=datas.Billing_Invoice_No).first()
                        if rcptdata:
                            paydata = Multiple_Payment_Table_Detials.objects.filter(
                                Receipt_No_Paid=rcptdata.pk).first()
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:
                            paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                                Invoice_No=rcptdata.pk)
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and fromDate and toDate and not CurrentDate and not ParticularDate and not services and not empid and not payment:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    opreportdata_list = []

                    for datas in opbilldata:
                        rcptdata = GeneralBillingReceipt.objects.filter(
                            Invoice_NO=datas.Billing_Invoice_No).first()
                        if rcptdata:
                            paydata = Multiple_Payment_Table_Detials.objects.filter(
                                Receipt_No_Paid=rcptdata.pk).first()
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:
                            paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                                Invoice_No=rcptdata.pk)
                            if paydata:

                                data_list = {
                                    'Billing_Invoice_No': datas.Billing_Invoice_No,
                                    'Billing_Date': datas.Billing_Date,
                                    # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                    'Patient_Id': datas.Patient_Id.PatientId,
                                    'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                    # 'Register_Id': datas.Register_Id,
                                    # 'Visit_Id': datas.Visit_Id,
                                    'Billing_Type': datas.Billing_Type,
                                    'Select_Discount': datas.Select_Discount,
                                    'Discount_Type': datas.Discount_Type,
                                    'Discount_Value': datas.Discount_Value,
                                    'Discount_Amount': datas.Discount_Amount,
                                    'Total_Items': datas.Total_Items,
                                    'Total_Qty': datas.Total_Qty,
                                    'Total_Amount': datas.Total_Amount,
                                    'Total_GSTAmount': datas.Total_GSTAmount,
                                    'Net_Amount': datas.Net_Amount,
                                    'Round_Off': datas.Round_Off,
                                    'Net_Paid_Amount': datas.Net_Paid_Amount,
                                    'Paid_Amount': datas.Paid_Amount,
                                    'Balance_Amount': datas.Balance_Amount,
                                    'Bill_Status': datas.Bill_Status,
                                    # 'Location': datas.Location,  # Uncomment if needed
                                    'created_by': datas.created_by,
                                    'created_at': datas.created_at,
                                    'updated_at': datas.updated_at,
                                    'Voucher_Number': rcptdata.Voucher_Number,
                                    'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                    'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                    'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                    'PaidAmount': paydata.Amount,
                                }
                                ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            # Department payment wise

            elif Department and CurrentDate and not fromDate and not toDate and not services and not empid and payment and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    opreportdata_list = []

                    for datas in opbilldata:
                        rcptdata = GeneralBillingReceipt.objects.filter(
                            Invoice_NO=datas.Billing_Invoice_No).first()
                        if rcptdata:
                            paydata = Multiple_Payment_Table_Detials.objects.filter(
                                Receipt_No_Paid=rcptdata.pk).first()
                            if paydata:

                                if paydata.Payment_Type == payment:
                                    data_list = {
                                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                                        'Billing_Date': datas.Billing_Date,
                                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                        'Patient_Id': datas.Patient_Id.PatientId,
                                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                        # 'Register_Id': datas.Register_Id,
                                        # 'Visit_Id': datas.Visit_Id,
                                        'Billing_Type': datas.Billing_Type,
                                        'Select_Discount': datas.Select_Discount,
                                        'Discount_Type': datas.Discount_Type,
                                        'Discount_Value': datas.Discount_Value,
                                        'Discount_Amount': datas.Discount_Amount,
                                        'Total_Items': datas.Total_Items,
                                        'Total_Qty': datas.Total_Qty,
                                        'Total_Amount': datas.Total_Amount,
                                        'Total_GSTAmount': datas.Total_GSTAmount,
                                        'Net_Amount': datas.Net_Amount,
                                        'Round_Off': datas.Round_Off,
                                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                                        'Paid_Amount': datas.Paid_Amount,
                                        'Balance_Amount': datas.Balance_Amount,
                                        'Bill_Status': datas.Bill_Status,
                                        # 'Location': datas.Location,  # Uncomment if needed
                                        'created_by': datas.created_by,
                                        'created_at': datas.created_at,
                                        'updated_at': datas.updated_at,
                                        'Voucher_Number': rcptdata.Voucher_Number,
                                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                        'PaidAmount': paydata.Amount,
                                    }
                                    opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:
                            paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                                Invoice_No=rcptdata.pk)
                            if paydata:

                                if paydata.Payment_Type == payment:
                                    data_list = {
                                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                                        'Billing_Date': datas.Billing_Date,
                                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                        'Patient_Id': datas.Patient_Id.PatientId,
                                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                        # 'Register_Id': datas.Register_Id,
                                        # 'Visit_Id': datas.Visit_Id,
                                        'Billing_Type': datas.Billing_Type,
                                        'Select_Discount': datas.Select_Discount,
                                        'Discount_Type': datas.Discount_Type,
                                        'Discount_Value': datas.Discount_Value,
                                        'Discount_Amount': datas.Discount_Amount,
                                        'Total_Items': datas.Total_Items,
                                        'Total_Qty': datas.Total_Qty,
                                        'Total_Amount': datas.Total_Amount,
                                        'Total_GSTAmount': datas.Total_GSTAmount,
                                        'Net_Amount': datas.Net_Amount,
                                        'Round_Off': datas.Round_Off,
                                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                                        'Paid_Amount': datas.Paid_Amount,
                                        'Balance_Amount': datas.Balance_Amount,
                                        'Bill_Status': datas.Bill_Status,
                                        # 'Location': datas.Location,  # Uncomment if needed
                                        'created_by': datas.created_by,
                                        'created_at': datas.created_at,
                                        'updated_at': datas.updated_at,
                                        'Voucher_Number': rcptdata.Voucher_Number,
                                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                        'PaidAmount': paydata.Amount,
                                    }
                                    ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not CurrentDate and not fromDate and not toDate and not services and not empid and payment and ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    opreportdata_list = []

                    for datas in opbilldata:
                        rcptdata = GeneralBillingReceipt.objects.filter(
                            Invoice_NO=datas.Billing_Invoice_No).first()
                        if rcptdata:
                            paydata = Multiple_Payment_Table_Detials.objects.filter(
                                Receipt_No_Paid=rcptdata.pk).first()
                            if paydata:

                                if paydata.Payment_Type == payment:
                                    data_list = {
                                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                                        'Billing_Date': datas.Billing_Date,
                                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                        'Patient_Id': datas.Patient_Id.PatientId,
                                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                        # 'Register_Id': datas.Register_Id,
                                        # 'Visit_Id': datas.Visit_Id,
                                        'Billing_Type': datas.Billing_Type,
                                        'Select_Discount': datas.Select_Discount,
                                        'Discount_Type': datas.Discount_Type,
                                        'Discount_Value': datas.Discount_Value,
                                        'Discount_Amount': datas.Discount_Amount,
                                        'Total_Items': datas.Total_Items,
                                        'Total_Qty': datas.Total_Qty,
                                        'Total_Amount': datas.Total_Amount,
                                        'Total_GSTAmount': datas.Total_GSTAmount,
                                        'Net_Amount': datas.Net_Amount,
                                        'Round_Off': datas.Round_Off,
                                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                                        'Paid_Amount': datas.Paid_Amount,
                                        'Balance_Amount': datas.Balance_Amount,
                                        'Bill_Status': datas.Bill_Status,
                                        # 'Location': datas.Location,  # Uncomment if needed
                                        'created_by': datas.created_by,
                                        'created_at': datas.created_at,
                                        'updated_at': datas.updated_at,
                                        'Voucher_Number': rcptdata.Voucher_Number,
                                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                        'PaidAmount': paydata.Amount,
                                    }
                                    opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:
                            paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                                Invoice_No=rcptdata.pk)
                            if paydata:

                                if paydata.Payment_Type == payment:
                                    data_list = {
                                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                                        'Billing_Date': datas.Billing_Date,
                                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                        'Patient_Id': datas.Patient_Id.PatientId,
                                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                        # 'Register_Id': datas.Register_Id,
                                        # 'Visit_Id': datas.Visit_Id,
                                        'Billing_Type': datas.Billing_Type,
                                        'Select_Discount': datas.Select_Discount,
                                        'Discount_Type': datas.Discount_Type,
                                        'Discount_Value': datas.Discount_Value,
                                        'Discount_Amount': datas.Discount_Amount,
                                        'Total_Items': datas.Total_Items,
                                        'Total_Qty': datas.Total_Qty,
                                        'Total_Amount': datas.Total_Amount,
                                        'Total_GSTAmount': datas.Total_GSTAmount,
                                        'Net_Amount': datas.Net_Amount,
                                        'Round_Off': datas.Round_Off,
                                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                                        'Paid_Amount': datas.Paid_Amount,
                                        'Balance_Amount': datas.Balance_Amount,
                                        'Bill_Status': datas.Bill_Status,
                                        # 'Location': datas.Location,  # Uncomment if needed
                                        'created_by': datas.created_by,
                                        'created_at': datas.created_at,
                                        'updated_at': datas.updated_at,
                                        'Voucher_Number': rcptdata.Voucher_Number,
                                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                        'PaidAmount': paydata.Amount,
                                    }
                                    ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not CurrentDate and fromDate and toDate and not services and not empid and payment and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    opreportdata_list = []

                    for datas in opbilldata:
                        rcptdata = GeneralBillingReceipt.objects.filter(
                            Invoice_NO=datas.Billing_Invoice_No).first()
                        if rcptdata:
                            paydata = Multiple_Payment_Table_Detials.objects.filter(
                                Receipt_No_Paid=rcptdata.pk).first()
                            if paydata:

                                if paydata.Payment_Type == payment:
                                    data_list = {
                                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                                        'Billing_Date': datas.Billing_Date,
                                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                        'Patient_Id': datas.Patient_Id.PatientId,
                                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                        # 'Register_Id': datas.Register_Id,
                                        # 'Visit_Id': datas.Visit_Id,
                                        'Billing_Type': datas.Billing_Type,
                                        'Select_Discount': datas.Select_Discount,
                                        'Discount_Type': datas.Discount_Type,
                                        'Discount_Value': datas.Discount_Value,
                                        'Discount_Amount': datas.Discount_Amount,
                                        'Total_Items': datas.Total_Items,
                                        'Total_Qty': datas.Total_Qty,
                                        'Total_Amount': datas.Total_Amount,
                                        'Total_GSTAmount': datas.Total_GSTAmount,
                                        'Net_Amount': datas.Net_Amount,
                                        'Round_Off': datas.Round_Off,
                                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                                        'Paid_Amount': datas.Paid_Amount,
                                        'Balance_Amount': datas.Balance_Amount,
                                        'Bill_Status': datas.Bill_Status,
                                        # 'Location': datas.Location,  # Uncomment if needed
                                        'created_by': datas.created_by,
                                        'created_at': datas.created_at,
                                        'updated_at': datas.updated_at,
                                        'Voucher_Number': rcptdata.Voucher_Number,
                                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                        'PaidAmount': paydata.Amount,
                                    }
                                    opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        rcptdata = IPBillingReceipt.objects.get(
                            Invoice_NO=datas.Billing_Invoice_No)
                        if rcptdata:
                            paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                                Invoice_No=rcptdata.pk)
                            if paydata:

                                if paydata.Payment_Type == payment:
                                    data_list = {
                                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                                        'Billing_Date': datas.Billing_Date,
                                        # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                        'Patient_Id': datas.Patient_Id.PatientId,
                                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                        # 'Register_Id': datas.Register_Id,
                                        # 'Visit_Id': datas.Visit_Id,
                                        'Billing_Type': datas.Billing_Type,
                                        'Select_Discount': datas.Select_Discount,
                                        'Discount_Type': datas.Discount_Type,
                                        'Discount_Value': datas.Discount_Value,
                                        'Discount_Amount': datas.Discount_Amount,
                                        'Total_Items': datas.Total_Items,
                                        'Total_Qty': datas.Total_Qty,
                                        'Total_Amount': datas.Total_Amount,
                                        'Total_GSTAmount': datas.Total_GSTAmount,
                                        'Net_Amount': datas.Net_Amount,
                                        'Round_Off': datas.Round_Off,
                                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                                        'Paid_Amount': datas.Paid_Amount,
                                        'Balance_Amount': datas.Balance_Amount,
                                        'Bill_Status': datas.Bill_Status,
                                        # 'Location': datas.Location,  # Uncomment if needed
                                        'created_by': datas.created_by,
                                        'created_at': datas.created_at,
                                        'updated_at': datas.updated_at,
                                        'Voucher_Number': rcptdata.Voucher_Number,
                                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                        'PaidAmount': paydata.Amount,
                                    }
                                    ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            # patient type wise

            elif patient_type and CurrentDate and not fromDate and not toDate and not services and not payment and not Department and not ParticularDate and not empid:
                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Patient_Id__PatientType=patient_type, Billing_Date=CurrentDate)
                opreportdata_list = []

                for datas in opbilldata:
                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Patient_Id__PatientType=patient_type, Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:
                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif patient_type and ParticularDate and not CurrentDate and not fromDate and not toDate and not services and not payment and not Department and not empid:
                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Patient_Id__PatientType=patient_type, Billing_Date=ParticularDate)
                opreportdata_list = []

                for datas in opbilldata:
                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Patient_Id__PatientType=patient_type, Billing_Date=ParticularDate)
                ipreportdata_list = []

                for datas in ipbilldata:
                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif patient_type and not ParticularDate and not CurrentDate and fromDate and toDate and not services and not payment and not Department and not empid:
                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Patient_Id__PatientType=patient_type, Billing_Date__range=(fromDate, toDate))
                opreportdata_list = []

                for datas in opbilldata:
                    rcptdata = GeneralBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    paydata = Multiple_Payment_Table_Detials.objects.get(
                        Receipt_No_Paid=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Patient_Id__PatientType=patient_type, Billing_Date__range=(fromDate, toDate))
                ipreportdata_list = []

                for datas in ipbilldata:
                    rcptdata = IPBillingReceipt.objects.get(
                        Invoice_NO=datas.Billing_Invoice_No)
                    paydata = Multiple_Payment_Table_IP_Detials.objects.get(
                        Invoice_No=rcptdata.pk)

                    data_list = {
                        'Billing_Invoice_No': datas.Billing_Invoice_No,
                        'Billing_Date': datas.Billing_Date,
                        'Patient_Id': datas.Patient_Id.PatientId,
                        'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                        'Billing_Type': datas.Billing_Type,
                        'Select_Discount': datas.Select_Discount,
                        'Discount_Type': datas.Discount_Type,
                        'Discount_Value': datas.Discount_Value,
                        'Discount_Amount': datas.Discount_Amount,
                        'Total_Items': datas.Total_Items,
                        'Total_Qty': datas.Total_Qty,
                        'Total_Amount': datas.Total_Amount,
                        'Total_GSTAmount': datas.Total_GSTAmount,
                        'Net_Amount': datas.Net_Amount,
                        'Round_Off': datas.Round_Off,
                        'Net_Paid_Amount': datas.Net_Paid_Amount,
                        'Paid_Amount': datas.Paid_Amount,
                        'Balance_Amount': datas.Balance_Amount,
                        'Bill_Status': datas.Bill_Status,
                        'created_by': datas.created_by,
                        'created_at': datas.created_at,
                        'updated_at': datas.updated_at,
                        'Voucher_Number': rcptdata.Voucher_Number,
                        'Cash': paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                        'Cards': paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                        'Cheque': paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                        'PaidAmount': paydata.Amount,
                    }
                    ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            return JsonResponse(reportdata_list, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
def Insurance_Report_Details(request):

    if request.method == 'GET':

        try:

            CurrentDate = request.GET.get('CurrentDate', '')
            fromDate = request.GET.get('fromDate', '')
            toDate = request.GET.get('toDate', '')
            ParticularDate = request.GET.get('ParticularDate', '')
            Insurance = request.GET.get('Insurance', '')
            Department = request.GET.get('Department', '')

            print(CurrentDate, fromDate, toDate,
                  ParticularDate, Insurance, Department)

            if CurrentDate and Insurance and not Department:

                print('CurrentDate')

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif ParticularDate and Insurance and not Department:

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=ParticularDate)

                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=ParticularDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif fromDate and toDate and Insurance and not Department:

                print('fromDatetoDate')

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date__range=(fromDate, toDate))
                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date__range=(fromDate, toDate))
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif Department and CurrentDate and not Insurance and not ParticularDate and not fromDate and not toDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance':

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)

                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance':

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and ParticularDate and not CurrentDate and not Insurance and not fromDate and not toDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance':

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance':

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and fromDate and toDate and not Insurance and not CurrentDate and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance':

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance':

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and fromDate and toDate and Insurance and not CurrentDate and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not fromDate and not toDate and Insurance and CurrentDate and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not fromDate and not toDate and Insurance and not CurrentDate and ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Insurance' and datas.Register_Id.InsuranceName_id == int(Insurance):

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            else:

                print('opbilldataopbilldata')

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance':

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Insurance':

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
def Client_Report_Details(request):

    if request.method == 'GET':

        try:

            CurrentDate = request.GET.get('CurrentDate', '')
            fromDate = request.GET.get('fromDate', '')
            toDate = request.GET.get('toDate', '')
            ParticularDate = request.GET.get('ParticularDate', '')
            Client = request.GET.get('Client', '')
            Department = request.GET.get('Department', '')

            if CurrentDate and Client and not Department:

                print('CurrentDate')

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif ParticularDate and Client and not Department:

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=ParticularDate)

                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=ParticularDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif fromDate and toDate and Client and not Department:

                print('fromDatetoDate')

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date__range=(fromDate, toDate))
                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date__range=(fromDate, toDate))
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

            elif Department and CurrentDate and not Client and not ParticularDate and not fromDate and not toDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Client':

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)

                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Client':

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and ParticularDate and not CurrentDate and not Client and not fromDate and not toDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Client':

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Client':

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and fromDate and toDate and not Client and not CurrentDate and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Client':

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Client':

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and fromDate and toDate and Client and not CurrentDate and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date__range=(fromDate, toDate))
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not fromDate and not toDate and Client and CurrentDate and not ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=CurrentDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            elif Department and not fromDate and not toDate and Client and not CurrentDate and ParticularDate:

                if Department == 'OP':

                    opbilldata = General_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    opreportdata_list = []

                    for datas in opbilldata:

                        if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                            print('premmm', datas.Billing_Invoice_No)

                            # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            opreportdata_list.append(data_list)

                    for idx, patient in enumerate(opreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(opreportdata_list, safe=False)

                elif Department == 'IP':

                    ipbilldata = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=ParticularDate)
                    ipreportdata_list = []

                    for datas in ipbilldata:

                        if datas.Register_Id.PatientCategory == 'Client' and datas.Register_Id.ClientName_id == int(Client):

                            # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                            # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                            data_list = {
                                'Billing_Invoice_No': datas.Billing_Invoice_No,
                                'Billing_Date': datas.Billing_Date,
                                # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                                'Patient_Id': datas.Patient_Id.PatientId,
                                'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                                # 'Register_Id': datas.Register_Id,
                                # 'Visit_Id': datas.Visit_Id,
                                'Billing_Type': datas.Billing_Type,
                                'Select_Discount': datas.Select_Discount,
                                'Discount_Type': datas.Discount_Type,
                                'Discount_Value': datas.Discount_Value,
                                'Discount_Amount': datas.Discount_Amount,
                                'Total_Items': datas.Total_Items,
                                'Total_Qty': datas.Total_Qty,
                                'Total_Amount': datas.Total_Amount,
                                'Total_GSTAmount': datas.Total_GSTAmount,
                                'Net_Amount': datas.Net_Amount,
                                'Round_Off': datas.Round_Off,
                                'Net_Paid_Amount': datas.Net_Paid_Amount,
                                'Paid_Amount': datas.Paid_Amount,
                                'Balance_Amount': datas.Balance_Amount,
                                'Bill_Status': datas.Bill_Status,
                                # 'Location': datas.Location,  # Uncomment if needed
                                'created_by': datas.created_by,
                                'created_at': datas.created_at,
                                'updated_at': datas.updated_at,
                                # 'Voucher_Number' : rcptdata.Voucher_Number,
                                # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                                # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                                # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                                # 'PaidAmount' : paydata.Amount,
                            }
                            ipreportdata_list.append(data_list)

                    for idx, patient in enumerate(ipreportdata_list, start=1):
                        patient["id"] = idx

                    return JsonResponse(ipreportdata_list, safe=False)

            else:

                print('opbilldataopbilldata')

                opbilldata = General_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                opreportdata_list = []

                for datas in opbilldata:

                    if datas.Register_Id.PatientCategory == 'Client':

                        print('premmm', datas.Billing_Invoice_No)

                        # rcptdata = GeneralBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid= rcptdata.pk)
                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        opreportdata_list.append(data_list)

                ipbilldata = IP_Billing_Table_Detials.objects.filter(
                    Billing_Date=CurrentDate)
                ipreportdata_list = []

                for datas in ipbilldata:

                    if datas.Register_Id.PatientCategory == 'Client':

                        # rcptdata = IPBillingReceipt.objects.get(Invoice_NO = datas.Billing_Invoice_No)

                        # paydata = Multiple_Payment_Table_IP_Detials.objects.get(Invoice_No= rcptdata.pk)

                        data_list = {
                            'Billing_Invoice_No': datas.Billing_Invoice_No,
                            'Billing_Date': datas.Billing_Date,
                            # 'Doctor_Id': datas.Doctor_Id,  # Uncomment if needed
                            'Patient_Id': datas.Patient_Id.PatientId,
                            'PatientName': f"{datas.Patient_Id.Title.Title_Name} {datas.Patient_Id.FirstName} {datas.Patient_Id.MiddleName} {datas.Patient_Id.SurName}",
                            # 'Register_Id': datas.Register_Id,
                            # 'Visit_Id': datas.Visit_Id,
                            'Billing_Type': datas.Billing_Type,
                            'Select_Discount': datas.Select_Discount,
                            'Discount_Type': datas.Discount_Type,
                            'Discount_Value': datas.Discount_Value,
                            'Discount_Amount': datas.Discount_Amount,
                            'Total_Items': datas.Total_Items,
                            'Total_Qty': datas.Total_Qty,
                            'Total_Amount': datas.Total_Amount,
                            'Total_GSTAmount': datas.Total_GSTAmount,
                            'Net_Amount': datas.Net_Amount,
                            'Round_Off': datas.Round_Off,
                            'Net_Paid_Amount': datas.Net_Paid_Amount,
                            'Paid_Amount': datas.Paid_Amount,
                            'Balance_Amount': datas.Balance_Amount,
                            'Bill_Status': datas.Bill_Status,
                            # 'Location': datas.Location,  # Uncomment if needed
                            'created_by': datas.created_by,
                            'created_at': datas.created_at,
                            'updated_at': datas.updated_at,
                            # 'Voucher_Number' : rcptdata.Voucher_Number,
                            # 'Cash' : paydata.Amount if paydata.Payment_Type == 'Cash' else '-',
                            # 'Cards' : paydata.Amount if paydata.Payment_Type == 'Card' else '-',
                            # 'Cheque' : paydata.Amount if paydata.Payment_Type == 'Cheque' else '-',
                            # 'PaidAmount' : paydata.Amount,
                        }
                        ipreportdata_list.append(data_list)

                mergedlist = opreportdata_list + ipreportdata_list

                for idx, patient in enumerate(mergedlist, start=1):
                    patient["id"] = idx

                return JsonResponse(mergedlist, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
