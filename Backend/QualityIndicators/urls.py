from django.urls import path

from QualityIndicators.HRQAIndicator import *
from QualityIndicators.IPQAIndicator import *
from QualityIndicators.InventoryQAIndicator import *
from QualityIndicators.LabQAIndicator import *
from QualityIndicators.MedicalErrorRegisteration import *
from QualityIndicators.OPDQAIndicator import *
from QualityIndicators.OTQAIndicator import *
from QualityIndicators.QATimingMaster import *
from QualityIndicators.RadiologyQAIndicators import *





urlpatterns =[
  
    path('get_Patient_Details_by_patientId',get_Patient_Details_by_patientId,name='get_Patient_Details_by_patientId'),
    path('medical-errors/', get_medical_errors, name='get_medical_errors'),
    path('medical-errors/create/', create_medical_error, name='create_medical_error'),
    path('medical-errors/update/<int:id>/',update_medical_error, name='update_medical_error'),
    path('medical-errors/delete/<int:id>/',delete_medical_error, name='delete_medical_error'),
    path('create_medical_error_report',create_medical_error_report, name='create_medical_error_report'),
    
    
    path('get_medical_errors', get_medical_errors, name='get_medical_errors'),
    # timing Master QA
    path('qatiming/', get_qatiming, name='get_qatiming'),
    path('qatiming/add/', add_qatiming, name='add_qatiming'),
    path('qatiming/edit/<int:id>/', edit_qatiming, name='edit_qatiming'),
    path('qatiming/delete/<int:id>/',delete_qatiming,name='delete_qatiming'),

    path('get_all_patients_time_comparison', get_all_patients_time_comparison, name='get_all_patients_time_comparison'),
    path('get_IP_patients_fro_QA_1', get_IP_patients_fro_QA_1, name='get_IP_patients_fro_QA_1'),
    path('get_IP_patients_fro_QA_2', get_IP_patients_fro_QA_2, name='get_IP_patients_fro_QA_2'),
    path('get_IP_patients_fro_QA_3', get_IP_patients_fro_QA_3, name='get_IP_patients_fro_QA_3'),
    path('get_IP_patients_fro_QA_4', get_IP_patients_fro_QA_4, name='get_IP_patients_fro_QA_4'),
    path('get_IP_patients_fro_QA_5', get_IP_patients_fro_QA_5, name='get_IP_patients_fro_QA_5'),

    path('get_patient_details_OP_for_QA', get_patient_details_OP_for_QA, name='get_patient_details_OP_for_QA'),
    path('get_patient_details_OP_for_QA_2', get_patient_details_OP_for_QA_2, name='get_patient_details_OP_for_QA_2'),
    
    path('get_employee_details_for_QA', get_employee_details_for_QA, name='get_employee_details_for_QA'),
    path('get_all_OT_patient_for_QA', get_all_OT_patient_for_QA, name='get_all_OT_patient_for_QA'),
    path('get_inventory_details_for_QA', get_inventory_details_for_QA, name='get_inventory_details_for_QA'),
    path('get_lab_quality_metrics', get_lab_quality_metrics, name='get_lab_quality_metrics'),
    
    path('get_lab_quality_metrics_2', get_lab_quality_metrics_2, name='get_lab_quality_metrics_2'),
    path('get_Radiology_quality_metrics', get_Radiology_quality_metrics, name='get_Radiology_quality_metrics'),
    path('get_Radiology_quality_metrics_2', get_Radiology_quality_metrics_2, name='get_Radiology_quality_metrics_2'),
    
    
    path('get_patient_details_for_QA', get_patient_details_for_QA, name='get_patient_details_for_QA'),
    path('get_row_count_for_qa_dashboard', get_row_count_for_qa_dashboard, name='get_row_count_for_qa_dashboard'),
]