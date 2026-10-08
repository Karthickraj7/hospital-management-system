import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from Masters.models import *
from Ip_Workbench.models import *
from Workbench.models import *
from Inventory.models import *
from django.db.models import Sum, Q
from Masters.serializers import *
import pandas as pd
from django.db.models import Q
from datetime import datetime
from .models import *



# @csrf_exempt
# @require_http_methods(["POST","OPTIONS","GET"])
# def Mrd_Scanner(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print(data)

#             Patientid = data.get('PatientId', '')
#             created_by = data.get('userid', '')
#             departments = data.get('departments', '')
#             History = data.get('History', [])
#             timestamp = datetime.now().strftime("%b%d/%Y, %I:%M:%S %p")

#             # Fetch related objects
#             try:
#                 patient = Patient_Detials.objects.get(pk=Patientid)
#             except Patient_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#             try:
#                 user_ins = User.objects.get(pk=created_by)
#             except User.DoesNotExist:
#                 return JsonResponse({'error': 'User not found'}, status=404)

#             try:
#                 department = Department_Detials.objects.get(pk=departments)
#             except Department_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Department not found'}, status=404)
            
#              # Add the timestamp to the History
#             History.append(timestamp)

#             # Create MRD record
#             mrd_record = MRD_Patient(
#                 Patient_Id=patient,
#                 First_Name=patient.FirstName,
#                 Current_Location=department,
#                 Status='Checked In',
#                 History=History,
#                 created_by=user_ins,
#                 created_at=datetime.now()
#             )
#             mrd_record.save()

#             return JsonResponse({'success': 'MRD added successfully', 'mrd_id': mrd_record.id})

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)



# //-----------08.04.2025------------------code //
# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Mrd_Scanner(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print(data)

#             Patientid = data.get('PatientId', '')
#             created_by = data.get('userid', '')
#             departments = data.get('departments', '')
#             History = data.get('History', [])
#             newStatus = data.get('newStatus', '')
#             print(History, "History")
#             print(newStatus, "newStatus")
#             timestamp = datetime.now().strftime("%b%d/%Y, %I:%M:%S %p")

           
#             try:
#                 patient = Patient_Detials.objects.get(pk=Patientid)
#             except Patient_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Patient not found'}, status=404)

#             try:
#                 user_ins = User.objects.get(pk=created_by)
#             except User.DoesNotExist:
#                 return JsonResponse({'error': 'User not found'}, status=404)

#             try:
#                 department = Department_Detials.objects.get(pk=departments)
#                 print(department)
#             except Department_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Department not found'}, status=404)

#             History.append({
#                 'timestamp': timestamp,
#                 'departments': department.Department_Name  
#             })

#             # Create MRD record
#             mrd_record = MRD_Patient(
#                 Patient_Id=patient,
#                 First_Name=patient.FirstName,
#                 Current_Location=department.Department_Name,
#                 Status= newStatus,
#                 History=History,
#                 created_by=user_ins,
#                 created_at=datetime.now()
#             )
#             mrd_record.save()
#             last_history_item = mrd_record.History[-1]

#             return JsonResponse({
#                 'success': 'MRD added successfully',
#                 'mrd_id': mrd_record.pk,
#                 'history': last_history_item,
#             })

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     if request.method =='GET':
#         try:
#             mrd_records = MRD_Patient.objects.all()
#             print(mrd_records, "mrd_records")
#             data =[]
#             for record in mrd_records:

#                 print(record.created_by, "record")

#                 data.append({
#                     'id': record.id,
#                     'Patient_Id': record.Patient_Id.PatientId,
#                     'First_Name': record.First_Name,
#                     'Current_Location': record.Current_Location,
#                     'Status': record.Status,
#                     'History': record.History[-1] if record.History else [],
#                     'created_by': record.created_by,
#                     'created_at': record.created_at.strftime("%b%d/%Y, %I:%M:%S %p"),
#                     'updated_at': record.updated_at.strftime("%b%d/%Y, %I:%M:%S %p") if record.updated_at else None


#                 })
#             return JsonResponse(data=data, safe=False)
#         except Exception as e:
#             print(f"An error occurred:{str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)





@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Mrd_Scanner(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)

            Patientid = data.get('PatientId', '')
            created_by = data.get('userid', '')
            departments = data.get('departments', '')
            History = data.get('History', [])
            newStatus = data.get('newStatus', '')  # ✅ Fix: missing assignment

            print(newStatus, "newStatus")
            timestamp = datetime.now().strftime("%b%d/%Y, %I:%M:%S %p")

            # Patient
            try:
                patient = Patient_Detials.objects.get(pk=Patientid)
            except Patient_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

            # User
            try:
                user_ins = User.objects.get(pk=created_by)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Department
            try:
                department = Department_Detials.objects.get(pk=departments)
                print(department)
            except Department_Detials.DoesNotExist:
                return JsonResponse({'error': 'Department not found'}, status=404)

            try:
                # ✅ Try updating an existing MRD record
                mrd_record = MRD_Patient.objects.get(Patient_Id=patient)

                # Flip status
                status = 'Checked Out' if newStatus == 'Checked In' else 'Checked In'

                new_history_entry = {
                    'timestamp': timestamp,
                    'departments': department.Department_Name,
                    'Status': status  # ✅ Use the flipped status here
                }

                existing_history = mrd_record.History if mrd_record.History else []
                existing_history.append(new_history_entry)

                # Update record
                mrd_record.Current_Location = department
                mrd_record.created_by = user_ins.username
                mrd_record.Status = newStatus
                mrd_record.History = existing_history
                mrd_record.save()

                return JsonResponse({
                    'success': 'MRD record updated successfully',
                    'mrd_id': mrd_record.pk,
                    'history': mrd_record.History,
                })

            except MRD_Patient.DoesNotExist:
                # ✅ If no existing MRD record, create a new one
                mrd_record = MRD_Patient(
                    Patient_Id=patient,
                    First_Name=patient.FirstName,
                    Current_Location=department,
                    Status=newStatus,
                    History=History,
                    created_by=user_ins,
                    created_at=datetime.now()
                )
                mrd_record.save()

                return JsonResponse({
                    'success': 'MRD added successfully',
                    'mrd_id': mrd_record.pk,
                    'history': mrd_record.History,
                })

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            mrd_records = MRD_Patient.objects.all()
            data = []

            for record in mrd_records:
                full_history = record.History if hasattr(record, 'History') else []
                latest_history = full_history[-1] if full_history else None

                data.append({
                    'id': record.id,
                    'Patient_Id': record.Patient_Id.PatientId,
                    'First_Name': record.First_Name,
                    'Current_Location': record.Current_Location.Department_Name if record.Current_Location else None,
                    'Status': record.Status,
                    'full_history': full_history,
                    'latest_history': latest_history,
                    'created_by': record.created_by,
                    'created_at': record.created_at.strftime("%b%d/%Y, %I:%M:%S %p"),
                    'updated_at': record.updated_at.strftime("%b%d/%Y, %I:%M:%S %p") if record.updated_at else None
                })

            return JsonResponse(data=data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


#------------------------------------MRD RACK,SHELF,FILE DETAILS STARTS HERE--------------------------








@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MRD_Rack_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            RackID = data.get("RackID", '')
            RackName = data.get('RackName')
            created_by = data.get('created_by')
            Statusedit = data.get('Statusedit', False)

            if RackID:
                # Update existing rack
                if Statusedit:
                    try:
                        rack = MRD_Rack_Master_Detials.objects.get(pk=RackID)
                        rack.Status = not rack.Status
                        rack.save()
                        return JsonResponse({'success': 'Rack status toggled successfully'})
                    except MRD_Rack_Master_Detials.DoesNotExist:
                        return JsonResponse({'error': 'Rack not found'}, status=404)

                else:
                    if not RackName:
                        return JsonResponse({'warn': 'RackName is a mandatory field'})

                    if MRD_Rack_Master_Detials.objects.filter(Rack_Name=RackName).exclude(pk=RackID).exists():
                        return JsonResponse({'warn': f"The rack name '{RackName}' already exists."})

                    rack = MRD_Rack_Master_Detials.objects.get(pk=RackID)
                    rack.Rack_Name = RackName
                    rack.save()
                    return JsonResponse({'success': 'Rack details updated successfully'})

            else:
                # Create new rack
                if not RackName:
                    return JsonResponse({'warn': 'RackName is a mandatory field'})

                if MRD_Rack_Master_Detials.objects.filter(Rack_Name=RackName).exists():
                    return JsonResponse({'warn': f"The rack name '{RackName}' already exists."})

                rack = MRD_Rack_Master_Detials(
                    Rack_Name=RackName,
                    created_by=created_by
                )
                rack.save()
                return JsonResponse({'success': 'Rack added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            Rack_Master = MRD_Rack_Master_Detials.objects.all()

            Rack_Master_Array = []

            for row in Rack_Master:
                Rack_Master_dic = {
                    "id": row.Rack_Id,
                    "RackName": row.Rack_Name,
                    "Status": row.Status,
                    "created_by": row.created_by,
                    "created_at": row.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    "updated_at": row.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
                }

                Rack_Master_Array.append(Rack_Master_dic)

            return JsonResponse(Rack_Master_Array, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MRD_Shelf_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            ShelfID = data.get('ShelfID', '')
            RackID = data.get('RackName')  # This is Rack_Id
            ShelfName = data.get('ShelfName')
            created_by = data.get('created_by')
            Statusedit = data.get('Statusedit', False)

            # Get rack instance if RackID is provided
            if RackID:
                try:
                    rack_instance = MRD_Rack_Master_Detials.objects.get(pk=RackID)
                except MRD_Rack_Master_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Rack not found'}, status=404)

            # Toggle status if ShelfID and Statusedit are provided
            if ShelfID:
                if Statusedit:
                    try:
                        shelf = MRD_Shelf_Master_Details.objects.get(pk=ShelfID)
                        shelf.Status = not shelf.Status
                        shelf.save()
                        return JsonResponse({'success': 'Shelf status toggled successfully'})
                    except MRD_Shelf_Master_Details.DoesNotExist:
                        return JsonResponse({'error': 'Shelf not found'}, status=404)

                # Update shelf details
                if not ShelfName:
                    return JsonResponse({'warn': 'ShelfName is a mandatory field'})

                if MRD_Shelf_Master_Details.objects.filter(Shelf_Name=ShelfName).exclude(pk=ShelfID).exists():
                    return JsonResponse({'warn': f"The shelf name '{ShelfName}' already exists."})

                shelf = MRD_Shelf_Master_Details.objects.get(pk=ShelfID)
                shelf.Shelf_Name = ShelfName
                shelf.Rack_Name = rack_instance
                shelf.save()
                return JsonResponse({'success': 'Shelf details updated successfully'})

            else:
                # Create new shelf
                if not RackID or not ShelfName:
                    return JsonResponse({'warn': 'RackName and ShelfName are mandatory fields'})

                if MRD_Shelf_Master_Details.objects.filter(Shelf_Name=ShelfName, Rack_Name__Rack_Id=RackID).exists():
                    return JsonResponse({'warn': f"The shelf '{ShelfName}' already exists under this rack."})

                shelf = MRD_Shelf_Master_Details(
                    Shelf_Name=ShelfName,
                    Rack_Name=rack_instance,
                    created_by=created_by
                )
                shelf.save()
                return JsonResponse({'success': 'Shelf added successfully'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            RackID = request.GET.get('RackName')

            shelves = MRD_Shelf_Master_Details.objects.all()

            if RackID:
                shelves = shelves.filter(Rack_Name__Rack_Id=RackID)

            shelf_list = []
            for shelf in shelves:
                shelf_data = {
                    'id': shelf.Shelf_Id,
                    'Shelf_Name': shelf.Shelf_Name,
                    'Rack_Name': shelf.Rack_Name.Rack_Name,
                    'Rack_Id': shelf.Rack_Name.Rack_Id,
                    'Status': shelf.Status,
                    'created_by': shelf.created_by,
                    'created_at': shelf.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    'updated_at': shelf.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
                }
                shelf_list.append(shelf_data)

            return JsonResponse(shelf_list, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        

@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def MRD_File_Detials_link(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_id = data.get("FileID")  # For updating
            print(file_id,'helloo')
            patient_id = data.get("Patient_Id")
            file_name = data.get("File_Name")
            shelf_id = data.get("Shelf_Id")
            file_position = data.get("File_Position")
            booking_status = data.get("Booking_Status", "Available")
            created_by = data.get("created_by")
            status_edit = data.get("Statusedit", False)

            if not patient_id or not file_name or not shelf_id:
                return JsonResponse({'warn': 'Patient_Id, File_Name and Shelf_Id are required fields'})

            shelf_instance = MRD_Shelf_Master_Details.objects.get(pk=shelf_id)
            patient_instance = Patient_Detials.objects.get(pk=patient_id)


            
            if file_id not in [None, ""] and MRD_File_Master_Details.objects.filter(Shelf_Name=shelf_instance,File_Position=file_position).exclude(pk=file_id).exists():
                return JsonResponse({'warn': f"File postion {file_position} already exists in the selected shelf"})

            if file_id:
                file_instance = MRD_File_Master_Details.objects.get(pk=file_id)
                if status_edit:
                    file_instance.Status = not file_instance.Status
                else:
                    file_instance.File_Name = file_name
                    file_instance.Shelf_Name = shelf_instance
                    file_instance.Patient_Id = patient_instance
                    file_instance.File_Position = file_position
                    file_instance.Booking_Status = booking_status
                    file_instance.created_by = created_by
                file_instance.save()
                return JsonResponse({'success': 'File details updated successfully'})
            else:
                if MRD_File_Master_Details.objects.filter(File_Name=file_name, Shelf_Name=shelf_instance).exists():
                    return JsonResponse({'warn': f"File '{file_name}' already exists in the selected shelf"})

                if MRD_File_Master_Details.objects.filter(Shelf_Name=shelf_instance, File_Position=file_position).exists():
                    return JsonResponse({'warn': f"File position {file_position} already exists in the selected shelf"})

                new_file = MRD_File_Master_Details(
                    File_Name=file_name,
                    Shelf_Name=shelf_instance,
                    Patient_Id=patient_instance,
                    File_Position=file_position,
                    Booking_Status=booking_status,
                    created_by=created_by
                )
                new_file.save()
                return JsonResponse({'success': 'File details saved successfully'})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    
    elif request.method == "GET":
        try:
            SearchLocation = request.GET.get('SearchLocation')
            StoreLocation = request.GET.get('StoreLocation')
            RackName = request.GET.get('RackName')
            ShelfName = request.GET.get('ShelfName')
            Statuschek = request.GET.get('Statuschek')
            BookingStatus = request.GET.get('BookingStatus')

            File_Master = MRD_File_Master_Details.objects.all()

           
            if RackName:
                File_Master = File_Master.filter(Shelf_Name__Rack_Name__Rack_Id=RackName)
            if ShelfName:
                File_Master = File_Master.filter(Shelf_Name__Shelf_Id=ShelfName)
            if Statuschek:
                File_Master = File_Master.filter(Status=True)
            if BookingStatus:
                File_Master = File_Master.filter(Booking_Status=BookingStatus)

            File_Master_Array = []

            for row in File_Master:
                file_dict = {
                    'File_Id': row.pk,
                    'File_Name': row.File_Name,
                    'Patient_Id': row.Patient_Id.PatientId,
                    'Patient_Name': row.Patient_Id.FirstName,  # Ensure this field exists
                    'Shelf_Id': row.Shelf_Name.Shelf_Id,
                    'Shelf_Name': row.Shelf_Name.Shelf_Name,
                    'Rack_Id': row.Shelf_Name.Rack_Name.Rack_Id,
                    'Rack_Name': row.Shelf_Name.Rack_Name.Rack_Name,
                    'File_Position': row.File_Position,
                    'Status': row.Status,
                    'Booking_Status': row.Booking_Status,
                }
                File_Master_Array.append(file_dict)

            return JsonResponse(File_Master_Array, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        


@csrf_exempt
@require_http_methods(["GET"])
def get_file_patient_details(request):
    try:
        PatientId = request.GET.get("PatientId", '').strip()
        FirstName = request.GET.get("FirstName", '').strip()
        PhoneNumber = request.GET.get("PhoneNumber", '').strip()

        if not (PatientId or (FirstName and PhoneNumber)):
            return JsonResponse({'warn': 'Please provide valid PatientId or FirstName and PhoneNumber'})

        patient = None

        if PatientId:
            patient = Patient_Detials.objects.filter(
                PatientId=PatientId, DuplicateId=False
            ).first()
        elif FirstName and PhoneNumber:
            patient = Patient_Detials.objects.filter(
                FirstName=FirstName, PhoneNo=PhoneNumber, DuplicateId=False
            ).first()

        if patient:
            return JsonResponse({
                'PatientId': patient.PatientId,
                'FirstName': patient.FirstName,
                'PhoneNo': patient.PhoneNo,
                'File_Name': f"{patient.FirstName}",
                # 'File_Name': f"FILE-{patient.PatientId}",  # Example logic
            })
        else:
            return JsonResponse({'warn': 'Patient not found'})

    except Exception as e:
        print(f"File search error: {str(e)}")
        return JsonResponse({'error': 'Something went wrong. Try again.'})



@csrf_exempt
@require_http_methods(["GET"])
def get_all_patients_list(request):
    try:
        patients = Patient_Detials.objects.filter(DuplicateId=False).values(
            'PatientId', 'FirstName', 'PhoneNo'
        )
        return JsonResponse(list(patients), safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(["GET"])
def MedicalCodingReport(request):
    try:
        Patient_Id = request.GET.get("PatientId", "").strip()
        Register_Id = request.GET.get("RegisterId", "").strip()
        ICDCode = request.GET.get("IcdcCode", "").strip()
        Code_Description = request.GET.get("CodeDescription", "").strip()
        Diagnosis = request.GET.get("Diagnosis", "").strip()
        created_by = request.GET.get("createdby", "").strip()
        created_at = request.GET.get("createdat", "").strip()
 
        DateType = request.GET.get('DateType','').strip()
        CurrentDate = request.GET.get('CurrentDate','').strip()
        FromDate = request.GET.get('FromDate','').strip()
        ToDate = request.GET.get('ToDate','').strip()
 
 
        if DateType == 'Current':
            date_filter = Q(created_at__date=CurrentDate)
         
        else:
            try:
                from_date = datetime.strptime(FromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(ToDate, '%Y-%m-%d').date()
                date_filter = Q( created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
       
 
        queryset = IP_PhysicalDischargeChecklist.objects.filter(date_filter)
 
 
        data_list = []
        for item in queryset:
 
            codeins = IP_Patient_Diagnosis_Data.objects.filter(Register_Id__Registration_Id = item.Ip_Registration_Id.Registration_Id)
 
            for code in  codeins:
 
                data_list.append({
                    "Patient_Id": item.Ip_Registration_Id.PatientId.PatientId,
                    "Patient_Name": f"""{item.Ip_Registration_Id.PatientId.FirstName} {item.Ip_Registration_Id.PatientId.MiddleName} {item.Ip_Registration_Id.PatientId.SurName}""",
                    "Register_Id": item.Ip_Registration_Id.Registration_Id,
                    "ICDCode": code.ICDCode,
                    "Code_Description": code.Code_Description,
                    "Diagnosis": code.Diagnosis,
                    "created_by": code.created_by,
                    "created_at": code.created_at,
                    "updated_at": code.updated_at,
                    "age": item.Ip_Registration_Id.PatientId.Age,
                    "gender": item.Ip_Registration_Id.PatientId.Gender,
                    "speciality": item.Ip_Registration_Id.Specialization.Speciality_Name if item.Ip_Registration_Id.Specialization else "",          
                    "discharge date": item.created_at.strftime("%Y-%m-%d") if item else "",
                    "Admission date" : item.Ip_Registration_Id.created_at.strftime("%Y-%m-%d") if item else "",
               
                })
 
        return JsonResponse({"Status": "Success", "data": data_list}, status=200)
 
    except Exception as e:
        return JsonResponse({"Status": "Error", "Message": str(e)}, status=400)
 
from MCI.models import *
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Change_Mrd_MCI_Test(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("MRDDDDDDDDD",data)
            Test_Name = data.get("Test_Name")
            Dept_Name = data.get("Dept_Name")
            Test_Code = data.get("Test_Code")
            RadiologyId = data.get("RadiologyId")
            reqId = data.get("reqId")
            patientId = data.get("patientId")

            if reqId:
                row = MCI_Radiology_Request_Details.objects.get(Radiology_RequestId = reqId)
                row.SubTestCode = Test_Code
                row.TestCode = RadiologyId
                row.save()

            return JsonResponse({"Status": "Success", "data": "Test Changed Successfully..."}, status=200)

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'error': str(e)})



from django.db.models import Q
 
@csrf_exempt
@require_http_methods(['POST'])
def Change_Mrd_MCI_Lab_Test(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patientId')
            req_id = data.get('reqId')
            tests = data.get('tests', [])
 
            if not patient_id or not req_id or not tests:
                return JsonResponse({"error": "patientId, reqId, and tests are required"}, status=400)
 
            for test in tests:
                old_test_code = test.get('oldTestCode')
                new_test_code = test.get('TestCode')
 
                if not old_test_code or not new_test_code:
                    continue  # Skip if codes are missing
 
                # Update the test code in the relevant MRD Lab table
                itemData = MCI_Lab_Request_Items_Details.objects.filter(Request=req_id).filter(
                    Q(Test_Code__Test_Code=old_test_code) |
                    Q(Group_Code__Group_Code=old_test_code) |
                    Q(Package_Code__package_code=old_test_code)
                )
               
                testMethod = test.get('TestMethod')
                if testMethod == 'Offers':
                    offer = OfferPackageMaster.objects.get(package_code=new_test_code)
                    dept = SubLab_Department_Detials.objects.get(SubDepartment_Name=offer.department_name)
                    itemData.update(Package_Code=offer, SubDepartment_Code =dept)
                elif testMethod == 'Group':
                    group = Group_Master.objects.get(Group_Code=new_test_code)
                    itemData.update(Group_Code=group, SubDepartment_Code=group.Department)    
                else:
                    test_obj = Test_Descriptions.objects.get(Test_Code=new_test_code)
                    itemData.update(Test_Code=test_obj, SubDepartment_Code=test_obj.sub_department)
 
            return JsonResponse({
                "message": "MRD MCI Lab tests updated successfully",
                "status": "success"
            }, status=200)
 
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
 
    return JsonResponse({"error": "POST method required"}, status=405)
 
 
 

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Add_Manual_Mrd_Lab(request):
#     if request.method == "GET":
#         try:
#             department = request.GET.get("department", "").strip()
#             today = datetime.now().date()
 
#             dept_patient = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                 Specialization__Speciality_Id=department).values() 
            
#             patient_list = []
#             for patient in dept_patient:
#                 if len(patient_list) >= 100:
#                     break
#                 print("patient",patient)
#                 op_ins = MCI_Patient_Appointment_Registration_Detials.objects.filter(pk=patient["Registration_Id_id"]).first()
#                 if op_ins:
#                     patient_list.append({
#                         "OpNo": patient["Registration_Id_id"],
#                         "PatientId": op_ins.PatientId.PatientId,
#                         "FirstName": op_ins.PatientId.FirstName,
#                         "Age": op_ins.PatientId.Age,
#                         "PhoneNo": op_ins.PatientId.PhoneNo,
#                     })
                
            
#             return JsonResponse({'data': patient_list})
        
#         except Exception as e:
#             print("Error:", str(e))
#             return JsonResponse({'error': str(e)})

#     if request.method == "POST":    
#         try:
#             data = json.loads(request.body)
#             print("data",data)
#             date = data["date"]
#             patientId = data["PatientId"]
#             registerNo = data["Register_No"]
#             created_by = data["createdby"]
#             tests = data["tests"]
#             location = Location_Detials.objects.get(Location_Id=data["location"])

#             if not patientId or not tests or not registerNo:
#                 return JsonResponse({"error": "patientId and tests are required"}, status=400)

#             OP_Patient = MCI_Patient_Appointment_Registration_Detials.objects.get(pk=registerNo)
#             register_kwargs = {
#                     "RegisterType": "WALK-IN",
#                     "OP_Register_Id": OP_Patient,
#                     "created_by": created_by,
#                     "Location": location
#                 }

#             lab_request = MCI_Lab_Request_Details.objects.create(**register_kwargs)
#             lab_request.save()
#             print("✅ Lab request created")
#             for test in tests:
#                 NextItemID = (
#                     MCI_Lab_Request_Items_Details.objects
#                     .annotate(item_id_int=Cast("Item_Id", IntegerField()))
#                     .aggregate(max_id=Max("item_id_int"))["max_id"] or 0
#                 ) + 1

#                 SubDepartment_Code = None
#                 Department_Code = None
#                 if test["Code"].startswith("PAC"):
#                     types = "Offers"
#                     OffersCode = test["Code"]
#                     offer = OfferPackageMaster.objects.get(package_code=OffersCode)
#                     department = SubLab_Department_Detials.objects.get(SubDepartment_Name=offer.department_name)
#                     SubDepartment_Code = department.SubDepartment_Code,
#                     Department_Code = department.department.Department_Code,
                    
#                 elif test["Code"].startswith("LGM"):
#                     types = "Group"
#                     GroupCode = test["Code"]
#                     group = Group_Master.objects.get(Group_Code=GroupCode)
#                     SubDepartment_Code = group.Department.SubDepartment_Code,
#                     Department_Code = group.Department.department.Department_Code,

#                 else:
#                     types = "individual"
#                     individualCode = test["Code"]
#                     test_obj = Test_Descriptions.objects.get(Test_Code=individualCode)
#                     SubDepartment_Code = test_obj.sub_department.SubDepartment_Code,
#                     Department_Code = test_obj.department.Department_Code,

#                 print(SubDepartment_Code,Department_Code)
#                 Sub_dept = SubLab_Department_Detials.objects.get(SubDepartment_Code=SubDepartment_Code[0])
#                 dept = Lab_Department_Detials.objects.get(Department_Code=Department_Code[0])

#                 # Convert to string if Item_Id is a CharField
#                 lab_request_item_data = {
#                     "Item_Id": str(NextItemID),
#                     "Request": lab_request,
#                     "TestType": types,
#                     "Service_Status": "Completed",
#                     "Analysis_Status": "Completed",
#                     "Verify_Status": "Completed",
#                     "Approve_Status": "Completed",
#                     "SubDepartment_Code":Sub_dept,
#                     "Department_Code": dept,
#                     "Test_Code":test_obj if types == "individual" else None,
#                     "Group_Code":group if types == "Group" else None,
#                     "Package_Code":offer if types == "Offers" else None
#                 }

#                 MCI_Lab_Request_Items_Details.objects.create(**lab_request_item_data)

#             print(f"✅ Lab request created for patient ID {OP_Patient.pk}")
            
#             print("tests",tests)
 
#             return JsonResponse({
#                 "message": "MRD Lab Patient added successfully",
#                 "type": "success"
#             })
 
#         except Exception as e:
#             print("Error:", str(e))
#             return JsonResponse({
#                     "message": str(e),
#                     "type": "error"
#                 }, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Add_Manual_Mrd_Lab(request):
    if request.method == "GET":
        try:
            patientType = request.GET.get("type")
            department = request.GET.get("department", "").strip()
            patient_list = []
            if patientType == "OP":
                dept_patient = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Specialization__Speciality_Id=department
                ).order_by("-created_at").values()

                for patient in dept_patient:

                    op_ins = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                        pk=patient["Registration_Id_id"]
                    ).first()


                    if op_ins and op_ins.PatientId:
                        patient_list.append({
                            "No": patient["Registration_Id_id"],
                            "PatientId": op_ins.PatientId.PatientId,
                            "FirstName": op_ins.PatientId.FirstName,
                            "Age": op_ins.PatientId.Age,
                            "PhoneNo": op_ins.PatientId.PhoneNo,
                            'Type' : 'OP'
                        })

            if patientType == "IP":
                ip_patients = MCI_Patient_IP_Registration_Detials.objects.filter(
                    Specialization__Speciality_Id=department,Status="Admitted"
                ).order_by("-created_at")

                for ip in ip_patients:


                    if ip:

                        patient_list.append({
                            "No": ip.IPNo,
                            "PatientId": ip.PatientId.PatientId,
                            "FirstName": ip.PatientId.FirstName,
                            "Age": ip.PatientId.Age,
                            "PhoneNo": ip.PatientId.PhoneNo,
                            'Type' : 'IP'
                        })

            return JsonResponse({"data": patient_list})

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            Rdate = data.get("date")
            Rtime = data.get("time")
            registerNo = data.get("Register_No")
            patientId = data.get("PatientId")
            created_by = data.get("createdby")
            tests = data.get("tests")
            location = Location_Detials.objects.get(Location_Id=data["location"])
            patientType = data.get("type")

            print("ddddddddddd",Rdate,Rtime)

            created_at = datetime.strptime(f"{Rdate} {Rtime}", "%Y-%m-%d %H:%M")
            print("ddddddddddd",created_at)
            if not registerNo or not tests:
                return JsonResponse({"error": "Register_No and tests are required"}, status=400)

            Patient = None
            try:
                print(registerNo)
                if patientType == "OP":
                    Patient = MCI_Patient_Appointment_Registration_Detials.objects.filter(pk=registerNo).first()
                elif patientType == "IP":
                    Patient = MCI_Patient_IP_Registration_Detials.objects.filter(IPNo=registerNo).first()
            except Exception as e:
                return JsonResponse({"error": str(e)})
            
            register_kwargs = None
            if Patient:
                register_kwargs = {
                    "RegisterType": patientType or "Walk-in",
                    "OP_Register_Id": Patient if patientType == "OP" else None,
                    "IP_Register_Id": Patient if patientType == "IP" else None,
                    "created_by": created_by,
                    "Location": location,
                    "created_at": created_at,
                    "updated_at": created_at,
                }   

            lab_request = None
            if register_kwargs:
                lab_request = MCI_Lab_Request_Details.objects.create(**register_kwargs)
                lab_request.save()
            
            if not lab_request:
                return JsonResponse({"error": "Register_No is required"}, status=400)
            
            print("✅ Lab request created")

            for test in tests:
                NextItemID = (
                    MCI_Lab_Request_Items_Details.objects
                    .annotate(item_id_int=Cast("Item_Id", IntegerField()))
                    .aggregate(max_id=Max("item_id_int"))["max_id"] or 0
                ) + 1

                SubDepartment_Code = None
                Department_Code = None
                test_obj = group = offer = None

                if test["Code"].startswith("PAC"):
                    types = "Offers"
                    offer = OfferPackageMaster.objects.get(package_code=test["Code"])
                    department_obj = SubLab_Department_Detials.objects.get(SubDepartment_Name=offer.department_name)
                    SubDepartment_Code = department_obj.SubDepartment_Code
                    Department_Code = department_obj.department.Department_Code

                elif test["Code"].startswith("LGM"):
                    types = "Group"
                    group = Group_Master.objects.get(Group_Code=test["Code"])
                    SubDepartment_Code = group.Department.SubDepartment_Code
                    Department_Code = group.Department.department.Department_Code

                else:
                    types = "individual"
                    test_obj = Test_Descriptions.objects.get(Test_Code=test["Code"])
                    SubDepartment_Code = test_obj.sub_department.SubDepartment_Code
                    Department_Code = test_obj.department.Department_Code

                Sub_dept = SubLab_Department_Detials.objects.get(SubDepartment_Code=SubDepartment_Code)
                dept = Lab_Department_Detials.objects.get(Department_Code=Department_Code)

                MCI_Lab_Request_Items_Details.objects.create(
                    Item_Id=str(NextItemID),
                    Request=lab_request,
                    TestType=types,
                    Service_Status="Completed",
                    Analysis_Status="Completed",
                    Verify_Status="Completed",
                    Approve_Status="Completed",
                    SubDepartment_Code=Sub_dept,
                    Department_Code=dept,
                    Test_Code=test_obj if types == "individual" else None,
                    Group_Code=group if types == "Group" else None,
                    Package_Code=offer if types == "Offers" else None,
                    updated_at= created_at,
                    created_at= created_at
                )

            return JsonResponse({
                "message": "MRD Lab Patient added successfully",
                "type": "success"
            })

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({
                "message": str(e),
                "type": "error"
            }, status=500)



