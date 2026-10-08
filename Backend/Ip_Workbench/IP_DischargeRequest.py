from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.db.models import Q
from django.views.decorators.http import require_GET






@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_DischargeRequest_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data,'dataaaaaaaaaa')
            RegistrationId = data.get("RegistrationId")
            Speciality = data.get("Speciality")
            DoctorName = data.get('DoctorName')
            SisterIncharge = data.get('SisterIncharge')
            Reason = data.get('Reason')
            Remarks = data.get('Remarks')
            
            createdby = data.get("Createdby")
            
            # Get the Patient_IP_Registration_Detials instance
            if RegistrationId:
                registration_ins = Patient_IP_Registration_Detials.objects.get(Registration_Id=RegistrationId)
            else:
                return JsonResponse({'error': 'RegistrationId is required'})
            
            # Check for existing discharge request
            if IP_DischargeRequest_Details.objects.filter(Registration_Id=registration_ins).exists():
                return JsonResponse({'error': 'This Patient Already Discharge Requested'})

            if DoctorName:
                doc_ins =Doctor_ProfessForm_Detials.objects.get(Doctor_ID__pk = DoctorName)
            
           
            DischargeRequest_instance = IP_DischargeRequest_Details(
                Registration_Id=registration_ins,
                SisterIncharge=SisterIncharge,
                Reason=Reason,
                Remarks=Remarks,
                Doctor_Id=doc_ins,
                Created_by=createdby,
            )
            DischargeRequest_instance.save()
        
            return JsonResponse({'success': 'DischargeRequest details saved successfully'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient IP registration details not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == 'GET':
        try:

            RegistrationId = request.GET.get('RegistrationId')
            
            DischargeRequest_details = IP_DischargeRequest_Details.objects.filter(BillingStatus='Pending')
            # DischargeRequest_details = IP_DischargeRequest_Details.objects.filter(Registration_Id__pk=RegistrationId)
            # DischargeRequest_details = IP_DischargeRequest_Details.objects.filter(Registration_Id=RegistrationId)
            print(DischargeRequest_details,'DischargeRequest_details start')
           
            DischargeRequest_details_data = []
            for idx, DischargeRequest in enumerate(DischargeRequest_details, start=1):
                # Manually serialize related objects (e.g., Patient, Doctor)

                try:
                    patient = DischargeRequest.Registration_Id.PatientId
                    doctor = DischargeRequest.Doctor_Id
                    primary_doctor = DischargeRequest.Registration_Id.PrimaryDoctor

                    DischargeRequest_dict = {
                        'id': idx,
                        'RegistrationId': DischargeRequest.Registration_Id.pk,
                        'PatientId': patient.pk if patient else "",
                        'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else "",
                        # 'VisitId': DischargeRequest.Registration_Id.VisitId,
                        'PhoneNo': patient.PhoneNo if patient else "",
                        'Status': DischargeRequest.Registration_Id.Status,
                        'PrimaryDoctorId': primary_doctor.Doctor_ID if primary_doctor else "",
                        'PrimaryDoctorName': primary_doctor.ShortName if primary_doctor else "",
                        'Speciality': doctor.Specialization.Speciality_Name if doctor and doctor.Specialization else "",
                        'DoctorName': doctor.Doctor_ID.ShortName if doctor else "",
                        'SisterIncharge': DischargeRequest.SisterIncharge,
                        'Reason': DischargeRequest.Reason,
                        'Remarks': DischargeRequest.Remarks,
                        'Lab': DischargeRequest.Lab,
                        'Radiology': DischargeRequest.Radiology,
                        'Billing': DischargeRequest.Billing,
                        'Pharmacy': DischargeRequest.Pharmacy,
                        
                        'LabStatus': DischargeRequest.LabStatus,
                        'RadiologyStatus': DischargeRequest.RadiologyStatus,
                        'BillingStatus': DischargeRequest.BillingStatus,
                        'PharmacyStatus': DischargeRequest.PharmacyStatus,
                        
                        'CurrLabDate': DischargeRequest.LabDateTime.strftime('%d-%m-%Y') if DischargeRequest.LabDateTime else "",
                        'CurrLabTime': DischargeRequest.LabDateTime.strftime('%I:%M %p') if DischargeRequest.LabDateTime else "",
                        
                        'CurrRadiologyDate': DischargeRequest.RadiologyDateTime.strftime('%d-%m-%Y') if DischargeRequest.RadiologyDateTime else "",
                        'CurrRadiologyTime': DischargeRequest.RadiologyDateTime.strftime('%I:%M %p') if DischargeRequest.RadiologyDateTime else "",
                        
                        'CurrBillingDate': DischargeRequest.BillingDateTime.strftime('%d-%m-%Y') if DischargeRequest.BillingDateTime else "",
                        'CurrBillingTime': DischargeRequest.BillingDateTime.strftime('%I:%M %p') if DischargeRequest.BillingDateTime else "",
                        
                        'CurrPharmacyDate': DischargeRequest.PharmacyDateTime.strftime('%d-%m-%Y') if DischargeRequest.PharmacyDateTime else "",
                        'CurrPharmacyTime': DischargeRequest.PharmacyDateTime.strftime('%I:%M %p') if DischargeRequest.PharmacyDateTime else "",
                        
                        'CurrDate': DischargeRequest.created_at.strftime('%d-%m-%Y') if DischargeRequest.created_at else "",
                        'CurrTime': DischargeRequest.created_at.strftime('%I:%M %p') if DischargeRequest.created_at else "",
                        
                        'Createdby': DischargeRequest.Created_by,
                        'LabStatusCheckedBy': DischargeRequest.LabStatusCheckedBy,
                        'RadiologyStatusCheckedBy': DischargeRequest.RadiologyStatusCheckedBy,
                        'BillingStatusCheckedBy': DischargeRequest.BillingStatusCheckedBy,
                        'PharmacyStatusCheckedBy': DischargeRequest.PharmacyStatusCheckedBy,
                    
                    }
                    DischargeRequest_details_data.append(DischargeRequest_dict)

                except Exception as e:
                    print(str(e),'err')

                print("DischargeRequest_details_data:", DischargeRequest_details_data)  # Log serialized data

            # Return serialized data
            return JsonResponse(DischargeRequest_details_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})





@csrf_exempt
@require_GET
def get_discharge_request_Using_IP_Registration_details(request):
    try:
        RegistrationId = request.GET.get('RegistrationId')
        if not RegistrationId:
            return JsonResponse({'error': 'RegistrationId is required'})

        DischargeRequest_details = IP_DischargeRequest_Details.objects.filter(
            Registration_Id__Registration_Id=RegistrationId
        )

        DischargeRequest_details_data = []
        for idx, DischargeRequest in enumerate(DischargeRequest_details, start=1):
            patient = DischargeRequest.Registration_Id.PatientId
            doctor = DischargeRequest.Doctor_Id
            primary_doctor = DischargeRequest.Registration_Id.PrimaryDoctor

           
            DischargeRequest_dict = {
                'id': idx,
                'RegistrationId': DischargeRequest.Registration_Id.pk,
                'PatientId': patient.pk if patient else "",
                'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else "",
                # 'VisitId': DischargeRequest.Registration_Id.VisitId,
                'PhoneNo': patient.PhoneNo if patient else "",
                'Status': DischargeRequest.Registration_Id.Status,
                'PrimaryDoctorId': primary_doctor.Doctor_ID if primary_doctor else "",
                'PrimaryDoctorName': primary_doctor.ShortName if primary_doctor else "",
                'Speciality': doctor.Specialization.Speciality_Name if doctor and doctor.Specialization else "",
                'DoctorName': doctor.Doctor_ID.ShortName if doctor else "",
                'SisterIncharge': DischargeRequest.SisterIncharge,
                'Reason': DischargeRequest.Reason,
                'Remarks': DischargeRequest.Remarks,
                'Lab': DischargeRequest.Lab,
                'Radiology': DischargeRequest.Radiology,
                'Billing': DischargeRequest.Billing,
                'Pharmacy': DischargeRequest.Pharmacy,

                'LabStatus': DischargeRequest.LabStatus,
                'RadiologyStatus': DischargeRequest.RadiologyStatus,
                'BillingStatus': DischargeRequest.BillingStatus,
                'PharmacyStatus': DischargeRequest.PharmacyStatus,
                
                'CurrLabDate': DischargeRequest.LabDateTime.strftime('%d-%m-%y') if DischargeRequest.LabDateTime else "",
                'CurrLabTime': DischargeRequest.LabDateTime.strftime('%I:%M %p') if DischargeRequest.LabDateTime else "",
                
                'CurrRadiologyDate': DischargeRequest.RadiologyDateTime.strftime('%d-%m-%y') if DischargeRequest.RadiologyDateTime else "",
                'CurrRadiologyTime': DischargeRequest.RadiologyDateTime.strftime('%I:%M %p') if DischargeRequest.RadiologyDateTime else "",
                
                'CurrBillingDate': DischargeRequest.BillingDateTime.strftime('%d-%m-%y') if DischargeRequest.BillingDateTime else "",
                'CurrBillingTime': DischargeRequest.BillingDateTime.strftime('%I:%M %p') if DischargeRequest.BillingDateTime else "",
                
                'CurrPharmacyDate': DischargeRequest.PharmacyDateTime.strftime('%d-%m-%y') if DischargeRequest.PharmacyDateTime else "",
                'CurrPharmacyTime': DischargeRequest.PharmacyDateTime.strftime('%I:%M %p') if DischargeRequest.PharmacyDateTime else "",
                    
                'CurrDate': DischargeRequest.created_at.strftime('%d-%m-%y') if DischargeRequest.created_at else "",
                'CurrTime': DischargeRequest.created_at.strftime('%I:%M %p') if DischargeRequest.created_at else "",
                
                'Createdby': DischargeRequest.Created_by,
                'LabStatusCheckedBy': DischargeRequest.LabStatusCheckedBy,
                'RadiologyStatusCheckedBy': DischargeRequest.RadiologyStatusCheckedBy,
                'BillingStatusCheckedBy': DischargeRequest.BillingStatusCheckedBy,
                'PharmacyStatusCheckedBy': DischargeRequest.PharmacyStatusCheckedBy,
                
            }
            DischargeRequest_details_data.append(DischargeRequest_dict)
            print("DischargeRequest_details_data:", DischargeRequest_details_data)  # Log serialized data

        return JsonResponse(DischargeRequest_details_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_DischargeCancel_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data,'dataaaaaaaaaa')
            RegistrationId = data.get("RegistrationId")
            Speciality = data.get("Speciality")
            DoctorName = data.get('DoctorName')
            SisterIncharge = data.get('SisterIncharge')
            Reason = data.get('Reason')
            Remarks = data.get('Remarks')
            
            createdby = data.get("Createdby")
            
            # Get the Patient_IP_Registration_Detials instance
            if RegistrationId:
                registration_ins = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
            else:
                return JsonResponse({'error': 'RegistrationId is required'})
            
            if DoctorName:
                doc_ins =Doctor_ProfessForm_Detials.objects.get(Doctor_ID__pk = DoctorName)
            # Save DischargeRequest details
            DischargeRequest_instance = IP_DischargeRequest_Details(
                Registration_Id=registration_ins,
                SisterIncharge=SisterIncharge,
                Reason=Reason,
                Remarks=Remarks,
                Doctor_Id=doc_ins,
                Created_by=createdby,
            )
            DischargeRequest_instance.save()
            
            return JsonResponse({'success': 'DischargeRequest details saved successfully'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient IP registration details not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == 'GET':
        try:

            RegistrationId = request.GET.get('RegistrationId')
            
            DischargeRequest_details = IP_DischargeRequest_Details.objects.all()
            # DischargeRequest_details = IP_DischargeRequest_Details.objects.filter(Registration_Id__pk=RegistrationId)
            # DischargeRequest_details = IP_DischargeRequest_Details.objects.filter(Registration_Id=RegistrationId)
            print(DischargeRequest_details,'DischargeRequest_details')
           
            DischargeRequest_details_data = []
            for idx, DischargeRequest in enumerate(DischargeRequest_details, start=1):
                # Manually serialize related objects (e.g., Patient, Doctor)
                patient = DischargeRequest.Registration_Id.PatientId
                doctor = DischargeRequest.Doctor_Id
                primary_doctor = DischargeRequest.Registration_Id.PrimaryDoctor

                DischargeRequest_dict = {
                    'id': idx,
                    'RegistrationId': DischargeRequest.Registration_Id.pk,
                    'PatientId': patient.pk if patient else "",
                    'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}" if patient else "",
                    # 'VisitId': DischargeRequest.Registration_Id.VisitId,
                    'PhoneNo': patient.PhoneNo if patient else "",
                    'Status': DischargeRequest.Registration_Id.Status,
                    'PrimaryDoctorId': primary_doctor.Doctor_ID if primary_doctor else "",
                    'PrimaryDoctorName': primary_doctor.ShortName if primary_doctor else "",
                    'Speciality': doctor.Specialization.Speciality_Name if doctor and doctor.Specialization else "",
                    'DoctorName': doctor.Doctor_ID.ShortName if doctor else "",
                    'SisterIncharge': DischargeRequest.SisterIncharge,
                    'Reason': DischargeRequest.Reason,
                    'Remarks': DischargeRequest.Remarks,
                    'Lab': DischargeRequest.Lab,
                    'Radiology': DischargeRequest.Radiology,
                    'Billing': DischargeRequest.Billing,
                    'LabStatus': DischargeRequest.LabStatus,
                    'RadiologyStatus': DischargeRequest.RadiologyStatus,
                    'BillingStatus': DischargeRequest.BillingStatus,
                    
                    'CurrLabDate': DischargeRequest.LabDateTime.strftime('%d-%m-%y') if DischargeRequest.LabDateTime else "",
                    'CurrLabTime': DischargeRequest.LabDateTime.strftime('%I:%M %p') if DischargeRequest.LabDateTime else "",
                    
                    'CurrRadiologyDate': DischargeRequest.RadiologyDateTime.strftime('%d-%m-%y') if DischargeRequest.RadiologyDateTime else "",
                    'CurrRadiologyTime': DischargeRequest.RadiologyDateTime.strftime('%I:%M %p') if DischargeRequest.RadiologyDateTime else "",
                    
                    'CurrBillingDate': DischargeRequest.BillingDateTime.strftime('%d-%m-%y') if DischargeRequest.BillingDateTime else "",
                    'CurrBillingTime': DischargeRequest.BillingDateTime.strftime('%I:%M %p') if DischargeRequest.BillingDateTime else "",
                    
                    'CurrDate': DischargeRequest.created_at.strftime('%d-%m-%y') if DischargeRequest.created_at else "",
                    'CurrTime': DischargeRequest.created_at.strftime('%I:%M %p') if DischargeRequest.created_at else "",
                    'Createdby': DischargeRequest.Created_by,
                
                }
                DischargeRequest_details_data.append(DischargeRequest_dict)
                print("DischargeRequest_details_data:", DischargeRequest_details_data)  # Log serialized data

            # Return serialized data
            return JsonResponse(DischargeRequest_details_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(['POST'])
def Update_DischargeRequest_Details(request):
    try:
        data = json.loads(request.body)

        print(data,'data----------')
        RegistrationId = data.get("RegistrationId")
        Labvalue = data.get("Labvalue")
        Radiologyvalue = data.get("Radiologyvalue")
        Billingvalue = data.get("Billingvalue")
        Pharmacyvalue = data.get("Pharmacyvalue")
        LabStatus = data.get("LabStatus")
        RadiologyStatus = data.get("RadiologyStatus")
        BillingStatus = data.get("BillingStatus")
        PharmacyStatus = data.get("PharmacyStatus")

        LabStatusCheckedBy = data.get("LabStatusCheckedBy")
        RadiologyStatusCheckedBy = data.get("RadiologyStatusCheckedBy")
        BillingStatusCheckedBy = data.get("BillingStatusCheckedBy")
        PharmacyStatusCheckedBy = data.get("PharmacyStatusCheckedBy")

        
        # Get the instance and update the 'Lab' field
        DischargeRequest_instances = IP_DischargeRequest_Details.objects.filter(Registration_Id=RegistrationId)
        # DischargeRequest_instance = IP_DischargeRequest_Details.objects.get(Registration_Id=RegistrationId)
        # Update Lab and LabStatus only if Labvalue and LabStatus are provided
        for DischargeRequest_instance in DischargeRequest_instances:
            if Labvalue is not None:
                DischargeRequest_instance.Lab = Labvalue

            if LabStatus is not None:
                DischargeRequest_instance.LabStatus = LabStatus
                if Labvalue == 1 and LabStatus == 'Completed':
                    DischargeRequest_instance.LabDateTime = datetime.now()
            
            if LabStatusCheckedBy is not None:
                DischargeRequest_instance.LabStatusCheckedBy = LabStatusCheckedBy

            if Radiologyvalue is not None:
                DischargeRequest_instance.Radiology = Radiologyvalue

            if RadiologyStatus is not None:
                DischargeRequest_instance.RadiologyStatus = RadiologyStatus
                if Radiologyvalue == 1 and RadiologyStatus == 'Completed':
                    DischargeRequest_instance.RadiologyDateTime = datetime.now()

            if RadiologyStatusCheckedBy is not None:
                DischargeRequest_instance.RadiologyStatusCheckedBy = RadiologyStatusCheckedBy

            if Billingvalue is not None:
                DischargeRequest_instance.Billing = Billingvalue

            if BillingStatus is not None:
                DischargeRequest_instance.BillingStatus = BillingStatus
                if Billingvalue == 1 and BillingStatus == 'Completed':
                    DischargeRequest_instance.BillingDateTime = datetime.now()
           

            if BillingStatusCheckedBy is not None:
                DischargeRequest_instance.BillingStatusCheckedBy = BillingStatusCheckedBy

            if Pharmacyvalue is not None:
                DischargeRequest_instance.Pharmacy = Pharmacyvalue

            if PharmacyStatus is not None:
                DischargeRequest_instance.PharmacyStatus = PharmacyStatus
                if Pharmacyvalue == 1 and PharmacyStatus == 'Completed':
                    DischargeRequest_instance.PharmacyDateTime = datetime.now()
            
            if PharmacyStatusCheckedBy is not None:
                DischargeRequest_instance.PharmacyStatusCheckedBy = PharmacyStatusCheckedBy


            DischargeRequest_instance.save()

        return JsonResponse({'success': 'Discharge Request Approved successfully'})
    except IP_DischargeRequest_Details.DoesNotExist:
        return JsonResponse({'error': 'DischargeRequest details not found'}, status=404)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},status=500)



@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_DischargeClearance_Details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Data:", data)

            RegistrationId = data.get("RegistrationId")
            discharge = data.get("discharge")
            dateTime = data.get("dateTime")
            VerifiedBy = data.get("VerifiedBy")
            DepartmentType = data.get("DepartmentType")
            createdby = data.get("Createdby")

            if not RegistrationId or not DepartmentType:
                return JsonResponse({'error': 'RegistrationId and DepartmentType are required'})

            # Check for existing record
            existing_record = IP_DischargeClearance.objects.filter(
                Q(Ip_Registration_Id=RegistrationId) | Q(Casuality_Registration_Id=RegistrationId),
                Q(DepartmentType=DepartmentType)
            ).exists()

            print(existing_record,'1111111111111111111111111')

            if existing_record:
                return JsonResponse({'warn': 'Discharge Clearance details already exist'})
            
            registration_ip = None
            registration_casualty = None

            # Check if patient exists in IP or Casualty Registration
            try:
                registration_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                print("Found in IP Registration")
            except Patient_IP_Registration_Detials.DoesNotExist:
                try:
                    registration_casualty = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in Casuality Registration")
                    
                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse({'error': 'No registration found for the given RegistrationId'})

            # Create new record
            DischargeClearance_instance = IP_DischargeClearance(
                Ip_Registration_Id=registration_ip,
                Casuality_Registration_Id=registration_casualty,
                discharge=discharge,
                dateTime=dateTime,
                VerifiedBy=VerifiedBy,
                DepartmentType=DepartmentType,
                Created_by=createdby,
            )
            DischargeClearance_instance.save()

            return JsonResponse({'success': 'DischargeClearance details saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')

            if not RegistrationId or not DepartmentType:
                return JsonResponse({'error': 'Both RegistrationId and DepartmentType are required'})

            # Fetch discharge record
            DischargeClearance = IP_DischargeClearance.objects.filter(
                (Q(Ip_Registration_Id__pk=RegistrationId) | Q(Casuality_Registration_Id__pk=RegistrationId)) &
                Q(DepartmentType=DepartmentType)
            ).first()

            if not DischargeClearance:
                return JsonResponse({'error': 'No discharge clearance found'})

            discharge_data = {
                'RegistrationId': DischargeClearance.Ip_Registration_Id.pk if DischargeClearance.Ip_Registration_Id else DischargeClearance.Casuality_Registration_Id.pk,
                'discharge': DischargeClearance.discharge,
                'dateTime': DischargeClearance.dateTime.strftime('%d-%m-%y %I:%M %p') if DischargeClearance.dateTime else "",
                'VerifiedBy': DischargeClearance.VerifiedBy,
                'DepartmentType': DischargeClearance.DepartmentType,
                'Createdby': DischargeClearance.Created_by,
                'CurrDate': DischargeClearance.created_at.strftime('%d-%m-%y'),
                'CurrTime': DischargeClearance.created_at.strftime('%H:%M:%S'),
            }

            return JsonResponse({'DischargeClearance': discharge_data})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import IP_DischargeRequest_Details, IP_PhysicalDischargeChecklist  # Adjust import based on your project structure
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def get_ippatient_discharge_pending_list(request):
    try:
        # Get query and pagination parameters
        query = request.GET.get('query', '').strip()
        status = request.GET.get('status', '').strip()
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 20))
 
        # Initialize search query
        search_query =  Q(BillingStatus='Completed')
 
        # Add search filters if query parameter exists
        if query:
            search_query &= (
                Q(Registration_Id__Registration_Id__icontains=query) |
                Q(Registration_Id__PatientId__PatientId__icontains=query) |
                Q(Registration_Id__PatientId__FirstName__icontains=query) |
                Q(Registration_Id__PatientId__MiddleName__icontains=query) |
                Q(Registration_Id__PatientId__SurName__icontains=query)
            )
 
        # Fetch discharge request details with prefetch to optimize queries
        discharge_requests = IP_DischargeRequest_Details.objects.filter(
            search_query
        ).select_related(
            'Registration_Id__PatientId',
            'Registration_Id__Specialization'
        )

        print(discharge_requests,'discharge_requests')
 
        # Debug: Log queryset and pagination info
        total_records = discharge_requests.count()
        print(f"Total discharge requests: {total_records}, Page: {page}, Per Page: {per_page}")
 
        # Apply pagination
        start = (page - 1) * per_page
        end = start + per_page
        discharge_requests = discharge_requests[start:end]
 
        discharge_pending_list = []
 
        for index, discharge in enumerate(discharge_requests, start=1):
            # Check if physical discharge checklist exists
            pending_checklist = IP_PhysicalDischargeChecklist.objects.filter(
                Ip_Registration_Id=discharge.Registration_Id
            ).first()
 
            # Only include records with no pending checklist
            if pending_checklist is None:
                try:
                    patient = discharge.Registration_Id.PatientId
                    # Construct full name, handling potential None values
                    full_name_parts = [
                        patient.FirstName or '',
                        patient.MiddleName or '',
                        patient.SurName or ''
                    ]
                    full_name = ''.join(part for part in full_name_parts if part).strip()
 
                    # Create response data dictionary
                    data = {
                        'SerialNo': index,  # Serial number starts at 1 for current page
                        'Registration_Id': discharge.Registration_Id.Registration_Id,
                        'PatientId': patient.PatientId,
                        'PatientName': full_name,
                        'Department': discharge.Registration_Id.Specialization.Speciality_Name if discharge.Registration_Id.Specialization else 'N/A',
                        'BillingStatus': discharge.BillingStatus,
                        'UpdatedAt': discharge.updated_at.strftime("%d-%m-%Y %I:%M %p") if discharge.updated_at else None,
                        'BillingStatusCheckedBy': discharge.BillingStatusCheckedBy
                    }
                    discharge_pending_list.append(data)
                except AttributeError as e:
                    # Log specific attribute errors for debugging
                    print(f"Attribute error processing discharge {discharge.pk}: {str(e)}")
                    continue
 
        # Debug: Log the number of pending discharges
        print(f"Total pending discharges: {len(discharge_pending_list)}")
 
        # Return response with safe=False to allow serialization of list
        return JsonResponse({
            'status': 'success',
            'data': discharge_pending_list,
            'count': len(discharge_pending_list),
            'total_records': total_records,
            'page': page,
            'per_page': per_page
        }, safe=False)
 
    except Exception as e:
        # Log the error for debugging
        print(f"An error occurred: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': 'An internal server error occurred'
        }, status=500)
 
 









