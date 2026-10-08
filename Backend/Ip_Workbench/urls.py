from django.urls import path



from .IP_Vitals import *
from .Quelist import *
from .IPD_Handover import *
from .IP_SurgicalHistory import *
from .IP_InputOutputBalance import *
from .IP_ProgressNotes import *
from .IP_Assesment import *
from .IP_Mlc import *
from .IP_Dama import *
from .IP_PreoperativeChecklist import *
from .IP_PreOpInstructions import *
from .IP_ConsernForms import *
from .IP_DrainageTubes import *

from  .IP_VentilatorSettings import *
from  .IP_BloodLines import *
from  .IP_UrinaryCathetor import *
from  .IP_BloodTransfusedRecord import *
from  .IP_SurgicalSite import *
from  .IP_BedsoreManagement import *
from  .IP_PatientCare import *
from  .IP_ReferAndInchargeDoctor import *
from  .IP_DischargeChecklist import *
from  .IP_DischargeRequest import *
from .IP_Biling_Entry import *

from .BirthDeathRegister import *
from .IP_Allergy import *
from .IP_OtRequest import *
from .Warddashboard import *
from .Ip_procedure import *
from .IP_DischargeSummary import *
from .EmgToIpconnect import *

from .RenderSummaryForm import *

from .TreatmentRecord import *

# Medication, Examination, Procedure
from .MedicationRecord import *
from .ExaminationForm import *
from .ProcedureForm import *


urlpatterns=[
   
path('get_IP_workbenchquelist_doctor',get_IP_workbenchquelist_doctor,name='get_IP_workbenchquelist_doctor'),
path('IP_Vitals_Form_Details_Link',IP_Vitals_Form_Details_Link,name='IP_Vitals_Form_Details_Link'),
path('IPD_Handover_Details_Link',IPD_Handover_Details_Link,name='IPD_Handover_Details_Link'),
path('IP_SurgicalHistory_Details_Link',IP_SurgicalHistory_Details_Link,name='IP_SurgicalHistory_Details_Link'),
path('IP_InputOutputBalance_Details_Link',IP_InputOutputBalance_Details_Link,name='IP_InputOutputBalance_Details_Link'),
path('IP_Balance_Details_Link',IP_Balance_Details_Link,name='IP_Balance_Details_Link'),
path('IP_ProgressNotes_Details_Link',IP_ProgressNotes_Details_Link,name='IP_ProgressNotes_Details_Link'),
path('IP_Assesment_details_Link',IP_Assesment_details_Link,name='IP_Assesment_details_Link'),
path('IP_Mlc_Details_Link',IP_Mlc_Details_Link,name='IP_Mlc_Details_Link'),
path('IP_Dama_Details_Link',IP_Dama_Details_Link,name='IP_Dama_Details_Link'),
path('IP_TransferForm_Details_Link',IP_TransferForm_Details_Link,name='IP_TransferForm_Details_Link'),

path('IP_PreOpChecklist_Details_Link',IP_PreOpChecklist_Details_Link,name='IP_PreOpChecklist_Details_Link'),
path('IP_PreOpInstructions_Details_Link',IP_PreOpInstructions_Details_Link,name='IP_PreOpInstructions_Details_Link'),
path('IP_ConsentForm_Details_Link',IP_ConsentForm_Details_Link,name='IP_ConsentForm_Details_Link'),


path('IP_Ventilator_Details_Link',IP_Ventilator_Details_Link,name='IP_Ventilator_Details_Link'),
path('IP_BloodLines_Details_Link',IP_BloodLines_Details_Link,name='IP_BloodLines_Details_Link'),
path('IP_UrinaryCathetor_Details_Link',IP_UrinaryCathetor_Details_Link,name='IP_UrinaryCathetor_Details_Link'),
path('IP_BloodTransfusedRecord_Details_Link',IP_BloodTransfusedRecord_Details_Link,name='IP_BloodTransfusedRecord_Details_Link'),
path('IP_DrainageTubes_Details_Link',IP_DrainageTubes_Details_Link,name='IP_DrainageTubes_Details_Link'),
path('IP_SurgicalSite_Details_Link',IP_SurgicalSite_Details_Link,name='IP_SurgicalSite_Details_Link'),
path('IP_BedsoreManagement_Details_Link',IP_BedsoreManagement_Details_Link,name='IP_BedsoreManagement_Details_Link'),
path('IP_PatientCare_Details_Link',IP_PatientCare_Details_Link,name='IP_PatientCare_Details_Link'),
path('IP_InchargeAndRefer_Details_Link',IP_InchargeAndRefer_Details_Link,name='IP_InchargeAndRefer_Details_Link'),



path('IP_DischargeRequest_Details_Link',IP_DischargeRequest_Details_Link,name='IP_DischargeRequest_Details_Link'),
path('get_discharge_request_Using_IP_Registration_details',get_discharge_request_Using_IP_Registration_details,name='get_discharge_request_Using_IP_Registration_details'),
path('Update_DischargeRequest_Details',Update_DischargeRequest_Details,name='Update_DischargeRequest_Details'),
path('IP_DischargeClearance_Details',IP_DischargeClearance_Details,name='IP_DischargeClearance_Details'),
path('IP_RoomDetails_Checklist_Link',IP_RoomDetails_Checklist_Link,name='IP_RoomDetails_Checklist_Link'),
path('IP_Discharge_Checklist_Details_Link',IP_Discharge_Checklist_Details_Link,name='IP_Discharge_Checklist_Details_Link'),
path('IP_PhysicalDischarge_Checklist_Details_Link',IP_PhysicalDischarge_Checklist_Details_Link,name='IP_PhysicalDischarge_Checklist_Details_Link'),


path('IP_Discharge_Checklist_Link',IP_Discharge_Checklist_Link, name = 'IP_Discharge_Checklist_Link'),
path('IP_Discharge_Clearance_Link',IP_Discharge_Clearance_Link, name = 'IP_Discharge_Clearance_Link'),
path('IP_DischargeCancel_Details_Link',IP_DischargeCancel_Details_Link, name = 'IP_DischargeCancel_Details_Link'),
path('IP_Physical_Discharge_Link',IP_Physical_Discharge_Link, name = 'IP_Physical_Discharge_Link'),


path('IP_Billing_Entry_link',IP_Billing_Entry_link, name = 'IP_Billing_Entry_link'),
path('IP_Consultation_Entry',IP_Consultation_Entry, name = 'IP_Consultation_Entry'),



path('insert_birth_register',insert_birth_register, name = 'insert_birth_register'),
path('insert_death_register',insert_death_register, name = 'insert_death_register'),
path('get_birth_register',get_birth_register, name = 'get_birth_register'),
path('get_death_register',get_death_register, name = 'get_death_register'),
path('IP_Allergy_Details_Link',IP_Allergy_Details_Link, name = 'IP_Allergy_Details_Link'),
path('post_ot_request_nurse_workbench',post_ot_request_nurse_workbench, name = 'post_ot_request_nurse_workbench'),


path('get_patient_stats_warddashboard',get_patient_stats_warddashboard, name = 'get_patient_stats_warddashboard'),


# Procedure
path('Insert_Ip_Procedure_Order', Insert_Ip_Procedure_Order, name='Insert_Ip_Procedure_Order'),
path('Stop_Ip_Procedure_Order', Stop_Ip_Procedure_Order, name='Stop_Ip_Procedure_Order'),
path('Get_therapy_request_for_therapist', Get_therapy_request_for_therapist, name='Get_therapy_request_for_therapist'),
path('IP_DischargeSummary_Details_Link',IP_DischargeSummary_Details_Link, name = 'IP_DischargeSummary_Details_Link'),



path('insert_Emg_To_IP_convertion',insert_Emg_To_IP_convertion, name = 'insert_Emg_To_IP_convertion'),

path('IP_Vitals_By_PatientId',IP_Vitals_By_PatientId,name='IP_Vitals_By_PatientId'),
path('IP_Allergy_By_PatientId',IP_Allergy_By_PatientId,name='IP_Allergy_By_PatientId'),
path('IP_IO_Balance_Details_Get',IP_IO_Balance_Details_Get,name='IP_IO_Balance_Details_Get'),

path('get_ip_vitals_by_patient',get_ip_vitals_by_patient,name='get_ip_vitals_by_patient'),
path('get_ippatient_discharge_pending_list',get_ippatient_discharge_pending_list,name='get_ippatient_discharge_pending_list'),
 

    # ---------------- treatment record ----------------
 
    path('treatment_record_Details_Link/', treatment_record_Details_Link, name='treatment_record_Details_Link'),
    path('get_treatment_record/<str:patient_id>/', get_treatment_record, name='get_treatment_record'),
    path('update_treatment_record/<int:record_id>/', update_treatment_record, name='update_treatment_record'),
    # ----------------Treatment summary  ----------------

    path('Treatment_summary_Details_Link',Treatment_summary_Details_Link,name='Treatment_summary_Details_Link'),
    path('update_treatment_summary/<int:record_id>/', update_treatment_summary, name='update_treatment_summary'),  # ← THIS WAS MISSING
    path('get_treatment_summary/<str:patient_id>/', get_treatment_summary, name='get_treatment_summary'),

    
    # ---------------- Medication ----------------
    path('Medication_Record_Details_Link',Medication_Record_Details_Link,name='Medication_Record_Details_Link'),
    path('get_medication_forms/<str:patient_id>/',get_medication_forms,name='get_medication_forms'),
    path('update_Medication_Record/<int:pk>/',update_Medication_Record,name='update_Medication_Record'),
   
   
    # ---------------- Examination ----------------
   

    path("get_examination_forms/<str:patient_id>/",get_examination_forms,name="get_examination_forms"),
    path("examination_form_Details_Link",Examination_form_Details_Link,name="examination_form_Details_Link"),
    path("update_examination_forms/<int:record_id>/", update_examination_forms,name="update_examination_forms" ),
    
    # ---------------- Procedure ----------------
   
    path('procedures_form_Details_Link',procedures_form_Details_Link,name='procedures_form_Details_Link'),
    path('get_procedure_forms/<str:id>/', get_procedure_forms, name='get_procedure_forms'),
    path("update_procedure_form/<int:id>/", update_procedure_form, name="update_procedure_form"),
    path('delete_procedure-form/<int:id>/delete/', delete_procedure_form, name='delete_procedure_form'),


]







