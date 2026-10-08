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

from datetime import date


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_edited_OP_doc_details(request):
    try:

        RegistrationId = request.GET.get('RegistrationId')

        Regins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
        opins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__Registration_Id = RegistrationId)
        patient = Regins.PatientId

        for op in opins : 

            Docid = op.PrimaryDoctor.Doctor_ID
            existingvisittype = op.VisitType

            if Regins.Bill_Status == 'Paid' or Regins.Bill_Status == 'Due':
 
                    
                    billins = General_Billing_Table_Detials.objects.filter(Patient_Id__PatientId = patient.PatientId,Register_Id__Registration_Id = Regins.Registration_Id).first()

                    print(billins,'billins')
                    itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = billins.Billing_Invoice_No,Service_Type='CONSULTATION')
                    GeneralBillingReceiptins = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No = billins.Billing_Invoice_No).first()
                    print(itemins,'itemins')

                    full_name = f"{billins.Patient_Id.Title.Title_Name}.{billins.Patient_Id.FirstName} {billins.Patient_Id.MiddleName} {billins.Patient_Id.SurName}"


                    billing_details = {
                        'Billing_Invoice_No': billins.Billing_Invoice_No,
                        'Billing_Date': billins.Billing_Date,
                        'Doctor_Id': billins.Doctor_Id,
                        'Patient_Id': billins.Patient_Id.PatientId,
                        'Register_Id': billins.Register_Id.Registration_Id,
                        'PatientCategory': billins.Register_Id.PatientCategory,
                        'Visit_Id': billins.Visit_Id.VisitId, 
                        'Billing_Type': billins.Billing_Type,
                        'Select_Discount': billins.Select_Discount,
                        'Discount_Type': billins.Discount_Type,
                        'Discount_Value': float(billins.Discount_Value) if billins.Discount_Value is not None else None,
                        'Discount_Amount': float(billins.Discount_Amount) if billins.Discount_Amount is not None else None,
                        'Total_Items': billins.Total_Items ,
                        'Total_Qty': billins.Total_Qty ,
                        'Total_Amount': float(billins.Total_Amount) if billins.Total_Amount is not None else None,
                        'Total_GSTAmount': float(billins.Total_GSTAmount) if billins.Total_GSTAmount is not None else None,
                        'Net_Amount': float(billins.Net_Amount) if billins.Net_Amount is not None else None,
                        'Round_Off': float(billins.Round_Off) if billins.Round_Off is not None else None,
                        'Net_Paid_Amount': float(billins.Net_Paid_Amount) if billins.Net_Paid_Amount is not None else None,
                        'Paid_Amount': float(billins.Paid_Amount) if billins.Paid_Amount is not None else None,
                        'Balance_Amount': float(billins.Balance_Amount) if billins.Balance_Amount is not None else None,
                        'Bill_Status': billins.Bill_Status,
                        'Refunded_Amount': float(billins.Refunded_Amount) if billins.Refunded_Amount is not None else None,
                        # 'Location': billins.Location.id if billins.Location else None,
                        'created_by': billins.created_by,
                        'created_at': billins.created_at,
                        'updated_at': billins.updated_at,
                         'PhoneNo':billins.Patient_Id.PhoneNo,
                'Patient_Name':full_name.strip(),
                'AgeGender': f'{billins.Patient_Id.Age}/{billins.Patient_Id.Gender}',
                'Address': f'{billins.Patient_Id.PermanentdoorNo}, {billins.Patient_Id.Street}, {billins.Patient_Id.Area}, {billins.Patient_Id.City}, {billins.Patient_Id.State}, {billins.Patient_Id.Country}, {billins.Patient_Id.Pincode}',
                    }

                    billing_items = [
                        {
                            'Items_Id': item.Items_Id,
                            'Service_Type': item.Service_Type,
                            'Service_Code': item.Service_Code,
                            'Service_Name': item.Service_Name,
                            'Rate': float(item.Rate) if item.Rate is not None else None,
                            'Charge': float(item.Charge) if item.Charge is not None else None,
                            'Quantity': item.Quantity,
                            'Amount': float(item.Amount) if item.Amount is not None else None,
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': float(item.Discount_Value) if item.Discount_Value is not None else None,
                            'Discount_Amount': float(item.Discount_Amount) if item.Discount_Amount is not None else None,
                            'Taxable_Amount': float(item.Taxable_Amount) if item.Taxable_Amount is not None else None,
                            'Tax_Amount': float(item.Tax_Amount) if item.Tax_Amount is not None else None,
                            'Total_Amount': float(item.Total_Amount) if item.Total_Amount is not None else None,
                            'Item_Status': item.Item_Status,
                            'Remarks': item.Remarks,
                            'created_at': item.created_at,
                            'updated_at': item.updated_at,
                        }
                        for item in itemins
                    ]

                    billing_receipt = {
                        'Recptid': GeneralBillingReceiptins.id,
                        'PatientID': GeneralBillingReceiptins.PatientID,
                        'PhoneNumber': GeneralBillingReceiptins.PhoneNumber,
                        'Patient_Name': GeneralBillingReceiptins.Patient_Name,
                        'TotalAmount': float(GeneralBillingReceiptins.TotalAmount),
                        'TotalPaidAmount': float(GeneralBillingReceiptins.TotalPaidAmount),
                        'BalanceAmount': float(GeneralBillingReceiptins.BalanceAmount),
                        'Billing_Date': str(GeneralBillingReceiptins.Billing_Date),
                        'Voucher_Number': GeneralBillingReceiptins.Voucher_Number,
                        'PaidAmount': float(GeneralBillingReceiptins.PaidAmount),
                        'Billedby': GeneralBillingReceiptins.Billedby,
                        'UpdatedAt': GeneralBillingReceiptins.UpdatedAt.strftime('%Y-%m-%d %H:%M:%S'),
                        'CreatedAt': GeneralBillingReceiptins.CreatedAt.strftime('%Y-%m-%d %H:%M:%S'),

                    }

        return JsonResponse({
             'billing_details': billing_details,
        'billing_items': billing_items,
        'billing_receipt': billing_receipt
        }, safe=False)
                         
    except Exception as e:
        return JsonResponse({'error': str(e)})

def safe_to_decimal(value, default=0.00):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError, ValueError):
                    return Decimal(default)
            

@csrf_exempt
@transaction.atomic()
@require_http_methods(["POST", "OPTIONS", "GET"])
def GeneralBilling_Refund_Link_For_ConsultationEdit(request):

    if request.method == "POST":
         
         try:
              
            data = json.loads(request.body)

            print(data,'data::::::::')
            PatientId = data.get('Patient_Id','')
            CurrAmt = data.get('CurrAmt','')
            Billing_Date = data.get('Billing_Date','')
            Refundedamt = data.get('Refundedamt','')
            Created_by = data.get('Created_by')
            billing_receipt = data.get('billing_receipt')
            Recptid = billing_receipt['Recptid']
            billAmount = data.get('billAmount')
            Billing_Invoice_No = data.get('Billing_Invoice_No')
            Paidedamt = data.get('Paidedamt')

            print(billAmount,'billAmount')
            print(Recptid,'Recptid')
            print(billing_receipt,'billing_receipt')
            print(Billing_Invoice_No,'Billing_Invoice_No')


            patient = Patient_Detials.objects.filter(PatientId=PatientId).first()

            receipt_ins = None 
            receipt_ins = GeneralBillingReceipt.objects.filter(pk=Recptid).first()



            billing_receipt_table = ConsultationBillingRefundReceipt(
                Invoice_NO=receipt_ins if receipt_ins else None,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "RefundPayment",
                Patient_Name=f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount= CurrAmt,
                TotalPaidAmount=CurrAmt,
                BalanceAmount=0,
                Billing_Date= date.today(),
                PaidAmount=Refundedamt,
                Billedby=Created_by
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None

            for payment in billAmount:
           
                multiple_payment = Consultation_Refund_Payment_Table_Detials(
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

            Billing_Invoice_Noins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=Billing_Invoice_No).first()
            Billing_Invoice_Noins.Net_Amount = CurrAmt
            Billing_Invoice_Noins.Net_Paid_Amount = CurrAmt
            Billing_Invoice_Noins.Paid_Amount = CurrAmt
            Billing_Invoice_Noins.save()

            return JsonResponse({'status': 'Success','ReceiptNo':recipetbill,'ReceiptDate':billing_receipt_table.Billing_Date})


              
         except Exception as e:
            print(str(e))
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)
              
        
@csrf_exempt
@transaction.atomic()
@require_http_methods(["POST", "OPTIONS", "GET"])
def GeneralBilling_Bill_Link_For_ConsultationEdit(request):

    if request.method == "POST":
         
         try:
              
            data = json.loads(request.body)

            print(data,'data::::::::')
            PatientId = data.get('Patient_Id','')
            CurrAmt = data.get('CurrAmt','')
            Billing_Date = data.get('Billing_Date','')
            Refundedamt = data.get('Refundedamt','')
            Created_by = data.get('Created_by')
            billing_receipt = data.get('billing_receipt')
            Recptid = billing_receipt['Recptid']
            billAmount = data.get('billAmount')
            Pendingamt = data.get('Pendingamt')
            BalanceAmt = data.get('BalanceAmt')
            Paidedamt = data.get('Paidedamt')

            Billing_Invoice_No = data.get('Billing_Invoice_No')
            print(billAmount,'billAmount')
            print(Recptid,'Recptid')
            print(billing_receipt,'billing_receipt')


            patient = Patient_Detials.objects.filter(PatientId=PatientId).first()

            Billing_Invoice_Noins = General_Billing_Table_Detials.objects.filter(Billing_Invoice_No=Billing_Invoice_No).first()
            Billing_Invoice_Noins.Billing_Date = date.today()
            Billing_Invoice_Noins.Net_Amount = CurrAmt
            Billing_Invoice_Noins.Net_Paid_Amount = CurrAmt
            Billing_Invoice_Noins.Paid_Amount = CurrAmt
            Billing_Invoice_Noins.Net_Amount = CurrAmt
            Billing_Invoice_Noins.Balance_Amount = 0
            Billing_Invoice_Noins.save()

            itemins = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = Billing_Invoice_No,Item_Status='Pending')
            for item in itemins:
                 
                 item.Item_Status = 'Paid'
                 item.save()

            GeneralBillingReceiptins = GeneralBillingReceipt.objects.filter(Invoice_NO__Billing_Invoice_No = Billing_Invoice_No).first()
            print(GeneralBillingReceiptins,'GeneralBillingReceiptins')
            GeneralBillingReceiptins.TotalAmount = CurrAmt
            GeneralBillingReceiptins.TotalPaidAmount = CurrAmt
            GeneralBillingReceiptins.PaidAmount = CurrAmt
            GeneralBillingReceiptins.save()

            Multiple_Payment_Table_Detialsins = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid =GeneralBillingReceiptins)
            print(Multiple_Payment_Table_Detialsins,'Multiple_Payment_Table_Detialsins')
            for pay, bill in zip(Multiple_Payment_Table_Detialsins, billAmount):
                try:
                    paid_amount = Decimal(bill.get('paidamount') or 0)
                except InvalidOperation:
                    paid_amount = Decimal(0)

                try:
                    additional_amount = Decimal(bill.get('Additionalamount') or 0)
                except InvalidOperation:
                    additional_amount = Decimal(0)

                try:
                    transaction_fee = Decimal(bill.get('transactionFee') or 0)
                except InvalidOperation:
                    transaction_fee = Decimal(0)

                pay.Payment_Type = bill.get('Billpay_method', '')
                pay.Cart_Type = bill.get('CardType', '')
                pay.Card_No = bill.get('CardNo', '')[:4]  # ensure 4 digits
                pay.upiid = bill.get('upiid', '')
                pay.TransactionId = bill.get('TransactionId', '')
                pay.Cheque_No = bill.get('ChequeNo', '')
                pay.Bank_Name = bill.get('BankName', '')

                # Safe addition even if pay.Amount is None
                pay.Amount = (pay.Amount or Decimal(0)) + paid_amount
                pay.AdditionalAmount = additional_amount
                pay.Transaction_Amount = transaction_fee
                pay.save()




            return JsonResponse({'status': 'Success','InvoiceNo':Billing_Invoice_No})


              
         except Exception as e:
            print(str(e))
            transaction.set_rollback(True)
            return JsonResponse({'error': str(e)}, status=500)
              
        










