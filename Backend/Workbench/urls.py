from django.urls import path
from .Gynecology import *
from .Neurology import *
from .IFCard import *
from .OP_Sheet import *
from .ANC_Card import *
from .Opthalmology import *
from .PastHistory import *
from .GeneralEvaluation import *
from .FollowUp import *
from .OtRequest import *
from .OP_To_IP import *
from .Allergy import *
from .Prescription import *
from .FollowUp import *
from .OtRequest import *
from .GeneralEvaluation import *
from .PastCasesheets import *
from .DentalEMR import *     


urlpatterns = [
    path('Workbench_Gynecology_Details',Workbench_Gynecology_Details,name='Workbench_Gynecology_Details'),
    path('Workbench_Neurology_Details',Workbench_Neurology_Details,name='Workbench_Neurology_Details'),
    path('Workbench_IFCard_Details',Workbench_IFCard_Details,name='Workbench_IFCard_Details'),
    path('Workbench_OP_Sheet_Details',Workbench_OP_Sheet_Details,name='Workbench_OP_Sheet_Details'),
    path('Workbench_ANC_Card_Details',Workbench_ANC_Card_Details,name='Workbench_ANC_Card_Details'),
    path('Workbench_Opthalmology_Details',Workbench_Opthalmology_Details,name='Workbench_Opthalmology_Details'),
    # path('Workbench_Annotation_Details',Workbench_Annotation_Details,name='Workbench_Annotation_Details'),
    path('Workbench_PastHistory_Details',Workbench_PastHistory_Details,name='Workbench_PastHistory_Details'),
    path('Workbench_GeneralEvaluation_Details',Workbench_GeneralEvaluation_Details,name='Workbench_GeneralEvaluation_Details'),
    path('Workbench_Prescription_Details',Workbench_Prescription_Details,name='Workbench_Prescription_Details'),
    path('Medical_Stock_InsetLink_for_Prescription',Medical_Stock_InsetLink_for_Prescription,name='Medical_Stock_InsetLink_for_Prescription'),
    path('Doctor_previous_prescripion_details', Doctor_previous_prescripion_details, name='Doctor_previous_prescripion_details'),
    path('Workbench_FollowUp_Details', Workbench_FollowUp_Details, name='Workbench_FollowUp_Details'),
    path('Workbench_OtRequest_Details', Workbench_OtRequest_Details, name='Workbench_OtRequest_Details'),
    path('Get_Keycomplaint', Get_Keycomplaint, name='Get_Keycomplaint'),
    path('Get_Priarycomplaint', Get_Priarycomplaint, name='Get_Priarycomplaint'),
    path('insert_op_ip_convertion', insert_op_ip_convertion, name='insert_op_ip_convertion'),
    # path('Workbench_PrescriptionRelatedData', Workbench_PrescriptionRelatedData, name='Workbench_PrescriptionRelatedData'),
    path('Allergy_Details_Link', Allergy_Details_Link, name='Allergy_Details_Link'),
    path('get_OPD_General_Advice_FollowUp', get_OPD_General_Advice_FollowUp, name='get_OPD_General_Advice_FollowUp'),



    path('Item_Names_Link', Item_Names_Link, name='Item_Names_Link'),
    path('Item_Types_Link', Item_Types_Link, name='Item_Types_Link'),
    path('All_Speciality_Details_Link', All_Speciality_Details_Link, name='All_Speciality_Details_Link'),
    path('Refer_doctor_details', Refer_doctor_details, name='Refer_doctor_details'),
    path('Surgery_Details_link', Surgery_Details_link, name='Surgery_Details_link'),
    path('Prescription_OPD_Details_link', Prescription_OPD_Details_link, name='Prescription_OPD_Details_link'),
    path('Workbench_GeneralEvaluation_Details_CaseSheet', Workbench_GeneralEvaluation_Details_CaseSheet, name='Workbench_GeneralEvaluation_Details_CaseSheet'),
    path('Workbench_Vitals_Details_CaseSheet', Workbench_Vitals_Details_CaseSheet, name='Workbench_Vitals_Details_CaseSheet'),
    path('Workbench_Prescription_Details_CaseSheet', Workbench_Prescription_Details_CaseSheet, name='Workbench_Prescription_Details_CaseSheet'),
    path('Workbench_Lab_Details_CaseSheet', Workbench_Lab_Details_CaseSheet, name='Workbench_Lab_Details_CaseSheet'),
    path('Worbench_Advice_Details_CaseSheet', Worbench_Advice_Details_CaseSheet, name='Worbench_Advice_Details_CaseSheet'),
    path('Worbench_Review_Details_CaseSheet', Worbench_Review_Details_CaseSheet, name='Worbench_Review_Details_CaseSheet'),
    
    # 29/10/2024
    path('Workbench_Radiology_Details_CaseSheet', Workbench_Radiology_Details_CaseSheet, name='Workbench_Radiology_Details_CaseSheet'),
    path('Workbench_Prescription_Details_link', Workbench_Prescription_Details_link, name='Workbench_Prescription_Details_link'),
    path('Prescription_EditOPD_Details_link', Prescription_EditOPD_Details_link, name='Prescription_EditOPD_Details_link'),
    path('Prescription_OPDComplete_Details_link', Prescription_OPDComplete_Details_link, name='Prescription_OPDComplete_Details_link'),
    path('Refer_DoctorOpd_Details_CaseSheet', Refer_DoctorOpd_Details_CaseSheet, name='Refer_DoctorOpd_Details_CaseSheet'),
    path('Workbench_Previous_Prescription_Details', Workbench_Previous_Prescription_Details, name='Workbench_Previous_Prescription_Details'),


    path('Nurse_Item_Names_Link', Nurse_Item_Names_Link, name='Nurse_Item_Names_Link'),
    path('Nurse_Item_Names_All_Link', Nurse_Item_Names_All_Link, name='Nurse_Item_Names_All_Link'),
    path('Nurse_Item_Names_Details_all_Link', Nurse_Item_Names_Details_all_Link, name='Nurse_Item_Names_Details_all_Link'),


    path('get_OPD_General_Advice_FollowUp', get_OPD_General_Advice_FollowUp, name='get_OPD_General_Advice_FollowUp'),
    path('get_IP_General_Advice_FollowUp', get_IP_General_Advice_FollowUp, name='get_IP_General_Advice_FollowUp'),
    path('get_Discharged_Patient_Details', get_Discharged_Patient_Details, name='get_Discharged_Patient_Details'),
    path('get_OPD_General_Advice_FollowUp_by_filter', get_OPD_General_Advice_FollowUp_by_filter, name='get_OPD_General_Advice_FollowUp_by_filter'),
    path('get_Pending_documents',get_Pending_documents,name='get_Pending_documents'),
 
 
    path('Disease_master_details', Disease_master_details, name='Disease_master_details'),
    path('Get_DiseaseName', Get_DiseaseName, name='Get_DiseaseName'),
    path('Item_Names_Link_fordoctor', Item_Names_Link_fordoctor, name='Item_Names_Link_fordoctor'),
    path('Prescription_OPD_Details_link_OPDRECEPTION',Prescription_OPD_Details_link_OPDRECEPTION,name='Prescription_OPD_Details_link_OPDRECEPTION'),
    path('workbench_emr_evaluation',workbench_emr_evaluation,name='workbench_emr_evaluation'),
    path('workbench_dentalemr_evaluation',workbench_dentalemr_evaluation,name='workbench_dentalemr_evaluation'),
    path('get_dental_request_details_op',get_dental_request_details_op,name='get_dental_request_details_op'),
    path('get_past_casesheets_details_for_doctor',get_past_casesheets_details_for_doctor,name='get_past_casesheets_details_for_doctor'),
 
 
    

]



