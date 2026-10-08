from django.db import models
from django.db.models import Max
from datetime import datetime
from django.http import JsonResponse
from Masters.models import *
import uuid


class Employee_Skills_Detials(models.Model):
    Skill_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    Skill = models.CharField(max_length=30,blank=True,null=True)
    Level = models.CharField(max_length=30,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')

    class Meta:
        db_table = 'Employee_Skills_Detials'
        unique_together = ('Employee', 'Skill', 'Level')  

class Employeement_History_Detials(models.Model):
    EmpHistory_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    PreviousWorkExperience = models.CharField(max_length=30,blank=True,null=True)
    PreviousWorkPFNumber = models.CharField(max_length=30,blank=True,null=True)
    PreviousWorkESINumber = models.CharField(max_length=30,blank=True,null=True)
    PFNumber = models.CharField(max_length=30,blank=True,null=True)
    ESINumber = models.CharField(max_length=30,blank=True,null=True)
    NoOfYears = models.CharField(max_length=30,blank=True,null=True)
    WorkStationNameAddress = models.TextField(blank=True,null=True)
    ReasonForLeft = models.CharField(max_length=50,blank=True,null=True)
    WorkStationPhoneNo = models.CharField(max_length=30,blank=True,null=True)
    EmployeePaySlip = models.BinaryField(blank=True,null=True)
    EmployeeOfferLetter = models.BinaryField(blank=True,null=True)
    EmployeeReliveLetter = models.BinaryField(blank=True,null=True)
    ConfirmedBy = models.CharField(max_length=50,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')

    class Meta:
        db_table = 'Employeement_History_Detials'

class Employee_Medical_Information_Detials(models.Model):
    EmpHistory_Id = models.AutoField(primary_key=True)
    EmployeementHistory = models.ForeignKey(Employeement_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    PreExisiting_Medical_Condition = models.CharField(max_length=100,blank=True,null=True)
    PsychiatricMedicines = models.CharField(max_length=30,blank=True,null=True)
    PsychiatricMedicinesDetails = models.TextField(blank=True,null=True)
    PreviousOperation = models.CharField(max_length=30,blank=True,null=True)
    SurgeriesDetails = models.TextField(blank=True,null=True)
    VaccinationStatus = models.CharField(max_length=30,blank=True,null=True)
    VaccinationStatusDetails = models.TextField(blank=True,null=True)
    MedicalFitnessCertificate = models.BinaryField(blank=True,null=True)
    AnnualMedicalCheckup = models.BinaryField(blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')

    class Meta:
        db_table = 'Employee_Medical_Information_Detials'


class Current_History_Detials(models.Model):
    EmpHistory_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeementHistory = models.ForeignKey(Employeement_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeMedicalInfo = models.ForeignKey(Employee_Medical_Information_Detials,on_delete=models.CASCADE,blank=True,null=True)
    DateOfJoining = models.CharField(max_length=30,blank=True,null=True)
    
    CurrentEmployeementLocations= models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True,null=True,related_name='current_employment_locations',db_column='current_employment_location_id') 
    ReportingManager = models.CharField(max_length=30,blank=True,null=True)
    GovtLeave = models.CharField(max_length=30,blank=True,null=True)
    CasualLeave = models.CharField(max_length=30,blank=True,null=True)
    SickLeave = models.CharField(max_length=30,blank=True,null=True)
    TotalLeave = models.CharField(max_length=30,blank=True,null=True)
    WorkEmail = models.CharField(max_length=50,blank=True,null=True)
    ProbationPeriod = models.CharField(max_length=50,blank=True,null=True)
    Months = models.CharField(max_length=50,blank=True,null=True)
    Years = models.CharField(max_length=50,blank=True,null=True)
    TrainingGivenBy = models.CharField(max_length=50,blank=True,null=True)
    TrainingVerifiedBy = models.CharField(max_length=50,blank=True,null=True)
    TrainingCompletedDate = models.CharField(max_length=50,blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True,related_name='location_history',db_column='location_history_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')

    class Meta:
        db_table = 'Current_History_Detials'


class Financial_History_Detials(models.Model):
    EmpHistory_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeementHistory = models.ForeignKey(Employeement_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeMedicalInfo = models.ForeignKey(Employee_Medical_Information_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeCurrentHistoryInfo = models.ForeignKey(Current_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    Salary = models.FloatField(blank=True, null=True)
    BasicSalary = models.FloatField(blank=True, null=True)
    BasicSalary_Percentage = models.FloatField(blank=True, null=True)
    Allowance_amount = models.FloatField(blank=True, null=True,default=0.0)
    Deduction_amount = models.FloatField(blank=True, null=True,default=0.0)
    Allowancefinal = models.FloatField(blank=True, null=True)
    PfForEmployee = models.FloatField(blank=True, null=True,default=0.0)
    SecurityDeposite = models.FloatField(blank=True, null=True,default=0.0)
    PF_amount = models.FloatField(blank=True, null=True,default=0.0)
    ctc =  models.FloatField(blank=True, null=True,default=0.0)

    PF_is_applicable = models.BooleanField(default=False)
    PFNumber = models.CharField(max_length=30,blank=True,null=True)
    PF_EmployerPercentage = models.FloatField(blank=True, null=True)
    PF_EmployeePercentage = models.FloatField(blank=True, null=True)
    PF_EmployeeAmount = models.FloatField(blank=True, null=True)
    PF_EmployerAmount = models.FloatField(blank=True, null=True)

    ESINumber = models.CharField(max_length=30,blank=True,null=True)
    ESI_Percentage = models.FloatField(blank=True, null=True)
    ESI_Amount = models.FloatField(blank=True, null=True)
    ESI_is_applicable = models.BooleanField(default=False)

    TDS_is_applicable = models.BooleanField(default=False)
    TDS_Percentage = models.FloatField(blank=True, null=True)
    TDS_Amount = models.FloatField(blank=True, null=True)

    Net_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    AccountHolderName = models.CharField(max_length=100,blank=True,null=True)
    AccountNumber = models.CharField(max_length=100,blank=True,null=True)
    BankName = models.CharField(max_length=100,blank=True,null=True)
    Branch = models.CharField(max_length=100,blank=True,null=True)
    IfscCode = models.CharField(max_length=100,blank=True,null=True)
    PanNumber = models.CharField(max_length=100,blank=True,null=True)    
    UploadCsvFile = models.BinaryField(blank=True,null=True)
 
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')
 
    class Meta:
        db_table = 'Financial_History_Detials'


class Salary_Maintenance_Detials(models.Model):
    EmpSalary_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeementHistory = models.ForeignKey(Employeement_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeMedicalInfo = models.ForeignKey(Employee_Medical_Information_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeCurrentHistoryInfo = models.ForeignKey(Current_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeAllowanceDetails = models.ManyToManyField('EmployeeAllowanceDetails',related_name="salary_details")
    BasicSalary = models.FloatField(blank=True, null=True)
    ctc =  models.FloatField(blank=True, null=True,default=0.0)
    AccountHolderName = models.CharField(max_length=100,blank=True,null=True)
    AccountNumber = models.CharField(max_length=100,blank=True,null=True)
    BankName = models.CharField(max_length=100,blank=True,null=True)
    Branch = models.CharField(max_length=100,blank=True,null=True)
    IfscCode = models.CharField(max_length=100,blank=True,null=True)
    PanNumber = models.CharField(max_length=100,blank=True,null=True)  
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')
    Status = models.CharField(max_length=20,null=True,blank=True,default='Active')
 
    class Meta:
        db_table = 'Salary_Maintenance_Detials'


class Document_Checklist_Detials(models.Model):
    EmpHistory_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeementHistory = models.ForeignKey(Employeement_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeMedicalInfo = models.ForeignKey(Employee_Medical_Information_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeCurrentHistoryInfo = models.ForeignKey(Current_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    EmployeeFinancialHistory = models.ForeignKey(Financial_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    Resume = models.BinaryField(blank=True,null=True)
    PanCard = models.BinaryField(blank=True,null=True)
    AadharCard = models.BinaryField(blank=True,null=True)
    BankPassbook = models.BinaryField(blank=True,null=True)
    ExperienceCertificate = models.BinaryField(blank=True,null=True)
    MedicalFitness = models.BinaryField(blank=True,null=True)
    Offerletter = models.BinaryField(blank=True,null=True)
    created_by = models.CharField(max_length=30)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=30,default='')

    class Meta:
        db_table = 'Document_Checklist_Detials'




class DutyRousterMaster(models.Model):
    ShiftId = models.CharField(primary_key=True,max_length=70)

    BranchID = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank=True,related_name="branch_location_shift")
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, null=True, blank=True,related_name="location_shift")
    ShiftName = models.CharField(max_length=50, default="") 
    StartTime = models.TimeField(null=True)  # Ensure no NULL for time
    EndTime = models.TimeField(null=True)    # Ensure no NULL for time
    ShiftHours = models.CharField(max_length=25,null=True,blank=True)
    Status = models.BooleanField(default=True)
    Created_by = models.CharField(max_length=70)
    DayOff = models.CharField(max_length=20,null=True)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
   
    class Meta:
        db_table = 'DutyRousterMaster'


   

class ShiftDetails_Master(models.Model):
    Employee_Shift_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE)
    Shift_Id = models.ForeignKey(DutyRousterMaster, on_delete=models.CASCADE,blank=True,null=True)
    ShiftDate = models.DateField(null=True,blank=True)
    Status = models.CharField(max_length=70, default='')
    ot_status = models.CharField(max_length=50,default='No')
    Create_by = models.CharField(max_length=70)
    Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
   
    class Meta:
        db_table = 'ShiftDetails_Master'



class Employee_Leave_Register(models.Model):
    Leave_Id = models.AutoField(primary_key=True)
    Employee_Id = models.ForeignKey(Current_History_Detials,on_delete=models.CASCADE,blank=True,null=True)
    Leave_Type = models.CharField(max_length=100)
    PermissionDate = models.DateField(null=True, blank=True)
    FromDate = models.DateField(null=True, blank=True)
    ToDate = models.DateField(null=True, blank=True)
    DaysCount = models.IntegerField(null=True, blank=True)
    Medical_Certificate = models.BinaryField(null=True, blank=True)
    FromTime = models.TimeField(null=True, blank=True)
    ToTime = models.TimeField(null=True, blank=True)
    HoursCount = models.CharField(max_length=60, null=True, blank=True, default="0")
    Reason = models.TextField()
    Status = models.CharField(max_length=50, default="Pending")
    Reject_Reason = models.TextField()
    Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    CreatedBy = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Employee_Leave_Register'
    def clean(self):
        if self.FromDate and self.ToDate and self.FromDate > self.ToDate:
            return JsonResponse({"warn": "FromDate cannot be later than ToDate."})


# Employee Advance Request

class Employee_Advance_Request(models.Model):
    Advance_RequestId = models.AutoField(primary_key=True)
    Employee_Id = models.ForeignKey(Financial_History_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Request_Date = models.DateField(null=True, blank=True)
    Request_Amount = models.IntegerField()
    Request_Reason = models.TextField()
    Repayment_Due = models.IntegerField(null=True, blank=True)
    Reject_Reason = models.TextField(default="")
    IssuedDate = models.DateField(null=True, blank=True)
    Issuever_Name = models.CharField(max_length=100, default="")
    AmountDeduct_PerMonth = models.IntegerField(null=True, blank=True)
    Installment_Status = models.CharField(max_length=100, default="Pending")
    No_of_MonthPaid = models.IntegerField(null=True, blank=True)
    PaidAmount = models.CharField(max_length=200, default="")
    Status = models.CharField(max_length=50, default="Pending")
    Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    CreatedBy = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Employee_Advance_Request'


class Employee_Attendance(models.Model):
    Attendance_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Date = models.DateField(null=True, blank=True)
    In_Time = models.TimeField(null=True, blank=True)
    In_TimePeriod = models.CharField(max_length=5,null=True,blank=True)
    Out_Time = models.TimeField(null=True, blank=True)
    Out_TimePeriod = models.CharField(max_length=5,null=True,blank=True)
    Working_Hours = models.CharField(max_length=50,null=True, blank=True)
    Attendance_Status = models.CharField(max_length=50, default="")
    Location = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    CreatedBy = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
        
    class Meta:
        db_table = 'Employee_Attendance'





class Employee_PaySlips(models.Model):
    PaySlip_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
    EmployeePayslip = models.BinaryField()
    PaySlip_Date = models.DateField(null=True, blank=True)
    Location = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    CreatedBy = models.CharField(max_length=100)
    Paid_Salary = models.FloatField(null=True, blank=True)
    Status = models.CharField(max_length=50, default="")
    SalaryMonth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Employee_PaySlips'
        
class AllowanceMaster(models.Model):
    ALLOWANCE_TYPE_CHOICES = [
        ('Fixed', 'Fixed'),
        ('Percentage', 'Percentage'),
    ]
    
    allowance_name = models.CharField(max_length=100)
    allowance_type = models.CharField(max_length=10, choices=ALLOWANCE_TYPE_CHOICES)
    value = models.IntegerField(null=True,blank=True,default=0)  # Fixed amount or percentage
    status = models.BooleanField(default=True)  # Active or Inactive

    def __str__(self):
        return self.allowance_name

    class Meta: 
        db_table = 'AllowanceMaster'

# DeductionMaster


class Deduction_Master(models.Model):
    DEDUCTION_TYPE_CHOICES = [
        ('Fixed', 'Fixed'),
        ('Percentage', 'Percentage'),
    ]

    deduction_name = models.CharField(max_length=100)
    deduction_type = models.CharField(max_length=20, choices=DEDUCTION_TYPE_CHOICES, default='Fixed')
    value = models.IntegerField(null=True,blank=True,default=None)  # Applicable for both Fixed and Percentage
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.deduction_name


    class Meta:

        db_table="Deduction_Master"
    
    
    
class Employee_PaySlips_Details(models.Model):
    PaySlips_FinanaceID = models.AutoField(primary_key=True)
    PaySlip_Id = models.ForeignKey(Employee_PaySlips, on_delete=models.CASCADE, blank=True, null=True)
    PFAmount = models.FloatField(null=True,blank=True)
    ProfessionalTax = models.FloatField(null=True, blank=True)
    ESIAmount = models.FloatField(null=True,blank=True)
    TDSAmount = models.FloatField(null=True,blank=True)
    Location = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    CreatedBy = models.CharField(max_length=100)
    PayableSalary = models.FloatField(null=True, blank=True)
    TotalEarning = models.FloatField(null=True,blank=True)
    TotalDeduction = models.FloatField(null=True,blank=True)
    NetSalary = models.FloatField(null=True,blank=True)
    Allowances = models.ManyToManyField(AllowanceMaster)
    Deductions = models.ManyToManyField(Deduction_Master)
    Status = models.CharField(max_length=50, default="")
    LossOFPay = models.FloatField(null=True,blank=True)
    AdvanceAmountDeduct = models.FloatField(null=True,blank=True)
    SalaryMonth = models.DateField(null=True, blank=True)
    PaySlip_Date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table="Employee_PaySlips_Details"
    
    # employee performance

class Employee_Performance(models.Model):
    Performance_Id = models.AutoField(primary_key=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
    HikeType = models.CharField(max_length=100, default="")
    AllowanceName = models.CharField(max_length=100, default="")
    PreviousAllowance = models.IntegerField(null=True, blank=True)
    PreviousAllowanceAmount = models.FloatField(null=True, blank=True)
    NewAllowance = models.IntegerField(null=True, blank=True)
    NewAllowanceAmount = models.FloatField(null=True, blank=True)
    FinalAllowanceAmount = models.FloatField(null=True, blank=True)
    Date = models.DateField(null=True, blank=True)
    Current_Payment = models.FloatField(null=True, blank=True)
    Performance_Rate = models.CharField(max_length=120, default='')
    Hike_Percentage = models.IntegerField(null=True, blank=True)
    Hike_Amount = models.FloatField(null=True, blank=True)
    New_Pay = models.FloatField(null=True, blank=True)
    Remarks = models.CharField(max_length=100, default="")
    ApprovedBy = models.CharField(max_length=100, default="")
    Status = models.CharField(max_length=20,null=True,blank=True,default='Active')
    Location_Name = models.ForeignKey(Location_Detials,on_delete=models.CASCADE,blank=True,null=True)
    CreatedBy = models.CharField(max_length=100, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Employee_Performance'


# employee complaint

class Employee_Complaint(models.Model):
    Complaint_Id = models.AutoField(primary_key=True)
    EmployeeId = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True, related_name="complaints")
    Complaint = models.CharField(max_length=200, null=True, blank=True, default="")
    IncidentDate = models.DateField(null=True, blank=True)
    IncidentTime = models.TimeField(null=True, blank=True)
    Description = models.TextField(null=True, blank=True)
    Remarks = models.TextField(null=True, blank=True)
    AgainstEmployeeId = models.ForeignKey(
        Employee_Personal_Form_Detials, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name="complaints_against"
    )
    AgainstEmployeeName = models.CharField(max_length=200, null=True, blank=True, default="")
    AgainstEmployeeDepartment = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Witness = models.CharField(max_length=200, null=True, blank=True, default="")
    Location_Name = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True, null=True)
    CreatedBy = models.CharField(max_length=100, default='')
    Status = models.CharField(max_length=100, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Employee_Complaint'


# hr complaint actions
class HR_ComplaintAction(models.Model):
    HrComplaint_Id = models.AutoField(primary_key=True)
    Complaint = models.ForeignKey(Employee_Complaint, on_delete=models.CASCADE, blank=True, null=True)
    HrAction = models.CharField(max_length=200, null=True, blank=True, default="")
    Remarks = models.TextField(null=True, blank=True)
    FromDate = models.DateField(null=True, blank=True)
    ToDate = models.DateField(null=True, blank=True)
    Location_Name = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True, null=True)
    CreatedBy = models.CharField(max_length=100, default='')
    Status = models.CharField(max_length=100, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'HR_ComplaintAction'

# circular


class Circular_Details(models.Model):
    Circular_Id = models.AutoField(primary_key=True)
    CircularCreateEmployee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
    CircularDate = models.DateField(null=True, blank=True)
    CircularTime = models.TimeField(null=True, blank=True)
    Venue = models.ForeignKey(Administration_Master_Details, on_delete=models.CASCADE, blank=True, null=True)
    Subject = models.CharField(max_length=100, default="")
    Remarks = models.CharField(max_length=100, default="")
    Location_Name = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True, null=True)
    CreatedBy = models.CharField(max_length=100, default='')
    Status = models.CharField(max_length=100, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Circular_Details'

class Circular_Department(models.Model):
    CircularDepartment_Id = models.AutoField(primary_key=True)
    Circular = models.ForeignKey(Circular_Details, on_delete=models.CASCADE, null=True, blank=True)
    Department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, null=True, blank=True)
    Location_Name = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Status = models.CharField(max_length=100, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Circular_Department'

class Circular_Employee(models.Model):
    CircularEmployee_Id = models.AutoField(primary_key=True)
    Circular = models.ForeignKey(Circular_Details, on_delete=models.CASCADE, null=True, blank=True)
    Location_Name = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Employee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Status = models.CharField(max_length=100, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'Circular_Employee'

    
    



class EmployeeProbationDetails(models.Model):
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)

    PROBATION_STATUS_CHOICES = [
        ('select', 'Select'),
        ('extended', 'Extended'),
        ('terminated', 'Terminated'),
        ('confirmed', 'Confirmed'),
    ]

    is_on_probation = models.BooleanField(default=False)
    probation_start_date = models.CharField(null=True, blank=True,max_length=50)
    probation_end_date = models.CharField(null=True, blank=True,max_length=50)
    probation_periods = models.IntegerField(null=True, blank=True)
    months_completed = models.IntegerField(null=True, blank=True)
    probation_status = models.CharField(max_length=20, choices=PROBATION_STATUS_CHOICES, default='select',null=True, blank=True)
    extended_date = models.CharField(null=True, blank=True,max_length=50)
    extended_months = models.IntegerField(null=True, blank=True)
    terminated_date = models.CharField(null=True, blank=True,max_length=50)
    confirmation_date = models.CharField(null=True, blank=True,max_length=50)
    confidential_review_form = models.BinaryField(blank=True,null=True)
    hod_review_form = models.BinaryField(blank=True,null=True)
    hr_review_form = models.BinaryField(blank=True,null=True)
    training_given_by = models.CharField(max_length=100, null=True, blank=True)
    training_verified_by = models.CharField(max_length=100, null=True, blank=True)
    training_completed_date = models.CharField(null=True, blank=True,max_length=50)

    class Meta:
        db_table='EmployeeProbationDetails'

    def __str__(self):
        return f"Probation Details for Employee {self.id}"

        
class EmployeeSecurityDeposit(models.Model):
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    # If security deposit is not required
    requires_security_deposit = models.BooleanField(default=False)

    # CharFields for the start and end dates (you can use datetime if needed)
    security_start_date = models.CharField(max_length=50, blank=True, null=True)  # Assuming 'YYYY-MM-DD' format
    security_end_date = models.CharField(max_length=50, blank=True, null=True)    # Assuming 'YYYY-MM-DD' format

    # Numeric fields for security deposit amount and installments
    total_security_amount = models.DecimalField(max_digits=50, decimal_places=2, default=0,blank=True, null=True)
    #monthly_security_deposit_amount = models.DecimalField(max_digits=50, decimal_places=2, default=0)
    security_pending_months = models.IntegerField(null=True, blank=True)
    security_installment_count = models.IntegerField(null=True, blank=True)
    security_months_paid = models.IntegerField(null=True, blank=True)
    security_months_to_be_scheduled = models.IntegerField(null=True, blank=True)
    
    class Meta:
        db_table='EmployeeSecurityDeposit'

    def __str__(self):
        return f"Security Deposit (Required: {self.requires_security_deposit})"


class Employee_GratuityDetails(models.Model):
    # Foreign key to Employee model
    Employee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE,blank=True,null=True)

    # Fields as per your provided structure
    require_gratuity = models.BooleanField(default=False)
    gratuity_start_date = models.CharField(max_length=100, blank=True, null=True)
    total_gratuity_amount = models.DecimalField(max_digits=50, decimal_places=2, default=0,blank=True, null=True)
    monthly_gratuity_amount = models.DecimalField(max_digits=50, decimal_places=2, default=0,blank=True, null=True)
    gratuity_pending_months = models.IntegerField(null=True, blank=True)
    gratuity_installment_count = models.IntegerField(null=True, blank=True)
    gratuity_months_to_be_scheduled = models.IntegerField(null=True, blank=True)
    
    
    class Meta:
        db_table='Employee_GratuityDetails'

    def __str__(self):
        return f"Gratuity Details for {self.Employee.First_Name} {self.Employee.Last_Name}"



class Employee_Leavelist(models.Model):
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,blank=True,null=True)
    leave_type =models.CharField(max_length=200,null=False,blank=False)
    leave_count = models.IntegerField(default=0,null=False)
    class Meta:
        db_table = 'Employee_Leavelist'
        

class LeaveMaster(models.Model):
    # Fields
    code = models.CharField(max_length=20, unique=True, blank=True)
    leave_type = models.CharField(max_length=50, null=False,blank=False)
    short_name = models.CharField(max_length=10, null=False ,blank=False)  # e.g., CL, CF
   
    APPLICABLE_TO_CHOICES = [
        ('Both', 'Both'),
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    applicable_to = models.CharField(max_length=10, choices=APPLICABLE_TO_CHOICES, default='Both')  # Applicable to
    LEAVE_UNIT_CHOICES = [
        ('Days', 'Days'),
        ('Hours', 'Hours'),
        ('Years','Years'),
    ]
    leave_unit = models.CharField(max_length=5, choices=LEAVE_UNIT_CHOICES, default='Days')  # Days or Hours
    leave_unit_no_of = models.IntegerField(default=1)  # Days or Hours
    carry_forward = models.CharField(max_length=50,default='NO')  # Can it be carried forward?
    lop = models.CharField(max_length=50,default='NO')  # Loss of Pay
    payable = models.CharField(max_length=50,default='NO')  # Is it payable?
    yearly_encashment = models.CharField(max_length=50,default='NO')  # Yearly Encashment allowed?
  
    inactive = models.CharField(default='NO',max_length=50)  # Active/Inactive status
    created_at = models.DateTimeField(auto_now=True)  # Auto-add current timestamp
    updated_at = models.DateTimeField(auto_now=True)  # Auto-update timestamp on changes


    def save(self, *args, **kwargs):
        if not self.code:
            # Auto-generate the code (e.g., LEAVE-UUID)
            self.code = 'LEAVE-' + str(uuid.uuid4())[:8].upper()  # Creates a unique 8-character code
        super(LeaveMaster, self).save(*args, **kwargs)

    def __str__(self):
        return self.code


    # Metadata
    class Meta: 
        db_table ="LeaveMaster"

    # String representation
    def __str__(self):
        return self.description


    
 
class EmployeeAllowanceDetails(models.Model):
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE)
    allowance = models.CharField(max_length=100)
    percentage =models.IntegerField(null=True,blank=True,default=None) # Percentage for the allowance
    amount = models.IntegerField(null=True,default=None)
    Status = models.CharField(max_length=30,null=True,blank=True,default='Active')
     
  
    
    class Meta:

        db_table="EmployeeAllowanceDetails"
        
class EmployeeDeductionDetails(models.Model):
    Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE)
    deduction=models.CharField(max_length=100)
    amount = models.IntegerField(null=True,default=True,db_default=None)
    
    
    # def __str__(self):
    #     return self.Employee.name  
    class Meta:
        db_table ="EmployeeDeductionDetails"      
        


class NurseVsNurseStation(models.Model):
    NurseAssignID = models.AutoField(primary_key=True)
    NurseStationid = models.ForeignKey(NurseStationMaster, null=True, blank=True, on_delete=models.CASCADE)
    Employee_ID = models.ManyToManyField(Employee_Personal_Form_Detials)
    Location = models.ForeignKey(Location_Detials, on_delete=models.CASCADE, blank=True, null=True)
    Status = models.CharField(max_length=10,blank=True, null=True)
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



from django.db import models
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("SHIFT", "Shift Expiry"),
        ("CIRCULAR", "Company Circular"),
        ("GRIEVANCE", "Employee Grievance"),
        ("GENERAL", "General Notification"),
    ]
    RECEIVER_TYPES = [
        ("EMPLOYEE", "Individual Employee"),
        ("DEPARTMENT", "Department"),
        ("OTHERS", "OTHERS"),
    ]
    PRIORITY_LEVELS = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    ]
    receiver_type = models.CharField(max_length=20, choices=RECEIVER_TYPES, default="EMPLOYEE")
    recipients = models.ManyToManyField(Employee_Personal_Form_Detials, related_name="notifications")
    department = models.ForeignKey(Department_Detials, on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False) 
    read_by = models.ForeignKey(Employee_Personal_Form_Detials, related_name="read_notifications", on_delete=models.SET_NULL, null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True) 
    created_by = models.ForeignKey(Employee_Personal_Form_Detials, related_name="created_notifications", on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    is_host_notification = models.BooleanField(default=False)  
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default="MEDIUM")
    shift_id = models.ManyToManyField(ShiftDetails_Master,related_name="shift_notifications")
    circular_id = models.ForeignKey(Circular_Details, on_delete=models.CASCADE, null=True, blank=True, related_name="circular_notifications")

    class Meta:
        db_table = "Notification"

    def __str__(self):
        return f"{self.notification_type} - {self.message[:30]} (Priority: {self.priority})"


class NotificationReadStatus(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name="read_status")
    employee = models.ForeignKey(Employee_Personal_Form_Detials, on_delete=models.CASCADE, related_name="notification_reads")
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = "NotificationReadStatus"
        unique_together = ('notification', 'employee')  # Ensure each employee has only one read status per notification

    def __str__(self):
        return f"{self.employee} - {self.notification} - Read: {self.is_read}"


class HODMapping(models.Model):


    HOD_Employee = models.ForeignKey(Employee_Personal_Form_Detials,on_delete=models.CASCADE,null=True,blank=True,related_name="hod_mappings_as_hod")
    Employee = models.ManyToManyField(Employee_Personal_Form_Detials,blank=True,related_name="hod_mappings_as_employee")
    created_by = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "HODMapping"
        








class OverTime_Master(models.Model):
    OT_ID = models.AutoField(primary_key=True)
    
    # Link to the employee shift record
    Employee_Shift = models.ForeignKey(
        ShiftDetails_Master,
        on_delete=models.CASCADE,
        related_name='overtime_records'
    )

   
    StartTime = models.TimeField()
    EndTime = models.TimeField()
    Hours = models.DecimalField(max_digits=5, decimal_places=2)
    
    Status = models.CharField(max_length=50, default="Pending")  # e.g., Pending, Approved, Rejected
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    Created_by = models.CharField(max_length=100, blank=True, null=True)
    Updated_by = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.Employee_Shift.Employee.Employee_ID} - {self.OTDate} ({self.Hours} hrs)"
    
    class Meta:
        db_table = "OverTime_Master"
        









