from django.db import models
from django.db.models import Max
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

class Finance_NatureOfGroup_Detailes(models.Model):
    NatureOfGroupName=models.CharField(max_length=30,unique=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)


class Finance_GroupMaster_Detailes (models.Model):
    GroupName = models.CharField(max_length=200,unique=True)
    TypeofGroup= models.CharField(max_length=25)
    NatureOfGroup = models.ForeignKey(
        Finance_NatureOfGroup_Detailes,
        on_delete=models.CASCADE,
        related_name='Group_NatureOfGroup',
    )
    ParentGroup = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='SubGroups',
        null=True, 
        blank=True
    )
    created_by = models.CharField(max_length=70)
    Updated_by = models.CharField(max_length=70)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.GroupName
    


class Finance_LedgerMasters_Detailes(models.Model):
    LedgerName=models.CharField(max_length=200,unique=True)
    LedgerGroupName=models.ForeignKey(Finance_GroupMaster_Detailes,on_delete=models.CASCADE,related_name='LedgermasterGroupName')
    OpeningBalance=models.DecimalField(max_digits=10, decimal_places=2)
    DebitOrCredit=models.CharField(max_length=15)
    PhoneNumber=models.CharField(max_length=20,null=True, blank=True)
    PANorITNo=models.CharField(max_length=25,null=True, blank=True)
    GSTNo=models.CharField(max_length=50,null=True, blank=True)
    Address=models.TextField(null=True, blank=True)
    ProvideBankDetails=models.BooleanField(default=False)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)




class Finance_LedgerMasters_Bank_Detailes(models.Model):
    LedgerMaster=models.ForeignKey(Finance_LedgerMasters_Detailes,on_delete=models.CASCADE,related_name='LedgerMasterBank')
    BankHolderName=models.CharField(max_length=200,null=True, blank=True)
    BankName=models.CharField(max_length=200,null=True, blank=True)
    AccountNumber=models.CharField(max_length=30,null=True, blank=True)
    Branch=models.CharField(max_length=100,null=True, blank=True)
    IFSCcode=models.CharField(max_length=30,null=True, blank=True)
    PANNumber=models.CharField(max_length=30,null=True, blank=True)




class AllLedgers_Mapping_Detailes(models.Model):
    TableName = models.TextField()
    TableId = models.TextField()
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)



# -------------------------Voucherssssssssssssssssssssssss------------------



class ContraVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = ContraVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='CON'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'CON{new_number:05d}'

        super().save(*args, **kwargs)
        


class ContraVoucher_Entry_Table_Detailes(models.Model):
    ContraVoucherMainTable=models.ForeignKey(ContraVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)





class PaymentVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = PaymentVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='PAY'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'PAY{new_number:05d}'

        super().save(*args, **kwargs)
        


class PaymentVoucher_Entry_Table_Detailes(models.Model):
    PaymentVoucherMainTable=models.ForeignKey(PaymentVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)




class ReceiptVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = ReceiptVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='REC'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'REC{new_number:05d}'

        super().save(*args, **kwargs)
        


class ReceiptVoucher_Entry_Table_Detailes(models.Model):
    ReceiptVoucherMainTable=models.ForeignKey(ReceiptVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)




class JournalVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = JournalVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='JOU'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'JOU{new_number:05d}'

        super().save(*args, **kwargs)
        


class JournalVoucher_Entry_Table_Detailes(models.Model):
    JournalVoucherMainTable=models.ForeignKey(JournalVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)



class SalesVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = SalesVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='SAL'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'SAL{new_number:05d}'

        super().save(*args, **kwargs)
        


class SalesVoucher_Entry_Table_Detailes(models.Model):
    SalesVoucherMainTable=models.ForeignKey(SalesVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    UnitOrTax=models.CharField(max_length=20)
    UnitOrTaxValue=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    PerUnitOrTaxable=models.CharField(max_length=30)
    RatePerUnitOrTaxableValue=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)




class PurchaseVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = PurchaseVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='PUR'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'PUR{new_number:05d}'

        super().save(*args, **kwargs)
        


class PurchaseVoucher_Entry_Table_Detailes(models.Model):
    PurchaseVoucherMainTable=models.ForeignKey(PurchaseVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    UnitOrTax=models.CharField(max_length=20)
    UnitOrTaxValue=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    PerUnitOrTaxable=models.CharField(max_length=30)
    RatePerUnitOrTaxableValue=models.DecimalField(max_digits=10, decimal_places=2)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)




class CreditNoteVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = CreditNoteVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='CRE'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'CRE{new_number:05d}'

        super().save(*args, **kwargs)
        


class CreditNoteVoucher_Entry_Table_Detailes(models.Model):
    CreditNoteVoucherMainTable=models.ForeignKey(CreditNoteVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    UnitOrTax=models.CharField(max_length=20)
    UnitOrTaxValue=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    PerUnitOrTaxable=models.CharField(max_length=30)
    RatePerUnitOrTaxableValue=models.DecimalField(max_digits=10, decimal_places=2)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)



class DebitNoteVoucher_Main_Table_Detailes(models.Model):
    VoucherNo = models.CharField(primary_key=True, max_length=20, editable=False)
    VoucherDate=models.DateField()
    PaymentType=models.CharField(max_length=100)
    VoucherNarration=models.TextField()
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.VoucherNo:
            with transaction.atomic():  
                last_instance = DebitNoteVoucher_Main_Table_Detailes.objects.filter(
                    VoucherNo__startswith='DEB'
                ).select_for_update().order_by('-VoucherNo').first()

                if last_instance:
                    try:
                        last_number = int(last_instance.VoucherNo[3:])
                        new_number = last_number + 1
                    except ValueError:
                        raise ValueError("Invalid format for VoucherNo in the database.")
                else:
                    new_number = 1  
                self.VoucherNo = f'DEB{new_number:05d}'

        super().save(*args, **kwargs)
        


class DebitNoteVoucher_Entry_Table_Detailes(models.Model):
    DebitNoteVoucherMainTable=models.ForeignKey(DebitNoteVoucher_Main_Table_Detailes,on_delete=models.CASCADE,to_field='VoucherNo')
    Particulars=models.ForeignKey(AllLedgers_Mapping_Detailes,on_delete=models.CASCADE)
    UnitOrTax=models.CharField(max_length=20) 
    UnitOrTaxValue=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    PerUnitOrTaxable=models.CharField(max_length=30)
    RatePerUnitOrTaxableValue=models.DecimalField(max_digits=10, decimal_places=2)
    DebitAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    CreditAmount=models.DecimalField(max_digits=10, decimal_places=2,default=0,null=True,blank=True)
    Status=models.BooleanField(default=True)


 
class Frontoffice_Expenses_Table_Detailes(models.Model):
    ExpenceDate=models.DateField()
    IssueBy=models.CharField(max_length=255)
    ExpensesName=models.ForeignKey(
        'Masters.ExpensesMasterDetailes',
        on_delete=models.CASCADE,
        related_name='Frontoffice_Expenses_MasterDetails'
    )
    ExpensesAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Remarks=models.TextField()
    Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='Frontoffice_Expenses_location_name'
    )
    Status=models.CharField(max_length=255,default='Pending')
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)
 
class Frontoffice_Expenses_Payment_Table_Detials (models.Model):
    Voucher_Table=models.ForeignKey(Frontoffice_Expenses_Table_Detailes,on_delete=models.CASCADE,related_name='Expenses_Table_Detailes')
    BillpayMethod=models.CharField(max_length=250)
    paidamount=models.DecimalField(max_digits=10, decimal_places=3)
    Remarks=models.TextField()
 
 
class Frontoffice_DayCloseing_Table_Detials (models.Model):
    DayCloseingDate=models.DateField()
    IssueBy=models.CharField(max_length=255)
    OpeningCash=models.DecimalField(max_digits=10, decimal_places=3)
    OPCollectionCash=models.DecimalField(max_digits=10, decimal_places=3)
    IPCollectionCash=models.DecimalField(max_digits=10, decimal_places=3)
    TotalCash=models.DecimalField(max_digits=10, decimal_places=3)
    ExpensesCash=models.DecimalField(max_digits=10, decimal_places=3)
    AvailableCash=models.DecimalField(max_digits=10, decimal_places=3)
    HandoverCash=models.DecimalField(max_digits=10, decimal_places=3)
    BalanceCash=models.DecimalField(max_digits=10, decimal_places=3)
    Narration=models.TextField()
    Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='Frontoffice_DayCloseing_location_name'
    )
    Status=models.CharField(max_length=255,default='Pending')
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)
 
 
class Frontoffice_ShiftClosing_Table_Detials (models.Model):
    DayCloseingDate=models.DateField()
    IssueBy=models.CharField(max_length=255)
    Shiftname=models.CharField(max_length=255)
    OpeningCash=models.DecimalField(max_digits=10, decimal_places=2)
    OPCollectionCash=models.DecimalField(max_digits=10, decimal_places=2)
    IPCollectionCash=models.DecimalField(max_digits=10, decimal_places=2)
    TotalCash=models.DecimalField(max_digits=10, decimal_places=2)
    CashTotal=models.DecimalField(max_digits=10, decimal_places=2)
    CardTotal=models.DecimalField(max_digits=10, decimal_places=2)
    UPITotal=models.DecimalField(max_digits=10, decimal_places=2)
    ExpensesCash=models.DecimalField(max_digits=10, decimal_places=2)
    AvailableCash=models.DecimalField(max_digits=10, decimal_places=2)
    HandoverCash=models.DecimalField(max_digits=10, decimal_places=2)
    BalanceCash=models.DecimalField(max_digits=10, decimal_places=2)
    Narration=models.TextField()
    Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='Frontoffice_ShiftCloseing_location_name'
    )
    Status=models.CharField(max_length=255,default='Pending')
    Handoverto=models.CharField(max_length=255)
    created_by=models.CharField(max_length=70)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)
 
 




