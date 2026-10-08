from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from .serializers import *




@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def Insert_Ip_Procedure_Order(request):
    from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import IP_Therapy_order_Details, Patient_Detials, Patient_Visit_Detials, Patient_Appointment_Registration_Detials, Doctor_Personal_Form_Detials, Speciality_Detials, TherapyType_Detials, Location_Detials

@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def Insert_Ip_Procedure_Order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data) 

            for item in data:
               
                try:
                 
                    patient = Patient_Detials.objects.get(PatientId=item['Patient_id'])
                    visit = Patient_Visit_Detials.objects.get(PatientId=item['Patient_id'])
                    registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=item['Registration_Id'])
                    doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=item['DoctorName'])
                    speciality = Speciality_Detials.objects.get(Speciality_Id=item['Speciality_Name'])
                    therapy = TherapyType_Detials.objects.get(TherapyType_Id=item['Therapy_Name'])
                    location = Location_Detials.objects.get(Location_Id=item['Location'])

                  
                    order = IP_Therapy_order_Details(
                        Patient_id=patient,
                        Visit_id=visit,
                        Registration_Id=registration,
                        AppointmentDate=item['AppointmentDate'],
                        DoctorName=doctor,
                        Speciality_Name=speciality,
                        Therapy_Name=therapy,
                        Sub_Therapy_Name=item['Sub_Therapy_Name'],
                        Sessions=item['Sessions'],
                        Completed_Sessions=item['Completed_Sessions'],
                        Remaining_Sessions=item['Remaining_Sessions'],
                        Status=item['Status'],
                        createdBy=item['createdBy'],
                        Location=location
                    )

                  
                    order.save()

                except Exception as e:
                  
                    return JsonResponse({"error": str(e)}, status=400)
                
            return JsonResponse({"success": "Order created successfully."}, status=201)

        except Exception as e:
            
            return JsonResponse({"Error": str(e)}, status=500)

    elif request.method == 'GET':
        try:
            Patient_id = request.GET.get('Patientid')
            Visit_id = request.GET.get('Visitid')

            orders_instance = IP_Therapy_order_Details.objects.filter(Patient_id=Patient_id, Visit_id=Visit_id)
            orders_data = []

            for index, order in enumerate(orders_instance, start=1):  # Adding index to start from 1
                order_data = {
                    "id": index,
                    "orderid": order.Therapy_order_id,  # Add an 'id' field that corresponds to the index
                    "Patient_id": order.Patient_id.PatientId, 
                    "Visit_id": order.Visit_id.VisitId, 
                    "AppointmentDate": order.AppointmentDate,
                    "DoctorId": order.DoctorName.Doctor_ID, 
                    "Doctor_Name": order.DoctorName.ShortName,  
                    "Speciality_Name": order.Speciality_Name.Speciality_Name,
                    "Registration_Id": order.Registration_Id.Registration_Id,
                    # "Therapist_Name": order.Therapist_Name.Employee_ID,  
                    # "Therapy_Id": order.Therapy_Name.TherapyType_Id,
                    "Therapy_Name": order.Therapy_Name.Therapy_Name, 
                    "Sub_Therapy_Name": order.Sub_Therapy_Name,
                    "Sessions": order.Sessions,
                    "Status": order.Status,
                    "createdBy": order.createdBy,
                    "Location": order.Location.Location_Name, 
                    "Completed_Session": order.Completed_Sessions,
                    "Remaining_Sessions": order.Remaining_Sessions
                }
                orders_data.append(order_data)

            return JsonResponse(orders_data, safe=False)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({'Error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def Stop_Ip_Procedure_Order(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            
            # Extract the necessary data from the request
            orderid = data.get('orderid')
            patientid = data.get('Patient_id')
            visitid = data.get('Visit_id')
            
            # Fetch the order instance based on the provided details
            orderinstance = IP_Therapy_order_Details.objects.filter(
                Therapy_order_id=orderid,
                Patient_id=patientid,
                Visit_id=visitid
            ).first()  
            if orderinstance:
                orderinstance.Status = 'Stopped'
                orderinstance.save()

                # Return success response
                return JsonResponse({"message": "Order stopped successfully."}, status=200)
            else:
                # If no matching order found, return error response
                return JsonResponse({"error": "Order not found."}, status=404)

        except Exception as e:
            # Return any general errors that occur
            return JsonResponse({"error": str(e)}, status=500)


def Get_therapy_request_for_therapist(request):
    try:
        # Get all orders where Status is not 'Complete' or 'Stopped'
        orders_instance = IP_Therapy_order_Details.objects.exclude(Status__in=['Completed', 'Stopped'])

        seen = set() 
        orders_data = []

        for index, order in enumerate(orders_instance, start=1):  # Adding index to start from 1
            patient_visit_pair = (order.Patient_id.PatientId, order.Visit_id.VisitId, order.Speciality_Name.Speciality_Name)

            # Skip if this combination of Patient_id and Visit_id has already been seen
            if patient_visit_pair not in seen:
                seen.add(patient_visit_pair)
                
                order_data = {
                    "id": index,
                    "Patient_id": order.Patient_id.PatientId, 
                    "PatientName": order.Patient_id.FirstName,
                    "PhoneNo": order.Patient_id.PhoneNo,
                    "Visit_id": order.Visit_id.VisitId, 
                    "AppointmentDate": order.AppointmentDate,
                    "DoctorId": order.DoctorName.Doctor_ID, 
                    "Doctor_Name": order.DoctorName.ShortName,  
                    "Speciality_Name": order.Speciality_Name.Speciality_Name,
                    "Registration_id": order.Registration_Id.Registration_Id,
                    "Age": order.Patient_id.Age,
                    "DOB": order.Patient_id.DOB,
                    "Gender": order.Patient_id.Gender
                },
                orders_data.append(order_data)

        return JsonResponse(orders_data, safe=False)

    except Exception as e:
        print("Error:", e)
        return JsonResponse({'Error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(['GET', 'POST', 'OPTIONS'])
def Insert_therapy_information(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)

            patientid = data.get('Patient_id')
            visitid = data.get('Visit_id')
            Registrationid = data.get('Registration_Id')
            AlreadyTherapyTaken= data.get('AlreadyTherapyTaken')
            CompletedDate = data.get('CompletedDate')
            BeforeTherapyConditions = data.get('BeforeTherapyConditions')
            OnTherapyConditions = data.get('OnTherapyConditions')
            AfterTherapyConditions = data.get('AfterTherapyConditions')
            NextReviewDate = data.get('NextReviewDate')
            createdBy =   data.get('createdBy')
            Location = data.get('Location')

            patient = Patient_Detials.objects.get(PatientId= patientid)
            visit = Patient_Visit_Detials.objects.get(PatientId=patientid)
            registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=Registrationid)
            location = Location_Detials.objects.get(Location_Id=Location)

           
            if CompletedDate:
                try:
                    CompletedDate = datetime.strptime(CompletedDate, '%Y-%m-%d').date()
                except ValueError:
                    return JsonResponse({"error": "Invalid date format for CompletedDate. It must be in YYYY-MM-DD format."})
            else:
                CompletedDate = 'None'  

            inforamtion =  Therapy_Informations_for_Patient(
                Patient_id = patient,
                Visit_id = visit,
                Registration_Id = registration,
                AlreadyTherapyTaken = AlreadyTherapyTaken,
                CompletedDate = CompletedDate,
                BeforeTherapyConditions = BeforeTherapyConditions,
                OnTherapyConditions = OnTherapyConditions,
                AfterTherapyConditions =AfterTherapyConditions,
                NextReviewDate = NextReviewDate,
                createdBy = createdBy,
                Location = location
            )
            
            inforamtion.save()
            return JsonResponse({"success": "Information Saved Successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}) 
        
    elif request.method == 'GET':
        try:

            Patient_id = request.GET.get('Patientid')
            Visit_id = request.GET.get('Visitid')

            information = Therapy_Informations_for_Patient.objects.filter(Patient_id = Patient_id, Visit_id= Visit_id)
            result = []
            for item in information:
                inforamtion_data = {
                    "Informationid" : item.Information_id,
                    "Patientid": item.Patient_id.PatientId,
                    "PatientName": item.Patient_id.FirstName,
                    "Visitid" : item.Visit_id.VisitId,
                    "Registration_Id": item.Registration_Id.Registration_Id,
                    "AlreadyTherapyTaken":item.AlreadyTherapyTaken,
                    "CompletedDate": item.CompletedDate,
                    "BeforeTherapyConditions": item.BeforeTherapyConditions,
                    "OnTherapyConditions": item.OnTherapyConditions,
                    "AfterTherapyConditions": item.AfterTherapyConditions,
                    "NextReviewDate": item.NextReviewDate,
                    "createdBy": item.createdBy
                }
                result.append(inforamtion_data)

            return JsonResponse(result, safe=False)    
        except Exception as e:
            print("error", e)
            return JsonResponse({"error": str(e)})



@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def Insert_Into_Medicstions_Table(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            print(data, 'Received Data')

            # Validate required fields
            required_fields = [
                'Patient_id', 'Registration_Id', 'Location', 'GenericId', 
                'ItemName', 'ItemType', 'Dose', 'Allergic', 'AdministrationDate', 
                'TechniciansRemarks', 'BeforeMedications', 'AfterMedications', 'createdBy'
            ]
            for field in required_fields:
                if field not in data:
                    return JsonResponse({'Error': f'Missing field: {field}'}, status=400)

            # Querying the necessary models
            patient = Patient_Detials.objects.get(PatientId=data['Patient_id'])
            
            # Assuming VisitId should be used for lookup, not PatientId.
            visit = Patient_Visit_Detials.objects.get(PatientId=data['Patient_id'])
            registration = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=data['Registration_Id'])
            location = Location_Detials.objects.get(Location_Id=data['Location'])
            generic = GenericName_Master_Details.objects.get(GenericName_Id=data['GenericId'])
            item = Product_Master_All_Category_Details.objects.get(ItemName=data['ItemName'])

            # Ensure the 'AdministrationDate' is a valid date format
            try:
                administration_date = datetime.strptime(data['AdministrationDate'], "%Y-%m-%d").date()
            except ValueError:
                return JsonResponse({'Error': 'Invalid AdministrationDate format. Expected format: YYYY-MM-DD'}, status=400)

            # Create and save the Medications_for_Therapy instance
            medication = Medications_for_Therapy(
                Patientid=patient,
                Visit_Id=visit,
                Registration_id=registration,
                Generic_id=generic,
                Item_id=item,
                ItemType=data['ItemType'],
                Dose=data['Dose'],
                Allergic=data['Allergic'],
                AdministrationDate=administration_date,
                TechniciansRemarks=data['TechniciansRemarks'],
                BeforeMedications=data['BeforeMedications'],
                AfterMedications=data['AfterMedications'],
                createdBy=data['createdBy'],
                Location=location,
            )

            medication.save()

            return JsonResponse({'success': 'Medications Saved Successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'Error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(e,'errror')
            return JsonResponse({'Error': str(e)}, status=500)

    elif request.method == 'GET':
        try:
            
            Patientid = request.GET.get('Patientid')
            Visitid = request.GET.get('Visitid')

            medications= Medications_for_Therapy.objects.filter(Patientid=Patientid,Visit_Id=Visitid )
            result = []
            for medic in medications:
                data = {
                    'Id' :medic.Medication_id,
                    'Patientname': medic.Patientid.FirstName,
                    'Visitid': medic.Visit_Id.VisitId,
                    'GenericName': medic.Generic_id.GenericName,
                    'ItemName': medic.Item_id.ItemName,
                    'ItemType': medic.ItemType,
                    'Dose': medic.Dose,
                    'Allergic': medic.Allergic,
                    'Remarks': medic.TechniciansRemarks,
                    'BeforeCondition': medic.BeforeMedications,
                    'AfterMedications': medic.AfterMedications,
                    'CreatedBy': medic.createdBy,
                }
                result.append(data)
               
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({'Error': str(e)})
        


@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def Insert_Completed_therapy(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data, 'datat')

            # Fetch the relevant records
            patient = Patient_Detials.objects.get(PatientId=data['Patient_id'])
            visit = Patient_Visit_Detials.objects.get(PatientId=data['Patient_id'])
            therapy = IP_Therapy_order_Details.objects.get(Therapy_order_id=data['OrderId'])
            location = Location_Detials.objects.get(Location_Id=data['Location'])

            # Update the Completed_Sessions and Remaining_Sessions in the therapy order
            therapy.Completed_Sessions += 1  # Increment completed sessions by 1
            therapy.Remaining_Sessions -= 1  # Decrement remaining sessions by 1
            therapy.save()  # Save the updated therapy record

            # Create a new record for Therapist_Complete_Data
            complete = Therapist_Complete_Data(
                PatientId=patient,
                VisitId=visit,
                TherapyOrderId=therapy,
                CompletedDate=data['Currentdate'],
                Remarks=data['Remarks'],
                CreatedBy=data['createdBy'],
                Location=location
            )

            complete.save()  # Save the completed therapy record

            return JsonResponse({'success': 'Completed Successfully'})

        except Exception as e:
            return JsonResponse({'Error': str(e)})
