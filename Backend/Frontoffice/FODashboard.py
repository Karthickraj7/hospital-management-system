import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q,Count
from Frontoffice.models import *
from Masters.models import *
from Ip_Workbench.models import *

@csrf_exempt
def get_patient_stats(request):

    if request.method == 'GET':


        try:
            total_patients = Patient_Detials.objects.count()
            out_patients = Patient_Appointment_Registration_Detials.objects.count()
            ip_patients = Patient_IP_Registration_Detials.objects.count()
            ccu_patients = Patient_Casuality_Registration_Detials.objects.count()
            ds_patients = Patient_Diagnosis_Registration_Detials.objects.count()
            lab_Patients = Patient_Laboratory_Registration_Detials.objects.count()
            Bed_count = Room_Master_Detials.objects.count()
            occupied_bed = Room_Master_Detials.objects.filter(Booking_Status='Booked').count()
            ip_admission = Patient_Admission_Detials.objects.filter(IP_Registration_Id_id__isnull=False).count()
            ip_discharge = IP_DischargeSummary.objects.filter(Ip_Registration_Id_id__isnull=False).count()

            
            new_consultations = Patient_Appointment_Registration_Detials.objects.filter(VisitType='NewConsultation').count()
            follow_ups = Patient_Appointment_Registration_Detials.objects.filter(VisitType='FollowUp').count()

            Male = Patient_Detials.objects.filter(Gender='Male').count()
            Female = Patient_Detials.objects.filter(Gender='FeMale').count()

            new_percentage = (new_consultations / out_patients * 100) if out_patients > 0 else 0
            follow_up_percentage = (follow_ups / out_patients * 100) if out_patients > 0 else 0

            male_percentage = round((Male / total_patients * 100), 0) if total_patients > 0 else 0
            female_percentage = round((Female / total_patients * 100), 0) if total_patients > 0 else 0

            bed_occ_per = round((occupied_bed / Bed_count * 100), 0) if Bed_count > 0 else 0

            return JsonResponse({
                "totalPatients": total_patients,
                "outPatients": out_patients,
                "ipPatients": ip_patients,
                "new_percentage":new_consultations,
                "follow_up_percentage":follow_ups,
                "male_percentage":Male,
                "female_percentage":Female,
                "bed_occ_per":occupied_bed,
                "ccu_patients":ccu_patients,
                "ds_patients":ds_patients,
                "lab_Patients":lab_Patients,
                "ip_admission":ip_admission,
                "ip_discharge":ip_discharge,
            },safe=False)
        
        except Exception as e:
             print(f"An error occurred: {str(e)}")
             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
# @csrf_exempt
# def get_age_distribution_for_male(request):

#     patient_ins = Patient_Detials.objects.filter(Gender='Male')
#     age_ranges = {
#         "three": 0,
#         "four": 0,
#         "eleven": 0,
#         "twentyone": 0,
#         "thirtysix": 0,
#         "fifty": 0,
#     }
#     for Patient in patient_ins:

#         print(Patient.Age)
#         if int(Patient.Age) < 3:
#             age_ranges["three"] += 1
#         elif 4 <= int(Patient.Age) <= 10:
#             age_ranges["four"] += 1
#         elif 11 <= int(Patient.Age) <= 20:
#             age_ranges["eleven"] += 1
#         elif 21 <= int(Patient.Age) <= 35:
#             age_ranges["twentyone"] += 1
#         elif 36 <= int(Patient.Age) <= 50:
#             age_ranges["thirtysix"] += 1
#         else:
#             age_ranges["fifty"] += 1

#     return JsonResponse(age_ranges,safe=False)


# @csrf_exempt
# def get_age_distribution_for_female(request):

#     patient_ins = Patient_Detials.objects.filter(Gender='Female')
#     age_ranges = {
#         "three": 0,
#         "four": 0,
#         "eleven": 0,
#         "twentyone": 0,
#         "thirtysix": 0,
#         "fifty": 0,
#     }
#     for Patient in patient_ins:

#         print(Patient.Age)
#         if int(Patient.Age) < 3:
#             age_ranges["three"] += 1
#         elif 4 <= int(Patient.Age) <= 10:
#             age_ranges["four"] += 1
#         elif 11 <= int(Patient.Age) <= 20:
#             age_ranges["eleven"] += 1
#         elif 21 <= int(Patient.Age) <= 35:
#             age_ranges["twentyone"] += 1
#         elif 36 <= int(Patient.Age) <= 50:
#             age_ranges["thirtysix"] += 1
#         else:
#             age_ranges["fifty"] += 1

#     return JsonResponse(age_ranges,safe=False)


#     # # Fetch all age values from the PatientDetails table
#     # age_values = Patient_Detials.objects.values_list('Age', flat=True)
    
#     # # Initialize counters for each age range
#     # age_ranges = {
#     #     "0<3": 0,
#     #     "4-10": 0,
#     #     "11-20": 0,
#     #     "21-35": 0,
#     #     "36-50": 0,
#     #     "50+": 0,
#     # }

#     # # Categorize each age into the appropriate range
#     # for age in age_values:
#     #     if int(age) < 3:
#     #         age_ranges["0<3"] += 1
#     #     elif 4 <= int(age) <= 10:
#     #         age_ranges["4-10"] += 1
#     #     elif 11 <= int(age) <= 20:
#     #         age_ranges["11-20"] += 1
#     #     elif 21 <= int(age) <= 35:
#     #         age_ranges["21-35"] += 1
#     #     elif 36 <= int(age) <= 50:
#     #         age_ranges["36-50"] += 1
#     #     elif int(age) > 50:
#     #         age_ranges["50+"] += 1

#     # # Return only the values
#     # return JsonResponse(list(age_ranges.values()), safe=False)

@csrf_exempt
def get_age_distribution(request):
    if request.method == 'GET':

        malepatient = Patient_Detials.objects.filter(Gender='Male')
        femalepatient = Patient_Detials.objects.filter(Gender='Female')
        

        def calculate_age_range_percentage(age_range, male_count, female_count):
            total_count = male_count + female_count
            if total_count == 0:
                male_percentage = 0.0
                female_percentage = 0.0
            else:
                male_percentage = (male_count / total_count) * 100
                female_percentage = (female_count / total_count) * 100
            # Return the desired output format
            return {
                'age_ranges': age_range,
                'male':male_count,
                'female':female_count,
                'male_percentage': round(male_percentage, 2),
                'female_percentage': round(female_percentage, 2),
            }
        
        male_age_ranges = {
        "three": 0,
        "four": 0,
        "eleven": 0,
        "twentyone": 0,
        "thirtysix": 0,
        "fifty": 0,
        }
        female_age_ranges = {
            "three": 0,
            "four": 0,
            "eleven": 0,
            "twentyone": 0,
            "thirtysix": 0,
            "fifty": 0,
        }
        
        age_range_mapping = {
        "three": "0-3",
        "four": "4-10",
        "eleven": "11-20",
        "twentyone": "21-35",
        "thirtysix": "36-50",
        "fifty": "51+",
    }



        
        for Patient in malepatient:
            if int(Patient.Age) < 3:
                male_age_ranges["three"] += 1
            elif 4 <= int(Patient.Age) <= 10:
                male_age_ranges["four"] += 1
            elif 11 <= int(Patient.Age) <= 20:
                male_age_ranges["eleven"] += 1
            elif 21 <= int(Patient.Age) <= 35:
                male_age_ranges["twentyone"] += 1
            elif 36 <= int(Patient.Age) <= 50:
                male_age_ranges["thirtysix"] += 1
            else:
                male_age_ranges["fifty"] += 1
        for Patient in femalepatient:
            if int(Patient.Age) < 3:
                female_age_ranges["three"] += 1
            elif 4 <= int(Patient.Age) <= 10:
                female_age_ranges["four"] += 1
            elif 11 <= int(Patient.Age) <= 20:
                female_age_ranges["eleven"] += 1
            elif 21 <= int(Patient.Age) <= 35:
                female_age_ranges["twentyone"] += 1
            elif 36 <= int(Patient.Age) <= 50:
                female_age_ranges["thirtysix"] += 1
            else:
                female_age_ranges["fifty"] += 1
        # Transforming data into the desired format
        data = []
        for key, age_range in age_range_mapping.items():
            data.append({
                "age_range": age_range,
                "male": male_age_ranges.get(key, 0),
                "female": female_age_ranges.get(key, 0),
            })
        results = []
        for item in data:
            result = calculate_age_range_percentage(
                age_range=item['age_range'],
                male_count=item['male'],
                female_count=item['female']
            )
            results.append(result)

        
        return JsonResponse(results,safe=False)
     





@csrf_exempt
def op_doctor_wise(request):

    doc = Doctor_ProfessForm_Detials.objects.filter(Department=2)
   
     
    doct_list=[]
    for doct in doc:
      #print("ghj",doct.Doctor_ID.Doctor_ID)
      #print("prem",doct.Doctor_ID.First_Name)
      result = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=doct.Doctor_ID.Doctor_ID) \
      .aggregate(patient_count=Count('PatientId_id'))
     # print(result['patient_count']) 
      

      doct_dict={
            "doctorname":doct.Doctor_ID.First_Name,
            "doctorId":doct.Doctor_ID.Doctor_ID,
            "PatientCount":result['patient_count'] 

        }
      doct_list.append(doct_dict)
    return JsonResponse(doct_list,safe=False)


@csrf_exempt
def ip_doctor_wise(request):

    doc = Doctor_ProfessForm_Detials.objects.filter(Department=1)
   
     
    doct_list=[]
    for doct in doc:
      #print("ghj",doct.Doctor_ID.Doctor_ID)
      #print("prem",doct.Doctor_ID.First_Name)
      result = Patient_Appointment_Registration_Detials.objects.filter(PrimaryDoctor_id=doct.Doctor_ID.Doctor_ID) \
      .aggregate(patient_count=Count('PatientId_id'))
     # print(result['patient_count']) 
      

      doct_dict={
            "doctorname":doct.Doctor_ID.First_Name,
            "doctorId":doct.Doctor_ID.Doctor_ID,
            "PatientCount":result['patient_count']

        }
      doct_list.append(doct_dict)
    return JsonResponse(doct_list,safe=False)

















# @csrf_exempt
# def get_age_distribution(request):

#     if request.method == 'GET':

        
#         # Fetch all age values from the PatientDetails table
#         age_values = Patient_Detials.objects.values_list('Age', flat=True)
#         print(age_values)
#         # Initialize counters for each age range
#         age_ranges = {
#             "0<3": 0,
#             "4-10": 0,
#             "11-20": 0,
#             "21-35": 0,
#             "36-50": 0,
#             "50+": 0,
#         }

#         # Categorize each age into the appropriate range
#         for age in age_values:
#             if int(age) < 3:
#                 age_ranges["0<3"] += 1
#             elif 4 <= int(age) <= 10:
#                 age_ranges["4-10"] += 1
#             elif 11 <= int(age) <= 20:
#                 age_ranges["11-20"] += 1
#             elif 21 <= int(age) <= 35:
#                 age_ranges["21-35"] += 1
#             elif 36 <= int(age) <= 50:
#                 age_ranges["36-50"] += 1
#             elif int(age) > 50:
#                 age_ranges["50+"] += 1

#         # Format the response data
#         response_data = [
#             {"label": key, "value": value if "36-50" in key or "0<3" in key else 0 if "4-10" in key else 0 if "11-20" in key else 0}
#             for key, value in age_ranges.items()
#         ]

#     return JsonResponse(response_data, safe=False)