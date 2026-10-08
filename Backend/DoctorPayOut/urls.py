from django.urls import path
from .DoctorPayout import *

urlpatterns = [
    path('Get_doctor_payout_details_consultaion',Get_doctor_payout_details_consultaion,name='Get_doctor_payout_details_consultaion'),
    path('Get_doctor_payout_details_Lab',Get_doctor_payout_details_Lab,name='Get_doctor_payout_details_Lab'),
    path('Get_doctor_payout_details_Radiology',Get_doctor_payout_details_Radiology,name='Get_doctor_payout_details_Radiology'),
    path('get_ip_doctor_service_type_summary',get_ip_doctor_service_type_summary,name='get_ip_doctor_service_type_summary'),
]