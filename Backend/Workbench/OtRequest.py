
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_OtRequest_Details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            Speciality = data.get('Speciality','')
            PrimaryDr = data.get('PrimaryDr','')
            SurgeryName = data.get('SurgeryName','')
            SurgeryRequestedDate = data.get('SurgeryRequestedDate','')
            SurgeryRequestedTime = data.get('SurgeryRequestedTime','')
            DurationNumber = data.get('DurationNumber','')
            DurationUnit = data.get('DurationUnit','')
            RequestedBy = data.get('RequestedBy','')
            Remarks = data.get('Remarks','')
            created_by = data.get('Created_by', '')
            registration_id = data.get('RegistrationId', '')

            if not registration_id:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

            OT_instance = Workbench_OtRequest(
                Registration_Id=registration_ins,
                Speciality=Speciality,
                PrimaryDr=PrimaryDr,
                SurgeryName=SurgeryName,
                SurgeryRequestedDate=SurgeryRequestedDate,
                SurgeryRequestedTime=SurgeryRequestedTime,
                DurationNumber=DurationNumber,
                DurationUnit=DurationUnit,
                RequestedBy=RequestedBy,
                Remarks=Remarks,
                created_by=created_by
            )
            OT_instance.save()
            return JsonResponse({'success': 'OtRequest Details added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
            
   
    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            if not registration_id:
                return JsonResponse({'warn': 'RegistrationId is required'}, status=400)
            
            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

            # Fetch all records from the Location_Detials model
            OtRequest = Workbench_OtRequest.objects.filter(Registration_Id=registration_ins)
            
            # Construct a list of dictionaries containing location data
            OtRequest_data = [
                {
                    'id': OT.Id,
                    'RegistrationId': OT.Registration_Id.pk,
                    'VisitId': OT.Registration_Id.VisitId,
                    'PrimaryDoctorId': OT.Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': OT.Registration_Id.PrimaryDoctor.ShortName,
                    'Speciality': OT.Speciality,
                    'PrimaryDr': OT.PrimaryDr,
                    'SurgeryName': OT.SurgeryName,
                    'SurgeryRequestedDate': OT.SurgeryRequestedDate,
                    'SurgeryRequestedTime': OT.SurgeryRequestedTime,
                    'DurationNumber': OT.DurationNumber,
                    'DurationUnit': OT.DurationUnit,
                    'RequestedBy': OT.RequestedBy,
                    'Remarks': OT.Remarks,
                    'created_by': OT.created_by,
                    'CurrDate' : OT.created_at.strftime('%Y-%m-%d'),  # Format date
                    'CurrTime' : OT.created_at.strftime('%H:%M:%S') , # Format time
                } for OT in OtRequest
            ]
            print(OtRequest_data,'OtRequest_data')
            return JsonResponse(OtRequest_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


















