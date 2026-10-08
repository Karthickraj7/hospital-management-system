from rest_framework import serializers
from .models import *
from OutPatient.models import *
import base64


class MainDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab_Department_Detials
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SubLabDepartmentSerializer(serializers.ModelSerializer):
    # Use a primary key related field to handle the foreign key
    department = serializers.PrimaryKeyRelatedField(
        queryset=Lab_Department_Detials.objects.all()
    )

    MainDepartment_Name = serializers.SerializerMethodField()

    class Meta:
        model = SubLab_Department_Detials
        fields = "__all__"

    def get_MainDepartment_Name(self, obj):
        # Retrieve the main department name from the related department
        if obj.department:
            return obj.department.Department_Name
        return None

    def create(self, validated_data):
        return SubLab_Department_Detials.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ContainerMastersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Container_Masters
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SpecimenMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specimen_Masters
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UnitMasterSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Unit_Masters
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class MethodMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Methods_Masters
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class AntibioticMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AntibioticMaster
        fields = "__all__"

    def create(self, insert_data):
        return super().create(insert_data)

    def update(self, instance, inserted_data):
        for key, value in inserted_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class OrganismMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organism_Masters
        fields = "__all__"

    def create(self, insert_data):
        return super().create(insert_data)

    def update(self, instance, inserted_data):
        for key, value in inserted_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class RemarksMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remarks_master
        fields = "__all__"

    def create(self, insert_data):
        return super().create(insert_data)

    def update(self, instance, inserted_data):
        for key, value in inserted_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class NurseStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NurseStationMaster
        fields = "__all__"
 
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request", None)
        if request and request.method == "GET":
            self.fields["Display_Location_Name"] = serializers.CharField(
                source="Location_Name.Location_Name", read_only=True
            )
            self.fields["Display_Building_Name"] = serializers.CharField(
                source="Building_Name.Building_Name", read_only=True
            )
            self.fields["Display_Block_Name"] = serializers.CharField(
                source="Block_Name.Block_Name", read_only=True
            )
            self.fields["Display_Floor_Name"] = serializers.CharField(
                source="Floor_Name.Floor_Name", read_only=True
            )
 
    def create(self, validated_data):
        return NurseStationMaster.objects.create(**validated_data)
 
class NurseStationDetailsSerializer(serializers.ModelSerializer):
    Ward_Name = serializers.CharField(source="Wardid.Ward_Name", read_only=True)
 
    class Meta:
        model = NurseStationMasterDetails
        fields = "__all__"
 
    def create(self, validated_data):
        return NurseStationMasterDetails.objects.create(**validated_data)
 
class NurseStationRoomDetailsSerializer(serializers.ModelSerializer):
    Ward_Name = serializers.CharField(source="ward.Ward_Name", read_only=True)
    Room_Nos = serializers.SerializerMethodField()
 
    class Meta:
        model = NurseStationMasterRoomDetails
        fields = ["id", "nurse_station", "ward", "Ward_Name", "Room_Nos", "created_by", "created_at", "updated_at"]
 
    def get_Room_Nos(self, obj):
        return [{"Roomid": room.Room_Id, "RoomNo": room.RoomNo} for room in obj.rooms.all()]
 
    def create(self, validated_data):
        rooms_data = validated_data.pop('rooms', [])
        instance = NurseStationMasterRoomDetails.objects.create(**validated_data)
        if rooms_data:
            instance.rooms.set(rooms_data)
        return instance
 
 
 
class ServiceCategoryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service_Category_Masters
        fields = '__all__'
 
    def create(self, validated_data):
        return super().create(validated_data)
   
    def update(self,instance,inserted_data):
        for key,value in inserted_data.items():
            setattr(instance,key,value)
        instance.save()
        return instance

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group_Master
        fields = ["Group_Code","Group_Name"]
 
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'Group_Code') and hasattr(instance, 'Group_Name'):
            representation['code'] = instance.Group_Code
            representation['name'] = instance.Group_Name
            representation['testmethod'] = 'Group'
        return representation
   
 
 
class TestDescriptionSerializer(serializers.ModelSerializer):
    Count = serializers.SerializerMethodField()
    Amount = serializers.SerializerMethodField()
 
    class Meta:
        model = Test_Descriptions
        fields = ['Test_Code', 'Test_Name', 'Count',"Amount"]
 
    def get_Count(self, instance):
        request = self.context.get('request')
        if request:
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')
            currentdate = request.GET.get("currentdate")
            datetype = request.GET.get("datetype")
            if datetype == "Currentdate":
                return Lab_Request_Items_Details.objects.filter(
                    Test_Code=instance.Test_Code,
                    created_at__date=currentdate
                ).count()
            else:
                if from_date and to_date:
                    return Lab_Request_Items_Details.objects.filter(
                        Test_Code=instance.Test_Code,
                        created_at__date__range=[from_date, to_date]
                    ).count()
       
        return 0  
   
    def get_Amount(self, instance):
        Amountinstance = Testmaster_Cost_List.objects.filter(Test_Code=instance.Test_Code)
        if Amountinstance:
            return Amountinstance[0].Basic

class TestandgroupMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test_Descriptions
        fields = ["Test_Code", "Test_Name"]
 
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'Test_Code') and hasattr(instance, 'Test_Name'):
            representation['code'] = instance.Test_Code
            representation['name'] = instance.Test_Name
            representation['testmethod'] = 'Individual'
        return representation
   
 
class TestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab_Request_Items_Details
        fields = "__all__"

 
class Labreports(serializers.ModelSerializer):
    class Meta:
        model=Lab_Request_Details
        fields="__all__"

    def to_representation(self, instance):
        prem =  super().to_representation(instance)
        prem["Report"] = f"""data:application/pdf;base64,{base64.b64encode(instance.Report).decode()}""" if instance.Report else None
        item = Lab_Request_Items_Details.objects.filter(Request=instance.Request_Id)
        prem["ItemDetails"] = TestRequestSerializer(item,many=True).data
        return prem
 
class BillingHistory(serializers.ModelSerializer):
    class Meta:
        model = General_Billing_Table_Detials
        fields = "__all__"

class TherapyTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = TherapyType_Master
        fields = ['TherapyType_Id', 'TherapyType_Name']  
       
       
class TherapyTypeDetailsSerializer(serializers.ModelSerializer):
    therapytype_id = serializers.IntegerField(write_only=True)
    TherapyType_Name = TherapyTypeMasterSerializer(read_only=True)
 
    class Meta:
        model = TherapyType_Detials
        fields = [
            'Therapy_Id',
            'therapytype_id',     # <-- Accept ID from frontend
            'TherapyType_Name',   # <-- Show nested object in response
            'Therapy_Name',
            'Description',
            'IsMedications',
            'IpAmount',
            'OpAmount',
            'OldIpAmount',
            'OldOpAmount',
            # 'IsGst',
            # 'GSTvalue',
            'Status',
            'created_by',
            'created_at',
            'updated_at'
        ]
 
    def create(self, validated_data):
        therapytype_id = validated_data.pop('therapytype_id')
        validated_data['TherapyType_Name_id'] = therapytype_id
        return super().create(validated_data)
 
    def update(self, instance, validated_data):
        therapytype_id = validated_data.pop('therapytype_id', None)
        if therapytype_id is not None:
            validated_data['TherapyType_Name_id'] = therapytype_id
        return super().update(instance, validated_data)
    
   
class microscopyserializer(serializers.ModelSerializer):
    class Meta:
        model = Microscopytype
        fields = "__all__"
 
    def create(self, validated_data):
        return super().create(validated_data)
 
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
 
 
 
 