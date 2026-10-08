from django.urls import path
from .DutyMaster import *
from .EmployeeShift import *
from .EmployeeRequest import *
from .EmployeeRegistration import *
from .DutyManagement import *

from .LeaveMaster import *
from .AllowanceMaster import *
from .DeductionMaster import *
from .Hod import *
from .Employeelist import *



urlpatterns=[
   
    path('Employee_Registration_Details',Employee_Registration_Details,name='Employee_Registration_Details'),
    path('get_User_Employee_Details',get_User_Employee_Details,name='get_User_Employee_Details'),
    path('DutyRosterMasters', DutyRosterMasters, name='DutyRosterMasters'),
    path('Shift_Details_link', Shift_Details_link, name='Shift_Details_link'),
    path('Get_Employee_Registered_Details', Get_Employee_Registered_Details, name='Get_Employee_Registered_Details'),
    path('filter_Sourcewise_Employee_Details', filter_Sourcewise_Employee_Details, name='filter_Sourcewise_Employee_Details'),

    path('Employee_Details',Employee_Details, name='Employee_Details'),
    path('Employee_Leave_Details', Employee_Leave_Details, name='Employee_Leave_Details'),
    path('Insert_Leave_Register', Insert_Leave_Register, name='Insert_Leave_Register'),
    path('Employee_Leave_Status_Link', Employee_Leave_Status_Link, name='Employee_Leave_Status_Link'),
    path('Employee_Permission_Status_Link', Employee_Permission_Status_Link, name='Employee_Permission_Status_Link'),
    path('Employee_FullLeave_Status_Link', Employee_FullLeave_Status_Link, name='Employee_FullLeave_Status_Link'),
    path('Employee_FullPermission_Status_Link', Employee_FullPermission_Status_Link, name='Employee_FullPermission_Status_Link'),
    path('Insert_AdvanceRequest_Register', Insert_AdvanceRequest_Register, name='Insert_AdvanceRequest_Register'),
    path('Employee_PrevAdvance_Details', Employee_PrevAdvance_Details, name='Employee_PrevAdvance_Details'),
    path('Req_Recent_Advance_Register_Recent', Req_Recent_Advance_Register_Recent, name='Req_Recent_Advance_Register_Recent'),
    path('Employee_Designation_Details', Employee_Designation_Details, name='Employee_Designation_Details'),
    path('Employee_Advance_RequestList_link', Employee_Advance_RequestList_link, name='Employee_Advance_RequestList_link'),
    path('Prev_Amount_Details', Prev_Amount_Details, name='Prev_Amount_Details'),
    path('update_Advance_Approval', update_Advance_Approval, name='update_Advance_Approval'),
    path('Advance_Amount_Details', Advance_Amount_Details, name='Advance_Amount_Details'),
    path('AdvanceComplete_Amount_Details', AdvanceComplete_Amount_Details, name='AdvanceComplete_Amount_Details'),
    path('All_Employee_Leave_Status_Link', All_Employee_Leave_Status_Link, name='All_Employee_Leave_Status_Link'),
    path('All_Permission_details_link', All_Permission_details_link, name='All_Permission_details_link'),
    path('Employee_Consume_Permission_Link', Employee_Consume_Permission_Link, name='Employee_Consume_Permission_Link'),
    path('Employee_Previous_Leave_Details', Employee_Previous_Leave_Details, name='Employee_Previous_Leave_Details'),
    path('update_Advance_Leave', update_Advance_Leave, name='update_Advance_Leave'),
    path('Employee_Permission_Details', Employee_Permission_Details, name='Employee_Permission_Details'),
    path('All_Consumed_Leave', All_Consumed_Leave, name='All_Consumed_Leave'),
    path('All_Consume_Permission_details', All_Consume_Permission_details, name='All_Consume_Permission_details'),
    
    # DutyManagement
    path('Employee_DutyManagement_Details', Employee_DutyManagement_Details, name='Employee_DutyManagement_Details'),
    path('Employee_ShiftDetails_Link', Employee_ShiftDetails_Link, name='Employee_ShiftDetails_Link'),
    path('update_Shift_Detail_Link', update_Shift_Detail_Link, name='update_Shift_Detail_Link'),
    path('Employee_Complete_ShiftDetails_Link', Employee_Complete_ShiftDetails_Link, name='Employee_Complete_ShiftDetails_Link'),
    path('Shift_Details_Report', Shift_Details_Report, name='Shift_Details_Report'),
    
    # Attendence
    path('insert_attendance_report', insert_attendance_report, name='insert_attendance_report'),
      path('attendance_report', attendance_report, name='attendance_report'),
    path('holiday', holiday, name='holiday'),
    path('Attendance_Master_InsetLink', Attendance_Master_InsetLink, name='Attendance_Master_InsetLink'),
    path('Employee_Shift_Details_Link', Employee_Shift_Details_Link, name='Employee_Shift_Details_Link'),
    path('Employee_Report_Details_link', Employee_Report_Details_link, name='Employee_Report_Details_link'),

    path('Employee_Monthly_Report', Employee_Monthly_Report, name='Employee_Monthly_Report'),

    path('insert_EmployeePaySlips', insert_EmployeePaySlips, name='insert_EmployeePaySlips'),
  

    path('getforemployeepayrolllist', getforemployeepayrolllist, name='getforemployeepayrolllist'),
    path('EmployeePayslipDownload', EmployeePayslipDownload, name='EmployeePayslipDownload'),


    path('Employee_Monthly_Report', Employee_Monthly_Report, name='Employee_Monthly_Report'),
   


    path('Employee_Monthly_Report', Employee_Monthly_Report, name='Employee_Monthly_Report'),
    path('getemployeelistforappraisal', getemployeelistforappraisal, name='getemployeelistforappraisal'),
    path('employee_performanceamount', employee_performanceamount, name='employee_performanceamount'),
    path('insert_employee_performance', insert_employee_performance, name='insert_employee_performance'),
    path('employee_allowance', employee_allowance, name='employee_allowance'),
    path('get_employeeperformance', get_employeeperformance, name='get_employeeperformance'),
    path('Add_Complaint', Add_Complaint, name='Add_Complaint'),
    path('Complaint_Details', Complaint_Details, name='Complaint_Details'),
    path('All_Complaint_list', All_Complaint_list, name='All_Complaint_list'),
    path('insert_ComplaintActions', insert_ComplaintActions, name='insert_ComplaintActions'),
    path('Employee_Details_by_Designation', Employee_Details_by_Designation, name='Employee_Details_by_Designation'),
    path('Add_Circular', Add_Circular, name='Add_Circular'),
    path('get_circular_Details', get_circular_Details, name='get_circular_Details'),

    path('Employee_AttendnanceManagement_Details', Employee_AttendnanceManagement_Details, name='Employee_AttendnanceManagement_Details'),

    path('get_username_details', get_username_details, name='get_username_details'),


path("DutyAssign_IndEmployee",DutyAssign_IndEmployee,name="DutyAssign_IndEmployee"),
    path("Bulk_ShiftApprove",Bulk_ShiftApprove,name="Bulk_ShiftApprove"),
    path("Department_ShiftReport",Department_ShiftReport,name="Department_ShiftReport"),

# path("Department_ShiftReport",Department_ShiftReport,name="Department_ShiftReport"),
    path("Get_GovtHolidays",Get_GovtHolidays,name="Get_GovtHolidays"),
    path("Insert_DailyAttendance",Insert_DailyAttendance,name="Insert_DailyAttendance"),
    path("GET_Employee_All_Data_ForCalendar",GET_Employee_All_Data_ForCalendar,name="GET_Employee_All_Data_ForCalendar"),
    path("Get_All_Employees_ForCalendar",Get_All_Employees_ForCalendar,name="Get_All_Employees_ForCalendar"),
 path("all_Duty_ForcalendarAssign",all_Duty_ForcalendarAssign,name="all_Duty_ForcalendarAssign"),
    path("Get_All_Nurses",Get_All_Nurses,name="Get_All_Nurses"),
path("AssignNurseToStation",AssignNurseToStation,name="AssignNurseToStation"),

 # leave master

    path('leave-master/', leave_master_list, name='leave-master-list'),
    path('leave-master/create/', leave_master_create, name='leave-master-create'),
    path('leave-master/update/<int:pk>/',leave_master_update,name='leave-master-update'),

    # AllowanceMaster


    path('allowance-master/', allowance_master_list,name="allowance-master"),
    path('allowance-master/create/', allowance_master_create,name="allowance-master-create"),
    path('allowance-master/update/<int:id>/', allowance_master_update,name="allowance-master-update"),

    # Deduction Master

    path('deduction-master/', deduction_master_list, name='deduction-master-list'),
    path('deduction-master/create/', deduction_master_create, name='deduction-master-create'),
    path('deduction-master/update/<int:id>/',deduction_master_update, name='deduction-master-update'),

# 18-2-25

    path('get_leave_master_details',get_leave_master_details,name='get_leave_master_details'),
    path('get_allowances_details',get_allowances_details,name='get_allowances_details'),
    path('get_deduction_details',get_deduction_details,name='get_deduction_details'),
# 27-02-25
    # path('HOD_details',HOD_details,name='HOD_details'),
     path('get_employees_by_role', get_employees_by_role, name='get_employees_by_role'),
     path('get_employees_by_role1', get_employees_by_role1, name='get_employees_by_role1'),
    path("NurseStationShiftAssign",NurseStationShiftAssign,name="NurseStationShiftAssign"),
path("NotificationGet",NotificationGet,name="NotificationGet"),

path('Get_HOD_Details',Get_HOD_Details,name='Get_HOD_Details'),
path('Employee_mapping_Details',Employee_mapping_Details,name='Employee_mapping_Details'),
path('Employee_List_Details',Employee_List_Details,name='Employee_List_Details'),
path('Employee_mapping_Remove_Details',Employee_mapping_Remove_Details,name='Employee_mapping_Remove_Details'),
path('HOD_MappedEmployee_Details',HOD_MappedEmployee_Details,name='HOD_MappedEmployee_Details'),
path('HOD_MappedEmployee_Details_For_Calendar',HOD_MappedEmployee_Details_For_Calendar,name='HOD_MappedEmployee_Details_For_Calendar'),
# 24-05-2025
path('Fetch_Employee_Details',Fetch_Employee_Details,name='Fetch_Employee_Details'),

path('employee_excel_upload',employee_excel_upload,name='employee_excel_upload'),
path('Employee_Registration_Details_Fetch',Employee_Registration_Details_Fetch,name='Employee_Registration_Details_Fetch'),
path('get_shift_details',get_shift_details,name='get_shift_details'),
path('submit_overtime',submit_overtime,name='submit_overtime'),
path('OtAssignedDatas',OtAssignedDatas,name='OtAssignedDatas'),
path('get_employee_gratuity_monthly',get_employee_gratuity_monthly,name='get_employee_gratuity_monthly'),
path('get_security_deposit_from_table',get_security_deposit_from_table,name='get_security_deposit_from_table'),
path('get_employee_deductions',get_employee_deductions,name='get_employee_deductions'),
path('upload_attendance',upload_attendance,name='upload_attendance'),
path('get_employee_monthwise_payment',get_employee_monthwise_payment,name='get_employee_monthwise_payment'),
path('get_employees_department_wise',get_employees_department_wise,name='get_employees_department_wise'),
path('get_shift_master',get_shift_master,name='get_shift_master'),
path('save_employee_shifts',save_employee_shifts,name='save_employee_shifts'),
path('get_employee_Salary_payment',get_employee_Salary_payment,name='get_employee_Salary_payment'),
path('get_Employee_PF_Details_for_rep',get_Employee_PF_Details_for_rep,name='get_Employee_PF_Details_for_rep'),
path('get_employee_monthwise_payment_full',get_employee_monthwise_payment_full,name='get_employee_monthwise_payment_full'),
path('get_employee_attendance',get_employee_attendance,name='get_employee_attendance'),


    
]
