from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import (Patient_Appointment_Registration_Detials,Patient_IP_Registration_Detials,
Patient_Laboratory_Registration_Detials,Insuranse_Patient_Entery_Details,Patient_Diagnosis_Registration_Detials,Patient_Casuality_Registration_Detials, Client_Patient_Entry_Details)
 
 
 
@receiver(post_save, sender=Patient_Appointment_Registration_Detials)
def create_insurance_OP_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Insurance':
        Insuranse_Patient_Entery_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Appointment_Registration_Detials),
            object_id=instance.pk,
            Created_by=instance.created_by,
            Patient_ServiesType='OP'
        )
 
@receiver(post_save, sender=Patient_IP_Registration_Detials)
def create_insurance_IP_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Insurance':
        Insuranse_Patient_Entery_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_IP_Registration_Detials),
            object_id=instance.pk,
            Created_by=instance.created_by,
            Patient_ServiesType='IP'
        )
 
 
@receiver(post_save, sender=Patient_Casuality_Registration_Detials)
def create_insurance_Casuality_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Insurance':
        Insuranse_Patient_Entery_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Casuality_Registration_Detials),
            object_id=instance.pk,
            Created_by=instance.created_by,
            Patient_ServiesType='Casuality'
        )
 
 
@receiver(post_save, sender=Patient_Diagnosis_Registration_Detials)
def create_insurance_Diagnosis_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Insurance':
        Insuranse_Patient_Entery_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Diagnosis_Registration_Detials),
            object_id=instance.pk,
            Created_by=instance.created_by,
            Patient_ServiesType='Diagnosis'
        )
 
@receiver(post_save, sender=Patient_Laboratory_Registration_Detials)
def create_insurance_Laboratory_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Insurance':
        Insuranse_Patient_Entery_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Laboratory_Registration_Detials),
            object_id=instance.pk,
            Created_by=instance.created_by,
            Patient_ServiesType='Laboratory'
        )
 
 
 
 
@receiver(post_save, sender=Patient_Appointment_Registration_Detials)
def create_client_OP_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Client':
        Client_Patient_Entry_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Appointment_Registration_Detials),
            object_id=instance.pk,
            Patient_ServiesType='OP'
        )
 
 
@receiver(post_save, sender=Patient_IP_Registration_Detials)
def create_client_IP_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Client':
        Client_Patient_Entry_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_IP_Registration_Detials),
            object_id=instance.pk,
            Patient_ServiesType='IP'
 
        )
 
 
@receiver(post_save, sender=Patient_Casuality_Registration_Detials)
def create_client_Casuality_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Client':
        Client_Patient_Entry_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Casuality_Registration_Detials),
            object_id=instance.pk,
            Patient_ServiesType='Casuality'
 
        )
 
@receiver(post_save, sender=Patient_Diagnosis_Registration_Detials)
def create_client_Diagnosis_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Client':
        Client_Patient_Entry_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Diagnosis_Registration_Detials),
            object_id=instance.pk,
            Patient_ServiesType='Diagnosis'
 
        )  
 
 
@receiver(post_save, sender=Patient_Laboratory_Registration_Detials)
def create_client_Laboratory_patient_entry(sender, instance, created, **kwargs):
    if created and instance.PatientCategory == 'Client':
        Client_Patient_Entry_Details.objects.create(
            content_type=ContentType.objects.get_for_model(Patient_Laboratory_Registration_Detials),
            object_id=instance.pk,
            Patient_ServiesType='Laboratory'
        )
 