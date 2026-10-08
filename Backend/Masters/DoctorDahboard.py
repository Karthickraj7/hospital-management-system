import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q,Count
from Frontoffice.models import *
from Masters.models import *

@csrf_exempt
def get_patient_stats_ddashboard(request):

    if request.method == 'GET':


        try:
            total_patients = Patient_Detials.objects.count()
            out_patients = Patient_Appointment_Registration_Detials.objects.count()
            ip_patients = Patient_IP_Registration_Detials.objects.count()
            ccu_patients = Patient_Casuality_Registration_Detials.objects.count()
        
            icu_patients = Room_Master_Detials.objects.filter(Booking_Status='Booked',Ward_Name_id=2).count()
  
            new_consultations = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose='NewConsultation').count()
            follow_ups = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose='FollowUp').count()

           
            return JsonResponse({
                "totalPatients": total_patients,
                "outPatients": out_patients,
                "ipPatients": ip_patients,
                "ccu_patients":ccu_patients,
                "icu_patients":icu_patients,
                "new_consultations":new_consultations,
                "follow_ups":follow_ups
            },safe=False)
        
        except Exception as e:
             print(f"An error occurred: {str(e)}")
             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        

@csrf_exempt
def get_total_appointment(request):

    if request.method == 'GET':

        try:

            doctor_ins = Doctor_Personal_Form_Detials.objects.all()
            doct_list = []
            for doct in doctor_ins:
               
                Request = Appointment_Request_List.objects.filter(status='PENDING',doctor_name_id=doct.Doctor_ID).count()
                Confirm = Appointment_Request_List.objects.filter(status='Registered',doctor_name_id=doct.Doctor_ID).count()
                Pending = Patient_Appointment_Registration_Detials.objects.filter(Status='Registered',PrimaryDoctor_id=doct.Doctor_ID).count()
                Complete = Patient_Appointment_Registration_Detials.objects.filter(Status='Completed',PrimaryDoctor_id=doct.Doctor_ID).count()
                doct_dict = {
                     "Doctorid" : doct.Doctor_ID,
                     "Doctorname" : doct.First_Name,
                     "Request" : Request,
                     "Confirm":Confirm,
                     "Pending":Pending,
                     "Complete":Complete
                }
                doct_list.append(doct_dict)



            return JsonResponse(doct_list,safe=False)

        except Exception as e:
             print(f"An error occurred: {str(e)}")
             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
            