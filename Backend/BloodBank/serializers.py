from rest_framework import serializers
from .models import *



class BbQuestionSerializer(serializers.ModelSerializer):
    code = serializers.CharField(read_only=True)
    class Meta:
        model = BBQuestionGroup
        fields = ['id','question','code','status']

class BagTypeSerializer(serializers.ModelSerializer):
    code = serializers.CharField(read_only=True)
    class Meta:
        model = BagType
        fields = ['code','id','Name','expiry_date']

class TitreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Titre
        fields = ['id', 'description', 'order', 'status']
        

class BloodBankMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodBankMaster
        fields = ['id', 'name', 'address', 'contact_number', 'email','Liscence_no','expiry_date','Renewal_date', 'status']
        
        
        
class BloodGroupDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodGroupMaster
        fields = ['id','blood_type', 'rh_type']
        
class DonorMasterSerializer(serializers.ModelSerializer):
    DNR_ID = serializers.CharField(read_only=True)  # ✅ Include this
     
    blood_group = BloodGroupDetailsSerializer(read_only=True)
    BloodGroup_Id = serializers.PrimaryKeyRelatedField(
        queryset=BloodGroupMaster.objects.all(), source='blood_type', write_only=True
    )

    class Meta:
        model = DonorMaster
        fields = ['DNR_ID',  # 👈 this replaces `id`
'name', 'age', 'gender', 'blood_group', 'BloodGroup_Id',
                  'contact_number','contact_number2', 'email', 'address', 'status']

            