from django.urls import path

from .views import upload_patient_csv, upload_revisit_patient_csv1
from .EmgRegister import *
from .Registration import *
from .AppointmentRequestList import *
from .GeneralBilling import *
from .IP_Billing import *   
from .ReceptionReports import *
from .FODashboard import *
from .OP_Billing import *
from .PatientLedger import *
from .BillReports import *
from .OPEditRefundBilling import *
from .views import *
from .AdvanceCollection import *

urlpatterns=[
    path('Emergency_Registration_Details', Emergency_Registration_Details, name='Emergency_Registration_Details'),
    path('get_Emergency_patient_list', get_Emergency_patient_list, name='get_Emergency_patient_list'),
    path('Patient_Registration', Patient_Registration, name='Patient_Registration'),
    path('Radiology_Patient_Registration', Radiology_Patient_Registration, name='Radiology_Patient_Registration'),
   
    path('Register_Patients_Details', Register_Patients_Details, name='Register_Patients_Details'),
    path('Fetch_Register_Patients_Details', Fetch_Register_Patients_Details, name='Fetch_Register_Patients_Details'),
    path('Patient_OP_Registration', Patient_OP_Registration, name='Patient_OP_Registration'),
    path('IP_Patient_Admission_Purpose_Details_Link', IP_Patient_Admission_Purpose_Details_Link, name='IP_Patient_Admission_Purpose_Details_Link'),

    # path('Delete_Doctor_In_OP_Register/<int:RegistrationId>/<str:Doc_id>/', Delete_Doctor_In_OP_Register, name='Delete_Doctor_In_OP_Register'),
    path('Delete_Doctor_In_OP_Register/', Delete_Doctor_In_OP_Register, name='Delete_Doctor_In_OP_Register'),
   
    path('get_OP_patient_details', get_OP_patient_details, name='get_OP_patient_details'),
    path('IP_Patient_Registration_Details_Link', IP_Patient_Registration_Details_Link, name='IP_Patient_Registration_Details_Link'),
    path('get_Employee_by_PatientCategory', get_Employee_by_PatientCategory, name='get_Employee_by_PatientCategory'),
    path('get_DoctorId_by_PatientCategory', get_DoctorId_by_PatientCategory, name='get_DoctorId_by_PatientCategory'),
    path('get_Patient_Details_by_patientId', get_Patient_Details_by_patientId, name='get_Patient_Details_by_patientId'),
    path('Filter_Patient_by_Multiple_Criteria', Filter_Patient_by_Multiple_Criteria, name='get_DoctorId_by_PFilter_Patient_by_Multiple_CriteriaatientCategory'),
    path('get_patient_appointment_details', get_patient_appointment_details, name='get_patient_appointment_details'),
    path('get_patient_unique_id', get_patient_unique_id, name='get_patient_unique_id'),
    path('get_patient_ip_registration_details', get_patient_ip_registration_details, name='get_patient_ip_registration_details'),
    path('get_ip_registration_before_handover_details', get_ip_registration_before_handover_details, name='get_ip_registration_before_handover_details'),
    path('get_ip_roomdetials_before_handover_details', get_ip_roomdetials_before_handover_details, name='get_ip_roomdetials_before_handover_details'),
    path('post_ip_roomdetials_before_handover_details', post_ip_roomdetials_before_handover_details, name='post_ip_roomdetials_before_handover_details'),
    path('post_ip_handover_details', post_ip_handover_details, name='post_ip_handover_details'),
    path('post_ip_submit_handover_or_cancel_details', post_ip_submit_handover_or_cancel_details, name='post_ip_submit_handover_or_cancel_details'),
    path('get_ip_roomdetials_for_bedtransfer_details', get_ip_roomdetials_for_bedtransfer_details, name='get_ip_roomdetials_for_bedtransfer_details'),
    path('insert_op_ip_convertion', insert_op_ip_convertion, name='insert_op_ip_convertion'),
    path('post_ip_bed_transfer_details', post_ip_bed_transfer_details, name='post_ip_bed_transfer_details'),
    path('bed_transfer_approve_cancel_details', bed_transfer_approve_cancel_details, name='bed_transfer_approve_cancel_details'),
    path('service_procedure_request', service_procedure_request, name='service_procedure_request'),
    path('get_ip_billing_datasss', get_ip_billing_datasss, name='get_ip_billing_datasss'),
    
    path('Patients_Management_Filter', Patients_Management_Filter, name='Patients_Management_Filter'),
    path('Total_Patients_Count', Total_Patients_Count, name='Total_Patients_Count'),
   
    path('Patient_Master_List', Patient_Master_List, name='Patient_Master_List'),
    path('Patient_BasicDetails_Update', Patient_BasicDetails_Update, name='Patient_BasicDetails_Update'),
    path('Patients_Counts', Patients_Counts, name='Patients_Counts'),
    path('get_AdmissionDetails', get_AdmissionDetails, name='get_AdmissionDetails'),
    
    
    path('get_patient_casuality_details', get_patient_casuality_details, name='get_patient_casuality_details'),
    path('get_patient_diagnosis_details', get_patient_diagnosis_details, name='get_patient_diagnosis_details'),
    path('get_patient_laboratory_details', get_patient_laboratory_details, name='get_patient_laboratory_details'),
    # path('get_Registration_edit_details', get_Registration_edit_details, name='get_Registration_edit_details'),
    path('get_patient_visit_details', get_patient_visit_details, name='get_patient_visit_details'),



    path('Appointment_Request_List_Link', Appointment_Request_List_Link, name='Appointment_Request_List_link'),
    path('Appointment_Request_Cancel', Appointment_Request_Cancel, name='Appointment_Request_Cancel'),
    path('Appointment_Reschedule_List', Appointment_Reschedule_List, name='Appointment_Reschedule_List'),
    path('get_all_appointments', get_all_appointments, name='get_all_appointments'),
    path('fetch_all_appointment_pending_data', fetch_all_appointment_pending_data, name='fetch_all_appointment_pending_data'),
    path('fetch_all_Reschedule_appointment_pending_data', fetch_all_Reschedule_appointment_pending_data, name='fetch_all_Reschedule_appointment_pending_data'),
    path('Appointment_Status_Update_Link', Appointment_Status_Update_Link, name='Appointment_Status_Update_Link'),
    # path('Delete_Appointment/<int:appointment_id>/', Delete_Appointment, name='Delete_Appointment'),

    path('Delete_Appointment/', Delete_Appointment, name='Delete_Appointment'),
    path('Appointment_Request_List_Delete_Links', Appointment_Request_List_Delete_Links, name='Appointment_Request_List_Delete_Links'),
   
    path('appointment_request_count_today', appointment_request_count_today, name='appointment_request_count_today'),
    path('calender_modal_display_data_by_day', calender_modal_display_data_by_day, name='calender_modal_display_data_by_day'),
    
    path('get_available_doctor_by_speciality', get_available_doctor_by_speciality, name='get_available_doctor_by_speciality'),
    path('get_available_doctor_by_speciality_For_Calander', get_available_doctor_by_speciality_For_Calander, name='get_available_doctor_by_speciality_For_Calander'),
    path('get_available_doctor_by_speciality_For_Registration', get_available_doctor_by_speciality_For_Registration, name='get_available_doctor_by_speciality_For_Registration'),
    
    
    path('doctor_available_calender_by_day', doctor_available_calender_by_day, name='doctor_available_calender_by_day'),
    path('daily_appointment_counts_all_doctors', daily_appointment_counts_all_doctors, name='daily_appointment_counts_all_doctors'),
   
       
    path('Get_OP_Billing_Details', Get_OP_Billing_Details, name='Get_OP_Billing_Details'),
    path('Get_OP_Billing_Details_Consultation', Get_OP_Billing_Details_Consultation, name='Get_OP_Billing_Details_Consultation'),
    path('Get_OP_Billing_Details_SingleId', Get_OP_Billing_Details_SingleId, name='Get_OP_Billing_Details_SingleId'),

    # path('GeneralBilling_Link', GeneralBilling_Link, name='GeneralBilling_Link'),
    path('GeneralBilling_Link', GeneralBillingView.as_view(), name='general-billing'),
    path('get_merged_service_data', get_merged_service_data, name='get_merged_service_data'),
    path('get_latest_appointment_for_patient', get_latest_appointment_for_patient, name='get_latest_appointment_for_patient'),
    path('Filter_Patient_data_For_Billing', Filter_Patient_data_For_Billing, name='Filter_Patient_data_For_Billing'),


    path('get_patient_appointment_details_specifydoctor',get_patient_appointment_details_specifydoctor,name='get_patient_appointment_details_specifydoctor'),
    path('Register_Request_Cancel',Register_Request_Cancel,name='Register_Request_Cancel'),
    path('get_patient_appointment_details_withoutcancelled',get_patient_appointment_details_withoutcancelled,name='get_patient_appointment_details_withoutcancelled'),
    path('Total_OP_patients_List',Total_OP_patients_List,name='Total_OP_patients_List'),
    
    path('Registration_Reshedule_Details',Registration_Reshedule_Details,name='Registration_Reshedule_Details'),
    
    path('get_OP_patient_Filter_SpecialityWise',get_OP_patient_Filter_SpecialityWise,name='get_OP_patient_Filter_SpecialityWise'),
    path('get_ip_Patient_registration_details_for_workbench',get_ip_Patient_registration_details_for_workbench,name='get_ip_Patient_registration_details_for_workbench'),
    path('Total_IP_Patients_List',Total_IP_Patients_List,name='Total_IP_Patients_List'),
    
    
    path('get_unique_id_no_validation',get_unique_id_no_validation,name='get_unique_id_no_validation'),


    # path('Get_IP_Billing_Details', Get_IP_Billing_Details, name='Get_IP_Billing_Details'),
    path('Get_IP_Billing_Details', IPBillingDetailsView.as_view(), name='Get_IP_Billing_Details'),
    path('Get_IP_Billing_Details_SingleId', Get_IP_Billing_Details_SingleId, name='Get_IP_Billing_Details_SingleId'),
    path('IP_Billing_Service_List', IP_Billing_Service_List, name='IP_Billing_Service_List'),
    path('IPBilling_Link', IPBillingLinkView.as_view(), name='IPBilling_Link'),
    path('IPBillingFinal_Link', IPBillingFinalLinkView.as_view(), name='IPBillingFinal_Link'),
    path('IPBillingEdit_Link', IPBillingEditLinkView.as_view(), name='IPBillingEdit_Link'),
    path('get_merged_service_data_bill', get_merged_service_data_bill, name='get_merged_service_data_bill'),
    path('get_client_insurance_details', get_client_insurance_details, name='get_client_insurance_details'),
    path('get_countries', get_countries, name='get_countries'),
    path('get_states', get_states, name='get_states'),
    path('get_location_by_pincode', get_location_by_pincode, name='get_location_by_pincode'),
    path('get_location_by_params', get_location_by_params, name='get_location_by_params'),
    path('Patient_details_register', Patient_details_register, name='Patient_details_register'),
    path('Filter_Patients_using_Multiple_Criteria', Filter_Patients_using_Multiple_Criteria, name='Filter_Patients_using_Multiple_Criteria'),

 #  For  Pharmacy Billing Op
    path(
        "get_prescription",
        get_prescription,
        name="get_prescription",
    ),
    path(
        "get_prescriptionqueue",
        get_prescriptionqueue,
        name="get_prescriptionqueue",
    ),
    
    path(
        "get_personal_info",
        get_personal_info,
        name="get_personal_info",
    ),
    
     path(
        "get_name",
        get_name,
        name="get_name",
    ),

    
     path(
        "get_quick_list",
        get_quick_list,
        name="get_quick_list",
    ),
     
       #  opbilling
    path(
        "advance_billing_link",
        advance_billing_link,
        name="advance_billing_link",
    ),
     
    path('op_pharmacy_queue_list_prescrib', op_pharmacy_queue_list_prescrib, name='op_pharmacy_queue_list_prescrib'),
    
    path('Get_OP_Doctor_For_appointment',Get_OP_Doctor_For_appointment,name='Get_OP_Doctor_For_appointment'),
    # path('daily_appointment_counts_per_doctor', daily_appointment_counts_per_doctor, name='daily_appointment_counts_per_doctor'),
    path('daily_appointment_patient_list', daily_appointment_patient_list, name='daily_appointment_patient_list'),

    path('get_available_tokenno_by_speciality',get_available_tokenno_by_speciality,name='get_available_tokenno_by_speciality'),


   # bharathi
    path('Patient_management_details', Patient_management_details, name='Patient_management_details'),
    path('patient_details_management_get_link', patient_details_management_get_link, name='patient_details_management_get_link'),
    path('Patient_Datewise_Annotedimage_details', Patient_Datewise_Annotedimage_details, name='Patient_Datewise_Annotedimage_details'),
    path('patient_appointment_details_link', patient_appointment_details_link, name='patient_appointment_details_link'),
    path('Patient_Datewise_Casesheet_details', Patient_Datewise_Casesheet_details, name='Patient_Datewise_Casesheet_details'),
    
    path('get_Patient_Registration_Summary_Details', get_Patient_Registration_Summary_Details, name='get_Patient_Registration_Summary_Details'),
    path('get_referal_doctor_report_details', get_referal_doctor_report_details, name='get_referal_doctor_report_details'),
    path('get_referal_patient_report_details', get_referal_patient_report_details, name='get_referal_patient_report_details'),
    path('get_referal_doctor_by_dept', get_referal_doctor_by_dept, name='get_referal_doctor_by_dept'),
    path('get_total_patient_report_details', get_total_patient_report_details, name='get_total_patient_report_details'),

    path('get_patient_stats', get_patient_stats, name='get_patient_stats'),
    #path('get_age_distribution_for_male', get_age_distribution_for_male, name='get_age_distribution_for_male'),
    #path('get_age_distribution_for_female', get_age_distribution_for_female, name='get_age_distribution_for_female'),
    path('get_age_distribution', get_age_distribution, name='get_age_distribution'),
    path('op_doctor_wise', op_doctor_wise, name='op_doctor_wise'),
    path('ip_doctor_wise', ip_doctor_wise, name='ip_doctor_wise'),
    
    

    path('IP_AdvanceAmount_collection', IP_AdvanceAmount_collection, name='IP_AdvanceAmount_collection'),
    
    path('get_IP_Registration_edit_details', get_IP_Registration_edit_details, name='get_IP_Registration_edit_details'),
    path('Emergency_Patient_Registration', Emergency_Patient_Registration, name='Emergency_Patient_Registration'),
    path('Emergency_Patient_With_Room_Registration_Details_Link', Emergency_Patient_With_Room_Registration_Details_Link, name='Emergency_Patient_With_Room_Registration_Details_Link'),
    path('Emergency_Patient_From_Patient_Registration', Emergency_Patient_From_Patient_Registration, name='Emergency_Patient_From_Patient_Registration'),
    
    path('get_Emergency_patient_details_for_Quelist', get_Emergency_patient_details_for_Quelist, name='get_Emergency_patient_details_for_Quelist'),
    path('Total_Emergency_patients_List', Total_Emergency_patients_List, name='Total_Emergency_patients_List'),
    
    path('get_Emergency_Registration_edit_details', get_Emergency_Registration_edit_details, name='get_Emergency_Registration_edit_details'),
 
    path('get_appointment_check', get_appointment_check, name='get_appointment_check'),
    
    path('get_IP_Patient_Details_by_patientId', get_IP_Patient_Details_by_patientId, name='get_IP_Patient_Details_by_patientId'),
    path('Filter_IP_Patient_by_Multiple_Criteria', Filter_IP_Patient_by_Multiple_Criteria, name='Filter_IP_Patient_by_Multiple_Criteria'),
    path('get_overall_advance_details', get_overall_advance_details, name='get_overall_advance_details'),
    path('IP_Advance_Refund', IP_Advance_Refund, name='IP_Advance_Refund'),
    path('get_overall_patient_details', get_overall_patient_details, name='get_overall_patient_details'),
    path('get_registered_patient_details', get_registered_patient_details, name='get_registered_patient_details'),
    path('get_Insurance_amount', get_Insurance_amount, name='get_Insurance_amount'),
    path('risk_management_list', risk_management_list, name='risk_management_list'),

    path('OP_Billing_Report', OPBillingReportView.as_view(), name='OP_Billing_Report'),
    path('IP_Billing_Report', IP_Billing_Report, name='IP_Billing_Report'),

    # ABHA
    path('abha_register',abha_register,name='abha_register'),
    path('abha_OTP_register',abha_OTP_register,name='abha_OTP_register'),
    path('verifyOtpSubmit',verifyOtpSubmit,name='verifyOtpSubmit'),
    path('ABHA_Mobile_OTP',ABHA_Mobile_OTP,name='ABHA_Mobile_OTP'),
    path('ABHA_Address_Suggestion_API',ABHA_Address_Suggestion_API,name='ABHA_Address_Suggestion_API'),
    path('ABHA_card',ABHA_card,name='ABHA_card'),
    path('ABHA_card_get',ABHA_card_get,name='ABHA_card_get'),
    path('Get_Patient_by_PhoneNo_Using_AbhaRegister',Get_Patient_by_PhoneNo_Using_AbhaRegister,name='Get_Patient_by_PhoneNo_Using_AbhaRegister'),


    path('get_inhouse_doctor_list',get_inhouse_doctor_list,name='get_inhouse_doctor_list'),
    path('get_inhouse_doctor_related_patient_list',get_inhouse_doctor_related_patient_list,name='get_inhouse_doctor_related_patient_list'),
    path('get_patient_personal_info', get_patient_personal_info, name='get_patient_personal_info'),
    path('get_prescription_op', get_prescription_op, name='get_prescription_op'),
    path('Item_Names_All_Data_Link', Item_Names_All_Data_Link, name='Item_Names_All_Data_Link'),
    path('Item_Names_All_Data_Link_optical', Item_Names_All_Data_Link_optical, name='Item_Names_All_Data_Link_optical'),
        path('Item_Names_All_Data_Link_refund', Item_Names_All_Data_Link_refund, name='Item_Names_All_Data_Link_refund'),

    path('Batchno_Item_Names_All_Link', Batchno_Item_Names_All_Link, name='Batchno_Item_Names_All_Link'),
    path('Batchno_Item_Names_All_Link1', Batchno_Item_Names_All_Link1, name='Batchno_Item_Names_All_Link1'),
    path('Batchno_Item_Names_All_Link_Optical', Batchno_Item_Names_All_Link_Optical, name='Batchno_Item_Names_All_Link_Optical'),
    path('Nurse_Item_Names_All_Link', Nurse_Item_Names_All_Link, name='Nurse_Item_Names_All_Link'),
    path('Nurse_Item_Names_All_Link_optical', Nurse_Item_Names_All_Link_optical, name='Nurse_Item_Names_All_Link_optical'),
    path('Patient_Master_Link', Patient_Master_Link, name='Patient_Master_Link'),
    
        
    path('get_consultation_details',get_consultation_details,name='get_consultation_details'),
    path("OpdRec_Queue_POST",OpdRec_Queue_POST,name="OpdRec_Queue_POST"),
    path('PatientDetails', PatientDetails, name='PatientDetails'),
    # path('Lab_Patient_Registration', Lab_Patient_Registration, name='Lab_Patient_Registration'),
    
    path('GeneralBilling_Due_Link', GeneralBilling_Due_Link, name='GeneralBilling_Due_Link'),
    path('GeneralBilling_Refund_Link', GeneralBilling_Refund_Link, name='GeneralBilling_Refund_Link'),
    path('General_Billing_Refund_Request_Link', General_Billing_Refund_Request_Link, name='General_Billing_Refund_Request_Link'),
    path('IPBilling_Due_Link', IPBilling_Due_Link, name='IPBilling_Due_Link'),
    path('IPBilling_Refund_Link', IPBilling_Refund_Link, name='IPBilling_Refund_Link'),

    path('get_diagnosis_patient_appointment_details',get_diagnosis_patient_appointment_details,name='get_diagnosis_patient_appointment_details'),
    path('get_lab_patient_appointment_details',get_lab_patient_appointment_details,name='get_lab_patient_appointment_details'),

    path('search_patients_by_phone/',search_patients_by_phone, name='search_patients_by_phone'),
    path('add_family_members/',add_family_members, name='add_family_members'),
    path('update_family_members/<str:patient_id>/',update_family_members, name='update_family_members'),
   
    path('get_family_members/<str:primary_patient_id>/', get_family_members, name='get_family_members'),

    path('Patient_MHC_Registration',Patient_MHC_Registration,name='Patient_MHC_Registration'),
    path('Patient_DAYCARE_Registration',Patient_DAYCARE_Registration,name='Patient_DAYCARE_Registration'),
    path('Patient_Overall_Ledger_Details',Patient_Overall_Ledger_Details,name='Patient_Overall_Ledger_Details'),
    path('Registration_Overall_Ledger_Details',Registration_Overall_Ledger_Details,name='Registration_Overall_Ledger_Details'),
    path('Patients_Management_Filter_for_ledger',Patients_Management_Filter_for_ledger,name='Patients_Management_Filter_for_ledger'),
    path('Filter_IP_Patient_by_Multiple_Criteria_Advance', Filter_IP_Patient_by_Multiple_Criteria_Advance, name='Filter_IP_Patient_by_Multiple_Criteria_Advance'),
    path('get_IP_Patient_Details_by_patientId_Advance',get_IP_Patient_Details_by_patientId_Advance, name='get_IP_Patient_Details_by_patientId_Advance') ,

    path('Walk_in_patient_labtestname_details',Walk_in_patient_labtestname_details,name='Walk_in_patient_labtestname_details'),  
    path('Registration_Management_Filter_for_ledger',Registration_Management_Filter_for_ledger,name='Registration_Management_Filter_for_ledger'),  

    path('Patient_LAB_Registration',Patient_LAB_Registration,name='Patient_LAB_Registration'),
    path('Patient_RADIOLOGY_Registration',Patient_RADIOLOGY_Registration,name='Patient_RADIOLOGY_Registration'),
    
    path('OpREgeg_appointment_Detiles',OpREgeg_appointment_Detiles,name='OpREgeg_appointment_Detiles'),
    path('op_pharmacy_queue_list_prescrib_new', op_pharmacy_queue_list_prescrib_new, name='op_pharmacy_queue_list_prescrib_new'),
    path('get_credit_due_amount_for_patient',get_credit_due_amount_for_patient,name='get_credit_due_amount_for_patient'),
    path('get_ip_registration_before_handover_details_Duplicate',get_ip_registration_before_handover_details_Duplicate,name='get_ip_registration_before_handover_details_Duplicate'),
    path('get_IP_patient_personal_info',get_IP_patient_personal_info,name='get_IP_patient_personal_info'),
    path('Batchno_Item_Names_IP_All_Link',Batchno_Item_Names_IP_All_Link,name='Batchno_Item_Names_IP_All_Link'),


    path('get_Patient_Previous_Visit_Details',get_Patient_Previous_Visit_Details,name='get_Patient_Previous_Visit_Details'),
    path('get_ip_registered_Patient_basic_details',get_ip_registered_Patient_basic_details,name='get_ip_registered_Patient_basic_details'),
    path('get_ip_registration_before_handover_details_Duplicate',get_ip_registration_before_handover_details_Duplicate,name='get_ip_registration_before_handover_details_Duplicate'),
    
    path('get_Patient_Previous_Visit_Details_Duplicate',get_Patient_Previous_Visit_Details_Duplicate,name='get_Patient_Previous_Visit_Details_Duplicate'),
    path('Filter_IP_Patients_With_Completed_Status',Filter_IP_Patients_With_Completed_Status,name='Filter_IP_Patients_With_Completed_Status'),
    
    path('patient_registration_count',patient_registration_count,name='patient_registration_count'),
    path('get_OP_Patient_Que_with_Multiple_Doc',get_OP_Patient_Que_with_Multiple_Doc,name='get_OP_Patient_Que_with_Multiple_Doc'),
    path('Total_OP_Patient_with_Multiple_Doc_List',Total_OP_Patient_with_Multiple_Doc_List,name='Total_OP_Patient_with_Multiple_Doc_List'),
    
    path('get_OP_Patient_Details_For_BarcodePrint',get_OP_Patient_Details_For_BarcodePrint,name='get_OP_Patient_Details_For_BarcodePrint'),
    path('get_Emg_Patient_Details_For_BarcodePrint',get_Emg_Patient_Details_For_BarcodePrint,name='get_Emg_Patient_Details_For_BarcodePrint'),
    path('get_OP_Referal_Doctor_PatientList',get_OP_Referal_Doctor_PatientList,name='get_OP_Referal_Doctor_PatientList'),
    path('patient_smartcard_details_view',patient_smartcard_details_view,name='patient_smartcard_details_view'),
    path('Get_Patient_SmartCard_Details_link',Get_Patient_SmartCard_Details_link,name='Get_Patient_SmartCard_Details_link'),
    
    path('get_states_by_country',get_states_by_country,name='get_states_by_country'),
    path('get_districts_by_state',get_districts_by_state,name='get_districts_by_state'),
    path('get_cities_by_district',get_cities_by_district,name='get_cities_by_district'),
    path('get_cities_by_state',get_cities_by_state,name='get_cities_by_state'),

    path('Bill_Cancel_Details',Bill_Cancel_Details,name='Bill_Cancel_Details'),
    path('IP_Billing_Items_Table_For_Insurance_Patient',IP_Billing_Items_Table_For_Insurance_Patient,name='IP_Billing_Items_Table_For_Insurance_Patient'),
    path('Risk_Management_Items',Risk_Management_Items.as_view(),name='Risk_Management_Items'),
    path('GeneralBillingEditView',GeneralBillingEditView.as_view(),name='GeneralBillingEditView'),

    path('Filter_IPPatient_by_Multiple_Criteria',Filter_IPPatient_by_Multiple_Criteria,name='Filter_IPPatient_by_Multiple_Criteria'),
    path('Filter_IP_or_All_Patients',Filter_IP_or_All_Patients,name='Filter_IP_or_All_Patients'),
    path('get_registered_IPPatient_details',get_registered_IPPatient_details,name='get_registered_IPPatient_details'),
    path('get_Tray_Names_For_Product',get_Tray_Names_For_Product,name='get_Tray_Names_For_Product'),

    path('Get_IP_Final_Billing_Details', IPBillingFinalDetailsView.as_view(), name='Get_IP_Final_Billing_Details'),

    path('Get_IP_Billing_LabRad_Details', IPBillingLabRadDetailsView.as_view(), name='Get_IP_Billing_LabRad_Details'),
    path('Get_IP_Billing_Rad_Details',IPBillingRadDetailsView.as_view(),name='Get_IP_Billing_Rad_Details'),
    path('IPQuickBilling_Link', IPQuickBillingLinkView.as_view(), name='IPQuickBilling_Link'),
    path('IPBillingEstimated_Link', IPBillingEstimatedLinkView.as_view(), name='IPBillingEstimated_Link'),
    path('IPBillingEstimatedEditLink', IPBillingEstimatedEditLinkView.as_view(), name='IPBillingEstimatedEditLink'),
    path('IP_Estimated_Billing_Approve_link', IP_Estimated_Billing_Approve_link, name='IP_Estimated_Billing_Approve_link'),

    path('IPBilling_Refund_Approval_Link',IPBilling_Refund_Approval_Link,name='IPBilling_Refund_Approval_Link'),
    path('IPBilling_Refund_Request_Link',IPBilling_Refund_Request_Link,name='IPBilling_Refund_Request_Link'),
    path('Get_Patient_Previous_Visited_Doctor', Get_Patient_Previous_Visited_Doctor, name='Get_Patient_Previous_Visited_Doctor'),

    path('userwise_OP_Patient_Report',userwise_OP_Patient_Report,name='userwise_OP_Patient_Report'),
    path('userwise_OP_Patient_Report_Overall',userwise_OP_Patient_Report_Overall,name='userwise_OP_Patient_Report_Overall'),
    path('Services_Wise_Report',Services_Wise_Report,name='Services_Wise_Report'),
    path('Employee_User_Get_Details',Employee_User_Get_Details,name='Employee_User_Get_Details'),
    path('Employee_Shift_Details',Employee_Shift_Details,name='Employee_Shift_Details'),
    path('DayClosing_Amount_Userwise',DayClosing_Amount_Userwise,name='DayClosing_Amount_Userwise'),
    path('DayClosing_Amount_Report',DayClosing_Amount_Report,name='DayClosing_Amount_Report'),
    
    
    
    path('Existing_Patient_Details_Get',Existing_Patient_Details_Get,name='Existing_Patient_Details_Get'),
 
    path('request_consent',request_consent,name='request_consent'),
    path('fetch_health_records',fetch_health_records,name='fetch_health_records'),

    path('get_OP_to_IP_pending_requests',get_OP_to_IP_pending_requests,name='get_OP_to_IP_pending_requests'),

    path('get_edited_OP_doc_details',get_edited_OP_doc_details,name='get_edited_OP_doc_details'),
    path('get_edited_OP_doc_details',get_edited_OP_doc_details,name='get_edited_OP_doc_details'),
    path('GeneralBilling_Refund_Link_For_ConsultationEdit',GeneralBilling_Refund_Link_For_ConsultationEdit,name='GeneralBilling_Refund_Link_For_ConsultationEdit'),
    path('upload_patient_csv',upload_patient_csv,name='upload_patient_csv'),
    path('GeneralBilling_Bill_Link_For_ConsultationEdit',GeneralBilling_Bill_Link_For_ConsultationEdit,name='GeneralBilling_Bill_Link_For_ConsultationEdit'),
    path('GeneralBilling_Paid_Bill_Link',GeneralBilling_Paid_Bill_Link,name='GeneralBilling_Paid_Bill_Link'),

    path('Existing_Patient_Details_Get_All',Existing_Patient_Details_Get_All,name='Existing_Patient_Details_Get_All'),
    path('item_name_walking_stock',item_name_walking_stock,name='item_name_walking_stock'),
    path('item_name_walking_stock_ip',item_name_walking_stock_ip,name='item_name_walking_stock_ip'),

    path('Consultation_Paid_userwiseReport',Consultation_Paid_userwiseReport,name='Consultation_Paid_userwiseReport'),

    path('waliking_bill_pay',waliking_bill_pay,name='waliking_bill_pay'),
    path('waliking_bill_pay_ip',waliking_bill_pay_ip,name='waliking_bill_pay_ip'),
    path('get_walkin_billing_list',get_walkin_billing_list,name='get_walkin_billing_list'),
    path('upload_revisit_patient_csv1',upload_revisit_patient_csv1,name='upload_revisit_patient_csv1'),

    path('Existing_Visit_Details',Existing_Visit_Details,name='Existing_Visit_Details'),
    path('Get_Lastvisitdate',Get_Lastvisitdate,name='Get_Lastvisitdate'),
    
    path('get_registered_patient_details_forQuickbilling',get_registered_patient_details_forQuickbilling,name='get_registered_patient_details_forQuickbilling'),
    path('Filter_Patient_by_Multiple_Criteria_for_Quickbilling',Filter_Patient_by_Multiple_Criteria_for_Quickbilling,name='Filter_Patient_by_Multiple_Criteria_for_Quickbilling'),

    path('Refund_userwiseReport',Refund_userwiseReport,name='Refund_userwiseReport'),
    path('Services_Paid_Wise_Report',Services_Paid_Wise_Report,name='Services_Paid_Wise_Report'),
    path('Refund_Report',Refund_Report,name='Refund_Report'),
    path('Discount_Report',Discount_Report,name='Discount_Report'),
    
    path('Patients_Management_Filter_OPVisitEntry',Patients_Management_Filter_OPVisitEntry,name='Patients_Management_Filter_OPVisitEntry'),
    
    path('Patients_Management_Filter_OPVisitEntry_Pharm',Patients_Management_Filter_OPVisitEntry_Pharm,name='Patients_Management_Filter_OPVisitEntry_Pharm'),
    path('Patient_SERVICES_Registration',Patient_SERVICES_Registration,name='Patient_SERVICES_Registration'),
    path('get_walkin_services_added_details',get_walkin_services_added_details,name='get_walkin_services_added_details'),
    path('update_employee',update_employee,name='update_employee'),

    path('get_walkin_MCH_added_details',get_walkin_MCH_added_details,name='get_walkin_MCH_added_details'),

    path('get_same_doctor_appointment_for_today',get_same_doctor_appointment_for_today,name='get_same_doctor_appointment_for_today'),
 
    path('IP_Test_Que_Cancel',IP_Test_Que_Cancel,name='IP_Test_Que_Cancel'),
    path('get_refunded_bill',get_refunded_bill,name='get_refunded_bill'),
    path('get_same_ip_appointment_for_patient',get_same_ip_appointment_for_patient,name='get_same_ip_appointment_for_patient'),
    path('IP_Advance_Refund_Request',IP_Advance_Refund_Request,name='IP_Advance_Refund_Request'),
    path('Advance_Details_For_Refund',Advance_Details_For_Refund,name='Advance_Details_For_Refund'),
    path('Advance_Refund_Billing',Advance_Refund_Billing,name='Advance_Refund_Billing'),

    path('Advance_Report',Advance_Report,name='Advance_Report'),
    path('Advance_Refund_Report',Advance_Refund_Report,name='Advance_Refund_Report'),
 
    path('IPServices_Paid_Wise_Report',IPServices_Paid_Wise_Report,name='IPServices_Paid_Wise_Report'),
    path('IPDiscount_Report',IPDiscount_Report,name='IPDiscount_Report'),
    path('IPFinalBill_Details_Link',IPFinalBill_Details_Link,name='IPFinalBill_Details_Link'),
    path('oppharmacybillview',oppharmacybillview,name='oppharmacybillview'),

    path('Combined_Report',Combined_Report,name='Combined_Report'),
    path('IPFinalBill_Details_Link_RefundCash',IPFinalBill_Details_Link_RefundCash,name='IPFinalBill_Details_Link_RefundCash'),


   path('get_registered_patient_details_forQuickbilling_forPharmacy',get_registered_patient_details_forQuickbilling_forPharmacy,name='get_registered_patient_details_forQuickbilling_forPharmacy'),
 
 path('IPBilling_Pharmacy_credit_get_details',IPBilling_Pharmacy_credit_get_details,name='IPBilling_Pharmacy_credit_get_details'),

 path('IPFinalBill_Details_Link_Credit',IPFinalBill_Details_Link_Credit,name='IPFinalBill_Details_Link_Credit'),
  path('IPBillingFinal_Reprint_Link',IPBillingFinal_Reprint_Link,name='IPBillingFinal_Reprint_Link'),
path('IPPharmacy_Paid_Wise_Report',IPPharmacy_Paid_Wise_Report,name='IPPharmacy_Paid_Wise_Report'),
  path('OPPharmacy_Paid_Wise_Report',OPPharmacy_Paid_Wise_Report,name='OPPharmacy_Paid_Wise_Report'),
  path('FreePharmacy_Paid_Wise_Report',FreePharmacy_Paid_Wise_Report,name='FreePharmacy_Paid_Wise_Report'),
 path('Pharmacy_Paid_Wise_Report',Pharmacy_Paid_Wise_Report,name='Pharmacy_Paid_Wise_Report'),
   path('IP_Billing_Service_List_after_estimated',IP_Billing_Service_List_after_estimated,name='IP_Billing_Service_List_after_estimated'),
 
 path('Pharmacy_Refund_Wise_Report',Pharmacy_Refund_Wise_Report,name='Pharmacy_Refund_Wise_Report'),
 path('Walk_in_Pharmacy_Paid_Wise_Report',Walk_in_Pharmacy_Paid_Wise_Report,name='Walk_in_Pharmacy_Paid_Wise_Report'),

  
  path('waliking_bill_pay_ip_refund',waliking_bill_pay_ip_refund,name='waliking_bill_pay_ip_refund'),
  path('WalkinPharmacy_Refund_Wise_Report',WalkinPharmacy_Refund_Wise_Report,name='WalkinPharmacy_Refund_Wise_Report'),
  path('WalkinPharmacy_Refund_Reprint_get',WalkinPharmacy_Refund_Reprint_get,name='WalkinPharmacy_Refund_Reprint_get'),


  path('Patients_Management_Filter_for_paidbillview',Patients_Management_Filter_for_paidbillview,name='Patients_Management_Filter_for_paidbillview'),
  path('Patient_Services_Paid_Wise_Report',Patient_Services_Paid_Wise_Report,name='Patient_Services_Paid_Wise_Report'),

  path('Patients_Management_Filter_for_paidbillview_for_ipNo',Patients_Management_Filter_for_paidbillview_for_ipNo,name='Patients_Management_Filter_for_paidbillview_for_ipNo'),

path('get_overall_patient_details_for_discharged',get_overall_patient_details_for_discharged,name='get_overall_patient_details_for_discharged'),

path('OP_Pharmacy_Paid_Wise_Report',OP_Pharmacy_Paid_Wise_Report,name='OP_Pharmacy_Paid_Wise_Report'),
path('OP_Pharmacy_Refund_Wise_Report',OP_Pharmacy_Refund_Wise_Report,name='OP_Pharmacy_Refund_Wise_Report'),

path('Pharmacy_Accept_Paid_Wise_Report',Pharmacy_Accept_Paid_Wise_Report,name='Pharmacy_Accept_Paid_Wise_Report'),
path('Pharmacy_Accept_Refund_Wise_Report',Pharmacy_Accept_Refund_Wise_Report,name='Pharmacy_Accept_Refund_Wise_Report'),

path('IPPharmacy_amount_collection',IPPharmacy_amount_collection,name='IPPharmacy_amount_collection'),
path('IPPharmacy_Refund_amount_collection',IPPharmacy_Refund_amount_collection,name='IPPharmacy_Refund_amount_collection'),

path('OPPharmacy_amount_collection',OPPharmacy_amount_collection,name='OPPharmacy_amount_collection'),
path('Optical_amount_collection',Optical_amount_collection,name='Optical_amount_collection'),
path('OPPharmacy_Refund_amount_collection',OPPharmacy_Refund_amount_collection,name='OPPharmacy_Refund_amount_collection'),


path('OPPharmacy_Accept_Paid_Wise_Report',OPPharmacy_Accept_Paid_Wise_Report,name='OPPharmacy_Accept_Paid_Wise_Report'),
path('OPPharmacy_Accept_Refund_Wise_Report',OPPharmacy_Accept_Refund_Wise_Report,name='OPPharmacy_Accept_Refund_Wise_Report'),
path('Verify_consultation_Services_Paid_Wise_Report',Verify_consultation_Services_Paid_Wise_Report,name='Verify_consultation_Services_Paid_Wise_Report'),
path('Outstanding_Credit_Details_Link',Outstanding_Credit_Details_Link,name='Outstanding_Credit_Details_Link'),
 
path('Outstanding_Credit_Details',Outstanding_Credit_Details,name='Outstanding_Credit_Details'),
path('IP_Outstanding_Billing_Service_List',IP_Outstanding_Billing_Service_List,name='IP_Outstanding_Billing_Service_List'),

path('IPFinalBill_Details_Link_Credit_for_Payment',IPFinalBill_Details_Link_Credit_for_Payment,name='IPFinalBill_Details_Link_Credit_for_Payment'),

path('Outstanding_Credit_Details_For_Reprint',Outstanding_Credit_Details_For_Reprint,name='Outstanding_Credit_Details_For_Reprint'),

 
path('OPPharmacy_amount_collection_Bill_Cancel',OPPharmacy_amount_collection_Bill_Cancel,name='OPPharmacy_amount_collection_Bill_Cancel'),
path('OPPharmacy_Refund_amount_collection_Bill_Cancel',OPPharmacy_Refund_amount_collection_Bill_Cancel,name='OPPharmacy_Refund_amount_collection_Bill_Cancel'),
path('IPPharmacy_amount_collection_Cancel',IPPharmacy_amount_collection_Cancel,name='IPPharmacy_amount_collection_Cancel'),
path('IPPharmacy_Refund_amount_collection_Cancel',IPPharmacy_Refund_amount_collection_Cancel,name='IPPharmacy_Refund_amount_collection_Cancel'),
     

path('IP_Discharged_Patient_For_Diagnosis',IP_Discharged_Patient_For_Diagnosis,name='IP_Discharged_Patient_For_Diagnosis'),
path('IP_Discharged_Patient_For_Diagnosis_Post',IP_Discharged_Patient_For_Diagnosis_Post,name='IP_Discharged_Patient_For_Diagnosis_Post'),
path('IP_Discharged_Patient_For_Diagnosis_Delete',IP_Discharged_Patient_For_Diagnosis_Delete,name='IP_Discharged_Patient_For_Diagnosis_Delete'),

path('Patient_Pharmacy_Paid_Wise_Report',Patient_Pharmacy_Paid_Wise_Report,name='Patient_Pharmacy_Paid_Wise_Report'),

    path('IPBillingEstimatedReportLinkView',IPBillingEstimatedReportLinkView.as_view(),name='IPBillingEstimatedReportLinkView'),
 
  path('CGHS_Link',CGHS_Link,name='CGHS_Link'),
     
     ]