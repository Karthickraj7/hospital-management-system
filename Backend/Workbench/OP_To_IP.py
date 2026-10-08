

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json




@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def insert_op_ip_convertion(request):
    if request.method == "POST":
        try:
            # Load the request body as JSON
            data = json.loads(request.body)

            # Ensure data is a dictionary
            if isinstance(data, dict):
                patient_id_str = data.get('Patient_id')
                registration_id = data.get('Registration_id')
                reason = data.get('Reason')
                IpNotes = data.get('IpNotes')
                created_by = data.get('Created_by')

                # Retrieve the Patient_Detials instance
                try:
                    patient_instance = Patient_Detials.objects.get(pk=patient_id_str)
                except Patient_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Patient ID not found'}, status=404)

                # Check if the patient has already been admitted
                alertdata = Op_to_Ip_Convertion_Table.objects.filter(Registration_id=registration_id)

                if alertdata.exists():
                    return JsonResponse({'warn': 'Patient already admitted'})

                # Retrieve the Patient_Appointment_Registration_Detials instance
                try:
                    registration_instance = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
                except Patient_Appointment_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Registration ID not found'}, status=404)

                # Save the data in the Op_to_Ip_Convertion_Table if the patient is not already admitted
                convertion_data = Op_to_Ip_Convertion_Table(
                    Patient_Id=patient_instance,  # Use the instance instead of the ID
                    Registration_id=registration_instance,  # Use the instance instead of the ID
                    Reason=reason,
                    IpNotes=IpNotes,
                    created_by=created_by,  # Assuming Created_by is just a string or user ID
                    Status = 'Pending'
                )
                convertion_data.save()
                
                return JsonResponse({'success': 'Request Que added successfully'})
            else:
                # If data is not a dictionary, it's an error in the request format
                return JsonResponse({'error': 'Invalid data format'}, status=400)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            requestdata = Op_to_Ip_Convertion_Table.objects.filter(Status='Pending')
            Requestlist = []

            for data in requestdata:
                patient_details = data.Registration_id.PatientId  # Assuming this is a ForeignKey to Patient_Detials
                request = {
                    'id' : data.id,
                    'PatientId': patient_details.pk,  # Use the primary key of the patient
                    'Registration_id': data.Registration_id.pk,  # Use the primary key of the registration
                    'Reason': data.Reason,
                    'IpNotes': data.IpNotes,
                    'Patient_Name': f'{patient_details.FirstName} {patient_details.MiddleName} {patient_details.SurName}',
                    'Age': patient_details.Age,
                    'Status' : data.Status
                }
                Requestlist.append(request)

            return JsonResponse(Requestlist, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)







