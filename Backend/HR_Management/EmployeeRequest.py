import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Max, Q
from datetime import datetime
from datetime import timedelta, date
import random
from django.utils.dateparse import parse_datetime
import string
from PIL import Image
from io import BytesIO
from django.db import transaction
from decimal import Decimal
from Masters.models import *
from decimal import Decimal
from django.utils.dateparse import parse_time
import re
from django.utils.dateparse import parse_date
from docx import Document
import base64
import filetype
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from django.core.exceptions import ObjectDoesNotExist


# employee leave

@csrf_exempt
@require_http_methods(["GET"])
def Employee_Details(request):
    if request.method == 'GET':
        try:
            Employeeid = request.GET.get('employeeid')
            print("Employeeid:", Employeeid)
            
            if not Employeeid:
                return JsonResponse({'warn': 'EmployeeID not provided'})

            # Fetch employee details
            Employee_details = Employee_Personal_Form_Detials.objects.filter(pk=Employeeid)
            print("Employee_details:", Employee_details)

            if not Employee_details.exists():
                return JsonResponse({'warn': 'No employee details found for the provided EmployeeID'})

            # Build response data
            employee_data = []
            for emp in Employee_details:
                departmentId = ', '.join(str(department.Department_Id) for department in emp.Department.all())
                departments = ', '.join(department.Department_Name for department in emp.Department.all())
                emp_dict = {
                    'Employeeid': emp.pk,
                    'Employeename': f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name or ''} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
                    'designation': emp.Designation.Designation_Name if emp.Designation.Designation_Name else None,
                    'Designationid': emp.Designation.Designation_Id if emp.Designation.Designation_Name else None,
                    'departments' : departments,
                    'departmentId' : departmentId

                }
                employee_data.append(emp_dict)

            return JsonResponse(employee_data, safe=False, status=200)

        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error in Employee_Details: {str(e)}")  # Replace with logging in production
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    # Handle unsupported HTTP methods
    return JsonResponse({'error': 'Unsupported HTTP method'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def Employee_Leave_Details(request):
    if request.method == 'GET':
        try:
            # Extract parameters from request
            employee_id = request.GET.get('EmployeeId')
            location_id = request.GET.get('location')

            print("EmployeeId:", employee_id)
            print("LocationId:", location_id)

            # Validate required parameters
            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'})
            if not location_id:
                return JsonResponse({'warn': 'Location not provided'})

            # Fetch leave details from Current_History_Detials
            # employee_leave_details = Current_History_Detials.objects.filter(Employee__Employee_ID=employee_id).first()

            empinstance = Employee_Personal_Form_Detials.objects.filter(Employee_ID = employee_id).first()
            employee_leave_details = Employee_Leavelist.objects.filter(Employee = empinstance)
            leave_types = []

            for eld in employee_leave_details:

                datalist = {
                    "leavetype" : eld.leave_type,
                    "total":eld.leave_count
                }
                leave_types.append(datalist)


            if not employee_leave_details:
                return JsonResponse({'warn': 'No leave details found for the employee'})

            # Calculate availed leaves from Employee_Leave_Register
            leave_register = Employee_Leave_Register.objects.filter(Employee_Id__Employee=empinstance)
            print("leave_register",leave_register)

            print(leave_types,"leave_types")

            # leave_types = [
            #     # {"leavetype": "GovtLeave", "total": employee_leave_details.GovtLeave},
            #     {"leavetype": "casual", "total": employee_leave_details.CasualLeave},
            #     {"leavetype": "sick", "total": employee_leave_details.SickLeave},
            # ]

            response_data = []
            for index, leave in enumerate(leave_types, start=1):
                # Calculate availed leaves
                print(leave["leavetype"])
                availed_leave = leave_register.filter(Leave_Type=leave["leavetype"]).aggregate(
                    availed=Sum('DaysCount')
                )["availed"] or 0  # Default to 0 if no leaves availed

                # Calculate total and remaining leaves
                total_leave = int(leave["total"]) if leave["total"] else 0
                remaining_leave = max(total_leave - availed_leave, 0)  # Avoid negative remaining leaves

                # Append data to response
                response_data.append({
                    "id": index,
                    "leavetype": leave["leavetype"],
                    "Totalleave": total_leave,
                    "RemainingLeave": remaining_leave,
                    "AvailedLeave": availed_leave,
                    "Employeeid": employee_id,
                })

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Insert_Leave_Register(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data from the request body
            data = json.loads(request.body)
            print("data", data)
            
            Employeeid = data.get('employeeId', None)
            leaveType = data.get('leaveType')
            fromDate = data.get('fromDate', '')
            toDate = data.get('toDate', "")
            file = data.get('photo', "")
            fromtime = data.get('fromtime', '')
            prDate = data.get('prDate', '')
            totime = data.get('totime', '')
            timeDifference = data.get('timeDifference', '')
            days = data.get('days', 0)
            print("days",days)
            reason = data.get('reason', "")
            location = data.get('locations')
            createdby = data.get('createdby', '')
            def validate_date(date_string):
                # Check if the date format is correct
                date = parse_date(date_string)
                if date:
                    return date
                else:
                    return None  # Return None if the date is invalid or empty

            fromDate = validate_date(fromDate)
            toDate = validate_date(toDate)
            prDate = validate_date(prDate)
            try:
                days = float(days) if days else 0  # Convert to float, default to 0
            except ValueError:
                days = 0
            print("days after validation:", days)
            
            # Validate time fields
            def validate_time(time_string):
                # Check if the time string is empty or in correct format HH:MM[:ss[.uuuuuu]]
                if not time_string:
                    return None  # Return None if time is empty or invalid
                try:
                    # Try to parse time using datetime
                    time_obj = datetime.strptime(time_string, '%H:%M')
                    return time_obj.time()
                except ValueError:
                    return None  # Return None if time format is incorrect

            fromtime = validate_time(fromtime)
            totime = validate_time(totime)
            timeDifference = validate_time(timeDifference)

            # Validate employee ID
            if not Employeeid:
                return JsonResponse({'warn': "Employeeid not found"}) 

            # Validate location
            if not location:
                return JsonResponse({'warn': "Location is required"})

            # Validate designation


            # Validate Employee Instance
            try:
                Employee_instance = Current_History_Detials.objects.get(Employee=Employeeid)
                print("Employee_instance", Employee_instance) 
            except Current_History_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Employee not Found'})

            # Validate Location Instance
            try:
                location_ins = Location_Detials.objects.get(Location_Id=location)
                print('location_ins',location_ins)
            except Location_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Location not found'})

            # File processing function
            def validate_and_process_file(file):
                def get_file_type(file):
                    if file.startswith('data:application/pdf;base64'):
                        return 'application/pdf'
                    elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                        return 'image/jpeg'
                    elif file.startswith('data:image/png;base64'):
                        return 'image/png'
                    elif file.startswith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64'):
                        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # .docx
                    elif file.startswith('data:application/msword;base64'):
                        return 'application/msword'  # .doc
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

                def process_word_file(file):
                    document = Document(file)
                    num_paragraphs = len(document.paragraphs)
                    return num_paragraphs

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

                        elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
                            word_content = process_word_file(BytesIO(file_content))
                            return JsonResponse({'word_content': word_content}, status=200)

                        else:
                            return JsonResponse({'warn': 'Unsupported file format'}, status=400)

                    except Exception as e:
                        return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

            processed_files = {
                'ChooseFile': validate_and_process_file(data.get('photo')) if data.get('photo') else None,
            }
            if not timeDifference:
                timeDifference = "0"  # Default value if empty or None

    
            leave_register_instance = Employee_Leave_Register.objects.filter(
                Employee_Id=Employee_instance,
                Status='Pending',
                Leave_Type__in=['sick', 'casual']  # Add condition for specific leave types
            ).exists()

            if leave_register_instance:
                return JsonResponse({'warn': "Leave Request for 'sick' or 'casual' is already pending"})

         
            leave_register_instance = Employee_Leave_Register.objects.create(
                Employee_Id=Employee_instance,
                Leave_Type=leaveType,
                PermissionDate=prDate,
                FromDate=fromDate,
                ToDate=toDate,
                DaysCount=days,
                Medical_Certificate=processed_files['ChooseFile'],
                FromTime=fromtime,
                ToTime=totime,
                HoursCount=timeDifference,
                Reason=reason,
                Location_Name=location_ins,
                CreatedBy=createdby
            )

            # Return a successful response with the data processed
            return JsonResponse({'success': 'Leave Request successfully'}, status=200)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    # In case of other HTTP methods (like OPTIONS or GET), return a default response
    return JsonResponse({'error': 'Method not allowed'}, status=405)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from HR_Management.models import Employee_Leave_Register

@csrf_exempt
@require_http_methods(["GET"])
def Employee_Leave_Status_Link(request):
    if request.method == 'GET':
        try:
            # Get parameters from the request
            employee_id = request.GET.get('EmployeeID')
            location = request.GET.get('location')
            user_type = request.GET.get("Type")  # Type could be Employee, HOD, Admin
            
            print('employee_id:', employee_id)
            print('location:', location)
            print('user_type:', user_type)

            # Validate required parameters
            if not location:
                return JsonResponse({'warn': 'Location is required'})

            # Query for employee leave details excluding 'permission' leave types
            employeeleave_details = Employee_Leave_Register.objects.filter(
                Status="Pending",
                Location_Name=location
            ).exclude(Leave_Type="permission")

            # Apply filters based on user type
            if user_type == "Employee" and employee_id:
                employeeleave_details = employeeleave_details.filter(
                    Employee_Id__Employee__Employee_ID=employee_id
                )
            elif user_type == "HOD" and employee_id:
                employeeleave_details = employeeleave_details.filter(
                    Employee_Id__Employee__Department=employee_id
                )
            elif user_type == "Admin":
                pass  # No additional filtering needed, fetch all leave records in the location

            # Prepare the response data
            response_data = []
            if employeeleave_details.exists():
                for index, emp in enumerate(employeeleave_details, start=1):
                    response_dict = {
                        'id': index,
                        'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id.Employee.Employee_ID else None,
                        'EmployeeName': f"{emp.Employee_Id.Employee.Tittle.Title_Name} {emp.Employee_Id.Employee.First_Name} {emp.Employee_Id.Employee.Middle_Name or ''} {emp.Employee_Id.Employee.Last_Name}".strip(),
                        'Leave_Type': emp.Leave_Type,
                        'FromDate': emp.FromDate,
                        'ToDate': emp.ToDate if emp.ToDate else None,
                        'DaysCount': emp.DaysCount,
                        'Reason': emp.Reason,
                        'Status': emp.Status
                    }
                    response_data.append(response_dict)

            # Return the JSON response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def Employee_Permission_Status_Link(request):
    if request.method == 'GET':
        try:
            # Extract and validate query parameters
            employee_id = request.GET.get('EmployeeID')
            location = request.GET.get('location')
            print("location",location)
            user_type = request.GET.get("Type")
            if not employee_id or not location:
                return JsonResponse({'warn': 'EmployeeID and locations are required'})

            # print("Permission Employee ID:", employee_id)
            # print("Permission Location:", location)

            # Filter permission leave details excluding casual and sick leaves
            employeepermission_details = Employee_Leave_Register.objects.filter(
                Status="Pending",
                Location_Name=location
            ).exclude(Leave_Type__in=['casual', 'sick'])

            if user_type == "Employee" and employee_id:
                employeepermission_details = employeepermission_details.filter(
                    Employee_Id__Employee__Employee_ID=employee_id
                )
            elif user_type == "HOD" and employee_id:
                employeepermission_details = employeepermission_details.filter(
                    Employee_Id__Employee__Department=employee_id
                )
            elif user_type == "Admin":
                pass  # No additional filtering needed, fetch all leave records in the location


            # Prepare response data
            response_data = []
            if employeepermission_details.exists():
                for index, emp in enumerate(employeepermission_details, start=1):
                    response_data.append({
                        'id': index,
                        'Employee_Id': emp.Employee_Id.Employee.Employee_ID or None,
                        'EmployeeName': (
                            f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                            f"{emp.Employee_Id.Employee.First_Name} "
                            f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                            f"{emp.Employee_Id.Employee.Last_Name}"
                        ).strip(),
                        'Leave_Type': emp.Leave_Type or None,
                        'Date': emp.PermissionDate or None,
                        'FromTime': emp.FromTime or None,
                        'ToTime': emp.ToTime or None,
                        'Reason':emp.Reason or None,
                        'HoursCount': emp.HoursCount or None,
                        'Status': emp.Status
                    })

            # Return JSON response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Handle unexpected errors
            
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def Employee_Consume_Permission_Link(request):
    if request.method == 'GET':
        try:
            # Extract and validate query parameters
            employee_id = request.GET.get('EmployeeID')
            location = request.GET.get('location')
            print("location1",location)
            
            if not employee_id or not location:
                return JsonResponse({'warn': 'EmployeeID and locations are required'})

            # print("Permission Employee ID:", employee_id)
            # print("Permission Location:", location)

            # Filter permission leave details excluding casual and sick leaves
            employeepermission_details = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Location_Name=location,
                Leave_Type='permission'
            ).exclude(
               Status='Pending' 
            )
            print("employeepermission_details45",employeepermission_details)

            # print("Employee Permission Details:", employeepermission_details)

            # Prepare response data
            response_data = []
            if employeepermission_details.exists():
                for index, emp in enumerate(employeepermission_details, start=1):
                    response_data.append({
                        'id': index,
                        'Employee_Id': emp.Employee_Id.Employee.Employee_ID or None,
                        'EmployeeName': (
                            f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                            f"{emp.Employee_Id.Employee.First_Name} "
                            f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                            f"{emp.Employee_Id.Employee.Last_Name}"
                        ).strip(),
                        'Leave_Type': emp.Leave_Type or None,
                        'Date': emp.PermissionDate or None,
                        'FromTime': emp.FromTime or None,
                        'ToTime': emp.ToTime or None,
                        'Reason':emp.Reason or None,
                        'HoursCount': emp.HoursCount or None,
                        'Status': emp.Status
                    })

            # Return JSON response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Handle unexpected errors
            print(f"Error: {e}")
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def Employee_FullLeave_Status_Link(request):
    if request.method == 'GET':
        try:
            # Get parameters from the request
            employee_id = request.GET.get('EmployeeID')
            location = request.GET.get('location')
            user_type = request.GET.get("Type") 
            
            print('employee_id:', employee_id)
            print('location:', location)

            # Validate parameters
            if not employee_id or not location:
                return JsonResponse({'warn': 'EmployeeID and location are required'}, status=400)


            employeeleave_details = Employee_Leave_Register.objects.filter(
                Location_Name=location,  # Match the location
                Leave_Type__in=["sick", "casual"]  # Include only "sick" and "casual" leave types
            ).exclude(
                Status="Pending"  # Exclude "Pending" status
            )
            
             # Apply filters based on user type
            if user_type == "Employee" and employee_id:
                employeeleave_details = employeeleave_details.filter(
                    Employee_Id__Employee__Employee_ID=employee_id
                )
            elif user_type == "HOD" and employee_id:
                employeeleave_details = employeeleave_details.filter(
                    Employee_Id__Employee__Department=employee_id
                )
            elif user_type == "Admin":
                pass  # No additional filtering needed, fetch all leave records in the location


            # Prepare the response data
            response_data = []
            if employeeleave_details.exists():
                for index, emp in enumerate(employeeleave_details, start=1):
                    response_dict = {
                        'id': index,
                        'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id.Employee.Employee_ID else None,
                        'EmployeeName': f"{emp.Employee_Id.Employee.Tittle.Title_Name} {emp.Employee_Id.Employee.First_Name} {emp.Employee_Id.Employee.Middle_Name or ''} {emp.Employee_Id.Employee.Last_Name}".strip(),
                        'Leave_Type': emp.Leave_Type,
                        'FromDate': emp.FromDate,
                        'ToDate': emp.ToDate if emp.ToDate else None,
                        'DaysCount': emp.DaysCount,
                        'Reason': emp.Reason,
                        'RejectReason':emp.Reject_Reason if emp.Reject_Reason else None,
                        'Status': emp.Status
                    }
                    response_data.append(response_dict)

            # Return the JSON response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def Employee_FullPermission_Status_Link(request):
    if request.method == 'GET':
        try:
            # Extract and validate query parameters
            employee_id = request.GET.get('EmployeeID')
            location = request.GET.get('location')
            
            if not employee_id or not location:
                return JsonResponse({'warn': 'EmployeeID and locations are required'})

        
            # Filter permission leave details excluding casual and sick leaves
            employeepermission_details = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Location_Name=location
            ).exclude(
                Leave_Type__in=['casual', 'sick']
            ).exclude(
                Status="Pending"
            )


            print("Employee Permission Details12333:", employeepermission_details)

            # Prepare response data
            response_data = []
            if employeepermission_details.exists():
                for index, emp in enumerate(employeepermission_details, start=1):
                    response_data.append({
                        'id': index,
                        'Employee_Id': emp.Employee_Id.Employee.Employee_ID or None,
                        'EmployeeName': (
                            f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                            f"{emp.Employee_Id.Employee.First_Name} "
                            f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                            f"{emp.Employee_Id.Employee.Last_Name}"
                        ).strip(),
                        'Leave_Type': emp.Leave_Type or None,
                        'Date': emp.PermissionDate or None,
                        'FromTime': emp.FromTime or None,
                        'ToTime': emp.ToTime or None,
                        'Reason':emp.Reason or None,
                        'HoursCount': emp.HoursCount or None,
                        'Status': emp.Status,
                        'RejectReason':emp.Reject_Reason if emp.Reject_Reason else None,
                    })

            # Return JSON response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Handle unexpected errors
            print(f"Error: {e}")
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)



# employee advance


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Insert_AdvanceRequest_Register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data", data)
            Employeeid = data.get('employeeId', None)
            reqdate = data.get('reqdate', "")
            reqAmount = data.get('reqAmount', 0)
            reason = data.get('reason', "")
            location = data.get('location', "")
            createdby = data.get('createdby', "")
            
            def validate_date(date_string):
                date = parse_date(date_string)
                if date:
                    return date
                else:
                    return None
            reqdate = validate_date(reqdate)
            
            if not Employeeid:
                return JsonResponse({'warn': "Employeeid not found"})
            if not location:
                return JsonResponse({'warn': "Location is required"})
            
            try:
                print("Employeeid", Employeeid)
                # Corrected the typo from 'object' to 'objects'
                Employee_instance = Financial_History_Detials.objects.get(Employee__Employee_ID=Employeeid)
                print("Employee_instance", Employee_instance)
            except Financial_History_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Employee not Found'})
            
            try:
                location_ins = Location_Detials.objects.get(Location_Id=location)
                print('location_ins', location_ins)
            except Location_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Location not found'})
            # advance_register_instance = Employee_Advance_Request.objects.filter(Employee_Id=Employee_instance, Status='Pending').exists()
            # if advance_register_instance:
            #     return JsonResponse({'warn': "Advance Request is already pending"})
            # Creating the advance request
            advance_register_instance = Employee_Advance_Request.objects.create(
                Employee_Id=Employee_instance,
                Request_Date=reqdate,
                Request_Amount=reqAmount,
                Request_Reason=reason,
                Location_Name=location_ins if location_ins else None,
                CreatedBy=createdby
            )
            return JsonResponse({'success': 'Advance Request successfully'}, status=200)
            
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
           

@csrf_exempt
@require_http_methods(["GET"])
def Employee_PrevAdvance_Details(request):
    if request.method == 'GET':
        try:
            employee_id = request.GET.get('employeeId')
            location_id = request.GET.get('locationId')
            print("EmployeeId:", employee_id)
            print("LocationId:", location_id)
            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'})
            if not location_id:
                return JsonResponse({'warn': 'Location not provided'})
            
            employee_advance_details = Employee_Advance_Request.objects.filter(Employee_Id__Employee__Employee_ID=employee_id,Location_Name=location_id, Status="Pending")
            print("employee_advance_details",employee_advance_details)
            
            response_data = []
            index=1
            for emp in employee_advance_details:
                emp_dict = {
                    'id':index,
                    'RequestDate': emp.Request_Date.strftime('%d-%m-%Y') if emp.Request_Date else None,
                    'RequestAmount':emp.Request_Amount if emp.Request_Amount else None,
                    'RequestReason':emp.Request_Reason if emp.Request_Reason else None,
                    'Status':emp.Status,
                    'InstallmentStatus':emp.Installment_Status if emp.Installment_Status else None,
                } 
                response_data.append(emp_dict)
                index+=1
            return JsonResponse(response_data, safe=False)
            
            
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
               

@csrf_exempt
@require_http_methods(["GET"])
def Req_Recent_Advance_Register_Recent(request):
    if request.method == 'GET':
        try:
            employee_id = request.GET.get('Employeeid')
            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'})

            # Fetch pending advance requests


            employee_advance_details = Employee_Advance_Request.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id
            ).filter(
                Q(Status='Pending') | Q(Status='Approved')
            )


            response_data = []
            for index, emp in enumerate(employee_advance_details, start=1):
                employee_dict = {
                    'id': index,
                    'EmployeeId': emp.Employee_Id.Employee.Employee_ID,
                    'EmployeeName': (
                        f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                        f"{emp.Employee_Id.Employee.First_Name} "
                        f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                        f"{emp.Employee_Id.Employee.Last_Name}"
                    ).strip(),
                    'RequestDate': emp.Request_Date.strftime('%d-%m-%Y') if emp.Request_Date else None,
                    'RequestAmount': emp.Request_Amount or None,
                    'RequestReason': emp.Request_Reason or None,
                    'Status': emp.Status,
                    'InstallmentStatus': emp.Installment_Status or None,
                    'Repayment_Due': emp.Repayment_Due or None,
                    'Reject_Reason': emp.Reject_Reason or None,
                    'IssuedDate': emp.IssuedDate.strftime('%d-%m-%Y') if emp.IssuedDate else None,
                    'Issuever_Name': emp.Issuever_Name or None,
                    'AmountDeduct_PerMonth': emp.AmountDeduct_PerMonth or None,
                    'No_of_MonthPaid': emp.No_of_MonthPaid or None,
                    'PaidAmount': emp.PaidAmount or None,
                }
                response_data.append(employee_dict)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt   
@require_http_methods(["OPTIONS", "GET"])
def Employee_Designation_Details(request):
    if request.method == 'GET':
        try:
            Designations = Designation_Detials.objects.all()
            
            if not Designations.exists():
                return JsonResponse({'message': 'No designations found'}, status=404)
            
            Designation_Master_data = [
                {
                    'id': Designation.Designation_Id,
                    'Designation': Designation.Designation_Name,
                }
                for Designation in Designations
            ]

            return JsonResponse(Designation_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def Employee_Advance_RequestList_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')

        # Start with all Employee Advance Requests
        queryset = Employee_Advance_Request.objects.all()

        # Apply filtering based on query
        if query:
            queryset = queryset.filter(
                Q(Employee_Id__Employee__Employee_ID__icontains=query) |
                Q(Employee_Id__Employee__Tittle__icontains=query) |
                Q(Employee_Id__Employee__First_Name__icontains=query) |
                Q(Employee_Id__Employee__Middle_Name__icontains=query) |
                Q(Employee_Id__Employee__Last_Name__icontains=query) |
                Q(Employee_Id__Employee__Contact_Number__icontains=query)
            )

        # Apply filtering based on status
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        # Prepare response data
        response_data = []
        index = 1  # To maintain serial numbers

        for emp in queryset:
            employee_dict = {
                'id': index,
                'Sl_No':emp.pk,
                'EmployeeId': emp.Employee_Id.Employee.Employee_ID,
                'EmployeeName': (
                    f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                    f"{emp.Employee_Id.Employee.First_Name} "
                    f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                    f"{emp.Employee_Id.Employee.Last_Name}"
                ).strip(),
                'Designation':emp.Employee_Id.Employee.Designation.Designation_Name,
                'PhoneNo':emp.Employee_Id.Employee.Contact_Number,
                'RequestDate': emp.Request_Date.strftime('%d-%m-%Y') if emp.Request_Date else None,
                'RequestAmount': emp.Request_Amount or None,
                'RequestReason': emp.Request_Reason or None,
                'Status': emp.Status,
                'InstallmentStatus': emp.Installment_Status or None,
                'Repayment_Due': emp.Repayment_Due or None,
                'Reject_Reason': emp.Reject_Reason or None,
                'IssuedDate': emp.IssuedDate.strftime('%d-%m-%Y') if emp.IssuedDate else None,
                'Issuever_Name': emp.Issuever_Name or None,
                'AmountDeduct_PerMonth': emp.AmountDeduct_PerMonth or None,
                'No_of_MonthPaid': emp.No_of_MonthPaid or None,
                'PaidAmount': emp.PaidAmount or None,
            }
            response_data.append(employee_dict)
            index += 1

        # Return all results after the loop
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        # Log the exception for debugging
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
@csrf_exempt
@require_http_methods(["GET"])
def Prev_Amount_Details(request):
    if request.method == 'GET':
        try:
            # Retrieve query parameters
            employee_id = request.GET.get('EmployeeId')


            # Validate employee_id
            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'}, status=400)



            # Fetch employee advance details
            employee_advance_details = Employee_Advance_Request.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Status="Approved"
            )

            # Prepare response data
            response_data = []
            index = 1
            for emp in employee_advance_details:
                emp_dict = {
                    'id': index,
                    'RequestDate': emp.Request_Date.strftime('%d-%m-%Y') if emp.Request_Date else None,
                    'RequestAmount': emp.Request_Amount or None,
                    'RequestReason': emp.Request_Reason or None,
                    'Status': emp.Status,
                    'InstallmentStatus': emp.Installment_Status or None,
                }
                response_data.append(emp_dict)
                index += 1

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)






@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def update_Advance_Approval(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Data:", data)

            # Extract data from the request
            sl_no = data.get('Sl_No')
            status = data.get('status')
            installment = data.get('installment', "")
            rejectReason = data.get('rejectReason', "")
            issuedBy = data.get('issuedBy', "")
            issuedDate = data.get('issuedDate', "")
            rejectedBy = data.get('rejectedBy', "")
            rejectedDate = data.get('rejectedDate', "")
            AmountDeductPerMonth = data.get('AmountDeductPerMonth', "")

            # Validate `sl_no`
            if not sl_no:
                return JsonResponse({'warn': "Advance Request ID is missing"})

            # Validate and parse dates
            def validate_date(date_string):
                if date_string:
                    try:
                        return datetime.strptime(date_string, '%Y-%m-%d').date()
                    except ValueError:
                        return None
                return None  # Return None if the string is empty

            issuedDate = validate_date(issuedDate)
            rejectedDate = validate_date(rejectedDate)

            # Convert AmountDeductPerMonth to Decimal (or float if you prefer)
            try:
                if AmountDeductPerMonth:
                    AmountDeductPerMonth = Decimal(AmountDeductPerMonth)  # Convert to Decimal
            except Exception as e:
                return JsonResponse({'warn': 'Invalid AmountDeductPerMonth value'})
            
            # Fetch the advance instance
            try:
                advance_instance = Employee_Advance_Request.objects.get(Advance_RequestId=sl_no)
            except Employee_Advance_Request.DoesNotExist:
                return JsonResponse({'warn': 'Advance request ID not found'})

            # Handle 'Approved' status
            if status == 'Approved':
                if not all([installment, issuedBy, issuedDate, AmountDeductPerMonth]):
                    return JsonResponse({
                        'warn': "Missing required fields for Approved status."
                    })

                # Update fields for Approved status
                advance_instance.Repayment_Due = installment
                advance_instance.IssuedDate = issuedDate
                advance_instance.Issuever_Name = issuedBy
                advance_instance.AmountDeduct_PerMonth = AmountDeductPerMonth
                advance_instance.Status = status
                advance_instance.save()

                return JsonResponse({'success': 'Updated Successfully'})

            # Handle 'Not Approved' status
            elif status == 'Not Approved':
                if not all([rejectedDate, rejectedBy, rejectReason]):
                    return JsonResponse({
                        'warn': "Missing required fields for Not Approved status."
                    })

                # Update fields for Not Approved status
                advance_instance.IssuedDate = rejectedDate
                advance_instance.Issuever_Name = rejectedBy
                advance_instance.Reject_Reason = rejectReason
                advance_instance.Status = status
                advance_instance.save()

                return JsonResponse({'success': 'Updated Successfully'})

            else:
                return JsonResponse({'warn': 'Invalid status'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def Advance_Amount_Details(request):
    if request.method == 'GET':
        try:
            # Retrieve query parameters
            employee_id = request.GET.get('employeeid')


            # Validate employee_id
            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'})



            # Fetch employee advance details
            employee_advance_details = Employee_Advance_Request.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Status="Approved"
            )

            # Prepare response data
            response_data = []
            index = 1
            for emp in employee_advance_details:
                emp_dict = {
                    'id': index,
                    'IssuedDate': emp.IssuedDate.strftime('%d-%m-%Y') if emp.IssuedDate else None,
                    'Issuever_Name': emp.Issuever_Name or None,
                    'Request_Amount': emp.Request_Amount or None,
                    'Repayment_Due': emp.Repayment_Due or None,
                    'AmountPerMonth': emp.AmountDeduct_PerMonth or None,
                    'NoofMonthPaid': emp.No_of_MonthPaid or 0,
                    'InstallmentStatus': emp.Installment_Status or None,
                }
                response_data.append(emp_dict)
                index += 1

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def AdvanceComplete_Amount_Details(request):
    try:
        employee_id = request.GET.get('EmployeeID')
        print("employee_id",employee_id)

        if not employee_id:
            return JsonResponse({'warn': 'Invalid EmployeeID provided'})

        employee_advance_details = Employee_Advance_Request.objects.filter(
            Employee_Id__Employee__Employee_ID=employee_id,
            Status="Completed"
        )

        if not employee_advance_details.exists():
            return JsonResponse([], safe=False)

        response_data = []
        for index, emp in enumerate(employee_advance_details, start=1):
            emp_dict = {
                'id': index,
                'Sl_No': emp.pk,
                'EmployeeId': emp.Employee_Id.Employee.Employee_ID,
                'EmployeeName': (
                    f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                    f"{emp.Employee_Id.Employee.First_Name} "
                    f"{getattr(emp.Employee_Id.Employee, 'Middle_Name', '')} "
                    f"{emp.Employee_Id.Employee.Last_Name}"
                ).strip(),
                'Designation': emp.Employee_Id.Employee.Designation.Designation_Name,
                'PhoneNo': emp.Employee_Id.Employee.Contact_Number,
                'RequestDate': emp.Request_Date.strftime('%d-%m-%Y') if emp.Request_Date else None,
                'RequestAmount': emp.Request_Amount or None,
                'RequestReason': emp.Request_Reason or None,
                'Status': emp.Status,
                'InstallmentStatus': emp.Installment_Status or None,
                'Repayment_Due': emp.Repayment_Due or None,
                'Reject_Reason': emp.Reject_Reason or None,
                'IssuedDate': emp.IssuedDate.strftime('%d-%m-%Y') if emp.IssuedDate else None,
                'Issuever_Name': emp.Issuever_Name or None,
                'AmountDeduct_PerMonth': emp.AmountDeduct_PerMonth or None,
                'No_of_MonthPaid': emp.No_of_MonthPaid or None,
                'PaidAmount': emp.PaidAmount or None,
            }
            response_data.append(emp_dict)

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# leave hrmanagement

# Ensure this is imported at the top

@csrf_exempt
@require_http_methods(["GET"])
def All_Employee_Leave_Status_Link(request):
    if request.method == 'GET':
        try:
            location = request.GET.get('location')
            
            if not location:
                return JsonResponse({'warn': 'location is required'})
            employeeleave_details = Employee_Leave_Register.objects.filter(
                Status="Pending",
                Location_Name=location
            ).exclude(Leave_Type="permission")

            response_data = []
            for index, emp in enumerate(employeeleave_details, start=1):
                response_dict = {
                    'id': index,
                    'Sl_No':emp.Leave_Id,
                    'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id.Employee.Employee_ID else None,
                    'EmployeeName': f"{emp.Employee_Id.Employee.Tittle.Title_Name} {emp.Employee_Id.Employee.First_Name} {emp.Employee_Id.Employee.Middle_Name or ''} {emp.Employee_Id.Employee.Last_Name}".strip(),
                    'Designation': emp.Employee_Id.Employee.Designation.Designation_Name if emp.Employee_Id.Employee.Designation.Designation_Name else None,
                    'Leave_Type': emp.Leave_Type if emp.Leave_Type else None,
                    # Format FromDate and ToDate as dd/mm/yyyy
                    'FromDate': emp.FromDate.strftime('%d/%m/%Y') if emp.FromDate else None,
                    'ToDate': emp.ToDate.strftime('%d/%m/%Y') if emp.ToDate else None,
                    'DaysCount': emp.DaysCount if emp.DaysCount else None,
                    'Reason': emp.Reason if emp.Reason else None,
                    'Status': emp.Status
                }
                response_data.append(response_dict)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)





@csrf_exempt
@require_http_methods(["GET"])
def All_Permission_details_link(request):
    if request.method == 'GET':
        try:
            location = request.GET.get('location')
            print("location",location)
            if not location:
                return JsonResponse({'warn': 'Location is required'}, status=400)

            employeepermission_details = Employee_Leave_Register.objects.filter(
                Location_Name=location,
                Leave_Type='permission',
                Status='Pending'   
            )

            response_data = []
            for index, emp in enumerate(employeepermission_details, start=1):
                response_data.append({
                    'id': index,
                    'Sl_No':emp.Leave_Id,
                    'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id and emp.Employee_Id.Employee else None,
                    'EmployeeName': (
                        f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                        f"{emp.Employee_Id.Employee.First_Name} "
                        f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                        f"{emp.Employee_Id.Employee.Last_Name}"
                    ).strip() if emp.Employee_Id and emp.Employee_Id.Employee else None,
                    'Designation': emp.Employee_Id.Employee.Designation.Designation_Name if emp.Employee_Id and emp.Employee_Id.Employee and emp.Employee_Id.Employee.Designation else None,
                    'Leave_Type': emp.Leave_Type or None,
                    'Date': emp.PermissionDate.strftime('%d/%m/%Y') if emp.PermissionDate else None,
                    'FromTime': emp.FromTime or None,
                    'ToTime': emp.ToTime or None,
                    'Reason': emp.Reason or None,
                    'HoursCount': emp.HoursCount or None,
                    'Status': emp.Status,
                    'RejectReason': emp.Reject_Reason or None,
                })

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def Employee_Previous_Leave_Details(request):
    if request.method == 'GET':
        try:
            # Extract parameters from request
            employee_id = request.GET.get('EmployeeId')
            location_id = request.GET.get('location')

            print("EmployeeId:", employee_id)
            print("LocationId:", location_id)

            # Validate required parameters
            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'})
            if not location_id:
                return JsonResponse({'warn': 'Location not provided'})

            # Fetch leave details from Current_History_Detials
           
     
            employeeleave_details = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,  # Nested relationship lookup for employee ID
                Location_Name=location_id,  # Match the location
                Leave_Type__in=["sick", "casual"],  # Match leave types
                Status='Approved'  # Only approved leaves
            ).exclude(
                Status="Pending"  # Exclude any pending status
            )

            print("prevemployeeleave_details123:", employeeleave_details)

            # Prepare the response data
            response_data = []
            if employeeleave_details.exists():
                for index, emp in enumerate(employeeleave_details, start=1):
                    response_dict = {
                        'id': index,
                        'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id.Employee.Employee_ID else None,
                        'EmployeeName': f"{emp.Employee_Id.Employee.Tittle.Title_Name} {emp.Employee_Id.Employee.First_Name} {emp.Employee_Id.Employee.Middle_Name or ''} {emp.Employee_Id.Employee.Last_Name}".strip(),
                        'Leave_Type': emp.Leave_Type,
                        'FromDate': emp.FromDate,
                        'ToDate': emp.ToDate if emp.ToDate else None,
                        'DaysCount': emp.DaysCount,
                        'Reason': emp.Reason,
                        'RejectReason':emp.Reject_Reason if emp.Reject_Reason else None,
                        'Status': emp.Status
                    }
                    response_data.append(response_dict)

            # Return the JSON response
            return JsonResponse(response_data, safe=False)


        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

    return JsonResponse({'error': 'Method not allowed'}, status=405)





@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def update_Advance_Leave(request):
    try:
        # Parse JSON body
        data = json.loads(request.body)
        print("data:", data)
        
        # Extract and validate inputs
        sl_no = data.get('Sl_No')
        print("sl_no",sl_no)
        status = data.get('status')
        reject = data.get('reject')
        
        if not sl_no:
            return JsonResponse({'warn': "Leave Request ID is missing"})

        # Fetch the leave instance
        try:
            leave_instance = Employee_Leave_Register.objects.get(Leave_Id=sl_no)
            print("leave_instance:", leave_instance)
        except Employee_Leave_Register.DoesNotExist:
            return JsonResponse({'warn': 'Leave Request ID not found'})

        # Update instance with new values
        leave_instance.Status = status
        leave_instance.Reject_Reason = reject if reject is not None else ""
        leave_instance.save()


        # Extract relevant data
        employee_id = leave_instance.Employee_Id.Employee.Employee_ID
        print("employee_id",employee_id)
        from_date = leave_instance.FromDate
        print("from_date",from_date)
        to_date = leave_instance.ToDate if leave_instance.ToDate else None
        print("to_date",to_date)
        status_attendance = 'On Leave'
        location = leave_instance.Location_Name
        print("location",location)
        created_by = leave_instance.CreatedBy
        print("created_by",created_by)

        if not employee_id:
            return JsonResponse({'warn': 'Employee ID not associated with leave request'})

        # Validate and fetch employee instance
        try:
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
        except Employee_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Employee not found'})

        # Ensure date range is valid
        # if not from_date or not to_date:
        #     return JsonResponse({'warn': 'Invalid date range'})

        # Create attendance entries in bulk for the date range
        if leave_instance.Status == "On Leave":
            attendance_entries = []
            current_date = from_date

            while current_date <= to_date:
                attendance_entries.append(Employee_Attendance(
                    Employee=employee_instance,
                    Date=current_date,
                    Attendance_Status=status_attendance,
                    Location=location,
                    CreatedBy=created_by
                ))
                current_date += timedelta(days=1)

            # Perform bulk creation
            Employee_Attendance.objects.bulk_create(attendance_entries)
        return JsonResponse({'success': 'Updated Successfully'})

    except Exception as e:
        print("An error occurred:", str(e))
     
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Employee_Permission_Details(request):
    if request.method == 'GET':
        try:
            # Extract and validate parameters
            employee_id = request.GET.get('EmployeeId')
            location_id = request.GET.get('location')

            if not employee_id:
                return JsonResponse({'warn': 'EmployeeID not provided'})
            if not location_id:
                return JsonResponse({'warn': 'Location not provided'})

            # Fetch leave register data
            leave_register = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Location_Name=location_id,
                Status='Approved'
            ).exclude(Leave_Type__in=['casual', 'sick'])

            # Prepare response data
            response_data = []
            for index, emp in enumerate(leave_register, start=1):
                response_data.append({
                    'id': index,
                    'Employee_Id': emp.Employee_Id.Employee.Employee_ID or None,
                    'EmployeeName': (
                        f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                        f"{emp.Employee_Id.Employee.First_Name} "
                        f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                        f"{emp.Employee_Id.Employee.Last_Name}"
                    ).strip(),
                    'Leave_Type': emp.Leave_Type or None,
                    'Date': emp.PermissionDate or None,
                    'FromTime': emp.FromTime or None,
                    'ToTime': emp.ToTime or None,
                    'Reason': emp.Reason or None,
                    'HoursCount': emp.HoursCount or None,
                    'Status': emp.Status
                })

            # Return response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Log exception for debugging
            print(f"Error occurred: {e}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
          


@csrf_exempt
@require_http_methods(["GET"])
def All_Consumed_Leave(request):
    if request.method == 'GET':
        try:
            def get_file_image(filedata):
                kind = filetype.guess(filedata)
                
                    # Default to PDF if the type is undetermined
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                    # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            location = request.GET.get('location')
            
            if not location:
                return JsonResponse({'warn': 'location is required'})
            employeeleave_details = Employee_Leave_Register.objects.filter(
                Location_Name=location
            ).exclude(
                Leave_Type="permission"
            ).exclude(
                Status='Pending'
            )


            response_data = []
            for index, emp in enumerate(employeeleave_details, start=1):
                response_dict = {
                    'id': index,
                    'Sl_No':emp.Leave_Id,
                    'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id.Employee.Employee_ID else None,
                    'EmployeeName': f"{emp.Employee_Id.Employee.Tittle.Title_Name} {emp.Employee_Id.Employee.First_Name} {emp.Employee_Id.Employee.Middle_Name or ''} {emp.Employee_Id.Employee.Last_Name}".strip(),
                    'Designation': emp.Employee_Id.Employee.Designation.Designation_Name if emp.Employee_Id.Employee.Designation.Designation_Name else None,
                    'Leave_Type': emp.Leave_Type if emp.Leave_Type else None,
                    # Format FromDate and ToDate as dd/mm/yyyy
                    'FromDate': emp.FromDate.strftime('%d/%m/%Y') if emp.FromDate else None,
                    'ToDate': emp.ToDate.strftime('%d/%m/%Y') if emp.ToDate else None,
                    'DaysCount': emp.DaysCount if emp.DaysCount else None,
                    'Reason': emp.Reason if emp.Reason else None,
                    'Status': emp.Status,
                    'RejectReason':emp.Reject_Reason if emp.Reject_Reason else None,
                    'file':get_file_image(emp.Medical_Certificate) if emp.Medical_Certificate else None,
                }
                response_data.append(response_dict)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def All_Consume_Permission_details(request):
    if request.method == 'GET':
        try:
            location = request.GET.get('location')
            if not location:
                return JsonResponse({'warn': 'Location is required'}, status=400)

            employeepermission_details = Employee_Leave_Register.objects.filter(
                Location_Name=location,
                Leave_Type='permission',
                   
            ).exclude(
                Status='Pending'
            )

            response_data = []
            for index, emp in enumerate(employeepermission_details, start=1):
                response_data.append({
                    'id': index,
                    'Sl_No':emp.Leave_Id,
                    'Employee_Id': emp.Employee_Id.Employee.Employee_ID if emp.Employee_Id and emp.Employee_Id.Employee else None,
                    'EmployeeName': (
                        f"{emp.Employee_Id.Employee.Tittle.Title_Name} "
                        f"{emp.Employee_Id.Employee.First_Name} "
                        f"{emp.Employee_Id.Employee.Middle_Name or ''} "
                        f"{emp.Employee_Id.Employee.Last_Name}"
                    ).strip() if emp.Employee_Id and emp.Employee_Id.Employee else None,
                    'Designation': emp.Employee_Id.Employee.Designation.Designation_Name if emp.Employee_Id and emp.Employee_Id.Employee and emp.Employee_Id.Employee.Designation else None,
                    'Leave_Type': emp.Leave_Type or None,
                    'Date': emp.PermissionDate.strftime('%d/%m/%Y') if emp.PermissionDate else None,
                    'FromTime': emp.FromTime or None,
                    'ToTime': emp.ToTime or None,
                    'Reason': emp.Reason or None,
                    'HoursCount': emp.HoursCount or None,
                    'Status': emp.Status,
                    'RejectReason': emp.Reject_Reason or None,
                })

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)




