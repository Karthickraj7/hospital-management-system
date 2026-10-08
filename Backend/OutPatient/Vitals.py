from datetime import datetime, date
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *

# Define the vital signs chart as a dictionary
VITAL_SIGNS_CHART = {
    'Newborn (0–28 days)': {
        'Temperature': {'Normal': (97.7, 99.5), 'Below Normal': (None, 97.7), 'Above Normal': (99.5, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (100, 160), 'Below Normal': (None, 100), 'Above Normal': (160, None), 'Panic': (180, None)},
        'Respiratory Rate': {'Normal': (30, 60), 'Below Normal': (None, 30), 'Above Normal': (60, None), 'Panic': (70, None)},
        'Blood Pressure': {'Normal': (60, 85, 45, 55), 'Below Normal': (None, 60, None, 45), 'Above Normal': (85, None, 55, None), 'Panic': (90, None, 60, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
    'Infant (1–12 months)': {
        'Temperature': {'Normal': (97.7, 99.5), 'Below Normal': (None, 97.7), 'Above Normal': (99.5, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (100, 150), 'Below Normal': (None, 100), 'Above Normal': (150, None), 'Panic': (170, None)},
        'Respiratory Rate': {'Normal': (30, 60), 'Below Normal': (None, 30), 'Above Normal': (60, None), 'Panic': (70, None)},
        'Blood Pressure': {'Normal': (80, 100, 55, 65), 'Below Normal': (None, 80, None, 55), 'Above Normal': (100, None, 65, None), 'Panic': (110, None, 70, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
    'Toddler (1–3 years)': {
        'Temperature': {'Normal': (97.7, 99.5), 'Below Normal': (None, 97.7), 'Above Normal': (99.5, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (80, 130), 'Below Normal': (None, 80), 'Above Normal': (130, None), 'Panic': (150, None)},
        'Respiratory Rate': {'Normal': (24, 40), 'Below Normal': (None, 24), 'Above Normal': (40, None), 'Panic': (50, None)},
        'Blood Pressure': {'Normal': (90, 105, 55, 70), 'Below Normal': (None, 90, None, 55), 'Above Normal': (105, None, 70, None), 'Panic': (110, None, 75, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
    'Preschool (3–5 years)': {
        'Temperature': {'Normal': (97.7, 99.5), 'Below Normal': (None, 97.7), 'Above Normal': (99.5, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (80, 120), 'Below Normal': (None, 80), 'Above Normal': (120, None), 'Panic': (140, None)},
        'Respiratory Rate': {'Normal': (22, 34), 'Below Normal': (None, 22), 'Above Normal': (34, None), 'Panic': (40, None)},
        'Blood Pressure': {'Normal': (95, 107, 60, 71), 'Below Normal': (None, 95, None, 60), 'Above Normal': (107, None, 71, None), 'Panic': (115, None, 75, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
    'School Age (6–12 years)': {
        'Temperature': {'Normal': (97.7, 99.5), 'Below Normal': (None, 97.7), 'Above Normal': (99.5, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (70, 110), 'Below Normal': (None, 70), 'Above Normal': (110, None), 'Panic': (130, None)},
        'Respiratory Rate': {'Normal': (18, 30), 'Below Normal': (None, 18), 'Above Normal': (30, None), 'Panic': (35, None)},
        'Blood Pressure': {'Normal': (95, 119, 60, 76), 'Below Normal': (None, 95, None, 60), 'Above Normal': (119, None, 76, None), 'Panic': (125, None, 80, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
    'Adolescent (13–18 years)': {
        'Temperature': {'Normal': (97.7, 99.5), 'Below Normal': (None, 97.7), 'Above Normal': (99.5, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (60, 100), 'Below Normal': (None, 60), 'Above Normal': (100, None), 'Panic': (120, None)},
        'Respiratory Rate': {'Normal': (12, 20), 'Below Normal': (None, 12), 'Above Normal': (20, None), 'Panic': (25, None)},
        'Blood Pressure': {'Normal': (110, 124, 70, 79), 'Below Normal': (None, 110, None, 70), 'Above Normal': (124, None, 79, None), 'Panic': (130, None, 85, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
    'Adult (>18 years)': {
        'Temperature': {'Normal': (97.8, 99.1), 'Below Normal': (None, 97.8), 'Above Normal': (99.1, None), 'Panic': (100.4, None)},
        'Heart Rate': {'Normal': (60, 100), 'Below Normal': (None, 60), 'Above Normal': (100, None), 'Panic': (120, None)},
        'Respiratory Rate': {'Normal': (12, 20), 'Below Normal': (None, 12), 'Above Normal': (20, None), 'Panic': (24, None)},
        'Blood Pressure': {'Normal': (90, 120, 60, 80), 'Below Normal': (None, 90, None, 60), 'Above Normal': (120, None, 80, None), 'Panic': (140, None, 90, None)},
        'SpO2': {'Normal': (95, 100), 'Below Normal': (90, 94), 'Panic': (None, 90)},
    },
}

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Vitals_Form_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract data from the request body
            RegistrationId = data.get("RegistrationId", '')
            temperature = data.get("Temperature", '')
            pulserate = data.get("PulseRate", '')
            spo2 = data.get("SPO2", '')
            heartrate = data.get("HeartRate", '')
            respiratoryrate = data.get("RespiratoryRate", '')
            sbp = data.get("SBP", '')
            dbp = data.get("DBP", '')
            height = data.get("Height", '')
            weight = data.get("Weight", '')
            bmi = data.get("BMI", '')
            wc = data.get("WC", '')
            hc = data.get("HC", '')
            bsl = data.get("BSL", '')
            painscore = data.get("PainScore", '')
            createdby = data.get("Createdby", '')
            Type = data.get("Type", '')


            DoctorId = data.get('DoctorId')

            Doctorins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()


            if not RegistrationId:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            # Validate temperature range
            try:
                if temperature and float(temperature) > 110:
                    return JsonResponse({'error': 'Temperature value is unrealistic (must be <= 110°F)'}, status=400)
            except ValueError:
                return JsonResponse({'error': 'Invalid Temperature value'}, status=400)

            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=RegistrationId)
                patient_dob = registration_ins.PatientId.DOB
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Invalid RegistrationId'})

            if not patient_dob:
                return JsonResponse({'error': 'No DOB found for the RegistrationId'}, status=400)

            if isinstance(patient_dob, str):
                try:
                    patient_dob = datetime.strptime(patient_dob, "%Y-%m-%d").date()
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format for DOB'}, status=400)
            elif isinstance(patient_dob, datetime):
                patient_dob = patient_dob.date()

            today = date.today()
            age_in_days = (today - patient_dob).days
            age_in_months = (today.year - patient_dob.year) * 12 + today.month - patient_dob.month - (1 if today.day < patient_dob.day else 0)
            age_in_years = today.year - patient_dob.year - ((today.month, today.day) < (patient_dob.month, patient_dob.day))

            # Determine age group based on the chart
            if age_in_days <= 28:
                age_group = 'Newborn (0–28 days)'
            elif age_in_months <= 12:
                age_group = 'Infant (1–12 months)'
            elif age_in_years <= 3:
                age_group = 'Toddler (1–3 years)'
            elif age_in_years <= 5:
                age_group = 'Preschool (3–5 years)'
            elif age_in_years <= 12:
                age_group = 'School Age (6–12 years)'
            elif age_in_years <= 18:
                age_group = 'Adolescent (13–18 years)'
            else:
                age_group = 'Adult (>18 years)'

            def evaluate_vital_sign(respiratoryrate, spo2, temperature, sbp, dbp, heartrate, painscore, age_group):
                try:
                    respiratoryrate = int(respiratoryrate) if respiratoryrate else None
                    spo2 = int(spo2) if spo2 else None
                    temperature = float(temperature) if temperature else None
                    sbp = int(sbp) if sbp else None
                    dbp = int(dbp) if dbp else None
                    heartrate = int(heartrate) if heartrate else None
                    painscore = int(painscore) if painscore else None
                except ValueError:
                    return None, None, None, None, None, None, None

                respiratory_status = None
                spo2_status = None
                temperature_status = None
                sbp_status = None
                heartrate_status = None
                painscore_status = None

                chart = VITAL_SIGNS_CHART.get(age_group, {})

                # Evaluate Temperature
                if temperature is not None:
                    temp_ranges = chart.get('Temperature', {})
                    if temp_ranges['Normal'][0] <= temperature <= temp_ranges['Normal'][1]:
                        temperature_status = 0
                    elif temp_ranges['Below Normal'][1] is not None and temperature < temp_ranges['Below Normal'][1]:
                        temperature_status = 1
                    elif temp_ranges['Above Normal'][0] is not None and temperature > temp_ranges['Above Normal'][0]:
                        temperature_status = 2
                    elif temp_ranges['Panic'][0] is not None and temperature > temp_ranges['Panic'][0]:
                        temperature_status = 3

                # Evaluate Heart Rate
                if heartrate is not None:
                    hr_ranges = chart.get('Heart Rate', {})
                    if hr_ranges['Normal'][0] <= heartrate <= hr_ranges['Normal'][1]:
                        heartrate_status = 0
                    elif hr_ranges['Below Normal'][1] is not None and heartrate < hr_ranges['Below Normal'][1]:
                        heartrate_status = 1
                    elif hr_ranges['Above Normal'][0] is not None and heartrate > hr_ranges['Above Normal'][0]:
                        heartrate_status = 2
                    elif hr_ranges['Panic'][0] is not None and heartrate > hr_ranges['Panic'][0]:
                        heartrate_status = 3

                # Evaluate Respiratory Rate
                if respiratoryrate is not None:
                    rr_ranges = chart.get('Respiratory Rate', {})
                    if rr_ranges['Normal'][0] <= respiratoryrate <= rr_ranges['Normal'][1]:
                        respiratory_status = 0
                    elif rr_ranges['Below Normal'][1] is not None and respiratoryrate < rr_ranges['Below Normal'][1]:
                        respiratory_status = 1
                    elif rr_ranges['Above Normal'][0] is not None and respiratoryrate > rr_ranges['Above Normal'][0]:
                        respiratory_status = 2
                    elif rr_ranges['Panic'][0] is not None and respiratoryrate > rr_ranges['Panic'][0]:
                        respiratory_status = 3

                # Evaluate Blood Pressure (SBP and DBP)
                if sbp is not None and dbp is not None:
                    bp_ranges = chart.get('Blood Pressure', {})
                    if (bp_ranges['Normal'][0] <= sbp <= bp_ranges['Normal'][1] and
                            bp_ranges['Normal'][2] <= dbp <= bp_ranges['Normal'][3]):
                        sbp_status = 0
                    elif (bp_ranges['Below Normal'][1] is not None and sbp < bp_ranges['Below Normal'][1]) or \
                            (bp_ranges['Below Normal'][3] is not None and dbp < bp_ranges['Below Normal'][3]):
                        sbp_status = 1
                    elif (bp_ranges['Above Normal'][0] is not None and sbp > bp_ranges['Above Normal'][0]) or \
                            (bp_ranges['Above Normal'][2] is not None and dbp > bp_ranges['Above Normal'][2]):
                        sbp_status = 2
                    elif (bp_ranges['Panic'][0] is not None and sbp > bp_ranges['Panic'][0]) or \
                            (bp_ranges['Panic'][2] is not None and dbp > bp_ranges['Panic'][2]):
                        sbp_status = 3

                # Evaluate SpO2
                if spo2 is not None:
                    spo2_ranges = chart.get('SpO2', {})
                    if spo2_ranges['Normal'][0] <= spo2 <= spo2_ranges['Normal'][1]:
                        spo2_status = 0
                    elif spo2_ranges['Below Normal'][0] <= spo2 <= spo2_ranges['Below Normal'][1]:
                        spo2_status = 1
                    elif spo2_ranges['Panic'][1] is not None and spo2 < spo2_ranges['Panic'][1]:
                        spo2_status = 3

                # Evaluate Pain Score (assuming 0-10 scale, custom ranges)
                if painscore is not None:
                    if 0 <= painscore <= 3:
                        painscore_status = 0
                    elif 4 <= painscore <= 5:
                        painscore_status = 1
                    elif 6 <= painscore <= 7:
                        painscore_status = 2
                    elif 8 <= painscore <= 10:
                        painscore_status = 3

                return respiratory_status, spo2_status, temperature_status, sbp_status, heartrate_status, painscore_status

            respiratory_status, spo2_status, temperature_status, sbp_status, heartrate_status, painscore_status = evaluate_vital_sign(
                respiratoryrate, spo2, temperature, sbp, dbp, heartrate, painscore, age_group
            )

            vital_instance = Patient_Vital_Details(
                Registration_Id=registration_ins,
                Temperature=temperature if temperature else None,
                Temperature_Status=temperature_status,
                Pulse_Rate=pulserate if pulserate else None,
                SPO2=spo2 if spo2 else None,
                SPO2_Status=spo2_status,
                Heart_Rate=heartrate if heartrate else None,
                Heart_Rate_Status=heartrate_status,
                Respiratory_Rate=respiratoryrate if respiratoryrate else None,
                Respiratory_Status=respiratory_status,
                SBP=sbp if sbp else None,
                SBP_Status=sbp_status,
                DBP=dbp if dbp else None,
                Height=height if height else None,
                Weight=weight if weight else None,
                BMI=bmi if bmi else None,
                WC=wc if wc else None,
                HC=hc if hc else None,
                BSL=bsl if bsl else None,
                Painscore=painscore if painscore else None,
                PainScore_Status=painscore_status,
                Type=Type if Type else None,
                Created_by=createdby if createdby else None,
                Doctor = Doctorins,

            )
            vital_instance.save()

            return JsonResponse({'success': 'Vitals saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        try:
            Registration_Id = request.GET.get('RegistrationId')
            if not Registration_Id:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=Registration_Id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Invalid RegistrationId'})

            vital_details = Patient_Vital_Details.objects.filter(Registration_Id__Registration_Id=Registration_Id)

            vital_details_data = []
            for idx, vital in enumerate(vital_details, start=1):
                vital_dict = {
                    'id': idx,
                    'RegistrationId': vital.Registration_Id.pk,
                    'VisitId': vital.Registration_Id.VisitId,
                    'PrimaryDoctorId': vital.Registration_Id.DoctorId.Doctor_ID if vital.Registration_Id.DoctorId else None,
                    'PrimaryDoctorName': vital.Registration_Id.DoctorId.ShortName if vital.Registration_Id.DoctorId else None,
                    'Temperature': vital.Temperature,
                    'temperature_status': vital.Temperature_Status,
                    'PulseRate': vital.Pulse_Rate,
                    'SPO2': vital.SPO2,
                    'spo2_status': vital.SPO2_Status,
                    'HeartRate': vital.Heart_Rate,
                    'heartrate_status': vital.Heart_Rate_Status,
                    'RespiratoryRate': vital.Respiratory_Rate,
                    'RespiratoryStatus': vital.Respiratory_Status,
                    'SBP': vital.SBP,
                    'sbp_status': vital.SBP_Status,
                    'DBP': vital.DBP,
                    'Height': vital.Height,
                    'Weight': vital.Weight,
                    'BMI': vital.BMI,
                    'WC': vital.WC,
                    'HC': vital.HC,
                    'BSL': vital.BSL,
                    'Type': vital.Type,
                    'PainScore': vital.Painscore,
                    'painscore_status': vital.PainScore_Status,
                    'Date': vital.created_at.strftime('%d-%m-%y'),
                    'Time': vital.created_at.strftime('%H:%M:%S'),
                    'Createdby': vital.Created_by,
                }
                vital_details_data.append(vital_dict)

            return JsonResponse({'vital_details': vital_details_data})

        except Exception as e:
            print(f"An error occurred in GET: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
        
        
        


        
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def VaccinationChart(request):
    if request.method == "GET":
        try:
            patientId = request.GET.get('PatientId')
            if not patientId:
                return JsonResponse({'error': 'PatientId is required'}, status=400)
            vaccinList = Vaccination_Taken_Details.objects.filter(PatientId=patientId)
            vaccin_data = []
            for vaccin in vaccinList:
                vaccin_dict = {
                    'id': vaccin.pk,
                    'VaccinId': vaccin.VaccinId.pk,
                    'Vaccine_Name': vaccin.VaccinId.Vaccine_Name,
                    'created_by': vaccin.created_by,
                }
                vaccin_data.append(vaccin_dict)
            return JsonResponse(vaccin_data, safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': str(e)})

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            vaccinName = data.get('vaccinName')
            DoseNo = data.get('DoseNo')
            TakenDate = data.get('TakenDate')
            PatientId = data.get('PatientId')
            NextDueDate = data.get('NextDueDate')
            Remark = data.get('Remark')
            created_by = data.get('created_by', '')
            
            print("data", vaccinName, DoseNo, Remark, created_by)

            patient = Patient_Detials.objects.filter(PatientId = PatientId).first()
            vaccin = Vaccine_Master_Details.objects.filter(Vaccine_Name__iexact =vaccinName).first()
            dose = Vaccination_Taken_Details.objects.create(
                PatientId = patient,
                VaccinId = vaccin,
                DoseNumber = DoseNo,
                TakenDate = TakenDate,
                NextDueDate = NextDueDate,
                Remarks = Remark,
                created_by = created_by
            )
            dose.save()
            return JsonResponse({'success': 'Data Saved Successfully...'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': str(e)})




