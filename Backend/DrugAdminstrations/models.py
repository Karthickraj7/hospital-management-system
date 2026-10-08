from django.db import models
from django.db.models import Max
from django.core.exceptions import ValidationError
from Frontoffice.models import *
from Inventory.models import *
# Create your models here.


# class Ip_Drug_Administration(models.Model):
#     Prescription_Id = models.IntegerField(primary_key=True)
#     Booking_Id = models.CharField(max_length=25, default= '')
#     Department = models.CharField(max_length=60)
#     DoctorName = models.CharField(max_length=60)
#     GenericName = models.CharField(max_length=60)
#     MedicineCode = models.CharField(max_length=60)
#     MedicineName = models.CharField(max_length=60)
#     Dosage = models.CharField(max_length=60)
#     Route = models.CharField(max_length=60)
#     FrequencyMethod = models.CharField(max_length=60)
#     FrequencyType = models.CharField(max_length=60)
#     Frequency = models.CharField(max_length=60)
#     FrequencyTime = models.CharField(max_length=30, default='')
#     Duration = models.CharField(max_length=60)
#     DurationType = models.CharField(max_length=60)
#     Quantity = models.CharField(max_length=60)
#     AdminisDose = models.CharField(max_length=60)
#     Date = models.DateTimeField(auto_now=True)
#     Time = models.CharField(max_length=60)
#     Instruction = models.CharField(max_length=60)
#     Status = models.CharField(max_length=60)
#     CapturedBy = models.CharField(max_length=60)
#     RequestType = models.CharField(max_length=60)
#     RequestQuantity = models.CharField(max_length=60)
#     RequestDate = models.DateField(auto_now=True)
#     BillingMethod = models.CharField(max_length=60)
#     PrescriptionBarcode = models.CharField(max_length=60)
#     Specialization = models.CharField(max_length=60)
#     IssuedType = models.CharField(max_length=60)
#     IssuedBy = models.CharField(max_length=60)
#     Location = models.CharField(max_length=65, default="")
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'Ip_Drug_Administration'
#     def save(self, *args, **kwargs):
#         if not self.Prescription_Id:
#             max_id = Ip_Drug_Administration.objects.aggregate(max_id=Max('Prescription_Id'))['max_id']
#             self.Prescription_Id = (max_id or 0) + 1
#         super(Ip_Drug_Administration, self).save(*args, **kwargs)
    
    
    
# class Ip_Nurse_Drug_Completed_Administration(models.Model):
#     Nurse_Prescription_Id = models.AutoField(primary_key=True)
#     Prescription_Id = models.CharField(max_length=25, default='')  # New field added
#     Booking_Id = models.CharField(max_length=25, blank=True, default='')
#     Department = models.CharField(max_length=60)
#     DoctorName = models.CharField(max_length=60)
#     GenericName = models.CharField(max_length=60)
#     MedicineCode = models.CharField(max_length=60)
#     MedicineName = models.CharField(max_length=60)
#     Dosage = models.CharField(max_length=60)
#     Route = models.CharField(max_length=60)
#     FrequencyIssued = models.CharField(max_length=60)
#     FrequencyMethod = models.CharField(max_length=60)
#     Quantity = models.CharField(max_length=60)
#     Issued_Date = models.DateField(auto_now_add=True)
#     Complete_Date = models.DateField(auto_now=True)
#     Complete_Time = models.TimeField(auto_now=True)
#     Completed_Remarks = models.CharField(max_length=60, blank=True)
#     Status = models.CharField(max_length=60)
#     Location = models.CharField(max_length=100, default='')
#     CapturedBy = models.CharField(max_length=60)
#     AdminisDose = models.CharField(max_length=60, blank=True)
#     updated_at = models.DateTimeField(default=datetime.now)
#     created_at = models.DateTimeField(default=datetime.now)

#     class Meta:
#         db_table = 'Ip_Nurse_Drug_Completed_Administration'

#     def save(self, *args, **kwargs):
#         # The primary key is handled by AutoField, so no need to manually set it
#         super().save(*args, **kwargs)



# class ip_drug_request_table(models.Model):
#     Drug_Request_Id  = models.AutoField(primary_key=True)
#     Booking_Id =  models.CharField(max_length=25)
#     Prescibtion_Id = models.CharField(max_length=25)
#     Department = models.CharField(max_length=25)
#     DoctorName = models.CharField(max_length= 150)
#     GenericName = models.CharField(max_length=100)
#     MedicineCode = models.CharField(max_length=25)
#     MedicineName = models.CharField(max_length=100)
#     Dosage = models.CharField(max_length=25)
#     Route = models.CharField(max_length=12)
#     Duration = models.CharField(max_length=25)
#     DurationType = models.CharField(max_length=25)
#     RequestType = models.CharField(max_length=50)
#     Quantity = models.CharField(max_length=25)
#     RequestQuantity = models.CharField(max_length=25)
#     RemainingQuantity = models.CharField(max_length=25)
#     RecivedQuantity = models.CharField(max_length=25)
#     Location = models.CharField(max_length=45)
#     CreatedBy = models.CharField(max_length=100)
#     Status = models.CharField(max_length=60)
#     Priscription_Barcode = models.CharField(max_length=25)
#     Date	 = models.CharField(max_length=25)
#     Time = models.CharField(max_length=25)
#     Canceled_Reason = models.CharField(max_length=250)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now=True)

    

#     class Meta:
#         db_table = 'ip_drug_request_table'
#     def save(self, *args, **kwargs):
#         if not self.Drug_Request_Id:
#             max_id = ip_drug_request_table.objects.aggregate(max_id=Max('Drug_Request_Id')) ['max_id']
#             self.Drug_Request_Id = (max_id or 0) + 1
#         super(ip_drug_request_table, self).save(*args, **kwargs)



class medical_productmaster_information(models.Model):
    ProductCode = models.CharField(max_length=25,primary_key=True)
    Productcategory = models.CharField(max_length=25)
    ProductName = models.CharField(max_length=155)
    GenericName = models.CharField(max_length=86)
    Strength = models.CharField(max_length=50)
    UOM = models.CharField(max_length=25)
    ProductType = models.CharField(max_length=75)
    ProductQuantity = models.IntegerField()
    SellingPriceWithoutGST = models.DecimalField(max_digits=10, decimal_places=2)
    Status = models.CharField(max_length=55)
    Created_By = models.CharField(max_length=65)
    Location = models.CharField(max_length=75)
    Productcategory_Type = models.CharField(max_length=100)
    UpdatedAt = models.DateTimeField(auto_now= True)
    CreatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'medical_productmaster_information'   
    def _str_(self):
        return self.ProductCode
    

class Doctor_drug_prescription(models.Model):
    Prescription_Id = models.IntegerField(primary_key=True)
    Booking_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Department = models.CharField(max_length=30)
    DoctorName = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Doctor_drug_docname')
    ProductCode = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Doctor_drug_med_code')
    Route = models.TextField()
    FrequencyMethod = models.CharField(max_length=60)
    Frequency = models.ForeignKey(Frequency_Master_Drug,on_delete=models.CASCADE,null=True,blank=True)
    Duration = models.CharField(max_length=60)
    DurationType = models.CharField(max_length=60)
    Quantity = models.CharField(max_length=60)
    AdminisDose = models.CharField(max_length=60)
    Date = models.DateTimeField(auto_now=True)
    Time = models.CharField(max_length=60)
    Instruction = models.CharField(max_length=60)
    Status = models.CharField(max_length=60)
    CapturedBy = models.CharField(max_length=60)
    Specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IssuedBy = models.CharField(max_length=60)
    OrderType = models.CharField(max_length=60)
    RequestType = models.CharField(max_length=60)
    RequestQuantity = models.CharField(max_length=60)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Doctor_drug_prescription'
    def save(self, *args, **kwargs):
        if not self.Prescription_Id:
            max_id = Doctor_drug_prescription.objects.aggregate(max_id=Max('Prescription_Id'))['max_id']
            self.Prescription_Id = (max_id or 0) + 1
        super(Doctor_drug_prescription, self).save(*args, **kwargs)
    
class Nurse_drug_prescription(models.Model):
    Nurse_Prescription_Id = models.IntegerField(primary_key=True)
    Booking_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ProductCode = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Nurse_drug_med_code')
    Route = models.TextField()
    FrequencyMethod = models.CharField(max_length=60)
    Frequency = models.ForeignKey(Frequency_Master_Drug,on_delete=models.CASCADE,null=True,blank=True)
    Duration = models.CharField(max_length=60)
    DurationType = models.CharField(max_length=60)
    Quantity = models.CharField(max_length=60)
    AdminisDose = models.CharField(max_length=60)
    Date = models.DateTimeField(auto_now=True)
    Time = models.CharField(max_length=60)
    Instruction = models.CharField(max_length=60)
    Status = models.CharField(max_length=60)
    CapturedBy = models.CharField(max_length=60)
    IssuedBy = models.CharField(max_length=60)
    Complete_Date = models.DateField(auto_now=True)
    Complete_Time = models.TimeField(auto_now=True)
    Completed_Remarks = models.CharField(max_length=60, blank=True)
    OrderType = models.CharField(max_length=60)
    RequestType = models.CharField(max_length=60)
    RequestQuantity = models.CharField(max_length=60)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Nurse_drug_prescription'
    def save(self, *args, **kwargs):
        if not self.Prescription_Id:
            max_id = Nurse_drug_prescription.objects.aggregate(max_id=Max('Prescription_Id'))['max_id']
            self.Prescription_Id = (max_id or 0) + 1
        super(Nurse_drug_prescription, self).save(*args, **kwargs)
    
class ip_drug_request_table(models.Model):
    Nurse_Prescription_Id = models.IntegerField(primary_key=True)
    Prescription_Id = models.ForeignKey(Doctor_drug_prescription,on_delete=models.CASCADE, null=True, blank=True)
    Booking_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Department = models.CharField(max_length=30)
    DoctorName = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Doctor_drug_docname_request')
    ProductCode = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Doctor_drug_med_code_request')
    Route = models.TextField()
    FrequencyMethod = models.CharField(max_length=60)
    Frequency = models.ForeignKey(Frequency_Master_Drug,on_delete=models.CASCADE,null=True,blank=True)
    Duration = models.CharField(max_length=60)
    DurationType = models.CharField(max_length=60)
    Quantity = models.CharField(max_length=60)
    AdminisDose = models.CharField(max_length=60)
    Date = models.DateTimeField(auto_now=True)
    Time = models.CharField(max_length=60)
    Instruction = models.CharField(max_length=60)
    Status = models.CharField(max_length=60)
    CapturedBy = models.CharField(max_length=60)
    IssuedBy = models.CharField(max_length=60)
    Complete_Date = models.DateField(auto_now=True)
    Complete_Time = models.TimeField(auto_now=True)
    Completed_Remarks = models.CharField(max_length=60, blank=True)
    OrderType = models.CharField(max_length=60)
    RequestType = models.CharField(max_length=60)
    RequestQuantity = models.CharField(max_length=60)
    RemainingQuantity = models.CharField(max_length=25)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ip_drug_request_table'
    def save(self, *args, **kwargs):
        if not self.Nurse_Prescription_Id:
            max_id = ip_drug_request_table.objects.aggregate(max_id=Max('Nurse_Prescription_Id'))['max_id']
            self.Nurse_Prescription_Id = (max_id or 0) + 1
        super(ip_drug_request_table, self).save(*args, **kwargs)


class Ip_Nurse_Drug_Completed_Administration(models.Model):
    Nurse_Prescription_Id = models.AutoField(primary_key=True)
    Prescription_Id = models.ForeignKey(Doctor_drug_prescription,on_delete=models.CASCADE, null=True, blank=True)
    Booking_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Department = models.CharField(max_length=30)
    DoctorName = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Doctor_drug_docname_adminis')
    ProductCode = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Doctor_drug_med_code_adminis')
    Dosage = models.CharField(max_length=60)
    Route = models.CharField(max_length=60)
    FrequencyIssued = models.CharField(max_length=60)
    FrequencyMethod = models.CharField(max_length=60)
    Quantity = models.CharField(max_length=60)
    Issued_Date = models.DateField(auto_now_add=True)
    Complete_Date = models.DateField(auto_now=True)
    Complete_Time = models.TimeField(auto_now=True)
    Completed_Remarks = models.CharField(max_length=60, blank=True)
    Status = models.CharField(max_length=60)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,null=True,blank=True)
    CapturedBy = models.CharField(max_length=60, null=True)
    AdminisDose = models.CharField(max_length=60, blank=True)
    updated_at = models.DateTimeField(default=datetime.now)
    created_at = models.DateTimeField(default=datetime.now)

    class Meta:
        db_table = 'Ip_Nurse_Drug_Completed_Administration'
    def save(self, *args, **kwargs):
        if not self.Nurse_Prescription_Id:
            max_id = Ip_Nurse_Drug_Completed_Administration.objects.aggregate(max_id=Max('Nurse_Prescription_Id'))['max_id']
            self.Nurse_Prescription_Id = (max_id or 0) + 1
        super(Ip_Nurse_Drug_Completed_Administration, self).save(*args, **kwargs)


 
class   IP_Pharmacy_Billing_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='IP_Pharmacy_Billing_Doctor_Id',null=True,blank=True)
    Prescription_Id1= models.ForeignKey(Doctor_drug_prescription,on_delete=models.CASCADE,related_name='Doctor_drug_prescription_Prescription_Id',null=True,blank=True)
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='IP_Pharmacy_Billing_Patient_Id',null=True,blank=True)
    Register_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_Pharmacy_Billing_Reg_id',null=True,blank=True)
    PatientName=models.CharField(max_length=150,null=True,blank=True)
    PharmacyType = models.CharField(max_length=150,null=True,blank=True)
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.CharField(max_length=30)
    Total_Qty=models.CharField(max_length=30)
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    SGST_val= models.DecimalField(max_digits=10, decimal_places=2)
    CGST_val= models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank= True)
    Bill_Status=models.CharField(max_length=20)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Remarks = models.TextField(null=True,blank=True)
    Collectedby = models.CharField(max_length=150,null=True,blank=True)
    IsCollected = models.BooleanField(default=False)
    CollectedType = models.JSONField(null=True, blank=True)
    # IsRefunded =
 
    class meta:
        db_table='IP_Pharmacy_Billing_Table_Detials'


    def save(self, *args, **kwargs):    
        if not self.Billing_Invoice_No:
            
            if self.Billing_Type == 'FREE PHARMACY':
                Add_Invoice_Char = 'FOC/'
            elif self.Billing_Type == 'IP PHARMACY':
                Add_Invoice_Char = 'IP/'

            # Fetch the latest Billing_Invoice_No only for this series
            Max_Invoice_No_row = (
                IP_Pharmacy_Billing_Table_Detials.objects
                .exclude(created_by='system')
                .filter(Billing_Invoice_No__startswith=Add_Invoice_Char)
                .aggregate(max_id=Max('Billing_Invoice_No'))
            )['max_id']

            # Extract numeric part and increment
            if Max_Invoice_No_row:
                try:
                    # Extract the numeric part after the slash
                    numeric_part_str = Max_Invoice_No_row.split('/')[-1]
                    numeric_part = int(numeric_part_str)
                    numeric_part += 1
                except (ValueError, IndexError):
                    numeric_part = 1
            else:
                numeric_part = 1

            # Make sure the new invoice number is unique by checking it
            while IP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Invoice_No=f"{Add_Invoice_Char}{numeric_part}").exists():
                numeric_part += 1

            # Format with leading zeros (assuming 4 digits for the numeric part, adjust as necessary)
            self.Billing_Invoice_No = f'{Add_Invoice_Char}{numeric_part}'

        super(IP_Pharmacy_Billing_Table_Detials, self).save(*args, **kwargs)

 
    # def save(self, *args, **kwargs):    
    #     if not self.Billing_Invoice_No:
 
    #         if self.Billing_Type == 'FREE PHARMACY':
    #             Add_Invoice_Char = 'FOC/'
    #         elif self.Billing_Type == 'IP PHARMACY':
    #             Add_Invoice_Char = 'IP/'
       
 
    #         # Fetch the latest Billing_Invoice_No only for this series
    #         Max_Invoice_No_row = (
    #             IP_Pharmacy_Billing_Table_Detials.objects
    #             .exclude(created_by='system')
    #             .filter(Billing_Invoice_No__startswith=Add_Invoice_Char)
    #             .aggregate(max_id=Max('Billing_Invoice_No'))['max_id']
    #         )
 
    #         # Extract numeric part and increment
    #         if Max_Invoice_No_row:
    #             try:
    #                 numeric_part = int(str(Max_Invoice_No_row).split('/')[-1]) + 1
    #             except (ValueError, IndexError):
    #                 numeric_part = 1
    #         else:
    #             numeric_part = 1
 
    #         # Format with leading zeros
    #         self.Billing_Invoice_No = f'{Add_Invoice_Char}{numeric_part}'
 
    #     super(IP_Pharmacy_Billing_Table_Detials, self).save(*args, **kwargs)
 

 
    # def save(self, *args, **kwargs):    
    #     if not self.Billing_Invoice_No:
 
    #         if self.Billing_Type == 'FREE PHARMACY':
    #             Add_Invoice_Char = 'FOC/'
    #         elif self.Billing_Type == 'IP PHARMACY':
    #             Add_Invoice_Char = 'IP/'
       
 
    #         # Fetch the latest Billing_Invoice_No only for this series
    #         Max_Invoice_No_row = (
    #             IP_Pharmacy_Billing_Table_Detials.objects
    #             .exclude(created_by='system')
    #             .filter(Billing_Invoice_No__startswith=Add_Invoice_Char)
    #             .aggregate(max_id=Max('Billing_Invoice_No'))['max_id']
    #         )
 
    #         # Extract numeric part and increment
    #         if Max_Invoice_No_row:
    #             try:
    #                 numeric_part = int(str(Max_Invoice_No_row).split('/')[-1]) + 1
    #             except (ValueError, IndexError):
    #                 numeric_part = 1
    #         else:
    #             numeric_part = 1
 
    #         # Format with leading zeros
    #         self.Billing_Invoice_No = f'{Add_Invoice_Char}{numeric_part}'
 
    #     super(IP_Pharmacy_Billing_Table_Detials, self).save(*args, **kwargs)
 





class IP_BillingItem(models.Model):
    Billing = models.ForeignKey(IP_Pharmacy_Billing_Table_Detials, on_delete=models.CASCADE, related_name="IP_billing_items")
    ItemId = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Bill_item_item_id_ip')
    ItemName = models.CharField(max_length=100)
    Reimbursable = models.CharField(max_length=100)
    Reimbursable = models.CharField(max_length=100)
    Billing_Quantity = models.PositiveIntegerField()
    BatchNo = models.CharField(max_length=50)
    Exp_Date = models.DateField()
    Unit_Price = models.FloatField()
    Amount = models.FloatField()
    Total = models.FloatField()

    def __str__(self):
        return f"{self.ItemName} - Quantity: {self.Billing_Quantity}"


class IPPharmacyBillingReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        IP_Pharmacy_Billing_Table_Detials,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='IPPharmacy_receipt')
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50,null=True,blank=True)
    PhoneNumber = models.CharField(max_length=50,null=True,blank=True)
    Patient_Name = models.CharField(max_length=50,null=True,blank=True)
    TotalAmount = models.CharField(max_length=50)
    TotalPaidAmount = models.CharField(max_length=50)
    BalanceAmount = models.CharField(max_length=50)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.CharField(max_length=50)
    Billedby = models.CharField(max_length=50)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created
    Remarks = models.TextField(null=True,blank=True)
 
 
    class Meta:
        db_table = 'IPPharmacyBillingReceipt'
 
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = "RCPT/"

            # get latest row based on CreatedAt
            last_row = (
                IPPharmacyBillingReceipt.objects
                .exclude(Billedby='system')
                .order_by('-CreatedAt')
                .first()
            )

            if last_row and last_row.Voucher_Number:
                # Example: "RERT/1000"
                last_number_str = last_row.Voucher_Number.split('/')[1]
                numeric_part = int(last_number_str) + 1
            else:
                numeric_part = 1  # start from 1 if no previous rows exist

            self.Voucher_Number = f"{prefix}{numeric_part}"

        super(IPPharmacyBillingReceipt, self).save(*args, **kwargs)

    
 
class IP_Pharmacy_Billing_Payments(models.Model):
    Billing = models.ForeignKey(IPPharmacyBillingReceipt, on_delete=models.CASCADE, related_name='IP_billing_payments')
    Billpay_method = models.CharField(max_length=50)
    CardType = models.CharField(max_length=50, blank=True, null=True)
    BankName = models.CharField(max_length=100, blank=True, null=True)
    ChequeNo = models.CharField(max_length=100, blank=True, null=True)
    paidamount = models.FloatField()
    Additionalamount = models.FloatField(blank=True, null=True)
    transactionFee = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.Billpay_method} - {self.paidamount}"
    
class IPPharmacyBillingRefundReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        IPPharmacyBillingReceipt,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='IPPharmacy_Receipt_invoice_refund')
    BillInvoice_NO = models.ForeignKey(
        IP_Pharmacy_Billing_Table_Detials,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='IPPharmacy_Bill_invoice_refund')
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50,blank=True, null=True)
    PhoneNumber = models.CharField(max_length=50,blank=True, null=True)
    Patient_Name = models.CharField(max_length=50,blank=True, null=True)
    Quantity = models.CharField(max_length=50)
    TotalAmount = models.CharField(max_length=50)
    TotalPaidAmount = models.CharField(max_length=50)
    BalanceAmount = models.CharField(max_length=50)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.CharField(max_length=50)
    Billedby = models.CharField(max_length=50)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created
    Remarks = models.TextField(null=True,blank=True)
    Refundedby = models.CharField(max_length=150,null=True,blank=True)
    IsRefunded = models.BooleanField(default=False)
 
 
 
    class Meta:
        db_table = 'IPPharmacyBillingRefundReceipt'
 
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = "RERT/"

            # get latest row based on CreatedAt
            last_row = (
                IPPharmacyBillingRefundReceipt.objects
                .exclude(Billedby='system')
                .order_by('-CreatedAt')
                .first()
            )

            if last_row and last_row.Voucher_Number:
                # Example: "RERT/1000"
                last_number_str = last_row.Voucher_Number.split('/')[1]
                numeric_part = int(last_number_str) + 1
            else:
                numeric_part = 1  # start from 1 if no previous rows exist

            self.Voucher_Number = f"{prefix}{numeric_part}"

        super(IPPharmacyBillingRefundReceipt, self).save(*args, **kwargs)

    

class IP_Pharmacy_Payment_Refund_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(IPPharmacyBillingRefundReceipt,on_delete=models.CASCADE,related_name='IPPharmacy_Receipt_No_Payments_Refund')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000)
    TransactionId = models.CharField(max_length=50,default='')
    upiid = models.CharField(max_length=50,default='')
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)

    class Meta:
        db_table = 'IP_Pharmacy_Payment_Refund_Table_Detials'

    def __str__(self):
        return self.Payment_Type

 


class IP_BillingItem_Refund(models.Model):
    Billing = models.ForeignKey(IPPharmacyBillingRefundReceipt, on_delete=models.CASCADE, related_name="IP_BillingItems_Refund")
    ItemId = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Bill_item_item_id_ip_refund')
    ItemName = models.CharField(max_length=100)
    Reimbursable = models.CharField(max_length=100)
    Refund_Quantity = models.PositiveIntegerField()
    BatchNo = models.CharField(max_length=50)
    Exp_Date = models.DateField(null=True)
    Unit_Price = models.FloatField()
    Amount = models.FloatField()
    Total = models.FloatField()
    class meta:
        db_table='IP_BillingItem_Refund'

    def __str__(self):
        return f"{self.ItemName} - Quantity: {self.Billing_Quantity}"



# class OP_Pharmacy_Billing_Table_Detials(models.Model):
#     Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
#     Billing_Date=models.DateField()
#     Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_Doctor_Id',null=True,blank=True)
#     Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_Patient_Id',null=True,blank=True)
#     Register_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_RegistrationId',null=True,blank=True)
#     Billing_Type=models.CharField(max_length=150)
#     Select_Discount=models.CharField(max_length=50)
#     Discount_Type=models.CharField(max_length=30)
#     Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     Total_Items=models.CharField(max_length=30)
#     Total_Qty=models.CharField(max_length=30)
#     Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     SGST_val= models.DecimalField(max_digits=10, decimal_places=2)
#     CGST_val= models.DecimalField(max_digits=10, decimal_places=2)
#     Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
#     Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
#     Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank= True)
#     Bill_Status=models.CharField(max_length=20)
#     created_by = models.CharField(max_length=100)
#     updated_by = models.CharField(max_length=30,default='')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     Remarks = models.TextField(null=True,blank=True)


#     class meta:
#         db_table='OP_Pharmacy_Billing_Table_Detials'

#     def save(self, *args, **kwargs):
#         if not self.Billing_Invoice_No:
#             Add_Invoice_Char = 'OP'
#             today = timezone.now()
#             year = today.strftime('%y')   # last 2 digits of year
#             month = today.strftime('%m')  # month
#             day = today.strftime('%d')    # day

#             # Get the latest invoice of today
#             Max_Invoice_No_row = OP_Pharmacy_Billing_Table_Detials.objects.filter(
#                 created_at__date=today.date()
#             ).exclude(created_by='system').aggregate(max_id=Max('Billing_Invoice_No'))['max_id']

#             if Max_Invoice_No_row:
#                 try:
#                     numeric_part = int(Max_Invoice_No_row.split('/')[-1]) + 1
#                 except:
#                     numeric_part = 1
#             else:
#                 numeric_part = 1

#             # Format invoice number: OP/yy/mm/dd/00001
#             self.Billing_Invoice_No = f'{Add_Invoice_Char}/{year}/{month}/{day}/{numeric_part:05}'

#         super(OP_Pharmacy_Billing_Table_Detials, self).save(*args, **kwargs)


class OP_Pharmacy_Billing_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Bill_No = models.CharField(max_length=30,default='')
    Patient_name=models.CharField(max_length=255,null=True,blank=True)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_Doctor_Id',null=True,blank=True)
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_Patient_Id',null=True,blank=True)
    Register_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_RegistrationId',null=True,blank=True)
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.CharField(max_length=30)
    Total_Qty=models.CharField(max_length=30)
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    SGST_val= models.DecimalField(max_digits=10, decimal_places=2)
    CGST_val= models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank= True)
    Bill_Status=models.CharField(max_length=20)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Remarks = models.TextField(null=True,blank=True)
    Collectedby = models.CharField(max_length=150,null=True,blank=True)
    IsCollected = models.BooleanField(default=False)
    CollectedType = models.JSONField(null=True, blank=True)


    class meta:
        db_table='OP_Pharmacy_Billing_Table_Detials'

    def save(self, *args, **kwargs):
        with transaction.atomic():

            # ================= Invoice No =================
            if not self.Billing_Invoice_No:
                prefix = "OP/"

                last_invoice = (
                    OP_Pharmacy_Billing_Table_Detials.objects
                    .select_for_update()
                    .filter(Billing_Invoice_No__startswith=prefix)
                    .annotate(
                        num=Cast(
                            Substr('Billing_Invoice_No', len(prefix) + 1),
                            IntegerField()
                        )
                    )
                    .order_by('-num')
                    .first()
                )

                next_invoice = last_invoice.num + 1 if last_invoice else 1
                self.Billing_Invoice_No = f"{prefix}{next_invoice}"

            # ================= Bill No =================
            if not self.Bill_No:
                prefix = "BI/"

                last_bill = (
                    OP_Pharmacy_Billing_Table_Detials.objects
                    .select_for_update()
                    .filter(Bill_No__startswith=prefix)
                    .annotate(
                        num=Cast(
                            Substr('Bill_No', len(prefix) + 1),
                            IntegerField()
                        )
                    )
                    .order_by('-num')
                    .first()
                )

                next_bill = last_bill.num + 1 if last_bill else 1
                self.Bill_No = f"{prefix}{next_bill}"

            super().save(*args, **kwargs)  
        



class OP_Pharmacy_Billing_Table_Detials_optical(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Patient_name=models.CharField(max_length=255,null=True,blank=True)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_optical_Doctor_Id',null=True,blank=True)
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_optical_Patient_Id',null=True,blank=True)
    Register_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_Pharmacy_Billing_optical_RegistrationId',null=True,blank=True)
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.CharField(max_length=30)
    Total_Qty=models.CharField(max_length=30)
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    SGST_val= models.DecimalField(max_digits=10, decimal_places=2)
    CGST_val= models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank= True)
    Bill_Status=models.CharField(max_length=20)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Remarks = models.TextField(null=True,blank=True)
    Collectedby = models.CharField(max_length=150,null=True,blank=True)
    IsCollected = models.BooleanField(default=False)
    CollectedType = models.CharField(max_length=150,null=True,blank=True)


    class meta:
        db_table='OP_Pharmacy_Billing_Table_Detials_optical'



    def save(self, *args, **kwargs):
        if not self.Billing_Invoice_No:
            Add_Invoice_Char = 'OP/'

            try:
                with transaction.atomic():
                    # Lock table to prevent race condition
                    last_invoice_row = (
                        OP_Pharmacy_Billing_Table_Detials_optical.objects
                        .select_for_update()
                        .exclude(created_by='system')
                        .filter(Billing_Invoice_No__startswith=Add_Invoice_Char)
                        .order_by('-created_at')
                        .first()
                    )

                    if last_invoice_row:
                        try:
                            last_invoice = last_invoice_row.Billing_Invoice_No
                            numeric_part = int(last_invoice.split('/')[-1]) + 1
                        except (ValueError, IndexError, AttributeError):
                            numeric_part = 1
                    else:
                        numeric_part = 1

                    self.Billing_Invoice_No = f"{Add_Invoice_Char}{numeric_part}"

                    super(OP_Pharmacy_Billing_Table_Detials_optical, self).save(*args, **kwargs)

            except Exception as e:
                # Handle any DB error here
                print("Error saving invoice:", e)
        else:
            super(OP_Pharmacy_Billing_Table_Detials_optical, self).save(*args, **kwargs)




class OP_BillingItem(models.Model):
    Billing = models.ForeignKey(OP_Pharmacy_Billing_Table_Detials, on_delete=models.CASCADE, related_name="OP_billing_items")
    ItemId = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Bill_item_item_id_op')
    ItemName = models.CharField(max_length=100)
    Billing_Quantity = models.PositiveIntegerField()
    BatchNo = models.CharField(max_length=50)
    Exp_Date = models.DateField()
    Unit_Price = models.FloatField()
    Amount = models.FloatField()
    Total = models.FloatField()

    def __str__(self):
        return f"{self.ItemName} - Quantity: {self.Billing_Quantity}"

   


class OP_BillingItemoptical(models.Model):
    Billing = models.ForeignKey(OP_Pharmacy_Billing_Table_Detials_optical, on_delete=models.CASCADE, related_name="OP_billing_items_optical")
    ItemId = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Bill_item_item_id_op_optical')
    ItemName = models.CharField(max_length=100)
    Billing_Quantity = models.PositiveIntegerField()
    BatchNo = models.CharField(max_length=50)
    Exp_Date = models.DateField(null=True,blank=True)
    Unit_Price = models.FloatField()
    Amount = models.FloatField()
    Total = models.FloatField()
    class Meta:
        db_table = 'OP_BillingItemoptical'
    def __str__(self):
        return f"{self.ItemName} - Quantity: {self.Billing_Quantity}"

   
    
class OPPharmacyBillingReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        OP_Pharmacy_Billing_Table_Detials, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Pharmacy_receipt') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50,null=True,blank=True)
    PhoneNumber = models.CharField(max_length=50,null=True,blank=True)
    Patient_Name = models.CharField(max_length=50,null=True,blank=True)
    TotalAmount = models.CharField(max_length=50)
    TotalPaidAmount = models.CharField(max_length=50)
    BalanceAmount = models.CharField(max_length=50)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.CharField(max_length=50)
    Billedby = models.CharField(max_length=50)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created

    class Meta:
        db_table = 'OPPharmacyBillingReceipt'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = "RCPT/"

            # get latest row based on CreatedAt
            last_row = (
                OPPharmacyBillingReceipt.objects
                .exclude(Billedby='system')
                .order_by('-CreatedAt')
                .first()
            )

            if last_row and last_row.Voucher_Number:
                # Example: "RERT/1000"
                last_number_str = last_row.Voucher_Number.split('/')[1]
                numeric_part = int(last_number_str) + 1
            else:
                numeric_part = 1  # start from 1 if no previous rows exist

            self.Voucher_Number = f"{prefix}{numeric_part}"

        super(OPPharmacyBillingReceipt, self).save(*args, **kwargs)

    
    
class OPPharmacyBillingReceiptoptical(models.Model):
    Invoice_NO = models.ForeignKey(
        OP_Pharmacy_Billing_Table_Detials_optical, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Pharmacy_receipt_optical') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50,null=True,blank=True)
    PhoneNumber = models.CharField(max_length=50,null=True,blank=True)
    Patient_Name = models.CharField(max_length=50,null=True,blank=True)
    TotalAmount = models.CharField(max_length=50)
    TotalPaidAmount = models.CharField(max_length=50)
    BalanceAmount = models.CharField(max_length=50)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.CharField(max_length=50)
    Billedby = models.CharField(max_length=50)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created

    class Meta:
        db_table = 'OPPharmacyBillingReceiptoptical'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = "RCPT/"

            # get latest row based on CreatedAt
            last_row = (
                OPPharmacyBillingReceiptoptical.objects
                .exclude(Billedby='system')
                .order_by('-CreatedAt')
                .first()
            )

            if last_row and last_row.Voucher_Number:
                # Example: "RERT/1000"
                last_number_str = last_row.Voucher_Number.split('/')[1]
                numeric_part = int(last_number_str) + 1
            else:
                numeric_part = 1  # start from 1 if no previous rows exist

            self.Voucher_Number = f"{prefix}{numeric_part}"

        super(OPPharmacyBillingReceiptoptical, self).save(*args, **kwargs)

    



class OP_Pharmacy_Billing_Payments(models.Model):
    Billing = models.ForeignKey(OPPharmacyBillingReceipt, on_delete=models.CASCADE, related_name='billing_payments')
    Billpay_method = models.CharField(max_length=50)
    CardType = models.CharField(max_length=50, blank=True, null=True)
    BankName = models.CharField(max_length=100, blank=True, null=True)
    ChequeNo = models.CharField(max_length=100, blank=True, null=True)
    paidamount = models.FloatField()
    Additionalamount = models.FloatField(blank=True, null=True)
    transactionFee = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.Billpay_method} - {self.paidamount}"


class OP_Pharmacy_Billing_Payments_optical(models.Model):
    Billing = models.ForeignKey(OPPharmacyBillingReceiptoptical, on_delete=models.CASCADE, related_name='billing_payments_optical')
    Billpay_method = models.CharField(max_length=50)
    CardType = models.CharField(max_length=50, blank=True, null=True)
    BankName = models.CharField(max_length=100, blank=True, null=True)
    ChequeNo = models.CharField(max_length=100, blank=True, null=True)
    paidamount = models.FloatField()
    Additionalamount = models.FloatField(blank=True, null=True)
    transactionFee = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table ='OP_Pharmacy_Billing_Payments_optical'
    def __str__(self):
        return f"{self.Billpay_method} - {self.paidamount}"


class OPPharmacyBillingRefundReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        OPPharmacyBillingReceipt, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Pharmacy_Receipt_invoice_refund') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50,blank=True, null=True)
    PhoneNumber = models.CharField(max_length=50,blank=True, null=True)
    Patient_Name = models.CharField(max_length=50,blank=True, null=True)
    TotalAmount = models.CharField(max_length=50)
    TotalPaidAmount = models.CharField(max_length=50)
    BalanceAmount = models.CharField(max_length=50)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.CharField(max_length=50)
    Remaining_Items = models.JSONField(default=list, null=True, blank=True)
    Billedby = models.CharField(max_length=50)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created
    Refundedby = models.CharField(max_length=150,null=True,blank=True)
    IsRefunded = models.BooleanField(default=False)
    RefundType = models.CharField(max_length=150,null=True,blank=True)

    class Meta:
        db_table = 'OPPharmacyBillingRefundReceipt'
    
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = "RERT/"

            # get latest row based on CreatedAt
            last_row = (
                OPPharmacyBillingRefundReceipt.objects
                .exclude(Billedby='system')
                .order_by('-CreatedAt')
                .first()
            )

            if last_row and last_row.Voucher_Number:
                # Example: "RERT/1000"
                last_number_str = last_row.Voucher_Number.split('/')[1]
                numeric_part = int(last_number_str) + 1
            else:
                numeric_part = 1  # start from 1 if no previous rows exist

            self.Voucher_Number = f"{prefix}{numeric_part}"

        super(OPPharmacyBillingRefundReceipt, self).save(*args, **kwargs)

    

class OP_Pharmacy_Payment_Refund_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(OPPharmacyBillingRefundReceipt,on_delete=models.CASCADE,related_name='Pharmacy_Receipt_No_Payments_Refund')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000)
    TransactionId = models.CharField(max_length=50,default='')
    upiid = models.CharField(max_length=50,default='')
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)

    class Meta:
        db_table = 'OP_Pharmacy_Payment_Refund_Table_Detials'

    def __str__(self):
        return self.Payment_Type

 
    
class OP_Pharmacy_Walkin_Billing_Table_Detials(models.Model):
    PatientName = models.CharField(max_length=100)
    Billing_Invoice_No = models.CharField(primary_key=True, max_length=30)
    PatientId = models.CharField(max_length=30,null=True,blank=True)
    Billing_Date = models.DateField(auto_now=True)
    Patient_Category = models.CharField(max_length=100,null=True,blank=True,default='')
    Doctor_Id = models.CharField(max_length=30,null=True,blank=True)
    Billing_Type = models.CharField(max_length=150)
    Select_Discount = models.CharField(max_length=50,null=True,blank=True)
    Discount_Type = models.CharField(max_length=30,null=True,blank=True)
    Discount_Amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    Total_Items = models.CharField(max_length=30)
    Total_Qty = models.CharField(max_length=30)
    Total_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    SGST_val = models.DecimalField(max_digits=10, decimal_places=2)
    CGST_val = models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount = models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off = models.DecimalField(max_digits=10, decimal_places=2,default=0.00)
    Paid_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank=True)
    Bill_Status = models.CharField(max_length=20)
    Pharmacy_Type = models.CharField(max_length=100,null=True,blank=True,default='')
    created_by = models.CharField(max_length=100,null=True,blank=True)
    updated_by = models.CharField(max_length=30, default='',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:  # Corrected typo
        db_table = 'OP_Pharmacy_Billing_Table_Detials'

    # def save(self, *args, **kwargs):
    #     if not self.Billing_Invoice_No:
    #         Add_Invoice_Char = 'PHAOPDR/'
    #         Max_Invoice_No_row = OP_Pharmacy_Walkin_Billing_Table_Detials.objects.exclude(
    #             created_by='system'
    #         ).aggregate(max_id=Max('Billing_Invoice_No'))['max_id']

    #         if Max_Invoice_No_row:
    #             numeric_part = int(str(Max_Invoice_No_row).split('/')[-1]) + 1
    #         else:
    #             numeric_part = 1

    #         self.Billing_Invoice_No = f'{Add_Invoice_Char}{numeric_part:04}'

    #     if not self.PatientId:
    #         hospital_details = Hospital_Detials.objects.first()
    #         if not hospital_details:
    #             raise ValueError("No Hospital_Details records found.")

    #         clinic_name = hospital_details.Hospital_Name[:3].upper()
    #         today_date = datetime.now().strftime('%y%m%d')
    #         prefix = f'{clinic_name}{today_date}'

    #         max_patient_id = Patient_Detials.objects.aggregate(max_id=Max('PatientId'))['max_id']
    #         if max_patient_id:
    #             numeric_part = int(max_patient_id[-4:]) + 1
    #         else:
    #             numeric_part = 1
    #         self.PatientId = f'{prefix}{numeric_part:04}'
    #     super(OP_Pharmacy_Walkin_Billing_Table_Detials, self).save(*args, **kwargs)  # Corrected model name

    def save(self, *args, **kwargs):    
        if not self.Billing_Invoice_No:

            if self.Pharmacy_Type == 'IPWALKING':
                Add_Invoice_Char = 'WIP/'
            elif self.Pharmacy_Type == 'OPWALKING':
                Add_Invoice_Char = 'WOP/'

            # Fetch the latest Billing_Invoice_No only for this series
            Max_Invoice_No_row = (
                OP_Pharmacy_Walkin_Billing_Table_Detials.objects
                .exclude(created_by='system')
                .order_by('-created_at').first()
            )

            print(Max_Invoice_No_row.Billing_Invoice_No,'Max_Invoice_No_row')

            # Extract numeric part and increment
            print(Max_Invoice_No_row.Billing_Invoice_No, 'Max_Invoice_No_row')

            if Max_Invoice_No_row:
                try:
                    last_invoice = Max_Invoice_No_row.Billing_Invoice_No  # access field directly
                    print(last_invoice, 'last invoice value')
                    numeric_part = int(last_invoice.split('/')[-1]) + 1
                except (ValueError, IndexError, AttributeError):
                    numeric_part = 1
            else:
                numeric_part = 1

            print(Add_Invoice_Char, numeric_part, 'Add_Invoice_Char')

            self.Billing_Invoice_No = f'{Add_Invoice_Char}{numeric_part}'


        if not self.PatientId:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")

            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}'

            max_patient_id = Patient_Detials.objects.aggregate(max_id=Max('PatientId'))['max_id']
            if max_patient_id:
                numeric_part = int(max_patient_id[-4:]) + 1
            else:
                numeric_part = 1
            self.PatientId = f'{prefix}{numeric_part:04}'
        super(OP_Pharmacy_Walkin_Billing_Table_Detials, self).save(*args, **kwargs)  # Corrected model name



class OP_Walkin_BillingItem(models.Model):
    Billing = models.ForeignKey(OP_Pharmacy_Walkin_Billing_Table_Detials, on_delete=models.CASCADE, related_name="OP_Walkin_billing_items")
    ItemId = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Bill_item_item_id_walkin')
    ItemName = models.CharField(max_length=100)
    Billing_Quantity = models.PositiveIntegerField()
    BatchNo = models.CharField(max_length=50)
    Exp_Date = models.DateField()
    Unit_Price = models.FloatField()
    Amount = models.FloatField()
    Total = models.FloatField()

    def __str__(self):
        return f"{self.ItemName} - Quantity: {self.Billing_Quantity}"

class OP_Walkin_Pharmacy_Billing_Payments(models.Model):
    Billing = models.ForeignKey(OP_Pharmacy_Walkin_Billing_Table_Detials, on_delete=models.CASCADE, related_name='billing_payments_Walkin')
    Billpay_method = models.CharField(max_length=50)
    CardType = models.CharField(max_length=50, blank=True, null=True)
    BankName = models.CharField(max_length=100, blank=True, null=True)
    ChequeNo = models.CharField(max_length=100, blank=True, null=True)
    paidamount = models.FloatField()
    Additionalamount = models.FloatField(blank=True, null=True)
    transactionFee = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.Billpay_method} - {self.paidamount}"
    
class WalkinPharmacyBillingRefundReceipt(models.Model):

    BillInvoice_NO = models.ForeignKey(
        OP_Pharmacy_Walkin_Billing_Table_Detials, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='WalkinPharmacy_Bill_invoice_refund')
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50,null=True,blank=True)
    PhoneNumber = models.CharField(max_length=50,null=True,blank=True)
    Patient_Name = models.CharField(max_length=50,null=True,blank=True)
    Quantity = models.CharField(max_length=50,null=True,blank=True)
    TotalAmount = models.CharField(max_length=50,null=True,blank=True)
    TotalPaidAmount = models.CharField(max_length=50,null=True,blank=True)
    BalanceAmount = models.CharField(max_length=50,null=True,blank=True)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.CharField(max_length=50,null=True,blank=True)
    Billedby = models.CharField(max_length=50,null=True,blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created
    Remarks = models.TextField(null=True,blank=True)



    class Meta:
        db_table = 'WalkinPharmacyBillingRefundReceipt'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            Receipt_Invoice_Char = 'RERT/'
            Max_Invoice_No_row = WalkinPharmacyBillingRefundReceipt.objects.exclude(Billedby='system').aggregate(max_id=Max('Voucher_Number'))['max_id']
            Max_Invoice_No = Max_Invoice_No_row if Max_Invoice_No_row else None
            numeric_part = int(str(Max_Invoice_No)[5:]) + 1 if Max_Invoice_No else 1
            self.Voucher_Number = f'{Receipt_Invoice_Char}{numeric_part:04}'
        
        super(WalkinPharmacyBillingRefundReceipt, self).save(*args, **kwargs)

class Walkin_Pharmacy_Payment_Refund_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(WalkinPharmacyBillingRefundReceipt,on_delete=models.CASCADE,related_name='WalkinPharmacy_Receipt_No_Payments_Refund')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000)
    TransactionId = models.CharField(max_length=50,default='')
    upiid = models.CharField(max_length=50,default='')
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)

    class Meta:
        db_table = 'Walkin_Pharmacy_Payment_Refund_Table_Detials'

    def __str__(self):
        return self.Payment_Type

class Walkin_BillingItem_Refund(models.Model):
    Billing = models.ForeignKey(WalkinPharmacyBillingRefundReceipt, on_delete=models.CASCADE, related_name="Walkin_BillingItems_Refund")
    ItemId = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='Bill_item_item_id_walkin_refund')
    ItemName = models.CharField(max_length=100)
    Reimbursable = models.CharField(max_length=100)
    Refund_Quantity = models.PositiveIntegerField()
    BatchNo = models.CharField(max_length=50)
    Exp_Date = models.DateField()
    Unit_Price = models.FloatField()
    Amount = models.FloatField()
    Total = models.FloatField()
    class meta:
        db_table='Walkin_BillingItem_Refund'

    def __str__(self):
        return f"{self.ItemName}"

class PrintJob(models.Model):
    job_id = models.AutoField(primary_key=True)
    system_name = models.CharField(max_length=100)
    bill_text = models.TextField()
    status = models.CharField(max_length=20, default="pending")  # pending, printed
    created_at = models.DateTimeField(auto_now_add=True)
 
    class meta:
        db_table='Print_Job'
 
 
class AdvanceOptical(models.Model):
    Advance_Id = models.CharField(max_length=150,primary_key=True)
    Patient_Name = models.CharField(max_length=150,blank=True, null=True)
    Patient_Phone_No= models.CharField(max_length=150,blank=True, null=True)
    Patient_Phone_age= models.CharField(max_length=150,blank=True, null=True)
    Patient_Id = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,blank=True, null=True)
    Advance_Amount = models.DecimalField(max_digits=30, decimal_places=2)
    Status = models.BooleanField(default=True)
    Advance_Status = models.CharField(max_length=150,blank=True, null=True,default='Hold')

    class meta:
        db_table = 'AdvanceOptical'


    def save(self, *args, **kwargs):
        if not self.Advance_Id:
            year = datetime.now().strftime('%y')  # 25

            last_record = (
                AdvanceOptical.objects
                .filter(Advance_Id__startswith=f'ADV-{year}')
                .order_by('-Advance_Id')
                .first()
            )

            if last_record:
                last_no = int(last_record.Advance_Id.split('-')[-1])
                new_no = last_no + 1
            else:
                new_no = 1

            self.Advance_Id = f'ADV-{year}-{new_no:05d}'

        super().save(*args, **kwargs)    