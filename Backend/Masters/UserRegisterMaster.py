                 
import json
import random
import string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from .models import *
from django.contrib.auth.models import User
from HR_Management.models import *
from itertools import zip_longest



def Get_User_Detialsby_id(request):
    if request.method == 'GET':
        try:
            UserId = request.GET.get('UserId')
            print(UserId,'UserId')
            if UserId:
                UserRegister = UserRegister_Master_Details.objects.get(User_Id=UserId)

                print(UserRegister,'UserRegister')
                print(UserRegister.EmployeeType,'11111------')
                print(UserRegister.User_Id,'2222222-----')

                UserLabDep_ins=None
                User_Inventory_Store_ins = None
                ProductCategory_Access_ins = None
                SubCategory_Access_ins = None
                AssetCategory_Access_ins = None

                UserLabDep_ins = Lab_Departments_Details.objects.filter(user = UserId)
                User_Inventory_Store_ins=Inventory_Location_UserAccess_Details.objects.filter(user=UserId)
                ProductCategory_Access_ins=ProductCategory_Access_Details.objects.filter(user=UserId)
                SubCategory_Access_ins=SubCategory_Access_Details.objects.filter(user=UserId)
                AssetCategory_Access_ins = AssetCategory_Access_Details.objects.filter(user=UserId)

                lab_access_list = []
                for lab in UserLabDep_ins:
                    try:
                        lab_access_list.append({
                            "SubDepartment_Code": lab.Lab_DeptCode.SubDepartment_Code if lab.Lab_DeptCode else None,
                            "SubDepartment_Name": lab.Lab_DeptCode.SubDepartment_Name if lab.Lab_DeptCode else None
                        })
                    except Exception as e:
                        print(f"Lab access fetch failed for UserId {UserId}: {e}")
                        lab_access_list.append({
                            "SubDepartment_Code": None,
                            "SubDepartment_Name": None
                        })


                inventory_access_list = [
                    {
                        "Store_Id": store.InventoryIdAccess.Store_Id if store and store.InventoryIdAccess else None,
                        "Store_Type": store.InventoryIdAccess.Store_Type if store and store.InventoryIdAccess else None,
                        "Store_Name": store.InventoryIdAccess.Store_Name if store and store.InventoryIdAccess else None,
                        "InventoryStoreAccess": store.InventoryStoreAccess if store else None
                    }
                    for store in User_Inventory_Store_ins
                ]

                ProductCategory_list = [
                    {
                        "ProductCategoryAccess": ProductCategory.ProductCategoryAccess.ProductCategory_Name if ProductCategory and ProductCategory.ProductCategoryAccess else None,
                        "ProductCategoryAccessId": ProductCategory.ProductCategoryAccess.pk if ProductCategory and ProductCategory.ProductCategoryAccess else None
                    }
                    for ProductCategory in ProductCategory_Access_ins
                ]

                SubCategory_list = [
                    {
                        "SubCategoryAccess": SubCategory.SubCategoryAccess.SubCategoryName if SubCategory and SubCategory.SubCategoryAccess else None,
                        "SubCategoryAccessId": SubCategory.SubCategoryAccess.SubCategory_Id if SubCategory and SubCategory.SubCategoryAccess else None,
                        "ProductCategoryAccessId": SubCategory.SubCategoryAccess.ProductCategoryId.pk if SubCategory and SubCategory.SubCategoryAccess and SubCategory.SubCategoryAccess.ProductCategoryId else None,
                        "ProductCategoryAccess": SubCategory.SubCategoryAccess.ProductCategoryId.ProductCategory_Name if SubCategory and SubCategory.SubCategoryAccess and SubCategory.SubCategoryAccess.ProductCategoryId else None,
                    }
                    for SubCategory in SubCategory_Access_ins
                ]
                
                AssetCategory_list = [
                    {
                        "AssetCategoryAccess": AssetCategory.AssetCategoryAccess.name if AssetCategory and AssetCategory.AssetCategoryAccess else None,
                        "AssetCategoryAccessId": AssetCategory.AssetCategoryAccess.pk if AssetCategory and AssetCategory.AssetCategoryAccess else None
                    }
                    for AssetCategory in AssetCategory_Access_ins
                ]

 

                # stored_hashed_password = User.auth_user_id.password
                # user_input_password = "some_password"

                # if check_password(user_input_password, stored_hashed_password):
                #     print("Password is correct")
                # else:
                #     print("Password is incorrect")

                # Retrieve locations associated with the user
                locations = list(UserRegister.Locations.all().values('Location_Id', 'Location_Name'))
                doctor_professional=None
                
                if UserRegister.EmployeeType =='DOCTOR':
                    doctor_professional = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=UserRegister.Doctor_Id.Doctor_ID)
                    print(doctor_professional,'doctor_professional-------')
                
                
                
                
                UserRegister_dict = {
                    'id': UserRegister.User_Id,
                    'EmployeeType':UserRegister.EmployeeType,
                    'EmployeeId': UserRegister.Employee_Id.Employee_ID if UserRegister.EmployeeType =='EMPLOYEE' else '',
                    'DoctorId': UserRegister.Doctor_Id.Doctor_ID if UserRegister.EmployeeType =='DOCTOR' else '',
                    'UserName': UserRegister.auth_user_id.username,
                    'Password': UserRegister.plain_text_password,
                    # 'Password': UserRegister.auth_user_id.password,
                    'Title': UserRegister.Employee_Id.Tittle.Title_Name if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.Tittle.Title_Name,
                    'firstName': UserRegister.Employee_Id.First_Name if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.First_Name,
                    'middleName':  UserRegister.Employee_Id.Middle_Name if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.Middle_Name,
                    'lastName': UserRegister.Employee_Id.Last_Name if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.Last_Name,
                    'Email': UserRegister.Employee_Id.E_mail if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.E_mail,
                    'roleName': UserRegister.role.Role_Name, 
                    'Create': UserRegister.Create, 
                    'Edit': UserRegister.Edit, 
                    'Delete': UserRegister.Delete, 
                    'Read': UserRegister.Read, 
                    "lab_access": lab_access_list,
                    "inventory_access": inventory_access_list,
                    "ProductCategory_list": ProductCategory_list,
                    "SubCategory_list": SubCategory_list,
                    "AssetCategory_list":AssetCategory_list,
                    'PhoneNo': UserRegister.Employee_Id.Contact_Number if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.Contact_Number,
                    'Gender': UserRegister.Employee_Id.Gender if UserRegister.EmployeeType =='EMPLOYEE' else UserRegister.Doctor_Id.Gender,
                    'Qualification': 'EMP' if UserRegister.EmployeeType == 'EMPLOYEE' else (doctor_professional.Qualification if doctor_professional else ''),
                    'Status': UserRegister.Status,
                    'created_by': UserRegister.created_by,
                    'Access': UserRegister.Access,
                    'SubAccess': UserRegister.SubAccess,
                    'Locations': locations  # Assign the list of locations
                }

                print(UserRegister_dict,'UserRegister_dict-----------')
                return JsonResponse(UserRegister_dict)

        except UserRegister_Master_Details.DoesNotExist:
            return JsonResponse({'error': 'User not found'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    return JsonResponse({'error': 'Invalid request method'})



# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.contrib.auth import get_user_model
# from django.contrib.auth.hashers import make_password
# from itertools import zip_longest
# import json
# import logging
# from django.db.models import Max
# from django.db import transaction  # Add this import
# from .models import (
#     UserRegister_Master_Details, Role_Master, Location_Detials,
#     Doctor_Personal_Form_Detials, Employee_Personal_Form_Detials,
#     SubLab_Department_Detials, Lab_Departments_Details,
#     Inventory_Location_Master_Detials, Inventory_Location_UserAccess_Details,
#     Product_Category_Product_Details, ProductCategory_Access_Details,
#     SubCategory_Detailes, SubCategory_Access_Details,
#     AssetCategory_Access_Details,
# )
from AccetCategory.models import AssetCategory  # Add this import

# # Set up logging
# logger = logging.getLogger(__name__)
# User = get_user_model()

# @csrf_exempt
# def UserRegister_Detials_link(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             logger.debug(f"Received data: {data}")

#             # Extract data from request
#             UserId = data.get('UserId', '')
#             EmployeeType = data.get('EmployeeType', '')
#             employeeid = data.get('EmployeeId', '')
#             doctorid = data.get('DoctorId', '')
#             username = data.get('UserName', '')
#             password = data.get('Password', '')
#             roleName = data.get('roleName', '')
#             location_names = data.get('Location', '')
#             Access = data.get('ParentData', '')
#             SubAccess = data.get('ChildData', '')
#             Create = data.get('create', False)
#             Edit = data.get('edit', False)
#             Read = data.get('read', False)
#             Delete = data.get('delete', False)
#             created_by = data.get('created_by', '')
#             LabAccess = list(set(data.get('LabAccess', [])))
#             InventoryIdAccess = list(set(data.get('InventoryIdAccess', [])))
#             InventoryStoreAccess = list(set(data.get('InventoryStoreAccess', [])))
#             ProductCategoryAccess = list(set(data.get('ProductCategoryAccess', [])))
#             SubCategoryAccess = list(set(data.get('SubCategoryAccess', [])))
#             AssetCategoryAccess = list(set(data.get('AssetCategoryAccess', [])))

#             # Validate required fields
#             if not all([username, password, roleName, Access, SubAccess, location_names]):
#                 return JsonResponse({'error': 'Missing required fields'}, status=400)

#             # Validate AssetCategoryAccess IDs
#             if AssetCategoryAccess:
#                 invalid_ids = [cat_id for cat_id in AssetCategoryAccess if not isinstance(cat_id, int)]
#                 if invalid_ids:
#                     return JsonResponse({'error': f"Invalid asset category IDs: {invalid_ids}"}, status=400)

#             with transaction.atomic():
#                 if UserId:  # Update existing user
#                     try:
#                         user_instance = UserRegister_Master_Details.objects.get(User_Id=UserId)
#                         auth_user = user_instance.auth_user_id
#                     except UserRegister_Master_Details.DoesNotExist:
#                         return JsonResponse({'error': 'User not found'}, status=404)

#                     # Update user instance
#                     user_instance.plain_text_password = password
#                     user_instance.Access = Access
#                     user_instance.SubAccess = SubAccess
#                     user_instance.Create = Create
#                     user_instance.Edit = Edit
#                     user_instance.Delete = Delete
#                     user_instance.Read = Read
#                     user_instance.created_by = created_by
#                     user_instance.save()

#                     # Update auth_user if username or password changes
#                     if username and password:
#                         auth_user.username = username
#                         auth_user.set_password(password)
#                         auth_user.save()
#                         logger.debug(f"Updated auth_user: {auth_user.username}")

#                     # Clear existing asset category access
#                     AssetCategory_Access_Details.objects.filter(user=user_instance).delete()
#                     for AssetCatg in AssetCategoryAccess:
#                         try:
#                             AssetCategory_Ins = AssetCategory.objects.get(pk=AssetCatg)
#                             AssetAccess = AssetCategory_Access_Details(
#                                 user=user_instance,
#                                 AssetCategoryAccess=AssetCategory_Ins,
#                                 created_by=created_by
#                             )
#                             AssetAccess.save()
#                             logger.debug(f"Created/Updated AssetAccess: {AssetAccess}")
#                         except AssetCategory.DoesNotExist:
#                             logger.error(f"Asset category with ID {AssetCatg} not found")
#                             return JsonResponse({'error': f"Asset category with ID {AssetCatg} not found"}, status=404)

#                     # Update locations
#                     if location_names:
#                         location_names_list = location_names.split(',')
#                         locations = Location_Detials.objects.filter(Location_Name__in=location_names_list)
#                         if not locations.exists():
#                             return JsonResponse({'error': 'Invalid location names provided'}, status=400)
#                         user_instance.Locations.set(locations)
#                     else:
#                         user_instance.Locations.clear()

#                     return JsonResponse({'success': 'User details updated successfully'})

#                 else:  # Create new user
#                     if User.objects.filter(username=username).exists():
#                         return JsonResponse({'warn': f"The Username: {username} is already present"}, status=400)

#                     # Retrieve locations
#                     location_names_list = location_names.split(',') if location_names else []
#                     locations = Location_Detials.objects.filter(Location_Name__in=location_names_list)
#                     if location_names_list and not locations.exists():
#                         return JsonResponse({'error': 'Invalid location names provided'}, status=400)

#                     # Find doctor or employee instance
#                     Doctor_instance = None
#                     Employee_instance = None
#                     if doctorid:
#                         try:
#                             Doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctorid)
#                         except Doctor_Personal_Form_Detials.DoesNotExist:
#                             return JsonResponse({'error': 'Doctor not found'}, status=404)
#                     if employeeid:
#                         try:
#                             Employee_instance = Employee_Personal_Form_Detials.objects.get(pk=employeeid)
#                         except Employee_Personal_Form_Detials.DoesNotExist:
#                             return JsonResponse({'error': 'Employee not found'}, status=404)

#                     # Create auth_user
#                     try:
#                         user_auth_user = User.objects.create_user(
#                             username=username,
#                             password=password,
#                             first_name=Doctor_instance.First_Name if Doctor_instance else (Employee_instance.First_Name if Employee_instance else ''),
#                             last_name=Doctor_instance.Last_Name if Doctor_instance else (Employee_instance.Last_Name if Employee_instance else ''),
#                             email=Doctor_instance.E_mail if Doctor_instance else (Employee_instance.E_mail if Employee_instance else ''),
#                             is_staff=True
#                         )
#                     except Exception as e:
#                         logger.error(f"Error creating auth_user: {str(e)}")
#                         return JsonResponse({'error': f"Error creating user: {str(e)}"}, status=400)

#                     # Create user instance
#                     try:
#                         user_instance = UserRegister_Master_Details(
#                             auth_user_id=user_auth_user,
#                             plain_text_password=password,
#                             EmployeeType=EmployeeType,
#                             Doctor_Id=Doctor_instance,
#                             Employee_Id=Employee_instance,
#                             role=Role_Master.objects.get(Role_Name=roleName),
#                             Access=Access,
#                             SubAccess=SubAccess,
#                             Create=Create,
#                             Edit=Edit,
#                             Delete=Delete,
#                             Read=Read,
#                             created_by=created_by
#                         )
#                         user_instance.save()
#                         logger.debug(f"Created user_instance: {user_instance}")
#                     except Role_Master.DoesNotExist:
#                         logger.error(f"Role {roleName} not found")
#                         return JsonResponse({'error': f"Role {roleName} not found"}, status=404)

#                     # Create asset category access
#                     for AssetCatg in AssetCategoryAccess:
#                         try:
#                             AssetCategory_Ins = AssetCategory.objects.get(pk=AssetCatg)
#                             AssetAccess = AssetCategory_Access_Details(
#                                 user=user_instance,
#                                 AssetCategoryAccess=AssetCategory_Ins,
#                                 created_by=created_by
#                             )
#                             AssetAccess.save()
#                             logger.debug(f"Created AssetAccess: {AssetAccess}")
#                         except AssetCategory.DoesNotExist:
#                             logger.error(f"Asset category with ID {AssetCatg} not found")
#                             return JsonResponse({'error': f"Asset category with ID {AssetCatg} not found"}, status=404)

#                     # Assign locations
#                     user_instance.Locations.set(locations)

#                     return JsonResponse({'success': 'User registered successfully'})

#         except json.JSONDecodeError:
#             logger.error("Invalid JSON data received")
#             return JsonResponse({'error': 'Invalid JSON data'}, status=400)
#         except Exception as e:
#             logger.error(f"An error occurred in POST: {str(e)}", exc_info=True)
#             return JsonResponse({'error': f"An internal server error occurred: {str(e)}"}, status=500)

#     elif request.method == 'GET':
#         try:
#             user_register_data = User.objects.exclude(username='host').select_related()
#             RNo = 1
#             user_register_list = []

#             for user in user_register_data:
#                 user_register_ins = UserRegister_Master_Details.objects.select_related(
#                     'auth_user_id', 'Doctor_Id', 'Employee_Id', 'role'
#                 ).prefetch_related('Locations').filter(auth_user_id=user).first()

#                 if not user_register_ins:
#                     logger.debug(f"No UserRegister_Master_Details found for user: {user.username}")
#                     continue

#                 doctor_professional = None
#                 Employee_professional = None

#                 if user_register_ins.EmployeeType == 'DOCTOR' and user_register_ins.Doctor_Id:
#                     try:
#                         doctor_professional = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=user_register_ins.Doctor_Id.Doctor_ID)
#                     except Doctor_ProfessForm_Detials.DoesNotExist:
#                         logger.debug(f"No Doctor_ProfessForm_Detials found for Doctor_ID: {user_register_ins.Doctor_Id.Doctor_ID}")
#                         doctor_professional = None
#                 elif user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.Employee_Id:
#                     try:
#                         Employee_professional = Employee_Personal_Form_Detials.objects.get(pk=user_register_ins.Employee_Id.pk)
#                     except Employee_Personal_Form_Detials.DoesNotExist:
#                         logger.debug(f"No Employee_Personal_Form_Detials found for Employee_ID: {user_register_ins.Employee_Id.pk}")
#                         Employee_professional = None

#                 # Construct full name safely
#                 title = ''
#                 first_name = ''
#                 middle_name = ''
#                 last_name = ''
#                 if user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.Employee_Id:
#                     title = user_register_ins.Employee_Id.Tittle.Title_Name if user_register_ins.Employee_Id.Tittle else ''
#                     first_name = user_register_ins.Employee_Id.First_Name or ''
#                     middle_name = user_register_ins.Employee_Id.Middle_Name or ''
#                     last_name = user_register_ins.Employee_Id.Last_Name or ''
#                 elif user_register_ins.EmployeeType == 'DOCTOR' and user_register_ins.Doctor_Id:
#                     title = user_register_ins.Doctor_Id.Tittle.Title_Name if user_register_ins.Doctor_Id.Tittle else ''
#                     first_name = user_register_ins.Doctor_Id.First_Name or ''
#                     middle_name = user_register_ins.Doctor_Id.Middle_Name or ''
#                     last_name = user_register_ins.Doctor_Id.Last_Name or ''

#                 full_name = f"{title}.{first_name} {middle_name} {last_name}".strip()

#                 user_dict = {
#                     'id': RNo,
#                     'Userid': user_register_ins.User_Id,
#                     'EmployeeType': user_register_ins.EmployeeType or 'N/A',
#                     'EmployeeId': user_register_ins.Employee_Id.Employee_ID if user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.Employee_Id else '',
#                     'DoctorId': user_register_ins.Doctor_Id.Doctor_ID if user_register_ins.EmployeeType == 'DOCTOR' and user_register_ins.Doctor_Id else '',
#                     'UserName': user.username,
#                     'Name': full_name or 'N/A',
#                     'Email': user.email or 'N/A',
#                     'roleName': user_register_ins.role.Role_Name if user_register_ins.role else 'N/A',
#                     'PhoneNo': (
#                         user_register_ins.Employee_Id.Contact_Number if user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.Employee_Id else
#                         user_register_ins.Doctor_Id.Contact_Number if user_register_ins.EmployeeType == 'DOCTOR' and user_register_ins.Doctor_Id else 'N/A'
#                     ),
#                     'Gender': (
#                         user_register_ins.Employee_Id.Gender if user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.Employee_Id else
#                         user_register_ins.Doctor_Id.Gender if user_register_ins.EmployeeType == 'DOCTOR' and user_register_ins.Doctor_Id else 'N/A'
#                     ),
#                     'Qualification': (
#                         user_register_ins.Employee_Id.Qualification if user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.Employee_Id else
#                         (doctor_professional.Qualification if doctor_professional else '') if user_register_ins.EmployeeType == 'DOCTOR' else 'N/A'
#                     ),
#                     'Locations': [location.Location_Name for location in user_register_ins.Locations.all()],
#                     'Status': 'Active' if user.is_active else 'Inactive',
#                     'created_by': user_register_ins.created_by or 'N/A'
#                 }

#                 user_register_list.append(user_dict)
#                 RNo += 1

#             return JsonResponse(user_register_list, safe=False)

#         except Exception as e:
#             logger.error(f"An error occurred in GET: {str(e)}", exc_info=True)
#             return JsonResponse({'error': f"An internal server error occurred: {str(e)}"}, status=500)

#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)

    

@csrf_exempt
def UserRegister_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'aaaaaaaaaaaaaaaaaaaa')  # For debugging purposes
           
            UserId = data.get('UserId', '')
            EmployeeType = data.get('EmployeeType', '')
            employeeid = data.get('EmployeeId', '')
            doctorid = data.get('DoctorId', '')
            username = data.get('UserName', '')
            password = data.get('Password', '')
            roleName = data.get('roleName', '')
            location_names = data.get('Location', '')  # Assuming location names are passed as a string
 
            Access = data.get('ParentData', '')
            SubAccess = data.get('ChildData', '')
            Create = data.get('create', '')
            Edit = data.get('edit', '')
            Read = data.get('read', '')
            Delete = data.get('delete', '')
            created_by = data.get('created_by', '')
            
            # LabAccess = data.get('LabAccess', '')
            # InventoryIdAccess = data.get('InventoryIdAccess', '')
            # InventoryStoreAccess = data.get('InventoryStoreAccess', '')
 
            LabAccess = list(set(data.get('LabAccess', [])))
            InventoryIdAccess = list(set(data.get('InventoryIdAccess', [])))
            InventoryStoreAccess = data.get('InventoryStoreAccess', [])
            ProductCategoryAccess = data.get('ProductCategoryAccess', [])
            SubCategoryAccess = data.get('SubCategoryAccess', [])
            AssetCategoryAccess = list(set(data.get('AssetCategoryAccess', [])))

            
            if UserId:  # If UserId is provided, update existing user
                user_instance = UserRegister_Master_Details.objects.get(User_Id=UserId)
                auth_user = user_instance.auth_user_id
                user_instance.plain_text_password = password
                user_instance.Access = Access
                user_instance.SubAccess = SubAccess
                user_instance.Create = Create
                user_instance.Edit = Edit
                user_instance.Delete = Delete
                user_instance.Read = Read
                user_instance.created_by = created_by
                user_instance.save()

                if password and username:
                    auth_user.username = username
                    auth_user.password = make_password(password)
                    auth_user.save()
                    print(auth_user,'auth_user---------j')

               
 
            # ---- LAB ACCESS ----

                Lab_Departments_Details.objects.filter(user=user_instance).exclude(
                    Lab_DeptCode__SubDepartment_Code__in=LabAccess
                ).delete()

                for lab in LabAccess:
                   
                    LabIns = SubLab_Department_Detials.objects.get(pk=lab)
                    print(LabIns, 'LabIns')

                    LabDept_instance = Lab_Departments_Details.objects.filter(user=user_instance, Lab_DeptCode=LabIns).first()

                    if LabDept_instance:
                        # update existing
                        LabDept_instance.Lab_DeptCode = LabIns
                        LabDept_instance.created_by = created_by
                        LabDept_instance.save()
                        print(LabDept_instance, 'LabDept_instance updated')
                    else:
                        # create new
                        LabDept_instance = Lab_Departments_Details(
                            user=user_instance,
                            Lab_DeptCode=LabIns,
                            created_by=created_by
                        )
                        LabDept_instance.save()
                        print(LabDept_instance, 'LabDept_instance created')

                # ---- INVENTORY ACCESS ----

                Inventory_Location_UserAccess_Details.objects.filter(user=user_instance).exclude(
                    InventoryIdAccess__Store_Id__in=InventoryIdAccess
                ).delete()

                # if len(InventoryIdAccess) != len(InventoryStoreAccess):
                #     return JsonResponse({'error': 'Inventory ID and Store Access count mismatch'})

                for Inv, InvStore in zip_longest(InventoryIdAccess, InventoryStoreAccess, fillvalue=''):
                    print(Inv, InvStore, 'Just checking loop start')
                    InvIns = Inventory_Location_Master_Detials.objects.get(Store_Id=Inv)

                    InvAccess = Inventory_Location_UserAccess_Details.objects.filter(
                        user=user_instance, InventoryIdAccess=InvIns
                    ).first()

                    if InvAccess:
                        InvAccess.InventoryIdAccess = InvIns
                        InvAccess.InventoryStoreAccess = InvStore
                        InvAccess.created_by = created_by
                        InvAccess.save()
                        print(InvAccess, '✅ InvAccess updated')
                    else:
                        InvAccess = Inventory_Location_UserAccess_Details(
                            user=user_instance,
                            InventoryIdAccess=InvIns,
                            InventoryStoreAccess=InvStore,
                            created_by=created_by
                        )
                        InvAccess.save()
                        print(InvAccess, '🆕 InvAccess created')

                
                ProductCategory_Access_Details.objects.filter(user=user_instance).exclude(
                    ProductCategoryAccess__pk__in=ProductCategoryAccess
                ).delete()


                for ProdCatg in ProductCategoryAccess:
                    ProductCategory_Ins = Product_Category_Product_Details.objects.get(pk=ProdCatg)
                    ProductAccess = ProductCategory_Access_Details.objects.filter(user=user_instance,ProductCategoryAccess=ProductCategory_Ins).first()

                    if ProductAccess:
                        ProductAccess.ProductCategoryAccess = ProductCategory_Ins
                        ProductAccess.created_by = created_by
                        ProductAccess.save()

                        print(ProductAccess,'ProductAccess---1')
                    else:
                        ProductAccess= ProductCategory_Access_Details(
                            user=user_instance,
                            ProductCategoryAccess=ProductCategory_Ins,
                            created_by=created_by
                        )   
                        ProductAccess.save()
                        print(ProductAccess,'ProductAccess---2')


                SubCategory_Access_Details.objects.filter(user=user_instance).exclude(
                    SubCategoryAccess__SubCategory_Id__in=SubCategoryAccess
                ).delete()

                for SubCatg in SubCategoryAccess:
                    SubCategory_Ins = SubCategory_Detailes.objects.get(SubCategory_Id = SubCatg)
                    SubCategoryAccess = SubCategory_Access_Details.objects.filter(user=user_instance,SubCategoryAccess=SubCategory_Ins).first()

                    if SubCategoryAccess:
                        SubCategoryAccess.SubCategoryAccess = SubCategory_Ins
                        SubCategoryAccess.created_by = created_by
                        SubCategoryAccess.save()

                        print(SubCategoryAccess,'SubCategoryAccess---1')
                    else:
                        SubCategoryAccess= SubCategory_Access_Details(
                            user=user_instance,
                            SubCategoryAccess=SubCategory_Ins,
                            created_by=created_by
                        )   
                        SubCategoryAccess.save()
                        print(SubCategoryAccess,'SubCategoryAccess---2')

                AssetCategory_Access_Details.objects.filter(user=user_instance).exclude(
                    AssetCategoryAccess__pk__in = AssetCategoryAccess
                ).delete() 
                for AssetCatg in AssetCategoryAccess:
                    AssetCategory_Ins = AssetCategory.objects.get(pk = AssetCatg)
                    AssetCategoryAccess = AssetCategory_Access_Details.objects.filter(user=user_instance,AssetCategoryAccess=AssetCategory_Ins).first()

                    if AssetCategoryAccess:
                        AssetCategoryAccess.AssetCategoryAccess = AssetCategory_Ins
                        AssetCategoryAccess.created_by = created_by
                        AssetCategoryAccess.save()

                        print(AssetCategoryAccess,'AssetCategoryAccess---1')
                    else:
                        AssetCategoryAccess= SubCategory_Access_Details(
                            user=user_instance,
                            AssetCategoryAccess=AssetCategory_Ins,
                            created_by=created_by
                        )   
                        AssetCategoryAccess.save()
                        print(AssetCategoryAccess,'AssetCategoryAccess---2')




                # Update locations
                if location_names:
                    location_names_list = location_names.split(',')
                    locations = Location_Detials.objects.filter(Location_Name__in=location_names_list)
                    user_instance.Locations.set(locations)
               
                return JsonResponse({'success': 'User details updated successfully'})
 
            else:  # If UserId is not provided, create a new user
                if User.objects.filter(username=username).exists():
                    return JsonResponse({'warn': f"The Username: {username} is already present"})
                else:
                   
 
                   
 
                    # Retrieve locations based on location_names
                    if location_names:
                        location_names_list = location_names.split(',')
                        locations = Location_Detials.objects.filter(Location_Name__in=location_names_list)
                    else:
                        locations = []
 
                    Doctor_instance = None
                    Employee_instance = None
 
                    # Find instance of doctor and employee
                    if doctorid:
                        Doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctorid)
                    if employeeid:
                        try:
                            Employee_instance = Employee_Personal_Form_Detials.objects.get(pk=employeeid)
                        except Employee_Personal_Form_Detials.DoesNotExist:
                            return JsonResponse({'error': 'Employee not found'}, status=404)
 
                    # Create user instance

                    hashed_password = make_password(password)

                    print(hashed_password,'hashed_password------')

                    lname = Doctor_instance.Last_Name if Doctor_instance else Employee_instance.Last_Name


                   
                    user_auth_user = User.objects.create_user(
                        username=username,
                        # password=hashed_password,
                        password=password,
                        first_name=Doctor_instance.First_Name if Doctor_instance else Employee_instance.First_Name,
                        last_name=lname if lname else '',
                        email= Doctor_instance.E_mail if Doctor_instance else Employee_instance.E_mail,
                        is_staff=True
                    )
                    user_instance = UserRegister_Master_Details(
                        auth_user_id = user_auth_user,
                        plain_text_password=password,
                        EmployeeType=EmployeeType,
                        Doctor_Id=Doctor_instance,
                        Employee_Id=Employee_instance,
                        role=Role_Master.objects.get(Role_Name=roleName),  # Correct role assignment
                        Access=Access,
                        SubAccess=SubAccess,
                        Create=Create,
                        Edit=Edit,
                        Delete=Delete,
                        Read=Read,
                        created_by=created_by
                    )
                    user_instance.save()

                    print(user_instance,'user_instance--------')

                    for lab in LabAccess:
                        LabIns = SubLab_Department_Detials.objects.get(pk=lab)
                        # LabIns = Lab_Deartments_Details.objects.filter(Lab_DeptCode__pk=lab)
                        print(LabIns,'LabIns')
                        LabDept_instance= Lab_Departments_Details(
                            user=user_instance,
                            Lab_DeptCode=LabIns,
                            created_by=created_by
                        )
                        LabDept_instance.save()
                        print(LabDept_instance,'LabDept_instance')

                        
                    for Inv, InvStore in zip(InventoryIdAccess, InventoryStoreAccess):
                        print(Inv, InvStore, 'Just checking loop start')
                        InvIns = Inventory_Location_Master_Detials.objects.get(Store_Id=Inv)
                        
                        InvAccess = Inventory_Location_UserAccess_Details(
                            user=user_instance,
                            InventoryIdAccess=InvIns,
                            InventoryStoreAccess=InvStore,
                            created_by=created_by
                        )
                        InvAccess.save()
                        print(InvAccess, 'InvAccess-------')

                    for ProdCatg in ProductCategoryAccess:
                        ProductCategory_Ins = Product_Category_Product_Details.objects.get(pk=ProdCatg)
                        ProductAccess=ProductCategory_Access_Details(
                            user=user_instance,
                            ProductCategoryAccess=ProductCategory_Ins,
                            created_by=created_by
                        )
                        ProductAccess.save()
                        print(ProductAccess,'ProductAccess---3')



                    for SubCatg in SubCategoryAccess:    
                        SubCategory_Ins = SubCategory_Detailes.objects.get(SubCategory_Id = SubCatg)
                        SubCategoryAccess= SubCategory_Access_Details(
                            user=user_instance,
                            SubCategoryAccess=SubCategory_Ins,
                            created_by=created_by
                        )   
                        SubCategoryAccess.save()
                        print(SubCategoryAccess,'SubCategoryAccess---3')

                    # AssetCategory_Access_Details.objects.(user=user_instance).delete()
                    for AssetCatg in AssetCategoryAccess:
                        AssetCategory_Ins = AssetCategory.objects.get(pk=AssetCatg)
                        AssetAccess = AssetCategory_Access_Details(
                            user=user_instance,
                            AssetCategoryAccess=AssetCategory_Ins,
                            created_by=created_by
                        )
                        AssetAccess.save()  
                        print(AssetAccess,'AssetAccess---3')
                            
                    # Assign locations to the user using the set() method of the ManyToManyField
                    user_instance.Locations.set(locations)
 
                    return JsonResponse({'success': f'User registered successfully. Password: ' if not password else 'User registered successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    elif request.method == 'GET':
        try:
            # Retrieve all users except the 'host' user
            # user_register_data = User.objects.exclude(username='host')
            user_register_data = User.objects.all().exclude(
   id__in=[1, 2]
            )
            print(user_register_data, 'user_register_data')
            
            RNo = 1
            user_register_list = []
            
            # Loop through all the users
            for user in user_register_data:
                print(user.username,'username')
                print(user.pk,'pk')
 
                # Try to fetch UserRegister_Master_Details for each user, if it exists
                # user_register_ins = UserRegister_Master_Details.objects.filter(auth_user_id__username=user.username).first()
                user_register_ins = UserRegister_Master_Details.objects.select_related(

                    'auth_user_id', 'Doctor_Id', 'Employee_Id', 'role'

                ).prefetch_related('Locations').filter(auth_user_id__username=user.username).first()

 
                print('0000')
                print('user_register_ins:', user_register_ins)
 
                # If no registration details exist for the user, you can choose to either skip the user or handle it differently
                if not user_register_ins:
                    user_register_ins = None  # Explicitly set to None if the record doesn't exist
 
                # Initialize professional details as None
                doctor_professional = None
                Employee_professional = None
 
                if user_register_ins:
                    # If there is a registration entry, get doctor or employee professional details
                    if user_register_ins.EmployeeType == 'DOCTOR' and user_register_ins.Doctor_Id:
                        doctor_professional = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=user_register_ins.Doctor_Id.Doctor_ID)
                        print('doctor_professional:', doctor_professional)
                    elif user_register_ins.EmployeeType == 'EMPLOYEE' and user_register_ins.pk:
                        Employee_professional = Employee_Personal_Form_Detials.objects.get(pk=user_register_ins.Employee_Id.pk)
                        print('Employee professional details:', Employee_professional)
 
                # Construct the user dict with available information
                
                user_dict = {
    'id': RNo,
    'Userid': user_register_ins.pk if user_register_ins else '',
    'EmployeeType': user_register_ins.EmployeeType if user_register_ins else '',
    'EmployeeId': user_register_ins.Employee_Id.pk if user_register_ins and user_register_ins.EmployeeType == 'EMPLOYEE' else '',
    'DoctorId': user_register_ins.Doctor_Id.Doctor_ID if user_register_ins and user_register_ins.EmployeeType == 'DOCTOR' else '',
    'UserName': user.username,
    'Name':
        (
            f"{user_register_ins.Employee_Id.Tittle.Title_Name if user_register_ins.Employee_Id.Tittle else ''}."
            f"{user_register_ins.Employee_Id.First_Name} "
            f"{user_register_ins.Employee_Id.Middle_Name} "
            f"{user_register_ins.Employee_Id.Last_Name}"
        ) if user_register_ins and user_register_ins.EmployeeType == 'EMPLOYEE'
        else (
            f"{user_register_ins.Doctor_Id.Tittle.Title_Name if user_register_ins.Doctor_Id.Tittle else ''}."
            f"{user_register_ins.Doctor_Id.First_Name} "
            f"{user_register_ins.Doctor_Id.Middle_Name} "
            f"{user_register_ins.Doctor_Id.Last_Name}"
        ) if user_register_ins and user_register_ins.EmployeeType == 'DOCTOR'
        else '',
    'Email': user.email,
    'roleName': user_register_ins.role.Role_Name if user_register_ins else '',
    'PhoneNo': (
        user_register_ins.Employee_Id.Contact_Number
        if user_register_ins and user_register_ins.EmployeeType == 'EMPLOYEE'
        else user_register_ins.Doctor_Id.Contact_Number
        if user_register_ins and user_register_ins.EmployeeType == 'DOCTOR'
        else ''
    ),
    'Gender': (
        user_register_ins.Employee_Id.Gender
        if user_register_ins and user_register_ins.EmployeeType == 'EMPLOYEE'
        else user_register_ins.Doctor_Id.Gender
        if user_register_ins and user_register_ins.EmployeeType == 'DOCTOR'
        else ''
    ),
    'Qualification': (
        user_register_ins.Employee_Id.Qualification
        if user_register_ins and user_register_ins.EmployeeType == 'EMPLOYEE'
        else doctor_professional.Qualification
        if doctor_professional
        else ''
    ) if user_register_ins else '',
    'Locations': [l.Location_Name for l in user_register_ins.Locations.all()] if user_register_ins else [],
    'Status': 'Active' if user.is_active else 'Inactive',
    'created_by': user_register_ins.created_by if user_register_ins else ''
}

                
 
                # Append the user dict to the list
                user_register_list.append(user_dict)
                RNo += 1
 
            return JsonResponse(user_register_list, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    else:
        return JsonResponse({'error': 'Invalid request method'})
    
    
    
    
@csrf_exempt
def update_status_User_Detials_link(request):
    try:
        data = json.loads(request.body)

        UserId = data.get('UserId','')
        # Retrieve data from Doctor_Personal_Form_Detials
        user_data_ins = UserRegister_Master_Details.objects.get(User_Id = UserId)
        user_data_ins.Status = not user_data_ins.Status
        user_data_ins.save()

        # Return JSON response
        return JsonResponse({'success': 'User Status Updated successfully'})
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})


