from django.db import models
from django.db.models import Max
from Masters.models import *
from Frontoffice.models import *
from django.core.exceptions import ValidationError
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.timezone import now

from django.db.models import Q
from django.db import transaction
from django.http import JsonResponse

# Create your models here.




class Theatre_Booking_Request_Details(models.Model):
   
    Booking_Id = models.CharField(primary_key=True,max_length=30)
    ReqDate = models.DateField()
    ReqTime = models.TimeField()
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    Specialization = models.ForeignKey(Speciality_Detials,on_delete=models.CASCADE,null=True,blank=True)
    SurgeryName = models.ForeignKey(SurgeryName_Details,on_delete=models.CASCADE,null=True,blank=True)
    ProcedureName = models.ForeignKey(Procedure_Master_Details,on_delete=models.CASCADE,null=True,blank=True)
    TheatreName = models.ForeignKey(OtTheaterMaster_Detials,on_delete=models.CASCADE,null=True,blank=True)
    DoctorName = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_otrequest',null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_otrequest',null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,related_name='EMR_otrequest',null=True,blank=True)
    BookingDate = models.DateField()
    BookingTime = models.TimeField()
    Duration = models.CharField(max_length=255,null=True,blank=True)
    OperationType = models.CharField(max_length=255,null=True,blank=True)
    OperationMode = models.CharField(max_length=255,null=True,blank=True)
    Priority = models.CharField(max_length=255,null=True,blank=True)
    PatientName = models.CharField(max_length=255,null=True,blank=True)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
    DoctorConfirm = models.BooleanField(default=False)
    Age = models.CharField(max_length=255,null=True,blank=True)
    Gender = models.CharField(max_length=255,null=True,blank=True)
    UHIDNO = models.CharField(max_length=255,null=True,blank=True)
    Status = models.CharField(max_length=255,null=True,blank=True)
    Reason = models.CharField(max_length=255,null=True,blank=True)
    WheelInTime = models.TimeField(null=True)
    WheelOutTime = models.TimeField(null=True)
    DoctorInTime = models.TimeField(null=True)
    ProcedureStartTime = models.TimeField(null=True)
    ProcedureendTime = models.TimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    CompletedBy = models.CharField(max_length=50,null=True,blank=True)
       
 
    class Meta:
         db_table = 'Theatre_Booking_Request_Details'
 
    def save(self, *args, **kwargs):
        if not self.Booking_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
           
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            today_date = datetime.now().strftime('%y%m%d')
            prefix = f'{clinic_name}{today_date}OT'
           
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Theatre_Booking_Request_Details.objects.aggregate(max_id=Max('Booking_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Booking_Id = f'{prefix}{numeric_part:05}'
       
        super(Theatre_Booking_Request_Details, self).save(*args, **kwargs)
 
 
class OTTheatrecalendar(models.Model):

    Theatre = models.ForeignKey(OtTheaterMaster_Detials,on_delete=models.CASCADE,null=True,blank=True)
    booking = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)
    date = models.DateField()
    time = models.TimeField()
    Status = models.CharField(max_length=255,default='Booked')

    class Meta:
        db_table = 'OTTheatrecalendar'

class OTDoctorcalendar(models.Model):

    Theatre = models.ForeignKey(OtTheaterMaster_Detials,on_delete=models.CASCADE,null=True,blank=True)
    booking = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)
    date = models.DateField()
    time = models.TimeField()
    Status = models.CharField(max_length=255,default='Booked')
    Doctorid = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    DoctorType = models.CharField(max_length=255,null=True,blank=True)

    class Meta:
        db_table = 'OTDoctorcalendar'

class OTEmployeecalendar(models.Model):

    Theatre = models.ForeignKey(OtTheaterMaster_Detials,on_delete=models.CASCADE,null=True,blank=True)
    booking = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)
    date = models.DateField()
    time = models.TimeField()
    Status = models.CharField(max_length=255,default='Booked')
    employeeid = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    EmployeeType = models.CharField(max_length=255,null=True,blank=True)


    class Meta:
        db_table = 'OTEmployeecalendar'


class OTConsumable_Details(models.Model):

    Category = models.ForeignKey(Product_Category_Product_Details,on_delete=models.CASCADE,null=True,blank=True)
    Subcategory = models.ForeignKey(SubCategory_Detailes,on_delete=models.CASCADE,null=True,blank=True)
    Store = models.ForeignKey(Inventory_Location_Master_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Product = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,null=True,blank=True)
    OP_Registration_Id= models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_otconsumable',null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_otconsumable',null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,related_name='EMR_otconsumable',null=True,blank=True)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True) 
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    Quantity = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    class Meta:
         db_table = 'OTConsumable_Details'

class OTConsignment_Details(models.Model):

    Consignment = models.CharField(max_length=255,null=True,blank=True)
    Quantity = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True) 
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_otconsignment',null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_otconsignment',null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,related_name='EMR_otconsignment',null=True,blank=True)  
    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    class Meta:
         db_table = 'OTConsignment_Details'

class OTEquipment_Details(models.Model):

    Equipment = models.CharField(max_length=255,null=True,blank=True)
    Quantity = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True) 
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_otequipment',null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_otequipment',null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,related_name='EMR_otequipment',null=True,blank=True) 

    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  


    class Meta:
         db_table = 'OTEquipment_Details'

class Surgical_Team_Details(models.Model):

    Surgeon = models.ManyToManyField(Doctor_Personal_Form_Detials,related_name='surgeon_teams',blank=True)
    Assistant_Surgeon = models.ManyToManyField(Doctor_Personal_Form_Detials,related_name='assistant_surgeon_teams',blank=True)
    Anaesthesiologist = models.ManyToManyField(Doctor_Personal_Form_Detials,related_name='anaesthesiologist_teams',blank=True)
    Scrub_Nurse = models.ManyToManyField(Employee_Personal_Form_Detials,related_name='scrub_nurse_teams',blank=True)
    Circulating_Nurse = models.ManyToManyField(Employee_Personal_Form_Detials,related_name='circulating_nurse_teams',blank=True)
    Technician = models.ManyToManyField(Employee_Personal_Form_Detials,related_name='technician_teams',blank=True)
    Helper = models.ManyToManyField(Employee_Personal_Form_Detials,related_name='helper_teams',blank=True)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True) 
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_otcrew',null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_otcrew',null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,related_name='EMR_otcrew',null=True,blank=True)  
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    
    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  


    class Meta:
         db_table = 'Surgical_Team_Details'

class OT_Billing(models.Model):

    Service_name = models.CharField(max_length=255,null=True,blank=True)
    Name = models.CharField(max_length=255,null=True,blank=True)
    Per_hr_unit_cost = models.CharField(max_length=255,null=True,blank=True)
    Quantity = models.CharField(max_length=255,null=True,blank=True)
    Amount = models.CharField(max_length=255,null=True,blank=True)
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,related_name='OP_otbill',null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,related_name='IP_otbill',null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,related_name='EMR_otbill',null=True,blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    
    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  


    class Meta:
         db_table = 'OT_Billing'

class Pre_Operative_Checklist_OT(models.Model):


    PreOp_Id = models.CharField(primary_key=True,max_length=30)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    PatientUHID = models.CharField(max_length=255,null=True,blank=True)
    Allergies = models.CharField(max_length=255,null=True,blank=True)
    Dentures = models.CharField(max_length=255,null=True,blank=True)
    VitalSigns = models.CharField(max_length=255,null=True,blank=True)
    Pre_op_medication = models.CharField(max_length=255,null=True,blank=True)
    Nilbymouth = models.CharField(max_length=255,null=True,blank=True)
    Consent_for_Procedure_Surgery = models.CharField(max_length=255,null=True,blank=True)
    High_risk_Consent = models.CharField(max_length=255,null=True,blank=True)
    BloodRequirement = models.CharField(max_length=255,null=True,blank=True)
    PreAnaestheticAssessment = models.CharField(max_length=255,null=True,blank=True)
    Operationtype = models.CharField(max_length=255,null=True,blank=True)
    MarkingofsiteDate = models.DateField()
    MarkingofsiteTime = models.TimeField()
    ConfirmbysurgeonDate = models.DateField()
    ConfirmbysurgeonTime = models.TimeField()
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    class Meta:
        db_table = "Pre_Operative_Checklist_OT"

    
    def save(self, *args, **kwargs):
        if not self.PreOp_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}PREOT'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Pre_Operative_Checklist_OT.objects.aggregate(max_id=Max('PreOp_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.PreOp_Id = f'{prefix}{numeric_part:05}'
       
        super(Pre_Operative_Checklist_OT, self).save(*args, **kwargs)
 

class Intra_Post_Operative_Notes_OT(models.Model):


    IntraOp_Id = models.CharField(primary_key=True,max_length=30)
    Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
    OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
    EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
    DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
    Procedure = models.CharField(max_length=255,null=True,blank=True)
    Procedurecheck = models.BooleanField(default=False)
    Intraoperativecomplications = models.CharField(max_length=255,null=True,blank=True)
    Intraoperativecomplicationscheck = models.BooleanField(default=False)
    Bloodloss = models.CharField(max_length=255,null=True,blank=True)
    Bloodlosscheck = models.BooleanField(default=False)
    Replaced = models.CharField(max_length=255,null=True,blank=True)
    Replacedcheck = models.BooleanField(default=False)
    Closure = models.CharField(max_length=255,null=True,blank=True)
    Closurecheck = models.BooleanField(default=False)
    Extubation = models.CharField(max_length=255,null=True,blank=True)
    Extubationcheck = models.BooleanField(default=False)
    SpecimenHistopathology = models.CharField(max_length=255,null=True,blank=True)
    SpecimenHistopathologycheck = models.BooleanField(default=False)
    Microbiology = models.CharField(max_length=255,null=True,blank=True)
    Microbiologycheck = models.BooleanField(default=False)
    Specimen = models.CharField(max_length=255,null=True,blank=True)
    Surgicalprocedures = models.CharField(max_length=255,null=True,blank=True)
    Date = models.DateField()
    Time = models.TimeField()
    Patientcondition = models.CharField(max_length=255,null=True,blank=True)
    BookingType = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    class Meta:
        db_table = "Intra_Post_Operative_Notes_OT"

    def save(self, *args, **kwargs):
        if not self.IntraOp_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}IPONOT'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Intra_Post_Operative_Notes_OT.objects.aggregate(max_id=Max('IntraOp_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.IntraOp_Id = f'{prefix}{numeric_part:05}'
       
        super(Intra_Post_Operative_Notes_OT, self).save(*args, **kwargs)
 


class Operative_category_type(models.Model):

     Category_Id = models.CharField(max_length=255, primary_key=True) 
     IntraOp_Id = models.ForeignKey(Intra_Post_Operative_Notes_OT,on_delete=models.CASCADE,null=True,blank=True)
     Categorytype = models.CharField(max_length=255,null=True,blank=True)
     Size = models.CharField(max_length=255,null=True,blank=True)
     Site = models.CharField(max_length=255,null=True,blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
     class Meta:
        db_table = "Operative_category_type"

     def save(self, *args, **kwargs):
        if not self.Category_Id:  # Check if accountsetting_id is not set
            max_id = Operative_category_type.objects.aggregate(max_id=Max('Category_Id'))['max_id']
            self.Category_Id = (max_id or 0) + 1
        super(Operative_category_type, self).save(*args, **kwargs)

class Cataract_notes(models.Model):

     Cataract_Id = models.CharField(max_length=255, primary_key=True) 
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Eye = models.CharField(max_length=255,null=True,blank=True)
     Surgeryname = models.CharField(max_length=255,null=True,blank=True)
     Incision = models.CharField(max_length=255,null=True,blank=True)
     Siteofincision = models.CharField(max_length=255,null=True,blank=True)
     Capsulorhexis = models.CharField(max_length=255,null=True,blank=True)
     NucleusRemoval = models.CharField(max_length=255,null=True,blank=True)
     LensImplantation = models.CharField(max_length=255,null=True,blank=True)
     Intraopcomplications = models.CharField(max_length=255,null=True,blank=True)
     Postop = models.CharField(max_length=255,null=True,blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    
     class Meta:
        db_table = "Cataract_notes"

    
     def save(self, *args, **kwargs):
        if not self.Cataract_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}CATNOTS'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Cataract_notes.objects.aggregate(max_id=Max('Cataract_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Cataract_Id = f'{prefix}{numeric_part:05}'
       
        super(Cataract_notes, self).save(*args, **kwargs)
 

 
class DCR_notes(models.Model):

     DCR_Id = models.CharField(max_length=255, primary_key=True) 
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Eye = models.CharField(max_length=255,null=True,blank=True)
     Surgeryname = models.CharField(max_length=255,null=True,blank=True)
     Operationnotes = models.CharField(max_length=255,null=True,blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    
     class Meta:
        db_table = "DCR_notes"

    
     def save(self, *args, **kwargs):
        if not self.DCR_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}DCR'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = DCR_notes.objects.aggregate(max_id=Max('DCR_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.DCR_Id = f'{prefix}{numeric_part:05}'
       
        super(DCR_notes, self).save(*args, **kwargs)
 

class Neuro_Surgery_notes(models.Model):

     NEUO_Id = models.CharField(max_length=255, primary_key=True) 
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Surgeryname = models.CharField(max_length=255,null=True,blank=True)
     Operationnotes = models.CharField(max_length=255,null=True,blank=True)
     PostOpInstructions = models.CharField(max_length=255,null=True,blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    
     class Meta:
        db_table = "Neuro_Surgery_notes"

    
     def save(self, *args, **kwargs):
        if not self.NEUO_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}NEUO'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Neuro_Surgery_notes.objects.aggregate(max_id=Max('NEUO_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.NEUO_Id = f'{prefix}{numeric_part:05}'
       
        super(Neuro_Surgery_notes, self).save(*args, **kwargs)
 
class Terigium_notes(models.Model):

     Terigium_Id =  models.CharField(max_length=255, primary_key=True)  
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Eye = models.CharField(max_length=255,null=True,blank=True)
     Surgeryname = models.CharField(max_length=255,null=True,blank=True)
     Operationnotes = models.CharField(max_length=255,null=True,blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    
     class Meta:
        db_table = "Terigium_notes"

    
     def save(self, *args, **kwargs):
        if not self.Terigium_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}TER'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Terigium_notes.objects.aggregate(max_id=Max('Terigium_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Terigium_Id = f'{prefix}{numeric_part:05}'
       
        super(Terigium_notes, self).save(*args, **kwargs)
 

class Labour_and_Delivery_notes(models.Model):

     Delivery_Id =  models.CharField(max_length=255, primary_key=True)  
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Labourtype = models.CharField(max_length=255,null=True,blank=True)
     Duration1 = models.CharField(max_length=255,null=True,blank=True)
     Duration2 = models.CharField(max_length=255,null=True,blank=True)
     Duration3 = models.CharField(max_length=255,null=True,blank=True)
     DeliveryDate = models.DateField()
     DeliveryTime = models.TimeField()
     Gender = models.CharField(max_length=255,null=True,blank=True)
     DeliveryWt = models.CharField(max_length=255,null=True,blank=True)
     APGARscore = models.CharField(max_length=255,null=True,blank=True)
     Type = models.CharField(max_length=255,null=True,blank=True)
     Complications = models.CharField(max_length=255,null=True,blank=True)
     Babybloodgroup = models.ForeignKey(BloodGroup_Detials,on_delete=models.CASCADE,null=True,blank=True)
     Placenta_Membranes = models.CharField(max_length=255,null=True,blank=True)
     MembranesCondition = models.CharField(max_length=255,null=True,blank=True)
     PlacentaCondition = models.CharField(max_length=255,null=True,blank=True)
     Conductedby = models.CharField(max_length=255,null=True,blank=True)
     Assistedby = models.CharField(max_length=255,null=True,blank=True)
     Anaesthesiologist = models.CharField(max_length=255,null=True,blank=True)
     LabourAnalgesia = models.CharField(max_length=255,null=True,blank=True)
     PPH = models.CharField(max_length=255,null=True,blank=True)
     Amount = models.CharField(max_length=255,null=True,blank=True)
     Laceration = models.CharField(max_length=255,null=True,blank=True)
     Episiotomy = models.CharField(max_length=255,null=True,blank=True)
     EpisiotomyMaterial = models.CharField(max_length=255,null=True,blank=True)
     ProphylacticOxytocic = models.CharField(max_length=255,null=True,blank=True)
     Pulse = models.CharField(max_length=255,null=True,blank=True)
     BP = models.CharField(max_length=255,null=True,blank=True)
     Uterus = models.CharField(max_length=255,null=True,blank=True)
     BleedingPV = models.CharField(max_length=255,null=True,blank=True)
     PostDeleiveryOrders = models.CharField(max_length=255,null=True,blank=True)
     BeforeWT = models.CharField(max_length=255,null=True,blank=True)
     BeforeHC = models.CharField(max_length=255,null=True,blank=True)
     Length = models.CharField(max_length=255,null=True,blank=True)
     Anomalies = models.CharField(max_length=255,null=True,blank=True)
     Remarks = models.CharField(max_length=255,null=True,blank=True)
     PaediatricianRecord = models.CharField(max_length=255,null=True,blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    
     class Meta:
        db_table = "Labour_and_Delivery_notes"

    
     def save(self, *args, **kwargs):
        if not self.Delivery_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}DEL'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Labour_and_Delivery_notes.objects.aggregate(max_id=Max('Delivery_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.Delivery_Id = f'{prefix}{numeric_part:05}'
       
        super(Labour_and_Delivery_notes, self).save(*args, **kwargs)
 


class Anaesthesia_Pre_Operative_Checklist(models.Model):
    

     AnaesPreOp_Id =  models.CharField(max_length=255, primary_key=True)  
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Concerns = models.CharField(max_length=255,null=True,blank=True)
     ClinicalDiagnosis = models.CharField(max_length=255,null=True,blank=True)
     ProcedureDate  = models.DateField()
     LMP = models.CharField(max_length=255,null=True,blank=True)
     Pregnant = models.CharField(max_length=255,null=True,blank=True)
     PregnantWeeks = models.CharField(max_length=255,null=True,blank=True)
     Hypertension = models.CharField(max_length=255,null=True,blank=True)
     Diabetes = models.CharField(max_length=255,null=True,blank=True)
     Asthma = models.CharField(max_length=255,null=True,blank=True)
     Allergy = models.CharField(max_length=255,null=True,blank=True)
     Hyphothyroid = models.CharField(max_length=255,null=True,blank=True)
     Epilepsy = models.CharField(max_length=255,null=True,blank=True)
     IHD = models.CharField(max_length=255,null=True,blank=True)
     Smoking = models.CharField(max_length=255,null=True,blank=True)
     PreProSurgery = models.CharField(max_length=255,null=True,blank=True)
     Medications = models.CharField(max_length=255,null=True,blank=True)
     Antiplatelets = models.CharField(max_length=255,null=True,blank=True)
     Relevanthistory = models.CharField(max_length=255,null=True,blank=True)
     Icterus = models.CharField(max_length=255,null=True,blank=True)
     Pallor = models.CharField(max_length=255,null=True,blank=True)
     Cyanosis = models.CharField(max_length=255,null=True,blank=True)
     Clubbing = models.CharField(max_length=255,null=True,blank=True)
     Odema = models.CharField(max_length=255,null=True,blank=True)
     AirwayDentition = models.CharField(max_length=255,null=True,blank=True)
     Thyroid = models.CharField(max_length=255,null=True,blank=True)
     Spine = models.CharField(max_length=255,null=True,blank=True)
     MouthOpening = models.CharField(max_length=255,null=True,blank=True)
     Mallampattigrade = models.CharField(max_length=255,null=True,blank=True)
     OSAScore =  models.CharField(max_length=255,null=True,blank=True)
     FunctionalLimitation =  models.CharField(max_length=255,null=True,blank=True)
     Mentohyoiddistance =  models.CharField(max_length=255,null=True,blank=True)
     NeckMovements =  models.CharField(max_length=255,null=True,blank=True)
     NeckCircumference =  models.CharField(max_length=255,null=True,blank=True)
     Pulse =  models.CharField(max_length=255,null=True,blank=True)
     BP =  models.CharField(max_length=255,null=True,blank=True)
     RR =  models.CharField(max_length=255,null=True,blank=True)
     Temparature =  models.CharField(max_length=255,null=True,blank=True)
     Weight =  models.CharField(max_length=255,null=True,blank=True)
     CVS =  models.CharField(max_length=255,null=True,blank=True)
     RS =  models.CharField(max_length=255,null=True,blank=True)
     GIT =  models.CharField(max_length=255,null=True,blank=True)
     CNS =  models.CharField(max_length=255,null=True,blank=True)
     BreathHoldingTime = models.TimeField(null=True,blank=True)
     EffortTolerance =  models.CharField(max_length=255,null=True,blank=True)
     OtherRelevantFindings =  models.CharField(max_length=255,null=True,blank=True)
     AnaesthesiaPlanned =  models.CharField(max_length=255,null=True,blank=True)
     PreOpinion =  models.CharField(max_length=255,null=True,blank=True)
     PostOperativeAnalgesiaPlanned =  models.CharField(max_length=255,null=True,blank=True)
     ASACategory =  models.CharField(max_length=255,null=True,blank=True)
     AnticipatedPostAnaesthesiaCare =  models.CharField(max_length=255,null=True,blank=True)
     Nilbymouth=  models.CharField(max_length=255,null=True,blank=True)
     unitsBloodReserved =  models.CharField(max_length=255,null=True,blank=True)
     Premedication =  models.CharField(max_length=255,null=True,blank=True)
     OtherSpecificinstructions =  models.CharField(max_length=255,null=True,blank=True)
     Name =  models.CharField(max_length=255,null=True,blank=True)
     Date = models.DateField(null=True,blank=True)
     Time = models.TimeField(null=True,blank=True)

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
    
     class Meta:
        db_table = "Anaesthesia_Pre_Operative_Checklist"

    
     def save(self, *args, **kwargs):
        if not self.AnaesPreOp_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}ANPOP'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Anaesthesia_Pre_Operative_Checklist.objects.aggregate(max_id=Max('AnaesPreOp_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.AnaesPreOp_Id = f'{prefix}{numeric_part:05}'
       
        super(Anaesthesia_Pre_Operative_Checklist, self).save(*args, **kwargs)
 

class Anaesthesia_Post_Operative_Checklist(models.Model):

     AnaesPostOp_Id =  models.CharField(max_length=255, primary_key=True)  
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     ConsciousnessLevel =  models.CharField(max_length=255,null=True,blank=True)
     Reflexes = models.CharField(max_length=255,null=True,blank=True)
     Headlift = models.CharField(max_length=255,null=True,blank=True)
     PR= models.CharField(max_length=255,null=True,blank=True)
     BP = models.CharField(max_length=255,null=True,blank=True)
     RR = models.CharField(max_length=255,null=True,blank=True)
     SPO2 = models.CharField(max_length=255,null=True,blank=True)
     PatientTransferred = models.CharField(max_length=255,null=True,blank=True)
     AdverseEvents = models.CharField(max_length=255,null=True,blank=True)
     Name = models.CharField(max_length=255,null=True,blank=True)
     Date = models.DateField()
     Time = models.TimeField()

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)
     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  

     class Meta:
        db_table = "Anaesthesia_Post_Operative_Checklist"

    
     def save(self, *args, **kwargs):
        if not self.AnaesPostOp_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}APOST'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Anaesthesia_Post_Operative_Checklist.objects.aggregate(max_id=Max('AnaesPostOp_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.AnaesPostOp_Id = f'{prefix}{numeric_part:05}'
       
        super(Anaesthesia_Post_Operative_Checklist, self).save(*args, **kwargs)
 

class Anaesthesia_Intra_Operative_Checklist(models.Model):

     AnaesIntOp_Id =  models.CharField(max_length=255, primary_key=True)  
     Patientid = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,null=True,blank=True)
     OP_Registration_Id = models.ForeignKey(Patient_Appointment_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     IP_Registration_Id = models.ForeignKey(Patient_IP_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True)
     EMR_Registration_Id = models.ForeignKey(Patient_Emergency_Registration_Detials,on_delete=models.CASCADE,null=True,blank=True) 
     DoctorId = models.ForeignKey(Doctor_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True)
     BookingType = models.CharField(max_length=255,null=True,blank=True)
     Name1 =  models.CharField(max_length=255,null=True,blank=True)
     Anaesthesiaplan = models.CharField(max_length=255,null=True,blank=True)
     Proceduresurgery = models.CharField(max_length=255,null=True,blank=True)
     Anaesmachinecheck = models.BooleanField(default=False)
     Pulseoximeter = models.BooleanField(default=False)
     KnownAllergy =  models.CharField(max_length=255,null=True,blank=True)
     DifficultAirway = models.CharField(max_length=255,null=True,blank=True)
     Aspirationrisk = models.CharField(max_length=255,null=True,blank=True)
     Bloodlossrisk = models.CharField(max_length=255,null=True,blank=True)
     HR = models.CharField(max_length=255,null=True,blank=True)
     BP = models.CharField(max_length=255,null=True,blank=True)
     RR = models.CharField(max_length=255,null=True,blank=True)
     SPO2 = models.CharField(max_length=255,null=True,blank=True)

     Airways = models.CharField(max_length=255,null=True,blank=True)
     Generaltype = models.CharField(max_length=255,null=True,blank=True)
     Size = models.CharField(max_length=255,null=True,blank=True)
     Cuff = models.CharField(max_length=255,null=True,blank=True)
     CLGrade = models.CharField(max_length=255,null=True,blank=True)
     Attempts = models.CharField(max_length=255,null=True,blank=True)
     Intubation = models.CharField(max_length=255,null=True,blank=True)
     Ventilation = models.CharField(max_length=255,null=True,blank=True)
     GeneralVt = models.CharField(max_length=255,null=True,blank=True)
     GeneralRR = models.CharField(max_length=255,null=True,blank=True)
     GenralMV = models.CharField(max_length=255,null=True,blank=True)
     GeneralPIP = models.CharField(max_length=255,null=True,blank=True)
     GeneralPEEP = models.CharField(max_length=255,null=True,blank=True)
     GeneralTDV = models.CharField(max_length=255,null=True,blank=True)
     GeneralRatio = models.CharField(max_length=255,null=True,blank=True)
     GeneralMode = models.CharField(max_length=255,null=True,blank=True)
     GeneralCircuit = models.CharField(max_length=255,null=True,blank=True)
     GeneralMap = models.CharField(max_length=255,null=True,blank=True)
     TourniquestApplied = models.CharField(max_length=255,null=True,blank=True)
     TourniquestRemoved = models.CharField(max_length=255,null=True,blank=True)

     Technique = models.CharField(max_length=255,null=True,blank=True)
     Needle = models.CharField(max_length=255,null=True,blank=True)
     Space = models.CharField(max_length=255,null=True,blank=True)
     Drug = models.CharField(max_length=255,null=True,blank=True)
     Onsetofaction = models.CharField(max_length=255,null=True,blank=True)
     Sensorylevel = models.CharField(max_length=255,null=True,blank=True)
     Motorlevel = models.CharField(max_length=255,null=True,blank=True)
     EA = models.CharField(max_length=255,null=True,blank=True)
     TestDose = models.CharField(max_length=255,null=True,blank=True)

     LocalAnaesthesia = models.TextField()
     TopicalAnaesthesia =  models.TextField()

     Intravenous = models.CharField(max_length=255,null=True,blank=True)
     IntraMuscular = models.CharField(max_length=255,null=True,blank=True)
     Intrathecal = models.CharField(max_length=255,null=True,blank=True)
     Inhalational = models.CharField(max_length=255,null=True,blank=True)

     PressurePointsPadded = models.CharField(max_length=255,null=True,blank=True)
     EyesCovered = models.CharField(max_length=255,null=True,blank=True)
     ThroatPack = models.CharField(max_length=255,null=True,blank=True)

     IntraOperativeEvents = models.TextField()
     Name2 = models.CharField(max_length=255,null=True,blank=True)
     Date = models.DateField()
     Time = models.TimeField()

 

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     CreatedBy = models.CharField(max_length=50)

     Booking_Id = models.ForeignKey(Theatre_Booking_Request_Details,on_delete=models.CASCADE,null=True,blank=True)  
     class Meta:
        db_table = "Anaesthesia_Intra_Operative_Checklist"

    
     def save(self, *args, **kwargs):
        if not self.AnaesIntOp_Id:
            hospital_details = Hospital_Detials.objects.first()
            if not hospital_details:
                raise ValueError("No Hospital_Details records found.")
            
            clinic_name = hospital_details.Hospital_Name[:3].upper()
            prefix = f'{clinic_name}AINT'
            
            # Find the maximum numeric part from existing PatientId with the same prefix
            max_Booking_Id = Anaesthesia_Intra_Operative_Checklist.objects.aggregate(max_id=Max('AnaesIntOp_Id'))['max_id']
            if max_Booking_Id:
                numeric_part = int(max_Booking_Id[-5:]) + 1
            else:
                numeric_part = 1
            self.AnaesIntOp_Id = f'{prefix}{numeric_part:05}'
       
        super(Anaesthesia_Intra_Operative_Checklist, self).save(*args, **kwargs)
 

