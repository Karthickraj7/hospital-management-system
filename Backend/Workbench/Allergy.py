from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils.timezone import now



@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Allergy_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'data')

            RegistrationId = data.get("RegistrationId")
            AllergyType = data.get("AllergyType")
            Allergent = data.get("Allergent")
            Reaction = data.get("Reaction")
            Remarks = data.get("Remarks")
            Type = data.get("Type")
          
            createdby = data.get("Createdby")
        
            
            print(f"Received RegistrationId: {RegistrationId}")  # Debugging line
            
           
            registration_ins=None
            registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=RegistrationId) if RegistrationId else None
            
            # Save Allergy details
            Allergy_instance = Allergy_Details(
                Registration_Id=registration_ins,
                AllergyType=AllergyType,
                Allergent=Allergent,
                Reaction=Reaction,
                Remarks=Remarks,
                Type=Type,
                Created_by=createdby,
            )
            Allergy_instance.save()

            print(Allergy_instance,'Allergy_instance')
            
            return JsonResponse({'success': 'Allergy details saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            
            Registration_Id = request.GET.get('RegistrationId')
           
            
            if not Registration_Id :
                return JsonResponse({'error': ' Registration_Id is required'})

            registration_ins=None
            registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=Registration_Id) if Registration_Id else None
           
            print(registration_ins,'registration_ins')
            AllergyHistory_Details = Allergy_Details.objects.filter(Registration_Id=registration_ins)
            
            
            # Serialize data
            AllergyHistory_Details_data = []
            for idx, Allergy in enumerate(AllergyHistory_Details, start=1):
                Allergy_dict = {
                    'id': idx,
                    'RegistrationId': Allergy.Registration_Id.pk if Allergy.Registration_Id else None,
                    'VisitId': Allergy.Registration_Id.VisitId if Allergy.Registration_Id else None,
                    # 'PrimaryDoctorId': Allergy.Registration_Id.PrimaryDoctor.Doctor_ID if Allergy.Registration_Id else None,
                    # 'PrimaryDoctorName': Allergy.Registration_Id.PrimaryDoctor.ShortName if Allergy.Registration_Id else None,
                    'AllergyType': Allergy.AllergyType,
                    'Allergent': Allergy.Allergent,
                    'Reaction': Allergy.Reaction,
                    'Remarks': Allergy.Remarks,
                    'Type': Allergy.Type,
                    'Date': Allergy.created_at.strftime('%d-%m-%y'),
                    'Time': Allergy.created_at.strftime('%H:%M:%S'),
                    'Createdby': Allergy.Created_by,
                }
                AllergyHistory_Details_data.append(Allergy_dict)

            return JsonResponse(AllergyHistory_Details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





