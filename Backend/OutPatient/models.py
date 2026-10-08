from django.db import models
from django.db.models import Max
from Frontoffice.models import *


class Patient_Vital_Details(models.Model):
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='OP_Vitals_Registration_Id',null=True,blank=True)
    Doctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Temperature = models.FloatField(null=True, blank=True)  
    Temperature_Status = models.FloatField(null=True, blank=True)
    Pulse_Rate = models.IntegerField(null=True, blank=True)  
    SPO2 = models.IntegerField(null=True, blank=True)  
    SPO2_Status = models.IntegerField(null=True, blank=True)
    Heart_Rate = models.IntegerField(null=True, blank=True)  
    Heart_Rate_Status = models.IntegerField(null=True, blank=True)
    Respiratory_Rate = models.IntegerField(null=True, blank=True)  
    Respiratory_Status = models.IntegerField(null=True, blank=True)
    SupplementalOxygen_Status = models.CharField(max_length=100,null=True, blank=True)
    SBP = models.IntegerField(null=True, blank=True)  
    SBP_Status = models.IntegerField(null=True, blank=True)  
    DBP = models.IntegerField(null=True, blank=True)  
    Height = models.FloatField(null=True, blank=True)  
    Weight = models.FloatField(null=True, blank=True)  
    BMI = models.FloatField(null=True, blank=True)  
    WC = models.FloatField(null=True, blank=True)  
    HC = models.FloatField(null=True, blank=True)  
    BSL = models.FloatField(null=True, blank=True)  
    Painscore = models.IntegerField(null=True, blank=True) 
    PainScore_Status = models.IntegerField(null=True, blank=True)
    SupplementalOxygen = models.CharField(max_length=100,null=True, blank=True)  
    SupplementalOxygen_Status = models.IntegerField(null=True, blank=True)  
    LevelOfConsiousness = models.CharField(max_length=100, null=True, blank=True)  
    LevelOfConsiousness_Status = models.IntegerField(null=True, blank=True)  
    CapillaryRefillTime = models.CharField(max_length=100, null=True, blank=True)  
    CapillaryRefillTime_Status = models.IntegerField(null=True, blank=True)  
    Type = models.CharField(max_length=30, null=True, blank=True)  
    # DepartmentType = models.CharField(max_length=30,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Created_by = models.CharField(max_length=30)


    class Meta:
        db_table = 'Patient_Vital_Details'

  
     
    

class ReferalDoctorDetails(models.Model):
    Refer_Id = models.IntegerField(primary_key=True)
    PatientId = models.CharField(max_length=50)
    VisitId = models.CharField(max_length=50)
    PrimaryDoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='primary_doctor') 
    ReferDoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='refer_doctor') 
    ReferDoctorType = models.CharField(max_length=50)
    Remarks = models.CharField(max_length=200, blank=True, null=True)
    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ReferalDoctorDetails'
    
    def save(self, *args, **kwargs):
        if not self.Refer_Id:
            # Fetch the maximum Refer_Id in the database
            max_id = ReferalDoctorDetails.objects.aggregate(max_id=Max('Refer_Id'))['max_id']
            self.Refer_Id = (max_id or 0) + 1
        super(ReferalDoctorDetails, self).save(*args,**kwargs)




# class Lab_Request_Details(models.Model):
#     Request_Id = models.IntegerField(primary_key=True)
#     RegisterType = models.CharField(max_length=30,default="")
#     OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
#     IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
#     Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
#     Laboratory_Register_Id = models.ForeignKey(Patient_Laboratory_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
#     TestType = models.CharField(max_length=60)
#     IndivitualCode = models.ForeignKey(LabTestName_Details,on_delete=models.CASCADE,null=True,blank=True)
#     FavouriteCode = models.ForeignKey(TestName_Favourites,on_delete=models.CASCADE,null=True,blank=True)
#     Reason = models.CharField(max_length=80, default="")
#     Status = models.CharField(max_length=20, default='Request')
#     created_by = models.CharField(max_length=30)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'Lab_Request_Details'
    
#     def save(self, *args, **kwargs):
#         if not self.Request_Id:
#             max_id = Lab_Request_Details.objects.aggregate(max_id=Max('Request_Id'))['max_id']
#             self.Request_Id = (max_id or 0) + 1
        
    
        
#         super(Lab_Request_Details, self).save(*args,**kwargs)


class Lab_Request_Details(models.Model):
    Request_Id = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30, default="")
    OP_Register_Id = models.ForeignKey(
        Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    IP_Register_Id = models.ForeignKey(
        Patient_IP_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Casuality_Register_Id = models.ForeignKey(
        Patient_Casuality_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Lab_Register_Id = models.ForeignKey(
        Patient_Laboratory_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Doctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
 
 
    Remarks = models.CharField(max_length=80, null=True, blank=True)
    Status = models.CharField(max_length=20, default="Pending")
    created_by = models.CharField(max_length=30)
    Billing_Status = models.CharField(max_length=15,default="Pending")
    Billing_Invoice_No = models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Report = models.BinaryField(null=True, blank=True)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Lab_Request_Details'

# therapy request        
 
 
 
class Therapy_Request_Details(models.Model):
    Request_Id = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30, default="")  # OP / IP / Casuality / TherapyOnly
   
   
 
    OP_Register_Id = models.ForeignKey(
        Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    IP_Register_Id = models.ForeignKey(
        Patient_IP_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Casuality_Register_Id = models.ForeignKey(
        Patient_Casuality_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Therapy_Register_Id = models.ForeignKey(
        DayCare_request_details, on_delete=models.CASCADE, null=True, blank=True
    )
    Therapy_Type = models.ForeignKey(
        TherapyType_Detials, on_delete=models.CASCADE
    )
    total_sessions = models.IntegerField(default=0)
    Sessions = models.IntegerField(default=0)
    Sessions_Balance = models.IntegerField(default=0)
    Sessions_Completed = models.IntegerField(default=0)
    Remarks = models.CharField(max_length=80, null=True, blank=True)
    Status = models.CharField(max_length=20, default="Pending")  # Pending / Completed / Cancelled
    created_by = models.CharField(max_length=30)
    Billing_Status = models.CharField(max_length=15, default="Pending")  # Pending / Billed / Cancelled
    Billing_UnPaid_sessions = models.IntegerField(default=0)
    Billing_Paid_sessions = models.IntegerField(default=0)
    Billing_Invoice_No = models.ForeignKey(
        General_Billing_Table_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    next_review_date = models.DateField()
    Report = models.BinaryField(null=True, blank=True)  # Optional: PDF or summary report
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Therapy_Request_Details'
 
class TherapySessionTracking(models.Model):
    session_id = models.AutoField(primary_key=True)
    Request_Id = models.ForeignKey(Therapy_Request_Details,on_delete=models.CASCADE)
    remarks =  models.CharField(max_length=20, default="Nothing")
    Status = models.CharField(max_length=20, default="Pending")
    next_review_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=30,default='therapist')
   
    class Meta:
        db_table = 'TherapySessionTracking'

class Lab_Request_Items_Details(models.Model):
    Item_Id = models.CharField(max_length=20,primary_key=True)
    Request = models.ForeignKey(Lab_Request_Details, on_delete=models.CASCADE, related_name="lab_request_items")
    TestType = models.CharField(max_length=60)
    Test_Code = models.ForeignKey(Test_Descriptions, on_delete=models.CASCADE, null=True, blank=True)
    Group_Code = models.ForeignKey(Group_Master, on_delete=models.CASCADE, null=True, blank=True)
    Package_Code = models.ForeignKey(OfferPackageMaster, on_delete=models.CASCADE, null=True, blank=True)
    Department_Code = models.ForeignKey(Lab_Department_Detials, on_delete=models.CASCADE)
    SubDepartment_Code = models.ForeignKey(SubLab_Department_Detials, on_delete=models.CASCADE)
    Service_Status = models.CharField(max_length=20, default="Pending")
    Analysis_Status = models.CharField(max_length=20, default="Pending")
    Verify_Status = models.CharField(max_length=20, default="Pending")
    Approve_Status = models.CharField(max_length=20, default="Pending")
    Collection_Time = models.CharField(max_length=20, null=True, blank=True)
    ResultEntryTime = models.CharField(max_length=20, null=True, blank=True)
    VerifyTime = models.CharField(max_length=20, null=True, blank=True)
    ApproveTime = models.CharField(max_length=20, null=True, blank=True)
    Phelobotomist_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="phelobotomist_items"
    )
    Technician_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="technician_items"
    )
    Verfier_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="verifier_items"
    )
    Approver_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="approver_items"
    )
    
    Result_Value = models.CharField(max_length=500, null=True, blank=True)
    Colony_Count = models.CharField(max_length=100, null=True, blank=True)
    Notes = models.TextField(null=True, blank=True)
    Microscopy_Data = models.TextField(null=True, blank=True)
    Culture_Report = models.TextField(null=True, blank=True)
    Report_Type = models.TextField(null=True, blank=True)
    Report_Status = models.TextField(null=True, blank=True)
    Remarks = models.TextField(null=True, blank=True)
    IsSubTest = models.CharField(max_length=255, null=True, blank=True)
    SubTestCodes = models.CharField(max_length=255, null=True, blank=True)
    Outsource_Lab = models.CharField(max_length=255, null=True, blank=True)
    Transfer_Location = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Lab_Request_Items_Details'




# class Complete_Culture_Examination(models.Model):
#     Item_Id = models.CharField(max_length=20,primary_key=True)
#     Request_Id = models.ForeignKey(Lab_Request_Details, on_delete=models.CASCADE,  related_name="complete_culture_examinations")
#     Billing_Invoice_No = models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
#     DoctorId = models.ForeignKey(
#         Doctor_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True
#     )
#     AntibioticName = models.ForeignKey(AntibioticMaster, on_delete=models.CASCADE, null=True, blank=True)
#     OrganismName = models.ForeignKey(Organism_Masters, on_delete=models.CASCADE)
#     Sensitive_Type = models.CharField(max_length=20, default="Pending")
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'Complete_Culture_Examination'


class Radiology_Request_Details(models.Model):
    Radiology_RequestId = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Diagnosis_Register_Id = models.ForeignKey(Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Billing_Invoice_No = models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    IP_Billing_Invoice_No = models.ForeignKey(IP_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Interim_Billing_Invoice_No = models.ForeignKey(Interim_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Doctorid = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    TestCode = models.CharField(max_length=50)
    SubTestCode = models.CharField(max_length=50)
    Reason = models.CharField(max_length=80, default="")
    Status = models.CharField(max_length=20, default='Request')
    Service_Status = models.CharField(max_length=20, default='Pending')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Canceledby = models.CharField(max_length=30,null=True,blank=True)
    IsCritical = models.BooleanField(default=False)
    CriticalIntimateDate = models.DateTimeField(null=True,blank=True)

   
    class Meta:
        db_table = 'Radiology_Request_Details'
        

   
    def save(self, *args, **kwargs):
        if not self.Radiology_RequestId:
            max_id = Radiology_Request_Details.objects.aggregate(max_id=Max('Radiology_RequestId'))['max_id']
            self.Radiology_RequestId = (max_id or 0) + 1
        super().save(*args, **kwargs)


class Lab_Request_Selected_Details(models.Model):
    SelectedRequest_Id = models.IntegerField(primary_key=True)
    RegisterType = models.CharField(max_length=30, default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='selected_testname', null=True, blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True)
    Laboratory_Register_Id = models.ForeignKey(Patient_Laboratory_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    TestType = models.CharField(max_length=60)
    IndivitualCode = models.ForeignKey(LabTestName_Details,on_delete=models.CASCADE,null=True,blank=True)
    OutSource_Name = models.ForeignKey(External_LabAmount_Details, on_delete=models.CASCADE,null=True,blank=True)
    Amount = models.IntegerField(default=0)
    Status = models.CharField(max_length=20, default='pending')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Lab_Request_Selected_Details'

    def save(self, *args, **kwargs):
        if not self.SelectedRequest_Id:
            max_id = Lab_Request_Selected_Details.objects.aggregate(max_id=Max('SelectedRequest_Id'))['max_id']
            self.SelectedRequest_Id = (max_id or 0) + 1
        

        
        if self.RegisterType == "OP":
            registration_id = self.OP_Register_Id
        elif self.RegisterType == "IP":
            registration_id = self.IP_Register_Id
        elif self.RegisterType == "Casuality":
            registration_id = self.Casuality_Register_Id
        elif self.RegisterType == "ExternalLab":
            registration_id = self.Laboratory_Register_Id
        else:
            registration_id = None

        if registration_id:
            related_request = Lab_Request_Details.objects.filter(
                RegisterType=self.RegisterType,
                IndivitualCode=self.IndivitualCode,
                **{
                    'OP_Register_Id': registration_id if self.RegisterType == 'OP' else None,
                    'IP_Register_Id': registration_id if self.RegisterType == 'IP' else None,
                    'Casuality_Register_Id': registration_id if self.RegisterType == 'Casuality' else None,
                    'Laboratory_Register_Id': registration_id if self.RegisterType == 'ExternalLab' else None
                }
            ).first()

            if self.Amount > 0 and (related_request is None or not related_request.Reason):
                super(Lab_Request_Selected_Details, self).save(*args, **kwargs)
        else:
            raise ValueError("Invalid RegisterType or Registration ID not set.")



class Lab_ReportEntry_Details(models.Model):
    report_id = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    report_date = models.DateTimeField(auto_now=True)
    report_time = models.TimeField(auto_now=True)
    report_file = models.BinaryField(null=True, blank=True)
    technician_name = models.CharField(max_length=60,default='Pending')
    report_handovered_by = models.CharField(max_length=40,default='Pending')
    report_handovered_to = models.CharField(max_length=40,default='Pending')
    created_by = models.CharField(max_length=40,default='Pending')
    status = models.CharField(max_length=40, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Lab_ReportEntry_Details'
    def save(self, *args, **kwargs):
        # Auto-increment SelectedRequest_Id if not set
        if not self.report_id:
            max_id = Lab_ReportEntry_Details.objects.aggregate(max_id=Max('report_id'))['max_id']
            self.report_id = (max_id or 0) + 1
        super(Lab_ReportEntry_Details, self).save(*args, **kwargs)



class PaidTest_Indivitaul(models.Model):
    reporttest_id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Lab_ReportEntry_Details, on_delete=models.CASCADE, related_name='test_details')
    test_type = models.CharField(max_length=60, default="Indivitual")
    testCode = models.ForeignKey(LabTestName_Details, on_delete=models.CASCADE, related_name='paid_test_details')
    value = models.CharField(max_length=40)
    category_type = models.CharField(max_length=40)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=40, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'PaidTest_Indivitaul'
    def save(self, *args, **kwargs):   
        # Set status based on the value field
        if self.value:
            self.status = 'Completed'
        else:
            self.status = 'Pending'
        
        # Call the superclass save method
        super().save(*args, **kwargs)
        # Auto-increment SelectedRequest_Id if not set
        if not self.reporttest_id:
            max_id = PaidTest_Indivitaul.objects.aggregate(max_id=Max('reporttest_id'))['max_id']
            self.reporttest_id = (max_id or 0) + 1






class PaidTest_Favourites(models.Model):
    reportfav_id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(Lab_ReportEntry_Details, on_delete=models.CASCADE, related_name='fav_details')
    favCode = models.ForeignKey(TestName_Favourites, on_delete=models.CASCADE, related_name='paid_fav_details')
    test_type = models.CharField(max_length=60, default="Favourites")
    category_type = models.CharField(max_length=40,default='')
    testCode = models.ForeignKey(LabTestName_Details, on_delete=models.CASCADE, related_name='paid_indivitual_details')
    value = models.CharField(max_length=40,default='')
    description = models.TextField(null=True, blank=True,default='')
    status = models.CharField(max_length=40, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'PaidTest_Favourites'
    def save(self, *args, **kwargs):
        if self.value:
            self.status = 'Completed'
        else:
            self.status = 'Pending'
        super().save(*args, **kwargs)
        # Auto-increment SelectedRequest_Id if not set
        if not self.reportfav_id:
            max_id = PaidTest_Favourites.objects.aggregate(max_id=Max('reportfav_id'))['max_id']
            self.reportfav_id = (max_id or 0) + 1






# class Ip_Drug_Administration(models.Model):
#     Prescription_Id = models.IntegerField(primary_key=True)
#     IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE)
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
#     FrequencyTime = models.TimeField(auto_now=True)
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
#     Nurse_Prescription_Id = models.IntegerField(primary_key=True)
#     IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE)
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
#     Issued_Date = models.DateField(auto_now=True)
#     Complete_Date = models.DateField(auto_now=True)
#     Complete_Time = models.TimeField(auto_now=True)
#     Completed_Remarks = models.CharField(max_length=60)
#     Status = models.CharField(max_length=60)
#     CapturedBy = models.CharField(max_length=60)
#     AdminisDose = models.CharField(max_length=60)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'Ip_Nurse_Drug_Completed_Administration'
#     def save(self, *args, **kwargs):
#         if not self.Nurse_Prescription_Id:
#             max_id = Ip_Nurse_Drug_Completed_Administration.objects.aggregate(max_id=Max('Nurse_Prescription_Id')) ['max_id']
#             self.Nurse_Prescription_Id = (max_id or 0) + 1
#         super(Ip_Nurse_Drug_Completed_Administration, self).save(*args, **kwargs)
        
    
    
    
    
    
class Ot_Request(models.Model):
    Request_Id = models.AutoField(primary_key=True) 
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Surgery_Name = models.ForeignKey(SurgeryName_Details,on_delete=models.CASCADE,null=True,blank=True)
    Surgery_Date = models.DateTimeField(auto_now=True)
    Surgery_Time = models.TimeField(auto_now=True)
    Remarks =  models.TextField(null=True, blank=True)
    Reason = models.TextField(null=True, blank=True)
    Priority =models.CharField(max_length=40)
    created_by = models.CharField(max_length=40)
    Additional_Doctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Status = models.CharField(max_length=40, default='Pending')
    
    class Meta:
        db_table = 'Ot_Request'
    def save(self, *args, **kwargs):
        # Auto-increment SelectedRequest_Id if not set
        if not self.Request_Id:
            max_id = Ot_Request.objects.aggregate(max_id=Max('Request_Id'))['max_id']
            self.Request_Id = (max_id or 0) + 1
        super(Ot_Request, self).save(*args,**kwargs)




class Radiology_Complete_Details(models.Model):
    Radiology_CompleteId = models.IntegerField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Radiology_RequestId = models.ForeignKey(Radiology_Request_Details,on_delete=models.CASCADE,null=True,blank=True)
    ReportDate = models.DateTimeField(auto_now=True)
    ReportTime = models.TimeField(auto_now=True)
    RadiologistName = models.CharField(max_length=40)
    Technician_Name = models.CharField(max_length=40)
    Report = models.TextField()
    Report_fileone = models.BinaryField(null=True, blank=True)
    Report_filetwo = models.BinaryField(null=True,blank=True)
    Report_filethree = models.BinaryField(null=True,blank=True)
    Report_HandOverTo = models.CharField(max_length=30)
    RelativeName = models.CharField(max_length=30)
    department = models.ForeignKey(
        RadiologyNames_Details,
        on_delete=models.CASCADE,
        to_field='Radiology_Id',
        null=True,
        blank=True
    )
    doctorId = models.CharField(max_length=100, null=True, blank=True)
    doctorName = models.CharField(max_length=255, null=True, blank=True)
    fileName = models.CharField(max_length=255, null=True, blank=True)
    # file = models.FileField(upload_to='technician_docs/', null=True, blank=True)
    content = models.BinaryField(null=True, blank=True)
    html_content = models.TextField(null=True, blank=True)
    Createdby = models.CharField(max_length=30)
    Status = models.CharField(max_length=30, default='Completed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    TestCode = models.CharField(max_length=50, null=True, blank=True)
    Document_Id = models.CharField(max_length=30, default='0')
    
    class Meta:
        db_table = 'Radiology_Complete_Details'
    
    def save(self, *args, **kwargs):
        if not self.Radiology_CompleteId:
            max_id = Radiology_Complete_Details.objects.aggregate(max_id=Max('Radiology_CompleteId'))['max_id']
            self.Radiology_CompleteId = (max_id or 0) + 1
        super(Radiology_Complete_Details, self).save(*args, **kwargs)





class Patient_Radiology_Vital_Details(models.Model):
    VitalRequest_Id = models.IntegerField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Diagnosis_Register_Id = models.ForeignKey(Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Bp = models.CharField(max_length=40)
    Temperature = models.FloatField(null=True, blank=True)   
    SPO2 = models.IntegerField(null=True, blank=True) 
    Heart_Rate = models.IntegerField(null=True, blank=True) 
    Respiratory_Rate = models.IntegerField(null=True, blank=True)   
    Height = models.FloatField(null=True, blank=True) 
    Weight = models.FloatField(null=True, blank=True)   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Created_by = models.CharField(max_length=30)
    Status = models.CharField(max_length=20, default='Pending')
    
    class Meta:
        db_table = 'Patient_Radiology_Vital_Details'
    
    def save(self, *args, **kwargs):
        if not self.VitalRequest_Id:
            # Use a queryset to access the aggregate function
            max_id = Patient_Radiology_Vital_Details.objects.aggregate(max_id=Max('VitalRequest_Id'))['max_id']
            self.VitalRequest_Id = (max_id or 0 ) + 1

        super(Patient_Radiology_Vital_Details, self).save(*args, **kwargs)


class Radiology_Medical_History(models.Model):
    Id = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Diagnosis_Register_Id = models.ForeignKey(Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Illnessordiseases = models.CharField(max_length=10,blank=True,null=True)
    IllnessordiseasesText = models.TextField()
    Surgerybefore = models.CharField(max_length=10,blank=True,null=True)
    SurgerybeforeText = models.TextField()
    Pressureorheartdiseases = models.CharField(max_length=10,blank=True,null=True)
    PressureorheartdiseasesText = models.TextField()
    Allergicmedicine = models.CharField(max_length=10,blank=True,null=True)
    AllergicmedicineText = models.TextField()
    Alreadytakentest = models.CharField(max_length=10,blank=True,null=True)
    AlreadytakentestText = models.TextField()
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
    Other = models.TextField()    
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Radiology_Medical_History'






class Vaccination_Taken_Details(models.Model):
    TakenId = models.AutoField(primary_key=True)
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE)
    VaccinId = models.ForeignKey(Vaccine_Master_Details, on_delete=models.CASCADE)
    DoseNumber = models.IntegerField(blank=True, null=True)
    TakenDate = models.DateField()
    NextDueDate = models.DateField(null=True, blank=True)
    Remarks = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Vaccination_Taken_Details'









