from django.db import models
from django.db.models import Max
from Masters.models import *
from django.core.exceptions import ValidationError
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from django.db import transaction






# Create your models here.
class EmergencyRegister(models.Model):
    EmergencyRegister_Id = models.IntegerField(primary_key=True)
    PatientName = models.CharField(max_length=50)
    PatientPhone = models.CharField(max_length=50)
    Speciality = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE, related_name='emg_register_specialities',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='emg_register_Doctor')
    ReferalDoctor = models.CharField(max_length=50)
    Status = models.CharField(max_length=30, default='Pending')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'EmergencyRegister'


    
    
    def save(self, *args, **kwargs):
        if not self.EmergencyRegister_Id:  # Check if accountsetting_id is not set
            max_id = EmergencyRegister.objects.aggregate(max_id=Max('EmergencyRegister_Id'))['max_id']
            self.EmergencyRegister_Id = (max_id or 0) + 1
        super(EmergencyRegister, self).save(*args,**kwargs)


class Existing_Patient_Details(models.Model):
    OPNo = models.CharField(max_length=255, blank=True, null=True)
    YearNo = models.CharField(max_length=255, blank=True, null=True) 
    OPDate = models.CharField(max_length=255, blank=True, null=True) 
    OpTime = models.CharField(max_length=255, blank=True, null=True)  
    NamePrefix = models.CharField(max_length=255)  
    PatientName = models.CharField(max_length=255) 
    CasualtyPat = models.CharField(max_length=255) 
    Category = models.CharField(max_length=255)
    MemberID = models.CharField(max_length=255) 
    Specialty = models.CharField(max_length=255)  # varchar, NO, increased from 100
    DeptName = models.CharField(max_length=255)  # varchar, NO, increased from 100
    UnitNo = models.CharField(max_length=255)  # varchar, NO, increased from 20
    Ref_Doctor = models.CharField(max_length=255)  # varchar, NO, increased from 100
    TariffType = models.CharField(max_length=255)  # varchar, NO, increased from 50
    TillValidity = models.CharField(max_length=255, blank=True, null=True)  # datetime(6), YES
    RegFee = models.CharField(max_length=255, blank=True, null=True)  # double, YES
    FatherName = models.CharField(max_length=255)  # varchar, NO, increased from 100
    Address = models.TextField()  # longtext, NO (unlimited storage)
    Location = models.CharField(max_length=255)  # varchar, NO, increased from 100
    PhoneNo = models.CharField(max_length=255)  # varchar, NO, increased from 20
    Age = models.CharField(max_length=255, blank=True, null=True)  # int, YES
    AgeIn = models.CharField(max_length=255)  # varchar, NO, increased from 10
    Date_of_Birth = models.CharField(max_length=255, blank=True, null=True)  # date, YES
    Sex = models.CharField(max_length=255)  # varchar, NO, increased from 1
    MarriedYN = models.CharField(max_length=255)  # varchar, NO, increased from 1
    Religion = models.CharField(max_length=255)  # varchar, NO, increased from 50
    SubCaste = models.CharField(max_length=255)  # varchar, NO, increased from 50
    Occupation = models.CharField(max_length=255)  # varchar, NO, increased from 50
    Anual_Income = models.CharField(max_length=255, blank=True, null=True)  # double, YES
    BloodGrp = models.CharField(max_length=255, blank=True)  # varchar, YES, increased from 20
    Complaint = models.TextField()  # longtext, NO (unlimited storage)
    Corporate = models.CharField(max_length=255)  # varchar, NO, increased from 50
    PrepBy = models.CharField(max_length=255)  # varchar, NO, increased from 50
    ModiBy = models.CharField(max_length=255)  # varchar, NO, increased from 50
    CreditYN = models.CharField(max_length=255)  # varchar, NO, increased from 1
    RefDoctor = models.CharField(max_length=255)  # varchar, NO, increased from 100
    RefHospital = models.CharField(max_length=255)  # varchar, NO, increased from 100
    RSBYCardYN = models.CharField(max_length=255)  # varchar, NO, increased from 1
    RSBYCardNo = models.CharField(max_length=255)  # varchar, NO, increased from 50
    OPNORef = models.CharField(max_length=255, blank=True, null=True)  # int, YES
    OPYearRef = models.CharField(max_length=255, blank=True, null=True)  # int, YES
    CardCount = models.CharField(max_length=255, blank=True, null=True)  # int, YES
    ModifiedDate = models.CharField(max_length=255, blank=True, null=True)  # datetime(6), YES

    def __str__(self):
        return f"{self.OPNo} - {self.PatientName}"

class Existing_Patient_RevisitPatient(models.Model):
    OPNo = models.CharField(max_length=255, blank=True, null=True)  # varchar
    YearNo = models.CharField(max_length=255, blank=True, null=True)  # int or varchar
    ReVisitDate = models.CharField(max_length=255, blank=True, null=True)  # datetime or date
    ReVisitTime = models.CharField(max_length=255, blank=True, null=True)  # time
    DeptName = models.CharField(max_length=255, blank=True, null=True)  # varchar
    UnitNo = models.CharField(max_length=255, blank=True, null=True)  # varchar
    RefDoctor = models.CharField(max_length=255, blank=True, null=True)  # varchar
    TillValidity = models.CharField(max_length=255, blank=True, null=True)  # datetime
    Revisit_Fee = models.CharField(max_length=255, blank=True, null=True)  # double/decimal
    Age = models.CharField(max_length=255, blank=True, null=True)  # int
    AgeIn = models.CharField(max_length=255, blank=True, null=True)  # varchar
    Complaint = models.TextField(blank=True, null=True)  # longtext
    Category = models.CharField(max_length=255, blank=True, null=True)  # varchar
    Specialty = models.CharField(max_length=255, blank=True, null=True)  # varchar
    PrepBy = models.CharField(max_length=255, blank=True, null=True)  # varchar
    ModiBy = models.CharField(max_length=255, blank=True, null=True)  # varchar
    CasualtyPat = models.CharField(max_length=255, blank=True, null=True)  # varchar
    CreditYN = models.CharField(max_length=255, blank=True, null=True)  # varchar
    OFFDoctor = models.CharField(max_length=255, blank=True, null=True)  # varchar
    Remarks = models.TextField(blank=True, null=True)  # longtext
    VisitID = models.CharField(max_length=255, blank=True, null=True)  # int or varchar
    RefBy = models.CharField(max_length=255, blank=True, null=True)  # varchar
    RefHospital = models.CharField(max_length=255, blank=True, null=True)  # varchar

    def __str__(self):
        return f"{self.OPNo} - {self.YearNo} - {self.ReVisitDate}"
    
    class Meta:
        db_table = 'Existing_Patient_RevisitPatient'



class Patient_Detials(models.Model):
    PatientId = models.CharField(primary_key=True,max_length=30)
    DuplicateId = models.BooleanField(default=False)
    Patient_profile = models.BinaryField(null=True,blank=True,default=True)
    ExistingPtNo = models.CharField(max_length=30,blank=True,null=True)
    DateOfReg = models.CharField(max_length=30,blank=True,null=True)
    LastVisitDate = models.CharField(max_length=30,blank=True,null=True)
    Title = models.ForeignKey(Title_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='patientId_Title')
    # Title = models.ForeignKey(Title_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='patientId_Title')
    # Title = models.CharField(max_length=30,blank=True,null=True)
    FirstName = models.CharField(max_length=30,blank=True,null=True)
    MiddleName = models.CharField(max_length=30,blank=True,null=True)
    SurName = models.CharField(max_length=30,blank=True,null=True)
    Gender = models.CharField(max_length=30,blank=True,null=True)
    # AliasName = models.CharField(max_length=30)
    MaritalStatus = models.CharField(max_length=30,blank=True,null=True)
    SpouseName = models.CharField(max_length=50,blank=True,null=True)
    FatherName = models.CharField(max_length=50,blank=True,null=True)
    DOB = models.CharField(max_length=20,blank=True,null=True)
    Age = models.CharField(max_length=20,blank=True,null=True)
    PhoneNo = models.CharField(max_length=30,blank=True,null=True)
    Email = models.CharField(max_length=50,blank=True,null=True)
    BloodGroup = models.ForeignKey(BloodGroup_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='patientId_Bloodgroup')
    Occupation = models.CharField(max_length=50,blank=True,null=True)
    Religion = models.ForeignKey(Religion_Detials, on_delete=models.CASCADE, related_name='Orgional_patientId',null=True,blank=True)
    Nationality = models.CharField(max_length=50,blank=True,null=True)
    UniqueIdType = models.CharField(max_length=30,blank=True,null=True)
    UniqueIdNo = models.CharField(max_length=30,blank=True,null=True)
 
    PatientType = models.CharField(max_length=30,blank=True,null=True)
    ABHA = models.CharField(max_length=30,blank=True,null=True)
    Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
   
    DoorNo = models.CharField(max_length=255,blank=True,null=True)
    Street = models.CharField(max_length=255,blank=True,null=True)
    Area = models.CharField(max_length=255,blank=True,null=True)
    City = models.CharField(max_length=255,blank=True,null=True)
    District = models.CharField(max_length=255,blank=True,null=True)
    State = models.CharField(max_length=255,blank=True,null=True)
    Country = models.CharField(max_length=255,blank=True,null=True)
    Pincode = models.CharField(max_length=255,blank=True,null=True)
   
    PermanentAddressSameAsAbove = models.CharField(max_length=255,blank=True,null=True)
   
    PermanentdoorNo = models.CharField(max_length=255,null=True,blank=True)
    PermanentStreet = models.CharField(max_length=255,blank=True,null=True)
    PermanentArea = models.CharField(max_length=255,blank=True,null=True)
    PermanentCity = models.CharField(max_length=255,blank=True,null=True)
    PermanentDistrict = models.CharField(max_length=255,blank=True,null=True)
    PermanentState = models.CharField(max_length=255,blank=True,null=True)
    PermanentCountry = models.CharField(max_length=255,blank=True,null=True)
    PermanentPincode = models.CharField(max_length=255,blank=True,null=True)
   
   
    LedgerName=models.CharField(max_length=200)
    LedgerGroupName=models.ForeignKey('Finance.Finance_GroupMaster_Detailes',on_delete=models.CASCADE,related_name='Patient_Detials', null=True, blank=True)
    OpeningBalance=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    DebitOrCredit=models.CharField(max_length=15, null=True, blank=True, default=None)
 
   
    DoctorID = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True, blank=True)
    SpecializationId = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True, blank=True)
    appointmentId = models.ForeignKey('Appointment_Request_List',on_delete=models.CASCADE,null=True,blank=True)
 
    OldDepartment = models.CharField(max_length=255,null=True,blank=True)
    YearNo = models.CharField(max_length=255, blank=True, null=True)  # int or varchar
 
    created_by = models.CharField(max_length=30)
    Status = models.CharField(max_length=20, default='Saved')
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Patient_Detials'
   
   
    # def save(self, *args, **kwargs):
       
 
    #     if not self.PatientId:
    #         # hospital_details = Hospital_Detials.objects.first()
    #         # if not hospital_details:
    #         #     raise ValueError("No Hospital_Details records found.")
           
    #         # clinic_name = hospital_details.Hospital_Name[:3].upper()
    #         today_date = datetime.now().strftime('%y%m%d')
    #         prefix = f'{today_date}'
           
    #         # Find the maximum numeric part from existing PatientId with the same prefix
    #         max_patient_id = Patient_Detials.objects.all().order_by('-created_at').first()

    #         print(max_patient_id,'max_patient_id')
    #         if max_patient_id:
    #             numeric_part = int(max_patient_id[5:]) + 1
    #         else:
    #             numeric_part = 1

    #         print(numeric_part,'numeric_part')
    #         self.PatientId = f'{prefix}{numeric_part}'
       
    #     super(Patient_Detials, self).save(*args, **kwargs)
 

    # def save(self, *args, **kwargs):
    #     if not self.PatientId:
    #         today_date = datetime.now().strftime('%y%m%d')
    #         prefix = f'{today_date}'

    #         # Get last created patient (any date)
    #         last_patient = (
    #             Patient_Detials.objects
    #             .order_by('-created_at')
    #             .first()
    #         )

    #         print(last_patient,'last_patient')

    #         if last_patient and last_patient.PatientId.startswith(prefix):
    #             # Same-day → increment from last one
    #             numeric_part = int(last_patient.PatientId[len(prefix):]) + 1
    #         else:
    #             # New day or no records → start fresh
    #             numeric_part = 1
    #         print(numeric_part,'numeric_part')
    #         # Zero-padded numeric part
    #         self.PatientId = f'{prefix}{numeric_part:05d}'

    #     super(Patient_Detials, self).save(*args, **kwargs)

    def save(self, *args, **kwargs):
        if not self.PatientId:
            YEAR = datetime.now().strftime('%y')
        
            last_id = Patient_Detials.objects.order_by('-created_at').first()
            num = last_id.PatientId.split('-')[1]
            now = last_id.PatientId.split('-')[0]

            new_no = int(num)
        
        
            if not num or not now or now != YEAR:
                next_id = YEAR + "-" +"1" # 25-1
                print(next_id)
            else:
                print("----------",str(YEAR) + "-" + str(new_no+1))
                next_id = str(YEAR) + "-" + str(new_no+1)

            self.PatientId = next_id
    
        super(Patient_Detials, self).save(*args, **kwargs)
    
 
 

class Appointment_Request_List(models.Model):
    appointment_id = models.IntegerField(primary_key=True)
    title = models.ForeignKey(Title_Detials,on_delete=models.CASCADE,blank=True,null=True,related_name='Appointment_title')
    PatientId = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,blank=True,null=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    Age = models.CharField(max_length=50,blank=True,null=True)
    Gender = models.CharField(max_length=50,blank=True,null=True)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    request_date = models.DateField()
    appointment_type = models.CharField(max_length=10)
    request_time = models.TimeField()
    VisitType = models.CharField(max_length=50,blank=True,null=True)
    visit_purpose = models.CharField(max_length=50,blank=True,null=True)
    specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,related_name='appointment_request_list_specialization',null=True,blank=True)
    doctor_name = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,related_name='appointment_request_list_doctor_name',null=True,blank=True)
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    status = models.CharField(max_length=30, default='PENDING')
    created_by = models.CharField(max_length=50)
    updated_by = models.CharField(max_length=50,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelReason = models.CharField(max_length=200)
    ReferredBy = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='appreferallldoctor',null=True,blank=True)
    def __str__(self):
        return f"{self.title} {self.first_name} {self.last_name}"
    
    def save(self, *args, **kwargs):
        if not self.appointment_id:  # Check if appointment_id is not set (i.e., new instance)
            max_id = Appointment_Request_List.objects.aggregate(max_id=Max('appointment_id'))['max_id']
            self.appointment_id = (max_id or 0) + 1
        super(Appointment_Request_List, self).save(*args, **kwargs)



class Appointment_ReSchedule_Request(models.Model):
    appointmentId = models.ForeignKey(Appointment_Request_List,on_delete=models.CASCADE,null=True,blank=True)
    RadioOption = models.CharField(max_length=30)
    RequestDate = models.DateField()
    RequestTime = models.TimeField(blank=True,null=True)
    ChangingReason = models.TextField(default='')
    specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,related_name='appointment_reschedule_list_specialization',null=True,blank=True)
    doctor_name = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,related_name='appointment_reschedule_list_doctor_name',null=True,blank=True)
    status = models.CharField(max_length=30, default='Reschedule')
    created_by = models.CharField(max_length=30, default='')
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ReferredBy = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='appointmentreferal',null=True,blank=True)




# # --------------patient registration

# class Patient_Detials(models.Model):
#     PatientId = models.CharField(primary_key=True,max_length=30)
#     DuplicateId = models.BooleanField(default=False)
#     Patient_profile = models.BinaryField(null=True,blank=True,default=True)
#     PhoneNo = models.CharField(max_length=30)
#     Title = models.CharField(max_length=30)
#     FirstName = models.CharField(max_length=30)
#     MiddleName = models.CharField(max_length=30)
#     SurName = models.CharField(max_length=30)
#     Gender = models.CharField(max_length=30)
#     AliasName = models.CharField(max_length=30)
#     MaritalStatus = models.CharField(max_length=30,blank=True,null=True)
#     SpouseName = models.CharField(max_length=50,blank=True,null=True)
#     FatherName = models.CharField(max_length=50,blank=True,null=True)
#     DOB = models.CharField(max_length=20)
#     Age = models.CharField(max_length=20)
#     Email = models.CharField(max_length=30)
#     BloodGroup = models.ForeignKey(BloodGroup_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='patientId_Bloodgroup')
#     Occupation = models.CharField(max_length=30)
#     Religion = models.ForeignKey(Religion_Detials, on_delete=models.CASCADE, related_name='Orgional_patientId',null=True,blank=True)
#     Nationality = models.CharField(max_length=30)
#     UniqueIdType = models.CharField(max_length=30)
#     UniqueIdNo = models.CharField(max_length=30)
#     DoorNo = models.CharField(max_length=20)
#     Street = models.CharField(max_length=30)
#     Area = models.CharField(max_length=30)
#     City = models.CharField(max_length=30)
#     District = models.CharField(max_length=50,blank=True,null=True)
#     State = models.CharField(max_length=30)
#     Country = models.CharField(max_length=30)
#     Pincode = models.CharField(max_length=20)
#     created_by = models.CharField(max_length=30)
#     updated_by = models.CharField(max_length=30,default='')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'Patient_Detials'
    
    
#     def save(self, *args, **kwargs):
       

#         if not self.PatientId:
#             hospital_details = Hospital_Detials.objects.first()
#             if not hospital_details:
#                 raise ValueError("No Hospital_Details records found.")
            
#             clinic_name = hospital_details.Hospital_Name[:3].upper()
#             today_date = datetime.now().strftime('%y%m%d')
#             prefix = f'{clinic_name}{today_date}'
            
#             # Find the maximum numeric part from existing PatientId with the same prefix
#             max_patient_id = Patient_Detials.objects.aggregate(max_id=Max('PatientId'))['max_id']
#             if max_patient_id:
#                 numeric_part = int(max_patient_id[-4:]) + 1
#             else:
#                 numeric_part = 1
#             self.PatientId = f'{prefix}{numeric_part:04}'
       
#         super(Patient_Detials, self).save(*args, **kwargs)





class Duplicates_patients(models.Model):
    Orgional_patientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='Orgional_patientId')
    Duplicates_patientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='Duplicates_patientId')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Duplicates_patients'
   


class Patient_Visit_Detials(models.Model):
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='Patient_Visit_patient_detials')
    VisitId = models.IntegerField(default=1)
    RegisterType = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Visit_Detials'
   



class Patient_Appointment_Registration_Detials(models.Model):  
    Registration_Id = models.CharField(max_length=30, unique=True)
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='appointment_details')
    VisitId = models.IntegerField()
    CardValidity = models.CharField(max_length=30,blank=True,null=True)
    VisitPurpose = models.CharField(max_length=30,blank=True,null=True)
    # VisitType = models.CharField(max_length=30,blank=True,null=True)
    # Specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE, related_name='appointment_speciality', null=True, blank=True)
    # PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='appointment_doctor', null=True, blank=True)
    AppointmentId = models.IntegerField()
    ApptoRegId = models.ForeignKey(Appointment_Request_List, on_delete=models.CASCADE, null=True, blank=True)
    
    # Complaint = models.TextField(default='')
    PatientCategory = models.CharField(max_length=30,blank=True,null=True)
    InsuranceName = models.ForeignKey(Insurance_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # InsuranceName = models.CharField(max_length=30)
    # PatientType = models.CharField(max_length=30,blank=True,null=True)
    InsuranceType = models.CharField(max_length=30,blank=True,null=True)
    # ClientName = models.CharField(max_length=30)
    # TokenNo = models.CharField(max_length=30,blank=True,null=True)
    ClientName = models.ForeignKey(Client_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ClientType = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
    CorporateName = models.ForeignKey(Corporate_Master_Detials, on_delete=models.CASCADE, related_name='patient_details_CorporateId', null=True, blank=True)
    CorporateType = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
   
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name='appointment_EmployeeId', null=True, blank=True)
    EmployeeRelation = models.CharField(max_length=40,blank=True,null=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='appointment_DoctorId', null=True, blank=True)
    DoctorRelation = models.CharField(max_length=30,blank=True,null=True)
    # DonationType = models.CharField(max_length=30,blank=True,null=True)
    DonationType = models.ForeignKey(Donation_Master_Detials, on_delete=models.CASCADE, related_name='patient_details_DonationId', null=True, blank=True)
    IsMLC = models.CharField(max_length=20,blank=True,null=True)
    # Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
    IsReferral = models.CharField(max_length=20,blank=True,null=True)
    Status = models.CharField(max_length=20, default='Registered')
    Bill_Status = models.CharField(max_length=20, default='Pending')
    ConsultingTime = models.DateTimeField(null=True, blank=True)
    CompletedTime = models.DateTimeField(null=True, blank=True)
    FinalCompletedTime = models.DateTimeField(null=True, blank=True)
    CancelTime = models.DateTimeField(null=True, blank=True)
    CancelReason = models.TextField(null=True, blank=True)
    ResheduleDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True)
    ResheduleSpeciality = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE, null=True, blank=True)
    ResheduleReason = models.TextField(null=True, blank=True)
    ResheduleTime = models.DateTimeField(null=True, blank=True)    
    Reason = models.TextField()
    IP_Request_status = models.CharField(max_length=20, default='No')
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    NextToKinName = models.CharField(max_length=50,blank=True,null=True)
    Relation = models.CharField(max_length=50,blank=True,null=True)
    RelativePhNo = models.CharField(max_length=30,blank=True,null=True)
    ServiceCategory = models.CharField(max_length=30,blank=True,null=True)
    ServiceSubCategory = models.CharField(max_length=30,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Appointment_Registration_Detials'

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.pk:
                current_year = datetime.now().strftime('%y%m')  # e.g. '25' for 2025
                prefix = f"OP{current_year}"
    
                # Fetch the latest Registration_Id starting with the current year's prefix
                # last_entry = Patient_Appointment_Registration_Detials.objects.filter(
                #     Registration_Id__startswith=prefix
                # ).order_by('-Registration_Id').first()
    
                # if last_entry and last_entry.Registration_Id:
                #     # Extract numeric suffix and increment
                #     last_number = int(last_entry.Registration_Id[len(prefix):])
                #     next_number = last_number + 1
                # else:
                #     next_number = 1  # First entry for this year
    

                # Fetch all Registration_Ids starting with the current prefix
                matching_entries = Patient_Appointment_Registration_Detials.objects.select_for_update().filter(
                    Registration_Id__startswith=prefix
                ).values_list('Registration_Id', flat=True)

                if matching_entries:
                    # Extract the numeric part of each Registration_Id and find the maximum
                    numeric_parts = [
                        int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
                    ]
                    next_number = max(numeric_parts) + 1 if numeric_parts else 1
                else:
                    next_number = 1  # First entry for this year/month


                # Final format: 25OP01, 25OP02, ..., 26OP01 next year
                self.Registration_Id = f"{prefix}{next_number}"
                # self.Registration_Id = f"{prefix}{next_number:02d}"
    
                # Optional: set AppointmentId as auto-increment per day
                today = datetime.now().strftime('%Y-%m-%d')
                max_id_today = Patient_Appointment_Registration_Detials.objects.filter(
                    created_at__date=today
                ).aggregate(max_id=Max('AppointmentId'))['max_id']
                self.AppointmentId = (max_id_today or 0) + 1
    
            super(Patient_Appointment_Registration_Detials, self).save(*args, **kwargs)
    
        def clean(self):
            super().clean()
            # Validate length of all CharField fields
            char_fields = [
                'VisitPurpose', 'CaseSheetNo', 'ANCNumber', 'MCTSNo', 'Complaint', 'PatientType',
                'InsuranceName', 'InsuranceType', 'ClientName', 'ClientType', 'ClientEmployeeId', 'ClientEmployeeDesignation',
                'ClientEmployeeRelation', 'EmployeeRelation', 'DoctorRelation', 'DonationType', 'IsMLC', 'Flagging', 'IsReferral',
                'Status', 'created_by'
            ]
            for field in char_fields:
                value = getattr(self, field, '')
                if len(value) > self._meta.get_field(field).max_length:
                    raise ValidationError({'error': f"{field} cannot be more than {self._meta.get_field(field).max_length} characters."})
    
            # Validate length of Reason field if needed
            if len(self.Reason) > 1000:  # assuming a max length for Reason
                raise ValidationError({'error': "Reason cannot be more than 1000 characters."})




class OP_Patient_Appointment_With_Multiple_Doctor(models.Model):
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name="appointment_doctor_specialties",blank=True,null=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name="doctor_appointments",blank=True,null=True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE, related_name="specialization_appointments",blank=True,null=True)
    AppointmentSlot_by_Specialization = models.IntegerField(default=0)
    AppointmentSlot_by_Doctor = models.IntegerField(default=0)
    VisitType = models.CharField(max_length=30,blank=True,null=True)
    Complaint = models.TextField(default='')
    TokenNo = models.CharField(max_length=30,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Status = models.CharField(max_length=20, default='Registered')
    RenewDate = models.DateField(null=True,blank=True)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "OP_Patient_Appointment_With_Multiple_Doctor"
    
    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new instance
            current_date = datetime.now().date()
            start_id = 1

            # AppointmentSlot by specialization logic
            max_spi_slot_today = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__date=current_date,
                Specialization=self.Specialization
            ).aggregate(max_slot=Max('AppointmentSlot_by_Specialization'))['max_slot']
            self.AppointmentSlot_by_Specialization = (max_spi_slot_today or 0) + start_id

            # AppointmentSlot by doctor logic
            max_doc_slot_today = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__date=current_date,
                PrimaryDoctor=self.PrimaryDoctor
            ).aggregate(max_slot=Max('AppointmentSlot_by_Doctor'))['max_slot']
            self.AppointmentSlot_by_Doctor = (max_doc_slot_today or 0) + start_id

        super(OP_Patient_Appointment_With_Multiple_Doctor, self).save(*args, **kwargs)
    

class Patient_Smartcard_Details(models.Model):
    PatientId = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,blank=True,null=True)
    ExistingPtNo = models.CharField(max_length=30,blank=True,null=True)
    Title = models.ForeignKey(Title_Detials,on_delete=models.CASCADE,null=True,blank=True)
    FirstName = models.CharField(max_length=30,blank=True,null=True)
    MiddleName = models.CharField(max_length=30,blank=True,null=True)
    SurName = models.CharField(max_length=30,blank=True,null=True)
    Gender = models.CharField(max_length=30,blank=True,null=True)
    SpouseName = models.CharField(max_length=50,blank=True,null=True)
    FatherName = models.CharField(max_length=50,blank=True,null=True)
    DOB = models.CharField(max_length=20,blank=True,null=True)
    Age = models.CharField(max_length=20,blank=True,null=True)
    DoorNo = models.CharField(max_length=50,blank=True,null=True)
    Street = models.CharField(max_length=50,blank=True,null=True)
    Area = models.CharField(max_length=50,blank=True,null=True)
    City = models.CharField(max_length=50,blank=True,null=True)
    District = models.CharField(max_length=50,blank=True,null=True)
    State = models.CharField(max_length=50,blank=True,null=True)
    Country = models.CharField(max_length=50,blank=True,null=True)
    Pincode = models.CharField(max_length=50,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Status = models.CharField(max_length=20, default='CardSaved')
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "Patient_Smartcard_Details"
    
  
from django.apps import apps
 
from django.db import transaction
 
from datetime import datetime
 
import re
 
def generate_next_ip_number():
    current_year_month = datetime.now().strftime('%y%m')
    prefix = f"IP{current_year_month}"
   
    # Import models
    FrontofficeModel = apps.get_model('Frontoffice', 'Patient_IP_Registration_Detials')
    MCIModel = apps.get_model('MCI', 'MCI_Patient_IP_Registration_Detials')
   
    with transaction.atomic():
        # Get all IP numbers from BOTH tables
        frontoffice_ids = FrontofficeModel.objects.select_for_update().filter(
            Registration_Id__startswith=prefix
        ).values_list('Registration_Id', flat=True)
       
        mci_ids = MCIModel.objects.select_for_update().filter(
            IPNo__startswith=prefix
        ).values_list('IPNo', flat=True)
       
        all_ids = list(frontoffice_ids) + list(mci_ids)
       
        max_sequence = 0
        for ip in all_ids:
            seq_part = ip[len(prefix):]
            if seq_part.isdigit():
                max_sequence = max(max_sequence, int(seq_part))
       
        return f"{prefix}{max_sequence + 1}"
 
 
class Patient_IP_Registration_Detials(models.Model):
    Registration_Id = models.CharField(primary_key=True,max_length=30)
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE,)
    # VisitId = models.IntegerField()
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Primary_doctor_ip_details',null=True,blank=True)
    Complaint = models.TextField(default='')
    IsMLC = models.CharField(max_length=20)
    Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
    IsReferral = models.CharField(max_length=20)
   
    PatientCategory = models.CharField(max_length=30,blank=True,null=True)
    InsuranceName = models.ForeignKey(Insurance_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    InsuranceType = models.CharField(max_length=30,blank=True,null=True)
    ClientName = models.ForeignKey(Client_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ClientType = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
    CorporateName = models.ForeignKey(Corporate_Master_Detials, on_delete=models.CASCADE, related_name='IP_patient_details_CorporateId', null=True, blank=True)
    CorporateType = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
   
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name='IP_appointment_EmployeeId', null=True, blank=True)
    EmployeeRelation = models.CharField(max_length=40,blank=True,null=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='IP_appointment_DoctorId', null=True, blank=True)
    DoctorRelation = models.CharField(max_length=30,blank=True,null=True)
    DonationType = models.ForeignKey(Donation_Master_Detials, on_delete=models.CASCADE, related_name='IP_patient_details_DonationId', null=True, blank=True)
    # DonationType = models.CharField(max_length=30,blank=True,null=True)
    Status = models.CharField(max_length=20,default='Pending')
    Booking_Status = models.CharField(max_length=30, default='Booked')
    Reason =models.TextField(default='')
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    # created_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Patient_IP_Registration_Detials'
 
    def save(self, *args, **kwargs):
        if not self.Registration_Id:
            self.Registration_Id = generate_next_ip_number()
       
        super().save(*args, **kwargs)
 
    # def save(self, *args, **kwargs):
    #     with transaction.atomic():
    #         if not self.Registration_Id:
               
    #             current_year_month = datetime.now().strftime('%y%m')  # e.g., '2506' for June 2025
    #             prefix = f"IP{current_year_month}"
 
    #             # Fetch all Registration_Ids starting with the current prefix
    #             matching_entries = Patient_IP_Registration_Detials.objects.select_for_update().filter(
    #                 Registration_Id__startswith=prefix
    #             ).values_list('Registration_Id', flat=True)
 
    #             if matching_entries:
    #                 numeric_parts = [
    #                     int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
    #                 ]
    #                 next_number = max(numeric_parts) + 1 if numeric_parts else 1
    #             else:
    #                 next_number = 1  # First for this month
 
    #             # Format like IP250601, IP250602, etc.
    #             self.Registration_Id = f"{prefix}{next_number}"
 
    #         super(Patient_IP_Registration_Detials, self).save(*args, **kwargs)
 
 
 


class Patient_Emergency_Registration_Detials(models.Model):
    Registration_Id = models.CharField(primary_key=True,max_length=30)
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE,blank=True,null=True)
    IdentificationMark1 = models.TextField(default='')
    IdentificationMark2 = models.TextField(default='')
    Instructions = models.TextField(default='')
    IsConscious = models.CharField(max_length=20,blank=True,null=True)
    IsMLC = models.CharField(max_length=20,blank=True,null=True)

    DoctorName = models.CharField(max_length=150,null=True,blank=True)

    
    #  IMPORTANT
    Triage = models.CharField(max_length=20, blank=True, null=True)

    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Primary_doctor_Emergency_details',null=True,blank=True)
    Complaint = models.TextField(default='')
    Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
    IsReferral = models.CharField(max_length=20,blank=True,null=True)

    VisitType = models.CharField(max_length=30,blank=True,null=True)
    Complaint = models.TextField(default='')
    TokenNo = models.CharField(max_length=30,blank=True,null=True)

    PatientCategory = models.CharField(max_length=30,blank=True,null=True)
    InsuranceName = models.ForeignKey(Insurance_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    InsuranceType = models.CharField(max_length=30,blank=True,null=True)
    ClientName = models.ForeignKey(Client_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ClientType = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    ClientEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
    CorporateName = models.ForeignKey(Corporate_Master_Detials, on_delete=models.CASCADE, related_name='Emergency_patient_details_CorporateId', null=True, blank=True)
    CorporateType = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
   
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name='Emergency_appointment_EmployeeId', null=True, blank=True)
    EmployeeRelation = models.CharField(max_length=40,blank=True,null=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='Emergency_appointment_DoctorId', null=True, blank=True)
    DoctorRelation = models.CharField(max_length=30,blank=True,null=True)
    DonationType = models.ForeignKey(Donation_Master_Detials, on_delete=models.CASCADE, related_name='Emergency_patient_details_DonationId', null=True, blank=True)
    Booking_Status = models.CharField(max_length=30, default='Occupied')
    Reason =models.TextField(default='')

    Status = models.CharField(max_length=20,default='Admitted')
    SavedStatus = models.CharField(max_length=20,default='Saved')
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Emergency_Registration_Detials'
    

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.Registration_Id:
                today_date = datetime.now().strftime('%y%m')  # e.g., '250618'
                prefix = f'EMG{today_date}'         # e.g., 'MIH250618EMG'

                # Lock matching records to safely compute next number
                matching_entries = Patient_Emergency_Registration_Detials.objects.select_for_update().filter(
                    Registration_Id__startswith=prefix
                ).values_list('Registration_Id', flat=True)

                if matching_entries:
                    numeric_parts = [
                        int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
                    ]
                    next_number = max(numeric_parts) + 1 if numeric_parts else 1
                else:
                    next_number = 1  # First for today

                # Final format: MIH250618EMG00001
                self.Registration_Id = f'{prefix}{next_number}'

            super(Patient_Emergency_Registration_Detials, self).save(*args, **kwargs)

 
  
class Patient_Casuality_Registration_Detials(models.Model):
    Registration_Id = models.CharField(max_length=30,unique=True)
    IsConsciousness = models.BooleanField(default=True) 
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='casuality_appointment_details',null=True,blank=True,default=None)
    VisitId = models.IntegerField(null=True,blank=True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_speciality',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_doctor',null=True,blank=True)
    Complaint = models.TextField(default="")
    PatientType = models.CharField(max_length=30)
    PatientCategory = models.CharField(max_length=30)
    InsuranceName = models.ForeignKey(Insurance_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # InsuranceName = models.CharField(max_length=30)
    InsuranceType = models.CharField(max_length=30)
    ClientName = models.ForeignKey(Client_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # ClientName = models.CharField(max_length=30)
    ClientType = models.CharField(max_length=30)
    ClientEmployeeId = models.CharField(max_length=30)
    ClientEmployeeDesignation = models.CharField(max_length=30)
    ClientEmployeeRelation = models.CharField(max_length=30)
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_EmployeeId',null=True,blank=True)
    EmployeeRelation = models.CharField(max_length=30)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_DoctorId',null=True,blank=True)
    DoctorRelation = models.CharField(max_length=30)
    DonationType = models.CharField(max_length=30)
    IsMLC = models.CharField(max_length=20)
    Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
    IsReferral = models.CharField(max_length=20)
    Status = models.CharField(max_length=20,default='Pending')
    Booking_Status = models.CharField(max_length=30, default='Booked')
    Reason =models.CharField(max_length=200)
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Casuality_Registration_Detials'
    def save(self, *args, **kwargs):
       

        if not self.Registration_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}CAS'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_patient_id = Patient_Casuality_Registration_Detials.objects.aggregate(max_id=Max('Registration_Id'))['max_id']
            if max_patient_id:
                numeric_part = int(max_patient_id[-5:]) + 1
            else:
                numeric_part = 1
            self.Registration_Id = f'{prefix}{numeric_part:05}'
       
        super(Patient_Casuality_Registration_Detials, self).save(*args, **kwargs)
    

class Patient_Diagnosis_Registration_Detials(models.Model):
    Registration_Id = models.CharField(max_length=30,unique=True)
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='Diagnosis_appointment_details')
    VisitId = models.IntegerField(null= True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_speciality',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_doctor',null=True,blank=True)
    Complaint = models.TextField(default='')
    PatientType = models.CharField(max_length=30)
    PatientCategory = models.CharField(max_length=30)
    InsuranceName = models.ForeignKey(Insurance_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # InsuranceName = models.CharField(max_length=30)
    InsuranceType = models.CharField(max_length=30)
    ClientName = models.ForeignKey(Client_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # ClientName = models.CharField(max_length=30)
    ClientType = models.CharField(max_length=30)
    ClientEmployeeId = models.CharField(max_length=30)
    ClientEmployeeDesignation = models.CharField(max_length=30)
    ClientEmployeeRelation = models.CharField(max_length=30)
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_EmployeeId',null=True,blank=True)
    EmployeeRelation = models.CharField(max_length=30)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_DoctorId',null=True,blank=True)
    DoctorRelation = models.CharField(max_length=30)
    DonationType = models.CharField(max_length=30)
    IsMLC = models.CharField(max_length=20)
    Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
    IsReferral = models.CharField(max_length=20)
    Status = models.CharField(max_length=20,default='Pending')
    Reason =models.CharField(max_length=200)
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Diagnosis_Registration_Detials'
    
    def save(self, *args, **kwargs):
       

        if not self.Registration_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}DIAG'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Registration_Id = Patient_Diagnosis_Registration_Detials.objects.aggregate(max_id=Max('Registration_Id'))['max_id']
            if max_Registration_Id:
                numeric_part = int(max_Registration_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Registration_Id = f'{prefix}{numeric_part:05}'
       
        super(Patient_Diagnosis_Registration_Detials, self).save(*args, **kwargs)



class Patient_Laboratory_Registration_Detials(models.Model):
    Registration_Id = models.CharField(max_length=30,unique=True)
    PatientId = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='Laboratory_appointment_details')
    VisitId = models.IntegerField()
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,related_name='laboratory_appointment_speciality',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='laboratory_appointment_doctor',null=True,blank=True)
    Complaint = models.TextField(default='')
    PatientType = models.CharField(max_length=30)
    PatientCategory = models.CharField(max_length=30)
    InsuranceName = models.ForeignKey(Insurance_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # InsuranceName = models.CharField(max_length=30)
    InsuranceType = models.CharField(max_length=30)
    ClientName = models.ForeignKey(Client_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # ClientName = models.CharField(max_length=30)
    ClientType = models.CharField(max_length=30)
    ClientEmployeeId = models.CharField(max_length=30)
    ClientEmployeeDesignation = models.CharField(max_length=30)
    ClientEmployeeRelation = models.CharField(max_length=30)
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Laboratory_appointment_EmployeeId',null=True,blank=True)
    EmployeeRelation = models.CharField(max_length=30)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Laboratory_appointment_DoctorId',null=True,blank=True)
    DoctorRelation = models.CharField(max_length=30)
    DonationType = models.CharField(max_length=30)
    IsMLC = models.CharField(max_length=20)
    Flagging = models.ForeignKey(Flaggcolor_Detials,on_delete=models.CASCADE,null=True, blank=True)
    IsReferral = models.CharField(max_length=20)
    Status = models.CharField(max_length=20,default='Pending')
    Reason =models.CharField(max_length=200)
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Laboratory_Registration_Detials'
    def save(self, *args, **kwargs):
       

        if not self.Registration_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}LAB'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Registration_Id = Patient_Laboratory_Registration_Detials.objects.aggregate(max_id=Max('Registration_Id'))['max_id']
            if max_Registration_Id:
                numeric_part = int(max_Registration_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Registration_Id = f'{prefix}{numeric_part:05}'
       
        super(Patient_Laboratory_Registration_Detials, self).save(*args, **kwargs)
    
  

class Patient_Admission_Detials(models.Model):
    IsConverted=models.BooleanField(default=False)
    IsCasualityPatient= models.BooleanField(default=False)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Emergency_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Casuality_Registration_Id = models.ForeignKey(Patient_Casuality_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Diagnosis_Registration_Id = models.ForeignKey(Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True,default=None)
    Laboratory_Registration_Id = models.ForeignKey(Patient_Laboratory_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    AdmissionPurpose = models.CharField(max_length=30,default='')
    DrInchargeAtTimeOfAdmission = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, null=True,blank=True)
    NextToKinName = models.CharField(max_length=30,null=True,blank=True,)
    Relation = models.CharField(max_length=30,null=True,blank=True,)
    RelativePhoneNo = models.CharField(max_length=30,null=True,blank=True,)
    PersonLiableForPayment = models.CharField(max_length=30,null=True,blank=True,)
    PersonLiablecontactno = models.CharField(max_length=40,null=True,blank=True,)
    visitDate = models.DateField(null=True,blank=True,)
    visitTime = models.TimeField(null=True,blank=True,)
    FamilyHead = models.CharField(max_length=30,null=True,blank=True,)
    FamilyHeadName = models.CharField(max_length=30,null=True,blank=True,)
    IpKitGiven = models.CharField(max_length=30,null=True,blank=True,)    
    created_by = models.CharField(max_length=30,null=True,blank=True,)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Admission_Detials'
    

class Patient_Admission_Purpose_Details(models.Model):
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Admission_Detials = models.ForeignKey(Patient_Admission_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    AdmissionPurpose = models.CharField(max_length=30,blank=True,null=True)
    Remarks = models.TextField(blank=True,null=True)
    created_by = models.CharField(max_length=30,null=True,blank=True,)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Patient_Admission_Purpose_Details'





class Patient_Admission_Room_Detials(models.Model):
    RegisterType= models.CharField(max_length=30)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE, null=True,blank=True)
    Emergency_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials, on_delete=models.CASCADE, null=True,blank=True)
    Casuality_Registration_Id = models.ForeignKey(Patient_Casuality_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    RoomId =models.ForeignKey(Room_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Admitted_Date = models.DateTimeField(null=True,blank=True,default=None)
    Discharge_Date = models.DateTimeField(null=True,blank=True,default=None)
    Status=models.BooleanField(default=False)
    IsStayed=models.BooleanField(default=False)
    CurrentlyStayed=models.BooleanField(default=False)
    Iscanceled=models.BooleanField(default=False)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    Approved_by = models.CharField(max_length=30,default='')
    CancelReason=models.TextField(default='')
    PatientfileRecieved=models.BooleanField(default=False)
    MedicineTransfered=models.BooleanField(default=False)
    AnyMedicalRecordError=models.BooleanField(default=False)
    ConfirmationfromReletives=models.BooleanField(default=False)
    ReletiveName=models.CharField(max_length=30,default="")
    MedRecReason=models.TextField(default='')
    bedtransferReason=models.TextField(default='')
    VaccateConfirmation = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Admission_Room_Detials'
    def __str__(self):
        return f"{self.RegisterType} - {self.RoomId}"



class Op_to_Ip_Convertion_Table(models.Model):
    id = models.AutoField(primary_key=True)
    Patient_Id = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE)
    Registration_id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='op_to_IP_conversion',null=True,blank=True)
    created_by = models.CharField(max_length=30)
    Reason = models.CharField(max_length=400, default= 'None')
    IpNotes = models.CharField(max_length=400, default= 'None')
    OptoIpCheck = models.BooleanField(default=True)
    Status = models.CharField(max_length=40, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Op_to_Ip_Convertion_Table'




class Patient_Referral_Detials(models.Model):
    ReferralRegisteredBy = models.CharField(max_length=30)
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Emergency_Register_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Laboratory_Register_Id = models.ForeignKey(Patient_Laboratory_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Diagnosis_Register_Id = models.ForeignKey(Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ReferralSource = models.CharField(max_length=30)
    ReferredBy = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='referral_doctorname',null=True,blank=True)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Patient_Referral_Detials'


# -------------------------------ForBilling------------------



class OP_Billing_QueueList_Detials(models.Model):
    BillingQueueList_ID=models.AutoField(primary_key=True)
    Billing_Type=models.CharField(max_length=100)
    Registration_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_Billing_QueueList_Registration_Id',null=True,blank=True)

    Doctor_Ratecard_Id=models.ForeignKey(Doctor_Ratecard_Master,on_delete=models.CASCADE,related_name='OP_Billing_Doctor_Ratecard_Id',null=True,blank=True)
    Status=models.CharField(max_length=50)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'OP_Billing_QueueList_Detials'

    def __str__(self):
        return self.Billing_Type
    



class General_Billing_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Billing_Date=models.DateField()
    Doctor_Id=models.JSONField(default=[])
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='Billing_Patient_Id')
    Register_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='Billing_Patient_Id')
    Visit_Id=models.ForeignKey(Patient_Visit_Detials,on_delete=models.CASCADE,related_name='Billing_Visit_Id')
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.IntegerField()
    Total_Qty=models.IntegerField()
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Bill_Status=models.CharField(max_length=20)
    Refunded_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0.0)
    Location=models.ForeignKey(Location_Detials,on_delete=models.CASCADE,related_name='Location_id',blank=True, null=True)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    aRemarks = models.TextField(null=True,blank=True)


    class meta:
        db_table='General_Billing_Table_Detials'
    
    
    def save(self, *args, **kwargs):
        if not self.Billing_Invoice_No:
            Add_Invoice_Char = 'OPDR/'

            # get latest row based on created_at
            Max_Invoice_No_row = General_Billing_Table_Detials.objects.exclude(created_by='system').order_by('-created_at').first()

            if Max_Invoice_No_row and Max_Invoice_No_row.Billing_Invoice_No:
                # example: "OPDR/10001"
                last_invoice = Max_Invoice_No_row.Billing_Invoice_No

                print(last_invoice,'last_invoice')
                numeric_part = int(last_invoice.split('/')[1]) + 1
                print(numeric_part,'numeric_part')
            else:
                numeric_part = 1   # start from 1 if no invoice exists

            # format with 4 digits (OPDR/0001, OPDR/0002, etc.)
            self.Billing_Invoice_No = f'{Add_Invoice_Char}{str(numeric_part)}'
            print(self.Billing_Invoice_No,'self.Billing_Invoice_No')

        super(General_Billing_Table_Detials, self).save(*args, **kwargs)




class General_Billing_Items_Table_Detials(models.Model):
    Items_Id=models.AutoField(primary_key=True)
    Billing_Invoice_No=models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,related_name='Items_Table_Billing_Invoice_No')
    Service_Type=models.CharField(max_length=100)
    Service_Code=models.CharField(max_length=30,null=True)
    Service_Name=models.CharField(max_length=350)
    Rate=models.DecimalField(max_digits=10, decimal_places=2)
    Charge=models.DecimalField(max_digits=10, decimal_places=2)
    Quantity=models.IntegerField()
    Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Type=models.CharField(max_length=30,null=True,blank=True)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2,null=True)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2,null=True)
    Taxable_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    # Tax_Percentage=models.IntegerField()
    Tax_Amount=models.DecimalField(max_digits=10,decimal_places=2,null=True)
    Total_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Item_Status=models.CharField(max_length=30)
    Remarks=models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'General_Billing_Items_Table_Detials'
 
    def __str__(self):
        return self.Service_Name


class GeneralBillingReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        General_Billing_Table_Detials, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Receipt_invoice') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
    TotalAmount = models.DecimalField(max_digits=10, decimal_places=2)
    TotalPaidAmount = models.DecimalField(max_digits=10, decimal_places=2)
    BalanceAmount = models.DecimalField(max_digits=10, decimal_places=2)
    Billing_Date = models.DateField()
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    PaidAmount = models.DecimalField(max_digits=10, decimal_places=2)
    Billedby = models.CharField(max_length=50)
    UpdatedAt = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when the row is updated
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Sets the timestamp when the row is created

    class Meta:
        db_table = 'General_Billing_Receipt_Table'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = 'RCPT/'
            with transaction.atomic():
                last_voucher = (
                    GeneralBillingReceipt.objects
                    .select_for_update()
                    .exclude(Billedby='system')
                    .order_by('-CreatedAt')
                    .values_list('Voucher_Number', flat=True)
                    .first()
                )

                if last_voucher:
                    try:
                        numeric_part = int(last_voucher.split('/')[1])
                    except (ValueError, IndexError):
                        numeric_part = 0
                else:
                    numeric_part = 0

                numeric_part += 1
                self.Voucher_Number = f'{prefix}{numeric_part}'

        super().save(*args, **kwargs)


class GeneralBillingRefundReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        GeneralBillingReceipt, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Receipt_invoice_refund') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
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
        db_table = 'GeneralBillingRefundReceipt'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = 'RERT/'
            with transaction.atomic():
                last_voucher = (
                    GeneralBillingRefundReceipt.objects
                    .select_for_update()
                    .exclude(Billedby='system')
                    .order_by('-CreatedAt')
                    .values_list('Voucher_Number', flat=True)
                    .first()
                )

                if last_voucher:
                    try:
                        numeric_part = int(last_voucher.split('/')[1])
                    except (ValueError, IndexError):
                        numeric_part = 0
                else:
                    numeric_part = 0

                numeric_part += 1
                self.Voucher_Number = f'{prefix}{numeric_part}'

        super().save(*args, **kwargs)



class Multiple_Payment_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(GeneralBillingReceipt,on_delete=models.CASCADE,related_name='Receipt_No_Payments')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000)
    TransactionId = models.CharField(max_length=50,default='',null=True,blank=True)
    upiid = models.CharField(max_length=50,default='')
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Multiple_Payment_Table_Detials'

    def __str__(self):
        return self.Payment_Type

class Multiple_Payment_Refund_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(GeneralBillingRefundReceipt,on_delete=models.CASCADE,related_name='Receipt_No_Payments_Refund')
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
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Multiple_Payment_Refund_Table_Detials'

    def __str__(self):
        return self.Payment_Type

class Advanceamounttable(models.Model):
    adInvoice_NO = models.CharField(primary_key=True,max_length=30)
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='Advance_Patient_Id')
    Register_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='Advance_Patient_Id')
    Visit_Id=models.ForeignKey(Patient_Visit_Detials,on_delete=models.CASCADE,related_name='Advance_Visit_Id')
    Billing_Date=models.DateField()
    Billing_Type=models.CharField(max_length=150)
    Department=models.CharField(max_length=50)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    Locations=models.CharField(max_length=100,blank=True,null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Advanceamounttable'

    def save(self, *args, **kwargs):
        if not self.adInvoice_NO:
            prefix = 'ADV/'

            with transaction.atomic():
                # Lock table to prevent race conditions
                last_invoice = (
                    Advanceamounttable.objects
                    .select_for_update()
                    .exclude(created_by='system')
                    .order_by('-created_at')
                    .values_list('adInvoice_NO', flat=True)
                    .first()
                )

                if last_invoice:
                    try:
                        numeric_part = int(last_invoice.split('/')[1])
                    except (ValueError, IndexError):
                        numeric_part = 0
                else:
                    numeric_part = 0

                numeric_part += 1
                self.adInvoice_NO = f'{prefix}{numeric_part}'

        super().save(*args, **kwargs)




class advancemaintaintable(models.Model):
    adInvoice_NO = models.ForeignKey(Advanceamounttable,on_delete=models.CASCADE,related_name='advmaintaininv')
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='Advmaintain_Patient_Id')
    Register_Id=models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='Advmaintain_Patient_Id')
    Visit_Id=models.ForeignKey(Patient_Visit_Detials,on_delete=models.CASCADE,related_name='Advmaintain_Visit_Id')
    Billing_Date=models.DateField()
    Billing_Type=models.CharField(max_length=150)
    Department=models.CharField(max_length=50)
    fullAmount=models.DecimalField(max_digits=10,decimal_places=2)
    paidamount=models.DecimalField(max_digits=10,decimal_places=2)
    Remaining_amount=models.DecimalField(max_digits=10,decimal_places=2)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    Locations=models.CharField(max_length=100,blank=True,null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'advancemaintaintable'
       




class Handover_detials_Ip(models.Model):
    RegistrationId=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='Handover_Ip_register')
    ReasonForAdmission=models.TextField()
    PatientConditionOnAdmission=models.TextField()
    PatientFileGiven=models.BooleanField(default=False)
    AadharGiven=models.BooleanField(default=False)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Handover_detials_Ip'


class Service_Procedure_request_Ip(models.Model):
    MASTER_TYPE_CHOICES = [
        ('Service', 'Service'),
        ('Procedure', 'Procedure'),
    ]

    MasterType = models.CharField(max_length=10, choices=MASTER_TYPE_CHOICES)
    Service_ratecard = models.ForeignKey(Service_Master_Details, on_delete=models.CASCADE, related_name='Service_charges_ip', null=True, blank=True,default=None)
    Procedure_ratecard = models.ForeignKey(Procedure_Master_Details, on_delete=models.CASCADE, related_name='Procedure_charges_ip', null=True, blank=True,default=None)
    RegistrationId=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='Service_Procedure_request_Ip')
    RoomId =models.ForeignKey(Room_Master_Detials,on_delete=models.CASCADE,related_name='RoomId_service_procedure',null=True,blank=True)
    Units = models.DecimalField(max_digits=10,decimal_places=2)
    Status = models.BooleanField(default=False)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Service_Procedure_request_Ip' 

   
        
class OPD_Flow(models.Model):
    OPD_Id = models.AutoField(primary_key=True)
    Patient_Id = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='registration_doctor_name',null=True,blank=True)
    RegisterType = models.CharField(max_length=30)
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Registration_Cancel_Reason = models.TextField(default='')
    Appointment_Cancel_Reason = models.TextField(default='')
    Appointment_Reschedule_Reason = models.TextField(default='')
    RegistrationReshedule_Reason = models.TextField(default='')
    AppointmentDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='appointment_previous_doctor_name',null=True,blank=True)
    Registration_Status = models.CharField(max_length=40, default='Pending')
    AppointmentType = models.CharField(max_length=40)
    Appointment_Id = models.ForeignKey(Appointment_Request_List,on_delete=models.CASCADE,null=True,blank=True)
    Appointment_Status = models.CharField(max_length=40, default='Pending')
    created_by = models.CharField(max_length=40)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'OPD_Flow'
    
    def save(self, *args, **kwargs):
        if not self.OPD_Id:
            max_id_dict = OPD_Flow.objects.aggregate(max_id=Max('OPD_Id'))
            max_id = max_id_dict.get('max_id', 0)  # Extract max_id from the dict
            self.OPD_Id = (max_id or 0) + 1
        super(OPD_Flow, self).save(*args, **kwargs)

        
# class Appointment_to_Registration(models.Model):
#     ApptoRegId = models.AutoField(primary_key=True)
#     Appointment_Id = models.ForeignKey(Appointment_Request_List,on_delete=models.CASCADE,null=True,blank=True)
#     Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
#     created_by = models.CharField(max_length=40)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     class Meta:
#         db_table = 'Appointment_to_Registration'
#     def save(self, *args, **kwargs):
#         if not self.ApptoRegId:
#             max_id_dict = Appointment_to_Registration.objects.aggregate(max_id=Max('ApptoRegId'))
#             max_id = max_id_dict.get('max_id', 0)  # Extract max_id from the dict
#             self.ApptoRegId = (max_id or 0) + 1
#         super(Appointment_to_Registration, self).save(*args,**kwargs)
    


class Patient_Appointment_Registration_Cancel_Details(models.Model):
    Cancel_Id = models.IntegerField(primary_key=True)
    Registration_Id = models.ForeignKey(
        Patient_Appointment_Registration_Detials, 
        on_delete=models.CASCADE, 
        related_name='cancel_registration_details'
    )
    Cancel_Reason = models.TextField()
    Status = models.CharField(max_length=30, default = 'Cancelled')
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Patient_Appointment_Registration_Cancel_Details'
        
    def save(self, *args, **kwargs):
        if not self.Cancel_Id:
            max_id = Patient_Appointment_Registration_Cancel_Details.objects.aggregate(
                max_id=Max('Cancel_Id')
            )['max_id']
            self.Cancel_Id = (max_id or 0) + 1
        super().save(*args, **kwargs)
    
        
class Patient_Registration_Reshedule_Details(models.Model):
    Reshedule_Id = models.IntegerField(primary_key=True)
    Registration_Id = models.ForeignKey(
        'Patient_Appointment_Registration_Detials', 
        on_delete=models.CASCADE, 
        related_name='reshedule_registration_details'
    )
    ChangingReason = models.TextField(default='')
    specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,related_name='registration_reschedule_list_specialization',null=True,blank=True)
    doctor_name = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,related_name='registration_reschedule_list_doctor_name',null=True,blank=True)
    AppointmentDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,related_name='registration_reschedule_previous_doctor',null=True,blank=True)
    Status = models.CharField(max_length=30, default = 'Pending')
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    
    class Meta:
        db_table = 'Patient_Registration_Reshedule_Details'
    
    def save(self, *args, **kwargs):
        if not self.Reshedule_Id:
            max_id = Patient_Registration_Reshedule_Details.objects.aggregate(
                max_id=Max('Reshedule_Id')
            )['max_id']
            self.Reshedule_Id = (max_id or 0) + 1
        super().save(*args,**kwargs)


# -------------------------------ForBilling------------------

class IP_Billing_QueueList_Detials(models.Model):
    BillingQueueList_ID=models.AutoField(primary_key=True)
    Billing_Type=models.CharField(max_length=100)
    Registration_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Registration_Id')
    Doctor_Ratecard_Id=models.ForeignKey(Doctor_Ratecard_Master,on_delete=models.CASCADE,related_name='IP_Billing_Queue_Doctor_Ratecard_Id',null=True)
    Status=models.CharField(max_length=50)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'IP_Billing_QueueList_Detials'

    def __str__(self):
        return self.Billing_Type


class IP_Billing_Add_Services(models.Model):
    BillingDataList_ID = models.ForeignKey(IP_Billing_QueueList_Detials,on_delete= models.CASCADE)
    Service_Type = models.CharField(max_length=30)
    Service_Name = models.CharField(max_length=30)
    Service_Code = models.CharField(max_length=30)
    Charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    Quantity = models.IntegerField()
    Amount = models.IntegerField()
    Discount_Type = models.CharField(max_length=30)
    Discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    Taxable_Amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    GST_Charge = models.CharField(max_length=30)
    NetAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE,default="",null=True)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class IP_Billing_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Doctor_Id')
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Patient_Id')
    Register_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Patient_Id')
    # Visit_Id=models.ForeignKey(Patient_Visit_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Visit_Id')
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.IntegerField()
    Total_Qty=models.IntegerField()
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Bill_Status=models.CharField(max_length=20)
    Refund_Status = models.CharField(max_length=20,null=True,blank=True,default='')
    Refund_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    Advance_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    Receivable_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    IsCreditPaid = models.BooleanField(default=False)
    CreditPaidDate = models.DateField(null=True)
 
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Remarks = models.TextField(null=True, blank=True)
    SchemeDiscount = models.DecimalField(max_digits=10, decimal_places=2,default=0)


    refNo = models.CharField(max_length=100,null=True, blank=True)
    refDate = models.DateField(null=True, blank=True)
    employeeId = models.CharField(max_length=100,null=True, blank=True)
    employeeName = models.CharField(max_length=100,null=True, blank=True)
    crNo = models.CharField(max_length=100,null=True, blank=True)
    designation = models.CharField(max_length=100,null=True, blank=True)
    Relation = models.CharField(max_length=100,null=True, blank=True)
    UMIDNO = models.CharField(max_length=100,null=True, blank=True)

    class meta:
        db_table='IP_Billing_Table_Detials'

    def save(self, *args, **kwargs):
        if not self.Billing_Invoice_No:
            prefix = 'IPDR/'

            with transaction.atomic():
                last_invoice = (
                    IP_Billing_Table_Detials.objects
                    .select_for_update()
                    .exclude(created_by='system')
                    .order_by('-created_at')
                    .values_list('Billing_Invoice_No', flat=True)
                    .first()
                )

                if last_invoice:
                    try:
                        numeric_part = int(last_invoice.split('/')[1])
                    except (ValueError, IndexError):
                        numeric_part = 0
                else:
                    numeric_part = 0

                numeric_part += 1
                self.Billing_Invoice_No = f'{prefix}{numeric_part}'

        super().save(*args, **kwargs)

class IP_Billing_Items_Table_Detials(models.Model):
    Items_Id=models.AutoField(primary_key=True)
    Billing_Invoice_No=models.ForeignKey(IP_Billing_Table_Detials,on_delete=models.CASCADE,related_name='Items_Table_IP_Billing_Invoice_No')
    Service_Type=models.CharField(max_length=100)
    Service_Code=models.CharField(max_length=30,null=True)
    Service_Name=models.CharField(max_length=350)
    Rate=models.DecimalField(max_digits=10, decimal_places=2)
    Charge=models.DecimalField(max_digits=10, decimal_places=2)
    Quantity=models.CharField(max_length=30, default="")
    Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Type=models.CharField(max_length=30, null=True,blank=True)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Taxable_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Tax_Percentage=models.IntegerField()
    Tax_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Total_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Item_Status=models.CharField(max_length=30)
    IsReimbursable = models.CharField(max_length=30,null=True,blank=True)
    created_by = models.CharField(max_length=100,null=True,blank=True)
    updated_by = models.CharField(max_length=30,default='',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Billing_Type = models.CharField(max_length=100,null=True,blank=True)
    VoucherNo = models.CharField(max_length=100,null=True,blank=True)
    CGHS_CODE = models.CharField(max_length=100,null=True,blank=True)
 
 
    class Meta:
        db_table = 'IP_Billing_Items_Table_Detials'

    def __str__(self):
        return self.Service_Name

class IPBillingReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        IP_Billing_Table_Detials, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Receipt_invoice_IP') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
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
        db_table = 'IP_Billing_Receipt_Table'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            Receipt_Invoice_Char = 'RCPT/'
            with transaction.atomic():
                # Lock table to avoid race conditions
                last_receipt = (
                    IPBillingReceipt.objects
                    .exclude(Billedby='system')
                    .select_for_update()
                    .order_by('-CreatedAt')  # Get latest created receipt
                    .first()
                )

                if last_receipt and last_receipt.Voucher_Number.startswith(Receipt_Invoice_Char):
                    try:
                        numeric_part = int(last_receipt.Voucher_Number.replace(Receipt_Invoice_Char, "")) + 1
                    except ValueError:
                        numeric_part = 1  # fallback if bad format
                else:
                    numeric_part = 1

                # Assign formatted voucher no
                self.Voucher_Number = f"{Receipt_Invoice_Char}{numeric_part}"

        super(IPBillingReceipt, self).save(*args, **kwargs)

class Multiple_Payment_Table_IP_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Invoice_No=models.ForeignKey(IPBillingReceipt,on_delete=models.CASCADE,related_name='Multiple_Payment_IP_Billing_Invoice')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000,null=True,blank=True)
    TransactionId = models.CharField(max_length=50,default='',null=True,blank=True)
    upiid = models.CharField(max_length=50,default='',null=True,blank=True)
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Multiple_Payment_Table_IP_Detials'

    def __str__(self):
        return self.Payment_Type




class IPBillingRefundReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        IPBillingReceipt, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='Receipt_invoice_refund_IP') 
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
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
        db_table = 'IPBillingRefundReceipt'

    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            Receipt_Invoice_Char = 'RERT/'
            with transaction.atomic():
                last_receipt = (
                    IPBillingRefundReceipt.objects
                    .exclude(Billedby='system')
                    .select_for_update()
                    .order_by('-CreatedAt')
                    .first()
                )

                if last_receipt and last_receipt.Voucher_Number.startswith(Receipt_Invoice_Char):
                    try:
                        numeric_part = int(last_receipt.Voucher_Number.replace(Receipt_Invoice_Char, "")) + 1
                    except ValueError:
                        numeric_part = 1
                else:
                    numeric_part = 1

                # No zero padding here
                self.Voucher_Number = f"{Receipt_Invoice_Char}{numeric_part}"

        super(IPBillingRefundReceipt, self).save(*args, **kwargs)



class Multiple_Payment_IP_Refund_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(IPBillingRefundReceipt,on_delete=models.CASCADE,related_name='Receipt_No_Payments_Refund_IP')
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
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Multiple_Payment_IP_Refund_Table_Detials'

    def __str__(self):
        return self.Payment_Type

class Patient_Client_Insurance_details(models.Model):
    Patient_Id = models.ForeignKey(Patient_Detials,on_delete= models.CASCADE,null=True,blank=True)
    isClient = models.CharField(max_length=30)
    CoPaymentType = models.CharField(max_length=30)
    CoPaymentTypeinp = models.CharField(max_length=30)
    CoPaymentLogic = models.CharField(max_length=30)
    CoPaymentdeducted = models.CharField(max_length=30)
    PreAuthType = models.CharField(max_length=30)
    PreAuthTypeinp = models.CharField(max_length=30)
    PreAuthAmount = models.CharField(max_length=30)
    PreAuthApprovalNo = models.CharField(max_length=30)
    PolicyNo = models.CharField(max_length=30)
    PolicyStartDate = models.DateField()
    PolicyEndDate = models.DateField()
    Location = models.ForeignKey(Location_Detials,on_delete= models.CASCADE,null=True,blank=True)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Patient_Client_Insurance_details'

class Advance_Collection_IP(models.Model):
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    IPBillingReceipt = models.ForeignKey(IPBillingReceipt,on_delete=models.CASCADE,null=True,blank=True)
    GeneralBillingReceipt = models.ForeignKey(GeneralBillingReceipt,on_delete=models.CASCADE,null=True,blank=True)
    AdvanceAmount = models.DecimalField(max_digits=10,decimal_places=2)
    AdvancePurpose = models.CharField(max_length=50,null=True,blank=True)
    Advance_Desc = models.TextField(null=True)
    Status = models.CharField(max_length=50,default='Paid')
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    Approvedby = models.CharField(max_length=30,default='')
    Refundedby = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Approved_at = models.DateTimeField(auto_now=True)
    Refunded_at = models.DateTimeField(auto_now=True)
    Remarks = models.TextField(null=True)
 
 
    class Meta:
        db_table = 'Advance_Collection_IP'
 
 
 

class Multiple_Payment_Advance_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(Advance_Collection_IP,on_delete=models.CASCADE,related_name='Receipt_No_Payments_Advance')
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
        db_table = 'Multiple_Payment_Advance_Table_Detials'

    def __str__(self):
        return self.Payment_Type
   
class Services_SubCat_Requests_Details(models.Model):
    Voucher_Number = models.CharField(max_length=50, blank=True, null=True)  # This will be auto-incremented
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=255)
    Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials, on_delete=models.CASCADE, to_field='Registration_Id')
    service_category = models.ForeignKey(Service_Category_Masters, on_delete=models.CASCADE)
    service_sub_category = GenericForeignKey('content_type', 'object_id')
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    Wardid = models.ForeignKey(WardType_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    units = models.IntegerField()
    Status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Services_SubCat_Requests_Details'
    
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            Receipt_Invoice_Char = 'SER/'

            with transaction.atomic():
                last_record = (
                    Services_SubCat_Requests_Details.objects
                    .select_for_update()
                    .order_by('-created_at')
                    .first()
                )

                if last_record and last_record.Voucher_Number and last_record.Voucher_Number.startswith(Receipt_Invoice_Char):
                    try:
                        numeric_part = int(last_record.Voucher_Number.replace(Receipt_Invoice_Char, "")) + 1
                    except ValueError:
                        numeric_part = 1
                else:
                    numeric_part = 1

                # No zero padding
                self.Voucher_Number = f"{Receipt_Invoice_Char}{numeric_part}"

        super().save(*args, **kwargs)



class ABHA_Collectin_Data(models.Model):
    ABHA_RegID = models.IntegerField(primary_key=True)

    UniqueIdNo = models.CharField(max_length=30,blank=True,null=True)
  
    ABHANumber = models.CharField(max_length=20)
    preferredAbhaAddress = models.CharField(max_length=255)
    name = models.CharField(max_length=100)
    address = models.TextField()
    createdDate = models.DateField()
    
    dayOfBirth = models.DateField()
    
    districtName = models.CharField(max_length=100)
    email = models.EmailField(max_length=255)
    gender = models.CharField(max_length=1)
    pincode = models.CharField(max_length=255,null=True,blank=True)
    mobile=models.CharField(max_length=255,null=True,blank=True)
    mobileVerified = models.BooleanField()
    stateName = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    subdistrictName = models.CharField(max_length=100)
    townName = models.CharField(max_length=100)
    verificationType = models.CharField(max_length=20)
    
    
    class Meta:
        db_table = 'ABHA_Collectin_Data'
    
    def save(self, *args, **kwargs):
        if not self.ABHA_RegID:
            max_id = ABHA_Collectin_Data.objects.aggregate(
                max_id=Max('ABHA_RegID')
            )['max_id']
            self.ABHA_RegID = (max_id or 0) + 1
        super().save(*args, **kwargs)
    
class FamilyMember(models.Model):
    primary_patient = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='primary_member')
    family_member = models.ForeignKey(Patient_Detials, on_delete=models.CASCADE, related_name='family_members')
    status = models.CharField(max_length=10, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        unique_together = ('primary_patient', 'family_member')
       
    def _str_(self):
        return f"{self.primary_patient.PatientId} -> {self.family_member.PatientId}"


class Master_health_care_request_details(models.Model):
 
    Pkg_RequestId = models.AutoField(primary_key=True)
    Packages = models.ForeignKey(Package_Master,on_delete=models.CASCADE,null=True,blank=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Emg_Register_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)

   
    Status = models.CharField(max_length=20, default='Pending')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Master_health_care_request_details'


class DayCare_request_details(models.Model):
 
    DC_RequestId = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Emg_Register_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Procedure = models.ForeignKey(Procedure_Master_Details,on_delete=models.CASCADE,null=True,blank=True)
    Therapy = models.ForeignKey(TherapyType_Detials,on_delete=models.CASCADE,null=True,blank=True)
 
    ServiceType = models.CharField(max_length=255,null=True,blank=True)
    Services = models.CharField(max_length=255,null=True,blank=True)
   
    Status = models.CharField(max_length=20, default='Pending')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'DayCare_request_details'
        
class DoctorRoomMapping(models.Model):
 
    DoctorID = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ConRoomID = models.ForeignKey(Consultaion_Room_Master_Details,on_delete=models.CASCADE,null=True,blank=True)
    Speciality = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    created_by = models.CharField(max_length=30)
    Status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'DoctorRoomMapping'      
   
         
class Interim_Billing_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Interim_Billing_Doctor_Id')
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='Interim_Billing_Patient_Id')
    Register_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='Interim_Billing_Patient_Id')
    # Visit_Id=models.ForeignKey(Patient_Visit_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Visit_Id')
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.IntegerField()
    Total_Qty=models.IntegerField()
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Bill_Status=models.CharField(max_length=20)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class meta:
        db_table='Interim_Billing_Table_Detials'

    def save(self, *args, **kwargs):
        if not self.Billing_Invoice_No:
            Add_Invoice_Char = 'INT/'

            with transaction.atomic():
                last_record = (
                    Interim_Billing_Table_Detials.objects
                    .exclude(created_by='system')
                    .select_for_update()
                    .order_by('-created_at')
                    .first()
                )

                if last_record and last_record.Billing_Invoice_No and last_record.Billing_Invoice_No.startswith(Add_Invoice_Char):
                    try:
                        # Remove prefix "INT/" (4 chars)
                        numeric_part = int(last_record.Billing_Invoice_No.replace(Add_Invoice_Char, "")) + 1
                    except ValueError:
                        numeric_part = 1
                else:
                    numeric_part = 1

                # With zero padding like INT/0001
                self.Billing_Invoice_No = f"{Add_Invoice_Char}{numeric_part}"

        super().save(*args, **kwargs)



class Interim_Billing_Items_Table_Detials(models.Model):
    Items_Id=models.AutoField(primary_key=True)
    Billing_Invoice_No=models.ForeignKey(Interim_Billing_Table_Detials,on_delete=models.CASCADE,related_name='Items_Table_IP_Billing_Invoice_No')
    Service_Type=models.CharField(max_length=100)
    Service_Code=models.CharField(max_length=30,null=True)
    Service_Name=models.CharField(max_length=350)
    Rate=models.DecimalField(max_digits=10, decimal_places=2)
    Charge=models.DecimalField(max_digits=10, decimal_places=2)
    Quantity=models.CharField(max_length=30, default="")
    Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Type=models.CharField(max_length=30, null=True,blank=True)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Taxable_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Tax_Percentage=models.IntegerField()
    Tax_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Total_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Item_Status=models.CharField(max_length=30)
    IsReimbursable = models.CharField(max_length=30,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CGHS_CODE = models.CharField(max_length=100,null=True,blank=True)
    

    class Meta:
        db_table = 'Interim_Billing_Items_Table_Detials'

    def __str__(self):
        return self.Service_Name


class IP_Billing_Estimated_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Doctor_Id_est')
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Patient_Id_est')
    Register_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Patient_Id_est')
    # Visit_Id=models.ForeignKey(Patient_Visit_Detials,on_delete=models.CASCADE,related_name='IP_Billing_Visit_Id')
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.IntegerField()
    Total_Qty=models.IntegerField()
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Advance_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Refund_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Receivable_Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Bill_Status=models.CharField(max_length=20)
    Remarks = models.TextField()
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class meta:
        db_table='IP_Billing_Estimated_Table_Detials'

    def save(self, *args, **kwargs):
        if not self.Billing_Invoice_No:
            prefix = 'IPEST/'
            max_invoice = IP_Billing_Estimated_Table_Detials.objects.exclude(
                created_by='system'
            ).aggregate(max_id=Max('Billing_Invoice_No'))['max_id']

            if max_invoice:
                # slice off the prefix part
                numeric_part = int(max_invoice[len(prefix):]) + 1
            else:
                numeric_part = 1

            self.Billing_Invoice_No = f'{prefix}{numeric_part}'

        super().save(*args, **kwargs)


class IP_Billing_Estimated_Items_Table_Detials(models.Model):
    Items_Id=models.AutoField(primary_key=True)
    Billing_Invoice_No=models.ForeignKey(IP_Billing_Estimated_Table_Detials,on_delete=models.CASCADE,related_name='Items_Table_IP_Billing_Invoice_No_est')
    Service_Type=models.CharField(max_length=100)
    Service_Code=models.CharField(max_length=30,null=True)
    Service_Name=models.CharField(max_length=350)
    Rate=models.DecimalField(max_digits=10, decimal_places=2)
    Charge=models.DecimalField(max_digits=10, decimal_places=2)
    Quantity=models.CharField(max_length=30, default="")
    Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Type=models.CharField(max_length=30, null=True,blank=True)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Taxable_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Tax_Percentage=models.IntegerField()
    Tax_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Total_Amount=models.DecimalField(max_digits=10,decimal_places=2)
    Item_Status=models.CharField(max_length=30)
    IsReimbursable = models.CharField(max_length=30,null=True,blank=True)
    Voucher_No = models.CharField(max_length=30,null=True,blank=True)
    Date = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CGHS_CODE = models.CharField(max_length=100,null=True,blank=True)




    class Meta:
        db_table = 'IP_Billing_Estimated_Items_Table_Detials'

    def __str__(self):
        return self.Service_Name




class WalkinPatientServiceDetails(models.Model):
 
    Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    ServiceCategory = models.CharField(max_length=100, blank=True)
    Categoryid = models.CharField(max_length=50, blank=True)
    ServiceSubCategory = models.CharField(max_length=100, blank=True)
    ServiceSubCatId = models.CharField(max_length=50, blank=True)
    Subcategorypk = models.CharField(max_length=50, blank=True)
    Rate = models.CharField(max_length=50, blank=True)
    Quantity = models.CharField(max_length=10, blank=True)
    BillStatus = models.CharField(max_length=10, blank=True,default='Pending')
    Billing_Invoice_No = models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'WalkinPatientServiceDetails'
 
 
 
 

# class Casuality_Billing_QueueList_Detials(models.Model):
#     BillingQueueList_ID=models.AutoField(primary_key=True)
#     Billing_Type=models.CharField(max_length=100)
#     Registration_Id=models.ForeignKey(Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,related_name='Casuality_Billing_Registration_Id')
#     Doctor_Ratecard_Id=models.ForeignKey(Doctor_Ratecard_Master,on_delete=models.CASCADE,related_name='Casuality_Billing_Queue_Doctor_Ratecard_Id',null=True)
#     Status=models.CharField(max_length=50)
#     created_by = models.CharField(max_length=30)
#     updated_by = models.CharField(max_length=30,default='')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'Casuality_Billing_QueueList_Detials'

#     def __str__(self):
#         return self.Billing_Type
 
class ConsultationBillingRefundReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        GeneralBillingReceipt,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='Receipt_invoice_refund_consultation')
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
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
        db_table = 'ConsultationBillingRefundReceipt'
 
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            prefix = 'RERT/'
            with transaction.atomic():
                last_voucher = (
                    ConsultationBillingRefundReceipt.objects
                    .select_for_update()
                    .exclude(Billedby='system')
                    .order_by('-CreatedAt')
                    .values_list('Voucher_Number', flat=True)
                    .first()
                )
 
                if last_voucher:
                    try:
                        numeric_part = int(last_voucher.split('/')[1])
                    except (ValueError, IndexError):
                        numeric_part = 0
                else:
                    numeric_part = 0
 
                numeric_part += 1
                self.Voucher_Number = f'{prefix}{numeric_part}'
 
        super().save(*args, **kwargs)
 
class Consultation_Refund_Payment_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(ConsultationBillingRefundReceipt,on_delete=models.CASCADE,related_name='ConsultationReceipt_No_Payments')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000)
    TransactionId = models.CharField(max_length=50,default='')
    upiid = models.CharField(max_length=50,default='')
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Consultation_Refund_Payment_Table_Detials'
 
    def __str__(self):
        return self.Payment_Type
 
class IPAdvanceRefundReceipt(models.Model):
    RegisterType = models.CharField(max_length=30,default="")
    IPInvoice_NO = models.ForeignKey(IPBillingReceipt,on_delete=models.CASCADE,blank=True,null=True,)
    OPInvoice_NO = models.ForeignKey(GeneralBillingReceipt,on_delete=models.CASCADE,blank=True,null=True)  
    AdvanceCollection = models.ForeignKey(Advance_Collection_IP,on_delete=models.CASCADE,blank=True, null=True,)
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
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
        db_table = 'IPAdvanceRefundReceipt'
 
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            Receipt_Invoice_Char = 'RFRT/'
            with transaction.atomic():
                last_receipt = (
                    IPAdvanceRefundReceipt.objects
                    .exclude(Billedby='system')
                    .select_for_update()
                    .order_by('-CreatedAt')
                    .first()
                )
 
                if last_receipt and last_receipt.Voucher_Number.startswith(Receipt_Invoice_Char):
                    try:
                        numeric_part = int(last_receipt.Voucher_Number.replace(Receipt_Invoice_Char, "")) + 1
                    except ValueError:
                        numeric_part = 1
                else:
                    numeric_part = 1
 
                # No zero padding here
                self.Voucher_Number = f"{Receipt_Invoice_Char}{numeric_part}"
 
        super(IPAdvanceRefundReceipt, self).save(*args, **kwargs)
 
class Multiple_Payment_Advance_Refund_Table_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Receipt_No_Paid = models.ForeignKey(IPAdvanceRefundReceipt,on_delete=models.CASCADE)
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
        db_table = 'Multiple_Payment_Advance_Refund_Table_Detials'
 
    def __str__(self):
        return self.Payment_Type
   
 
class Outstanding_Billing_Table_Detials(models.Model):
    Billing_Invoice_No=models.CharField(primary_key=True,max_length=30)
    Billing_Date=models.DateField()
    Doctor_Id=models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Outstanding_Billing_Doctor_Id')
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,related_name='Outstanding_Billing_Patient_Id')
    Register_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='Outstanding_Billing_Patient_Id')
    FBill =models.ForeignKey(IP_Billing_Table_Detials,on_delete=models.CASCADE,related_name='Outstanding_Billing_invoice')
    Billing_Type=models.CharField(max_length=150)
    Select_Discount=models.CharField(max_length=50)
    Discount_Type=models.CharField(max_length=30)
    Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
    Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_Items=models.IntegerField()
    Total_Qty=models.IntegerField()
    Total_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Total_GSTAmount=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Round_Off=models.DecimalField(max_digits=10, decimal_places=2)
    Net_Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Paid_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Balance_Amount=models.DecimalField(max_digits=10, decimal_places=2)
    Bill_Status=models.CharField(max_length=20)
    Refund_Status = models.CharField(max_length=20,null=True,blank=True,default='')
    Refund_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    Advance_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    Receivable_Amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    created_by = models.CharField(max_length=100)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Remarks = models.TextField(null=True, blank=True)
    SchemeDiscount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    IsCreditPaid = models.BooleanField(default=False)
    CreditPaidDate = models.DateField(null=True)
 
    class meta:
        db_table='Outstanding_Billing_Table_Detials'
 
    def save(self, *args, **kwargs):
        if not self.Billing_Invoice_No:
            prefix = 'CRT/'
 
            with transaction.atomic():
                last_invoice = (
                    Outstanding_Billing_Table_Detials.objects
                    .select_for_update()
                    .exclude(created_by='system')
                    .order_by('-created_at')
                    .values_list('Billing_Invoice_No', flat=True)
                    .first()
                )
 
                if last_invoice:
                    try:
                        numeric_part = int(last_invoice.split('/')[1])
                    except (ValueError, IndexError):
                        numeric_part = 0
                else:
                    numeric_part = 0
 
                numeric_part += 1
                self.Billing_Invoice_No = f'{prefix}{numeric_part}'
 
        super().save(*args, **kwargs)
 
# class Outstanding_Billing_Items_Table_Detials(models.Model):
#     Items_Id=models.AutoField(primary_key=True)
#     Billing_Invoice_No=models.ForeignKey(Outstanding_Billing_Table_Detials,on_delete=models.CASCADE,related_name='Items_Table_Outstanding_Billing_Invoice_No')
#     Service_Type=models.CharField(max_length=100)
#     Service_Code=models.CharField(max_length=30,null=True)
#     Service_Name=models.CharField(max_length=350)
#     Rate=models.DecimalField(max_digits=10, decimal_places=2)
#     Charge=models.DecimalField(max_digits=10, decimal_places=2)
#     Quantity=models.CharField(max_length=30, default="")
#     Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     Discount_Type=models.CharField(max_length=30, null=True,blank=True)
#     Discount_Value=models.DecimalField(max_digits=10, decimal_places=2)
#     Discount_Amount=models.DecimalField(max_digits=10, decimal_places=2)
#     Taxable_Amount=models.DecimalField(max_digits=10,decimal_places=2)
#     Tax_Percentage=models.IntegerField()
#     Tax_Amount=models.DecimalField(max_digits=10,decimal_places=2)
#     Total_Amount=models.DecimalField(max_digits=10,decimal_places=2)
#     Item_Status=models.CharField(max_length=30)
#     IsReimbursable = models.CharField(max_length=30,null=True,blank=True)
#     created_by = models.CharField(max_length=100,null=True,blank=True)
#     updated_by = models.CharField(max_length=30,default='',null=True,blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     Billing_Type = models.CharField(max_length=100,null=True,blank=True)
#     VoucherNo = models.CharField(max_length=100,null=True,blank=True)
 
 
#     class Meta:
#         db_table = 'Outstanding_Billing_Items_Table_Detials'
 
#     def __str__(self):
#         return self.Service_Name
 
class OutstandingBillingReceipt(models.Model):
    Invoice_NO = models.ForeignKey(
        Outstanding_Billing_Table_Detials,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='Receipt_invoice_Outstanding')
    NewPayment = models.CharField(max_length=50,default="BillPayment")
    PatientID = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=50)
    Patient_Name = models.CharField(max_length=50)
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
        db_table = 'OutstandingBillingReceipt'
 
    def save(self, *args, **kwargs):
        if not self.Voucher_Number:
            Receipt_Invoice_Char = 'OCRT/'
            with transaction.atomic():
                # Lock table to avoid race conditions
                last_receipt = (
                    OutstandingBillingReceipt.objects
                    .exclude(Billedby='system')
                    .select_for_update()
                    .order_by('-CreatedAt')  # Get latest created receipt
                    .first()
                )
 
                if last_receipt and last_receipt.Voucher_Number.startswith(Receipt_Invoice_Char):
                    try:
                        numeric_part = int(last_receipt.Voucher_Number.replace(Receipt_Invoice_Char, "")) + 1
                    except ValueError:
                        numeric_part = 1  # fallback if bad format
                else:
                    numeric_part = 1
 
                # Assign formatted voucher no
                self.Voucher_Number = f"{Receipt_Invoice_Char}{numeric_part}"
 
        super(OutstandingBillingReceipt, self).save(*args, **kwargs)
 
class Multiple_Payment_Table_Outstanding_Detials(models.Model):
    S_No=models.AutoField(primary_key=True)
    Invoice_No=models.ForeignKey(OutstandingBillingReceipt,on_delete=models.CASCADE,related_name='Multiple_Payment_Outstanding_Billing_Invoice')
    Payment_Type=models.CharField(max_length=70)
    Cart_Type=models.CharField(max_length=30)
    Card_No = models.CharField(max_length=4,default=0000,null=True,blank=True)
    TransactionId = models.CharField(max_length=50,default='',null=True,blank=True)
    upiid = models.CharField(max_length=50,default='',null=True,blank=True)
    Cheque_No=models.CharField(max_length=20)
    Bank_Name=models.CharField(max_length=50)
    Transaction_Amount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    AdditionalAmount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    Amount=models.DecimalField(max_digits=10,decimal_places=2)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'Multiple_Payment_Table_Outstanding_Detials'
 
    def __str__(self):
        return self.Payment_Type 
 

class IP_Patient_Diagnosis_Data(models.Model):
 
 
    Patient_Id=models.ForeignKey(Patient_Detials,on_delete=models.CASCADE)
    Register_Id=models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE)
    ICDCode = models.CharField(max_length=100,null=True,blank=True)
    Code_Description = models.CharField(max_length=100,null=True,blank=True)
    Diagnosis = models.CharField(max_length=100,null=True,blank=True)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    canceled_by = models.CharField(max_length=100,null=True,blank=True)
    Status = models.CharField(max_length=100,default='Added')
 
 
 
    class Meta:
        db_table = 'IP_Patient_Diagnosis_Data'
 


