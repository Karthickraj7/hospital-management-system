# from rest_framework import serializers
# from .models import RadiologyDocument, RadiologyNames_Details, Doctor_Personal_Form_Detials

# class RadiologyDocumentSerializer(serializers.ModelSerializer):
#     department = serializers.CharField(source='department.Radiology_Id')
#     doctorName = serializers.CharField(source='doctorName.First_Name', allow_null=True)
#     doctorId = serializers.CharField(source='doctorName.Doctor_ID', allow_null=True)
    
#     class Meta:
#         model = RadiologyDocument
#         fields = ['id', 'department', 'doctorId', 'doctorName', 'fileName', 'created_by', 'created_at', 'updated_at']


from rest_framework import serializers
from .models import RadiologyDocument, RadiologyNames_Details, Doctor_Personal_Form_Detials
 
class RadiologyDocumentSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.Radiology_Id')
    departmentname = serializers.CharField(source='department.Radiology_Name')
    doctorName = serializers.CharField(source='doctorName.First_Name', allow_null=True)
    doctorId = serializers.CharField(source='doctorName.Doctor_ID', allow_null=True)
   
    class Meta:
        model = RadiologyDocument
        fields = ['id', 'department', 'doctorId', 'doctorName','departmentname', 'fileName', 'created_by', 'created_at', 'updated_at']