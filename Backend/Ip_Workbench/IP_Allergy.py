from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils.timezone import now






@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_Allergy_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            RegistrationId = data.get("RegistrationId")
            AllergyType = data.get("AllergyType")
            Allergent = data.get("Allergent")
            Reaction = data.get("Reaction")
            Remarks = data.get("Remarks")
            DepartmentType = data.get("DepartmentType")
            createdby = data.get("Createdby")
            
            registration_ins_ip = None
            registration_ins_casuality = None
            
            print(f"Received RegistrationId: {RegistrationId}")  # Debugging line
            
            if RegistrationId:
                # Try to get from IP Registration first
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Emergency_Registration_Detials.objects.get(Registration_Id=RegistrationId)
                        print("Found in Casuality Registration")
                    except Patient_Emergency_Registration_Detials.DoesNotExist:
                        return JsonResponse({'error': 'No registration found for the given RegistrationId'})

            else:
                return JsonResponse({'error': 'RegistrationId is required'})

            # Save Allergy details
            Allergy_instance = IP_Allergy_Details(
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
                DepartmentType=DepartmentType,
                AllergyType=AllergyType,
                Allergent=Allergent,
                Reaction=Reaction,
                Remarks=Remarks,
                Created_by=createdby,
            )
            Allergy_instance.save()
            
            return JsonResponse({'success': 'Allergy details saved successfully'})

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
                AllergyHistory_Details = IP_Allergy_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            else:
                AllergyHistory_Details = IP_Allergy_Details.objects.filter(Casuality_Registration_Id__Registration_Id=Ip_Registration_Id, DepartmentType=DepartmentType)
            
            
            # Serialize data
            AllergyHistory_Details_data = []
            for idx, Allergy in enumerate(AllergyHistory_Details, start=1):
                ip_registration = Allergy.Ip_Registration_Id
                casuality_registration = Allergy.Casuality_Registration_Id
                
                Allergy_dict = {
                    'id': idx,
                    # 'RegistrationId': Allergy.Ip_Registration_Id.pk if Allergy.Ip_Registration_Id else Allergy.Casuality_Registration_Id.pk,
                    # 'VisitId': Allergy.Ip_Registration_Id.VisitId if Allergy.Ip_Registration_Id else Allergy.Casuality_Registration_Id.VisitId,
                    # 'PrimaryDoctorId': Allergy.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Allergy.Ip_Registration_Id.PrimaryDoctor else Allergy.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID if Allergy.Casuality_Registration_Id.PrimaryDoctor else None,
                    # 'PrimaryDoctorName': Allergy.Ip_Registration_Id.PrimaryDoctor.ShortName if Allergy.Ip_Registration_Id.PrimaryDoctor else Allergy.Casuality_Registration_Id.PrimaryDoctor.ShortName if Allergy.Casuality_Registration_Id.PrimaryDoctor else None,
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
                    'AllergyType': Allergy.AllergyType,
                    'Allergent': Allergy.Allergent,
                    'Reaction': Allergy.Reaction,
                    'Remarks': Allergy.Remarks,
                    'DepartmentType': Allergy.DepartmentType,
                    'Date': Allergy.created_at.strftime('%d-%m-%y'),
                    'Time': Allergy.created_at.strftime('%H:%M:%S'),
                    'Createdby': Allergy.Created_by,
                }
                AllergyHistory_Details_data.append(Allergy_dict)

            return JsonResponse(AllergyHistory_Details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
        

@csrf_exempt
@require_http_methods(['GET'])
def IP_Allergy_By_PatientId(request):
    if request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId')
            DepartmentType = request.GET.get('DepartmentType')

            # Validation
            if not PatientId or not DepartmentType:
                return JsonResponse({'error': 'PatientId and DepartmentType are required'})

            allergy_details = None

            # Filter by PatientId
            if DepartmentType == 'IP':
                allergy_details = IP_Allergy_Details.objects.filter(
                    Ip_Registration_Id__PatientId__PatientId=PatientId, 
                    DepartmentType=DepartmentType
                )
            else:
                allergy_details = IP_Allergy_Details.objects.filter(
                    Casuality_Registration_Id__PatientId__PatientId=PatientId,
                    DepartmentType=DepartmentType
                )

            if not allergy_details.exists():
                print(f"No allergy details found for PatientId={PatientId}, DepartmentType={DepartmentType}")
                return JsonResponse({'allergy_details': []})

            allergy_details_data = []
            for idx, allergy in enumerate(allergy_details, start=1):
                ip_registration = allergy.Ip_Registration_Id
                casuality_registration = allergy.Casuality_Registration_Id
                
                allergy_dict = {
                    'id': idx,
                    'RegistrationId': (
                        ip_registration.pk if ip_registration 
                        else casuality_registration.pk if casuality_registration 
                        else None
                    ),
                    'PatientId': (
                        ip_registration.PatientId.PatientId if ip_registration 
                        else casuality_registration.PatientId.PatientId if casuality_registration 
                        else None
                    ),
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
                    'AllergyType': allergy.AllergyType,
                    'Allergent': allergy.Allergent,
                    'Reaction': allergy.Reaction,
                    'Remarks': allergy.Remarks,
                    'DepartmentType': allergy.DepartmentType,
                    'Date': allergy.created_at.strftime('%d-%m-%y'),
                    'Time': allergy.created_at.strftime('%H:%M:%S'),
                    'Createdby': allergy.Created_by,
                }
                allergy_details_data.append(allergy_dict)

            print(f"Returning {len(allergy_details_data)} allergy records for PatientId={PatientId}")
            return JsonResponse({'allergy_details': allergy_details_data})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})






