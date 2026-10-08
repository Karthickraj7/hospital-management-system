from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from Ip_Workbench.models import *
import logging
import json
import base64
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import PreAuthBillingInfo, PreAuthDocuments
from django.core.files.base import ContentFile

# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(['POST', 'GET', 'PUT'])
def Insurance_Medical_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract fields
            PresentingComplaints = data.get('PresentingComplaints', '')
            DetailsPresentingComplaints = data.get('DetailsPresentingComplaints', '')
            HistoryOf = data.get('HistoryOf', '')
            PatientStatusAtAdmission = data.get('PatientStatusAtAdmission', '')
            MedicalHistoryCheckbox = data.get('MedicalHistoryCheckbox', '')
            MedicalHistoryOthers = data.get('MedicalHistoryOthers', '')
            SocialHistoryCheckbox = data.get('SocialHistoryCheckbox', '')
            FamilyHistoryCheckbox = data.get('FamilyHistoryCheckbox', '')
            FamilyHistoryOthers = data.get('FamilyHistoryOthers', '')
            RelationShip = data.get('RelationShip', '')
            SurgicalHistoryCheckbox = data.get('SurgicalHistoryCheckbox', '')
            SurgicalHistoryOthers = data.get('SurgicalHistoryOthers', '')
            ListnamesAnddates = data.get('Listnamesdates', '')
            womenMenCheckbox = data.get('womenMenCheckbox', '')
            menCheckbox = data.get('menCheckbox', '')
            Dateoflastcolonoscopy = data.get('Dateoflastcolonoscopy', '')
            Lmp = data.get('Lmp', '')
            NoOfPregnancies = data.get('NoOfPregnancies', '')
            NoOfDeliveries = data.get('NoOfDeliveries', '')
            Vaginal = data.get('Vaginal', '')
            Csection = data.get('Csection', '')
            MisCarriage = data.get('MisCarriage', '')
            VipAbortions = data.get('VipAbortions', '')
            Allergies = data.get('Allergies', '')
            Temperature = data.get('Temperature', '')
            PulseRate = data.get('PulseRate', '')
            Spo2 = data.get('SPO2', '')
            HeartRate = data.get('HeartRate', '')
            Rr = data.get('RR', '')
            Bp = data.get('BP', '')
            Height = data.get('Height', '')
            Weight = data.get('Weight', '')
            Bmi = data.get('BMI', '')
            Wc = data.get('WC', '')
            Hc = data.get('HC', '')
            Bsl = data.get('BSL', '')
            Cvs = data.get('Cvs', '')
            Pupil = data.get('Pupil', '')
            UlRt = data.get('UlRt', '')
            UlLt = data.get('UlLt', '')
            LlRt = data.get('LlRt', '')
            LlLt = data.get('LlLt', '')
            Rt = data.get('Rt', '')
            Lt = data.get('Lt', '')
            Rs = data.get('Rs', '')
            Pa = data.get('Pa', '')
            Cns = data.get('Cns', '')
            LocalExamination = data.get('LocalExamination', '')
            LocalOthers = data.get('LocalOthersCheckbox', '')
            ProvisionalDiagnosis = data.get('ProvisionalDiagnosis', '')
            FinalDiagnosis = data.get('FinalDiagnosis', '')
            isSameAsProvisional = data.get('isSameAsProvisional', '')
            TreatmentGiven = data.get('TreatmentGiven', '')
            DepartmentType = data.get('DepartmentType', '')
            RegistrationId = data.get('RegistrationId', '')
            createdby = data.get('created_by', '')

            registration_ins_ip = None
            registration_ins_casuality = None

            if not RegistrationId:
                return JsonResponse({'error': 'RegistrationId is required'})

            try:
                registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
            except Patient_IP_Registration_Detials.DoesNotExist:
                try:
                    registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'No registration found for the given RegistrationId'}, status=404)

            # Save to Insurance_Medical_History
            Assesment_instance = Insurance_Medical_History(
                Presenting_Complaints=PresentingComplaints,
                DetailsPresenting_Complaints=DetailsPresentingComplaints,
                History_Of=HistoryOf,
                PatientStatus_AtAdmission=PatientStatusAtAdmission,
                MedicalHistory_Checkbox=MedicalHistoryCheckbox,
                MedicalHistory_Others=MedicalHistoryOthers,
                SocialHistory_Checkbox=SocialHistoryCheckbox,
                FamilyHistory_Checkbox=FamilyHistoryCheckbox,
                FamilyHistory_Others=FamilyHistoryOthers,
                RelationShip=RelationShip,
                SurgicalHistory_Checkbox=SurgicalHistoryCheckbox,
                SurgicalHistory_Others=SurgicalHistoryOthers,
                Listnames_Anddates=ListnamesAnddates,
                womenMen_Checkbox=womenMenCheckbox,
                men_Checkbox=menCheckbox,
                Dateoflast_colonoscopy=Dateoflastcolonoscopy,
                Lmp=Lmp,
                NoOf_Pregnancies=NoOfPregnancies,
                NoOf_Deliveries=NoOfDeliveries,
                Vaginal=Vaginal,
                Csection=Csection,
                MisCarriage=MisCarriage,
                Vip_Abortions=VipAbortions,
                Allergies=Allergies,
                Temperature=Temperature,
                Pulse_Rate=PulseRate,
                SPO2=Spo2,
                Heart_Rate=HeartRate,
                RR=Rr,
                BP=Bp,
                Height=Height,
                Weight=Weight,
                BMI=Bmi,
                WC=Wc,
                HC=Hc,
                BSL=Bsl,
                CVS=Cvs,
                Pupil=Pupil,
                UlRt=UlRt,
                UlLt=UlLt,
                LlRt=LlRt,
                LlLt=LlLt,
                Rt=Rt,
                Lt=Lt,
                RS=Rs,
                PA=Pa,
                CNS=Cns,
                Local_Examination=LocalExamination,
                LocalOthers=LocalOthers,
                Provisional_Diagnosis=ProvisionalDiagnosis,
                isSameAsProvisional=isSameAsProvisional,
                Final_Diagnosis=FinalDiagnosis,
                Treatment_Given=TreatmentGiven,
                DepartmentType=DepartmentType,
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
                Created_by=createdby,
            )
            Assesment_instance.save()

            # # Return success with the saved record's ID
            # return JsonResponse({
            #     'id': Assesment_instance.Id
            # }, status=201)
            return JsonResponse({'success': 'Medical History details saved successfully'})

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in POST request: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"POST Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')

            if not RegistrationId or not DepartmentType:
                return JsonResponse({'error': 'Both RegistrationId and DepartmentType are required'}, status=400)

            # Check Insurance_Medical_History first
            if DepartmentType == 'IP':
                insurance_data = Insurance_Medical_History.objects.filter(
                    Ip_Registration_Id__pk=RegistrationId, DepartmentType=DepartmentType
                )
            else:
                insurance_data = Insurance_Medical_History.objects.filter(
                    Casuality_Registration_Id__pk=RegistrationId, DepartmentType=DepartmentType
                )

            if insurance_data.exists():
                data_source = insurance_data
                source_table = 'Insurance_Medical_History'
            else:
                # Fallback to IP_Assesment_Details
                if DepartmentType == 'IP':
                    ip_data = IP_Assesment_Details.objects.filter(
                        Ip_Registration_Id__pk=RegistrationId, DepartmentType=DepartmentType
                    )
                else:
                    ip_data = IP_Assesment_Details.objects.filter(
                        Casuality_Registration_Id__pk=RegistrationId, DepartmentType=DepartmentType
                    )
                data_source = ip_data
                source_table = 'IP_Assesment_Details'

            # Serialize data with consistent field names
            serialized_data = []
            for record in data_source:
                ip_registration = record.Ip_Registration_Id
                casuality_registration = record.Casuality_Registration_Id

                record_dict = {
                    'id': record.Id,  # Use actual DB ID
                    'RegistrationId': (
                        ip_registration.pk if ip_registration else
                        casuality_registration.pk if casuality_registration else None
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
                    'PresentingComplaints': record.Presenting_Complaints,
                    'DetailsPresentingComplaints': record.DetailsPresenting_Complaints,
                    'HistoryOf': record.History_Of,
                    'PatientStatusAtAdmission': record.PatientStatus_AtAdmission,
                    'MedicalHistoryCheckbox': record.MedicalHistory_Checkbox,
                    'MedicalHistoryOthers': record.MedicalHistory_Others,
                    'SocialHistoryCheckbox': record.SocialHistory_Checkbox,
                    'FamilyHistoryCheckbox': record.FamilyHistory_Checkbox,
                    'FamilyHistoryOthers': record.FamilyHistory_Others,
                    'RelationShip': record.RelationShip,
                    'SurgicalHistoryCheckbox': record.SurgicalHistory_Checkbox,
                    'SurgicalHistoryOthers': record.SurgicalHistory_Others,
                    'Listnamesdates': record.Listnames_Anddates,
                    'womenMenCheckbox': record.womenMen_Checkbox,
                    'menCheckbox': record.men_Checkbox,
                    'Dateoflastcolonoscopy': record.Dateoflast_colonoscopy,
                    'Lmp': record.Lmp,
                    'NoOfPregnancies': record.NoOf_Pregnancies,
                    'NoOfDeliveries': record.NoOf_Deliveries,
                    'Vaginal': record.Vaginal,
                    'Csection': record.Csection,
                    'MisCarriage': record.MisCarriage,
                    'VipAbortions': record.Vip_Abortions,
                    'Allergies': record.Allergies,
                    'Temperature': record.Temperature,
                    'PulseRate': record.Pulse_Rate,
                    'SPO2': record.SPO2,
                    'HeartRate': record.Heart_Rate,
                    'RR': record.RR,
                    'BP': record.BP,
                    'Height': record.Height,
                    'Weight': record.Weight,
                    'BMI': record.BMI,
                    'WC': record.WC,
                    'HC': record.HC,
                    'BSL': record.BSL,
                    'Cvs': record.CVS,
                    'Pupil': record.Pupil,
                    'UlRt': record.UlRt,
                    'UlLt': record.UlLt,
                    'LlRt': record.LlRt,
                    'LlLt': record.LlLt,
                    'Rt': record.Rt,
                    'Lt': record.Lt,
                    'Rs': record.RS,
                    'Pa': record.PA,
                    'Cns': record.CNS,
                    'LocalExamination': record.Local_Examination,
                    'LocalOthersCheckbox': record.LocalOthers,
                    'ProvisionalDiagnosis': record.Provisional_Diagnosis,
                    'isSameAsProvisional': str(record.isSameAsProvisional),  # Ensure string for frontend
                    'FinalDiagnosis': record.Final_Diagnosis,
                    'TreatmentGiven': record.Treatment_Given,
                    'Date': record.created_at.strftime('%d-%m-%y'),
                    'Time': record.created_at.strftime('%H:%M:%S'),
                    'Createdby': record.Created_by,
                    'DepartmentType': record.DepartmentType,
                    'SourceTable': source_table  # Indicate the source for debugging
                }
                serialized_data.append(record_dict)

            return JsonResponse(serialized_data, safe=False)

        except Exception as e:
            logger.error(f"GET Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            id = data.get('id')
            if not id:
                return JsonResponse({'error': 'ID is required'}, status=400)

            instance = Insurance_Medical_History.objects.get(Id=id)  
            for key, value in data.items():
                model_field_map = {
                    'PresentingComplaints': 'Presenting_Complaints',
                    'DetailsPresentingComplaints': 'DetailsPresenting_Complaints',
                    'HistoryOf': 'History_Of',
                    'PatientStatusAtAdmission': 'PatientStatus_AtAdmission',
                    'MedicalHistoryCheckbox': 'MedicalHistory_Checkbox',
                    'MedicalHistoryOthers': 'MedicalHistory_Others',
                    'SocialHistoryCheckbox': 'SocialHistory_Checkbox',
                    'FamilyHistoryCheckbox': 'FamilyHistory_Checkbox',
                    'FamilyHistoryOthers': 'FamilyHistory_Others',
                    'RelationShip': 'RelationShip',
                    'SurgicalHistoryCheckbox': 'SurgicalHistory_Checkbox',
                    'SurgicalHistoryOthers': 'SurgicalHistory_Others',
                    'Listnamesdates': 'Listnames_Anddates',
                    'womenMenCheckbox': 'womenMen_Checkbox',
                    'menCheckbox': 'men_Checkbox',
                    'Dateoflastcolonoscopy': 'Dateoflast_colonoscopy',
                    'Lmp': 'Lmp',
                    'NoOfPregnancies': 'NoOf_Pregnancies',
                    'NoOfDeliveries': 'NoOf_Deliveries',
                    'Vaginal': 'Vaginal',
                    'Csection': 'Csection',
                    'MisCarriage': 'MisCarriage',
                    'VipAbortions': 'Vip_Abortions',
                    'Allergies': 'Allergies',
                    'Temperature': 'Temperature',
                    'PulseRate': 'Pulse_Rate',
                    'SPO2': 'SPO2',
                    'HeartRate': 'Heart_Rate',
                    'RR': 'RR',
                    'BP': 'BP',
                    'Height': 'Height',
                    'Weight': 'Weight',
                    'BMI': 'BMI',
                    'WC': 'WC',
                    'HC': 'HC',
                    'BSL': 'BSL',
                    'Cvs': 'CVS',
                    'Pupil': 'Pupil',
                    'UlRt': 'UlRt',
                    'UlLt': 'UlLt',
                    'LlRt': 'LlRt',
                    'LlLt': 'LlLt',
                    'Rt': 'Rt',
                    'Lt': 'Lt',
                    'Rs': 'RS',
                    'Pa': 'PA',
                    'Cns': 'CNS',
                    'LocalExamination': 'Local_Examination',
                    'LocalOthersCheckbox': 'LocalOthers',
                    'ProvisionalDiagnosis': 'Provisional_Diagnosis',
                    'isSameAsProvisional': 'isSameAsProvisional',
                    'FinalDiagnosis': 'Final_Diagnosis',
                    'TreatmentGiven': 'Treatment_Given',
                    'Createdby': 'Created_by',
                    'DepartmentType': 'DepartmentType',
                }
                model_field = model_field_map.get(key, key)
                if hasattr(instance, model_field):
                    setattr(instance, model_field, value)
            instance.save()
            return JsonResponse({'success': 'Record updated successfully'}, status=200)

        except Insurance_Medical_History.DoesNotExist:
            return JsonResponse({'error': 'Record not found'}, status=404)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in PUT request: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"PUT Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
        
        

@csrf_exempt
@require_http_methods(['POST', 'GET', 'PUT'])
def Post_Pre_Auth_Form_diagnosis(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            mrn = data.get('MRN', '')
            contact_number = data.get('ContactNumber', '')
            location = data.get('Location', '')
            created_by = data.get('createAt', '')
            rows = data.get('rows', [])
            rows2 = data.get('rows2', [])
            main_page_completed = data.get('MainPageCompleted', '')
            page_completed = data.get('PageCompleted', '')

            if not mrn:
                return JsonResponse({'error': 'MRN is required'})

            registration_ip = None
            registration_casuality = None
            try:
                registration_ip = Patient_IP_Registration_Detials.objects.get(Registration_Id=mrn)
            except Patient_IP_Registration_Detials.DoesNotExist:
                try:
                    registration_casuality = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=mrn)
                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'No registration found for the given MRN'})

            DiagnosisData.objects.filter(MRN=mrn).delete()

            for row in rows:
                DiagnosisData.objects.create(
                    Ip_Registration_Id=registration_ip,
                    Casuality_Registration_Id=registration_casuality,
                    Provisional_Diagnosis=row.get('provisionalDiagnosis', ''),
                    Icd_Code=row.get('icdCode', ''),
                    Type=row.get('type', 'Primary'),
                    MRN=mrn,
                    ContactNumber=contact_number,
                    Location=location,
                    Created_by=created_by,
                    MainPageCompleted=main_page_completed,
                    PageCompleted=page_completed
                )

            for row2 in rows2:
                DiagnosisData.objects.create(
                    Ip_Registration_Id=registration_ip,
                    Casuality_Registration_Id=registration_casuality,
                    Final_Diagnosis=row2.get('finalDiagnosis', ''),
                    Icd_Code2=row2.get('icdCode2', ''),
                    Type2=row2.get('type2', 'Primary'),
                    MRN=mrn,
                    ContactNumber=contact_number,
                    Location=location,
                    Created_by=created_by,
                    MainPageCompleted=main_page_completed,
                    PageCompleted=page_completed
                )

            return JsonResponse({'message': 'Diagnosis data saved successfully'})

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in POST request: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON data'})
        except Exception as e:
            logger.error(f"POST Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})

    elif request.method == 'GET':
        try:
            mrn = request.GET.get('MRN', '')
            if not mrn:
                return JsonResponse({'error': 'MRN is required'})

            diagnoses = DiagnosisData.objects.filter(MRN=mrn)
            if not diagnoses.exists():
                return JsonResponse({'data1': [], 'data2': []})

            data1 = []  
            data2 = []  

            for diag in diagnoses:
                if diag.Provisional_Diagnosis or diag.Icd_Code or diag.Type:
                    data1.append({
                        'provisionalDiagnosis': diag.Provisional_Diagnosis or '',
                        'icdCode': diag.Icd_Code or '',
                        'type': diag.Type or 'Primary'
                    })
                if diag.Final_Diagnosis or diag.Icd_Code2 or diag.Type2:
                    data2.append({
                        'finalDiagnosis': diag.Final_Diagnosis or '',
                        'icdCode2': diag.Icd_Code2 or '',
                        'type2': diag.Type2 or 'Primary'
                    })

            return JsonResponse({'data1': data1, 'data2': data2})

        except Exception as e:
            logger.error(f"GET Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})

    return JsonResponse({'error': 'Method not allowed'})



@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Auth_Form_Examination_Finding(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            MRN = data.get('MRN', '')
            ContactNumber = data.get('ContactNumber', '')
            Location = data.get('Location', '')
            CreatedBy = data.get('CreatedBy', '')
            RelevantClinicalFindings = data.get('RelevantClinicalFindings', '')
            MainPageCompleted = data.get('MainPageCompleted', '')
            PageCompleted = data.get('PageCompleted', '')

            if not MRN:
                return JsonResponse({'error': 'MRN is required'}, status=400)

            try:
                existing_record = PreAuthFormExaminationFinding.objects.get(MRN=MRN)
                existing_record.ContactNumber = ContactNumber
                existing_record.Location = Location
                existing_record.CreatedBy = CreatedBy
                existing_record.RelevantClinicalFindings = RelevantClinicalFindings
                existing_record.MainPageCompleted = MainPageCompleted
                existing_record.PageCompleted = PageCompleted
                existing_record.save()
                return JsonResponse({'success': 'Record updated successfully'})
            except PreAuthFormExaminationFinding.DoesNotExist:
                examination_data = PreAuthFormExaminationFinding(
                    MRN=MRN,
                    ContactNumber=ContactNumber,
                    Location=Location,
                    CreatedBy=CreatedBy,
                    RelevantClinicalFindings=RelevantClinicalFindings,
                    MainPageCompleted=MainPageCompleted,
                    PageCompleted=PageCompleted,
                )
                examination_data.save()
                return JsonResponse({'success': 'Record created successfully'})

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in POST request: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"POST Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == "GET":
        try:
            MRN = request.GET.get('MRN')
            if not MRN:
                return JsonResponse({'error': 'MRN is required'}, status=400)

            examination_data = PreAuthFormExaminationFinding.objects.filter(MRN=MRN)
            if not examination_data.exists():
                return JsonResponse({'data': []})

            data = [
                {
                    'MRN': record.MRN,
                    'ContactNumber': record.ContactNumber,
                    'Location': record.Location,
                    'CreatedBy': record.CreatedBy,
                    'RelevantClinicalFindings': record.RelevantClinicalFindings,
                    'MainPageCompleted': record.MainPageCompleted,
                    'PageCompleted': record.PageCompleted,
                }
                for record in examination_data
            ]
            return JsonResponse(data, safe=False)

        except Exception as e:
            logger.error(f"GET Error: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)        




@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Pre_Auth_Treatment_info(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            mrn = data.get('MRN', '')
            contact_number = data.get('ContactNumber', '')
            location = data.get('Location', '')
            created_by = data.get('createAt', '')  
            main_page_completed = data.get('MainPageCompleted', '')
            page_completed = data.get('PageCompleted', '')
            
            rows3 = json.dumps(data.get('rows3', []))
            checkbox_state_treatment = json.dumps(data.get('checkboxStateTreatment', {}))
            medical_management = data.get('medicalManagement', 'No')
            treatment_txtarea_details = data.get('TreatmentTxtareaDetails', '')
            rows4 = json.dumps(data.get('rows4', []))
            surgical_management = data.get('surgicalManagement', 'No')
            additional_surgical_options = json.dumps(data.get('additionalSurgicalOptions', []))
            
            treatment_info, created = PreAuthTreatmentInfo.objects.update_or_create(
                MRN=mrn,
                defaults={
                    'ContactNumber': contact_number,
                    'Location': location,
                    'Created_by': created_by,
                    'MainPageCompleted': main_page_completed,
                    'PageCompleted': page_completed,
                    'Rows3': rows3,
                    'CheckboxStateTreatment': checkbox_state_treatment,
                    'MedicalManagement': medical_management,
                    'TreatmentTxtareaDetails': treatment_txtarea_details,
                    'Rows4': rows4,
                    'SurgicalManagement': surgical_management,
                    'AdditionalSurgicalOptions': additional_surgical_options,
                }
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Treatment info saved successfully',
                'id': treatment_info.Id
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON format'
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
    elif request.method == 'GET':
        try:
            mrn = request.GET.get('MRN', '')
            print("MRN:",mrn)
            
            if not mrn:
                return JsonResponse({
                    'status': 'error',
                    'message': 'MRN is required'
                })
            
            try:
                treatment_info = PreAuthTreatmentInfo.objects.get(MRN=mrn)
                
                rows3 = json.loads(treatment_info.Rows3) if treatment_info.Rows3 else []
                checkbox_state_treatment = json.loads(treatment_info.CheckboxStateTreatment) if treatment_info.CheckboxStateTreatment else {}
                rows4 = json.loads(treatment_info.Rows4) if treatment_info.Rows4 else []
                additional_surgical_options = json.loads(treatment_info.AdditionalSurgicalOptions) if treatment_info.AdditionalSurgicalOptions else []
                
                response_data = {
                    'Id': treatment_info.Id,
                    'MRN': treatment_info.MRN,
                    'ContactNumber': treatment_info.ContactNumber,
                    'Location': treatment_info.Location,
                    'Created_by': treatment_info.Created_by,
                    'Created_at': treatment_info.Created_at.isoformat(),
                    'Updated_at': treatment_info.Updated_at.isoformat(),
                    'MainPageCompleted': treatment_info.MainPageCompleted,
                    'PageCompleted': treatment_info.PageCompleted,
                    'rows3': rows3,
                    'checkboxStateTreatment': checkbox_state_treatment,
                    'medicalManagement': treatment_info.MedicalManagement,
                    'TreatmentTxtareaDetails': treatment_info.TreatmentTxtareaDetails,
                    'rows4': rows4,
                    'surgicalManagement': treatment_info.SurgicalManagement,
                    'surgical_management': additional_surgical_options,  
                }
                
                return JsonResponse(response_data)
                
            except PreAuthTreatmentInfo.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No treatment info found for this MRN'
                })
            except json.JSONDecodeError:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid stored JSON data'
                })
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
from django.db.models import Q

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def FetchProcedureDetails(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            master_type = data.get('MasterType', '')
            procedure_type = data.get('Type', '')
            procedure_name = data.get('ProcedureName', '')
            is_gst = data.get('IsGst', '')
            gst_value = data.get('GSTValue', '')
            amount = data.get('Amount', '')
            created_by = data.get('created_by', '')

            if master_type == 'Procedure':
                if Procedure_Master_Details.objects.filter(
                    Procedure_Name=procedure_name, Type=procedure_type
                ).exists():
                    return JsonResponse({'warn': 'Procedure Name already exists'})

                Procedure_Master_Details.objects.create(
                    Procedure_Name=procedure_name,
                    Type=procedure_type,
                    IsGst=is_gst,
                    GstValue=gst_value,
                    Amount=amount,
                    created_by=created_by
                )
                return JsonResponse({'success': 'Procedure Details added successfully'})
            else:
                return JsonResponse({'error': 'Invalid MasterType'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        try:
            master_type = request.GET.get('MasterType')
            type_filter = request.GET.get('Type', '')
            search_by = request.GET.get('SearchBy', '')

            if master_type == 'Procedure':
                procedures = Procedure_Master_Details.objects.filter(
                    Q(Type__icontains=type_filter) & 
                    (Q(Procedure_Name__icontains=search_by) | Q(Procedure_Id__icontains=search_by))
                )
                procedure_data = [
                    {
                        'id': proc.Procedure_Id,
                        'procedure_name': proc.Procedure_Name,  # New key name
                        'type': proc.Type,
                        'is_gst': proc.IsGst,
                        'gst_value': proc.GstValue,
                        'amount': float(proc.Amount),
                        'status': 'Active' if proc.Status else 'Inactive',
                        'created_by': proc.created_by
                    }
                    for proc in procedures
                ]
                return JsonResponse(procedure_data, safe=False)
            else:
                return JsonResponse({'error': 'Invalid MasterType'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)    


@csrf_exempt
@require_http_methods(['GET'])
def get_Admission_Purpose(request):
    patient_id = request.GET.get('PatientId')
    
    admission_purposes = Patient_Admission_Detials.objects.filter(
        IP_Registration_Id__PatientId=patient_id
    ).values_list('AdmissionPurpose', flat=True).distinct()
    
    return JsonResponse(list(admission_purposes), safe=False)

@csrf_exempt
@require_http_methods(["POST", "GET"])
def Pre_Auth_Form_billing_info_details(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            billing_info = data.get('billingInfo', {})
            billing_info_data = {
                'dateofAdmission': billing_info.get('dateofAdmission', ''),
                'typeofAdmission': billing_info.get('typeofAdmission', ''),
                'durationStayinDays': billing_info.get('durationStayinDays', ''),
                'dateofSurgery': billing_info.get('dateofSurgery', ''),
                'AvailedRateCard': billing_info.get('AvailedRateCard', ''),
                'EligibleRoomType': billing_info.get('EligibleRoomType', ''),
                'CreditBill': billing_info.get('CreditBill', 'No'),
                'IsDefaultPayer': billing_info.get('IsDefaultPayer', 'No'),
                'AllAreMedicalItems': billing_info.get('AllAreMedicalItems', 'No'),
                'dateofDischarge': billing_info.get('dateofDischarge', ''),
                'DischargeTypeBilling': billing_info.get('DischargeTypeBilling', ''),
            }
            
            co_payment_details = data.get('CoPaymentDetails', {})
            co_payment_data = {
                'CoPaymentType': co_payment_details.get('CoPaymentType', ''),
                'CoPaymentTypeValue': co_payment_details.get('CoPaymentTypeValue', ''),
                'CoPaymentLogic': co_payment_details.get('CoPaymentLogic', ''),
                'CoPaymentToBeDeductedFrom': co_payment_details.get('CoPaymentToBeDeductedFrom', ''),
            }
            
            billing_record, created = PreAuthBillingInfo.objects.update_or_create(
                MRN=data.get('MRN'),
                defaults={
                    'ContactNumber': data.get('ContactNumber', ''),
                    'Location': data.get('Location', ''),
                    'Created_by': data.get('createAt', ''),
                    'MainPageCompleted': data.get('MainPageCompleted', ''),
                    'PageCompleted': data.get('PageCompleted', ''),
                    **billing_info_data,
                    'CoPaymentCoverage': data.get('CoPaymentCoverage', 'No'),
                    'CoPaymentDetails': json.dumps(co_payment_data),
                    'Billinginfolist': json.dumps(data.get('rows6', []))
                }
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Billing information saved successfully',
                'id': billing_record.Id
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
            
    elif request.method == "GET":
        try:
            mrn = request.GET.get('MRN')
            if not mrn:
                return JsonResponse({
                    'status': 'error',
                    'message': 'MRN parameter is required'
                })
                
            billing_records = PreAuthBillingInfo.objects.filter(MRN=mrn)
            if not billing_records.exists():
                return JsonResponse({
                    'status': 'success',
                    'data': {}
                })
                
            record = billing_records.first()
            response_data = {
                'Id': record.Id,
                'MRN': record.MRN,
                'ContactNumber': record.ContactNumber,
                'Location': record.Location,
                'Created_by': record.Created_by,
                'MainPageCompleted': record.MainPageCompleted,
                'PageCompleted': record.PageCompleted,
                'dateofAdmission': record.dateofAdmission,
                'typeofAdmission': record.typeofAdmission,
                'durationStayinDays': record.durationStayinDays,
                'dateofSurgery': record.dateofSurgery,
                'AvailedRateCard': record.AvailedRateCard,
                'EligibleRoomType': record.EligibleRoomType,
                'CreditBill': record.CreditBill,
                'IsDefaultPayer': record.IsDefaultPayer,
                'AllAreMedicalItems': record.AllAreMedicalItems,
                'dateofDischarge': record.dateofDischarge,
                'DischargeTypeBilling': record.DischargeTypeBilling,
                'CoPaymentCoverage': record.CoPaymentCoverage,
                'CoPaymentDetails': json.loads(record.CoPaymentDetails) if record.CoPaymentDetails else {},
                'Billinginfolist': json.loads(record.Billinginfolist) if record.Billinginfolist else []
            }
            
            return JsonResponse({
                'status': 'success',
                'data': response_data
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })





@csrf_exempt
@require_http_methods(["POST", "GET"])
def Pre_Auth_Form_Submit_Documents_data(request):
    if request.method == "POST":
        try:
            MRN = request.POST.get('MRN')
            ContactNumber = request.POST.get('ContactNumber')
            Location = request.POST.get('Location')
            createAt = request.POST.get('createAt')
            
            rows7 = json.loads(request.POST.get('rows7', '[]'))
            rows8 = json.loads(request.POST.get('rows8', '[]'))
            rows9 = json.loads(request.POST.get('rows9', '[]'))

            billing_info, created = PreAuthBillingInfo.objects.get_or_create(
                MRN=MRN,
                defaults={
                    'ContactNumber': ContactNumber,
                    'Location': Location,
                    'Created_by': createAt,
                }
            )

            def save_documents(rows, doc_type, billing_info, request_files):
                for index, row in enumerate(rows):
                    file_key = f"{doc_type}[{index}][Document_file]"
                    document_file = request_files.get(file_key)
                    document = PreAuthDocuments(
                        PreAuthBilling=billing_info,
                        DocumentType=row['Name'],
                        DocumentRemarks=row.get('Document_Remarks', ''),
                        DocumentDate=row.get('Document_Date', ''),
                        DocumentAck=row.get('Document_Ack', False)
                    )
                    if document_file:
                        document.DocumentFile = document_file
                        document.DocumentFileName = document_file.name
                        document.DocumentFileType = document_file.content_type
                    document.save()

            save_documents(rows7, 'rows7', billing_info, request.FILES)
            save_documents(rows8, 'rows8', billing_info, request.FILES)
            save_documents(rows9, 'rows9', billing_info, request.FILES)

            return JsonResponse({
                'status': 'success',
                'message': 'Documents saved successfully'
            })

        except json.JSONDecodeError as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Invalid JSON data: {str(e)}'
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    elif request.method == "GET":
        try:
            MRN = request.GET.get('MRN')
            if not MRN:
                return JsonResponse({
                    'status': 'error',
                    'message': 'MRN is required'
                })

            billing_info = PreAuthBillingInfo.objects.filter(MRN=MRN).first()
            if not billing_info:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Billing info not found'
                })

            documents = PreAuthDocuments.objects.filter(PreAuthBilling=billing_info)
            
            photo_id_data = []
            signed_form_data = []
            other_document_data = []

            for doc in documents:
                doc_data = {
                    'Name': doc.DocumentType,
                    'Document_Remarks': doc.DocumentRemarks,
                    'Document_Date': doc.DocumentDate,
                    'Document_Ack': doc.DocumentAck,
                    'DecoFile1name': doc.DocumentFileName,
                    'DecoFile1type': doc.DocumentFileType
                }
                
                if doc.DocumentFile and os.path.exists(doc.DocumentFile.path):
                    with open(doc.DocumentFile.path, 'rb') as file:
                        doc_data['Document_file'] = base64.b64encode(file.read()).decode('utf-8')

                if doc.DocumentType == 'photoIdentityCard':
                    photo_id_data.append(doc_data)
                elif doc.DocumentType == 'signedForm':
                    signed_form_data.append(doc_data)
                elif doc.DocumentType == 'otherDocument':
                    other_document_data.append(doc_data)

            return JsonResponse({
                'status': 'success',
                'photo_id_data': photo_id_data,
                'signed_form_data': signed_form_data,
                'other_document_data': other_document_data
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })



         
            
            
            