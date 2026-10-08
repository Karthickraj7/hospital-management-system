from django.db import models
from django.db.models import Max
from Masters.models import *
# from Masters.models import (GenericName_Master_Details, CompanyName_mfg_Master_Details, ProductType_Master_Details, Product_Group_Master_Details, Pack_Type_Master_Details, Location_Detials, Clinic_Detials, Inventory_Location_Master_Detials, WardType_Master_Detials)
from django.utils import timezone
from datetime import timedelta
from Finance.models import *



class Product_field_Details(models.Model):
    field_Name=models.TextField()
    field_Order=models.IntegerField()
    Status=models.BooleanField(default=True)
    Created_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Product_field_Details'
    
    def _str_(self):
        return(self.field_Name)



class Product_Category_Product_Details(models.Model):
    ProductCategory_Name=models.TextField()
    Status=models.BooleanField(default=True)
    Product_fields= models.ManyToManyField(Product_field_Details,related_name='product_category_product_fields')
    LedgerName=models.CharField(max_length=200,unique=True)
    LedgerGroupName=models.ForeignKey('Finance.Finance_GroupMaster_Detailes',on_delete=models.CASCADE,related_name='Product_Category_GroupName', null=True, blank=True)
    OpeningBalance=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    DebitOrCredit=models.CharField(max_length=15, null=True, blank=True, default=None)
    Created_by=models.CharField(max_length=100, null=True, blank=True)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_by=models.CharField(max_length=70)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Product_Category_Product_Details'
    
    def _str_(self):
        return(self.ProductCategory_Name)



class SubCategory_Detailes(models.Model):
    SubCategory_Id=models.AutoField(primary_key=True)
    ProductCategoryId=models.ForeignKey(Product_Category_Product_Details,on_delete=models.CASCADE,related_name='ProductCategoryId')
    SubCategoryName=models.CharField(max_length=150)
    Status=models.BooleanField(default=True)
    Created_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'SubCategory_Detailes'
    def __str__(self):
        return(self.SubCategoryName)
    


class UnitOfMeasurement(models.Model):
    Unit_Id = models.AutoField(primary_key=True)
    Unit_Name = models.CharField(max_length=70)  # Example: "Liter", "Kilogram"
    Unit_Symbol = models.CharField(max_length=10)  # Example: "L", "kg"
    Unit_Type = models.CharField(max_length=50)  # Example: "Volume", "Mass", "Length"
    Base_Unit = models.CharField(max_length=50)  # Example: "L", "kg", "m"
    Conversion_Factor = models.DecimalField(max_digits=10, decimal_places=6)  # Factor to convert to the base unit
    Difference_Description = models.TextField()  # Difference description for the units
    Status = models.BooleanField(default=True)
    Created_by = models.CharField(max_length=100)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'UnitOfMeasurement'
    
    def __str__(self):
        return f"{self.Unit_Name} ({self.Unit_Symbol})"



class ProductMaster_Drug_Segment_Details(models.Model):
    Segment=models.TextField()
    Description=models.TextField()
    Status=models.BooleanField(default=True)
    Created_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ProductMaster_Drug_Segment_Details'
       

    def __str__(self):
        return (self.Segment)
   

class Product_Master_All_Category_Details(models.Model):
    ItemName=models.TextField()
    ProductCategory=models.ForeignKey(Product_Category_Product_Details,on_delete=models.CASCADE,related_name='ProductMaster_Product_Category',null=True,blank=True,default=None)
    SubCategory=models.ForeignKey(SubCategory_Detailes,on_delete=models.CASCADE,related_name='ProductMaster_SubCategory',null=True,blank=True,default=None)
    GenericName=models.ForeignKey('Masters.GenericName_Master_Details',on_delete=models.CASCADE,related_name='ProductMaster_GenericName',null=True,blank=True,default=None)
    CompanyName=models.ForeignKey('Masters.CompanyName_mfg_Master_Details',on_delete=models.CASCADE,related_name='ProductMaster_CompanyName',null=True,blank=True,default=None)
    HSNCode=models.CharField(max_length=25, null=True, blank=True, default=None)
    ProductType=models.ForeignKey('Masters.ProductType_Master_Details',on_delete=models.CASCADE,related_name='Product_master_ProductType',null=True,blank=True,default=None)
    ProductGroup=models.ForeignKey('Masters.Product_Group_Master_Details',on_delete=models.CASCADE,related_name='Product_master_ProductGroup',null=True,blank=True,default=None)
    Strength=models.IntegerField(default=None,null=True,blank=True)
    StrengthType=models.CharField(max_length=25,default=None,null=True,blank=True)
    Volume=models.IntegerField(default=None,null=True,blank=True)
    VolumeType=models.ForeignKey(UnitOfMeasurement,on_delete=models.CASCADE,related_name='Product_master_Volume_Type',null=True,blank=True,default=None)
    PackType=models.ForeignKey('Masters.Pack_Type_Master_Details',on_delete=models.CASCADE,related_name='Product_master_PackType',null=True,blank=True,default=None)
    PackQty=models.IntegerField(default=1,null=True,blank=True)
    MinimumQty=models.IntegerField(default=None,null=True,blank=True)
    MaximumQty=models.IntegerField(default=None,null=True,blank=True)
    ReorderLevel=models.IntegerField(default=None,null=True,blank=True)
    IsReUsable=models.BooleanField(default=False)
    ReUsableTimes=models.IntegerField(default=None,null=True,blank=True)
    IsSellable=models.BooleanField(default=False)
    LeastSellableUnit=models.IntegerField(default=1,null=True,blank=True)
    IsPartialUse=models.BooleanField(default=False)
    IsPerishable=models.BooleanField(default=False)
    PerishableDuration=models.IntegerField(default=None,null=True,blank=True)
    PerishableDurationType=models.CharField(max_length=30,default=None,null=True,blank=True)
    Is_Manufacture_Date_Available=models.BooleanField(default=False)
    Is_Expiry_Date_Available=models.BooleanField(default=False)
    Is_Serial_No_Available_for_each_quantity=models.BooleanField(default=False)
    DrugSegment=models.ForeignKey(ProductMaster_Drug_Segment_Details,related_name='Product_Master_Drug_Segment',on_delete=models.CASCADE, null=True, blank=True)    
    ProductDescription = models.TextField(blank=True, default='', null=True)
    GST_Type = models.CharField(max_length=20, blank=True, null=True,default="") 
    GST_Value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,default=0)
    SGST = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,default=0)
    CGST = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,default=0)
    Status=models.BooleanField(default=True)
    Is_Optical=models.BooleanField(default=False)
    Is_GEN=models.BooleanField(default=False)
    created_by=models.CharField(max_length=70, default='Admin')
    Department = models.CharField(max_length=100, default=None, null=True, blank=True)
    Doctorname = models.CharField(max_length=200, default=None, null=True, blank=True)
    Updated_by=models.CharField(max_length=70)
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Product_Master_All_Category_Details'
       

    def __str__(self):
        return (self.ItemName)
   


#  supplier Detilasss---------

class Supplier_Master_Details(models.Model): 
    Supplier_Id=models.CharField(primary_key=True,max_length=30)
    Supplier_Name=models.CharField(max_length=255)
    Supplier_Type=models.CharField(max_length=50, null=True, blank=True)
    Contact_Person=models.CharField(max_length=200, null=True, blank=True)
    Contact_Number=models.CharField(max_length=200, null=True, blank=True)
    Email_Address=models.CharField(max_length=100, null=True, blank=True)
    Address=models.TextField(null=True, blank=True)
    StateLocation = models.CharField(max_length=200, null=True, blank=True)
    Registration_Number=models.CharField(max_length=30, null=True, blank=True)
    GST_Number=models.CharField(max_length=20, null=True, blank=True)
    PAN_Number=models.CharField(max_length=20,  null=True, blank=True)
    Druglicense_Number=models.TextField(null=True, blank=True)
    Druglicense_Number_Two=models.TextField(null=True, blank=True)
    Payment_Terms = models.IntegerField(null=True, blank=True)  
    Credit_Limit = models.IntegerField(null=True, blank=True)  
    DeliveryDuration = models.IntegerField(null=True, blank=True) 
    Status=models.BooleanField(default=True)
    Is_Optical=models.BooleanField(default=False)
    Is_GEN=models.BooleanField(default=False) 
    Notes=models.TextField(null=True, blank=True)
    LedgerName=models.CharField(max_length=200)
    LedgerGroupName=models.ForeignKey('Finance.Finance_GroupMaster_Detailes',on_delete=models.CASCADE,related_name='Supplier_Master_Details', null=True, blank=True)
    OpeningBalance=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    DebitOrCredit=models.CharField(max_length=15, null=True, blank=True, default=None)
    File_Attachment=models.BinaryField(null=True, blank=True,default=None)
    created_by=models.CharField(max_length=100,default='Admin')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='Supplier_Master_Details'
    
    def __str__(self):
        return (self.Supplier_Name)


    def save(self,*args,**kwargs):
        if not self.Supplier_Id:

            Supplier_Key_name='SUPP'

            max_Supplier_id_row=Supplier_Master_Details.objects.exclude(created_by="system").aggregate(max_id=Max('Supplier_Id'))['max_id']

            max_Supplier_id=max_Supplier_id_row if max_Supplier_id_row else None

            numeric_part = int(str(max_Supplier_id)[4:]) + 1 if max_Supplier_id else 1

            self.Supplier_Id=f'{Supplier_Key_name}{numeric_part:04}'
        
        super(Supplier_Master_Details,self).save(*args, **kwargs)


class Supplier_Bank_Details(models.Model):
    Supplier_Detials=models.ForeignKey(Supplier_Master_Details,on_delete=models.CASCADE,related_name='Bank_Supp_name')
    Bank_Name=models.CharField(max_length=100, null=True, blank=True)
    Account_Number=models.CharField(max_length=50, null=True, blank=True)
    IFSCCode=models.CharField(max_length=30, null=True, blank=True)
    BankBranch=models.CharField(max_length=100, null=True, blank=True)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

    class Meta :
        db_table='Supplier_Bank_Details'
    def __str__(self):
        return (self.Bank_Name)

class Supplier_Product_Details(models.Model):
    Supplier_Detials=models.ForeignKey(Supplier_Master_Details,on_delete=models.CASCADE,related_name='Supplier_detials_for_product', null=True, blank=True, default=None)
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details, on_delete=models.CASCADE,null=True, blank=True, default=None) 
    Status=models.BooleanField(default=True)
    created_by = models.CharField(max_length=15, null=True, blank=True, default=None)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='Supplier_Product_Details'
    


class Supplier_Product_Amount_Details(models.Model):
    Supplier_detials=models.ForeignKey(Supplier_Product_Details,on_delete=models.CASCADE,related_name='Supplier_Product_Details_Amount', null=True, blank=True, default=None)
    PurchaseRateBeforeGST=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    GST = models.CharField(max_length=10, null=True, blank=True)
    PurchaseRateAfterGST=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    MRP=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    EditType = models.CharField(max_length=25, null=True, blank=True)
    created_by = models.CharField(max_length=15, null=True, blank=True)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='Supplier_Product_Amount_Details'
    






# -------------------------------PO -------------------------------



class Purchase_Order_Details(models.Model):
    PurchaseOrder_Number=models.CharField(primary_key=True,max_length=20)
    Supplier_Id=models.ForeignKey(Supplier_Master_Details,on_delete=models.CASCADE,related_name='PO_SupplierID', null=True,  blank=True, default=None)
    Order_Date=models.DateField()
    Delivery_Expected_Date = models.DateField(null=True, blank=True)
    Billing_Location=models.ForeignKey('Masters.Location_Detials',on_delete=models.CASCADE,related_name='PO_BillLocation', null=True,  blank=True, default=None)
    Billing_Address=models.ForeignKey('Masters.Clinic_Detials',on_delete=models.CASCADE,related_name='PO_BillAddress', null=True,  blank=True, default=None)
    Shipping_Location=models.ForeignKey('Masters.Location_Detials',on_delete=models.CASCADE,related_name='PO_ShippLocation', null=True,  blank=True, default=None)
    Shipping_Address=models.ForeignKey('Masters.Clinic_Detials',on_delete=models.CASCADE,related_name='PO_ShippAddress', null=True,  blank=True, default=None)
    Total_Order_Value=models.DecimalField(max_digits=10,decimal_places=2, null=True, blank=True, default=None)
    PO_Status=models.CharField(max_length=30,default='Waiting For Approve')
    Create_by=models.CharField(max_length=100, default='Admin')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Purchase_Order_Details'
   
    def _str_(self):
        return (self.PurchaseOrder_Number)
 
    def save(self,*args,**kwargs):
        if not self.pk:
 
            PO_key_Name='PONO'
 
            max_PO_id_row=Purchase_Order_Details.objects.exclude(Create_by="systemr").aggregate(max_id=Max('pk'))['max_id']
            # print(max_PO_id_row,'111---??')
            max_PO_id=max_PO_id_row if max_PO_id_row else None
           
            # print(max_PO_id,'22---??')
 
            numeric_part=int(str(max_PO_id)[4:]) + 1 if max_PO_id else 1
 
            # print(numeric_part,'22---??')
 
           
            self.pk=f'{PO_key_Name}{numeric_part:04}'
 
        super(Purchase_Order_Details, self).save(*args, **kwargs)
 
 
 
class Purchase_Order_Item_Details(models.Model):
        PO_Item_Number=models.AutoField(primary_key=True)
        PurchaseOrder = models.ForeignKey(Purchase_Order_Details, on_delete=models.CASCADE,related_name='ItemTable_PO_Number', null=True, blank=True, default=None)
        PO_Item_Detailes=models.ForeignKey(Supplier_Product_Details,on_delete=models.CASCADE,related_name='PO_Item_ID', null=True, blank=True, default=None)
        PO_Order_Qty=models.CharField(max_length=20, null=True, blank=True, default=None)
        TotalAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True, blank=True, default=None)
        Received_Qty=models.IntegerField(default=0,null=True, blank=True)
        Balance_Qty=models.IntegerField(default=0, null=True, blank=True)
        Item_Status=models.CharField(max_length=20,default='Waiting For Approve')
        Reason=models.TextField(null=True, blank=True,default='')  
        Remarks=models.TextField(null=True, blank=True,default='')  

        Buy_Type=models.TextField(null=True, blank=True,default='')  
        Create_by=models.CharField(max_length=100, default='Admin')
        Created_at=models.DateTimeField(auto_now_add=True)
        Update_at=models.DateTimeField(auto_now=True)
 
        class Meta:
             db_table='Purchase_Order_Item_Details'
 
 







# ----------------------------------- GRN ---------------------

from django.db.models.functions import Cast, Substr
from django.db.models import Max, IntegerField


class GRN_Table_Detials(models.Model):   
    GRN_No = models.CharField(max_length=20, unique=True, editable=False, null=True, blank=True)
    is_Optical =  models.BooleanField(default=False)
    is_GEN =  models.BooleanField(default=False)
    IsQuickGRN = models.BooleanField(default=False)
    IsOldGRN = models.BooleanField(default=False)
    OldGRN_Updated = models.BooleanField(default=False)
    GrnDate = models.DateField()
    Purchase_order_Detials = models.ForeignKey(Purchase_Order_Details,on_delete=models.CASCADE,related_name='Grn_purchase_order_detials',blank=True,null=True,default=None)
    Supplier_Detials = models.ForeignKey(Supplier_Master_Details,on_delete=models.CASCADE,related_name='Grn_supplier_detials',blank=True,null=True,default=None)
    Supplier_Bill_Number = models.CharField(max_length=50)
    Supplier_Bill_Date = models.DateField()
    Supplier_Bill_Due_Date = models.DateField()
    Supplier_Bill_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Store_location = models.ForeignKey('Masters.Inventory_Location_Master_Detials',on_delete=models.CASCADE,related_name='store_location_grn',blank=True,null=True,default=None)
    Received_person = models.CharField(max_length=30)
    Is_Foc_Available = models.BooleanField(default=False)
    File_Attachment=models.BinaryField(null=True, blank=True,default=None)
    Taxable_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Tax_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Total_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Total_Discount_Method = models.CharField(max_length=30)
    Total_Discount_Type = models.CharField(max_length=30)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Final_Taxable_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Final_Tax_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Final_Total_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Round_off_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Net_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    TPD = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Status = models.CharField(max_length=30,default='Recieved')
    Created_by=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Approved_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    
    
    class Meta:
        db_table = 'GRN_Table_Detials'

    def save(self, *args, **kwargs):

        if not self.GRN_No:
            with transaction.atomic():

                # Decide prefix
                if self.is_Optical:
                    prefix = "OPT"
                elif self.is_GEN:
                    prefix = "GEN"
                else:
                    prefix = "GRN"

                prefix_length = len(prefix) + 2  # e.g. OPT- / GEN- / GRN-

                result = (
                    GRN_Table_Detials.objects
                    .select_for_update()
                    .filter(GRN_No__startswith=f"{prefix}-")
                    .exclude(GRN_No__isnull=True)
                    .exclude(GRN_No__exact="")
                    .annotate(
                        num=Cast(Substr('GRN_No', prefix_length), IntegerField())
                    )
                    .aggregate(last_num=Max('num'))
                )

                last_num = result['last_num'] or 0
                next_num = last_num + 1

                self.GRN_No = f"{prefix}-{next_num}"

        super().save(*args, **kwargs)


class GRN_Product_Item_Detials(models.Model):
    Grn_Detials = models.ForeignKey(GRN_Table_Detials,on_delete=models.CASCADE,related_name='grn_detials')
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='Product_grn_items',blank=True,null=True,default=None)
    Not_In_PO_Product=models.BooleanField(default=False)
    Is_Foc_Product = models.BooleanField(default=False)
    Tax_Type = models.CharField(max_length=30)
    Purchase_rate_taxable = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Tax_Percentage = models.CharField(max_length=30)
    # bhghfh
    Purchase_rate_with_tax = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Purchase_MRP = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Received_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    FOC_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Extra_PO_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Total_Received_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Total_Pack_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Is_MRP_as_sellable_price = models.BooleanField(default=True)
    Sellable_price = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Sellable_qty_price = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Total_Pack_Taxable_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Total_Pack_Tax_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Total_Pack_Amount_with_tax = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Batch_No = models.CharField(max_length=30)
    Is_Manufacture_Date_Available = models.BooleanField(default=True)
    Manufacture_Date = models.DateField(blank=True,null=True,default=None)
    Is_Expiry_Date_Available = models.BooleanField(default=True)
    Expiry_Date = models.DateField(blank=True,null=True,default=None)
    Discount_Method = models.CharField(max_length=30)
    Discount_Type = models.CharField(max_length=30)
    Discount_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Final_Total_Pack_Taxable_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Final_Total_Pack_Tax_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Final_Total_Pack_Amount_with_tax = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Status = models.CharField(max_length=30,default='Recieved')
    Reason = models.CharField(max_length=100,default='')
    Created_by=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Approved_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'GRN_Product_Item_Detials'



class Old_Grn_stock_detials(models.Model):
    Grn_Detials = models.ForeignKey(GRN_Product_Item_Detials,on_delete=models.CASCADE,related_name='Old_grn_stock_detials')
    IsNurseStation = models.BooleanField(default=False)
    Store_location = models.ForeignKey('Masters.Inventory_Location_Master_Detials',on_delete=models.CASCADE,related_name='Old_store_location_stock',blank=True,null=True,default=None)
    NurseStation_location = models.ForeignKey('Masters.NurseStationMaster',on_delete=models.CASCADE,related_name='Old_Nurse_store_location_stock',blank=True,null=True,default=None)
    TotalPackQuantity = models.BigIntegerField(blank=True,null=True,default=0)
    Created_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)


    
class Supplier_pay_detials(models.Model):
    Grn_Detials = models.ForeignKey(GRN_Table_Detials,on_delete=models.CASCADE,related_name='Supplier_pay_grn_detials')
    GRN_Invoice_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    GRN_Paid_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    GRN_Balance_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Status = models.BooleanField(default=False)
    Created_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    
class Supplier_Pay_By_Date(models.Model):
    Supplier_pay_detials = models.ForeignKey(Supplier_pay_detials,on_delete=models.CASCADE,related_name='Supplier_pay_by_Supplier_pay_detials')
    GRN_Invoice_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    GRN_Paid_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    GRN_Balance_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Paid_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Balance_Amount = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    Bill_Paid_Date = models.DateField()
    Payment_Method= models.CharField(max_length=50)
    Payment_Detials= models.TextField()
    NewPayment = models.BooleanField(default=True)
    Created_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    


 
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

class Stock_Maintance_Table_Detials(models.Model):
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details, on_delete=models.CASCADE,
                                        related_name='Product_stock_items', blank=True, null=True, default=None)
    Batch_No = models.CharField(max_length=25, blank=True, null=True, default=None)
    Is_MRP_as_sellable_price = models.BooleanField(default=True)
    Sellable_price = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    Sellable_qty_price = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    Is_Manufacture_Date_Available = models.BooleanField(default=True)
    Manufacture_Date = models.DateField(blank=True, null=True, default=None)
    Is_Expiry_Date_Available = models.BooleanField(default=True)
    Expiry_Date = models.DateField(blank=True, null=True, default=None)
    Total_Quantity = models.BigIntegerField(blank=True, null=True, default=0)  
    Total_Moved_Quantity = models.BigIntegerField(blank=True, null=True, default=0)  
    Grn_Recieve_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Indent_Send_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Indent_Recieve_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Indent_Return_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Grn_Return_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Scrab_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Sold_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    AvailableQuantity = models.BigIntegerField(blank=True, null=True, default=0)
    Add_Adjust_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    Less_Adjust_Quantity = models.BigIntegerField(blank=True, null=True, default=0)
    IsNurseStation = models.BooleanField(default=False)
    Update_Reason = models.CharField(max_length=150,default='')
    Store_location = models.ForeignKey('Masters.Inventory_Location_Master_Detials', on_delete=models.CASCADE,
                                       related_name='store_location_stock', blank=True, null=True, default=None)
    
    BoxName = models.CharField(max_length=100, default='Not in Box')
    NurseStation_location = models.ForeignKey('Masters.NurseStationMaster', on_delete=models.CASCADE,
                                              related_name='NurseStation_store_location_stock', blank=True, null=True, default=None)
    Expiry_Status = models.CharField(max_length=50, default='Not-Expired')
    Is_Serial_No_Available_for_each_quantity = models.BooleanField(default=False)
    Is_Serial_No_Status = models.CharField(max_length=30, default='Not_Applicable')    
    Serial_No_Type = models.CharField(max_length=50, blank=True, null=True, default=None)
    Grn_Details_Item = models.ForeignKey(GRN_Product_Item_Detials, on_delete=models.CASCADE,
                                         related_name='grn_item_details', blank=True, null=True, default=None)
    Created_by = models.CharField(max_length=100, default=None, null=True, blank=True)
    
    Current_Price = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    Current_Qunatity_Price = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    MRP_Qunatity_Price = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    
    Tax_Type = models.CharField(max_length=100, default='')
    Tax_Percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    Tax_Amount = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    Updated_by = models.CharField(max_length=100)
    Created_at = models.DateTimeField(auto_now_add=True)
    Update_at = models.DateTimeField(auto_now=True)

   
    def check_and_update_expiry_status(self):
        """
        Updates the Expiry_Status based on the current date and the Expiry_Date.
        - Expiry soon: if the expiry is within 2 months
        - Almost expired: if the expiry is within 1 month
        - Expired: if the expiry date is passed
        """
        if self.Is_Expiry_Date_Available and self.Expiry_Date:
            today = timezone.now().date()
            one_month_ahead = today + timedelta(days=30)
            two_months_ahead = today + timedelta(days=60)
            three_months_ahead = today + timedelta(days=90)

            if self.Expiry_Date < today:
                self.Expiry_Status = 'Expired'
            elif self.Expiry_Date <= one_month_ahead:
                self.Expiry_Status = '30 Days Expiry'
            elif self.Expiry_Date <= two_months_ahead:
                self.Expiry_Status = '60 Days Expiry'
            elif self.Expiry_Date <= three_months_ahead:
                self.Expiry_Status = '90 Days Expiry'
            else:
                self.Expiry_Status = 'Not-Expired'
            
            self.save()



class StockMaintenanceAudit(models.Model):

    OPERATION_CHOICES = (
        ('INSERT', 'INSERT'),
        ('UPDATE', 'UPDATE'),
        ('DELETE', 'DELETE'),
    )

    stock_id = models.IntegerField()
    operation_type = models.CharField(max_length=10, choices=OPERATION_CHOICES)

    old_data = models.JSONField(null=True, blank=True)
    new_data = models.JSONField(null=True, blank=True)

    changed_by = models.CharField(max_length=100, null=True, blank=True)
    update_reason = models.CharField(max_length=200, null=True, blank=True)

    changed_at = models.DateTimeField(auto_now_add=True)



class StockAdjustment_Item_Details(models.Model) :
    Stock_Instance=models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,related_name='StockAdjustment_Stock_Detials')
    AdjustDate=models.CharField(max_length=20)
    OldAvailQty=models.BigIntegerField(blank=True,null=True,default=0)
    AdjustMode=models.CharField(max_length=20)
    AdjustQty=models.BigIntegerField(blank=True,null=True,default=0)
    Reason=models.TextField()
    Created_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'StockAdjustment_Item_Details'
        
class SerialNumber_Stock_Maintance_Table_Detials(models.Model):
    Product_Detailes=models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='SerialNumber_Product_stock_items',blank=True,null=True,default=None)
    Stock_Table=models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,related_name='SerialNumber_Stock_Table')
    Serial_Number=models.CharField(max_length=30,unique=True)
    IsNurseStation = models.BooleanField(default=False)
    Store_location = models.ForeignKey('Masters.Inventory_Location_Master_Detials',on_delete=models.CASCADE,related_name='SerialNumber_store_location_stock',blank=True,null=True,default=None)
    NurseStation_location = models.ForeignKey('Masters.NurseStationMaster',on_delete=models.CASCADE,related_name='SerialNumber_NurseStation_store_location_stock',blank=True,null=True,default=None)
    Item_Status= models.CharField(max_length=50)
    Created_by=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

class Location_Items_Minimum_Maximum_Detailes(models.Model):
    Product_Detailes=models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='Minimum_Maximum_items_INS',blank=True,null=True,default=None)
    MinimumQty=models.IntegerField(default=None,null=True,blank=True)
    MaximumQty=models.IntegerField(default=None,null=True,blank=True)
    ReorderLevel=models.IntegerField(default=None,null=True,blank=True)
    IsNurseStation = models.BooleanField(default=False)
    Store_location = models.ForeignKey('Masters.Inventory_Location_Master_Detials',on_delete=models.CASCADE,related_name='Minimum_Maximum_location_INS',blank=True,null=True,default=None)
    NurseStation_location = models.ForeignKey('Masters.NurseStationMaster',on_delete=models.CASCADE,related_name='Minimum_Maximum_store_location_INS',blank=True,null=True,default=None)
    Status=models.BooleanField(default=True)
    Created_by=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 

# --------------------------  


class Indent_raise_details_table(models.Model):
    Raise_From_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='indent_raise_from_location',
    )
    Raise_From_NurseStation_Store= models.BooleanField(default=False)
    Raise_From_Store_Location= models.ForeignKey(
        'Masters.Inventory_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='indent_raise_from_inv_location',
        blank=True,null=True,default=None
        )
    Raise_From_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='indent_raise_from_NurseStation_location',
        blank=True,null=True,default=None
        )
    Raise_To_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='indent_raise_to_location',
    )
    Raise_To_NurseStation_Store= models.BooleanField(default=False)
    Raise_To_Store_Location= models.ForeignKey(
        'Masters.Inventory_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='indent_raise_to_inv_location',
        blank=True,null=True,default=None
        )
    Raise_To_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='indent_raise_to_NurseStation_location',
        blank=True,null=True,default=None
        )
    Raise_Date = models.DateTimeField(blank=True,null=True,default=None)
    Raise_ApprovedDate = models.DateTimeField(blank=True,null=True,default=None)
    Raise_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Raise_Updated_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Raise_Approved_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Raise_Reason = models.TextField(default='')
    Raise_Status = models.CharField(max_length=30,default='Raised')
    Issue_Status = models.CharField(max_length=30,default='Waiting')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    

class GEN_Indent_raise_details_table(models.Model):
    Raise_From_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_raise_from_location',
    )
    Raise_From_NurseStation_Store= models.BooleanField(default=False)
    Raise_From_Store_Location= models.ForeignKey(
        'Masters.Department_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_raise_from_inv_location',
        blank=True,null=True,default=None
        )
    Raise_From_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='GEN_indent_raise_from_NurseStation_location',
        blank=True,null=True,default=None
        )
    Raise_To_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_raise_to_location',
    )
    Raise_To_NurseStation_Store= models.BooleanField(default=False)
    Raise_To_Store_Location= models.ForeignKey(
        'Masters.Inventory_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_raise_to_inv_location',
        blank=True,null=True,default=None
        )
    Raise_To_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='GEN_indent_raise_to_NurseStation_location',
        blank=True,null=True,default=None
        )
    Raise_Date = models.DateTimeField(blank=True,null=True,default=None)
    Raise_ApprovedDate = models.DateTimeField(blank=True,null=True,default=None)
    Raise_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Raise_Updated_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Raise_Approved_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Raise_Reason = models.TextField(default='')
    Raise_Status = models.CharField(max_length=30,default='Raised')
    Issue_Status = models.CharField(max_length=30,default='Waiting')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    


class Indent_raise_items_details_table(models.Model):
    Indent_Detials = models.ForeignKey(Indent_raise_details_table,on_delete=models.CASCADE,related_name='Indent_raise_detials',blank=True,null=True,default=None)
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='Indent_raise_product_detials',blank=True,null=True,default=None)
    Raise_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Issue_Quantity = models.BigIntegerField(blank=True,null=True,default=0)
    Pending_Quantity = models.BigIntegerField(blank=True,null=True,default=0)
    Raise_Status = models.CharField(max_length=30,default='Raised')
    Issue_Status = models.CharField(max_length=30,default='Waiting')
    Reason = models.TextField(default='')
    Remarks = models.TextField(default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

class GEN_Indent_raise_items_details_table(models.Model):
    Indent_Detials = models.ForeignKey(GEN_Indent_raise_details_table,on_delete=models.CASCADE,related_name='GEN_Indent_raise_detials',blank=True,null=True,default=None)
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='GEN_Indent_raise_product_detials',blank=True,null=True,default=None)
    Raise_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Issue_Quantity = models.BigIntegerField(blank=True,null=True,default=0)
    Pending_Quantity = models.BigIntegerField(blank=True,null=True,default=0)
    Raise_Status = models.CharField(max_length=30,default='Raised')
    Issue_Status = models.CharField(max_length=30,default='Waiting')
    Reason = models.TextField(default='')
    Remarks = models.TextField(default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)


#  Indent Issue
class Indent_issue_details_table(models.Model):
    Indent_Type=models.CharField(max_length=30,default='issue')
    Indent_raise = models.ForeignKey(Indent_raise_details_table,on_delete=models.CASCADE,related_name='indent_raise_details_issue',blank=True,null=True,default=None)
    Issue_From_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='indent_issue_from_location',
    )
    Issue_From_NurseStation_Store= models.BooleanField(default=False)
    Issue_From_Store_Location= models.ForeignKey(
        'Masters.Inventory_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='indent_issue_from_inv_location',
        blank=True,null=True,default=None
        )
    Issue_From_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='indent_issue_from_NurseStation_location',
        blank=True,null=True,default=None
        )
    Issue_To_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='indent_issue_to_location',
    )
    Issue_To_NurseStation_Store= models.BooleanField(default=False)
    Issue_To_Store_Location= models.ForeignKey(
        'Masters.Inventory_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='indent_issue_to_inv_location',
        blank=True,null=True,default=None
        )
    Issue_To_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='indent_issue_to_NurseStation_location',
        blank=True,null=True,default=None
        )
    Issue_Date = models.DateTimeField(blank=True,null=True,default=None)
    Issue_ApprovedDate = models.DateTimeField(blank=True,null=True,default=None)
    Issue_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Issue_Updated_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Issue_Approved_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Issue_Reason = models.TextField(default='')
    Issue_Status = models.CharField(max_length=30,default='Issued')
    Receive_Status = models.CharField(max_length=30,default='Waiting')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    
    
    
class GEN_Indent_issue_details_table(models.Model):
    Indent_Type=models.CharField(max_length=30,default='issue')
    Indent_raise = models.ForeignKey(GEN_Indent_raise_details_table,on_delete=models.CASCADE,related_name='GEN_indent_raise_details_issue',blank=True,null=True,default=None)
    Issue_From_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_issue_from_location',
    )
    Issue_From_NurseStation_Store= models.BooleanField(default=False)
    Issue_From_Store_Location= models.ForeignKey(
        'Masters.Inventory_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_issue_from_inv_location',
        blank=True,null=True,default=None
        )
    Issue_From_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='GENindent_issue_from_NurseStation_location',
        blank=True,null=True,default=None
        )
    Issue_To_Location = models.ForeignKey(
        'Masters.Location_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_issue_to_location',
    )
    Issue_To_NurseStation_Store= models.BooleanField(default=False)
    Issue_To_Store_Location= models.ForeignKey(
        'Masters.Department_Location_Master_Detials',
        on_delete=models.CASCADE,
        related_name='GEN_indent_issue_to_inv_location',
        blank=True,null=True,default=None
        )
    Issue_To_NurseStation_Location = models.ForeignKey(
        'Masters.NurseStationMaster',
        on_delete=models.CASCADE,
        related_name='GEN_indent_issue_to_NurseStation_location',
        blank=True,null=True,default=None
        )
    Issue_Date = models.DateTimeField(blank=True,null=True,default=None)
    Issue_ApprovedDate = models.DateTimeField(blank=True,null=True,default=None)
    Issue_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Issue_Updated_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Issue_Approved_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Issue_Reason = models.TextField(default='')
    Issue_Status = models.CharField(max_length=30,default='Issued')
    Receive_Status = models.CharField(max_length=30,default='Waiting')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    
    
    
    
class Indent_issue_items_details_table(models.Model):
    Indent_Detials = models.ForeignKey(Indent_issue_details_table,on_delete=models.CASCADE,related_name='Indent_issue_detials',blank=True,null=True,default=None)
    Indent_Raise_Item = models.ForeignKey(Indent_raise_items_details_table,on_delete=models.CASCADE,related_name='Indent_raise_detials_issue',blank=True,null=True,default=None)
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='Indent_raise_product_detials_issue',blank=True,null=True,default=None)
    stock_Detials = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,related_name='Indent_issue_items_stock_details',blank=True,null=True,default=None)
    serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='indent_issued_serial_numbers',
    )
    Issue_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Issue_Status = models.CharField(max_length=30,default='Issued')
    Receive_Status = models.CharField(max_length=30,default='Waiting')
    Reason = models.TextField(default='')
    Remarks = models.TextField(default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)

    
class GEN_Indent_issue_items_details_table(models.Model):
    Indent_Detials = models.ForeignKey(GEN_Indent_issue_details_table,on_delete=models.CASCADE,related_name='GEN_Indent_issue_detials',blank=True,null=True,default=None)
    Indent_Raise_Item = models.ForeignKey(GEN_Indent_raise_items_details_table,on_delete=models.CASCADE,related_name='GEN_Indent_raise_detials_issue',blank=True,null=True,default=None)
    Product_Detials = models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE,related_name='GEN_Indent_raise_product_detials_issue',blank=True,null=True,default=None)
    stock_Detials = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,related_name='GEN_Indent_issue_items_stock_details',blank=True,null=True,default=None)
    serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='GEN_indent_issued_serial_numbers',
    )
    Issue_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Issue_Status = models.CharField(max_length=30,default='Issued')
    Receive_Status = models.CharField(max_length=30,default='Waiting')
    Reason = models.TextField(default='')
    Remarks = models.TextField(default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)



#  Indent Recieve

class Indent_receive_details_table(models.Model):
    Indent_issue = models.ForeignKey(Indent_issue_details_table,on_delete=models.CASCADE,related_name='indent_issue_details_receive',blank=True,null=True,default=None)
    Receive_Date = models.DateTimeField(blank=True,null=True,default=None)
    Receive_ApprovedDate = models.DateTimeField(blank=True,null=True,default=None)
    Receive_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Receive_Updated_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Receive_Approved_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Receive_Reason = models.TextField(default='')
    Receive_Status = models.CharField(max_length=30,default='Received')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    

class GEN_Indent_receive_details_table(models.Model):
    Indent_issue = models.ForeignKey(GEN_Indent_issue_details_table,on_delete=models.CASCADE,related_name='GEN_indent_issue_details_receive',blank=True,null=True,default=None)
    Receive_Date = models.DateTimeField(blank=True,null=True,default=None)
    Receive_ApprovedDate = models.DateTimeField(blank=True,null=True,default=None)
    Receive_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Receive_Updated_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Receive_Approved_by=models.CharField(max_length=100,blank=True,null=True,default=None)
    Receive_Reason = models.TextField(default='')
    Receive_Status = models.CharField(max_length=30,default='Received')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)
    

    
class Indent_receive_items_details_table(models.Model):
    Indent_Detials = models.ForeignKey(Indent_receive_details_table,on_delete=models.CASCADE,related_name='Indent_receive_detials',blank=True,null=True,default=None)
    Indent_issue_Item = models.ForeignKey(Indent_issue_items_details_table,on_delete=models.CASCADE,related_name='Indent_issue_detials_receive',blank=True,null=True,default=None)
    Received_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Received_serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='indent_receive_serial_numbers_Received',
    )
    Damaged_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Damaged_serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='indent_receive_serial_numbers_Damaged',
    )
    Pending_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Pending_serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='indent_receive_serial_numbers_Pending',
    )
    Status = models.CharField(max_length=30,default='Received')
    Reason = models.TextField(default='')
    Remarks = models.TextField(default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)


    
class GEN_Indent_receive_items_details_table(models.Model):
    Indent_Detials = models.ForeignKey(GEN_Indent_receive_details_table,on_delete=models.CASCADE,related_name='GEN_Indent_receive_detials',blank=True,null=True,default=None)
    Indent_issue_Item = models.ForeignKey(GEN_Indent_issue_items_details_table,on_delete=models.CASCADE,related_name='GEN_Indent_issue_detials_receive',blank=True,null=True,default=None)
    Received_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Received_serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='GEN_indent_receive_serial_numbers_Received',
    )
    Damaged_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Damaged_serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='GEN_indent_receive_serial_numbers_Damaged',
    )
    Pending_Quantity = models.BigIntegerField(blank=True,null=True,default=None)
    Pending_serialNo = models.ManyToManyField(
        SerialNumber_Stock_Maintance_Table_Detials,
        related_name='GEN_indent_receive_serial_numbers_Pending',
    )
    Status = models.CharField(max_length=30,default='Received')
    Reason = models.TextField(default='')
    Remarks = models.TextField(default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True)







class Purchase_Return_Details_Table(models.Model):
    Purchase_Return_Date=models.DateField()
    Supplier_Detials = models.ForeignKey(Supplier_Master_Details,on_delete=models.CASCADE,related_name='Purchase_Return_Grn_supplier_detials',blank=True,null=True,default=None)
    Store_location = models.ForeignKey('Masters.Inventory_Location_Master_Detials',on_delete=models.CASCADE,related_name='Purchase_Return_store_location_grn',blank=True,null=True,default=None)
    Return_Total_Item=models.BigIntegerField()
    Return_Total_Quantity=models.BigIntegerField()
    Return_Total_Amount=models.DecimalField(max_digits=10,decimal_places=3,default=0)
    Status=models.CharField(max_length=30,default='Approved')
    Created_by=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 


class Purchase_Return_Items_Details_Table(models.Model):
    Purchase_Return_Details=models.ForeignKey(Purchase_Return_Details_Table,on_delete=models.CASCADE,related_name='Purchase_Return_Details_For_Items')
    GRN_Detials=models.ForeignKey(GRN_Table_Detials,on_delete=models.CASCADE,related_name='Purchase_Return_GRN_Table_Detials')
    GRN_Item_Detials=models.ForeignKey(GRN_Product_Item_Detials,on_delete=models.CASCADE,related_name='Purchase_Return_GRN_Product_Item_Detials')
    Stock_Detials=models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,related_name='Purchase_Return_Stock_Detials')
    Reason=models.CharField(max_length=40)
    Single_Product_Purchase_Amount=models.DecimalField(max_digits=10,decimal_places=3,default=0)
    Available_Pack_Quantity = models.BigIntegerField()
    Return_Quantity=models.BigIntegerField()
    Return_Pack_Quantity=models.BigIntegerField()
    Return_Quantity_Amount=models.DecimalField(max_digits=10,decimal_places=3,default=0)
    Remarks=models.TextField()
    Status=models.CharField(max_length=30,default='Approved')
    Created_by=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 


class Medical_Rep_Master(models.Model):
    Rep_Id=models.AutoField(primary_key=True)
    Rep_Name = models.CharField(max_length=100, null=True, blank=True)
    Rep_PhoneNumber = models.CharField(max_length=100, null=True, blank=True)
    Rep_CompanyName = models.CharField(max_length=100, null=True, blank=True)
    Rep_DoorNo = models.CharField(max_length=100, null=True, blank=True)
    Rep_Street = models.CharField(max_length=100, null=True, blank=True)
    Rep_Area = models.CharField(max_length=100, null=True, blank=True)
    Rep_City = models.CharField(max_length=100, null=True, blank=True)
    Rep_District = models.CharField(max_length=100, null=True, blank=True)
    Rep_State = models.CharField(max_length=100, null=True, blank=True)
    Rep_Pincode = models.CharField(max_length=100, null=True, blank=True)
    Rep_Country = models.CharField(max_length=100, null=True, blank=True)
    created_by=models.CharField(max_length=100)
    Location = models.ForeignKey('Masters.Location_Detials',on_delete= models.CASCADE,null=True,blank=True)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 

    class Meta:
        db_table = 'Medical_Rep_Master'


class MedicalRep_ItemName_Table(models.Model):
    RepItem_Id=models.AutoField(primary_key=True)
    Medical_Rep = models.ForeignKey(Medical_Rep_Master, on_delete= models.CASCADE,null=True,blank=True)
    ItemName = models.ForeignKey(Product_Master_All_Category_Details, on_delete= models.CASCADE,null=True,blank=True)
    CompanyName=models.ForeignKey('Masters.CompanyName_mfg_Master_Details',on_delete=models.CASCADE,related_name='MedicalRep_ProductMaster_CompanyName',null=True,blank=True,default=None)
    SupplierName = models.ForeignKey(Supplier_Master_Details, on_delete= models.CASCADE, null=True, blank=True)
    Rate = models.FloatField(null=True, blank=True)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 

    class Meta:
        db_table = 'MedicalRep_ItemName_Table'


class Item_Doctor_Mapping(models.Model):
    Item_Mapping_Code = models.AutoField(primary_key=True)
    ItemName = models.ForeignKey(Product_Master_All_Category_Details, on_delete=models.CASCADE, null=True, blank=True)
    Doctor = models.ForeignKey('Masters.Doctor_Personal_Form_Detials', on_delete=models.CASCADE, null=True, blank=True, related_name='doctor_mapping')  # Corrected
    created_by = models.CharField(max_length=60)
    Status = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Item_Doctor_Mapping'




class InventoryBalance(models.Model):
    product = models.ForeignKey(Product_Master_All_Category_Details, on_delete=models.CASCADE)
    batch = models.CharField(max_length=25, blank=True, null=True)
    store = models.ForeignKey('Masters.Inventory_Location_Master_Detials', on_delete=models.CASCADE, blank=True, null=True)

    date = models.DateField()
    opening_balance = models.IntegerField(default=0)
    closing_balance = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    # class Meta:
    #     unique_together = ('product', 'batch', 'store', 'date')

    def __str__(self):
        return f"{self.product} | {self.batch or 'N/A'} | {self.date}"
