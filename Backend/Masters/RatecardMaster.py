import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *

from django.utils.decorators import method_decorator
from django.views import View

import logging
from collections import defaultdict
from decimal import Decimal, InvalidOperation
from django.db.models import Prefetch

from django.core.exceptions import ObjectDoesNotExist
 
 
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['GET'])
def Insurance_client_master_details(request):
    if request.method == 'GET':
        try:
            Insurance_ins = Insurance_Master_Detials.objects.all()
            Client_ins = Client_Master_Detials.objects.all()
            Corporate_ins = Corporate_Master_Detials.objects.all()

            insurance_names = []
            
            for ins in Insurance_ins:
                insurance_name = {
                    'id': ins.Insurance_Id,
                    'insurance_name': ins.Insurance_Name
                }
                insurance_names.append(insurance_name)

            for client in Client_ins:
                client_name = {
                    'id': client.Client_Id,
                    'insurance_name': client.Client_Name
                }
                insurance_names.append(client_name)
                
            for corp in Corporate_ins:
                corp_name = {
                    'id': corp.Corporate_Id,
                    'insurance_name': corp.Corporate_Name
                }
                insurance_names.append(corp_name)

            return JsonResponse(insurance_names, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})

# @csrf_exempt
# @require_http_methods(['GET'])
# def Overall_services_link(request):
#     if request.method == 'GET':
#         try:
#             Doctor_ins = Doctor_Personal_Form_Detials.objects.all()
#             print('Doccccccc',Doctor_ins)
#             for doc in Doctor_ins:
#                 # doctor = Doctor_Personal_Form_Detials.objects.get(pk=doc.Doctor_ID)
#                 ratecard = Doctor_Ratecard_Master.objects.filter(Doctor_ID=doc).first()
#                 print('ratteeeeee',ratecard)
#                 room_fees = RoomTypeFee.objects.filter(doctor_ratecard=ratecard)
#                 print('ratteessss',room_fees)
#                 client_fees = ClientFee.objects.filter(doctor_ratecard=ratecard)
#                 print("client_fees",client_fees)
#                 corporate_fees = CorporateFee.objects.filter(doctor_ratecard=ratecard)
#                 print("corporate_fees",corporate_fees)
#                 insurance_fees = InsuranceFee.objects.filter(doctor_ratecard=ratecard)
#                 client_roomtype_fees = ClientRoomTypeFee.objects.filter(doctor_ratecard=ratecard)
#                 print("client_roomtype_fees",client_roomtype_fees)
#                 corporate_roomtype_fees = CorporateRoomTypeFee.objects.filter(doctor_ratecard=ratecard)
#                 print("corporate_roomtype_fees",corporate_roomtype_fees)
                
                
                
#                 doctor_data = {
#                     'id': doc.Doctor_ID,
#                     'doctor_name': f"{doc.Tittle}.{doc.First_Name} {doc.Middle_Name} {doc.Last_Name}",
#                     'DoctorType': doc.DoctorType,
#                     'Status': 'Active' if doc.Status else 'Inactive',
#                     'Roomtypes':[],
#                     'Ratecarddetials': [
#                         {
#                             'id': 1,
#                             'isrowgroup': False,
#                             'RatecardType': 'General',
#                             'RatecardShow': 'General',
#                             'RatecardName': None,
#                             'doctor_ratecard_id':ratecard.RateCard_Id,
#                             'consultation_Prev_fee': ratecard.General_Prev_Consultation_Fee,
#                             'consultation_curr_fee': ratecard.General_Consultation_Fee,
#                             'follow_up_Prev_fee': ratecard.General_Prev_Follow_Up_Fee,
#                             'follow_up_curr_fee': ratecard.General_Follow_Up_Fee,
#                             'emg_consultant_Prev_fee': ratecard.General_Prev_Emg_Consulting_Fee,
#                             'emg_consultant_curr_fee': ratecard.General_Emg_Consulting_Fee,
#                         },
#                         {
#                             'id':2,
#                             'isrowgroup': False,
#                             'RatecardType': 'Special',
#                             'RatecardShow': 'Special',
#                             'RatecardName': None,
#                             'doctor_ratecard_id':ratecard.RateCard_Id,
#                             'consultation_Prev_fee': ratecard.Special_Prev_Consultation_Fee,
#                             'consultation_curr_fee': ratecard.Special_Consultation_Fee,
#                             'follow_up_Prev_fee': ratecard.Special_Prev_Follow_Up_Fee,
#                             'follow_up_curr_fee': ratecard.Special_Follow_Up_Fee,
#                             'emg_consultant_Prev_fee': ratecard.Special_Prev_Emg_Consulting_Fee,
#                             'emg_consultant_curr_fee': ratecard.Special_Emg_Consulting_Fee,
#                         }
#                     ]
#                 }
#                 # Add room fees to ratecard details
            
#                 # Add client fees as a grouped section
#                 if client_fees:
#                     doctor_data['Ratecarddetials'].append({
#                         'id': len(doctor_data['Ratecarddetials']) + 1,
#                         'isrowgroup': True,
#                         'RatecardType': 'Client',
#                         'RatecardShow': 'Client',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': None,
#                         'consultation_curr_fee': None,
#                         'follow_up_Prev_fee': None,
#                         'follow_up_curr_fee': None,
#                         'emg_consultant_Prev_fee': None,
#                         'emg_consultant_curr_fee': None,
#                     })
#                 for client_fee in client_fees:
#                     client_ratecard = {
#                         'id': len(doctor_data['Ratecarddetials']) + 1,
#                         'isrowgroup': False,
#                         'RatecardType': 'Client',
#                         'RatecardShow': None,
#                         'doctor_ratecard_id':client_fee.doctor_ratecard.RateCard_Id,
#                         'RatecardName': client_fee.client.Client_Name,
#                         'Ratecardid': client_fee.client.Client_Id,
#                         'consultation_Prev_fee': client_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': client_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': client_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': client_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': client_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': client_fee.Emg_Consulting_Fee,
#                     }
#                     doctor_data['Ratecarddetials'].append(client_ratecard)
                
#                 #Add corporate fees as a grouped section
#                 if corporate_fees:
#                     doctor_data['Ratecarddetials'].append({
#                         'id': len(doctor_data['Ratecarddetials']) + 1,
#                         'isrowgroup': True,
#                         'RatecardType': 'Corporate',
#                         'RatecardShow': 'Corporate',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': None,
#                         'consultation_curr_fee': None,
#                         'follow_up_Prev_fee': None,
#                         'follow_up_curr_fee': None,
#                         'emg_consultant_Prev_fee': None,
#                         'emg_consultant_curr_fee': None,
#                     })
                
#                 for corporate_fee in corporate_fees:
#                     corporate_ratecard = {
#                         'id': len(doctor_data['Ratecarddetials']) + 1,
#                         'isrowgroup': False,
#                         'RatecardType': 'Corporate',
#                         'RatecardShow': None,
#                         'doctor_ratecard_id':corporate_fee.doctor_ratecard.RateCard_Id,
#                         'RatecardName': corporate_fee.corporate.Corporate_Name,
#                         'Ratecardid': corporate_fee.corporate.Corporate_Id,
#                         'consultation_Prev_fee': corporate_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': corporate_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': corporate_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': corporate_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': corporate_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': corporate_fee.Emg_Consulting_Fee,
#                     }
#                     doctor_data['Ratecarddetials'].append(corporate_ratecard)
                    
                
#                 # Add insurance fees as a grouped section
#                 if insurance_fees:
#                     doctor_data['Ratecarddetials'].append({
#                         'id': len(doctor_data['Ratecarddetials']) + 1,
#                         'isrowgroup': True,
#                         'RatecardType': 'Insurance',
#                         'RatecardShow': 'Insurance',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': None,
#                         'consultation_curr_fee': None,
#                         'follow_up_Prev_fee': None,
#                         'follow_up_curr_fee': None,
#                         'emg_consultant_Prev_fee': None,
#                         'emg_consultant_curr_fee': None,
#                     })
#                 for insurance_fee in insurance_fees:
#                     insurance_ratecard = {
#                         'id': len(doctor_data['Ratecarddetials']) + 1,
#                         'isrowgroup': False,
#                         'RatecardType': 'Insurance',
#                         'RatecardShow': None,
#                         'doctor_ratecard_id':insurance_fee.doctor_ratecard.RateCard_Id,
#                         'RatecardName': insurance_fee.insurance.Insurance_Name,
#                         'Ratecardid': insurance_fee.insurance.Insurance_Id,
#                         'consultation_Prev_fee': insurance_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': insurance_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': insurance_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': insurance_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': insurance_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': insurance_fee.Emg_Consulting_Fee,
#                     }
#                     doctor_data['Ratecarddetials'].append(insurance_ratecard)
                    
#                     for room_fee in room_fees:
#                         room_name = room_fee.room_type.Ward_Name.Ward_Name
#                         room_id = room_fee.room_type.Room_Id
#                         if {'id':room_id,'name':room_name} not in doctor_data['Roomtypes']:
#                             doctor_data['Roomtypes'].append({'id':room_id,'name':room_name})
                    
#                     for dat in doctor_data['Ratecarddetials']:
                    
#                         for room_fee in room_fees:
#                             room_name = room_fee.room_type.Ward_Name.Ward_Name
#                             room_id = room_fee.room_type.Room_Id
#                             if dat['RatecardType'] == 'General':
#                                 dat[f'{room_name}_{room_id}_prev_fee'] = room_fee.General_Prev_fee
#                                 dat[f'{room_name}_{room_id}_curr_fee'] = room_fee.General_fee
#                             elif dat['RatecardType'] == 'Special':
#                                 dat[f'{room_name}_{room_id}_prev_fee'] = room_fee.Special_Prev_fee
#                                 dat[f'{room_name}_{room_id}_curr_fee'] = room_fee.Special_fee
#                             elif dat['RatecardType'] == 'Insurance':
#                                 if dat['isrowgroup']:
#                                     dat[f'{room_name}_{room_id}_prev_fee'] = None
#                                     dat[f'{room_name}_{room_id}_curr_fee'] = None
#                                 else:
#                                     if dat['Ratecardid']:
#                                         ins_id=dat['Ratecardid']
#                                         ins_roomtype_fees = InsuranceRoomTypeFee.objects.get(doctor_ratecard=ratecard,room_type_fee=room_fee,insurance__pk=ins_id)
                                    
#                                         if ins_roomtype_fees:
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = ins_roomtype_fees.Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = ins_roomtype_fees.fee
#                                         else:
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = None
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = None
                            
#                             elif dat['RatecardType'] == 'Client':
                                
#                                 if dat['isrowgroup']:
#                                     dat[f'{room_name}_{room_id}_prev_fee'] = None
#                                     dat[f'{room_name}_{room_id}_curr_fee'] = None
#                                 else:
#                                     if dat['Ratecardid']:
#                                         client_id=dat['Ratecardid']
#                                         client_roomtype_fees = ClientRoomTypeFee.objects.get(doctor_ratecard=ratecard,room_type_fee=room_fee,client__pk=client_id)
                                    
#                                         if client_roomtype_fees:
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = client_roomtype_fees.Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = client_roomtype_fees.fee
#                                         else:
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = None
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = None
#                             elif dat['RatecardType'] == 'Corporate':
#                                 if dat['isrowgroup']:
#                                     dat[f'{room_name}_{room_id}_prev_fee'] = None
#                                     dat[f'{room_name}_{room_id}_curr_fee'] = None
#                                 else:
#                                     if dat['Ratecardid']:
#                                         corporate_id=dat['Ratecardid']
#                                         corporate_roomtype_fees = CorporateRoomTypeFee.objects.get(doctor_ratecard=ratecard,room_type_fee=room_fee,corporate__pk=corporate_id)
                                        
#                                         if corporate_roomtype_fees:
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = corporate_roomtype_fees.Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = corporate_roomtype_fees.fee
#                                         else:
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = None
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = None
                                            
                                            
                                            
                                    
                                
                            
#                 return JsonResponse(doctor_data, safe=False)
            
#         except Exception as e:
#             return JsonResponse({'error': str(e)})




# @csrf_exempt
# @require_http_methods(['GET'])
# def Overall_services_link(request):
#     if request.method == 'GET':
#         try:
#             Doctor_ins = Doctor_Personal_Form_Detials.objects.all()
#             doctors_data = []

#             for doc in Doctor_ins:
#                 doc_specs = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.Doctor_ID)
#                 ratecard = Doctor_Ratecard_Master.objects.filter(Doctor_ID=doc).first()
#                 if not ratecard:
#                     continue

#                 room_fees = RoomTypeFee.objects.filter(doctor_ratecard=ratecard)
#                 client_fees = ClientFee.objects.filter(doctor_ratecard=ratecard)
#                 corporate_fees = CorporateFee.objects.filter(doctor_ratecard=ratecard)
#                 insurance_fees = InsuranceFee.objects.filter(doctor_ratecard=ratecard)

#                 doctor_data = {
#                     'id': doc.Doctor_ID,
#                     'Service': "Consultation",
#                     'doctor_name': f"{doc.Tittle.Title_Name}.{doc.First_Name} {doc.Middle_Name} {doc.Last_Name}",
#                     'Specialization': doc_specs.Specialization.Speciality_Name,
#                     'Status': 'Active' if doc.Status else 'Inactive',
#                     'Roomtypes': [],
#                     'Contribution': [
#                         {
#                             'id': 1,
#                             'isrowgroup': False,
#                             'RatecardType': 'Doctor_Contribution_OP',
#                             'RatecardShow': 'Doctor Contribution_OP',
#                             'RatecardName': None,
#                             'doctor_ratecard_id': ratecard.RateCard_Id,
#                             'doctor_contribution_OP': ratecard.Doctor_Contribution_OP,
#                         },
#                         {
#                             'id': 2,
#                             'isrowgroup': False,
#                             'RatecardType': 'Doctor_Contribution_IP',
#                             'RatecardShow': 'Doctor Contribution_IP',
#                             'RatecardName': None,
#                             'doctor_ratecard_id': ratecard.RateCard_Id,
#                             'doctor_contribution_IP': ratecard.Doctor_Contribution_IP,
#                         }
#                     ],
#                     'Ratecarddetails': {
#                         'OP': [
#                             {
#                                 'RatecardType': 'General',
#                                 'RatecardShow': 'General',
#                                 'RatecardName': None,
#                                 'consultation_Prev_fee': ratecard.General_Prev_Consultation_Fee,
#                                 'consultation_curr_fee': ratecard.General_Consultation_Fee,
#                                 'follow_up_Prev_fee': ratecard.General_Prev_Follow_Up_Fee,
#                                 'follow_up_curr_fee': ratecard.General_Follow_Up_Fee,
#                                 'emg_consultant_Prev_fee': ratecard.General_Prev_Emg_Consulting_Fee,
#                                 'emg_consultant_curr_fee': ratecard.General_Emg_Consulting_Fee,
#                             },
#                             {
#                                 'RatecardType': 'Special',
#                                 'RatecardShow': 'Special',
#                                 'RatecardName': None,
#                                 'consultation_Prev_fee': ratecard.Special_Prev_Consultation_Fee,
#                                 'consultation_curr_fee': ratecard.Special_Consultation_Fee,
#                                 'follow_up_Prev_fee': ratecard.Special_Prev_Follow_Up_Fee,
#                                 'follow_up_curr_fee': ratecard.Special_Follow_Up_Fee,
#                                 'emg_consultant_Prev_fee': ratecard.Special_Prev_Emg_Consulting_Fee,
#                                 'emg_consultant_curr_fee': ratecard.Special_Emg_Consulting_Fee,
#                             }
#                         ],
#                         'IP': []
#                     },
#                     'InsuranceDetails': [],
#                     'ClientDetails': [],
#                     'CorporateDetails': []
#                 }

#                 # Add insurance fees to InsuranceDetails
#                 for insurance_fee in insurance_fees:
#                     doctor_data['InsuranceDetails'].append({
#                         'id': len(doctor_data['InsuranceDetails']) + 1,
#                         'RatecardName': insurance_fee.insurance.Insurance_Name,
#                         'Ratecardid': insurance_fee.insurance.Insurance_Id,
#                         'consultation_Prev_fee': insurance_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': insurance_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': insurance_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': insurance_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': insurance_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': insurance_fee.Emg_Consulting_Fee,
#                     })

#                 # Add client fees to ClientDetails
#                 for client_fee in client_fees:
#                     doctor_data['ClientDetails'].append({
#                         'id': len(doctor_data['ClientDetails']) + 1,
#                         'RatecardName': client_fee.client.Client_Name,
#                         'Ratecardid': client_fee.client.Client_Id,
#                         'consultation_Prev_fee': client_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': client_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': client_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': client_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': client_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': client_fee.Emg_Consulting_Fee,
#                     })

#                 # Add corporate fees to CorporateDetails
#                 for corporate_fee in corporate_fees:
#                     doctor_data['CorporateDetails'].append({
#                         'id': len(doctor_data['CorporateDetails']) + 1,
#                         'RatecardName': corporate_fee.corporate.Corporate_Name,
#                         'Ratecardid': corporate_fee.corporate.Corporate_Id,
#                         'consultation_Prev_fee': corporate_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': corporate_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': corporate_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': corporate_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': corporate_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': corporate_fee.Emg_Consulting_Fee,
#                     })

#                 # Add room fees
#                 for room_fee in room_fees:
#                     room_name = f"""{room_fee.room_type.Floor_Name.Floor_Name}-{room_fee.room_type.Ward_Name.Ward_Name}-{room_fee.room_type.RoomNo}"""
#                     room_id = room_fee.room_type.Room_Id
#                     if {'id': room_id, 'name': room_name} not in doctor_data['Roomtypes']:
#                         doctor_data['Roomtypes'].append({'id': room_id, 'name': room_name})

#                 # doctors_data.append(doctor_data)

#                 doctor_data['Ratecarddetails']['IP'] = [
#                     {
#                         'RatecardType': 'General',
#                         'RatecardShow': 'General',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': ratecard.General_Prev_Consultation_Fee,
#                         'consultation_curr_fee': ratecard.General_Consultation_Fee,
#                         'follow_up_Prev_fee': ratecard.General_Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': ratecard.General_Follow_Up_Fee,
#                     },
#                     {
#                         'RatecardType': 'Special',
#                         'RatecardShow': 'Special',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': ratecard.Special_Prev_Consultation_Fee,
#                         'consultation_curr_fee': ratecard.Special_Consultation_Fee,
#                         'follow_up_Prev_fee': ratecard.Special_Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': ratecard.Special_Follow_Up_Fee,
#                     }
#                 ]

#                 # Process room fees for each ratecard type
#                 for ratecard_type, ratecard_list in doctor_data['Ratecarddetails'].items():
#                     for dat in ratecard_list:
#                         if ratecard_type == 'IP':
#                                     for room_fee in room_fees:
#                                         room_name = f"""{room_fee.room_type.Floor_Name.Floor_Name}-{room_fee.room_type.Ward_Name.Ward_Name}-{room_fee.room_type.RoomNo}"""
#                                         room_id = room_fee.room_type.Room_Id
#                                         if dat['RatecardType'] == 'General':
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = room_fee.General_Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = room_fee.General_fee
#                                         elif dat['RatecardType'] == 'Special':
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = room_fee.Special_Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = room_fee.Special_fee
#                 # Append the doctor_data to doctors_data list
#                 doctors_data.append(doctor_data)
#             return JsonResponse(doctors_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(['GET'])
# def Overall_services_link(request):
#     if request.method == 'GET':
#         try:
#             Doctor_ins = Doctor_Personal_Form_Detials.objects.all()
#             doctors_data = []
 
#             for doc in Doctor_ins:
#                 doc_specs = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc.Doctor_ID)
#                 ratecard = Doctor_Ratecard_Master.objects.filter(Doctor_ID=doc).first()
#                 if not ratecard:
#                     continue
 
#                 room_fees = RoomTypeFee.objects.filter(doctor_ratecard=ratecard)
#                 client_fees = ClientFee.objects.filter(doctor_ratecard=ratecard)
#                 corporate_fees = CorporateFee.objects.filter(doctor_ratecard=ratecard)
#                 insurance_fees = InsuranceFee.objects.filter(doctor_ratecard=ratecard)
 
#                 doctor_data = {
#                     'id': doc.Doctor_ID,
#                     'Service': "Consultation",
#                     'doctor_name': f"{doc.Tittle.Title_Name}.{doc.First_Name} {doc.Middle_Name} {doc.Last_Name}",
#                     'Specialization': doc_specs.Specialization.Speciality_Name,
#                     'Status': 'Active' if doc.Status else 'Inactive',
#                     'Roomtypes': [],
#                     'Contribution': [
#                         {
#                             'id': 1,
#                             'isrowgroup': False,
#                             'RatecardType': 'Doctor_Contribution_OP',
#                             'RatecardShow': 'Doctor Contribution_OP',
#                             'RatecardName': None,
#                             'doctor_ratecard_id': ratecard.RateCard_Id,
#                             'doctor_contribution_OP': ratecard.Doctor_Contribution_OP,
#                         },
#                         {
#                             'id': 2,
#                             'isrowgroup': False,
#                             'RatecardType': 'Doctor_Contribution_IP',
#                             'RatecardShow': 'Doctor Contribution_IP',
#                             'RatecardName': None,
#                             'doctor_ratecard_id': ratecard.RateCard_Id,
#                             'doctor_contribution_IP': ratecard.Doctor_Contribution_IP,
#                         }
#                     ],
#                     'Ratecarddetails': {
#                         'OP': [
#                             {
#                                 'RatecardType': 'General',
#                                 'RatecardShow': 'General',
#                                 'RatecardName': None,
#                                 'consultation_Prev_fee': ratecard.General_Prev_Consultation_Fee,
#                                 'consultation_curr_fee': ratecard.General_Consultation_Fee,
#                                 'follow_up_Prev_fee': ratecard.General_Prev_Follow_Up_Fee,
#                                 'follow_up_curr_fee': ratecard.General_Follow_Up_Fee,
#                                 'emg_consultant_Prev_fee': ratecard.General_Prev_Emg_Consulting_Fee,
#                                 'emg_consultant_curr_fee': ratecard.General_Emg_Consulting_Fee,
#                             },
#                             {
#                                 'RatecardType': 'Special',
#                                 'RatecardShow': 'Special',
#                                 'RatecardName': None,
#                                 'consultation_Prev_fee': ratecard.Special_Prev_Consultation_Fee,
#                                 'consultation_curr_fee': ratecard.Special_Consultation_Fee,
#                                 'follow_up_Prev_fee': ratecard.Special_Prev_Follow_Up_Fee,
#                                 'follow_up_curr_fee': ratecard.Special_Follow_Up_Fee,
#                                 'emg_consultant_Prev_fee': ratecard.Special_Prev_Emg_Consulting_Fee,
#                                 'emg_consultant_curr_fee': ratecard.Special_Emg_Consulting_Fee,
#                             }
#                         ],
#                         'IP': []
#                     },
#                     'InsuranceDetails': [],
#                     'ClientDetails': [],
#                     'CorporateDetails': []
#                 }
 
#                 # Add insurance fees to InsuranceDetails
#                 for insurance_fee in insurance_fees:
#                     doctor_data['InsuranceDetails'].append({
#                         'id': len(doctor_data['InsuranceDetails']) + 1,
#                         'RatecardName': insurance_fee.insurance.Insurance_Name,
#                         'Ratecardid': insurance_fee.insurance.Insurance_Id,
#                         'consultation_Prev_fee': insurance_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': insurance_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': insurance_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': insurance_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': insurance_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': insurance_fee.Emg_Consulting_Fee,
#                     })
 
#                 # Add client fees to ClientDetails
#                 for client_fee in client_fees:
#                     doctor_data['ClientDetails'].append({
#                         'id': len(doctor_data['ClientDetails']) + 1,
#                         'RatecardName': client_fee.client.Client_Name,
#                         'Ratecardid': client_fee.client.Client_Id,
#                         'consultation_Prev_fee': client_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': client_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': client_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': client_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': client_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': client_fee.Emg_Consulting_Fee,
#                     })
 
#                 # Add corporate fees to CorporateDetails
#                 for corporate_fee in corporate_fees:
#                     doctor_data['CorporateDetails'].append({
#                         'id': len(doctor_data['CorporateDetails']) + 1,
#                         'RatecardName': corporate_fee.corporate.Corporate_Name,
#                         'Ratecardid': corporate_fee.corporate.Corporate_Id,
#                         'consultation_Prev_fee': corporate_fee.Prev_Consultation_Fee,
#                         'consultation_curr_fee': corporate_fee.Consultation_Fee,
#                         'follow_up_Prev_fee': corporate_fee.Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': corporate_fee.Follow_Up_Fee,
#                         'emg_consultant_Prev_fee': corporate_fee.Prev_Emg_Consulting_Fee,
#                         'emg_consultant_curr_fee': corporate_fee.Emg_Consulting_Fee,
#                     })
 
#                 # Add room fees
#                 for room_fee in room_fees:
#                     room_name = f"""{room_fee.room_type.Floor_Name.Floor_Name}-{room_fee.room_type.Ward_Name.Ward_Name}"""
#                     room_id = room_fee.room_type.Room_Id
#                     if {'id': room_id, 'name': room_name} not in doctor_data['Roomtypes']:
#                         doctor_data['Roomtypes'].append({'id': room_id, 'name': room_name})
 
#                 # doctors_data.append(doctor_data)
 
#                 doctor_data['Ratecarddetails']['IP'] = [
#                     {
#                         'RatecardType': 'General',
#                         'RatecardShow': 'General',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': ratecard.General_Prev_Consultation_Fee,
#                         'consultation_curr_fee': ratecard.General_Consultation_Fee,
#                         'follow_up_Prev_fee': ratecard.General_Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': ratecard.General_Follow_Up_Fee,
#                     },
#                     {
#                         'RatecardType': 'Special',
#                         'RatecardShow': 'Special',
#                         'RatecardName': None,
#                         'consultation_Prev_fee': ratecard.Special_Prev_Consultation_Fee,
#                         'consultation_curr_fee': ratecard.Special_Consultation_Fee,
#                         'follow_up_Prev_fee': ratecard.Special_Prev_Follow_Up_Fee,
#                         'follow_up_curr_fee': ratecard.Special_Follow_Up_Fee,
#                     }
#                 ]
 
#                 # Process room fees for each ratecard type
#                 for ratecard_type, ratecard_list in doctor_data['Ratecarddetails'].items():
#                     for dat in ratecard_list:
#                         if ratecard_type == 'IP':
#                                     for room_fee in room_fees:
#                                         room_name = f"""{room_fee.room_type.Floor_Name.Floor_Name}-{room_fee.room_type.Ward_Name.Ward_Name}"""
#                                         room_id = room_fee.room_type.Room_Id
#                                         if dat['RatecardType'] == 'General':
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = room_fee.General_Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = room_fee.General_fee
#                                         elif dat['RatecardType'] == 'Special':
#                                             dat[f'{room_name}_{room_id}_prev_fee'] = room_fee.Special_Prev_fee
#                                             dat[f'{room_name}_{room_id}_curr_fee'] = room_fee.Special_fee
#                 # Append the doctor_data to doctors_data list
#                 doctors_data.append(doctor_data)
#             return JsonResponse(doctors_data, safe=False)
 
#         except Exception as e:
#             return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(['POST'])
# def UpdateRatecardDetails(request):
#     try:
#         data = json.loads(request.body)
#         print('Received data:', data)
        
#         for doctor in data:
#             doctor_id = doctor.get("doctor_id")
#             ratecard_details = doctor.get("Ratecarddetails", {})
#             contributions = doctor.get("Contribution", {})
#             insurance_details = doctor.get("InsuranceDetails", [])
#             client_details = doctor.get("ClientDetails", [])
#             corporate_details = doctor.get("CorporateDetails", [])

#             # Get the doctor's ratecard instance
#             doctor_ratecard = Doctor_Ratecard_Master.objects.get(Doctor_ID=doctor_id)
#             print('gvrhjerg',doctor_ratecard)

#             # Update OP Ratecard Details
#             if "OP" in ratecard_details:
#                 for ratecard in ratecard_details["OP"]:
#                     if ratecard.get("RatecardType") == "General":
#                         doctor_ratecard.General_Consultation_Fee = ratecard.get("consultation_curr_fee")
#                         doctor_ratecard.General_Follow_Up_Fee = ratecard.get("follow_up_curr_fee")
#                     elif ratecard.get("RatecardType") == "Special":
#                         doctor_ratecard.Special_Consultation_Fee = ratecard.get("consultation_curr_fee")
#                         doctor_ratecard.Special_Follow_Up_Fee = ratecard.get("follow_up_curr_fee")

#             # Update IP Room Fees
#             # Update IP Room Fees
#             if "IP" in ratecard_details and ratecard_details["IP"]:
#                 ip_data = ratecard_details["IP"][0]  # Get the first IP record
#                 for key, value in ip_data.items():
#                     # Only process keys that end with '_curr_fee'
#                     if key.endswith("_curr_fee"):
#                         room_key = key.replace("_curr_fee", "")
                        
#                         try:
#                             # Skip non-room related fields (e.g., 'consultation', 'follow_up')
#                             if room_key in ["consultation", "follow_up", "emg_consultant"]:
#                                 print(f"Skipping invalid room_key: {room_key}")
#                                 continue

#                             # Split the key using the "_" separator to extract floor_name-room_type-room_number_room_id
#                             parts = room_key.rsplit("_", 1)  # Split from the right to separate room_id
#                             print('artsssa',parts)
#                             # The last part should be the room_id
#                             room_id = parts[1]
#                             print('uhfbvrb',room_id)
#                             # The rest should be floor_name-room_type-room_number
#                             floor_room_part = parts[0]

#                             # Further split the floor_room_part using "-" to extract floor_name, room_type, and room_number
#                             floor_name, room_type, room_number = floor_room_part.split("-")
                            
#                             # Now you have: floor_name, room_type, room_number, room_id

#                         except ValueError:
#                             # Handle cases where the key doesn't follow the expected format
#                             print(f"Skipping invalid room_key: {room_key}")
#                             continue  # Skip this iteration if the key is not valid
                        
#                         print('vdusdhbjkefb')
#                         # Update or create room fee record
#                         room_fee = RoomTypeFee.objects.get(
#                             doctor_ratecard=doctor_ratecard,
#                             room_type__Room_Id=room_id
#                         )
#                         room_fee.General_fee = value
#                         room_fee.save()
#                         print('vsdhfkebkj')

#             # Update Doctor Contributions
#             if contributions:
#                 for contribution in contributions:
#                     doctor_ratecard.Doctor_Contribution_OP = contribution.get("doctor_contribution_OP", doctor_ratecard.Doctor_Contribution_OP)
#                     doctor_ratecard.Doctor_Contribution_IP = contribution.get("doctor_contribution_IP", doctor_ratecard.Doctor_Contribution_IP)
#                 doctor_ratecard.save()

#             # Update Insurance Details
#             for insurance in insurance_details:
#                 InsuranceFee.objects.filter(
#                     insurance__Insurance_Name=insurance.get("RatecardName"),
#                     doctor_ratecard__Doctor_ID=doctor_id
#                 ).update(
#                     Consultation_Fee=insurance.get("consultation_curr_fee")
#                 )

#             # Update Client Details
#             for client in client_details:
#                 ClientFee.objects.filter(
#                     client__Client_Id=client.get("Ratecardid"),
#                     doctor_ratecard__Doctor_ID=doctor_id
#                 ).update(
#                     Consultation_Fee=client.get("consultation_curr_fee")
#                 )

#             # Update Corporate Details
#             for corporate in corporate_details:
#                 CorporateFee.objects.filter(
#                     corporate__Corporate_Id=corporate.get("Ratecardid"),
#                     doctor_ratecard__Doctor_ID=doctor_id
#                 ).update(
#                     Consultation_Fee=corporate.get("consultation_curr_fee")
#                 )

#         return JsonResponse({"success": "Ratecard details updated successfully"})    
#     except Doctor_Ratecard_Master.DoesNotExist:
#         return JsonResponse({"error": "Doctor ratecard not found"}, status=404)
#     except Exception as e:
#         print("Error updating ratecard:", str(e))
#         return JsonResponse({"error": str(e)}, status=500)
    
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import  Q, Sum
 
@method_decorator(csrf_exempt,name='dispatch')
class Get_Lab_Ratecard_Details(View):
 
    def post(self,request):
        try:
            data = json.loads(request.body)
            print("Received Lab Ratecard Data:", data)
 
            for test in data:
                test_id = test.get("Test_Id")
                test_cost = test.get("Test_Cost")
                CGHSCode = test.get("CGHSCode")
 
                # Update the base test cost
                Testmaster_Cost_List.objects.filter(Test_Id=test_id).update(Basic=test_cost,CGHS_CODE=CGHSCode)
 
                # Update Insurance Details
                for insurance in test.get("InsuranceDetails", []):
                    InsuranceFeeLab.objects.filter(
                        Lab_Test_Id=test_id,
                        insurance=insurance["RatecardId"],
                    ).update(
                        Cur_Test_Fee=insurance["Test_Curr_Fee"]
                    )
 
                # Update Client Details
                for client in test.get("ClientDetails", []):
                    ClientFeeLab.objects.filter(
                        Lab_Test_Id=test_id,
                        client=client["RatecardId"],
                    ).update(
                        Cur_Test_Fee=client["Test_Curr_Fee"]
                    )
 
                # Update Discount Details
                for discount in test.get("DiscountDetails", []):
                    DiscountFeeLab.objects.filter(
                        discount=discount["RatecardId"],
                        Lab_Test_Id=test_id
                    ).update(
                        Cur_Test_Fee=discount["Test_Curr_Fee"],
                        discount_method=discount["RatecardType"]
                    )
 
                contribution_field_mapping = {
                    "Inhouse_Contribution": ("Inhouse_Doctor_Con", "Inhouse_Doctor_contribution"),
                    "Referral_Contribution": ("Referral_Doctor_Con", "Referral_Doctor_contribution"),
                    "Visiting_Contribution": ("Visiting_Doctor_Con", "Visiting_Doctor_contribution"),
                }
 
                for contribution in test.get("Contribution", []):
                    ratecard_type = contribution.get("RatecardType")
                    if ratecard_type in contribution_field_mapping:
                        model_field, input_key = contribution_field_mapping[ratecard_type]
                        value = contribution.get(input_key)
 
                        if value is not None:
                            Testmaster_Cost_List.objects.filter(Test_Id=test_id).update(**{model_field: value})
 
 
            return JsonResponse({"success": "Lab ratecard updated successfully"})
       
        except Exception as e:
            print("Error updating lab ratecard:", str(e))
            return JsonResponse({"error": str(e)}, status=500)
 
    def get(self, request):
 
        LabsearchTerm = request.GET.get('LabsearchTerm', '').strip()
 
        if LabsearchTerm:
            test_ins = Testmaster_Cost_List.objects.filter(
                Q(Test_Code__Test_Code__icontains=LabsearchTerm) |
                Q(Test_Code__Test_Name__icontains=LabsearchTerm) |
                Q(Group_Code__Group_Code__icontains=LabsearchTerm) |
                Q(Group_Code__Group_Name__icontains=LabsearchTerm) |
                Q(Package_Code__package_code__icontains=LabsearchTerm) |
                Q(Package_Code__package_name__icontains=LabsearchTerm)
            )
        else:
            test_ins = Testmaster_Cost_List.objects.all()[:10]
 
 
 
 
        print(len(test_ins),'test_ins')
        lab_test_data = []
        for test in test_ins:
            try:
                print('uvhferg', test)
                insurance_fees = InsuranceFeeLab.objects.filter(Lab_Test_Id=test)
                client_fees = ClientFeeLab.objects.filter(Lab_Test_Id=test)
                discount_ins = DiscountFeeLab.objects.filter(Lab_Test_Id=test)
                print('uvdjhbvfrb', insurance_fees)
                print('yubdfbgbt', client_fees)
               
                # Safely access related fields to avoid DoesNotExist
                test_code_val = None
                test_name = None
                if test.Test_Code_id:  # Check if FK id is set before accessing
                    try:
                        test_code_obj = test.Test_Code
                        test_code_val = test_code_obj.Test_Code
                        test_name = test_code_obj.Test_Name
                    except ObjectDoesNotExist:
                        print(f"Test_Code for test {test.Test_Id} does not exist")
                        test_code_val = None
                        test_name = None
               
                if test.Group_Code_id:
                    try:
                        group_obj = test.Group_Code
                        if not test_code_val:
                            test_code_val = group_obj.Group_Code
                        if not test_name:
                            test_name = group_obj.Group_Name
                    except ObjectDoesNotExist:
                        print(f"Group_Code for test {test.Test_Id} does not exist")
               
                if test.Package_Code_id:
                    try:
                        package_obj = test.Package_Code
                        if not test_code_val:
                            test_code_val = package_obj.package_code
                        if not test_name:
                            test_name = package_obj.package_name
                    except ObjectDoesNotExist:
                        print(f"Package_Code for test {test.Test_Id} does not exist")
               
                lab_data = {
                    'id': test.Test_Id,
                    'Service': 'Lab',
                    'CGHSCode' : test.CGHS_CODE,
                    'Test_Code': test_code_val or test.Group_Code.Group_Code if test.Group_Code else test.Package_Code.package_code if test.Package_Code else None,
                    'Test_Name': test_name or (
                        test.Group_Code.Group_Name if test.Group_Code else
                        test.Package_Code.package_name if test.Package_Code else None
                    ),
                    'Test_Cost': test.Basic,
                    'Contribution': [
                        {
                            'id': 1,
                            'RatecardType': 'Inhouse_Contribution',
                            'RatecardShow': 'Inhouse_Contribution',
                            'Test_Ratecard': test.Test_Id,
                            'Inhouse_Doctor_contribution': test.Inhouse_Doctor_Con,
                        },
                        {
                            'id': 2,
                            'RatecardType': 'Referral_Contribution',
                            'RatecardShow': 'Referral_Contribution',
                            'Test_Ratecard': test.Test_Id,
                            'Referral_Doctor_contribution': test.Referral_Doctor_Con,
                        },
                        {
                            'id': 3,
                            'RatecardType': 'Visiting_Contribution',
                            'RatecardShow': 'Visiting_Contribution',
                            'Test_Ratecard': test.Test_Id,
                            'Visiting_Doctor_contribution': test.Visiting_Doctor_Con,
                        },
                    ],
                    'InsuranceDetails': [],
                    'ClientDetails': [],
                    'CorporateDetails': [],
                    'DiscountDetails': [],
                }
 
                for insurance in insurance_fees:
                    try:
                        lab_data['InsuranceDetails'].append({
                            'id': len(lab_data['InsuranceDetails']) + 1,
                            'RatecardName': insurance.insurance.Insurance_Name,
                            'RatecardId': insurance.insurance.Insurance_Id,
                            'Test_Prev_Fee': insurance.Prev_Test_Fee,
                            'Test_Curr_Fee': insurance.Cur_Test_Fee,
                        })
                    except ObjectDoesNotExist:
                        print(f"Invalid insurance for test {test.Test_Id}")
                        continue  # Skip this insurance entry
 
                for client in client_fees:
                    try:
                        lab_data['ClientDetails'].append({
                            'id': len(lab_data['ClientDetails']) + 1,
                            'RatecardName': client.client.Client_Name,
                            'RatecardId': client.client.Client_Id,
                            'Test_Prev_Fee': client.Prev_Test_Fee,
                            'Test_Curr_Fee': client.Cur_Test_Fee,
                        })
                    except ObjectDoesNotExist:
                        print(f"Invalid client for test {test.Test_Id}")
                        continue  # Skip this client entry
               
                for discount in discount_ins:
                    try:
                        lab_data['DiscountDetails'].append({
                            'id': len(lab_data['DiscountDetails']) + 1,
                            'RatecardId': discount.discount.Discount_ID,
                            'RatecardName': discount.discount.DiscountName,
                            'RatecardType': discount.discount_method,
                            'Test_Prev_Fee': discount.Prev_Test_Fee,
                            'Test_Curr_Fee': discount.Cur_Test_Fee,
                        })
                    except ObjectDoesNotExist:
                        print(f"Invalid discount for test {test.Test_Id}")
                        continue  # Skip this discount entry
 
                print('yugsubrgjer')
                lab_test_data.append(lab_data)
           
            except Exception as inner_e:
                print(f"Skipping test {getattr(test, 'Test_Id', 'unknown')} due to error: {str(inner_e)}")
                continue
       
        return JsonResponse(lab_test_data, safe=False)
 
 
 
 
 
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['GET'])
def Get_Ward_Ratecard_Details(request):
    if request.method == 'GET':
            try:
                wards = WardType_Master_Detials.objects.all()
                ward_data_list = []
                for ward in wards:
                    insurance_fees = Insurance_Ward_Fee.objects.filter(Ward_Ratecard=ward)
                    client_fees = Client_Ward_Fee.objects.filter(Ward_Ratecard=ward)
                    corporate_fees = Corporate_Ward_Fee.objects.filter(Ward_Ratecard=ward)
                    discount_fees = DiscountFeeRoom.objects.filter(Ward_Rate_Id=ward)
 
                    ward_data = {
                        'id': ward.Ward_Id,
                        'Service': 'Ward',
                        'Ward_Name': ward.Ward_Name,
                        'Ward_Type': ward.Type,
                        'Ward_Cost': float(ward.Amount),
                        'Is_AC': ward.isAC,
                        'Ac_Fee' : float(ward.Acamt),
                        'Non_Ac_Fee' : float(ward.NonACamt),
                       
                        'Location': ward.Location_Name.Location_Name if ward.Location_Name else None,
                        'Contribution': [
                            {
                                'id': 1,
                                'RatecardType': 'Inhouse_Doctor_Contribution',
                                'RatecardShow': 'Inhouse Doctor Contribution',
                                'Ward_Ratecard': ward.Ward_Id,
                                'Inhouse_Doctor_Contribution': float(ward.inhouse_Doctor_Contribution),
                            },
                            {
                                'id': 2,
                                'RatecardType': 'Visiting_Doctor_Contribution',
                                'RatecardShow': 'Visiting Doctor Contribution',
                                'Ward_Ratecard': ward.Ward_Id,
                                'Visiting_Doctor_Contribution': float(ward.visiting_Doctor_Contribution),
                            },
                            {
                                'id': 3,
                                'RatecardType': 'Referral_Doctor_Contribution',
                                'RatecardShow': 'Referral Doctor Contribution',
                                'Ward_Ratecard': ward.Ward_Id,
                                'Referral_Doctor_Contribution': float(ward.referal_Doctor_Contribution),
                            },
                        ],
                        'InsuranceDetails': [],
                        'ClientDetails': [],
                        'CorporateDetails': [],
                        'DiscountDetails': [],
                    }
 
                    for insurance in insurance_fees:
                        ward_data['InsuranceDetails'].append({
                            'id': len(ward_data['InsuranceDetails']) + 1,
                            'RatecardName': insurance.Insurance.Insurance_Name,
                            'RatecardId': insurance.Insurance.Insurance_Id,
                            'Prev_Fee': float(insurance.Prev_Fee),
                            'Curr_Fee': float(insurance.Fee),
                            'Prev_AC_Fee': float(insurance.Prev_AC_Fee),
                            'Curr_AC_Fee': float(insurance.AC_Fee),
                            'Prev_NAC_Fee': float(insurance.Prev_NAC_Fee),
                            'Curr_NAC_Fee': float(insurance.NAC_Fee),
                        })
 
                    for client in client_fees:
                        ward_data['ClientDetails'].append({
                            'id': len(ward_data['ClientDetails']) + 1,
                            'RatecardName': client.Client.Client_Name,
                            'RatecardId': client.Client.Client_Id,
                            'Prev_Fee': float(client.Prev_Fee),
                            'Curr_Fee': float(client.Fee),
                            'Prev_AC_Fee': float(client.Prev_AC_Fee),
                            'Curr_AC_Fee': float(client.AC_Fee),
                            'Prev_NAC_Fee': float(client.Prev_NAC_Fee),
                            'Curr_NAC_Fee': float(client.NAC_Fee),
                        })
 
                    for corporate in corporate_fees:
                        ward_data['CorporateDetails'].append({
                            'id': len(ward_data['CorporateDetails']) + 1,
                            'RatecardName': corporate.Corporate.Corporate_Name,
                            'RatecardId': corporate.Corporate.Corporate_Id,
                            'Prev_Fee': float(corporate.Prev_Fee),
                            'Curr_Fee': float(corporate.Fee),
                            'Prev_AC_Fee': float(corporate.Prev_AC_Fee),
                            'Curr_AC_Fee': float(corporate.AC_Fee),
                            'Prev_NAC_Fee': float(corporate.Prev_NAC_Fee),
                            'Curr_NAC_Fee': float(corporate.NAC_Fee),
                        })
 
                    for discount in discount_fees:
                        ward_data['DiscountDetails'].append({
                            'id': len(ward_data['DiscountDetails']) + 1,
                            'RatecardId': discount.discount.Discount_ID,
                            'RatecardName': discount.discount.DiscountName,
                            'RatecardType': discount.discount_method,
                            'Prev_Fee': float(discount.Prev_Fee),
                            'Curr_Fee': float(discount.Cur_Fee),
                            'Prev_AC_Fee': float(discount.Prev_AC_Fee),
                            'Curr_AC_Fee': float(discount.Cur_AC_Fee),
                            'Prev_NAC_Fee': float(discount.Prev_NON_AC_Fee),
                            'Curr_NAC_Fee': float(discount.Cur_NON_AC_Fee),
                        })
 
                    ward_data_list.append(ward_data)
 
                return JsonResponse(ward_data_list, safe=False)
 
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
           
 
@csrf_exempt
@require_http_methods(['POST'])
def Update_Ward_RateCard_Details(request):
 
        try:
            # Parse the JSON payload from the frontend
            payload = json.loads(request.body)
            logger.info("Received payload: %s", payload)
 
            for ward_data in payload:
                # Update WardType_Master_Detials
                try:
                    ward = WardType_Master_Detials.objects.get(Ward_Id=ward_data['Ward_Id'])
                   
                    # Update main ward fields
                    ward.Amount = float(ward_data.get('Ward_Cost', ward.Amount))
                    ward.Acamt = float(ward_data.get('Ac_Fee', ward.Acamt))
                    ward.NonACamt = float(ward_data.get('Non_Ac_Fee', ward.NonACamt))
                   
                    # Update contribution fields
                    for contribution in ward_data.get('Contribution', []):
                        logger.debug("Processing contribution: %s", contribution)
                        ratecard_type = contribution.get('RatecardType')
                        if ratecard_type == 'Inhouse_Doctor_Contribution':
                            ward.inhouse_Doctor_Contribution = float(contribution.get('Inhouse_Doctor_Contribution', ward.inhouse_Doctor_Contribution))
                            logger.info("Updated Inhouse_Doctor_Contribution to %s for Ward_Id %s", ward.inhouse_Doctor_Contribution, ward.Ward_Id)
                        elif ratecard_type == 'Visiting_Doctor_Contribution':
                            ward.visiting_Doctor_Contribution = float(contribution.get('Visiting_Doctor_Contribution', ward.visiting_Doctor_Contribution))
                            logger.info("Updated Visiting_Doctor_Contribution to %s for Ward_Id %s", ward.visiting_Doctor_Contribution, ward.Ward_Id)
                        elif ratecard_type == 'Referral_Doctor_Contribution':
                            ward.referal_Doctor_Contribution = float(contribution.get('Referral_Doctor_Contribution', ward.referal_Doctor_Contribution))
                            logger.info("Updated Referral_Doctor_Contribution to %s for Ward_Id %s", ward.referal_Doctor_Contribution, ward.Ward_Id)
                   
                    ward.save()
                    logger.info("Saved WardType_Master_Detials for Ward_Id %s", ward.Ward_Id)
                   
                    # Update Insurance_Ward_Fee
                    for ins_data in ward_data.get('InsuranceDetails', []):
                        try:
                            insurance_fee = Insurance_Ward_Fee.objects.get(
                                Ward_Ratecard=ward,
                                Insurance__Insurance_Id=ins_data['RatecardId']
                            )
                            insurance_fee.Prev_Fee = insurance_fee.Fee
                            insurance_fee.Fee = float(ins_data.get('Curr_Fee', insurance_fee.Fee))
                            insurance_fee.Prev_AC_Fee = insurance_fee.AC_Fee
                            insurance_fee.AC_Fee = float(ins_data.get('Curr_AC_Fee', insurance_fee.AC_Fee))
                            insurance_fee.Prev_NAC_Fee = insurance_fee.NAC_Fee
                            insurance_fee.NAC_Fee = float(ins_data.get('Curr_NAC_Fee', insurance_fee.NAC_Fee))
                            insurance_fee.save()
                            logger.info("Updated Insurance_Ward_Fee for Insurance_Id %s, Ward_Id %s", ins_data['RatecardId'], ward.Ward_Id)
                        except ObjectDoesNotExist:
                            Insurance_Ward_Fee.objects.create(
                                Ward_Ratecard=ward,
                                Insurance_id=ins_data['RatecardId'],
                                Prev_Fee=0,
                                Fee=float(ins_data.get('Curr_Fee', 0)),
                                Prev_AC_Fee=0,
                                AC_Fee=float(ins_data.get('Curr_AC_Fee', 0)),
                                Prev_NAC_Fee=0,
                                NAC_Fee=float(ins_data.get('Curr_NAC_Fee', 0))
                            )
                            logger.info("Created new Insurance_Ward_Fee for Insurance_Id %s, Ward_Id %s", ins_data['RatecardId'], ward.Ward_Id)
                   
                    # Update Client_Ward_Fee
                    for client_data in ward_data.get('ClientDetails', []):
                        try:
                            client_fee = Client_Ward_Fee.objects.get(
                                Ward_Ratecard=ward,
                                Client__Client_Id=client_data['RatecardId']
                            )
                            client_fee.Prev_Fee = client_fee.Fee
                            client_fee.Fee = float(client_data.get('Curr_Fee', client_fee.Fee))
                            client_fee.Prev_AC_Fee = client_fee.AC_Fee
                            client_fee.AC_Fee = float(client_data.get('Curr_AC_Fee', client_fee.AC_Fee))
                            client_fee.Prev_NAC_Fee = client_fee.NAC_Fee
                            client_fee.NAC_Fee = float(client_data.get('Curr_NAC_Fee', client_fee.NAC_Fee))
                            client_fee.save()
                            logger.info("Updated Client_Ward_Fee for Client_Id %s, Ward_Id %s", client_data['RatecardId'], ward.Ward_Id)
                        except ObjectDoesNotExist:
                            Client_Ward_Fee.objects.create(
                                Ward_Ratecard=ward,
                                Client_id=client_data['RatecardId'],
                                Prev_Fee=0,
                                Fee=float(client_data.get('Curr_Fee', 0)),
                                Prev_AC_Fee=0,
                                AC_Fee=float(client_data.get('Curr_AC_Fee', 0)),
                                Prev_NAC_Fee=0,
                                NAC_Fee=float(client_data.get('Curr_NAC_Fee', 0))
                            )
                            logger.info("Created new Client_Ward_Fee for Client_Id %s, Ward_Id %s", client_data['RatecardId'], ward.Ward_Id)
                   
                    # Update Corporate_Ward_Fee
                    for corp_data in ward_data.get('CorporateDetails', []):
                        try:
                            corporate_fee = Corporate_Ward_Fee.objects.get(
                                Ward_Ratecard=ward,
                                Corporate__Corporate_Id=corp_data['RatecardId']
                            )
                            corporate_fee.Prev_Fee = corporate_fee.Fee
                            corporate_fee.Fee = float(corp_data.get('Curr_Fee', corporate_fee.Fee))
                            corporate_fee.Prev_AC_Fee = corporate_fee.AC_Fee
                            corporate_fee.AC_Fee = float(corp_data.get('Curr_AC_Fee', corporate_fee.AC_Fee))
                            corporate_fee.Prev_NAC_Fee = corporate_fee.NAC_Fee
                            corporate_fee.NAC_Fee = float(corp_data.get('Curr_NAC_Fee', corporate_fee.NAC_Fee))
                            corporate_fee.save()
                            logger.info("Updated Corporate_Ward_Fee for Corporate_Id %s, Ward_Id %s", corp_data['RatecardId'], ward.Ward_Id)
                        except ObjectDoesNotExist:
                            Corporate_Ward_Fee.objects.create(
                                Ward_Ratecard=ward,
                                Corporate_id=corp_data['RatecardId'],
                                Prev_Fee=0,
                                Fee=float(corp_data.get('Curr_Fee', 0)),
                                Prev_AC_Fee=0,
                                AC_Fee=float(corp_data.get('Curr_AC_Fee', 0)),
                                Prev_NAC_Fee=0,
                                NAC_Fee=float(corp_data.get('Curr_NAC_Fee', 0))
                            )
                            logger.info("Created new Corporate_Ward_Fee for Corporate_Id %s, Ward_Id %s", corp_data['RatecardId'], ward.Ward_Id)
                   
                    # Update DiscountFeeRoom
                    for disc_data in ward_data.get('DiscountDetails', []):
                        try:
                            discount_fee = DiscountFeeRoom.objects.get(
                                Ward_Rate_Id=ward,
                                discount__Discount_ID=disc_data['RatecardId']
                            )
                            discount_fee.discount_method = disc_data.get('RatecardType', discount_fee.discount_method)
                            discount_fee.Prev_Fee = discount_fee.Cur_Fee
                            discount_fee.Cur_Fee = float(disc_data.get('Curr_Fee', discount_fee.Cur_Fee))
                            discount_fee.Prev_AC_Fee = discount_fee.Cur_AC_Fee
                            discount_fee.Cur_AC_Fee = float(disc_data.get('Curr_AC_Fee', discount_fee.Cur_AC_Fee))
                            discount_fee.Prev_NON_AC_Fee = discount_fee.Cur_NON_AC_Fee
                            discount_fee.Cur_NON_AC_Fee = float(disc_data.get('Curr_NAC_Fee', discount_fee.Cur_NON_AC_Fee))
                            discount_fee.save()
                            logger.info("Updated DiscountFeeRoom for Discount_Id %s, Ward_Id %s", disc_data['RatecardId'], ward.Ward_Id)
                        except ObjectDoesNotExist:
                            DiscountFeeRoom.objects.create(
                                Ward_Rate_Id=ward,
                                discount_id=disc_data['RatecardId'],
                                discount_method=disc_data.get('RatecardType', 'Value'),
                                Prev_Fee=0,
                                Cur_Fee=float(disc_data.get('Curr_Fee', 0)),
                                Prev_AC_Fee=0,
                                Cur_AC_Fee=float(disc_data.get('Curr_AC_Fee', 0)),
                                Prev_NON_AC_Fee=0,
                                Cur_NON_AC_Fee=float(disc_data.get('Curr_NAC_Fee', 0))
                            )
                            logger.info("Created new DiscountFeeRoom for Discount_Id %s, Ward_Id %s", disc_data['RatecardId'], ward.Ward_Id)
               
                except ObjectDoesNotExist:
                    logger.error("Ward with ID %s not found", ward_data['Ward_Id'])
                    return JsonResponse({'error': f'Ward with ID {ward_data["Ward_Id"]} not found'}, status=404)
           
            return JsonResponse({'success': 'Ward ratecard updated successfully'}, status=200)
       
        except Exception as e:
            logger.error("Error processing request: %s", str(e))
            return JsonResponse({'error': str(e)}, status=500)
 
 
 
 

