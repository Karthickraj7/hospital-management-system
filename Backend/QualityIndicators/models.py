import datetime
from django.db import models
from django.db.models import Max
from django.db import models


from Frontoffice.models import Patient_Detials
from Masters.models import Hospital_Detials

class MedicalErrorMaster(models.Model):
 
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    APPLICABLE_CHOICES =[
        ('IP', 'IP'),
        ('OP', 'OP'),
        ('EMERGENCY', 'EMERGENCY'),
        ('ALL','ALL'),
    ]
    
    error_type = models.CharField(max_length=100,default='other')
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES, default='low')
    applicable_for = models.CharField(max_length=50, choices=APPLICABLE_CHOICES, default='Others')
    
    class Meta:
       db_table = 'MedicalErrorMaster'

    # def __str__(self):
    #     return f"{self.get_error_type_display()} - {self.severity.capitalize()} on {self.date_occurred}"





class MedicalErrorReport(models.Model):
    # Patient Personal Details
    
    Patient_id = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,default=False)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100,blank=True, null=True)
    age = models.CharField(max_length=100,blank=True, null=True)
    dob = models.CharField(max_length=100,blank=True, null=True)
    gender = models.CharField(max_length=10,blank=True, null=True)
    nationality = models.CharField(max_length=100,blank=True, null=True)
    phone_no = models.CharField(max_length=20,blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    doctor_name = models.CharField(max_length=100,blank=True, null=True)
    doctor_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Medical Error Details
    error_id = models.CharField(max_length=50, blank=True, null=True)
    date_time_of_error = models.CharField(max_length=50, blank=True, null=True)
    medical_record_number = models.CharField(max_length=50,blank=True, null=True)
    location = models.CharField(max_length=100,blank=True, null=True)  # e.g., ward, ICU
    # medical_error_type = models.CharField(max_length=100,blank=True, null=True)
    # medical_error_description = models.TextField()

    # Action for the Errors
    description_of_error = models.TextField()
    corrective_action_taken = models.TextField()
    recommendations_for_prevention = models.TextField()
    personnel_involved = models.CharField(max_length=200,blank=True, null=True)
    severity_of_error = models.CharField(max_length=150,blank=True, null=True)
    contributing_factors = models.TextField()
    outcome_for_patient = models.CharField(max_length=200,blank=True, null=True)
    reporting_personnel = models.CharField(max_length=100,blank=True, null=True)
    supervising_personnel = models.CharField(max_length=100,blank=True, null=True)
    review_date =  models.CharField(max_length=100,blank=True, null=True)
    error_status = models.CharField(max_length=50,blank=True, null=True)
    created_by = models.CharField(max_length=30)
    # Attachments (this assumes file uploads are allowed)
    attachments = models.BinaryField(blank=True,null=True)



    class Meta :
        db_table = "MedicalErrorReport"
        
    def save(self, *args, **kwargs):
        if not self.error_id:  # Generate Mlc_Id if not set
            # Get the hospital name (clinic_name)
            clinic_name = Hospital_Detials.objects.first().Hospital_Name[:3].upper()
            
            # Fetch the maximum Mlc_Id
            max_Doctor_ID_row = MedicalErrorReport.objects.exclude(created_by="system").aggregate(max_id=Max('error_id'))['max_id']
            max_Doctor_ID = max_Doctor_ID_row if max_Doctor_ID_row else None

            # Calculate the numerical part
            numeric_part = int(str(max_Doctor_ID)[6:]) + 1 if max_Doctor_ID else 1

            # Construct the next Mlc_Id
            self.error_id = f'{clinic_name}ER{numeric_part:04}'

        super(MedicalErrorReport, self).save(*args, **kwargs)
    
    

class MedicalErrors(models.Model):
    
    
    Patient_id = models.ForeignKey(Patient_Detials,on_delete=models.CASCADE,default=False)
    medical_error_type = models.CharField(max_length=100,blank=True, null=True)
    medical_error_description = models.TextField()
    
    
    class Meta :
        db_table = "MedicalError"
        
        
        
    

class IPQATimingMaster(models.Model):
    department = models.CharField(max_length=100)
    process = models.CharField(max_length=100)
    average_time = models.FloatField(help_text="Average time in hours",default=0.0)
    status = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.department} - {self.process}'
        
    class Meta :
        db_table = "IPQATimingMaster"     
        
        