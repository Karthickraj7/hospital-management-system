from django.urls import path

# from .views import *
from .DrugAdministration import *
from Frontoffice.GeneralBilling import get_prescription
from .PharmacyReports import *

urlpatterns = [
    # path('insert_Drug_Administration_datas', insert_Drug_Administration_datas, name='insert_Drug_Administration_datas'),
    # path('getgenericname', getgenericname, name='getgenericname'),
    # path('getitemname_bygenericname', getitemname_bygenericname, name='getitemname_bygenericname'),
    # path('getDose_By_Itemname', getDose_By_Itemname, name='getDose_By_Itemname'),
    # path('get_prescription_master_code',get_prescription_master_code,name='get_prescription_master_code'),
    # path('get_for_doc_drugs_nurse_request', get_for_doc_drugs_nurse_request, name='get_for_doc_drugs_nurse_request'),
    # path('insert_nurse_request_drugs', insert_nurse_request_drugs, name='insert_nurse_request_drugs'),
    # path('get_completed_prescribed_medicine', get_completed_prescribed_medicine, name='get_completed_prescribed_medicine'),
    # path('inhouse_pharmacy_queue_list_prescrib', inhouse_pharmacy_queue_list_prescrib, name='inhouse_pharmacy_queue_list_prescrib'),
    # path('get_completed_prescribed_medicine', get_completed_prescribed_medicine, name='get_completed_prescribed_medicine'),
    # path('insert_nurse_received_drugs', insert_nurse_received_drugs, name='insert_nurse_received_drugs'),
    # path('get_Drug_Administration_datas', get_Drug_Administration_datas, name='get_Drug_Administration_datas'),
    # path('insert_Drug_Administration_nurse_frequencywise_datas', insert_Drug_Administration_nurse_frequencywise_datas, name='insert_Drug_Administration_nurse_frequencywise_datas'),
    
    
    
    
    path('cancel_drug_administration', cancel_drug_administration, name='cancel_drug_administration'),
    path('doctor_drug_prescription_link', doctor_drug_prescription_link, name='doctor_drug_prescription_link'),
    path('Nurse_drug_prescription_link', Nurse_drug_prescription_link, name='Nurse_drug_prescription_link'),
    path('Nurse_drug_prescription_Add_link', Nurse_drug_prescription_Add_link, name='Nurse_drug_prescription_Add_link'),
    path('Nurse_drug_prescription_update_link', Nurse_drug_prescription_update_link, name='Nurse_drug_prescription_update_link'),
    path('Pharmacy_drug_quelist_link', Pharmacy_drug_quelist_link, name='Pharmacy_drug_quelist_link'),
    path('get_for_ip_durgs_doctor_show', get_for_ip_durgs_doctor_show, name='get_for_ip_durgs_doctor_show'),
    path('inhouse_pharmacy_queue_list_prescrib', inhouse_pharmacy_queue_list_prescrib, name='inhouse_pharmacy_queue_list_prescrib'),
    path('get_prescription_forIP', get_prescription_forIP, name='get_prescription_forIP'),
    path('get_last_prescription_forIP', get_last_prescription_forIP, name='get_last_prescription_forIP'),
    path('IP_Pharmacy_Billing_link', IP_Pharmacy_Billing_link, name='IP_Pharmacy_Billing_link'),
    path('OP_Pharmacy_Billing_link', OP_Pharmacy_Billing_link, name='OP_Pharmacy_Billing_link'),
    path('IP_Pharmacy_Refund_Billing_link', IP_Pharmacy_Refund_Billing_link, name='IP_Pharmacy_Refund_Billing_link'),
    path('FOC_Pharmacy_Refund_Billing_link', FOC_Pharmacy_Refund_Billing_link, name='FOC_Pharmacy_Refund_Billing_link'),
    path('OP_Pharmacy_Walkin_Billing_link', OP_Pharmacy_Walkin_Billing_link, name='OP_Pharmacy_Walkin_Billing_link'),
    path('get_OP_Pharmacy_Billing_datas', get_OP_Pharmacy_Billing_datas, name='get_OP_Pharmacy_Billing_datas'),
    path('Nurse_drug_prescription_Completed', Nurse_drug_prescription_Completed, name='Nurse_drug_prescription_Completed'),
    path('Nurse_drug_prescription_Recieved', Nurse_drug_prescription_Recieved, name='Nurse_drug_prescription_Recieved'),
    path('get_Drug_Administration_datas', get_Drug_Administration_datas, name='get_Drug_Administration_datas'),
    path('insert_Drug_Administration_nurse_frequencywise_datas', insert_Drug_Administration_nurse_frequencywise_datas, name='insert_Drug_Administration_nurse_frequencywise_datas'),
    path('get_for_ip_drugs_doctor_show', get_for_ip_drugs_doctor_show, name='get_for_ip_drugs_doctor_show'),
        
    
    path('get_prescription', get_prescription, name='get_prescription'),
    path('get_billing_details_due_patient',get_billing_details_due_patient,name='get_billing_details_due_patient'),    
    path('OP_Pharmacy_Due_Billing_link',OP_Pharmacy_Due_Billing_link,name='OP_Pharmacy_Due_Billing_link'),    
    path('Optical_Pharmacy_Due_Billing_link',Optical_Pharmacy_Due_Billing_link,name='Optical_Pharmacy_Due_Billing_link'),    
    path('OP_Pharmacy_Refund_Billing_link',OP_Pharmacy_Refund_Billing_link,name='OP_Pharmacy_Refund_Billing_link'),    
    path('Patient_Previous_Items_OPPharmacy',Patient_Previous_Items_OPPharmacy,name='Patient_Previous_Items_OPPharmacy'),    
    path('pharmacy_sales_report',pharmacy_sales_report,name='pharmacy_sales_report'),    
    path('user_wise_pharmacy_bill_report',user_wise_pharmacy_bill_report,name='user_wise_pharmacy_bill_report'),    
    path('op_pharmacy_queue_list_paid_new',fetch_pharmacy_billing,name='op_pharmacy_queue_list_paid_new'),    
    path('fetch_pharmacy_billing_optical',fetch_pharmacy_billing_optical,name='fetch_pharmacy_billing_optical'),    
    path('shift_closing_report',shift_closing_report,name='shift_closing_report'),    
    path('fetch_ip_pharmacy_billing',fetch_ip_pharmacy_billing,name='fetch_ip_pharmacy_billing'),
    path('OP_Pharmacy_Refund_List_link',OP_Pharmacy_Refund_List_link,name='OP_Pharmacy_Refund_List_link'),      
    path('fetch_ip_pharmacy_refund_billing',fetch_ip_pharmacy_refund_billing,name='fetch_ip_pharmacy_refund_billing'),      
    path('IP_Pharmacy_Due_Billing_link',IP_Pharmacy_Due_Billing_link,name='IP_Pharmacy_Due_Billing_link'),      
    path('get_refunded_pharmacy_bills',get_refunded_pharmacy_bills,name='get_refunded_pharmacy_bills'),      
    path('fetch_due_ip_pharmacy_billing',fetch_due_ip_pharmacy_billing,name='fetch_due_ip_pharmacy_billing'),      


    path('fetch_due_ip_pharmacy_billing_for_FOC',fetch_due_ip_pharmacy_billing_for_FOC,name='fetch_due_ip_pharmacy_billing_for_FOC'),  
 
    path('Walkin_Pharmacy_Refund_Billing_link',Walkin_Pharmacy_Refund_Billing_link,name='Walkin_Pharmacy_Refund_Billing_link'),
    path('fetch_foc_pharmacy_refund_billing',fetch_foc_pharmacy_refund_billing,name='fetch_foc_pharmacy_refund_billing'),

    path('New_IP_Pharmacy_Billing_link',New_IP_Pharmacy_Billing_link,name='New_IP_Pharmacy_Billing_link'),
    path('New_IP_Walkin_Billing_link',New_IP_Walkin_Billing_link,name='New_IP_Walkin_Billing_link'),
    path('WalkIn_IP_Pharmacy_Refund_Billing_link',WalkIn_IP_Pharmacy_Refund_Billing_link,name='WalkIn_IP_Pharmacy_Refund_Billing_link'),

    path('Walkin_OP_Pharmacy_Billing_link',Walkin_OP_Pharmacy_Billing_link,name='Walkin_OP_Pharmacy_Billing_link'),

    path('New_OP_Pharmacy_Billing_link',New_OP_Pharmacy_Billing_link,name='New_OP_Pharmacy_Billing_link'),
    path('New_OP_Pharmacy_Billing_link_optical',New_OP_Pharmacy_Billing_link_optical,name='New_OP_Pharmacy_Billing_link_optical'),
    path('fetch_ip_pharmacy_billing_for_Acceptance',fetch_ip_pharmacy_billing_for_Acceptance,name='fetch_ip_pharmacy_billing_for_Acceptance'),
    path('fetch_ip_pharmacy_refund_billing_for_Acceptance',fetch_ip_pharmacy_refund_billing_for_Acceptance,name='fetch_ip_pharmacy_refund_billing_for_Acceptance'),
    path('get_booking_administrations',get_booking_administrations,name='get_booking_administrations'),

    path('fetch_op_pharmacy_billing_for_Acceptance',fetch_op_pharmacy_billing_for_Acceptance,name='fetch_op_pharmacy_billing_for_Acceptance'),
    path('fetch_optical_pharmacy_billing_for_Acceptance',fetch_optical_pharmacy_billing_for_Acceptance,name='fetch_optical_pharmacy_billing_for_Acceptance'),
    path('fetch_op_pharmacy_refund_billing_for_Acceptance',fetch_op_pharmacy_refund_billing_for_Acceptance,name='fetch_op_pharmacy_refund_billing_for_Acceptance'),

    path('Get_Print_Jobs/<str:system_name>',Get_Print_Jobs,name='Get_Print_Jobs'),
    path('WalkinOP_Pharmacy_Refund_Billing_link',WalkinOP_Pharmacy_Refund_Billing_link,name='WalkinOP_Pharmacy_Refund_Billing_link'),
    path('Post_Print_Jobs',Post_Print_Jobs,name='Post_Print_Jobs'),
    path('create_advance_optical',create_advance_optical,name='create_advance_optical'),
    path('get_advance_optical',get_advance_optical,name='get_advance_optical'),

      path("advance-optical/create/", create_advance_optical),
    path("advance-optical/", get_advance_optical),
    path("advance-optical/<str:advance_id>/", get_single_advance_optical),
    path("advance-optical/update/<str:advance_id>/", update_advance_optical),
path("search_patient/", search_patient, name="search_patient"),

 

path('fetch_op_pharmacy_refund_billing_for_after_Acceptance',fetch_op_pharmacy_refund_billing_for_after_Acceptance,name='fetch_op_pharmacy_refund_billing_for_after_Acceptance'),
path('fetch_op_pharmacy_billing_for_after_Acceptance',fetch_op_pharmacy_billing_for_after_Acceptance,name='fetch_op_pharmacy_billing_for_after_Acceptance'),
path('Walkin_OP_Pharmacy_Billing_link_optical',Walkin_OP_Pharmacy_Billing_link_optical,name='Walkin_OP_Pharmacy_Billing_link_optical'),
]

