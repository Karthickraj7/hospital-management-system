import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q,Count
from Frontoffice.models import *
from Masters.models import *
from Ip_Workbench.models import *

@csrf_exempt
def get_patient_stats_warddashboard(request):

    if request.method == 'GET':


        try:
            total_patients = Patient_Detials.objects.count()
            out_patients = Patient_Appointment_Registration_Detials.objects.count()
            ip_patients = Patient_IP_Registration_Detials.objects.count()
            ccu_patients = Patient_Casuality_Registration_Detials.objects.count()
            Bed_count = Room_Master_Detials.objects.count()
            occupied_bed = Room_Master_Detials.objects.filter(Booking_Status='Booked').count()
            vaccany_bed = Room_Master_Detials.objects.filter(Booking_Status='Available').count()
            Medical = Patient_Admission_Detials.objects.filter(AdmissionPurpose='Medical-Management').count()
            surgery = Patient_Admission_Detials.objects.filter(AdmissionPurpose='Surgery').count()
            admission = Patient_Admission_Detials.objects.count()
            discharge = IP_DischargeSummary.objects.count()


            icu_patients = Room_Master_Detials.objects.filter(Booking_Status='Booked',Ward_Name_id=2).count()
            general_patients = Room_Master_Detials.objects.filter(Booking_Status='Booked',Ward_Name_id=1).count()
            cas_Patients = Room_Master_Detials.objects.filter(Booking_Status='Booked',Ward_Name_id=3).count()
            ot_Patients = Room_Master_Detials.objects.filter(Booking_Status='Booked',Ward_Name_id=4).count()

         
            op_patient_client = Patient_Appointment_Registration_Detials.objects.filter(ClientName_id__isnull=False).count()
            op_patient_insurance = Patient_Appointment_Registration_Detials.objects.filter(InsuranceName_id__isnull=False).count()

            ip_patient_client = Patient_IP_Registration_Detials.objects.filter(ClientName_id__isnull=False).count()
            ip_patient_insurance = Patient_IP_Registration_Detials.objects.filter(InsuranceName_id__isnull=False).count()

            ccu_patient_client = Patient_Casuality_Registration_Detials.objects.filter(ClientName_id__isnull=False).count()
            ccu_patient_insurance = Patient_Casuality_Registration_Detials.objects.filter(InsuranceName_id__isnull=False).count()

            ds_patient_client = Patient_Diagnosis_Registration_Detials.objects.filter(ClientName_id__isnull=False).count()
            ds_patient_insurance = Patient_Diagnosis_Registration_Detials.objects.filter(InsuranceName_id__isnull=False).count()

            lab_patient_client = Patient_Laboratory_Registration_Detials.objects.filter(ClientName_id__isnull=False).count()
            lab_patient_insurance = Patient_Laboratory_Registration_Detials.objects.filter(InsuranceName_id__isnull=False).count()

            TotalclientPatient = op_patient_client + ip_patient_client + ccu_patient_client + ds_patient_client + lab_patient_client
            TotalinsurancePatient = op_patient_insurance + ip_patient_insurance + ccu_patient_insurance+ lab_patient_insurance + ds_patient_insurance
            Totalcreditpatient = TotalclientPatient + TotalinsurancePatient
            Totalcashpatient = total_patients - Totalcreditpatient


            # Totalcpper = round((TotalclientPatient / total_patients * 100), 0) if total_patients > 0 else 0
            # Totalipper = round((TotalinsurancePatient / total_patients * 100), 0) if total_patients > 0 else 0
            # Totalclipper = round((Totalcreditpatient / total_patients * 100), 0) if total_patients > 0 else 0
            # TotalcashPatientper = 100 - Totalclipper
            


            
            new_consultations = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose='NewConsultation').count()
            follow_ups = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose='FollowUp').count()

            #Male = Patient_Detials.objects.filter(Gender='Male').count()
            #Female = Patient_Detials.objects.filter(Gender='FeMale').count()

            # new_percentage = (new_consultations / out_patients * 100) if out_patients > 0 else 0
            # follow_up_percentage = (follow_ups / out_patients * 100) if out_patients > 0 else 0

            # male_percentage = round((Male / total_patients * 100), 0) if total_patients > 0 else 0
            # female_percentage = round((Female / total_patients * 100), 0) if total_patients > 0 else 0

            # bed_occ_per = round((occupied_bed / Bed_count * 100), 0) if Bed_count > 0 else 0

            return JsonResponse({
                "totalPatients": total_patients,
                "outPatients": out_patients,
                "ipPatients": ip_patients,
                "ccu_patients":ccu_patients,

                "icu_patients":icu_patients,
                "general_patients":general_patients,
                "cas_Patients":cas_Patients,
                "ot_Patients":ot_Patients,
                # "new_percentage":new_percentage,
                # "follow_up_percentage":follow_up_percentage,
                # "male_percentage":int(male_percentage),
                # "female_percentage":int(female_percentage),
                # "bed_occ_per":int(bed_occ_per)
                "new_consultations":new_consultations,
                "follow_ups":follow_ups,
                "occupied_bed":occupied_bed,
                "vaccany_bed":vaccany_bed,
                "Totalcashpatient":Totalcashpatient,
                "Totalcreditpatient":Totalcreditpatient,
                "TotalclientPatient":TotalclientPatient,
                "TotalinsurancePatient":TotalinsurancePatient,
                "Medical":Medical,
                "surgery":surgery,
                "admission":admission,
                "discharge":discharge,


            },safe=False)
        
        except Exception as e:
             print(f"An error occurred: {str(e)}")
             return JsonResponse({'error': 'An internal server error occurred'}, status=500)