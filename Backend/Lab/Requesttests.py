from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
from datetime import datetime

from django.db import connection as db  

import hashlib


def table_exists(cursor, table_name):
    cursor.execute("SHOW TABLES LIKE %s", (table_name,))
    return cursor.fetchone() is not None

def create_table_if_not_exists(table_name, column_definitions):
    # db = get_db_connection()
    cursor = db.cursor()

    if not table_exists(cursor, table_name):
        create_table_query = f"""
        CREATE TABLE {table_name} (
            {column_definitions}
        );
        """
        cursor.execute(create_table_query)
        db.commit()

    cursor.close()
    db.close()


# create_table_if_not_exists("External_Hospital_Patient_Request_Table","""
#                             Request_Id VARCHAR(12) PRIMARY KEY,
#                             Patient_UHID VARCHAR(25),
#                             Patient_Name VARCHAR(350),
#                             Gender VARCHAR(50),
#                             Age VARCHAR(3),
#                             Date_of_Birth VARCHAR(30),
#                             Phone_Number VARCHAR(15),
#                             Refering_Hospital VARCHAR(350),
#                             Status VARCHAR(35),
#                             Report LONGBLOB,
#                             Invoice_Number VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)

# create_table_if_not_exists("External_Hosptials_Test_Items", """
#                             Item_Id VARCHAR(12) PRIMARY KEY,
#                             Request_Id VARCHAR(12),
#                             Patient_UHID VARCHAR(25),
#                             Test_Code VARCHAR(10),
#                             Test_Name VARCHAR(350),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP           
# """)

def generate_next_request_key(current_max_id):
    prefix = "REQ"
    numeric_part = int(current_max_id.replace(prefix, '')) + 1
    new_id = f"{prefix}{str(numeric_part).zfill(7)}"
    return new_id

def authenticate_request(token_id, password):
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    # db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        SELECT COUNT(*) FROM api_credentials
        WHERE token_id = %s AND password_hash = %s
    """, [token_id, password_hash])

    result = cursor.fetchone()
    return result[0] > 0


@csrf_exempt
def External_hospital_investication_request(request):
    if request.method == 'POST':
        try:
            token_id = request.headers.get('tokenid')
            password = request.headers.get('password')
            print('tokenid',token_id)
            print('password',password)
            if not token_id or not password:
                return JsonResponse({'error': 'Token-ID and Password required'}, status=400)
            # Load data from request body
            if authenticate_request(token_id, password):
                data = json.loads(request.body)
                print('data', data)

                # Validate that data is not empty
                if not data:
                    return JsonResponse({'status': 'error', 'message': 'Request data is empty'})

                # Validate that required fields are present
                required_fields = ['PatientId', 'PatientName', 'Gender', 'Age', 'DOB', 'Refering_Hospital','LabRequests']
                missing_fields = [field for field in required_fields if field not in data or not data[field]]
                
                if missing_fields:
                    return JsonResponse({'status': 'error', 'message': f'Missing required fields: {", ".join(missing_fields)}'})

                # Get DB connection and cursor
                # db = get_db_connection()
                cursor = db.cursor()

                # Initialize next request ID
                next_id = 'REQ0000001'

                # Fetch the maximum Request_Id
                cursor.execute("SELECT MAX(Request_Id) FROM External_Hospital_Patient_Request_Table")
                max_id = cursor.fetchone()

                # Fetch the maximum Item_Id
                cursor.execute("SELECT MAX(CAST(Item_Id AS UNSIGNED)) FROM External_Hosptials_Test_Items")
                max_item = cursor.fetchone()
                next_item = max_item[0] + 1 if max_item and max_item[0] else 1

                # Generate the next request ID
                if max_id and max_id[0]:
                    next_id = generate_next_request_key(max_id[0])

                # Insert patient data into External_Hospital_Patient_Request_Table
                insert_patient_query = """
                    INSERT INTO External_Hospital_Patient_Request_Table 
                    (Request_Id, Patient_UHID, Patient_Name, Gender, Age, Date_of_Birth, Phone_Number,DateofRequest,Refering_Hospital, Status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
                """
                cursor.execute(insert_patient_query, (
                    next_id,
                    data['PatientId'],
                    data['PatientName'],
                    data['Gender'],
                    data['Age'],
                    data['DOB'],
                    0 if data.get('Phone_Number') in ['None', 'N/A', None] else data.get('Phone_Number', 0),
                    data.get('date_of_request'),  
                    data['Refering_Hospital'],
                    'Pending'  # Assuming 'Pending' is the default status
                ))

                # Insert each test item into External_Hosptials_Test_Items
                for item in data['LabRequests']:
                    if 'Test_Code' in item and 'Test_Name' in item:
                        insert_test_item_query = """
                            INSERT INTO External_Hosptials_Test_Items 
                            (Item_Id, Request_Id, Patient_UHID, Test_Code, Test_Name,Testrequestid)
                            VALUES (%s, %s, %s, %s, %s,%s)
                        """
                        cursor.execute(insert_test_item_query, (
                            str(next_item).zfill(12),  # Generate a zero-padded Item_Id
                            next_id,
                            data['PatientId'],
                            item['Test_Code'],
                            item['Test_Name'],
                            item['Testrequestid'],
                        ))
                        next_item += 1  # Increment the Item_Id for the next entry
                    else:
                        return JsonResponse({'status': 'error', 'message': 'Missing Test_Code or Test_Name in LabRequests'}, status=400)

                # Commit the transaction
                db.commit()

                # Close the cursor and connection
                cursor.close()
                db.close()

                # Return success response
                return JsonResponse({'status': 'success', 'Request_Id': next_id})
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'error': 'Method not allowed'},status=405)



def get_for_external_hospital_request(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()

        status= request.GET.get('status')
        print('status',status)

        # Query to get appointment requests with their corresponding items
        query = """
            SELECT * FROM External_Hospital_Patient_Request_Table ar
            LEFT JOIN External_Hosptials_Test_Items ari
            ON ar.Request_Id = ari.Request_Id
            WHERE ar.Status =%s
            ORDER BY ar.CreatedAt DESC
        """
        cursor.execute(query,(status,))
        data = cursor.fetchall()

        # Get column names dynamically
        column_names = [desc[0] for desc in cursor.description]

        # Organize data into the required format
        appointment_map = {}

        for row in data:
            row_data = dict(zip(column_names, row))
            appointment_id = row_data["Request_Id"]

    
            # Initialize the appointment entry if not already present
            if appointment_id not in appointment_map:

                if row_data["Report"]:
                    row_data["Report"] = f"data:application/pdf;base64,{base64.b64decode(base64.b64encode(row_data['Report'])).decode('utf-8')}" if row_data["Report"] is not None and row_data["Report"] != '' else None,  



                appointment_map[appointment_id] = {
                    "patientdata": {
                        key: row_data.get(key, None)
                        for key in column_names
                        if key
                        not in [
                            "Test_Code",
                            "Test_Name",
                            "UpdatedAt",
                            "CreatedAt",
                            "Item_Id",
                        ]
                    },
                    "testdetails": [],  # Initialize testdetails as an empty list
                }

            # Append test details if available
            if row_data.get("Request_Id"):
                test_detail = {
                    key: row_data.get(key, None)
                    for key in column_names
                    if key
                    in [
                        "Item_Id",
                        "Test_Code",
                        "Test_Name",
                    ]
                }
                appointment_map[appointment_id]["testdetails"].append(test_detail)

        # Convert the appointment_map to a list and adjust the format
        result = []
        for appointment_id, data in appointment_map.items():
            patient_data = data["patientdata"]
            patient_data["testdetails"] = data["testdetails"]
            result.append(patient_data)

        return JsonResponse(result, safe=False)

    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({"error": str(e)})

    finally:
        cursor.close()
        db.close()


@csrf_exempt
def update_refering_hospital_request_status(request):
    if request.method == "POST":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            
            # Assuming you get the request ID from the POST data
            request_id = request.POST.get('request_id')
            print('request_id', request_id)
            

            status = "Completed"

            update_query = """
                UPDATE External_Hospital_Patient_Request_Table SET Status = %s WHERE Request_Id = %s
            """

            cursor.execute(update_query, (status, request_id))
            db.commit()

            return JsonResponse({'message': 'Status updated successfully'}, status=200)

        except Exception as e:
            db.rollback()
            return JsonResponse({'error': str(e)}, status=500)

        finally:
            cursor.close()
            db.close()

    return JsonResponse({'error': 'Invalid request method'}, status=405)          




import base64
from django.http import JsonResponse

def get_external_report(request):
    if request.method == 'GET':
        try:
            # token_id = request.headers.get('tokenid')
            # password = request.headers.get('password')
            # print('tokenid',token_id)
            # print('password',password)
            # if not token_id or not password:
            #     return JsonResponse({'error': 'Token-ID and Password required'}, status=400)
            # Load data from request body
            # if authenticate_request(token_id, password):
                # db = get_db_connection()
                cursor = db.cursor()

                Request_Id = request.GET.get('Request_Id')
                
                # Check if the bill status is 'Completed'
                cursor.execute("""
                    SELECT * FROM Completed_Lab_Report_Table WHERE Billing_Invoice=%s
                """, (Request_Id,))
                reportresult = cursor.fetchall()
                
                extreport = []
                if reportresult:
                    for x in reportresult:
                        reportdata = {
                            'Status': x[9],
                            'Report': f"data:application/pdf;base64,{base64.b64decode(base64.b64encode(x[13])).decode('utf-8')}" if x[13] is not None and x[13] != '' else None,  
                        }
                        extreport.append(reportdata)
                else:
                    # If no completed report is found, return a response indicating the report is pending
                    extreport.append({"Status": "Pending", "Message": "Report is pending"})
                
                return JsonResponse(extreport, safe=False)
            # else:
            #     return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
        except Exception as e:
            return JsonResponse({"error": str(e)})