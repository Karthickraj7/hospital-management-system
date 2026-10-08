from django.db import models
from django.db.models import Max
from Masters.models import *
from django.core.exceptions import ValidationError
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from django.db import transaction
from Frontoffice.models import *

# Create your models here.

class AppointmentGenerationLog(models.Model):
    date = models.DateField(unique=True)
    appointment_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Appointment_Generation_Log'

    def __str__(self):
        return f"{self.date}: {self.appointment_count} appointments"
    
class LabRadiologyAppointmentGenerationLog(models.Model):
    date = models.DateField(unique=True)
    appointment_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'LabRadiologyAppointmentGenerationLog'

    def __str__(self):
        return f"{self.date}: {self.appointment_count} appointments"

class MCI_Patient_Detials(models.Model):
    PatientNo = models.CharField(primary_key=True, max_length=30)
    PatientId = models.CharField(max_length=30,null=True,blank=True)
    DuplicateId = models.BooleanField(default=False)
    Patient_profile = models.BinaryField(null=True,blank=True,default=True)
    ExistingPtNo = models.CharField(max_length=30,blank=True,null=True)
    Title = models.ForeignKey(Title_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='MCIpatientId_Title')
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
    BloodGroup = models.ForeignKey(BloodGroup_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name='MCIpatientId_Bloodgroup')
    Occupation = models.CharField(max_length=50,blank=True,null=True)
    Religion = models.ForeignKey(Religion_Detials, on_delete=models.CASCADE, related_name='MCIOrgional_patientId',null=True,blank=True)
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
   
    PermanentdoorNo = models.CharField(max_length=255,blank=True,null=True)
    PermanentStreet = models.CharField(max_length=255,blank=True,null=True)
    PermanentArea = models.CharField(max_length=255,blank=True,null=True)
    PermanentCity = models.CharField(max_length=255,blank=True,null=True)
    PermanentDistrict = models.CharField(max_length=255,blank=True,null=True)
    PermanentState = models.CharField(max_length=255,blank=True,null=True)
    PermanentCountry = models.CharField(max_length=255,blank=True,null=True)
    PermanentPincode = models.CharField(max_length=255,blank=True,null=True)
    
    
    LedgerName=models.CharField(max_length=200)
    LedgerGroupName=models.ForeignKey('Finance.Finance_GroupMaster_Detailes',on_delete=models.CASCADE,related_name='MCI_Patient_Detials', null=True, blank=True)
    OpeningBalance=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    DebitOrCredit=models.CharField(max_length=15, null=True, blank=True, default=None)
 
   
    DoctorID = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True, blank=True)
    SpecializationId = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True, blank=True)
    appointmentId = models.ForeignKey('MCI_Appointment_Request_List',on_delete=models.CASCADE,null=True,blank=True)
    created_by = models.CharField(max_length=30)
    Status = models.CharField(max_length=20, default='Saved')
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'MCI_Patient_Detials'
   
   
    # def save(self, *args, **kwargs):
       
 
    #     if not self.PatientId:
    #         # hospital_details = Hospital_Detials.objects.first()
    #         # if not hospital_details:
    #         #     raise ValueError("No Hospital_Details records found.")
           
    #         # clinic_name = hospital_details.Hospital_Name[:3].upper()
    #         today_date = datetime.now().strftime('%y%m%d')
    #         prefix = f'{today_date}'
           
    #         # Find the maximum numeric part from existing PatientId with the same prefix
    #         max_patient_id = MCI_Patient_Detials.objects.aggregate(max_id=Max('PatientId'))['max_id']
    #         if max_patient_id:
    #             numeric_part = int(max_patient_id[-4:]) + 1
    #         else:
    #             numeric_part = 1
    #         self.PatientId = f'{prefix}{numeric_part:04}'
       
    #     super(MCI_Patient_Detials, self).save(*args, **kwargs)


    def save(self, *args, **kwargs):
        if not self.PatientNo:
            YEAR = datetime.now().strftime('%y')
        
            last_id = MCI_Patient_Detials.objects.order_by('-created_at').first()
            num = last_id.PatientNo.split('-')[1] if last_id.PatientNo else None
            now = last_id.PatientNo.split('-')[0] if last_id.PatientNo else None

            new_no = int(num)
        
        
            if not num or not now or now != YEAR:
                next_id = YEAR + "-" +"1" # 25-1
                print(next_id)
            else:
                next_id = str(YEAR) + "-" + str(new_no+1)
            print("NO---------",next_id)
            self.PatientNo = next_id
    
        super(MCI_Patient_Detials, self).save(*args, **kwargs)
    
class MCI_Appointment_Request_List(models.Model):
    appointment_id = models.IntegerField(primary_key=True)
    title = models.ForeignKey(Title_Detials,on_delete=models.CASCADE,blank=True,null=True,related_name='MCIAppointment_title')
    PatientId = models.ForeignKey(MCI_Patient_Detials,on_delete=models.CASCADE,blank=True,null=True)
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
    specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,related_name='MCIappointment_request_list_specialization',null=True,blank=True)
    doctor_name = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,related_name='MCIappointment_request_list_doctor_name',null=True,blank=True)
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    status = models.CharField(max_length=30, default='PENDING')
    created_by = models.CharField(max_length=50)
    updated_by = models.CharField(max_length=50,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelReason = models.CharField(max_length=200)
    ReferredBy = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='MCIappreferallldoctor',null=True,blank=True)
    def __str__(self):
        return f"{self.title} {self.first_name} {self.last_name}"
    
    def save(self, *args, **kwargs):
        if not self.appointment_id:  # Check if appointment_id is not set (i.e., new instance)
            max_id = MCI_Appointment_Request_List.objects.aggregate(max_id=Max('appointment_id'))['max_id']
            self.appointment_id = (max_id or 0) + 1
        super(MCI_Appointment_Request_List, self).save(*args, **kwargs)

class MCI_Appointment_ReSchedule_Request(models.Model):
    appointmentId = models.ForeignKey(MCI_Appointment_Request_List,on_delete=models.CASCADE,null=True,blank=True)
    RadioOption = models.CharField(max_length=30)
    RequestDate = models.DateField()
    RequestTime = models.TimeField(blank=True,null=True)
    ChangingReason = models.TextField(default='')
    specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE,related_name='MCIappointment_reschedule_list_specialization',null=True,blank=True)
    doctor_name = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,related_name='MCIappointment_reschedule_list_doctor_name',null=True,blank=True)
    status = models.CharField(max_length=30, default='Reschedule')
    created_by = models.CharField(max_length=30, default='')
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ReferredBy = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='MCI_appointmentreferal',null=True,blank=True)

    class Meta:

        db_table = 'MCI_Appointment_ReSchedule_Request'

class MCI_Patient_Visit_Detials(models.Model):
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE, related_name='MCI_Patient_Visit_patient_detials')
    VisitId = models.IntegerField(default=1)
    RegisterType = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'MCI_Patient_Visit_Detials'
   
class MCI_Patient_Appointment_Registration_Detials(models.Model):  
    Registration_Id = models.CharField(max_length=30,null=True,blank=True)
    OPNo = models.CharField(max_length=30, unique=True)
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE, related_name='MCI_appointment_details')
    VisitId = models.IntegerField()
    CardValidity = models.CharField(max_length=30,blank=True,null=True)
    VisitPurpose = models.CharField(max_length=30,blank=True,null=True)
    # VisitType = models.CharField(max_length=30,blank=True,null=True)
    # Specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE, related_name='appointment_speciality', null=True, blank=True)
    # PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='appointment_doctor', null=True, blank=True)
    AppointmentId = models.IntegerField()
    ApptoRegId = models.ForeignKey(MCI_Appointment_Request_List, on_delete=models.CASCADE, null=True, blank=True)
   
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
    CorporateName = models.ForeignKey(Corporate_Master_Detials, on_delete=models.CASCADE, related_name='MCI_patient_details_CorporateId', null=True, blank=True)
    CorporateType = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
   
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name='MCI_appointment_EmployeeId', null=True, blank=True)
    EmployeeRelation = models.CharField(max_length=40,blank=True,null=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='MCI_appointment_DoctorId', null=True, blank=True)
    DoctorRelation = models.CharField(max_length=30,blank=True,null=True)
    # DonationType = models.CharField(max_length=30,blank=True,null=True)
    DonationType = models.ForeignKey(Donation_Master_Detials, on_delete=models.CASCADE, related_name='MCI_patient_details_DonationId', null=True, blank=True)
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
    IsOriginal = models.BooleanField(default=False)
 
    class Meta:
        db_table = 'MCI_Patient_Appointment_Registration_Detials'
 
    # def save(self, *args, **kwargs):
    #     # with transaction.atomic():
    #     #     if not self.pk:
    #     #         current_year = datetime.now().strftime('%y%m')  # e.g. '25' for 2025
    #     #         prefix = f"OP{current_year}"
   
    #     #         # Fetch the latest Registration_Id starting with the current year's prefix
    #     #         # last_entry = Patient_Appointment_Registration_Detials.objects.filter(
    #     #         #     Registration_Id__startswith=prefix
    #     #         # ).order_by('-Registration_Id').first()
   
    #     #         # if last_entry and last_entry.Registration_Id:
    #     #         #     # Extract numeric suffix and increment
    #     #         #     last_number = int(last_entry.Registration_Id[len(prefix):])
    #     #         #     next_number = last_number + 1
    #     #         # else:
    #     #         #     next_number = 1  # First entry for this year
   
 
    #     #         # Fetch all Registration_Ids starting with the current prefix
    #     #         matching_entries = MCI_Patient_Appointment_Registration_Detials.objects.select_for_update().filter(
    #     #             Registration_Id__startswith=prefix
    #     #         ).values_list('OPNo', flat=True)
 
    #     #         if matching_entries:
    #     #             # Extract the numeric part of each Registration_Id and find the maximum
    #     #             numeric_parts = [
    #     #                 int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
    #     #             ]
    #     #             next_number = max(numeric_parts) + 1 if numeric_parts else 1
 
    #     #             print(numeric_parts,'numeric_parts',next_number,'next_number')
    #     #         else:
    #     #             next_number = 1  # First entry for this year/month
 
 
    #     #         # Final format: 25OP01, 25OP02, ..., 26OP01 next year
 
    #     #         print('opno',f"{prefix}{next_number}")
    #     #         self.OPNo = f"{prefix}{next_number}"
 
    #     #         print('aftrerrrrrrrr')
    #     #         # self.Registration_Id = f"{prefix}{next_number:02d}"
   
    #     #         # Optional: set AppointmentId as auto-increment per day
    #     #         today = datetime.now().strftime('%Y-%m-%d')
    #     #         max_id_today = MCI_Patient_Appointment_Registration_Detials.objects.filter(
    #     #             created_at__date=today
    #     #         ).aggregate(max_id=Max('AppointmentId'))['max_id']
    #     #         self.AppointmentId = (max_id_today or 0) + 1
   
    #     #     super(MCI_Patient_Appointment_Registration_Detials, self).save(*args, **kwargs)
   
       
 
    #     def clean(self):
    #         super().clean()
    #         # Validate length of all CharField fields
    #         char_fields = [
    #             'VisitPurpose', 'CaseSheetNo', 'ANCNumber', 'MCTSNo', 'Complaint', 'PatientType',
    #             'InsuranceName', 'InsuranceType', 'ClientName', 'ClientType', 'ClientEmployeeId', 'ClientEmployeeDesignation',
    #             'ClientEmployeeRelation', 'EmployeeRelation', 'DoctorRelation', 'DonationType', 'IsMLC', 'Flagging', 'IsReferral',
    #             'Status', 'created_by'
    #         ]
    #         for field in char_fields:
    #             value = getattr(self, field, '')
    #             if len(value) > self._meta.get_field(field).max_length:
    #                 raise ValidationError({'error': f"{field} cannot be more than {self._meta.get_field(field).max_length} characters."})
   
    #         # Validate length of Reason field if needed
    #         if len(self.Reason) > 1000:  # assuming a max length for Reason
    #             raise ValidationError({'error': "Reason cannot be more than 1000 characters."})
 
    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Only generate OPNo for new records
            if not self.pk:
                current_year_month = datetime.now().strftime('%y%m')  # Example: 2510 (for Oct 2025)
                prefix = f"OP{current_year_month}"
 
                # Lock all rows for this prefix to prevent race conditions
                matching_entries = list(
                    MCI_Patient_Appointment_Registration_Detials.objects
                    .filter(OPNo__startswith=prefix)
                    .select_for_update(skip_locked=True)
                    .values_list('OPNo', flat=True)
                )
 
                if matching_entries:
                    # Extract numeric suffixes safely
                    numeric_parts = [
                        int(op_no[len(prefix):]) for op_no in matching_entries
                        if op_no[len(prefix):].isdigit()
                    ]
                    next_number = max(numeric_parts) + 1 if numeric_parts else 1
                else:
                    next_number = 1
 
                # Construct final OPNo (e.g., OP2510001, OP2510002)
                self.OPNo = f"{prefix}{next_number}"
                print("Generated OPNo:", self.OPNo)
 
                # Optional: auto-increment AppointmentId per day
                today = datetime.now().date()
                max_id_today = (
                    MCI_Patient_Appointment_Registration_Detials.objects
                    .filter(created_at__date=today)
                    .aggregate(max_id=Max('AppointmentId'))
                    .get('max_id')
                )
                self.AppointmentId = (max_id_today or 0) + 1
 
            # Now safely save record
            super(MCI_Patient_Appointment_Registration_Detials, self).save(*args, **kwargs)
 
 
 


class MCI_OP_Patient_Appointment_With_Multiple_Doctor(models.Model):
    Registration_Id = models.ForeignKey(MCI_Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name="MCI_appointment_doctor_specialties",blank=True,null=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name="MCI_doctor_appointments",blank=True,null=True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE, related_name="MCI_specialization_appointments",blank=True,null=True)
    AppointmentSlot_by_Specialization = models.IntegerField(default=0)
    AppointmentSlot_by_Doctor = models.IntegerField(default=0)
    VisitType = models.CharField(max_length=30,blank=True,null=True)
    Complaint = models.TextField(default='')
    TokenNo = models.CharField(max_length=30,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Status = models.CharField(max_length=20, default='Registered')
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "MCI_OP_Patient_Appointment_With_Multiple_Doctor"
    
    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new instance
            current_date = datetime.now().date()
            start_id = 1

            # AppointmentSlot by specialization logic
            max_spi_slot_today = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__date=current_date,
                Specialization=self.Specialization
            ).aggregate(max_slot=Max('AppointmentSlot_by_Specialization'))['max_slot']
            self.AppointmentSlot_by_Specialization = (max_spi_slot_today or 0) + start_id

            # AppointmentSlot by doctor logic
            max_doc_slot_today = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                created_at__date=current_date,
                PrimaryDoctor=self.PrimaryDoctor
            ).aggregate(max_slot=Max('AppointmentSlot_by_Doctor'))['max_slot']
            self.AppointmentSlot_by_Doctor = (max_doc_slot_today or 0) + start_id

        super(MCI_OP_Patient_Appointment_With_Multiple_Doctor, self).save(*args, **kwargs)
  

#IPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
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
 
class MCI_Patient_IP_Registration_Detials(models.Model):     
    Registration_Id = models.CharField(max_length=30,null=True,blank=True)
    IPNo = models.CharField(max_length=30, unique=True)
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE)
    # VisitId = models.IntegerField()
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Primary_doctor_ip_details_mci',null=True,blank=True)
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
    CorporateName = models.ForeignKey(Corporate_Master_Detials, on_delete=models.CASCADE, related_name='IP_patient_details_CorporateId_mci', null=True, blank=True)
    CorporateType = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
   
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name='IP_appointment_EmployeeId_mci', null=True, blank=True)
    EmployeeRelation = models.CharField(max_length=40,blank=True,null=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='IP_appointment_DoctorId_mci', null=True, blank=True)
    DoctorRelation = models.CharField(max_length=30,blank=True,null=True)
    DonationType = models.ForeignKey(Donation_Master_Detials, on_delete=models.CASCADE, related_name='IP_patient_details_DonationId_mci', null=True, blank=True)
    # DonationType = models.CharField(max_length=30,blank=True,null=True)
    Status = models.CharField(max_length=20,default='Pending')
    Booking_Status = models.CharField(max_length=30, default='Booked')
    Reason =models.TextField(default='')
    Location =models.ForeignKey(Location_Detials ,on_delete=models.CASCADE)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField()
    DischargeDate = models.DateTimeField(null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    IsOriginal = models.BooleanField(default=False)
 
 
    class Meta:
        db_table = 'MCI_Patient_IP_Registration_Detials'
 
    def save(self, *args, **kwargs):
 
        if not self.IPNo and self.Registration_Id and self.Registration_Id.startswith('IP'):
 
            self.IPNo = self.Registration_Id
   
        elif not self.IPNo:
 
            self.IPNo = generate_next_ip_number()
   
        super().save(*args, **kwargs)
 
 
 
    # def save(self, *args, **kwargs):
    #     with transaction.atomic():
    #         if not self.pk:
    #             current_year_month = datetime.now().strftime('%y%m')  # e.g. 2510
    #             prefix = f"IP{current_year_month}"
 
    #             # Lock rows that share the prefix to prevent duplicates
    #             matching_entries = list(
    #                 MCI_Patient_IP_Registration_Detials.objects
    #                 .filter(IPNo__startswith=prefix)
    #                 .select_for_update(skip_locked=True)
    #                 .values_list('IPNo', flat=True)
    #             )
 
    #             if matching_entries:
    #                 numeric_parts = [
    #                     int(ip_no[len(prefix):]) for ip_no in matching_entries
    #                     if ip_no[len(prefix):].isdigit()
    #                 ]
    #                 next_number = max(numeric_parts) + 1 if numeric_parts else 1
    #             else:
    #                 next_number = 1
 
    #             # Format: IP2510001, IP2510002, etc.
    #             self.IPNo = f"{prefix}{next_number}"
    #             print("Generated IPNo:", self.IPNo)
 
               
 
    #         super(MCI_Patient_IP_Registration_Detials, self).save(*args, **kwargs)
 
 
 
      
class MCI_Patient_Emergency_Registration_Detials(models.Model):
    Registration_Id = models.CharField(primary_key=True,max_length=30)
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE,blank=True,null=True)
    IdentificationMark1 = models.TextField(default='')
    IdentificationMark2 = models.TextField(default='')
    Instructions = models.TextField(default='')
    IsConscious = models.CharField(max_length=20,blank=True,null=True)
    IsMLC = models.CharField(max_length=20,blank=True,null=True)

    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Primary_doctor_Emergency_details_mci',null=True,blank=True)
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
    CorporateName = models.ForeignKey(Corporate_Master_Detials, on_delete=models.CASCADE, related_name='Emergency_patient_details_CorporateId_mci', null=True, blank=True)
    CorporateType = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeId = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeDesignation = models.CharField(max_length=30,blank=True,null=True)
    CorporateEmployeeRelation = models.CharField(max_length=30,blank=True,null=True)
   
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name='Emergency_appointment_EmployeeId_mci', null=True, blank=True)
    EmployeeRelation = models.CharField(max_length=40,blank=True,null=True)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='Emergency_appointment_DoctorId_mci', null=True, blank=True)
    DoctorRelation = models.CharField(max_length=30,blank=True,null=True)
    DonationType = models.ForeignKey(Donation_Master_Detials, on_delete=models.CASCADE, related_name='Emergency_patient_details_DonationId_mci', null=True, blank=True)
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
        db_table = 'MCI_Patient_Emergency_Registration_Detials'
    

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.Registration_Id:
                today_date = datetime.now().strftime('%y%m')  # e.g., '250618'
                prefix = f'EMG{today_date}'         # e.g., 'MIH250618EMG'

                # Lock matching records to safely compute next number
                matching_entries = MCI_Patient_Emergency_Registration_Detials.objects.select_for_update().filter(
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

            super(MCI_Patient_Emergency_Registration_Detials, self).save(*args, **kwargs)

class MCI_Patient_Casuality_Registration_Detials(models.Model):
    Registration_Id = models.CharField(max_length=30,unique=True)
    IsConsciousness = models.BooleanField(default=True) 
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE, related_name='casuality_appointment_details_mci',null=True,blank=True,default=None)
    VisitId = models.IntegerField(null=True,blank=True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_speciality_mci',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_doctor_mci',null=True,blank=True)
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
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_EmployeeId_mci',null=True,blank=True)
    EmployeeRelation = models.CharField(max_length=30)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='casuality_appointment_DoctorId_mci',null=True,blank=True)
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
        db_table = 'MCI_Patient_Casuality_Registration_Detials'
    def save(self, *args, **kwargs):
       

        if not self.Registration_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}CAS'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_patient_id = MCI_Patient_Casuality_Registration_Detials.objects.aggregate(max_id=Max('Registration_Id'))['max_id']
            if max_patient_id:
                numeric_part = int(max_patient_id[-5:]) + 1
            else:
                numeric_part = 1
            self.Registration_Id = f'{prefix}{numeric_part:05}'
       
        super(MCI_Patient_Casuality_Registration_Detials, self).save(*args, **kwargs)
    
class MCI_Patient_Diagnosis_Registration_Detials(models.Model):
    Registration_Id = models.CharField(max_length=30,unique=True)
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE, related_name='Diagnosis_appointment_details_mci')
    VisitId = models.IntegerField(null= True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_speciality_mci',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_doctor_mci',null=True,blank=True)
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
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_EmployeeId_mci',null=True,blank=True)
    EmployeeRelation = models.CharField(max_length=30)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Diagnosis_appointment_DoctorId_mci',null=True,blank=True)
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
        db_table = 'MCI_Patient_Diagnosis_Registration_Detials'
    
    def save(self, *args, **kwargs):
       

        if not self.Registration_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}DIAG'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Registration_Id = MCI_Patient_Diagnosis_Registration_Detials.objects.aggregate(max_id=Max('Registration_Id'))['max_id']
            if max_Registration_Id:
                numeric_part = int(max_Registration_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Registration_Id = f'{prefix}{numeric_part:05}'
       
        super(MCI_Patient_Diagnosis_Registration_Detials, self).save(*args, **kwargs)

class MCI_Patient_Laboratory_Registration_Detials(models.Model):
    Registration_Id = models.CharField(max_length=30,unique=True)
    PatientId = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE, related_name='Laboratory_appointment_details_mci')
    VisitId = models.IntegerField()
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,related_name='laboratory_appointment_speciality_mci',null=True,blank=True)
    PrimaryDoctor = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='laboratory_appointment_doctor_mci',null=True,blank=True)
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
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Laboratory_appointment_EmployeeId_mci',null=True,blank=True)
    EmployeeRelation = models.CharField(max_length=30)
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='Laboratory_appointment_DoctorId_mci',null=True,blank=True)
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
        db_table = 'MCI_Patient_Laboratory_Registration_Detials'
    def save(self, *args, **kwargs):
       

        if not self.Registration_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}LAB'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Registration_Id = MCI_Patient_Laboratory_Registration_Detials.objects.aggregate(max_id=Max('Registration_Id'))['max_id']
            if max_Registration_Id:
                numeric_part = int(max_Registration_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Registration_Id = f'{prefix}{numeric_part:05}'
       
        super(MCI_Patient_Laboratory_Registration_Detials, self).save(*args, **kwargs)
    
class MCI_Patient_Referral_Detials(models.Model):
    ReferralRegisteredBy = models.CharField(max_length=30)
    OP_Register_Id = models.ForeignKey(MCI_Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    IP_Register_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Emergency_Register_Id = models.ForeignKey(MCI_Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(MCI_Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Laboratory_Register_Id = models.ForeignKey(MCI_Patient_Laboratory_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Diagnosis_Register_Id = models.ForeignKey(MCI_Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    ReferralSource = models.CharField(max_length=30)
    ReferredBy = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,related_name='mci_referral_doctorname',null=True,blank=True)
    created_by = models.CharField(max_length=30)
    updated_by = models.CharField(max_length=30,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'MCI_Patient_Referral_Detials'




class MCI_RoomType_Master_Detials(models.Model):
   
    Room_Id = models.AutoField(primary_key=True)
    # Room_Name = models.CharField(max_length=30)
    Building_Name = models.ForeignKey(Building_Master_Detials,on_delete=models.CASCADE,related_name='mci_room_Building_name')
    Block_Name = models.ForeignKey(Block_Master_Detials,on_delete=models.CASCADE,related_name='mci_room_Block_name')
    Floor_Name = models.ForeignKey(Floor_Master_Detials,on_delete=models.CASCADE,related_name='mci_room_Floor_name')
    Ward_Name = models.ForeignKey(WardType_Master_Detials, on_delete=models.CASCADE, related_name='mci_room_ward_name')
    Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,related_name='mci_room_location_name')

    # GST_Charge = models.CharField(max_length=30)
    RoomNo = models.CharField(max_length=30,null=True,blank=True)

    Status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'MCI_RoomType_Master_Detials'

class MCI_Room_Master_Detials(models.Model):
    Room_Id = models.AutoField(primary_key=True)
    Building_Name = models.ForeignKey(Building_Master_Detials,on_delete=models.CASCADE,related_name='mci_room_master_Building_name')
    Block_Name = models.ForeignKey(Block_Master_Detials,on_delete=models.CASCADE,related_name='mci_room_master_Block_name')
    Floor_Name = models.ForeignKey(Floor_Master_Detials,on_delete=models.CASCADE,related_name='mci_room_master_Floor_name')
    Ward_Name = models.ForeignKey(MCI_RoomType_Master_Detials, on_delete=models.CASCADE, related_name='mci_room_master_ward_name')
    # Room_Name = models.ForeignKey(RoomType_Master_Detials, on_delete=models.CASCADE, related_name='room_master_room_name')
    Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,related_name='mci_room_master_location_name')
    # Room_No = models.CharField(max_length=30)
    NOB = models.CharField(max_length=20,null=True,blank=True)
    Bed_No = models.CharField(max_length=30,null=True,blank=True)
    Status = models.BooleanField(default=True)
    Booking_Status = models.CharField(max_length=30,default='Available')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'MCI_Room_Master_Detials'
 
    def __str__(self):
        return self.Bed_No


class MCI_Patient_Admission_Detials(models.Model):
    IsConverted=models.BooleanField(default=False)
    IsCasualityPatient= models.BooleanField(default=False)
    IP_Registration_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    OP_Registration_Id = models.ForeignKey(MCI_Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Emergency_Registration_Id = models.ForeignKey(MCI_Patient_Emergency_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Casuality_Registration_Id = models.ForeignKey(MCI_Patient_Casuality_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    Diagnosis_Registration_Id = models.ForeignKey(MCI_Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True,default=None)
    Laboratory_Registration_Id = models.ForeignKey(MCI_Patient_Laboratory_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True,default=None)
    AdmissionPurpose = models.CharField(max_length=255,default='')
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
        db_table = 'MCI_Patient_Admission_Detials'
   
class MCI_Patient_Admission_Room_Detials(models.Model):
    RegisterType= models.CharField(max_length=30)
    IP_Registration_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials, on_delete=models.CASCADE, null=True,blank=True)
    Emergency_Registration_Id = models.ForeignKey(MCI_Patient_Emergency_Registration_Detials, on_delete=models.CASCADE, null=True,blank=True)
    Casuality_Registration_Id = models.ForeignKey(MCI_Patient_Casuality_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)
    RoomId =models.ForeignKey(MCI_Room_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
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
        db_table = 'MCI_Patient_Admission_Room_Detials'
    def __str__(self):
        return f"{self.RegisterType} - {self.RoomId}"
 
 
 
 


class MCI_Patient_Discharge_Detials(models.Model):
    Discharge_Id = models.AutoField(primary_key=True)
    Registration_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials, on_delete=models.CASCADE)
    Discharge_Date = models.DateTimeField()
    Discharge_Reason = models.TextField(default='Routine Discharge')
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'MCI_Patient_Discharge_Detials'


class MCI_Radiology_Request_Details(models.Model):
    Radiology_RequestId = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(MCI_Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Casuality_Register_Id = models.ForeignKey(MCI_Patient_Casuality_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Diagnosis_Register_Id = models.ForeignKey(MCI_Patient_Diagnosis_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # Billing_Invoice_No = models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # IP_Billing_Invoice_No = models.ForeignKey(IP_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    # Interim_Billing_Invoice_No = models.ForeignKey(Interim_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Doctorid = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    TestCode = models.CharField(max_length=50)
    SubTestCode = models.CharField(max_length=50)
    Reason = models.CharField(max_length=80, default="")
    Status = models.CharField(max_length=20, default='Request')
    Service_Status = models.CharField(max_length=20, default='Pending')
    Canceledby = models.CharField(max_length=30, null=True, blank=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
   
    class Meta:
        db_table = 'MCI_Radiology_Request_Details'
        

   
    def save(self, *args, **kwargs):
        if not self.Radiology_RequestId:
            max_id = MCI_Radiology_Request_Details.objects.aggregate(max_id=Max('Radiology_RequestId'))['max_id']
            self.Radiology_RequestId = (max_id or 0) + 1
        super().save(*args, **kwargs)



class MCI_Radiology_Complete_Details(models.Model):
    Radiology_CompleteId = models.IntegerField(primary_key=True)
    RegisterType = models.CharField(max_length=30,default="")
    OP_Register_Id = models.ForeignKey(MCI_Patient_Appointment_Registration_Detials, on_delete=models.CASCADE,null=True,blank=True)  
    IP_Register_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Radiology_RequestId = models.ForeignKey(MCI_Radiology_Request_Details,on_delete=models.CASCADE,null=True,blank=True)
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
        db_table = 'MCI_Radiology_Complete_Details'
    
    def save(self, *args, **kwargs):
        if not self.Radiology_CompleteId:
            max_id = MCI_Radiology_Complete_Details.objects.aggregate(max_id=Max('Radiology_CompleteId'))['max_id']
            self.Radiology_CompleteId = (max_id or 0) + 1
        super(MCI_Radiology_Complete_Details, self).save(*args, **kwargs)




class MCI_Lab_Request_Details(models.Model):
    Request_Id = models.AutoField(primary_key=True)
    RegisterType = models.CharField(max_length=30, default="")
    OP_Register_Id = models.ForeignKey(
        MCI_Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    IP_Register_Id = models.ForeignKey(
        MCI_Patient_IP_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Casuality_Register_Id = models.ForeignKey(
        MCI_Patient_Casuality_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Lab_Register_Id = models.ForeignKey(
        MCI_Patient_Laboratory_Registration_Detials, on_delete=models.CASCADE, null=True, blank=True
    )
    Remarks = models.CharField(max_length=80, null=True, blank=True)
    Status = models.CharField(max_length=20, default="Pending")
    created_by = models.CharField(max_length=30)
    Billing_Status = models.CharField(max_length=15,default="Pending")
    # Billing_Invoice_No = models.ForeignKey(General_Billing_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Report = models.BinaryField(null=True, blank=True)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE)
    created_at = models.DateTimeField()        
    updated_at = models.DateTimeField()
    class Meta:
        db_table = 'MCI_Lab_Request_Details'

class MCI_Lab_Request_Items_Details(models.Model):
    Item_Id = models.CharField(max_length=20,primary_key=True)
    Request = models.ForeignKey(MCI_Lab_Request_Details, on_delete=models.CASCADE, related_name="mci_lab_request_items")
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
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="mci_phelobotomist_items"
    )
    Technician_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="mci_technician_items"
    )
    Verfier_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="mci_verifier_items"
    )
    Approver_Name = models.ForeignKey(
        Employee_Personal_Form_Detials, on_delete=models.CASCADE, null=True, blank=True, related_name="mci_approver_items"
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
    created_at = models.DateTimeField()       
    updated_at = models.DateTimeField()

    class Meta:
        db_table = 'MCI_Lab_Request_Items_Details'





# # class MCI_Billing_Item_Table_for_lab(models.Model):
# #     Item_Id = models.AutoField(primary_key=True)
# #     Billing_Invoice = models.CharField(max_length=30, null=True)
# #     Patient_Id = models.CharField(max_length=30,null=True)
# #     Visit_Id = models.IntegerField(null=True)
# #     Patient_Name = models.CharField(max_length=250, null=True)
# #     Dispatch_Method = models.CharField(max_length=250, null=True)
# #     Test_Method = models.CharField(max_length=30, null=True)
# #     Test_Name = models.CharField(max_length=250, null=True)
# #     Gross_Amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     Location = models.CharField(max_length=300, null=True)
# #     Service_Status = models.CharField(max_length=300, null=True)
# #     Analysis_Status = models.CharField(max_length=300, null=True)
# #     Verify_Status = models.CharField(max_length=300, null=True)
# #     Approve_Status = models.CharField(max_length=300, null=True)
# #     Barcode_Id = models.CharField(max_length=20, null=True)
# #     Group_Name = models.CharField(max_length=250, null=True)
# #     CreatedBy = models.CharField(max_length=30, null=True)
# #     Billing_Date = models.CharField(max_length=25, null=True)
# #     Test_Code = models.CharField(max_length=50, null=True)
# #     Group_Code = models.CharField(max_length=50, null=True)
# #     individual_add_amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     IsSubTest = models.CharField(max_length=25, null=True)
# #     SubTestCodes = models.CharField(max_length=255, null=True)
# #     Transfer_Location = models.CharField(max_length=80, null=True)
# #     PackageCode = models.CharField(max_length=80, null=True)
# #     PackageName = models.CharField(max_length=255, null=True)
# #     UpdatedAt = models.DateTimeField(auto_now=True)
# #     CreatedAt = models.DateTimeField(auto_now_add=True)
# #     Bill_Status = models.CharField(max_length=255, null=True, blank=True, default="Pending")


# #     class Meta:
# #         db_table = "MCI_Billing_Item_Table_for_lab"
        

# # class MCI_BillingInvoiceAndBillAmount(models.Model):
# #     Billing_Id = models.AutoField(primary_key=True)
# #     Billing_Invoice = models.CharField(max_length=35, null=True)
# #     Patient_Id = models.CharField(max_length=30,null=True)
# #     Visit_Id = models.IntegerField(null=True)
# #     Patient_Name = models.CharField(max_length=250, null=True)
# #     Item_Count = models.IntegerField(null=True)
# #     Total_Charge = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     Discount_Type = models.CharField(max_length=250, null=True)
# #     Discount = models.CharField(max_length=25, null=True)
# #     Net_Amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     Status = models.CharField(max_length=200, null=True)
# #     Location = models.CharField(max_length=300, null=True)
# #     Capture_Sample_Status = models.CharField(max_length=200, null=True)
# #     Analyze_Status = models.CharField(max_length=200, null=True)
# #     Verify_Status = models.CharField(max_length=200, null=True)
# #     Approve_Status = models.CharField(max_length=200, null=True)
# #     Barcode_Id = models.CharField(max_length=20, null=True)
# #     Group_Name = models.CharField(max_length=250, null=True)
# #     CreatedBy = models.CharField(max_length=30, null=True)
# #     Billing_Date = models.CharField(max_length=25, null=True)
# #     Billing_Type = models.CharField(max_length=100, null=True)
# #     RateCard_Name = models.CharField(max_length=100, null=True)
# #     Test_Code = models.CharField(max_length=50, null=True)
# #     Group_Code = models.CharField(max_length=50, null=True)
# #     TotalPaidAmount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     BalanceAmount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     Sample_Barcode_Image = models.BinaryField(null=True)
# #     AdditionalAmount = models.DecimalField(max_digits=10, decimal_places=3, null=True)
# #     AdditionalAmountReason = models.CharField(max_length=255, null=True)
# #     DiscountReason = models.CharField(max_length=255, null=True)
# #     HistoNumber = models.CharField(max_length=255, null=True)
# #     MicroNumber = models.CharField(max_length=255, null=True)
# #     Transfer_Location = models.CharField(max_length=255, null=True)
# #     UpdatedAt = models.DateTimeField(auto_now=True)
# #     CreatedAt = models.DateTimeField(auto_now_add=True)
# #     Registration_Id = models.CharField(max_length=255,null=True,blank=True)
# #     Request_Id = models.CharField(max_length=255,null=True,blank=True)


# #     class Meta:
# #         db_table = "MCI_Billing_invoice_and_bill_amount"


# # class MCI_Register_patient_Details(models.Model):
# #     Patient_Id = models.CharField(primary_key=True, max_length=30)
# #     Title = models.CharField(max_length=10, null=True, blank=True)
# #     Patient_Name = models.CharField(max_length=250, null=True, blank=True)
# #     Father_Name = models.CharField(max_length=250, null=True, blank=True)
# #     DOB = models.CharField(max_length=100, null=True, blank=True)
# #     Age = models.CharField(max_length=100,null=True, blank=True)
# #     Gender = models.CharField(max_length=150, null=True, blank=True)
# #     Marital_Status = models.CharField(max_length=200, null=True, blank=True)
# #     Door_No = models.CharField(max_length=25, null=True, blank=True)
# #     Street = models.CharField(max_length=1000, null=True, blank=True)
# #     Rural_Urban = models.CharField(max_length=250, null=True, blank=True)
# #     City = models.CharField(max_length=250, null=True, blank=True)
# #     State = models.CharField(max_length=250, null=True, blank=True)
# #     Pincode = models.CharField(max_length=10, null=True, blank=True)
# #     Phone = models.CharField(max_length=20, null=True, blank=True)
# #     Alternate_No = models.CharField(max_length=20, null=True, blank=True)
# #     Email = models.CharField(max_length=300, null=True, blank=True)
# #     Location = models.CharField(max_length=300, null=True, blank=True)
# #     Patient_Barcode = models.CharField(max_length=19, null=True, blank=True)
# #     Time_Period = models.CharField(max_length=30, null=True, blank=True)
# #     CreatedBy = models.CharField(max_length=30, null=True, blank=True)
# #     UpdatedAt = models.DateTimeField(auto_now=True)
# #     CreatedAt = models.DateTimeField(auto_now_add=True)
    
# #     class Meta:
# #         db_table = "MCI_Register_patient_Details"
    
# # class MCI_PatientVisitId(models.Model):
# #     S_No = models.AutoField(primary_key=True)
# #     Visit_Id = models.IntegerField(null=True)
# #     Patient_Name = models.CharField(max_length=250, null=True)
# #     Patient_Id = models.CharField(max_length=30,null=True)
# #     Phone = models.CharField(max_length=20, null=True)
# #     Visit_Type = models.CharField(max_length=250, null=True)
# #     Phlebotomist_Type = models.CharField(max_length=250, null=True)
# #     Phlebotomist_Name = models.CharField(max_length=250, null=True)
# #     Refering_Doctor = models.CharField(max_length=250, null=True)
# #     Patient_Group = models.CharField(max_length=250, null=True)
# #     Dispatch_Method = models.CharField(max_length=200, null=True)
# #     Patient_Barcode = models.CharField(max_length=20, null=True)
# #     CreatedBy = models.CharField(max_length=30, null=True)
# #     Location = models.CharField(max_length=60, null=True)
# #     Outsourced_Type = models.CharField(max_length=68, null=True)
# #     Refering_Hospital = models.CharField(max_length=350, null=True)
# #     UpdatedAt = models.DateTimeField(auto_now=True)
# #     CreatedAt = models.DateTimeField(auto_now_add=True)
    
# #     class Meta:
# #         db_table = "MCI_Patient_Visit_Id"


from django.db import models
from django.db.models import Max
from datetime import datetime
 
class MCI_Theatre_Booking_Request_Details(models.Model):
    Booking_Id = models.CharField(max_length=30, null=True, blank=True)
    Booking_No = models.CharField(primary_key=True, max_length=30)
    ReqDate = models.DateField()
    ReqTime = models.TimeField()
    BookingType = models.CharField(max_length=255, null=True, blank=True)
    Specialization = models.ForeignKey(Speciality_Detials, on_delete=models.CASCADE, related_name='Speciality_mci', null=True, blank=True)
    SurgeryName = models.ForeignKey(SurgeryName_Details, on_delete=models.CASCADE, related_name='SurgeryName_mci', null=True, blank=True)
    ProcedureName = models.ForeignKey(Procedure_Master_Details, on_delete=models.CASCADE, related_name='Procedure_mci', null=True, blank=True)
    TheatreName = models.ForeignKey(OtTheaterMaster_Detials, on_delete=models.CASCADE, related_name='OtTheaterMaster_mci', null=True, blank=True)
    DoctorName = models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE, related_name='Doctor_mci', null=True, blank=True)
    OP_Registration_Id = models.ForeignKey(MCI_Patient_Appointment_Registration_Detials, on_delete=models.CASCADE, related_name='OP_otrequest_mci', null=True, blank=True)
    IP_Registration_Id = models.ForeignKey(MCI_Patient_IP_Registration_Detials, on_delete=models.CASCADE, related_name='IP_otrequest_mci', null=True, blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials, on_delete=models.CASCADE, related_name='EMR_otrequest_mci', null=True, blank=True)
    BookingDate = models.DateField()
    BookingTime = models.TimeField()
    Duration = models.CharField(max_length=255, null=True, blank=True)
    OperationType = models.CharField(max_length=255, null=True, blank=True)
    OperationMode = models.CharField(max_length=255, null=True, blank=True)
    Priority = models.CharField(max_length=255, null=True, blank=True)
    PatientName = models.CharField(max_length=255, null=True, blank=True)
    Patientid = models.ForeignKey(MCI_Patient_Detials, on_delete=models.CASCADE, null=True, blank=True)
    DoctorConfirm = models.BooleanField(default=False)
    Age = models.CharField(max_length=255, null=True, blank=True)
    Gender = models.CharField(max_length=255, null=True, blank=True)
    UHIDNO = models.CharField(max_length=255, null=True, blank=True)
    Status = models.CharField(max_length=255, null=True, blank=True)
    Reason = models.CharField(max_length=255, null=True, blank=True)
    WheelInTime = models.TimeField(null=True)
    WheelOutTime = models.TimeField(null=True)
    DoctorInTime = models.TimeField(null=True)
    ProcedureStartTime = models.TimeField(null=True)
    ProcedureendTime = models.TimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)

    Diagnosis = models.CharField(max_length=255, null=True, blank=True)
    Surgeon = models.JSONField(default=list, blank=True)
    Anaesthetist = models.JSONField(default=list, blank=True)
    ScrubNurse = models.JSONField(default=list, blank=True)
    Type = models.CharField(max_length=255, null=True, blank=True)
 
 
    class Meta:
        db_table = 'MCI_Theatre_Booking_Request_Details'
 
    def save(self, *args, **kwargs):
        if not self.Booking_No:
            last_booking = (
                MCI_Theatre_Booking_Request_Details.objects
                .exclude(CreatedBy='system')
                .order_by('-created_at')
                .first()
            )

            if last_booking and last_booking.Booking_No:
                try:
                    last_number = int(last_booking.Booking_No.split('/')[-1])
                except (IndexError, ValueError):
                    last_number = 0
            else:
                last_number = 0

            self.Booking_No = f"OT/{last_number + 1}"

        super().save(*args, **kwargs)



class MRD_IP_Patient_Diagnosis_Data(models.Model):
 
 
    Patient_Id=models.ForeignKey(MCI_Patient_Detials,on_delete=models.CASCADE)
    Register_Id=models.ForeignKey(MCI_Patient_IP_Registration_Detials,on_delete=models.CASCADE)
    ICDCode = models.CharField(max_length=100,null=True,blank=True)
    Code_Description = models.CharField(max_length=100,null=True,blank=True)
    Diagnosis = models.CharField(max_length=100,null=True,blank=True)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    canceled_by = models.CharField(max_length=100,null=True,blank=True)
    Status = models.CharField(max_length=100,default='Added')
 
 
 
    class Meta:
        db_table = 'MRD_IP_Patient_Diagnosis_Data'
 
 
 
 
 
 
 
