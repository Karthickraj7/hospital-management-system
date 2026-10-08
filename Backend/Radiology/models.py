from django.db import models
from django.utils import timezone
from Masters.models import *






class RadiologyDocument(models.Model):
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey(RadiologyNames_Details, on_delete=models.CASCADE, to_field='Radiology_Id',null=True,blank=True)
    doctorName =  models.ForeignKey(Doctor_Personal_Form_Detials, on_delete=models.CASCADE,null=True, blank=True)
    fileName = models.CharField(max_length=255)
    file = models.FileField(upload_to='radiology_docs/', null=True, blank=True)
    content = models.BinaryField(blank=True, null=True)
    html_content = models.TextField(blank=True, null=True) 
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
       db_table = 'RadiologyDocument'

    def __str__(self):
        try:
            return f"{self.department.Radiology_Name} - {self.doctorName} - {self.fileName}"
        except:
            return f"Document {self.id} - {self.fileName}"



