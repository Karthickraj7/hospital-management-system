from django.db import models

from django.db import models
from Masters.models import *

class AnalyseInvestigationResult(models.Model):
    Analyse_Id = models.AutoField(primary_key=True)
    Test = models.CharField(max_length=200, null=True, blank=True)
    Billing_invoice = models.CharField(max_length=30, null=True, blank=True, db_index=True)
    Patent_Name = models.CharField(max_length=250, null=True, blank=True)
    Visit_Id = models.CharField(max_length=10, null=True, blank=True)
    Sample_Specimen = models.CharField(max_length=250, null=True, blank=True)
    Method = models.CharField(max_length=55, null=True, blank=True)
    Previous_Value = models.CharField(max_length=300, null=True, blank=True)
    Capture_Value = models.CharField(max_length=300, null=True, blank=True)
    Panic_Low = models.CharField(max_length=350, null=True, blank=True)
    Panic_High = models.CharField(max_length=350, null=True, blank=True)
    Medical_Remark = models.CharField(max_length=500, null=True, blank=True)
    Technical_Remark = models.CharField(max_length=500, null=True, blank=True)
    Status = models.CharField(max_length=350, null=True, blank=True, db_index=True)
    Patient_Id = models.CharField(max_length=25, null=True, db_index=True)
    Colony_Count = models.CharField(max_length=1500, null=True, blank=True)
    Capture_Organism = models.CharField(max_length=150, null=True, blank=True)
    Location = models.CharField(max_length=200, null=True, blank=True)
    EditContent = models.TextField(null=True, blank=True)
    CreatedBy = models.CharField(max_length=150, null=True, blank=True)
    Department = models.CharField(max_length=155, null=True, blank=True)
    Sample_Picture = models.BinaryField(null=True, blank=True)
    Reference = models.CharField(max_length=25, null=True, blank=True)
    Reference_Range = models.CharField(max_length=450, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    Notes = models.TextField(null=True, blank=True)
    Microscopy_Data = models.TextField(null=True, blank=True)
    Culture_Report = models.TextField(null=True, blank=True)
    Report_Type = models.CharField(max_length=100, null=True, blank=True)
    Input_Type = models.CharField(max_length=70, null=True, blank=True)
    Test_Method = models.CharField(max_length=150, null=True, blank=True)
    Report_Status = models.CharField(max_length=35, null=True, blank=True)
    micronumber = models.CharField(max_length=75, null=True, blank=True)
    histonumber = models.CharField(max_length=74, null=True, blank=True)
    Bacteria_Isolated = models.TextField(null=True, blank=True)
    IsSubTest = models.CharField(max_length=25, null=True, blank=True)
    SubTestCodes = models.CharField(max_length=255, null=True, blank=True)
    Transfer_Location = models.CharField(max_length=255, null=True, blank=True)
    site =models.CharField(max_length=255, null=True, blank=True)
    macroscopy = models.CharField(max_length=255, null=True, blank=True)
    Result = models.CharField(max_length=255, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    srfId = models.CharField(max_length=50, null=True, blank=True)
    icmrId = models.CharField(max_length=50, null=True, blank=True)
    specimenCondition = models.CharField(max_length=50, null=True, blank=True)
    covidType = models.CharField(max_length=50, null=True, blank=True)
    covidResult = models.CharField(max_length=50, null=True,blank=True)
    uom = models.CharField(max_length=50, null=True,blank=True)
    labtechnician = models.CharField(max_length=100, null=True,blank=True)
    pathologyyesorno = models.CharField(max_length=500,null=True,blank=True)
    pathologyremarks = models.TextField(null=True,blank=True)
    abstinence = models.CharField(max_length=500,null=True,blank=True)
    acid_fast = models.CharField(max_length=300,null=True,blank=True)
    positivity = models.CharField(max_length=300,null=True,blank=True)
    

    class Meta:
        db_table = 'AnalyseInvestigationResult'
      

class AnalyseInvestigationSenior(models.Model):
    Sl_No = models.AutoField(primary_key=True)
    Test = models.CharField(max_length=200, null=True, blank=True)
    Billing_invoice = models.CharField(max_length=30, null=True, blank=True, db_index=True)
    Patent_Name = models.CharField(max_length=250, null=True, blank=True)
    Visit_Id = models.CharField(max_length=10, null=True, blank=True)
    Sample_Specimen = models.CharField(max_length=250, null=True, blank=True)
    Method = models.CharField(max_length=55, null=True, blank=True)
    Previous_Value = models.CharField(max_length=300, null=True, blank=True)
    Capture_Value = models.CharField(max_length=300, null=True, blank=True)
    Panic_Low = models.CharField(max_length=350, null=True, blank=True)
    Panic_High = models.CharField(max_length=350, null=True, blank=True)
    Medical_Remark = models.CharField(max_length=500, null=True, blank=True)
    Technical_Remark = models.CharField(max_length=500, null=True, blank=True)
    Status = models.CharField(max_length=350, null=True, blank=True, db_index=True)
    Patient_Id = models.CharField(max_length=25, null=True, db_index=True)
    Colony_Count = models.CharField(max_length=1500, null=True, blank=True)
    Capture_Organism = models.CharField(max_length=150, null=True, blank=True)
    Location = models.CharField(max_length=200, null=True, blank=True)
    CreatedBy = models.CharField(max_length=150, null=True, blank=True)
    EditContent = models.TextField(null=True, blank=True)
    Department = models.CharField(max_length=155, null=True, blank=True)
    Reference = models.CharField(max_length=25, null=True, blank=True)
    Reference_Range = models.CharField(max_length=450, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    Notes = models.TextField(null=True, blank=True)
    Microscopy_Data = models.TextField(null=True, blank=True)
    Culture_Report = models.TextField(null=True, blank=True)
    Report_Type = models.CharField(max_length=100, null=True, blank=True)
    Input_Type = models.CharField(max_length=100, null=True, blank=True)
    Report_Status = models.CharField(max_length=35, null=True, blank=True)
    micronumber = models.CharField(max_length=30, null=True, blank=True)
    histonumber = models.CharField(max_length=30, null=True, blank=True)
    Bacteria_Isolated = models.TextField(null=True, blank=True)
    IsSubTest = models.CharField(max_length=25, null=True, blank=True)
    SubTestCodes = models.CharField(max_length=255, null=True, blank=True)
    Transfer_Location = models.CharField(max_length=255, null=True, blank=True)
    site =models.CharField(max_length=255, null=True, blank=True)
    macroscopy = models.CharField(max_length=255, null=True, blank=True)
    Result = models.CharField(max_length=255, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    srfId = models.CharField(max_length=50, null=True, blank=True)
    icmrId = models.CharField(max_length=50, null=True, blank=True)
    specimenCondition = models.CharField(max_length=50, null=True, blank=True)
    covidType = models.CharField(max_length=50, null=True, blank=True)
    covidResult = models.CharField(max_length=50, null=True,blank=True)
    uom = models.CharField(max_length=50, null=True,blank=True)
    labtechnician = models.CharField(max_length=100, null=True,blank=True)
    DoctorID = models.CharField(max_length=100, null=True,blank=True)
    pathologyyesorno = models.CharField(max_length=500,null=True,blank=True)
    pathologyremarks = models.TextField(null=True,blank=True)
    abstinence = models.CharField(max_length=500,null=True,blank=True)
    acid_fast = models.CharField(max_length=300,null=True,blank=True)
    positivity = models.CharField(max_length=300,null=True,blank=True)
    Reportfile = models.BinaryField(null=True, blank=True)
    rangeType = models.CharField(max_length=300,null=True,blank=True)

    class Meta:
        db_table = 'AnalyseInvestigationSenior'


class ApproveTestPathologist(models.Model):
    Sl_No = models.AutoField(primary_key=True)
    Test = models.CharField(max_length=200, null=True, blank=True)
    Billing_invoice = models.CharField(max_length=30, null=True, blank=True, db_index=True)
    Patent_Name = models.CharField(max_length=250, null=True, blank=True)
    Visit_Id = models.CharField(max_length=10, null=True, blank=True)
    Sample_Specimen = models.CharField(max_length=250, null=True, blank=True)
    Method = models.CharField(max_length=55, null=True, blank=True)
    Previous_Value = models.CharField(max_length=300, null=True, blank=True)
    Capture_Value = models.CharField(max_length=300, null=True, blank=True)
    Panic_Low = models.CharField(max_length=350, null=True, blank=True)
    Panic_High = models.CharField(max_length=350, null=True, blank=True)
    Medical_Remark = models.CharField(max_length=500, null=True, blank=True)
    Technical_Remark = models.CharField(max_length=500, null=True, blank=True)
    Status = models.CharField(max_length=350, null=True, blank=True, db_index=True)
    Patient_Id = models.CharField(max_length=25, null=True, db_index=True)
    Colony_Count = models.CharField(max_length=1500, null=True, blank=True)
    Capture_Organism = models.CharField(max_length=150, null=True, blank=True)
    Location = models.CharField(max_length=200, null=True, blank=True)
    CreatedBy = models.CharField(max_length=150, null=True, blank=True)
    EditContent = models.TextField(null=True, blank=True)
    Reference = models.CharField(max_length=25, null=True, blank=True)
    Reference_Range = models.CharField(max_length=450, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    Notes = models.TextField(null=True, blank=True)
    Microscopy_Data = models.TextField(null=True, blank=True)
    Culture_Report = models.TextField(null=True, blank=True)
    Report_Type = models.CharField(max_length=100, null=True, blank=True)
    Report_Status = models.CharField(max_length=35, null=True, blank=True)
    micronumber = models.CharField(max_length=20, null=True, blank=True)
    histonumber = models.CharField(max_length=20, null=True, blank=True)
    Bacteria_Isolated = models.TextField(null=True, blank=True)
    IsSubTest = models.CharField(max_length=25, null=True, blank=True)
    SubTestCodes = models.CharField(max_length=255, null=True, blank=True)
    Transfer_Location = models.CharField(max_length=255, null=True, blank=True)
    uom = models.CharField(max_length=100, null=True, blank=True)
    site =models.CharField(max_length=255, null=True, blank=True)
    macroscopy = models.CharField(max_length=255, null=True, blank=True)
    Result = models.CharField(max_length=255, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    srfId = models.CharField(max_length=50, null=True, blank=True)
    icmrId = models.CharField(max_length=50, null=True, blank=True)
    specimenCondition = models.CharField(max_length=50, null=True, blank=True)
    covidType = models.CharField(max_length=50, null=True, blank=True)
    covidResult = models.CharField(max_length=50, null=True,blank=True)
    labtechnician = models.CharField(max_length=100, null=True,blank=True)
    DoctorID = models.CharField(max_length=100, null=True,blank=True)
    pathologyyesorno = models.CharField(max_length=500,null=True,blank=True)
    pathologyremarks = models.TextField(null=True,blank=True)
    abstinence = models.CharField(max_length=500,null=True,blank=True)
    acid_fast = models.CharField(max_length=300,null=True,blank=True)
    positivity = models.CharField(max_length=300,null=True,blank=True)
    Reportfile = models.BinaryField(null=True, blank=True)
    rangeType = models.CharField(max_length=300,null=True,blank=True)

    class Meta:
        db_table = 'Approve_Test_Pathologist'


class CompletedLabReport(models.Model):
    Report_Id = models.IntegerField(primary_key=True)
    Dispatched_Id = models.CharField(max_length=10, null=True, blank=True)
    Billing_Invoice = models.CharField(max_length=30, null=True, blank=True)
    Patient_Id = models.CharField(max_length=30, null=True, blank=True)
    Patient_Name = models.CharField(max_length=75, null=True, blank=True)
    Visit_Id = models.CharField(max_length=29, null=True, blank=True)
    Refering_Doctor = models.CharField(max_length=255, null=True, blank=True)
    ReportSatus = models.CharField(max_length=25, null=True, blank=True)
    Patient_Barcode = models.CharField(max_length=25, null=True, blank=True)
    Sample_Barcode = models.CharField(max_length=25, null=True, blank=True)
    Location = models.CharField(max_length=150, null=True, blank=True)
    CreatedBy = models.CharField(max_length=50, null=True, blank=True)
    Reprint_Reason = models.CharField(max_length=200, null=True, blank=True)
    Report = models.BinaryField(null=True, blank=True)

    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Completed_Lab_Report_Table'

        

class CompleteCultureExamination(models.Model):
    
    Culture_Id = models.IntegerField(primary_key=True)
    Billing_Invoice = models.CharField(max_length=30, null=True, blank=True)
    Patient_Id = models.CharField(max_length=30, null=True, blank=True)
    Patient_Name = models.CharField(max_length=150, null=True, blank=True)
    Visit_Id = models.CharField(max_length=10, null=True, blank=True)
    Refering_Doctor = models.CharField(max_length=150, null=True, blank=True)
    Antibiotic_Name = models.CharField(max_length=150, null=True, blank=True)
    Antibiotic_Value = models.CharField(max_length=30,null= True,blank=True)
    sensitiverange = models.CharField(max_length=30,null= True,blank=True)
    intermediaterange = models.CharField(max_length=30,null= True,blank=True)
    resistantrange = models.CharField(max_length=30,null= True,blank=True)
    Sensitive_Type = models.CharField(max_length=75, null=True, blank=True)
    Captured_Oraganism = models.CharField(max_length=400, null=True, blank=True)
    CreatedBy = models.CharField(max_length=50, null=True, blank=True)
    Location = models.CharField(max_length=100, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    ColonyCount  = models.CharField(max_length=255,null=True,blank=True)
    class Meta:
        db_table = 'Complete_Culture_Examination' 


class HistoTemplate(models.Model):
    Histo_Templates_Id = models.IntegerField(primary_key=True)
    Billing_Invoice = models.CharField(max_length=30, null=True, blank=True)
    Patient_Id = models.CharField(max_length=30, null=True, blank=True)
    Visit_Id = models.CharField(max_length=10, null=True, blank=True)
    Captured_Organism = models.CharField(max_length=400, null=True, blank=True)
    CreatedBy = models.CharField(max_length=50, null=True, blank=True)
    Location = models.CharField(max_length=100, null=True, blank=True)
    Format = models.CharField(max_length=255, null=True, blank=True)

    # Common fields
    Impression = models.TextField(null=True, blank=True)
    Specimen = models.TextField(null=True, blank=True)
    Microscopy = models.TextField(null=True, blank=True)
    Note = models.TextField(null=True, blank=True)
    Cyto_No = models.CharField(max_length=500, null=True, blank=True)
    Report_Status = models.CharField(max_length=500, null=True, blank=True)
    Clinical_Data = models.TextField(null=True, blank=True)
    Clinical_Comment = models.TextField(null=True, blank=True)
    Specimen_Category = models.TextField(null=True, blank=True)
    Gross_Findings = models.TextField(null=True, blank=True)
    Diagnostic_Summary = models.TextField(null=True, blank=True)
    Comments = models.TextField(null=True, blank=True)
    HPE_No = models.TextField(null=True, blank=True)

    # Peripheral Smear
    RBC = models.TextField(null=True, blank=True)
    WBC = models.TextField(null=True, blank=True)
    Platelets = models.TextField(null=True, blank=True)
    Parasite = models.TextField(null=True, blank=True)

    # LBC
    Clinical_History = models.TextField(null=True, blank=True)
    Specimen_Adequacy = models.TextField(null=True, blank=True)
    Microscopic_Observations = models.TextField(null=True, blank=True)

    # FNAC
    Site = models.TextField(null=True, blank=True)
    Gross = models.TextField(null=True, blank=True)
    Stains_Used = models.TextField(null=True, blank=True)

    # Pathology Report
    Microscopic_Findings = models.TextField(null=True, blank=True)
    Histo_Image = models.BinaryField(null=True, blank=True)
    Test_Code = models.CharField(max_length=255, null=True, blank=True)
    HPE_Diagnosis = models.TextField(null=True, blank=True)
    Disclaimer = models.TextField(null=True, blank=True)

    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'histo_templates'



class Billing_Item_Table_for_lab(models.Model):
    Item_Id = models.AutoField(primary_key=True)
    Billing_Invoice = models.CharField(max_length=30, null=True, db_index=True)
    Patient_Id = models.CharField(max_length=30,null=True, db_index=True)
    Visit_Id = models.IntegerField(null=True, db_index=True)
    Patient_Name = models.CharField(max_length=250, null=True)
    Dispatch_Method = models.CharField(max_length=250, null=True)
    Test_Method = models.CharField(max_length=30, null=True)
    Test_Name = models.CharField(max_length=250, null=True)
    Gross_Amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    Location = models.CharField(max_length=300, null=True, db_index=True)
    Service_Status = models.CharField(max_length=300, null=True, db_index=True)
    Analysis_Status = models.CharField(max_length=300, null=True, db_index=True)
    Verify_Status = models.CharField(max_length=300, null=True, db_index=True)
    Approve_Status = models.CharField(max_length=300, null=True, db_index=True)
    Barcode_Id = models.CharField(max_length=20, null=True)
    Group_Name = models.CharField(max_length=250, null=True)
    CreatedBy = models.CharField(max_length=30, null=True)
    Billing_Date = models.CharField(max_length=25, null=True)
    Test_Code = models.CharField(max_length=50, null=True, db_index=True)
    Group_Code = models.CharField(max_length=50, null=True)
    individual_add_amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    IsSubTest = models.CharField(max_length=25, null=True)
    SubTestCodes = models.CharField(max_length=255, null=True)
    Transfer_Location = models.CharField(max_length=80, null=True)
    PackageCode = models.CharField(max_length=80, null=True)
    PackageName = models.CharField(max_length=255, null=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True, db_index=True)
    Bill_Status = models.CharField(max_length=255, null=True, blank=True, default="Pending")
    isedit = models.IntegerField(default=0)


    class Meta:
        db_table = "Billing_Item_Table_for_lab"
        
     
        indexes = [
            # ✅ Index 1: For patient queue
            models.Index(
                fields=['Location', 'Analysis_Status', 'CreatedAt'],
                name='idx_loc_status_date'
            ),
            # ✅ Index 2: For result entry
            models.Index(
                fields=['Billing_Invoice', 'Test_Code'],
                name='idx_invoice_test'
            ),
        ]
        
class BillingInvoiceAndBillAmount(models.Model):
    Billing_Id = models.AutoField(primary_key=True)
    Billing_Invoice = models.CharField(max_length=35, null=True, db_index=True)
    Patient_Id = models.CharField(max_length=30,null=True, db_index=True)
    Visit_Id = models.IntegerField(null=True, db_index=True)
    Patient_Name = models.CharField(max_length=250, null=True)
    Item_Count = models.IntegerField(null=True)
    Total_Charge = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    Discount_Type = models.CharField(max_length=250, null=True)
    Discount = models.CharField(max_length=25, null=True)
    Net_Amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    Status = models.CharField(max_length=200, null=True)
    Location = models.CharField(max_length=300, null=True, db_index=True)
    Capture_Sample_Status = models.CharField(max_length=200, null=True, db_index=True)
    Analyze_Status = models.CharField(max_length=200, null=True, db_index=True)
    Verify_Status = models.CharField(max_length=200, null=True)
    Approve_Status = models.CharField(max_length=200, null=True)
    Barcode_Id = models.CharField(max_length=20, null=True)
    Group_Name = models.CharField(max_length=250, null=True)
    CreatedBy = models.CharField(max_length=30, null=True)
    Billing_Date = models.CharField(max_length=25, null=True)
    Billing_Type = models.CharField(max_length=100, null=True)
    RateCard_Name = models.CharField(max_length=100, null=True)
    Test_Code = models.CharField(max_length=50, null=True)
    Group_Code = models.CharField(max_length=50, null=True)
    TotalPaidAmount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    BalanceAmount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    Sample_Barcode_Image = models.BinaryField(null=True)
    AdditionalAmount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    AdditionalAmountReason = models.CharField(max_length=255, null=True)
    DiscountReason = models.CharField(max_length=255, null=True)
    HistoNumber = models.CharField(max_length=255, null=True)
    MicroNumber = models.CharField(max_length=255, null=True)
    Transfer_Location = models.CharField(max_length=255, null=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    Registration_Id = models.CharField(max_length=255,null=True,blank=True)
    Request_Id = models.CharField(max_length=255,null=True,blank=True)
    isedit = models.BooleanField(default=False)


    class Meta:
        db_table = "Billing_invoice_and_bill_amount"
        

class BarcodeId(models.Model):
    Sl_No = models.AutoField(primary_key=True)
    invoice_no = models.CharField(max_length=30, null=True)
    barcode_id = models.CharField(max_length=100, null=True)
    Patient_Id = models.CharField(max_length=10, null=True)
    Visit_Id = models.CharField(max_length=10, null=True)
    Patient_Name = models.CharField(max_length=155, null=True)
    Test_Name = models.CharField(max_length=250, null=True)
    Test_Code = models.CharField(max_length=100, null=True)
    Barcode = models.BinaryField(null=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "barcode_id"
        
class PatientVisitId(models.Model):
    S_No = models.AutoField(primary_key=True)
    Visit_Id = models.IntegerField(null=True, db_index=True)
    Patient_Name = models.CharField(max_length=250, null=True)
    Patient_Id = models.CharField(max_length=30,null=True, db_index=True)
    Phone = models.CharField(max_length=20, null=True)
    Visit_Type = models.CharField(max_length=250, null=True)
    Phlebotomist_Type = models.CharField(max_length=250, null=True)
    Phlebotomist_Name = models.CharField(max_length=250, null=True)
    Refering_Doctor = models.CharField(max_length=250, null=True)
    Patient_Group = models.CharField(max_length=250, null=True)
    Dispatch_Method = models.CharField(max_length=200, null=True)
    Patient_Barcode = models.CharField(max_length=20, null=True)
    CreatedBy = models.CharField(max_length=30, null=True)
    Location = models.CharField(max_length=60, null=True)
    Outsourced_Type = models.CharField(max_length=68, null=True)
    Refering_Hospital = models.CharField(max_length=350, null=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "Patient_Visit_Id"
        

class Register_patient_Details(models.Model):
    Patient_Id = models.CharField(primary_key=True, max_length=30)
    Title = models.CharField(max_length=10, null=True, blank=True)
    Patient_Name = models.CharField(max_length=250, null=True, blank=True)
    Father_Name = models.CharField(max_length=250, null=True, blank=True)
    DOB = models.CharField(max_length=100, null=True, blank=True)
    Age = models.CharField(max_length=100,null=True, blank=True)
    Gender = models.CharField(max_length=150, null=True, blank=True)
    Marital_Status = models.CharField(max_length=200, null=True, blank=True)
    Door_No = models.CharField(max_length=255, null=True, blank=True)
    Street = models.CharField(max_length=1000, null=True, blank=True)
    Rural_Urban = models.CharField(max_length=250, null=True, blank=True)
    City = models.CharField(max_length=250, null=True, blank=True)
    State = models.CharField(max_length=250, null=True, blank=True)
    Pincode = models.CharField(max_length=10, null=True, blank=True)
    Phone = models.CharField(max_length=20, null=True, blank=True)
    Alternate_No = models.CharField(max_length=20, null=True, blank=True)
    Email = models.CharField(max_length=300, null=True, blank=True)
    Location = models.CharField(max_length=300, null=True, blank=True)
    Patient_Barcode = models.CharField(max_length=19, null=True, blank=True)
    Time_Period = models.CharField(max_length=30, null=True, blank=True)
    CreatedBy = models.CharField(max_length=30, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "Register_patient_Details"
    
    

class SampleCaptureInPhelobotomist(models.Model):
    Sample_Id = models.IntegerField(primary_key=True)
    Patient_Id = models.CharField(max_length=30,null=True, blank=True, db_index=True)
    Patient_Name = models.CharField(max_length=150, null=True, blank=True)
    Billing_Invoice = models.CharField(max_length=25, null=True, blank=True, db_index=True)
    Test_Name = models.CharField(max_length=230, null=True, blank=True)
    Captured_Unit = models.CharField(max_length=50, null=True, blank=True)
    Status = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    Medical_Remarks = models.CharField(max_length=2000, null=True, blank=True)
    Technical_Remark = models.CharField(max_length=2000, null=True, blank=True)
    UOM = models.CharField(max_length=80, null=True, blank=True)
    Location = models.CharField(max_length=55, null=True, blank=True)
    Visit_Id = models.CharField(max_length=15, null=True, blank=True)
    CreatedBy = models.CharField(max_length=155, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    Transfer_Location = models.CharField(max_length=255, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Sample_Capture_in_Phelobotomist'
        


# class Test_Descriptions(models.Model):
#     Test_Id = models.IntegerField(primary_key=True)
#     Test_Name = models.CharField(max_length=1000, null=True, blank=True)
#     Test_Code = models.CharField(max_length=255, null=True, blank=True)
#     Department = models.CharField(max_length=200, null=True, blank=True)
#     Sub_Department = models.CharField(max_length=200, null=True, blank=True)
#     Header = models.CharField(max_length=1000, null=True, blank=True)
#     Display_Text = models.CharField(max_length=1000, null=True, blank=True)
#     Billing_Name = models.CharField(max_length=1000, null=True, blank=True)
#     Container_Name = models.CharField(max_length=300, null=True, blank=True)
#     Specimen_Name = models.CharField(max_length=300, null=True, blank=True)
#     Method_Name = models.CharField(max_length=300, null=True, blank=True)
#     Gender = models.CharField(max_length=300, null=True, blank=True)
#     Input_Type = models.CharField(max_length=390, null=True, blank=True)
#     Decimal_Palces = models.IntegerField(null=True, blank=True)
#     Input_Pattern_Type = models.CharField(max_length=200, null=True, blank=True)
#     Test_Category = models.CharField(max_length=300, null=True, blank=True)
#     Logical_Category = models.CharField(max_length=300, null=True, blank=True)
#     Captured_Unit = models.CharField(max_length=30, null=True, blank=True)
#     UOM = models.CharField(max_length=30, null=True, blank=True)
#     Report_Type = models.CharField(max_length=200, null=True, blank=True)
#     Test_Instructions = models.CharField(max_length=500, null=True, blank=True)
#     Loinc_Code = models.CharField(max_length=200, null=True, blank=True)
#     Allow_Discount = models.CharField(max_length=20, null=True, blank=True)
#     Oderable = models.CharField(max_length=30, null=True, blank=True)
#     Show_Graph = models.CharField(max_length=30, null=True, blank=True)
#     Active_Status = models.CharField(max_length=30, null=True, blank=True)
#     STAT = models.CharField(max_length=35, null=True, blank=True)
#     Non_Reportable = models.CharField(max_length=20, null=True, blank=True)
#     Calculated_Test = models.CharField(max_length=30, null=True, blank=True)
#     Outsourced = models.CharField(max_length=20, null=True, blank=True)
#     Processing_Time = models.CharField(max_length=20, null=True, blank=True)
#     Emergency_Processing_Time = models.CharField(max_length=20, null=True, blank=True)
#     Period_Type = models.CharField(max_length=20, null=True, blank=True)
#     Formula = models.CharField(max_length=150, null=True, blank=True)
#     Parameter_One = models.CharField(max_length=200, null=True, blank=True)
#     Parameter_Two = models.CharField(max_length=200, null=True, blank=True)
#     Autocheck = models.CharField(max_length=20, null=True, blank=True)
#     Culturetest = models.CharField(max_length=20, null=True, blank=True)
#     Is_NABHL = models.CharField(max_length=20, null=True, blank=True)
#     Is_CAP = models.CharField(max_length=20, null=True, blank=True)
#     Is_Machine_Interfaced = models.CharField(max_length=20, null=True, blank=True)
#     Machine_Name = models.CharField(max_length=250, null=True, blank=True)
#     Reagent_Level = models.CharField(max_length=25, null=True, blank=True)
#     Assay_Code = models.CharField(max_length=25, null=True, blank=True)
#     Status = models.CharField(max_length=75, null=True, blank=True)
#     IsSubTest = models.CharField(max_length=20, null=True, blank=True)
#     SubTestCodes = models.CharField(max_length=250, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Test_Descriptions'
        
        

class TestRemark(models.Model):
    Test_Id = models.IntegerField(primary_key=True)
    Test_Name = models.CharField(max_length=1000, null=True, blank=True)
    Validation = models.CharField(max_length=200, null=True, blank=True)
    Remark_Type = models.CharField(max_length=500, null=True, blank=True)
    Remark = models.CharField(max_length=550, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Test_Remark'
        
        

class TestReferenceRange(models.Model):
    Test_Id = models.IntegerField(primary_key=True)
    Test_Name = models.CharField(max_length=1000, null=True, blank=True)
    Analizer_Type = models.CharField(max_length=350, null=True, blank=True)
    validation = models.CharField(max_length=300, null=True, blank=True)
    Method_Type = models.CharField(max_length=350, null=True, blank=True)
    Gender = models.CharField(max_length=50, null=True, blank=True)
    Range_Lower_Limit = models.IntegerField(null=True, blank=True)
    Range_Higher_Limit = models.IntegerField(null=True, blank=True)
    Reference_Range_Text = models.CharField(max_length=400, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Test_Reference_Range'
        

# class TestPricing(models.Model):
#     Test_id = models.IntegerField(primary_key=True)
#     Test_Name = models.CharField(max_length=1000, null=True, blank=True)
#     Basic = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
#     RMC = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     Test_Code = models.CharField(max_length=50, null=True, blank=True)
#     L2L = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     Sri_Ram_Medical_Center = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     SriRamMedicalCenter = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     AndersonDiagnosis = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     ShwethaHospital = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     VividImagingAndDiagnostics = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     SvhSpecalityHospital = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     SrinidhiHospital = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     SrinivasHospital = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     thanjavur = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     ShanviMindcareDeaddictionCenter = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     DeepanHospital = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     JananiFertilityCentre = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     Self = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     KrishnaHospital = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     SundaramHospitalTrichy = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     Dinduigal = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, default=0.000)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Testmaster_Cost_List'   
        

# class Testmaster_Rule_Based(models.Model):
#     Test_Id = models.IntegerField(primary_key=True)
#     Test_Name = models.CharField(max_length=1000, null=True, blank=True)
#     Validation_type = models.CharField(max_length=250, null=True, blank=True)
#     Gender = models.CharField(max_length=55, null=True, blank=True)
#     Rule_Type = models.CharField(max_length=300, null=True, blank=True)
#     Remark = models.CharField(max_length=350, null=True, blank=True)
#     Test_Code = models.CharField(max_length=50, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Testmaster_Rule_Based'
        
# class TestInterpretation(models.Model):
#     Test_Id = models.IntegerField(primary_key=True)
#     Test_Name = models.CharField(max_length=1000, null=True, blank=True)
#     Header_interpretation = models.CharField(max_length=200, null=True, blank=True)
#     Comments = models.CharField(max_length=2000, null=True, blank=True)
#     Test_Code = models.CharField(max_length=50, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Testmaster_Interpretation_table'
        
# class ReflexTest(models.Model):
#     Test_id = models.IntegerField(primary_key=True)
#     Test_Name = models.CharField(max_length=200, null=True, blank=True)
#     Main_Test = models.CharField(max_length=200, null=True, blank=True)
#     Reflex_Test = models.CharField(max_length=200, null=True, blank=True)
#     Reflex_Code = models.CharField(max_length=200, null=True, blank=True)
#     Test_Code = models.CharField(max_length=50, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Testmaster_Reflex_Test'
        
        
class AntibioticGroup(models.Model):
    anti_biotic_group_id = models.IntegerField(primary_key=True)
    anti_biotic_group_code = models.CharField(max_length=100, null=True, blank=True)
    anti_biotic_group_des = models.CharField(max_length=100, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'AntibioticGroups'
        
# class Antibiotic(models.Model):
#     anti_biotic_id = models.IntegerField(primary_key=True)
#     anti_biotic_group_code = models.CharField(max_length=100, null=True, blank=True)
#     anti_biotic_code = models.CharField(max_length=100, null=True, blank=True)
#     anti_biotic_des = models.CharField(max_length=100, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'AntibioticMaster'
        
class Organism(models.Model):
    organism_id = models.IntegerField(primary_key=True)
    organism_code = models.CharField(max_length=100, null=True, blank=True)
    organism_name = models.CharField(max_length=100, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'OrganismMaster'
        
        

class GroupMaster(models.Model):
    group_master_id = models.IntegerField(primary_key=True)
    group_code = models.CharField(max_length=100, null=True, blank=True)
    group_name = models.CharField(max_length=100, null=True, blank=True)
    display_name = models.CharField(max_length=100, null=True, blank=True)
    billing_code = models.CharField(max_length=100, null=True, blank=True)
    billing_name = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)
    report = models.CharField(max_length=100, null=True, blank=True)
    department_name = models.CharField(max_length=100, null=True, blank=True)
    test_category = models.CharField(max_length=100, null=True, blank=True)
    logical_category = models.CharField(max_length=100, null=True, blank=True)
    authorized_user = models.CharField(max_length=100, null=True, blank=True)
    loinc_code = models.CharField(max_length=100, null=True, blank=True)
    Group_Cost = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    InterpretationHead = models.CharField(max_length=500, null=True, blank=True)
    Interpretation = models.CharField(max_length=5000, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'GroupMaster'
        

class GroupmasterTestlist(models.Model):
    Groupmaster_testlist_id = models.IntegerField(primary_key=True)
    group_code = models.CharField(max_length=100, null=True, blank=True)
    group_name = models.CharField(max_length=100, null=True, blank=True)
    test_name = models.CharField(max_length=100, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'GroupMasterTestList'
        
        
class CommissionMaster(models.Model):
    Commission_Id = models.AutoField(primary_key=True)
    Doctor_Name = models.CharField(max_length=120, null=True, blank=True)
    Doctor_Type = models.CharField(max_length=55, null=True, blank=True)
    Phone = models.CharField(max_length=15, null=True, blank=True)
    Commission_Percentage = models.CharField(max_length=10, null=True, blank=True)
    Address_One = models.CharField(max_length=350, null=True, blank=True)
    Address_Two = models.CharField(max_length=450, null=True, blank=True)
    Status = models.CharField(max_length=200, null=True, blank=True)
    Payment_Type = models.CharField(max_length=200, null=True, blank=True)
    Bank_Name = models.CharField(max_length=300, null=True, blank=True)
    Holder_Name = models.CharField(max_length=450, null=True, blank=True)
    Account_Number = models.CharField(max_length=30, null=True, blank=True)
    Location = models.CharField(max_length=55, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Refering_Doctor_Commission'
        
        
class RatecardMaster(models.Model):
    Ratecard_Id = models.CharField(primary_key=True, max_length=10)
    Test_Name = models.CharField(max_length=350, null=True, blank=True)
    CreatedBy = models.CharField(max_length=155, null=True, blank=True)
    Test_Code = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Outsource_Ratecard_List'
        
        


# class Document(models.Model):
#     Document_Id = models.AutoField(primary_key=True)
#     Department_Name = models.CharField(max_length=299, null=True, blank=True)
#     Test_Name = models.CharField(max_length=1000, null=True, blank=True)
#     Word_File = models.BinaryField(null=True, blank=True)
#     Test_Code = models.CharField(max_length=50, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Word_Document_for_result'
        
        
class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    location_name = models.CharField(max_length=255, null=True, blank=True)
    Status = models.CharField(max_length=10, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'UserControl_location'
        
class OrganizationDetails(models.Model):
    S_No = models.BigAutoField(primary_key=True)
    Organization = models.CharField(max_length=60, null=True, blank=True)
    Email = models.CharField(max_length=50, null=True, blank=True)
    Phone_no = models.CharField(max_length=20, null=True, blank=True)
    Land_line = models.CharField(max_length=20, null=True, blank=True)
    Gst_No = models.CharField(max_length=20, null=True, blank=True)
    Door_no = models.CharField(max_length=20, null=True, blank=True)
    Street = models.CharField(max_length=200, null=True, blank=True)
    Area = models.CharField(max_length=200, null=True, blank=True)
    City = models.CharField(max_length=500, null=True, blank=True)
    Pincode = models.CharField(max_length=10, null=True, blank=True)
    State = models.CharField(max_length=150, null=True, blank=True)
    Country = models.CharField(max_length=50, null=True, blank=True)
    Location = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Organization_Details'
        

class LabDetails(models.Model):
    S_No = models.BigAutoField(primary_key=True)
    Lab_Name = models.CharField(max_length=100, null=True, blank=True)
    Register_No = models.CharField(max_length=25, null=True, blank=True)
    Labcode = models.CharField(max_length=10, null=True, blank=True)
    Address = models.CharField(max_length=500, null=True, blank=True)
    Email = models.CharField(max_length=100, null=True, blank=True)
    Phone_No = models.CharField(max_length=20, null=True, blank=True)
    Pincode = models.CharField(max_length=20, null=True, blank=True)
    Referencecode = models.CharField(max_length=20, null=True, blank=True)
    SourceType = models.CharField(max_length=30, null=True, blank=True)
    Location = models.CharField(max_length=50, null=True, blank=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'External_Lab_Details'
        
# class Age_Setup_Master(models.Model):
#     S_No = models.BigAutoField(primary_key=True)
#     TestName = models.CharField(max_length=250, null=True, blank=True)
#     Gender = models.CharField(max_length=255, null=True, blank=True)
#     FromAge = models.CharField(max_length=10, null=True, blank=True)
#     FromAgeType = models.CharField(max_length=255, null=True, blank=True)
#     Toage = models.CharField(max_length=20, null=True, blank=True)
#     ToAgeType = models.CharField(max_length=255, null=True, blank=True)
#     From_Value = models.CharField(max_length=30, null=True, blank=True)
#     To_Value = models.CharField(max_length=30, null=True, blank=True)
#     PanicLow = models.CharField(max_length=30, null=True, blank=True)
#     PanicHigh = models.CharField(max_length=30, null=True, blank=True)
#     NormalValue = models.CharField(max_length=30, null=True, blank=True)
#     Reference_Range = models.CharField(max_length=2000, null=True, blank=True)
#     Test_Code = models.CharField(max_length=50, null=True, blank=True)
#     UpdatedAt = models.DateTimeField(auto_now=True)
#     CreatedAt = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'Age_Setup_Master'
        
        
        
class LIS_MACHINERESULT(models.Model):
    LIS_ID = models.AutoField(primary_key=True)
    LIS_MACHNAME = models.CharField(max_length=30, null=True, blank=True)
    LIS_MACHID = models.CharField(max_length=20, null=True, blank=True)
    LIS_LABID = models.CharField(max_length=20, null=True, blank=True)
    LIS_SAMPLENO = models.CharField(max_length=20, null=True, blank=True, db_index=True)
    LIS_Test_Code = models.CharField(max_length=25, null=True, blank=True)
    LIS_MACHTESTID = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    LIS_MACHRESULTS = models.CharField(max_length=50, null=True, blank=True)
    LIS_ALARAM = models.CharField(max_length=10, null=True, blank=True)
    LIS_UNITS = models.CharField(max_length=10, null=True, blank=True)
    LIS_REFERENCE = models.CharField(max_length=30, null=True, blank=True)
    LIS_RESFLAG = models.CharField(max_length=10, null=True, blank=True)
    LIS_TESTDEPT = models.CharField(max_length=20, null=True, blank=True)
    LIS_RPREVIEW = models.IntegerField(null=True, blank=True)
    LIS_CREATEDDTTM = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    IsProcessed = models.CharField(max_length=10, null=True, blank=True, db_index=True)
    Processed_At = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        db_table = 'LIS_MACHINERESULT'
        
class CytologyReport(models.Model):
    Histo_Templates_Id = models.AutoField(primary_key=True)
    Billing_Invoice = models.CharField(max_length=30, null=True, blank=True)
    Patient_Id = models.CharField(max_length=30, null=True, blank=True)
    Visit_Id = models.CharField(max_length=10, null=True, blank=True)
    CreatedBy = models.CharField(max_length=50, null=True, blank=True)
    Location = models.CharField(max_length=100, null=True, blank=True)
    Format = models.CharField(max_length=255, null=True, blank=True)
    Clinical_Details = models.CharField(max_length=255, blank=True, null=True)
    Specimen_Type = models.CharField(max_length=255, blank=True, null=True)
    Specimen_Adequacy = models.CharField(max_length=255, blank=True, null=True)
    Superficial_Cells = models.CharField(max_length=255, blank=True, null=True)
    Intermediate_Cells = models.CharField(max_length=255, blank=True, null=True)
    Deep_Parabasal_Cells = models.CharField(max_length=255, blank=True, null=True)
    Parabasal_Cells_1 = models.CharField(max_length=255, blank=True, null=True)
    Parabasal_Cells_2 = models.CharField(max_length=255, blank=True, null=True)
    Metaplastic_squamous_Cells = models.CharField(max_length=255, blank=True, null=True)
    Endocervical_Cells = models.CharField(max_length=255, blank=True, null=True)
    Inflammatory_cells = models.CharField(max_length=255, blank=True, null=True)
    Squamous_metaplasia = models.CharField(max_length=255, blank=True, null=True)
    Keratotic_changes = models.CharField(max_length=255, blank=True, null=True)
    Tubal_metaplasia = models.CharField(max_length=255, blank=True, null=True)
    Atrophy_1 = models.CharField(max_length=255, blank=True, null=True)
    Pregnancy_associated_changes = models.CharField(max_length=255, blank=True, null=True)
    Inflammation = models.CharField(max_length=255, blank=True, null=True)
    Atrophy_2 = models.CharField(max_length=255, blank=True, null=True)
    Radiation = models.CharField(max_length=255, blank=True, null=True)
    IUCD = models.CharField(max_length=255, blank=True, null=True)
    Repai = models.CharField(max_length=255, blank=True, null=True)
    Glandular_cells_post_hysterectomy = models.CharField(max_length=255, blank=True, null=True)
    Inflammatory_changes = models.CharField(max_length=255, blank=True, null=True)
    Doderlein_bacilli = models.CharField(max_length=255, blank=True, null=True)
    Trichomonas_Vaginalis = models.CharField(max_length=255, blank=True, null=True)
    Fungal_Organisms = models.CharField(max_length=255, blank=True, null=True)
    Shift_in_flora_suggestive_of_bacterial_vaginosis = models.CharField(max_length=255, blank=True, null=True)
    Bacteria_morphologically_consistent_with_Actinomyces_spp = models.CharField(max_length=255, blank=True, null=True)
    Cellular_changes_consistent_with_Herpes_Simplex = models.CharField(max_length=255, blank=True, null=True)
    Cellular_changes_consistent_with_CMV = models.CharField(max_length=255, blank=True, null=True)
    SQUAMOUS_CELLS = models.CharField(max_length=255, blank=True, null=True)
    GLANDULAR_CELLS = models.CharField(max_length=255, blank=True, null=True)
    Endocervical_Cells_NOS = models.CharField(max_length=255, blank=True, null=True)
    Endometrial_Cells_NOS = models.CharField(max_length=255, blank=True, null=True)
    Glandular_Cells_NOS = models.CharField(max_length=255, blank=True, null=True)
    Endocervical_cells_favour_neoplastic = models.CharField(max_length=255, blank=True, null=True)
    Glandular_cells_favour_neoplastic = models.CharField(max_length=255, blank=True, null=True)
    Endocervical_Adenocarcinoma_In_Situ = models.CharField(max_length=255, blank=True, null=True)
    Endocervical = models.CharField(max_length=255, blank=True, null=True)
    Endometrial = models.CharField(max_length=255, blank=True, null=True)
    Extra_uterine = models.CharField(max_length=255, blank=True, null=True)
    NOS = models.CharField(max_length=255, blank=True, null=True)
    Note = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Cytology_Report'

    
class Patient_Lab_Testorder(models.Model):
    orderid = models.AutoField(primary_key=True)
    samplebarcode = models.CharField(max_length=255)
    patientid = models.CharField(max_length=50)
    testname = models.CharField(max_length=255, null=True, blank=True)
    testcode = models.CharField(max_length=255)
    Assay_Code = models.CharField(max_length=25, null=True, blank=True)
    sampletype = models.CharField(max_length=255, null=True, blank=True)
    department = models.CharField(max_length=255, null=True, blank=True)
    patientname = models.CharField(max_length=255)
    dateofbirth = models.CharField(max_length=255, null=True, blank=True)
    age = models.CharField(max_length=50,null=True, blank=True)
    gender = models.CharField(max_length=50,null=True, blank=True)
    status = models.IntegerField(null=True, blank=True)
    Location = models.CharField(max_length=50, null=True, blank=True)
    updatedat = models.DateTimeField(auto_now=True)
    createdat = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Patient_Lab_Testorder'# from django.db import models

