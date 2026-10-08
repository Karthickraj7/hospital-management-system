from django.urls import path
from .OTMaster import *
from .OTNotes import *


urlpatterns=[

    #OT
    path('OtTheaterMaster_Detials_link',OtTheaterMaster_Detials_link,name = 'OtTheaterMaster_Detials_link'),
    path('Theatrename_all', Theatrename_all, name= 'Theatrename_all'),
    path('Doctorname_for_OTBooking', Doctorname_for_OTBooking, name= 'Doctorname_for_OTBooking'),
    path('Surgeon_list', Surgeon_list, name= 'Surgeon_list'), 
    path('Surgeon_list_for_calendar', Surgeon_list_for_calendar, name= 'Surgeon_list_for_calendar'), 
    
    path('Assistant_Surgeon_list', Assistant_Surgeon_list, name= 'Assistant_Surgeon_list'),
    path('Anaesthesiologist_list', Anaesthesiologist_list, name= 'Anaesthesiologist_list'),
    path('Scrub_Nurse_list', Scrub_Nurse_list, name= 'Scrub_Nurse_list'),
    path('Circulating_Nurse_list', Circulating_Nurse_list, name= 'Circulating_Nurse_list'),
    path('Technician_list', Technician_list, name= 'Technician_list'),
    path('Helper_list', Helper_list, name= 'Helper_list'),
    path('Theatre_booking_request_details', Theatre_booking_request_details, name= 'Theatre_booking_request_details'),
    path('OTQueuelist_details', OTQueuelist_details, name= 'OTQueuelist_details'),
    path('Theatre_booking_request_detail_by_Patient', Theatre_booking_request_detail_by_Patient, name= 'Theatre_booking_request_detail_by_Patient'),
    path('Theatre_booking_request_Outside_details', Theatre_booking_request_Outside_details, name= 'Theatre_booking_request_Outside_details'),
    path('Surgical_Team_details', Surgical_Team_details, name= 'Surgical_Team_details'),
    path('get_item_details_for_consumables',get_item_details_for_consumables, name= 'get_item_details_for_consumables'),
    path('get_store_name_for_OT',get_store_name_for_OT, name= 'get_store_name_for_OT'),
    path('get_Theatre_name_for_OT_Calendar',get_Theatre_name_for_OT_Calendar,name = 'get_Theatre_name_for_OT_Calendar'),
    path('get_ot_availability',get_ot_availability,name='get_ot_availability'),
    path('Consumable_details',Consumable_details,name='Consumable_details'),
    path('Consignment_details',Consignment_details,name='Consignment_details'),
    path('OTCompletepatient_details',OTCompletepatient_details,name='OTCompletepatient_details'),
    path('Equipment_details',Equipment_details,name = 'Equipment_details'),
    path('OTConfirmedpatient_details',OTConfirmedpatient_details,name='OTConfirmedpatient_details'),
    path('OTCalendar_Booking_Status',OTCalendar_Booking_Status,name='OTCalendar_Booking_Status'),
    path('get_Ward_details_by_floor_for_ot',get_Ward_details_by_floor_for_ot,name ='get_Ward_details_by_floor_for_ot'),
    path('get_ot_doctor_availability',get_ot_doctor_availability,name="get_ot_doctor_availability"),
   # path('Theatre_booking_request_detail_by_status',Theatre_booking_request_detail_by_status,name='Theatre_booking_request_detail_by_status'),
    path('OT_Billing_details',OT_Billing_details,name='OT_Billing_details'),
    path('Confirmation_by_doctor',Confirmation_by_doctor,name = 'Confirmation_by_doctor'),
    path('delete_consignment',delete_consignment,name='delete_consignment'),
    path('delete_equipment',delete_equipment,name='delete_equipment'),

    path('Pre_Operative_Checklist_OT_Details',Pre_Operative_Checklist_OT_Details,name = 'Pre_Operative_Checklist_OT_Details'),
    path('Intra_Post_Operative_Notes_OT_Details',Intra_Post_Operative_Notes_OT_Details, name = 'Intra_Post_Operative_Notes_OT_Details'),
    path('Cataract_Notes_OT_Details',Cataract_Notes_OT_Details,name='Cataract_Notes_OT_Details'),
    path('DCR_Notes_OT_Details',DCR_Notes_OT_Details,name='DCR_Notes_OT_Details'),
    path('Terigium_Notes_OT_Details',Terigium_Notes_OT_Details,name='Terigium_Notes_OT_Details'),
    path('Neuro_Notes_OT_Details',Neuro_Notes_OT_Details,name='Neuro_Notes_OT_Details'),
    path('Labour_delivery_Notes_OT_Details',Labour_delivery_Notes_OT_Details,name='Labour_delivery_Notes_OT_Details'),
    path('OTConfirmedpatient_details_for_OtAnaesthesia',OTConfirmedpatient_details_for_OtAnaesthesia,name='OTConfirmedpatient_details_for_OtAnaesthesia'),
    path('Anaesthesia_Pre_Operative_Checklist_Details',Anaesthesia_Pre_Operative_Checklist_Details,name='Anaesthesia_Pre_Operative_Checklist_Details'),
    path('Anaesthesia_Post_Operative_Checklist_Details',Anaesthesia_Post_Operative_Checklist_Details,name = 'Anaesthesia_Post_Operative_Checklist_Details'),
    path('Anaesthesia_Intra_Operative_Checklist_Details',Anaesthesia_Intra_Operative_Checklist_Details,name = 'Anaesthesia_Intra_Operative_Checklist_Details'),

    path('OTConfirmedpatient_details_for_OtNurse',OTConfirmedpatient_details_for_OtNurse,name='OTConfirmedpatient_details_for_OtNurse'),
    path('Confirmation_by_nurse',Confirmation_by_nurse,name='Confirmation_by_nurse'),
    path('room_filter_by_floor',room_filter_by_floor,name='room_filter_by_floor'),

    path('Procedurename_Speciality_link',Procedurename_Speciality_link,name='Procedurename_Speciality_link'),
    path('Surgeryname_Speciality_link',Surgeryname_Speciality_link,name='Surgeryname_Speciality_link'),

    path('Theatre_booking_request_detail_For_Emg_Patient',Theatre_booking_request_detail_For_Emg_Patient,name='Theatre_booking_request_detail_For_Emg_Patient'),

        path('OTItem_List_For_IP',OTItem_List_For_IP,name='OTItem_List_For_IP'),
        path('OTItem_List_For_IP_Estimated_Bill',OTItem_List_For_IP_Estimated_Bill,name='OTItem_List_For_IP_Estimated_Bill'),
 
path('Booking_Complete_Link',Booking_Complete_Link,name='Booking_Complete_Link'),   
]