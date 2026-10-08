import json
import os
from turtle import pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import (
    Existing_Patient_Details,
    Existing_Patient_RevisitPatient,
    Patient_Detials,
    Patient_Visit_Detials,
    
    Patient_Referral_Detials,
    Patient_Appointment_Registration_Detials
)
from Masters.models import (
    Speciality_Detials,
    Doctor_Personal_Form_Detials,
    Employee_Personal_Form_Detials
)
from django.db.models import Max
from datetime import datetime
from django.db import transaction
import pandas as pd

from HR_Management.models import *
import base64
# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Patient_Registration(request):
    
#     @transaction.atomic
#     def generate_or_update_visit_id(patient, register_type):
#         # Get today's date
#         today = datetime.now().date()
        
#         # Find the maximum VisitId for the given patient and date
#         existing_visit = Patient_Visit_Detials.objects.filter(
#             PatientId=patient,
#             created_at__date=today
#         ).first()
        
#         if existing_visit:
#             # If a visit record exists for today, you might want to update or perform other actions.
#             # For example, you might just return the existing record or update certain fields.
#             # Here, we simply return the existing record's ID.
#             return existing_visit.VisitId
#         else:
#             # If no visit record exists for today, create a new one
#             max_visit_id = Patient_Visit_Detials.objects.filter(
#                 PatientId=patient
#             ).aggregate(max_id=Max('VisitId'))['max_id']
            
#             next_visit_id = 1 if max_visit_id is None else max_visit_id + 1
            
#             patient_visit = Patient_Visit_Detials.objects.create(
#                 PatientId=patient,
#                 VisitId=next_visit_id,
#                 RegisterType=register_type
#             )
            
#             return patient_visit.VisitId
        
#     if request.method == 'POST':
#         try:
#             print('hiiii')
#             data = json.loads(request.body)
            
#             # Extract and validate data
            
#             Isedit = data.get('Isedit', False)
#             register_type = data.get('RegisterType', '')
#             register_Id = data.get('RegisterType', None)
#             ip_admission = data.get('Admission_details','')
#             patient_id = data.get('PatientId')
#             visit_id = data.get('visit_id',0)
#             phone_no = data.get('PhoneNo', '')
#             title = data.get('Title', '')
#             first_name = data.get('FirstName', '')
#             middle_name = data.get('MiddleName', '')
#             sur_name = data.get('SurName', '')
#             gender = data.get('Gender', '')
#             alias_name = data.get('AliasName', '')
#             dob = data.get('DOB', '')
#             age = data.get('Age', '')
#             email = data.get('Email', '')
#             blood_group = data.get('BloodGroup', '')
#             occupation = data.get('Occupation', '')
#             religion = data.get('Religion', '')
#             nationality = data.get('Nationality', '')
#             unique_id_type = data.get('UniqueIdType', '')
#             unique_id_no = data.get('UniqueIdNo', '')
            
#             visit_purpose = data.get('VisitPurpose', '')
#             specialization = data.get('Specialization', '')
#             doctor_name = data.get('DoctorName', '')
#             case_sheet_no = data.get('CaseSheetNo', '')
#             anc_number = data.get('ANCNumber', '')
#             mcts_no = data.get('MCTSNo', '')
#             complaint = data.get('Complaint', '')
#             patient_type = data.get('PatientType', '')
#             patient_category = data.get('PatientCategory', '')
#             insurance_name = data.get('InsuranceName', '')
#             insurance_type = data.get('InsuranceType', '')
#             client_name = data.get('ClientName', '')
#             client_type = data.get('ClientType', '')
#             client_employee_id = data.get('ClientEmployeeId', '')
#             client_employee_designation = data.get('ClientEmployeeDesignation', '')
#             client_employee_relation = data.get('ClientEmployeeRelation', '')
#             employee_id = data.get('EmployeeId', '')
#             employee_relation = data.get('EmployeeRelation', '')
#             doctor_id = data.get('DoctorId', '')
#             doctor_relation = data.get('DoctorRelation', '')
#             donation_type = data.get('DonationType', '')
#             is_mlc = data.get('IsMLC', False)
#             flagging = data.get('Flagging', '')
#             is_referral = data.get('IsReferral', False)
        
#             referral_source = data.get('ReferralSource', '')
#             referred_by = data.get('ReferredBy', '')
            
#             door_no = data.get('DoorNo', '')
#             street = data.get('Street', '')
#             area = data.get('Area', '')
#             city = data.get('City', '')
#             state = data.get('State', '')
#             country = data.get('Country', '')
#             pincode = data.get('Pincode', '')

#             DrInchargeatTimeofAdmission = data.get('DrInchargeAtTimeOfAdmission','')
#             NexttokinName = data.get('NextToKinName','')
#             relation = data.get('Relation','')
#             relativePhoneno = data.get('RelativePhoneNo','')
#             personLiableforpayment = data.get('PersonLiableForBillPayment','')
#             familyhead = data.get('FamilyHead','')
#             familyheadName = data.get('FamilyHeadName','')
#             ipKitGiven = data.get('IpKitGiven','')

#             created_by = data.get('Created_by', '')

#             specialization_instance = Speciality_Detials.objects.get(Speciality_Id=specialization) if specialization else None
#             doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
#             referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=referred_by) if referred_by else None
#             employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
#             doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            
#             with transaction.atomic():
#                 if patient_id:
#                     patient = Patient_Detials.objects.get(PatientId=patient_id)
#                     patient.PhoneNo = phone_no
#                     patient.Title = title
#                     patient.FirstName = first_name
#                     patient.MiddleName = middle_name
#                     patient.SurName = sur_name
#                     patient.Gender = gender
#                     patient.AliasName = alias_name
#                     patient.DOB = dob
#                     patient.Age = age
#                     patient.Email = email
#                     patient.BloodGroup = blood_group
#                     patient.Occupation = occupation
#                     patient.Religion = religion
#                     patient.Nationality = nationality
#                     patient.UniqueIdType = unique_id_type
#                     patient.UniqueIdNo = unique_id_no
#                     patient.DoorNo = door_no
#                     patient.Street = street
#                     patient.Area = area
#                     patient.City = city
#                     patient.State = state
#                     patient.Country = country
#                     patient.Pincode = pincode
#                     patient.save()

#                 else:
#                     patient = Patient_Detials.objects.create(
#                         PhoneNo=phone_no,
#                         Title=title,
#                         FirstName=first_name,
#                         MiddleName=middle_name, 
#                         SurName=sur_name, 
#                         Gender=gender, 
#                         AliasName=alias_name, 
#                         DOB=dob, 
#                         Age=age, 
#                         Email=email, 
#                         BloodGroup=blood_group, 
#                         Occupation=occupation, 
#                         Religion=religion, 
#                         Nationality=nationality, 
#                         UniqueIdType=unique_id_type, 
#                         UniqueIdNo=unique_id_no, 
#                         DoorNo=door_no, 
#                         Street=street, 
#                         Area=area, 
#                         City=city, 
#                         State=state, 
#                         Country=country, 
#                         Pincode=pincode, 
#                         created_by=created_by
#                     )
                    
                
                
#                 # case sheet 
#                 if not visit_id:
#                     case_sheet_exists = Patient_CaseSheet_Detials.objects.filter(
#                         PatientId=patient,
#                         DoctorId=doctor_name_instance
#                     ).exists()

#                     if case_sheet_exists:
#                         return JsonResponse({'warn': 'Casesheet already exists for this patient and doctor.'})
                    
#                     patient_casesheet= Patient_CaseSheet_Detials.objects.create(
#                         PatientId = patient,
#                         DoctorId = doctor_name_instance,
#                         CaseSheet_no = case_sheet_no
#                     )
                
                
#                 # visit id
#                 patient_visit_id = generate_or_update_visit_id(patient,register_type)
                
                
#                 # referral
                
#                 if is_referral == 'Yes' and referral_doctor_instance:
#                     if visit_id and Isedit:
#                         referral = Patient_Referral_Detials.objects.get(PatientId=patient_id,VisitId=visit_id)
#                         referral.ReferralSource = referral_source
#                         referral.ReferredBy = referral_doctor_instance
#                         referral.save()
#                     else:
#                         Patient_Referral_Detials.objects.create(
#                             PatientId = patient,
#                             VisitId = patient_visit_id, 
#                             ReferralRegisteredBy = register_type, 
#                             ReferralSource = referral_source, 
#                             ReferredBy = referral_doctor_instance, 
#                             created_by = created_by
#                         )
                
                
#                 if register_type == 'OP':
#                     if register_Id :
#                         appointment_details = Patient_Appointment_Registration_Detials.objects.get(pk = register_Id)
#                         appointment_details.VisitPurpose = visit_purpose
#                         appointment_details.Specialization = specialization_instance
#                         appointment_details.PrimaryDoctor = doctor_name_instance
#                         appointment_details.CaseSheetNo = case_sheet_no
#                         appointment_details.ANCNumber = anc_number
#                         appointment_details.MCTSNo = mcts_no
#                         appointment_details.Complaint = complaint
#                         appointment_details.PatientType = patient_type
#                         appointment_details.PatientCategory = patient_category
#                         appointment_details.InsuranceName = insurance_name
#                         appointment_details.InsuranceType = insurance_type
#                         appointment_details.ClientName = client_name
#                         appointment_details.ClientType = client_type
#                         appointment_details.ClientEmployeeId = client_employee_id
#                         appointment_details.ClientEmployeeDesignation = client_employee_designation
#                         appointment_details.ClientEmployeeRelation = client_employee_relation
#                         appointment_details.EmployeeId = employee_instance
#                         appointment_details.EmployeeRelation = employee_relation
#                         appointment_details.DoctorId = doctor_instance
#                         appointment_details.DoctorRelation = doctor_relation
#                         appointment_details.DonationType = donation_type
#                         appointment_details.IsMLC = is_mlc
#                         appointment_details.Flagging = flagging
#                         appointment_details.IsReferral = is_referral
#                         appointment_details.save()
#                     else:
#                         if Patient_Appointment_Registration_Detials.objects.filter(PatientId = patient,Status = 'Pending').exists():
#                             return JsonResponse({'warn': 'Patient Request is already in pending'})
#                         else:
#                             Patient_Appointment_Registration_Detials.objects.create(
#                             PatientId = patient,
#                             VisitId = patient_visit_id,  
#                             VisitPurpose = visit_purpose, 
#                             Specialization = specialization_instance, 
#                             PrimaryDoctor = doctor_name_instance, 
#                             CaseSheetNo = case_sheet_no, 
#                             ANCNumber = anc_number, 
#                             MCTSNo = mcts_no, 
#                             Complaint = complaint, 
#                             PatientType = patient_type, 
#                             PatientCategory = patient_category, 
#                             InsuranceName = insurance_name, 
#                             InsuranceType = insurance_type, 
#                             ClientName = client_name, 
#                             ClientType = client_type, 
#                             ClientEmployeeId = client_employee_id, 
#                             ClientEmployeeDesignation = client_employee_designation, 
#                             ClientEmployeeRelation = client_employee_relation, 
#                             EmployeeId = employee_instance, 
#                             EmployeeRelation = employee_relation, 
#                             DoctorId = doctor_instance, 
#                             DoctorRelation = doctor_relation, 
#                             DonationType = donation_type, 
#                             IsMLC = is_mlc, 
#                             Flagging = flagging, 
#                             IsReferral = is_referral, 
#                             created_by = created_by
#                             )   
            
                    
                

#             return JsonResponse({'success': 'Patient registered successfully'})

#         except Patient_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Patient with the given ID does not exist'})
#         except Doctor_Personal_Form_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Doctor or referred doctor does not exist'})
#         except Exception as e:
#             return JsonResponse({'error': str(e)})

#     elif request.method == 'GET':
#         try:
#             patient_id = request.GET.get('PatientId')
#             if patient_id:
#                 patient = Patient_Detials.objects.get(PatientId=patient_id)
#                 return JsonResponse({
#                     'id': patient.PatientId,
#                     'phoneNo': patient.PhoneNo,
#                     'firstName': patient.FirstName,
#                     'lastName': patient.SurName,
#                 })
#             else:
#                 patients = list(Patient_Detials.objects.values())
#                 return JsonResponse(patients, safe=False)
#         except Patient_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Patient with the given ID does not exist'})
#         except Exception as e:
#             return JsonResponse({'error': str(e)})
        
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def upload_patient_csv(request):
    if request.method == 'POST':
        # Define path to your CSV file
        base_dir = "C:/ProgramData/MySQL/MySQL Server 8.0/Uploads"
        file_name = "allpatbkp.csv"
        file_path = os.path.normpath(os.path.join(base_dir, file_name))

        if not os.path.exists(file_path):
            return JsonResponse({'status': 'error', 'message': 'CSV file not found at path'})

        try:
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(file_path, encoding='latin1')  # fallback
                except Exception as e:
                    return JsonResponse({'status': 'error', 'message': f'Encoding issue: {str(e)}'})

            df = df.fillna("")

            batch_size = 1000
            total_inserted = 0

            for start in range(0, len(df), batch_size):
                end = start + batch_size
                batch_df = df.iloc[start:end]

                objs = []
                for _, row in batch_df.iterrows():
                    objs.append(Existing_Patient_Details(
                        OPNo = row['OPNo'],
                        YearNo = row['YearNo'],
                        OPDate = row['OPDate'],
                        OpTime = row['OpTime'],
                        NamePrefix = row['NamePrefix'],
                        PatientName = row['PatientName'],
                        CasualtyPat = row['CasualtyPat'],
                        Category = row['Category'],
                        MemberID = row['MemberID'],
                        Specialty = row['Specialty'],
                        DeptName = row['DeptName'],
                        UnitNo = row['UnitNo'],
                        Ref_Doctor = row['Ref_Doctor'],
                        TariffType = row['TariffType'],
                        TillValidity = row['TillValidity'],
                        RegFee = row['RegFee'],
                        FatherName = row['FatherName'],
                        Address = row['Address'],
                        Location = row['Location'],
                        PhoneNo = row['PhoneNo'],
                        Age = row['Age'],
                        AgeIn = row['AgeIn'],
                        Date_of_Birth = row['Date_of_Birth'],
                        Sex = row['Sex'],
                        MarriedYN = row['MarriedYN'],
                        Religion = row['Religion'],
                        SubCaste = row['SubCaste'],
                        Occupation = row['Occupation'],
                        Anual_Income = row['Anual_Income'],
                        BloodGrp = row['BloodGrp'],
                        Complaint = row['Complaint'],
                        Corporate = row['Corporate'],
                        PrepBy = row['PrepBy'],
                        ModiBy = row['ModiBy'],
                        CreditYN = row['CreditYN'],
                        RefDoctor = row['RefDoctor'],
                        RefHospital = row['RefHospital'],
                        RSBYCardYN = row['RSBYCardYN'],
                        RSBYCardNo = row['RSBYCardNo'],
                        OPNORef = row['OPNORef'],
                        OPYearRef = row['OPYearRef'],
                        CardCount = row['CardCount'],
                        ModifiedDate = row['ModifiedDate']
                    ))

                Existing_Patient_Details.objects.bulk_create(objs)
                total_inserted += len(objs)
                print(f"Inserted {total_inserted} records so far...")

            return JsonResponse({'status': 'success', 'rows_inserted': total_inserted})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'})


@csrf_exempt
def upload_revisit_patient_csv1(request):
    if request.method == 'POST':
        # Define path to your CSV file
        base_dir = "C:/ProgramData/MySQL/MySQL Server 8.0/Uploads"
        file_name = "revisitfiles.csv"  # Change filename if needed
        file_path = os.path.normpath(os.path.join(base_dir, file_name))

        if not os.path.exists(file_path):
            return JsonResponse({'status': 'error', 'message': 'CSV file not found at path'})

        try:
            # Try UTF-8 first, then fallback to Latin1
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(file_path, encoding='latin1')
                except Exception as e:
                    return JsonResponse({'status': 'error', 'message': f'Encoding issue: {str(e)}'})

            df = df.fillna("")

            batch_size = 1000
            total_inserted = 0

            for start in range(0, len(df), batch_size):
                end = start + batch_size
                batch_df = df.iloc[start:end]

                objs = []
                for _, row in batch_df.iterrows():
                    objs.append(Existing_Patient_RevisitPatient(
                        OPNo=row.get('OPNo', ''),
                        YearNo=row.get('YearNo', ''),
                        ReVisitDate=row.get('ReVisitDate', ''),
                        ReVisitTime=row.get('ReVisitTime', ''),
                        DeptName=row.get('DeptName', ''),
                        UnitNo=row.get('UnitNo', ''),
                        RefDoctor=row.get('RefDoctor', ''),
                        TillValidity=row.get('TillValidity', ''),
                        Revisit_Fee=row.get('Revisit_Fee', ''),
                        Age=row.get('Age', ''),
                        AgeIn=row.get('AgeIn', ''),
                        Complaint=row.get('Complaint', ''),
                        Category=row.get('Category', ''),
                        Specialty=row.get('Specialty', ''),
                        PrepBy=row.get('PrepBy', ''),
                        ModiBy=row.get('ModiBy', ''),
                        CasualtyPat=row.get('CasualtyPat', ''),
                        CreditYN=row.get('CreditYN', ''),
                        OFFDoctor=row.get('OFFDoctor', ''),
                        Remarks=row.get('Remarks', ''),
                        VisitID=row.get('VisitID', ''),
                        RefBy=row.get('RefBy', ''),
                        RefHospital=row.get('RefHospital', '')
                    ))

                Existing_Patient_RevisitPatient.objects.bulk_create(objs)
                total_inserted += len(objs)
                print(f"Inserted {total_inserted} records so far...")

            return JsonResponse({'status': 'success', 'rows_inserted': total_inserted})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'})



def safe_float(val, default=0.0):
    try:
        if val in [None, '', 'null', 'undefined']:
            return default
        return float(val)
    except (TypeError, ValueError):
        return default

def get_file_binary(data, field_name):
    """
    Returns binary data for BinaryField from base64 string in JSON.
    """
    file_data = data.get(field_name)
    if file_data and isinstance(file_data, str) and file_data.startswith("data:"):
        try:
            _, imgstr = file_data.split(";base64,")
            return base64.b64decode(imgstr)
        except Exception:
            return None
    return None

@csrf_exempt
@require_http_methods(['POST'])
def update_employee(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('haridata', data)

            emp_id = data.get("Employee_Id")
            pf1 = data.get("PFNumber")
            esi1 = data.get("ESINumber")

            if not emp_id:
                return JsonResponse({"error": "Employee_Id missing"}, status=400)

            with transaction.atomic():
                # ------------------ Fetch employee ------------------
                employee = Employee_Personal_Form_Detials.objects.filter(Employee_ID=emp_id).first()
                if not employee:
                    return JsonResponse({"error": "Invalid Employee_Id"}, status=404)

                # ------------------ Update personal info ------------------
                employee.Existing_Employee_ID = data.get("Existing_Employee_ID", "")
                employee.Tittle_id = data.get("Title") or None
                employee.First_Name = data.get("FirstName", "")
                employee.Middle_Name = data.get("MiddleName", "")
                employee.Last_Name = data.get("SurName", "")
                employee.Gender = data.get("gender", "")
                employee.DOB = data.get("dob") or None
                employee.Age = data.get("Age")
                employee.BloodGroup_id = data.get("bloodgroup") or None
                employee.Contact_Number = str(data.get("phone", "")).replace(".0", "")
                employee.Alternate_Number = str(data.get("alternatePhone", "")).replace(".0", "")
                employee.E_mail = data.get("email", "")
                employee.Qualification = data.get("qualification", "")
                employee.IdProofType = data.get("IdProofType", "")
                employee.IdProofNo = data.get("IdProofNo", "")
                employee.Marital_Status = data.get("maritalStatus", "")
                employee.MarriagePlan = data.get("MarriagePlan", "")
                employee.AnniversaryDate = data.get("AnniversaryDate") or None
                employee.Residence = data.get("Residence", "")
                employee.FatherName = data.get("FatherName", "")
                employee.MotherName = data.get("MotherName", "")
                employee.Spouse_Name = data.get("SpouseName", "")
                employee.Child = data.get("Child", "")
                employee.TotalNoChild = data.get("TotalNoChild", "")
                employee.ActiveStatus = data.get("ActiveStatus", "")
                employee.RequirementSource = data.get("RequirementSource", "")
                employee.Source = data.get("Source", "")
                employee.Location_id = data.get("Location") or None
                employee.Category_id = data.get("Category") or None
                employee.Speciality_id = data.get("Speciality") or None
                employee.Classification_id = data.get("Classification") or None
                employee.Role_id = data.get("Role") or None
                employee.Designation_id = data.get("Designation") or None
                employee.created_by = data.get("Createdby", "")
                employee.save()

                # ------------------ Departments M2M ------------------
                dept_ids = data.get("DepartmentId")
                if dept_ids:
                    if isinstance(dept_ids, str):
                        dept_ids = [int(x) for x in dept_ids.split(",") if x.strip().isdigit()]
                    elif not isinstance(dept_ids, list):
                        dept_ids = []
                    employee.Department.set(Department_Detials.objects.filter(pk__in=dept_ids))

                # ------------------ Current History ------------------
                history, _ = Current_History_Detials.objects.get_or_create(Employee=employee)
                history.DateOfJoining = data.get("DateOfJoining") or None
                history.ReportingManager = data.get("ReportingManager", "")
                history.CurrentEmployeementLocations_id = data.get("Locations") or None
                history.GovtLeave = data.get("GovtLeave") or 0
                history.CasualLeave = data.get("CasualLeave") or 0
                history.SickLeave = data.get("SickLeave") or 0
                history.TotalLeave = data.get("TotalLeave") or 0
                history.WorkEmail = data.get("WorkEmail", "")
                history.save()

                # ------------------ Medical Info ------------------
                med, _ = Employee_Medical_Information_Detials.objects.get_or_create(Employee=employee)
                med.PreExisiting_Medical_Condition = data.get("PreExistingMedicalCondition", "")
                med.PsychiatricMedicines = data.get("PsychiatricMedicines", "")
                med.PsychiatricMedicinesDetails = data.get("PsychiatricMedicinesDetails", "")
                med.PreviousOperation = data.get("PreviousOperation", "")
                med.SurgeriesDetails = data.get("SurgeriesDetails", "")
                med.VaccinationStatus = data.get("VaccinationStatus", "")
                med.VaccinationStatusDetails = data.get("VaccinationStatusDetails", "")
                med.save()
                bin_f=['MedicalFitnessCertificate','AnnualMedicalCheckup']
                for f in bin_f:
                    file_binary = get_file_binary(data, f)
                    if file_binary:
                        setattr(med, f, file_binary)
                med.save(update_fields=bin_f)
                
                # ------------------ Probation ------------------
                prob, _ = EmployeeProbationDetails.objects.get_or_create(Employee=employee)
                prob.is_on_probation = data.get("is_on_probation", False)
                prob.probation_start_date = data.get("probation_start_date") or None
                prob.probation_end_date = data.get("probation_end_date") or None
                prob.probation_periods = data.get("probation_periods", 0)
                prob.months_completed = data.get("months_completed", 0)
                prob.probation_status = data.get("ProbationStatus", "")
                prob.extended_date = data.get("ExtendedDate") or None
                prob.extended_months = data.get("ExtendedMonths", 0)
                prob.terminated_date = data.get("TerminatedDate") or None
                prob.confirmation_date = data.get("confirmation_date") or None
                prob.training_given_by = data.get("TrainingGivenBy", "")
                prob.training_verified_by = data.get("TrainingVerifiedBy", "")
                prob.training_completed_date = data.get("TrainingCompletedDate") or None
                prob.save()

                # ------------------ Security Deposit ------------------
                sec, _ = EmployeeSecurityDeposit.objects.get_or_create(Employee=employee)
                sec.requires_security_deposit = data.get("requiresSecurityDeposit", False)
                sec.security_start_date = data.get("security_start_date") or None
                sec.security_end_date = data.get("security_end_date") or None
                sec.total_security_amount = safe_float(data.get("total_security_amount"), 0)
                sec.security_pending_months = data.get("Security_pending_months", 0)
                sec.security_installment_count = data.get("Security_installment_count", 0)
                sec.security_months_paid = data.get("Security_months_paid", 0)
                sec.security_months_to_be_scheduled = data.get("Security_months_to_be_scheduled", 0)
                sec.save()

                # ------------------ Gratuity ------------------
                grat, _ = Employee_GratuityDetails.objects.get_or_create(Employee=employee)
                grat.require_gratuity = data.get("requireGratuity", False)
                grat.gratuity_start_date = data.get("gratuity_start_date") or None
                grat.total_gratuity_amount = safe_float(data.get("total_gratuity_amount"), 0)
                grat.monthly_gratuity_amount = safe_float(data.get("monthly_Gratuity_amount"), 0)
                grat.gratuity_pending_months = data.get("Gratuity_pending_months", 0)
                grat.gratuity_installment_count = data.get("Gratuity_installment_count", 0)
                grat.gratuity_months_to_be_scheduled = data.get("Gratuity_months_to_be_scheduled", 0)
                grat.save()

                # ------------------ Replace Allowances ------------------
                EmployeeAllowanceDetails.objects.filter(Employee=employee).delete()
                for allow in data.get("allowances", []):
                    EmployeeAllowanceDetails.objects.create(
                        Employee=employee,
                        allowance=allow.get("allowance_name"),
                        percentage=safe_float(allow.get("allowance_percentage"), 0),
                        amount=safe_float(allow.get("allowance_amount"), 0),
                    )

                # ------------------ Replace Deductions ------------------
                EmployeeDeductionDetails.objects.filter(Employee=employee).delete()
                for ded in data.get("deductions", []):
                    EmployeeDeductionDetails.objects.create(
                        Employee=employee,
                        deduction=ded.get("deduction_name"),
                        amount=safe_float(ded.get("deduction_amount"), 0),
                    )

                # ------------------ Replace Leaves ------------------
                Employee_Leavelist.objects.filter(Employee=employee).delete()
                for lv in data.get("leavesList1", []):
                    leave_type = lv.get("leaveType")
                    if leave_type:
                        Employee_Leavelist.objects.create(
                            Employee=employee,
                            leave_type=leave_type,
                            leave_count=lv.get("numLeaves", 0),
                        )

                # ------------------ Replace Skills ------------------
                Employee_Skills_Detials.objects.filter(Employee=employee).delete()
                for sk in data.get("SkillSet", []):
                    Employee_Skills_Detials.objects.create(
                        Employee=employee,
                        Skill=sk.get("name"),
                        Level=sk.get("level"),
                        created_by=data.get("Createdby", ""),
                    )

                # ------------------ Financial History ------------------
                fh_obj, _ = Financial_History_Detials.objects.get_or_create(Employee=employee)
                fh_obj.EmployeeMedicalInfo = Employee_Medical_Information_Detials.objects.filter(Employee=employee).first()
                fh_obj.EmployeeCurrentHistoryInfo = Current_History_Detials.objects.filter(Employee=employee).first()
                fh_obj.Salary = safe_float(data.get('Salary'))
                fh_obj.BasicSalary = safe_float(data.get('BasicSalary'))
                fh_obj.BasicSalary_Percentage = safe_float(data.get('basicSalaryPercent'))
                fh_obj.Allowance_amount = safe_float(data.get('AllowanceAmount'))
                fh_obj.Deduction_amount = safe_float(data.get('DeductionAmount'))
                fh_obj.Allowancefinal = safe_float(data.get('FinalAllowance'))
                fh_obj.PfForEmployee = safe_float(data.get('PfForEmployee'))
                fh_obj.SecurityDeposite = safe_float(data.get('SecurityDeposite'))
                fh_obj.PF_amount = safe_float(data.get('PF_amount'))
                fh_obj.ctc = safe_float(data.get('ctc'))
                fh_obj.PF_is_applicable = data.get('PF_is_applicable', False)
                fh_obj.PFNumber = pf1
                fh_obj.PF_EmployerPercentage = safe_float(data.get('Employer_Percentage'))
                fh_obj.PF_EmployeePercentage = safe_float(data.get('Employee_Percentage'))
                fh_obj.PF_EmployeeAmount = safe_float(data.get('Employee_PF_amount'))
                fh_obj.PF_EmployerAmount = safe_float(data.get('Employer_PF_amount'))
                fh_obj.ESINumber = esi1
                fh_obj.ESI_Percentage = safe_float(data.get('ESI_Percentage'))
                fh_obj.ESI_Amount = safe_float(data.get('ESI_Amount'))
                fh_obj.ESI_is_applicable = data.get('ESI_is_applicable', False)
                fh_obj.TDS_is_applicable = data.get('TDS_is_applicable', False)
                fh_obj.TDS_Percentage = safe_float(data.get('TDS_Percentage'))
                fh_obj.TDS_Amount = safe_float(data.get('TDS_Amount'))
                fh_obj.Net_salary = safe_float(data.get('net_salary'))
                fh_obj.AccountHolderName = data.get('AccountHolderName', "")
                fh_obj.AccountNumber = str(data.get('AccountNumber', "")).replace(".0", "")
                fh_obj.BankName = data.get('BankName', "")
                fh_obj.Branch = data.get('Branch', "")
                fh_obj.IfscCode = data.get('IfscCode', "")
                fh_obj.PanNumber = data.get('PanNumber', "")
                fh_obj.created_by = data.get('Createdby', "")
                fh_obj.updated_by = data.get('Createdby', "")
                fh_obj.Location = employee.Location
                fh_obj.save()
                 
                # ------------------ Employment History ------------------
                his_obj, _ = Employeement_History_Detials.objects.get_or_create(Employee=employee)
                his_obj.PreviousWorkExperience = data.get("PreviousWorkExperience", "")
                his_obj.PreviousWorkPFNumber = data.get("PreviousWorkPFNumber", "")
                his_obj.PreviousWorkESINumber = data.get("PreviousWorkESINumber", "")
                his_obj.PFNumber = pf1
                his_obj.ESINumber = esi1
                his_obj.NoOfYears = data.get("NoOfYears", "")
                his_obj.WorkStationNameAddress = data.get("WorkStationNameAddress", "")
                his_obj.ReasonForLeft = data.get("ReasonForLeft", "")
                his_obj.WorkStationPhoneNo = data.get("WorkStationPhoneNo", "")
                his_obj.EmployeePaySlip = data.get("EmployeePaySlip") or None
                his_obj.EmployeeOfferLetter = data.get("EmployeeOfferLetter") or None
                his_obj.EmployeeReliveLetter = data.get("EmployeeReliveLetter") or None
                his_obj.ConfirmedBy = data.get("ConfirmedBy", "")
                his_obj.created_by = data.get("Createdby", "")
                his_obj.updated_by = data.get("Createdby", "")
                his_obj.Location_id = data.get("Location") or None
                his_obj.save()
                
            doc_obj, _ = Document_Checklist_Detials.objects.get_or_create(Employee=employee)
            binary_field = ['Photo','Signature']
            for f in binary_field:
                file_binary = get_file_binary(data, f)
                if file_binary:
                    setattr(employee, f, file_binary)
            employee.save(update_fields=binary_field)  # save only binary fields

            binary_fields = [
                    "Resume", "AadharCard", "BankPassbook",
                    "ExperienceCertificate", "MedicalFitness", "Offerletter","PanCard"
                ]
            for f in binary_fields:
                    file_binary = get_file_binary(data, f)
                    if file_binary:
                        setattr(doc_obj, f, file_binary)

            doc_obj.EmployeementHistory = his_obj
            doc_obj.EmployeeMedicalInfo = med
            doc_obj.EmployeeCurrentHistoryInfo = history
            doc_obj.EmployeeFinancialHistory = fh_obj
            doc_obj.Location = employee.Location
            doc_obj.created_by = data.get("Createdby", doc_obj.created_by or "")
            doc_obj.updated_by = data.get("Createdby", "")
            doc_obj.save() 
                # ------------------ Salary Maintenance ------------------
            salary_record = Salary_Maintenance_Detials.objects.filter(
                Employee=employee,
                Status="Active"
            ).order_by("-created_at").first()

            if salary_record:
                salary_record.EmployeeMedicalInfo = Employee_Medical_Information_Detials.objects.filter(Employee=employee).first()
                salary_record.EmployeeCurrentHistoryInfo = Current_History_Detials.objects.filter(Employee=employee).first()
                salary_record.BasicSalary = safe_float(data.get("BasicSalary"))
                salary_record.ctc = safe_float(data.get("ctc"))
                salary_record.AccountHolderName = data.get("AccountHolderName", "")
                salary_record.AccountNumber = str(data.get("AccountNumber", "")).replace(".0", "")
                salary_record.BankName = data.get("BankName", "")
                salary_record.Branch = data.get("Branch", "")
                salary_record.IfscCode = data.get("IfscCode", "")
                salary_record.PanNumber = data.get("PanNumber", "")
                salary_record.updated_by = data.get("Createdby", "")
                salary_record.Location = employee.Location
                salary_record.save()


               

                # Update allowances relation if required
                salary_record.EmployeeAllowanceDetails.clear()
                for allow in data.get("allowances", []):
                    allow_obj = EmployeeAllowanceDetails.objects.create(
                        Employee=employee,
                        allowance=allow.get("allowance_name"),
                        percentage=safe_float(allow.get("allowance_percentage"), 0),
                        amount=safe_float(allow.get("allowance_amount"), 0),
                    )
                    salary_record.EmployeeAllowanceDetails.add(allow_obj)

                # ------------------ Removed Salary Maintenance ------------------

                return JsonResponse({"success": "Employee details updated successfully (no old history, no salary maintenance)"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
