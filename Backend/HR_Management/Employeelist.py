from django.http import StreamingHttpResponse, JsonResponse
from django.db.models import Q
import json
import base64
import filetype

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from Masters.models import *
from .models import *
from Finance.models import *
import json
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
# import magic
import filetype
import base64
from django.db.models import Q,Prefetch
from django.db import transaction
from datetime import datetime
from calendar import monthrange
from .serializers import *

from django.shortcuts import get_object_or_404
from django.http import JsonResponse

def get_file_image(filedata, employee_id, field_name):
    """Convert file data to base64-encoded string."""
    kind = filetype.guess(filedata)
    contenttype1 = 'application/pdf' if not kind else kind.mime
    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

def stream_employees(employees):
    """Generator to stream employee data as JSON."""
    yield '['
    first = True
    for i, employee in enumerate(employees, start=1):
        if not first:
            yield ','
        first = False

        departmentId = ', '.join(str(dept.Department_Id) for dept in employee.Department.all())
        departments = ', '.join(dept.Department_Name for dept in employee.Department.all())
        userins = UserRegister_Master_Details.objects.filter(Employee_Id=employee.pk).first()

        employee_data = {
            'id': i,
            'Employee_Id': employee.pk,
            'userrecord': bool(userins),
            'Title': employee.Tittle.Title_Name if employee.Tittle else None,
            'FirstName': employee.First_Name,
            'MiddleName': employee.Middle_Name,
            'LastName': employee.Last_Name,
            'FullName': f"{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}".strip(),
            'Gender': employee.Gender,
            'DOB': employee.DOB,
            'Age': employee.Age,
            'BloodGroup': employee.BloodGroup.BloodGroup_Id if employee.BloodGroup else None,
            'BloodGroupName': employee.BloodGroup.BloodGroup_Name if employee.BloodGroup else None,
            'Phone': employee.Contact_Number,
            'Alternate_Number': employee.Alternate_Number,
            'Email': employee.E_mail,
            'Qualification': employee.Qualification,
            'SkillSet': employee.SkillSet,
            'leavesList1': 'l',
            'IdProofType': employee.IdProofType,
            'IdProofNo': employee.IdProofNo,
            'Marital_Status': employee.Marital_Status,
            'MarriagePlan': employee.MarriagePlan,
            'AnniversaryDate': employee.AnniversaryDate,
            'Residence': employee.Residence,
            'FatherName': employee.FatherName,
            'FatherContact': employee.FatherContact,
            'FatherWorking': employee.FatherWorking,
            'FatherWorkPlace': employee.FatherWorkPlace,
            'MotherName': employee.MotherName,
            'MotherContact': employee.MotherContact,
            'MotherWorking': employee.MotherWorking,
            'MotherWorkPlace': employee.MotherWorkPlace,
            'Spouse_Name': employee.Spouse_Name,
            'SpouseContact': employee.SpouseContact,
            'SpouseWorking': employee.SpouseWorking,
            'SpouseWorkPlace': employee.SpouseWorkPlace,
            'Child': employee.Child,
            'TotalNoChild': employee.TotalNoChild,
            'DoorNo': employee.DoorNo,
            'Street': employee.Street,
            'Area': employee.Area,
            'City': employee.City,
            'District': employee.District,
            'State': employee.State,
            'Country': employee.Country,
            'Pincode': employee.Pincode,
            'PermanentAddressSameAsAbove': employee.PermanentAddressSameAsAbove,
            'Category': employee.Category.Category_Name if employee.Category else None,
            'Speciality': employee.Speciality.Speciality_Name if employee.Speciality else None,
            'Department': departments,
            'Department_Id': departmentId,
            'Designation': employee.Designation.Designation_Name if employee.Designation else None,
            'EmergencyContactName1': employee.EmergencyContactName1,
            'EmergencyContactNo1': employee.EmergencyContactNo1,
            'EmergencyContactName2': employee.EmergencyContactName2,
            'EmergencyContactNo2': employee.EmergencyContactNo2,
            'ActiveStatus': employee.ActiveStatus,
            'RequirementSource': employee.RequirementSource,
            'Source': employee.Source,
            'Created_by': employee.created_by,
            'Photo': employee.Photo_base64 if hasattr(employee, 'Photo_base64') else get_file_image(employee.Photo, employee.pk, 'Photo') if employee.Photo else None,
            'Signature': employee.Signature_base64 if hasattr(employee, 'Signature_base64') else get_file_image(employee.Signature, employee.pk, 'Signature') if employee.Signature else None,
            'CaptureImage': employee.CaptureImage_base64 if hasattr(employee, 'CaptureImage_base64') else get_file_image(employee.CaptureImage, employee.pk, 'CaptureImage') if employee.CaptureImage else None,
            'Date': employee.created_at.strftime('%Y-%m-%d'),
            'Time': employee.created_at.strftime('%H:%M:%S'),
            'EmployeeHistory': [],
            'EmployeeLeavelist': [],
            'EmployeeSkillset': [],
            'EmployeeMedicalInfo': [],
            'EmployeeCurrentDetails': [],
            'EmployeeFinancialHistory': [],
            'EmployeeSecurityDepositDetails': [],
            'EmployeeGratuityDetails': [],
            'EmployeeProbationDetails': [],
            'EmployeeDocumentChecklist': [],
            'EmployeeAllowanceDetails': [],
            'EmployeeDeductionDetails': [],
        }

        EmployeeHistory_Data = Employeement_History_Detials.objects.filter(Employee=employee.pk)

        for table1 in EmployeeHistory_Data:
            employee_data['EmployeeHistory'].append({
                'id': table1.Employee.pk,
                'PreviousWorkExperience': table1.PreviousWorkExperience,
                'PreviousWorkPFNumber': table1.PreviousWorkPFNumber,
                'PreviousWorkESINumber': table1.PreviousWorkESINumber,
                'PFNumber': table1.PFNumber,
                'ESINumber': table1.ESINumber,
                'NoOfYears': table1.NoOfYears,
                'WorkStationNameAddress': table1.WorkStationNameAddress,
                'ReasonForLeft': table1.ReasonForLeft,
                'WorkStationPhoneNo': table1.WorkStationPhoneNo,
                'EmployeePaySlip': get_file_image(table1.EmployeePaySlip, employee.pk, 'EmployeePaySlip') if table1.EmployeePaySlip else None,
                'EmployeeOfferLetter': get_file_image(table1.EmployeeOfferLetter, employee.pk, 'EmployeeOfferLetter') if table1.EmployeeOfferLetter else None,
                'EmployeeReliveLetter': get_file_image(table1.EmployeeReliveLetter, employee.pk, 'EmployeeReliveLetter') if table1.EmployeeReliveLetter else None,
                'ConfirmedBy': table1.ConfirmedBy,
                'Created_by': table1.created_by,
            })
        EmployeeMedicalInfo_Data =  Employee_Medical_Information_Detials.objects.filter(Employee=employee.pk) 

        for table2 in EmployeeMedicalInfo_Data:
            employee_data['EmployeeMedicalInfo'].append({
                'id': table2.Employee.pk,
                'PreExisiting_Medical_Condition': table2.PreExisiting_Medical_Condition,
                'PsychiatricMedicines': table2.PsychiatricMedicines,
                'PsychiatricMedicinesDetails': table2.PsychiatricMedicinesDetails,
                'PreviousOperation': table2.PreviousOperation,
                'SurgeriesDetails': table2.SurgeriesDetails,
                'VaccinationStatus': table2.VaccinationStatus,
                'VaccinationStatusDetails': table2.VaccinationStatusDetails,
                'MedicalFitnessCertificate': get_file_image(table2.MedicalFitnessCertificate, employee.pk, 'MedicalFitnessCertificate') if table2.MedicalFitnessCertificate else None,
                'AnnualMedicalCheckup': get_file_image(table2.AnnualMedicalCheckup, employee.pk, 'AnnualMedicalCheckup') if table2.AnnualMedicalCheckup else None,
                'Created_by': table2.created_by,
            })

        CurrentHistory_Data =  Current_History_Detials.objects.filter(Employee=employee.pk)  

        for table3 in CurrentHistory_Data:
            employee_data['EmployeeCurrentDetails'].append({
                'id': table3.Employee.pk,
                'DateOfJoining': table3.DateOfJoining,
                'CurrentEmployeementLocations': table3.CurrentEmployeementLocations.Location_Id if table3.CurrentEmployeementLocations else None,
                'ReportingManager': table3.ReportingManager,
                'GovtLeave': table3.GovtLeave,
                'CasualLeave': table3.CasualLeave,
                'SickLeave': table3.SickLeave,
                'TotalLeave1': table3.TotalLeave,
                'WorkEmail': table3.WorkEmail,
                'Created_by': table3.created_by,
            })

        EmployeeLeavelist_Data = Employee_Leavelist.objects.filter(Employee=employee.pk)

        for table0 in EmployeeLeavelist_Data:
            employee_data['EmployeeLeavelist'].append({
                'leave_type': table0.leave_type,
                'leave_count': table0.leave_count,
            })
        
        EmployeeProbationDetails_Data = EmployeeProbationDetails.objects.filter(Employee=employee.pk)

        for table7 in EmployeeProbationDetails_Data:
            employee_data['EmployeeProbationDetails'].append({
                'id': table7.Employee.pk,
                'is_on_probation': table7.is_on_probation,
                'probation_start_date': table7.probation_start_date,
                'probation_end_date': table7.probation_end_date,
                'probation_periods': table7.probation_periods,
                'months_completed': table7.months_completed,
                'ProbationStatus': table7.probation_status,
                'ExtendedDate': table7.extended_date,
                'ExtendedMonths': table7.extended_months,
                'TerminatedDate': table7.terminated_date,
                'confirmation_date': table7.confirmation_date,
                'confidential_review_form': get_file_image(table7.confidential_review_form, employee.pk, 'confidential_review_form') if table7.confidential_review_form else None,
                'hod_review_form': get_file_image(table7.hod_review_form, employee.pk, 'hod_review_form') if table7.hod_review_form else None,
                'hr_review_form': get_file_image(table7.hr_review_form, employee.pk, 'hr_review_form') if table7.hr_review_form else None,
                'TrainingGivenBy': table7.training_given_by,
                'TrainingVerifiedBy': table7.training_verified_by,
                'TrainingCompletedDate': table7.training_completed_date,
            })

        EmployeeSecurityDeposit_Data = EmployeeSecurityDeposit.objects.filter(Employee=employee.pk)

        for table8 in EmployeeSecurityDeposit_Data:
            employee_data['EmployeeSecurityDepositDetails'].append({
                'requiresSecurityDeposit': table8.requires_security_deposit,
                'security_start_date': table8.security_start_date,
                'total_security_amount': table8.total_security_amount,
                'Security_pending_months': table8.security_pending_months,
                'Security_installment_count': table8.security_installment_count,
                'Security_months_paid': table8.security_months_paid,
                'Security_months_to_be_scheduled': table8.security_months_to_be_scheduled,
                'security_end_date': table8.security_end_date,
            })

        EmployeeGratuityDetails_Data = Employee_GratuityDetails.objects.filter(Employee=employee.pk)
        for table9 in EmployeeGratuityDetails_Data:
            employee_data['EmployeeGratuityDetails'].append({
                'requireGratuity': table9.require_gratuity,
                'gratuity_start_date': table9.gratuity_start_date,
                'total_gratuity_amount': table9.total_gratuity_amount,
                'monthly_Gratuity_amount': table9.monthly_gratuity_amount,
                'Gratuity_pending_months': table9.gratuity_pending_months,
                'Gratuity_installment_count': table9.gratuity_installment_count,
                'Gratuity_months_to_be_scheduled': table9.gratuity_months_to_be_scheduled,
            })

        EmployeeAllowance_Data = EmployeeAllowanceDetails.objects.filter(Employee=employee.pk,Status='Active')

        for table10 in EmployeeAllowance_Data:
            employee_data['EmployeeAllowanceDetails'].append({
                'allowance_name': table10.allowance,
                'allowance_percentage': table10.percentage,
                'allowance_amount': table10.amount,
            })

        EmployeeDeduction_Data = EmployeeDeductionDetails.objects.filter(Employee=employee.pk)
        for table11 in EmployeeDeduction_Data:
            employee_data['EmployeeDeductionDetails'].append({
                'deduction_name': table11.deduction,
                'deduction_amount': table11.amount,
            })

        FinancialHistory_Data =  Financial_History_Detials.objects.filter(Employee=employee.pk)
        for table4 in FinancialHistory_Data:
            employee_data['EmployeeFinancialHistory'].append({
                'id': table4.Employee.pk,
                'ctc': table4.ctc,
                'Salary': table4.Salary,
                'net_salary': table4.Net_salary,
                'BasicSalary': table4.BasicSalary,
                'PF_is_applicable': table4.PF_is_applicable,
                'AllowanceAmount': table4.Allowance_amount,
                'DeductionAmount': table4.Deduction_amount,
                'FinalAllowance': table4.Allowancefinal,
                'PfForEmployee': table4.PfForEmployee,
                'SecurityDeposite': table4.SecurityDeposite,
                'AccountHolderName': table4.AccountHolderName,
                'AccountNumber': table4.AccountNumber,
                'BankName': table4.BankName,
                'Branch': table4.Branch,
                'IfscCode': table4.IfscCode,
                'PanNumber': table4.PanNumber,
                'UploadCsvFile': get_file_image(table4.UploadCsvFile, employee.pk, 'UploadCsvFile') if table4.UploadCsvFile else None,
                'Created_by': table4.created_by,
            })

        EmployeeDocument_Chicklist_Data =  Document_Checklist_Detials.objects.filter(Employee=employee.pk)

        for table5 in EmployeeDocument_Chicklist_Data:
            employee_data['EmployeeDocumentChecklist'].append({
                'id': table5.Employee.pk,
                'Resume': get_file_image(table5.Resume, employee.pk, 'Resume') if table5.Resume else None,
                'PanCard': get_file_image(table5.PanCard, employee.pk, 'PanCard') if table5.PanCard else None,
                'AadharCard': get_file_image(table5.AadharCard, employee.pk, 'AadharCard') if table5.AadharCard else None,
                'BankPassbook': get_file_image(table5.BankPassbook, employee.pk, 'BankPassbook') if table5.BankPassbook else None,
                'ExperienceCertificate': get_file_image(table5.ExperienceCertificate, employee.pk, 'ExperienceCertificate') if table5.ExperienceCertificate else None,
                'MedicalFitness': get_file_image(table5.MedicalFitness, employee.pk, 'MedicalFitness') if table5.MedicalFitness else None,
                'Offerletter': get_file_image(table5.Offerletter, employee.pk, 'Offerletter') if table5.Offerletter else None,
                'Created_by': table5.created_by,
            })

        EmployeeSkill_Data =  Employee_Skills_Detials.objects.filter(Employee=employee.pk)   

        for table6 in EmployeeSkill_Data:
            employee_data['EmployeeSkillset'].append({
                'id': table6.Employee.pk,
                'skill_name': table6.Skill,
                'skill_level': table6.Level,
                'Created_by': table6.created_by,
            })

        yield json.dumps(employee_data)
    yield ']'


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Employee_Registration_Details_Fetch(request):
    """Handle GET request to fetch all employee data with streaming."""
    if request.method == 'GET':
        try:
            # Optimize query with select_related and prefetch_related
            Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes').select_related(
                'Tittle', 'BloodGroup', 'Category', 'Speciality', 'Designation'
            ).prefetch_related(
                'Department',
                Prefetch('EmployeeHistory', queryset=Employeement_History_Detials.objects.all()),
                Prefetch('EmployeeMedicalInfo', queryset=Employee_Medical_Information_Detials.objects.all()),
                Prefetch('EmployeeCurrentDetails', queryset=Current_History_Detials.objects.all()),
                Prefetch('EmployeeLeavelist', queryset=Employee_Leavelist.objects.all()),
                Prefetch('EmployeeProbationDetails', queryset=EmployeeProbationDetails.objects.all()),
                Prefetch('EmployeeSecurityDeposit', queryset=EmployeeSecurityDeposit.objects.all()),
                Prefetch('EmployeeGratuityDetails', queryset=Employee_GratuityDetails.objects.all()),
                Prefetch('EmployeeAllowanceDetails', queryset=EmployeeAllowanceDetails.objects.filter(Status='Active')),
                Prefetch('EmployeeDeductionDetails', queryset=EmployeeDeductionDetails.objects.all()),
                Prefetch('EmployeeFinancialHistory', queryset=Financial_History_Detials.objects.all()),
                Prefetch('EmployeeDocument_Chicklist', queryset=Document_Checklist_Detials.objects.all()),
                Prefetch('EmployeeSkillset', queryset=Employee_Skills_Detials.objects.all())
            ).only(
                'pk', 'First_Name', 'Middle_Name', 'Last_Name', 'Tittle__Title_Name', 'Gender', 'DOB', 'Age',
                'BloodGroup__BloodGroup_Id', 'BloodGroup__BloodGroup_Name', 'Contact_Number', 'Alternate_Number',
                'E_mail', 'Qualification', 'SkillSet', 'IdProofType', 'IdProofNo', 'Marital_Status', 'MarriagePlan',
                'AnniversaryDate', 'Residence', 'FatherName', 'FatherContact', 'FatherWorking', 'FatherWorkPlace',
                'MotherName', 'MotherContact', 'MotherWorking', 'MotherWorkPlace', 'Spouse_Name', 'SpouseContact',
                'SpouseWorking', 'SpouseWorkPlace', 'Child', 'TotalNoChild', 'DoorNo', 'Street', 'Area', 'City',
                'District', 'State', 'Country', 'Pincode', 'PermanentAddressSameAsAbove', 'Category__Category_Name',
                'Speciality__Speciality_Name', 'Designation__Designation_Name', 'EmergencyContactName1',
                'EmergencyContactNo1', 'EmergencyContactName2', 'EmergencyContactNo2', 'ActiveStatus',
                'RequirementSource', 'Source', 'created_by', 'Photo', 'Signature',
                'CaptureImage', 'created_at'
            )

            # Apply filters
            DepartmentId = request.GET.get('deptid')
            SearchQuery = request.GET.get('SearchQuery')
            if DepartmentId:
                Employee_Personal_Info = Employee_Personal_Info.filter(Department__Department_Id__in=DepartmentId)
            if SearchQuery:
                Employee_Personal_Info = Employee_Personal_Info.filter(
                    Q(First_Name__icontains=SearchQuery) |
                    Q(Employee_ID__icontains=SearchQuery) |
                    Q(Existing_Employee_ID__icontains=SearchQuery) |
                    Q(Contact_Number__icontains=SearchQuery)
                )

            # Stream response
            response = StreamingHttpResponse(stream_employees(Employee_Personal_Info), content_type='application/json')
            return response

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)