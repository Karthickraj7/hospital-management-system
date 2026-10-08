

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json
from django.forms.models import model_to_dict



@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def insert_Emg_To_IP_convertion(request):
    if request.method == "POST":
        try:
            # Load the request body as JSON
            data = json.loads(request.body)
            
            print(data,'dataaaaaaaaaaaaaa')
            if isinstance(data, dict):

                patient_id_str = data.get('Patient_id')
                registration_id = data.get('Registration_id')
                reason = data.get('Reason')
                IpNotes = data.get('IpNotes')
                DischargePerson = data.get('DischargePerson')
                created_by = data.get('Created_by')
                Employeeid = data.get('Employeeid')

                # Retrieve the Patient_Detials instance
                try:
                    patient_instance = Patient_Detials.objects.get(pk=patient_id_str)
                except Patient_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Patient ID not found'})

                # Check if the patient has already been admitted
               
                # Retrieve the Patient_Emergency_Registration_Detials instance
            
                registration_instance = Patient_Emergency_Registration_Detials.objects.get(Registration_Id=registration_id) if registration_id else None
                Employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=Employeeid) if Employeeid else None
                
                if registration_instance:  # Ensure instance is not None before updating
                    # Update the Status field before insertion
                    alertdata = Emg_to_IP_Convertion_Table.objects.filter(EmgRegistration_id=registration_instance)

                    if alertdata.exists():
                        return JsonResponse({'warn': 'Patient already admitted'})

                    
                    
                    registration_instance.Status = 'Completed'
                    registration_instance.save()


                # Save the data in the Emg_to_IP_Convertion_Table if the patient is not already admitted
                convertion_data = Emg_to_IP_Convertion_Table(
                    Patient_Id=patient_instance,  # Use the instance instead of the ID
                    EmgRegistration_id=registration_instance,  # Use the instance instead of the ID
                    Reason=reason,
                    IpNotes=IpNotes,
                    DischargePerson=DischargePerson,
                    Employeeid=Employee_instance,
                    created_by=created_by,  # Assuming Created_by is just a string or user ID
                    Status = 'Pending'
                )
                convertion_data.save()

                

                response_data = model_to_dict(convertion_data)
                return JsonResponse({'success': 'Emergency to IP Request Que added successfully','data':response_data})
            else:
                # If data is not a dictionary, it's an error in the request format
                return JsonResponse({'error': 'Invalid data format'})
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'})

        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            requestdata = Emg_to_IP_Convertion_Table.objects.filter(Status='Pending')
            Requestlist = []

            for data in requestdata:
                patient_details = data.EmgRegistration_id.PatientId  # Assuming this is a ForeignKey to Patient_Detials
                request = {
                    'id' : data.id,
                    'TitleId' : patient_details.Title.Title_Id if patient_details.Title else '',

                    'PatientId': patient_details.pk,  # Use the primary key of the patient
                    'Registration_id': data.EmgRegistration_id.pk,  # Use the primary key of the registration
                    'FirstName': patient_details.FirstName if patient_details else '',  
                    'MiddleName': patient_details.MiddleName if patient_details else '',  
                    'LastName': patient_details.SurName if patient_details else '',  
                    'Gender': patient_details.Gender if patient_details else '',  
                    'MaritalStatus': patient_details.MaritalStatus if patient_details else '',  
                    'SpouseName': patient_details.SpouseName if patient_details else '',  
                    'FatherName': patient_details.FatherName if patient_details else '',  
                    'Age': patient_details.Age if patient_details else '',
                    'DOB': patient_details.DOB if patient_details else '',
                    'Reason': data.Reason,
                    'IpNotes': data.IpNotes,
                    'Patient_Name': f"""{patient_details.Title.Title_Name if patient_details.Title else ''}.{patient_details.FirstName if patient_details else ''} {patient_details.MiddleName if patient_details else ''} {patient_details.SurName if patient_details else ''}""",
                    'ABHA': patient_details.ABHA,
                    'PhoneNumber': patient_details.PhoneNo if patient_details else '',
                    'Email': patient_details.Email if patient_details else '',
                    'BloodGroup': patient_details.BloodGroup.BloodGroup_Id if patient_details.BloodGroup else '',
                    'Occupation': patient_details.Occupation if patient_details else '',
                    'Religion': patient_details.Religion.Religion_Id if patient_details.Religion else '',
                    'Nationality': patient_details.Nationality if patient_details else '',
                    'UniqueIdType': patient_details.UniqueIdType if patient_details else '',
                    'UniqueIdNo': patient_details.UniqueIdNo if patient_details else '',
                    'PatientType': patient_details.PatientType if patient_details else '',
                    
                     'Pincode': patient_details.Pincode if patient_details else '',
                    'DoorNo': patient_details.DoorNo if patient_details else '',
                    'Street': patient_details.Street if patient_details else '',
                    'Area': patient_details.Area if patient_details else '',
                    'City': patient_details.City if patient_details else '',
                    'District': patient_details.District if patient_details else '',
                    'State': patient_details.State if patient_details else '',
                    'Country': patient_details.Country if patient_details else '',
                   
                    'PermanentPincode': patient_details.PermanentPincode if patient_details else '',
                    'PermanentdoorNo': patient_details.PermanentdoorNo if patient_details else '',
                    'PermanentStreet': patient_details.PermanentStreet if patient_details else '',
                    'PermanentArea': patient_details.PermanentArea if patient_details else '',
                    'PermanentCity': patient_details.PermanentCity if patient_details else '',
                    'PermanentDistrict': patient_details.PermanentDistrict if patient_details else '',
                    'PermanentState': patient_details.PermanentState if patient_details else '',
                    'PermanentCountry': patient_details.PermanentCountry if patient_details else '',
                    
                    'Status' : data.Status,
                }
                Requestlist.append(request)

            return JsonResponse(Requestlist, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)































