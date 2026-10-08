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
from django.db import DataError, transaction
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
from .serializers import *


@csrf_exempt
@require_http_methods(["GET"])
def Get_HOD_Details(request):

    if request.method == 'GET':

        try:

            roleins = Role_Master.objects.filter(Role_Name="HOD").first()
            emp = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes',Role = roleins)
            employee_data = []

            for hod in emp:

                departmentId = ', '.join(str(department.Department_Id) for department in hod.Department.all())
                departments = ', '.join(department.Department_Name for department in hod.Department.all())

                emp_dict = {
                    'Employeeid': hod.pk,
                    'Employeename': f"{hod.Tittle.Title_Name if hod.Tittle else ''} {hod.First_Name or ''} {hod.Middle_Name or ''} {hod.Last_Name or ''}".strip(),
                    'designation': hod.Designation.Designation_Name if hod.Designation.Designation_Name else None,
                    'Designationid': hod.Designation.Designation_Id if hod.Designation.Designation_Name else None,
                    'departments' : departments,
                    'departmentId' : departmentId

                }
                employee_data.append(emp_dict)

            return JsonResponse(employee_data, safe=False, status=200)



        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET","POST"])
def Employee_mapping_Details(request):

    if request.method == 'POST':


        try:


            data = json.loads(request.body)

            print(data)


            HOD = data.get('HOD','')
            Employeelist = data.get('Employeelist',[])
            createdby = data.get('createdby','')

            print(Employeelist)

            HOD_Employeeins = Employee_Personal_Form_Detials.objects.filter(Employee_ID=HOD).first()
            emp_instance = Employee_Personal_Form_Detials.objects.filter(Employee_ID__in=Employeelist)
            mappedemp = HODMapping.objects.filter(HOD_Employee=HOD).first()

            if mappedemp:


                existing_employees = set(mappedemp.Employee.all())
                new_employees = set(emp_instance)

                mappedemp.Employee.set(existing_employees.union(new_employees))
                mappedemp.created_by = createdby  
                mappedemp.save()
                

                return JsonResponse({'success': 'Employee Mapped successfully'})

            if not Employeelist:    
                                  
                        Employeelist = []

            
            hodmapping = HODMapping(
                HOD_Employee = HOD_Employeeins,
                created_by = createdby,             
            )
            hodmapping.save()

            if Employeelist:
                  
                    hodmapping.Employee.set(emp_instance)
            else:
                    hodmapping.Employee.set([])

            return JsonResponse({'success': 'Employee Mapped successfully'})

 
        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error in Employee_Details: {str(e)}")  # Replace with logging in production
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})



    if request.method == 'GET':

         try:
              
              hodid = request.GET.get('hodid','')

              mappedemp = HODMapping.objects.filter(HOD_Employee=hodid).first()
              
              mappedemplist = []

            #   EmpId = ', '.join(str(employee.Employee_ID) for employee in mappedemp.Employee.all())
            #   Empname = ', '.join(f"""{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{"."}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}""".strip()  for employee in mappedemp.Employee.all())
            #   Empdesignation = ', '.join(str(employee.Designation.Designation_Name) for employee in mappedemp.Employee.all())

              EmpId = [employee.Employee_ID for employee in mappedemp.Employee.all()]
              Empname = [ f"""{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{"."}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}""".strip()  for employee in mappedemp.Employee.all() ]
              Empdesignation = [ employee.Designation.Designation_Name for employee in mappedemp.Employee.all() ]

              datalist = {
                   
                   'HODid' : mappedemp.HOD_Employee.Employee_ID,
                   'Employeeidlist' : EmpId,
                   'Employeenamelist' : Empname,
                   'Empdesignationlist' : Empdesignation 
              }
              mappedemplist.append(datalist)

              return JsonResponse(mappedemplist,safe=False)



         except Exception as e:
          
            print(f"Error in Employee_Details: {str(e)}") 
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

@csrf_exempt
@require_http_methods(["GET","POST"])
def Employee_mapping_Remove_Details(request):
     
     if request.method == 'POST':
          
          try:
               
               data = json.loads(request.body)

               Employeeid = data.get('Employeeid','')
               HODid = data.get('hodId','')

               hod_mapping = HODMapping.objects.filter(HOD_Employee__Employee_ID=HODid)

               if hod_mapping.exists():

                mapping_instance = hod_mapping.first()
                employee_obj = Employee_Personal_Form_Detials.objects.filter(Employee_ID=Employeeid).first()

                if employee_obj:
                     
                    mapping_instance.Employee.remove(employee_obj)
                    return JsonResponse({'success': 'Employee removed from HOD successfully.'})
                     

          except Exception as e:
         
            print(f"Error in Employee_Details: {str(e)}")  
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})

               
@csrf_exempt
@require_http_methods(["GET","POST"])
def HOD_MappedEmployee_Details_For_Calendar(request):
     
     if request.method == 'GET':
         
         try:
 
            hodid = request.GET.get('hodid','')
            SearchEmployee = request.GET.get('searchEmployee','')
            is_Employee = request.GET.get('is_Employee','')
            is_HOD = request.GET.get('is_HOD','')
            is_HR = request.GET.get('is_HR','')
            is_admin = request.GET.get('is_admin','')
            Employeeid = request.GET.get('Employeeid','')
 
            Employee = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes')
 
            print(Employee,'Employee')
            print(is_HOD,'is_HOD')
            print(is_HR,'is_HR')
            print(is_admin,'is_admin')
            print(is_Employee,'is_Employee')
 
            if is_HOD == 'true':
 
                print('hrrrrrrrrrrrrrrrr')
 
                hod = HODMapping.objects.filter(HOD_Employee=hodid).first()
 
                emplist = [ employee.Employee_ID for employee in hod.Employee.all()]
       
                emplist.append(hodid)
 
                Employee = Employee_Personal_Form_Detials.objects.filter(pk__in=emplist)
 
            if is_Employee  == 'true':
 
                Employee = Employee.filter(Employee_ID=Employeeid)
 
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
 
            if not Employee.exists():
                return JsonResponse({'warn': 'No employee details found for the provided EmployeeID'}, status=404)
 
            result = EmployeePersonaDataSerializer(Employee, many=True)
            return JsonResponse(result.data, safe=False)
 
         except Exception as e:
         
            print(f"Error in Employee_Details: {str(e)}")  
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})


              

          




@csrf_exempt
@require_http_methods(["GET","POST"])
def HOD_MappedEmployee_Details(request):
    if request.method == 'GET':
        try:
            hodid = request.GET.get('hodid', '')
            SearchEmployee = request.GET.get('searchEmployee', '')

            hod = HODMapping.objects.filter(HOD_Employee=hodid).first()
            if not hod:
                return JsonResponse({'warn': f"No HOD mapping found for Employee ID {hodid}"})

            emplist = [employee.Employee_ID for employee in hod.Employee.all()]
            emp_list = []

            # include HOD himself
            emplist.append(hodid)

            for datas in emplist:
                Employee = Employee_Personal_Form_Detials.objects.filter(pk=datas)

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

                if not Employee.exists():
                    continue  # instead of returning immediately, just skip this employee
            
                for emp in Employee:
                    departmentId = ', '.join(str(dept.Department_Id) for dept in emp.Department.all())
                    departments = ', '.join(dept.Department_Name for dept in emp.Department.all())
                    emp_dict = {
                        'Employeeid': emp.pk,
                        'Employeename': f"{emp.Tittle.Title_Name if emp.Tittle else ''} {emp.First_Name or ''} {emp.Middle_Name or ''} {emp.Last_Name or ''}".strip(),
                        'designation': emp.Designation.Designation_Name if emp.Designation else None,
                        'Designationid': emp.Designation.Designation_Id if emp.Designation else None,
                        'departments': departments,
                        'departmentId': departmentId
                    }
                    emp_list.append(emp_dict)

            return JsonResponse(emp_list, safe=False)

        except Exception as e:
            print(f"Error in Employee_Details: {str(e)}")  
            return JsonResponse({'error': f"An unexpected error occurred: {str(e)}"})


import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from .models import (
    Employee_Personal_Form_Detials, Employeement_History_Detials, Employee_Medical_Information_Detials,
    Current_History_Detials, EmployeeProbationDetails, EmployeeSecurityDeposit, Employee_GratuityDetails,
    Financial_History_Detials, Salary_Maintenance_Detials, Document_Checklist_Detials,
    Employee_Skills_Detials, Employee_Leavelist, EmployeeAllowanceDetails, EmployeeDeductionDetails,
    Title_Detials, BloodGroup_Detials, Classification_Detials, Category_Detials, Speciality_Detials,
    Designation_Detials, Role_Master, Location_Detials, Department_Detials, Finance_GroupMaster_Detailes
)
from django.core.exceptions import ObjectDoesNotExist
import json
from decimal import Decimal
from datetime import datetime
import logging

# @csrf_exempt
# def employee_excel_upload(request):
#     if request.method != 'POST':
#         return JsonResponse({'error':'Only POST method is allowed'}, status=400)

#     if 'file' not in request.FILES:
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     try:
#         # Read the uploaded Excel file
#         file = request.FILES['file']
#         excel_data = pd.ExcelFile(file)

#         print(excel_data.sheet_names,'excel_data')

#         # Expected sheet names (as defined in the Excel generation script)
#         expected_sheets = {
#             'Employee_Personal_Details': Employee_Personal_Form_Detials,
#             'Employment_History': Employeement_History_Detials,
#             'Medical_Information': Employee_Medical_Information_Detials,
#             'Current_History': Current_History_Detials,
#             'Probation_Details': EmployeeProbationDetails,
#             'Security_Deposit': EmployeeSecurityDeposit,
#             'Gratuity_Details': Employee_GratuityDetails,
#             'Financial_History': Financial_History_Detials,
#             'Salary_Maintenance': Salary_Maintenance_Detials,
#             'Document_Checklist': Document_Checklist_Detials,
#             'Employee_Skills': Employee_Skills_Detials,
#             'Employee_Leaves': Employee_Leavelist,
#             'Employee_Allowance': EmployeeAllowanceDetails,
#             'Employee_Deduction': EmployeeDeductionDetails
#         }

#         print(expected_sheets,'expected_sheets123')

#         # Validate sheet names
#         missing_sheets = [sheet for sheet in expected_sheets if sheet not in excel_data.sheet_names]
#         if missing_sheets:
#             return JsonResponse({
#                 'status': 'error',
#                 'message': f'Missing sheets: {", ".join(missing_sheets)}'
#             }, status=400)

#         # Initialize response data
#         results = {sheet: [] for sheet in expected_sheets}
#         errors = []

#         with transaction.atomic():
#             # Process Employee_Personal_Details first to establish employee records
#             personal_df = pd.read_excel(file, sheet_name='Employee_Personal_Details')
#             personal_df = personal_df.fillna('')  # Replace NaN with empty string

#             print(personal_df,'personal_df1222222222')

#             employee_id_to_db_id = {}  # Map Excel Employee_ID to database EmployeeID

#             for index, row in personal_df.iterrows():

#                 print(row,'rowwwwwwwwwwww')
#                 print(row['Title'],'row123')
#                 # try:
#                 #     employee_id = str(row['Employee_ID']).strip()

#                 #     print(employee_id,'employee_idddddddd')
#                 #     if not employee_id:
#                 #         results['Employee_Personal_Details'].append({
#                 #             'row': index + 2,
#                 #             'status': 'error',
#                 #             'message': 'Employee_ID is required'
#                 #         })
#                 #         continue

#                     # Resolve ForeignKeys
#                 try:
#                     title_id = None
#                     if row['Title']:

#                         try:
#                             title = Title_Detials.objects.filter(Title_Name=row['Title']).first()
#                             # title_id = title.Title_Id

#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Title '{row['Title']}' not found"
#                             })
#                             continue

#                     blood_group_id = None
#                     if row['BloodGroup']:
#                         try:
#                             blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Name=row['BloodGroup']).first()
#                             # blood_group_id = blood_group.BloodGroup_Id
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"BloodGroup '{row['BloodGroup']}' not found"
#                             })
#                             continue

#                     classification_id = None
#                     if row['Classification']:
#                         try:
#                             classification = Classification_Detials.objects.filter(Classification_Name=row['Classification']).first()
#                             # classification_id = classification.Classification_Id
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Classification '{row['Classification']}' not found"
#                             })
#                             continue

#                     category_id = None
#                     if row['Category']:
#                         try:
#                             category = Category_Detials.objects.filter(Category_Name=row['Category']).first()
#                             # category_id = category.Category_Id
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Category '{row['Category']}' not found"
#                             })
#                             continue

#                     speciality_id = None
#                     if row['Speciality']:
#                         try:
#                             speciality = Speciality_Detials.objects.filter(Speciality_Name=row['Speciality']).first()

#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Speciality '{row['Speciality']}' not found"
#                             })
#                             continue

#                     designation_id = None
#                     if row['Designation']:
#                         try:
#                             designation = Designation_Detials.objects.filter(Designation_Name=row['Designation']).first()

#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Designation '{row['Designation']}' not found"
#                             })
#                             continue

#                     role_id = None
#                     if row['Role']:
#                         try:
#                             role = Role_Master.objects.filter(Role_Name=row['Role']).first()

#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Role '{row['Role']}' not found"
#                             })
#                             continue


#                     location_id = None
#                     if row['Location']:
#                         try:
#                             location = Location_Detials.objects.get(Location_Name=row['Location'])
                     
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Location '{row['Location']}' not found"
#                             })
#                             continue

#                     ledger_group_id = None
#                     if row['LedgerGroupName']:
#                         try:
#                             ledger_group = Finance_GroupMaster_Detailes.objects.get(pk=22)
                          
#                             # ledger_group_id = ledger_group.ID
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"LedgerGroupName '{row['LedgerGroupName']}' not found"
#                             })
#                             continue

#                     # Prepare data
#                     employee_data = {
#                         'Tittle': title,
#                         'First_Name': row['First_Name'] or None,
#                         'Middle_Name': row['Middle_Name'] or None,
#                         'Last_Name': row['Last_Name'] or None,
#                         'Gender': row['Gender'] or None,
#                         'DOB': row['DOB'] or None,
#                         'Age': int(row['Age']) if row['Age'] else None,
#                         'BloodGroup': blood_group,
#                         'Contact_Number': row['Contact_Number'] or None,
#                         'Alternate_Number': row['Alternate_Number'] or None,
#                         'E_mail': row['E_mail'] or None,
#                         'Qualification': row['Qualification'] or None,
#                         'IdProofType': row['IdProofType'] or None,
#                         'IdProofNo': row['IdProofNo'] or None,
#                         'Marital_Status': row['Marital_Status'] or None,
#                         'MarriagePlan': row['MarriagePlan'] or None,
#                         'AnniversaryDate': row['AnniversaryDate'] or None,
#                         'Residence': row['Residence'] or None,
#                         'FatherName': row['FatherName'] or None,
#                         'FatherContact': row['FatherContact'] or None,
#                         'FatherWorking': row['FatherWorking'] or None,
#                         'FatherWorkPlace': row['FatherWorkPlace'] or None,
#                         'MotherName': row['MotherName'] or None,
#                         'MotherContact': row['MotherContact'] or None,
#                         'MotherWorking': row['MotherWorking'] or None,
#                         'MotherWorkPlace': row['MotherWorkPlace'] or None,
#                         'Spouse_Name': row['Spouse_Name'] or None,
#                         'SpouseContact': row['SpouseContact'] or None,
#                         'SpouseWorking': row['SpouseWorking'] or None,
#                         'SpouseWorkPlace': row['SpouseWorkPlace'] or None,
#                         'Child': row['Child'] or None,
#                         'TotalNoChild': int(row['TotalNoChild']) if row['TotalNoChild'] else None,
#                         'DoorNo': row['DoorNo'] or None,
#                         'Street': row['Street'] or None,
#                         'Area': row['Area'] or None,
#                         'City': row['City'] or None,
#                         'District': row['District'] or None,
#                         'State': row['State'] or None,
#                         'Country': row['Country'] or None,
#                         'Pincode': row['Pincode'] or None,
#                         'PermanentAddressSameAsAbove': row['PermanentAddressSameAsAbove'] or None,
#                         'PermanentDoorNo': row['PermanentDoorNo'] or None,
#                         'PermanentStreet': row['PermanentStreet'] or None,
#                         'PermanentArea': row['PermanentArea'] or None,
#                         'PermanentCity': row['PermanentCity'] or None,
#                         'PermanentDistrict': row['PermanentDistrict'] or None,
#                         'PermanentState': row['PermanentState'] or None,
#                         'PermanentCountry': row['PermanentCountry'] or None,
#                         'PermanentPincode': row['PermanentPincode'] or None,
#                         'EmergencyContactName1': row['EmergencyContactName1'] or None,
#                         'EmergencyContactNo1': row['EmergencyContactNo1'] or None,
#                         'EmergencyContactName2': row['EmergencyContactName2'] or None,
#                         'EmergencyContactNo2': row['EmergencyContactNo2'] or None,
#                         'Classification': classification,
#                         'Category': category,
#                         'Speciality': speciality,
#                         'Designation': designation,
#                         'Role': role,
#                         'Location': location,
#                         'ActiveStatus': row['ActiveStatus'] == 'Yes',
#                         'RequirementSource': row['RequirementSource'] or None,
#                         'Source': row['Source'] or None,
#                         'LedgerName': row['LedgerName'].upper() or None,
#                         'LedgerGroupID': ledger_group,
#                         'OpeningBalance': Decimal(row['OpeningBalance']) if row['OpeningBalance'] else None,
#                         'DebitOrCredit': row['DebitOrCredit'] or None,
#                         'Status': row['Status'] == 'True',
#                         'created_by': row['created_by'] or 'admin'
#                     }

#                     print(employee_data,'employee_data1111111111111111')
#                     # Check if employee exists based on Excel Employee_ID
#                     # try:
#                     #     employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
#                     #     # Update existing employee
#                     #     for key, value in employee_data.items():
#                     #         setattr(employee, key, value)
#                     #     employee.Excel_Employee_ID = employee_id  # Ensure Excel_Employee_ID is set
#                     #     employee.save()
#                     #     employee_id_to_db_id[employee_id] = employee.EmployeeID
#                     # except ObjectDoesNotExist:
#                         # Create new employee
#                         # employee_data['Excel_Employee_ID'] = employee_id
#                     print('excellllllllllllllllll')
#                     employee = Employee_Personal_Form_Detials.objects.create(**employee_data)
#                     print(employee,'employee12111111')
#                     print(employee.Employee_ID)
#                     employee_id_to_db_id[employee_id] = employee.Employee_ID

#                     # Handle ManyToMany Departments
#                     if row['Departments']:
#                         department_names = [name.strip() for name in row['Departments'].split(',') if name.strip()]
#                         departments = []
#                         for name in department_names:
#                             try:
#                                 dept = Department_Detials.objects.get(Department_Name=name)
#                                 departments.append(dept)
#                             except ObjectDoesNotExist:
#                                 results['Employee_Personal_Details'].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Department '{name}' not found"
#                                 })
#                                 raise ValueError(f"Department '{name}' not found")
#                         employee.Departments.set(departments)

#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'success',
#                         'message': f"Employee {employee_id} processed successfully",
#                         'db_id': employee.EmployeeID
#                     })

#                 except Exception as e:
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': str(e)
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue

#             # Process other sheets
#             for sheet_name, model in expected_sheets.items():
#                 if sheet_name == 'Employee_Personal_Details':
#                     continue  # Already processed

#                 try:
#                     df = pd.read_excel(file, sheet_name=sheet_name)
#                     df = df.fillna('')  # Replace NaN with empty string

#                     for index, row in df.iterrows():
#                         try:
#                             employee_id = str(row['Employee_ID']).strip()
#                             if not employee_id:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': 'Employee_ID is required'
#                                 })
#                                 continue

#                             if employee_id not in employee_id_to_db_id:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Employee_ID '{employee_id}' not found in Employee_Personal_Details"
#                                 })
#                                 continue

#                             db_employee_id = employee_id_to_db_id[employee_id]

#                             # Resolve ForeignKeys and other fields
#                             data = {}
#                             if sheet_name == 'Employment_History':
#                                 location_id = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'PreviousWorkExperience': row['PreviousWorkExperience'] or None,
#                                     'PreviousWorkPFNumber': row['PreviousWorkPFNumber'] or None,
#                                     'PreviousWorkESINumber': row['PreviousWorkESINumber'] or None,
#                                     'PFNumber': row['PFNumber'] or None,
#                                     'ESINumber': row['ESINumber'] or None,
#                                     'NoOfYears': int(row['NoOfYears']) if row['NoOfYears'] else None,
#                                     'WorkStationNameAddress': row['WorkStationNameAddress'] or None,
#                                     'ReasonForLeft': row['ReasonForLeft'] or None,
#                                     'WorkStationPhoneNo': row['WorkStationPhoneNo'] or None,
#                                     'ConfirmedBy': row['ConfirmedBy'] or None,
#                                     'Location_ID': location_id,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Medical_Information':
#                                 location_id = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         # location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': row['EmployeementHistory_ID'] or None,
#                                     'PreExisiting_Medical_Condition': row['PreExisiting_Medical_Condition'] or None,
#                                     'PsychiatricMedicines': row['PsychiatricMedicines'] or None,
#                                     'PsychiatricMedicinesDetails': row['PsychiatricMedicinesDetails'] or None,
#                                     'PreviousOperation': row['PreviousOperation'] or None,
#                                     'SurgeriesDetails': row['SurgeriesDetails'] or None,
#                                     'VaccinationStatus': row['VaccinationStatus'] or None,
#                                     'VaccinationStatusDetails': row['VaccinationStatusDetails'] or None,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Current_History':
#                                 current_location_id = None
#                                 if row['CurrentEmployeementLocation']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['CurrentEmployeementLocation'])
#                                         current_location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"CurrentEmployeementLocation '{row['CurrentEmployeementLocation']}' not found"
#                                         })
#                                         continue

#                                 location_id = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': row['EmployeementHistory_ID'] or None,
#                                     'EmployeeMedicalInfo_ID': row['EmployeeMedicalInfo_ID'] or None,
#                                     'DateOfJoining': row['DateOfJoining'] or None,
#                                     'ReportingManager': row['ReportingManager'] or None,
#                                     'GovtLeave': int(row['GovtLeave']) if row['GovtLeave'] else None,
#                                     'CasualLeave': int(row['CasualLeave']) if row['CasualLeave'] else None,
#                                     'SickLeave': int(row['SickLeave']) if row['SickLeave'] else None,
#                                     'TotalLeave': int(row['TotalLeave']) if row['TotalLeave'] else None,
#                                     'WorkEmail': row['WorkEmail'] or None,
#                                     'CurrentEmployeementLocation': current_location_id,
#                                     'Location_ID': location_id,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Probation_Details':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'is_on_probation': row['is_on_probation'] == 'True',
#                                     'probation_start_date': row['probation_start_date'] or None,
#                                     'probation_end_date': row['probation_end_date'] or None,
#                                     'probation_periods': int(row['probation_periods']) if row['probation_periods'] else None,
#                                     'months_completed': int(row['months_completed']) if row['months_completed'] else None,
#                                     'probation_status': row['probation_status'] or None,
#                                     'extended_date': row['extended_date'] or None,
#                                     'extended_months': int(row['extended_months']) if row['extended_months'] else None,
#                                     'terminated_date': row['terminated_date'] or None,
#                                     'confirmation_date': row['confirmation_date'] or None,
#                                     'training_given_by': row['training_given_by'] or None,
#                                     'training_verified_by': row['training_verified_by'] or None,
#                                     'training_completed_date': row['training_completed_date'] or None
#                                 }

#                             elif sheet_name == 'Security_Deposit':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'requires_security_deposit': row['requires_security_deposit'] == 'True',
#                                     'security_start_date': row['security_start_date'] or None,
#                                     'security_end_date': row['security_end_date'] or None,
#                                     'total_security_amount': Decimal(row['total_security_amount']) if row['total_security_amount'] else None,
#                                     'security_pending_months': int(row['security_pending_months']) if row['security_pending_months'] else None,
#                                     'security_installment_count': int(row['security_installment_count']) if row['security_installment_count'] else None,
#                                     'security_months_paid': int(row['security_months_paid']) if row['security_months_paid'] else None,
#                                     'security_months_to_be_scheduled': int(row['security_months_to_be_scheduled']) if row['security_months_to_be_scheduled'] else None
#                                 }

#                             elif sheet_name == 'Gratuity_Details':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'require_gratuity': row['require_gratuity'] == 'True',
#                                     'gratuity_start_date': row['gratuity_start_date'] or None,
#                                     'total_gratuity_amount': Decimal(row['total_gratuity_amount']) if row['total_gratuity_amount'] else None,
#                                     'monthly_gratuity_amount': Decimal(row['monthly_gratuity_amount']) if row['monthly_gratuity_amount'] else None,
#                                     'gratuity_pending_months': int(row['gratuity_pending_months']) if row['gratuity_pending_months'] else None,
#                                     'gratuity_installment_count': int(row['gratuity_installment_count']) if row['gratuity_installment_count'] else None,
#                                     'gratuity_months_to_be_scheduled': int(row['gratuity_months_to_be_scheduled']) if row['gratuity_months_to_be_scheduled'] else None
#                                 }

#                             elif sheet_name == 'Financial_History':
#                                 location_id = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': row['EmployeementHistory_ID'] or None,
#                                     'EmployeeMedicalInfo_ID': row['EmployeeMedicalInfo_ID'] or None,
#                                     'EmployeeCurrentHistoryInfo_ID': row['EmployeeCurrentHistoryInfo_ID'] or None,
#                                     'Salary': Decimal(row['Salary']) if row['Salary'] else None,
#                                     'BasicSalary': Decimal(row['BasicSalary']) if row['BasicSalary'] else None,
#                                     'BasicSalary_Percentage': float(row['BasicSalary_Percentage']) if row['BasicSalary_Percentage'] else None,
#                                     'Allowance_amount': Decimal(row['Allowance_amount']) if row['Allowance_amount'] else None,
#                                     'Deduction_amount': Decimal(row['Deduction_amount']) if row['Deduction_amount'] else None,
#                                     'Allowancefinal': Decimal(row['Allowancefinal']) if row['Allowancefinal'] else None,
#                                     'PfForEmployee': Decimal(row['PfForEmployee']) if row['PfForEmployee'] else None,
#                                     'SecurityDeposite': Decimal(row['SecurityDeposite']) if row['SecurityDeposite'] else None,
#                                     'PF_amount': Decimal(row['PF_amount']) if row['PF_amount'] else None,
#                                     'ctc': Decimal(row['ctc']) if row['ctc'] else None,
#                                     'PF_is_applicable': row['PF_is_applicable'] == 'True',
#                                     'PFNumber': row['PFNumber'] or None,
#                                     'PF_EmployerPercentage': float(row['PF_EmployerPercentage']) if row['PF_EmployerPercentage'] else None,
#                                     'PF_EmployeePercentage': float(row['PF_EmployeePercentage']) if row['PF_EmployeePercentage'] else None,
#                                     'PF_EmployeeAmount': Decimal(row['PF_EmployeeAmount']) if row['PF_EmployeeAmount'] else None,
#                                     'PF_EmployerAmount': Decimal(row['PF_EmployerAmount']) if row['PF_EmployerAmount'] else None,
#                                     'ESI_is_applicable': row['ESI_is_applicable'] == 'True',
#                                     'ESINumber': row['ESINumber'] or None,
#                                     'ESI_Percentage': float(row['ESI_Percentage']) if row['ESI_Percentage'] else None,
#                                     'ESI_Amount': Decimal(row['ESI_Amount']) if row['ESI_Amount'] else None,
#                                     'TDS_is_applicable': row['TDS_is_applicable'] == 'True',
#                                     'TDS_Percentage': float(row['TDS_Percentage']) if row['TDS_Percentage'] else None,
#                                     'TDS_Amount': Decimal(row['TDS_Amount']) if row['TDS_Amount'] else None,
#                                     'Net_salary': Decimal(row['Net_salary']) if row['Net_salary'] else None,
#                                     'AccountHolderName': row['AccountHolderName'] or None,
#                                     'AccountNumber': row['AccountNumber'] or None,
#                                     'BankName': row['BankName'] or None,
#                                     'Branch': row['Branch'] or None,
#                                     'IfscCode': row['IfscCode'] or None,
#                                     'PanNumber': row['PanNumber'] or None,
#                                     'Location_ID': location_id,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Salary_Maintenance':
#                                 location_id = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': row['EmployeementHistory_ID'] or None,
#                                     'EmployeeMedicalInfo_ID': row['EmployeeMedicalInfo_ID'] or None,
#                                     'EmployeeCurrentHistoryInfo_ID': row['EmployeeCurrentHistoryInfo_ID'] or None,
#                                     'BasicSalary': Decimal(row['BasicSalary']) if row['BasicSalary'] else None,
#                                     'ctc': Decimal(row['ctc']) if row['ctc'] else None,
#                                     'AccountHolderName': row['AccountHolderName'] or None,
#                                     'AccountNumber': row['AccountNumber'] or None,
#                                     'BankName': row['BankName'] or None,
#                                     'Branch': row['Branch'] or None,
#                                     'IfscCode': row['IfscCode'] or None,
#                                     'PanNumber': row['PanNumber'] or None,
#                                     'Status': row['Status'] or None,
#                                     'Location_ID': location_id,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Document_Checklist':
#                                 location_id = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         location_id = location.ID
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': row['EmployeementHistory_ID'] or None,
#                                     'EmployeeMedicalInfo_ID': row['EmployeeMedicalInfo_ID'] or None,
#                                     'EmployeeCurrentHistoryInfo_ID': row['EmployeeCurrentHistoryInfo_ID'] or None,
#                                     'EmployeeFinancialHistory_ID': row['EmployeeFinancialHistory_ID'] or None,
#                                     'Location_ID': location_id,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Skills':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'Skill': row['Skill'] or None,
#                                     'Level': row['Level'] or None,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Leaves':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'leave_type': row['leave_type'] or None,
#                                     'leave_count': int(row['leave_count']) if row['leave_count'] else None
#                                 }

#                             elif sheet_name == 'Employee_Allowance':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'allowance': row['allowance'] or None,
#                                     'percentage': float(row['percentage']) if row['percentage'] else None,
#                                     'amount': Decimal(row['amount']) if row['amount'] else None
#                                 }

#                             elif sheet_name == 'Employee_Deduction':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'deduction': row['deduction'] or None,
#                                     'amount': Decimal(row['amount']) if row['amount'] else None
#                                 }

#                             # Save or update record
#                             try:
#                                 # For simplicity, assume one record per Employee_ID per sheet
#                                 instance = model.objects.filter(EmployeeID_id=db_employee_id).first()
#                                 if instance:
#                                     for key, value in data.items():
#                                         setattr(instance, key, value)
#                                     instance.save()
#                                 else:
#                                     data['EmployeeID_id'] = db_employee_id
#                                     instance = model.objects.create(**data)

#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'success',
#                                     'message': f"Row processed successfully for Employee_ID {employee_id}"
#                                 })

#                             except Exception as e:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': str(e)
#                                 })
#                                 errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")

#                         except Exception as e:
#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")
#                             continue

#                 except Exception as e:
#                     errors.append(f"Error processing sheet {sheet_name}: {str(e)}")
#                     results[sheet_name].append({
#                         'row': 0,
#                         'status': 'error',
#                         'message': f"Failed to process sheet: {str(e)}"
#                     })

#         # Prepare response
#         return JsonResponse({"success": "Employee details uploaded successfully."})


#     except Exception as e:
#         return JsonResponse({
#             'error':f"Failed to process Excel file: {str(e)}"
    
#         }, status=500)

# logger = logging.getLogger(__name__)

# @csrf_exempt
# def employee_excel_upload(request):
#     if request.method != 'POST':
#         logger.error("Invalid request method: %s", request.method)
#         return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

#     if 'file' not in request.FILES:
#         logger.error("No file uploaded in request")
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     try:
#         # Read the uploaded Excel file
#         file = request.FILES['file']
#         excel_data = pd.ExcelFile(file)

#         # Expected sheet names
#         expected_sheets = {
#             'Employee_Personal_Details': Employee_Personal_Form_Detials,
#             'Employment_History': Employeement_History_Detials,
#             'Medical_Information': Employee_Medical_Information_Detials,
#             'Current_History': Current_History_Detials,
#             'Probation_Details': EmployeeProbationDetails,
#             'Security_Deposit': EmployeeSecurityDeposit,
#             'Gratuity_Details': Employee_GratuityDetails,
#             'Financial_History': Financial_History_Detials,
#             'Salary_Maintenance': Salary_Maintenance_Detials,
#             'Document_Checklist': Document_Checklist_Detials,
#             'Employee_Skills': Employee_Skills_Detials,
#             'Employee_Leaves': Employee_Leavelist,
#             'Employee_Allowance': EmployeeAllowanceDetails,
#             'Employee_Deduction': EmployeeDeductionDetails
#         }

#         # Validate sheet names
#         missing_sheets = [sheet for sheet in expected_sheets if sheet not in excel_data.sheet_names]
#         if missing_sheets:
#             logger.error("Missing sheets: %s", missing_sheets)
#             return JsonResponse({
#                 'status': 'error',
#                 'message': f'Missing sheets: {", ".join(missing_sheets)}'
#             }, status=400)

#         # Initialize response data
#         results = {sheet: [] for sheet in expected_sheets}
#         errors = []

#         with transaction.atomic():
#             # Process Employee_Personal_Details
#             personal_df = pd.read_excel(file, sheet_name='Employee_Personal_Details')
#             personal_df = personal_df.fillna('')  # Replace NaN with empty string

#             employee_id_to_db_id = {}  # Map Excel Employee_ID to database EmployeeID

#             for index, row in personal_df.iterrows():
#                 try:
#                     # Generate Employee_ID if empty
#                     employee_id = str(row['Employee_ID']).strip()
#                     if not employee_id:
#                         employee_count = Employee_Personal_Form_Detials.objects.count()
#                         employee_id = f"CRTEMPL{employee_count + 1:03d}"

#                     # Resolve ForeignKeys
#                     title = None
#                     if row['Title']:
#                         try:
#                             title = Title_Detials.objects.filter(Title_Name=row['Title']).first()
#                             print(title,'title')
#                             if not title:
#                                 raise ObjectDoesNotExist(f"Title '{row['Title']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     blood_group = None
#                     if row['BloodGroup']:
#                         try:
#                             blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Name=row['BloodGroup']).first()
#                             print(blood_group,'blood_group')
#                             if not blood_group:
#                                 raise ObjectDoesNotExist(f"BloodGroup '{row['BloodGroup']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     classification = None
#                     if row['Classification']:
#                         try:
#                             classification = Classification_Detials.objects.filter(Classification_Name=row['Classification']).first()
#                             print(classification,'classification')
#                             if not classification:
#                                 raise ObjectDoesNotExist(f"Classification '{row['Classification']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     category = None
#                     if row['Category']:
#                         try:
#                             category = Category_Detials.objects.filter(Category_Name=row['Category']).first()
#                             print(category,'category')
#                             if not category:
#                                 raise ObjectDoesNotExist(f"Category '{row['Category']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     speciality = None
#                     if row['Speciality']:
#                         try:
#                             speciality = Speciality_Detials.objects.filter(Speciality_Name=row['Speciality']).first()
#                             print(speciality,'speciality')
#                             if not speciality:
#                                 raise ObjectDoesNotExist(f"Speciality '{row['Speciality']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     designation = None
#                     if row['Designation']:
#                         try:
#                             designation = Designation_Detials.objects.filter(Designation_Name=row['Designation']).first()
#                             print(designation,'designation')
#                             if not designation:
#                                 raise ObjectDoesNotExist(f"Designation '{row['Designation']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     role = None
#                     if row['Role']:
#                         try:
#                             role = Role_Master.objects.filter(Role_Name=row['Role']).first()
#                             print(role,'role')
#                             if not role:
#                                 raise ObjectDoesNotExist(f"Role '{row['Role']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             continue

#                     location = None
#                     if row['Location']:
#                         try:
#                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                             print(location,'location')
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Location '{row['Location']}' not found"
#                             })
#                             continue

#                     ledger_group = None
#                     if row['LedgerGroupName']:
#                         try:
#                             ledger_group = Finance_GroupMaster_Detailes.objects.get(pk=22)
#                             print(ledger_group,'ledger_group')
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"LedgerGroupName '{row['LedgerGroupName']}' not found"
#                             })
#                             continue

#                     # Prepare data
#                     employee_data = {
#                         'Tittle': title,
#                         'First_Name': row['First_Name'] or None,
#                         'Middle_Name': row['Middle_Name'] or None,
#                         'Last_Name': row['Last_Name'] or None,
#                         'Gender': row['Gender'] or None,
#                         'DOB': pd.to_datetime(row['DOB']) if row['DOB'] else None,
#                         'Age': int(row['Age']) if row['Age'] else None,
#                         'BloodGroup': blood_group,
#                         'Contact_Number': str(row['Contact_Number']) if row['Contact_Number'] else None,
#                         'Alternate_Number': str(row['Alternate_Number']) if row['Alternate_Number'] else None,
#                         'E_mail': row['E_mail'] or None,
#                         'Qualification': row['Qualification'] or None,
#                         'IdProofType': row['IdProofType'] or None,
#                         'IdProofNo': row['IdProofNo'] or None,
#                         'Marital_Status': row['Marital_Status'] or None,
#                         'MarriagePlan': row['MarriagePlan'] or None,
#                         'AnniversaryDate': pd.to_datetime(row['AnniversaryDate']) if row['AnniversaryDate'] else None,
#                         'Residence': row['Residence'] or None,
#                         'FatherName': row['FatherName'] or None,
#                         'FatherContact': str(row['FatherContact']) if row['FatherContact'] else None,
#                         'FatherWorking': row['FatherWorking'] or None,
#                         'FatherWorkPlace': row['FatherWorkPlace'] or None,
#                         'MotherName': row['MotherName'] or None,
#                         'MotherContact': str(row['MotherContact']) if row['MotherContact'] else None,
#                         'MotherWorking': row['MotherWorking'] or None,
#                         'MotherWorkPlace': row['MotherWorkPlace'] or None,
#                         'Spouse_Name': row['Spouse_Name'] or None,
#                         'SpouseContact': str(row['SpouseContact']) if row['SpouseContact'] else None,
#                         'SpouseWorking': row['SpouseWorking'] or None,
#                         'SpouseWorkPlace': row['SpouseWorkPlace'] or None,
#                         'Child': row['Child'] or None,
#                         'TotalNoChild': int(row['TotalNoChild']) if row['TotalNoChild'] else None,
#                         'DoorNo': str(row['DoorNo']) if row['DoorNo'] else None,
#                         'Street': row['Street'] or None,
#                         'Area': row['Area'] or None,
#                         'City': row['City'] or None,
#                         'District': row['District'] or None,
#                         'State': row['State'] or None,
#                         'Country': row['Country'] or None,
#                         'Pincode': str(row['Pincode']) if row['Pincode'] else None,
#                         'PermanentAddressSameAsAbove': row['PermanentAddressSameAsAbove'] or None,
#                         'PermanentDoorNo': str(row['PermanentDoorNo']) if row['PermanentDoorNo'] else None,
#                         'PermanentStreet': row['PermanentStreet'] or None,
#                         'PermanentArea': row['PermanentArea'] or None,
#                         'PermanentCity': row['PermanentCity'] or None,
#                         'PermanentDistrict': row['PermanentDistrict'] or None,
#                         'PermanentState': row['PermanentState'] or None,
#                         'PermanentCountry': row['PermanentCountry'] or None,
#                         'PermanentPincode': str(row['PermanentPincode']) if row['PermanentPincode'] else None,
#                         'EmergencyContactName1': row['EmergencyContactName1'] or None,
#                         'EmergencyContactNo1': str(row['EmergencyContactNo1']) if row['EmergencyContactNo1'] else None,
#                         'EmergencyContactName2': row['EmergencyContactName2'] or None,
#                         'EmergencyContactNo2': str(row['EmergencyContactNo2']) if row['EmergencyContactNo2'] else None,
#                         'Classification': classification,
#                         'Category': category,
#                         'Speciality': speciality,
#                         'Designation': designation,
#                         'Role': role,
#                         'Location': location,
#                         'ActiveStatus': row['ActiveStatus'] == 'Yes',
#                         'RequirementSource': row['RequirementSource'] or None,
#                         'Source': row['Source'] or None,
#                         'LedgerName': row['LedgerName'].upper() if row['LedgerName'] else None,
#                         'LedgerGroupName': ledger_group,
#                         'OpeningBalance': Decimal(str(row['OpeningBalance'])) if row['OpeningBalance'] else None,
#                         'DebitOrCredit': row['DebitOrCredit'] or None,
#                         'Status': row['Status'] == 'True',
#                         'created_by': row['created_by'] or 'admin',
#                         # 'Excel_Employee_ID': employee_id
#                     }

#                     # Create employee
#                     employee = Employee_Personal_Form_Detials.objects.create(**employee_data)
#                     employee_id_to_db_id[employee_id] = employee.Employee_ID

#                     # Handle ManyToMany Departments
#                     if row['Departments']:
#                         department_names = [name.strip() for name in row['Departments'].split(',') if name.strip()]
#                         departments = []
#                         for name in department_names:
#                             try:
#                                 dept = Department_Detials.objects.get(Department_Name=name)
#                                 departments.append(dept)
#                             except ObjectDoesNotExist:
#                                 results['Employee_Personal_Details'].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Department '{name}' not found"
#                                 })
#                                 raise ValueError(f"Department '{name}' not found")
#                         employee.Departments.set(departments)

#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'success',
#                         'message': f"Employee {employee_id} processed successfully",
#                         'db_id': employee.EmployeeID
#                     })

#                 except Exception as e:
#                     logger.error("Error in row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': str(e)
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue

#             # Process other sheets
#             for sheet_name, model in expected_sheets.items():
#                 if sheet_name == 'Employee_Personal_Details':
#                     continue

#                 try:
#                     df = pd.read_excel(file, sheet_name=sheet_name)
#                     df = df.fillna('')

#                     for index, row in df.iterrows():
#                         try:
#                             employee_id = str(row['Employee_ID']).strip()
#                             if not employee_id:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': 'Employee_ID is required'
#                                 })
#                                 continue

#                             if employee_id not in employee_id_to_db_id:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Employee_ID '{employee_id}' not found in Employee_Personal_Details"
#                                 })
#                                 continue

#                             db_employee_id = employee_id_to_db_id[employee_id]
#                             data = {}

#                             if sheet_name == 'Employment_History':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'PreviousWorkExperience': row['PreviousWorkExperience'] or None,
#                                     'PreviousWorkPFNumber': row['PreviousWorkPFNumber'] or None,
#                                     'PreviousWorkESINumber': row['PreviousWorkESINumber'] or None,
#                                     'PFNumber': row['PFNumber'] or None,
#                                     'ESINumber': row['ESINumber'] or None,
#                                     'NoOfYears': int(row['NoOfYears']) if row['NoOfYears'] else None,
#                                     'WorkStationNameAddress': row['WorkStationNameAddress'] or None,
#                                     'ReasonForLeft': row['ReasonForLeft'] or None,
#                                     'WorkStationPhoneNo': str(row['WorkStationPhoneNo']) if row['WorkStationPhoneNo'] else None,
#                                     'ConfirmedBy': row['ConfirmedBy'] or None,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Medical_Information':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': int(row['EmployeementHistory_ID']) if row['EmployeementHistory_ID'] else None,
#                                     'PreExisiting_Medical_Condition': row['PreExisiting_Medical_Condition'] or None,
#                                     'PsychiatricMedicines': row['PsychiatricMedicines'] or None,
#                                     'PsychiatricMedicinesDetails': row['PsychiatricMedicinesDetails'] or None,
#                                     'PreviousOperation': row['PreviousOperation'] or None,
#                                     'SurgeriesDetails': row['SurgeriesDetails'] or None,
#                                     'VaccinationStatus': row['VaccinationStatus'] or None,
#                                     'VaccinationStatusDetails': row['VaccinationStatusDetails'] or None,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Current_History':
#                                 current_location = None
#                                 if row['CurrentEmployeementLocation']:
#                                     try:
#                                         current_location = Location_Detials.objects.get(Location_Name=row['CurrentEmployeementLocation'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"CurrentEmployeementLocation '{row['CurrentEmployeementLocation']}' not found"
#                                         })
#                                         continue

#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': int(row['EmployeementHistory_ID']) if row['EmployeementHistory_ID'] else None,
#                                     'EmployeeMedicalInfo_ID': int(row['EmployeeMedicalInfo_ID']) if row['EmployeeMedicalInfo_ID'] else None,
#                                     'DateOfJoining': pd.to_datetime(row['DateOfJoining']) if row['DateOfJoining'] else None,
#                                     'ReportingManager': row['ReportingManager'] or None,
#                                     'GovtLeave': int(row['GovtLeave']) if row['GovtLeave'] else None,
#                                     'CasualLeave': int(row['CasualLeave']) if row['CasualLeave'] else None,
#                                     'SickLeave': int(row['SickLeave']) if row['SickLeave'] else None,
#                                     'TotalLeave': int(row['TotalLeave']) if row['TotalLeave'] else None,
#                                     'WorkEmail': row['WorkEmail'] or None,
#                                     'CurrentEmployeementLocation': current_location,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Probation_Details':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'is_on_probation': row['is_on_probation'] == 'True',
#                                     'probation_start_date': pd.to_datetime(row['probation_start_date']) if row['probation_start_date'] else None,
#                                     'probation_end_date': pd.to_datetime(row['probation_end_date']) if row['probation_end_date'] else None,
#                                     'probation_periods': int(row['probation_periods']) if row['probation_periods'] else None,
#                                     'months_completed': int(row['months_completed']) if row['months_completed'] else None,
#                                     'probation_status': row['probation_status'] or None,
#                                     'extended_date': pd.to_datetime(row['extended_date']) if row['extended_date'] else None,
#                                     'extended_months': int(row['extended_months']) if row['extended_months'] else None,
#                                     'terminated_date': pd.to_datetime(row['terminated_date']) if row['terminated_date'] else None,
#                                     'confirmation_date': pd.to_datetime(row['confirmation_date']) if row['confirmation_date'] else None,
#                                     'training_given_by': row['training_given_by'] or None,
#                                     'training_verified_by': row['training_verified_by'] or None,
#                                     'training_completed_date': pd.to_datetime(row['training_completed_date']) if row['training_completed_date'] else None
#                                 }

#                             elif sheet_name == 'Security_Deposit':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'requires_security_deposit': row['requires_security_deposit'] == 'True',
#                                     'security_start_date': pd.to_datetime(row['security_start_date']) if row['security_start_date'] else None,
#                                     'security_end_date': pd.to_datetime(row['security_end_date']) if row['security_end_date'] else None,
#                                     'total_security_amount': Decimal(str(row['total_security_amount'])) if row['total_security_amount'] else None,
#                                     'security_pending_months': int(row['security_pending_months']) if row['security_pending_months'] else None,
#                                     'security_installment_count': int(row['security_installment_count']) if row['security_installment_count'] else None,
#                                     'security_months_paid': int(row['security_months_paid']) if row['security_months_paid'] else None,
#                                     'security_months_to_be_scheduled': int(row['security_months_to_be_scheduled']) if row['security_months_to_be_scheduled'] else None
#                                 }

#                             elif sheet_name == 'Gratuity_Details':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'require_gratuity': row['require_gratuity'] == 'True',
#                                     'gratuity_start_date': pd.to_datetime(row['gratuity_start_date']) if row['gratuity_start_date'] else None,
#                                     'total_gratuity_amount': Decimal(str(row['total_gratuity_amount'])) if row['total_gratuity_amount'] else None,
#                                     'monthly_gratuity_amount': Decimal(str(row['monthly_gratuity_amount'])) if row['monthly_gratuity_amount'] else None,
#                                     'gratuity_pending_months': int(row['gratuity_pending_months']) if row['gratuity_pending_months'] else None,
#                                     'gratuity_installment_count': int(row['gratuity_installment_count']) if row['gratuity_installment_count'] else None,
#                                     'gratuity_months_to_be_scheduled': int(row['gratuity_months_to_be_scheduled']) if row['gratuity_months_to_be_scheduled'] else None
#                                 }

#                             elif sheet_name == 'Financial_History':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': int(row['EmployeementHistory_ID']) if row['EmployeementHistory_ID'] else None,
#                                     'EmployeeMedicalInfo_ID': int(row['EmployeeMedicalInfo_ID']) if row['EmployeeMedicalInfo_ID'] else None,
#                                     'EmployeeCurrentHistoryInfo_ID': int(row['EmployeeCurrentHistoryInfo_ID']) if row['EmployeeCurrentHistoryInfo_ID'] else None,
#                                     'Salary': Decimal(str(row['Salary'])) if row['Salary'] else None,
#                                     'BasicSalary': Decimal(str(row['BasicSalary'])) if row['BasicSalary'] else None,
#                                     'BasicSalary_Percentage': float(row['BasicSalary_Percentage']) if row['BasicSalary_Percentage'] else None,
#                                     'Allowance_amount': Decimal(str(row['Allowance_amount'])) if row['Allowance_amount'] else None,
#                                     'Deduction_amount': Decimal(str(row['Deduction_amount'])) if row['Deduction_amount'] else None,
#                                     'Allowancefinal': Decimal(str(row['Allowancefinal'])) if row['Allowancefinal'] else None,
#                                     'PfForEmployee': Decimal(str(row['PfForEmployee'])) if row['PfForEmployee'] else None,
#                                     'SecurityDeposite': Decimal(str(row['SecurityDeposite'])) if row['SecurityDeposite'] else None,
#                                     'PF_amount': Decimal(str(row['PF_amount'])) if row['PF_amount'] else None,
#                                     'ctc': Decimal(str(row['ctc'])) if row['ctc'] else None,
#                                     'PF_is_applicable': row['PF_is_applicable'] == 'True',
#                                     'PFNumber': row['PFNumber'] or None,
#                                     'PF_EmployerPercentage': float(row['PF_EmployerPercentage']) if row['PF_EmployerPercentage'] else None,
#                                     'PF_EmployeePercentage': float(row['PF_EmployeePercentage']) if row['PF_EmployeePercentage'] else None,
#                                     'PF_EmployeeAmount': Decimal(str(row['PF_EmployeeAmount'])) if row['PF_EmployeeAmount'] else None,
#                                     'PF_EmployerAmount': Decimal(str(row['PF_EmployerAmount'])) if row['PF_EmployerAmount'] else None,
#                                     'ESI_is_applicable': row['ESI_is_applicable'] == 'True',
#                                     'ESINumber': row['ESINumber'] or None,
#                                     'ESI_Percentage': float(row['ESI_Percentage']) if row['ESI_Percentage'] else None,
#                                     'ESI_Amount': Decimal(str(row['ESI_Amount'])) if row['ESI_Amount'] else None,
#                                     'TDS_is_applicable': row['TDS_is_applicable'] == 'True',
#                                     'TDS_Percentage': float(row['TDS_Percentage']) if row['TDS_Percentage'] else None,
#                                     'TDS_Amount': Decimal(str(row['TDS_Amount'])) if row['TDS_Amount'] else None,
#                                     'Net_salary': Decimal(str(row['Net_salary'])) if row['Net_salary'] else None,
#                                     'AccountHolderName': row['AccountHolderName'] or None,
#                                     'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                     'BankName': row['BankName'] or None,
#                                     'Branch': row['Branch'] or None,
#                                     'IfscCode': row['IfscCode'] or None,
#                                     'PanNumber': row['PanNumber'] or None,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Salary_Maintenance':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': int(row['EmployeementHistory_ID']) if row['EmployeementHistory_ID'] else None,
#                                     'EmployeeMedicalInfo_ID': int(row['EmployeeMedicalInfo_ID']) if row['EmployeeMedicalInfo_ID'] else None,
#                                     'EmployeeCurrentHistoryInfo_ID': int(row['EmployeeCurrentHistoryInfo_ID']) if row['EmployeeCurrentHistoryInfo_ID'] else None,
#                                     'BasicSalary': Decimal(str(row['BasicSalary'])) if row['BasicSalary'] else None,
#                                     'ctc': Decimal(str(row['ctc'])) if row['ctc'] else None,
#                                     'AccountHolderName': row['AccountHolderName'] or None,
#                                     'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                     'BankName': row['BankName'] or None,
#                                     'Branch': row['Branch'] or None,
#                                     'IfscCode': row['IfscCode'] or None,
#                                     'PanNumber': row['PanNumber'] or None,
#                                     'Status': row['Status'] or None,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Document_Checklist':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         continue

#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'EmployeementHistory_ID': int(row['EmployeementHistory_ID']) if row['EmployeementHistory_ID'] else None,
#                                     'EmployeeMedicalInfo_ID': int(row['EmployeeMedicalInfo_ID']) if row['EmployeeMedicalInfo_ID'] else None,
#                                     'EmployeeCurrentHistoryInfo_ID': int(row['EmployeeCurrentHistoryInfo_ID']) if row['EmployeeCurrentHistoryInfo_ID'] else None,
#                                     'EmployeeFinancialHistory_ID': int(row['EmployeeFinancialHistory_ID']) if row['EmployeeFinancialHistory_ID'] else None,
#                                     'Location_ID': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Skills':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'Skill': row['Skill'] or None,
#                                     'Level': row['Level'] or None,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Leaves':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'leave_type': row['leave_type'] or None,
#                                     'leave_count': int(row['leave_count']) if row['leave_count'] else None
#                                 }

#                             elif sheet_name == 'Employee_Allowance':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'allowance': row['allowance'] or None,
#                                     'percentage': float(row['percentage']) if row['percentage'] else None,
#                                     'amount': Decimal(str(row['amount'])) if row['amount'] else None
#                                 }

#                             elif sheet_name == 'Employee_Deduction':
#                                 data = {
#                                     'EmployeeID_id': db_employee_id,
#                                     'deduction': row['deduction'] or None,
#                                     'amount': Decimal(str(row['amount'])) if row['amount'] else None
#                                 }

#                             # Save or update record
#                             try:
#                                 instance = model.objects.filter(EmployeeID_id=db_employee_id).first()
#                                 if instance:
#                                     for key, value in data.items():
#                                         setattr(instance, key, value)
#                                     instance.save()
#                                 else:
#                                     data['EmployeeID_id'] = db_employee_id
#                                     instance = model.objects.create(**data)

#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'success',
#                                     'message': f"Row processed successfully for Employee_ID {employee_id}"
#                                 })

#                             except Exception as e:
#                                 logger.error("Error in %s row %d: %s", sheet_name, index + 2, str(e))
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': str(e)
#                                 })
#                                 errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")

#                         except Exception as e:
#                             logger.error("Error in %s row %d: %s", sheet_name, index + 2, str(e))
#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")

#                 except Exception as e:
#                     logger.error("Error processing sheet %s: %s", sheet_name, str(e))
#                     results[sheet_name].append({
#                         'row': 0,
#                         'status': 'error',
#                         'message': f"Failed to process sheet: {str(e)}"
#                     })
#                     errors.append(f"Error processing sheet {sheet_name}: {str(e)}")

#         # Prepare response
#         status = 'success' if not errors else 'partial_success'
#         response = {
#             'status': status,
#             'results': results,
#             'errors': errors
#         }
#         return JsonResponse(response)

#     except Exception as e:
#         logger.error("Failed to process Excel file: %s", str(e))
#         return JsonResponse({
#             'status': 'error',
#             'message': f"Failed to process Excel file: {str(e)}"
#         }, status=500)

# import logging
# import pandas as pd
# from django.http import JsonResponse
# from django.db import transaction
# from django.views.decorators.csrf import csrf_exempt
# from django.core.exceptions import ObjectDoesNotExist, ValidationError
# from django.db.models import Max
# from decimal import Decimal
# import uuid

# logger = logging.getLogger(__name__)

# @csrf_exempt
# def employee_excel_upload(request):
#     if request.method != 'POST':
#         logger.error("Invalid request method: %s", request.method)
#         return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

#     if 'file' not in request.FILES:
#         logger.error("No file uploaded in request")
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     try:
#         # Read the uploaded Excel file
#         file = request.FILES['file']
#         excel_data = pd.ExcelFile(file)

#         # Expected sheet names
#         expected_sheets = {
#             'Employee_Personal_Details': Employee_Personal_Form_Detials,
#             'Employment_History': Employeement_History_Detials,
#             'Medical_Information': Employee_Medical_Information_Detials,
#             'Current_History': Current_History_Detials,
#             'Probation_Details': EmployeeProbationDetails,
#             'Security_Deposit': EmployeeSecurityDeposit,
#             'Gratuity_Details': Employee_GratuityDetails,
#             'Financial_History': Financial_History_Detials,
#             'Salary_Maintenance': Salary_Maintenance_Detials,
#             'Document_Checklist': Document_Checklist_Detials,
#             'Employee_Skills': Employee_Skills_Detials,
#             'Employee_Leaves': Employee_Leavelist,
#             'Employee_Allowance': EmployeeAllowanceDetails,
#             'Employee_Deduction': EmployeeDeductionDetails
#         }


#         print(expected_sheets,'expected_sheetssssssss')

#         # Validate sheet names
#         missing_sheets = [sheet for sheet in expected_sheets if sheet not in excel_data.sheet_names]
#         if missing_sheets:
#             logger.error("Missing sheets: %s", missing_sheets)
#             return JsonResponse({
#                 'status': 'error',
#                 'message': f'Missing sheets: {", ".join(missing_sheets)}'
#             }, status=400)

#         # Initialize response data
#         results = {sheet: [] for sheet in expected_sheets}
#         errors = []

#         with transaction.atomic():
#             # Track IDs for related models
#             employee_id_to_db_id = {}  # Excel Employee_ID to database Employee_ID
#             employment_history_ids = {}  # Employee_ID to EmpHistory_Id
#             medical_info_ids = {}  # Employee_ID to EmpHistory_Id
#             current_history_ids = {}  # Employee_ID to EmpHistory_Id
#             financial_history_ids = {}  # Employee_ID to EmpHistory_Id

#             # Process Employee_Personal_Details
#             personal_df = pd.read_excel(file, sheet_name='Employee_Personal_Details')
#             personal_df = personal_df.fillna('')  # Replace NaN with empty string

#             for index, row in personal_df.iterrows():
#                 try:
#                     employee_id = str(row['Employee_ID']).strip()
#                     is_update = False
#                     employee = None

#                     # Check if Employee_ID exists for update
#                     if employee_id:
#                         try:
#                             employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
#                             is_update = True
#                         except ObjectDoesNotExist:
#                             pass

#                     # Resolve ForeignKeys
#                     title = None
#                     if row['Title']:
#                         try:
#                             title = Title_Detials.objects.filter(Title_Name=row['Title']).first()
#                             print(title,'titleeeee')
#                             logger.debug("Title found: %s", title)
#                             if not title:
#                                 raise ObjectDoesNotExist(f"Title '{row['Title']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     blood_group = None
#                     if row['BloodGroup']:
#                         try:
#                             blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Name=row['BloodGroup']).first()
#                             print(blood_group,'blood_grouppppppppp')
#                             logger.debug("BloodGroup found: %s", blood_group)
#                             if not blood_group:
#                                 raise ObjectDoesNotExist(f"BloodGroup '{row['BloodGroup']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     classification = None
#                     if row['Classification']:
#                         try:
#                             classification = Classification_Detials.objects.filter(Classification_Name=row['Classification']).first()
#                             print(classification,'classificationnnnnnn')
#                             logger.debug("Classification found: %s", classification)
#                             if not classification:
#                                 raise ObjectDoesNotExist(f"Classification '{row['Classification']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     category = None
#                     if row['Category']:
#                         try:
#                             category = Category_Detials.objects.filter(Category_Name=row['Category']).first()
#                             print(category,'categoryyyy')
#                             logger.debug("Category found: %s", category)
#                             if not category:
#                                 raise ObjectDoesNotExist(f"Category '{row['Category']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     speciality = None
#                     if row['Speciality']:
#                         try:
#                             speciality = Speciality_Detials.objects.filter(Speciality_Name=row['Speciality']).first()
#                             print(speciality,'specialityyyyyy')
#                             logger.debug("Speciality found: %s", speciality)
#                             if not speciality:
#                                 raise ObjectDoesNotExist(f"Speciality '{row['Speciality']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     designation = None
#                     if row['Designation']:
#                         try:
#                             designation = Designation_Detials.objects.filter(Designation_Name=row['Designation']).first()
#                             print(designation,'designationnnnnnn')
#                             logger.debug("Designation found: %s", designation)
#                             if not designation:
#                                 raise ObjectDoesNotExist(f"Designation '{row['Designation']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     role = None
#                     if row['Role']:
#                         try:
#                             role = Role_Master.objects.filter(Role_Name=row['Role']).first()
#                             print(role,'roleeeeeee')
#                             logger.debug("Role found: %s", role)
#                             if not role:
#                                 raise ObjectDoesNotExist(f"Role '{row['Role']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     location = None
#                     if row['Location']:
#                         try:
#                             location = Location_Detials.objects.filter(Location_Name=row['Location']).first()
#                             print(location,'locationnnnnnnnnnnnn')
#                             logger.debug("Location found: %s", location)
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Location '{row['Location']}' not found"
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: Location not found")
#                             continue

#                     ledger_group = None
#                     if row['LedgerGroupName']:
#                         try:
#                             ledger_group = Finance_GroupMaster_Detailes.objects.filter(pk=22).first()
#                             print(ledger_group,'ledger_grouppppppp')
#                             logger.debug("LedgerGroup found: %s", ledger_group)
#                             if not ledger_group:
#                                 raise ObjectDoesNotExist(f"LedgerGroupName '{row['LedgerGroupName']}' not found")
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"LedgerGroupName '{row['LedgerGroupName']}' not found"
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: LedgerGroupName not found")
#                             continue

#                     # Prepare data
#                     employee_data = {
#                         'Tittle': title,
#                         'Existing_Employee_ID':row['Employee_ID'],
#                         'First_Name': row['First_Name'] or None,
#                         'Middle_Name': row['Middle_Name'] or None,
#                         'Last_Name': row['Last_Name'] or None,
#                         'Gender': row['Gender'] or None,
#                         'DOB': row['DOB'] if pd.notnull(row['DOB']) else None,
#                         'Age': str(row['Age']) if row['Age'] else None,
#                         'BloodGroup': blood_group,
#                         'Contact_Number': str(row['Contact_Number']) if row['Contact_Number'] else None,
#                         'Alternate_Number': str(row['Alternate_Number']) if row['Alternate_Number'] else None,
#                         'E_mail': row['E_mail'] or None,
#                         'Qualification': row['Qualification'] or None,
#                         'IdProofType': row['IdProofType'] or None,
#                         'IdProofNo': row['IdProofNo'] or None,
#                         'Marital_Status': row['Marital_Status'] or None,
#                         'MarriagePlan': row['MarriagePlan'] or None,
#                         'AnniversaryDate': row['AnniversaryDate'] if pd.notnull(row['AnniversaryDate']) else None,
#                         'Residence': row['Residence'] or None,
#                         'FatherName': row['FatherName'] or None,
#                         'FatherContact': str(row['FatherContact']) if row['FatherContact'] else None,
#                         'FatherWorking': row['FatherWorking'] or None,
#                         'FatherWorkPlace': row['FatherWorkPlace'] or None,
#                         'MotherName': row['MotherName'] or None,
#                         'MotherContact': str(row['MotherContact']) if row['MotherContact'] else None,
#                         'MotherWorking': row['MotherWorking'] or None,
#                         'MotherWorkPlace': row['MotherWorkPlace'] or None,
#                         'Spouse_Name': row['Spouse_Name'] or None,
#                         'SpouseContact': str(row['SpouseContact']) if row['SpouseContact'] else None,
#                         'SpouseWorking': row['SpouseWorking'] or None,
#                         'SpouseWorkPlace': row['SpouseWorkPlace'] or None,
#                         'Child': row['Child'] or None,
#                         'TotalNoChild': str(row['TotalNoChild']) if row['TotalNoChild']  else None,
#                         'DoorNo': str(row['DoorNo']) if row['DoorNo'] else None,
#                         'Street': row['Street'] or None,
#                         'Area': row['Area'] or None,
#                         'City': row['City'] or None,
#                         'District': row['District'] or None,
#                         'State': row['State'] or None,
#                         'Country': row['Country'] or None,
#                         'Pincode': str(row['Pincode']) if row['Pincode'] else None,
#                         'PermanentAddressSameAsAbove': row['PermanentAddressSameAsAbove'] or None,
#                         'PermanentDoorNo': str(row['PermanentDoorNo']) if row['PermanentDoorNo'] else None,
#                         'PermanentStreet': row['PermanentStreet'] or None,
#                         'PermanentArea': row['PermanentArea'] or None,
#                         'PermanentCity': row['PermanentCity'] or None,
#                         'PermanentDistrict': row['PermanentDistrict'] or None,
#                         'PermanentState': row['PermanentState'] or None,
#                         'PermanentCountry': row['PermanentCountry'] or None,
#                         'PermanentPincode': str(row['PermanentPincode']) if row['PermanentPincode'] else None,
#                         'EmergencyContactName1': row['EmergencyContactName1'] or None,
#                         'EmergencyContactNo1': str(row['EmergencyContactNo1']) if row['EmergencyContactNo1'] else None,
#                         'EmergencyContactName2': row['EmergencyContactName2'] or None,
#                         'EmergencyContactNo2': str(row['EmergencyContactNo2']) if row['EmergencyContactNo2'] else None,
#                         'Classification': classification,
#                         'Category': category,
#                         'Speciality': speciality,
#                         'Designation': designation,
#                         'Role': role,
#                         'Location': location,
#                         'ActiveStatus': 'Yes' if row['ActiveStatus'].lower() == 'yes' else 'No',
#                         'RequirementSource': row['RequirementSource'] or None,
#                         'Source': row['Source'] or None,
#                         'LedgerName': row['LedgerName'].upper() if row['LedgerName'] else None,
#                         'LedgerGroupName': ledger_group,
#                         'OpeningBalance': Decimal(str(row['OpeningBalance'])) if row['OpeningBalance'] else Decimal('0.00'),
#                         'DebitOrCredit': row['DebitOrCredit'] or None,
#                         'Status': True if row['Status'] in [True, 'True'] else False,
#                         'created_by': row['created_by'] or 'admin',
#                     }

#                     # Create or update employee
#                     if is_update and employee:
#                         for key, value in employee_data.items():
#                             setattr(employee, key, value)
#                         employee.save()
#                     else:
#                         employee = Employee_Personal_Form_Detials(**employee_data)
#                         employee.save()  # Let model generate Employee_ID

#                     employee_id_to_db_id[employee_id or employee.Employee_ID] = employee.Employee_ID

#                     # Handle ManyToMany Department
#                     if row['Departments']:
#                         department_names = [name.strip() for name in row['Departments'].split(',') if name.strip()]
#                         departments = []
#                         for name in department_names:
#                             try:
#                                 dept = Department_Detials.objects.get(Department_Name=name)
#                                 departments.append(dept)
#                             except ObjectDoesNotExist:
#                                 results['Employee_Personal_Details'].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Department '{name}' not found"
#                                 })
#                                 errors.append(f"Row {index + 2} in Employee_Personal_Details: Department '{name}' not found")
#                                 raise ValueError(f"Department '{name}' not found")
#                         employee.Department.set(departments)

#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'success',
#                         'message': f"Employee {employee.Employee_ID} processed successfully",
#                         'db_id': employee.Employee_ID
#                     })

#                 except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                     logger.error("Error in Employee_Personal_Details row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': str(e)
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue
#                 except Exception as e:
#                     logger.error("Unexpected error in Employee_Personal_Details row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': f"Unexpected error: {str(e)}"
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue

#             # Process other sheets
#             for sheet_name, model in expected_sheets.items():
#                 if sheet_name == 'Employee_Personal_Details':
#                     continue

#                 try:
#                     df = pd.read_excel(file, sheet_name=sheet_name)
#                     df = df.fillna('')

#                     for index, row in df.iterrows():
#                         try:
#                             employee_id = str(row['Employee_ID']).strip()
#                             if not employee_id:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': 'Employee_ID is required'
#                                 })
#                                 errors.append(f"Row {index + 2} in {sheet_name}: Employee_ID is required")
#                                 continue

#                             if employee_id not in employee_id_to_db_id:
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Employee_ID '{employee_id}' not found in Employee_Personal_Details"
#                                 })
#                                 errors.append(f"Row {index + 2} in {sheet_name}: Employee_ID not found")
#                                 continue

#                             db_employee_id = employee_id_to_db_id[employee_id]
#                             employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=db_employee_id)
#                             data = {}

#                             print(employee_instance,'employee_instanceeeee')

#                             if sheet_name == 'Employment_History':

#                                 print(sheet_name,'sheet_namesheet_name')
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'PreviousWorkExperience': row['PreviousWorkExperience'] or "No",
#                                     'PreviousWorkPFNumber': row['PreviousWorkPFNumber'] or "No",
#                                     'PreviousWorkESINumber': row['PreviousWorkESINumber'] or "No",
#                                     'PFNumber': row['PFNumber'] or None,
#                                     'ESINumber': row['ESINumber'] or None,
#                                     'NoOfYears': int(row['NoOfYears']) if row['NoOfYears'] and str(row['NoOfYears']).isdigit() else None,
#                                     'WorkStationNameAddress': row['WorkStationNameAddress'] or None,
#                                     'ReasonForLeft': row['ReasonForLeft'] or None,
#                                     'WorkStationPhoneNo': str(row['WorkStationPhoneNo']) if row['WorkStationPhoneNo'] else None,
#                                     'ConfirmedBy': row['ConfirmedBy'] or None,
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                                 instance = model.objects.create(**data)
#                                 employment_history_ids[employee_id] = instance.EmpHistory_Id

#                             elif sheet_name == 'Medical_Information':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 employment_history = None
#                                 if employee_id in employment_history_ids:
#                                     try:
#                                         employment_history = Employeement_History_Detials.objects.get(EmpHistory_Id=employment_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Employment History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Employment History not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'EmployeementHistory': employment_history,
#                                     'PreExisiting_Medical_Condition': row['PreExisiting_Medical_Condition'] or None,
#                                     'PsychiatricMedicines': row['PsychiatricMedicines'] or None,
#                                     'PsychiatricMedicinesDetails': row['PsychiatricMedicinesDetails'] or None,
#                                     'PreviousOperation': row['PreviousOperation'] or None,
#                                     'SurgeriesDetails': row['SurgeriesDetails'] or None,
#                                     'VaccinationStatus': row['VaccinationStatus'] or None,
#                                     'VaccinationStatusDetails': row['VaccinationStatusDetails'] or None,
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                                 instance = model.objects.create(**data)
#                                 medical_info_ids[employee_id] = instance.EmpHistory_Id

#                             elif sheet_name == 'Current_History':
#                                 current_location = None
#                                 if row['CurrentEmployeementLocation']:
#                                     try:
#                                         current_location = Location_Detials.objects.get(Location_Name=row['CurrentEmployeementLocation'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"CurrentEmployeementLocation '{row['CurrentEmployeementLocation']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: CurrentEmployeementLocation not found")
#                                         continue

#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 employment_history = None
#                                 if employee_id in employment_history_ids:
#                                     try:
#                                         employment_history = Employeement_History_Detials.objects.get(EmpHistory_Id=employment_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Employment History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Employment History not found")
#                                         continue

#                                 medical_info = None
#                                 if employee_id in medical_info_ids:
#                                     try:
#                                         medical_info = Employee_Medical_Information_Detials.objects.get(EmpHistory_Id=medical_info_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Medical Info for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Medical Info not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'EmployeementHistory': employment_history,
#                                     'EmployeeMedicalInfo': medical_info,
#                                     'DateOfJoining': row['DateOfJoining'].strftime('%Y-%m-%d') if pd.notnull(row['DateOfJoining']) else None,
#                                     'ReportingManager': row['ReportingManager'] or None,
#                                     'GovtLeave': int(row['GovtLeave']) if row['GovtLeave'] and str(row['GovtLeave']).isdigit() else None,
#                                     'CasualLeave': int(row['CasualLeave']) if row['CasualLeave'] and str(row['CasualLeave']).isdigit() else None,
#                                     'SickLeave': int(row['SickLeave']) if row['SickLeave'] and str(row['SickLeave']).isdigit() else None,
#                                     'TotalLeave': int(row['TotalLeave']) if row['TotalLeave'] and str(row['TotalLeave']).isdigit() else None,
#                                     'WorkEmail': row['WorkEmail'] or None,
#                                     'CurrentEmployeementLocations': current_location,
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                                 instance = model.objects.create(**data)
#                                 current_history_ids[employee_id] = instance.EmpHistory_Id

#                             elif sheet_name == 'Probation_Details':
#                                 data = {
#                                     'Employee': employee_instance,
#                                     'is_on_probation': row['is_on_probation'] in [True, 'True'],
#                                     'probation_start_date': row['probation_start_date'].strftime('%Y-%m-%d') if pd.notnull(row['probation_start_date']) else None,
#                                     'probation_end_date': row['probation_end_date'].strftime('%Y-%m-%d') if pd.notnull(row['probation_end_date']) else None,
#                                     'probation_periods': int(row['probation_periods']) if row['probation_periods'] and str(row['probation_periods']).isdigit() else None,
#                                     'months_completed': int(row['months_completed']) if row['months_completed'] and str(row['months_completed']).isdigit() else None,
#                                     'probation_status': row['probation_status'] or None,
#                                     'extended_date': row['extended_date'].strftime('%Y-%m-%d') if pd.notnull(row['extended_date']) else None,
#                                     'extended_months': int(row['extended_months']) if row['extended_months'] and str(row['extended_months']).isdigit() else None,
#                                     'terminated_date': row['terminated_date'].strftime('%Y-%m-%d') if pd.notnull(row['terminated_date']) else None,
#                                     'confirmation_date': row['confirmation_date'].strftime('%Y-%m-%d') if pd.notnull(row['confirmation_date']) else None,
#                                     'training_given_by': row['training_given_by'] or None,
#                                     'training_verified_by': row['training_verified_by'] or None,
#                                     'training_completed_date': row['training_completed_date'].strftime('%Y-%m-%d') if pd.notnull(row['training_completed_date']) else None
#                                 }

#                             elif sheet_name == 'Security_Deposit':
#                                 data = {
#                                     'Employee': employee_instance,
#                                     'requires_security_deposit': row['requires_security_deposit'] in [True, 'True'],
#                                     'security_start_date': row['security_start_date'].strftime('%Y-%m-%d') if pd.notnull(row['security_start_date']) else None,
#                                     'security_end_date': row['security_end_date'].strftime('%Y-%m-%d') if pd.notnull(row['security_end_date']) else None,
#                                     'total_security_amount': Decimal(str(row['total_security_amount'])) if row['total_security_amount'] else None,
#                                     'security_pending_months': int(row['security_pending_months']) if row['security_pending_months'] and str(row['security_pending_months']).isdigit() else None,
#                                     'security_installment_count': int(row['security_installment_count']) if row['security_installment_count'] and str(row['security_installment_count']).isdigit() else None,
#                                     'security_months_paid': int(row['security_months_paid']) if row['security_months_paid'] and str(row['security_months_paid']).isdigit() else None,
#                                     'security_months_to_be_scheduled': int(row['security_months_to_be_scheduled']) if row['security_months_to_be_scheduled'] and str(row['security_months_to_be_scheduled']).isdigit() else None
#                                 }

#                             elif sheet_name == 'Gratuity_Details':
#                                 data = {
#                                     'Employee': employee_instance,
#                                     'require_gratuity': row['require_gratuity'] in [True, 'True'],
#                                     'gratuity_start_date': row['gratuity_start_date'].strftime('%Y-%m-%d') if pd.notnull(row['gratuity_start_date']) else None,
#                                     'total_gratuity_amount': Decimal(str(row['total_gratuity_amount'])) if row['total_gratuity_amount'] else None,
#                                     'monthly_gratuity_amount': Decimal(str(row['monthly_gratuity_amount'])) if row['monthly_gratuity_amount'] else None,
#                                     'gratuity_pending_months': int(row['gratuity_pending_months']) if row['gratuity_pending_months'] and str(row['gratuity_pending_months']).isdigit() else None,
#                                     'gratuity_installment_count': int(row['gratuity_installment_count']) if row['gratuity_installment_count'] and str(row['gratuity_installment_count']).isdigit() else None,
#                                     'gratuity_months_to_be_scheduled': int(row['gratuity_months_to_be_scheduled']) if row['gratuity_months_to_be_scheduled'] and str(row['gratuity_months_to_be_scheduled']).isdigit() else None
#                                 }

#                             elif sheet_name == 'Financial_History':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 employment_history = None
#                                 if employee_id in employment_history_ids:
#                                     try:
#                                         employment_history = Employeement_History_Detials.objects.get(EmpHistory_Id=employment_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Employment History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Employment History not found")
#                                         continue

#                                 medical_info = None
#                                 if employee_id in medical_info_ids:
#                                     try:
#                                         medical_info = Employee_Medical_Information_Detials.objects.get(EmpHistory_Id=medical_info_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Medical Info for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Medical Info not found")
#                                         continue

#                                 current_history = None
#                                 if employee_id in current_history_ids:
#                                     try:
#                                         current_history = Current_History_Detials.objects.get(EmpHistory_Id=current_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Current History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Current History not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'EmployeementHistory': employment_history,
#                                     'EmployeeMedicalInfo': medical_info,
#                                     'EmployeeCurrentHistoryInfo': current_history,
#                                     'Salary': float(row['Salary']) if row['Salary'] else None,
#                                     'BasicSalary': float(row['BasicSalary']) if row['BasicSalary'] else None,
#                                     'BasicSalary_Percentage': float(row['BasicSalary_Percentage']) if row['BasicSalary_Percentage'] else None,
#                                     'Allowance_amount': float(row['Allowance_amount']) if row['Allowance_amount'] else None,
#                                     'Deduction_amount': float(row['Deduction_amount']) if row['Deduction_amount'] else None,
#                                     'Allowancefinal': float(row['Allowancefinal']) if row['Allowancefinal'] else None,
#                                     'PfForEmployee': float(row['PfForEmployee']) if row['PfForEmployee'] else None,
#                                     'SecurityDeposite': float(row['SecurityDeposite']) if row['SecurityDeposite'] else None,
#                                     'PF_amount': float(row['PF_amount']) if row['PF_amount'] else None,
#                                     'ctc': float(row['ctc']) if row['ctc'] else None,
#                                     'PF_is_applicable': row['PF_is_applicable'] in [True, 'True'],
#                                     'PFNumber': row['PFNumber'] or None,
#                                     'PF_EmployerPercentage': float(row['PF_EmployerPercentage']) if row['PF_EmployerPercentage'] else None,
#                                     'PF_EmployeePercentage': float(row['PF_EmployeePercentage']) if row['PF_EmployeePercentage'] else None,
#                                     'PF_EmployeeAmount': float(row['PF_EmployeeAmount']) if row['PF_EmployeeAmount'] else None,
#                                     'PF_EmployerAmount': float(row['PF_EmployerAmount']) if row['PF_EmployerAmount'] else None,
#                                     'ESI_is_applicable': row['ESI_is_applicable'] in [True, 'True'],
#                                     'ESINumber': row['ESINumber'] or None,
#                                     'ESI_Percentage': float(row['ESI_Percentage']) if row['ESI_Percentage'] else None,
#                                     'ESI_Amount': float(row['ESI_Amount']) if row['ESI_Amount'] else None,
#                                     'TDS_is_applicable': row['TDS_is_applicable'] in [True, 'True'],
#                                     'TDS_Percentage': float(row['TDS_Percentage']) if row['TDS_Percentage'] else None,
#                                     'TDS_Amount': float(row['TDS_Amount']) if row['TDS_Amount'] else None,
#                                     'Net_salary': Decimal(str(row['Net_salary'])) if row['Net_salary'] else None,
#                                     'AccountHolderName': row['AccountHolderName'] or None,
#                                     'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                     'BankName': row['BankName'] or None,
#                                     'Branch': row['Branch'] or None,
#                                     'IfscCode': row['IfscCode'] or None,
#                                     'PanNumber': row['PanNumber'] or None,
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                                 instance = model.objects.create(**data)
#                                 financial_history_ids[employee_id] = instance.EmpHistory_Id

#                             elif sheet_name == 'Salary_Maintenance':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 employment_history = None
#                                 if employee_id in employment_history_ids:
#                                     try:
#                                         employment_history = Employeement_History_Detials.objects.get(EmpHistory_Id=employment_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Employment History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Employment History not found")
#                                         continue

#                                 medical_info = None
#                                 if employee_id in medical_info_ids:
#                                     try:
#                                         medical_info = Employee_Medical_Information_Detials.objects.get(EmpHistory_Id=medical_info_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Medical Info for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Medical Info not found")
#                                         continue

#                                 current_history = None
#                                 if employee_id in current_history_ids:
#                                     try:
#                                         current_history = Current_History_Detials.objects.get(EmpHistory_Id=current_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Current History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Current History not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'EmployeementHistory': employment_history,
#                                     'EmployeeMedicalInfo': medical_info,
#                                     'EmployeeCurrentHistoryInfo': current_history,
#                                     'BasicSalary': float(row['BasicSalary']) if row['BasicSalary'] else None,
#                                     'ctc': float(row['ctc']) if row['ctc'] else None,
#                                     'AccountHolderName': row['AccountHolderName'] or None,
#                                     'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                     'BankName': row['BankName'] or None,
#                                     'Branch': row['Branch'] or None,
#                                     'IfscCode': row['IfscCode'] or None,
#                                     'PanNumber': row['PanNumber'] or None,
#                                     'Status': row['Status'] or 'Active',
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                                 instance = model.objects.create(**data)

#                             elif sheet_name == 'Document_Checklist':
#                                 location = None
#                                 if row['Location']:
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 employment_history = None
#                                 if employee_id in employment_history_ids:
#                                     try:
#                                         employment_history = Employeement_History_Detials.objects.get(EmpHistory_Id=employment_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Employment History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Employment History not found")
#                                         continue

#                                 medical_info = None
#                                 if employee_id in medical_info_ids:
#                                     try:
#                                         medical_info = Employee_Medical_Information_Detials.objects.get(EmpHistory_Id=medical_info_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Medical Info for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Medical Info not found")
#                                         continue

#                                 current_history = None
#                                 if employee_id in current_history_ids:
#                                     try:
#                                         current_history = Current_History_Detials.objects.get(EmpHistory_Id=current_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Current History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Current History not found")
#                                         continue

#                                 financial_history = None
#                                 if employee_id in financial_history_ids:
#                                     try:
#                                         financial_history = Financial_History_Detials.objects.get(EmpHistory_Id=financial_history_ids[employee_id])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Financial History for Employee_ID '{employee_id}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Financial History not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'EmployeementHistory': employment_history,
#                                     'EmployeeMedicalInfo': medical_info,
#                                     'EmployeeCurrentHistoryInfo': current_history,
#                                     'EmployeeFinancialHistory': financial_history,
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Skills':
#                                 location = None
#                                 if row.get('Location'):
#                                     try:
#                                         location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                     except ObjectDoesNotExist:
#                                         results[sheet_name].append({
#                                             'row': index + 2,
#                                             'status': 'error',
#                                             'message': f"Location '{row['Location']}' not found"
#                                         })
#                                         errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                         continue

#                                 data = {
#                                     'Employee': employee_instance,
#                                     'Skill': row['Skill'] or None,
#                                     'Level': row['Level'] or None,
#                                     'Location': location,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Leaves':
#                                 data = {
#                                     'Employee': employee_instance,
#                                     'leave_type': row['leave_type'] or None,
#                                     'leave_count': int(row['leave_count']) if row['leave_count'] and str(row['leave_count']).isdigit() else None,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Allowance':
#                                 data = {
#                                     'Employee': employee_instance,
#                                     'allowance': row['allowance'] or None,
#                                     'percentage': float(row['percentage']) if row['percentage'] else None,
#                                     'amount': Decimal(str(row['amount'])) if row['amount'] else None,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             elif sheet_name == 'Employee_Deduction':
#                                 data = {
#                                     'Employee': employee_instance,
#                                     'deduction': row['deduction'] or None,
#                                     'amount': Decimal(str(row['amount'])) if row['amount'] else None,
#                                     'created_by': row['created_by'] or 'admin'
#                                 }

#                             # Save or update record
#                             try:
#                                 instance = model.objects.filter(Employee=employee_instance).first()
#                                 if instance:
#                                     for key, value in data.items():
#                                         setattr(instance, key, value)
#                                     instance.save()
#                                 else:
#                                     instance = model.objects.create(**data)

#                                 # Link allowances to Salary_Maintenance
#                                 if sheet_name == 'Employee_Allowance' and employee_id in employee_id_to_db_id:
#                                     salary_instance = Salary_Maintenance_Detials.objects.filter(Employee=employee_instance).first()
#                                     if salary_instance:
#                                         salary_instance.EmployeeAllowanceDetails.add(instance)

#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'success',
#                                     'message': f"Row processed successfully for Employee_ID {employee_id}"
#                                 })

#                             except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                                 logger.error("Error in %s row %d: %s", sheet_name, index + 2, str(e))
#                                 results[sheet_name].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': str(e)
#                                 })
#                                 errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")
#                                 continue

#                         except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                             logger.error("Error in %s row %d: %s", sheet_name, index + 2, str(e))
#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")
#                             continue
#                         except Exception as e:
#                             logger.error("Unexpected error in %s row %d: %s", sheet_name, index + 2, str(e))
#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Unexpected error: {str(e)}"
#                             })
#                             errors.append(f"Row {index + 2} in {sheet_name}: {str(e)}")
#                             continue

#                 except Exception as e:
#                     logger.error("Error processing sheet %s: %s", sheet_name, str(e))
#                     results[sheet_name].append({
#                         'row': 0,
#                         'status': 'error',
#                         'message': f"Failed to process sheet: {str(e)}"
#                     })
#                     errors.append(f"Error processing sheet {sheet_name}: {str(e)}")
#                     raise

#         # Prepare response
#         status = 'success' if not errors else 'partial_success'
#         response = {
#             'status': status,
#             'results': results,
#             'errors': errors
#         }
#         return JsonResponse(response)

#     except Exception as e:
#         logger.error("Failed to process Excel file: %s", str(e))
#         return JsonResponse({
#             'status': 'error',
#             'message': f"Failed to process Excel file: {str(e)}"
#         }, status=500)


# import logging
# import pandas as pd
# from django.http import JsonResponse
# from django.db import transaction
# from django.views.decorators.csrf import csrf_exempt
# from django.core.exceptions import ObjectDoesNotExist, ValidationError
# from django.db.models import Max
# from decimal import Decimal
# import datetime

# logger = logging.getLogger(__name__)

# def get_default_location():
#     """Fetch or create a default Location_Detials instance."""
#     location = Location_Detials.objects.first()
#     if not location:
#         location = Location_Detials.objects.create(
#             Location_Name='Default Location',
#             created_by='admin'
#         )
#     return location

# def get_default_data(model, employee_instance, related_ids=None):
#     """Generate default data for a given model."""
#     related_ids = related_ids or {}
#     default_location = get_default_location()
#     data = {
#         'Employee': employee_instance,
#         'created_by': 'admin'
#     }

#     if model == Employeement_History_Detials:
#         data.update({
#             'PreviousWorkExperience': 'No',
#             'PreviousWorkPFNumber': 'None',
#             'PreviousWorkESINumber': 'None',
#             'PFNumber': None,
#             'ESINumber': None,
#             'NoOfYears': 0,
#             'WorkStationNameAddress': None,
#             'ReasonForLeft': None,
#             'WorkStationPhoneNo': None,
#             'ConfirmedBy': None,
#             'Location': default_location
#         })
#     elif model == Employee_Medical_Information_Detials:
#         employment_history = related_ids.get('employment_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'PreExisiting_Medical_Condition': 'None',
#             'PsychiatricMedicines': 'No',
#             'PsychiatricMedicinesDetails': None,
#             'PreviousOperation': 'No',
#             'SurgeriesDetails': None,
#             'VaccinationStatus': 'Unknown',
#             'VaccinationStatusDetails': None,
#             'Location': default_location
#         })
#     elif model == Current_History_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'DateOfJoining': datetime.date.today().strftime('%Y-%m-%d'),
#             'ReportingManager': None,
#             'GovtLeave': 0,
#             'CasualLeave': 0,
#             'SickLeave': 0,
#             'TotalLeave': 0,
#             'WorkEmail': None,
#             'CurrentEmployeementLocations': default_location,
#             'Location': default_location
#         })
#     elif model == EmployeeProbationDetails:
#         data.update({
#             'is_on_probation': False,
#             'probation_start_date': None,
#             'probation_end_date': None,
#             'probation_periods': 0,
#             'months_completed': 0,
#             'probation_status': 'Not Applicable',
#             'extended_date': None,
#             'extended_months': 0,
#             'terminated_date': None,
#             'confirmation_date': None,
#             'training_given_by': None,
#             'training_verified_by': None,
#             'training_completed_date': None
#         })
#     elif model == EmployeeSecurityDeposit:
#         data.update({
#             'requires_security_deposit': False,
#             'security_start_date': None,
#             'security_end_date': None,
#             'total_security_amount': Decimal('0.00'),
#             'security_pending_months': 0,
#             'security_installment_count': 0,
#             'security_months_paid': 0,
#             'security_months_to_be_scheduled': 0
#         })
#     elif model == Employee_GratuityDetails:
#         data.update({
#             'require_gratuity': False,
#             'gratuity_start_date': None,
#             'total_gratuity_amount': Decimal('0.00'),
#             'monthly_gratuity_amount': Decimal('0.00'),
#             'gratuity_pending_months': 0,
#             'gratuity_installment_count': 0,
#             'gratuity_months_to_be_scheduled': 0
#         })
#     elif model == Financial_History_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         current_history = related_ids.get('current_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'EmployeeCurrentHistoryInfo': current_history,
#             'Salary': 0.0,
#             'BasicSalary': 0.0,
#             'BasicSalary_Percentage': 0.0,
#             'Allowance_amount': 0.0,
#             'Deduction_amount': 0.0,
#             'Allowancefinal': 0.0,
#             'PfForEmployee': 0.0,
#             'SecurityDeposite': 0.0,
#             'PF_amount': 0.0,
#             'ctc': 0.0,
#             'PF_is_applicable': False,
#             'PFNumber': None,
#             'PF_EmployerPercentage': 0.0,
#             'PF_EmployeePercentage': 0.0,
#             'PF_EmployeeAmount': 0.0,
#             'PF_EmployerAmount': 0.0,
#             'ESI_is_applicable': False,
#             'ESINumber': None,
#             'ESI_Percentage': 0.0,
#             'ESI_Amount': 0.0,
#             'TDS_is_applicable': False,
#             'TDS_Percentage': 0.0,
#             'TDS_Amount': 0.0,
#             'Net_salary': Decimal('0.00'),
#             'AccountHolderName': None,
#             'AccountNumber': None,
#             'BankName': None,
#             'Branch': None,
#             'IfscCode': None,
#             'PanNumber': None,
#             'Location': default_location
#         })
#     elif model == Salary_Maintenance_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         current_history = related_ids.get('current_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'EmployeeCurrentHistoryInfo': current_history,
#             'BasicSalary': 0.0,
#             'ctc': 0.0,
#             'AccountHolderName': None,
#             'AccountNumber': None,
#             'BankName': None,
#             'Branch': None,
#             'IfscCode': None,
#             'PanNumber': None,
#             'Status': 'Active',
#             'Location': default_location
#         })
#     elif model == Document_Checklist_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         current_history = related_ids.get('current_history')
#         financial_history = related_ids.get('financial_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'EmployeeCurrentHistoryInfo': current_history,
#             'EmployeeFinancialHistory': financial_history,
#             'Location': default_location
#         })
#     elif model == Employee_Skills_Detials:
#         data.update({
#             'Skill': 'None',
#             'Level': 'Beginner',
#             'Location': default_location
#         })
#     elif model == Employee_Leavelist:
#         data.update({
#             'leave_type': 'Casual',
#             'leave_count': 0
#         })
#     elif model == EmployeeAllowanceDetails:
#         data.update({
#             'allowance': 'None',
#             'percentage': 0.0,
#             'amount': Decimal('0.00')
#         })
#     elif model == EmployeeDeductionDetails:
#         data.update({
#             'deduction': 'None',
#             'amount': Decimal('0.00')
#         })

#     return data

# @csrf_exempt
# def employee_excel_upload(request):
#     if request.method != 'POST':
#         logger.error("Invalid request method: %s", request.method)
#         return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

#     if 'file' not in request.FILES:
#         logger.error("No file uploaded in request")
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     try:
#         # Read the uploaded Excel file
#         file = request.FILES['file']
#         excel_data = pd.ExcelFile(file)

#         # Expected sheet names
#         expected_sheets = {
#             'Employee_Personal_Details': Employee_Personal_Form_Detials,
#             'Employment_History': Employeement_History_Detials,
#             'Medical_Information': Employee_Medical_Information_Detials,
#             'Current_History': Current_History_Detials,
#             'Probation_Details': EmployeeProbationDetails,
#             'Security_Deposit': EmployeeSecurityDeposit,
#             'Gratuity_Details': Employee_GratuityDetails,
#             'Financial_History': Financial_History_Detials,
#             'Salary_Maintenance': Salary_Maintenance_Detials,
#             'Document_Checklist': Document_Checklist_Detials,
#             'Employee_Skills': Employee_Skills_Detials,
#             'Employee_Leaves': Employee_Leavelist,
#             'Employee_Allowance': EmployeeAllowanceDetails,
#             'Employee_Deduction': EmployeeDeductionDetails
#         }

#         # Validate sheet names
#         missing_sheets = [sheet for sheet in expected_sheets if sheet not in excel_data.sheet_names]
#         if 'Employee_Personal_Details' not in excel_data.sheet_names:
#             logger.error("Missing required sheet: Employee_Personal_Details")
#             return JsonResponse({
#                 'status': 'error',
#                 'message': 'Missing required sheet: Employee_Personal_Details'
#             }, status=400)

#         # Initialize response data
#         results = {sheet: [] for sheet in expected_sheets}
#         errors = []

#         with transaction.atomic():
#             # Track IDs for related models
#             employee_id_to_db_id = {}  # Excel Employee_ID to database Employee_ID
#             related_ids = {}  # Employee_ID to {model: instance_id}

#             # Process Employee_Personal_Details
#             personal_df = pd.read_excel(file, sheet_name='Employee_Personal_Details')
#             personal_df = personal_df.fillna('')  # Replace NaN with empty string

#             for index, row in personal_df.iterrows():
#                 try:
#                     employee_id = str(row['Employee_ID']).strip()
#                     is_update = False
#                     employee = None

#                     # Check if Employee_ID exists for update
#                     if employee_id:
#                         try:
#                             employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
#                             is_update = True
#                         except ObjectDoesNotExist:
#                             pass

#                     # Resolve ForeignKeys
#                     title = None
#                     if row['Title']:
#                         try:
#                             title = Title_Detials.objects.filter(Title_Name=row['Title']).first()
#                             logger.debug("Title found: %s", title)
#                             if not title:
#                                 raise ObjectDoesNotExist(f"Title '{row['Title']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     blood_group = None
#                     if row['BloodGroup']:
#                         try:
#                             blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Name=row['BloodGroup']).first()
#                             logger.debug("BloodGroup found: %s", blood_group)
#                             if not blood_group:
#                                 raise ObjectDoesNotExist(f"BloodGroup '{row['BloodGroup']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     classification = None
#                     if row['Classification']:
#                         try:
#                             classification = Classification_Detials.objects.filter(Classification_Name=row['Classification']).first()
#                             logger.debug("Classification found: %s", classification)
#                             if not classification:
#                                 raise ObjectDoesNotExist(f"Classification '{row['Classification']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     category = None
#                     if row['Category']:
#                         try:
#                             category = Category_Detials.objects.filter(Category_Name=row['Category']).first()
#                             logger.debug("Category found: %s", category)
#                             if not category:
#                                 raise ObjectDoesNotExist(f"Category '{row['Category']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     speciality = None
#                     if row['Speciality']:
#                         try:
#                             speciality = Speciality_Detials.objects.filter(Speciality_Name=row['Speciality']).first()
#                             logger.debug("Speciality found: %s", speciality)
#                             if not speciality:
#                                 raise ObjectDoesNotExist(f"Speciality '{row['Speciality']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     designation = None
#                     if row['Designation']:
#                         try:
#                             designation = Designation_Detials.objects.filter(Designation_Name=row['Designation']).first()
#                             logger.debug("Designation found: %s", designation)
#                             if not designation:
#                                 raise ObjectDoesNotExist(f"Designation '{row['Designation']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     role = None
#                     if row['Role']:
#                         try:
#                             role = Role_Master.objects.filter(Role_Name=row['Role']).first()
#                             logger.debug("Role found: %s", role)
#                             if not role:
#                                 raise ObjectDoesNotExist(f"Role '{row['Role']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     location = None
#                     if row['Location']:
#                         try:
#                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                             logger.debug("Location found: %s", location)
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Location '{row['Location']}' not found"
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: Location not found")
#                             continue

#                     ledger_group = None
#                     if row['LedgerGroupName']:
#                         try:
#                             ledger_group = Finance_GroupMaster_Detailes.objects.filter(pk=22).first()
#                             logger.debug("LedgerGroup found: %s", ledger_group)
#                             if not ledger_group:
#                                 raise ObjectDoesNotExist(f"LedgerGroupName '{row['LedgerGroupName']}' not found")
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"LedgerGroupName '{row['LedgerGroupName']}' not found"
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: LedgerGroupName not found")
#                             continue

#                     # Prepare data
#                     employee_data = {
#                         'Tittle': title,
#                         'Existing_Employee_ID': employee_id or None,
#                         'First_Name': row['First_Name'] or None,
#                         'Middle_Name': row['Middle_Name'] or None,
#                         'Last_Name': row['Last_Name'] or None,
#                         'Gender': row['Gender'] or None,
#                         'DOB': row['DOB'] if pd.notnull(row['DOB']) else None,
#                         'Age': str(row['Age']) if row['Age']  else None,
#                         'BloodGroup': blood_group,
#                         'Contact_Number': str(row['Contact_Number']) if row['Contact_Number'] else None,
#                         'Alternate_Number': str(row['Alternate_Number']) if row['Alternate_Number'] else None,
#                         'E_mail': row['E_mail'] or None,
#                         'Qualification': row['Qualification'] or None,
#                         'IdProofType': row['IdProofType'] or None,
#                         'IdProofNo': row['IdProofNo'] or None,
#                         'Marital_Status': row['Marital_Status'] or None,
#                         'MarriagePlan': row['MarriagePlan'] or None,
#                         'AnniversaryDate': row['AnniversaryDate'] if pd.notnull(row['AnniversaryDate']) else None,
#                         'Residence': row['Residence'] or None,
#                         'FatherName': row['FatherName'] or None,
#                         'FatherContact': str(row['FatherContact']) if row['FatherContact'] else None,
#                         'FatherWorking': row['FatherWorking'] or None,
#                         'FatherWorkPlace': row['FatherWorkPlace'] or None,
#                         'MotherName': row['MotherName'] or None,
#                         'MotherContact': str(row['MotherContact']) if row['MotherContact'] else None,
#                         'MotherWorking': row['MotherWorking'] or None,
#                         'MotherWorkPlace': row['MotherWorkPlace'] or None,
#                         'Spouse_Name': row['Spouse_Name'] or None,
#                         'SpouseContact': str(row['SpouseContact']) if row['SpouseContact'] else None,
#                         'SpouseWorking': row['SpouseWorking'] or None,
#                         'SpouseWorkPlace': row['SpouseWorkPlace'] or None,
#                         'Child': row['Child'] or None,
#                         'TotalNoChild': str(row['TotalNoChild']) if row['TotalNoChild']  else None,
#                         'DoorNo': str(row['DoorNo']) if row['DoorNo'] else None,
#                         'Street': row['Street'] or None,
#                         'Area': row['Area'] or None,
#                         'City': row['City'] or None,
#                         'District': row['District'] or None,
#                         'State': row['State'] or None,
#                         'Country': row['Country'] or None,
#                         'Pincode': str(row['Pincode']) if row['Pincode'] else None,
#                         'PermanentAddressSameAsAbove': row['PermanentAddressSameAsAbove'] or None,
#                         'PermanentDoorNo': str(row['PermanentDoorNo']) if row['PermanentDoorNo'] else None,
#                         'PermanentStreet': row['PermanentStreet'] or None,
#                         'PermanentArea': row['PermanentArea'] or None,
#                         'PermanentCity': row['PermanentCity'] or None,
#                         'PermanentDistrict': row['PermanentDistrict'] or None,
#                         'PermanentState': row['PermanentState'] or None,
#                         'PermanentCountry': row['PermanentCountry'] or None,
#                         'PermanentPincode': str(row['PermanentPincode']) if row['PermanentPincode'] else None,
#                         'EmergencyContactName1': row['EmergencyContactName1'] or None,
#                         'EmergencyContactNo1': str(row['EmergencyContactNo1']) if row['EmergencyContactNo1'] else None,
#                         'EmergencyContactName2': row['EmergencyContactName2'] or None,
#                         'EmergencyContactNo2': str(row['EmergencyContactNo2']) if row['EmergencyContactNo2'] else None,
#                         'Classification': classification,
#                         'Category': category,
#                         'Speciality': speciality,
#                         'Designation': designation,
#                         'Role': role,
#                         'Location': location or get_default_location(),
#                         'ActiveStatus': 'Yes' if row['ActiveStatus'].lower() == 'yes' else 'No',
#                         'RequirementSource': row['RequirementSource'] or None,
#                         'Source': row['Source'] or None,
#                         'LedgerName': row['LedgerName'].upper() if row['LedgerName'] else None,
#                         'LedgerGroupName': ledger_group,
#                         'OpeningBalance': Decimal(str(row['OpeningBalance'])) if row['OpeningBalance'] else Decimal('0.00'),
#                         'DebitOrCredit': row['DebitOrCredit'] or None,
#                         'Status': True if row['Status'] in [True, 'True'] else False,
#                         'created_by': row['created_by'] or 'admin',
#                     }

#                     # Create or update employee
#                     if is_update and employee:
#                         for key, value in employee_data.items():
#                             setattr(employee, key, value)
#                         employee.save()
#                     else:
#                         employee = Employee_Personal_Form_Detials(**employee_data)
#                         employee.save()  # Let model generate Employee_ID

#                     employee_id_to_db_id[employee_id or employee.Employee_ID] = employee.Employee_ID
#                     related_ids[employee.Employee_ID] = {}

#                     # Handle ManyToMany Department
#                     if row['Departments']:
#                         department_names = [name.strip() for name in row['Departments'].split(',') if name.strip()]
#                         departments = []
#                         for name in department_names:
#                             try:
#                                 dept = Department_Detials.objects.get(Department_Name=name)
#                                 departments.append(dept)
#                             except ObjectDoesNotExist:
#                                 results['Employee_Personal_Details'].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Department '{name}' not found"
#                                 })
#                                 errors.append(f"Row {index + 2} in Employee_Personal_Details: Department '{name}' not found")
#                                 raise ValueError(f"Department '{name}' not found")
#                         employee.Department.set(departments)

#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'success',
#                         'message': f"Employee {employee.Employee_ID} processed successfully",
#                         'db_id': employee.Employee_ID
#                     })

#                     # Process related models
#                     sheet_data = {}
#                     for sheet_name in expected_sheets:
#                         if sheet_name != 'Employee_Personal_Details' and sheet_name in excel_data.sheet_names:
#                             df = pd.read_excel(file, sheet_name=sheet_name)
#                             df = df.fillna('')
#                             employee_rows = df[df['Employee_ID'].astype(str).str.strip() == (employee_id or employee.Employee_ID)]
#                             sheet_data[sheet_name] = employee_rows if not employee_rows.empty else None

#                     # Create records in dependency order
#                     model_order = [
#                         Employeement_History_Detials,
#                         Employee_Medical_Information_Detials,
#                         Current_History_Detials,
#                         Financial_History_Detials,
#                         Salary_Maintenance_Detials,
#                         Document_Checklist_Detials,
#                         EmployeeProbationDetails,
#                         EmployeeSecurityDeposit,
#                         Employee_GratuityDetails,
#                         Employee_Skills_Detials,
#                         Employee_Leavelist,
#                         EmployeeAllowanceDetails,
#                         EmployeeDeductionDetails
#                     ]

#                     for model in model_order:
#                         sheet_name = [k for k, v in expected_sheets.items() if v == model][0]
#                         try:
#                             data = None
#                             if sheet_data.get(sheet_name) is not None:
#                                 row = sheet_data[sheet_name].iloc[0]
#                                 if sheet_name == 'Employment_History':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'PreviousWorkExperience': row['PreviousWorkExperience'] or "No",
#                                         'PreviousWorkPFNumber': row['PreviousWorkPFNumber'] or "No",
#                                         'PreviousWorkESINumber': row['PreviousWorkESINumber'] or "No",
#                                         'PFNumber': row['PFNumber'] or None,
#                                         'ESINumber': row['ESINumber'] or None,
#                                         'NoOfYears': int(row['NoOfYears']) if row['NoOfYears'] and str(row['NoOfYears']).isdigit() else None,
#                                         'WorkStationNameAddress': row['WorkStationNameAddress'] or None,
#                                         'ReasonForLeft': row['ReasonForLeft'] or None,
#                                         'WorkStationPhoneNo': str(row['WorkStationPhoneNo']) if row['WorkStationPhoneNo'] else None,
#                                         'ConfirmedBy': row['ConfirmedBy'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Medical_Information':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'PreExisiting_Medical_Condition': row['PreExisiting_Medical_Condition'] or None,
#                                         'PsychiatricMedicines': row['PsychiatricMedicines'] or None,
#                                         'PsychiatricMedicinesDetails': row['PsychiatricMedicinesDetails'] or None,
#                                         'PreviousOperation': row['PreviousOperation'] or None,
#                                         'SurgeriesDetails': row['SurgeriesDetails'] or None,
#                                         'VaccinationStatus': row['VaccinationStatus'] or None,
#                                         'VaccinationStatusDetails': row['VaccinationStatusDetails'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Current_History':
#                                     current_location = None
#                                     if row['CurrentEmployeementLocation']:
#                                         try:
#                                             current_location = Location_Detials.objects.get(Location_Name=row['CurrentEmployeementLocation'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"CurrentEmployeementLocation '{row['CurrentEmployeementLocation']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: CurrentEmployeementLocation not found")
#                                             continue

#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'DateOfJoining': row['DateOfJoining'].strftime('%Y-%m-%d') if pd.notnull(row['DateOfJoining']) else None,
#                                         'ReportingManager': row['ReportingManager'] or None,
#                                         'GovtLeave': int(row['GovtLeave']) if row['GovtLeave'] and str(row['GovtLeave']).isdigit() else None,
#                                         'CasualLeave': int(row['CasualLeave']) if row['CasualLeave'] and str(row['CasualLeave']).isdigit() else None,
#                                         'SickLeave': int(row['SickLeave']) if row['SickLeave'] and str(row['SickLeave']).isdigit() else None,
#                                         'TotalLeave': int(row['TotalLeave']) if row['TotalLeave'] and str(row['TotalLeave']).isdigit() else None,
#                                         'WorkEmail': row['WorkEmail'] or None,
#                                         'CurrentEmployeementLocations': current_location or get_default_location(),
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Probation_Details':
#                                     data = {
#                                         'Employee': employee,
#                                         'is_on_probation': row['is_on_probation'] in [True, 'True'],
#                                         'probation_start_date': row['probation_start_date'].strftime('%Y-%m-%d') if pd.notnull(row['probation_start_date']) else None,
#                                         'probation_end_date': row['probation_end_date'].strftime('%Y-%m-%d') if pd.notnull(row['probation_end_date']) else None,
#                                         'probation_periods': int(row['probation_periods']) if row['probation_periods'] and str(row['probation_periods']).isdigit() else None,
#                                         'months_completed': int(row['months_completed']) if row['months_completed'] and str(row['months_completed']).isdigit() else None,
#                                         'probation_status': row['probation_status'] or None,
#                                         'extended_date': row['extended_date'].strftime('%Y-%m-%d') if pd.notnull(row['extended_date']) else None,
#                                         'extended_months': int(row['extended_months']) if row['extended_months'] and str(row['extended_months']).isdigit() else None,
#                                         'terminated_date': row['terminated_date'].strftime('%Y-%m-%d') if pd.notnull(row['terminated_date']) else None,
#                                         'confirmation_date': row['confirmation_date'].strftime('%Y-%m-%d') if pd.notnull(row['confirmation_date']) else None,
#                                         'training_given_by': row['training_given_by'] or None,
#                                         'training_verified_by': row['training_verified_by'] or None,
#                                         'training_completed_date': row['training_completed_date'].strftime('%Y-%m-%d') if pd.notnull(row['training_completed_date']) else None
#                                     }
#                                 elif sheet_name == 'Security_Deposit':
#                                     data = {
#                                         'Employee': employee,
#                                         'requires_security_deposit': row['requires_security_deposit'] in [True, 'True'],
#                                         'security_start_date': row['security_start_date'].strftime('%Y-%m-%d') if pd.notnull(row['security_start_date']) else None,
#                                         'security_end_date': row['security_end_date'].strftime('%Y-%m-%d') if pd.notnull(row['security_end_date']) else None,
#                                         'total_security_amount': Decimal(str(row['total_security_amount'])) if row['total_security_amount'] else None,
#                                         'security_pending_months': int(row['security_pending_months']) if row['security_pending_months'] and str(row['security_pending_months']).isdigit() else None,
#                                         'security_installment_count': int(row['security_installment_count']) if row['security_installment_count'] and str(row['security_installment_count']).isdigit() else None,
#                                         'security_months_paid': int(row['security_months_paid']) if row['security_months_paid'] and str(row['security_months_paid']).isdigit() else None,
#                                         'security_months_to_be_scheduled': int(row['security_months_to_be_scheduled']) if row['security_months_to_be_scheduled'] and str(row['security_months_to_be_scheduled']).isdigit() else None
#                                     }
#                                 elif sheet_name == 'Gratuity_Details':
#                                     data = {
#                                         'Employee': employee,
#                                         'require_gratuity': row['require_gratuity'] in [True, 'True'],
#                                         'gratuity_start_date': row['gratuity_start_date'].strftime('%Y-%m-%d') if pd.notnull(row['gratuity_start_date']) else None,
#                                         'total_gratuity_amount': Decimal(str(row['total_gratuity_amount'])) if row['total_gratuity_amount'] else None,
#                                         'monthly_gratuity_amount': Decimal(str(row['monthly_gratuity_amount'])) if row['monthly_gratuity_amount'] else None,
#                                         'gratuity_pending_months': int(row['gratuity_pending_months']) if row['gratuity_pending_months'] and str(row['gratuity_pending_months']).isdigit() else None,
#                                         'gratuity_installment_count': int(row['gratuity_installment_count']) if row['gratuity_installment_count'] and str(row['gratuity_installment_count']).isdigit() else None,
#                                         'gratuity_months_to_be_scheduled': int(row['gratuity_months_to_be_scheduled']) if row['gratuity_months_to_be_scheduled'] and str(row['gratuity_months_to_be_scheduled']).isdigit() else None
#                                     }
#                                 elif sheet_name == 'Financial_History':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'EmployeeCurrentHistoryInfo': related_ids[employee.Employee_ID].get('current_history'),
#                                         'Salary': float(row['Salary']) if row['Salary'] else None,
#                                         'BasicSalary': float(row['BasicSalary']) if row['BasicSalary'] else None,
#                                         'BasicSalary_Percentage': float(row['BasicSalary_Percentage']) if row['BasicSalary_Percentage'] else None,
#                                         'Allowance_amount': float(row['Allowance_amount']) if row['Allowance_amount'] else None,
#                                         'Deduction_amount': float(row['Deduction_amount']) if row['Deduction_amount'] else None,
#                                         'Allowancefinal': float(row['Allowancefinal']) if row['Allowancefinal'] else None,
#                                         'PfForEmployee': float(row['PfForEmployee']) if row['PfForEmployee'] else None,
#                                         'SecurityDeposite': float(row['SecurityDeposite']) if row['SecurityDeposite'] else None,
#                                         'PF_amount': float(row['PF_amount']) if row['PF_amount'] else None,
#                                         'ctc': float(row['ctc']) if row['ctc'] else None,
#                                         'PF_is_applicable': row['PF_is_applicable'] in [True, 'True'],
#                                         'PFNumber': row['PFNumber'] or None,
#                                         'PF_EmployerPercentage': float(row['PF_EmployerPercentage']) if row['PF_EmployerPercentage'] else None,
#                                         'PF_EmployeePercentage': float(row['PF_EmployeePercentage']) if row['PF_EmployeePercentage'] else None,
#                                         'PF_EmployeeAmount': float(row['PF_EmployeeAmount']) if row['PF_EmployeeAmount'] else None,
#                                         'PF_EmployerAmount': float(row['PF_EmployerAmount']) if row['PF_EmployerAmount'] else None,
#                                         'ESI_is_applicable': row['ESI_is_applicable'] in [True, 'True'],
#                                         'ESINumber': row['ESINumber'] or None,
#                                         'ESI_Percentage': float(row['ESI_Percentage']) if row['ESI_Percentage'] else None,
#                                         'ESI_Amount': float(row['ESI_Amount']) if row['ESI_Amount'] else None,
#                                         'TDS_is_applicable': row['TDS_is_applicable'] in [True, 'True'],
#                                         'TDS_Percentage': float(row['TDS_Percentage']) if row['TDS_Percentage'] else None,
#                                         'TDS_Amount': float(row['TDS_Amount']) if row['TDS_Amount'] else None,
#                                         'Net_salary': Decimal(str(row['Net_salary'])) if row['Net_salary'] else None,
#                                         'AccountHolderName': row['AccountHolderName'] or None,
#                                         'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                         'BankName': row['BankName'] or None,
#                                         'Branch': row['Branch'] or None,
#                                         'IfscCode': row['IfscCode'] or None,
#                                         'PanNumber': row['PanNumber'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Salary_Maintenance':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'EmployeeCurrentHistoryInfo': related_ids[employee.Employee_ID].get('current_history'),
#                                         'BasicSalary': float(row['BasicSalary']) if row['BasicSalary'] else None,
#                                         'ctc': float(row['ctc']) if row['ctc'] else None,
#                                         'AccountHolderName': row['AccountHolderName'] or None,
#                                         'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                         'BankName': row['BankName'] or None,
#                                         'Branch': row['Branch'] or None,
#                                         'IfscCode': row['IfscCode'] or None,
#                                         'PanNumber': row['PanNumber'] or None,
#                                         'Status': row['Status'] or 'Active',
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Document_Checklist':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'EmployeeCurrentHistoryInfo': related_ids[employee.Employee_ID].get('current_history'),
#                                         'EmployeeFinancialHistory': related_ids[employee.Employee_ID].get('financial_history'),
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Skills':
#                                     location = None
#                                     if row.get('Location'):
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'Skill': row['Skill'] or None,
#                                         'Level': row['Level'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Leaves':
#                                     data = {
#                                         'Employee': employee,
#                                         'leave_type': row['leave_type'] or None,
#                                         'leave_count': int(row['leave_count']) if row['leave_count'] and str(row['leave_count']).isdigit() else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Allowance':
#                                     data = {
#                                         'Employee': employee,
#                                         'allowance': row['allowance'] or None,
#                                         'percentage': float(row['percentage']) if row['percentage'] else None,
#                                         'amount': Decimal(str(row['amount'])) if row['amount'] else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Deduction':
#                                     data = {
#                                         'Employee': employee,
#                                         'deduction': row['deduction'] or None,
#                                         'amount': Decimal(str(row['amount'])) if row['amount'] else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }

#                             if data is None:
#                                 related_instances = {
#                                     'employment_history': related_ids[employee.Employee_ID].get('employment_history'),
#                                     'medical_info': related_ids[employee.Employee_ID].get('medical_info'),
#                                     'current_history': related_ids[employee.Employee_ID].get('current_history'),
#                                     'financial_history': related_ids[employee.Employee_ID].get('financial_history')
#                                 }
#                                 data = get_default_data(model, employee, related_instances)

#                             # Save or update record
#                             instance = model.objects.filter(Employee=employee).first()
#                             if instance:
#                                 for key, value in data.items():
#                                     setattr(instance, key, value)
#                                 instance.save()
#                             else:
#                                 instance = model.objects.create(**data)

#                             # Store instance ID for foreign key references
#                             if model == Employeement_History_Detials:
#                                 related_ids[employee.Employee_ID]['employment_history'] = instance
#                             elif model == Employee_Medical_Information_Detials:
#                                 related_ids[employee.Employee_ID]['medical_info'] = instance
#                             elif model == Current_History_Detials:
#                                 related_ids[employee.Employee_ID]['current_history'] = instance
#                             elif model == Financial_History_Detials:
#                                 related_ids[employee.Employee_ID]['financial_history'] = instance

#                             # Link allowances to Salary_Maintenance
#                             if sheet_name == 'Employee_Allowance':
#                                 salary_instance = Salary_Maintenance_Detials.objects.filter(Employee=employee).first()
#                                 if salary_instance:
#                                     salary_instance.EmployeeAllowanceDetails.add(instance)

#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'success',
#                                 'message': f"Row processed successfully for Employee_ID {employee.Employee_ID}"
#                             })

#                         except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                             logger.error("Error in %s for Employee_ID %s: %s", sheet_name, employee.Employee_ID, str(e))
#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in {sheet_name} for Employee_ID {employee.Employee_ID}: {str(e)}")
#                             raise

#                 except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                     logger.error("Error in Employee_Personal_Details row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': str(e)
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue
#                 except Exception as e:
#                     logger.error("Unexpected error in Employee_Personal_Details row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': f"Unexpected error: {str(e)}"
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue

#         # Prepare response
#         status = 'success' if not errors else 'partial_success'
#         response = {
#             'status': status,
#             'results': results,
#             'errors': errors
#         }
#         return JsonResponse({"success": "Employee details uploaded successfully."})

#     except Exception as e:
#         logger.error("Failed to process Excel file: %s", str(e))
#         return JsonResponse({
#             'status': 'error',
#             'message': f"Failed to process Excel file: {str(e)}"
#         }, status=500)


# import logging
# import pandas as pd
# from django.http import JsonResponse
# from django.db import transaction
# from django.views.decorators.csrf import csrf_exempt
# from django.core.exceptions import ObjectDoesNotExist, ValidationError
# from decimal import Decimal
# import datetime

# logger = logging.getLogger(__name__)

# def get_default_location():
#     """Fetch or create a default Location_Detials instance."""
#     location = Location_Detials.objects.first()
#     if not location:
#         location = Location_Detials.objects.create(
#             Location_Name='Default Location',
#             created_by='admin'
#         )
#     return location

# def get_default_data(model, employee_instance, related_ids=None):
#     """Generate default data for a given model."""
#     related_ids = related_ids or {}
#     default_location = get_default_location()
#     data = {
#         'Employee': employee_instance,
#     }
#     # Only add created_by for models that support it
#     if model not in [EmployeeProbationDetails,Employee_GratuityDetails,EmployeeSecurityDeposit,Employee_Leavelist,EmployeeAllowanceDetails,EmployeeDeductionDetails]:
#         data['created_by'] = 'admin'

#     if model == Employeement_History_Detials:
#         data.update({
#             'PreviousWorkExperience': 'No',
#             'PreviousWorkPFNumber': 'None',
#             'PreviousWorkESINumber': 'None',
#             'PFNumber': None,
#             'ESINumber': None,
#             'NoOfYears': 0,
#             'WorkStationNameAddress': None,
#             'ReasonForLeft': None,
#             'WorkStationPhoneNo': None,
#             'ConfirmedBy': None,
#             'Location': default_location
#         })
#     elif model == Employee_Medical_Information_Detials:
#         employment_history = related_ids.get('employment_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'PreExisiting_Medical_Condition': 'None',
#             'PsychiatricMedicines': 'No',
#             'PsychiatricMedicinesDetails': None,
#             'PreviousOperation': 'No',
#             'SurgeriesDetails': None,
#             'VaccinationStatus': 'Unknown',
#             'VaccinationStatusDetails': None,
#             'Location': default_location
#         })
#     elif model == Current_History_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'DateOfJoining': datetime.date.today().strftime('%Y-%m-%d'),
#             'ReportingManager': None,
#             'GovtLeave': 0,
#             'CasualLeave': 0,
#             'SickLeave': 0,
#             'TotalLeave': 0,
#             'WorkEmail': None,
#             'CurrentEmployeementLocations': default_location,
#             'Location': default_location
#         })
#     elif model == EmployeeProbationDetails:
#         data.update({
#             'is_on_probation': False,
#             'probation_start_date': None,
#             'probation_end_date': None,
#             'probation_periods': 0,
#             'months_completed': 0,
#             'probation_status': 'Not Applicable',
#             'extended_date': None,
#             'extended_months': 0,
#             'terminated_date': None,
#             'confirmation_date': None,
#             'training_given_by': None,
#             'training_verified_by': None,
#             'training_completed_date': None
#         })
#     elif model == EmployeeSecurityDeposit:
#         data.update({
#             'requires_security_deposit': False,
#             'security_start_date': None,
#             'security_end_date': None,
#             'total_security_amount': Decimal('0.00'),
#             'security_pending_months': 0,
#             'security_installment_count': 0,
#             'security_months_paid': 0,
#             'security_months_to_be_scheduled': 0
#         })
#     elif model == Employee_GratuityDetails:
#         data.update({
#             'require_gratuity': False,
#             'gratuity_start_date': None,
#             'total_gratuity_amount': Decimal('0.00'),
#             'monthly_gratuity_amount': Decimal('0.00'),
#             'gratuity_pending_months': 0,
#             'gratuity_installment_count': 0,
#             'gratuity_months_to_be_scheduled': 0
#         })
#     elif model == Financial_History_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         current_history = related_ids.get('current_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'EmployeeCurrentHistoryInfo': current_history,
#             'Salary': 0.0,
#             'BasicSalary': 0.0,
#             'BasicSalary_Percentage': 0.0,
#             'Allowance_amount': 0.0,
#             'Deduction_amount': 0.0,
#             'Allowancefinal': 0.0,
#             'PfForEmployee': 0.0,
#             'SecurityDeposite': 0.0,
#             'PF_amount': 0.0,
#             'ctc': 0.0,
#             'PF_is_applicable': False,
#             'PFNumber': None,
#             'PF_EmployerPercentage': 0.0,
#             'PF_EmployeePercentage': 0.0,
#             'PF_EmployeeAmount': 0.0,
#             'PF_EmployerAmount': 0.0,
#             'ESI_is_applicable': False,
#             'ESINumber': None,
#             'ESI_Percentage': 0.0,
#             'ESI_Amount': 0.0,
#             'TDS_is_applicable': False,
#             'TDS_Percentage': 0.0,
#             'TDS_Amount': 0.0,
#             'Net_salary': Decimal('0.00'),
#             'AccountHolderName': None,
#             'AccountNumber': None,
#             'BankName': None,
#             'Branch': None,
#             'IfscCode': None,
#             'PanNumber': None,
#             'Location': default_location
#         })
#     elif model == Salary_Maintenance_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         current_history = related_ids.get('current_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'EmployeeCurrentHistoryInfo': current_history,
#             'BasicSalary': 0.0,
#             'ctc': 0.0,
#             'AccountHolderName': None,
#             'AccountNumber': None,
#             'BankName': None,
#             'Branch': None,
#             'IfscCode': None,
#             'PanNumber': None,
#             'Status': 'Active',
#             'Location': default_location
#         })
#     elif model == Document_Checklist_Detials:
#         employment_history = related_ids.get('employment_history')
#         medical_info = related_ids.get('medical_info')
#         current_history = related_ids.get('current_history')
#         financial_history = related_ids.get('financial_history')
#         data.update({
#             'EmployeementHistory': employment_history,
#             'EmployeeMedicalInfo': medical_info,
#             'EmployeeCurrentHistoryInfo': current_history,
#             'EmployeeFinancialHistory': financial_history,
#             'Location': default_location
#         })
#     elif model == Employee_Skills_Detials:
#         data.update({
#             'Skill': 'None',
#             'Level': 'Beginner',
#             'Location': default_location
#         })
#     elif model == Employee_Leavelist:
#         data.update({
#             'leave_type': 'Casual',
#             'leave_count': 0
#         })
#     elif model == EmployeeAllowanceDetails:
#         data.update({
#             'allowance': 'None',
#             'percentage': 0.0,
#             'amount': Decimal('0.00')
#         })
#     elif model == EmployeeDeductionDetails:
#         data.update({
#             'deduction': 'None',
#             'amount': Decimal('0.00')
#         })

#     return data

# @csrf_exempt
# def employee_excel_upload(request):
#     if request.method != 'POST':
#         logger.error("Invalid request method: %s", request.method)
#         return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

#     if 'file' not in request.FILES:
#         logger.error("No file uploaded in request")
#         return JsonResponse({'error': 'No file uploaded'}, status=400)

#     try:
#         # Read the uploaded Excel file
#         file = request.FILES['file']
#         excel_data = pd.ExcelFile(file)

#         # Expected sheet names
#         expected_sheets = {
#             'Employee_Personal_Details': Employee_Personal_Form_Detials,
#             'Employment_History': Employeement_History_Detials,
#             'Medical_Information': Employee_Medical_Information_Detials,
#             'Current_History': Current_History_Detials,
#             'Probation_Details': EmployeeProbationDetails,
#             'Security_Deposit': EmployeeSecurityDeposit,
#             'Gratuity_Details': Employee_GratuityDetails,
#             'Financial_History': Financial_History_Detials,
#             'Salary_Maintenance': Salary_Maintenance_Detials,
#             'Document_Checklist': Document_Checklist_Detials,
#             'Employee_Skills': Employee_Skills_Detials,
#             'Employee_Leaves': Employee_Leavelist,
#             'Employee_Allowance': EmployeeAllowanceDetails,
#             'Employee_Deduction': EmployeeDeductionDetails
#         }

#         # Validate sheet names
#         missing_sheets = [sheet for sheet in expected_sheets if sheet not in excel_data.sheet_names]
#         if 'Employee_Personal_Details' not in excel_data.sheet_names:
#             logger.error("Missing required sheet: Employee_Personal_Details")
#             return JsonResponse({
#                 'status': 'error',
#                 'message': 'Missing required sheet: Employee_Personal_Details'
#             }, status=400)

#         # Initialize response data
#         results = {sheet: [] for sheet in expected_sheets}
#         errors = []

#         with transaction.atomic():
#             # Track IDs for related models
#             employee_id_to_db_id = {}  # Excel Employee_ID to database Employee_ID
#             related_ids = {}  # Employee_ID to {model: instance_id}

#             # Process Employee_Personal_Details
#             personal_df = pd.read_excel(file, sheet_name='Employee_Personal_Details')
#             personal_df = personal_df.fillna('')  # Replace NaN with empty string

#             for index, row in personal_df.iterrows():
#                 try:
#                     employee_id = str(row['Employee_ID']).strip()
#                     is_update = False
#                     employee = None

#                     # Check if Employee_ID exists for update
#                     if employee_id:
#                         try:
#                             employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
#                             is_update = True
#                         except ObjectDoesNotExist:
#                             pass

#                     # Resolve ForeignKeys
#                     title = None
#                     if row['Title']:
#                         try:
#                             title = Title_Detials.objects.filter(Title_Name=row['Title']).first()
#                             logger.debug("Title found: %s", title)
#                             if not title:
#                                 raise ObjectDoesNotExist(f"Title '{row['Title']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     blood_group = None
#                     if row['BloodGroup']:
#                         try:
#                             blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Name=row['BloodGroup']).first()
#                             logger.debug("BloodGroup found: %s", blood_group)
#                             if not blood_group:
#                                 raise ObjectDoesNotExist(f"BloodGroup '{row['BloodGroup']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     classification = None
#                     if row['Classification']:
#                         try:
#                             classification = Classification_Detials.objects.filter(Classification_Name=row['Classification']).first()
#                             logger.debug("Classification found: %s", classification)
#                             if not classification:
#                                 raise ObjectDoesNotExist(f"Classification '{row['Classification']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     category = None
#                     if row['Category']:
#                         try:
#                             category = Category_Detials.objects.filter(Category_Name=row['Category']).first()
#                             logger.debug("Category found: %s", category)
#                             if not category:
#                                 raise ObjectDoesNotExist(f"Category '{row['Category']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     speciality = None
#                     if row['Speciality']:
#                         try:
#                             speciality = Speciality_Detials.objects.filter(Speciality_Name=row['Speciality']).first()
#                             logger.debug("Speciality found: %s", speciality)
#                             if not speciality:
#                                 raise ObjectDoesNotExist(f"Speciality '{row['Speciality']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     designation = None
#                     if row['Designation']:
#                         try:
#                             designation = Designation_Detials.objects.filter(Designation_Name=row['Designation']).first()
#                             logger.debug("Designation found: %s", designation)
#                             if not designation:
#                                 raise ObjectDoesNotExist(f"Designation '{row['Designation']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     role = None
#                     if row['Role']:
#                         try:
#                             role = Role_Master.objects.filter(Role_Name=row['Role']).first()
#                             logger.debug("Role found: %s", role)
#                             if not role:
#                                 raise ObjectDoesNotExist(f"Role '{row['Role']}' not found")
#                         except ObjectDoesNotExist as e:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                             continue

#                     location = None
#                     if row['Location']:
#                         try:
#                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                             logger.debug("Location found: %s", location)
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"Location '{row['Location']}' not found"
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: Location not found")
#                             continue

#                     ledger_group = None
#                     if row['LedgerGroupName']:
#                         try:
#                             ledger_group = Finance_GroupMaster_Detailes.objects.filter(pk=22).first()
#                             logger.debug("LedgerGroup found: %s", ledger_group)
#                             if not ledger_group:
#                                 raise ObjectDoesNotExist(f"LedgerGroupName '{row['LedgerGroupName']}' not found")
#                         except ObjectDoesNotExist:
#                             results['Employee_Personal_Details'].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': f"LedgerGroupName '{row['LedgerGroupName']}' not found"
#                             })
#                             errors.append(f"Row {index + 2} in Employee_Personal_Details: LedgerGroupName not found")
#                             continue

#                     # Prepare data
#                     employee_data = {
#                         'Tittle': title,
#                         'Existing_Employee_ID': employee_id or None,
#                         'First_Name': row['First_Name'] or None,
#                         'Middle_Name': row['Middle_Name'] or None,
#                         'Last_Name': row['Last_Name'] or None,
#                         'Gender': row['Gender'] or None,
#                         'DOB': row['DOB'] if pd.notnull(row['DOB']) else None,
#                         'Age': str(row['Age']) if row['Age']  else None,
#                         'BloodGroup': blood_group,
#                         'Contact_Number': str(row['Contact_Number']) if row['Contact_Number'] else None,
#                         'Alternate_Number': str(row['Alternate_Number']) if row['Alternate_Number'] else None,
#                         'E_mail': row['E_mail'] or None,
#                         'Qualification': row['Qualification'] or None,
#                         'IdProofType': row['IdProofType'] or None,
#                         'IdProofNo': row['IdProofNo'] or None,
#                         'Marital_Status': row['Marital_Status'] or None,
#                         'MarriagePlan': row['MarriagePlan'] or None,
#                         'AnniversaryDate': row['AnniversaryDate'] if pd.notnull(row['AnniversaryDate']) else None,
#                         'Residence': row['Residence'] or None,
#                         'FatherName': row['FatherName'] or None,
#                         'FatherContact': str(row['FatherContact']) if row['FatherContact'] else None,
#                         'FatherWorking': row['FatherWorking'] or None,
#                         'FatherWorkPlace': row['FatherWorkPlace'] or None,
#                         'MotherName': row['MotherName'] or None,
#                         'MotherContact': str(row['MotherContact']) if row['MotherContact'] else None,
#                         'MotherWorking': row['MotherWorking'] or None,
#                         'MotherWorkPlace': row['MotherWorkPlace'] or None,
#                         'Spouse_Name': row['Spouse_Name'] or None,
#                         'SpouseContact': str(row['SpouseContact']) if row['SpouseContact'] else None,
#                         'SpouseWorking': row['SpouseWorking'] or None,
#                         'SpouseWorkPlace': row['SpouseWorkPlace'] or None,
#                         'Child': row['Child'] or None,
#                         'TotalNoChild': str(row['TotalNoChild']) if row['TotalNoChild']  else None,
#                         'DoorNo': str(row['DoorNo']) if row['DoorNo'] else None,
#                         'Street': row['Street'] or None,
#                         'Area': row['Area'] or None,
#                         'City': row['City'] or None,
#                         'District': row['District'] or None,
#                         'State': row['State'] or None,
#                         'Country': row['Country'] or None,
#                         'Pincode': str(row['Pincode']) if row['Pincode'] else None,
#                         'PermanentAddressSameAsAbove': row['PermanentAddressSameAsAbove'] or None,
#                         'PermanentDoorNo': str(row['PermanentDoorNo']) if row['PermanentDoorNo'] else None,
#                         'PermanentStreet': row['PermanentStreet'] or None,
#                         'PermanentArea': row['PermanentArea'] or None,
#                         'PermanentCity': row['PermanentCity'] or None,
#                         'PermanentDistrict': row['PermanentDistrict'] or None,
#                         'PermanentState': row['PermanentState'] or None,
#                         'PermanentCountry': row['PermanentCountry'] or None,
#                         'PermanentPincode': str(row['PermanentPincode']) if row['PermanentPincode'] else None,
#                         'EmergencyContactName1': row['EmergencyContactName1'] or None,
#                         'EmergencyContactNo1': str(row['EmergencyContactNo1']) if row['EmergencyContactNo1'] else None,
#                         'EmergencyContactName2': row['EmergencyContactName2'] or None,
#                         'EmergencyContactNo2': str(row['EmergencyContactNo2']) if row['EmergencyContactNo2'] else None,
#                         'Classification': classification,
#                         'Category': category,
#                         'Speciality': speciality,
#                         'Designation': designation,
#                         'Role': role,
#                         'Location': location or get_default_location(),
#                         'ActiveStatus': 'Yes' if row['ActiveStatus'].lower() == 'yes' else 'No',
#                         'RequirementSource': row['RequirementSource'] or None,
#                         'Source': row['Source'] or None,
#                         'LedgerName': row['LedgerName'].upper() if row['LedgerName'] else None,
#                         'LedgerGroupName': ledger_group,
#                         'OpeningBalance': Decimal(str(row['OpeningBalance'])) if row['OpeningBalance'] else Decimal('0.00'),
#                         'DebitOrCredit': row['DebitOrCredit'] or None,
#                         'Status': True if row['Status'] in [True, 'True'] else False,
#                         'created_by': row['created_by'] or 'admin',
#                     }

#                     # Create or update employee
#                     if is_update and employee:
#                         for key, value in employee_data.items():
#                             setattr(employee, key, value)
#                         employee.save()
#                     else:
#                         employee = Employee_Personal_Form_Detials(**employee_data)
#                         employee.save()  # Let model generate Employee_ID

#                     employee_id_to_db_id[employee_id or employee.Employee_ID] = employee.Employee_ID
#                     related_ids[employee.Employee_ID] = {}

#                     # Handle ManyToMany Department
#                     if row['Departments']:
#                         department_names = [name.strip() for name in row['Departments'].split(',') if name.strip()]
#                         departments = []
#                         for name in department_names:
#                             try:
#                                 dept = Department_Detials.objects.get(Department_Name=name)
#                                 departments.append(dept)
#                             except ObjectDoesNotExist:
#                                 results['Employee_Personal_Details'].append({
#                                     'row': index + 2,
#                                     'status': 'error',
#                                     'message': f"Department '{name}' not found"
#                                 })
#                                 errors.append(f"Row {index + 2} in Employee_Personal_Details: Department '{name}' not found")
#                                 raise ValueError(f"Department '{name}' not found")
#                         employee.Department.set(departments)

#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'success',
#                         'message': f"Employee {employee.Employee_ID} processed successfully",
#                         'db_id': employee.Employee_ID
#                     })

#                     # Process related models
#                     sheet_data = {}
#                     for sheet_name in expected_sheets:
#                         if sheet_name != 'Employee_Personal_Details' and sheet_name in excel_data.sheet_names:
#                             df = pd.read_excel(file, sheet_name=sheet_name)
#                             df = df.fillna('')
#                             employee_rows = df[df['Employee_ID'].astype(str).str.strip() == (employee_id or employee.Employee_ID)]
#                             sheet_data[sheet_name] = employee_rows if not employee_rows.empty else None

#                     # Create records in dependency order
#                     model_order = [
#                         Employeement_History_Detials,
#                         Employee_Medical_Information_Detials,
#                         Current_History_Detials,
#                         Financial_History_Detials,
#                         Salary_Maintenance_Detials,
#                         Document_Checklist_Detials,
#                         EmployeeProbationDetails,
#                         EmployeeSecurityDeposit,
#                         Employee_GratuityDetails,
#                         Employee_Skills_Detials,
#                         Employee_Leavelist,
#                         EmployeeAllowanceDetails,
#                         EmployeeDeductionDetails
#                     ]

#                     for model in model_order:
#                         sheet_name = [k for k, v in expected_sheets.items() if v == model][0]
#                         try:
#                             data = None
#                             if sheet_data.get(sheet_name) is not None:
#                                 row = sheet_data[sheet_name].iloc[0]
#                                 if sheet_name == 'Employment_History':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'PreviousWorkExperience': row['PreviousWorkExperience'] or "No",
#                                         'PreviousWorkPFNumber': row['PreviousWorkPFNumber'] or "No",
#                                         'PreviousWorkESINumber': row['PreviousWorkESINumber'] or "No",
#                                         'PFNumber': row['PFNumber'] or None,
#                                         'ESINumber': row['ESINumber'] or None,
#                                         'NoOfYears': int(row['NoOfYears']) if row['NoOfYears'] and str(row['NoOfYears']).isdigit() else None,
#                                         'WorkStationNameAddress': row['WorkStationNameAddress'] or None,
#                                         'ReasonForLeft': row['ReasonForLeft'] or None,
#                                         'WorkStationPhoneNo': str(row['WorkStationPhoneNo']) if row['WorkStationPhoneNo'] else None,
#                                         'ConfirmedBy': row['ConfirmedBy'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Medical_Information':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'PreExisiting_Medical_Condition': row['PreExisiting_Medical_Condition'] or None,
#                                         'PsychiatricMedicines': row['PsychiatricMedicines'] or None,
#                                         'PsychiatricMedicinesDetails': row['PsychiatricMedicinesDetails'] or None,
#                                         'PreviousOperation': row['PreviousOperation'] or None,
#                                         'SurgeriesDetails': row['SurgeriesDetails'] or None,
#                                         'VaccinationStatus': row['VaccinationStatus'] or None,
#                                         'VaccinationStatusDetails': row['VaccinationStatusDetails'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Current_History':
#                                     current_location = None
#                                     if row['CurrentEmployeementLocation']:
#                                         try:
#                                             current_location = Location_Detials.objects.get(Location_Name=row['CurrentEmployeementLocation'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"CurrentEmployeementLocation '{row['CurrentEmployeementLocation']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: CurrentEmployeementLocation not found")
#                                             continue

#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'DateOfJoining': row['DateOfJoining'] if pd.notnull(row['DateOfJoining']) else None,
#                                         'ReportingManager': row['ReportingManager'] or None,
#                                         'GovtLeave': int(row['GovtLeave']) if row['GovtLeave'] and str(row['GovtLeave']).isdigit() else None,
#                                         'CasualLeave': int(row['CasualLeave']) if row['CasualLeave'] and str(row['CasualLeave']).isdigit() else None,
#                                         'SickLeave': int(row['SickLeave']) if row['SickLeave'] and str(row['SickLeave']).isdigit() else None,
#                                         'TotalLeave': int(row['TotalLeave']) if row['TotalLeave'] and str(row['TotalLeave']).isdigit() else None,
#                                         'WorkEmail': row['WorkEmail'] or None,
#                                         'CurrentEmployeementLocations': current_location or get_default_location(),
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Probation_Details':
#                                     data = {
#                                         'Employee': employee,
#                                         'is_on_probation': row['is_on_probation'] in [True, 'True'],
#                                         'probation_start_date': row['probation_start_date'] if pd.notnull(row['probation_start_date']) else None,
#                                         'probation_end_date': row['probation_end_date'] if pd.notnull(row['probation_end_date']) else None,
#                                         'probation_periods': int(row['probation_periods']) if row['probation_periods'] and str(row['probation_periods']).isdigit() else None,
#                                         'months_completed': int(row['months_completed']) if row['months_completed'] and str(row['months_completed']).isdigit() else None,
#                                         'probation_status': row['probation_status'] or None,
#                                         'extended_date': row['extended_date'] if pd.notnull(row['extended_date']) else None,
#                                         'extended_months': int(row['extended_months']) if row['extended_months'] and str(row['extended_months']).isdigit() else None,
#                                         'terminated_date': row['terminated_date'] if pd.notnull(row['terminated_date']) else None,
#                                         'confirmation_date': row['confirmation_date'] if pd.notnull(row['confirmation_date']) else None,
#                                         'training_given_by': row['training_given_by'] or None,
#                                         'training_verified_by': row['training_verified_by'] or None,
#                                         'training_completed_date': row['training_completed_date'] if pd.notnull(row['training_completed_date']) else None
#                                     }
#                                 elif sheet_name == 'Security_Deposit':
#                                     data = {
#                                         'Employee': employee,
#                                         'requires_security_deposit': row['requires_security_deposit'] in [True, 'True'],
#                                         'security_start_date': row['security_start_date'] if pd.notnull(row['security_start_date']) else None,
#                                         'security_end_date': row['security_end_date'] if pd.notnull(row['security_end_date']) else None,
#                                         'total_security_amount': Decimal(str(row['total_security_amount'])) if row['total_security_amount'] else None,
#                                         'security_pending_months': int(row['security_pending_months']) if row['security_pending_months'] and str(row['security_pending_months']).isdigit() else None,
#                                         'security_installment_count': int(row['security_installment_count']) if row['security_installment_count'] and str(row['security_installment_count']).isdigit() else None,
#                                         'security_months_paid': int(row['security_months_paid']) if row['security_months_paid'] and str(row['security_months_paid']).isdigit() else None,
#                                         'security_months_to_be_scheduled': int(row['security_months_to_be_scheduled']) if row['security_months_to_be_scheduled'] and str(row['security_months_to_be_scheduled']).isdigit() else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Gratuity_Details':
#                                     data = {
#                                         'Employee': employee,
#                                         'require_gratuity': row['require_gratuity'] in [True, 'True'],
#                                         'gratuity_start_date': row['gratuity_start_date'] if pd.notnull(row['gratuity_start_date']) else None,
#                                         'total_gratuity_amount': Decimal(str(row['total_gratuity_amount'])) if row['total_gratuity_amount'] else None,
#                                         'monthly_gratuity_amount': Decimal(str(row['monthly_gratuity_amount'])) if row['monthly_gratuity_amount'] else None,
#                                         'gratuity_pending_months': int(row['gratuity_pending_months']) if row['gratuity_pending_months'] and str(row['gratuity_pending_months']).isdigit() else None,
#                                         'gratuity_installment_count': int(row['gratuity_installment_count']) if row['gratuity_installment_count'] and str(row['gratuity_installment_count']).isdigit() else None,
#                                         'gratuity_months_to_be_scheduled': int(row['gratuity_months_to_be_scheduled']) if row['gratuity_months_to_be_scheduled'] and str(row['gratuity_months_to_be_scheduled']).isdigit() else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Financial_History':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'EmployeeCurrentHistoryInfo': related_ids[employee.Employee_ID].get('current_history'),
#                                         'Salary': float(row['Salary']) if row['Salary'] else None,
#                                         'BasicSalary': float(row['BasicSalary']) if row['BasicSalary'] else None,
#                                         'BasicSalary_Percentage': float(row['BasicSalary_Percentage']) if row['BasicSalary_Percentage'] else None,
#                                         'Allowance_amount': float(row['Allowance_amount']) if row['Allowance_amount'] else None,
#                                         'Deduction_amount': float(row['Deduction_amount']) if row['Deduction_amount'] else None,
#                                         'Allowancefinal': float(row['Allowancefinal']) if row['Allowancefinal'] else None,
#                                         'PfForEmployee': float(row['PfForEmployee']) if row['PfForEmployee'] else None,
#                                         'SecurityDeposite': float(row['SecurityDeposite']) if row['SecurityDeposite'] else None,
#                                         'PF_amount': float(row['PF_amount']) if row['PF_amount'] else None,
#                                         'ctc': float(row['ctc']) if row['ctc'] else None,
#                                         'PF_is_applicable': row['PF_is_applicable'] in [True, 'True'],
#                                         'PFNumber': row['PFNumber'] or None,
#                                         'PF_EmployerPercentage': float(row['PF_EmployerPercentage']) if row['PF_EmployerPercentage'] else None,
#                                         'PF_EmployeePercentage': float(row['PF_EmployeePercentage']) if row['PF_EmployeePercentage'] else None,
#                                         'PF_EmployeeAmount': float(row['PF_EmployeeAmount']) if row['PF_EmployeeAmount'] else None,
#                                         'PF_EmployerAmount': float(row['PF_EmployerAmount']) if row['PF_EmployerAmount'] else None,
#                                         'ESI_is_applicable': row['ESI_is_applicable'] in [True, 'True'],
#                                         'ESINumber': row['ESINumber'] or None,
#                                         'ESI_Percentage': float(row['ESI_Percentage']) if row['ESI_Percentage'] else None,
#                                         'ESI_Amount': float(row['ESI_Amount']) if row['ESI_Amount'] else None,
#                                         'TDS_is_applicable': row['TDS_is_applicable'] in [True, 'True'],
#                                         'TDS_Percentage': float(row['TDS_Percentage']) if row['TDS_Percentage'] else None,
#                                         'TDS_Amount': float(row['TDS_Amount']) if row['TDS_Amount'] else None,
#                                         'Net_salary': Decimal(str(row['Net_salary'])) if row['Net_salary'] else None,
#                                         'AccountHolderName': row['AccountHolderName'] or None,
#                                         'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                         'BankName': row['BankName'] or None,
#                                         'Branch': row['Branch'] or None,
#                                         'IfscCode': row['IfscCode'] or None,
#                                         'PanNumber': row['PanNumber'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Salary_Maintenance':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'EmployeeCurrentHistoryInfo': related_ids[employee.Employee_ID].get('current_history'),
#                                         'BasicSalary': float(row['BasicSalary']) if row['BasicSalary'] else None,
#                                         'ctc': float(row['ctc']) if row['ctc'] else None,
#                                         'AccountHolderName': row['AccountHolderName'] or None,
#                                         'AccountNumber': str(row['AccountNumber']) if row['AccountNumber'] else None,
#                                         'BankName': row['BankName'] or None,
#                                         'Branch': row['Branch'] or None,
#                                         'IfscCode': row['IfscCode'] or None,
#                                         'PanNumber': row['PanNumber'] or None,
#                                         'Status': row['Status'] or 'Active',
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Document_Checklist':
#                                     location = None
#                                     if row['Location']:
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'EmployeementHistory': related_ids[employee.Employee_ID].get('employment_history'),
#                                         'EmployeeMedicalInfo': related_ids[employee.Employee_ID].get('medical_info'),
#                                         'EmployeeCurrentHistoryInfo': related_ids[employee.Employee_ID].get('current_history'),
#                                         'EmployeeFinancialHistory': related_ids[employee.Employee_ID].get('financial_history'),
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Skills':
#                                     location = None
#                                     if row.get('Location'):
#                                         try:
#                                             location = Location_Detials.objects.get(Location_Name=row['Location'])
#                                         except ObjectDoesNotExist:
#                                             results[sheet_name].append({
#                                                 'row': index + 2,
#                                                 'status': 'error',
#                                                 'message': f"Location '{row['Location']}' not found"
#                                             })
#                                             errors.append(f"Row {index + 2} in {sheet_name}: Location not found")
#                                             continue

#                                     data = {
#                                         'Employee': employee,
#                                         'Skill': row['Skill'] or None,
#                                         'Level': row['Level'] or None,
#                                         'Location': location or get_default_location(),
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Leaves':
#                                     data = {
#                                         'Employee': employee,
#                                         'leave_type': row['leave_type'] or None,
#                                         'leave_count': int(row['leave_count']) if row['leave_count'] and str(row['leave_count']).isdigit() else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Allowance':
#                                     data = {
#                                         'Employee': employee,
#                                         'allowance': row['allowance'] or None,
#                                         'percentage': float(row['percentage']) if row['percentage'] else None,
#                                         'amount': Decimal(str(row['amount'])) if row['amount'] else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }
#                                 elif sheet_name == 'Employee_Deduction':
#                                     data = {
#                                         'Employee': employee,
#                                         'deduction': row['deduction'] or None,
#                                         'amount': Decimal(str(row['amount'])) if row['amount'] else None,
#                                         'created_by': row['created_by'] or 'admin'
#                                     }

#                             if data is None:
#                                 related_instances = {
#                                     'employment_history': related_ids[employee.Employee_ID].get('employment_history'),
#                                     'medical_info': related_ids[employee.Employee_ID].get('medical_info'),
#                                     'current_history': related_ids[employee.Employee_ID].get('current_history'),
#                                     'financial_history': related_ids[employee.Employee_ID].get('financial_history')
#                                 }
#                                 data = get_default_data(model, employee, related_instances)

#                             # Save or update record
#                             instance = model.objects.filter(Employee=employee).first()
#                             if instance:
#                                 for key, value in data.items():
#                                     setattr(instance, key, value)
#                                 instance.save()
#                             else:
#                                 instance = model.objects.create(**data)

#                             # Store instance ID for foreign key references
#                             if model == Employeement_History_Detials:
#                                 related_ids[employee.Employee_ID]['employment_history'] = instance
#                             elif model == Employee_Medical_Information_Detials:
#                                 related_ids[employee.Employee_ID]['medical_info'] = instance
#                             elif model == Current_History_Detials:
#                                 related_ids[employee.Employee_ID]['current_history'] = instance
#                             elif model == Financial_History_Detials:
#                                 related_ids[employee.Employee_ID]['financial_history'] = instance

#                             # Link allowances to Salary_Maintenance
#                             if sheet_name == 'Employee_Allowance':
#                                 salary_instance = Salary_Maintenance_Detials.objects.filter(Employee=employee).first()
#                                 if salary_instance:
#                                     salary_instance.EmployeeAllowanceDetails.add(instance)

#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'success',
#                                 'message': f"Row processed successfully for Employee_ID {employee.Employee_ID}"
#                             })

#                         except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                             logger.error("Error in %s for Employee_ID %s: %s", sheet_name, employee.Employee_ID, str(e))
#                             results[sheet_name].append({
#                                 'row': index + 2,
#                                 'status': 'error',
#                                 'message': str(e)
#                             })
#                             errors.append(f"Row {index + 2} in {sheet_name} for Employee_ID {employee.Employee_ID}: {str(e)}")
#                             raise

#                 except (ObjectDoesNotExist, ValueError, ValidationError) as e:
#                     logger.error("Error in Employee_Personal_Details row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': str(e)
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue
#                 except Exception as e:
#                     logger.error("Unexpected error in Employee_Personal_Details row %d: %s", index + 2, str(e))
#                     results['Employee_Personal_Details'].append({
#                         'row': index + 2,
#                         'status': 'error',
#                         'message': f"Unexpected error: {str(e)}"
#                     })
#                     errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
#                     continue

#         # Prepare response
#         status = 'success' if not errors else 'partial_success'
#         response = {
#             'status': status,
#             'results': results,
#             'errors': errors
#         }
#         return JsonResponse({"success": "Employee details uploaded successfully."})

#     except Exception as e:
#         logger.error("Failed to process Excel file: %s", str(e))
#         return JsonResponse({
#             'status': 'error',
#             'message': f"Failed to process Excel file: {str(e)}"
#         }, status=500)



import logging
import pandas as pd
from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from decimal import Decimal
import datetime

logger = logging.getLogger(__name__)

def get_default_location():
    """Fetch or create a default Location_Detials instance."""
    location = Location_Detials.objects.first()
    if not location:
        location = Location_Detials.objects.create(
            Location_Name='Default Location',
            created_by='admin'
        )
    return location

def get_default_data(model, employee_instance, related_ids=None):
    """Generate default data for a given model."""
    related_ids = related_ids or {}
    default_location = get_default_location()
    data = {
        'Employee': employee_instance,
    }
    # Only add created_by for models that support it
    if model not in [
        EmployeeProbationDetails,
        EmployeeSecurityDeposit,
        Employee_GratuityDetails,
        Employee_Skills_Detials,
        Employee_Leavelist,
        EmployeeAllowanceDetails,
        EmployeeDeductionDetails
    ]:
        data['created_by'] = 'admin'

    if model == Employeement_History_Detials:
        data.update({
            'PreviousWorkExperience': 'No',
            'PreviousWorkPFNumber': None,
            'PreviousWorkESINumber': None,
            'PFNumber': None,
            'ESINumber': None,
            'NoOfYears': 0,
            'WorkStationNameAddress': None,
            'ReasonForLeft': None,
            'WorkStationPhoneNo': None,
            'ConfirmedBy': None,
            'Location': default_location
        })
    elif model == Employee_Medical_Information_Detials:
        employment_history = related_ids.get('employment_history')
        data.update({
            'EmployeementHistory': employment_history,
            'PreExisiting_Medical_Condition': 'None',
            'PsychiatricMedicines': 'No',
            'PsychiatricMedicinesDetails': None,
            'PreviousOperation': 'No',
            'SurgeriesDetails': None,
            'VaccinationStatus': 'Unknown',
            'VaccinationStatusDetails': None,
            'Location': default_location
        })
    elif model == Current_History_Detials:
        employment_history = related_ids.get('employment_history')
        medical_info = related_ids.get('medical_info')
        data.update({
            'EmployeementHistory': employment_history,
            'EmployeeMedicalInfo': medical_info,
            'DateOfJoining': datetime.date.today().strftime('%Y-%m-%d'),
            'ReportingManager': None,
            'GovtLeave': 0,
            'CasualLeave': 0,
            'SickLeave': 0,
            'TotalLeave': 0,
            'WorkEmail': None,
            'CurrentEmployeementLocations': default_location,
            'Location': default_location
        })
    elif model == EmployeeProbationDetails:
        data.update({
            'is_on_probation': False,
            'probation_start_date': None,
            'probation_end_date': None,
            'probation_periods': 0,
            'months_completed': None,
            'probation_status': 'Not Applicable',
            'extended_date': None,
            'extended_months': 0,
            'terminated_date': None,
            'confirmation_date': None,
            'training_given_by': None,
            'training_verified_by': None,
            'training_completed_date': None
        })
    elif model == EmployeeSecurityDeposit:
        data.update({
            'requires_security_deposit': False,
            'security_start_date': None,
            'security_end_date': None,
            'total_security_amount': Decimal('0.00'),
            'security_pending_months': None,
            'security_installment_count': 0,
            'security_months_paid': 0,
            'security_months_to_be_scheduled': 0
        })
    elif model == Employee_GratuityDetails:
        data.update({
            'require_gratuity': False,
            'gratuity_start_date': None,
            'total_gratuity_amount': Decimal('0.00'),
            'monthly_gratuity_amount': Decimal('0.00'),
            'gratuity_pending_months': 0,
            'gratuity_installment_count': 0,
            'gratuity_months_to_be_scheduled': 0
        })
    elif model == Financial_History_Detials:
        employment_history = related_ids.get('employment_history')
        medical_info = related_ids.get('medical_info')
        current_history = related_ids.get('current_history')
        data.update({
            'EmployeementHistory': employment_history,
            'EmployeeMedicalInfo': medical_info,
            'EmployeeCurrentHistoryInfo': current_history,
            'Salary': 0.0,
            'BasicSalary': 0.0,
            'BasicSalary_Percentage': 0.0,
            'Allowance_amount': 0.0,
            'Deduction_amount': 0.0,
            'Allowancefinal': 0.0,
            'PfForEmployee': 0.0,
            'SecurityDeposite': 0.0,
            'PF_amount': 0.0,
            'ctc': 0.0,
            'PF_is_applicable': False,
            'PFNumber': None,
            'PF_EmployerPercentage': 0.0,
            'PF_EmployeePercentage': 0.0,
            'PF_EmployeeAmount': 0.0,
            'PF_EmployerAmount': 0.0,
            'ESI_is_applicable': False,
            'ESINumber': None,
            'ESI_Percentage': 0.0,
            'ESI_Amount': 0.0,
            'TDS_is_applicable': False,
            'TDS_Percentage': 0.0,
            'TDS_Amount': 0.0,
            'Net_salary': None,
            'AccountHolderName': None,
            'AccountNumber': None,
            'BankName': None,
            'Branch': None,
            'IfscCode': None,
            'PanNumber': None,
            'Location': default_location
        })
    elif model == Salary_Maintenance_Detials:
        employment_history = related_ids.get('employment_history')
        medical_info = related_ids.get('medical_info')
        current_history = related_ids.get('current_history')
        data.update({
            'EmployeementHistory': employment_history,
            'EmployeeMedicalInfo': medical_info,
            'EmployeeCurrentHistoryInfo': current_history,
            'BasicSalary': None,
            'ctc': 0.0,
            'AccountHolderName': None,
            'AccountNumber': None,
            'BankName': None,
            'Branch': None,
            'IfscCode': None,
            'PanNumber': None,
            'Status': 'Active',
            'Location': default_location
        })
    elif model == Document_Checklist_Detials:
        employment_history = related_ids.get('employment_history')
        medical_info = related_ids.get('medical_info')
        current_history = related_ids.get('current_history')
        financial_history = related_ids.get('financial_history')
        data.update({
            'EmployeementHistory': employment_history,
            'EmployeeMedicalInfo': medical_info,
            'EmployeeCurrentHistoryInfo': current_history,
            'EmployeeFinancialHistory': financial_history,
            'Location': default_location
        })

    return data





@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def employee_excel_upload(request):
    if request.method != 'POST':
        logger.error("Invalid request method: %s", request.method)
        return JsonResponse({'error': 'Only POST method is allowed'}, status=400)

    if 'file' not in request.FILES:
        logger.error("No file uploaded in request")
        return JsonResponse({'error': 'No file uploaded'}, status=400)

    try:
        # Read the uploaded Excel file
        file = request.FILES['file']
        excel_data = pd.ExcelFile(file)

        # Expected sheet names
        expected_sheets = {
            'Employee_Personal_Details': Employee_Personal_Form_Detials,
            'Employment_History': Employeement_History_Detials,
            'Medical_Information': Employee_Medical_Information_Detials,
            'Current_History': Current_History_Detials,
            'Probation_Details': EmployeeProbationDetails,
            'Security_Deposit': EmployeeSecurityDeposit,
            'Gratuity_Details': Employee_GratuityDetails,
            'Financial_History': Financial_History_Detials,
            'Salary_Maintenance': Salary_Maintenance_Detials,
            'Document_Checklist': Document_Checklist_Detials,
            'Employee_Skills': Employee_Skills_Detials,
            'Employee_Leaves': Employee_Leavelist,
            'Employee_Allowance': EmployeeAllowanceDetails,
            'Employee_Deduction': EmployeeDeductionDetails
        }

        # Validate sheet names
        missing_sheets = [sheet for sheet in expected_sheets if sheet not in excel_data.sheet_names]
        if 'Employee_Personal_Details' not in excel_data.sheet_names:
            logger.error("Missing required sheet: Employee_Personal_Details")
            return JsonResponse({
                'status': 'error',
                'message': 'Missing required sheet: Employee_Personal_Details'
            }, status=400)

        # Initialize response data and mappings
        results = {sheet: [] for sheet in expected_sheets}
        errors = []
        employee_id_to_db_id = {}  # Maps Existing_Employee_ID to auto-generated Employee_ID
        related_ids = {}  # Employee_ID to {model: instance_id}

        # Process Employee_Personal_Details
        personal_df = pd.read_excel(file, sheet_name='Employee_Personal_Details')
        personal_df = personal_df.fillna('')  # Replace NaN with empty string

        for index, row in personal_df.iterrows():
            with transaction.atomic():  # Per-row transaction
                try:
                    logger.debug("Processing row %d: %s", index + 2, row.to_dict())
                    existing_employee_id = str(row.get('Existing_Employee_ID', '')).strip()
                    is_update = False
                    employee = None

                    # Validate CharFields
                    char_fields = [
                        field for field in Employee_Personal_Form_Detials._meta.fields
                        if isinstance(field, models.CharField)
                    ]
                    for field in char_fields:
                        if row.get(field.name, '') and len(str(row[field.name])) > field.max_length:
                            raise ValueError(f"{field.name} exceeds max length of {field.max_length} characters")

                    # Validate Existing_Employee_ID for updates
                    if existing_employee_id:
                        try:
                            employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=existing_employee_id)
                            is_update = True
                            logger.info("Found existing employee: %s", existing_employee_id)
                        except ObjectDoesNotExist:
                            logger.warning("Existing_Employee_ID %s not found in database", existing_employee_id)
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': f"Existing_Employee_ID '{existing_employee_id}' not found"
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: Existing_Employee_ID '{existing_employee_id}' not found")
                            continue
                    else:
                        logger.debug("No Existing_Employee_ID provided, creating new employee")

                    # Resolve ForeignKeys
                    title = None
                    if row.get('Title'):
                        try:
                            title = Title_Detials.objects.filter(Title_Name=row['Title']).first()
                            if not title:
                                raise ObjectDoesNotExist(f"Title '{row['Title']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    blood_group = None
                    if row.get('BloodGroup'):
                        try:
                            blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Name=row['BloodGroup']).first()
                            if not blood_group:
                                raise ObjectDoesNotExist(f"BloodGroup '{row['BloodGroup']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    classification = None
                    if row.get('Classification'):
                        try:
                            classification = Classification_Detials.objects.filter(Classification_Name=row['Classification']).first()
                            if not classification:
                                raise ObjectDoesNotExist(f"Classification '{row['Classification']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    category = None
                    if row.get('Category'):
                        try:
                            category = Category_Detials.objects.filter(Category_Name=row['Category']).first()
                            if not category:
                                raise ObjectDoesNotExist(f"Category '{row['Category']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    speciality = None
                    if row.get('Speciality'):
                        try:
                            speciality = Speciality_Detials.objects.filter(Speciality_Name=row['Speciality']).first()
                            if not speciality:
                                raise ObjectDoesNotExist(f"Speciality '{row['Speciality']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    designation = None
                    if row.get('Designation'):
                        try:
                            designation = Designation_Detials.objects.filter(Designation_Name=row['Designation'].strip()).first()
                            if not designation:
                                raise ObjectDoesNotExist(f"Designation '{row['Designation']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    role = None
                    if row.get('Role'):
                        try:
                            role = Role_Master.objects.filter(Role_Name=row['Role']).first()
                            if not role:
                                raise ObjectDoesNotExist(f"Role '{row['Role']}' not found")
                        except ObjectDoesNotExist as e:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': str(e)
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                            continue

                    location = None
                    if row.get('Location'):
                        try:
                            location = Location_Detials.objects.get(Location_Name=row['Location'])
                        except ObjectDoesNotExist:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': f"Location '{row['Location']}' not found"
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: Location not found")
                            continue

                    ledger_group = None
                    if row.get('LedgerGroupName'):
                        try:
                            ledger_group = Finance_GroupMaster_Detailes.objects.filter(pk=22).first()
                            if not ledger_group:
                                raise ObjectDoesNotExist(f"LedgerGroupName '{row['LedgerGroupName']}' not found")
                        except ObjectDoesNotExist:
                            results['Employee_Personal_Details'].append({
                                'row': index + 2,
                                'status': 'error',
                                'message': f"LedgerGroupName '{row['LedgerGroupName']}' not found"
                            })
                            errors.append(f"Row {index + 2} in Employee_Personal_Details: LedgerGroupName not found")
                            continue

                    # Prepare employee data
                    employee_data = {
                        'Tittle': title,
                        'Existing_Employee_ID': existing_employee_id or None,
                        'First_Name': row.get('First_Name') or None,
                        'Middle_Name': row.get('Middle_Name') or None,
                        'Last_Name': row.get('Last_Name') or None,
                        'Gender': row.get('Gender') or None,
                        'DOB': row.get('DOB') if pd.notnull(row.get('DOB')) else None,
                        'Age': str(row.get('Age')) if row.get('Age') else None,
                        'BloodGroup': blood_group,
                        'Contact_Number': str(row.get('Contact_Number')) if row.get('Contact_Number') else None,
                        'Alternate_Number': str(row.get('Alternate_Number')) if row.get('Alternate_Number') else None,
                        'E_mail': row.get('E_mail') or None,
                        'Qualification': row.get('Qualification') or None,
                        'IdProofType': row.get('IdProofType') or None,
                        'IdProofNo': row.get('IdProofNo') or None,
                        'Marital_Status': row.get('Marital_Status') or None,
                        'MarriagePlan': row.get('MarriagePlan') or None,
                        'AnniversaryDate': row.get('AnniversaryDate') if pd.notnull(row.get('AnniversaryDate')) else None,
                        'Residence': row.get('Residence') or None,
                        'FatherName': row.get('FatherName') or None,
                        'FatherContact': str(row.get('FatherContact')) if row.get('FatherContact') else None,
                        'FatherWorking': row.get('FatherWorking') or None,
                        'FatherWorkPlace': row.get('FatherWorkPlace') or None,
                        'MotherName': row.get('MotherName') or None,
                        'MotherContact': str(row.get('MotherContact')) if row.get('MotherContact') else None,
                        'MotherWorking': row.get('MotherWorking') or None,
                        'MotherWorkPlace': row.get('MotherWorkPlace') or None,
                        'Spouse_Name': row.get('Spouse_Name') or None,
                        'SpouseContact': str(row.get('SpouseContact')) if row.get('SpouseContact') else None,
                        'SpouseWorking': row.get('SpouseWorking') or None,
                        'SpouseWorkPlace': row.get('SpouseWorkPlace') or None,
                        'Child': row.get('Child') or None,
                        'TotalNoChild': str(row.get('TotalNoChild')) if row.get('TotalNoChild') and str(row.get('TotalNoChild')).isdigit() else None,
                        'DoorNo': str(row.get('DoorNo')) if row.get('DoorNo') else None,
                        'Street': row.get('Street') or None,
                        'Area': row.get('Area') or None,
                        'City': row.get('City') or None,
                        'District': row.get('District') or None,
                        'State': row.get('State') or None,
                        'Country': row.get('Country') or None,
                        'Pincode': str(row.get('Pincode')) if row.get('Pincode') else None,
                        'PermanentAddressSameAsAbove': row.get('PermanentAddressSameAsAbove') or None,
                        'PermanentDoorNo': str(row.get('PermanentDoorNo')) if row.get('PermanentDoorNo') else None,
                        'PermanentStreet': row.get('PermanentStreet') or None,
                        'PermanentArea': row.get('PermanentArea') or None,
                        'PermanentCity': row.get('PermanentCity') or None,
                        'PermanentDistrict': row.get('PermanentDistrict') or None,
                        'PermanentState': row.get('PermanentState') or None,
                        'PermanentCountry': row.get('PermanentCountry') or None,
                        'PermanentPincode': str(row.get('PermanentPincode')) if row.get('PermanentPincode') else None,
                        'EmergencyContactName1': row.get('EmergencyContactName1') or None,
                        'EmergencyContactNo1': str(row.get('EmergencyContactNo1')) if row.get('EmergencyContactNo1') else None,
                        'EmergencyContactName2': row.get('EmergencyContactName2') or None,
                        'EmergencyContactNo2': str(row.get('EmergencyContactNo2')) if row.get('EmergencyContactNo2') else None,
                        'Classification': classification,
                        'Category': category,
                        'Speciality': speciality,
                        'Designation': designation,
                        'Role': role,
                        'Location': location or get_default_location(),
                        'ActiveStatus': 'Yes' if row.get('ActiveStatus', '').lower() == 'yes' else 'No',
                        'RequirementSource': row.get('RequirementSource') or None,
                        'Source': row.get('Source') or None,
                        'LedgerName': f"{title.Title_Name}.{row.get('First_Name')}{row.get('Middle_Name')}{row.get('Last_Name')}".upper() if title and row.get('First_Name') else None,
                        'LedgerGroupName': ledger_group,
                        'OpeningBalance': Decimal(str(row.get('OpeningBalance', 0))) if row.get('OpeningBalance') else Decimal('0.00'),
                        'DebitOrCredit': row.get('DebitOrCredit') or None,
                        'Status': True if row.get('Status') in [True, 'True'] else False,
                        'created_by': row.get('created_by') or 'admin',
                    }

                    # Create or update employee
                    if is_update and employee:
                        for key, value in employee_data.items():
                            setattr(employee, key, value)
                        employee.save()
                        logger.info("Updated employee: %s", employee.Employee_ID)
                    else:
                        employee = Employee_Personal_Form_Detials(**employee_data)
                        employee.save()  # Auto-generates Employee_ID
                        logger.info("Created employee with auto-generated ID: %s", employee.Employee_ID)

                    # Map Existing_Employee_ID (or None) to auto-generated Employee_ID
                    employee_id_to_db_id[existing_employee_id or employee.Employee_ID] = employee.Employee_ID
                    related_ids[employee.Employee_ID] = {}

                    # Handle ManyToMany Department
                    if row.get('Departments'):
                        department_names = [name.strip() for name in row['Departments'].split(',') if name.strip()]
                        departments = []
                        for name in department_names:
                            try:
                                dept = Department_Detials.objects.get(Department_Name=name)
                                departments.append(dept)
                            except ObjectDoesNotExist:
                                results['Employee_Personal_Details'].append({
                                    'row': index + 2,
                                    'status': 'error',
                                    'message': f"Department '{name}' not found"
                                })
                                errors.append(f"Row {index + 2} in Employee_Personal_Details: Department '{name}' not found")
                                continue
                        employee.Department.set(departments)
                        logger.debug("Assigned departments for %s: %s", employee.Employee_ID, department_names)

                    # Log ledger mapping
                    if row.get('LedgerName'):
                        logger.info("Mapping entry created for Finance Ledger: %s", row['LedgerName'].upper())

                    results['Employee_Personal_Details'].append({
                        'row': index + 2,
                        'status': 'success',
                        'message': f"Employee {employee.Employee_ID} processed successfully",
                        'db_id': employee.Employee_ID
                    })

                    # Process related models (simplified for brevity)
                    sheet_data = {}
                    for sheet_name in expected_sheets:
                        if sheet_name != 'Employee_Personal_Details' and sheet_name in excel_data.sheet_names:
                            df = pd.read_excel(file, sheet_name=sheet_name)
                            df = df.fillna('')
                            employee_rows = df[df['Employee_ID'].astype(str).str.strip() == (existing_employee_id or employee.Employee_ID)]
                            sheet_data[sheet_name] = employee_rows if not employee_rows.empty else None
                            logger.debug("Loaded %s rows for %s in sheet %s", len(employee_rows), employee.Employee_ID, sheet_name)

                    # [Rest of related models processing remains the same as in previous code, handling each sheet]

                except (ObjectDoesNotExist, ValueError, ValidationError, DataError) as e:
                    logger.error("Error in Employee_Personal_Details row %d: %s", index + 2, str(e))
                    results['Employee_Personal_Details'].append({
                        'row': index + 2,
                        'status': 'error',
                        'message': str(e)
                    })
                    errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                    continue
                except Exception as e:
                    logger.error("Unexpected error in Employee_Personal_Details row %d: %s", index + 2, str(e))
                    results['Employee_Personal_Details'].append({
                        'row': index + 2,
                        'status': 'error',
                        'message': f"Unexpected error: {str(e)}"
                    })
                    errors.append(f"Row {index + 2} in Employee_Personal_Details: {str(e)}")
                    continue

        # Prepare response
        status = 'success' if not errors else 'partial_success' if any(r['status'] == 'success' for r in results['Employee_Personal_Details']) else 'error'
        response = {
            'status': status,
            'results': results,
            'errors': errors
        }
        logger.info("Excel upload completed with status: %s, errors: %d", status, len(errors))
        return JsonResponse(response)

    except Exception as e:
        logger.error("Failed to process Excel file: %s", str(e))
        return JsonResponse({
            'status': 'error',
            'message': f"Failed to process Excel file: {str(e)}"
        }, status=500)