import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from Masters.models import *
from Inventory.models import *
from OutPatient.models import *
from django.db.models import Q
# import magic
import filetype
import base64
from django.db import transaction


import json
from collections import defaultdict


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from datetime import datetime

from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Vitals_Details_CaseSheet_All(request):
    if request.method == 'GET':
        # Extract query parameters
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        doctor_id = request.GET.get('DoctorId')
        date_type = request.GET.get('DateType', '')
        current_date = request.GET.get('CurrentDate', '')
        from_date = request.GET.get('FromDate', '')
        to_date = request.GET.get('ToDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        patient_id = request.GET.get('PatientId', '')

        # Initialize query
        search_query = Q()

        # Date filtering
        if date_type == "All":
            pass
        elif date_type == "Current" and current_date:
            try:
                current_date_dt = datetime.strptime(current_date, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date_dt)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
        elif date_type == "Customize":
            try:
                if from_date and to_date:
                    from_date_dt = datetime.strptime(from_date, '%Y-%m-%d').date()
                    to_date_dt = datetime.strptime(to_date, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[from_date_dt, to_date_dt])
                else:
                    return JsonResponse({'error': 'FromDate and ToDate are required for Customize.'}, status=400)
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid or missing DateType.'}, status=400)



        # Additional filters
        if registration_id:
            search_query &= Q(Registration_Id=registration_id)
        if visit_id:
            search_query &= Q(Visit_Id=visit_id)
        if doctor_id:
            search_query &= Q(Doctor__Doctor_ID=doctor_id)
        if patient_id:
            search_query &= Q(Registration_Id__PatientId__PatientId=patient_id)



        # Query the database
        vital_details = Patient_Vital_Details.objects.filter(search_query)

        # Serialize results
        vital_details_data = []
        for idx, vital in enumerate(vital_details, start=1):
            vital_dict = {
                'id': idx,
                'Temperature': vital.Temperature,
                'temperature_status': vital.Temperature_Status,
                'PulseRate': vital.Pulse_Rate,
                'SPO2': vital.SPO2,
                'spo2_status': vital.SPO2_Status,
                'HeartRate': vital.Heart_Rate,
                'heartrate_status': vital.Heart_Rate_Status,
                'RespiratoryRate': vital.Respiratory_Rate,
                'RespiratoryStatus': vital.Respiratory_Status,
                'SBP': vital.SBP,
                'sbp_status': vital.SBP_Status,
                'DBP': vital.DBP,
                'Height': vital.Height,
                'Weight': vital.Weight,
                'BMI': vital.BMI,
                'WC': vital.WC,
                'HC': vital.HC,
                'BSL': vital.BSL,
                'Painscore': vital.Painscore,
                'SupplementalOxygen': vital.SupplementalOxygen,
                'SupplementalOxygen_status': vital.SupplementalOxygen_Status,
                'LevelOfConsiousness': vital.LevelOfConsiousness,
                'LevelOfConsiousness_Status': vital.LevelOfConsiousness_Status,
                'CapillaryRefillTime': vital.CapillaryRefillTime,
                'CapillaryRefillTime_Status': vital.CapillaryRefillTime_Status,
                'Type': vital.Type,
                'Date': vital.created_at.strftime('%d-%m-%y'),
                'Time': vital.created_at.strftime('%H:%M:%S'),
            }
            vital_details_data.append(vital_dict)



        # Return response
        if not vital_details_data:
            return JsonResponse({'message': 'No records found', 'data': []}, status=200)
        return JsonResponse(vital_details_data, safe=False, status=200)

    # Handle unsupported methods
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_GeneralEvaluation_Details_All(request):

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

        def compress_image(image, min_quality=50, step=5):
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

    if request.method == 'GET':
      try:
        def get_file_image(filedata):
            kind = filetype.guess(filedata)
            contenttype1 = 'application/pdf'  # default MIME
            if kind:
                if kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind.mime == 'image/png':
                    contenttype1 = 'image/png'
            return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

        
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        doctor_id = request.GET.get('DoctorId')
        date_type = request.GET.get('DateType', '')
        current_date = request.GET.get('CurrentDate', '')
        from_date = request.GET.get('FromDate', '')
        to_date = request.GET.get('ToDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        patient_id = request.GET.get('PatientId', '')

        search_query = Q()

        if date_type == "All":
            pass
        elif date_type == "Current" and current_date:
            try:
                current_date_dt = datetime.strptime(current_date, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date_dt)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
        elif date_type == "Customize":
            try:
                if from_date and to_date:
                    from_date_dt = datetime.strptime(from_date, '%Y-%m-%d').date()
                    to_date_dt = datetime.strptime(to_date, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[from_date_dt, to_date_dt])
                else:
                    return JsonResponse({'error': 'FromDate and ToDate are required for Customize.'}, status=400)
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid or missing DateType.'}, status=400)


        
        if doctor_id:
            search_query &= Q(Doctor__Doctor_ID=doctor_id)
        if patient_id:
            search_query &= Q(Registration_Id__PatientId__PatientId=patient_id)
        

        

        # Get evaluations
        evaluations = Workbench_GeneralEvaluation.objects.filter(search_query)

        evaluation_data = []
        for idx, eval in enumerate(evaluations, start=1):
            reg_id = ''
            if eval.Registration_Id:
                reg_id = eval.Registration_Id.Registration_Id
            elif eval.IpRegistration_Id:
                reg_id = eval.IpRegistration_Id.Registration_Id

            evaluation_data.append({
                'sno': idx,
                'id': eval.Id,
                'RegistrationId': reg_id,
                'KeyComplaint': eval.KeyComplaint,
                'cheifComplaint': eval.CheifComplaint,
                'History': eval.History,
                'Examine': eval.Examine,
                'Diagnosis': eval.Diagnosis,
                'SearchICDCode': eval.ICDCode,
                'SearchDescription': eval.ICDCode_Description,
                'SearchDiagnosis': eval.ICDCode_Diagnosis,
                'ChooseDocument': get_file_image(eval.ChooseDocument) if eval.ChooseDocument else None,
                'currentAnnotation': get_file_image(eval.AnnotationDocument) if eval.AnnotationDocument else None,
                'DiseaseDetails': eval.DiseaseDetails,
                'created_by': eval.created_by,
                'Type': eval.Type,
                'Date': eval.created_at.strftime('%Y-%m-%d'),
                'Time': eval.created_at.strftime('%H:%M:%S'),
            })



        return JsonResponse(evaluation_data, safe=False)

      except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Radiology_Details_CaseSheet_All(request):
    if request.method == 'GET':

        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        doctor_id = request.GET.get('DoctorId')
        date_type = request.GET.get('DateType', '')
        current_date = request.GET.get('CurrentDate', '')
        from_date = request.GET.get('FromDate', '')
        to_date = request.GET.get('ToDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        patient_id = request.GET.get('PatientId', '')
        
        search_query = Q()

        # Date filtering
        if date_type == "All":
            pass
        elif date_type == "Current" and current_date:
            try:
                current_date_dt = datetime.strptime(current_date, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date_dt)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
        elif date_type == "Customize":
            try:
                if from_date and to_date:
                    from_date_dt = datetime.strptime(from_date, '%Y-%m-%d').date()
                    to_date_dt = datetime.strptime(to_date, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[from_date_dt, to_date_dt])
                else:
                    return JsonResponse({'error': 'FromDate and ToDate are required for Customize.'}, status=400)
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid or missing DateType.'}, status=400)



        if doctor_id:
            search_query &= Q(Doctorid__Doctor_ID=doctor_id)
        if patient_id:
            search_query &= Q(OP_Register_Id__PatientId__PatientId=patient_id)



        # Retrieve lab details matching criteria
        radiology_details = Radiology_Request_Details.objects.filter(
          search_query
        )

        if not radiology_details.exists():
            return JsonResponse({'warn': 'No radiology details found'})

        response_data = []
        index = 1
        for req in radiology_details:
            testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
            radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
            
            if radiologyname and testname:
                response_data.append({
                    'id': index,
                    'RadiologyName': radiologyname.Radiology_Name,
                    'TestName': testname.Test_Name,
                })
                index += 1

        
        return JsonResponse(response_data, safe=False)

    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Lab_Details_CaseSheet_All(request):
    if request.method == 'GET':

        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        doctor_id = request.GET.get('DoctorId')
        date_type = request.GET.get('DateType', '')
        current_date = request.GET.get('CurrentDate', '')
        from_date = request.GET.get('FromDate', '')
        to_date = request.GET.get('ToDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        patient_id = request.GET.get('PatientId', '')


        search_query = Q()

        if date_type == "All":
            pass
        elif date_type == "Current" and current_date:
            try:
                current_date_dt = datetime.strptime(current_date, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date_dt)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
        elif date_type == "Customize":
            try:
                if from_date and to_date:
                    from_date_dt = datetime.strptime(from_date, '%Y-%m-%d').date()
                    to_date_dt = datetime.strptime(to_date, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[from_date_dt, to_date_dt])
                else:
                    return JsonResponse({'error': 'FromDate and ToDate are required for Customize.'}, status=400)
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid or missing DateType.'}, status=400)

        if doctor_id:
            search_query &= Q(Doctor__Doctor_ID=doctor_id)
        if patient_id:
            search_query &= Q(OP_Register_Id__PatientId__PatientId=patient_id)


 
        # Filter Lab_Request_Details for OP registration, matching Registration_Id and VisitId
        lab_requests = Lab_Request_Details.objects.filter(
            search_query
        ).select_related('OP_Register_Id', 'Location')
 
        if not lab_requests.exists():
            return JsonResponse({'warn': 'No lab details found'}, status=404)
 
        response_data = []
        index = 1
 
        # Iterate through each lab request and fetch related items
        for lab_request in lab_requests:
            # Get all related Lab_Request_Items_Details
            lab_items = lab_request.lab_request_items.select_related(
                'Test_Code', 'Group_Code', 'Package_Code', 'Department_Code', 'SubDepartment_Code'
            ).all()
 
            for item in lab_items:
                test_code = item.Test_Code
                group_code = item.Group_Code
                package_code = item.Package_Code
 
                # Base item data
                item_data = {
                    'id': index,
                    'RegisterType': lab_request.RegisterType,
                    'RequestId': lab_request.Request_Id,
                    'TestType': item.TestType,
                    'Department': item.Department_Code.Department_Name if item.Department_Code else None,
                    'SubDepartment': item.SubDepartment_Code.SubDepartment_Name if item.SubDepartment_Code else None,
                    'ServiceStatus': item.Service_Status,
                    'AnalysisStatus': item.Analysis_Status,
                    'VerifyStatus': item.Verify_Status,
                    'ApproveStatus': item.Approve_Status
                }
 
                # Handle Individual Test
                if test_code:
                    item_data.update({
                        'TestCode': test_code.Test_Code,
                        'TestName': test_code.Test_Name,
                        'TestCategory': test_code.Test_Category,
                        'IsSubTest': test_code.IsSubTest,
                        'SubTestCodes': test_code.SubTestCodes
                    })
 
                # Handle Group
                elif group_code:
                    item_data.update({
                        'GroupCode': group_code.Group_Code,
                        'GroupName': group_code.Group_Name,
                        'TestCategory': group_code.Test_Category,
                        'LogicalCategory': group_code.Logical_Category
                    })
 
                # Handle Package
                elif package_code:
                    item_data.update({
                        'PackageCode': package_code.package_code,
                        'PackageName': package_code.package_name,
                        'TestCategory': package_code.test_category,
                        'LogicalCategory': package_code.logical_category
                    })
                    # Fetch tests or groups in the package from OfferPackageList
                    package_items = OfferPackageList.objects.filter(
                        package_code=package_code.package_code
                    ).select_related('Test_Code', 'Group_Code')
                    package_tests = []
                    for pkg_item in package_items:
                        pkg_test = {}
                        if pkg_item.Test_Code:
                            pkg_test = {
                                'TestCode': pkg_item.Test_Code.Test_Code,
                                'TestName': pkg_item.Test_Code.Test_Name,
                                'IsSubTest': pkg_item.IssubTest,
                                'SubTestCodes': pkg_item.SubTestCodes
                            }
                        elif pkg_item.Group_Code:
                            pkg_test = {
                                'GroupCode': pkg_item.Group_Code.Group_Code,
                                'GroupName': pkg_item.Group_Code.Group_Name
                            }
                        if pkg_test:
                            package_tests.append(pkg_test)
                    item_data['PackageTests'] = package_tests
 
                response_data.append(item_data)
                index += 1
 


        return JsonResponse(response_data, safe=False)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Prescription_Details_CaseSheet_All(request):
    if request.method == 'GET':
        
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        doctor_id = request.GET.get('DoctorId')
        date_type = request.GET.get('DateType', '')
        current_date = request.GET.get('CurrentDate', '')
        from_date = request.GET.get('FromDate', '')
        to_date = request.GET.get('ToDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        patient_id = request.GET.get('PatientId', '')

        search_query = Q()

        if date_type == "All":
            pass
        elif date_type == "Current" and current_date:
            try:
                current_date_dt = datetime.strptime(current_date, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date_dt)
            except ValueError:
                return JsonResponse({'error': 'Invalid CurrentDate format. Use YYYY-MM-DD.'}, status=400)
        elif date_type == "Customize":
            try:
                if from_date and to_date:
                    from_date_dt = datetime.strptime(from_date, '%Y-%m-%d').date()
                    to_date_dt = datetime.strptime(to_date, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[from_date_dt, to_date_dt])
                else:
                    return JsonResponse({'error': 'FromDate and ToDate are required for Customize.'}, status=400)
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid or missing DateType.'}, status=400)

        if doctor_id:
            search_query &= Q(behalfofdoc__Doctor_ID=doctor_id)
        if patient_id:
            search_query &= Q(OP_Register_Id__PatientId__PatientId=patient_id)


        prescription_details = None
        try:
            prescription_details = OPD_Prescription_Details.objects.filter(
                search_query
            )
        except Exception as e :
            print('error : ',e)    
        
        
        # print('fahat--',fahat)
        print('prescription details--',prescription_details)
        
        if not prescription_details.exists():
            return JsonResponse({'warn': 'No prescription details found'})
        
        prescription_list = []
        index = 1
        first_detail = prescription_details.first()  # Fetch the first detail once

        for detail in prescription_details:
            
            prescription_data = {
                'Id': index,
                'Registration_Id': first_detail.Registration_Id.pk,
                'Patient_Id': detail.Registration_Id.PatientId.PatientId if detail.Patient_Id else '',
                'VisitId': detail.VisitId,
                # 'DoctorShortName': first_detail.Registration_Id.PrimaryDoctor.ShortName,
                # 'DoctorShortName': first_detail.Registration_Id.PrimaryDoctor.ShortName if first_detail.Registration_Id.PrimaryDoctor and first_detail.Registration_Id.PrimaryDoctor.ShortName else "No Primary Doctor",
                'ItemId': detail.ItemId.pk if detail.ItemId else None,
                'ItemType': detail.ItemId.ProductType.ProductType_Name if detail.ItemId else None,
                'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                'FrequencyId': detail.FrequencyId.pk if detail.FrequencyId else None,
                'FrequencyName': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                'FrequencyType': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                'Frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                'Prescription_Id': detail.Prescription_Id,
                'Dosage': detail.Dosage,
                'Route': detail.Route,
                'DurationNumber': detail.DurationNumber,
                'DurationUnit': detail.DurationUnit,
                'Frequencys': detail.Frequency,
                'Qty': detail.Qty,
                'Instruction': detail.Instruction,
                'created_by': detail.created_by,
                'Status': detail.Status,
                'Date': detail.created_at.strftime('%Y-%m-%d'),
                'Time': detail.created_at.strftime('%H:%M:%S'),
            }
            index += 1
            prescription_list.append(prescription_data)
        

        return JsonResponse(prescription_list, safe=False)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required

from django.core.exceptions import ObjectDoesNotExist

def get_file_image(file):
    """Helper function to convert file to a URL or base64 if needed."""
    if file and hasattr(file, 'url'):
        return file.url
    return None

@csrf_exempt
@require_http_methods(["GET"])
def get_past_casesheets_details_for_doctor(request):
    try:


        if request.method == 'GET':

            PatientId = request.GET.get('PatientId')
            DoctorId = request.GET.get('DoctorId')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            ParticularDate = request.GET.get('ParticularDate')

            casesheetlist = {'casesheets': []}


            # Fetch visits with related data
            visits = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__VisitPurpose='OP',
                Registration_Id__PatientId__PatientId = PatientId
            ).select_related('Registration_Id', 'PrimaryDoctor').order_by('-created_at')[:10]

            if DoctorId:

                visits = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id__VisitPurpose='OP',
                    Registration_Id__PatientId__PatientId = PatientId,
                    PrimaryDoctor__Doctor_ID = DoctorId

                ).select_related('Registration_Id', 'PrimaryDoctor').order_by('-created_at')

            for visit in visits:
                visit_data = {
                    'Registration_Id': visit.Registration_Id.Registration_Id,
                    'DoctorName' : f"""{visit.PrimaryDoctor.Tittle.Title_Name}.{visit.PrimaryDoctor.First_Name}""",
                    'Speciality' : visit.Specialization.Speciality_Name,
                    'OPDate' : visit.created_at.strftime('%d-%m-%y'),
                    'vitals': [],
                    'evaluations': [],
                    'radiology': [],
                    'lab_requests': [],
                    'prescriptions': [],
                }

                # Vital Details
                vital_details = Patient_Vital_Details.objects.filter(
                    Registration_Id__Registration_Id=visit.Registration_Id.Registration_Id,
                    Doctor__Doctor_ID=visit.PrimaryDoctor.Doctor_ID
                ).select_related('Registration_Id', 'Doctor')

                for idx, vital in enumerate(vital_details, start=1):
                    vital_dict = {
                        'id': idx,
                        'Temperature': vital.Temperature,
                        'temperature_status': vital.Temperature_Status,
                        'PulseRate': vital.Pulse_Rate,
                        'SPO2': vital.SPO2,
                        'spo2_status': vital.SPO2_Status,
                        'HeartRate': vital.Heart_Rate,
                        'heartrate_status': vital.Heart_Rate_Status,
                        'RespiratoryRate': vital.Respiratory_Rate,
                        'RespiratoryStatus': vital.Respiratory_Status,
                        'SBP': vital.SBP,
                        'sbp_status': vital.SBP_Status,
                        'DBP': vital.DBP,
                        'Height': vital.Height,
                        'Weight': vital.Weight,
                        'BMI': vital.BMI,
                        'WC': vital.WC,
                        'HC': vital.HC,
                        'BSL': vital.BSL,
                        'Painscore': vital.Painscore,
                        'SupplementalOxygen': vital.SupplementalOxygen,
                        'SupplementalOxygen_status': vital.SupplementalOxygen_Status,
                        'LevelOfConsiousness': vital.LevelOfConsiousness,
                        'LevelOfConsiousness_Status': vital.LevelOfConsiousness_Status,
                        'CapillaryRefillTime': vital.CapillaryRefillTime,
                        'CapillaryRefillTime_Status': vital.CapillaryRefillTime_Status,
                        'Type': vital.Type,
                        'Date': vital.created_at.strftime('%Y-%m-%d'),
                        'Time': vital.created_at.strftime('%H:%M:%S'),
                    }
                    visit_data['vitals'].append(vital_dict)

                # General Evaluations
                evaluations = Workbench_GeneralEvaluation.objects.filter(
                    Registration_Id__Registration_Id=visit.Registration_Id.Registration_Id,
                    Doctor__Doctor_ID=visit.PrimaryDoctor.Doctor_ID
                ).select_related('Registration_Id', 'Doctor')

                for idx, eval in enumerate(evaluations, start=1):
                    reg_id = ''
                    if eval.Registration_Id:
                        reg_id = eval.Registration_Id.Registration_Id
                    elif eval.IpRegistration_Id:
                        reg_id = eval.IpRegistration_Id.Registration_Id

                    evaluation_dict = {
                        'sno': idx,
                        'id': eval.Id,
                        'RegistrationId': reg_id,
                        'KeyComplaint': eval.KeyComplaint,
                        'cheifComplaint': eval.CheifComplaint,
                        'History': eval.History,
                        'Examine': eval.Examine,
                        'Diagnosis': eval.Diagnosis,
                        'SearchICDCode': eval.ICDCode,
                        'SearchDescription': eval.ICDCode_Description,
                        'SearchDiagnosis': eval.ICDCode_Diagnosis,
                        'ChooseDocument': get_file_image(eval.ChooseDocument) if eval.ChooseDocument else None,
                        'currentAnnotation': get_file_image(eval.AnnotationDocument) if eval.AnnotationDocument else None,
                        'DiseaseDetails': eval.DiseaseDetails,
                        'created_by': eval.created_by,
                        'Type': eval.Type,
                        'Date': eval.created_at.strftime('%Y-%m-%d'),
                        'Time': eval.created_at.strftime('%H:%M:%S'),
                    }
                    visit_data['evaluations'].append(evaluation_dict)

                # Radiology Requests
                radiology_details = Radiology_Request_Details.objects.filter(
                    OP_Register_Id__Registration_Id=visit.Registration_Id.Registration_Id,
                    Doctorid__Doctor_ID=visit.PrimaryDoctor.Doctor_ID
                ).select_related('OP_Register_Id', 'Doctorid')

                for idx, req in enumerate(radiology_details, start=1):
                    testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
                    radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()

                    if radiologyname and testname:
                        radiology_dict = {
                            'id': idx,
                            'RadiologyName': radiologyname.Radiology_Name,
                            'TestName': testname.Test_Name,
                        }
                        visit_data['radiology'].append(radiology_dict)

                # Lab Requests
                lab_requests = Lab_Request_Details.objects.filter(
                    OP_Register_Id__Registration_Id=visit.Registration_Id.Registration_Id,
                    Doctor__Doctor_ID=visit.PrimaryDoctor.Doctor_ID
                ).select_related('OP_Register_Id', 'Doctor').prefetch_related('lab_request_items')

                for lab_request in lab_requests:
                    lab_items = lab_request.lab_request_items.select_related(
                        'Test_Code', 'Group_Code', 'Package_Code', 'Department_Code', 'SubDepartment_Code'
                    ).all()

                    for idx, item in enumerate(lab_items, start=1):
                        item_data = {
                            'id': idx,
                            'RegisterType': lab_request.RegisterType,
                            'RequestId': lab_request.Request_Id,
                            'TestType': item.TestType,
                            'Department': item.Department_Code.Department_Name if item.Department_Code else None,
                            'SubDepartment': item.SubDepartment_Code.SubDepartment_Name if item.SubDepartment_Code else None,
                            'ServiceStatus': item.Service_Status,
                            'AnalysisStatus': item.Analysis_Status,
                            'VerifyStatus': item.Verify_Status,
                            'ApproveStatus': item.Approve_Status,
                        }

                        if item.Test_Code:
                            item_data.update({
                                'TestCode': item.Test_Code.Test_Code,
                                'TestName': item.Test_Code.Test_Name,
                                'TestCategory': item.Test_Code.Test_Category,
                                'IsSubTest': item.Test_Code.IsSubTest,
                                'SubTestCodes': item.Test_Code.SubTestCodes,
                            })
                        elif item.Group_Code:
                            item_data.update({
                                'GroupCode': item.Group_Code.Group_Code,
                                'GroupName': item.Group_Code.Group_Name,
                                'TestCategory': item.Group_Code.Test_Category,
                                'LogicalCategory': item.Group_Code.Logical_Category,
                            })
                        elif item.Package_Code:
                            item_data.update({
                                'PackageCode': item.Package_Code.package_code,
                                'PackageName': item.Package_Code.package_name,
                                'TestCategory': item.Package_Code.test_category,
                                'LogicalCategory': item.Package_Code.logical_category,
                            })
                            package_items = OfferPackageList.objects.filter(
                                package_code=item.Package_Code.package_code
                            ).select_related('Test_Code', 'Group_Code')
                            package_tests = [
                                {
                                    'TestCode': pkg_item.Test_Code.Test_Code,
                                    'TestName': pkg_item.Test_Code.Test_Name,
                                    'IsSubTest': pkg_item.IssubTest,
                                    'SubTestCodes': pkg_item.SubTestCodes,
                                } if pkg_item.Test_Code else {
                                    'GroupCode': pkg_item.Group_Code.Group_Code,
                                    'GroupName': pkg_item.Group_Code.Group_Name,
                                } for pkg_item in package_items if pkg_item.Test_Code or pkg_item.Group_Code
                            ]
                            item_data['PackageTests'] = package_tests

                        visit_data['lab_requests'].append(item_data)

                # Prescription Details
                prescription_details = OPD_Prescription_Details.objects.filter(
                    Registration_Id__Registration_Id=visit.Registration_Id.Registration_Id,
                    behalfofdoc__Doctor_ID=visit.PrimaryDoctor.Doctor_ID
                ).select_related('Registration_Id', 'behalfofdoc', 'ItemId', 'FrequencyId')

                for idx, detail in enumerate(prescription_details, start=1):
                    prescription_data = {
                        'Id': idx,
                        'Registration_Id': detail.Registration_Id.Registration_Id if detail.Registration_Id else None,
                        'Patient_Id': detail.Registration_Id.PatientId.PatientId if detail.Registration_Id and detail.Registration_Id.PatientId else None,
                        'VisitId': detail.VisitId,
                        'ItemId': detail.ItemId.pk if detail.ItemId else None,
                        'ItemType': detail.ItemId.ProductType.ProductType_Name if detail.ItemId and detail.ItemId.ProductType else None,
                        'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                        'FrequencyId': detail.FrequencyId.pk if detail.FrequencyId else None,
                        'FrequencyName': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                        'FrequencyType': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                        'Frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                        'Prescription_Id': detail.Prescription_Id,
                        'Dosage': detail.Dosage,
                        'Route': detail.Route,
                        'DurationNumber': detail.DurationNumber,
                        'DurationUnit': detail.DurationUnit,
                        'Frequencys': detail.Frequency,
                        'Qty': detail.Qty,
                        'Instruction': detail.Instruction,
                        'created_by': detail.created_by,
                        'Status': detail.Status,
                        'Date': detail.created_at.strftime('%Y-%m-%d'),
                        'Time': detail.created_at.strftime('%H:%M:%S'),
                    }
                    visit_data['prescriptions'].append(prescription_data)

                casesheetlist['casesheets'].append(visit_data)

            return JsonResponse(casesheetlist, status=200)

    except Exception as e:
        import traceback
        print(f"An error occurred: {str(e)}\n{traceback.format_exc()}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



