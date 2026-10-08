from django.db import models
from django.contrib.auth import get_user_model
import uuid
import os

User = get_user_model()

def dicom_file_path(instance, filename):
    """Generate file path for DICOM files"""
    return os.path.join('dicom', 
                        instance.patient_id, 
                        instance.study_instance_uid, 
                        f"{instance.sop_instance_uid}.dcm")

class DicomPatient(models.Model):
    """Patient information from DICOM"""
    patient_id = models.CharField(max_length=100, unique=True)
    patient_name = models.CharField(max_length=200)
    patient_birthdate = models.DateField(null=True, blank=True)
    patient_sex = models.CharField(max_length=10, choices=[
        ('M', 'Male'), ('F', 'Female'), ('O', 'Other')
    ], blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient_name} ({self.patient_id})"

class DicomStudy(models.Model):
    """Study information"""
    study_instance_uid = models.CharField(max_length=100, unique=True)
    patient = models.ForeignKey(DicomPatient, on_delete=models.CASCADE, related_name='studies')
    study_date = models.DateField(null=True, blank=True)
    study_time = models.TimeField(null=True, blank=True)
    study_description = models.TextField(blank=True)
    study_modality = models.CharField(max_length=50, blank=True)
    accession_number = models.CharField(max_length=100, blank=True)
    referring_physician = models.CharField(max_length=200, blank=True)
    study_status = models.CharField(max_length=50, choices=[
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('ARCHIVED', 'Archived'),
    ], default='SCHEDULED')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['study_instance_uid']),
            models.Index(fields=['accession_number']),
            models.Index(fields=['study_date']),
        ]

class DicomSeries(models.Model):
    """Series information"""
    series_instance_uid = models.CharField(max_length=100, unique=True)
    study = models.ForeignKey(DicomStudy, on_delete=models.CASCADE, related_name='series')
    series_number = models.IntegerField(null=True, blank=True)
    series_description = models.TextField(blank=True)
    series_modality = models.CharField(max_length=50, blank=True)
    body_part_examined = models.CharField(max_length=100, blank=True)
    institution_name = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class DicomImage(models.Model):
    """Individual DICOM image"""
    sop_instance_uid = models.CharField(max_length=100, unique=True)
    series = models.ForeignKey(DicomSeries, on_delete=models.CASCADE, related_name='images')
    image_file = models.FileField(upload_to=dicom_file_path)
    instance_number = models.IntegerField(null=True, blank=True)
    image_type = models.CharField(max_length=100, blank=True)
    rows = models.IntegerField(null=True, blank=True)
    columns = models.IntegerField(null=True, blank=True)
    bits_allocated = models.IntegerField(null=True, blank=True)
    window_center = models.CharField(max_length=100, blank=True)
    window_width = models.CharField(max_length=100, blank=True)
    thumbnail = models.ImageField(upload_to='dicom/thumbnails/', null=True, blank=True)
    pixel_data = models.BinaryField(null=True, blank=True)  # Cache pixel data
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['instance_number']

class ModalityWorklist(models.Model):
    """Worklist items for modalities"""
    accession_number = models.CharField(max_length=100, unique=True)
    patient = models.ForeignKey(DicomPatient, on_delete=models.CASCADE)
    study = models.ForeignKey(DicomStudy, on_delete=models.CASCADE, null=True, blank=True)
    modality = models.CharField(max_length=50)
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    scheduled_station = models.CharField(max_length=100)
    procedure_step_id = models.CharField(max_length=100)
    procedure_description = models.TextField()
    requested_procedure_id = models.CharField(max_length=100)
    requesting_physician = models.CharField(max_length=200)
    status = models.CharField(max_length=50, choices=[
        ('SCHEDULED', 'Scheduled'),
        ('ARRIVED', 'Arrived'),
        ('STARTED', 'Started'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ], default='SCHEDULED')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Worklist: {self.accession_number}"