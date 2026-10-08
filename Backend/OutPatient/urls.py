
from django.urls import path


from .Vitals import *
from .views import *
from .ReferDoctor import *
from .Request import *
from .RadiologyVitals import *
from .LabRequests import *
from .TherapyRequest import *

urlpatterns=[
   
    path('Vitals_Form_Details_Link',Vitals_Form_Details_Link,name='Vitals_Form_Details_Link'),
    path('get_workbenchquelist_doctor',get_workbenchquelist_doctor,name='get_workbenchquelist_doctor'),
    path('Get_Workbenchquelist_For_Doctor_Speciality',Get_Workbenchquelist_For_Doctor_Speciality,name='Get_Workbenchquelist_For_Doctor_Speciality'),
    path('ReferDoctor_Details_link',ReferDoctor_Details_link,name='ReferDoctor_Details_link'),
    path('Lab_Request_Detailslink',Lab_Request_Detailslink,name='Lab_Request_Detailslink'),
    path('Radiology_Request_Detailslink',Radiology_Request_Detailslink,name='Radiology_Request_Detailslink'),
    path('Lab_Queuelist_link',Lab_Queuelist_link,name='Lab_Queuelist_link'),
    path('Lab_Request_TestDetails',Lab_Request_TestDetails,name='Lab_Request_TestDetails'),
    path('Lab_SelectedTest_Detailslink',Lab_SelectedTest_Detailslink,name='Lab_SelectedTest_Detailslink'),
    path('Radiology_Queuelist_link',Radiology_Queuelist_link,name='Radiology_Queuelist_link'),
    path('Lab_ViewStatus_link',Lab_ViewStatus_link,name='Lab_ViewStatus_link'),
    
    # labcompleted
    path('Lab_completed_quelist',Lab_completed_quelist,name='Lab_completed_quelist'),
    path('Lab_Complete_TestDetails',Lab_Complete_TestDetails,name='Lab_Complete_TestDetails'),
    path('Lab_PaidDetails_link',Lab_PaidDetails_link,name='Lab_PaidDetails_link'),
    path('lab_report_details_view', lab_report_details_view, name='lab_report_details_view'),
        

    path('OtRequest_Details',OtRequest_Details,name='OtRequest_Details'),
    path('OtRequest_Names_link',OtRequest_Names_link,name='OtRequest_Names_link'),

     
    path('Radiology_Queuelist_link_for_All_doctor',Radiology_Queuelist_link_for_All_doctor,name='Radiology_Queuelist_link_for_All_doctor'),
    path('Radiology_Complete_Details_Link',Radiology_Complete_Details_Link,name='Radiology_Complete_Details_Link'),
        # bharathi
    path('RadiologyVitals_Form_Details_Link',RadiologyVitals_Form_Details_Link,name='RadiologyVitals_Form_Details_Link'),
    path('Radiology_Medical_History_Details',Radiology_Medical_History_Details,name='Radiology_Medical_History_Details'),
    path('Radiology_MedicalSection_Details_Link',Radiology_MedicalSection_Details_Link,name='Radiology_MedicalSection_Details_Link'),
    # path('get_lab_request_details/<str:Billing_Status1>/<str:queue_type1>/<str:Type>/', get_lab_request_details, name='get_lab_request_details'),
    
    path('get_lab_request_details',get_lab_request_details,name='get_lab_request_details'),
    path('get_lab_request_details_op',get_lab_request_details_op,name='get_lab_request_details_op'),
    path('get_rad_request_details_op',get_rad_request_details_op,name='get_rad_request_details_op'),

    # path('lab_rep_details_view',lab_rep_details_view,name='lab_rep_details_view')
    path('POST_Lab_Data',POST_Lab_Data,name='POST_Lab_Data'),
    # path('lab_rep_details_view',lab_rep_details_view,name='lab_rep_details_view')
    path('ReportData',ReportData,name='ReportData'),
     path('Radiology_Request_Detailslink_unpaid',Radiology_Request_Detailslink_unpaid,name='Radiology_Request_Detailslink_unpaid'),
      path('Radiology_Request_Detailslink_paid',Radiology_Request_Detailslink_paid,name='Radiology_Request_Detailslink_paid'),

    path('get_radiology_test_name_for_patient',get_radiology_test_name_for_patient,name='get_radiology_test_name_for_patient'),
    path('get_radiology_test_name_for_IPPatient',get_radiology_test_name_for_IPPatient,name='get_radiology_test_name_for_IPPatient'),
    path('Radiology_Queuelist_link_for_All',Radiology_Queuelist_link_for_All,name='Radiology_Queuelist_link_for_All'),

    # therapist


    path('create_therapy_request',create_therapy_request,name='create_therapy_request'),
    path('get_therapy_requests',get_therapy_requests,name='get_therapy_requests'),
    path('get_therapy_requests_IP',get_therapy_requests_IP,name='get_therapy_requests_IP'),
    path('get_therapy_requests_Oncology',get_therapy_requests_Oncology,name='get_therapy_requests_Oncology'),
    path('get_therapy_requests_Neurotherapy',get_therapy_requests_Neurotherapy,name='get_therapy_requests_Neurotherapy'),
    path('get_therapy_requests_Physiotherapy',get_therapy_requests_Physiotherapy,name='get_therapy_requests_Physiotherapy'),
    path('get_therapy_datas_for_therapist',get_therapy_datas_for_therapist,name='get_therapy_datas_for_therapist'),
    path('therapy_Updation_from_therapist',therapy_Updation_from_therapist,name='therapy_Updation_from_therapist'),
    
      path('get_Therapy_request_details_op', get_Therapy_request_details_op, name='get_Therapy_request_details_op'),
     path('get_therapy_details_for_crm', get_therapy_details_for_crm, name='get_therapy_details_for_crm'),
     path('reschedule_therapy', reschedule_therapy, name='reschedule_therapy'),
     path('Session_Tracking_get', Session_Tracking_get, name='Session_Tracking_get'),

      path('get_therapy_request_details_for_opBilling', get_therapy_request_details_for_opBilling, name='get_therapy_request_details_for_opBilling'),
    path('get_therapy_request_details_for_ipBilling', get_therapy_request_details_for_ipBilling, name='get_therapy_request_details_for_ipBilling'),
 

     path('VaccinationChart', VaccinationChart, name='VaccinationChart'),

    ]