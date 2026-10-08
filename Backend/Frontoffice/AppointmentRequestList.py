from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.db.models import Count,Q
from django.utils.timezone import now
from datetime import datetime, timedelta
from Workbench.models import *





@csrf_exempt
@require_http_methods(["POST", "GET"])
def Appointment_Request_List_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'data----------1')
            # appointment_id = data.get('appointment_id')
            # Extract and validate data
            appointment_id = data.get('AppointmentID')
            print(appointment_id,'appointment_id')
            PatientId = data.get('PatientId')
            title = data.get('Title','')
            first_name = data.get('FirstName','')
            middle_name = data.get('MiddleName','')
            last_name = data.get('LastName','')
            phone_number = data.get('PhoneNumber','')
            Age = data.get('Age','')
            Gender = data.get('Gender','')
            email = data.get('Email','')
            request_date = data.get('RequestDate','')
            appointment_type = data.get('AppointmentType','')
            request_time = data.get('RequestTime',"00:00:00")
            VisitType = data.get('VisitType','')
            visit_purpose = data.get('VisitPurpose','')
            specialization = data.get('Specialization','')
            doctor_name = data.get('DoctorName','')
            locationid = data.get('Location','')
            createdBy = data.get('CreatedBy','')
            ReferredBy = data.get('ReferredBy','')
            cancelreason = data.get('CancelReason','')
            Registration_Id = data.get('Registration_Id','')
            # Status = data.get('Status','')
           
           
           
            doctor_instance = None
            speciality_instance = None
            location_instance = None
            Patient_instance = None
            RegistrationId_instance = None
           
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
            if doctor_name:
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = doctor_name )
            if specialization:
                speciality_instance = Speciality_Detials.objects.get(Speciality_Id = specialization)
            if locationid:
                location_instance = Location_Detials.objects.get(Location_Id = locationid)    
            Title_instance = Title_Detials.objects.get(pk=title) if title else None
            if PatientId:
                Patient_instance = Patient_Detials.objects.get(PatientId=PatientId)
            
            if Registration_Id:
                RegistrationId_instance = OPD_GeneralAdviceFollowUp.objects.get(Registration_Id__Registration_Id=Registration_Id)
            
            
            if appointment_id:
               
                print('jjj-----------------1',appointment_id)
               
                appointment_instance = Appointment_Request_List.objects.get(pk=appointment_id)
                print(appointment_instance,'appointment_instance------1')
               
                appointment_instance.title = Title_instance
                appointment_instance.first_name = first_name
                appointment_instance.middle_name = middle_name
                appointment_instance.last_name = last_name
                appointment_instance.phone_number = phone_number
                appointment_instance.Age = Age
                appointment_instance.Gender = Gender
                appointment_instance.email = email
                # appointment_instance.request_date = request_date
                appointment_instance.appointment_type = appointment_type
                appointment_instance.request_time = request_time
                appointment_instance.VisitType = VisitType
                appointment_instance.visit_purpose = visit_purpose
                appointment_instance.specialization = speciality_instance if specialization else None
                appointment_instance.doctor_name = doctor_instance if doctor_name else None
                # appointment_instance.status = Status
                appointment_instance.Location = location_instance
                appointment_instance.updated_by = createdBy
                appointment_instance.ReferredBy = referral_doctor_instance
               
                appointment_instance.cancelReason = cancelreason
           
                # Save the instance
                appointment_instance.save()
                print('updateddddd---------------')
 
               
               
                return JsonResponse({'success': 'Appointment request details Updated successfully'})
 
            else:
                exists = Appointment_Request_List.objects.filter(first_name=first_name,phone_number=phone_number,specialization=speciality_instance,doctor_name=doctor_instance)
                if exists:
                    return JsonResponse({'error':   f'This {first_name}Patient With Phone Number : {phone_number} already Appointment with {doctor_instance}Doctor was exists'})
               
                # exists = Appointment_Request_List.objects.filter(first_name=first_name,phone_number=phone_number,status = 'PENDING')
                # if exists:
                #     return JsonResponse({'error':   f'This Patient {first_name} With Phone Number : {phone_number} already Appointment was exists'})
 
                # OP_Patient = Patient_Appointment_Registration_Detials.objects.filter(PatientId__FirstName = first_name,PatientId__PhoneNo = phone_number,Status = 'Registered')
                # if OP_Patient:
                #     return JsonResponse({'error': f'This patient {first_name} with Phone Number : {phone_number} already exist in OP and Progress not Completed'})
               
                # IP_Patient = Patient_IP_Registration_Detials.objects.filter(PatientId__FirstName = first_name,PatientId__PhoneNo = phone_number,Status = 'Admitted')
                # if IP_Patient:
                #     return JsonResponse({'error': f'This patient {first_name} with Phone Number : {phone_number} already exist in IP and Progress not Completed'})
               
                print('11111111111111111---------------')
                # Create new appointment request
                appointment_instance = Appointment_Request_List(
                     # Set instance fields
                    title = Title_instance,
                    first_name = first_name,
                    middle_name = middle_name,
                    last_name = last_name,
                    phone_number = phone_number,
                    Age = Age,
                    Gender = Gender,
                    email = email,
                    request_date = request_date,
                    appointment_type = appointment_type,
                    request_time = request_time,
                    VisitType = VisitType,
                    visit_purpose = visit_purpose,
                    specialization = speciality_instance if specialization else None,
                    doctor_name = doctor_instance if doctor_name else None,
                    # status = 'PENDING',
                    Location = location_instance,
                    PatientId = Patient_instance,
                    created_by = createdBy,
                    ReferredBy = referral_doctor_instance,
                    cancelReason = cancelreason,                
                )
                appointment_instance.save()

                if Patient_instance:
                    Patient_instance.Status='AppointmentRequested'
                    Patient_instance.save()
                    print('111111111')

                if RegistrationId_instance:
                    RegistrationId_instance.Status=False  
                    RegistrationId_instance.save()
                    print(RegistrationId_instance,'11111222222222222')  
               
                return JsonResponse({'success': 'Appointment request details saved successfully'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)})
       
    elif request.method == 'GET':
        try:
            status = request.GET.get("Status")
            print('daaaaa',status)
            # Fetch all records from the Appointment_Request_List model
            appointment_requests = Appointment_Request_List.objects.filter(status = status)
           
            # Construct a list of dictionaries containing appointment request data
            appointment_request_data = []
            for appointment in appointment_requests:
               
                appointment_dict = {
                    'id': appointment.pk,
                    'TitleId': appointment.title.Title_Id,
                    'Title': appointment.title.Title_Name,
                    'FirstName': appointment.first_name,
                    'MiddleName': appointment.middle_name,
                    'LastName': appointment.last_name,
                    'PhoneNumber': appointment.phone_number,
                    'Age': appointment.Age,
                    'Gender': appointment.Gender,
                    'Email': appointment.email,
                    'RequestDate': appointment.request_date,
                    'AppointmentType': appointment.appointment_type,
                    'RequestTime': appointment.request_time.strftime('%H:%M'),  # Convert time to string format
                    'VisitType': appointment.VisitType,
                    'VisitPurpose': appointment.visit_purpose,
                    'SpecializationName': appointment.specialization.Speciality_Name,
                    'SpecializationId': appointment.specialization.Speciality_Id,
                    'DoctorName': f"{appointment.doctor_name.Tittle}.{appointment.doctor_name.ShortName}",
                    'DoctorID': appointment.doctor_name.Doctor_ID,
                    'Status': appointment.status,
                    'PatientId': appointment.PatientId.PatientId if appointment.PatientId else None,
                    'Referraldocname':f"{appointment.ReferredBy.Tittle.Title_Id if appointment.ReferredBy.Tittle else ''}.{appointment.ReferredBy.ShortName}",
                    'Referredid': appointment.doctor_name.Doctor_ID,
 
                }
                appointment_request_data.append(appointment_dict)
 
            return JsonResponse(appointment_request_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})




@csrf_exempt
@require_http_methods(["POST", "GET"])
def Appointment_Status_Update_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Data:", data)

            appointment_id = data.get('AppointmentID')
            status = data.get('Status', '')

            if not appointment_id:
                return JsonResponse({'error': 'Appointment ID is required'}, status=400)

            try:
                appointment_instance = Appointment_Request_List.objects.get(pk=appointment_id)
                # appointmentRescheduled_instance = Appointment_ReSchedule_Request.objects.get(pk=appointment_id)
                print("Appointment Found:", appointment_instance)

                appointment_rescheduled_instance = Appointment_ReSchedule_Request.objects.filter(appointmentId=appointment_instance).first()

                appointment_instance.status = status
                appointment_instance.save()
                
                if appointment_rescheduled_instance:
                    appointment_rescheduled_instance.status = status
                    appointment_rescheduled_instance.save()

                return JsonResponse({'success': 'Appointment status updated successfully'})

            except Appointment_Request_List.DoesNotExist:
                return JsonResponse({'error': 'Appointment not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            print(f"Error Updating Appointment Status: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            status = request.GET.get("Status")
            print("Fetching Appointments with Status:", status)

            appointment_requests = Appointment_Request_List.objects.filter(status=status)
            appointment_request_data = []

            for appointment in appointment_requests:
                appointment_dict = {
                    'id': appointment.pk,
                    'TitleId': appointment.title.Title_Id,
                    'Title': appointment.title.Title_Name,
                    'FirstName': appointment.first_name,
                    'MiddleName': appointment.middle_name,
                    'LastName': appointment.last_name,
                    'PhoneNumber': appointment.phone_number,
                    'Age': appointment.Age,
                    'Gender': appointment.Gender,
                    'Email': appointment.email,
                    'RequestDate': appointment.request_date,
                    'AppointmentType': appointment.appointment_type,
                    'RequestTime': appointment.request_time.strftime('%H:%M'),
                    'VisitPurpose': appointment.visit_purpose,
                    'SpecializationName': appointment.specialization.Speciality_Name,
                    'SpecializationId': appointment.specialization.Speciality_Id,
                    'DoctorName': f"{appointment.doctor_name.Tittle}.{appointment.doctor_name.ShortName}",
                    'DoctorID': appointment.doctor_name.Doctor_ID,
                    'Status': appointment.status,
                    'PatientId': appointment.PatientId.PatientId if appointment.PatientId else None,
                    'Referraldocname': f"{appointment.ReferredBy.Tittle.Title_Id if appointment.ReferredBy.Tittle else ''}.{appointment.ReferredBy.ShortName}",
                    'Referredid': appointment.doctor_name.Doctor_ID,
                }
                appointment_request_data.append(appointment_dict)

            return JsonResponse(appointment_request_data, safe=False)

        except Exception as e:
            print(f"Error Fetching Appointments: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST"])
def Appointment_Request_List_Delete_Links(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            appointment_id = data.get('AppointmentID')
            
            print("heloooooooo", data)

            print("Received Data:", data)
            num_deleted, _ = Appointment_Request_List.objects.filter(pk=appointment_id).delete()
                    
            return JsonResponse({'success': 'Apointment deleted successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
   


    
def appointment_request_count_today(request):
    today = now().date()
    count = Appointment_Request_List.objects.filter(request_date=today).count()
    return JsonResponse({'count': count})



@csrf_exempt
def Appointment_Request_Cancel(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            appointment_id = data.get('AppointmentID')
            cancelreason = data.get('CancelReason')      
            createdBy = data.get('CreatedBy')
            print('creaaaa',createdBy)
      
            if appointment_id and cancelreason:
                # Update existing appointment request
                appointment_instance = Appointment_Request_List.objects.get(pk=appointment_id)

                appointment_instance.status = 'CANCELLED'   
                appointment_instance.cancelReason =cancelreason         
                appointment_instance.updated_by = createdBy
                appointment_instance.save()
                
                return JsonResponse({'success': 'Appointment request details Cancelled successfully'})
                     
        except Exception as e:
            return JsonResponse({"error": str(e)})



#-------Jeeva ----- Dont Change the code ------------------


@csrf_exempt
def Appointment_Reschedule_List(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data,'data-------1')
            
            # Get the ReScheduleId from the request
            appointmentId = data.get('AppointmentId', '')
            radioOption = data.get('RadioOption', '')
            requestDate = data.get('RequestDate', '')
            RequestTime = data.get('RequestTime', '')
            changingReason = data.get('ChangingReason', '')
            specialization = data.get('Specialization', '')  # Default to an empty string
            doctorName = data.get('DoctorName', '')  # Default to an empty string
            createdby = data.get('CreatedBy', '')
            
            
            
                     
            print('hiiiii',data)  
            appointment_instance = Appointment_Request_List.objects.get(pk = appointmentId) 
            
            print(appointment_instance,'appointment_instance----------1')
            
            # Fetch specialization instance if provided, otherwise set it to None
            speciality_instance = None
            if specialization not in [None, '', 'null', 'undefined']:
                speciality_instance = Speciality_Detials.objects.get(Speciality_Id=specialization)

            # Fetch doctor instance if provided, otherwise set it to None
            doctor_instance = None
            if doctorName not in [None, '', 'null', 'undefined']:
                doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctorName)
            
            print('qqqqqqqqqqqqqqqqqqqq-------------')
            
            AppointmentAlreadyInReschedule = Appointment_ReSchedule_Request.objects.filter(appointmentId=appointment_instance).exists()
            
            if AppointmentAlreadyInReschedule :

                print('updateeeeeeeeee')

                
                appointment_Reschedule_Ins = Appointment_ReSchedule_Request.objects.get(appointmentId=appointment_instance)

                # Only update the fields if they are not empty or None
                if radioOption:
                    appointment_Reschedule_Ins.RadioOption = radioOption

                if requestDate:  # Update only if requestDate is provided
                    appointment_Reschedule_Ins.RequestDate = requestDate
                    appointment_instance.request_date = requestDate

                if RequestTime:
                    appointment_Reschedule_Ins.RequestTime = RequestTime
                    appointment_instance.request_time = RequestTime

                if changingReason:
                    appointment_Reschedule_Ins.ChangingReason = changingReason

                if speciality_instance:
                    appointment_Reschedule_Ins.specialization = speciality_instance
                    appointment_instance.specialization = speciality_instance

                if doctor_instance:
                    appointment_Reschedule_Ins.doctor_name = doctor_instance
                    appointment_instance.doctor_name = doctor_instance

                appointment_Reschedule_Ins.updated_by = createdby
                appointment_Reschedule_Ins.status = 'Reschedule'
                appointment_Reschedule_Ins.save()

                appointment_instance.status = 'Rescheduled'
                appointment_instance.updated_by = createdby
                appointment_instance.save()
                

                return JsonResponse({'success': 'Appointment Reschedule details Updated successfully'})

            else:

                print('insertttttttttttt')

                # Use Appointment_Request_List data if fields in Appointment_ReSchedule_Request are None or empty
                reschedule_instance = Appointment_ReSchedule_Request(
                    appointmentId = appointment_instance,
                    RadioOption=radioOption,
                    RequestDate=requestDate or appointment_instance.request_date, 
                    # RequestDate=request_date_obj, 
                    RequestTime=RequestTime or appointment_instance.request_time, 
                    ChangingReason=changingReason ,
                    specialization=speciality_instance or appointment_instance.specialization ,
                    doctor_name=doctor_instance or appointment_instance.doctor_name,
                    status ='Reschedule',
                    # ReferredBy = createdby,
                    created_by = createdby,
                    updated_by = createdby
                )
                reschedule_instance.save()

                print('22222222-----------')

                if requestDate:
                    appointment_instance.request_date = requestDate
                # appointment_instance.request_date = request_date_obj
                appointment_instance.status = 'Rescheduled'
                if RequestTime:
                    appointment_instance.request_time = RequestTime
                if speciality_instance:
                    appointment_instance.specialization = speciality_instance
                if doctor_instance:
                    appointment_instance.doctor_name = doctor_instance
                appointment_instance.save()

                print('3333333333-----------')

                return JsonResponse({'success': 'Appointment reschedule request created successfully'})

        except Exception as e:
            return JsonResponse({"error": str(e)})


@csrf_exempt
@require_http_methods(['DELETE'])
def Delete_Appointment(request):
    try:
        appointment_id = request.GET.get('appointment_id')
        if not appointment_id:
            return JsonResponse({"error": "appointment_id query param is required"})

        appointment = Appointment_Request_List.objects.get(appointment_id=appointment_id)
        appointment.delete()

        return JsonResponse({'message': 'Appointment deleted successfully'})
    except Appointment_Request_List.DoesNotExist:
        return JsonResponse({"error": "Appointment not found"}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


#-------Jeeva ----- Dont Change the code ------------------


@csrf_exempt
@require_http_methods(["GET"])
def fetch_all_appointment_pending_data(request):
    try:
        # Fetch query parameters
        status = request.GET.getlist('status', '')  # getlist() returns a list, so no .strip()
        current_date = request.GET.get('CurrentDate', '').strip()
        from_date = request.GET.get('startDate', '').strip()
        to_date = request.GET.get('endDate', '').strip()
        Specialization = request.GET.get('Specialization', '')
        DoctorName = request.GET.get('DoctorName', '')

        print('Request Params:', status, current_date, from_date, to_date, Specialization, DoctorName)

        # Base query for Appointment_Request_List
        query = Q()

        # Apply filters for Appointment_Request_List
        if status:
            query &= Q(status__in=status)

        if current_date:
            query &= Q(request_date=current_date)  # ✅ request_date is correct for Appointment_Request_List
        elif from_date and to_date:
            query &= Q(request_date__range=[from_date, to_date])

        if DoctorName:
            query &= Q(doctor_name__Doctor_ID=DoctorName)

        if Specialization:
            query &= Q(specialization__Speciality_Id=Specialization)

        # Fetch Appointments from Appointment_Request_List
        appointments = Appointment_Request_List.objects.filter(query).order_by('-created_at')

        # Serialize Appointment_Request_List data
        appointment_request_data = [
            {
                'id': appointment.pk,
                'AppointmentId': appointment.appointment_id,
                'TitleId': appointment.title.Title_Id if appointment.title else None,
                'Title': appointment.title.Title_Name if appointment.title else None,
                'FirstName': appointment.first_name,
                'MiddleName': appointment.middle_name,
                'LastName': appointment.last_name,
                'Fullname': f"{appointment.title.Title_Name if appointment.title else ''}.{appointment.first_name if appointment else ''} {appointment.middle_name if appointment else ''} {appointment.last_name if appointment else ''}".strip(),
                # 'Fullname': f"{appointment.title.Title_Name if appointment.title else ''}.{appointment.first_name if appointment else ''}.{appointment.middle_name if appointment else ''}.{appointment.last_name if appointment else ''}",
                'PhoneNumber': appointment.phone_number,
                'Email': appointment.email,
                'Age': appointment.Age,
                'Gender': appointment.Gender,
                'RequestDate': appointment.request_date.strftime('%d-%m-%Y') if appointment.request_date else None,
                'AppointmentType': appointment.appointment_type,
                'RequestTime': appointment.request_time.strftime('%I:%M %p') if appointment.request_time else None,
                'VisitType': appointment.VisitType,
                'VisitPurpose': appointment.visit_purpose,
                'SpecializationName': appointment.specialization.Speciality_Name if appointment.specialization else None,
                'SpecializationId': appointment.specialization.Speciality_Id if appointment.specialization else None,
                'DoctorID': appointment.doctor_name.Doctor_ID if appointment.doctor_name else None,
                'Referraldocname': f"{appointment.ReferredBy.Tittle.Title_Id if appointment.ReferredBy.Tittle else ''}.{appointment.ReferredBy.ShortName}" if appointment.ReferredBy else None,
                'Referredid': appointment.ReferredBy.Doctor_ID if appointment.ReferredBy else None,
                'ShortName': f"{appointment.doctor_name.Tittle.Title_Name if appointment.doctor_name.Tittle else ''}.{appointment.doctor_name.ShortName}" if appointment.doctor_name else None,
                'DoctorName' : (
                                f"{appointment.doctor_name.Tittle.Title_Name + '.' if appointment.doctor_name and appointment.doctor_name.Tittle else ''}"
                                f"{appointment.doctor_name.First_Name + ' ' if appointment.doctor_name and appointment.doctor_name.First_Name else ''}"
                                f"{appointment.doctor_name.Middle_Name + ' ' if appointment.doctor_name and appointment.doctor_name.Middle_Name else ''}"
                                f"{appointment.doctor_name.Last_Name if appointment.doctor_name and appointment.doctor_name.Last_Name else ''}"
                            ).strip(),

                'Status': appointment.status,
                'PatientId': appointment.PatientId.PatientId if appointment.PatientId else None,
            }
            for appointment in appointments
        ]

        # Fetch Arrived Patients from Appointment_ReSchedule_Request (Use Correct Field Names)
        # arrived_appointments = Appointment_ReSchedule_Request.objects.filter(
        #     status="Arrived"
        # )

        # arrived_patients_data = [
        #     {
        #         'id': appt.appointmentId.appointment_id if appt.appointmentId else None,
        #         'TitleId': appt.appointmentId.title.Title_Id if appt.appointmentId.title else None,
        #         'Title': appt.appointmentId.title.Title_Name if appt.appointmentId.title else None,
        #         'Fullname': f"{appt.appointmentId.title.Title_Name if appt.appointmentId.title else ''}.{appt.appointmentId.first_name if appt.appointmentId else ''}.{appt.appointmentId.middle_name if appt.appointmentId else ''}.{appt.appointmentId.last_name if appt.appointmentId else ''}",  
        #         'FirstName': appt.appointmentId.first_name if appt.appointmentId else None,
        #         'MiddleName': appt.appointmentId.middle_name if appt.appointmentId else None,
        #         'LastName': appt.appointmentId.last_name if appt.appointmentId else None,
        #         'PhoneNumber': appt.appointmentId.phone_number if appt.appointmentId else None,
        #         'Email': appt.appointmentId.email if appt.appointmentId else None,
        #         'Age': appt.appointmentId.Age if appt.appointmentId else None,
        #         'Gender': appt.appointmentId.Gender if appt.appointmentId else None,
        #         'AppointmentType': appt.appointmentId.appointment_type if appt.appointmentId else None,
        #         'RequestTime': appt.RequestTime.strftime('%I:%M %p') if appt.RequestTime else None,  # ✅ Fixed field name
        #         'RequestDate': appt.RequestDate.strftime('%d-%m-%Y') if appt.RequestDate else None,  # ✅ Fixed field name
        #         'VisitPurpose': appt.appointmentId.visit_purpose if appt.appointmentId else None,
        #         'SpecializationName': appt.specialization.Speciality_Name if appt.specialization else None,
        #         'SpecializationId': appt.specialization.Speciality_Id if appt.specialization else None,
        #         'DoctorID': appt.doctor_name.Doctor_ID if appt.doctor_name else None,
        #         'Referraldocname': f"{appt.ReferredBy.Tittle.Title_Id if appt.ReferredBy.Tittle else ''}.{appt.ReferredBy.ShortName}" if appt.ReferredBy else None,
        #         'Referredid': appt.ReferredBy.Doctor_ID if appt.ReferredBy else None,
        #         'DoctorName': f"{appt.doctor_name.Tittle.Title_Name if appt.doctor_name.Tittle else ''}.{appt.doctor_name.ShortName}" if appt.doctor_name else None,
        #         'Status': appt.status,
        #         'PatientId': appt.appointmentId.PatientId.PatientId if appt.appointmentId and appt.appointmentId.PatientId else None,
        #     }
        #     for appt in arrived_appointments
        # ]

        # Merge Arrived Patients with Appointment List
        # appointment_request_data.extend(arrived_patients_data)


        
        
        count_filters = {}
        if current_date:
            count_filters['request_date'] = current_date
        elif from_date and to_date:
            count_filters['request_date__range'] = [from_date, to_date]

         
        if DoctorName:
            count_filters['doctor_name__Doctor_ID'] = DoctorName

        if Specialization:
            count_filters['specialization__Speciality_Id'] = Specialization


        # ArrivedCount_filters = {}
        # if current_date:
        #     ArrivedCount_filters['RequestDate'] = current_date
        # elif from_date and to_date:
        #     ArrivedCount_filters['RequestDate__range'] = [from_date, to_date]

         
        # if DoctorName:
        #     ArrivedCount_filters['doctor_name__Doctor_ID'] = DoctorName

        # if Specialization:
        #     ArrivedCount_filters['specialization__Speciality_Id'] = Specialization
        
        # Get counts
        pending_count = Appointment_Request_List.objects.filter(status="PENDING",**count_filters).count()
        registered_count = Appointment_Request_List.objects.filter(status="REGISTERED",**count_filters).count()
        Arrived_count = Appointment_Request_List.objects.filter(status="Arrived",**count_filters).count()
        # RescheduledArrived_count = Appointment_ReSchedule_Request.objects.filter(status="Arrived",**ArrivedCount_filters).count()
        OpRegistered_count = Appointment_Request_List.objects.filter(status="OpRegistered",**count_filters).count()

        response_data = {
            "appointments": appointment_request_data,  # Now includes Arrived Patients
            "pending_count": pending_count,
            "registered_count": registered_count,
            "Arrived_count": Arrived_count,  # ✅ Combined Count
            "OpRegistered_count": OpRegistered_count,
        }

        print("Response Data:", response_data)

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Error fetching appointment data: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)





#-------Jeeva ----- Dont Change the code ------------------


@csrf_exempt
@require_http_methods(["GET"])
def fetch_all_Reschedule_appointment_pending_data(request):
    try:
        status = request.GET.get('status', '').strip()
        Current_date = request.GET.get('CurrentDate', '').strip()
        from_date = request.GET.get('startDate', '').strip()
        to_date = request.GET.get('endDate', '').strip()

        Specialization = request.GET.get('Specialization', '')
        DoctorName = request.GET.get('DoctorName', '')

        print('rrrrrr9999',status,
                Current_date,
                from_date,
                to_date,
                Specialization,
                DoctorName)
        query=Q()

        # If a status is provided, filter by it; otherwise, fetch all appointments.
        if status:
            query &=Q(status__icontains=status)
        

        if Current_date:
            query &= Q(RequestDate=Current_date)

        elif from_date and to_date:
            query &= Q(RequestDate__range=[from_date, to_date])

        if DoctorName:
            query &= Q(doctor_name__Doctor_ID = DoctorName )
        
        if Specialization:
            query &= Q(specialization__Speciality_Id = Specialization )
        
        queryset = Appointment_ReSchedule_Request.objects.filter(query)

        
        #
        appointment_request_data = []
        for appointment in queryset:
            appointment_dict = {
                'id': appointment.pk,
                'AppointmentId': appointment.appointmentId.appointment_id,
                'TitleId': appointment.appointmentId.title.Title_Id if appointment.appointmentId.title else None,
                'Title': appointment.appointmentId.title.Title_Name if appointment.appointmentId.title else None,
                'FirstName': appointment.appointmentId.first_name,
                'MiddleName': appointment.appointmentId.middle_name,
                'LastName': appointment.appointmentId.last_name,
                'Fullname': f"{appointment.appointmentId.title.Title_Name if appointment.appointmentId.title else ''}.{appointment.appointmentId.first_name if appointment.appointmentId else ''} {appointment.appointmentId.middle_name if appointment.appointmentId else ''} {appointment.appointmentId.last_name if appointment.appointmentId else ''}".strip(),

                # 'Fullname': f"{appointment.appointmentId.title.Title_Name if appointment.appointmentId.title else ''}.{appointment.appointmentId.first_name if appointment.appointmentId else ''}.{appointment.appointmentId.middle_name if appointment.appointmentId else ''}.{appointment.appointmentId.last_name if appointment.appointmentId else ''}",
                'PhoneNumber': appointment.appointmentId.phone_number,
                'Email': appointment.appointmentId.email,
                'AppointmentType': appointment.appointmentId.appointment_type,
                'RequestTime': appointment.appointmentId.request_time.strftime('%I:%M %p') if appointment.appointmentId.request_time else None,
                'RequestDate': appointment.appointmentId.request_date.strftime('%d-%m-%Y') if appointment.appointmentId.request_date else None,
                
                'Age': appointment.appointmentId.Age if appointment.appointmentId else None,
                'Gender': appointment.appointmentId.Gender if appointment.appointmentId else None,

                # 'RequestTime': appointment.appointmentId.request_time.strftime('%H:%M') if appointment.appointmentId.request_time else None,
                'VisitType': appointment.appointmentId.VisitType,
                'VisitPurpose': appointment.appointmentId.visit_purpose,
                'SpecializationName': appointment.specialization.Speciality_Name if appointment.specialization else None,
                'SpecializationId': appointment.specialization.Speciality_Id if appointment.specialization else None,
                'ShortName': f"{appointment.appointmentId.doctor_name.Tittle.Title_Name if appointment.appointmentId.doctor_name.Tittle else ''}.{appointment.appointmentId.doctor_name.ShortName}" if appointment.appointmentId.doctor_name else None,
                'DoctorName' : (
                                f"{appointment.doctor_name.Tittle.Title_Name + '.' if appointment.doctor_name and appointment.doctor_name.Tittle else ''}"
                                f"{appointment.doctor_name.First_Name + ' ' if appointment.doctor_name and appointment.doctor_name.First_Name else ''}"
                                f"{appointment.doctor_name.Middle_Name + ' ' if appointment.doctor_name and appointment.doctor_name.Middle_Name else ''}"
                                f"{appointment.doctor_name.Last_Name if appointment.doctor_name and appointment.doctor_name.Last_Name else ''}"
                            ).strip(),
                'DoctorID': appointment.appointmentId.doctor_name.Doctor_ID if appointment.appointmentId.doctor_name else None,
                'Status': appointment.status,
                'ChangingReason': appointment.ChangingReason,
                'PatientId': appointment.appointmentId.PatientId.PatientId if appointment.appointmentId.PatientId else None,
                'Referraldocname': f"{appointment.appointmentId.ReferredBy.Tittle.Title_Name if appointment.appointmentId.ReferredBy.Tittle else ''}.{appointment.appointmentId.ReferredBy.ShortName}" if appointment.appointmentId.ReferredBy else None,
                'Referredid': appointment.appointmentId.ReferredBy.Doctor_ID if appointment.appointmentId.ReferredBy else None,
            }
            appointment_request_data.append(appointment_dict)
        
        count_filters = {}

        if Current_date:
            count_filters['RequestDate'] = Current_date
        elif from_date and to_date:
            count_filters['RequestDate__range'] = [from_date, to_date]

        if DoctorName:
            count_filters['doctor_name__Doctor_ID'] = DoctorName

        if Specialization:
            count_filters['specialization__Speciality_Id'] = Specialization

        Reschedule_count = Appointment_ReSchedule_Request.objects.filter(status="Reschedule", **count_filters).count()

        response_data = {
            "appointments": appointment_request_data,
            "Reschedule_count": Reschedule_count,
        }
        print("Pending Count Filters:", count_filters)
        print("response_data:", response_data)
        print("Reschedule_count:", Reschedule_count)


        
        return JsonResponse(response_data, safe=False)
    except Exception as e:
        print(f"Error fetching appointment data: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



#-------Jeeva ----- Dont Change the code ------------------


@csrf_exempt
def get_all_appointments(request):
    if request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyDate = request.GET.get('SearchbyDate')
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbyPhoneNumber = request.GET.get('SearchbyPhoneNumber')
            SearchSpecialization = request.GET.get('SearchSpecialization')
            SearchDoctor = request.GET.get('SearchDoctor')
            SearchTimeOrderby = request.GET.get('SearchTimeOrderby')
            status_filter = request.GET.get('SearchStatus')

            print('status_filter:', status_filter)

            # Build dynamic filter query
            search_query = Q()
            
            if SearchbyFirstName:
                search_query &= Q(first_name__icontains=SearchbyFirstName)
            if SearchbyPhoneNumber:
                search_query &= Q(phone_number__icontains=SearchbyPhoneNumber)
            if SearchSpecialization:
                search_query &= Q(specialization__pk=SearchSpecialization)
            if SearchDoctor:
                search_query &= Q(doctor_name__pk=SearchDoctor)
            if status_filter:
                search_query &= Q(status=status_filter)

            # Filter appointments
            appointments = Appointment_Request_List.objects.filter(search_query)

            # Apply ordering dynamically
            if SearchTimeOrderby:
                if SearchTimeOrderby.lower() == 'order':
                    appointments = appointments.order_by('request_time')  # Ascending
                elif SearchTimeOrderby.lower() == 'disorder':
                    appointments = appointments.order_by('-request_time')  # Descending

            # Get latest reschedule requests for these appointments
            latest_reschedule_requests = (
                Appointment_ReSchedule_Request.objects
                .filter(appointmentId__in=appointments)
                .values('appointmentId')
                .annotate(latest_id=Max('id'))
                .values('appointmentId', 'latest_id')
            )

            # Create a dictionary for latest reschedule requests
            latest_reschedule_dict = {
                item['appointmentId']: item['latest_id']
                for item in latest_reschedule_requests
            }

            # Fetch all latest reschedule requests
            latest_reschedule_requests = (
                Appointment_ReSchedule_Request.objects
                .filter(id__in=latest_reschedule_dict.values())
            )

            # Create a dictionary for fast lookup
            latest_reschedule_lookup = {
                req.appointmentId.appointment_id: req
                for req in latest_reschedule_requests
            }

            # Prepare the response data
            response_data = []
            for appointment in appointments:
                reschedule_instance = latest_reschedule_lookup.get(appointment.appointment_id, None)

                # Base appointment data
                appointment_data = {
                    'id': appointment.appointment_id,
                    'Title': appointment.title.Title_Name if appointment.title else None,
                    'TitleId': appointment.title.Title_Id if appointment.title else None,
                    'FirstName': appointment.first_name,
                    'MiddleName': appointment.middle_name,
                    'LastName': appointment.last_name,
                    'PhoneNumber': appointment.phone_number,
                    'Email': appointment.email,
                    'RequestDate': appointment.request_date,
                    'AppointmentType': appointment.appointment_type,
                    'RequestTime': appointment.request_time,
                    'VisitPurpose': appointment.visit_purpose,
                    'SpecializationName': appointment.specialization.Speciality_Name if appointment.specialization else '',
                    'SpecializationId': appointment.specialization.Speciality_Id if appointment.specialization else '',
                    'DoctorName': appointment.doctor_name.ShortName if appointment.doctor_name else '',
                    'DoctorID': appointment.doctor_name.Doctor_ID if appointment.doctor_name else '',
                    'Location': appointment.Location.Location_Name if appointment.Location else '',
                    'CreatedBy': appointment.created_by,
                    'CancelReason': appointment.cancelReason,
                    'Status': appointment.status,
                    'PatientId': appointment.PatientId.PatientId if appointment.PatientId else None,
                    'Gender': appointment.PatientId.Gender if appointment.PatientId else None,
                    'MaritalStatus': appointment.PatientId.MaritalStatus if appointment.PatientId else None,
                    'SpouseName': appointment.PatientId.SpouseName if appointment.PatientId else None,
                    'FatherName': appointment.PatientId.FatherName if appointment.PatientId else None,
                    'DOB': appointment.PatientId.DOB if appointment.PatientId else None,
                    'Age': appointment.PatientId.Age if appointment.PatientId else None,

                    'BloodGroup': appointment.PatientId.BloodGroup.BloodGroup_Id if (appointment.PatientId and appointment.PatientId.BloodGroup) else None,
                    'Occupation': appointment.PatientId.Occupation if appointment.PatientId else None,
                    'Religion': appointment.PatientId.Religion.Religion_Id if (appointment.PatientId and appointment.PatientId.Religion) else None,

                    'Nationality': appointment.PatientId.Nationality if appointment.PatientId else None,
                    'UniqueIdType': appointment.PatientId.UniqueIdType if appointment.PatientId else None,
                    'UniqueIdNo': appointment.PatientId.UniqueIdNo if appointment.PatientId else None,
                    'PatientType': appointment.PatientId.PatientType if appointment.PatientId else None,
                    'DoorNo': appointment.PatientId.DoorNo if appointment.PatientId else None,
                    'Street': appointment.PatientId.Street if appointment.PatientId else None,
                    'Area': appointment.PatientId.Area if appointment.PatientId else None,
                    'City': appointment.PatientId.City if appointment.PatientId else None,
                    'District': appointment.PatientId.District if appointment.PatientId else None,
                    'State': appointment.PatientId.State if appointment.PatientId else None,
                    'Country': appointment.PatientId.Country if appointment.PatientId else None,
                    'Pincode': appointment.PatientId.Pincode if appointment.PatientId else None,
                    'ABHA': appointment.PatientId.ABHA if appointment.PatientId else None,
                    'referaldoctorname': appointment.ReferredBy.ShortName if appointment.ReferredBy else '',
                    'referaldoctorid': appointment.ReferredBy.Doctor_ID if appointment.ReferredBy else '',


                    'ReScheduled': 'No',
                }

                # Override data if a reschedule instance exists
                if reschedule_instance:
                    print('1111111112222223333333s')
                    print(reschedule_instance,'reschedule_instanceeeeeeeeeeeeeeeeee')
                    print(reschedule_instance.appointmentId ,'wwwwwwwwwwwwwww')
                    print(reschedule_instance.appointmentId.PatientId.PatientId if (reschedule_instance.appointmentId and reschedule_instance.appointmentId.PatientId) else None ,'jjjjjjjjjjjuuuuuuuuuuuuuuuuuuuuuu')
                    # print(reschedule_instance.appointmentId.PatientId.PatientId if reschedule_instance.appointmentId.PatientId else None,'reschedule_instanceeeeeeeeeeeeeeeeee')
                    appointment_data.update({
                        'RadioOption': reschedule_instance.RadioOption,
                        'RequestDate': reschedule_instance.RequestDate,
                        'ChangingReason': reschedule_instance.ChangingReason,
                        'SpecializationName': reschedule_instance.specialization.Speciality_Name if reschedule_instance.specialization else '',
                        'DoctorID': reschedule_instance.doctor_name.Doctor_ID if reschedule_instance.doctor_name else '',
                        'DoctorName': reschedule_instance.doctor_name.ShortName if reschedule_instance.doctor_name else '',
                        'ReScheduled': 'Yes',
                        'TitleId': reschedule_instance.appointmentId.title.Title_Id if reschedule_instance.appointmentId.title else None,
                        'FirstName': reschedule_instance.appointmentId.first_name if reschedule_instance.appointmentId else None,
                        'MiddleName': reschedule_instance.appointmentId.middle_name if reschedule_instance.appointmentId else None,
                        'LastName': reschedule_instance.appointmentId.last_name if reschedule_instance.appointmentId else None,
                        'PhoneNumber': reschedule_instance.appointmentId.phone_number if reschedule_instance.appointmentId else None,
                        'Email': reschedule_instance.appointmentId.email if reschedule_instance.appointmentId else None,
                        'SpecializationId': reschedule_instance.appointmentId.specialization.Speciality_Id if reschedule_instance.appointmentId.specialization else None,
                        'DoctorID': reschedule_instance.appointmentId.doctor_name.Doctor_ID if reschedule_instance.appointmentId.doctor_name else None,
                        'referaldoctorname': reschedule_instance.ReferredBy.ShortName if reschedule_instance.ReferredBy else '',
                        'referaldoctorid': reschedule_instance.ReferredBy.Doctor_ID if reschedule_instance.ReferredBy else '',
                        # 'PatientId': reschedule_instance.appointmentId.PatientId.PatientId if reschedule_instance.appointmentId.PatientId else None,
                        # 'Gender': reschedule_instance.appointmentId.PatientId.Gender if reschedule_instance.appointmentId.PatientId else None,
                        # 'MaritalStatus': reschedule_instance.appointmentId.PatientId.MaritalStatus if reschedule_instance.appointmentId.PatientId else None,
                        # 'SpouseName': reschedule_instance.appointmentId.PatientId.SpouseName if reschedule_instance.appointmentId.PatientId else None,
                        # 'FatherName': reschedule_instance.appointmentId.PatientId.FatherName if reschedule_instance.appointmentId.PatientId else None,
                        # 'DOB': reschedule_instance.appointmentId.PatientId.DOB if reschedule_instance.appointmentId.PatientId else None,
                        # 'Age': reschedule_instance.appointmentId.PatientId.Age if reschedule_instance.appointmentId.PatientId else None,
                        # 'BloodGroup': reschedule_instance.appointmentId.PatientId.BloodGroup.BloodGroup_Id if (reschedule_instance.appointmentId.PatientId and reschedule_instance.appointmentId.PatientId.BloodGroup) else None,
                        # 'Occupation': reschedule_instance.appointmentId.PatientId.Occupation if reschedule_instance.appointmentId.PatientId else None,
                        # 'Religion': reschedule_instance.appointmentId.PatientId.Religion.Religion_Id if (reschedule_instance.appointmentId.PatientId and reschedule_instance.appointmentId.PatientId.Religion) else None,
                        # 'Nationality': reschedule_instance.appointmentId.PatientId.Nationality if reschedule_instance.appointmentId.PatientId else None,
                        # 'UniqueIdType': reschedule_instance.appointmentId.PatientId.UniqueIdType if reschedule_instance.appointmentId.PatientId else None,
                        # 'UniqueIdNo': reschedule_instance.appointmentId.PatientId.UniqueIdNo if reschedule_instance.appointmentId.PatientId else None,
                        # 'PatientType': reschedule_instance.appointmentId.PatientId.PatientType if reschedule_instance.appointmentId.PatientId else None,
                        # 'DoorNo': reschedule_instance.appointmentId.PatientId.DoorNo if reschedule_instance.appointmentId.PatientId else None,
                        # 'Street': reschedule_instance.appointmentId.PatientId.Street if reschedule_instance.appointmentId.PatientId else None,
                        # 'Area': reschedule_instance.appointmentId.PatientId.Area if reschedule_instance.appointmentId.PatientId else None,
                        # 'City': reschedule_instance.appointmentId.PatientId.City if reschedule_instance.appointmentId.PatientId else None,
                        # 'District': reschedule_instance.appointmentId.PatientId.District if reschedule_instance.appointmentId.PatientId else None,
                        # 'State': reschedule_instance.appointmentId.PatientId.State if reschedule_instance.appointmentId.PatientId else None,
                        # 'Country': reschedule_instance.appointmentId.PatientId.Country if reschedule_instance.appointmentId.PatientId else None,
                        # 'Pincode': reschedule_instance.appointmentId.PatientId.Pincode if reschedule_instance.appointmentId.PatientId else None,
                        # 'ABHA': reschedule_instance.appointmentId.PatientId.ABHA if reschedule_instance.appointmentId.PatientId else None,
                       

                        'CreatedBy': reschedule_instance.created_by,
                        'UpdatedBy': reschedule_instance.created_by,
                    })


                    if reschedule_instance.appointmentId and reschedule_instance.appointmentId.PatientId:
                        print('4444444444444444444444444')
                        patient = reschedule_instance.appointmentId.PatientId
                        print(patient,'patienttttttttttttttttt')
                        appointment_data.update({
                            'PatientId': patient.PatientId,
                            'Gender': patient.Gender,
                            'MaritalStatus': patient.MaritalStatus,
                            'SpouseName': patient.SpouseName,
                            'FatherName': patient.FatherName,
                            'DOB': patient.DOB,
                            'Age': patient.Age,
                            'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
                            'Occupation': patient.Occupation,
                            'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                            'Nationality': patient.Nationality,
                            'UniqueIdType': patient.UniqueIdType,
                            'UniqueIdNo': patient.UniqueIdNo,
                            'PatientType': patient.PatientType,
                            'DoorNo': patient.DoorNo,
                            'Street': patient.Street,
                            'Area': patient.Area,
                            'City': patient.City,
                            'District': patient.District,
                            'State': patient.State,
                            'Country': patient.Country,
                            'Pincode': patient.Pincode,
                            'ABHA': patient.ABHA,
                        })

                response_data.append(appointment_data)
            
            if SearchbyDate:                
               search_date = datetime.strptime(SearchbyDate, "%Y-%m-%d").date()
               response_data = [row for row in response_data if row['RequestDate'] == search_date]

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"Error: {e}")  # Log the error for debugging
            return JsonResponse({"error": str(e)}, status=500)







 
@csrf_exempt
def calender_modal_display_data_by_day(request):
    if request.method == 'GET':
        try:
            doctor_id = request.GET.get('DoctorId')
            location_id = request.GET.get('LocationId')
            date = request.GET.get('Date')  # Expected in 'YYYY-MM-DD' format
            
            print("Doctorrrrrr",location_id, date)
            if not doctor_id:
                return JsonResponse({'error': 'DoctorId parameter is missing'}, status=400)
            if not date:
                return JsonResponse({'error': 'Date parameter is missing'}, status=400)
            
            # Fetch doctor details
            doctor_personal = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id)
            
            # Parse the date and get the day of the week
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            day_of_week = date_obj.strftime('%A')

            # Fetch schedules based on the doctor_id, location_id, and day of the week
            doctor_schedule = Doctor_Schedule_Details.objects.filter(Doctor_ID=doctor_id, Day=day_of_week)
            
            if location_id:
                doctor_schedule = doctor_schedule.filter(Location__Location_Id=location_id)
            
            # Check if there's an entry in Doctor_Calender_Modal_Edit for this date
            edit_entry = Doctor_Calender_Modal_Edit.objects.filter(Doctor_ID=doctor_id, Date=date_obj.strftime('%Y-%m-%d'), Location__Location_Id = location_id).last()
            
            schedule_list = []
            if edit_entry:
                # If an entry exists in Doctor_Calender_Modal_Edit, override the schedule details
                if edit_entry.RadioOption == 'Leave':
                    work_status = 'no'
                else:
                    work_status = 'yes'
                
                schedule_list.append({
                    'locationId': edit_entry.Location.Location_Id if edit_entry.Location else "",
                    'days': day_of_week,
                    'shift': edit_entry.Shift,
                    'starting_time': edit_entry.Starting_Time,
                    'ending_time': edit_entry.End_Time,
                    'starting_time_f': edit_entry.Starting_Time_F,
                    'ending_time_f': edit_entry.End_Time_F,
                    'starting_time_a': edit_entry.Starting_Time_A,
                    'ending_time_a': edit_entry.End_Time_A,
                    'working_hours_f': edit_entry.Working_Hours_F,
                    'working_hours_a': edit_entry.Working_Hours_A,
                    'working_hours_s': edit_entry.Working_Hours_S,
                    'total_working_hours': edit_entry.Total_Working_Hours,
                    'total_working_hours_s': edit_entry.Total_Working_Hours_S,
                    'leave_remarks': edit_entry.LeaveRemarks,
                    'working': work_status,
                    'changed': "yes",
                })
            else:
                # If no edit entry exists, use the original schedule data
                for schedule in doctor_schedule:
                    schedule_list.append({
                        'locationId': schedule.Location.Location_Id if schedule.Location else "",
                        'locationName': schedule.LocationName,
                        'days': schedule.Day,
                        'shift': schedule.Shift,
                        'starting_time': schedule.Starting_Time,
                        'ending_time': schedule.End_Time,
                        'starting_time_f': schedule.Starting_Time_F,
                        'ending_time_f': schedule.End_Time_F,
                        'starting_time_a': schedule.Starting_Time_A,
                        'ending_time_a': schedule.End_Time_A,
                        'working_hours_f': schedule.Working_Hours_F,
                        'working_hours_a': schedule.Working_Hours_A,
                        'working_hours_s': schedule.Working_Hours_S,
                        'total_working_hours': schedule.Total_Working_Hours,
                        'total_working_hours_s': schedule.Total_Working_Hours_S,
                        'working': schedule.IsWorking,  
                        'changed' : 'no',
                    })
            
            doctor_details = {
                'schedule': schedule_list,
                'created_at': doctor_personal.created_at,
            }
            return JsonResponse(doctor_details, safe=False)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


#-------Jeeva ----- Dont Change the code ------------------




@csrf_exempt
def get_available_doctor_by_speciality_For_Calander(request):
    if request.method == 'GET':
        try:
            location_id = request.GET.get('LocationId')
            current_date = request.GET.get('CurrentDate')  # For day view
            start_date = request.GET.get('startDate')      # For week/month view
            end_date = request.GET.get('endDate')          # For week/month view
            speciality_id = request.GET.get('Speciality')
            department = request.GET.get('Department')

            if not speciality_id:
                return JsonResponse({'error': 'Speciality parameter is missing'})

            # Validate department and speciality
            try:
                speciality = Speciality_Detials.objects.get(pk=speciality_id)
            except Speciality_Detials.DoesNotExist:
                return JsonResponse({'error': 'Speciality not found'})
            try:
                department = Department_Detials.objects.get(Department_Name__iexact=department)
            except Department_Detials.DoesNotExist:
                return JsonResponse({'error': 'Department not found'})

            doctors = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality, Department=department)

            # Determine which dates to process
            if current_date:
                date_range = [datetime.strptime(current_date, '%Y-%m-%d')]
            elif start_date and end_date:
                start = datetime.strptime(start_date, '%Y-%m-%d')
                end = datetime.strptime(end_date, '%Y-%m-%d')
                date_range = [start + timedelta(days=i) for i in range((end - start).days + 1)]
            else:
                return JsonResponse({'error': 'Date parameter is missing'})

            doctor_data = []

            for date_obj in date_range:
                day_of_week = date_obj.strftime('%A')
                
                for doctor in doctors:
                    try:
                        doctor_personal = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor.Doctor_ID.Doctor_ID)
                    except Doctor_Personal_Form_Detials.DoesNotExist:
                        continue

                    doctor_schedule = Doctor_Schedule_Details.objects.filter(Doctor_ID=doctor.Doctor_ID, Day=day_of_week)

                    if location_id:
                        doctor_schedule = doctor_schedule.filter(Location__Location_Id=location_id)

                    edit_entry = Doctor_Calender_Modal_Edit.objects.filter(
                        Doctor_ID=doctor_personal.Doctor_ID,
                        Date=date_obj.strftime('%Y-%m-%d'),
                        Location__Location_Id=location_id
                    ).last()

                    doctor_Speciality_Department_ins = Doctor_ProfessForm_Detials.objects.filter(
                        Doctor_ID=doctor_personal,
                        Specialization=speciality
                    ).first()

                    schedule_list = []
                    is_working = False

                    if edit_entry:
                        if edit_entry.RadioOption == 'Leave':
                            work_status = 'no'
                        else:
                            work_status = 'yes'
                            is_working = True

                        schedule_list.append({
                            'locationId': edit_entry.Location.Location_Id if edit_entry.Location else "",
                            'days': day_of_week,
                            'shift': edit_entry.Shift,
                            'starting_time': edit_entry.Starting_Time,
                            'ending_time': edit_entry.End_Time,
                            'starting_time_f': edit_entry.Starting_Time_F,
                            'ending_time_f': edit_entry.End_Time_F,
                            'starting_time_a': edit_entry.Starting_Time_A,
                            'ending_time_a': edit_entry.End_Time_A,
                            'working_hours_f': edit_entry.Working_Hours_F,
                            'working_hours_a': edit_entry.Working_Hours_A,
                            'working_hours_s': edit_entry.Working_Hours_S,
                            'total_working_hours': edit_entry.Total_Working_Hours,
                            'total_working_hours_s': edit_entry.Total_Working_Hours_S,
                            'leave_remarks': edit_entry.LeaveRemarks,
                            'working': work_status,
                            'changed': "yes",
                        })
                    else:
                        for schedule in doctor_schedule:
                            if schedule.IsWorking:
                                is_working = True
                                schedule_list.append({
                                    'locationId': schedule.Location.Location_Id if schedule.Location else "",
                                    'locationName': schedule.LocationName,
                                    'days': schedule.Day,
                                    'shift': schedule.Shift,
                                    'starting_time': schedule.Starting_Time,
                                    'ending_time': schedule.End_Time,
                                    'starting_time_f': schedule.Starting_Time_F,
                                    'ending_time_f': schedule.End_Time_F,
                                    'starting_time_a': schedule.Starting_Time_A,
                                    'ending_time_a': schedule.End_Time_A,
                                    'working_hours_f': schedule.Working_Hours_F,
                                    'working_hours_a': schedule.Working_Hours_A,
                                    'working_hours_s': schedule.Working_Hours_S,
                                    'total_working_hours': schedule.Total_Working_Hours,
                                    'total_working_hours_s': schedule.Total_Working_Hours_S,
                                    'working': schedule.IsWorking,
                                    'changed': 'no',
                                })

                    if is_working:
                        existing = next((d for d in doctor_data if d['doctor_id'] == doctor_personal.Doctor_ID), None)
                        if existing:
                            existing['dates'].append(date_obj.strftime('%Y-%m-%d'))
                            existing['schedule'].extend(schedule_list)
                        else:
                            doctor_data.append({
                                'doctor_id': doctor_personal.Doctor_ID,
                                'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.First_Name or ''} {doctor_personal.Middle_Name or ''} {doctor_personal.Last_Name or ''}""",
                                'Department': [dept.Department_Id for dept in doctor_Speciality_Department_ins.Department.all()] if doctor_Speciality_Department_ins else [],
                                'dates': [date_obj.strftime('%Y-%m-%d')],
                                'schedule': schedule_list,
                                'created_at': doctor_personal.created_at,
                            })


            return JsonResponse(doctor_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})


# @csrf_exempt
# def get_available_doctor_by_speciality_For_Registration(request):
#     if request.method == 'GET':
#         try:
#             location_id = request.GET.get('LocationId')
#             date = request.GET.get('Date')  # Expected in 'YYYY-MM-DD' format
#             speciality_id = request.GET.get('Speciality')  # Filter by Speciality
#             department = request.GET.get('Department')
#             print(speciality_id,'speciality_id23333333333333')
#             print(department,'department2222222')
            
#             if not speciality_id:
#                 return JsonResponse({'error': 'Speciality parameter is missing'})
#             if not date:
#                 return JsonResponse({'error': 'Date parameter is missing'})

#             try:
#                 speciality = Speciality_Detials.objects.get(pk=speciality_id)
#             except Speciality_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Speciality not found'})
#             try:
#                 department = Department_Detials.objects.get(Department_Name__iexact=department)
#             except Department_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Department not found'})

#             print(department,'department11111111111111')
#             # Fetch all doctors under the selected Speciality
#             doctors = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality,Department=department)
            
#             print(doctors,'doctors44444444444444444444')
#             # Parse the date and get the day of the week
#             date_obj = datetime.strptime(date, '%Y-%m-%d')
#             day_of_week = date_obj.strftime('%A')

#             doctor_data = []
#             for doctor in doctors:
#                 try:
#                     # Fetch doctor personal details
#                     doctor_personal = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor.Doctor_ID.Doctor_ID)
#                 except Doctor_Personal_Form_Detials.DoesNotExist:
#                     continue  # Skip if doctor personal details not found

#                 # Fetch schedules based on doctor_id, location_id, and day of the week
#                 doctor_schedule = Doctor_Schedule_Details.objects.filter(Doctor_ID=doctor.Doctor_ID, Day=day_of_week)

#                 # Filter schedules by location if location_id is provided
#                 if location_id:
#                     doctor_schedule = doctor_schedule.filter(Location__Location_Id=location_id)

#                 # Check if there's an entry in Doctor_Calender_Modal_Edit for this date
#                 edit_entry = Doctor_Calender_Modal_Edit.objects.filter(
#                     Doctor_ID=doctor_personal.Doctor_ID,
#                     Date=date_obj.strftime('%Y-%m-%d'),
#                     Location__Location_Id=location_id
#                 ).last()

#                 schedule_list = []
#                 is_working = False  # Default to False

#                 # If an edit entry exists, use it to determine if the doctor is working
#                 if edit_entry:
#                     if edit_entry.RadioOption == 'Leave':
#                         work_status = 'no'
#                     else:
#                         work_status = 'yes'
#                         is_working = True  # Doctor is marked as working in the edit entry

#                     schedule_list.append({
#                         'locationId': edit_entry.Location.Location_Id if edit_entry.Location else "",
#                         'days': day_of_week,
#                         'shift': edit_entry.Shift,
#                         'starting_time': edit_entry.Starting_Time,
#                         'ending_time': edit_entry.End_Time,
#                         'starting_time_f': edit_entry.Starting_Time_F,
#                         'ending_time_f': edit_entry.End_Time_F,
#                         'starting_time_a': edit_entry.Starting_Time_A,
#                         'ending_time_a': edit_entry.End_Time_A,
#                         'working_hours_f': edit_entry.Working_Hours_F,
#                         'working_hours_a': edit_entry.Working_Hours_A,
#                         'working_hours_s': edit_entry.Working_Hours_S,
#                         'total_working_hours': edit_entry.Total_Working_Hours,
#                         'total_working_hours_s': edit_entry.Total_Working_Hours_S,
#                         'leave_remarks': edit_entry.LeaveRemarks,
#                         'working': work_status,
#                         'changed': "yes",
#                     })

#                 # If no edit entry exists, use the original schedule data
#                 else:
#                     for schedule in doctor_schedule:
#                         if schedule.IsWorking:  # Check if the doctor is marked as working in the original schedule
#                             is_working = True  # Doctor is working based on the original schedule
#                             schedule_list.append({
#                                 'locationId': schedule.Location.Location_Id if schedule.Location else "",
#                                 'locationName': schedule.LocationName,
#                                 'days': schedule.Day,
#                                 'shift': schedule.Shift,
#                                 'starting_time': schedule.Starting_Time,
#                                 'ending_time': schedule.End_Time,
#                                 'starting_time_f': schedule.Starting_Time_F,
#                                 'ending_time_f': schedule.End_Time_F,
#                                 'starting_time_a': schedule.Starting_Time_A,
#                                 'ending_time_a': schedule.End_Time_A,
#                                 'working_hours_f': schedule.Working_Hours_F,
#                                 'working_hours_a': schedule.Working_Hours_A,
#                                 'working_hours_s': schedule.Working_Hours_S,
#                                 'total_working_hours': schedule.Total_Working_Hours,
#                                 'total_working_hours_s': schedule.Total_Working_Hours_S,
#                                 'working': schedule.IsWorking,  
#                                 'changed': 'no',
#                             })

#                 # Only add doctor data if the doctor is working on that day
#                 if is_working:
#                     doctor_data.append({
#                         'doctor_id': doctor_personal.Doctor_ID,
#                         # 'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.ShortName if doctor_personal else ''}""",
#                         # 'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.First_Name if doctor_personal else ''} {doctor_personal.Last_Name if doctor_personal else ''}""",
#                         'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.First_Name if doctor_personal else ''} {doctor_personal.Middle_Name if doctor_personal else ''} {doctor_personal.Last_Name if doctor_personal else ''}""",
#                         'schedule': schedule_list,
#                         'created_at': doctor_personal.created_at,
#                     })

#             return JsonResponse(doctor_data, safe=False)
#         except Exception as e:
#             return JsonResponse({'error': str(e)})


def clean(value):
    return '' if value in [None, '', 'NULL', 'null'] else value


@csrf_exempt
def get_available_doctor_by_speciality_For_Registration(request):
    if request.method == 'GET':
        try:
            location_id = request.GET.get('LocationId')
            date = request.GET.get('Date')  # Expected in 'YYYY-MM-DD' format
            speciality_id = request.GET.get('Speciality')  # Filter by Speciality
            department = request.GET.get('Department')
            print(speciality_id,'speciality_id23333333333333')
            # print(department,'department2222222')
            
            if not speciality_id:
                return JsonResponse({'error': 'Speciality parameter is missing'})
            if not date:
                return JsonResponse({'error': 'Date parameter is missing'})

            try:
                speciality = Speciality_Detials.objects.get(pk=speciality_id)
            except Speciality_Detials.DoesNotExist:
                return JsonResponse({'error': 'Speciality not found'})
            # try:
            #     department = Department_Detials.objects.get(Department_Name__iexact=department)
            # except Department_Detials.DoesNotExist:
            #     return JsonResponse({'error': 'Department not found'})

            # print(department,'department11111111111111')
            # Fetch all doctors under the selected Speciality
            # doctors = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality)
            doctors = None
            if department:
                doctors = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality,Department__Department_Name=department)
            else:
                doctors = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality)


            
            print(doctors,'doctors44444444444444444444')
            # Parse the date and get the day of the week
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            day_of_week = date_obj.strftime('%A')

            doctor_data = []
            for doctor in doctors:
                try:
                    # Fetch doctor personal details
                    doctor_personal = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor.Doctor_ID.Doctor_ID)
                except Doctor_Personal_Form_Detials.DoesNotExist:
                    continue  # Skip if doctor personal details not found

                # Fetch schedules based on doctor_id, location_id, and day of the week
                doctor_schedule = Doctor_Schedule_Details.objects.filter(Doctor_ID=doctor.Doctor_ID, Day=day_of_week)

                # Filter schedules by location if location_id is provided
                if location_id:
                    doctor_schedule = doctor_schedule.filter(Location__Location_Id=location_id)

                # Check if there's an entry in Doctor_Calender_Modal_Edit for this date
                edit_entry = Doctor_Calender_Modal_Edit.objects.filter(
                    Doctor_ID=doctor_personal.Doctor_ID,
                    Date=date_obj.strftime('%Y-%m-%d'),
                    Location__Location_Id=location_id
                ).last()

                schedule_list = []
                is_working = False  # Default to False

                # If an edit entry exists, use it to determine if the doctor is working
                if edit_entry:
                    if edit_entry.RadioOption == 'Leave':
                        work_status = 'no'
                    else:
                        work_status = 'yes'
                        is_working = True  # Doctor is marked as working in the edit entry

                    schedule_list.append({
                        'locationId': edit_entry.Location.Location_Id if edit_entry.Location else "",
                        'days': day_of_week,
                        'shift': edit_entry.Shift,
                        'starting_time': edit_entry.Starting_Time,
                        'ending_time': edit_entry.End_Time,
                        'starting_time_f': edit_entry.Starting_Time_F,
                        'ending_time_f': edit_entry.End_Time_F,
                        'starting_time_a': edit_entry.Starting_Time_A,
                        'ending_time_a': edit_entry.End_Time_A,
                        'working_hours_f': edit_entry.Working_Hours_F,
                        'working_hours_a': edit_entry.Working_Hours_A,
                        'working_hours_s': edit_entry.Working_Hours_S,
                        'total_working_hours': edit_entry.Total_Working_Hours,
                        'total_working_hours_s': edit_entry.Total_Working_Hours_S,
                        'leave_remarks': edit_entry.LeaveRemarks,
                        'working': work_status,
                        'changed': "yes",
                    })

                # If no edit entry exists, use the original schedule data
                else:
                    for schedule in doctor_schedule:
                        if schedule.IsWorking:  # Check if the doctor is marked as working in the original schedule
                            is_working = True  # Doctor is working based on the original schedule
                            schedule_list.append({
                                'locationId': schedule.Location.Location_Id if schedule.Location else "",
                                'locationName': schedule.LocationName,
                                'days': schedule.Day,
                                'shift': schedule.Shift,
                                'starting_time': schedule.Starting_Time,
                                'ending_time': schedule.End_Time,
                                'starting_time_f': schedule.Starting_Time_F,
                                'ending_time_f': schedule.End_Time_F,
                                'starting_time_a': schedule.Starting_Time_A,
                                'ending_time_a': schedule.End_Time_A,
                                'working_hours_f': schedule.Working_Hours_F,
                                'working_hours_a': schedule.Working_Hours_A,
                                'working_hours_s': schedule.Working_Hours_S,
                                'total_working_hours': schedule.Total_Working_Hours,
                                'total_working_hours_s': schedule.Total_Working_Hours_S,
                                'working': schedule.IsWorking,  
                                'changed': 'no',
                            })

                # Only add doctor data if the doctor is working on that day
                if is_working:
                    doctor_data.append({
                        'doctor_id': doctor_personal.Doctor_ID,
                        # 'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.ShortName if doctor_personal else ''}""",
                        # 'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.First_Name if doctor_personal else ''} {doctor_personal.Last_Name if doctor_personal else ''}""",
                        'doctor_name': f"{clean(getattr(doctor_personal, 'First_Name', ''))} {clean(getattr(doctor_personal, 'Middle_Name', ''))} {clean(getattr(doctor_personal, 'Last_Name', ''))}".strip().upper(),                        'schedule': schedule_list,
                        'created_at': doctor_personal.created_at,
                    })

            return JsonResponse(doctor_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})



@csrf_exempt
def get_available_doctor_by_speciality(request):
    if request.method == 'GET':
        try:
            location_id = request.GET.get('LocationId')
            date = request.GET.get('Date')  # Expected in 'YYYY-MM-DD' format
            speciality_id = request.GET.get('Speciality')  # Filter by Speciality
            department = request.GET.get('Department')
            print(speciality_id,'speciality_id23333333333333')
            print(department,'department2222222')
            
            if not speciality_id:
                return JsonResponse({'error': 'Speciality parameter is missing'})
            if not date:
                return JsonResponse({'error': 'Date parameter is missing'})

            try:
                speciality = Speciality_Detials.objects.get(pk=speciality_id)
            except Speciality_Detials.DoesNotExist:
                return JsonResponse({'error': 'Speciality not found'})
            try:
                department = Department_Detials.objects.get(Department_Name__iexact=department)
            except Department_Detials.DoesNotExist:
                return JsonResponse({'error': 'Department not found'})

            print(department,'department11111111111111')
            # Fetch all doctors under the selected Speciality
            doctors = Doctor_ProfessForm_Detials.objects.filter(Specialization=speciality,Department=department)
            
            print(doctors,'doctors44444444444444444444')
            # Parse the date and get the day of the week
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            day_of_week = date_obj.strftime('%A')

            doctor_data = []
            for doctor in doctors:
                try:
                    # Fetch doctor personal details
                    doctor_personal = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor.Doctor_ID.Doctor_ID)
                except Doctor_Personal_Form_Detials.DoesNotExist:
                    continue  # Skip if doctor personal details not found

                # Fetch schedules based on doctor_id, location_id, and day of the week
                doctor_schedule = Doctor_Schedule_Details.objects.filter(Doctor_ID=doctor.Doctor_ID, Day=day_of_week)

                # Filter schedules by location if location_id is provided
                if location_id:
                    doctor_schedule = doctor_schedule.filter(Location__Location_Id=location_id)

                # Check if there's an entry in Doctor_Calender_Modal_Edit for this date
                edit_entry = Doctor_Calender_Modal_Edit.objects.filter(
                    Doctor_ID=doctor_personal.Doctor_ID,
                    Date=date_obj.strftime('%Y-%m-%d'),
                    Location__Location_Id=location_id
                ).last()

                schedule_list = []
                is_working = False  # Default to False

                # If an edit entry exists, use it to determine if the doctor is working
                if edit_entry:
                    if edit_entry.RadioOption == 'Leave':
                        work_status = 'no'
                    else:
                        work_status = 'yes'
                        is_working = True  # Doctor is marked as working in the edit entry

                    schedule_list.append({
                        'locationId': edit_entry.Location.Location_Id if edit_entry.Location else "",
                        'days': day_of_week,
                        'shift': edit_entry.Shift,
                        'starting_time': edit_entry.Starting_Time,
                        'ending_time': edit_entry.End_Time,
                        'starting_time_f': edit_entry.Starting_Time_F,
                        'ending_time_f': edit_entry.End_Time_F,
                        'starting_time_a': edit_entry.Starting_Time_A,
                        'ending_time_a': edit_entry.End_Time_A,
                        'working_hours_f': edit_entry.Working_Hours_F,
                        'working_hours_a': edit_entry.Working_Hours_A,
                        'working_hours_s': edit_entry.Working_Hours_S,
                        'total_working_hours': edit_entry.Total_Working_Hours,
                        'total_working_hours_s': edit_entry.Total_Working_Hours_S,
                        'leave_remarks': edit_entry.LeaveRemarks,
                        'working': work_status,
                        'changed': "yes",
                    })

                # If no edit entry exists, use the original schedule data
                else:
                    for schedule in doctor_schedule:
                        if schedule.IsWorking:  # Check if the doctor is marked as working in the original schedule
                            is_working = True  # Doctor is working based on the original schedule
                            schedule_list.append({
                                'locationId': schedule.Location.Location_Id if schedule.Location else "",
                                'locationName': schedule.LocationName,
                                'days': schedule.Day,
                                'shift': schedule.Shift,
                                'starting_time': schedule.Starting_Time,
                                'ending_time': schedule.End_Time,
                                'starting_time_f': schedule.Starting_Time_F,
                                'ending_time_f': schedule.End_Time_F,
                                'starting_time_a': schedule.Starting_Time_A,
                                'ending_time_a': schedule.End_Time_A,
                                'working_hours_f': schedule.Working_Hours_F,
                                'working_hours_a': schedule.Working_Hours_A,
                                'working_hours_s': schedule.Working_Hours_S,
                                'total_working_hours': schedule.Total_Working_Hours,
                                'total_working_hours_s': schedule.Total_Working_Hours_S,
                                'working': schedule.IsWorking,  
                                'changed': 'no',
                            })

                # Only add doctor data if the doctor is working on that day
                if is_working:
                    doctor_data.append({
                        'doctor_id': doctor_personal.Doctor_ID,
                        # 'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.ShortName if doctor_personal else ''}""",
                        # 'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.First_Name if doctor_personal else ''} {doctor_personal.Last_Name if doctor_personal else ''}""",
                        'doctor_name': f"""{doctor_personal.Tittle.Title_Name if doctor_personal.Tittle else ''}.{doctor_personal.First_Name if doctor_personal else ''} {doctor_personal.Middle_Name if doctor_personal else ''} {doctor_personal.Last_Name if doctor_personal else ''}""",
                        'schedule': schedule_list,
                        'created_at': doctor_personal.created_at,
                    })

            return JsonResponse(doctor_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})




#-------Jeeva ----- Dont Change the code ------------------




@csrf_exempt
def doctor_available_calender_by_day(request):
    if request.method == 'GET':
        try:
            location_id = request.GET.get('LocationId')
            month = request.GET.get('month')  # e.g., '08' for August
            year = request.GET.get('year')    # e.g., '2024'
            
            if not month or not year:
                return JsonResponse({'error': 'Month and year parameters are required'}, status=400)
            
            # Validate month and year
            try:
                month = int(month)
                year = int(year)
                if month < 1 or month > 12:
                    raise ValueError("Month must be between 1 and 12")
            except ValueError as e:
                return JsonResponse({'error': str(e)}, status=400)
            
            # Get the first and last day of the selected month
            first_day = datetime(year, month, 1)
            last_day = (first_day + timedelta(days=31)).replace(day=1) - timedelta(days=1)

            # Generate a list of all days in the month
            all_days = [first_day + timedelta(days=i) for i in range((last_day - first_day).days + 1)]

            all_doctor_data = []

            doctors = Doctor_Personal_Form_Detials.objects.all()

            for doctor in doctors:
                doctor_id = doctor.Doctor_ID
                
                # Get doctor schedules
                doctor_schedule = Doctor_Schedule_Details.objects.filter(Doctor_ID=doctor_id)
                
                if location_id:
                    doctor_schedule = doctor_schedule.filter(Location__Location_Id=location_id)
                
                # Get data from Doctor_Calender_Modal_Edit table
                doctor_calendar_edit = Doctor_Calender_Modal_Edit.objects.filter(Doctor_ID=doctor_id)

                # Fetch the doctor's specialization
                doctor_prof_details = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=doctor_id).first()
                specialization_name = doctor_prof_details.Specialization.Speciality_Name if doctor_prof_details and doctor_prof_details.Specialization else 'N/A'
                
                # Create a dictionary to map weekdays to schedules
                schedule_dict = {}
                for schedule in doctor_schedule:
                    weekday = schedule.Day
                    if weekday not in schedule_dict:
                        schedule_dict[weekday] = []
                    
                    schedule_dict[weekday].append({
                        'locationId': schedule.Location.Location_Id if schedule.Location else "",
                        'locationName': schedule.LocationName,
                        'working': schedule.IsWorking,
                        'shift': schedule.Shift,
                        'starting_time': schedule.Starting_Time,
                        'ending_time': schedule.End_Time,
                        'starting_time_f': schedule.Starting_Time_F,
                        'ending_time_f': schedule.End_Time_F,
                        'starting_time_a': schedule.Starting_Time_A,
                        'ending_time_a': schedule.End_Time_A,
                        'working_hours_f': schedule.Working_Hours_F,
                        'working_hours_a': schedule.Working_Hours_A,
                        'working_hours_s': schedule.Working_Hours_S,
                        'total_working_hours': schedule.Total_Working_Hours,
                        'total_working_hours_s': schedule.Total_Working_Hours_S,
                        'changed': "no",
                    })
                
                # Fetch data from Doctor_Calender_Modal_Edit for each day
                calendar_data = []
                for day in all_days:
                    day_str = day.strftime('%Y-%m-%d')  # Convert to string
                    day_of_week = day.strftime('%A')  # Get the day of the week
                    schedules = schedule_dict.get(day_of_week, [])

                    # Check if there's an entry in Doctor_Calender_Modal_Edit for this day
                    edit_entry = doctor_calendar_edit.filter(Date=day_str, Location__Location_Id=location_id).last()
                    if edit_entry:
                        # If an entry exists in the modal edit table, use it to override the schedule
                        if edit_entry.RadioOption == 'Leave':
                            work_status = 'no'
                        else:
                            work_status = 'yes'
                        
                        schedules = [{
                            'locationId': edit_entry.Location.Location_Id if edit_entry.Location else "",
                            'locationName': schedule.LocationName,
                            'working': work_status,
                            'shift': edit_entry.Shift,
                            'starting_time': edit_entry.Starting_Time,
                            'ending_time': edit_entry.End_Time,
                            'starting_time_f': edit_entry.Starting_Time_F,
                            'ending_time_f': edit_entry.End_Time_F,
                            'starting_time_a': edit_entry.Starting_Time_A,
                            'ending_time_a': edit_entry.End_Time_A,
                            'working_hours_f': edit_entry.Working_Hours_F,
                            'working_hours_a': edit_entry.Working_Hours_A,
                            'working_hours_s': edit_entry.Working_Hours_S,
                            'total_working_hours': edit_entry.Total_Working_Hours,
                            'total_working_hours_s': edit_entry.Total_Working_Hours_S,
                            'leave_remarks' : edit_entry.LeaveRemarks,
                            'changed': "yes",
                        }]
                    
                    # Append the data for this day
                    calendar_data.append({
                        'date': day_str,
                        'day_of_week': day_of_week,
                        'schedules': schedules,
                    })

                # Compile the final details for this doctor
                doctor_details = {
                    'doctor_id': doctor_id,
                    'doctor_name': f'{doctor.Tittle}.{doctor.ShortName}',
                    'doctor_specialization': specialization_name,
                    'schedule': calendar_data,
                    'created_at': doctor.created_at,
                }
                all_doctor_data.append(doctor_details)

            return JsonResponse(all_doctor_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)




# -------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(['POST','OPTIONS','GET'])
def Get_OP_Doctor_For_appointment(request):
    if request.method == 'GET':
        try:

            Sendall=request.GET.get('Sendall')

            qery = Q()

            if not Sendall:
                qery &=Q(Department__Department_Id = 2)

            doctors_Personal_Ins = Doctor_ProfessForm_Detials.objects.filter(qery)
            
            doc_arr=[]

            for doctor in doctors_Personal_Ins:
                doc_obj={

                    'id':doctor.Doctor_ID.pk,
                    'ShortName':doctor.Doctor_ID.ShortName,
                }

                doc_arr.append(doc_obj)
            
            return JsonResponse(doc_arr,safe=False)

        except Exception as e:
            print(f'An error accurred:{str(e)}')
            return JsonResponse ({'error ' : f'An error accurred:{str(e)}'},status=500)



@csrf_exempt
@require_http_methods(["GET"])
def daily_appointment_counts_all_doctors(request):
    try:
        location_id = request.GET.get('LocationId')
        SelectedDoctor = request.GET.get('SelectedDoctor')

        now = datetime.now()
        month = now.month
        year = now.year

        first_day = datetime(year, month, 1)
        last_day = (first_day + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        all_days = [first_day + timedelta(days=i) for i in range((last_day - first_day).days + 1)]

        counts_all_doctors = {
            day.strftime('%Y-%m-%d'): {'Total': 0, 'Pending': 0, 'Registered': 0, 'Canceled': 0} for day in all_days
        }

        if SelectedDoctor:
            appointments = Appointment_Request_List.objects.filter(
                doctor_name__Doctor_ID=SelectedDoctor,
                request_date__range=[first_day, last_day]
            ).values('request_date', 'status').annotate(appointment_count=Count('appointment_id'))

            daily_registration_counts = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    PrimaryDoctor__Doctor_ID=SelectedDoctor,
                    created_at__date__range=[first_day, last_day]
                ).values('created_at__date').annotate(registration_count=Count('created_at__date'))
            
            registration_count_map = {
                    reg['created_at__date'].strftime('%Y-%m-%d'): reg['registration_count'] for reg in daily_registration_counts
                }
            
            for appt in appointments:
                day_str = appt['request_date'].strftime('%Y-%m-%d')
                status = appt['status'].lower()
                count = appt['appointment_count']
                
                counts_all_doctors[day_str]['Total'] += count

                
                registered_count = registration_count_map.get(day_str, 0)
                counts_all_doctors[day_str]['Registered'] += registered_count
                
                if status == 'pending':
                    counts_all_doctors[day_str]['Pending'] += count
                elif status == 'cancelled':
                    counts_all_doctors[day_str]['Canceled'] += count

        else:
            doctors = Doctor_ProfessForm_Detials.objects.filter(Department__Department_Id = 2)

            for doctor in doctors:

                appointments = Appointment_Request_List.objects.filter(
                    doctor_name__pk=doctor.Doctor_ID.pk,
                    request_date__range=[first_day, last_day]
                ).values('request_date','status').annotate(appointment_count=Count('appointment_id'))

                # print('appointments------',appointments)

                daily_registration_counts = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    PrimaryDoctor__pk=doctor.Doctor_ID.pk,
                    created_at__date__range=[first_day, last_day]
                ).values('created_at__date').annotate(registration_count=Count('created_at__date'))

                # print('registration_counts------',daily_registration_counts)

                registration_count_map = {
                    reg['created_at__date'].strftime('%Y-%m-%d'): reg['registration_count'] for reg in daily_registration_counts
                }

                # print('registration_count_map',registration_count_map)

                for appt in appointments:
                    day_str = appt['request_date'].strftime('%Y-%m-%d')
                    status = appt['status'].lower()
                    count = appt['appointment_count']
                    
                    counts_all_doctors[day_str]['Total'] += count
                    
                    registered_count = registration_count_map.get(day_str, 0)
                    counts_all_doctors[day_str]['Registered'] += registered_count

                    if status == 'pending':
                        counts_all_doctors[day_str]['Pending'] += count
                    elif status == 'cancelled':
                        counts_all_doctors[day_str]['Canceled'] += count

        # print('counts_all_doctors------',counts_all_doctors)

        return JsonResponse(counts_all_doctors, safe=False)

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=400)




@csrf_exempt
@require_http_methods(["GET"])
def daily_appointment_patient_list(request):
    if request.method == 'GET':
        try:
            location_id = request.GET.get('LocationId')            
            SelectedDoctor = request.GET.get('SelectedDoctor')
            Daystatus=request.GET.get('Daystatus')
            
            formattedDate=request.GET.get('formattedDate')

            # print('formattedDate',formattedDate)
            
            appointment_patient_list = []
            # print('Daystatus++++',Daystatus)



            qery= Q()

            qery &= Q(Department__Department_Id = 2)

            if SelectedDoctor:
                # print('SelectedDoctor----',SelectedDoctor)
                qery &= Q(Doctor_ID__pk = SelectedDoctor)
            
            doctors = Doctor_ProfessForm_Detials.objects.filter(qery)


            for doctor in doctors:

                daily_appointment_Patent_detaile = []

                
                second_qery= Q()

                if Daystatus == 'REGISTERED' :

                    registration__patient = Patient_Appointment_Registration_Detials.objects.filter(
                        PrimaryDoctor__pk=doctor.Doctor_ID.pk,
                        created_at__date=formattedDate)

                    # print('registration__patient',registration__patient)
                    
                    for patient in registration__patient:
                        patient_data = {

                            'id': patient.pk,
                            'PatientName': f'{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}',
                            'PhoneNumber': patient.PatientId.PhoneNo,
                            'AppointmentSlot': patient.AppointmentSlot_by_Doctor,
                            'VisitPurpose': patient.VisitPurpose,

                        }

                        daily_appointment_Patent_detaile.append(patient_data)

                    if daily_appointment_Patent_detaile :   
                        doctor_details = {
                            'DoctorName': f'{doctor.Doctor_ID.ShortName} ({doctor.Specialization.Speciality_Name})',
                            'Appointments': daily_appointment_Patent_detaile
                        }
                        appointment_patient_list.append(doctor_details)

                else:
                    # print('Daystatus',Daystatus)
                    if not Daystatus == 'Total' :
                        # print('HII-vvvv',Daystatus)
                        second_qery &= Q(status=Daystatus)

                    second_qery &= Q(doctor_name__Doctor_ID=doctor.Doctor_ID.pk,request_date=formattedDate)

                    # print('9999',second_qery)
                    
                    appointments_patient=Appointment_Request_List.objects.filter(second_qery)

                    # print('appointments_patient',appointments_patient)

                    # print('0--===',appointments_patient)
                    
                    for patient in appointments_patient:
                        # Check if patient fields exist
                        patient_data = {
                            'id': patient.appointment_id,
                            'PatientName': f'{patient.first_name} {patient.middle_name} {patient.last_name}',
                            'PhoneNumber': patient.phone_number,
                            'AppointmentType': patient.appointment_type,
                            'RequestTime': patient.request_time,
                            'VisitPurpose': patient.visit_purpose,
                        }


                        daily_appointment_Patent_detaile.append(patient_data)
                        
                    if daily_appointment_Patent_detaile :   
                        doctor_details = {
                            'DoctorName': f'{doctor.Doctor_ID.ShortName} ({doctor.Specialization.Speciality_Name})',
                            'Appointments': daily_appointment_Patent_detaile
                        }
                        appointment_patient_list.append(doctor_details)
                
                # print('====',appointment_patient_list)

            return JsonResponse(appointment_patient_list, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=400)


@csrf_exempt
def get_appointment_check(request):
    if request.method == 'GET':
        try:
            firstname = request.GET.get('FirstName')
            phonenumber = request.GET.get('PhoneNo')

            if not firstname or not phonenumber:
                return JsonResponse({'error': 'First Name and Phone Number are required'}, status=400)

            patient_ins = Patient_Detials.objects.filter(FirstName=firstname, PhoneNo=phonenumber).first()
            if patient_ins:
                return JsonResponse({'success': 'OP'})
            else:
                return JsonResponse({'success': 'Master'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)





@csrf_exempt
@require_http_methods(["GET"])
def OpREgeg_appointment_Detiles(request):
    try:
        # Get parameters from request
        patient_id = request.GET.get('PatientId')
        status_list = request.GET.getlist('status', [])
       
        # Build query
        query = Q()
       
        # Filter by patient_id if provided
        if patient_id:
            query &= Q(PatientId__PatientId=patient_id)
       
        # Filter by status if provided
        if status_list:
            cleaned_status = [s.strip() for s in status_list if s.strip()]
            if cleaned_status:
                query &= Q(status__in=cleaned_status)
 
        # Execute query
        queryset = Appointment_Request_List.objects.filter(query).select_related(
            'title', 'PatientId', 'specialization', 'doctor_name', 'ReferredBy'
        )
 
        # Serialize data
        appointment_request_data = [
            {
                'id': appointment.appointment_id,
                'TitleId': appointment.title.Title_Id if appointment.title else None,
                'Title': appointment.title.Title_Name if appointment.title else None,
                'FirstName': appointment.first_name,
                'MiddleName': appointment.middle_name,
                'LastName': appointment.last_name,
                'Fullname': f"{appointment.title.Title_Name if appointment.title else ''}."
                             f"{appointment.first_name or ''}."
                             f"{appointment.middle_name or ''}."
                             f"{appointment.last_name or ''}",
                'PhoneNumber': appointment.phone_number,
                'Email': appointment.email,
                'Age': appointment.Age,
                'Gender': appointment.Gender,
                'RequestDate': appointment.request_date.strftime('%d-%m-%Y') if appointment.request_date else None,
                'AppointmentType': appointment.appointment_type,
                'RequestTime': appointment.request_time.strftime('%I:%M %p') if appointment.request_time else None,
                'VisitPurpose': appointment.visit_purpose,
                'SpecializationName': appointment.specialization.Speciality_Name if appointment.specialization else None,
                'SpecializationId': appointment.specialization.Speciality_Id if appointment.specialization else None,
                'DoctorName': f"{appointment.doctor_name.Tittle.Title_Name if appointment.doctor_name.Tittle else ''}."
                            f"{appointment.doctor_name.ShortName}" if appointment.doctor_name else None,
                'DoctorID': appointment.doctor_name.Doctor_ID if appointment.doctor_name else None,
                'Status': appointment.status,
                'PatientId': appointment.PatientId.PatientId if appointment.PatientId else None,
                'Referraldocname': f"{appointment.ReferredBy.Tittle.Title_Name if appointment.ReferredBy and appointment.ReferredBy.Tittle else ''}."
                                f"{appointment.ReferredBy.ShortName if appointment.ReferredBy else ''}"
                                if appointment.ReferredBy else None,
                'Referredid': appointment.ReferredBy.Doctor_ID if appointment.ReferredBy else None,
            }
            for appointment in queryset
        ]
 
        response_data = {
            "appointments": appointment_request_data,
            "count": len(appointment_request_data),
            "status": "success"
        }
       
        return JsonResponse(response_data, safe=False)
 
    except Exception as e:
        print(f"Error fetching appointment data: {str(e)}")
        return JsonResponse({
            'error': 'An internal server error occurred',
            'details': str(e)
        }, status=500)




