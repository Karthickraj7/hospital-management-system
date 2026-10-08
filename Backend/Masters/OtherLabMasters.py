import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import *
from PIL import Image
from io import BytesIO
import base64
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.http import JsonResponse
import json
from django.db.models import Max
from django.http import JsonResponse
from django.db.models import Max
import re
from django.http import JsonResponse
import csv
import openpyxl
import pandas as pd
from django.forms.models import model_to_dict
from django.db import transaction
from django.db import connection
from django.db.models import F, Q
from django.db.models import Case, When, Value, IntegerField
from django.db.models import OuterRef, Subquery
from .serializers import *
from django.db import connection as db

def Common_Function_For_Genarate_Next_Code_For_6Digit(max_code):
    numeric_part = max_code[-6:]
    prefix = max_code[:-6]
    next_number = int(numeric_part) + 1
    new_code = f"{prefix}{next_number:06d}"

    return new_code


def get_NextAntibiotic_Code(max_anti_biotic_group_code, max_anti_biotic_code):
    numeric_part_group = max_anti_biotic_group_code[-3:]
    prefix_group = max_anti_biotic_group_code[:-3]

    numeric_part_code = max_anti_biotic_code[-3:]
    prefix_code = max_anti_biotic_code[:-3]

    next_number_group = int(numeric_part_group) + 1
    next_number_code = int(numeric_part_code) + 1

    new_anti_biotic_group_code = f"{prefix_group}{next_number_group:03d}"
    new_anti_biotic_code = f"{prefix_code}{next_number_code:03d}"

    return new_anti_biotic_group_code, new_anti_biotic_code


def Genarate_Next_Code_4digit(max_code):
    numeric_part = max_code[-4:]
    prefix = max_code[:-4]
    next_number = int(numeric_part) + 1
    new_code = f"{prefix}{next_number:04d}"

    return new_code


def Get_All_Other_Masters_PrimaryCodes(request):
    if request.method == "GET":
        try:
            # Get the 'Type' parameter from the request
            Type = request.GET.get("Type")
            print("Type :", Type)
            if Type == "LabDepartment":
                # Fetch all department codes with the specified prefix pattern
                max_code = Lab_Department_Detials.objects.all().aggregate(
                    Max("Department_Code")
                )["Department_Code__max"]
                print("max_code :", max_code)
                if max_code:
                    new_department_code = (
                        Common_Function_For_Genarate_Next_Code_For_6Digit(max_code)
                    )
                else:
                    new_department_code = "LDC000001"

                return JsonResponse(
                    {"success": True, "department_code": new_department_code},
                    status=200,
                )
            elif Type == "LabSubDepartment":
                # Fetch all department codes with the specified prefix pattern
                max_code = SubLab_Department_Detials.objects.all().aggregate(
                    Max("SubDepartment_Code")
                )["SubDepartment_Code__max"]
                print("max_code :", max_code)
                if max_code:
                    new_sub_department_code = (
                        Common_Function_For_Genarate_Next_Code_For_6Digit(max_code)
                    )
                else:
                    new_sub_department_code = "LSDC000001"

                return JsonResponse(
                    {"success": True, "Subdepartment_code": new_sub_department_code},
                    status=200,
                )
            elif Type == "UnitMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Unit_Masters.objects.all().aggregate(Max("Unit_Code"))[
                    "Unit_Code__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Unit_Code = Common_Function_For_Genarate_Next_Code_For_6Digit(
                        max_code
                    )
                else:
                    new_Unit_Code = "LUC000001"

                return JsonResponse(
                    {"success": True, "unitCode": new_Unit_Code},
                    status=200,
                )
            elif Type == "Microscopytype":
                # Fetch all department codes with the specified prefix pattern
                max_code = Microscopytype.objects.all().aggregate(Max("microscopy_Code"))[
                    "microscopy_Code__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Micro_Code = Common_Function_For_Genarate_Next_Code_For_6Digit(
                        max_code
                    )
                else:
                    new_Micro_Code = "MIC000001"

                return JsonResponse(
                    {"success": True, "microcode": new_Micro_Code},
                    status=200,
                )
            elif Type == "ContainerMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Container_Masters.objects.all().aggregate(
                    Max("Container_Code")
                )["Container_Code__max"]
                print("max_code :", max_code)
                if max_code:
                    new_Container_Code = (
                        Common_Function_For_Genarate_Next_Code_For_6Digit(max_code)
                    )
                else:
                    new_Container_Code = "LCC000001"

                return JsonResponse(
                    {"success": True, "container_code": new_Container_Code},
                    status=200,
                )
            elif Type == "SpecimenMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Specimen_Masters.objects.all().aggregate(
                    Max("Specimen_Code")
                )["Specimen_Code__max"]
                print("max_code :", max_code)
                if max_code:
                    new_Specimen_Code = (
                        Common_Function_For_Genarate_Next_Code_For_6Digit(max_code)
                    )
                else:
                    new_Specimen_Code = "LSC000001"

                return JsonResponse(
                    {"success": True, "Specimen_Code": new_Specimen_Code},
                    status=200,
                )
            elif Type == "MethodsMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Methods_Masters.objects.all().aggregate(Max("Method_Code"))[
                    "Method_Code__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Method_Code = Common_Function_For_Genarate_Next_Code_For_6Digit(
                        max_code
                    )
                else:
                    new_Method_Code = "LMC000001"

                return JsonResponse(
                    {"success": True, "method_code": new_Method_Code},
                    status=200,
                )
            elif Type == "AntibioticMaster":
                # Fetch the maximum values for anti_biotic_group_code and anti_biotic_code
                max_anti_biotic_group_code = AntibioticMaster.objects.all().aggregate(
                    Max("anti_biotic_group_code")
                )["anti_biotic_group_code__max"]
                max_anti_biotic_code = AntibioticMaster.objects.all().aggregate(
                    Max("anti_biotic_code")
                )["anti_biotic_code__max"]

                print("max_anti_biotic_group_code:", max_anti_biotic_group_code)
                print("max_anti_biotic_code:", max_anti_biotic_code)

                if max_anti_biotic_group_code and max_anti_biotic_code:
                    new_anti_biotic_group_code, new_anti_biotic_code = (
                        get_NextAntibiotic_Code(
                            max_anti_biotic_group_code, max_anti_biotic_code
                        )
                    )
                else:
                    new_anti_biotic_group_code = "AG001"
                    new_anti_biotic_code = "A001"

                data = {
                    "anti_biotic_group_code": new_anti_biotic_group_code,
                    "anti_biotic_code": new_anti_biotic_code,
                }
                return JsonResponse(
                    {"success": True, "data": data},
                    status=200,
                )
            elif Type == "OrganismMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Organism_Masters.objects.all().aggregate(
                    Max("Organism_Code")
                )["Organism_Code__max"]
                print("max_code :", max_code)
                if max_code:
                    new_Organism_Code = (
                        Common_Function_For_Genarate_Next_Code_For_6Digit(max_code)
                    )
                else:
                    new_Organism_Code = "LOC000001"

                return JsonResponse(
                    {"success": True, "Organism_Code": new_Organism_Code},
                    status=200,
                )
            elif Type == "LabRemarksData":
                # Fetch all department codes with the specified prefix pattern
                max_code = LabRemarksMaster.objects.all().aggregate(Max("LabRemarkID"))[
                    "LabRemarkID__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_LabRemarkID = Common_Function_For_Genarate_Next_Code_For_6Digit(
                        max_code
                    )
                else:
                    new_LabRemarkID = "LRM000001"

                return JsonResponse(
                    {"success": True, "LabRemarkID": new_LabRemarkID},
                    status=200,
                )
            elif Type == "RemarksMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Remarks_master.objects.all().aggregate(Max("Remark_Id"))[
                    "Remark_Id__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Remark_Id = Common_Function_For_Genarate_Next_Code_For_6Digit(
                        max_code
                    )
                else:
                    new_Remark_Id = "LRI000001"

                return JsonResponse(
                    {"success": True, "Remark_Id": new_Remark_Id},
                    status=200,
                )
            elif Type == "ReasonMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Reason_master.objects.all().aggregate(Max("Reason_Id"))[
                    "Reason_Id__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Reason_Id = Common_Function_For_Genarate_Next_Code_For_6Digit(
                        max_code
                    )
                else:
                    new_Reason_Id = "LRC000001"

                return JsonResponse(
                    {"success": True, "Reason_Id": new_Reason_Id},
                    status=200,
                )
            elif Type == "QualificationMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Qualification_master.objects.all().aggregate(
                    Max("Qualification_Id")
                )["Qualification_Id__max"]
                print("max_code :", max_code)
                if max_code:
                    new_Qualification_Id = (
                        Common_Function_For_Genarate_Next_Code_For_6Digit(max_code)
                    )
                else:
                    new_Qualification_Id = "LRC000001"

                return JsonResponse(
                    {"success": True, "Qualification_Id": new_Qualification_Id},
                    status=200,
                )
            elif Type == "TestMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Test_Descriptions.objects.all().aggregate(Max("Test_Code"))[
                    "Test_Code__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Test_Code = Genarate_Next_Code_4digit(max_code)
                else:
                    new_Test_Code = "LTC0001"

                return JsonResponse(
                    {"success": True, "TestCode": new_Test_Code},
                    status=200,
                )
            elif Type == "ExternalLabMaster":
                max_code = External_Lab_Master.objects.all().aggregate(Max("LabCode"))[
                    "LabCode__max"
                ]
                print("max_code :", max_code)
                if max_code:
                    new_Lab_Code = Genarate_Next_Code_4digit(max_code)
                else:
                    new_Lab_Code = "LAB0001"

                return JsonResponse(
                    {"success": True, "Lab_Code": new_Lab_Code},
                    status=200,
                )
            elif Type == "ReferDoctorMaster":
                max_code = Refering_Doctor_Details.objects.all().aggregate(
                    Max("DoctorID")
                )["DoctorID__max"]
                print("max_code :", max_code)
                if max_code:
                    new_DoctorID = Genarate_Next_Code_4digit(max_code)
                else:
                    new_DoctorID = "RD0001"

                return JsonResponse(
                    {"success": True, "new_DoctorID": new_DoctorID},
                    status=200,
                )
            elif Type == "GroupMaster":
                # Fetch all department codes with the specified prefix pattern
                max_code = Group_Master.objects.all().aggregate(Max("Group_Code"))[
                    "Group_Code__max"
                ]
 
                if max_code:
                    new_Group_Code = Genarate_Next_Code_4digit(max_code)
                else:
                    new_Group_Code = "LGM0001"

                return JsonResponse(
                    {"success": True, "GroupCode": new_Group_Code},
                    status=200,
                )
            
            else:
                return JsonResponse({"message": "Type Required"})

        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse(
                {"success": False, "message": "An internal error occurred."}, status=500
            )


# @csrf_exempt
# def All_Other_Lab_Masters_POST_AND_GET(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             print('data :',data)
            
#             if isinstance(data, dict):
#                 Type = data.get("Type")
#             elif isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
#                 Type = data[0].get("Type")
#             else:
#                 Type = None
#             print('Type :',Type)
            
#             ResponseMsg = data.get("ResponseMsg")
            
#             if Type == "MainDepartment":
#                 is_edit = data.get('isEdit')
#                 department_code = data.get('Department_Code')

#                 if is_edit:
#                     try:
#                         instance = Lab_Department_Detials.objects.get(Department_Code=department_code)
#                         print('instance :', instance)
#                         serializers = MainDepartmentSerializer(instance, data=data, partial=True)  # partial=True allows partial updates
#                         print('serializers :', serializers)
#                         if serializers.is_valid():
#                             serializers.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             print('error :', serializers.errors)
#                             return JsonResponse(serializers.errors)
#                     except Lab_Department_Detials.DoesNotExist:
#                         return JsonResponse({"error": "Department not found."})
#                 else:
#                     serializers = MainDepartmentSerializer(data=data)
#                     print('serializers :', serializers)
#                     if serializers.is_valid():
#                         serializers.save()
#                         return JsonResponse({"success": f"{ResponseMsg} successfully."})
#                     else:
#                         print('error :', serializers.errors)
#                         return JsonResponse(serializers.errors)
#             elif Type == "SubMainDepartment":
#                 is_edit = data.get('isEdit')
#                 SubDepartment_Code = data.get('SubDepartment_Code')

#                 if is_edit:
#                     try:
#                         # Fetch the existing instance
#                         instance = SubLab_Department_Detials.objects.get(SubDepartment_Code=SubDepartment_Code)
#                         serializer = SubLabDepartmentSerializer(instance, data=data, partial=True)
#                         if serializer.is_valid():
#                             serializer.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             print(serializer.errors)
#                             return JsonResponse(serializer.errors)
#                     except SubLab_Department_Detials.DoesNotExist:
#                         return JsonResponse({"error": "Sub Department not found."})
#                 else:
#                     # Handle create case
#                     serializer = SubLabDepartmentSerializer(data=data)
#                     if serializer.is_valid():
#                         serializer.save()
#                         return JsonResponse({"success": f"{ResponseMsg} successfully."})
#                     else:
#                         return JsonResponse(serializer.errors)
#             elif Type == "ContainerMaster":
#                 is_edit = data.get('isEdit')
#                 Container_Code = data.get('Container_Code')

#                 if is_edit:
#                     try:
#                         instance = Container_Masters.objects.get(Container_Code=Container_Code)
#                         print('instance :', instance)
#                         serializers = ContainerMastersSerializer(instance, data=data, partial=True)  # partial=True allows partial updates
#                         print('serializers :', serializers)
#                         if serializers.is_valid():
#                             serializers.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             print('error :', serializers.errors)
#                             return JsonResponse(serializers.errors)
#                     except Container_Masters.DoesNotExist:
#                         return JsonResponse({"error": "Department not found."})
#                 else:
#                     serializers = ContainerMastersSerializer(data=data)
#                     print('serializers :', serializers)
#                     if serializers.is_valid():
#                         serializers.save()
#                         return JsonResponse({"success": f"{ResponseMsg} successfully."})
#                     else:
#                         print('error :', serializers.errors)
#                         return JsonResponse(serializers.errors)
#             elif Type == "UnitMaster":
#                 is_edit = data.get('isEdit')
#                 Unit_Code = data.get('Unit_Code')

#                 if is_edit:
#                     try:
#                         instance = Unit_Masters.objects.get(Unit_Code=Unit_Code)
#                         serilizer = UnitMasterSerilizer(instance,data=data,partial=True)
#                         if serilizer.is_valid():
#                             serilizer.save()
#                             return JsonResponse({"success":f"{ResponseMsg} Successfully"})
#                         else:
#                             return JsonResponse(serializer.errors)
#                     except Unit_Masters.DoesNotExist:
#                         return JsonResponse({"warn":"Unit Not Found"})
#                 else:
#                     serilizer = UnitMasterSerilizer(data=data)
#                     if serilizer.is_valid():
#                         serilizer.save()
#                         return JsonResponse({"success":f"{ResponseMsg} Successfully"})
#                     else:
#                         return JsonResponse(serilizer.errors)             
#             elif Type == "SpecimenMaster":
#                 is_edit = data.get('isEdit')
#                 Specimen_Code = data.get('Specimen_Code')

#                 if is_edit:
#                     try:
#                         instance = Specimen_Masters.objects.get(Specimen_Code=Specimen_Code)
#                         print('instance :', instance)
#                         serializers = SpecimenMasterSerializer(instance, data=data, partial=True)  # partial=True allows partial updates
#                         print('serializers :', serializers)
#                         if serializers.is_valid():
#                             serializers.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             print('error :', serializers.errors)
#                             return JsonResponse(serializers.errors)
#                     except Container_Masters.DoesNotExist:
#                         return JsonResponse({"error": "Specimen not found."})
#                 else:
#                     serializers = SpecimenMasterSerializer(data=data)
#                     print('serializers :', serializers)
#                     if serializers.is_valid():
#                         serializers.save()
#                         return JsonResponse({"success": f"{ResponseMsg} successfully."})
#                     else:
#                         print('error :', serializers.errors)
#                         return JsonResponse(serializers.errors)
#             elif Type == "MethodsMaster":
#                 is_edit = data.get('isEdit')
#                 Method_Code = data.get('Method_Code')

#                 if is_edit:
#                     try:
#                         instance = Methods_Masters.objects.get(Method_Code=Method_Code)
#                         serilizer = MethodMasterSerializer(instance,data=data,partial=True)
#                         if serilizer.is_valid():
#                             serilizer.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             return JsonResponse(serilizer.errors)
#                     except Methods_Masters.DoesNotExist:
#                         return JsonResponse({"warn":"Method Not Found"})
#                 else:
#                     serializer = MethodMasterSerializer(data=data)
#                     if serializer.is_valid():
#                         serializer.save()
#                         return JsonResponse({"success": f"{ResponseMsg} Successfullly"})
#                     else:
#                         return JsonResponse(serializer.errors)                 
#             elif Type == "AntibioticMaster":
#                 is_edit = data.get('isEdit')
#                 anti_biotic_group_code = data.get('anti_biotic_group_code')
#                 anti_biotic_code = data.get("anti_biotic_code")
#                 print('is_edit :',is_edit)
#                 if is_edit:
#                     try:
#                         instance = AntibioticMaster.objects.get(anti_biotic_code=anti_biotic_code,anti_biotic_group_code=anti_biotic_group_code)
#                         serializer = AntibioticMasterSerializer(instance,data=data,partial=True)
#                         if serializer.is_valid():
#                             serializer.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             print('wrro :',serializer.errors)
#                             return JsonResponse(serializer.errors)
#                     except AntibioticMaster.DoesNotExist:
#                         return JsonResponse({"warn": "Antiobiotic Not Found"})
#                 else:
#                     last_anti_biotic_id = AntibioticMaster.objects.aggregate(
#                     Max("anti_biotic_id")
#                     )["anti_biotic_id__max"]
#                     next_anti_biotic_id = 1 if last_anti_biotic_id is None else int(last_anti_biotic_id) + 1

#                     data["anti_biotic_id"] = next_anti_biotic_id
                    
#                     instance = AntibioticMasterSerializer(data=data)
#                     if instance.is_valid():
#                         instance.save()
#                         return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                     else:
#                         print('error :',instance.errors)
#                         return JsonResponse(instance.errors)

#             elif Type == "OrganismMaster":
#                 is_edit = data.get('isEdit')
#                 Organism_Code = data.get('Organism_Code')
                
#                 if is_edit:
#                     try:
#                         exist_instance = Organism_Masters.objects.get(Organism_Code=Organism_Code)
#                         serializer = OrganismMasterSerializer(exist_instance,data=data,partial=True)
#                         if serializer.is_valid():
#                             serializer.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             return JsonResponse({"warn":serializer.errors})   
#                     except Organism_Masters.DoesNotExist:
#                         return JsonResponse({"warn": "Organism Not Found"})
#                 else:
#                     new_instance = OrganismMasterSerializer(data=data)
#                     if new_instance.is_valid():
#                         new_instance.save()
#                         return JsonResponse({"success": f"{ResponseMsg} Successfully"}) 
#                     else:
#                         return JsonResponse({"warn": new_instance.errors})            
                
#             elif Type == "LabRemarksData":
#                 # Get department data from the request
#                 LabRemarks = data.get("LabRemarks")
#                 LabRemarkID = data.get("LabRemarkID")
#                 createdby = data.get("createdby")
#                 Department = data.get("Department")

#                 if not LabRemarks or not LabRemarkID:
#                     return JsonResponse(
#                         {
#                             "success": False,
#                             "message": "Organism name and code are required.",
#                         },
#                         status=400,
#                     )

#                 # Check if a department with the same code exists
#                 existing_Remark = LabRemarksMaster.objects.filter(
#                     LabRemarkID=LabRemarkID
#                 ).first()
#                 if existing_Remark:
#                     # Update existing record
#                     existing_Remark.LabRemarks = LabRemarks
#                     existing_Remark.Department = Department
#                     existing_Remark.save()
#                     message = "LabRemarks updated successfully."
#                 else:
#                     # Create new record
#                     LabRemarksMaster.objects.create(
#                         LabRemarkID=LabRemarkID,
#                         Department=Department,
#                         LabRemarks=LabRemarks,
#                         created_by=createdby,
#                     )
#                     message = "New LabRemarks created successfully."

#                 return JsonResponse({"success": True, "message": message}, status=200)
#             elif Type == "RemarksMaster":
#                 is_edit = data.get('isEdit')
#                 Remark_Id = data.get('Remark_Id')
                
                
#                 if is_edit:
#                     try:
#                         exist_instance = Remarks_master.objects.get(Remark_Id=Remark_Id)
#                         serializer = RemarksMasterSerializer(exist_instance,data=data,partial=True)
#                         if serializer.is_valid():
#                             serializer.save()
#                             return JsonResponse({"success": f"{ResponseMsg} Successfully"})
#                         else:
#                             return JsonResponse({"warn":serializer.errors})   
#                     except Remarks_master.DoesNotExist:
#                         return JsonResponse({"warn": "Remark Not Found"})
#                 else:
#                     new_instance = RemarksMasterSerializer(data=data)
#                     if new_instance.is_valid():
#                         new_instance.save()
#                         return JsonResponse({"success": f"{ResponseMsg} Successfully"}) 
#                     else:
#                         return JsonResponse({"warn": new_instance.errors}) 
#             elif Type == "ReasonMaster":
#                 # Get department data from the request
#                 ReasonId = data.get("ReasonID")
#                 Reason = data.get("Reason")
#                 createdby = data.get("createdby")

#                 if not ReasonId or not Reason:
#                     return JsonResponse(
#                         {
#                             "success": False,
#                             "message": "Reason and Id are required.",
#                         },
#                         status=400,
#                     )

#                 # Check if a department with the same code exists
#                 existing_Reason = Reason_master.objects.filter(
#                     Reason_Id=ReasonId
#                 ).first()

#                 if existing_Reason:
#                     # Update existing record
#                     existing_Reason.Reason = Reason
#                     existing_Reason.save()
#                     message = "Reason updated successfully."
#                 else:
#                     # Create new record
#                     Reason_master.objects.create(
#                         Reason_Id=ReasonId,
#                         Reason=Reason,
#                         created_by=createdby,
#                     )
#                     message = "New Reason created successfully."

#                 return JsonResponse({"success": True, "message": message}, status=200)
#             elif Type == "QualificationMaster":
#                 # Get department data from the request
#                 QualificationId = data.get("QualificationID")
#                 Qualification = data.get("Qualification")
#                 createdby = data.get("createdby")

#                 if not QualificationId or not Qualification:
#                     return JsonResponse(
#                         {
#                             "success": False,
#                             "message": "Qualification and Id are required.",
#                         },
#                         status=400,
#                     )

#                 # Check if a department with the same code exists
#                 existing_Qualification = Qualification_master.objects.filter(
#                     Qualification_Id=QualificationId
#                 ).first()

#                 existing_Qualification_name = Qualification_master.objects.filter(
#                     Qualification=Qualification
#                 ).first()

#                 if existing_Qualification:

#                     if existing_Qualification_name:
#                         print(f"The {Qualification} name already exists.")
#                         message = f"The {Qualification} name already exists."
#                         success = False
#                     else:

#                         # Update existing record
#                         existing_Qualification.Qualification = Qualification
#                         existing_Qualification.save()
#                         message = "Qualification updated successfully."
#                         success = True

#                 elif existing_Qualification_name:

#                     message = f"The {Qualification} name already exists."
#                     success = False
#                 else:
#                     # Create new record
#                     Qualification_master.objects.create(
#                         Qualification_Id=QualificationId,
#                         Qualification=Qualification,
#                         created_by=createdby,
#                     )
#                     message = "New Qualification created successfully."
#                     success = True

#                 return JsonResponse({"success": success, "message": message})
#             elif Type == "ExternalLabMaster":
#                 labName = data.get("labName")
#                 address = data.get("address")
#                 email = data.get("email")
#                 registerNo = data.get("registerNo")
#                 phoneNumber = data.get("phoneNumber")
#                 pincode = data.get("pincode")
#                 referenceCode = data.get("referenceCode")
#                 source = data.get("source")
#                 location = data.get("location")
#                 created_by = data.get("createdby")
#                 IsEditMode = data.get("IsEditMode")
#                 labcode = data.get("labCode")  # Assuming labcode is passed
#                 Status = "Active"
#                 # Check if labcode is provided

#                 if not labcode:
#                     return JsonResponse(
#                         {"success": False, "message": "Lab Code Required"}
#                     )
#                 print('IsEditMode :',IsEditMode)
#                 if IsEditMode:
#                     External_Client_Master_ins = External_Lab_Master.objects.get(
#                         LabCode=labcode
#                     )
#                     External_Client_Master_ins.LabName = labName
#                     External_Client_Master_ins.RegisterNo = registerNo
#                     External_Client_Master_ins.Address = address
#                     External_Client_Master_ins.Email = email
#                     External_Client_Master_ins.PhoneNo = phoneNumber
#                     External_Client_Master_ins.Pincode = pincode
#                     External_Client_Master_ins.ReferenceCode = referenceCode
#                     External_Client_Master_ins.Location = location
#                     External_Client_Master_ins.SourceType = source
#                     External_Client_Master_ins.save()
#                     message = {
#                         "success": True,
#                         "message": "Lab Details Updated successfully",
#                     }

#                 else:
#                     if External_Lab_Master.objects.filter(LabCode=labcode).exists():
#                         External_Client_Master_ins = External_Lab_Master.objects.get(
#                             LabCode=labcode
#                         )
#                         External_Client_Master_ins.LabName = labName
#                         External_Client_Master_ins.RegisterNo = registerNo
#                         External_Client_Master_ins.Address = address
#                         External_Client_Master_ins.Email = email
#                         External_Client_Master_ins.PhoneNo = phoneNumber
#                         External_Client_Master_ins.Pincode = pincode
#                         External_Client_Master_ins.ReferenceCode = referenceCode
#                         External_Client_Master_ins.Location = location
#                         External_Client_Master_ins.SourceType = source
#                         External_Client_Master_ins.save()
#                         message = {
#                             "success": True,
#                             "message": "Lab Details Updated successfully",
#                         }
#                     else:
#                         External_Client_Master_ins = External_Lab_Master(
#                             LabCode=labcode,
#                             LabName=labName,
#                             RegisterNo=registerNo,
#                             Address=address,
#                             Email=email,
#                             PhoneNo=phoneNumber,
#                             Pincode=pincode,
#                             ReferenceCode=referenceCode,
#                             Location=location,
#                             SourceType=source,
#                             created_by=created_by,
#                             Status=Status,
#                         )

#                         column_name = f"{labcode}"  # Generate a unique column name
#                         with connection.cursor() as cursor:
#                             # Add the new column with default value 0.000 after the 'Basic' column
#                             cursor.execute(
#                                 f"""
#         ALTER TABLE Testmaster_Cost_List
#         ADD COLUMN {column_name} DECIMAL(10,3) DEFAULT 0.000
#         AFTER Basic;
#         """
#                             )

#                         External_Client_Master_ins.save()
#                         message = {
#                             "success": True,
#                             "message": "New Lab Created successfully",
#                         }

#                 return JsonResponse(message)
#             elif Type == "ReferDoctorMaster":
#                 DoctorName = data.get("doctorname")
#                 Title = data.get("title")
#                 Qualification1 = data.get("Qualification")
#                 DoctorType = data.get("doctortype")
#                 PhoneNo = data.get("phone")
#                 Commission_per = data.get("commission")
#                 PaymentType = data.get("PaymentType")
#                 Address = data.get("address1")
#                 Address2 = data.get("address2")
#                 Status = "Active"
#                 created_by = data.get("createdby")
#                 BankName = data.get("Bankname")
#                 HolderName = data.get("HolderName")
#                 AccountNo = data.get("AccNumber")
#                 DoctorID = data.get("DoctorID")
#                 IsEditMode = data.get("isEdit")

#                 if not DoctorID:
#                     return JsonResponse(
#                         {"success": False, "message": "DoctorID Required"}
#                     )

#                 Qualification2 = Qualification_master.objects.filter(
#                     Qualification_Id=Qualification1
#                 ).first()

#                 print("DoctorID :", DoctorID)
#                 if IsEditMode == True:
#                     ReferDoctorMaster_ins = Refering_Doctor_Details.objects.get(
#                         DoctorID=DoctorID
#                     )
#                     print("ReferDoctorMaster_ins :", ReferDoctorMaster_ins)
#                     ReferDoctorMaster_ins.Title = Title
#                     ReferDoctorMaster_ins.DoctorName = DoctorName
#                     ReferDoctorMaster_ins.Qualification = Qualification2
#                     ReferDoctorMaster_ins.DoctorType = DoctorType
#                     ReferDoctorMaster_ins.PhoneNo = PhoneNo
#                     ReferDoctorMaster_ins.Commission_per = Commission_per
#                     ReferDoctorMaster_ins.PaymentType = PaymentType
#                     ReferDoctorMaster_ins.BankName = BankName
#                     ReferDoctorMaster_ins.HolderName = HolderName
#                     ReferDoctorMaster_ins.AccountNo = AccountNo
#                     ReferDoctorMaster_ins.Address = Address
#                     ReferDoctorMaster_ins.Address2 = Address2
#                     ReferDoctorMaster_ins.save()
#                     message = {
#                         "success": True,
#                         "message": "Refer Doctor Updated successfully",
#                     }

#                 else:
#                     if Refering_Doctor_Details.objects.filter(
#                         DoctorID=DoctorID
#                     ).exists():
#                         ReferDoctorMaster_ins = Refering_Doctor_Details.objects.get(
#                             DoctorID=DoctorID
#                         )
#                         ReferDoctorMaster_ins.Title = Title
#                         ReferDoctorMaster_ins.DoctorName = DoctorName
#                         ReferDoctorMaster_ins.Qualification = Qualification2
#                         ReferDoctorMaster_ins.DoctorType = DoctorType
#                         ReferDoctorMaster_ins.PhoneNo = PhoneNo
#                         ReferDoctorMaster_ins.Commission_per = Commission_per
#                         ReferDoctorMaster_ins.PaymentType = PaymentType
#                         ReferDoctorMaster_ins.BankName = BankName
#                         ReferDoctorMaster_ins.HolderName = HolderName
#                         ReferDoctorMaster_ins.AccountNo = AccountNo
#                         ReferDoctorMaster_ins.Address = Address
#                         ReferDoctorMaster_ins.Address2 = Address2
#                         ReferDoctorMaster_ins.save()
#                         message = {
#                             "success": True,
#                             "message": "Refer Doctor Updated successfully",
#                         }
#                     else:
#                         ReferDoctorMaster_ins = Refering_Doctor_Details(
#                             DoctorID=DoctorID,
#                             Title=Title,
#                             DoctorName=DoctorName,
#                             Qualification=Qualification2,
#                             DoctorType=DoctorType,
#                             PhoneNo=PhoneNo,
#                             Commission_per=Commission_per,
#                             PaymentType=PaymentType,
#                             BankName=BankName,
#                             HolderName=HolderName,
#                             AccountNo=AccountNo,
#                             Address=Address,
#                             Address2=Address2,
#                             Status=Status,
#                             created_by=created_by,
#                         )

#                         ReferDoctorMaster_ins.save()
#                         message = {
#                             "success": True,
#                             "message": "Doctor Registered successfully",
#                         }

#                 return JsonResponse(message)
#             elif Type == "TestMaster":
#                 # Get department data from the request
#                 testName = data.get("testName")
#                 testCode = data.get("testCode")

#                 department = data.get("department")
#                 departmentcode = data.get("departmentcode")
#                 department1 = Lab_Department_Detials.objects.filter(
#                     Department_Code=departmentcode
#                 ).first()

#                 subdepartment = data.get("subdepartment")
#                 subdepartmentcode = data.get("subdepartmentcode")
#                 subdepartment1 = SubLab_Department_Detials.objects.filter(
#                     SubDepartment_Code=subdepartmentcode
#                 ).first()

#                 header = data.get("header")
#                 displayText = data.get("displayText")
#                 billingName = data.get("billingName")
#                 container = data.get("container")
#                 containercode = data.get("containercode")
#                 container1 = Container_Masters.objects.filter(
#                     Container_Code=containercode
#                 ).first()

#                 specimen = data.get("specimen")
#                 specimencode = data.get("specimencode")
#                 specimen1 = Specimen_Masters.objects.filter(
#                     Specimen_Code=specimencode
#                 ).first()
#                 method = data.get("method")
#                 methodcode = data.get("methodcode")
#                 method1 = Methods_Masters.objects.filter(Method_Code=methodcode).first()

#                 gender = data.get("gender")
#                 inputType = data.get("inputType")
#                 decimalPlaces = data.get("decimalPlaces")
#                 decimalPlaces1 = decimalPlaces if decimalPlaces != "" else 0
#                 inputPatternType = data.get("inputPatternType")
#                 testCategory = data.get("testCategory")
#                 logicalCategory = data.get("logicalCategory")
#                 capturedUnit = data.get("capturedUnit")
#                 capturedUnit1 = capturedUnit if capturedUnit != "" else None
#                 uom = data.get("uom")
#                 uomcode = data.get("uomcode")

#                 uom1 = Unit_Masters.objects.filter(Unit_Code=uomcode).first()

#                 reportType = data.get("reportType")
#                 testInstruction = data.get("testInstruction")
#                 loincCode = data.get("loincCode")
#                 allowDiscount = data.get("allowDiscount")
#                 orderable = data.get("orderable")
#                 showGraph = data.get("showGraph")
#                 stat = data.get("stat")
#                 nonReportable = data.get("nonReportable")
#                 calculatedTest = data.get("calculatedTest")
#                 isOutsourced = data.get("isOutsourced")
#                 minimumtime = data.get("minimumtime")
#                 Emergencytime = data.get("Emergencytime")
#                 timeperiod = data.get("timeperiod")
#                 formula = data.get("formula")
#                 paraone = data.get("paraone")
#                 paratwo = data.get("paratwo")
#                 Culturetest = data.get("Culturetest")
#                 Checkout = data.get("Checkout")
#                 isNABHL = data.get("isNABHL")
#                 isCAP = data.get("isCAP")
#                 is_Machine_Interfaced = data.get("is_Machine_Interfaced")
#                 Reagentlevel = data.get("Reagentlevel")
#                 AssayCode = data.get("AssayCode")
#                 IsSubTest = data.get("IsSubTest")
#                 SubTestCodes = data.get("SubTestCodes")
#                 Captured_Unit_UOM = data.get("Captured_Unit_UOM")
#                 created_by = data.get("created_by")

#                 # Check if a department with the same code exists
#                 existing_Test_Descriptions = Test_Descriptions.objects.filter(
#                     Test_Code=testCode
#                 ).first()

#                 if existing_Test_Descriptions:
#                     existing_Test_Descriptions.Test_Name = (testName,)
#                     existing_Test_Descriptions.department = (department,)
#                     existing_Test_Descriptions.sub_department = (subdepartment,)
#                     existing_Test_Descriptions.Header = (header,)
#                     existing_Test_Descriptions.Billing_Name = (billingName,)
#                     existing_Test_Descriptions.DisplayText = (displayText,)
#                     existing_Test_Descriptions.Container_Name = (container,)
#                     existing_Test_Descriptions.Specimen_Name = (specimen,)
#                     existing_Test_Descriptions.Method_Name = (method,)
#                     existing_Test_Descriptions.Gender = (gender,)
#                     existing_Test_Descriptions.Input_Type = (inputType,)
#                     existing_Test_Descriptions.Decimal_Palces = (decimalPlaces1,)
#                     existing_Test_Descriptions.Input_Pattern_Type = (inputPatternType,)
#                     existing_Test_Descriptions.Test_Category = (testCategory,)
#                     existing_Test_Descriptions.Logical_Category = (logicalCategory,)
#                     existing_Test_Descriptions.Captured_Unit = (capturedUnit1,)
#                     existing_Test_Descriptions.Captured_Unit_UOM = (Captured_Unit_UOM,)
#                     existing_Test_Descriptions.UOM = (uom,)
#                     existing_Test_Descriptions.Report_Type = (reportType,)
#                     existing_Test_Descriptions.Test_InstdisplayTextructions = (
#                         testInstruction,
#                     )
#                     existing_Test_Descriptions.Loinc_Code = (loincCode,)
#                     existing_Test_Descriptions.Allow_Discount = (allowDiscount,)
#                     existing_Test_Descriptions.Oderable = (orderable,)
#                     existing_Test_Descriptions.Show_Graph = (showGraph,)
#                     existing_Test_Descriptions.STAT = (stat,)
#                     existing_Test_Descriptions.Non_Reportable = (nonReportable,)
#                     existing_Test_Descriptions.Calculated_Test = (calculatedTest,)
#                     existing_Test_Descriptions.Outsourced = (isOutsourced,)
#                     existing_Test_Descriptions.Processing_Time = (minimumtime,)
#                     existing_Test_Descriptions.Emergency_Processing_Time = (
#                         Emergencytime,
#                     )
#                     existing_Test_Descriptions.Period_Type = (timeperiod,)
#                     existing_Test_Descriptions.Formula = (formula,)
#                     existing_Test_Descriptions.Routine = (paraone,)
#                     existing_Test_Descriptions.TimeGap = (paratwo,)
#                     existing_Test_Descriptions.Autocheck = (Checkout,)
#                     existing_Test_Descriptions.Culturetest = (Culturetest,)
#                     existing_Test_Descriptions.Is_NABHL = (isNABHL,)
#                     existing_Test_Descriptions.Is_CAP = (isCAP,)
#                     existing_Test_Descriptions.Is_Machine_Interfaced = (
#                         is_Machine_Interfaced,
#                     )
#                     existing_Test_Descriptions.Machine_Name = (None,)
#                     existing_Test_Descriptions.Assay_Code = (AssayCode,)
#                     existing_Test_Descriptions.IsSubTest = (IsSubTest,)
#                     existing_Test_Descriptions.SubTestCodes = (SubTestCodes,)
#                     existing_Test_Descriptions.created_by = (created_by,)
#                     existing_Test_Descriptions.save()
#                     message = "Test updated successfully."
#                 else:

#                     with transaction.atomic():
#                         # Insert into Test_Descriptions
#                         test_description = Test_Descriptions.objects.create(
#                             Test_Code=testCode,
#                             Test_Name=testName,
#                             department=department1,
#                             sub_department=subdepartment1,
#                             Header=header,
#                             Billing_Name=billingName,
#                             DisplayText=displayText,
#                             Container_Name=container1,
#                             Specimen_Name=specimen1,
#                             Method_Name=method1,
#                             Gender=gender,
#                             Input_Type=inputType,
#                             Decimal_Palces=decimalPlaces1,
#                             Input_Pattern_Type=inputPatternType,
#                             Test_Category=testCategory,
#                             Logical_Category=logicalCategory,
#                             Captured_Unit=capturedUnit1,
#                             Captured_Unit_UOM=Captured_Unit_UOM,
#                             UOM=uom1,
#                             Report_Type=reportType,
#                             Test_Instructions=testInstruction,
#                             Loinc_Code=loincCode,
#                             Allow_Discount=allowDiscount,
#                             Oderable=orderable,
#                             Show_Graph=showGraph,
#                             STAT=stat,
#                             Non_Reportable=nonReportable,
#                             Calculated_Test=calculatedTest,
#                             Outsourced=isOutsourced,
#                             Processing_Time=minimumtime,
#                             Emergency_Processing_Time=Emergencytime,
#                             Period_Type=timeperiod,
#                             Formula=formula,
#                             Routine=paraone,
#                             TimeGap=paratwo,
#                             Autocheck=Checkout,
#                             Culturetest=Culturetest,
#                             Is_NABHL=isNABHL,
#                             Is_CAP=isCAP,
#                             Is_Machine_Interfaced=is_Machine_Interfaced,
#                             Machine_Name=None,
#                             Assay_Code=AssayCode,
#                             Status="Active",
#                             IsSubTest=IsSubTest,
#                             SubTestCodes=SubTestCodes,
#                             ResultValues=None,
#                             created_by=created_by,
#                         )

#                         # Prepare default data for other tables
#                         test_name = test_description.Test_Name
#                         test_code = test_description.Test_Code

#                         test_description_instance = Test_Descriptions.objects.get(
#                             Test_Code=test_code
#                         )

#                         Testmaster_Remarks_Test_Id = (
#                             Testmaster_Remarks.objects.aggregate(Max("Test_Id"))[
#                                 "Test_Id__max"
#                             ]
#                         )
#                         next_Testmaster_Remarks_Test_Id = (
#                             1
#                             if Testmaster_Remarks_Test_Id is None
#                             else int(Testmaster_Remarks_Test_Id) + 1
#                         )

#                         # Insert into Testmaster_Remarks
#                         Testmaster_Remarks.objects.create(
#                             Test_Id=next_Testmaster_Remarks_Test_Id,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Validation=None,
#                             Remark_Type=None,
#                             Remark=None,
#                             created_by=created_by,
#                         )

#                         Testmaster_Reference_Range_Test_Id = (
#                             Testmaster_Reference_Range.objects.aggregate(
#                                 Max("Test_Id")
#                             )["Test_Id__max"]
#                         )
#                         next_Testmaster_Reference_Range_Test_Id = (
#                             1
#                             if Testmaster_Reference_Range_Test_Id is None
#                             else int(Testmaster_Reference_Range_Test_Id) + 1
#                         )

#                         # Insert into Testmaster_Reference_Range
#                         Testmaster_Reference_Range.objects.create(
#                             Test_Id=next_Testmaster_Reference_Range_Test_Id,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Analizer_Type=None,
#                             validation=None,
#                             Method_Type=None,
#                             Gender="Both",
#                             Range_Lower_Limit=None,
#                             Range_Higher_Limit=None,
#                             Reference_Range_Text=None,
#                             created_by=created_by,
#                         )

#                         Testmaster_Cost_List_Test_Id = (
#                             Testmaster_Cost_List.objects.aggregate(Max("Test_Id"))[
#                                 "Test_Id__max"
#                             ]
#                         )
#                         next_Testmaster_Cost_List_Test_Id = (
#                             1
#                             if Testmaster_Cost_List_Test_Id is None
#                             else int(Testmaster_Cost_List_Test_Id) + 1
#                         )

#                         # Insert into Cost_List_Table
#                         Testmaster_Cost_List.objects.create(
#                             Test_Id=next_Testmaster_Cost_List_Test_Id,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Basic=0,
#                             created_by=created_by,
#                         )

#                         Testmaster_Rule_Based_Test_Id = (
#                             Testmaster_Rule_Based.objects.aggregate(Max("Test_Id"))[
#                                 "Test_Id__max"
#                             ]
#                         )
#                         next_Testmaster_Rule_Based_Test_Id = (
#                             1
#                             if Testmaster_Rule_Based_Test_Id is None
#                             else int(Testmaster_Rule_Based_Test_Id) + 1
#                         )

#                         Testmaster_Rule_Based.objects.create(
#                             Test_Id=next_Testmaster_Rule_Based_Test_Id,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Validation_type=None,
#                             Gender=None,
#                             Rule_Type=None,
#                             Remark=None,
#                             created_by=created_by,
#                         )

#                         Testmaster_Interpretation_table_Test_Id = (
#                             Testmaster_Interpretation_table.objects.aggregate(
#                                 Max("Test_Id")
#                             )["Test_Id__max"]
#                         )
#                         next_Testmaster_Interpretation_table_Test_Id = (
#                             1
#                             if Testmaster_Interpretation_table_Test_Id is None
#                             else int(Testmaster_Interpretation_table_Test_Id) + 1
#                         )

#                         Testmaster_Interpretation_table.objects.create(
#                             Test_Id=next_Testmaster_Interpretation_table_Test_Id,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Header_interpretation=None,
#                             Comments=None,
#                             created_by=created_by,
#                         )

#                         Testmaster_Reflex_Test_Test_Id = (
#                             Testmaster_Reflex_Test.objects.aggregate(Max("Test_Id"))[
#                                 "Test_Id__max"
#                             ]
#                         )
#                         next_Testmaster_Reflex_Test_Test_Id = (
#                             1
#                             if Testmaster_Reflex_Test_Test_Id is None
#                             else int(Testmaster_Reflex_Test_Test_Id) + 1
#                         )

#                         Testmaster_Reflex_Test.objects.create(
#                             Test_Id=next_Testmaster_Reflex_Test_Test_Id,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Reflex_Test=None,
#                             Reflex_Code=None,
#                             created_by=created_by,
#                         )

#                         Testmaster_Age_Setup_Master = (
#                             Age_Setup_Master.objects.aggregate(Max("Test_Id"))[
#                                 "Test_Id__max"
#                             ]
#                         )
#                         next_Testmaster_Age_Setup_Master = (
#                             1
#                             if Testmaster_Age_Setup_Master is None
#                             else int(Testmaster_Age_Setup_Master) + 1
#                         )

#                         # Insert into Age_Setup_Master
#                         Age_Setup_Master.objects.create(
#                             Test_Id=next_Testmaster_Age_Setup_Master,
#                             Test_Code=test_description_instance,
#                             # Test_Name=test_name,
#                             Gender="Both",
#                             FromAge=None,
#                             FromAgeType=None,
#                             Toage=None,
#                             ToAgeType=None,
#                             From_Value=None,
#                             To_Value=None,
#                             PanicLow=None,
#                             PanicHigh=None,
#                             NormalValue=None,
#                             Reference_Range=None,
#                             created_by=created_by,
#                         )

#                     message = "New Test created successfully."

#                 return JsonResponse({"success": True, "message": message}, status=200)
#             elif Type == "DepartmentOrderMaster":

#                 with connection.cursor() as cursor:
#                     cursor.execute("TRUNCATE TABLE DepartmentOrderMaster")
#                 for order in data:
#                     DepartmentOrderMaster_S_No = DepartmentOrderMaster.objects.aggregate(
#                     Max("S_No")
#                     )["S_No__max"]
#                     print('DepartmentOrderMaster_S_No :',DepartmentOrderMaster_S_No)
#                     next_DepartmentOrderMaster_S_No = (
#                         1
#                         if DepartmentOrderMaster_S_No is None
#                         else int(DepartmentOrderMaster_S_No) + 1
#                     )
#                     print('next_DepartmentOrderMaster_S_No :',next_DepartmentOrderMaster_S_No)
#                     # Get or create SubLab_Department_Detials
#                     subdepartment_code = order.get("SubDepartment_Code")
#                     CreatedBy = order.get("created_by")
#                     DepartmentOrderID = order.get("OrderID")

#                     subdepartment = SubLab_Department_Detials.objects.filter(
#                         SubDepartment_Code=subdepartment_code
#                     ).first()

#                     # Insert into DepartmentOrderMaster
#                     DepartmentOrderMaster.objects.create(
#                         S_No=next_DepartmentOrderMaster_S_No,
#                         SubDepartment_Code=subdepartment,  # Foreign key relationship
#                         OrderID=DepartmentOrderID,
#                         created_by=CreatedBy,
#                     )
                    

#                     message = {"success": True, "message": "Saved Successfully"}
#                 return JsonResponse(message)
#             elif Type == "RateCardMasterUpdate":
#                 # Get department data from the request
#                 TestCode = data.get("TestCode")
#                 TestName = data.get("TestName")
#                 Basic = data.get("Basic")
#                 updateamount = data.get("updateamount")
#                 columnname = data.get("franchaisename")  # columnname is dynamic

#                 if not TestCode or not columnname or not updateamount:
#                     return JsonResponse(
#                         {
#                             "success": False,
#                             "message": "TestCode, Franchise Name, and Update Amount are required.",
#                         },
#                         status=400,
#                     )

#                 # Check if a department with the same code exists
#                 print('TestCode :',TestCode)
#                 if "LTC" in TestCode:
#                     existing_data = Testmaster_Cost_List.objects.filter(Test_Code_id=TestCode).first()
#                     wherecolumn = "Test_Code_id"
#                 elif "LGM" in TestCode:
#                     existing_data = Testmaster_Cost_List.objects.filter(Group_Code_id=TestCode).first()
#                     wherecolumn = "Group_Code_id"
#                 if not existing_data:
#                     return JsonResponse(
#                         {
#                             "success": False,
#                             "message": f"TestCode {TestCode} not found.",
#                         },
#                         status=404,
#                     )

#                 with connection.cursor() as cursor:
#                     cursor.execute("SHOW COLUMNS FROM Testmaster_Cost_List")
#                     columns = cursor.fetchall()
#                     column_names = [column[0] for column in columns]
#                     print('column_names :',column_names)
#                     # Check if the column exists
#                     if columnname not in column_names:
#                         return JsonResponse(
#                                 {
#                                     "success": False,
#                                     "message": f"Invalid field name: {columnname}.",
#                                 })
                        
#                 with connection.cursor() as cursor:
#                     # Prepare the SQL query dynamically with the column name and value
#                     query = f"""
#                         UPDATE Testmaster_Cost_List
#                         SET {columnname} = %s
#                         WHERE {wherecolumn} = %s
#                     """
#                     cursor.execute(query, [updateamount, TestCode])

#                 message = "Amount updated successfully."
#                 success = True

#                 return JsonResponse(
#                     {"success": success, "message": message},
#                     status=200 if success else 400,
#                 )
#             elif Type == "GroupMaster":
                
#                 Test_datas = data.get("selectedtest",[])
#                 groupCode = data.get('groupCode')
#                 groupName = data.get("groupName")
#                 displayName = data.get("displayName")
#                 billingCode = data.get("billingCode")
#                 billingName = data.get("billingName")
#                 gender = data.get("gender")
#                 reportType = data.get("reportType")
#                 SubDepartment_Code = data.get("SubDepartment_Code")
#                 testCategory = data.get("testCategory")
#                 logicalCategory = data.get("logicalCategory")
#                 authorizedUser = data.get("authorizedUser")
#                 lonicCode = data.get("lonicCode")
#                 groupCost = data.get('groupCost')
#                 created_by = data.get("created_by")
#                 isEditMode = data.get('isEditMode')
                
                
                
#                 existing_Group = Group_Master.objects.filter(
#                     Group_Code=groupCode
#                 ).first()
                
#                 DepartmentDetails = SubLab_Department_Detials.objects.filter(
#                         SubDepartment_Code=SubDepartment_Code
#                     ).first()

                    
#                 if existing_Group:
#                     # Update existing record
#                     existing_Group.Group_Name = groupName
#                     existing_Group.Display_Name = displayName
#                     existing_Group.Billing_Code = billingCode
#                     existing_Group.Billing_Name = billingName
#                     existing_Group.Gender = gender
#                     existing_Group.Report_Type = reportType                    
#                     existing_Group.Department = DepartmentDetails                    
#                     existing_Group.Test_Category = testCategory  
#                     existing_Group.Logical_Category = logicalCategory                    
#                     existing_Group.AutoAuthorized_User = authorizedUser
#                     existing_Group.Lonic_Code = lonicCode            
#                     existing_Group.created_by = created_by
                    
#                     existing_Group.save()
                   
#                 else:
#                     # Create new record
#                     Group_Master.objects.create(
#                     Group_Code = groupCode,
#                     Group_Name = groupName,
#                     Display_Name = displayName,
#                     Billing_Code = billingCode,
#                     Billing_Name = billingName,
#                     Gender = gender,
#                     Report_Type = reportType,               
#                     Department = DepartmentDetails,                    
#                     Test_Category = testCategory,  
#                     Logical_Category = logicalCategory,                    
#                     AutoAuthorized_User = authorizedUser,
#                     Lonic_Code = lonicCode,     
#                     Status = "Active",
#                     created_by = created_by,
#                     )

                
                
#                 if isEditMode is True:
#                     with connection.cursor() as cursor:
#                         query = "DELETE FROM Group_Master_TestList WHERE Group_Code_id = %s"
#                         cursor.execute(query, (groupCode,))
#                         connection.commit()  
#                     message = {"success": True, "message": "updated Successfully"}
#                 else:
#                     message = {"success": True, "message": "Saved Successfully"}

                    
#                 for Test in Test_datas:
#                     group_code = Test.get("group_code")
#                     Test_Code = Test.get("Test_Code")
                    
                    
#                     Group_Master_TestList_S_No = Group_Master_TestList.objects.aggregate(
#                     Max("Group_Master_TestList_Id")
#                     )["Group_Master_TestList_Id__max"]
#                     next_Group_Master_TestList_S_No = (
#                         1
#                         if Group_Master_TestList_S_No is None
#                         else int(Group_Master_TestList_S_No) + 1
#                     )
#                     # Get or create SubLab_Department_Detials


#                     GroupDetails = Group_Master.objects.filter(
#                         Group_Code=group_code
#                     ).first()

#                     TestDetails = Test_Descriptions.objects.filter(
#                         Test_Code=Test_Code
#                     ).first()
                    
#                     # Insert into DepartmentOrderMaster
#                     Group_Master_TestList.objects.create(
#                         Group_Master_TestList_Id=next_Group_Master_TestList_S_No,
#                         Group_Code=GroupDetails,  # Foreign key relationship
#                         Test_Code=TestDetails,
#                         created_by=created_by,
#                     )
                    

                    
                

#                 print('groupCode :',groupCode)
#                 existing_data1 = Testmaster_Cost_List.objects.filter(Group_Code=groupCode).first()
#                 print('existing_data1 :',existing_data1)
                
#                 Testmaster_Cost_List_Test_Id = (
#                             Testmaster_Cost_List.objects.aggregate(Max("Test_Id"))[
#                                 "Test_Id__max"
#                             ]
#                         )
#                 next_Testmaster_Cost_List_Test_Id = (
#                             1
#                             if Testmaster_Cost_List_Test_Id is None
#                             else int(Testmaster_Cost_List_Test_Id) + 1
#                         )

#                 Group_Master_instance = Group_Master.objects.filter(
#                         Group_Code=group_code
#                     ).first()

                    
#                 if existing_data1:
#                     existing_data1.Basic = groupCost
#                     existing_data1.save()
#                 else:
#                     Testmaster_Cost_List.objects.create(
#                         Test_Id = next_Testmaster_Cost_List_Test_Id,
#                         Basic = groupCost,
#                         Group_Code = Group_Master_instance,
#                         created_by = created_by
#                     )
             

#                 return JsonResponse(message,safe=False)
#             elif Type == "AgeSetupMaster":
#                 # Get department data from the request
#                 ageType = data.get("ageType")
#                 fromAge = data.get("fromAge")
#                 fromageType = data.get("ageType")
#                 toAge = data.get('toAge')
#                 toAgeType = data.get('toAgeType')
#                 fromvalue = data.get('fromvalue')
#                 tovalue = data.get('tovalue')
#                 gender = data.get('gender')
#                 panicHigh = data.get('panicHigh')
#                 panicLow = data.get('panicLow')
#                 testcode = data.get('testcode')
#                 testname = data.get('testname')
#                 Editmode = data.get('isEditMode1')
#                 print('Editmode :',Editmode)
#                 referencerange = data.get('referencerange')
#                 if referencerange != "":
#                     NormalValue = "Yes"
#                 else:
#                     NormalValue = "No"
                
#                 created_by = data.get('created_by')

#                 if Editmode is True:
#                     # Check if a department with the same code exists
#                     print('testcode :',testcode)
#                     existing_AgeSetupdata = Age_Setup_Master.objects.filter(
#                         Test_Code=testcode
#                     ).first()
#                     print('existing_AgeSetupdata :',existing_AgeSetupdata)
#                     if existing_AgeSetupdata:
#                         # Update existing record
#                         existing_AgeSetupdata.Gender = gender
#                         existing_AgeSetupdata.FromAge = fromAge
#                         existing_AgeSetupdata.FromAgeType = fromageType
#                         existing_AgeSetupdata.Toage = toAge
#                         existing_AgeSetupdata.ToAgeType = toAgeType
#                         existing_AgeSetupdata.From_Value = fromvalue
#                         existing_AgeSetupdata.To_Value = tovalue
#                         existing_AgeSetupdata.PanicLow = panicLow
#                         existing_AgeSetupdata.PanicHigh = panicHigh
#                         existing_AgeSetupdata.NormalValue = NormalValue
#                         existing_AgeSetupdata.Reference_Range = referencerange
#                         existing_AgeSetupdata.save()
#                         message = "Data updated successfully."
#                 else:
#                     # Create new record
                    
#                     test_instance  = Test_Descriptions.objects.filter(Test_Code=test_code).first()
                    
#                     Age_Setup_Master.objects.create(
#                         Test_Code = test_instance,
#                         Gender = gender,
#                         FromAge = fromAge,
#                         FromAgeType = fromageType,
#                         Toage = toAge,
#                         ToAgeType = toAgeType,
#                         From_Value = fromvalue,
#                         To_Value = tovalue,
#                         PanicLow = panicLow,
#                         PanicHigh = panicHigh,
#                         NormalValue = NormalValue,
#                         Reference_Range = referencerange,
#                         created_by = created_by
#                     )
#                     message = "New Reason created successfully."

#                 return JsonResponse({"success": True, "message": message}, status=200)
#             elif Type == "Update_Testmaster_Interpretation_table":
              
#                 comments = data.get('comments')
#                 testname = data.get('testname')
#                 header = data.get('header')
#                 Test_Code = data.get('Test_Code')
#                 print('Test_Code :',Test_Code)

#                 existing_Update_TestmasterInterpretationtable = Testmaster_Interpretation_table.objects.filter(
#                         Test_Code=Test_Code
#                     ).first()
#                 if existing_Update_TestmasterInterpretationtable:
#                         # Update existing record
#                         existing_Update_TestmasterInterpretationtable.Comments = comments
#                         existing_Update_TestmasterInterpretationtable.Header_interpretation = header
#                         existing_Update_TestmasterInterpretationtable.save()
#                         message = {"success": True, "message": "Data Updated Sucessfully"}
#                 else:
#                     message = {"success": False, "message": f"No Exist Data for This Test {testname}"}
#                 return JsonResponse(message,safe=False)
            
            
#             else:
#                 return JsonResponse({"message": "Type Required"})


           

#         except json.JSONDecodeError as e:
#             print(e)
#             return JsonResponse({"error": "Invalid JSON format."})
#         except Exception as e:
#             print('Unexpected error:', str(e))
#             return JsonResponse({"error": str(e)})

#     elif request.method == "GET":
#         Type = request.GET.get("Type")
#         if Type == "LabDepartment":
#             departments = Lab_Department_Detials.objects.all()
#             serializer = MainDepartmentSerializer(departments, many=True)
#             for index,i in enumerate(serializer.data,start=1):
#                 i['id'] = index
#             return JsonResponse(serializer.data, safe=False)
#         elif Type == "LabSubDepartment":
#             subdepartments = SubLab_Department_Detials.objects.all()
#             serializers = SubLabDepartmentSerializer(subdepartments, many=True)
#             for index,i in enumerate(serializers.data,start=1):
#                 i["id"] = index
#             return JsonResponse(serializers.data, safe=False)       
#         elif Type == "UnitMaster":
#             UnitsData = Unit_Masters.objects.all()
#             UnitsData_list = UnitMasterSerilizer(UnitsData,many=True)
#             for index, i in enumerate(UnitsData_list.data, start=1):
#                 i["id"] = index
#             return JsonResponse(UnitsData_list.data, safe=False)
#         elif Type == "ContainerMaster":
#             ContainerMasterData = Container_Masters.objects.all()
#             serializer = ContainerMastersSerializer(ContainerMasterData, many=True)
#             for index, i in enumerate(serializer.data, start=1):
#                 i["id"] = index
#             return JsonResponse(serializer.data, safe=False)     
#         elif Type == "SpecimenMaster":
#             SpecimenMasterData = Specimen_Masters.objects.all()
#             SpecimenMasterData_list = SpecimenMasterSerializer(SpecimenMasterData,many=True)
#             for index, i in enumerate(SpecimenMasterData_list.data, start=1):
#                 i["id"] = index
#             return JsonResponse(SpecimenMasterData_list.data, safe=False)
#         elif Type == "MethodsMaster":
#             MethodsMasterData = Methods_Masters.objects.all()
#             MethodsMasterData_list = MethodMasterSerializer(MethodsMasterData,many=True)
#             for index, i in enumerate(MethodsMasterData_list.data, start=1):
#                 i["id"] = index
#             return JsonResponse(MethodsMasterData_list.data, safe=False)
#         elif Type == "AntibioticMaster":
#             AntibioticMasterData = AntibioticMaster.objects.all()
#             AntibioticMasterData_list = AntibioticMasterSerializer(AntibioticMasterData,many=True)
#             for index, i in enumerate(AntibioticMasterData_list.data, start=1):
#                 i["id"] = index
#             return JsonResponse(AntibioticMasterData_list.data, safe=False)
#         elif Type == "OrganismMaster":
#             OrganismMasterData = Organism_Masters.objects.all()
#             OrganismMasterData_list = OrganismMasterSerializer(OrganismMasterData,many=True)
#             for index, i in enumerate(OrganismMasterData_list.data, start=1):
#                 i["id"] = index
#             return JsonResponse(OrganismMasterData_list.data, safe=False)
#         elif Type == "LabRemarksData":
#             LabRemarksMasterData = LabRemarksMaster.objects.all()
#             LabRemarksMasterData_list = list(LabRemarksMasterData.values())
#             for Remarks in LabRemarksMasterData_list:
#                 departmentCode = Remarks["Department"]
#                 main_department = SubLab_Department_Detials.objects.filter(
#                     SubDepartment_Code=departmentCode
#                 ).first()
#                 if main_department:
#                     Remarks["Department_Name"] = main_department.SubDepartment_Name
#                 else:
#                     Remarks["Department_Name"] = None
#             for index, i in enumerate(LabRemarksMasterData_list, start=1):
#                 i["id"] = index

#             return JsonResponse(LabRemarksMasterData_list, safe=False)
#         elif Type == "RemarksMaster":
#             RemarksMasterData = Remarks_master.objects.all()
#             RemarksMasterData_list = RemarksMasterSerializer(RemarksMasterData,many=True)
#             for index, i in enumerate(RemarksMasterData_list.data, start=1):
#                 i["id"] = index
#             return JsonResponse(RemarksMasterData_list.data, safe=False)
#         elif Type == "ReasonMaster":
#             ReasonMasterData = Reason_master.objects.all()
#             ReasonMasterData_list = list(ReasonMasterData.values())
#             for index, i in enumerate(ReasonMasterData_list, start=1):
#                 i["id"] = index
#             return JsonResponse(ReasonMasterData_list, safe=False)
#         elif Type == "QualificationMaster":
#             QualificationMasterData = Qualification_master.objects.all()
#             QualificationMasterData_list = list(QualificationMasterData.values())
#             for index, i in enumerate(QualificationMasterData_list, start=1):
#                 i["id"] = index
#             return JsonResponse(QualificationMasterData_list, safe=False)
#         elif Type == "ExternalLabMaster":
#             Labcode = request.GET.get("Labcode")
#             if Labcode:
#                 External_Lab_MasterData = External_Lab_Master.objects.filter(
#                     LabCode=Labcode
#                 )
#             else:
#                 External_Lab_MasterData = External_Lab_Master.objects.all()

#             External_Lab_MasterData_list = list(External_Lab_MasterData.values())
#             for index, i in enumerate(External_Lab_MasterData_list, start=1):
#                 i["id"] = index
#             return JsonResponse(External_Lab_MasterData_list, safe=False)
#         elif Type == "ReferDoctorMaster":

#             ReferingDoctorDetails = Refering_Doctor_Details.objects.all()
#             ReferingDoctorDetails_list = list(ReferingDoctorDetails.values())
#             for ReferingDoctor in ReferingDoctorDetails_list:

#                 Qualification_id = ReferingDoctor["Qualification_id"]
#                 Qualification_details = Qualification_master.objects.filter(
#                     Qualification_Id=Qualification_id
#                 ).first()
#                 if Qualification_details:
#                     ReferingDoctor["Qualification_name"] = (
#                         Qualification_details.Qualification
#                     )
#                 else:
#                     ReferingDoctor["Qualification_name"] = None

#             for index, ReferingDoctor in enumerate(ReferingDoctorDetails_list, start=1):
#                 ReferingDoctor["id"] = index

#             return JsonResponse(ReferingDoctorDetails_list, safe=False)
#         elif Type == "TestMaster":
#             print('Type :',Type)
#             # First, get the SubDepartment_Code and corresponding OrderID from DepartmentOrderMaster
#             sub_departments = SubLab_Department_Detials.objects.annotate(
#                 order_id=Subquery(
#                     DepartmentOrderMaster.objects.filter(
#                         SubDepartment_Code=OuterRef("SubDepartment_Code")
#                     ).values("OrderID")[:1]
#                 )
#             ).order_by(
#                 Case(
#                     When(order_id__isnull=False, then=Value(0)),
#                     default=Value(1),
#                     output_field=IntegerField(),
#                 ),
#                 "order_id",  # This sorts OrderID in ascending order
#                 "SubDepartment_Name",  # This sorts sub_department_name in ascending order
#             )

#             # Now, remove duplicates by keeping only the first instance of each SubDepartment_Code
#             seen_sub_departments = set()
#             unique_sub_departments = []

#             for sub_department in sub_departments:
#                 if sub_department.SubDepartment_Code not in seen_sub_departments:
#                     unique_sub_departments.append(sub_department)
#                     seen_sub_departments.add(sub_department.SubDepartment_Code)

#             # Process the unique sub_departments
#             data = []
#             newsn = 1

#             for sub_department in unique_sub_departments:
#                 # Department Details
#                 sub_department_id = sub_department.SubDepartment_Code
#                 sub_department_name = sub_department.SubDepartment_Name
#                 status = sub_department.Status
#                 sub_department_code = sub_department.SubDepartment_Code

#                 # Department and their Tests
#                 tests = Test_Descriptions.objects.filter(sub_department=sub_department)
#                 test_count = tests.count()
#                 test_data = [model_to_dict(row) for row in tests]

#                 for index, i in enumerate(test_data, start=1):
#                     i["id"] = index

#                 data.append(
#                     {
#                         "sub_department_name": sub_department_name,
#                         "tests": test_data,
#                         "Testcount": test_count,
#                         "sub_department_id": sub_department_id,
#                         "DepartmentOrderID": sub_department.order_id,  # Use annotated order_id
#                         "id": newsn,
#                         "Status": status,
#                         "sub_department_code": sub_department_code,
#                     }
#                 )

#                 newsn += 1

#             # Return the data in JSON format
#             return JsonResponse({"data": data}, status=200)
#         elif Type == "DepartmentOrderMaster":
#             DepartmentOrderMaster_data = DepartmentOrderMaster.objects.all()
#             DepartmentOrderMaster_list = list(DepartmentOrderMaster_data.values())
#             for index, i in enumerate(DepartmentOrderMaster_list, start=1):
#                 SubDepartment_Code_id = i["SubDepartment_Code_id"]
#                 Subdepartment_instance = SubLab_Department_Detials.objects.filter(SubDepartment_Code=SubDepartment_Code_id).first()
#                 i["SubDepartment_Name"] = Subdepartment_instance.SubDepartment_Name
#                 i["id"] = index
#                 i["SubDepartment_Code"] = SubDepartment_Code_id
#                 i["Type"] = "DepartmentOrderMaster"
#             return JsonResponse(DepartmentOrderMaster_list, safe=False) 
#         elif Type == "Get_AllTests":
#             gender = request.GET.get('gender')
#             SubDepartment_Code = request.GET.get("SubDepartment_Code")
            
#             # Base QuerySet
#             Test_data = Test_Descriptions.objects.filter(Status="Active")
            
#             # Apply filtering based on conditions
#             if gender and SubDepartment_Code:
#                 # Filter by both gender and SubDepartment_Code
#                 Test_data = Test_data.filter(
#                     sub_department_id=SubDepartment_Code
#                 ).filter(
#                     Gender__in=[gender, "Both"]
#                     )
#             elif gender:
#                 # Filter by gender only
#                 Test_data = Test_data.filter(Gender__in=[gender, "Both"])
#             elif SubDepartment_Code:
#                 # Filter by SubDepartment_Code only
#                 Test_data = Test_data.filter(sub_department_id=SubDepartment_Code)
            
#             # Convert QuerySet to list of dictionaries
#             Test_data_list = list(Test_data.values())
            
#             # Add an incremental "id" field to the response
#             for index, i in enumerate(Test_data_list, start=1):
#                 i["id"] = index

#             # Return JSON response
#             return JsonResponse(Test_data_list, safe=False)
#         elif Type == "FormulaMaster":

#             All_Test_data = Test_Descriptions.objects.all()
#             Test_data_list_1 = list(All_Test_data.values())
#             print("Test_data_list_1 :", Test_data_list_1)
#             All_Test_data_list = {
#                 i.get("Test_Code"): i.get("Test_Name") for i in Test_data_list_1
#             }
#             print("All_Test_data_list :", All_Test_data_list)

#             Test_data = Test_Descriptions.objects.filter(Calculated_Test="Yes").all()
#             Test_data_list = list(Test_data.values())
#             print("Test_data_list :", Test_data_list)
#             for index, i in enumerate(Test_data_list, start=1):
#                 print("i :", i)
#                 formula = i.get("Formula")

#                 print("formula :", formula)
#                 displayformula = formula

#                 for code, name in All_Test_data_list.items():
#                     displayformula = displayformula.replace(code, name)
#                 print("displayformula :", displayformula)
#                 i["displayformula"] = displayformula
#                 i["id"] = index

#             return JsonResponse(Test_data_list, safe=False)
#         elif Type == "RateCardMaster":
#             with connection.cursor() as cursor:
#                 cursor.execute("SHOW COLUMNS FROM Testmaster_Cost_List")
#                 columns = cursor.fetchall()
#             column_names = [column[0] for column in columns]
#             excluded_columns = [
#                 "updated_at",
#                 "created_at",
#                 "test_id",
#                 "test_name",
#                 "test_code",
#                 "created_by",
#                 "Test_Code_id",
#                 "Group_Code_id"
#             ]
#             filtered_columns = [
#                 {"columname": column}
#                 for column in column_names
#                 if column.lower()
#                 not in [excluded.lower() for excluded in excluded_columns]
#             ]
#             for i in filtered_columns:
#                 columname = i.get("columname")
#                 if columname != "Basic":
#                     lab_name = External_Lab_Master.objects.filter(
#                         LabCode=columname
#                     ).first()
#                     if lab_name:
#                         i["displayNames"] = lab_name.LabName
#                     else:
#                         i["displayNames"] = None
#                 else:
#                     i["displayNames"] = columname

#             return JsonResponse(filtered_columns, safe=False)
#         elif Type == "RateCardMasterList":
#             columnsname = request.GET.get("ratecard")
#             if not columnsname:
#                 return JsonResponse({"success": False, "message": "Column name not provided"})

#             with connection.cursor() as cursor:
#                 cursor.execute("SHOW COLUMNS FROM Testmaster_Cost_List")
#                 columns = cursor.fetchall()

#             valid_columns_from_db = [column[0] for column in columns]
#             if columnsname not in valid_columns_from_db:
#                 return JsonResponse({"success": False, "message": f"Invalid column name: {columnsname}"})

#             query = f"SELECT * FROM Testmaster_Cost_List WHERE {columnsname} IS NOT NULL"
#             with connection.cursor() as cursor:
#                 cursor.execute(query)
#                 rows = cursor.fetchall()

#                 filtered_data = []
#                 for index, row in enumerate(rows, start=1):
#                     row_dict = dict(zip([col[0] for col in cursor.description], row))
#                     testcode = row_dict.get("Test_Code_id")
#                     group_code = row_dict.get("Group_Code_id")

#                     if testcode is not None:
#                         test_description_instance = Test_Descriptions.objects.filter(Test_Code=testcode).first()
#                         row_dict["Name"] = test_description_instance.Test_Name if test_description_instance else None
#                         row_dict["Type"] = "Individual"
#                         row_dict["rowColor"] = "black"
#                         row_dict['Code'] = testcode
#                     elif group_code is not None:
#                         group_instance = Group_Master.objects.filter(Group_Code=group_code).first()
#                         row_dict["Name"] = group_instance.Group_Name if group_instance else None
#                         row_dict["rowColor"] = "green"
#                         row_dict["Type"] = "Group"
#                         row_dict['Code'] = group_code
                                                
#                     row_dict["id"] = index
#                     row_dict["Schemecost"] = float(row_dict.get(columnsname))
#                     filtered_data.append(row_dict)

#             return JsonResponse(filtered_data, safe=False)

#         elif Type == "GroupMaster":
#             # First, get the SubDepartment_Code and corresponding OrderID from DepartmentOrderMaster
#             GroupMasterdata = Group_Master.objects.all()
#             print('GroupMasterdata :',GroupMasterdata)
#             GroupMasterdata_list = list(GroupMasterdata.values())
#             print('GroupMasterdata_list :',GroupMasterdata_list)
#             for index , i in enumerate(GroupMasterdata_list,start=1):
#                 Department_id = i.get("Department_id")
#                 GroupCode = i.get("Group_Code")
                
                
#                 Subdepartmentinstance = SubLab_Department_Detials.objects.filter(SubDepartment_Code=Department_id).first()
#                 Testmaster_Cost_List_instance = Testmaster_Cost_List.objects.filter(Group_Code=GroupCode).first()

#                 i["Sub_DepartmentName"] = Subdepartmentinstance.SubDepartment_Name
#                 i["id"] = index
#                 i["Amount"] = Testmaster_Cost_List_instance.Basic
                
#                 Group_TestList = Group_Master_TestList.objects.filter(Group_Code=GroupCode)
#                 Group_TestList_data = list(Group_TestList.values())
                
#                 for index,j in enumerate(Group_TestList_data,start=1):
#                     GroupCode_in_List = j.get("Group_Code_id")
#                     TestCode_GML = j.get("Test_Code_id")
#                     print('GroupCode_in_List :',GroupCode_in_List)
#                     Testdetails = Test_Descriptions.objects.filter(Test_Code=TestCode_GML).first()
                    
#                     j["id"] = index
#                     j["Test_Code"] = TestCode_GML
#                     j["group_code"] = GroupCode_in_List
#                     j["test_name"] = Testdetails.Test_Name
#                     j["department"] = Testdetails.department.Department_Name
#                     j["sub_department"] = Testdetails.sub_department.SubDepartment_Name
#                     j["Header"] = Testdetails.Header
#                     j["Billing_Name"] = Testdetails.Billing_Name
                    
#                     if GroupCode_in_List == GroupCode:
#                         i["GroupList"] = Group_TestList_data
                
#             return JsonResponse(GroupMasterdata_list,safe=False)
#         elif Type == "Get_AllTests_For_AgeSetup":
#             test_data = Test_Descriptions.objects.filter(Status="Active")
    
#             response_data = []
#             id_counter = 1
#             # Iterate over each Test_Description
#             for index,test in enumerate(test_data,start=1):
#                 # Fetch related Age_Setup_Master data based on Test_Code
#                 age_setup_data = Age_Setup_Master.objects.filter(Test_Code=test.Test_Code)
                
#                 # Prepare the dictionary for each Test_Description
#                 test_dict = {}
        
#                 # Add all fields from the Test_Descriptions model
#                 for field in test._meta.get_fields():
#                     if field.is_relation:
#                         # Skip ForeignKeys or related fields (if you don't want to include them)
#                         continue
#                     field_name = field.name
#                     field_value = getattr(test, field_name)
#                     test_dict[field_name] = field_value
                
#                 # Add Age_Setup_Master fields to the test_dict
#                 for index,age in enumerate(age_setup_data,start=1):
#                     for field in age._meta.get_fields():
#                         # Skip ForeignKeys or related fields to avoid redundant data
#                         if field.is_relation:
#                             continue
#                         field_name = field.name
#                         test_dict[field_name] = getattr(age, field.name)
                
#                 test_dict["id"] = id_counter
        
#                 # Increment the ID counter for the next entry
#                 id_counter += 1
#                 response_data.append(test_dict)

#             # Return the combined data as a JSON response
#             return JsonResponse(response_data, safe=False)
     
#         elif Type == "Get_AllTests_For_Reflex":
#             test_data = Test_Descriptions.objects.filter(Status="Active")
    
#             response_data = []
#             id_counter = 1
#             # Iterate over each Test_Description
#             for index,test in enumerate(test_data,start=1):
#                 # Fetch related Age_Setup_Master data based on Test_Code
#                 age_setup_data = Testmaster_Reflex_Test.objects.filter(Test_Code=test.Test_Code)
                
#                 # Prepare the dictionary for each Test_Description
#                 test_dict = {}
        
#                 # Add all fields from the Test_Descriptions model
#                 for field in test._meta.get_fields():
#                     if field.is_relation:
#                         # Skip ForeignKeys or related fields (if you don't want to include them)
#                         continue
#                     field_name = field.name
#                     field_value = getattr(test, field_name)
#                     test_dict[field_name] = field_value
                
#                 # Add Age_Setup_Master fields to the test_dict
#                 for index,age in enumerate(age_setup_data,start=1):
#                     for field in age._meta.get_fields():
#                         # Skip ForeignKeys or related fields to avoid redundant data
#                         if field.is_relation:
#                             continue
#                         field_name = field.name
#                         test_dict[field_name] = getattr(age, field.name)
                
#                 test_dict["id"] = id_counter
        
#                 # Increment the ID counter for the next entry
#                 id_counter += 1
#                 response_data.append(test_dict)

#             # Return the combined data as a JSON response
#             return JsonResponse(response_data, safe=False)
#         elif Type == "Get_AllTests_For_Interpretation":
#             test_data = Test_Descriptions.objects.filter(Status="Active")
    
#             response_data = []
#             id_counter = 1
#             # Iterate over each Test_Description
#             for index,test in enumerate(test_data,start=1):
#                 # Fetch related Age_Setup_Master data based on Test_Code
#                 age_setup_data = Testmaster_Interpretation_table.objects.filter(Test_Code=test.Test_Code)
                
#                 # Prepare the dictionary for each Test_Description
#                 test_dict = {}
        
#                 # Add all fields from the Test_Descriptions model
#                 for field in test._meta.get_fields():
#                     if field.is_relation:
#                         # Skip ForeignKeys or related fields (if you don't want to include them)
#                         continue
#                     field_name = field.name
#                     field_value = getattr(test, field_name)
#                     test_dict[field_name] = field_value
                
#                 # Add Age_Setup_Master fields to the test_dict
#                 for index,age in enumerate(age_setup_data,start=1):
#                     for field in age._meta.get_fields():
#                         # Skip ForeignKeys or related fields to avoid redundant data
#                         if field.is_relation:
#                             continue
#                         field_name = field.name
#                         test_dict[field_name] = getattr(age, field.name)
                
#                 test_dict["id"] = id_counter
        
#                 # Increment the ID counter for the next entry
#                 id_counter += 1
#                 response_data.append(test_dict)

#             # Return the combined data as a JSON response
#             return JsonResponse(response_data, safe=False)
        
        
        
#         else:
#             return JsonResponse({"message": "Type Required"})


@csrf_exempt
def All_Other_Lab_Masters_POST_AND_GET(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print('data :',data)
            
            if isinstance(data, dict):
                Type = data.get("Type")
            elif isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
                Type = data[0].get("Type")
            else:
                Type = None
            print('Type :',Type)
            
            ResponseMsg = data.get("ResponseMsg")
            
            if Type == "MainDepartment":
                is_edit = data.get('isEdit')
                department_code = data.get('Department_Code')

                if is_edit:
                    try:
                        instance = Lab_Department_Detials.objects.get(Department_Code=department_code)
                        print('instance :', instance)
                        serializers = MainDepartmentSerializer(instance, data=data, partial=True)  # partial=True allows partial updates
                        print('serializers :', serializers)
                        if serializers.is_valid():
                            serializers.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            print('error :', serializers.errors)
                            return JsonResponse(serializers.errors)
                    except Lab_Department_Detials.DoesNotExist:
                        return JsonResponse({"error": "Department not found."})
                else:
                    serializers = MainDepartmentSerializer(data=data)
                    print('serializers :', serializers)
                    if serializers.is_valid():
                        serializers.save()
                        return JsonResponse({"success": f"{ResponseMsg} successfully."})
                    else:
                        print('error :', serializers.errors)
                        return JsonResponse(serializers.errors)
            
            
            elif Type == "SubMainDepartment":
                is_edit = data.get('isEdit')
                SubDepartment_Code = data.get('SubDepartment_Code')

                if is_edit:
                    try:
                        # Fetch the existing instance
                        instance = SubLab_Department_Detials.objects.get(SubDepartment_Code=SubDepartment_Code)
                        serializer = SubLabDepartmentSerializer(instance, data=data, partial=True)
                        if serializer.is_valid():
                            serializer.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            print(serializer.errors)
                            return JsonResponse(serializer.errors)
                    except SubLab_Department_Detials.DoesNotExist:
                        return JsonResponse({"error": "Sub Department not found."})
                else:
                    # Handle create case
                    serializer = SubLabDepartmentSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        return JsonResponse({"success": f"{ResponseMsg} successfully."})
                    else:
                        return JsonResponse(serializer.errors)
            elif Type == "ContainerMaster":
                is_edit = data.get('isEdit')
                Container_Code = data.get('Container_Code')

                if is_edit:
                    try:
                        instance = Container_Masters.objects.get(Container_Code=Container_Code)
                        print('instance :', instance)
                        serializers = ContainerMastersSerializer(instance, data=data, partial=True)  # partial=True allows partial updates
                        print('serializers :', serializers)
                        if serializers.is_valid():
                            serializers.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            print('error :', serializers.errors)
                            return JsonResponse(serializers.errors)
                    except Container_Masters.DoesNotExist:
                        return JsonResponse({"error": "Department not found."})
                else:
                    serializers = ContainerMastersSerializer(data=data)
                    print('serializers :', serializers)
                    if serializers.is_valid():
                        serializers.save()
                        return JsonResponse({"success": f"{ResponseMsg} successfully."})
                    else:
                        print('error :', serializers.errors)
                        return JsonResponse(serializers.errors)
            elif Type == "UnitMaster":
                is_edit = data.get('isEdit')
                Unit_Code = data.get('Unit_Code')

                if is_edit:
                    try:
                        instance = Unit_Masters.objects.get(Unit_Code=Unit_Code)
                        serilizer = UnitMasterSerilizer(instance,data=data,partial=True)
                        if serilizer.is_valid():
                            serilizer.save()
                            return JsonResponse({"success":f"{ResponseMsg} Successfully"})
                        else:
                            return JsonResponse(serializer.errors)
                    except Unit_Masters.DoesNotExist:
                        return JsonResponse({"warn":"Unit Not Found"})
                else:
                    serilizer = UnitMasterSerilizer(data=data)
                    if serilizer.is_valid():
                        serilizer.save()
                        return JsonResponse({"success":f"{ResponseMsg} Successfully"})
                    else:
                        return JsonResponse(serilizer.errors)
            elif Type == "SpecimenMaster":
                is_edit = data.get('isEdit')
                Specimen_Code = data.get('Specimen_Code')

                if is_edit:
                    try:
                        instance = Specimen_Masters.objects.get(Specimen_Code=Specimen_Code)
                        print('instance :', instance)
                        serializers = SpecimenMasterSerializer(instance, data=data, partial=True)  # partial=True allows partial updates
                        print('serializers :', serializers)
                        if serializers.is_valid():
                            serializers.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            print('error :', serializers.errors)
                            return JsonResponse(serializers.errors)
                    except Container_Masters.DoesNotExist:
                        return JsonResponse({"error": "Specimen not found."})
                else:
                    serializers = SpecimenMasterSerializer(data=data)
                    print('serializers :', serializers)
                    if serializers.is_valid():
                        serializers.save()
                        return JsonResponse({"success": f"{ResponseMsg} successfully."})
                    else:
                        print('error :', serializers.errors)
                        return JsonResponse(serializers.errors)
            elif Type == "MethodsMaster":
                is_edit = data.get('isEdit')
                Method_Code = data.get('Method_Code')

                if is_edit:
                    try:
                        instance = Methods_Masters.objects.get(Method_Code=Method_Code)
                        serilizer = MethodMasterSerializer(instance,data=data,partial=True)
                        if serilizer.is_valid():
                            serilizer.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            return JsonResponse(serilizer.errors)
                    except Methods_Masters.DoesNotExist:
                        return JsonResponse({"warn":"Method Not Found"})
                else:
                    serializer = MethodMasterSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        return JsonResponse({"success": f"{ResponseMsg} Successfullly"})
                    else:
                        return JsonResponse(serializer.errors)                 
            elif Type == "AntibioticMaster":
                is_edit = data.get('isEdit')
                anti_biotic_group_code = data.get('anti_biotic_group_code')
                anti_biotic_code = data.get("anti_biotic_code")
                print('is_edit :',is_edit)
                if is_edit:
                    try:
                        instance = AntibioticMaster.objects.get(anti_biotic_code=anti_biotic_code,anti_biotic_group_code=anti_biotic_group_code)
                        serializer = AntibioticMasterSerializer(instance,data=data,partial=True)
                        if serializer.is_valid():
                            serializer.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            print('wrro :',serializer.errors)
                            return JsonResponse(serializer.errors)
                    except AntibioticMaster.DoesNotExist:
                        return JsonResponse({"warn": "Antiobiotic Not Found"})
                else:
                    last_anti_biotic_id = AntibioticMaster.objects.aggregate(
                    Max("anti_biotic_id")
                    )["anti_biotic_id__max"]
                    next_anti_biotic_id = 1 if last_anti_biotic_id is None else int(last_anti_biotic_id) + 1

                    data["anti_biotic_id"] = next_anti_biotic_id
                    
                    instance = AntibioticMasterSerializer(data=data)
                    if instance.is_valid():
                        instance.save()
                        return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                    else:
                        print('error :',instance.errors)
                        return JsonResponse(instance.errors)
            elif Type == "OrganismMaster":
                is_edit = data.get('isEdit')
                Organism_Code = data.get('Organism_Code')
                
                if is_edit:
                    try:
                        exist_instance = Organism_Masters.objects.get(Organism_Code=Organism_Code)
                        serializer = OrganismMasterSerializer(exist_instance,data=data,partial=True)
                        if serializer.is_valid():
                            serializer.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            return JsonResponse({"warn":serializer.errors})   
                    except Organism_Masters.DoesNotExist:
                        return JsonResponse({"warn": "Organism Not Found"})
                else:
                    new_instance = OrganismMasterSerializer(data=data)
                    if new_instance.is_valid():
                        new_instance.save()
                        return JsonResponse({"success": f"{ResponseMsg} Successfully"}) 
                    else:
                        return JsonResponse({"warn": new_instance.errors})            
            elif Type == "LabRemarksData":
                # Get department data from the request
                LabRemarks = data.get("LabRemarks")
                LabRemarkID = data.get("LabRemarkID")
                createdby = data.get("createdby")
                Department = data.get("Department")

                if not LabRemarks or not LabRemarkID:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Organism name and code are required.",
                        },
                        status=400,
                    )

                # Check if a department with the same code exists
                existing_Remark = LabRemarksMaster.objects.filter(
                    LabRemarkID=LabRemarkID
                ).first()
                if existing_Remark:
                    # Update existing record
                    existing_Remark.LabRemarks = LabRemarks
                    existing_Remark.Department = Department
                    existing_Remark.save()
                    message = "LabRemarks updated successfully."
                else:
                    # Create new record
                    LabRemarksMaster.objects.create(
                        LabRemarkID=LabRemarkID,
                        Department=Department,
                        LabRemarks=LabRemarks,
                        created_by=createdby,
                    )
                    message = "New LabRemarks created successfully."

                return JsonResponse({"success": True, "message": message}, status=200)
            elif Type == "RemarksMaster":
                is_edit = data.get('isEdit')
                Remark_Id = data.get('Remark_Id')
                
                
                if is_edit:
                    try:
                        exist_instance = Remarks_master.objects.get(Remark_Id=Remark_Id)
                        serializer = RemarksMasterSerializer(exist_instance,data=data,partial=True)
                        if serializer.is_valid():
                            serializer.save()
                            return JsonResponse({"success": f"{ResponseMsg} Successfully"})
                        else:
                            return JsonResponse({"warn":serializer.errors})   
                    except Remarks_master.DoesNotExist:
                        return JsonResponse({"warn": "Remark Not Found"})
                else:
                    new_instance = RemarksMasterSerializer(data=data)
                    if new_instance.is_valid():
                        new_instance.save()
                        return JsonResponse({"success": f"{ResponseMsg} Successfully"}) 
                    else:
                        return JsonResponse({"warn": new_instance.errors}) 
            elif Type == "ReasonMaster":
                # Get department data from the request
                ReasonId = data.get("ReasonID")
                Reason = data.get("Reason")
                createdby = data.get("createdby")

                if not ReasonId or not Reason:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Reason and Id are required.",
                        },
                        status=400,
                    )

                # Check if a department with the same code exists
                existing_Reason = Reason_master.objects.filter(
                    Reason_Id=ReasonId
                ).first()

                if existing_Reason:
                    # Update existing record
                    existing_Reason.Reason = Reason
                    existing_Reason.save()
                    message = "Reason updated successfully."
                else:
                    # Create new record
                    Reason_master.objects.create(
                        Reason_Id=ReasonId,
                        Reason=Reason,
                        created_by=createdby,
                    )
                    message = "New Reason created successfully."

                return JsonResponse({"success": True, "message": message}, status=200)
            elif Type == "QualificationMaster":
                # Get department data from the request
                QualificationId = data.get("QualificationID")
                Qualification = data.get("Qualification")
                createdby = data.get("createdby")

                if not QualificationId or not Qualification:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Qualification and Id are required.",
                        },
                        status=400,
                    )

                # Check if a department with the same code exists
                existing_Qualification = Qualification_master.objects.filter(
                    Qualification_Id=QualificationId
                ).first()

                existing_Qualification_name = Qualification_master.objects.filter(
                    Qualification=Qualification
                ).first()

                if existing_Qualification:

                    if existing_Qualification_name:
                        print(f"The {Qualification} name already exists.")
                        message = f"The {Qualification} name already exists."
                        success = False
                    else:

                        # Update existing record
                        existing_Qualification.Qualification = Qualification
                        existing_Qualification.save()
                        message = "Qualification updated successfully."
                        success = True

                elif existing_Qualification_name:

                    message = f"The {Qualification} name already exists."
                    success = False
                else:
                    # Create new record
                    Qualification_master.objects.create(
                        Qualification_Id=QualificationId,
                        Qualification=Qualification,
                        created_by=createdby,
                    )
                    message = "New Qualification created successfully."
                    success = True

                return JsonResponse({"success": success, "message": message})
            elif Type == "ExternalLabMaster":
                labName = data.get("labName")
                address = data.get("address")
                email = data.get("email")
                registerNo = data.get("registerNo")
                phoneNumber = data.get("phoneNumber")
                pincode = data.get("pincode")
                referenceCode = data.get("referenceCode")
                source = data.get("source")
                location = data.get("location")
                created_by = data.get("createdby")
                IsEditMode = data.get("IsEditMode")
                labcode = data.get("labCode")  # Assuming labcode is passed
                Status = "Active"
                # Check if labcode is provided

                if not labcode:
                    return JsonResponse(
                        {"success": False, "message": "Lab Code Required"}
                    )
                print('IsEditMode :',IsEditMode)
                if IsEditMode:
                    External_Client_Master_ins = External_Lab_Master.objects.get(
                        LabCode=labcode
                    )
                    External_Client_Master_ins.LabName = labName
                    External_Client_Master_ins.RegisterNo = registerNo
                    External_Client_Master_ins.Address = address
                    External_Client_Master_ins.Email = email
                    External_Client_Master_ins.PhoneNo = phoneNumber
                    External_Client_Master_ins.Pincode = pincode
                    External_Client_Master_ins.ReferenceCode = referenceCode
                    External_Client_Master_ins.Location = location
                    External_Client_Master_ins.SourceType = source
                    External_Client_Master_ins.save()
                    message = {
                        "success": True,
                        "message": "Lab Details Updated successfully",
                    }

                else:
                    if External_Lab_Master.objects.filter(LabCode=labcode).exists():
                        External_Client_Master_ins = External_Lab_Master.objects.get(
                            LabCode=labcode
                        )
                        External_Client_Master_ins.LabName = labName
                        External_Client_Master_ins.RegisterNo = registerNo
                        External_Client_Master_ins.Address = address
                        External_Client_Master_ins.Email = email
                        External_Client_Master_ins.PhoneNo = phoneNumber
                        External_Client_Master_ins.Pincode = pincode
                        External_Client_Master_ins.ReferenceCode = referenceCode
                        External_Client_Master_ins.Location = location
                        External_Client_Master_ins.SourceType = source
                        External_Client_Master_ins.save()
                        message = {
                            "success": True,
                            "message": "Lab Details Updated successfully",
                        }
                    else:
                        External_Client_Master_ins = External_Lab_Master(
                            LabCode=labcode,
                            LabName=labName,
                            RegisterNo=registerNo,
                            Address=address,
                            Email=email,
                            PhoneNo=phoneNumber,
                            Pincode=pincode,
                            ReferenceCode=referenceCode,
                            Location=location,
                            SourceType=source,
                            created_by=created_by,
                            Status=Status,
                        )

                        column_name = f"{labcode}"  # Generate a unique column name
                        with connection.cursor() as cursor:
                            # Add the new column with default value 0.000 after the 'Basic' column
                            cursor.execute(
                                f"""
        ALTER TABLE Testmaster_Cost_List
        ADD COLUMN {column_name} DECIMAL(10,3) DEFAULT 0.000
        AFTER Basic;
        """
                            )

                        External_Client_Master_ins.save()
                        message = {
                            "success": True,
                            "message": "New Lab Created successfully",
                        }

                return JsonResponse(message)
            elif Type == "ReferDoctorMaster":
                DoctorName = data.get("doctorname")
                Title = data.get("title")
                Qualification1 = data.get("Qualification")
                DoctorType = data.get("doctortype")
                PhoneNo = data.get("phone")
                Commission_per = data.get("commission")
                PaymentType = data.get("PaymentType")
                Address = data.get("address1")
                Address2 = data.get("address2")
                Status = "Active"
                created_by = data.get("createdby")
                BankName = data.get("Bankname")
                HolderName = data.get("HolderName")
                AccountNo = data.get("AccNumber")
                DoctorID = data.get("DoctorID")
                IsEditMode = data.get("isEdit")

                if not DoctorID:
                    return JsonResponse(
                        {"success": False, "message": "DoctorID Required"}
                    )

                Qualification2 = Qualification_master.objects.filter(
                    Qualification_Id=Qualification1
                ).first()

                print("DoctorID :", DoctorID)
                if IsEditMode == True:
                    ReferDoctorMaster_ins = Refering_Doctor_Details.objects.get(
                        DoctorID=DoctorID
                    )
                    print("ReferDoctorMaster_ins :", ReferDoctorMaster_ins)
                    ReferDoctorMaster_ins.Title = Title
                    ReferDoctorMaster_ins.DoctorName = DoctorName
                    ReferDoctorMaster_ins.Qualification = Qualification2
                    ReferDoctorMaster_ins.DoctorType = DoctorType
                    ReferDoctorMaster_ins.PhoneNo = PhoneNo
                    ReferDoctorMaster_ins.Commission_per = Commission_per
                    ReferDoctorMaster_ins.PaymentType = PaymentType
                    ReferDoctorMaster_ins.BankName = BankName
                    ReferDoctorMaster_ins.HolderName = HolderName
                    ReferDoctorMaster_ins.AccountNo = AccountNo
                    ReferDoctorMaster_ins.Address = Address
                    ReferDoctorMaster_ins.Address2 = Address2
                    ReferDoctorMaster_ins.save()
                    message = {
                        "success": True,
                        "message": "Refer Doctor Updated successfully",
                    }

                else:
                    if Refering_Doctor_Details.objects.filter(
                        DoctorID=DoctorID
                    ).exists():
                        ReferDoctorMaster_ins = Refering_Doctor_Details.objects.get(
                            DoctorID=DoctorID
                        )
                        ReferDoctorMaster_ins.Title = Title
                        ReferDoctorMaster_ins.DoctorName = DoctorName
                        ReferDoctorMaster_ins.Qualification = Qualification2
                        ReferDoctorMaster_ins.DoctorType = DoctorType
                        ReferDoctorMaster_ins.PhoneNo = PhoneNo
                        ReferDoctorMaster_ins.Commission_per = Commission_per
                        ReferDoctorMaster_ins.PaymentType = PaymentType
                        ReferDoctorMaster_ins.BankName = BankName
                        ReferDoctorMaster_ins.HolderName = HolderName
                        ReferDoctorMaster_ins.AccountNo = AccountNo
                        ReferDoctorMaster_ins.Address = Address
                        ReferDoctorMaster_ins.Address2 = Address2
                        ReferDoctorMaster_ins.save()
                        message = {
                            "success": True,
                            "message": "Refer Doctor Updated successfully",
                        }
                    else:
                        ReferDoctorMaster_ins = Refering_Doctor_Details(
                            DoctorID=DoctorID,
                            Title=Title,
                            DoctorName=DoctorName,
                            Qualification=Qualification2,
                            DoctorType=DoctorType,
                            PhoneNo=PhoneNo,
                            Commission_per=Commission_per,
                            PaymentType=PaymentType,
                            BankName=BankName,
                            HolderName=HolderName,
                            AccountNo=AccountNo,
                            Address=Address,
                            Address2=Address2,
                            Status=Status,
                            created_by=created_by,
                        )

                        ReferDoctorMaster_ins.save()
                        message = {
                            "success": True,
                            "message": "Doctor Registered successfully",
                        }

                return JsonResponse(message)
            elif Type == "TestMaster":
                # Get department data from the request
                testName = data.get("testName")
                testCode = data.get("testCode")

                department = data.get("department")
                departmentcode = data.get("departmentcode")
                department1 = Lab_Department_Detials.objects.filter(
                    Department_Code=departmentcode
                ).first()

                subdepartment = data.get("subdepartment")
                subdepartmentcode = data.get("subdepartmentcode")
                subdepartment1 = SubLab_Department_Detials.objects.filter(
                    SubDepartment_Code=subdepartmentcode
                ).first()

                header = data.get("header")
                displayText = data.get("displayText")
                billingName = data.get("billingName")
                container = data.get("container")
                containercode = data.get("containercode")
                container1 = Container_Masters.objects.filter(
                    Container_Code=containercode
                ).first()

                specimen = data.get("specimen")
                specimencode = data.get("specimencode")
                specimen1 = Specimen_Masters.objects.filter(
                    Specimen_Code=specimencode
                ).first()
                method = data.get("method")
                methodcode = data.get("methodcode")
                method1 = Methods_Masters.objects.filter(Method_Code=methodcode).first()

                gender = data.get("gender")
                inputType = data.get("inputType")
                decimalPlaces = data.get("decimalPlaces")
                decimalPlaces1 = decimalPlaces if decimalPlaces != "" else 0
                inputPatternType = data.get("inputPatternType")
                testCategory = data.get("testCategory")
                logicalCategory = data.get("logicalCategory")
                capturedUnit = data.get("capturedUnit")
                capturedUnit1 = capturedUnit if capturedUnit != "" else None
                uom = data.get("uom")
                uomcode = data.get("uomcode")

                uom1 = Unit_Masters.objects.filter(Unit_Code=uomcode).first()

                reportType = data.get("reportType")
                testInstruction = data.get("testInstruction")
                loincCode = data.get("loincCode")
                allowDiscount = data.get("allowDiscount")
                orderable = data.get("orderable")
                showGraph = data.get("showGraph")
                stat = data.get("stat")
                nonReportable = data.get("nonReportable")
                calculatedTest = data.get("calculatedTest")
                isOutsourced = data.get("isOutsourced")
                minimumtime = data.get("minimumtime")
                Emergencytime = data.get("Emergencytime")
                timeperiod = data.get("timeperiod")
                formula = data.get("formula")
                paraone = data.get("paraone")
                paratwo = data.get("paratwo")
                Culturetest = data.get("Culturetest")
                Checkout = data.get("Checkout")
                isNABHL = data.get("isNABHL")
                isCAP = data.get("isCAP")
                is_Machine_Interfaced = data.get("is_Machine_Interfaced")
                Reagentlevel = data.get("Reagentlevel")
                AssayCode = data.get("AssayCode")
                IsSubTest = data.get("IsSubTest")
                Iscutoffvalue = data.get("Iscutoffvalue")
                SubTestCodes = data.get("SubTestCodes")
                Captured_Unit_UOM = data.get("Captured_Unit_UOM")
                created_by = data.get("created_by")

                # Check if a department with the same code exists
                existing_Test_Descriptions = Test_Descriptions.objects.filter(
                    Test_Code=testCode
                ).first()

                if existing_Test_Descriptions:
                    existing_Test_Descriptions.Test_Name = (testName,)
                    existing_Test_Descriptions.department = (department,)
                    existing_Test_Descriptions.sub_department = (subdepartment,)
                    existing_Test_Descriptions.Header = (header,)
                    existing_Test_Descriptions.Billing_Name = (billingName,)
                    existing_Test_Descriptions.DisplayText = (displayText,)
                    existing_Test_Descriptions.Container_Name = (container,)
                    existing_Test_Descriptions.Specimen_Name = (specimen,)
                    existing_Test_Descriptions.Method_Name = (method,)
                    existing_Test_Descriptions.Gender = (gender,)
                    existing_Test_Descriptions.Input_Type = (inputType,)
                    existing_Test_Descriptions.Decimal_Palces = (decimalPlaces1,)
                    existing_Test_Descriptions.Input_Pattern_Type = (inputPatternType,)
                    existing_Test_Descriptions.Test_Category = (testCategory,)
                    existing_Test_Descriptions.Logical_Category = (logicalCategory,)
                    existing_Test_Descriptions.Captured_Unit = (capturedUnit1,)
                    existing_Test_Descriptions.Captured_Unit_UOM = (Captured_Unit_UOM,)
                    existing_Test_Descriptions.UOM = (uom,)
                    existing_Test_Descriptions.Report_Type = (reportType,)
                    existing_Test_Descriptions.Test_InstdisplayTextructions = (
                        testInstruction,
                    )
                    existing_Test_Descriptions.Loinc_Code = (loincCode,)
                    existing_Test_Descriptions.Allow_Discount = (allowDiscount,)
                    existing_Test_Descriptions.Oderable = (orderable,)
                    existing_Test_Descriptions.Show_Graph = (showGraph,)
                    existing_Test_Descriptions.STAT = (stat,)
                    existing_Test_Descriptions.Non_Reportable = (nonReportable,)
                    existing_Test_Descriptions.Calculated_Test = (calculatedTest,)
                    existing_Test_Descriptions.Outsourced = (isOutsourced,)
                    existing_Test_Descriptions.Processing_Time = (minimumtime,)
                    existing_Test_Descriptions.Emergency_Processing_Time = (
                        Emergencytime,
                    )
                    existing_Test_Descriptions.Period_Type = (timeperiod,)
                    existing_Test_Descriptions.Formula = (formula,)
                    existing_Test_Descriptions.Routine = (paraone,)
                    existing_Test_Descriptions.TimeGap = (paratwo,)
                    existing_Test_Descriptions.Autocheck = (Checkout,)
                    existing_Test_Descriptions.Culturetest = (Culturetest,)
                    existing_Test_Descriptions.Is_NABHL = (isNABHL,)
                    existing_Test_Descriptions.Is_CAP = (isCAP,)
                    existing_Test_Descriptions.Is_Machine_Interfaced = (
                        is_Machine_Interfaced,
                    )
                    existing_Test_Descriptions.Machine_Name = (None,)
                    existing_Test_Descriptions.Assay_Code = (AssayCode,)
                    existing_Test_Descriptions.IsSubTest = (IsSubTest,)

                    existing_Test_Descriptions.Iscutoffvalue = (Iscutoffvalue,)
                    existing_Test_Descriptions.SubTestCodes = (SubTestCodes,)
                    existing_Test_Descriptions.created_by = (created_by,)
                    existing_Test_Descriptions.save()
                    message = "Test updated successfully."
                else:

                    with transaction.atomic():
                        # Insert into Test_Descriptions
                        test_description = Test_Descriptions.objects.create(
                            Test_Code=testCode,
                            Test_Name=testName,
                            department=department1,
                            sub_department=subdepartment1,
                            Header=header,
                            Billing_Name=billingName,
                            DisplayText=displayText,
                            Container_Name=container1,
                            Specimen_Name=specimen1,
                            Method_Name=method1,
                            Gender=gender,
                            Input_Type=inputType,
                            Decimal_Palces=decimalPlaces1,
                            Input_Pattern_Type=inputPatternType,
                            Test_Category=testCategory,
                            Logical_Category=logicalCategory,
                            Captured_Unit=capturedUnit1,
                            Captured_Unit_UOM=Captured_Unit_UOM,
                            UOM=uom1,
                            Report_Type=reportType,
                            Test_Instructions=testInstruction,
                            Loinc_Code=loincCode,
                            Allow_Discount=allowDiscount,
                            Oderable=orderable,
                            Show_Graph=showGraph,
                            STAT=stat,
                            Non_Reportable=nonReportable,
                            Calculated_Test=calculatedTest,
                            Outsourced=isOutsourced,
                            Processing_Time=minimumtime,
                            Emergency_Processing_Time=Emergencytime,
                            Period_Type=timeperiod,
                            Formula=formula,
                            Routine=paraone,
                            TimeGap=paratwo,
                            Autocheck=Checkout,
                            Culturetest=Culturetest,
                            Is_NABHL=isNABHL,
                            Is_CAP=isCAP,
                            Is_Machine_Interfaced=is_Machine_Interfaced,
                            Machine_Name=None,
                            Assay_Code=AssayCode,
                            Status="Active",
                            IsSubTest=IsSubTest,
                            Iscutoffvalue=Iscutoffvalue,
                            SubTestCodes=SubTestCodes,
                            ResultValues=None,
                            created_by=created_by,
                        )

                        # Prepare default data for other tables
                        test_name = test_description.Test_Name
                        test_code = test_description.Test_Code

                        test_description_instance = Test_Descriptions.objects.get(
                            Test_Code=test_code
                        )

                        Testmaster_Remarks_Test_Id = (
                            Testmaster_Remarks.objects.aggregate(Max("Test_Id"))[
                                "Test_Id__max"
                            ]
                        )
                        next_Testmaster_Remarks_Test_Id = (
                            1
                            if Testmaster_Remarks_Test_Id is None
                            else int(Testmaster_Remarks_Test_Id) + 1
                        )

                        # Insert into Testmaster_Remarks
                        Testmaster_Remarks.objects.create(
                            Test_Id=next_Testmaster_Remarks_Test_Id,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Validation=None,
                            Remark_Type=None,
                            Remark=None,
                            created_by=created_by,
                        )

                        Testmaster_Reference_Range_Test_Id = (
                            Testmaster_Reference_Range.objects.aggregate(
                                Max("Test_Id")
                            )["Test_Id__max"]
                        )
                        next_Testmaster_Reference_Range_Test_Id = (
                            1
                            if Testmaster_Reference_Range_Test_Id is None
                            else int(Testmaster_Reference_Range_Test_Id) + 1
                        )

                        # Insert into Testmaster_Reference_Range
                        Testmaster_Reference_Range.objects.create(
                            Test_Id=next_Testmaster_Reference_Range_Test_Id,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Analizer_Type=None,
                            validation=None,
                            Method_Type=None,
                            Gender="Both",
                            Range_Lower_Limit=None,
                            Range_Higher_Limit=None,
                            Reference_Range_Text=None,
                            created_by=created_by,
                        )

                        Testmaster_Cost_List_Test_Id = (
                            Testmaster_Cost_List.objects.aggregate(Max("Test_Id"))[
                                "Test_Id__max"
                            ]
                        )
                        next_Testmaster_Cost_List_Test_Id = (
                            1
                            if Testmaster_Cost_List_Test_Id is None
                            else int(Testmaster_Cost_List_Test_Id) + 1
                        )

                        # Insert into Cost_List_Table
                        Testmaster_Cost_List.objects.create(
                            Test_Id=next_Testmaster_Cost_List_Test_Id,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Basic=0,
                            created_by=created_by,
                        )

                        Testmaster_Rule_Based_Test_Id = (
                            Testmaster_Rule_Based.objects.aggregate(Max("Test_Id"))[
                                "Test_Id__max"
                            ]
                        )
                        next_Testmaster_Rule_Based_Test_Id = (
                            1
                            if Testmaster_Rule_Based_Test_Id is None
                            else int(Testmaster_Rule_Based_Test_Id) + 1
                        )

                        Testmaster_Rule_Based.objects.create(
                            Test_Id=next_Testmaster_Rule_Based_Test_Id,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Validation_type=None,
                            Gender=None,
                            Rule_Type=None,
                            Remark=None,
                            created_by=created_by,
                        )

                        Testmaster_Interpretation_table_Test_Id = (
                            Testmaster_Interpretation_table.objects.aggregate(
                                Max("Test_Id")
                            )["Test_Id__max"]
                        )
                        next_Testmaster_Interpretation_table_Test_Id = (
                            1
                            if Testmaster_Interpretation_table_Test_Id is None
                            else int(Testmaster_Interpretation_table_Test_Id) + 1
                        )

                        Testmaster_Interpretation_table.objects.create(
                            Test_Id=next_Testmaster_Interpretation_table_Test_Id,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Header_interpretation=None,
                            Comments=None,
                            created_by=created_by,
                        )

                        Testmaster_Reflex_Test_Test_Id = (
                            Testmaster_Reflex_Test.objects.aggregate(Max("Test_Id"))[
                                "Test_Id__max"
                            ]
                        )
                        next_Testmaster_Reflex_Test_Test_Id = (
                            1
                            if Testmaster_Reflex_Test_Test_Id is None
                            else int(Testmaster_Reflex_Test_Test_Id) + 1
                        )

                        Testmaster_Reflex_Test.objects.create(
                            Test_Id=next_Testmaster_Reflex_Test_Test_Id,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Reflex_Test=None,
                            Reflex_Code=None,
                            created_by=created_by,
                        )

                        Testmaster_Age_Setup_Master = (
                            Age_Setup_Master.objects.aggregate(Max("Test_Id"))[
                                "Test_Id__max"
                            ]
                        )
                        next_Testmaster_Age_Setup_Master = (
                            1
                            if Testmaster_Age_Setup_Master is None
                            else int(Testmaster_Age_Setup_Master) + 1
                        )

                        # Insert into Age_Setup_Master
                        Age_Setup_Master.objects.create(
                            Test_Id=next_Testmaster_Age_Setup_Master,
                            Test_Code=test_description_instance,
                            # Test_Name=test_name,
                            Gender="Both",
                            FromAge=None,
                            FromAgeType=None,
                            Toage=None,
                            ToAgeType=None,
                            From_Value=None,
                            To_Value=None,
                            PanicLow=None,
                            PanicHigh=None,
                            NormalValue=None,
                            Reference_Range=None,
                            created_by=created_by,
                        )

                    message = "New Test created successfully."

                return JsonResponse({"success": True, "message": message}, status=200)
            elif Type == "DepartmentOrderMaster":

                with connection.cursor() as cursor:
                    cursor.execute("TRUNCATE TABLE DepartmentOrderMaster")
                for order in data:
                    DepartmentOrderMaster_S_No = DepartmentOrderMaster.objects.aggregate(
                    Max("S_No")
                    )["S_No__max"]
                    print('DepartmentOrderMaster_S_No :',DepartmentOrderMaster_S_No)
                    next_DepartmentOrderMaster_S_No = (
                        1
                        if DepartmentOrderMaster_S_No is None
                        else int(DepartmentOrderMaster_S_No) + 1
                    )
                    print('next_DepartmentOrderMaster_S_No :',next_DepartmentOrderMaster_S_No)
                    # Get or create SubLab_Department_Detials
                    subdepartment_code = order.get("SubDepartment_Code")
                    CreatedBy = order.get("created_by")
                    DepartmentOrderID = order.get("OrderID")

                    subdepartment = SubLab_Department_Detials.objects.filter(
                        SubDepartment_Code=subdepartment_code
                    ).first()

                    # Insert into DepartmentOrderMaster
                    DepartmentOrderMaster.objects.create(
                        S_No=next_DepartmentOrderMaster_S_No,
                        SubDepartment_Code=subdepartment,  # Foreign key relationship
                        OrderID=DepartmentOrderID,
                        created_by=CreatedBy,
                    )
                    

                    message = {"success": True, "message": "Saved Successfully"}
                return JsonResponse(message)
            elif Type == "RateCardMasterUpdate":
                # Get department data from the request
                TestCode = data.get("TestCode")
                TestName = data.get("TestName")
                Basic = data.get("Basic")
                updateamount = data.get("updateamount")
                columnname = data.get("franchaisename")  # columnname is dynamic

                if not TestCode or not columnname or not updateamount:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "TestCode, Franchise Name, and Update Amount are required.",
                        },
                        status=400,
                    )

                # Check if a department with the same code exists
                print('TestCode :',TestCode)
                if "LTC" in TestCode:
                    existing_data = Testmaster_Cost_List.objects.filter(Test_Code_id=TestCode).first()
                    wherecolumn = "Test_Code_id"
                elif "LGM" in TestCode:
                    existing_data = Testmaster_Cost_List.objects.filter(Group_Code_id=TestCode).first()
                    wherecolumn = "Group_Code_id"
                if not existing_data:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": f"TestCode {TestCode} not found.",
                        },
                        status=404,
                    )

                with connection.cursor() as cursor:
                    cursor.execute("SHOW COLUMNS FROM Testmaster_Cost_List")
                    columns = cursor.fetchall()
                    column_names = [column[0] for column in columns]
                    print('column_names :',column_names)
                    # Check if the column exists
                    if columnname not in column_names:
                        return JsonResponse(
                                {
                                    "success": False,
                                    "message": f"Invalid field name: {columnname}.",
                                })
                        
                with connection.cursor() as cursor:
                    # Prepare the SQL query dynamically with the column name and value
                    query = f"""
                        UPDATE Testmaster_Cost_List
                        SET {columnname} = %s
                        WHERE {wherecolumn} = %s
                    """
                    cursor.execute(query, [updateamount, TestCode])

                message = "Amount updated successfully."
                success = True

                return JsonResponse(
                    {"success": success, "message": message},
                    status=200 if success else 400,
                )
            elif Type == "GroupMaster":
                Test_datas = data.get("selectedtest", [])
                groupCode = data.get('groupCode')
                groupName = data.get("groupName")
                displayName = data.get("displayName")
                billingCode = data.get("billingCode")
                billingName = data.get("billingName")
                gender = data.get("gender")
                reportType = data.get("reportType")
                SubDepartment_Code = data.get("SubDepartment_Code")
                testCategory = data.get("testCategory")
                logicalCategory = data.get("logicalCategory")
                authorizedUser = data.get("authorizedUser")
                lonicCode = data.get("lonicCode")
                groupCost = data.get('groupCost')
                created_by = data.get("created_by")
                isEditMode = data.get('isEditMode')
                
                print(f"Processing GroupMaster: groupCode={groupCode}, isEditMode={isEditMode}")
                
                # Check for existing Group_Master record
                existing_Group = Group_Master.objects.filter(
                    Group_Code=groupCode
                ).first()
                
                # Get Department details
                DepartmentDetails = SubLab_Department_Detials.objects.filter(
                    SubDepartment_Code=SubDepartment_Code
                ).first()
                
                if not DepartmentDetails:
                    print(f"SubDepartment_Code {SubDepartment_Code} not found")
                    return JsonResponse({"success": False, "message": f"SubDepartment_Code {SubDepartment_Code} not found"}, safe=False)
                
                # Update or create Group_Master record
                with transaction.atomic():
                    if existing_Group:
                        # Update existing record
                        existing_Group.Group_Name = groupName
                        existing_Group.Display_Name = displayName
                        existing_Group.Billing_Code = billingCode
                        existing_Group.Billing_Name = billingName
                        existing_Group.Gender = gender
                        existing_Group.Report_Type = reportType
                        existing_Group.Department = DepartmentDetails
                        existing_Group.Test_Category = testCategory
                        existing_Group.Logical_Category = logicalCategory
                        existing_Group.AutoAuthorized_User = authorizedUser
                        existing_Group.Lonic_Code = lonicCode
                        existing_Group.created_by = created_by
                        existing_Group.save()
                        print(f"Updated Group_Master: {groupCode}")
                    else:
                        # Create new record
                        Group_Master.objects.create(
                            Group_Code=groupCode,
                            Group_Name=groupName,
                            Display_Name=displayName,
                            Billing_Code=billingCode,
                            Billing_Name=billingName,
                            Gender=gender,
                            Report_Type=reportType,
                            Department=DepartmentDetails,
                            Test_Category=testCategory,
                            Logical_Category=logicalCategory,
                            AutoAuthorized_User=authorizedUser,
                            Lonic_Code=lonicCode,
                            Status="Active",
                            created_by=created_by,
                        )
                        print(f"Created Group_Master: {groupCode}")
                
                    # Handle Group_Master_TestList
                    with transaction.atomic():
                        if isEditMode is True:
                            # Delete existing Group_Master_TestList records for the group
                            with connection.cursor() as cursor:
                                query1 = "DELETE FROM Group_Master_TestList WHERE Group_Code_id = %s"
                                cursor.execute(query1, (groupCode,))
                                deleted_rows = cursor.rowcount
                                print(f"Deleted {deleted_rows} Group_Master_TestList records for Group_Code={groupCode}")
                            message = {"success": True, "message": "Updated Successfully"}
                        else:
                            message = {"success": True, "message": "Saved Successfully"}
                        
                        # Fetch maximum Group_Master_TestList_Id with lock
                        with transaction.atomic():
                            max_id = Group_Master_TestList.objects.select_for_update(nowait=True).aggregate(
                                Max("Group_Master_TestList_Id")
                            )["Group_Master_TestList_Id__max"]
                            print(f"Maximum Group_Master_TestList_Id found: {max_id}")
                            base_id = 1 if max_id is None else int(max_id) + 1
                            print(f"Starting Group_Master_TestList_Id from {base_id}")
                        
                        # Insert new Group_Master_TestList records
                        for index, Test in enumerate(Test_datas):
                            group_code = Test.get("group_code")
                            Test_Code = Test.get("Test_Code")
                            
                            # Generate unique ID
                            next_id = base_id + index
                            print(f"Generated Group_Master_TestList_Id={next_id} for Test_Code={Test_Code}")
                            
                            # Check for existing ID to avoid duplicates
                            while Group_Master_TestList.objects.filter(Group_Master_TestList_Id=next_id).exists():
                                print(f"ID {next_id} already exists for Group_Code={group_code}, Test_Code={Test_Code}")
                                existing_record = Group_Master_TestList.objects.filter(Group_Master_TestList_Id=next_id).first()
                                print(f"Existing record: ID={next_id}, Group_Code={existing_record.Group_Code_id}, Test_Code={existing_record.Test_Code_id}")
                                next_id += 1
                                print(f"Trying next ID: {next_id}")
                            
                            # Validate foreign keys
                            GroupDetails = Group_Master.objects.filter(
                                Group_Code=group_code
                            ).first()
                            TestDetails = Test_Descriptions.objects.filter(
                                Test_Code=Test_Code
                            ).first()
                            
                            if not GroupDetails or not TestDetails:
                                print(f"Invalid group_code {group_code} or Test_Code {Test_Code}")
                                return JsonResponse({"success": False, "message": f"Invalid group_code {group_code} or Test_Code {Test_Code}"}, safe=False)
                            
                            # Create new Group_Master_TestList record with error handling
                            try:
                                Group_Master_TestList.objects.create(
                                    Group_Master_TestList_Id=next_id,
                                    Group_Code=GroupDetails,
                                    Test_Code=TestDetails,
                                    created_by=created_by,
                                )
                                print(f"Created Group_Master_TestList: ID={next_id}, Test_Code={Test_Code}")
                            except Exception as e:
                                print(f"Error creating Group_Master_TestList ID={next_id}: {str(e)}")
                                return JsonResponse({"success": False, "message": f"Error creating Group_Master_TestList: {str(e)}"}, safe=False)
                
                # Handle Testmaster_Cost_List
                existing_data1 = Testmaster_Cost_List.objects.filter(Group_Code=groupCode).first()
                
                Testmaster_Cost_List_Test_Id = Testmaster_Cost_List.objects.aggregate(Max("Test_Id"))[
                    "Test_Id__max"
                ]
                next_Testmaster_Cost_List_Test_Id = (
                    1 if Testmaster_Cost_List_Test_Id is None else int(Testmaster_Cost_List_Test_Id) + 1
                )
                
                Group_Master_instance = Group_Master.objects.filter(
                    Group_Code=groupCode
                ).first()
                
                if existing_data1:
                    existing_data1.Basic = groupCost
                    existing_data1.save()
                    print(f"Updated Testmaster_Cost_List for Group_Code={groupCode}")
                else:
                    try:
                        Testmaster_Cost_List.objects.create(
                            Test_Id=next_Testmaster_Cost_List_Test_Id,
                            Basic=groupCost,
                            Group_Code=Group_Master_instance,
                            created_by=created_by
                        )
                        print(f"Created Testmaster_Cost_List: Test_Id={next_Testmaster_Cost_List_Test_Id}")
                    except Exception as e:
                        print(f"Error creating Testmaster_Cost_List Test_Id={next_Testmaster_Cost_List_Test_Id}: {str(e)}")
                        return JsonResponse({"success": False, "message": f"Error creating Testmaster_Cost_List: {str(e)}"}, safe=False)
                
                print(f"Completed processing: groupCode={groupCode}, existing_data1={existing_data1}")
                
                return JsonResponse(message, safe=False)
            
            elif Type == "AgeSetupMaster":
                # Get department data from the request
                testid = data.get("testid")
                ageType = data.get("ageType")
                fromAge = data.get("fromAge")
                fromageType = data.get("ageType")
                toAge = data.get('toAge')
                toAgeType = data.get('toAgeType')
                fromvalue = data.get('fromvalue')
                tovalue = data.get('tovalue')
                gender = data.get('gender')
                panicHigh = data.get('panicHigh')
                panicLow = data.get('panicLow')
                testcode = data.get('testcode')
                testname = data.get('testname')
                Editmode = data.get('isEditMode1')
                referencerange = data.get('referencerange')
                NormalValue = "Yes" if referencerange != "" else "No"
                created_by = data.get('created_by')

                try:
                    if Editmode is True:
                        existing_AgeSetupdata = Age_Setup_Master.objects.filter(Test_Id=testid).first()
                        print('existing_AgeSetupdata :', existing_AgeSetupdata)
                        if existing_AgeSetupdata:
                            # Update existing record
                            existing_AgeSetupdata.Gender = gender
                            existing_AgeSetupdata.FromAge = fromAge
                            existing_AgeSetupdata.FromAgeType = fromageType
                            existing_AgeSetupdata.Toage = toAge
                            existing_AgeSetupdata.ToAgeType = toAgeType
                            existing_AgeSetupdata.From_Value = fromvalue
                            existing_AgeSetupdata.To_Value = tovalue
                            existing_AgeSetupdata.PanicLow = panicLow
                            existing_AgeSetupdata.PanicHigh = panicHigh
                            existing_AgeSetupdata.NormalValue = NormalValue
                            existing_AgeSetupdata.Reference_Range = referencerange
                            existing_AgeSetupdata.save()
                            message = "Data updated successfully."
                        else:
                            message = f"No Age Setup data found for Test_Id {testid}."
                            return JsonResponse({"success": False, "message": message}, status=404)
                    else:
                        # Create new record
                        test_instance = Test_Descriptions.objects.filter(Test_Code=testcode).first()
                        if not test_instance:
                            message = f"No Test found for Test_Code {testcode}."
                            return JsonResponse({"success": False, "message": message}, status=404)

                        with connection.cursor() as cursor:
                            cursor.execute("SELECT MAX(Test_Id) FROM Age_Setup_Master")
                            max_id = cursor.fetchone()[0]
                            next_id = max_id + 1 if max_id is not None else 1
                            
                            Age_Setup_Master.objects.create(
                                Test_Id=next_id,
                                Test_Code=test_instance,
                                Gender=gender,
                                FromAge=fromAge,
                                FromAgeType=fromageType,
                                Toage=toAge,
                                ToAgeType=toAgeType,
                                From_Value=fromvalue,
                                To_Value=tovalue,
                                PanicLow=panicLow,
                                PanicHigh=panicHigh,
                                NormalValue=NormalValue,
                                Reference_Range=referencerange,
                                created_by=created_by
                            )
                            message = "New Age Setup created successfully."

                    return JsonResponse({"success": True, "message": message}, status=200)
                except Exception as e:
                    print(f"Error in AgeSetupMaster: {str(e)}")
                    return JsonResponse({"success": False, "message": f"Error: {str(e)}"}, status=500)
            
            elif Type == "Update_Testmaster_Interpretation_table":
              
                comments = data.get('comments')
                testname = data.get('testname')
                header = data.get('header')
                Test_Code = data.get('Test_Code')
                Test_Id = data.get('id')
                print('Test_Code :',Test_Code)

                encoded_html = base64.b64encode(comments.encode('utf-8')).decode('utf-8')

                print('Test_Code :',encoded_html)

                existing_Update_TestmasterInterpretationtable = Testmaster_Interpretation_table.objects.filter(
                        Test_Id=Test_Id
                    ).first()
                
                if existing_Update_TestmasterInterpretationtable:
                        # Update existing record
                        existing_Update_TestmasterInterpretationtable.Comments = encoded_html
                        existing_Update_TestmasterInterpretationtable.Header_interpretation = header
                        existing_Update_TestmasterInterpretationtable.save()
                        message = {"success": True, "message": "Data Updated Sucessfully"}
                else:
                    message = {"success": False, "message": f"No Exist Data for This Test {testname}"}
                return JsonResponse(message,safe=False)
                        
            elif Type == "Add_Testmaster_Interpretation_table":
                cursor = db.cursor()
                comments = data.get('comments')
                testname = data.get('testname')
                header = data.get('header')
                Test_Code = data.get('Test_Code')
                created_by = data.get('created_by')

                # Encode HTML content
                encoded_html = base64.b64encode(comments.encode('utf-8')).decode('utf-8')

                # Get the related Test_Descriptions object
                test = Test_Descriptions.objects.filter(Test_Code=Test_Code).first()

                if not test:
                    return JsonResponse({"success": False, "message": "Invalid Test Code."}, status=400)

                # Check if interpretation already exists for this test
                existing = Testmaster_Interpretation_table.objects.filter(Test_Code=test).first()

                if existing:
                    # Update existing record
                    existing.Header_interpretation = header
                    existing.Comments = encoded_html
                    existing.created_by = created_by
                    existing.save()
                    message = "Data updated successfully."
                else:
                    # Insert new record
                    cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Interpretation_table")
                    max_id = cursor.fetchone()[0]
                    next_id = max_id + 1 if max_id is not None else 1

                    Testmaster_Interpretation_table.objects.create(
                        Test_Id=next_id,
                        Test_Code=test,
                        Header_interpretation=header,
                        Comments=encoded_html,
                        created_by=created_by
                    )
                    message = "New data created successfully."

                return JsonResponse({"success": True, "message": message}, status=200)



            elif Type == "Update_Testmaster_guidelines_table":
              
                comments = data.get('comments')
                testname = data.get('testname')
                header = data.get('header')
                Test_Code = data.get('Test_Code')
                Test_Id = data.get('id')
                print('Test_Code :',Test_Code)

                existing_Update_TestmasterInterpretationtable = Testmaster_guideline_table.objects.filter(
                        Test_Id=Test_Id
                    ).first()
                if existing_Update_TestmasterInterpretationtable:
                        # Update existing record
                        existing_Update_TestmasterInterpretationtable.Comments = comments
                        existing_Update_TestmasterInterpretationtable.Header_interpretation = header
                        existing_Update_TestmasterInterpretationtable.save()
                        message = {"success": True, "message": "Data Updated Sucessfully"}
                else:
                    message = {"success": False, "message": f"No Exist Data for This Test {testname}"}
                return JsonResponse(message,safe=False)
                        
            elif Type == "Add_Testmaster_guidelines_table":
                cursor = db.cursor()
                comments = data.get('comments')
                testname = data.get('testname')
                header = data.get('header')
                Test_Code = data.get('Test_Code')
                created_by = data.get('created_by')
                
                cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_guideline_table")
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1
                
                test = Test_Descriptions.objects.filter(Test_Code=Test_Code).first()
                
                interpretation = Testmaster_guideline_table.objects.create(
                    Test_Id = next_id,
                    Test_Code = test,
                    Header_interpretation = header,
                    Comments = comments,
                    created_by = created_by 
                )
                interpretation.save()
                message = "New Data created successfully."

                return JsonResponse({"success": True, "message": message}, status=200)
                   

            elif Type.strip() == "Microscopytype":
                is_edit = data.get('isEdit')
                micro_code = data.get('microscopy_Code')

                if is_edit:
                    try:
                        instance = Microscopytype.objects.get(microscopy_Code=micro_code)
                        serilizer = microscopyserializer(instance,data=data,partial=True)
                        if serilizer.is_valid():
                            serilizer.save()
                            return JsonResponse({"success":f"{ResponseMsg} Successfully"})
                        else:
                            return JsonResponse(serializer.errors)
                    except Microscopytype.DoesNotExist:
                        return JsonResponse({"warn":"Unit Not Found"})
                else:
                    serilizer = microscopyserializer(data=data)
                    if serilizer.is_valid():
                        serilizer.save()
                        return JsonResponse({"success":f"{ResponseMsg} Successfully"})
                    else:
                        return JsonResponse(serilizer.errors)

                         
            
            else:
                return JsonResponse({"message": "Type Required"})
        except json.JSONDecodeError as e:
            print(e)
            return JsonResponse({"error": "Invalid JSON format."})
        except Exception as e:
            print('Unexpected error:', str(e))
            return JsonResponse({"error": str(e)})

    elif request.method == "GET":
        Type = request.GET.get("Type")
        if Type == "LabDepartment":
            departments = Lab_Department_Detials.objects.all()
            serializer = MainDepartmentSerializer(departments, many=True)
            for index,i in enumerate(serializer.data,start=1):
                i['id'] = index
            return JsonResponse(serializer.data, safe=False)
        elif Type == "LabSubDepartment":
            subdepartments = SubLab_Department_Detials.objects.all()
            serializers = SubLabDepartmentSerializer(subdepartments, many=True)
            for index,i in enumerate(serializers.data,start=1):
                i["id"] = index
            return JsonResponse(serializers.data, safe=False)       
        elif Type == "UnitMaster":
            UnitsData = Unit_Masters.objects.all()
            UnitsData_list = UnitMasterSerilizer(UnitsData,many=True)
            for index, i in enumerate(UnitsData_list.data, start=1):
                i["id"] = index
            return JsonResponse(UnitsData_list.data, safe=False)
        elif Type == "Microscopytype":
            MicroData = Microscopytype.objects.all()
            MicroData_list = microscopyserializer(MicroData,many=True)
            for index, i in enumerate(MicroData_list.data, start=1):
                i["id"] = index
            return JsonResponse(MicroData_list.data, safe=False)
        elif Type == "ContainerMaster":
            ContainerMasterData = Container_Masters.objects.all()
            serializer = ContainerMastersSerializer(ContainerMasterData, many=True)
            for index, i in enumerate(serializer.data, start=1):
                i["id"] = index
            return JsonResponse(serializer.data, safe=False)     
        elif Type == "SpecimenMaster":
            SpecimenMasterData = Specimen_Masters.objects.all()
            SpecimenMasterData_list = SpecimenMasterSerializer(SpecimenMasterData,many=True)
            for index, i in enumerate(SpecimenMasterData_list.data, start=1):
                i["id"] = index
            return JsonResponse(SpecimenMasterData_list.data, safe=False)
        elif Type == "MethodsMaster":
            MethodsMasterData = Methods_Masters.objects.all()
            MethodsMasterData_list = MethodMasterSerializer(MethodsMasterData,many=True)
            for index, i in enumerate(MethodsMasterData_list.data, start=1):
                i["id"] = index
            return JsonResponse(MethodsMasterData_list.data, safe=False)
        elif Type == "AntibioticMaster":
            AntibioticMasterData = AntibioticMaster.objects.all()
            AntibioticMasterData_list = AntibioticMasterSerializer(AntibioticMasterData,many=True)
            for index, i in enumerate(AntibioticMasterData_list.data, start=1):
                i["id"] = index
            return JsonResponse(AntibioticMasterData_list.data, safe=False)
        elif Type == "OrganismMaster":
            OrganismMasterData = Organism_Masters.objects.all()
            OrganismMasterData_list = OrganismMasterSerializer(OrganismMasterData,many=True)
            for index, i in enumerate(OrganismMasterData_list.data, start=1):
                i["id"] = index
            return JsonResponse(OrganismMasterData_list.data, safe=False)
        elif Type == "LabRemarksData":
            LabRemarksMasterData = LabRemarksMaster.objects.all()
            LabRemarksMasterData_list = list(LabRemarksMasterData.values())
            for Remarks in LabRemarksMasterData_list:
                departmentCode = Remarks["Department"]
                main_department = SubLab_Department_Detials.objects.filter(
                    SubDepartment_Code=departmentCode
                ).first()
                if main_department:
                    Remarks["Department_Name"] = main_department.SubDepartment_Name
                else:
                    Remarks["Department_Name"] = None
            for index, i in enumerate(LabRemarksMasterData_list, start=1):
                i["id"] = index

            return JsonResponse(LabRemarksMasterData_list, safe=False)
        elif Type == "RemarksMaster":
            RemarksMasterData = Remarks_master.objects.all()
            RemarksMasterData_list = RemarksMasterSerializer(RemarksMasterData,many=True)
            for index, i in enumerate(RemarksMasterData_list.data, start=1):
                i["id"] = index
            return JsonResponse(RemarksMasterData_list.data, safe=False)
        elif Type == "ReasonMaster":
            ReasonMasterData = Reason_master.objects.all()
            ReasonMasterData_list = list(ReasonMasterData.values())
            for index, i in enumerate(ReasonMasterData_list, start=1):
                i["id"] = index
            return JsonResponse(ReasonMasterData_list, safe=False)
        elif Type == "QualificationMaster":
            QualificationMasterData = Qualification_master.objects.all()
            QualificationMasterData_list = list(QualificationMasterData.values())
            for index, i in enumerate(QualificationMasterData_list, start=1):
                i["id"] = index
            return JsonResponse(QualificationMasterData_list, safe=False)
        elif Type == "ExternalLabMaster":
            Labcode = request.GET.get("Labcode")
            if Labcode:
                External_Lab_MasterData = External_Lab_Master.objects.filter(
                    LabCode=Labcode
                )
            else:
                External_Lab_MasterData = External_Lab_Master.objects.all()

            External_Lab_MasterData_list = list(External_Lab_MasterData.values())
            for index, i in enumerate(External_Lab_MasterData_list, start=1):
                i["id"] = index
            return JsonResponse(External_Lab_MasterData_list, safe=False)
        elif Type == "ReferDoctorMaster":

            ReferingDoctorDetails = Refering_Doctor_Details.objects.all()
            ReferingDoctorDetails_list = list(ReferingDoctorDetails.values())
            for ReferingDoctor in ReferingDoctorDetails_list:

                Qualification_id = ReferingDoctor["Qualification_id"]
                Qualification_details = Qualification_master.objects.filter(
                    Qualification_Id=Qualification_id
                ).first()
                if Qualification_details:
                    ReferingDoctor["Qualification_name"] = (
                        Qualification_details.Qualification
                    )
                else:
                    ReferingDoctor["Qualification_name"] = None

            for index, ReferingDoctor in enumerate(ReferingDoctorDetails_list, start=1):
                ReferingDoctor["id"] = index

            return JsonResponse(ReferingDoctorDetails_list, safe=False)
        elif Type == "TestMaster":
            print('Type :',Type)
            # First, get the SubDepartment_Code and corresponding OrderID from DepartmentOrderMaster
            sub_departments = SubLab_Department_Detials.objects.annotate(
                order_id=Subquery(
                    DepartmentOrderMaster.objects.filter(
                        SubDepartment_Code=OuterRef("SubDepartment_Code")
                    ).values("OrderID")[:1]
                )
            ).order_by(
                Case(
                    When(order_id__isnull=False, then=Value(0)),
                    default=Value(1),
                    output_field=IntegerField(),
                ),
                "order_id",  # This sorts OrderID in ascending order
                "SubDepartment_Name",  # This sorts sub_department_name in ascending order
            )

            # Now, remove duplicates by keeping only the first instance of each SubDepartment_Code
            seen_sub_departments = set()
            unique_sub_departments = []

            for sub_department in sub_departments:
                if sub_department.SubDepartment_Code not in seen_sub_departments:
                    unique_sub_departments.append(sub_department)
                    seen_sub_departments.add(sub_department.SubDepartment_Code)

            # Process the unique sub_departments
            data = []
            newsn = 1

            for sub_department in unique_sub_departments:
                # Department Details
                sub_department_id = sub_department.SubDepartment_Code
                sub_department_name = sub_department.SubDepartment_Name
                status = sub_department.Status
                sub_department_code = sub_department.SubDepartment_Code

                # Department and their Tests
                tests = Test_Descriptions.objects.filter(sub_department=sub_department)
                test_count = tests.count()
                test_data = [model_to_dict(row) for row in tests]

                for index, i in enumerate(test_data, start=1):
                    i["id"] = index

                data.append(
                    {
                        "sub_department_name": sub_department_name,
                        "tests": test_data,
                        "Testcount": test_count,
                        "sub_department_id": sub_department_id,
                        "DepartmentOrderID": sub_department.order_id,  # Use annotated order_id
                        "id": newsn,
                        "Status": status,
                        "sub_department_code": sub_department_code,
                    }
                )

                newsn += 1

            # Return the data in JSON format
            return JsonResponse({"data": data}, status=200)
        elif Type == "DepartmentOrderMaster":
            DepartmentOrderMaster_data = DepartmentOrderMaster.objects.all()
            DepartmentOrderMaster_list = list(DepartmentOrderMaster_data.values())
            for index, i in enumerate(DepartmentOrderMaster_list, start=1):
                SubDepartment_Code_id = i["SubDepartment_Code_id"]
                Subdepartment_instance = SubLab_Department_Detials.objects.filter(SubDepartment_Code=SubDepartment_Code_id).first()
                i["SubDepartment_Name"] = Subdepartment_instance.SubDepartment_Name
                i["id"] = index
                i["SubDepartment_Code"] = SubDepartment_Code_id
                i["Type"] = "DepartmentOrderMaster"
            return JsonResponse(DepartmentOrderMaster_list, safe=False) 
        elif Type == "Get_AllTests":
            gender = request.GET.get('gender')
            SubDepartment_Code = request.GET.get("SubDepartment_Code")
            
            # Base QuerySet
            Test_data = Test_Descriptions.objects.filter(Status="Active")
            
            # Apply filtering based on conditions
            if gender and SubDepartment_Code:
                # Filter by both gender and SubDepartment_Code
                Test_data = Test_data.filter(
                    sub_department_id=SubDepartment_Code
                ).filter(
                    Gender__in=[gender, "Both"]
                    )
            elif gender:
                # Filter by gender only
                Test_data = Test_data.filter(Gender__in=[gender, "Both"])
            elif SubDepartment_Code:
                # Filter by SubDepartment_Code only
                Test_data = Test_data.filter(sub_department_id=SubDepartment_Code)
            
            # Convert QuerySet to list of dictionaries
            Test_data_list = list(Test_data.values())
            
            # Add an incremental "id" field to the response
            for index, i in enumerate(Test_data_list, start=1):
                i["id"] = index

            # Return JSON response
            return JsonResponse(Test_data_list, safe=False)
        elif Type == "FormulaMaster":

            All_Test_data = Test_Descriptions.objects.all()
            Test_data_list_1 = list(All_Test_data.values())
            print("Test_data_list_1 :", Test_data_list_1)
            All_Test_data_list = {
                i.get("Test_Code"): i.get("Test_Name") for i in Test_data_list_1
            }
            print("All_Test_data_list :", All_Test_data_list)

            Test_data = Test_Descriptions.objects.filter(Calculated_Test="Yes").all()
            Test_data_list = list(Test_data.values())
            print("Test_data_list :", Test_data_list)
            for index, i in enumerate(Test_data_list, start=1):
                print("i :", i)
                formula = i.get("Formula")

                print("formula :", formula)
                displayformula = formula

                for code, name in All_Test_data_list.items():
                    displayformula = displayformula.replace(code, name)
                print("displayformula :", displayformula)
                i["displayformula"] = displayformula
                i["id"] = index

            return JsonResponse(Test_data_list, safe=False)
        elif Type == "RateCardMaster":
            with connection.cursor() as cursor:
                cursor.execute("SHOW COLUMNS FROM Testmaster_Cost_List")
                columns = cursor.fetchall()
            column_names = [column[0] for column in columns]
            excluded_columns = [
                "updated_at",
                "created_at",
                "test_id",
                "test_name",
                "test_code",
                "created_by",
                "Test_Code_id",
                "Group_Code_id"
            ]
            filtered_columns = [
                {"columname": column}
                for column in column_names
                if column.lower()
                not in [excluded.lower() for excluded in excluded_columns]
            ]
            for i in filtered_columns:
                columname = i.get("columname")
                if columname != "Basic":
                    lab_name = External_Lab_Master.objects.filter(
                        LabCode=columname
                    ).first()
                    if lab_name:
                        i["displayNames"] = lab_name.LabName
                    else:
                        i["displayNames"] = None
                else:
                    i["displayNames"] = columname

            return JsonResponse(filtered_columns, safe=False)
        elif Type == "RateCardMasterList":
            columnsname = request.GET.get("ratecard")
            if not columnsname:
                return JsonResponse({"success": False, "message": "Column name not provided"})

            with connection.cursor() as cursor:
                cursor.execute("SHOW COLUMNS FROM Testmaster_Cost_List")
                columns = cursor.fetchall()

            valid_columns_from_db = [column[0] for column in columns]
            if columnsname not in valid_columns_from_db:
                return JsonResponse({"success": False, "message": f"Invalid column name: {columnsname}"})

            query = f"SELECT * FROM Testmaster_Cost_List WHERE {columnsname} IS NOT NULL"
            with connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()

                filtered_data = []
                for index, row in enumerate(rows, start=1):
                    row_dict = dict(zip([col[0] for col in cursor.description], row))
                    testcode = row_dict.get("Test_Code_id")
                    group_code = row_dict.get("Group_Code_id")

                    if testcode is not None:
                        test_description_instance = Test_Descriptions.objects.filter(Test_Code=testcode).first()
                        row_dict["Name"] = test_description_instance.Test_Name if test_description_instance else None
                        row_dict["Type"] = "Individual"
                        row_dict["rowColor"] = "black"
                        row_dict['Code'] = testcode
                    elif group_code is not None:
                        group_instance = Group_Master.objects.filter(Group_Code=group_code).first()
                        row_dict["Name"] = group_instance.Group_Name if group_instance else None
                        row_dict["rowColor"] = "green"
                        row_dict["Type"] = "Group"
                        row_dict['Code'] = group_code
                                                
                    row_dict["id"] = index
                    row_dict["Schemecost"] = float(row_dict.get(columnsname))
                    filtered_data.append(row_dict)

            return JsonResponse(filtered_data, safe=False)

        elif Type == "GroupMaster":
            # First, get the SubDepartment_Code and corresponding OrderID from DepartmentOrderMaster
            GroupMasterdata = Group_Master.objects.all()
            print('GroupMasterdata :',GroupMasterdata)
            GroupMasterdata_list = list(GroupMasterdata.values())
            print('GroupMasterdata_list :',GroupMasterdata_list)
            for index , i in enumerate(GroupMasterdata_list,start=1):
                Department_id = i.get("Department_id")
                GroupCode = i.get("Group_Code")
                
                
                Subdepartmentinstance = SubLab_Department_Detials.objects.filter(SubDepartment_Code=Department_id).first()
                Testmaster_Cost_List_instance = Testmaster_Cost_List.objects.filter(Group_Code=GroupCode).first()

                i["Sub_DepartmentName"] = Subdepartmentinstance.SubDepartment_Name
                i["id"] = index
                i["Amount"] = Testmaster_Cost_List_instance.Basic
                
                Group_TestList = Group_Master_TestList.objects.filter(Group_Code=GroupCode)
                Group_TestList_data = list(Group_TestList.values())
                
                for index,j in enumerate(Group_TestList_data,start=1):
                    GroupCode_in_List = j.get("Group_Code_id")
                    TestCode_GML = j.get("Test_Code_id")
                    print('GroupCode_in_List :',GroupCode_in_List)
                    Testdetails = Test_Descriptions.objects.filter(Test_Code=TestCode_GML).first()
                    
                    j["id"] = index
                    j["Test_Code"] = TestCode_GML
                    j["group_code"] = GroupCode_in_List
                    j["test_name"] = Testdetails.Test_Name
                    j["department"] = Testdetails.department.Department_Name
                    j["sub_department"] = Testdetails.sub_department.SubDepartment_Name
                    j["Header"] = Testdetails.Header
                    j["Billing_Name"] = Testdetails.Billing_Name
                    
                    if GroupCode_in_List == GroupCode:
                        i["GroupList"] = Group_TestList_data
                
            return JsonResponse(GroupMasterdata_list,safe=False)
        elif Type == "Get_AllTests_For_AgeSetup":
            test_data = Test_Descriptions.objects.filter(Status="Active")
            response_data = []
            id_counter = 1

            for test in test_data:
                # Fetch related Age_Setup_Master entries
                age_setups = Age_Setup_Master.objects.filter(Test_Code=test.Test_Code)

                if not age_setups.exists():
                    # Even if no age setup, still include the test with only test fields
                    test_dict = {}
                    for field in test._meta.get_fields():
                        if field.is_relation:
                            continue
                        test_dict[field.name] = getattr(test, field.name)
                    test_dict["id"] = id_counter
                    id_counter += 1
                    response_data.append(test_dict)
                else:
                    for age in age_setups:
                        combined_dict = {}
                        # Add fields from Test_Descriptions
                        for field in test._meta.get_fields():
                            if field.is_relation:
                                continue
                            combined_dict[field.name] = getattr(test, field.name)

                        # Add fields from Age_Setup_Master
                        for field in age._meta.get_fields():
                            if field.is_relation:
                                continue
                            combined_dict[field.name] = getattr(age, field.name)

                        combined_dict["id"] = id_counter
                        id_counter += 1
                        response_data.append(combined_dict)

            return JsonResponse(response_data, safe=False)
        elif Type == "Get_AllTests_For_Interpretation":
            test_data = Test_Descriptions.objects.filter(Status="Active")
    
            response_data = []
            id_counter = 1
            for test in test_data:
                age_setup_data = Testmaster_Interpretation_table.objects.filter(Test_Code=test.Test_Code)
                
                for age in age_setup_data:
                    test_dict = {}

                    # Add all fields from Test_Descriptions
                    for field in test._meta.get_fields():
                        if field.is_relation:
                            continue
                        test_dict[field.name] = getattr(test, field.name)
                    
                    # Add all fields from Testmaster_Interpretation_table
                    for field in age._meta.get_fields():
                        if field.is_relation:
                            continue
                        test_dict[field.name] = getattr(age, field.name)

                    test_dict["id"] = id_counter
                    id_counter += 1

                    response_data.append(test_dict)
        
            
                
                
            # Return the combined data as a JSON response
            return JsonResponse(response_data, safe=False)

        elif Type == "Get_AllTests_For_guideline":
            test_data = Test_Descriptions.objects.filter(Status="Active")
    
            response_data = []
            id_counter = 1
            for test in test_data:
                age_setup_data = Testmaster_guideline_table.objects.filter(Test_Code=test.Test_Code)
                
                for age in age_setup_data:
                    test_dict = {}

                    # Add all fields from Test_Descriptions
                    for field in test._meta.get_fields():
                        if field.is_relation:
                            continue
                        test_dict[field.name] = getattr(test, field.name)
                    
                    # Add all fields from Testmaster_Interpretation_table
                    for field in age._meta.get_fields():
                        if field.is_relation:
                            continue
                        test_dict[field.name] = getattr(age, field.name)

                    test_dict["id"] = id_counter
                    id_counter += 1

                    response_data.append(test_dict)
            return JsonResponse(response_data, safe=False)
        
           
        elif Type == "Get_AllTests_For_Reflex":
            test_data = Test_Descriptions.objects.filter(Status="Active")
    
            response_data = []
            id_counter = 1
            # Iterate over each Test_Description
            for index,test in enumerate(test_data,start=1):
                # Fetch related Age_Setup_Master data based on Test_Code
                age_setup_data = Testmaster_Reflex_Test.objects.filter(Test_Code=test.Test_Code)
                
                # Prepare the dictionary for each Test_Description
                test_dict = {}
        
                # Add all fields from the Test_Descriptions model
                for field in test._meta.get_fields():
                    if field.is_relation:
                        # Skip ForeignKeys or related fields (if you don't want to include them)
                        continue
                    field_name = field.name
                    field_value = getattr(test, field_name)
                    test_dict[field_name] = field_value
                
                # Add Age_Setup_Master fields to the test_dict
                for index,age in enumerate(age_setup_data,start=1):
                    for field in age._meta.get_fields():
                        # Skip ForeignKeys or related fields to avoid redundant data
                        if field.is_relation:
                            continue
                        field_name = field.name
                        test_dict[field_name] = getattr(age, field.name)
                
                test_dict["id"] = id_counter
        
                # Increment the ID counter for the next entry
                id_counter += 1
                response_data.append(test_dict)

            # Return the combined data as a JSON response
            return JsonResponse(response_data, safe=False)
        elif Type == "Get_AllTests_For_Interpretation":
            test_data = Test_Descriptions.objects.filter(Status="Active")
    
            response_data = []
            id_counter = 1
            # Iterate over each Test_Description
            for index,test in enumerate(test_data,start=1):
                # Fetch related Age_Setup_Master data based on Test_Code
                age_setup_data = Testmaster_Interpretation_table.objects.filter(Test_Code=test.Test_Code)
                
                # Prepare the dictionary for each Test_Description
                test_dict = {}
        
                # Add all fields from the Test_Descriptions model
                for field in test._meta.get_fields():
                    if field.is_relation:
                        # Skip ForeignKeys or related fields (if you don't want to include them)
                        continue
                    field_name = field.name
                    field_value = getattr(test, field_name)
                    test_dict[field_name] = field_value
                
                # Add Age_Setup_Master fields to the test_dict
                for index,age in enumerate(age_setup_data,start=1):
                    for field in age._meta.get_fields():
                        # Skip ForeignKeys or related fields to avoid redundant data
                        if field.is_relation:
                            continue
                        field_name = field.name
                        test_dict[field_name] = getattr(age, field.name)
                
                test_dict["id"] = id_counter
        
                # Increment the ID counter for the next entry
                id_counter += 1
                response_data.append(test_dict)

            # Return the combined data as a JSON response
            return JsonResponse(response_data, safe=False)
        
        
        
        else:
            return JsonResponse({"message": "Type Required"})



@csrf_exempt
def Update_All_Masters_Status_update(request):
    # Get parameters from GET request
    Type = request.GET.get("Type")

    if Type == "MainDepartment":
        # Get the department code and the new status
        department_code = request.GET.get("Code")
        newstatus = request.GET.get("newstatus")

        if department_code and newstatus:
            try:
                # Fetch the department using the department code
                department = Lab_Department_Detials.objects.get(
                    Department_Code=department_code
                )

                # Update the status of the department
                department.Status = newstatus
                department.save()

                # Return a success response
                return JsonResponse(
                    {"success": f"{newstatus} successfully"},
                    status=200,
                )
            except Lab_Department_Detials.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"warn": "Department not found"})
        else:
            return JsonResponse(
                {
                    "warn": "Department code and new status are required"
                }
            )
    elif Type == "SubMainDepartment":
        # Get the department code and the new status
        subdepartment_code = request.GET.get("subdepartment_code")
        newstatus = request.GET.get("newstatus")

        if subdepartment_code and newstatus:
            try:
                # Fetch the department using the department code
                sub_department = SubLab_Department_Detials.objects.get(
                    SubDepartment_Code=subdepartment_code
                )

                # Update the status of the department
                sub_department.Status = newstatus
                sub_department.save()

                # Return a success response
                return JsonResponse(
                    {"success": True, "message": f"{newstatus} successfully"},
                    status=200,
                )
            except SubLab_Department_Detials.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"success": False, "message": "Sub Department not found"},
                    status=404,
                )
        else:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Sub Department code and new status are required",
                },
                status=400,
            )
    elif Type == "ExternalLabMaster":
        # Get the department code and the new status
        Labcode = request.GET.get("Labcode")
        newstatus = request.GET.get("newstatus")

        if Labcode and newstatus:
            try:
                # Fetch the department using the department code
                External_LabMaster = External_Lab_Master.objects.get(LabCode=Labcode)

                # Update the status of the department
                External_LabMaster.Status = newstatus
                External_LabMaster.save()

                # Return a success response
                return JsonResponse(
                    {"success": True, "message": f"{newstatus} successfully"},
                    status=200,
                )
            except External_Lab_Master.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"success": False, "message": "External LabMaster not found"},
                    status=404,
                )
        else:
            return JsonResponse(
                {"success": False, "message": "Lab code and new status are required"},
                status=400,
            )
    elif Type == "ReferDoctorMaster":
        # Get the department code and the new status
        DoctorID = request.GET.get("DoctorID")
        newstatus = request.GET.get("newstatus")

        if DoctorID and newstatus:
            try:
                # Fetch the department using the department code
                Refering_DoctorDetails = Refering_Doctor_Details.objects.get(
                    DoctorID=DoctorID
                )

                # Update the status of the department
                Refering_DoctorDetails.Status = newstatus
                Refering_DoctorDetails.save()

                # Return a success response
                return JsonResponse(
                    {"success": True, "message": f"{newstatus} successfully"},
                    status=200,
                )
            except Refering_Doctor_Details.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"success": False, "message": "External LabMaster not found"},
                    status=404,
                )
        else:
            return JsonResponse(
                {"success": False, "message": "Lab code and new status are required"},
                status=400,
            )
    elif Type == "TestMaster":
        # Get the department code and the new status
        Test_Code = request.GET.get("Test_Code")
        newstatus = request.GET.get("newstatus")

        if Test_Code and newstatus:
            try:
                # Fetch the department using the department code
                TestDescriptions = Test_Descriptions.objects.get(
                    Test_Code=Test_Code
                )

                # Update the status of the department
                TestDescriptions.Status = newstatus
                TestDescriptions.save()

                # Return a success response
                return JsonResponse(
                    {"success": True, "message": f"{newstatus} successfully"},
                    status=200,
                )
            except Test_Descriptions.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"success": False, "message": "External LabMaster not found"},
                    status=404,
                )
        else:
            return JsonResponse(
                {"success": False, "message": "Lab code and new status are required"},
                status=400,
            )
    elif Type == "FormulaMaster":
        # Get the department code and the new status
        Test_Code = request.GET.get("Test_Code")

        if Test_Code:
            try:
                # Fetch the department using the department code
                TestDescriptions = Test_Descriptions.objects.get(Test_Code=Test_Code)

                # Update the status of the department
                TestDescriptions.Calculated_Test = "No"
                TestDescriptions.Formula = None
                TestDescriptions.save()

                # Return a success response
                return JsonResponse(
                    {"success": True, "message": "Formula Removed successfully"},
                    status=200,
                )
            except Test_Descriptions.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"success": False, "message": "Test Not found"},
                    status=404,
                )
        else:
            return JsonResponse(
                {"success": False, "message": "TestCode  required"},
                status=400,
            )
    elif Type == "GroupMaster":
        # Get the department code and the new status
        Group_Code = request.GET.get("Group_Code")
        newstatus = request.GET.get("newstatus")

        if Group_Code and newstatus:
            try:
                # Fetch the department using the department code
                GroupMaster = Group_Master.objects.get(
                    Group_Code=Group_Code
                )

                # Update the status of the department
                GroupMaster.Status = newstatus
                GroupMaster.save()

                # Return a success response
                return JsonResponse(
                    {"success": True, "message": f"{newstatus} successfully"},
                    status=200,
                )
            except Group_Master.DoesNotExist:
                # Handle case where the department code doesn't exist
                return JsonResponse(
                    {"success": False, "message": "Group not found"}
                )
        else:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Group code and new status are required",
                }
            )
    
    
    else:
        return JsonResponse({"message": "Type Required"})


# @csrf_exempt
# def All_CSV_Files_Upload(request):
#     Type = request.POST.get("Type")

#     if Type == "AntibioticMaster_CSV":
#         file = request.FILES.get("file")
#         created_by = request.POST.get("created_by")
#         print("file:", file)

#         if file.name.endswith(".csv"):
#             df = pd.read_csv(file)
#         elif file.name.endswith(".xlsx"):
#             df = pd.read_excel(file, engine="openpyxl")
#         else:
#             return JsonResponse(
#                 {
#                     "error": "'Unsupported file format. Please upload a CSV or Excel file'"
#                 }
#             )

#         csv_data = df.to_dict(orient="records")

#         # Get the last used anti_biotic_id before processing rows
#         last_anti_biotic_id = AntibioticMaster.objects.aggregate(Max("anti_biotic_id"))[
#             "anti_biotic_id__max"
#         ]
#         next_anti_biotic_id = (
#             1 if last_anti_biotic_id is None else int(last_anti_biotic_id) + 1
#         )

#         print("Starting with next_anti_biotic_id:", next_anti_biotic_id)

#         for row in csv_data:
#             # Handle missing values in the row
#             for key in row:
#                 if pd.isna(row[key]):
#                     if isinstance(row[key], str):
#                         row[key] = "None"
#                     elif isinstance(row[key], (int, float)):
#                         row[key] = None

#             print("row:", row)

#             # Assign the next available anti_biotic_id and increment it for the next record
#             row["anti_biotic_id"] = next_anti_biotic_id
#             next_anti_biotic_id += 1  # Increment for the next row

#             try:
#                 # Create the AntibioticMaster record
#                 AntibioticMaster.objects.create(
#                     anti_biotic_id=row["anti_biotic_id"],
#                     anti_biotic_group_code=row["anti_biotic_group_code"],
#                     anti_biotic_code=row["anti_biotic_code"],
#                     anti_biotic=row["anti_biotic_des"],
#                     created_by=created_by,
#                 )
#             except Exception as e:
#                 return JsonResponse({"message": f"Error inserting row: {e}"})
#         return JsonResponse({"message": "Upload Successfully"}, status=200)
#     elif Type == "TestMaster_CSV":
#         file = request.FILES.get("file")
#         created_by = request.POST.get("created_by")
#         print("file:", file)

#         if file.name.endswith(".csv"):
#             df = pd.read_csv(file)
#         elif file.name.endswith(".xlsx"):
#             df = pd.read_excel(file, engine="openpyxl")
#         else:
#             return JsonResponse(
#                 {
#                     "error": "'Unsupported file format. Please upload a CSV or Excel file'"
#                 }
#             )

#         csv_data = df.to_dict(orient="records")

#         def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
#             """
#             Helper function to get or create a foreign key instance.
#             Args:
#                 model: Django model to query.
#                 filters: Dictionary of fields to filter.
#                 defaults: Dictionary of fields for creating an object if not found.
#                 return_existing_code: Whether to return the existing instance's code if found.
#             Returns:
#                 Instance of the model or existing code if specified.
#             """
#             print('model :', model)
#             print('filters :', filters)
#             print('defaults :', defaults)
#             filter_conditions = {}
#             for key, value in filters.items():
#                 if value:  # Only add to filter_conditions if value is not empty
#                     filter_conditions[key] = value

#             print('filter_conditions :', filter_conditions)
#             instance = model.objects.filter(**filter_conditions).first()
#             print('instance :', instance)
#             if instance is not None and any(getattr(instance, field, None) for field in ['Department_Name', 'SubDepartment_Name', 'Container_Name','Method_Name','Specimen_Name','Unit_Name']):  # Replace with your relevant fields
#                 if hasattr(instance, 'Department_Code'):
#                     return instance.Department_Code
#                 elif hasattr(instance, 'SubDepartment_Code'):
#                     return instance.SubDepartment_Code
#                 elif hasattr(instance, 'Container_Code'):
#                     return instance.Container_Code
#                 elif hasattr(instance, 'Specimen_Code'):
#                     return instance.Specimen_Code
#                 elif hasattr(instance, 'Method_Code'):
#                     return instance.Method_Code
#                 elif hasattr(instance, 'Unit_Code'):
#                     return instance.Unit_Code
#                 print('Existing instance :', instance)
#                 return instance  # Return instance if no code attribute found

#             else:
#                 print('hai')
#                 # Create a new instance
#                 instance = model.objects.create(**{**filters, **defaults})
#                 print('new instance :', instance)
#                 if hasattr(instance, 'Department_Code'):
#                     return instance.Department_Code
#                 elif hasattr(instance, 'SubDepartment_Code'):
#                     return instance.SubDepartment_Code
#                 elif hasattr(instance, 'Container_Code'):
#                     return instance.Container_Code
#                 elif hasattr(instance, 'Specimen_Code'):
#                     return instance.Specimen_Code
#                 elif hasattr(instance, 'Method_Code'):
#                     return instance.Method_Code
#                 elif hasattr(instance, 'Unit_Code'):
#                     return instance.Unit_Code

#                 return instance


#         for row in csv_data:
#             # Handle missing values in the row
#             for key in row:
#                 if pd.isna(row[key]):
#                     if isinstance(row[key], str):
#                         row[key] = "None"
#                     elif isinstance(row[key], (int, float)):
#                         row[key] = None

#             max_code = Lab_Department_Detials.objects.all().aggregate(Max("Department_Code"))["Department_Code__max"]
#             new_department_code = Common_Function_For_Genarate_Next_Code_For_6Digit(max_code) if max_code else "LDC000001"

#             # Get or create Department
#             department = None
#             if row["Department"] != '' and row["Department"] is not None:
#                 department = get_or_create_foreign_key(
#                     Lab_Department_Detials,
#                     filters={"Department_Name": row["Department"]},
#                     defaults={"Department_Code": new_department_code, "Status": "Active", "created_by": created_by},
#                     return_existing_code=True
#                 )
#             print('department :', department)

#             # Generate SubDepartment Code
#             max_code1 = SubLab_Department_Detials.objects.all().aggregate(Max("SubDepartment_Code"))["SubDepartment_Code__max"]
#             new_sub_department_code = Common_Function_For_Genarate_Next_Code_For_6Digit(max_code1) if max_code1 else "LSDC000001"

#             # Get or create SubDepartment
#             sub_department = None
#             if row["Sub_Department"] != '' and row["Sub_Department"] is not None:
#                 # We need to get the actual department instance
#                 department_instance = Lab_Department_Detials.objects.get(Department_Code=department)  # Assuming department contains a code

#                 sub_department = get_or_create_foreign_key(
#                     SubLab_Department_Detials,
#                     filters={"SubDepartment_Name": row["Sub_Department"], "department": department_instance},
#                     defaults={"SubDepartment_Code": new_sub_department_code, "Status": "Active", "created_by": created_by},
#                     return_existing_code=True
#                 )
#                 sub_department_instance = SubLab_Department_Detials.objects.get(SubDepartment_Code=sub_department)  # Assuming department contains a code
#             # Generate Container Code
#             max_code = Container_Masters.objects.all().aggregate(Max("Container_Code"))["Container_Code__max"]
#             new_Container_Code = Common_Function_For_Genarate_Next_Code_For_6Digit(max_code) if max_code else "LCC000001"

#             # Get or create Container
#             container_instance = None
#             if row["Container_Name"] != '' and row["Container_Name"] is not None:
#                 container = get_or_create_foreign_key(
#                     Container_Masters,
#                     filters={"Container_Name": row["Container_Name"]},
#                     defaults={"Container_Code": new_Container_Code,"created_by": created_by},
#                     return_existing_code=True
#                 )
#                 container_instance = Container_Masters.objects.get(Container_Code=container)  # Assuming department contains a code
#             # Generate Specimen Code
#             max_code = Specimen_Masters.objects.all().aggregate(Max("Specimen_Code"))["Specimen_Code__max"]
#             new_Specimen_Code = Common_Function_For_Genarate_Next_Code_For_6Digit(max_code) if max_code else "LSC000001"

#             # Get or create Specimen
#             specimen_instance = None
#             if row["Specimen_Name"] != '' and row["Specimen_Name"] is not None:
#                 specimen = get_or_create_foreign_key(
#                     Specimen_Masters,
#                     filters={"Specimen_Name": row["Specimen_Name"]},
#                     defaults={"Specimen_Code": new_Specimen_Code,"created_by": created_by},
#                     return_existing_code=True
#                 )
#                 specimen_instance = Specimen_Masters.objects.get(Specimen_Code=specimen)  # Assuming department contains a code
#             # Generate Method Code
#             max_code = Methods_Masters.objects.all().aggregate(Max("Method_Code"))["Method_Code__max"]
#             new_Method_Code = Common_Function_For_Genarate_Next_Code_For_6Digit(max_code) if max_code else "LMC000001"

#             # Get or create Method
#             method_instance = None
#             if row["Method_Name"] != '' and row["Method_Name"] is not None:
#                 method = get_or_create_foreign_key(
#                     Methods_Masters,
#                     filters={"Method_Name": row["Method_Name"]},
#                     defaults={"Method_Code": new_Method_Code,"created_by": created_by},
#                     return_existing_code=True
#                 )
#                 method_instance = Methods_Masters.objects.get(Method_Code=method)
#             # Generate Unit Code
#             max_code = Unit_Masters.objects.all().aggregate(Max("Unit_Code"))["Unit_Code__max"]
#             new_unit_code = Common_Function_For_Genarate_Next_Code_For_6Digit(max_code) if max_code else "LUC000001"

#             # Get or create Unit
#             uom_instance = None
#             if row["UOM"] != '' and row["UOM"] is not None:
#                 uom = get_or_create_foreign_key(
#                     Unit_Masters,
#                     filters={"Unit_Name": row["UOM"]},
#                     defaults={"Unit_Code": new_unit_code, "created_by": created_by},
#                     return_existing_code=True
#                 )
            
#                 uom_instance = Unit_Masters.objects.get(Unit_Code=uom)
                
                
#             Test_Name = row["Test_Name"]
#             Header = row["Header"]
#             Display_Text = row["Display_Text"]
#             Billing_Name = row["Billing_Name"]
#             Gender = row["Gender"] if row['Gender'] is not None else "Both"
#             Input_Type = row["Input_Type"]
#             Decimal_Palces = row["Decimal_Palces"]
#             Input_Pattern_Type = row["Input_Pattern_Type"]
#             Test_Category = row["Test_Category"]
#             Logical_Category = row["Logical_Category"]
#             Captured_Unit = None
#             Captured_Unit_Uom = None
#             Report_Type = row["Report_Type"]
#             Test_Instructions = row["Test_Instructions"]
#             Loinc_Code = row["Loinc_Code"]
#             Allow_Discount = row["Allow_Discount"]
#             Oderable = row["Oderable"]
#             Show_Graph = row["Show_Graph"]
#             STAT = row["STAT"]
#             Non_Reportable = row["Non_Reportable"]
#             Calculated_Test = "No"
#             Outsourced = row["Outsourced"]
#             Processing_Time = row["Processing_Time"]
#             Emergency_Processing_Time = row["Emergency_Processing_Time"]
#             Period_Type = row["Period_Type"]
#             Formula = None
#             Routine = row["Parameter_One"]
#             TimeGap = row["Parameter_Two"]
#             Autocheck = row["Autocheck"]
#             Culturetest = row["Culturetest"]
#             Is_NABHL = row["Is_NABHL"] 
#             Is_CAP = row["Is_CAP"]    
#             Is_Machine_Interfaced = row["Is_Machine_Interfaced"]
#             Machine_Name = row["Machine_Name"]
#             Assay_Code = row["Assay_Code"]
#             IsSubTest = 'No'
#             SubTestCodes = None
            
#             with transaction.atomic():
#                 # Create the AntibioticMaster record
                
#                 max_code = Test_Descriptions.objects.all().aggregate(Max("Test_Code"))[
#                     "Test_Code__max"
#                 ]
#                 new_Test_Code = Genarate_Next_Code_4digit(max_code) if max_code else "LTC0001"
                
#                 if Test_Name is not None and Test_Name != '':
#                     test_description = Test_Descriptions.objects.create(
#                                 Test_Code=new_Test_Code,
#                                 Test_Name=Test_Name,
#                                 department=department_instance,
#                                 sub_department=sub_department_instance,
#                                 Header=Test_Name,
#                                 Billing_Name=Test_Name,
#                                 DisplayText=Test_Name,
#                                 Container_Name=container_instance,
#                                 Specimen_Name=specimen_instance,
#                                 Method_Name=method_instance,
#                                 Gender=Gender,
#                                 Input_Type=Input_Type,
#                                 Decimal_Palces=Decimal_Palces,
#                                 Input_Pattern_Type=Input_Pattern_Type,
#                                 Test_Category=Test_Category,
#                                 Logical_Category=Logical_Category,
#                                 Captured_Unit=Captured_Unit,
#                                 Captured_Unit_UOM=Captured_Unit_Uom,
#                                 UOM=uom_instance,
#                                 Report_Type=Report_Type,
#                                 Test_Instructions=Test_Instructions,
#                                 Loinc_Code=Loinc_Code,
#                                 Allow_Discount=Allow_Discount,
#                                 Oderable=Oderable,
#                                 Show_Graph=Show_Graph,
#                                 STAT=STAT,
#                                 Non_Reportable=Non_Reportable,
#                                 Calculated_Test=Calculated_Test,
#                                 Outsourced=Outsourced,
#                                 Processing_Time=Processing_Time,
#                                 Emergency_Processing_Time=Emergency_Processing_Time,
#                                 Period_Type=Period_Type,
#                                 Formula=Formula,
#                                 Routine=Routine,
#                                 TimeGap=TimeGap,
#                                 Autocheck= Autocheck,
#                                 Culturetest=Culturetest,
#                                 Is_NABHL=Is_NABHL,
#                                 Is_CAP=Is_CAP,
#                                 Is_Machine_Interfaced=Is_Machine_Interfaced,
#                                 Machine_Name= Machine_Name,
#                                 Assay_Code=Assay_Code,
#                                 Status="Active",
#                                 IsSubTest=IsSubTest,
#                                 SubTestCodes=SubTestCodes,
#                                 ResultValues=None,
#                                 created_by=created_by,
#                             )
                
#                     test_name = test_description.Test_Name
#                     test_code = test_description.Test_Code

#                     print('test_name :',test_name)
                
#                     test_description_instance = Test_Descriptions.objects.get(
#                                 Test_Code=test_code
#                             )

#                     Testmaster_Remarks_Test_Id = (
#                                 Testmaster_Remarks.objects.aggregate(Max("Test_Id"))[
#                                     "Test_Id__max"
#                                 ]
#                             )
#                     next_Testmaster_Remarks_Test_Id = (
#                                 1
#                                 if Testmaster_Remarks_Test_Id is None
#                                 else int(Testmaster_Remarks_Test_Id) + 1
#                             )

#                             # Insert into Testmaster_Remarks
#                     Testmaster_Remarks.objects.create(
#                                 Test_Id=next_Testmaster_Remarks_Test_Id,
#                                 Test_Code=test_description_instance,
#                                 # Test_Name=test_name,
#                                 Validation=None,
#                                 Remark_Type=None,
#                                 Remark=None,
#                                 created_by=created_by,
#                             )

#                     Testmaster_Reference_Range_Test_Id = (
#                                 Testmaster_Reference_Range.objects.aggregate(
#                                     Max("Test_Id")
#                                 )["Test_Id__max"]
#                             )
#                     next_Testmaster_Reference_Range_Test_Id = (
#                                 1
#                                 if Testmaster_Reference_Range_Test_Id is None
#                                 else int(Testmaster_Reference_Range_Test_Id) + 1
#                             )

#                             # Insert into Testmaster_Reference_Range
#                     Testmaster_Reference_Range.objects.create(
#                                 Test_Id=next_Testmaster_Reference_Range_Test_Id,
#                                 Test_Code=test_description_instance,
#                                 # Test_Name=test_name,
#                                 Analizer_Type=None,
#                                 validation=None,
#                                 Method_Type=None,
#                                 Gender="Both",
#                                 Range_Lower_Limit=None,
#                                 Range_Higher_Limit=None,
#                                 Reference_Range_Text=None,
#                                 created_by=created_by,
#                             )

#                     Testmaster_Cost_List_Test_Id = (
#                                 Testmaster_Cost_List.objects.aggregate(Max("Test_Id"))[
#                                     "Test_Id__max"
#                                 ]
#                             )
#                     next_Testmaster_Cost_List_Test_Id = (
#                                 1
#                                 if Testmaster_Cost_List_Test_Id is None
#                                 else int(Testmaster_Cost_List_Test_Id) + 1
#                             )

#                             # Insert into Cost_List_Table
#                     Testmaster_Cost_List.objects.create(
#                                 Test_Id=next_Testmaster_Cost_List_Test_Id,
#                                 Test_Code=test_description_instance,
#                                 # Test_Name=test_name,
#                                 Basic=0,
#                                 created_by=created_by,
#                             )

#                     Testmaster_Rule_Based_Test_Id = (
#                                 Testmaster_Rule_Based.objects.aggregate(Max("Test_Id"))[
#                                     "Test_Id__max"
#                                 ]
#                             )
#                     next_Testmaster_Rule_Based_Test_Id = (
#                                 1
#                                 if Testmaster_Rule_Based_Test_Id is None
#                                 else int(Testmaster_Rule_Based_Test_Id) + 1
#                             )

#                     Testmaster_Rule_Based.objects.create(
#                                 Test_Id=next_Testmaster_Rule_Based_Test_Id,
#                                 Test_Code=test_description_instance,
#                                 # Test_Name=test_name,
#                                 Validation_type=None,
#                                 Gender=None,
#                                 Rule_Type=None,
#                                 Remark=None,
#                                 created_by=created_by,
#                             )

#                     Testmaster_Interpretation_table_Test_Id = (
#                                 Testmaster_Interpretation_table.objects.aggregate(
#                                     Max("Test_Id")
#                                 )["Test_Id__max"]
#                             )
#                     next_Testmaster_Interpretation_table_Test_Id = (
#                                 1
#                                 if Testmaster_Interpretation_table_Test_Id is None
#                                 else int(Testmaster_Interpretation_table_Test_Id) + 1
#                             )

#                     Testmaster_Interpretation_table.objects.create(
#                                 Test_Id=next_Testmaster_Interpretation_table_Test_Id,
#                                 Test_Code=test_description_instance,
#                                 # Test_Name=test_name,
#                                 Header_interpretation=None,
#                                 Comments=None,
#                                 created_by=created_by,
#                             )

#                     Testmaster_Reflex_Test_Test_Id = (
#                                 Testmaster_Reflex_Test.objects.aggregate(Max("Test_Id"))[
#                                     "Test_Id__max"
#                                 ]
#                             )
#                     next_Testmaster_Reflex_Test_Test_Id = (
#                                 1
#                                 if Testmaster_Reflex_Test_Test_Id is None
#                                 else int(Testmaster_Reflex_Test_Test_Id) + 1
#                             )

#                     Testmaster_Reflex_Test.objects.create(
#                                 Test_Id=next_Testmaster_Reflex_Test_Test_Id,
#                                 Test_Code=test_description_instance,
#                                 # Test_Name=test_name,
#                                 Reflex_Test=None,
#                                 Reflex_Code=None,
#                                 created_by=created_by,
#                             )

#                     # Testmaster_Age_Setup_Master = (
#                     #             Age_Setup_Master.objects.aggregate(Max("Test_Id"))[
#                     #                 "Test_Id__max"
#                     #             ]
#                     #         )
#                     # next_Testmaster_Age_Setup_Master = (
#                     #             1
#                     #             if Testmaster_Age_Setup_Master is None
#                     #             else int(Testmaster_Age_Setup_Master) + 1
#                     #         )

#                     #         # Insert into Age_Setup_Master
#                     # Age_Setup_Master.objects.create(
#                     #             Test_Id=next_Testmaster_Age_Setup_Master,
#                     #             Test_Code=test_description_instance,
#                     #             # Test_Name=test_name,
#                     #             Gender="Both",
#                     #             FromAge=None,
#                     #             FromAgeType=None,
#                     #             Toage=None,
#                     #             ToAgeType=None,
#                     #             From_Value=None,
#                     #             To_Value=None,
#                     #             PanicLow=None,
#                     #             PanicHigh=None,
#                     #             NormalValue=None,
#                     #             Reference_Range=None,
#                     #             created_by=created_by,
#                     #         )

            


#         return JsonResponse({'success': 'New TestMaster ExcelFile successfully'})
    
#     else:
#         return JsonResponse({"success":False,"message": "Invalid 'Type' parameter"})



from django.http import HttpResponse


# @csrf_exempt
# def export_testmaster_data(request):
#     try:
#         # Fetch data from Test_Descriptions and related tables
#         test_descriptions = Test_Descriptions.objects.select_related(
#             'department', 'sub_department', 'Container_Name', 'Specimen_Name',
#             'Method_Name', 'UOM'
#         ).all()

#         # Prepare data for export
#         data = []
#         for test in test_descriptions:
#             # Get related data from other tables
#             remarks = Testmaster_Remarks.objects.filter(Test_Code=test).first()
#             cost_list = Testmaster_Cost_List.objects.filter(Test_Code=test).first()
#             rule_based = Testmaster_Rule_Based.objects.filter(Test_Code=test).first()
#             interpretation = Testmaster_Interpretation_table.objects.filter(Test_Code=test).first()
#             reflex_test = Testmaster_Reflex_Test.objects.filter(Test_Code=test).first()

#             # Construct row data with sanitization
#             row = {
#                 'Test_Code': str(test.Test_Code) if test.Test_Code else '',
#                 'Test_Name': str(test.Test_Name) if test.Test_Name else '',
#                 'Department': str(test.department.Department_Name) if test.department and test.department.Department_Name else '',
#                 'Sub_Department': str(test.sub_department.SubDepartment_Name) if test.sub_department and test.sub_department.SubDepartment_Name else '',
#                 'Container_Name': str(test.Container_Name.Container_Name) if test.Container_Name and test.Container_Name.Container_Name else '',
#                 'Specimen_Name': str(test.Specimen_Name.Specimen_Name) if test.Specimen_Name and test.Specimen_Name.Specimen_Name else '',
#                 'Method_Name': str(test.Method_Name.Method_Name) if test.Method_Name and test.Method_Name.Method_Name else '',
#                 'UOM': str(test.UOM.Unit_Name) if test.UOM and test.UOM.Unit_Name else '',
#                 'Header': str(test.Header) if test.Header else '',
#                 'Billing_Name': str(test.Billing_Name) if test.Billing_Name else '',
#                 'Display_Text': str(test.DisplayText) if test.DisplayText else '',
#                 'Gender': str(test.Gender) if test.Gender else '',
#                 'Input_Type': str(test.Input_Type) if test.Input_Type else '',
#                 'Decimal_Palces': test.Decimal_Palces if test.Decimal_Palces is not None else None,
#                 'Input_Pattern_Type': str(test.Input_Pattern_Type) if test.Input_Pattern_Type else '',
#                 'Test_Category': str(test.Test_Category) if test.Test_Category else '',
#                 'Logical_Category': str(test.Logical_Category) if test.Logical_Category else '',
#                 'Report_Type': str(test.Report_Type) if test.Report_Type else '',
#                 'Test_Instructions': str(test.Test_Instructions) if test.Test_Instructions else '',
#                 'Loinc_Code': str(test.Loinc_Code) if test.Loinc_Code else '',
#                 'Allow_Discount': str(test.Allow_Discount) if test.Allow_Discount else '',
#                 'Oderable': str(test.Oderable) if test.Oderable else '',
#                 'Show_Graph': str(test.Show_Graph) if test.Show_Graph else '',
#                 'STAT': str(test.STAT) if test.STAT else '',
#                 'Non_Reportable': str(test.Non_Reportable) if test.Non_Reportable else '',
#                 'Outsourced': str(test.Outsourced) if test.Outsourced else '',
#                 'Processing_Time': test.Processing_Time if test.Processing_Time is not None else None,
#                 'Emergency_Processing_Time': test.Emergency_Processing_Time if test.Emergency_Processing_Time is not None else None,
#                 'Period_Type': str(test.Period_Type) if test.Period_Type else '',
#                 'Routine': str(test.Routine) if test.Routine else '',
#                 'TimeGap': str(test.TimeGap) if test.TimeGap else '',
#                 'Autocheck': str(test.Autocheck) if test.Autocheck else '',
#                 'Culturetest': str(test.Culturetest) if test.Culturetest else '',
#                 'Is_NABHL': str(test.Is_NABHL) if test.Is_NABHL else '',
#                 'Is_CAP': str(test.Is_CAP) if test.Is_CAP else '',
#                 'Is_Machine_Interfaced': str(test.Is_Machine_Interfaced) if test.Is_Machine_Interfaced else '',
#                 'Machine_Name': str(test.Machine_Name) if test.Machine_Name else '',
#                 'Assay_Code': str(test.Assay_Code) if test.Assay_Code else '',
#                 # Remarks fields
#                 'Remark_Type': str(remarks.Remark_Type) if remarks and remarks.Remark_Type else '',
#                 'Remark': str(remarks.Remark) if remarks and remarks.Remark else '',
#                 # Reference Range fields
#                 'Analizer_Type': str(reference_range.Analizer_Type) if reference_range and reference_range.Analizer_Type else '',
#                 'Method_Type': str(reference_range.Method_Type) if reference_range and reference_range.Method_Type else '',
#                 'Range_Lower_Limit': reference_range.Range_Lower_Limit if reference_range and reference_range.Range_Lower_Limit is not None else None,
#                 'Range_Higher_Limit': reference_range.Range_Higher_Limit if reference_range and reference_range.Range_Higher_Limit is not None else None,
#                 'Reference_Range_Text': str(reference_range.Reference_Range_Text) if reference_range and reference_range.Reference_Range_Text else '',
#                 # Cost List fields
#                 'Basic_Cost': cost_list.Basic if cost_list and cost_list.Basic is not None else None,
#                 # Rule Based fields
#                 'Validation_type': str(rule_based.Validation_type) if rule_based and rule_based.Validation_type else '',
#                 'Rule_Type': str(rule_based.Rule_Type) if rule_based and rule_based.Rule_Type else '',
#                 'Rule_Remark': str(rule_based.Remark) if rule_based and rule_based.Remark else '',
#                 # Interpretation fields
#                 'Header_interpretation': str(interpretation.Header_interpretation) if interpretation and interpretation.Header_interpretation else '',
#                 'Comments': str(interpretation.Comments) if interpretation and interpretation.Comments else '',
#                 # Reflex Test fields
#                 'Reflex_Test': str(reflex_test.Reflex_Test) if reflex_test and reflex_test.Reflex_Test else '',
#                 'Reflex_Code': str(reflex_test.Reflex_Code) if reflex_test and reflex_test.Reflex_Code else '',
#                 'created_by': str(test.created_by) if test.created_by else '',
#             }
#             data.append(row)

#         if not data:
#             return HttpResponse("No data available to export", status=204)

#         # Create DataFrame
#         df = pd.DataFrame(data)

#         # Create Excel file in memory
#         output = BytesIO()
#         try:
#             with pd.ExcelWriter(output, engine='openpyxl') as writer:
#                 df.to_excel(writer, index=False, sheet_name='TestMaster')
#         except Exception as e:
#             return HttpResponse(f"Error generating Excel file: {str(e)}", status=500)

#         # Prepare response
#         output.seek(0)
#         response = HttpResponse(
#             content=output.getvalue(),
#             content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#         )
#         response['Content-Disposition'] = 'attachment; filename="TestMaster_Export.xlsx"'
#         response['Content-Length'] = output.getbuffer().nbytes

#         return response

#     except Exception as e:
#         return HttpResponse(f"Server error: {str(e)}", status=500)


@csrf_exempt
def Update_Formula_And_ResultValue(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if isinstance(data, dict):
            Type = data.get("Type")
        elif isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            Type = data[0].get("Type")
        else:
            Type = None

        if Type == "FormulaMaster":
            for i in data:
                testCode = i.get("testCode")
                formula = i.get("formula")
                Calculated_Test = "Yes"

                if testCode and formula:
                    try:
                        Test_data = Test_Descriptions.objects.get(Test_Code=testCode)
                        Test_data.Calculated_Test = Calculated_Test
                        Test_data.Formula = formula
                        Test_data.save()

                        return JsonResponse(
                            {"success": True, "message": "Formula Update Successfull"}
                        )
                    except Test_Descriptions.DoesNotExist:
                        return JsonResponse(
                            {"success": False, "message": "Test not found"}
                        )
                else:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Test  and Formula are required",
                        }
                    )

def Groupandtestmaster(request):
    try:
        testname1 = Test_Descriptions.objects.all()
        groupname1 = Group_Master.objects.all()
 
        testname = TestandgroupMasterSerializer(testname1, many=True).data
        groupname = GroupSerializer(groupname1, many=True).data
        for i in groupname:
            testname.append(i)
        return JsonResponse(testname ,safe=False)  
    except Exception as e:
        return JsonResponse({"message":str(e)})
 
 
 
def TestWiseReport(request):
    try:
        departments = SubLab_Department_Detials.objects.all()
        department_data = {}
 
        for dept in departments:
            tests = Test_Descriptions.objects.filter(sub_department=dept)
            test_data = TestDescriptionSerializer(tests, many=True, context={"request": request}).data
            department_data[dept.SubDepartment_Name] = test_data
 
        # Fetching group details
        groups = Group_Master.objects.all()
        group_data = []
        for group in groups:
            group_tests = Test_Descriptions.objects.filter(group=group)
            test_data = TestDescriptionSerializer(group_tests, many=True, context={"request": request}).data
            group_data.append({
                "Group_Name": group.Group_Name,
                "Tests": test_data
            })
 
        response_data = {"departments": department_data, "groups": group_data}
        return JsonResponse(response_data, safe=False)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)
 
 
  
def labreports(request):
    try:
        Params = {key: request.GET.get(key) for key in ["PatientId", "selectedMenu"]}
        if not all(Params.values()):
            return JsonResponse({"Error": "Missing required parameters"})
        PatientId, selectedMenu = Params.values()
        billing_records = Lab_Request_Details.objects.filter(
            Q(OP_Register_Id__PatientId__PatientId=PatientId) |
            Q(IP_Register_Id__PatientId__PatientId=PatientId) |
            Q(Casuality_Register_Id__PatientId__PatientId=PatientId) |
            Q(Lab_Register_Id__PatientId__PatientId=PatientId)
        )
        billing_invoice_nos = list(billing_records.values_list("Billing_Invoice_No", flat=True).distinct())
        model_mapping = {
            "TestReport": (Lab_Request_Details, Labreports,
                Q(OP_Register_Id__PatientId__PatientId=PatientId) |
                Q(IP_Register_Id__PatientId__PatientId=PatientId) |
                Q(Casuality_Register_Id__PatientId__PatientId=PatientId) |
                Q(Lab_Register_Id__PatientId__PatientId=PatientId)),
            "BillingHistory": (General_Billing_Table_Detials, BillingHistory,
                Q(Patient_Id__PatientId=PatientId) &
                (Q(Billing_Invoice_No__in=billing_invoice_nos) if billing_invoice_nos else Q())),
            "TestRequest": (Lab_Request_Details, Labreports,
                 Q(OP_Register_Id__PatientId__PatientId=PatientId) |
                Q(IP_Register_Id__PatientId__PatientId=PatientId) |
                Q(Casuality_Register_Id__PatientId__PatientId=PatientId) |
                Q(Lab_Register_Id__PatientId__PatientId=PatientId)),
        }

        if selectedMenu not in model_mapping:
            return JsonResponse({"Error": "Invalid selectedMenu parameter"})

        model, serializer_class, query = model_mapping[selectedMenu]
        queryset = model.objects.filter(query).distinct()  # Ensure unique records
        serializer = serializer_class(queryset, many=True)

        return JsonResponse(serializer.data, safe=False)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


    

@csrf_exempt
@require_http_methods(["GET"])
def getorganismdetails(request):
    try:
        TestNames = Organism_Masters.objects.all()
        
        testname_data = [
            {
                'id': TestName.Organism_Code,
                'Organism_Name': TestName.Organism_Name,  
            } for TestName in TestNames
        ]
        
        return JsonResponse(testname_data, safe=False)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)




 
@csrf_exempt
@require_http_methods(["GET"])
def getantibioticbyorganism(request):
    organismname = request.GET.get('organismname')
    rangetype = request.GET.get('rangetype')
    specimen = request.GET.get('Specimen')
 
    if not organismname:
        return JsonResponse({'error': 'organismname parameter is required'}, status=400)
 
    if not rangetype:
        return JsonResponse({'error': 'rangetype parameter is required'}, status=400)
 
    try:
        filters = {
            'captureorganism__iexact': organismname,
            'RangeType__iexact': rangetype,
        }
 
        # Only apply specimen filter if RangeType is not MIC and specimen is provided
        if rangetype.lower() != "mic":
            if specimen:
                filters['Specimen__iexact'] = specimen
            else:
                return JsonResponse({'error': 'Specimen parameter is required for non-MIC types'}, status=400)
 
        queryset = AntibioticMaster.objects.filter(**filters)
 
        antibiotic_data = [
            {
                'id': test.anti_biotic_id,
                'anti_biotic': test.anti_biotic,
                'sensitiverange': test.sensitive,
                'intermediaterange': test.intermediate,
                'resistantrange': test.resistant,
            }
            for test in queryset
        ]
 
        return JsonResponse(antibiotic_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 

@csrf_exempt
@require_http_methods(["GET"])
def getmicroname(request):
    if request.method == 'GET':
        
        
        try:
            # Get the first 10 active test names
            TestNames = Microscopytype.objects.all()
            micro_data = [
                {
                    'id': TestName.microscopy_Code,
                    'microscopyname': TestName.microscopy_Name,
                } for TestName in TestNames
            ]
            return JsonResponse(micro_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        

from django.http import JsonResponse, HttpResponse
from io import BytesIO
import pandas as pd

def export_testmaster_data(request):
    try:
        data_frames = {}

        data_mapping = {
            'Lab_Department_Details': Lab_Department_Detials.objects.all().values(),
            'SubLab_Department_Details': SubLab_Department_Detials.objects.all().values(),
            'Container_Masters': Container_Masters.objects.all().values(),
            'Specimen_Masters': Specimen_Masters.objects.all().values(),
            'Unit_Masters': Unit_Masters.objects.all().values(),
            'Methods_Masters': Methods_Masters.objects.all().values(),
            'Organism_Masters': Organism_Masters.objects.all().values(),
            'Antibiotic_Master': AntibioticMaster.objects.all().values(),
            'Microscopy_Type': Microscopytype.objects.all().values(),
            'Test_Descriptions': Test_Descriptions.objects.all().values(),
            'Age_Setup_Master': Age_Setup_Master.objects.all().values(),
            'Testmaster_Reflex_Test': Testmaster_Reflex_Test.objects.all().values(),
            'Testmaster_Interpretation': Testmaster_Interpretation_table.objects.all().values(),
            'Testmaster_Guideline': Testmaster_guideline_table.objects.all().values(),
            'External_Lab_Master': External_Lab_Master.objects.all().values(),
            'Testmaster_Cost_List': Testmaster_Cost_List.objects.all().values(),
            'Histodoc_Upload': Histodocupload.objects.all().values(),
            'Group_Master': Group_Master.objects.all().values(),
            'Group_Master_TestList': Group_Master_TestList.objects.all().values(),
            'OfferPackage_Master': OfferPackageMaster.objects.all().values(),
            'OfferPackage_List': OfferPackageList.objects.all().values(),
        }

        for sheet_name, query_data in data_mapping.items():
            try:
                df = pd.DataFrame(query_data)
                if not df.empty:
                    # Fix: Convert *_id and *_Code fields to string (avoid float + NaN)
                    for col in df.columns:
                        if 'Code' in col or col.endswith('_id'):
                            df[col] = df[col].astype(str).replace('nan', '')  # 'nan' as blank string
                    data_frames[sheet_name[:31]] = df
            except Exception as e:
                print(f"Error processing {sheet_name}: {e}")
                continue

        if not data_frames:
            return HttpResponse("No data available to export", status=204)

        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            for sheet, df in data_frames.items():
                df.to_excel(writer, index=False, sheet_name=sheet)

        output.seek(0)
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="LabTestData.xlsx"'
        return response

    except Exception as e:
        return HttpResponse(f"Server error: {str(e)}", status=500)









import pandas as pd
import numpy as np
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from django.db import transaction

from django.contrib import messages




@api_view(['POST'])
@parser_classes([MultiPartParser])
def csv_upload_lab(request):
    file = request.FILES.get("file")
    if not file:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        xl = pd.ExcelFile(file)
        results = {
            "success": True,
            "sheets_processed": {},
            "total_created": 0,
            "total_updated": 0,
            "total_skipped": 0,
            "errors": []
        }

        # Define processing order, with new sheets after Test_Descriptions
        processing_order = [
            'Lab_Department_Details', 'SubLab_Department_Details', 'Container_Masters',
            'Specimen_Masters', 'Unit_Masters', 'Methods_Masters', 'Test_Descriptions',
            'Group_Master', 'Group_Master_TestList', 'OfferPackage_Master', 'OfferPackage_List',
            'Age_Setup_Master', 'Testmaster_Guideline', 'Testmaster_Interpretation',
            'Testmaster_Reflex_Test', 'Testmaster_Cost_List'
        ]

        with transaction.atomic():
            test_id_counters = {
                'Age_Setup_Master': Age_Setup_Master.objects.count() + 1,
                'Testmaster_Guideline': Testmaster_guideline_table.objects.count() + 1,
                'Testmaster_Interpretation': Testmaster_Interpretation_table.objects.count() + 1,
                'Testmaster_Reflex_Test': Testmaster_Reflex_Test.objects.count() + 1,
                'Testmaster_Cost_List': Testmaster_Cost_List.objects.count() + 1,
                'Group_Master_TestList': Group_Master_TestList.objects.count() + 1,
                'OfferPackage_List': OfferPackageList.objects.count() + 1
            }

            for sheet_name in processing_order:
                print(f"Checking sheet: {sheet_name}", flush=True)
                if sheet_name not in xl.sheet_names:
                    print(f"Sheet {sheet_name} not found in Excel file", flush=True)
                    results['sheets_processed'][sheet_name] = {
                        'created': 0, 'updated': 0, 'skipped': 0
                    }
                    continue
                print(f"Processing sheet: {sheet_name}", flush=True)

                df = xl.parse(sheet_name)
                
                # Debug: Print column names for troubleshooting
                # print(f"Columns in {sheet_name}: {list(df.columns)}")
                
                created, updated, skipped = 0, 0, 0
                # Convert NaN, 'nan', and empty strings to None for nullable fields
                df = df.replace([np.nan, 'nan', ''], None)

                model_mapping = {
                    'Lab_Department_Details': (Lab_Department_Detials, ['Department_Code']),
                    'SubLab_Department_Details': (SubLab_Department_Detials, ['SubDepartment_Code']),
                    'Container_Masters': (Container_Masters, ['Container_Code']),
                    'Specimen_Masters': (Specimen_Masters, ['Specimen_Code']),
                    'Unit_Masters': (Unit_Masters, ['Unit_Code']),
                    'Methods_Masters': (Methods_Masters, ['Method_Code']),
                    'Group_Master': (Group_Master, ['Group_Code']),
                }

                if sheet_name in model_mapping:
                    model, pk_fields = model_mapping[sheet_name]
                    for _, row in df.iterrows():
                        try:
                            defaults = row.to_dict()
                            if sheet_name == 'SubLab_Department_Details' and 'department_id' in defaults:
                                if not defaults['department_id']:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing department_id")
                                    continue
                                dept = Lab_Department_Detials.objects.filter(Department_Code=defaults['department_id']).first()
                                if not dept:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Department_Code {defaults['department_id']} not found")
                                    continue
                                defaults['department'] = dept
                                del defaults['department_id']

                            elif sheet_name == 'Group_Master' and 'Department_id' in defaults:
                                if not defaults['Department_id']:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing Department_id")
                                    continue
                                dept = SubLab_Department_Detials.objects.filter(SubDepartment_Code=defaults['Department_id']).first()
                                if not dept:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: SubDepartment_Code {defaults['Department_id']} not found")
                                    continue
                                defaults['Department'] = dept
                                del defaults['Department_id']

                            # Handle nullable fields
                            nullable_fields = ['Billing_Code', 'Test_Category', 'Logical_Category', 'AutoAuthorized_User', 'Lonic_Code'] if sheet_name == 'Group_Master' else []
                            
                            for field in nullable_fields:
                                if defaults.get(field) is None:
                                    defaults[field] = None

                            defaults['created_by'] = defaults.get('created_by', 'system')
                            if not defaults['created_by']:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing created_by")
                                continue

                            obj, created_flag = model.objects.update_or_create(
                                **{pk: row[pk] for pk in pk_fields},
                                defaults=defaults
                            )
                            created += created_flag
                            updated += not created_flag
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue

                elif sheet_name == 'Test_Descriptions':
                    for _, row in df.iterrows():
                        try:
                            fk_mappings = {
                                'department': (Lab_Department_Detials, 'Department_Code', 'department_id'),
                                'sub_department': (SubLab_Department_Detials, 'SubDepartment_Code', 'sub_department_id'),
                                'Container_Name': (Container_Masters, 'Container_Code', 'Container_Name_id'),
                                'Specimen_Name': (Specimen_Masters, 'Specimen_Code', 'Specimen_Name_id'),
                                'Method_Name': (Methods_Masters, 'Method_Code', 'Method_Name_id'),
                                'UOM': (Unit_Masters, 'Unit_Code', 'UOM_id'),
                            }
                            
                            defaults = row.to_dict()
                            for field in ['Decimal_Palces', 'Captured_Unit']:
                                if field in defaults and defaults[field] is None:
                                    defaults[field] = None
                                if field == 'Decimal_Palces' and 'Decimal_Places' in defaults and defaults['Decimal_Places'] is not None:
                                    defaults['Decimal_Palces'] = defaults['Decimal_Places']
                                    del defaults['Decimal_Places']

                            for field, (model, pk_field, column) in fk_mappings.items():
                                if column in defaults and defaults[column] is not None:
                                    obj = model.objects.filter(**{pk_field: defaults[column]}).first()
                                    if not obj:
                                        skipped += 1
                                        results['errors'].append(f"Error in {sheet_name} row {row.name}: {pk_field} {defaults[column]} not found for {field}")
                                        continue
                                    defaults[field] = obj
                                if column in defaults:
                                    del defaults[column]

                            mandatory_fields = ['Test_Code', 'Test_Name', 'department', 'sub_department', 'Gender']
                            missing_fields = [f for f in mandatory_fields if not defaults.get(f)]
                            if missing_fields:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing mandatory fields: {', '.join(missing_fields)}")
                                continue

                            defaults['created_by'] = defaults.get('created_by', 'system')
                            if not defaults['created_by']:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing created_by")
                                continue

                            obj, created_flag = Test_Descriptions.objects.update_or_create(
                                Test_Code=row['Test_Code'],
                                defaults=defaults
                            )
                            created += created_flag
                            updated += not created_flag
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue

                elif sheet_name == 'Group_Master_TestList':
                    for _, row in df.iterrows():
                        try:
                            # Check for different possible column names for Group_Code
                            group_code_value = None
                            possible_group_columns = ['Group_Code_id', 'Group_Code', 'group_code', 'GroupCode', 'Group Code']
                            for col in possible_group_columns:
                                if col in row and row[col] is not None and str(row[col]).strip() != '':
                                    group_code_value = row[col]
                                    break
                            
                            if not group_code_value:
                                skipped += 1
                                available_cols = [col for col in row.index if 'group' in col.lower() or 'Group' in col]
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing Group_Code. Available Group columns: {available_cols}. Row data: {dict(row)}")
                                continue

                            # Check for different possible column names for Test_Code
                            test_code_value = None
                            possible_test_columns = ['Test_Code_id', 'Test_Code', 'test_code', 'TestCode', 'Test Code']
                            for col in possible_test_columns:
                                if col in row and row[col] is not None and str(row[col]).strip() != '':
                                    test_code_value = row[col]
                                    break
                            
                            if not test_code_value:
                                skipped += 1
                                available_cols = [col for col in row.index if 'test' in col.lower() or 'Test' in col]
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing Test_Code. Available Test columns: {available_cols}. Row data: {dict(row)}")
                                continue

                            group_code = Group_Master.objects.filter(Group_Code=group_code_value).first()
                            if not group_code:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Group_Code {group_code_value} not found")
                                continue

                            test_code = Test_Descriptions.objects.filter(Test_Code=test_code_value).first()
                            if not test_code:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Test_Code {test_code_value} not found")
                                continue

                            defaults = row.to_dict()
                            defaults['Group_Code'] = group_code
                            defaults['Test_Code'] = test_code

                            # Check for different possible column names for Group_Master_TestList_Id
                            test_list_id = None
                            possible_id_columns = ['Group_Master_TestList_Id', 'group_master_testlist_id', 'TestListId', 'Test_List_Id']
                            for col in possible_id_columns:
                                if col in row and row[col] is not None and str(row[col]).strip() != 'nan':
                                    test_list_id = row[col]
                                    break
                            
                            if test_list_id is None or str(test_list_id).strip() == '' or str(test_list_id) == 'nan':
                                test_list_id = test_id_counters[sheet_name]
                                test_id_counters[sheet_name] += 1
                            else:
                                try:
                                    test_list_id = str(test_list_id)
                                    # REMOVED: No need to check for existence since update_or_create handles it
                                except (ValueError, TypeError):
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid Group_Master_TestList_Id {test_list_id}")
                                    continue

                            defaults['created_by'] = defaults.get('created_by', 'system')
                            if not defaults['created_by']:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing created_by")
                                continue

                            # Clean up ID fields from defaults since they're used as lookup keys
                            for field_to_remove in ['Group_Code_id', 'Group_Code', 'Test_Code_id', 'Test_Code', 'Group_Master_TestList_Id']:
                                if field_to_remove in defaults:
                                    del defaults[field_to_remove]

                            obj, created_flag = Group_Master_TestList.objects.update_or_create(
                                Group_Master_TestList_Id=test_list_id,
                                defaults=defaults
                            )
                            created += created_flag
                            updated += not created_flag
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue
                
                elif sheet_name == 'OfferPackage_Master':
                    print('jsksjsjsjjsjsj')
                    for _, row in df.iterrows():
                        try:
                            # Handle offer_package_id first - this is the primary key
                            offer_package_id = row.get('offer_package_id')
                            if offer_package_id is None or pd.isna(offer_package_id) or str(offer_package_id).strip() == '':
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing offer_package_id")
                                continue
                            
                            try:
                                offer_package_id = int(offer_package_id)
                            except (ValueError, TypeError):
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid offer_package_id {offer_package_id}")
                                continue

                            # Create defaults dict with only valid model fields
                            defaults11 = {}
                            
                            # Map Excel columns to model fields
                            field_mappings = {
                                'package_code': 'package_code',
                                'package_name': 'package_name',
                                'display_name': 'display_name',
                                'gender': 'gender',
                                'report': 'report',
                                'department_name': 'department_name',
                                'test_category': 'test_category',
                                'logical_category': 'logical_category',
                                'authorized_user': 'authorized_user',
                                'Package_Cost': 'Package_Cost',
                                'Status': 'Status',
                                'UpdatedAt': 'UpdatedAt',
                                'CreatedAt': 'CreatedAt',
                            }
                            
                            # Only include fields that exist in both Excel and model
                            for excel_col, model_field in field_mappings.items():
                                if excel_col in row.index:
                                    value = row[excel_col]
                                    if pd.isna(value) or value is None:
                                        defaults11[model_field] = None
                                    else:
                                        defaults11[model_field] = value

                            # Debug: Print defaults11 to check if created_by is included
                            print(f"defaults11 for row {row.name} in {sheet_name}: {defaults11}")

                            # Validate fields against the model
                            valid_fields = {field.name for field in OfferPackageMaster._meta.get_fields()}
                            invalid_fields = set(defaults11.keys()) - valid_fields
                            if invalid_fields:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid field name(s) for model OfferPackageMaster: {', '.join(invalid_fields)}")
                                continue

                            # Explicitly exclude invalid fields like 'created_by' (as a safeguard)
                            invalid_fields = ['created_by']
                            for field in invalid_fields:
                                if field in defaults11:
                                    del defaults11[field]

                            # Use update_or_create to handle existing records
                            obj, created_flag = OfferPackageMaster.objects.update_or_create(
                                offer_package_id=offer_package_id,
                                defaults=defaults11
                            )
                            
                            if created_flag:
                                created += 1
                            else:
                                updated += 1
                                
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue
                # Fix for OfferPackageList processing
                elif sheet_name == 'OfferPackage_List':
                    for _, row in df.iterrows():
                        try:
                            defaults = row.to_dict()
                            
                            # Handle Test_Code relationship
                            test_code = None
                            if row.get('Test_Code_id'):
                                try:
                                    test_code = Test_Descriptions.objects.filter(Test_Code=row['Test_Code_id']).first()
                                    if not test_code:
                                        skipped += 1
                                        results['errors'].append(f"Error in {sheet_name} row {row.name}: Test_Code {row['Test_Code_id']} not found")
                                        continue
                                except Exception as e:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Error finding Test_Code {row['Test_Code_id']}: {str(e)}")
                                    continue

                            # Handle Group_Code relationship
                            group_code = None
                            if row.get('Group_Code_id'):
                                try:
                                    group_code = Group_Master.objects.filter(Group_Code=row['Group_Code_id']).first()
                                    if not group_code:
                                        skipped += 1
                                        results['errors'].append(f"Error in {sheet_name} row {row.name}: Group_Code {row['Group_Code_id']} not found")
                                        continue
                                except Exception as e:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Error finding Group_Code {row['Group_Code_id']}: {str(e)}")
                                    continue

                            # Set the foreign key relationships
                            defaults['Test_Code'] = test_code
                            defaults['Group_Code'] = group_code

                            # Clean up ID fields from defaults
                            if 'Test_Code_id' in defaults:
                                del defaults['Test_Code_id']
                            if 'Group_Code_id' in defaults:
                                del defaults['Group_Code_id']

                            # Handle nullable fields
                            nullable_fields = ['package_code', 'package_name', 'test_name', 'Test_Method', 
                                            'IssubTest', 'SubTestCodes']
                            for field in nullable_fields:
                                if defaults.get(field) is None or pd.isna(defaults.get(field)):
                                    defaults[field] = None

                            # Handle offer_package_list_id
                            package_list_id = row.get('offer_package_list_id')
                            if package_list_id is None or pd.isna(package_list_id) or str(package_list_id).strip() == '':
                                # Auto-generate ID if not provided
                                package_list_id = test_id_counters.get(sheet_name, 1)
                                test_id_counters[sheet_name] = package_list_id + 1
                            else:
                                try:
                                    package_list_id = int(package_list_id)
                                    # Update counter to avoid conflicts
                                    if package_list_id >= test_id_counters.get(sheet_name, 1):
                                        test_id_counters[sheet_name] = package_list_id + 1
                                except (ValueError, TypeError):
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid offer_package_list_id {package_list_id}")
                                    continue

                            # Remove fields that don't exist in the model
                            fields_to_remove = ['UpdatedAt', 'CreatedAt', 'created_by']
                            for field in fields_to_remove:
                                if field in defaults:
                                    del defaults[field]

                            # Use update_or_create to handle existing records
                            obj, created_flag = OfferPackageList.objects.update_or_create(
                                offer_package_list_id=package_list_id,
                                defaults=defaults
                            )
                            
                            if created_flag:
                                created += 1
                            else:
                                updated += 1
                                
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue    
                
                
                elif sheet_name == 'Age_Setup_Master':
                    for _, row in df.iterrows():
                        try:
                            if not row.get('Test_Code_id'):
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing Test_Code_id")
                                continue
                            test_code = Test_Descriptions.objects.filter(Test_Code=row['Test_Code_id']).first()
                            if not test_code:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Test_Code {row['Test_Code_id']} not found")
                                continue

                            defaults = row.to_dict()
                            nullable_fields = ['FromAge', 'Toage', 'From_Value', 'To_Value', 'PanicLow', 'PanicHigh', 'NormalValue', 'Reference_Range', 'FromAgeType', 'ToAgeType']
                            for field in nullable_fields:
                                if defaults.get(field) is None or defaults.get(field) == 'nan':
                                    defaults[field] = None

                            test_id = row.get('Test_Id')
                            if test_id is None or test_id == 'nan':
                                test_id = test_id_counters[sheet_name]
                                test_id_counters[sheet_name] += 1
                            else:
                                try:
                                    test_id = int(test_id)
                                except (ValueError, TypeError):
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid Test_Id {test_id}")
                                    continue

                            mandatory_fields = ['Gender']
                            missing_fields = [f for f in mandatory_fields if not defaults.get(f)]
                            if missing_fields:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing mandatory fields: {', '.join(missing_fields)}")
                                continue

                            defaults['created_by'] = defaults.get('created_by', 'system')
                            if not defaults['created_by']:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing created_by")
                                continue

                            # Remove Test_Code_id from defaults since we're setting Test_Code
                            if 'Test_Code_id' in defaults:
                                del defaults['Test_Code_id']
                            
                            defaults['Test_Code'] = test_code

                            # Use update_or_create instead of create to handle existing Test_Ids
                            obj, created_flag = Age_Setup_Master.objects.update_or_create(
                                Test_Id=test_id,
                                defaults=defaults
                            )
                            created += created_flag
                            updated += not created_flag
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue
                elif sheet_name in ['Testmaster_Guideline', 'Testmaster_Interpretation', 'Testmaster_Reflex_Test']:
                    model = {
                        'Testmaster_Guideline': Testmaster_guideline_table,
                        'Testmaster_Interpretation': Testmaster_Interpretation_table,
                        'Testmaster_Reflex_Test': Testmaster_Reflex_Test,
                    }[sheet_name]
                    
                    for _, row in df.iterrows():
                        try:
                            if not row.get('Test_Code_id'):
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing Test_Code_id")
                                continue
                                
                            test_code = Test_Descriptions.objects.filter(Test_Code=row['Test_Code_id']).first()
                            if not test_code:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Test_Code {row['Test_Code_id']} not found")
                                continue
                            
                            defaults = row.to_dict()
                            defaults['Test_Code'] = test_code
                            if 'Test_Code_id' in defaults:
                                del defaults['Test_Code_id']
                            
                            # Handle Test_Id logic
                            test_id = row.get('Test_Id')
                            if test_id is None or test_id == 'nan' or str(test_id).strip() == '':
                                # Generate new Test_Id if not provided
                                test_id = test_id_counters[sheet_name]
                                test_id_counters[sheet_name] += 1
                            else:
                                try:
                                    test_id = int(test_id)
                                    # Remove the existence check - we want to update if it exists
                                except (ValueError, TypeError):
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid Test_Id {test_id}")
                                    continue
                            
                            defaults['created_by'] = defaults.get('created_by', 'system')
                            if not defaults['created_by']:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing created_by")
                                continue
                            
                            # This will create new record or update existing one based on Test_Id
                            obj, created_flag = model.objects.update_or_create(
                                Test_Id=test_id,
                                defaults=defaults
                            )
                            
                            if created_flag:
                                created += 1
                            else:
                                updated += 1
                                
                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            continue

                
                elif sheet_name == 'Testmaster_Cost_List':
                    def clean_code(value):
                        if pd.isna(value):
                            return ''
                        val = str(value).strip()
                        return val.split('.')[0] if val.endswith('.0') else val
                    print(f"Processing {sheet_name} with columns: {list(df.columns)}", flush=True)
                    valid_fields = {field.name for field in Testmaster_Cost_List._meta.get_fields()}
                    print(f"Valid fields for Testmaster_Cost_List: {valid_fields}", flush=True)
                    for _, row in df.iterrows():
                        try:
                            defaults = row.to_dict()
                            print(f"Row {row.name} data: {defaults}", flush=True)
                            test_code = None
                            group_code = None
                            package_code = None

                            test_code_id = clean_code(row.get('Test_Code_id'))
                            group_code_id = clean_code(row.get('Group_Code_id'))
                            package_code_id = clean_code(row.get('Package_Code_id'))

                            # Validate Test_Code
                            if test_code_id:
                                test_code = Test_Descriptions.objects.filter(Test_Code=test_code_id).first()
                                if not test_code:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid Test_Code_id {test_code_id}")
                                    continue

                            # Validate Group_Code
                            if group_code_id:
                                group_code = Group_Master.objects.filter(Group_Code=group_code_id).first()
                                if not group_code:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid Group_Code_id {group_code_id}")
                                    continue

                            # Validate Package_Code
                            if package_code_id:
                                print()
                                print(type(package_code_id))
                                package_code = OfferPackageMaster.objects.filter(offer_package_id=int(package_code_id)).first()
                                if not package_code:
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Package_Code {package_code_id} not found in OfferPackageMaster")
                                    continue

                            if not (test_code or group_code or package_code):
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Missing Test_Code_id, Group_Code_id, or Package_Code_id")
                                continue

                            defaults['Test_Code'] = test_code
                            defaults['Group_Code'] = group_code
                            defaults['Package_Code'] = package_code

                            # Clean nullable fields
                            for field in ['Inhouse_Doctor_Con', 'Referral_Doctor_Con', 'Visiting_Doctor_Con']:
                                if defaults.get(field) is None:
                                    defaults[field] = None

                            # Remove ID fields
                            for field in ['Test_Code_id', 'Group_Code_id', 'Package_Code_id', 'offer_package_id']:
                                defaults.pop(field, None)

                            # Set Test_Id
                            test_id = row.get('Test_Id')
                            if test_id is None or str(test_id).strip().lower() in ['nan', '']:
                                test_id = test_id_counters[sheet_name]
                                test_id_counters[sheet_name] += 1
                            else:
                                try:
                                    test_id = int(test_id)
                                except (ValueError, TypeError):
                                    skipped += 1
                                    results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid Test_Id {test_id}")
                                    continue

                            # created_by
                            if 'created_by' in valid_fields:
                                defaults['created_by'] = defaults.get('created_by', 'system') or 'system'
                            else:
                                defaults.pop('created_by', None)

                            if defaults.get('Basic') is None:
                                defaults['Basic'] = 0.000

                            # Validate fields
                            invalid_fields = set(defaults.keys()) - valid_fields
                            if invalid_fields:
                                skipped += 1
                                results['errors'].append(f"Error in {sheet_name} row {row.name}: Invalid field(s): {', '.join(invalid_fields)}")
                                continue

                            print(f"Final defaults for row {row.name}: {defaults}", flush=True)
                            obj, created_flag = Testmaster_Cost_List.objects.update_or_create(
                                Test_Id=test_id,
                                defaults=defaults
                            )
                            if created_flag:
                                created += 1
                            else:
                                updated += 1

                        except Exception as e:
                            skipped += 1
                            results['errors'].append(f"Error in {sheet_name} row {row.name}: {str(e)}")
                            print(f"Exception in row {row.name}: {str(e)}", flush=True)
    
                results['sheets_processed'][sheet_name] = {
                    'created': created,
                    'updated': updated,
                    'skipped': skipped
                }
                results['total_created'] += created
                results['total_updated'] += updated
                results['total_skipped'] += skipped

        return JsonResponse(results)

    except Exception as e:
        return JsonResponse({"error": f"Failed to process Excel file: {str(e)}"}, status=500)