



from django.urls import path
from .MCIPatient import *
from .TestRegistration import *
from .MCIPatientReports import *
from .OriginalPatientsReport import *
from .FakePatientReports import *
from .MCIRoomMasters import *
from .RadiologyReportsAPI import *



urlpatterns=[

            path('Total_OP_patients_List',Total_OP_patients_List, name='Total_OP_patients_List'),
            path('get_lab_patient_appointment_details',get_lab_patient_appointment_details, name='get_lab_patient_appointment_details'),
            path('get_diagnosis_patient_appointment_details',get_diagnosis_patient_appointment_details, name='get_diagnosis_patient_appointment_details'),
            path('Overall_OP_patients_List',Overall_OP_patients_List, name='Overall_OP_patients_List'),
            path('Total_IP_Patients_List',Total_IP_Patients_List, name='Total_IP_Patients_List'),
            path('Mci_Patient_Reports_OP',Mci_Patient_Reports_OP,name='Mci_Patient_Reports_OP'),

            path('MCI_Patient_RADIOLOGY_Registration',MCI_Patient_RADIOLOGY_Registration,name='MCI_Patient_RADIOLOGY_Registration'),
            path('MCI_Patient_LAB_Registration',MCI_Patient_LAB_Registration,name='MCI_Patient_LAB_Registration'),

            path('Mci_New_Patient_Reports_OP',Mci_New_Patient_Reports_OP,name='Mci_New_Patient_Reports_OP'),
            path('Mci_Revisit_Patient_Reports_OP',Mci_Revisit_Patient_Reports_OP,name='Mci_Revisit_Patient_Reports_OP'),

            path('Mci_Patient_Fake_Reports_OP',Mci_Patient_Fake_Reports_OP,name='Mci_Patient_Fake_Reports_OP'),
            path('Mci_New_Patient_Fake_Reports_OP',Mci_New_Patient_Fake_Reports_OP,name='Mci_New_Patient_Fake_Reports_OP'),
            path('Mci_Revisit_Patient_Fake_Reports_OP',Mci_Revisit_Patient_Fake_Reports_OP,name='Mci_Revisit_Patient_Fake_Reports_OP'),

            path('Mci_Patient_Original_Reports_OP',Mci_Patient_Original_Reports_OP,name='Mci_Patient_Original_Reports_OP'),
            path('Mci_New_Patient_Original_Reports_OP',Mci_New_Patient_Original_Reports_OP,name='Mci_New_Patient_Original_Reports_OP'),
            path('Mci_Revisit_Patient_Original_Reports_OP',Mci_Revisit_Patient_Original_Reports_OP,name='Mci_Revisit_Patient_Original_Reports_OP'),

            path('Fake_IPPatient_Discharge',Fake_IPPatient_Discharge,name='Fake_IPPatient_Discharge'),

            path('MCI_New_Patient_List',MCI_New_Patient_List,name='MCI_New_Patient_List'),
            path('MCI_New_Patient_List1',MCI_New_Patient_List1,name='MCI_New_Patient_List1'),
            path('MCI_Revisit_Patient_List',MCI_Revisit_Patient_List,name='MCI_Revisit_Patient_List'),
            path('MCI_Overall_Patient_List',MCI_Overall_Patient_List,name='MCI_Overall_Patient_List'),
            path('MCI_InPatient_List',MCI_InPatient_List,name='MCI_InPatient_List'),
            path('MCI_Discharge_Patient_List',MCI_Discharge_Patient_List,name='MCI_Discharge_Patient_List'),
            path('MCI_Patient_IPAdmission_List',MCI_Patient_IPAdmission_List,name='MCI_Patient_IPAdmission_List'),


            path('Original_New_Patient_List',Original_New_Patient_List,name='Original_New_Patient_List'),
            path('Original_Revisit_Patient_List',Original_Revisit_Patient_List,name='Original_Revisit_Patient_List'),
            path('Original_Overall_Patient_List',Original_Overall_Patient_List,name='Original_Overall_Patient_List'),
            path('Original_InPatient_List',Original_InPatient_List,name='Original_InPatient_List'),
            path('Original_Discharge_Patient_List',Original_Discharge_Patient_List,name='Original_Discharge_Patient_List'),
            path('Original_Patient_IPAdmission_List',Original_Patient_IPAdmission_List,name='Original_Patient_IPAdmission_List'),
            path('Original_OP_Registration_Fee',Original_OP_Registration_Fee,name='Original_OP_Registration_Fee'),


            path('Fake_Radiology_Complete_Details_Link',Fake_Radiology_Complete_Details_Link,name='Fake_Radiology_Complete_Details_Link'),

            path('Radiology_filterwise_count_original',Radiology_filterwise_count_original,name='Radiology_filterwise_count_original'),
            path('Radiology_filterwise_count_original_Deptwise',Radiology_filterwise_count_original_Deptwise,name='Radiology_filterwise_count_original_Deptwise'),

            path('Radiology_reports_for_original',Radiology_reports_for_original,name='Radiology_reports_for_original'),
            path('Radiology_reports_for_Combined',Radiology_reports_for_Combined,name='Radiology_reports_for_Combined'),
            path('Radiology_reports_for_Fake',Radiology_reports_for_Fake,name='Radiology_reports_for_Fake'),

            path('Get_Data_For_Dispatch_Fake_Report',Get_Data_For_Dispatch_Fake_Report,name='Get_Data_For_Dispatch_Fake_Report'),
            path('Radiology_testwise_counts',Radiology_testwise_counts,name='Radiology_testwise_counts'),

            path('get_radiology_reports',get_radiology_reports,name='get_radiology_reports'),   
            path('MCI_Theatre_booking_request_details_Link',MCI_Theatre_booking_request_details_Link,name='MCI_Theatre_booking_request_details_Link'),


            path('IP_DoctorWise_report',IP_DoctorWise_report,name='IP_DoctorWise_report'),
            path('MCI_Patients_Management_Filter_org_OT_Entry',MCI_Patients_Management_Filter_org_OT_Entry,name='MCI_Patients_Management_Filter_org_OT_Entry'),

            path('get_Mci_Room_Master_Data_for_registration',get_Mci_Room_Master_Data_for_registration,name='get_Mci_Room_Master_Data_for_registration'),
            path('MCI_Patients_Management_Filter_OPVisitEntry',MCI_Patients_Management_Filter_OPVisitEntry,name='MCI_Patients_Management_Filter_OPVisitEntry'),
            path('get_MCI_Patient_Details_by_patientId',get_MCI_Patient_Details_by_patientId,name='get_MCI_Patient_Details_by_patientId'),
            path('Fake_IP_Patient_Registration_Details_Link',Fake_IP_Patient_Registration_Details_Link,name='Fake_IP_Patient_Registration_Details_Link'),
 
            path('Filter_FakeIPPatient_by_Multiple_Criteria',Filter_FakeIPPatient_by_Multiple_Criteria,name='Filter_FakeIPPatient_by_Multiple_Criteria'),

             path(
                "get_radiology_patient_list",
                get_radiology_patient_list,
                name="get_radiology_patient_list",
            ),
            path(
                "get_radiology_doctor_wise_reports",
                get_radiology_doctor_wise_reports,
                name="get_radiology_doctor_wise_reports",
            ),
            path(
                "get_radiology_department_summary",
                get_radiology_department_summary,
                name="get_radiology_department_summary",
            ),
            path(
                "get_radiology_departments",
                get_radiology_departments,
                name="get_radiology_departments",
            ),
            path(
                "get_radiology_doctors",
                get_radiology_doctors,
                name="get_radiology_doctors",
            ),
        
            path(
                "specialization_department_get",
                specialization_department_get,
                name="specialization_department_get",
            ),


            path('Speciality_Count_Link',Speciality_Count_Link,name='Speciality_Count_Link'),

            path('MCI_New_Fake_Patient_List',MCI_New_Fake_Patient_List,name='MCI_New_Fake_Patient_List'),
            path('MCI_Revisit_Fake_Patient_List',MCI_Revisit_Fake_Patient_List,name='MCI_Revisit_Fake_Patient_List'),
            path('MCI_Overall_Fake_Patient_List',MCI_Overall_Fake_Patient_List,name='MCI_Overall_Fake_Patient_List'),
            path('MCI_InPatient_Fake_List',MCI_InPatient_Fake_List,name='MCI_InPatient_Fake_List'),
            path('MCI_Fake_Patient_IPAdmission_List',MCI_Fake_Patient_IPAdmission_List,name='MCI_Fake_Patient_IPAdmission_List'),
            path('Mci_Fake_Patient_Original_Reports_OP',Mci_Fake_Patient_Original_Reports_OP,name='Mci_Fake_Patient_Original_Reports_OP'),
 
 
            path('IP_Speciality_Admission_Count_Link',IP_Speciality_Admission_Count_Link,name='IP_Speciality_Admission_Count_Link'),
            path('Casuality_Speciality_Admission_Count_Link',Casuality_Speciality_Admission_Count_Link,name='Casuality_Speciality_Admission_Count_Link'),


            path('MCI_Patient_Registration',MCI_Patient_Registration,name='MCI_Patient_Registration'),
            path('MCI_Register_Patients_Details',MCI_Register_Patients_Details,name='MCI_Register_Patients_Details'),
            path('MCI_Fetch_Register_Patients_Details',MCI_Fetch_Register_Patients_Details,name='MCI_Fetch_Register_Patients_Details'),
            path('MRD_Patient_OP_Registration',MRD_Patient_OP_Registration,name='MRD_Patient_OP_Registration'),
            path('Fake_Patients_Management_Filter_OPVisitEntry',Fake_Patients_Management_Filter_OPVisitEntry,name='Fake_Patients_Management_Filter_OPVisitEntry'),
 
           
            path('MCI_Total_Patients_Count',MCI_Total_Patients_Count,name='MCI_Total_Patients_Count'),
            path('MCI_Patients_Counts',MCI_Patients_Counts,name='MCI_Patients_Counts'),

            path('MCI_Patient_Master_List',MCI_Patient_Master_List,name='MCI_Patient_Master_List'),
            path('MCI_Patient_BasicDetails_Update',MCI_Patient_BasicDetails_Update,name='MCI_Patient_BasicDetails_Update'),

            path('MRD_Room_Master_Detials_link',MRD_Room_Master_Detials_link,name='MRD_Room_Master_Detials_link'),
            path('MRD_Room_Master_Master_Detials_link',MRD_Room_Master_Master_Detials_link,name='MRD_Room_Master_Master_Detials_link'),

            path('Total_IP_Patients_count',Total_IP_Patients_count,name='Total_IP_Patients_count'),
               path('IP_Census_Patient_Combined_Reports',IP_Census_Patient_Combined_Reports,name='IP_Census_Patient_Combined_Reports'),
            path('IP_CENSUS_Discharge_Count_Reports',IP_CENSUS_Discharge_Count_Reports,name='IP_CENSUS_Discharge_Count_Reports'),
 
             path('MCI_IP_Census_Patient_Combined_Reports',MCI_IP_Census_Patient_Combined_Reports,name='MCI_IP_Census_Patient_Combined_Reports'),
        # path('MCI_IP_CENSUS_Discharge_Count_Reports',MCI_IP_CENSUS_Discharge_Count_Reports,name='MCI_IP_CENSUS_Discharge_Count_Reports'),
        path('get_sample',get_sample,name='get_sample'),

        path('MRD_IP_Discharged_Patient_For_Diagnosis',MRD_IP_Discharged_Patient_For_Diagnosis,name='MRD_IP_Discharged_Patient_For_Diagnosis'),
            path('MRD_IP_Discharged_Patient_For_Diagnosis_Delete',MRD_IP_Discharged_Patient_For_Diagnosis_Delete,name='MRD_IP_Discharged_Patient_For_Diagnosis_Delete'),
            path('MRD_IP_Discharged_Patient_For_Diagnosis_Post',MRD_IP_Discharged_Patient_For_Diagnosis_Post,name='MRD_IP_Discharged_Patient_For_Diagnosis_Post'),
 
           
 
             path('MCI_IP_DoctorWise_report',MCI_IP_DoctorWise_report,name='MCI_IP_DoctorWise_report'),
             path('get_MCI_IP_Registration_edit_details',get_MCI_IP_Registration_edit_details,name='get_MCI_IP_Registration_edit_details'),
        path('get_MCI_OP_patient_details',get_MCI_OP_patient_details,name = 'get_MCI_OP_patient_details'),
 

 path('Speciality_Internal_Swap_Link',Speciality_Internal_Swap_Link,name='Speciality_Internal_Swap_Link'),
             path('Speciality_External_Swap_Link',Speciality_External_Swap_Link,name='Speciality_External_Swap_Link'),
             path('Speciality_Decrease_Link',Speciality_Decrease_Link,name='Speciality_Decrease_Link'),
 
              path('IP_Census_INPatient_Count_Reports',IP_Census_INPatient_Count_Reports,name='IP_Census_INPatient_Count_Reports'),

              path('MCI_IP_CENSUS_Discharge_Count_Reports',MCI_IP_CENSUS_Discharge_Count_Reports,name='MCI_IP_CENSUS_Discharge_Count_Reports'),
             path('MCI_IP_Census_INPatient_Count_Reports',MCI_IP_Census_INPatient_Count_Reports,name='MCI_IP_Census_INPatient_Count_Reports'),
             path('MCI_IP_Census_Prev_INPatient_Count_Reports',MCI_IP_Census_Prev_INPatient_Count_Reports,name='MCI_IP_Census_Prev_INPatient_Count_Reports'),
 
 path('get_ip_registered_Patient_basic_details',get_ip_registered_Patient_basic_details,name='get_ip_registered_Patient_basic_details'),
 
  path('IP_Census_Prev_IN_Patient_Count_Reports',IP_Census_Prev_IN_Patient_Count_Reports,name='IP_Census_Prev_IN_Patient_Count_Reports'),
 
 
 path('MCI_IP_Census_Only_Fake_Patient_Combined_Reports',MCI_IP_Census_Only_Fake_Patient_Combined_Reports,name='MCI_IP_Census_Only_Fake_Patient_Combined_Reports'),
 path('MCI_IP_CENSUS_Only_Fake_Discharge_Count_Reports',MCI_IP_CENSUS_Only_Fake_Discharge_Count_Reports,name='MCI_IP_CENSUS_Only_Fake_Discharge_Count_Reports'),
 path('MCI_IP_Census_Only_Fake_INPatient_Count_Reports',MCI_IP_Census_Only_Fake_INPatient_Count_Reports,name='MCI_IP_Census_Only_Fake_INPatient_Count_Reports'),
 path('MCI_IP_Census_Only_Fake_Prev_INPatient_Count_Reports',MCI_IP_Census_Only_Fake_Prev_INPatient_Count_Reports,name='MCI_IP_Census_Only_Fake_Prev_INPatient_Count_Reports'),
 path('MCI_Discharge_Only_Fake_Patient_List',MCI_Discharge_Only_Fake_Patient_List,name='MCI_Discharge_Only_Fake_Patient_List'),
 
     
 path('Original_patient_Wise_Diagnosis_Link',Original_patient_Wise_Diagnosis_Link,name='Original_patient_Wise_Diagnosis_Link'),
 path('Original_Code_Wise_Diagnosis_Link',Original_Code_Wise_Diagnosis_Link,name='Original_Code_Wise_Diagnosis_Link'),
 path('Original_Diagnosis_Wise_Diagnosis_Link',Original_Diagnosis_Wise_Diagnosis_Link,name='Original_Diagnosis_Wise_Diagnosis_Link'),
 
     
    
 path('MRD_patient_Wise_Diagnosis_Link',MRD_patient_Wise_Diagnosis_Link,name='MRD_patient_Wise_Diagnosis_Link'),
 path('MRD_Code_Wise_Diagnosis_Link',MRD_Code_Wise_Diagnosis_Link,name='MRD_Code_Wise_Diagnosis_Link'),
 path('MRD_Diagnosis_Wise_Diagnosis_Link',MRD_Diagnosis_Wise_Diagnosis_Link,name='MRD_Diagnosis_Wise_Diagnosis_Link'),
 
 
 path('CT_Original_Reports',CT_Original_Reports,name='CT_Original_Reports'),
 path('CT_Dummy_Reports',CT_Dummy_Reports,name='CT_Dummy_Reports'),
 
 path('MRI_Original_Reports',MRI_Original_Reports,name='MRI_Original_Reports'),
 path('MRI_Dummy_Reports',MRI_Dummy_Reports,name='MRI_Dummy_Reports'),
 
 path('XRAY_Original_Reports',XRAY_Original_Reports,name='XRAY_Original_Reports'),
 path('XRAY_Dummy_Reports',XRAY_Dummy_Reports,name='XRAY_Dummy_Reports'),
 
 path('USG_Original_Reports',USG_Original_Reports,name='USG_Original_Reports'),
 path('USG_Dummy_Reports',USG_Dummy_Reports,name='USG_Dummy_Reports'),
 
 path('MAMMOGRAM_Original_Reports',MAMMOGRAM_Original_Reports,name='MAMMOGRAM_Original_Reports'),
 path('MAMMOGRAM_Dummy_Reports',MAMMOGRAM_Dummy_Reports,name='MAMMOGRAM_Dummy_Reports'),
 
  path('Dummy_OP_Wise_Radiology_Test',Dummy_OP_Wise_Radiology_Test,name='Dummy_OP_Wise_Radiology_Test'),
 path('Original_OP_Wise_Radiology_Test',Original_OP_Wise_Radiology_Test,name='Original_OP_Wise_Radiology_Test'),
 path('Dummy_IP_Wise_Radiology_Test',Dummy_IP_Wise_Radiology_Test,name='Dummy_IP_Wise_Radiology_Test'),
 path('Original_IP_Wise_Radiology_Test',Original_IP_Wise_Radiology_Test,name='Original_IP_Wise_Radiology_Test'),
 
 path('get_MCI_Patient_Details_by_patientId',get_MCI_Patient_Details_by_patientId,name='get_MCI_Patient_Details_by_patientId'),

 
             path('MCI_Theatre_booking_request_details_Link_for_Org_OT',MCI_Theatre_booking_request_details_Link_for_Org_OT,name='MCI_Theatre_booking_request_details_Link_for_Org_OT'),
            path('Filter_FakeIPPatient_by_Multiple_Criteria_for_org_OT',Filter_FakeIPPatient_by_Multiple_Criteria_for_org_OT,name='Filter_FakeIPPatient_by_Multiple_Criteria_for_org_OT'),
 path('get_MCI_Patient_Details_by_patientId_for_OT',get_MCI_Patient_Details_by_patientId_for_OT,name='get_MCI_Patient_Details_by_patientId_for_OT'),
 
  path('Generate_Radiology_Requests_Manual_Link',Generate_Radiology_Requests_Manual_Link,name='Generate_Radiology_Requests_Manual_Link'),
 path('Generate_IP_Radiology_Requests_Manual_Link',Generate_IP_Radiology_Requests_Manual_Link,name='Generate_IP_Radiology_Requests_Manual_Link'),
 path('Generate_Specialty_Radiology_Requests_Link',Generate_Specialty_Radiology_Requests_Link,name='Generate_Specialty_Radiology_Requests_Link'),
 path('Decrease_Specialty_Radiology_Requests_Link',Decrease_Specialty_Radiology_Requests_Link,name='Decrease_Specialty_Radiology_Requests_Link'),
       
 path('MCI_Theatre_booking_request_details_Link_for_Dummy_OP_OT',MCI_Theatre_booking_request_details_Link_for_Dummy_OP_OT,name='MCI_Theatre_booking_request_details_Link_for_Dummy_OP_OT'),
 path('MCI_Theatre_booking_request_details_Link_for_Org_OP_OT',MCI_Theatre_booking_request_details_Link_for_Org_OP_OT,name='MCI_Theatre_booking_request_details_Link_for_Org_OP_OT'),       
 path('Critical_Original_OP_Wise_Radiology_Test',Critical_Original_OP_Wise_Radiology_Test,name='Critical_Original_OP_Wise_Radiology_Test'),
 path('Critical_Original_IP_Wise_Radiology_Test',Critical_Original_IP_Wise_Radiology_Test,name='Critical_Original_IP_Wise_Radiology_Test'),

             path('MCI_prevInPatient_List',MCI_prevInPatient_List,name='MCI_prevInPatient_List'),
  path('MCI_IP_Census_Patient_Combined_Reports_Completed',MCI_IP_Census_Patient_Combined_Reports_Completed,name='MCI_IP_Census_Patient_Combined_Reports_Completed'),
 path('MCI_IP_Census_INPatient_Count_Reports_Completed',MCI_IP_Census_INPatient_Count_Reports_Completed,name='MCI_IP_Census_INPatient_Count_Reports_Completed'),    
 path('MCI_IP_Census_Prev_INPatient_Count_Reports_Completed',MCI_IP_Census_Prev_INPatient_Count_Reports_Completed,name='MCI_IP_Census_Prev_INPatient_Count_Reports_Completed'),
 
 path('MCI_Create_Test_Requests_By_Count',MCI_Create_Test_Requests_By_Count,name='MCI_Create_Test_Requests_By_Count'),
 path('MCI_Decrease_Test_Requests',MCI_Decrease_Test_Requests,name='MCI_Decrease_Test_Requests'),
 
 

]