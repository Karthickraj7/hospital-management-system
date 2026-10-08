
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json
from django.db.models import Q

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_OP_Sheet_Details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            PresentComplaints = data.get('PresentComplaints','')
            PastHistory = data.get('PastHistory','')
            Allergies = data.get('Allergies','')
            Diagnosis = data.get('Diagnosis','')
            Treatment = data.get('Treatment','')
           
            created_by = data.get('created_by', '')
            registration_id = data.get('RegistrationId', '')
            PrimaryComplaint = data.get('PrimaryComplaint', '')

            if not registration_id:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            registration_ins = None
            registration_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            
            print(registration_ins,'registration_ins-----')
            Ip_registration_ins = None
            Ip_registration_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            
            OP_Sheet_instance = Workbench_OP_Sheet(
                Registration_Id=registration_ins,
                IpRegistration_Id=Ip_registration_ins,
                PresentComplaints=PresentComplaints,
                PrimaryComplaint=PrimaryComplaint,
                PastHistory=PastHistory,
                Allergies=Allergies,
                Diagnosis=Diagnosis,
                Treatment=Treatment,
                created_by=created_by
            )
            OP_Sheet_instance.save()
            return JsonResponse({'success': 'OPSheet Details added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
            
   
    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            if not registration_id:
                return JsonResponse({'warn': 'RegistrationId is required'}, status=400)
            
            registration_ins = None
            registration_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            
            print(registration_ins,'registration_ins-----')
            Ip_registration_ins = None
            Ip_registration_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            
            # Fetch all records from the Location_Detials model

            if registration_ins:
                OpSheet = Workbench_OP_Sheet.objects.filter(Registration_Id=registration_ins)
            
            elif Ip_registration_ins:
                OpSheet = Workbench_OP_Sheet.objects.filter(IpRegistration_Id=Ip_registration_ins)
            # Construct a list of dictionaries containing location data
            OpSheet_data = [
                {
                    'id': Op_Sheet.Id,
                    'RegistrationId': Op_Sheet.Registration_Id.Registration_Id if Op_Sheet.Registration_Id else '' or Op_Sheet.IpRegistration_Id.Registration_Id if Op_Sheet.IpRegistration_Id else '' ,
                    # 'VisitId': Op_Sheet.Registration_Id.VisitId,
                    # 'PrimaryDoctorId': Op_Sheet.Registration_Id.PrimaryDoctor.Doctor_ID,
                    # 'PrimaryDoctorName': Op_Sheet.Registration_Id.PrimaryDoctor.ShortName,
                    'PrimaryComplaint': Op_Sheet.PrimaryComplaint,
                    'PresentComplaints': Op_Sheet.PresentComplaints,
                    'PastHistory': Op_Sheet.PastHistory,
                    'Allergies': Op_Sheet.Allergies,
                    'Diagnosis': Op_Sheet.Diagnosis,
                    'Treatment': Op_Sheet.Treatment,
                    'created_by': Op_Sheet.created_by,
                    'Date' : Op_Sheet.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time' : Op_Sheet.created_at.strftime('%H:%M:%S') , # Format time
                } for Op_Sheet in OpSheet
            ]
            print(OpSheet_data,'OpSheet_data')
            return JsonResponse(OpSheet_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)



def Get_Priarycomplaint(request):
    try:
        data = request.GET.get('PrimaryComplaint')
        querys =Q()
        if data:
            querys &= Q(PrimaryComplaint__icontains = data)
        responsedata =[]
        PrimaryComplaints = Workbench_OP_Sheet.objects.filter(querys).values('PrimaryComplaint').distinct()[:10]
        print(PrimaryComplaints,'PrimaryComplaints')
        for PrComp in PrimaryComplaints:

            Prival= PrComp.get('PrimaryComplaint')
            complaints = Workbench_OP_Sheet.objects.filter(PrimaryComplaint = Prival).order_by('-created_at').first()
            print(complaints,'complaints')
            data={
                    'id': len(responsedata) +1,
                    # 'PrimaryDoctorId': complaints.Registration_Id.PrimaryDoctor.Doctor_ID,
                    # 'PrimaryDoctorName': complaints.Registration_Id.PrimaryDoctor.ShortName,
                    'PrimaryComplaint': complaints.PrimaryComplaint,
                    'PresentComplaints': complaints.PresentComplaints,
                    'PastHistory': complaints.PastHistory,
                    'Allergies': complaints.Allergies,
                    'Diagnosis': complaints.Diagnosis,
                    'Treatment': complaints.Treatment,
                }
            responsedata.append(data)
        return JsonResponse(responsedata, safe=False)
    except Exception as e:
        # Log the error and return a 500 Internal Server Error
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

   







