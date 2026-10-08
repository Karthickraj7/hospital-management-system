
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import *
from Masters.models import *
from Frontoffice.models import *
from django.utils.timezone import now
import base64
import filetype
from django.core.serializers import serialize
# import magic
from PIL import Image
from datetime import datetime
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from docx import Document
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to
from .LabRequests import model_to_dict, extract_panic_range
from Lab.BillingView import get_invoice_master_barcode


@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Queuelist_link_for_All_doctor(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        employee_id = request.GET.get('Employeeid', '')
        radiologistid = request.GET.get('radiologistid')
 
        seen_registration_ids = set()
        response_data = []
        index = 1
 
        ### ----- 1. FROM REQUEST DETAILS (Pending/Due) -----
        # request_queryset = Radiology_Request_Details.objects.all()
 
        if radiologistid:
            complete_queryset = Radiology_Complete_Details.objects.filter(RadiologistName=radiologistid)
 
        else:
            complete_queryset = Radiology_Complete_Details.objects.all()
 
 
        for comp in complete_queryset:
 
            request_queryset = Radiology_Request_Details.objects.filter(Service_Status='Anaylzed',Radiology_RequestId=comp.Radiology_RequestId.Radiology_RequestId)
     
            if query:
                request_queryset = request_queryset.filter(
                    Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                    Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                    Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                    Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                    Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                    Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                    Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                    Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                    Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                    Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                    Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                    Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                    Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                    Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                    Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query)
                )
   
            if status:
                request_queryset = request_queryset.filter(Q(Status__icontains=status) | Q(Status__icontains='Due'))
   
            for req in request_queryset:
                reg_type = req.RegisterType
                registration = None
                if reg_type in ['OP', 'WALK-IN'] and req.OP_Register_Id:
                    registration = req.OP_Register_Id
                elif reg_type == 'IP' and req.IP_Register_Id:
                    registration = req.IP_Register_Id
                elif reg_type == 'Casuality' and req.Casuality_Register_Id:
                    registration = req.Casuality_Register_Id
   
                if not registration:
                    continue
   
                patient = registration.PatientId if registration else None
                doctor = req.Doctorid if reg_type in ['OP', 'WALK-IN'] else registration.PrimaryDoctor
                TestNames = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first() if req.TestCode else None
                TestName = TestNames.Test_Name if TestNames else ''
                response_data.append({
                    'id': index,
                    'PatientId': patient.PatientId if patient else '',
                    'VisitId': registration.VisitId if reg_type in ['OP', 'WALK-IN'] else None,
                    'RegistrationId': registration.Registration_Id,
                    'PatientName': f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else '',
                    'PhoneNumber': patient.PhoneNo if patient else '',
                    'DoctorId': doctor.Doctor_ID if doctor else '',
                    'DoctorName': f"{doctor.Tittle.Title_Name}. {doctor.First_Name}{doctor.Middle_Name}{doctor.Last_Name}" if doctor else '',
                    'RegisterType': reg_type,
                    'age': patient.Age if patient else '',
                    'gender': patient.Gender if patient else '',
                    'Status': req.Status,
                    'TestCode': req.TestCode,
                    'SubTestCode': req.SubTestCode,
                    'TestName':TestName,
                    'Radiology_RequestId':req.Radiology_RequestId,
                    'isCompleted': False,  # Flag to indicate this is from Request Details
                })
                index += 1
   
 
 
        ### ----- 2. FROM COMPLETE DETAILS (Completed Reports) -----
        # complete_queryset = Radiology_Complete_Details.objects.select_related(
        #     'OP_Register_Id__PatientId',
        #     'IP_Register_Id__PatientId',
        #     'Casuality_Register_Id__PatientId',
        #     'department'
        # )
 
        # if query:
        #     complete_queryset = complete_queryset.filter(
        #         Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
        #         Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
        #         Q(OP_Register_Id__PatientId__SurName__icontains=query) |
        #         Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
        #         Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
        #         Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
        #         Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
        #         Q(IP_Register_Id__PatientId__SurName__icontains=query) |
        #         Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
        #         Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
        #         Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
        #         Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
        #         Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
        #         Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
        #         Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query)
        #     )
 
        # if status:
        #     complete_queryset = complete_queryset.filter(Q(Status__icontains=status))
 
        # for rec in complete_queryset:
        #     reg_type = rec.RegisterType
        #     registration = None
        #     if reg_type in ['OP', 'WALK-IN'] and rec.OP_Register_Id:
        #         registration = rec.OP_Register_Id
        #     elif reg_type == 'IP' and rec.IP_Register_Id:
        #         registration = rec.IP_Register_Id
        #     elif reg_type == 'Casuality' and rec.Casuality_Register_Id:
        #         registration = rec.Casuality_Register_Id
 
        #     if not registration:
        #         continue
 
        #     patient = registration.PatientId if registration else None
 
        #     # response_data.append({
        #     #     'id': index,
        #     #     'PatientId': patient.PatientId if patient else '',
        #     #     'VisitId': registration.VisitId if reg_type in ['OP', 'WALK-IN'] else None,
        #     #     'RegistrationId': registration.Registration_Id,
        #     #     'PatientName': f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else '',
        #     #     'PhoneNumber': patient.PhoneNo if patient else '',
        #     #     'DoctorId': rec.doctorId if rec.doctorId else '',
        #     #     'DoctorName': rec.doctorName if rec.doctorName else '',
        #     #     'RegisterType': reg_type,
        #     #     'age': patient.Age if patient else '',
        #     #     'gender': patient.Gender if patient else '',
        #     #     'Status': rec.Status,
        #     #     'isCompleted': True,  # Flag to indicate this is from Complete Details
        #     #     'ReportDate': rec.ReportDate.strftime('%Y-%m-%d %H:%M:%S') if rec.ReportDate else '',
        #     #     'RadiologistName': rec.RadiologistName,
        #     #     'Technician_Name': rec.Technician_Name,
        #     #     # 'department': rec.department.Radiology_Name if rec.department else '',
        #     #     # 'fileName': rec.fileName if rec.fileName else '',
        #     #     'html': rec.html_content,
        #     #     'fileName': rec.fileName,
        #     #     # 'fileType': rec.file_extension,
        #     #     # 'fileUrl': rec.file_url,
        #     #     'department': rec.department.Radiology_Name,
        #     #     'created_at': rec.created_at.strftime('%Y-%m-%d %H:%M:%S') if rec.created_at else '',
        #     #     'Radiology_CompleteId' :rec.Radiology_CompleteId,
        #     # })
        #     # index += 1
 
 
 
        return JsonResponse(response_data, safe=False)
 
    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': f'Internal server error occurred{e}'}, status=500)
 
 
 


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def ReferDoctor_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            ReferId = data.get("ReferId", '')
            PrimaryDoctorId = data.get("DoctorID", '')
            VisitId = data.get("VisitId", '')
            PatientId = data.get("PatientId", '')
            DoctorType = data.get("doctorType", '')
            Remarks = data.get("remarks", '')
            ReferDoctorId = data.get("doctorName", '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            # Fetch the primary doctor instance
            
            doctor_register_instance = Doctor_Personal_Form_Detials.objects.get(pk=PrimaryDoctorId)
            print(doctor_register_instance)
            
            # Fetch the referred doctor instance, if provided
            refer_register_instance = Doctor_Personal_Form_Detials.objects.get(pk=ReferDoctorId) if ReferDoctorId else None
            print(refer_register_instance)
            
            if refer_register_instance:
                
                refer_register_instancetype = refer_register_instance.DoctorType
                print(f"ReferDoctorType: {refer_register_instancetype}")
            else:
                refer_register_instancetype = DoctorType
                
            
            # Create a new referral entry
            ReferalDoctorDetails.objects.create(
                PatientId=PatientId,
                VisitId=VisitId,
                PrimaryDoctorId=doctor_register_instance,
                ReferDoctorId=refer_register_instance,
                ReferDoctorType=refer_register_instancetype,
                Remarks=Remarks,
                created_by=created_by
            )

            return JsonResponse({'success': 'Refer a Doctor added successfully'}, status=200)

        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Doctor not found'})
        except Exception as e:
            return JsonResponse({'error': 'An error occurred while processing your request'}, status=500)

    elif request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId', None)
            VisitId = request.GET.get('VisitId', None)
            filters = {}
            if PatientId:
                filters['PatientId'] = PatientId
            if VisitId:
                filters['VisitId'] = VisitId

            refer_doctors = ReferalDoctorDetails.objects.filter(**filters)
            refer_data = []
            index = 1

            
            for refer in refer_doctors:
                primary_doctor_name = f"{refer.PrimaryDoctorId.Tittle} {refer.PrimaryDoctorId.First_Name} {refer.PrimaryDoctorId.Middle_Name} {refer.PrimaryDoctorId.Last_Name}".strip()
                refer_doctor_name = f"{refer.ReferDoctorId.Tittle} {refer.ReferDoctorId.First_Name} {refer.ReferDoctorId.Middle_Name} {refer.ReferDoctorId.Last_Name}".strip() if refer.ReferDoctorId else 'N/A'

                refer_data.append({
                    'id': index,
                    'ReferId': refer.Refer_Id,
                    'PatientId': refer.PatientId,
                    'VisitId': refer.VisitId,
                    'PrimaryDoctorId': refer.PrimaryDoctorId.pk if refer.PrimaryDoctorId else None,
                    'PrimaryDoctorName': primary_doctor_name,
                    'ReferDoctorId': refer.ReferDoctorId.pk if refer.ReferDoctorId else None,
                    'ReferDoctorName': refer_doctor_name,
                    'DoctorType': refer.ReferDoctorType,
                    'Remarks': refer.Remarks,
                    'Status': 'Active' if refer.Status else 'Inactive',
                    'created_by': refer.created_by
                })
                index += 1
            return JsonResponse(refer_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})
    # Ensure there's an HttpResponse in every code path
    return JsonResponse({'error': 'Invalid request method'},status=405)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lab_Request_Detailslink(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
 
            # Extract data from the request
            lab_queue_id = data.get('LabQueueId', '')
            created_by = data.get('created_by', '')
            registration_id = data.get('Register_Id', None)
            register_type = data.get('RegisterType', '')
            SelectedTest = data.get("SelectedTest", [])
            location = data.get('location')
            Remarks = data.get("Remarks")

            DoctorId = data.get('DoctorId')

            Doctorins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()


 
            print(data)
 
            if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
                return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})
 
            # Prepare the arguments based on the register type
            register_kwargs = {'RegisterType': register_type}
            if register_type == 'OP':
                try:
                    op_register_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                    register_kwargs['OP_Register_Id'] = op_register_instance
                except Patient_Appointment_Registration_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'OP Registration ID not found'})
 
            elif register_type == 'IP':
                try:
                    ip_register_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
                    register_kwargs['IP_Register_Id'] = ip_register_instance

                except Patient_IP_Registration_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'IP Registration ID not found'})
        
            elif register_type == 'Casuality':
                try:
                    casuality_register_instance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=registration_id)
                    register_kwargs['Casuality_Register_Id'] = casuality_register_instance

                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'Casuality Registration ID not found'})
 
            # Insert into Lab_Request_Details
            Location_instance = Location_Detials.objects.get(Location_Id=location)
            if len(SelectedTest)> 0:
                lab_request = Lab_Request_Details.objects.create(
                    Doctor = Doctorins,
                    created_by=created_by,
                    Location=Location_instance,
                    Remarks=Remarks,
                    **register_kwargs,
                )

            
            
            
            
            
            
            # Loop through SelectedTest and insert into Lab_Request_Items_Details
            for test in SelectedTest:
 
                    print(test,'test')
                    SubDepartment_Code = test.get("sub_department_id")
                    testType = test.get("testType")
                    Department_Code = test.get("department_id")
                    Code = test.get("Code")

                    print(testType)

                    NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
                        item_id_int=Cast("Item_Id", IntegerField())
                    ).aggregate(Max("item_id_int"))["item_id_int__max"]
                    NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

                    
                    print(NextItemID,'NextItemID')

                    Dcode = None
                    lab_request_item_data = {}
                    if testType == 'Individual':

                        print(testType,'testType')

                        Dcode = Test_Descriptions.objects.get(Test_Code = Code)


                        lab_request_item_data = {
                            "Item_Id":NextItemID,
                            "Request": lab_request,
                            "TestType": testType,
                            "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
                            "Department_Code_id": Dcode.department.Department_Code,
                            }

                    elif testType == 'Group':
                        print(testType,'testType')

                        Gcode = Group_Master.objects.get(Group_Code = Code)
                     
                        lab_request_item_data = {
                            "Item_Id":NextItemID,
                            "Request": lab_request,
                            "TestType": testType,
                            "Department_Code_id": Gcode.Department.department.Department_Code,
                            "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
                            }

                    elif testType == 'Offers':
                        print(testType, 'testType')
                        Pcode = OfferPackageMaster.objects.get(package_code=Code)
                        department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
                        lab_department = Lab_Department_Detials.objects.get(Department_Code=department.department_id)
                        print("---------", Pcode.department_name)
                        print("---------", Pcode.pk)
                        print("----IDDDDDDD-----", Pcode.offer_package_id)
                        lab_request_item_data = {
                            "Item_Id": NextItemID,
                            "Request": lab_request,
                            "TestType": testType,
                            "Department_Code_id": lab_department.pk,
                            "SubDepartment_Code_id": department.pk,
                        }



                    print(NextItemID,'NextItemID')

                    
                    

                    
                    print(lab_request_item_data,'lab_request_item_data')

                    # Insert into appropriate columns based on testType
                    if testType == "Individual":
                        lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
                    elif testType == "Profiles" or testType == "Group":
                        lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
                    elif testType == "Profiles" or testType == "Offers":
                        lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code
                    # Save the item
                    Lab_Request_Items_Details.objects.create(**lab_request_item_data)
            
            
            if register_type == 'IP':       
                item_details = []
                filterdepartment = []
                TestDetails = []
                keys_seen = set()
                filterSpecimen = []
                Specimen_keys_seen = set()
                for index, item in enumerate(lab_request.lab_request_items.filter(Request = lab_request.Request_Id), start=1):
                    print("TestType :",item.TestType)
                    
                    
                    if item.TestType.lower() == "individual":
                        if lab_request.Billing_Status == "Completed":
                            sub_department_code = (
                                item.Test_Code.sub_department.SubDepartment_Code
                            )
                            sub_department_name = (
                                item.Test_Code.sub_department.SubDepartment_Name
                            )

                            if sub_department_code not in keys_seen:
                                filterdepartment.append(
                                    {
                                        "key": sub_department_code,
                                        "value": sub_department_name,
                                    }
                                )
                                keys_seen.add(sub_department_code)

                            Specimen_Name = (
                                item.Test_Code.Specimen_Name.Specimen_Name
                                if item.Test_Code.Specimen_Name
                                else None
                            )
                            Specimen_Code = (
                                item.Test_Code.Specimen_Name.Specimen_Code
                                if item.Test_Code.Specimen_Name
                                else None
                            )

                            if Specimen_Code not in Specimen_keys_seen:
                                filterSpecimen.append(
                                    {"key": Specimen_Code, "value": Specimen_Name}
                                )
                                Specimen_keys_seen.add(Specimen_Code)

                        print("type :", item.TestType)
                        print("item.Test_Code :", item.Test_Code.Test_Code)
                        test_cost = Testmaster_Cost_List.objects.filter(
                            Test_Code=item.Test_Code.Test_Code
                        ).first()
                    
                        print('Billing_Status :',lab_request.Billing_Status)
                        
                        if lab_request.Billing_Status == "Completed":
                            data = model_to_dict(item.Test_Code)
                            modified_data = (
                                {}
                            )  # Create a new dictionary to store the modified data
                            for key, value in data.items():
                                if key == "department" and item.Test_Code.department:
                                    modified_data[key] = (
                                        item.Test_Code.department.Department_Name
                                    )
                                    modified_data["Department_Code"] = (
                                        item.Test_Code.department.Department_Code
                                    )
                                elif (
                                    key == "sub_department"
                                    and item.Test_Code.sub_department
                                ):
                                    modified_data[key] = (
                                        item.Test_Code.sub_department.SubDepartment_Name
                                    )
                                    modified_data["SubDepartment_Code"] = (
                                        item.Test_Code.sub_department.SubDepartment_Code
                                    )
                                elif (
                                    key == "Container_Name"
                                    and item.Test_Code.Container_Name
                                ):
                                    modified_data[key] = (
                                        item.Test_Code.Container_Name.Container_Name
                                    )
                                elif (
                                    key == "Specimen_Name"
                                    and item.Test_Code.Specimen_Name is not None
                                ):
                                    modified_data[key] = (
                                        item.Test_Code.Specimen_Name.Specimen_Name
                                    )
                                elif key == "Method_Name" and item.Test_Code.Method_Name:
                                    modified_data[key] = (
                                        item.Test_Code.Method_Name.Method_Name
                                    )
                                elif key == "UOM" and item.Test_Code.UOM:
                                    modified_data[key] = item.Test_Code.UOM.Unit_Name
                                elif (
                                    key == "Captured_Unit_UOM"
                                    and item.Test_Code.Captured_Unit_UOM
                                ):
                                    modified_data[key] = (
                                        item.Test_Code.Captured_Unit_UOM.Unit_Name
                                    )
                                else:
                                    modified_data[key] = value  # Copy unchanged values
                                
                                RefernceRangeData = Age_Setup_Master.objects.filter(
                                    Test_Code=item.Test_Code.Test_Code
                                ).first()
                                
                                reference_range = RefernceRangeData.Reference_Range
                                NormalValue = RefernceRangeData.NormalValue
                                Panic_Low = RefernceRangeData.PanicLow
                                Panic_High = RefernceRangeData.PanicHigh

                                if NormalValue == "Yes":
                                    panic_low, panic_high = extract_panic_range(
                                        reference_range, patient.Gender
                                    )
                                    modified_data["paniclow"] = panic_low
                                    modified_data["panichigh"] = panic_high
                                else:
                                    modified_data["paniclow"] = Panic_Low
                                    modified_data["panichigh"] = Panic_High
                                modified_data["type"] = "individual"
                                
                                modified_data["Display_Service_Status"] = "Completed"
                                modified_data["Display_Analysis_Status"] = "Completed"
                                modified_data["Display_Verify_Status"] = "Verified"
                                modified_data["Display_Approve_Status"] = "Approved"
                                
                                modified_data["Service_Status"] = "Completed"
                                modified_data["Analysis_Status"] = item.Analysis_Status
                                modified_data["Verify_Status"] = item.Verify_Status
                                modified_data["Approve_Status"] = item.Approve_Status
                                
                                
                                
                                modified_data["referencedata"] = reference_range
                                modified_data["NormalValue"] = NormalValue 
                                modified_data["Result_Value"] = None 
                                modified_data["Remarks"] = None
                                modified_data["Result_Value"] = item.Result_Value
                                modified_data["TestType"] = "Individual"
                                modified_data["ColumName"] = "Test_Code"

                            # Append the modified dictionary to TestDetails
                            TestDetails.append(modified_data)

                        item_details.append(
                            {
                                "type": "individual",
                                "S_No": index,
                                "Test_Code": (
                                    item.Test_Code.Test_Code if item.Test_Code else None
                                ),
                                "SelectItemName": (
                                    item.Test_Code.Test_Name if item.Test_Code else None
                                ),
                                "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Quantity":1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            }
                        )
                    elif item.TestType.lower() == "group":
                        if lab_request.Billing_Status == "Completed":
                            if (
                                item.Group_Code.Department.SubDepartment_Code
                                not in filterdepartment
                            ):
                                filterdepartment.append(
                                    {
                                        "key": item.Group_Code.Department.SubDepartment_Code,
                                        "value": item.Group_Code.Department.SubDepartment_Name,
                                    }
                                )

                        # Get group test cost
                        test_cost = Testmaster_Cost_List.objects.filter(
                            Group_Code=item.Group_Code
                        ).first()

                        # Fetch sub-items for the group
                        group_items = []
                        sub_item_instances = Group_Master_TestList.objects.filter(
                            Group_Code=item.Group_Code
                        )
                        for sub_item in sub_item_instances:
                            if sub_item.Test_Code:

                                Specimen_Name = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Name
                                    if sub_item.Test_Code.Specimen_Name
                                    else None
                                )
                                Specimen_Code = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Code
                                    if sub_item.Test_Code.Specimen_Name
                                    else None
                                )

                                if Specimen_Code not in Specimen_keys_seen:
                                    filterSpecimen.append(
                                        {"key": Specimen_Code, "value": Specimen_Name}
                                    )
                                    Specimen_keys_seen.add(Specimen_Code)

                                sub_item_data = model_to_dict(sub_item.Test_Code)
                                # Add any additional details or transformations if needed
                                # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                sub_item_data["SubDepartment_Name"] = (
                                    sub_item.Test_Code.sub_department.SubDepartment_Name
                                    if sub_item.Test_Code.sub_department
                                    else None
                                )
                                sub_item_data["Container_Name"] = (
                                    sub_item.Test_Code.Container_Name.Container_Name
                                    if sub_item.Test_Code.Container_Name
                                    else None
                                )
                                sub_item_data["Specimen_Name"] = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Name
                                    if sub_item.Test_Code.Specimen_Name
                                    else None
                                )
                                sub_item_data["Method_Name"] = (
                                    sub_item.Test_Code.Method_Name.Method_Name
                                    if sub_item.Test_Code.Method_Name
                                    else None
                                )
                                sub_item_data["UOM"] = (
                                    sub_item.Test_Code.UOM.Unit_Name
                                    if sub_item.Test_Code.UOM
                                    else None
                                )
                                sub_item_data["Captured_Unit_UOM"] = (
                                    sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                    if sub_item.Test_Code.Captured_Unit_UOM
                                    else None
                                )

                                sub_item_data["Result_Value"] = None

                                sub_item_data["columnname"] = "Group_Code"

                                group_items.append(sub_item_data)

                        # Add group-level item details
                        item_details.append(
                            {
                                "type": "group",
                                "S_No": index,
                                "Group_Code": (
                                    item.Group_Code.Group_Code if item.Group_Code else None
                                ),
                                "SelectItemName": (
                                    item.Group_Code.Group_Name if item.Group_Code else None
                                ),
                                "Gender": "All",
                                "Department": (
                                    item.Group_Code.Department.SubDepartment_Name
                                    if item.Group_Code.Department
                                    else None
                                ),
                                "group_items": group_items,  # Include detailed sub-items here
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "Quantity":1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            }
                        )

                        TestDetails.append(
                            {
                                "type": "group",
                                "S_No": index,
                                "Group_Code": (
                                    item.Group_Code.Group_Code if item.Group_Code else None
                                ),
                                "SelectItemName": (
                                    item.Group_Code.Group_Name if item.Group_Code else None
                                ),
                                "Gender": "All",
                                "SubDepartment_Code": (
                                    item.Group_Code.Department.SubDepartment_Code
                                    if item.Group_Code.Department
                                    else None
                                ),
                                "Department": (
                                    item.Group_Code.Department.SubDepartment_Name
                                    if item.Group_Code.Department
                                    else None
                                ),
                                "group_items": group_items,  # Include detailed sub-items here
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "Quantity":1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                                "Service_Status": "Completed",
                                "Analysis_Status": item.Analysis_Status,
                                "Verify_Status": item.Verify_Status,
                                "Approve_Status": item.Approve_Status,
                            "TestType" : "Group",
                            "ColumName": "Group_Code",
                            "Result_Value": None
                            }
                        )
                    elif item.TestType.lower() == "offers":
                        
                        sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
                        if lab_request.Billing_Status == "Completed":
                            
                            if (
                                item.Package_code.department_name
                                not in filterdepartment
                            ):
                                filterdepartment.append(
                                    {
                                        "key": sub_dpt.pk,
                                        "value": item.Package_Code.department_name,
                                    }
                                )

                        # Get group test cost
                        test_cost = Testmaster_Cost_List.objects.filter(
                            Package_Code=item.Package_Code
                        ).first()

                        # Fetch sub-items for the group
                        group_items = []
                        sub_item_instances = OfferPackageList.objects.filter(
                            package_code=item.Package_Code.package_code
                        )
                        print("-------Offer-------",sub_item_instances)
                        for sub_item in sub_item_instances:
                            print("-------Item-------",sub_item.Test_Code)
                            
                            if sub_item.Test_Code:
                                print("------Test------",sub_item.Test_Code.Test_Name)
                                Specimen_Name = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                )
                                Specimen_Code = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                )

                                if Specimen_Code not in Specimen_keys_seen:
                                    filterSpecimen.append(
                                        {"key": Specimen_Code, "value": Specimen_Name}
                                    )
                                    Specimen_keys_seen.add(Specimen_Code)

                                sub_item_data = model_to_dict(sub_item.Test_Code)
                                # Add any additional details or transformations if needed
                                # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                sub_item_data["SubDepartment_Name"] = (
                                    sub_item.Test_Code.sub_department.SubDepartment_Name
                                    if sub_item.Test_Code.sub_department
                                    else None
                                )
                                sub_item_data["Container_Name"] = (
                                    sub_item.Test_Code.Container_Name.Container_Name
                                    if sub_item.Test_Code.Container_Name
                                    else None
                                )
                                sub_item_data["Specimen_Name"] = (
                                    sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                    if sub_item.Test_Code.Specimen_Name 
                                    else None
                                )
                                sub_item_data["Method_Name"] = (
                                    sub_item.Test_Code.Method_Name.Method_Name
                                    if sub_item.Test_Code.Method_Name
                                    else None
                                )
                                sub_item_data["UOM"] = (
                                    sub_item.Test_Code.UOM.Unit_Name
                                    if sub_item.Test_Code.UOM
                                    else None
                                )
                                sub_item_data["Captured_Unit_UOM"] = (
                                    sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                    if sub_item.Test_Code.Captured_Unit_UOM
                                    else None
                                )

                                sub_item_data["Result_Value"] = None

                                sub_item_data["columnname"] = "Group_Code"
                                sub_item_data["Group_Code"] = ""
                                sub_item_data["Group_Name"] = ""

                                print("-------Items-------",sub_item_data['Test_Name'])
                                if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                    group_items.append(sub_item_data)
                            
                            elif sub_item.Group_Code:
                                print("------group------",sub_item.Group_Code.Group_Code)
                                group = sub_item.Group_Code.Group_Code
                                groupName = sub_item.Group_Code.Group_Name
                                sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
                                print("-------Item-------",sub_item_instances)
                                for sub_item in sub_item_instances:
                                    print("------Test------",sub_item.Test_Code.Test_Name)
                                    Specimen_Name = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                    )
                                    Specimen_Code = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                    )

                                    if Specimen_Code not in Specimen_keys_seen:
                                        filterSpecimen.append(
                                            {"key": Specimen_Code, "value": Specimen_Name}
                                        )
                                        Specimen_keys_seen.add(Specimen_Code)

                                    sub_item_data = model_to_dict(sub_item.Test_Code)
                                    # Add any additional details or transformations if needed
                                    # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                    sub_item_data["SubDepartment_Name"] = (
                                        sub_item.Test_Code.sub_department.SubDepartment_Name
                                        if sub_item.Test_Code.sub_department
                                        else None
                                    )
                                    sub_item_data["Container_Name"] = (
                                        sub_item.Test_Code.Container_Name.Container_Name
                                        if sub_item.Test_Code.Container_Name
                                        else None
                                    )
                                    sub_item_data["Specimen_Name"] = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                        if sub_item.Test_Code.Specimen_Name 
                                        else None
                                    )
                                    sub_item_data["Method_Name"] = (
                                        sub_item.Test_Code.Method_Name.Method_Name
                                        if sub_item.Test_Code.Method_Name
                                        else None
                                    )
                                    sub_item_data["UOM"] = (
                                        sub_item.Test_Code.UOM.Unit_Name
                                        if sub_item.Test_Code.UOM
                                        else None
                                    )
                                    sub_item_data["Captured_Unit_UOM"] = (
                                        sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        if sub_item.Test_Code.Captured_Unit_UOM
                                        else None
                                    )

                                    sub_item_data["Result_Value"] = None

                                    sub_item_data["columnname"] = "Group_Code"
                                    sub_item_data["Group_Code"] = group
                                    sub_item_data["Group_Name"] = groupName
                                    

                                    print("-------Items-------",sub_item_data['Test_Name'])
                                    if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                        group_items.append(sub_item_data)
                            
                        # Add group-level item details
                        item_details.append(
                            {
                                "type": "Offers",
                                "S_No": index,
                                "Request_Id": lab_request.Request_Id,
                                "Group_Code": (
                                    item.Package_Code.package_code if item.Package_Code else None
                                ),
                                "SelectItemName": (
                                    item.Package_Code.package_name if item.Package_Code else None
                                ),
                                "Gender": "All",
                                "Department": (
                                    item.Package_Code.department_name
                                    if item.Package_Code.department_name
                                    else None
                                ),
                                "group_items": group_items,  # Include detailed sub-items here
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "Quantity":1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            }
                        )
                        print("---------OK--------")
                        TestDetails.append(
                            {
                                "type": "Offers",
                                "S_No": index,
                                "Group_Code": (
                                    item.Package_Code.package_code if item.Package_Code else None
                                ),
                                "SelectItemName": (
                                    item.Package_Code.package_name if item.Package_Code else None
                                ),
                                "Gender": "All",
                                "SubDepartment_Code": (
                                    sub_dpt.SubDepartment_Code
                                    if item.Package_Code.department_name
                                    else None
                                ),
                                "Department": (
                                    item.Package_Code.department_name
                                    if item.Package_Code.department_name
                                    else None
                                ),
                                "group_items": group_items,  # Include detailed sub-items here
                                "ServiceType": "Lab",
                                "Charges": test_cost.Basic if test_cost else None,
                                "Amount": test_cost.Basic if test_cost else None,
                                "NetAmount": test_cost.Basic if test_cost else None,
                                "Total": test_cost.Basic if test_cost else None,
                                "Quantity":1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                                "Service_Status": "Completed",
                                "Analysis_Status": item.Analysis_Status,
                                "Verify_Status": item.Verify_Status,
                                "Approve_Status": item.Approve_Status,
                            "TestType" : "Offers",
                            "ColumName": "Package_Code",
                            "Result_Value": None
                            }
                        )
                
                print("-----ITEMS-----",item_details)
                BarcodeId = get_invoice_master_barcode()
                count = len(item_details)
                VisitId = PatientVisitId.objects.filter(Patient_Id=ip_register_instance.PatientId.PatientId).order_by('-Visit_Id').first()
                if VisitId:
                    VisitId = VisitId.Visit_Id + 1
                else:
                    VisitId = 1
                invoiceTable = BillingInvoiceAndBillAmount.objects.create(
                    Billing_Invoice = BarcodeId,
                    Request_Id = lab_request.pk,
                    Patient_Id = ip_register_instance.PatientId.PatientId,
                    Visit_Id = VisitId,
                    Patient_Name = ip_register_instance.PatientId.FirstName,
                    Item_Count = count,
                    Total_Charge = "0.00",
                    Status = 'Pending',
                    Location = Location_instance.Location_Name,
                    Capture_Sample_Status = "Pending",
                    Analyze_Status = "Pending",
                    Verify_Status = "Pending",
                    Approve_Status = "Pending",
                    Barcode_Id = BarcodeId,
                    Group_Name = "",
                    CreatedBy = created_by,
                    Billing_Date = datetime.date(datetime.now()),
                    Billing_Type = "",
                    RateCard_Name = '',
                    Test_Code = "",
                    Group_Code = "",
                    TotalPaidAmount = '0.00',
                    BalanceAmount ="0.00",
                    Sample_Barcode_Image = None,
                    AdditionalAmount = '0.00',
                    AdditionalAmountReason = "",
                    DiscountReason = "",
                    HistoNumber = '',
                    MicroNumber = '',
                    Transfer_Location= "",
                    Registration_Id = ip_register_instance.Registration_Id
                )
                invoiceTable.save()
                print("--------Invoice Table OK--------")
                for item in item_details:
                    if item["type"] == "Offers":
                        
                        if item.get("group_items"):
                            for subtest in item.get("group_items", []):
                                if subtest["Group_Code"] and subtest["Group_Name"]:
                                        group=subtest["Group_Code"]
                                        groupName=subtest["Group_Name"]
                                else:
                                    group=""
                                    groupName=""

                                invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                Billing_Invoice = BarcodeId,
                                Patient_Id = ip_register_instance.PatientId.PatientId,
                                Visit_Id = VisitId,
                                Patient_Name = ip_register_instance.PatientId.FirstName,
                                Dispatch_Method = "",
                                Test_Method = item["type"],
                                Test_Name = subtest["Test_Name"],
                                Gross_Amount = item["Charges"],
                                Location = Location_instance.Location_Name,
                                Service_Status = "Pending",
                                Analysis_Status = "Pending",
                                Verify_Status = "Pending",
                                Approve_Status = "Pending",
                                Barcode_Id = BarcodeId,
                                Group_Name = groupName,
                                CreatedBy = created_by,
                                Billing_Date = datetime.date(datetime.now()),
                                Test_Code = subtest["Test_Code"],
                                Group_Code = group,
                                individual_add_amount = None,
                                IsSubTest = subtest.get("IsSubTest", ""),
                                SubTestCodes = subtest.get("SubTestCodes", ""),
                                Transfer_Location = "",
                                PackageCode = item.get("Group_Code", ""),
                                PackageName = item.get("SelectItemName", ""),
                                )
                                invoiceItemTable.save()
                        else:
                            print("--------Offer-Test---------", item)
                            invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                            Billing_Invoice = BarcodeId,
                            Patient_Id = ip_register_instance.PatientId.PatientId,
                            Visit_Id = VisitId,
                            Patient_Name = ip_register_instance.PatientId.FirstName,
                            Dispatch_Method = "",
                            Test_Method = item["type"],
                            Test_Name = item["SelectItemName"],
                            Gross_Amount = item["Charges"],
                            Location = Location_instance.Location_Name,
                            Service_Status = "Pending",
                            Analysis_Status = "Pending",
                            Verify_Status = "Pending",
                            Approve_Status = "Pending",
                            Barcode_Id = BarcodeId,
                            Group_Name = "",
                            CreatedBy = created_by,
                            Billing_Date = datetime.date(datetime.now()),
                            Test_Code = item["Test_Code"],
                            Group_Code = "",
                            individual_add_amount = None,
                            IsSubTest = "",
                            SubTestCodes = "",
                            Transfer_Location = "",
                            PackageCode = "",
                            PackageName = "",
                            )
                            invoiceItemTable.save()                    
                    elif item["type"] == "group":
                        for subtest in item.get("group_items", []):
                            invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                Billing_Invoice = BarcodeId,
                                Patient_Id = ip_register_instance.PatientId.PatientId,
                                Visit_Id = VisitId,
                                Patient_Name = ip_register_instance.PatientId.FirstName,
                                Dispatch_Method = "",
                                Test_Method = item["type"],
                                Test_Name = subtest["Test_Name"],
                                Gross_Amount = item["Charges"],
                                Location = Location_instance.Location_Name,
                                Service_Status = "Pending",
                                Analysis_Status = "Pending",
                                Verify_Status = "Pending",
                                Approve_Status = "Pending",
                                Barcode_Id = BarcodeId,
                                Group_Name = item.get("SelectItemName", ""),
                                CreatedBy = created_by,
                                Billing_Date = datetime.date(datetime.now()),
                                Test_Code = subtest["Test_Code"],
                                Group_Code = item.get("Group_Code", ""),
                                individual_add_amount = None,
                                IsSubTest = subtest.get("IsSubTest", ""),
                                SubTestCodes = subtest.get("SubTestCodes", ""),
                                Transfer_Location = "",
                                PackageCode = "",
                                PackageName = "",
                            )
                            invoiceItemTable.save()
                    else:
                        print("---------Test---------", item)
                        invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                            Billing_Invoice = BarcodeId,
                            Patient_Id = ip_register_instance.PatientId.PatientId,
                            Visit_Id = VisitId,
                            Patient_Name = ip_register_instance.PatientId.FirstName,
                            Dispatch_Method = "",
                            Test_Method = item["type"],
                            Test_Name = item["SelectItemName"],
                            Gross_Amount = item["Charges"],
                            Location = Location_instance.Location_Name,
                            Service_Status = "Pending",
                            Analysis_Status = "Pending",
                            Verify_Status = "Pending",
                            Approve_Status = "Pending",
                            Barcode_Id = BarcodeId,
                            Group_Name = "",
                            CreatedBy = created_by,
                            Billing_Date = datetime.date(datetime.now()),
                            Test_Code = item["Test_Code"],
                            Group_Code = "",
                            individual_add_amount = None,
                            IsSubTest = "",
                            SubTestCodes = "",
                            Transfer_Location = "",
                            PackageCode = "",
                            PackageName = "",
                        )
                        invoiceItemTable.save()
                
                print("--------Invoice Item Table OK--------")
                try:      
                        exists= Register_patient_Details.objects.filter(Patient_Id = ip_register_instance.PatientId.PatientId).exists()
                        patient_id = ip_register_instance.PatientId.PatientId
                        patient = Patient_Detials.objects.get(PatientId = ip_register_instance.PatientId.PatientId)

                        if not exists:        
                            PatientData = Register_patient_Details(
                                Patient_Id = patient_id if patient_id else None,
                                Title = patient.Title.Title_Name,
                                Patient_Name =  patient.FirstName,
                                Father_Name = patient.FatherName,
                                DOB = patient.DOB,
                                Age = patient.Age,
                                Gender = patient.Gender,
                                Marital_Status = "",
                                Door_No = patient.DoorNo,
                                Street = patient.Street,
                                Rural_Urban ="",
                                City = patient.City,
                                State = patient.State,
                                Pincode = patient.Pincode,
                                Phone = patient.PhoneNo,
                                Alternate_No = "",
                                Email = patient.Email,
                                Location = Location_instance.Location_Name,
                                Patient_Barcode = patient_id if patient_id else None,
                                Time_Period = 'year',
                                CreatedBy =created_by,    
                            )
                            PatientData.save()
                            print("--------Patient Data OK--------")
                        # Create and save the Patient Visit Table entry
                        docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()
                        spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=DoctorId).first()
                        if docs:
                            doctor_name = f"""{docs.First_Name}/{spc.Specialization.Speciality_Name if spc and spc.Specialization else "General"}"""
                        else:
                            doctor_name = 'Self'
                        print("doc-------",doctor_name)
                        
                        visitTable = PatientVisitId.objects.create(
                                Visit_Id = VisitId,
                                Patient_Name = patient.FirstName,
                                Patient_Id = patient_id,
                                Phone = patient.PhoneNo,
                                Visit_Type = "IP",
                                Phlebotomist_Type = "",
                                Phlebotomist_Name = "",
                                Refering_Doctor = doctor_name,
                                Patient_Group = ip_register_instance.PatientCategory,
                                Dispatch_Method = "",
                                Patient_Barcode =  patient_id,
                                CreatedBy = created_by,
                                Location = Location_instance.Location_Name,
                                Outsourced_Type = "",
                                Refering_Hospital = "",
                            )
                        visitTable.save()
                        print("--------Patient Visit Table OK--------")
                except Exception as e:
                        print(str(e))
            
    
            
            return JsonResponse({'success': 'Data saved successfully'}, status=200)
 
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)
    elif request.method == 'GET':
        try:
            # Extract query parameters
            registration_id = request.GET.get('Register_Id', None)
            register_type = request.GET.get('RegisterType', None)
 
            if not registration_id:
                return JsonResponse({'warn': 'Missing registration ID'})
            if register_type not in ["OP", "IP", "Casuality"]:
                return JsonResponse({'warn': 'Missing or invalid Register Type'})
 
            # Fetch the registration details, including related patient and doctor details
            if register_type == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
            elif register_type == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
            elif register_type == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
 
            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.Title.Title_Name}{'.'}{registration_details.PatientId.FirstName or ''} {registration_details.PatientId.MiddleName or ''} {registration_details.PatientId.SurName or ''}"
            phone_number = registration_details.PatientId.PhoneNo
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            doctor_name = f"Dr. {registration_details.PrimaryDoctor.First_Name or ''} {registration_details.PrimaryDoctor.Middle_Name or ''} {registration_details.PrimaryDoctor.Last_Name or ''}" if registration_details.PrimaryDoctor else None
            doctor_shortname = f"Dr. {registration_details.PrimaryDoctor.ShortName}" if registration_details.PrimaryDoctor else None
 
            # Filter Lab_Request_Details by registration_id
            lab_requests = Lab_Request_Details.objects.filter(
                **{
                    f"{register_type}_Register_Id": registration_id
                }
            )
 
            response_data = []
            index = 1
 
            for request_item in lab_requests:
                if request_item.TestType == 'Individual':
                    if request_item.IndivitualCode:
                        response_data.append({
                            'id': index,
                            'PatientId': patient_id,
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'RegisterType': request_item.RegisterType,
                            'TestType': request_item.TestType,
                            'TestCode': request_item.IndivitualCode.TestCode,
                            'TestName': request_item.IndivitualCode.Test_Name
                        })
                        index += 1
 
                elif request_item.TestType == 'Favourites':
                    favourite = request_item.FavouriteCode  
                    if favourite:
                        response_data.append({
                            'id': index,
                            'PatientId': patient_id,
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'RegisterType': request_item.RegisterType,
                            'TestType': request_item.TestType,
                            'TestCode': favourite.Favourite_Code,
                            'TestName': favourite.FavouriteName
                        })
                        index += 1
 
                # Handling the Package TestType
                elif request_item.TestType == 'Package':
                    package = request_item.PackageCode  # Assuming PackageCode is linked
                    if package:
                        response_data.append({
                            'id': index,
                            'PatientId': patient_id,
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'RegisterType': request_item.RegisterType,
                            'TestType': request_item.TestType,
                            'TestCode': package.Package_Code,  # Directly access Package_Code
                            'TestName': package.PackageName   # Directly access PackageName
                        })
                        index += 1
 
                   
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            print("e",e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lab_SelectedTest_Detailslink(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)
            
            individual_arr = data.get('IndividualArr', [])
            if individual_arr:
                for ind in individual_arr:
                    testcode = ind.get('testCode')
                    testType = ind.get('testType')
                    amount = ind.get('amount')
                    labrequestpk = ind.get('pk')

                    if not labrequestpk:
                        return JsonResponse({'warn': 'LabRequest ID not found'})

                    # Define the query filter based on test type
                    filter_kwargs = {'pk': labrequestpk}

                    if testType == 'Individual':
                        filter_kwargs['IndivitualCode'] = testcode
                    elif testType == 'Favourites':
                        filter_kwargs['FavouriteCode'] = testcode
                    elif testType == 'Package':
                        filter_kwargs['PackageCode'] = testcode
                    else:
                        continue  # Skip if testType is invalid

                    # Update the record
                    updated_rows = Lab_Request_Details.objects.filter(**filter_kwargs).update(
                        Amount=amount,
                        Status='Pending'
                    )

                    if updated_rows == 0:
                        return JsonResponse({'error': f'No matching record found for testCode {testcode}'})

                return JsonResponse({'success': 'Test Names Submitted Successfully'})

            return JsonResponse({'warn': 'No individual tests provided'}, status=400)

        except Exception as e:
            print("Exception occurred:", e)
            return JsonResponse({'error': 'An internal server error occurred', 'details': str(e)}, status=500)

 
 

@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Queuelist_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        Employeeid = request.GET.get('Employeeid', '')
        User = request.GET.get('User')

        Dept = request.GET.getlist('Dept[]')
        if not Dept:
            return JsonResponse({'error': 'Department is required'}, status=400)
        Dept = list(map(int, Dept))

        dateOption = request.GET.get('dateOption')
        fromDate = request.GET.get('fromDate')
        toDate = request.GET.get('toDate')
        ParticularDate = request.GET.get('ParticularDate')
        CurrentDate = request.GET.get('CurrentDate')

        # Date filter
        if dateOption == 'current':
            date_filter = Q(created_at__date=datetime.strptime(CurrentDate, '%Y-%m-%d').date())
        elif dateOption == 'particular':
            date_filter = Q(created_at__date=datetime.strptime(ParticularDate, '%Y-%m-%d').date())
        else:
            from_date = datetime.strptime(fromDate, '%Y-%m-%d').date()
            to_date = datetime.strptime(toDate, '%Y-%m-%d').date()
            date_filter = Q(created_at__date__range=(from_date, to_date))

        queryset = Radiology_Request_Details.objects.filter(date_filter)

        if User not in ['admin', 'host']:
            empins = Employee_Personal_Form_Detials.objects.filter(pk=Employeeid).first()
            if not empins:
                return JsonResponse({'error': 'Invalid Employee ID'}, status=400)

            depins = Department_Detials.objects.filter(Department_Id__in=Dept)
            dept_names = list(depins.values_list('Department_Name', flat=True))

            raddep = RadiologyNames_Details.objects.filter(Radiology_Name__in=dept_names)
            rad_ids = list(raddep.values_list('Radiology_Id', flat=True))

            queryset = queryset.filter(TestCode__in=rad_ids)

            if status == 'Request':
                queryset = queryset.filter(Status='Request', Service_Status='Pending')
            elif status == 'Paid':
                queryset = queryset.filter(Status='Paid', Service_Status='Pending')
            elif status == 'Due':
                queryset = queryset.filter(Status='Due', Service_Status='Pending')
            elif status == 'Analyzed':
                queryset = queryset.filter(Status__in=['Paid', 'Due'], Service_Status='Analyzed')
            elif status == 'Completed':
                queryset = queryset.filter(Status__in=['Paid', 'Due'], Service_Status='Completed')

        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query)
            )

        response_data = []
        seen_registration_ids = set()
        index = 1

        for radiology_request in queryset:

            registration_id = None
            registration_details = None

            if radiology_request.RegisterType in ['OP', 'WALK-IN'] and radiology_request.OP_Register_Id:
                registration_id = radiology_request.OP_Register_Id.Registration_Id
                registration_details = radiology_request.OP_Register_Id

            elif radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
                registration_id = radiology_request.IP_Register_Id.Registration_Id
                registration_details = radiology_request.IP_Register_Id

            elif radiology_request.RegisterType == 'Casuality' and radiology_request.Casuality_Register_Id:
                registration_id = radiology_request.Casuality_Register_Id.Registration_Id
                registration_details = radiology_request.Casuality_Register_Id

            elif radiology_request.RegisterType == "ExternalRadiology" and radiology_request.Diagnosis_Register_Id:
                registration_id = radiology_request.Diagnosis_Register_Id.pk
                registration_details = radiology_request.Diagnosis_Register_Id

            if not registration_id or registration_id in seen_registration_ids:
                continue

            seen_registration_ids.add(registration_id)

            patient = registration_details.PatientId if registration_details else None
            doctor = radiology_request.Doctorid if radiology_request.RegisterType in ['OP', 'WALK-IN'] else registration_details.PrimaryDoctor

            response_data.append({
                'id': index,
                'PatientId': patient.PatientId if patient else None,
                'VisitId': registration_details.VisitId if radiology_request.RegisterType in ['OP', 'WALK-IN'] else None,
                'RegistrationId': registration_id,
                'PatientName': f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None,
                'PhoneNumber': patient.PhoneNo if patient else None,
                'DoctorId': doctor.Doctor_ID if doctor else None,
                'DoctorShortName': doctor.ShortName if doctor else None,
                'RegisterType': radiology_request.RegisterType,
                'Status': radiology_request.Status,
                'service_Status': radiology_request.Service_Status,
            })

            index += 1

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print("Exception:", str(e))
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Queuelist_link_for_All(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        Employeeid = request.GET.get('Employeeid','')
 
        dateOption = request.GET.get('dateOption')
        fromDate = request.GET.get('fromDate')
        toDate = request.GET.get('toDate')
        ParticularDate = request.GET.get('ParticularDate')
        CurrentDate = request.GET.get('CurrentDate')
 
 
 
        if dateOption == 'current':
            date_filter = Q(created_at__date=CurrentDate)
        elif dateOption == 'particular':
            date_filter = Q(created_at__date=ParticularDate)
        else:
            try:
                from_date = datetime.strptime(fromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(toDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
       
 
        queryset = Radiology_Request_Details.objects.filter(date_filter).order_by('-created_at')
 
       
        if status == 'Request':
            queryset = queryset.filter(Status='Request',Service_Status='Pending')
 
        elif status == 'Paid':
            queryset = queryset.filter(Status='Paid',Service_Status='Pending')
       
        elif status == 'Due':
            queryset = queryset.filter(Status='Due',Service_Status='Pending')
 
        elif status == 'Analyzed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Analyzed')
 
        elif status == 'Completed':
            queryset = queryset.filter(Status__in= ['Paid','Due'],Service_Status='Completed')
 
 
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__SurName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__PhoneNo__icontains=query)
            )
 
 
 
        response_data = []
        seen_registration_ids = set()  # Set to track unique registration IDs
        index = 1  # Initialize index
 
        for radiology_request in queryset:
            registration_id = None
            registration_details = None
            docins = None
 
            # Determine which registration ID and details to use based on RegisterType
            if radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'WALK-IN'  and radiology_request.OP_Register_Id:
                registration_id = radiology_request.OP_Register_Id.Registration_Id
                registration_details = radiology_request.OP_Register_Id
                # docins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = radiology_request.OP_Register_Id.pk).first()
            elif radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
                registration_id = radiology_request.IP_Register_Id.Registration_Id
                registration_details = radiology_request.IP_Register_Id
            elif radiology_request.RegisterType == 'Casuality' and radiology_request.Casuality_Register_Id:
                registration_id = radiology_request.Casuality_Register_Id.Registration_Id
                registration_details = radiology_request.Casuality_Register_Id
            elif radiology_request.RegisterType == "ExternalRadiology" and radiology_request.Diagnosis_Register_Id:
                registration_id = radiology_request.Diagnosis_Register_Id.pk  # Added to ensure registration_id is set
                registration_details = radiology_request.Diagnosis_Register_Id
           
 
            # Skip if the registration_id is not set or if already processed
            if not registration_id or registration_id in seen_registration_ids:
                continue
 
            # Add registration ID to the set to avoid duplicates
            seen_registration_ids.add(registration_id)
 
            # Extract patient and doctor details, handling None gracefully
 
            patient = None
            doctor = None
 
            if radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'WALK-IN':
 
                patient = registration_details.PatientId
                doctor = radiology_request.Doctorid if  radiology_request.Doctorid else None
 
            else:
 
                patient = registration_details.PatientId
                doctor = registration_details.PrimaryDoctor if registration_details.PrimaryDoctor else None
 
 
            patient_id = patient.PatientId if patient else None
            patient_age = patient.Age if patient else None
            patient_gender = patient.Gender if patient else None
            patient_name = f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None
            phone_number = patient.PhoneNo if patient else None
            doctor_id = doctor.Doctor_ID if doctor else None
            doctor_shortname = doctor.ShortName if doctor else 'Self'
            doctor_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name}{doctor.Middle_Name}{doctor.Last_Name}" if doctor else 'Self'
 
            if radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'WALK-IN':
 
                visitId = registration_details.VisitId
            else :
                visitId = None
 
            # Add the collected data to the response
            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': visitId,
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'doctor_name': doctor_name,
                'RegisterType': radiology_request.RegisterType,
                'age': patient_age,
                'gender': patient_gender,
                'Status': radiology_request.Status
            })
 
            # Increment index
            index += 1
 
        # Return the collected data as a JSON response
        return JsonResponse(response_data, safe=False)
 
    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
   
 
 
 

# lab completedqueue 
@csrf_exempt
@require_http_methods(["GET"])
def Lab_completed_quelist(request):
    try:
        # Get the 'status' parameter from the request
        status = request.GET.get('status', 'Pending')
        query = request.GET.get('query', '')

        # Filter queryset to include records with RegisterType 'OP' or 'IP'
        queryset = Lab_Request_Selected_Details.objects.filter(
            Q(RegisterType='OP') | Q(RegisterType='IP')
        )

        # Apply additional status filtering if provided
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        response_data = []
        seen_registration_ids = set()
        index = 1

        for lab_complete in queryset:
            # Determine registration ID based on RegisterType
            if lab_complete.RegisterType == 'OP':
                registration_id = lab_complete.OP_Register_Id.pk
                registration_details = lab_complete.OP_Register_Id
            else:
                registration_id = lab_complete.IP_Register_Id.Registration_Id
                registration_details = lab_complete.IP_Register_Id

            # Avoid duplicate entries based on registration ID
            if registration_id in seen_registration_ids:
                continue
            seen_registration_ids.add(registration_id)

            patient = registration_details.PatientId
            patient_name = f"{patient.Title}. {patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
            phone_number = patient.PhoneNo
            doctor = registration_details.PrimaryDoctor
            doctor_shortname = doctor.ShortName if doctor else None
            doctor_id = doctor.Doctor_ID if doctor else None
            specialization_name = registration_details.Specialization.Speciality_Name if registration_details.Specialization else ''
            
            response_data.append({
                'id': index,
                'PatientId': patient.PatientId,
                'VisitId': registration_details.VisitId,
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'Specialization': str(specialization_name),
                # 'CategoryType': lab_complete.CategoryType,
                'Status': lab_complete.Status,
                'RegisterType': lab_complete.RegisterType
            })
            index += 1

        return JsonResponse(response_data, safe=False)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def Lab_Complete_TestDetails(request):
    try:
        # Retrieve parameters from the request
        registration_id = request.GET.get("Register_Id")
        patient_id = request.GET.get("Patient_Id")
        register_type = request.GET.get("RegisterType")
        status = request.GET.get("Status", "Request")

        # Validate required parameters
        if not all([registration_id, patient_id, register_type]):
            return JsonResponse({"warn": "Missing registration ID, patient ID, or register type"})

        # Fetch patient details
        patient_details = Patient_Detials.objects.filter(PatientId=patient_id).first()
        if not patient_details:
            return JsonResponse({"warn": "Patient ID not found"})

        patient_name = f"{patient_details.Title.Title_Name}.{patient_details.FirstName or ''} {patient_details.MiddleName or ''} {patient_details.SurName or ''}"
        patient_age = patient_details.Age
        phone_number = patient_details.PhoneNo
        patient_gender = patient_details.Gender

        # Determine the correct registration model based on register type
        register_type_mapping = {
            "OP": ("OP_Register_Id", Patient_Appointment_Registration_Detials, "pk"),
            "IP": ("IP_Register_Id", Patient_IP_Registration_Detials, "Registration_Id"),
            "Casuality": ("Casuality_Register_Id", Patient_Casuality_Registration_Detials, "pk"),
            "Lab": ("OP_Register_Id", Patient_Appointment_Registration_Detials, "pk"),
        }

        if register_type not in register_type_mapping:
            return JsonResponse({"warn": "Invalid RegisterType"}, status=400)

        register_field, model, model_id = register_type_mapping[register_type]

        lab_requests = Lab_Request_Details.objects.filter(
            **{register_field: registration_id},
            RegisterType=register_type,
            Status="Paid",
        )

        registration_details = model.objects.filter(**{model_id: registration_id}).first()
        if not registration_details:
            return JsonResponse({"warn": "Registration details not found"}, status=404)

        doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
        doctor_name = (
            f"Dr. {registration_details.PrimaryDoctor.First_Name or ''} {registration_details.PrimaryDoctor.Middle_Name or ''} {registration_details.PrimaryDoctor.Last_Name or ''}"
            if registration_details.PrimaryDoctor else None
        )
        doctor_shortname = f"Dr. {registration_details.PrimaryDoctor.ShortName}" if registration_details.PrimaryDoctor else None

        response_data = []
        index = 1

        # Iterate over lab requests
        for lab_request in lab_requests:
            test_details = []

            if lab_request.TestType == "Individual":
                test_obj = LabTestName_Details.objects.filter(TestCode=lab_request.IndivitualCode_id).first()
                if test_obj:
                    test_details.append({
                        "TestCode": test_obj.TestCode,
                        "TestName": test_obj.Test_Name,
                    })

            elif lab_request.TestType == "Favourites":
                favourite_test_obj = TestName_Favourites.objects.filter(Favourite_Code=lab_request.FavouriteCode_id).first()
                if favourite_test_obj:
                    # Fetch all individual test names under the favourite test group
                    test_list = [
                        {
                            "TestCode": test.TestCode,
                            "TestName": test.Test_Name,
                        }
                        for test in favourite_test_obj.TestName.all()
                    ]
                    test_details.extend(test_list)

            elif lab_request.TestType == "Package" and lab_request.PackageCode:
                package = lab_request.PackageCode
                test_details.append({
                    "TestCode": package.Package_Code,
                    "TestName": package.PackageName,
                })

                # Fetch all tests inside the package
                package_tests = Package_TestName_Child.objects.filter(PackageName=package)
                for pkg_test in package_tests:
                    if pkg_test.TestNameInd:
                        test_details.append({
                            "TestCode": pkg_test.TestNameInd.TestCode,
                            "TestName": pkg_test.TestNameInd.Test_Name,
                        })
                    elif pkg_test.TestNameGroup:
                        for grouped_test in pkg_test.TestNameGroup.TestName.all():
                            test_details.append({
                                "TestCode": grouped_test.TestCode,
                                "TestName": grouped_test.Test_Name,
                            })

            # Append response data
            for test in test_details:
                response_data.append({
                    "id": index,
                    "pk": lab_request.pk,
                    "PatientId": patient_id,
                    "PatientName": patient_name,
                    "PhoneNumber": phone_number,
                    "PatientAge": patient_age,
                    "PatientGender": patient_gender,
                    "DoctorId": doctor_id,
                    "DoctorName": doctor_name,
                    "DoctorShortName": doctor_shortname,
                    "RegisterType": register_type,
                    "TestType": lab_request.TestType,
                    **test,
                })
                index += 1

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({"error": f"An internal server error occurred: {str(e)}"}, status=500)













@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lab_PaidDetails_link(request):
    @transaction.atomic
    def validate_and_process_file(file):
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            compressed_data = None
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            output.seek(0)
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            compressed_data = output.getvalue()
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        if file:
            file_data = file.split(',')[1] if ',' in file else file
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)

            if file_type in ['image/jpeg', 'image/png']:
                try:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, compressed_size = compress_image(image)
                    return compressed_image_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing image: {str(e)}'})

            elif file_type == 'application/pdf':
                try:
                    compressed_pdf_data, compressed_size = compress_pdf(BytesIO(file_content))
                    return compressed_pdf_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing PDF: {str(e)}'})

            else:
                return JsonResponse({'warn': 'Unsupported file format'})

        return None
    
    
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'warn': 'Request body is empty'}, status=400)

            data = request.POST
            RegistrationId = data.get('RegistrationId')
            RelativeName = data.get('RelativeName', '')
            ReportDate = data.get('ReportDate', '')
            ReportHandovered = data.get('ReportHandoOvered', '')
            ReportTime = data.get('ReportTime', '')
            TechnicianName = data.get('TechnicianName', '')
            created_by = data.get('created_by', '')
            ChooseFileOne = data.get('ChooseFile')  # Handle uploaded file
            RegisterType = data.get('RegisterType')
            
            checkarr = data.get('checkarr', '[]')
            check_arr_list = json.loads(checkarr)

            # processed_file = validate_and_process_file(ChooseFileOne.read().decode('utf-8')) if ChooseFileOne else None

            processed_file = validate_and_process_file(ChooseFileOne) if ChooseFileOne  else None
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing Registration Id'}, status=400)

            # Determine patient registration based on type
            registration_instance = None
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "Lab":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()

            if not registration_instance:
                return JsonResponse({'warn': 'Invalid registration ID or RegisterType'})

            # Create Lab Report Entry
            lab_ins = Lab_ReportEntry_Details.objects.create(
                RegisterType=RegisterType,
                OP_Register_Id=registration_instance if RegisterType in ["OP", "Lab"] else None,
                IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                report_date=ReportDate,
                report_time=ReportTime,
                report_file=processed_file,
                technician_name=TechnicianName,
                report_handovered_by=ReportHandovered,
                report_handovered_to=RelativeName,
                created_by=created_by
            )

            # Save Individual Test Results
            paid_test_instances = []
            for item in check_arr_list:
                test_code_instance = LabTestName_Details.objects.filter(TestCode=item.get('TestCode')).first()
                if test_code_instance:
                    paid_test_instances.append(
                        PaidTest_Indivitaul(
                            Registration_Id=lab_ins,
                            testCode=test_code_instance,  
                            value=item.get('Values', ''),
                            description=item.get('Description', ''),
                            status='Completed' if item.get('Values', '') else 'Pending'
                        )
                    )
            if paid_test_instances:
                PaidTest_Indivitaul.objects.bulk_create(paid_test_instances)

            Lab_Request_Details.objects.filter(
                OP_Register_Id=registration_instance if RegisterType in ["OP", "Lab"] else None,
                IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                RegisterType=RegisterType,
                Status="Paid"
            ).update(Status="Completed")

            return JsonResponse({'success': 'Data saved successfully'}, status=200)

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    return JsonResponse({'warn': 'Invalid request method'}, status=405)





@csrf_exempt
@require_http_methods(["GET"])
def lab_report_details_view(request):
    if request.method == 'GET':
        try:
            registration_id = request.GET.get('Register_Id')
            RegisterType = request.GET.get('RegisterType')

            # Check for missing parameters
            if not registration_id:
                return JsonResponse({'warn': 'Missing registration Id'}, status=400)
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'}, status=400)

            # Determine the lab report based on RegisterType
            lab_report = None
            if RegisterType == "OP":
                lab_report = Lab_ReportEntry_Details.objects.filter(OP_Register_Id_id=registration_id, RegisterType=RegisterType).last()
            elif RegisterType == "IP":
                lab_report = Lab_ReportEntry_Details.objects.filter(IP_Register_Id_id=registration_id, RegisterType=RegisterType).last()
            elif RegisterType == "Casuality":
                lab_report = Lab_ReportEntry_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType).last()

            # If no lab report is found
            if not lab_report:
                return JsonResponse({'warn': 'Lab report not found for the given Registration ID'}, status=404)

            # Helper function to convert file data to base64
            

            def get_file_image(filedata):
                try:
                    kind = filetype.guess(filedata)
                    
                    # Supported MIME types
                    supported_mime_types = [
                        'application/pdf',
                        'image/jpeg',
                        'image/png'
                    ]
                    
                    if kind and kind.mime in supported_mime_types:
                        contenttype = kind.mime
                    else:
                        contenttype = 'application/octet-stream'  # Default for unknown types
                    
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype};base64,{base64.b64encode(filedata).decode("utf-8")}'
                
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None


            # Construct response data
            response_data = {
                'lab_report_entry': {
                    'report_id': lab_report.report_id,
                    'registrationid': lab_report.OP_Register_Id_id if RegisterType == "OP" else 
                                      lab_report.IP_Register_Id_id if RegisterType == "IP" else
                                      lab_report.Casuality_Register_Id_id,
                    'report_date': lab_report.report_date,
                    'report_time': lab_report.report_time,
                    'reportfile': get_file_image(lab_report.report_file) if lab_report.report_file else None,
                    'technician_name': lab_report.technician_name,
                    'report_handovered_by': lab_report.report_handovered_by,
                    'report_handovered_to': lab_report.report_handovered_to,
                    'created_by': lab_report.created_by,
                    'status': lab_report.status
                },
                'individual_tests': [],
                'favourite_tests': []  # Placeholder for future favorite tests handling
            }

            # Get individual tests linked to the lab report
            individual_tests = PaidTest_Indivitaul.objects.filter(Registration_Id=lab_report.report_id)
            test_codes = [test.testCode_id for test in individual_tests]
            favourite_tests = PaidTest_Favourites.objects.filter(Registration_Id=lab_report.report_id)

            # Fetch test names for the test codes
            test_name_map = {
                test['TestCode']: test['Test_Name']
                for test in LabTestName_Details.objects.filter(TestCode__in=test_codes).values('TestCode', 'Test_Name')
            }

            # Add individual test details to the response
            for index, test in enumerate(individual_tests, start=1):
                test_name = test_name_map.get(test.testCode_id, 'Unknown Test')
                response_data['individual_tests'].append({
                    'id': index,
                    'testCode': test.testCode_id,
                    'test_type': str(test.test_type),
                    'test_name': test_name,
                    'value': test.value,
                    'category_type': str(test.category_type),
                    'description': test.description or '',
                    'status': str(test.status),
                })
            
            
               # Add favourite test details to the response
            for fav_test in favourite_tests:
                response_data['favourite_tests'].append({
                    'reportfav_id': fav_test.reportfav_id,
                    'favourite_name': fav_test.favCode.FavouriteName if fav_test.favCode else 'Unknown Favourite',
                    'test_name': fav_test.testCode.Test_Name if fav_test.testCode else 'Unknown Test',
                    'value': fav_test.value,
                    'category_type': str(fav_test.category_type),
                    'description': fav_test.description or '',
                    'status': str(fav_test.status),
                    'created_at': fav_test.created_at,
                    'updated_at': fav_test.updated_at,
                })
            # Return the response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Print full traceback to help debug
            # print(traceback.format_exc())
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_lab_report_details(request):
    if request.method == 'GET':
        try:
            Registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)

            if not Registration_id:
                return JsonResponse({'warn': 'Missing registration Id'}, status=400)
            if not RegisterType:
                return JsonResponse({'warn': 'Missing Register Type'}, status=400)

            # Fetch the correct lab report based on RegisterType
            lab_report = None
            if RegisterType == "OP":
                lab_report = Lab_ReportEntry_Details.objects.filter(OP_Register_Id=Registration_id).last()
            elif RegisterType == "IP":
                lab_report = Lab_ReportEntry_Details.objects.filter(IP_Register_Id=Registration_id).last()
            elif RegisterType == "Casuality":
                lab_report = Lab_ReportEntry_Details.objects.filter(Casuality_Register_Id=Registration_id).last()
            else:
                return JsonResponse({'warn': 'Invalid Register Type'})

            # If no lab report is found
            if not lab_report:
                return JsonResponse({'warn': 'No report found for the given Registration ID and Register Type'})

            # Function to convert file data to base64
            def get_file_image(filedata):
                kind = filetype.guess(filedata)
                contenttype1 = 'application/pdf'  # Default type
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

            # Determine which ID field was used for lookup
            actual_registration_id = (
                lab_report.OP_Register_Id.pk if lab_report.OP_Register_Id else
                lab_report.IP_Register_Id.Registration_Id if lab_report.IP_Register_Id else
                lab_report.Casuality_Register_Id.pk if lab_report.Casuality_Register_Id else None
            )

            # Prepare response data
            response_data = {
                'lab_report_entry': {
                    'report_id': lab_report.report_id,
                    'registrationid': actual_registration_id,  # Correct ID based on type
                    'registertype': lab_report.RegisterType,
                    'report_date': lab_report.report_date.strftime("%Y-%m-%d"),
                    'report_time': lab_report.report_time.strftime("%H:%M:%S"),
                    'reportfile': get_file_image(lab_report.report_file) if lab_report.report_file else None,
                    'technician_name': lab_report.technician_name,
                    'report_handovered_by': lab_report.report_handovered_by,
                    'report_handovered_to': lab_report.report_handovered_to,
                    'created_by': lab_report.created_by,
                    'status': lab_report.status
                },
                'individual_tests': [],
            }

            # Fetch individual test results
            individual_tests = PaidTest_Indivitaul.objects.filter(Registration_Id=lab_report.report_id)
            for index, test in enumerate(individual_tests, start=1):
                response_data['individual_tests'].append({
                    'id': index,
                    'testCode': test.testCode.TestCode,  # Fetch Test Code
                    'test_name': test.testCode.Test_Name,  # Fetch Test Name
                    'value': test.value,
                    'description': test.description
                })

            return JsonResponse(response_data, status=200)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
           







@csrf_exempt
@require_http_methods(["GET"])
def OtRequest_Details(request):
    try:
        DoctorId = request.GET.get("DoctorId", None)
        Speciality = request.GET.get("Specialization", None)

        if not DoctorId or not Speciality:
            return JsonResponse({'warn': 'DoctorId and Specialization missing'})

        # Fetch doctor details
        doctor = Doctor_Personal_Form_Detials.objects.get(pk=DoctorId)

        # Fetch speciality details
        speciality = Speciality_Detials.objects.get(pk=Speciality)

        # Construct the full name of the doctor
        doctor_name = f"{doctor.Tittle} {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()

        return JsonResponse({
            'DoctorName': doctor_name,
            'SpecialityName': speciality.Speciality_Name
        })

    except Doctor_Personal_Form_Detials.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    except Speciality_Detials.DoesNotExist:
        return JsonResponse({'error': 'Specialization not found'}, status=404)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal Server Error'},status=500)





@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_Complete_Details_Link(request):
    def validate_and_process_file(file):
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            return compressed_data, len(compressed_data)

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            return output.getvalue(), len(output.getvalue())

        if file:
            try:
                file_data = file.split(',')[1]
                file_content = base64.b64decode(file_data)
                file_size = len(file_content)

                max_size_mb = 5
                if file_size > max_size_mb * 1024 * 1024:
                    return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'}, status=400)

                file_type = get_file_type(file)

                if file_type in ['image/jpeg', 'image/png']:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, _ = compress_image(image)
                    return compressed_image_data

                elif file_type == 'application/pdf':
                    compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
                    return compressed_pdf_data

                else:
                    return JsonResponse({'warn': 'Unsupported file format'}, status=400)

            except Exception as e:
                return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

        return None

 
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'warn': 'Request body is empty'}, status=400)
            
            data = json.loads(request.body)
            # print("complete Radiology", data)
            RegistrationId = data.get('Registeration_Id') 
            RegisterType = data.get('RegisterType', None)
            ReportDate = data.get('ReportDate', '')
            ReportTime = data.get('ReportTime', '')
            RadiologistName = data.get('RadiologistName', '')
            TechnicianName = data.get('TechnicianName', '')
            Report = data.get('Report', '')
            ReportHandoOvered = data.get('ReportHandoOvered', '')
            RelativeName = data.get('RelativeName', '')
            Radiology_RequestID = data.get('Radiology_RequestID') if data.get('Radiology_RequestID')  else data.get('Radiology_RequestId') 
            ChooseFileOne = data.get('ChooseFileOne', '')
            ChooseFileTwo = data.get('ChooseFileTwo', '')
            ChooseFileThree = data.get('ChooseFileThree', '')
            created_by = data.get('created_by', '')
            Radiology_CompleteId = data.get('Radiology_CompleteId','') if data.get('Radiology_CompleteId')  else data.get('completeId')
            html_content = data.get('html') or data.get('htmlcontent') or ''
            subdepartment= data.get('subdepartment','')
            fileName = data.get('ReportName','')
            TestCode = data.get('TestCode')
            Document_Id = data.get('Document_Id')
            fromm = data.get('from', '')
            SubTestCode = data.get('SubTestCode', None)
            doctorId = data.get('radiologistid','')
            
            encoded_html = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')
            # print("Encoded HTML:", encoded_html)
            # print("complete Radiology", RegistrationId, Radiology_RequestID, RegisterType)

            
            department_instance = RadiologyNames_Details.objects.filter(Radiology_Name=subdepartment).first() if subdepartment else None

            # Correcting the typo in variable name
            processed_files = {
                'ChooseFileOne': validate_and_process_file(ChooseFileOne) if ChooseFileOne else None,
                'ChooseFileTwo': validate_and_process_file(ChooseFileTwo) if ChooseFileTwo else None,
                'ChooseFileThree': validate_and_process_file(ChooseFileThree) if ChooseFileThree else None,
            }
            
            if any(isinstance(value, JsonResponse) for value in processed_files.values()):
                return next(value for value in processed_files.values() if isinstance(value, JsonResponse))
            
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing Registration Id'}, status=200)
            if not Radiology_RequestID:
                return JsonResponse({'warn': 'Missing Request Id'}, status=200)
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'}, status=200)
            
            # Fetching registration instance based on RegisterType
            registration_instance = None
            if RegisterType == "OP" or RegisterType == "WALK-IN":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            
            if not registration_instance:
                return JsonResponse({'warn': 'Invalid registration ID or RegisterType'})
            
            if SubTestCode:
                Radiology_Request_ins = Radiology_Request_Details.objects.filter(pk=Radiology_RequestID, SubTestCode=SubTestCode).first()
            else:
                Radiology_Request_ins = Radiology_Request_Details.objects.filter(pk=Radiology_RequestID, SubTestCode=TestCode).first()

            # If Radiology_CompleteId exists, update the entry
            if Radiology_CompleteId and Radiology_CompleteId !="" :
                try:
                    Radiology_Complete_ins = Radiology_Complete_Details.objects.get(pk=Radiology_CompleteId)
                except Radiology_Complete_Details.DoesNotExist:
                    return JsonResponse({'warn': 'RadiologyTest not found'}, status=404)
                
                if fromm == 'doctor':
                    print(type(encoded_html))
                    Radiology_Complete_ins.html_content = encoded_html
                    Radiology_Request_ins.Service_Status = "Completed"
                    Radiology_Request_ins.save()
                else:
                    # Updating fields
                    Radiology_Complete_ins.Radiology_CompleteId = Radiology_CompleteId
                    Radiology_Complete_ins.RegisterType = RegisterType
                    Radiology_Complete_ins.OP_Register_Id = registration_instance if RegisterType == "OP" else None
                    Radiology_Complete_ins.IP_Register_Id = registration_instance if RegisterType == "IP" else None
                    Radiology_Complete_ins.Casuality_Register_Id = registration_instance if RegisterType == "Casuality" else None
                    Radiology_Complete_ins.Radiology_RequestId = Radiology_Request_ins
                    Radiology_Complete_ins.ReportDate = ReportDate
                    Radiology_Complete_ins.ReportTime = ReportTime
                    Radiology_Complete_ins.RadiologistName = RadiologistName
                    Radiology_Complete_ins.Technician_Name = TechnicianName
                    Radiology_Complete_ins.Report = Report
                    Radiology_Complete_ins.Report_fileone = processed_files['ChooseFileOne']
                    Radiology_Complete_ins.Report_filetwo = processed_files['ChooseFileTwo']
                    Radiology_Complete_ins.Report_filethree = processed_files['ChooseFileThree']
                    Radiology_Complete_ins.Report_HandOverTo = ReportHandoOvered
                    Radiology_Complete_ins.RelativeName = RelativeName
                    Radiology_Complete_ins.html_content = encoded_html
                    
                    Radiology_Request_ins.Service_Status = "Anaylzed"
                    Radiology_Request_ins.save()

                Radiology_Complete_ins.save()

                return JsonResponse({'success': 'Report Entry Updated successfully'}, status=200)
            
            # Else, create a new Radiology Complete entry
            else:
                Radiology_Complete_ins = Radiology_Complete_Details.objects.create(
                    RegisterType=RegisterType,
                    OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                    IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                    Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                    Radiology_RequestId=Radiology_Request_ins,
                    ReportDate=ReportDate,
                    ReportTime=ReportTime,
                    RadiologistName=RadiologistName,
                    Technician_Name=TechnicianName,
                    Report=Report,
                    Report_fileone=processed_files['ChooseFileOne'],
                    Report_filetwo=processed_files['ChooseFileTwo'],
                    Report_filethree=processed_files['ChooseFileThree'],
                    Report_HandOverTo=ReportHandoOvered,
                    RelativeName=RelativeName,
                    Createdby=created_by,
                    department = department_instance,
                    doctorId = doctorId,
                    html_content = encoded_html,
                    fileName = fileName,
                    TestCode = TestCode,
                    Document_Id = Document_Id
                )
                Radiology_Request_ins.Service_Status = "Anaylzed"
                Radiology_Request_ins.save()
                Radiology_Complete_ins.save()
                return JsonResponse({'success': 'Report Entry Saved successfully'}, status=200)
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)

            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)

            # Fetch registration details and corresponding radiology requests
            if RegisterType == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)

            # Function to encode files
          

            def get_file_image(filedata):
                try:
                    kind = filetype.guess(filedata)
                    
                    # Supported MIME types
                    supported_mime_types = [
                        'application/pdf',
                        'image/jpeg',
                        'image/png'
                    ]
                    
                    if kind and kind.mime in supported_mime_types:
                        contenttype = kind.mime
                    else:
                        contenttype = 'application/octet-stream'  # Default for unknown types
                    
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype};base64,{base64.b64encode(filedata).decode("utf-8")}'
                
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None


            # Prepare response data
            response_data = []
            for index, req in enumerate(radiology_requests, start=1):
                # Fetch the required names based on IsSubTest
                test_code = req.Radiology_RequestId.TestCode
                subtest_code = req.Radiology_RequestId.SubTestCode
                radiology_id = None
                radiology_name = None
                if req.Radiology_RequestId.IsSubTest == 'Yes':
                    testname = TestName_Details.objects.get(Test_Code=test_code)
                    # subtestname = SubTest_Details.objects.get(SubTest_Code=subtest_code)
                    radiology_id = testname.Radiology_Id
                    radiology_name = radiology_id.Radiology_Name if radiology_id else None
                else:  # If IsSubTest is 'No'
                    testname = TestName_Details.objects.get(Test_Code=subtest_code)
                    subtestname = None
                    radiology_name_obj = RadiologyNames_Details.objects.get(Radiology_Id=test_code)
                    radiology_name = radiology_name_obj.Radiology_Name if radiology_name_obj else None
                                

                            
                
                current_month = datetime.now()
                # formatted_date = current_month.strftime("%d-%m-%Y")
                formatted_date = current_month.strftime("%Y-%m-%d")
                report_date = None
                if isinstance(req.ReportDate, str) and req.ReportDate:
                    try:
                        report_date = datetime.fromisoformat(req.ReportDate).strftime('%d-%m-%Y')
                    except ValueError:
                        print(f"Invalid ReportDate format: {req.ReportDate}")  # Debug print

    # Format ReportTime
                report_time = None
                if isinstance(req.ReportTime, str) and req.ReportTime:
                    try:
                        report_time = datetime.fromisoformat(req.ReportTime).strftime('%H:%M')
                    except ValueError:
                        print(f"Invalid ReportTime format: {req.ReportTime}")  # Debug print
                response_data.append({
                    'id': index,
                    'ReportDate': report_date if report_date else formatted_date,
                    'ReportTime': report_time if report_time else current_month.strftime('%H:%M'),
                    'RadiologistName': req.RadiologistName,
                    'TechnicianName': req.Technician_Name,
                    'TestCode': test_code,  # Add TestCode
                    'SubTestCode': subtest_code, 
                    'Radiology_RequestId': req.Radiology_RequestId.pk,  # Add Radiology_RequestId
                    'Radiology_CompleteId': req.pk,
                    'Report': req.Report,
                    'IsSubTest':req.Radiology_RequestId.IsSubTest,
                    'RadiologyName': radiology_name,
                    'TestName': testname.Test_Name if testname else None,
                    'SubTestName': subtestname.SubTestName if subtestname else None,
                    'RadiologyId': radiology_id.Radiology_Id if radiology_id else None,
                    'Report_fileone': get_file_image(req.Report_fileone) if req.Report_fileone else None,
                    'Report_filetwo': get_file_image(req.Report_filetwo) if req.Report_filetwo else None,
                    'Report_filethree': get_file_image(req.Report_filethree) if req.Report_filethree else None,
                    'Report_HandOverTo': req.Report_HandOverTo,
                    'RelativeName': req.RelativeName,
                    'Createdby': req.Createdby,
                    'Status': req.Status,
                })

            # Return the response
            return JsonResponse(response_data,  safe=False)


        except Exception as e:
            print(f"Exception: {e}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    return JsonResponse({'warn': 'Invalid request method'}, status=405)

              






@csrf_exempt
@require_http_methods(["GET"])
def Lab_Queuelist_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        print("status1231",status)

        # Fetch all Lab_Request_Details
        queryset = Lab_Request_Details.objects.all()
  
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__SurName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__PhoneNo__icontains=query)
            )

       

        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        response_data = []
        seen_registration_ids = set()
        index = 1

        for lab_request in queryset:
            registration_details = None
            if lab_request.RegisterType == "OP":
                registration_details = lab_request.OP_Register_Id
            elif lab_request.RegisterType == "IP":
                registration_details = lab_request.IP_Register_Id
            elif lab_request.RegisterType == "Casuality":
                registration_details = lab_request.Casuality_Register_Id
            elif lab_request.RegisterType == "Lab":
                registration_details = lab_request.OP_Register_Id
            
            if not registration_details:
                continue

            # Determine registration ID based on RegisterType
            if lab_request.RegisterType == "OP":
                registration_id = registration_details.id
            elif lab_request.RegisterType == "IP":
                registration_id = registration_details.Registration_Id
            elif lab_request.RegisterType == "Casuality":
                registration_id = registration_details.id
            elif lab_request.RegisterType == "Lab":
                registration_id = registration_details.id
                
            else:
                continue

            # Skip if we've already seen this registration ID
            if registration_id in seen_registration_ids:
                continue

            # Add registration ID to the set
            seen_registration_ids.add(registration_id)

            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.Title.Title_Name}. {registration_details.PatientId.FirstName or ''} {registration_details.PatientId.MiddleName or ''} {registration_details.PatientId.SurName or ''}"
            phone_number = registration_details.PatientId.PhoneNo

            doctor_shortname = f"Dr. {registration_details.PrimaryDoctor.ShortName}" if registration_details.PrimaryDoctor else None
            doctor_name = f"Dr. {registration_details.PrimaryDoctor.First_Name or ''} {registration_details.PrimaryDoctor.Middle_Name or ''} {registration_details.PrimaryDoctor.Last_Name or ''}" if registration_details.PrimaryDoctor else None
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None

            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': getattr(registration_details, 'VisitId', None),
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_name,
                'Specilization': str(registration_details.Specialization.Speciality_Name) if registration_details.Specialization else '',
                'RegisterType': lab_request.RegisterType, 
                'Status':lab_request.Status
            })
            index += 1

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)






@csrf_exempt
@require_http_methods(["GET"])
def Lab_ViewStatus_link(request):
    try:
        registration_id = request.GET.get('RegistrationId')
        status = request.GET.get('status', '')
        register_type = request.GET.get('RegisterType', '')

        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'})

        if register_type not in ['OP', 'IP', 'Casuality', 'Lab']:
            return JsonResponse({'warn': 'Invalid RegisterType'})

        queryset_filter = Q()
        if register_type == "IP":
            queryset_filter = Q(IP_Register_Id=registration_id)
        elif register_type == "OP":
            queryset_filter = Q(OP_Register_Id=registration_id)
        elif register_type == "Casuality":
            queryset_filter = Q(Casuality_Register_Id=registration_id)
        elif register_type == "Lab":
            queryset_filter = Q(OP_Register_Id=registration_id)

            
        queryset = Lab_Request_Details.objects.filter(
            queryset_filter & Q(Status=status) & Q(RegisterType=register_type)
        )

        # Fetch patient and doctor details
        if register_type == "OP":
            registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
        elif register_type == "IP":
            registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
        elif register_type == "Casuality":
            registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
        elif register_type == "Lab":
            registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)


        # Extract patient and doctor details
        patient_id = registration_details.PatientId.PatientId
        patient_name = f"{registration_details.PatientId.Title.Title_Name} {registration_details.PatientId.FirstName or ''} {registration_details.PatientId.MiddleName or ''} {registration_details.PatientId.SurName or ''}"
        phone_number = registration_details.PatientId.PhoneNo
        doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
        doctor_name = f"Dr. {registration_details.PrimaryDoctor.First_Name or ''} {registration_details.PrimaryDoctor.Middle_Name or ''} {registration_details.PrimaryDoctor.Last_Name or ''}" if registration_details.PrimaryDoctor else None
        doctor_shortname = f"Dr. {registration_details.PrimaryDoctor.ShortName}" if registration_details.PrimaryDoctor else None

        response_data = []
        index = 1

        for lab_request in queryset:
            if lab_request.TestType == 'Individual':
                test_name_obj = LabTestName_Details.objects.filter(TestCode=lab_request.IndivitualCode_id).first()
                if not test_name_obj:
                    continue

                individual_test_details = {
                    'id': index,
                    'PatientId': patient_id,
                    'PatientName': patient_name,
                    'PhoneNumber': phone_number,
                    'DoctorId': doctor_id,
                    'DoctorName': doctor_name,
                    'DoctorShortName': doctor_shortname,
                    'RegisterType': lab_request.RegisterType,
                    'TestType': lab_request.TestType,
                    'TestCode': lab_request.IndivitualCode.TestCode,
                    'TestName': test_name_obj.Test_Name
                }

                if lab_request.Status == 'Cancelled':
                    individual_test_details['Reason'] = str(lab_request.Reason)

                response_data.append(individual_test_details)
                index += 1

            elif lab_request.TestType == 'Favourites':
                favourite_test_obj = TestName_Favourites.objects.filter(Favourite_Code=lab_request.FavouriteCode_id).first()
                if not favourite_test_obj:
                    continue

                favourite_test_details = {
                    'id': index,
                    'PatientId': patient_id,
                    'PatientName': patient_name,
                    'PhoneNumber': phone_number,
                    'DoctorId': doctor_id,
                    'DoctorName': doctor_name,
                    'DoctorShortName': doctor_shortname,
                    'RegisterType': lab_request.RegisterType,
                    'TestType': lab_request.TestType,
                    'TestCode': favourite_test_obj.Favourite_Code,
                    'TestName': favourite_test_obj.FavouriteName
                }

                if lab_request.Status == 'Cancelled':
                    favourite_test_details['Reason'] = str(lab_request.Reason)

                response_data.append(favourite_test_details)
                index += 1

            elif lab_request.TestType == 'Package':
                package = lab_request.PackageCode  # Assuming PackageCode is linked
                if package:
                    package_details = {
                        'id': index,
                        'PatientId': patient_id,
                        'PatientName': patient_name,
                        'PhoneNumber': phone_number,
                        'DoctorId': doctor_id,
                        'DoctorName': doctor_name,
                        'DoctorShortName': doctor_shortname,
                        'RegisterType': lab_request.RegisterType,
                        'TestType': lab_request.TestType,
                        'TestCode': package.Package_Code,
                        'TestName': package.PackageName
                    }

                    if lab_request.Status == 'Cancelled':
                        package_details['Reason'] = str(lab_request.Reason)

                    response_data.append(package_details)
                    index += 1

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)
@csrf_exempt
@require_http_methods(["GET"])
def Lab_Request_TestDetails(request):
    try:
        registration_id = request.GET.get('Register_Id')
        patient_id = request.GET.get('Patient_Id')
        register_type = request.GET.get('RegisterType')
        status = request.GET.get('Status', "Request")

        # Validate required parameters
        if not registration_id or not patient_id or not register_type:
            return JsonResponse({'warn': 'Missing registration ID, patient ID, or RegisterType'})

        # Get patient details
        try:
            patient_details = Patient_Detials.objects.get(PatientId=patient_id)
            patient_name = f"{patient_details.Title.Title_Name}.{patient_details.FirstName or ''} {patient_details.MiddleName or ''} {patient_details.SurName or ''}"
            phone_number = patient_details.PhoneNo
            patient_age = patient_details.Age
            patient_gender = patient_details.Gender
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Patient ID not found'}, status=404)

        # Fetch lab requests based on registration type
        if register_type == "OP":
            lab_requests = Lab_Request_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=register_type, Status=status)
        elif register_type == "IP":
            lab_requests = Lab_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=register_type, Status=status)
        elif register_type == "Casuality":
            lab_requests = Lab_Request_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=register_type, Status=status)
        elif register_type == "Lab":
            lab_requests = Lab_Request_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=register_type, Status=status)
        else:
            return JsonResponse({'warn': 'Invalid RegisterType'})

        # Fetch doctor details
        try:
            if register_type == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            elif register_type == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
            elif register_type == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.get(pk=registration_id)
            elif register_type == "Lab":
                registration_details = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            doctor_name = f"Dr. {registration_details.PrimaryDoctor.First_Name or ''} {registration_details.PrimaryDoctor.Middle_Name or ''} {registration_details.PrimaryDoctor.Last_Name or ''}" if registration_details.PrimaryDoctor else None
            doctor_shortname = f"Dr. {registration_details.PrimaryDoctor.ShortName}" if registration_details.PrimaryDoctor else None
        except Exception as e:
            return JsonResponse({'warn': 'Doctor details not found'}, status=404)

        response_data = []
        index = 1

        # Iterate over lab requests
        for lab_request in lab_requests:
            if lab_request.TestType == "Individual":
                test_name_obj = LabTestName_Details.objects.filter(TestCode=lab_request.IndivitualCode_id).first()
                if test_name_obj:
                    individual_test_details = {
                        'id': index,
                        'pk':lab_request.pk,
                        'PatientId': patient_id,
                        'PatientName': patient_name,
                        'PhoneNumber': phone_number,
                        'PatientAge': patient_age,  # Added Patient Age
                        'PatientGender': patient_gender,  # Added Patient Gender
                        'DoctorId': doctor_id,
                        'DoctorName': doctor_name,
                        'DoctorShortName': doctor_shortname,
                        'RegisterType': register_type,
                        'TestType': lab_request.TestType,
                        'TestCode': lab_request.IndivitualCode.TestCode,
                        'TestName': test_name_obj.Test_Name,
                        'Amount':test_name_obj.Amount
                    }
                    response_data.append(individual_test_details)
                    index += 1

            elif lab_request.TestType == "Favourites":
                favourite_test_obj = TestName_Favourites.objects.filter(Favourite_Code=lab_request.FavouriteCode_id).first()
                if favourite_test_obj:
                    favourite_test_details = {
                        'id': index,
                        'pk':lab_request.pk,
                        'PatientId': patient_id,
                        'PatientName': patient_name,
                        'PhoneNumber': phone_number,
                        'PatientAge': patient_age,  # Added Patient Age
                        'PatientGender': patient_gender,  # Added Patient Gender
                        'DoctorId': doctor_id,
                        'DoctorName': doctor_name,
                        'DoctorShortName': doctor_shortname,
                        'RegisterType': register_type,
                        'TestType': lab_request.TestType,
                        'TestCode': favourite_test_obj.Favourite_Code,
                        'TestName': favourite_test_obj.FavouriteName,
                        'Amount':favourite_test_obj.Current_Amount
                    }
                    response_data.append(favourite_test_details)
                    index += 1

            elif lab_request.TestType == "Package":
                package = lab_request.PackageCode  # Assuming PackageCode is linked
                if package:
                    package_details = {
                        'id': index,
                        'pk':lab_request.pk,
                        'PatientId': patient_id,
                        'PatientName': patient_name,
                        'PhoneNumber': phone_number,
                        'PatientAge': patient_age,  # Added Patient Age
                        'PatientGender': patient_gender,  # Added Patient Gender
                        'DoctorId': doctor_id,
                        'DoctorName': doctor_name,
                        'DoctorShortName': doctor_shortname,
                        'RegisterType': register_type,
                        'TestType': lab_request.TestType,
                        'TestCode': package.Package_Code,
                        'TestName': package.PackageName,
                        'Amount':package.Current_Amount
                    }
                    response_data.append(package_details)
                    index += 1

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Internal server error: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Lab_Billing_Quelist_link(request):
    try:
        Registerid = request.GET.get('Register_Id')
        RegisterType = request.GET.get('RegisterType')

        if not RegisterType:
            return JsonResponse({'warn': 'RegisterType is not found'})
        if not Registerid:
            return JsonResponse({'warn': 'Registerid is not found'})

        # Fetch Lab Request Details based on RegisterType
        if RegisterType == 'OP':
            lab_Tests = Lab_Request_Details.objects.filter(
                OP_Register_Id=Registerid, RegisterType=RegisterType, Status="Pending"
            )
        elif RegisterType == 'IP':
            lab_Tests = Lab_Request_Details.objects.filter(
                IP_Register_Id=Registerid, RegisterType=RegisterType, Status="Pending"
            )
        elif RegisterType == 'Casuality':
            lab_Tests = Lab_Request_Details.objects.filter(
                Casuality_Register_Id=Registerid, RegisterType=RegisterType, Status="Pending"
            )
        elif RegisterType == 'Lab':
            lab_Tests = Lab_Request_Details.objects.filter(
                OP_Register_Id=Registerid, RegisterType=RegisterType, Status="Pending"
            )
        else:
            return JsonResponse({'warn': 'Invalid RegisterType'})

        # Process the test data
        labdata = []
        index = 1

        for lab_request in lab_Tests:
            test_data = {
                'id': index,
            'TestType': lab_request.TestType,
                'LabRequestId':lab_request.Request_Id,
            }

            if lab_request.TestType == "Individual":
                test_data.update({
                    'TestCode': lab_request.IndivitualCode.TestCode,
                    'TestName': lab_request.IndivitualCode.Test_Name,
                    'Amount':lab_request.Amount if lab_request.Amount else 0,
                    
                })  
            if lab_request.TestType == "Favourites":
                test_data.update({
                    'TestCode': lab_request.FavouriteCode.Favourite_Code,
                    'TestName': lab_request.FavouriteCode.FavouriteName,
                    'Amount':lab_request.Amount if lab_request.Amount else 0,
                })
            if lab_request.TestType == "Package":
                test_data.update({
                    'TestCode': lab_request.PackageCode.Package_Code,
                    'TestName': lab_request.PackageCode.PackageName,
                    'Amount':lab_request.Amount if lab_request.Amount else 0,
                })

            labdata.append(test_data)
            index += 1

        return JsonResponse(labdata, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_Request_Detailslink(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
 
            print(data,'data')
           
            # Extract data from the request
            Radiology_queue_id = data.get('RadiologyTestId', '')
            Testname_arr = data.get('SubtestNoArr', [])
            created_by = data.get('created_by', '')
            RegisterType = data.get('RegisterType',None)
            registration_id = data.get('Register_Id', None)
            DoctorId = data.get('DoctorId','')
            print(registration_id,'registration_id12344444444444')
 
            docins = None
            docins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()
           
            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing registration ID or RegisterType'})
             # Determine the correct registration model and fetch the instance
            registration_instance = None
            if RegisterType == "OP" or RegisterType == 'WALK-IN':
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=registration_id).first()
            elif RegisterType == "ExternalRadiology":
                registration_instance = Patient_Diagnosis_Registration_Detials.objects.filter(pk=registration_id).first()
               
           
            # Process IsSubTest No Tests
            for testname in Testname_arr:
                Radiologyid = testname.get('Radiologyid', None)
                TestCode = testname.get('TestCode', None)
 
                print(Radiologyid,'Radiologyid')
                print(TestCode,'TestCode')
 
                print(registration_instance,'registration_instance')
 
               
                if Radiologyid and TestCode:  # Ensure required fields are present
                    Radiology_Request_Details.objects.create(
                        RegisterType = RegisterType,
                        OP_Register_Id=registration_instance if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                        Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=registration_instance if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        Doctorid = docins,
                        SubTestCode=TestCode,
                        created_by=created_by
                    )
           
            # Process IsSubTest Yes Tests
           
            return JsonResponse({'success': 'Data Saved successfully'}, status=200)
       
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
   
   
 
    elif request.method == 'GET':
        try:
            def get_file_image(filedata):
                if filedata is None:
                    return None  # Ret
                try:
                    kind = filetype.guess(filedata)
                   
 
                        # List of supported MIME types
                    supported_mime_types = [
                            'application/pdf',
                            'image/jpeg',
                            'image/png',
                            'application/msword',  # For .doc files
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
                    ]
 
                    contenttype1 = 'application/pdf'
                    if kind:
                        if kind.mime in supported_mime_types:
                            contenttype1 = kind.mime
                   
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                   
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None
           
           
            registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)
 
            Employeeid = request.GET.get('Employeeid','')
 
            empins = Employee_Personal_Form_Detials.objects.get(pk=Employeeid)
   
            mri_part = empins.Designation.Designation_Name.split()[0]
 
            raddep = RadiologyNames_Details.objects.get(Radiology_Name=mri_part)
 
           
           
            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)
           
            # Fetch registration details based on RegisterType
            if RegisterType == "OP" or RegisterType == 'WALK-IN':
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id_id=registration_details.pk, RegisterType=RegisterType)
            elif RegisterType == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "ExternalRadiology":
                registration_details = Patient_Diagnosis_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id_id=registration_id, RegisterType=RegisterType)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)
 
            print(radiology_requests,'radiology_requests')
           
            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
            phone_number = registration_details.PatientId.PhoneNo
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            doctor_name = f"{registration_details.PrimaryDoctor.First_Name} {registration_details.PrimaryDoctor.Last_Name}" if registration_details.PrimaryDoctor else None
            doctor_shortname = registration_details.PrimaryDoctor.ShortName if registration_details.PrimaryDoctor else None
           
            if RegisterType == "OP" or RegisterType == 'WALK-IN':
                radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id=registration_details.pk, RegisterType=RegisterType, Status='Request',TestCode = raddep.Radiology_Id)
            elif RegisterType == "IP":
                radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType, Status='Request',TestCode = raddep.Radiology_Id)
            elif RegisterType == "Casuality":
                radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType, Status='Request',TestCode = raddep.Radiology_Id)
            elif RegisterType == "ExternalRadiology":
                radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id=registration_id, RegisterType=RegisterType, Status='Request',TestCode = raddep.Radiology_Id)
               
               
 
           
     
            response_data_no = []
            index = 1
            indexx = 1
           
            for req in radiology_requests:
               
                    # Fetch related TestName_Details and RadiologyNames_Details
                    testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
                    radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
 
               
                   
                   
                    if radiologyname and testname:
                        response_data_no.append({
                            'id': index,
                            'PatientId': patient_id,
                            'Radiology_RequestId': req.Radiology_RequestId,
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'Radiologyid': radiologyname.Radiology_Id,
                            'RadiologyName': radiologyname.Radiology_Name,
                            'TestCode': testname.Test_Code,
                            'TestName': testname.Test_Name,
                            'ChooseFile':get_file_image(testname.Report_file),
                            'Amount': testname.Amount,
                            'BookingFees':testname.BookingFees,
                        })
                        index += 1
               
               
            # Return both lists in the response
            return JsonResponse({
                'IsSubTestNo': response_data_no
            }, safe=False)
                   
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
        return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Request_Detailslink_unpaid(request):
    try:
            def get_file_image(filedata):
                if filedata is None:
                    return None  # Ret
                try:
                    kind = filetype.guess(filedata)
                   
 
                        # List of supported MIME types
                    supported_mime_types = [
                            'application/pdf',
                            'image/jpeg',
                            'image/png',
                            'application/msword',  # For .doc files
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
                    ]
 
                    contenttype1 = 'application/pdf'
                    if kind:
                        if kind.mime in supported_mime_types:
                            contenttype1 = kind.mime
                   
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                   
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None
           
           
            registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)
 
            print(registration_id,'registration_id',RegisterType,'RegisterType')
           
            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)
           
            # Fetch registration details based on RegisterType
            if RegisterType == "OP" or RegisterType == 'WALK-IN':
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)

                print(registration_details.pk)
                radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id_id=registration_details.pk, RegisterType=RegisterType)
            elif RegisterType == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "ExternalRadiology":
                registration_details = Patient_Diagnosis_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id_id=registration_id, RegisterType=RegisterType)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)
 
            print(registration_details.pk,'registration_details',radiology_requests,'radiology_requests')
           
            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
            phone_number = registration_details.PatientId.PhoneNo
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            doctor_name = f"{registration_details.PrimaryDoctor.First_Name} {registration_details.PrimaryDoctor.Last_Name}" if registration_details.PrimaryDoctor else None
            doctor_shortname = registration_details.PrimaryDoctor.ShortName if registration_details.PrimaryDoctor else None
           
            if RegisterType == "OP" or RegisterType == 'WALK-IN':
                radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id=registration_details.pk, RegisterType=RegisterType, Status='Request')
            elif RegisterType == "IP":
                radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
            elif RegisterType == "Casuality":
                radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
            elif RegisterType == "ExternalRadiology":
                radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
               
               
 
           
     
            response_data_no = []
            index = 1
            indexx = 1
           
            for req in radiology_requests:
               
                    # Fetch related TestName_Details and RadiologyNames_Details
                    testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
                    radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
 
                    print(testname,'testname',radiologyname,'radiologyname')
                   
                   
                    if radiologyname and testname:
                        response_data_no.append({
                            'id': index,
                            'PatientId': patient_id,
                            'Radiology_RequestId': req.Radiology_RequestId,
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'Radiologyid': radiologyname.Radiology_Id,
                            'RadiologyName': radiologyname.Radiology_Name,
                            'TestCode': testname.Test_Code,
                            'TestName': testname.Test_Name,
                            'ChooseFile':get_file_image(testname.Report_file),
                            'Amount': testname.Amount,
                            'servicecategory': 'Radiology',
                            'servicesubcategory': f"""{radiologyname.Radiology_Name}-{testname.Test_Name}-{testname.Test_Code}""",
                            
                            'BookingFees':testname.BookingFees,
                        })
                        index += 1
               
               
            # Return both lists in the response
            return JsonResponse({
                'IsSubTestNo': response_data_no
            }, safe=False)
                   
    except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)
 

# @csrf_exempt
# @require_http_methods(["GET"])
# def Radiology_Request_Detailslink_paid(request):
#     try:
#             def get_file_image(filedata):
#                 if filedata is None:
#                     return None  # Ret
#                 try:
#                     kind = filetype.guess(filedata)
                   
 
#                         # List of supported MIME types
#                     supported_mime_types = [
#                             'application/pdf',
#                             'image/jpeg',
#                             'image/png',
#                             'application/msword',  # For .doc files
#                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
#                     ]
 
#                     contenttype1 = 'application/pdf'
#                     if kind:
#                         if kind.mime in supported_mime_types:
#                             contenttype1 = kind.mime
                   
#                     # Return base64 encoded data with MIME type
#                     return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                   
#                 except Exception as e:
#                     print(f"Error processing file: {e}")
#                     return None
           
           
#             registration_id = request.GET.get('Register_Id', None)
#             RegisterType = request.GET.get('RegisterType', None)
#             Employeeid = request.GET.get('Employeeid','')
 
#             empins = Employee_Personal_Form_Detials.objects.get(pk=Employeeid)
   
#             mri_part = empins.Designation.Designation_Name.split()[0]
 
#             raddep = RadiologyNames_Details.objects.get(Radiology_Name=mri_part)
 
#             print(registration_id,'registration_id',RegisterType,'RegisterType')
           
#             if registration_id is None or RegisterType is None:
#                 return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)
           
#             # Fetch registration details based on RegisterType
#             if RegisterType == "OP" or RegisterType == 'WALK-IN':
#                 registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId').get(Registration_Id=registration_id)
#                 radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id_id=registration_details.pk, RegisterType=RegisterType)
#             elif RegisterType == "IP":
#                 registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
#                 radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
#             elif RegisterType == "Casuality":
#                 registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
#                 radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType)
#             elif RegisterType == "ExternalRadiology":
#                 registration_details = Patient_Diagnosis_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
#                 radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id_id=registration_id, RegisterType=RegisterType)
#             else:
#                 return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)
 
#             print(registration_details,'registration_details',radiology_requests,'radiology_requests')
           
#             # Extract patient and doctor details
#             patient_id = registration_details.PatientId.PatientId
#             patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
#             phone_number = registration_details.PatientId.PhoneNo
#             # doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
#             # doctor_name = f"{registration_details.PrimaryDoctor.First_Name} {registration_details.PrimaryDoctor.Last_Name}" if registration_details.PrimaryDoctor else None
#             # doctor_shortname = registration_details.PrimaryDoctor.ShortName if registration_details.PrimaryDoctor else None
           
#             if RegisterType == "OP" or RegisterType == 'WALK-IN':
#                 radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id=registration_details.pk, RegisterType=RegisterType, Status__in=['Paid','Due'],TestCode = raddep.Radiology_Id)
#             elif RegisterType == "IP":
#                 radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType, Status__in=['Paid','Due'],TestCode = raddep.Radiology_Id)
#             elif RegisterType == "Casuality":
#                 radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType, Status__in=['Paid','Due'],TestCode = raddep.Radiology_Id)
#             elif RegisterType == "ExternalRadiology":
#                 radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id=registration_id, RegisterType=RegisterType,Status__in=['Paid','Due'],TestCode = raddep.Radiology_Id)
               
               
 
           
     
#             response_data_no = []
#             index = 1
#             indexx = 1
           
#             for req in radiology_requests:
               
#                     # Fetch related TestName_Details and RadiologyNames_Details
#                     testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
#                     radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
 
#                     print(testname,'testname',radiologyname,'radiologyname')
                   
                   
#                     if radiologyname and testname:
#                         response_data_no.append({
#                             'id': index,
#                             'PatientId': patient_id,
#                             'Radiology_RequestId': req.Radiology_RequestId,
#                             'PatientName': patient_name,
#                             'PhoneNumber': phone_number,
#                             # 'DoctorId': doctor_id,
#                             # 'DoctorName': doctor_name,
#                             # 'DoctorShortName': doctor_shortname,
#                             'Radiologyid': radiologyname.Radiology_Id,
#                             'RadiologyName': radiologyname.Radiology_Name,
#                             'TestCode': testname.Test_Code,
#                             'TestName': testname.Test_Name,
#                             'ChooseFile':get_file_image(testname.Report_file),
#                             'Amount': testname.Amount,
#                             'BookingFees':testname.BookingFees,
#                         })
#                         index += 1
               
               
#             # Return both lists in the response
#             return JsonResponse({
#                 'IsSubTestNo': response_data_no
#             }, safe=False)
                   
#     except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Request_Detailslink_paid(request):
    try:
        def get_file_image(filedata):
            if filedata is None:
                return None
            try:
                kind = filetype.guess(filedata)
                # List of supported MIME types
                supported_mime_types = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'application/msword',  # For .doc files
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
                ]
                contenttype1 = 'application/pdf'
                if kind:
                    if kind.mime in supported_mime_types:
                        contenttype1 = kind.mime
                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            except Exception as e:
                print(f"Error processing file: {e}")
                return None
 
        registration_id = request.GET.get('Register_Id', None)
        RegisterType = request.GET.get('RegisterType', None)
        Employeeid = request.GET.get('Employeeid', '')
        Dept = request.GET.getlist('Dept[]')  
        Dept = list(map(int, Dept))
 
        depins = Department_Detials.objects.filter(Department_Id__in = Dept)
        dept_names = list(depins.values_list('Department_Name', flat=True))
 
        raddep = RadiologyNames_Details.objects.get(Radiology_Name__in=dept_names)
 
 
        if registration_id is None or RegisterType is None:
            return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)
 
        # Fetch registration details based on RegisterType
        if RegisterType == "OP" or RegisterType == 'WALK-IN':
            registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId').get(Registration_Id=registration_id)
            radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id_id=registration_details.pk, RegisterType=RegisterType, Status__in=['Paid', 'Due'],Service_Status="Pending",TestCode = raddep.Radiology_Id)
        elif RegisterType == "IP":
            registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
            radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType, Status__in=['Paid', 'Due'],Service_Status="Pending",TestCode = raddep.Radiology_Id)
        elif RegisterType == "Casuality":
            registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
            radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType, Status__in=['Paid', 'Due'],Service_Status="Pending",TestCode = raddep.Radiology_Id)
        elif RegisterType == "ExternalRadiology":
            registration_details = Patient_Diagnosis_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
            radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id_id=registration_id, RegisterType=RegisterType, Status__in=['Paid', 'Due'],Service_Status="Pending",TestCode = raddep.Radiology_Id)
        else:
            return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)
 
        print(registration_details, 'registration_details', radiology_requests, 'radiology_requests')
 
        # Extract patient details
        patient_id = registration_details.PatientId.PatientId
        patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
        phone_number = registration_details.PatientId.PhoneNo
 
        response_data_no = []
        index = 1
 
        for req in radiology_requests:
            # Fetch related TestName_Details and RadiologyNames_Details
            print(req.SubTestCode,'req.SubTestCode11111')
            testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode.strip()).first()
            radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
 
            print(testname, 'testname', radiologyname, 'radiologyname')
 
            if radiologyname and testname:
                response_data_no.append({
                    'id': index,
                    'PatientId': patient_id,
                    'Radiology_RequestId': req.Radiology_RequestId,
                    'PatientName': patient_name,
                    'PhoneNumber': phone_number,
                    'Radiologyid': radiologyname.Radiology_Id,
                    'RadiologyName': radiologyname.Radiology_Name,
                    'TestCode': testname.Test_Code,
                    'TestName': testname.Test_Name,
                    'ChooseFile': get_file_image(testname.Report_file),
                    'Amount': testname.Amount,
                    'BookingFees': testname.BookingFees,
                })
                index += 1
 
                print(response_data_no,'response_data_no111111')
 
        # Return the list in the response
        return JsonResponse({
            'IsSubTestNo': response_data_no
        }, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["POST","GET","OPTIONS"])
def Radiology_TestAmount_Entry(request):
 
    if request.method == 'POST':
 
        try:
 
            data = json.loads(request.body)
 
            print(data,'data')
 
            Testname_arr = data.get('SubtestNoArr', [])
            created_by = data.get('created_by', '')
            RegisterType = data.get('RegisterType',None)
            registration_id = data.get('Register_Id', None)
 
            print(registration_id)
           
            # if registration_id is None or RegisterType is None:
            #     return JsonResponse({'warn': 'Missing registration ID or RegisterType'})
            #  # Determine the correct registration model and fetch the instance
            # registration_instance = None
            if RegisterType == "OP" or RegisterType == "WALK-IN":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            # elif RegisterType == "Casuality":
            #     registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=registration_id).first()
            # elif RegisterType == "ExternalRadiology":
            #     registration_instance = Patient_Diagnosis_Registration_Detials.objects.filter(pk=registration_id).first()
 
            for testname in Testname_arr:
                Radiologyid = testname.get('Radiologyid', None)
                TestCode = testname.get('TestCode', None)
                TestAmount = testname.get('TestAmount',None)
                Status = testname.get('Status',None)
 
                print(Radiologyid,'Radiologyid')
                print(TestCode,'TestCode')
               
                if Status == 'Paid':
                   
                    if RegisterType == 'OP' or RegisterType == "WALK-IN":
 
                        radiology_ins = Radiology_Request_Details.objects.filter(TestCode = Radiologyid,SubTestCode=TestCode,OP_Register_Id_id = registration_instance.pk)
                        for radins in radiology_ins:
                            if radins.Status == 'Request':
                                radins.Status = 'Paid'
                                radins.save()
                    elif RegisterType == 'IP':
 
                        radiology_ins = Radiology_Request_Details.objects.filter(TestCode = Radiologyid,SubTestCode=TestCode,IP_Register_Id_id = registration_id)
                        for radins in radiology_ins:
                            if radins.Status == 'Request':
                                radins.Status = 'Paid'
                                radins.save()
 
 
                if Radiologyid and TestCode :
 
                                   
                    if RegisterType == 'OP' or RegisterType == "WALK-IN":
 
                        radiology_ins = Radiology_Request_Details.objects.filter(TestCode = Radiologyid,SubTestCode=TestCode,OP_Register_Id_id = registration_instance.pk)
                        for radins in radiology_ins:
 
                            if radins.Status == 'Request':
                                radins.Amount = TestAmount
                                radins.Status = 'Unpaid'
                                radins.save()
                    elif RegisterType == 'IP':
 
                        radiology_ins = Radiology_Request_Details.objects.filter(TestCode = Radiologyid,SubTestCode=TestCode,IP_Register_Id_id = registration_id)
                        for radins in radiology_ins:
 
                            if radins.Status == 'Request':
                                radins.Amount = TestAmount
                                radins.Status = 'Unpaid'
                                radins.save()
                       
                       
 
            return JsonResponse({'success': 'updated successfully'})
 
               
                # if Radiologyid and TestCode and registration_id :  # Ensure required fields are present
                #     Radiology_Request_Details.objects.create(
                #         RegisterType = RegisterType,
                #         OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                #         IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                #         Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                #         Diagnosis_Register_Id=registration_instance if RegisterType == "ExternalRadiology" else None,
                #         TestCode=Radiologyid,
                #         SubTestCode=TestCode,
                #         created_by=created_by
                #     )
 
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Paid_LabQueuelist_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        print("Stataus99999999999999999",status)
        queryset = Lab_Request_Details.objects.all()
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__SurName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__PhoneNo__icontains=query)
            )
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))
        

        
        response_data = []
        seen_registration_ids = set()
        index = 1
        for lab_request in queryset:
            registration_details = None
            if lab_request.RegisterType == "OP":
                registration_details = lab_request.OP_Register_Id
            elif lab_request.RegisterType == "IP":
                registration_details = lab_request.IP_Register_Id
            elif lab_request.RegisterType == "Casuality":
                registration_details = lab_request.Casuality_Register_Id
            elif lab_request.RegisterType == "Lab":
                registration_details = lab_request.OP_Register_Id
            
            if not registration_details:
                continue

            # Determine registration ID based on RegisterType
            if lab_request.RegisterType == "OP":
                registration_id = registration_details.id
            elif lab_request.RegisterType == "IP":
                registration_id = registration_details.Registration_Id
            elif lab_request.RegisterType == "Casuality":
                registration_id = registration_details.id
            elif lab_request.RegisterType == "Lab":
                registration_id = registration_details.id
                
            else:
                continue

            # Skip if we've already seen this registration ID
            if registration_id in seen_registration_ids:
                continue

            # Add registration ID to the set
            seen_registration_ids.add(registration_id)

            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.Title.Title_Name}. {registration_details.PatientId.FirstName or ''} {registration_details.PatientId.MiddleName or ''} {registration_details.PatientId.SurName or ''}"
            phone_number = registration_details.PatientId.PhoneNo

            doctor_shortname = f"Dr. {registration_details.PrimaryDoctor.ShortName}" if registration_details.PrimaryDoctor else None
            doctor_name = f"Dr. {registration_details.PrimaryDoctor.First_Name or ''} {registration_details.PrimaryDoctor.Middle_Name or ''} {registration_details.PrimaryDoctor.Last_Name or ''}" if registration_details.PrimaryDoctor else None
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None

            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': getattr(registration_details, 'VisitId', None),
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_name,
                'Specilization': str(registration_details.Specialization.Speciality_Name) if registration_details.Specialization else '',
                'RegisterType': lab_request.RegisterType, 
                'Status':lab_request.Status
            })
            index += 1

        return JsonResponse(response_data, safe=False)

    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)

# def get_rad_request_details(request, Status=None, date_filters=None):
#     try:
#         # Build search query
#         search_query = Q(Status='Request', RegisterType__in=['IP'])

#         # Apply date filters
#         if date_filters:
#             if date_filters['DateType'] == "Current" and date_filters['CurrentDate']:
#                 try:
#                     current_date = datetime.strptime(date_filters['CurrentDate'], '%Y-%m-%d').date()
#                     search_query &= Q(created_at__date=current_date)
#                 except ValueError:
#                     raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
#             elif date_filters['DateType'] == "Customize":
#                 try:
#                     if date_filters['FromDate'] and date_filters['ToDate']:
#                         from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
#                         to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
#                         search_query &= Q(created_at__date__range=[from_date, to_date])
#                     elif date_filters['FromDate']:
#                         from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
#                         search_query &= Q(created_at__date__gte=from_date)
#                     elif date_filters['ToDate']:
#                         to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
#                         search_query &= Q(created_at__date__lte=to_date)
#                 except ValueError:
#                     raise ValueError('Invalid date format. Use YYYY-MM-DD.')

#         queryset = Radiology_Request_Details.objects.filter(search_query)

#         response_data = []
#         seen_registration_ids = set()
#         index = 1

#         for radiology_request in queryset:
#             radiologytestlist = []
#             registration_id = None
#             registration_details = None
#             if radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
#                 registration_id = radiology_request.IP_Register_Id.Registration_Id
#                 registration_details = radiology_request.IP_Register_Id

#             if not registration_id or registration_id in seen_registration_ids:
#                 continue

#             seen_registration_ids.add(registration_id)

#             patient = registration_details.PatientId if registration_details else None
#             doctor = registration_details.PrimaryDoctor if registration_details else None

#             patient_id = patient.PatientId if patient else None
#             patient_age = patient.Age if patient else None
#             patient_gender = patient.Gender if patient else None
#             patient_name = f"{patient.Title.Title_Name or ''} {patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None
#             phone_number = patient.PhoneNo if patient else None
#             doctor_id = doctor.Doctor_ID if doctor else None
#             doctor_shortname = doctor.ShortName if doctor else None
#             doctor_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None
#             patientcategory = registration_details.PatientCategory if registration_details else None
#             address = f"{patient.DoorNo} {patient.Street} {patient.Area} {patient.City} {patient.District} {patient.State} {patient.Country} {patient.Pincode}".strip() if patient else None
#             City = patient.City if patient else None
#             State = patient.State if patient else None
#             Area = patient.Area if patient else None
#             Pincode = patient.Pincode if patient else None
#             visitId = None
#             if registration_details.IsReferral == 'Yes' and radiology_request.RegisterType == 'IP':
#                 refins = Patient_Referral_Detials.objects.get(IP_Register_Id=registration_details.pk)
#                 doctor_id = refins.ReferredBy.Doctor_ID
#                 doctor_name = f"{refins.ReferredBy.Tittle.Title_Name}. {refins.ReferredBy.First_Name} {refins.ReferredBy.Middle_Name} {refins.ReferredBy.Last_Name}".strip() if refins.ReferredBy else None

#             radiologydetails = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=radiology_request.RegisterType, Status='Request')
#             for ind, rad in enumerate(radiologydetails, start=1):
#                 testname = TestName_Details.objects.get(Test_Code=rad.SubTestCode)
#                 radiologyname = RadiologyNames_Details.objects.get(Radiology_Id=rad.TestCode)
#                 if radiologyname and testname:

#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='RADIOLOGY',
#                         Patient_Type=registration_details.PatientCategory
#                     ).first()

#                     print(Discount,'Discount for Radiology')

#                     RadDiscount = None

#                     if Discount:
#                         RadDiscount = Discount_Radiology_Fee.objects.filter(
#                             discount__Discount_ID=Discount.Discount_ID,
#                             Radiology_Test_Id__Room_Id__Test_Code=testname.Test_Code
#                         ).first()
#                         print(RadDiscount, 'RadDiscount')

#                         rate = testname.Amount if testname else 0
#                         final_rate = rate  
#                         discount_amount = 0  

#                         discount_type = RadDiscount.discount_method if RadDiscount else None
#                         discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

#                         discount_amount = 0
#                         final_rate = rate

#                         if discount_type and discount_value:
#                             if discount_type.lower() == "percentage":
#                                 discount_amount = (rate * discount_value) / 100
#                                 final_rate = rate - discount_amount
#                                 discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                 Discountmethod = 'PERCENTAGE'
#                             elif discount_type.lower() == "flat":
#                                 discount_amount = discount_value
#                                 final_rate = rate - discount_amount
#                                 discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                 Discountmethod = 'FLATAMOUNT'


#                             # format discount amount nicely
#                             discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                         else:
#                             discount_value_display = "-"
#                             discount_amount_display = "-"
                        
#                         radlist = {
#                         'S_No': ind,
#                         'request_id': rad.pk,
#                         'ServiceType': 'Radiology',
#                         'Test_Code': radiologyname.Radiology_Id,
#                         'SelectItemName': f"{radiologyname.Radiology_Name}({testname.Test_Name})",
#                         'TestCode': testname.Test_Code,
#                         'TestName': testname.Test_Name,
#                         'BookingFees': testname.BookingFees,
#                         'Charges': testname.Amount,
#                         'Amount': testname.Amount,
#                         'Total': testname.Amount,
#                         'NetAmount': round(final_rate, 2),
#                         'Quantity': 1,
#                         "DiscountType": discount_value_display,
#                         'Discount': discount_value if discount_value else '-',
#                         'Discountamt' : discount_amount_display,
#                         'Finalrate': round(final_rate, 2),
#                         'Discountmethod' : Discountmethod,
#                         'Discountval' : discount_value,
#                         "GST_per": "",
#                         "GST": "",
#                         "DiscountAmount": "",
#                         "isReimbursable": "No",
#                     }
#                         radiologytestlist.append(radlist)

#                     else:

#                         radlist = {
#                             'S_No': ind,
#                             'request_id': rad.pk,
#                             'ServiceType': 'Radiology',
#                             'Test_Code': radiologyname.Radiology_Id,
#                             'SelectItemName': f"{radiologyname.Radiology_Name}({testname.Test_Name})",
#                             'TestCode': testname.Test_Code,
#                             'TestName': testname.Test_Name,
#                             'BookingFees': testname.BookingFees,
#                             'Charges': testname.Amount,
#                             'Amount': testname.Amount,
#                             'Total': testname.Amount,
#                             'NetAmount': testname.Amount,
#                             'Quantity': 1,
#                             "DiscountType": "",
#                             "Discount": "",
#                             "GST_per": "",
#                             "GST": "",
#                             "DiscountAmount": "",
#                             "isReimbursable": "No",
#                         }
#                         radiologytestlist.append(radlist)

#             room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=registration_details.Registration_Id).last()
#             ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#             bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

#             response_data.append({
#                 'id': index,
#                 'PatientId': patient_id,
#                 'VisitId': visitId,
#                 'RegistrationId': registration_id,
#                 'Patient_Name': patient_name,
#                 'PhoneNo': phone_number,
#                 'DoctorId': doctor_id,
#                 'DoctorShortName': doctor_shortname,
#                 'Doctor_ShortName': doctor_name,
#                 'RegisterType': radiology_request.RegisterType,
#                 'gender': patient_gender,
#                 'Status': radiology_request.Status,
#                 'AgeGender': f'{patient_age}/{patient_gender}',
#                 'VisitPurpose': 'RADIOLOGY',
#                 'BillingType': 'RADIOLOGY',
#                 'VisitType': radiology_request.RegisterType,
#                 'PatientCategory': patientcategory,
#                 'Address': address,
#                 'City': City,
#                 'State': State,
#                 'Area': Area,
#                 'Pincode': Pincode,
#                 'Date': datetime.now().date(),
#                 'ServiceProcedureForm': 'RADIOLOGY',
#                 'radiologytestlist': radiologytestlist,
#                 'WardName': ward_name,
#                 'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,
#                 'AdmittionDate': radiology_request.IP_Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p') if radiology_request.IP_Register_Id else None,
#             })
#             index += 1

#         if Status is not None:
#             return response_data
#         else:
#             return JsonResponse(response_data, safe=False)

#     except Exception as e:
#         print(f"Exception: {e}")
#         return JsonResponse({'error': str(e)}, status=500)


def get_rad_request_details(request, Status=None, date_filters=None):
    try:
        # Build search query
        search_query = Q(Status='Request', RegisterType__in=['IP'])
        discount_value_display = None
        Discountmethod = None
        # Apply date filters
        if date_filters:
            if date_filters['DateType'] == "Current" and date_filters['CurrentDate']:
                try:
                    current_date = datetime.strptime(date_filters['CurrentDate'], '%Y-%m-%d').date()
                    search_query &= Q(created_at__date=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
            elif date_filters['DateType'] == "Customize":
                try:
                    if date_filters['FromDate'] and date_filters['ToDate']:
                        from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
                        to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__range=[from_date, to_date])
                    elif date_filters['FromDate']:
                        from_date = datetime.strptime(date_filters['FromDate'], '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__gte=from_date)
                    elif date_filters['ToDate']:
                        to_date = datetime.strptime(date_filters['ToDate'], '%Y-%m-%d').date()
                        search_query &= Q(created_at__date__lte=to_date)
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        queryset = Radiology_Request_Details.objects.filter(search_query)

        response_data = []
        seen_registration_ids = set()
        index = 1

        for radiology_request in queryset:
            radiologytestlist = []
            registration_id = None
            registration_details = None
            if radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
                registration_id = radiology_request.IP_Register_Id.Registration_Id
                registration_details = radiology_request.IP_Register_Id

            if not registration_id or registration_id in seen_registration_ids:
                continue

            seen_registration_ids.add(registration_id)

            patient = registration_details.PatientId if registration_details else None
            doctor = registration_details.PrimaryDoctor if registration_details else None

            patient_id = patient.PatientId if patient else None
            patient_age = patient.Age if patient else None
            patient_gender = patient.Gender if patient else None
            patient_name = f"{patient.Title.Title_Name or ''} {patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None
            phone_number = patient.PhoneNo if patient else None
            doctor_id = doctor.Doctor_ID if doctor else None
            doctor_shortname = doctor.ShortName if doctor else None
            doctor_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip() if doctor else None
            patientcategory = registration_details.PatientCategory if registration_details else None
            address = f"{patient.DoorNo} {patient.Street} {patient.Area} {patient.City} {patient.District} {patient.State} {patient.Country} {patient.Pincode}".strip() if patient else None
            City = patient.City if patient else None
            State = patient.State if patient else None
            Area = patient.Area if patient else None
            Pincode = patient.Pincode if patient else None
            visitId = None
            if registration_details.IsReferral == 'Yes' and radiology_request.RegisterType == 'IP':
                refins = Patient_Referral_Detials.objects.get(IP_Register_Id=registration_details.pk)
                doctor_id = refins.ReferredBy.Doctor_ID
                doctor_name = f"{refins.ReferredBy.Tittle.Title_Name}. {refins.ReferredBy.First_Name} {refins.ReferredBy.Middle_Name} {refins.ReferredBy.Last_Name}".strip() if refins.ReferredBy else None

            radiologydetails = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=radiology_request.RegisterType, Status='Request')
            for ind, rad in enumerate(radiologydetails, start=1):
                testname = TestName_Details.objects.get(Test_Code=rad.SubTestCode)
                radiologyname = RadiologyNames_Details.objects.get(Radiology_Id=rad.TestCode)
                if radiologyname and testname:

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='RADIOLOGY',
                        Patient_Type=registration_details.PatientCategory
                    ).first()

                    print(Discount,'Discount for Radiology')

                    RadDiscount = None

                    if Discount:
                        RadDiscount = Discount_Radiology_Fee.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Radiology_Test_Id__Room_Id__Test_Code=testname.Test_Code
                        ).first()
                        print(RadDiscount, 'RadDiscount')

                        rate = testname.Amount if testname else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = RadDiscount.discount_method if RadDiscount else None
                        discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

                        discount_amount = 0
                        final_rate = rate

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'


                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                        else:
                            discount_value_display = "-"
                            discount_amount_display = "-"
                        
                        radlist = {
                        'S_No': ind,
                        'request_id': rad.pk,
                        'ServiceType': 'Radiology',
                        'Test_Code': radiologyname.Radiology_Id,
                        'SelectItemName': f"{radiologyname.Radiology_Name}({testname.Test_Name})",
                        'TestCode': testname.Test_Code,
                        'TestName': testname.Test_Name,
                        'BookingFees': testname.BookingFees,
                        'Charges': testname.Amount,
                        'Amount': testname.Amount,
                        'Total': testname.Amount,
                        'NetAmount': round(final_rate, 2),
                        'Quantity': 1,
                        "DiscountType": discount_value_display,
                        'Discount': discount_value if discount_value else '-',
                        'Discountamt' : discount_amount_display,
                        'Finalrate': round(final_rate, 2),
                        'Discountmethod' : Discountmethod,
                        'Discountval' : discount_value,
                        "GST_per": "",
                        "GST": "",
                        "DiscountAmount": "",
                        "isReimbursable": "No",
                    }
                        radiologytestlist.append(radlist)

                    else:

                        if patientcategory == 'Insurance':

                            patinsurance = registration_details.InsuranceName.Insurance_Id if registration_details.InsuranceName else None

                            insurancefee = Radiology_Insurance_Fee.objects.filter(Insurance__Insurance_Id = patinsurance, Radiology_Ratecard__Room_Id__Test_Code = testname.Test_Code).first()

                            radlist = {
                                'S_No': ind,
                                'request_id': rad.pk,
                                'ServiceType': 'Radiology',
                                'Test_Code': radiologyname.Radiology_Id,
                                'SelectItemName': f"{radiologyname.Radiology_Name}({testname.Test_Name})",
                                'TestCode': testname.Test_Code,
                                'TestName': testname.Test_Name,
                                'BookingFees': testname.BookingFees,
                                'Charges': insurancefee.Fee,
                                'Amount': insurancefee.Fee,
                                'Total': insurancefee.Fee,
                                'NetAmount': insurancefee.Fee,
                                'CGHScode' : testname.CGHS_CODE,
                                'Quantity': 1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            }
                            radiologytestlist.append(radlist)

                        else:
                            radlist = {
                                'S_No': ind,
                                'request_id': rad.pk,
                                'ServiceType': 'Radiology',
                                'Test_Code': radiologyname.Radiology_Id,
                                'SelectItemName': f"{radiologyname.Radiology_Name}({testname.Test_Name})",
                                'TestCode': testname.Test_Code,
                                'TestName': testname.Test_Name,
                                'BookingFees': testname.BookingFees,
                                'Charges': testname.Amount,
                                'Amount': testname.Amount,
                                'Total': testname.Amount,
                                'NetAmount': testname.Amount,
                                'Quantity': 1,
                                "DiscountType": "",
                                "Discount": "",
                                "GST_per": "",
                                "GST": "",
                                "DiscountAmount": "",
                                "isReimbursable": "No",
                            }
                            radiologytestlist.append(radlist)

            room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=registration_details.Registration_Id).last()
            ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
            bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': visitId,
                'RegistrationId': registration_id,
                'Patient_Name': patient_name,
                'PhoneNo': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'Doctor_ShortName': doctor_name,
                'RegisterType': radiology_request.RegisterType,
                'gender': patient_gender,
                'Status': radiology_request.Status,
                'AgeGender': f'{patient_age}/{patient_gender}',
                'VisitPurpose': 'RADIOLOGY',
                'BillingType': 'RADIOLOGY',
                'VisitType': radiology_request.RegisterType,
                'PatientCategory': patientcategory,
                'Address': address,
                'City': City,
                'State': State,
                'Area': Area,
                'Pincode': Pincode,
                'Date': datetime.now().date(),
                'ServiceProcedureForm': 'RADIOLOGY',
                'radiologytestlist': radiologytestlist,
                'WardName': ward_name,
                'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,
                'AdmittionDate': radiology_request.IP_Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p') if radiology_request.IP_Register_Id else None,
            })
            index += 1

        if Status is not None:
            return response_data
        else:
            return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Exception-- infunction: {e}")
        return JsonResponse({'error': str(e)}, status=500)



def get_rad_request_details_op(request):
    try:
        queryset = Radiology_Request_Details.objects.filter(
            Status=request.GET.get("Status"),
            RegisterType__in=['OP', 'WALK-IN'],
            OP_Register_Id__Registration_Id=request.GET.get("Registration_id", None)
        )
 
        print(queryset,'queryset')
 
        if not queryset.exists():
            print({'error': 'No records found for the given Registration ID'})
 
        response_data = {}  # Dictionary to group by RegistrationId
 
        for radiology_request in queryset:
            registration_details = None
            visitId = None
            doctor_name = None
            doctor_id = None
            date = radiology_request.created_at.date()
            docins = None
 
            if (radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'WALK-IN') and radiology_request.OP_Register_Id:
                registration_id = radiology_request.OP_Register_Id.Registration_Id
                registration_details = radiology_request.OP_Register_Id
                docins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id=radiology_request.OP_Register_Id).first()
            elif radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
                registration_id = radiology_request.IP_Register_Id.Registration_Id
                registration_details = radiology_request.IP_Register_Id
 
            # Extract patient and doctor details
 
            if (radiology_request.RegisterType == 'OP' or radiology_request.RegisterType == 'WALK-IN'):
 
                patient = registration_details.PatientId if registration_details else None
                doctor = docins.PrimaryDoctor if docins and docins.PrimaryDoctor else None
 
                patient_id = patient.PatientId if patient else None
                patient_age = patient.Age if patient else None
                patient_gender = patient.Gender if patient else None
                patient_name = f"{patient.Title.Title_Name or ''} {patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None
                phone_number = patient.PhoneNo if patient else None
                doctor_id = doctor.Doctor_ID if doctor else None
                doctor_name = f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}" if doctor else None
                patientcategory = registration_details.PatientCategory if registration_details and registration_details.PatientCategory else None
                address = f"{patient.DoorNo} {patient.Street} {patient.Area} {patient.City} {patient.District} {patient.State} {patient.Country} {patient.Pincode}" if patient else None
 
                if registration_details and registration_details.IsReferral == 'Yes':
                    refins = Patient_Referral_Detials.objects.filter(OP_Register_Id=registration_details.pk).first()
                    if refins and refins.ReferredBy:
                        doctor_id = refins.ReferredBy.Doctor_ID
                        doctor_name = f"{refins.ReferredBy.Tittle.Title_Name}. {refins.ReferredBy.First_Name} {refins.ReferredBy.Middle_Name} {refins.ReferredBy.Last_Name}"
               
                elif registration_details:
                    visitId = registration_details.VisitId if radiology_request.RegisterType in ['OP', 'WALK-IN'] else None
 
                testname = TestName_Details.objects.get(Test_Code=radiology_request.SubTestCode)
                radiologyname = RadiologyNames_Details.objects.get(Radiology_Id=radiology_request.TestCode)
               
                if registration_id not in response_data:
                    response_data[registration_id] = {
                        'PatientId': patient_id,
                        'VisitId': visitId,
                        'RegistrationId': registration_id,
                        'Patient_Name': patient_name,
                        'PhoneNo': phone_number,
                        'DoctorId': doctor_id,
                        'Doctor_ShortName': doctor_name,
                        'RegisterType': radiology_request.RegisterType,
                        'Status': radiology_request.Status,
                        'AgeGender': f'{patient_age}/{patient_gender}',
                        'VisitPurpose': 'RADIOLOGY',
                        'BillingType': 'RADIOLOGY',
                        'VisitType': radiology_request.RegisterType,
                        'PatientCategory': patientcategory,
                        'Address': address,
                        'Date': date,
                        'ServiceProcedureForm': 'RADIOLOGY',
                        'radiologytestlist': [],
                    }
 
                radiologytestlist = response_data[registration_id]['radiologytestlist']
                s_no = len(radiologytestlist) + 1  # Ensure continuous numbering
               
                if radiologyname and testname:

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='RADIOLOGY',
                        Patient_Type=registration_details.PatientCategory
                    ).first()

                    RadDiscount = None

                    if Discount:
                        RadDiscount = Discount_Radiology_Fee.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Radiology_Test_Id__Room_Id__Test_Code=testname.Test_Code
                        ).first()
                        print(RadDiscount, 'RadDiscount')

                        rate = testname.Amount if testname else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = RadDiscount.discount_method if RadDiscount else None
                        discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

                        discount_amount = 0
                        final_rate = rate

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'


                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                        else:
                            discount_value_display = "-"
                            discount_amount_display = "-"

                        radlist = {
                            'S_No': s_no,
                            'request_id': radiology_request.pk,
                            'ServiceType': 'RADIOLOGY',
                            'Test_Code': radiologyname.Radiology_Id,
                            'SelectItemName': f"{radiologyname.Radiology_Name} ({testname.Test_Name})",
                            'TestCode': testname.Test_Code,
                            'TestName': testname.Test_Name,
                            'BookingFees': testname.BookingFees,
                            'Charges': testname.Amount,
                            'Amount': testname.Amount,
                            'Total': testname.Amount,
                            'NetAmount': round(final_rate, 2),
                            'Quantity': 1,
                            "DiscountType": discount_value_display,
                            'Discount': discount_value if discount_value else '-',
                            'Discountamt' : discount_amount_display,
                            'Finalrate': round(final_rate, 2),
                            'Discountmethod' : Discountmethod,
                            'Discountval' : discount_value,
                            "GST_per": "",
                            "GST": "",
                            "DiscountAmount": "",
                            "isReimbursable": "No",
                        }
                        radiologytestlist.append(radlist)

                    else:
                        radlist = {
                            'S_No': s_no,
                            'request_id': radiology_request.pk,
                            'ServiceType': 'RADIOLOGY',
                            'Test_Code': radiologyname.Radiology_Id,
                            'SelectItemName': f"{radiologyname.Radiology_Name} ({testname.Test_Name})",
                            'TestCode': testname.Test_Code,
                            'TestName': testname.Test_Name,
                            'BookingFees': testname.BookingFees,
                            'Charges': testname.Amount,
                            'Amount': testname.Amount,
                            'Total': testname.Amount,
                            'NetAmount': testname.Amount,
                            'Quantity': 1,
                            "DiscountType": "",
                            "Discount": "",
                            "GST_per": "",
                            "GST": "",
                            "DiscountAmount": "",
                            "isReimbursable": "No",
                        }
                        radiologytestlist.append(radlist)
 
         
        return JsonResponse(list(response_data.values()), safe=False)
       
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 


@csrf_exempt
@require_http_methods(["GET"])
def get_radiology_test_name_for_patient(request):
 
    if request.method == 'GET':
 
        try:
 
            registerid = request.GET.get('RegistrationId')
 
            patientins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registerid).first()
 
            testins = Radiology_Request_Details.objects.filter(OP_Register_Id__Registration_Id=registerid,Status="Request")
 
            radiologytestlist = []
 
            s_no = 0
            for datas in testins:
 
                s_no = s_no + 1
 
                testname = TestName_Details.objects.get(Test_Code=datas.SubTestCode)
                radiologyname = RadiologyNames_Details.objects.get(Radiology_Id=datas.TestCode)
 
                radlist = {
                        'S_No': s_no,
                        'request_id': datas.pk,
                        'ServiceType': 'Radiology',
                        'Test_Code': radiologyname.Radiology_Id,
                        'SelectItemName': f"{radiologyname.Radiology_Name} ({testname.Test_Name})",
                        'TestCode': testname.Test_Code,
                        'TestName': testname.Test_Name,
                        'BookingFees': testname.BookingFees,
                        'Charges': testname.Amount,
                        'Amount': testname.Amount,
                        'Total': testname.Amount,
                        'NetAmount': testname.Amount,
                        'Quantity': 1,
                        "DiscountType": "",
                        "Discount": "",
                        "GST_per": "",
                        "GST": "",
                        "DiscountAmount": "",
                        "isReimbursable": "No",
                    }
                radiologytestlist.append(radlist)
 
 
 
 
            print(testins,'testins')
 
 
            return JsonResponse(radiologytestlist,safe=False)
 
 
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def get_radiology_test_name_for_IPPatient(request):
 
    if request.method == 'GET':
 
        try:
 
            registerid = request.GET.get('RegistrationId')
 
            patientins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registerid).first()
 
            testins = Radiology_Request_Details.objects.filter(IP_Register_Id__Registration_Id=registerid,Status="Request")
 
            radiologytestlist = []
 
            s_no = 0
            for datas in testins:
 
                s_no = s_no + 1
 
                testname = TestName_Details.objects.get(Test_Code=datas.SubTestCode)
                radiologyname = RadiologyNames_Details.objects.get(Radiology_Id=datas.TestCode)
 
                radlist = {
                        'S_No': s_no,
                        'request_id': datas.pk,
                        'ServiceType': 'Radiology',
                        'Test_Code': radiologyname.Radiology_Id,
                        'SelectItemName': f"{radiologyname.Radiology_Name} ({testname.Test_Name})",
                        'TestCode': testname.Test_Code,
                        'TestName': testname.Test_Name,
                        'BookingFees': testname.BookingFees,
                        'Charges': testname.Amount,
                        'Amount': testname.Amount,
                        'Total': testname.Amount,
                        'NetAmount': testname.Amount,
                        'Quantity': 1,
                        "DiscountType": "",
                        "Discount": "",
                        "GST_per": "",
                        "GST": "",
                        "DiscountAmount": "",
                        "isReimbursable": "No",
                    }
                radiologytestlist.append(radlist)
 
 
 
 
            print(testins,'testins')
 
 
            return JsonResponse(radiologytestlist,safe=False)
 
 
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)
        



        