from django.db import models
from Masters.models import Department_Detials
from Frontoffice.models import Patient_Detials
# Create your models here.

class MRD_Patient(models.Model):
    Patient_Id = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,max_length=30)  
    First_Name = models.CharField(max_length=100)     
    Current_Location = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, blank=True,null=True) 
    # Current_Location = models.CharField(max_length=100, null=True,default='MRD')
    Status = models.CharField(max_length=50, default='Checked In')  
    History = models.JSONField(default=list)            
    created_by = models.CharField(max_length=30)        
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)      

    class Meta:
        db_table = 'MRD_Patient' 


class  MRD_Rack_Master_Detials(models.Model):
    Rack_Id = models.AutoField(primary_key=True)
    Rack_Name = models.CharField(max_length=150)
    # Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,related_name='Rack_Master_Location')
    # Store_Location_Name=models.ForeignKey(Inventory_Location_Master_Detials,on_delete=models.CASCADE,related_name='Rack_Store_Location')
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'MRD_Rack_Master_Detials'
        
    def str(self):
        return self.Rack_Name


class MRD_Shelf_Master_Details(models.Model):
    Shelf_Id=models.AutoField(primary_key=True)
    Shelf_Name=models.CharField(max_length=70)
    Rack_Name=models.ForeignKey(MRD_Rack_Master_Detials,on_delete=models.CASCADE,related_name='Shelf_Rack_Name')
    Status=models.BooleanField(default=True)
    created_by=models.CharField(max_length=70)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class  Meta:
        db_table = 'MRD_Shelf_Master_Details'
    
    def str(self):
        return(self.Shelf_Name)


class MRD_File_Master_Details(models.Model):
    Patient_Id = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,max_length=30)  
    File_Name = models.CharField(max_length=100) 
    # Rack_Name=models.ForeignKey(MRD_Rack_Master_Detials,on_delete=models.CASCADE,related_name='Shelf_Rack_Name')
    Shelf_Name=models.ForeignKey(MRD_Shelf_Master_Details,on_delete=models.CASCADE,related_name='Tray_Shelf_Name')
    File_Position = models.PositiveIntegerField(null=True, blank=True)
    Status=models.BooleanField(default=True)
    Booking_Status=models.CharField(max_length=30,default='Available')
    created_by=models.CharField(max_length=70)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'MRD_File_Master_Details'
    def __str__(self):
        return(self.File_Name)


