from django.db import models
from django.utils import timezone
from Inventory.models import *
from Masters.models import *

    
class Sterilize_Creation_Details(models.Model):
    SterilizeId=models.AutoField(primary_key=True)
    SterilizeName=models.CharField(max_length=60)
    createdDate = models.DateField(auto_now_add=True)
    Status = models.BooleanField(default=True)


    class Meta:
        db_table = 'Sterilize_Creation_Detail'
        
        

class Tray_Creation_Details(models.Model):
    trayId = models.AutoField(primary_key=True)
    trayName = models.CharField(max_length=60)
    sterilizeMethod = models.ManyToManyField(Sterilize_Creation_Details)  # ✅ Many-to-Many
    productId = models.ManyToManyField(Product_Master_All_Category_Details,blank=True)
    createdDate = models.DateField(auto_now_add=True)
    Status = models.BooleanField(default=True)


    class Meta:
        db_table = 'Tray_Creation_Detail'


class Tray_And_Products(models.Model):
    trayId=models.ForeignKey(Tray_Creation_Details,on_delete=models.CASCADE)
    ProductId=models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE)
    productCount=models.IntegerField()
    createdDate = models.DateField(auto_now_add=True)
    Status = models.BooleanField(default=True)

    class Meta:
            db_table = 'Tray_AND_Products'


class Tray_Master(models.Model):
    trayId = models.AutoField(primary_key=True)
    tray=models.ForeignKey(Tray_Creation_Details,on_delete=models.CASCADE)
    TrayName=models.CharField(max_length=100)
    TrayCategory=models.CharField(max_length=10)
    TrayCreateOn=models.DateField()
    TrayExpireOn=models.DateField()
    TrayStatus=models.BooleanField(default=True)
    Reason=models.CharField(max_length=300,null=True)
    
    class Meta:
            db_table = 'Tray_Master'    
    
class Tray_Products_Master(models.Model):
    Id = models.AutoField(primary_key=True)
    tray=models.ForeignKey(Tray_Master,on_delete=models.CASCADE,blank=True,null=True)
    ProductId=models.ForeignKey(Product_Master_All_Category_Details,on_delete=models.CASCADE)
    ProductName=models.CharField(max_length=200)
    BatchNo=models.CharField(max_length=25)
    ProductStatus=models.BooleanField(default=True)
    productFrom = models.CharField(max_length=10,blank=True,null=True)
    Reason=models.CharField(max_length=300,blank=True,null=True)
    incharge=models.CharField(max_length=50,blank=True,null=True)

    class Meta:
            db_table = 'Tray_Products _Master'





class Tray_Indent_Raise_Details(models.Model):
    raiseId=models.AutoField(primary_key=True)
    Raise_From_Location = models.ForeignKey(
        Location_Detials,
        related_name="raised_from_tray_indent",
        on_delete=models.CASCADE,
    )    
    Raise_From_NurseStation_Location = models.ForeignKey(
        NurseStationMaster,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    Raise_From_OT_Location = models.ForeignKey(
        OtTheaterMaster_Detials,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    Raise_To_Location = models.ForeignKey(
        Location_Detials,
        related_name="raised_to_tray_indent",
        on_delete=models.CASCADE,
    )
    Raise_To_Department = models.CharField(max_length=20)
    Raise_Tray = models.ManyToManyField(Tray_Master)
    Status=models.CharField(max_length=30)
    Raise_Date=models.DateField()
    created_by=models.CharField(max_length=30)
    updated_by=models.CharField(max_length=30)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
            db_table = 'Tray_Indent_Raise'
    
    
class Tray_Indent_Raise_Item_Status(models.Model):
    raiseId = models.ForeignKey(Tray_Indent_Raise_Details,on_delete=models.CASCADE)
    raiseTray = models.ForeignKey(Tray_Master,on_delete=models.CASCADE)
    trayStatus = models.CharField(max_length=30,default="Raised")
    trayLocation= models.ForeignKey(
        Location_Detials,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )   
    Tray_From_OT_Location = models.ForeignKey(
        OtTheaterMaster_Detials,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    Tray_From_NurseStation_Location = models.ForeignKey(
        NurseStationMaster,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    
    
    class Meta:
            db_table = 'Tray_Indent_Raise_Item_Status'
    
    
    
class Tray_Indent_Recive_Details(models.Model):
    reciveId=models.AutoField(primary_key=True)
    Recive_From_Location = models.ForeignKey(
        Location_Detials,
        related_name="recived_from_tray_indent",
        on_delete=models.CASCADE,
    )    
    Recive_From_NurseStation_Location = models.ForeignKey(
        NurseStationMaster,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    Recive_From_OT_Location = models.ForeignKey(
        OtTheaterMaster_Detials,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    Recive_To_Location = models.ForeignKey(
        Location_Detials,
        related_name="recived_to_tray_indent",
        on_delete=models.CASCADE,
    )
    Recive_To_Department = models.CharField(max_length=20)
    Recive_Tray = models.ManyToManyField(Tray_Master)
    Status=models.CharField(max_length=30,default="Recived")
    Recive_Date=models.DateField(auto_now_add=True)
    created_by=models.CharField(max_length=30)
    updated_by=models.CharField(max_length=30)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
            db_table = 'Tray_Indent_Recive'
    
    
class Tray_Indent_Recive_Item_Status(models.Model):
    reciveId = models.ForeignKey(Tray_Indent_Recive_Details,on_delete=models.CASCADE)
    reciveTray = models.ForeignKey(Tray_Master,on_delete=models.CASCADE)
    trayStatus = models.CharField(max_length=30,default="Raised")
    reason = models.CharField(max_length=50,default="Recived",blank=True,null=True)
    trayLocation= models.ForeignKey(
        Location_Detials,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )   
    Tray_From_OT_Location = models.ForeignKey(
        OtTheaterMaster_Detials,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    Tray_From_NurseStation_Location = models.ForeignKey(
        NurseStationMaster,
        on_delete=models.CASCADE,
        blank=True,null=True,default=None
    )
    
    
    class Meta:
            db_table = 'Tray_Indent_Recive_Item_Status'
    
    

    
    
    
    

    
    
    
    
