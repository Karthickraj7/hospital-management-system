import re
from django.db import models
from Masters.models import *

# Create your models here.
class BloodGroupMaster(models.Model):
    BLOOD_TYPES = [
        ('A+', 'A+'),
        ('B+', 'B+'),
        ('AB+', 'AB+'),
        ('O+', 'O+'),
        ('A-', 'A-'),
        ('B-', 'B-'),
        ('AB-', 'AB-'),
        ('O-', 'O-'),
    ]

    RH_TYPES = [
        ('+', 'Positive'),
        ('-', 'Negative'),
    ]

    blood_type = models.CharField(max_length=10, choices=BLOOD_TYPES)
    rh_type = models.CharField(max_length=10, choices=RH_TYPES)

    class Meta:
        unique_together = ('blood_type', 'rh_type')

    def __str__(self):
        return f"{self.blood_type}{self.rh_type}"



class BBQuestionGroup(models.Model):
    code = models.CharField(max_length=10)
    question = models.TextField()
    # order = models.IntegerField()
    created_by = models.CharField(max_length=30,default=0)
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    class Meta:
        db_table = 'BBQuestionGroup'
        
    def save(self, *args, **kwargs):
        if not self.code:
            # 1) Build the clinic prefix
            clinic = Hospital_Detials.objects.first().Hospital_Name[:3].upper()
            prefix = f"{clinic}QAS"

            # 2) Find the last donor whose ID starts with that prefix
            last = (BBQuestionGroup.objects
                    .exclude(created_by="system")
                    .filter(code__startswith=prefix)
                    .order_by("-code")
                    .first())

            # 3) Extract numeric suffix via regex
            if last and last.code:
                match = re.search(rf"^{prefix}(\d+)$", last.code)
                last_num = int(match.group(1)) if match else 0
            else:
                last_num = 0

            # 4) Increment and zero-pad to 4 digits
            next_num = last_num + 1
            self.code = f"{prefix}{next_num:04}"

        # 5) Call the correct super
        super(BBQuestionGroup, self).save(*args, **kwargs)      
        






class BagType(models.Model):
    code = models.CharField(max_length=100, unique=True)
    Name = models.CharField(max_length=255)
    # components = models.PositiveIntegerField()
    expiry_date = models.CharField(max_length=50)
    created_by = models.CharField(max_length=30,default=0)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.Name} ({self.Name})"
    class Meta:
        db_table = 'BagType'
    def save(self, *args, **kwargs):
        if not self.code:
            # 1) Build the clinic prefix
            clinic = Hospital_Detials.objects.first().Hospital_Name[:3].upper()
            prefix = f"{clinic}BG"

            # 2) Find the last donor whose ID starts with that prefix
            last = (BagType.objects
                    .exclude(created_by="system")
                    .filter(code__startswith=prefix)
                    .order_by("-code")
                    .first())

            # 3) Extract numeric suffix via regex
            if last and last.code:
                match = re.search(rf"^{prefix}(\d+)$", last.code)
                last_num = int(match.group(1)) if match else 0
            else:
                last_num = 0

            # 4) Increment and zero-pad to 4 digits
            next_num = last_num + 1
            self.code = f"{prefix}{next_num:04}"

        # 5) Call the correct super
        super(BagType, self).save(*args, **kwargs)  


class Titre(models.Model):
    description = models.CharField(max_length=255)
    order = models.PositiveIntegerField()
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.description
        
    class Meta:
        db_table = 'Titre'    
        
        
# from django.db import models

class BloodBankMaster(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    address = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=50)
    Liscence_no = models.CharField(max_length=50,unique=True)
    expiry_date = models.CharField(max_length=50)
    Renewal_date = models.CharField(max_length=50)
    order = models.IntegerField(default=0)
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name
    class Meta:
        db_table = 'BloodBankMaster'     
        


class DonorMaster(models.Model):
    DNR_ID = models.CharField(primary_key=True,max_length=30)
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    blood_group = models.ForeignKey(BloodGroupMaster,on_delete=models.CASCADE,default=1)
    contact_number = models.CharField(max_length=15)
    contact_number2 = models.CharField(max_length=15)
    
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.blood_group})"        
    
    
    class Meta:
        db_table = 'DonorMaster'
        
    def save(self, *args, **kwargs):
        if not self.DNR_ID:
            # 1) Build the clinic prefix
            clinic = Hospital_Detials.objects.first().Hospital_Name[:3].upper()
            prefix = f"{clinic}BLDR"

            # 2) Find the last donor whose ID starts with that prefix
            last = (DonorMaster.objects
                    .exclude(created_by="system")
                    .filter(DNR_ID__startswith=prefix)
                    .order_by("-DNR_ID")
                    .first())

            # 3) Extract numeric suffix via regex
            if last and last.DNR_ID:
                match = re.search(rf"^{prefix}(\d+)$", last.DNR_ID)
                last_num = int(match.group(1)) if match else 0
            else:
                last_num = 0

            # 4) Increment and zero-pad to 4 digits
            next_num = last_num + 1
            self.DNR_ID = f"{prefix}{next_num:04}"

        # 5) Call the correct super
        super(DonorMaster, self).save(*args, **kwargs)  
        
        