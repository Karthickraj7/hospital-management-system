from django.db import models
from django.db.models import Max
from django.contrib.postgres.fields import ArrayField  
from django.core.files.base import ContentFile

from Frontoffice.models import *
from Inventory.models import *


class Workbench_Gynecology(models.Model):
    Id = models.IntegerField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    OH = models.TextField()
    MH = models.TextField()
    EXAMI = models.TextField()
    PS = models.TextField()
    PV = models.TextField()
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_Gynecology'

    
    
    def save(self, *args, **kwargs):
        if not self.Id:  # Check if accountsetting_id is not set
            max_id = Workbench_Gynecology.objects.aggregate(max_id=Max('Id'))['max_id']
            self.Id = (max_id or 0) + 1
        super(Workbench_Gynecology, self).save(*args,**kwargs)




class Workbench_Neurology(models.Model):
    Id = models.IntegerField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)

    # PatientId = models.CharField(max_length=30)
    # PatientName = models.CharField(max_length=30)
    History = models.TextField()
    PastInvestigations = models.TextField()
    Examination = models.TextField()
    GeneralExam = models.TextField()
    Vision = models.TextField()
    Fundus = models.TextField()
    Fields = models.TextField()
    EOM = models.TextField()
    Pupils = models.TextField()
    Nerves = models.TextField()
    LowerCranialNerves = models.TextField()
    SensoryExam = models.TextField()
    InvoluntaryMovements = models.TextField()
    FN = models.TextField()
    Dysdiadoko = models.TextField()
    Tandem = models.TextField()
    Gait = models.TextField()
    Power = models.TextField()
    Neck = models.TextField()

    # ShoulderR = models.CharField(max_length=30)
    ShoulderRF = models.CharField(max_length=30,blank=True,null=True)
    ShoulderRE = models.CharField(max_length=30,blank=True,null=True)
    ShoulderRAbd = models.CharField(max_length=30,blank=True,null=True)
    ShoulderRAdd = models.CharField(max_length=30,blank=True,null=True)
    
    # HipR = models.CharField(max_length=30)
    HipRF = models.CharField(max_length=30,blank=True,null=True)
    HipRE = models.CharField(max_length=30,blank=True,null=True)
    HipRAbd = models.CharField(max_length=30,blank=True,null=True)
    HipRAdd = models.CharField(max_length=30,blank=True,null=True)
   
    # ElbowR = models.CharField(max_length=30)
    ElbowRF = models.CharField(max_length=30,blank=True,null=True)
    ElbowRE = models.CharField(max_length=30,blank=True,null=True)

    # KneeR = models.CharField(max_length=30)
    KneeRF = models.CharField(max_length=30,blank=True,null=True)
    KneeRE = models.CharField(max_length=30,blank=True,null=True)

    # WristR = models.CharField(max_length=30)
    WristRF = models.CharField(max_length=30,blank=True,null=True)
    WristRE = models.CharField(max_length=30,blank=True,null=True)

    # HandR = models.CharField(max_length=30)
    HandRI = models.CharField(max_length=30,blank=True,null=True)
    HandRE = models.CharField(max_length=30,blank=True,null=True)

    # AnkleR = models.CharField(max_length=30)
    AnkleRDF = models.CharField(max_length=30,blank=True,null=True)
    AnkleRPF = models.CharField(max_length=30,blank=True,null=True)
    AnkleRI = models.CharField(max_length=30,blank=True,null=True)
    AnkleRE = models.CharField(max_length=30,blank=True,null=True)

    
    # ShoulderL = models.CharField(max_length=30)
    ShoulderLF = models.CharField(max_length=30,blank=True,null=True)
    ShoulderLE = models.CharField(max_length=30,blank=True,null=True)
    ShoulderLAbd = models.CharField(max_length=30,blank=True,null=True)
    ShoulderLAdd = models.CharField(max_length=30,blank=True,null=True)
    
    
    # HipL = models.CharField(max_length=30)
    HipLF = models.CharField(max_length=30,blank=True,null=True)
    HipLE = models.CharField(max_length=30,blank=True,null=True)
    HipLAbd = models.CharField(max_length=30,blank=True,null=True)
    HipLAdd = models.CharField(max_length=30,blank=True,null=True)
   
    # ElbowL = models.CharField(max_length=30)
    ElbowLF = models.CharField(max_length=30,blank=True,null=True)
    ElbowLE = models.CharField(max_length=30,blank=True,null=True)

    # KneeL = models.CharField(max_length=30)
    KneeLF = models.CharField(max_length=30,blank=True,null=True)
    KneeLE = models.CharField(max_length=30,blank=True,null=True)

    # WristL = models.CharField(max_length=30)
    WristLF = models.CharField(max_length=30,blank=True,null=True)
    WristLE = models.CharField(max_length=30,blank=True,null=True)

    # HandL = models.CharField(max_length=30)
    HandLI = models.CharField(max_length=30,blank=True,null=True)
    HandLE = models.CharField(max_length=30,blank=True,null=True)

    # AnkleL = models.CharField(max_length=30)
    AnkleLDF = models.CharField(max_length=30,blank=True,null=True)
    AnkleLPF = models.CharField(max_length=30,blank=True,null=True)
    AnkleLI = models.CharField(max_length=30,blank=True,null=True)
    AnkleLE = models.CharField(max_length=30,blank=True,null=True)

    RB1 = models.CharField(max_length=30)
    RT1 = models.CharField(max_length=30)
    RS1 = models.CharField(max_length=30)
    RK1 = models.CharField(max_length=30)
    RA1 = models.CharField(max_length=30)
    RPlantars1 = models.CharField(max_length=30)
    RAbdominals1 = models.CharField(max_length=30)
    RAbdominals2 = models.CharField(max_length=30)
    RCr1 = models.CharField(max_length=30)
    LB1 = models.CharField(max_length=30)
    LT1 = models.CharField(max_length=30)
    LS1 = models.CharField(max_length=30)
    LK1 = models.CharField(max_length=30)
    LA1 = models.CharField(max_length=30)
    LPlantars1 = models.CharField(max_length=30)
    LAbdominals1 = models.CharField(max_length=30)
    LAbdominals2 = models.CharField(max_length=30)
    LCr1 = models.CharField(max_length=30)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_Neurology'

    
    
    def save(self, *args, **kwargs):
        if not self.Id:  # Check if accountsetting_id is not set
            max_id = Workbench_Neurology.objects.aggregate(max_id=Max('Id'))['max_id']
            self.Id = (max_id or 0) + 1
        super(Workbench_Neurology, self).save(*args,**kwargs)



class Workbench_OP_Sheet(models.Model):
    Id = models.IntegerField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    PrimaryComplaint = models.CharField(max_length=50,blank=True,null=True)
    PresentComplaints = models.TextField()
    PastHistory = models.TextField()
    Allergies = models.TextField()
    Diagnosis = models.TextField()
    Treatment = models.TextField()
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_OP_Sheet'

    
    
    def save(self, *args, **kwargs):
        if not self.Id:  # Check if accountsetting_id is not set
            max_id = Workbench_OP_Sheet.objects.aggregate(max_id=Max('Id'))['max_id']
            self.Id = (max_id or 0) + 1
        super(Workbench_OP_Sheet, self).save(*args,**kwargs)




class Workbench_IFCard(models.Model):
    Id = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    HusbandName = models.CharField(max_length=30)
    Husbandage = models.CharField(max_length=30)
    BloodGroupHusband = models.CharField(max_length=30)
    DurationRelation = models.CharField(max_length=30)
    PhoneNumber = models.CharField(max_length=30)
    Address = models.TextField()
    AttemptingPregnancy = models.TextField()
    MenstrualHistory = models.TextField()
    NoOfDays = models.CharField(max_length=30)
    Dysmenorrhea = models.CharField(max_length=30)
    MCB = models.CharField(max_length=30)
    LMPs = models.JSONField(default=list)  # Use JSONField for lists of dates
    SexualHistory = models.TextField()
    DurationIC = models.CharField(max_length=50)
    VisitAboard = models.CharField(max_length=50)
    MedicalHistory = models.TextField()
    ObstlHistory = models.TextField()
    SurgicalHistory = models.TextField()
    AddDate = models.CharField(max_length=50)
    AddImpression = models.TextField()
    USGDate = models.CharField(max_length=50)
    USGImpression = models.TextField()
    Hb = models.CharField(max_length=30)
    TLC = models.CharField(max_length=30)
    BSL = models.CharField(max_length=30)
    Prolactin = models.CharField(max_length=30)
    FSH = models.CharField(max_length=30)
    E2 = models.CharField(max_length=30)
    HIV = models.CharField(max_length=30)
    Urine = models.CharField(max_length=30)
    AMH = models.CharField(max_length=30)
    TSH = models.CharField(max_length=30)
    LH = models.CharField(max_length=30)
    T3 = models.CharField(max_length=30)
    T4 = models.CharField(max_length=30)
    HCG = models.CharField(max_length=30)
    rows = models.JSONField(default=list)  # Use JSONField for rows
    drainsData3 = models.JSONField(default=list)  # Use JSONField for drainsData3
    selectedRows = models.JSONField(default=list)  # Use JSONField for selectedRows
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_IFCard'



class Workbench_ANC_Card(models.Model):
    Id = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    HusbandName = models.CharField(max_length=30)  
    MenstrualLMP = models.CharField(max_length=30)
    MenstrualEDD = models.CharField(max_length=30)
    CorrectedbyUSG = models.CharField(max_length=30) #-----part-1
    # DrainsData1 = models.JSONField(default=list)  # Use JSONField for drainsData3
    HighRiskFactors = models.CharField(max_length=250,blank=True,null=True)  # Use JSONField for drainsData3
    SurgicalHistory = models.TextField() 
    Family_History = models.CharField(max_length=250,blank=True,null=True) #-----part-2
    Allergies = models.TextField()
    BloodGroupHusband = models.CharField(max_length=30) #-----part-3
    # DrainsData2 = models.JSONField(default=list)  #-----part-4
    # CheckboxState = models.JSONField(default=dict)  #-----part-5
    BSL = models.BooleanField(default=False)
    HIV = models.BooleanField(default=False)
    Urea = models.BooleanField(default=False)
    BTCT = models.BooleanField(default=False)
    OGCT = models.BooleanField(default=False)
    VDRL = models.BooleanField(default=False)
    AuAg = models.BooleanField(default=False)
    Creatrine = models.BooleanField(default=False)
    WBC = models.BooleanField(default=False)
    anyotherinves = models.BooleanField(default=False)

    BSLText = models.TextField()
    HIVText = models.TextField()
    UreaText = models.TextField()
    BTCTText = models.TextField()
    OGCTText = models.TextField()
    VDRLText = models.TextField()
    AuAgText = models.TextField()
    CreatrineText = models.TextField()
    WBCText = models.TextField()
    AnyotherinvesText = models.TextField() #-----part-6
    CVS_Text = models.TextField()
    RS_Text = models.TextField()
    Breast_Text = models.TextField()#-----part-7
    # RadioBtns = models.JSONField(default=dict) #-----part-8
    TT1Text = models.TextField()
    TT2Text = models.TextField()
    TT3Text = models.TextField()
    Betnesol_Text = models.TextField()
    FolicAcidText = models.TextField()
    CalciumText = models.TextField()
    FTNDLSCSText = models.TextField()
    FTNDTLText = models.TextField()
    PostDeliveryText = models.TextField()#-----part-9
    TT1 = models.CharField(max_length=30,blank=True,null=True) #radiobtn
    TT2 = models.CharField(max_length=30,blank=True,null=True)
    TT3 = models.CharField(max_length=30,blank=True,null=True)
    Betnesol = models.CharField(max_length=30,blank=True,null=True)
    FolicAcid = models.CharField(max_length=30,blank=True,null=True)
    Calcium = models.CharField(max_length=30,blank=True,null=True)
    FTNDLSCS = models.CharField(max_length=30,blank=True,null=True)
    FTNDTL = models.CharField(max_length=30,blank=True,null=True)
    PostDelivery = models.CharField(max_length=30,blank=True,null=True)#-----radiobtn-9
    ObstHistory = models.CharField(max_length=50,blank=True,null=True)#-----part-9
    DeliveryResult = models.TextField()#-----part-9
    AncCardNo = models.CharField(max_length=30,null=True,blank=True)
    MctsNo = models.CharField(max_length=30,null=True,blank=True)
    DeliveryDate = models.CharField(max_length=30,null=True,blank=True)
    # DrainsData3 = models.JSONField(default=list) #-----part-10
    # Rows = models.JSONField(default=list) #-----part-11
    selectedRows = models.JSONField(default=list)  # Use JSONField for selectedRows
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_ANC_Card'


class Workbench_ANC_Table1(models.Model):
    # T1Id = models.AutoField(primary_key=True)
    AncId = models.ForeignKey(Workbench_ANC_Card, on_delete=models.CASCADE, related_name='Table1_id')
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='Table1_RegId',null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    AgeSex = models.CharField(max_length=100, blank=True, null=True)
    Type = models.CharField(max_length=100, blank=True, null=True)
    Immunized = models.CharField(max_length=100, blank=True, null=True)
    Problems = models.CharField(max_length=100, blank=True, null=True)
    
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_ANC_Table1'


class Workbench_ANC_Table2(models.Model):
    # T2Id = models.AutoField(primary_key=True)
    AncId = models.ForeignKey(Workbench_ANC_Card, on_delete=models.CASCADE, related_name='Table2_id')
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='Table2_RegId',null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    Date1 = models.CharField(max_length=30,blank=True, null=True)
    Hb = models.CharField(max_length=100, blank=True, null=True)
    Urine = models.CharField(max_length=100, blank=True, null=True)

    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_ANC_Table2'


class Workbench_ANC_Table3(models.Model):
    # T3Id = models.AutoField(primary_key=True)
    AncId = models.ForeignKey(Workbench_ANC_Card, on_delete=models.CASCADE, related_name='Table3_id',null=True,blank=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='Table3_RegId',null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    DateforDelivery = models.CharField(max_length=30,blank=True, null=True)
    WeightDelivery = models.CharField(max_length=30,null=True, blank=True)
    BPDelivery = models.CharField(max_length=30,null=True, blank=True)
    ComplaintsDelivery = models.CharField(max_length=100, blank=True, null=True)
    AmenorrheaDelivery = models.CharField(max_length=30,blank=True, null=True)
    PallorDelivery = models.CharField(max_length=100, blank=True, null=True)
    PresentationDelivery = models.CharField(max_length=100, blank=True, null=True)
    PVAnyOtherDelivery = models.CharField(max_length=100, blank=True, null=True)
    AdviceDelivery = models.CharField(max_length=100, blank=True, null=True)
    
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_ANC_Table3'


class Workbench_ANC_Table4(models.Model):
    # T4Id = models.AutoField(primary_key=True)
    AncId = models.ForeignKey(Workbench_ANC_Card, on_delete=models.CASCADE, related_name='Table4_id')
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='Table4_RegId',null=True,blank=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    Date2 = models.CharField(max_length=30,blank=True, null=True)
    Amenorrhea = models.CharField(max_length=100, blank=True, null=True)
    Presentation = models.CharField(max_length=100, blank=True, null=True)
    BpdGs = models.CharField(max_length=100, blank=True, null=True)
    HC = models.CharField(max_length=100, blank=True, null=True)
    AC = models.CharField(max_length=100, blank=True, null=True)
    FlCrl = models.CharField(max_length=100, blank=True, null=True)
    GestationalAge = models.CharField(max_length=100, blank=True, null=True)
    Liquor = models.CharField(max_length=100, blank=True, null=True)
    Placenta = models.CharField(max_length=100, blank=True, null=True)
    Anomalies = models.CharField(max_length=100, blank=True, null=True)
    FoetalWeight = models.CharField(max_length=100, blank=True, null=True)
    CervicalLength = models.CharField(max_length=100, blank=True, null=True)
    Remark = models.CharField(max_length=100, blank=True, null=True)
    
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_ANC_Table4'

 

# class Workbench_GeneralEvaluation(models.Model):
#     Id = models.AutoField(primary_key=True)
#     Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,blank=True,null=True)
#     IP_RegistrationId = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,blank=True,null=True)
#     KeyComplaint = models.ManyToManyField(PrimaryComplaintMaster, blank=True, null=True)
#     CheifComplaint = models.ManyToManyField(ChiefComplaintMaster, blank=True)
#     History = models.ManyToManyField(HistoryMaster, blank=True)
#     Examine = models.ManyToManyField(ExaminationMaster, blank=True)
#     Diagnosis = models.TextField()
#     ICDCode=models.TextField(blank=True,null=True)
#     ICDCode_Description=models.TextField(blank=True,null=True)
#     ICDCode_Diagnosis=models.TextField(blank=True,null=True)
#     ChooseDocument = models.BinaryField(blank=True,null=True)
#     AnnotationDocument = models.BinaryField(blank=True,null=True)
#     Type = models.CharField(max_length=20,blank=True,null=True)
#     DiseaseDetails = models.JSONField(blank=True,null=True) 
#     created_by = models.CharField(max_length=30)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'Workbench_GeneralEvaluation'


# def generate_next_disease_code():
#     max_code = EvaluationDiseaseDetail.objects.aggregate(
#         Max("DiseaseCode")
#     )["DiseaseCode__max"]

#     if max_code:
#         prefix = max_code[:3]
#         number = int(max_code[3:])
#         next_number = number + 1
#         return f"{prefix}{next_number:03d}"
#     return "DMC001"

# class EvaluationDiseaseDetail(models.Model):
#     DiseaseCode = models.CharField(max_length=50,primary_key=True,null=False,default=generate_next_disease_code)
#     Evaluation = models.ForeignKey(Workbench_GeneralEvaluation, on_delete=models.CASCADE, related_name='diseases')
#     DiseaseName = models.CharField(max_length=255,blank=True,null=True)
#     IsChronicle = models.CharField(max_length=3, default='No',blank=True,null=True)
#     IsCommunicable = models.CharField(max_length=3, default='No',blank=True,null=True)
#     CreatedBy = models.CharField(max_length=50,default='admin')
#     CreatedAt = models.DateTimeField(auto_now_add=True, null=True)
 
#     class Meta:
#         db_table = 'EvaluationDiseaseDetail'


class Workbench_GeneralEvaluation(models.Model):
    Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, blank=True, null=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Doctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
 
 
    KeyComplaint =  models.TextField(null=True, blank=True)
    # KeyComplaint = models.CharField(max_length=50,blank=True,null=True)
    CheifComplaint = models.TextField()
    History = models.TextField()
    Examine = models.TextField()
    Diagnosis = models.TextField()
    ICDCode=models.TextField(blank=True,null=True)
    ICDCode_Description=models.TextField(blank=True,null=True)
    ICDCode_Diagnosis=models.TextField(blank=True,null=True)
    ChooseDocument = models.BinaryField(blank=True,null=True)
    AnnotationDocument = models.BinaryField(blank=True,null=True)
    Type = models.CharField(max_length=20,blank=True,null=True)
    DiseaseDetails = models.JSONField(blank=True,null=True) 
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_GeneralEvaluation' 



# class Workbench_Prescription_RelatedData(models.Model):
#     Id = models.AutoField(primary_key=True)
#     Doctor_Id = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
#     Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
#     doctorType = models.CharField(max_length=50,blank=True,null=True)
#     doctorName = models.CharField(max_length=50,blank=True,null=True)
#     remarks = models.TextField()
#     Reason = models.TextField()
#     IpNotes = models.TextField()
#     NoOfDays = models.CharField(max_length=50,blank=True,null=True)
#     TimeInterval = models.CharField(max_length=50,blank=True,null=True)
#     Date = models.CharField(max_length=50,blank=True,null=True)
#     SurgeryName = models.CharField(max_length=100,blank=True,null=True)
#     SurgeryRequestedDate = models.CharField(max_length=50,blank=True,null=True)
#     AdviceNotes = models.TextField()
#     created_by = models.CharField(max_length=30)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'Workbench_Prescription_RelatedData'

    

class Workbench_Prescription_RelatedData(models.Model):
    Id = models.AutoField(primary_key=True)
    Doctor_Id = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    NoOfDays = models.CharField(max_length=50,blank=True,null=True)
    TimeInterval = models.CharField(max_length=50,blank=True,null=True)
    Date = models.CharField(max_length=50,blank=True,null=True)
    AdviceNotes = models.TextField()
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_Prescription_RelatedData'

    
  
class Workbench_Prescription(models.Model):
    Id = models.AutoField(primary_key=True)
    PrescriptionId = models.ForeignKey(Workbench_Prescription_RelatedData,on_delete=models.CASCADE,null=True,blank=True,default=None)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    Doctor_Id = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    GenericName = models.CharField(max_length=100,null=True,blank=True)
    ItemName = models.CharField(max_length=100,null=True,blank=True)
    Itemtype = models.CharField(max_length=100,null=True,blank=True)
    Dose = models.CharField(max_length=100,null=True,blank=True)
    Route = models.CharField(max_length=100,null=True,blank=True)
    Frequency = models.CharField(max_length=100,null=True,blank=True)
    DurationNumber = models.IntegerField()
    DurationUnit = models.CharField(max_length=100,null=True,blank=True)
    Qty = models.CharField(max_length=100,null=True,blank=True)
    Instruction = models.TextField()
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_Prescription'

  




class Workbench_PastHistory(models.Model):
    Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    Illnessordiseases = models.CharField(max_length=10,blank=True,null=True)
    IllnessordiseasesText = models.TextField()
    Surgerybefore = models.CharField(max_length=10,blank=True,null=True)
    SurgerybeforeText = models.TextField()
    Pressureorheartdiseases = models.CharField(max_length=10,blank=True,null=True)
    PressureorheartdiseasesText = models.TextField()
    Stomachacidityproblem = models.CharField(max_length=10,blank=True,null=True)
    StomachacidityproblemText = models.TextField()
    Allergicmedicine = models.CharField(max_length=10,blank=True,null=True)
    AllergicmedicineText = models.TextField()
    Drinkalcohol = models.CharField(max_length=10,blank=True,null=True)
    DrinkalcoholText = models.TextField()
    Smoke = models.CharField(max_length=10,blank=True,null=True)
    SmokeText = models.TextField()
    DiabetesorAsthmadisease = models.CharField(max_length=10,blank=True,null=True)
    DiabetesorAsthmadiseaseText = models.TextField()
    Localanesthesiabefore = models.CharField(max_length=10,blank=True,null=True)
    LocalanesthesiabeforeText = models.TextField()
    Healthproblems = models.CharField(max_length=10,blank=True,null=True)
    HealthproblemsText = models.TextField()
    Regularbasis = models.CharField(max_length=10,blank=True,null=True)
    RegularbasisText = models.TextField()
    Allergicfood = models.CharField(max_length=10,blank=True,null=True)
    AllergicfoodText = models.TextField()
    Operativeinstuctions = models.CharField(max_length=10,blank=True,null=True)
    OperativeinstuctionsText = models.TextField()
    Other = models.TextField()   
    Type = models.CharField(max_length=20,blank=True,null=True) 
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_PastHistory'



class Workbench_FollowUp(models.Model):
    Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    NoOfDays = models.CharField(max_length=20,blank=True,null=True)
    Date = models.CharField(max_length=20,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_FollowUp'




# class Workbench_OtRequest(models.Model):
#     Id = models.AutoField(primary_key=True)
#     Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
#     Speciality = models.CharField(max_length=50,blank=True,null=True)
#     PrimaryDr = models.CharField(max_length=50,blank=True,null=True)
#     SurgeryName = models.TextField()
#     SurgeryRequestedDate = models.CharField(max_length=20,blank=True,null=True)
#     SurgeryRequestedTime = models.CharField(max_length=20,blank=True,null=True)
#     DurationNumber = models.CharField(max_length=20,blank=True,null=True)
#     DurationUnit = models.CharField(max_length=20,blank=True,null=True)
#     RequestedBy = models.TextField()
#     Remarks = models.TextField()
#     created_by = models.CharField(max_length=30)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'Workbench_OtRequest'





class Workbench_Opthalmology(models.Model):
    Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, blank=True, null=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE, blank=True, null=True)
    PatientId = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE, related_name='opthalmology_records',null=True, blank=True)
    # VisitId = models.IntegerField(blank=True, null=True)
    PGPODSph = models.CharField(max_length=50, blank=True, null=True)
    PGPODCyl = models.CharField(max_length=50, blank=True, null=True)
    PGPODAxs = models.CharField(max_length=50, blank=True, null=True)
    PGPOsSph = models.CharField(max_length=50, blank=True, null=True)
    PGPOsCyl = models.CharField(max_length=50, blank=True, null=True)
    PGPOsAxs = models.CharField(max_length=50, blank=True, null=True)
    ODadd = models.CharField(max_length=50, blank=True, null=True)
    OSadd = models.CharField(max_length=50, blank=True, null=True)
    chiefComplaints = models.TextField(blank=True, null=True)
    history = models.TextField(blank=True, null=True)
    ARODSph = models.CharField(max_length=50, blank=True, null=True)
    ARODCyl = models.CharField(max_length=50, blank=True, null=True)
    ARODAxs = models.CharField(max_length=50, blank=True, null=True)
    AROsSph = models.CharField(max_length=50, blank=True, null=True)
    AROsCyl = models.CharField(max_length=50, blank=True, null=True)
    AROsAxs = models.CharField(max_length=50, blank=True, null=True)
    powerODVision = models.CharField(max_length=50, blank=True, null=True)
    powerOSVision = models.CharField(max_length=50, blank=True, null=True)
    crxODVision = models.CharField(max_length=50, blank=True, null=True)
    crxOSVision = models.CharField(max_length=50, blank=True, null=True)
    cphODVision = models.CharField(max_length=50, blank=True, null=True)
    cphOSVision = models.CharField(max_length=50, blank=True, null=True)
    SubODSph = models.CharField(max_length=50, blank=True, null=True)
    SubODCyl = models.CharField(max_length=50, blank=True, null=True)
    SubODAxs = models.CharField(max_length=50, blank=True, null=True)
    SubODVa = models.CharField(max_length=50, blank=True, null=True)
    SubOsSph = models.CharField(max_length=50, blank=True, null=True)
    SubOsCyl = models.CharField(max_length=50, blank=True, null=True)
    SubOsAxs = models.CharField(max_length=50, blank=True, null=True)
    SubOsVa = models.CharField(max_length=50, blank=True, null=True)
    SubODadd = models.CharField(max_length=50, blank=True, null=True)
    SubOSadd = models.CharField(max_length=50, blank=True, null=True)
    DilODSph = models.CharField(max_length=50, blank=True, null=True)
    DilODCyl = models.CharField(max_length=50, blank=True, null=True)
    DilODAxs = models.CharField(max_length=50, blank=True, null=True)
    DilOsSph = models.CharField(max_length=50, blank=True, null=True)
    DilOsCyl = models.CharField(max_length=50, blank=True, null=True)
    DilOsAxs = models.CharField(max_length=50, blank=True, null=True)
    DilAccODSph = models.CharField(max_length=50, blank=True, null=True)
    DilAccODCyl = models.CharField(max_length=50, blank=True, null=True)
    DilAccODAxs = models.CharField(max_length=50, blank=True, null=True)
    DilAccODVa = models.CharField(max_length=50, blank=True, null=True)
    DilAccOSSph = models.CharField(max_length=50, blank=True, null=True)
    DilAccOSCyl = models.CharField(max_length=50, blank=True, null=True)
    DilAccOSAxs = models.CharField(max_length=50, blank=True, null=True)
    DilAccOSVa = models.CharField(max_length=50, blank=True, null=True)
    ATIOP = models.CharField(max_length=50, blank=True, null=True)
    NCTIOP = models.CharField(max_length=50, blank=True, null=True)
    OSATIOP = models.CharField(max_length=50, blank=True, null=True)
    OSNCTIOP = models.CharField(max_length=50, blank=True, null=True)
    SacSyringing = models.TextField(blank=True, null=True)
    SacSyringingSecond = models.TextField(blank=True, null=True)
    SubODDiagnosis = models.TextField(blank=True, null=True)
    SubOSDiagnosis = models.TextField(blank=True, null=True)
    Treatment = models.TextField(blank=True, null=True)
    followUp = models.TextField(blank=True, null=True)
    rightSPH = models.CharField(max_length=50, blank=True, null=True)
    rightCYL = models.CharField(max_length=50, blank=True, null=True)
    rightAXIS = models.CharField(max_length=50, blank=True, null=True)
    rightVA = models.CharField(max_length=50, blank=True, null=True)
    leftSPH = models.CharField(max_length=50, blank=True, null=True)
    leftCYL = models.CharField(max_length=50, blank=True, null=True)
    leftAXIS = models.CharField(max_length=50, blank=True, null=True)
    leftVA = models.CharField(max_length=50, blank=True, null=True)
    rightNearSPH = models.CharField(max_length=50, blank=True, null=True)
    rightNearCYL = models.CharField(max_length=50, blank=True, null=True)
    rightNearAXIS = models.CharField(max_length=50, blank=True, null=True)
    rightNearVA = models.CharField(max_length=50, blank=True, null=True)
    leftNearSPH = models.CharField(max_length=50, blank=True, null=True)
    leftNearCYL = models.CharField(max_length=50, blank=True, null=True)
    leftNearAXIS = models.CharField(max_length=50, blank=True, null=True)
    leftNearVA = models.CharField(max_length=50, blank=True, null=True)
    rightPrism = models.CharField(max_length=100, blank=True, null=True)
    rightPrismValue = models.CharField(max_length=50, blank=True, null=True)
    leftPrism = models.CharField(max_length=100, blank=True, null=True)
    leftPrismValue = models.CharField(max_length=50, blank=True, null=True)
    rightPrism2 = models.CharField(max_length=100, blank=True, null=True)
    rightPrism2Value = models.CharField(max_length=50, blank=True, null=True)
    leftPrism2 = models.CharField(max_length=100, blank=True, null=True)
    leftPrism2Value = models.CharField(max_length=50, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)




class Workbench_Opthalmology_VisionDraw(models.Model):
    S_No = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, blank=True, null=True)
    IpRegistration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE, blank=True, null=True)
    OpthalmologyId = models.ForeignKey(Workbench_Opthalmology, on_delete=models.CASCADE,)
    AntSegOD = models.BinaryField(blank=True, null=True)
    AntSegOS = models.BinaryField(blank=True, null=True)
    LensOD = models.BinaryField(blank=True, null=True)
    LensOS = models.BinaryField(blank=True, null=True)
    FundusOD = models.BinaryField(blank=True, null=True)
    FundusOS = models.BinaryField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

 

    


class Workbench_OtRequest(models.Model):
    Id = models.AutoField(primary_key=True)
    PrescriptionId = models.ForeignKey(Workbench_Prescription_RelatedData,on_delete=models.CASCADE,blank=True,null=True,default=None)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    SurgeryName = models.TextField()
    SurgeryRequestedDate = models.CharField(max_length=20,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Workbench_OtRequest'



class Allergy_Details(models.Model):
    Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='AllergyDetails_Registration_Id',null=True,blank=True)
    AllergyType = models.CharField(max_length=100,blank=True)
    Allergent = models.CharField(max_length=100,blank=True)
    Reaction = models.CharField(max_length=100,blank=True)
    Remarks = models.CharField(max_length=250)
    Type = models.CharField(max_length=20,blank=True,null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Created_by = models.CharField(max_length=30)
    class Meta:
        db_table = 'Allergy_Details'
        

class OPD_GeneralAdviceFollowUp(models.Model):
    NextReview_Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    Patient_Id = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE,null=True,blank=True)
    NoOfDays = models.IntegerField(null=True,blank=True)  # Corrected IntegerField spelling
    TimeInterval = models.CharField(max_length=40,blank=True,null=True)
    Date = models.CharField(max_length=20,blank=True,null=True)
    GeneralAdivice = models.TextField()
    created_by = models.CharField(max_length=30)
    AdviceDataCheck = models.BooleanField(default=True)
    FollowUpDataCheck = models.BooleanField(default=True)
    Reason = models.TextField(null=True,blank=True)
    Status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'OPD_GeneralAdviceFollowUp'
 
class OPD_OtRequest_Details(models.Model):
    OtRequest_Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    Patient_Id = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE,null=True,blank=True)
    Speciality = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,null=True,blank=True)
    SurgeryName = models.ForeignKey(SurgeryName_Details, on_delete=models.CASCADE,null=True,blank=True)
    SurgeryRequestedDate = models.DateField()
    created_by = models.CharField(max_length=30)
    OtRequestChecked = models.BooleanField(default=True)
    Status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'OPD_OtRequest_Details'


class OPD_Referal_Details(models.Model):
    Refer_Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    VisitId = models.CharField(max_length=50)
    Speciality = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE)
    Patient_Id = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE,null=True,blank=True)
    PrimaryDoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, null=True,blank=True,related_name='opd_primarydoctor') 
    ReferDoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, null=True,blank=True,related_name='opdrefer_doctor') 
    ReferDoctorType = models.CharField(max_length=50)
    Remarks = models.TextField()
    ReferDoctorCheck = models.BooleanField(default=True)
    RefPatientStatus = models.CharField(blank=True,null=True,max_length=30,default='Pending')
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'OPD_Referal_Details'



class OPD_Prescription_Details(models.Model):
    Prescription_Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    Patient_Id = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE,null=True,blank=True)
    VisitId = models.IntegerField(null=True,blank=True)
    ItemId = models.ForeignKey(Product_Master_All_Category_Details, on_delete=models.CASCADE,null=True,blank=True)
    FrequencyId = models.ForeignKey(Frequency_Master_Drug, on_delete=models.CASCADE,null=True,blank=True)
    BatchNo = models.ForeignKey(Stock_Maintance_Table_Detials, on_delete=models.CASCADE,null=True,blank=True)
    OtRequest = models.ForeignKey(OPD_OtRequest_Details, on_delete=models.CASCADE,null=True,blank=True)
    OptoIp = models.ForeignKey(Op_to_Ip_Convertion_Table, on_delete=models.CASCADE,null=True,blank=True)
    NextReviewDate = models.ForeignKey(OPD_GeneralAdviceFollowUp, on_delete=models.CASCADE,null=True,blank=True)
    ReferDoctor = models.ForeignKey(OPD_Referal_Details, on_delete=models.CASCADE,null=True,blank=True)
    behalfofdoc =  models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, null=True,blank=True)
    Dosage = models.CharField(max_length=100,null=True,blank=True)
    Route = models.CharField(max_length=100,null=True,blank=True)
    DurationNumber = models.IntegerField(null=True,blank=True)  # Removed max_length argument
    DurationUnit = models.CharField(max_length=30,null=True,blank=True)
    Frequency = models.CharField(max_length=100,null=True,blank=True)
    Qty = models.CharField(max_length=100,null=True,blank=True)
    mealRelation = models.CharField(max_length=100,null=True,blank=True)
    Instruction = models.TextField(null=True,blank=True)
    created_by = models.CharField(max_length=30,null=True,blank=True)
    Status = models.BooleanField(default=True)
    BillingStatus = models.CharField(max_length=100, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'OPD_Prescription_Details'






class Workbench_EMREvaluation(models.Model):
    Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,blank=True,null=True)
    IP_RegistrationId = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,blank=True,null=True)
    KeyComplaint = models.TextField(default='No entries')
    CheifComplaint = models.TextField(default='No entries')
    History = models.TextField(default='No entries')
    Examine = models.TextField(default='No entries')
    Diagnosis = models.TextField(default='No entries')
    ICDCode=models.TextField(default='No entries')
    ICDCode_Description=models.TextField(default='No entries')
    ICDCode_Diagnosis=models.TextField(default='No entries')
    ChooseDocument = models.BinaryField(blank=True,null=True)
    AnnotationDocument = models.BinaryField(blank=True,null=True)
    Type = models.CharField(max_length=20,blank=True,null=True)
    DiseaseDetails = models.TextField(default='No entries')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Workbench_EMREvaluation'



# class DentalEMREvaluation(models.Model):
#     Id = models.AutoField(primary_key=True)
#     IP_RegistrationId = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,blank=True,null=True)  
#     Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,blank=True,null=True)
#     procedures = models.TextField(blank=True, null=True)
#     existing = models.TextField(blank=True, null=True)
#     planned = models.TextField(blank=True, null=True)
#     in_progress = models.TextField(blank=True, null=True)
#     completed = models.TextField(blank=True, null=True)
#     status = models.CharField(max_length=50, blank=True, null=True)
#     teeth = models.CharField(max_length=255, blank=True, null=True)
#     qty = models.IntegerField(default=0)
#     amount = models.IntegerField(default=0)
#     procedure_details = models.JSONField(blank=True, null=True)  # Stores JSON array of procedures
#     choose_document = models.FileField(upload_to='dental_docs/', blank=True, null=True)
#     created_by = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
 
#     def __str__(self):
#         return f"Evaluation {self.id} for Patient {self.registration.id}"
   
#     class Meta:
#         db_table = 'Workbench_DentalEMREvaluation'
 
 
# class DentalProcedureItem(models.Model):
#     """
#     Each row represents ONE procedure on ONE tooth with its own fee
#     """
#     evaluation = models.ForeignKey(
#         'DentalEMREvaluation',
#         on_delete=models.CASCADE,
#         related_name='procedure_items'
#     )
   
#     tooth = models.PositiveIntegerField()  # Tooth number (1-32)
#     procedures = models.CharField(max_length=200)  # e.g. "Prophylaxis", "Sealant"
#     status = models.CharField(
#         max_length=50,
#         choices=[
#             ('Existing', 'Existing'),
#             ('Planned', 'Planned'),
#             ('In Progress', 'In Progress'),
#             ('Completed', 'Completed'),
#         ]
#     )
#     qty = models.PositiveIntegerField(default=1)
#     fee = models.PositiveIntegerField(default=0)  # Individual fee for this tooth/procedure
   
#     created_at = models.DateTimeField(auto_now_add=True)
   
#     class Meta:
#         db_table = 'Workbench_DentalProcedureItem'
#         verbose_name = "Dental Procedure Item"
#         verbose_name_plural = "Dental Procedure Items"
   
#     def __str__(self):
#         return f"{self.procedures} on tooth {self.tooth} - ₹{self.fee}"
     

 
class DentalEMREvaluation(models.Model):
    Id = models.AutoField(primary_key=True)
 
    IP_RegistrationId = models.ForeignKey(
        Patient_IP_Registration_Detials,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
 
    Registration_Id = models.ForeignKey(
        Patient_Appointment_Registration_Detials,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
 
    procedures = models.TextField(blank=True, null=True)
    existing = models.TextField(blank=True, null=True)
    planned = models.TextField(blank=True, null=True)
    in_progress = models.TextField(blank=True, null=True)
    completed = models.TextField(blank=True, null=True)
 
    status = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
 
    teeth = models.CharField(max_length=255, blank=True, null=True)
    qty = models.PositiveIntegerField(default=0)
    amount = models.PositiveIntegerField(default=0)
 
    choose_document = models.FileField(
        upload_to="dental_docs/",
        blank=True,
        null=True
    )

#     patient_signature = models.TextField(
#     null=True,
#     blank=True
# )
 
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
  
    class Meta:
        db_table = "Workbench_DentalEMREvaluation"
 
    def __str__(self):
        if self.Registration_Id:
            return f"Dental Evaluation - OP {self.Registration_Id.Registration_Id}"
        if self.IP_RegistrationId:
            return f"Dental Evaluation - IP {self.IP_RegistrationId.Registration_Id}"
        return f"Dental Evaluation {self.Id}"
 
 
 
class DentalProcedureItem(models.Model):
    STATUS_CHOICES = [
        ("Existing", "Existing"),
        ("Planned", "Planned"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
    ]
 
    evaluation = models.ForeignKey(
        DentalEMREvaluation,
        related_name="procedure_items",
        on_delete=models.CASCADE
    )
 
    tooth = models.PositiveIntegerField()
    procedures = models.CharField(max_length=255)
 
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="Planned"
    )
 
    qty = models.PositiveIntegerField(default=1)
    fee = models.PositiveIntegerField(default=0)
 
    billed = models.BooleanField(default=False)  # ✅ ONLY ONCE
 
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        db_table = "Workbench_DentalProcedureItem"
        verbose_name = "Dental Procedure Item"
        verbose_name_plural = "Dental Procedure Items"
 
    def __str__(self):
        return f"{self.procedures} | Tooth {self.tooth} | ₹{self.fee}"
 
      