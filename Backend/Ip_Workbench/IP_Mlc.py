from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils.timezone import now

@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_Mlc_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'data')
            RegistrationId = data.get("RegistrationId")
            MlcNo = data.get('MlcNo','')
            ExaminationDate = data.get('ExaminationDate')
            ExaminationTime = data.get('ExaminationTime')
            ExaminationBy = data.get('ExaminationBy')
            IdentificationMarkOne = data.get('IdentificationMarkOne')
            IdentificationMarkTwo = data.get('IdentificationMarkTwo')
            InformedBroughtBy = data.get('InformedBroughtBy')
            EventPlace = data.get('EventPlace')
            EventLocation = data.get('EventLocation')
            InjuryType = data.get('InjuryType')
            InjuryDetails = data.get('InjuryDetails')
            PoliceStationName = data.get('PoliceStationName')
            FirStatus = data.get('FirStatus')
            FirNo = data.get('FirNo')
            MlcSendTime = data.get('MlcSendTime')
            MlcCopyReceiveTime = data.get('MlcCopyReceiveTime')
            ReceivedBy = data.get('ReceivedBy')
            Narration = data.get('Narration')
            Investigation = data.get('Investigation')
            InvestigationDetails = data.get('InvestigationDetails')
            FinalDiagnosis = data.get('FinalDiagnosis')
            Type = data.get('Type')
            Remarks = data.get('Remarks')
            DepartmentType = data.get("DepartmentType")
            createdby = data.get("Createdby")
            #registration_ins=None


            registration_ins_ip = None
            registration_ins_casuality = None
            
            if RegistrationId:
                # Try to get from IP Registration first
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                        print("Found in Casuality Registration")
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'error': 'No registration found for the given RegistrationId'})

            else:
                return JsonResponse({'error': 'RegistrationId is required'})

            
            Mlc_instance = IP_Mlc_Details(
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
                Mlc_No=MlcNo,
                ExaminationDate=ExaminationDate,
                ExaminationTime=ExaminationTime,
                ExaminationBy=ExaminationBy,
                IdentificationMarkOne=IdentificationMarkOne,
                IdentificationMarkTwo=IdentificationMarkTwo,
                InformedBroughtBy=InformedBroughtBy,
                EventPlace=EventPlace,
                EventLocation=EventLocation,
                InjuryType=InjuryType,
                InjuryDetails=InjuryDetails,
                PoliceStationName=PoliceStationName,
                FirStatus=FirStatus,
                FirNo=FirNo,
                MlcSendTime=MlcSendTime,
                MlcCopyReceiveTime=MlcCopyReceiveTime,
                ReceivedBy=ReceivedBy,
                Narration=Narration,
                Investigation=Investigation,
                InvestigationDetails=InvestigationDetails,
                FinalDiagnosis=FinalDiagnosis,
                Type=Type,
                Remarks=Remarks,
                DepartmentType=DepartmentType,
                Created_by=createdby
            )
            Mlc_instance.save()
            
            return JsonResponse({'success': 'Mlc saved successfully'})
        except Exception as e:
            print(f"An error occured: {str(e)}")
            return JsonResponse({'error': 'An internal server error occured'}, status = 500)
        
    elif request.method == 'GET':
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')

            if DepartmentType=='IP':
                Mlc_Details = IP_Mlc_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            else:
                Mlc_Details = IP_Mlc_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            

            
            Mlc_Details_data =[]
            for idx,Mlc in enumerate(Mlc_Details, start=1):
                ip_registration = Mlc.Ip_Registration_Id
                casuality_registration = Mlc.Casuality_Registration_Id
                
                Mlc_dict = {
                    'id' : idx,
                    # 'RegistrationId': Mlc.Ip_Registration_Id.pk if Mlc.Ip_Registration_Id else Mlc.Casuality_Registration_Id.pk,
                    # 'VisitId': Mlc.Ip_Registration_Id.VisitId if Mlc.Ip_Registration_Id else Mlc.Casuality_Registration_Id.VisitId,
                    # 'PrimaryDoctorId': Mlc.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Mlc.Ip_Registration_Id else Mlc.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID,
                    # 'PrimaryDoctorName': Mlc.Ip_Registration_Id.PrimaryDoctor.ShortName if Mlc.Ip_Registration_Id else Mlc.Casuality_Registration_Id.PrimaryDoctor.ShortName,
                    'RegistrationId': ip_registration.pk if ip_registration else casuality_registration.pk if casuality_registration else None,
                    'PrimaryDoctorId': (
                        ip_registration.PrimaryDoctor.Doctor_ID if ip_registration and ip_registration.PrimaryDoctor 
                        else casuality_registration.PrimaryDoctor.Doctor_ID if casuality_registration and casuality_registration.PrimaryDoctor 
                        else None
                    ),
                    'PrimaryDoctorName': (
                        ip_registration.PrimaryDoctor.ShortName if ip_registration and ip_registration.PrimaryDoctor 
                        else casuality_registration.PrimaryDoctor.ShortName if casuality_registration and casuality_registration.PrimaryDoctor 
                        else None
                    ),
                    
                    'MlcNo': Mlc.Mlc_No,
                    'ExaminationDate': Mlc.ExaminationDate,
                    'ExaminationTime': Mlc.ExaminationTime,
                    'ExaminationBy': Mlc.ExaminationBy,
                    'IdentificationMarkOne': Mlc.IdentificationMarkOne,
                    'IdentificationMarkTwo': Mlc.IdentificationMarkTwo,
                    'InformedBroughtBy': Mlc.InformedBroughtBy,
                    'EventPlace': Mlc.EventPlace,
                    'EventLocation': Mlc.EventLocation,
                    'InjuryType': Mlc.InjuryType,
                    'InjuryDetails': Mlc.InjuryDetails,
                    'PoliceStationName': Mlc.PoliceStationName,
                    'FirStatus': Mlc.FirStatus,
                    'FirNo': Mlc.FirNo,
                    'MlcSendTime': Mlc.MlcSendTime,
                    'MlcCopyReceiveTime': Mlc.MlcCopyReceiveTime,
                    'ReceivedBy': Mlc.ReceivedBy,
                    'Narration': Mlc.Narration,
                    'Investigation': Mlc.Investigation,
                    'InvestigationDetails': Mlc.InvestigationDetails,
                    'FinalDiagnosis': Mlc.FinalDiagnosis,
                    'Type': Mlc.Type,
                    'Remarks': Mlc.Remarks,
                    'DepartmentType': Mlc.DepartmentType,
                    'Createdby' : Mlc.Created_by,
                    'Date': Mlc.created_at.strftime('%d-%m-%y'), 
                    'Time' : Mlc.created_at.strftime('%H:%M:%S'),
                }
                Mlc_Details_data.append(Mlc_dict)

            return JsonResponse(Mlc_Details_data,safe=False)
        
        except Exception as e:
            print(f"An error occured: {str(e)}")
            return JsonResponse({'error': 'An internal server error occured'}, status = 500)





