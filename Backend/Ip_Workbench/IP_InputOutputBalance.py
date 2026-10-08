from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils import timezone
from django.core.management import call_command


@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_InputOutputBalance_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            RegistrationId = data.get("RegistrationId")
            Createdby = data.get("Createdby")
            DepartmentType = data.get("DepartmentType")
            Date = data.get("Date")
            Time = data.get("Time")

            if not RegistrationId:
                return JsonResponse({'error': 'RegistrationId is required'})

            # Determine registration instance
            registration_ins_ip = None
            registration_ins_casuality = None
            if DepartmentType == 'IP':
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                except Patient_IP_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'IP Registration not found'})
            else:
                try:
                    registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Casuality Registration not found'})

            success_messages = []

            # Handle Intake
            if 'Intake' in data:
                intake_data = data['Intake']
                if not intake_data.get("IntakeType") or not intake_data.get("Measurement1"):
                    return JsonResponse({'error': 'IntakeType and Measurement1 are required for Intake'})
                intake_instance = IP_Intake_Details(
                    Ip_Registration_Id=registration_ins_ip,
                    Casuality_Registration_Id=registration_ins_casuality,
                    IntakeType=intake_data.get("IntakeType"),
                    IntakeMode=intake_data.get("IntakeMode"),
                    Site=intake_data.get("Site"),
                    Measurement=intake_data.get("Measurement1"),
                    MeasurementType=intake_data.get("MeasurementType1"),
                    Duration=intake_data.get("Duration"),
                    DurationType=intake_data.get("DurationType"),
                    Remarks=intake_data.get("Remarks1"),
                    Created_by=Createdby,
                    DepartmentType=DepartmentType,
                )
                intake_instance.save()
                success_messages.append('Intake details saved successfully')

            # Handle Output
            if 'Output' in data:
                output_data = data['Output']
                if not output_data.get("OutputType") or not output_data.get("Measurement2"):
                    return JsonResponse({'error': 'OutputType and Measurement2 are required for Output'})
                output_instance = IP_Output_Details(
                    Ip_Registration_Id=registration_ins_ip,
                    Casuality_Registration_Id=registration_ins_casuality,
                    OutputType=output_data.get("OutputType"),
                    Measurement=output_data.get("Measurement2"),
                    MeasurementType=output_data.get("MeasurementType2"),
                    Remarks=output_data.get("Remarks2"),
                    Created_by=Createdby,
                    DepartmentType=DepartmentType,
                )
                output_instance.save()
                success_messages.append('Output details saved successfully')

            # Handle Balance
            if 'Balance' in data:
                balance_data = data['Balance']
                # Filter by RegistrationId, DepartmentType, and Date
                balance_query = IP_Balance_Details.objects.filter(
                    Ip_Registration_Id=registration_ins_ip,
                    Casuality_Registration_Id=registration_ins_casuality,
                    DepartmentType=DepartmentType,
                    created_at__date=timezone.datetime.strptime(Date, '%d-%m-%y').date()  # Match the date
                )

                if balance_query.exists():
                    # Update the existing balance entry
                    balance_instance = balance_query.first()
                    balance_instance.totalInputDay = balance_data.get("totalInputDay")
                    balance_instance.totalOutputDay = balance_data.get("totalOutputDay")
                    balance_instance.balance = balance_data.get("balance")
                    balance_instance.balanceType = balance_data.get("balanceType")
                    balance_instance.updated_at = timezone.now()
                    balance_instance.save()
                    success_messages.append('Balance details updated successfully')
                else:
                    # Create a new balance entry
                    balance_instance = IP_Balance_Details(
                        Ip_Registration_Id=registration_ins_ip,
                        Casuality_Registration_Id=registration_ins_casuality,
                        totalInputDay=balance_data.get("totalInputDay"),
                        totalOutputDay=balance_data.get("totalOutputDay"),
                        balance=balance_data.get("balance"),
                        balanceType=balance_data.get("balanceType"),
                        Created_by=Createdby,
                        DepartmentType=DepartmentType,
                    )
                    balance_instance.save()
                    success_messages.append('Balance details saved successfully')

            if not success_messages:
                return JsonResponse({'error': 'No valid data provided to save'})

            return JsonResponse({'success': ' | '.join(success_messages)})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        # Existing GET logic remains unchanged
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')

            if not Ip_Registration_Id or not DepartmentType:
                return JsonResponse({'error': 'Both RegistrationId and DepartmentType are required'})

            if DepartmentType == 'IP':
                intake_details = IP_Intake_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
                output_details = IP_Output_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
                balance_details = IP_Balance_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            else:
                intake_details = IP_Intake_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
                output_details = IP_Output_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
                balance_details = IP_Balance_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)

            intake_details_data = [
                {
                    'id': idx,
                    'RegistrationId': intake.Ip_Registration_Id.pk if intake.Ip_Registration_Id else intake.Casuality_Registration_Id.pk,
                    'PrimaryDoctorId': (
                        intake.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if intake.Ip_Registration_Id and intake.Ip_Registration_Id.PrimaryDoctor
                        else intake.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID if intake.Casuality_Registration_Id and intake.Casuality_Registration_Id.PrimaryDoctor
                        else None
                    ),
                    'PrimaryDoctorName': (
                        intake.Ip_Registration_Id.PrimaryDoctor.ShortName if intake.Ip_Registration_Id and intake.Ip_Registration_Id.PrimaryDoctor
                        else intake.Casuality_Registration_Id.PrimaryDoctor.ShortName if intake.Casuality_Registration_Id and intake.Casuality_Registration_Id.PrimaryDoctor
                        else None
                    ),
                    'IntakeType': intake.IntakeType,
                    'IntakeMode': intake.IntakeMode,
                    'Site': intake.Site,
                    'Measurement1': intake.Measurement,
                    'MeasurementType1': intake.MeasurementType,
                    'Duration': intake.Duration,
                    'DurationType': intake.DurationType,
                    'Remarks1': intake.Remarks,
                    'DepartmentType': intake.DepartmentType,
                    'Date': intake.created_at.strftime('%d-%m-%y'),
                    'Time': intake.created_at.strftime('%H:%M:%S'),
                    'Createdby': intake.Created_by,
                }
                for idx, intake in enumerate(intake_details, start=1)
            ]

            output_details_data = [
                {
                    'id': idx,
                    'RegistrationId': output.Ip_Registration_Id.pk if output.Ip_Registration_Id else output.Casuality_Registration_Id.pk,
                    'PrimaryDoctorId': (
                        output.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if output.Ip_Registration_Id and output.Ip_Registration_Id.PrimaryDoctor
                        else output.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID if output.Casuality_Registration_Id and output.Casuality_Registration_Id.PrimaryDoctor
                        else None
                    ),
                    'PrimaryDoctorName': (
                        output.Ip_Registration_Id.PrimaryDoctor.ShortName if output.Ip_Registration_Id and output.Ip_Registration_Id.PrimaryDoctor
                        else output.Casuality_Registration_Id.PrimaryDoctor.ShortName if output.Casuality_Registration_Id and output.Casuality_Registration_Id.PrimaryDoctor
                        else None
                    ),
                    'OutputType': output.OutputType,
                    'Measurement2': output.Measurement,
                    'MeasurementType2': output.MeasurementType,
                    'Remarks2': output.Remarks,
                    'DepartmentType': output.DepartmentType,
                    'Date': output.created_at.strftime('%d-%m-%y'),
                    'Time': output.created_at.strftime('%H:%M:%S'),
                    'Createdby': output.Created_by,
                }
                for idx, output in enumerate(output_details, start=1)
            ]

            balance_details_data = [
                {
                    'id': idx,
                    'RegistrationId': balance.Ip_Registration_Id.pk if balance.Ip_Registration_Id else balance.Casuality_Registration_Id.pk,
                    'PrimaryDoctorId': (
                        balance.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if balance.Ip_Registration_Id and balance.Ip_Registration_Id.PrimaryDoctor
                        else balance.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID if balance.Casuality_Registration_Id and balance.Casuality_Registration_Id.PrimaryDoctor
                        else None
                    ),
                    'PrimaryDoctorName': (
                        balance.Ip_Registration_Id.PrimaryDoctor.ShortName if balance.Ip_Registration_Id and balance.Ip_Registration_Id.PrimaryDoctor
                        else balance.Casuality_Registration_Id.PrimaryDoctor.ShortName if balance.Casuality_Registration_Id and balance.Casuality_Registration_Id.PrimaryDoctor
                        else None
                    ),
                    'totalInputDay': balance.totalInputDay,
                    'totalOutputDay': balance.totalOutputDay,
                    'balance': balance.balance,
                    'balanceType': balance.balanceType,
                    'DepartmentType': balance.DepartmentType,
                    'Date': balance.created_at.strftime('%d-%m-%y'),
                    'Time': balance.created_at.strftime('%H:%M:%S'),
                    'Createdby': balance.Created_by,
                }
                for idx, balance in enumerate(balance_details, start=1)
            ]

            response_data = {
                'intake_details': intake_details_data,
                'output_details': output_details_data,
                'balance_details': balance_details_data,
            }
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)           
            
        
@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_Balance_Details_Link(request):
    if request.method == 'POST':
        try:
           
            data = json.loads(request.body)
            
            print(data, 'data')
            
            totalInputDay = data.get("totalInputDay")
            totalOutputDay = data.get("totalOutputDay")
            balance = data.get("balance")
            balanceType = data.get("balanceType")
            createdby = data.get("Createdby")
            RegistrationId = data.get('RegistrationId')
            Inserttype = data.get('Inserttype')
            DepartmentType = data.get("DepartmentType")


            registration_ins_ip = None
            registration_ins_casuality = None

            if RegistrationId:
                # Try to get from IP Registration first
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                        print("Found in Casuality Registration")
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'error': 'No registration found for the given RegistrationId'})

            else:
                return JsonResponse({'error': 'RegistrationId is required'})

            if Inserttype == 'Balance':
                Balance_instance = IP_Balance_Details(
                    Ip_Registration_Id=registration_ins_ip,
                    Casuality_Registration_Id=registration_ins_casuality,
                    totalInputDay=totalInputDay,
                    totalOutputDay=totalOutputDay,
                    balance=balance,
                    balanceType=balanceType,
                    Created_by=createdby,
                    DepartmentType=DepartmentType,

                )
                Balance_instance.save()
                
            return JsonResponse({'success': 'Balance details saved successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')

            if not Ip_Registration_Id and not DepartmentType:
                return JsonResponse({'error': 'both Ip_Registration_Id and DepartmentType is required'})

            if DepartmentType =='IP':
                Balance_details = IP_Balance_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            else:
                Balance_details = IP_Balance_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            
            
            Balance_details_data = []
            for idx, Balance in enumerate(Balance_details, start=1):
                Balance_dict = {
                    'id': idx,
                    'RegistrationId': Balance.Ip_Registration_Id.pk if Balance.Ip_Registration_Id else Balance.Casuality_Registration_Id.pk,
                    'VisitId': Balance.Ip_Registration_Id.VisitId if Balance.Ip_Registration_Id else Balance.Casuality_Registration_Id.VisitId,
                    'PrimaryDoctorId': Balance.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Balance.Ip_Registration_Id else Balance.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': Balance.Ip_Registration_Id.PrimaryDoctor.ShortName if Balance.Ip_Registration_Id else Balance.Casuality_Registration_Id.PrimaryDoctor.ShortName,
                    'DepartmentType': Balance.DepartmentType,
                    'totalInputDay': Balance.totalInputDay,
                    'totalOutputDay': Balance.totalOutputDay,
                    'balance': Balance.balance,
                    'balanceType': Balance.balanceType,
                    'Date': Balance.created_at.strftime('%d-%m-%y'),
                    'Time': Balance.created_at.strftime('%H:%M:%S'),
                    'Createdby': Balance.Created_by,
                }
                Balance_details_data.append(Balance_dict)

            print(Balance_details_data, 'Balance_details_data')
            return JsonResponse(Balance_details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def IP_IO_Balance_Details_Get(request):
    try:
        registration_id = request.GET.get('RegistrationId')
        department_type = request.GET.get('DepartmentType')
        print("registration_id:",registration_id)
        print("department_type:",department_type)
 
        if not registration_id or not department_type:
            return JsonResponse({'error': 'Both RegistrationId and DepartmentType are required'})
 
        if department_type == 'IP':
            intake_details = IP_Intake_Details.objects.filter(
                Ip_Registration_Id=registration_id,
                DepartmentType=department_type
            )
            output_details = IP_Output_Details.objects.filter(
                Ip_Registration_Id=registration_id,
                DepartmentType=department_type
            )
            balance_details = IP_Balance_Details.objects.filter(
                Ip_Registration_Id=registration_id,
                DepartmentType=department_type
            )
        else:
            intake_details = IP_Intake_Details.objects.filter(
                Casuality_Registration_Id=registration_id,
                DepartmentType=department_type
            )
            output_details = IP_Output_Details.objects.filter(
                Casuality_Registration_Id=registration_id,
                DepartmentType=department_type
            )
            balance_details = IP_Balance_Details.objects.filter(
                Casuality_Registration_Id=registration_id,
                DepartmentType=department_type
            )
 
        # Serialize intake details
        intake_details_data = [
            {
                'id': intake.Id,
                'RegistrationId': (
                    intake.Ip_Registration_Id.pk if intake.Ip_Registration_Id
                    else intake.Casuality_Registration_Id.pk if intake.Casuality_Registration_Id
                    else None
                ),
                'PrimaryDoctorId': (
                    intake.Ip_Registration_Id.PrimaryDoctor.Doctor_ID
                    if intake.Ip_Registration_Id and hasattr(intake.Ip_Registration_Id, 'PrimaryDoctor')
                    else intake.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID
                    if intake.Casuality_Registration_Id and hasattr(intake.Casuality_Registration_Id, 'PrimaryDoctor')
                    else None
                ),
                'PrimaryDoctorName': (
                    intake.Ip_Registration_Id.PrimaryDoctor.ShortName
                    if intake.Ip_Registration_Id and hasattr(intake.Ip_Registration_Id, 'PrimaryDoctor')
                    else intake.Casuality_Registration_Id.PrimaryDoctor.ShortName
                    if intake.Casuality_Registration_Id and hasattr(intake.Casuality_Registration_Id, 'PrimaryDoctor')
                    else None
                ),
                'IntakeType': intake.IntakeType,
                'IntakeMode': intake.IntakeMode,
                'Site': intake.Site,
                'Measurement1': intake.Measurement,
                'MeasurementType1': intake.MeasurementType,
                'Duration': intake.Duration,
                'DurationType': intake.DurationType,
                'Remarks': intake.Remarks,
                'DepartmentType': intake.DepartmentType,
                'Date': intake.created_at.strftime('%d-%m-%Y'),
                'Time': intake.created_at.strftime('%H:%M:%S'),
                'Createdby': intake.Created_by,
            }
            for intake in intake_details
        ]
        output_details_data = [
            {
                'id': output.Id,
                'RegistrationId': (
                    output.Ip_Registration_Id.pk if output.Ip_Registration_Id
                    else output.Casuality_Registration_Id.pk if output.Casuality_Registration_Id
                    else None
                ),
                'PrimaryDoctorId': (
                    output.Ip_Registration_Id.PrimaryDoctor.Doctor_ID
                    if output.Ip_Registration_Id and hasattr(output.Ip_Registration_Id, 'PrimaryDoctor')
                    else output.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID
                    if output.Casuality_Registration_Id and hasattr(output.Casuality_Registration_Id, 'PrimaryDoctor')
                    else None
                ),
                'PrimaryDoctorName': (
                    output.Ip_Registration_Id.PrimaryDoctor.ShortName
                    if output.Ip_Registration_Id and hasattr(output.Ip_Registration_Id, 'PrimaryDoctor')
                    else output.Casuality_Registration_Id.PrimaryDoctor.ShortName
                    if output.Casuality_Registration_Id and hasattr(output.Casuality_Registration_Id, 'PrimaryDoctor')
                    else None
                ),
                'OutputType': output.OutputType,
                'Measurement2': output.Measurement,
                'MeasurementType2': output.MeasurementType,
                'Remarks': output.Remarks,
                'DepartmentType': output.DepartmentType,
                'Date': output.created_at.strftime('%d-%m-%Y'),
                'Time': output.created_at.strftime('%H:%M:%S'),
                'Createdby': output.Created_by,
            }
            for output in output_details
        ]
 
        balance_details_data = [
            {
                'id': balance.Id,
                'RegistrationId': (
                    balance.Ip_Registration_Id.pk if balance.Ip_Registration_Id
                    else balance.Casuality_Registration_Id.pk if balance.Casuality_Registration_Id
                    else None
                ),
                'PrimaryDoctorId': (
                    balance.Ip_Registration_Id.PrimaryDoctor.Doctor_ID
                    if balance.Ip_Registration_Id and hasattr(balance.Ip_Registration_Id, 'PrimaryDoctor')
                    else balance.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID
                    if balance.Casuality_Registration_Id and hasattr(balance.Casuality_Registration_Id, 'PrimaryDoctor')
                    else None
                ),
                'PrimaryDoctorName': (
                    balance.Ip_Registration_Id.PrimaryDoctor.ShortName
                    if balance.Ip_Registration_Id and hasattr(balance.Ip_Registration_Id, 'PrimaryDoctor')
                    else balance.Casuality_Registration_Id.PrimaryDoctor.ShortName
                    if balance.Casuality_Registration_Id and hasattr(balance.Casuality_Registration_Id, 'PrimaryDoctor')
                    else None
                ),
                'totalInputDay': balance.totalInputDay,
                'totalOutputDay': balance.totalOutputDay,
                'balance': balance.balance,
                'balanceType': balance.balanceType,
                'DepartmentType': balance.DepartmentType,
                'Date': balance.created_at.strftime('%d-%m-%Y'),
                'Time': balance.created_at.strftime('%H:%M:%S'),
                'Createdby': balance.Created_by,
            }
            for balance in balance_details
        ]
 
        response_data = {
            'intake_details': intake_details_data,
            'output_details': output_details_data,
            'balance_details': balance_details_data,
        }
        print("response_data:",response_data)
 
        return JsonResponse(response_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred in GET: {str(e)}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})
 







