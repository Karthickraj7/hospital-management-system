
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from Masters.models import *
from Frontoffice.models import *


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def post_ot_request_nurse_workbench(request):
     if request.method == 'POST':
        try:

            data = json.loads(request.body)
            
            Specialization = data.get('Specialization')
            SurgeryName = data.get('SurgeryName')
            SurgeryDate = data.get('SurgeryDate')
            SurgeryTime = data.get('SurgeryTime')
            TheatreName = data.get('TheatreName')
            DoctorName = data.get('DoctorName')
            Createdby = data.get('created_by')

           
            Specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Specialization) if Specialization else None
            SurgeryName_instance = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None
            TheatreName_instance = OtTheaterMaster_Detials.objects.get(Ot_Id=TheatreName) if TheatreName else None
            DoctorName_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DoctorName) if DoctorName else None

            

            ot_request_data = Ot_Request_Details(
                    Specialization = Specialization_instance,
                    SurgeryName = SurgeryName_instance,
                    TheatreName = TheatreName_instance,
                    DoctorName = DoctorName_instance,
                    SurgeryDate = SurgeryDate,
                    SurgeryTime = SurgeryTime,
                    Created_by = Createdby
                  )
            ot_request_data.save()
            return JsonResponse({'success': 'Otrequest added successfully'})
        
            
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)