from django.urls import path

from .NurseStationPatients import *
from .views import *

urlpatterns = [
    path('get_nurse_station_patients',get_nurse_station_patients,name='get_nurse_station_patients'),
    path('Radiology_RequestDetails',Radiology_RequestDetails,name='Radiology_RequestDetails'),
    path('get_ip_Patient_registration_details_for_Nusestation',get_ip_Patient_registration_details_for_Nusestation,name='get_ip_Patient_registration_details_for_Nusestation'),
    path('get_ip_registration_before_handover_details',get_ip_registration_before_handover_details,name='get_ip_registration_before_handover_details'),
    path('get_stockDetails_for_nursestation',get_stockDetails_for_nursestation,name='get_stockDetails_for_nursestation'),
    path('get_stocksummary_for_product',get_stocksummary_for_product,name='get_stocksummary_for_product'),
    path('NurseStation_Stock_Excel_File_Upload',NurseStation_Stock_Excel_File_Upload,name='NurseStation_Stock_Excel_File_Upload'),
    path('minmax_nursestation_api',minmax_nursestation_api,name='minmax_nursestation_api'),
    path('nurse_station_list',nurse_station_list,name='nurse_station_list'),
    path('minmax_nursestation_excel_upload',minmax_nursestation_excel_upload,name='minmax_nursestation_excel_upload'),
]