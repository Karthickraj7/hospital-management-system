from django.shortcuts import render
import base64
from django.http import JsonResponse
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connections
from django.views.decorators.http import require_http_methods
# from backend.db_connect import get_db_connection, get_db_cursor
import mysql
from django.db import connection as db
from Frontoffice.models import *
from collections import defaultdict

from Lab.BillingView import get_invoice_master_barcode





# def table_exists(cursor, table_name):
#     cursor.execute("SHOW TABLES LIKE %s", (table_name,))
#     return cursor.fetchone() is not None

# def create_table_if_not_exists(table_name, column_definitions):
#     
#     cursor = get_db_cursor(db)

#     if not table_exists(cursor, table_name):
#         create_table_query = f"""
#         CREATE TABLE {table_name} (
#             {column_definitions}
#         );
#         """
#         cursor.execute(create_table_query)
#         db.commit()

#     cursor.close()
#     db.close()


# create_table_if_not_exists("Sample_Capture_in_Phelobotomist","""
#                             Sample_Id INT PRIMARY KEY,
#                             Patient_Id INT,
#                             Patient_Name VARCHAR(150),
#                             Billing_Invoice VARCHAR(25),
#                             Test_Name VARCHAR(230),
#                             Captured_Unit VARCHAR(5),
#                             Status VARCHAR(50),
#                             Medical_Remarks VARCHAR(2000),
#                             Technical_Remark VARCHAR(2000),
#                             UOM VARCHAR(10),
#                             Location VARCHAR(55),
#                             Visit_Id  VARCHAR(15),
#                             CreatedBy VARCHAR(155),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
# """)


 #--------------------------------- insert for sample capture table phlebotomist ---------------------------------------------------
@csrf_exempt
def insert_into_sample_capture(request):
    print('Method:', request.method)
    # db = None
    # cursor = None
    try:
        
        cursor = db.cursor()

        data = json.loads(request.body)
        print('Data:', data)

        for item in data:
            patient_id = item.get('patientid')
            patient_name = item.get('patientname')
            test_name = item.get('testname')
            test_code = item.get('testcode')
            captured_unit = item.get('Captured_Unit')
            medical_remarks = item.get('medicalRemark')
            technical_remarks = item.get('technicalRemark')
            invoice = item.get('Billing_invoice')
            status = item.get('status')
            transferlocation = item.get("transferlocation")  # Null unless explicitly set in frontend
            uom = item.get('uom')
            location = item.get('location')  # Location from which request is made (e.g., "CHENNAI")
            createdby = item.get('createdby')
            visitid = item.get('visit_id')
            samplebarcode = item.get('sampleid')
            sampletype = item.get('Specimen_Name')
            Sub_Department = item.get('Sub_Department')
            Age = item.get('Age')
            Gender = item.get('Gender')

            # Fetch primary location and transfer location from Billing_Item_Table_for_lab
            cursor.execute("""
                SELECT Location, Transfer_Location, Service_Status, Analysis_Status, Verify_Status, Approve_Status
                FROM Billing_Item_Table_for_lab 
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, (invoice, test_code))
            billing_item = cursor.fetchone()
            primary_location = billing_item[0] if billing_item else location
            current_transfer_location = billing_item[1] if billing_item else None
            

            # Check if the record exists in Sample_Capture_in_Phelobotomist
            cursor.execute("""
                SELECT Transfer_Location FROM Sample_Capture_in_Phelobotomist
                WHERE Patient_Id = %s AND Billing_Invoice = %s AND Test_Code = %s
            """, (patient_id, invoice, test_code))
            sample_result = cursor.fetchone()
            sample_transfer_location = sample_result[0] if sample_result else None

            # Determine Transfer_Location to use: retain existing value unless status is "Transfer"
            transfer_location_to_use = (
                transferlocation if status == "Transfer" 
                else (sample_transfer_location if sample_result else current_transfer_location)
            )

            if sample_result:
                # Update existing record
                cursor.execute("""
                    UPDATE Sample_Capture_in_Phelobotomist
                    SET Patient_Name = %s, Captured_Unit = %s, Status = %s, Medical_Remarks = %s, 
                        Technical_Remark = %s, UOM = %s, Location = %s, Visit_Id = %s, CreatedBy = %s, Transfer_Location = %s, UpdatedAt = %s
                    WHERE Patient_Id = %s AND Billing_Invoice = %s AND Test_Code = %s
                """, (patient_name, captured_unit, status, medical_remarks, technical_remarks, 
                      uom, primary_location, visitid, createdby, transfer_location_to_use, datetime.now(),
                      patient_id, invoice, test_code))
            else:
                # Get next Sample_Id
                cursor.execute("SELECT COALESCE(MAX(Sample_Id), 0) + 1 FROM Sample_Capture_in_Phelobotomist")
                next_id = cursor.fetchone()[0]

                # Insert new record
                cursor.execute("""
                    INSERT INTO Sample_Capture_in_Phelobotomist 
                    (Sample_Id, Patient_Id, Patient_Name, Billing_Invoice, Test_Name, Captured_Unit, 
                    Status, Medical_Remarks, Technical_Remark, UOM, Location, Visit_Id, CreatedBy, Test_Code, Transfer_Location,UpdatedAt, CreatedAt)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (next_id, patient_id, patient_name, invoice, test_name, captured_unit, status, 
                      medical_remarks, technical_remarks, uom, primary_location, visitid, createdby, test_code, 
                      transfer_location_to_use,datetime.now(), datetime.now()))
            
            db.commit()

            # Update Billing_Item_Table_for_lab based on status
            if status == "Transfer":
                cursor.execute("""
                    UPDATE Billing_Item_Table_for_lab
                    SET Service_Status = %s, Analysis_Status = %s, Verify_Status = %s, Approve_Status = %s, Transfer_Location = %s, UpdatedAt =%s
                    WHERE Billing_Invoice = %s AND Test_Code = %s
                """, ('Transfer', 'Transfer', 'Transfer', 'Transfer', transferlocation,datetime.now(), invoice, test_code))
            elif status == "Collected":
                # Only update Service_Status to "Completed", retain other statuses and Transfer_Location
                cursor.execute("""
                    UPDATE Billing_Item_Table_for_lab
                    SET Service_Status = %s, UpdatedAt =%s
                    WHERE Billing_Invoice = %s AND Test_Code = %s
                """, ('Completed',datetime.now(), invoice, test_code))
            # If status is "Completed" or other, no update needed unless specified
            
            db.commit()

            # Update Billing_invoice_and_bill_amount Transfer_Location if status is Transfer
            if status == "Transfer":
                cursor.execute("""
                    SELECT Transfer_Location FROM Billing_invoice_and_bill_amount WHERE Billing_Invoice = %s
                """, (invoice,))
                current_transfer_location = cursor.fetchone()

                if current_transfer_location and current_transfer_location[0]:
                    current_locations = current_transfer_location[0].split(",")
                    if transferlocation and transferlocation not in current_locations:
                        new_transfer_location = current_transfer_location[0] + "," + transferlocation
                        cursor.execute("""
                            UPDATE Billing_invoice_and_bill_amount
                            SET Transfer_Location = %s, UpdatedAt = %s
                            WHERE Billing_Invoice = %s
                        """, (new_transfer_location, datetime.now(), invoice))
                else:
                    cursor.execute("""
                        UPDATE Billing_invoice_and_bill_amount
                        SET Transfer_Location = %s, UpdatedAt =%s
                        WHERE Billing_Invoice = %s
                    """, (transferlocation, datetime.now(), invoice))
                db.commit()

            # Determine Capture_Sample_Status based on all tests
            cursor.execute("""
                SELECT Service_Status 
                FROM Billing_Item_Table_for_lab 
                WHERE Billing_Invoice = %s AND Patient_Id = %s AND Bill_Status != "Canceled"
            """, (invoice, patient_id))
            statuses = cursor.fetchall()
            
            transfer_count = sum(1 for s in statuses if s[0] == 'Transfer')
            completed_count = sum(1 for s in statuses if s[0] == 'Completed')
            total_tests = len(statuses)

            if transfer_count > 0:
                status1 = 'Transfer'
            elif completed_count == total_tests:
                status1 = 'Completed'
            else:
                status1 = 'Recollect'

            cursor.execute("""
                UPDATE Billing_invoice_and_bill_amount 
                SET Capture_Sample_Status = %s ,UpdatedAt =%s
                WHERE Billing_Invoice = %s AND Patient_Id = %s
            """, (status1,datetime.now(), invoice, patient_id))
            db.commit()



    except Exception as e:
        print('Error:', str(e))
        if db:
            db.rollback()
        return JsonResponse({"error": str(e)}, status=400)
    
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

    return JsonResponse({"success": "Operation completed successfully."})
    
    

# @csrf_exempt
# def update_capture_status(request):
#     if request.method == 'POST':
#         db = None
#         cursor = None
#         try:
#             
#             cursor = db.cursor()

#             # Parsing the JSON body of the request
#             invoice_data = json.loads(request.body)
#             print(invoice_data)
#             datainvoice = invoice_data.get('Billinginvoice')

#             cursor.execute("SELECT Test_Name,Test_Code FROM Billing_Item_Table_for_lab WHERE Billing_Invoice = %s", (datainvoice,))
#             tests = cursor.fetchall()
#             print('tests :',tests)
            
#             for test in tests:
#                 testname = test[0]
#                 testcode = test[1]

#                 cursor.execute("SELECT Autocheck, Parameter_One FROM Test_Descriptions WHERE Test_Code = %s", (testcode,))
#                 autocheck, value = cursor.fetchone()

#                 if autocheck == 'Yes':
#                     cursor.execute("SELECT COUNT(*) FROM Billing_Item_Table_for_lab WHERE Test_Code = %s AND Billing_Invoice = %s", (testcode, datainvoice,))
#                     count = cursor.fetchone()[0]
                    

#                     if int(value) == int(count):
#                         # Update query for Billing_invoice_and_bill_amount
#                         update_query_billing = """
#                             UPDATE Billing_invoice_and_bill_amount
#                             SET Capture_Sample_Status = 'Completed'
#                             WHERE Billing_Invoice = %s
#                         """
#                         cursor.execute(update_query_billing, (datainvoice,))
#                         db.commit()
#                     else:
#                         update_query_billing = """
#                         UPDATE Billing_invoice_and_bill_amount
#                         SET Capture_Sample_Status = 'Autocheck'
#                         WHERE Billing_Invoice = %s
#                     """
#                         cursor.execute(update_query_billing, (datainvoice,))
#                         db.commit()
#                 else:
#                     # Update query for Billing_invoice_and_bill_amount
#                     update_query_billing = """
#                         UPDATE Billing_invoice_and_bill_amount
#                         SET Capture_Sample_Status = 'Completed'
#                         WHERE Billing_Invoice = %s
#                     """
#                     cursor.execute(update_query_billing, (datainvoice,))

#                 # Additional Update query for Billing_Item_Table_for_lab
#                 update_query_billing_item = """
#                     UPDATE Billing_Item_Table_for_lab
#                     SET Service_Status = 'Completed'
#                     WHERE Billing_Invoice = %s
#                 """
#                 cursor.execute(update_query_billing_item, (datainvoice,))

#             # Committing the transaction to make sure both updates are saved
#             db.commit()

#             return JsonResponse({"Success": "Status updated to completed in both tables."})

#         except Exception as er:
#             print("error", er)
#             # Providing a more specific HTTP status code for different types of errors might be helpful
#             return JsonResponse({"Error": str(er)}, status=500)

#         finally:
#             # Properly closing the cursor and database connection
#             if cursor:
#                 cursor.close()
#             if db:
#                 db.close()

#     else:
#         return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)







# @csrf_exempt
# def updatereportsamplestatus(request):
#     if request.method != 'POST':
#         return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)
    
#     try:
#         data = json.loads(request.body)
#         print("Received data:", data)

#         billing_invoice_id = data.get('Billing_Invoice')
#         if not billing_invoice_id:
#             return JsonResponse({"Error": "Billing_Invoice is required."}, status=400)

#         # Helper function to flatten the test structure
#         def flatten_tests(test_details):
#             flat_tests = []


#             for item in test_details:
#                 # Helper function to extract common fields from a test
#                 def extract_common_data(test):
#                     return {
#                         'Barcode_Id': test.get('Barcode_Id'),
#                         'Patient_Id': test.get('Patient_Id'),
#                         'Patient_Name': test.get('Patient_Name'),
#                         'Age': test.get('Age'),
#                         'Gender': test.get('Gender'),
#                         'DOB': test.get('DOB'),
#                         'Location_Name': test.get('Location_Name'),
#                         'Departmentname': test.get('Departmentname'),
#                         'Specimen_Name': test.get('Specimen_Name')
#                     }

#                 # Helper function to create a flattened test entry
#                 def enrich(test, common_data, status_fallback=None):
#                     return {
#                         'testname': test.get('Test_Name'),
#                         'testcode': test.get('Test_Code', test.get('Test_Name')),
#                         'status': test.get('status', status_fallback),
#                         **common_data
#                     }

#                 # Case 1: Package (has PackageName)
#                 if 'PackageName' in item:
#                     # Handle direct tests under the package
#                     for test in item.get('Tests', []):
#                         common_data = extract_common_data(test)
#                         flat_tests.append(enrich(test, common_data, item.get('status')))
#                         # Handle subtests
#                         for subtest in test.get('SubTests', []):
#                             flat_tests.append(enrich(subtest, common_data, test.get('status', item.get('status'))))

#                     # Handle nested groups under the package
#                     for group in item.get('Groups', []):
#                         for test in group.get('Tests', []):
#                             common_data = extract_common_data(test)
#                             flat_tests.append(enrich(test, common_data, group.get('status', item.get('status'))))
#                             # Handle subtests
#                             for subtest in test.get('SubTests', []):
#                                 flat_tests.append(enrich(subtest, common_data, test.get('status', group.get('status', item.get('status')))))

#                 # Case 2: Group (has GroupName)
#                 elif 'GroupName' in item:
#                     for test in item.get('Tests', []):
#                         common_data = extract_common_data(test)
#                         flat_tests.append(enrich(test, common_data, item.get('status')))
#                         # Handle subtests
#                         for subtest in test.get('SubTests', []):
#                             flat_tests.append(enrich(subtest, common_data, test.get('status', item.get('status'))))

#                 # Case 3: Individual Test (no PackageName or GroupName)
#                 else:
#                     common_data = extract_common_data(item)
#                     flat_tests.append(enrich(item, common_data, item.get('status')))
#                     # Handle subtests
#                     for subtest in item.get('SubTests', []):
#                         flat_tests.append(enrich(subtest, common_data, item.get('status')))

#             return flat_tests

#         # Flatten the test details into a list of tests
#         test_list = flatten_tests(data.get('testDetails', []))
#         print("Flattened test list:", test_list)

#         if not test_list:
#             return JsonResponse({"Error": "No tests found in testDetails."}, status=400)

#         cursor = db.cursor()

#         newSample = get_invoice_master_barcode()
#         print("-------------SAMPLE----------------",newSample)


#         for item in test_list:
#             test_name = item.get('testname')
#             process = item.get('status')
#             test_code = item.get('testcode')
#             Barcode_Id = item.get('Barcode_Id') if process == 'Received' else newSample

#             print("sample =-----",Barcode_Id)

#             # Validate required fields
#             if not test_name or not process or not test_code:
#                 return JsonResponse({"Error": f"Missing required fields for test: {test_name}"}, status=400)

#             service_status = 'Completed' if process == 'Received' else 'Recollect'

#             cursor.execute("""
#                 UPDATE Billing_Item_Table_for_lab
#                 SET Service_Status = %s, UpdatedAt = %s, Barcode_Id = %s
#                 WHERE Billing_Invoice = %s AND Test_Code = %s
#             """, (service_status, datetime.now(), Barcode_Id, billing_invoice_id, test_code))
#             print(f"Updated Billing_Item_Table_for_lab: {test_code} to {service_status}")

#             cursor.execute("""
#                 UPDATE Sample_Capture_in_Phelobotomist
#                 SET Status = %s, UpdatedAt = %s
#                 WHERE Billing_Invoice = %s AND Test_Code = %s
#             """, (service_status, datetime.now(), billing_invoice_id, test_code))
#             print(f"Updated Sample_Capture_in_Phelobotomist: {test_code} to {service_status}")

#             if process == 'Received':
#                 samplebarcode = item.get('Barcode_Id')
#                 patient_id = item.get('Patient_Id')
#                 test_name = item.get('testname')
#                 test_code = item.get('testcode')
#                 sampletype = item.get('Specimen_Name')
#                 Sub_Department = item.get('Departmentname')
#                 patient_name = item.get('Patient_Name')
#                 Age = item.get('Age')
#                 Gender = item.get('Gender')
#                 dob = item.get('DOB')
#                 location = item.get('Location_Name')

#                 cursor.execute("""
#                     SELECT Assay_Code FROM Test_Descriptions
#                     WHERE Test_Code = %s
#                 """, (test_code,))
#                 result = cursor.fetchone()
#                 assaycodedata = result[0] if result else None

#                 # Validate samplebarcode
#                 if not samplebarcode:
#                     return JsonResponse({"Error": f"Sample barcode is missing for test: {test_name}"}, status=400)

#                 # First check if the data already exists
#                 cursor.execute("""
#                     SELECT COUNT(*) FROM Patient_Lab_Testorder
#                     WHERE samplebarcode = %s AND patientid = %s AND testcode = %s
#                 """, (samplebarcode, patient_id, test_code))
                
#                 exists = cursor.fetchone()[0]

#                 # If it doesn't exist, then insert
#                 if exists == 0:
#                     cursor.execute("""
#                         INSERT INTO Patient_Lab_Testorder 
#                         (samplebarcode, patientid, testname, testcode, Assay_Code,sampletype, department, patientname, dateofbirth, age, gender, status, Location, updatedat, createdat)
#                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#                     """, (
#                         samplebarcode, patient_id, test_name, test_code,assaycodedata, sampletype,
#                         Sub_Department, patient_name, dob, Age, Gender, 0, location,
#                         datetime.now(), datetime.now()
#                     ))
            
#         db.commit()
#         print("Data inserted into another table successfully.")
#         return JsonResponse({"success": "Data inserted into another table."})

#     except Exception as e:
#         print("Error:", str(e))
#         return JsonResponse({"Error": str(e)}, status=500)
################################newly added below he curent server code ##################


@csrf_exempt
def updatereportsamplestatus(request):
    if request.method != 'POST':
        return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)
    
    try:
        data = json.loads(request.body)
        print("Received data:", data)

        billing_invoice_id = data.get('Billing_Invoice')
        if not billing_invoice_id:
            return JsonResponse({"Error": "Billing_Invoice is required."}, status=400)

        # ═══════════════════════════════════════════════════════════════
        # STEP 1: Flatten test structure (same as before)
        # ═══════════════════════════════════════════════════════════════
        
        def flatten_tests(test_details):
            flat_tests = []

            for item in test_details:
                def extract_common_data(test):
                    return {
                        'Barcode_Id': test.get('Barcode_Id'),
                        'Patient_Id': test.get('Patient_Id'),
                        'Patient_Name': test.get('Patient_Name'),
                        'Age': test.get('Age'),
                        'Gender': test.get('Gender'),
                        'DOB': test.get('DOB'),
                        'Location_Name': test.get('Location_Name'),
                        'Departmentname': test.get('Departmentname'),
                        'Specimen_Name': test.get('Specimen_Name')
                    }

                def enrich(test, common_data, status_fallback=None):
                    return {
                        'testname': test.get('Test_Name'),
                        'testcode': test.get('Test_Code', test.get('Test_Name')),
                        'status': test.get('status', status_fallback),
                        **common_data
                    }

                if 'PackageName' in item:
                    for test in item.get('Tests', []):
                        common_data = extract_common_data(test)
                        flat_tests.append(enrich(test, common_data, item.get('status')))
                        for subtest in test.get('SubTests', []):
                            flat_tests.append(enrich(subtest, common_data, test.get('status', item.get('status'))))

                    for group in item.get('Groups', []):
                        for test in group.get('Tests', []):
                            common_data = extract_common_data(test)
                            flat_tests.append(enrich(test, common_data, group.get('status', item.get('status'))))
                            for subtest in test.get('SubTests', []):
                                flat_tests.append(enrich(subtest, common_data, test.get('status', group.get('status', item.get('status')))))

                elif 'GroupName' in item:
                    for test in item.get('Tests', []):
                        common_data = extract_common_data(test)
                        flat_tests.append(enrich(test, common_data, item.get('status')))
                        for subtest in test.get('SubTests', []):
                            flat_tests.append(enrich(subtest, common_data, test.get('status', item.get('status'))))

                else:
                    common_data = extract_common_data(item)
                    flat_tests.append(enrich(item, common_data, item.get('status')))
                    for subtest in item.get('SubTests', []):
                        flat_tests.append(enrich(subtest, common_data, item.get('status')))

            return flat_tests

        test_list = flatten_tests(data.get('testDetails', []))
        print("Flattened test list:", test_list)

        if not test_list:
            return JsonResponse({"Error": "No tests found in testDetails."}, status=400)

        cursor = db.cursor()
        newSample = get_invoice_master_barcode()
        print("-------------SAMPLE----------------", newSample)

        # ═══════════════════════════════════════════════════════════════
        # STEP 2: BATCH FETCH ALL TEST DATA (MASSIVE OPTIMIZATION!)
        # ═══════════════════════════════════════════════════════════════
        
        # ✅ Get all test codes at once
        test_codes = [item.get('testcode') for item in test_list if item.get('status') != 'Pending']
        
        if not test_codes:
            return JsonResponse({"success": "No tests to process (all pending)."})

        # ✅ OPTIMIZATION 1: Batch fetch all Assay_Codes and departments
        test_codes_str = ','.join(['%s'] * len(test_codes))
        cursor.execute(f"""
            SELECT Test_Code, Assay_Code, sub_department_id
            FROM Test_Descriptions
            WHERE Test_Code IN ({test_codes_str})
        """, test_codes)
        
        test_data_map = {}
        for row in cursor.fetchall():
            test_data_map[row[0]] = {
                'assay_code': row[1],
                'sub_department_id': row[2]
            }
        print(f"✅ Fetched {len(test_data_map)} test details in 1 query")

        # ═══════════════════════════════════════════════════════════════
        # STEP 3: BATCH UPDATE BILLING & SAMPLE TABLES
        # ═══════════════════════════════════════════════════════════════
        
        # ✅ OPTIMIZATION 2: Batch update using CASE statement
        billing_updates = []
        sample_updates = []
        
        for item in test_list:
            if item.get('status') == "Pending":
                continue
                
            test_code = item.get('testcode')
            process = item.get('status')
            Barcode_Id = newSample if process == 'Recollect' else item.get('Barcode_Id')
            service_status = 'Completed' if process == 'Received' else 'Recollect'
            
            billing_updates.append((service_status, Barcode_Id, test_code))
            sample_updates.append((service_status, test_code))
        
        # ✅ Batch update Billing_Item_Table_for_lab
        if billing_updates:
            cursor.executemany("""
                UPDATE Billing_Item_Table_for_lab
                SET Service_Status = %s, UpdatedAt = NOW(), Barcode_Id = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [(status, barcode, billing_invoice_id, code) for status, barcode, code in billing_updates])
            print(f"✅ Updated {len(billing_updates)} records in Billing_Item_Table_for_lab")

        # ✅ Batch update Sample_Capture_in_Phelobotomist
        if sample_updates:
            cursor.executemany("""
                UPDATE Sample_Capture_in_Phelobotomist
                SET Status = %s, UpdatedAt = NOW()
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [(status, billing_invoice_id, code) for status, code in sample_updates])
            print(f"✅ Updated {len(sample_updates)} records in Sample_Capture_in_Phelobotomist")

        # ═══════════════════════════════════════════════════════════════
        # STEP 4: BATCH INSERT INTO PATIENT_LAB_TESTORDER
        # ═══════════════════════════════════════════════════════════════
        
        # ✅ OPTIMIZATION 3: Batch check existing records
        received_tests = [item for item in test_list if item.get('status') == 'Received']
        
        if received_tests:
            # Get all barcodes and test codes
            check_conditions = [(item.get('Barcode_Id'), item.get('Patient_Id'), item.get('testcode')) 
                               for item in received_tests]
            
            # Check which records already exist
            existing_set = set()
            placeholders = ','.join(['(%s,%s,%s)'] * len(check_conditions))
            flat_values = [val for sublist in check_conditions for val in sublist]
            
            cursor.execute(f"""
                SELECT samplebarcode, patientid, testcode 
                FROM Patient_Lab_Testorder
                WHERE (samplebarcode, patientid, testcode) IN ({placeholders})
            """, flat_values)
            
            for row in cursor.fetchall():
                existing_set.add((row[0], row[1], row[2]))
            print(f"✅ Found {len(existing_set)} existing records in Patient_Lab_Testorder")
            
            # ✅ Prepare batch insert for new records only
            new_records = []
            for item in received_tests:
                samplebarcode = item.get('Barcode_Id')
                patient_id = item.get('Patient_Id')
                test_code = item.get('testcode')
                
                if not samplebarcode:
                    continue
                    
                # Skip if already exists
                if (samplebarcode, patient_id, test_code) in existing_set:
                    continue
                
                # Get test data from map
                test_info = test_data_map.get(test_code, {})
                
                new_records.append((
                    samplebarcode,
                    patient_id,
                    item.get('testname'),
                    test_code,
                    test_info.get('assay_code'),
                    item.get('Specimen_Name'),
                    item.get('Departmentname'),
                    item.get('Patient_Name'),
                    item.get('DOB'),
                    item.get('Age'),
                    item.get('Gender'),
                    0,  # status
                    item.get('Location_Name')
                ))
            
            # ✅ Batch insert
            if new_records:
                cursor.executemany("""
                    INSERT INTO Patient_Lab_Testorder 
                    (samplebarcode, patientid, testname, testcode, Assay_Code, sampletype, 
                     department, patientname, dateofbirth, age, gender, status, Location, 
                     updatedat, createdat)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                """, new_records)
                print(f"✅ Inserted {len(new_records)} new records into Patient_Lab_Testorder")

        # ═══════════════════════════════════════════════════════════════
        # STEP 5: BATCH INSERT INTO HIS_PATIENTORDER
        # ═══════════════════════════════════════════════════════════════
        
        if received_tests:
            # Check existing records
            check_conditions_his = [(item.get('Barcode_Id'), item.get('Patient_Id'), item.get('testcode')) 
                                   for item in received_tests]
            
            existing_his_set = set()
            placeholders_his = ','.join(['(%s,%s,%s)'] * len(check_conditions_his))
            flat_values_his = [val for sublist in check_conditions_his for val in sublist]
            
            cursor.execute(f"""
                SELECT HIS_LABID, HIS_PATIENTID, HIS_TESTNO
                FROM his_patientorder
                WHERE (HIS_LABID, HIS_PATIENTID, HIS_TESTNO) IN ({placeholders_his})
            """, flat_values_his)
            
            for row in cursor.fetchall():
                existing_his_set.add((row[0], row[1], row[2]))
            print(f"✅ Found {len(existing_his_set)} existing records in his_patientorder")
            
            # ✅ Prepare batch insert for HAEMATOLOGY department only
            his_records = []
            for item in received_tests:
                samplebarcode = item.get('Barcode_Id')
                patient_id = item.get('Patient_Id')
                test_code = item.get('testcode')
                
                # Skip if already exists
                if (samplebarcode, patient_id, test_code) in existing_his_set:
                    continue
                
                # Get test data
                test_info = test_data_map.get(test_code, {})
                department = test_info.get('sub_department_id')
                
                # Only insert for HAEMATOLOGY (LSDC000007)
                if department == "LSDC000007":
                    his_records.append((
                        samplebarcode,
                        patient_id,
                        item.get('Patient_Name'),
                        item.get('Age'),
                        item.get('Gender'),
                        "SPC501",  # Machine ID
                        test_info.get('assay_code'),
                        test_code,
                        item.get('testname'),
                        item.get('Specimen_Name'),
                        0  # status
                    ))
            
            # ✅ Batch insert
            if his_records:
                cursor.executemany("""
                    INSERT INTO his_patientorder 
                    (HIS_LABID, HIS_PATIENTID, HIS_PNAME, HIS_PAGE, HIS_PSEX, HIS_MACHID, 
                     HIS_MACHTESTID, HIS_TESTNO, HIS_TESTNAME, HIS_SAMPLENAME, HIS_STATUS)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, his_records)
                print(f"✅ Inserted {len(his_records)} records into his_patientorder")

        # ═══════════════════════════════════════════════════════════════
        # STEP 6: COMMIT ALL CHANGES
        # ═══════════════════════════════════════════════════════════════
        
        db.commit()
        print("✅ All data committed successfully")
        
        return JsonResponse({
            "success": "Sample status updated successfully",
            "tests_processed": len(test_list),
            "billing_updates": len(billing_updates),
            "new_patient_orders": len(new_records) if received_tests else 0,
            "new_his_orders": len(his_records) if received_tests else 0
        })

    except Exception as e:
        print("❌ Error:", str(e))
        db.rollback()
        return JsonResponse({"Error": str(e)}, status=500)
    
    finally:
        if cursor:
            cursor.close()

######################################   current server code ####################################
# @csrf_exempt
# def updatereportsamplestatus(request):
#     if request.method != 'POST':
#         return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)
    
#     try:
#         data = json.loads(request.body)
#         print("Received data:", data)

#         billing_invoice_id = data.get('Billing_Invoice')
#         if not billing_invoice_id:
#             return JsonResponse({"Error": "Billing_Invoice is required."}, status=400)

#         # Helper function to flatten the test structure
#         def flatten_tests(test_details):
#             flat_tests = []


#             for item in test_details:
#                 # Helper function to extract common fields from a test
#                 def extract_common_data(test):
#                     return {
#                         'Barcode_Id': test.get('Barcode_Id'),
#                         'Patient_Id': test.get('Patient_Id'),
#                         'Patient_Name': test.get('Patient_Name'),
#                         'Age': test.get('Age'),
#                         'Gender': test.get('Gender'),
#                         'DOB': test.get('DOB'),
#                         'Location_Name': test.get('Location_Name'),
#                         'Departmentname': test.get('Departmentname'),
#                         'Specimen_Name': test.get('Specimen_Name')
#                     }

#                 # Helper function to create a flattened test entry
#                 def enrich(test, common_data, status_fallback=None):
#                     return {
#                         'testname': test.get('Test_Name'),
#                         'testcode': test.get('Test_Code', test.get('Test_Name')),
#                         'status': test.get('status', status_fallback),
#                         **common_data
#                     }

#                 # Case 1: Package (has PackageName)
#                 if 'PackageName' in item:
#                     # Handle direct tests under the package
#                     for test in item.get('Tests', []):
#                         common_data = extract_common_data(test)
#                         flat_tests.append(enrich(test, common_data, item.get('status')))
#                         # Handle subtests
#                         for subtest in test.get('SubTests', []):
#                             flat_tests.append(enrich(subtest, common_data, test.get('status', item.get('status'))))

#                     # Handle nested groups under the package
#                     for group in item.get('Groups', []):
#                         for test in group.get('Tests', []):
#                             common_data = extract_common_data(test)
#                             flat_tests.append(enrich(test, common_data, group.get('status', item.get('status'))))
#                             # Handle subtests
#                             for subtest in test.get('SubTests', []):
#                                 flat_tests.append(enrich(subtest, common_data, test.get('status', group.get('status', item.get('status')))))

#                 # Case 2: Group (has GroupName)
#                 elif 'GroupName' in item:
#                     for test in item.get('Tests', []):
#                         common_data = extract_common_data(test)
#                         flat_tests.append(enrich(test, common_data, item.get('status')))
#                         # Handle subtests
#                         for subtest in test.get('SubTests', []):
#                             flat_tests.append(enrich(subtest, common_data, test.get('status', item.get('status'))))

#                 # Case 3: Individual Test (no PackageName or GroupName)
#                 else:
#                     common_data = extract_common_data(item)
#                     flat_tests.append(enrich(item, common_data, item.get('status')))
#                     # Handle subtests
#                     for subtest in item.get('SubTests', []):
#                         flat_tests.append(enrich(subtest, common_data, item.get('status')))

#             return flat_tests

#         # Flatten the test details into a list of tests
#         test_list = flatten_tests(data.get('testDetails', []))
#         print("Flattened test list:", test_list)

#         if not test_list:
#             return JsonResponse({"Error": "No tests found in testDetails."}, status=400)

#         cursor = db.cursor()

#         newSample = get_invoice_master_barcode()
#         print("-------------SAMPLE----------------",newSample)


#         for item in test_list:
#             test_name = item.get('testname')
#             process = item.get('status')
#             test_code = item.get('testcode')
#             Barcode_Id = newSample if process == 'Recollect' else item.get('Barcode_Id')

#             if process == "Pending":
#                 print("Mudunchu.........")
#                 continue
            
#             print("sample =-----",Barcode_Id)

#             # Validate required fields
#             if not test_name or not process or not test_code or not Barcode_Id:
#                 return JsonResponse({"Error": f"Missing required fields for test: {test_name}"}, status=400)

#             service_status = 'Completed' if process == 'Received' else 'Recollect'

#             cursor.execute("""
#                 UPDATE Billing_Item_Table_for_lab
#                 SET Service_Status = %s, UpdatedAt = %s, Barcode_Id = %s
#                 WHERE Billing_Invoice = %s AND Test_Code = %s
#             """, (service_status, datetime.now(), Barcode_Id, billing_invoice_id, test_code))
#             print(f"Updated Billing_Item_Table_for_lab: {test_code} to {service_status}")

#             cursor.execute("""
#                 UPDATE Sample_Capture_in_Phelobotomist
#                 SET Status = %s, UpdatedAt = %s
#                 WHERE Billing_Invoice = %s AND Test_Code = %s
#             """, (service_status, datetime.now(), billing_invoice_id, test_code))
#             print(f"Updated Sample_Capture_in_Phelobotomist: {test_code} to {service_status}")

#             if process == 'Received':
#                 print("arambikalangala...")
#                 samplebarcode = item.get('Barcode_Id')
#                 patient_id = item.get('Patient_Id')
#                 test_name = item.get('testname')
#                 test_code = item.get('testcode')
#                 sampletype = item.get('Specimen_Name')
#                 Sub_Department = item.get('Departmentname')
#                 patient_name = item.get('Patient_Name')
#                 Age = item.get('Age')
#                 Gender = item.get('Gender')
#                 dob = item.get('DOB')
#                 location = item.get('Location_Name')

#                 cursor.execute("""
#                     SELECT Assay_Code FROM Test_Descriptions
#                     WHERE Test_Code = %s
#                 """, (test_code,))
#                 result = cursor.fetchone()
#                 assaycodedata = result[0] if result else None

#                 # Validate samplebarcode
#                 if not samplebarcode:
#                     return JsonResponse({"Error": f"Sample barcode is missing for test: {test_name}"}, status=400)

#                 # First check if the data already exists
#                 cursor.execute("""
#                     SELECT COUNT(*) FROM Patient_Lab_Testorder 
#                     WHERE samplebarcode = %s AND patientid = %s AND testcode = %s
#                 """, (samplebarcode, patient_id, test_code))
                
#                 exists = cursor.fetchone()[0]

#                 print("Exists----------",exists)
#                 # If it doesn't exist, then insert
#                 if exists == 0:
#                     cursor.execute("""
#                         INSERT INTO Patient_Lab_Testorder 
#                         (samplebarcode, patientid, testname, testcode, Assay_Code,sampletype, department, patientname, dateofbirth, age, gender, status, Location, updatedat, createdat)
#                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#                     """, (
#                         samplebarcode, patient_id, test_name, test_code,assaycodedata, sampletype,
#                         Sub_Department, patient_name, dob, Age, Gender, 0, location,
#                         datetime.now(), datetime.now()
#                     ))

#                 cursor.execute("""
#                     SELECT COUNT(*) FROM his_patientorder 
#                     WHERE HIS_LABID = %s AND HIS_PATIENTID = %s AND HIS_TESTNO = %s
#                 """, (samplebarcode, patient_id, test_code))
                
#                 exists = cursor.fetchone()[0]

#                 print("his_patientorder----------",exists)
#                 # If it doesn't exist, then insert
#                 # if exists == 0:

#                 #     cursor.execute("""
#                 #     INSERT INTO his_patientorder ( HIS_LABID, HIS_PATIENTID, HIS_PNAME, HIS_PAGE, HIS_PSEX, HIS_MACHID, HIS_MACHTESTID, HIS_TESTNO,
#                 #                    HIS_TESTNAME, HIS_SAMPLENAME, HIS_STATUS)
#                 #     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
#                 #     """,( samplebarcode, patient_id, patient_name, Age, Gender, "XL200", assaycodedata, test_code, test_name,
#                 #          sampletype, 0 ))

#                 if exists == 0:
#                     cursor.execute("""SELECT sub_department_id FROM Test_Descriptions
#                         WHERE Test_Code = %s""", (test_code,))
#                     result = cursor.fetchone()
#                     department = result[0] if result else None
 
 
#                     if department== "LSDC000007":
#                         cursor.execute("""
#                         INSERT INTO his_patientorder ( HIS_LABID, HIS_PATIENTID, HIS_PNAME, HIS_PAGE, HIS_PSEX, HIS_MACHID, HIS_MACHTESTID, HIS_TESTNO,
#                                     HIS_TESTNAME, HIS_SAMPLENAME, HIS_STATUS)
#                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
#                         """,( samplebarcode, patient_id, patient_name, Age, Gender, "SPC501", assaycodedata, test_code, test_name,
#                             sampletype, 0 ))
 
 
#         db.commit()
#         print("Data inserted into another table successfully.")
#         return JsonResponse({"success": "Data inserted into another table."})

#     except Exception as e:
#         print("Error:", str(e))
#         return JsonResponse({"Error": str(e)}, status=500)


#################################################################above code current serer code#############################





@csrf_exempt
def get_sample_and_report_status(request):
    if request.method == 'GET':
        try:
            invoice = request.GET.get('Billinginvoice')

            if not invoice:
                return JsonResponse({"error": "Missing Billinginvoice in request"}, status=400)

            
            cursor = db.cursor()
            cursor.execute("""
                SELECT bi.Billing_Invoice, bi.Patient_Id, bi.Patient_Name, bi.Capture_Sample_Status,
                       bi.Analyze_Status, bi.Verify_Status, bi.Approve_Status, bit.Service_Status
                FROM Billing_invoice_and_bill_amount bi
                JOIN Billing_Item_Table_for_lab bit ON bi.Billing_Invoice = bit.Billing_Invoice
                WHERE bi.Billing_Invoice = %s
            """, (invoice,))

            rows = cursor.fetchall()

            if rows:
                data = [{
                    'Billing_Invoice': row[0],
                    'Patient_Id': row[1],
                    'Patient_Name': row[2],
                    'Capture_Sample_Status': row[3],
                    'Analyze_Status': row[4],
                    'Verify_Status': row[5],
                    'Approve_Status': row[6],
                    'Service_Status': row[7]
                } for row in rows]

                return JsonResponse({"data": data}, safe=False, status=200)
            else:
                return JsonResponse({"error": "No data found for the given Billinginvoice"}, status=404)

        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
        finally:  
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)



from django.http import JsonResponse
from django.db import connection

def get_sample_completed_list(request):
    if request.method != 'GET':
        return JsonResponse({"Error": "Invalid request method. Only GET is allowed."})

    invoice = request.GET.get('Billinginvoice')
    location = request.GET.get('Location', 'ALL')
    gender = request.GET.get('gender')
    age = request.GET.get('age')
    timeperiod = request.GET.get('timeperiod')
    department_codes = request.GET.get('Department')
    print("Department",department_codes)

    if not invoice:
        return JsonResponse({"Error": "Billing invoice parameter is missing."})
    
    department_names = []
    if department_codes:
        department_codes_list = department_codes.split(',')
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT SubDepartment_Name
                FROM SubLab_Department_Detials
                WHERE SubDepartment_Code IN %s
                """,
                [tuple(department_codes_list)]
            )
            department_names = [row[0] for row in cursor.fetchall()]
        if not department_names:
            return JsonResponse({'error': 'No valid department codes found.'}, status=400)
    else:
        return JsonResponse({'error': 'Department parameter is required.'}, status=400)

    try:
        location_name = Location_Detials.objects.get(Location_Id=location).Location_Name
        cursor = db.cursor()
        status = 'Completed'

        # Fetch all tests
        sql_testname = """
            SELECT DISTINCT bit.Test_Name, bit.Test_Code, bit.PackageCode, bit.Group_Name, bit.Group_Code, bit.IsSubTest, bit.SubTestCodes
                FROM Billing_Item_Table_for_lab bit
                JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
                JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
                WHERE Billing_Invoice = %s
                AND Bill_Status != "Canceled"	
                AND Service_Status = %s
                AND Analysis_Status != 'Completed'
                AND (
                    (bit.Transfer_Location = %s)
                    OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                )
                AND dept.SubDepartment_Name IN %s
            """

        cursor.execute(sql_testname, (invoice, status, location_name, location_name, tuple(department_names)))
        tests = cursor.fetchall()

        if not tests:
            return JsonResponse({"Error": "No tests found for the given invoice and status."})

        subtest_parent_map = {}
        for test in tests:
            subtest_codes = test[6]
            if subtest_codes:
                for sub_code in subtest_codes.split(','):
                    subtest_parent_map[sub_code.strip()] = test[1]

        packages = defaultdict(lambda: {
            "PackageName": "",
            "PackageCode": "",
            "Groups": defaultdict(lambda: {
                "GroupName": "",
                "GroupCode": "",
                "Tests": []
            }),
            "Tests": []
        })
        standalone_groups = defaultdict(lambda: {
            "GroupName": "",
            "GroupCode": "",
            "Tests": []
        })
        tree_data = []

        for test in tests:
            test_name, test_code, package_code, group_name, group_code, is_subtest, subtest_codes = test

            if test_code in subtest_parent_map:
                continue

            cursor.execute("SELECT Culturetest FROM Test_Descriptions WHERE Test_Code = %s", (test_code,))
            culturetest = (cursor.fetchone() or ['No'])[0]

            cursor.execute("SELECT Sub_Department_id FROM Test_Descriptions WHERE Test_Code = %s", (test_code,))
            departmenthis = (cursor.fetchone() or [None])[0]

            datalist = {"Test_Name": test_name, "Test_Code": test_code, "SubTests": []}

            if departmenthis in ['HISTOPATHOLOGY', 'MICROBIOLOGY'] or culturetest == 'Yes':
                cursor.execute("""
                    SELECT td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name, mm.Method_Name, um.Unit_Name, 
                           dept.SubDepartment_Name, asp.Medical_Remarks, asp.Technical_Remark,bit2.Barcode_Id,bit2.Patient_Id,
                            bit2.Patient_Name,rpd.DOB,rpd.Age,rpd.Gender
                    FROM Test_Descriptions td
                    LEFT JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
                    LEFT JOIN Sample_Capture_in_Phelobotomist asp ON td.Test_Code = asp.Test_Code AND Billing_Invoice = %s
                    LEFT JOIN Billing_Item_Table_for_lab  bit2 ON asp.Billing_Invoice = bit2.Billing_Invoice
                    LEFT JOIN Register_patient_Details  rpd ON asp.Patient_Id = rpd.Patient_Id
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN methods_masters mm ON td.Method_Name_id = mm.Method_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code
                    WHERE td.Test_Code = %s AND dept.SubDepartment_Name IN %s
                """, (invoice, test_code, tuple(department_names)))
                detail = cursor.fetchone()
                if detail:
                    print("sample-------",detail[9])
                    datalist.update({
                        "Container_Name": detail[2] or "N/A",
                        "Specimen_Name": detail[3] or "N/A",
                        "Method_Name": detail[4] or "N/A",
                        "UOM": detail[5] or "N/A",
                        "Departmentname": detail[6],
                        "MedicalRemarks": detail[7],
                        "TechnicalRemarks": detail[8],
                        "Barcode_Id": detail[9],
                        "Patient_Id": detail[10],
                        "Patient_Name": detail[11],
                        "DOB": detail[12],
                        "Age": detail[13],
                        "Gender": detail[14],
                    })
            else:
                cursor.execute("""
                    SELECT td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name, td.Captured_Unit,
                           asm.Gender, asm.FromAge, asm.FromAgeType, asm.Toage, asm.ToAgeType,
                           asm.From_Value, asm.To_Value, asm.PanicLow, asm.PanicHigh,
                           um.Unit_Name, asp.Medical_Remarks, asp.Technical_Remark,
                        bit2.Patient_Id,bit2.Patient_Name,bit2.Barcode_Id,rpd.DOB,rpd.Age,rpd.Gender,dept.SubDepartment_Name
                    FROM Test_Descriptions td
                    LEFT JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
                    LEFT JOIN Age_Setup_Master asm ON td.Test_Code = asm.Test_Code_id
                        AND (asm.Gender = %s OR asm.Gender = 'Both')
                        AND %s BETWEEN asm.FromAge AND asm.Toage
                        AND asm.FromAgeType = %s
                        AND asm.ToAgeType = %s
                    LEFT JOIN Sample_Capture_in_Phelobotomist asp ON td.Test_Code = asp.Test_Code 
                        AND asp.Billing_Invoice = %s
                    LEFT JOIN Billing_Item_Table_for_lab  bit2 ON asp.Billing_Invoice = bit2.Billing_Invoice
                    LEFT JOIN Register_patient_Details  rpd ON asp.Patient_Id = rpd.Patient_Id
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code
                    WHERE td.Test_Code = %s AND dept.SubDepartment_Name IN %s
                """, (gender, age, timeperiod, timeperiod, invoice, test_code, tuple(department_names)))
                detail = cursor.fetchone()
                if detail:
                    print("sample-------",detail[19])
                    datalist.update({
                        "Container_Name": detail[2] or "N/A",
                        "Specimen_Name": detail[3] or "N/A",
                        "Captured_Unit": detail[4],
                        "FromAge": detail[6],
                        "FromAgeType": detail[7],
                        "ToAge": detail[8],
                        "ToAgeType": detail[9],
                        "From_Value": detail[10],
                        "To_Value": detail[11],
                        "PanicLow": detail[12],
                        "PanicHigh": detail[13],
                        "UOM": detail[14] or "N/A",
                        "MedicalRemarks": detail[15],
                        "TechnicalRemarks": detail[16],
                        "Patient_Id": detail[17],
                        "Patient_Name": detail[18],
                        "Barcode_Id": detail[19],
                        "DOB": detail[20],
                        "Age": detail[21],
                        "Gender": detail[22],
                        "Departmentname": detail[23],
                        "Location_Name": location_name,
                    })

            # Handle subtests
            if subtest_codes:
                for sub_code in subtest_codes.split(','):
                    sub_code = sub_code.strip()
                    cursor.execute("""
                        SELECT td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name, 
                               td.Captured_Unit, um.Unit_Name, td.Department_id, td.Input_Type, td.sub_department_id
                        FROM Test_Descriptions td
                        LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code
                        LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                        LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code
                        WHERE Test_Code = %s AND td.sub_department_id IN %s
                    """, (sub_code, tuple(department_names)))
                    sub = cursor.fetchone()
                    if sub:
                        datalist["SubTests"].append({
                            "Test_Name": sub[0],
                            "Test_Code": sub[1],
                            "Container_Name": sub[2],
                            "Specimen_Name": sub[3],
                            "Captured_Unit": sub[4],
                            "UOM": sub[5],
                            "Department": sub[6],
                            "Input_Type": sub[7],
                            "Sub_Department": sub[8],
                        })

            # Organize the test into package/group/standalone structure
            if package_code:
                cursor.execute("SELECT package_name FROM OfferPackage WHERE package_code = %s", (package_code,))
                package_name = cursor.fetchone()
                packages[package_code]["PackageName"] = package_name[0] if package_name else "Unknown Package"
                packages[package_code]["PackageCode"] = package_code
                if group_name:
                    packages[package_code]["Groups"][group_code]["GroupName"] = group_name
                    packages[package_code]["Groups"][group_code]["GroupCode"] = group_code
                    packages[package_code]["Groups"][group_code]["Tests"].append(datalist)
                else:
                    packages[package_code]["Tests"].append(datalist)
            elif group_name:
                standalone_groups[group_code]["GroupName"] = group_name
                standalone_groups[group_code]["GroupCode"] = group_code
                standalone_groups[group_code]["Tests"].append(datalist)
            else:
                tree_data.append(datalist)

        # Add packages and groups to the tree
        for pkg in packages.values():
            tree_data.append({
                "PackageName": pkg["PackageName"],
                "PackageCode": pkg["PackageCode"],
                "Groups": list(pkg["Groups"].values()),
                "Tests": pkg["Tests"]
            })

        for group in standalone_groups.values():
            tree_data.append({
                "GroupName": group["GroupName"],
                "GroupCode": group["GroupCode"],
                "Tests": group["Tests"]
            })

        return JsonResponse(tree_data, safe=False)

    except Exception as er:
        print('Error:', str(er))
        return JsonResponse({"Error": str(er)}, status=500)
    finally:
        
        cursor.close()
        db.close()
        


@csrf_exempt
def update_report_sample_status_senior(request):
    if request.method != 'POST':
        return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)
    
    try:
        test_records = json.loads(request.body)  # Expecting a list of dictionaries

        if not test_records or not isinstance(test_records, list) or not test_records[0]:
            return JsonResponse({"Error": "Invalid data format. A list of records is expected."}, status=400)

        # Assuming the Billing_Invoice is the same for all records, so we take it from the first one
        billing_invoice_id = test_records[0].get('Billing_Invoice')
        if not billing_invoice_id:
            return JsonResponse({"Error": "Billing_Invoice is required in the records."}, status=400)

        all_approved = True
        cursor = db.cursor()
        # with get_db_connection() as db:
        #     cursor = db.cursor()

        for item in test_records:
            test_name = item.get('testname')
            process_status = item.get('status')
            service_status = 'Completed' if process_status == 'Approved' else 'Recollect'
            if process_status != 'Approved':
                all_approved = False
            # Update service status in Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab
                SET Service_Status = %s,  Analysis_Status = %s,UpdatedAt = %s 
                WHERE Billing_Invoice = %s AND Test_Name = %s
            """, [service_status, service_status, datetime.now(), billing_invoice_id, test_name])
            
            # Update status in Sample_Capture_in_Phelobotomist
            cursor.execute("""
                UPDATE Sample_Capture_in_Phelobotomist
                SET Status = %s, UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Name = %s
            """, [service_status,datetime.now(), billing_invoice_id, test_name])
            
        # Update overall status in Billing_invoice_and_bill_amount
        overall_status = 'Completed' if all_approved else 'Recollect'
        cursor.execute("""
            UPDATE Billing_invoice_and_bill_amount
            SET Capture_Sample_Status = %s, Analyze_Status = %s, UpdatedAt = %s
            WHERE Billing_Invoice = %s
        """, [overall_status, overall_status, datetime.now(), billing_invoice_id])    
        db.commit()
        return JsonResponse({"Success": "Statuses updated accordingly."})

    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500)    





@csrf_exempt
def update_report_sample_status_pathologist(request):
    if request.method != 'POST':
        return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)
    
    try:
        test_records = json.loads(request.body)  # Expecting a list of dictionaries

        if not test_records or not isinstance(test_records, list) or not test_records[0]:
            return JsonResponse({"Error": "Invalid data format. A list of records is expected."}, status=400)

        # Assuming the Billing_Invoice is the same for all records, so we take it from the first one
        billing_invoice_id = test_records[0].get('Billing_Invoice')
        if not billing_invoice_id:
            return JsonResponse({"Error": "Billing_Invoice is required in the records."}, status=400)

        all_approved = True
        cursor = db.cursor()
        # with get_db_connection() as db:
        #     cursor = db.cursor()
        newSample = get_invoice_master_barcode()
        print("-------------SAMPLE----------------",newSample)

        for item in test_records:

            test_name = item.get('testname')
            process_status = item.get('status')
            service_status = 'Completed' if process_status == 'Approved' else 'Recollect'
            barcode = item.get('barcode') if process_status == 'Approved' else newSample
            if process_status != 'Approved':
                all_approved = False
            # Update service status in Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab
                SET Service_Status = %s,  Analysis_Status = %s, Verify_Status = %s, UpdatedAt = %s, Barcode_Id = %s
                WHERE Billing_Invoice = %s AND Test_Name = %s
            """, [service_status, service_status, service_status, datetime.now(), barcode, billing_invoice_id, test_name])
            
            # Update status in Sample_Capture_in_Phelobotomist
            cursor.execute("""
                UPDATE Sample_Capture_in_Phelobotomist
                SET Status = %s, UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Name = %s
            """, [service_status,datetime.now(), billing_invoice_id, test_name])
        
        # Update overall status in Billing_invoice_and_bill_amount
        overall_status = 'Completed' if all_approved else 'Recollect'
        cursor.execute("""
            UPDATE Billing_invoice_and_bill_amount
            SET Capture_Sample_Status = %s, Analyze_Status = %s, Verify_Status = %s, UpdatedAt = %s, Barcode_Id = %s
            WHERE Billing_Invoice = %s
        """, [overall_status, overall_status, overall_status,datetime.now(), barcode, billing_invoice_id])    
        db.commit()
        
        return JsonResponse({"Success": "Statuses updated accordingly."})

    except Exception as e:
        print(e)
        return JsonResponse({"Error": str(e)}, status=500)    
    




@csrf_exempt
def get_sample_list(request):
    if request.method == 'GET':
       
        try:
            
            cursor = db.cursor()
  # Ensure this matches your URL query parameter name

            sql_query = """
                SELECT Patient_Id, Patient_Name, Billing_Invoice, Test_Name, Captured_Unit, Status, Medical_Remarks, Technical_Remark, UOM 
                FROM Sample_Capture_in_Phelobotomist
                WHERE Status = 'Completed'
            """
            # Ensure you pass a tuple as the second argument to cursor.execute, even if it's a single value
            cursor.execute(sql_query, )

            records = cursor.fetchall()

            sample_completed_data = []
            for record in records:
                sample_complete_record = {
                    'Patient_Id': record[0],
                    'Patient_Name': record[1].upper(),
                    'Billing_Invoice': record[2],
                    'Test_Name': record[3],
                    'Captured_Unit': record[4],
                    'Status': record[5],
                    'Medical_Remarks': record[6],
                    'Technical_Remark': record[7],
                    'UOM' : record[8]
                }
                
                sample_completed_data.append(sample_complete_record)

            return JsonResponse(sample_completed_data, safe=False)  # Use safe=False to allow serialization of non-dict objects

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)

        finally:
            # Ensure cursor and db connection are properly closed
            if cursor:
                cursor.close()
            if db:
                db.close()

    else:
        return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)
    

import qrcode
from io import BytesIO


@csrf_exempt
def get_qrcode_image(request):
    if request.method == 'GET':
        try:
            qr_value = request.GET.get('qrValue')

            if not qr_value:
                return JsonResponse({"error": "QR code value is required"}, status=400)

            # Generate the QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_value)
            qr.make(fit=True)

            # Create an image from the QR Code instance
            img = qr.make_image(fill_color="black", back_color="white")

            # Save the QR code image to a BytesIO object
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            
            # Encode the image to base64
            buffer.seek(0)
            img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
            img_data_url = f"data:image/png;base64,{img_str}"

            return JsonResponse({"qrImage": img_data_url})

        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
        
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."},status=405)
        
        
@csrf_exempt
def getmachineinterfaceresult(request):
    if request.method == 'GET':
        try:
            sampleid = request.GET.get('sampleid')
            if not sampleid:
                return JsonResponse({'error': 'Missing sampleid parameter'}, status=400)

            with connection.cursor() as cursor:
                # Fetch raw machine results
                sql_query = """
                    SELECT * FROM LIS_MACHINERESULT
                    WHERE LIS_LABID = %s AND LIS_RPREVIEW = 0
                """
                cursor.execute(sql_query, (sampleid,))
                records = cursor.fetchall()

                if not records:
                    return JsonResponse([], safe=False)

                machineresult_data = []

                for record in records:
                    assaycode = record[6] if record[6] else ""
                    print(assaycode,"erererer")
                    # Fetch corresponding test code using assay code
                    cursor.execute("SELECT Test_Code FROM Test_Descriptions WHERE Assay_Code = %s", (assaycode,))
                    test_code_row = cursor.fetchone()
                    test_code = test_code_row[0] if test_code_row else None
                    print(test_code,"yuuyuyyuy")

                    machine_complete_record = {
                        'LIS_ID': record[0],
                        'LIS_MACHNAME': record[1],
                        'LIS_MACHID': record[2],
                        'LIS_LABID': record[3],
                        'LIS_SAMPLENO': record[4],
                        'LIS_Test_Code': record[5], 
                        'LIS_MACHTESTID': test_code,
                        'LIS_MACHRESULTS': record[7],
                        'LIS_ALARAM': record[8],
                        'LIS_UNITS': record[9],
                        'LIS_REFERENCE': record[10],
                        'LIS_RESFLAG': record[11],
                        'LIS_TESTDEPT': record[12],
                        'LIS_RPREVIEW': record[13],
                        'LIS_CREATEDDTTM': str(record[14]) if record[14] else "",
                        'IsProcessed': record[15],
                        'Processed_At': str(record[16]) if record[16] else "",
                    }

                    machineresult_data.append(machine_complete_record)

                return JsonResponse(machineresult_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)




# @csrf_exempt
# def getmachineinterfaceresult(request):
#     if request.method == 'GET':
       
#         try:
            
#             cursor = db.cursor()
#             sampleid=request.GET.get('sampleid')
#   # Ensure this matches your URL query parameter name

#             sql_query = """
#                 SELECT * FROM LIS_MACHINERESULT
#                 WHERE LIS_SAMPLENO=%s AND IsProcessed = 0
#             """
#             # Ensure you pass a tuple as the second argument to cursor.execute, even if it's a single value
#             cursor.execute(sql_query,(sampleid,) )

#             records = cursor.fetchall()

#             machineresult_data = []
#             for record in records:
#                 machine_complete_record = {
#                     'LIS_ID': record[0],
#                     'LIS_MACHNAME': record[1],
#                     'LIS_MACHID': record[2],
#                     'LIS_LABID': record[3],
#                     'LIS_SAMPLENO': record[4],
#                     'LIS_MACHTESTID': record[5],
#                     'LIS_MACHRESULTS': record[6],
#                     'LIS_ALARAM': record[7],
#                     'LIS_UNITS' : record[8],
#                     'LIS_REFERENCE':record[9],
#                     'LIS_RESFLAG':record[10],
#                     'LIS_TESTDEPT':record[11],
#                     'LIS_RPREVIEW':record[12],
#                     'LIS_CREATEDDTTM':record[13],
#                     'IsProcessed':record[14],
#                     'Processed_At':record[15],
#                 }
                
#                 machineresult_data.append(machine_complete_record)

#             return JsonResponse(machineresult_data, safe=False)  # Use safe=False to allow serialization of non-dict objects

#         except Exception as e:
#             print(f"An error occurred: {e}")
#             return JsonResponse({'error': str(e)}, status=500)

#         finally:
#             # Ensure cursor and db connection are properly closed
#             if cursor:
#                 cursor.close()
#             if db:
#                 db.close()

#     else:
#         return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)
        



        
# @csrf_exempt
# def update_biochemistry(request):
#     if request.method == 'POST':
        
#         try:
            
#             cursor = db.cursor()

#             try:
#                 data = json.loads(request.body)
#             except json.JSONDecodeError:
#                 return JsonResponse({'error': 'Invalid JSON'}, status=400)

#             # Ensure data is a list
#             if not isinstance(data, list):
#                 data = [data]

#             for biodata in data:
#                 testcode = biodata.get("testcode")
#                 invoice = biodata.get("invoice")
#                 capturevalue = biodata.get("Capture_Value")
#                 reference_range = biodata.get("ReferenceRange")
#                 method_name = biodata.get("Method_Name")
#                 uom = biodata.get("UOM")
#                 patient_id = biodata.get("Patient_Id")
#                 visit_id = biodata.get("Visit_Id")
#                 now = datetime.now()

#                 cursor.execute("""
#                     SELECT Test_Code 
#                     FROM Approve_Test_Pathologist 
#                     WHERE Patient_Id = %s 
#                     AND Visit_Id = %s 
#                     AND Billing_Invoice = %s 
#                     AND Test_Code = %s
#                 """, (patient_id, visit_id, invoice, testcode))

#                 Change = cursor.fetchone()

#                 print("Change-doctor------------->>", Change)

#                 if Change:
#                     update_query = """
#                         UPDATE Approve_Test_Pathologist 
#                         SET Capture_Value = %s,
#                             Reference_Range = %s,
#                             Method = %s,
#                             uom = %s,
#                             UpdatedAt = %s
#                         WHERE Patient_Id = %s 
#                         AND Visit_Id = %s 
#                         AND Billing_Invoice = %s 
#                         AND Test_Code = %s
#                     """
#                     cursor.execute(update_query, (
#                         capturevalue,
#                         reference_range,
#                         method_name,
#                         uom,
#                         now,
#                         patient_id,
#                         visit_id,
#                         invoice,
#                         testcode
#                     ))

#                 cursor.execute("""
#                     SELECT Test_Code 
#                     FROM AnalyseInvestigationSenior 
#                     WHERE Patient_Id = %s 
#                     AND Visit_Id = %s 
#                     AND Billing_Invoice = %s 
#                     AND Test_Code = %s
#                 """, (patient_id, visit_id, invoice, testcode))

#                 Change = cursor.fetchone()

#                 print("Change-senior------------->>", Change)
#                 if Change:
#                     update_query = """
#                         UPDATE AnalyseInvestigationSenior 
#                         SET Capture_Value = %s,
#                             Reference_Range = %s,
#                             Method = %s,
#                             uom = %s,
#                             UpdatedAt = %s
#                         WHERE Patient_Id = %s 
#                         AND Visit_Id = %s 
#                         AND Billing_Invoice = %s 
#                         AND Test_Code = %s
#                     """
#                     cursor.execute(update_query, (
#                         capturevalue,
#                         reference_range,
#                         method_name,
#                         uom,
#                         now,
#                         patient_id,
#                         visit_id,
#                         invoice,
#                         testcode
#                     ))
#                 cursor.execute("""
#                     SELECT Test_Code 
#                     FROM AnalyseInvestigationResult 
#                     WHERE Patient_Id = %s 
#                     AND Visit_Id = %s 
#                     AND Billing_Invoice = %s 
#                     AND Test_Code = %s
#                 """, (patient_id, visit_id, invoice, testcode))

#                 Change = cursor.fetchone()

#                 print("Change-result------------->>", Change)
#                 if Change:
#                     update_query = """
#                         UPDATE AnalyseInvestigationResult 
#                         SET Capture_Value = %s,
#                             Reference_Range = %s,
#                             Method = %s,
#                             uom = %s,
#                             UpdatedAt = %s
#                         WHERE Patient_Id = %s 
#                         AND Visit_Id = %s 
#                         AND Billing_Invoice = %s 
#                         AND Test_Code = %s
#                     """
#                     cursor.execute(update_query, (
#                         capturevalue,
#                         reference_range,
#                         method_name,
#                         uom,
#                         now,
#                         patient_id,
#                         visit_id,
#                         invoice,
#                         testcode
#                     ))

#             db.commit()
#             return JsonResponse({"status": "Successfully updated"})

#         except Exception as e:
#             print(f"An error occurred: {e}")
#             return JsonResponse({'error': str(e)}, status=500)

#         finally:
#             if cursor:
#                 cursor.close()
#             if db:
#                 db.close()



        
@csrf_exempt
def update_biochemistry(request):
    if request.method == 'POST':
        
        try:
            
            cursor = db.cursor()

            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)

            # Ensure data is a list
            if not isinstance(data, list):
                data = [data]

            for biodata in data:
                testcode = biodata.get("testcode")
                invoice = biodata.get("invoice")
                capturevalue = biodata.get("Capture_Value")
                reference_range = biodata.get("ReferenceRange")
                method_name = biodata.get("Method_Name")
                uom = biodata.get("UOM")
                patient_id = biodata.get("Patient_Id")
                visit_id = biodata.get("Visit_Id")
                now = datetime.now()

                cursor.execute("""
                    SELECT Test_Code 
                    FROM Approve_Test_Pathologist 
                    WHERE Patient_Id = %s 
                    AND Visit_Id = %s 
                    AND Billing_Invoice = %s 
                    AND Test_Code = %s
                """, (patient_id, visit_id, invoice, testcode))

                Change = cursor.fetchone()

                print("Change-doctor------------->>", Change)

                if Change:
                    isEdit = """UPDATE Billing_invoice_and_bill_amount 
                                SET isEdit = %s
                                WHERE Billing_Invoice = %s AND Patient_Id = %s"""
                    cursor.execute(isEdit, (True, invoice, patient_id))
                    update_query = """
                        UPDATE Approve_Test_Pathologist 
                        SET Capture_Value = %s,
                            Reference_Range = %s,
                            Method = %s,
                            uom = %s,
                            UpdatedAt = %s
                        WHERE Patient_Id = %s 
                        AND Visit_Id = %s 
                        AND Billing_Invoice = %s 
                        AND Test_Code = %s
                    """
                    cursor.execute(update_query, (
                        capturevalue,
                        reference_range,
                        method_name,
                        uom,
                        now,
                        patient_id,
                        visit_id,
                        invoice,
                        testcode
                    ))

                cursor.execute("""
                    SELECT Test_Code 
                    FROM AnalyseInvestigationSenior 
                    WHERE Patient_Id = %s 
                    AND Visit_Id = %s 
                    AND Billing_Invoice = %s 
                    AND Test_Code = %s
                """, (patient_id, visit_id, invoice, testcode))

                Change = cursor.fetchone()

                print("Change-senior------------->>", Change)
                if Change:
                    update_query = """
                        UPDATE AnalyseInvestigationSenior 
                        SET Capture_Value = %s,
                            Reference_Range = %s,
                            Method = %s,
                            uom = %s,
                            UpdatedAt = %s
                        WHERE Patient_Id = %s 
                        AND Visit_Id = %s 
                        AND Billing_Invoice = %s 
                        AND Test_Code = %s
                    """
                    cursor.execute(update_query, (
                        capturevalue,
                        reference_range,
                        method_name,
                        uom,
                        now,
                        patient_id,
                        visit_id,
                        invoice,
                        testcode
                    ))
                cursor.execute("""
                    SELECT Test_Code 
                    FROM AnalyseInvestigationResult 
                    WHERE Patient_Id = %s 
                    AND Visit_Id = %s 
                    AND Billing_Invoice = %s 
                    AND Test_Code = %s
                """, (patient_id, visit_id, invoice, testcode))

                Change = cursor.fetchone()

                print("Change-result------------->>", Change)
                if Change:
                    update_query = """
                        UPDATE AnalyseInvestigationResult 
                        SET Capture_Value = %s,
                            Reference_Range = %s,
                            Method = %s,
                            uom = %s,
                            UpdatedAt = %s
                        WHERE Patient_Id = %s 
                        AND Visit_Id = %s 
                        AND Billing_Invoice = %s 
                        AND Test_Code = %s
                    """
                    cursor.execute(update_query, (
                        capturevalue,
                        reference_range,
                        method_name,
                        uom,
                        now,
                        patient_id,
                        visit_id,
                        invoice,
                        testcode
                    ))
                    

            db.commit()
            return JsonResponse({"status": "Successfully updated"})

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)

        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()



   
@csrf_exempt
def insert_bulk_sample_capture(request):
   
    try:
       
        cursor = db.cursor()
 
        data = json.loads(request.body)
        print("=========>>>",len(data))
        location = data.get('location')  
        location = Location_Detials.objects.get(Location_Id = location).Location_Name
        createdby = data.get('createdBy')
        data = data.get('data')
        for item in data:
            patient_id = item.get('Patient_Id')
            patient_name = item.get('Patient_Name')
            captured_unit = item.get('Captured_Unit',"")
            medical_remarks = item.get('medicalRemark',"")
            technical_remarks = item.get('technicalRemark',"")
            invoice = item.get('Billing_Invoice')
            status = item.get('status')
            uom = item.get('uom',"")
            visitid = item.get('Visit_Id')
            samplebarcode = item.get('Barcode')
            sampletype = item.get('Specimen_Name',"")
            Sub_Department = item.get('Sub_Department',"")
            Age = item.get('Age')
            Gender = item.get('Gender')
            Tests = item.get('Service_Statuses')
           
            for test in Tests:
                test_name = test.get('testname')
                test_code = test.get('testcode')
               
                cursor.execute("SELECT COALESCE(MAX(Sample_Id), 0) + 1 FROM Sample_Capture_in_Phelobotomist")
                next_id = cursor.fetchone()[0]
 
                # Insert new record
                cursor.execute("""
                    INSERT INTO Sample_Capture_in_Phelobotomist
                    (Sample_Id, Patient_Id, Patient_Name, Billing_Invoice, Test_Name, Captured_Unit,
                    Status, Medical_Remarks, Technical_Remark, UOM, Location, Visit_Id, CreatedBy, Test_Code, Transfer_Location,UpdatedAt, CreatedAt)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (next_id, patient_id, patient_name, invoice, test_name, captured_unit, status,
                      medical_remarks, technical_remarks, uom, "", visitid, createdby, test_code,
                      "",datetime.now(), datetime.now()))
               
                cursor.execute("""
                    UPDATE Billing_invoice_and_bill_amount
                    SET Capture_Sample_Status = %s ,UpdatedAt =%s
                    WHERE Billing_Invoice = %s AND Patient_Id = %s
                """, ('Completed',datetime.now(), invoice, patient_id))
               
                cursor.execute("""
                    UPDATE Billing_Item_Table_for_lab
                    SET Service_Status = %s, UpdatedAt =%s
                    WHERE Billing_Invoice = %s AND Test_Code = %s
                """, ('Completed',datetime.now(), invoice, test_code))
           
            db.commit()
 
        return JsonResponse({"success": "Operation completed successfully."})
 
    except Exception as e:
        print('Error:', str(e))
        if db:
            db.rollback()
        return JsonResponse({"error": str(e)}, status=400)
   
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
 
 