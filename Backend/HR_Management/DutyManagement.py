import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Max, Q , Case, When, Count, Value, CharField, TimeField
from datetime import datetime
import random
from django.db.models import Sum
import holidays
import pandas as pd
from datetime import date  # Add this import
from django.utils.dateparse import parse_datetime
import string
from django.db import transaction
from decimal import Decimal
from Masters.models import *
from decimal import Decimal
import filetype
from django.utils.dateparse import parse_time
import re
from django.utils.dateparse import parse_date
from docx import Document
import base64
import calendar
# import magic  # Make sure you have the pyathon-magic library installed
from io import BytesIO
from datetime import datetime, timedelta,time
from PyPDF2 import PdfReader, PdfWriter
from django.core.exceptions import ObjectDoesNotExist
from .serializers import *
from django.db.models import F, Value
from django.db.models.functions import Lower, Replace
from collections import defaultdict
from django.db.models.functions import TruncTime
from django.forms.models import model_to_dict


def get_file_image(filedata):
    kind = filetype.guess(filedata)    
    contenttype1 = 'application/pdf'
    if kind and kind.mime == 'image/jpeg':
        contenttype1 = 'image/jpeg'
    elif kind and kind.mime == 'image/png':
        contenttype1 = 'image/png'
    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'


def convert_strto_12hoursformatwitham_pm(time):
    if time is not None:
        formatted_time =time.strftime("%I:%M %p")
        return formatted_time
    else:
        return None
    
    
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Employee_AttendnanceManagement_Details(request):
 
    if request.method == 'GET':
        try:
            # Fetch query parameters
            query = request.GET.get('query', '').strip()
            designation = request.GET.get('designation', '').strip()
 
            # Base queryset: Filter active employees
            queryset = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes')
            print("Initial queryset:", queryset)
 
            # Apply query filters for search
            if query:
                queryset = queryset.filter(
                    Q(Employee_ID__icontains=query) |
                    Q(Tittle__Title_Name__icontains=query) |
                    Q(First_Name__icontains=query) |
                    Q(Middle_Name__icontains=query) |
                    Q(Last_Name__icontains=query) |
                    Q(Contact_Number__icontains=query)
                )
 
            # Filter by designation if provided
            if designation:
                try:
                    designation_id = int(designation)
                    queryset = queryset.filter(Q(Designation__Designation_Id=designation_id))
                except ValueError:
                    print("Invalid designation ID format:", designation)
                    return JsonResponse({'error': 'Invalid designation ID format'})
 
            # Prepare the response data
            employees_data = []
            for index, emp in enumerate(queryset, start=1):
                # Initialize employee data
                employee_data = {
                    'id': index,
                    'Employee_Id': emp.Employee_ID,
                    'EmployeeName': f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
                    'PhoneNo': emp.Contact_Number,
                    'Department': "",
                    'Designation': emp.Designation.Designation_Name if emp.Designation else None,
                    'Location': emp.Location.Location_Name if emp.Location else None,
                    'locationid': emp.Location.Location_Id if emp.Location else None,
                    'Leave_Type': '',
                    'FromDate': '',
                    'ToDate': '',
                    'Status': '',
                    'shift_start': '',
                    'shift_end': '',
                    'Statuss': '',
                    'StatusAttendance': '',
                    'Attendanceid': '',
                    'Date': '',
                    'presentid': '',
                    'presentintime': '',
                    'presentouttime': '',
                    'PresentStatus': '',
                }
 
                # Fetch leave details for the employee
                leave_details = Employee_Leave_Register.objects.filter(
                    Employee_Id__Employee__Employee_ID=emp.Employee_ID,
                    Location_Name=emp.Location,
                    Status='Approved',
                    Leave_Type__in=['sick', 'casual']
                ).order_by('-FromDate')  # Most recent leave
 
                # Fetch attendance details
                on_leave_attendance = Employee_Attendance.objects.filter(
                    Employee__Employee_ID=emp.Employee_ID,
                    Location=emp.Location,
                    Attendance_Status='On leave'
                ).last()
 
                present_attendance = Employee_Attendance.objects.filter(
                    Employee__Employee_ID=emp.Employee_ID,
                    Location=emp.Location,
                    Attendance_Status='Present'
                ).last()
 
                # Fetch shift details
                shift_details = ShiftDetails_Master.objects.filter(
                    Employee__Employee_ID=emp.Employee_ID,
                    Location_Name=emp.Location,
                    Status__in=['WeekOff', 'OnLeave']
                ).order_by('-Shiftstartdate')  # Most recent shift
 
                # Update employee_data with leave details
                if leave_details.exists():
                    latest_leave = leave_details.first()
                    employee_data.update({
                        'Leave_Type': latest_leave.Leave_Type,
                        'FromDate': latest_leave.FromDate.strftime('%Y-%m-%d') if latest_leave.FromDate else '',
                        'ToDate': latest_leave.ToDate.strftime('%Y-%m-%d') if latest_leave.ToDate else '',
                        'Status': latest_leave.Status
                    })
 
                # Update attendance details
                if on_leave_attendance:
                    employee_data.update({
                        'Attendanceid': on_leave_attendance.pk,
                        'Date': on_leave_attendance.Date.strftime('%Y-%m-%d') if on_leave_attendance.Date else '',
                        'StatusAttendance': on_leave_attendance.Attendance_Status
                    })
 
                if present_attendance:
                    employee_data.update({
                        'presentid': present_attendance.pk,
                        'presentintime': present_attendance.In_Time.strftime('%H:%M') if present_attendance.In_Time else '',
                        'presentouttime': present_attendance.Out_Time.strftime('%H:%M') if present_attendance.Out_Time else '',
                        'PresentStatus': present_attendance.Attendance_Status
                    })
 
                # Update shift details
                if shift_details.exists():
                    latest_shift = shift_details.first()
                    employee_data.update({
                        'shift_start': latest_shift.Shiftstartdate.strftime('%Y-%m-%d') if latest_shift.Shiftstartdate else '',
                        'shift_end': latest_shift.Shiftenddate.strftime('%Y-%m-%d') if latest_shift.Shiftenddate else '',
                        'Statuss': latest_shift.Status
                    })
 
                # Handle many-to-many relationship with departments
                departments = emp.Department.all()  # Get all related departments
                department_names = [department.Department_Name for department in departments] if departments else ["Admin"]
                newdept = ", ".join(department_names)
                employee_data['Department'] = newdept
 
                # Add employee data to the response list
                employees_data.append(employee_data)
 
            return JsonResponse(employees_data, safe=False)
 
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Employee_AttendnanceManagement_Details(request):

#     if request.method == 'GET':
#         try:
#             # Fetch query parameters
#             query = request.GET.get('query', '').strip()
#             designation = request.GET.get('designation', '').strip()

#             # Base queryset: Filter active employees
#             queryset = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes')
#             print("Initial queryset:", queryset)

#             # Apply query filters for search
#             if query:
#                 queryset = queryset.filter(
#                     Q(Employee_ID__icontains=query) |
#                     Q(Tittle__Title_Name__icontains=query) |
#                     Q(First_Name__icontains=query) |
#                     Q(Middle_Name__icontains=query) |
#                     Q(Last_Name__icontains=query) |
#                     Q(Contact_Number__icontains=query)
#                 )

#             # Filter by designation if provided
#             if designation:
#                 try:
#                     designation_id = int(designation)
#                     queryset = queryset.filter(Q(Designation__Designation_Id=designation_id))
#                 except ValueError:
#                     print("Invalid designation ID format:", designation)
#                     return JsonResponse({'error': 'Invalid designation ID format'})

#             # Prepare the response data
#             employees_data = []
#             for index, emp in enumerate(queryset, start=1):
#                 # Initialize employee data
#                 employee_data = {
#                     'id': index,
#                     'Employee_Id': emp.Employee_ID,
#                     'EmployeeName': f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
#                     'PhoneNo': emp.Contact_Number,
#                     'Department': emp.Department.Department_Name if emp.Department else None,
#                     'Designation': emp.Designation.Designation_Name if emp.Designation else None,
#                     'Location': emp.Location.Location_Name if emp.Location else None,
#                     'locationid': emp.Location.Location_Id if emp.Location else None,
#                     'Leave_Type': '',
#                     'FromDate': '',
#                     'ToDate': '',
#                     'Status': '',
#                     'shift_start': '',
#                     'shift_end': '',
#                     'Statuss': '',
#                     'StatusAttendance': '',
#                     'Attendanceid': '',
#                     'Date': '',
#                     'presentid': '',
#                     'presentintime': '',
#                     'presentouttime': '',
#                     'PresentStatus': '',
#                 }

#                 # Fetch leave details for the employee
#                 leave_details = Employee_Leave_Register.objects.filter(
#                     Employee_Id__Employee__Employee_ID=emp.Employee_ID,
#                     Location_Name=emp.Location,
#                     Status='Approved',
#                     Leave_Type__in=['sick', 'casual']
#                 ).order_by('-FromDate')  # Most recent leave

#                 # Fetch attendance details
#                 on_leave_attendance = Employee_Attendance.objects.filter(
#                     Employee__Employee_ID=emp.Employee_ID,
#                     Location=emp.Location,
#                     Attendance_Status='On leave'
#                 ).last()

#                 present_attendance = Employee_Attendance.objects.filter(
#                     Employee__Employee_ID=emp.Employee_ID,
#                     Location=emp.Location,
#                     Attendance_Status='Present'
#                 ).last()

#                 # Fetch shift details
#                 shift_details = ShiftDetails_Master.objects.filter(
#                     Employee__Employee_ID=emp.Employee_ID,
#                     Location_Name=emp.Location,
#                     Status__in=['WeekOff', 'OnLeave']
#                 ).order_by('-Shiftstartdate')  # Most recent shift

#                 # Update employee_data with leave details
#                 if leave_details.exists():
#                     latest_leave = leave_details.first()
#                     employee_data.update({
#                         'Leave_Type': latest_leave.Leave_Type,
#                         'FromDate': latest_leave.FromDate.strftime('%Y-%m-%d') if latest_leave.FromDate else '',
#                         'ToDate': latest_leave.ToDate.strftime('%Y-%m-%d') if latest_leave.ToDate else '',
#                         'Status': latest_leave.Status
#                     })

#                 # Update attendance details
#                 if on_leave_attendance:
#                     employee_data.update({
#                         'Attendanceid': on_leave_attendance.pk,
#                         'Date': on_leave_attendance.Date.strftime('%Y-%m-%d') if on_leave_attendance.Date else '',
#                         'StatusAttendance': on_leave_attendance.Attendance_Status
#                     })

#                 if present_attendance:
#                     employee_data.update({
#                         'presentid': present_attendance.pk,
#                         'presentintime': present_attendance.In_Time.strftime('%H:%M') if present_attendance.In_Time else '',
#                         'presentouttime': present_attendance.Out_Time.strftime('%H:%M') if present_attendance.Out_Time else '',
#                         'PresentStatus': present_attendance.Attendance_Status
#                     })

#                 # Update shift details
#                 if shift_details.exists():
#                     latest_shift = shift_details.first()
#                     employee_data.update({
#                         'shift_start': latest_shift.Shiftstartdate.strftime('%Y-%m-%d') if latest_shift.Shiftstartdate else '',
#                         'shift_end': latest_shift.Shiftenddate.strftime('%Y-%m-%d') if latest_shift.Shiftenddate else '',
#                         'Statuss': latest_shift.Status
#                     })

#                 # Add employee data to the response list
#                 employees_data.append(employee_data)

#             return JsonResponse(employees_data, safe=False)

#         except Exception as e:
#             print(f"Error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)


# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Employee_DutyManagement_Details(request):
#     if request.method == "GET":
#         try:
#             # Fetch query parameters
#             query = request.GET.get("query", "").strip()
#             designation = request.GET.get("designation", "").strip()

#             # Base queryset: Filter active employees
#             queryset = Employee_Personal_Form_Detials.objects.filter(ActiveStatus="Yes")
#             print('queryset :',queryset)
#             # Apply filters if any
#             if query:
#                 queryset = queryset.filter(
#                     Q(Employee_ID__icontains=query)
#                     | Q(Tittle__Title_Name__icontains=query)
#                     | Q(First_Name__icontains=query)
#                     | Q(Middle_Name__icontains=query)
#                     | Q(Last_Name__icontains=query)
#                     | Q(Contact_Number__icontains=query)
#                 )

#             if designation:
#                 try:
#                     designation_id = int(designation)
#                     queryset = queryset.filter(
#                         Q(Designation__Designation_Id=designation_id)
#                     )
#                 except ValueError:
#                     return JsonResponse(
#                         {"error": "Invalid designation ID format"}, status=400
#                     )

#             # Group employees by department
#             department_data = {}
#             FinalDepartmentassignedShifts = []
#             for index,emp in enumerate(queryset,start=1):
#                 department_name = (
#                     emp.Department.Department_Name if emp.Department else "Admin"
#                 )
#                 Department_Id = (
#                     emp.Department.Department_Id if emp.Department else "None"
#                 )
#                 print('Department_Id :',Department_Id)
#                 if Department_Id != "None":
#                     DepartmentassignedShifts = ShiftDetails_Master.objects.filter(
#                         Shift_Id__Department=Department_Id,  # Accessing the Department field in DutyRousterMaster via Shift_Id
#                         Status="Active"  # Filter only 'Active' shifts
#                     ).all()
#                     print('DepartmentassignedShifts :',DepartmentassignedShifts)
#                     def convert_to_12hr_format(time_obj):
#                         return time_obj.strftime("%I:%M %p") if time_obj else None

#                     def get_display_starttime(start_time, end_time):
#                         start = convert_to_12hr_format(start_time)
#                         end = convert_to_12hr_format(end_time)
#                         return f"{start} - {end}" if start and end else None

                    
#                     FinalDepartmentassignedShifts = list(DepartmentassignedShifts.values())
#                     if FinalDepartmentassignedShifts:
#                         print('FinalDepartmentassignedShifts :',FinalDepartmentassignedShifts)
#                         for j, i in zip(FinalDepartmentassignedShifts, DepartmentassignedShifts):
#                             print('i.Shift_Id :',j)
#                             j["Employee_Name"] = i.Employee.First_Name + " " + i.Employee.Middle_Name + " " + i.Employee.Last_Name
#                             j["StartTime"] = i.Shift_Id.StartTime
#                             j["EndTime"] = i.Shift_Id.EndTime
#                             j["ShiftName"] = i.Shift_Id.ShiftName
#                             j["ShiftTime"] = get_display_starttime(i.Shift_Id.StartTime, i.Shift_Id.EndTime)
                    
#                     print('FinalDepartmentassignedShifts :',FinalDepartmentassignedShifts)
                        
#                 if department_name not in department_data:
#                     department_data[department_name] = {
#                         "Department_Name": department_name,
#                         "Employee_Count": 0,
#                         "Employees": [],
#                         "Department_Id": Department_Id,
#                         "DepartmentassignedShifts": FinalDepartmentassignedShifts
#                     }
#                 resultrdata = []
#                 print('Department_Id :',Department_Id)
#                 if Department_Id != "None":
#                     shiftsdata = DutyRousterMaster.objects.filter(
#                         Department=Department_Id
#                     ).all()
#                     resultrdata = list(shiftsdata.values())
                   
#                 # Increment employee count and add employee data
#                 employee_data = {
#                     "Employee_Id": emp.Employee_ID,
#                     "EmployeeName": f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
#                     "PhoneNo": emp.Contact_Number,
#                     "Designation": (
#                         emp.Designation.Designation_Name if emp.Designation else None
#                     ),
#                     "Location": emp.Location.Location_Name if emp.Location else None,
#                     "Leave_Type": "",
#                     "FromDate": "",
#                     "ToDate": "",
#                     "Leave_Status": "",
#                     "Attendance_Status": "",
#                     "Attendance_Date": "",
#                     "Shift_Status": "",
#                     "Shift_Start": "",
#                     "Shift_End": "",
#                     "Present_InTime": "",
#                     "Present_OutTime": "",
#                     "Shifts": resultrdata,
#                     "Department_Name": department_name,
#                     "id": index
#                 }

#                 # Fetch leave details for the employee
#                 leave_details = Employee_Leave_Register.objects.filter(
#                     Employee_Id__Employee__Employee_ID=emp.Employee_ID,
#                     Location_Name=emp.Location,
#                     Status="Approved",
#                     Leave_Type__in=["sick", "casual"],
#                 ).order_by(
#                     "-FromDate"
#                 )  # Most recent leave

#                 if leave_details.exists():
#                     latest_leave = leave_details.first()
#                     employee_data.update(
#                         {
#                             "Leave_Type": latest_leave.Leave_Type,
#                             "FromDate": (
#                                 latest_leave.FromDate.strftime("%Y-%m-%d")
#                                 if latest_leave.FromDate
#                                 else ""
#                             ),
#                             "ToDate": (
#                                 latest_leave.ToDate.strftime("%Y-%m-%d")
#                                 if latest_leave.ToDate
#                                 else ""
#                             ),
#                             "Leave_Status": latest_leave.Status,
#                         }
#                     )

#                 # Fetch attendance details
#                 attendance_on_leave = Employee_Attendance.objects.filter(
#                     Employee__Employee_ID=emp.Employee_ID,
#                     Location=emp.Location,
#                     Attendance_Status="On leave",
#                 ).last()

#                 attendance_present = Employee_Attendance.objects.filter(
#                     Employee__Employee_ID=emp.Employee_ID,
#                     Location=emp.Location,
#                     Attendance_Status="Present",
#                 ).last()

#                 if attendance_on_leave:
#                     employee_data.update(
#                         {
#                             "Attendance_Status": attendance_on_leave.Attendance_Status,
#                             "Attendance_Date": (
#                                 attendance_on_leave.Date.strftime("%Y-%m-%d")
#                                 if attendance_on_leave.Date
#                                 else ""
#                             ),
#                         }
#                     )

#                 if attendance_present:
#                     employee_data.update(
#                         {
#                             "Present_InTime": (
#                                 attendance_present.In_Time.strftime("%H:%M")
#                                 if attendance_present.In_Time
#                                 else ""
#                             ),
#                             "Present_OutTime": (
#                                 attendance_present.Out_Time.strftime("%H:%M")
#                                 if attendance_present.Out_Time
#                                 else ""
#                             ),
#                         }
#                     )

#                 # Fetch shift details
#                 shift_details = ShiftDetails_Master.objects.filter(
#                     Employee__Employee_ID=emp.Employee_ID,
#                     Location_Name=emp.Location,
#                     Status__in=["WeekOff", "OnLeave"],
#                 ).order_by(
#                     "-Shiftstartdate"
#                 )  # Most recent shift

#                 if shift_details.exists():
#                     latest_shift = shift_details.first()
#                     employee_data.update(
#                         {
#                             "Shift_Status": latest_shift.Status,
#                             "Shift_Start": (
#                                 latest_shift.Shiftstartdate.strftime("%Y-%m-%d")
#                                 if latest_shift.Shiftstartdate
#                                 else ""
#                             ),
#                             "Shift_End": (
#                                 latest_shift.Shiftenddate.strftime("%Y-%m-%d")
#                                 if latest_shift.Shiftenddate
#                                 else ""
#                             ),
#                         }
#                     )

#                 department_data[department_name]["Employee_Count"] += 1
#                 department_data[department_name]["Employees"].append(employee_data)

#             # Convert to list format for response
#             response_data = list(department_data.values())

#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             # Log error for debugging purposes
#             print(f"Error occurred: {str(e)}")
#             return JsonResponse(
#                 {"error": "An internal server error occurred"}, status=500
#             )

#     return JsonResponse({"error": "Method not allowed"}, status=405)


# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Employee_DutyManagement_Details(request):
#     if request.method == "GET":
#         try:
#             # Fetch query parameters
#             query = request.GET.get("query", "").strip()
#             designation = request.GET.get("designation", "").strip()

#             # Base queryset: Filter active employees
#             queryset = Employee_Personal_Form_Detials.objects.filter(ActiveStatus="Yes")
#             print('queryset :', queryset)

#             # Apply filters if any
#             if query:
#                 queryset = queryset.filter(
#                     Q(Employee_ID__icontains=query)
#                     | Q(Tittle__Title_Name__icontains=query)
#                     | Q(First_Name__icontains=query)
#                     | Q(Middle_Name__icontains=query)
#                     | Q(Last_Name__icontains=query)
#                     | Q(Contact_Number__icontains=query)
#                 )

#             if designation:
#                 try:
#                     designation_id = int(designation)
#                     queryset = queryset.filter(
#                         Q(Designation__Designation_Id=designation_id)
#                     )
#                 except ValueError:
#                     return JsonResponse(
#                         {"error": "Invalid designation ID format"}, status=400
#                     )

#             # Group employees by department
#             department_data = {}
#             for index, emp in enumerate(queryset, start=1):
#                 # Handle many-to-many relationship with departments
#                 departments = emp.Department.all()  # Get all related departments
#                 if not departments.exists():
#                     departments = [{"Department_Name": "Admin", "Department_Id": "None"}]  # Default if no department

#                 for department in departments:
#                     department_name = department.Department_Name
#                     Department_Id = department.Department_Id
#                     print('Department_Id :', Department_Id)

#                     # Get shifts assigned to this department
#                     if Department_Id != "None":
#                         DepartmentassignedShifts = ShiftDetails_Master.objects.filter(
#                              Employee__Department__Department_Id=Department_Id,  # Accessing the Department field in DutyRousterMaster via Shift_Id
#                             Status="Active"  # Filter only 'Active' shifts
#                         ).all()
#                         print('DepartmentassignedShifts :', DepartmentassignedShifts)

#                         def convert_to_12hr_format(time_obj):
#                             return time_obj.strftime("%I:%M %p") if time_obj else None

#                         def get_display_starttime(start_time, end_time):
#                             start = convert_to_12hr_format(start_time)
#                             end = convert_to_12hr_format(end_time)
#                             return f"{start} - {end}" if start and end else None

#                         # Preparing the list of shifts for this department
#                         FinalDepartmentassignedShifts = list(DepartmentassignedShifts.values())
#                         print("FinalDepartmentassignedShifts :",FinalDepartmentassignedShifts)
#                         if FinalDepartmentassignedShifts:
#                             for j, i in zip(FinalDepartmentassignedShifts, DepartmentassignedShifts):
#                                 j["Employee_Name"] = f"{i.Employee.First_Name} {i.Employee.Middle_Name} {i.Employee.Last_Name}"
#                                 j["StartTime"] = i.Shift_Id.StartTime
#                                 j["EndTime"] = i.Shift_Id.EndTime
#                                 j["ShiftName"] = i.Shift_Id.ShiftName
#                                 j["ShiftTime"] = get_display_starttime(i.Shift_Id.StartTime, i.Shift_Id.EndTime)

#                     # If the department does not exist in department_data, add it
#                     if department_name not in department_data:
#                         department_data[department_name] = {
#                             "Department_Name": department_name,
#                             "Employee_Count": 0,
#                             "Employees": [],
#                             "Department_Id": Department_Id,
#                             "DepartmentassignedShifts": FinalDepartmentassignedShifts
#                         }

#                     # Fetch shift details for the employee in this department
#                     resultrdata = []
#                     if Department_Id != "None":
#                         shiftsdata = DutyRousterMaster.objects.all()
#                         resultrdata = list(shiftsdata.values())

#                     # Increment employee count and add employee data
#                     employee_data = {
#                         "Employee_Id": emp.Employee_ID,
#                         "EmployeeName": f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
#                         "PhoneNo": emp.Contact_Number,
#                         "Designation": (
#                             emp.Designation.Designation_Name if emp.Designation else None
#                         ),
#                         "Location": emp.Location.Location_Name if emp.Location else None,
#                         "Leave_Type": "",
#                         "FromDate": "",
#                         "ToDate": "",
#                         "Leave_Status": "",
#                         "Attendance_Status": "",
#                         "Attendance_Date": "",
#                         "Shift_Status": "",
#                         "Shift_Start": "",
#                         "Shift_End": "",
#                         "Present_InTime": "",
#                         "Present_OutTime": "",
#                         "Shifts": resultrdata,
#                         "Department_Name": department_name,
#                         "id": index
#                     }

#                     # Fetch leave details for the employee
#                     leave_details = Employee_Leave_Register.objects.filter(
#                         Employee_Id__Employee__Employee_ID=emp.Employee_ID,
#                         Location_Name=emp.Location,
#                         Status="Approved",
#                         Leave_Type__in=["sick", "casual"],
#                     ).order_by(
#                         "-FromDate"
#                     )  # Most recent leave

#                     if leave_details.exists():
#                         latest_leave = leave_details.first()
#                         employee_data.update(
#                             {
#                                 "Leave_Type": latest_leave.Leave_Type,
#                                 "FromDate": (
#                                     latest_leave.FromDate.strftime("%Y-%m-%d")
#                                     if latest_leave.FromDate
#                                     else ""
#                                 ),
#                                 "ToDate": (
#                                     latest_leave.ToDate.strftime("%Y-%m-%d")
#                                     if latest_leave.ToDate
#                                     else ""
#                                 ),
#                                 "Leave_Status": latest_leave.Status,
#                             }
#                         )

#                     # Fetch attendance details
#                     attendance_on_leave = Employee_Attendance.objects.filter(
#                         Employee__Employee_ID=emp.Employee_ID,
#                         Location=emp.Location,
#                         Attendance_Status="On leave",
#                     ).last()

#                     attendance_present = Employee_Attendance.objects.filter(
#                         Employee__Employee_ID=emp.Employee_ID,
#                         Location=emp.Location,
#                         Attendance_Status="Present",
#                     ).last()

#                     if attendance_on_leave:
#                         employee_data.update(
#                             {
#                                 "Attendance_Status": attendance_on_leave.Attendance_Status,
#                                 "Attendance_Date": (
#                                     attendance_on_leave.Date.strftime("%Y-%m-%d")
#                                     if attendance_on_leave.Date
#                                     else ""
#                                 ),
#                             }
#                         )

#                     if attendance_present:
#                         employee_data.update(
#                             {
#                                 "Present_InTime": (
#                                     attendance_present.In_Time.strftime("%H:%M")
#                                     if attendance_present.In_Time
#                                     else ""
#                                 ),
#                                 "Present_OutTime": (
#                                     attendance_present.Out_Time.strftime("%H:%M")
#                                     if attendance_present.Out_Time
#                                     else ""
#                                 ),
#                             }
#                         )

#                     # Fetch shift details for this employee
#                     shift_details = ShiftDetails_Master.objects.filter(
#                         Employee__Employee_ID=emp.Employee_ID,
#                         Location_Name=emp.Location,
#                         Status__in=["WeekOff", "OnLeave"],
#                     ).order_by(
#                         "-ShiftDate"
#                     )  # Most recent shift

#                     if shift_details.exists():
#                         latest_shift = shift_details.first()
#                         employee_data.update(
#                             {
#                                 "Shift_Status": latest_shift.Status,
#                                 "ShiftDate": (
#                                     latest_shift.ShiftDate.strftime("%Y-%m-%d")
#                                     if latest_shift.ShiftDate
#                                     else ""
#                                 ),
                              
#                             }
#                         )

#                     # Add employee data to department
#                     department_data[department_name]["Employee_Count"] += 1
#                     department_data[department_name]["Employees"].append(employee_data)

#             # Convert to list format for response
#             response_data = list(department_data.values())

#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             # Log error for debugging purposes
#             print(f"Error occurred: {str(e)}")
#             return JsonResponse(
#                 {"error": "An internal server error occurred"}, status=500
#             )

#     return JsonResponse({"error": "Method not allowed"}, status=405)

def Employee_DutyManagement_Details(request):
    try:
        query = request.GET.get("query", "").strip()
        designation = request.GET.get("designation", "").strip()
        QueueType = request.GET.get("QueueType")
        assigned_shifts=[]
         
        queryset = Employee_Personal_Form_Detials.objects.filter(ActiveStatus="Yes").select_related(
            "Tittle", "BloodGroup", "Designation", "Classification", "Category", "Speciality", "Role", "Location"
        ).prefetch_related("Department")
        print(queryset,'queryset--')

        if query:
            queryset = queryset.filter(
                Q(Employee_ID__icontains=query) |
                Q(Tittle__Title_Name__icontains=query) |
                Q(First_Name__icontains=query) |
                Q(Middle_Name__icontains=query) |
                Q(Last_Name__icontains=query) |
                Q(Contact_Number__icontains=query)
            )

        if designation:
            try:
                designation_id = int(designation)
                queryset = queryset.filter(Q(Designation__Designation_Id=designation_id))
            except ValueError:
                return JsonResponse({"error": "Invalid designation ID format"}, status=400)

        department_data = defaultdict(lambda: {"employees": [], "dept_ids": set(), "DepartmentAssignShift": []})
        print('depart-data',department_data)
        sno = 1

        for instance in queryset:
            employee_data = model_to_dict(instance)
            employee_data["id"] = sno
            employee_data["EmployeeName"] = f"""{instance.Tittle.Title_Name if instance.Tittle else ''} {instance.First_Name} {instance.Middle_Name} {instance.Last_Name}""".strip()
            employee_data["Photo"] = get_file_image(instance.Photo) if instance.Photo else None
            employee_data["Tittle"] = instance.Tittle.Title_Name if instance.Tittle else None
            employee_data["BloodGroup"] = instance.BloodGroup.BloodGroup_Name if instance.BloodGroup else None
            employee_data["Designation"] = instance.Designation.Designation_Name if instance.Designation else None
            employee_data["Classification"] = instance.Classification.Classification_Name if instance.Classification else None
            employee_data["Category"] = instance.Category.Category_Name if instance.Category else None
            employee_data["Speciality"] = instance.Speciality.Speciality_Name if instance.Speciality else None
            employee_data["Role"] = instance.Role.Role_Name if instance.Role else None

            departments = list(instance.Department.values_list("Department_Name", flat=True))
            departmentIds = list(instance.Department.values_list("Department_Id", flat=True))
            employee_data["DepartmentName"] = ", ".join(departments) if departments else "No Department"
            employee_data["Department"] = departments

            shift_data = DutyRousterMaster.objects.filter(BranchID=instance.Location.Location_Id, Status=True)
            employee_data["Shifts"] = list(shift_data.values())

            leave_data = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=instance.Employee_ID,
                Status='Approved'
            ).values('FromDate', 'ToDate', 'Leave_Type', 'Status').all()
            employee_data["LeaveDetails"] = list(leave_data)

            if not departments:
                department_data["No Department"]["employees"].append(employee_data)
            else:
                for dept, dept_id in zip(departments, departmentIds):
                    department_data[dept]["employees"].append(employee_data)
                    department_data[dept]["dept_ids"].add(dept_id)

            sno += 1

        # Fetch Shift Assignments
        for dept, data in department_data.items():
            employee_ids = [emp["Employee_ID"] for emp in data["employees"]]
            if not employee_ids:
               continue
            if data["dept_ids"]:
                dept_ids = list(data["dept_ids"])
                for i in dept_ids:
                    employee_ids = [emp["Employee_ID"] for emp in data["employees"]]

                    if QueueType == "ShiftApproval":
                        print("Dept:", dept)
                        print("Employee IDs:", employee_ids)
                        print("Shifts:", list(assigned_shifts))

                        assigned_shifts = ShiftDetails_Master.objects.filter(
                            Employee_id__in=employee_ids,
                            Status__in=["Pending", "Assigned"]
                        ).values()
                    else:
                        assigned_shifts = ShiftDetails_Master.objects.filter(
                            Employee_id__in=employee_ids
                        ).values()

                    shift_list = list(assigned_shifts)  
                    for shift in shift_list:
                        shift_id = shift.get("Shift_Id_id")  
                        BranchID_id = shift.get("BranchID_id")
                        Location_id = shift.get("Location_id")
                        Employee_id = shift.get("Employee_id")
                        ShiftStatus = shift.get("Status")

                        if shift_id:
                            duty_shift = DutyRousterMaster.objects.filter(ShiftId=shift_id).values().first()
                            BranchIDData = Location_Detials.objects.filter(Location_Id=BranchID_id).values().first()
                            LocationData = Location_Detials.objects.filter(Location_Id=Location_id).values().first()
                            EmployeeData = Employee_Personal_Form_Detials.objects.filter(Employee_ID=Employee_id).values().first()
                            Tittle_id = EmployeeData.get("Tittle_id")
                            TitleData = Title_Detials.objects.filter(Title_Id=Tittle_id).values().first()
                            StartTime = convert_strto_12hoursformatwitham_pm(duty_shift.get("StartTime"))
                            EndTime = convert_strto_12hoursformatwitham_pm(duty_shift.get("EndTime"))

                            ShiftTime = f"{StartTime} - {EndTime}"
                            FullName = f"""{TitleData.get("Title_Name")} {EmployeeData.get("First_Name")} {EmployeeData.get("Middle_Name")} {EmployeeData.get("Last_Name")}"""
                            if duty_shift:
                                shift.update(duty_shift)
                            if BranchIDData:
                                shift.update(BranchIDData)
                            if LocationData:
                                shift.update(LocationData)
                            if EmployeeData:
                                shift.update(EmployeeData)
                            if TitleData:
                                shift.update(TitleData)
                            if FullName:
                                shift.update({"FullName": FullName})
                            if ShiftTime:
                                shift.update({"ShiftTime": ShiftTime})
                            if ShiftStatus:
                                shift.update({"ShiftStatus": ShiftStatus})

                    data["DepartmentAssignShift"] = shift_list  

        if QueueType == "ShiftApproval":
            # Filter only departments where employees exist in ShiftDetails_Master
            print('depyiiiii',department_data)
            print(QueueType,'QueueType')
            filtered_result = []
            for dept, data in department_data.items():
                department_has_shift = ShiftDetails_Master.objects.filter(
                    Employee__Department__Department_Id__in=data["dept_ids"] , Status__in = ["Pending","Assigned"]
                ).exists()
                print('department_has_shift :',department_has_shift)
                if department_has_shift:
                    filtered_result.append({    
                        "Department_Name": dept,
                        "Department_Id": list(data["dept_ids"])[0] if data["dept_ids"] else None,
                        "Employee_Count": len(data["employees"]),
                        "Employees": data["employees"],
                        "DepartmentAssignShift": data["DepartmentAssignShift"]
                    })
            print(filtered_result,"filtered_result")
            return JsonResponse(filtered_result, safe=False, json_dumps_params={"default": str})

        
        result = [
            {
                "Department_Name": dept,
                "Department_Id": list(data["dept_ids"])[0] if data["dept_ids"] else None,
                "Employee_Count": len(data["employees"]),
                "Employees": data["employees"],
                "DepartmentAssignShift": data["DepartmentAssignShift"]
            }
            for dept, data in department_data.items()
        ]

        return JsonResponse(result, safe=False, json_dumps_params={"default": str})

    except Exception as e:
        print('error :',e)
        return JsonResponse({"error": str(e)}, status=500)



# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Employee_ShiftDetails_Link(request):
#     if request.method == "GET":
#         try:
#             employee_id = request.GET.get("employeeid")

#             location = request.GET.get("location")

#             # Validate required parameters
#             if not employee_id:
#                 return JsonResponse({"warn": "Employee not Found"})
#             if not location:
#                 return JsonResponse({"warn": "Location not Found"})

#             # Query ShiftDetails_Master
#             ShiftsData = ShiftDetails_Master.objects.filter(
#                 Employee__Employee_ID=employee_id, Location_Name__Location_Id=location
#             ).exclude(Status__in=["On leave", "WeekOff", "Completed"])

#             # Prepare the shift details data
#             Shift_Master_data = []
#             index = 1
#             for Shift in ShiftsData:
#                 # Safely parse Intime and Outtime
#                 intime = Shift.Intime

#                 outtime = Shift.Outtime

#                 try:
#                     if isinstance(intime, str):
#                         # Parse string time to datetime
#                         intime = datetime.strptime(intime, "%H:%M:%S")

#                     formatted_intime = intime.strftime("%I:%M %p") if intime else None

#                 except Exception as e:

#                     formatted_intime = None

#                 try:
#                     if isinstance(outtime, str):
#                         # Parse string time to datetime
#                         outtime = datetime.strptime(outtime, "%H:%M:%S")

#                     formatted_outtime = (
#                         outtime.strftime("%I:%M %p") if outtime else None
#                     )

#                 except Exception as e:

#                     formatted_outtime = None

#                 Shift_dict = {
#                     "id": index,
#                     "Sl_No": Shift.pk,
#                     "Employee": Shift.Employee.Employee_ID if Shift.Employee else None,
#                     "ShiftName": Shift.ShiftName.ShiftName if Shift.ShiftName else None,
#                     "Intime": Shift.Intime,
#                     "Outtime": Shift.Outtime,
#                     "ShiftTime": (
#                         f"{formatted_intime} - {formatted_outtime}"
#                         if formatted_intime and formatted_outtime
#                         else None
#                     ),
#                     "Shiftstartdate": (
#                         datetime.strptime(Shift.Shiftstartdate, "%Y-%m-%d").strftime(
#                             "%d-%m-%Y"
#                         )
#                         if isinstance(Shift.Shiftstartdate, str)
#                         else (
#                             Shift.Shiftstartdate.strftime("%d-%m-%Y")
#                             if Shift.Shiftstartdate
#                             else None
#                         )
#                     ),
#                     "Shiftenddate": (
#                         datetime.strptime(Shift.Shiftenddate, "%Y-%m-%d").strftime(
#                             "%d-%m-%Y"
#                         )
#                         if isinstance(Shift.Shiftenddate, str)
#                         else (
#                             Shift.Shiftenddate.strftime("%d-%m-%Y")
#                             if Shift.Shiftenddate
#                             else None
#                         )
#                     ),
#                     "Status": Shift.Status,
#                 }

#                 index += 1
#                 Shift_Master_data.append(Shift_dict)

#             # Return the shift details as JSON
#             return JsonResponse(Shift_Master_data, safe=False)

#         except Exception as e:
#             return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"})

#     # Return error if method is not allowed
#     return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def update_Shift_Detail_Link(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            print("Received Data:", data)

            # Extracting fields from the request body (not from GET parameters)
            sl_no = data.get("Sl_No")
            status = data.get("newstatus", "")  # Default empty string if not provided

            # Validate that required data is present
            if not sl_no or not status:
                return JsonResponse({"warn": "Sl_No or newstatus not provided"})

            print("sl_no:", sl_no)
            print("status:", status)
            try:
                shift_instance = ShiftDetails_Master.objects.get(pk=sl_no)
            except ShiftDetails_Master.DoesNotExist:
                return JsonResponse({"warn": "Employee ShiftDetails not Found"})

            shift_instance.Status = status
            shift_instance.save()

            # Return a successful response
            return JsonResponse(
                {"success": "Shift details  Status updated successfully"}, status=200
            )

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse(
                {"error": "An internal server error occurred"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Employee_Complete_ShiftDetails_Link(request):
    if request.method == "GET":
        try:
            employee_id = request.GET.get("employeeid")
 
            location = request.GET.get("location")
 
            if not employee_id:
                return JsonResponse({"warn": "Employee not Found"})
            if not location:
                return JsonResponse({"warn": "Location not Found"})
            ShiftsData = ShiftDetails_Master.objects.filter(
                Employee__Employee_ID=employee_id,
                Location_Name__Location_Id=location,
                Status="Completed",
            )
            Shift_Master_data = []
            index = 1
            for Shift in ShiftsData:
                # Safely parse Intime and Outtime
                intime = Shift.Shift_Id.StartTime
 
                outtime = Shift.Shift_Id.EndTime
 
                try:
                    if isinstance(intime, str):
                        # Parse string time to datetime
                        intime = datetime.strptime(intime, "%H:%M:%S")
 
                    formatted_intime = intime.strftime("%I:%M %p") if intime else None
 
                except Exception as e:
 
                    formatted_intime = None
 
                try:
                    if isinstance(outtime, str):
                        # Parse string time to datetime
                        outtime = datetime.strptime(outtime, "%H:%M:%S")
 
                    formatted_outtime = (
                        outtime.strftime("%I:%M %p") if outtime else None
                    )
 
                except Exception as e:
 
                    formatted_outtime = None
 
                Shift_dict = {
                    "id": index,
                    "Sl_No": Shift.pk,
                    "Employee": Shift.Employee.Employee_ID if Shift.Employee else None,
                    "ShiftName": Shift.Shift_Id.ShiftName if Shift.Shift_Id else None,
                    "Intime": Shift.Shift_Id.StartTime,
                    "Outtime": Shift.Shift_Id.EndTime,
                    "ShiftTime": (
                        f"{formatted_intime} - {formatted_outtime}"
                        if formatted_intime and formatted_outtime
                        else None
                    ),
                    "Shiftstartdate": (
                        datetime.strptime(Shift.Shiftstartdate, "%Y-%m-%d").strftime(
                            "%d-%m-%Y"
                        )
                        if isinstance(Shift.Shiftstartdate, str)
                        else (
                            Shift.Shiftstartdate.strftime("%d-%m-%Y")
                            if Shift.Shiftstartdate
                            else None
                        )
                    ),
                    "Shiftenddate": (
                        datetime.strptime(Shift.Shiftenddate, "%Y-%m-%d").strftime(
                            "%d-%m-%Y"
                        )
                        if isinstance(Shift.Shiftenddate, str)
                        else (
                            Shift.Shiftenddate.strftime("%d-%m-%Y")
                            if Shift.Shiftenddate
                            else None
                        )
                    ),
                    "Status": Shift.Status,
                }
 
                index += 1
                Shift_Master_data.append(Shift_dict)
 
            # Return the shift details as JSON
            return JsonResponse(Shift_Master_data, safe=False)
 
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"})
    return JsonResponse({"error": "Method not allowed"}, status=405)

from datetime import datetime, timedelta


from datetime import datetime, timedelta
from django.http import JsonResponse


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Shift_Details_Report(request):
    try:
        # Get parameters from the request
        fromdate_str = request.GET.get("startdate")
        todate_str = request.GET.get("enddate")
        location = request.GET.get("location")

        # Convert request parameters to datetime objects
        fromdate = datetime.strptime(fromdate_str, "%Y-%m-%d")
        todate = datetime.strptime(todate_str, "%Y-%m-%d")

        # Filter shifts based on the received parameters
        shifts = ShiftDetails_Master.objects.filter(
            Shiftstartdate__lte=todate_str,
            Shiftenddate__gte=fromdate_str,
            Location_Name=location,
        )

        # Initialize a list to hold employee shift data
        employee_shifts_data = {}

        for shift in shifts:
            # Convert shift start and end dates to datetime
            shift_start = (
                datetime.strptime(shift.Shiftstartdate, "%Y-%m-%d")
                if isinstance(shift.Shiftstartdate, str)
                else shift.Shiftstartdate
            )
            shift_end = (
                datetime.strptime(shift.Shiftenddate, "%Y-%m-%d")
                if isinstance(shift.Shiftenddate, str)
                else shift.Shiftenddate
            )

            # Prepare employee details and shift data
            employee_id = shift.Employee.Employee_ID
            employee_name = f"{shift.Employee.Tittle.Title_Name if shift.Employee.Tittle else ''} {shift.Employee.First_Name or ''} {shift.Employee.Middle_Name or ''} {shift.Employee.Last_Name or ''}".strip()
            shift_name = shift.ShiftName.ShiftName if shift.ShiftName else None
            status = shift.Status
            location_name = (
                shift.Location_Name.Location_Name if shift.Location_Name else None
            )

            # Ensure we have a record for the employee
            if employee_id not in employee_shifts_data:

                employee_shifts_data[employee_id] = []

            # Find the employee data object to add shift details to
            # employee_data = next(emp for emp in employee_shifts_data if emp['id'] == employee_id)

            # Iterate over each day in the shift period
            current_date = shift_start
            while current_date <= shift_end:
                if shift_name in ["Leave", "Week Off"]:
                    start_time_str = ""
                    end_time_str = ""
                    formatted_intime = None
                    formatted_outtime = None
                else:
                    # Format shift times
                    start_time_str = shift.Intime if shift.Intime else ""
                    end_time_str = shift.Outtime if shift.Outtime else ""

                    try:
                        if isinstance(start_time_str, str):
                            start_time_str = datetime.strptime(
                                start_time_str, "%H:%M:%S"
                            )
                        formatted_intime = (
                            start_time_str.strftime("%I:%M %p")
                            if start_time_str
                            else None
                        )
                    except Exception:
                        formatted_intime = None

                    try:
                        if isinstance(end_time_str, str):
                            end_time_str = datetime.strptime(end_time_str, "%H:%M:%S")
                        formatted_outtime = (
                            end_time_str.strftime("%I:%M %p") if end_time_str else None
                        )
                    except Exception:
                        formatted_outtime = None

                # Append the shift details for the current date
                employee_shifts_data[employee_id].append(
                    {
                        "Date": current_date.strftime("%d-%m-%Y"),
                        "DayName": current_date.strftime("%A"),
                        "Location": location_name,
                        "ShiftName": (
                            "Leave"
                            if status == "Leave"
                            else "Week Off" if status == "Week Off" else shift_name
                        ),
                        "Shift_StartTime": start_time_str,
                        "ShiftTime": (
                            f"{formatted_intime} - {formatted_outtime}"
                            if formatted_intime and formatted_outtime
                            else None
                        ),
                        "Shift_EndTime": end_time_str,
                        "EmployeeName": employee_name,
                    }
                )

                # Increment current_date
                current_date += timedelta(days=1)

        date_list = [
            (fromdate + timedelta(days=i)).strftime("%d-%m-%Y")
            for i in range((todate - fromdate).days + 1)
        ]
        day_names = {
            date: (fromdate + timedelta(days=i)).strftime("%A")
            for i, date in enumerate(date_list)
        }
        # Prepare the final response data
        response_data = {
            "employee_shifts": employee_shifts_data,
            "day_names": day_names,
        }
        return JsonResponse(response_data)

    except Exception as e:
        # Return error response if something goes wrong
        return JsonResponse({"error": f"An internal server error occurred: {str(e)}"})


# EmployeeAttadance


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def insert_attendance_report(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request
            data = json.loads(request.body)
            print("data", data)

            # Extract fields
            Employeeid = data.get("employeeid")
            date = data.get("date")
            location = data.get("location")
            outtime = data.get("outtime", None)
            intime = data.get("intime", None)
            status = data.get("status", "Absent")
            createdby = data.get("createdby", "")
            sl_no = data.get("sl_no")

            # Validate required fields
            if not Employeeid:
                return JsonResponse({"warn": "EmployeeId not found"})
            if not location:
                return JsonResponse({"warn": "Location not found"})
            if not date:
                return JsonResponse({"warn": "Date is required"})

            # Helper function for date validation
            def validate_date(date_string):
                try:
                    return datetime.strptime(date_string, "%d-%m-%Y").date()
                except ValueError:
                    return None

            date = validate_date(date)
            if not date:
                return JsonResponse(
                    {"warn": "Invalid date format, expected DD-MM-YYYY"}
                )

            # Fetch Employee and Location instances
            def get_instance_or_error(model, pk, model_name):
                try:
                    return model.objects.get(pk=pk)
                except model.DoesNotExist:
                    return JsonResponse({"warn": f"{model_name} not found"})

            Employeeid_instance = get_instance_or_error(
                Employee_Personal_Form_Detials, Employeeid, "Employee"
            )
            if isinstance(Employeeid_instance, JsonResponse):
                return Employeeid_instance

            location_instance = get_instance_or_error(
                Location_Detials, location, "Location"
            )
            if isinstance(location_instance, JsonResponse):
                return location_instance

            # Convert intime and outtime to 24-hour format
            def convert_to_24_hour(time_str):
                try:
                    return (
                        datetime.strptime(time_str, "%H:%M").time()
                        if time_str
                        else None
                    )
                except ValueError:
                    return None

            intime_24 = convert_to_24_hour(intime)
            outtime_24 = convert_to_24_hour(outtime)

            if intime and not intime_24:
                return JsonResponse({"warn": "Invalid In_Time format, expected HH:MM"})
            if outtime and not outtime_24:
                return JsonResponse({"warn": "Invalid Out_Time format, expected HH:MM"})

            # Check if updating an existing record
            if sl_no:
                try:
                    employee_attendance_instance = Employee_Attendance.objects.get(
                        pk=sl_no
                    )
                except Employee_Attendance.DoesNotExist:
                    return JsonResponse({"warn": "Attendance ID not found"})

                # Update Out_Time and calculate Working_Hours
                if outtime_24:
                    datetime_intime = datetime.combine(
                        employee_attendance_instance.Date,
                        employee_attendance_instance.In_Time,
                    )
                    datetime_outtime = datetime.combine(
                        employee_attendance_instance.Date, outtime_24
                    )

                    if datetime_outtime < datetime_intime:
                        datetime_outtime += timedelta(days=1)

                    time_difference = datetime_outtime - datetime_intime
                    working_hours = time_difference.total_seconds() / 3600

                    # Update the record
                    employee_attendance_instance.Out_Time = outtime_24
                    employee_attendance_instance.Working_Hours = working_hours
                    employee_attendance_instance.save()

                    return JsonResponse({"success": "Attendance updated successfully"})
                else:
                    return JsonResponse({"warn": "Out_Time is required for update"})

            # Prevent duplicate entries for the same employee and date
            if Employee_Attendance.objects.filter(
                Employee=Employeeid_instance, Date=date
            ).exists():
                return JsonResponse(
                    {"warn": "Attendance for this date and employee already exists"}
                )

            # Create new attendance record with In_Time only
            employee_attendance_instance = Employee_Attendance.objects.create(
                Employee=Employeeid_instance,
                Date=date,
                In_Time=intime_24,
                Out_Time=None,
                Working_Hours=None,
                Attendance_Status=status,
                Location=location_instance,
                CreatedBy=createdby,
            )

            return JsonResponse({"success": "Attendance recorded successfully"})

        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def attendance_report(request):
    if request.method == "GET":
        try:
            # Extract query parameters
            employee_id = request.GET.get("EmployeeID")
            location = request.GET.get("location")

            if not employee_id or not location:
                return JsonResponse({"warn": "EmployeeID and location are required"})

            # Fetch attendance details
            employee_attendance_details = Employee_Attendance.objects.filter(
                Employee__Employee_ID=employee_id, Location=location
            )

            if not employee_attendance_details.exists():
                return JsonResponse({"warn": "No attendance records found"})

            employee_attendance_data = []
            index = 1

            # Helper function for time formatting and calculating working hours
            def format_time(time_value):
                try:
                    if isinstance(time_value, str):
                        time_value = datetime.strptime(time_value, "%H:%M:%S")
                    return time_value.strftime("%I:%M %p") if time_value else None
                except Exception:
                    return None

            def calculate_working_hours(in_time, out_time):

                # Parse the in_time and out_time as datetime objects with AM/PM format
                try:
                    if in_time is not None and out_time is not None:
                        # Use '%I:%M %p' for 12-hour format with AM/PM
                        in_time_obj = datetime.strptime(in_time, "%I:%M %p")
                        print("in_time_obj", in_time_obj)
                        out_time_obj = datetime.strptime(out_time, "%I:%M %p")
                        print("out_time_obj", out_time_obj)

                        # Calculate the difference
                        time_diff = out_time_obj - in_time_obj
                        print("time_diff", time_diff)

                        # Convert to hours and minutes
                        hours = time_diff.seconds // 3600
                        minutes = (time_diff.seconds // 60) % 60

                        return f"{hours} hours {minutes} minutes"
                    else:
                        return "-"
                except Exception as e:
                    print("Error calculating working hours:", e)
                    return None

            # Generate attendance data
            for emp in employee_attendance_details:
                intime = format_time(emp.In_Time)
                print("intime", intime)
                outtime = format_time(emp.Out_Time)
                print("outtime", outtime)

                # Calculate working hours if both intime and outtime are available
                working_hours = None
                if intime and outtime:
                    working_hours = calculate_working_hours(intime, outtime)
                    print("working_hours", working_hours)

                employee_name = (
                    f"{emp.Employee.Tittle.Title_Name if emp.Employee.Tittle else ''} "
                    f"{emp.Employee.First_Name or ''} {emp.Employee.Middle_Name or ''} "
                    f"{emp.Employee.Last_Name or ''}".strip()
                )

                attendance_dict = {
                    "Sl_no": index,
                    "id": emp.pk,
                    "EmployeeID": emp.Employee.Employee_ID if emp.Employee else None,
                    "EmployeeName": employee_name,
                    "Department": (
                        emp.Employee.Department.Department_Name
                        if emp.Employee.Department
                        else ""
                    ),
                    "Date": (
                        datetime.strptime(emp.Date, "%Y-%m-%d").strftime("%d-%m-%Y")
                        if isinstance(emp.Date, str)
                        else emp.Date.strftime("%d-%m-%Y") if emp.Date else None
                    ),
                    "In_Time": intime,
                    "Out_Time": outtime,
                    "Attendance_Status": emp.Attendance_Status,
                    "Working_Hours": working_hours,
                }
                index += 1
                employee_attendance_data.append(attendance_dict)

            return JsonResponse(employee_attendance_data, safe=False)

        except Employee_Attendance.DoesNotExist:
            return JsonResponse(
                {"error": "No attendance data found for the given criteria"}
            )
        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def holiday(request):
    """
    API Endpoint to fetch Indian holidays for a given year.
    If no year is provided, it defaults to the current year.
    """
    if request.method == "GET":
        try:
            # Get the year from query parameters, default to the current year
            year = request.GET.get("year", date.today().year)
            try:
                year = int(year)
            except ValueError:
                return JsonResponse(
                    {"warn": "Invalid year format. Please provide a valid integer."}
                )

            # Define Indian holidays for the specified year
            indian_holidays = holidays.India(years=year)

            # Convert date keys to strings and create a dictionary
            holiday_dict = {str(date): name for date, name in indian_holidays.items()}

            return JsonResponse(holiday_dict, safe=False)

        except holidays.HolidayBaseError as holiday_error:
            return JsonResponse(
                {"warn": f"Holidays library error: {str(holiday_error)}"}
            )
        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Attendance_Master_InsetLink(request):
    if request.method == "POST":
        try:
            # File Validation
            Getfile = request.FILES.get("file")
            if not Getfile or not Getfile.name.endswith(".csv"):
                return JsonResponse(
                    {"warn": "Unsupported file format. Please upload a CSV file"}
                )

            # Parse CSV
            df = pd.read_csv(Getfile)
            csv_data = df.to_dict(orient="records")
            processed, skipped, errors = 0, 0, []

            # Helper Function
            def calculate_working_hours(in_time, out_time):
                print("intime :",in_time)
                if not in_time or not out_time:
                    return None
                datetime_in = datetime.combine(datetime.today(), in_time)
                datetime_out = datetime.combine(datetime.today(), out_time)
                # Handle overnight shifts
                if datetime_out < datetime_in:
                    datetime_out += timedelta(days=1)
                working_hours = (datetime_out - datetime_in).total_seconds() / 3600
                return working_hours

            for idx, row in enumerate(csv_data, start=1):
                try:
                    # Clean NaN values
                    row = {
                        key: (None if pd.isna(value) else value)
                        for key, value in row.items()
                    }

                    # Validate Employee
                    employee_code = row.get("Employee")
                    if not employee_code:
                        skipped += 1
                        errors.append(f"Row {idx}: Missing Employee code")
                        continue

                    try:
                        employee_instance = Employee_Personal_Form_Detials.objects.get(
                            pk=employee_code
                        )
                    except Employee_Personal_Form_Detials.DoesNotExist:
                        skipped += 1
                        errors.append(
                            f"Row {idx}: Employee with code {employee_code} not found"
                        )
                        continue

                    # Validate Location
                    location_id = row.get("Location")
                    if not location_id:
                        skipped += 1
                        errors.append(f"Row {idx}: Missing Location ID")
                        continue

                    try:
                        location_instance = Location_Detials.objects.get(pk=location_id)
                    except Location_Detials.DoesNotExist:
                        skipped += 1
                        errors.append(
                            f"Row {idx}: Location with ID {location_id} not found"
                        )
                        continue

                    # Validate Date
                    try:
                        attendance_date = datetime.strptime(
                            row.get("Date"), "%d-%m-%y"
                        ).date()
                    except (ValueError, TypeError):
                        skipped += 1
                        errors.append(f"Row {idx}: Invalid or missing date")
                        continue

                    # Parse Time
                    def parse_time(time_str):
                        try:
                            return (
                                datetime.strptime(time_str, "%H:%M").time()
                                if time_str
                                else None
                            )
                        except ValueError:
                            return None

                    in_time = parse_time(row.get("In_Time"))
                    out_time = parse_time(row.get("Out_Time"))

                    # Calculate Working Hours
                    working_hours = calculate_working_hours(in_time, out_time)

                    # Avoid Duplicates
                    if Employee_Attendance.objects.filter(
                        Employee=employee_instance,
                        Date=attendance_date,
                        Location=location_instance,
                    ).exists():
                        skipped += 1
                        errors.append(f"Row {idx}: Duplicate record")
                        continue

                    # Create Record
                    Employee_Attendance.objects.create(
                        Employee=employee_instance,
                        Date=attendance_date,
                        In_Time=in_time,
                        Out_Time=out_time,
                        Working_Hours=working_hours,
                        Attendance_Status=row.get("Attendance_Status"),
                        Location=location_instance,
                    )
                    processed += 1

                except Exception as e:
                    skipped += 1
                    errors.append(f"Row {idx}: {str(e)}")

            # Final Summary
            return JsonResponse(
                {
                    "success": f"{processed} records processed successfully.",
                    "skipped": skipped,
                    "errors": errors,
                }
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )


# employeerequest shiftmanagement

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Employee_Shift_Details_Link(request):
    if request.method == "GET":
        try:
            employee_id = request.GET.get("employeeid")
            location = request.GET.get("location")
 
            if not employee_id:
                return JsonResponse({"warn": "Employee not found"})
            if not location:
                return JsonResponse({"warn": "Location not found"})
 
            # Fetch the current date and next date
            current_date = datetime.now().date()
 
            next_date = current_date + timedelta(days=1)
 
            # Filter shift details by employee ID and location
            shift_details = ShiftDetails_Master.objects.filter(
                Employee__Employee_ID=employee_id, Location_Name=location
            )
 
            Shift_Master_data = []
            index = 1
 
            for shift in shift_details:
                intime = shift.Shift_Id.StartTime
                outtime =shift.Shift_Id.EndTime
 
                try:
                    if isinstance(intime, str):
                        intime = datetime.strptime(intime, "%H:%M:%S")
                    formatted_intime = intime.strftime("%I:%M %p") if intime else None
                except Exception:
                    formatted_intime = None
 
                try:
                    if isinstance(outtime, str):
                        outtime = datetime.strptime(outtime, "%H:%M:%S")
                    formatted_outtime = (
                        outtime.strftime("%I:%M %p") if outtime else None
                    )
                except Exception:
                    formatted_outtime = None
 
                # Parse and format Shift StartDate and EndDate
                try:
                    shift_start_date = (
                        datetime.strptime(shift.Shiftstartdate, "%Y-%m-%d").date()
                        if isinstance(shift.Shiftstartdate, str)
                        else shift.Shiftstartdate
                    )
                    shift_start_date_str = (
                        shift_start_date.strftime("%d-%m-%Y")
                        if shift_start_date
                        else None
                    )
                except Exception:
                    shift_start_date_str = None
 
                try:
                    shift_end_date = (
                        datetime.strptime(shift.Shiftenddate, "%Y-%m-%d").date()
                        if isinstance(shift.Shiftenddate, str)
                        else shift.Shiftenddate
                    )
 
                    if (
                        shift.Status in ["Active", "Follow-up Duty"]
                        and shift_end_date == next_date
                    ):
                        shift_end_date_str = "Tomorrow"
                    else:
                        shift_end_date_str = (
                            shift_end_date.strftime("%d-%m-%Y")
                            if shift_end_date
                            else None
                        )
                except Exception:
                    shift_end_date_str = None
 
                shift_dict = {
                    "id": index,
                    "EmployeeID": (
                        shift.Employee.Employee_ID if shift.Employee else None
                    ),
                    "EmployeeName": f"{shift.Employee.Tittle.Title_Name if shift.Employee.Tittle else ''} {shift.Employee.First_Name} {shift.Employee.Middle_Name or ''} {shift.Employee.Last_Name or ''}".strip(),
                    "Department": ", ".join(
                        dept.Department_Name for dept in shift.Employee.Department.all()
                    ) if shift.Employee.Department.exists() else None,
                    "Designation": (
                        shift.Employee.Designation.Designation_Name
                        if shift.Employee.Designation
                        else None
                    ),
                    "ShiftName": shift.Shift_Id.ShiftName if shift.Shift_Id.ShiftName else None,
                    "Shift_StartTime": shift.Shift_Id.StartTime,
                    "Shift_EndTime": shift.Shift_Id.EndTime,
                    "ShiftHours": (
                        f"{formatted_intime} - {formatted_outtime}"
                        if formatted_intime and formatted_outtime
                        else None
                    ),
                    "Shift_StartDate": shift_start_date_str,
                    "Shift_EndDate": shift_end_date_str,
                    "Status": shift.Status,
                }
 
                # Add priority conditions
                is_active_or_followup = shift.Status in ["Active", "Follow-up Duty"]
                is_current_or_next_day = (
                    shift_end_date == current_date or shift_end_date == next_date
                )
                shift_dict["priority"] = (is_active_or_followup, is_current_or_next_day)
 
                index += 1
                Shift_Master_data.append(shift_dict)
 
            # Sort by priority first, then by other conditions
            Shift_Master_data.sort(
                key=lambda x: (
                    not x["priority"][0],  # Show "Active" or "Followup Duty" first
                    not x["priority"][1],  # Show current or next day shifts first
                    x["id"],  # Preserve original order as fallback
                )
            )
 
            return JsonResponse(Shift_Master_data, safe=False)
 
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"})
 
    return JsonResponse({"error": "Method not allowed"}, status=405)

# Employee Report

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Employee_Report_Details_link(request):
    if request.method == "GET":
        try:

            def get_file_image(filedata):
                kind = filetype.guess(filedata)
                contenttype1 = "application/pdf"
                if kind:
                    contenttype1 = kind.mime
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'


            # Get query parameters
            query = request.GET.get("query", "").strip()
            designation = request.GET.get("designation", "").strip()
            location = request.GET.get("location", "").strip()

            if not location:
                return JsonResponse({"warn": "Location not found"})

            # Base queryset
            queryset = Employee_Personal_Form_Detials.objects.filter(
                ActiveStatus="Yes", Location=location
            )

            # Apply search filters
            if query:
                queryset = queryset.filter(
                    Q(Employee_ID__icontains=query)
                    | Q(Tittle__Title_Name__icontains=query)
                    | Q(First_Name__icontains=query)
                    | Q(Middle_Name__icontains=query)
                    | Q(Last_Name__icontains=query)
                    | Q(Contact_Number__icontains=query)
                )

            # Apply designation filter
            if designation:
                try:
                    designation_id = int(designation)
                    queryset = queryset.filter(
                        Designation__Designation_Id=designation_id
                    )
                except ValueError:
                    return JsonResponse({"error": "Invalid designation ID format"})

            # Prepare response data
            employees_data = []
            for index, emp in enumerate(queryset, start=1):
                print("emp", emp)

                # Handle ManyToMany relationship for Departments
                department_names = [department.Department_Name for department in emp.Department.all()]

                employees_data.append(
                    {
                        "Sl_No": index,
                        "EmployeeID": emp.Employee_ID,
                        "EmployeeName": f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
                        "EmployeePhoto": (
                            get_file_image(emp.Photo) if emp.Photo else None
                        ),
                        "PhoneNumber": emp.Contact_Number,
                        "Department": department_names if department_names else None,
                        "Designation": (
                            emp.Designation.Designation_Name
                            if emp.Designation
                            else None
                        ),
                        "Location": (
                            emp.Location.Location_Name if emp.Location else None
                        ),
                        "LocationId": (
                            emp.Location.Location_Id if emp.Location else None
                        ),
                    }
                )

            return JsonResponse(employees_data, safe=False)

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Employee_Report_Details_link(request):
#     if request.method == "GET":
#         try:

#             def get_file_image(filedata):
#                 kind = filetype.guess(filedata)
#                 contenttype1 = "application/pdf"
#                 if kind:
#                     contenttype1 = kind.mime
#                 return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

#             # Get query parameters
#             query = request.GET.get("query", "").strip()
#             designation = request.GET.get("designation", "").strip()
#             location = request.GET.get("location", "").strip()

#             if not location:
#                 return JsonResponse({"warn": "Location not found"})

#             # Base queryset
#             queryset = Employee_Personal_Form_Detials.objects.filter(
#                 ActiveStatus="Yes", Location=location
#             )

#             # Apply search filters
#             if query:
#                 queryset = queryset.filter(
#                     Q(Employee_ID__icontains=query)
#                     | Q(Tittle__Title_Name__icontains=query)
#                     | Q(First_Name__icontains=query)
#                     | Q(Middle_Name__icontains=query)
#                     | Q(Last_Name__icontains=query)
#                     | Q(Contact_Number__icontains=query)
#                 )

#             # Apply designation filter
#             if designation:
#                 try:
#                     designation_id = int(designation)
#                     queryset = queryset.filter(
#                         Designation__Designation_Id=designation_id
#                     )
#                 except ValueError:
#                     return JsonResponse({"error": "Invalid designation ID format"})

#             # Prepare response data
#             employees_data = []
#             for index, emp in enumerate(queryset, start=1):
#                 print("emp", emp)
#                 employees_data.append(
#                     {
#                         "Sl_No": index,
#                         "EmployeeID": emp.Employee_ID,
#                         "EmployeeName": f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
#                         "EmployeePhoto": (
#                             get_file_image(emp.Photo) if emp.Photo else None
#                         ),
#                         "PhoneNumber": emp.Contact_Number,
#                         "Department": (
#                             emp.Department.Department_Name if emp.Department else None
#                         ),
#                         "Designation": (
#                             emp.Designation.Designation_Name
#                             if emp.Designation
#                             else None
#                         ),
#                         "Location": (
#                             emp.Location.Location_Name if emp.Location else None
#                         ),
#                         "LocationId": (
#                             emp.Location.Location_Id if emp.Location else None
#                         ),
#                     }
#                 )

#             return JsonResponse(employees_data, safe=False)

#         except Exception as e:

#             return JsonResponse(
#                 {"error": f"An internal server error occurred: {str(e)}"}, status=500
#             )

#     return JsonResponse({"error": "Method not allowed"}, status=405)


# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Employee_Monthly_Report(request):
#     if request.method == 'GET':
#         try:
#             # Retrieve query parameters
#             date = request.GET.get('date', '').strip()
#             print("date",date)
#             employee_id = request.GET.get('EmployeeID', '').strip()
#             print("employee_id",employee_id)

#             if not date:
#                 return JsonResponse({'warn': 'Date parameter is required'})
#             if not employee_id:
#                 return JsonResponse({'warn': 'EmployeeID parameter is required'})

#             # Parse the year and month from the date parameter
#             try:
#                 year, month = map(int, date.split('-'))
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid date format. Use YYYY-MM.'})

#             print(f"Fetching monthly report for EmployeeID: {employee_id}, Year: {year}, Month: {month}")

#             # Initialize report structure
#             report = {
#                 'present_days': 0,
#                 'paid_salary': 0,  # Can be calculated based on attendance and policies
#                 'advances': [],
#                 'leaves': [],
#                 'ShiftDetails': [],
#             }

#             # Fetch attendance details
#             employee_attendance = Employee_Attendance.objects.filter(
#                 Employee__Employee_ID=employee_id,
#                 Attendance_Status='Present',
#                 Date__year=year,
#                 Date__month=month
#             )
#             print("employee_attendance",employee_attendance)
#             report['present_days'] = employee_attendance.count()

#             employee_paysalary = Employee_PaySlips.objects.filter(
#                 Employee__Employee__Employee_ID=employee_id,
#                 Status='Paid',
#                 PaySlip_Date__year=year,
#                 PaySlip_Date__month=month
#             )
#             print("employee_paysalary",employee_paysalary)

#             # Sum up all paid salaries for the employee in the given month
#             total_paid_salary = employee_paysalary.aggregate(total=Sum('Paid_Salary'))['total'] or 0
#             report['paid_salary'] = total_paid_salary
#             # Fetch advances details
#             employee_advance_details = Employee_Advance_Request.objects.filter(
#                 Employee_Id__Employee__Employee_ID=employee_id,
#                 Status='Approved',
#                 Request_Date__year=year,
#                 Request_Date__month=month
#             )
#             employee_leave_details = Employee_Leave_Register.objects.filter(
#                 Employee_Id__Employee__Employee_ID=employee_id,
#                 Status='Approved',
#                 FromDate__year=year,
#                 FromDate__month=month
#             )
#             # print("employee_leave_details",employee_leave_details)
#             employee_shift_details = ShiftDetails_Master.objects.filter(Employee__Employee_ID=employee_id,Shiftstartdate__year=year,Shiftstartdate__month=month)
#             print("employee_shift_details",employee_shift_details)
#             for index, emp in enumerate(employee_advance_details, start=1):
#                 report['advances'].append({
#                     'Sl_No': index,
#                     'RequestDate': emp.Request_Date.strftime('%d-%m-%Y') if emp.Request_Date else None,
#                     'RequestAmount': emp.Request_Amount if emp.Request_Amount else None,
#                     'RepaymentDue': emp.Repayment_Due if emp.Repayment_Due else None,
#                     'AmountDeductPerMonth': emp.AmountDeduct_PerMonth if emp.AmountDeduct_PerMonth else None,
#                     'Installment_Status': emp.Installment_Status if emp.Installment_Status else None,
#                     'No_of_MonthPaid': emp.No_of_MonthPaid if emp.No_of_MonthPaid else 0,
#                     'PaidAmount': emp.PaidAmount if emp.PaidAmount else 0,
#                     'RequestReason': emp.Request_Reason if emp.Request_Reason else None,
#                     'Status': emp.Status,
#                     'IssuedDate': emp.IssuedDate.strftime('%d-%m-%Y') if emp.IssuedDate else None,
#                 })


#             def parse_time(time_value):
#                 try:
#                     if isinstance(time_value, str):
#                         time_value = datetime.strptime(time_value, '%H:%M:%S')
#                     return time_value.strftime('%I:%M %p') if time_value else None
#                 except Exception:
#                     return None

#             for index, leave in enumerate(employee_leave_details, start=1):
#                 report['leaves'].append({
#                     'Sl_No': index,
#                     'LeaveType': leave.Leave_Type or None,
#                     'PermissionDate': leave.PermissionDate.strftime('%d/%m/%Y') if leave.PermissionDate else None,
#                     'FromDate': leave.FromDate if leave.FromDate else None,
#                     'ToDate': leave.ToDate if leave.ToDate else None,
#                     'DaysCount': leave.DaysCount,
#                     'FromTime': leave.FromTime or None,
#                     'ToTime': leave.ToTime or None,
#                     'Reason': leave.Reason or None,
#                     'HoursCount': leave.HoursCount or None,
#                     'Status': leave.Status,
#                     'Reject_Reason': leave.Reject_Reason or None,


#                 })

#             for index, shift in enumerate(employee_shift_details, start=1):
#                 formatted_intime = parse_time(shift.Intime)
#                 formatted_outtime = parse_time(shift.Outtime)
#                 shift_start_date_str = shift.Shiftstartdate
#                 shift_end_date_str = shift.Shiftenddate


#                 report['ShiftDetails'].append({
#                     'Sl_No': index,
#                     'ShiftName': shift.ShiftName.ShiftName if shift.ShiftName else None,
#                     'Shift_StartTime': shift.Intime,
#                     'Shift_EndTime': shift.Outtime,
#                     'ShiftHours': f"{formatted_intime} - {formatted_outtime}" if formatted_intime and formatted_outtime else None,
#                     'Shift_StartDate': shift_start_date_str,
#                     'Shift_EndDate': shift_end_date_str,
#                     'Status': shift.Status,
#                 })

#             return JsonResponse(report, safe=False)

#         except Exception as e:
#             print('error :',e)
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Employee_Monthly_Report(request):
    if request.method == "GET":
        try:
            # Retrieve query parameters
            date = request.GET.get("date", "").strip()
            employee_id = request.GET.get("EmployeeID", "").strip()

            if not date:
                return JsonResponse({"warn": "Date parameter is required"})
            if not employee_id:
                return JsonResponse({"warn": "EmployeeID parameter is required"})

            # Parse the year and month from the date parameter
            try:
                year, month = map(int, date.split("-"))
            except ValueError:
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM."})

            print(
                f"Fetching monthly report for EmployeeID: {employee_id}, Year: {year}, Month: {month}"
            )

            # Initialize report structure
            report = {
                "present_days": 0,
                "paid_salary": 0,
                "advances": [],
                "leaves": [],
                "ShiftDetails": [],
            }

            # Fetch attendance details
            employee_attendance = Employee_Attendance.objects.filter(
                Employee__Employee_ID=employee_id,
                Attendance_Status="Present",
                Date__year=year,
                Date__month=month,
            )

            print("employee_attendance", employee_attendance)
            report["present_days"] = employee_attendance.count()

            # Fetch salary details
            employee_paysalary = Employee_PaySlips.objects.filter(
                Employee__Employee_ID=employee_id,
                Status="Paid",
                PaySlip_Date__year=year,
                PaySlip_Date__month=month,
            )
            report["paid_salary"] = (
                employee_paysalary.aggregate(total=Sum("Paid_Salary"))["total"] or 0
            )
            print("employee_paysalary", employee_paysalary)
            # Fetch advance details
            employee_advance_details = Employee_Advance_Request.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Status="Approved",
                Request_Date__year=year,
                Request_Date__month=month,
            )
            print("employee_advance_details", employee_advance_details)
            for index, emp in enumerate(employee_advance_details, start=1):
                report["advances"].append(
                    {
                        "Sl_No": index,
                        "RequestDate": (
                            emp.Request_Date.strftime("%d-%m-%Y")
                            if emp.Request_Date
                            else None
                        ),
                        "RequestAmount": emp.Request_Amount,
                        "RepaymentDue": emp.Repayment_Due,
                        "AmountDeductPerMonth": emp.AmountDeduct_PerMonth,
                        "Installment_Status": emp.Installment_Status,
                        "No_of_MonthPaid": emp.No_of_MonthPaid,
                        "PaidAmount": emp.PaidAmount,
                        "RequestReason": emp.Request_Reason,
                        "Status": emp.Status,
                        "IssuedDate": (
                            emp.IssuedDate.strftime("%d-%m-%Y")
                            if emp.IssuedDate
                            else None
                        ),
                    }
                )

            # Fetch leave details
            employee_leave_details = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id,
                Status="Approved",
                FromDate__year=year,
                FromDate__month=month,
            )
            print("employee_leave_details", employee_leave_details)
            for index, leave in enumerate(employee_leave_details, start=1):
                report["leaves"].append(
                    {
                        "Sl_No": index,
                        "LeaveType": leave.Leave_Type,
                        "FromDate": leave.FromDate,
                        "ToDate": leave.ToDate,
                        "DaysCount": leave.DaysCount,
                        "Reason": leave.Reason,
                        "Status": leave.Status,
                    }
                )

            # Fetch shift details
            employee_shift_details = ShiftDetails_Master.objects.filter(
                Employee__Employee_ID=employee_id,
                ShiftDate__year=year,
                ShiftDate__month=month,
            )
            print('employee_shift_details :',employee_shift_details)
            for index, shift in enumerate(employee_shift_details, start=1):
                report["ShiftDetails"].append(
                    {
                        "Sl_No": index,
                        "Shift_Id": shift.Shift_Id.ShiftId,
                        "ShiftName": (
                            shift.Shift_Id.ShiftName if shift.Shift_Id else None
                        ),
                        "Shift_StartTime": shift.Shift_Id.StartTime.strftime("%I:%M %p") if shift.Shift_Id.StartTime else '-',
                        "Shift_EndTime": shift.Shift_Id.EndTime.strftime("%I:%M %p") if shift.Shift_Id.EndTime else '-',

                        "Shift_StartDate": shift.ShiftDate,
                        "Status": shift.Status,
                        "ShiftHours": calculate_working_hours(shift.Shift_Id.StartTime.strftime("%I:%M %p") if shift.Shift_Id.StartTime else None,shift.Shift_Id.EndTime.strftime("%I:%M %p") if shift.Shift_Id.EndTime else None)
                    }
                )

            return JsonResponse(report, safe=False)

        except Exception as e:
            print("error :", e)
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


# payroll


@csrf_exempt
@require_http_methods(["POST"])
def insert_EmployeePaySlips(request):
    try:
        print('request :', request.POST)

        # ---------- Utility safe converters ----------
        def safe_str(val, default=""):
            if not val or str(val).lower() in ["undefined", "null", "none"]:
                return default
            return str(val)

        def safe_int(val, default=0):
            try:
                if not val or str(val).lower() in ["undefined", "null", "none", ""]:
                    return default
                return int(val)
            except (TypeError, ValueError):
                return default

        def safe_float(val, default=0.0):
            try:
                if not val or str(val).lower() in ["undefined", "null", "none", ""]:
                    return default
                return float(val)
            except (TypeError, ValueError):
                return default

        def safe_date(val, default=None):
            if not val or str(val).lower() in ["undefined", "null", "none", ""]:
                return default
            return val  # assuming frontend sends YYYY-MM-DD

        # ---------- Extract and clean inputs ----------
        employee_id = safe_str(request.POST.get("employeeid"))
        advance_id = safe_str(request.POST.get("advanceid"))
        location = safe_str(request.POST.get("location"))
        paid_salary = safe_float(request.POST.get("Net_Salary"))
        created_by = safe_str(request.POST.get("created_by"))
        from_date = safe_date(request.POST.get("fromdate"))
        amount_deduct_per_month = safe_int(request.POST.get("AmountDeduct_PerMonth"))
        no_of_month_paid = safe_int(request.POST.get("No_of_MonthPaid"))
        esi_amount = safe_float(request.POST.get("esi_amount"))
        pf_for_employee = safe_float(request.POST.get("pf_for_employee"))
        professional_tax = safe_float(request.POST.get("professional_tax"))
        payable_salary = safe_float(request.POST.get("payable_salary"))
        tds_amount = safe_float(request.POST.get("Tds_Amount"))
        earnings = safe_float(request.POST.get("Earnings"))
        deductions = safe_float(request.POST.get("Deductions"))
        net_salary = safe_float(request.POST.get("Net_Salary"))
        loss_of_pay_amount = safe_float(request.POST.get("LossOfPayAmount"))

        # Convert Allowances and Deductions JSON safely
        allowances_list = []
        deductions_list = []
        try:
            allowances_list = json.loads(safe_str(request.POST.get("PostAlowance", "[]"), "[]"))
        except Exception:
            allowances_list = []
        try:
            deductions_list = json.loads(safe_str(request.POST.get("PostDeduction", "[]"), "[]"))
        except Exception:
            deductions_list = []

        print("allowances_list :", allowances_list)
        print("deductions_list :", deductions_list)
        print("advance_id :", advance_id)

        # ---------- File Validation ----------
        pdf_file = request.FILES.get("pdf")
        if not pdf_file:
            return JsonResponse({"warn": "PDF file is required"})
        pdf_content = pdf_file.read()
        if not pdf_content:
            return JsonResponse({"warn": "Uploaded PDF file is empty"})
        if not employee_id:
            return JsonResponse({"warn": "Employee ID is required"})
        if not location:
            return JsonResponse({"warn": "Location is required"})

        # ---------- Foreign Key validation ----------
        try:
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
        except Employee_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({"warn": "Employee not found"})

        try:
            location_instance = Location_Detials.objects.get(Location_Id=location)
        except Location_Detials.DoesNotExist:
            return JsonResponse({"warn": "Location not found"})

        # ---------- Handle Advance Deduction ----------
        if advance_id and amount_deduct_per_month > 0:
            try:
                advance_details = Employee_Advance_Request.objects.get(Advance_RequestId=advance_id)

                if no_of_month_paid == 0:  # First payment
                    advance_details.AmountDeduct_PerMonth = amount_deduct_per_month
                    advance_details.No_of_MonthPaid = 1
                    advance_details.PaidAmount = amount_deduct_per_month
                else:  # Subsequent payments
                    advance_details.No_of_MonthPaid = no_of_month_paid + 1
                    advance_details.PaidAmount += amount_deduct_per_month

                # Check completion
                if (
                    advance_details.No_of_MonthPaid >= advance_details.Repayment_Due
                    or advance_details.PaidAmount >= advance_details.Request_Amount
                ):
                    advance_details.Installment_Status = "Completed"

                advance_details.save()

            except Employee_Advance_Request.DoesNotExist:
                return JsonResponse({"warn": "Advance record not found"})

        current_date = datetime.now().strftime("%Y-%m-%d")
        final_payslip_date = from_date if from_date else current_date

        # ---------- Create PaySlip ----------
        pay_slip = Employee_PaySlips.objects.create(
            Employee=employee_instance,
            EmployeePayslip=pdf_content,
            PaySlip_Date=final_payslip_date,
            Location=location_instance,
            CreatedBy=created_by,
            Status="PAID",
            Paid_Salary=paid_salary,
            SalaryMonth=current_date,
        )

        # ---------- Create Finance Details ----------
        payslip_finance = Employee_PaySlips_Details.objects.create(
            PaySlip_Id=pay_slip,
            PFAmount=pf_for_employee,
            ProfessionalTax=professional_tax,
            ESIAmount=esi_amount,
            TDSAmount=tds_amount,
            Location=location_instance,
            CreatedBy=created_by,
            PayableSalary=payable_salary,
            TotalEarning=earnings,
            TotalDeduction=deductions,
            NetSalary=net_salary,
            Status="PAID",
            LossOFPay=loss_of_pay_amount,
            AdvanceAmountDeduct=amount_deduct_per_month,
            SalaryMonth=current_date,
            PaySlip_Date=final_payslip_date,
        )

        # ---------- Handle Many-to-Many ----------
        if allowances_list:
            allowances_objects = AllowanceMaster.objects.filter(id__in=allowances_list)
            payslip_finance.Allowances.set(allowances_objects)

        if deductions_list:
            deductions_objects = Deduction_Master.objects.filter(id__in=deductions_list)
            payslip_finance.Deductions.set(deductions_objects)

        return JsonResponse({"success": "Employee PaySlip inserted successfully"}, status=201)

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({"error": "An internal server error occurred"}, status=500)


# employee request payslip


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def EmployeePayslipDownload(request):
    if request.method == "GET":
        try:
            # Get parameters from the query string
            employee_id = request.GET.get("EmployeeID")
            current_year = request.GET.get("Year")

            # Validating inputs
            if not employee_id:
                return JsonResponse({"warn": "Employee ID not found"})

            # Filtering payslips for the employee
            payslipdetails = Employee_PaySlips.objects.filter(
                Employee__Employee_ID=employee_id, SalaryMonth__year=current_year
            )

            # If no payslips found for this employee
            if not payslipdetails.exists():
                return JsonResponse({"warn": "No payslips found for this employee"})

            responsedata = []
            for emp in payslipdetails:
                # Check if the payslip is a file or binary data and handle accordingly
                if isinstance(emp.EmployeePayslip, bytes):
                    # If already in bytes format
                    payslip = base64.b64encode(emp.EmployeePayslip).decode("utf-8")
                else:
                    # If the payslip is a FileField, read it
                    payslip = base64.b64encode(emp.EmployeePayslip.read()).decode(
                        "utf-8"
                    )

                # Create response dictionary for each payslip
                emp_dict = {
                    "EmployeeID": emp.Employee.Employee_ID,
                    "EmployeeName": f"{emp.Employee.Tittle.Title_Name if emp.Employee.Tittle else ''} "
                    f"{emp.Employee.First_Name} {emp.Employee.Middle_Name or ''} {emp.Employee.Last_Name or ''}".strip(),
                    "EmployeePayslip": f"data:application/pdf;base64,{payslip}",
                    "PaySlip_Date": emp.SalaryMonth.strftime(
                        "%Y-%m-%d"
                    ),  # Assuming `SalaryMonth` is a DateField
                }

                responsedata.append(emp_dict)

            return JsonResponse(responsedata, safe=False, status=200)

        except Exception as e:
            # Generic error handling
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    # Method not allowed for any non-GET requests
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def getemployeelistforappraisal(request):
    if request.method == "GET":
        try:
            # Extract location from query parameters
            location = request.GET.get("location")
            is_Employee = request.GET.get('is_Employee', '')
            is_HOD = request.GET.get('is_HOD', '')
            is_HR = request.GET.get('is_HR', '')
            is_admin = request.GET.get('is_admin', '')
            Employeeid = request.GET.get('Employeeid', '')

            if not location:
                return JsonResponse({"warn": "Location not found"}, status=400)

            # Filter employees based on location and active status
            employee_details = Employee_Personal_Form_Detials.objects.filter(
                Location_id=location, ActiveStatus="Yes"
            )

            # If HOD, filter employee list
            if is_HOD == 'true':
                hod = HODMapping.objects.filter(HOD_Employee=Employeeid).first()
                emplist = [employee.Employee_ID for employee in hod.Employee.all()] if hod else []
                emplist.append(Employeeid)
                employee_details = employee_details.filter(pk__in=emplist)

            response_data = []
            index = 1

            # Iterate through the filtered employees
            for emp in employee_details:
                try:
                    # Get financial details
                    finance_details = Financial_History_Detials.objects.get(Employee_id=emp.Employee_ID)

                    last_salary_record = Salary_Maintenance_Detials.objects.filter(
                        Employee=emp, Status='Active'
                    ).first()

                except Financial_History_Detials.DoesNotExist:
                    print(f"⚠️ Finance details not found for Employee {emp.Employee_ID}")
                    continue

                try:
                    # Get current history details
                    history_details = Current_History_Detials.objects.get(Employee_id=emp.Employee_ID)
                except Current_History_Detials.DoesNotExist:
                    print(f"⚠️ History details not found for Employee {emp.Employee_ID}")
                    continue

                # ✅ Handle None safely with default 0
                BasicSalary = last_salary_record.BasicSalary if last_salary_record and last_salary_record.BasicSalary else 0
                Allowancefinal = finance_details.Allowancefinal if finance_details and finance_details.Allowancefinal else 0
                Deduction_amount = finance_details.Deduction_amount if finance_details and finance_details.Deduction_amount else 0
                PfForEmployee = finance_details.PfForEmployee if finance_details and finance_details.PfForEmployee else 0

                if (last_salary_record is None or last_salary_record.BasicSalary is None or 
                    finance_details.Allowancefinal is None or 
                    finance_details.Deduction_amount is None or 
                    finance_details.PfForEmployee is None):
                    print(f"⚠️ Some salary/finance fields are NULL for Employee {emp.Employee_ID} - defaulting to 0")

                GrossSalary = BasicSalary + Allowancefinal - Deduction_amount - PfForEmployee

                # Construct the employee dictionary
                emp_dict = {
                    "id": index,
                    "EmployeeID": emp.Employee_ID,
                    "EmployeeName": (
                        f"{emp.Tittle.Title_Name} "
                        f"{emp.First_Name} "
                        f"{emp.Middle_Name or ''} "
                        f"{emp.Last_Name}"
                    ).strip(),
                    "Designation": (
                        emp.Designation.Designation_Name if emp.Designation else None
                    ),
                    "Department": (
                        emp.Department_Name if hasattr(emp, "Department_Name") else None
                    ),
                    "DateofJoining": (
                        history_details.DateOfJoining if history_details else None
                    ),
                    "Basic_Salary": BasicSalary,
                    "Gross_Salary": GrossSalary,
                    "Salary": finance_details.Salary,
                    "FatherName": (
                        emp.FatherName if hasattr(emp, "FatherName") else None
                    ),
                }

                # Increment index and append to response
                index += 1
                response_data.append(emp_dict)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Log the error and return a generic error response
            print(f"❌ Error occurred: {e}")
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)



@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def employee_performanceamount(request):
    if request.method == "GET":
        try:
            # Extract GET parameters
            employeeid = request.GET.get("employeeid")
            location = request.GET.get("location")
            hikepercentage = request.GET.get("hikepercentage")

            # Check if all required parameters are provided
            if not employeeid or not hikepercentage:
                return JsonResponse({"warn": "Missing employeeid or hikepercentage"})

            hikepercentage = float(hikepercentage)

            # Query employee data using ORM
            if location == "ALL":
                employee = (
                    Employee_Personal_Form_Detials.objects.select_related("Employee_ID")
                    .filter(Employee_ID=employeeid)
                    .first()
                )
            else:
                employee = Employee_Personal_Form_Detials.objects.filter(
                    Employee_ID=employeeid, Location_id=location
                ).first()

            # If no employee is found
            if not employee:
                return JsonResponse({"warn": "Employee not found"})

            try:
                # Get financial details for the employee
                finance_details = Financial_History_Detials.objects.filter(
                    Employee__Employee_ID=employee.Employee_ID
                ).first()
            except Financial_History_Detials.DoesNotExist:
                return JsonResponse(
                    {"warn": "Financial details not found for the employee"}, status=404
                )

            # Access financial details
            basic_salary = finance_details.Salary or 0

            # Calculate hike amount and new pay
            percentage_amount = (
                (hikepercentage / 100) * basic_salary if hikepercentage != 0 else 0
            )
            newpay = round(percentage_amount + basic_salary, 2)

            # Prepare the response data
            data = {"amount": round(percentage_amount, 1), "newpay": newpay}

            return JsonResponse([data], safe=False)

        except Exception as e:
            # Return internal server error
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def employee_allowance(request):
    if request.method == "GET":
        try:
            employeeid = request.GET.get("employeeid")
            print("employeeidwewerw", employeeid)
            location = request.GET.get("location")
            allowancename = request.GET.get("allowancename")
            print("allowancename", allowancename)

            if not employeeid or not location or not allowancename:
                return JsonResponse(
                    {"warn": "Missing employeeid, location, or allowancename"}
                )
            
            allowance_details = EmployeeAllowanceDetails.objects.filter(allowance=allowancename,Status='Active',Employee__Employee_ID=employeeid).first()
            response_data = {
                    "allowance": getattr(allowance_details, 'allowance', 0.0),
                    "percentage": getattr(allowance_details, 'percentage', 0.0),
                    "amount":getattr(allowance_details,'amount',0.00)
                }
            
            print(response_data,'response_data')
            return JsonResponse(response_data)
            














           
            # allowance_fields = {
            #     "HRA": ("HrAllowance", "HRAfinal"),
            #     "MedicalAllowance": ("MedicalAllowance", "MedicalAllowancefinal"),
            #     "SpecialAllowance": ("SpecialAllowance", "SpecialAllowancefinal"),
            #     "TravelAllowance": ("TravelAllowance", "TravelAllowancefinal"),
            # }

            # # Get the relevant fields for the requested allowance
            # if allowancename in allowance_fields:
            #     allowance_field, final_allowance_field = allowance_fields[allowancename]
            #     print(allowance_field,'allowance_field')
            #     print(final_allowance_field,'final_allowance_field')
            #     response_data = {
            #         "allowance": getattr(employee, allowance_field, 0.0),
            #         "allowanceamount": getattr(employee, final_allowance_field, 0.0),
            #     }
               
            # else:
            #     return JsonResponse({"warn": "Invalid allowancename provided"})

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )
    return JsonResponse({"error": "Method not allowed"}, status=405)

from datetime import date as dt_date
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def insert_employee_performance(request):
    if request.method == "POST":
        try:
            # ----------------- Parse request -----------------
            data = json.loads(request.body)
            print("data:", data)

            employee_id = data.get("employeeId")
            location = data.get("location")
            hiketype = data.get("hiketype", "")

            if not employee_id:
                return JsonResponse({"warn": "Employee ID is required"})
            if not location:
                return JsonResponse({"warn": "Location is required"})

            # ----------------- Utility functions -----------------
            def parse_float(value, default=0.0):
                try:
                    return float(value) if value not in [None, ""] else default
                except (ValueError, TypeError):
                    return default

            def parse_int(value, default=0):
                try:
                    return int(value) if value not in [None, ""] else default
                except (ValueError, TypeError):
                    return default

            def convert_ctc_to_lpa(ctc_annual):
                try:
                    return round(ctc_annual / 100000, 1)
                except Exception:
                    return 0.0

            def parse_date(value):
                if not value or value == "":
                    return dt_date.today()
                try:
                    return dt_date.fromisoformat(value)  # expects YYYY-MM-DD
                except Exception:
                    try:
                        from datetime import datetime
                        return datetime.strptime(value, "%d-%b-%Y").date()
                    except Exception:
                        return dt_date.today()

            # ----------------- Extract fields -----------------
            hike_amount = parse_float(data.get("amount"))
            new_pay = parse_float(data.get("newpay"))
            current = parse_float(data.get("current"))
            hike = parse_int(data.get("hike"))
            preallowance = parse_float(data.get("preallowance"))
            preallowanceamount = parse_float(data.get("preallowanceamount"))
            newallowance = parse_int(data.get("newallowance"))
            newallowanceamount = parse_float(data.get("newallowanceamount"))
            finalallowanceamount = parse_float(data.get("finalallowanceamount"))
            approved_by = data.get("approvedby", "")
            created_by = data.get("createdby", "")
            perf_date = parse_date(data.get("date"))
            performance = data.get("performance")
            remarks = data.get("remarks", "")
            allowancename = data.get("allowancename", "")

            # ----------------- Fetch employee & location -----------------
            try:
                employee_instance = Employee_Personal_Form_Detials.objects.get(
                    Employee_ID=employee_id
                )
            except Employee_Personal_Form_Detials.DoesNotExist:
                return JsonResponse({"warn": "Employee not found"})
            except Exception as e:
                return JsonResponse({"error": f"Error fetching employee: {str(e)}"})

            try:
                location_instance = Location_Detials.objects.get(Location_Id=location)
            except Location_Detials.DoesNotExist:
                return JsonResponse({"warn": "Location not found"})
            except Exception as e:
                return JsonResponse({"error": f"Error fetching location: {str(e)}"})

            # ----------------- Transactional Update -----------------
            with transaction.atomic():

                # ---- HikeType: Increment ----
                if hiketype == "Increment":
                    saldetails = Financial_History_Detials.objects.filter(
                        Employee=employee_instance
                    ).first()
                    if not saldetails:
                        return JsonResponse({"warn": "No financial history found for employee"})

                    saldetails.Salary = new_pay
                    
                    saldetails.save()

                    # Inactivate old increments
                    empperformance = Employee_Performance.objects.filter(
                        Employee=employee_instance, Status="Active", HikeType="Increment"
                    )
                    for perf in empperformance:
                        perf.Status = "InActive"
                        perf.save()

                    # New performance record
                    Employee_Performance.objects.create(
                        Employee=employee_instance,
                        HikeType=hiketype,
                        Date=perf_date,
                        Current_Payment=current,
                        Performance_Rate=performance,
                        Hike_Percentage=hike,
                        Hike_Amount=hike_amount,
                        New_Pay=new_pay,
                        Remarks=remarks,
                        ApprovedBy=approved_by,
                        Location_Name=location_instance,
                        CreatedBy=created_by,
                    )

                    # Prevent division by zero
                    base_percent = (
                        saldetails.BasicSalary_Percentage
                        if saldetails and saldetails.BasicSalary_Percentage
                        else 60
                    )
                    if base_percent == 0:
                         base_percent = 60

                    # Compute basic & ctc
                    print(base_percent,'Base_percent')
                    print(new_pay,'Base_percent')
                    basic_new = new_pay * (base_percent / 100)
                    saldetails.BasicSalary=basic_new
                    saldetails.save()
                    print(basic_new,'Base_percent')
                    yearlysal = basic_new * 12
                    ctc_in_lpa = convert_ctc_to_lpa(yearlysal)
                    
                    oldsalarydetails = Salary_Maintenance_Detials.objects.filter(
                        Employee=employee_instance, Status="Active"
                    )
                    last_salary_record = oldsalarydetails.order_by("-created_at").first()

                    for oldsal in oldsalarydetails:
                        oldsal.Status = "InActive"
                        oldsal.save()

                    lastallowances = (
                        last_salary_record.EmployeeAllowanceDetails.all()
                        if last_salary_record
                        else []
                    )

                    New_sal = Salary_Maintenance_Detials(
                        Employee=last_salary_record.Employee,
                        EmployeementHistory=last_salary_record.EmployeementHistory,
                        EmployeeMedicalInfo=last_salary_record.EmployeeMedicalInfo,
                        EmployeeCurrentHistoryInfo=last_salary_record.EmployeeCurrentHistoryInfo,
                        BasicSalary=basic_new,
                        ctc=ctc_in_lpa,
                        AccountHolderName=last_salary_record.AccountHolderName,
                        AccountNumber=last_salary_record.AccountNumber,
                        BankName=last_salary_record.BankName,
                        Branch=last_salary_record.Branch,
                        IfscCode=last_salary_record.IfscCode,
                        PanNumber=last_salary_record.PanNumber,
                        created_by=approved_by,
                        Location=last_salary_record.Location,
                    )
                    New_sal.save()
                    New_sal.EmployeeAllowanceDetails.set(lastallowances)

                    return JsonResponse(
                        {"success": "Increment performance data inserted successfully"},
                        status=201,
                    )

                # ---- HikeType: Allowance ----
                elif hiketype == "Allowance":
                    empperformance = Employee_Performance.objects.filter(
                        Employee=employee_instance, Status="Active", HikeType="Allowance"
                    )
                    for perf in empperformance:
                        perf.Status = "InActive"
                        perf.save()

                    Employee_Performance.objects.create(
                        Employee=employee_instance,
                        HikeType=hiketype,
                        AllowanceName=allowancename,
                        PreviousAllowance=preallowance,
                        PreviousAllowanceAmount=preallowanceamount,
                        NewAllowance=newallowance,
                        NewAllowanceAmount=newallowanceamount,
                        FinalAllowanceAmount=finalallowanceamount,
                        Date=perf_date,
                        Performance_Rate=performance,
                        Remarks=remarks,
                        ApprovedBy=approved_by,
                        Location_Name=location_instance,
                        CreatedBy=created_by,
                    )

                    oldallowancedetails = EmployeeAllowanceDetails.objects.filter(
                        Employee__Employee_ID=employee_id,
                        allowance=allowancename,   # ⚠️ confirm model field name
                        Status="Active",
                    ).first()
                    if oldallowancedetails:
                        oldallowancedetails.Status = "InActive"
                        oldallowancedetails.save()

                    newallowancedetails = EmployeeAllowanceDetails(
                        Employee=employee_instance,
                        allowance=allowancename,
                        percentage=newallowance,
                        amount=finalallowanceamount,
                    )
                    newallowancedetails.save()

                    oldsalarydetails = Salary_Maintenance_Detials.objects.filter(
                        Employee=employee_instance, Status="Active"
                    )
                    last_salary_record = oldsalarydetails.order_by("-created_at").first()

                    last_allowances = (
                        last_salary_record.EmployeeAllowanceDetails.filter(Status="Active")
                        if last_salary_record
                        else []
                    )

                    for oldsal in oldsalarydetails:
                        oldsal.Status = "InActive"
                        oldsal.save()

                    New_sal = Salary_Maintenance_Detials(
                        Employee=last_salary_record.Employee,
                        EmployeementHistory=last_salary_record.EmployeementHistory,
                        EmployeeMedicalInfo=last_salary_record.EmployeeMedicalInfo,
                        EmployeeCurrentHistoryInfo=last_salary_record.EmployeeCurrentHistoryInfo,
                        BasicSalary=last_salary_record.BasicSalary,
                        ctc=last_salary_record.ctc,
                        AccountHolderName=last_salary_record.AccountHolderName,
                        AccountNumber=last_salary_record.AccountNumber,
                        BankName=last_salary_record.BankName,
                        Branch=last_salary_record.Branch,
                        IfscCode=last_salary_record.IfscCode,
                        PanNumber=last_salary_record.PanNumber,
                        created_by=approved_by,
                        Location=last_salary_record.Location,
                    )
                    New_sal.save()
                    New_sal.EmployeeAllowanceDetails.set(last_allowances)
                    New_sal.EmployeeAllowanceDetails.add(newallowancedetails)

                    return JsonResponse(
                        {"success": "Allowance performance data inserted successfully"},
                        status=201,
                    )

                else:
                    return JsonResponse({"warn": "Invalid HikeType"})

        except ValueError as ve:
            return JsonResponse({"error": f"Invalid data type: {str(ve)}"})
        except Exception as e:
            print(f"❌ Internal Server Error: {str(e)}")
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_employeeperformance(request):
    if request.method == "GET":
        try:
            location = request.GET.get("location")
            if not location:
                return JsonResponse({"warn": "Location not found"})

            # Filter Employee_Performance for the given location and HikeType as 'Allowance'
            employee_performance = Employee_Performance.objects.filter(
                Location_Name_id=location, HikeType="Allowance",Status='Active'
            )

            # Prepare response data
            response_data = []
            index = 1
            for employee in employee_performance:
                employee_dict = {
                    "Sl_No": index,
                    "EmployeeID": employee.Employee.Employee_ID,
                    "EmployeeName": f"{employee.Employee.Tittle.Title_Name} {employee.Employee.First_Name} {employee.Employee.Middle_Name or ''} {employee.Employee.Last_Name}".strip(),
                    "date": employee.Date,
                    "Designation": employee.Employee.Designation.Designation_Name,
                    "HikeType": employee.HikeType,
                    "AllowanceName": employee.AllowanceName,
                    "PreviousAllowance": employee.PreviousAllowance,
                    "PreviousAllowanceAmount": employee.PreviousAllowanceAmount,
                    "NewAllowance": employee.NewAllowance,
                    "NewAllowanceAmount": employee.NewAllowanceAmount,
                    "FinalAllowanceAmount": employee.FinalAllowanceAmount,
                    "Remarks": employee.Remarks,
                    "ApprovedBy": employee.ApprovedBy,
                }
                index += 1
                response_data.append(employee_dict)

            # If no data is found, return empty array
            if not response_data:
                return JsonResponse([], safe=False)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Add_Complaint(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Received Complaint Data:", data)

            # Extracting data from the request
            Employeeid = data.get("EmployeeId")
            Complaint = data.get("Complaint", "")
            IncidentDate = data.get("IncidentDate", "")
            IncidentTime = data.get("IncidentTime", "")
            ComplaintEmployeeId = data.get("ComplaintEmployeeId")
            ComplaintEmployeeName = data.get("ComplaintEmployeeName", "")
            ComplaintEmployeeDepartment = data.get("ComplaintEmployeeDepartment", "")
            Remarks = data.get("Remarks", "")
            Description = data.get("Description", "")
            location = data.get("location")
            witness = data.get("witness", "")
            createdby = data.get("createdby", "")
            Complaint_Employee_instance = None

            # Validation for mandatory fields
            if not Employeeid:
                return JsonResponse({"warn": "Employee ID is required."})
            if not location:
                return JsonResponse({"warn": "Location is required."})

            # Validate location
            try:
                location_ins = Location_Detials.objects.get(Location_Id=location)
                print("location_ins", location_ins)
            except Location_Detials.DoesNotExist:
                return JsonResponse({"warn": "Location not found"})

            # Check if Employee exists
            try:
                Employee_instance = Employee_Personal_Form_Detials.objects.get(
                    Employee_ID=Employeeid
                )
            except Employee_Personal_Form_Detials.DoesNotExist:
                return JsonResponse({"warn": "Employee not found."})

            try:
                Department_Detials_instance = Department_Detials.objects.get(
                    Department_Id=ComplaintEmployeeDepartment
                )
            except Department_Detials.DoesNotExist:
                return JsonResponse({"warn": "Department not found."})

            # Check if ComplaintEmployeeId is provided
            if ComplaintEmployeeId:
                try:
                    Complaint_Employee_instance = (
                        Employee_Personal_Form_Detials.objects.get(
                            Employee_ID=ComplaintEmployeeId
                        )
                    )
                except Employee_Personal_Form_Detials.DoesNotExist:
                    return JsonResponse({"warn": "Against Employee not found."})

            # If no ComplaintEmployeeId is provided, search by name and department
            elif ComplaintEmployeeName and ComplaintEmployeeDepartment:
                try:
                    # Normalize the input value (ComplaintEmployeeName) by removing spaces and converting to lowercase
                    normalized_complaint_name = ComplaintEmployeeName.replace(
                        " ", ""
                    ).lower()
                    print("normalized_complaint_name", normalized_complaint_name)

                    # Fetch all employees in the given department
                    employees = Employee_Personal_Form_Detials.objects.filter(
                        Department_id=ComplaintEmployeeDepartment
                    )

                    # Initialize Complaint_Employee_instance
                    for employee in employees:
                        print("employee", employee)
                        # Normalize the employee name fields
                        normalized_employee_name = employee.First_Name.replace(
                            " ", ""
                        ).lower()
                        print("normalized_employee_name", normalized_employee_name)
                        normalized_employee_middle_name = (
                            employee.Middle_Name.replace(" ", "").lower()
                            if employee.Middle_Name
                            else ""
                        )
                        print(
                            "normalized_employee_middle_name",
                            normalized_employee_middle_name,
                        )
                        normalized_employee_last_name = (
                            employee.Last_Name.replace(" ", "").lower()
                            if employee.Last_Name
                            else ""
                        )
                        print(
                            "normalized_employee_last_name",
                            normalized_employee_last_name,
                        )

                        # Check for name match
                        if normalized_employee_name == normalized_complaint_name:
                            Complaint_Employee_instance = (
                                employee  # Assign the full employee instance
                            )
                        elif (
                            normalized_employee_name + normalized_employee_middle_name
                        ) == normalized_complaint_name:
                            Complaint_Employee_instance = (
                                employee  # Assign the full employee instance
                            )
                        elif (
                            normalized_employee_name
                            + normalized_employee_middle_name
                            + normalized_employee_last_name
                        ) == normalized_complaint_name:
                            print(
                                "sdsdas",
                                normalized_employee_name
                                + normalized_employee_middle_name
                                + normalized_employee_last_name,
                            )
                            Complaint_Employee_instance = (
                                employee  # Assign the full employee instance
                            )
                            print(
                                "Complaint_Employee_instance",
                                Complaint_Employee_instance,
                            )

                    if not Complaint_Employee_instance:
                        return JsonResponse(
                            {
                                "warn": "Against Employee not found with the provided name and department."
                            }
                        )

                except Exception as e:
                    print(f"Error in matching complaint employee: {e}")
                    return JsonResponse(
                        {"error": "Error in matching against employee."}, status=500
                    )

            # Create the complaint entry in the database
            Employee_Complaint.objects.create(
                EmployeeId=Employee_instance,
                Complaint=Complaint,
                IncidentDate=IncidentDate,
                IncidentTime=IncidentTime,
                Description=Description,
                Remarks=Remarks,
                AgainstEmployeeId=Complaint_Employee_instance,  # Assign the full employee instance
                AgainstEmployeeName=ComplaintEmployeeName,
                AgainstEmployeeDepartment=Department_Detials_instance,
                Witness=witness,
                Location_Name=location_ins,
                CreatedBy=createdby,
            )

            return JsonResponse(
                {"success": "Complaint registered successfully."}, status=201
            )

        except Exception as e:
            print("Error in Add_Complaint:", str(e))
            return JsonResponse(
                {"error": "An internal server error occurred."}, status=500
            )

    return JsonResponse({"error": "Method not allowed."}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Complaint_Details(request):
    if request.method == "GET":
        try:
            # Get employee ID from the query parameters
            employeeid = request.GET.get("employeeid")
            print("employeeidcomp[lsint]", employeeid)
            if not employeeid:
                return JsonResponse({"warn": "Previous Complaint not found"})

            # Fetch complaint details for the given employee ID
            employee_complaintdetails = Employee_Complaint.objects.filter(
                EmployeeId__Employee_ID=employeeid
            )
            print("employee_complaintdetails", employee_complaintdetails)

            # Prepare response data
            response_data = []
            index = 1
            for employee in employee_complaintdetails:
                # Prepare individual complaint details dictionary
                employeedict = {
                    "id": index,
                    "employeeid": employee.EmployeeId.Employee_ID,
                    "Employeename": f"{employee.EmployeeId.Tittle.Title_Name if employee.EmployeeId.Tittle else ''} {employee.EmployeeId.First_Name or ''} {employee.EmployeeId.Middle_Name or ''} {employee.EmployeeId.Last_Name or ''}".strip(),
                    "Complaint": employee.Complaint,
                    "IncidentDate": employee.IncidentDate,
                    "IncidentTime": employee.IncidentTime,
                    "Description": employee.Description,
                    "Remarks": employee.Remarks,
                    "AgainstEmployeeId": (
                        employee.AgainstEmployeeId.Employee_ID
                        if employee.AgainstEmployeeId
                        else None
                    ),
                    "AgainstEmployeeName": f"{employee.AgainstEmployeeId.Tittle.Title_Name if employee.AgainstEmployeeId.Tittle else ''} {employee.AgainstEmployeeId.First_Name or ''} {employee.AgainstEmployeeId.Middle_Name or ''} {employee.AgainstEmployeeId.Last_Name or ''}".strip(),
                    "AgainstEmployeeDepartment": employee.AgainstEmployeeDepartment.Department_Name,
                    "Witness": employee.Witness if employee.Witness else "",
                    "CreatedBy": employee.CreatedBy,
                    "Status": employee.Status,
                }
                index += 1
                response_data.append(employeedict)

            # Return the response with all the complaints
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse(
                {"error": "An internal server error occurred."}, status=500
            )

    return JsonResponse({"error": "Method not allowed."}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def All_Complaint_list(request):
    if request.method == "GET":
        try:
            location = request.GET.get("location", None)
            if not location:
                return JsonResponse({"warn": "Location not provided."})

            # Fetch all complaints for the specified location with 'Pending' status
            all_complaint_details = Employee_Complaint.objects.filter(
                Location_Name=location, Status="Pending"
            )

            if not all_complaint_details.exists():
                return JsonResponse(
                    {"message": "No complaints found for the specified location."}
                )

            response_data = []
            for index, employee in enumerate(all_complaint_details, start=1):
                employeedict = {
                    "id": index,
                    "slno": employee.Complaint_Id,
                    "employeeid": employee.EmployeeId.Employee_ID,
                    "Employeename": f"{employee.EmployeeId.Tittle.Title_Name if employee.EmployeeId.Tittle else ''} "
                    f"{employee.EmployeeId.First_Name or ''} "
                    f"{employee.EmployeeId.Middle_Name or ''} "
                    f"{employee.EmployeeId.Last_Name or ''}".strip(),
                    "Complaint": employee.Complaint,
                    "IncidentDate": employee.IncidentDate,
                    "IncidentTime": employee.IncidentTime,
                    "Description": employee.Description or "",
                    "Remarks": employee.Remarks or "",
                    "AgainstEmployeeId": (
                        employee.AgainstEmployeeId.Employee_ID
                        if employee.AgainstEmployeeId
                        else None
                    ),
                    "AgainstEmployeeName": f"{employee.AgainstEmployeeId.Tittle.Title_Name if employee.AgainstEmployeeId and employee.AgainstEmployeeId.Tittle else ''} "
                    f"{employee.AgainstEmployeeId.First_Name if employee.AgainstEmployeeId else ''} "
                    f"{employee.AgainstEmployeeId.Middle_Name if employee.AgainstEmployeeId else ''} "
                    f"{employee.AgainstEmployeeId.Last_Name if employee.AgainstEmployeeId else ''}".strip(),
                    "AgainstEmployeeDepartment": (
                        employee.AgainstEmployeeDepartment.Department_Name
                        if employee.AgainstEmployeeDepartment
                        else ""
                    ),
                    "Witness": employee.Witness or "",
                    "CreatedBy": employee.CreatedBy,
                    "Status": employee.Status,
                }
                response_data.append(employeedict)

            return JsonResponse(response_data, safe=False, status=200)

        except Exception as e:
            print("Error in All_Complaint_list:", str(e))
            return JsonResponse(
                {"error": "An internal server error occurred."}, status=500
            )

    return JsonResponse({"error": "Method not allowed."}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def insert_ComplaintActions(request):
    try:
        data = json.loads(request.body)
        print("complaintaction", data)

        # Extracting data from request
        Complaint = data.get("slno", None)
        hraction = data.get("status", "")
        fromdatestr = data.get("fromdate", None)
        fromdate = fromdatestr if fromdatestr != "" else None
        todatestr = data.get("todate", None)
        todate = todatestr if todatestr != "" else None
        remarks = data.get("remarks", "")
        createdby = data.get("createdby", "")
        location = data.get("location", None)

        # Validate Complaint
        if not Complaint:
            return JsonResponse({"warn": "Complaint Details not found"})

        # Fetch related instances
        try:
            complaint_instance = Employee_Complaint.objects.get(Complaint_Id=Complaint)
        except Employee_Complaint.DoesNotExist:
            return JsonResponse({"warn": "Complaint Id not found"})

        try:
            location_instance = Location_Detials.objects.get(Location_Id=location)
        except Location_Detials.DoesNotExist:
            return JsonResponse({"warn": "Location not found"})

        # Create HR Complaint Action record
        HR_ComplaintAction.objects.create(
            Complaint=complaint_instance,
            HrAction=hraction,
            Remarks=remarks,
            FromDate=fromdate,
            ToDate=todate,
            Location_Name=location_instance,
            CreatedBy=createdby,
        )

        # Update Complaint status
        complaint_instance.Status = hraction
        complaint_instance.save()

        return JsonResponse({"success": "Complaint Action successfully added"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse(
            {"error": f"An internal server error occurred: {str(e)}"}, status=500
        )

    return JsonResponse({"error": "Method not allowed"}, status=405)


# circular


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Employee_Details_by_Designation(request):
    if request.method == "GET":
        try:
            # Retrieve the designation ID from the request
            Designationid = request.GET.get("Designation")
            print("Designationid", Designationid)

            # Validate the designation ID
            if not Designationid:
                return JsonResponse({"warn": "Designation not provided"})

            # Fetch employees based on the designation
            if Designationid != "All":
                employees_by_Designation = (
                    Employee_Personal_Form_Detials.objects.filter(
                        Designation__Designation_Id=Designationid, ActiveStatus="Yes"
                    )
                )
            else:
                employees_by_Designation = (
                    Employee_Personal_Form_Detials.objects.filter(ActiveStatus="Yes")
                )

            # Check if any employees are found
            print("employees_by_Designation", employees_by_Designation)
            if not employees_by_Designation.exists():
                return JsonResponse(
                    {"warn": "No employee details found for the provided designation"}
                )

            # Prepare the response data
            employees_data = []
            for emp in employees_by_Designation:
                emp_dict = {
                    "id": emp.pk,
                    "EmployeeName": f"{emp.Tittle.Title_Name if emp.Tittle else ''} "
                    f"{emp.First_Name or ''} "
                    f"{emp.Middle_Name or ''} "
                    f"{emp.Last_Name or ''}".strip(),
                    "designation": (
                        emp.Designation.Designation_Name if emp.Designation else None
                    ),
                    "Designationid": (
                        emp.Designation.Designation_Id if emp.Designation else None
                    ),
                }
                employees_data.append(emp_dict)

            # Return the employee details
            return JsonResponse(employees_data, safe=False)

        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error occurred: {e}")
            return JsonResponse(
                {"error": "An internal server error occurred"}, status=500
            )

    # Return error for unsupported methods
    return JsonResponse({"error": "Method not allowed"}, status=405)


# insert circular


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Add_Circular(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not Allowed"}, status=405)

    try:
        data = json.loads(request.body)
        required_fields = [
            "EmployeeId",
            "Date",
            "Time",
            "Venue",
            "location",
            "CircularType",
        ]
        print("data :",data)
        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({"warn": f"Missing required field: {field}"})

        # Extract data
        employee_id = data["EmployeeId"]
        subject = data.get("Subject", "")
        remarks = data.get("Remarks", "")
        date = data["Date"]
        time = data["Time"]
        venue = data["Venue"]
        location = data["location"]
        created_by = data.get("createdby", "")
        circular_type = data["CircularType"]
        selected_employees = data.get("SelectedEmployee", [])
        selected_departments = data.get("selectedDepartment", [])
        Priority = data.get("Priority")
        # Fetch instances
        location_instance = get_object_or_404(
            Location_Detials, Location_Id=location, error_message="Location not found"
        )
        venue_instance = get_object_or_404(
            Administration_Master_Details,
            Administration_Id=venue,
            error_message="Venue not found",
        )
        employee_instance = get_object_or_404(
            Employee_Personal_Form_Detials,
            Employee_ID=employee_id,
            error_message="Creating Employee not found",
        )
        circular_instance = None
        # # Create circular
        circular_instance = Circular_Details.objects.create(
            CircularCreateEmployee=employee_instance,
            CircularDate=date,
            CircularTime=time,
            Venue=venue_instance,
            Subject=subject,
            Remarks=remarks,
            Location_Name=location_instance,
            CreatedBy=created_by,
        )

        # Handle circular type associations
        if circular_type == "Employee" and selected_employees:
            create_circular_employees(
                    circular_instance, selected_employees, location_instance
            )
            
            print("circular_type :", circular_type)

            try:
                # Create only one notification for the circular
                notifyins = Notification.objects.create(
                    receiver_type="EMPLOYEE",
                    notification_type="CIRCULAR",
                    message=f"{subject} {remarks}",
                    is_read=False,
                    created_by=employee_instance,
                    priority=Priority,
                    circular_id=circular_instance
                )

                # Get all employee instances in one query
                employee_ids = [res.get("id") for res in selected_employees]
                employee_instances = Employee_Personal_Form_Detials.objects.filter(Employee_ID__in=employee_ids)

                # Add all employees to the recipients field in one step
                notifyins.recipients.add(*employee_instances)
                NotificationReadStatus.objects.bulk_create([
        NotificationReadStatus(notification=notifyins, employee=employee, is_read=False)
        for employee in employee_instances
    ])
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)

        elif circular_type == "Department" and selected_departments:
            create_circular_departments(
                circular_instance, selected_departments, location_instance
            )
            for dept in selected_departments:
                department_instance = get_object_or_404(Department_Detials, id=dept.get("id"))
                notifyins = Notification.objects.create(
                    receiver_type="DEPARTMENT",
                    department=department_instance,
                    notification_type="CIRCULAR",
                    message=f"{subject} {remarks}",
                    is_read=False,
                    created_by=employee_instance,
                    priority=Priority,
                    circular_id=circular_instance
                )

        return JsonResponse({"success": "Circular created successfully"})

    except ValueError as e:
        return JsonResponse({"error": "Invalid JSON input", "details": str(e)})
    except Exception as e:
        # Log the exception in the backend
        print(f"Error: {str(e)}")
        return JsonResponse(
            {"error": "An internal server error occurred", "details": str(e)},
            status=500,
        )


# Helper functions
def get_object_or_404(model, **kwargs):
    error_message = kwargs.pop("error_message", "Object not found")
    try:
        return model.objects.get(**kwargs)
    except model.DoesNotExist:
        raise ValueError(error_message)


def create_circular_employees(circular, employees, location_instance):
    for res in employees:
        employee_id = res.get("id")
        employee_instance = get_object_or_404(
            Employee_Personal_Form_Detials,
            Employee_ID=employee_id,
            error_message=f"Receiver Employee with ID {employee_id} not found",
        )
        Circular_Employee.objects.create(
            Circular=circular,
            Location_Name=location_instance,
            Employee=employee_instance,
        )


def create_circular_departments(circular, departments, location_instance):
    for dep in departments:
        department_id = dep.get("id")
        department_instance = get_object_or_404(
            Department_Detials,
            Department_Id=department_id,
            error_message=f"Department with ID {department_id} not found",
        )
        Circular_Department.objects.create(
            Circular=circular,
            Department=department_instance,
            Location_Name=location_instance,
        )


# circular get
@csrf_exempt
@require_http_methods(["GET"])
def get_circular_Details(request):
    try:
        status = request.GET.get("status", "")
        print("Status:", status)

        # Fetch queryset based on status
        queryset = Circular_Details.objects.all()
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))
        else:
            queryset = queryset.filter(Status="Pending")

        circular_register_data = []

        # Iterate through circulars
        for idx, register in enumerate(queryset, start=1):
            formatted_date = datetime.strptime(
                str(register.CircularDate), "%Y-%m-%d"
            ).strftime("%d/%m/%Y")
            formatted_time = datetime.strptime(
                str(register.CircularTime), "%H:%M:%S"
            ).strftime("%I:%M %p")
            appointment_dict = {
                "id": idx,
                "CreteEmployeeid": (
                    register.CircularCreateEmployee_id
                    if register.CircularCreateEmployee
                    else None
                ),
                "CreateEmployeeName": f"{register.CircularCreateEmployee.Tittle.Title_Name if register.CircularCreateEmployee and register.CircularCreateEmployee.Tittle else ''} "
                f"{register.CircularCreateEmployee.First_Name or ''} "
                f"{register.CircularCreateEmployee.Middle_Name or ''} "
                f"{register.CircularCreateEmployee.Last_Name or ''}".strip(),
                "Createdesignation": (
                    register.CircularCreateEmployee.Designation.Designation_Name
                    if register.CircularCreateEmployee.Designation
                    else None
                ),
                "Date": formatted_date,
                "Time": formatted_time,
                "Subject": register.Subject or None,
                "Remarks": register.Remarks or None,
                "Venue": register.Venue.Administration_Name if register.Venue else None,
                "VenueId": register.Venue.Administration_Id if register.Venue else None,
                "Location": (
                    register.Location_Name.Location_Name
                    if register.Location_Name
                    else None
                ),
                "Createdby": register.CreatedBy,
                "Status": register.Status,
                "SelectedDepartment": [],
                "SelectedEmployee": [],
             
            }

            # Fetch associated employees for the circular
            employee_instances = Circular_Employee.objects.filter(Circular=register.pk)
            for emp in employee_instances:
                receivedetail = NotificationReadStatus.objects.filter(employee=emp.Employee.pk,notification__notification_type="CIRCULAR").first()
                print("receivedetail.notification:",receivedetail.notification.pk)
                notifydetails = Notification.objects.filter(pk=receivedetail.notification.pk).first()
                if  receivedetail:
                    if receivedetail:
                        
                        if receivedetail.is_read:
                            print("=========>")
                            circular_delivery_status = "Seen"
                            delivery_datetime = receivedetail.read_at.strftime("%d-%m-%Y %I:%M %p")
                        else:
                            circular_delivery_status = "Delivered"
                            delivery_datetime = receivedetail.notification.created_at.strftime("%d-%m-%Y %I:%M %p")
                    else:
                        circular_delivery_status = "Not Delivered"
                        delivery_datetime = None
                    delivery_datetime = receivedetail.notification.created_at.strftime("%d-%m-%Y %I:%M %p")
                else:
                    circular_delivery_status = "Not Delivered"
                    delivery_datetime = None
                    
                appointment_dict["SelectedEmployee"].append(
                    {
                        "id": emp.pk,
                        "Employeeid": emp.Employee.pk if emp.Employee else None,
                        "EmployeeName": f"{emp.Employee.Tittle.Title_Name if emp.Employee and emp.Employee.Tittle else ''} "
                        f"{emp.Employee.First_Name or ''} "
                        f"{emp.Employee.Middle_Name or ''} "
                        f"{emp.Employee.Last_Name or ''}".strip(),
                        "Designation": (
                            emp.Employee.Designation.Designation_Name
                            if emp.Employee.Designation
                            else None
                        ),
                        "DesignationId": (
                            emp.Employee.Designation.Designation_Id
                            if emp.Employee.Designation
                            else None
                        ),
                        "Status": emp.Status,
                        "Circular": emp.Circular.pk,
                           "SendTime": receivedetail.notification.created_at.strftime("%d-%m-%Y %I:%M %p"),
                "is_Read": f"""Circular Viewed at {receivedetail.read_at.strftime("%d-%m-%Y %I:%M %p")}""" if receivedetail.is_read is True else "Not Yet Opened", 
                "read_by": receivedetail.employee.First_Name if receivedetail.employee else "",
                "Photo": f"""data:image/jpeg;base64,{base64.b64encode(emp.Employee.Photo).decode()}""" if emp.Employee.Photo else None,
                "CircularDeliveryStatus": circular_delivery_status,
            "DeliveryDateTime": delivery_datetime,
             "message": register.Remarks or None,
             "notification_type": notifydetails.notification_type,
             "priority": notifydetails.priority,
             "created_at_ago": notifydetails.created_at
                    }
                )

            # Fetch associated departments for the circular
            department_instances = Circular_Department.objects.filter(
                Circular=register.pk
            )
            for dep in department_instances:
                appointment_dict["SelectedDepartment"].append(
                    {
                        "id": dep.pk,
                        "Department": (
                            dep.Department.Department_Name if dep.Department else None
                        ),
                        "Departmentid": (
                            dep.Department.Department_Id if dep.Department else None
                        ),
                        "Circular": dep.Circular.pk,
                    }
                )

            circular_register_data.append(appointment_dict)

        # Return the collected data as JSON
        return JsonResponse(circular_register_data, safe=False, status=200)

    except Exception as e:
        # Log the error for debugging (avoid exposing raw errors to users in production)
        print(f"Error in get_circular_Details: {e}")
        return JsonResponse(
            {"error": "An unexpected error occurred. Please try again later."},
            status=500,
        )



@csrf_exempt
def DutyAssign_IndEmployee(request):
    try:
        data = json.loads(request.body)
        # print('data :', data)
        shiftdata = data.get('shiftdata', [])
        username = data.get("username")
        bulkAssign = data.get("bulkAssign")
        print("bulkAssign:",bulkAssign)
        response_data = []

        if bulkAssign is True:
            selectedEmployees = data.get("selectedEmployees", [])
            print('selectedEmployees :',selectedEmployees)
            if not selectedEmployees:
                return JsonResponse({'Error': 'No employees selected for bulk assignment'}, status=400)
            location_instance = (
                Location_Detials.objects.filter(Location_Id=data.get("Location_Name")).first()
                if data.get("Location_Name") else None
            )
            for emp in selectedEmployees:
                employee_id = emp.get("Employee_ID") if isinstance(emp, dict) else emp
                employee = Employee_Personal_Form_Detials.objects.filter(Employee_ID=employee_id).first()
                if not employee:
                    response_data.append({'message': f'Invalid Employee ID: {employee_id}'})
                    continue

                # For each employee, loop through each shift in shiftdata.
                for shift in shiftdata:
                    if not shift.get("ShiftDate") or not shift.get("Shift_Id"):
                        response_data.append({
                            'message': f'Invalid shift data for employee {employee_id}'
                        })
                        continue

                    # Check if a shift is already assigned for this employee on the given date.
                    existing_shift = ShiftDetails_Master.objects.filter(
                        Employee=employee,
                        ShiftDate=shift.get("ShiftDate")
                    ).first()

                    if existing_shift:
                        response_data.append({
                            "message": f"Cannot assign shift on {shift.get('ShiftDate')} for employee {employee_id}. Employee already assigned shift.",
                            "previous_shift": {
                                "Shift_Id": existing_shift.Shift_Id.ShiftId,
                                "ShiftDate": existing_shift.ShiftDate,
                                "Status": existing_shift.Status
                            }
                        })
                        continue

                    # Create a copy of the shift data so that changes for one employee don't affect the next.
                    shift_copy = shift.copy()
                    shift_copy["Employee"] = employee.pk

                    # Get the duty roster instance based on the provided Shift_Id.
                    duty_rouster_instance = DutyRousterMaster.objects.filter(
                        ShiftId=shift.get("Shift_Id")
                    ).first()
                    if not duty_rouster_instance:
                        response_data.append({
                            'message': f'Invalid Shift ID {shift.get("Shift_Id")} for employee {employee_id}'
                        })
                        continue

                    shift_copy["Shift_Id"] = duty_rouster_instance.pk
                    if location_instance:
                        shift_copy.setdefault("Location_Name", location_instance.pk)
                    serializer = ShiftDetailsSerializer(data=shift_copy, partial=True)
                    if serializer.is_valid():
                        new_shift = serializer.save()
                        response_data.append({
                            "message": f"Shift assigned successfully for {shift.get('ShiftDate')} for employee {employee_id}.",
                            "shift_details": serializer.data
                        })
                    else:
                        response_data.append({
                            "message": f"Error assigning shift on {shift.get('ShiftDate')} for employee {employee_id}.",
                            "errors": serializer.errors
                        })
        else:
            employee = Employee_Personal_Form_Detials.objects.filter(
                Employee_ID=data.get('Employee')
            ).first()
            location_instance = (
                Location_Detials.objects.filter(Location_Id=data.get("Location_Name")).first()
                if data.get("Location_Name") else None
            )
            if not employee:
                return JsonResponse({'Error': 'Invalid Employee ID'})
            for shift in shiftdata:
                # if not shift.get("ShiftDate") or not shift.get("Shift_Id"):
                #     return JsonResponse({'Error': 'Invalid shift data'})

                existing_shift = ShiftDetails_Master.objects.filter(
                    Employee=employee,
                    ShiftDate=shift.get("ShiftDate")
                ).first()

                if existing_shift:
                    response_data.append({
                        "message": f"Cannot assign shift on {shift.get('ShiftDate')}. Employee already assigned shift.",
                        "previous_shift": {
                            "Shift_Id": existing_shift.Shift_Id.ShiftId,
                            "ShiftDate": existing_shift.ShiftDate,
                            "Status": existing_shift.Status
                        }
                    })
                    continue

                shift["Employee"] = employee.pk
                duty_rouster_instance = DutyRousterMaster.objects.filter(
                    ShiftId=shift.get("Shift_Id")
                ).first()
                # if not duty_rouster_instance:
                #     return JsonResponse({'Error': f'Invalid Shift ID {shift.get("Shift_Id")}'})
                shift["Shift_Id"] = duty_rouster_instance.pk if duty_rouster_instance else None
                if location_instance:
                    shift.setdefault("Location_Name", location_instance.pk)
                serializer = ShiftDetailsSerializer(data=shift, partial=True)
                if serializer.is_valid():
                    new_shift = serializer.save()
                    response_data.append({
                        "message": f"Shift assigned successfully for {shift.get('ShiftDate')}.",
                        "shift_details": serializer.data
                    })
                else:
                    response_data.append({
                        "message": f"Error assigning shift on {shift.get('ShiftDate')}.",
                        "errors": serializer.errors
                    })

        return JsonResponse({"response": response_data}, status=200)

    except Exception as e:
        print('Error', e)
        return JsonResponse({'Error': 'Invalid JSON format'}, status=400)



@csrf_exempt
def Employee_ShiftDetails_Link(request):
    try:
        employeeid = request.GET.get("employeeid")
        location = request.GET.get("location")
        queue_status_map = { "ShiftAssign": None,"CompleteShift": "Completed","ShiftApproval": "Pending",}
        queue_type = request.GET.get("QueueType")
        status = queue_status_map.get(queue_type)
        query_filter = {"Employee": employeeid,"Location_Name": location,}
        if status is not None:
            query_filter["Status"] = status
        shiftdata = ShiftDetails_Master.objects.filter(**query_filter)
        serializer = ShiftDetailsSerializer(shiftdata, many=True)
        return JsonResponse(serializer.data,safe=False)
    except Exception as e:
        print('error :',e)
        return JsonResponse({'Error': str(e)}, status=500)


    
    
from django.http import HttpResponse
from fpdf import FPDF
from .models import ShiftDetails_Master
from .serializers import ShiftDetailsSerializer

from django.http import HttpResponse
from fpdf import FPDF
from .models import ShiftDetails_Master
from .serializers import ShiftDetailsSerializer
from io import BytesIO
from fpdf import FPDF
from datetime import datetime, timedelta

class PDFReport(FPDF):
    def __init__(self,deptname, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.deptname = deptname
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(200, 10, "{} DUTY LIST".format(self.deptname), ln=True, align='C')
        self.ln(5)
        self.cell(0, 10, "DATE : {}".format(datetime.now().date().strftime("%d/%m/%y")), ln=True, align='R')
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 10)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')
    def header_table(self, days_of_week, dates_of_week):
        self.cell(7, 6, "", border=1, align="C")
        self.set_font('Arial', 'B', 9)
        self.cell(65, 6, "Day", border=1, align='L')
        width = 30
        for day in days_of_week:
            self.cell(17, 6, day, border=1, align='C')
        self.ln()
        self.set_font('Arial', 'B', 9)
        self.cell(7, 6, "", border=1, align="C")
        self.cell(65, 6, "Date", border=1, align='L')  
        for date in dates_of_week:
            self.cell(17, 6, date, border=1, align='C')
        self.ln()
    def employee_row(self, sno, emp_name, days_of_week, employee_shifts):
        self.set_font('Arial', 'B', 9)
        self.cell(7, 6, str(sno), border=1, align='C')  
        self.cell(65, 6, emp_name, border=1, align='L')        
        for day in days_of_week:
            shift = employee_shifts.get(day, "")
            self.cell(17, 6, shift, border=1, align='C')
        self.ln()
    def footerdatafun(self,footerdata):
        self.ln(20)
        self.cell(0, 6, footerdata[0], border=0, align='L') 
        self.cell(0, 6, footerdata[1], border=0, align='R') 
        self.ln()
        
def generate_pdf(shift_data, report_start_date, report_end_date,deptname):
    pdf = PDFReport(deptname)
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    days_of_week = []
    dates_of_week = []
    current_date = datetime.strptime(report_start_date, "%Y-%m-%d")
    end_date = datetime.strptime(report_end_date, "%Y-%m-%d")
    while current_date <= end_date:
        days_of_week.append(current_date.strftime("%a"))  
        dates_of_week.append(current_date.strftime("%d/%m"))  
        current_date += timedelta(days=1)
    pdf.header_table(days_of_week, dates_of_week)
    employee_shifts = {}
    for item in shift_data:
        emp_name = f"{item['Summa'].First_Name} {item['Summa'].Last_Name}" if item['Summa'] else "Unknown"
        shift_date = item['ShiftDate']
        shift_day = datetime.strptime(shift_date, "%Y-%m-%d").strftime("%a")  # Get the day of the week
        shift_name = item['ShiftOrLeave']
        if shift_name == "Morning Shift":
            shift_name = "M"
        elif shift_name == "Evening Shift":
            shift_name = "E"
        elif shift_name == "Night Shift":
            shift_name = "N"
        else:
            shift_name = shift_name[0].upper()  
        if emp_name not in employee_shifts:
            employee_shifts[emp_name] = {}
        employee_shifts[emp_name][shift_day] = shift_name  
    sno = 1 
    for emp_name, shifts in employee_shifts.items():
        pdf.employee_row(sno, emp_name, days_of_week, shifts)
        sno += 1  
    footerdata = ["SISTER INCHARGE","APPROVED BY"]
    pdf.footerdatafun(footerdata)
    pdf_output = BytesIO()
    pdf_bytes = pdf.output(dest='S')  # This is already in bytes
    pdf_output.write(pdf_bytes)  # No need to decode
    pdf_output.seek(0)
    return pdf_output


from io import BytesIO
from reportlab.pdfgen import canvas

def generate_pdf(data, start_date, end_date, deptname):
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    
    # Example PDF content
    p.drawString(100, 800, f"Shift Report for {deptname}")
    p.drawString(100, 780, f"From {start_date} to {end_date}")
    
    # You can loop over data here
    y = 760
    for row in data:
        p.drawString(100, y, str(row))  # convert row to str for output
        y -= 20
    
    p.showPage()
    p.save()
    
    pdf = buffer.getvalue()
    buffer.close()
    return pdf   # ✅ returns bytes, not str


@csrf_exempt
@require_http_methods(['GET'])
def Department_ShiftReport(request):
    try:
        report_start_date = request.GET.get("reportstartdate")
        report_end_date = request.GET.get("reportenddate")
        department_id = request.GET.get("departmentId")
        deptname = request.GET.get("deptname")

        if not report_start_date or not report_end_date or not department_id:
            return HttpResponse("Missing required parameters", status=400)

        shift_data = ShiftDetails_Master.objects.filter(
            Employee__Department__Department_Id=department_id,
            ShiftDate__range=[report_start_date, report_end_date]
        )
        serialized_data = ShiftReportSerializer(shift_data, many=True).data

        pdf_content = generate_pdf(serialized_data, report_start_date, report_end_date, deptname)

        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="shift_report.pdf"'
        return response

    except Exception as e:
        return JsonResponse({'err': str(e)})


@csrf_exempt
def Bulk_ShiftApprove(request):
    try:
        data = json.loads(request.body) 
        for i in data:
            shiftinstance = ShiftDetails_Master.objects.get(Employee_Shift_Id=i.get("Employee_Shift_Id"))
            new_shift_id = i.get("NewShiftId")
            if new_shift_id:
                i['Shift_Id'] = new_shift_id
            i['Status'] = 'Approved'
            serializer = ShiftDetailsSerializer(shiftinstance, data=i, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                raise ValueError("Invalid data in the request")
        return JsonResponse({'message': 'Shift(s) Approved successfully'})

    except Exception as e:
        return JsonResponse({"Error":str(e)})





def Get_GovtHolidays(request):
    try:
        
        IndianHolidays = holidays.India(years=datetime.now().year)
        holidays_dict = {date.strftime("%Y-%m-%d"): name for date, name in IndianHolidays.items()}
        return JsonResponse(holidays_dict,safe=False)
        
    except Exception as e:
        return JsonResponse({"Error":e})
    

def calculate_working_hours(in_time_str, out_time_str):
    print("in_time_str :",in_time_str)
    if in_time_str is not None and out_time_str is not None:
        in_time, in_period = in_time_str.split()
        out_time, out_period = out_time_str.split()
        in_time_24 = datetime.strptime(in_time + " " + in_period, "%I:%M %p")
        out_time_24 = datetime.strptime(out_time + " " + out_period, "%I:%M %p")
        if out_time_24 < in_time_24:
            out_time_24 += timedelta(days=1)
        total_working_duration = out_time_24 - in_time_24
        hours, remainder = divmod(total_working_duration.total_seconds(), 3600)
        minutes = remainder // 60
        return f"{int(hours)} Hrs {int(minutes)} Min"
    else:
        return "-"

def parse_date(date_str, fmt):
    return datetime.strptime(date_str, fmt)
        
        
def covertdatetimeformat(type,DateFormats):
    if type == "month":
        year = datetime.strptime(DateFormats, "%B %Y").year
        month_number = datetime.strptime(DateFormats, "%B %Y").month
        start_date = datetime(year, month_number, 1).date()
        end_date = datetime(year, month_number, calendar.monthrange(year, month_number)[1]).date()
    elif type == "week":
        date_parts = DateFormats.split(" - ")
        if len(date_parts) != 2:
            return JsonResponse({"Error": "Invalid DateFormats format for Week. Expected 'DD Mon - DD Mon YYYY'"})
        start_date_str, end_date_str = date_parts
        year = end_date_str.split()[-1] if len(end_date_str.split()) == 3 else None
        if not year:
            return JsonResponse({"Error": "Year missing in DateFormats. Expected 'DD Mon - DD Mon YYYY'"})
        end_date = datetime.strptime(end_date_str, "%d %b %Y").date()
        year = end_date.year
        complete_start_date = f"{start_date_str} {year}"
        start_date = datetime.strptime(complete_start_date, "%d %b %Y").date()
    elif type == "daywise":
        start_date = end_date = parse_date(DateFormats, "%d %B %Y").date()
        
    return start_date,end_date
    
    
@csrf_exempt
def Insert_DailyAttendance(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            ConvertInTime = ''
            ConvertInTimePeriod = ''
            NewInTime = ''
            print('outtime :',data["Out_Time"],data)
            if "AM" in data["In_Time"]:
                ConvertInTime = data["In_Time"].split()[0]
                ConvertInTimePeriod = data["In_Time"].split()[-1]
            if data["Out_Time"] != "":  
                if "PM" in data["Out_Time"]:
                    ConvertOutTime = data["Out_Time"].split()[0]
                    ConvertOutTimePeriod = data["Out_Time"].split()[-1]
                    NewOutTime = datetime.strptime(ConvertOutTime, "%H:%M").time()
            print("ConvertInTime :",ConvertInTime)
            
            if ConvertInTime:
              NewInTime = datetime.strptime(ConvertInTime, "%H:%M").time()
            
            print("dsf")
            getprevins = None
            try:
                if data["Out_Time"] != "" :
                    getprevins = Employee_Attendance.objects.get(Employee=data["Employee"],Date=data["Date"],In_Time=NewInTime)
                    print("getprevins :",getprevins)
            except Exception as e:
                print('error :',e)
            if getprevins is not None:
                TotalWorkingHours = calculate_working_hours(data["Out_Time"],data["In_Time"])
                data["In_Time"] = NewInTime
                data["Out_Time"] = NewOutTime
                # data["Out_TimePeriod"] = ConvertOutTimePeriod
                data["Working_Hours"] = TotalWorkingHours
                updateins = EmployeeAttendanceSerializers(getprevins,data,partial=True)
                if updateins.is_valid():
                    updateins.save()
                else:
                    return JsonResponse({"Error":updateins.errors})
            else:
                print('else')

                threshold_time = time(10, 11, 0)

                data["In_Time"] = NewInTime
                # data["IN_TimePeriod"] = ConvertInTimePeriod
                data["Out_Time"] = None
                data["Out_TimePeriod"] = None
                data["Working_Hours"] = None

                latestatus = None
                

                try:

                        late_records = (
                            Employee_Attendance.objects
                            .filter(Employee_id=data["Employee"]) 
                            .annotate(
                                In_Time_Category=Case(
                                     When(In_Time__gt=threshold_time, then=Value('Late')),
                                    default=Value('On_Time'),
                                    output_field=CharField()
                                )
                            )
                            .values('Employee_id', 'In_Time_Category')
                            .annotate(Total_Records=Count('Attendance_Id'))  
                            .filter(In_Time_Category='Late')  
                        )

                except Exception as e:

                        print("error e: ",e)

                print(late_records,'late_records')

                if late_records:
                       
                       if late_records[0].get('Total_Records') == 2 and str(NewInTime) > str(threshold_time):
                                
                                latestatus = True
                                
                                data["Attendance_Status"] = 'Absent'
                                historyins = Current_History_Detials.objects.filter(Employee__Employee_ID = data["Employee"]).first()
                                location_ins = Location_Detials.objects.filter(Location_Id=data["Location"]).first()
                                

                                leave_register_instance = Employee_Leave_Register.objects.create(

                                    Employee_Id=historyins,
                                    Leave_Type="Late Coming",            
                                    FromDate=data["Date"],
                                    ToDate=data["Date"],
                                    DaysCount=1,
                                    Reason='Late',
                                    Location_Name=location_ins,
                                    Status = 'Approved',
                                    CreatedBy=data["CreatedBy"]

                                )

                                print(leave_register_instance,'Saved successfully')
 
                insertins = EmployeeAttendanceSerializers(data=data, partial=True)
                print("insertins :",insertins)

                if insertins.is_valid():

                    data1 = {"Status":"Completed","Create_by": data["CreatedBy"]}
                    getshiftins = ShiftDetails_Master.objects.get(
                        Employee=data["Employee"],
                        ShiftDate=data["Date"],
                        Status="Approved",
                        Location_Name=data["Location"])

                    updateshiftins = ShiftDetailsSerializer(getshiftins,data1,partial=True,context={'latestatus': latestatus})
                    print("updateshiftins :",updateshiftins)
                    insertins.save()
                    if updateshiftins:
                        if updateshiftins.is_valid():
                            updateshiftins.save()
                        else:
                            print('error',insertins.errors)
                            return JsonResponse({"errors": insertins.errors})
                
                else:
                    print('error',insertins.errors)
                    return JsonResponse({"errors": insertins.errors})
            
            return JsonResponse({"success": "Attendance inserted successfully"})
        
        elif request.method == "GET":
            month_str = request.GET.get("currentDate") 
            employee_id = request.GET.get("Employee_ID")
            current_view = request.GET.get("currentView")
            if not month_str or not employee_id:
                return JsonResponse({'error': 'Missing parameters'})     
            try:
                attendance_records = None
                start_date, end_date = covertdatetimeformat(current_view,month_str)   
                attendance_records = Employee_Attendance.objects.filter(Employee_id=employee_id,Date__range=[start_date,end_date])
                if attendance_records is not None:
                    serializer = EmployeeAttendanceSerializers(attendance_records, many=True)
                    return JsonResponse(serializer.data, safe=False)
            except ValueError as e:
                return JsonResponse({'error': f'Invalid date format: {str(e)}'})
            except Exception as e:
                return JsonResponse({'error': f'An error occurred: {str(e)}'})                
    except Exception as e:
        return JsonResponse({"Error": str(e)})





def GET_Employee_All_Data_ForCalendar(request):
    try:
        Params = {key: request.GET.get(key) for key in ["Employee_ID", "Type", "currentDate", "currentView"]}
        if not all(Params.values()):
            return JsonResponse({"Error": "Missing required parameters"})
        
        Employee_ID, Type, DateFormats, PageType = Params.values()
        start_date, end_date = covertdatetimeformat(PageType, DateFormats)
        print("start_date :",start_date,'end_date :',end_date)
        model_mapping = {
            "Shift": (ShiftDetails_Master, ShiftDetailsSerializer, Q(Employee=Employee_ID, ShiftDate__range=[start_date, end_date])),
            "Leave": (Employee_Leave_Register, EmployeeLeaveSerializer, Q(Employee_Id__Employee__Employee_ID=Employee_ID, FromDate__range=[start_date, end_date], ToDate__range=[start_date, end_date])),
            "Advance": (Employee_Advance_Request, EmployeeAdvanceSerializer, Q(Employee_Id__Employee__Employee_ID=Employee_ID, Request_Date__range=[start_date, end_date])),
            "Attendance": (Employee_Attendance, EmployeeAttendanceSerializers, Q(Employee=Employee_ID, Date__range=[start_date, end_date])),
        }
        
        if Type not in model_mapping:
            return JsonResponse({"Error": "Invalid Type. Use 'Shift', 'Leave', or 'Advance'"})
        
        ModelClass, SerializerClass, query = model_mapping[Type]
        data_query = ModelClass.objects.filter(query)
        response_data = SerializerClass(data_query, many=True).data
        if PageType.lower() == "daywise" and Type == "Shift":
            modified_response = []
            for shift in response_data:
                start_shift = shift.copy()
                end_shift = shift.copy()

                # Removing unnecessary fields for the end shift
                start_shift["Time"] = start_shift["DisplayStartTime"]
                end_shift["Time"] = start_shift["DisplayEndTime"]
                del end_shift["DisplayStartTime"]

                modified_response.append(start_shift)
                modified_response.append(end_shift)
            
            return JsonResponse(modified_response, safe=False)

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)})  

    
    
def Get_All_Employees_ForCalendar(request):
    try:
        
        Location = request.GET.get("Location")
        SearchEmployee = request.GET.get("SearchEmployee")
        print(Location)
        Employee = Employee_Personal_Form_Detials.objects.filter(Location=Location,Status=True)

        print(Employee,'Employee')

        if SearchEmployee:
            Employee = Employee.filter(
                Q(Employee_ID__icontains=SearchEmployee) |
                Q(Tittle__Title_Name__icontains=SearchEmployee) | 
                Q(First_Name__icontains=SearchEmployee) |
                Q(Middle_Name__icontains=SearchEmployee) |
                Q(Last_Name__icontains=SearchEmployee) |
                Q(Contact_Number__icontains=SearchEmployee) |
                Q(Designation__Designation_Name__icontains=SearchEmployee) 
            )
        result = EmployeePersonaDataSerializer(Employee,many=True)
        return JsonResponse(result.data,safe=False)
    except Exception as e:
        return JsonResponse({"Error":e})




def all_Duty_ForcalendarAssign(request):
    try:
        Location = request.GET.get("Location")
        dutydatta = DutyRousterMaster.objects.filter(Location=Location).all()
        result = DutyRousterMasterDetailsSerializer(dutydatta,many=True).data
        return JsonResponse(result,safe=False)
    except Exception as e:
        return JsonResponse({'Error',e})
    

    
def Get_All_Nurses(request):
    try:
        Location = request.GET.get("Location")
        NurseData = Employee_Personal_Form_Detials.objects.annotate(
            normalized_category=Lower(Replace(F("Category__Category_Name"), Value(" "), Value("")))
        ).filter(normalized_category="nurse", Location=Location).all()        
        result = EmployeePersonaDataSerializer(NurseData,many=True).data
        return JsonResponse(result,safe=False)
    except Exception as e:
        return JsonResponse({'Error',e})
    
    
    
@csrf_exempt
def AssignNurseToStation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if not isinstance(data, list):
                return JsonResponse({"error": "Invalid data format, expected list"}, status=400)
            created_entries = []
            with transaction.atomic():
                for entry in data:
                    location_id = entry.pop("Location", None)
                    employee_ids = entry.pop("Employee_ID", [])  
                    new_nurse_station_id = entry.pop("NurseStationid", None)
                    if not employee_ids or not new_nurse_station_id:
                        return JsonResponse({"error": "Employee_ID and NurseStationid are required"}, status=400)
                    try:
                        location_instance = Location_Detials.objects.get(Location_Id=location_id) if location_id else None
                        entry["Location"] = location_instance 
                    except Location_Detials.DoesNotExist:
                        return JsonResponse({"error": f"Invalid Location ID {location_id}"}, status=400)
                    existing_nurse_stations = NurseVsNurseStation.objects.filter(Employee_ID__in=employee_ids).distinct()
                    for nurse_station in existing_nurse_stations:
                        nurse_station.Employee_ID.remove(*employee_ids)
                    nurse_station, created = NurseVsNurseStation.objects.update_or_create(NurseStationid_id=new_nurse_station_id, defaults=entry)
                    nurse_station.Employee_ID.add(*employee_ids)
                    created_entries.append({
                        "NurseStationid": new_nurse_station_id,
                        "Employee_ID": employee_ids,
                        "Location": location_instance.Location_Id if location_instance else None, 
                        **{k: v for k, v in entry.items() if k != "Location"}})
            message = "Nurses assigned successfully" if created else "Nurses updated successfully"
            return JsonResponse({"success": message, "data": created_entries})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


    elif request.method == "GET":
        data = NurseVsNurseStation.objects.all()
        result = NurseVsNurseStationSerializer(data,many=True).data
        return JsonResponse(result,safe=False)
    
    
    
@csrf_exempt
def NurseStationShiftAssign(request):
    try:
        data = json.loads(request.body)
        print("data:", data)

        selected_stations = data.get("SelectedStations", [])
        shift_details = data.get("shiftDetails")
        start_date = datetime.strptime(data.get("startdate"), "%Y-%m-%d").date()
        end_date = datetime.strptime(data.get("enddate"), "%Y-%m-%d").date()
        created_by = data.get("Create_by")
        Location = data.get("Location")
        if not selected_stations or not shift_details:
            return JsonResponse({"Error": "Missing required fields"}, status=400)
        assigned_nurses = NurseVsNurseStation.objects.filter(NurseStationid__in=selected_stations).prefetch_related('Employee_ID')
        shift_records = []
        for nurse_station in assigned_nurses:
            for nurse in nurse_station.Employee_ID.all():
                shift_date = start_date
                while shift_date <= end_date:
                    shift_instance = {
                        "Employee": nurse.Employee_ID,
                        "Shift_Id": shift_details[str(shift_date)],
                        "ShiftDate": shift_date,
                        "Status": "Assigned",
                        "Create_by": created_by,
                        "Location_Name": nurse_station.Location.Location_Id if nurse_station.Location else None
                    }
                    shift_records.append(shift_instance)
                    shift_date += timedelta(days=1)
        shift_serializer = ShiftDetailsSerializer(data=shift_records, many=True)
        if shift_serializer.is_valid():
            shift_serializer.save()
            return JsonResponse({"message": "Shifts assigned successfully"}, status=201)
        else:
            print("errors :",shift_serializer.errors)
            return JsonResponse({"errors": shift_serializer.errors})
    except Exception as e:
        print("error :",e)
        return JsonResponse({"Error": str(e)}, status=500)
    
def NotificationGet(request):
    try:
        # Filter only unread notifications
        Employeeid = request.GET.get("Employeeid")
        notify = Notification.objects.filter(is_read=False,recipients__Employee_ID=Employeeid)
        count = notify.count()  # Get count of unread notifications
        
        result = NotifySerializer(notify, many=True)
        
        return JsonResponse({"count": count, "notifications": result.data}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, safe=False)
    
def allowancetest(request):

    if request.method == 'GET':

        try:
            
            employee_id = request.GET.get('employee_id','')

            employee_instance = Employee_Personal_Form_Detials.objects.get(
                    Employee_ID=employee_id
                )
            
            last_salary_record = Salary_Maintenance_Detials.objects.filter(
                                    Employee=employee_instance, Status='Active'
                                ).order_by('-created_at').first()
            
            last_allowances = last_salary_record.EmployeeAllowanceDetails.filter(Status="Active")
            print(last_allowances)

            allow = last_salary_record.EmployeeAllowanceDetails.all()
            print(allow)
            # for allow in lastallowances:

            #     if allow.Status == 'Active':

            #         print(allow)


            return JsonResponse('success',safe=False)
       
        except Exception as e:
            print("error :",e)
            return JsonResponse({"Error": str(e)}, status=500)
        






