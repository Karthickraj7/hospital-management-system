import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from Frontoffice.models import *
from OutPatient.models import *
import filetype
import base64

def get_file_image(filedata):
    kind = filetype.guess(filedata)
                
    # Default to PDF if the type is undetermined
    contenttype1 = 'application/pdf'
    if kind and kind.mime == 'image/jpeg':
        contenttype1 = 'image/jpeg'
    elif kind and kind.mime == 'image/png':
        contenttype1 = 'image/png'

    # Return base64 encoded data with MIME type
    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'




@csrf_exempt
@require_http_methods(["GET"])
def get_nurse_station_patients(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        ward_name = request.GET.get('WardName', '')
        from_date = request.GET.get('fromDate', '')
        to_date = request.GET.get('toDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        current_date = request.GET.get('CurrentDate', '')
        limit = int(request.GET.get('limit', 10))

        booking_status = (
            'Booked' if status == 'Pending' else
            'Occupied' if status == 'Admitted' else
            'Vacated' if status == 'Completed' else
            'Cancelled'
        )

        queryset = Patient_IP_Registration_Detials.objects.all()

        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )

        if status:
            queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=booking_status))

        if ward_name:
            room_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Name=ward_name
            )
            registration_ids = room_details_qs.values_list('IP_Registration_Id__Registration_Id', flat=True)
            queryset = queryset.filter(Registration_Id__in=registration_ids)

        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        elif current_date:
            queryset = queryset.filter(created_at__date=current_date)

        patients_data = []
        for idx, register in enumerate(queryset[:limit], start=1):
            admission = Patient_Admission_Detials.objects.filter(
                IP_Registration_Id=register
            ).first()
            room_details = Patient_Admission_Room_Detials.objects.filter(
                IP_Registration_Id=register
            ).last()

            patient_dict = {
                'id': idx,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                'PatientCategory': register.PatientCategory or 'N/A',
                'AdmissionPurpose': admission.AdmissionPurpose if admission else 'N/A',
                'DoctorName': (
                    f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}"
                    if register.PrimaryDoctor else 'N/A'
                ),
                'AdmissionDate': (
                    room_details.Admitted_Date.strftime('%Y-%m-%d')
                    if room_details and room_details.Admitted_Date else 'N/A'
                ),
                'BedNo': room_details.RoomId.Bed_No if room_details and room_details.RoomId else 'N/A',
                'WardName': (
                    room_details.RoomId.Ward_Name.Ward_Name.Ward_Name
                    if room_details and room_details.RoomId else 'N/A'
                ),
                'Status': register.Status,
            }
            patients_data.append(patient_dict)

        count_filters = {}
        if current_date:
            count_filters['created_at__date'] = current_date
        if from_date and to_date:
            count_filters['created_at__date__range'] = [from_date, to_date]
        if particular_date:
            count_filters['created_at__date'] = particular_date

        count_queryset = Patient_IP_Registration_Detials.objects.filter(**count_filters)
        if ward_name:
            ward_room_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Name=ward_name
            )
            registration_ids = ward_room_qs.values_list('IP_Registration_Id__Registration_Id', flat=True)
            count_queryset = count_queryset.filter(Registration_Id__in=registration_ids)

        total_count = count_queryset.count()

        return JsonResponse({
            'patients': patients_data,
            'total_count': total_count
        }, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from Frontoffice.models import *
from OutPatient.models import *
import filetype
import base64
import logging
from Inventory.models import *

# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Radiology_RequestDetails(request):
    if request.method == 'GET':
        try:
            def get_file_image(filedata):
                if filedata is None:
                    return None
                try:
                    kind = filetype.guess(filedata)
                    supported_mime_types = [
                        'application/pdf',
                        'image/jpeg',
                        'image/png',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ]
                    contenttype = 'application/pdf'
                    if kind and kind.mime in supported_mime_types:
                        contenttype = kind.mime
                    return f'data:{contenttype};base64,{base64.b64encode(filedata).decode("utf-8")}'
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None

            # Extract query parameters
            date_option = request.GET.get('dateOption', 'current')
            current_date = request.GET.get('date', None)
            from_date = request.GET.get('fromDate', None)
            to_date = request.GET.get('toDate', None)
            particular_date = request.GET.get('particularDate', None)
            status = request.GET.get('status', 'Request')

            # Base queryset
            radiology_requests = Radiology_Request_Details.objects.filter(
                Status=status
            ).order_by('-created_at')

            # Apply date filters if provided
            if date_option == 'current' and current_date:
                radiology_requests = radiology_requests.filter(created_at__date=current_date)
            elif date_option == 'custom' and from_date and to_date:
                radiology_requests = radiology_requests.filter(created_at__date__range=[from_date, to_date])
            elif date_option == 'particular' and particular_date:
                radiology_requests = radiology_requests.filter(created_at__date=particular_date)

            response_data = []
            
            for index, req in enumerate(radiology_requests, 1):
                testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
                radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()

                # Determine which registration to use
                registration = None
                if req.OP_Register_Id:
                    registration = req.OP_Register_Id
                elif req.IP_Register_Id:
                    registration = req.IP_Register_Id
                elif req.Casuality_Register_Id:
                    registration = req.Casuality_Register_Id
                elif req.Diagnosis_Register_Id:
                    registration = req.Diagnosis_Register_Id

                if registration and radiologyname and testname:
                    patient = registration.PatientId
                    doctor = registration.PrimaryDoctor if hasattr(registration, 'PrimaryDoctor') else None

                    response_data.append({
                        'id': index,
                        'PatientId': patient.PatientId,
                        'RadiologyRequestId': req.Radiology_RequestId,
                        'PatientName': f"{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                        'PhoneNumber': patient.PhoneNo,
                        'DoctorId': doctor.Doctor_ID if doctor else None,
                        'DoctorName': f"{doctor.First_Name} {doctor.Last_Name}" if doctor else None,
                        'RadiologyName': radiologyname.Radiology_Name,
                        'TestCode': testname.Test_Code,
                        'TestName': testname.Test_Name,
                        'Reason': req.Reason,
                        'Status': req.Status,
                        'ChooseFile': get_file_image(testname.Report_file),
                        'Amount': testname.Amount,
                        'BookingFees': testname.BookingFees,
                        'RegisterType': req.RegisterType,
                        'created_at': req.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    })

            return JsonResponse({
                'IsSubTestNo': response_data
            }, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_ip_Patient_registration_details_for_Nusestation(request):
#     try:
#         query = request.GET.get('query', '')
#         status = request.GET.get('status', '')
#         DoctorId = request.GET.get('DoctorId', '')
#         Doctor = request.GET.get('Doctor')
#         Wardid = request.GET.get('Wardid')
#         Roomid = request.GET.get('Roomid')
#         NurseStationid = request.GET.get('NurseStationid')

       
#         from_date = request.GET.get('fromDate', '')  
#         to_date = request.GET.get('toDate', '')  
#         particular_date = request.GET.get('ParticularDate', '')
#         Current_date = request.GET.get('CurrentDate', '')
#         limit = int(request.GET.get('limit', 10))  # Default limit of 10 if not provided
 
#         # Map status to Booking_Status
#         Booking_Status = (
#             'Booked' if status == 'Pending' else
#             'Occupied' if status == 'Admitted' else
#             'Vacated' if status == 'Completed' else
#             'Cancelled'
#         )


#         NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

#         WardforNs = NurseStationMasterDetails.objects.filter(
#             NurseStationid=NurseStationidins
#         ).values_list('Wardid', flat=True)

#         print(WardforNs,'WardforNs')
 
#         # Start with all records
#         queryset = Patient_IP_Registration_Detials.objects.all()
        

#         # Apply filters only if provided
#         if query:
#             queryset = queryset.filter(
#                 Q(PatientId__FirstName__icontains=query) |
#                 Q(PatientId__MiddleName__icontains=query) |
#                 Q(PatientId__SurName__icontains=query) |
#                 Q(PatientId__PatientId__icontains=query) |
#                 Q(PatientId__PhoneNo__icontains=query)
#             )
 
#         if DoctorId:
#             queryset = queryset.filter(PrimaryDoctor__Doctor_ID=DoctorId)
        
#         if Doctor:
#             queryset = queryset.filter(PrimaryDoctor__Doctor_ID=Doctor)

#         if status:  # Only apply status filter if provided
#             queryset = queryset.filter(Q(Status__icontains=status) & Q(Booking_Status=Booking_Status))
 
#         # Apply date filters only if parameters are provided
#         if from_date and to_date:
#             queryset = queryset.filter(created_at__date__range=[from_date, to_date])
#         elif particular_date:
#             queryset = queryset.filter(created_at__date=particular_date)
#         elif Current_date:
#             queryset = queryset.filter(created_at__date=Current_date)

#         if NurseStationid:

#             ward_details_qs = Patient_Admission_Room_Detials.objects.filter(
#                 RoomId__Ward_Name__Ward_Name__Ward_Id__in=WardforNs
#             )
#             print(len(ward_details_qs),'Wardiddddddddd')
#             registration_ids = ward_details_qs.values_list('IP_Registration_Id', flat=True)
#             print(registration_ids,'registration_ids')
#             queryset = queryset.filter(Registration_Id__in=registration_ids)

        
#         if Wardid:
#             ward_details_qs = Patient_Admission_Room_Detials.objects.filter(
#                 RoomId__Ward_Name__Ward_Name__Ward_Id=Wardid
#             )
#             print(len(ward_details_qs),'Wardiddddddddd')
#             registration_ids = ward_details_qs.values_list('IP_Registration_Id', flat=True)
#             print(registration_ids,'registration_ids')
#             queryset = queryset.filter(Registration_Id__in=registration_ids)
        
#         print(queryset,'queryset----registration_ids')

#         if Roomid:

#             room_details_qs = Patient_Admission_Room_Detials.objects.filter(
#                 RoomId__Ward_Name__RoomNo=Roomid
#             )
#             print(len(room_details_qs),'Wardiddddddddd')

#             registration_ids = room_details_qs.values_list('IP_Registration_Id', flat=True)
#             print(registration_ids,'registration_ids')
#             queryset = queryset.filter(Registration_Id__in=registration_ids)
        
#         print(queryset,'queryset----registration_ids')
        

#         ip_register_data = []

#         for idx, register in enumerate(queryset, start=1):
#             BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None
#             admission = Patient_Admission_Detials.objects.filter(IP_Registration_Id__Registration_Id=register.Registration_Id).first()
#             appointment_dict = {
#                 'id': idx,
#                 'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
#                 'RegistrationId': register.Registration_Id,
#                 'PatientId': register.PatientId.PatientId,
#                 'PatientName': f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
#                 'PhoneNo': register.PatientId.PhoneNo,
#                 'Age': register.PatientId.Age,
#                 'Gender': register.PatientId.Gender,
#                 'UHID':register.PatientId.UniqueIdNo if register.PatientId.UniqueIdNo else None,
#                 'BloodGroup': BloodGroup_name,
#                 'Complaint': register.Complaint,
#                 'isMLC': register.IsMLC,
#                 'isRefferal': register.IsReferral,
#                 'Status': register.Status,
#                 'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
#                 'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
#                 'PatientCategory' : register.PatientCategory,
#                 'Complaint': admission.AdmissionPurpose,
#                 'AdmissionDate': register.created_at.strftime('%d-%m-%Y') if register.created_at else None,
#                 'AdmissionTime': register.created_at.strftime('%I:%M %p') if register.created_at else None,

#             }
 
#             if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
#                 roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).last()
#                 if roomdetials:
#                     appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
#                     appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
#                     appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
#                     appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
#                     appointment_dict['WardId'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Id if roomdetials.RoomId else None
#                     appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
#                     appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
#                     appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials else None
 
#             ip_register_data.append(appointment_dict)
        
#         count_filters = {}
#         if Current_date:
#             count_filters['created_at__date'] = Current_date
        
#         if from_date and to_date:
#             count_filters['created_at__date__range'] = [from_date, to_date]
        
#         if particular_date:
#             count_filters['created_at__date'] = particular_date
         
#         if Doctor:
#             count_filters['PrimaryDoctor__Doctor_ID'] = Doctor

#         # Total_IP_Count = queryset.filter(**count_filters).count()    

#         count_queryset =  Patient_IP_Registration_Detials.objects.filter(
#            **count_filters
#         )  

#         # if WardName:
#         #     ward_room_qs = Patient_Admission_Room_Detials.objects.filter(
#         #         RoomId__Ward_Name__Ward_Name__Ward_Id=WardName
#         #     )
#         #     registration_ids = ward_room_qs.values_list('IP_Registration_Id', flat=True)
#         #     count_queryset = count_queryset.filter(Registration_Id__in=registration_ids)

#         # Total_IP_Count = count_queryset.count()

#         # Total_IP_Count = queryset.count()
        
#         # return JsonResponse({
#         #     'appointments': ip_register_data,
#         #     'today_Admitted_IP_count': today_Admitted_IP_count,
#         #     'monthly_Admitted_IP_count': monthly_Admitted_IP_count,
#         #     'yearly_Admitted_IP_count': yearly_Admitted_IP_count,
#         #     'today_Discharged_IP_count': today_Discharged_IP_count,
#         #     'monthly_Discharged_IP_count': monthly_Discharged_IP_count,
#         #     'yearly_Discharged_IP_count': yearly_Discharged_IP_count,
#         # }, safe=False)
    
#         return JsonResponse({
#             'appointments': ip_register_data,
#             # 'Total_IP_Count': Total_IP_Count
#         }, safe=False)
    

#         # return JsonResponse(ip_register_data, safe=False)
 
#     except Exception as e:
#         return JsonResponse({'error': str(e)})
   

@csrf_exempt
@require_http_methods(["GET"])
def get_ip_Patient_registration_details_for_Nusestation(request):
    try:
        query = request.GET.get("query", "")
        status = request.GET.get("status", "")
        DoctorId = request.GET.get("DoctorId", "")
        Doctor = request.GET.get("Doctor")
        Wardid = request.GET.get("Wardid")
        Roomid = request.GET.get("Roomid")
        NurseStationid = request.GET.get("NurseStationid")
 
        from_date = request.GET.get("fromDate", "")
        to_date = request.GET.get("toDate", "")
        particular_date = request.GET.get("ParticularDate", "")
        Current_date = request.GET.get("CurrentDate", "")
        limit = int(request.GET.get("limit", 10))

        dateOption = request.GET.get('dateOption',"")

        print(dateOption,'dateOption')
 
        # 👇 New filters
        specialization = request.GET.get("Specialization", "")
        patient_category = request.GET.get("PatientCategory", "")
       
        print (specialization,"specialization")
        print (patient_category,"patient_category")
 
        queryset = Patient_IP_Registration_Detials.objects.all()
 
        # existing filters ...
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query)
                | Q(PatientId__MiddleName__icontains=query)
                | Q(PatientId__SurName__icontains=query)
                | Q(PatientId__PatientId__icontains=query)
                | Q(PatientId__PhoneNo__icontains=query)
            )
 
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=DoctorId)
 
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=Doctor)
           
 
        if status:
            Booking_Status = (
                "Booked"
                if status == "Pending"
                else (
                    "Occupied"
                    if status == "Admitted"
                    else "Vacated" if status == "Completed" else "Cancelled"
                )
            )
            queryset = queryset.filter(
                Q(Status__icontains=status) & Q(Booking_Status=Booking_Status)
            )
 
        NurseStationidins = NurseStationMaster.objects.filter(
            NurseStationid=NurseStationid
        ).first()
 
        WardforNs = NurseStationMasterDetails.objects.filter(
            NurseStationid=NurseStationidins
        ).values_list("Wardid", flat=True)
 
        print(WardforNs, "WardforNs")
 
        # Start with all records
        queryset = Patient_IP_Registration_Detials.objects.all()
 
        # Apply filters only if provided
        if query:
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query)
                | Q(PatientId__MiddleName__icontains=query)
                | Q(PatientId__SurName__icontains=query)
                | Q(PatientId__PatientId__icontains=query)
                | Q(PatientId__PhoneNo__icontains=query)
            )
 
        if DoctorId:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=DoctorId)
 
        if Doctor:
            queryset = queryset.filter(PrimaryDoctor__Doctor_ID=Doctor)
 
        if status:  # Only apply status filter if provided
            queryset = queryset.filter(
                Q(Status__icontains=status) & Q(Booking_Status=Booking_Status)
            )
 
        # Apply date filters only if parameters are provided
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        elif particular_date:
            queryset = queryset.filter(created_at__date=particular_date)
        elif Current_date:
            queryset = queryset.filter(created_at__date=Current_date)
 
        # 👇 Apply new filters (moved here to persist after reset)
        if specialization:
            queryset = queryset.filter(Specialization__Speciality_Id=specialization)
 
        if patient_category:
            queryset = queryset.filter(PatientCategory__iexact=patient_category)
 
        if NurseStationid:
 
            ward_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=WardforNs
            )
            print(len(ward_details_qs), "Wardiddddddddd")
            registration_ids = ward_details_qs.values_list(
                "IP_Registration_Id", flat=True
            )
            print(registration_ids, "registration_ids")
            queryset = queryset.filter(Registration_Id__in=registration_ids)
 
        if Wardid:
            ward_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id=Wardid
            )
            print(len(ward_details_qs), "Wardiddddddddd")
            registration_ids = ward_details_qs.values_list(
                "IP_Registration_Id", flat=True
            )
            print(registration_ids, "registration_ids")
            queryset = queryset.filter(Registration_Id__in=registration_ids)
 
        print(queryset, "queryset----registration_ids")
 
        if Roomid:
 
            room_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__RoomNo=Roomid
            )
            print(len(room_details_qs), "Wardiddddddddd")
 
            registration_ids = room_details_qs.values_list(
                "IP_Registration_Id", flat=True
            )
            print(registration_ids, "registration_ids")
            queryset = queryset.filter(Registration_Id__in=registration_ids)
 
        print(queryset, "queryset----registration_ids")
 
        ip_register_data = []
 
        for idx, register in enumerate(queryset, start=1):
            BloodGroup_name = (
                register.PatientId.BloodGroup.BloodGroup_Name
                if register.PatientId.BloodGroup
                else None
            )
            admission = Patient_Admission_Detials.objects.filter(
                IP_Registration_Id__Registration_Id=register.Registration_Id
            ).first()
            appointment_dict = {
                "id": idx,
                "PatientProfile": (
                    get_file_image(register.PatientId.Patient_profile)
                    if register.PatientId.Patient_profile
                    else None
                ),
                "RegistrationId": register.Registration_Id,
                "PatientId": register.PatientId.PatientId,
                "PatientName": f"{register.PatientId.Title.Title_Name}.{register.PatientId.FirstName} {register.PatientId.MiddleName} {register.PatientId.SurName}",
                "PhoneNo": register.PatientId.PhoneNo,
                "Age": register.PatientId.Age,
                "Gender": register.PatientId.Gender,
                "UHID": (
                    register.PatientId.UniqueIdNo
                    if register.PatientId.UniqueIdNo
                    else None
                ),
                "BloodGroup": BloodGroup_name,
                "Complaint": register.Complaint,
                "isMLC": register.IsMLC,
                "isRefferal": register.IsReferral,
                "Status": register.Status,
                "DoctorName": (
                    f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}"
                    if register.PrimaryDoctor
                    else ""
                ),
                "Specialization": (
                    str(register.Specialization.Speciality_Name)
                    if register.Specialization
                    else ""
                ),
                "PatientCategory": register.PatientCategory,
                "Complaint": admission.AdmissionPurpose,
                "AdmissionDate": (
                    register.created_at.strftime("%d-%m-%Y")
                    if register.created_at
                    else None
                ),
                "AdmissionTime": (
                    register.created_at.strftime("%I:%M %p")
                    if register.created_at
                    else None
                ),
            }
 
            if register.Booking_Status in ["Booked", "Occupied", "Vacated"]:
                roomdetials = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id=register
                ).last()
                if roomdetials:
                    appointment_dict["BuildingName"] = (
                        roomdetials.RoomId.Building_Name.Building_Name
                        if roomdetials.RoomId
                        else None
                    )
                    appointment_dict["BlockName"] = (
                        roomdetials.RoomId.Block_Name.Block_Name
                        if roomdetials.RoomId
                        else None
                    )
                    appointment_dict["FloorName"] = (
                        roomdetials.RoomId.Floor_Name.Floor_Name
                        if roomdetials.RoomId
                        else None
                    )
                    appointment_dict["WardName"] = (
                        roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name
                        if roomdetials.RoomId
                        else None
                    )
                    appointment_dict["WardId"] = (
                        roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Id
                        if roomdetials.RoomId
                        else None
                    )
                    appointment_dict["RoomNo"] = (
                        roomdetials.RoomId.Ward_Name.RoomNo
                        if roomdetials.RoomId
                        else None
                    )
                    appointment_dict["BedNo"] = (
                        roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
                    )
                    appointment_dict["RoomId"] = (
                        roomdetials.RoomId.Room_Id if roomdetials else None
                    )
 
            ip_register_data.append(appointment_dict)
 
        count_filters = {}
        if Current_date:
            count_filters["created_at__date"] = Current_date
 
        if from_date and to_date:
            count_filters["created_at__date__range"] = [from_date, to_date]
 
        if particular_date:
            count_filters["created_at__date"] = particular_date
 
        if Doctor:
            count_filters["PrimaryDoctor__Doctor_ID"] = Doctor
 
        # Total_IP_Count = queryset.filter(**count_filters).count()
 
        count_queryset = Patient_IP_Registration_Detials.objects.filter(**count_filters)
 
        # if WardName:
        #     ward_room_qs = Patient_Admission_Room_Detials.objects.filter(
        #         RoomId__Ward_Name__Ward_Name__Ward_Id=WardName
        #     )
        #     registration_ids = ward_room_qs.values_list('IP_Registration_Id', flat=True)
        #     count_queryset = count_queryset.filter(Registration_Id__in=registration_ids)
 
        # Total_IP_Count = count_queryset.count()
 
        # Total_IP_Count = queryset.count()
 
        # return JsonResponse({
        #     'appointments': ip_register_data,
        #     'today_Admitted_IP_count': today_Admitted_IP_count,
        #     'monthly_Admitted_IP_count': monthly_Admitted_IP_count,
        #     'yearly_Admitted_IP_count': yearly_Admitted_IP_count,
        #     'today_Discharged_IP_count': today_Discharged_IP_count,
        #     'monthly_Discharged_IP_count': monthly_Discharged_IP_count,
        #     'yearly_Discharged_IP_count': yearly_Discharged_IP_count,
        # }, safe=False)
 
        return JsonResponse(
            {
                "appointments": ip_register_data,
                # 'Total_IP_Count': Total_IP_Count
            },
            safe=False,
        )
 
        # return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({"error": str(e)})




@csrf_exempt
@require_http_methods(["GET"])
def get_ip_registration_before_handover_details(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        Wardid = request.GET.get('Wardid')
        Roomid = request.GET.get('Roomid')
        Wardlist = [int(s) for s in request.GET.getlist('WardList[]')]
        NurseStationid = request.GET.get('NurseStationid')

        print(Wardlist,'Wardlistttttttt')
 
        # Map status to Booking_Status
        Booking_Status = 'Booked' if status == 'Pending' else ('Occupied' if status == 'Admitted' else 'Cancelled')
 
        queryset = Patient_IP_Registration_Detials.objects.all()

        NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

        WardforNs = NurseStationMasterDetails.objects.filter(
            NurseStationid=NurseStationidins
        ).values_list('Wardid', flat=True)
 
        # Apply filters based on the query parameters
        if query:

            print('inside queryyyyyyy')
            queryset = queryset.filter(
                Q(PatientId__FirstName__icontains=query) |
                Q(PatientId__MiddleName__icontains=query) |
                Q(PatientId__SurName__icontains=query) |
                Q(PatientId__PatientId__icontains=query) |
                Q(PatientId__PhoneNo__icontains=query)
            )

            print(queryset,'inside queryset')
 
        if status:
            queryset = queryset.filter(Q(Status__icontains=status)).filter(Booking_Status=Booking_Status)

        if NurseStationid:

            ward_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=WardforNs
            )
            print(len(ward_details_qs),'Wardiddddddddd')
            registration_ids = ward_details_qs.values_list('IP_Registration_Id', flat=True)
            print(registration_ids,'registration_ids')
            queryset = queryset.filter(Registration_Id__in=registration_ids)
 
        if Wardid:
            ward_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id=Wardid
            )
            print(len(ward_details_qs),'Wardiddddddddd')
            registration_ids = ward_details_qs.values_list('IP_Registration_Id', flat=True)
            print(registration_ids,'registration_ids')
            queryset = queryset.filter(Registration_Id__in=registration_ids)
        
        print(queryset,'queryset----registration_ids')

        if Roomid:

            room_details_qs = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__RoomNo=Roomid
            )
            print(len(room_details_qs),'Wardiddddddddd')

            registration_ids = room_details_qs.values_list('IP_Registration_Id', flat=True)
            print(registration_ids,'registration_ids')
            queryset = queryset.filter(Registration_Id__in=registration_ids)
        

        # Serialize the filtered queryset
        ip_register_data = []
        for idx, register in enumerate(queryset, start=1):
            # client_name = register.ClientName.Client_Name if register.ClientName else None
            # insurance_name = register.InsuranceName.Insurance_Name if register.InsuranceName else None
            Flagging_name = register.Flagging.Flagg_Name if register.Flagging else None
            Flagging_color = register.Flagging.Flagg_Color if register.Flagging else None
            BloodGroup_name = register.PatientId.BloodGroup.BloodGroup_Name if register.PatientId.BloodGroup else None

            admission = Patient_Admission_Detials.objects.filter(IP_Registration_Id__Registration_Id=register.Registration_Id).first()

           
            appointment_dict = {
                'id': idx,
                'PatientProfile': get_file_image(register.PatientId.Patient_profile) if register.PatientId.Patient_profile else None,
                'RegistrationId': register.Registration_Id,
                'PatientId': register.PatientId.PatientId,
                'PatientName': f"{register.PatientId.Title.Title_Name if register.PatientId.Title else ''}.{register.PatientId.FirstName if register.PatientId else ''} {register.PatientId.MiddleName if register.PatientId else ''} {register.PatientId.SurName if register.PatientId else ''}",
                'PhoneNo': register.PatientId.PhoneNo,
                'Age': register.PatientId.Age,
                'Gender': register.PatientId.Gender,
                'BloodGroup': BloodGroup_name,
                'Complaint': register.Complaint,
                'isMLC': register.IsMLC,
                'Flagging': Flagging_name,
                'Specialization': register.Specialization.Speciality_Name if register.Specialization else '',
                'AdmissionDate': register.created_at.strftime('%d-%m-%Y') if register.created_at else None,
                'AdmissionTime': register.created_at.strftime('%I:%M %p') if register.created_at else None,
 
                'FlaggingColour': Flagging_color,
                # 'Flagging': register.Flagging,
                'isRefferal': register.IsReferral,
                # 'ClientName': client_name,  # Fixed reference
                # 'InsuranceName': insurance_name,  # Fixed reference
                'Status': register.Status,
                'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                'Complaint': admission.AdmissionPurpose

            }
 
            # Add room details if Booking_Status is 'Booked' or 'Occupied'
            if register.Booking_Status in ['Booked', 'Occupied']:
                roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).last()
 
                if roomdetials:
                    appointment_dict['BuildingName'] = roomdetials.RoomId.Building_Name.Building_Name if roomdetials.RoomId else None
                    appointment_dict['BlockName'] = roomdetials.RoomId.Block_Name.Block_Name if roomdetials.RoomId else None
                    appointment_dict['FloorName'] = roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None
                    appointment_dict['WardName'] = roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None
                    # appointment_dict['RoomName'] = roomdetials.RoomId.Room_Name.Room_Name if roomdetials.RoomId.Room_Name else None
                    appointment_dict['RoomNo'] = roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None
                    appointment_dict['BedNo'] = roomdetials.RoomId.Bed_No if roomdetials.RoomId else None
                    appointment_dict['RoomId'] = roomdetials.RoomId.Room_Id if roomdetials.RoomId else None
 
            ip_register_data.append(appointment_dict)
 
        return JsonResponse(ip_register_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
@csrf_exempt
@require_http_methods(["GET"])
def get_stockDetails_for_nursestation(request):

    try:

        NurseStationid = request.GET.get('NurseStation')
        ItemCode = request.GET.get('ItemCode')
        ItemName = request.GET.get('ItemName')
        ProductCategory = request.GET.get('ProductCategory')
        SubCategory = request.GET.get('SubCategory')
        Location = request.GET.get('Location')

        print(NurseStationid,'nursta')


        NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

        Nsstock = Stock_Maintance_Table_Detials.objects.filter(IsNurseStation=True)

        if NurseStationid:
            Nsstock = Nsstock.filter(NurseStation_location_id = NurseStationid)
        if ProductCategory:
            Nsstock = Nsstock.filter(Product_Detials__ProductCategory__pk = ProductCategory)
        if SubCategory:
            Nsstock = Nsstock.filter(Product_Detials__SubCategory__pk = SubCategory)
        if ItemName:
            Nsstock = Nsstock.filter(Product_Detials__ItemName__icontains = ItemName)

        Stock_List = []

        for sdata in Nsstock:
            
            datalist = {
                'Stockid' : sdata.pk,
                'ItemName' : sdata.Product_Detials.ItemName if sdata.Product_Detials else None,
                'ItemCode' : sdata.Product_Detials.pk if sdata.Product_Detials else None,
                'ProductCategory': sdata.Product_Detials.ProductCategory.ProductCategory_Name if sdata.Product_Detials else None,
                'SubCategory':sdata.Product_Detials.SubCategory.SubCategoryName if sdata.Product_Detials else None,
                'GenericName': sdata.Product_Detials.GenericName.GenericName if sdata.Product_Detials and sdata.Product_Detials.GenericName else None,
                'AvailableQuantity': sdata.AvailableQuantity,
                'Total_Quantity':sdata.Total_Quantity,
                'Batch_No' : sdata.Batch_No,
                'Expiry_Date': sdata.Expiry_Date,

            }
            Stock_List.append(datalist)

        for idx, patient in enumerate(Stock_List, start=1):
                      patient["Sno"] = idx



        return JsonResponse(Stock_List,safe=False)


    except Exception as e:
        return JsonResponse({'error': str(e)})


@csrf_exempt
def get_stocksummary_for_product(request):
    try:


        NurseStationid = request.GET.get('NurseStationid')
        Stockid = request.GET.get('Stockid')
        ItemCode = request.GET.get('ItemCode')



        Stocklist = []

        Stockins = NSPharmacy.objects.filter(NurseStationid_id=NurseStationid,Stockid_id=Stockid,Product_Detials_id=ItemCode).order_by('-issued_at')

        print(Stockins,'Stockins')

        for sdata in Stockins:

            datalist = {
                'ItemName' : sdata.Product_Detials.ItemName if sdata.Product_Detials else None,
                'Batch_No' : sdata.Stockid.Batch_No,
                'Expiry_Date': sdata.Stockid.Expiry_Date,
                'AvailableQuantity':sdata.AvailableQuantity,
                'IssuedQuantity':sdata.IssuedQuantity,
                'ReplacedQuantity':sdata.ReplacedQuantity,
                'FinalQuantity':sdata.FinalQuantity,
                'issued_by':sdata.issued_by,
                'Replaced_by':sdata.Replaced_by

            }
            Stocklist.append(datalist)

        for idx, patient in enumerate(Stocklist, start=1):
                      patient["Sno"] = idx

        return JsonResponse(Stocklist,safe=False)


    except Exception as e:
        return JsonResponse({'error': str(e)})





@csrf_exempt
def NurseStation_Stock_Excel_File_Upload(request):
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")

        if not file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        # Read file
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({'error': 'Unsupported file format. Please upload a CSV or Excel file'}, status=400)

        # Clean text columns
        for col in df.select_dtypes(include=["object"]):
            df[col] = df[col].astype(str).str.replace("\xa0", " ").str.strip()

        # Required columns
        required_cols = ["ItemName", "Batch_No", "Sellable_price", "Total_Quantity", "NurseStationName", "Expiry_Date"]
        for col in required_cols:
            if col not in df.columns:
                return JsonResponse({'error': f'Missing required column: {col}'}, status=400)

        skipped_rows = []  # Keep track of skipped rows

        # Process each row
        csv_data = df.to_dict(orient="records")
        for row in csv_data:
            item_name = row.get("ItemName", "").strip()
            batch_no = row.get("Batch_No", "").strip()
            sellable_price = row.get("Sellable_price", 0)
            total_qty = row.get("Total_Quantity", 0)
            nurse_station_name = row.get("NurseStationName", "").strip()
            expiry_date = row.get("Expiry_Date")

            # Basic validations
            if not item_name or not batch_no:
                skipped_rows.append({'ItemName': item_name, 'reason': 'Missing ItemName or Batch_No'})
                continue

            try:
                total_qty = float(total_qty)
            except (ValueError, TypeError):
                skipped_rows.append({'ItemName': item_name, 'reason': 'Invalid Total_Quantity'})
                continue

            # Parse expiry date
            expiry_date_obj = None
            if expiry_date:
                try:
                    if isinstance(expiry_date, pd.Timestamp):
                        expiry_date_obj = expiry_date
                    else:
                        expiry_date_obj = pd.to_datetime(str(expiry_date).strip(), dayfirst=True, errors='raise')
                except Exception:
                    skipped_rows.append({'ItemName': item_name, 'reason': 'Invalid Expiry_Date format'})
                    continue

            with transaction.atomic():
                # Get product
                product_instance = Product_Master_All_Category_Details.objects.filter(ItemName=item_name).first()
                if not product_instance:
                    skipped_rows.append({'ItemName': item_name, 'reason': 'Product not found'})
                    continue

                # Get nurse station
                nurse_station_instance = NurseStationMaster.objects.filter(NurseStationName=nurse_station_name).first()
                if not nurse_station_instance:
                    skipped_rows.append({'ItemName': item_name, 'reason': f'Nurse Station {nurse_station_name} not found'})
                    continue

                # Update if exists, else create
                stock_instance = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials=product_instance,
                    NurseStation_location=nurse_station_instance,
                    Batch_No=batch_no
                ).first()

                if stock_instance:
                    stock_instance.Sellable_price = sellable_price
                    stock_instance.Is_MRP_as_sellable_price = True
                    stock_instance.Sellable_qty_price = sellable_price
                    stock_instance.Total_Quantity += total_qty
                    stock_instance.AvailableQuantity = total_qty
                    stock_instance.Is_Expiry_Date_Available = True
                    stock_instance.Expiry_Date = expiry_date_obj
                    stock_instance.Updated_by = created_by
                    stock_instance.Update_at = timezone.now()
                    stock_instance.save()
                else:
                    Stock_Maintance_Table_Detials.objects.create(
                        Product_Detials=product_instance,
                        Batch_No=batch_no,
                        Is_MRP_as_sellable_price=True,
                        Sellable_qty_price=sellable_price,
                        Sellable_price=sellable_price,
                        Total_Quantity=total_qty,
                        AvailableQuantity=total_qty,
                        IsNurseStation=True,
                        NurseStation_location=nurse_station_instance,
                        Is_Expiry_Date_Available=True,
                        Expiry_Date=expiry_date_obj,
                        Created_by=created_by,
                        Updated_by=created_by,
                        
                    )

        return JsonResponse({
            'success': 'Nurse Station stock file uploaded successfully',
            'skipped_rows': skipped_rows
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)

