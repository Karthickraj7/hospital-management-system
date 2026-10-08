from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils.timezone import now
from Frontoffice.models import *
from datetime import datetime, date
from django.db.models import Q



@csrf_exempt    
@require_http_methods(['POST', 'GET',"OPTIONS"])
def RadiologyVitals_Form_Details_Link(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            print(data, 'data')

            # Extract data from the request
            RegistrationId = data.get("RegistrationId", '')
            RegisterType = data.get("Registertype", '')
            Bp = data.get("Bp",'')
            temperature = data.get("Temperature", '')
            spo2 = data.get("SPO2", '')
            heartrate = data.get("HeartRate", '')
            respiratoryrate = data.get("RespiratoryRate", '')
            height = data.get("Height", '')
            weight = data.get("Weight", '')
            createdby = data.get("Createdby", '')

            # Validation: Check for missing fields
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing RegistrationId'})
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'})

            # Initialize registration instance
            registration_instance = None

            # Query the appropriate model based on RegisterType
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "ExternalRadiology":
                registration_instance = Patient_Diagnosis_Registration_Detials.objects.filter(pk=RegistrationId).first()
                if registration_instance:
                    print("registration_instance Complaint:", registration_instance.Complaint)
                else:
                    print("No registration instance found for External Radiology.")

            # Check if a valid registration instance was found
            if not registration_instance:
                return JsonResponse({'error': f'Invalid registration ID or RegisterType: {RegisterType}'})

            # Process and save the form data
            Radiology_vital_instance = Patient_Radiology_Vital_Details(
                RegisterType=RegisterType,
                OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                Diagnosis_Register_Id=registration_instance if RegisterType == "ExternalRadiology" else None,
                Bp = Bp,
                Temperature=temperature,
                SPO2=spo2,
                Heart_Rate=heartrate,
                Respiratory_Rate=respiratoryrate,
                Height=height,
                Weight=weight,
                Created_by=createdby,
            )
            Radiology_vital_instance.save()

            return JsonResponse({'success': 'RadiologyVitals saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId', None)
            RegisterType = request.GET.get('Registertype', None)
            
            if not RegistrationId or not RegisterType:
                return JsonResponse({'warn': 'Missing RegistrationId or RegisterType'})

            # Fetch the relevant radiology vital details based on the RegisterType and RegistrationId
            radiology_vital_details = Patient_Radiology_Vital_Details.objects.filter(
                RegisterType=RegisterType
            )

            if RegisterType == 'OP':
                radiology_vital_details = radiology_vital_details.filter(OP_Register_Id=RegistrationId)
            elif RegisterType == 'IP':
                radiology_vital_details = radiology_vital_details.filter(IP_Register_Id=RegistrationId)
            elif RegisterType == 'Casuality':
                radiology_vital_details = radiology_vital_details.filter(Casuality_Register_Id=RegistrationId)
            elif RegisterType == 'ExternalRadiology':
                radiology_vital_details = radiology_vital_details.filter(Diagnosis_Register_Id=RegistrationId)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'})

            # Check if data exists
            if not radiology_vital_details.exists():
                return JsonResponse({'warn': 'No radiology details found for the given RegistrationId and RegisterType'})

            # Prepare the response data with index and RegistrationId
            response_data = []
            for index, vital_detail in enumerate(radiology_vital_details, start=1):
                
                response_data.append ({
                    'id': index,
                    'RegistrationId': RegistrationId,
                    'RegisterType': vital_detail.RegisterType,
                    'Bp':vital_detail.Bp,
                    'Temperature': vital_detail.Temperature,
                    'SPO2': vital_detail.SPO2,
                    'HeartRate': vital_detail.Heart_Rate,
                    'RespiratoryRate': vital_detail.Respiratory_Rate,
                    'Height': vital_detail.Height,
                    'Weight': vital_detail.Weight,
                    'CreatedBy': vital_detail.Created_by,
                    'CreatedAt': vital_detail.created_at,
                    'Date': vital_detail.created_at.strftime('%d-%m-%y'), 
                    'Time' : vital_detail.created_at.strftime('%H:%M:%S'),
                })
                index +=1
                

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])  
def Radiology_Medical_History_Details(request):
    if request.method == 'POST':    
        try:
            data = json.loads(request.body)
            RegistrationId = data.get("RegistrationId", '')
            RegisterType = data.get("Registertype", '')
            created_by = data.get('created_by', '')
            other = data.get('Other', '')
            illnessordiseases = data.get('illnessordiseases', '')
            illnessordiseasesText = data.get('illnessordiseasesText', '')
            surgerybefore = data.get('surgerybefore', '')
            surgerybeforeText = data.get('surgerybeforeText', '')
            pressureorheartdiseases = data.get('pressureorheartdiseases', '')
            pressureorheartdiseasesText = data.get('pressureorheartdiseasesText', '')
            allergicmedicine = data.get('allergicmedicine', '')
            allergicmedicineText = data.get('allergicmedicineText', '')
            diabetesorAsthmadisease = data.get('diabetesorAsthmadisease', '')
            diabetesorAsthmadiseaseText = data.get('diabetesorAsthmadiseaseText', '')
            localanesthesiabefore = data.get('localanesthesiabefore', '')
            localanesthesiabeforeText = data.get('localanesthesiabeforeText', '')
            healthproblems = data.get('healthproblems', '')
            healthproblemsText = data.get('healthproblemsText', '')
            regularbasis = data.get('regularbasis', '')
            regularbasisText = data.get('regularbasisText', '')
            allergicfood = data.get('allergicfood', '')
            allergicfoodText = data.get('allergicfoodText', '')
            alreadytakentest = data.get('alreadytakentest','')
            alreadytakentestText = data.get('alreadytakentestText','')
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing RegistrationId'})
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'})

            # Initialize registration instance
            registration_instance = None

            # Query the appropriate model based on RegisterType
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "ExternalRadiology":
                registration_instance = Patient_Diagnosis_Registration_Detials.objects.filter(pk=RegistrationId).first()
                if registration_instance:
                    print("registration_instance Complaint:", registration_instance.Complaint)
                else:
                    print("No registration instance found for External Radiology.")

            # Check if a valid registration instance was found
            if not registration_instance:
                return JsonResponse({'error': f'Invalid registration ID or RegisterType: {RegisterType}'})
            
            Radiology_medical_history_instance = Radiology_Medical_History(
                RegisterType=RegisterType,
                OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                Diagnosis_Register_Id=registration_instance if RegisterType == "ExternalRadiology" else None,
                Illnessordiseases=illnessordiseases,
                IllnessordiseasesText=illnessordiseasesText,
                Surgerybefore=surgerybefore,
                SurgerybeforeText=surgerybeforeText,
                Pressureorheartdiseases=pressureorheartdiseases,
                PressureorheartdiseasesText=pressureorheartdiseasesText,
                Allergicmedicine=allergicmedicine,
                AllergicmedicineText=allergicmedicineText,
                Alreadytakentest = alreadytakentest,
                AlreadytakentestText = alreadytakentestText,
                DiabetesorAsthmadisease=diabetesorAsthmadisease,
                DiabetesorAsthmadiseaseText=diabetesorAsthmadiseaseText,
                Localanesthesiabefore=localanesthesiabefore,
                LocalanesthesiabeforeText=localanesthesiabeforeText,
                Healthproblems=healthproblems,
                HealthproblemsText=healthproblemsText,
                Regularbasis=regularbasis,
                RegularbasisText=regularbasisText,
                Allergicfood=allergicfood,
                AllergicfoodText=allergicfoodText,
                Other=other,
                created_by=created_by
            )
            Radiology_medical_history_instance.save()
            return JsonResponse({'success': 'Medical PastHistory details added successfully'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
                
    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId', None)
            print("RegistrationIdPast",RegistrationId)
            RegisterType = request.GET.get('Registertype', None)
            print("RegisterType",RegisterType)

            if not RegistrationId or not RegisterType:
                return JsonResponse({'warn': 'Missing RegistrationId or RegisterType'})  

            # Filter radiology medical history details based on RegisterType
            radiology_medical_history_details = Radiology_Medical_History.objects.filter(
                RegisterType=RegisterType 
            )
            
            # Apply additional filters based on RegisterType
            if RegisterType == 'OP':
                radiology_medical_history_details = radiology_medical_history_details.filter(OP_Register_Id=RegistrationId)
            elif RegisterType == 'IP':
                radiology_medical_history_details = radiology_medical_history_details.filter(IP_Register_Id=RegistrationId)
            elif RegisterType == 'Casuality':
                radiology_medical_history_details = radiology_medical_history_details.filter(Casuality_Register_Id=RegistrationId)
            elif RegisterType == 'ExternalRadiology':
                radiology_medical_history_details = radiology_medical_history_details.filter(Diagnosis_Register_Id=RegistrationId)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'})
            
            # Check if there are any results
            if not radiology_medical_history_details.exists():
                return JsonResponse({'warn': 'No past medical history found for the given RegistrationId and RegisterType'})

            # Prepare the response data
            response_data = []
            for index, medical_history in enumerate(radiology_medical_history_details, start=1):
                response_data.append({
                    'id': index,
                    'RegistrationId': RegistrationId,
                    'RegisterType': medical_history.RegisterType,
                    'illnessordiseases': medical_history.Illnessordiseases,
                    'illnessordiseasesText': medical_history.IllnessordiseasesText,
                    'surgerybefore': medical_history.Surgerybefore,
                    'surgerybeforeText': medical_history.SurgerybeforeText,
                    'pressureorheartdiseases': medical_history.Pressureorheartdiseases,
                    'pressureorheartdiseasesText': medical_history.PressureorheartdiseasesText,
                    'Alreadytakentest': medical_history.Alreadytakentest,
                    'AlreadytakentestText': medical_history.AlreadytakentestText,
                    'allergicmedicine': medical_history.Allergicmedicine,
                    'allergicmedicineText': medical_history.AllergicmedicineText,
                    'diabetesorAsthmadisease': medical_history.DiabetesorAsthmadisease,
                    'diabetesorAsthmadiseaseText': medical_history.DiabetesorAsthmadiseaseText,
                    'localanesthesiabefore': medical_history.Localanesthesiabefore,
                    'localanesthesiabeforeText': medical_history.LocalanesthesiabeforeText,
                    'healthproblems': medical_history.Healthproblems,
                    'healthproblemsText': medical_history.HealthproblemsText,
                    'regularbasis': medical_history.Regularbasis,
                    'regularbasisText': medical_history.RegularbasisText,
                    'allergicfood': medical_history.Allergicfood,
                    'allergicfoodText': medical_history.AllergicfoodText,
                    'other': medical_history.Other,
                    'created_by': medical_history.created_by,
                    'Date': medical_history.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time': medical_history.created_at.strftime('%H:%M:%S'),  # Format time
                })

            return JsonResponse(response_data, safe=False)  # Return the data as JSON
            
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"]) 
def Radiology_MedicalSection_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data34", data)
            RegistrationId = data.get("RegistrationId", '')
            RegisterType = data.get("Registertype", '')
            SelectedMedicines = data.get('SelectedMedicine', [])
            createdby = data.get('Createdby', '')
            
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing RegistrationId'})
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'})

            registration_instance = None
            
            # Get the registration instance based on RegisterType
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "ExternalRadiology":
                registration_instance = Patient_Diagnosis_Registration_Detials.objects.filter(pk=RegistrationId).first()

            # Check if a valid registration instance was found
            if not registration_instance:
                return JsonResponse({'error': f'Invalid registration ID or RegisterType: {RegisterType}'})
            
            # Loop through each selected medicine and create an entry in the database
            for medicine in SelectedMedicines:
                ContrastType = medicine.get("ContrastType", "")
                PreTestMedications = medicine.get("PreTestMedications", "")
                Allergic = medicine.get("Allergic", False)
                Medication_Name = medicine.get("MedicationName", "")
                Dosage = medicine.get("Dosage", "")
                Route = medicine.get("Route", "")
                AdministrationDate = data.get("CurrentDate", None)
                AdministrationTime = data.get("CurrentTime", None)
                TechniciansRemarks = medicine.get("TechniciansRemarks", "")
                PatientConcern = data.get("PatientConsult", False)

                Radiology_MedicalSection_Details_ins = Radiology_Medication_Section_Details(
                    RegisterType=RegisterType,
                    OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                    IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                    Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                    Diagnosis_Register_Id=registration_instance if RegisterType == "ExternalRadiology" else None,
                    ContrastType=ContrastType,
                    PreTestMedications=PreTestMedications,
                    Allergic=Allergic,
                    Medication_Name=Medication_Name,
                    Dosage=Dosage,
                    Route=Route,
                    AdministrationDate=AdministrationDate,
                    AdministrationTime=AdministrationTime,
                    TechniciansRemarks=TechniciansRemarks,
                    PatientConcern=PatientConcern,
                    Created_by=createdby
                )
                Radiology_MedicalSection_Details_ins.save()
            
            return JsonResponse({'success': 'Medical Section saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId', None)
            RegisterType = request.GET.get('Registertype', None)
            
            if not RegistrationId or not RegisterType:
                return JsonResponse({'warn': 'Missing RegistrationId or RegisterType'}, status=400)

            # Fetch the relevant radiology medication details based on the RegisterType and RegistrationId
            radiolody_medication_details = Radiology_Medication_Section_Details.objects.filter(RegisterType=RegisterType)  
            
            if RegisterType == 'OP':
                radiolody_medication_details = radiolody_medication_details.filter(OP_Register_Id=RegistrationId)
            elif RegisterType == 'IP':
                radiolody_medication_details = radiolody_medication_details.filter(IP_Register_Id=RegistrationId)
            elif RegisterType == 'Casuality':
                radiolody_medication_details = radiolody_medication_details.filter(Casuality_Register_Id=RegistrationId)
            elif RegisterType == 'ExternalRadiology':
                radiolody_medication_details = radiolody_medication_details.filter(Diagnosis_Register_Id=RegistrationId)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)

            # Check if data exists
            if not radiolody_medication_details.exists():
                return JsonResponse({'warn': 'No medication details found for the given RegistrationId and RegisterType'}, status=404)

            # Prepare response data
            response_data = []
            for index, medication_details in enumerate(radiolody_medication_details, start=1):
                formatted_date = datetime.strptime(str(medication_details.AdministrationDate), '%Y-%m-%d').strftime('%d-%m-%Y')

                response_data.append({
                    'id': index,
                    'RegistrationId': RegistrationId,
                    'RegisterType': medication_details.RegisterType,
                    'ContrastType': medication_details.ContrastType,
                    'PreTestMedications': medication_details.PreTestMedications,
                    'Allergic': medication_details.Allergic,
                    'Medication_Name': medication_details.Medication_Name,
                    'Dosage': medication_details.Dosage,
                    'Route': medication_details.Route,
                    'AdministrationDate': formatted_date,
                    'AdministrationTime': medication_details.AdministrationTime,
                    'TechniciansRemarks': medication_details.TechniciansRemarks,
                    'PatientConcern': medication_details.PatientConcern,
                    'Created_by': medication_details.Created_by
                })

            # Return the response data
            return JsonResponse(response_data, safe=False)    

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        



