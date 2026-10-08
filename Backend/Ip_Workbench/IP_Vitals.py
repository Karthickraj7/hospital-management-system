import json
from datetime import datetime, date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Q

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import json
from datetime import datetime, date
from django.db.models import Q
from .models import Patient_IP_Registration_Detials, Patient_Emergency_Registration_Detials, IP_Vital_Details, IP_VitalsChart

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_Vitals_Form_Details_Link(request):
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
            painscore = data.get("Painscore", '')
            department_type = data.get("DepartmentType", '')
            type_ = data.get("Type", '')
            created_by = data.get("Createdby", '')

            if not RegistrationId or not department_type:
                return JsonResponse({'error': 'RegistrationId and DepartmentType are required'}, status=400)

            # Validate numeric fields
            def validate_float(value, field_name, min_val=None, max_val=None):
                if not value or value.strip() == '':
                    return None
                try:
                    val = float(value)
                    if min_val is not None and val < min_val:
                        return JsonResponse({'error': f'{field_name} must be at least {min_val}'}, status=400)
                    if max_val is not None and val > max_val:
                        return JsonResponse({'error': f'{field_name} cannot exceed {max_val}'}, status=400)
                    return val
                except (ValueError, TypeError):
                    return JsonResponse({'error': f'{field_name} must be a valid number'}, status=400)

            # Validate temperature
            temperature_val = validate_float(temperature, 'Temperature', min_val=90, max_val=110)
            if isinstance(temperature_val, JsonResponse):
                return temperature_val
            temperature = temperature_val

            # Validate painscore
            painscore_val = validate_float(painscore, 'Painscore', min_val=0, max_val=10)
            if isinstance(painscore_val, JsonResponse):
                return painscore_val
            painscore = painscore_val

            # Validate other numeric fields (optional, depending on requirements)
            pulserate_val = validate_float(pulserate, 'PulseRate')
            if isinstance(pulserate_val, JsonResponse):
                return pulserate_val
            pulserate = pulserate_val

            spo2_val = validate_float(spo2, 'SPO2')
            if isinstance(spo2_val, JsonResponse):
                return spo2_val
            spo2 = spo2_val

            heartrate_val = validate_float(heartrate, 'HeartRate')
            if isinstance(heartrate_val, JsonResponse):
                return heartrate_val
            heartrate = heartrate_val

            respiratoryrate_val = validate_float(respiratoryrate, 'RespiratoryRate')
            if isinstance(respiratoryrate_val, JsonResponse):
                return respiratoryrate_val
            respiratoryrate = respiratoryrate_val

            sbp_val = validate_float(sbp, 'SBP')
            if isinstance(sbp_val, JsonResponse):
                return sbp_val
            sbp = sbp_val

            dbp_val = validate_float(dbp, 'DBP')
            if isinstance(dbp_val, JsonResponse):
                return dbp_val
            dbp = dbp_val

            height_val = validate_float(height, 'Height')
            if isinstance(height_val, JsonResponse):
                return height_val
            height = height_val

            weight_val = validate_float(weight, 'Weight')
            if isinstance(weight_val, JsonResponse):
                return weight_val
            weight = weight_val

            bmi_val = validate_float(bmi, 'BMI')
            if isinstance(bmi_val, JsonResponse):
                return bmi_val
            bmi = bmi_val

            # Determine registration type (IP or Casuality)
            registration_ins_ip = None
            registration_ins_casuality = None
            try:
                if department_type == 'IP':
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    patient_dob = registration_ins_ip.PatientId.DOB
                else:
                    registration_ins_casuality = Patient_Emergency_Registration_Detials.objects.get(pk=RegistrationId)
                    patient_dob = registration_ins_casuality.PatientId.DOB
            except (Patient_IP_Registration_Detials.DoesNotExist, Patient_Emergency_Registration_Detials.DoesNotExist):
                return JsonResponse({'error': 'No registration found for the given RegistrationId'}, status=404)

            if not patient_dob:
                return JsonResponse({'error': 'No DOB found for the RegistrationId'}, status=400)

            # Parse DOB
            if isinstance(patient_dob, str):
                try:
                    patient_dob = datetime.strptime(patient_dob, "%Y-%m-%d").date()
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format for DOB'}, status=400)
            elif isinstance(patient_dob, datetime):
                patient_dob = patient_dob.date()

            # Calculate age and determine age group
            today = date.today()
            age_in_years = today.year - patient_dob.year - ((today.month, today.day) < (patient_dob.month, patient_dob.day))
            age_in_months = (today.year - patient_dob.year) * 12 + today.month - patient_dob.month - (1 if today.day < patient_dob.day else 0)

            if age_in_months < 4:
                age_group = 'Child < 4 months'
            elif 4 <= age_in_months < 24:
                age_group = '4 months - 2 years'
            elif 2 <= age_in_years < 5:
                age_group = '2-5 years'
            elif 5 <= age_in_years < 12:
                age_group = '5-12 years'
            elif 12 <= age_in_years < 16:
                age_group = '12-16 years'
            else:
                age_group = 'Adult >16 years'

            def evaluate_vital_sign(respiratoryrate, spo2, temperature, sbp, heartrate, age_group):
                def parse_value(value):
                    """Parses a single comparison or numeric value."""
                    if not value or value.strip() == '':
                        return None
                    value = value.strip()
                    try:
                        if value.startswith('<='):
                            return float(value[2:]) if '.' in value else int(value[2:])
                        elif value.startswith('>='):
                            return float(value[2:]) if '.' in value else int(value[2:])
                        elif value.startswith('<'):
                            return float(value[1:]) - 0.01 if '.' in value else int(value[1:]) - 1
                        elif value.startswith('>'):
                            return float(value[1:]) + 0.01 if '.' in value else int(value[1:]) + 1
                        else:
                            return float(value) if '.' in value else int(value)
                    except ValueError:
                        return value

                def parse_range(value):
                    """Parses a range string, comparison string, or comma-separated values."""
                    if not value or value.strip() == '':
                        return None
                    value = value.strip()
                    if '-' in value:
                        try:
                            return [float(v) if '.' in v else int(v) for v in value.split('-')]
                        except ValueError:
                            return None
                    if ',' in value:
                        return [v.strip() for v in value.split(',')]
                    return parse_value(value)

                # Convert inputs to appropriate types
                try:
                    respiratoryrate = int(respiratoryrate) if respiratoryrate else None
                    spo2 = int(spo2) if spo2 else None
                    temperature = float(temperature) if temperature else None
                    sbp = int(sbp) if sbp else None
                    heartrate = int(heartrate) if heartrate else None
                except (ValueError, TypeError):
                    return None, None, None, None, None

                # Query vital chart for the age group
                vital_chart_queryset = IP_VitalsChart.objects.filter(
                    Q(Vitals__in=[
                        'Respiratory Rate', 'SpO2', 'Temperature (Frahrenheit)', 'Systolic BP', 
                        'Heart Rate (per min)'
                    ]),
                    Age__icontains=age_group
                )

                if not vital_chart_queryset.exists():
                    return None, None, None, None, None

                # Initialize status variables
                respiratory_status = None
                spo2_status = None
                temperature_status = None
                sbp_status = None
                heartrate_status = None

                for vital_chart in vital_chart_queryset:
                    min_high = parse_value(vital_chart.MinHigh)
                    min_medium = parse_range(vital_chart.MinMedium)
                    min_low = parse_range(vital_chart.MinLow)
                    normal = parse_range(vital_chart.Normal)
                    max_low = parse_range(vital_chart.MaxLow)
                    max_medium = parse_range(vital_chart.MaxMedium)
                    max_high = parse_value(vital_chart.MaxHigh)

                    if vital_chart.Vitals == 'Respiratory Rate' and respiratoryrate is not None:
                        if min_high is not None and respiratoryrate <= min_high:
                            respiratory_status = 3  # Panic
                        elif max_high is not None and respiratoryrate >= max_high:
                            respiratory_status = 3  # Panic
                        elif min_medium and isinstance(min_medium, list) and min_medium[0] <= respiratoryrate <= min_medium[1]:
                            respiratory_status = 2  # AboveNormal
                        elif max_medium and isinstance(max_medium, list) and max_medium[0] <= respiratoryrate <= max_medium[1]:
                            respiratory_status = 2  # AboveNormal
                        elif min_low and isinstance(min_low, list) and min_low[0] <= respiratoryrate <= min_low[1]:
                            respiratory_status = 1  # BelowNormal
                        elif max_low and isinstance(max_low, list) and max_low[0] <= respiratoryrate <= max_low[1]:
                            respiratory_status = 1  # BelowNormal
                        elif normal and isinstance(normal, list) and normal[0] <= respiratoryrate <= normal[1]:
                            respiratory_status = 0  # Normal

                    if vital_chart.Vitals == 'SpO2' and spo2 is not None:
                        if min_high is not None and spo2 <= min_high:
                            spo2_status = 3  # Panic
                        elif normal and isinstance(normal, list) and normal[0] <= spo2 <= normal[1]:
                            spo2_status = 0  # Normal
                        elif min_medium and isinstance(min_medium, list) and min_medium[0] <= spo2 <= min_medium[1]:
                            spo2_status = 2  # AboveNormal
                        elif min_low and isinstance(min_low, list) and min_low[0] <= spo2 <= min_low[1]:
                            spo2_status = 1  # BelowNormal

                    if vital_chart.Vitals == 'Temperature (Frahrenheit)' and temperature is not None:
                        if min_high is not None and temperature <= min_high:
                            temperature_status = 3.0  # Panic
                        elif max_high is not None and temperature >= max_high:
                            temperature_status = 3.0  # Panic
                        elif min_medium and isinstance(min_medium, list) and min_medium[0] <= temperature <= min_medium[1]:
                            temperature_status = 2.0  # AboveNormal
                        elif max_medium and isinstance(max_medium, list) and max_medium[0] <= temperature <= max_medium[1]:
                            temperature_status = 2.0  # AboveNormal
                        elif min_low and isinstance(min_low, list) and min_low[0] <= temperature <= min_low[1]:
                            temperature_status = 1.0  # BelowNormal
                        elif max_low and isinstance(max_low, list) and max_low[0] <= temperature <= max_low[1]:
                            temperature_status = 1.0  # BelowNormal
                        elif normal and isinstance(normal, list) and normal[0] <= temperature <= normal[1]:
                            temperature_status = 0.0  # Normal

                    if vital_chart.Vitals == 'Systolic BP' and sbp is not None:
                        if min_high is not None and sbp <= min_high:
                            sbp_status = 3  # Panic
                        elif max_high is not None and sbp >= max_high:
                            sbp_status = 3  # Panic
                        elif min_medium and isinstance(min_medium, list) and min_medium[0] <= sbp <= min_medium[1]:
                            sbp_status = 2  # AboveNormal
                        elif max_medium and isinstance(max_medium, list) and max_medium[0] <= sbp <= max_medium[1]:
                            sbp_status = 2  # AboveNormal
                        elif min_low and isinstance(min_low, list) and min_low[0] <= sbp <= min_low[1]:
                            sbp_status = 1  # BelowNormal
                        elif max_low and isinstance(max_low, list) and max_low[0] <= sbp <= max_low[1]:
                            sbp_status = 1  # BelowNormal
                        elif normal and isinstance(normal, list) and normal[0] <= sbp <= normal[1]:
                            sbp_status = 0  # Normal

                    if vital_chart.Vitals == 'Heart Rate (per min)' and heartrate is not None:
                        if min_high is not None and heartrate <= min_high:
                            heartrate_status = 3  # Panic
                        elif max_high is not None and heartrate >= max_high:
                            heartrate_status = 3  # Panic
                        elif min_medium and isinstance(min_medium, list) and min_medium[0] <= heartrate <= min_medium[1]:
                            heartrate_status = 2  # AboveNormal
                        elif max_medium and isinstance(max_medium, list) and max_medium[0] <= heartrate <= max_medium[1]:
                            heartrate_status = 2  # AboveNormal
                        elif min_low and isinstance(min_low, list) and min_low[0] <= heartrate <= min_low[1]:
                            heartrate_status = 1  # BelowNormal
                        elif max_low and isinstance(max_low, list) and max_low[0] <= heartrate <= max_low[1]:
                            heartrate_status = 1  # BelowNormal
                        elif normal and isinstance(normal, list) and normal[0] <= heartrate <= normal[1]:
                            heartrate_status = 0  # Normal

                return (
                    respiratory_status, spo2_status, temperature_status, sbp_status, heartrate_status
                )

            # Calculate vital signs statuses
            (
                respiratory_status, spo2_status, temperature_status, sbp_status, heartrate_status
            ) = evaluate_vital_sign(
                respiratoryrate, spo2, temperature, sbp, heartrate, age_group
            )

            # Save vital details
            vital_instance = IP_Vital_Details(
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
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
                Type=type_ if type_ else None,
                DepartmentType=department_type if department_type else None,
                Created_by=created_by,
            )
            vital_instance.save()

            return JsonResponse({'success': 'Vitals saved successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')
            Type = request.GET.get('Type')

            if not Ip_Registration_Id or not DepartmentType:
                return JsonResponse({'error': 'RegistrationId and DepartmentType are required'}, status=400)

            if DepartmentType == 'IP':
                vital_details = IP_Vital_Details.objects.filter(
                    Ip_Registration_Id__pk=Ip_Registration_Id, 
                    DepartmentType=DepartmentType,
                    Type=Type
                )
            else:
                vital_details = IP_Vital_Details.objects.filter(
                    Casuality_Registration_Id__pk=Ip_Registration_Id, 
                    DepartmentType=DepartmentType,
                    Type=Type
                )

            vital_details_data = []
            for idx, vital in enumerate(vital_details, start=1):
                vital_dict = {
                    'id': idx,
                    'RegistrationId': vital.Ip_Registration_Id.pk if vital.Ip_Registration_Id else vital.Casuality_Registration_Id.pk,
                    'PrimaryDoctorId': (
                        vital.Ip_Registration_Id.PrimaryDoctor.Doctor_ID 
                        if vital.Ip_Registration_Id and vital.Ip_Registration_Id.PrimaryDoctor 
                        else vital.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID 
                        if vital.Casuality_Registration_Id and vital.Casuality_Registration_Id.PrimaryDoctor 
                        else None
                    ),
                    'PrimaryDoctorName': (
                        vital.Ip_Registration_Id.PrimaryDoctor.ShortName 
                        if vital.Ip_Registration_Id and vital.Ip_Registration_Id.PrimaryDoctor 
                        else vital.Casuality_Registration_Id.PrimaryDoctor.ShortName 
                        if vital.Casuality_Registration_Id and vital.Casuality_Registration_Id.PrimaryDoctor 
                        else None
                    ),
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
                    'Painscore': vital.Painscore,
                    'Type': vital.Type,
                    'DepartmentType': vital.DepartmentType,
                    'Date': vital.created_at.strftime('%d-%m-%y'),
                    'Time': vital.created_at.strftime('%H:%M:%S'),
                    'Createdby': vital.Created_by,
                }
                vital_details_data.append(vital_dict)

            return JsonResponse({'vital_details': vital_details_data})

        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)       
        
 

@csrf_exempt
@require_http_methods(['GET'])
def IP_Vitals_By_PatientId(request):
    if request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId')
            DepartmentType = request.GET.get('DepartmentType')
            Type = request.GET.get('Type') 

            if not PatientId or not DepartmentType:
                return JsonResponse({'error': 'PatientId and DepartmentType are required'})

            vital_details = None

            if DepartmentType == 'IP':
                vital_details = IP_Vital_Details.objects.filter(
                    Ip_Registration_Id__PatientId__PatientId=PatientId,  
                    DepartmentType=DepartmentType,
                    Type=Type if Type else None  
                )
            else:
                vital_details = IP_Vital_Details.objects.filter(
                    Casuality_Registration_Id__PatientId__PatientId=PatientId,
                    DepartmentType=DepartmentType,
                    Type=Type if Type else None
                )

            if not vital_details.exists():
                print(f"No vital details found for PatientId={PatientId}, DepartmentType={DepartmentType}, Type={Type}")
                return JsonResponse({'vital_details': []})

            vital_details_data = []
            for idx, vital in enumerate(vital_details, start=1):
                vital_dict = {
                    'id': idx,
                    'RegistrationId': (
                        vital.Ip_Registration_Id.pk if vital.Ip_Registration_Id 
                        else vital.Casuality_Registration_Id.pk if vital.Casuality_Registration_Id 
                        else None
                    ),
                    'PatientId': (
                        vital.Ip_Registration_Id.PatientId.PatientId if vital.Ip_Registration_Id 
                        else vital.Casuality_Registration_Id.PatientId.PatientId if vital.Casuality_Registration_Id 
                        else None
                    ),
                    'PrimaryDoctorId': (
                        vital.Ip_Registration_Id.PrimaryDoctor.Doctor_ID 
                        if vital.Ip_Registration_Id and vital.Ip_Registration_Id.PrimaryDoctor 
                        else vital.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID 
                        if vital.Casuality_Registration_Id and vital.Casuality_Registration_Id.PrimaryDoctor 
                        else None
                    ),
                    'PrimaryDoctorName': (
                        vital.Ip_Registration_Id.PrimaryDoctor.ShortName 
                        if vital.Ip_Registration_Id and vital.Ip_Registration_Id.PrimaryDoctor 
                        else vital.Casuality_Registration_Id.PrimaryDoctor.ShortName 
                        if vital.Casuality_Registration_Id and vital.Casuality_Registration_Id.PrimaryDoctor 
                        else None
                    ),
                    'Temperature': vital.Temperature,
                    'Temperature_Status': vital.Temperature_Status,
                    'Pulse_Rate': vital.Pulse_Rate,
                    'SPO2': vital.SPO2,
                    'SPO2_Status': vital.SPO2_Status,
                    'Heart_Rate': vital.Heart_Rate,
                    'Heart_Rate_Status': vital.Heart_Rate_Status,
                    'Respiratory_Rate': vital.Respiratory_Rate,
                    'Respiratory_Status': vital.Respiratory_Status,
                    'SBP': vital.SBP,
                    'SBP_Status': vital.SBP_Status,
                    'DBP': vital.DBP,
                    'Height': vital.Height,
                    'Weight': vital.Weight,
                    'BMI': vital.BMI,
                    'WC': vital.WC,
                    'HC': vital.HC,
                    'BSL': vital.BSL,
                    'Painscore': vital.Painscore,
                    'SupplementalOxygen': vital.SupplementalOxygen,
                    'SupplementalOxygen_Status': vital.SupplementalOxygen_Status,
                    'LevelOfConsiousness': vital.LevelOfConsiousness,
                    'LevelOfConsiousness_Status': vital.LevelOfConsiousness_Status,
                    'CapillaryRefillTime': vital.CapillaryRefillTime,
                    'CapillaryRefillTime_Status': vital.CapillaryRefillTime_Status,
                    'Type': vital.Type,
                    'DepartmentType': vital.DepartmentType,
                    'Date': vital.created_at.strftime('%d-%m-%y'),
                    'Time': vital.created_at.strftime('%H:%M:%S'),
                    'Createdby': vital.Created_by,
                }
                vital_details_data.append(vital_dict)

            print(f"Returning {len(vital_details_data)} vital records for PatientId={PatientId}")
            return JsonResponse({'vital_details': vital_details_data})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
        
        
        
@csrf_exempt
@require_http_methods(['GET'])
def get_ip_vitals_by_patient(request):
    try:
        patient_id = request.GET.get('PatientId')
        department_type = request.GET.get('DepartmentType', 'IP')
 
        if not patient_id:
            return JsonResponse({'error': 'PatientId is required'}, status=400)
 
        registration_ids = Patient_IP_Registration_Detials.objects.filter(
            PatientId=patient_id
        ).values_list('Registration_Id', flat=True)
 
        if not registration_ids:
            return JsonResponse({'error': 'No registrations found for this patient'}, status=404)
 
        vital_details = IP_Vital_Details.objects.filter(
            Ip_Registration_Id__in=registration_ids,
            DepartmentType=department_type
        )
 
        vital_details_data = []
        for idx, vital in enumerate(vital_details, start=1):
            vital_dict = {
                'id': idx,
                'RegistrationId': vital.Ip_Registration_Id.Registration_Id if vital.Ip_Registration_Id else None,
                'PrimaryDoctorId': (
                    vital.Ip_Registration_Id.PrimaryDoctor.Doctor_ID
                    if vital.Ip_Registration_Id and vital.Ip_Registration_Id.PrimaryDoctor
                    else None
                ),
                'PrimaryDoctorName': (
                    vital.Ip_Registration_Id.PrimaryDoctor.ShortName
                    if vital.Ip_Registration_Id and vital.Ip_Registration_Id.PrimaryDoctor
                    else None
                ),
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
                'Painscore': vital.Painscore,
                'SupplementalOxygen': vital.SupplementalOxygen,
                'SupplementalOxygen_status': vital.SupplementalOxygen_Status,
                'LevelOfConsiousness': vital.LevelOfConsiousness,
                'LevelOfConsiousness_Status': vital.LevelOfConsiousness_Status,
                'CapillaryRefillTime': vital.CapillaryRefillTime,
                'CapillaryRefillTime_Status': vital.CapillaryRefillTime_Status,
                'Type': vital.Type,
                'DepartmentType': vital.DepartmentType,
                'Date': vital.created_at.strftime('%d-%m-%y'),
                'Time': vital.created_at.strftime('%H:%M:%S'),
                'Createdby': vital.Created_by,
            }
            vital_details_data.append(vital_dict)
 
        return JsonResponse({'vital_details': vital_details_data})
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)        