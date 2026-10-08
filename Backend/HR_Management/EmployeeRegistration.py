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
from django.db.models import Q
from django.db import transaction
from datetime import datetime
from calendar import monthrange
from .serializers import *

from django.shortcuts import get_object_or_404
from django.http import JsonResponse

def get_employees_by_role(request):
    # Fetch the role object
    role = get_object_or_404(Role_Master, Role_Id=2)
    
    # Get all employees who have this role
    employees = Employee_Personal_Form_Detials.objects.filter(Role=role)
    
    # Prepare the data for JSON response
    employee_data = []
    for employee in employees:
        employee_data.append({
            'Employee_ID': employee.Employee_ID,
            'First_Name': employee.First_Name,
            'Last_Name': employee.Last_Name,
            'Gender': employee.Gender,
            'DOB': employee.DOB,
            'E_mail': employee.E_mail,
            'Role': employee.Role.Role_Name,  # Access the Role's name
            # Add any other fields that you need
        })
    
    # Return the response as JSON
    return JsonResponse(employee_data, safe=False)


def get_employees_by_role1(request):
    # Fetch the role object
    role = get_object_or_404(Role_Master, Role_Id=5)
    
    # Get all employees who have this role
    employees = Employee_Personal_Form_Detials.objects.filter(Role=role)
    
    # Prepare the data for JSON response
    employee_data = []
    for employee in employees:
        employee_data.append({
            'Employee_ID': employee.Employee_ID,
            'First_Name': employee.First_Name,
            'Last_Name': employee.Last_Name,
            'Gender': employee.Gender,
            'DOB': employee.DOB,
            'E_mail': employee.E_mail,
            'Role': employee.Role.Role_Name,  # Access the Role's name
            # Add any other fields that you need
        })
    
    # Return the response as JSON
    return JsonResponse(employee_data, safe=False)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Employee_Registration_Details(request):
    
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
            data = json.loads(request.body)

            # print(data,'dataaa')
            
            # Extract and validate data
            Existing_Employee_ID = data.get('Existing_Employee_ID','')
            Title = data.get('Title','')
            FirstName = data.get('FirstName','')
            MiddleName = data.get('MiddleName','')
            SurName = data.get('SurName','')
            Gender = data.get('gender','')
            Dob = data.get('dob','')
            Age = data.get('Age','')
            BloodGroup = data.get('bloodgroup','')
            Phone = data.get('phone','')
            AlternatePhone = data.get('alternatePhone','')
            Email = data.get('email','')
            Qualification = data.get('qualification','')
            SkillSet = data.get('SkillSet','')
            IdProofType = data.get('IdProofType','')
            IdProofNo = data.get('IdProofNo','')
            maritalStatus = data.get('maritalStatus','')
            MarriagePlan = data.get('MarriagePlan','')
            AnniversaryDate = data.get('AnniversaryDate','')
            Residence = data.get('Residence','')
            FatherName = data.get('FatherName','')
            FatherContact = data.get('FatherContact','')
            FatherWorking = data.get('FatherWorking','')
            FatherWorkPlace = data.get('FatherWorkPlace','')
            MotherName = data.get('MotherName','')
            MotherContact = data.get('MotherContact','')
            MotherWorking = data.get('MotherWorking','')
            MotherWorkPlace = data.get('MotherWorkPlace','')
            SpouseName = data.get('SpouseName','')
            SpouseContact = data.get('SpouseContact','')
            SpouseWorking = data.get('SpouseWorking','')
            SpouseWorkPlace = data.get('SpouseWorkPlace','')
            Child = data.get('Child','')
            TotalNoChild = data.get('TotalNoChild','')
            DoorNo = data.get('doorNo','')
            Street = data.get('Street','')
            Area = data.get('Area','')
            City = data.get('City','')
            District = data.get('District','')
            State = data.get('State','')
            Country = data.get('Country','')
            Pincode = data.get('Pincode','')
            PermanentAddressSameAsAbove = data.get('PermanentAddressSame','')
            PermanentDoorNo = data.get('PermanentdoorNo','')
            PermanentStreet = data.get('PermanentStreet','')
            PermanentArea = data.get('PermanentArea','')
            PermanentCity = data.get('PermanentCity','')
            PermanentDistrict = data.get('PermanentDistrict','')
            PermanentState = data.get('PermanentState','')
            PermanentCountry = data.get('PermanentCountry','')
            PermanentPincode = data.get('PermanentPincode','')            
            EmergencyContactName1 = data.get('EmergencyContactName1','')
            EmergencyContactNo1 = data.get('EmergencyContactNo1','')
            EmergencyContactName2 = data.get('EmergencyContactName2','')
            EmergencyContactNo2 = data.get('EmergencyContactNo2','')
            status = True
            Photo = data.get('Photo', None)
            CaptureImage = data.get('CaptureImage', None)
            ActiveStatus = data.get('ActiveStatus', '')
            RequirementSource = data.get('RequirementSource', '')
            Source = data.get('Source', '')

            Employee_Percentage = data.get('Employee_Percentage', 0)
            Employer_Percentage = data.get('Employer_Percentage', 0)
            Employer_PF_amount = data.get('Employer_PF_amount', 0)
            Employee_PF_amount = data.get('Employee_PF_amount', 0)
            ESI_Amount = data.get('ESI_Amount', 0)
            ESINumber = data.get('ESINumber', '')
            PFNumber = data.get('PFNumber', '')
            ESI_is_applicable = data.get("ESI_is_applicable",False)
            ESI_Percentage = data.get("ESI_Percentage",0)

            PreExistingMedicalCondition = data.get('PreExistingMedicalCondition', '')
            PsychiatricMedicines = data.get('PsychiatricMedicines', '')
            PsychiatricMedicinesDetails = data.get('PsychiatricMedicinesDetails', '')
            PreviousOperation = data.get('PreviousOperation', '')
            SurgeriesDetails = data.get('SurgeriesDetails', '')
            VaccinationStatus = data.get('VaccinationStatus', '')
            VaccinationStatusDetails = data.get('VaccinationStatusDetails', '')
            MedicalFitnessCertificate = data.get('MedicalFitnessCertificate', None)
            AnnualMedicalCheckup = data.get('AnnualMedicalCheckup', None)
            PreviousWorkPFNumber = str(data.get('PreviousPfnumber', '')).strip()
            PreviousWorkESINumber = str(data.get('PreviousESInumber', '')).strip()
            # PFNumber = str(data.get('PFnumber', '')).strip()
            # ESINumber = str(data.get('ESInumber', '')).strip()
            PreviousWorkExperience = str(data.get('PreviousWorkExperience', '')).strip()

        
            NoOfYears = data.get('NoOfYears', '')
            WorkStationNameAddress = data.get('WorkStationNameAddress', '')
            WorkStationPhoneNo = data.get('WorkStationPhoneNo', '')
            ReasonForLeft = data.get('ReasonForLeft', '')
            ConfirmedBy = data.get('ConfirmedBy', '')
            EmployeePaySlip = data.get('EmployeePaySlip', None)
            EmployeeOfferLetter = data.get('EmployeeOfferLetter', None)
            EmployeeReliveLetter = data.get('EmployeeReliveLetter', None)
           
            DateOfJoining = data.get('DateOfJoining', '')
            Classification = data.get('Classification','')
            Role = data.get('Role','')
            DepartmentId = data.get('DepartmentId',"")
            DepartmentId= DepartmentId.split(', ') if DepartmentId else None
            Category = data.get('Category', '')
            Speciality = data.get('Speciality', '')
            
            Designation = data.get('Designation', '')
            Locations = data.get('Locations', '')
            WorkEmail = data.get('WorkEmail', '')
            ReportingManager = data.get('ReportingManager', '')
            GovtLeave = data.get('GovtLeave', '')
            CasualLeave = data.get('CasualLeave', '')
            SickLeave = data.get('SickLeave', '')
            TotalLeave1 = data.get('TotalLeave', 0)
            
            # 19-2-25
            leave_list = data.get('leavesList1','')
            
            
            
            # 17-2-25
            is_on_probation = data.get('is_on_probation', False)
            probation_start_date = data.get('probation_start_date', "")
            probation_end_date = data.get('probation_end_date', "")
            probation_periods = data.get('probation_periods', 0)
            months_completed = data.get('months_completed', 0)
            ProbationStatus = data.get('ProbationStatus', "select")
            ExtendedDate = data.get('ExtendedDate', "")
            ExtendedMonths = data.get('ExtendedMonths', 0)
            TerminatedDate = data.get('TerminatedDate', 0)
            confirmation_date = data.get('confirmation_date', "")
            confidential_review_form = data.get('confidential_review_form', None)
            hod_review_form = data.get('hod_review_form', None)
            hr_review_form = data.get('hr_review_form', None)
            TrainingGivenBy = data.get('TrainingGivenBy', "")
            TrainingVerifiedBy = data.get('TrainingVerifiedBy', "")
            TrainingCompletedDate = data.get('TrainingCompletedDate', "")
            #
            requires_security_deposit = data.get('requiresSecurityDeposit', False)
            security_start_date = data.get('security_start_date', "")
            security_end_date = data.get('security_end_date', "")
            total_security_amount = data.get('total_security_amount', 0)
            # monthly_security_deposit_amount = data.get('monthly_securityDeposit_amount', 0)
            security_pending_months = data.get('Security_pending_months', 0)
            security_installment_count = data.get('Security_installment_count', 0)
            security_months_paid = data.get('Security_months_paid', 0)
            security_months_to_be_scheduled = data.get('Security_months_to_be_scheduled', 0)
            

            #
            require_gratuity = data.get('requireGratuity', False)
            gratuity_start_date = data.get('gratuity_start_date', "")
            total_gratuity_amount = data.get('total_gratuity_amount', 0)
            monthly_gratuity_amount = data.get('monthly_Gratuity_amount', 0)
            gratuity_pending_months = data.get('Gratuity_pending_months', 0)
            gratuity_installment_count = data.get('Gratuity_installment_count', 0)
            # gratuity_months_paid = data.get('Gratuity_months_paid', 0)
            gratuity_months_to_be_scheduled = data.get('Gratuity_months_to_be_scheduled', 0)
      
            ctc = data.get('ctc',0)
            # allowances details
            allowances = data.get('allowances',[])
            print(allowances,'alklkjn')
            deductions = data.get('deductions','')
            
            allowance_amount = data.get('AllowanceAmount','')
            deduction_amount = data.get('DeductionAmount',0)
            PF_is_applicable = data.get('PF_is_applicable',False)
            PF_amount=data.get('PF_amount','')
            
            net_salary = data.get('net_salary',0)

            TDS_Amount = data.get('TDS_Amount',0)
            TDS_Percentage = data.get('TDS_Percentage',0)
            TDS_is_applicable = data.get('TDS_is_applicable',False)

            basicSalaryPercent = data.get('basicSalaryPercent',0)

            print('errrrrrrrrrr')

# AllowanceAmount  DeductionAmount

            IsPF_Applicable = data.get('IsPF_Applicable',0)
            print("IsPF_Applicable",IsPF_Applicable)
   
            BasicSalarystr = data.get('BasicSalary', 0)
            BasicSalary = float(BasicSalarystr) if BasicSalarystr != '' else 0
 
            Salarystr = data.get('Salary', 0)
            Salary = float(Salarystr) if Salarystr !='' else 0
            
            PF_amountstr=data.get('PF_amount',0)
            PF_amount = float(PF_amountstr) if PF_amountstr != '' else 0

            strAllowance = data.get('Allowance', 0)
            Allowance = float(strAllowance) if strAllowance != '' else 0

          
            FinalAllowancestr = data.get('FinalAllowance',0)
            FinalAllowance = float(FinalAllowancestr) if FinalAllowancestr !='' else 0
            
            PfForEmployeestr = data.get('PfForEmployee', 0) 
            print("bharathi",PfForEmployeestr)

            SecurityDepositestr = data.get('SecurityDeposite', 0)
            SecurityDeposite = float(SecurityDepositestr) if SecurityDepositestr !='' else 0

      
            AccountHolderName = data.get('AccountHolderName', '')
            AccountNumber = data.get('AccountNumber', '')
            BankName = data.get('BankName', '')
            Branch = data.get('Branch', '')
            IfscCode = data.get('IfscCode', '')
            PanNumber = data.get('PanNumber', '')
            UploadCsvFile = data.get('UploadCsvFile', None)

            Resume = data.get('Resume', None)
            PanCard = data.get('PanCard', None)
            AadharCard = data.get('AadharCard', None)
            BankPassbook = data.get('BankPassbook', None)
            ExperienceCertificate = data.get('ExperienceCertificate', None)
            MedicalFitness = data.get('MedicalFitness', None)
            Offerletter = data.get('Offerletter', None)
            Signature = data.get('Signature', None)
            created_by = data.get('Createdby', '')
            Location = data.get('Location', '')
            Employee_Id = data.get('Employee_Id', '')
            
            location_instance = Location_Detials.objects.get(Location_Id=Location) if Location else None
            Emp_location_instance = Location_Detials.objects.get(Location_Id=Locations) if Locations else None
            Title_instance = Title_Detials.objects.get(Title_Id=Title) if Title else None
            BloodGroup_instance = BloodGroup_Detials.objects.get(BloodGroup_Id=BloodGroup) if BloodGroup else None
            Classification_instance = Classification_Detials.objects.get(pk=Classification) if Classification else None
            Role_instance = Role_Master.objects.get(pk=Role) if Role else None
            Designation_instance = Designation_Detials.objects.get(pk=Designation) if Designation else None
            Speciality_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
            Category_instance = Category_Detials.objects.get(pk=Category) if Category else None

            Department_instance =None

            Uppercase_name = f'{Title_instance.Title_Name.upper()} {FirstName.upper()} {MiddleName.upper()} {SurName.upper()} '

        
            print('DepartmentId11111',DepartmentId)
            if DepartmentId and DepartmentId not in ['null', 'undefined','']:
                print('DepartmentId222222',DepartmentId)
                Department_instance = Department_Detials.objects.filter(Department_Id__in = DepartmentId)
                print('Department_instance111111',Department_instance)    


            # if IsPF_Applicable == True:
            #     PfForEmployee = float(PfForEmployeestr) if PfForEmployeestr else 0
            # elif IsPF_Applicable == False:
                
                PfForEmployee = 0.0  # Set to 0 when PF is not applicable
 
                

            
            CaptureImageDocument = validate_and_process_file(CaptureImage) if Photo  else None

            PhotoChooseDocument = validate_and_process_file(Photo) if Photo  else None
            MedicalFitnessCertificateDocument = validate_and_process_file(MedicalFitnessCertificate) if MedicalFitnessCertificate  else None
            AnnualMedicalCheckupDocument = validate_and_process_file(AnnualMedicalCheckup) if AnnualMedicalCheckup  else None
            EmployeePaySlipDocument = validate_and_process_file(EmployeePaySlip) if EmployeePaySlip  else None
            EmployeeOfferLetterDocument = validate_and_process_file(EmployeeOfferLetter) if EmployeeOfferLetter  else None
            EmployeeReliveLetterDocument = validate_and_process_file(EmployeeReliveLetter) if EmployeeReliveLetter  else None
            UploadCsvFileDocument = validate_and_process_file(UploadCsvFile) if UploadCsvFile  else None
            # 17-2-25

            confidential_review_form = validate_and_process_file(confidential_review_form) if confidential_review_form else None
            hod_review_form = validate_and_process_file(hr_review_form) if hr_review_form else None
            hr_review_form = validate_and_process_file(hr_review_form) if hr_review_form else None

            ResumeDocument = validate_and_process_file(Resume) if Resume  else None
            PanCardDocument = validate_and_process_file(PanCard) if PanCard  else None
            AadharCardDocument = validate_and_process_file(AadharCard) if AadharCard  else None
            BankPassbookDocument = validate_and_process_file(BankPassbook) if BankPassbook  else None
            ExperienceCertificateDocument = validate_and_process_file(ExperienceCertificate) if ExperienceCertificate  else None
            MedicalFitnessDocument = validate_and_process_file(MedicalFitness) if MedicalFitness  else None
            OfferletterDocument = validate_and_process_file(Offerletter) if Offerletter  else None
            SignatureDocument = validate_and_process_file(Signature) if Signature  else None
            
            with transaction.atomic():
                if Employee_Id:

                    print(Employee_Id,'Employee_Iderrrrrrrrrr')
                   

                    Employee = Employee_Personal_Form_Detials.objects.filter(Employee_ID=Employee_Id).first()

                    print(Employee,'Employee111111111')
                     
                    if not Employee:
                        return JsonResponse({'warn': f"The Employee Id is not valid"})

                    # if Employee_Personal_Form_Detials.objects.filter(First_Name=FirstName,Contact_Number=Phone).exclude(Employee_ID=Employee_Id).exists():
                        # Employee =  Employee_Personal_Form_Detials.objects.filter(First_Name=FirstName,Contact_Number=Phone).first()    
                        # return JsonResponse({'warn': f"The Employee {Employee.Employee_ID} is already registered with {Phone} and {FirstName}"})

                    Employee =  Employee_Personal_Form_Detials.objects.get(Employee_ID=Employee_Id)
                  
                    print(Employee,'Employeellllllllllllll')

                    try:
                        Employee.Existing_Employee_ID = Existing_Employee_ID
                        Employee.Tittle = Title_instance
                        Employee.First_Name = FirstName
                        Employee.Middle_Name = MiddleName
                        Employee.Last_Name = SurName
                        Employee.Gender = Gender
                        Employee.DOB = Dob
                        Employee.Age = Age
                        Employee.BloodGroup = BloodGroup_instance
                        Employee.Contact_Number = Phone
                        Employee.Alternate_Number = AlternatePhone
                        Employee.E_mail = Email
                        Employee.Qualification = Qualification
                        # Employee.SkillSet = SkillSet
                        Employee.IdProofType = IdProofType
                        Employee.IdProofNo = IdProofNo
                        Employee.Marital_Status = maritalStatus
                        Employee.MarriagePlan = MarriagePlan
                        Employee.AnniversaryDate = AnniversaryDate
                        Employee.Residence = Residence
                        Employee.FatherName = FatherName
                        Employee.FatherContact = FatherContact
                        Employee.FatherWorking = FatherWorking
                        Employee.FatherWorkPlace = FatherWorkPlace
                        Employee.MotherName = MotherName
                        Employee.MotherContact = MotherContact
                        Employee.MotherWorking = MotherWorking
                        Employee.MotherWorkPlace = MotherWorkPlace
                        Employee.Spouse_Name = SpouseName
                        Employee.SpouseContact = SpouseContact
                        Employee.SpouseWorking = SpouseWorking
                        Employee.SpouseWorkPlace = SpouseWorkPlace
                        Employee.Child = Child
                        Employee.TotalNoChild = TotalNoChild
                        Employee.DoorNo = DoorNo
                        Employee.Street = Street
                        Employee.Area = Area
                        Employee.City = City
                        Employee.District = District
                        Employee.State = State
                        Employee.Country = Country
                        Employee.Pincode = Pincode
                        Employee.PermanentAddressSameAsAbove = PermanentAddressSameAsAbove
                        Employee.PermanentDoorNo = PermanentDoorNo
                        Employee.PermanentStreet = PermanentStreet
                        Employee.PermanentArea = PermanentArea
                        Employee.PermanentCity = PermanentCity
                        Employee.PermanentDistrict = PermanentDistrict
                        Employee.PermanentState = PermanentState
                        Employee.PermanentCountry = PermanentCountry
                        Employee.PermanentPincode = PermanentPincode
                        Employee.EmergencyContactName1 = EmergencyContactName1
                        Employee.EmergencyContactNo1 = EmergencyContactNo1
                        Employee.EmergencyContactName2 = EmergencyContactName2
                        Employee.EmergencyContactNo2 = EmergencyContactNo2
                        Employee.Photo = PhotoChooseDocument
                        Employee.CaptureImage = CaptureImageDocument
                        Employee.ActiveStatus = ActiveStatus
                        Employee.RequirementSource = RequirementSource
                        Employee.Source = Source
                        Employee.Status = status
                    
                        Employee.Location = location_instance
                        Employee.Category = Category_instance
                        Employee.Speciality = Speciality_instance
                        Employee.Classification = Classification_instance
                        Employee.Role = Role_instance
                        Employee.Designation = Designation_instance
                        Employee.created_by = created_by
                        Employee.Signature = SignatureDocument
                        Employee.save()
                    except Exception as e:
                        return JsonResponse({'err':str(e)})
                    if Department_instance:

                        Employee.Department.set(Department_instance)


                    # 19-2-25
                    print("on procee one ")
                    leave_objects_to_create = []
                    for leave in leave_list:
                          leave_type = leave.get("leaveType")
                          leave_count = leave.get("numLeaves")
                          print(f"the procee : {leave_type}...{leave_count}")
                          if leave_type and leave_count is not None:
        # Fetch the EmployeeLeaveList for the employee with the same leave type
                               employee_leave = Employee_Leavelist.objects.filter(Employee=Employee, leave_type=leave_type).first()

                               if employee_leave:
            # Update the leave count for existing leave
                                  employee_leave.leave_type = leave_type
                                  employee_leave.leave_count = leave_count
                                  employee_leave.save()
                               else:
            # If the leave type does not exist, create a new leave record
                                   leave_objects_to_create.append(
                                    Employee_Leavelist(
                                    Employee=Employee,
                                    leave_type=leave_type,
                                    leave_count=leave_count,
                                    )
                                  )

             # Bulk create new leave entries
                          if leave_objects_to_create:
                            Employee_Leavelist.objects.bulk_create(leave_objects_to_create)

             

                    
                    skill_objects_to_create = []
                    for skill in SkillSet:
                        skill_name = skill.get("name")
                        skill_level = skill.get("level")

                        if skill_name and skill_level:
                            # Fetch the EmployeeSkillSets for the employee with the same skill name
                            employee_skill = Employee_Skills_Detials.objects.filter(Employee=Employee, Skill=skill_name).first()

                            if employee_skill:
                                # Update the skill level for existing skill
                                employee_skill.Level = skill_level
                                employee_skill.created_by = created_by
                                employee_skill.save()
                            else:
                                # If the skill does not exist, create a new skill record
                                skill_objects_to_create.append(Employee_Skills_Detials(Employee=Employee, Skill=skill_name, Level=skill_level, created_by=created_by))

                    # Bulk create new skill entries
                        if skill_objects_to_create:
                             Employee_Skills_Detials.objects.bulk_create(skill_objects_to_create)
                    
                    
                    
                    
                    allowance_objects_to_create = []
    
             
                    for allowance in allowances:
                        allowance_name = allowance.get("allowance_name")
                        allowance_percent = allowance.get("allowance_percentage")
                        allowance_amount=allowance.get("allowance_amount")
                        print('allowance amount',allowance_amount)
                        if allowance_name and allowance_percent:
                            employee_allowance = EmployeeAllowanceDetails.objects.filter(Employee=Employee,allowance=allowance_name).first()
                            
                            if employee_allowance:
                                employee_allowance.percentage=allowance_percent
                                print('allownce amount',allowance_amount)
                                employee_allowance.amount=allowance_amount
                                employee_allowance.save()
                            else:
                                allowance_objects_to_create.append(EmployeeAllowanceDetails(Employee=Employee,allowance=allowance_name, percentage=allowance_percent,amount=allowance_amount))
                             
                        if allowance_objects_to_create:
                            EmployeeAllowanceDetails.objects.bulk_create(allowance_objects_to_create)
                    
                    deduction_objects_to_create = []
                    
                    for deduction in deductions:
                        deduction_name = deduction.get("deduction_name")
                        deduction_amount =deduction.get("deduction_amount")
                        if deduction_name and deduction_amount:
                           employee_deduction = EmployeeDeductionDetails.objects.filter(Employee=Employee,deduction=deduction_name).first()
                           if employee_deduction :
                               employee_deduction.amount=deduction_amount
                               employee_deduction.save()
                           else:
                               deduction_objects_to_create.append(EmployeeDeductionDetails(Employee=Employee,deduction=deduction_name,amount =deduction_amount))
                        if deduction_objects_to_create:
                            EmployeeDeductionDetails.objects.bulk_create(deduction_objects_to_create)
                                   
                          
                        
                    
                    
                    EmployeeHistory = Employeement_History_Detials.objects.get(Employee__pk = Employee_Id)
                    EmployeeHistory.PreviousWorkExperience = PreviousWorkExperience
                    EmployeeHistory.PreviousWorkPFNumber=PreviousWorkPFNumber
                    EmployeeHistory.PreviousWorkESINumber=PreviousWorkESINumber
                    EmployeeHistory.PFNumber=PFNumber
                    EmployeeHistory.ESINumber=ESINumber
                    EmployeeHistory.NoOfYears = NoOfYears
                    EmployeeHistory.WorkStationNameAddress = WorkStationNameAddress
                    EmployeeHistory.ReasonForLeft = ReasonForLeft
                    EmployeeHistory.WorkStationPhoneNo = WorkStationPhoneNo
                    EmployeeHistory.EmployeePaySlip = EmployeePaySlipDocument
                    EmployeeHistory.EmployeeOfferLetter = EmployeeOfferLetterDocument
                    EmployeeHistory.EmployeeReliveLetter = EmployeeReliveLetterDocument
                    EmployeeHistory.ConfirmedBy = ConfirmedBy
                    EmployeeHistory.Location = location_instance
                    EmployeeHistory.created_by = created_by
                    EmployeeHistory.save()

                    EmpMedicalInfo = Employee_Medical_Information_Detials.objects.get(Employee__pk = Employee_Id)
                    EmpMedicalInfo.PreExisiting_Medical_Condition = PreExistingMedicalCondition
                    EmpMedicalInfo.PsychiatricMedicines = PsychiatricMedicines
                    EmpMedicalInfo.PsychiatricMedicinesDetails = PsychiatricMedicinesDetails
                    EmpMedicalInfo.PreviousOperation = PreviousOperation
                    EmpMedicalInfo.SurgeriesDetails = SurgeriesDetails
                    EmpMedicalInfo.VaccinationStatus = VaccinationStatus
                    EmpMedicalInfo.VaccinationStatusDetails = VaccinationStatusDetails
                    EmpMedicalInfo.MedicalFitnessCertificate = MedicalFitnessCertificateDocument
                    EmpMedicalInfo.AnnualMedicalCheckup = AnnualMedicalCheckupDocument
                    EmpMedicalInfo.Location = location_instance
                    EmpMedicalInfo.created_by = created_by
                    EmpMedicalInfo.save()

                    EmpCurrentHistory = Current_History_Detials.objects.get(Employee__pk = Employee_Id)
                    EmpCurrentHistory.DateOfJoining = DateOfJoining
                    EmpCurrentHistory.CurrentEmployeementLocations = Emp_location_instance
                    EmpCurrentHistory.ReportingManager = ReportingManager
                    EmpCurrentHistory.GovtLeave = GovtLeave
                    EmpCurrentHistory.CasualLeave = CasualLeave
                    EmpCurrentHistory.SickLeave = SickLeave
                    EmpCurrentHistory.TotalLeave = TotalLeave1
                    EmpCurrentHistory.WorkEmail = WorkEmail
                    # EmpCurrentHistory.IsPF_Applicable=IsPF_Applicable
                    EmpCurrentHistory.Location = location_instance
                    EmpCurrentHistory.created_by = created_by
                    EmpCurrentHistory.save()


                    # 17-2-25

                    
                    
                    EmpProbation = EmployeeProbationDetails.objects.get(Employee__pk=Employee_Id)
                    EmpProbation.is_on_probation = is_on_probation
                    EmpProbation.probation_start_date = probation_start_date
                    EmpProbation.probation_end_date = probation_end_date
                    EmpProbation.probation_periods = probation_periods
                    EmpProbation.months_completed = months_completed
                    EmpProbation.probation_status = ProbationStatus
                    EmpProbation.extended_date = ExtendedDate
                    EmpProbation.extended_months=ExtendedMonths
                    EmpProbation.terminated_date = TerminatedDate
                    EmpProbation.confirmation_date = confirmation_date
                    EmpProbation.confidential_review_form = confidential_review_form
                    EmpProbation.hod_review_form = hod_review_form
                    EmpProbation.hr_review_form = hr_review_form
                    EmpProbation.training_given_by = TrainingGivenBy
                    EmpProbation.training_verified_by = TrainingVerifiedBy
                    EmpProbation.training_completed_date = TrainingCompletedDate
                   
                    EmpProbation.save()

                   #
                   
                    SecurityDepositInstance = EmployeeSecurityDeposit.objects.get(Employee__pk=Employee_Id)

                    SecurityDepositInstance.requires_security_deposit = requires_security_deposit
                    SecurityDepositInstance.security_start_date = security_start_date
                    SecurityDepositInstance.security_end_date = security_end_date 
                    SecurityDepositInstance.total_security_amount = total_security_amount
                    # SecurityDepositInstance.monthly_security_deposit_amount = monthly_security_deposit_amount
                    SecurityDepositInstance.security_pending_months = security_pending_months
                    SecurityDepositInstance.security_installment_count = security_installment_count
                    SecurityDepositInstance.security_months_paid = security_months_paid
                    SecurityDepositInstance.security_months_to_be_scheduled = security_months_to_be_scheduled
                  


                    SecurityDepositInstance.save()
                    
                    # Assuming `data` is a dictionary with the input data
                    employee_gratuity_instance = Employee_GratuityDetails.objects.get(Employee__pk=Employee_Id)

                    

                    employee_gratuity_instance.require_gratuity=require_gratuity
                    employee_gratuity_instance.gratuity_start_date=gratuity_start_date
                    # gratuity_end_date=gratuity_end_date
                    employee_gratuity_instance.total_gratuity_amount=total_gratuity_amount
                    employee_gratuity_instance.monthly_gratuity_amount=monthly_gratuity_amount
                    employee_gratuity_instance.gratuity_pending_months=gratuity_pending_months
                    employee_gratuity_instance.gratuity_installment_count=gratuity_installment_count
                    # gratuity_months_paid=gratuity_months_paid
                    employee_gratuity_instance.gratuity_months_to_be_scheduled=gratuity_months_to_be_scheduled
                                         

                    employee_gratuity_instance.save()


                
                    EmpFinancialHistory = Financial_History_Detials.objects.filter(Employee__pk = Employee_Id).first()
                    
                    oldsalarydetails = Salary_Maintenance_Detials.objects.filter(Employee=Employee,Status='Active')
                    last_salary_record = Salary_Maintenance_Detials.objects.filter(
                                    Employee=Employee, Status='Active'
                                ).order_by('-created_at').first()
                    
                    for oldsal in oldsalarydetails:

                        oldsal.Status = 'InActive'
                        oldsal.save()

                    New_sal = None
                    print('emp1')
                    try:    

                      New_sal = Salary_Maintenance_Detials(

                        Employee = EmpFinancialHistory.Employee,
                        EmployeementHistory = EmpFinancialHistory.EmployeementHistory,
                        EmployeeMedicalInfo = EmpFinancialHistory.EmployeeMedicalInfo,
                        EmployeeCurrentHistoryInfo = EmpFinancialHistory.EmployeeCurrentHistoryInfo,
                        BasicSalary = BasicSalary,
                        ctc = ctc,
                    
                        AccountHolderName = AccountHolderName,
                        AccountNumber = AccountNumber,
                        BankName = BankName,
                        Branch = Branch,
                        IfscCode = IfscCode,
                        PanNumber = PanNumber,
                        created_by = created_by,
                        Location = last_salary_record.Location
                        )
                    
                      New_sal.save()

                    except Exception as e:
                        return JsonResponse({'err':str(e)})
                     


                
                    EmpDocuments = Document_Checklist_Detials.objects.get(Employee__pk = Employee_Id)
                    EmpDocuments.Resume = ResumeDocument 
                    EmpDocuments.PanCard = PanCardDocument 
                    EmpDocuments.AadharCard = AadharCardDocument 
                    EmpDocuments.BankPassbook = BankPassbookDocument 
                    EmpDocuments.ExperienceCertificate = ExperienceCertificateDocument 
                    EmpDocuments.MedicalFitness = MedicalFitnessDocument 
                    EmpDocuments.Offerletter = OfferletterDocument 
                    EmpDocuments.Location = location_instance 
                    EmpDocuments.created_by = created_by
                    EmpDocuments.save() 

                    return JsonResponse({'success': 'Employee Details updated successfully'})
                    
                else:
                    print("987")

                    Employee_instance = Employee_Personal_Form_Detials(
                    
                        Existing_Employee_ID = Existing_Employee_ID,
                        Tittle=Title_instance,
                        First_Name=FirstName,
                        Middle_Name=MiddleName,
                        Last_Name=SurName,
                        Gender=Gender,
                        DOB=Dob,
                        Age=Age,
                        BloodGroup=BloodGroup_instance,
                        Contact_Number=Phone,
                        Alternate_Number=AlternatePhone,
                        E_mail=Email,
                        Qualification=Qualification,
                        # SkillSet=SkillSet,
                        IdProofType=IdProofType,
                        IdProofNo=IdProofNo,
                        Marital_Status=maritalStatus,
                        MarriagePlan=MarriagePlan,
                        AnniversaryDate=AnniversaryDate,
                        Residence=Residence,
                        FatherName=FatherName,
                        FatherContact=FatherContact,
                        FatherWorking=FatherWorking,
                        FatherWorkPlace=FatherWorkPlace,
                        MotherName=MotherName,
                        MotherContact=MotherContact,
                        MotherWorking=MotherWorking,
                        MotherWorkPlace=MotherWorkPlace,
                        Spouse_Name=SpouseName,
                        SpouseContact=SpouseContact,
                        SpouseWorking=SpouseWorking,
                        SpouseWorkPlace=SpouseWorkPlace,
                        Child=Child,
                        TotalNoChild=TotalNoChild,
                        DoorNo=DoorNo,
                        Street=Street,
                        Area=Area,
                        City=City,
                        District=District,
                        State=State,
                        Country=Country,
                        Pincode=Pincode,
                        PermanentAddressSameAsAbove=PermanentAddressSameAsAbove,
                        PermanentDoorNo=PermanentDoorNo,
                        PermanentStreet=PermanentStreet,
                        PermanentArea=PermanentArea,
                        PermanentCity=PermanentCity,
                        PermanentDistrict=PermanentDistrict,
                        PermanentState=PermanentState,
                        PermanentCountry=PermanentCountry,
                        PermanentPincode=PermanentPincode,
                        EmergencyContactName1=EmergencyContactName1,
                        EmergencyContactNo1=EmergencyContactNo1,
                        EmergencyContactName2=EmergencyContactName2,
                        EmergencyContactNo2=EmergencyContactNo2,
                        Photo=PhotoChooseDocument,
                        CaptureImage=CaptureImageDocument,
                        ActiveStatus=ActiveStatus,
                        RequirementSource=RequirementSource,
                        Source=Source,
                        Status=status,
                        Classification = Classification_instance,
                        Role = Role_instance,
                        Location=location_instance,
                        Category=Category_instance,
                        Speciality=Speciality_instance,
                        LedgerName=Uppercase_name,
                        LedgerGroupName=Finance_GroupMaster_Detailes.objects.get(pk=22),
                        OpeningBalance=0,
                        DebitOrCredit='Dr',
 
                       
                        Designation=Designation_instance,
                        created_by=created_by,
                        Signature=SignatureDocument,
                    )
                    Employee_instance.save()
                    print('vvvvvvveeeeee')
                    print('kkkkk-----',Department_instance)
                    Employee_instance.Department.set(Department_instance)
                    print("check2")
                    for skill in SkillSet:
                        skill_name = skill.get("name")
                        skill_level = skill.get("level")

                        if skill_name and skill_level:  # Ensure both fields are provided
                            Employee_Skills_Detials.objects.create(
                                Employee=Employee_instance,
                                Skill=skill_name,
                                Level=skill_level,
                                created_by=created_by
                            )
                            
                    for leave in leave_list:
                      leave_type = leave.get("leaveType")
                      leave_count = leave.get("numLeaves")

                      if leave_type and leave_count is not None:  # Ensure both fields are provided
                         Employee_Leavelist.objects.create(
                         Employee=Employee_instance,
                          leave_type=leave_type,
                          leave_count=leave_count
                           )
                    print("97987guihhj")
                    print(Employee_instance)
                    created_allowances = []     
                    for allowance in allowances:
                        allowance_name = allowance.get("allowance_name")
                        allowance_percent = allowance.get("allowance_percentage")
                        allowance_amount=allowance.get("allowance_amount")
                        print('allowance amount',allowance_amount)
    
                        if allowance_name and allowance_percent is not None:  # Ensure both fields are provided
        # Make sure to reference the correct field names for the model
                              allowance_instance  = EmployeeAllowanceDetails.objects.create(
                                Employee=Employee_instance,  # Foreign key reference
                               allowance=allowance_name,
                                percentage=allowance_percent,amount=allowance_amount,
                            )
                              created_allowances.append(allowance_instance)

                    print('cijbhiueuyew8789')        
                    for deduction in deductions:
                        deduction_name=deduction.get("deduction_name")
                        deduction_amount=deduction.get("deduction_amount")
                        if deduction_name and deduction_amount is not None:  # Ensure both fields are provided
                            EmployeeDeductionDetails.objects.create(
                                Employee=Employee_instance, 
                                deduction=deduction_name,
                                amount=deduction_amount
                            )
                            
                                

                    EmployeementHistory_instance = Employeement_History_Detials(
                        Employee=Employee_instance,
                        PreviousWorkExperience=PreviousWorkExperience,
                        PreviousWorkPFNumber=PreviousWorkPFNumber,
                        PreviousWorkESINumber=PreviousWorkESINumber,
                        PFNumber=PFNumber,
                        ESINumber=ESINumber,
                        NoOfYears=NoOfYears,
                        WorkStationNameAddress=WorkStationNameAddress,
                        ReasonForLeft=ReasonForLeft,
                        WorkStationPhoneNo=WorkStationPhoneNo,
                        EmployeePaySlip=EmployeePaySlipDocument,
                        EmployeeOfferLetter=EmployeeOfferLetterDocument,
                        EmployeeReliveLetter=EmployeeReliveLetterDocument,
                        ConfirmedBy=ConfirmedBy,
                        Location=location_instance,
                        created_by=created_by
                    )
                    EmployeementHistory_instance.save()

                    Employee_Medical_instance = Employee_Medical_Information_Detials(
                        EmployeementHistory = EmployeementHistory_instance,
                        Employee=Employee_instance,
                        PreExisiting_Medical_Condition = PreExistingMedicalCondition,   
                        PsychiatricMedicines = PsychiatricMedicines,
                        PsychiatricMedicinesDetails = PsychiatricMedicinesDetails,
                        PreviousOperation = PreviousOperation,
                        SurgeriesDetails = SurgeriesDetails,
                        VaccinationStatus = VaccinationStatus,
                        VaccinationStatusDetails = VaccinationStatusDetails,
                        MedicalFitnessCertificate = MedicalFitnessCertificateDocument,
                        AnnualMedicalCheckup = AnnualMedicalCheckupDocument,
                        Location = location_instance,
                        created_by = created_by
                    )
                    Employee_Medical_instance.save()

                    CurrentEmployee_History_instance = Current_History_Detials(
                        EmployeeMedicalInfo = Employee_Medical_instance,
                        EmployeementHistory = EmployeementHistory_instance,
                        Employee=Employee_instance,
                        DateOfJoining = DateOfJoining,
                        CurrentEmployeementLocations=Emp_location_instance,
                        ReportingManager=ReportingManager,
                        GovtLeave=GovtLeave,
                        CasualLeave=CasualLeave,
                        SickLeave=SickLeave,
                        TotalLeave=TotalLeave1,
                        WorkEmail=WorkEmail,
                        Location = location_instance,
                        created_by = created_by
                    )
                    CurrentEmployee_History_instance.save()
                    
                    # 17-2-25

                    employee_probation_instance = EmployeeProbationDetails(
                        Employee=Employee_instance,
                      is_on_probation = is_on_probation,
                     probation_start_date = probation_start_date,
                     probation_end_date = probation_end_date,
                     probation_periods = probation_periods,
                     months_completed = months_completed,
                     probation_status = ProbationStatus,
                     extended_date = ExtendedDate,
                     terminated_date = TerminatedDate,
                     confirmation_date = confirmation_date,
                     confidential_review_form = confidential_review_form,
                     hod_review_form = hod_review_form,
                     hr_review_form = hr_review_form,
                     training_given_by = TrainingGivenBy,
                     training_verified_by = TrainingVerifiedBy,
                     training_completed_date = TrainingCompletedDate,

                    )
                    employee_probation_instance.save()
                    
                    
                    security_deposit_instance = EmployeeSecurityDeposit(
                     Employee=Employee_instance,
                     requires_security_deposit=requires_security_deposit,
                     security_start_date=security_start_date,
                     security_end_date=security_end_date,
                     total_security_amount=total_security_amount,
                    #  monthly_security_deposit_amount=monthly_security_deposit_amount,
                     security_pending_months=security_pending_months,
                     security_installment_count=security_installment_count,
                     security_months_paid=security_months_paid,
                     security_months_to_be_scheduled=security_months_to_be_scheduled,
           
                    )

                   # Save the instance to the database
                    security_deposit_instance.save()
                    
                    gratuity_instance = Employee_GratuityDetails(
                        
                      Employee=Employee_instance,
                      require_gratuity = require_gratuity,
                      gratuity_start_date=gratuity_start_date,
                      total_gratuity_amount=total_gratuity_amount,
                      monthly_gratuity_amount =monthly_gratuity_amount,
                      gratuity_pending_months=gratuity_pending_months,
                      gratuity_installment_count=gratuity_installment_count,
                      gratuity_months_to_be_scheduled=gratuity_months_to_be_scheduled,
                         
                        
                    )   
                        
                    gratuity_instance.save()
                    Financial_History_instance = Financial_History_Detials(
                        EmployeeMedicalInfo = Employee_Medical_instance,
                        EmployeementHistory = EmployeementHistory_instance,
                        Employee=Employee_instance,
                        EmployeeCurrentHistoryInfo = CurrentEmployee_History_instance,
                        Salary = Salary,
                        BasicSalary = BasicSalary,
                        BasicSalary_Percentage = basicSalaryPercent,
                        Allowance_amount = allowance_amount,
                        Deduction_amount = deduction_amount,
                        Allowancefinal = FinalAllowance,
                        PF_amount = PF_amount,
                        Net_salary=net_salary,
                        ctc=ctc,
                        PF_is_applicable=PF_is_applicable,
                        PfForEmployee = PfForEmployee,
                        SecurityDeposite = SecurityDeposite,
                        AccountHolderName = AccountHolderName,
                        AccountNumber = AccountNumber,
                        BankName = BankName,
                        Branch = Branch,
                        IfscCode = IfscCode,
                        PanNumber = PanNumber,
                        UploadCsvFile = UploadCsvFileDocument,
                        Location = location_instance,
                        created_by = created_by,

                        PFNumber = PFNumber,
                        PF_EmployerPercentage = Employer_Percentage,
                        PF_EmployeePercentage = Employee_Percentage,
                        PF_EmployeeAmount = Employee_PF_amount,
                        PF_EmployerAmount = Employer_PF_amount,

                        ESINumber = ESINumber,
                        ESI_Percentage = ESI_Percentage,
                        ESI_Amount = ESI_Amount,
                        ESI_is_applicable = ESI_is_applicable,

                        TDS_is_applicable = TDS_is_applicable,
                        TDS_Percentage = TDS_Percentage,
                        TDS_Amount = TDS_Amount,
                    )
                    Financial_History_instance.save()

                    Salary_History_instance = Salary_Maintenance_Detials(
                        EmployeeMedicalInfo = Employee_Medical_instance,
                        EmployeementHistory = EmployeementHistory_instance,
                        Employee=Employee_instance,
                        EmployeeCurrentHistoryInfo = CurrentEmployee_History_instance,
                      
                        BasicSalary = BasicSalary,                     
                        ctc=ctc,
                      
                        AccountHolderName = AccountHolderName,
                        AccountNumber = AccountNumber,
                        BankName = BankName,
                        Branch = Branch,
                        IfscCode = IfscCode,
                        PanNumber = PanNumber,                
                        Location = location_instance,
                        created_by = created_by,

                        Status = 'Active',

                       
                    )
                    Salary_History_instance.save()
                    Salary_History_instance.EmployeeAllowanceDetails.set(created_allowances)


                    Document_Checklist_instance = Document_Checklist_Detials(
                        EmployeeMedicalInfo = Employee_Medical_instance,
                        EmployeementHistory = EmployeementHistory_instance,
                        Employee=Employee_instance,
                        EmployeeCurrentHistoryInfo = CurrentEmployee_History_instance,
                        EmployeeFinancialHistory = Financial_History_instance,
                        Resume = ResumeDocument,
                        PanCard = PanCardDocument,
                        AadharCard = AadharCardDocument,
                        BankPassbook = BankPassbookDocument,
                        ExperienceCertificate = ExperienceCertificateDocument,
                        MedicalFitness = MedicalFitnessDocument,
                        Offerletter = OfferletterDocument,
                        Location = location_instance,
                        created_by = created_by
                    )
                    Document_Checklist_instance.save()

                    return JsonResponse({'success': 'Employees Details added successfully'})
    
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
            
   
    elif request.method == 'GET':
        try:
            def get_file_image(filedata):
                # Detect the file type using file content
                kind = filetype.guess(filedata)
                
                # Default to PDF if the type is undetermined
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            
            DepartmentId = request.GET.get('deptid')
            SearchQuery = request.GET.get('SearchQuery')
            SearchCategory = request.GET.get('SearchCategory')
            SearchDesignation = request.GET.get('SearchDesignation')
            
            # Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes',Employee_ID='CRTEMPL003')
            Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes')

            print(len(Employee_Personal_Info),'length')
            print("DepartmentId :",DepartmentId)
            # if DepartmentId:
            #     Employee_Personal_Info = Employee_Personal_Info.filter(Department__Department_Id__in=DepartmentId)
            #     print(Employee_Personal_Info,'Employee_Personal_Info')

            if SearchQuery:

                Employee_Personal_Info = Employee_Personal_Info.filter(
                    Q(First_Name__icontains=SearchQuery) |
                    Q(Employee_ID__icontains=SearchQuery) |
                    Q(Existing_Employee_ID__icontains=SearchQuery) |
                    Q(Contact_Number__icontains=SearchQuery)
                )
                print('search query : ',SearchQuery)
                # Employee_Personal_Info = Employee_Personal_Info.filter(
                #     Q(First_Name__iexact=SearchQuery) |
                #     Q(Employee_ID__iexact=SearchQuery) |
                #     Q(Existing_Employee_ID__iexact=SearchQuery) |
                #     Q(Contact_Number__iexact=SearchQuery)
                # )

            if SearchCategory:
                Employee_Personal_Info = Employee_Personal_Info.filter(Category=SearchCategory)

        # Designation filter
            if SearchDesignation:
                Employee_Personal_Info = Employee_Personal_Info.filter(Designation=SearchDesignation)

            
            idx=1
            # Construct a list of dictionaries containing location data
            employee_data = []

            Employees_data = []  # Initialize the list before the loop
    
            for i, employee in enumerate(Employee_Personal_Info):
                departmentId = ', '.join(str(department.Department_Id) for department in employee.Department.all())
                departments = ', '.join(department.Department_Name for department in employee.Department.all())

                userins = UserRegister_Master_Details.objects.filter(Employee_Id=employee.pk).first()
                userrecord = False
 
                if userins:
 
                    userrecord = True

                employee_data = {
                    'id': idx + i,
                    'Existing_Employee_ID' : employee.Existing_Employee_ID,
                    'Employee_Id': employee.pk,
                    'userrecord':userrecord,
                    'Title': employee.Tittle.Title_Name if employee.Tittle else None,
                    'FirstName': employee.First_Name,
                    'MiddleName': employee.Middle_Name,
                    'LastName': employee.Last_Name,
                    'FullName': f"""{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{"."}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}""".strip(),
                    'Gender': employee.Gender,
                    'DOB': employee.DOB,
                    'Age': employee.Age,
                    'BloodGroup': employee.BloodGroup.BloodGroup_Id if employee.BloodGroup else None,
                    'BloodGroupName': employee.BloodGroup.BloodGroup_Name if employee.BloodGroup else None,
                    'Phone': str(round(float(employee.Contact_Number)))  if employee.Contact_Number else '',
                    'Alternate_Number': employee.Alternate_Number,
                    'Email': employee.E_mail,
                    'Qualification': employee.Qualification,
                    'SkillSet': employee.SkillSet,
                    'leavesList1':'l',
                    'IdProofType': employee.IdProofType,
                    'IdProofNo': employee.IdProofNo,
                    'Marital_Status': employee.Marital_Status,
                    'MarriagePlan': employee.MarriagePlan,
                    'AnniversaryDate': employee.AnniversaryDate,
                    'Residence':employee.Residence,
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
                    'PermanentAddressSameAsAbove':employee.PermanentAddressSameAsAbove,
                    'Category': employee.Category.Category_Name if employee.Category else None,
                    'Speciality': employee.Speciality.Speciality_Name if employee.Speciality else None,
                    'Department': departments,
                    'Department_Id' : departmentId,
                    'Designation': employee.Designation.Designation_Name if employee.Designation else None,
                    'EmergencyContactName1': employee.EmergencyContactName1,
                    'EmergencyContactNo1': employee.EmergencyContactNo1,
                    'EmergencyContactName2': employee.EmergencyContactName2,
                    'EmergencyContactNo2': employee.EmergencyContactNo2,
                    'ActiveStatus': employee.ActiveStatus,
                    'RequirementSource': employee.RequirementSource,
                    'Source': employee.Source,
                    'Created_by': employee.created_by,
                    'Photo': get_file_image(employee.Photo) if employee.Photo else None,
                    'Signature': get_file_image(employee.Signature) if employee.Signature else None,
                    'CaptureImage': get_file_image(employee.CaptureImage) if employee.CaptureImage else None,
                    'Date': employee.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time': employee.created_at.strftime('%H:%M:%S'),  # Format time
                    'EmployeeHistory': [],
                    'EmployeeLeavelist':[],
                    'EmployeeSkillset': [],
                    'EmployeeMedicalInfo': [],
                    'EmployeeCurrentDetails': [],
                    'EmployeeFinancialHistory': [],
                    'EmployeeSecurityDepositDetails':[],
                    'EmployeeGratuityDetails':[],
                    'EmployeeProbationDetails':[],
                    'EmployeeDocumentChecklist': [],
                    'EmployeeAllowanceDetails':[],
                    'EmployeeDeductionDetails':[],
                }

                EmployeeHistory_Data = Employeement_History_Detials.objects.filter(Employee=employee.pk)
                for table1 in EmployeeHistory_Data:
                    employee_data['EmployeeHistory'].append({
                        'id':table1.Employee.pk,
                        'PreviousWorkExperience':table1.PreviousWorkExperience,
                        'PreviousWorkPFNumber':table1.PreviousWorkPFNumber,
                        'PreviousWorkESINumber':table1.PreviousWorkESINumber,
                        'PFNumber':table1.PFNumber,
                        'ESINumber':table1.ESINumber,
                        'NoOfYears':table1.NoOfYears,
                        'WorkStationNameAddress':table1.WorkStationNameAddress,
                        'ReasonForLeft':table1.ReasonForLeft,
                        'WorkStationPhoneNo':table1.WorkStationPhoneNo,
                        'EmployeePaySlip': get_file_image(table1.EmployeePaySlip) if table1.EmployeePaySlip else None,
                        'EmployeeOfferLetter': get_file_image(table1.EmployeeOfferLetter) if table1.EmployeeOfferLetter else None,
                        'EmployeeReliveLetter': get_file_image(table1.EmployeeReliveLetter) if table1.EmployeeReliveLetter else None,
                        'ConfirmedBy':table1.ConfirmedBy,
                        'Created_by': table1.created_by,
                        # 'Location': table1.Location,
                        # 'LocationName': table1.Location.Location_Name,

                    })


                EmployeeMedicalInfo_Data =  Employee_Medical_Information_Detials.objects.filter(Employee=employee.pk) 
                for table2 in EmployeeMedicalInfo_Data:
                    employee_data['EmployeeMedicalInfo'].append({
                        'id':table2.Employee.pk,
                        'PreExisiting_Medical_Condition':table2.PreExisiting_Medical_Condition,
                        'PsychiatricMedicines':table2.PsychiatricMedicines,
                        'PsychiatricMedicinesDetails':table2.PsychiatricMedicinesDetails,
                        'PreviousOperation':table2.PreviousOperation,
                        'SurgeriesDetails':table2.SurgeriesDetails,
                        'VaccinationStatus':table2.VaccinationStatus,
                        'VaccinationStatusDetails':table2.VaccinationStatusDetails,
                        'MedicalFitnessCertificate': get_file_image(table2.MedicalFitnessCertificate) if table2.MedicalFitnessCertificate else None,
                        'AnnualMedicalCheckup': get_file_image(table2.AnnualMedicalCheckup) if table2.AnnualMedicalCheckup else None,
                        'Created_by': table2.created_by,


                    })


                CurrentHistory_Data =  Current_History_Detials.objects.filter(Employee=employee.pk)  
                for table3 in CurrentHistory_Data:
                    employee_data['EmployeeCurrentDetails'].append({
                        'id':table3.Employee.pk,
                        'DateOfJoining':table3.DateOfJoining,
                        'CurrentEmployeementLocations':table3.CurrentEmployeementLocations.Location_Id if table3.CurrentEmployeementLocations else None,
                        'ReportingManager':table3.ReportingManager,
                        'GovtLeave':table3.GovtLeave,
                        'CasualLeave':table3.CasualLeave,
                        'SickLeave':table3.SickLeave,
                        'TotalLeave1':table3.TotalLeave,
                        'WorkEmail':table3.WorkEmail,
                        # 'IsPF_Applicable':table3.IsPF_Applicable if table3.IsPF_Applicable else 0,
                        'Created_by': table3.created_by,
                    })
                    
                    # 19-2-25
                
                
                
                EmployeeLeavelist_Data = Employee_Leavelist.objects.filter(Employee=employee.pk)
                for table0 in EmployeeLeavelist_Data:
                    employee_data['EmployeeLeavelist'].append({
                        
                        'leave_type':table0.leave_type,
                        'leave_count':table0.leave_count
                    })
                                        
                    # 18-2-25
                    
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
                         'confidential_review_form': get_file_image(table7.confidential_review_form) if table7.confidential_review_form else None,
                         'hod_review_form': get_file_image(table7.hod_review_form) if table7.hod_review_form else None,
                         'hr_review_form': get_file_image(table7.hr_review_form) if table7.hr_review_form else None,
                         'TrainingGivenBy': table7.training_given_by,
                         'TrainingVerifiedBy': table7.training_verified_by,
                         'TrainingCompletedDate': table7.training_completed_date,
                      })
                #  
                
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
                     
                #
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
                        'allowance_name':table10.allowance,
                        'allowance_percentage':table10.percentage,
                        'allowance_amount':table10.amount,
                    }) 


                EmployeeDeduction_Data = EmployeeDeductionDetails.objects.filter(Employee=employee.pk)
                for table11 in EmployeeDeduction_Data:
                    employee_data['EmployeeDeductionDetails'].append({
                        'deduction_name':table11.deduction,
                        'deduction_amount':table11.amount,
                    })
                
                
                FinancialHistory_Data =  Financial_History_Detials.objects.filter(Employee=employee.pk)
                for table4 in FinancialHistory_Data:
                    employee_data['EmployeeFinancialHistory'].append({
                        'id':table4.Employee.pk,
                        'ctc':table4.ctc,
                        'Salary':table4.Salary,
                        'net_salary':table4.Net_salary,
                        'BasicSalary':table4.BasicSalary,
                        'PF_is_applicable':table4.PF_is_applicable,
                        'AllowanceAmount':table4.Allowance_amount,
                        'DeductionAmount':table4.Deduction_amount,
                        'FinalAllowance':table4.Allowancefinal,
                        'PfForEmployee':table4.PfForEmployee,
                        'SecurityDeposite':table4.SecurityDeposite,
                        'AccountHolderName':table4.AccountHolderName,
                        'AccountNumber':table4.AccountNumber,
                        'BankName':table4.BankName,
                        'Branch':table4.Branch,
                        'IfscCode':table4.IfscCode,
                        'PanNumber':table4.PanNumber,
                        'UploadCsvFile': get_file_image(table4.UploadCsvFile) if table4.UploadCsvFile else None,
                        'Created_by': table4.created_by,


                    })

                EmployeeDocument_Chicklist_Data =  Document_Checklist_Detials.objects.filter(Employee=employee.pk)
                for table5 in EmployeeDocument_Chicklist_Data:
                    employee_data['EmployeeFinancialHistory'].append({
                        'id':table5.Employee.pk,
                        'Resume': get_file_image(table5.Resume) if table5.Resume else None,
                        'PanCard': get_file_image(table5.PanCard) if table5.PanCard else None,
                        'AadharCard': get_file_image(table5.AadharCard) if table5.AadharCard else None,
                        'BankPassbook': get_file_image(table5.BankPassbook) if table5.BankPassbook else None,
                        'ExperienceCertificate': get_file_image(table5.ExperienceCertificate) if table5.ExperienceCertificate else None,
                        'MedicalFitness': get_file_image(table5.MedicalFitness) if table5.MedicalFitness else None,
                        'Offerletter': get_file_image(table5.Offerletter) if table5.Offerletter else None,
                        'Created_by': table5.created_by,
                    })

                EmployeeSkill_Data =  Employee_Skills_Detials.objects.filter(Employee=employee.pk)   
                for table6 in EmployeeSkill_Data:
                    employee_data['EmployeeSkillset'].append({
                        'id':table6.Employee.pk,
                        'skill_name':table6.Skill,
                        'skill_level':table6.Level,
                        'Created_by': table6.created_by,
                    }) 



                Employees_data.append(employee_data)
            return JsonResponse(Employees_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    
@csrf_exempt
def get_User_Employee_Details(request):
    if request.method == 'GET':
        try:
            
            Employee_Id = request.GET.get('EmployeeId')
            if not Employee_Id:
                return JsonResponse({'warn': 'Employee_Id is required'}, status=400)
            
            
            # Fetch all records from the Location_Detials model
            employee = Employee_Personal_Form_Detials.objects.get(pk=Employee_Id)
            print(employee.Tittle.Title_Name,'----++++')

            # EmployeeDepartment = Current_History_Detials.objects.get(Employee__pk = Employee_Id)
            
            # idx=1
            # Construct a list of dictionaries containing location data
            Employees_data = {
                    # 'id': idx + i,
                    'Employee_Id': employee.Employee_ID,
                    'Title': employee.Tittle.Title_Name,
                    'FirstName': employee.First_Name,
                    'MiddleName': employee.Middle_Name,
                    'lastName': employee.Last_Name,
                    'Email': employee.E_mail,
                    'Phone': employee.Contact_Number,
                    'Gender': employee.Gender,
                    'Qualification': employee.Qualification,
                    # 'Department': EmployeeDepartment.Department.Department_Name,
                    # 'Designation': EmployeeDepartment.Designation.Designation_Name,
                    'Created_by': employee.created_by,
                    'Date': employee.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time': employee.created_at.strftime('%H:%M:%S'),  # Format time
                }
            
            
            print(Employees_data,'Employees_data')
            return JsonResponse(Employees_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
def Get_Employee_Registered_Details(request):
    if request.method == 'GET':
        try:
            Employee_Id = request.GET.get('Employee')
            # print(Employee_Id,'Employee_Id')

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
            
            Employee = Employee_Personal_Form_Detials.objects.get(pk=Employee_Id)
            print(Employee,'Employee_Personal_Info')
            EmployeeSkillset_Data = Employee_Skills_Detials.objects.filter(Employee__pk=Employee_Id)
            print(EmployeeSkillset_Data,'EmployeeSkillset_Data')
            
 
            
            
            EmployeeHistory_Data = Employeement_History_Detials.objects.filter(Employee__pk=Employee_Id)
            EmployeeLeavelist_Data = Employee_Leavelist.objects.filter(Employee__pk=Employee_Id)
            EmployeeMedicalInfo_Data =  Employee_Medical_Information_Detials.objects.filter(Employee__pk=Employee_Id) 
            CurrentHistory_Data =  Current_History_Detials.objects.filter(Employee__pk=Employee_Id)
        # 18-2-25
            EmployeeProbationDetails_Data =EmployeeProbationDetails.objects.filter(Employee__pk=Employee_Id)
            EmployeeSecurityDeposit_Data =EmployeeSecurityDeposit.objects.filter(Employee__pk=Employee_Id)
            EmployeeGratuityDetails_Data =Employee_GratuityDetails.objects.filter(Employee__pk=Employee_Id)
            EmployeeAllowance_Data=EmployeeAllowanceDetails.objects.filter(Employee__pk=Employee_Id,Status='Active')
            EmployeeDeduction_Data = EmployeeDeductionDetails.objects.filter(Employee__pk=Employee_Id)
            
            
            
            
            FinancialHistory_Data =  Financial_History_Detials.objects.filter(Employee__pk=Employee_Id)
            
            EmployeeDocument_Chicklist_Data =  Document_Checklist_Detials.objects.filter(Employee__pk=Employee_Id)
  
            departmentId = ', '.join(str(department.Department_Id) for department in Employee.Department.all())
            departments = ', '.join(department.Department_Name for department in Employee.Department.all())
            
           

            employee_data = {
                'Existing_Employee_ID' : Employee.Existing_Employee_ID,
                'Employee_Id': Employee.pk,
                'Title': Employee.Tittle.Title_Id if Employee.Tittle else None,
                'FirstName': Employee.First_Name,
                'MiddleName': Employee.Middle_Name,
                'LastName': Employee.Last_Name,
                'Gender': Employee.Gender,
                'DOB': Employee.DOB,
                'Age': Employee.Age,
                'BloodGroup': Employee.BloodGroup.BloodGroup_Id if Employee.BloodGroup else None,
                'BloodGroupName': Employee.BloodGroup.BloodGroup_Name if Employee.BloodGroup else None,
                'Phone': Employee.Contact_Number,
                'Alternate_Number': Employee.Alternate_Number,
                'Email': Employee.E_mail,
                'Qualification': Employee.Qualification,
                'IdProofType': Employee.IdProofType,
                'IdProofNo': Employee.IdProofNo,
                'Marital_Status': Employee.Marital_Status,
                'MarriagePlan': Employee.MarriagePlan,
                'AnniversaryDate':Employee.AnniversaryDate,
                'Residence':Employee.Residence,
                'FatherName': Employee.FatherName,
                'FatherContact': Employee.FatherContact,
                'FatherWorking': Employee.FatherWorking,
                'FatherWorkPlace': Employee.FatherWorkPlace,
                'MotherName': Employee.MotherName,
                'MotherContact': Employee.MotherContact,
                'MotherWorking': Employee.MotherWorking,
                'MotherWorkPlace': Employee.MotherWorkPlace,
                'Spouse_Name': Employee.Spouse_Name,
                'SpouseContact': Employee.SpouseContact,
                'SpouseWorking': Employee.SpouseWorking,
                'SpouseWorkPlace': Employee.SpouseWorkPlace,
                'Child': Employee.Child,
                'TotalNoChild': Employee.TotalNoChild,
                'DoorNo': Employee.DoorNo,
                'Street': Employee.Street,
                'Area': Employee.Area,
                'City': Employee.City,
                'District': Employee.District,
                'State': Employee.State,
                'Country': Employee.Country,
                'Pincode': Employee.Pincode,
                'PermanentAddressSameAsAbove':Employee.PermanentAddressSameAsAbove,
                'PermanentDoorNo':Employee.PermanentDoorNo,
                'PermanentStreet':Employee.PermanentStreet,
                'PermanentArea':Employee.PermanentArea,
                'PermanentCity':Employee.PermanentCity,
                'PermanentDistrict':Employee.PermanentDistrict,
                'PermanentState':Employee.PermanentState,
                'PermanentCountry':Employee.PermanentCountry,
                'PermanentPincode':Employee.PermanentPincode,
                'Department' : departments,
                'departments' : departmentId,
                'Category': Employee.Category.Category_Id if Employee.Category else None,
                'Speciality': Employee.Speciality.Speciality_Id if Employee.Speciality else None,
                'Designation': Employee.Designation.Designation_Id if Employee.Designation else None,
                'Classification' : Employee.Classification.Classification_Id if Employee.Classification else None,
                'Role' : Employee.Role.Role_Id if Employee.Role else None,
                'EmergencyContactName1': Employee.EmergencyContactName1,
                'EmergencyContactNo1': Employee.EmergencyContactNo1,
                'EmergencyContactName2': Employee.EmergencyContactName2,
                'EmergencyContactNo2': Employee.EmergencyContactNo2,
                'ActiveStatus': Employee.ActiveStatus,
                'RequirementSource': Employee.RequirementSource,
                'Source': Employee.Source,
                'Created_by': Employee.created_by,
                'Photo': get_file_image(Employee.Photo) if Employee.Photo else None,
                'Signature': get_file_image(Employee.Signature) if Employee.Signature else None,
                'Date': Employee.created_at.strftime('%Y-%m-%d'),  # Format date
                'Time': Employee.created_at.strftime('%H:%M:%S'),  # Format time
                'EmployeeHistory': [{

                    'id':table1.Employee.pk,
                    'PreviousWorkExperience':table1.PreviousWorkExperience,
                    'PreviousWorkPFNumber':table1.PreviousWorkPFNumber,
                    'PreviousWorkESINumber':table1.PreviousWorkESINumber,
                    'PFNumber':table1.PFNumber,
                    'ESINumber':table1.ESINumber,
                    'NoOfYears':table1.NoOfYears,
                    'WorkStationNameAddress':table1.WorkStationNameAddress,
                    'ReasonForLeft':table1.ReasonForLeft,
                    'WorkStationPhoneNo':table1.WorkStationPhoneNo,
                    'EmployeePaySlip': get_file_image(table1.EmployeePaySlip) if table1.EmployeePaySlip else None,
                    'EmployeeOfferLetter': get_file_image(table1.EmployeeOfferLetter) if table1.EmployeeOfferLetter else None,
                    'EmployeeReliveLetter': get_file_image(table1.EmployeeReliveLetter) if table1.EmployeeReliveLetter else None,
                    'ConfirmedBy':table1.ConfirmedBy,
                    'Created_by': table1.created_by,

                
                    } for table1 in EmployeeHistory_Data
                ],
                'EmployeeLeavelist':[{
                  
                      'leaveType':table0.leave_type,
                        'numLeaves':table0.leave_count,
                    } for table0 in EmployeeLeavelist_Data
                    ],
                'EmployeeMedicalInfo': [{
                    'id':table2.Employee.pk,
                    'PreExisiting_Medical_Condition':table2.PreExisiting_Medical_Condition,
                    'PsychiatricMedicines':table2.PsychiatricMedicines,
                    'PsychiatricMedicinesDetails':table2.PsychiatricMedicinesDetails,
                    'PreviousOperation':table2.PreviousOperation,
                    'SurgeriesDetails':table2.SurgeriesDetails,
                    'VaccinationStatus':table2.VaccinationStatus,
                    'VaccinationStatusDetails':table2.VaccinationStatusDetails,
                    'MedicalFitnessCertificate': get_file_image(table2.MedicalFitnessCertificate) if table2.MedicalFitnessCertificate else None,
                    'AnnualMedicalCheckup': get_file_image(table2.AnnualMedicalCheckup) if table2.AnnualMedicalCheckup else None,
                    'Created_by': table2.created_by,

                }for table2 in EmployeeMedicalInfo_Data
                ],
                
                # 18-2-25
                
                'EmployeeProbationDetails': [{
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
                   'confidential_review_form': get_file_image(table7.confidential_review_form) if table7.confidential_review_form else None,
                   'hod_review_form': get_file_image(table7.hod_review_form) if table7.hod_review_form else None,
                   'hr_review_form': get_file_image(table7.hr_review_form) if table7.hr_review_form else None,
                   'TrainingGivenBy': table7.training_given_by,
                   'TrainingVerifiedBy': table7.training_verified_by,
                   'TrainingCompletedDate': table7.training_completed_date,
                 }for table7 in EmployeeProbationDetails_Data
                ],
                'EmployeeSecurityDepositDetails': [{
                'requiresSecurityDeposit': table8.requires_security_deposit,
                'security_start_date': table8.security_start_date,
                'total_security_amount': table8.total_security_amount,
                'Security_pending_months': table8.security_pending_months,
                'Security_installment_count': table8.security_installment_count,
                'Security_months_paid': table8.security_months_paid,
                'Security_months_to_be_scheduled': table8.security_months_to_be_scheduled,
                'security_end_date': table8.security_end_date,
                } for table8 in EmployeeSecurityDeposit_Data
                ],
                'EmployeeGratuityDetails': [{
                    'requireGratuity': table9.require_gratuity,
                    'gratuity_start_date': table9.gratuity_start_date,
                    'total_gratuity_amount': table9.total_gratuity_amount,
                    'monthly_Gratuity_amount': table9.monthly_gratuity_amount,
                    'Gratuity_pending_months': table9.gratuity_pending_months,
                    'Gratuity_installment_count': table9.gratuity_installment_count,
                    'Gratuity_months_to_be_scheduled': table9.gratuity_months_to_be_scheduled,
                } for table9 in EmployeeGratuityDetails_Data],
                 
                'EmployeeAllowanceDetails' : [{
                'allowance_name': table10.allowance,
                'allowance_percentage':table10.percentage,   
                'allowance_amount':table10.amount   
                }for table10 in EmployeeAllowance_Data
                ],
                
                'EmployeeDeductioDetails' :
                    [{
                       'deduction_name':table11.deduction,
                       'deduction_amount':table11.amount,
                            
                    }for table11 in EmployeeDeduction_Data
                     ],
                'EmployeeCurrentDetails': [{
                    'id':table3.Employee.pk,
                    'DateOfJoining':table3.DateOfJoining,
                    'CurrentEmployeementLocations':table3.CurrentEmployeementLocations.Location_Id if table3.CurrentEmployeementLocations else None,
                    'ReportingManager':table3.ReportingManager,
                    'GovtLeave':table3.GovtLeave,
                    'CasualLeave':table3.CasualLeave,
                    'SickLeave':table3.SickLeave,
                    'TotalLeave1':table3.TotalLeave,
                    'WorkEmail':table3.WorkEmail,
                    # 'ProbationPeriod':table3.ProbationPeriod,
                    # 'Months':table3.Months,
                    # 'Years':table3.Years,
                    # 'TrainingGivenBy':table3.TrainingGivenBy,
                    # 'TrainingVerifiedBy':table3.TrainingVerifiedBy,
                    # 'TrainingCompletedDate':table3.TrainingCompletedDate,
                    # 'IsPF_Applicable':table3.IsPF_Applicable if table3.IsPF_Applicable else 0,
                    'Created_by': table3.created_by,
                }for table3 in CurrentHistory_Data
                ],
                'EmployeeFinancialHistory': [{

                    'id':table4.Employee.pk,
                    'ctc':table4.ctc,
                    'PF_is_applicable':table4.PF_is_applicable,
                    'Salary':table4.Salary,
                    'net_salary':table4.Net_salary,
                    'BasicSalary':table4.BasicSalary,
                    'AllowanceAmount':table4.Allowance_amount,
                    'DeductionAmount':table4.Deduction_amount,
                    'FinalAllowance':table4.Allowancefinal,
                    'PfForEmployee':table4.PfForEmployee,
                    'SecurityDeposite':table4.SecurityDeposite,
                    'AccountHolderName':table4.AccountHolderName,
                    'AccountNumber':table4.AccountNumber,
                    'BankName':table4.BankName,
                    'Branch':table4.Branch,
                    'IfscCode':table4.IfscCode,
                    'PanNumber':table4.PanNumber,
                    'UploadCsvFile': get_file_image(table4.UploadCsvFile) if table4.UploadCsvFile else None,
                    'Created_by': table4.created_by,
                    'TDS_Amount':table4.TDS_Amount,
                    'TDS_Percentage':table4.TDS_Percentage,
                    'TDS_is_applicable':table4.TDS_is_applicable,
                    'ESI_is_applicable':table4.ESI_is_applicable,
                    'ESI_Amount':table4.ESI_Amount,
                    'ESI_Percentage':table4.ESI_Percentage,
                    'ESINumber':table4.ESINumber,
                    'PF_EmployerAmount':table4.PF_EmployerAmount,
                    'PF_EmployeeAmount':table4.PF_EmployeeAmount,
                    'PF_EmployeePercentage':table4.PF_EmployeePercentage,
                    'PF_EmployerPercentage':table4.PF_EmployerPercentage,
                    'PFNumber':table4.PFNumber,

                }for table4 in FinancialHistory_Data
                ],
                'EmployeeDocumentChecklist': [{
                    'id':table5.Employee.pk,
                    'Resume': get_file_image(table5.Resume) if table5.Resume else None,
                    'PanCard': get_file_image(table5.PanCard) if table5.PanCard else None,
                    'AadharCard': get_file_image(table5.AadharCard) if table5.AadharCard else None,
                    'BankPassbook': get_file_image(table5.BankPassbook) if table5.BankPassbook else None,
                    'ExperienceCertificate': get_file_image(table5.ExperienceCertificate) if table5.ExperienceCertificate else None,
                    'MedicalFitness': get_file_image(table5.MedicalFitness) if table5.MedicalFitness else None,
                    'Offerletter': get_file_image(table5.Offerletter) if table5.Offerletter else None,
                    'Created_by': table5.created_by,
                }for table5 in EmployeeDocument_Chicklist_Data
                ],

                'EmployeeSkillset': [{
                    'id': skill.Employee.pk,
                    'skill_name': skill.Skill,
                    'skill_level': skill.Level,
                    'Created_by': skill.created_by,
                } for skill in EmployeeSkillset_Data
                ],
            }

            print(f'employee_dat...{employee_data}')
            return JsonResponse(employee_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    



@csrf_exempt
def filter_Sourcewise_Employee_Details(request):
    if request.method == 'GET':
        try:
            # Retrieve the 'RequirementSource' parameter from the request
            RequirementSource = request.GET.get('RequirementSource')
            
            # Filter employees by 'RequirementSource'
            employees = Employee_Personal_Form_Detials.objects.filter(RequirementSource=RequirementSource)
            
            # If no employee is found, return an empty response
            if not employees.exists():
                return JsonResponse({'error': 'No employees found for the selected source'})
            
            # Prepare data for the response
            Employees_data = []
            for employee in employees:
                employee_data = {
                    'Employee_Id': employee.Employee_ID,
                    'Title': employee.Tittle.Title_Name,
                    'FirstName': employee.First_Name,
                    'MiddleName': employee.Middle_Name,
                    'LastName': employee.Last_Name,
                    'Email': employee.E_mail,
                    'Phone': employee.Contact_Number,
                    'Gender': employee.Gender,
                    'Qualification': employee.Qualification,
                    'Department': employee.Department.Department_Name,
                    'Designation': employee.Designation.Designation_Name,
                    'Created_by': employee.created_by,
                    'Date': employee.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time': employee.created_at.strftime('%H:%M:%S'),  # Format time
                }
                Employees_data.append(employee_data)
            
            # Return the employee data as JSON
            return JsonResponse(Employees_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)






# def getforemployeepayrolllist(request):
    # try:
    #     # Get request parameters
    #     fromdate = request.GET.get('fromdate')
    #     todate = request.GET.get('todate')
    #     location = request.GET.get('location')

    #     # Parse dates
    #     from_date = datetime.strptime(fromdate, "%Y-%m-%d").date()
    #     to_date = datetime.strptime(todate, "%Y-%m-%d").date()
    #     total_days = (to_date - from_date).days + 1

    #     # Get the number of days in the from_date month
    #     _, days_in_month = monthrange(from_date.year, from_date.month)

    #     # Filter employees by location
    #     employees = Employee_Personal_Form_Detials.objects.filter(Location_id=location)
    #     if not employees.exists():
    #         return JsonResponse({"message": "No employees found for the given location."})

    #     # Prepare final results
    #     final_results = []
    #     def get_file_image(filedata):
    #             # Detect the file type using file content
    #             kind = filetype.guess(filedata)
                
    #             # Default to PDF if the type is undetermined
    #             contenttype1 = 'application/pdf'
    #             if kind and kind.mime == 'image/jpeg':
    #                 contenttype1 = 'image/jpeg'
    #             elif kind and kind.mime == 'image/png':
    #                 contenttype1 = 'image/png'

    #             # Return base64 encoded data with MIME type
    #             return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

    #     for employee in employees:
    #         emp_id = employee.Employee_ID,

    #         # Fetch financial details
    #         try:
    #             finance_details = Financial_History_Detials.objects.get(Employee_id=emp_id)
    #         except Financial_History_Detials.DoesNotExist:
    #             continue
            
    #         try:
    #             CurrentHistoryDetials = Current_History_Detials.objects.get(Employee_id=emp_id)
    #         except Current_History_Detials.DoesNotExist:
    #             continue

    #         try:
    #             PFdetails = Employeement_History_Detials.objects.get(Employee_id=emp_id)
    #         except Employeement_History_Detials.DoesNotExist:
    #             continue

    #         print('employee.Department :',employee.Department)
    #         summa = employee.Department.all()
    #         for i in summa:
    #             print('i:',i)
    #             try:
    #                 department = Department_Detials.objects.get(Department_Id=i.Department_Id)
    #             except Department_Detials.DoesNotExist:
    #                 continue

    #         try:
    #             title = Title_Detials.objects.get(Title_Id=employee.Tittle.Title_Id)
    #         except Title_Detials.DoesNotExist:
    #             continue

    #         try:
    #             designation = Designation_Detials.objects.get(Designation_Id=employee.Designation.Designation_Id)
    #         except Designation_Detials.DoesNotExist:
    #             continue

            

    #         # Initialize advance details
    #         AmountDeduct_PerMonth = 0
    #         Repayment_Due = 0
    #         Installment_Status = None
    #         No_of_MonthPaid = 0
    #         PaidAmount = 0

    #         advancedetails = Employee_Advance_Request.objects.filter(
    #             Employee_Id_id=finance_details.EmpHistory_Id,
    #             Installment_Status="Pending",
    #             Status="Approved"
    #         ).last()
            
    #         PayslipStatus = Employee_PaySlips.objects.filter(
    #             Employee_id=finance_details.EmpHistory_Id
    #         ).last()
            
    #         PayslipStatus1 = "Pending"
    #         if PayslipStatus:
    #             PayslipStatus1 = "Completed"
                

    #         advanceid = None,
    #         AmountDeduct_PerMonth = 0
    #         Repayment_Due = None
    #         Installment_Status = None
    #         No_of_MonthPaid = 0
    #         PaidAmount = 0
    #         # print('advancedetails :',advancedetails)
    #         if advancedetails is not None:
     
    #             advanceid = advancedetails.Advance_RequestId,
    #             AmountDeduct_PerMonth = advancedetails.AmountDeduct_PerMonth if advancedetails.AmountDeduct_PerMonth else 0
    #             Repayment_Due = advancedetails.Repayment_Due
    #             Installment_Status = advancedetails.Installment_Status
    #             No_of_MonthPaid = advancedetails.No_of_MonthPaid
    #             PaidAmount = advancedetails.PaidAmount

    #         SalaryType = finance_details.SalaryType
    #         StipendAmount = 0
    #         if SalaryType == 'Stipend':
    #             StipendAmount = finance_details.StipendAmount

       
    #         # Calculate per day salary
    #         basic_salary = finance_details.BasicSalary or 0
    #         per_day_salary = basic_salary / days_in_month

    #         # Fetch attendance data
    #         attendance_records = Employee_Attendance.objects.filter(
    #             Employee_id=emp_id,
    #             Date__range=[from_date, to_date]
    #         )
    #         present_days = attendance_records.filter(Attendance_Status="Present").count()
    #         leave_days = attendance_records.filter(
    #             Attendance_Status__in=["Absent", "On Leave"]
    #         ).count()

    #         if leave_days == 0:
    #             leave_days1 = total_days - present_days
    #         else:
    #             leave_days1 = leave_days
    #         # Calculate payable salary based on attendance

    #         payable_salary = total_days * per_day_salary

    #         finalpayable = payable_salary - AmountDeduct_PerMonth

    #         # Calculate Allowances
    #         allowances = sum([
    #             finance_details.Allowancefinal or 0,
    # ])
    #         PfForEmployee_Amount = (finance_details.PfForEmployee / 100) * basic_salary
    #         # Tds_Amount = (TDS_Per / 100) * basic_salary
    #         # EsiAmount = (finance_details.EsiAmount / 100) * basic_salary

    #         # Professional Tax Calculation
    #         professional_tax = 0
    #         if basic_salary <= 21000:
    #             professional_tax = 0
    #         elif 21001 <= basic_salary <= 30000:
    #             professional_tax = 135
    #         elif 30001 <= basic_salary <= 45000:
    #             professional_tax = 315
    #         elif 45001 <= basic_salary <= 60000:
    #             professional_tax = 690
    #         elif 60001 <= basic_salary <= 75000:
    #             professional_tax = 1025
    #         else:
    #             professional_tax = 1250

    #         earnings = finalpayable + allowances
    #         deductions = sum([
    #             # PfForEmployeer_Amount or 0,
    #             # EsiAmount or 0,
    #             # Tds_Amount or 0,
    #             professional_tax,
    #         ])
    #         net_salary1 = earnings - deductions

   

    #         # Compile employee details with calculated salary
    #         result = {
    #             "Employee_ID": emp_id[0],
    #             'advanceid':advanceid[0],
    #             'Photo': get_file_image(employee.Photo) if employee.Photo else None,
    #             'CaptureImage': get_file_image(employee.CaptureImage) if employee.CaptureImage else None,
    #             "EmployeeName": f"{title.Title_Name}.{employee.First_Name} {employee.Last_Name}",
    #             "PayableSalary": round(payable_salary, 2) if SalaryType == "fixed" else StipendAmount,
    #             "TotalDays": total_days,
    #             "PresentDays": present_days,   
    #             "leave_days": leave_days1,
    #             "earnings": round(earnings,2),
    #             "deductions": round(deductions,2),
    #             "NetSalary": round(net_salary1, 2) if SalaryType == "fixed" else StipendAmount,
    #             "Department_Name": department.Department_Name,
    #             "Designation": designation.Designation_Name,
    #             "PhoneNumber": employee.Contact_Number,
    #             "HRAfinal": finance_details.Allowancefinal or 0,
    #             "MedicalAllowancefinal": finance_details.MedicalAllowancefinal or 0,
    #             "SpecialAllowancefinal": finance_details.SpecialAllowancefinal or 0,
    #             "TravelAllowancefinal": finance_details.TravelAllowancefinal or 0,
    #             "PfForEmployee_Amount": round(PfForEmployee_Amount,2),
    #             "ProfessionalTax": professional_tax,
    #             "AmountDeduct_PerMonth": AmountDeduct_PerMonth,
    #             "Repayment_Due": Repayment_Due,
    #             "Installment_Status": Installment_Status,
    #             "No_of_MonthPaid": No_of_MonthPaid,
    #             "PaidAmount": PaidAmount,
    #             "AccountHolderName": finance_details.AccountHolderName,
    #             "AccountNumber": finance_details.AccountNumber,
    #             "BankName": finance_details.BankName,
    #             "Branch": finance_details.Branch,
    #             "IfscCode": finance_details.IfscCode,
    #             "PanNumber": finance_details.PanNumber,
    #             "PayslipStatus1": PayslipStatus1,
    #             "BasicSalary": finance_details.BasicSalary,
    #             "LossofPay": 0,
    #             "DateofJoining": CurrentHistoryDetials.DateOfJoining,
    #             "WorkEmail": CurrentHistoryDetials.WorkEmail,
    #             "PFNumber":PFdetails.PFNumber,
    #             "ESINumber":PFdetails.ESINumber,
    #             'fromdate': fromdate
               
    #         }

    #         final_results.append(result)

    #     return JsonResponse(final_results, safe=False)

    # except Exception as e:
    #     print('Error:', e)
    #     return JsonResponse({"error": str(e)},status=500)


@csrf_exempt
def getforemployeepayrolllist(request):
    try:
        fromdate = datetime.strptime(request.GET.get('fromdate'), "%Y-%m-%d").date()
        todate = datetime.strptime(request.GET.get('todate'), "%Y-%m-%d").date()
        location = request.GET.get('location')
        department = request.GET.get('department')
        status_filter = request.GET.get('status')
        EmployeeSearch = request.GET.get('EmployeeSearch')  

        employees = Employee_Personal_Form_Detials.objects.filter(Location_id=location)

        if EmployeeSearch:
            employees = employees.filter(
                Q(First_Name__icontains=EmployeeSearch) |
                Q(Last_Name__icontains=EmployeeSearch) |
                Q(Employee_ID__icontains=EmployeeSearch) |
                Q(Contact_Number__icontains=EmployeeSearch) |
                Q(Middle_Name__icontains=EmployeeSearch)
            )

        if department != "all":
            employees = employees.filter(Department__Department_Id=department)

        if status_filter != "all" and status_filter != "pending":
            employees = employees.filter(
                Employee_ID__in=Employee_PaySlips.objects.filter(Status=status_filter).values_list('Employee', flat=True)
            )

        if not employees.exists():
            return JsonResponse({"message": "No employees found for the given location."})

        # Serialize
        serializer = EmployeePayrollSerializer(employees, many=True, fromdate=fromdate, todate=todate)

        total_net_salary = 0.0
        completed_count = 0
        pending_count = 0
        total_employees = len(serializer.data)

        for emp in serializer.data:
            # Ensure Net_Salary is numeric
            net_salary = emp.get("Net_Salary") or 0
            try:
                net_salary = float(net_salary)
            except:
                net_salary = 0
            total_net_salary += net_salary

            emp_status = emp.get("Status", "").lower()
            if emp_status == "completed":
                completed_count += 1
            elif emp_status == "pending":
                pending_count += 1

        completed_percentage = (completed_count / total_employees * 100) if total_employees > 0 else 0
        pending_percentage = (pending_count / total_employees * 100) if total_employees > 0 else 0

        response_data = {
            "data": serializer.data,
            "overall": {
                "total_net_salary": total_net_salary,
                "total_employees": total_employees,
                "completed_count": completed_count,
                "pending_count": pending_count,
                "completed_percentage": round(completed_percentage, 2),
                "pending_percentage": round(pending_percentage, 2),
            }
        }

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print("Error :", e)
        return JsonResponse({"error": str(e)}, status=500)


# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def insert_employee_performance(request):
#     if request.method == 'POST':
#         try:
#             # Parse POST data (handle form-data or JSON content)
#             data = json.loads(request.body)

#             # Extract data fields
#             employee_id = data.get('employeeId')
#             hike_amount = float(data.get('amount', 0))
#             new_pay = float(data.get('newpay', 0))
#             approved_by = data.get('approvedby', '')
#             created_by = data.get('createdby', '')
#             date = data.get('date', '')
#             performance = int(data.get('performance', 0))
#             current = float(data.get('current', 0))
#             hike = float(data.get('hike', 0))
#             location = data.get('location', '')
#             remarks = data.get('remarks', '')

#             # Validate required fields
#             if not employee_id:
#                 return JsonResponse({'warn': "Employee ID is required"}, status=400)
#             if not location:
#                 return JsonResponse({'warn': "Location is required"}, status=400)

#             # Fetch the employee and location data
#             try:
#                 Employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
#             except Employee_Personal_Form_Detials.DoesNotExist:
#                 return JsonResponse({'warn': 'Employee not found'})
#             except Exception as e:
#                 print(f"Error fetching employee: {str(e)}")
#                 return JsonResponse({'error': f"Error fetching employee: {str(e)}"})

#             try:
#                 location_ins = Location_Detials.objects.get(Location_Id=location)
#             except Location_Detials.DoesNotExist:
#                 return JsonResponse({'warn': 'Location not found'})
#             except Exception as e:
#                 print(f"Error fetching location: {str(e)}")
#                 return JsonResponse({'error': f"Error fetching location: {str(e)}"})

#             # Create performance record
#             empperformance = Employee_Performance.objects.filter(Employee=Employee_instance)
#             print(empperformance,'empperformance')

#             for perf in empperformance:

#                 perf.Status = 'InActive'
#                 perf.save()


#             performance_record = Employee_Performance.objects.create(
#                 Employee=Employee_instance,
#                 Date=date,
#                 Current_Payment=current,
#                 Performance_Rate=performance,
#                 Hike_Percentage=hike,
#                 Hike_Amount=hike_amount,
#                 New_Pay=new_pay,
#                 Remarks=remarks,
#                 ApprovedBy=approved_by,
#                 Location_Name=location_ins,
#                 CreatedBy=created_by
#             )

#             # Now update the financial history table
#             try:
#                 # Fetch the existing financial history for the employee
#                 financial_history = Financial_History_Detials.objects.get(Employee=Employee_instance)
                
#                 # Basic Salary is 70% of New Pay
#                 basic_salary = new_pay * 0.70

#                 # HRA is 20% of Basic Salary
#                 hra = basic_salary * 0.20

#                 # Special Allowance is 5% of Basic Salary
#                 special_allowance = basic_salary * 0.05

#                 # Medical Allowance is 2% of Basic Salary
#                 medical_allowance = basic_salary * 0.02

#                 # Gross Salary is the sum of Basic Salary, HRA, Special Allowance, and Medical Allowance
#                 gross_salary = basic_salary + hra + special_allowance + medical_allowance

#                 # Provident Fund (PF) is 12% of Basic Salary
#                 pf_contribution = basic_salary * 0.12

#                 # Bonus is 10% of Basic Salary
#                 bonus = basic_salary * 0.10

#                 # CTC is the sum of Gross Salary, PF contribution, and Bonus
#                 ctc = gross_salary + pf_contribution + bonus

#                 # Update the Financial History with the new values
#                 financial_history.BasicSalary = basic_salary
#                 financial_history.GrossSalary = gross_salary
#                 financial_history.Ctc = ctc

#                 # Save the updated record
#                 financial_history.save()

#             except Financial_History_Detials.DoesNotExist:
#                 return JsonResponse({'warn': 'Financial record not found for this employee'}, status=404)

#             # Return success response
#             return JsonResponse({'success': 'Employee performance data inserted and financial details updated successfully'}, status=201)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
def get_username_details(request):
    if request.method == 'GET':
        try:
            users = UserRegister_Master_Details.objects.all()
            user_data = []
            for user in users:
                user = {
                    'id': user.Employee_Id.Employee_ID,
                    'userid' : user.User_Id,
                    'username' : user.auth_user_id.username,
                }
                user_data.append(user)
            return JsonResponse(user_data,safe=False)
        except Exception as e:
            return JsonResponse({'error':str(e)})
        
@csrf_exempt
def get_leave_master_details(request):
    if request.method == 'GET':
        try:
            leaves= LeaveMaster.objects.all()
            leave_data = []
            for avail_leaves in leaves:
                avail_leaves={
                    'code':avail_leaves.code,
                    'leave_type':avail_leaves.leave_type
                }
                leave_data.append(avail_leaves)
            return JsonResponse(leave_data,safe=False)    
        except Exception as e :
            return JsonResponse({'error':str(e)})         
        
        
@csrf_exempt
def get_allowances_details(request):
    if request.method == 'GET':
        try:
            # Query all records from AllowanceMaster
            allowances = AllowanceMaster.objects.all()    
            
            # Initialize an empty list to store allowance details
            allowances_data = []

            # Loop through each allowance and append the required fields to the list
            for awail_allowances in allowances:
                allowance_data = {
                    'allowance_name': awail_allowances.allowance_name,
                    'allowance_type': awail_allowances.allowance_type,
                    '   ': awail_allowances.value,
                }
                allowances_data.append(allowance_data)

            # Return the list as a JSON response
            return JsonResponse(allowances_data, safe=False)
        
        except Exception as e:
            return JsonResponse({'error': str(e)})
        

@csrf_exempt
def get_deduction_details(request):
    if request.method == 'GET':
        try:
            # Query all records from Deduction_Master
            deductions = Deduction_Master.objects.all()    
            
            # Initialize an empty list to store deduction details
            deduction_data = []

            # Loop through each deduction and append the required fields to the list
            for deduction in deductions:
                deduction_details = {
                    'deduction_name': deduction.deduction_name,
                    'deduction_type': deduction.deduction_type,  # Either 'Fixed' or 'Percentage'
                    'value': deduction.value,  # Value for the deduction (fixed or percentage)
                    'status': deduction.status,  # Status of the deduction (active or inactive)
                }
                deduction_data.append(deduction_details)

            # Return the list as a JSON response
            return JsonResponse(deduction_data, safe=False)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Employee_List_Details(request):
    
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

    if request.method == 'GET':
        try:
            def get_file_image(filedata):
                # Detect the file type using file content
                kind = filetype.guess(filedata)
                
                # Default to PDF if the type is undetermined
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            
            DepartmentId = request.GET.get('deptid')
            empid = request.GET.get('empid','')
            
            Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes').exclude(Employee_ID=empid)
            print(Employee_Personal_Info)
            print("DepartmentId :",DepartmentId)
            if DepartmentId:
                Employee_Personal_Info = Employee_Personal_Info.filter(Department__Department_Id__in=DepartmentId)
                

            
            idx=1
            # Construct a list of dictionaries containing location data

            Employees_data = []  # Initialize the list before the loop
    
            for i, employee in enumerate(Employee_Personal_Info):
                departmentId = ', '.join(str(department.Department_Id) for department in employee.Department.all())
                departments = ', '.join(department.Department_Name for department in employee.Department.all())

                employee_data = {
                    'id': idx + i,
                    'Employee_Id': employee.pk,
                    'Title': employee.Tittle.Title_Name if employee.Tittle else None,
                    'FirstName': employee.First_Name,
                    'MiddleName': employee.Middle_Name,
                    'LastName': employee.Last_Name,
                    'FullName': f"""{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{"."}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}""".strip(),
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
                    'leavesList1':'l',
                    'IdProofType': employee.IdProofType,
                    'IdProofNo': employee.IdProofNo,
                    'Marital_Status': employee.Marital_Status,
                    'MarriagePlan': employee.MarriagePlan,
                    'AnniversaryDate': employee.AnniversaryDate,
                    'Residence':employee.Residence,
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
                    'PermanentAddressSameAsAbove':employee.PermanentAddressSameAsAbove,
                    'Category': employee.Category.Category_Name if employee.Category else None,
                    'Speciality': employee.Speciality.Speciality_Name if employee.Speciality else None,
                    'Department': departments,
                    'Department_Id' : departmentId,
                    'Designation': employee.Designation.Designation_Name if employee.Designation else None,
                    'EmergencyContactName1': employee.EmergencyContactName1,
                    'EmergencyContactNo1': employee.EmergencyContactNo1,
                    'EmergencyContactName2': employee.EmergencyContactName2,
                    'EmergencyContactNo2': employee.EmergencyContactNo2,
                    'ActiveStatus': employee.ActiveStatus,
                    'RequirementSource': employee.RequirementSource,
                    'Source': employee.Source,
                    'Created_by': employee.created_by,
                    'Photo': get_file_image(employee.Photo) if employee.Photo else None,
                    'Signature': get_file_image(employee.Signature) if employee.Signature else None,
                    'CaptureImage': get_file_image(employee.CaptureImage) if employee.CaptureImage else None,
                    'Date': employee.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time': employee.created_at.strftime('%H:%M:%S'),  # Format time
                    'EmployeeHistory': [],
                    'EmployeeLeavelist':[],
                    'EmployeeSkillset': [],
                    'EmployeeMedicalInfo': [],
                    'EmployeeCurrentDetails': [],
                    'EmployeeFinancialHistory': [],
                    'EmployeeSecurityDepositDetails':[],
                    'EmployeeGratuityDetails':[],
                    'EmployeeProbationDetails':[],
                    'EmployeeDocumentChecklist': [],
                    'EmployeeAllowanceDetails':[],
                    'EmployeeDeductionDetails':[],
                }

                EmployeeHistory_Data = Employeement_History_Detials.objects.filter(Employee=employee.pk)
                for table1 in EmployeeHistory_Data:
                    employee_data['EmployeeHistory'].append({
                        'id':table1.Employee.pk,
                        'PreviousWorkExperience':table1.PreviousWorkExperience,
                        'PreviousWorkPFNumber':table1.PreviousWorkPFNumber,
                        'PreviousWorkESINumber':table1.PreviousWorkESINumber,
                        'PFNumber':table1.PFNumber,
                        'ESINumber':table1.ESINumber,
                        'NoOfYears':table1.NoOfYears,
                        'WorkStationNameAddress':table1.WorkStationNameAddress,
                        'ReasonForLeft':table1.ReasonForLeft,
                        'WorkStationPhoneNo':table1.WorkStationPhoneNo,
                        'EmployeePaySlip': get_file_image(table1.EmployeePaySlip) if table1.EmployeePaySlip else None,
                        'EmployeeOfferLetter': get_file_image(table1.EmployeeOfferLetter) if table1.EmployeeOfferLetter else None,
                        'EmployeeReliveLetter': get_file_image(table1.EmployeeReliveLetter) if table1.EmployeeReliveLetter else None,
                        'ConfirmedBy':table1.ConfirmedBy,
                        'Created_by': table1.created_by,
                        # 'Location': table1.Location,
                        # 'LocationName': table1.Location.Location_Name,

                    })

                print(EmployeeHistory_Data,'EmployeeHistory_Data')                

                EmployeeMedicalInfo_Data =  Employee_Medical_Information_Detials.objects.filter(Employee=employee.pk) 
                for table2 in EmployeeMedicalInfo_Data:
                    employee_data['EmployeeMedicalInfo'].append({
                        'id':table2.Employee.pk,
                        'PreExisiting_Medical_Condition':table2.PreExisiting_Medical_Condition,
                        'PsychiatricMedicines':table2.PsychiatricMedicines,
                        'PsychiatricMedicinesDetails':table2.PsychiatricMedicinesDetails,
                        'PreviousOperation':table2.PreviousOperation,
                        'SurgeriesDetails':table2.SurgeriesDetails,
                        'VaccinationStatus':table2.VaccinationStatus,
                        'VaccinationStatusDetails':table2.VaccinationStatusDetails,
                        'MedicalFitnessCertificate': get_file_image(table2.MedicalFitnessCertificate) if table2.MedicalFitnessCertificate else None,
                        'AnnualMedicalCheckup': get_file_image(table2.AnnualMedicalCheckup) if table2.AnnualMedicalCheckup else None,
                        'Created_by': table2.created_by,


                    })


                print(EmployeeMedicalInfo_Data,'EmployeeMedicalInfo_Data')
                CurrentHistory_Data =  Current_History_Detials.objects.filter(Employee=employee.pk)  
                for table3 in CurrentHistory_Data:
                    employee_data['EmployeeCurrentDetails'].append({
                        'id':table3.Employee.pk,
                        'DateOfJoining':table3.DateOfJoining,
                        'CurrentEmployeementLocations':table3.CurrentEmployeementLocations.Location_Id if table3.CurrentEmployeementLocations else None,
                        'ReportingManager':table3.ReportingManager,
                        'GovtLeave':table3.GovtLeave,
                        'CasualLeave':table3.CasualLeave,
                        'SickLeave':table3.SickLeave,
                        'TotalLeave1':table3.TotalLeave,
                        'WorkEmail':table3.WorkEmail,
                        # 'IsPF_Applicable':table3.IsPF_Applicable if table3.IsPF_Applicable else 0,
                        'Created_by': table3.created_by,
                    })
                    
                    # 19-2-25
                
                print(CurrentHistory_Data,'CurrentHistory_Data')
                
                
                EmployeeLeavelist_Data = Employee_Leavelist.objects.filter(Employee=employee.pk)
                for table0 in EmployeeLeavelist_Data:
                    employee_data['EmployeeLeavelist'].append({
                        
                        'leave_type':table0.leave_type,
                        'leave_count':table0.leave_count
                    })
                    
                print(EmployeeLeavelist_Data,'EmployeeLeavelist_Data')   
                    
                    # 18-2-25
                    
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
                         'confidential_review_form': get_file_image(table7.confidential_review_form) if table7.confidential_review_form else None,
                         'hod_review_form': get_file_image(table7.hod_review_form) if table7.hod_review_form else None,
                         'hr_review_form': get_file_image(table7.hr_review_form) if table7.hr_review_form else None,
                         'TrainingGivenBy': table7.training_given_by,
                         'TrainingVerifiedBy': table7.training_verified_by,
                         'TrainingCompletedDate': table7.training_completed_date,
                      })
                #  
                print(EmployeeProbationDetails_Data,'EmployeeProbationDetails_Data')  
                
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
                     
                #
                print(EmployeeSecurityDeposit_Data,'EmployeeSecurityDeposit_Data')
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
                   

                print(EmployeeGratuityDetails_Data,'EmployeeGratuityDetails_Data')

                EmployeeAllowance_Data = EmployeeAllowanceDetails.objects.filter(Employee=employee.pk,Status='Active')
                for table10 in EmployeeAllowance_Data:
                    employee_data['EmployeeAllowanceDetails'].append({
                        'allowance_name':table10.allowance,
                        'allowance_percentage':table10.percentage,
                        'allowance_amount':table10.amount,
                    }) 

                print(EmployeeAllowance_Data,'EmployeeAllowance_Data')  

                EmployeeDeduction_Data = EmployeeDeductionDetails.objects.filter(Employee=employee.pk)
                for table11 in EmployeeDeduction_Data:
                    employee_data['EmployeeDeductionDetails'].append({
                        'deduction_name':table11.deduction,
                        'deduction_amount':table11.amount,
                    })
                
                print(EmployeeDeduction_Data,'EmployeeDeduction_Data')
                
                FinancialHistory_Data =  Financial_History_Detials.objects.filter(Employee=employee.pk)
                for table4 in FinancialHistory_Data:
                    employee_data['EmployeeFinancialHistory'].append({
                        'id':table4.Employee.pk,
                        'ctc':table4.ctc,
                        'Salary':table4.Salary,
                        'net_salary':table4.Net_salary,
                        'BasicSalary':table4.BasicSalary,
                        'PF_is_applicable':table4.PF_is_applicable,
                        'AllowanceAmount':table4.Allowance_amount,
                        'DeductionAmount':table4.Deduction_amount,
                        'FinalAllowance':table4.Allowancefinal,
                        'PfForEmployee':table4.PfForEmployee,
                        'SecurityDeposite':table4.SecurityDeposite,
                        'AccountHolderName':table4.AccountHolderName,
                        'AccountNumber':table4.AccountNumber,
                        'BankName':table4.BankName,
                        'Branch':table4.Branch,
                        'IfscCode':table4.IfscCode,
                        'PanNumber':table4.PanNumber,
                        'UploadCsvFile': get_file_image(table4.UploadCsvFile) if table4.UploadCsvFile else None,
                        'Created_by': table4.created_by,


                    })

                print(FinancialHistory_Data,'FinancialHistory_Data')
                EmployeeDocument_Chicklist_Data =  Document_Checklist_Detials.objects.filter(Employee=employee.pk)
                for table5 in EmployeeDocument_Chicklist_Data:
                    employee_data['EmployeeFinancialHistory'].append({
                        'id':table5.Employee.pk,
                        'Resume': get_file_image(table5.Resume) if table5.Resume else None,
                        'PanCard': get_file_image(table5.PanCard) if table5.PanCard else None,
                        'AadharCard': get_file_image(table5.AadharCard) if table5.AadharCard else None,
                        'BankPassbook': get_file_image(table5.BankPassbook) if table5.BankPassbook else None,
                        'ExperienceCertificate': get_file_image(table5.ExperienceCertificate) if table5.ExperienceCertificate else None,
                        'MedicalFitness': get_file_image(table5.MedicalFitness) if table5.MedicalFitness else None,
                        'Offerletter': get_file_image(table5.Offerletter) if table5.Offerletter else None,
                        'Created_by': table5.created_by,
                    })

                print(EmployeeDocument_Chicklist_Data,'EmployeeDocument_Chicklist_Data')
                EmployeeSkill_Data =  Employee_Skills_Detials.objects.filter(Employee=employee.pk)   
                for table6 in EmployeeSkill_Data:
                    employee_data['EmployeeSkillset'].append({
                        'id':table6.Employee.pk,
                        'skill_name':table6.Skill,
                        'skill_level':table6.Level,
                        'Created_by': table6.created_by,
                    }) 

                print(EmployeeSkill_Data,'EmployeeSkill_Data')     


                Employees_data.append(employee_data)
            
            return JsonResponse(Employees_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import base64
import filetype
from io import BytesIO
from .models import (
    Employee_Personal_Form_Detials, UserRegister_Master_Details, Employeement_History_Detials,
    Employee_Medical_Information_Detials, Current_History_Detials, Employee_Leavelist,
    EmployeeProbationDetails, EmployeeSecurityDeposit, Employee_GratuityDetails,
    EmployeeAllowanceDetails, EmployeeDeductionDetails, Financial_History_Detials,
    Document_Checklist_Detials, Employee_Skills_Detials
)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Fetch_Employee_Details(request):
    if request.method == 'GET':
        try:
            def get_file_image(filedata):
                kind = filetype.guess(filedata)
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

            DepartmentId = request.GET.get('deptid')
            EmployeeId = request.GET.get('EmployeeId')  

            Employee_Personal_Info = Employee_Personal_Form_Detials.objects.filter(ActiveStatus='Yes')

            if DepartmentId:
                Employee_Personal_Info = Employee_Personal_Info.filter(Department__Department_Id__in=DepartmentId.split(','))

            if EmployeeId:
                Employee_Personal_Info = Employee_Personal_Info.filter(Employee_ID=EmployeeId)

            idx = 1
            Employees_data = []

            for i, employee in enumerate(Employee_Personal_Info):
                departmentId = ', '.join(str(department.Department_Id) for department in employee.Department.all())
                departments = ', '.join(department.Department_Name for department in employee.Department.all())

                userins = UserRegister_Master_Details.objects.filter(Employee_Id=employee.pk).first()
                userrecord = bool(userins)

                employee_data = {
                    'id': idx + i,
                    'Employee_Id': employee.pk,
                    'userrecord': userrecord,
                    'Title': employee.Tittle.Title_Name if employee.Tittle else None,
                    'FirstName': employee.First_Name,
                    'MiddleName': employee.Middle_Name,
                    'LastName': employee.Last_Name,
                    'FullName': f"{employee.Tittle.Title_Name + ' ' if employee.Tittle else ''}{'.'}{employee.First_Name} {employee.Middle_Name or ''} {employee.Last_Name}".strip(),
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
                    'Photo': get_file_image(employee.Photo) if employee.Photo else None,
                    'Signature': get_file_image(employee.Signature) if employee.Signature else None,
                    'CaptureImage': get_file_image(employee.CaptureImage) if employee.CaptureImage else None,
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

                # Populate related data (EmployeeHistory, EmployeeMedicalInfo, etc.)
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
                        'EmployeePaySlip': get_file_image(table1.EmployeePaySlip) if table1.EmployeePaySlip else None,
                        'EmployeeOfferLetter': get_file_image(table1.EmployeeOfferLetter) if table1.EmployeeOfferLetter else None,
                        'EmployeeReliveLetter': get_file_image(table1.EmployeeReliveLetter) if table1.EmployeeReliveLetter else None,
                        'ConfirmedBy': table1.ConfirmedBy,
                        'Created_by': table1.created_by,
                    })

                EmployeeMedicalInfo_Data = Employee_Medical_Information_Detials.objects.filter(Employee=employee.pk)
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
                        'MedicalFitnessCertificate': get_file_image(table2.MedicalFitnessCertificate) if table2.MedicalFitnessCertificate else None,
                        'AnnualMedicalCheckup': get_file_image(table2.AnnualMedicalCheckup) if table2.AnnualMedicalCheckup else None,
                        'Created_by': table2.created_by,
                    })

                CurrentHistory_Data = Current_History_Detials.objects.filter(Employee=employee.pk)
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
                        'confidential_review_form': get_file_image(table7.confidential_review_form) if table7.confidential_review_form else None,
                        'hod_review_form': get_file_image(table7.hod_review_form) if table7.hod_review_form else None,
                        'hr_review_form': get_file_image(table7.hr_review_form) if table7.hr_review_form else None,
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

                EmployeeAllowance_Data = EmployeeAllowanceDetails.objects.filter(Employee=employee.pk, Status='Active')
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

                FinancialHistory_Data = Financial_History_Detials.objects.filter(Employee=employee.pk)
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
                        'UploadCsvFile': get_file_image(table4.UploadCsvFile) if table4.UploadCsvFile else None,
                        'Created_by': table4.created_by,
                    })

                EmployeeDocument_Checklist_Data = Document_Checklist_Detials.objects.filter(Employee=employee.pk)
                for table5 in EmployeeDocument_Checklist_Data:
                    employee_data['EmployeeDocumentChecklist'].append({
                        'id': table5.Employee.pk,
                        'Resume': get_file_image(table5.Resume) if table5.Resume else None,
                        'PanCard': get_file_image(table5.PanCard) if table5.PanCard else None,
                        'AadharCard': get_file_image(table5.AadharCard) if table5.AadharCard else None,
                        'BankPassbook': get_file_image(table5.BankPassbook) if table5.BankPassbook else None,
                        'ExperienceCertificate': get_file_image(table5.ExperienceCertificate) if table5.ExperienceCertificate else None,
                        'MedicalFitness': get_file_image(table5.MedicalFitness) if table5.MedicalFitness else None,
                        'Offerletter': get_file_image(table5.Offerletter) if table5.Offerletter else None,
                        'Created_by': table5.created_by,
                    })

                EmployeeSkill_Data = Employee_Skills_Detials.objects.filter(Employee=employee.pk)
                for table6 in EmployeeSkill_Data:
                    employee_data['EmployeeSkillset'].append({
                        'id': table6.Employee.pk,
                        'skill_name': table6.Skill,
                        'skill_level': table6.Level,
                        'Created_by': table6.created_by,
                    })

                Employees_data.append(employee_data)

            if EmployeeId and not Employees_data:
                return JsonResponse({'error': f'No employee found with ID {EmployeeId}'})

            return JsonResponse(Employees_data, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'})



from dateutil.relativedelta import relativedelta
from django.views.decorators.csrf import csrf_exempt
from datetime import date
from calendar import month_name


@csrf_exempt
@require_http_methods(['GET'])
def get_employee_gratuity_monthly(request):
    try:
        employees = Employee_Personal_Form_Detials.objects.all()
        if not employees.exists():
            return JsonResponse({"message": "No employees found."})

        today = date.today()
        cutoff_date = date(today.year - 1, 12, 31)  # End of last completed year

        all_employees = []
        total_gratuity_all = 0

        for emp in employees:
            # Joining date
            graduity_status = Employee_GratuityDetails.objects.filter(Employee=emp,require_gratuity=True).first()
            if not graduity_status:
                continue
            current_history = Current_History_Detials.objects.filter(Employee=emp).first()
            if not current_history or not current_history.DateOfJoining:
                continue

            try:
                doj = datetime.strptime(str(current_history.DateOfJoining), "%Y-%m-%d").date()
            except ValueError:
                continue

            # Salary
            salary_record = Salary_Maintenance_Detials.objects.filter(Employee=emp).first()
            if salary_record and salary_record.BasicSalary:
                basic_salary = float(salary_record.BasicSalary)
            else:
                fin_record = Financial_History_Detials.objects.filter(Employee=emp).first()
                basic_salary = float(fin_record.BasicSalary or 0) if fin_record else 0

            if basic_salary <= 0:
                continue

            monthly_data = []
            emp_total_completed = 0
            emp_total_uncompleted = 0

            # ✅ Completed years (till last Dec)
            current = doj.replace(day=1)
            while current <= cutoff_date.replace(day=1):
                gratuity_amount = round((basic_salary * 15) / (26 * 12), 2)
                emp_total_completed += gratuity_amount

                monthly_data.append({
                    "Month": f"{month_name[current.month]} {current.year}",
                    "Type": "Completed",
                    "GratuityAmount": gratuity_amount
                })

                current += relativedelta(months=1)

            # ✅ Current uncompleted year (till last completed month, skip current month)
            if today.year >= doj.year:
                current_year_start = date(today.year, 1, 1)
                current = max(doj.replace(day=1), current_year_start)

                last_completed_month = today.replace(day=1) - relativedelta(months=1)

                while current <= last_completed_month:
                    gratuity_amount = round((basic_salary * 15) / (26 * 12), 2)
                    emp_total_uncompleted += gratuity_amount

                    monthly_data.append({
                        "Month": f"{month_name[current.month]} {current.year}",
                        "Type": "Uncompleted",
                        "GratuityAmount": gratuity_amount
                    })

                    current += relativedelta(months=1)
            else:
                last_completed_month = cutoff_date

            # ✅ Final full gratuity till last completed year
            completed_years = relativedelta(cutoff_date, doj).years
            final_gratuity = round((basic_salary * 15 * completed_years) / 26, 0)

            # ✅ This month gratuity (provision)
            this_month_gratuity = round((basic_salary * 15) / (26 * 12), 0)

            # ✅ Accrued till last completed month
            accrued = round(emp_total_uncompleted + final_gratuity, 0)

            # ✅ Accrued + this month’s gratuity
            accrued_with_this_month = accrued + this_month_gratuity

            # Add to grand total (only completed years official)
            total_gratuity_all += final_gratuity

            all_employees.append({
                "EmployeeID": emp.Employee_ID,
                "EmployeeName": f"{emp.First_Name} {emp.Last_Name}",
                "DateOfJoining": doj.strftime("%Y-%m-%d"),
                "BasicSalary": basic_salary,
                "MonthlyGratuity": monthly_data,
                "CompletedYearsGratuity": round(emp_total_completed, 0),
                "Accrued": accrued,   # till last completed month
                "ThisMonthGratuity": this_month_gratuity,
                "AccruedWithThisMonth": accrued_with_this_month,
                "EmployeeTotalGratuity": round(final_gratuity, 0),  # official completed years only
                "LastUncompletedMonth": f"{month_name[last_completed_month.month]} {last_completed_month.year}"
            })

        response = {
            "employees": all_employees,
            "grand_total_gratuity": round(total_gratuity_all, 2)
        }

        return JsonResponse(response, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(['GET'])
def get_security_deposit_from_table(request):
    try:
        deposits = EmployeeSecurityDeposit.objects.select_related('Employee').all()
        if not deposits.exists():
            return JsonResponse({"message": "No employees found in Security Deposit table."})

        result = []

        for deposit_record in deposits:
            emp = deposit_record.Employee
            if not emp:
                continue

            # Get joining date from current history
            current_history = Current_History_Detials.objects.filter(Employee=emp).first()
            if not current_history or not current_history.DateOfJoining:
                continue

            try:
                doj = datetime.strptime(str(current_history.DateOfJoining), "%Y-%m-%d").date()
            except ValueError:
                continue

            # Only include first month if joined on 1st
            start_month_flag = 1 if doj.day == 1 else 0
            months_to_calculate = 7 - start_month_flag
            if months_to_calculate <= 0:
                continue

            # Get total salary from Financial_History_Detials
            fin_record = Financial_History_Detials.objects.filter(Employee=emp).first()
            if fin_record and fin_record.Salary:
                total_salary = float(fin_record.Salary)
            elif fin_record and fin_record.Net_salary:
                total_salary = float(fin_record.Net_salary)
            elif fin_record and fin_record.BasicSalary:
                # fallback to BasicSalary + Allowancefinal
                total_salary = float(fin_record.BasicSalary or 0) + float(fin_record.Allowancefinal or 0)
            else:
                total_salary = 0

            if total_salary <= 0:
                continue

            total_deposit = 0
            monthly_data = []

            for m in range(1, months_to_calculate + 1):
                if m <= 6:
                    deposit_amount = round(total_salary * 0.15, 2)
                    month_type = "15%"
                else:  # 7th month
                    deposit_amount = round(total_salary * 0.10, 2)
                    month_type = "10%"

                total_deposit += deposit_amount

                # Calculate actual month and year
                month_number = doj.month + m - 1
                year = doj.year + (month_number - 1) // 12
                month_number = ((month_number - 1) % 12) + 1

                monthly_data.append({
                    "Month": f"{month_name[month_number]} {year}",
                    "Percentage": month_type,
                    "DepositAmount": deposit_amount
                })

            result.append({
                "EmployeeID": emp.Employee_ID,
                "EmployeeName":f'{emp.First_Name} {emp.Last_Name}',
                "DateOfJoining": doj.strftime("%Y-%m-%d"),
                "TotalSalary": total_salary,
                "MonthlyDeposit": monthly_data,
                "TotalDeposit": total_deposit
            })

        return JsonResponse({"employees": result}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def get_salary_for_month(employee, year, month):
    """
    Get the applicable salary record for employee in a given month.
    If not found, fallback to the latest (current) salary record.
    """
    month_start = date(year, month, 1)

    # Try to get salary active in that month
    salary = (Salary_Maintenance_Detials.objects
              .filter(Employee=employee, created_at__lte=month_start)
              .order_by('-created_at')
              .first())
    
    if not salary:
        # Fallback → use the latest/current salary
        salary = (Salary_Maintenance_Detials.objects
                  .filter(Employee=employee)
                  .order_by('-created_at')
                  .first())
    return salary


@csrf_exempt
@require_http_methods(['GET'])
def get_employee_deductions(request):
    try:
        salary_records = Salary_Maintenance_Detials.objects.select_related('Employee').all()
        if not salary_records.exists():
            return JsonResponse({"message": "No employees found in Salary table."})

        result = []
        included_count = 0  

        for record in salary_records:
            employee = record.Employee
            if not employee or not getattr(employee, 'Employee_ID', None):
                continue

            emp_id = employee.Employee_ID
            emp_name = f"{employee.First_Name} {employee.Last_Name}" if employee.First_Name or employee.Last_Name else "Unknown"
            gender = employee.Gender.lower() if employee and employee.Gender else "male"

            # Date of Joining
            history = Current_History_Detials.objects.filter(Employee=employee).first()
            doj_str = getattr(history, 'DateOfJoining', None)
            try:
                doj = datetime.strptime(str(doj_str), "%Y-%m-%d").date() if doj_str else date.today()
            except:
                doj = date.today()

            today = date.today()
            months_worked = max((today.year - doj.year) * 12 + (today.month - doj.month) + 1, 1)

            monthly_details = []
            total_salary = total_pf = total_pt = total_tds = total_present = total_absent = 0

            for month_offset in range(months_worked):
                month_start = (doj + relativedelta(months=month_offset)).replace(day=1)
                month_end = month_start + relativedelta(day=31)

                # Get salary active in this month, or fallback to current
                active_salary = get_salary_for_month(employee, month_start.year, month_start.month)
                if not active_salary:
                    continue   # still nothing, skip this employee

                basic_salary = float(active_salary.BasicSalary or 0)
                Salary = Financial_History_Detials.objects.get(Employee=active_salary.Employee).Salary
                tds_percentage = getattr(active_salary, 'TDS_Percentage', 0) or 0
                pf_applicable = getattr(active_salary, 'PF_is_applicable', False)

                # Attendance
                attendance_days = Employee_Attendance.objects.filter(
                    Employee=employee,
                    Attendance_Status='Present',
                    Date__gte=month_start,
                    Date__lte=month_end
                ).count()

                absent_days = 30 - attendance_days

                # Salary calc
                per_day_salary = basic_salary / 30 if basic_salary > 0 else 0
                earned_salary = round(per_day_salary * attendance_days, 2)
                pf_amount = round((earned_salary * 12) / 100, 2) if pf_applicable else 0

                # PT calc
                pt_amount = 0
                if gender == 'male' and earned_salary != 0:
                    if Salary >= 10000 and earned_salary != 0:
                        pt_amount = 200
                    elif Salary >= 7500 and earned_salary != 0:
                        pt_amount = 175
                else:
                    if Salary >= 25000 and earned_salary != 0:
                        pt_amount = 200

                # TDS
                tds_amount = round((earned_salary * tds_percentage) / 100, 2)

                monthly_details.append({
                    "Month": month_start.strftime("%B-%Y"),
                    "BasicSalary": basic_salary,
                    "Salary": Salary,
                    "EarnedSalary": earned_salary,
                    "PF": pf_amount,
                    "PT": pt_amount,
                    "TDS": tds_amount,
                    "AttendanceDays": attendance_days,
                    "AbsentDays": absent_days
                })

                # Totals
                total_salary += earned_salary
                total_pf += pf_amount
                total_pt += pt_amount
                total_tds += tds_amount
                total_present += attendance_days
                total_absent += absent_days

            result.append({
                "EmployeeID": emp_id,
                "EmployeeName": emp_name,
                "Gender": gender,
                 "BasicSalary": basic_salary,
                    "Salary": Salary,
                "MonthsWorked": months_worked,
                "MonthlyDetails": monthly_details,
                "TotalSalary": round(total_salary, 2),
                "TotalPF": round(total_pf, 2),
                "TotalPT": round(total_pt, 2),
                "TotalTDS": round(total_tds, 2),
                "TotalPresentDays": total_present,
                "TotalAbsentDays": total_absent
            })

            included_count += 1  

        return JsonResponse({
            "total_employees_included": included_count,
            "employees": result
        }, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def get_employee_monthwise_payment(request):
    try:
        # Salary month/year
        month = request.GET.get('month')
        year = request.GET.get('year')

        ot=0
        incomtax = 0

        if not month or not year:
            return JsonResponse({"error": "month and year are required"}, status=400)

        month = int(month)
        year = int(year)

        # Security deposit month (optional)
        deposit_month_str = request.GET.get('deposit_month')  # e.g., 10 for October
        deposit_month = int(deposit_month_str) if deposit_month_str else None

        deposits = Financial_History_Detials.objects.select_related(
            'Employee', 'EmployeeCurrentHistoryInfo', 'EmployeeMedicalInfo'
        ).prefetch_related('Employee__Department').all()

        result = []
        included_count = 0

        for emp in deposits:
            employee = emp.Employee
            if not employee or not getattr(employee, 'Employee_ID', None):
                continue

            emp_id = employee.Employee_ID
            emp_name = f"{employee.First_Name} {employee.Last_Name}" if employee.First_Name or employee.Last_Name else ""
            gender = employee.Gender.lower() if employee and employee.Gender else "male"
            departments = [dept.Department_Name for dept in employee.Department.all()] if employee else []

            # Date of joining
            doj_str = getattr(emp.EmployeeCurrentHistoryInfo, 'DateOfJoining', None)
            try:
                doj = datetime.strptime(doj_str, "%Y-%m-%d").date() if doj_str else date(year, month, 1)
            except:
                doj = date(year, month, 1)

            # Month range for salary
            month_start = date(year, month, 1)
            month_end = (month_start + relativedelta(months=1)) - relativedelta(days=1)
            if doj > month_start:
                month_start = doj

            # Attendance
            attendance_days = Employee_Attendance.objects.filter(
                Employee=employee,
                Attendance_Status='Present',
                Date__gte=month_start,
                Date__lte=month_end
            ).count() if employee else 0

            total_days_in_month = 30  # always assume 30 days
            absent_days = total_days_in_month - attendance_days

            # Salary calculations
            basic_salary = float(emp.BasicSalary or 0)
            daily_salary = basic_salary / 30  # use fixed 30 days
            earned_salary = round(daily_salary * attendance_days, 2)
            lossofpay = round(daily_salary * absent_days, 2)


            pf_amount = round(emp.PF_EmployeeAmount if getattr(emp, 'PF_is_applicable', False) else 0, 2)
            esi_amount = round(emp.ESI_Amount if getattr(emp, 'ESI_is_applicable', False) else 0, 2)

            # Professional Tax
            pt_amount = 0
            if gender == 'male':
                if basic_salary >= 10000:
                    pt_amount = 200
                elif basic_salary >= 7500:
                    pt_amount = 175
            else:
                if basic_salary >= 25000:
                    pt_amount = 200

            tds_amount = round(emp.TDS_Amount if getattr(emp, 'TDS_is_applicable', False) else 0, 2)

            # Allowances
            hra = round(emp.Allowancefinal or 0, 2)
            medical = round(getattr(emp.EmployeeMedicalInfo, 'MedicalAllowancefinal', 0) if emp.EmployeeMedicalInfo else 0, 2)
            travel = round(getattr(emp.EmployeeCurrentHistoryInfo, 'TravelAllowancefinal', 0) if emp.EmployeeCurrentHistoryInfo else 0, 2)
            
            advance_deduction = round(emp.Deduction_amount or 0, 2)

            total_earnings = round(earned_salary + hra + medical + travel, 2)
            total_deductions = round(pf_amount + esi_amount + pt_amount + lossofpay + advance_deduction, 2)
            net_salary = round(emp.Net_salary or (total_earnings - total_deductions), 2)

            # --------------------------
            # Security Deposit Calculation
            # --------------------------
            security_deposit_for_month = 0
            try:
                security_record = EmployeeSecurityDeposit.objects.filter(Employee=employee).first()
                if security_record and deposit_month:
                    # Calculate months_to_calculate
                    start_month_flag = 1 if doj.day == 1 else 0
                    months_to_calculate = 7 - start_month_flag
                    total_salary_for_sd = 0
                    if emp.Salary:
                        total_salary_for_sd = float(emp.Salary)
                    elif emp.Net_salary:
                        total_salary_for_sd = float(emp.Net_salary)
                    else:
                        total_salary_for_sd = float(emp.BasicSalary or 0) + float(emp.Allowancefinal or 0)

                    # Determine the month index for deposit calculation
                    m = deposit_month - doj.month + 1
                    if 1 <= m <= months_to_calculate:
                        if m <= 6:
                            security_deposit_for_month = round(total_salary_for_sd * 0.15, 2)
                        else:
                            security_deposit_for_month = round(total_salary_for_sd * 0.10, 2)
                    else:
                        security_deposit_for_month = 0
            except:
                security_deposit_for_month = 0

            # --------------------------
            # Append result
            # --------------------------
            payslips=None
            advance = None
            try:
              payslips = Employee_PaySlips.objects.filter(
                  Employee=emp.Employee,
    PaySlip_Date__month=month,
    PaySlip_Date__year=year
).first() 
            except Exception as e:
              return JsonResponse({'err':str(e)},safe=False)
            
            try:
               
               print(emp.EmpHistory_Id,'history')
               advance= Employee_Advance_Request.objects.filter(
    Employee_Id=emp,
    Status='Approved',
    Installment_Status='Pending',
    IssuedDate__month=month,
    Repayment_Due__gt=0
).first()
            
            except Exception as e:
                return JsonResponse({'err':str(e)})  
            result.append({
                "Employee_ID": emp_id,
                "EmployeeName": emp_name,
                "Departments": departments,
                "Designation": employee.Designation.Designation_Name if employee and employee.Designation else "",
                "BasicSalary": round(basic_salary, 2),
                "GrossSalary": float(emp.Allowance_amount or 0) + float(emp.BasicSalary or 0),
                "Salary": emp.Salary if emp and emp.Salary else '',
                "Allowance": emp.Allowance_amount if emp and emp.Allowance_amount else 0,
                "Gender": gender,
                "Status":payslips.Status if payslips else 'Pending',
                "PFNumber": emp.PFNumber or "",
                "PanNumber": emp.PanNumber or "",
                "BankName": emp.BankName or "",
                "AccountNumber": emp.AccountNumber or "",
                "TotalDays": total_days_in_month,
                "DateofJoining": doj.strftime("%Y-%m-%d"),
                "leave_days": absent_days,
                "PresentDays": attendance_days,
                "SalaryType": getattr(emp, 'SalaryType', 'Salary'),
                "HRAfinal": hra,
                "MedicalAllowancefinal": medical,
                "TravelAllowancefinal": travel,
                "PfForEmployee_Amount": earned_salary*(15/100),
                "TDS_Amount": emp.TDS_Amount,
                "EsiAmount": esi_amount,
                "ProfessionalTax": pt_amount,
                "LossofPay": lossofpay,
                "AmountDeduct_PerMonth": advance_deduction,
                "earnings": total_earnings,
                "deductions":  round((earned_salary*(15/100) if earned_salary else 0)+ (esi_amount if esi_amount else 0) + (pt_amount if pt_amount else 0) + (lossofpay if lossofpay else 0) + (advance.AmountDeduct_PerMonth if advance else 0), 2),
                "NetSalary": (round(float(basic_salary)+float(emp.Allowance_amount if emp and emp.Allowance_amount else 0)+float(incomtax)+float(ot))-((round((earned_salary*(15/100) if earned_salary else 0)+ (esi_amount if esi_amount else 0) + (pt_amount if pt_amount else 0) + (lossofpay if lossofpay else 0) + (advance.AmountDeduct_PerMonth if advance else 0), 2)))),
                "FinanceHistory": emp.EmpHistory_Id,
                "Advance": advance.AmountDeduct_PerMonth if advance else '',
                "SecurityDeposit_ForMonth": security_deposit_for_month
            })

            included_count += 1

        return JsonResponse({
            "total_employees_included": included_count,
            "employees": result
        }, safe=True)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
from django.db.models import Prefetch


@csrf_exempt
@require_http_methods(["GET"])
def get_employees_department_wise(request):
    """
    Returns employees grouped by department.
    """
    try:
        departments = Department_Detials.objects.all().prefetch_related("employee_personal_form_detials_set")

        data = []
        for dept in departments:
            emp_list = []
            for emp in dept.employee_personal_form_detials_set.all():
                emp_list.append({
                    "Employee_ID": emp.Employee_ID,
                    "Existing_Employee_ID": emp.Existing_Employee_ID,
                    "Employee_Name": f"{emp.First_Name} {emp.Last_Name or ''}".strip(),
                    "Gender": emp.Gender,
                    "Contact_Number": emp.Contact_Number,
                })

            if emp_list:  # only include departments that have employees
                data.append({
                    "Department_Id": dept.Department_Id,
                    "Department_Name": dept.Department_Name,  # adjust field name if different
                    "Employees": emp_list
                })

        return JsonResponse({"departments": data}, safe=False)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


@csrf_exempt
@require_http_methods(["GET"])
def get_shift_master(request):
    """
    Returns all shift details from DutyRousterMaster.
    """
    try:
        shifts = DutyRousterMaster.objects.filter(Status=True).values(
            "ShiftId",
            "ShiftName",
            "StartTime",
            "EndTime",
            "ShiftHours",
            "DayOff",
            "BranchID_id",
            "Location_id",
            "Created_by",
            "Created_at",
            "Updated_at"
        )

        return JsonResponse({"shifts": list(shifts)}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def save_employee_shifts(request):
    try:
        body = json.loads(request.body)
        created_by = body.get("created_by", "system")
        location_id = body.get("location_id")
        allocations = body.get("allocations", [])

        saved_records = []
        for alloc in allocations:
            emp_id = alloc.get("employee_id")
            shift_id = alloc.get("shift_id")
            shift_date = alloc.get("date")

            if not (emp_id and shift_id and shift_date):
                continue  

            # 🔹 Convert shift_date to YYYY-MM-DD if it's like "25-Aug"
            # 🔹 Convert shift_date safely into YYYY-MM-DD
            try:
                if "/" in shift_date:  
                    # Format: 01/09/2025
                    shift_date = datetime.strptime(shift_date, "%d/%m/%Y").date()
                elif "-" in shift_date and not shift_date.startswith("20"):
                    # Format: 25-Aug
                    shift_date = datetime.strptime(shift_date, "%d-%b").replace(year=datetime.now().year).date()
                else:
                    # Format: 2025-09-01
                    shift_date = datetime.strptime(shift_date, "%Y-%m-%d").date()
            except Exception:
                return JsonResponse({"status": "error", "message": f"Invalid date format: {shift_date}"}, status=400)


            try:
                employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=emp_id)
                shift = DutyRousterMaster.objects.get(ShiftId=shift_id)

                obj = ShiftDetails_Master.objects.create(
                    Employee=employee,
                    Shift_Id=shift,
                    ShiftDate=shift_date,
                    Status="Assigned",
                    Create_by=created_by,
                    Location_Name_id=location_id
                )

                saved_records.append({
                    "employee_id": emp_id,
                    "shift_id": shift_id,
                    "shift_date": str(shift_date)
                })

            except Employee_Personal_Form_Detials.DoesNotExist:
                continue
            except DutyRousterMaster.DoesNotExist:
                continue

        return JsonResponse({"status": "success", "saved": saved_records}, status=201)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
    


@csrf_exempt
@require_http_methods(['GET'])
def get_employee_Salary_payment(request):
    """
    Employee salary payment details using only Employee_PaySlips and Employee_PaySlips_Details.
    """
    try:
        # Salary month/year
        month = request.GET.get('month')
        year = request.GET.get('year')

        if not month or not year:
            return JsonResponse({"error": "month and year are required"}, status=400)

        month = int(month)
        year = int(year)

        # Get payslips for this month/year
        payslips = Employee_PaySlips.objects.filter(
            PaySlip_Date__month=month,
            PaySlip_Date__year=year
        )

        result = []
        for slip in payslips:
            details = Employee_PaySlips_Details.objects.filter(PaySlip_Id=slip).first()
            tra = Financial_History_Detials.objects.get(Employee=slip.Employee)
            result.append({
                "Employee_ID": slip.Employee.Employee_ID if slip.Employee else None,
                "EmployeeName": f"{slip.Employee.First_Name} {slip.Employee.Last_Name}" if slip.Employee else "",
                "Status": slip.Status or "Pending",
                "BankName":tra.BankName if slip.Employee else "",
                "Branch": tra.Branch if slip.Employee else "",
                "AccountNumber":tra.AccountNumber if slip.Employee else "",
                "NetSalary": round(details.NetSalary if details else 0, 2),
            })

        return JsonResponse({
            "total_employees_included": len(result),
            "employees": result
        }, safe=True)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt 
@require_http_methods(['GET'])
def get_Employee_PF_Details_for_rep(request):
    """
    PF details report using only Employee_PaySlips and Employee_PaySlips_Details.
    """
    try:
        # Salary month/year
        month = request.GET.get('month')
        year = request.GET.get('year')

        if not month or not year:
            return JsonResponse({"error": "month and year are required"}, status=400)

        month = int(month)
        year = int(year)

        # Get payslips
        payslips = Employee_PaySlips.objects.filter(
            PaySlip_Date__month=month,
            PaySlip_Date__year=year
        )

        result = []
        for slip in payslips:
            details = Employee_PaySlips_Details.objects.filter(PaySlip_Id=slip).first()

            result.append({
                "Employee_ID": slip.Employee.Employee_ID if slip.Employee else None,
                "EmployeeName": f"{slip.Employee.First_Name} {slip.Employee.Last_Name}" if slip.Employee else "",
                "PF_Amount": round(details.PFAmount if details and details.PFAmount else 0, 2),
                "Status": slip.Status or "Pending",
                "Earning_salary": round(details.TotalEarning if details and details.TotalEarning else 0, 2),
            })

        return JsonResponse({
            "total_employees_included": len(result),
            "employees": result
        }, safe=True)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(['GET'])
def get_employee_monthwise_payment_full(request):
    """
    Full employee salary/payment details for given month/year
    using ONLY Employee_PaySlips and Employee_PaySlips_Details.
    """
    try:
        # Salary month/year
        month = request.GET.get('month')
        year = request.GET.get('year')

        if not month or not year:
            return JsonResponse({"error": "month and year are required"}, status=400)

        month = int(month)
        year = int(year)

        # Get payslips for this month/year
        payslips = Employee_PaySlips.objects.filter(
            PaySlip_Date__month=month,
            PaySlip_Date__year=year
        )

        result = []
        for slip in payslips:
            employee = slip.Employee
            details = Employee_PaySlips_Details.objects.filter(PaySlip_Id=slip).first()

            if not employee:
                continue
            employee = Employee_Personal_Form_Detials.objects.prefetch_related("Department").get(Employee_ID=employee.Employee_ID)
            departments = list(employee.Department.values_list("Department_Name", flat=True))
            result.append({
                "Employee_ID": employee.Employee_ID,
                "EmployeeName": f"{employee.First_Name} {employee.Last_Name}",
                "Designation": employee.Designation.Designation_Name if employee.Designation else "",
                "BasicSalary": slip.Paid_Salary or 0,
                "GrossSalary": details.TotalEarning if details else 0,
                "Salary": slip.Paid_Salary or 0,
                 "Departments":departments,
                # Allowances (if you want detailed breakdowns, can be expanded here)
                "Allowance": sum([a.Amount for a in details.Allowances.all()]) if details else 0,

                "Status": slip.Status or "Pending",

                # Fixed days assumption (since no attendance model allowed now)
                "TotalDays": 30,
                "leave_days": 0,
                "PresentDays": 30,

                # Placeholder for values that existed in old model
                "HRAfinal": 0,
                "MedicalAllowancefinal": 0,
                "TravelAllowancefinal": 0,

                # Deductions
                "PfForEmployee_Amount": details.PFAmount if details else 0,
                "TDS_Amount": details.TDSAmount if details else 0,
                "EsiAmount": details.ESIAmount if details else 0,
                "ProfessionalTax": details.ProfessionalTax if details else 0,
                "LossofPay": details.LossOFPay if details else 0,
                "AmountDeduct_PerMonth": details.AdvanceAmountDeduct if details else 0,

                # Totals
                "earnings": details.TotalEarning if details else 0,
                "deductions": details.TotalDeduction if details else 0,
                "NetSalary": details.NetSalary if details else 0,

                # Advance/Security deposit removed → return 0
                "Advance": 0,
                "SecurityDeposit_ForMonth": 0,
            })

        return JsonResponse({
            "total_employees_included": len(result),
            "employees": result
        }, safe=True)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    
    
@csrf_exempt
@require_http_methods(["GET"])
def get_employee_attendance(request):
    try:
        # Optional filters
        employee_id = request.GET.get("employee_id")
        date_str = request.GET.get("date")   # format: YYYY-MM-DD
        month = request.GET.get("month")
        year = request.GET.get("year")

        attendances = Employee_Attendance.objects.all()

        # Filter by employee
        if employee_id:
            attendances = attendances.filter(Employee__Employee_ID=employee_id)

        # Filter by specific date
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
                attendances = attendances.filter(Date=date_obj)
            except ValueError:
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

        # Filter by month/year
        if month:
            attendances = attendances.filter(Date__month=int(month))
        if year:
            attendances = attendances.filter(Date__year=int(year))

        # Serialize data
        data = []
        for att in attendances:
            data.append({
                "Attendance_Id": att.Attendance_Id,
                "Employee_Id": att.Employee.Employee_ID if att.Employee else None,
                "Employee_Name": f'{str(att.Employee.First_Name)} {str(att.Employee.Middle_Name)} {str(att.Employee.Last_Name)}' if att.Employee else '',
                "Date": att.Date.strftime("%Y-%m-%d") if att.Date else None,
                "In_Time": att.In_Time.strftime("%H:%M:%S") if att.In_Time else None,
                "In_TimePeriod": att.In_TimePeriod,
                "Out_Time": att.Out_Time.strftime("%H:%M:%S") if att.Out_Time else None,
                "Out_TimePeriod": att.Out_TimePeriod,
                "Working_Hours": att.Working_Hours,
                "Attendance_Status": att.Attendance_Status,
                "Location_Id": att.Location.Location_Id if att.Location else None,
                "CreatedBy": att.CreatedBy,
                "created_at": att.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": att.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            })

        return JsonResponse({"attendance": data}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
