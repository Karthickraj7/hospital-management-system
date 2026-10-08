from django.urls import path
from .views import *
from . import pacs_views

urlpatterns = [
    path('Get_Documents_link/', RadiologyDocumentListView.as_view(), name='Get_Documents_link'),
    path('Upload_Document_link/', RadiologyDocumentUploadView.as_view(), name='Upload_Document_link'),
    path('Documents_Detail_link/', RadiologyDocumentDetailView.as_view(), name='Documents_Detail_link'),
    path('Documents_Edit_link/', Documents_Edit_link, name='Documents_Edit_link'),
    path('Update_Document_link/<int:document_id>/', Update_Document_link, name='Update_Document_link'),
    path('Delete_Document_link/<int:document_id>/', Delete_Document_link, name='Delete_Document_link'),
    path('Get_Report_From_Doctor', Get_Report_From_Doctor, name='Get_Report_From_Doctor'),
    path('get_radiology_reports_queue', get_radiology_reports_queue, name='get_radiology_reports_queue'),
    path('Get_Data_For_Dispatch', Get_Data_For_Dispatch, name='Get_Data_For_Dispatch'),
    path('Get_for_Patient_master', Get_for_Patient_master, name='Get_for_Patient_master'),
    path('radiology_doctor_wise_report', radiology_doctor_wise_report, name='radiology_doctor_wise_report'),
    path('get_patienttestlist', get_patienttestlist, name='get_patienttestlist'),
    path('Radiology_Complete_Details_Link', Radiology_Complete_Details_Link, name='Radiology_Complete_Details_Link'),
    path('Radiology_Data_Summarys', Radiology_Data_Summarys, name='Radiology_Data_Summarys'),
    path('delete_patienttest', delete_patienttest, name='delete_patienttest'),
    path('delete_mci_radiology_request', delete_mci_radiology_request, name='delete_mci_radiology_request'),
    path('get_original_patient_report_for_dummy_link', get_original_patient_report_for_dummy_link, name='get_original_patient_report_for_dummy_link'),
    path('Notify_Critical_patienttest', Notify_Critical_patienttest, name='Notify_Critical_patienttest'),

    # ── PACS / Orthanc proxy endpoints ───────────────────────────────────────

    # Test connectivity
    path('pacs/test/', pacs_views.test_pacs_connection, name='pacs_test'),

    # Studies — used by PACSWorkflow: GET pacs/studies/<patientId>/
    path('pacs/studies/<str:patient_id>/', pacs_views.get_pacs_studies, name='pacs_studies'),

    # Series — TWO paths:
    #   Original:  pacs/study/<uid>/series/
    #   Frontend alias (PACSWorkflow calls this): pacs/series/<uid>/
    path('pacs/study/<str:study_uid>/series/', pacs_views.get_study_series, name='pacs_study_series'),
    path('pacs/series/<str:study_uid>/', pacs_views.get_study_series, name='pacs_series_alias'),

    # Instances — TWO paths:
    #   Original:  pacs/series/<uid>/instances/
    #   Frontend alias (PACSWorkflow calls this): pacs/instances/<uid>/
    path('pacs/series/<str:series_uid>/instances/', pacs_views.get_series_instances, name='pacs_instances'),
    path('pacs/instances/<str:series_uid>/', pacs_views.get_series_instances, name='pacs_instances_alias'),

    # Debug — lists all patients in Orthanc to verify PatientID format
    path('pacs/debug/', pacs_views.pacs_debug, name='pacs_debug'),

    # Image (rendered JPEG)
    path('pacs/image/<str:instance_uid>/', pacs_views.get_rendered_image, name='pacs_image'),
]