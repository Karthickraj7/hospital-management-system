from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime


# @csrf_exempt
# @require_http_methods(['POST', 'GET',"OPTIONS"])
# def create_therapy_request(request):
#    try:
#     if request.method == "POST":
#         data = json.loads(request.body)  # or use json.loads(request.body) if you're sending JSON
#         print('data...',data)
#         register_type = data.get('RegisterType')
#         therapy_type_id = data.get('Therapy_Type')
#         starting_date_str = data.get('starting_date')
#         therapy_name = data.get('Therapy_Name')
#         op_register_id = data.get('OP_Register_Id')
#         IP_Register_Id = data.get('IP_Register_Id')
#         remarks = data.get('Remarks')
#         created_by = data.get('created_by')
#         location_id = data.get('location')
#         sessions = data.get('sessions')
#         print('therapy_id',therapy_type_id)
#         starting_date = None
#         # Common fields
#         therapy_type = TherapyType_Detials.objects.get(TherapyType_Name__TherapyType_Id =therapy_type_id,Therapy_Name=therapy_name)
#         location_instance = get_object_or_404(Location_Detials, Location_Id=location_id)
        
    
#         if starting_date_str:
#                 try:
#                     starting_date = datetime.strptime(starting_date_str, "%Y-%m-%d").date()
#                 except ValueError:
#                     return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
#         else:
#                 starting_date = None
       
            
#         therapy_request = Therapy_Request_Details(
#             RegisterType=register_type,
#             Therapy_Type=therapy_type,
#             Remarks=remarks,
#             created_by=created_by,
#             Location=location_instance,
#             Sessions =sessions,
#             total_sessions = sessions,
#             next_review_date=starting_date
            
            
#           )

#         # Assign the correct foreign key based on RegisterType
#         if register_type == "OP":
#             op_instance = get_object_or_404(Patient_Appointment_Registration_Detials, Registration_Id=op_register_id)
#             therapy_request.OP_Register_Id = op_instance
#         elif register_type == "IP":
#             ip_instance = get_object_or_404(Patient_IP_Registration_Detials,Registration_Id=IP_Register_Id)
#             therapy_request.IP_Register_Id = ip_instance
   

#         therapy_request.save()

#         return JsonResponse({'message': 'Therapy request created successfully.'}, status=201)
#    except Exception as e:
#         return JsonResponse({'err':f'{e}'},status=500)
    

@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def create_therapy_request(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            print('data...', data)

            register_type = data.get('RegisterType')
            therapy_type_id = data.get('Therapy_Type')
            starting_date_str = data.get('starting_date')
            therapy_name = data.get('Therapy_Name')
            op_register_id = data.get('OP_Register_Id')
            IP_Register_Id = data.get('IP_Register_Id')
            remarks = data.get('Remarks')
            created_by = data.get('created_by')
            location_id = data.get('location')
            sessions = int(data.get('sessions', 1))  # Default to 1 if not passed
            print('therapy_id', therapy_type_id)

            starting_date = None
            if starting_date_str:
                try:
                    starting_date = datetime.strptime(starting_date_str, "%Y-%m-%d").date()
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

            therapy_type = TherapyType_Detials.objects.get(
                TherapyType_Name__TherapyType_Id=therapy_type_id,
                Therapy_Name=therapy_name
            )
            location_instance = get_object_or_404(Location_Detials, Location_Id=location_id)

            # Save one record per session
            for i in range(sessions):
                
                therapy_request = Therapy_Request_Details(
                    RegisterType=register_type,
                    Therapy_Type=therapy_type,
                    Remarks=remarks,
                    created_by=created_by,
                    Location=location_instance,
                    Sessions=sessions,  # Each row is one session
                    total_sessions=sessions,
                    Billing_UnPaid_sessions=sessions,
                    next_review_date=starting_date
                )

                if register_type == "OP":
                    op_instance = get_object_or_404(Patient_Appointment_Registration_Detials, Registration_Id=op_register_id)
                    therapy_request.OP_Register_Id = op_instance
                elif register_type == "IP":
                    ip_instance = get_object_or_404(Patient_IP_Registration_Detials, Registration_Id=IP_Register_Id)
                    therapy_request.IP_Register_Id = ip_instance

                therapy_request.save()

            return JsonResponse({'message': f'{sessions} therapy request(s) created successfully.'}, status=201)

    except Exception as e:
        return JsonResponse({'error': f'{e}'}, status=500)    
    

@csrf_exempt
@require_http_methods(['POST', 'GET',"OPTIONS"])
def get_therapy_requests(request):
    register_type = request.GET.get('RegisterType')
    op_register_id = request.GET.get('OP_Register_Id')
    status = request.GET.get('Status')
    print(op_register_id,register_type,'OP')
    # Start with all objects
    queryset = Therapy_Request_Details.objects.filter(RegisterType=register_type,OP_Register_Id__Registration_Id=op_register_id)

    # Optional filters
    

    # Prepare response
    data = []
    for obj in queryset:
        data.append({
            "Request_Id": obj.Request_Id,
            "RegisterType": obj.RegisterType,
            "OP_Register_Id": obj.OP_Register_Id.Registration_Id if obj.OP_Register_Id else None,
            "Patient_Id":obj.OP_Register_Id.PatientId.PatientId if obj.OP_Register_Id else None,
            
            "Therapy_Type": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
            "Therapy_Name":obj.Therapy_Type.Therapy_Name,
            "Remarks": obj.Remarks,
            "Status": obj.Status,
            "Sessions":obj.Sessions,
            "total_sessions":obj.total_sessions,
            "Sessions_Completed":obj.Sessions_Completed,
            "Sessions_Balance":obj.Sessions_Balance,
            "created_by": obj.created_by,
            "Billing_Status": obj.Billing_Status,
            "Location": obj.Location.Location_Name if obj.Location else None,
            "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"results": data}, safe=False)



@csrf_exempt
@require_http_methods(['POST', 'GET',"OPTIONS"])
def get_therapy_requests_IP(request):
  if request.method == 'GET': 
    print("Received GET params:", request.GET.dict())

    register_type = request.GET.get('RegisterType')
    IP_Register_Id = request.GET.get('IP_Register_Id')
    status = request.GET.get('Status')
    print(IP_Register_Id,register_type)
    # Start with all objects
    queryset = Therapy_Request_Details.objects.filter(RegisterType=register_type,IP_Register_Id__Registration_Id=IP_Register_Id)

    # Optional filters
    
    # Prepare response
    data = []
    for obj in queryset:
        data.append({
            "Request_Id": obj.Request_Id,
            "RegisterType": obj.RegisterType,
            "IP_Register_Id": obj.IP_Register_Id.Registration_Id if obj.IP_Register_Id else None,
            "Patient_Id":obj.IP_Register_Id.PatientId.PatientId if obj.IP_Register_Id else None,
            
            "Therapy_Type": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
            "Therapy_Name":obj.Therapy_Type.Therapy_Name,
            "Remarks": obj.Remarks,
            "Status": obj.Status,
            "Sessions":obj.Sessions,
            "total_sessions":obj.total_sessions,
            "Sessions_Completed":obj.Sessions_Completed,
            "Sessions_Balance":obj.Sessions_Balance,
            "created_by": obj.created_by,
            "Billing_Status": obj.Billing_Status,
            "Location": obj.Location.Location_Name if obj.Location else None,
            "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"results": data}, safe=False)

  else:
     return JsonResponse({'err':'interna server'},status=500)     

# @csrf_exempt
# @require_http_methods(['POST', 'GET', "OPTIONS"])
# def get_therapy_requests_Oncology(request):
#     register_type = 'OP'
#     # op_register_id = request.GET.get('OP_Register_Id')
#     # status = request.GET.get('Status')
#     billing_status = 'Paid'
#     today = datetime.today().date()  # Correct format: datetime.date(2025, 5, 15)
#     print('today...',today)
#     therapy_type_name = 'Oncology Therapy'  # for example: Oncology

#     queryset = Therapy_Request_Details.objects.all()
    

#     if register_type:
#         queryset = queryset.filter(RegisterType=register_type)
#     # if op_register_id:
#         # queryset = queryset.filter(Registration_Id=op_register_id)
#     # if status:`hj56`
#         # queryset = queryset.filter(Status=status)
#     if billing_status:
#         queryset = queryset.filter(Billing_Status=billing_status,next_review_date=today).exclude(Sessions=0)
#     if therapy_type_name:
#         queryset = queryset.filter(Therapy_Type__TherapyType_Name__TherapyType_Name=therapy_type_name)

#     data = []
#     for obj in queryset:
        
#         reg_id = obj.OP_Register_Id.Registration_Id
#         queryset1 = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(Registration_Id__Registration_Id=reg_id)
#         data.append({
#             "Request_Id": obj.Request_Id,
#             "RegisterType": obj.RegisterType,
#             "OP_Register_Id": obj.OP_Register_Id.Registration_Id if obj.OP_Register_Id else None,
#             "PatientId": obj.OP_Register_Id.PatientId.PatientId if obj.OP_Register_Id else None,
#             "PatientName": obj.OP_Register_Id.PatientId.FirstName if obj.OP_Register_Id else None,
#             "Age": obj.OP_Register_Id.PatientId.Age if obj.OP_Register_Id else None,
#             "Gender": obj.OP_Register_Id.PatientId.Gender if obj.OP_Register_Id else None,
#             "BloodGroup": obj.OP_Register_Id.PatientId.BloodGroup if obj.OP_Register_Id else None,
#             "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
#             "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
#             "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
#             "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
#             "Doctor_Id":queryset1.PrimaryDoctor.First_Name if  obj.OP_Register_Id  else '',
#             "Phone_no":obj.OP_Register_Id.PatientId.PhoneNo,
#             "Remarks": obj.Remarks,
#             "Status": obj.Status,
#             "Sessions": obj.Sessions,
#             "created_by": obj.created_by,
#             "Billing_Status": obj.Billing_Status,
#             "Location": obj.Location.Location_Name if obj.Location else None,
#             "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#         })

#     return JsonResponse({"results": data}, safe=False)


@csrf_exempt
@require_http_methods(['POST', 'GET', "OPTIONS"])
def get_therapy_requests_Oncology(request):
    billing_status = 'Paid'
    today = datetime.today().date()
    therapy_type_name = "Oncology Therapy"

    queryset = Therapy_Request_Details.objects.filter(
        Billing_Status=billing_status,
        next_review_date=today,
        Therapy_Type__TherapyType_Name__TherapyType_Name=therapy_type_name
    ).exclude(Status='Completed')[:1]

    data = []
    for obj in queryset:
        register_type = obj.RegisterType
        patient = None
        doctor = None
        reg_id = None
        phone_no = None
        doctor_id = None

        if register_type == 'OP' and obj.OP_Register_Id:
            reg_id = obj.OP_Register_Id.Registration_Id
            patient = obj.OP_Register_Id.PatientId
            try:
                doctor_entry = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
    Registration_Id__Registration_Id=obj.OP_Register_Id.Registration_Id
).first()

                if doctor_entry and doctor_entry.PrimaryDoctor:
                    doctor_obj = doctor_entry.PrimaryDoctor
                    doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                        if doctor_obj.Tittle else ''
                    doctor_id = doctor_obj.Doctor_ID
                else:
                   doctor = ''
                   doctor_id = ''

            except OP_Patient_Appointment_With_Multiple_Doctor.DoesNotExist:
                doctor = ''
                doctor_id = ''
        
        elif register_type == 'IP' and obj.IP_Register_Id:
            reg_id = obj.IP_Register_Id.Registration_Id
            patient = obj.IP_Register_Id.PatientId
            doctor_obj = obj.IP_Register_Id.PrimaryDoctor
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
        
        elif register_type == 'Casuality' and obj.Casuality_Register_Id:
            reg_id = obj.Casuality_Register_Id.Registration_Id
            patient = obj.Casuality_Register_Id.PatientId
            doctor_obj = obj.Casuality_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
        
        elif register_type == 'TherapyOnly' and obj.Therapy_Register_Id:
            reg_id = obj.Therapy_Register_Id.Request_Id
            patient = obj.Therapy_Register_Id.PatientId
            doctor_obj = obj.Therapy_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''

        if patient:
            phone_no = patient.PhoneNo

        data.append({
            "Request_Id": obj.Request_Id,
            "RegisterType": register_type,
            "Registration_Id": reg_id,
            "PatientId": patient.PatientId if patient else None,
            "PatientName": patient.FirstName if patient else None,
            "Age": patient.Age if patient else None,
            "Gender": patient.Gender if patient else None,
            "BloodGroup": patient.BloodGroup if patient else None,
            "Phone_no": phone_no,
            "Doctor_Id": doctor_id,
            "Doctor_Name": doctor,
            "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
            "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
            "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
            "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
            "Remarks": obj.Remarks,
            "Status": obj.Status,
            "Sessions": obj.Sessions,
            "created_by": obj.created_by,
            "Billing_Status": obj.Billing_Status,
            "Location": obj.Location.Location_Name if obj.Location else None,
            "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"results": data}, safe=False)



# @csrf_exempt
# @require_http_methods(['POST', 'GET', "OPTIONS"])
# def get_therapy_requests_Neurotherapy(request):
#     billing_status = 'Paid'
#     today = datetime.today().date()
#     therapy_type_name = "Neurotherapy"

#     # Base queryset with shared filters
#     queryset = Therapy_Request_Details.objects.filter(
#         Billing_Status=billing_status,
#         next_review_date=today,
#         Therapy_Type__TherapyType_Name__TherapyType_Name=therapy_type_name
#     ).exclude(Sessions=0)

#     data = []
#     for obj in queryset:
#         register_type = obj.RegisterType
#         patient = None
#         doctor = None
#         reg_id = None
#         phone_no = None

#         if register_type == 'OP' and obj.OP_Register_Id:
#             doctor_name = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(Registration_Id__Registration_Id=obj.OP_Register_Id).PrimaryDoctor
#             reg_id = obj.OP_Register_Id.Registration_Id
#             patient = obj.OP_Register_Id.PatientId
#             doctor = f'{doctor_name.Tittle.Title_Name} {doctor_name.First_Name} {doctor_name.Middle_Name} {doctor_name.Last_Name}' if doctor_name else ''
#         elif register_type == 'IP' and obj.IP_Register_Id:
#             reg_id = obj.IP_Register_Id.Registration_Id
#             patient = obj.IP_Register_Id.PatientId
#             doctor = f'{obj.IP_Register_Id.PrimaryDoctor.Tittle.Title_Name} {obj.IP_Register_Id.PrimaryDoctor.First_Name} {obj.IP_Register_Id.PrimaryDoctor.Middle_Name} {obj.IP_Register_Id.PrimaryDoctor.Last_Name}' if obj.IP_Register_Id else ''
#         elif register_type == 'Casuality' and obj.Casuality_Register_Id:
#             reg_id = obj.Casuality_Register_Id.Registration_Id
#             patient = obj.Casuality_Register_Id.PatientId
#             doctor = obj.Casuality_Register_Id.DoctorId
#         elif register_type == 'TherapyOnly' and obj.Therapy_Register_Id:
#             reg_id = obj.Therapy_Register_Id.Request_Id
#             patient = obj.Therapy_Register_Id.PatientId
#             doctor = obj.Therapy_Register_Id.DoctorId

#         if patient:
#             phone_no = patient.PhoneNo

#         data.append({
#             "Request_Id": obj.Request_Id,
#             "RegisterType": register_type,
#             "Registration_Id": reg_id,
#             "PatientId": patient.PatientId if patient else None,
#             "PatientName": patient.FirstName if patient else None,
#             "Age": patient.Age if patient else None,
#             "Gender": patient.Gender if patient else None,
#             "BloodGroup": patient.BloodGroup if patient else None,
#             "Phone_no": phone_no,
#             "Doctor_Id": doctor.Doctor_ID if doctor else '',
#             "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
#             "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
#             "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
#             "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
#             "Remarks": obj.Remarks,
#             "Status": obj.Status,
#             "Sessions": obj.Sessions,
#             "created_by": obj.created_by,
#             "Billing_Status": obj.Billing_Status,
#             "Location": obj.Location.Location_Name if obj.Location else None,
#             "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#         })

#     return JsonResponse({"results": data}, safe=False)


@csrf_exempt
@require_http_methods(['POST', 'GET', "OPTIONS"])
def get_therapy_requests_Neurotherapy(request):
    billing_status = 'Paid'
    today = datetime.today().date()
    therapy_type_name = "Neurotherapy"

    queryset = Therapy_Request_Details.objects.filter(
        Billing_Status=billing_status,
        next_review_date=today,
        Therapy_Type__TherapyType_Name__TherapyType_Name=therapy_type_name
    ).exclude(Status='Completed')

    data = []
    for obj in queryset:
        register_type = obj.RegisterType
        patient = None
        doctor = None
        reg_id = None
        phone_no = None
        doctor_id = None

        if register_type == 'OP' and obj.OP_Register_Id:
            reg_id = obj.OP_Register_Id.Registration_Id
            visit_id = obj.OP_Register_Id.VisitId
            patient = obj.OP_Register_Id.PatientId
            try:
                doctor_entry = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
    Registration_Id__Registration_Id=obj.OP_Register_Id.Registration_Id
).first()

                if doctor_entry and doctor_entry.PrimaryDoctor:
                    doctor_obj = doctor_entry.PrimaryDoctor
                    doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                        if doctor_obj.Tittle else ''
                    doctor_id = doctor_obj.Doctor_ID
                else:
                   doctor = ''
                   doctor_id = ''

            except OP_Patient_Appointment_With_Multiple_Doctor.DoesNotExist:
                doctor = ''
                doctor_id = ''
        
        elif register_type == 'IP' and obj.IP_Register_Id:
            reg_id = obj.IP_Register_Id.Registration_Id
            visit_id = obj.OP_Register_Id.VisitId
            patient = obj.IP_Register_Id.PatientId
            doctor_obj = obj.IP_Register_Id.PrimaryDoctor
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
        
        elif register_type == 'Casuality' and obj.Casuality_Register_Id:
            reg_id = obj.Casuality_Register_Id.Registration_Id
            visit_id = obj.OP_Register_Id.VisitId
            patient = obj.Casuality_Register_Id.PatientId
            doctor_obj = obj.Casuality_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
        
        elif register_type == 'TherapyOnly' and obj.Therapy_Register_Id:
            reg_id = obj.Therapy_Register_Id.Request_Id
            patient = obj.Therapy_Register_Id.PatientId
            doctor_obj = obj.Therapy_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''

        if patient:
            phone_no = patient.PhoneNo

        data.append({
            "Request_Id": obj.Request_Id,
            "RegisterType": register_type,
            "Registration_Id": reg_id,
            "Visit_Id":visit_id,
            "PatientId": patient.PatientId if patient else None,
            "PatientName": patient.FirstName if patient else None,
            "Age": patient.Age if patient else None,
            "Gender": patient.Gender if patient else None,
            "BloodGroup": patient.BloodGroup if patient else None,
            "Phone_no": phone_no,
            "Doctor_Id": doctor_id,
            "Doctor_Name": doctor,
            "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
            "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
            "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
            "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
            "Remarks": obj.Remarks,
            "Status": obj.Status,
            "Sessions": obj.Sessions,
            "created_by": obj.created_by,
            "Billing_Status": obj.Billing_Status,
            "Location": obj.Location.Location_Name if obj.Location else None,
            "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"results": data}, safe=False)


@csrf_exempt
@require_http_methods(['POST', 'GET', "OPTIONS"])
def get_therapy_requests_Physiotherapy(request):
    billing_status = 'Paid'
    today = datetime.today().date()
    therapy_type_name = "Physiotherapy"

    queryset = Therapy_Request_Details.objects.filter(
        Billing_Status=billing_status,
        next_review_date=today,
        Therapy_Type__TherapyType_Name__TherapyType_Name=therapy_type_name
    ).exclude(Status='Completed')[:1]

    data = []
    for obj in queryset:
        register_type = obj.RegisterType
        patient = None
        doctor = None
        reg_id = None
        phone_no = None
        doctor_id = None

        if register_type == 'OP' and obj.OP_Register_Id:
            reg_id = obj.OP_Register_Id.Registration_Id
            patient = obj.OP_Register_Id.PatientId
            try:
                doctor_entry = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
    Registration_Id__Registration_Id=obj.OP_Register_Id.Registration_Id
).first()

                if doctor_entry and doctor_entry.PrimaryDoctor:
                    doctor_obj = doctor_entry.PrimaryDoctor
                    doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                        if doctor_obj.Tittle else ''
                    doctor_id = doctor_obj.Doctor_ID
                else:
                   doctor = ''
                   doctor_id = ''

            except OP_Patient_Appointment_With_Multiple_Doctor.DoesNotExist:
                doctor = ''
                doctor_id = ''
        
        elif register_type == 'IP' and obj.IP_Register_Id:
            reg_id = obj.IP_Register_Id.Registration_Id
            patient = obj.IP_Register_Id.PatientId
            doctor_obj = obj.IP_Register_Id.PrimaryDoctor
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
        
        elif register_type == 'Casuality' and obj.Casuality_Register_Id:
            reg_id = obj.Casuality_Register_Id.Registration_Id
            patient = obj.Casuality_Register_Id.PatientId
            doctor_obj = obj.Casuality_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
        
        elif register_type == 'TherapyOnly' and obj.Therapy_Register_Id:
            reg_id = obj.Therapy_Register_Id.Request_Id
            patient = obj.Therapy_Register_Id.PatientId
            doctor_obj = obj.Therapy_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}" \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''

        if patient:
            phone_no = patient.PhoneNo

        data.append({
            "Request_Id": obj.Request_Id,
            "RegisterType": register_type,
            "Registration_Id": reg_id,
            "PatientId": patient.PatientId if patient else None,
            "PatientName": patient.FirstName if patient else None,
            "Age": patient.Age if patient else None,
            "Gender": patient.Gender if patient else None,
            "BloodGroup": patient.BloodGroup if patient else None,
            "Phone_no": phone_no,
            "Doctor_Id": doctor_id,
            "Doctor_Name": doctor,
            "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
            "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
            "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
            "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
            "Remarks": obj.Remarks,
            "Status": obj.Status,
            "Sessions": obj.Sessions,
            "created_by": obj.created_by,
            "Billing_Status": obj.Billing_Status,
            "Location": obj.Location.Location_Name if obj.Location else None,
            "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"results": data}, safe=False)


# @csrf_exempt
# @require_http_methods(['POST', 'GET', "OPTIONS"])
# def get_therapy_requests_Physiotherapy(request):
#     register_type = 'OP'
#     # op_register_id = request.GET.get('OP_Register_Id')
#     # status = request.GET.get('Status')
#     billing_status = 'Paid'
#     today = datetime.today().date()  # Correct format: datetime.date(2025, 5, 15)
#     print('today...',today)
#     therapy_type_name = 'Physiotherapy'  # for example: Oncology

#     queryset = Therapy_Request_Details.objects.all()

#     if register_type:
#         queryset = queryset.filter(RegisterType=register_type)
#     # if op_register_id:
#         # queryset = queryset.filter(Registration_Id=op_register_id)
#     # if status:`hj56`
#         # queryset = queryset.filter(Status=status)
#     if billing_status:
#         queryset = queryset.filter(Billing_Status=billing_status,next_review_date=today).exclude(Sessions=0)
#     if therapy_type_name:
#         queryset = queryset.filter(Therapy_Type__TherapyType_Name__TherapyType_Name=therapy_type_name)

#     data = []
#     for obj in queryset:
        
#         data.append({
#             "Request_Id": obj.Request_Id,
#             "RegisterType": obj.RegisterType,
#             "Registration_Id": obj.OP_Register_Id.Registration_Id if obj.OP_Register_Id else None,
#             "OP_Register_Id": obj.OP_Register_Id.Registration_Id if obj.OP_Register_Id else None,
#             "PatientId": obj.OP_Register_Id.PatientId.PatientId if obj.OP_Register_Id else None,
#             "PatientName": obj.OP_Register_Id.PatientId.FirstName if obj.OP_Register_Id else None,
#             "Age": obj.OP_Register_Id.PatientId.Age if obj.OP_Register_Id else None,
#             "Gender": obj.OP_Register_Id.PatientId.Gender if obj.OP_Register_Id else None,
#             "BloodGroup": obj.OP_Register_Id.PatientId.BloodGroup if obj.OP_Register_Id else None,
#             "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
#             "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
#             "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
#             "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
#             "Doctor_Id":obj.OP_Register_Id.DoctorId.Doctor_ID if  obj.OP_Register_Id.DoctorId  else '',
#             "Phone_no":obj.OP_Register_Id.PatientId.PhoneNo,
#             "Remarks": obj.Remarks,
#             "Status": obj.Status,
#             "Sessions": obj.Sessions,
#             "created_by": obj.created_by,
#             "Billing_Status": obj.Billing_Status,
#             "Location": obj.Location.Location_Name if obj.Location else None,
#             "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#         })

#     return JsonResponse({"results": data}, safe=False)


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_therapy_datas_for_therapist(request):
#     request_id = request.GET.get('Request_Id')
#     billing_status = 'Paid'

#     if not request_id:
#         return JsonResponse({"error": "Missing Request_Id"}, status=400)

#     queryset = Therapy_Request_Details.objects.filter(Request_Id=request_id, Billing_Status=billing_status)

#     data = []
#     for obj in queryset:
#         data.append({
#             "Request_Id": obj.Request_Id,
#             "RegisterType": obj.RegisterType,
#             "Registration_Id ": obj.OP_Register_Id.Registration_Id if obj.OP_Register_Id else None,
#             "OP_Register_Id": obj.OP_Register_Id.Registration_Id if obj.OP_Register_Id else None,
#             "PatientId": obj.OP_Register_Id.PatientId.PatientId if obj.OP_Register_Id else None,
#             "PatientName": obj.OP_Register_Id.PatientId.FirstName if obj.OP_Register_Id else None,
#             "Age": obj.OP_Register_Id.PatientId.Age if obj.OP_Register_Id else None,
#             "Gender": obj.OP_Register_Id.PatientId.Gender if obj.OP_Register_Id else None,
#             "BloodGroup": obj.OP_Register_Id.PatientId.BloodGroup if obj.OP_Register_Id else None,
#             "Therapy_Type_Id": obj.Therapy_Type.TherapyType_Name.TherapyType_Id if obj.Therapy_Type else None,
#             "Therapy_Type_Name": obj.Therapy_Type.TherapyType_Name.TherapyType_Name if obj.Therapy_Type else None,
#             "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
#             "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
#             "Doctor_Id": obj.OP_Register_Id.DoctorId.Doctor_ID if obj.OP_Register_Id and obj.OP_Register_Id.DoctorId else '',
#             "Phone_no": obj.OP_Register_Id.PatientId.PhoneNo if obj.OP_Register_Id else None,
#             "Remarks": obj.Remarks,
#             "Status": obj.Status,
#             "total_sessions":obj.total_sessions,
#             "Sessions": obj.Sessions,
#             "Sessions_Completed": obj.Sessions_Completed,
#             "Sessions_Balance": obj.Sessions_Balance,
#             "created_by": obj.created_by,
#             "Billing_Status": obj.Billing_Status,
#             "Location": obj.Location.Location_Name if obj.Location else None,
#             "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#         })

#     return JsonResponse({"results": data}, safe=True)
@csrf_exempt
@require_http_methods(["GET"])
def get_therapy_datas_for_therapist(request):
    request_id = request.GET.get('Request_Id')
    billing_status = 'Paid'

    if not request_id:
        return JsonResponse({"error": "Missing Request_Id"}, status=400)

    queryset = Therapy_Request_Details.objects.filter(Request_Id=request_id, Billing_Status=billing_status)

    data = []
    for obj in queryset:
        register_type = obj.RegisterType
        reg_id = None
        patient = None
        doctor_id = ''
        doctor = ''
        phone_no = None

        if register_type == 'OP' and obj.OP_Register_Id:
            reg_id = obj.OP_Register_Id
            patient = obj.OP_Register_Id.PatientId
            try:
                doctor_obj = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(
                    Registration_Id__Registration_Id=reg_id
                ).PrimaryDoctor
                doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}".strip() \
                    if doctor_obj and doctor_obj.Tittle else ''
                doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''
            except OP_Patient_Appointment_With_Multiple_Doctor.DoesNotExist:
                doctor = ''
                doctor_id = ''

        elif register_type == 'IP' and obj.IP_Register_Id:
            reg_id = obj.IP_Register_Id
            patient = obj.IP_Register_Id.PatientId
            doctor_obj = obj.IP_Register_Id.PrimaryDoctor
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}".strip() \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''

        elif register_type == 'Casuality' and obj.Casuality_Register_Id:
            reg_id = obj.Casuality_Register_Id
            patient = obj.Casuality_Register_Id.PatientId
            doctor_obj = obj.Casuality_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}".strip() \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''

        elif register_type == 'TherapyOnly' and obj.Therapy_Register_Id:
            reg_id = obj.Therapy_Register_Id.Request_Id
            patient = obj.Therapy_Register_Id.PatientId
            doctor_obj = obj.Therapy_Register_Id.DoctorId
            doctor = f"{doctor_obj.Tittle.Title_Name} {doctor_obj.First_Name} {doctor_obj.Middle_Name} {doctor_obj.Last_Name}".strip() \
                if doctor_obj and doctor_obj.Tittle else ''
            doctor_id = doctor_obj.Doctor_ID if doctor_obj else ''

        phone_no = patient.PhoneNo if patient else None

        data.append({
            "pk":reg_id.pk,
            "Request_Id": obj.Request_Id,
            "RegisterType": register_type,
            "Registration_Id": reg_id.Registration_Id,
            "PatientId": patient.PatientId if patient else None,
            "PatientName": patient.FirstName if patient else None,
            "Age": patient.Age if patient else None,
            "Gender": patient.Gender if patient else None,
            "BloodGroup": patient.BloodGroup if patient else None,
            "Phone_no": phone_no,
            "Doctor_Id": doctor_id,
            "Doctor_Name": doctor,
            "DOB":patient.DOB,
            "VisitId":reg_id.VisitId,
            # "BloodGroup":patient.BloodGroup.BloodGroup_Name,
            "Therapy_Type_Id": (
                obj.Therapy_Type.TherapyType_Name.TherapyType_Id
                if obj.Therapy_Type and obj.Therapy_Type.TherapyType_Name else None
            ),
            "Therapy_Type_Name": (
                obj.Therapy_Type.TherapyType_Name.TherapyType_Name
                if obj.Therapy_Type and obj.Therapy_Type.TherapyType_Name else None
            ),
            "Therapy_Id": obj.Therapy_Type.Therapy_Id if obj.Therapy_Type else None,
            "Therapy_Name": obj.Therapy_Type.Therapy_Name if obj.Therapy_Type else None,
            "Remarks": obj.Remarks,
            "Status": obj.Status,
            "total_sessions": obj.total_sessions,
            "Sessions": obj.Sessions,
            "Sessions_Completed": obj.Sessions_Completed,
            "Sessions_Balance": obj.Sessions_Balance,
            "created_by": obj.created_by,
            "Billing_Status": obj.Billing_Status,
            "Location": obj.Location.Location_Name if obj.Location else None,
            "created_at": obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"results": data}, safe=True)


# @csrf_exempt
# @require_http_methods(["POST"])
# def therapy_Updation_from_therapist(request):
#     data = json.loads(request.body)
    
#     remarks = data.get('Remarks')
#     next_date = data.get('Next_Seesion_Date')  # Expected in 'YYYY-MM-DD' format
#     status = data.get('Status')
#     Request_Id = data.get('request_id')
#     session = data.get('Sessions')
#     created_by = data.get('created_by', 'therapist')

#     try:
#         # Fetch the existing therapy request
#         thr_ins = Therapy_Request_Details.objects.get(Request_Id=Request_Id)
        
#         # Update session values
#         if thr_ins.Sessions > 0:
#             thr_ins.Sessions -= 1
        
#         thr_ins.Sessions_Completed = thr_ins.total_sessions - thr_ins.Sessions
#         thr_ins.Sessions_Balance = thr_ins.total_sessions - thr_ins.Sessions_Completed 
        
#         # Update other fields
#         thr_ins.Remarks = remarks
#         if thr_ins.Sessions == 0 :
#             thr_ins.Status = status
#             thr_ins.next_review_date = next_date 
#             thr_ins.Status = 'Completed'# Should be a string in 'YYYY-MM-DD' format
        
#         thr_ins.save()

#         # Log the session tracking
#         TherapySessionTracking.objects.create(
#             Request_Id=thr_ins,
#             remarks=remarks,
#             Status=status,
#             next_review_date=next_date,
#             created_by=created_by
#         )
        
#         return JsonResponse({"message": "Data updated successfully"}, status=200)
    
#     except Therapy_Request_Details.DoesNotExist:
#         return JsonResponse({"error": "Invalid Request_Id"}, status=400)
    
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


# @csrf_exempt
# @require_http_methods(["POST"])
# def therapy_Updation_from_therapist(request):
#     try:
#         data = json.loads(request.body)
        
#         remarks = data.get('Remarks')
#         next_date = data.get('Next_Seesion_Date')  # Note: Check spelling
#         status = data.get('Status')
#         request_id = data.get('request_id')
#         created_by = data.get('created_by', 'therapist')
#         Registration_Id = data.get('Registration_Id')
#         Register_type = data.get('Register_type')
#         Therapy_Name = data.get('Therapy_Name')
#         Therapy_Type_Id = data.get('Therapy_Type_Id')
#         if Register_type == "IP":
            
#            try: 
#              thr_ins1 = Therapy_Request_Details.objects.filter(IP_Register_Id=Registration_Id,Therapy_Type__TherapyType_Name__TherapyType_Id=Therapy_Type_Id)
#              for i in thr_ins1:
#                 i.next_review_date = next_date
#                 i.save()
#            except Exception as e:
#                JsonResponse({'err':f'❌❌{e}'},status=400)    
                
#         elif Register_type == "OP":
#            try:  
#             thr_ins1 = Therapy_Request_Details.objects.filter(OP_Register_Id=Registration_Id,Therapy_Type__TherapyType_Name__TherapyType_Id=Therapy_Type_Id)
#             for i in thr_ins1:
#                 print('i',i.Request_Id)
#                 i.next_review_date = next_date
#                 i.save()
#            except Exception as e:
#                JsonResponse({'err':f'❌❌{e}'},status=400)      
#         else:
#             return JsonResponse({"error":"next review date didnt change"},status=400)        
#         # Validate required inputs
#         if not request_id:
#             return JsonResponse({"error": "Missing request_id"}, status=400)

#         # Fetch the existing therapy request
#         thr_ins = Therapy_Request_Details.objects.get(Request_Id=request_id)

#         # Update sessions
#         if thr_ins.Sessions > 0:
#             thr_ins.Sessions -= 1
        
#         thr_ins.Sessions_Completed = thr_ins.total_sessions - thr_ins.Sessions
#         thr_ins.Sessions_Balance = thr_ins.total_sessions - thr_ins.Sessions_Completed
        
#         # Update remarks and next session info
#         thr_ins.Remarks = remarks

#         # Only update status and next date if sessions are completed
#         if thr_ins.Sessions == 0:
#             thr_ins.Status = 'Completed'
#             # thr_ins.next_review_date = next_date
#         else:
#             thr_ins.Status = status  # Keep status in progress or whatever passed

#         thr_ins.save()

#         # Save tracking info
#         TherapySessionTracking.objects.create(
#             Request_Id=thr_ins,
#             remarks=remarks,
#             Status=status,
#             next_review_date=next_date,
#             created_by=created_by
#         )

#         return JsonResponse({"message": "Data updated successfully"}, status=200)

#     except Therapy_Request_Details.DoesNotExist:
#         return JsonResponse({"error": "Invalid request_id"}, status=400)

#     except json.JSONDecodeError:
#         return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

#                         # therapy data op for billing


@csrf_exempt
@require_http_methods(["POST"])
def therapy_Updation_from_therapist(request):
    try:
        data = json.loads(request.body)
        print("✅ Received Data:", data)

        # Collect values
        remarks = data.get('Remarks')
        next_date = data.get('Next_Seesion_Date')  # ✅ Corrected spelling
        status = data.get('Status')
        request_id = data.get('request_id')
        created_by = data.get('created_by', 'therapist')
        Registration_Id = data.get('RegisterationId')
        Register_type = data.get('Register_type')
        Therapy_Name = data.get('Therapy_Name')
        Therapy_Type_Id = data.get('Therapy_Type_Id')

        # ✅ Check required fields
        required_fields = ['request_id', 'Next_Seesion_Date', 'RegisterationId', 'Register_type', 'Therapy_Type_Id']
        missing = [key for key in required_fields if not data.get(key)]
        if missing:
            return JsonResponse({'error': f'Missing fields: {", ".join(missing)}'}, status=400)

        # ✅ Query based on Register_type
        print("🧪 Register_type:", Register_type)

        if Register_type == "IP":
            thr_ins1 = Therapy_Request_Details.objects.filter(
                IP_Register_Id__Registration_Id=Registration_Id,
                Therapy_Type__TherapyType_Name__TherapyType_Id=Therapy_Type_Id
            )
        elif Register_type == "OP":
            thr_ins1 = Therapy_Request_Details.objects.filter(
                OP_Register_Id__Registration_Id=Registration_Id,
                Therapy_Type__TherapyType_Name__TherapyType_Id=Therapy_Type_Id
            )
        else:
            return JsonResponse({"error": "Invalid Register_type"}, status=400)

        # ✅ Check if query returns anything
        if not thr_ins1.exists():
            return JsonResponse({'error': 'No matching Therapy Request found for Register_type'}, status=400)

        # ✅ Update next_review_date for matched rows
        print("📝 Updating next_review_date for matching records...")
        for i in thr_ins1:
            print(" - Updating Request_Id:", i.Request_Id)
            i.next_review_date = next_date
            i.save()

        # ✅ Update main therapy record by request_id
        try:
            thr_ins = Therapy_Request_Details.objects.get(Request_Id=request_id)
        except Therapy_Request_Details.DoesNotExist:
            return JsonResponse({"error": "Invalid request_id"}, status=400)

        print("🧾 Updating main Request_Id:", thr_ins.Request_Id)
        print(" - Current Sessions:", thr_ins.Sessions)

        # Sessions update
        if thr_ins.Sessions > 0:
            thr_ins.Sessions -= 1

        thr_ins.Sessions_Completed = thr_ins.total_sessions - thr_ins.Sessions
        thr_ins.Sessions_Balance = thr_ins.total_sessions - thr_ins.Sessions_Completed

        # Remarks and review date
        thr_ins.Remarks = remarks
        thr_ins.next_review_date = next_date  # ✅ This was commented earlier, now added

        if thr_ins.Sessions == 0:
            thr_ins.Status = 'Completed'
        else:
            thr_ins.Status = status  # Status passed from frontend

        thr_ins.save()

        # ✅ Create session tracking record
        TherapySessionTracking.objects.create(
            Request_Id=thr_ins,
            remarks=remarks,
            Status=status,
            next_review_date=next_date,
            created_by=created_by
        )

        print("✅ Data updated successfully")
        return JsonResponse({"message": "Data updated successfully"}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except Exception as e:
        print("❌ Error occurred:", str(e))
        return JsonResponse({'error': f'❌ {str(e)}'}, status=500)

                        
                        
                        
@csrf_exempt
@require_http_methods(["GET"])
def get_Therapy_request_details_op(request):
    registration_id = request.GET.get('Registration_id')
    status = request.GET.get('Status')
    
    queryset = Therapy_Request_Details.objects.filter(RegisterType="OP")

    if registration_id:
        queryset = queryset.filter(OP_Register_Id__Registration_Id=registration_id)
    if status:
        queryset = queryset.filter(Billing_Status=status)

    serial_no = 1
    therapytestlist = []

    for obj in queryset:
        therapy_type = obj.Therapy_Type

        therapytestlist.append({
            "S_No": serial_no,
            "ServiceType": getattr(therapy_type, "service_category", "Therapy"),
            "SelectItemName": getattr(therapy_type, "service_subcategory", therapy_type.Therapy_Name),
            "Charges": float(getattr(therapy_type, "amt", 0)),
            "Amount": float(getattr(therapy_type, "amt", 0)),
            "DiscountType": "",
            "Discount": "",
            "NetAmount": float(getattr(therapy_type, "amt", 0)),
            "Quantity": 1,
            "isReimbursable": "Yes" if getattr(therapy_type, "insurancename", "") else "No"
        })
        serial_no += 1

    return JsonResponse([
        {
            "therapytestlist": therapytestlist
        }
    ], safe=False)


    #    follow up
    
@csrf_exempt
@require_http_methods(['GET'])
def get_therapy_details_for_crm(request):
    if request.method == 'GET':
        status = request.GET.get('status', 'Pending')
        result = []

        data = Therapy_Request_Details.objects.filter(Status=status).select_related(
            'OP_Register_Id__PatientId',
            'IP_Register_Id__PatientId',
            'Casuality_Register_Id__PatientId',
            'Therapy_Register_Id',
            'Therapy_Type__TherapyType_Name',
            'Location'
        )

        for i, row in enumerate(data):
            name = ''
            phone = ''
            patient_id = ''
            doctor_name = ''

            if row.OP_Register_Id:
                reg_id = row.OP_Register_Id.Registration_Id
                doctor_entries = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
        Registration_Id__Registration_Id=reg_id
    )
                doctor_name = ", ".join([
                entry.PrimaryDoctor.First_Name
         for entry in doctor_entries if entry.PrimaryDoctor
    ])


                name = row.OP_Register_Id.PatientId.FirstName
                phone = row.OP_Register_Id.PatientId.PhoneNo
                patient_id = row.OP_Register_Id.PatientId.PatientId

            elif row.IP_Register_Id:
                name = row.IP_Register_Id.PatientId.FirstName
                phone = row.IP_Register_Id.PatientId.PhoneNo
                patient_id = row.IP_Register_Id.PatientId.PatientId

            elif row.Casuality_Register_Id:
                name = row.Casuality_Register_Id.PatientId.FirstName
                phone = row.Casuality_Register_Id.PatientId.PhoneNo
                patient_id = row.Casuality_Register_Id.PatientId.PatientId

            therapy_type_name = ''
            therapy_name = ''
            if row.Therapy_Type:
                if row.Therapy_Type.TherapyType_Name:
                    therapy_type_name = row.Therapy_Type.TherapyType_Name.TherapyType_Name
                therapy_name = row.Therapy_Type.Therapy_Name

            result.append({
                'id': i + 1,
                'Request_Id': row.Request_Id,
                'PatientName': name,
                'PhoneNo': phone,
                'Patient_id': patient_id,
                'Therapy_Type': therapy_type_name,
                'Theraphy_Name': therapy_name,
                'Doctor_Name': doctor_name,
                'Status': row.Status,
                'next_review_date': row.next_review_date,
                'total_sessions': row.total_sessions,
                'Sessions': row.Sessions,
                'Sessions_Balance': row.Sessions_Balance,
                'Sessions_Completed': row.Sessions_Completed,
            })

        return JsonResponse(result, safe=False)
    
@csrf_exempt
@require_http_methods(["POST"])
def reschedule_therapy(request):
    try:
        data = json.loads(request.body)
        request_id = data.get("Request_Id")
        next_review_date_str = data.get("next_review_date")

        # Check for missing values
        if not request_id or not next_review_date_str:
            return JsonResponse({"error": "Missing data"}, status=400)

        # Convert string to date
        next_review_date = datetime.strptime(next_review_date_str, "%Y-%m-%d").date()

        therapy_request = get_object_or_404(Therapy_Request_Details, Request_Id=request_id)
        therapy_request.next_review_date = next_review_date
        therapy_request.save()

        return JsonResponse({"message": "Review date updated successfully."})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_http_methods(['GET'])    
def Session_Tracking_get(request):    
    try:
        request_id = request.GET.get('request_id')  # Get it from query params
        result = []
        thr = TherapySessionTracking.objects.filter(Request_Id__Request_Id=request_id)
        
        for th in thr:
            result.append({
                'session_id': th.session_id,
                'remarks': th.remarks,
                'Status': th.Status,
                'next_review_date': th.next_review_date,
                'created_at': th.created_at,
                'created_by': th.created_by
            })
        
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({'err': str(e)}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def get_therapy_request_details_for_opBilling(request):
    try:
        therapy_requests = Therapy_Request_Details.objects.filter(Billing_Status='Pending').select_related(
            'OP_Register_Id', 'Billing_Invoice_No', 'Location', 'Therapy_Type'
        )

        data = []
        for tr in therapy_requests:
            op = tr.OP_Register_Id
            if not op or not op.PatientId:
                continue

            patient = op.PatientId
            try:
                doctor = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(Registration_Id=op)
            except OP_Patient_Appointment_With_Multiple_Doctor.DoesNotExist:
                doctor = None

            try:
                ratecard = Therapy_Ratecard_Master.objects.get(Therapy=tr.Therapy_Type)
            except Therapy_Ratecard_Master.DoesNotExist:
                continue

            # Just one session item
            session_item = {
                "SessionNo": 1,
                "Fee": ratecard.Fee,
                "TherapyName": tr.Therapy_Type.Therapy_Name,
                "TherapyTypeId": tr.Therapy_Type.Therapy_Id,
                "Request_Id": tr.Request_Id,
                "Status": tr.Status,
                "Date": str(tr.created_at.date()),
            }

            request_data = {
                "id": tr.Request_Id,
                "Request_Id": tr.Request_Id,
                "Status": tr.Status,
                "BarcodeInvoice": None,
                "Billing_Invoice_No": tr.Billing_Invoice_No.Billing_Invoice_No if tr.Billing_Invoice_No else None,
                "Billing_Status": tr.Billing_Status,
                "BillingType": "Therapy",
                "OP_Register_Id": op.Registration_Id,
                "created_by": tr.created_by,
                "Location_Name": tr.Location.Location_Name if tr.Location else "",
                "CreatedAt": tr.created_at.isoformat(),
                "UpdatedAt": tr.updated_at.isoformat(),
                "PatientId": patient.PatientId,
                "Patient_Name": f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                "PhoneNo": patient.PhoneNo,
                "DoctorID": doctor.PrimaryDoctor.Doctor_ID if doctor else None,
                "DoctorName": f'{doctor.PrimaryDoctor.First_Name} {doctor.PrimaryDoctor.Middle_Name} {doctor.PrimaryDoctor.Last_Name}' if doctor else "",
                "Doctor_ShortName": doctor.PrimaryDoctor.ShortName if doctor else "",
                "RegisterType": tr.RegisterType,
                "Age": patient.Age,
                "Area": patient.Area,
                "BloodGroup": patient.BloodGroup,
                "City": patient.City,
                "Complaint": getattr(op, "Complaint", ""),
                "Country": patient.Country,
                "DOB": str(patient.DOB),
                "Date": str(tr.created_at.date()),
                "DoorNo": patient.DoorNo,
                "Email": patient.Email,
                "FirstName": patient.FirstName,
                "AgeGender": f"{patient.Age}/{patient.Gender}",
                "Gender": patient.Gender,
                "MiddleName": patient.MiddleName,
                "Nationality": patient.Nationality,
                "Occupation": patient.Occupation,
                "PatientCategory": op.PatientCategory,
                "Pincode": patient.Pincode,
                "Religion": patient.Religion,
                "State": patient.State,
                "Street": patient.Street,
                "SurName": patient.SurName,
                "Title": patient.Title.Title_Name if patient.Title else "",
                "UniqueIdNo": patient.UniqueIdNo,
                "UniqueIdType": patient.UniqueIdType,
                "VisitPurpose": op.VisitPurpose,
                "VisitType": op.VisitPurpose,
                "ServiceProcedureForm": "Therapy",
                "sessions": tr.total_sessions,
                "Fee_Per_session": ratecard.Fee,
                "Total_session_fee": tr.total_sessions * ratecard.Fee,
                "ItemDetails": [session_item],
                "VisitId": op.VisitId,
                "Report": None,
                "Registration_Id": op.Registration_Id,
            }

            data.append(request_data)

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'err': str(e)}, status=500)

 
@csrf_exempt
@require_http_methods(['GET'])
def get_therapy_request_details_for_ipBilling(request):
    try:
        therapy_requests = Therapy_Request_Details.objects.filter(
            Billing_Status='Pending',
            RegisterType='IP'
        ).select_related(
            'IP_Register_Id', 'Billing_Invoice_No', 'Location', 'Therapy_Type'
        )

        data = []
        for tr in therapy_requests:
            ip = tr.IP_Register_Id
            if not ip or not ip.PatientId:
                continue

            ward = Patient_Admission_Room_Detials.objects.get(IP_Registration_Id=ip)
            patient = ip.PatientId

            try:
                ratecard = Therapy_Ratecard_Master.objects.get(Therapy=tr.Therapy_Type)
            except Therapy_Ratecard_Master.DoesNotExist:
                continue

            # Just one session item
            session_item = {
                "SessionNo": 1,
                "Fee": ratecard.Fee,
                "TherapyName": tr.Therapy_Type.Therapy_Name,
                "TherapyTypeId": tr.Therapy_Type.Therapy_Id,
                "Request_Id": tr.Request_Id,
                "Status": tr.Status,
                "Date": str(tr.created_at.date()),
            }

            request_data = {
                "id": tr.Request_Id,
                "Request_Id": tr.Request_Id,
                "Status": tr.Status,
                "BarcodeInvoice": None,
                "Billing_Invoice_No": tr.Billing_Invoice_No.Billing_Invoice_No if tr.Billing_Invoice_No else None,
                "Billing_Status": tr.Billing_Status,
                "BillingType": "Therapy",
                "IP_Register_Id": ip.Registration_Id,
                "created_by": tr.created_by,
                "Location_Name": tr.Location.Location_Name if tr.Location else "",
                "CreatedAt": tr.created_at.isoformat(),
                "UpdatedAt": tr.updated_at.isoformat(),
                "PatientId": patient.PatientId,
                "Patient_Name": f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                "PhoneNo": patient.PhoneNo,
                "DoctorID": ip.PrimaryDoctor.Doctor_ID if hasattr(ip, 'PrimaryDoctor') else None,
                "DoctorName": f'{ip.PrimaryDoctor.First_Name} {ip.PrimaryDoctor.Middle_Name} {ip.PrimaryDoctor.Last_Name}' if hasattr(ip, 'PrimaryDoctor') else "",
                "Doctor_ShortName": ip.PrimaryDoctor.ShortName if hasattr(ip, 'PrimaryDoctor') else "",
                "RegisterType": tr.RegisterType,
                "Age": patient.Age,
                "Area": patient.Area,
                "BloodGroup": patient.BloodGroup,
                "City": patient.City,
                "Complaint": getattr(ip, "Complaint", ""),
                "Country": patient.Country,
                "DOB": str(patient.DOB),
                "Date": str(tr.created_at.date()),
                "DoorNo": patient.DoorNo,
                "Email": patient.Email,
                "FirstName": patient.FirstName,
                "AgeGender": f"{patient.Age}/{patient.Gender}",
                "Gender": patient.Gender,
                "MiddleName": patient.MiddleName,
                "Nationality": patient.Nationality,
                "Bed_No": ward.RoomId.Room_Id,
                "Room_No": ward.RoomId.Ward_Name.RoomNo,
                "Ward_id": ward.RoomId.Ward_Name.Ward_Name.Ward_Id,
                "Ward_name": ward.RoomId.Ward_Name.Ward_Name.Ward_Name,
                "Occupation": patient.Occupation,
                "PatientCategory": ip.PatientCategory,
                "Pincode": patient.Pincode,
                "Religion": patient.Religion,
                "State": patient.State,
                "Street": patient.Street,
                "SurName": patient.SurName,
                "Title": patient.Title.Title_Name if patient.Title else "",
                "UniqueIdNo": patient.UniqueIdNo,
                "UniqueIdType": patient.UniqueIdType,
                "VisitPurpose": "IP",
                "VisitType": "IP",
                "ServiceProcedureForm": "Therapy",
                "sessions": tr.total_sessions,
                "Fee_Per_session": ratecard.Fee,
                "Total_session_fee": tr.total_sessions * ratecard.Fee,
                "ItemDetails": [session_item],
                "Report": None,
                "Registration_Id": ip.Registration_Id,
            }

            data.append(request_data)

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'err': str(e)}, status=500)
