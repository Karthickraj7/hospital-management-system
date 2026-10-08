from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json
from django.db.models import Avg 

@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def insert_into_feedback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data", data)

            # Get the input values from the request body
            IdentifyId = data.get('IdentifyId')
            IdentifcationName = data.get('IdentifcationName')
            Ratings = data.get('Ratings')
            feedback = data.get('feedback')
            Comments = data.get('Comments')
            Name = data.get('Name')
            Phone = data.get('Phone')
            QRtype = data.get('qrname')

            # Initialize identification_object and content_type as None
            identification_object = None
            content_type = None

            # Fetch the related model instance for IdentifyId if it's a ForeignKey or GenericForeignKey
            if IdentifyId:
                if QRtype == 'Floor':
                    try:
                        # Fetch the related object based on IdentifyId and QRtype
                        identification_object = Floor_Master_Detials.objects.get(Floor_Id=IdentifyId)
                        content_type = ContentType.objects.get_for_model(Floor_Master_Detials)  # Get ContentType for Floor_Master_Detials
                    except Floor_Master_Detials.DoesNotExist:
                        return JsonResponse({'error': f'Identification ID {IdentifyId} not found for QRType {QRtype}'}, status=400)
                    except ContentType.DoesNotExist:
                        return JsonResponse({'error': f'ContentType for model {QRtype} not found'}, status=400)
                elif QRtype == 'Ward':
                    try:
                        identification_object = WardType_Master_Detials.objects.get(Ward_Id=IdentifyId)
                        content_type = ContentType.objects.get_for_model(WardType_Master_Detials)  # Get ContentType for Floor_Master_Detials
                    except WardType_Master_Detials.DoesNotExist:
                        return JsonResponse({'error': f'Identification ID {IdentifyId} not found for QRType {QRtype}'}, status=400)
                    except ContentType.DoesNotExist:
                        return JsonResponse({'error': f'ContentType for model {QRtype} not found'}, status=400)
            # Ensure content_type and object_id are properly set before creating the Feedback record
            if content_type is None:
                return JsonResponse({'error': 'Content type is not specified or invalid'}, status=400)

            # Create the feedback object in the database
            Feedback_Details_Form.objects.create(
                content_type=content_type,  # Set the ContentType
                object_id=IdentifyId,  # Set the object ID (IdentifyId)
                Identificationid=identification_object,  # Use the related object
                Identificationname=IdentifcationName,
                QrName=QRtype,
                Ratings=Ratings,
                Feedback=feedback,
                Comments=Comments,
                Name=Name,
                Phone=Phone,
            )

            return JsonResponse({'success': "Thank you for your Feedback"})

        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)})
        
@csrf_exempt
@require_http_methods(['GET'])
def get_feedback_data_for_chart(request):
    try:
        type = request.GET.get('type')

        if type == 'Floor':

            content_type = ContentType.objects.get_for_model(Floor_Master_Detials)

            floors = Floor_Master_Detials.objects.all()

            chart_data = []
            
            for floor in floors:
                feedback_data = Feedback_Details_Form.objects.filter(
                    content_type=content_type,
                    object_id=floor.Floor_Id
                ).aggregate(average_rating=Avg('Ratings'))  # Calculate the average rating for the floor

                # Get the rating (it will be None if no feedback data is found, so default to 0)
                average_rating = feedback_data['average_rating'] or 0

                # Append the floor and its average rating to chart data
                chart_data.append({
                    'name': floor.Floor_Name,  # You can change this to whatever field you want to display
                    'rating': average_rating , # The average rating for that floor, or 0 if no feedback
                    'floorId': floor.Floor_Id
                })
        elif type == 'Ward':
            content_type = ContentType.objects.get_for_model(WardType_Master_Detials)

            wards = WardType_Master_Detials.objects.all()

            chart_data = []
            
            for ward in wards:
                feedback_data = Feedback_Details_Form.objects.filter(
                    content_type=content_type,
                    object_id=ward.Ward_Id
                ).aggregate(average_rating=Avg('Ratings'))  # Calculate the average rating for the floor

                # Get the rating (it will be None if no feedback data is found, so default to 0)
                average_rating = feedback_data['average_rating'] or 0

                # Append the floor and its average rating to chart data
                chart_data.append({
                    'name': ward.Ward_Name,  # You can change this to whatever field you want to display
                    'rating': average_rating , # The average rating for that floor, or 0 if no feedback
                    'wardsId': ward.Ward_Id
                })

        # Return the data as JSON for the chart
        return JsonResponse({'data': chart_data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
@csrf_exempt
@require_http_methods(['GET'])
def get_all_feedback_data(request):
    try:
        # Retrieve the type parameter from the request
        feedback_type = request.GET.get('type')

        # Retrieve all records from Feedback_Details_Form, filtered by type if provided
        if feedback_type:
            feedback_data = Feedback_Details_Form.objects.filter(QrName=feedback_type).order_by('created_at')

        # Serialize the data into JSON format
        feedback_list = []
        for feedback in feedback_data:
            if feedback_type == 'Floor':
                summa = feedback.Identificationid.Floor_Id
            elif feedback_type == 'Ward':
                summa = feedback.Identificationid.Ward_Id
            feedback_list.append({
                'Feedback_Id': feedback.Feedback_Id,
                'Identificationid': summa if feedback.Identificationid else None,
                'Identificationname': feedback.Identificationname,
                'QrName': feedback.QrName,
                'Ratings': feedback.Ratings,
                'Feedback': feedback.Feedback,
                'Comments': feedback.Comments,
                'Name': feedback.Name,
                'Phone': feedback.Phone,
                'created_at': feedback.created_at,
                'updated_at': feedback.updated_at,
            })

        return JsonResponse({'data': feedback_list}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

 
@csrf_exempt
@require_http_methods(['POST','GET', 'OPTIONS'])
def insert_insto_alert_table(request):
    if request.method == 'POST':
        try:
            # Parse the request data
            data = json.loads(request.body)
            print(data, 'data')
 
            # Extract values from the request
            employeeid = data.get('Employeid')  # Ensure this matches the key in your JSON payload
            alertcolor = data.get('alertcolor')  # Corrected key for the alert color
            createdby = data.get('createdby')  # Corrected key for the creator
           
            # Validate inputs
            if not employeeid or not alertcolor or not createdby:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
 
            # Map alert colors to messages
            alert_messages = {
                'Red': 'Fire',
                'Black': 'Bomb Threat',
                'Purple': 'Hostage Talking',
                'White': 'Violent Behaviour',
                'Yellow': 'Patient Missing',
                'Brown': 'Material Split/Leak',
                'Grey': 'Infrastructure Loss',
                'Orange': 'External Disaster',
                'Green': 'Evacuation',
                'Blue': 'Cardiac Arrest/Medical Emergency'
            }
            message = alert_messages.get(alertcolor, None)
 
            if not message:
                return JsonResponse({'error': 'Invalid alert color'}, status=400)
 
            # Fetch the Employee instance
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employeeid)
 
            # Insert into the Alert_Message_Register table
            Alert_Message_Register.objects.create(
                Empolyee_id=employee_instance,
                Alert_Color=alertcolor,
                Alert_Message=message,
                created_by=createdby
            )
 
            return JsonResponse({'success': "Thank you for your Message"})
 
        except Employee_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Employee ID not found'}, status=404)
        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == 'GET':
        try:
            # Retrieve the latest inserted alert
            latest_alert = Alert_Message_Register.objects.latest('created_at')
           
            # Serialize the latest alert
            alert_data = {
                'Alert_id': latest_alert.Alert_id,
                'Empolyee_id': latest_alert.Empolyee_id.Employee_ID,
                'Alert_Color': latest_alert.Alert_Color,
                'Alert_Message': latest_alert.Alert_Message,
                'created_by': latest_alert.created_by,
                'created_at': latest_alert.created_at,
                'updated_at': latest_alert.updated_at
            }
 
            return JsonResponse({'latest_alert': alert_data}, status=200)
 
        except Alert_Message_Register.DoesNotExist:
            return JsonResponse({'error': 'No alerts found'}, status=404)
        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)}, status=500)
 
 
 
