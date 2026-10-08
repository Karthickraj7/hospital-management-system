import json
import pycountry
import requests
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
from django.db.models import  Q, Sum
from Ip_Workbench.models import *
from OutPatient.models import *
from django.utils import timezone
from Insurance.models import *
from DrugAdminstrations.models import *
from OTManagement.models import *

@csrf_exempt
@require_http_methods(["GET"])
def Patient_Overall_Ledger_Details(request):
 
    if request.method == 'GET':
 
        try:
 
            patientId = request.GET.get('PatientId', '')
            print('pattt', patientId)
            ledger_list = []  # Combined list
            Balance = 0  # Initialize balance
 
            # Fetch outpatient billing data
            opbillins = General_Billing_Table_Detials.objects.filter(Patient_Id=patientId)
            for bill in opbillins:
                opitemsins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=bill.Billing_Invoice_No)
                for datas in opitemsins:
                    Balance += float(datas.Total_Amount)  # Add to balance for debit
                    print('Balll11111111111', Balance)
                    item_list = {
                        'Items_Id': datas.Items_Id,
                        'Billing_Invoice_No': datas.Billing_Invoice_No.Billing_Invoice_No,
                        'RegistrationId': datas.Billing_Invoice_No.Register_Id.Registration_Id,
                        'CreatedAt': datas.Billing_Invoice_No.created_at,
                        'Date': datas.Billing_Invoice_No.Billing_Date,
                        'Service_Type': f"{datas.Service_Type}({datas.Service_Name})",
                        'Debit': f"{datas.Total_Amount} Dr",
                        'Credit': '-',
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after debit
                    }
                    ledger_list.append(item_list)
 
                opreceiptins = GeneralBillingReceipt.objects.filter(Invoice_NO=bill.Billing_Invoice_No)
                for datas in opreceiptins:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll22222222222', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Invoice_NO.Billing_Invoice_No,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.created_at,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
                oprefundreceipts = GeneralBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO=bill.Billing_Invoice_No)
                for datas in oprefundreceipts:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll3333333', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Invoice_NO.Invoice_NO.Billing_Invoice_No,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.CreatedAt,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
            # Fetch inpatient billing data
            ipbillins = IP_Billing_Table_Detials.objects.filter(Patient_Id=patientId)
            for bill in ipbillins:
                ipitemsins = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=bill.Billing_Invoice_No)
                for datas in ipitemsins:
                    Balance += float(datas.Total_Amount)  # Add to balance for debit
                    print('Balll11111111111', Balance)
                    item_list = {
                        'Items_Id': datas.Items_Id,
                        'Billing_Invoice_No': datas.Billing_Invoice_No.Billing_Invoice_No,
                        'RegistrationId': datas.Billing_Invoice_No.Register_Id.Registration_Id,
                        'CreatedAt': datas.Billing_Invoice_No.created_at,
                        'Date': datas.Billing_Invoice_No.Billing_Date,
                        'Service_Type': f"{datas.Service_Type}({datas.Service_Name})",
                        'Debit': f"{datas.Total_Amount} Dr",
                        'Credit': '-',
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after debit
                    }
                    ledger_list.append(item_list)
 
                ipreceiptins = IPBillingReceipt.objects.filter(Invoice_NO=bill.Billing_Invoice_No)
                for datas in ipreceiptins:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll22222222222', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Invoice_NO.Billing_Invoice_No,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.created_at,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
 
                ipreceiptins = IPBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO=bill.Billing_Invoice_No)
                for datas in ipreceiptins:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll22222222222', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Voucher_Number,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.CreatedAt,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
 
            # Sorting the merged ledger list by 'CreatedAt'
            ledger_list.sort(key=lambda x: x['CreatedAt'])
 
            return JsonResponse(ledger_list,safe=False)
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Registration_Overall_Ledger_Details(request):
 
    if request.method == 'GET':
 
        try:
 
            RegistrationId = request.GET.get('RegistrationId', '')
            print('pattt', RegistrationId)
            ledger_list = []  # Combined list
            Balance = 0  # Initialize balance
 
            # Fetch outpatient billing data
            opbillins = General_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id=RegistrationId)
            for bill in opbillins:
                opitemsins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=bill.Billing_Invoice_No)
                for datas in opitemsins:
                    Balance += float(datas.Total_Amount)  # Add to balance for debit
                    print('Balll11111111111', Balance)
                    item_list = {
                        'Items_Id': datas.Items_Id,
                        'Billing_Invoice_No': datas.Billing_Invoice_No.Billing_Invoice_No,
                        'RegistrationId': datas.Billing_Invoice_No.Register_Id.Registration_Id,
                        'CreatedAt': datas.Billing_Invoice_No.created_at,
                        'Date': datas.Billing_Invoice_No.Billing_Date,
                        'Service_Type': f"{datas.Service_Type}({datas.Service_Name})",
                        'Debit': f"{datas.Total_Amount} Dr",
                        'Credit': '-',
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after debit
                    }
                    ledger_list.append(item_list)
 
                opreceiptins = GeneralBillingReceipt.objects.filter(Invoice_NO=bill.Billing_Invoice_No)
                for datas in opreceiptins:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll22222222222', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Invoice_NO.Billing_Invoice_No,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.created_at,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
                oprefundreceipts = GeneralBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO=bill.Billing_Invoice_No)
                for datas in oprefundreceipts:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll3333333', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Invoice_NO.Invoice_NO.Billing_Invoice_No,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.CreatedAt,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
            # Fetch inpatient billing data
            ipbillins = IP_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id=RegistrationId)
            for bill in ipbillins:
                ipitemsins = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=bill.Billing_Invoice_No)
                for datas in ipitemsins:
                    Balance += float(datas.Total_Amount)  # Add to balance for debit
                    print('Balll11111111111', Balance)
                    item_list = {
                        'Items_Id': datas.Items_Id,
                        'Billing_Invoice_No': datas.Billing_Invoice_No.Billing_Invoice_No,
                        'RegistrationId': datas.Billing_Invoice_No.Register_Id.Registration_Id,
                        'CreatedAt': datas.Billing_Invoice_No.created_at,
                        'Date': datas.Billing_Invoice_No.Billing_Date,
                        'Service_Type': f"{datas.Service_Type}({datas.Service_Name})",
                        'Debit': f"{datas.Total_Amount} Dr",
                        'Credit': '-',
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after debit
                    }
                    ledger_list.append(item_list)
 
                ipreceiptins = IPBillingReceipt.objects.filter(Invoice_NO=bill.Billing_Invoice_No)
                for datas in ipreceiptins:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll22222222222', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Invoice_NO.Billing_Invoice_No,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.created_at,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
 
                ipreceiptins = IPBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO=bill.Billing_Invoice_No)
                for datas in ipreceiptins:
                    Balance -= float(datas.PaidAmount)  # Subtract for credit
                    print('Balll22222222222', Balance)
                    item_list = {
                        'rcpt_Id': datas.pk,
                        'Billing_Invoice_No': datas.Voucher_Number,
                        'Service_Type': 'Payment',
                        'RegistrationId': datas.Invoice_NO.Invoice_NO.Register_Id.Registration_Id,
                        'CreatedAt': datas.Invoice_NO.CreatedAt,
                        'Date': datas.CreatedAt.date(),
                        'Debit': '-',
                        'Credit': f"{datas.PaidAmount} Cr",
                        'Balance': f"{round(abs(Balance), 2)} {'Dr' if Balance > 0 else 'Cr' if Balance < 0 else 0}"
,  # Updated balance after credit
                    }
                    ledger_list.append(item_list)
 
            # Sorting the merged ledger list by 'CreatedAt'
            ledger_list.sort(key=lambda x: x['CreatedAt'])
 
            return JsonResponse(ledger_list,safe=False)
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(['GET'])
def get_credit_due_amount_for_patient(request):
    if request.method == 'GET':
        try:
            patient_id = request.GET.get('PatientId', '')
            if not patient_id:
                return JsonResponse({'error': 'PatientId is required'}, status=400)

            # Initialize sums
            OP_total_paid_amount = 0
            OP_total_net_amount = 0
            OP_total_balance_amount = 0
            OP_result = ''
            OP_result1 = 0
            IP_total_paid_amount = 0
            IP_total_net_amount = 0
            IP_total_balance_amount = 0
            IP_result = ''
            IP_result1 = 0

            # Fetch billing records from both tables
            op_billings = General_Billing_Table_Detials.objects.filter(Patient_Id=patient_id)
            ip_billings = IP_Billing_Table_Detials.objects.filter(Patient_Id=patient_id)

            # Sum up values from both tables
            for bill in op_billings:
                OP_total_paid_amount += float(bill.Paid_Amount or 0)
                OP_total_net_amount += float(bill.Net_Amount or 0)
                OP_total_balance_amount += float(bill.Balance_Amount or 0)

            for bill in ip_billings:
                IP_total_paid_amount += float(bill.Paid_Amount or 0)
                IP_total_net_amount += float(bill.Net_Amount or 0)
                IP_total_balance_amount += float(bill.Balance_Amount or 0)

            if OP_total_paid_amount > OP_total_net_amount:
                OP_result = 'Credit'
                OP_result1 = OP_total_paid_amount - OP_total_net_amount
            elif OP_total_net_amount > OP_total_paid_amount:
                OP_result = 'Due'
                OP_result1 = OP_total_balance_amount
            else:
                OP_result = 'No Due'
                OP_result1 = OP_total_balance_amount
            if IP_total_paid_amount > IP_total_net_amount:
                IP_result = 'Credit'
                IP_result1 = IP_total_paid_amount - IP_total_net_amount
            elif IP_total_net_amount > IP_total_paid_amount:
                IP_result = 'Due'
                IP_result1 = IP_total_balance_amount
            else:
                IP_result = 'No Due'
                IP_result1 = IP_total_balance_amount
            # Return computed values
            return JsonResponse({
                'success': True,
                'OP_total_paid_amount': OP_total_paid_amount,
                'OP_total_net_amount': OP_total_net_amount,
                'OP_total_balance_amount': OP_total_balance_amount,
                'OP_ResultType': OP_result,
                'OP_Amount': OP_result1,
                'IP_total_paid_amount': IP_total_paid_amount,
                'IP_total_net_amount': IP_total_net_amount,
                'IP_total_balance_amount': IP_total_balance_amount,
                'IP_ResultType': IP_result,
                'IP_Amount': IP_result1,
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)