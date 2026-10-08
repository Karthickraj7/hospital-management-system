from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *
from Inventory.models import (GRN_Product_Item_Detials, GRN_Table_Detials, Product_Category_Product_Details)
from django.db import transaction
from  Frontoffice.models import (General_Billing_Items_Table_Detials, IP_Billing_Items_Table_Detials, IP_Billing_Table_Detials, Multiple_Payment_Table_Detials, Multiple_Payment_Table_IP_Detials, Patient_Detials)
from Masters.models import Doctor_Personal_Form_Detials,Service_Category_Masters
# from Masters.models import (Service_Category_Masters)
from HR_Management.models import (Employee_Personal_Form_Detials)
from Frontoffice.models import (General_Billing_Table_Detials)

from Inventory.models import (Supplier_Master_Details)

@receiver(post_save, sender=Finance_LedgerMasters_Detailes)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Finance_LedgerMasters_Detailes,
                    TableId=instance.pk,
                    created_by=instance.created_by,
                    Updated_by=instance.Updated_by
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")


@receiver(post_save, sender=Product_Category_Product_Details)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Product_Category_Product_Details,
                    TableId=instance.pk,
                    created_by=instance.Created_by,
                    Updated_by=instance.Updated_by
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")



@receiver(post_save, sender=Patient_Detials)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Patient_Detials,
                    TableId=instance.pk,
                    created_by=instance.created_by,
                
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")
            
@receiver(post_save, sender=Doctor_Personal_Form_Detials)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Doctor_Personal_Form_Detials,
                    TableId=instance.pk,
                    created_by=instance.created_by,
                
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")
            
  
@receiver(post_save, sender=Employee_Personal_Form_Detials)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Employee_Personal_Form_Detials,
                    TableId=instance.pk,
                    created_by=instance.created_by,
                    Updated_by=instance.updated_by
                
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")            
            
            

@receiver(post_save, sender=Supplier_Master_Details)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Supplier_Master_Details,
                    TableId=instance.pk,
                    created_by=instance.created_by
                   
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")                        
            
            

@receiver(post_save, sender=Service_Category_Masters)
def insert_financeledger_mapping_tableinsert(sender, instance, created, **kwargs):
    # print('Signal for ledger finance:', instance)
    if created:
        try:
            with transaction.atomic():
                AllLedgers_Mapping_Detailes.objects.create(
                    TableName=Service_Category_Masters,
                    TableId=instance.pk,
                    created_by=instance.Createdby
                   
                )
                print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        except Exception as e:
            print(f"Error inserting mapping entry: {e}")                   
            
            
            
# @receiver(post_save, sender = General_Billing_Table_Detials)
# def save_op_billing_vouchers(sender,instance,created,**kwaegs):
#     if created:
#         try:
#             with transaction.atomic():
#                 print('11111-ppppp')
                
#                 mul_inst=Multiple_Payment_Table_Detials.objects.get(Receipt_No_Paid__Invoice_NO__Billing_Invoice_No=instance.Billing_Invoice_No)
                
#                 print('0000-99887',mul_inst)
                
#                 ins_main = SalesVoucher_Main_Table_Detailes.objects.create(
#                     VoucherDate = instance.Billing_Date,
#                     PaymentType = mul_inst,
#                     VoucherNarration = f'The patient {instance.Patient_Id.FirstName} was paid {instance.Net_Paid_Amount} for OP service',
                    
#                 )         
                
#                 Patient_Ledger_inst=AllLedgers_Mapping_Detailes.objects.get(TableName=Patient_Detials,TableId=instance.Patient_Id.PatientId)
                
#                 SalesVoucher_Entry_Table_Detailes.objects.create(
#                     SalesVoucherMainTable = ins_main,
#                     Particulars = Patient_Ledger_inst,
#                     DebitAmount =instance.Net_Amount
#                 )
                
#                 Service_Ledger_inst=General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=instance)
                
#                 for service in Service_Ledger_inst:
#                     Service_master=Service_Category_Masters.objects.filter(ServiceCategory=service.Service_Type).first()
                    
#                     Service_Ledger_inst=AllLedgers_Mapping_Detailes.objects.get(TableName=Service_Category_Masters,TableId=Service_master.pk)
                    
#                     SalesVoucher_Entry_Table_Detailes.objects.create(
#                     SalesVoucherMainTable = ins_main,
#                     Particulars = Service_Ledger_inst,
#                     UnitOrTax='Unit',
#                     UnitOrTaxValue=service.Quantity,
#                     PerUnitOrTaxable='Taxable Value',
#                     RatePerUnitOrTaxableValue=service.Amount,
#                     CreditAmount=service.Total_Amount
#                     )
#                 print(f"Mapping entry created for Finance Ledger: {instance.LedgerName}")
        
#         except Exception as e:
#             print(f"Error inserting mapping entry: {e}")           
                
           
@receiver(post_save, sender=Multiple_Payment_Table_Detials)
def save_op_billing_vouchers(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                print('--- Payment record created, proceeding with voucher creation ---')

                billing_invoice_no = instance.Receipt_No_Paid.Invoice_NO.Billing_Invoice_No
                billing_instance = General_Billing_Table_Detials.objects.get(Billing_Invoice_No=billing_invoice_no)

                ins_main = SalesVoucher_Main_Table_Detailes.objects.create(
                    VoucherDate=billing_instance.Billing_Date,
                    PaymentType=instance,
                    VoucherNarration=f'The patient {billing_instance.Patient_Id.FirstName} was paid {billing_instance.Net_Paid_Amount} for OP service',
                )

                patient_ledger = AllLedgers_Mapping_Detailes.objects.get(
                    TableName=Patient_Detials, 
                    TableId=billing_instance.Patient_Id.PatientId
                )
                print('patient ledger',patient_ledger)
                SalesVoucher_Entry_Table_Detailes.objects.create(
                    SalesVoucherMainTable=ins_main,
                    Particulars=patient_ledger,
                    DebitAmount=billing_instance.Net_Amount
                )
                print('patient ledger3333')

                service_items = General_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billing_instance)
                print(service_items,'service items--')
                for service in service_items:
                    
                    print('service',service,'---',service.Quantity)
                    service_master = Service_Category_Masters.objects.filter(ServiceCategory=service.Service_Type).first()
                    service_ledger = AllLedgers_Mapping_Detailes.objects.get(
                        TableName=Service_Category_Masters,
                        TableId=service_master.pk
                    )

                    SalesVoucher_Entry_Table_Detailes.objects.create(
                        SalesVoucherMainTable=ins_main,
                        Particulars=service_ledger,
                        UnitOrTax='Unit',
                        UnitOrTaxValue=service.Quantity,
                        PerUnitOrTaxable='Taxable Value',
                        RatePerUnitOrTaxableValue=service.Amount,
                        CreditAmount=service.Total_Amount
                    )

                print(f"✅ Finance voucher created for billing invoice {billing_instance.Billing_Invoice_No}")
                
                
                ins_main1 = ReceiptVoucher_Main_Table_Detailes.objects.create(
                    VoucherDate=billing_instance.Billing_Date,
                    PaymentType=instance,
                    VoucherNarration=f'The patient {billing_instance.Patient_Id.FirstName} was paid {billing_instance.Net_Paid_Amount} for OP service',
                ) 
                
                ReceiptVoucher_Entry_Table_Detailes.objects.create(
                    ReceiptVoucherMainTable=ins_main1,
                    Particulars=patient_ledger,
                    CreditAmount=billing_instance.Net_Amount
                )
                
                
                mulo_ins1 = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid__Invoice_NO=billing_instance)
                print('-----',mulo_ins1)
                for payment in mulo_ins1:
                    
                    print('service009090090990',payment,'---',payment.Payment_Type)
                    if payment.Payment_Type == 'Cash':
                        finance_master1 = Finance_LedgerMasters_Detailes.objects.get(LedgerName='Cash')
                        print('vanakkam',finance_master1)
                        payment_ledger = AllLedgers_Mapping_Detailes.objects.get(
                         TableName=Finance_LedgerMasters_Detailes,
                        TableId=finance_master1.pk
                    )
                        print('payment',payment_ledger)
                    else:
                        finance_master1 = Finance_LedgerMasters_Detailes.objects.get(LedgerName='Bank')
                        payment_ledger = AllLedgers_Mapping_Detailes.objects.get(
                         TableName=Finance_LedgerMasters_Detailes,
                        TableId=finance_master1.pk
                        )
                        print('payment1',payment_ledger)
                            
                    ReceiptVoucher_Entry_Table_Detailes.objects.create(
                        ReceiptVoucherMainTable=ins_main1,
                        Particulars = payment_ledger,
                        DebitAmount=service.Total_Amount
                    )
                         

                  

        except Exception as e:
            print(f"❌ Error in voucher creation: {e}")
            
            
         

@receiver(post_save, sender=Multiple_Payment_Table_IP_Detials)
def save_IP_billing_vouchers(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                print('--- Payment record created, proceeding with voucher creation ---')

                billing_invoice_no = instance.Invoice_No.Invoice_NO.Billing_Invoice_No
                billing_instance = IP_Billing_Table_Detials.objects.get(Billing_Invoice_No=billing_invoice_no)

                ins_main = SalesVoucher_Main_Table_Detailes.objects.create(
                    VoucherDate=billing_instance.Billing_Date,
                    PaymentType=instance,
                    VoucherNarration=f'The patient {billing_instance.Patient_Id.FirstName} was paid {billing_instance.Net_Paid_Amount} for OP service',
                )

                patient_ledger = AllLedgers_Mapping_Detailes.objects.get(
                    TableName=Patient_Detials, 
                    TableId=billing_instance.Patient_Id.PatientId
                )
                print('patient ledger',patient_ledger)
                SalesVoucher_Entry_Table_Detailes.objects.create(
                    SalesVoucherMainTable=ins_main,
                    Particulars=patient_ledger,
                    DebitAmount=billing_instance.Net_Amount
                )
                print('patient ledger3333')

                service_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=billing_instance)
                print(service_items,'service items--')
                for service in service_items:
                    
                    print('service',service,'---',service.Quantity)
                    service_master = Service_Category_Masters.objects.filter(ServiceCategory=service.Service_Type).first()
                    service_ledger = AllLedgers_Mapping_Detailes.objects.get(
                        TableName=Service_Category_Masters,
                        TableId=service_master.pk
                    )

                    SalesVoucher_Entry_Table_Detailes.objects.create(
                        SalesVoucherMainTable=ins_main,
                        Particulars=service_ledger,
                        UnitOrTax='Unit',
                        UnitOrTaxValue=service.Quantity,
                        PerUnitOrTaxable='Taxable Value',
                        RatePerUnitOrTaxableValue=service.Amount,
                        CreditAmount=service.Total_Amount
                    )

                print(f"✅ Finance voucher created for billing invoice {billing_instance.Billing_Invoice_No}")
                
                
                ins_main1 = ReceiptVoucher_Main_Table_Detailes.objects.create(
                    VoucherDate=billing_instance.Billing_Date,
                    PaymentType=instance,
                    VoucherNarration=f'The patient {billing_instance.Patient_Id.FirstName} was paid {billing_instance.Net_Paid_Amount} for OP service',
                ) 
                
                ReceiptVoucher_Entry_Table_Detailes.objects.create(
                    ReceiptVoucherMainTable=ins_main1,
                    Particulars=patient_ledger,
                    CreditAmount=billing_instance.Net_Amount
                )
                
                
                mulo_ins1 = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=billing_instance)
                print('-----',mulo_ins1)
                for payment in mulo_ins1:
                    
                    print('service009090090990',payment,'---',payment.Payment_Type)
                    if payment.Payment_Type == 'Cash':
                        finance_master1 = Finance_LedgerMasters_Detailes.objects.get(LedgerName='Cash')
                        print('vanakkam',finance_master1)
                        payment_ledger = AllLedgers_Mapping_Detailes.objects.get(
                         TableName=Finance_LedgerMasters_Detailes,
                        TableId=finance_master1.pk
                    )
                        print('payment',payment_ledger)
                    else:
                        finance_master1 = Finance_LedgerMasters_Detailes.objects.get(LedgerName='Bank')
                        payment_ledger = AllLedgers_Mapping_Detailes.objects.get(
                         TableName=Finance_LedgerMasters_Detailes,
                        TableId=finance_master1.pk
                        )
                        print('payment1',payment_ledger)
                            
                    ReceiptVoucher_Entry_Table_Detailes.objects.create(
                        ReceiptVoucherMainTable=ins_main1,
                        Particulars = payment_ledger,
                        DebitAmount=service.Total_Amount
                    )
                         

                    print(f"✅ Finance voucher created for billing invoice completed the 0proce4esn...")    

        except Exception as e:
            print(f"❌ Error in voucher creation: {e}")
         
                
         

@receiver(post_save, sender=GRN_Product_Item_Detials)
def create_grn_purchase_voucher(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                grn_instance = instance.Grn_Detials  # foreign key to GRN_Table_Detials

                print('✅ GRN item created, processing purchase voucher...')

                # Get supplier ledger
                qu_grn_instance =GRN_Table_Detials.objects.get(pk=grn_instance.pk)
                print('garnaments-----',qu_grn_instance)
                supplier_ledger = AllLedgers_Mapping_Detailes.objects.get(
                    TableName=Supplier_Master_Details,
                    TableId=qu_grn_instance.Supplier_Detials.Supplier_Id
                )
                print(supplier_ledger,'supplier legder.....')
                print(' 2✅ GRN item created, processing purchase voucher...')

                # Create Purchase Voucher Main
                voucher_main = PurchaseVoucher_Main_Table_Detailes.objects.create(
                    VoucherDate=grn_instance.GrnDate,
                    PaymentType='',
                    
                    VoucherNarration=f"GRN for PO {qu_grn_instance.Supplier_Bill_Number}",
                )
                PurchaseVoucher_Entry_Table_Detailes.objects.create(
                    PurchaseVoucherMainTable=voucher_main,
                    Particulars=supplier_ledger,
                    UnitOrTax='Unit',
                    UnitOrTaxValue=instance.Total_Received_Quantity,
                    PerUnitOrTaxable='Rate',
                    RatePerUnitOrTaxableValue=instance.Purchase_rate_taxable,
                    DebitAmount=instance.Final_Total_Pack_Amount_with_tax
                    
                )

                print('3 ✅ GRN item created, processing purchase voucher...')
                # Create Inventory ledger entry
                product = instance.Product_Detials.ProductCategory.pk
                print('product category instance .....',product)
                
                product_ledger = AllLedgers_Mapping_Detailes.objects.get(
                    TableName=Product_Category_Product_Details,
                    TableId=product
                )

                print('5 ✅ GRN item created, processing purchase voucher...')
                # Debit: Inventory
                PurchaseVoucher_Entry_Table_Detailes.objects.create(
                    PurchaseVoucherMainTable=voucher_main,
                    Particulars=product_ledger,
                    UnitOrTax='Unit',
                    UnitOrTaxValue=instance.Total_Received_Quantity,
                    PerUnitOrTaxable='Rate',
                    RatePerUnitOrTaxableValue=instance.Purchase_rate_taxable,
                    DebitAmount=instance.Final_Total_Pack_Amount_with_tax
                )

                print('4 ✅ GRN item created, processing purchase voucher...')
                # Optional: Debit - Tax
                # if instance.Tax_Amount and instance.Tax_Amount > 0:
                #     tax_ledger = AllLedgers_Mapping_Detailes.objects.get(
                #         LedgerName='Input GST'  # or dynamic tax account
                #     )
                #     PurchaseVoucher_Entry_Table_Detailes.objects.create(
                #         PurchaseVoucherMainTable=voucher_main,
                #         Particulars=tax_ledger,
                #         DebitAmount=instance.Tax_Amount
                #     )
                # print('1 ✅ GRN item created, processing purchase voucher...')

                # # Credit: Supplier
                # PurchaseVoucher_Entry_Table_Detailes.objects.create(
                #     PurchaseVoucherMainTable=voucher_main,
                #     Particulars=supplier_ledger,
                #     CreditAmount=instance.Total_Amount
                # )

                print(f"✅ Purchase voucher created for GRN {grn_instance}")

        except Exception as e:
            print(f"❌ Error while creating GRN voucher: {e}")
