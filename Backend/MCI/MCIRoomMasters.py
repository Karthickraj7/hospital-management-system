from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Count
from django.http import JsonResponse
from .models import *
from Masters.models import *
from Frontoffice.models import Patient_Admission_Room_Detials,Patient_Admission_Detials
from django.shortcuts import get_object_or_404
from django.db.models import  Q

import base64
import filetype

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
def get_Mci_Room_Master_Data_for_registration(request):
    try:
        # Extract query parameters
        Location = request.GET.get('location')
        RegisterType = request.GET.get('RegisterType')
        Building = request.GET.get('Building')
        Block = request.GET.get('Block')
        Floor = request.GET.get('Floor')
        Ward = request.GET.get('Ward')

        # print('Filter inputs:', Block, RegisterType)

        # Base filter conditions
        # filter_kwargs = Q(Status=True, Booking_Status='Available')
        
        filter_kwargs = Q(Status=True)


        if Location:
            filter_kwargs &= Q(Location_Name__Location_Id=Location)
        # print(filter_kwargs,'filter_kwargs11111')
        
        if Building:
            filter_kwargs &= Q(Building_Name__Building_Id=Building)
        # print(filter_kwargs,'filter_kwargs222222')
        
        if Block:
            filter_kwargs &= Q(Block_Name__Block_Id=Block)
        # print(filter_kwargs,'filter_kwargs33333')
        
        if Floor:
            filter_kwargs &= Q(Floor_Name__Floor_Id=Floor)
        # print(filter_kwargs,'filter_kwargs44444')
        
        if Ward:
            filter_kwargs &= Q(Ward_Name__Ward_Name__Ward_Id=Ward)  # Adjusted to match model
        # print(filter_kwargs, 'filter_kwargs5555555')


        # Special filtering based on RegisterType
        # if RegisterType == 'Emergency':
        #     filter_kwargs &= Q(Ward_Name__Ward_Name='CASUALITY')
        if RegisterType == 'Emergency':
            casualty_ward_ids = WardType_Master_Detials.objects.filter(Ward_Name__in=['CASUALITY']).values_list('Ward_Id', flat=True)
            filter_kwargs &= Q(Ward_Name__Ward_Name__Ward_Id__in=casualty_ward_ids)

        if RegisterType == 'IP':
            exclude_ward_ids = WardType_Master_Detials.objects.exclude(Ward_Name__in=['CASUALITY', 'OT']).values_list('Ward_Id', flat=True)
            filter_kwargs &= Q(Ward_Name__Ward_Name__Ward_Id__in=exclude_ward_ids)
        
        # print('Final filter:', filter_kwargs)

        # Fetch filtered room data
        Room_master_instances = MCI_Room_Master_Detials.objects.filter(filter_kwargs)
        
        # print('Room_master_instances----??',Room_master_instances)
        # Convert queryset to JSON response
        Room_Master_data = [
            {
                'id': room.Room_Id,
                'RoomNo': room.Ward_Name.RoomNo,
                'BedNo': room.Bed_No,
                'RoomId': room.Ward_Name.Room_Id,
                # 'BedCharge': room.Ward_Name.Current_Charge,
             #   'GST': room.Ward_Name.GST_Charge,
                # 'TotalCharge': float(room.Ward_Name.Total_Current_Charge),
                # 'ACCharge': float(room.Ward_Name.Acamt),  # AC amount
                # 'NonACCharge': float(room.Ward_Name.NonACamt),  # Non-AC amount
                # 'isAC': room.Ward_Name.isAC,  # AC status
                
                # 'WardId': room.Ward_Name.Ward_Name.Ward_Id,
                # 'WardName': room.Ward_Name.Ward_Name.Ward_Name,

                # Safe access to nested related Ward object
                'WardId': room.Ward_Name.Ward_Name.Ward_Id if room.Ward_Name and room.Ward_Name.Ward_Name else None,
                'WardName': room.Ward_Name.Ward_Name.Ward_Name if room.Ward_Name and room.Ward_Name.Ward_Name else None,

                'FloorId': room.Floor_Name.Floor_Id,
                'FloorName': room.Floor_Name.Floor_Name,
                'BlockId': room.Block_Name.Block_Id,
                'BlockName': room.Block_Name.Block_Name,
                'BuildingId': room.Building_Name.Building_Id,
                'BuildingName': room.Building_Name.Building_Name,
                'LocationName': room.Location_Name.Location_Name,
                'LocationId': room.Location_Name.Location_Id,
                'Status': 'Active' if room.Status else 'Inactive',
                'BookingStatus': room.Booking_Status,
                'created_by': room.created_by,
            }
            for room in Room_master_instances
        ]
        
        # print(Room_Master_data,'Room_Master_data')
        return JsonResponse(Room_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(["GET"])
def MCI_Patients_Management_Filter_OPVisitEntry(request):
    try:
        # Extract parameters from the request
        patientsearch = request.GET.get('patientsearch', '')
        search_query = request.GET.get('search', '')
        gender = request.GET.get('gender', '')
        from_date = request.GET.get('fromDate', '')
        to_date = request.GET.get('toDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        current_date = request.GET.get('CurrentDate', '')
 
        # Start with a base queryset limited to 2000 records
 
        # Handle patientsearch for quick filtering
        if patientsearch:
            patientsearch = patientsearch.strip()
            print('inside patientsearch', patientsearch)
 
            # Filter by PatientId, PhoneNo, or FirstName for patientsearch
            patients = MCI_Patient_Detials.objects.filter(
                Q(PatientNo__icontains=patientsearch) |
                Q(PhoneNo__icontains=patientsearch) |
                Q(FirstName__icontains=patientsearch)
            )
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientNo,
                    'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                    'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                    'FirstName': patient.FirstName,
                    'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                    'Pincode': patient.Pincode,
                    'ExistingPtNo': patient.ExistingPtNo,
                    'FatherName': patient.FatherName if patient else '',
                    'SpouseName': patient.SpouseName if patient else '',
                    'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                    'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                    'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                    'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                    'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                    'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                    'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                    'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                    'Gender': patient.Gender,
                    'Email': patient.Email,
                    'UHIDNo': patient.UniqueIdNo,
                    'date': patient.created_at.strftime('%Y-%m-%d'),
                    'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                    'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                    'ABHA': patient.ABHA,
                    'UniqueIdNo': patient.UniqueIdNo,
                } for idx, patient in enumerate(patients, start=1)
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Build dynamic filter conditions for other parameters
 
        queryset = MCI_Patient_Detials.objects.filter(DuplicateId=False)[:2000]
 
        filter_conditions = Q()
        if search_query:
            filter_conditions &= (
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientNo__icontains=search_query) |
                Q(PhoneNo__icontains=search_query) |
                Q(UniqueIdNo__icontains=search_query)
            )
        if gender:
            filter_conditions &= Q(Gender__iexact=gender)
        if from_date and to_date:
            filter_conditions &= Q(created_at__date__range=[from_date, to_date])
        elif particular_date:
            filter_conditions &= Q(created_at__date=particular_date)
        elif current_date and current_date != "":
            filter_conditions &= Q(created_at__date=current_date)
 
        # Apply the dynamic filters to the queryset
        if filter_conditions:
            queryset = queryset.filter(filter_conditions)
 
        # Prepare response data for other filters
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientNo,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'Pincode': patient.Pincode,
                'ExistingPtNo': patient.ExistingPtNo,
                'FatherName': patient.FatherName if patient else '',
                'SpouseName': patient.SpouseName if patient else '',
                'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'Email': patient.Email,
                'UHIDNo': patient.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                'ABHA': patient.ABHA,
                'UniqueIdNo': patient.UniqueIdNo,
            } for idx, patient in enumerate(queryset, start=1)
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 


@csrf_exempt
@require_http_methods(["GET"])
def MCI_Patients_Management_Filter_org_OT_Entry(request):
    try:
        # Extract parameters from the request
        patientsearch = request.GET.get('patientsearch', '')
        search_query = request.GET.get('search', '')
        gender = request.GET.get('gender', '')
        from_date = request.GET.get('fromDate', '')
        to_date = request.GET.get('toDate', '')
        particular_date = request.GET.get('ParticularDate', '')
        current_date = request.GET.get('CurrentDate', '')
 
        # Start with a base queryset limited to 2000 records
 
        # Handle patientsearch for quick filtering
        if patientsearch:
            patientsearch = patientsearch.strip()
            print('inside patientsearch', patientsearch)
 
            # Filter by PatientId, PhoneNo, or FirstName for patientsearch
            patients = MCI_Patient_Detials.objects.filter(
                Q(PatientId__icontains=patientsearch) |
                Q(PhoneNo__icontains=patientsearch) |
                Q(FirstName__icontains=patientsearch)
            )
 
            if not patients.exists():
                return JsonResponse({'message': 'No patient found'}, status=404)
 
            # Prepare response data for patientsearch
            patient_data = [
                {
                    'id': idx,
                    'PatientId': patient.PatientId,
                    'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                    'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                    'FirstName': patient.FirstName,
                    'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                    'Pincode': patient.Pincode,
                    'ExistingPtNo': patient.ExistingPtNo,
                    'FatherName': patient.FatherName if patient else '',
                    'SpouseName': patient.SpouseName if patient else '',
                    'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                    'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                    'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                    'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                    'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                    'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                    'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                    'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                    'Gender': patient.Gender,
                    'Email': patient.Email,
                    'UHIDNo': patient.UniqueIdNo,
                    'date': patient.created_at.strftime('%Y-%m-%d'),
                    'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                    'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                    'ABHA': patient.ABHA,
                    'UniqueIdNo': patient.UniqueIdNo,
                } for idx, patient in enumerate(patients, start=1)
            ]
 
            return JsonResponse(patient_data, safe=False)
 
        # Build dynamic filter conditions for other parameters
 
        queryset = MCI_Patient_Detials.objects.filter(DuplicateId=False)[:2000]
 
        filter_conditions = Q()
        if search_query:
            filter_conditions &= (
                Q(FirstName__icontains=search_query) |
                Q(MiddleName__icontains=search_query) |
                Q(SurName__icontains=search_query) |
                Q(PatientId__icontains=search_query) |
                Q(PhoneNo__icontains=search_query) |
                Q(UniqueIdNo__icontains=search_query)
            )
        if gender:
            filter_conditions &= Q(Gender__iexact=gender)
        if from_date and to_date:
            filter_conditions &= Q(created_at__date__range=[from_date, to_date])
        elif particular_date:
            filter_conditions &= Q(created_at__date=particular_date)
        elif current_date and current_date != "":
            filter_conditions &= Q(created_at__date=current_date)
 
        # Apply the dynamic filters to the queryset
        if filter_conditions:
            queryset = queryset.filter(filter_conditions)
 
        # Prepare response data for other filters
        patient_data = [
            {
                'id': idx,
                'PatientId': patient.PatientId,
                'PatientName': f"{patient.Title.Title_Name if patient.Title else ''}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else None,
                'PhoneNo': int(patient.PhoneNo.strip()) if patient.PhoneNo and patient.PhoneNo.strip().isdigit() else None,
                'FirstName': patient.FirstName,
                'AgeGender': f"{patient.Age}/{patient.DOB}/{patient.Gender}",
                'Pincode': patient.Pincode,
                'ExistingPtNo': patient.ExistingPtNo,
                'FatherName': patient.FatherName if patient else '',
                'SpouseName': patient.SpouseName if patient else '',
                'DoorNo': patient.PermanentdoorNo if patient and patient.PermanentdoorNo else (patient.DoorNo if patient else None),
                'Street': patient.PermanentStreet if patient and patient.PermanentStreet else (patient.Street if patient else None),
                'Area': patient.PermanentArea if patient and patient.PermanentArea else (patient.Area if patient else None),
                'City': patient.PermanentCity if patient and patient.PermanentCity else (patient.City if patient else None),
                'District': patient.PermanentDistrict if patient and patient.PermanentDistrict else (patient.District if patient else None),
                'State': patient.PermanentState if patient and patient.PermanentState else (patient.State if patient else None),
                'Country': patient.PermanentCountry if patient and patient.PermanentCountry else (patient.Country if patient else None),
                'Pincode': patient.PermanentPincode if patient and patient.PermanentPincode else (patient.Pincode if patient else None),
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'FullName': f'{patient.FirstName} {patient.MiddleName} {patient.SurName}',
                'Gender': patient.Gender,
                'Email': patient.Email,
                'UHIDNo': patient.UniqueIdNo,
                'date': patient.created_at.strftime('%Y-%m-%d'),
                'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                'ABHA': patient.ABHA,
                'UniqueIdNo': patient.UniqueIdNo,
            } for idx, patient in enumerate(queryset, start=1)
        ]
 
        return JsonResponse(patient_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 

@csrf_exempt
@require_http_methods(["GET"])
def get_MCI_Patient_Details_by_patientId(request):
    try:
        PatientId = request.GET.get("PatientId", '').strip()
        FirstName = request.GET.get("FirstName", '').strip()
        PhoneNumber = request.GET.get("PhoneNumber", '').strip()

        print(PatientId, 'PatientId')
        print(FirstName, 'FirstName')
        print(PhoneNumber, 'PhoneNumber')



        if MCI_Patient_Detials.objects.exists():
            patient = None
            print('hiiiii')

            if PatientId:
                
               
                

                patient = MCI_Patient_Detials.objects.get(Q(PatientNo=PatientId) & Q(DuplicateId=False))
            elif FirstName and PhoneNumber:
                print('hiiiii')
                if MCI_Patient_Detials.objects.filter(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False)).exists():
                    patient = MCI_Patient_Detials.objects.get(Q(FirstName=FirstName) & Q(PhoneNo=PhoneNumber) & Q(DuplicateId=False))
                else:
                    return JsonResponse({'warn': 'Patient does not exist'})

            print('hiiiii')
            if patient:
                Patient_data = {
                    'PatientProfile': get_file_image(patient.Patient_profile) if patient.Patient_profile else None,
                    'PatientId': patient.PatientNo,
                    'ABHA': patient.ABHA,
                    'PhoneNo': int(patient.PhoneNo) if patient.PhoneNo and patient.PhoneNo.isdigit() else None,
                    'Title': patient.Title.Title_Id if patient.Title else None,
                    'FirstName': patient.FirstName,
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'Gender': patient.Gender,
                    'MaritalStatus': patient.MaritalStatus,
                    'SpouseName': patient.SpouseName,
                    'FatherName': patient.FatherName,
                    'DOB': patient.DOB,
                    'Age': patient.Age,
                    'ABHA': patient.ABHA,
                    'Email': patient.Email,
                    'BloodGroup': patient.BloodGroup.BloodGroup_Id if patient.BloodGroup else None,
                    'Occupation': patient.Occupation,
                    'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                    'Nationality': patient.Nationality,
                    'UHIDType': patient.UniqueIdType,
                    'UHIDNo': patient.UniqueIdNo,
                    'PatientType': patient.PatientType,
                    'DoorNo': patient.DoorNo or patient.PermanentdoorNo,
                    'Street': patient.Street or patient.PermanentStreet,
                    'Area': patient.Area or patient.PermanentArea,
                    'City': patient.City or patient.PermanentCity,
                    'District': patient.District or patient.PermanentDistrict,
                    'State': patient.State or patient.PermanentState,
                    'Country': patient.Country or patient.PermanentCountry,
                    'Pincode': patient.Pincode or patient.PermanentPincode,
                    'Status': patient.Status,
                    'DoctorID': patient.DoctorID.Doctor_ID if patient.DoctorID else None,
                }
                return JsonResponse(Patient_data)
            else:
                return JsonResponse({'warn': 'Patient does not exist'})
        else:
            return JsonResponse({'warn': 'Patient does not exist'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@transaction.atomic()
@require_http_methods(['POST','GET'])
def Fake_IP_Patient_Registration_Details_Link(request):
   
    @transaction.atomic
    def create_or_update_referral(is_referral, referral_source, referral_doctor_instance, register_type, register_id, newdata, created_by):
        if is_referral == 'Yes':
            try:
               
                if register_id:
                    filters = {
                        'IP': 'IP_Register_Id__pk',
                    }
                    filter_key = filters.get(register_type)
                    if not filter_key:
                        raise ValueError("Invalid register_type provided.")
                    if Patient_Referral_Detials.objects.filter(**{filter_key: register_id}).exists():
                        referral = Patient_Referral_Detials.objects.get(**{filter_key: register_id})
                        referral.ReferralSource = referral_source
                        referral.ReferredBy = referral_doctor_instance
                        referral.save()
                    else:
                        Patient_Referral_Detials.objects.create(
                            **{
                                'IP_Register_Id': newdata if register_type == 'IP' else None,
                            },
                            ReferralRegisteredBy=register_type,
                            ReferralSource=referral_source,
                            ReferredBy=referral_doctor_instance,
                            created_by=created_by
                        )
                   
                else:
                    Patient_Referral_Detials.objects.create(
                        **{
                            'IP_Register_Id': newdata if register_type == 'IP' else None,
                        },
                        ReferralRegisteredBy=register_type,
                        ReferralSource=referral_source,
                        ReferredBy=referral_doctor_instance,
                        created_by=created_by
                    )
            except ValueError as e:
                # Handle invalid register_type
                pass
   
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # print(data,'data')
            register_Id = data.get('RegistrationId', '')
            register_type = data.get('RegisterType', '')
            patient = data.get('PatientId', '')
            Speciality = data.get('Speciality', '')
            doctor_name = data.get('DoctorName', '')
            complaint = data.get('Complaint', '')
            is_mlc = data.get('IsMLC', 'No')
            # flagging = data.get('Flagging', '')
            is_referral = data.get('IsReferral', 'No')
            ReferralSource = data.get('ReferralSource', '')
            ReferredBy = data.get('ReferredBy', '')
            AdmissionPurpose = data.get('AdmissionPurpose','')
            DrInchargeatTimeofAdmission = data.get('DrInchargeAtTimeOfAdmission','')
            NexttokinName = data.get('NextToKinName','')
            relation = data.get('Relation','')
            relativePhoneno = data.get('RelativePhoneNo','')
            personLiableforpayment = data.get('PersonLiableForBillPayment','')
            PersonLiablecontactno = data.get('PersonLiablecontactno','')
            visitDate = data.get('visitDate','')
            visitTime = data.get('visitTime','')
            familyhead = data.get('FamilyHead','')
            familyheadName = data.get('FamilyHeadName','')
            ipKitGiven = data.get('IpKitGiven','No')
            created_by = data.get('Created_by', '')
            Location_Id = data.get('Location', None)
            RoomId = data.get('RoomId', '')
 
            patient_category = data.get('PatientCategory', '')
            insurance_name = data.get('InsuranceName', '')
            insurance_type = data.get('InsuranceType', '')
           
            client_name = data.get('ClientName', '')
            client_type = data.get('ClientType', '')
            client_employee_id = data.get('ClientEmployeeId', '')
            client_employee_designation = data.get('ClientEmployeeDesignation', '')
            client_employee_relation = data.get('ClientEmployeeRelation', '')
           
            CorporateName = data.get('CorporateName', '')
            CorporateType = data.get('CorporateType', '')
            CorporateEmployeeId = data.get('CorporateEmployeeId', '')
            CorporateEmployeeDesignation = data.get('CorporateEmployeeDesignation', '')
            CorporateEmployeeRelation = data.get('CorporateEmployeeRelation', '')
           
            employee_id = data.get('EmployeeId', '')
            employee_relation = data.get('EmployeeRelation', '')
           
            doctor_id = data.get('DoctorId', '')
            doctor_relation = data.get('DoctorRelation', '')
           
            donation_type = data.get('DonationType', '')

            VisitDateTime = data.get('VisitDateTime','')

            selectedDate = data.get('selectedDate')

            print(selectedDate,'VisitDateTimeeeeeeeeeeeeeeeee')

           

            if selectedDate:
                dt = datetime.fromisoformat(selectedDate.replace("Z", "+00:00"))

                # If USE_TZ = False → strip timezone info
                if dt.tzinfo is not None:
                    dt = dt.replace(tzinfo=None)

                selectedDate = dt
            else:
                selectedDate = None

            
 
            patient_ins = MCI_Patient_Detials.objects.get(PatientNo=patient) if patient else None
            
            specialization_instance = Speciality_Detials.objects.get(Speciality_Id=Speciality) if Speciality else None
            doctor_name_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_name) if doctor_name else None
            DrInchargeatTimeofAdmission_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=DrInchargeatTimeofAdmission) if DrInchargeatTimeofAdmission else None
            referral_doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ReferredBy) if ReferredBy else None
            location_instance = Location_Detials.objects.get(Location_Id=Location_Id) if Location_Id else None
            roomid_instance = MCI_Room_Master_Detials.objects.get(Room_Id=RoomId) if RoomId else None
            # Flagging_instance = Flaggcolor_Detials.objects.get(Flagg_Id=flagging) if flagging else None
           
            employee_instance = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id) if employee_id else None
            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id) if doctor_id else None
            # Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name) if insurance_name else None
            # Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name) if client_name else None
            # Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type) if donation_type else None
            # Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName) if CorporateName else None
           
            Insurance_instance = None
            if insurance_name:
              Insurance_instance = Insurance_Master_Detials.objects.get(Insurance_Id=insurance_name)
             
            print(Insurance_instance,'Insurance_instanceqqqqqqqqqqqq')
           
            Client_instance = None
            if client_name:
               Client_instance = Client_Master_Detials.objects.get(Client_Id=client_name)
           
            Donation_instance = None
            if donation_type:
               Donation_instance = Donation_Master_Detials.objects.get(Donation_Id=donation_type)
           
            Corporate_instance = None
            if CorporateName:
               Corporate_instance = Corporate_Master_Detials.objects.get(Corporate_Id=CorporateName)
            
            
            
            # print(Client_instance,'Client_instanceqqqqqqqqqqq')
 
            if register_Id :
               
                ip_details = MCI_Patient_IP_Registration_Detials.objects.get(IPNo=register_Id)
                print(ip_details,'ip_details')
               
                ip_details.Specialization=specialization_instance  
                ip_details.PrimaryDoctor=doctor_name_instance
                ip_details.Complaint=complaint  
                ip_details.IsMLC=is_mlc  
                # ip_details.Flagging=Flagging_instance  
                ip_details.IsReferral=is_referral
 
 
 
                ip_details.PatientCategory = patient_category
                ip_details.InsuranceName = Insurance_instance if Insurance_instance else None
                ip_details.InsuranceType = insurance_type
                ip_details.ClientName = Client_instance if Client_instance else None
                ip_details.ClientType = client_type
                ip_details.ClientEmployeeId = client_employee_id
                ip_details.ClientEmployeeDesignation = client_employee_designation
                ip_details.ClientEmployeeRelation = client_employee_relation
               
                ip_details.CorporateName = Corporate_instance if Corporate_instance else None
                ip_details.CorporateType = CorporateType
                ip_details.CorporateEmployeeId = CorporateEmployeeId
                ip_details.CorporateEmployeeDesignation = CorporateEmployeeDesignation
                ip_details.CorporateEmployeeRelation = CorporateEmployeeRelation
 
                ip_details.EmployeeId = employee_instance if employee_instance else None
                ip_details.EmployeeRelation = employee_relation
                ip_details.DoctorId = doctor_instance if doctor_instance else None
                ip_details.DoctorRelation = doctor_relation
                ip_details.DonationType = Donation_instance if Donation_instance else None
                ip_details.updated_by = created_by
                ip_details.save()
               
                ip_admission = MCI_Patient_Admission_Detials.objects.get(IP_Registration_Id__IPNo = ip_details.IPNo)
                ip_admission.AdmissionPurpose = AdmissionPurpose
                ip_admission.DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance
                ip_admission.NextToKinName = NexttokinName
                ip_admission.Relation = relation
                ip_admission.RelativePhoneNo = relativePhoneno
                ip_admission.PersonLiableForPayment = personLiableforpayment
                ip_admission.PersonLiablecontactno = PersonLiablecontactno
                # ip_admission.visitDate = visitDate
                # ip_admission.visitTime = visitTime
                ip_admission.FamilyHead = familyhead
                ip_admission.FamilyHeadName = familyheadName
                ip_admission.IpKitGiven = ipKitGiven
                ip_admission.updated_by = created_by
                # ip_admission.created_at = selectedDate

                ip_admission.save()
               
                create_or_update_referral(is_referral,ReferralSource,referral_doctor_instance,register_type,register_Id,ip_details,created_by)
               
                return JsonResponse({'success': 'IP Patient Detials Updated Successfully'})
            else:    

                prevadmission = MCI_Patient_IP_Registration_Detials.objects.filter(
                        PatientId = patient,
                        Status__in = ['Pending','Admitted']
            
                            ).order_by('-created_at').first()

                if  prevadmission:
        
                        datalist = [{
                        'Doctor' : prevadmission.PrimaryDoctor.Doctor_ID if prevadmission.PrimaryDoctor else None,
                        'DoctorName' : f"""{prevadmission.PrimaryDoctor.Tittle.Title_Name}.{prevadmission.PrimaryDoctor.First_Name}""",
                        'Specialization' : prevadmission.Specialization.Speciality_Name if prevadmission.Specialization else None
                        }]
            
                        return JsonResponse({
                            'warn': f"The Patient Already Admitted in {prevadmission.Specialization.Speciality_Name}"
                        })
               
                print('NewwwwwReggggg')
                Patient_IP = MCI_Patient_IP_Registration_Detials.objects.create(
                    PatientId = patient_ins,
                    Specialization=specialization_instance,
                    PrimaryDoctor=doctor_name_instance,
                    Complaint=complaint,
                    IsMLC=is_mlc,
                    # Flagging=Flagging_instance,
                    IsReferral=is_referral,
                    # ReferralSource=ReferralSource,
                    # ReferredBy=ReferredBy,
                    PatientCategory = patient_category,
                    InsuranceName = Insurance_instance,
                    InsuranceType = insurance_type,
                    ClientName = Client_instance,
                    ClientType = client_type,
                    ClientEmployeeId = client_employee_id,
                    ClientEmployeeDesignation = client_employee_designation,
                    ClientEmployeeRelation = client_employee_relation,
                   
                    CorporateName = Corporate_instance,
                    CorporateType = CorporateType,
                    CorporateEmployeeId = CorporateEmployeeId,
                    CorporateEmployeeDesignation = CorporateEmployeeDesignation,
                    CorporateEmployeeRelation = CorporateEmployeeRelation,
 
                    EmployeeId = employee_instance,
                    EmployeeRelation = employee_relation,
                    DoctorId = doctor_instance,
                    DoctorRelation = doctor_relation,
                    DonationType = Donation_instance,
                    created_by=created_by,
                    Location=location_instance,
                    created_at = selectedDate,
                    Status = 'Admitted',
                    Booking_Status = 'Occupied'
 
                )
                print('333333333333333333')


                patient_details = MCI_Patient_Detials.objects.get(PatientNo=patient)
                patient_details.Status = 'Registered'
                patient_details.save()

               

                
                try:
 
                    visitDate = None if visitDate == '' else visitDate
                    visitTime = None if visitTime == '' else visitTime
 
                   
               
                    MCI_Patient_Admission_Detials.objects.create(
                        IP_Registration_Id = Patient_IP,
                        AdmissionPurpose = AdmissionPurpose,
                        DrInchargeAtTimeOfAdmission = DrInchargeatTimeofAdmission_instance,
                        NextToKinName = NexttokinName,
                        Relation = relation,
                        RelativePhoneNo = relativePhoneno,
                        PersonLiableForPayment = personLiableforpayment,
                        PersonLiablecontactno = PersonLiablecontactno,
                        visitDate = visitDate,
                        visitTime = visitTime,
                        FamilyHead = familyhead,
                        FamilyHeadName = familyheadName,
                        IpKitGiven = ipKitGiven,
                    )
             
                   
                except Exception as e:
                    print(f"""Error while creating Patient_Admission_Detials:""", str(e))
               




                
                print('444444444444444444')
               
                try:
                   
                    MCI_Patient_Admission_Room_Detials.objects.create(
                        RegisterType = register_type,
                        IP_Registration_Id = Patient_IP,
                        Casuality_Registration_Id = None,
                        RoomId = roomid_instance,
                        created_by=created_by,
                        Admitted_Date = Patient_IP.created_at,
                        Status = True,
                        IsStayed = True,
                        CurrentlyStayed = True
                    )

                    roomid_instance.Booking_Status = 'Occupied'
                    roomid_instance.save()

                except Exception as e:
                    print(f"""Error while creating Patient_Admission_Room_Detials:""", str(e))

                print('666666666666')
                print('666666666666',patient_ins)
                
                

                print('77777777777777777')


                create_or_update_referral(is_referral,ReferralSource,referral_doctor_instance,register_type,register_Id,Patient_IP,created_by)
               
                return JsonResponse({'success': 'Patient Admitted successfully'})
                       
        except Exception as e:
            return JsonResponse({'error': str(e)})
 




@csrf_exempt
@require_http_methods(["GET"])
def Filter_FakeIPPatient_by_Multiple_Criteria(request):
    try:
        # Fetch query parameters
        first_name = request.GET.get("FirstName", '').strip()
        phone_no = request.GET.get("PhoneNo", '').strip()
        doctor_id = request.GET.get("DoctorId", '').strip()  # Note: Currently unused
        patient_id = request.GET.get("PatientId", '').strip()
 
        # Build filter conditions
        filter_conditions = Q()
        if first_name:
            filter_conditions &= Q(PatientId__FirstName__icontains=first_name)
        if phone_no:
            filter_conditions &= Q(PatientId__PhoneNo__icontains=phone_no)
        if patient_id:
            filter_conditions &= Q(PatientId__PatientNo__icontains=patient_id)
        if doctor_id:  # Optionally include DoctorId if needed
            filter_conditions &= Q(DoctorId__DoctorId__icontains=doctor_id)  # Adjust based on Doctor_Personal_Form_Detials model
 
        # Query the database
        registration = MCI_Patient_IP_Registration_Detials.objects.filter(filter_conditions,Status='Admitted').values(
            'IPNo',
            'PatientId__PatientNo',
            'PatientId__PhoneNo',
            'PatientId__FirstName',
            'PatientId__UniqueIdNo',
            'PatientId__Age',
            'PatientId__Gender'
        ).distinct()
 
        print(registration, 'registration')
 
        seen = set()
        patient_datas = []
        for reg in registration:
            reg_id = reg.get('IPNo')
 
            if reg_id not in seen:
                seen.add(reg_id)
                patient_data = {
                    'PatientId': reg.get('PatientId__PatientNo', ''),
                    'RegistrationId': reg.get('IPNo', ''),
                    'PhoneNo': int(reg['PatientId__PhoneNo']) if reg.get('PatientId__PhoneNo') and str(reg['PatientId__PhoneNo']).isdigit() else None,
                    'FirstName': reg.get('PatientId__FirstName', ''),
                    'UniqueIdNo': reg.get('PatientId__UniqueIdNo', ''),
                    'PatientAge': f"""{reg.get('PatientId__Age','')}/{reg.get('PatientId__Gender','')}""" ,
                }
                patient_datas.append(patient_data)
 
        return JsonResponse(patient_datas, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def MRD_Room_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'dataaa')
            # Extract and validate data
            RoomId = data.get('RoomId','')
            # RoomName = data.get('RoomName')
            WardName = data.get('WardName','')
            FloorName = data.get('FloorName','')
            BlockName = data.get('BlockName','')
            BuildingName = data.get('BuildingName','')
            # RoomCharge = float(data.get('RoomCharge','0'))
            # doctorcharges = float(data.get('DoctorCharges','0'))
            # nursecharges = float(data.get('NurseCharges','0'))
            # GST_val = data.get('GST','Nill')
            Location = data.get('Location','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            RoomNo = data.get('Roomno','')
            # isAc = data.get('isAc','')
            # Acamt = data.get('Acamt','')
            # NonACamt = data.get('NonACamt','')
            
            Location_instance=None
            Building_instance=None
            Block_instance=None
            Floor_instance=None
            Ward_instance=None
            
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
            
            if BuildingName:
                Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
                
            if BlockName:
                Block_instance = Block_Master_Detials.objects.get(Block_Id = BlockName)
                
            if FloorName:
                Floor_instance = Floor_Master_Detials.objects.get(Floor_Id = FloorName)
                
            if WardName:
                Ward_instance = WardType_Master_Detials.objects.get(Ward_Id = WardName)
                
            Total_Current_Charge=0
            # if GST_val !='Nill':
            #     Total_Current_Charge=  RoomCharge + ((RoomCharge * int(GST_val)) / 100) 
            # else:
            #     Total_Current_Charge=RoomCharge
                
            if RoomId:
                if Statusedit:
                   
                    Room_instance = MCI_RoomType_Master_Detials.objects.get(pk=RoomId)
                    
                    # Check if any MCI_Room_Master_Detials records have Booking_Status not equal to "Available"
                    non_available_status_exists = MCI_Room_Master_Detials.objects.filter(
                        Room_Name=Room_instance
                    ).exclude(Booking_Status='Available').exists()

                    if non_available_status_exists:
                        # Return a warning message if any Booking_Status is not "Available"
                        return JsonResponse({'warn': "Cannot change the status because some Booking_Status in MCI_Room_Master_Detials is not 'Available'."})
                    
                    # Check if all parent statuses are True
                    parent_statuses = []
                    
                    if not Room_instance.Building_Name.Status:
                        parent_statuses.append("Building Status")
                    
                    if not Room_instance.Block_Name.Status:
                        parent_statuses.append("Block Status")
                    
                    if not Room_instance.Floor_Name.Status:
                        parent_statuses.append("Floor Status")
                    
                    if not Room_instance.Ward_Name.Status:
                        parent_statuses.append("Ward Status")
                    
                    if parent_statuses:
                        # If any parent status is False, return a warning message
                        return JsonResponse({'warn': f"Cannot change the room status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
                    
                    # If all conditions are met, toggle the room status
                    Room_instance.Status = not Room_instance.Status
                    
                    # Update related MCI_Room_Master_Detials statuses
                    MCI_Room_Master_Detials.objects.filter(Room_Name=Room_instance).update(Status=Room_instance.Status)
                    
                    # Save the changes to the database
                    Room_instance.save()
                    
                    return JsonResponse({'success': "Room status updated successfully."})
        
                else:
                    if MCI_RoomType_Master_Detials.objects.filter(Location_Name=Location_instance,Building_Name = Building_instance ,Block_Name=Block_instance,Floor_Name=Floor_instance,Ward_Name=Ward_instance,RoomNo = RoomNo).exclude(pk = RoomId).exists():
                        return JsonResponse({'warn': f"The Room Detials are already present in the name of {Ward_instance.Ward_Name} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name} and {RoomNo}"})
                    else:
                        RoomType_instance = MCI_RoomType_Master_Detials.objects.get(pk=RoomId)
                        # RoomType_instance.Room_Name = RoomName
                        RoomType_instance.Ward_Name=Ward_instance
                        RoomType_instance.Floor_Name=Floor_instance
                        RoomType_instance.Block_Name=Block_instance
                        RoomType_instance.Building_Name = Building_instance
                        RoomType_instance.Location_Name=Location_instance
                        RoomType_instance.RoomNo = RoomNo

                        RoomType_instance.save()
                        

                return JsonResponse({'success': 'Room Detials Updated successfully'})
            else:
                if MCI_RoomType_Master_Detials.objects.filter(Location_Name=Location_instance,Building_Name = Building_instance ,Block_Name=Block_instance,Floor_Name=Floor_instance,Ward_Name=Ward_instance,RoomNo = RoomNo).exists():
                        return JsonResponse({'warn': f"The Room Detials are already present in the name of {Ward_instance.Ward_Name} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name} and {RoomNo}"})
                else:
                    RoomType_instance = MCI_RoomType_Master_Detials(
                        Ward_Name=Ward_instance,
                        Floor_Name=Floor_instance,
                        Block_Name=Block_instance,
                        Building_Name = Building_instance,
                        Location_Name=Location_instance,
                        RoomNo = RoomNo,          
                        created_by=created_by
                    )
                    RoomType_instance.save()
                    return JsonResponse({'success': 'Room Detials added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            RoomType_Master = MCI_RoomType_Master_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            RoomType_Master_data = []
            for Roomtype in RoomType_Master:
                Roomtype_dict = {
                    'id': Roomtype.Room_Id,
                    # 'RoomName': Roomtype.Room_Name,
                    'Roomno' : Roomtype.RoomNo,        
                    'WardId': Roomtype.Ward_Name.Ward_Id,
                    'WardName': Roomtype.Ward_Name.Ward_Name,
                    'FloorId': Roomtype.Floor_Name.Floor_Id,
                    'FloorName': Roomtype.Floor_Name.Floor_Name,
                    'BlockId': Roomtype.Block_Name.Block_Id,
                    'BlockName': Roomtype.Block_Name.Block_Name,
                    'BuildingId': Roomtype.Building_Name.Building_Id,
                    'BuildingName': Roomtype.Building_Name.Building_Name,
                    'Location_Name': Roomtype.Location_Name.Location_Name,
                    'Location_Id': Roomtype.Location_Name.Location_Id,
                    'Status': 'Active' if Roomtype.Status else 'Inactive',
                    'created_by': Roomtype.created_by,
                    
                }
                RoomType_Master_data.append(Roomtype_dict)

            return JsonResponse(RoomType_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)


@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def MRD_Room_Master_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'dataaa')
 
            # Extract and validate data
            RoomMasterId = data.get('RoomMasterId', '')
            RoomNo = data.get('RoomNo')
            Room_Id = data.get('Roomid','')
            BedNo = data.get('BedNo')
            BedCount = data.get('BedCount','')
            # NOB = data.get('NOB','')
            WardName = data.get('WardName', '')
            FloorName = data.get('FloorName', '')
            BlockName = data.get('BlockName', '')
            BuildingName = data.get('BuildingName', '')
            Location = data.get('Location', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
 
            # Fetch related instances
            Location_instance = Location_Detials.objects.filter(Location_Id=Location).first()  if Location else None
            Building_instance = Building_Master_Detials.objects.filter(Building_Id=BuildingName).first()  if BuildingName else None
            Block_instance = Block_Master_Detials.objects.filter(Block_Id=BlockName).first()  if BlockName else None
            Floor_instance = Floor_Master_Detials.objects.filter(Floor_Id=FloorName).first()  if FloorName else None
            Ward_instance = MCI_RoomType_Master_Detials.objects.filter(Room_Id=RoomNo).first() if WardName else None           
            print(Ward_instance)
 
            if RoomMasterId:
                if Statusedit:
                    Room_master_instance = MCI_Room_Master_Detials.objects.get(pk=RoomMasterId)
 
                    # Ensure Booking_Status is 'Available'
                    if Room_master_instance.Booking_Status != 'Available':
                        return JsonResponse({'warn': "Cannot change the status because the Booking_Status is not 'Available'."})
 
                    # Validate parent statuses
                    parent_statuses = []
                    if not Room_master_instance.Building_Name.Status:
                        parent_statuses.append("Building Status")
                    if not Room_master_instance.Block_Name.Status:
                        parent_statuses.append("Block Status")
                    if not Room_master_instance.Floor_Name.Status:
                        parent_statuses.append("Floor Status")
                    if not Room_master_instance.Ward_Name.Status:
                        parent_statuses.append("Ward Status")
 
                    if parent_statuses:
                        return JsonResponse({'warn': f"Cannot change the room status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
 
                    # Toggle the status
                    Room_master_instance.Status = not Room_master_instance.Status
                    Room_master_instance.save()
 
                    return JsonResponse({'success': "Room status updated successfully."})
                else:
                    # Validate uniqueness of Room Master Details
 
                    Room_master_instance = MCI_Room_Master_Detials.objects.get(pk=RoomMasterId)
 
                    existing_beds = MCI_Room_Master_Detials.objects.filter(
                        Location_Name=Location_instance,
                        Building_Name=Building_instance,
                        Block_Name=Block_instance,
                        Floor_Name=Floor_instance,
                        Ward_Name=Ward_instance,
                    ).exclude(pk=RoomMasterId)
                   
                    existing_bed_indices = [int(bed.Bed_No) for bed in existing_beds if bed.Bed_No.isdigit()]
 
                    current_bed_count = len(existing_bed_indices)
                    max_bed_index = max(existing_bed_indices, default=0)
 
                    bedincins = MCI_Room_Master_Detials.objects.filter(Ward_Name=Room_master_instance.Ward_Name)
 
                    for bci in bedincins:
 
                        bci.NOB = str(BedCount)
                        bci.save()
 
                    if int(BedCount) < current_bed_count:
                        return JsonResponse({'warn': f'Cannot reduce BedCount to {BedCount}. There are already {current_bed_count} beds.'})
                   
                    # Room_master_instance.NOB = str(BedCount)
                    # Room_master_instance.Bed_No = str(max_bed_index + 1)  
                    # Room_master_instance.Ward_Name = Ward_instance
                    # Room_master_instance.Floor_Name = Floor_instance
                    # Room_master_instance.Block_Name = Block_instance
                    # Room_master_instance.Building_Name = Building_instance
                    # Room_master_instance.Location_Name = Location_instance
                    # # Room_master_instance.Status = Statusedit
                    # Room_master_instance.created_by = created_by
                    # Room_master_instance.save()
 
                    new_beds = []
                    for bed_index in range(max_bed_index + 1, int(BedCount) + 1):
                        bed_no = str(bed_index)
                   
                        # Skip if this is the Bed_No being updated in the main instance
                        if bed_no == Room_master_instance.Bed_No:
                            continue
 
                        # Check for duplicate bed number
                        if MCI_Room_Master_Detials.objects.filter(
                            Bed_No=bed_no,
                            Location_Name=Location_instance,
                            Building_Name=Building_instance,
                            Block_Name=Block_instance,
                            Floor_Name=Floor_instance,
                            Ward_Name=Ward_instance
                        ).exists():
                            return JsonResponse({'warn': f"Bed {bed_no} already exists."})
 
                        # Create new bed record
                        new_beds.append(
                            MCI_Room_Master_Detials(
                                Bed_No=bed_no,
                                NOB=str(BedCount),
                                Location_Name=Location_instance,
                                Building_Name=Building_instance,
                                Block_Name=Block_instance,
                                Floor_Name=Floor_instance,
                                Ward_Name=Ward_instance,
                                Status=True,
                                Booking_Status='Available',
                                created_by=created_by
                            )
                        )
 
                    # Bulk create new beds
                    if new_beds:
                        MCI_Room_Master_Detials.objects.bulk_create(new_beds)
 
                    return JsonResponse({
                        'success': f'Room Master Details updated successfully. {len(new_beds)} new beds created.'
                    })
 
 
                #     if MCI_Room_Master_Detials.objects.filter(
                #         # Room_No=RoomNo,
                #         Bed_No=BedNo,
                #         Location_Name=Location_instance,
                #         Building_Name=Building_instance,
                #         Block_Name=Block_instance,
                #         Floor_Name=Floor_instance
                #     ).exclude(pk=RoomMasterId).exists():
                #         return JsonResponse({'warn': f"The Room Master Detials are already present in the name of {RoomNo} and {BedNo}."})
                #     else:
                #         # Update the Room Master details
                #         Room_master_instance = MCI_Room_Master_Detials.objects.get(pk=RoomMasterId)
                #         # Room_master_instance.Room_No = RoomNo
                #         Room_master_instance.Bed_No = BedNo
                #         Room_master_instance.Ward_Name = Ward_instance
                #         Room_master_instance.Floor_Name = Floor_instance
                #         Room_master_instance.Block_Name = Block_instance
                #         Room_master_instance.Building_Name = Building_instance
                #         Room_master_instance.Location_Name = Location_instance
                #         Room_master_instance.save()
 
                # return JsonResponse({'success': 'Room Master Detials Updated successfully'})
           
            else:
                # Validate uniqueness of Room Master Details
                # if MCI_Room_Master_Detials.objects.filter(
                #     # Room_No=RoomNo,
                #     Bed_No=BedNo,
                #     Location_Name=Location_instance,
                #     Building_Name=Building_instance,
                #     Block_Name=Block_instance,
                #     Floor_Name=Floor_instance
                # ).exists():
                #     return JsonResponse({'warn': f"The Room Master Detials are already present in the name of {RoomNo} and {BedNo}."})
                if BedNo:
                 pass
                else:
                    # Create a new Room Master instance
 
                    if BedCount == '1':
 
                        print('one')
 
                        Room_master_instance = MCI_Room_Master_Detials(
                            # Room_No=RoomNo,
                            NOB = BedCount,
                            Bed_No=RoomNo,
                            Ward_Name=Ward_instance,
                            Floor_Name=Floor_instance,
                            Block_Name=Block_instance,
                            Building_Name=Building_instance,
                            Location_Name=Location_instance,
                            created_by=created_by
                        )
                        Room_master_instance.save()
                        return JsonResponse({'success': 'Room Master Detials added successfully'})
 
 
                 
                    for i in range(1, int(BedCount) + 1):
                        # bedno = f"{RoomNo} / {str(i)}"
                        bedno = f"{str(i)}"
                        print(bedno)
 
                        if MCI_Room_Master_Detials.objects.filter(
                            # Room_No=RoomNo,
                            Bed_No=bedno,
                            Location_Name=Location_instance,
                            Building_Name=Building_instance,
                            Block_Name=Block_instance,
                            Floor_Name=Floor_instance,
                            Ward_Name = Ward_instance,
                        ).exists():
                            return JsonResponse({'warn': f"The Room Master Detials are already present in the name of {RoomNo} and {bedno}."})
 
                   
                        Room_master_instance = MCI_Room_Master_Detials(
                            # Room_No=RoomNo,
                            NOB = BedCount,
                            Bed_No=bedno,
                            Ward_Name=Ward_instance,
                            Floor_Name=Floor_instance,
                            Block_Name=Block_instance,
                            Building_Name=Building_instance,
                            Location_Name=Location_instance,
                            created_by=created_by
                        )
                        Room_master_instance.save()
                    return JsonResponse({'success': 'Room Master Detials added successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
       
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            # Room_master_instance = MCI_Room_Master_Detials.objects.all().order_by(
            #     'Location_Name__Location_Name',
            #     'Building_Name__Building_Name',
            #     'Block_Name__Block_Name',
            #     'Floor_Name__Floor_Name',
            #     'Ward_Name__Ward_Name',
            #     # '-Room_Name__Room_Name',
            #     # 'Room_No',
            #     'Bed_No',
            #     )
           
            Room_master_instance = MCI_Room_Master_Detials.objects.all().order_by(
                'Ward_Name__RoomNo',
            )
 
            print(Room_master_instance,'Room_master_instance')
           
            # Construct a list of dictionaries containing location data
            Room_Master_data = []
            for Roommaster in Room_master_instance:
                RoomMaster_dict = {
                    'id': Roommaster.Room_Id,
                    'RoomNo': Roommaster.Ward_Name.RoomNo,
                    'BedNo': Roommaster.Bed_No,
                    'RoomId': Roommaster.Room_Id,
                    # 'RoomName': Roommaster.Ward_Name.RoomNo,
                    # 'BedCharge': Roommaster.Ward_Name.Current_Charge,
                    'NOB': Roommaster.NOB,
                   # 'GST': Roommaster.Ward_Name.GST_Charge,
                    # 'TotalCharge': Roommaster.Ward_Name.Total_Current_Charge,
                    'WardId': Roommaster.Ward_Name.Ward_Name.Ward_Id,
                    'WardName': Roommaster.Ward_Name.Ward_Name.Ward_Name,
                    'FloorId': Roommaster.Floor_Name.Floor_Id,
                    'FloorName': Roommaster.Floor_Name.Floor_Name,
                    'BlockId': Roommaster.Block_Name.Block_Id,
                    'BlockName': Roommaster.Block_Name.Block_Name,
                    'BuildingId': Roommaster.Building_Name.Building_Id,
                    'BuildingName': Roommaster.Building_Name.Building_Name,
                    'LocationName': Roommaster.Location_Name.Location_Name,
                    'LocationId': Roommaster.Location_Name.Location_Id,
                    'Status': 'Active' if Roommaster.Status else 'Inactive',
                    'created_by': Roommaster.created_by,
                   
                }
                Room_Master_data.append(RoomMaster_dict)
 
            return JsonResponse(Room_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)
 
 

