from django import forms
from .models import *
from django.db import models
from django.db.models import Max
from Masters.models import *
from OTManagement.models import *
from django.db import models
from django.db.models import Max
from datetime import datetime, timedelta
from django.core.validators import MinValueValidator

 
 
class AssetCategory(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
 
    name = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
 
    class Meta:
        db_table = 'AssetCategory'
   
    def save(self, *args, **kwargs):
        # Using the default 'id' field for the primary key
        if not self.id:
            max_id = AssetCategory.objects.aggregate(
                max_id=Max('id')
            )['max_id']
            self.id = (max_id or 0) + 1  
        super().save(*args, **kwargs)
 
# ------------------------------------------------AssetSubCategory----------------------------------------------
class AssetSubCategory(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    name = models.CharField(max_length=255)
    category = models.ForeignKey(AssetCategory, on_delete=models.CASCADE, related_name='subcategories')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
 
    class Meta:
        db_table = 'AssetSubCategory'
        unique_together = ('name', 'category')
       
    def save(self, *args, **kwargs):
    # Using the default 'id' field for the primary key
        if not self.id:
            max_id = AssetSubCategory.objects.aggregate(
                max_id=Max('id')
            )['max_id']
            self.id = (max_id or 0) + 1  
        super().save(*args, **kwargs)
        
#------------------------------------------Supplier-----------------------------------------------------
class Supplier(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=255)
    contact_info = models.TextField()
    email = models.EmailField(unique=True)
    asset_category = models.ForeignKey(AssetCategory, on_delete=models.CASCADE, related_name='suppliers')
    subcategories = models.ManyToManyField(AssetSubCategory, related_name='suppliers')  # Add this line
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    ranking = models.IntegerField(default=1)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Supplier'

    def save(self, *args, **kwargs):
        if not self.id:
            max_id = Supplier.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
        
#  -------------------------------------ServiceProviderManagement----------------------------------

class Asset_ServiceProviderManagement(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    SERVICE_QUALITY_CHOICES = [
        ('poor', 'Poor'),
        ('fair', 'Fair'),
        ('good', 'Good'),
        ('excellent', 'Excellent'),
    ]
    
    name = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    
    asset_categories = models.ManyToManyField(AssetCategory,blank=True)
    subcategories = models.ManyToManyField(AssetSubCategory, blank=True)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    cost_effective = models.BooleanField(default=True)
    service_quality = models.CharField(max_length=10, choices=SERVICE_QUALITY_CHOICES, default='fair')
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    average_response_time = models.CharField(max_length=50, default='1 day')
    years_of_experience = models.PositiveIntegerField(null=True, blank=True)
    ranking = models.IntegerField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'Asset_ServiceProviderManagement'
        
    def save(self, *args, **kwargs):
        if not self.id:
            max_id = Asset_ServiceProviderManagement.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
        
# --------------------------------------ChecklistMasterEntry---------------------------------------

class ChecklistMasterEntry(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
     
    item_name  = models.CharField(max_length=255)
    asset_category = models.ForeignKey(AssetCategory, on_delete=models.CASCADE, related_name='ChecklistMasterEntry')
    subcategories = models.ManyToManyField(AssetSubCategory, related_name='ChecklistMasterEntry')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    class Meta:
        db_table = 'ChecklistMasterEntry'

    def save(self, *args, **kwargs):
        if not self.id:
            max_id = ChecklistMasterEntry.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
        
# -------------------------------------Asset Reg--------------------------------------
class AssetReg_Data(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    name = models.CharField(max_length=250)
    purchase_date = models.DateField(null=True, blank=True)
    asset_code = models.CharField(max_length=255, unique=True, blank=True, null=True)  
    category = models.ForeignKey(AssetCategory, on_delete=models.CASCADE, null=True, blank=True, related_name='asset_registrations') 
    asset_subcategory = models.ForeignKey(AssetSubCategory, on_delete=models.CASCADE, null=True, blank=True)  
    supplier = models.ManyToManyField(Supplier, blank=True)
    Company_Brand = models.CharField(max_length=500)
    department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, null=True, blank=True)
    ward = models.ForeignKey(WardType_Master_Detials, on_delete=models.CASCADE, null=True, blank=True)
    administration = models.ForeignKey(Administration_Master_Details, on_delete=models.CASCADE, null=True, blank=True)
    theatre = models.ForeignKey(OtTheaterMaster_Detials, on_delete=models.CASCADE, null=True, blank=True)
    room = models.ForeignKey(Room_Master_Detials, on_delete=models.CASCADE, null=True, blank=True)
    Consultaion_Room= models.ForeignKey(Consultaion_Room_Master_Details,on_delete=models.CASCADE, null=True, blank=True)
    condition = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    market_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    total_working_life = models.IntegerField(null=True, blank=True)
    expected_working_life = models.IntegerField(null=True, blank=True)
    valuation_method = models.CharField(max_length=250, null=True, blank=True)
    is_new_asset = models.BooleanField(default=True)
    depreciation_method = models.CharField(max_length=250, null=True, blank=True)
    depreciation_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    salvage_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    appreciation_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    class Meta:
        db_table = 'AssetReg_Data'

    def save(self, *args, **kwargs):
        if not self.id:
            max_id = AssetReg_Data.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
        
        
        
        
        
        
        # ------------------------------------------------------------------------
class AssetList(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    CONDITION_CHOICES = [
        ('good', 'Good'),
        ('bad', 'Bad'),
    ]

    VALUATION_CHOICES = [
        ('none', 'None'),
        ('depreciated', 'Depreciated'),
        ('appreciation','Appreciation'),
    ]

    name = models.CharField(max_length=255)
    asset_code = models.CharField(max_length=50, unique=True, null=True, blank=True)

    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE, null=True, blank=True)
    supplier = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES)
    valuation_method = models.CharField(max_length=50, choices=VALUATION_CHOICES)

    class Meta:
        db_table = 'AssetList'

    def save(self, *args, **kwargs):
        if not self.pk: 
            max_id = AssetList.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
#-----------------------------------------------------------------------------------------------------------------
class DocumentType_set(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'DocumentType_set'

    def __str__(self):
        return self.name

    @classmethod
    def get_default_types(cls):
        return [
            'INVOICE', 'WARRANTY', 'MANUAL', 'CERTIFICATE', 
            'CONTRACT', 'REPORT', 'OTHER'
        ]

class AssetDocuments_uplode(models.Model):
    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    asset_subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE)
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE)
    document_type = models.ForeignKey(DocumentType_set, on_delete=models.CASCADE)
    file = models.BinaryField()
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'AssetDocuments_uplode'
        indexes = [
            models.Index(fields=['document_type', 'asset']),
            models.Index(fields=['category', 'asset_subcategory']),
        ]

    def __str__(self):
        return f"{self.asset.name} - {self.document_type.name}"
    
    def save(self, *args, **kwargs):
        if not self.pk: 
            max_id = AssetDocuments_uplode.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)

# ----------------------------------------------------------------------------------------------

class ASSET_AMC_CMC(models.Model):
    CATEGORY_CHOICES = [
        ('amc', 'AMC'),
        ('cmc', 'CMC'),
    ]
    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    asset_subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE)
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE)
    provider = models.ForeignKey('Asset_ServiceProviderManagement', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    terms = models.TextField()
    warranty_type = models.CharField(max_length=50, choices=[('partial', 'Partial'), ('full', 'Full')])
    is_active = models.BooleanField(default=True)
    asset_type = models.CharField(max_length=100, choices=[('amc', 'AMC'), ('cmc', 'CMC')])
    parts = models.TextField()
    visit_frequency = models.CharField(max_length=100)
    visit_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'ASSET_AMC_CMC'

    def save(self, *args, **kwargs):
        if not self.pk: 
            max_id = ASSET_AMC_CMC.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
            # if self.asset_type == 'amc':
            #     self.dependency_type = 'AMC Dependency Logic'
            # elif self.asset_type == 'cmc':
            #     self.dependency_type = 'CMC Dependency Logic'
        
        super().save(*args, **kwargs)
        
# ----------------------------------------------maintenance-------------------------------------------------
        

class ASSET_MaintenanceSchedule(models.Model):
    SCHEDULE_CHOICES = (
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
        ('Yearly', 'Yearly'),
    )
    
    SERVICE_BY_CHOICES = (
        ('Technician', 'Technician'),
        ('ServiceProvider', 'Service Provider'),
    )
    
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    )
    
    asset = models.ForeignKey(AssetReg_Data, on_delete=models.CASCADE, related_name='ASSET_MaintenanceSchedule')
    asset_subcategory = models.ForeignKey(AssetSubCategory, on_delete=models.CASCADE)
    department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE)
    departmentname = models.CharField(max_length=100)
    
    ward = models.ForeignKey(WardType_Master_Detials, on_delete=models.SET_NULL, null=True, blank=True)
    room = models.ForeignKey(RoomType_Master_Detials, on_delete=models.SET_NULL, null=True, blank=True)
    administration = models.ForeignKey(Administration_Master_Details, on_delete=models.SET_NULL, null=True, blank=True)
    theatre = models.ForeignKey(OtTheaterMaster_Detials, on_delete=models.SET_NULL, null=True, blank=True)
    consultation_room = models.ForeignKey(Consultaion_Room_Master_Details, on_delete=models.SET_NULL, null=True, blank=True)
    
    service_by = models.CharField(max_length=20, choices=SERVICE_BY_CHOICES)
    technician = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.SET_NULL, null=True, blank=True)
    service_provider = models.ForeignKey(Asset_ServiceProviderManagement, on_delete=models.SET_NULL, null=True, blank=True)
    
    maintenance_schedule = models.CharField(max_length=20, choices=SCHEDULE_CHOICES)
    time_frequency = models.PositiveIntegerField(help_text="Time frequency in hours")
    maintenance_date = models.DateField(null=True, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True)
    last_maintenance_date = models.DateField(null=True, blank=True)
    
    maintenance_days = models.TextField(null=True, blank=True)
    maintenance_dates = models.TextField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    maintenance_notes = models.TextField(null=True, blank=True)
    completion_notes = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ASSET_MaintenanceSchedule'
    
    def save(self, *args, **kwargs):
        if not self.pk:
            max_id = ASSET_MaintenanceSchedule.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        
        if self.status == 'Completed' and self.maintenance_schedule and (self.pk is None or self.status != ASSET_MaintenanceSchedule.objects.get(pk=self.pk).status):
            today = datetime.now().date()
            if self.maintenance_schedule == 'Daily':
                self.next_maintenance_date = today + timedelta(days=1)
            elif self.maintenance_schedule == 'Weekly':
                self.next_maintenance_date = today + timedelta(days=7)
            elif self.maintenance_schedule == 'Monthly':
                next_month = today.month + 1
                next_year = today.year
                if next_month > 12:
                    next_month = 1
                    next_year += 1
                day = min(int(self.maintenance_date.day) if self.maintenance_date else today.day, 28)
                self.next_maintenance_date = today.replace(year=next_year, month=next_month, day=day)
            elif self.maintenance_schedule == 'Yearly':
                self.next_maintenance_date = today.replace(year=today.year + 1)
        
        super().save(*args, **kwargs)

# ----------------------------------------------maintenance Log-------------------------------------------------

class ASSET_MaintenanceLogSummary(models.Model):
    maintenance_schedule = models.ForeignKey(
        ASSET_MaintenanceSchedule,
        on_delete=models.CASCADE,
        related_name='log_summaries'
    )
    asset = models.ForeignKey(
        AssetReg_Data,
        on_delete=models.CASCADE
    )
    completed_by = models.CharField(max_length=100)
    completed_at = models.DateTimeField()
    total_items = models.PositiveIntegerField()  
    completed_items = models.PositiveIntegerField()  
    status = models.CharField(
        max_length=20,
        choices=(('Completed', 'Completed'), ('Partial', 'Partial')),
        default='Partial'
    )
    remarks = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ASSET_MaintenanceLogSummary'

    def __str__(self):
        return f"Summary for {self.maintenance_schedule.id} - {self.status}"
    
# --------------------------------------------ASSET_MaintenanceChecklistLog-----------------------------------------------
class ASSET_MaintenanceChecklistLog(models.Model):
    STATUS_CHOICES = (
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
        ('Issue', 'Issue'),
    )
    
    maintenance_schedule = models.ForeignKey(ASSET_MaintenanceSchedule, on_delete=models.CASCADE, related_name='checklist_logs')
    checklist_item_id = models.IntegerField()
    checklist_item_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    remarks = models.TextField(null=True, blank=True)
    completed_by = models.CharField(max_length=100, null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ASSET_MaintenanceChecklistLog'

    def __str__(self):
        return f"{self.checklist_item_name} - {self.status}"
    
# ----------------------------------- BreakageForm-------------------------------------------


class BreakageReport_Asset_Table_Data(models.Model):
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE, related_name='BreakageReport_Asset_Table_Data')
    department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, related_name='BreakageReport_Asset_Table_Data')
    
    ward = models.ForeignKey(WardType_Master_Detials, on_delete=models.SET_NULL, null=True, blank=True, related_name='BreakageReport_Asset_Table_Data')
    room = models.ForeignKey(RoomType_Master_Detials, on_delete=models.SET_NULL, null=True, blank=True, related_name='BreakageReport_Asset_Table_Data')
    administration = models.ForeignKey(Administration_Master_Details, on_delete=models.SET_NULL, null=True, blank=True, related_name='BreakageReport_Asset_Table_Data')
    theatre = models.ForeignKey(OtTheaterMaster_Detials, on_delete=models.SET_NULL, null=True, blank=True, related_name='BreakageReport_Asset_Table_Data')
    consultation_room = models.ForeignKey(Consultaion_Room_Master_Details, on_delete=models.SET_NULL, null=True, blank=True, related_name='BreakageReport_Asset_Table_Data')
    
    breakage_issue = models.TextField()
    sister = models.ForeignKey(UserRegister_Master_Details, on_delete=models.SET_NULL, null=True, blank=True, related_name='sister_breakage_reports')
    incharge = models.ForeignKey(UserRegister_Master_Details, on_delete=models.SET_NULL, null=True, blank=True, related_name='incharge_breakage_reports')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    repair_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'BreakageReport_Asset_Table_Data'

    def __str__(self):
        return f"Breakage Report Asset Table Data {self.id} - {self.asset.name}"        
 

class BreakageRepair_Asset_Table_Data(models.Model):
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE, related_name='breakage_repaire')
    breakage_done_by = models.CharField(max_length=100, null=True, blank=True)
    action_date = models.DateField(null=True, blank=True)
    breakage_done_date = models.DateField(null=True, blank=True)
    part_replaced = models.CharField(max_length=255, null=True, blank=True)
    store_received = models.CharField(max_length=255, null=True, blank=True)
    received_by = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'BreakageRepair_Asset_Table_Data'

    def __str__(self):
        return f"Breakage Repaire {self.id} - {self.asset.name}"
    
    
class Popup_Breakage_Data(models.Model):
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE, related_name='Popup_Breakage_Data')
    date = models.DateTimeField(null=True, blank=True)  
    note = models.CharField(max_length=500, null=True, blank=True)
    
    class Meta:
        db_table = 'Popup_Breakage_Data'
        
    def __str__(self):
        return f"Popup Breakage Data {self.id} - {self.asset.name}"
    
# -------------------------------------AssetMovement---------------------------------------------
class AssetMovement(models.Model):
    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    asset_subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE)
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE)
    from_location = models.JSONField()  
    to_location = models.JSONField()    
    movement_date = models.DateField()  
    movement_time = models.TimeField()  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'asset_movement'

    def save(self, *args, **kwargs):
        if not self.pk:
            max_id = AssetMovement.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)    

# --------------------------------------AssetOutsideMovement------------------------------------------------
class AssetOutsideMovementTableData(models.Model):
    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    asset_subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE)
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE)
    from_location = models.JSONField()  
    to_location = models.JSONField()   
    send_date = models.DateField()
    send_time = models.TimeField()
    receive_date = models.DateField(null=True, blank=True)
    receive_time = models.TimeField(null=True, blank=True)
    current_condition = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    condition_to_return = models.CharField(max_length=255, null=True, blank=True)
    sent_by = models.CharField(max_length=100)
    received_by = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'AssetOutsideMovementTableData'

    def save(self, *args, **kwargs):
        if not self.pk:
            max_id = AssetOutsideMovementTableData.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
        
class AssetInsuranceRegistration(models.Model):
    product_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    insurance_name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'AssetInsuranceRegistration'

    def save(self, *args, **kwargs):
        if not self.pk:
            max_id = AssetInsuranceRegistration.objects.aggregate(max_id=models.Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
                


class ScrapAsset(models.Model):
    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    asset_subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE)
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE)
    scrap_date = models.DateField()
    reason = models.TextField()
    approved_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'scrap_asset'

    def save(self, *args, **kwargs):
        if not self.pk:
            max_id = ScrapAsset.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)        
        
        
        
class AssetDisposalTable(models.Model):
    category = models.ForeignKey('AssetCategory', on_delete=models.CASCADE)
    asset_subcategory = models.ForeignKey('AssetSubCategory', on_delete=models.CASCADE)
    asset = models.ForeignKey('AssetReg_Data', on_delete=models.CASCADE)
    disposal_date = models.DateField()
    disposal_method = models.CharField(max_length=50, choices=[('SALE', 'Sale'), ('DONATION', 'Donation'), ('OTHER', 'Other')])
    disposal_value = models.DecimalField(max_digits=10, decimal_places=2)
    approved_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'AssetDisposalTable'

    def save(self, *args, **kwargs):
        if not self.pk:
            max_id = AssetDisposalTable.objects.aggregate(max_id=Max('id'))['max_id']
            self.id = (max_id or 0) + 1
        super().save(*args, **kwargs)
        
        
        
                