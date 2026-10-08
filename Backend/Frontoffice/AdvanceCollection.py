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
from OutPatient.ReferDoctor import get_rad_request_details


import math

from django.db import connection, transaction
from .models import Patient_Appointment_Registration_Detials, Patient_Detials
from Workbench.models import Workbench_Prescription
from django.core.serializers import serialize
from datetime import datetime,date
from OutPatient.LabRequests import get_lab_request_details

from django.utils.decorators import method_decorator
from django.views import View
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to
from OutPatient.LabRequests import model_to_dict, extract_panic_range
from django.db.models import Sum, F, ExpressionWrapper, FloatField, Case, When\
# -------------------------------------------------------------------------------

today = date.today()

@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_Advance_Refund(request):
    if request.method == 'POST':
        try:
            # data = json.loads(request.body)
            # registration = data.get('RegistrationId')
            # created_by = data.get('Created_by')
            # Advanceamount = data.get('AdvanceAmount')
            # billAmount = data.get('BillAmount', [])
            # Patientdept = data.get('Patientdept',{})
            # totalAmount = data.get('totalAmount','')
            # SelectDatalist = data.get('SelectDatalist',{})
 
 
            # BankName = None
            # Billpay_method = None
            # CardType = None
            # CardNo = None
            # TransactionId = None
            # upiid = None
            # Cheque_No = None
            # Bank_Name = None
            # AdvanceServiceRemark = None
            # AdvancePurpose = None
            # AdvanceAmount = None
 
            # for payment in SelectDatalist:
 
            #     Billpay_method = payment['Billpay_method']
            #     CardType = payment['CardType']
            #     CardNo = payment['CardNo']
            #     TransactionId = payment['TransactionId']
            #     upiid = payment['upiid']
            #     Cheque_No = payment['ChequeNo']
            #     Bank_Name = payment['BankName']
 
            #     AdvanceServiceRemark = payment['AdvanceServiceRemark']
            #     AdvancePurpose = payment['AdvancePurpose']
            #     AdvanceAmount = payment['Amount']
 
            #     break
 
 
            # OP_Register_Id = None
            # IP_Register_Id = None
 
            # if  Patientdept['Department'] == 'OP':
 
            #     OP_Register_Id = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id = registration).first()
            #     print('OPpppppp',OP_Register_Id)
            # elif Patientdept['Department'] == 'IP':
 
            #     IP_Register_Id = Patient_IP_Registration_Detials.objects.filter(pk = registration).first()
            #     print('IIIIPpppppp',IP_Register_Id)
            # if not totalAmount:
            #     return JsonResponse({'error': 'Enter the Advance Amount'})
 
            # def safe_to_decimal(value, default=0.00):
            #     try:
            #         return Decimal(value)
            #     except (InvalidOperation, TypeError, ValueError):
            #         return Decimal(default)
 
           
 
            # if  Patientdept['Department'] == 'IP':
 
            #         ipgeneral_billing_instance = IPBillingReceipt.objects.create(
 
            #         NewPayment = 'AdvancePayment',
            #         PatientID = Patientdept['PatientId'],
            #         PhoneNumber = Patientdept['PhoneNo'],
            #         Patient_Name = Patientdept['FirstName'],
            #         TotalAmount = totalAmount,
            #         TotalPaidAmount = totalAmount,
            #         BalanceAmount = 0,
            #         Billing_Date = timezone.now().date(),
            #         PaidAmount = totalAmount,
            #         Billedby = created_by
 
            #         )
            #         receipt_no = ipgeneral_billing_instance.Voucher_Number
            #         ippaymentins = Multiple_Payment_Table_IP_Detials(
 
            #             Invoice_No = ipgeneral_billing_instance,
            #             Payment_Type = Billpay_method,
            #             Cart_Type = CardType,
            #             Card_No = CardNo,
            #             TransactionId = TransactionId,
            #             upiid = upiid,
            #             Cheque_No = Cheque_No,
            #             Bank_Name = Bank_Name,
            #             Transaction_Amount = 0,
            #             AdditionalAmount = 0,
            #             Amount = totalAmount
 
            #         )
            #         ippaymentins.save()  
 
 
 
            #         for adv in SelectDatalist:
 
            #             Advance_regis = Advance_Collection_IP(
            #                 RegisterType = Patientdept['Department'],
            #                 OP_Register_Id = OP_Register_Id,
            #                 IP_Register_Id = IP_Register_Id,
            #                 IPBillingReceipt = ipgeneral_billing_instance,
            #                 GeneralBillingReceipt = None,
            #                 AdvanceAmount = AdvanceAmount,
            #                 AdvancePurpose = AdvancePurpose,
            #                 Advance_Desc = AdvanceServiceRemark,
            #                 created_by = created_by,
            #             )
            #             Advance_regis.save()
            #             print('2222222',Advance_regis)          
            # elif  Patientdept['Department'] == 'OP':
 
            #     general_billing_instance  = GeneralBillingReceipt.objects.create(
 
                   
            #         NewPayment = 'AdvancePayment',
            #         PatientID = Patientdept['PatientId'],
            #         PhoneNumber = Patientdept['PhoneNo'],
            #         Patient_Name = Patientdept['FirstName'],
            #         TotalAmount = totalAmount,
            #         TotalPaidAmount = totalAmount,
            #         BalanceAmount = 0,
            #         Billing_Date = timezone.now().date(),
            #         PaidAmount = totalAmount,
            #         Billedby = created_by
 
            #     )
            #     receipt_no = general_billing_instance.Voucher_Number
 
            #     paymentins = Multiple_Payment_Table_Detials(
 
            #             Receipt_No_Paid = general_billing_instance,
            #             Payment_Type = Billpay_method,
            #             Cart_Type = CardType,
            #             Card_No = CardNo,
            #             TransactionId = TransactionId,
            #             upiid = upiid,
            #             Cheque_No = Cheque_No,
            #             Bank_Name = Bank_Name,
            #             Transaction_Amount = 0,
            #             AdditionalAmount = 0,
            #             Amount = totalAmount
 
            #     )
            #     paymentins.save()
 
            #     for adv in SelectDatalist:
 
            #             Advance_regis = Advance_Collection_IP(
            #                 RegisterType = Patientdept['Department'],
            #                 OP_Register_Id = OP_Register_Id,
            #                 IP_Register_Id = IP_Register_Id,
            #                 IPBillingReceipt = None,
            #                 GeneralBillingReceipt = general_billing_instance,
            #                 AdvanceAmount = AdvanceAmount,
            #                 AdvancePurpose = AdvancePurpose,
            #                 Advance_Desc = AdvanceServiceRemark,
            #                 created_by = created_by,
            #             )
            #             Advance_regis.save()
            #             print('2222222',Advance_regis)
 
            # return JsonResponse({'success' : 'Advance Amount saved successfully','InvoiceNo':receipt_no})
            pass
        except Exception as e:
            return JsonResponse({'error': str(e)})
       
    elif request.method == 'GET':
        try:
            name_or_phone = request.GET.get('SearchbyFirstName', '').strip()
            patient_id = request.GET.get('SearchbyPatientId', '').strip()
            registration_id = request.GET.get('SearchbyRegistrationId', '').strip()
            phone_no = request.GET.get('SearchbyPhoneNumber', '').strip()
            doctor = request.GET.get('SearchbyDoctor', '').strip()
            speciality = request.GET.get('SearchbySpeciality', '').strip()
            status = request.GET.get('SearchStatus', '').strip()
            date_type = request.GET.get('DateType', '').strip()
            advance_type = request.GET.get('AdvanceType', '').strip()
            current_date = request.GET.get('CurrentDate', '').strip()
            from_date = request.GET.get('FromDate', '').strip()
            to_date = request.GET.get('ToDate', '').strip()


            query = Q()
            advance_list = []
            if advance_type == 'OP':
                if advance_type:
                    query &= Q(RegisterType=advance_type)
                if name_or_phone:
                    query &= Q(OP_Register_Id__PatientId__FirstName__icontains=name_or_phone)
                if phone_no:
                    query &= Q(OP_Register_Id__PatientId__PhoneNo__icontains=phone_no)

                if patient_id:
                    query &= Q(OP_Register_Id__PatientId__PatientId__icontains=patient_id)
                if registration_id:
                    query &= Q(OP_Register_Id__Registration_Id__icontains=registration_id)
                if status:
                    query &= Q(Status=status)

                if date_type == "Current" and current_date:
                    query &= Q(created_at__date=current_date)
                elif date_type == "Customize" and from_date and to_date:
                    query &= Q(created_at__date__range=[from_date, to_date])

                advance_ins = Advance_Collection_IP.objects.filter(query)

                print(advance_ins,'advance_ins')
                
                for advance in advance_ins:
                    op_ins = advance.OP_Register_Id
                    full_name = f"""{op_ins.PatientId.Title.Title_Name}.{op_ins.PatientId.FirstName or ""} {op_ins.PatientId.MiddleName or ''} {op_ins.PatientId.SurName or ''}"""
                    data_list = {
                        'Receipt_No': advance.GeneralBillingReceipt.Voucher_Number,
                        'Receiptid' : advance.GeneralBillingReceipt.pk,
                        'PatientId': advance.OP_Register_Id.PatientId.PatientId,
                        'RegistrationId': advance.OP_Register_Id.Registration_Id,
                        'PatientCategory' : advance.OP_Register_Id.PatientCategory,
                        # 'PatientCategoryName' : advance.OP_Register_Id.P,
                        'PatientName': full_name,
                        'PhoneNo': advance.OP_Register_Id.PatientId.PhoneNo,
                        'Date': advance.created_at.strftime("%Y-%m-%d / %H:%M"),
                        'Amount': advance.AdvanceAmount,
                        'ReceivedBy': advance.created_by,
                        'Status': advance.Status,
                        'Age': advance.OP_Register_Id.PatientId.Age,
                        'Gender': advance.OP_Register_Id.PatientId.Gender,
                        'AdvanceType' : 'OP'
                    }
                    advance_list.append(data_list)
            elif advance_type == 'IP':
                if advance_type:
                    query &= Q(RegisterType=advance_type)
                if name_or_phone:
                    query &= Q(IP_Register_Id__PatientId__FirstName__icontains=name_or_phone)
                if phone_no:
                    query &= Q(IP_Register_Id__PatientId__PhoneNo__icontains=phone_no)

                if patient_id:
                    query &= Q(IP_Register_Id__PatientId__PatientId__icontains=patient_id)
                if registration_id:
                    query &= Q(IP_Register_Id__Registration_Id__icontains=registration_id)
                if status:
                    query &= Q(Status=status)

                if date_type == "Current" and current_date:
                    query &= Q(created_at__date=current_date)
                elif date_type == "Customize" and from_date and to_date:
                    query &= Q(created_at__date__range=[from_date, to_date])

                advance_ins = Advance_Collection_IP.objects.filter(query)

                print(advance_ins,'advance_ins ippppppppppp')
                
                for advance in advance_ins:
                    op_ins = advance.IP_Register_Id
                    full_name = f"""{op_ins.PatientId.Title.Title_Name}.{op_ins.PatientId.FirstName or ""} {op_ins.PatientId.MiddleName or ''} {op_ins.PatientId.SurName or ''}"""
                    roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__Registration_Id=advance.IP_Register_Id.Registration_Id).order_by('-created_by').first()
                    # print('rooooommmmm',roomdetials)
                    if roomdetials:
                        room = f"""{roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None}-{roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None}-{roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None}/{roomdetials.RoomId.Bed_No if roomdetials else None}"""
                    else:
                        room = ''

                    data_list = {
                        'Receipt_No': advance.IPBillingReceipt.Voucher_Number,
                        'Receiptid' : advance.IPBillingReceipt.pk,
                        'PatientId': advance.IP_Register_Id.PatientId.PatientId,
                        'RegistrationId': advance.IP_Register_Id.Registration_Id,
                        'PatientCategory' : advance.IP_Register_Id.PatientCategory,
                        'PatientName': full_name,
                        'PhoneNo': advance.IP_Register_Id.PatientId.PhoneNo,
                        'Date': advance.created_at.strftime("%Y-%m-%d / %H:%M"),
                        'Amount': advance.AdvanceAmount,
                        'ReceivedBy': advance.created_by,
                        'RoomDetails': room,
                        'Status': advance.Status,
                        'Age': advance.IP_Register_Id.PatientId.Age,
                        'Gender': advance.IP_Register_Id.PatientId.Gender,
                        'AdvanceType' : 'IP'


                    }
                    advance_list.append(data_list)
            return JsonResponse(advance_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
 
@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_Advance_Refund_Request(request) :

    try:

        data = json.loads(request.body)

        print(data,'data')

        selectedPatient = data.get('selectedPatient')
        AdvanceType = data.get('AdvanceType')
        Status = data.get('Status')


        print(selectedPatient,'selectedPatient')
        print(AdvanceType,'AdvanceType')

        Receipt_No = selectedPatient.get('Receipt_No')
        RegistrationId = selectedPatient.get('RegistrationId')
        Receiptid = selectedPatient.get('Receiptid')
        createdby = data.get('createdby')

        print(Receipt_No,'Receipt_No',RegistrationId,'RegistrationId',Receiptid,'Receiptid')

        if AdvanceType == 'IP':

                Rcptins = IPBillingReceipt.objects.filter(pk=Receiptid).first()

                Advanceins = Advance_Collection_IP.objects.filter(IPBillingReceipt_id=Receiptid).first()

                print(Advanceins,'Advanceins')

                if Status == 'RefundRequest':

                    Advanceins.Status = Status
                    Advanceins.updated_by = createdby
                    Advanceins.save()

                if Status == 'Approved':

                    Advanceins.Status = Status
                    Advanceins.Approvedby = createdby
                    Advanceins.save()



        else:

                Rcptins = GeneralBillingReceipt.objects.filter(pk=Receiptid).first()

                Advanceins = Advance_Collection_IP.objects.filter(GeneralBillingReceipt_id=Receiptid).first()

                print(Advanceins,'Advanceins')

                if Status == 'RefundRequest':

                    Advanceins.Status = Status
                    Advanceins.updated_by = createdby
                    Advanceins.save()

                if Status == 'Approved':

                    Advanceins.Status = Status
                    Advanceins.Approvedby = createdby
                    Advanceins.save()



        return JsonResponse({'success': f"Advance {Status} for Receipt_No {Receipt_No} successfully"})

    except Exception as e:
            return JsonResponse({'error': str(e)})
    
# @csrf_exempt
# @require_http_methods(['POST','GET'])
# def Advance_Refund_Billing(request) :

#     if request.method == 'POST':

#         try:

#             data = json.loads(request.body)
#             AdvanceType = data.get('AdvanceType')
#             Status = data.get('Status')
#             PatientId = data.get('PatientId')
#             PatientName = data.get('PatientName')
#             PhoneNo = data.get('PhoneNo')
#             Refunddatas = data.get('Refunddatas')
#             Amount = data.get('Amount')
#             Billedby = data.get('Billedby')

#             Receiptid = data.get('Receiptid')


           


#             print(AdvanceType,'AdvanceType')


#             if AdvanceType == 'IP':
                    
#                     print('ip insideeeeeeeee')

#                     Rcptins = IPBillingReceipt.objects.filter(pk=Receiptid).first()
#                     Advanceins = Advance_Collection_IP.objects.filter(IPBillingReceipt_id=Receiptid).first()

#                     AdvanceRcptins = IPAdvanceRefundReceipt(
#                         RegisterType = AdvanceType,
#                         IPInvoice_NO = Rcptins,
#                         OPInvoice_NO = None,
#                         AdvanceCollection = Advanceins,
#                         NewPayment = 'RefundPayment',
#                         PatientID = PatientId,
#                         PhoneNumber = PhoneNo,
#                         Patient_Name = PatientName,
#                         TotalAmount = Amount,
#                         TotalPaidAmount = Amount,
#                         BalanceAmount = 0,
#                         PaidAmount = Amount,
#                         Billedby = Billedby,
#                         Billing_Date = today,
#                     )
#                     AdvanceRcptins.save()

#                     paymentins = Multiple_Payment_Advance_Refund_Table_Detials(
    
#                             Receipt_No_Paid = AdvanceRcptins,
#                             Payment_Type = 'Cash',
#                             Cart_Type = '',
#                             Card_No = '',
#                             TransactionId = '',
#                             upiid = '',
#                             Cheque_No = '',
#                             Bank_Name = '',
#                             Transaction_Amount = 0,
#                             AdditionalAmount = 0,
#                             Amount = Decimal(Amount)
    
#                     )
#                     paymentins.save()

#                     Advanceins.Status = 'Refunded'
#                     Advanceins.save()

#                     print(AdvanceRcptins,'AdvanceRcptins',paymentins,'paymentins')

#                     return JsonResponse({'success': f"Advance Refunded successfully",'AdvanceRcptid' : AdvanceRcptins.pk})

#             else:
                    
#                     print('op insideeeeeeeee')


#                     Rcptins = GeneralBillingReceipt.objects.filter(pk=Receiptid).first()

#                     Advanceins = Advance_Collection_IP.objects.filter(GeneralBillingReceipt_id=Receiptid).first()

#                     print(Rcptins,'Rcptins',Advanceins,'Advanceins')
#                     try:

#                         AdvanceRcptins = IPAdvanceRefundReceipt(
#                             RegisterType = AdvanceType,
#                             OPInvoice_NO = Rcptins,
#                             IPInvoice_NO = None,
#                             AdvanceCollection = Advanceins,
#                             NewPayment = 'RefundPayment',
#                             PatientID = PatientId,
#                             PhoneNumber = PhoneNo,
#                             Patient_Name = PatientName,
#                             TotalAmount = Amount,
#                             TotalPaidAmount = Amount,
#                             BalanceAmount = 0,
#                             PaidAmount = Amount,
#                             Billedby = Billedby,
#                             Billing_Date = today,
#                         )
#                         AdvanceRcptins.save()

#                         print('saved AdvanceRcptins',AdvanceRcptins)

#                     except Exception as e:
                         
#                          print(str(e),'error')

#                     paymentins = Multiple_Payment_Advance_Refund_Table_Detials(
    
#                             Receipt_No_Paid = AdvanceRcptins,
#                             Payment_Type = 'Cash',
#                             Cart_Type = '',
#                             Card_No = '',
#                             TransactionId = '',
#                             upiid = '',
#                             Cheque_No = '',
#                             Bank_Name = '',
#                             Transaction_Amount = 0,
#                             AdditionalAmount = 0,
#                             Amount = Decimal(Amount)
    
#                     )
#                     paymentins.save()

#                     Advanceins.Status = 'Refunded'
#                     Advanceins.save()

#                     print(AdvanceRcptins,'after  AdvanceRcptins',paymentins,'after  paymentins')

#                     return JsonResponse({'success': f"Advance Refunded successfully",'AdvanceRcptid' : AdvanceRcptins.pk})



#         except Exception as e:
#                 return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(['POST','GET'])
def Advance_Refund_Billing(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            AdvanceType = data.get('AdvanceType')
            PatientId = data.get('PatientId')
            PatientName = data.get('PatientName')
            PhoneNo = data.get('PhoneNo')
            Refunddatas = data.get('Refunddatas')
            TotalRefundAmount = Decimal(data.get('TotalRefundAmount', 0))
            Billedby = data.get('Billedby')
            Receiptid = data.get('Receiptid')
            Remarks = data.get('Remarks')


            if AdvanceType == 'IP':
                Rcptins = IPBillingReceipt.objects.filter(pk=Receiptid).first()
                Advanceins = Advance_Collection_IP.objects.filter(IPBillingReceipt_id=Receiptid).first()
                
                # Calculate remaining amount after partial refund
                remaining_amount = Advanceins.AdvanceAmount - TotalRefundAmount
                
                # Create refund receipt
                AdvanceRcptins = IPAdvanceRefundReceipt(
                    RegisterType=AdvanceType,
                    IPInvoice_NO=Rcptins,
                    OPInvoice_NO=None,
                    AdvanceCollection=Advanceins,
                    NewPayment='RefundPayment',
                    PatientID=PatientId,
                    PhoneNumber=PhoneNo,
                    Patient_Name=PatientName,
                    TotalAmount=TotalRefundAmount,
                    TotalPaidAmount=TotalRefundAmount,
                    BalanceAmount=0,
                    PaidAmount=TotalRefundAmount,
                    Billedby=Billedby,
                    Billing_Date=today,
                    Remarks = Remarks

                )
                AdvanceRcptins.save()

                # Create payment record
                paymentins = Multiple_Payment_Advance_Refund_Table_Detials(
                    Receipt_No_Paid=AdvanceRcptins,
                    Payment_Type='Cash',
                    Cart_Type='',
                    Card_No='',
                    TransactionId='',
                    upiid='',
                    Cheque_No='',
                    Bank_Name='',
                    Transaction_Amount=0,
                    AdditionalAmount=0,
                    Amount=TotalRefundAmount
                )
                paymentins.save()

               
                if remaining_amount > 0:
                    Advanceins.Status = 'Paid'
                else:
                    Advanceins.Status = 'Refunded'
                
                Advanceins.save()

                return JsonResponse({'success': f"Advance Refunded successfully", 'AdvanceRcptid': AdvanceRcptins.Voucher_Number})

            else:
                # Similar logic for OP advances
                Rcptins = GeneralBillingReceipt.objects.filter(pk=Receiptid).first()
                Advanceins = Advance_Collection_IP.objects.filter(GeneralBillingReceipt_id=Receiptid).first()
                
                # Calculate remaining amount after partial refund
                remaining_amount = Advanceins.AdvanceAmount - TotalRefundAmount
                
                # Create refund receipt
                AdvanceRcptins = IPAdvanceRefundReceipt(
                    RegisterType=AdvanceType,
                    OPInvoice_NO=Rcptins,
                    IPInvoice_NO=None,
                    AdvanceCollection=Advanceins,
                    NewPayment='RefundPayment',
                    PatientID=PatientId,
                    PhoneNumber=PhoneNo,
                    Patient_Name=PatientName,
                    TotalAmount=TotalRefundAmount,
                    TotalPaidAmount=TotalRefundAmount,
                    BalanceAmount=0,
                    PaidAmount=TotalRefundAmount,
                    Billedby=Billedby,
                    Billing_Date=today,
                    Remarks = Remarks
                )
                AdvanceRcptins.save()

                # Create payment record
                paymentins = Multiple_Payment_Advance_Refund_Table_Detials(
                    Receipt_No_Paid=AdvanceRcptins,
                    Payment_Type='Cash',
                    Cart_Type='',
                    Card_No='',
                    TransactionId='',
                    upiid='',
                    Cheque_No='',
                    Bank_Name='',
                    Transaction_Amount=0,
                    AdditionalAmount=0,
                    Amount=TotalRefundAmount
                )
                paymentins.save()

                # Update advance status based on remaining amount
                if remaining_amount > 0:
                    Advanceins.Status = 'Paid'
                else:
                    Advanceins.Status = 'Refunded'
                
                Advanceins.save()

                return JsonResponse({'success': f"Advance Refunded successfully", 'AdvanceRcptid': AdvanceRcptins.Voucher_Number})

        except Exception as e:
            return JsonResponse({'error': str(e)})
        
    elif request.method == 'GET':
        try:
            # Get parameters from query string
            advance_type = request.GET.get('AdvanceType')
            receipt_id = request.GET.get('Receiptid')
            patient_id = request.GET.get('PatientId')
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')
            refund_id = request.GET.get('RefundId')
            
            # Build query based on provided parameters
            query = Q()
            
            if refund_id:
                # Get specific refund by ID
                query &= Q(Voucher_Number=refund_id)
            
            if advance_type:
                query &= Q(RegisterType=advance_type)
                
            if receipt_id:
                if advance_type == 'IP':
                    query &= Q(IPInvoice_NO_id=receipt_id)
                else:
                    query &= Q(OPInvoice_NO_id=receipt_id)
                    
            if patient_id:
                query &= Q(PatientID=patient_id)
                
            if from_date and to_date:
                query &= Q(Billing_Date__range=[from_date, to_date])
            
            # Fetch refund records
            refunds = IPAdvanceRefundReceipt.objects.filter(query).select_related(
                'IPInvoice_NO', 'OPInvoice_NO', 'AdvanceCollection'
            ).order_by('-Billing_Date', '-Voucher_Number')
            
            # Prepare response data
            refund_list = []
            for refund in refunds:

                patins = Patient_Detials.objects.filter(PatientId = refund.PatientID).first()  

            

                refund_data = {
                    'RefundId': refund.Voucher_Number,
                    'RefundDate': refund.Billing_Date.strftime('%Y-%m-%d'),
                    'AdvanceType': refund.RegisterType,
                    'PatientId': refund.PatientID,
                    'PatientName': refund.Patient_Name,
                    'PhoneNumber': refund.PhoneNumber,
                    'TotalRefundAmount': float(refund.TotalAmount),
                    'BilledBy': refund.Billedby,
                    'ReceiptNumber': refund.IPInvoice_NO.Voucher_Number if refund.RegisterType == 'IP' else refund.OPInvoice_NO.Voucher_Number,
                    'OriginalReceiptId': refund.IPInvoice_NO.pk if refund.RegisterType == 'IP' else refund.OPInvoice_NO.Voucher_Number,
                    'AdvancePurpose': refund.AdvanceCollection.AdvancePurpose if refund.AdvanceCollection else '',
                    # 'ServiceType': refund.AdvanceCollection.ServiceType if refund.AdvanceCollection else '',
                    'OriginalAdvanceAmount': float(refund.AdvanceCollection.AdvanceAmount) if refund.AdvanceCollection else 0.0,
                    'PaymentDetails': [],
                    'AgeGender' : f"""{patins.Age}/{patins.Gender}""",
                    # 'RegistrationId' : regins.Registration_Id
                }
                
                # Get payment details
                payments = Multiple_Payment_Advance_Refund_Table_Detials.objects.filter(
                    Receipt_No_Paid=refund
                )
                
                for payment in payments:
                    refund_data['PaymentDetails'].append({
                        'PaymentType': payment.Payment_Type,
                        'Amount': float(payment.Amount),
                        'CardType': payment.Cart_Type,
                        'CardNo': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'UPIId': payment.upiid,
                        'ChequeNo': payment.Cheque_No,
                        'BankName': payment.Bank_Name
                    })
                
                refund_list.append(refund_data)
            
            return JsonResponse({'refunds': refund_list}, safe=False)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)



@csrf_exempt
@require_http_methods(['POST','GET'])
def Advance_Refund_Billing_Details(request) :
     
     try:
          
          AdvanceRcptid = request.GET.get('AdvanceRcptid')

          AdvanceRcptins = IPAdvanceRefundReceipt.objects.filter(pk=AdvanceRcptid).first()

          AdvanceRefundList = []

          datalist = {
            
                'RegisterType' : AdvanceRcptins.RegisterType,
                'IPInvoice_NO' : AdvanceRcptins.IPInvoice_NO.Invoice_NO.Billing_Invoice_No,
                'OPInvoice_NO' : AdvanceRcptins.OPInvoice_NO.Invoice_NO.Billing_Invoice_No,
                'NewPayment' : AdvanceRcptins.NewPayment,
                'PatientID' : AdvanceRcptins.PatientID,
                'PhoneNumber' : AdvanceRcptins.PhoneNumber,
                'Patient_Name' : AdvanceRcptins.Patient_Name,
                'TotalAmount' : AdvanceRcptins.TotalAmount,
                'TotalPaidAmount' : AdvanceRcptins.TotalPaidAmount,
                'BalanceAmount' : AdvanceRcptins.BalanceAmount,
                'Billing_Date' : AdvanceRcptins.Billing_Date,
                'Voucher_Number' : AdvanceRcptins.Voucher_Number,
                'PaidAmount' : AdvanceRcptins.PaidAmount,
                'Billedby' : AdvanceRcptins.Billedby,

          }

          Advancedetails = {
               
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,
               'RegisterType' : AdvanceRcptins.AdvanceCollection.RegisterType,

          }

          

     except Exception as e:
        return JsonResponse({'error': str(e)})
          
@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Advance_Details_For_Refund(request):
    try:
        AdvanceType = request.GET.get('AdvanceType')
        Receiptid = request.GET.get('Receiptid')

        AdvanceList = []

        if AdvanceType == 'IP':
            Rcptins = IPBillingReceipt.objects.filter(pk=Receiptid).first()
            Advanceins = Advance_Collection_IP.objects.filter(IPBillingReceipt_id=Receiptid, Status='Approved').first()

            datalist = {
                'SerialNo': 1,  # Adding serial number
                'AdvanceAmount': Advanceins.AdvanceAmount,
                'AdvancePurpose': Advanceins.AdvancePurpose,
                'Advanceid' : Advanceins.pk,
                'ServiceType' : "IP ADVANCE"
            }
            AdvanceList.append(datalist)
        else:
            Rcptins = GeneralBillingReceipt.objects.filter(pk=Receiptid).first()
            Advanceins = Advance_Collection_IP.objects.filter(GeneralBillingReceipt_id=Receiptid, Status='Approved').first()

            datalist = {
                'SerialNo': 1,  # Adding serial number
                'AdvanceAmount': Advanceins.AdvanceAmount,
                'AdvancePurpose': Advanceins.AdvancePurpose,
                'Advanceid' : Advanceins.pk,
                'ServiceType' : "OP ADVANCE"


            }
            AdvanceList.append(datalist)

        return JsonResponse(AdvanceList, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})
    
