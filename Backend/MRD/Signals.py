from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from .models import *
from Frontoffice.models import *
from Masters.models import *
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist




@receiver(post_save, sender=Patient_Detials)
def MRD_patient_list(sender, instance, created, **kwargs):
    print('Signal received for creating MRD details')
    try:
        if created:         
 
            print('jthfnfhtn',instance)
 
            if instance.PatientId :
                depins = Department_Detials.objects.filter(Department_Name='MRD').first()
 
                MRD_Patient.objects.create(
                   Patient_Id = instance,
                   First_Name = instance.FirstName,
                   created_by = instance.created_by,
                   Current_Location = depins,

                )

                print('Signal created for MRD details')
    except ObjectDoesNotExist as e:
        print(f"Error: {e}")
        










