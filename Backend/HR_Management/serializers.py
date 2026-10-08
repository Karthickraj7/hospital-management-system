from rest_framework import serializers
from .models import DutyRousterMaster
from datetime import datetime
from .models import *
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
# import magic
import filetype
import base64
from calendar import monthrange
from rest_framework import serializers
from Masters.models import *
from datetime import datetime, timedelta
from calendar import monthrange
from django.db.models import Sum


class DutyRousterMasterDetailsSerializer(serializers.ModelSerializer):
    Status = serializers.BooleanField(required=False)
    display_starttime = serializers.SerializerMethodField()
    display_endtime = serializers.SerializerMethodField()

    class Meta:
        model = DutyRousterMaster
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request", None)
        if request and request.method == "GET":
            self.fields["Display_Location"] = serializers.CharField(
                source="Location.Location_Name", read_only=True
            )
            self.fields["BranchName"] = serializers.CharField(
                source="BranchID.Location_Name", read_only=True
            )
            
           

    def get_display_starttime(self, obj):
        if obj.StartTime:
            return self.convert_to_12hr_format(obj.StartTime)
        else:
            return "-"

    def get_display_endtime(self, obj):
        if obj.EndTime:
            return self.convert_to_12hr_format(obj.EndTime)
        else:
            return "-"

    @staticmethod
    def convert_to_12hr_format(time_obj):
        return time_obj.strftime("%I:%M %p") if time_obj else None

    def get_Status_Name(self, obj):
        return "Active" if obj.Status is True else "Inactive"

    def update(self, instance, validated_data):
        statusedit = self.initial_data.get("Statusedit", None)
        if statusedit is not None:
            Status = validated_data.get("Status")
            Status1 = False if Status is True else True
            validated_data["Status"] = Status1
            instance.Status = Status1
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        """
        Add the Statusedit field with a value of True to the serialized output.
        """
        representation = super().to_representation(instance)
        representation["is_edit"] = True
        if instance.DayOff == "Yes":
            representation["ShiftHours"] = "-"
        
        return representation


from rest_framework import serializers
from .models import ShiftDetails_Master

class ShiftDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftDetails_Master
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        shift_date = instance.ShiftDate
        employee_id = instance.Employee.Employee_ID  # Assuming Employee is a ForeignKey

        lstatus = self.context.get('latestatus', None)
        
       
        if shift_date:
            ret['ShiftDate'] = shift_date.strftime('%Y-%m-%d')
            day_of_week = shift_date.strftime('%A')
            ret['Day'] = day_of_week
            ret['DayShortName'] = day_of_week[:1]
        else:
            ret['ShiftDate'] = None
            ret['Day'] = None
            ret['DayShortName'] = None

        shift_obj = instance.Shift_Id  

        if shift_obj:
            ret['Shift_Id'] = getattr(shift_obj, 'ShiftId', None)
            ret['ShiftName'] = getattr(shift_obj, 'ShiftName', None)

            if getattr(shift_obj, 'StartTime', None):
                ret['DisplayStartTime'] = shift_obj.StartTime.strftime('%I:%M %p')
                ret['StartTime'] = shift_obj.StartTime
            else:
                ret['DisplayStartTime'] = None

            if getattr(shift_obj, 'EndTime', None):
                ret['DisplayEndTime'] = shift_obj.EndTime.strftime('%I:%M %p')
                ret['EndTime'] = shift_obj.EndTime
            else:
                ret['DisplayEndTime'] = None

            ret["DayOff"] = shift_obj.DayOff
            if shift_obj.DayOff == "Yes":
                ret['DisplayStartTime'] = "-"
                ret['DisplayEndTime'] = "-"
                ret['EndTime'] = "-"
                ret['StartTime'] = "-"
            
            ret['TotalHours'] = shift_obj.ShiftHours if shift_obj.DayOff == "No" else "-"
            ret['ShiftShortName'] = shift_obj.ShiftName[:1] if shift_obj.ShiftName else None

        else:

            
            leave_obj = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=employee_id, 
                FromDate__lte=shift_date,  # FromDate should be on or before shift_date
                ToDate__gte=shift_date,     # ToDate should be on or after shift_date
                Status = "Approved"
            ).first()
            
           
            if leave_obj:
                ret['Shift_Id'] = None
                ret['ShiftName'] = "On Leave"
                ret['DisplayStartTime'] = "-"
                ret['DisplayEndTime'] = "-"
                ret['StartTime'] = "-"
                ret['EndTime'] = "-"
                ret['TotalHours'] = "-"
                ret['DayOff'] = "Leave"
                ret['LeaveType'] = leave_obj.Leave_Type
                ret['LeaveReason'] = leave_obj.Reason
                ret["ApprovedBy"] = leave_obj.CreatedBy
                ret["ApprovedDate"] = leave_obj.updated_at.date()
                ret["ApprovedDay"] = leave_obj.updated_at.date().strftime("%A")
            else:
                # If no shift and no leave, mark as absent
                ret['Shift_Id'] = None
                ret['ShiftName'] = "Absent"
                ret['DisplayStartTime'] = "-"
                ret['DisplayEndTime'] = "-"
                ret['StartTime'] = "-"
                ret['EndTime'] = "-"
                ret['TotalHours'] = "-"
                ret['DayOff'] = "Absent"
        
        
        
        return ret
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class ShiftReportSerializer(serializers.ModelSerializer):
    ShiftOrLeave = serializers.SerializerMethodField()

    class Meta:
        model = ShiftDetails_Master
        fields = "__all__"

    def get_ShiftOrLeave(self, obj):
        if obj.Shift_Id:
            return obj.Shift_Id.ShiftName
        else:
            leave_entry = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=obj.Employee,
                FromDate__lte=obj.ShiftDate,
                ToDate__gte=obj.ShiftDate,
                Status="Approved"
            ).first()
            return leave_entry.LeaveType if leave_entry else "No Shift Assigned"

    def to_representation(self, instance):
        ret = super().to_representation(instance)        
        ret["Summa"] = instance.Employee
        
        return ret



class EmployeeAttendanceSerializers(serializers.ModelSerializer):
    class Meta:
        model = Employee_Attendance
        fields = "__all__"
    def create(self, validated_data):
        return super().create(validated_data)
    def update(self, instance,data):
        return super().update(instance,data)
    def to_representation(self, instance):
        ret = super().to_representation(instance)        
        ret["In_TimeWithPeriod"] = f"""{instance.In_Time.strftime('%H:%M')} {instance.In_TimePeriod}"""
        ret["Out_TimeWithPeriod"] = f"""{instance.Out_Time.strftime('%H:%M') if instance.Out_Time is not None else ""} {instance.Out_TimePeriod if instance.Out_TimePeriod is not None else ""}"""
        return ret
    
    
class EmployeeLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Leave_Register
        fields = "__all__"

    
class EmployeeAdvanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Advance_Request
        fields="__all__"
    def round_time(self, time_obj):
        if time_obj.minute < 55:
            rounded_time = time_obj.replace(minute=0) 
        else:
            rounded_time = (datetime.combine(datetime.today(), time_obj) + timedelta(hours=1)).time().replace(minute=0)
        return rounded_time.strftime("%I:%M %p") 
    def to_representation(self, instance):
        hashwar = super().to_representation(instance)
        hashwar["RequestTime"] = self.round_time(instance.created_at.time())
        hashwar["ApprovedTime"] = self.round_time(instance.updated_at.time())
        return hashwar
    

    
    
class EmployeePersonaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Personal_Form_Detials
        # fields = ["Tittle", "First_Name", "Middle_Name", "Last_Name", "Employee_ID","Photo"] 
        fields = "__all__"
        
    def to_representation(self, instance):
        var =  super().to_representation(instance)
        var['EmployeeName'] = " ".join(filter(None, [
        instance.Tittle.Title_Name if instance.Tittle else '',
        instance.First_Name,
        instance.Middle_Name or '',
        instance.Last_Name or ''
    ])).strip()  
        var["Tittle"] = instance.Tittle.Title_Name  
        var["Photo"] = f"""data:image/jpeg;base64,{base64.b64encode(instance.Photo).decode()}""" if instance.Photo else None
        var["Designation"] = instance.Designation.Designation_Name if instance.Designation else ""
        var["Category_Name"] = instance.Category.Category_Name if instance.Category else ""
        var["Location_Name"] = instance.Location.Location_Name if instance.Location else ""
        var["BloodGroup_Name"] = instance.BloodGroup.BloodGroup_Name if instance.BloodGroup else ""
        var["Classification_Name"] = instance.Classification.Classification_Name if instance.Classification else ""
        var["Role_Name"] = instance.Role.Role_Name if instance.Role else ""
        var["Department_Name"] = ", ".join([dept.Department_Name for dept in instance.Department.all()]) if instance.Department.exists() else ""
        var["Speciality_Name"] = instance.Speciality.Speciality_Name if instance.Speciality else ""
        return var
    
class NurseVsNurseStationSerializer(serializers.ModelSerializer):
    Employee_ID = EmployeePersonaDataSerializer(many=True, read_only=True)
    Wards = serializers.SerializerMethodField()
    Nurse_Count = serializers.SerializerMethodField()
    class Meta:
        model = NurseVsNurseStation
        fields = "__all__"
    def create(self, validated_data):
        nurse_ids = validated_data.pop('Employee_ID', [])
        nurse_station = NurseVsNurseStation.objects.create(**validated_data)
        nurse_station.Employee_ID.set(nurse_ids)
        return nurse_station
    def update(self, instance, validated_data):
        employee_ids = validated_data.pop('Employee_ID', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if employee_ids is not None:
            instance.Employee_ID1.set(employee_ids)  
        instance.save()
        return instance
    def get_Wards(self, instance):
        nurse_station_details = NurseStationMasterDetails.objects.filter(NurseStationid=instance.NurseStationid )
        return [{
            "WardName": ward.Wardid.Ward_Name,
            # "Building_Name": ward.Wardid.Building_Name.Building_Name,
            # "Block_Name": ward.Wardid.Block_Name.Block_Name,
            # "Floor_Name": ward.Wardid.Floor_Name.Floor_Name,
            "Location_Name": ward.Wardid.Location_Name.Location_Name,
            "Status": ward.Wardid.Status,
            "BedCount": Room_Master_Detials.objects.filter(
                Ward_Name__in=RoomType_Master_Detials.objects.filter(Ward_Name=ward.Wardid).values_list('Room_Id', flat=True)
            ).count()
        } for ward in nurse_station_details]
    def get_Nurse_Count(self, instance):
        return instance.Employee_ID.count()
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        nurse_station = instance.NurseStationid
        for field in nurse_station._meta.fields:
            field_name = field.name
            if hasattr(nurse_station, field_name):
                value = getattr(nurse_station, field_name)
                if hasattr(value, '_meta'): 
                    display_field = next(
                        (f.name for f in value._meta.fields if isinstance(f, models.CharField)),
                        value._meta.pk.name
                    )
                    ret[f"{field_name}"] = getattr(value, display_field)
                else:
                    ret[f"{field_name}"] = value
        return ret

class EmployeePersonaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Personal_Form_Detials
        fields = "__all__"
        
    def to_representation(self, instance):
        var =  super().to_representation(instance)
        var['EmployeeName'] = " ".join(filter(None, [
        instance.Tittle.Title_Name if instance.Tittle else '',
        instance.First_Name,
        instance.Middle_Name or '',
        instance.Last_Name or ''
    ])).strip()  
        var["Tittle"] = instance.Tittle.Title_Name  
        var["Photo"] = f"""data:image/jpeg;base64,{base64.b64encode(instance.Photo).decode()}""" if instance.Photo else None
        var["Designation"] = instance.Designation.Designation_Name if instance.Designation else ""
        var["Category_Name"] = instance.Category.Category_Name if instance.Category else ""
        var["Location_Name"] = instance.Location.Location_Name if instance.Location else ""
        var["BloodGroup_Name"] = instance.BloodGroup.BloodGroup_Name if instance.BloodGroup else ""
        var["Classification_Name"] = instance.Classification.Classification_Name if instance.Classification else ""
        var["Role_Name"] = instance.Role.Role_Name if instance.Role else ""
        var["Department_Name"] = ", ".join([dept.Department_Name for dept in instance.Department.all()]) if instance.Department.exists() else ""
        var["Speciality_Name"] = instance.Speciality.Speciality_Name if instance.Speciality else ""
        return var
    
class NurseVsNurseStationSerializer(serializers.ModelSerializer):
    Employee_ID = EmployeePersonaDataSerializer(many=True, read_only=True)
    Wards = serializers.SerializerMethodField()
    Nurse_Count = serializers.SerializerMethodField()
    class Meta:
        model = NurseVsNurseStation
        fields = "__all__"
    def create(self, validated_data):
        nurse_ids = validated_data.pop('Employee_ID', [])
        nurse_station = NurseVsNurseStation.objects.create(**validated_data)
        nurse_station.Employee_ID.set(nurse_ids)
        return nurse_station
    def update(self, instance, validated_data):
        employee_ids = validated_data.pop('Employee_ID', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if employee_ids is not None:
            instance.Employee_ID1.set(employee_ids)  
        instance.save()
        return instance
    def get_Wards(self, instance):
        nurse_station_details = NurseStationMasterDetails.objects.filter(NurseStationid=instance.NurseStationid )
        return [{
            "WardName": ward.Wardid.Ward_Name,
            # "Building_Name": ward.Wardid.Building_Name.Building_Name,
            # "Block_Name": ward.Wardid.Block_Name.Block_Name,
            # "Floor_Name": ward.Wardid.Floor_Name.Floor_Name,
            "Location_Name": ward.Wardid.Location_Name.Location_Name,
            "Status": ward.Wardid.Status,
            "BedCount": Room_Master_Detials.objects.filter(
                Ward_Name__in=RoomType_Master_Detials.objects.filter(Ward_Name=ward.Wardid).values_list('Room_Id', flat=True)
            ).count()
        } for ward in nurse_station_details]
    def get_Nurse_Count(self, instance):
        return instance.Employee_ID.count()
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        nurse_station = instance.NurseStationid
        for field in nurse_station._meta.fields:
            field_name = field.name
            if hasattr(nurse_station, field_name):
                value = getattr(nurse_station, field_name)
                if hasattr(value, '_meta'): 
                    display_field = next(
                        (f.name for f in value._meta.fields if isinstance(f, models.CharField)),
                        value._meta.pk.name
                    )
                    ret[f"{field_name}"] = getattr(value, display_field)
                else:
                    ret[f"{field_name}"] = value
        return ret

class EmployeePayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Personal_Form_Detials
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        self.fromdate = kwargs.pop("fromdate", None)
        self.todate = kwargs.pop("todate", None)
        super().__init__(*args, **kwargs)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        # Default values
        advanceid = None
        AmountDeduct_PerMonth = 0.0
        Repayment_Due = None
        Installment_Status = None
        No_of_MonthPaid = 0
        PaidAmount = 0.0
        Tds_Amount = 0.0

        # -------------------- ADVANCE --------------------
        advancedetails = Employee_Advance_Request.objects.filter(
            Employee_Id__Employee__Employee_ID=instance.Employee_ID,
            Installment_Status="Pending",
            Status="Approved"
        ).last()

        if advancedetails:
            advanceid = advancedetails.Advance_RequestId
            AmountDeduct_PerMonth = float(advancedetails.AmountDeduct_PerMonth or 0)
            Repayment_Due = advancedetails.Repayment_Due
            Installment_Status = advancedetails.Installment_Status
            No_of_MonthPaid = advancedetails.No_of_MonthPaid or 0
            PaidAmount = float(advancedetails.PaidAmount or 0)

        # -------------------- SALARY HISTORY --------------------
        salarydata = Financial_History_Detials.objects.filter(Employee=instance.Employee_ID)
        Currenthistory = Current_History_Detials.objects.filter(Employee=instance.Employee_ID).first()

        if salarydata.exists():
            salary = salarydata.first()

            basic_salary = float(salary.BasicSalary or 0)
            pf_for_employer = float(salary.PF_EmployerAmount or 0)
            pf_for_employee = float(salary.PF_EmployeeAmount or 0)
            esi_amount = float(salary.ESI_Amount or 0)

            # Days in month safeguard
            _, days_in_month = monthrange(self.fromdate.year, self.fromdate.month) if self.fromdate else (0, 30)
            per_day_salary = basic_salary / days_in_month if days_in_month else 0

            total_days, present_days, absent_days = 0, 0, 0
            if self.fromdate and self.todate:
                total_days = (self.todate - self.fromdate).days + 1
                Attendance = Employee_Attendance.objects.filter(
                    Employee=instance.Employee_ID,
                    Date__range=[self.fromdate, self.todate]
                )
                present_days = Attendance.filter(Attendance_Status="Present").count()
                absent_days = Attendance.filter(Attendance_Status__in=["Absent", "On Leave"]).count()
                if absent_days == 0:
                    absent_days = total_days - present_days

                ret["TotalDays"] = total_days
                ret["PresentDays"] = present_days
                ret["AbsentDays"] = absent_days

            # Salary calculations
            payable_salary = float(total_days * per_day_salary if total_days else basic_salary)

            allowances = EmployeeAllowanceDetails.objects.filter(Employee=instance.Employee_ID)
            total_allowance_amount = float(allowances.aggregate(total=Sum("amount"))["total"] or 0)

            # Professional tax
            if basic_salary > 25000:
                professional_tax = 250
            elif basic_salary > 15000:
                professional_tax = 200
            elif basic_salary > 10000:
                professional_tax = 150
            elif basic_salary > 5000:
                professional_tax = 100
            else:
                professional_tax = 0

            # Other deductions
            deductions_data = EmployeeDeductionDetails.objects.filter(Employee=instance.Employee_ID)
            total_deduction_amount = float(deductions_data.aggregate(total=Sum("amount"))["total"] or 0)

            approved_leaves = Employee_Leave_Register.objects.filter(
                Employee_Id__Employee__Employee_ID=instance.Employee_ID,
                Status="Approved",
                FromDate__lte=self.todate,
                ToDate__gte=self.fromdate
            ).aggregate(total=Sum("DaysCount"))["total"] or 0

            total_allowancedleaves = Employee_Leavelist.objects.filter(Employee=instance.Employee_ID).aggregate(total=Sum("leave_count")) or {"total": 0}
            allowed_leave = total_allowancedleaves.get("total") or 0

            loss_of_pay_days = max(0, approved_leaves - allowed_leave)
            loss_of_pay_amount = float(loss_of_pay_days * per_day_salary)

            # FINAL CALCULATIONS
            earnings = total_allowance_amount
            total_deductions = (
                pf_for_employee +
                esi_amount +
                AmountDeduct_PerMonth +
                total_deduction_amount +
                loss_of_pay_amount +
                professional_tax
            )

            net_salary = (payable_salary + earnings) - total_deductions

            # -------------------- STORE IN RESPONSE --------------------
            ret["basic_salary"] = round(basic_salary, 2)
            ret["Earnings"] = round(payable_salary + earnings, 2)
            ret["Deductions"] = round(total_deductions, 2)
            ret["payable_salary"] = round(payable_salary, 2)
            ret["Net_Salary"] = round(net_salary, 2)

            ret["Allowances"] = [
                {"id": a.pk, "name": a.allowance, "amount": round(float(a.amount or 0), 2)}
                for a in allowances
            ]
            ret["PostAlowance"] = [i.pk for i in allowances]
            ret["PostDeduction"] = [i.pk for i in deductions_data]
            ret["DeductionsDetails"] = [
                {"id": d.pk, "name": d.deduction, "amount": round(float(d.amount or 0), 2)}
                for d in deductions_data
            ]

            ret["LossOfPayDays"] = loss_of_pay_days
            ret["LossOfPayAmount"] = round(loss_of_pay_amount, 2)
            ret["AmountDeduct_PerMonth"] = round(AmountDeduct_PerMonth, 2)
            ret["pf_for_employee"] = round(pf_for_employee, 2)
            ret["esi_amount"] = round(esi_amount, 2)
            ret["professional_tax"] = professional_tax
            ret["Tds_Amount"] = round(Tds_Amount, 2)

            # Bank details
            ret["PFNumber"] = salary.PFNumber or ""
            ret["AccountHolderName"] = salary.AccountHolderName or ""
            ret["AccountNumber"] = salary.AccountNumber or ""
            ret["BankName"] = salary.BankName or ""
            ret["Branch"] = salary.Branch or ""
            ret["IfscCode"] = salary.IfscCode or ""
            ret["PanNumber"] = salary.PanNumber or ""

        # -------------------- DEPARTMENT & DESIGNATION --------------------
        dept = instance.Department.all()
        ret["Department_Name"] = ", ".join([d.Department_Name for d in dept]) if dept.exists() else ""
        ret["Designation_Name"] = instance.Designation.Designation_Name if instance.Designation else ""

        # -------------------- PHOTO --------------------
        ret["Photo"] = (
            f"data:image/jpeg;base64,{base64.b64encode(instance.Photo).decode()}"
            if instance.Photo else None
        )

        # -------------------- PAYSLIP STATUS --------------------
        EmployeePayslipStatus = Employee_PaySlips.objects.filter(Employee=instance.Employee_ID).first()
        ret["PaySlip_Id"] = None
        ret["EmployeePayslip"] = None
        ret["PaySlip_Date"] = None
        ret["Paid_Salary"] = None
        ret["Status"] = "Pending"
        ret["SalaryMonth"] = None

        if Currenthistory:
            ret["DateOfJoining"] = Currenthistory.DateOfJoining

        ret["advanceid"] = advanceid
        ret["No_of_MonthPaid"] = No_of_MonthPaid

        if EmployeePayslipStatus:
            ret["PaySlip_Id"] = EmployeePayslipStatus.PaySlip_Id
            ret["EmployeePayslip"] = (
                f"data:application/pdf;base64,{base64.b64encode(EmployeePayslipStatus.EmployeePayslip).decode()}"
                if EmployeePayslipStatus.EmployeePayslip else None
            )
            ret["PaySlip_Date"] = EmployeePayslipStatus.PaySlip_Date
            ret["Paid_Salary"] = EmployeePayslipStatus.Paid_Salary
            ret["Status"] = EmployeePayslipStatus.Status
            ret["SalaryMonth"] = EmployeePayslipStatus.SalaryMonth

        return ret

    
    
class NotifySerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
    def to_representation(self,ins):
        var = super().to_representation(ins)
        var["Photo"] = None
        var["created_at"] = ins.created_at.date() 
        var["created_at_ago"]=ins.created_at
        if ins.circular_id:
            var["Venue"] = f"""{ins.circular_id.Venue.Administration_Name},{ins.circular_id.Venue.Building_Name.Building_Name},{ins.circular_id.Venue.Block_Name.Block_Name},{ins.circular_id.Venue.Floor_Name.Floor_Name},{ins.circular_id.Venue.Location_Name.Location_Name}"""
            var["CircularTime"] = ins.circular_id.CircularTime
            var["CircularDate"] = ins.circular_id.CircularDate
            var["CircularBy"] = f"""{ins.circular_id.CircularCreateEmployee.Tittle.Title_Name} {ins.circular_id.CircularCreateEmployee.First_Name} {ins.circular_id.CircularCreateEmployee.Middle_Name} {ins.circular_id.CircularCreateEmployee.Last_Name}"""
            var["Subject"] = ins.circular_id.Subject    
            var["Remarks"] = ins.circular_id.Remarks  
            var["Photo"] = (f"""data:image/jpeg;base64,{base64.b64encode(ins.circular_id.CircularCreateEmployee.Photo).decode()}""" if ins.circular_id.CircularCreateEmployee.Photo else None)   

        return var
    

