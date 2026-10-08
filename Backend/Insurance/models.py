from django.db import models
from Frontoffice.models import *
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from django.contrib.postgres.fields import JSONField


# class Insuranse_Patient_Entery_Details(models.Model):
#     content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
#     object_id = models.CharField(max_length=255)
#     IP_Registration = GenericForeignKey('content_type', 'object_id')
#     Patient_ServiesType=models.CharField(max_length=40)
#     CreditBill=models.CharField(max_length=20,null=True,default=None)
#     PayerName=models.TextField(null=True,default=None)
#     AvailedRateCard=models.CharField(max_length=200,null=True,default=None)
#     EligibleRoomType=models.CharField(max_length=200,null=True,default=None)
#     IsDefaultPayer=models.CharField(max_length=20,null=True,default=None)
#     PolicyNo=models.CharField(max_length=40,null=True,default=None)
#     PolicyStartDate=models.DateField(null=True,default=None)
#     PolicyEndDate=models.DateField(null=True,default=None)
#     PreAuthType=models.CharField(max_length=30,null=True,default=None)
#     PreAuthTypeValue=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
#     PreAuthAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
#     PreAuthApprovalNumber=models.CharField(max_length=40,null=True,default=None)
#     PreAuthCreditLimit=models.CharField(max_length=30,null=True,default=None)
#     PreAuthCreditLimitValue=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
#     CoPaymentType=models.CharField(max_length=30,null=True,default=None)
#     CoPaymentTypeValue=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
#     CoPaymentLogic=models.CharField(max_length=100,null=True,default=None)
#     CoPaymentToBeDeductedFrom=models.CharField(max_length=100,null=True,default=None)
#     AllAreMedicalItems=models.CharField(max_length=20,null=True,default=None)
#     Papersstatus=models.CharField(max_length=40,default='DRAFT')
#     Papersstatustype=models.CharField(max_length=50,null=True,default="ORIGINAL")
#     ALNumber=models.CharField(max_length=25,null=True,default=None)
#     CINumber=models.CharField(max_length=25,null=True,default=None)
#     InwardNumber=models.CharField(max_length=25,null=True,default=None)
#     RequestedAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
#     ApprovedAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
#     DashBordStatus=models.CharField(max_length=100,null=True,default=None)
#     PageCompleted=models.CharField(max_length=100,null=True,default=None)
#     ApprovedDocumment=models.BinaryField(null=True, blank=True,default=None)
#     RejectedReason=models.TextField(null=True,default=None)
#     EnhanceStatus=models.CharField(max_length=100,null=True,default=None)
#     BillNumber=models.CharField(max_length=100,null=True,default=None)
#     MainPageCompleted=models.CharField(max_length=100,null=True,default=None)
#     SubmitedDate=models.DateField(null=True,default=None)
#     ApprovedDate=models.DateField(null=True,default=None)
#     RejectedDate=models.DateField(null=True,default=None)
#     Created_by=models.CharField(max_length=100,null=True,default=None)
#     SubmittedBy=models.CharField(max_length=100,null=True,default=None)
#     ApprovedBy=models.CharField(max_length=100,null=True,default=None)
#     RejectedBy=models.CharField(max_length=100,null=True,default=None)
#     Updated_by=models.CharField(max_length=100)
#     Created_at=models.DateTimeField(auto_now_add=True)
#     Update_at=models.DateTimeField(auto_now=True) 



class Insuranse_Patient_Entery_Details(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=255)
    IP_Registration = GenericForeignKey('content_type', 'object_id')
    Patient_ServiesType=models.CharField(max_length=40)
    Papersstatus=models.CharField(max_length=40,default='PENDING')
    Papersstatustype=models.CharField(max_length=50,default="ORIGINAL")
    ALNumber=models.CharField(max_length=25,null=True,default=None)
    CINumber=models.CharField(max_length=25,null=True,default=None)
    InwardNumber=models.CharField(max_length=25,null=True,default=None)
    RequestedAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
    ApprovedAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
    DashBordStatus=models.CharField(max_length=100,null=True,default=None)    
    MainPageCompleted=models.IntegerField(null=True,default=None) 
    PageCompleted=models.IntegerField(null=True,default=None) 
    ApprovedDocumment=models.BinaryField(null=True, blank=True,default=None)
    RejectedReason=models.TextField(null=True,default=None)
    EnhanceStatus=models.CharField(max_length=100,null=True,default=None)
    BillNumber=models.CharField(max_length=100,null=True,default=None)
    SubmitedDate=models.DateField(null=True,default=None)
    ApprovedDate=models.DateField(null=True,default=None)
    RejectedDate=models.DateField(null=True,default=None)
    Created_by=models.CharField(max_length=100,null=True,default=None)
    SubmittedBy=models.CharField(max_length=100,null=True,default=None)
    ApprovedBy=models.CharField(max_length=100,null=True,default=None)
    RejectedBy=models.CharField(max_length=100,null=True,default=None)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 


class Pre_Auth_Form_Personal_Information (models.Model):
    Insuranse_Patient=models.OneToOneField(Insuranse_Patient_Entery_Details,on_delete=models.CASCADE,related_name='Personal_Information_Insuranse_Patient')
    ESI_Coverage=models.CharField(max_length=10)
    Medico_Legal_Case=models.CharField(max_length=10)
    Employed=models.CharField(max_length=10)
    Insurance_Company=models.CharField(max_length=450)
    Policy_Number=models.CharField(max_length=50)
    Policy_Type=models.CharField(max_length=200)
    Payer_TPA_Name=models.CharField(max_length=450)
    Payer_TPA_Zone=models.CharField(max_length=200)
    Payer_TPA_Member_ID=models.CharField(max_length=50)
    PolicyStartDate=models.DateField(null=True,default=None)
    PolicyEndDate=models.DateField(null=True,default=None)
    Corporate_Name=models.CharField(max_length=450)
    Employee_ID=models.CharField(max_length=50)
    ESI_Number=models.CharField(max_length=50)
    Informed_By=models.CharField(max_length=250)
    Officer_Name=models.CharField(max_length=250)
    Police_Station=models.CharField(max_length=250)
    FIR_No=models.CharField(max_length=250)
    Code_Status=models.CharField(max_length=250)
    Type_Of_Admit=models.CharField(max_length=250)
    Admitting_Diagnosis=models.TextField()
    Created_by = models.CharField(max_length=30)
    Updated_by = models.CharField(max_length=30,default='')
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    
    
    
class preauth_transaction_history(models.Model):
    preauth_id = models.AutoField(primary_key=True)
    insurance_patient =models.ForeignKey(Insuranse_Patient_Entery_Details,on_delete=models.CASCADE)
    preauth_request_amt = models.DecimalField(max_digits=10,decimal_places=2)
    requested_date = models.CharField(max_length=50)
    isapproved = models.BooleanField(default=False)
    approved_amt = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    approved_date = models.CharField(max_length=50,null=True,blank=True)
    created_by = models.CharField(max_length=100,default="")
    approved_by = models.CharField(max_length=100,default="")
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        db_table = "preauth_transaction_history" 
    


class Client_Patient_Entry_Details(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=255)
    IP_Registration = GenericForeignKey('content_type', 'object_id')
    Patient_ServiesType=models.CharField(max_length=40)
    PreAuthDate=models.DateField(null=True,default=None)
    PreAuthAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
    DischargeDate=models.DateField(null=True,default=None)
    FinalBillAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
    RaisedAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
    ApprovedAmount=models.DecimalField(max_digits=10,decimal_places=2,null=True,default=None)
    CourierDate=models.DateField(null=True,default=None)
    SettlementDateCount=models.IntegerField(null=True,default=None)
    Papersstatus=models.CharField(default='PENDING',max_length=80)
    SubmittedBy=models.CharField(max_length=100,null=True,default=None)
    CompletedBy=models.CharField(max_length=100,null=True,default=None)
    RejectedBy=models.CharField(max_length=100,null=True,default=None)
    TdsPercentage=models.FloatField(blank=True, null=True)
    TdsAmount=models.FloatField(blank=True, null=True)
    FinalSettlementAmount=models.FloatField(blank=True, null=True)   
    IsCopayment=models.CharField(max_length=100,null=True,default=None)
    CopaymentBillAmount=models.FloatField(blank=True, null=True)
    CopaymentType=models.CharField(max_length=100,null=True,default=None)
    CopaymentTypeValue=models.FloatField(blank=True, null=True)
    CoPaymentFinalAmount=models.FloatField(blank=True, null=True)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 

class Client_Patient_Amount_Details(models.Model):
    Client_Entry=models.ForeignKey(Client_Patient_Entry_Details,on_delete=models.CASCADE,related_name='AmountTableClientDetailes')
    SettlementDate=models.DateField()
    SettlementAmount=models.DecimalField(max_digits=10,decimal_places=2)
    UTR_Number=models.CharField(max_length=200)
    Created_By=models.CharField(max_length=100)
    Updated_by=models.CharField(max_length=100)
    Created_at=models.DateTimeField(auto_now_add=True)
    Update_at=models.DateTimeField(auto_now=True) 
    
    
    
    
class Insurance_Medical_History(models.Model):
    Id = models.AutoField(primary_key=True)
    Ip_Registration_Id = models.ForeignKey(
        Patient_IP_Registration_Detials,
        on_delete=models.CASCADE,
        related_name='insurance_ip_assessments',
        null=True,
        blank=True
    )
    Casuality_Registration_Id = models.ForeignKey(
        Patient_Emergency_Registration_Detials,
        on_delete=models.CASCADE,
        related_name='insurance_casuality_assessments',
        null=True,
        blank=True
    )
    # Commented out duplicate foreign key (good practice to avoid confusion)
    # Casuality_Registration_Id = models.ForeignKey(Patient_Casuality_Registration_Detials, on_delete=models.CASCADE, related_name='Casuality_Id', null=True, blank=True)
    Presenting_Complaints = models.CharField(max_length=500)
    DetailsPresenting_Complaints = models.CharField(max_length=500)
    History_Of = models.CharField(max_length=500)
    PatientStatus_AtAdmission = models.CharField(max_length=500)
    MedicalHistory_Checkbox = models.CharField(max_length=500)
    MedicalHistory_Others = models.CharField(max_length=500)
    SocialHistory_Checkbox = models.CharField(max_length=500)
    FamilyHistory_Checkbox = models.CharField(max_length=500)
    FamilyHistory_Others = models.CharField(max_length=500)
    RelationShip = models.CharField(max_length=20)
    SurgicalHistory_Checkbox = models.CharField(max_length=500)
    SurgicalHistory_Others = models.CharField(max_length=500)
    Listnames_Anddates = models.CharField(max_length=200)
    womenMen_Checkbox = models.CharField(max_length=200)
    men_Checkbox = models.CharField(max_length=200)
    Dateoflast_colonoscopy = models.CharField(max_length=50)
    Lmp = models.CharField(max_length=50)
    NoOf_Pregnancies = models.CharField(max_length=10)
    NoOf_Deliveries = models.CharField(max_length=10)
    Vaginal = models.CharField(max_length=50)
    Csection = models.CharField(max_length=50)
    MisCarriage = models.CharField(max_length=10)
    Vip_Abortions = models.CharField(max_length=10)
    Allergies = models.CharField(max_length=500)
    Temperature = models.CharField(max_length=10)
    Pulse_Rate = models.CharField(max_length=10)
    SPO2 = models.CharField(max_length=10)
    Heart_Rate = models.CharField(max_length=10)
    RR = models.CharField(max_length=10)
    BP = models.CharField(max_length=10)
    Height = models.CharField(max_length=10)
    Weight = models.CharField(max_length=10)
    BMI = models.CharField(max_length=10)
    WC = models.CharField(max_length=10)
    HC = models.CharField(max_length=10)
    BSL = models.CharField(max_length=10)
    CVS = models.CharField(max_length=200)
    Pupil = models.CharField(max_length=200)
    UlRt = models.CharField(max_length=10)
    UlLt = models.CharField(max_length=10)
    LlRt = models.CharField(max_length=10)
    LlLt = models.CharField(max_length=10)
    Rt = models.CharField(max_length=10)
    Lt = models.CharField(max_length=10)
    RS = models.CharField(max_length=200)
    PA = models.CharField(max_length=200)
    CNS = models.CharField(max_length=200)
    Local_Examination = models.CharField(max_length=200)
    LocalOthers = models.CharField(max_length=200)
    Provisional_Diagnosis = models.CharField(max_length=500)
    isSameAsProvisional = models.CharField(max_length=10)
    Final_Diagnosis = models.CharField(max_length=500)
    Treatment_Given = models.CharField(max_length=500)
    Created_by = models.CharField(max_length=50)
    DepartmentType = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Insurance_Medical_History"  
      

class PreAuthFormExaminationFinding(models.Model):
    MRN = models.CharField(max_length=50)
    ContactNumber = models.CharField(max_length=20, blank=True, null=True)
    Location = models.CharField(max_length=100, blank=True, null=True)
    CreatedBy = models.CharField(max_length=100, blank=True, null=True)
    RelevantClinicalFindings = models.TextField(blank=True, null=True)
    MainPageCompleted = models.CharField(max_length=50, blank=True, null=True)
    PageCompleted = models.CharField(max_length=50, blank=True, null=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    UpdatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'PreAuthFormExaminationFinding'

    def __str__(self):
        return f"Examination Finding for MRN: {self.MRN}"
    
    
class DiagnosisData(models.Model):
    Id = models.AutoField(primary_key=True)
    Ip_Registration_Id = models.ForeignKey(
        Patient_IP_Registration_Detials,
        on_delete=models.CASCADE,
        related_name='diagnosis_ip_records',
        null=True,
        blank=True
    )
    Casuality_Registration_Id = models.ForeignKey(
        Patient_Casuality_Registration_Detials,
        on_delete=models.CASCADE,
        related_name='diagnosis_casuality_records',
        null=True,
        blank=True
    )
    Provisional_Diagnosis = models.CharField(max_length=500, blank=True)
    Icd_Code = models.CharField(max_length=50, blank=True)
    Type = models.CharField(max_length=50, choices=[
        ('Primary', 'Primary'),
        ('Secondary', 'Secondary'),
        ('Comorbidity', 'Comorbidity')
    ], default='Primary')
    Final_Diagnosis = models.CharField(max_length=500, blank=True)
    Icd_Code2 = models.CharField(max_length=50, blank=True)
    Type2 = models.CharField(max_length=50, choices=[
        ('Primary', 'Primary'),
        ('Secondary', 'Secondary'),
        ('Comorbidity', 'Comorbidity')
    ], default='Primary')
    MRN = models.CharField(max_length=50, blank=True)
    ContactNumber = models.CharField(max_length=20, blank=True)
    Location = models.CharField(max_length=100, blank=True)
    Created_by = models.CharField(max_length=50, blank=True)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    MainPageCompleted = models.CharField(max_length=50, blank=True)
    PageCompleted = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "Diagnosis_Data"

    def __str__(self):
        return f"Diagnosis {self.Id} for MRN {self.MRN}"    
      
from django.db import models

class PreAuthTreatmentInfo(models.Model):
    Id = models.AutoField(primary_key=True)
    MRN = models.CharField(max_length=50, blank=True)
    ContactNumber = models.CharField(max_length=20, blank=True)
    Location = models.CharField(max_length=100, blank=True)
    Created_by = models.CharField(max_length=50, blank=True)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    MainPageCompleted = models.CharField(max_length=50, blank=True)
    PageCompleted = models.CharField(max_length=50, blank=True)
    
    Rows3 = models.TextField(default='', blank=True)  
    CheckboxStateTreatment = models.TextField(default='', blank=True)  
    MedicalManagement = models.CharField(max_length=10, blank=True)  
    TreatmentTxtareaDetails = models.TextField(blank=True) 
    Rows4 = models.TextField(default='', blank=True)  
    SurgicalManagement = models.CharField(max_length=10, blank=True)  
    AdditionalSurgicalOptions = models.TextField(default='', blank=True)  

    class Meta:
        db_table = "Pre_Auth_Treatment_Info"

    def __str__(self):
        return f"Pre-Auth Treatment {self.Id} for MRN {self.MRN}"
    
class PreAuthBillingInfo(models.Model):
    Id = models.AutoField(primary_key=True)
    MRN = models.CharField(max_length=50, blank=True)
    ContactNumber = models.CharField(max_length=20, blank=True)
    Location = models.CharField(max_length=100, blank=True)
    Created_by = models.CharField(max_length=50, blank=True)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    MainPageCompleted = models.CharField(max_length=50, blank=True)
    PageCompleted = models.CharField(max_length=50, blank=True)
    
    dateofAdmission = models.CharField(max_length=20, blank=True)
    typeofAdmission = models.CharField(max_length=100, blank=True)
    durationStayinDays = models.CharField(max_length=10, blank=True)
    dateofSurgery = models.CharField(max_length=20, blank=True)
    AvailedRateCard = models.CharField(max_length=50, blank=True)
    EligibleRoomType = models.CharField(max_length=50, blank=True)
    CreditBill = models.CharField(max_length=10, blank=True)
    IsDefaultPayer = models.CharField(max_length=10, blank=True)
    AllAreMedicalItems = models.CharField(max_length=10, blank=True)
    dateofDischarge = models.CharField(max_length=20, blank=True)
    DischargeTypeBilling = models.CharField(max_length=100, blank=True)
    
    CoPaymentCoverage = models.CharField(max_length=10, blank=True)
    CoPaymentDetails = models.TextField(default='', blank=True)
    
    Billinginfolist = models.TextField(default='[]', blank=True)

    class Meta:
        db_table = "Pre_Auth_Billing_Info"

    def __str__(self):
        return f"Pre-Auth Billing {self.Id} for MRN {self.MRN}"

class PreAuthDocuments(models.Model):
    Id = models.AutoField(primary_key=True)
    PreAuthBilling = models.ForeignKey(PreAuthBillingInfo, on_delete=models.CASCADE, related_name='documents')
    MRN = models.CharField(max_length=50, blank=True)
    DocumentType = models.CharField(max_length=50, choices=[
        ('photoIdentityCard', 'Photo Identity Card'),
        ('signedForm', 'Signed Form'),
        ('otherDocument', 'Other Document')
    ])
    DocumentFile = models.FileField(upload_to='pre_auth_documents/%Y/%m/%d/', blank=True, null=True)
    DocumentFileName = models.CharField(max_length=255, blank=True)
    DocumentFileType = models.CharField(max_length=100, blank=True)
    DocumentRemarks = models.TextField(blank=True)
    DocumentDate = models.CharField(max_length=20, blank=True)
    DocumentAck = models.BooleanField(default=False)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Pre_Auth_Documents"

    def __str__(self):
        return f"{self.DocumentType} for Pre-Auth Billing {self.PreAuthBilling.Id}"
