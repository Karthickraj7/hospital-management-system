from django.urls import path
from .BillingView import *
from .labtechnician import *
from .usercontrol_role import *
from .phelobotomist import *
from .testmaster import *   
from .dispatch import *







urlpatterns = [
    path('get_patient_request_capture_data_for_dispatch', get_patient_request_capture_data_for_dispatch, name='get_patient_request_capture_data_for_dispatch'),
    path('get_patient_ammended_capture_data_for_dispatch', get_patient_ammended_capture_data_for_dispatch, name='get_patient_ammended_capture_data_for_dispatch'),
    path('getcapturelist',get_patient_request_capture_data,name='get_patient_request_capture_data'),
    path('dispatchsearch', dispatchsearch, name='dispatchsearch'),
    path('get_data_for_smart_report', get_data_for_smart_report, name='get_data_for_smart_report'),
    path('getanalysislist', get_patient_request_analys_data, name='get_patient_request_analys_data'),
    path('getverifyresult',get_patient_verify_analys_data,name='get_patient_verify_analys_data'),
    path('searchlabtechnician', searchlabtechnician, name='searchlabtechnician'),
    path('searchseniorrtech', searchseniorrtech, name='searchseniorrtech'),
    path('searchpathologist', searchpathologist, name='searchpathologist'),
    
    path('getforpathalogist', get_patient_request_approve_data, name='get_patient_request_approve_data'),
    
    path("getlocation_for_sampletransfer",getlocation_for_sampletransfer,name="getlocation_for_sampletransfer"),
    path('get_for_sample_test_data',get_for_sample_test_data,name='get_for_sample_test_data'),
    path('insersamplecapture',insert_into_sample_capture, name='insert_into_sample_capture'),
    path('gettrendsfortest', get_graph_trends, name='get_graph_trends'),
    # path('getgroupcost', get_group_cost_for_billing, name ="get_group_cost_for_billing"),
    path('getgroupcost',get_sample_completed_list, name='get_sample_completed_list'),
    path('updatereportsamplestatus', updatereportsamplestatus,name='updatereportsamplestatus'),
    path('getcompletedsample',get_for_sample_register_data, name='get_for_sample_register_data'),
    path('getmachineinterfaceresult', getmachineinterfaceresult, name='getmachineinterfaceresult'),
    path('get_for_pending_result_department', get_for_pending_result_department, name='get_for_pending_result_department'),
    path('getformula_calculated_value',getformula_calculated_value, name='getformula_calculated_value'),
    path('insert_analyse_investigation_result',insert_analyse_investigation_result,name='insert_analyse_investigation_result'),
    path("insert_Histo_Template", insert_Histo_Template, name="insert_Histo_Template"),
    path('insert_into_culture_report',insert_into_culture_report, name='insert_into_culture_report'),
    path('get_test_name_by_word', get_test_name_by_word, name='get_test_name_by_word'),

    path('get_word_data', get_word_data, name='get_word_data'),
    path("Get_Template", Get_Template, name="Get_Template"),
    # path('getClinic', clinic_get, name='clinic_get'),
    # path('getAccountsetting', get_account_setting, name='get_account_setting'),
    path('get_billing_patient_barcode', get_patient_barcode_billing, name='get_patient_barcode_billing'),
    path('get_record_from_lab_techy',get_record_from_lab_techy, name='get_record_from_lab_techy'),
    path('get_for_culture_report_completion', get_for_culture_report_completion, name='get_for_culture_report_completion'),
    path('get_for_preview_examinations', get_for_preview_examinations, name='get_for_preview_examinations'),
    path('insertseniorverifyreport', insert_or_update_approve_status, name='insert_or_update_approve_status'),
    path('seniorsampleaprove',update_report_sample_status_senior,name='update_report_sample_status_senior'),
    path('updateretestforsenior',update_if_retest_senior, name='update_if_retest_senior' ),
    path('getverifieddata', get_record_from_lab_seniortechy, name='get_record_from_lab_seniortechy'),
    path('gettrendsfortest', get_graph_trends, name='get_graph_trends'),
    path("culture_sencitivity_type_update", culture_sencitivity_type_update, name='culture_sencitivity_type_update'),
    path('getforallreflex',get_for_individual_reflex, name='get_for_individual_reflex'),
    # path("insert_Histo_Template", insert_Histo_Template, name="insert_Histo_Template"),
    path('get_for_preview_examinations_pathologist', get_for_preview_examinations_pathologist, name='get_for_preview_examinations_pathologist'),
    path('pathologistsampleaprove',update_report_sample_status_pathologist, name='update_report_sample_status_pathologist' ),
    path('updateretest', update_if_retest, name='update_if_retest'),
    path('insertpathologistcomplete', insert_or_update_path_approve_status, name='insert_or_update_path_approve_status'),
    path('reflextestinsert', insert_for_reflex, name='insert_for_reflex'),
    path('get_for_preview_examinations_dispatch', get_for_preview_examinations_dispatch, name='get_for_preview_examinations_dispatch'),
    path('getMicro_and_HistoNumber', getMicro_and_HistoNumber, name='getMicro_and_HistoNumber'),
    path('get_for_dispatch_report_status', get_for_dispatch_report_status, name='get_for_dispatch_report_status'),
    path('get_report', get_report, name='get_report'),
    path('get_qrcode_image', get_qrcode_image, name='get_qrcode_image'),
    path('getdataforreport', getdataforreport, name='getdataforreport'),
    path('update_microafter_flow_completed', update_microafter_flow_completed, name='update_microafter_flow_completed'),
    path('update_biochemistry', update_biochemistry, name='update_biochemistry'),
    
    
    
    # -----------------MAsTER-------------------
    path('get_offer_package_data',get_offer_package_data,name = "get_offer_package_data"),
    path('get_packagedata_forupdate', get_packagedata_forupdate, name='get_packagedata_forupdate'),
    path('update_packagestatus', update_packagestatus, name='update_packagestatus'),
    path('getgroupmastermasterlist',get_groupmaster_masterlist,name='get_groupmaster_masterlist'),
    path('test_and_group_forpackage', test_and_group_forpackage, name='test_and_group_forpackage'),
    path('update_offerpackage_data',update_offerpackage_data, name="update_offerpackage_data"),
    path('insert_offer_package',insert_offer_package,name = "insert_offer_package"),
    path('insert_offerpackage_testlist',insert_offerpackage_testlist,name = "insert_offerpackage_testlist"),
    path('get_package_code', get_package_code, name='get_package_code'),
    path("postratecrdcsvfile",postratecrdcsvfile,name="postratecrdcsvfile"),
    path("getratecardforallfranchise",getratecardforallfranchise,name="getratecardforallfranchise"),
    path('insert_csv_file_for_referencerange', insert_csv_file_for_referencerange, name='insert_csv_file_for_referencerange'),
    path('update_test_description_data', update_test_description_data, name='update_test_description_data'),
    path('getfor_barcode_details_print', getfor_barcode_details_print, name='getfor_barcode_details_print'),
    path('get_for_culture_report_dispatc', get_for_culture_report_dispatc, name='get_for_culture_report_dispatc'),
    path('delete_test_description_data', delete_test_description_data, name='delete_test_description_data'),
    path('get_doctor_forlab', get_doctor_forlab, name='get_doctor_forlab'),
    path('uploaddocumentlink', uploaddocumentlink, name='uploaddocumentlink'),
    path('getdocview', getdocview, name='getdocview'),
    path('Documents_Edit_link', Documents_Edit_link, name='Documents_Edit_link'),
    path('getbytestcodedoc', getbytestcodedoc, name='getbytestcodedoc'),


    path('Get_Test_Count_Data', Get_Test_Count_Data, name='Get_Test_Count_Data'),
    path('get_labtech_forlab', get_labtech_forlab, name='get_labtech_forlab'),
    path('update_senior_edit_content', update_senior_edit_content, name='update_senior_edit_content'),
    path('get_patientfor_provisionalreport', get_patientfor_provisionalreport, name='get_patientfor_provisionalreport'),
    path('getdataforprovisionalreport', getdataforprovisionalreport, name='getdataforprovisionalreport'),
    path('get_patienttestlist', get_patienttestlist, name='get_patienttestlist'),
    path('getfor_op_and_iplist', getfor_op_and_iplist, name='getfor_op_and_iplist'),
    path('getsearchdataforphelobotomist', getsearchdataforphelobotomist, name='getsearchdataforphelobotomist'),
    path('get_for_due_reports', get_for_due_reports, name='get_for_due_reports'),


    path('insertBulkSampleCapture', insert_bulk_sample_capture, name='insert_bulk_sample_capture'),
    path('insertBulkpathologist', post_bulk_pathologist_data, name='insertBulkpathologist'),
    path('getdataforreport1', getdataforreport1, name='getdataforreport1'),
    path('get_tat_report', get_tat_report, name='get_tat_report'),
    path('get_status_count', get_status_count, name='get_status_count'),
    path('repeat_the_same_test', repeat_the_same_test, name='repeat_the_same_test'),
   
    path('getdataformrdreport', getdataformrdreport, name='getdataformrdreport'),

]