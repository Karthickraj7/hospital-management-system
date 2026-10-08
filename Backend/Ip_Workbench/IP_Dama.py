from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *


@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_Dama_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data,'data')
            RegistrationId = data.get("RegistrationId")
            Type = data.get("Type")
            PatientExitType = data.get('PatientExitType')
            Reasons = data.get('Reasons')
            Date = data.get('Date')
            Time = data.get('Time')
            Remarks = data.get('Remarks')
            createdby = data.get("Createdby")
            DepartmentType = data.get("DepartmentType")

            registration_ins_ip = None
            registration_ins_casuality = None
            
            if RegistrationId:
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                        print(registration_ins_casuality,'registration_ins_casuality')
                        print("Found in Casuality Registration")
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'error': 'No registration found for the given RegistrationId'})

            else:
                return JsonResponse({'error': 'RegistrationId is required'})

            # Save Damaa details
            Dama_instance = IP_Dama_Details(
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
                Type=Type,
                PatientExitType=PatientExitType,
                Reasons=Reasons,
                DamaDate=Date,
                Time=Time,
                Remarks=Remarks,
                DepartmentType=DepartmentType,
                Created_by=createdby,
            )
            Dama_instance.save()
            
            return JsonResponse({'success': 'DAMA details saved successfully'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient IP registration details not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')
            if not Ip_Registration_Id and not DepartmentType:
                return JsonResponse({'error': 'both Ip_Registration_Id and DepartmentType is required'})

            if DepartmentType=='IP':
                Dama_details = IP_Dama_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            else:
                Dama_details = IP_Dama_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            

            # Serialize data
            Dama_details_data = []
            for idx, Damaa in enumerate(Dama_details, start=1):
                ip_registration = Damaa.Ip_Registration_Id
                casuality_registration = Damaa.Casuality_Registration_Id
                
                
                Damaa_dict = {
                    'id': idx,
                    # 'RegistrationId': Damaa.Ip_Registration_Id.pk if Damaa.Ip_Registration_Id else Damaa.Casuality_Registration_Id.pk,
                    # 'VisitId': Damaa.Ip_Registration_Id.VisitId if Damaa.Ip_Registration_Id else Damaa.Casuality_Registration_Id.VisitId,
                    # 'PrimaryDoctorId': Damaa.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Damaa.Ip_Registration_Id else Damaa.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID,
                    # 'PrimaryDoctorName': Damaa.Ip_Registration_Id.PrimaryDoctor.ShortName if Damaa.Ip_Registration_Id else Damaa.Casuality_Registration_Id.PrimaryDoctor.ShortName,
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
                    
                    'Type': Damaa.Type,
                    'PatientExitType': Damaa.PatientExitType,
                    'Reasons': Damaa.Reasons,
                    'Date': Damaa.DamaDate,
                    'Time': Damaa.Time,
                    'Remarks': Damaa.Remarks,
                    'DepartmentType': Damaa.DepartmentType,
                    'CurrDate': Damaa.created_at.strftime('%d-%m-%y'),
                    'CurrTime': Damaa.created_at.strftime('%H:%M:%S'),
                    'Createdby': Damaa.Created_by,
                }
                Dama_details_data.append(Damaa_dict)

            return JsonResponse(Dama_details_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_TransferForm_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data,'data-----------')

            RegistrationId = data.get("RegistrationId")
            DepartmentType = data.get("DepartmentType")
            EmergencyRoutine = data.get("emergencyRoutine")
            To = data.get("to")
            HospitalName = data.get("hospitalName")
            Address = data.get("address")
            History = data.get("history")
            Complaints = data.get("complaints")
            Comorbidities = data.get("comorbidities")
            PastMedicalHistory = data.get("pastMedicalHistory")
            Diagnosis = data.get("diagnosis")
            TreatmentGiven = data.get("treatmentGiven")
            PurposeOfTransfer = data.get("purposeOfTransfer")
            TransportMethod = data.get("transportMethod")
            Createdby = data.get("Createdby")

            registration_ins_ip = None

            if RegistrationId:
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(Registration_Id=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration")
            
                transfer_instance = TransferForm_Details.objects.filter(
                    Ip_Registration_Id=registration_ins_ip,
                    DepartmentType=DepartmentType
                ).first()

                if transfer_instance:
                    print("Updating existing transfer form")
                    transfer_instance.EmergencyRoutine = EmergencyRoutine
                    transfer_instance.To = To
                    transfer_instance.HospitalName = HospitalName
                    transfer_instance.Address = Address
                    transfer_instance.History = History
                    transfer_instance.Complaints = Complaints
                    transfer_instance.Comorbidities = Comorbidities
                    transfer_instance.PastMedicalHistory = PastMedicalHistory
                    transfer_instance.Diagnosis = Diagnosis
                    transfer_instance.TreatmentGiven = TreatmentGiven
                    transfer_instance.PurposeOfTransfer = PurposeOfTransfer
                    transfer_instance.TransportMethod = TransportMethod
                    transfer_instance.Created_by = Createdby  # You might want to set `updated_by` instead
                    transfer_instance.save()
                    return JsonResponse({'success': 'TransferForm details Updated successfully'})

                else:    
                    print("Creating new transfer form")
                    TransferForm = TransferForm_Details(
                        Ip_Registration_Id = registration_ins_ip,
                        DepartmentType = DepartmentType,
                        EmergencyRoutine = EmergencyRoutine,
                        To = To,
                        HospitalName = HospitalName,
                        Address = Address,
                        History = History,
                        Complaints = Complaints,
                        Comorbidities = Comorbidities,
                        PastMedicalHistory = PastMedicalHistory,
                        Diagnosis = Diagnosis,
                        TreatmentGiven = TreatmentGiven,
                        PurposeOfTransfer = PurposeOfTransfer,
                        TransportMethod = TransportMethod,
                        Created_by = Createdby,
                    )
                    TransferForm.save()

            return JsonResponse({'success': 'TransferForm details saved successfully'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient IP registration details not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')
            if not Ip_Registration_Id and not DepartmentType:
                return JsonResponse({'error': 'both Ip_Registration_Id and DepartmentType is required'})

            if DepartmentType=='IP':
                TransferForm = TransferForm_Details.objects.filter(Ip_Registration_Id__Registration_Id=Ip_Registration_Id, DepartmentType=DepartmentType)
            

            # Serialize data
            TransferForm_details_data = []
            for idx, Form in enumerate(TransferForm, start=1):
                ip_registration = Form.Ip_Registration_Id
                
                
                TransferForm_dict = {
                    'id': idx,
                    'RegistrationId': ip_registration.Registration_Id if ip_registration else  None,
                    'PrimaryDoctorId': (
                        ip_registration.PrimaryDoctor.Doctor_ID if ip_registration and ip_registration.PrimaryDoctor else None
                    ),
                    'PrimaryDoctorName': (
                        ip_registration.PrimaryDoctor.ShortName if ip_registration and ip_registration.PrimaryDoctor else None
                    ),
                    'DepartmentType': Form.DepartmentType,
                    'EmergencyRoutine': Form.EmergencyRoutine,
                    'To': Form.To,
                    'HospitalName': Form.HospitalName,
                    'Address': Form.Address,
                    'History': Form.History,
                    'Complaints': Form.Complaints,
                    'Comorbidities': Form.Comorbidities,
                    'PastMedicalHistory': Form.PastMedicalHistory,
                    'Diagnosis': Form.Diagnosis,
                    'TreatmentGiven': Form.TreatmentGiven,
                    'PurposeOfTransfer': Form.PurposeOfTransfer,
                    'TransportMethod': Form.TransportMethod,
                    'CurrDate': Form.created_at.strftime('%d-%m-%y'),
                    'CurrTime': Form.created_at.strftime('%H:%M:%S'),
                    'Createdby': Form.Created_by,
                }
                TransferForm_details_data.append(TransferForm_dict)

            return JsonResponse(TransferForm_details_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




