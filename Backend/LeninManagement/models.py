from django.db import models
from django.db.models import Max
from Masters.models import Location_Detials,Department_Detials,NurseStationMaster





class Lenin_Catg_Master_Details(models.Model):
    catgId = models.AutoField(primary_key=True)
    LeninCategory = models.CharField(max_length=30)
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Lenin_Catg_Master_Details'

    def __str__(self):
        return self.LeninCategory


class LeninMaster_Details(models.Model):
    LeninCode = models.AutoField(primary_key=True)
    LeninCategory = models.ForeignKey(
        Lenin_Catg_Master_Details,
        on_delete=models.CASCADE,
        related_name='lenin_categories'
    )
    LeninType = models.CharField(max_length=30)
    LeninSize = models.CharField(max_length=30)
    ColorCode = models.CharField(max_length=50)
    MaxWashCount = models.IntegerField(null=True, blank=True)
    InfectionCategory = models.CharField(max_length=10, blank=True)
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Remarks = models.CharField(max_length=200, default='')

    class Meta:
        db_table = 'LeninMaster_Details'

    def __str__(self):
        return self.LeninType


class Dept_Wise_Lenin_min_max_Details(models.Model):
    Id = models.AutoField(primary_key=True)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE)
    Department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE)
    NurseStation = models.ForeignKey(NurseStationMaster, on_delete=models.CASCADE, null=True, blank=True)
    LeninType = models.ForeignKey(LeninMaster_Details, on_delete=models.CASCADE)
    LeninCategory = models.ForeignKey(Lenin_Catg_Master_Details,on_delete=models.CASCADE,null=True,blank=True)
    Prev_Minimum_count = models.IntegerField()
    Curr_Minimum_count = models.IntegerField()
    Prev_Maximum_count = models.IntegerField()
    Curr_Maximum_count = models.IntegerField()
    Current_Stock = models.IntegerField(default=0)
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Dept_Wise_Lenin_min_max_Details'


class Lenin_Stock_Details(models.Model):
    StockId = models.AutoField(primary_key=True)
    LeninType = models.ForeignKey(LeninMaster_Details, on_delete=models.CASCADE)
    LeninCategory = models.ForeignKey(Lenin_Catg_Master_Details,on_delete=models.CASCADE,null=True,blank=True)
    Quantity = models.IntegerField()
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Lenin_Stock_Details'


class LinenIssue(models.Model):
    
    SHIFT_CHOICES = [
        ('Morning', 'Morning'),
        ('Night', 'Night'),
    ]
    Status_Mode = [
        ('Issue', 'Issue'),
        ('Collection', 'Collection'),
    ]
    issue_id = models.AutoField(primary_key=True)
    issue_date = models.CharField(max_length=100,default='')
    issue_shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    department = models.ForeignKey(Department_Detials,on_delete=models.CASCADE, null=True,blank=True)
    linen_type = models.ForeignKey(LeninMaster_Details,on_delete=models.CASCADE,null=True, blank=True)
    quantity_issued = models.IntegerField()
    issued_by = models.CharField(max_length=100)
    Status = models.CharField(max_length=50,choices=Status_Mode,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "LinenIssue"
        ordering = ['-issue_date']

    def __str__(self):
        return f"Issue {self.issue_id} - {self.department or 'No Department'}"



from django.db import models
from django.utils import timezone

class LinenLaundry(models.Model):
    BatchNo = models.CharField(max_length=100)
    WashType = models.CharField(max_length=50)
    StartTime = models.DateTimeField()
    EndTime = models.DateTimeField(blank=True, null=True)
    VendorType = models.CharField(max_length=20, choices=[('INHOUSE', 'In-House'), ('OUTSOURCE', 'Out-Source')])
    VendorName = models.CharField(max_length=100, blank=True, null=True)
    VendorLocation = models.CharField(max_length=150, blank=True, null=True)
    Status = models.CharField(max_length=20, default='Active')
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "linen_laundry_management"

    def __str__(self):
        return f"{self.BatchNo} - {self.WashType}"

class Dept_Wise_QC_Details(models.Model):
    Id = models.AutoField(primary_key=True)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, related_name='qc_locations',null=True, blank = True)
    Department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, related_name='qc_departments',null=True ,blank = True)
    LeninCategory = models.ForeignKey(Lenin_Catg_Master_Details, on_delete=models.CASCADE, related_name='qc_categories' ,null=True, blank = True)
    LeninType = models.ForeignKey(LeninMaster_Details, on_delete=models.CASCADE, related_name='qc_types' ,null=True, blank = True)
    
    QCValue = models.FloatField()  # example QC measurement
    QCStatus = models.CharField(max_length=20, default='Pending')  # e.g., Pending, Pass, Fail
    Inspector = models.CharField(max_length=50)
    
    # New fields
    Total = models.IntegerField(default=0)
    Approved = models.IntegerField(default=0)
    Rewash = models.IntegerField(default=0)
    Condemned = models.IntegerField(default=0)
    Infected = models.CharField(max_length=3, choices=[('YES','Yes'),('NO','No')], default='NO')
    InfectionDesc = models.TextField(blank=True, null=True)

    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Dept_Wise_QC_Details'

    def __str__(self):
        return f"{self.Location} - {self.Department} - {self.LeninCategory} - {self.LeninType} - {self.QCValue}"

class LinenLaundryMaster(models.Model):
    VENDOR_TYPE_CHOICES = [
        ('INHOUSE', 'In-House'),
        ('OUTSOURCE', 'Out-Source'),
    ]

    BatchNo = models.CharField(max_length=50, unique=True)
    VendorName = models.CharField(max_length=100, blank=True, null=True)
    VendorLocation = models.CharField(max_length=200, blank=True, null=True) 
    PhoneNumber = models.CharField(max_length=20, blank=True, null=True)
    
    # Store the primary identifier here
    LeninCategory = models.CharField(max_length=100, blank=True, null=True) # Ensure this exists
    LeninType = models.CharField(max_length=100, blank=True, null=True)    
    Quantity = models.IntegerField(default=0)
    BulkQty = models.IntegerField(default=0)
    BulkRate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    BulkTotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    PieceQty = models.IntegerField(default=0)
    PieceRate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    PieceTotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    GrandTotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    VendorType = models.CharField(max_length=20, choices=VENDOR_TYPE_CHOICES, default='OUTSOURCE')
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.BatchNo} - {self.VendorName}"
    
    
    
    
    
    
    
    
    
    
    
    
    
    