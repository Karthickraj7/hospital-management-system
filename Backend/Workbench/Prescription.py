import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from Masters.models import *
from Inventory.models import *
from OutPatient.models import *
from django.db.models import Q
# import magic
import filetype
import base64
from django.db import transaction


import json
from collections import defaultdict




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Doctor_previous_prescripion_details(request):
    if request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            if not registration_id:
                return JsonResponse({'warn': 'RegistrationId is required'}, status=400)

            try:
               
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)
            
            patient_id = registration_ins.PatientId_id
           

          
            last_registration = Patient_Appointment_Registration_Detials.objects.filter(
                PatientId=patient_id
            ).exclude(pk=registration_id).order_by('-created_at').first() 
            if last_registration:
                last_registration_id = last_registration.pk
                print('last_registration_id', last_registration_id)
            else:
                last_registration_id = None 
            

           
            prescriptions = Workbench_Prescription.objects.filter(Registration_Id = last_registration_id)
            print('prescriptions', prescriptions)
            # Initialize a dictionary to group prescriptions by 'created_by'
            grouped_prescriptions = defaultdict(list)

            # Construct a list of dictionaries containing prescription data
            for presc in prescriptions:
                doctor_ins = presc.Doctor_Id
                print('doctor_ins', presc.Doctor_Id)

            # Retrieve doctor details
                try:
                    doctor_details = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_ins.Doctor_ID)
                    print('doctor_details', doctor_details)
                except Doctor_Personal_Form_Detials.DoesNotExist:
                    doctor_details = None

                prescription_info = {
                    'id': presc.Id,
                    'RegistrationId': presc.Registration_Id.pk,
                    'VisitId': presc.Registration_Id.VisitId,
                    'PrimaryDoctorId': presc.Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': presc.Registration_Id.PrimaryDoctor.ShortName,
                    'First_Name': doctor_details.First_Name if doctor_details else None,
                    'Middle_Name': doctor_details.Middle_Name if doctor_details else None,
                    'Last_Name': doctor_details.Last_Name if doctor_details else None,
                    'GenericName': presc.GenericName,
                    'ItemName': presc.ItemName,
                    'Itemtype': presc.Itemtype,
                    'Dose': presc.Dose,
                    'Route': presc.Route,
                    'Frequency': presc.Frequency,
                    'DurationNumber': presc.DurationNumber,
                    'DurationUnit': presc.DurationUnit,
                    'Qty': presc.Qty,
                    'Instruction': presc.Instruction,
                    'created_by': presc.created_by,
                    'Date': presc.created_at.strftime('%Y-%m-%d'),  # Format date
                    'Time': presc.created_at.strftime('%H:%M:%S'),  # Format time
                }

                # Group by 'created_by'
                grouped_prescriptions[ presc.Registration_Id.PrimaryDoctor.ShortName].append(prescription_info)

            # Convert defaultdict to a regular dict if needed
            grouped_prescriptions = dict(grouped_prescriptions)

            print(grouped_prescriptions, 'Grouped Prescription Data')
            return JsonResponse(grouped_prescriptions, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)






@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Prescription_Details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'Received Data')

            # Extract related prescription data
            prescription_related_details = data.get('prescriptionRelatedDetails', {})
            doctorType = prescription_related_details.get('doctorType', '')
            doctorName = prescription_related_details.get('doctorName', '')
            remarks = prescription_related_details.get('remarks', '')
            Reason = prescription_related_details.get('Reason', '')
            IpNotes = prescription_related_details.get('IpNotes', '')
            NoOfDays = prescription_related_details.get('NoOfDays', '')
            TimeInterval = prescription_related_details.get('TimeInterval', '')
            Date = prescription_related_details.get('Date', '')
            SurgeryName = prescription_related_details.get('SurgeryName', '')
            SurgeryRequestedDate = prescription_related_details.get('SurgeryRequestedDate', '')
            AdviceNotes = prescription_related_details.get('AdviceNotes', '')
            created_by = prescription_related_details.get('created_by', '')

            registration_id = prescription_related_details.get('RegistrationId', '')
            doctor_id = prescription_related_details.get('Doctor_id', '')

            if not registration_id:
                return JsonResponse({'error': 'RegistrationId is required'})

            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

           
           
            Prescription_RelatedData_instance = Workbench_Prescription_RelatedData(
                Registration_Id=registration_ins,
                doctorType=doctorType,
                doctorName=doctorName,
                remarks=remarks,
                Reason=Reason,
                IpNotes=IpNotes,
                NoOfDays=NoOfDays,
                TimeInterval=TimeInterval,
                Date=Date,
                SurgeryName=SurgeryName,
                SurgeryRequestedDate=SurgeryRequestedDate,
                AdviceNotes=AdviceNotes,
                created_by=created_by,
            )
            Prescription_RelatedData_instance.save()

            prescriptions = data.get('prescriptionDetails', [])
            if not prescriptions:
                return JsonResponse({'error': 'No prescription data found'})
            
            
            for prescription in prescriptions:
                GenericName = prescription.get('GenericName', '')
                ItemName = prescription.get('ItemName', '')
                Itemtype = prescription.get('itemtype', '')
                Dose = prescription.get('dose', '')
                Route = prescription.get('route', '')
                Frequency = prescription.get('frequency', '')

                # Split duration into number and unit
                Duration = prescription.get('duration', '').split()
                DurationNumber = Duration[0] if len(Duration) > 0 else ''
                DurationUnit = Duration[1] if len(Duration) > 1 else ''

                Qty = prescription.get('qty', '')
                Instruction = prescription.get('instruction', '')
                
                try:
                    doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id)
                except Doctor_Personal_Form_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'Doctor not found'})

                try:
                    registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
                except Patient_Appointment_Registration_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'Patient not found'})


                # Save each prescription
                Prescription_instance = Workbench_Prescription(
                    Registration_Id=registration_ins,
                    PrescriptionId=Prescription_RelatedData_instance,
                    Doctor_Id=doctor_instance,
                    GenericName=GenericName,
                    ItemName=ItemName,
                    Itemtype=Itemtype,
                    Dose=Dose,
                    Route=Route,
                    Frequency=Frequency,
                    DurationNumber=DurationNumber,
                    DurationUnit=DurationUnit,
                    Qty=Qty,
                    Instruction=Instruction,
                    created_by=created_by,
                )
                Prescription_instance.save()

                # Save related data after prescription
            
            return JsonResponse({'success': 'Prescription details added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            print("registration_id prescription",registration_id)
            if not registration_id:
                return JsonResponse({'warn': 'RegistrationId is required'})

            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

            

            # Fetch all prescriptions associated with the registration ID
            prescriptions = Workbench_Prescription.objects.filter(Registration_Id=registration_ins).last()

            Prescription_Relatedtable = Workbench_Prescription_RelatedData.objects.filter(Registration_Id=registration_ins).last()

            grouped_prescriptions = []

            for prescription in Prescription_Relatedtable:
                prescriptionRelatedInfo = {
                    'id': prescription.Id,
                    'RegistrationId': prescription.Registration_Id.pk,
                    'DoctorShortName': prescription.Registration_Id.PrimaryDoctor.ShortName,
                    'doctorType': prescription.doctorType,
                    'doctorName': prescription.doctorName,
                    'remarks': prescription.remarks,
                    'Reason': prescription.Reason,
                    'IpNotes': prescription.IpNotes,
                    'NoOfDays': prescription.NoOfDays,
                    'TimeInterval': prescription.TimeInterval,
                    'Date': prescription.Date,
                    'SurgeryName': prescription.SurgeryName,
                    'SurgeryRequestedDate': prescription.SurgeryRequestedDate,
                    'AdviceNotes': prescription.AdviceNotes,
                    'created_by': prescription.created_by,
                    'CurrDate': prescription.created_at.strftime('%Y-%m-%d'),
                    'CurrTime': prescription.created_at.strftime('%H:%M:%S'),
                        
                    'Prescription_Data': [],
                }


                for presc in prescriptions:
                    doctor_ins = presc.Doctor_Id
                    doctor_details = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_ins.Doctor_ID).first()

                    prescription_info = {
                        'id': presc.Id,
                        'RegistrationId': presc.Registration_Id.pk,
                        'VisitId': presc.Registration_Id.VisitId,
                        'PrimaryDoctorId': presc.Registration_Id.PrimaryDoctor.Doctor_ID,
                        'PrimaryDoctorName': presc.Registration_Id.PrimaryDoctor.ShortName,
                        'First_Name': doctor_details.First_Name if doctor_details else None,
                        'Middle_Name': doctor_details.Middle_Name if doctor_details else None,
                        'Last_Name': doctor_details.Last_Name if doctor_details else None,
                        'PrescriptionId': presc.PrescriptionId.pk,
                        'GenericName': presc.GenericName,
                        'ItemName': presc.ItemName,
                        'Itemtype': presc.Itemtype,
                        'Dose': presc.Dose,
                        'Route': presc.Route,
                        'Frequency': presc.Frequency,
                        'DurationNumber': presc.DurationNumber,
                        'DurationUnit': presc.DurationUnit,
                        'Qty': presc.Qty,
                        'Instruction': presc.Instruction,
                        'created_by': presc.created_by,
                        'Date': presc.created_at.strftime('%Y-%m-%d'),
                        'Time': presc.created_at.strftime('%H:%M:%S'),
                        
                    }
                    prescriptionRelatedInfo['Prescription_Data'].append(prescription_info)
            grouped_prescriptions.append(prescriptionRelatedInfo)

                
            return JsonResponse(grouped_prescriptions, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# bharathi 




    

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Types_Link(request):
    try:
        # Get the Itemid from query parameters
        Itemid = request.GET.get('Itemid', '')
        print("Itemid:", Itemid)
        
        if not Itemid:
            return JsonResponse({'warn': 'The ItemName has no ItemType associated.'})
        
        # Filter based on Product_Detials and retrieve distinct ProductTypeName, Strength, and StrengthType
        item_names = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials__id=Itemid
        ).values(
            'Product_Detials__ProductType__ProductType_Name',  # Accessing ProductType_Name via Product_Detials
            'Product_Detials__ProductType__ProductType_Id',    # Accessing ProductType_Id via Product_Detials
            'Product_Detials__Strength',                       # Accessing Strength
            'Product_Detials__StrengthType'                    # Accessing StrengthType
        ).distinct()

        # Prepare response data with distinct ProductTypeName, ProductTypeId, and Dose
        data = [
            {
                'ProductTypeName': item['Product_Detials__ProductType__ProductType_Name'],
                # 'ProductTypeId': item['Product_Detials__ProductType__ProductType_Id'],
                'Dose': f"{item['Product_Detials__Strength']} {item['Product_Detials__StrengthType']}" 
                        if item['Product_Detials__Strength'] and item['Product_Detials__StrengthType'] else ""
            }
            for item in item_names
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        # Handle any exceptions and return an error response
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def All_Speciality_Details_Link(request):
    try:
        # Corrected typo from 'fillter' to 'filter'
        speciality_names = Speciality_Detials.objects.filter(Status=1)
        Speciality_data = []

        for speciality in speciality_names:
            speciality_dict = {
                'id': speciality.Speciality_Id,
                'Speciality_name': speciality.Speciality_Name
            }
            # Append each speciality_dict to the Speciality_data list
            Speciality_data.append(speciality_dict)


        return JsonResponse(Speciality_data, safe=False)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Refer_doctor_details(request):
    try:
        # Get parameters
        Doctortype = request.GET.get("Doctortype")
        Speciality = request.GET.get("Speciality")
        DoctorId = request.GET.get("DoctorID")

        # Ensure Doctortype is provided
        if not Doctortype:
            return JsonResponse({'warn': 'Doctortype is required'})

        # Initialize the filter condition with Doctortype
        filter_condition = Q(Doctor_ID__DoctorType=Doctortype)

        # Add Speciality filter if provided
        
        if Speciality:
            filter_condition &= Q(Specialization__Speciality_Id=Speciality)
            

        # Exclude the specific DoctorID if provided
        if DoctorId:
            filter_condition &= ~Q(Doctor_ID=DoctorId)

        # Fetch doctors based on the filter condition
        doctor_details = Doctor_ProfessForm_Detials.objects.filter(filter_condition)
        print("doctor_details",doctor_details)

        # Prepare response data
        inhouse_doctor_details = []
        for doctor in doctor_details:
            # Get associated specialty name, if available
            specialization = doctor.Specialization
            speciality_name = specialization.Speciality_Name if specialization else 'N/A'

            doctor_info = {
                'DoctorID': doctor.Doctor_ID.Doctor_ID,  # Assuming Doctor_ID is a ForeignKey
                # 'ShortName': doctor.Doctor_ID.ShortName,
                'SpecialityName': speciality_name,
                'DoctorFullName': ' '.join([
                    doctor.Doctor_ID.Tittle.Title_Name or '',
                    doctor.Doctor_ID.First_Name or '',
                    doctor.Doctor_ID.Middle_Name or '',
                    doctor.Doctor_ID.Last_Name or '',
                ]),
            }
            inhouse_doctor_details.append(doctor_info)

        # Check if any doctors were found
        if not inhouse_doctor_details:
            return JsonResponse({'warn': 'No doctors found for the provided Speciality and Doctortype'})

        # Return the response as JSON
        return JsonResponse(inhouse_doctor_details, safe=False)

    except Exception as e:
        # Log the exception
        print(f"Error: {e}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)




@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Surgery_Details_link(request):
    try:
        Speciality = request.GET.get("Speciality")
        SurgeryName = request.GET.get('Testgo', None)  # Assuming 'Testgo' is the key for surgery name in request params
        
        # Prepare a queryset for surgery names with Status=True
        surgerynames_details = SurgeryName_Details.objects.filter(Status=True)

        # Apply filters based on the request parameters
        if Speciality:
            surgerynames_details = surgerynames_details.filter(
                Speciality_Name__Speciality_Id=Speciality
            )
        if SurgeryName:
            surgerynames_details = surgerynames_details.filter(
                Surgery_Name__startswith=SurgeryName
            )

        # Prepare the response data for all filtered surgeries
        Surgeryname_data = [
            {
                'id': surgery.Surgery_Id,
                'SurgeryName': surgery.Surgery_Name,
                'Specialityname': surgery.Speciality_Name.Speciality_Name,
                'specialityid': surgery.Speciality_Name.Speciality_Id
            }
            for surgery in surgerynames_details
        ]

        # If there are filtered surgeries, return that data
        if Surgeryname_data:
            return JsonResponse(Surgeryname_data, safe=False)

        # If no filters applied, fetch distinct specialities
        distinct_specialities = SurgeryName_Details.objects.filter(Status=True).values(
            'Speciality_Name__Speciality_Id', 'Speciality_Name__Speciality_Name'
        ).distinct()

        # Prepare response data for distinct specialities
        speciality_data = [
            {
                'specialityid': speciality['Speciality_Name__Speciality_Id'],
                'Specialityname': speciality['Speciality_Name__Speciality_Name']
            }
            for speciality in distinct_specialities
        ]

        return JsonResponse(speciality_data, safe=False)

    except Exception as e:
        # Log the error and return an error response
        print(f"Error: {e}")
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)




    




@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Prescription_OPD_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            registration_id = data.get('RegistrationId', None)
            print("registration_id45",registration_id)
            patient_id = data.get('PatientId', None)
            primary_doctor_id = data.get('DoctorId', None)
            behalfofdoc = data.get('DoctorId')
            if behalfofdoc:
                behalfofdoc = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=behalfofdoc).first()
 
            print("primary_doctor_id12",primary_doctor_id)
            Visit_id = data.get('VisitId', None)
            created_by = data.get('created_by', None)
            Prescription_Id = data.get('Prescription_Id', None)
            selected_medicines = data.get('selectedMedicines', [])
            ot_request_data = data.get('otRequestData', None)
            refer_doctor_data = data.get('referDoctorData', None)
            print('refer_doctor_data--',refer_doctor_data)
            op_ip_data = data.get('opIpData', None)
            follow_up_data = data.get('followUpData', None) 
            advice_data = data.get('adviceData',None)
         
            # Validate necessary fields
            if not registration_id or not patient_id:
                return JsonResponse({'warn': 'Missing required fields'})

            # Wrap database operations in a transaction
            with transaction.atomic():
                registration_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                patient_instance = Patient_Detials.objects.get(PatientId=patient_id)

                followup_instance = None
                refer_doctor_instance = None
                ot_request_instance = None
                opto_ip_instance = None

                if advice_data or follow_up_data:
                    followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)

                if ot_request_data:
                    ot_request_instance = update_ot_request_data(ot_request_data, created_by, registration_instance, patient_instance)

                if refer_doctor_data:
                    refer_doctor_instance = update_refer_doctor_data(refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by, registration_id)

                if op_ip_data:
                    opto_ip_instance = update_op_ip_data(op_ip_data, registration_instance, patient_instance, created_by)

                if selected_medicines:
                    for medicine in selected_medicines:
                        update_selected_medicine(medicine, registration_instance, patient_instance, created_by,
                                                refer_doctor_instance, opto_ip_instance, followup_instance,
                                                Visit_id, ot_request_instance, behalfofdoc)
                else:
                    update_selected_medicine_no_prescription(registration_instance, patient_instance, created_by,
                                                            refer_doctor_instance, opto_ip_instance, followup_instance,
                                                            Visit_id, ot_request_instance, Prescription_Id, behalfofdoc)


            return JsonResponse({'success': 'Prescription Saved successfully'}, status=200)

        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Registration ID not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Patient ID not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId', None)
            print("RegistrationId",RegistrationId)
            PatientId = request.GET.get('PatientId', None)
            # print("PatientId",PatientId)
            VisitId = request.GET.get('VisitId', None)
            DoctorId = request.GET.get('DoctorId', None)

            # print("VisitId",VisitId)
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing registration ID'})

            # Fetch prescription details based on Registration ID
            prescription_details = OPD_Prescription_Details.objects.filter(
                Registration_Id__Registration_Id=RegistrationId,
                VisitId=VisitId,
                Patient_Id__PatientId=PatientId,
                
            )


            if not prescription_details.exists():
                return JsonResponse({'warn': 'No prescription details found'})

            # Prepare a dictionary to hold unique information and the list of prescription data
            response_dict = {}

            # We assume that `ReferDoctor`, `NextReviewDate`, `OptoIp`, and `OtRequest` are the same for all records, so we extract them from the first entry
            first_detail = prescription_details.last()
            doccc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.get(PrimaryDoctor__Doctor_ID=DoctorId, Registration_Id__Registration_Id=RegistrationId)
            print('docccccc',doccc_ins)
            if not doccc_ins.PrimaryDoctor.Doctor_ID:
                print("PrimaryDoctor is None")
            else:
                print("PrimaryDoctor exists:", doccc_ins.PrimaryDoctor.Doctor_ID)

            # Registration and primary doctor information
            indexx = 1
            registration_info = {
                'Id': indexx, 
                'Prescriptionid':first_detail.pk,
                'Registration_Id': first_detail.Registration_Id.pk,  # Same Registration_Id for all records
                'Primarydoctorname': doccc_ins.PrimaryDoctor.ShortName if doccc_ins.PrimaryDoctor.ShortName else "No Primary Doctor",
                'Patient_Id':first_detail.Patient_Id.PatientId,
                'VisitId':first_detail.VisitId,
                'Status':first_detail.Status,
                'Date': first_detail.created_at.strftime('%Y-%m-%d'),
                'Time': first_detail.created_at.strftime('%H:%M:%S'),# Same doctor for all records
            }

           

            responsedata = []
            prescription_list = []
            index = 1
            for detail in prescription_details:
           
                # Prescription data list
                
                prescription_data = {
                    'Id':index,
                    'Registration_Id':first_detail.Registration_Id.pk,
                    'Patient_Id':detail.Patient_Id.PatientId,
                    'VisitId':detail.VisitId,
                    'DoctorShortName': doccc_ins.PrimaryDoctor.ShortName if doccc_ins.PrimaryDoctor.ShortName else "No Primary Doctor",
                    'ItemId': detail.ItemId.pk if detail.ItemId else None,
                    'ItemType':detail.ItemId.ProductType.ProductType_Name if detail.ItemId else None,
                    'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                    'FrequencyId': detail.FrequencyId.pk if detail.FrequencyId else None,
                    'FrequencyName': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                    'FrequencyType': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                    'Frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                    'Prescription_Id': detail.Prescription_Id,
                    'Dosage': detail.Dosage if detail.Dosage else None,
                    'Route':detail.Route if detail.Route else None,
                    'DurationNumber': detail.DurationNumber if detail.DurationNumber else None,
                    'DurationUnit': detail.DurationUnit  if detail.DurationUnit else None,
                    'Frequencys': detail.Frequency if detail.Frequency else None,
                    'Qty': detail.Qty if detail.Qty else None,
                    'Instruction': detail.Instruction if detail.Instruction else None,
                    'created_by': detail.created_by,
                    'Status': detail.Status,
                    'Date': detail.created_at.strftime('%Y-%m-%d'),
                    'Time': detail.created_at.strftime('%H:%M:%S'),
                    'Status':detail.Status 
                }
               

                # Append item details and prescription data together
                prescription_list.append({
                    
                    'prescription_data': prescription_data
                })
                index += 1 

            # Combine everything into a response dictionary
            response_dict = {
                'registration_info': registration_info,
                'prescriptions': prescription_list
            }
            responsedata.append(response_dict)

            # Return the response dictionary
            return JsonResponse(responsedata, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Prescription_OPD_Details_link_OPDRECEPTION(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # print(data)
            # print(data.keydata)
            keydata = data.get('keydata')
            print(keydata)
            registration_id = keydata.get('registrationid', None)
            print("registration_id45",registration_id)
            patient_id = keydata.get('PatientId', None)
            primary_doctor_id = keydata.get('primary_doctor_id', None)
            print("primary_doctor_id12",primary_doctor_id)
            DoctorId = data.get('behalfdoc',None)
            print(DoctorId,'DoctorId')
            Visit_id = keydata.get('VisitId', None)
            created_by = keydata.get('created_by', None)
            selected_medicines = data.get('selectedMedicines', [])
            ot_request_data = data.get('otRequestData', None)
            refer_doctor_data = data.get('referDoctorData', None)
            op_ip_data = data.get('opIpData', None)
            follow_up_data = data.get('followUpData', None) 
            advice_data = data.get('adviceData',None)

            print(selected_medicines,'selected_medicines')

         
            # Validate necessary fields
            if not registration_id or not patient_id:
                return JsonResponse({'warn': 'Missing required fields'})

            # Wrap database operations in a transaction
            with transaction.atomic():
                registration_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                patient_instance = Patient_Detials.objects.get(PatientId=patient_id)
                behalfofdoc = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()
                ot_request_instance = None
                refer_doctor_instance = None
                followup_instance = None
                opto_ip_instance = None
            # Check if both follow_up_data and advice_data are present
                # if follow_up_data and advice_data:
                #     print("loosu")
                #     followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)
                # elif advice_data and not follow_up_data:
                #     print("apple")
                #     followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)
                # elif follow_up_data and not advice_data:
                #     print("orange",followup_instance)
                #     followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)
                # if ot_request_data:
                #     ot_request_instance=update_ot_request_data(ot_request_data, created_by, registration_instance, patient_instance)
                   
                # if refer_doctor_data:
                #     refer_doctor_instance=update_refer_doctor_data(refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registration_id)
                    
                # if op_ip_data:
                #     opto_ip_instance=update_op_ip_data(op_ip_data, registration_instance, patient_instance,created_by)
                  

                for medicine in selected_medicines:
                    
                    update_selected_medicine1(medicine, registration_instance, patient_instance, created_by, refer_doctor_instance, opto_ip_instance, followup_instance, Visit_id, ot_request_instance,behalfofdoc)
            return JsonResponse({'success': 'Prescription Saved successfully'}, status=200)

        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Registration ID not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Patient ID not found'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            RegistrationId = request.GET.get('RegistrationId', None)
            # print("RegistrationId",RegistrationId)
            PatientId = request.GET.get('PatientId', None)
            # print("PatientId",PatientId)
            VisitId = request.GET.get('VisitId', None)
            # print("VisitId",VisitId)
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing registration ID'})

            # Fetch prescription details based on Registration ID
            prescription_details = OPD_Prescription_Details.objects.filter(
                Registration_Id__id=RegistrationId,
                VisitId=VisitId,
                Patient_Id__PatientId=PatientId,
                
            )


            if not prescription_details.exists():
                return JsonResponse({'warn': 'No prescription details found'})

            # Prepare a dictionary to hold unique information and the list of prescription data
            response_dict = {}

            # We assume that `ReferDoctor`, `NextReviewDate`, `OptoIp`, and `OtRequest` are the same for all records, so we extract them from the first entry
            first_detail = prescription_details.last()
            if not first_detail.Registration_Id.PrimaryDoctor:
                print("PrimaryDoctor is None")
            else:
                print("PrimaryDoctor exists:", first_detail.Registration_Id.PrimaryDoctor)

            # Registration and primary doctor information
            indexx = 1
            registration_info = {
                'Id': indexx, 
                'Prescriptionid':first_detail.pk,
                'Registration_Id': first_detail.Registration_Id.pk,  # Same Registration_Id for all records
                'Primarydoctorname': first_detail.Registration_Id.PrimaryDoctor.ShortName if first_detail.Registration_Id.PrimaryDoctor and first_detail.Registration_Id.PrimaryDoctor.ShortName else "No Primary Doctor",
                'Patient_Id':first_detail.Patient_Id.PatientId,
                'VisitId':first_detail.VisitId,
                'Status':first_detail.Status,
                'Date': first_detail.created_at.strftime('%Y-%m-%d'),
                'Time': first_detail.created_at.strftime('%H:%M:%S'),# Same doctor for all records
            }

           

            responsedata = []
            prescription_list = []
            index = 1
            for detail in prescription_details:
           
                # Prescription data list
                
                prescription_data = {
                    'Id':index,
                    'Registration_Id':first_detail.Registration_Id.pk,
                    'Patient_Id':detail.Patient_Id.PatientId,
                    'VisitId':detail.VisitId,
                    'DoctorShortName': first_detail.Registration_Id.PrimaryDoctor.ShortName if first_detail.Registration_Id.PrimaryDoctor and first_detail.Registration_Id.PrimaryDoctor.ShortName else "No Primary Doctor",
                    'ItemId': detail.ItemId.pk if detail.ItemId else None,
                    'ItemType':detail.ItemId.ProductType.ProductType_Name,
                    'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                    'FrequencyId': detail.FrequencyId.pk if detail.FrequencyId else None,
                    'FrequencyName': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                    'FrequencyType': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                    'Frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                    'Prescription_Id': detail.Prescription_Id,
                    'Dosage': detail.Dosage,
                    'Route':detail.Route,
                    'DurationNumber': detail.DurationNumber,
                    'DurationUnit': detail.DurationUnit,
                    'Frequencys': detail.Frequency,
                    'Qty': detail.Qty,
                    'Instruction': detail.Instruction,
                    'created_by': detail.created_by,
                    'Status': detail.Status,
                    'Date': detail.created_at.strftime('%Y-%m-%d'),
                    'Time': detail.created_at.strftime('%H:%M:%S'),
                    'Status':detail.Status 
                }
               

                # Append item details and prescription data together
                prescription_list.append({
                    
                    'prescription_data': prescription_data
                })
                index += 1 

            # Combine everything into a response dictionary
            response_dict = {
                'registration_info': registration_info,
                'prescriptions': prescription_list
            }
            responsedata.append(response_dict)

            # Return the response dictionary
            return JsonResponse(responsedata, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def Workbench_GeneralEvaluation_Details_CaseSheet(request):
    if request.method == 'GET':
        try:
            def get_file_image(filedata):
                kind = filetype.guess(filedata)
                contenttype1 = 'application/pdf'  # default MIME
                if kind:
                    if kind.mime == 'image/jpeg':
                        contenttype1 = 'image/jpeg'
                    elif kind.mime == 'image/png':
                        contenttype1 = 'image/png'
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

            # Strip inputs to remove extra whitespace
            registration_id = request.GET.get('RegistrationId', '').strip()
            visit_id = request.GET.get('VisitId', '').strip()
            
            # if not registration_id:
            #     return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            # registration_ins = None
            # ip_registration_ins = None
            # print('reference',registration_id,visit_id)
            # # Try to get OP registration with VisitId first
            # if visit_id:
            #     registration_ins = Patient_Appointment_Registration_Detials.objects.filter(
            #         Registration_Id=registration_id,
            #         VisitId=visit_id
            #     ).first()
            #     if not registration_ins:
            #         print("VisitId not found with RegistrationId, falling back to RegistrationId only.")
            #         registration_ins = Patient_Appointment_Registration_Detials.objects.filter(
            #             Registration_Id=registration_id
            #         ).first()
            # else:
            #     registration_ins = Patient_Appointment_Registration_Detials.objects.filter(
            #         Registration_Id=registration_id
            #     ).first()

            # # Get IP registration if available
            # ip_registration_ins = Patient_IP_Registration_Detials.objects.filter(
            #     Registration_Id=registration_id
            # ).first()

            # # Return error if both OP and IP registrations not found
            # if not registration_ins and not ip_registration_ins:
            #     return JsonResponse({'error': 'No registration found with this ID'}, status=404)

            # # Build filter condition using Q
            # filters = Q()
            # if registration_ins:
            #     filters |= Q(Registration_Id=registration_ins)
            # if ip_registration_ins:
            #     filters |= Q(IP_RegistrationId=ip_registration_ins)

            # Fetch general evaluations
            general_evaluations = Workbench_GeneralEvaluation.objects.filter(Registration_Id__Registration_Id=registration_id)

            response_data = []
            for idx, item in enumerate(general_evaluations, start=1):
                # key_complaint = item.KeyComplaint.values('id', 'PrimaryComplaintName') if hasattr(item.KeyComplaint, 'values') else []
                # chief_complaint = item.CheifComplaint.values('id', 'ChiefComplaintName') if hasattr(item.CheifComplaint, 'values') else []
                # history = item.History.values('id', 'HistoryName') if hasattr(item.History, 'values') else []
                # examine = item.Examine.values('id', 'ExaminationName') if hasattr(item.Examine, 'values') else []

                registration_id_value = ""
                visit_id_value = ""

                if item.Registration_Id:
                    registration_id_value = item.Registration_Id.Registration_Id
                    visit_id_value = item.Registration_Id.VisitId or ""
                elif item.IP_RegistrationId:
                    registration_id_value = item.IP_RegistrationId.Registration_Id

                response_data.append({
                    'sno': idx,
                    'id': item.Id,
                    'RegistrationId': registration_id_value,
                    'VisitId': visit_id_value,
                    'KeyComplaint': item.KeyComplaint,
                    'cheifComplaint': item.CheifComplaint,
                    'History': item.History,
                    'Examine': item.Examine,
                    'Diagnosis': item.Diagnosis,
                    'SearchICDCode': item.ICDCode,
                    'SearchDescription': item.ICDCode_Description,
                    'SearchDiagnosis': item.ICDCode_Diagnosis,
                    'ChooseDocument': get_file_image(item.ChooseDocument) if item.ChooseDocument else None,
                    'currentAnnotation': get_file_image(item.AnnotationDocument) if item.AnnotationDocument else None,
                    'DiseaseDetails': item.DiseaseDetails,
                    'created_by': item.created_by,
                    'Type': item.Type,
                    'Date': item.created_at.strftime('%Y-%m-%d'),
                    'Time': item.created_at.strftime('%H:%M:%S'),
                })

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print("Internal Server Error:", str(e))
            print(traceback.format_exc())
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# @csrf_exempt
# @require_http_methods(["GET", "POST", "OPTIONS"])
# def Workbench_GeneralEvaluation_Details_CaseSheet(request):
#     if request.method == 'GET':
#         try:
#             def get_file_image(filedata):
#                 kind = filetype.guess(filedata)
#                 contenttype1 = 'application/pdf'  # default MIME
#                 if kind:
#                     if kind.mime == 'image/jpeg':
#                         contenttype1 = 'image/jpeg'
#                     elif kind.mime == 'image/png':
#                         contenttype1 = 'image/png'
#                 return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

#             registration_id = request.GET.get('RegistrationId')
#             visit_id = request.GET.get('VisitId')

#             if not registration_id:
#                 return JsonResponse({'error': 'RegistrationId is required'}, status=400)

#             registration_ins = None
#             Ip_registration_ins = None

#             # Filter OP registration with VisitId if available
#             if visit_id:
#                 try:
#                     registration_ins = Patient_Appointment_Registration_Detials.objects.get(
#                         Registration_Id=registration_id,
#                         VisitId=visit_id
#                     )
#                 except Patient_Appointment_Registration_Detials.DoesNotExist:
#                     pass
#             else:
#                 registration_ins = Patient_Appointment_Registration_Detials.objects.filter(
#                     Registration_Id=registration_id
#                 ).first()

#             # Fetch IP registration if available
#             Ip_registration_ins = Patient_IP_Registration_Detials.objects.filter(
#                 Registration_Id=registration_id
#             ).first()

#             if not registration_ins and not Ip_registration_ins:
#                 return JsonResponse({'error': 'No registration found with this ID'}, status=404)

#             # Filter evaluations using Q objects
#             filters = Q()
#             if registration_ins:
#                 filters |= Q(Registration_Id=registration_ins)
#             if Ip_registration_ins:
#                 filters |= Q(IP_RegistrationId=Ip_registration_ins)

#             GeneralEvaluation = Workbench_GeneralEvaluation.objects.filter(filters)

#             response_data = []
#             for idx, item in enumerate(GeneralEvaluation, start=1):
#                 key_complaint = item.KeyComplaint.values('id', 'PrimaryComplaintName') if hasattr(item.KeyComplaint, 'values') else []
#                 cheif_complaint = item.CheifComplaint.values('id', 'ChiefComplaintName') if hasattr(item.CheifComplaint, 'values') else []
#                 history = item.History.values('id', 'HistoryName') if hasattr(item.History, 'values') else []
#                 examine = item.Examine.values('id', 'ExaminationName') if hasattr(item.Examine, 'values') else []

#                 registration_id_value = ""
#                 visit_id_value = ""

#                 if item.Registration_Id:
#                     registration_id_value = item.Registration_Id.Registration_Id
#                     visit_id_value = item.Registration_Id.VisitId if item.Registration_Id.VisitId else ""
#                 elif item.IP_RegistrationId:
#                     registration_id_value = item.IP_RegistrationId.Registration_Id

#                 response_data.append({
#                     'sno': idx,
#                     'id': item.Id,
#                     'RegistrationId': registration_id_value,
#                     'VisitId': visit_id_value,
#                     'KeyComplaint': list(key_complaint),
#                     'cheifComplaint': list(cheif_complaint),
#                     'History': list(history),
#                     'Examine': list(examine),
#                     'Diagnosis': item.Diagnosis,
#                     'SearchICDCode': item.ICDCode,
#                     'SearchDescription': item.ICDCode_Description,
#                     'SearchDiagnosis': item.ICDCode_Diagnosis,
#                     'ChooseDocument': get_file_image(item.ChooseDocument) if item.ChooseDocument else None,
#                     'currentAnnotation': get_file_image(item.AnnotationDocument) if item.AnnotationDocument else None,
#                     'DiseaseDetails': item.DiseaseDetails,
#                     'created_by': item.created_by,
#                     'Type': item.Type,
#                     'Date': item.created_at.strftime('%Y-%m-%d'),
#                     'Time': item.created_at.strftime('%H:%M:%S'),
#                 })

#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             print("Internal Server Error:", str(e))
#             print(traceback.format_exc())
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Vitals_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        
        # Validate input parameters
        # if not registration_id:
        #     return JsonResponse({'warn': 'RegistrationId is required'})
        # if not visit_id:
        #     return JsonResponse({'warn': 'VisitId is required'})
        
        # try:
        #     # Fetch the registration instance
        #     registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id, VisitId=visit_id)
        # except Patient_Appointment_Registration_Detials.DoesNotExist:
        #     return JsonResponse({'warn': 'Patient not found'})
        
        # Fetch vital details related to the registration instance
        vital_details = Patient_Vital_Details.objects.filter(Registration_Id__Registration_Id=registration_id)

        vital_details_data = []
        for idx, vital in enumerate(vital_details, start=1):
            vital_dict = {
                'id': idx,
                # 'PrimaryDoctorName': vital.Registration_Id.PrimaryDoctor.ShortName,
                'Temperature': vital.Temperature,
                'temperature_status': vital.Temperature_Status,
                'PulseRate': vital.Pulse_Rate,
                'SPO2': vital.SPO2,
                'spo2_status': vital.SPO2_Status,
                'HeartRate': vital.Heart_Rate,
                'heartrate_status': vital.Heart_Rate_Status,
                'RespiratoryRate': vital.Respiratory_Rate,
                'RespiratoryStatus': vital.Respiratory_Status,
                'SBP': vital.SBP,
                'sbp_status': vital.SBP_Status,
                'DBP': vital.DBP,
                'Height': vital.Height,
                'Weight': vital.Weight,
                'BMI': vital.BMI,
                'WC': vital.WC,
                'HC': vital.HC,
                'BSL': vital.BSL,
                'Painscore': vital.Painscore,
                'SupplementalOxygen': vital.SupplementalOxygen,
                'SupplementalOxygen_status': vital.SupplementalOxygen_Status,
                'LevelOfConsiousness': vital.LevelOfConsiousness,
                'LevelOfConsiousness_Status': vital.LevelOfConsiousness_Status,
                'CapillaryRefillTime': vital.CapillaryRefillTime,
                'CapillaryRefillTime_Status': vital.CapillaryRefillTime_Status,
                'Type': vital.Type,
                'Date': vital.created_at.strftime('%d-%m-%y'),  # Format date
                'Time': vital.created_at.strftime('%H:%M:%S'),  # Format time
            }
            vital_details_data.append(vital_dict)

        return JsonResponse(vital_details_data, safe=False, status=200)
    
    # Handle unsupported methods
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Prescription_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId').strip(' ')
        visit_id = request.GET.get('VisitId')   
        
        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'})
        if not visit_id:
            return JsonResponse({'warn': 'VisitId is required'})
        
        print('ids',registration_id)

        prescription_details = None
        try:
            prescription_details = OPD_Prescription_Details.objects.filter(
                VisitId=visit_id,
                Registration_Id__Registration_Id=registration_id
            )
        except Exception as e :
            print('error : ',e)    
        
        
        # print('fahat--',fahat)
        print('prescription details--',prescription_details)
        
        if not prescription_details.exists():
            return JsonResponse({'warn': 'No prescription details found'})
        
        prescription_list = []
        index = 1
        first_detail = prescription_details.first()  # Fetch the first detail once

        for detail in prescription_details:
            
            prescription_data = {
                'Id': index,
                'Registration_Id': first_detail.Registration_Id.pk,
                'Patient_Id': detail.Registration_Id.PatientId.PatientId if detail.Patient_Id else '',
                'VisitId': detail.VisitId,
                # 'DoctorShortName': first_detail.Registration_Id.PrimaryDoctor.ShortName,
                # 'DoctorShortName': first_detail.Registration_Id.PrimaryDoctor.ShortName if first_detail.Registration_Id.PrimaryDoctor and first_detail.Registration_Id.PrimaryDoctor.ShortName else "No Primary Doctor",
                'ItemId': detail.ItemId.pk if detail.ItemId else None,
                'ItemType': detail.ItemId.ProductType.ProductType_Name if detail.ItemId else None,
                'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                'FrequencyId': detail.FrequencyId.pk if detail.FrequencyId else None,
                'FrequencyName': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                'FrequencyType': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                'Frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                'Prescription_Id': detail.Prescription_Id,
                'Dosage': detail.Dosage,
                'Route': detail.Route,
                'DurationNumber': detail.DurationNumber,
                'DurationUnit': detail.DurationUnit,
                'Frequencys': detail.Frequency,
                'Qty': detail.Qty,
                'Instruction': detail.Instruction,
                'created_by': detail.created_by,
                'Status': detail.Status,
                'Date': detail.created_at.strftime('%Y-%m-%d'),
                'Time': detail.created_at.strftime('%H:%M:%S'),
            }
            index += 1
            prescription_list.append(prescription_data)
        
        return JsonResponse(prescription_list, safe=False)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Lab_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        register_type = 'OP'
 
        # Validate required query parameters
        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'}, status=400)
        if not visit_id:
            return JsonResponse({'warn': 'VisitId is required'}, status=400)
 
        # Filter Lab_Request_Details for OP registration, matching Registration_Id and VisitId
        lab_requests = Lab_Request_Details.objects.filter(
            RegisterType=register_type,
            OP_Register_Id__Registration_Id=registration_id,
            OP_Register_Id__VisitId=visit_id,
            Status="Pending"
        ).select_related('OP_Register_Id', 'Location')
 
        if not lab_requests.exists():
            return JsonResponse({'warn': 'No lab details found'}, status=404)
 
        response_data = []
        index = 1
 
        # Iterate through each lab request and fetch related items
        for lab_request in lab_requests:
            # Get all related Lab_Request_Items_Details
            lab_items = lab_request.lab_request_items.select_related(
                'Test_Code', 'Group_Code', 'Package_Code', 'Department_Code', 'SubDepartment_Code'
            ).all()
 
            for item in lab_items:
                test_code = item.Test_Code
                group_code = item.Group_Code
                package_code = item.Package_Code
 
                # Base item data
                item_data = {
                    'id': index,
                    'RegisterType': lab_request.RegisterType,
                    'RequestId': lab_request.Request_Id,
                    'TestType': item.TestType,
                    'Department': item.Department_Code.Department_Name if item.Department_Code else None,
                    'SubDepartment': item.SubDepartment_Code.SubDepartment_Name if item.SubDepartment_Code else None,
                    'ServiceStatus': item.Service_Status,
                    'AnalysisStatus': item.Analysis_Status,
                    'VerifyStatus': item.Verify_Status,
                    'ApproveStatus': item.Approve_Status
                }
 
                # Handle Individual Test
                if test_code:
                    item_data.update({
                        'TestCode': test_code.Test_Code,
                        'TestName': test_code.Test_Name,
                        'TestCategory': test_code.Test_Category,
                        'IsSubTest': test_code.IsSubTest,
                        'SubTestCodes': test_code.SubTestCodes
                    })
 
                # Handle Group
                elif group_code:
                    item_data.update({
                        'GroupCode': group_code.Group_Code,
                        'GroupName': group_code.Group_Name,
                        'TestCategory': group_code.Test_Category,
                        'LogicalCategory': group_code.Logical_Category
                    })
 
                # Handle Package
                elif package_code:
                    item_data.update({
                        'PackageCode': package_code.package_code,
                        'PackageName': package_code.package_name,
                        'TestCategory': package_code.test_category,
                        'LogicalCategory': package_code.logical_category
                    })
                    # Fetch tests or groups in the package from OfferPackageList
                    package_items = OfferPackageList.objects.filter(
                        package_code=package_code.package_code
                    ).select_related('Test_Code', 'Group_Code')
                    package_tests = []
                    for pkg_item in package_items:
                        pkg_test = {}
                        if pkg_item.Test_Code:
                            pkg_test = {
                                'TestCode': pkg_item.Test_Code.Test_Code,
                                'TestName': pkg_item.Test_Code.Test_Name,
                                'IsSubTest': pkg_item.IssubTest,
                                'SubTestCodes': pkg_item.SubTestCodes
                            }
                        elif pkg_item.Group_Code:
                            pkg_test = {
                                'GroupCode': pkg_item.Group_Code.Group_Code,
                                'GroupName': pkg_item.Group_Code.Group_Name
                            }
                        if pkg_test:
                            package_tests.append(pkg_test)
                    item_data['PackageTests'] = package_tests
 
                response_data.append(item_data)
                index += 1
 
        return JsonResponse(response_data, safe=False)
 
    return JsonResponse({'error': 'Method not allowed'}, status=405)
 
 
 

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Worbench_Advice_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        
        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'})
        if not visit_id:
            return JsonResponse({'warn': 'VisitId is required'})
        
        prescription_details = OPD_GeneralAdviceFollowUp.objects.filter(
            Registration_Id__Registration_Id=registration_id,
            Registration_Id__VisitId=visit_id,
            AdviceDataCheck=1
        )
        if prescription_details is None:
            return JsonResponse({'warn': 'No Advice details found'})
        
        advice_list = []
        index = 1
        for detail in prescription_details:
            advicedata = {
                'id':index,
                'Advice': detail.GeneralAdivice if detail.GeneralAdivice else None
            }
            advice_list.append(advicedata)
            index += 1

        return JsonResponse(advice_list, safe=False)
        
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Worbench_Review_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        
        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'})
        if not visit_id:
            return JsonResponse({'warn': 'VisitId is required'})
        
        prescription_details = OPD_GeneralAdviceFollowUp.objects.filter(
            Registration_Id__Registration_Id=registration_id,
            Registration_Id__VisitId=visit_id,
            FollowUpDataCheck=1
        )
        print("prescription_details",prescription_details)
        
        if prescription_details is None:
            return JsonResponse({'warn': 'No Advice details found'})

        # Since `prescription_details` is a single object, access its fields directly
        advice_list = []
        index = 1
        
        for detail in prescription_details:
            advicedata = {
                'id': 1,
                'NoOfDays': detail.NoOfDays if detail.NoOfDays else None,
                'TimeInterval': detail.TimeInterval if detail.TimeInterval else None,
                'Date': detail.Date if detail.TimeInterval else None
            }
            advice_list.append(advicedata)
            index += 1

        return JsonResponse(advice_list, safe=False)
        
    return JsonResponse({'error': 'Method not allowed'}, status=405)




# bharathi2

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Medical_Stock_InsetLink_for_Prescription(request):
    if request.method == "GET":
        try:
            # Get distinct GenericName ids and names from the Stock_Maintance_Table_Detials table
            medical_stock_data = Product_Master_All_Category_Details.objects.filter(
                ProductCategory__id=1  # Filtering by ProductCategory id = 1
            ).values(
                'GenericName_id',  # Access the related GenericName id
                'GenericName__GenericName'  # Access the related GenericName name
            ).distinct()

            # Prepare the response data with required fields
            data = [
                {
                    "id": item['GenericName_id'],  # Get the unique GenericName id
                    "Generic_Name": item['GenericName__GenericName'],  # Get the GenericName
                }
                for item in medical_stock_data
            ]

            return JsonResponse(data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": "An internal server error occurred"}, status=500)



@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Names_Link_fordoctor (request):
    try:
        # Get the Genericnameid and Location from query parameters
        Genericid = request.GET.get('Genericnameid', '')
        Location = request.GET.get('Location', '')
        store_location = request.GET.get('Store_location', '')
      
        print("Location", Location)
        
        # if not Genericid:
        #     return JsonResponse({'warn': 'The GenericName has no ItemName associated.'})
        if not Location:
            return JsonResponse({'warn': 'The Location is required.'})
            
        # Filter based on GenericName id using the correct syntax
        item_names = Product_Master_All_Category_Details.objects.filter(ProductCategory__ProductCategory_Name = 'MEDICAL')
        print('Items found:', item_names)

        if Genericid:
            item_names = item_names.filter(GenericName__GenericName_Id = Genericid)
            print('Items found generic:', item_names,len(item_names))

        # Prepare response data with required fields
        data = []
        for ins in item_names:
            stock_ins = Stock_Maintance_Table_Detials.objects.filter(
                Q(Store_location__Location_Name__pk=Location),
                Product_Detials__pk=ins.pk,
                Store_location=store_location,
            ).values('Batch_No', 'Sellable_price').annotate(Availability_qty=Sum('AvailableQuantity'))

            # Check if stock_ins has any items
            if stock_ins.exists():
                for stock in stock_ins:
                    idata = {
                        'ItemName': ins.ItemName,
                        'ItemId': ins.pk,
                        # 'GenericName':ins.GenericName,
                        'Batch_No': stock['Batch_No'],
                        'AvailableQuantity': stock['Availability_qty'] if stock['Availability_qty'] else 0,
                        'MRP': int(stock['Sellable_price'] if stock['Sellable_price'] else 0)
                    }
                    data.append(idata)
                    print("13213",idata)
            else:
                # No stock entries for this item
                idata = {
                    'ItemName': ins.ItemName,
                    # 'GenericName':ins.GenericName,
                    'ItemId': ins.pk,
                    'Batch_No': None,
                    'AvailableQuantity': 0,
                    'MRP': 0
                }
                data.append(idata)
                # print("tyty",idata)

        return JsonResponse(data, safe=False)

    except Exception as e:
        # Handle any exceptions and return an error response
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'})




    
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models import Sum, Max, Q

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Names_Link(request):
    try:
        Genericid = request.GET.get('Genericnameid', '')
        Location = request.GET.get('Location', '')

        if not Genericid:
            return JsonResponse({'warn': 'The GenericName has no ItemName associated.'})
        if not Location:
            return JsonResponse({'warn': 'The Location is required.'})

        # Fetch items based on GenericName ID
        item_names = Product_Master_All_Category_Details.objects.filter(
            GenericName_id=Genericid, ProductCategory__ProductCategory_Name='MEDICAL'
        )

        data = []
        for ins in item_names:
            # Aggregate sum of AvailableQuantity and max of MRP
            stock_ins = Stock_Maintance_Table_Detials.objects.filter(
                Store_location__Location_Name_id=Location,
                Product_Detials_id=ins.pk,
                Store_location__IsPointOfSale=True,
                Store_location__Departments__Department_Id=2  # Fix ManyToManyField filtering
            ).aggregate(
                total_quantity=Sum('AvailableQuantity'),
                max_mrp=Max('Sellable_price')
            )

            # Ensure no None values
            total_quantity = stock_ins['total_quantity'] if stock_ins['total_quantity'] is not None else 0
            max_mrp = int(stock_ins['max_mrp']) if stock_ins['max_mrp'] is not None else 0

            idata = {
                'ItemName': ins.ItemName,
                "GenericName":ins.GenericName,
                'ItemId': ins.pk,
                'AvailableQuantity': total_quantity,
                'MRP': max_mrp
            }
            data.append(idata)
            print("Processed Item:", idata)

        return JsonResponse(data, safe=False)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'})

    
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Medical_Stock_InsetLink_for_Prescription(request):
    if request.method == "GET":
        try:
            # Get distinct GenericName ids and names from the Stock_Maintance_Table_Detials table
            medical_stock_data = Product_Master_All_Category_Details.objects.filter(
                ProductCategory__id=1  # Filtering by ProductCategory id = 1
            ).values(
                'GenericName_id',  # Access the related GenericName id
                'GenericName__GenericName'  # Access the related GenericName name
            ).distinct()

            # Prepare the response data with required fields
            data = [
                {
                    "id": item['GenericName_id'],  # Get the unique GenericName id
                    "Generic_Name": item['GenericName__GenericName'],  # Get the GenericName
                }
                for item in medical_stock_data
            ]

            return JsonResponse(data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": "An internal server error occurred"}, status=500)





@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Item_Types_Link(request):
    try:
        # Get the Itemid from query parameters
        Itemid = request.GET.get('Itemid', '')
        print("Itemid:", Itemid)
        
        if not Itemid:
            return JsonResponse({'warn': 'The ItemName has no ItemType associated.'})
        
        # Filter based on Product_Detials and retrieve distinct fields
        item_names = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials__pk=Itemid
        ).values(
            'Product_Detials__ProductType__ProductType_Name',  # Accessing ProductType_Name
            'Product_Detials__ProductType__ProductType_Id',    # Accessing ProductType_Id
            'Product_Detials__Strength',                       # Accessing Strength
            'Product_Detials__StrengthType'                    # Accessing StrengthType
        ).distinct()

        # Prepare response data with distinct ProductTypeName, ProductTypeId, and Dose
        data = [
            {
                'ProductTypeName': item['Product_Detials__ProductType__ProductType_Name'],
                'ProductTypeId': item['Product_Detials__ProductType__ProductType_Id'],
                'Dose': f"{item['Product_Detials__Strength']} {item['Product_Detials__StrengthType']}" 
                        if item['Product_Detials__Strength'] and item['Product_Detials__StrengthType'] else ""
            }
            for item in item_names
        ]
        print("data",data)
        return JsonResponse(data, safe=False)

    except Exception as e:
        # Handle any exceptions and return an error response
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Radiology_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        register_type = 'OP'
        
        # Check for required query parameters
        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'})
        if not visit_id:
            return JsonResponse({'warn': 'VisitId is required'})

        # Retrieve lab details matching criteria
        radiology_details = Radiology_Request_Details.objects.filter(
            RegisterType=register_type,
            OP_Register_Id__Registration_Id=registration_id,
            OP_Register_Id__VisitId=visit_id,
        )

        if not radiology_details.exists():
            return JsonResponse({'warn': 'No radiology details found'})

        response_data = []
        index = 1
        for req in radiology_details:
            testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
            radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
            
            if radiologyname and testname:
                response_data.append({
                    'id': index,
                    'RadiologyName': radiologyname.Radiology_Name,
                    'TestName': testname.Test_Name,
                })
                index += 1

        
        return JsonResponse(response_data, safe=False)

    return JsonResponse({'error': 'Method not allowed'}, status=405)







@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Workbench_Prescription_Details_link(request):
    if request.method == 'GET':
        try:
            # Retrieve query parameters
            registration_id = request.GET.get('RegistrationId', None)
            patient_id = request.GET.get('PatientId', None)
            visit_id = request.GET.get('VisitId', None)

            if not registration_id or not patient_id or not visit_id:
                return JsonResponse({'warn': 'Missing required parameters'})

            # Fetch prescription details based on Registration ID, Visit ID, and Patient ID
            prescription_details = OPD_Prescription_Details.objects.filter(
                Registration_Id__id=registration_id,
                Patient_Id__PatientId=patient_id,
                VisitId=visit_id
            )
            
            # Fetch the last related data entry
            prescription_details_relateddata = OPD_Prescription_Details.objects.filter(
                Registration_Id__id=registration_id,
                Patient_Id__PatientId=patient_id,
                VisitId=visit_id
            ).last()  # Use `last()` to get only the most recent related data entry

            if not prescription_details.exists():
                return JsonResponse({'warn': 'No prescription details found'})

            # Prepare response data for prescriptions and related details
            prescription_list = []
            related_data = {}

            # Process prescription details
            for index, detail in enumerate(prescription_details, start=1):
                prescription_info = {
                    'id': index,
                    'PrescriptionId': detail.Prescription_Id,
                    'RegistrationId': detail.Registration_Id.id if detail.Registration_Id else None,
                    'PatientId': detail.Patient_Id.PatientId if detail.Patient_Id else None,
                    'Itemid': detail.ItemId.pk if detail.ItemId else None,
                    'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                    'GenericId': detail.ItemId.GenericName.GenericName_Id if detail.ItemId and detail.ItemId.GenericName else None,
                    'GenericName': detail.ItemId.GenericName.GenericName if detail.ItemId and detail.ItemId.GenericName else None,
                    'producttypeid': detail.ItemId.ProductType.ProductType_Id if detail.ItemId and detail.ItemId.ProductType else None,
                    'itemtype': detail.ItemId.ProductType.ProductType_Name if detail.ItemId and detail.ItemId.ProductType else None,
                    'VisitId': detail.VisitId,
                    'dose': detail.Dosage if detail.Dosage else None,
                    'route': detail.Route if detail.Route else None,
                    'batchno': detail.BatchNo.pk if detail.BatchNo else None,
                    'durationNumber': detail.DurationNumber if detail.DurationNumber else None,
                    'durationUnit': detail.DurationUnit if detail.DurationUnit else None,
                    'frequencyid': detail.FrequencyId.pk if detail.FrequencyId else None,
                    'frequencyname': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                    'frequencytype': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                    'frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                    'qty': detail.Qty if detail.Qty else None,
                    'instruction': detail.Instruction if detail.Instruction else None
                }

               
                prescription_list.append(prescription_info)
            
            # Collect related details from the last entry in prescription_details_relateddata
            if prescription_details_relateddata:
                details = prescription_details_relateddata
                if details.OtRequest and details.OtRequest.OtRequestChecked == 1 and 'OtRequestDetails' not in related_data:
                    related_data['OtRequestDetails'] = {
                        'OtRequestId': details.OtRequest.OtRequest_Id,
                        'Specialityid': details.OtRequest.Speciality.Speciality_Id if details.OtRequest.Speciality else None,
                        'Specialityname': details.OtRequest.Speciality.Speciality_Name if details.OtRequest.Speciality else None,
                        'SurgeryNameid': details.OtRequest.SurgeryName.Surgery_Id if details.OtRequest.SurgeryName else None,
                        'SurgeryName': details.OtRequest.SurgeryName.Surgery_Name if details.OtRequest.SurgeryName else None,
                        'SurgeryRequestedDate': details.OtRequest.SurgeryRequestedDate,
                        'OtRequestChecked': details.OtRequest.OtRequestChecked,
                        'Status': details.OtRequest.Status
                    }

                if details.OptoIp and details.OptoIp.OptoIpCheck == 1 and 'OptoIpDetails' not in related_data:
                    related_data['OptoIpDetails'] = {
                        'OptoIpId': details.OptoIp.id,
                        'OptoIpReason': details.OptoIp.Reason,
                        'OptoIpIpNotes': details.OptoIp.IpNotes,
                        'OptoIpCheck': details.OptoIp.OptoIpCheck
                    }

                if details.NextReviewDate:
                    if (details.NextReviewDate.AdviceDataCheck == 1 and details.NextReviewDate.FollowUpDataCheck == 1 and 'NextReviewDateDetails' not in related_data):
                        related_data['NextReviewDateDetails'] = {
                            'NextReviewId': details.NextReviewDate.NextReview_Id,
                            'NoOfDays': details.NextReviewDate.NoOfDays,
                            'TimeInterval': details.NextReviewDate.TimeInterval,
                            'Date': details.NextReviewDate.Date,
                            'GeneralAdivice': details.NextReviewDate.GeneralAdivice,
                            'AdviceDataCheck': details.NextReviewDate.AdviceDataCheck,
                            'FollowUpDataCheck': details.NextReviewDate.FollowUpDataCheck,
                        }
                    elif details.NextReviewDate.FollowUpDataCheck == 1 and details.NextReviewDate.AdviceDataCheck == 0 and 'NextReviewDateDetails' not in related_data:
                        related_data['NextReviewDateDetails'] = {
                            'NextReviewId': details.NextReviewDate.NextReview_Id,
                            'NoOfDays': details.NextReviewDate.NoOfDays,
                            'TimeInterval': details.NextReviewDate.TimeInterval,
                            'Date': details.NextReviewDate.Date,
                            'FollowUpDataCheck': details.NextReviewDate.FollowUpDataCheck,
                        }
                    elif details.NextReviewDate.AdviceDataCheck == 1 and details.NextReviewDate.FollowUpDataCheck == 0 and 'NextReviewDateDetails' not in related_data:
                        related_data['NextReviewDateDetails'] = {
                            'NextReviewId': details.NextReviewDate.NextReview_Id,
                            'GeneralAdivice': details.NextReviewDate.GeneralAdivice,
                            'AdviceDataCheck': details.NextReviewDate.AdviceDataCheck,
                        }

                if details.ReferDoctor and details.ReferDoctor.ReferDoctorCheck == 1 and 'ReferDoctorDetails' not in related_data:
                    related_data['ReferDoctorDetails'] = {
                        'ReferDoctorId': details.ReferDoctor.Refer_Id,
                        'ReferDoctorSpeciality': details.ReferDoctor.Speciality.Speciality_Id if details.ReferDoctor.Speciality else None,
                        'ReferDoctorSpecialityName': details.ReferDoctor.Speciality.Speciality_Name if details.ReferDoctor.Speciality else None,
                        'ReferDoctorid': details.ReferDoctor.ReferDoctorId.Doctor_ID if details.ReferDoctor.ReferDoctorId else None,
                        'ReferDoctorType': details.ReferDoctor.ReferDoctorType,
                        'ReferDoctorName':f"{detail.ReferDoctor.ReferDoctorId.Tittle.Title_Name}{detail.ReferDoctor.ReferDoctorId.ShortName}",
                        'Remarks': details.ReferDoctor.Remarks,
                        'PrimaryDoctor': details.ReferDoctor.PrimaryDoctorId.Doctor_ID if details.ReferDoctor.PrimaryDoctorId else None,
                        'ReferDoctorCheck': details.ReferDoctor.ReferDoctorCheck
                    }

            # Return the structured response
            response_data = [{
                'Prescriptions': prescription_list,
                'RelatedData': related_data
            }]

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)













@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Prescription_EditOPD_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data",data)

            registration_id = data.get('RegistrationId', None)
            patient_id = data.get('PatientId',None)
            primary_doctor_id = data.get('DoctorId', None)
            created_by = data.get('created_by', None)
            advice_data = data.get('adviceData',None)
            follow_up_data = data.get('followUpData', None) 
            ot_request_data = data.get('otRequestData')
            refer_doctor_data = data.get('referDoctorData')
            print("098765",refer_doctor_data)
            selected_medicines = data.get('selectedMedicines', [])
            print("selected_medicines",selected_medicines)
            op_ip_data = data.get('opIpData', None)
            
            Visit_id = data.get('VisitId', None)
            Prescription_Id = data.get('Prescription_Id', None)
            print('Prescription_Id---',Prescription_Id)
            ot_request_instance = None
            refer_doctor_instance = None
            followup_instance = None
            opto_ip_instance = None
            # Validate necessary fields
            if not registration_id or not patient_id :
                return JsonResponse({'warn': 'Missing required fields'})

            # Wrap database operations in a transaction
            with transaction.atomic():
                registration_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                patient_instance = Patient_Detials.objects.get(PatientId=patient_id)

                # Update advice data
                # Check if both follow_up_data and advice_data are present
                if follow_up_data and advice_data:
                    print("88888888")
                    # Update both follow-up and advice data
                    followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)
                    # print("followup_instance:", followup_instance)

                # Check if only advice_data is provided
                elif advice_data and not follow_up_data:
                    followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)
                    # print("followup_instance:", followup_instance)

                # Check if only follow_up_data is provided
                elif follow_up_data and not advice_data:
                    followup_instance = update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance)
                    # print("followup_instance:", followup_instance)

                # Update OT request data
                if ot_request_data:
                    print("000008888")
                    ot_request_instance=update_ot_request_data(ot_request_data, created_by, registration_instance, patient_instance)
                    # print("ot_request_instance",ot_request_instance)
                


                # Update referral doctor data
                print('00000088888888')
                if refer_doctor_data:
                    print('0000099999999')
                
                    refer_doctor_instance=update_refer_doctor_data(refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registration_id)
                    # print("refer_doctor_instance",refer_doctor_instance)
                # Update OP to IP conversion data
                if op_ip_data:
                    print("optoip999")
                    opto_ip_instance=update_op_ip_data(op_ip_data, registration_instance, patient_instance, created_by)
                    # print("opto_ip_instance123",opto_ip_instance)

                if selected_medicines:
                    print('1111111111111111111111111111111111111')
                    for medicine in selected_medicines:
                        print("medicineupdate",medicine)
                        update_selected_medicine(medicine, registration_instance, patient_instance, created_by, refer_doctor_instance, opto_ip_instance, followup_instance, Visit_id, ot_request_instance, behalfofdoc=None)
                else:
                    print('000000000000000000000000000000000000000')
                    update_selected_medicine_no_prescription(registration_instance, patient_instance, created_by, refer_doctor_instance, opto_ip_instance, followup_instance, Visit_id, ot_request_instance, Prescription_Id,  behalfofdoc=None)
            return JsonResponse({'success': 'Prescription updated successfully'}, status=200)

        except Patient_Appointment_Registration_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Registration ID not found'}, status=404)
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Patient ID not found'}, status=404)
        except Exception as e:
            
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

   
def update_follow_up_data(advice_data, follow_up_data, created_by, registration_instance, patient_instance):
    print("bala3",advice_data,follow_up_data,created_by,registration_instance,patient_instance)

    print("balaone")
    followup_id = follow_up_data.get('Followupid') if follow_up_data is not None else None
    print("followup_idbalatwo",followup_id)
    general_is_checked_advice = advice_data.get('isCheckedAdvice', False) if advice_data is not None    else False
    general_advice_followup_id = advice_data.get('Followupid') if advice_data is not None else None
    is_checked_followup = follow_up_data.get('isCheckedFollowup', False) if follow_up_data is not None else None
    no_of_days = follow_up_data.get('NoOfDays', '') if follow_up_data is not None else None
    time_interval = follow_up_data.get('TimeInterval', '') if follow_up_data is not None else None
    date = follow_up_data.get('Date', '') if follow_up_data is not None else None
    general_advice = advice_data.get('AdviceNotes', '') if advice_data is not None else None

    if advice_data and follow_up_data:
        if followup_id and general_advice_followup_id and is_checked_followup and general_is_checked_advice:
            
            no_of_days = follow_up_data.get('NoOfDays', '')
            time_interval = follow_up_data.get('TimeInterval', '')
            date = follow_up_data.get('Date', '')
            general_advice = advice_data.get('AdviceNotes', '')
          

            try:
               
                # Update the existing follow-up record
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=followup_id)
             
                followup_instance.NoOfDays = no_of_days
                followup_instance.TimeInterval = time_interval
                followup_instance.Date = date
                followup_instance.GeneralAdivice = general_advice
                followup_instance.AdviceDataCheck = general_is_checked_advice
                followup_instance.FollowUpDataCheck = is_checked_followup
                followup_instance.save()

                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Follow-up ID not found'})

        elif followup_id and is_checked_followup and not general_is_checked_advice:
            try:
               
                # Update the existing follow-up record
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=followup_id)
                followup_instance.NoOfDays = follow_up_data.get('NoOfDays', '')
                followup_instance.TimeInterval = follow_up_data.get('TimeInterval', '')
                followup_instance.Date = follow_up_data.get('Date', '')
                followup_instance.FollowUpDataCheck = is_checked_followup
                followup_instance.save()
                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Follow-up ID not found'})

        elif followup_id and not is_checked_followup:
            try:
               
               
                # Update the existing follow-up record
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=followup_id)
                followup_instance.FollowUpDataCheck = is_checked_followup
                followup_instance.save()
                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Follow-up ID not found'})

        elif general_advice_followup_id and general_is_checked_advice and not is_checked_followup:
            try:
              
                # Update the existing follow-up record for advice only
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=general_advice_followup_id)
                followup_instance.GeneralAdivice = advice_data.get('AdviceNotes', '')
                followup_instance.AdviceDataCheck = general_is_checked_advice
                followup_instance.save()
                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Follow-up ID not found'})

        elif general_advice_followup_id and not general_is_checked_advice and not is_checked_followup:
            try:
                
                # Update the existing follow-up record for advice check only
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=general_advice_followup_id)
                followup_instance.AdviceDataCheck = general_is_checked_advice
                followup_instance.save()
                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Follow-up ID not found'})
        
        # Fall through to create a new record if no followup_id
        elif general_is_checked_advice and is_checked_followup:
           
            followup_instance = OPD_GeneralAdviceFollowUp.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                NoOfDays=follow_up_data.get('NoOfDays', ''),
                TimeInterval=follow_up_data.get('TimeInterval', ''),
                Date=follow_up_data.get('Date', ''),
                GeneralAdivice=advice_data.get('AdviceNotes', '') if advice_data else '',
                FollowUpDataCheck=is_checked_followup,
                AdviceDataCheck=general_is_checked_advice,
                Status='True',
                created_by=created_by,
            )
            return followup_instance

    elif advice_data and general_is_checked_advice and not follow_up_data and not is_checked_followup:
        # Handle case where only advice data is available
        if general_advice_followup_id:
            try:
                print("jothi", advice_data)
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=general_advice_followup_id)
                followup_instance.GeneralAdivice = advice_data.get('AdviceNotes', '')
                followup_instance.AdviceDataCheck = general_is_checked_advice
                followup_instance.created_by = created_by
                followup_instance.save()
                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Advice ID not found'})
        else:
            # Create a new advice follow-up if no existing ID
            followup_instance = OPD_GeneralAdviceFollowUp.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                GeneralAdivice=advice_data.get('AdviceNotes', ''),
                AdviceDataCheck=general_is_checked_advice,
                Status='True',
                created_by=created_by,
            )
            return followup_instance

    elif follow_up_data  and is_checked_followup and not general_is_checked_advice:
        # Handle case where only follow-up data is available
        if followup_id:
            try:
                
                followup_instance = OPD_GeneralAdviceFollowUp.objects.get(NextReview_Id=followup_id)
                followup_instance.NoOfDays = follow_up_data.get('NoOfDays', '')
                followup_instance.TimeInterval = follow_up_data.get('TimeInterval', '')
                followup_instance.Date = follow_up_data.get('Date', '')
                followup_instance.FollowUpDataCheck = is_checked_followup
                followup_instance.save()
                return followup_instance
            except OPD_GeneralAdviceFollowUp.DoesNotExist:
                return JsonResponse({'warn': 'Follow-up ID not found'})

        elif is_checked_followup and not general_is_checked_advice:
            print("bala")
            # Create a new follow-up record if no ID and check is true
            followup_instance = OPD_GeneralAdviceFollowUp.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                NoOfDays=follow_up_data.get('NoOfDays', ''),
                TimeInterval=follow_up_data.get('TimeInterval', ''),
                Date=follow_up_data.get('Date', ''),
                FollowUpDataCheck=is_checked_followup,
                Status='True',
                created_by=created_by,
            )
            return followup_instance
        elif general_is_checked_advice and not is_checked_followup:
            print("general_is_checked_advice56",general_is_checked_advice)
            followup_instance = OPD_GeneralAdviceFollowUp.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                GeneralAdivice=advice_data.get('AdviceNotes', ''),
                AdviceDataCheck=general_is_checked_advice,
                Status='True',
                created_by=created_by,
            )
            return followup_instance
     
    elif advice_data and general_is_checked_advice and  not general_advice_followup_id:
        
        followup_instance = OPD_GeneralAdviceFollowUp.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                GeneralAdivice=advice_data.get('AdviceNotes', ''),
                AdviceDataCheck=general_is_checked_advice,
                Status='True',
                created_by=created_by,
        )
        return followup_instance
        
    



def update_ot_request_data(ot_request_data, created_by, registration_instance, patient_instance):
    try:
  
        
        ot_request_id = ot_request_data.get('OtRequestid', None)
        is_checked_ot_request = ot_request_data.get('isCheckedOtRequest', False)

        if ot_request_id:  # If ot_request_id is provided
            try:
                ot_request_instance = OPD_OtRequest_Details.objects.get(OtRequest_Id=ot_request_id)
                if not ot_request_data.get('Specialityid') or not ot_request_data.get('Surgeryid'):

                    return JsonResponse({'warn': 'Speciality and Surgery are required fields.'})

                speciality_instance = Speciality_Detials.objects.get(Speciality_Id=ot_request_data.get('Specialityid'))
                surgery_requested_date = ot_request_data.get('SurgeryRequestedDate', '')
                surgery_instance = SurgeryName_Details.objects.get(Surgery_Id=ot_request_data.get('Surgeryid'))

                # If OT request is checked, update the existing record
                if is_checked_ot_request:
                  
                    ot_request_instance.Speciality = speciality_instance if speciality_instance else None
                    ot_request_instance.SurgeryName = surgery_instance if surgery_instance else None
                    ot_request_instance.SurgeryRequestedDate = surgery_requested_date
                    ot_request_instance.OtRequestChecked = is_checked_ot_request
                    ot_request_instance.save()
                    return ot_request_instance
                else:
                   
                    ot_request_instance.OtRequestChecked = is_checked_ot_request
                    ot_request_instance.save()
                    return ot_request_instance
            except OPD_OtRequest_Details.DoesNotExist:
                print("OT request ID not found.")
                return JsonResponse({'warn': 'OT request ID not found'})
        
        elif is_checked_ot_request:  # If OT request ID doesn't exist but the checkbox is checked
          
            if not ot_request_data.get('Specialityid') or not ot_request_data.get('Surgeryid'):
                
                return JsonResponse({'warn': 'Speciality and Surgery are required fields.'})

            speciality_instance = Speciality_Detials.objects.get(Speciality_Id=ot_request_data.get('Specialityid'))
            surgery_requested_date = ot_request_data.get('SurgeryRequestedDate', '')
            surgery_instance = SurgeryName_Details.objects.get(Surgery_Id=ot_request_data.get('Surgeryid'))
            ot_request_instance = OPD_OtRequest_Details.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                Speciality=speciality_instance if speciality_instance else None,
                SurgeryName=surgery_instance if surgery_instance else None,
                SurgeryRequestedDate=surgery_requested_date,
                created_by=created_by,
                OtRequestChecked=is_checked_ot_request,
                Status="True"
            )
            return ot_request_instance

        else:  # If the checkbox is unchecked and no OT request ID is provided, return None
            print("OT request unchecked, returning None.")
            return None
    
    except Exception as e:
        # Log the exception if something goes wrong
        print("Error:", str(e))
        return JsonResponse({'error': str(e)})

        
       


        
            



 
def update_refer_doctor_data(refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registration_id):
    print("check1", refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registration_id)
 
    refer_id = refer_doctor_data.get('referid', None)
    refer_doctor_type = refer_doctor_data.get('doctorType', '')
    is_checked_refer_doctor = refer_doctor_data.get('isCheckedReferDoctor', False)
 
    try:
        print("check2")
        doctor_register_instance = None
 
        doctor_register_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=primary_doctor_id)
        print("doctorrrr",doctor_register_instance)
        speciality_instance = Speciality_Detials.objects.get(Speciality_Id=refer_doctor_data.get('specialityid', ''))
        print("speciallityy",speciality_instance)
        if refer_id and is_checked_refer_doctor:
            print("check if",refer_id,is_checked_refer_doctor)
            try:
                refer_doctor_instance = OPD_Referal_Details.objects.get(Refer_Id=refer_id)
 
                if refer_doctor_type == "OutSource":
                    refer_doctor_instance.Speciality = speciality_instance
                    refer_doctor_instance.PrimaryDoctorId = doctor_register_instance
                    refer_doctor_instance.ReferDoctorType = refer_doctor_type
                    refer_doctor_instance.Remarks = refer_doctor_data.get('remarks', '')
                    refer_doctor_instance.ReferDoctorCheck = is_checked_refer_doctor
                    refer_doctor_instance.save()
                    return refer_doctor_instance
                else:
                    try:
                        referdoctor_register_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=refer_doctor_data.get('doctorid'))
                        refer_doctor_instance.Speciality = speciality_instance
                        refer_doctor_instance.PrimaryDoctorId = doctor_register_instance
                        refer_doctor_instance.ReferDoctorId = referdoctor_register_instance
                        refer_doctor_instance.ReferDoctorType = refer_doctor_type
                        refer_doctor_instance.Remarks = refer_doctor_data.get('remarks', '')
                        refer_doctor_instance.ReferDoctorCheck = is_checked_refer_doctor
                        refer_doctor_instance.save()
                        return refer_doctor_instance
                    except Doctor_Personal_Form_Detials.DoesNotExist:
                        print("Refer doctor does not exist")
                        return None  # Instead of returning JsonResponse
            except OPD_Referal_Details.DoesNotExist:
                print("The Refer Doctor ID does not exist")
                return None  # Instead of returning JsonResponse
 
        elif refer_id and not is_checked_refer_doctor:
            print("check elif",refer_id,is_checked_refer_doctor)
            refer_doctor_instance = OPD_Referal_Details.objects.get(Refer_Id=refer_id)
            refer_doctor_instance.ReferDoctorCheck = is_checked_refer_doctor
            refer_doctor_instance.save()
            return refer_doctor_instance
 
        elif is_checked_refer_doctor:
            print("check elif2",is_checked_refer_doctor)
            if refer_doctor_type == "OutSource":
                print("check elif2 if")
                refer_doctor_instance = OPD_Referal_Details.objects.create(
                    Registration_Id=registration_instance,
                    VisitId=Visit_id,
                    Speciality=speciality_instance,
                    Patient_Id=patient_instance,
                    PrimaryDoctorId=doctor_register_instance,
                    ReferDoctorType=refer_doctor_type,
                    Remarks=refer_doctor_data.get('remarks', ''),
                    ReferDoctorCheck=is_checked_refer_doctor,
                    created_by=created_by,
                    Status="True",
                )
                return refer_doctor_instance
            else:
                print("check elif2 else")
                try:
                    refer_doctor_instance = None
                    try:
                        print("is_checked_refer_doctor :",is_checked_refer_doctor,type(is_checked_refer_doctor))
                        if type(is_checked_refer_doctor) == str:
                            is_checked_refer_doctor1 = True if is_checked_refer_doctor == 'true' else False
                        else:
                            is_checked_refer_doctor1 = is_checked_refer_doctor
                        referdoctor_register_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=refer_doctor_data.get('doctorid'))
                        refer_doctor_instance = OPD_Referal_Details.objects.create(
                        Registration_Id=registration_instance,
                        VisitId=Visit_id,
                        Speciality=speciality_instance,
                        Patient_Id=patient_instance,
                        PrimaryDoctorId=doctor_register_instance,
                        ReferDoctorId=referdoctor_register_instance,
                        ReferDoctorType=refer_doctor_type,
                        Remarks=refer_doctor_data.get('remarks', ''),
                        ReferDoctorCheck=is_checked_refer_doctor1,
                        created_by=created_by,
                        Status=True
                    )
                    except Exception as e:
                        print("Error =======>",e)
                    patient_details = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
                    Patient_Appointment_Registration_Detials.objects.create(
                        Registration_Id=patient_details.Registration_Id,
                        PatientId=patient_instance,
                        VisitId=patient_details.VisitId,
                        VisitPurpose=patient_details.VisitPurpose,
                        VisitType=patient_details.VisitType,
                        Specialization=speciality_instance,
                        PrimaryDoctor=referdoctor_register_instance if referdoctor_register_instance else None,
                        Complaint=patient_details.Complaint,
                        PatientCategory=patient_details.PatientCategory,
                        InsuranceName=patient_details.InsuranceName,
                        InsuranceType=patient_details.InsuranceType,
                        ClientName=patient_details.ClientName,
                        ClientType=patient_details.ClientType,
                        ClientEmployeeId=patient_details.ClientEmployeeId,
                        ClientEmployeeDesignation=patient_details.ClientEmployeeDesignation,
                        ClientEmployeeRelation=patient_details.ClientEmployeeRelation,
                        CorporateName=patient_details.CorporateName,
                        CorporateType=patient_details.CorporateType,
                        CorporateEmployeeId=patient_details.CorporateEmployeeId,
                        CorporateEmployeeDesignation=patient_details.CorporateEmployeeDesignation,
                        CorporateEmployeeRelation=patient_details.CorporateEmployeeRelation,
                        EmployeeId=patient_details.EmployeeId,
                        EmployeeRelation=patient_details.EmployeeRelation,
                        DoctorId=patient_details.DoctorId,
                        DoctorRelation=patient_details.DoctorRelation,
                        DonationType=patient_details.DonationType,
                        IsMLC=patient_details.IsMLC,
                        IsReferral=patient_details.IsReferral,
                    )
                    return refer_doctor_instance
                except Exception as e:
                    print("Error ",e)
                    print("Refer doctor does not exist")
                    return None  # Instead of returning JsonResponse
        else:
            return None
 
    except Exception as hash:
        print("Primary doctor does not exist")
        return None
    except Speciality_Detials.DoesNotExist:
        print("Speciality does not exist")
        return None


def update_refer_doctor_data(refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registration_id):
    print("referdoctordatascheck-----------", refer_doctor_data, primary_doctor_id, registration_instance, patient_instance, Visit_id, created_by,registration_id)
 
    refer_id = refer_doctor_data.get('referid', None)
    refer_doctor_type = refer_doctor_data.get('doctorType', '')
    is_checked_refer_doctor = refer_doctor_data.get('isCheckedReferDoctor', False)
 
    try:
        print("check2-----")
        doctor_register_instance = None
 
        doctor_register_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=primary_doctor_id)
        print("doctorrrr",doctor_register_instance)
        speciality_instance = Speciality_Detials.objects.get(Speciality_Id=refer_doctor_data.get('specialityid', ''))
        print("speciallityy",speciality_instance)
        if refer_id and is_checked_refer_doctor:
            print("check if",refer_id,is_checked_refer_doctor)
            try:
                refer_doctor_instance = OPD_Referal_Details.objects.get(Refer_Id=refer_id)
 
                if refer_doctor_type == "OutSource":
                    refer_doctor_instance.Speciality = speciality_instance
                    refer_doctor_instance.PrimaryDoctorId = doctor_register_instance
                    refer_doctor_instance.ReferDoctorType = refer_doctor_type
                    refer_doctor_instance.Remarks = refer_doctor_data.get('remarks', '')
                    refer_doctor_instance.ReferDoctorCheck = is_checked_refer_doctor
                    refer_doctor_instance.save()
                    return refer_doctor_instance
                else:
                    print("referelseworking-----------")
                    try:
                        referdoctor_register_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=refer_doctor_data.get('doctorid'))
                        refer_doctor_instance.Speciality = speciality_instance
                        refer_doctor_instance.PrimaryDoctorId = doctor_register_instance
                        refer_doctor_instance.ReferDoctorId = referdoctor_register_instance
                        refer_doctor_instance.ReferDoctorType = refer_doctor_type
                        refer_doctor_instance.Remarks = refer_doctor_data.get('remarks', '')
                        refer_doctor_instance.ReferDoctorCheck = is_checked_refer_doctor
                        refer_doctor_instance.save()
                        return refer_doctor_instance
                    except Doctor_Personal_Form_Detials.DoesNotExist:
                        print("Refer doctor does not exist")
                        return None  # Instead of returning JsonResponse
            except OPD_Referal_Details.DoesNotExist:
                print("The Refer Doctor ID does not exist")
                return None  # Instead of returning JsonResponse
 
        elif refer_id and not is_checked_refer_doctor:
            print("check elif",refer_id,is_checked_refer_doctor)
            refer_doctor_instance = OPD_Referal_Details.objects.get(Refer_Id=refer_id)
            refer_doctor_instance.ReferDoctorCheck = is_checked_refer_doctor
            refer_doctor_instance.save()
            return refer_doctor_instance
 
        elif is_checked_refer_doctor and not refer_id:


            if refer_doctor_type == "OutSource":
              
                refer_doctor_instance = OPD_Referal_Details.objects.create(
                    Registration_Id=registration_instance,
                    VisitId=Visit_id,
                    Speciality=speciality_instance,
                    Patient_Id=patient_instance,
                    PrimaryDoctorId=doctor_register_instance,
                    ReferDoctorType=refer_doctor_type,
                    Remarks=refer_doctor_data.get('remarks', ''),
                    ReferDoctorCheck=is_checked_refer_doctor,
                    created_by=created_by,
                    Status="True",
                )
                return refer_doctor_instance
            else:
               
                try:
                    refer_doctor_instance = None
                    try:
                        print("is_checked_refer_doctor :",is_checked_refer_doctor,type(is_checked_refer_doctor))
                        if type(is_checked_refer_doctor) == str:
                          
                            is_checked_refer_doctor1 = True if is_checked_refer_doctor == 'true' else False
                        else:
                          
                            is_checked_refer_doctor1 = is_checked_refer_doctor
                        referdoctor_register_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=refer_doctor_data.get('doctorid'))
                        refer_doctor_instance = OPD_Referal_Details.objects.create(
                        Registration_Id=registration_instance,
                        VisitId=Visit_id,
                        Speciality=speciality_instance,
                        Patient_Id=patient_instance,
                        PrimaryDoctorId=doctor_register_instance,
                        ReferDoctorId=referdoctor_register_instance,
                        ReferDoctorType=refer_doctor_type,
                        Remarks=refer_doctor_data.get('remarks', ''),
                        ReferDoctorCheck=is_checked_refer_doctor1,
                        created_by=created_by,
                        Status=True
                    )
                    except Exception as e:
                        print("Error =======>",e)
                    # patient_details = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
                    # Patient_Appointment_Registration_Detials.objects.create(
                    #     Registration_Id=patient_details.Registration_Id,
                    #     PatientId=patient_instance,
                    #     VisitId=patient_details.VisitId,
                    #     CardValidity=patient_details.CardValidity,
                    #     VisitPurpose=patient_details.VisitPurpose,
                    #     VisitType=patient_details.VisitType,
                    #     Specialization=speciality_instance,
                    #     PrimaryDoctor=referdoctor_register_instance if referdoctor_register_instance else None,
                    #     Complaint=patient_details.Complaint,
                    #     PatientCategory=patient_details.PatientCategory,
                    #     InsuranceName=patient_details.InsuranceName,
                    #     InsuranceType=patient_details.InsuranceType,
                    #     ClientName=patient_details.ClientName,
                    #     ClientType=patient_details.ClientType,
                    #     ClientEmployeeId=patient_details.ClientEmployeeId,
                    #     ClientEmployeeDesignation=patient_details.ClientEmployeeDesignation,
                    #     ClientEmployeeRelation=patient_details.ClientEmployeeRelation,
                    #     CorporateName=patient_details.CorporateName,
                    #     CorporateType=patient_details.CorporateType,
                    #     CorporateEmployeeId=patient_details.CorporateEmployeeId,
                    #     CorporateEmployeeDesignation=patient_details.CorporateEmployeeDesignation,
                    #     CorporateEmployeeRelation=patient_details.CorporateEmployeeRelation,
                    #     EmployeeId=patient_details.EmployeeId,
                    #     EmployeeRelation=patient_details.EmployeeRelation,
                    #     DoctorId=patient_details.DoctorId,
                    #     DoctorRelation=patient_details.DoctorRelation,
                    #     DonationType=patient_details.DonationType,
                    #     IsMLC=patient_details.IsMLC,
                    #     IsReferral=patient_details.IsReferral,
                    # )
                    return refer_doctor_instance
                except Exception as e:
                    print("Error ",e)
                    print("Refer doctor does not exist")
                    return None  # Instead of returning JsonResponse
        else:
            return None
 
    except Exception as hash:
        print("Primary doctor does not exist")
        return None
    except Speciality_Detials.DoesNotExist:
        print("Speciality does not exist")
        return None
 
 
   
 
    
def update_op_ip_data(op_ip_data, registration_instance, patient_instance, created_by):
   
    ip_to_op_id = op_ip_data.get('Ipid')
    
    is_checked_op_ip = op_ip_data.get('isCheckedOpIp', False)
    if ip_to_op_id and is_checked_op_ip:
        
        try:
          
            opto_ip_instance = Op_to_Ip_Convertion_Table.objects.get(pk=ip_to_op_id)
            opto_ip_instance.Reason = op_ip_data.get('reason', '')
            opto_ip_instance.IpNotes = op_ip_data.get('IpNotes', '')
            opto_ip_instance.OptoIpCheck = is_checked_op_ip
            opto_ip_instance.save()
            return opto_ip_instance
        except Op_to_Ip_Convertion_Table.DoesNotExist:
            return JsonResponse({'warn': 'The OpToIp ID does not exist'})
    
    elif ip_to_op_id and not is_checked_op_ip:
        try:
          
            opto_ip_instance = Op_to_Ip_Convertion_Table.objects.get(pk=ip_to_op_id)
            opto_ip_instance.OptoIpCheck = is_checked_op_ip
            opto_ip_instance.save()
            return opto_ip_instance
        except Op_to_Ip_Convertion_Table.DoesNotExist:
            return JsonResponse({'warn': 'The OpToIp ID does not exist'})
        
    elif is_checked_op_ip and not ip_to_op_id:
       
       
        opto_ip_instance = Op_to_Ip_Convertion_Table.objects.create(
            Patient_Id = patient_instance,
            Registration_id = registration_instance,
            created_by = created_by,
            Reason = op_ip_data.get('reason', ''),
            IpNotes = op_ip_data.get('IpNotes', ''),
            OptoIpCheck = is_checked_op_ip,
            Status='Pending'
        )
        
        return opto_ip_instance
    else:
       
        return None
        



                
def update_selected_medicine(
    medicine, registration_instance, patient_instance, created_by,
    refer_doctor_instance, opto_ip_instance, followup_instance,
    Visit_id, ot_request_instance, behalfofdoc
):
    item_ins = Product_Master_All_Category_Details.objects.get(pk=medicine.get('Itemid'))
    frequency_ins = Frequency_Master_Drug.objects.get(FrequencyId=medicine.get('frequencyid'))

    prescription_id = medicine.get('Prescription_Id') or medicine.get('PrescriptionId')

    if prescription_id:
        # Update existing
        prescription_instance = OPD_Prescription_Details.objects.get(Prescription_Id=prescription_id)
        prescription_instance.ItemId = item_ins
        prescription_instance.FrequencyId = frequency_ins
        prescription_instance.OtRequest = ot_request_instance
        prescription_instance.OptoIp = opto_ip_instance
        prescription_instance.NextReviewDate = followup_instance
        prescription_instance.ReferDoctor = refer_doctor_instance
        prescription_instance.Dosage = medicine.get('dose', '')
        prescription_instance.Route = medicine.get('route', '')
        prescription_instance.DurationNumber = medicine.get('durationNumber', '')
        prescription_instance.DurationUnit = medicine.get('durationUnit', '')
        prescription_instance.Frequency = medicine.get('frequency', '')
        prescription_instance.Qty = medicine.get('qty')
        prescription_instance.Instruction = medicine.get('instruction', '')
        prescription_instance.created_by = created_by
        prescription_instance.behalfofdoc = behalfofdoc
        prescription_instance.Status = True
        prescription_instance.save()
        return prescription_instance
    else:
        # Create new
        return OPD_Prescription_Details.objects.create(
            Registration_Id=registration_instance,
            Patient_Id=patient_instance,
            VisitId=Visit_id,
            ItemId=item_ins,
            FrequencyId=frequency_ins,
            OtRequest=ot_request_instance,
            OptoIp=opto_ip_instance,
            NextReviewDate=followup_instance,
            ReferDoctor=refer_doctor_instance,
            behalfofdoc=behalfofdoc,
            Dosage=medicine.get('dose', ''),
            Route=medicine.get('route', ''),
            DurationNumber=medicine.get('durationNumber', ''),
            DurationUnit=medicine.get('durationUnit', ''),
            Frequency=medicine.get('frequency', ''),
            Qty=medicine.get('qty'),
            Instruction=medicine.get('instruction', ''),
            created_by=created_by,
            Status=True
        )


def update_selected_medicine_no_prescription(
    registration_instance, patient_instance, created_by,
    refer_doctor_instance, opto_ip_instance, followup_instance,
    Visit_id, ot_request_instance, Prescription_Id, behalfofdoc
):
    if Prescription_Id:
        prescription_instance = OPD_Prescription_Details.objects.get(Prescription_Id=Prescription_Id)
        prescription_instance.Registration_Id = registration_instance
        prescription_instance.Patient_Id = patient_instance
        prescription_instance.VisitId = Visit_id
        prescription_instance.OtRequest = ot_request_instance
        prescription_instance.OptoIp = opto_ip_instance
        prescription_instance.NextReviewDate = followup_instance
        prescription_instance.ReferDoctor = refer_doctor_instance
        prescription_instance.created_by = created_by
        prescription_instance.Status = True
        prescription_instance.behalfofdoc = behalfofdoc
        prescription_instance.save()
        return prescription_instance
    else:
        return OPD_Prescription_Details.objects.create(
            Registration_Id=registration_instance,
            Patient_Id=patient_instance,
            VisitId=Visit_id,
            OtRequest=ot_request_instance,
            OptoIp=opto_ip_instance,
            NextReviewDate=followup_instance,
            ReferDoctor=refer_doctor_instance,
            created_by=created_by,
            Status=True,
            behalfofdoc=behalfofdoc
        )





def update_selected_medicine1(medicine, registration_instance, patient_instance, created_by, refer_doctor_instance, opto_ip_instance, followup_instance, Visit_id, ot_request_instance,behalfofdoc):
    
   
    try:
        print(behalfofdoc,'hiiiiiiiiiiii')
        item_ins=None
        frequency_ins=None
        batch_ins=None
        try:
            item_ins = Product_Master_All_Category_Details.objects.get(pk=medicine.get('Itemid'))
        except Product_Master_All_Category_Details.DoesNotExist:
            return JsonResponse({'warn': 'item not found'})
        
        try:
            frequency_ins = Frequency_Master_Drug.objects.get(FrequencyId=medicine.get('frequencyid', None))
        except Frequency_Master_Drug.DoesNotExist:
            return JsonResponse({'warn': 'frequency not found'})


        prescription_id = medicine.get('Prescription_Id') or medicine.get('PrescriptionId')

        # Check if updating or creating a new prescription
        if prescription_id:
     
            try:     
                prescription_instance = OPD_Prescription_Details.objects.get(Prescription_Id=prescription_id)
                prescription_instance.ItemId = item_ins
                prescription_instance.FrequencyId = frequency_ins
                prescription_instance.OtRequest=ot_request_instance 
                prescription_instance.OptoIp=opto_ip_instance
                prescription_instance.NextReviewDate=followup_instance
                prescription_instance.ReferDoctor=refer_doctor_instance
                prescription_instance.Dosage = medicine.get('dose', '')
                prescription_instance.Route = medicine.get('route', '')
                prescription_instance.DurationNumber = medicine.get('durationNumber', '')
                prescription_instance.DurationUnit = medicine.get('durationUnit', '')
                prescription_instance.Frequency = medicine.get('frequency', '')
                prescription_instance.Qty = medicine.get('qty')
                prescription_instance.Instruction = medicine.get('instruction', '')
                prescription_instance.created_by = created_by
                prescription_instance.save()
                print("Prescription updated successfully.")
                return JsonResponse({'success': 'Prescription updated successfully.'})

            except OPD_Prescription_Details.DoesNotExist:
                print("Warning: Prescription with ID does not exist.")
                return JsonResponse({'warn': 'The Prescription ID does not exist'})

        else:
            

            OPD_Prescription_Details.objects.create(
                Registration_Id=registration_instance,
                Patient_Id=patient_instance,
                VisitId=Visit_id,
                ItemId=item_ins,
                FrequencyId=frequency_ins,
                OtRequest=ot_request_instance if ot_request_instance else None,
                OptoIp=opto_ip_instance if opto_ip_instance else None,
                NextReviewDate=followup_instance if followup_instance else None,
                ReferDoctor=refer_doctor_instance if refer_doctor_instance else None,
                behalfofdoc = behalfofdoc if behalfofdoc else None,
                Dosage=medicine.get('dose', ''),
                Route=medicine.get('route', ''),
                DurationNumber=medicine.get('durationNumber', ''),
                DurationUnit=medicine.get('durationUnit', ''),
                Frequency=medicine.get('frequency', ''),
                Qty=medicine.get('qty'),
                Instruction=medicine.get('instruction', ''),
                created_by=created_by,
                Status="True"
            )
            print("New prescription created successfully.")
            return JsonResponse({'success': 'New prescription created successfully.'})
            
    except Product_Master_All_Category_Details.DoesNotExist:
        print("Warning: Product ID does not exist.")
        return JsonResponse({'warn': 'Product ID does not exist'})
    except Stock_Maintance_Table_Detials.DoesNotExist:
        print("Warning: Batch number does not exist.")
        return JsonResponse({'warn': 'The Batch number does not exist'})
    except Frequency_Master_Drug.DoesNotExist:
        print("Warning: Frequency ID does not exist.")
        return JsonResponse({'warn': 'The Frequency ID does not exist'})
    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)})





 
@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Prescription_OPDComplete_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("--------------Received data:", data)
           
            # Check for required fields in the data
            registration_id = data.get('RegistrationId')
            visit_id = data.get('VisitId')
            patient_id = data.get('PatientId')
            DoctorId = data.get('DoctorId')
            complete_status = data.get('isvisitcomplete')
            print("complete_status",complete_status)
 
            # Validate the required fields
            if not registration_id or not visit_id or not patient_id:
                return JsonResponse({'warn': 'Missing required parameters'})
           
            print('tttttttttttt')
            # Fetch prescription details based on provided data
            prescription_details = OPD_Prescription_Details.objects.filter(
                Registration_Id__Registration_Id=registration_id,
                Patient_Id__PatientId=patient_id,
                VisitId=visit_id
            )
 
            print(prescription_details,'prescription_details')
            appointment_details = Patient_Appointment_Registration_Detials.objects.filter(
                Registration_Id = registration_id,
                PatientId__PatientId=patient_id,
                VisitId=visit_id
            )
 
            print(appointment_details,'appointment_details')
 
            Multiple_Doc_appointment_details = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__Registration_Id=registration_id,
                PrimaryDoctor__Doctor_ID=DoctorId,
                Registration_Id__PatientId__PatientId=patient_id,
                Registration_Id__VisitId=visit_id
            )
 
            print(Multiple_Doc_appointment_details,'Multiple_Doc_appointment_details')
 
            print("Fetched appointment_details details1:", appointment_details)
            print("Fetched prescription details:", prescription_details)
 
            # Update the Status field for each prescription detail
            for prescription in prescription_details:
                print("Updating prescription:", prescription)
                prescription.Status = complete_status  # Update Status field
                prescription.save()  # Save changes
           
            for appointment in appointment_details:
                print("sdsdsds99",appointment)
                print("sdsdsds78",appointment.Status)
                appointment.Status = "Completed"
                appointment.save()
 
            if Multiple_Doc_appointment_details.exists():
                for MulDoc in Multiple_Doc_appointment_details:
                    print("Fetched Record ID:", MulDoc.id)
                    print("Previous Status:", MulDoc.Status)
                    MulDoc.Status = "Completed"
                    MulDoc.save()
                    print("Updated Status:", MulDoc.Status)
            else:
                print("No matching records found.")
               
            return JsonResponse(
                {'success': 'Current visit marked as complete successfully'},
                status=200
            )
 
 
        except Exception as e:
            print("An error occurred:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Refer_DoctorOpd_Details_CaseSheet(request):
    if request.method == 'GET':
        registration_id = request.GET.get('RegistrationId')
        visit_id = request.GET.get('VisitId')
        patient_id = request.GET.get('PatientId')
        
        if not all([registration_id, visit_id, patient_id]):
            return JsonResponse({'warn': 'Missing Required Fields'})
        
        try:
            reg_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
            refer_doctor_ins = OPD_Referal_Details.objects.filter(
                Registration_Id=reg_ins, VisitId=visit_id, Patient_Id=patient_id
            ).last()

            print(refer_doctor_ins,'refer_doctor_ins')
            
            if refer_doctor_ins is None:
                return JsonResponse({'warn': 'Patient not found'})
            
            response_data = []
            index = 1
            Doctortype = refer_doctor_ins.ReferDoctorType
            if (Doctortype == "InHouse" or Doctortype == "Visiting") and refer_doctor_ins.ReferDoctorCheck:
                response_dict = {
                    'id': index,
                    'Refer_Id': refer_doctor_ins.Refer_Id,
                    'VisitId': refer_doctor_ins.VisitId,
                    'ReferDoctorSpeciality': refer_doctor_ins.Speciality.Speciality_Name,
                    'PrimaryDoctorId': f"{refer_doctor_ins.PrimaryDoctorId.Tittle} {refer_doctor_ins.PrimaryDoctorId.ShortName}",
                    'ReferDoctorId': f"{refer_doctor_ins.ReferDoctorId.Tittle} {refer_doctor_ins.ReferDoctorId.ShortName}",
                    'ReferDoctorType': refer_doctor_ins.ReferDoctorType,
                    'Remarks': refer_doctor_ins.Remarks or "No Remarks",
                    'ReferDoctorCheck': refer_doctor_ins.ReferDoctorCheck,
                }
                response_data.append(response_dict)
                
            if response_data:
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({'warn': 'No Refer Doctor'})
        
        except OPD_Referal_Details.DoesNotExist:
            return JsonResponse({'warn': 'Patient not found'})





# previousvisit

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_Previous_Prescription_Details(request):
    if request.method == 'GET':
        
        visit_id = request.GET.get('VisitId')
        print("registration_id00001", visit_id)  
        
        PatientId = request.GET.get('PatientId')
        print("registration_id00002", PatientId)
        
        if not PatientId:
            return JsonResponse({'warn': 'PatientId is required'})
        if not visit_id:
            return JsonResponse({'warn': 'VisitId is required'})
        
        try:
            visit_id = int(visit_id)  # Convert visit_id to integer
            prev_visit_id = visit_id - 1
            print("prev_visit_id", prev_visit_id)
        except ValueError:
            return JsonResponse({'warn': 'Invalid VisitId, must be an integer'})

        prescription_details = OPD_Prescription_Details.objects.filter(
            Patient_Id__PatientId=PatientId,
            VisitId=prev_visit_id,
        )
        print("prescription_details999", prescription_details)
        
        if not prescription_details:
            return JsonResponse({'warn': 'No prescription details found'})
        
        prescription_list = []
        index = 1
        first_detail = prescription_details.first()
        # Fetch the first detail once
        print("first_detail",first_detail)

        for detail in prescription_details:
            print("print",detail)
            prescription_data = {
                'Id': index,
                'Registration_Id': first_detail.Registration_Id.pk,
                'Patient_Id': detail.Patient_Id.PatientId,
                'VisitId': detail.VisitId,
                'GenericId':detail.ItemId.GenericName.GenericName_Id if detail.ItemId.GenericName.GenericName_Id else None,
                'GenericName':detail.ItemId.GenericName.GenericName if detail.ItemId.GenericName.GenericName else None,
                'Itemid': detail.ItemId.pk if detail.ItemId else None,
                'itemtype':detail.ItemId.ProductType.ProductType_Name,
                'ItemName': detail.ItemId.ItemName if detail.ItemId else None,
                'BatchNo':detail.BatchNo.Batch_No if detail.BatchNo else None,
                'frequencyid': detail.FrequencyId.pk if detail.FrequencyId else None,
                'frequencyname': detail.FrequencyId.FrequencyName if detail.FrequencyId else None,
                'frequencytype': detail.FrequencyId.FrequencyType if detail.FrequencyId else None,
                'frequency': detail.FrequencyId.Frequency if detail.FrequencyId else None,
                'Prescription_Id': detail.Prescription_Id,
                'dose': detail.Dosage,
                'route':detail.Route,
                'durationNumber': detail.DurationNumber,
                'durationUnit': detail.DurationUnit,
                'frequencys': detail.Frequency,
                'qty': detail.Qty,

            }
            index += 1
            prescription_list.append(prescription_data)
        
        return JsonResponse(prescription_list, safe=False)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Nurse_Item_Names_Details_all_Link(request):
    try:
        # Filter based on GenericName id using the correct syntax
        Location = request.GET.get('Location', '')

        item_names = Product_Master_All_Category_Details.objects.all()
        print('Items found:', item_names)

        # Prepare response data with required fields
        data = []
        for ins in item_names:
            stock_ins = Stock_Maintance_Table_Detials.objects.filter(
                Q(Store_location__Location_Name__pk=Location) | Q(NurseStation_location__Location_Name__pk=Location),
                Product_Detials__pk=ins.pk,
            ).values('Batch_No', 'Sellable_price').annotate(Availability_qty=Sum('AvailableQuantity'))

            # Check if stock_ins has any items
            if stock_ins.exists():
                for stock in stock_ins:
                    idata = {
                        'ItemName': ins.ItemName,
                        'ItemId': ins.pk,
                        'Batch_No': stock['Batch_No'],
                        'AvailableQuantity': stock['Availability_qty'] if stock['Availability_qty'] else 0,
                        'MRP': int(stock['Sellable_price'] if stock['Sellable_price'] else 0),
                        'Category' : ins.ProductCategory.ProductCategory_Name,
                    }
                    data.append(idata)
            else:
                # No stock entries for this item
                idata = {
                    'ItemName': ins.ItemName,
                    'ItemId': ins.pk,
                    'Batch_No': None,
                    'AvailableQuantity': 0,
                    'MRP': 0
                }
                data.append(idata)

        return JsonResponse(data, safe=False)

    except Exception as e:
        # Handle any exceptions and return an error response
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Nurse_Item_Names_Link(request):
    try:
        Genericid = request.GET.get('Genericnameid', '')
        Location = request.GET.get('Location', '')

        if not Location:
            return JsonResponse({'warn': 'The Location is required.'})

        items = Product_Master_All_Category_Details.objects.all()
        if Genericid:
            items = items.filter(GenericName_id=Genericid)

        data = []

        for ins in items:
            stock_qs = (
                Stock_Maintance_Table_Detials.objects.filter(
                    Q(Store_location__Location_Name__pk=Location) |
                    Q(NurseStation_location__Location_Name__pk=Location),
                    Product_Detials__pk=ins.pk
                )
                .values('Batch_No', 'Sellable_price')
                .annotate(Availability_qty=Sum('AvailableQuantity'))
                .filter(Availability_qty__gt=0)   # ✅ ZERO EXCLUDED HERE
            )

            # ✅ If no stock > 0 → NOTHING added → item not sent to frontend
            for stock in stock_qs:
                data.append({
                    'ItemId': ins.pk,
                    'ItemName': ins.ItemName,
                    'Batch_No': stock['Batch_No'],
                    'AvailableQuantity': stock['Availability_qty'],
                    'MRP': int(stock['Sellable_price'] or 0),
                    'Category': ins.ProductCategory.ProductCategory_Name
                        if ins.ProductCategory else '',
                    'id': ins.GenericName.GenericName_Id
                        if ins.GenericName else '',
                    'GenericName': ins.GenericName.GenericName
                        if ins.GenericName else '',
                })

        return JsonResponse(data, safe=False)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'Internal server error'})

# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Nurse_Item_Names_Link(request):
#     try:
#         # Get the Genericnameid and Location from query parameters
#         Genericid = request.GET.get('Genericnameid', '')
#         Location = request.GET.get('Location', '')
#         print("Genericid:", Genericid)
        
#         if not Genericid:
#             return JsonResponse({'warn': 'The GenericName has no ItemName associated.'})
#         if not Location:
#             return JsonResponse({'warn': 'The Location is required.'})
            
#         # Filter based on GenericName id using the correct syntax
#         item_names = Product_Master_All_Category_Details.objects.filter(GenericName_id=Genericid)
#         print('Items found:', item_names)

#         # Prepare response data with required fields
#         data = []
#         for ins in item_names:
#             stock_ins = Stock_Maintance_Table_Detials.objects.filter(
#                 Q(Store_location__Location_Name__pk=Location) | Q(NurseStation_location__Location_Name__pk=Location),
#                 Product_Detials__pk=ins.pk,
#             ).values('Batch_No', 'Sellable_price').annotate(Availability_qty=Sum('AvailableQuantity'))

#             # Check if stock_ins has any items
#             if stock_ins.exists():
#                 for stock in stock_ins:
#                     idata = {
#                         'ItemName': ins.ItemName,
#                         'ItemId': ins.pk,
#                         'Batch_No': stock['Batch_No'],
#                         'AvailableQuantity': stock['Availability_qty'] if stock['Availability_qty'] else 0,
#                         'MRP': int(stock['Sellable_price'] if stock['Sellable_price'] else 0),
#                         'Category' : ins.ProductCategory.ProductCategory_Name,
#                     }
#                     data.append(idata)
#             else:
#                 # No stock entries for this item
#                 idata = {
#                     'ItemName': ins.ItemName,
#                     'ItemId': ins.pk,
#                     'Batch_No': None,
#                     'AvailableQuantity': 0,
#                     'MRP': 0
#                 }
#                 data.append(idata)

#         return JsonResponse(data, safe=False)

#     except Exception as e:
#         # Handle any exceptions and return an error response
#         print("Exception:", e)
#         return JsonResponse({'error': 'An internal server error occurred'})

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Nurse_Item_Names_All_Link(request):
    try:
        Location = request.GET.get('Location', '')
        
        if not Location:
            return JsonResponse({'warn': 'The Location is required.'})
            
        # Filter based on GenericName id using the correct syntax
        item_names = Product_Master_All_Category_Details.objects.all()
        print('Items found:', item_names)

        # Prepare response data with required fields
        data = []
        for ins in item_names:
            stock_ins = Stock_Maintance_Table_Detials.objects.filter(
                Q(Store_location__Location_Name__pk=Location) | Q(Ward_Store_location__Location_Name__pk=Location),
                Product_Detials__pk=ins.pk,
            ).values('Batch_No', 'Sellable_price',"Expiry_Date").annotate(Availability_qty=Sum('AvailableQuantity'))
            id = 1
            # Check if stock_ins has any items
            if stock_ins.exists():
                for stock in stock_ins:
                    idata = {
                        'id' : id,
                        'ItemName': ins.ItemName,
                        'ItemId': ins.pk,
                        'Batch_No': stock['Batch_No'],
                        'AvailableQuantity': stock['Availability_qty'] if stock['Availability_qty'] else 0,
                        'MRP': int(stock['Sellable_price'] if stock['Sellable_price'] else 0),
                        'Expiry_Date': stock['Expiry_Date'] if stock['Expiry_Date'] else 0,
                        'Category' : ins.ProductCategory.ProductCategory_Name,
                        'GenericName' : ins.GenericName.GenericName,
                    }
                    id = id + 1
                    data.append(idata)
            else:
                # No stock entries for this item
                idata = {
                    'ItemName': ins.ItemName,
                    'ItemId': ins.pk,
                    'Batch_No': None,
                    'AvailableQuantity': 0,
                    'MRP': 0
                }
                data.append(idata)

        return JsonResponse(data, safe=False)

    except Exception as e:
        # Handle any exceptions and return an error response
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'})