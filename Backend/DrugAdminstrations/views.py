from django.shortcuts import render
import json
from django.http import JsonResponse
from django.db import connection, transaction
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import pytz
from datetime import datetime, timedelta, time, date  
from apscheduler.schedulers.background import BackgroundScheduler


# Create your views here.

from .models import *


def get_barcodeid_for_prescription(current_max_id, prefix='PRI'):
    numeric_part = int(current_max_id.replace(prefix, '')) + 1
    new_id = f"{prefix}{str(numeric_part).zfill(7)}"
    return new_id




def get_prescription_master_code(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                next_id = 'PRI0000001'  # Default initial value

                # Ensure your SQL syntax and table/column names match your schema
                max_id_query = "SELECT MAX(PrescriptionBarcode) FROM IP_Drug_Administration"
                cursor.execute(max_id_query)
                max_id_result = cursor.fetchone()

                if max_id_result and max_id_result[0]:
                    next_id = get_barcodeid_for_prescription(max_id_result[0])

                response = {
                    "message": "Success",
                    "nextInvoiceCode": next_id
                }

                return JsonResponse(response)

        except Exception as e:
            print(e)
            # Consider using Django's logging here for better error tracking
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'})

@csrf_exempt
def insert_Drug_Administration_datas(request):
    try:
        if request.method == 'POST':
            json_data = json.loads(request.body)

            # Get the maximum Prescription_Id from the IP_Drug_Administration table
            with connection.cursor() as cursor:
                cursor.execute("SELECT MAX(Prescription_Id) FROM IP_Drug_Administration")
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

            # Insert data into the IP_Drug_Administration table
            with transaction.atomic():
                for prescription in json_data:
                    booking_id = prescription.get('Booking_Id')
                    Department = prescription.get('Department')
                    DoctorName = prescription.get('DoctorName')
                    GenericName = prescription.get('GenericName')
                    MedicineCode = prescription.get('MedicineCode')
                    MedicineName = prescription.get('MedicineName')
                    Dosage = prescription.get('Dosage')
                    Route = prescription.get('Route')
                    FrequencyMethod = prescription.get('FrequencyMethod')
                    FrequencyType = prescription.get('FrequencyType')
                    Frequency = prescription.get('Frequency')
                    FrequencyTime = prescription.get('FrequencyTime')
                    Duration = prescription.get('Duration')
                    DurationType = prescription.get('DurationType')
                    Quantity = prescription.get('Quantity')
                    AdminisDose = prescription.get('AdminisDose')
                    Date = prescription.get('Date')
                    Time = prescription.get('Time')
                    Instruction = prescription.get('Instruction')
                    prescriptionbar = prescription.get('priscriptionid')
                    Location = prescription.get('Location')
                    CapturedBy = prescription.get('CapturedBy')
                    Status = 'Pending'
                    RequestType = 'Pending'
                    Specialization = prescription.get('Specialization')
                    issued_type = prescription.get('Onbehalf')
                    issuedby = prescription.get('Prescribedby')

                    # Debugging: Print the parameters to check for issues
                    print("Params: ", next_id, booking_id, Department, DoctorName, GenericName, MedicineCode, MedicineName,
                          Dosage, Route, Frequency, FrequencyMethod, FrequencyType, FrequencyTime, Duration, DurationType,
                          Quantity, Date, Time, Instruction, Location, CapturedBy, Status, AdminisDose, RequestType,
                          prescriptionbar, Specialization, issued_type, issuedby)

                    # Insert the data
                    query = """INSERT INTO IP_Drug_Administration 
                                (Prescription_Id, Booking_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, Dosage, Route, Frequency, FrequencyMethod, FrequencyType, FrequencyTime, Duration, DurationType, Quantity, Date, Time, Instruction, Location, CapturedBy, Status, AdminisDose, RequestType, PrescriptionBarcode, Specialization, IssuedType, IssuedBy) 
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
                    params = (
                        next_id, booking_id, Department, DoctorName, GenericName, MedicineCode, MedicineName, Dosage, Route, Frequency,
                        FrequencyMethod, FrequencyType, FrequencyTime, Duration, DurationType, Quantity, Date, Time, Instruction, Location,
                        CapturedBy, Status, AdminisDose, RequestType, prescriptionbar, Specialization, issued_type, issuedby
                    )

                    # Execute the query with the parameters
                    with connection.cursor() as cursor:
                        cursor.execute(query, params)

                    # Increment the next_id for the next prescription
                    next_id += 1

            return JsonResponse({'message': 'Data inserted successfully'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



def getgenericname(request):
    try:
        with connection.cursor() as cursor:

        # Fetching generic names from Medical_ProductMaster_information
            pharmacy_query = """
                SELECT DISTINCT
                    GenericName
                FROM
                    medical_productmaster_information
                WHERE
                    Productcategory_Type IN ('MedicalNonConsumable', 'MedicalConsumable')
            """
            cursor.execute(pharmacy_query)
            quick_stock_info = cursor.fetchall()

            # Convert the result into a list of dictionaries
            medical_stock_info_list = [{'GenericName': row[0]} for row in quick_stock_info]

            

            return JsonResponse(medical_stock_info_list, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    finally:
        cursor.close()
        



def getitemname_bygenericname(request):
    try:
        with connection.cursor() as cursor:

            genericName = request.GET.get('genericName')
            location = request.GET.get('location')
            
            # Fetching generic names from Medical_ProductMaster_information
            cursor.execute( """
                SELECT DISTINCT
                    ProductName,ProductCode
                FROM
                    Medical_ProductMaster_information
                WHERE
                    Productcategory_Type IN ('MedicalNonConsumable', 'MedicalConsumable') and
                    GenericName=%s and Location=%s
            """,[genericName,location])
        
            quick_stock_info = cursor.fetchall()
            
            print('-----',quick_stock_info)
            medical_stock_info_list = [{'ItemName': row[0],'ItemCode': row[1]} for row in quick_stock_info]
            print('medical_stock_info_list :',medical_stock_info_list)
            
            # Fetching available quantity from pharmacy_stock_location_information
            if len(medical_stock_info_list) > 0:
                for item in medical_stock_info_list:
                    Item_Name = item['ItemName']
                    Item_Code = item['ItemCode']
                    cursor.execute("""
                        SELECT COALESCE(SUM(AvailableQuantity), 0)
                        FROM pharmacy_stock_location_information
                        WHERE  ExpiryStatus != 'Expired' AND AvailableQuantity != 0 
                        AND Item_Name=%s AND Item_Code= %s
                        AND  ProductcategoryType IN ('MedicalNonConsumable', 'MedicalConsumable')
                    """,[Item_Name, Item_Code])
                    
                    stock_info = cursor.fetchone()
                    item['AvailableQuantity'] = stock_info[0]
            else:
                cursor.execute( """
                SELECT DISTINCT
                    ProductName,ProductCode
                FROM
                    Medical_ProductMaster_information
                WHERE
                    Productcategory = 'Medical' and
                    GenericName=%s
            """,[genericName])
        
                quick_stock_info = cursor.fetchall()
            
                print('-----',quick_stock_info)
                medical_stock_info_list = [{'ItemName': row[0],'ItemCode': row[1], 'AvailableQuantity': 0} for row in quick_stock_info]

            print('medical_stock_info :',medical_stock_info_list)
            return JsonResponse(medical_stock_info_list, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    finally:
        cursor.close()





def getDose_By_Itemname(request):
    try:
        with connection.cursor() as cursor:

            selectedItemname = request.GET.get('selectedItemname')
            location = request.GET.get('location')
            print('selectedItemname : ', selectedItemname)

            
            select_query = """
            SELECT  distinct Strength, UOM, ProductType FROM Medical_ProductMaster_information WHERE ProductCode = %s 
            """

            cursor.execute(select_query, (
                selectedItemname,
            ))
            row = cursor.fetchone()

            # Convert the result into a list of dictionaries
            medical_stock_info_list = {}
        
            strength = row[0] if row[0] else ''
            uom = row[1] if row[1] else ''
            medical_stock_info_list['dose'] = f"{strength} {uom}" if strength or uom else ''
            medical_stock_info_list['Pack_type'] = row[2]

            return JsonResponse(medical_stock_info_list)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error':
                             'An internal server error occurred'}), 500
    finally:
        cursor.close()




def get_for_ip_durgs_doctor_show(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:


                Booking_id = request.GET.get('Booking_id')
                current_time = datetime.now()
                current_date = current_time.date()
                # previous_day = current_time - timedelta(days=1)
                # previous_date = previous_day.date()

                query = """
                        SELECT distinct Prescription_Id,Booking_Id,Department,DoctorName,GenericName,
                        MedicineCode,MedicineName,Dosage,Route,FrequencyMethod,Issued_Date,Location,AdminisDose,
                        DATE(Complete_Date) AS CreatedDate FROM IP_Nurse_Drug_Completed_Administration WHERE Booking_Id = %s 
                        """         
                cursor.execute(query, (Booking_id,))
                result = cursor.fetchall()
                show_list = []
                print('result :',result)
                for row in result:
                    select=""" select FrequencyIssued,Complete_Time,Completed_Remarks,Status,CapturedBy,Complete_Date from IP_Nurse_Drug_Completed_Administration where Prescription_Id=%s and Booking_Id=%s and Issued_Date=%s"""
                    cursor.execute(select,(row[0],row[1],row[10]))
                    seleress=cursor.fetchall()
                    arrr=[]
                    for reee in seleress:
                        dat={
                            'FrequencyIssued':reee[0],
                            'Completed_Time':reee[1],
                            'Completed_Remarks':reee[2],
                            'Status':reee[3],
                            'CapturedBy':reee[4],
                            'Completed_Date':reee[5],
                        }
                        arrr.append(dat)
                    show_data = {
                        "Prescibtion_Id": row[0],
                        "Booking_Id"  : row[1],
                        "Department": row[2],
                        "DoctorName" : row[3],
                        "GenericName": row[4],
                        "MedicineCode" : row[5],
                        "MedicineName": row[6]+' '+row[7],
                        "Route" : row[8],
                        "FrequencyIssued" : arrr,
                        "FrequencyMethod" : row[9],
                        "PrescribedDate" : row[10],
                        "IssuedDate" : row[10],
                        "Location": row[11],
                        "AdminisDose" : row[12]
                    } 
                    show_list.append(show_data)
                
                return JsonResponse(show_list,safe=False)

        except Exception as er:
            return JsonResponse({"Error Acquired:": str(er)})
        finally:
            cursor.close()




def get_for_doc_drugs_nurse_request(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                Bookingid = request.GET.get('Bookingid')
                Status = 'Pending'
                location = request.GET.get('Location')  # Currently unused but retrieved

                issued_all_drug = []

                request_query = """
                    SELECT Booking_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, Dosage, Route,
                           Quantity, Frequency, FrequencyTime, Prescription_Id, PrescriptionBarcode
                    FROM IP_Drug_Administration
                    WHERE Booking_Id = %s AND Status = %s AND RequestType = 'Pending'
                """
                
                cursor.execute(request_query, (Bookingid, Status))
                drug_details = cursor.fetchall()

                # Processing the drug details
                for drug in drug_details:
                    issued_drug = {
                        'BookingId': drug[0],
                        'Department': drug[1],
                        'DoctorName': drug[2],
                        'GenericName': drug[3],
                        'MedicineCode': drug[4],
                        'MedicineName': drug[5],
                        'Dosage': drug[6],
                        'Route': drug[7],
                        'Quantity': drug[8],
                        'Frequency': drug[9],
                        'FrequencyTime': drug[10],
                        'PrescriptionId': drug[11],  # Corrected the spelling from 'PrescibtionId'
                        'Prescription_Barcode': drug[12]  # Corrected the spelling
                    }
                    issued_all_drug.append(issued_drug)

                # Return the result as JSON
                return JsonResponse(issued_all_drug, safe=False)

        except Exception as e:
            # Return the error message correctly
            return JsonResponse({"Error": str(e)}, status=500)       




def job_function():
    try:
        # Fetch drug administration details
        with connection.cursor() as cursor:
            query = "SELECT * FROM IP_Drug_Administration"
            cursor.execute(query)
            result = cursor.fetchall()
            print('Query result:', result)
    
            for row in result:
                if row[9] == 'Regular':
                    tablet_duration_days = int(row[13])
                    frequency_times = row[12].split(',')
                    print(frequency_times)
                    tablet_frequency_time = [(int(hour), 0) for hour in frequency_times]
                    
                    # Check if row[17] is already a datetime.date object, if not parse it
                    if isinstance(row[17], datetime):
                        start_date = row[17].date()
                    else:
                        start_date = datetime.strptime(row[17], "%Y-%m-%d").date()

                    # Check if row[18] is already a datetime.time object, if not parse it
                    if isinstance(row[18], time):
                        start_time = row[18]
                    else:
                        start_time = datetime.strptime(row[18], "%H:%M:%S").time()

                    for day_offset in range(tablet_duration_days):
                        current_date = start_date + timedelta(days=day_offset)
                        tablet_times = []

                        for freq_time in tablet_frequency_time:
                            tablet_datetime = datetime.combine(current_date, time(freq_time[0], freq_time[1]))
                            if tablet_datetime.time() < start_time:
                                tablet_datetime += timedelta(days=1)
                            tablet_times.append(tablet_datetime)

                        if tablet_times:
                            tablet_times.sort()
                            today_date = datetime.now(pytz.utc).date()

                            # Update pending requests
                            update_query = """
                                UPDATE IP_Nurse_Drug_Completed_Administration
                                SET Status = 'NotIssued'
                                WHERE Status = 'Pending' AND Issued_Date < %s
                            """
                            cursor.execute(update_query, (today_date,))

                            for tablet_time in tablet_times:
                                if today_date == tablet_time.date():
                                    tablet_issue = int(tablet_time.strftime("%H"))
                                    tablet_date_issue = tablet_time.date()
                                    print('Tablet issue date:', tablet_date_issue)

                                    # Check pending status and handle accordingly
                                    if row[20] == 'Pending':
                                        print('hiiiiiiiiiiiiiiiiiiiiiii')
                                        if row[25] == 'Outsourced':
                                            print('summa kupitu pathaa outsource')
                                            handle_outsourced_request(cursor, row, tablet_issue, tablet_date_issue)
                                        elif row[25] == 'Inhouse':
                                            print('summa kupitu pathaa Inhouse')
                                            handle_inhouse_request(cursor, row, tablet_issue, tablet_date_issue)

    except Exception as e:
        print(f"Error in job_function: {e}")
        # Use Django's logging for better error tracking

# Other functions (handle_outsourced_request and handle_inhouse_request) remain the same

# Create and configure scheduler
sched = BackgroundScheduler()

# Calculate next run time for 08:08
now = datetime.now()
next_run_time = datetime.combine(now, time(8, 8))

# Schedule the job function
sched.add_job(job_function, "date", run_date=next_run_time)


def handle_outsourced_request(cursor, row, tablet_issue, tablet_date_issue):
    """Handles outsourced drug requests."""
    cursor.execute("SELECT MAX(Nurse_Prescription_Id) FROM Ip_Nurse_Drug_Completed_Administration")
    max_id = cursor.fetchone()[0]
    next_id = max_id + 1 if max_id is not None else 1

    query_drug = """
        SELECT * FROM IP_Nurse_Drug_Completed_Administration 
        WHERE Prescription_Id = %s AND Booking_Id = %s AND FrequencyIssued = %s AND Issued_Date = %s
    """
    cursor.execute(query_drug, (row[0], row[1], tablet_issue, tablet_date_issue))
    result_out = cursor.fetchone()

    if result_out is None:
        insert_query = """
            INSERT INTO IP_Nurse_Drug_Completed_Administration
            (Nurse_Prescription_Id, Prescription_Id, Booking_Id, Department, DoctorName, GenericName, 
             MedicineCode, MedicineName, Dosage, Route, FrequencyIssued, FrequencyMethod, Quantity, Issued_Date, 
             Complete_Date, Complete_Time, Completed_Remarks, Status, Location, CapturedBy, AdminisDose)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (next_id, row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],
                                      tablet_issue, row[9], '1', tablet_date_issue, '', '', '', 'Pending', row[21], '', row[16]))
        connection.commit()


def handle_inhouse_request(cursor, row, tablet_issue, tablet_date_issue):
    """Handles in-house drug requests."""
    if row[22] == 'Daily':
        cursor.execute("SELECT MAX(Drug_Request_Id) FROM ip_drug_request_table")
        max_id_req = cursor.fetchone()[0]
        next_id_req = max_id_req + 1 if max_id_req is not None else 1

        query_drug = """
            SELECT * FROM ip_drug_request_table 
            WHERE Prescibtion_Id = %s AND Booking_Id = %s AND Date = %s
        """
        cursor.execute(query_drug, (row[0], row[1], tablet_date_issue))
        result_in = cursor.fetchone()
        print
        if result_in is None:
            remaining = int(row[15]) - int(row[23])
            insert_inhouse = """
                INSERT INTO ip_drug_request_table 
                (Drug_Request_Id, Booking_Id, Prescibtion_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, 
                 Dosage, Route, RequestType, Quantity, RequestQuantity, RemainingQuantity, Location, CreatedBy, Status, 
                 Priscription_Barcode, Duration, DurationType, Date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_inhouse, (next_id_req, row[1], row[0], row[2], row[3], row[4], row[5], row[6], row[7],
                                            row[8], row[22], row[15], row[23], remaining, row[21], row[21], 'Pending',
                                            row[26], row[13], row[14], tablet_date_issue))
            connection.commit()
        elif  result_in[19] == "Received":
                query_drug = """
                        SELECT * FROM IP_Nurse_Drug_Completed_Administration 
                        WHERE Prescription_Id = %s AND Booking_Id = %s AND FrequencyIssued = %s AND Issued_Date = %s
                """
                cursor.execute(query_drug, (row[0], row[1], tablet_issue, tablet_date_issue))
                result_out1 = cursor.fetchone()
                if result_out1 is None:
                    cursor.execute("""SELECT MAX(Nurse_Prescription_Id) FROM IP_Nurse_Drug_Completed_Administration""")
                    max_id = cursor.fetchone()[0]
                    next_id1 = max_id + 1 if max_id is not None else 1
                    insert_query = """
                INSERT INTO IP_Nurse_Drug_Completed_Administration(Nurse_Prescription_Id, Prescription_Id, Booking_Id, Department, DoctorName, GenericName,
                MedicineCode, MedicineName, Dosage, Route, FrequencyIssued, FrequencyMethod, Quantity, Issued_Date, Complete_Date, Complete_Time, 
                Completed_Remarks, Status, Location, CapturedBy, AdminisDose)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                    cursor.execute(insert_query, (next_id1, row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], tablet_issue, row[9], '1',
                                                    tablet_date_issue, '', '', '', 'Pending', row[21], '', row[16]))
                    connection.commit()

    elif row[22] == 'Total':
            cursor.execute("""SELECT MAX(Drug_Request_Id) FROM Ip_Drug_Request_Table""")
            max_id_req = cursor.fetchone()[0]
            next_id_req = max_id_req + 1 if max_id_req is not None else 1
            query_drug = """
                SELECT * FROM Ip_Drug_Request_Table 
                WHERE Prescibtion_Id = %s AND Booking_Id = %s 
            """
            cursor.execute(query_drug, (row[0], row[1]))
            result_in1 = cursor.fetchone()
            if result_in1 is None:  # Check if result_in is not None
                remaining = int(row[15]) - int(row[23])
                insert_inhouse = """
                    INSERT INTO Ip_Drug_Request_Table (Drug_Request_Id, Booking_Id, Prescibtion_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, 
                    Dosage, Route, RequestType, Quantity, RequestQuantity, RemainingQuantity, Location, CreatedBy, Status, Priscription_Barcode, Duration, DurationType, Date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_inhouse, (next_id_req, row[1], row[0], row[2], row[3], row[4], row[5], row[6], row[7],
                                            row[8], row[22], row[15], row[23], remaining, row[21], row[21], 'Pending',
                                            row[26], row[13], row[14], tablet_date_issue))
                connection.commit()
            elif result_in1[19] == "Received":
                query_drug = """
                        SELECT * FROM IP_Nurse_Drug_Completed_Administration 
                        WHERE Prescibtion_Id = %s AND Booking_Id = %s AND FrequencyIssued = %s AND Issued_Date = %s
                """
                cursor.execute(query_drug, (row[0], row[1], tablet_issue, tablet_date_issue))
                result_out1 = cursor.fetchone()
                if result_out1 is None:
                    cursor.execute("""SELECT MAX(Prescibtion_Issue_Id) FROM IP_Nurse_Drug_Completed_Administration""")
                    max_id = cursor.fetchone()[0]
                    next_id1 = max_id + 1 if max_id is not None else 1
                    insert_query = """
                INSERT INTO IP_Nurse_Drug_Completed_Administration(Prescibtion_Issue_Id, Prescibtion_Id, Booking_Id, Department, DoctorName, GenericName,
                MedicineCode, MedicineName, Dosage, Route, FrequencyIssued, FrequencyMethod, Quantity, Issuing_Date, Completed_Date, Completed_Time, 
                Completed_Remarks, Status, Location, CapturedBy, AdminisDose)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                    cursor.execute(insert_query, (next_id1, row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], tablet_issue, row[9], '1',
                                                    tablet_date_issue, '', '', '', 'Pending', row[21], '', row[16]))
                    connection.commit()


# Create and configure scheduler
sched = BackgroundScheduler()


# Calculate next run time for 08:08
now = datetime.now()
next_run_time = datetime.combine(now, time(8, 8))

# Schedule the job function
sched.add_job(job_function, "date", run_date=next_run_time)

# Start the scheduler
sched.start()


@csrf_exempt
def insert_nurse_request_drugs(request):
    if request.method == 'POST':
        try:
            # Load the JSON data from the request body
            data = json.loads(request.body)
            print(data)

            # Extract the nested dictionary under key '0'
            details = data.get('0', {})

            # Extract the necessary fields from the nested dictionary
            booking_id = details.get('BookingId')
            medicine_name = details.get('MedicineName')
            prescription_id = details.get('PrescriptionId')  # Corrected key from 'PrescibtionId' to 'PrescriptionId'
            order_type = data.get('ordertype')
            issued_quantity = data.get('issuedquantity')
            request_time = data.get('requesttime')
            request_type = data.get('requesttype')

            # Update query
            sql_query = """
                UPDATE IP_Drug_Administration 
                SET RequestType = %s, RequestQuantity = %s, RequestDate = %s, BillingMethod = %s
                WHERE Booking_Id = %s AND Prescription_Id = %s
            """

            # Execute the SQL query using a cursor
            with connection.cursor() as cursor:
                cursor.execute(sql_query, (order_type, issued_quantity, request_time, request_type, booking_id, prescription_id))
                job_function()  # Assuming this is a function call that does additional work

            # Return a success message
            return JsonResponse({'message': 'Data received and updated successfully.'})

        except Exception as e:
            # Catch any exceptions and return the error message
            return JsonResponse({"Error": str(e)})

    else:
        # Return an error if the request is not a POST request
        return JsonResponse({"Error": "Only POST requests are allowed."})



from datetime import date


def get_completed_prescribed_medicine(request):
    if request.method == 'GET':
        cursor = None
        try:
            cursor = connection.cursor()
            
            # Get the current date using 'date.today()'
            current_date = date.today()
            print('current_date:', current_date)
            
            # Separate date and time components
            current_date_str = current_date.strftime('%Y-%m-%d')
            print('current_date_str:', current_date_str)
            
            get_medicine = """
                SELECT Booking_Id, Prescibtion_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, Dosage, Route, RecivedQuantity, Priscription_Barcode
                FROM Ip_Drug_Request_Table
                WHERE DATE(Date) = %s AND Status = 'Completed'
            """
            cursor.execute(get_medicine, (current_date_str,))
            data_fetch = cursor.fetchall()
            print(data_fetch)
            datas = []
            for row in data_fetch:
                data = {
                    'BookingId': row[0],
                    'PrescriptionId': row[1],
                    'Department': row[2],
                    'DoctorName': row[3],
                    'GenericName': row[4],
                    'MedicineCode': row[5],
                    'MedicineName': row[6],
                    'Dosage': row[7],
                    'Route': row[8],
                    'RecivedQuantity': row[9],
                    'barcode': row[10]
                }
                datas.append(data)
            
            return JsonResponse(datas, safe=False)
        
        except Exception as e:
            # Log the error for debugging purposes
            print("Error:", e)
            return JsonResponse({"Error": "An error occurred while processing your request."})
        
        finally:
            if cursor:
                cursor.close()






# def inhouse_pharmacy_queue_list_prescrib(request):
#     if request.method == 'GET':
#         try:
#             with connection.cursor() as cursor:

#                 location = request.GET.get('location')
#                 fetchdata = []
#                 get_query = """
#                             SELECT DISTINCT ir.Booking_Id, ir.PatientName, irb.RoomId, irb.RoomNo, ird.Priscription_Barcode, ir.PatientId
#                             FROM  Inpatient_Register_details as ir
#                             JOIN
#                             Ip_Room_booking_management as irb ON ir.PatientId = irb.PatientId 
#                             JOIN 
#                             Ip_Drug_Request_Table as ird ON ir.Booking_Id = ird.Booking_Id
#                             WHERE ir.Status = 'Occupied' AND ir.Location = %s
#                             AND ird.Status = 'Pending'

#                             """
#                 cursor.execute(get_query, (location,))
#                 result = cursor.fetchall()

#                 for row in result:
#                     datafetch ={
#                         'Booking_Id' : row[0],
#                         'PatientName' : row[1],
#                         'RoomId' : row[2],
#                         'RoomNo' : row[3],
#                         # 'Prescibtion_Id' : row[4],
#                         'Priscription_Barcode' : row[4],
#                         'PatientId' : row[5]
#                     }
#                     fetchdata.append(datafetch)
                
#                 return JsonResponse(fetchdata, safe=False)


#         except Exception as e:
#             return JsonResponse({"Error" : str(e)})
#         finally:
#             cursor.close()
  



def inhouse_pharmacy_queue_list_prescrib(request):
    try:
        location = request.GET.get('location')
        drug_requests = ip_drug_request_table.objects.all()
        print('drug_requests :',drug_requests)
        datafetch = []
        processed_patients = set()  # Set to store processed patient IDs
        record_id = 1
        for drug_request in drug_requests:
            registration_id = drug_request.Booking_Id

            room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id_id=registration_id).first()
            if not room_detail:
                continue

            room_status = Room_Master_Detials.objects.filter(Room_Id=room_detail.RoomId_id, Booking_Status='Occupied').first()
            if not room_status:
                continue

            patient_data = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            if not patient_data:
                continue

            personal_data = Patient_Detials.objects.filter(PatientId=patient_data.PatientId_id).first()
            if not personal_data or personal_data.PatientId in processed_patients:
                continue  # Skip if patient already processed

            processed_patients.add(personal_data.PatientId)  # Add to processed list

            patient_name = f"{personal_data.FirstName} {personal_data.MiddleName} {personal_data.SurName}"

            datafetch.append({
                'id': record_id,
                'Booking_Id': drug_request.Booking_Id,
                'PatientName': patient_name,  # Ensure PatientName exists in your model
                'RoomId': room_status.Room_Id,
                'RoomNo': room_status.Room_No,
                'Priscription_Barcode': drug_request.Priscription_Barcode,
                'PatientId': personal_data.PatientId,
                'PatientPhoneNo': personal_data.PhoneNo,
                'DoctorName': drug_request.DoctorName
            })

            record_id += 1

        return JsonResponse(datafetch, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)})






# def get_completed_prescribed_medicine(request):
#     if request.method == 'GET':
#         try:
           
#             current_date = datetime.date.today()  # Use today() method to get the current date
#             # location = request.GET.get('location')
#             print('current_date', current_date)

#             # Separate date and time components
#             current_date_str = current_date.strftime('%Y-%m-%d')
#             print('current_date_str', current_date_str)

#             with connection.cursor() as cursor:
#                 get_medicine = """
#                         SELECT Booking_Id, Prescibtion_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, Dosage, Route, RequestQuantity, Priscription_Barcode
#                         FROM Ip_Drug_Request_Table
#                         WHERE DATE(Date) = %s  AND Status = 'Completed' 
#                         """
#                 cursor.execute(get_medicine, (current_date_str,))
#                 data_fetch = cursor.fetchall()
#                 datas = []
#                 for row in data_fetch:
#                     data = {
#                         'BookingId' : row[0],
#                         'PrescriptionId' : row[1],
#                         'Department' : row[2],
#                         'DoctorName' : row[3],
#                         'GenericName' : row[4],
#                         'MedicineCode' : row[5],
#                         'MedicineName' : row[6],
#                         'Dosage' : row[7],
#                         'Route' : row[8],
#                         'RequestQuantity' : row[9],
#                         'barcode' : row[10]
#                     }
#                     datas.append(data)
                
#                 return JsonResponse(datas, safe=False)

#         except Exception as e:
#             # Log the error for debugging purposes
#             print("Error:", e)
#             return JsonResponse({"Error": "An error occurred while processing your request."})

#         finally:
#             cursor.close()



@csrf_exempt
def insert_nurse_received_drugs(request):
    if request.method == 'POST':
        try:
         
            data = json.loads(request.body)

            print('data ============> ',data)

            Bookingid = data.get('BookingId')
            PrescriptionId = data.get('PrescriptionId')
            barcode = data.get('barcode')

            with connection.cursor() as cursor:
                update_query = """
                        UPDATE Ip_Drug_Request_Table SET Status = 'Received' WHERE
                        Booking_Id = %s AND Prescibtion_Id = %s AND Priscription_Barcode= %s
                    """
                cursor.execute(update_query, (Bookingid, PrescriptionId, barcode))
                job_function()

                return JsonResponse({"success":"Update  Sucessfully"})
        
        except Exception as e:
            return JsonResponse({"Error" : e})
        finally:
            cursor.close()




def get_Drug_Administration_datas(request):
    if request.method == 'GET':
        try:
          
            booking_id = request.GET.get('Booking_Id')
            current_date = request.GET.get('Date')

            with connection.cursor() as cursor:
                query = """
                    SELECT Prescription_Id, Department, DoctorName, GenericName, MedicineCode, MedicineName, FrequencyMethod, FrequencyType, Dosage, Date, AdminisDose, Instruction, Route, Quantity, BillingMethod
                    FROM IP_Drug_Administration WHERE Booking_Id = %s
                """
                cursor.execute(query, (booking_id,))
                result = cursor.fetchall()
                print('result............+++++..........', result)
                regular = []
                sos = []
                for row in result:
                    print('......................', row[6])

                    if row[6] == 'Regular':
                    
                            query = """
                                SELECT FrequencyIssued, Status, Issued_Date
                                FROM IP_Nurse_Drug_Completed_Administration
                                WHERE Prescription_Id = %s AND Issued_Date = %s
                            """
                            cursor.execute(query, (row[0], current_date,))
                            result1 = cursor.fetchall()
                            print('result1 ........................*****', result1)
                            if result1:
                                data = []
                                for row1 in result1:
                                    regular_data = {
                                        "FrequencyIssued": row1[0],
                                        "Status": row1[1],
                                        "Date": row1[2]
                                    }
                                    data.append(regular_data)

                                common_data = {
                                    "Prescibtion_Id": row[0],
                                    "Department": row[1],
                                    "DoctorName": row[2],
                                    "GenericName": row[3],
                                    "MedicineCode": row[4],
                                    "MedicineName": f'{row[5]}{row[8]}',
                                    "FrequencyMethod": row[6],
                                    "FrequencyType": row[7],
                                    "PrescribedDate": row[9],
                                    "AdminisDose": row[10],
                                    "Instruction": row[11],
                                    "FrequencyIssued": data,
                                    "CurrentDate": data[0]['Date'] if data else None
                                }
                                regular.append(common_data)
                                print('regular.................', regular)
                                print('common_data.......................', common_data)
                            
                    else:
                        query = """
                            SELECT COUNT(*) 
                            FROM IP_Nurse_Drug_Completed_Administration 
                            WHERE FrequencyMethod = %s AND Prescription_Id = %s
                        """
                        cursor.execute(query, (row[6], row[0],))
                        result_count = cursor.fetchone()[0]
                        print('result_count', result_count)
                        print('input', row[13])
                        if int(result_count) != int(row[13]):
                            common_data1 = {
                                "Prescibtion_Id": row[0],
                                "Route": row[12],
                                "Department": row[1],
                                "DoctorName": row[2],
                                "GenericName": row[3],
                                "MedicineCode": row[4],
                                "MedicineName": f'{row[5]}{row[8]}',
                                "FrequencyMethod": row[6],
                                "FrequencyType": row[7],
                                "Dosage": row[8],
                                "Date": row[9],
                                "AdminisDose": row[10],
                                "Instruction": row[11],
                            }
                            sos.append(common_data1)
                print('regular............................', regular)

                return JsonResponse({'Regular': regular, 'SOS': sos}, safe=False)

        except Exception as e:
            print("Error", e)
            return JsonResponse({"Error Acquired:": str(e)}, status=500)
        finally:
            cursor.close()



@csrf_exempt
def insert_Drug_Administration_nurse_frequencywise_datas(request):
    if request.method == 'POST':
        try:
            # Load JSON data from the request body
            json_data = json.loads(request.body)
            print('json_data', json_data)
            with connection.cursor() as cursor:
                # Fetch the maximum Nurse_Prescription_Id
                cursor.execute("SELECT MAX(Nurse_Prescription_Id) FROM Ip_Nurse_Drug_Completed_Administration")
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                for prescription in json_data:
                    FrequencyMethod = prescription.get('FrequencyMethod')
                    Prescription_Id = prescription.get('Prescibtion_Id')
                    Completed_Date = prescription.get('Completed_Date')
                    Completed_Time = prescription.get('Completed_Time')
                    CapturedBy = prescription.get('CapturedBy')
                    Completed_Remarks = prescription.get('Remarks')
                    FrequencyIssued = prescription.get('FrequencyIssued')

                    if FrequencyMethod == 'Regular':
                        FrequencyIssued_str = f"{FrequencyIssued}:00:00"
                        completed_time = datetime.strptime(Completed_Time, '%H:%M:%S')
                        FrequencyIssued_time = datetime.strptime(FrequencyIssued_str, "%H:%M:%S")

                        before_time = FrequencyIssued_time - timedelta(minutes=30)
                        after_time = FrequencyIssued_time + timedelta(minutes=30)

                        if before_time <= completed_time <= after_time:
                            Status = 'Issued'
                        elif completed_time < before_time:
                            Status = 'Before'
                        else:
                            Status = 'Delay'

                        # Update existing records
                        query = """
                            UPDATE Ip_Nurse_Drug_Completed_Administration 
                            SET Status = %s, Complete_Date = %s, Complete_Time = %s, 
                            Completed_Remarks = %s, CapturedBy = %s 
                            WHERE FrequencyIssued = %s AND Prescription_Id = %s AND Status = 'Pending'
                        """
                        print(f"Executing update query with parameters: {Status}, {Completed_Date}, {Completed_Time}, {Completed_Remarks}, {CapturedBy}, {FrequencyIssued}, {Prescription_Id}")
                        cursor.execute(query, (Status, Completed_Date, Completed_Time, Completed_Remarks, CapturedBy, 
                                            FrequencyIssued, Prescription_Id))
                        
                    else:
                        # Insert new records
                        Issued_Time = Completed_Time.split(':')[0]  # Use the hour part
                        Department = prescription.get('Department')
                        DoctorName = prescription.get('DoctorName')
                        GenericName = prescription.get('GenericName')
                        MedicineCode = prescription.get('MedicineCode')
                        MedicineName = prescription.get('MedicineName')
                        Dosage = prescription.get('Dosage')
                        Route = prescription.get('Route')
                        Quantity = prescription.get('Quantity')
                        Location = prescription.get('Location')
                        AdminisDose = prescription.get('AdminisDose')
                        Date = prescription.get('Date')  # Use Date if provided
                        Status = 'Issued'

                        query = """
                            INSERT INTO Ip_Nurse_Drug_Completed_Administration 
                            (Nurse_Prescription_Id, Prescription_Id, Booking_Id, Department, DoctorName, 
                            GenericName, MedicineCode, MedicineName, Dosage, Route, FrequencyIssued,
                            FrequencyMethod, Quantity, Issued_Date, Complete_Date, Complete_Time,
                            Completed_Remarks, Status, Location, CapturedBy, AdminisDose) 
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """
                        print(f"Executing insert query with parameters: {next_id}, {Prescription_Id}, {prescription.get('Booking_Id')}, {Department}, {DoctorName}, {GenericName}, {MedicineCode}, {MedicineName}, {Dosage}, {Route}, {FrequencyIssued}, {FrequencyMethod}, {Quantity}, {Date}, {Completed_Date}, {Completed_Time}, {Completed_Remarks}, {Status}, {Location}, {CapturedBy}, {AdminisDose}")
                        cursor.execute(query, (next_id, Prescription_Id, prescription.get('Booking_Id'), Department, DoctorName, 
                                            GenericName, MedicineCode, MedicineName, Dosage, Route, FrequencyIssued, 
                                            FrequencyMethod, Quantity, Date, Completed_Date, Completed_Time, 
                                            Completed_Remarks, Status, Location, CapturedBy, AdminisDose))
                        next_id += 1

            return JsonResponse({'message': 'Data inserted successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


