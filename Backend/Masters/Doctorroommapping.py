from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from datetime import datetime, timedelta
from Finance.models import *
# import magic
import filetype
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from .models import *
from Frontoffice.models import *
import base64 
# from winmagic import magic
import json

from Masters.models import * 
from datetime import datetime


@csrf_exempt
@require_http_methods(["GET"])
def get_All_DoctorNames_for_mapping(request):
 
    try:

        speciality = request.GET.get('speciality')

        doctor_personal_data = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality,Doctor_ID__DoctorType='InHouse')
      
        doctor_list = []
        for doctor_personal in doctor_personal_data:
            doctor_dict = {
                'id': doctor_personal.Doctor_ID.Doctor_ID,
                'Name': f'{doctor_personal.Doctor_ID.Tittle.Title_Name}.{doctor_personal.Doctor_ID.First_Name} {doctor_personal.Doctor_ID.Middle_Name} {doctor_personal.Doctor_ID.Last_Name}',
                'ShortName': f'{doctor_personal.Doctor_ID.Tittle.Title_Name}.{doctor_personal.Doctor_ID.ShortName}',
            }
            doctor_list.append(doctor_dict)
        return JsonResponse(doctor_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)},status=500)
   
@csrf_exempt
@require_http_methods(["GET"])
def get_counter_details_for_OPPatient(request):
 
    if request.method == 'GET':
 
        try:
 
            patientins = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose='OP',Bill_Status__in = ["Due","Paid"])
 
 
            counterlist = []
       
            for datas in patientins:
 
                if datas.PatientCategory == 'General':
 
                    if datas.Bill_Status == 'Due':
 
                        continue
 
                    else:
 
                        patientName = f"""{datas.PatientId.Title.Title_Name}.{datas.PatientId.FirstName}{datas.PatientId.MiddleName}{datas.PatientId.SurName}"""
                        patientId = datas.PatientId.PatientId
 
                        Registration_Id = datas.pk
 
                        doctorins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = Registration_Id)
 
                        for doc in doctorins:
 
                            print(doc.PrimaryDoctor.Doctor_ID)
       
                            countername = DoctorRoomMapping.objects.filter(DoctorID=doc.PrimaryDoctor.Doctor_ID,Status=True).first()
                            if countername:
                                datalist = {
           
                                    'patientName' : patientName,
                                    'patientId' : patientId,
                                    'visitType' : doc.VisitType,
                                    'speciality' : doc.Specialization.Speciality_Name,
                                    'doctorName' : f"""{doc.PrimaryDoctor.Tittle.Title_Name}.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}{doc.PrimaryDoctor.Last_Name}""",
                                    'counterNo' : countername.ConRoomID.Con_Room_Name,
                                    'OPNo':countername.ConRoomID.OPNo,
                                    'slotNo' : f"""{doc.AppointmentSlot_by_Doctor} / {doc.TokenNo}""",
                                }
                                counterlist.append(datalist)
       
                else:
                    patientName = f"""{datas.PatientId.Title.Title_Name}.{datas.PatientId.FirstName}{datas.PatientId.MiddleName}{datas.PatientId.SurName}"""
                    patientId = datas.PatientId.PatientId
 
                    Registration_Id = datas.pk
 
                    doctorins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = Registration_Id)
 
                    for doc in doctorins:
 
                        countername = DoctorRoomMapping.objects.filter(DoctorID=doc.PrimaryDoctor.Doctor_ID,Status=True).first()
                        if countername:
                            datalist = {
       
                                'patientName' : patientName,
                                'patientId' : patientId,
                                'visitType' : doc.VisitType,
                                'speciality' : doc.Specialization.Speciality_Name,
                                'doctorName' : f"""{doc.PrimaryDoctor.Tittle.Title_Name}.{doc.PrimaryDoctor.First_Name}{doc.PrimaryDoctor.Middle_Name}{doc.PrimaryDoctor.Last_Name}""",
                                'counterNo' : countername.ConRoomID.Con_Room_Name,
                                'slotNo' : f"""{doc.AppointmentSlot_by_Doctor} / {doc.TokenNo}""",
                            }
                            counterlist.append(datalist)
 
 
            for idx, patient in enumerate(counterlist, start=1):
                      patient["sno"] = idx
 
            return JsonResponse(counterlist,safe=False)
 
 
        except Exception as e:
            return JsonResponse({'error': str(e)},status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Doctor_Room_Mapping_Details(request):
 
    try:
 
        if request.method == 'POST':
 
            try:
 
                data = json.loads(request.body)
                print(data,'data')
 
                Specialization = data.get('Specialization')
                Doctor = data.get('Doctor','')
                Counter = data.get('Counter','')
                mapid = data.get('mapid','')
                Created_by = data.get('Created_by','')
                statusedit = data.get('statusedit','')
                FromCounter = data.get('FromCounter','')
                ToCounter = data.get('ToCounter','')
 
               
                if mapid:
                   
                   if statusedit:
                       counterdata = DoctorRoomMapping.objects.get(pk=mapid)
                       counterdata.Status = not  counterdata.Status
                       counterdata.save()
 
                       return JsonResponse({'success': 'Status Updated successfully'})                
 
                   else:
                       
                         Doctorins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = Doctor).first()
                         fcounterins = Consultaion_Room_Master_Details.objects.filter(Con_Room_Id = FromCounter).first()
                         tcounterins = Consultaion_Room_Master_Details.objects.filter(Con_Room_Id = ToCounter).first()

                         Speciality_instance = Speciality_Detials.objects.get(Speciality_Id=Specialization)

                         print(fcounterins,'fcounterins')
                         print(tcounterins,'tcounterins')

 
                         counterdata = DoctorRoomMapping.objects.get(pk=mapid,ConRoomID=fcounterins)
 
                         counterdata.DoctorID = Doctorins
                         counterdata.ConRoomID = tcounterins
                         counterdata.Speciality = Speciality_instance
                         counterdata.created_by = Created_by
                         counterdata.save()
 
                         return JsonResponse({'success': 'Mapping Updated successfully'})
 
                else:
 
                     Doctorins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = Doctor).first()
                     counterins = Consultaion_Room_Master_Details.objects.filter(Con_Room_Id = Counter).first()
                     Speciality_instance = Speciality_Detials.objects.get(Speciality_Id=Specialization)

                     existsdata = DoctorRoomMapping.objects.filter(DoctorID = Doctorins).first()

                     if existsdata:
                         
                         return JsonResponse({'warn': f"""Dr.{Doctorins.First_Name} Already Mapped Into {existsdata.ConRoomID.Con_Room_Name} Room"""})

 
                     counterdata = DoctorRoomMapping(
   
                        DoctorID = Doctorins,
                        ConRoomID = counterins,
                        Speciality = Speciality_instance,
                        created_by = Created_by,
                       )
   
                     counterdata.save()
   
                     return JsonResponse({'success': 'Mapping added successfully'})
           
            except Exception as e:
                return JsonResponse({'error': str(e)})
 
 
        if request.method == 'GET':
 
            try:
 
                mappeddata = DoctorRoomMapping.objects.all()
                mappeddatalist = []
 
                for datas in mappeddata:
                    datalist = {
                        'id' : datas.pk,
                        'DoctorID' : datas.DoctorID.Doctor_ID if datas.DoctorID else None,
                        'DoctorName' : f'{datas.DoctorID.Tittle.Title_Name}.{datas.DoctorID.First_Name} {datas.DoctorID.Middle_Name} {datas.DoctorID.Last_Name}' if datas.DoctorID else None,
                        'ConRoomID' : datas.ConRoomID.Con_Room_Id if datas.ConRoomID else None,
                        'OPNo': datas.ConRoomID.OPNo if datas.ConRoomID else None,
                        'countername' : datas.ConRoomID.Con_Room_Name if datas.ConRoomID else None,
                        'Speciality': datas.Speciality.Speciality_Id if datas.Speciality else None,
                        'SpecialityName': datas.Speciality.Speciality_Name if datas.Speciality else None,

                        'Status' : 'Active' if datas.Status else 'InActive',
                       
                    }
                    mappeddatalist.append(datalist)
 
                for idx, patient in enumerate(mappeddatalist, start=1):
                      patient["sno"] = idx
 
                return JsonResponse(mappeddatalist,safe=False)
   
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Consultation_Room_Details_link_by_Speciality(request):
    
    if request.method == 'GET':
        try:

            speciality = request.GET.get('speciality')

            Consultation_Room_Master = Consultaion_Room_Master_Details.objects.filter(Speciality = speciality)
            print("Administration_Master",Consultation_Room_Master)
            Consultation_Room_Master_Data = []
            for consultation in Consultation_Room_Master:
                consultation_dict = {
                    'id': consultation.Con_Room_Id,
                    'ConsultationroomName':consultation.Con_Room_Name,
                    'FloorId': consultation.Floor_Name.Floor_Id,
                    'FloorName': consultation.Floor_Name.Floor_Name,
                    'BlockId': consultation.Block_Name.Block_Id,
                    'BlockName': consultation.Block_Name.Block_Name,
                    'BuildingId': consultation.Building_Name.Building_Id,
                    'BuildingName': consultation.Building_Name.Building_Name,
                    'Location_Name': consultation.Location_Name.Location_Name,
                    'Location_Id': consultation.Location_Name.Location_Id,
                    'SpecialityId':consultation.Speciality.Speciality_Id,
                    'SpecialityName':consultation.Speciality.Speciality_Name,
                    'OPNo':consultation.OPNo,
                    'Status': 'Active' if consultation.Status else 'Inactive',
                    'created_by': consultation.created_by,
                }
                Consultation_Room_Master_Data.append(consultation_dict)
            return JsonResponse(Consultation_Room_Master_Data, safe=False)
 
       
        except Exception as e:
            return JsonResponse({'error' : 'An internal server error occurred'}, status=500)
 




















